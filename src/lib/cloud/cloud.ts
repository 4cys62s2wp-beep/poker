/* Cloud-Konten & Synchronisation über Firebase (Auth + Firestore).
   Das Modul ist optional: Es wird nur aktiv, wenn neben der index.html eine
   firebase-config.json liegt (siehe FIREBASE_SETUP.md). Ohne Konfiguration
   bleibt die App im reinen Geräte-Modus – der komplette Firebase-Code wird
   dann gar nicht erst geladen (dynamischer Import). */

import type { Lang } from '../../i18n';

export interface CloudUser {
  uid: string;
  email: string;
  name: string;
  verified: boolean;
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
  /**
   * Beobachtet den Abo-Status im Dokument `customers/{uid}`.
   * Dieses Dokument schreibt ausschließlich der Zahlungs-Webhook (serverseitig);
   * die Sicherheitsregeln erlauben dem Client nur Lesezugriff.
   */
  watchSubscription: (uid: string, cb: (active: boolean) => void) => () => void;
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

async function loadConfig(): Promise<FirebaseConfigFile | null> {
  try {
    const url = new URL('firebase-config.json', document.baseURI).toString();
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const json: unknown = await res.json();
    const cfg = json as Partial<FirebaseConfigFile> | null;
    if (
      cfg &&
      typeof cfg.apiKey === 'string' &&
      typeof cfg.authDomain === 'string' &&
      typeof cfg.projectId === 'string' &&
      typeof cfg.appId === 'string'
    ) {
      return cfg as FirebaseConfigFile;
    }
    return null;
  } catch {
    return null;
  }
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
  if (__SINGLE__) return null;
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

    const toCloudUser = (u: import('firebase/auth').User | null): CloudUser | null =>
      u && u.email
        ? {
            uid: u.uid,
            email: u.email,
            name: u.displayName ?? '',
            verified: u.emailVerified,
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
      async logout() {
        await authMod.signOut(auth);
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
      setLanguage(lang) {
        auth.languageCode = lang;
      },
      onUser(cb) {
        return authMod.onAuthStateChanged(auth, (u) => cb(toCloudUser(u)));
      },
      watchSubscription(uid, cb) {
        return fsMod.onSnapshot(
          fsMod.doc(db, 'customers', uid),
          (snap) => {
            const data = snap.exists() ? (snap.data() as Record<string, unknown>) : null;
            const status = typeof data?.status === 'string' ? data.status : '';
            const activeStatus = status === 'active' || status === 'trialing';
            // Ablaufdatum (Sekunden oder ISO) zusätzlich prüfen, falls vorhanden.
            const endRaw = data?.currentPeriodEnd;
            let notExpired = true;
            if (typeof endRaw === 'number') notExpired = endRaw * 1000 > Date.now();
            else if (typeof endRaw === 'string' && isFinite(new Date(endRaw).getTime())) {
              notExpired = new Date(endRaw).getTime() > Date.now();
            }
            cb(activeStatus && notExpired);
          },
          () => cb(false),
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
