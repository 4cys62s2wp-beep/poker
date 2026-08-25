/* Freundes-System – reine Logik, komplett ohne Firebase.

   Dieses Modul enthält alles, was sich ohne Netzwerk entscheiden lässt:
   Freundescodes, den Zustandsautomaten für Anfragen, die Auswertung der
   Anwesenheit („online seit …") sowie das Sortieren und Zählen von Listen.
   Damit ist die eigentliche Logik des Features vollständig testbar – der
   Firestore-Adapter (friends.ts) bleibt eine dünne Hülle darum.

   Datenschutz: Für andere Nutzer sind ausschließlich Anzeigename und
   Online-Status sichtbar. Die Sanitizer unten bauen die Objekte deshalb
   Feld für Feld neu auf – ein versehentlich mitgeliefertes Feld wie
   `email` kann so gar nicht erst in die App gelangen. */

/* ------------------------------------------------------------------ *
 * Konstanten
 * ------------------------------------------------------------------ */

/** Nach dieser Zeit ohne Lebenszeichen gilt jemand als offline. */
export const PRESENCE_TIMEOUT_MS = 120_000;

/** Abstand der Lebenszeichen. Muss deutlich kleiner als der Timeout sein,
    damit ein einzelnes verlorenes Signal niemanden offline schaltet. */
export const HEARTBEAT_INTERVAL_MS = 45_000;

/** Toleranz für vorgehende Uhren: Der Zeitstempel kommt vom Server, der
    Vergleich läuft lokal. Ein paar Minuten Abweichung sind normal. */
export const CLOCK_SKEW_TOLERANCE_MS = 300_000;

/** Anzeigenamen werden hart gekürzt (fremde Eingabe!). */
export const MAX_NAME_LENGTH = 40;

/** Obergrenze für Freundeslisten – schützt UI und Firestore-Kosten. */
export const MAX_FRIENDS = 200;

/* ------------------------------------------------------------------ *
 * Freundescode
 * ------------------------------------------------------------------ */

/** Crockford-Base32: ohne I, L, O und U – dadurch keine Verwechslung
    zwischen 0/O und 1/I/l und keine zufällig entstehenden Wörter. */
export const CODE_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

/** 7 Zeichen aus der UID + 1 Prüfzeichen. */
export const CODE_PAYLOAD_LENGTH = 7;
export const CODE_LENGTH = CODE_PAYLOAD_LENGTH + 1;

/** Zeichen, die beim Abtippen erlaubt sind, aber ignoriert werden. */
const CODE_SEPARATORS = new Set([' ', '-', '_', '.', '\t', ' ']);

/** Häufige Lesefehler auf das echte Zeichen abbilden (Crockford-Regel). */
const CODE_ALIASES: Record<string, string> = { O: '0', I: '1', L: '1' };

/**
 * Eingabe säubern: Groß-/Kleinschreibung, Trennzeichen und die typischen
 * Verwechslungen werden abgefangen. Enthält die Eingabe ein Zeichen, das
 * gar nicht zum Alphabet gehört, ist der Code kaputt → leerer String.
 */
export function normalizeCode(raw: string): string {
  if (typeof raw !== 'string') return '';
  let out = '';
  for (const ch of raw.toUpperCase()) {
    if (CODE_SEPARATORS.has(ch)) continue;
    const mapped = CODE_ALIASES[ch] ?? ch;
    if (!CODE_ALPHABET.includes(mapped)) return '';
    out += mapped;
    if (out.length > CODE_LENGTH) return '';
  }
  return out;
}

/** 32-Bit-FNV-1a – klein, schnell, gut gestreut und überall identisch. */
function fnv1a(input: string, seed: number): number {
  let h = seed >>> 0;
  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    h ^= code & 0xff;
    h = Math.imul(h, 0x01000193) >>> 0;
    // Zeichen jenseits von Latin-1 (Emoji o. Ä.) vollständig einbeziehen.
    h ^= code >>> 8;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/**
 * Prüfzeichen über eine gewichtete Summe modulo 32.
 *
 * Die Gewichte sind ungerade (1, 3, 5, …) und damit modulo 32 invertierbar.
 * Daraus folgt: JEDES einzelne falsch getippte Zeichen fällt garantiert auf.
 * Vertauschte Nachbarzeichen werden ebenfalls erkannt – außer wenn sich ihre
 * Positionen im Alphabet um genau 16 unterscheiden (Gewichtsdifferenz 2,
 * 2·16 = 32 ≡ 0). Dieser Rest ist bewusst in Kauf genommen: Ein achtstelliger
 * Code aus einem 32er-Alphabet kann nicht mehr leisten, und der Server prüft
 * ohnehin, ob es den Code überhaupt gibt.
 */
function checkChar(payload: string): string {
  let sum = 0;
  for (let i = 0; i < payload.length; i++) {
    sum += (CODE_ALPHABET.indexOf(payload[i]) + 1) * (2 * i + 1);
  }
  return CODE_ALPHABET[((sum % CODE_ALPHABET.length) + CODE_ALPHABET.length) % CODE_ALPHABET.length];
}

/** Rohcode (8 Zeichen, ohne Bindestrich) für eine UID. */
export function rawFriendCode(uid: string): string {
  if (typeof uid !== 'string' || uid.length === 0) return '';
  const h1 = fnv1a(uid, 0x811c9dc5);
  const h2 = fnv1a(`${uid}#pokermentor-social`, 0x9e3779b1);
  let payload = '';
  for (let i = 0; i < CODE_PAYLOAD_LENGTH; i++) {
    // 6 Zeichen aus h1 (30 Bit), das siebte aus h2 – zusammen 35 Bit.
    const source = i < 6 ? h1 >>> (5 * i) : h2;
    payload += CODE_ALPHABET[source & 31];
  }
  return payload + checkChar(payload);
}

/** Anzeigeform mit Bindestrich: leichter vorzulesen und abzutippen. */
export function formatCode(code: string): string {
  const c = normalizeCode(code);
  if (c.length !== CODE_LENGTH) return c;
  return `${c.slice(0, 4)}-${c.slice(4)}`;
}

/** Der Code, den ein Nutzer weitergibt – stabil, aus der UID abgeleitet. */
export function friendCodeFor(uid: string): string {
  const raw = rawFriendCode(uid);
  return raw ? formatCode(raw) : '';
}

/** Eingetippten Code prüfen und normalisieren (null = ungültig). */
export function parseCode(raw: string): string | null {
  const c = normalizeCode(raw);
  if (c.length !== CODE_LENGTH) return null;
  const payload = c.slice(0, CODE_PAYLOAD_LENGTH);
  return checkChar(payload) === c[CODE_PAYLOAD_LENGTH] ? c : null;
}

export function isValidCode(raw: string): boolean {
  return parseCode(raw) !== null;
}

/** Gehört der Code zu dieser UID? (Anfragen an sich selbst abfangen.) */
export function codeBelongsTo(code: string, uid: string): boolean {
  const parsed = parseCode(code);
  return parsed !== null && parsed === rawFriendCode(uid);
}

/* ------------------------------------------------------------------ *
 * Zustandsautomat für Freundschaften
 * ------------------------------------------------------------------ */

export type Relation = 'none' | 'outgoing' | 'incoming' | 'friends' | 'blocked';

export type RelationAction =
  | 'send'
  | 'accept'
  | 'decline'
  | 'cancel'
  | 'remove'
  | 'block'
  | 'unblock';

/**
 * Erlaubte Übergänge. Alles, was hier nicht steht, ist verboten – der
 * Automat gibt dann null zurück und die UI bietet den Knopf gar nicht erst an.
 *
 * Besonderheit `incoming + send → friends`: Schicken beide Seiten gleichzeitig
 * eine Anfrage, entsteht keine zweite offene Anfrage, sondern sofort eine
 * Freundschaft (dieselbe Regel noch einmal datenseitig in resolveRelation).
 */
const TRANSITIONS: Record<Relation, Partial<Record<RelationAction, Relation>>> = {
  none: { send: 'outgoing', block: 'blocked' },
  outgoing: { cancel: 'none', block: 'blocked', send: 'outgoing' },
  incoming: { accept: 'friends', decline: 'none', send: 'friends', block: 'blocked' },
  friends: { remove: 'none', block: 'blocked' },
  // Blockieren ist bewusst eine Sackgasse: nur das Aufheben führt heraus.
  blocked: { unblock: 'none' },
};

/** Nächster Zustand oder null, wenn die Aktion in diesem Zustand verboten ist. */
export function nextRelation(state: Relation, action: RelationAction): Relation | null {
  return TRANSITIONS[state][action] ?? null;
}

export function canApply(state: Relation, action: RelationAction): boolean {
  return nextRelation(state, action) !== null;
}

/** Alle Aktionen, die die UI in diesem Zustand anbieten darf. */
export function allowedActions(state: Relation): RelationAction[] {
  return Object.keys(TRANSITIONS[state]) as RelationAction[];
}

/** Rohzustand aus der Datenbank – unabhängig geschriebene Dokumente. */
export interface RelationFacts {
  /** Ich habe die Person in meiner Freundesliste. */
  friend?: boolean;
  /** Meine Anfrage liegt bei ihr. */
  outgoingRequest?: boolean;
  /** Ihre Anfrage liegt bei mir. */
  incomingRequest?: boolean;
  /** Ich habe blockiert. */
  blocked?: boolean;
  /** Ich wurde blockiert. */
  blockedBy?: boolean;
}

/**
 * Entkoppelte Dokumente zu einem Zustand zusammenführen.
 *
 * Die wichtige Regel ist `outgoingRequest && incomingRequest`: Schicken A und B
 * zur selben Zeit eine Anfrage, sieht jede Seite eine ausgehende UND eine
 * eingehende – das ist beidseitige Zustimmung und wird als Freundschaft
 * gewertet, nicht als zwei offene Anfragen.
 */
export function resolveRelation(facts: RelationFacts): Relation {
  if (facts.blocked || facts.blockedBy) return 'blocked';
  if (facts.friend) return 'friends';
  if (facts.outgoingRequest && facts.incomingRequest) return 'friends';
  if (facts.outgoingRequest) return 'outgoing';
  if (facts.incomingRequest) return 'incoming';
  return 'none';
}

/* ------------------------------------------------------------------ *
 * Datensätze säubern (fremde Daten!)
 * ------------------------------------------------------------------ */

export interface FriendEntry {
  uid: string;
  /** Anzeigename – mehr sehen Freunde nicht (insbesondere keine E-Mail). */
  name: string;
  /** Freund seit (ms) oder null. */
  since: number | null;
  /** Letztes Lebenszeichen (ms) oder null – wird aus presence nachgetragen. */
  lastSeen: number | null;
}

export interface RequestEntry {
  uid: string;
  name: string;
  createdAt: number | null;
  direction: 'incoming' | 'outgoing';
}

/** Zeitangaben aus Firestore (Timestamp, ISO-String, Millisekunden) vereinheitlichen. */
export function toMillis(raw: unknown): number | null {
  if (typeof raw === 'number') return isFinite(raw) ? raw : null;
  if (typeof raw === 'string') {
    const t = new Date(raw).getTime();
    return isFinite(t) ? t : null;
  }
  if (raw && typeof raw === 'object') {
    const obj = raw as { toMillis?: () => number; seconds?: number };
    if (typeof obj.toMillis === 'function') {
      const t = obj.toMillis();
      return typeof t === 'number' && isFinite(t) ? t : null;
    }
    if (typeof obj.seconds === 'number' && isFinite(obj.seconds)) return obj.seconds * 1000;
  }
  return null;
}

/** Fremder Anzeigename: Steuerzeichen raus, Leerraum zusammenfassen, kürzen. */
export function sanitizeName(raw: unknown, fallback = ''): string {
  if (typeof raw !== 'string') return fallback;
  const cleaned = raw
    .replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u2028\u2029]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned ? cleaned.slice(0, MAX_NAME_LENGTH) : fallback;
}

/**
 * Freundes-Dokument aufbauen. Bewusst Feld für Feld – alles andere aus dem
 * Rohdatensatz (z. B. eine versehentlich gespeicherte E-Mail) wird verworfen.
 */
export function sanitizeFriend(uid: unknown, raw: unknown, fallbackName = ''): FriendEntry | null {
  if (typeof uid !== 'string' || !uid) return null;
  const data = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  return {
    uid,
    name: sanitizeName(data.name, fallbackName),
    since: toMillis(data.since ?? data.createdAt),
    lastSeen: null,
  };
}

export function sanitizeRequest(
  uid: unknown,
  raw: unknown,
  direction: 'incoming' | 'outgoing',
  fallbackName = '',
): RequestEntry | null {
  if (typeof uid !== 'string' || !uid) return null;
  const data = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  // Gefälschte Absender abfangen: Steht im Dokument eine andere UID als im
  // Dokumentnamen, ist der Datensatz manipuliert (die Regeln erzwingen Gleichheit).
  const claimed = data.fromUid;
  if (direction === 'incoming' && typeof claimed === 'string' && claimed !== uid) return null;
  return {
    uid,
    name: sanitizeName(data.name, fallbackName),
    createdAt: toMillis(data.createdAt),
    direction,
  };
}

/** Mehrfach eingegangene Anfragen derselben Person auf die neueste eindampfen. */
export function dedupeRequests(list: readonly RequestEntry[]): RequestEntry[] {
  const byUid = new Map<string, RequestEntry>();
  for (const r of list) {
    const prev = byUid.get(r.uid);
    if (!prev || (r.createdAt ?? 0) >= (prev.createdAt ?? 0)) byUid.set(r.uid, r);
  }
  return [...byUid.values()];
}

/**
 * Anfragen fallen weg, sobald die Freundschaft steht (z. B. weil beide
 * gleichzeitig angefragt haben). Sonst bliebe eine tote Anfrage in der Liste.
 */
export function pendingRequests(
  requests: readonly RequestEntry[],
  friends: readonly FriendEntry[],
): RequestEntry[] {
  const friendUids = new Set(friends.map((f) => f.uid));
  return dedupeRequests(requests).filter((r) => !friendUids.has(r.uid));
}

/* ------------------------------------------------------------------ *
 * Anwesenheit
 * ------------------------------------------------------------------ */

/**
 * Ist jemand gerade online?
 *
 * `lastSeen` schreibt der Server, verglichen wird lokal – deshalb sind
 * Zeitstempel „aus der Zukunft" normal (ungenaue Uhr) und gelten weiter als
 * online. Erst jenseits der Toleranz ist der Wert unbrauchbar → offline.
 */
export function isOnline(
  lastSeen: number | string | null | undefined,
  now: number,
  timeoutMs: number = PRESENCE_TIMEOUT_MS,
): boolean {
  const ts = toMillis(lastSeen ?? null);
  if (ts === null) return false;
  const age = now - ts;
  if (age < 0) return -age <= CLOCK_SKEW_TOLERANCE_MS;
  return age < timeoutMs;
}

/** Wie viele Freunde sind gerade online? (Zahl im grünen Punkt.) */
export function countOnline(
  friends: readonly FriendEntry[],
  now: number,
  timeoutMs: number = PRESENCE_TIMEOUT_MS,
): number {
  let n = 0;
  for (const f of friends) if (isOnline(f.lastSeen, now, timeoutMs)) n++;
  return n;
}

/** Presence-Daten (uid → lastSeen) in die Freundesliste einmischen. */
export function withPresence(
  friends: readonly FriendEntry[],
  presence: Readonly<Record<string, number | null>>,
): FriendEntry[] {
  return friends.map((f) => ({ ...f, lastSeen: presence[f.uid] ?? null }));
}

/* ------------------------------------------------------------------ *
 * Sortieren
 * ------------------------------------------------------------------ */

/** Namen alphabetisch, Groß-/Kleinschreibung und Umlaute egal; leere ans Ende. */
export function compareNames(a: FriendEntry, b: FriendEntry): number {
  if (!a.name && b.name) return 1;
  if (a.name && !b.name) return -1;
  const byName = a.name.localeCompare(b.name, 'de', { sensitivity: 'base', numeric: true });
  // Stabiler Tiebreak, damit die Liste bei gleichen Namen nicht springt.
  return byName !== 0 ? byName : a.uid.localeCompare(b.uid);
}

/** Online zuerst, dann alphabetisch. Gibt eine neue Liste zurück. */
export function sortFriends(
  friends: readonly FriendEntry[],
  now: number,
  timeoutMs: number = PRESENCE_TIMEOUT_MS,
): FriendEntry[] {
  return [...friends].sort((a, b) => {
    const oa = isOnline(a.lastSeen, now, timeoutMs) ? 0 : 1;
    const ob = isOnline(b.lastSeen, now, timeoutMs) ? 0 : 1;
    return oa !== ob ? oa - ob : compareNames(a, b);
  });
}

/** Anfragen: neueste zuerst, danach alphabetisch. */
export function sortRequests(requests: readonly RequestEntry[]): RequestEntry[] {
  return [...requests].sort((a, b) => {
    const ta = a.createdAt ?? 0;
    const tb = b.createdAt ?? 0;
    if (ta !== tb) return tb - ta;
    return (
      a.name.localeCompare(b.name, 'de', { sensitivity: 'base' }) || a.uid.localeCompare(b.uid)
    );
  });
}
