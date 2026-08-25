import { defineStrings } from '..';

export const STR = defineStrings(
  {
    perfect: 'Perfekt! Du hast alles verstanden.',
    good: 'Gut gemacht! Schau dir die Erklärungen der falschen Antworten noch einmal an.',
    retry: 'Lies die Lektion am besten noch einmal – dann klappt es!',
    question: (n: number, total: number) => `Frage ${n} / ${total}`,
    correctCount: (n: number) => `✓ ${n} richtig`,
    right: '✓ Richtig! ',
    wrong: '✗ Leider falsch. ',
    finish: 'Quiz abschließen',
    next: 'Nächste Frage →',
    resultLabel: (score: number, total: number) => `Ergebnis: ${score} von ${total} richtig`,
  },
  {
    perfect: 'Perfect! You’ve got this down.',
    good: 'Well done! Take another look at the explanations for the ones you missed.',
    retry: 'Give the lesson another read – you’ll get there!',
    question: (n: number, total: number) => `Question ${n} / ${total}`,
    correctCount: (n: number) => `✓ ${n} correct`,
    right: '✓ Correct! ',
    wrong: '✗ Not quite. ',
    finish: 'Finish quiz',
    next: 'Next question →',
    resultLabel: (score: number, total: number) => `Result: ${score} out of ${total} correct`,
  },
);
