/* Online-Tisch – reine Logik, kein Netzwerk.

   Dieses Modul beschreibt vollständig, WIE ein Online-Tisch funktioniert:
   Raumcodes, die serialisierte Raumstruktur, die Umrechnung vom Engine-Zustand
   in einen öffentlichen (kartenfreien) Zustand, Zug-Berechtigung, Sitzplätze,
   Anwesenheit und die Host-Nachfolge. Alles hier ist synchron, deterministisch
   und ohne Firebase testbar – siehe src/lib/__tests__/tableProtocol.test.ts.

   Der Firestore-Teil (src/lib/table/online.ts) trifft KEINE Entscheidungen; er
   liest und schreibt nur die hier definierten Strukturen.

   ── Vertrauensmodell (wichtig, ehrlich) ────────────────────────────────────
   Der Host ist ein normales Gerät im Freundeskreis: Sein Client mischt, teilt
   aus und wertet aus. Damit KENNT das Gerät des Hosts alle Karten – technisch
   könnte ein manipulierter Host-Client schummeln. Für eine Runde unter
   Freunden ist das die übliche Abmachung („einer gibt"), für Spiel um Geld
   wäre es das nicht. Deshalb gilt:
     • Die Hole-Cards der anderen Spieler landen NIE im öffentlichen Dokument –
       jeder liest nur sein eigenes Dokument unter tables/{code}/private/{uid}
       (siehe firestore.rules.multiplayer). Ein Mitspieler kann also nicht
       „mal eben" die Karten der anderen aus der Datenbank lesen.
     • Alle Entscheidungen des Hosts (Zug erlaubt? Aktion legal?) stecken in
       diesem Modul – dieselbe Funktion könnte eine Cloud Function ausführen.
       Für einen serverseitigen Dealer müssten nur toPublicState() und
       checkPending() dorthin wandern; Datenmodell und UI blieben gleich. */

import {
  createHand,
  legalActions,
  totalPot,
  type Action,
  type EnginePlayer,
  type GameState,
  type LegalActions,
  type LogEntry,
  type PotAward,
  type Street,
} from '../poker/engine';
import type { Card } from '../poker/cards';

/* ==========================================================================
   Raumcode
   ========================================================================== */

/** Alphabet ohne verwechselbare Zeichen: kein 0/O, kein 1/I (auch kein l).
    32 Zeichen → 6 Stellen ≈ 1,07 Mrd. Kombinationen. */
export const CODE_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
export const CODE_LENGTH = 6;

/** Neuer Raumcode. `rng` ist injizierbar, damit Tests deterministisch sind. */
export function generateRoomCode(rng: () => number = Math.random): string {
  let out = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    const raw = Math.floor(rng() * CODE_ALPHABET.length);
    const idx = Math.min(CODE_ALPHABET.length - 1, Math.max(0, Number.isFinite(raw) ? raw : 0));
    out += CODE_ALPHABET[idx];
  }
  return out;
}

/** Tippfehler-tolerant aufräumen: Groß-/Kleinschreibung, Leerzeichen, Bindestriche.
    Zeichen, die im Alphabet fehlen (0, O, 1, I, …), bleiben erhalten – der Code
    wird dann von isValidRoomCode() abgelehnt, statt still in einen falschen
    Raum zu führen. */
export function normalizeRoomCode(input: string): string {
  return (input ?? '')
    .toUpperCase()
    .replace(/[\s\-_.]/g, '')
    .slice(0, CODE_LENGTH);
}

export function isValidRoomCode(code: string): boolean {
  if (typeof code !== 'string' || code.length !== CODE_LENGTH) return false;
  for (const ch of code) if (!CODE_ALPHABET.includes(ch)) return false;
  return true;
}

/** Join-Link für den QR-Code. `base` ist üblicherweise origin + pathname. */
export function joinUrl(base: string, code: string): string {
  const clean = base.replace(/[#?].*$/, '');
  return `${clean}#/tisch/online?code=${encodeURIComponent(code)}`;
}

/* ==========================================================================
   Konfiguration, Konstanten
   ========================================================================== */

export const MIN_SEATS = 2;
/** Die Engine ist für 2–6 Spieler ausgelegt. */
export const MAX_SEATS = 6;

/** Ab wann gilt ein Spieler als weg? (Herzschlag alle HEARTBEAT_MS.) */
export const PRESENCE_TIMEOUT_MS = 20_000;
export const HEARTBEAT_MS = 6_000;

export interface RoomConfig {
  startStack: number;
  smallBlind: number;
  bigBlind: number;
  maxSeats: number;
}

export const DEFAULT_CONFIG: RoomConfig = {
  startStack: 1000,
  smallBlind: 10,
  bigBlind: 20,
  maxSeats: MAX_SEATS,
};

function clampInt(v: unknown, min: number, max: number, fallback: number): number {
  const n = typeof v === 'number' && Number.isFinite(v) ? Math.trunc(v) : fallback;
  return Math.min(max, Math.max(min, n));
}

/** Fremde/alte Konfiguration auf sinnvolle Grenzen ziehen. */
export function sanitizeConfig(input: unknown): RoomConfig {
  const c = (typeof input === 'object' && input !== null ? input : {}) as Record<string, unknown>;
  const bigBlind = clampInt(c.bigBlind, 2, 100_000, DEFAULT_CONFIG.bigBlind);
  const smallBlind = clampInt(c.smallBlind, 1, Math.max(1, bigBlind - 1), Math.max(1, Math.floor(bigBlind / 2)));
  return {
    bigBlind,
    smallBlind,
    startStack: clampInt(c.startStack, bigBlind * 2, 10_000_000, Math.max(bigBlind * 2, DEFAULT_CONFIG.startStack)),
    maxSeats: clampInt(c.maxSeats, MIN_SEATS, MAX_SEATS, MAX_SEATS),
  };
}

/* ==========================================================================
   Serialisierte Raumstruktur
   ========================================================================== */

/** Ein Platz am Tisch. Reihenfolge im Array = Sitzreihenfolge im Uhrzeigersinn. */
export interface SeatInfo {
  uid: string;
  name: string;
  stack: number;
  /** Beitrittszeitpunkt (ms) – entscheidet bei Gleichstand die Host-Nachfolge. */
  joinedAt: number;
}

/** Ein Mitglied schreibt AUSSCHLIESSLICH sein eigenes Dokument
    (tables/{code}/members/{uid}) – Anwesenheit, Bereitschaft, offene Aktion. */
export interface MemberDoc {
  uid: string;
  name: string;
  ready: boolean;
  /** Zeitstempel des letzten Herzschlags (ms, Uhr des Mitglieds). */
  lastSeen: number;
  joinedAt: number;
  pending: PendingAction | null;
}

/** Zugwunsch eines Spielers an den Host. `handNumber`/`seq` machen ihn
    eindeutig: Ein doppelt zugestellter oder veralteter Wunsch wird verworfen,
    statt zweimal zu wirken. */
export interface PendingAction {
  handNumber: number;
  seq: number;
  action: Action;
  at: number;
}

/** Öffentlicher Spieler: exakt der Engine-Spieler plus uid.
    `cards` ist leer, solange die Karten nicht aufgedeckt sind. */
export interface PublicPlayer extends EnginePlayer {
  uid: string;
}

/** Öffentlicher Spielzustand: der Engine-Zustand OHNE Deck und OHNE fremde
    Hole-Cards. Weil die Struktur sonst identisch bleibt, können alle Clients
    die geprüften Engine-Funktionen (legalActions, totalPot) unverändert
    benutzen – siehe legalActionsFor()/potOf(). */
export interface PublicState {
  players: PublicPlayer[];
  buttonIndex: number;
  board: Card[];
  street: Street;
  toActIndex: number;
  currentBet: number;
  lastRaiseSize: number;
  smallBlind: number;
  bigBlind: number;
  handOver: boolean;
  awards: PotAward[];
  log: LogEntry[];
  handNumber: number;
}

export type RoomPhase = 'lobby' | 'hand' | 'ended';

/** Das Dokument tables/{code}. Es schreibt nur der Host (Ausnahme:
    Host-Übernahme, wenn der Host weg ist – siehe firestore.rules.multiplayer). */
export interface RoomDoc {
  code: string;
  hostUid: string;
  createdAt: number;
  updatedAt: number;
  /** Steigt bei JEDER Änderung. Ein Schreibvorgang mit veralteter Version
      wird abgelehnt (Konflikterkennung, siehe online.pushState). */
  version: number;
  phase: RoomPhase;
  config: RoomConfig;
  seats: SeatInfo[];
  state: PublicState | null;
  handNumber: number;
  /** uid des Spielers mit dem Dealer-Button. */
  buttonUid: string | null;
  /** Anzahl bereits angewandter Aktionen in dieser Hand (Idempotenz). */
  seq: number;
}

export function createRoomDoc(
  code: string,
  host: { uid: string; name: string },
  config: RoomConfig,
  now: number,
): RoomDoc {
  return {
    code,
    hostUid: host.uid,
    createdAt: now,
    updatedAt: now,
    version: 1,
    phase: 'lobby',
    config,
    seats: [{ uid: host.uid, name: displayName(host.name), stack: config.startStack, joinedAt: now }],
    state: null,
    handNumber: 0,
    buttonUid: host.uid,
    seq: 0,
  };
}

export function createMemberDoc(user: { uid: string; name: string }, now: number): MemberDoc {
  return {
    uid: user.uid,
    name: displayName(user.name),
    ready: false,
    lastSeen: now,
    joinedAt: now,
    pending: null,
  };
}

/** Anzeigename: gekürzt, ohne Steuerzeichen, nie leer. */
export function displayName(raw: string): string {
  const cleaned = (raw ?? '')
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .trim()
    .slice(0, 24);
  return cleaned || 'Spieler';
}

/* ==========================================================================
   Engine-Zustand → öffentlich + privat
   ========================================================================== */

/** Öffentlicher Zustand: Deck weg, fremde Hole-Cards weg.
    `uids[i]` gehört zu `game.players[i]` (die Engine behält die Reihenfolge). */
export function toPublicState(game: GameState, uids: string[]): PublicState {
  if (uids.length !== game.players.length) {
    throw new Error('toPublicState: uids passen nicht zu den Spielern');
  }
  return {
    players: game.players.map((p, i) => ({
      ...p,
      uid: uids[i],
      // Nur aufgedeckte Karten (Showdown) sind öffentlich – sonst nichts.
      cards: p.revealed ? [...p.cards] : [],
    })),
    buttonIndex: game.buttonIndex,
    board: [...game.board],
    street: game.street,
    toActIndex: game.toActIndex,
    currentBet: game.currentBet,
    lastRaiseSize: game.lastRaiseSize,
    smallBlind: game.smallBlind,
    bigBlind: game.bigBlind,
    handOver: game.handOver,
    awards: game.awards.map((a) => ({ ...a })),
    log: game.log.map((l) => ({ ...l })),
    handNumber: game.handNumber,
  };
}

/** Die privaten Dokumente: pro Spieler seine zwei Karten. */
export function privateCardsFor(game: GameState, uids: string[]): Array<{ uid: string; cards: Card[] }> {
  if (uids.length !== game.players.length) {
    throw new Error('privateCardsFor: uids passen nicht zu den Spielern');
  }
  return game.players.map((p, i) => ({ uid: uids[i], cards: [...p.cards] }));
}

/** Eigene Karten zur Anzeige in den öffentlichen Zustand einsetzen (Kopie). */
export function withOwnCards(state: PublicState, uid: string, cards: Card[]): PublicState {
  return {
    ...state,
    players: state.players.map((p) =>
      p.uid === uid && p.cards.length === 0 ? { ...p, cards: [...cards] } : { ...p },
    ),
  };
}

/** Sitzindex eines Spielers im laufenden Spiel (-1 = sitzt nicht mit). */
export function indexOfUid(state: PublicState | null, uid: string): number {
  if (!state) return -1;
  return state.players.findIndex((p) => p.uid === uid);
}

export function playerOf(state: PublicState | null, uid: string): PublicPlayer | null {
  if (!state) return null;
  const i = indexOfUid(state, uid);
  return i < 0 ? null : state.players[i];
}

/** uid des Spielers, der am Zug ist (null = niemand). */
export function toActUid(state: PublicState | null): string | null {
  if (!state || state.handOver || state.toActIndex < 0) return null;
  return state.players[state.toActIndex]?.uid ?? null;
}

/** Darf dieser Spieler JETZT handeln? Einzige Autorisierungsregel am Tisch. */
export function canPlayerAct(state: PublicState | null, uid: string): boolean {
  return toActUid(state) === uid;
}

/** Legale Aktionen des Spielers am Zug – berechnet von der geprüften Engine. */
export function legalActionsFor(state: PublicState | null): LegalActions | null {
  if (!state || state.handOver || state.toActIndex < 0) return null;
  if (!state.players[state.toActIndex]) return null;
  return legalActions({ ...state, deck: [] });
}

export function potOf(state: PublicState | null): number {
  if (!state) return 0;
  return totalPot({ ...state, deck: [] });
}

/** Spiegelt exakt die Regeln aus engine.applyAction – eine illegale Aktion
    darf den Host nicht in eine Exception laufen lassen. */
export function isActionLegal(state: PublicState | null, action: Action): boolean {
  const la = legalActionsFor(state);
  if (!la || !state) return false;
  switch (action.type) {
    case 'fold':
      // Folden ist immer erlaubt (auch wenn Check gratis wäre).
      return true;
    case 'check':
      return la.canCheck;
    case 'call':
      // Call ohne offenen Einsatz behandelt die Engine als Check.
      return true;
    case 'raise': {
      if (!la.canBetOrRaise) return false;
      if (typeof action.to !== 'number' || !Number.isFinite(action.to)) return false;
      const to = Math.min(Math.floor(action.to), la.maxRaiseTo);
      if (to <= state.currentBet) return false;
      return to >= la.minRaiseTo || to === la.maxRaiseTo;
    }
    default:
      return false;
  }
}

/* ==========================================================================
   Zugwünsche prüfen (läuft beim Host – oder später in einer Cloud Function)
   ========================================================================== */

export type ActionReject =
  /** Es läuft gerade keine Hand. */
  | 'no-hand'
  /** Wunsch bezieht sich auf eine andere Hand. */
  | 'wrong-hand'
  /** Wunsch ist überholt (bereits angewandt). */
  | 'stale'
  | 'not-your-turn'
  | 'illegal';

export type PendingCheck = { ok: true; action: Action } | { ok: false; reason: ActionReject };

export function checkPending(room: RoomDoc, uid: string, pending: PendingAction | null): PendingCheck {
  if (!pending) return { ok: false, reason: 'no-hand' };
  if (room.phase !== 'hand' || !room.state) return { ok: false, reason: 'no-hand' };
  if (pending.handNumber !== room.handNumber) return { ok: false, reason: 'wrong-hand' };
  if (pending.seq !== room.seq) return { ok: false, reason: 'stale' };
  if (!canPlayerAct(room.state, uid)) return { ok: false, reason: 'not-your-turn' };
  if (!isActionLegal(room.state, pending.action)) return { ok: false, reason: 'illegal' };
  return { ok: true, action: pending.action };
}

/* ==========================================================================
   Anwesenheit
   ========================================================================== */

/** Anwesend, solange der letzte Herzschlag nicht älter als `timeout` ist.
    Ein Zeitstempel aus der Zukunft (Uhren laufen auseinander) gilt als
    anwesend – lieber jemanden zu lange sitzen lassen als grundlos werfen. */
export function onlineFrom(lastSeen: number, now: number, timeout: number = PRESENCE_TIMEOUT_MS): boolean {
  if (typeof lastSeen !== 'number' || !Number.isFinite(lastSeen) || lastSeen <= 0) return false;
  return now - lastSeen <= timeout;
}

export function onlineUids(members: MemberDoc[], now: number, timeout: number = PRESENCE_TIMEOUT_MS): string[] {
  return members.filter((m) => onlineFrom(m.lastSeen, now, timeout)).map((m) => m.uid);
}

export function isOnline(members: MemberDoc[], uid: string, now: number): boolean {
  const m = members.find((x) => x.uid === uid);
  return !!m && onlineFrom(m.lastSeen, now);
}

/* ==========================================================================
   Host-Nachfolge
   ========================================================================== */

/** Wer soll Host sein? Der bisherige Host bleibt es, solange er da ist.
    Sonst übernimmt der vorderste anwesende Sitz (bei Gleichstand der ältere
    Beitritt, dann alphabetisch nach uid – damit alle Clients unabhängig
    voneinander zum GLEICHEN Ergebnis kommen). */
export function chooseHost(room: RoomDoc, members: MemberDoc[], now: number): string | null {
  const online = members.filter((m) => onlineFrom(m.lastSeen, now));
  if (online.some((m) => m.uid === room.hostUid)) return room.hostUid;
  if (online.length === 0) return null;
  const seatRank = (uid: string): number => {
    const i = room.seats.findIndex((s) => s.uid === uid);
    return i < 0 ? room.seats.length + 1 : i;
  };
  const sorted = [...online].sort(
    (a, b) => seatRank(a.uid) - seatRank(b.uid) || a.joinedAt - b.joinedAt || (a.uid < b.uid ? -1 : 1),
  );
  return sorted[0].uid;
}

/** Soll ICH die Rolle übernehmen? (Nur dann darf der Client den Host wechseln.) */
export function shouldClaimHost(room: RoomDoc, members: MemberDoc[], now: number, myUid: string): boolean {
  if (room.hostUid === myUid) return false;
  return chooseHost(room, members, now) === myUid;
}

/* ==========================================================================
   Sitzplätze
   ========================================================================== */

export type SeatJoin =
  | { ok: true; seats: SeatInfo[]; created: boolean }
  | { ok: false; reason: 'full' | 'in-hand' };

/** Beitritt an den Tisch. Ein bereits sitzender Spieler behält seinen Platz
    und seinen Stack (Rückkehr nach Verbindungsabbruch). */
export function joinSeat(
  seats: SeatInfo[],
  member: { uid: string; name: string; joinedAt: number },
  config: RoomConfig,
  phase: RoomPhase = 'lobby',
): SeatJoin {
  const existing = seats.some((s) => s.uid === member.uid);
  if (existing) {
    const seatsCopy = seats.map((s) =>
      s.uid === member.uid ? { ...s, name: displayName(member.name) } : { ...s },
    );
    return { ok: true, seats: seatsCopy, created: false };
  }
  if (phase === 'hand') return { ok: false, reason: 'in-hand' };
  if (seats.length >= config.maxSeats) return { ok: false, reason: 'full' };
  return {
    ok: true,
    created: true,
    seats: [
      ...seats.map((s) => ({ ...s })),
      { uid: member.uid, name: displayName(member.name), stack: config.startStack, joinedAt: member.joinedAt },
    ],
  };
}

export function leaveSeat(seats: SeatInfo[], uid: string): SeatInfo[] {
  return seats.filter((s) => s.uid !== uid).map((s) => ({ ...s }));
}

/** Sitz um `delta` Plätze verschieben (Host ordnet die Runde vor dem Start). */
export function moveSeat(seats: SeatInfo[], uid: string, delta: number): SeatInfo[] {
  const from = seats.findIndex((s) => s.uid === uid);
  if (from < 0 || delta === 0) return seats.map((s) => ({ ...s }));
  const to = Math.min(seats.length - 1, Math.max(0, from + delta));
  if (to === from) return seats.map((s) => ({ ...s }));
  const next = seats.map((s) => ({ ...s }));
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

/** Sitzliste an die Mitgliederliste angleichen: Wer sein Mitgliedsdokument
    gelöscht hat (= bewusst gegangen), verliert den Platz; neue Mitglieder
    bekommen einen, solange Platz ist. Während einer laufenden Hand bleibt die
    Liste unangetastet – sonst würde die Engine mitten im Spiel stolpern. */
export function reconcileSeats(
  seats: SeatInfo[],
  members: MemberDoc[],
  config: RoomConfig,
  phase: RoomPhase = 'lobby',
): SeatInfo[] {
  if (phase === 'hand') return seats.map((s) => ({ ...s }));
  const byUid = new Map(members.map((m) => [m.uid, m]));
  const next = seats
    .filter((s) => byUid.has(s.uid))
    .map((s) => ({ ...s, name: displayName(byUid.get(s.uid)!.name) }));
  const seated = new Set(next.map((s) => s.uid));
  const waiting = members
    .filter((m) => !seated.has(m.uid))
    .sort((a, b) => a.joinedAt - b.joinedAt || (a.uid < b.uid ? -1 : 1));
  for (const m of waiting) {
    if (next.length >= config.maxSeats) break;
    next.push({ uid: m.uid, name: displayName(m.name), stack: config.startStack, joinedAt: m.joinedAt });
  }
  return next;
}

/** Spieler, die eine Hand mitspielen können: anwesend, bereit, mit Chips. */
export function startableSeats(seats: SeatInfo[], members: MemberDoc[], now: number): SeatInfo[] {
  const byUid = new Map(members.map((m) => [m.uid, m]));
  return seats.filter((s) => {
    const m = byUid.get(s.uid);
    return !!m && m.ready && onlineFrom(m.lastSeen, now) && s.stack > 0;
  });
}

export type StartCheck = { ok: true; seats: SeatInfo[] } | { ok: false; reason: 'too-few' | 'in-hand' };

export function canStartHand(room: RoomDoc, members: MemberDoc[], now: number): StartCheck {
  if (room.phase === 'hand') return { ok: false, reason: 'in-hand' };
  const seats = startableSeats(room.seats, members, now);
  if (seats.length < MIN_SEATS) return { ok: false, reason: 'too-few' };
  return { ok: true, seats: seats.slice(0, room.config.maxSeats) };
}

/** Nächster Button im Uhrzeigersinn – gemessen an der Sitzreihenfolge. */
export function nextButtonUid(seats: SeatInfo[], currentButtonUid: string | null): string | null {
  if (seats.length === 0) return null;
  const i = currentButtonUid ? seats.findIndex((s) => s.uid === currentButtonUid) : -1;
  if (i < 0) return seats[0].uid;
  return seats[(i + 1) % seats.length].uid;
}

/* ==========================================================================
   Hand starten und abrechnen
   ========================================================================== */

export interface HandSetup {
  game: GameState;
  /** uids in Engine-Reihenfolge – Index = Engine-Spieler-ID. */
  uids: string[];
  buttonUid: string;
  handNumber: number;
}

/** Baut die nächste Hand aus der Sitzliste. Gibt null zurück, wenn zu wenige
    Spieler übrig sind. Die Kartenlogik selbst kommt komplett aus der Engine. */
export function startHandFor(
  room: RoomDoc,
  playing: SeatInfo[],
  rng: () => number = Math.random,
): HandSetup | null {
  if (playing.length < MIN_SEATS) return null;
  const seats = playing.slice(0, MAX_SEATS);
  const buttonUid = nextButtonUid(seats, room.buttonUid) ?? seats[0].uid;
  const buttonIndex = Math.max(0, seats.findIndex((s) => s.uid === buttonUid));
  const handNumber = room.handNumber + 1;
  const game = createHand(
    seats.map((s, i) => ({ id: i, name: s.name, stack: s.stack, isHero: false })),
    buttonIndex,
    room.config.smallBlind,
    room.config.bigBlind,
    handNumber,
    rng,
  );
  return { game, uids: seats.map((s) => s.uid), buttonUid, handNumber };
}

/** Stände nach der Hand in die Sitzliste zurückschreiben (wer nicht mitgespielt
    hat, behält seinen Stack). */
export function settleStacks(seats: SeatInfo[], state: PublicState | null): SeatInfo[] {
  if (!state) return seats.map((s) => ({ ...s }));
  const byUid = new Map(state.players.map((p) => [p.uid, p.stack]));
  return seats.map((s) => ({ ...s, stack: byUid.get(s.uid) ?? s.stack }));
}

/* ==========================================================================
   Versionierung
   ========================================================================== */

export function bumpVersion(room: RoomDoc, now: number): Pick<RoomDoc, 'version' | 'updatedAt'> {
  return { version: room.version + 1, updatedAt: now };
}

/** Ist `incoming` neuer als der lokale Stand? Gleiche Version = kein Fortschritt. */
export function isNewer(local: RoomDoc | null, incoming: RoomDoc): boolean {
  if (!local) return true;
  return incoming.version > local.version;
}

/* ==========================================================================
   Sanitisierung – alles aus der Datenbank ist erst mal fremd
   ========================================================================== */

const STREETS: Street[] = ['preflop', 'flop', 'turn', 'river', 'showdown'];

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

function int(v: unknown, fallback = 0): number {
  return Math.trunc(num(v, fallback));
}

function str(v: unknown, max: number): string {
  return typeof v === 'string' ? v.slice(0, max) : '';
}

function cardList(v: unknown, max: number): Card[] {
  if (!Array.isArray(v)) return [];
  const out: Card[] = [];
  for (const c of v) {
    if (typeof c === 'number' && Number.isInteger(c) && c >= 0 && c < 52) out.push(c);
    if (out.length >= max) break;
  }
  return out;
}

function sanitizeSeat(v: unknown): SeatInfo | null {
  const s = (typeof v === 'object' && v !== null ? v : {}) as Record<string, unknown>;
  const uid = str(s.uid, 128);
  if (!uid) return null;
  return {
    uid,
    name: displayName(str(s.name, 64)),
    stack: Math.max(0, int(s.stack, 0)),
    joinedAt: Math.max(0, int(s.joinedAt, 0)),
  };
}

function sanitizeAction(v: unknown): Action | null {
  const a = (typeof v === 'object' && v !== null ? v : {}) as Record<string, unknown>;
  switch (a.type) {
    case 'fold':
    case 'check':
    case 'call':
      return { type: a.type };
    case 'raise': {
      const to = int(a.to, -1);
      return to >= 0 ? { type: 'raise', to } : null;
    }
    default:
      return null;
  }
}

export function sanitizePending(v: unknown): PendingAction | null {
  const p = (typeof v === 'object' && v !== null ? v : {}) as Record<string, unknown>;
  const action = sanitizeAction(p.action);
  if (!action) return null;
  return {
    action,
    handNumber: int(p.handNumber, -1),
    seq: int(p.seq, -1),
    at: Math.max(0, int(p.at, 0)),
  };
}

export function sanitizeMember(v: unknown): MemberDoc | null {
  const m = (typeof v === 'object' && v !== null ? v : {}) as Record<string, unknown>;
  const uid = str(m.uid, 128);
  if (!uid) return null;
  return {
    uid,
    name: displayName(str(m.name, 64)),
    ready: m.ready === true,
    lastSeen: Math.max(0, int(m.lastSeen, 0)),
    joinedAt: Math.max(0, int(m.joinedAt, 0)),
    pending: sanitizePending(m.pending),
  };
}

function sanitizePlayer(v: unknown): PublicPlayer | null {
  const p = (typeof v === 'object' && v !== null ? v : {}) as Record<string, unknown>;
  const uid = str(p.uid, 128);
  if (!uid) return null;
  return {
    uid,
    id: int(p.id, 0),
    name: displayName(str(p.name, 64)),
    isHero: false,
    stack: Math.max(0, int(p.stack, 0)),
    bet: Math.max(0, int(p.bet, 0)),
    committed: Math.max(0, int(p.committed, 0)),
    folded: p.folded === true,
    allIn: p.allIn === true,
    cards: cardList(p.cards, 2),
    hasActed: p.hasActed === true,
    revealed: p.revealed === true,
  };
}

export function sanitizePublicState(v: unknown): PublicState | null {
  const s = (typeof v === 'object' && v !== null ? v : {}) as Record<string, unknown>;
  if (!Array.isArray(s.players)) return null;
  const players: PublicPlayer[] = [];
  for (const raw of s.players) {
    const p = sanitizePlayer(raw);
    if (p) players.push(p);
    if (players.length >= MAX_SEATS) break;
  }
  if (players.length < MIN_SEATS) return null;
  const street = STREETS.includes(s.street as Street) ? (s.street as Street) : 'preflop';
  const awards: PotAward[] = Array.isArray(s.awards)
    ? (s.awards as unknown[]).slice(0, MAX_SEATS).map((a) => {
        const o = (typeof a === 'object' && a !== null ? a : {}) as Record<string, unknown>;
        const handName = str(o.handName, 40);
        return {
          playerId: int(o.playerId, 0),
          amount: Math.max(0, int(o.amount, 0)),
          ...(handName ? { handName } : {}),
        };
      })
    : [];
  const log: LogEntry[] = Array.isArray(s.log)
    ? (s.log as unknown[]).slice(-200).map((l) => {
        const o = (typeof l === 'object' && l !== null ? l : {}) as Record<string, unknown>;
        const entry: LogEntry = {
          street: STREETS.includes(o.street as Street) ? (o.street as Street) : 'preflop',
          text: str(o.text, 200),
        };
        if (typeof o.playerId === 'number') entry.playerId = int(o.playerId, 0);
        return entry;
      })
    : [];
  return {
    players,
    buttonIndex: Math.min(players.length - 1, Math.max(0, int(s.buttonIndex, 0))),
    board: cardList(s.board, 5),
    street,
    toActIndex: Math.min(players.length - 1, Math.max(-1, int(s.toActIndex, -1))),
    currentBet: Math.max(0, int(s.currentBet, 0)),
    lastRaiseSize: Math.max(0, int(s.lastRaiseSize, 0)),
    smallBlind: Math.max(1, int(s.smallBlind, 1)),
    bigBlind: Math.max(2, int(s.bigBlind, 2)),
    handOver: s.handOver === true,
    awards,
    log,
    handNumber: Math.max(0, int(s.handNumber, 0)),
  };
}

const PHASES: RoomPhase[] = ['lobby', 'hand', 'ended'];

export function sanitizeRoomDoc(v: unknown): RoomDoc | null {
  const r = (typeof v === 'object' && v !== null ? v : {}) as Record<string, unknown>;
  const code = normalizeRoomCode(str(r.code, 16));
  const hostUid = str(r.hostUid, 128);
  if (!isValidRoomCode(code) || !hostUid) return null;
  const seats: SeatInfo[] = [];
  if (Array.isArray(r.seats)) {
    for (const raw of r.seats) {
      const s = sanitizeSeat(raw);
      if (s && !seats.some((x) => x.uid === s.uid)) seats.push(s);
      if (seats.length >= MAX_SEATS) break;
    }
  }
  const buttonUid = str(r.buttonUid, 128);
  return {
    code,
    hostUid,
    createdAt: Math.max(0, int(r.createdAt, 0)),
    updatedAt: Math.max(0, int(r.updatedAt, 0)),
    version: Math.max(0, int(r.version, 0)),
    phase: PHASES.includes(r.phase as RoomPhase) ? (r.phase as RoomPhase) : 'lobby',
    config: sanitizeConfig(r.config),
    seats,
    state: sanitizePublicState(r.state),
    handNumber: Math.max(0, int(r.handNumber, 0)),
    buttonUid: buttonUid || null,
    seq: Math.max(0, int(r.seq, 0)),
  };
}

/** Eigene Hole-Cards aus tables/{code}/private/{uid}. */
export interface PrivateCardsDoc {
  handNumber: number;
  cards: Card[];
}

export function sanitizePrivateCards(v: unknown): PrivateCardsDoc | null {
  const p = (typeof v === 'object' && v !== null ? v : {}) as Record<string, unknown>;
  const cards = cardList(p.cards, 2);
  if (cards.length === 0) return null;
  return { handNumber: Math.max(0, int(p.handNumber, 0)), cards };
}
