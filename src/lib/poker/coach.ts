// Empfehlungslogik für den Live-Coach (Fokus: lockere Low-Stakes-Runden).
// Grundprinzip: value-lastig spielen, wenig bluffen, Preise ausrechnen.

import { expandRangeSpec } from './ranges';
import { RFI_CHARTS, BB_DEFENSE_VS_BTN } from '../../content/ranges';
import type { DrawInfo, MadeHandInfo } from './analysis';
import { PAIR_TYPE_NAMES } from './analysis';

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

// ---------- Preflop ----------

export type CoachPosition = 'frueh' | 'mitte' | 'spaet' | 'blinds';

export const COACH_POSITIONS: Array<{ id: CoachPosition; label: string; hint: string }> = [
  { id: 'frueh', label: 'Früh', hint: 'Als Erste/r oder kurz danach an der Reihe' },
  { id: 'mitte', label: 'Mitte', hint: 'Mittlere Plätze' },
  { id: 'spaet', label: 'Spät', hint: 'Button oder direkt davor' },
  { id: 'blinds', label: 'Blinds', hint: 'Small oder Big Blind' },
];

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
): CoachAdvice {
  const manyPlayers = playersAtTable >= 7;

  if (!raisedBefore) {
    const inChart = chartFor(position).has(label);
    const tightened = manyPlayers && !RFI.get('HJ')!.has(label) && position !== 'spaet';

    if (inChart && !tightened) {
      const size = limpers > 0 ? `${3 + limpers}–${4 + limpers} bb` : '3–4 bb';
      return {
        action: 'raise',
        headline: `Raise auf ${size}`,
        reasons: [
          `${label} gehört aus dieser Position in deine Eröffnungs-Range.`,
          limpers > 0
            ? `Es ${limpers === 1 ? 'limpt bereits 1 Spieler' : `limpen bereits ${limpers} Spieler`}: erhöhe größer (Basis + 1 bb pro Limper), damit nicht alle billig mitgehen.`
            : 'Erhöhen statt limpen: Du baust den Pot mit der besseren Hand auf und kannst schon vor dem Flop gewinnen.',
          manyPlayers ? 'Voller Tisch: bleib trotzdem diszipliniert – lieber eine Hand weniger spielen.' : 'Bleib bei einer festen Raise-Größe, egal welche Hand du hast – so bist du nicht lesbar.',
        ],
        lowStakes:
          'In lockeren Runden wird viel gecallt: Wähle eher 4 bb als 3 bb – deine starken Hände werden trotzdem bezahlt.',
      };
    }
    if (position === 'blinds') {
      return {
        action: 'checkfold',
        headline: 'Im Big Blind: Check · sonst Fold',
        reasons: [
          `${label} ist zu schwach, um aus den Blinds selbst anzugreifen.`,
          'Im Big Blind ohne Raise davor: kostenlos den Flop ansehen (Check).',
          'Im Small Blind: die halbe Blind-Ersparnis ist es nicht wert, out of position zu spielen.',
        ],
      };
    }
    return {
      action: 'fold',
      headline: 'Fold',
      reasons: [
        `${label} ist aus dieser Position langfristig ein Verlustgeschäft.`,
        'Geduld zahlt sich aus: Die Gewinne kommen aus den Händen, die du NICHT spielst.',
        manyPlayers ? 'Je mehr Spieler am Tisch, desto wahrscheinlicher hält jemand etwas Besseres.' : 'Warte auf eine Hand aus deiner Range – die nächste kommt bestimmt.',
      ],
      lowStakes:
        'Auch wenn alle mitspielen: Wer jede Hand spielt, verliert am Ende des Abends. Fold ist dein Freund.',
    };
  }

  // Jemand hat bereits erhöht
  if (PREMIUM.has(label)) {
    return {
      action: 'raise',
      headline: 'Re-Raise (3-Bet) auf ca. 3x den Raise',
      reasons: [
        `${label} ist eine Premium-Hand – die stärksten ~2,5 % aller Starthände.`,
        'Erhöhe auf etwa das Dreifache des ursprünglichen Raises (out of position eher 4x).',
        'Ziel: den Pot groß machen, solange du sehr wahrscheinlich vorne liegst.',
      ],
      lowStakes: 'Freizeitspieler folden selten auf 3-Bets – umso besser: Du bekommst Value, keine Bluff-Show.',
    };
  }
  if (STRONG.has(label)) {
    return {
      action: 'call',
      headline: 'Call',
      reasons: [
        `${label} ist stark, aber gegen einen Raise nicht klar vorne – mitgehen und den Flop ansehen.`,
        'Vorsicht bei viel Action nach dir (Re-Raises): dann lieber aussteigen.',
        'Postflop gilt: Top Pair mit gutem Kicker ist meist gut, aber kein Selbstläufer.',
      ],
    };
  }
  if (SETMINE.has(label)) {
    return {
      action: 'call',
      headline: 'Call – aber nur, wenn der Raise klein ist',
      reasons: [
        `Mit dem Paar ${label} spielst du auf ein Set (Drilling): Das triffst du am Flop in ca. 12 % der Fälle.`,
        'Faustregel: Call nur, wenn du und der Gegner noch mindestens das 15-Fache des Raises im Stack habt.',
        'Triffst du kein Set und es gibt Action: fast immer folden.',
      ],
      lowStakes: 'Set-Mining ist DIE Geldmaschine in lockeren Runden – Sets werden von Top Pair fast immer bezahlt.',
    };
  }
  if (position === 'blinds' && BB_DEF.has(label)) {
    return {
      action: 'call',
      headline: 'Im Big Blind: Call möglich',
      reasons: [
        'Im Big Blind hast du schon Geld im Pot und bekommst einen Rabatt auf den Call.',
        `${label} ist gut genug, um den Flop anzusehen – danach ehrlich bleiben: Nur mit Treffer oder gutem Draw weitermachen.`,
      ],
    };
  }
  if (SUITED_SPEC.has(label)) {
    return {
      action: 'fold',
      headline: 'Fold (knapp)',
      reasons: [
        `${label} sieht hübsch aus, spielt sich gegen einen Raise aber schlecht – vor allem out of position.`,
        'Solche Hände willst du billig und in Position spielen, nicht gegen Stärke bezahlen.',
      ],
    };
  }
  return {
    action: 'fold',
    headline: 'Fold',
    reasons: [
      `Gegen einen Raise ist ${label} klar zu schwach.`,
      'Merksatz: Gegen eine Erhöhung brauchst du eine deutlich stärkere Hand als zum selbst Erhöhen.',
    ],
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

export function postflopAdvice(p: PostflopParams): CoachAdvice {
  const { street, made, draws, equity, opponents } = p;
  const eqPct = Math.round(equity * 100);
  const multiway = opponents >= 2;
  const isRiver = street === 'river';
  const cat = made.category;

  // --- Sehr starke gemachte Hände ---
  if (cat >= 4) {
    return {
      action: 'bet',
      headline: 'Bet 70–100 % des Pots (Value)',
      reasons: [
        `Du hältst ${made.name} – fast sicher die beste Hand (~${eqPct} % Equity).`,
        'Große Bets, keine Tricks: Der Pot soll wachsen, solange jemand bezahlt.',
        isRiver ? 'Am River: setz einen Betrag, den eine schlechtere Hand gerade noch callt.' : 'Auch Turn und River weiter setzen (drei „Streets of Value“).',
      ],
      lowStakes: 'Slowplay ist in lockeren Runden meist ein Fehler – es wird sowieso gecallt. Setz einfach.',
    };
  }
  if (cat === 3) {
    return {
      action: 'bet',
      headline: 'Bet 60–75 % des Pots (Value)',
      reasons: [
        `${made.name} ist fast immer vorne (~${eqPct} % Equity).`,
        'Setz auf jeder Street – Drillinge werden von Top Pair und Draws gut bezahlt.',
        'Nur bremsen, wenn Board-Karten Flush oder Straße vervollständigen UND ein enger Spieler plötzlich raist.',
      ],
    };
  }
  if (cat === 2) {
    const boardPairTwoPair = made.pairType === 'boardpair';
    return {
      action: 'bet',
      headline: boardPairTwoPair ? 'Bet klein (40–50 % Pot) oder Check' : 'Bet 55–70 % des Pots (Value)',
      reasons: [
        `Zwei Paare (~${eqPct} % Equity): eine klare Value-Hand.`,
        boardPairTwoPair
          ? 'Achtung: Ein Paar liegt auf dem Board – dein „zwei Paar“ ist schwächer, als es klingt.'
          : 'Setz jetzt: Auf späteren Karten können Flushs/Straßen ankommen, die dich einholen.',
        multiway ? 'Gegen mehrere Gegner: eher größere Bets, weniger Bluff-Gefahr im Kopf behalten – Raises sind dort meist echt.' : 'Gegen große Raises trotzdem kurz durchatmen: Zwei Paare sind stark, aber nicht unbesiegbar.',
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
            ? 'Value-Bet 40–60 % des Pots'
            : 'Eher Check (mehrere Gegner)'
          : 'Bet 50–65 % des Pots',
        reasons: [
          `${pt === 'overpair' ? PAIR_TYPE_NAMES.overpair : 'Top Pair mit gutem Kicker'} (~${eqPct} % Equity) – meist die beste Hand.`,
          isRiver
            ? 'Am River zahlt dich ein schlechteres Top Pair oder ein Ass-Hoch noch aus – halte die Bet moderat.'
            : 'Setz für Value und um Draws einen schlechten Preis zu geben.',
          multiway ? 'Mehrere Gegner: Wird groß geraist, ist ein Paar oft geschlagen – dann diszipliniert folden.' : 'Wirst du geraist, ist Vorsicht angesagt: Freizeitspieler raisen selten als Bluff.',
        ],
        lowStakes: 'Die meisten Homegame-Gewinne kommen genau hieraus: Top Pair konsequent value-betten, weil zu viel gecallt wird.',
      };
    }
    if (pt === 'toppair' || pt === 'middlepair') {
      return {
        action: 'checkcall',
        headline: 'Check · kleine Bets callen',
        reasons: [
          `${pt === 'toppair' ? 'Top Pair mit schwachem Kicker' : PAIR_TYPE_NAMES.middlepair} (~${eqPct} % Equity): gut genug zum Mitgehen, zu dünn für große Pötte.`,
          'Kleine und mittlere Bets callen, bei großen Bets oder Raises loslassen.',
          'Nicht selbst aufblasen: Du gewinnst kleine Pötte, keine großen.',
        ],
      };
    }
    return {
      action: multiway ? 'checkfold' : 'checkcall',
      headline: multiway ? 'Check / Fold' : 'Check · höchstens Mini-Bets callen',
      reasons: [
        `${pt ? PAIR_TYPE_NAMES[pt] : 'Ein schwaches Paar'} (~${eqPct} % Equity) gewinnt selten große Pötte.`,
        multiway
          ? 'Gegen mehrere Gegner ist ein schwaches Paar fast nie gut genug – spar dir die Chips.'
          : 'Heads-up darfst du eine kleine Bet callen – mehr nicht.',
      ],
    };
  }

  // --- Keine gemachte Hand: Draws & Luft ---
  if (!isRiver && draws && draws.totalOuts >= 12) {
    return {
      action: 'bet',
      headline: 'Semi-Bluff: Bet 50–75 % des Pots (oder Raise)',
      reasons: [
        `Monster-Draw mit ca. ${draws.totalOuts} Outs (~${eqPct} % Equity): ${draws.parts.map((x) => x.label).join(' + ')}.`,
        'Du gewinnst auf zwei Arten: Alle folden – oder du triffst einen der vielen Outs.',
        'Auch ein All-in ist mit so einem Draw selten ein großer Fehler.',
      ],
    };
  }
  if (!isRiver && draws && draws.totalOuts >= 8) {
    const eq = street === 'flop' ? draws.totalOuts * 4 : draws.totalOuts * 2;
    return {
      action: 'checkcall',
      headline: 'Check / Call mit gutem Preis',
      reasons: [
        `Starker Draw: ${draws.parts.map((x) => x.label).join(' + ')} (${draws.totalOuts} Outs ≈ ${Math.min(eq, 95)} % bis ${street === 'flop' ? 'River' : 'zur nächsten Karte'}).`,
        'Faustregel: Bets bis etwa ⅔ Pot darfst du callen; wird es teurer, brauchst du zusätzliche Gewinnchancen (z. B. versteckte Paare).',
        'In Position darfst du auch mal selbst setzen (Semi-Bluff) – gegen viele Caller lieber nur callen.',
      ],
      lowStakes: 'Draws sind in lockeren Runden Gold wert: Triffst du, wirst du bezahlt (gute Implied Odds).',
    };
  }
  if (!isRiver && draws && draws.totalOuts >= 4) {
    return {
      action: 'checkfold',
      headline: 'Check · nur Mini-Bets callen',
      reasons: [
        `Schwacher Draw (${draws.totalOuts} Outs, ~${eqPct} % Equity): ${draws.parts.map((x) => x.label).join(' + ')}.`,
        'Nur sehr kleine Bets (bis ca. ¼ Pot) bezahlen – sonst ist der Preis zu schlecht.',
      ],
    };
  }

  return {
    action: 'checkfold',
    headline: 'Check / Fold',
    reasons: [
      `Keine gemachte Hand, kein echter Draw (~${eqPct} % Equity): Hier gibt es nichts zu gewinnen.`,
      isRiver
        ? 'Am River ohne Showdown-Wert bleibt nur der Bluff – und der funktioniert gegen viele Caller schlecht.'
        : 'Gib die Hand ohne Reue auf – die nächste kommt in 30 Sekunden.',
    ],
    lowStakes:
      'Der Klassiker im Homegame: „Einer callt immer.“ Genau deshalb: nicht bluffen, sondern auf die nächste echte Hand warten.',
  };
}

// ---------- „Jemand setzt“ ----------

export interface FacingBetVerdict {
  requiredPct: number;
  equityPct: number;
  ok: boolean;
  text: string;
}

export function facingBetVerdict(equity: number, pot: number, bet: number): FacingBetVerdict {
  const required = bet / (pot + 2 * bet);
  const ok = equity >= required + 0.02;
  const requiredPct = Math.round(required * 100);
  const equityPct = Math.round(equity * 100);
  return {
    requiredPct,
    equityPct,
    ok,
    text: ok
      ? `Call ist rechnerisch in Ordnung: Du brauchst ${requiredPct} % Equity und hast ca. ${equityPct} %.`
      : `Rechnerisch ein Fold: Du brauchst ${requiredPct} % Equity, hast aber nur ca. ${equityPct} %. Call nur mit gutem Grund (z. B. hohe Implied Odds).`,
  };
}
