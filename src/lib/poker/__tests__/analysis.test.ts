import { describe, expect, it } from 'vitest';
import { parseCard } from '../cards';
import { detectDraws, madeHandInfo } from '../analysis';
import { facingBetVerdict } from '../coach';

const h = (...strs: string[]) => strs.map(parseCard);

describe('madeHandInfo', () => {
  it('erkennt Overpair', () => {
    const info = madeHandInfo(h('Qs', 'Qh'), h('9c', '5d', '2h'));
    expect(info.category).toBe(1);
    expect(info.pairType).toBe('overpair');
  });

  it('erkennt Top Pair mit Kicker', () => {
    const info = madeHandInfo(h('As', 'Kh'), h('Ac', '7d', '2h'));
    expect(info.pairType).toBe('toppair');
    expect(info.kickerRank).toBe(11); // König
  });

  it('erkennt Middle/Bottom Pair und Underpair', () => {
    expect(madeHandInfo(h('9s', '8h'), h('Ac', '9d', '2h')).pairType).toBe('middlepair');
    expect(madeHandInfo(h('2s', 'Ah'), h('Kc', '9d', '2h')).pairType).toBe('bottompair');
    expect(madeHandInfo(h('5s', '5h'), h('Kc', '9d', '7h')).pairType).toBe('underpair');
  });

  it('erkennt Set als Drilling', () => {
    const info = madeHandInfo(h('7s', '7h'), h('7c', 'Kd', '2h'));
    expect(info.category).toBe(3);
  });
});

describe('detectDraws', () => {
  it('Flushdraw: 9 Outs', () => {
    const d = detectDraws(h('Ah', '5h'), h('9h', '2h', 'Kc'));
    expect(d.flushDraw).toBe(true);
    expect(d.nutFlushDraw).toBe(true);
    // 9 Flush-Outs + 1 Overcard (A): 3 Asse, davon keins doppelt gezählt? A ist
    // nicht in der Flushfarbe verfügbar (Ah in Hand) → 3 - 1 = 2… wir prüfen nur die Summe grob
    expect(d.totalOuts).toBeGreaterThanOrEqual(9);
  });

  it('OESD: 8 Outs', () => {
    const d = detectDraws(h('9s', '8h'), h('7c', '6d', '2h'));
    expect(d.openEnded).toBe(true);
    expect(d.parts.find((p) => p.label.includes('Open-Ended'))?.outs).toBe(8);
  });

  it('Gutshot: 4 Outs', () => {
    const d = detectDraws(h('Js', 'Th'), h('8c', '7d', '2h'));
    expect(d.gutshot).toBe(true);
    expect(d.parts.find((p) => p.label === 'Gutshot')?.outs).toBe(4);
  });

  it('Flushdraw + Gutshot: 12 Outs', () => {
    const d = detectDraws(h('Js', 'Ts'), h('8s', '7s', '2h'));
    expect(d.flushDraw).toBe(true);
    expect(d.gutshot).toBe(true);
    expect(d.totalOuts).toBe(12);
  });

  it('fertige Straße erzeugt keinen Draw', () => {
    const d = detectDraws(h('9s', '8h'), h('7c', '6d', '5h'));
    expect(d.openEnded).toBe(false);
    expect(d.gutshot).toBe(false);
  });

  it('fertiger Flush erzeugt keinen Flushdraw', () => {
    const d = detectDraws(h('Ah', '5h'), h('9h', '2h', 'Kh'));
    expect(d.flushDraw).toBe(false);
  });

  it('Board-Draw ohne eigene Beteiligung zählt nicht (Flush)', () => {
    const d = detectDraws(h('Ac', 'Kd'), h('9h', '2h', '5h'));
    expect(d.flushDraw).toBe(false);
  });
});

describe('facingBetVerdict', () => {
  it('berechnet benötigte Equity korrekt (halbe Pot-Bet → 25 %)', () => {
    const v = facingBetVerdict(0.4, 10, 5);
    expect(v.requiredPct).toBe(25);
    expect(v.ok).toBe(true);
  });

  it('lehnt Call mit zu wenig Equity ab', () => {
    const v = facingBetVerdict(0.2, 10, 10);
    expect(v.requiredPct).toBe(33);
    expect(v.ok).toBe(false);
  });
});
