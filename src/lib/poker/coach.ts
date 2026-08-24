// Empfehlungslogik für den Live-Coach (Fokus: lockere Low-Stakes-Runden).
// Grundprinzip: value-lastig spielen, wenig bluffen, Preise ausrechnen.

import { expandRangeSpec } from './ranges';
import { RFI_CHARTS, BB_DEFENSE_VS_BTN } from '../../content/ranges';
import type { DrawInfo, MadeHandInfo } from './analysis';
import { pairTypeName } from './analysis';

/** Sprache der erzeugten Texte (Logik/Zahlen sind sprachneutral). */
export type CoachLang = 'de' | 'en';

export type CoachAction = 'raise' | 'bet' | 'call' | 'check' | 'fold' | 'checkcall' | 'checkfold';

export interface CoachAdvice {
  action: CoachAction;
  /** Kurz und handlungsleitend, z. B. „Raise auf 4 bb“. */
  headline: string;
  reasons: string[];
  /** Extra-Hinweis für lockere Homegame-Runden. */
  lowStakes?: string;
}

export const ACTION_STYLE: Record<CoachAction, { cls: string; icon: string }> = {
  raise: { cls: 'v-raise', icon: '▲' },
  bet: { cls: 'v-raise', icon: '▲' },
  call: { cls: 'v-call', icon: '●' },
  check: { cls: 'v-check', icon: '○' },
  checkcall: { cls: 'v-check', icon: '◐' },
  checkfold: { cls: 'v-fold', icon: '◇' },
  fold: { cls: 'v-fold', icon: '✕' },
};

export const ACTION_LABEL: Record<CoachAction, string> = {
  raise: 'Raise',
  bet: 'Bet',
  call: 'Call',
  check: 'Check',
  checkcall: 'Check / Call',
  checkfold: 'Check / Fold',
  fold: 'Fold',
};

// ---------- Texte (pro Sprache) ----------

const TEXT_DE = {
  // Preflop: eigene Eröffnung
  rfiHeadline: (size: string) => `Raise auf ${size}`,
  rfiInRange: (label: string) => `${label} gehört aus dieser Position in deine Eröffnungs-Range.`,
  rfiLimpers: (limpers: number) =>
    `Es ${limpers === 1 ? 'limpt bereits 1 Spieler' : `limpen bereits ${limpers} Spieler`}: erhöhe größer (Basis + 1 bb pro Limper), damit nicht alle billig mitgehen.`,
  rfiNoLimp: 'Erhöhen statt limpen: Du baust den Pot mit der besseren Hand auf und kannst schon vor dem Flop gewinnen.',
  rfiFullTable: 'Voller Tisch: bleib trotzdem diszipliniert – lieber eine Hand weniger spielen.',
  rfiFixedSize: 'Bleib bei einer festen Raise-Größe, egal welche Hand du hast – so bist du nicht lesbar.',
  rfiLowStakes:
    'In lockeren Runden wird viel gecallt: Wähle eher 4 bb als 3 bb – deine starken Hände werden trotzdem bezahlt.',

  // Preflop: Blinds ohne spielbare Hand
  bbCheckHeadline: 'Im Big Blind: Check · sonst Fold',
  bbTooWeak: (label: string) => `${label} ist zu schwach, um aus den Blinds selbst anzugreifen.`,
  bbFreeFlop: 'Im Big Blind ohne Raise davor: kostenlos den Flop ansehen (Check).',
  sbNotWorth: 'Im Small Blind: die halbe Blind-Ersparnis ist es nicht wert, out of position zu spielen.',

  // Preflop: Fold ohne Raise davor
  foldHeadline: 'Fold',
  openFoldLoser: (label: string) => `${label} ist aus dieser Position langfristig ein Verlustgeschäft.`,
  openFoldPatience: 'Geduld zahlt sich aus: Die Gewinne kommen aus den Händen, die du NICHT spielst.',
  openFoldManyPlayers: 'Je mehr Spieler am Tisch, desto wahrscheinlicher hält jemand etwas Besseres.',
  openFoldWait: 'Warte auf eine Hand aus deiner Range – die nächste kommt bestimmt.',
  openFoldLowStakes:
    'Auch wenn alle mitspielen: Wer jede Hand spielt, verliert am Ende des Abends. Fold ist dein Freund.',

  // Preflop: gegen einen Raise
  premiumHeadline: 'Re-Raise (3-Bet) auf ca. 3x den Raise',
  premiumHand: (label: string) => `${label} ist eine Premium-Hand – die stärksten ~2,5 % aller Starthände.`,
  premiumSize: 'Erhöhe auf etwa das Dreifache des ursprünglichen Raises (out of position eher 4x).',
  premiumGoal: 'Ziel: den Pot groß machen, solange du sehr wahrscheinlich vorne liegst.',
  premiumLowStakes: 'Freizeitspieler folden selten auf 3-Bets – umso besser: Du bekommst Value, keine Bluff-Show.',

  callHeadline: 'Call',
  strongCall: (label: string) =>
    `${label} ist stark, aber gegen einen Raise nicht klar vorne – mitgehen und den Flop ansehen.`,
  strongCaution: 'Vorsicht bei viel Action nach dir (Re-Raises): dann lieber aussteigen.',
  strongPostflop: 'Postflop gilt: Top Pair mit gutem Kicker ist meist gut, aber kein Selbstläufer.',

  setmineHeadline: 'Call – aber nur, wenn der Raise klein ist',
  setmineHit: (label: string) =>
    `Mit dem Paar ${label} spielst du auf ein Set (Drilling): Das triffst du am Flop in ca. 12 % der Fälle.`,
  setmineRule: 'Faustregel: Call nur, wenn du und der Gegner noch mindestens das 15-Fache des Raises im Stack habt.',
  setmineMiss: 'Triffst du kein Set und es gibt Action: fast immer folden.',
  setmineLowStakes: 'Set-Mining ist DIE Geldmaschine in lockeren Runden – Sets werden von Top Pair fast immer bezahlt.',

  bbDefHeadline: 'Im Big Blind: Call möglich',
  bbDefDiscount: 'Im Big Blind hast du schon Geld im Pot und bekommst einen Rabatt auf den Call.',
  bbDefGoodEnough: (label: string) =>
    `${label} ist gut genug, um den Flop anzusehen – danach ehrlich bleiben: Nur mit Treffer oder gutem Draw weitermachen.`,

  suitedFoldHeadline: 'Fold (knapp)',
  suitedPretty: (label: string) =>
    `${label} sieht hübsch aus, spielt sich gegen einen Raise aber schlecht – vor allem out of position.`,
  suitedCheap: 'Solche Hände willst du billig und in Position spielen, nicht gegen Stärke bezahlen.',

  vsRaiseWeak: (label: string) => `Gegen einen Raise ist ${label} klar zu schwach.`,
  vsRaiseRule: 'Merksatz: Gegen eine Erhöhung brauchst du eine deutlich stärkere Hand als zum selbst Erhöhen.',

  // Postflop: sehr starke Hände
  monsterHeadline: 'Bet 70–100 % des Pots (Value)',
  monsterHolding: (name: string, eqPct: number) =>
    `Du hältst ${name} – fast sicher die beste Hand (~${eqPct} % Equity).`,
  monsterBigBets: 'Große Bets, keine Tricks: Der Pot soll wachsen, solange jemand bezahlt.',
  monsterRiver: 'Am River: setz einen Betrag, den eine schlechtere Hand gerade noch callt.',
  monsterKeepBetting: 'Auch Turn und River weiter setzen (drei „Streets of Value“).',
  monsterLowStakes: 'Slowplay ist in lockeren Runden meist ein Fehler – es wird sowieso gecallt. Setz einfach.',

  tripsHeadline: 'Bet 60–75 % des Pots (Value)',
  tripsAhead: (name: string, eqPct: number) => `${name} ist fast immer vorne (~${eqPct} % Equity).`,
  tripsBetEveryStreet: 'Setz auf jeder Street – Drillinge werden von Top Pair und Draws gut bezahlt.',
  tripsSlowDown: 'Nur bremsen, wenn Board-Karten Flush oder Straße vervollständigen UND ein enger Spieler plötzlich raist.',

  twoPairHeadlineBoard: 'Bet klein (40–50 % Pot) oder Check',
  twoPairHeadline: 'Bet 55–70 % des Pots (Value)',
  twoPairValue: (eqPct: number) => `Zwei Paare (~${eqPct} % Equity): eine klare Value-Hand.`,
  twoPairBoardPair: 'Achtung: Ein Paar liegt auf dem Board – dein „zwei Paar“ ist schwächer, als es klingt.',
  twoPairBetNow: 'Setz jetzt: Auf späteren Karten können Flushs/Straßen ankommen, die dich einholen.',
  twoPairMultiway:
    'Gegen mehrere Gegner: eher größere Bets, weniger Bluff-Gefahr im Kopf behalten – Raises sind dort meist echt.',
  twoPairHeadsUp: 'Gegen große Raises trotzdem kurz durchatmen: Zwei Paare sind stark, aber nicht unbesiegbar.',

  // Postflop: ein Paar
  tpHeadlineRiverHU: 'Value-Bet 40–60 % des Pots',
  tpHeadlineRiverMulti: 'Eher Check (mehrere Gegner)',
  tpHeadline: 'Bet 50–65 % des Pots',
  topPairGoodKicker: 'Top Pair mit gutem Kicker',
  tpUsuallyBest: (name: string, eqPct: number) => `${name} (~${eqPct} % Equity) – meist die beste Hand.`,
  tpRiverModerate: 'Am River zahlt dich ein schlechteres Top Pair oder ein Ass-Hoch noch aus – halte die Bet moderat.',
  tpBetForValue: 'Setz für Value und um Draws einen schlechten Preis zu geben.',
  tpMultiwayFold: 'Mehrere Gegner: Wird groß geraist, ist ein Paar oft geschlagen – dann diszipliniert folden.',
  tpRaisedCaution: 'Wirst du geraist, ist Vorsicht angesagt: Freizeitspieler raisen selten als Bluff.',
  tpLowStakes:
    'Die meisten Homegame-Gewinne kommen genau hieraus: Top Pair konsequent value-betten, weil zu viel gecallt wird.',

  mpHeadline: 'Check · kleine Bets callen',
  topPairWeakKicker: 'Top Pair mit schwachem Kicker',
  mpGoodEnough: (name: string, eqPct: number) =>
    `${name} (~${eqPct} % Equity): gut genug zum Mitgehen, zu dünn für große Pötte.`,
  mpCallSmall: 'Kleine und mittlere Bets callen, bei großen Bets oder Raises loslassen.',
  mpDontInflate: 'Nicht selbst aufblasen: Du gewinnst kleine Pötte, keine großen.',

  weakPairHeadlineMulti: 'Check / Fold',
  weakPairHeadlineHU: 'Check · höchstens Mini-Bets callen',
  weakPairName: 'Ein schwaches Paar',
  weakPairRarely: (name: string, eqPct: number) => `${name} (~${eqPct} % Equity) gewinnt selten große Pötte.`,
  weakPairMultiway: 'Gegen mehrere Gegner ist ein schwaches Paar fast nie gut genug – spar dir die Chips.',
  weakPairHeadsUp: 'Heads-up darfst du eine kleine Bet callen – mehr nicht.',

  // Postflop: Draws & Luft
  monsterDrawHeadline: 'Semi-Bluff: Bet 50–75 % des Pots (oder Raise)',
  monsterDrawDesc: (outs: number, eqPct: number, parts: string) =>
    `Monster-Draw mit ca. ${outs} Outs (~${eqPct} % Equity): ${parts}.`,
  monsterDrawTwoWays: 'Du gewinnst auf zwei Arten: Alle folden – oder du triffst einen der vielen Outs.',
  monsterDrawAllIn: 'Auch ein All-in ist mit so einem Draw selten ein großer Fehler.',

  strongDrawHeadline: 'Check / Call mit gutem Preis',
  strongDrawDesc: (parts: string, outs: number, eqPct: number, isFlop: boolean) =>
    `Starker Draw: ${parts} (${outs} Outs ≈ ${eqPct} % bis ${isFlop ? 'River' : 'zur nächsten Karte'}).`,
  strongDrawRule:
    'Faustregel: Bets bis etwa ⅔ Pot darfst du callen; wird es teurer, brauchst du zusätzliche Gewinnchancen (z. B. versteckte Paare).',
  strongDrawPosition: 'In Position darfst du auch mal selbst setzen (Semi-Bluff) – gegen viele Caller lieber nur callen.',
  strongDrawLowStakes: 'Draws sind in lockeren Runden Gold wert: Triffst du, wirst du bezahlt (gute Implied Odds).',

  weakDrawHeadline: 'Check · nur Mini-Bets callen',
  weakDrawDesc: (outs: number, eqPct: number, parts: string) =>
    `Schwacher Draw (${outs} Outs, ~${eqPct} % Equity): ${parts}.`,
  weakDrawPrice: 'Nur sehr kleine Bets (bis ca. ¼ Pot) bezahlen – sonst ist der Preis zu schlecht.',

  airHeadline: 'Check / Fold',
  airNothing: (eqPct: number) =>
    `Keine gemachte Hand, kein echter Draw (~${eqPct} % Equity): Hier gibt es nichts zu gewinnen.`,
  airRiverBluff: 'Am River ohne Showdown-Wert bleibt nur der Bluff – und der funktioniert gegen viele Caller schlecht.',
  airGiveUp: 'Gib die Hand ohne Reue auf – die nächste kommt in 30 Sekunden.',
  airLowStakes:
    'Der Klassiker im Homegame: „Einer callt immer.“ Genau deshalb: nicht bluffen, sondern auf die nächste echte Hand warten.',

  // „Jemand setzt“
  facingOk: (requiredPct: number, equityPct: number) =>
    `Call ist rechnerisch in Ordnung: Du brauchst ${requiredPct} % Equity und hast ca. ${equityPct} %.`,
  facingFold: (requiredPct: number, equityPct: number) =>
    `Rechnerisch ein Fold: Du brauchst ${requiredPct} % Equity, hast aber nur ca. ${equityPct} %. Call nur mit gutem Grund (z. B. hohe Implied Odds).`,
};

const TEXT_EN: typeof TEXT_DE = {
  // Preflop: opening yourself
  rfiHeadline: (size: string) => `Raise to ${size}`,
  rfiInRange: (label: string) => `${label} is in your opening range from this position.`,
  rfiLimpers: (limpers: number) =>
    `There ${limpers === 1 ? 'is already 1 limper' : `are already ${limpers} limpers`}: raise bigger (base + 1 bb per limper) so nobody gets to see the flop cheaply.`,
  rfiNoLimp: 'Raise instead of limping: you build the pot with the better hand and can take it down before the flop.',
  rfiFullTable: 'Full table: stay disciplined anyway – better to play one hand too few.',
  rfiFixedSize: 'Stick to one fixed raise size no matter what you hold – it keeps you unreadable.',
  rfiLowStakes:
    'Loose games call a lot: go with 4 bb rather than 3 bb – your strong hands still get paid.',

  // Preflop: blinds without a playable hand
  bbCheckHeadline: 'In the big blind: Check · otherwise Fold',
  bbTooWeak: (label: string) => `${label} is too weak to attack from the blinds yourself.`,
  bbFreeFlop: 'In the big blind with no raise in front: see the flop for free (check).',
  sbNotWorth: 'In the small blind: the half-blind discount is not worth playing out of position for.',

  // Preflop: folding with no raise in front
  foldHeadline: 'Fold',
  openFoldLoser: (label: string) => `${label} is a long-term loser from this position.`,
  openFoldPatience: "Patience pays: the profit comes from the hands you DON'T play.",
  openFoldManyPlayers: 'The more players at the table, the more likely someone holds something better.',
  openFoldWait: 'Wait for a hand from your range – the next one is never far away.',
  openFoldLowStakes:
    'Even if everyone limps along: play every hand and you go home a loser. Fold is your friend.',

  // Preflop: facing a raise
  premiumHeadline: 'Re-raise (3-bet) to about 3x the raise',
  premiumHand: (label: string) => `${label} is a premium hand – the strongest ~2.5% of all starting hands.`,
  premiumSize: 'Raise to about three times the original raise (closer to 4x when out of position).',
  premiumGoal: 'Goal: build a big pot while you are very likely ahead.',
  premiumLowStakes: 'Recreational players rarely fold to 3-bets – all the better: you get paid for value, no bluffing required.',

  callHeadline: 'Call',
  strongCall: (label: string) =>
    `${label} is strong, but not clearly ahead against a raise – call and see the flop.`,
  strongCaution: 'Careful if there is heavy action behind you (re-raises): better to let it go.',
  strongPostflop: 'Postflop rule: top pair with a good kicker is usually good, but no automatic winner.',

  setmineHeadline: 'Call – but only if the raise is small',
  setmineHit: (label: string) =>
    `With pocket ${label} you are playing for a set (three of a kind): you flop one about 12% of the time.`,
  setmineRule: 'Rule of thumb: call only if both you and your opponent have at least 15 times the raise left in your stacks.',
  setmineMiss: 'If you miss your set and face action: fold almost every time.',
  setmineLowStakes: 'Set-mining is THE money-maker in loose games – sets almost always get paid off by top pair.',

  bbDefHeadline: 'In the big blind: calling is fine',
  bbDefDiscount: 'In the big blind you already have money in the pot, so you get a discount on the call.',
  bbDefGoodEnough: (label: string) =>
    `${label} is good enough to see the flop – then stay honest: continue only with a real piece of the board or a good draw.`,

  suitedFoldHeadline: 'Fold (close)',
  suitedPretty: (label: string) =>
    `${label} looks pretty but plays poorly against a raise – especially out of position.`,
  suitedCheap: 'You want to play hands like this cheaply and in position, not pay off strength.',

  vsRaiseWeak: (label: string) => `Against a raise, ${label} is clearly too weak.`,
  vsRaiseRule: 'Remember: you need a much stronger hand to face a raise than to make one yourself.',

  // Postflop: very strong hands
  monsterHeadline: 'Bet 70–100% of the pot (value)',
  monsterHolding: (name: string, eqPct: number) =>
    `You hold ${name} – almost certainly the best hand (~${eqPct}% equity).`,
  monsterBigBets: 'Big bets, no tricks: grow the pot while somebody is willing to pay.',
  monsterRiver: 'On the river: bet an amount a worse hand can still call.',
  monsterKeepBetting: 'Keep betting the turn and river too (three streets of value).',
  monsterLowStakes: 'Slowplaying is usually a mistake in loose games – you get called anyway. Just bet.',

  tripsHeadline: 'Bet 60–75% of the pot (value)',
  tripsAhead: (name: string, eqPct: number) => `${name} is almost always ahead (~${eqPct}% equity).`,
  tripsBetEveryStreet: 'Bet every street – trips get paid off nicely by top pair and draws.',
  tripsSlowDown: 'Slow down only if the board completes a flush or straight AND a tight player suddenly raises.',

  twoPairHeadlineBoard: 'Bet small (40–50% pot) or check',
  twoPairHeadline: 'Bet 55–70% of the pot (value)',
  twoPairValue: (eqPct: number) => `Two pair (~${eqPct}% equity): a clear value hand.`,
  twoPairBoardPair: 'Careful: there is a pair on the board – your “two pair” is weaker than it sounds.',
  twoPairBetNow: 'Bet now: later cards can bring in flushes or straights that overtake you.',
  twoPairMultiway:
    'Against several opponents: lean towards bigger bets and remember bluffs are rare – raises there are usually the real thing.',
  twoPairHeadsUp: 'Still take a breath when facing big raises: two pair is strong, but not unbeatable.',

  // Postflop: one pair
  tpHeadlineRiverHU: 'Value bet 40–60% of the pot',
  tpHeadlineRiverMulti: 'Lean towards checking (several opponents)',
  tpHeadline: 'Bet 50–65% of the pot',
  topPairGoodKicker: 'Top Pair with a good kicker',
  tpUsuallyBest: (name: string, eqPct: number) => `${name} (~${eqPct}% equity) – usually the best hand.`,
  tpRiverModerate: 'On the river a worse top pair or ace-high can still pay you off – keep the bet moderate.',
  tpBetForValue: 'Bet for value and to give draws a bad price.',
  tpMultiwayFold: 'Several opponents: if someone raises big, one pair is often beaten – then fold with discipline.',
  tpRaisedCaution: 'If you get raised, be careful: recreational players rarely raise as a bluff.',
  tpLowStakes:
    'Most home-game profit comes from exactly this: value-betting top pair relentlessly, because people call too much.',

  mpHeadline: 'Check · call small bets',
  topPairWeakKicker: 'Top Pair with a weak kicker',
  mpGoodEnough: (name: string, eqPct: number) =>
    `${name} (~${eqPct}% equity): good enough to call, too thin for big pots.`,
  mpCallSmall: 'Call small and medium bets; let go against big bets or raises.',
  mpDontInflate: "Don't inflate the pot yourself: you win small pots with this, not big ones.",

  weakPairHeadlineMulti: 'Check / Fold',
  weakPairHeadlineHU: 'Check · call tiny bets at most',
  weakPairName: 'A weak pair',
  weakPairRarely: (name: string, eqPct: number) => `${name} (~${eqPct}% equity) rarely wins a big pot.`,
  weakPairMultiway: 'Against several opponents a weak pair is almost never good enough – save your chips.',
  weakPairHeadsUp: 'Heads-up you may call one small bet – nothing more.',

  // Postflop: draws & air
  monsterDrawHeadline: 'Semi-bluff: bet 50–75% of the pot (or raise)',
  monsterDrawDesc: (outs: number, eqPct: number, parts: string) =>
    `Monster draw with about ${outs} outs (~${eqPct}% equity): ${parts}.`,
  monsterDrawTwoWays: 'You win two ways: everyone folds – or you hit one of your many outs.',
  monsterDrawAllIn: 'Even getting it all in with a draw this big is rarely a serious mistake.',

  strongDrawHeadline: 'Check / call at a good price',
  strongDrawDesc: (parts: string, outs: number, eqPct: number, isFlop: boolean) =>
    `Strong draw: ${parts} (${outs} outs ≈ ${eqPct}% by the ${isFlop ? 'river' : 'next card'}).`,
  strongDrawRule:
    'Rule of thumb: you can call bets up to about ⅔ pot; if it gets more expensive, you need extra ways to win (e.g. hidden pairs).',
  strongDrawPosition: 'In position you can also bet yourself (semi-bluff) – against many callers, just call.',
  strongDrawLowStakes: 'Draws are gold in loose games: when you hit, you get paid (great implied odds).',

  weakDrawHeadline: 'Check · call only tiny bets',
  weakDrawDesc: (outs: number, eqPct: number, parts: string) =>
    `Weak draw (${outs} outs, ~${eqPct}% equity): ${parts}.`,
  weakDrawPrice: 'Pay off only very small bets (up to about ¼ pot) – anything more and the price is too bad.',

  airHeadline: 'Check / Fold',
  airNothing: (eqPct: number) =>
    `No made hand, no real draw (~${eqPct}% equity): there is nothing to win here.`,
  airRiverBluff: 'On the river without showdown value, bluffing is all that is left – and it works poorly against many callers.',
  airGiveUp: 'Give the hand up without regret – the next one is 30 seconds away.',
  airLowStakes:
    'The home-game classic: “Somebody always calls.” Exactly why you should not bluff – wait for the next real hand instead.',

  // "Someone bets"
  facingOk: (requiredPct: number, equityPct: number) =>
    `The call is mathematically fine: you need ${requiredPct}% equity and have about ${equityPct}%.`,
  facingFold: (requiredPct: number, equityPct: number) =>
    `Mathematically a fold: you need ${requiredPct}% equity but only have about ${equityPct}%. Call only with a good reason (e.g. high implied odds).`,
};

const TEXT: Record<CoachLang, typeof TEXT_DE> = { de: TEXT_DE, en: TEXT_EN };

// ---------- Preflop ----------

export type CoachPosition = 'frueh' | 'mitte' | 'spaet' | 'blinds';

export const COACH_POSITIONS: Array<{ id: CoachPosition; label: string; hint: string }> = [
  { id: 'frueh', label: 'Früh', hint: 'Als Erste/r oder kurz danach an der Reihe' },
  { id: 'mitte', label: 'Mitte', hint: 'Mittlere Plätze' },
  { id: 'spaet', label: 'Spät', hint: 'Button oder direkt davor' },
  { id: 'blinds', label: 'Blinds', hint: 'Small oder Big Blind' },
];

const COACH_POSITIONS_EN: typeof COACH_POSITIONS = [
  { id: 'frueh', label: 'Early', hint: 'First to act or shortly after' },
  { id: 'mitte', label: 'Middle', hint: 'The middle seats' },
  { id: 'spaet', label: 'Late', hint: 'The button or just before it' },
  { id: 'blinds', label: 'Blinds', hint: 'Small or big blind' },
];

/** Positionsliste in der gewünschten Sprache (IDs bleiben identisch). */
export function coachPositions(lang: CoachLang = 'de'): typeof COACH_POSITIONS {
  return lang === 'en' ? COACH_POSITIONS_EN : COACH_POSITIONS;
}

const RFI = new Map(RFI_CHARTS.map((c) => [c.position, expandRangeSpec(c.raise)]));
const PREMIUM = expandRangeSpec(['QQ+', 'AKs', 'AKo']);
const STRONG = expandRangeSpec(['99+', 'AQs+', 'AQo+', 'AJs', 'ATs', 'KQs']);
const SETMINE = expandRangeSpec(['22+']);
const SUITED_SPEC = expandRangeSpec(['A2s+', 'KTs+', 'QTs+', 'JTs', 'T9s', '98s', '87s', '76s', '65s', '54s']);
const BB_DEF = new Set([
  ...expandRangeSpec(BB_DEFENSE_VS_BTN.threeBet),
  ...expandRangeSpec(BB_DEFENSE_VS_BTN.call),
]);

function chartFor(position: CoachPosition) {
  switch (position) {
    case 'frueh': return RFI.get('UTG')!;
    case 'mitte': return RFI.get('HJ')!;
    case 'spaet': return RFI.get('BTN')!;
    case 'blinds': return RFI.get('SB')!;
  }
}

export function preflopAdvice(
  label: string,
  position: CoachPosition,
  playersAtTable: number,
  raisedBefore: boolean,
  limpers: number,
  lang: CoachLang = 'de',
): CoachAdvice {
  const t = TEXT[lang];
  const manyPlayers = playersAtTable >= 7;

  if (!raisedBefore) {
    const inChart = chartFor(position).has(label);
    const tightened = manyPlayers && !RFI.get('HJ')!.has(label) && position !== 'spaet';

    if (inChart && !tightened) {
      const size = limpers > 0 ? `${3 + limpers}–${4 + limpers} bb` : '3–4 bb';
      return {
        action: 'raise',
        headline: t.rfiHeadline(size),
        reasons: [
          t.rfiInRange(label),
          limpers > 0 ? t.rfiLimpers(limpers) : t.rfiNoLimp,
          manyPlayers ? t.rfiFullTable : t.rfiFixedSize,
        ],
        lowStakes: t.rfiLowStakes,
      };
    }
    if (position === 'blinds') {
      return {
        action: 'checkfold',
        headline: t.bbCheckHeadline,
        reasons: [t.bbTooWeak(label), t.bbFreeFlop, t.sbNotWorth],
      };
    }
    return {
      action: 'fold',
      headline: t.foldHeadline,
      reasons: [
        t.openFoldLoser(label),
        t.openFoldPatience,
        manyPlayers ? t.openFoldManyPlayers : t.openFoldWait,
      ],
      lowStakes: t.openFoldLowStakes,
    };
  }

  // Jemand hat bereits erhöht
  if (PREMIUM.has(label)) {
    return {
      action: 'raise',
      headline: t.premiumHeadline,
      reasons: [t.premiumHand(label), t.premiumSize, t.premiumGoal],
      lowStakes: t.premiumLowStakes,
    };
  }
  if (STRONG.has(label)) {
    return {
      action: 'call',
      headline: t.callHeadline,
      reasons: [t.strongCall(label), t.strongCaution, t.strongPostflop],
    };
  }
  if (SETMINE.has(label)) {
    return {
      action: 'call',
      headline: t.setmineHeadline,
      reasons: [t.setmineHit(label), t.setmineRule, t.setmineMiss],
      lowStakes: t.setmineLowStakes,
    };
  }
  if (position === 'blinds' && BB_DEF.has(label)) {
    return {
      action: 'call',
      headline: t.bbDefHeadline,
      reasons: [t.bbDefDiscount, t.bbDefGoodEnough(label)],
    };
  }
  if (SUITED_SPEC.has(label)) {
    return {
      action: 'fold',
      headline: t.suitedFoldHeadline,
      reasons: [t.suitedPretty(label), t.suitedCheap],
    };
  }
  return {
    action: 'fold',
    headline: t.foldHeadline,
    reasons: [t.vsRaiseWeak(label), t.vsRaiseRule],
  };
}

// ---------- Postflop ----------

export interface PostflopParams {
  street: 'flop' | 'turn' | 'river';
  made: MadeHandInfo;
  draws: DrawInfo | null;
  /** Equity (0–1) gegen die aktuelle Gegnerzahl (Zufallshände). */
  equity: number;
  opponents: number;
}

export function postflopAdvice(p: PostflopParams, lang: CoachLang = 'de'): CoachAdvice {
  const { street, made, draws, equity, opponents } = p;
  const t = TEXT[lang];
  const eqPct = Math.round(equity * 100);
  const multiway = opponents >= 2;
  const isRiver = street === 'river';
  const cat = made.category;

  // --- Sehr starke gemachte Hände ---
  if (cat >= 4) {
    return {
      action: 'bet',
      headline: t.monsterHeadline,
      reasons: [
        t.monsterHolding(made.name, eqPct),
        t.monsterBigBets,
        isRiver ? t.monsterRiver : t.monsterKeepBetting,
      ],
      lowStakes: t.monsterLowStakes,
    };
  }
  if (cat === 3) {
    return {
      action: 'bet',
      headline: t.tripsHeadline,
      reasons: [t.tripsAhead(made.name, eqPct), t.tripsBetEveryStreet, t.tripsSlowDown],
    };
  }
  if (cat === 2) {
    const boardPairTwoPair = made.pairType === 'boardpair';
    return {
      action: 'bet',
      headline: boardPairTwoPair ? t.twoPairHeadlineBoard : t.twoPairHeadline,
      reasons: [
        t.twoPairValue(eqPct),
        boardPairTwoPair ? t.twoPairBoardPair : t.twoPairBetNow,
        multiway ? t.twoPairMultiway : t.twoPairHeadsUp,
      ],
    };
  }

  // --- Ein Paar ---
  if (cat === 1) {
    const pt = made.pairType;
    const goodKicker = (made.kickerRank ?? 0) >= 9; // J oder besser
    if (pt === 'overpair' || (pt === 'toppair' && goodKicker)) {
      return {
        action: 'bet',
        headline: isRiver
          ? opponents === 1
            ? t.tpHeadlineRiverHU
            : t.tpHeadlineRiverMulti
          : t.tpHeadline,
        reasons: [
          t.tpUsuallyBest(pt === 'overpair' ? pairTypeName('overpair', lang) : t.topPairGoodKicker, eqPct),
          isRiver ? t.tpRiverModerate : t.tpBetForValue,
          multiway ? t.tpMultiwayFold : t.tpRaisedCaution,
        ],
        lowStakes: t.tpLowStakes,
      };
    }
    if (pt === 'toppair' || pt === 'middlepair') {
      return {
        action: 'checkcall',
        headline: t.mpHeadline,
        reasons: [
          t.mpGoodEnough(pt === 'toppair' ? t.topPairWeakKicker : pairTypeName('middlepair', lang), eqPct),
          t.mpCallSmall,
          t.mpDontInflate,
        ],
      };
    }
    return {
      action: multiway ? 'checkfold' : 'checkcall',
      headline: multiway ? t.weakPairHeadlineMulti : t.weakPairHeadlineHU,
      reasons: [
        t.weakPairRarely(pt ? pairTypeName(pt, lang) : t.weakPairName, eqPct),
        multiway ? t.weakPairMultiway : t.weakPairHeadsUp,
      ],
    };
  }

  // --- Keine gemachte Hand: Draws & Luft ---
  if (!isRiver && draws && draws.totalOuts >= 12) {
    return {
      action: 'bet',
      headline: t.monsterDrawHeadline,
      reasons: [
        t.monsterDrawDesc(draws.totalOuts, eqPct, draws.parts.map((x) => x.label).join(' + ')),
        t.monsterDrawTwoWays,
        t.monsterDrawAllIn,
      ],
    };
  }
  if (!isRiver && draws && draws.totalOuts >= 8) {
    const eq = street === 'flop' ? draws.totalOuts * 4 : draws.totalOuts * 2;
    return {
      action: 'checkcall',
      headline: t.strongDrawHeadline,
      reasons: [
        t.strongDrawDesc(draws.parts.map((x) => x.label).join(' + '), draws.totalOuts, Math.min(eq, 95), street === 'flop'),
        t.strongDrawRule,
        t.strongDrawPosition,
      ],
      lowStakes: t.strongDrawLowStakes,
    };
  }
  if (!isRiver && draws && draws.totalOuts >= 4) {
    return {
      action: 'checkfold',
      headline: t.weakDrawHeadline,
      reasons: [
        t.weakDrawDesc(draws.totalOuts, eqPct, draws.parts.map((x) => x.label).join(' + ')),
        t.weakDrawPrice,
      ],
    };
  }

  return {
    action: 'checkfold',
    headline: t.airHeadline,
    reasons: [
      t.airNothing(eqPct),
      isRiver ? t.airRiverBluff : t.airGiveUp,
    ],
    lowStakes: t.airLowStakes,
  };
}

// ---------- „Jemand setzt“ ----------

export interface FacingBetVerdict {
  requiredPct: number;
  equityPct: number;
  ok: boolean;
  text: string;
}

export function facingBetVerdict(equity: number, pot: number, bet: number, lang: CoachLang = 'de'): FacingBetVerdict {
  const t = TEXT[lang];
  const required = bet / (pot + 2 * bet);
  const ok = equity >= required + 0.02;
  const requiredPct = Math.round(required * 100);
  const equityPct = Math.round(equity * 100);
  return {
    requiredPct,
    equityPct,
    ok,
    text: ok ? t.facingOk(requiredPct, equityPct) : t.facingFold(requiredPct, equityPct),
  };
}
