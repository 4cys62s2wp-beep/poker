/* Tests für die automatische Abzeichen-Vergabe (applyAutoBadges in AppState).
   Wichtig: Jedes in badges.ts definierte Abzeichen muss auch erreichbar sein. */

import { describe, expect, it } from 'vitest';
import { applyAutoBadges, sanitizeAppData, xpThreshold, type AppData, type TrainerStats } from '../../state/AppState';
import { BADGES } from '../../content/badges';

function trainer(correct: number): TrainerStats {
  return { attempts: correct, correct, streak: 0, bestStreak: 0 };
}

function dataWith(patch: Partial<AppData>): AppData {
  return { ...sanitizeAppData({}), ...patch };
}

describe('applyAutoBadges', () => {
  it('vergibt trainer-100 ab 100 richtigen Antworten über alle Trainer', () => {
    const almost = dataWith({ trainers: { szenario: trainer(60), pushfold: trainer(39) } });
    applyAutoBadges(almost);
    expect(almost.badges['trainer-100']).toBeUndefined();

    const reached = dataWith({ trainers: { szenario: trainer(60), pushfold: trainer(40) } });
    applyAutoBadges(reached);
    expect(reached.badges['trainer-100']).toBeTruthy();

    // Ein einzelner Trainer reicht ebenfalls
    const single = dataWith({ trainers: { szenario: trainer(120) } });
    applyAutoBadges(single);
    expect(single.badges['trainer-100']).toBeTruthy();
  });

  it('behält bereits vergebene Abzeichen mit ihrem Datum', () => {
    const d = dataWith({ trainers: { szenario: trainer(200) }, badges: { 'trainer-100': '2026-01-01' } });
    applyAutoBadges(d);
    expect(d.badges['trainer-100']).toBe('2026-01-01');
  });

  it('vergibt Level-Abzeichen anhand der XP', () => {
    const l4 = dataWith({ xp: xpThreshold(5) - 1 });
    applyAutoBadges(l4);
    expect(l4.badges['level-5']).toBeUndefined();

    const l5 = dataWith({ xp: xpThreshold(5) });
    applyAutoBadges(l5);
    expect(l5.badges['level-5']).toBeTruthy();
    expect(l5.badges['level-10']).toBeUndefined();

    const l10 = dataWith({ xp: xpThreshold(10) });
    applyAutoBadges(l10);
    expect(l10.badges['level-10']).toBeTruthy();
  });

  it('kennt jedes vergebene Abzeichen aus der Definitionsliste', () => {
    const d = dataWith({ xp: xpThreshold(12), trainers: { szenario: trainer(150) } });
    applyAutoBadges(d);
    const known = new Set(BADGES.map((b) => b.id));
    for (const id of Object.keys(d.badges)) expect(known.has(id)).toBe(true);
  });
});
