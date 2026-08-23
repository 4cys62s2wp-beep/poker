import { describe, expect, it } from 'vitest';
import { applyAction, createHand, legalActions } from '../engine';
import { BOT_PROFILES, decideBotAction, type BotStyle } from '../ai';

function seededRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

describe('Bot-Simulation', () => {
  it('300 komplette Hände (2–6 Bots): keine Fehler, Chips bleiben erhalten', () => {
    const styles: BotStyle[] = ['tight', 'standard', 'loose', 'aggro'];
    for (let round = 0; round < 300; round++) {
      const rng = seededRng(round * 7919 + 17);
      const numPlayers = 2 + (round % 5);
      const players = Array.from({ length: numPlayers }, (_, i) => ({
        id: i,
        name: `Bot${i}`,
        stack: 100 + ((round * 31 + i * 53) % 300),
        isHero: false,
      }));
      const totalBefore = players.reduce((s, p) => s + p.stack, 0);
      const state = createHand(players, round % numPlayers, 1, 2, round, rng);

      let guard = 0;
      while (!state.handOver && guard++ < 200) {
        const idx = state.toActIndex;
        expect(idx).toBeGreaterThanOrEqual(0);
        const profile = BOT_PROFILES[styles[(idx + round) % styles.length]];
        const action = decideBotAction(state, idx, profile, rng);
        // Aktion muss legal sein und darf nicht werfen
        applyAction(state, action);
      }
      expect(guard).toBeLessThan(200);
      expect(state.handOver).toBe(true);

      const totalAfter = state.players.reduce((s, p) => s + p.stack, 0);
      expect(totalAfter).toBe(totalBefore);
      // Niemand darf negative Chips haben
      for (const p of state.players) expect(p.stack).toBeGreaterThanOrEqual(0);
    }
  }, 60000);

  it('legalActions liefert konsistente Grenzen', () => {
    const rng = seededRng(99);
    const state = createHand(
      [
        { id: 0, name: 'A', stack: 200, isHero: false },
        { id: 1, name: 'B', stack: 200, isHero: false },
        { id: 2, name: 'C', stack: 200, isHero: false },
      ],
      0, 1, 2, 1, rng,
    );
    const la = legalActions(state);
    expect(la.callAmount).toBe(2);
    expect(la.minRaiseTo).toBe(4);
    expect(la.maxRaiseTo).toBe(200);
  });
});
