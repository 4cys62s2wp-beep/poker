import { defineStrings } from '..';
import type { BotStyle } from '../../lib/poker/ai';
import type { Street } from '../../lib/poker/engine';

/* Übungstisch-Texte. Interpolationen sind Funktionen; auch die Grammatik-
   Korrektur der Engine-Logzeilen gehört zum Wörterbuch, damit sie nur in der
   jeweils passenden Sprache läuft. */

/** Engine-Logzeilen sprechen in der 3. Person – für „Du“ die 2. Person herstellen. */
function fixDuGrammar(text: string): string {
  if (!text.startsWith('Du ')) return text;
  return text
    .replace(/^Du foldet\b/, 'Du foldest')
    .replace(/^Du callt\b/, 'Du callst')
    .replace(/^Du checkt\b/, 'Du checkst')
    .replace(/^Du erhöht\b/, 'Du erhöhst')
    .replace(/^Du gewinnt\b/, 'Du gewinnst')
    .replace(/^Du zeigt\b/, 'Du zeigst')
    .replace(/^Du erhält\b/, 'Du erhältst')
    .replace(/ und ist all-in/, ' und bist all-in');
}

/** Engine log lines speak in the 3rd person – restore the 2nd person for "You". */
function fixYouGrammar(text: string): string {
  if (!text.startsWith('You ')) return text;
  return text
    .replace(/^You folds\b/, 'You fold')
    .replace(/^You checks\b/, 'You check')
    .replace(/^You calls\b/, 'You call')
    .replace(/^You bets\b/, 'You bet')
    .replace(/^You raises\b/, 'You raise')
    .replace(/^You posts\b/, 'You post')
    .replace(/^You shows\b/, 'You show')
    .replace(/^You wins\b/, 'You win')
    .replace(/ and is all-in/, ' and are all-in');
}

export const STR = defineStrings(
  {
    // Spieler & Bots
    heroName: 'Du',
    botNames: [
      'Anna „die Steinwand“',
      'Bruno Bluff',
      'Carla Callstation',
      'David Solide',
      'Elena Eiskalt',
    ],
    styleLabel: {
      tight: 'tight',
      standard: 'solide',
      loose: 'loose',
      aggro: 'aggressiv',
    } as Record<BotStyle, string>,
    fixLogGrammar: fixDuGrammar,

    // Setup-Bildschirm
    eyebrow: 'Am Tisch, ohne Risiko',
    title: 'Übungstisch',
    intro:
      "Spiele No-Limit Hold'em gegen KI-Gegner mit unterschiedlichen Spielstilen – mit Spielgeld und ohne Risiko. Der Coach-Modus zeigt dir live Equity und Pot Odds, damit du ein Gefühl für gute Entscheidungen entwickelst.",
    chooseTable: 'Tisch wählen',
    headsUp: 'Heads-Up',
    threeHanded: '3-handed',
    sixMax: '6-max',
    opponents: (n: number) => `${n} Gegner`,
    coachMode: 'Coach-Modus',
    coachModeDesc: 'Zeigt dir Equity, Pot Odds und deine aktuelle Handstärke während du spielst.',
    blindsInfo: (sb: number, bb: number, stack: number, bbs: number) =>
      `Blinds ${sb}/${bb} · Start-Stack ${stack} Chips (${bbs} bb) · Nur Spielgeld`,
    recentHands: 'Deine letzten Hände',

    // Tisch
    tableTitle: '🃏 Übungstisch',
    handPill: (n: number) => `Hand #${n}`,
    streetLabel: {
      preflop: 'Preflop',
      flop: 'Flop',
      turn: 'Turn',
      river: 'River',
      showdown: 'Showdown',
    } as Record<Street, string>,
    leaveTable: 'Tisch verlassen',
    potLabel: 'Pot',
    chipsAmount: (n: number) => `${n} Chips`,
    foldedTag: 'Fold',
    winnerLine: (isHero: boolean, name: string, amount: number, handName?: string) =>
      `${isHero ? 'Du gewinnst' : `${name} gewinnt`} ${amount} Chips${handName ? ` mit ${handName}` : ''}`,
    nextHand: 'Nächste Hand →',

    // Coach-Panel
    coachPill: 'Coach',
    coachEquity: (n: number, pct: number) => `Equity vs. ${n} zufällige Hände: ~${pct} %`,
    coachPotOdds: (call: number, total: number, pct: number) =>
      `Pot Odds: ${call} in ${total} → brauchst ~${pct} %`,
    coachCurrent: (hand: string) => `Aktuell: ${hand}`,
    adviceCall:
      '✓ Deine geschätzte Equity liegt über den benötigten Pot Odds – ein Call ist rechnerisch profitabel.',
    adviceFold:
      '✗ Deine geschätzte Equity liegt unter den Pot Odds – ohne zusätzliche Gründe (Implied Odds, Fold Equity) ist Folden besser.',
    adviceClose: '≈ Knappe Entscheidung – hier entscheiden Reads, Position und Implied Odds.',
    adviceNote: 'Hinweis: Equity vs. Zufallshände überschätzt dich gegen echte Ranges.',

    // Aktions-Buttons
    fold: 'Fold',
    check: 'Check',
    call: (n: number) => `Call ${n}`,
    bet: 'Bet',
    raise: 'Raise',
    minRaise: (n: number) => `Min (${n})`,
    halfPot: '½ Pot',
    threeQuarterPot: '¾ Pot',
    fullPot: 'Pot',
    allIn: (n: number) => `All-in (${n})`,
    thinking: (name: string) => `${name} überlegt …`,

    // Verlauf & Historie
    historyTitle: 'Verlauf',
    resultLabel: {
      won: 'Gewonnen',
      lost: 'Verloren',
      folded: 'Gefoldet',
    } as Record<'won' | 'lost' | 'folded', string>,
    timeLocale: 'de-DE',
  },
  {
    // Players & bots
    heroName: 'You',
    botNames: [
      'Anna “the Stone Wall”',
      'Bruno Bluff',
      'Carla Callstation',
      'David Solid',
      'Elena Ice-Cold',
    ],
    styleLabel: {
      tight: 'tight',
      standard: 'solid',
      loose: 'loose',
      aggro: 'aggressive',
    } as Record<BotStyle, string>,
    fixLogGrammar: fixYouGrammar,

    // Setup screen
    eyebrow: 'At the table, risk-free',
    title: 'Practice Table',
    intro:
      "Play No-Limit Hold'em against AI opponents with different playing styles – with play money and no risk. Coach mode shows you live equity and pot odds so you develop a feel for good decisions.",
    chooseTable: 'Choose a table',
    headsUp: 'Heads-Up',
    threeHanded: '3-handed',
    sixMax: '6-max',
    opponents: (n: number) => (n === 1 ? '1 opponent' : `${n} opponents`),
    coachMode: 'Coach Mode',
    coachModeDesc: 'Shows you equity, pot odds and your current hand strength while you play.',
    blindsInfo: (sb: number, bb: number, stack: number, bbs: number) =>
      `Blinds ${sb}/${bb} · Starting stack ${stack} chips (${bbs} bb) · Play money only`,
    recentHands: 'Your recent hands',

    // Table
    tableTitle: '🃏 Practice Table',
    handPill: (n: number) => `Hand #${n}`,
    streetLabel: {
      preflop: 'Preflop',
      flop: 'Flop',
      turn: 'Turn',
      river: 'River',
      showdown: 'Showdown',
    } as Record<Street, string>,
    leaveTable: 'Leave table',
    potLabel: 'Pot',
    chipsAmount: (n: number) => `${n} chips`,
    foldedTag: 'Fold',
    winnerLine: (isHero: boolean, name: string, amount: number, handName?: string) =>
      `${isHero ? 'You win' : `${name} wins`} ${amount} chips${handName ? ` with ${handName}` : ''}`,
    nextHand: 'Next hand →',

    // Coach panel
    coachPill: 'Coach',
    coachEquity: (n: number, pct: number) =>
      `Equity vs. ${n} random ${n === 1 ? 'hand' : 'hands'}: ~${pct}%`,
    coachPotOdds: (call: number, total: number, pct: number) =>
      `Pot odds: ${call} into ${total} → you need ~${pct}%`,
    coachCurrent: (hand: string) => `Currently: ${hand}`,
    adviceCall:
      '✓ Your estimated equity is above the required pot odds – a call is mathematically profitable.',
    adviceFold:
      '✗ Your estimated equity is below the pot odds – without additional reasons (implied odds, fold equity) folding is better.',
    adviceClose: '≈ A close decision – reads, position and implied odds decide here.',
    adviceNote: 'Note: equity vs. random hands overestimates you against real ranges.',

    // Action buttons
    fold: 'Fold',
    check: 'Check',
    call: (n: number) => `Call ${n}`,
    bet: 'Bet',
    raise: 'Raise',
    minRaise: (n: number) => `Min (${n})`,
    halfPot: '½ Pot',
    threeQuarterPot: '¾ Pot',
    fullPot: 'Pot',
    allIn: (n: number) => `All-in (${n})`,
    thinking: (name: string) => `${name} is thinking …`,

    // Log & history
    historyTitle: 'History',
    resultLabel: {
      won: 'Won',
      lost: 'Lost',
      folded: 'Folded',
    } as Record<'won' | 'lost' | 'folded', string>,
    timeLocale: 'en-US',
  },
);
