import { describe, expect, it } from 'vitest';
import {
  act,
  activeSeats,
  blindsForHand,
  currentPlayer,
  settle,
  startHand,
  totalPot,
  type LocalTableConfig,
} from '../table/local';

function config(overrides: Partial<LocalTableConfig> = {}): LocalTableConfig {
  return {
    seats: [
      { id: 0, name: 'Lorenz', stack: 1000 },
      { id: 1, name: 'Mia', stack: 1000 },
      { id: 2, name: 'Jonas', stack: 1000 },
    ],
    smallBlind: 10,
    bigBlind: 20,
    raiseBlindsEvery: 0,
    ...overrides,
  };
}

describe('Blind-Stufen', () => {
  it('Cash-Game: Blinds bleiben konstant', () => {
    const c = config();
    expect(blindsForHand(c, 1)).toEqual({ sb: 10, bb: 20 });
    expect(blindsForHand(c, 99)).toEqual({ sb: 10, bb: 20 });
  });

  it('Turnier: verdoppelt sich im gewählten Abstand', () => {
    const c = config({ raiseBlindsEvery: 5 });
    expect(blindsForHand(c, 1)).toEqual({ sb: 10, bb: 20 });
    expect(blindsForHand(c, 5)).toEqual({ sb: 10, bb: 20 });
    expect(blindsForHand(c, 6)).toEqual({ sb: 20, bb: 40 });
    expect(blindsForHand(c, 11)).toEqual({ sb: 40, bb: 80 });
  });

  it('Blinds laufen nicht ins Unendliche', () => {
    const c = config({ raiseBlindsEvery: 1 });
    expect(blindsForHand(c, 500).bb).toBeLessThanOrEqual(20 * 2 ** 12);
  });
});

describe('Sitzplätze', () => {
  it('Spieler ohne Chips sitzen aus', () => {
    const seats = [
      { id: 0, name: 'A', stack: 500 },
      { id: 1, name: 'B', stack: 0 },
      { id: 2, name: 'C', stack: 20 },
    ];
    expect(activeSeats(seats).map((s) => s.id)).toEqual([0, 2]);
  });

  it('unter zwei zahlungsfähigen Spielern startet keine Hand', () => {
    const c = config({ seats: [{ id: 0, name: 'A', stack: 100 }, { id: 1, name: 'B', stack: 0 }] });
    expect(startHand(c, 1, 0)).toBeNull();
  });
});

describe('Handverlauf auf einem Gerät', () => {
  it('startet verdeckt und wechselt erst nach dem Aufdecken in den Zug', () => {
    const s = startHand(config(), 1, 0)!;
    expect(s.phase).toBe('pass');
    expect(currentPlayer(s)).not.toBeNull();
    // Blinds sind gesetzt
    expect(totalPot(s.game)).toBe(30);
  });

  it('eine Aktion reicht das Gerät weiter', () => {
    let s = startHand(config(), 1, 0)!;
    s = { ...s, phase: 'act' };
    const before = currentPlayer(s)!.id;
    s = act(s, { type: 'fold' });
    expect(s.lastActorId).toBe(before);
    // Entweder weitergeben oder Hand vorbei
    expect(['pass', 'showdown']).toContain(s.phase);
  });

  it('im Zustand „pass" wird keine Aktion angenommen', () => {
    const s = startHand(config(), 1, 0)!;
    const after = act(s, { type: 'fold' });
    expect(after).toBe(s);
  });

  it('Heads-Up: Fold beendet die Hand sofort und der Pot geht an den anderen', () => {
    const c = config({ seats: [{ id: 0, name: 'A', stack: 1000 }, { id: 1, name: 'B', stack: 1000 }] });
    let s = startHand(c, 1, 0)!;
    s = act({ ...s, phase: 'act' }, { type: 'fold' });
    expect(s.phase).toBe('showdown');
    expect(s.game.handOver).toBe(true);
    const after = settle(s);
    const total = after.seats.reduce((sum, x) => sum + x.stack, 0);
    // Chips bleiben erhalten
    expect(total).toBe(2000);
  });

  it('Chips bleiben über eine komplette Hand hinweg erhalten', () => {
    let s = startHand(config(), 1, 0)!;
    let guard = 0;
    while (!s.game.handOver && guard++ < 200) {
      s = { ...s, phase: 'act' };
      const la = s.game.players[s.game.toActIndex];
      if (!la) break;
      s = act(s, { type: 'call' });
    }
    const after = settle(s);
    expect(after.seats.reduce((sum, x) => sum + x.stack, 0)).toBe(3000);
  });

  it('settle schreibt Gewinne in die Sitzplätze zurück', () => {
    const c = config({ seats: [{ id: 0, name: 'A', stack: 1000 }, { id: 1, name: 'B', stack: 1000 }] });
    let s = startHand(c, 1, 0)!;
    s = act({ ...s, phase: 'act' }, { type: 'fold' });
    const after = settle(s);
    const winner = after.seats.find((x) => x.stack > 1000);
    const loser = after.seats.find((x) => x.stack < 1000);
    expect(winner).toBeDefined();
    expect(loser).toBeDefined();
  });
});
