/* React-Kontext für das Freundes-System.

   Zustand: Freundesliste, offene Anfragen, Anwesenheit und der eigene Code.
   Alles davon lebt ausschließlich, wenn es ein Cloud-Konto gibt UND die
   E-Mail bestätigt ist. Ohne firebase-config.json oder ohne Anmeldung ist
   der Provider vollständig untätig: keine Listener, kein Intervall, keine
   Netzwerkzugriffe – `available` bleibt false und die UI blendet sich aus.

   Die Lebenszeichen (heartbeat) laufen nur, solange der Tab sichtbar ist.
   Wer den Tab wegklickt, gilt nach PRESENCE_TIMEOUT_MS automatisch als
   offline – ohne dass dafür ein Abmelden nötig wäre. */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useCloud } from '../cloud/CloudProvider';
import { useAppState } from '../../state/AppState';
import {
  acceptRequest,
  cancelRequest,
  clearPresence,
  declineRequest,
  heartbeat,
  publishCode,
  removeFriend,
  sendRequest as sendRequestRemote,
  socialAvailable,
  watchFriends,
  watchPresence,
  watchRequests,
  type SendResult,
  type SocialResult,
} from './friends';
import {
  HEARTBEAT_INTERVAL_MS,
  countOnline,
  friendCodeFor,
  pendingRequests,
  sortFriends,
  sortRequests,
  withPresence,
  type FriendEntry,
  type RequestEntry,
} from './protocol';

/** Wie oft die Online-Anzeige neu bewertet wird (rein lokal, kein Netz). */
const TICK_MS = 20_000;

interface SocialValue {
  /** Freundesfunktionen nutzbar? (Cloud konfiguriert + angemeldet + bestätigt) */
  available: boolean;
  /** Freunde, online zuerst, dann alphabetisch. */
  friends: FriendEntry[];
  /** Eingehende Anfragen (annehmen/ablehnen). */
  requests: RequestEntry[];
  /** Eigene, noch offene Anfragen. */
  outgoing: RequestEntry[];
  /** Anzahl der gerade erreichbaren Freunde (grüner Punkt). */
  onlineCount: number;
  /** Der eigene Code zum Weitergeben, Format XXXX-XXXX. */
  myCode: string;
  /** Eine Aktion läuft gerade (Knöpfe sperren). */
  busy: boolean;
  sendRequest: (code: string) => Promise<SendResult>;
  accept: (req: RequestEntry) => Promise<SocialResult>;
  decline: (req: RequestEntry) => Promise<SocialResult>;
  cancel: (req: RequestEntry) => Promise<SocialResult>;
  remove: (friend: FriendEntry) => Promise<SocialResult>;
}

const OFFLINE_RESULT: SocialResult = { ok: false, reason: 'unavailable' };

const Ctx = createContext<SocialValue | null>(null);

export function SocialProvider({ children }: { children: ReactNode }) {
  const cloud = useCloud();
  const { data } = useAppState();

  // Nur mit bestätigter E-Mail: Die Sicherheitsregeln verlangen es, und
  // unbestätigte Konten sollen niemanden anschreiben können.
  const uid = cloud.phase === 'ready' && cloud.user?.verified ? cloud.user.uid : null;
  // Anzeigename für andere – niemals die E-Mail-Adresse.
  const myName = (cloud.user?.name || data.name || '').slice(0, 40);
  const myNameRef = useRef(myName);
  myNameRef.current = myName;

  const [cloudReady, setCloudReady] = useState(false);
  const [rawFriends, setRawFriends] = useState<FriendEntry[]>([]);
  const [rawRequests, setRawRequests] = useState<RequestEntry[]>([]);
  const [presence, setPresence] = useState<Record<string, number | null>>({});
  const [now, setNow] = useState(() => Date.now());
  const [busy, setBusy] = useState(false);

  const myCode = useMemo(() => (uid ? friendCodeFor(uid) : ''), [uid]);
  const available = cloudReady && uid !== null;

  /* 1. Ist überhaupt eine Cloud da? Erst danach wird irgendetwas gestartet. */
  useEffect(() => {
    if (!uid) {
      setCloudReady(false);
      return;
    }
    let alive = true;
    void socialAvailable().then((ok) => {
      if (alive) setCloudReady(ok);
    });
    return () => {
      alive = false;
    };
  }, [uid]);

  /* 2. Eigenen Code veröffentlichen, damit andere ihn einlösen können. */
  useEffect(() => {
    if (!available || !uid || !myCode) return;
    void publishCode(uid, myCode);
  }, [available, uid, myCode]);

  /* 3. Freunde und Anfragen beobachten. */
  useEffect(() => {
    if (!available || !uid) {
      setRawFriends([]);
      setRawRequests([]);
      setPresence({});
      return;
    }
    const offFriends = watchFriends(uid, setRawFriends);
    const offRequests = watchRequests(uid, setRawRequests);
    return () => {
      offFriends();
      offRequests();
    };
  }, [available, uid]);

  /* 4. Anwesenheit der Freunde beobachten. Neu abonniert wird nur, wenn sich
        die Menge der UIDs ändert – nicht bei jeder Namensänderung. */
  const friendUidKey = useMemo(
    () => rawFriends.map((f) => f.uid).sort().join(','),
    [rawFriends],
  );
  useEffect(() => {
    if (!available) return;
    const uids = friendUidKey ? friendUidKey.split(',') : [];
    if (uids.length === 0) {
      setPresence({});
      return;
    }
    return watchPresence(uids, setPresence);
  }, [available, friendUidKey]);

  /* 5. Lebenszeichen + Neubewertung der Online-Anzeige, solange der Tab
        sichtbar ist. Versteckter Tab = kein Timer, kein Schreibzugriff. */
  useEffect(() => {
    if (!available || !uid) return;
    let beat = 0;
    let tick = 0;

    const start = () => {
      if (beat || tick) return;
      void heartbeat(uid);
      setNow(Date.now());
      beat = window.setInterval(() => void heartbeat(uid), HEARTBEAT_INTERVAL_MS);
      tick = window.setInterval(() => setNow(Date.now()), TICK_MS);
    };
    const stop = () => {
      window.clearInterval(beat);
      window.clearInterval(tick);
      beat = 0;
      tick = 0;
    };
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') stop();
      else start();
    };
    // Beim Schließen des Tabs sofort abmelden (best effort – sonst greift
    // spätestens der Timeout).
    const onPageHide = () => {
      stop();
      void clearPresence(uid);
    };

    if (document.visibilityState !== 'hidden') start();
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', onPageHide);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', onPageHide);
    };
  }, [available, uid]);

  /* Abgeleitete Listen (reine Funktionen aus protocol.ts). */
  const friends = useMemo(
    () => sortFriends(withPresence(rawFriends, presence), now),
    [rawFriends, presence, now],
  );
  const onlineCount = useMemo(() => countOnline(friends, now), [friends, now]);

  const requests = useMemo(
    () => sortRequests(pendingRequests(rawRequests.filter((r) => r.direction === 'incoming'), rawFriends)),
    [rawRequests, rawFriends],
  );
  const outgoing = useMemo(() => {
    const incomingUids = new Set(requests.map((r) => r.uid));
    return sortRequests(
      pendingRequests(rawRequests.filter((r) => r.direction === 'outgoing'), rawFriends),
      // Kreuzende Anfragen tauchen nur als eingehende auf – dort gibt es den
      // Annehmen-Knopf.
    ).filter((r) => !incomingUids.has(r.uid));
  }, [rawRequests, rawFriends, requests]);

  /* Aktionen – jede meldet sauber „unavailable", statt zu werfen. */
  const guard = useCallback(
    async <T,>(fn: (uid: string) => Promise<T>, fallback: T): Promise<T> => {
      if (!available || !uid) return fallback;
      setBusy(true);
      try {
        return await fn(uid);
      } finally {
        setBusy(false);
      }
    },
    [available, uid],
  );

  const sendRequest = useCallback(
    (code: string) =>
      guard<SendResult>(
        (u) => sendRequestRemote(u, myNameRef.current, code),
        { ok: false, reason: 'unavailable' },
      ),
    [guard],
  );

  const accept = useCallback(
    (req: RequestEntry) =>
      guard((u) => acceptRequest(u, myNameRef.current, req.uid, req.name), OFFLINE_RESULT),
    [guard],
  );

  const decline = useCallback(
    (req: RequestEntry) => guard((u) => declineRequest(u, req.uid), OFFLINE_RESULT),
    [guard],
  );

  const cancel = useCallback(
    (req: RequestEntry) => guard((u) => cancelRequest(u, req.uid), OFFLINE_RESULT),
    [guard],
  );

  const remove = useCallback(
    (friend: FriendEntry) => guard((u) => removeFriend(u, friend.uid), OFFLINE_RESULT),
    [guard],
  );

  const value = useMemo<SocialValue>(
    () => ({
      available,
      friends,
      requests,
      outgoing,
      onlineCount,
      myCode,
      busy,
      sendRequest,
      accept,
      decline,
      cancel,
      remove,
    }),
    [available, friends, requests, outgoing, onlineCount, myCode, busy, sendRequest, accept, decline, cancel, remove],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/**
 * Zugriff auf das Freundes-System.
 *
 * Bewusst mit sicherem Standardwert statt Fehler: Komponenten wie das
 * Online-Abzeichen sollen auch dann funktionieren (nämlich nichts anzeigen),
 * wenn der Provider gar nicht eingehängt ist.
 */
const INERT: SocialValue = {
  available: false,
  friends: [],
  requests: [],
  outgoing: [],
  onlineCount: 0,
  myCode: '',
  busy: false,
  sendRequest: async () => ({ ok: false, reason: 'unavailable' }),
  accept: async () => OFFLINE_RESULT,
  decline: async () => OFFLINE_RESULT,
  cancel: async () => OFFLINE_RESULT,
  remove: async () => OFFLINE_RESULT,
};

export function useSocial(): SocialValue {
  return useContext(Ctx) ?? INERT;
}
