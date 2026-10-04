import { defineStrings } from '..';

/* Die deutschen Beschreibungen spiegeln exakt src/content/ranges.ts – die Datei
   selbst bleibt deutsche Daten, die Anzeige läuft über dieses Wörterbuch. */
export const STR = defineStrings(
  {
    title: 'Range-Charts',
    sub: '6-max Cash Game, 100bb effektiv, vereinfacht für die Praxis. Charts sind dein Startpunkt – mit Reads darfst du abweichen.',
    rfiTitle: (pos: string) => `Open-Raise (RFI) aus ${pos}`,
    pctOfHands: (pct: number) => `${pct} % aller Hände`,
    desc: {
      UTG: 'Früheste Position am 6-max-Tisch: Nur die stärksten ~16 % der Hände eröffnen. Alle Paare, starke Asse und die besten Broadways.',
      HJ: 'Eine Position später: ~18–19 %. Mehr suited Hände und Broadways kommen dazu.',
      CO: 'Cutoff: ~25–26 %. Fast alle suited Asse, mittlere suited Connectors und mehr Offsuit-Broadways.',
      BTN: 'Button, die beste Position: ~42–44 %. Sehr breit, weil du postflop immer in Position bist.',
      SB: 'Small Blind: ~35 %. Raise-or-Fold ist die einfachste profitable Strategie – Out of Position gegen den BB nicht zu breit werden.',
    } as Record<string, string>,
    readingHelp: 'Lesehilfe: Diagonale = Paare, oberhalb = suited (s), unterhalb = offsuit (o). Tipp auf ein Feld nennt die Hand.',
    auskunft: (hand: string, aktion: string) => `${hand} · ${aktion}`,
    // Gegen ein Open (E-100)
    modusGruppe: 'Welche Entscheidung?',
    modusRfi: 'Erstes Open',
    modusVs: 'Gegen ein Open',
    duSitzt: 'Du sitzt auf',
    eroeffnerFrage: 'Eröffnet hat',
    vsTitle: (selbst: string, eroeffner: string) => `${selbst} gegen das Open von ${eroeffner}`,
    vsAnteil: (dreiBet: number, call: number) => `3-Bet ${dreiBet} % · Call ${call} %`,
    vsSelbst: {
      ip: 'Du sitzt in Position und bist nach dem Flop zuletzt dran: Mitgehen ist günstig, auch mit mittleren Händen.',
      sb: 'Aus dem Small Blind bist du nach dem Flop immer zuerst dran: Mitgehen ist teuer, deshalb heißt es meist 3-Bet oder Fold.',
      bb: 'Im Big Blind ist 1 bb schon im Pot, und du schließt die Action: Du verteidigst breit.',
    } as Record<string, string>,
    vsEroeffner: {
      frueh: 'Der Eröffner sitzt früh und hat eine enge Range: Geh nur mit starken Händen weiter.',
      spaet: 'Der Eröffner sitzt spät und hat eine weite Range: Du darfst mehr verteidigen.',
    } as Record<string, string>,
    vsRegel: 'Bei Überschneidungen hat die 3-Bet Vorrang. Bluff-3-Bets wie A5s tragen ein Ass in der Hand und blockieren die stärksten Hände des Gegners.',
  },
  {
    title: 'Range Charts',
    sub: '6-max cash game, 100bb effective, simplified for practical play. Charts are your starting point – with reads you may deviate.',
    rfiTitle: (pos: string) => `Open Raise (RFI) from ${pos}`,
    pctOfHands: (pct: number) => `${pct}% of all hands`,
    desc: {
      UTG: 'Earliest position at a 6-max table: open only the strongest ~16% of hands. All pairs, strong aces, and the best broadways.',
      HJ: 'One position later: ~18–19%. More suited hands and broadways join the range.',
      CO: 'Cutoff: ~25–26%. Almost all suited aces, medium suited connectors, and more offsuit broadways.',
      BTN: 'The button, the best position: ~42–44%. Very wide, because you are always in position postflop.',
      SB: 'Small blind: ~35%. Raise-or-fold is the simplest profitable strategy – don’t get too wide out of position against the BB.',
    } as Record<string, string>,
    readingHelp: 'How to read it: diagonal = pairs, above = suited (s), below = offsuit (o). Tap a cell to see the hand.',
    auskunft: (hand: string, aktion: string) => `${hand} · ${aktion}`,
    modusGruppe: 'Which decision?',
    modusRfi: 'First open',
    modusVs: 'Facing an open',
    duSitzt: 'You’re in',
    eroeffnerFrage: 'Opened by',
    vsTitle: (selbst: string, eroeffner: string) => `${selbst} facing the open from ${eroeffner}`,
    vsAnteil: (dreiBet: number, call: number) => `3-bet ${dreiBet}% · call ${call}%`,
    vsSelbst: {
      ip: 'You’re in position and act last after the flop: calling is cheap, even with medium hands.',
      sb: 'From the small blind you act first after the flop every time: calling is expensive, so it’s mostly 3-bet or fold.',
      bb: 'In the big blind 1 bb is already in the pot and you close the action: you defend wide.',
    } as Record<string, string>,
    vsEroeffner: {
      frueh: 'The opener sits early and has a tight range: continue only with strong hands.',
      spaet: 'The opener sits late and has a wide range: you may defend more.',
    } as Record<string, string>,
    vsRegel: 'Where ranges overlap, the 3-bet takes priority. Bluff 3-bets like A5s hold an ace and block the opponent’s strongest hands.',
  },
);
