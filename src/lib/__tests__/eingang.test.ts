/* Der Eingang: was von außen hereinkommt.
   =====================================

   `sanitizeAppData` ist die einzige Tür, durch die fremde Daten in den
   Zustand der App gelangen — und sie hat drei Schlüssel:

   1. **Die Sicherungsdatei.** „Fortschritt exportieren" schreibt eine
      JSON-Datei, „importieren" liest eine. Was dazwischen mit ihr passiert,
      weiß niemand: Sie liegt auf einer Festplatte, geht durch einen
      Messenger, wird von Hand editiert.
   2. **Der Gerätespeicher.** Ein abgebrochener Schreibvorgang, ein zweiter
      Tab, ein Browser-Update — halb geschriebene Daten sind kein
      theoretischer Fall.
   3. **Die Cloud.** Was von dort kommt, hat dieselbe Tür zu nehmen.

   Getestet wurde diese Funktion bis E-045 nur *nebenbei*: `badges.test.ts`
   benutzt sie, um sich eine gültige Grundlage zu bauen, und
   `trainerkennungen.test.ts` schickt Trainer-Kennungen hindurch. **Kaputte
   Eingaben hat ihr niemand gegeben** — also genau das, wofür es sie gibt.

   Die Messlatte ist nicht „sie wirft keinen Fehler", sondern: **Was
   herauskommt, muss die App anzeigen können, ohne dass Unsinn dasteht.**
   Ein Zustand mit `handsPlayed: 1e15` stürzt nicht ab; er zeigt nur
   „1000000000000000 Hände gespielt", und das ist auf seine Art schlimmer,
   weil es aussieht wie ein Fehler der App. */

import { describe, expect, it } from 'vitest';
import { sanitizeAppData, type AppData } from '../../state/AppState';

/** Alles, was in einem angezeigten Zustand nicht vorkommen darf. */
function unbrauchbar(d: AppData): string | null {
  const zahlen: Array<[string, number]> = [
    ['xp', d.xp],
    ['handsPlayed', d.handsPlayed],
    ['handsWon', d.handsWon],
    ['streak.count', d.streak.count],
    /* `daily` ist von Haus aus `null`, solange heute noch kein Quiz lief —
       das ist kein kaputter Zustand, sondern der Normalfall am Morgen. */
    ...(d.daily ? ([['daily.score', d.daily.score], ['daily.total', d.daily.total]] as Array<[string, number]>) : []),
    ...d.sessions.flatMap((s): Array<[string, number]> => [
      [`Sitzung ${s.id}.buyIn`, s.buyIn],
      [`Sitzung ${s.id}.cashOut`, s.cashOut],
      [`Sitzung ${s.id}.minutes`, s.minutes],
    ]),
    ...Object.entries(d.trainers).flatMap(([k, t]): Array<[string, number]> =>
      Object.entries(t).map(([n, v]) => [`Trainer ${k}.${n}`, v] as [string, number])),
  ];
  for (const [name, wert] of zahlen) {
    if (!Number.isFinite(wert)) return `${name} ist keine Zahl (${wert})`;
    if (wert < 0) return `${name} ist negativ (${wert})`;
    if (!Number.isInteger(wert)) return `${name} hat Nachkommastellen (${wert})`;
    if (wert > 100_000_000) return `${name} ist unanzeigbar groß (${wert})`;
  }
  const datum = /^\d{4}-\d{2}-\d{2}([T ][\d:.+\-Z]{1,20})?$/;
  const daten: Array<[string, string]> = [
    ['streak.lastDay', d.streak.lastDay],
    ['usage.day', d.usage.day],
    ...(d.daily ? ([['daily.date', d.daily.date]] as Array<[string, string]>) : []),
    ...d.sessions.map((s): [string, string] => [`Sitzung ${s.id}.date`, s.date]),
    ...d.hands.map((h): [string, string] => [`Hand ${h.id}.date`, h.date]),
    ...d.reviews.map((r): [string, string] => [`Wiederholung ${r.key}.due`, r.due]),
    ...Object.entries(d.completedLessons).map(([k, l]): [string, string] => [`Lektion ${k}.completedAt`, l.completedAt]),
  ];
  for (const [name, wert] of daten) {
    if (wert === '') continue; // „noch nie" ist ein gültiger Zustand
    if (!datum.test(wert) || !isFinite(new Date(wert).getTime())) return `${name} ist kein Datum (${wert})`;
  }

  if (d.name.length > 40) return `name ist ${d.name.length} Zeichen lang`;
  if (d.sessions.length > 2000) return `${d.sessions.length} Sitzungen`;
  if (d.hands.length > 30) return `${d.hands.length} Hände in der Historie`;

  for (const h of d.hands) {
    if (h.players < 2 || h.players > 9) return `Hand ${h.id}: ${h.players} Spieler`;
    for (const c of [...h.heroCards, ...h.board]) {
      if (!Number.isInteger(c) || c < 0 || c > 51) return `Hand ${h.id}: Karte ${c}`;
    }
  }
  for (const [k, t] of Object.entries(d.trainers)) {
    if (t.correct > t.attempts) return `Trainer ${k}: ${t.correct} richtig von ${t.attempts} Versuchen`;
  }
  return null;
}

describe('Kaputte Eingaben ergeben einen brauchbaren Zustand', () => {
  it('überlebt alles, was gar keine Daten sind', () => {
    for (const müll of [null, undefined, 0, 'text', [], true, NaN, Symbol('x')]) {
      const d = sanitizeAppData(müll as unknown);
      expect(unbrauchbar(d), `Eingabe ${String(müll)}`).toBeNull();
      expect(d.xp).toBe(0);
    }
  });

  it('weist falsche Typen an jeder Stelle zurück', () => {
    const d = sanitizeAppData({
      xp: 'viel', handsPlayed: [], handsWon: {}, name: 42,
      completedLessons: 'keine', trainers: 7, badges: [], streak: 'lang',
      sessions: 'drei', reviews: {}, daily: 5, usage: [], hands: 'viele',
      handFacts: 'nichts', trialStartedAt: 12345,
    });
    expect(unbrauchbar(d)).toBeNull();
    expect(d.xp).toBe(0);
    expect(d.name).toBe('');
    expect(Object.keys(d.completedLessons)).toEqual([]);
    expect(d.sessions).toEqual([]);
    expect(d.hands).toEqual([]);
    expect(d.trialStartedAt).toBeNull();
  });

  it('bändigt unmögliche Zahlen', () => {
    const d = sanitizeAppData({
      xp: 1e308,
      handsPlayed: Number.MAX_SAFE_INTEGER,
      handsWon: -5,
      streak: { count: 1e20, lastDay: '2026-01-01' },
      daily: { date: '2026-01-01', score: Infinity, total: NaN },
    });
    expect(unbrauchbar(d)).toBeNull();
  });

  it('bändigt Nachkommastellen', () => {
    /* Ein halb gespieltes Blatt gibt es nicht. Solche Werte entstehen, wenn
       jemand eine Sicherung von Hand bearbeitet oder ein Rechenfehler
       irgendwo eine Division hinterlässt. */
    const d = sanitizeAppData({
      xp: 12.7, handsPlayed: 3.5, handsWon: 0.1,
      streak: { count: 2.5, lastDay: '2026-01-01' },
      trainers: { outs: { attempts: 10.5, correct: 3.3, streak: 0.9, bestStreak: 1.1 } },
    });
    expect(unbrauchbar(d)).toBeNull();
  });

  it('nimmt nur Karten an, die es im Blatt gibt', () => {
    /* Ein Kartenindex ist ein Platz im Blatt, kein Messwert. `RANKS[c % 13]`
       bei c = 12,5 ergibt „undefined" auf dem Tisch. */
    const d = sanitizeAppData({
      hands: [{ id: 'h1', players: 6.5, heroCards: [12.5, -1, 52, 'A', null, 7], board: [3, 3.0001] }],
    });
    expect(unbrauchbar(d)).toBeNull();
    expect(d.hands[0].heroCards).toEqual([7]);
    expect(d.hands[0].board).toEqual([3]);
  });

  it('nimmt nur Datumsangaben an, die welche sind', () => {
    /* Ein Datumsfeld wird angezeigt, sortiert und in die CSV geschrieben.
       Steht dort „gestern" oder „=1+1", ist das kein ungefähres Datum,
       sondern keines. */
    const d = sanitizeAppData({
      streak: { lastDay: 'gestern', count: 3 },
      usage: { day: '2026-13-45', counts: {} },
      daily: { date: '=1+1', score: 3, total: 5 },
      completedLessons: { 'm1-l1': { completedAt: 'irgendwann', quizScore: 1, quizTotal: 2 } },
      sessions: [{ id: 's1', date: '01.09.2026', buyIn: 1, cashOut: 2 }],
      hands: [{ id: 'h1', date: '5', players: 6 }],
      reviews: [{ key: 'k', moduleId: 'm1', lessonId: 'm1-l1', due: 'morgen' }],
      trialStartedAt: 'niemals',
    });
    expect(unbrauchbar(d)).toBeNull();
    expect(d.trialStartedAt).toBeNull();
  });

  it('lässt echte Datumsangaben unangetastet', () => {
    const d = sanitizeAppData({
      streak: { lastDay: '2026-09-05', count: 3 },
      completedLessons: { 'm1-l1': { completedAt: '2026-09-01T10:20:30.400Z', quizScore: 1, quizTotal: 2 } },
      hands: [{ id: 'h1', date: '2026-09-01T10:20:30.400Z', players: 6 }],
      trialStartedAt: '2026-08-30T08:00:00.000Z',
    });
    expect(unbrauchbar(d)).toBeNull();
    expect(d.streak.lastDay).toBe('2026-09-05');
    expect(d.completedLessons['m1-l1'].completedAt).toBe('2026-09-01T10:20:30.400Z');
    expect(d.hands[0].date).toBe('2026-09-01T10:20:30.400Z');
    expect(d.trialStartedAt).toBe('2026-08-30T08:00:00.000Z');
  });

  it('hält die Ordnung der Zähler ein', () => {
    /* „22 richtig von 3 Versuchen" ist keine Zahl, die die App je schreiben
       würde — `recordTrainer` zählt Versuche zuerst. */
    const d = sanitizeAppData({
      handsPlayed: 10, handsWon: 400,
      trainers: { outs: { attempts: 3, correct: 22, streak: 99, bestStreak: 1 } },
      daily: { date: '2026-09-01', score: 9, total: 5 },
      completedLessons: { 'm1-l1': { completedAt: '2026-09-01', quizScore: 8, quizTotal: 6 } },
    });
    expect(unbrauchbar(d)).toBeNull();
    expect(d.handsWon).toBeLessThanOrEqual(d.handsPlayed);
    expect(d.trainers.outs.correct).toBeLessThanOrEqual(d.trainers.outs.attempts);
    expect(d.trainers.outs.streak).toBeLessThanOrEqual(d.trainers.outs.correct);
    expect(d.daily?.score).toBeLessThanOrEqual(d.daily!.total);
    expect(d.completedLessons['m1-l1'].quizScore).toBeLessThanOrEqual(d.completedLessons['m1-l1'].quizTotal);
  });

  it('lässt keine Riesenlisten durch', () => {
    const d = sanitizeAppData({
      sessions: Array.from({ length: 50_000 }, (_, i) => ({ id: `s${i}`, buyIn: 1, cashOut: 2 })),
      hands: Array.from({ length: 5000 }, (_, i) => ({ id: `h${i}`, players: 6 })),
      reviews: Array.from({ length: 50_000 }, () => ({ lessonId: 'm1-l1', moduleId: 'm1' })),
    });
    expect(unbrauchbar(d)).toBeNull();
    expect(d.sessions.length).toBeLessThanOrEqual(2000);
    expect(d.hands.length).toBeLessThanOrEqual(30);
    expect(d.reviews.length).toBeLessThanOrEqual(2000);
  });

  it('kürzt überlange Texte', () => {
    const lang = 'A'.repeat(100_000);
    const d = sanitizeAppData({
      name: lang,
      sessions: [{ id: lang, game: lang, notes: lang, buyIn: 1, cashOut: 1 }],
      hands: [{ id: lang, players: 6, log: Array.from({ length: 5000 }, () => lang) }],
    });
    expect(unbrauchbar(d)).toBeNull();
    expect(d.name.length).toBeLessThanOrEqual(40);
    expect(d.sessions[0].game.length).toBeLessThanOrEqual(80);
    expect(d.hands[0].log.length).toBeLessThanOrEqual(200);
    for (const z of d.hands[0].log) expect(z.length).toBeLessThanOrEqual(300);
  });

  it('lässt sich den Prototyp nicht verbiegen', () => {
    /* `JSON.parse` legt `__proto__` als gewöhnliche Eigenschaft an, und
       `Object.entries` gibt sie heraus. Ein Schlüsselfilter, der das nicht
       bedenkt, schriebe sie in die Zielstruktur. */
    const roh = JSON.parse(
      '{"xp":1,"completedLessons":{"__proto__":{"geklaut":true}},'
      + '"trainers":{"__proto__":{"attempts":9}},'
      + '"badges":{"__proto__":"2026-01-01"},'
      + '"usage":{"day":"2026-01-01","counts":{"__proto__":99}}}',
    );
    const d = sanitizeAppData(roh);
    expect(unbrauchbar(d)).toBeNull();
    expect(Object.keys(d.completedLessons)).toEqual([]);
    expect(Object.keys(d.trainers)).toEqual([]);
    expect(Object.keys(d.badges)).toEqual([]);
    expect(Object.keys(d.usage.counts)).toEqual([]);
    expect(({} as Record<string, unknown>).geklaut).toBeUndefined();
  });

  it('nimmt echte Daten unverändert an', () => {
    /* Die Gegenprobe: Eine Tür, die alles abweist, ist auch keine. */
    const echt = {
      xp: 450,
      handsPlayed: 120,
      handsWon: 44,
      name: 'Lorenz',
      completedLessons: { 'm1-l1': { completedAt: '2026-09-01', quizScore: 5, quizTotal: 6 } },
      trainers: { outs: { attempts: 30, correct: 22, streak: 4, bestStreak: 9 } },
      streak: { lastDay: '2026-09-05', count: 3 },
      sessions: [{ id: 's1', date: '2026-09-01', type: 'live', game: '1/2 NLH', buyIn: 100, cashOut: 180, minutes: 240 }],
      hands: [{ id: 'h1', date: '2026-09-01', handNumber: 3, heroCards: [0, 13], board: [4, 20, 33], result: 'won', amount: 40, players: 6, log: ['Bruno setzt 5'] }],
    };
    const d = sanitizeAppData(echt);
    expect(unbrauchbar(d)).toBeNull();
    expect(d.xp).toBe(450);
    expect(d.name).toBe('Lorenz');
    expect(d.completedLessons['m1-l1'].quizScore).toBe(5);
    expect(d.trainers.outs.correct).toBe(22);
    expect(d.sessions).toHaveLength(1);
    expect(d.sessions[0].cashOut).toBe(180);
    expect(d.hands).toHaveLength(1);
    expect(d.hands[0].heroCards).toEqual([0, 13]);
  });

  it('ist in sich abgeschlossen: zweimal durchgereicht ändert nichts', () => {
    /* Wer aus der Cloud lädt, schickt die Daten durch dieselbe Tür wie beim
       Import. Käme dabei jedes Mal etwas anderes heraus, driftete ein
       Gerätestand bei jedem Abgleich weiter. */
    const einmal = sanitizeAppData({
      xp: 12.7, handsPlayed: 3.5, name: 'A'.repeat(80),
      sessions: [{ id: 's1', buyIn: 1.5, cashOut: 2.5, minutes: 10.5 }],
      trainers: { outs: { attempts: 5.5, correct: 2.5, streak: 1.5, bestStreak: 3.5 } },
    });
    const zweimal = sanitizeAppData(einmal);
    expect(zweimal).toEqual(einmal);
  });
});
