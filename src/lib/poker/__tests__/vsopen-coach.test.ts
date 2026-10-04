/* Der Coach antwortet auf eine Eröffnung nach Platzpaar, nicht nach Listen (E-100). */

import { describe, expect, it } from 'vitest';
import { applyAction, createHand, type GameState } from '../engine';
import type { Card } from '../cards';
import { combosForLabel } from '../ranges';
import type { Position } from '../../../content/ranges';
import { coachForTable, eroeffnerVorDir } from '../tischcoach';
import { preflopAdvice } from '../coach';
import { positionOf } from '../ai';

/** Ein Sechser-Tisch: Der Mensch (Sitz 0) sitzt auf `selbst`, `eroeffner` erhöht auf 2,5 bb, alle anderen folden. */
function tischGegenOpen(selbst: Position, eroeffner: Position, hand: [Card, Card], zweiteErhoehung?: Position): GameState {
  const reihenfolge: Position[] = ['BTN', 'SB', 'BB', 'UTG', 'HJ', 'CO'];
  const button = (0 - reihenfolge.indexOf(selbst) + 6) % 6;
  const spieler = Array.from({ length: 6 }, (_, i) => ({ id: i, name: `P${i}`, stack: 200, isHero: i === 0 }));
  const g = createHand(spieler, button, 1, 2, 1);
  g.players[0].cards = hand;
  let schutz = 0;
  while (g.toActIndex !== 0 && schutz++ < 12) {
    const pos = positionOf(g, g.toActIndex);
    if (pos === eroeffner && g.currentBet <= 2) applyAction(g, { type: 'raise', to: 5 });
    else if (pos === zweiteErhoehung && g.currentBet <= 5) applyAction(g, { type: 'raise', to: 15 });
    else applyAction(g, { type: 'fold' });
  }
  expect(g.toActIndex).toBe(0);
  expect(positionOf(g, 0)).toBe(selbst);
  return g;
}

const hand = (label: string): [Card, Card] => combosForLabel(label)[0];

describe('Gegen eine Erhöhung entscheidet das Platzpaar (der Fehler: AJo war überall gleich)', () => {
  it('AJo auf dem Button: gegen UTG ein Fold, gegen den Cutoff ein Call', () => {
    const gegenUtg = coachForTable(tischGegenOpen('BTN', 'UTG', hand('AJo')), null)!;
    const gegenCo = coachForTable(tischGegenOpen('BTN', 'CO', hand('AJo')), null)!;
    expect(gegenUtg.empfehlung).toBe('fold');
    expect(gegenCo.empfehlung).toBe('call');
    expect(gegenUtg.advice.headline).not.toBe(gegenCo.advice.headline);
  });

  it('dieselbe Entscheidung über den Coach der Seite „Nachschlagen“', () => {
    const utg = preflopAdvice('AJo', 'spaet', 6, true, 0, 'de', undefined, { eroeffner: 'UTG', selbst: 'BTN' });
    const co = preflopAdvice('AJo', 'spaet', 6, true, 0, 'de', undefined, { eroeffner: 'CO', selbst: 'BTN' });
    expect(utg.action).toBe('fold');
    expect(co.action).toBe('call');
    const en = preflopAdvice('AJo', 'spaet', 6, true, 0, 'en', undefined, { eroeffner: 'UTG', selbst: 'BTN' });
    expect(en.action).toBe('fold');
    expect(en.headline).toMatch(/Facing the open/);
  });

  it('AA ist überall eine 3-Bet, 72o überall ein Fold', () => {
    for (const [selbst, eroeffner] of [['HJ', 'UTG'], ['CO', 'HJ'], ['BTN', 'CO'], ['SB', 'BTN'], ['BB', 'SB']] as const) {
      expect(coachForTable(tischGegenOpen(selbst, eroeffner, hand('AA')), null)!.empfehlung, `${selbst}>${eroeffner}`).toBe('raise');
      expect(coachForTable(tischGegenOpen(selbst, eroeffner, hand('72o')), null)!.empfehlung, `${selbst}>${eroeffner}`).toBe('fold');
    }
  });

  it('77 im Big Blind: gegen jeden Eröffner ein Call', () => {
    for (const eroeffner of ['UTG', 'HJ', 'CO', 'BTN', 'SB'] as const) {
      expect(coachForTable(tischGegenOpen('BB', eroeffner, hand('77')), null)!.empfehlung, eroeffner).toBe('call');
    }
  });

  it('die Begründung nennt Platz und Eröffner', () => {
    const rat = coachForTable(tischGegenOpen('BTN', 'UTG', hand('AJo')), null)!;
    expect(rat.advice.reasons[0]).toContain('BTN');
    expect(rat.advice.reasons[0]).toContain('UTG');
  });

  it('ein Rat bleibt ein Rat: gegen eine Erhöhung ist er nicht „klar“', () => {
    expect(coachForTable(tischGegenOpen('BTN', 'UTG', hand('AJo')), null)!.klar).toBe(false);
  });
});

describe('Wer eröffnet hat, liest der Tisch aus dem Verlauf', () => {
  it('eine Erhöhung: der Eröffner ist bekannt', () => {
    expect(eroeffnerVorDir(tischGegenOpen('BTN', 'CO', hand('AJo')))).toBe('CO');
    expect(eroeffnerVorDir(tischGegenOpen('BB', 'SB', hand('AJo')))).toBe('SB');
  });

  it('zwei Erhöhungen (3-Bet): keine Tabelle, es bleibt bei den groben Listen', () => {
    const g = tischGegenOpen('BTN', 'UTG', hand('AJo'), 'HJ');
    expect(eroeffnerVorDir(g)).toBeNull();
    const rat = coachForTable(g, null)!;
    expect(rat.advice.headline).not.toMatch(/Gegen das Open/);
  });

  it('niemand hat erhöht: kein Eröffner', () => {
    const g = tischGegenOpen('BTN', 'UTG', hand('AJo'));
    g.log = g.log.filter((e) => e.aktion?.art !== 'raise');
    expect(eroeffnerVorDir(g)).toBeNull();
  });
});
