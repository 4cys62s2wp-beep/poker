import { defineStrings } from '..';

export const STR = defineStrings(
  {
    back: '← Trainer',
    title: 'Szenario-Trainer',
    sub: '6-max Cash · 100 bb, falls nicht anders angegeben',
    streak: (n: number) => `Serie: ${n}`,
    yourHand: 'Deine Hand',
    board: 'Board',
    street: (s: string) => s,
    qualityLabel: { best: 'Beste Option', ok: 'Vertretbar', bad: 'Fehler' } as Record<string, string>,
    lessonLabel: 'Das Konzept dahinter',
    nextScenario: 'Nächstes Szenario',
  },
  {
    back: '← Trainers',
    title: 'Scenario Trainer',
    sub: '6-max cash · 100 bb unless stated otherwise',
    streak: (n: number) => `Streak: ${n}`,
    yourHand: 'Your Hand',
    board: 'Board',
    street: (s: string) => (s === 'Turnier' ? 'Tournament' : s),
    qualityLabel: { best: 'Best option', ok: 'Reasonable', bad: 'Mistake' } as Record<string, string>,
    lessonLabel: 'The concept behind it',
    nextScenario: 'Next Scenario',
  },
);
