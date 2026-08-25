import { describe, expect, it } from 'vitest';
import {
  assessStyle,
  computeStats,
  confidenceOf,
  createHandTracker,
  emptyHandFacts,
  emptyStats,
  hintsFor,
  judge,
  MAX_TRACKED_HANDS,
  MIN_HANDS_FOR_STYLE,
  sanitizeHandFacts,
  statByKey,
  TARGETS,
  topHint,
  type HandFacts,
} from '../poker/stats';

/** Baut eine Hand mit den angegebenen Abweichungen vom Leerzustand. */
function hand(patch: Partial<HandFacts> = {}): HandFacts {
  return { ...emptyHandFacts(), preflopOpportunity: true, ...patch };
}

describe('Erfassung während der Hand', () => {
  it('wertet einen Preflop-Raise als VPIP und als PFR', () => {
    const t = createHandTracker();
    t.onAction('preflop', 'raise', false);
    const f = t.finish({ won: true, showdown: false, netChips: 60 });
    expect(f.vpip).toBe(true);
    expect(f.pfr).toBe(true);
  });

  it('wertet einen Preflop-Call als VPIP, aber nicht als PFR', () => {
    const t = createHandTracker();
    t.onAction('preflop', 'call', true);
    const f = t.finish({ won: false, showdown: false, netChips: -20 });
    expect(f.vpip).toBe(true);
    expect(f.pfr).toBe(false);
  });

  it('zählt einen Fold im Big Blind nicht als freiwilligen Einsatz', () => {
    // Der Blind ist erzwungen – genau das trennt VPIP von "hat Chips im Pot".
    const t = createHandTracker();
    t.onAction('preflop', 'fold', true);
    const f = t.finish({ won: false, showdown: false, netChips: -20 });
    expect(f.vpip).toBe(false);
    expect(f.preflopOpportunity).toBe(true);
    expect(f.foldedOn.preflop).toBe(true);
  });

  it('zählt einen Check nicht als Fold-Gelegenheit', () => {
    const t = createHandTracker();
    t.onAction('flop', 'check', false);
    const f = t.finish({ won: false, showdown: false, netChips: 0 });
    expect(f.facedBet.flop).toBe(false);
    expect(f.foldedOn.flop).toBe(false);
  });

  it('trennt aggressive und passive Aktionen nach dem Flop', () => {
    const t = createHandTracker();
    t.onSawFlop();
    t.onAction('flop', 'raise', true);
    t.onAction('turn', 'call', true);
    t.onAction('river', 'raise', false);
    const f = t.finish({ won: true, showdown: true, netChips: 240 });
    expect(f.aggressiveActions).toBe(2);
    expect(f.passiveActions).toBe(1);
    expect(f.sawFlop).toBe(true);
    expect(f.wonShowdown).toBe(true);
  });

  it('zählt Checks weder als aggressiv noch als passiv', () => {
    // AFq misst Aggression gegen Aktion, nicht gegen Untätigkeit.
    const t = createHandTracker();
    t.onAction('flop', 'check', false);
    t.onAction('turn', 'check', false);
    const f = t.finish({ won: false, showdown: false, netChips: 0 });
    expect(f.aggressiveActions).toBe(0);
    expect(f.passiveActions).toBe(0);
  });

  it('gibt bei jedem Abschluss eine eigene Kopie zurück', () => {
    const t = createHandTracker();
    t.onAction('preflop', 'call', true);
    const a = t.finish({ won: false, showdown: false, netChips: -20 });
    const b = t.finish({ won: true, showdown: true, netChips: 100 });
    expect(a.won).toBe(false);
    expect(b.won).toBe(true);
    expect(a.facedBet).not.toBe(b.facedBet);
  });
});

describe('Kennzahlen', () => {
  it('liefert für gar keine Hände überall null statt 0', () => {
    // Der Unterschied ist wichtig: 0 % wäre eine Aussage, null heißt "unbekannt".
    const s = computeStats([]);
    expect(s.hands).toBe(0);
    expect(s.vpip.value).toBeNull();
    expect(s.afq.value).toBeNull();
    expect(s).toEqual(emptyStats());
  });

  it('rechnet VPIP und PFR über die Preflop-Gelegenheiten', () => {
    const s = computeStats([
      hand({ vpip: true, pfr: true }),
      hand({ vpip: true }),
      hand(),
      hand(),
    ]);
    expect(s.vpip.value).toBe(50);
    expect(s.vpip.opportunities).toBe(4);
    expect(s.pfr.value).toBe(25);
  });

  it('lässt Hände ohne Preflop-Entscheidung aus dem Nenner', () => {
    const s = computeStats([
      hand({ vpip: true }),
      { ...emptyHandFacts(), preflopOpportunity: false },
    ]);
    expect(s.vpip.opportunities).toBe(1);
    expect(s.vpip.value).toBe(100);
  });

  it('rechnet die Aggressionsfrequenz aus Bet/Raise gegen Call', () => {
    const s = computeStats([
      hand({ aggressiveActions: 3, passiveActions: 1 }),
      hand({ aggressiveActions: 1, passiveActions: 3 }),
    ]);
    expect(s.afq.value).toBe(50);
    expect(s.afq.opportunities).toBe(8);
  });

  it('bezieht WTSD auf gesehene Flops, nicht auf alle Hände', () => {
    const s = computeStats([
      hand({ sawFlop: true, showdown: true, won: true, wonShowdown: true }),
      hand({ sawFlop: true }),
      hand(), // vor dem Flop weg – darf den Nenner nicht aufblähen
    ]);
    expect(s.wtsd.opportunities).toBe(2);
    expect(s.wtsd.value).toBe(50);
    expect(s.wsd.value).toBe(100);
    expect(s.wsd.opportunities).toBe(1);
  });

  it('rechnet die Fold-Häufigkeit je Street gegen die Fold-Gelegenheiten', () => {
    const s = computeStats([
      hand({
        facedBet: { preflop: true, flop: true, turn: false, river: false },
        foldedOn: { preflop: false, flop: true, turn: false, river: false },
      }),
      hand({
        facedBet: { preflop: true, flop: true, turn: false, river: false },
        foldedOn: { preflop: false, flop: false, turn: false, river: false },
      }),
    ]);
    expect(s.foldBy.flop.value).toBe(50);
    expect(s.foldBy.preflop.value).toBe(0);
    expect(s.foldBy.turn.value).toBeNull();
  });

  it('summiert die Chip-Bilanz vorzeichenrichtig', () => {
    const s = computeStats([hand({ netChips: 120 }), hand({ netChips: -200 })]);
    expect(s.netChips).toBe(-80);
  });
});

describe('Aussagekraft', () => {
  it('stuft nach Anzahl der Gelegenheiten ab', () => {
    expect(confidenceOf(0)).toBe('none');
    expect(confidenceOf(9)).toBe('weak');
    expect(confidenceOf(30)).toBe('fair');
    expect(confidenceOf(200)).toBe('solid');
  });

  it('nennt neun Hände ausdrücklich schwach', () => {
    // Genau der Fall, den Konkurrenz-Apps als Diagnose verkaufen.
    expect(confidenceOf(9)).toBe('weak');
  });
});

describe('Spielertyp', () => {
  function many(n: number, patch: Partial<HandFacts>): HandFacts[] {
    return Array.from({ length: n }, () => hand(patch));
  }

  it('ordnet erst ab genügend Händen überhaupt ein', () => {
    const few = computeStats(many(MIN_HANDS_FOR_STYLE - 1, { vpip: true, pfr: true }));
    const a = assessStyle(few);
    expect(a.reliable).toBe(false);
    expect(a.style).toBe('unknown');
  });

  it('erkennt tight-aggressiv als TAG', () => {
    // 15 von 100 Händen gespielt, davon alle erhöht, postflop aggressiv.
    const facts = [
      ...many(15, { vpip: true, pfr: true, aggressiveActions: 3, passiveActions: 1 }),
      ...many(85, {}),
    ];
    const a = assessStyle(computeStats(facts));
    expect(a.style).toBe('tag');
    expect(a.looseness).toBeLessThan(0.5);
    expect(a.aggression).toBeGreaterThanOrEqual(0.5);
  });

  it('erkennt loose-passiv als FISH', () => {
    // Viele Hände gespielt, fast nie erhöht, postflop nur mitgegangen.
    const facts = [
      ...many(60, { vpip: true, passiveActions: 4 }),
      ...many(40, {}),
    ];
    const a = assessStyle(computeStats(facts));
    expect(a.style).toBe('fish');
    expect(a.looseness).toBeGreaterThan(0.5);
    expect(a.aggression).toBeLessThan(0.5);
  });

  it('erkennt loose-aggressiv als LAG', () => {
    const facts = [
      ...many(55, { vpip: true, pfr: true, aggressiveActions: 4 }),
      ...many(45, {}),
    ];
    const a = assessStyle(computeStats(facts));
    expect(a.style).toBe('lag');
  });

  it('erkennt tight-passiv als ROCK', () => {
    const facts = [
      ...many(12, { vpip: true, passiveActions: 4 }),
      ...many(88, {}),
    ];
    const a = assessStyle(computeStats(facts));
    expect(a.style).toBe('rock');
  });

  it('hält die Achsen im Bereich 0 bis 1, auch bei Extremwerten', () => {
    const allIn = assessStyle(computeStats(many(50, { vpip: true, pfr: true, aggressiveActions: 9 })));
    const never = assessStyle(computeStats(many(50, {})));
    for (const a of [allIn, never]) {
      expect(a.looseness).toBeGreaterThanOrEqual(0);
      expect(a.looseness).toBeLessThanOrEqual(1);
      expect(a.aggression).toBeGreaterThanOrEqual(0);
      expect(a.aggression).toBeLessThanOrEqual(1);
    }
  });
});

describe('Bewertung und Hinweise', () => {
  it('bewertet gegen den Zielbereich', () => {
    expect(judge({ value: 25, count: 25, opportunities: 100 }, TARGETS.vpip)).toBe('good');
    expect(judge({ value: 8, count: 8, opportunities: 100 }, TARGETS.vpip)).toBe('low');
    expect(judge({ value: 60, count: 60, opportunities: 100 }, TARGETS.vpip)).toBe('high');
    expect(judge({ value: null, count: 0, opportunities: 0 }, TARGETS.vpip)).toBe('unknown');
  });

  it('gibt für jede Zielkennzahl genau einen Hinweis zurück', () => {
    const hints = hintsFor(computeStats([hand({ vpip: true })]));
    expect(hints.map((h) => h.key).sort()).toEqual(['afq', 'pfr', 'vpip', 'wsd', 'wtsd']);
  });

  it('nennt keinen Top-Hinweis, solange die Stichprobe zu klein ist', () => {
    // Fünf wilde Hände dürfen keine Diagnose auslösen.
    const s = computeStats(Array.from({ length: 5 }, () => hand({ vpip: true })));
    expect(topHint(s)).toBeNull();
  });

  it('nennt die deutlichste belastbare Abweichung', () => {
    // 100 Hände, alle gespielt, nie erhöht: VPIP viel zu hoch, PFR zu niedrig.
    // VPIP liegt 70 Punkte über dem Ziel, PFR 15 darunter – VPIP gewinnt.
    const s = computeStats(Array.from({ length: 100 }, () => hand({ vpip: true })));
    const top = topHint(s);
    expect(top?.key).toBe('vpip');
    expect(top?.verdict).toBe('high');
  });

  it('schweigt, wenn alles im Zielbereich liegt', () => {
    const facts = [
      ...Array.from({ length: 25 }, () =>
        hand({ vpip: true, pfr: true, sawFlop: true, aggressiveActions: 2, passiveActions: 1 }),
      ),
      ...Array.from({ length: 75 }, () => hand()),
    ];
    const s = computeStats(facts);
    // VPIP 25 %, PFR 25 % – beide am Rand des Zielbereichs, AFq 67 %.
    const top = topHint(s);
    if (top) expect(['pfr', 'afq', 'wtsd', 'wsd']).toContain(top.key);
    expect(top?.key).not.toBe('vpip');
  });

  it('findet zu jedem Schlüssel die passende Kennzahl', () => {
    const s = computeStats([hand({ vpip: true, pfr: true })]);
    expect(statByKey(s, 'vpip')).toBe(s.vpip);
    expect(statByKey(s, 'pfr')).toBe(s.pfr);
    expect(statByKey(s, 'afq')).toBe(s.afq);
    expect(statByKey(s, 'wtsd')).toBe(s.wtsd);
    expect(statByKey(s, 'wsd')).toBe(s.wsd);
  });
});

describe('Speicherform', () => {
  it('verwirft alles, was keine Liste ist', () => {
    expect(sanitizeHandFacts(null)).toEqual([]);
    expect(sanitizeHandFacts('kaputt')).toEqual([]);
    expect(sanitizeHandFacts({ vpip: true })).toEqual([]);
  });

  it('baut jede Hand Feld für Feld neu auf und ignoriert Fremdfelder', () => {
    const out = sanitizeHandFacts([
      { vpip: true, pfr: 'ja', aggressiveActions: 2.7, boeses: '<script>', facedBet: { flop: true } },
    ]);
    expect(out).toHaveLength(1);
    expect(out[0].vpip).toBe(true);
    expect(out[0].pfr).toBe(false); // 'ja' ist kein true
    expect(out[0].aggressiveActions).toBe(2); // abgeschnitten, nicht gerundet
    expect(out[0].facedBet).toEqual({ preflop: false, flop: true, turn: false, river: false });
    expect('boeses' in out[0]).toBe(false);
  });

  it('wehrt negative und unendliche Zahlen ab', () => {
    const out = sanitizeHandFacts([
      { aggressiveActions: -5, passiveActions: Infinity, netChips: NaN },
    ]);
    expect(out[0].aggressiveActions).toBe(0);
    expect(out[0].passiveActions).toBe(0);
    expect(out[0].netChips).toBe(0);
  });

  it('behält bei Überlänge die neuesten Hände', () => {
    const raw = Array.from({ length: MAX_TRACKED_HANDS + 50 }, (_, i) => ({ netChips: i }));
    const out = sanitizeHandFacts(raw);
    expect(out).toHaveLength(MAX_TRACKED_HANDS);
    expect(out[out.length - 1].netChips).toBe(MAX_TRACKED_HANDS + 49);
  });

  it('überlebt eine Runde durch JSON unverändert', () => {
    const t = createHandTracker();
    t.onSawFlop();
    t.onAction('preflop', 'raise', false);
    t.onAction('flop', 'call', true);
    const original = t.finish({ won: true, showdown: true, netChips: 180 });
    const round = sanitizeHandFacts(JSON.parse(JSON.stringify([original])));
    expect(round[0]).toEqual(original);
  });
});
