// Push/Fold-Ranges für kurze Stacks (Turnier, keine Antes, vereinfacht nach
// Nash-Gleichgewichts-Ranges – bewusst leicht konservativ gerundet, damit sie
// als Lern-Grundlage taugen).

import type { Position } from './ranges';

export type PushStack = '10bb' | '5bb';

export interface PushChart {
  stack: PushStack;
  position: Exclude<Position, 'BB'>;
  /** Range als Kurzschreibweise (expandRangeSpec-kompatibel). */
  push: string[];
}

export const PUSH_CHARTS: PushChart[] = [
  // ---------- ~10bb ----------
  {
    stack: '10bb',
    position: 'UTG',
    push: ['22+', 'A2s+', 'A9o+', 'KTs+', 'KQo', 'QJs'],
  },
  {
    stack: '10bb',
    position: 'HJ',
    push: ['22+', 'A2s+', 'A7o+', 'K9s+', 'KJo+', 'QTs+', 'JTs', 'T9s'],
  },
  {
    stack: '10bb',
    position: 'CO',
    push: ['22+', 'A2s+', 'A4o+', 'K7s+', 'KTo+', 'Q9s+', 'QJo', 'J9s+', 'T8s+', '98s', '87s'],
  },
  {
    stack: '10bb',
    position: 'BTN',
    push: [
      '22+', 'A2s+', 'A2o+', 'K4s+', 'K9o+', 'Q7s+', 'QTo+', 'J8s+', 'JTo', 'T7s+', '97s+', '87s', '76s', '65s',
    ],
  },
  {
    stack: '10bb',
    position: 'SB',
    push: [
      '22+', 'A2s+', 'A2o+', 'K2s+', 'K5o+', 'Q4s+', 'Q9o+', 'J6s+', 'J9o+', 'T6s+', 'T8o+', '96s+', '98o',
      '85s+', '87o', '75s+', '64s+', '54s',
    ],
  },
  // ---------- ~5bb ----------
  {
    stack: '5bb',
    position: 'UTG',
    push: ['22+', 'A2s+', 'A4o+', 'K8s+', 'KTo+', 'Q9s+', 'QJo', 'J9s+', 'T9s', '98s'],
  },
  {
    stack: '5bb',
    position: 'HJ',
    push: ['22+', 'A2s+', 'A2o+', 'K5s+', 'K9o+', 'Q8s+', 'QTo+', 'J8s+', 'JTo', 'T8s+', '98s', '87s'],
  },
  {
    stack: '5bb',
    position: 'CO',
    push: [
      '22+', 'A2s+', 'A2o+', 'K2s+', 'K7o+', 'Q5s+', 'Q9o+', 'J7s+', 'J9o+', 'T7s+', 'T9o', '96s+', '86s+', '76s', '65s',
    ],
  },
  {
    stack: '5bb',
    position: 'BTN',
    push: [
      '22+', 'A2s+', 'A2o+', 'K2s+', 'K4o+', 'Q2s+', 'Q7o+', 'J4s+', 'J8o+', 'T6s+', 'T8o+', '95s+', '97o+',
      '85s+', '87o', '74s+', '76o', '64s+', '53s+',
    ],
  },
  {
    stack: '5bb',
    position: 'SB',
    push: [
      '22+', 'A2s+', 'A2o+', 'K2s+', 'K2o+', 'Q2s+', 'Q2o+', 'J2s+', 'J5o+', 'T2s+', 'T6o+', '92s+', '96o+',
      '84s+', '86o+', '74s+', '75o+', '63s+', '65o', '53s+', '43s',
    ],
  },
];

export const PUSH_STACK_INFO: Record<PushStack, string> = {
  '10bb':
    'Mit rund 10 Big Blinds ist das Standard-Raise-Spiel fast tot: Wer eröffnet, ist praktisch committed. Deshalb schiebst du deine spielbaren Hände direkt all-in – maximaler Fold-Druck, keine schwierigen Postflop-Spots.',
  '5bb':
    'Mit 5 Big Blinds oder weniger ist jede Hand fast ein Münzwurf gegen die Blinds. Die Shove-Ranges werden extrem breit – vor allem im Small Blind, wo du gegen eine einzige Zufallshand oft einfach vorne bist.',
};
