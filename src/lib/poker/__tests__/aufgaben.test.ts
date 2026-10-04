import { describe, expect, it } from 'vitest';
import { BB_DEFENSE_VS_BTN, RFI_CHARTS } from '../../../content/ranges';
import { seededRng } from '../../zufall';
import { besteFuenf, grenzhaende, KATEGORIE_GEWICHT, ziehHandranking, ziehePreflopHand } from '../aufgaben';
import { categoryOf, evaluateBest } from '../evaluator';
import { expandRangeSpec, handLabel } from '../ranges';

describe('Preflop-Aufgaben: gewichtet gezogen (6.9)', () => {
  const range = expandRangeSpec(RFI_CHARTS.find((c) => c.position === 'CO')!.raise);

  it('Grenzhände liegen neben der Gegenseite, nicht mitten in der Range', () => {
    const grenze = new Set(grenzhaende(range));
    expect(grenze.has('AA')).toBe(false); // ganz oben links, nur Nachbarn in der Range
    expect(grenze.has('72o')).toBe(false); // weit draußen
    expect(grenze.has('K7s')).toBe(true); // K8s ist drin, K7s nicht
    expect(grenze.size).toBeGreaterThan(10);
  });

  it('etwa die Hälfte der Aufgaben liegt an der Grenze', () => {
    const rng = seededRng('grenze');
    let n = 0;
    for (let i = 0; i < 4000; i += 1) if (ziehePreflopHand(range, rng).grenze) n += 1;
    expect(n / 4000).toBeGreaterThan(0.5);
    expect(n / 4000).toBeLessThan(0.75);
  });

  it('„immer Fold" trifft nicht mehr in zwei von drei Aufgaben', () => {
    for (const chart of RFI_CHARTS) {
      const r = expandRangeSpec(chart.raise);
      const rng = seededRng(`fold-${chart.position}`);
      let fold = 0;
      for (let i = 0; i < 4000; i += 1) if (!r.has(ziehePreflopHand(r, rng).label)) fold += 1;
      expect(fold / 4000, chart.position).toBeLessThan(0.67);
    }
  });

  it('die Karten gehören zum Label', () => {
    const rng = seededRng('karten');
    for (let i = 0; i < 300; i += 1) {
      const h = ziehePreflopHand(range, rng);
      expect(handLabel(h.cards[0], h.cards[1])).toBe(h.label);
      expect(h.cards[0]).not.toBe(h.cards[1]);
    }
  });

  it('auch die Verteidigung im Big Blind', () => {
    const verteidigung = new Set([
      ...expandRangeSpec(BB_DEFENSE_VS_BTN.threeBet),
      ...expandRangeSpec(BB_DEFENSE_VS_BTN.call),
    ]);
    const rng = seededRng('bb');
    let spiel = 0;
    for (let i = 0; i < 2000; i += 1) if (verteidigung.has(ziehePreflopHand(verteidigung, rng).label)) spiel += 1;
    expect(spiel / 2000).toBeGreaterThan(0.35);
  });
});

describe('Handranking-Aufgaben: die Kategorie wird gewählt (6.9)', () => {
  it('die Gewichte ergeben eins', () => {
    expect(KATEGORIE_GEWICHT.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 5);
    expect(KATEGORIE_GEWICHT).toHaveLength(9);
  });

  it('Straße und Flush kommen oft vor, nicht in 7,6 % der Fälle', () => {
    const rng = seededRng('rang');
    const zaehler = new Array<number>(9).fill(0);
    const N = 3000;
    for (let i = 0; i < N; i += 1) zaehler[ziehHandranking(rng).kategorie] += 1;
    expect((zaehler[4] + zaehler[5]) / N).toBeGreaterThan(0.2);
    // High Card, Paar, zwei Paare zusammen höchstens die Hälfte (natürlich: 85 %)
    expect((zaehler[0] + zaehler[1] + zaehler[2]) / N).toBeLessThan(0.5);
    for (let k = 0; k < 9; k += 1) expect(zaehler[k], `Kategorie ${k}`).toBeGreaterThan(0);
  });

  it('die gezogene Kategorie ist die der sieben Karten', () => {
    const rng = seededRng('stimmt');
    for (let i = 0; i < 400; i += 1) {
      const h = ziehHandranking(rng);
      expect(h.hole).toHaveLength(2);
      expect(h.board).toHaveLength(5);
      expect(new Set([...h.hole, ...h.board]).size).toBe(7);
      expect(categoryOf(evaluateBest([...h.hole, ...h.board]))).toBe(h.kategorie);
    }
  });

  it('die besten fünf Karten ergeben dieselbe Hand', () => {
    const rng = seededRng('fuenf');
    for (let i = 0; i < 200; i += 1) {
      const h = ziehHandranking(rng);
      const sieben = [...h.hole, ...h.board];
      const fuenf = besteFuenf(sieben);
      expect(fuenf).toHaveLength(5);
      expect(fuenf.every((c) => sieben.includes(c))).toBe(true);
      expect(evaluateBest(fuenf)).toBe(evaluateBest(sieben));
    }
  });
});
