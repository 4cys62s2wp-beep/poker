import { describe, expect, it } from 'vitest';
import { applyAction, createHand, legalActions, type GameState } from '../engine';
import { einsatzSchritt, einsatzVorgaben, standardEinsatz } from '../einsatz';
import { formatBB } from '../bb';

function tisch(n = 6, stack = 200): GameState {
  const spieler = Array.from({ length: n }, (_, i) => ({ id: i, name: `P${i}`, stack, isHero: i === 0 }));
  const g = createHand(spieler, 0, 1, 2, 1);
  let schutz = 0;
  while (g.toActIndex !== 0 && schutz++ < 10) applyAction(g, { type: 'fold' });
  return g;
}

describe('Einsatzvorgaben (6.2)', () => {
  it('vor dem Flop: 2,5 · 3 · 4 Big Blinds und All-in, jede mit ihrem Zielbetrag', () => {
    const g = tisch();
    const v = einsatzVorgaben(g, legalActions(g));
    expect(v.map((x) => x.to)).toEqual([5, 6, 8, 200]);
    expect(v.map((x) => formatBB(x.to, 2, 'de'))).toEqual(['2,5', '3', '4', '100']);
    expect(v[v.length - 1].art.art).toBe('allin');
  });

  it('gegen eine Erhöhung: Vielfache der Erhöhung', () => {
    const g = tisch();
    // Sitz 3 (UTG) hat vor Sitz 0 auf 6 erhöht: wir lassen Sitz 1 erhöhen.
    const g2 = tisch();
    g2.currentBet = 6;
    g2.lastRaiseSize = 4;
    const v = einsatzVorgaben(g2, legalActions(g2));
    expect(v.slice(0, 3).map((x) => x.to)).toEqual([15, 18, 24]);
    expect(g.currentBet).toBe(2);
  });

  it('nach dem Flop: Anteile des Pots, gleiche Ergebnisse werden eine Vorgabe', () => {
    const g = tisch();
    g.street = 'flop';
    g.players.forEach((p) => { p.bet = 0; p.committed = 0; });
    g.players[0].committed = 10;
    g.players[1].committed = 10;
    g.currentBet = 0;
    g.lastRaiseSize = 2;
    const v = einsatzVorgaben(g, legalActions(g));
    const tos = v.map((x) => x.to);
    expect(new Set(tos).size).toBe(tos.length);
    // Pot 20: ⅓ = 7, ½ = 10, ¾ = 15, Pot = 20
    expect(tos).toEqual([7, 10, 15, 20, 200]);
  });

  it('ein Bet unter dem Minimum wird das Minimum, nicht drei Knöpfe für dieselbe Zahl', () => {
    const g = tisch();
    g.street = 'flop';
    g.players.forEach((p) => { p.bet = 0; p.committed = 0; });
    g.players[0].committed = 2;
    g.players[1].committed = 2;
    g.currentBet = 0;
    g.lastRaiseSize = 2;
    const v = einsatzVorgaben(g, legalActions(g));
    const tos = v.map((x) => x.to);
    expect(new Set(tos).size).toBe(tos.length);
    expect(v[0].art.art).toBe('min');
    expect(tos[0]).toBe(2);
  });

  it('kurzer Stack: Vorgaben über dem Stack werden All-in', () => {
    const g = tisch(6, 10);
    const v = einsatzVorgaben(g, legalActions(g));
    expect(v[v.length - 1].to).toBe(10);
    expect(v.every((x, i) => i === v.length - 1 || x.to < 10)).toBe(true);
  });

  it('vorbelegt ist die zweite Vorgabe, nie All-in', () => {
    const g = tisch();
    expect(standardEinsatz(einsatzVorgaben(g, legalActions(g)))).toBe(6);
    const kurz = tisch(6, 4);
    const v = einsatzVorgaben(kurz, legalActions(kurz));
    expect(standardEinsatz(v)).toBe(kurz.players[0].stack + kurz.players[0].bet);
  });

  it('der Schritt: halber Big Blind darunter, ganzer ab zehn', () => {
    const g = tisch();
    const la = legalActions(g);
    expect(einsatzSchritt(6, 1, la, 2)).toBe(7);
    expect(einsatzSchritt(6, -1, la, 2)).toBe(5);
    expect(einsatzSchritt(30, 1, la, 2)).toBe(32);
    expect(einsatzSchritt(la.minRaiseTo, -1, la, 2)).toBe(la.minRaiseTo);
    expect(einsatzSchritt(la.maxRaiseTo, 1, la, 2)).toBe(la.maxRaiseTo);
  });

  it('Big Blinds mit Komma, englisch mit Punkt', () => {
    expect(formatBB(5, 2, 'de')).toBe('2,5');
    expect(formatBB(5, 2, 'en')).toBe('2.5');
    expect(formatBB(7, 2, 'de')).toBe('3,5');
    expect(formatBB(8, 2, 'de')).toBe('4');
    expect(formatBB(1, 2, 'de')).toBe('0,5');
  });
});
