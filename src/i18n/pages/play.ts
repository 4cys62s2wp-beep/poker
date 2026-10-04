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
    fixLogGrammar: fixDuGrammar,

    // Setup-Bildschirm
    title: 'Übungstisch',
    intro:
      'Spiele No-Limit Hold’em gegen Computergegner mit unterschiedlichen Spielstilen – mit Spielgeld und ohne Risiko. Der Coach bewertet jede deiner Entscheidungen, nachdem du sie getroffen hast.',
    chooseTable: 'Gegner am Tisch',
    headsUp: 'Heads-Up',
    threeHanded: '3-handed',
    sixMax: '6-max',
    opponents: (n: number) => `${n} Gegner`,
    startHand: 'Hand austeilen',
    coachMode: 'Coach',
    coachModeDesc:
      'Bewertet jede deiner Entscheidungen, nachdem du sie getroffen hast – als Schätzung nach Faustregeln, nicht als Lösung.',
    tippMode: 'Tipp vor jeder Entscheidung',
    tippModeDesc: 'Zeigt den Rat schon vor deinem Zug. Ohne den Schalter bekommst du ihn nur auf Wunsch.',
    switchOn: 'An',
    switchOff: 'Aus',
    blindsInfo: (sb: string, bb: string, stack: string) =>
      `Blinds ${sb} / ${bb} BB · Start-Stack ${stack} BB · Alle Beträge in Big Blinds · Nur Spielgeld`,
    recentHands: 'Deine letzten Hände',
    bilanzTitel: 'Deine letzte Runde',
    bilanzHaende: (n: number) => `${n} ${n === 1 ? 'Hand' : 'Hände'} gespielt`,
    bilanzEntscheidungen: (n: number, gut: number, ok: number, fehler: number) =>
      n === 0
        ? 'Der Coach war aus – es gibt keine Bewertung.'
        : `${n} ${n === 1 ? 'Entscheidung' : 'Entscheidungen'} bewertet: ${gut} gut, ${ok} vertretbar, ${fehler} ${fehler === 1 ? 'Fehler' : 'Fehler'}.`,
    bilanzFehlerHinweis: 'Fehler sind die Stellen, an denen du am meisten lernst. Dein Spielstil zeigt, wo sie sich häufen.',
    bilanzStil: 'Spielstil ansehen',

    // Tisch
    tableTitle: 'Übungstisch',
    handPill: (n: number) => `Hand #${n}`,
    streetLabel: {
      preflop: 'Preflop',
      flop: 'Flop',
      turn: 'Turn',
      river: 'River',
      showdown: 'Showdown',
    } as Record<Street, string>,
    leaveTable: 'Tisch verlassen',
    potBB: (n: string) => `Pot ${n} BB`,
    /* ── Der Tisch als Spielansicht (E-040) ─────────────────────────── */
    duLabel: 'Du',
    amZug: 'Du bist dran',
    ueberlegt: (name: string) => `${name} überlegt …`,
    boardOffen: 'Noch nicht aufgedeckt',
    einsatzVon: (n: string) => `Einsatz ${n} Big Blinds`,
    dealerKurz: 'D',
    dealerLang: 'Dealer-Button',
    stapelVon: (name: string, n: string) => `${name}: ${n} Big Blinds`,
    foldedTag: 'Fold',
    /* Die Marke am Sitz: was jemand in dieser Runde getan hat. */
    marke: {
      check: 'Check',
      call: (n: string) => `Call ${n}`,
      bet: (n: string) => `Bet ${n}`,
      raise: (n: string) => `Raise ${n}`,
      allin: 'All-in',
    },
    /* Die Kurzzeile unter dem Board: was zuletzt passiert ist. */
    satz: {
      fold: (name: string) => `${name} foldet`,
      check: (name: string) => `${name} checkt`,
      call: (name: string, n: string) => `${name} callt ${n}`,
      bet: (name: string, n: string) => `${name} setzt ${n}`,
      raise: (name: string, n: string) => `${name} raist auf ${n}`,
    },
    winnerLine: (isHero: boolean, name: string, amount: string, handName?: string) =>
      `${isHero ? 'Du gewinnst' : `${name} gewinnt`} ${amount}${handName ? ` mit ${handName}` : ''}`,
    verglichen: (name: string, text: string) => `${name}: ${text}`,
    geteiltLine: (amount: string, text: string) => `Geteilter Pot: ${amount} mit ${text}`,
    kickerWort: 'Kicker',
    nextHand: 'Nächste Hand',
    playOut: 'Hand zu Ende spielen',
    duFolded: 'Du hast gefoldet',

    // Coach
    coachPill: 'Coach',
    tippZeigen: 'Tipp',
    tippZeile: (aktion: string, extra?: string) => `Tipp: ${aktion}${extra ? ` · ${extra}` : ''}`,
    tippOdds: (equity: number, benoetigt: number, ok: boolean) =>
      `Equity ${equity} % · nötig ${benoetigt} % · ${ok ? 'reicht' : 'reicht nicht'}`,
    warum: 'Warum?',
    aktionWort: { fold: 'Fold', check: 'Check', call: 'Call', raise: 'Raise', bet: 'Bet' },
    urteil: { gut: 'Gut', vertretbar: 'Vertretbar', fehler: 'Fehler' },
    urteilKurz: (aktion: string, urteil: string) => `${aktion}: ${urteil}`,
    warumRat: (aktion: string) => `Der Rat war: ${aktion}`,
    warumDeine: (aktion: string, urteil: string) => `Dein ${aktion}: ${urteil}`,
    warumSchaetzung:
      'Eine Schätzung nach Faustregeln, keine Lösung. Die Equity gilt gegen zufällige Hände und überschätzt dich gegen echte Ranges.',
    warumOdds: (equity: number, benoetigt: number) =>
      `Deine Equity liegt bei etwa ${equity} %, der Preis verlangt ${benoetigt} %.`,
    warumPlatz: (pos: string) => `Dein Platz: ${pos}`,
    schliessen: 'Schließen',
    rueckblickTitel: 'Deine Entscheidungen in dieser Hand',
    rueckblickZeile: (street: string, aktion: string) => `${street}: ${aktion}`,

    // Aktions-Knöpfe
    fold: 'Fold',
    check: 'Check',
    call: (n: string) => `Call ${n}`,
    bet: 'Bet',
    raise: 'Raise',
    raiseOeffnen: (art: string) => `${art} …`,
    raiseAuf: (isBet: boolean, n: string) => (isBet ? `Bet ${n}` : `Raise auf ${n}`),
    betragWeniger: 'Weniger',
    betragMehr: 'Mehr',
    betragZurueck: 'Zurück',
    vorgabeMin: 'Min',
    vorgabePot: (teil: number) =>
      teil === 1 ? 'Pot' : teil === 0.75 ? '¾ Pot' : teil === 0.5 ? '½ Pot' : '⅓ Pot',
    vorgabeMal: (f: number) => `${String(f).replace('.', ',')}×`,
    vorgabeAllIn: 'All-in',
    vorgabeGruppe: 'Einsatzgröße',

    // Verlauf & Historie
    historyTitle: 'Verlauf',
    resultLabel: {
      won: 'Gewonnen',
      lost: 'Verloren',
      folded: 'Gefoldet',
    } as Record<'won' | 'lost' | 'folded', string>,
    timeLocale: 'de-DE',
    alleAnzeigen: (n: number) => `Alle ${n} anzeigen`,
    weniger: 'Weniger anzeigen',
    handAuf: 'Verlauf der Hand öffnen',
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
    fixLogGrammar: fixYouGrammar,

    // Setup screen
    title: 'Practice Table',
    intro:
      'Play No-Limit Hold’em against AI opponents with different playing styles – with play money and no risk. The coach rates each of your decisions after you have made it.',
    chooseTable: 'Opponents at the table',
    headsUp: 'Heads-Up',
    threeHanded: '3-handed',
    sixMax: '6-max',
    opponents: (n: number) => (n === 1 ? '1 opponent' : `${n} opponents`),
    startHand: 'Deal a hand',
    coachMode: 'Coach',
    coachModeDesc:
      'Rates each of your decisions after you have made it – an estimate by rules of thumb, not a solution.',
    tippMode: 'Tip before every decision',
    tippModeDesc: 'Shows the advice before you act. Without the switch you only get it on request.',
    switchOn: 'On',
    switchOff: 'Off',
    blindsInfo: (sb: string, bb: string, stack: string) =>
      `Blinds ${sb} / ${bb} BB · Starting stack ${stack} BB · All amounts in big blinds · Play money only`,
    recentHands: 'Your recent hands',
    bilanzTitel: 'Your last session',
    bilanzHaende: (n: number) => `${n} ${n === 1 ? 'hand' : 'hands'} played`,
    bilanzEntscheidungen: (n: number, gut: number, ok: number, fehler: number) =>
      n === 0
        ? 'The coach was off – there is no rating.'
        : `${n} ${n === 1 ? 'decision' : 'decisions'} rated: ${gut} good, ${ok} acceptable, ${fehler} ${fehler === 1 ? 'mistake' : 'mistakes'}.`,
    bilanzFehlerHinweis: 'Mistakes are where you learn the most. Your play style shows where they pile up.',
    bilanzStil: 'See your play style',

    // Table
    tableTitle: 'Practice Table',
    handPill: (n: number) => `Hand #${n}`,
    streetLabel: {
      preflop: 'Preflop',
      flop: 'Flop',
      turn: 'Turn',
      river: 'River',
      showdown: 'Showdown',
    } as Record<Street, string>,
    leaveTable: 'Leave table',
    potBB: (n: string) => `Pot ${n} BB`,
    /* ── The table as a game view (E-040) ───────────────────────────── */
    duLabel: 'You',
    amZug: 'Your turn',
    ueberlegt: (name: string) => `${name} is thinking …`,
    boardOffen: 'Not dealt yet',
    einsatzVon: (n: string) => `Bet ${n} big blinds`,
    dealerKurz: 'D',
    dealerLang: 'Dealer button',
    stapelVon: (name: string, n: string) => `${name}: ${n} big blinds`,
    foldedTag: 'Fold',
    marke: {
      check: 'Check',
      call: (n: string) => `Call ${n}`,
      bet: (n: string) => `Bet ${n}`,
      raise: (n: string) => `Raise ${n}`,
      allin: 'All-in',
    },
    satz: {
      fold: (name: string) => `${name} folds`,
      check: (name: string) => `${name} checks`,
      call: (name: string, n: string) => `${name} calls ${n}`,
      bet: (name: string, n: string) => `${name} bets ${n}`,
      raise: (name: string, n: string) => `${name} raises to ${n}`,
    },
    winnerLine: (isHero: boolean, name: string, amount: string, handName?: string) =>
      `${isHero ? 'You win' : `${name} wins`} ${amount}${handName ? ` with ${handName}` : ''}`,
    verglichen: (name: string, text: string) => `${name}: ${text}`,
    geteiltLine: (amount: string, text: string) => `Split pot: ${amount} with ${text}`,
    kickerWort: 'kicker',
    nextHand: 'Next hand',
    playOut: 'Play out the hand',
    duFolded: 'You folded',

    // Coach
    coachPill: 'Coach',
    tippZeigen: 'Tip',
    tippZeile: (aktion: string, extra?: string) => `Tip: ${aktion}${extra ? ` · ${extra}` : ''}`,
    tippOdds: (equity: number, benoetigt: number, ok: boolean) =>
      `Equity ${equity}% · needed ${benoetigt}% · ${ok ? 'enough' : 'not enough'}`,
    warum: 'Why?',
    aktionWort: { fold: 'Fold', check: 'Check', call: 'Call', raise: 'Raise', bet: 'Bet' },
    urteil: { gut: 'Good', vertretbar: 'Acceptable', fehler: 'Mistake' },
    urteilKurz: (aktion: string, urteil: string) => `${aktion}: ${urteil}`,
    warumRat: (aktion: string) => `The advice was: ${aktion}`,
    warumDeine: (aktion: string, urteil: string) => `Your ${aktion}: ${urteil}`,
    warumSchaetzung:
      'An estimate by rules of thumb, not a solution. Equity is measured against random hands and overestimates you against real ranges.',
    warumOdds: (equity: number, benoetigt: number) =>
      `Your equity is about ${equity}%, the price asks for ${benoetigt}%.`,
    warumPlatz: (pos: string) => `Your seat: ${pos}`,
    schliessen: 'Close',
    rueckblickTitel: 'Your decisions in this hand',
    rueckblickZeile: (street: string, aktion: string) => `${street}: ${aktion}`,

    // Action buttons
    fold: 'Fold',
    check: 'Check',
    call: (n: string) => `Call ${n}`,
    bet: 'Bet',
    raise: 'Raise',
    raiseOeffnen: (art: string) => `${art} …`,
    raiseAuf: (isBet: boolean, n: string) => (isBet ? `Bet ${n}` : `Raise to ${n}`),
    betragWeniger: 'Less',
    betragMehr: 'More',
    betragZurueck: 'Back',
    vorgabeMin: 'Min',
    vorgabePot: (teil: number) =>
      teil === 1 ? 'Pot' : teil === 0.75 ? '¾ Pot' : teil === 0.5 ? '½ Pot' : '⅓ Pot',
    vorgabeMal: (f: number) => `${f}×`,
    vorgabeAllIn: 'All-in',
    vorgabeGruppe: 'Bet size',

    // Log & history
    historyTitle: 'History',
    resultLabel: {
      won: 'Won',
      lost: 'Lost',
      folded: 'Folded',
    } as Record<'won' | 'lost' | 'folded', string>,
    timeLocale: 'en-US',
    alleAnzeigen: (n: number) => `Show all ${n}`,
    weniger: 'Show fewer',
    handAuf: 'Open the hand history',
  },
);
