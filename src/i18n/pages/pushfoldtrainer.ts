import { defineStrings } from '..';
import type { PushStack } from '../../content/pushfold';

export const STR = defineStrings(
  {
    back: '← Trainer',
    eyebrow: 'Turnier-Endgame',
    title: 'Push/Fold-Trainer',
    sub: 'Kurzer Stack im Turnier, alle folden zu dir: All-in oder Fold? Trainiere die vereinfachten Nash-Ranges für 10bb und 5bb – ohne Antes.',
    correctCount: (n: number) => `✓ ${n} richtig`,
    totalCount: (n: number) => `${n} gesamt`,
    streak: (n: number) => `Serie: ${n}`,
    introBefore: 'Turnier, ',
    stackApprox: (stack: PushStack) => (stack === '10bb' ? '≈ 10 Big Blinds' : '≈ 5 Big Blinds'),
    introAfterStack: ' übrig. Du sitzt ',
    introAfterPosition: '. Alle vor dir folden.',
    correctFb: 'Richtig! ',
    wrongFb: 'Nicht ganz. ',
    verdict: (label: string, stack: PushStack, position: string, isShove: boolean, pct: number) =>
      `${label} ist mit ${stack} aus ${position} ${isShove ? 'ein Standard-Shove' : 'kein profitabler Shove'} (Shove-Range: ~${pct} % aller Hände).`,
    legendAllIn: 'All-in',
    legendFold: 'Fold',
    allInBtn: 'All-in',
    foldBtn: 'Fold',
    nextHand: 'Nächste Hand',
    footnote:
      'Vereinfachte Nash-Push-Ranges ohne Antes. Mit Antes wird noch breiter geschoben; gegen Spieler, die zu wenig callen, ebenfalls.',
  },
  {
    back: '← Trainers',
    eyebrow: 'Tournament Endgame',
    title: 'Push/Fold Trainer',
    sub: 'Short stack in a tournament, everyone folds to you: all-in or fold? Train the simplified Nash ranges for 10bb and 5bb – no antes.',
    correctCount: (n: number) => `✓ ${n} correct`,
    totalCount: (n: number) => `${n} total`,
    streak: (n: number) => `Streak: ${n}`,
    introBefore: 'Tournament, ',
    stackApprox: (stack: PushStack) => (stack === '10bb' ? '≈ 10 big blinds' : '≈ 5 big blinds'),
    introAfterStack: ' left. You’re in ',
    introAfterPosition: '. Everyone folds to you.',
    correctFb: 'Correct! ',
    wrongFb: 'Not quite. ',
    verdict: (label: string, stack: PushStack, position: string, isShove: boolean, pct: number) =>
      `${label} is ${isShove ? 'a standard shove' : 'not a profitable shove'} at ${stack} from ${position} (shoving range: ~${pct}% of all hands).`,
    legendAllIn: 'All-in',
    legendFold: 'Fold',
    allInBtn: 'All-in',
    foldBtn: 'Fold',
    nextHand: 'Next Hand',
    footnote:
      'Simplified Nash push ranges without antes. With antes you shove even wider – likewise against players who call too little.',
  },
);
