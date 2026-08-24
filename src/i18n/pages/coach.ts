import { defineStrings } from '..';

/* Live-Coach-Seite: alle UI-Texte. Die Empfehlungs- und Analysetexte selbst
   kommen sprachabhängig aus lib/poker/coach.ts bzw. lib/poker/analysis.ts. */
export const STR = defineStrings(
  {
    eyebrow: 'Dein Berater am Tisch',
    title: 'Live-Coach',
    sub: 'Gib deine Hand ein und erhalte Street für Street eine klare Empfehlung: setzen, callen oder aussteigen – zugeschnitten auf lockere Low-Stakes-Runden.',

    // Setup
    playersQuestion: 'Wie viele Spieler sitzen am Tisch (mit dir)?',
    positionQuestion: 'Wo sitzt du (relativ zum Dealer)?',
    beforeQuestion: 'Was ist vor dir passiert?',
    noRaiseYet: 'Noch kein Raise',
    someoneRaised: 'Jemand hat erhöht',
    limpersQuestion: 'Wie viele sind nur mitgegangen (Limper)?',
    toHand: 'Weiter: Hand eingeben →',
    setupNote:
      'Hinweis: Gedacht für private Runden und fürs Training. In Casinos und Cardrooms ist Handy-Hilfe am Tisch nicht erlaubt – dort bleibt die App in der Tasche.',

    // Karteneingabe
    holeLabel: 'Deine beiden Karten',
    yourHand: 'Deine Hand:',
    handShort: 'Hand:',
    boardShort: 'Board:',
    flopLabel: 'Flop – die ersten drei Boardkarten',
    turnCardLabel: 'Turn-Karte',
    riverCardLabel: 'River-Karte',

    // Streets
    streetPreflop: 'Preflop',
    streetFlop: 'Flop',
    streetTurn: 'Turn',
    streetRiver: 'River',

    // Empfehlungsbox
    recommendation: 'Empfehlung:',
    homegameTip: 'Homegame-Tipp',

    // Equity-Karte
    winChance: 'Gewinnchance (Simulation)',
    vsRandom: (n: number) => `gegen ${n} zufällige ${n === 1 ? 'Hand' : 'Hände'}`,
    activeOpponents: 'Aktive Gegner',
    currentHand: 'Aktuell:',
    outsWord: 'Outs',
    equityNote:
      'Hinweis: Gegen echte Einsätze halten Gegner meist bessere Hände als der Zufall – zieh gedanklich ein paar Prozentpunkte ab, wenn viel Action herrscht.',

    // „Jemand setzt“
    facingBetQuestion: 'Jemand setzt – lohnt sich der Call?',
    potPlaceholder: 'Pot (z. B. 10)',
    betPlaceholder: 'Einsatz (z. B. 5)',

    // Buttons
    playAnywayFlop: 'Ich spiele trotzdem – Flop eingeben →',
    toFlop: 'Weiter: Flop eingeben →',
    toTurn: 'Weiter: Turn →',
    toRiver: 'Weiter: River →',
    newHand: 'Neue Hand',
    changeSetup: 'Setup ändern',

    // Fortschritt
    stepNames: ['Hand', 'Preflop', 'Flop', 'Turn', 'River'],
    progressLine: 'Hand → Preflop → Flop → Turn → River',
  },
  {
    eyebrow: 'Your advisor at the table',
    title: 'Live Coach',
    sub: 'Enter your hand and get a clear recommendation street by street: bet, call, or get out – tailored to loose low-stakes games.',

    // Setup
    playersQuestion: 'How many players are at the table (including you)?',
    positionQuestion: 'Where are you sitting (relative to the dealer)?',
    beforeQuestion: 'What has happened in front of you?',
    noRaiseYet: 'No raise yet',
    someoneRaised: 'Someone has raised',
    limpersQuestion: 'How many players just limped in?',
    toHand: 'Next: enter your hand →',
    setupNote:
      'Note: Meant for home games and practice. Phone assistance at the table is not allowed in casinos and cardrooms – keep the app in your pocket there.',

    // Card entry
    holeLabel: 'Your two cards',
    yourHand: 'Your hand:',
    handShort: 'Hand:',
    boardShort: 'Board:',
    flopLabel: 'Flop – the first three board cards',
    turnCardLabel: 'Turn card',
    riverCardLabel: 'River card',

    // Streets
    streetPreflop: 'Preflop',
    streetFlop: 'Flop',
    streetTurn: 'Turn',
    streetRiver: 'River',

    // Recommendation box
    recommendation: 'Recommendation:',
    homegameTip: 'Home-game tip',

    // Equity card
    winChance: 'Win probability (simulation)',
    vsRandom: (n: number) => `against ${n} random ${n === 1 ? 'hand' : 'hands'}`,
    activeOpponents: 'Active opponents',
    currentHand: 'Current:',
    outsWord: 'outs',
    equityNote:
      'Note: Against real bets, opponents usually hold better hands than random – mentally shave off a few percentage points when there is a lot of action.',

    // "Someone bets"
    facingBetQuestion: 'Someone bets – is the call worth it?',
    potPlaceholder: 'Pot (e.g. 10)',
    betPlaceholder: 'Bet (e.g. 5)',

    // Buttons
    playAnywayFlop: "I'm playing anyway – enter the flop →",
    toFlop: 'Next: enter the flop →',
    toTurn: 'Next: Turn →',
    toRiver: 'Next: River →',
    newHand: 'New hand',
    changeSetup: 'Change setup',

    // Progress
    stepNames: ['Hand', 'Preflop', 'Flop', 'Turn', 'River'],
    progressLine: 'Hand → Preflop → Flop → Turn → River',
  },
);
