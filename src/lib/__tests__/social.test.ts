/* Tests für die reine Freundes-Logik (src/lib/social/protocol.ts).
   Alles hier läuft ohne Firebase – genau das ist der Sinn der Trennung:
   Codes, Zustandsautomat, Anwesenheit und Sortierung sind vollständig
   überprüfbar, ohne dass ein Projekt in der Cloud existieren muss. */

import { describe, expect, it } from 'vitest';
import {
  CLOCK_SKEW_TOLERANCE_MS,
  CODE_ALPHABET,
  CODE_LENGTH,
  CODE_PAYLOAD_LENGTH,
  HEARTBEAT_INTERVAL_MS,
  MAX_NAME_LENGTH,
  PRESENCE_TIMEOUT_MS,
  allowedActions,
  canApply,
  codeBelongsTo,
  compareNames,
  countOnline,
  dedupeRequests,
  formatCode,
  friendCodeFor,
  isOnline,
  isValidCode,
  nextRelation,
  normalizeCode,
  parseCode,
  pendingRequests,
  rawFriendCode,
  resolveRelation,
  sanitizeFriend,
  sanitizeName,
  sanitizeRequest,
  sortFriends,
  sortRequests,
  toMillis,
  withPresence,
  type FriendEntry,
  type Relation,
  type RelationAction,
  type RequestEntry,
} from '../social/protocol';

function friend(uid: string, name: string, lastSeen: number | null = null): FriendEntry {
  return { uid, name, since: null, lastSeen };
}

function request(
  uid: string,
  name: string,
  createdAt: number | null = null,
  direction: 'incoming' | 'outgoing' = 'incoming',
): RequestEntry {
  return { uid, name, createdAt, direction };
}

/* ------------------------------------------------------------------ */

describe('Freundescode', () => {
  it('ist deterministisch, achtstellig und im erlaubten Alphabet', () => {
    const raw = rawFriendCode('uid-abc-123');
    expect(raw).toHaveLength(CODE_LENGTH);
    expect(raw).toBe(rawFriendCode('uid-abc-123'));
    for (const ch of raw) expect(CODE_ALPHABET).toContain(ch);
  });

  it('wird als XXXX-XXXX angezeigt und ist gültig', () => {
    const code = friendCodeFor('uid-abc-123');
    expect(code).toMatch(/^[0-9A-Z]{4}-[0-9A-Z]{4}$/);
    expect(isValidCode(code)).toBe(true);
  });

  it('enthält keine verwechselbaren Zeichen (I, L, O, U)', () => {
    for (const forbidden of ['I', 'L', 'O', 'U']) {
      expect(CODE_ALPHABET).not.toContain(forbidden);
    }
    for (let i = 0; i < 400; i++) {
      const raw = rawFriendCode(`user-${i}`);
      expect(raw).not.toMatch(/[ILOU]/);
    }
  });

  it('ohne UID gibt es keinen Code', () => {
    expect(rawFriendCode('')).toBe('');
    expect(friendCodeFor('')).toBe('');
  });

  it('verteilt sich gut: 500 UIDs ergeben 500 verschiedene Codes', () => {
    const codes = new Set<string>();
    for (let i = 0; i < 500; i++) codes.add(rawFriendCode(`firebase-uid-${i}`));
    expect(codes.size).toBe(500);
  });

  it('unterschiedliche UIDs mit gemeinsamem Präfix kollidieren nicht', () => {
    expect(rawFriendCode('abcdefghij1')).not.toBe(rawFriendCode('abcdefghij2'));
    expect(rawFriendCode('abcdefghij1')).not.toBe(rawFriendCode('1abcdefghij'));
  });

  it('akzeptiert Kleinschreibung, Leerzeichen und Bindestriche beim Abtippen', () => {
    const code = friendCodeFor('uid-xyz');
    const raw = rawFriendCode('uid-xyz');
    expect(parseCode(code.toLowerCase())).toBe(raw);
    expect(parseCode(`  ${code}  `)).toBe(raw);
    expect(parseCode(raw.split('').join(' '))).toBe(raw);
    expect(parseCode(`${raw.slice(0, 2)}-${raw.slice(2)}`)).toBe(raw);
  });

  it('bügelt die klassischen Lesefehler O→0 und I/L→1 aus', () => {
    expect(normalizeCode('O0I1L')).toBe('00111');
    expect(normalizeCode('o0i1l')).toBe('00111');
    // Ein echter Code bleibt gültig, wenn jemand O statt 0 tippt.
    const raw = rawFriendCode('uid-with-zero-test-42');
    const typed = raw.replace(/0/g, 'O').replace(/1/g, 'I');
    expect(parseCode(typed)).toBe(raw);
  });

  it('weist Unsinn, falsche Längen und U ab', () => {
    expect(isValidCode('')).toBe(false);
    expect(isValidCode('ABC')).toBe(false);
    expect(isValidCode('ABCDEFGHIJKLMNOP')).toBe(false);
    expect(isValidCode('ABCD-EF!H')).toBe(false);
    expect(normalizeCode('ABCDUFGH')).toBe('');
    expect(normalizeCode('äöüß')).toBe('');
  });

  it('erkennt JEDES einzelne falsch getippte Zeichen', () => {
    let tested = 0;
    for (let u = 0; u < 20; u++) {
      const raw = rawFriendCode(`uid-checksum-${u}`);
      for (let pos = 0; pos < raw.length; pos++) {
        for (const ch of CODE_ALPHABET) {
          if (ch === raw[pos]) continue;
          tested++;
          expect(isValidCode(raw.slice(0, pos) + ch + raw.slice(pos + 1))).toBe(false);
        }
      }
    }
    expect(tested).toBeGreaterThan(4000);
  });

  it('erkennt vertauschte Nachbarzeichen (bis auf den dokumentierten Sonderfall)', () => {
    let swapped = 0;
    for (let u = 0; u < 30; u++) {
      const raw = rawFriendCode(`uid-transposition-${u}`);
      // Nur innerhalb der Nutzdaten tauschen – das Prüfzeichen bleibt hinten.
      for (let i = 0; i < CODE_PAYLOAD_LENGTH - 1; i++) {
        if (raw[i] === raw[i + 1]) continue;
        swapped++;
        const broken = raw.slice(0, i) + raw[i + 1] + raw[i] + raw.slice(i + 2);
        const distance = Math.abs(CODE_ALPHABET.indexOf(raw[i]) - CODE_ALPHABET.indexOf(raw[i + 1]));
        // Erkannt – außer bei Abstand genau 16 (siehe Kommentar in checkChar).
        expect(isValidCode(broken)).toBe(distance === 16);
      }
    }
    expect(swapped).toBeGreaterThan(100);
  });

  it('formatCode ist idempotent und lässt kaputte Codes unverändert kurz', () => {
    const code = friendCodeFor('uid-format');
    expect(formatCode(code)).toBe(code);
    expect(formatCode('ABC')).toBe('ABC');
  });

  it('erkennt den eigenen Code (Anfrage an sich selbst)', () => {
    expect(codeBelongsTo(friendCodeFor('me'), 'me')).toBe(true);
    expect(codeBelongsTo(friendCodeFor('me'), 'someone-else')).toBe(false);
    expect(codeBelongsTo('nonsense', 'me')).toBe(false);
  });
});

/* ------------------------------------------------------------------ */

describe('Zustandsautomat', () => {
  const ALL_STATES: Relation[] = ['none', 'outgoing', 'incoming', 'friends', 'blocked'];
  const ALL_ACTIONS: RelationAction[] = [
    'send', 'accept', 'decline', 'cancel', 'remove', 'block', 'unblock',
  ];

  it('kennt den normalen Weg: anfragen → annehmen → entfernen', () => {
    expect(nextRelation('none', 'send')).toBe('outgoing');
    expect(nextRelation('incoming', 'accept')).toBe('friends');
    expect(nextRelation('friends', 'remove')).toBe('none');
  });

  it('kennt Ablehnen und Zurückziehen', () => {
    expect(nextRelation('incoming', 'decline')).toBe('none');
    expect(nextRelation('outgoing', 'cancel')).toBe('none');
  });

  it('löst gleichzeitige Anfragen als Freundschaft auf (keine Doppelanfrage)', () => {
    // B hat mir schon geschrieben; ich schicke – ohne es zu wissen – auch.
    expect(nextRelation('incoming', 'send')).toBe('friends');
    // Zweimal senden im selben Zustand bleibt harmlos.
    expect(nextRelation('outgoing', 'send')).toBe('outgoing');
  });

  it('verbietet unsinnige Übergänge', () => {
    expect(nextRelation('none', 'accept')).toBeNull();
    expect(nextRelation('none', 'remove')).toBeNull();
    expect(nextRelation('outgoing', 'accept')).toBeNull();
    expect(nextRelation('friends', 'accept')).toBeNull();
    expect(nextRelation('friends', 'send')).toBeNull();
    expect(nextRelation('blocked', 'send')).toBeNull();
    expect(nextRelation('blocked', 'accept')).toBeNull();
  });

  it('blockieren geht aus jedem offenen Zustand und ist eine Sackgasse', () => {
    for (const s of ['none', 'outgoing', 'incoming', 'friends'] as Relation[]) {
      expect(nextRelation(s, 'block')).toBe('blocked');
    }
    expect(allowedActions('blocked')).toEqual(['unblock']);
    expect(nextRelation('blocked', 'unblock')).toBe('none');
  });

  it('canApply und allowedActions passen zusammen', () => {
    for (const s of ALL_STATES) {
      const allowed = allowedActions(s);
      for (const a of ALL_ACTIONS) {
        expect(canApply(s, a)).toBe(allowed.includes(a));
      }
    }
  });

  it('erreicht aus jedem Zustand nur gültige Zustände', () => {
    for (const s of ALL_STATES) {
      for (const a of ALL_ACTIONS) {
        const next = nextRelation(s, a);
        if (next !== null) expect(ALL_STATES).toContain(next);
      }
    }
  });
});

describe('resolveRelation (Dokumente → Zustand)', () => {
  it('leerer Zustand ist none', () => {
    expect(resolveRelation({})).toBe('none');
  });

  it('einzelne Anfragen ergeben outgoing bzw. incoming', () => {
    expect(resolveRelation({ outgoingRequest: true })).toBe('outgoing');
    expect(resolveRelation({ incomingRequest: true })).toBe('incoming');
  });

  it('A→B und B→A gleichzeitig ergibt Freundschaft, keine zwei Anfragen', () => {
    expect(resolveRelation({ outgoingRequest: true, incomingRequest: true })).toBe('friends');
  });

  it('bestehende Freundschaft schlägt offene Anfragen', () => {
    expect(resolveRelation({ friend: true, incomingRequest: true })).toBe('friends');
    expect(resolveRelation({ friend: true, outgoingRequest: true })).toBe('friends');
  });

  it('blockiert schlägt alles', () => {
    expect(resolveRelation({ friend: true, blocked: true })).toBe('blocked');
    expect(resolveRelation({ incomingRequest: true, blockedBy: true })).toBe('blocked');
  });
});

/* ------------------------------------------------------------------ */

describe('Fremde Daten säubern', () => {
  it('übernimmt niemals die E-Mail-Adresse eines Freundes', () => {
    const raw = { name: 'Anna', email: 'anna@example.com', secret: 'x', since: 1000 };
    const f = sanitizeFriend('uid-anna', raw)!;
    expect(f).toEqual({ uid: 'uid-anna', name: 'Anna', since: 1000, lastSeen: null });
    expect(Object.keys(f)).toEqual(['uid', 'name', 'since', 'lastSeen']);
    expect(JSON.stringify(f)).not.toContain('@example.com');
  });

  it('kürzt Namen und wirft Steuerzeichen raus', () => {
    expect(sanitizeName('  Anna   Bell  ')).toBe('Anna Bell');
    expect(sanitizeName('A\u0000B\u0007C')).toBe('A B C');
    expect(sanitizeName('Zero\u200bWidth')).toBe('Zero Width');
    expect(sanitizeName('x'.repeat(200))).toHaveLength(MAX_NAME_LENGTH);
    expect(sanitizeName(42, 'Fallback')).toBe('Fallback');
    expect(sanitizeName('   ', 'Fallback')).toBe('Fallback');
  });

  it('braucht immer eine UID', () => {
    expect(sanitizeFriend('', {})).toBeNull();
    expect(sanitizeFriend(null, {})).toBeNull();
    expect(sanitizeRequest(undefined, {}, 'incoming')).toBeNull();
  });

  it('verwirft Anfragen mit gefälschtem Absender', () => {
    expect(sanitizeRequest('uid-b', { fromUid: 'uid-c', name: 'Fake' }, 'incoming')).toBeNull();
    expect(sanitizeRequest('uid-b', { fromUid: 'uid-b', name: 'Echt' }, 'incoming')).not.toBeNull();
    // Ohne fromUid-Feld zählt der Dokumentname.
    expect(sanitizeRequest('uid-b', { name: 'Echt' }, 'incoming')?.uid).toBe('uid-b');
  });

  it('versteht die Zeitformate von Firestore', () => {
    expect(toMillis(1700000000000)).toBe(1700000000000);
    expect(toMillis({ seconds: 1700, nanoseconds: 0 })).toBe(1_700_000);
    expect(toMillis({ toMillis: () => 4242 })).toBe(4242);
    expect(toMillis('2026-01-01T00:00:00.000Z')).toBe(Date.parse('2026-01-01T00:00:00.000Z'));
    // Noch nicht gesetzter serverTimestamp() und Müll ergeben null.
    expect(toMillis(null)).toBeNull();
    expect(toMillis(undefined)).toBeNull();
    expect(toMillis('gestern')).toBeNull();
    expect(toMillis(NaN)).toBeNull();
  });

  it('dampft doppelte Anfragen auf die neueste ein', () => {
    const list = [request('a', 'Alt', 100), request('a', 'Neu', 300), request('b', 'B', 200)];
    const out = dedupeRequests(list);
    expect(out).toHaveLength(2);
    expect(out.find((r) => r.uid === 'a')!.name).toBe('Neu');
  });

  it('blendet Anfragen aus, sobald die Freundschaft steht', () => {
    const reqs = [request('a', 'Anna', 1), request('b', 'Bea', 2)];
    const out = pendingRequests(reqs, [friend('a', 'Anna')]);
    expect(out.map((r) => r.uid)).toEqual(['b']);
  });
});

/* ------------------------------------------------------------------ */

describe('Anwesenheit', () => {
  const NOW = 1_700_000_000_000;

  it('frisches Lebenszeichen = online, altes = offline', () => {
    expect(isOnline(NOW - 1000, NOW)).toBe(true);
    expect(isOnline(NOW - (PRESENCE_TIMEOUT_MS - 1), NOW)).toBe(true);
    expect(isOnline(NOW - PRESENCE_TIMEOUT_MS, NOW)).toBe(false);
    expect(isOnline(NOW - 10 * PRESENCE_TIMEOUT_MS, NOW)).toBe(false);
  });

  it('ohne Zeitstempel ist niemand online', () => {
    expect(isOnline(null, NOW)).toBe(false);
    expect(isOnline(undefined, NOW)).toBe(false);
    expect(isOnline('kaputt', NOW)).toBe(false);
  });

  it('versteht ISO-Zeitstempel', () => {
    expect(isOnline(new Date(NOW - 5000).toISOString(), NOW)).toBe(true);
  });

  it('toleriert ungenaue Uhren, aber keine absurde Zukunft', () => {
    expect(isOnline(NOW + 30_000, NOW)).toBe(true);
    expect(isOnline(NOW + CLOCK_SKEW_TOLERANCE_MS, NOW)).toBe(true);
    expect(isOnline(NOW + CLOCK_SKEW_TOLERANCE_MS + 1, NOW)).toBe(false);
  });

  it('eigener Timeout überschreibt die Voreinstellung', () => {
    expect(isOnline(NOW - 5000, NOW, 1000)).toBe(false);
    expect(isOnline(NOW - 5000, NOW, 10_000)).toBe(true);
  });

  it('Heartbeat läuft mehrfach innerhalb des Timeouts (ein Ausfall schadet nicht)', () => {
    expect(HEARTBEAT_INTERVAL_MS * 2).toBeLessThan(PRESENCE_TIMEOUT_MS);
  });

  it('zählt die Online-Freunde für den grünen Punkt', () => {
    const list = [
      friend('a', 'Anna', NOW - 1000),
      friend('b', 'Bea', NOW - 10 * PRESENCE_TIMEOUT_MS),
      friend('c', 'Cem', NOW - 5000),
      friend('d', 'Dan', null),
    ];
    expect(countOnline(list, NOW)).toBe(2);
    expect(countOnline([], NOW)).toBe(0);
  });

  it('mischt Presence-Daten in die Freundesliste', () => {
    const list = [friend('a', 'Anna'), friend('b', 'Bea')];
    const merged = withPresence(list, { a: NOW - 1000 });
    expect(merged[0].lastSeen).toBe(NOW - 1000);
    expect(merged[1].lastSeen).toBeNull();
    // Original bleibt unberührt.
    expect(list[0].lastSeen).toBeNull();
  });
});

/* ------------------------------------------------------------------ */

describe('Sortierung', () => {
  const NOW = 1_700_000_000_000;
  const online = NOW - 1000;
  const offline = NOW - 10 * PRESENCE_TIMEOUT_MS;

  it('Online zuerst, dann alphabetisch', () => {
    const list = [
      friend('1', 'Zoe', online),
      friend('2', 'Anna', offline),
      friend('3', 'Bea', online),
      friend('4', 'Cem', offline),
    ];
    expect(sortFriends(list, NOW).map((f) => f.name)).toEqual(['Bea', 'Zoe', 'Anna', 'Cem']);
  });

  it('ignoriert Groß-/Kleinschreibung und Umlaute', () => {
    const list = [friend('1', 'Ökonom'), friend('2', 'anna'), friend('3', 'Zoe'), friend('4', 'Ärger')];
    expect(sortFriends(list, NOW).map((f) => f.name)).toEqual(['anna', 'Ärger', 'Ökonom', 'Zoe']);
  });

  it('namenlose Einträge landen hinten, gleiche Namen bleiben stabil', () => {
    const list = [friend('z', ''), friend('b', 'Anna'), friend('a', 'Anna')];
    expect(sortFriends(list, NOW).map((f) => f.uid)).toEqual(['a', 'b', 'z']);
    expect(compareNames(friend('a', ''), friend('b', 'Anna'))).toBeGreaterThan(0);
  });

  it('verändert die Eingabeliste nicht', () => {
    const list = [friend('1', 'Zoe', offline), friend('2', 'Anna', online)];
    const before = list.map((f) => f.uid);
    sortFriends(list, NOW);
    expect(list.map((f) => f.uid)).toEqual(before);
  });

  it('Anfragen: neueste zuerst', () => {
    const list = [request('a', 'Anna', 100), request('b', 'Bea', 300), request('c', 'Cem', 200)];
    expect(sortRequests(list).map((r) => r.uid)).toEqual(['b', 'c', 'a']);
  });

  it('Anfragen ohne Zeitstempel (serverTimestamp noch offen) rutschen nach hinten', () => {
    const list = [request('a', 'Anna', null), request('b', 'Bea', 300)];
    expect(sortRequests(list).map((r) => r.uid)).toEqual(['b', 'a']);
  });
});
