// Tests für die Daten-Sanitisierung (Import / Cloud-Sync-Härtung).

import { describe, expect, it } from 'vitest';
import { sanitizeAppData, levelForXp, xpThreshold } from '../../../state/AppState';

describe('sanitizeAppData', () => {
  it('liefert für Müll-Eingaben ein valides Default-Objekt', () => {
    for (const input of [null, undefined, 42, 'hack', [], { xp: 'NaN' }]) {
      const d = sanitizeAppData(input);
      expect(d.xp).toBe(0);
      expect(d.sessions).toEqual([]);
      expect(d.reviews).toEqual([]);
      expect(d.hands).toEqual([]);
      expect(d.completedLessons).toEqual({});
    }
  });

  it('übernimmt valide Werte und verwirft manipulierte', () => {
    const d = sanitizeAppData({
      xp: 500,
      name: 'Lorenz',
      completedLessons: {
        'm1-l1': { completedAt: 'x', quizScore: 4, quizTotal: 5 },
        '<script>': { completedAt: 'x', quizScore: 1, quizTotal: 1 },
        'm2-l3': 'kaputt',
      },
      badges: { 'first-lesson': '2026-01-01', 'fake-badge': 'x' },
      sessions: [
        { id: 's1', date: '2026-01-01', type: 'live', game: 'NL2', buyIn: 10, cashOut: 15, minutes: 60 },
        { id: 's2', date: '2026-01-02', type: 'evil', game: 'x', buyIn: -5, cashOut: 'a', minutes: 30 },
        'müll',
      ],
      hands: [
        { id: 'h1', date: 'x', handNumber: 1, heroCards: [0, 51], board: [1, 2, 99], result: 'won', amount: 10, players: 2, log: ['a'] },
      ],
    });
    expect(d.xp).toBe(500);
    expect(d.name).toBe('Lorenz');
    expect(Object.keys(d.completedLessons)).toEqual(['m1-l1']);
    expect(Object.keys(d.badges)).toEqual(['first-lesson']);
    expect(d.sessions).toHaveLength(2);
    expect(d.sessions[1].type).toBe('online'); // 'evil' → Fallback
    expect(d.sessions[1].buyIn).toBe(0); // negativ → 0
    expect(d.hands[0].board).toEqual([1, 2]); // 99 ist keine Karte
  });

  it('begrenzt extreme Werte', () => {
    const d = sanitizeAppData({ xp: 999_999_999_999, name: 'x'.repeat(500) });
    expect(d.xp).toBe(10_000_000);
    expect(d.name.length).toBeLessThanOrEqual(40);
  });
});

describe('Level-Kurve', () => {
  it('Schwellen wachsen monoton und Level 15 ist erreichbar', () => {
    for (let l = 1; l < 20; l++) {
      expect(xpThreshold(l + 1)).toBeGreaterThan(xpThreshold(l));
    }
    expect(levelForXp(xpThreshold(15))).toBe(15);
    expect(levelForXp(0)).toBe(1);
  });
});
