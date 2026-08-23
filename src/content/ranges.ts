// Preflop-Charts (6-max Cash, 100bb, vereinfacht & lernfreundlich).
// Kurzschreibweisen werden über expandRangeSpec() zu Labels expandiert.

export type Position = 'UTG' | 'HJ' | 'CO' | 'BTN' | 'SB' | 'BB';

export const POSITION_NAMES: Record<Position, string> = {
  UTG: 'Under the Gun',
  HJ: 'Hijack',
  CO: 'Cutoff',
  BTN: 'Button',
  SB: 'Small Blind',
  BB: 'Big Blind',
};

export interface RfiChart {
  position: Exclude<Position, 'BB'>;
  /** Kurzbeschreibung für die UI. */
  description: string;
  /** Range als Kurzschreibweise (wird expandiert). */
  raise: string[];
}

/** Raise-First-In-Ranges (alle folden vor dir → Raise oder Fold). */
export const RFI_CHARTS: RfiChart[] = [
  {
    position: 'UTG',
    description:
      'Früheste Position am 6-max-Tisch: Nur die stärksten ~16 % der Hände eröffnen. Alle Paare, starke Asse und die besten Broadways.',
    raise: ['22+', 'A9s+', 'A5s', 'KTs+', 'QTs+', 'JTs', 'T9s', 'ATo+', 'KQo'],
  },
  {
    position: 'HJ',
    description:
      'Eine Position später: ~18–19 %. Mehr suited Hände und Broadways kommen dazu.',
    raise: [
      '22+', 'A7s+', 'A5s', 'A4s', 'K9s+', 'Q9s+', 'J9s+', 'T9s', '98s',
      'ATo+', 'KJo+', 'QJo',
    ],
  },
  {
    position: 'CO',
    description:
      'Cutoff: ~25–26 %. Fast alle suited Asse, mittlere suited Connectors und mehr Offsuit-Broadways.',
    raise: [
      '22+', 'A2s+', 'K8s+', 'Q9s+', 'J9s+', 'T8s+', '98s', '87s', '76s', '65s', '54s',
      'A9o+', 'KTo+', 'QTo+', 'JTo',
    ],
  },
  {
    position: 'BTN',
    description:
      'Button, die beste Position: ~42–44 %. Sehr breit, weil du postflop immer in Position bist.',
    raise: [
      '22+', 'A2s+', 'K2s+', 'Q4s+', 'J7s+', 'T7s+', '96s+', '86s+', '75s+', '64s+', '54s',
      'A2o+', 'K9o+', 'Q9o+', 'J9o+', 'T8o+', '98o',
    ],
  },
  {
    position: 'SB',
    description:
      'Small Blind: ~35 %. Raise-or-Fold ist die einfachste profitable Strategie – Out of Position gegen den BB nicht zu breit werden.',
    raise: [
      '22+', 'A2s+', 'K6s+', 'Q8s+', 'J8s+', 'T8s+', '97s+', '87s', '76s', '65s', '54s',
      'A8o+', 'A5o', 'KTo+', 'QTo+', 'JTo', 'T9o',
    ],
  },
];

/** Big-Blind-Verteidigung gegen ein Button-Open (2,5bb). */
export const BB_DEFENSE_VS_BTN = {
  description:
    'Gegen ein Button-Open von 2,5bb bekommst du im Big Blind hervorragende Pot Odds und schließt die Action: Du verteidigst breit. Die 3-Bet-Range ist polar aufgebaut – starke Value-Hände plus Bluffs mit guten Blockern. Bei Überschneidungen hat die 3-Bet Vorrang.',
  threeBet: ['TT+', 'AQs+', 'AQo+', 'A5s', 'A4s', 'K9s', '65s', '54s'],
  call: [
    '22', '33', '44', '55', '66', '77', '88', '99',
    'A2s', 'A3s', 'A6s', 'A7s', 'A8s', 'A9s', 'ATs', 'AJs',
    'K2s+', 'Q4s+', 'J7s+', 'T7s+', '96s+', '86s+', '75s+', '64s+', '53s+', '43s',
    'A2o+', 'K9o+', 'Q9o+', 'J8o+', 'T8o+', '98o', '87o',
  ],
};
