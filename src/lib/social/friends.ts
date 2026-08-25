/* Freundes-System – dünner Firestore-Adapter.

   Aufbau wie src/lib/cloud/cloud.ts: Firebase wird dynamisch nachgeladen und
   nur aktiv, wenn neben der index.html eine firebase-config.json liegt. Ohne
   Konfiguration (oder im Einzeldatei-Build) gibt jede Funktion still ein
   „unavailable" zurück – geworfen wird hier nie etwas, damit ein fehlendes
   oder kaputtes Backend die App nirgends anhält.

   Die gesamte Entscheidungslogik steckt in protocol.ts (rein und getestet);
   diese Datei übersetzt sie nur in Firestore-Aufrufe.

   Datenmodell (siehe firestore.rules.social):

     friendCodes/{CODE}                 { uid }
       Öffentliche Nachschlagetabelle Code → UID. Nur gezieltes Lesen eines
       bekannten Codes ist erlaubt, kein Auflisten – niemand kann die
       Nutzerschaft durchblättern. Enthält bewusst KEINEN Namen.

     social/{uid}/friends/{friendUid}   { name, since }
       Die Freundesliste eines Nutzers. Nur er selbst darf sie lesen.

     social/{uid}/requests/{fromUid}    { fromUid, name, createdAt }
       Eingehende Anfragen. Angelegt vom Absender, gelesen vom Empfänger.

     social/{uid}/outgoing/{toUid}      { createdAt }
       Merkzettel für die eigenen offenen Anfragen (nur für die eigene UI).

     presence/{uid}                     { lastSeen }
       Lebenszeichen. Schreiben nur man selbst, lesen nur Freunde.

   Nirgends steht eine E-Mail-Adresse: Freunde sehen Anzeigename und
   Online-Status, mehr nicht. */

import {
  MAX_FRIENDS,
  codeBelongsTo,
  parseCode,
  sanitizeFriend,
  sanitizeRequest,
  toMillis,
  type FriendEntry,
  type RequestEntry,
} from './protocol';

/* ------------------------------------------------------------------ *
 * Ergebnisse
 * ------------------------------------------------------------------ */

export type SocialFailure =
  /** Firebase ist nicht konfiguriert, nicht ladbar oder der Nutzer ist abgemeldet. */
  | 'unavailable'
  /** Der eingetippte Code ist syntaktisch falsch (Prüfzeichen). */
  | 'invalid-code'
  /** Das ist der eigene Code. */
  | 'self'
  /** Der Code ist gültig aufgebaut, aber niemandem zugeordnet. */
  | 'unknown-code'
  /** Ihr seid schon befreundet. */
  | 'already-friends'
  /** Anfrage läuft bereits. */
  | 'already-sent'
  /** Netz-/Rechtefehler. */
  | 'error';

export type SocialResult = { ok: true } | { ok: false; reason: SocialFailure };

export interface SendOutcome {
  ok: true;
  /** UID des Gegenübers. */
  uid: string;
  /** 'friends', wenn die Gegenseite bereits angefragt hatte (Kreuzung aufgelöst). */
  relation: 'outgoing' | 'friends';
}

export type SendResult = SendOutcome | { ok: false; reason: SocialFailure };

const UNAVAILABLE: SocialResult = { ok: false, reason: 'unavailable' };
const FAILED: SocialResult = { ok: false, reason: 'error' };

/** Leerer Abmelder für den Fall, dass es gar keine Cloud gibt. */
const NOOP = () => {};

/* ------------------------------------------------------------------ *
 * Lazy-Init (identisches Muster wie cloud.ts)
 * ------------------------------------------------------------------ */

interface FirebaseConfigFile {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
}

async function loadConfig(): Promise<FirebaseConfigFile | null> {
  try {
    const url = new URL('firebase-config.json', document.baseURI).toString();
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const cfg = (await res.json()) as Partial<FirebaseConfigFile> | null;
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

type FirestoreModule = typeof import('firebase/firestore');

interface SocialHandle {
  fs: FirestoreModule;
  db: import('firebase/firestore').Firestore;
}

let handlePromise: Promise<SocialHandle | null> | null = null;

/** Initialisiert das Modul genau einmal; null = keine Cloud vorhanden. */
function getSocial(): Promise<SocialHandle | null> {
  if (!handlePromise) handlePromise = init();
  return handlePromise;
}

async function init(): Promise<SocialHandle | null> {
  // Einzeldatei-Build (Vorschau-Artefakt): kein Cloud-Code einbinden.
  if (__SINGLE__) return null;
  const cfg = await loadConfig();
  if (!cfg) return null;
  try {
    const [appMod, fs] = await Promise.all([import('firebase/app'), import('firebase/firestore')]);
    // Die App teilt sich das Modul mit cloud.ts – je nachdem, wer zuerst da
    // ist, wird sie hier angelegt oder die bestehende weiterverwendet.
    const existing = appMod.getApps();
    const app = existing.length > 0 ? existing[0] : appMod.initializeApp(cfg);
    return { fs, db: fs.getFirestore(app) };
  } catch {
    return null;
  }
}

/** Nur für Tests/Diagnose: ist die Cloud-Seite überhaupt verfügbar? */
export async function socialAvailable(): Promise<boolean> {
  return (await getSocial()) !== null;
}

/* ------------------------------------------------------------------ *
 * Hilfen
 * ------------------------------------------------------------------ */

/** Jede Schreibaktion läuft hierdurch: nie werfen, immer ein Ergebnis. */
async function run(fn: (h: SocialHandle) => Promise<void>): Promise<SocialResult> {
  const h = await getSocial();
  if (!h) return UNAVAILABLE;
  try {
    await fn(h);
    return { ok: true };
  } catch {
    // Rechte-, Netz- oder Kontingentfehler: Die UI zeigt einen Hinweis,
    // die App läuft weiter.
    return FAILED;
  }
}

function friendsCol(h: SocialHandle, uid: string) {
  return h.fs.collection(h.db, 'social', uid, 'friends');
}

function requestsCol(h: SocialHandle, uid: string) {
  return h.fs.collection(h.db, 'social', uid, 'requests');
}

function outgoingCol(h: SocialHandle, uid: string) {
  return h.fs.collection(h.db, 'social', uid, 'outgoing');
}

/* ------------------------------------------------------------------ *
 * Eigener Code veröffentlichen
 * ------------------------------------------------------------------ */

/**
 * Trägt den (aus der UID abgeleiteten) Code in die Nachschlagetabelle ein,
 * damit andere ihn einlösen können. Existiert der Eintrag schon mit derselben
 * UID, passiert nichts. Zeigt er auf jemand anderen (astronomisch
 * unwahrscheinliche Kollision), wird nichts überschrieben und 'error'
 * gemeldet – die Freundesliste bleibt funktionsfähig, nur der Code nicht.
 */
export async function publishCode(uid: string, code: string): Promise<SocialResult> {
  const normalized = parseCode(code);
  if (!normalized) return { ok: false, reason: 'invalid-code' };
  const h = await getSocial();
  if (!h) return UNAVAILABLE;
  try {
    const ref = h.fs.doc(h.db, 'friendCodes', normalized);
    const snap = await h.fs.getDoc(ref);
    if (snap.exists()) {
      return snap.data()?.uid === uid ? { ok: true } : FAILED;
    }
    await h.fs.setDoc(ref, { uid });
    return { ok: true };
  } catch {
    return FAILED;
  }
}

/* ------------------------------------------------------------------ *
 * Listen beobachten
 * ------------------------------------------------------------------ */

/**
 * Freundesliste beobachten. Der Rückgabewert meldet immer ab – auch wenn die
 * Cloud fehlt oder die Initialisierung noch läuft.
 */
export function watchFriends(uid: string, cb: (friends: FriendEntry[]) => void): () => void {
  if (!uid) return NOOP;
  let unsub: (() => void) | undefined;
  let cancelled = false;
  void getSocial().then((h) => {
    if (cancelled || !h) return;
    const q = h.fs.query(friendsCol(h, uid), h.fs.limit(MAX_FRIENDS));
    unsub = h.fs.onSnapshot(
      q,
      (snap) => {
        const list: FriendEntry[] = [];
        snap.forEach((d) => {
          const entry = sanitizeFriend(d.id, d.data());
          if (entry) list.push(entry);
        });
        cb(list);
      },
      () => cb([]),
    );
  });
  return () => {
    cancelled = true;
    unsub?.();
  };
}

/**
 * Anfragen beobachten – eingehende UND die eigenen offenen. Beide Sammlungen
 * fließen in einen Rückruf, damit die Seite nur eine Liste pflegen muss.
 */
export function watchRequests(uid: string, cb: (requests: RequestEntry[]) => void): () => void {
  if (!uid) return NOOP;
  let incoming: RequestEntry[] = [];
  let outgoing: RequestEntry[] = [];
  const emit = () => cb([...incoming, ...outgoing]);

  let unsubs: Array<() => void> = [];
  let cancelled = false;
  void getSocial().then((h) => {
    if (cancelled || !h) return;
    const listen = (
      col: ReturnType<typeof requestsCol>,
      direction: 'incoming' | 'outgoing',
      assign: (list: RequestEntry[]) => void,
    ) =>
      h.fs.onSnapshot(
        h.fs.query(col, h.fs.limit(MAX_FRIENDS)),
        (snap) => {
          const list: RequestEntry[] = [];
          snap.forEach((d) => {
            const entry = sanitizeRequest(d.id, d.data(), direction);
            if (entry) list.push(entry);
          });
          assign(list);
          emit();
        },
        () => {
          assign([]);
          emit();
        },
      );

    unsubs = [
      listen(requestsCol(h, uid), 'incoming', (l) => {
        incoming = l;
      }),
      listen(outgoingCol(h, uid), 'outgoing', (l) => {
        outgoing = l;
      }),
    ];
  });

  return () => {
    cancelled = true;
    for (const u of unsubs) u();
    unsubs = [];
  };
}

/**
 * Anwesenheit mehrerer Freunde beobachten (uid → lastSeen in ms).
 *
 * Bewusst ein Listener pro Dokument: Die Sicherheitsregeln erlauben das
 * gezielte Lesen eines Freundes-Dokuments, aber kein Durchsuchen der
 * presence-Sammlung. Die Liste ist auf MAX_FRIENDS begrenzt.
 */
export function watchPresence(
  uids: readonly string[],
  cb: (presence: Record<string, number | null>) => void,
): () => void {
  const wanted = [...new Set(uids.filter(Boolean))].slice(0, MAX_FRIENDS);
  if (wanted.length === 0) {
    cb({});
    return NOOP;
  }
  const state: Record<string, number | null> = {};
  for (const u of wanted) state[u] = null;

  let unsubs: Array<() => void> = [];
  let cancelled = false;
  void getSocial().then((h) => {
    if (cancelled || !h) return;
    unsubs = wanted.map((u) =>
      h.fs.onSnapshot(
        h.fs.doc(h.db, 'presence', u),
        (snap) => {
          state[u] = snap.exists() ? toMillis(snap.data()?.lastSeen) : null;
          cb({ ...state });
        },
        () => {
          // Kein Leserecht (keine Freundschaft mehr) oder offline: unbekannt.
          state[u] = null;
          cb({ ...state });
        },
      ),
    );
  });

  return () => {
    cancelled = true;
    for (const u of unsubs) u();
    unsubs = [];
  };
}

/* ------------------------------------------------------------------ *
 * Aktionen
 * ------------------------------------------------------------------ */

/**
 * Anfrage per Code verschicken.
 *
 * Enthält die Auflösung gleichzeitiger Anfragen: Liegt vom Gegenüber bereits
 * eine Anfrage vor, entsteht keine zweite offene Anfrage, sondern sofort eine
 * Freundschaft (dieselbe Regel wie resolveRelation im Protokoll).
 */
export async function sendRequest(fromUid: string, fromName: string, code: string): Promise<SendResult> {
  const normalized = parseCode(code);
  if (!normalized) return { ok: false, reason: 'invalid-code' };
  if (codeBelongsTo(normalized, fromUid)) return { ok: false, reason: 'self' };

  const h = await getSocial();
  if (!h) return { ok: false, reason: 'unavailable' };

  try {
    const codeSnap = await h.fs.getDoc(h.fs.doc(h.db, 'friendCodes', normalized));
    const targetUid = codeSnap.exists() ? codeSnap.data()?.uid : null;
    if (typeof targetUid !== 'string' || !targetUid) return { ok: false, reason: 'unknown-code' };
    if (targetUid === fromUid) return { ok: false, reason: 'self' };

    const [friendSnap, incomingSnap, outgoingSnap] = await Promise.all([
      h.fs.getDoc(h.fs.doc(h.db, 'social', fromUid, 'friends', targetUid)),
      h.fs.getDoc(h.fs.doc(h.db, 'social', fromUid, 'requests', targetUid)),
      h.fs.getDoc(h.fs.doc(h.db, 'social', fromUid, 'outgoing', targetUid)),
    ]);
    if (friendSnap.exists()) return { ok: false, reason: 'already-friends' };
    // Eine offene Anfrage wird nicht überschrieben (die Regeln verbieten das
    // Ändern einer gestellten Anfrage) – die UI sagt einfach Bescheid.
    if (outgoingSnap.exists() && !incomingSnap.exists()) {
      return { ok: false, reason: 'already-sent' };
    }

    const name = fromName.slice(0, 40);

    if (incomingSnap.exists()) {
      // Kreuzung: Beide wollen – direkt befreunden.
      const otherName = typeof incomingSnap.data()?.name === 'string' ? incomingSnap.data()!.name : '';
      const res = await acceptRequest(fromUid, name, targetUid, otherName);
      return res.ok ? { ok: true, uid: targetUid, relation: 'friends' } : { ok: false, reason: res.reason };
    }

    const batch = h.fs.writeBatch(h.db);
    batch.set(h.fs.doc(h.db, 'social', targetUid, 'requests', fromUid), {
      fromUid,
      name,
      createdAt: h.fs.serverTimestamp(),
    });
    // Eigener Merkzettel, damit „Anfrage läuft" auch nach Neuladen sichtbar ist.
    batch.set(h.fs.doc(h.db, 'social', fromUid, 'outgoing', targetUid), {
      createdAt: h.fs.serverTimestamp(),
    });
    await batch.commit();
    return { ok: true, uid: targetUid, relation: 'outgoing' };
  } catch {
    return { ok: false, reason: 'error' };
  }
}

/**
 * Anfrage annehmen: beide Freundeslisten schreiben, Anfrage und Merkzettel
 * löschen – als ein Batch, damit keine halbe Freundschaft entstehen kann.
 */
export function acceptRequest(
  uid: string,
  myName: string,
  fromUid: string,
  fromName: string,
): Promise<SocialResult> {
  return run(async (h) => {
    const batch = h.fs.writeBatch(h.db);
    const since = h.fs.serverTimestamp();
    batch.set(h.fs.doc(h.db, 'social', uid, 'friends', fromUid), {
      name: fromName.slice(0, 40),
      since,
    });
    batch.set(h.fs.doc(h.db, 'social', fromUid, 'friends', uid), {
      name: myName.slice(0, 40),
      since,
    });
    batch.delete(h.fs.doc(h.db, 'social', uid, 'requests', fromUid));
    batch.delete(h.fs.doc(h.db, 'social', fromUid, 'outgoing', uid));
    await batch.commit();
  });
}

/** Anfrage ablehnen: still löschen, der Absender erfährt keinen Grund. */
export function declineRequest(uid: string, fromUid: string): Promise<SocialResult> {
  return run(async (h) => {
    const batch = h.fs.writeBatch(h.db);
    batch.delete(h.fs.doc(h.db, 'social', uid, 'requests', fromUid));
    batch.delete(h.fs.doc(h.db, 'social', fromUid, 'outgoing', uid));
    await batch.commit();
  });
}

/** Eigene Anfrage zurückziehen. */
export function cancelRequest(uid: string, toUid: string): Promise<SocialResult> {
  return run(async (h) => {
    const batch = h.fs.writeBatch(h.db);
    batch.delete(h.fs.doc(h.db, 'social', toUid, 'requests', uid));
    batch.delete(h.fs.doc(h.db, 'social', uid, 'outgoing', toUid));
    await batch.commit();
  });
}

/**
 * Freundschaft beenden – auf beiden Seiten. Sich selbst aus einer fremden
 * Liste zu streichen ist ausdrücklich erlaubt (siehe Regeln), sonst bliebe
 * beim Gegenüber ein Eintrag mit Leserecht auf die Anwesenheit stehen.
 */
export function removeFriend(uid: string, friendUid: string): Promise<SocialResult> {
  return run(async (h) => {
    const batch = h.fs.writeBatch(h.db);
    batch.delete(h.fs.doc(h.db, 'social', uid, 'friends', friendUid));
    batch.delete(h.fs.doc(h.db, 'social', friendUid, 'friends', uid));
    await batch.commit();
  });
}

/**
 * Lebenszeichen setzen. Der Zeitstempel kommt vom Server, damit niemand
 * durch eine falsch gestellte Uhr dauerhaft „online" wirkt.
 */
export function heartbeat(uid: string): Promise<SocialResult> {
  return run(async (h) => {
    await h.fs.setDoc(
      h.fs.doc(h.db, 'presence', uid),
      { lastSeen: h.fs.serverTimestamp() },
      { merge: true },
    );
  });
}

/** Beim Abmelden/Schließen: sofort offline melden (Zeitstempel weit zurück). */
export function clearPresence(uid: string): Promise<SocialResult> {
  return run(async (h) => {
    await h.fs.deleteDoc(h.fs.doc(h.db, 'presence', uid));
  });
}
