/* Cloud-Konten & Synchronisation über Firebase (Auth + Firestore).
   Das Modul ist optional: Es wird nur aktiv, wenn neben der index.html eine
   firebase-config.json liegt (siehe FIREBASE_SETUP.md). Ohne Konfiguration
   bleibt die App im reinen Geräte-Modus – der komplette Firebase-Code wird
   dann gar nicht erst geladen (dynamischer Import). */

import { pfadeZumLoeschen } from './konto';
import type { Lang } from '../../i18n';
import { sanitizeEntitlement, type Entitlement } from '../payments/provider';

export interface CloudUser {
  uid: string;
  email: string;
  name: string;
  verified: boolean;
  /** Hat das Konto ein Passwort (und nicht nur Google)? Davon hängt ab, wie man sich
   *  erneut anmeldet und ob „Passwort ändern“ etwas bedeutet. */
  passwort: boolean;
}

export interface CloudHandle {
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  /** Lädt den Nutzer neu (z. B. nachdem der Bestätigungslink geklickt wurde). */
  reloadUser: () => Promise<CloudUser | null>;
  /** Sprache für die von Firebase verschickten Mails (Bestätigung, Passwort-Reset). */
  setLanguage: (lang: Lang) => void;
  onUser: (cb: (user: CloudUser | null) => void) => () => void;
  /** Meldet mit Google an (bestehendes Konto oder neu).
      Google liefert die E-Mail bereits bestätigt – es wird keine
      Bestätigungsmail verschickt und keine muss ankommen. */
  loginWithGoogle: () => Promise<void>;
  /** Fehler aus einer zurückkommenden Google-Weiterleitung (z. B. wenn die
      E-Mail schon per Passwort registriert ist) – einmalig nach dem Neuladen. */
  onRedirectError: (cb: (err: unknown) => void) => () => void;
  /**
   * Beobachtet den Berechtigungssatz in `entitlements/{uid}`.
   *
   * Dieses Dokument schreibt ausschließlich der signaturgeprüfte
   * Zahlungs-Webhook über das Admin-SDK; die Sicherheitsregeln erlauben dem
   * Client nur Lesezugriff (siehe firestore.rules, belegt durch Regeltests).
   *
   * Gemeldet wird der ganze Satz statt nur „ja/nein": Die Herkunft entscheidet,
   * wohin eine Kündigung führen muss – wer über Apple gekauft hat, kann nur
   * über Apple kündigen.
   */
  watchEntitlement: (uid: string, cb: (e: Entitlement | null) => void) => () => void;
  /** Firebase-ID-Token des angemeldeten Nutzers – Nachweis der Identität
      gegenüber den eigenen Cloud Functions. Null, wenn niemand angemeldet
      ist. Der Server prüft es und liest die uid daraus; sie darf niemals aus
      der Anfrage selbst kommen. */
  getIdToken: () => Promise<string | null>;
  /** Konto und Cloud-Daten löschen. Meldet sich dafür erneut an — mit dem Passwort
   *  bei Konten mit Passwort, über Google sonst. */
  deleteAccount: (passwort?: string) => Promise<void>;
  /** Rohdaten aus der Cloud – der Aufrufer muss sie sanitisieren. */
  pull: (uid: string) => Promise<unknown | null>;
  push: (uid: string, name: string, email: string, data: unknown) => Promise<void>;
}

interface FirebaseConfigFile {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
  storageBucket?: string;
  messagingSenderId?: string;
}

/**
 * Warum es keine Cloud gibt — zwei Gründe, die sich anders anfühlen:
 * - `nicht-eingerichtet`: Die Konfigurationsdatei gibt es nicht (404, kein JSON,
 *   Einzeldatei-Build). Das ist eine Eigenschaft dieser Installation.
 * - `offline`: Die Datei ließ sich nicht holen (kein Netz, Serverfehler). Das
 *   ist ein Zustand, der vorbeigeht.
 */
export type CloudAusfall = 'nicht-eingerichtet' | 'offline';
let ausfall: CloudAusfall | null = null;

export function cloudAusfall(): CloudAusfall | null {
  return ausfall;
}

/** Nach einem Ausfall wegen fehlenden Netzes den nächsten Versuch zulassen. */
export function setzeCloudZurueck(): void {
  if (ausfall === 'offline') handlePromise = null;
}

async function leseConfig(): Promise<{ cfg: FirebaseConfigFile | null; ausfall: CloudAusfall | null }> {
  let res: Response;
  try {
    const url = new URL('firebase-config.json', document.baseURI).toString();
    res = await fetch(url, { cache: 'no-store' });
  } catch {
    return { cfg: null, ausfall: 'offline' };
  }
  if (res.status === 404) {
    return { cfg: null, ausfall: 'nicht-eingerichtet' };
  }
  if (!res.ok) {
    return { cfg: null, ausfall: 'offline' };
  }
  try {
    const json: unknown = await res.json();
    const cfg = json as Partial<FirebaseConfigFile> | null;
    if (
      cfg &&
      typeof cfg.apiKey === 'string' &&
      typeof cfg.authDomain === 'string' &&
      typeof cfg.projectId === 'string' &&
      typeof cfg.appId === 'string'
    ) {
      return { cfg: cfg as FirebaseConfigFile, ausfall: null };
    }
  } catch {
    /* Kein JSON — der Entwicklungsserver liefert für eine fehlende Datei die
       Startseite. Das ist „nicht eingerichtet", nicht „kein Netz". */
  }
  return { cfg: null, ausfall: 'nicht-eingerichtet' };
}

async function loadConfig(): Promise<FirebaseConfigFile | null> {
  const r = await leseConfig();
  ausfall = r.ausfall;
  return r.cfg;
}

/** Gibt es hier überhaupt eine Cloud? Ohne Nebenwirkung — der Willkommensdialog
 *  fragt das, bevor irgendetwas geladen wird: „Ich habe schon ein Konto" hat
 *  nur dort einen Sinn, wo es ein Konto geben kann. Offline gilt als „ja":
 *  Das Netz kommt wieder, die Installation bleibt eine mit Cloud. */
export async function cloudKonfiguriert(): Promise<boolean> {
  if (__SINGLE__) return false;
  return (await leseConfig()).ausfall !== 'nicht-eingerichtet';
}

/* Firebase-Fehlercodes in verständlichen Text übersetzen – in beiden Sprachen.
   Beide Tabellen müssen dieselben Schlüssel haben (TypeScript erzwingt es über
   den gemeinsamen Record-Typ). */
const ERROR_FALLBACK: Record<Lang, string> = {
  de: 'Das hat leider nicht geklappt – bitte versuche es noch einmal.',
  en: 'That did not work – please try again.',
};

const ERROR_MESSAGES: Record<Lang, Record<string, string>> = {
  de: {
    'auth/invalid-email': 'Diese E-Mail-Adresse ist ungültig.',
    'auth/email-already-in-use': 'Für diese E-Mail existiert bereits ein Konto – melde dich an.',
    'auth/weak-password': 'Das Passwort ist zu schwach (mindestens 8 Zeichen empfohlen).',
    'auth/user-not-found': 'Kein Konto mit dieser E-Mail gefunden.',
    'auth/wrong-password': 'E-Mail oder Passwort ist falsch.',
    'auth/invalid-credential': 'E-Mail oder Passwort ist falsch.',
    'auth/too-many-requests': 'Zu viele Versuche – bitte warte kurz und probiere es erneut.',
    'auth/network-request-failed': 'Keine Verbindung – prüfe dein Internet und versuche es erneut.',
    'auth/requires-recent-login': 'Bitte melde dich erneut an und versuche es dann noch einmal.',
    'auth/account-exists-with-different-credential':
      'Für diese E-Mail existiert bereits ein Konto mit Passwort – melde dich damit an.',
    'auth/operation-not-allowed': 'Diese Anmeldeart ist noch nicht aktiviert.',
    'auth/unauthorized-domain': 'Die Anmeldung ist auf dieser Adresse noch nicht freigeschaltet.',
    'auth/popup-closed-by-user': 'Anmeldung abgebrochen.',
    'permission-denied': 'Zugriff verweigert – ist deine E-Mail-Adresse schon bestätigt?',
    unavailable: 'Der Sync-Dienst ist gerade nicht erreichbar – deine Daten bleiben lokal gesichert.',
  },
  en: {
    'auth/invalid-email': 'This email address is invalid.',
    'auth/email-already-in-use': 'An account with this email already exists – please sign in.',
    'auth/weak-password': 'That password is too weak (at least 8 characters recommended).',
    'auth/user-not-found': 'No account found for this email.',
    'auth/wrong-password': 'Email or password is wrong.',
    'auth/invalid-credential': 'Email or password is wrong.',
    'auth/too-many-requests': 'Too many attempts – please wait a moment and try again.',
    'auth/network-request-failed': 'No connection – check your internet and try again.',
    'auth/requires-recent-login': 'Please sign in again and then retry.',
    'auth/account-exists-with-different-credential':
      'An account with a password already exists for this email – please sign in with that instead.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled yet.',
    'auth/unauthorized-domain': 'Sign-in is not enabled for this address yet.',
    'auth/popup-closed-by-user': 'Sign-in cancelled.',
    'permission-denied': 'Access denied – has your email address been confirmed yet?',
    unavailable: 'The sync service is unreachable right now – your data stays saved on this device.',
  },
};

/** Firebase-Fehlercodes in verständlichen Text der aktiven Sprache übersetzen. */
export function describeCloudError(err: unknown, lang: Lang = 'de'): string {
  const code = (err as { code?: string })?.code ?? '';
  return ERROR_MESSAGES[lang][code] ?? ERROR_FALLBACK[lang];
}

let handlePromise: Promise<CloudHandle | null> | null = null;

/** Initialisiert das Cloud-Modul genau einmal (oder gibt null zurück, wenn keine Konfiguration existiert). */
export function getCloud(): Promise<CloudHandle | null> {
  if (!handlePromise) handlePromise = init();
  return handlePromise;
}

async function init(): Promise<CloudHandle | null> {
  // Einzeldatei-Build (Vorschau-Artefakt): kein Cloud-Code einbinden.
  if (__SINGLE__) { ausfall = 'nicht-eingerichtet'; return null; }
  const cfg = await loadConfig();
  if (!cfg) return null;

  try {
    const [{ initializeApp }, authMod, fsMod] = await Promise.all([
      import('firebase/app'),
      import('firebase/auth'),
      import('firebase/firestore'),
    ]);

    const app = initializeApp(cfg);
    const auth = authMod.getAuth(app);
    // Sprache der Firebase-Mails: Startwert deutsch, die App setzt sie über
    // setLanguage() sofort auf die aktive Sprache (siehe CloudProvider).
    auth.languageCode = 'de';
    const db = fsMod.getFirestore(app);

    const redirectErrorHandlers = new Set<(err: unknown) => void>();
    // Läuft nach jedem Laden einmal leer durch (kein Fehler), außer direkt nach
    // der Rückkehr von einer Google-Weiterleitung mit einem echten Problem.
    authMod.getRedirectResult(auth).catch((err) => {
      redirectErrorHandlers.forEach((cb) => cb(err));
    });

    const toCloudUser = (u: import('firebase/auth').User | null): CloudUser | null =>
      u && u.email
        ? {
            uid: u.uid,
            email: u.email,
            name: u.displayName ?? '',
            verified: u.emailVerified,
            passwort: u.providerData.some((p) => p.providerId === 'password'),
          }
        : null;

    return {
      async register(name, email, password) {
        const cred = await authMod.createUserWithEmailAndPassword(auth, email, password);
        await authMod.updateProfile(cred.user, { displayName: name.slice(0, 40) });
        await authMod.sendEmailVerification(cred.user);
      },
      async login(email, password) {
        await authMod.signInWithEmailAndPassword(auth, email, password);
      },
      /* Erst Popup, dann Redirect – in dieser Reihenfolge, und zwar aus einem
         konkreten Grund: Die App läuft auf einer anderen Domain als die
         Firebase-Auth-Domain (github.io vs. firebaseapp.com). Der Redirect-Weg
         braucht dabei Speicherzugriff über Ursprungsgrenzen hinweg, den Safari
         und zunehmend auch Chrome blockieren – er scheitert also ausgerechnet
         auf dem iPhone. Das Popup hat dieses Problem nicht.
         Umgekehrt kann das Popup blockiert sein oder in einer installierten
         PWA fehlschlagen; dann greift der Redirect. Mit eigener Domain
         (DOMAIN_SETUP.md) entfällt das Problem ganz. */
      async loginWithGoogle() {
        const provider = new authMod.GoogleAuthProvider();
        try {
          await authMod.signInWithPopup(auth, provider);
        } catch (err) {
          const code = (err as { code?: string })?.code ?? '';
          // Vom Nutzer bewusst abgebrochen: nicht hinterherlaufen.
          if (code === 'auth/cancelled-popup-request' || code === 'auth/popup-closed-by-user') {
            throw err;
          }
          if (
            code === 'auth/popup-blocked' ||
            code === 'auth/operation-not-supported-in-this-environment'
          ) {
            await authMod.signInWithRedirect(auth, provider);
            return;
          }
          throw err;
        }
      },
      onRedirectError(cb) {
        redirectErrorHandlers.add(cb);
        return () => redirectErrorHandlers.delete(cb);
      },
      async logout() {
        await authMod.signOut(auth);
      },
      /* Konto löschen (E-084). Reihenfolge mit Grund:
         1. **Erneut anmelden.** Firebase verlangt für das Löschen eine frische
            Anmeldung; ohne sie scheitert der letzte Schritt mit
            `auth/requires-recent-login`, nachdem die Daten schon weg sind.
         2. **Daten zuerst**, solange die Anmeldung gilt — danach hat der Client
            keine Rechte mehr an ihnen.
         3. **Zuletzt das Konto.** Scheitert Schritt 2 halb, ist das Konto noch
            da und der Versuch wiederholbar; der Server räumt Reste beim
            Löschen auf (`functions/src/konto.ts`). */
      async deleteAccount(passwort) {
        const user = auth.currentUser;
        if (!user || !user.email) {
          throw Object.assign(new Error('Kein Konto'), { code: 'auth/user-not-found' });
        }
        if (user.providerData.some((p) => p.providerId === 'password')) {
          if (!passwort) throw Object.assign(new Error('Passwort fehlt'), { code: 'auth/wrong-password' });
          await authMod.reauthenticateWithCredential(
            user,
            authMod.EmailAuthProvider.credential(user.email, passwort),
          );
        } else {
          await authMod.reauthenticateWithPopup(user, new authMod.GoogleAuthProvider());
        }
        /* Ohne bestätigte Adresse darf der Client nichts in Firestore (Regeln);
           dann gibt es dort auch nichts zu löschen. */
        if (user.emailVerified) {
          const uid = user.uid;
          const ids = async (sammlung: string) =>
            (await fsMod.getDocs(fsMod.collection(db, 'social', uid, sammlung))).docs.map((d) => d.id);
          const [freunde, anfragen, gesendet] = await Promise.all([
            ids('friends'), ids('requests'), ids('outgoing'),
          ]);
          const pfade = pfadeZumLoeschen(uid, { freunde, anfragen, gesendet });
          for (let i = 0; i < pfade.length; i += 400) {
            const batch = fsMod.writeBatch(db);
            for (const p of pfade.slice(i, i + 400)) batch.delete(fsMod.doc(db, p));
            await batch.commit();
          }
        }
        await authMod.deleteUser(user);
      },
      async resetPassword(email) {
        await authMod.sendPasswordResetEmail(auth, email);
      },
      async resendVerification() {
        if (auth.currentUser) await authMod.sendEmailVerification(auth.currentUser);
      },
      async reloadUser() {
        if (auth.currentUser) await authMod.reload(auth.currentUser);
        return toCloudUser(auth.currentUser);
      },
      async getIdToken() {
        if (!auth.currentUser) return null;
        try {
          return await auth.currentUser.getIdToken();
        } catch {
          return null;
        }
      },
      setLanguage(lang) {
        auth.languageCode = lang;
      },
      onUser(cb) {
        return authMod.onAuthStateChanged(auth, (u) => cb(toCloudUser(u)));
      },
      watchEntitlement(uid, cb) {
        return fsMod.onSnapshot(
          fsMod.doc(db, 'entitlements', uid),
          (snap) => {
            // Auch servergeschriebene Daten laufen durch die Prüfung: „darf nur
            // der Server schreiben" ist eine Regel, keine Garantie über die Zeit.
            cb(snap.exists() ? sanitizeEntitlement(snap.data(), uid) : null);
          },
          // Lesefehler (offline, Regel greift) heißt: kein nachweisbarer Zugang.
          () => cb(null),
        );
      },
      async pull(uid) {
        const snap = await fsMod.getDoc(fsMod.doc(db, 'users', uid));
        if (!snap.exists()) return null;
        const payload = snap.data()?.payload;
        if (typeof payload !== 'string') return null;
        try {
          return JSON.parse(payload) as unknown;
        } catch {
          return null;
        }
      },
      async push(uid, name, email, data) {
        // Als JSON-String speichern: umgeht Firestore-Typbeschränkungen
        // (z. B. verschachtelte Arrays) und bleibt unter dem 1-MB-Dokumentlimit.
        await fsMod.setDoc(fsMod.doc(db, 'users', uid), {
          name: name.slice(0, 40),
          email: email.slice(0, 120),
          updatedAt: fsMod.serverTimestamp(),
          payload: JSON.stringify(data),
        });
      },
    };
  } catch {
    return null;
  }
}
