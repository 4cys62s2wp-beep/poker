import { describe, expect, it } from 'vitest';
import { parseCard } from '../cards';
import { evaluateBest } from '../evaluator';
import { handText, showdownVergleich } from '../handtext';
import { createHand, type GameState } from '../engine';

const w = (s: string) => evaluateBest(s.split(' ').map(parseCard));

describe('Hand in Worten', () => {
  it('benennt Paare, Straßen und Flushes mit ihrem Rang', () => {
    expect(handText(w('Qs Qh 7d 4c 2s'))).toBe('Paar Damen');
    expect(handText(w('2s 2h 7d 4c 9s'))).toBe('Paar Zweien');
    expect(handText(w('As Ah 7d 7c 2s'))).toBe('Zwei Paare, Asse und Siebenen');
    expect(handText(w('9s 9h 9d 4c 2s'))).toBe('Drilling Neunen');
    expect(handText(w('5s 6h 7d 8c 9s'))).toBe('Straße bis Neun');
    expect(handText(w('As 2s 7s 4s 9s'))).toBe('Flush, Ass hoch');
    expect(handText(w('Ks Kh Kd 4c 4s'))).toBe('Full House, Könige voll mit Vieren');
    expect(handText(w('As Kh 7d 4c 2s'))).toBe('Ass hoch');
    expect(handText(w('As Ks Qs Js Ts'))).toBe('Royal Flush');
  });

  it('das Rad ist eine Straße bis Fünf', () => {
    expect(handText(w('As 2h 3d 4c 5s'))).toBe('Straße bis Fünf');
  });

  it('englisch', () => {
    expect(handText(w('Qs Qh 7d 4c 2s'), 'en')).toBe('Pair of Queens');
    expect(handText(w('As Kh 7d 4c 2s'), 'en')).toBe('Ace high');
  });
});

describe('Showdown-Vergleich (6.4)', () => {
  function tisch(heldHand: [string, string], gegnerHand: [string, string], board: string[]): GameState {
    const spieler = [0, 1].map((i) => ({ id: i, name: i === 0 ? 'Du' : 'Carla', stack: 200, isHero: i === 0 }));
    const g = createHand(spieler, 0, 1, 2, 1);
    g.players[0].cards = heldHand.map(parseCard);
    g.players[1].cards = gegnerHand.map(parseCard);
    g.board = board.map(parseCard);
    g.street = 'showdown';
    g.handOver = true;
    return g;
  }

  it('nennt beide Hände', () => {
    const v = showdownVergleich(tisch(['2s', '2h'], ['Qs', 'Qh'], ['9c', '5d', '3s', 'Kd', '7h']))!;
    expect(v.geteilt).toBe(false);
    expect(v.sieger).toMatchObject({ name: 'Carla', isHero: false, text: 'Paar Damen' });
    expect(v.gegner).toMatchObject({ name: 'Du', isHero: true, text: 'Paar Zweien' });
  });

  it('bei gleichem Paar entscheidet der Kicker — und wird genannt', () => {
    const v = showdownVergleich(tisch(['Qs', 'Tc'], ['Qd', 'Ac'], ['Qh', '5d', '3s', '8d', '7h']))!;
    expect(v.sieger.text).toBe('Paar Damen, Kicker Ass');
    expect(v.gegner!.text).toBe('Paar Damen, Kicker Zehn');
  });

  it('geteilter Pot: kein Verlierer', () => {
    const v = showdownVergleich(tisch(['2s', '3h'], ['2d', '3c'], ['Ah', 'Kd', 'Qs', 'Jd', 'Th']))!;
    expect(v.geteilt).toBe(true);
    expect(v.gegner).toBeUndefined();
  });

  it('ohne Showdown nichts zu vergleichen', () => {
    const g = tisch(['2s', '2h'], ['Qs', 'Qh'], ['9c', '5d', '3s']);
    g.street = 'flop';
    g.players[1].folded = true;
    expect(showdownVergleich(g)).toBeNull();
  });
});
