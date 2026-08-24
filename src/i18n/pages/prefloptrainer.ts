import { defineStrings } from '..';
import type { Position } from '../../content/ranges';

type RfiPosition = Exclude<Position, 'BB'>;

export const STR = defineStrings(
  {
    back: '← Trainer',
    title: 'Preflop-Trainer',
    sub: '6-max Cash Game, 100bb effektiv. Entscheide nach Chart – nach der Antwort siehst du die komplette Range.',
    correctCount: (n: number) => `✓ ${n} richtig`,
    totalCount: (n: number) => `${n} gesamt`,
    streak: (n: number) => `Serie: ${n}`,
    rfiIntroBefore: 'Du sitzt ',
    rfiIntroAfter: '. Alle vor dir folden.',
    bbIntroBefore: 'Du sitzt im ',
    bbIntroStrong: 'Big Blind',
    bbIntroAfter: '. Der Button eröffnet auf 2,5bb, der Small Blind foldet.',
    correctFb: '✓ Richtig! ',
    wrongFb: '✗ Nicht ganz. ',
    rfiVerdict: (label: string, isOpen: boolean, position: string) =>
      `${label} ist ${isOpen ? 'ein Standard-Open' : 'kein Open'} aus ${position}.`,
    bbVerdict: (label: string, action: string) =>
      `${label} gehört in die ${action === '3bet' ? '3-Bet-Range' : action === 'call' ? 'Call-Range' : 'Fold-Range'}.`,
    rfiDesc: {
      UTG: 'Früheste Position am 6-max-Tisch: Nur die stärksten ~16 % der Hände eröffnen. Alle Paare, starke Asse und die besten Broadways.',
      HJ: 'Eine Position später: ~18–19 %. Mehr suited Hände und Broadways kommen dazu.',
      CO: 'Cutoff: ~25–26 %. Fast alle suited Asse, mittlere suited Connectors und mehr Offsuit-Broadways.',
      BTN: 'Button, die beste Position: ~42–44 %. Sehr breit, weil du postflop immer in Position bist.',
      SB: 'Small Blind: ~35 %. Raise-or-Fold ist die einfachste profitable Strategie – Out of Position gegen den BB nicht zu breit werden.',
    } as Record<RfiPosition, string>,
    bbDefenseDesc:
      'Gegen ein Button-Open von 2,5bb bekommst du im Big Blind hervorragende Pot Odds und schließt die Action: Du verteidigst breit. Die 3-Bet-Range ist polar aufgebaut – starke Value-Hände plus Bluffs mit guten Blockern. Bei Überschneidungen hat die 3-Bet Vorrang.',
    nextHand: 'Nächste Hand →',
  },
  {
    back: '← Trainers',
    title: 'Preflop Trainer',
    sub: '6-max cash game, 100bb effective. Decide by the chart – after answering you’ll see the full range.',
    correctCount: (n: number) => `✓ ${n} correct`,
    totalCount: (n: number) => `${n} total`,
    streak: (n: number) => `Streak: ${n}`,
    rfiIntroBefore: 'You’re in ',
    rfiIntroAfter: '. Everyone folds to you.',
    bbIntroBefore: 'You’re in the ',
    bbIntroStrong: 'Big Blind',
    bbIntroAfter: '. The Button opens to 2.5bb and the Small Blind folds.',
    correctFb: '✓ Correct! ',
    wrongFb: '✗ Not quite. ',
    rfiVerdict: (label: string, isOpen: boolean, position: string) =>
      `${label} is ${isOpen ? 'a standard open' : 'not an open'} from ${position}.`,
    bbVerdict: (label: string, action: string) =>
      `${label} belongs in the ${action === '3bet' ? '3-bet range' : action === 'call' ? 'calling range' : 'folding range'}.`,
    rfiDesc: {
      UTG: 'Earliest position at a 6-max table: only the strongest ~16% of hands open. All pairs, strong aces, and the best broadways.',
      HJ: 'One seat later: ~18–19%. More suited hands and broadways join the range.',
      CO: 'Cutoff: ~25–26%. Almost all suited aces, medium suited connectors, and more offsuit broadways.',
      BTN: 'Button, the best position: ~42–44%. Very wide, because you’re always in position postflop.',
      SB: 'Small Blind: ~35%. Raise-or-fold is the simplest profitable strategy – don’t get too wide out of position against the BB.',
    } as Record<RfiPosition, string>,
    bbDefenseDesc:
      'Against a 2.5bb Button open you get excellent pot odds in the Big Blind and close the action, so you defend wide. The 3-bet range is built polar – strong value hands plus bluffs with good blockers. Where they overlap, the 3-bet takes priority.',
    nextHand: 'Next Hand →',
  },
);
