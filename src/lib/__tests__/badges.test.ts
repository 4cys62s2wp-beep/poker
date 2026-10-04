/* Tests für die automatische Abzeichen-Vergabe (applyAutoBadges in AppState).
   Wichtig: Jedes in badges.ts definierte Abzeichen muss auch erreichbar sein. */

import { describe, expect, it } from 'vitest';
import { applyAutoBadges, sanitizeAppData, xpThreshold, type AppData, type TrainerStats } from '../../state/AppState';
import { BADGES } from '../../content/badges';
import { ALL_MODULES } from '../../content';

const ALL_LESSON_IDS = ALL_MODULES.flatMap((m) => m.lessons.map((l) => l.id));

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

describe('Module, die per Test bestanden wurden (E-097)', () => {
  const perTest = (ids: string[]) => Object.fromEntries(
    ids.map((id) => [id, { completedAt: '2026-10-01T10:00:00.000Z', quizScore: 0, quizTotal: 0, perTest: true }]),
  );

  it('zählen nicht für „Erste Schritte“, „Wissbegierig“ und „Stammschüler“', () => {
    const ids = ALL_LESSON_IDS.slice(0, 22);
    const d = dataWith({ completedLessons: perTest(ids) });
    applyAutoBadges(d);
    expect(d.badges['first-lesson']).toBeUndefined();
    expect(d.badges['five-lessons']).toBeUndefined();
    expect(d.badges['twenty-lessons']).toBeUndefined();
  });

  it('lassen aber das Abzeichen des Moduls zu, das sie abschließen', () => {
    const d = dataWith({ completedLessons: perTest(ALL_LESSON_IDS.filter((id) => id.startsWith('m1-'))) });
    applyAutoBadges(d);
    expect(d.badges['module-basics']).toBeTruthy();
  });

  it('zählen zusammen mit gelesenen Lektionen nur mit den gelesenen', () => {
    const gelesen = { 'm2-l1': { completedAt: '2026-10-01T10:00:00.000Z', quizScore: 5, quizTotal: 5 } };
    const d = dataWith({ completedLessons: { ...perTest(['m1-l1', 'm1-l2', 'm1-l3', 'm1-l4']), ...gelesen } });
    applyAutoBadges(d);
    expect(d.badges['first-lesson']).toBeTruthy();
    expect(d.badges['five-lessons']).toBeUndefined();
  });

  it('übersteht das Laden mit ihrer Kennzeichnung', () => {
    const d = sanitizeAppData({ completedLessons: perTest(['m1-l1']) });
    expect(d.completedLessons['m1-l1'].perTest).toBe(true);
    const ohne = sanitizeAppData({ completedLessons: { 'm1-l1': { completedAt: 'x', quizScore: 3, quizTotal: 5 } } });
    expect('perTest' in ohne.completedLessons['m1-l1']).toBe(false);
  });
});
