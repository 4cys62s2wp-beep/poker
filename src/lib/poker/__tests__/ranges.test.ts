import { describe, expect, it } from 'vitest';
import { parseCard } from '../cards';
import {
  combosForLabel,
  expandRangeSpec,
  handLabel,
  matrixLabel,
  rangePercent,
} from '../ranges';
import { RFI_CHARTS } from '../../../content/ranges';

describe('handLabel', () => {
  it('erzeugt korrekte Labels', () => {
    expect(handLabel(parseCard('As'), parseCard('Ks'))).toBe('AKs');
    expect(handLabel(parseCard('Kh'), parseCard('Ad'))).toBe('AKo');
    expect(handLabel(parseCard('Qc'), parseCard('Qd'))).toBe('QQ');
    expect(handLabel(parseCard('2c'), parseCard('7d'))).toBe('72o');
  });
});

describe('matrixLabel', () => {
  it('Diagonale = Paare, oben rechts = suited, unten links = offsuit', () => {
    expect(matrixLabel(0, 0)).toBe('AA');
    expect(matrixLabel(0, 1)).toBe('AKs');
    expect(matrixLabel(1, 0)).toBe('AKo');
    expect(matrixLabel(12, 12)).toBe('22');
  });
});

describe('combosForLabel', () => {
  it('liefert korrekte Combo-Anzahlen', () => {
    expect(combosForLabel('AA')).toHaveLength(6);
    expect(combosForLabel('AKs')).toHaveLength(4);
    expect(combosForLabel('AKo')).toHaveLength(12);
  });
});

describe('expandRangeSpec', () => {
  it('expandiert Paar-Ranges', () => {
    const set = expandRangeSpec(['TT+']);
    expect(set).toEqual(new Set(['TT', 'JJ', 'QQ', 'KK', 'AA']));
  });

  it('expandiert Kicker-Ranges', () => {
    const set = expandRangeSpec(['AQs+']);
    expect(set).toEqual(new Set(['AQs', 'AKs']));
    const off = expandRangeSpec(['KTo+']);
    expect(off).toEqual(new Set(['KTo', 'KJo', 'KQo']));
  });

  it('RFI-Ranges haben plausible Größen (UTG eng, BTN breit)', () => {
    const pct: Record<string, number> = {};
    for (const chart of RFI_CHARTS) {
      pct[chart.position] = rangePercent(expandRangeSpec(chart.raise));
    }
    expect(pct.UTG).toBeGreaterThan(0.13);
    expect(pct.UTG).toBeLessThan(0.19);
    expect(pct.BTN).toBeGreaterThan(0.38);
    expect(pct.BTN).toBeLessThan(0.5);
    expect(pct.UTG).toBeLessThan(pct.HJ);
    expect(pct.HJ).toBeLessThan(pct.CO);
    expect(pct.CO).toBeLessThan(pct.BTN);
  });
});
