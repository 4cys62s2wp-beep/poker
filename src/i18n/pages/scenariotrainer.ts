import { defineStrings } from '..';

export const STR = defineStrings(
  {
    back: '← Trainer',
    eyebrow: 'Komplette Spots analysieren',
    title: 'Szenario-Trainer',
    sub: 'Echte Spielsituationen mit allen Informationen – finde die beste Entscheidung. Nach der Antwort siehst du die Bewertung jeder Option. Kontext, falls nicht anders angegeben: 6-max Cash, 100bb.',
    correctCount: (n: number) => `✓ ${n} richtig`,
    totalCount: (n: number) => `${n} gesamt`,
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
    eyebrow: 'Analyze Complete Spots',
    title: 'Scenario Trainer',
    sub: 'Real game situations with full information – find the best decision. After answering you’ll see how every option rates. Context unless stated otherwise: 6-max cash, 100bb.',
    correctCount: (n: number) => `✓ ${n} correct`,
    totalCount: (n: number) => `${n} total`,
    streak: (n: number) => `Streak: ${n}`,
    yourHand: 'Your Hand',
    board: 'Board',
    street: (s: string) => (s === 'Turnier' ? 'Tournament' : s),
    qualityLabel: { best: 'Best option', ok: 'Reasonable', bad: 'Mistake' } as Record<string, string>,
    lessonLabel: 'The concept behind it',
    nextScenario: 'Next Scenario',
  },
);
