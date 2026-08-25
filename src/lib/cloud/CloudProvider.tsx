/* React-Kontext für Cloud-Konten: Auth-Status, Login/Registrierung und
   automatische Synchronisation des aktiven (verknüpften) Profils.
   Ohne firebase-config.json bleibt phase = 'unavailable' und die App
   verhält sich exakt wie vorher (reiner Geräte-Modus). */

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { sanitizeAppData, useAppState, type AppData } from '../../state/AppState';
import { useLang } from '../../i18n';
import { STR } from '../../i18n/pages/cloud';
import { describeCloudError, getCloud, type CloudHandle, type CloudUser } from './cloud';

export type CloudPhase = 'checking' | 'unavailable' | 'ready';

interface CloudValue {
  phase: CloudPhase;
  user: CloudUser | null;
  busy: boolean;
  error: string | null;
  info: string | null;
  /** Zeitpunkt der letzten erfolgreichen Synchronisation (ISO). */
  lastSync: string | null;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  resendVerification: () => Promise<void>;
  /** Prüft nach dem Klick auf den Bestätigungslink, ob die E-Mail jetzt verifiziert ist. */
  checkVerification: () => Promise<void>;
  syncNow: () => Promise<void>;
  clearMessages: () => void;
}

const Ctx = createContext<CloudValue | null>(null);

export function CloudProvider({ children }: { children: ReactNode }) {
  const { data, activeProfile, linkCloudProfile } = useAppState();
  const [phase, setPhase] = useState<CloudPhase>('checking');
  const [user, setUser] = useState<CloudUser | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);

  // Sprache für Meldungen und Firebase-Mails. Als Ref, damit die Callbacks
  // unten stabil bleiben (sie laufen erst beim Klick, dann mit aktueller Sprache).
  const { lang } = useLang();
  const langRef = useRef(lang);
  langRef.current = lang;
  const strRef = useRef(STR[lang]);
  strRef.current = STR[lang];

  const cloudRef = useRef<CloudHandle | null>(null);
  /** UID, für die der Login-Sync in dieser Sitzung schon gelaufen ist. */
  const syncedUidRef = useRef<string | null>(null);
  /** UID, für die gerade ein Erst-Sync läuft (verhindert Doppelläufe). */
  const syncInFlightRef = useRef<string | null>(null);
  const dataRef = useRef(data);
  dataRef.current = data;
  const profileRef = useRef(activeProfile);
  profileRef.current = activeProfile;
  const userRef = useRef(user);
  userRef.current = user;

  // Initialisierung + Auth-Listener
  useEffect(() => {
    let unsub: (() => void) | undefined;
    let unsubRedirectError: (() => void) | undefined;
    let cancelled = false;
    getCloud().then((handle) => {
      if (cancelled) return;
      cloudRef.current = handle;
      if (!handle) {
        setPhase('unavailable');
        return;
      }
      setPhase('ready');
      // Bestätigungs- und Passwort-Mails in der Sprache der App verschicken.
      handle.setLanguage(langRef.current);
      unsub = handle.onUser((u) => {
        setUser(u);
        if (!u) syncedUidRef.current = null;
      });
      // Rückkehr von der Google-Weiterleitung: Fehler (z. B. E-Mail bereits
      // per Passwort registriert) sind sonst spurlos – onUser feuert dann nicht.
      unsubRedirectError = handle.onRedirectError((err) => {
        setError(describeCloudError(err, langRef.current));
      });
    });
    return () => {
      cancelled = true;
      unsub?.();
      unsubRedirectError?.();
    };
  }, []);

  // Sprachwechsel im laufenden Betrieb an Firebase weiterreichen.
  useEffect(() => {
    cloudRef.current?.setLanguage(lang);
  }, [lang, phase]);

  /** Nach Login/Verifizierung: Cloud-Stand holen, Profil verknüpfen, ggf. hochladen. */
  const initialSync = useCallback(
    async (u: CloudUser) => {
      const cloud = cloudRef.current;
      if (!cloud) return;
      if (syncInFlightRef.current === u.uid) return;
      syncInFlightRef.current = u.uid;
      try {
        const raw = await cloud.pull(u.uid);
        const incoming: AppData | null = raw === null ? null : sanitizeAppData(raw);
        const { outcome, data: chosen } = linkCloudProfile(u.uid, u.name, u.email, incoming);
        if (outcome !== 'adopted-cloud') {
          // Lokaler Stand ist aktueller (oder Konto ist neu): hochladen.
          // Wichtig: den von linkCloudProfile gewählten Stand pushen, nicht
          // dataRef – der zeigt hier noch auf das vorher aktive Profil.
          await cloud.push(u.uid, u.name || u.email, u.email, chosen);
        }
        syncedUidRef.current = u.uid;
        setLastSync(new Date().toISOString());
        setInfo(
          outcome === 'adopted-cloud' ? strRef.current.infoCloudLoaded : strRef.current.infoCloudSaved,
        );
      } catch (err) {
        setError(describeCloudError(err, langRef.current));
      } finally {
        syncInFlightRef.current = null;
      }
    },
    [linkCloudProfile],
  );

  // Verifizierter Nutzer, aber noch kein Sync in dieser Sitzung → Erst-Sync.
  useEffect(() => {
    if (user && user.verified && syncedUidRef.current !== user.uid) {
      void initialSync(user);
    }
  }, [user, initialSync]);

  // Laufende Änderungen mit Verzögerung hochladen – nur für das verknüpfte Profil.
  useEffect(() => {
    const cloud = cloudRef.current;
    if (!cloud || !user || !user.verified) return;
    if (activeProfile.cloudUid !== user.uid || syncedUidRef.current !== user.uid) return;
    const t = window.setTimeout(() => {
      cloud
        .push(user.uid, user.name || user.email, user.email, data)
        .then(() => setLastSync(new Date().toISOString()))
        .catch(() => {
          // Offline o. Ä.: lokale Sicherung greift, nächster Versuch bei der nächsten Änderung.
        });
    }, 2500);
    return () => window.clearTimeout(t);
  }, [data, user, activeProfile.cloudUid]);

  // Beim Verlassen/Verstecken der Seite: letzten Stand sofort sichern.
  useEffect(() => {
    const flush = () => {
      const cloud = cloudRef.current;
      const u = userRef.current;
      if (!cloud || !u || !u.verified) return;
      if (profileRef.current.cloudUid !== u.uid || syncedUidRef.current !== u.uid) return;
      void cloud.push(u.uid, u.name || u.email, u.email, dataRef.current).catch(() => {});
    };
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flush();
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', flush);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', flush);
    };
  }, []);

  /** `successInfo` wird als Funktion übergeben, damit der Text erst beim
      Aufruf – also in der dann aktiven Sprache – erzeugt wird. */
  const wrap = useCallback(async (fn: () => Promise<void>, successInfo?: () => string): Promise<boolean> => {
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      await fn();
      if (successInfo) setInfo(successInfo());
      return true;
    } catch (err) {
      setError(describeCloudError(err, langRef.current));
      return false;
    } finally {
      setBusy(false);
    }
  }, []);

  const register = useCallback(
    (name: string, email: string, password: string) =>
      wrap(
        async () => {
          await cloudRef.current!.register(name, email, password);
        },
        () => strRef.current.infoAccountCreated,
      ),
    [wrap],
  );

  const login = useCallback(
    (email: string, password: string) =>
      wrap(async () => {
        await cloudRef.current!.login(email, password);
      }),
    [wrap],
  );

  const loginWithGoogle = useCallback(
    () =>
      wrap(async () => {
        await cloudRef.current!.loginWithGoogle();
      }),
    [wrap],
  );

  const logout = useCallback(async () => {
    await wrap(async () => {
      await cloudRef.current!.logout();
    });
  }, [wrap]);

  const resetPassword = useCallback(
    (email: string) =>
      wrap(
        async () => {
          await cloudRef.current!.resetPassword(email);
        },
        () => strRef.current.infoResetSent,
      ),
    [wrap],
  );

  const resendVerification = useCallback(async () => {
    await wrap(
      async () => {
        await cloudRef.current!.resendVerification();
      },
      () => strRef.current.infoVerificationResent,
    );
  }, [wrap]);

  const checkVerification = useCallback(async () => {
    await wrap(async () => {
      const u = await cloudRef.current!.reloadUser();
      setUser(u);
      if (u && !u.verified) {
        setInfo(strRef.current.infoNotVerifiedYet);
      }
    });
  }, [wrap]);

  const syncNow = useCallback(async () => {
    const u = userRef.current;
    if (!u || !u.verified) return;
    await wrap(
      async () => {
        if (syncedUidRef.current !== u.uid) {
          await initialSync(u);
        } else {
          await cloudRef.current!.push(u.uid, u.name || u.email, u.email, dataRef.current);
          setLastSync(new Date().toISOString());
        }
      },
      () => strRef.current.infoSynced,
    );
  }, [wrap, initialSync]);

  const clearMessages = useCallback(() => {
    setError(null);
    setInfo(null);
  }, []);

  const value: CloudValue = {
    phase,
    user,
    busy,
    error,
    info,
    lastSync,
    register,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    resendVerification,
    checkVerification,
    syncNow,
    clearMessages,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCloud(): CloudValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useCloud außerhalb des CloudProviders');
  return v;
}
