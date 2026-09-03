import { defineStrings } from '..';

export const STR = defineStrings(
  {
    back: '← Trainer',
    title: 'Equity-Schätzer',
    sub: (tolerance: number) =>
      `Beide Hände offen · richtig ist alles innerhalb von ±${tolerance} Prozentpunkten`,
    correctCount: (n: number) => `✓ ${n} richtig`,
    totalCount: (n: number) => `${n} gesamt`,
    streak: (n: number) => `Serie: ${n}`,
    yourHand: 'Deine Hand',
    villain: 'Gegner',
    vs: 'vs.',
    board: 'Board',
    preflopTag: '(Preflop)',
    noBoard: 'Noch keine Gemeinschaftskarten.',
    guessLabel: 'Deine Schätzung: Equity deiner Hand',
    pct: (n: number) => `${n} %`,
    reveal: 'Auflösen',
    correctFb: '✓ Stark geschätzt! ',
    wrongFb: '✗ Daneben. ',
    actualPrefix: 'Tatsächliche Equity: ',
    resultDetail: (guess: number, diff: number, villainEq: number) =>
      ` (deine Schätzung: ${guess} %, Abweichung ${diff} Punkte). Gegner: ${villainEq} %.`,
    nextMatchup: 'Nächstes Matchup →',
  },
  {
    back: '← Trainers',
    title: 'Equity Estimator',
    sub: (tolerance: number) =>
      `Both hands face up · anything within ±${tolerance} percentage points counts`,
    correctCount: (n: number) => `✓ ${n} correct`,
    totalCount: (n: number) => `${n} total`,
    streak: (n: number) => `Streak: ${n}`,
    yourHand: 'Your Hand',
    villain: 'Opponent',
    vs: 'vs.',
    board: 'Board',
    preflopTag: '(Preflop)',
    noBoard: 'No community cards yet.',
    guessLabel: 'Your estimate: your hand’s equity',
    pct: (n: number) => `${n}%`,
    reveal: 'Reveal',
    correctFb: '✓ Great read! ',
    wrongFb: '✗ Off the mark. ',
    actualPrefix: 'Actual equity: ',
    resultDetail: (guess: number, diff: number, villainEq: number) =>
      ` (your estimate: ${guess}%, off by ${diff} points). Opponent: ${villainEq}%.`,
    nextMatchup: 'Next Matchup →',
  },
);
