import { defineStrings } from '..';

/* Die deutschen Beschreibungen spiegeln exakt src/content/ranges.ts – die Datei
   selbst bleibt deutsche Daten, die Anzeige läuft über dieses Wörterbuch. */
export const STR = defineStrings(
  {
    back: '← Tools',
    title: 'Range-Charts',
    sub: '6-max Cash Game, 100bb effektiv, vereinfacht für die Praxis. Charts sind dein Startpunkt – mit Reads darfst du abweichen.',
    bbdefTitle: 'Big Blind vs. Button-Open (2,5bb)',
    rfiTitle: (pos: string) => `Open-Raise (RFI) aus ${pos}`,
    pctOfHands: (pct: number) => `${pct} % aller Hände`,
    desc: {
      UTG: 'Früheste Position am 6-max-Tisch: Nur die stärksten ~16 % der Hände eröffnen. Alle Paare, starke Asse und die besten Broadways.',
      HJ: 'Eine Position später: ~18–19 %. Mehr suited Hände und Broadways kommen dazu.',
      CO: 'Cutoff: ~25–26 %. Fast alle suited Asse, mittlere suited Connectors und mehr Offsuit-Broadways.',
      BTN: 'Button, die beste Position: ~42–44 %. Sehr breit, weil du postflop immer in Position bist.',
      SB: 'Small Blind: ~35 %. Raise-or-Fold ist die einfachste profitable Strategie – Out of Position gegen den BB nicht zu breit werden.',
      BBDEF:
        'Gegen ein Button-Open von 2,5bb bekommst du im Big Blind hervorragende Pot Odds und schließt die Action: Du verteidigst breit. Die 3-Bet-Range ist polar aufgebaut – starke Value-Hände plus Bluffs mit guten Blockern. Bei Überschneidungen hat die 3-Bet Vorrang.',
    } as Record<string, string>,
    readingHelp: 'Lesehilfe: Diagonale = Paare, oberhalb = suited (s), unterhalb = offsuit (o).',
  },
  {
    back: '← Tools',
    title: 'Range Charts',
    sub: '6-max cash game, 100bb effective, simplified for practical play. Charts are your starting point – with reads you may deviate.',
    bbdefTitle: 'Big Blind vs. Button Open (2.5bb)',
    rfiTitle: (pos: string) => `Open Raise (RFI) from ${pos}`,
    pctOfHands: (pct: number) => `${pct}% of all hands`,
    desc: {
      UTG: 'Earliest position at a 6-max table: open only the strongest ~16% of hands. All pairs, strong aces, and the best broadways.',
      HJ: 'One position later: ~18–19%. More suited hands and broadways join the range.',
      CO: 'Cutoff: ~25–26%. Almost all suited aces, medium suited connectors, and more offsuit broadways.',
      BTN: 'The button, the best position: ~42–44%. Very wide, because you are always in position postflop.',
      SB: 'Small blind: ~35%. Raise-or-fold is the simplest profitable strategy – don’t get too wide out of position against the BB.',
      BBDEF:
        'Against a 2.5bb button open you get excellent pot odds in the big blind and close the action: you defend wide. The 3-bet range is polarized – strong value hands plus bluffs with good blockers. Where ranges overlap, the 3-bet takes priority.',
    } as Record<string, string>,
    readingHelp: 'How to read it: diagonal = pairs, above = suited (s), below = offsuit (o).',
  },
);
