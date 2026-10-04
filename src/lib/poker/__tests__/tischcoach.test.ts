import { describe, expect, it } from 'vitest';
import { applyAction, createHand, type GameState } from '../engine';
import { parseCard, type Card } from '../cards';
import { combosForLabel, expandRangeSpec, matrixLabel } from '../ranges';
import { RFI_CHARTS, type Position } from '../../../content/ranges';
import { bewerteAktion, coachForTable, coachPosition, type TischRat } from '../tischcoach';
import { positionOf } from '../ai';

/* Ein Sechser-Tisch, an dem der Mensch (Sitz 0) auf dem gewünschten Platz
   sitzt und alle vor ihm gefoldet haben. */
function tischAuf(pos: Exclude<Position, 'BB'>, hand: [Card, Card]): GameState {
  const n = 6;
  const reihenfolge: Position[] = ['BTN', 'SB', 'BB', 'UTG', 'HJ', 'CO'];
  const offset = reihenfolge.indexOf(pos);
  const button = (0 - offset + n) % n;
  const spieler = Array.from({ length: n }, (_, i) => ({ id: i, name: `P${i}`, stack: 200, isHero: i === 0 }));
  const g = createHand(spieler, button, 1, 2, 1);
  g.players[0].cards = hand;
  let schutz = 0;
  while (g.toActIndex !== 0 && schutz++ < 10) applyAction(g, { type: 'fold' });
  expect(positionOf(g, 0)).toBe(pos);
  return g;
}

const ALLE_LABELS: string[] = [];
for (let r = 0; r < 13; r += 1) for (let c = 0; c < 13; c += 1) ALLE_LABELS.push(matrixLabel(r, c));

describe('Der Coach am Tisch kennt die Eröffnungs-Ranges (6.1)', () => {
  it('77 im Cutoff bei ungeöffnetem Pot bekommt keinen Fold', () => {
    const [a, b] = combosForLabel('77')[0];
    const g = tischAuf('CO', [a, b]);
    const rat = coachForTable(g, null)!;
    expect(rat.empfehlung).toBe('raise');
  });

  it('jede Position: Raise genau für die Hände ihrer Range, sonst nie', () => {
    const plaetze: Array<Exclude<Position, 'BB'>> = ['UTG', 'HJ', 'CO', 'BTN', 'SB'];
    for (const pos of plaetze) {
      const range = expandRangeSpec(RFI_CHARTS.find((c) => c.position === pos)!.raise);
      for (const label of ALLE_LABELS) {
        const [a, b] = combosForLabel(label)[0];
        const rat = coachForTable(tischAuf(pos, [a, b]), null)!;
        if (range.has(label)) expect(rat.empfehlung, `${pos} ${label}`).toBe('raise');
        else expect(rat.empfehlung, `${pos} ${label}`).not.toBe('raise');
      }
    }
  });

  it('Außerhalb der Range steht der Rat auf Fold, nie auf Raise', () => {
    const [a, b] = combosForLabel('72o')[0];
    const rat = coachForTable(tischAuf('UTG', [a, b]), null)!;
    expect(rat.empfehlung).toBe('fold');
    expect(rat.klar).toBe(true);
  });

  it('Gegen eine Erhöhung ist der Rat ein Rat, kein Befund', () => {
    const [a, b] = combosForLabel('QJs')[0];
    const g = tischAuf('BTN', [a, b]);
    // Ein Sitz vor dem Button hat nichts erhöht — wir bauen die Erhöhung selbst.
    g.currentBet = 6;
    const rat = coachForTable(g, null)!;
    expect(rat.klar).toBe(false);
  });

  it('der Platz bestimmt die grobe Einteilung', () => {
    expect(coachPosition('UTG')).toBe('frueh');
    expect(coachPosition('HJ')).toBe('mitte');
    expect(coachPosition('CO')).toBe('spaet');
    expect(coachPosition('BTN')).toBe('spaet');
    expect(coachPosition('SB')).toBe('blinds');
    expect(coachPosition('BB')).toBe('blinds');
  });

  it('der Cutoff hat seine eigene Range, nicht die des Buttons', () => {
    // K2s ist im Button-, aber nicht im Cutoff-Chart.
    const [a, b] = combosForLabel('K2s')[0];
    expect(coachForTable(tischAuf('BTN', [a, b]), null)!.empfehlung).toBe('raise');
    expect(coachForTable(tischAuf('CO', [a, b]), null)!.empfehlung).toBe('fold');
  });

  it('kein Rat, wenn der Mensch nicht am Zug ist', () => {
    const [a, b] = combosForLabel('AA')[0];
    const g = tischAuf('CO', [a, b]);
    g.toActIndex = 3;
    expect(coachForTable(g, null)).toBeNull();
  });
});

describe('Der Coach ab dem Flop', () => {
  function flop(hand: [string, string], board: [string, string, string], einsatz: number): GameState {
    const g = tischAuf('BTN', [parseCard(hand[0]), parseCard(hand[1])]);
    g.street = 'flop';
    g.board = board.map(parseCard);
    // Alle anderen raus, ein Gegner im Spiel
    g.players.forEach((p, i) => { if (i > 1) p.folded = true; });
    g.players[1].folded = false;
    g.players.forEach((p) => { p.committed = 0; p.bet = 0; });
    g.players[0].committed = 6;
    g.players[1].committed = 6 + einsatz;
    g.players[0].bet = 0;
    g.players[1].bet = einsatz;
    g.currentBet = einsatz;
    g.toActIndex = 0;
    return g;
  }

  it('Overpair, nichts zu bezahlen: setzen', () => {
    const rat = coachForTable(flop(['As', 'Ah'], ['7c', '4d', '2s'], 0), 0.85)!;
    expect(rat.empfehlung).toBe('raise');
    expect(rat.handName).toBeDefined();
  });

  it('Luft, nichts zu bezahlen: checken', () => {
    const rat = coachForTable(flop(['9s', '3h'], ['Kc', 'Qd', '7s'], 0), 0.2)!;
    expect(rat.empfehlung).toBe('check');
  });

  it('ein Einsatz ist offen: die Equity wird mit dem Preis verglichen', () => {
    // Pot 12 vor dem Einsatz von 8: nötig 8 / (20 + 8) ≈ 29 %.
    const teuer = coachForTable(flop(['9s', '3h'], ['Kc', 'Qd', '7s'], 8), 0.15)!;
    expect(teuer.empfehlung).toBe('fold');
    expect(teuer.odds!.ok).toBe(false);
    const billig = coachForTable(flop(['Js', 'Th'], ['9c', '8d', '2s'], 8), 0.45)!;
    expect(['call', 'raise']).toContain(billig.empfehlung);
    expect(billig.odds!.ok).toBe(true);
  });

  it('der Preis zählt den Einsatz einmal, nicht doppelt', () => {
    // Pot gesamt 12 + 8 = 20, Call 8: nötig 8 / 28 = 29 %.
    const rat = coachForTable(flop(['9s', '3h'], ['Kc', 'Qd', '7s'], 8), 0.15)!;
    expect(rat.odds!.benoetigt).toBeCloseTo(8 / 28, 2);
  });

  it('ohne Equity gibt es ab dem Flop keinen Rat', () => {
    expect(coachForTable(flop(['As', 'Ah'], ['7c', '4d', '2s'], 0), null)).toBeNull();
  });
});

describe('Die Bewertung nach der Aktion (6.5)', () => {
  const rat = (empfehlung: TischRat['empfehlung'], klar: boolean): TischRat => ({
    empfehlung, klar, position: 'BTN',
    advice: { action: 'raise', headline: '', reasons: [] },
  });

  it('dasselbe ist gut', () => {
    expect(bewerteAktion(rat('raise', true), 'raise')).toBe('gut');
    expect(bewerteAktion(rat('fold', false), 'fold')).toBe('gut');
  });
  it('eine Stufe daneben ist vertretbar', () => {
    expect(bewerteAktion(rat('raise', true), 'call')).toBe('vertretbar');
    expect(bewerteAktion(rat('fold', true), 'call')).toBe('vertretbar');
    expect(bewerteAktion(rat('call', true), 'fold')).toBe('vertretbar');
  });
  it('zwei Stufen daneben ist ein Fehler — nur bei eindeutigem Rat', () => {
    expect(bewerteAktion(rat('fold', true), 'raise')).toBe('fehler');
    expect(bewerteAktion(rat('raise', true), 'fold')).toBe('fehler');
    expect(bewerteAktion(rat('fold', false), 'raise')).toBe('vertretbar');
    expect(bewerteAktion(rat('raise', false), 'fold')).toBe('vertretbar');
  });
  it('Check und Call sind dieselbe Stufe', () => {
    expect(bewerteAktion(rat('check', false), 'call')).toBe('gut');
  });
});
