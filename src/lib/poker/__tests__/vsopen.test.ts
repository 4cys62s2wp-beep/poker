/* Preflop gegen eine Erhöhung (E-100): die Tabelle ist in sich stimmig. */

import { describe, expect, it } from 'vitest';
import { VSOPEN_CHARTS, VSOPEN_QUELLE } from '../../../content/vsopen';
import { BB_DEFENSE_VS_BTN, RFI_CHARTS, type Position } from '../../../content/ranges';
import { anteil, eroeffnerFuer, gegenOpen, verteidigerPlaetze, vsOpenRange, VSOPEN_PAARE } from '../vsopen';
import { expandRangeSpec } from '../ranges';

const REIHE: Position[] = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'];

describe('Die Tabelle deckt alle Platzpaare ab', () => {
  it('15 Paare: jeder Platz gegen jeden Eröffner vor ihm', () => {
    const erwartet: string[] = [];
    for (let e = 0; e < 5; e += 1) for (let s = e + 1; s < 6; s += 1) erwartet.push(`${REIHE[e]}>${REIHE[s]}`);
    expect(VSOPEN_PAARE.map((p) => `${p.eroeffner}>${p.selbst}`).sort()).toEqual(erwartet.sort());
    expect(VSOPEN_CHARTS.length).toBe(15);
  });

  it('der Eröffner sitzt immer vor dem Antwortenden', () => {
    for (const p of VSOPEN_PAARE) expect(REIHE.indexOf(p.eroeffner)).toBeLessThan(REIHE.indexOf(p.selbst));
  });

  it('gegen den Button verteidigt der Big Blind wie bisher', () => {
    const r = vsOpenRange('BTN', 'BB')!;
    const alt3 = expandRangeSpec(BB_DEFENSE_VS_BTN.threeBet);
    const altCall = new Set([...expandRangeSpec(BB_DEFENSE_VS_BTN.call)].filter((l) => !alt3.has(l)));
    expect([...r.threeBet].sort()).toEqual([...alt3].sort());
    expect([...r.call].sort()).toEqual([...altCall].sort());
  });

  it('zu jedem Antwortenden gibt es Eröffner; der früheste Platz antwortet nie', () => {
    expect(verteidigerPlaetze()).toEqual(['HJ', 'CO', 'BTN', 'SB', 'BB']);
    expect(eroeffnerFuer('BB')).toEqual(['UTG', 'HJ', 'CO', 'BTN', 'SB']);
    expect(eroeffnerFuer('HJ')).toEqual(['UTG']);
    expect(eroeffnerFuer('UTG')).toEqual([]);
  });
});

describe('3-Bet und Call überschneiden sich nicht', () => {
  it('eine Hand ist je Paar genau eines von dreien', () => {
    for (const c of VSOPEN_CHARTS) {
      const r = vsOpenRange(c.eroeffner, c.selbst)!;
      for (const l of r.threeBet) expect(r.call.has(l), `${c.eroeffner}>${c.selbst} ${l}`).toBe(false);
      expect(r.weiter.size).toBe(r.threeBet.size + r.call.size);
    }
  });
});

describe('Wer gegen einen späteren Platz verteidigt, spielt nie enger', () => {
  const REIHE_EROEFFNER: Position[] = ['UTG', 'HJ', 'CO', 'BTN', 'SB'];

  for (const selbst of verteidigerPlaetze()) {
    const eroeffner = eroeffnerFuer(selbst).sort((a, b) => REIHE_EROEFFNER.indexOf(a) - REIHE_EROEFFNER.indexOf(b));
    it(`${selbst}: jede Hand, die gegen einen früheren Eröffner weitergeht, geht auch gegen den nächsten weiter`, () => {
      for (let i = 0; i + 1 < eroeffner.length; i += 1) {
        const eng = vsOpenRange(eroeffner[i], selbst)!;
        const weit = vsOpenRange(eroeffner[i + 1], selbst)!;
        const fehlt = [...eng.weiter].filter((l) => !weit.weiter.has(l));
        expect(fehlt, `${selbst}: ${eroeffner[i]} → ${eroeffner[i + 1]}`).toEqual([]);
      }
    });

    it(`${selbst}: die 3-Bet-Range wächst mit dem späteren Eröffner`, () => {
      for (let i = 0; i + 1 < eroeffner.length; i += 1) {
        const eng = anteil(vsOpenRange(eroeffner[i], selbst)!.threeBet);
        const weit = anteil(vsOpenRange(eroeffner[i + 1], selbst)!.threeBet);
        expect(weit, `${selbst}: ${eroeffner[i]} → ${eroeffner[i + 1]}`).toBeGreaterThanOrEqual(eng);
      }
    });
  }
});

describe('Die Range hängt vom Eröffner ab — das war der Fehler', () => {
  it('AJo auf dem Button: gegen UTG Fold, gegen Cutoff Call', () => {
    expect(gegenOpen('AJo', 'UTG', 'BTN')).toBe('fold');
    expect(gegenOpen('AJo', 'CO', 'BTN')).toBe('call');
    expect(gegenOpen('AJo', 'UTG', 'BTN')).not.toBe(gegenOpen('AJo', 'CO', 'BTN'));
  });

  it('77 im Big Blind: immer Call; 72o: immer Fold', () => {
    for (const e of ['UTG', 'HJ', 'CO', 'BTN', 'SB'] as const) {
      expect(gegenOpen('77', e, 'BB')).toBe('call');
      expect(gegenOpen('72o', e, 'BB')).toBe('fold');
    }
  });

  it('AA und AKs sind überall 3-Bet', () => {
    for (const p of VSOPEN_PAARE) {
      expect(gegenOpen('AA', p.eroeffner, p.selbst)).toBe('threeBet');
      expect(gegenOpen('AKs', p.eroeffner, p.selbst)).toBe('threeBet');
    }
  });

  it('ohne Paar (Eröffner nicht vor dir) gibt es keine Antwort', () => {
    expect(gegenOpen('AA', 'BTN', 'UTG')).toBeNull();
    expect(gegenOpen('AA', 'BB', 'BB')).toBeNull();
  });
});

describe('Der Anteil der 3-Bet- und Weiterspiel-Hände ist plausibel', () => {
  it('3-Bet zwischen 2,5 und 10 Prozent, Weiterspielen unter dem Eröffner nie über 70', () => {
    for (const p of VSOPEN_PAARE) {
      const r = vsOpenRange(p.eroeffner, p.selbst)!;
      const dreiBet = anteil(r.threeBet);
      expect(dreiBet, `${p.eroeffner}>${p.selbst} 3-Bet`).toBeGreaterThan(0.025);
      expect(dreiBet, `${p.eroeffner}>${p.selbst} 3-Bet`).toBeLessThan(0.1);
      expect(anteil(r.weiter), `${p.eroeffner}>${p.selbst} weiter`).toBeLessThan(0.7);
    }
  });

  it('niemand verteidigt gegen einen Eröffner weiter, als der Eröffner Hände öffnet (außer den Blinds)', () => {
    for (const p of VSOPEN_PAARE) {
      if (p.selbst === 'BB' || p.selbst === 'SB') continue;
      const oeffnet = anteil(expandRangeSpec(RFI_CHARTS.find((c) => c.position === p.eroeffner)!.raise));
      expect(anteil(vsOpenRange(p.eroeffner, p.selbst)!.weiter)).toBeLessThan(oeffnet + 0.001);
    }
  });
});

describe('Die Herkunft steht dabei', () => {
  it('in beiden Sprachen, und sie sagt, dass es keine Solver-Lösung ist', () => {
    expect(VSOPEN_QUELLE.de).toMatch(/keine Solver-Lösung/);
    expect(VSOPEN_QUELLE.en).toMatch(/not a solver solution/);
  });
});
