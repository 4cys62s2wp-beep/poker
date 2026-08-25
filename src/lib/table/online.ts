/* Online-Tisch – dünne Firestore-Schicht.

   Dieses Modul trifft KEINE Spielentscheidungen. Es liest und schreibt nur die
   Strukturen aus protocol.ts; wer wann was darf, steht dort (und zusätzlich in
   firestore.rules.multiplayer, weil man Clients nicht glauben darf).

   Datenmodell:
     tables/{code}                    RoomDoc      – schreibt nur der Host
     tables/{code}/members/{uid}      MemberDoc    – schreibt nur dieses Mitglied
     tables/{code}/private/{uid}      Hole-Cards   – liest NUR dieses Mitglied

   Firebase wird wie im übrigen Projekt erst bei Bedarf geladen und ist optional:
   Ohne firebase-config.json liefert jede Funktion { ok: false, error:
   'unavailable' } statt zu werfen – die Seite kann dann sauber auf den
   Einzelgerät-Tisch verweisen. */

import { getCloud } from '../cloud/cloud';
import {
  createMemberDoc,
  createRoomDoc,
  generateRoomCode,
  isValidRoomCode,
  sanitizeMember,
  sanitizePrivateCards,
  sanitizeRoomDoc,
  type MemberDoc,
  type PendingAction,
  type PrivateCardsDoc,
  type RoomConfig,
  type RoomDoc,
} from './protocol';
import type { Card } from '../poker/cards';

/* ==========================================================================
   Ergebnistypen – nichts wirft, alles ist auswertbar
   ========================================================================== */

export type OnlineError =
  /** Firebase ist nicht eingerichtet (oder Einzeldatei-Build). */
  | 'unavailable'
  /** Kein angemeldeter Nutzer. */
  | 'not-signed-in'
  | 'not-found'
  | 'code-taken'
  /** Ein anderer Client war schneller – neu laden und erneut versuchen. */
  | 'conflict'
  /** Sicherheitsregeln haben abgelehnt. */
  | 'denied'
  /** Netz weg / Dienst nicht erreichbar. */
  | 'network'
  | 'failed';

export type OnlineResult<T = void> = { ok: true; value: T } | { ok: false; error: OnlineError };

const fail = (error: OnlineError): OnlineResult<never> => ({ ok: false, error });
const done = <T>(value: T): OnlineResult<T> => ({ ok: true, value });

/** Firebase-Fehlercodes auf unsere kurze Liste abbilden. */
function toError(err: unknown): OnlineError {
  const code = (err as { code?: string })?.code ?? '';
  if (code === 'permission-denied') return 'denied';
  if (code === 'unavailable' || code === 'deadline-exceeded') return 'network';
  return 'failed';
}

/* ==========================================================================
   Lazy-Initialisierung (gleiche Firebase-App wie der Konto-Sync)
   ========================================================================== */

type FirestoreMod = typeof import('firebase/firestore');

interface Ctx {
  fs: FirestoreMod;
  db: import('firebase/firestore').Firestore;
}

let ctxPromise: Promise<Ctx | null> | null = null;

async function context(): Promise<Ctx | null> {
  if (!ctxPromise) ctxPromise = init();
  return ctxPromise;
}

async function init(): Promise<Ctx | null> {
  // Einzeldatei-Vorschau: kein Firebase-Code einbinden.
  if (__SINGLE__) return null;
  // getCloud() lädt die Konfiguration, initialisiert die App und meldet den
  // Auth-Listener an. Ohne Konfiguration bleibt der Online-Tisch aus.
  const cloud = await getCloud();
  if (!cloud) return null;
  try {
    const [appMod, fs] = await Promise.all([import('firebase/app'), import('firebase/firestore')]);
    const apps = appMod.getApps();
    if (apps.length === 0) return null;
    // Bewusst dieselbe App-Instanz: nur so hängt der angemeldete Nutzer
    // (request.auth) an den Firestore-Anfragen.
    return { fs, db: fs.getFirestore(apps[0]) };
  } catch {
    return null;
  }
}

/** Ist der Online-Tisch überhaupt möglich? (Für die Erklärseite.) */
export async function isOnlineAvailable(): Promise<boolean> {
  return (await context()) !== null;
}

/* ==========================================================================
   Pfade
   ========================================================================== */

function roomRef(ctx: Ctx, code: string) {
  return ctx.fs.doc(ctx.db, 'tables', code);
}

function memberRef(ctx: Ctx, code: string, uid: string) {
  return ctx.fs.doc(ctx.db, 'tables', code, 'members', uid);
}

function membersRef(ctx: Ctx, code: string) {
  return ctx.fs.collection(ctx.db, 'tables', code, 'members');
}

function privateRef(ctx: Ctx, code: string, uid: string) {
  return ctx.fs.doc(ctx.db, 'tables', code, 'private', uid);
}

/* ==========================================================================
   Raum anlegen und betreten
   ========================================================================== */

export interface OnlineUser {
  uid: string;
  name: string;
}

/** Legt einen Raum mit freiem Code an und setzt den Host auf Sitz 1.
    Bei Code-Kollision wird ein paar Mal neu gewürfelt. */
export async function createRoom(
  user: OnlineUser,
  config: RoomConfig,
  now: number = Date.now(),
): Promise<OnlineResult<RoomDoc>> {
  const ctx = await context();
  if (!ctx) return fail('unavailable');
  if (!user?.uid) return fail('not-signed-in');

  for (let attempt = 0; attempt < 6; attempt++) {
    const code = generateRoomCode();
    const room = createRoomDoc(code, user, config, now);
    try {
      const created = await ctx.fs.runTransaction(ctx.db, async (tx) => {
        const snap = await tx.get(roomRef(ctx, code));
        if (snap.exists()) return false;
        tx.set(roomRef(ctx, code), room);
        return true;
      });
      if (!created) continue;
      // Der Host ist zugleich normales Mitglied (Anwesenheit, Bereitschaft).
      await ctx.fs.setDoc(memberRef(ctx, code, user.uid), createMemberDoc(user, now));
      return done(room);
    } catch (err) {
      return fail(toError(err));
    }
  }
  return fail('code-taken');
}

/** Betritt einen Raum: Existenz prüfen und das eigene Mitgliedsdokument
    anlegen. Den Sitz vergibt der Host (protocol.reconcileSeats). */
export async function joinRoom(
  code: string,
  user: OnlineUser,
  now: number = Date.now(),
): Promise<OnlineResult<RoomDoc>> {
  const ctx = await context();
  if (!ctx) return fail('unavailable');
  if (!user?.uid) return fail('not-signed-in');
  if (!isValidRoomCode(code)) return fail('not-found');

  try {
    const snap = await ctx.fs.getDoc(roomRef(ctx, code));
    if (!snap.exists()) return fail('not-found');
    const room = sanitizeRoomDoc(snap.data());
    if (!room) return fail('not-found');

    const mineSnap = await ctx.fs.getDoc(memberRef(ctx, code, user.uid));
    const existing = mineSnap.exists() ? sanitizeMember(mineSnap.data()) : null;
    const member: MemberDoc = existing
      ? { ...existing, name: createMemberDoc(user, now).name, lastSeen: now }
      : createMemberDoc(user, now);
    await ctx.fs.setDoc(memberRef(ctx, code, user.uid), member);
    return done(room);
  } catch (err) {
    return fail(toError(err));
  }
}

/** Tisch verlassen: eigenes Mitgliedsdokument löschen. Der Host merkt das über
    watchRoom und gibt den Sitz frei. */
export async function leaveRoom(code: string, uid: string): Promise<OnlineResult> {
  const ctx = await context();
  if (!ctx) return fail('unavailable');
  try {
    await ctx.fs.deleteDoc(memberRef(ctx, code, uid));
    return done(undefined);
  } catch (err) {
    return fail(toError(err));
  }
}

/* ==========================================================================
   Beobachten
   ========================================================================== */

export type WatchStatus = 'ok' | 'missing' | 'error' | 'unavailable';

export interface RoomView {
  room: RoomDoc | null;
  members: MemberDoc[];
  status: WatchStatus;
}

export type Unsubscribe = () => void;

/** Beobachtet Raumdokument UND Mitgliederliste und meldet beides zusammen.
    Der Rückgabewert beendet beide Listener. */
export function watchRoom(code: string, cb: (view: RoomView) => void): Unsubscribe {
  let stopped = false;
  let unsubRoom: Unsubscribe | null = null;
  let unsubMembers: Unsubscribe | null = null;

  let room: RoomDoc | null = null;
  let members: MemberDoc[] = [];
  let status: WatchStatus = 'ok';
  let roomSeen = false;

  const emit = () => {
    if (!stopped) cb({ room, members, status });
  };

  void context().then((ctx) => {
    if (stopped) return;
    if (!ctx || !isValidRoomCode(code)) {
      status = ctx ? 'missing' : 'unavailable';
      emit();
      return;
    }
    unsubRoom = ctx.fs.onSnapshot(
      roomRef(ctx, code),
      (snap) => {
        roomSeen = true;
        if (!snap.exists()) {
          room = null;
          status = 'missing';
        } else {
          room = sanitizeRoomDoc(snap.data());
          status = room ? 'ok' : 'error';
        }
        emit();
      },
      () => {
        status = 'error';
        emit();
      },
    );
    unsubMembers = ctx.fs.onSnapshot(
      membersRef(ctx, code),
      (snap) => {
        const list: MemberDoc[] = [];
        snap.forEach((d) => {
          const m = sanitizeMember({ uid: d.id, ...(d.data() as object) });
          if (m) list.push(m);
        });
        members = list;
        if (roomSeen) emit();
      },
      () => {
        status = 'error';
        emit();
      },
    );
  });

  return () => {
    stopped = true;
    unsubRoom?.();
    unsubMembers?.();
  };
}

/** Eigene Hole-Cards. Nur der Besitzer darf dieses Dokument lesen –
    das erzwingen die Sicherheitsregeln, nicht dieser Client. */
export function watchPrivateCards(
  code: string,
  uid: string,
  cb: (cards: PrivateCardsDoc | null) => void,
): Unsubscribe {
  let stopped = false;
  let unsub: Unsubscribe | null = null;

  void context().then((ctx) => {
    if (stopped || !ctx || !isValidRoomCode(code) || !uid) {
      if (!stopped) cb(null);
      return;
    }
    unsub = ctx.fs.onSnapshot(
      privateRef(ctx, code, uid),
      (snap) => {
        if (stopped) return;
        cb(snap.exists() ? sanitizePrivateCards(snap.data()) : null);
      },
      () => {
        if (!stopped) cb(null);
      },
    );
  });

  return () => {
    stopped = true;
    unsub?.();
  };
}

/* ==========================================================================
   Schreiben (nur der Host)
   ========================================================================== */

/** Felder, die der Host am Raumdokument ändern darf. Version und Zeitstempel
    setzt pushState selbst. */
export type RoomPatch = Partial<Omit<RoomDoc, 'code' | 'createdAt' | 'version' | 'updatedAt'>>;

/**
 * Schreibt eine Änderung am Raum – aber nur, wenn niemand dazwischengefunkt
 * hat: Stimmt `expectedVersion` nicht mehr, kommt 'conflict' zurück und der
 * Aufrufer arbeitet auf dem frischen Stand weiter.
 */
export async function pushState(
  code: string,
  patch: RoomPatch,
  expectedVersion: number,
  now: number = Date.now(),
): Promise<OnlineResult<number>> {
  const ctx = await context();
  if (!ctx) return fail('unavailable');
  try {
    const version = await ctx.fs.runTransaction(ctx.db, async (tx) => {
      const ref = roomRef(ctx, code);
      const snap = await tx.get(ref);
      if (!snap.exists()) return -1;
      const current = sanitizeRoomDoc(snap.data());
      if (!current) return -1;
      if (current.version !== expectedVersion) return -2;
      const next = current.version + 1;
      tx.update(ref, { ...patch, version: next, updatedAt: now });
      return next;
    });
    if (version === -1) return fail('not-found');
    if (version === -2) return fail('conflict');
    return done(version);
  } catch (err) {
    return fail(toError(err));
  }
}

/** Verteilt die Hole-Cards – jedes Blatt in ein eigenes, nur für den Besitzer
    lesbares Dokument. Ein Batch, damit niemand halbe Karten sieht. */
export async function pushPrivateCards(
  code: string,
  handNumber: number,
  entries: Array<{ uid: string; cards: Card[] }>,
): Promise<OnlineResult> {
  const ctx = await context();
  if (!ctx) return fail('unavailable');
  try {
    const batch = ctx.fs.writeBatch(ctx.db);
    for (const entry of entries) {
      batch.set(privateRef(ctx, code, entry.uid), { handNumber, cards: entry.cards });
    }
    await batch.commit();
    return done(undefined);
  } catch (err) {
    return fail(toError(err));
  }
}

/* ==========================================================================
   Schreiben (jedes Mitglied – nur das eigene Dokument)
   ========================================================================== */

/** Zugwunsch an den Host. Der Host prüft ihn mit protocol.checkPending. */
export async function sendAction(
  code: string,
  uid: string,
  pending: PendingAction,
  now: number = Date.now(),
): Promise<OnlineResult> {
  return updateMember(code, uid, { pending, lastSeen: now });
}

/** Zugwunsch zurücknehmen (der Host hat ihn angewandt oder abgelehnt). */
export async function clearAction(code: string, uid: string): Promise<OnlineResult> {
  return updateMember(code, uid, { pending: null });
}

export async function setReady(
  code: string,
  uid: string,
  ready: boolean,
  now: number = Date.now(),
): Promise<OnlineResult> {
  return updateMember(code, uid, { ready, lastSeen: now });
}

/** Lebenszeichen. Läuft im Takt von protocol.HEARTBEAT_MS. */
export async function heartbeat(code: string, uid: string, now: number = Date.now()): Promise<OnlineResult> {
  return updateMember(code, uid, { lastSeen: now });
}

async function updateMember(
  code: string,
  uid: string,
  patch: Partial<MemberDoc>,
): Promise<OnlineResult> {
  const ctx = await context();
  if (!ctx) return fail('unavailable');
  if (!uid || !isValidRoomCode(code)) return fail('not-found');
  try {
    // setDoc(merge) statt update: Ein Herzschlag darf auch dann durchgehen,
    // wenn das Dokument nach einem Verbindungsabbruch neu angelegt werden muss.
    await ctx.fs.setDoc(memberRef(ctx, code, uid), { uid, ...patch }, { merge: true });
    return done(undefined);
  } catch (err) {
    return fail(toError(err));
  }
}
