import { describe, expect, it } from 'vitest';
import { parseCard } from '../cards';
import { equityVsHands, equityVsRandomHands, equityVsRange } from '../equity';
import { combosForRange, expandRangeSpec } from '../ranges';

const h = (...strs: string[]) => strs.map(parseCard);

describe('equityVsHands', () => {
  it('AA vs KK preflop: ca. 80–83 % für AA', () => {
    const eq = equityVsHands([h('As', 'Ah'), h('Kd', 'Kc')], [], 20000);
    expect(eq[0]).toBeGreaterThan(0.78);
    expect(eq[0]).toBeLessThan(0.86);
    expect(eq[0] + eq[1]).toBeCloseTo(1, 5);
  });

  it('AKs vs QQ: klassischer Coinflip (~46/54)', () => {
    const eq = equityVsHands([h('As', 'Ks'), h('Qd', 'Qc')], [], 20000);
    expect(eq[0]).toBeGreaterThan(0.4);
    expect(eq[0]).toBeLessThan(0.52);
  });

  it('reiner Flushdraw am Flop: ~34–38 % gegen ein Overpair', () => {
    const eq = equityVsHands(
      [h('6h', '5h'), h('Ks', 'Kd')],
      h('9h', '2h', 'Jc'),
      20000,
    );
    expect(eq[0]).toBeGreaterThan(0.28);
    expect(eq[0]).toBeLessThan(0.42);
  });

  it('Flushdraw mit Overcard: ~44–48 % gegen ein Overpair', () => {
    const eq = equityVsHands(
      [h('Ah', '5h'), h('Ks', 'Kd')],
      h('9h', '2h', 'Jc'),
      20000,
    );
    expect(eq[0]).toBeGreaterThan(0.4);
    expect(eq[0]).toBeLessThan(0.52);
  });

  it('River (Board komplett) ist deterministisch', () => {
    const eq = equityVsHands(
      [h('Ah', 'Ad'), h('Ks', 'Kd')],
      h('2c', '7d', '9h', 'Js', '3c'),
      1,
    );
    expect(eq[0]).toBe(1);
    expect(eq[1]).toBe(0);
  });
});

describe('equityVsRandomHands', () => {
  it('AA hat gegen eine zufällige Hand ~85 %', () => {
    const eq = equityVsRandomHands(h('As', 'Ah'), [], 1, 5000);
    expect(eq).toBeGreaterThan(0.8);
    expect(eq).toBeLessThan(0.9);
  });

  it('72o hat gegen zwei zufällige Hände deutlich unter 50 %', () => {
    const eq = equityVsRandomHands(h('7s', '2h'), [], 2, 5000);
    expect(eq).toBeLessThan(0.4);
  });
});

describe('equityVsRange', () => {
  it('AA schlägt eine enge Range deutlich', () => {
    const combos = combosForRange(expandRangeSpec(['QQ+', 'AKs', 'AKo']));
    const eq = equityVsRange(h('As', 'Ah'), combos, [], 5000);
    expect(eq).toBeGreaterThan(0.7);
  });

  it('leere Range nach toten Karten → -1', () => {
    const combos = combosForRange(['AA'], h('As', 'Ah'));
    // Nur noch AA-Combos ohne As/Ah: Ad+Ac bleibt → nicht leer.
    // Wirklich leer: Range AA, alle vier Asse tot.
    const eq = equityVsRange(h('2c', '3c'), combosForRange(['AA'], h('As', 'Ah', 'Ad', 'Ac')), [], 100);
    expect(eq).toBe(-1);
    expect(combos.length).toBe(1);
  });
});
