import { describe, expect, it } from 'vitest';
import { parseCard } from '../cards';
import { evaluate5, evaluateBest, categoryOf, categoryName } from '../evaluator';

const h = (...strs: string[]) => strs.map(parseCard);

describe('evaluate5', () => {
  it('erkennt alle Handkategorien in korrekter Reihenfolge', () => {
    const hands = [
      h('As', 'Ks', 'Qs', 'Js', 'Ts'), // Royal / Straight Flush
      h('9c', '9d', '9h', '9s', '2c'), // Vierling
      h('Kd', 'Kh', 'Ks', '2c', '2d'), // Full House
      h('Ah', 'Th', '7h', '4h', '2h'), // Flush
      h('9c', '8d', '7h', '6s', '5c'), // Straße
      h('7c', '7d', '7h', 'Ks', '2c'), // Drilling
      h('Ac', 'Ad', 'Kh', 'Ks', '2c'), // Zwei Paare
      h('Qc', 'Qd', 'Ah', '7s', '2c'), // Ein Paar
      h('Ac', 'Jd', '9h', '6s', '3c'), // High Card
    ];
    const values = hands.map(evaluate5);
    for (let i = 0; i < values.length - 1; i++) {
      expect(values[i]).toBeGreaterThan(values[i + 1]);
    }
    expect(categoryOf(values[0])).toBe(8);
    expect(categoryOf(values[8])).toBe(0);
  });

  it('erkennt das Wheel (A-2-3-4-5) als niedrigste Straße', () => {
    const wheel = evaluate5(h('Ac', '2d', '3h', '4s', '5c'));
    const sixHigh = evaluate5(h('2c', '3d', '4h', '5s', '6c'));
    expect(categoryOf(wheel)).toBe(4);
    expect(sixHigh).toBeGreaterThan(wheel);
  });

  it('Ass-hoch ist keine Straße um die Ecke (K-A-2-3-4)', () => {
    const v = evaluate5(h('Kc', 'Ad', '2h', '3s', '4c'));
    expect(categoryOf(v)).toBe(0);
  });

  it('vergleicht Kicker korrekt', () => {
    const a = evaluate5(h('Ac', 'Ad', 'Kh', '7s', '2c'));
    const b = evaluate5(h('Ah', 'As', 'Qh', '7d', '2d'));
    expect(a).toBeGreaterThan(b);
  });

  it('Flush schlägt Straße, Full House schlägt Flush', () => {
    const flush = evaluate5(h('Ah', 'Th', '7h', '4h', '2h'));
    const straight = evaluate5(h('Ac', 'Kd', 'Qh', 'Js', 'Tc'));
    const fullHouse = evaluate5(h('2d', '2h', '2s', '3c', '3d'));
    expect(flush).toBeGreaterThan(straight);
    expect(fullHouse).toBeGreaterThan(flush);
  });
});

describe('evaluateBest (7 Karten)', () => {
  it('findet die beste 5er-Kombination', () => {
    // Board mit Flush-Möglichkeit, Hand macht den Nut-Flush
    const v = evaluateBest(h('Ah', '2h', 'Kh', 'Qh', '7h', '9c', '9d'));
    expect(categoryOf(v)).toBe(5);
  });

  it('erkennt Straight Flush auf dem Board + Hand', () => {
    const v = evaluateBest(h('5h', '6h', '7h', '8h', '9h', 'Ac', 'Ad'));
    expect(categoryOf(v)).toBe(8);
    expect(categoryName(v)).toBe('Straight Flush');
  });

  it('Royal Flush wird benannt', () => {
    const v = evaluateBest(h('As', 'Ks', 'Qs', 'Js', 'Ts', '2c', '3d'));
    expect(categoryName(v)).toBe('Royal Flush');
  });

  it('Zwei Paare aus 7 Karten wählt die besten beiden', () => {
    const v = evaluateBest(h('Ac', 'Ad', 'Kh', 'Ks', 'Qc', 'Qd', '2c'));
    // Beste Hand: AA + KK + Q-Kicker
    expect(categoryOf(v)).toBe(2);
  });
});
