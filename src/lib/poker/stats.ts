/* Spielstil-Analyse: die Kennzahlen, mit denen Pokerspieler ihr eigenes Spiel
   beurteilen – VPIP, PFR, Aggressionsfrequenz, Showdown-Quoten, Fold-Verhalten
   pro Street – plus die Einordnung in die vier bekannten Spielertypen.

   Alles hier ist rein rechnerisch und ohne Seiteneffekte: Aus einer Liste von
   Hand-Fakten wird eine Auswertung. Das macht es prüfbar und hält die
   Erfassung (Übungstisch, Pokerabend) sauber davon getrennt.

   WICHTIG – Aussagekraft: Über wenige Hände sind diese Zahlen Rauschen. Wer
   dreimal hintereinander Schrott bekommt, hat 0 % VPIP, ohne dass das etwas
   über seinen Stil sagt. Deshalb liefert jede Kennzahl mit, auf wie vielen
   Gelegenheiten sie beruht, und `confidenceOf()` sagt, ab wann man sie
   überhaupt ernst nehmen darf. Eine Lern-App, die eine 33-%-Zahl aus neun
   Händen als Diagnose verkauft, bringt ihren Nutzern das Falsche bei. */

export type PostflopStreet = 'flop' | 'turn' | 'river';
export type AnyStreet = 'preflop' | PostflopStreet;

export const POSTFLOP_STREETS: readonly PostflopStreet[] = ['flop', 'turn', 'river'];
export const ALL_STREETS: readonly AnyStreet[] = ['preflop', 'flop', 'turn', 'river'];

/* ------------------------------------------------------------------ *
 * Rohdaten: was in EINER Hand passiert ist
 * ------------------------------------------------------------------ */

/** Die Fakten einer einzelnen Hand aus Sicht eines Spielers. Wird während der
    Hand befüllt (siehe createHandTracker) und danach nur noch gelesen. */
export interface HandFacts {
  /** Konnte preflop freiwillig investiert werden? Praktisch immer wahr; falsch
      nur, wenn die Hand ohne Entscheidung endete (z. B. alle All-in durch
      Blinds). Ohne diese Gelegenheit zählt die Hand nicht in VPIP/PFR. */
  preflopOpportunity: boolean;
  /** Freiwillig Chips in den Pot gegeben (Call oder Raise) – Blinds zählen
      NICHT, die sind erzwungen. Das ist die Definition von VPIP. */
  vpip: boolean;
  /** Preflop erhöht (Raise oder 3-Bet). */
  pfr: boolean;
  /** Aggressive Aktionen nach dem Flop: Bet und Raise. */
  aggressiveActions: number;
  /** Passive Aktionen nach dem Flop: Call. (Checks zählen in der gängigen
      AFq-Definition nicht mit – sie sind keine Entscheidung gegen Aggression.) */
  passiveActions: number;
  /** Stand der Spieler auf dieser Street vor einer Fold-Entscheidung? */
  facedBet: Record<AnyStreet, boolean>;
  /** Hat er auf dieser Street gefoldet? */
  foldedOn: Record<AnyStreet, boolean>;
  /** Hat er den Flop gesehen (nicht vorher gefoldet)? Nenner für WTSD. */
  sawFlop: boolean;
  /** Ging es bis zum Showdown? */
  showdown: boolean;
  /** Am Showdown gewonnen? */
  wonShowdown: boolean;
  /** Hand insgesamt gewonnen (auch ohne Showdown). */
  won: boolean;
  /** Chip-Differenz über die ganze Hand (kann negativ sein). */
  netChips: number;
}

function emptyStreetMap(): Record<AnyStreet, boolean> {
  return { preflop: false, flop: false, turn: false, river: false };
}

export function emptyHandFacts(): HandFacts {
  return {
    preflopOpportunity: false,
    vpip: false,
    pfr: false,
    aggressiveActions: 0,
    passiveActions: 0,
    facedBet: emptyStreetMap(),
    foldedOn: emptyStreetMap(),
    sawFlop: false,
    showdown: false,
    wonShowdown: false,
    won: false,
    netChips: 0,
  };
}

/* ------------------------------------------------------------------ *
 * Erfassung während der Hand
 * ------------------------------------------------------------------ */

/** Was der Spieler gerade getan hat, in der Sprache der Engine. */
export type TrackedAction = 'fold' | 'check' | 'call' | 'raise';

/** Sammelt die Fakten einer Hand, während sie läuft. Bewusst ein kleiner
    Zustandsautomat statt einer Auswertung des Log-Textes: Log-Zeilen sind
    übersetzt und für Menschen gedacht, sie sind keine belastbare Datenquelle. */
export interface HandTracker {
  /** Vor jeder Hero-Aktion aufrufen – auch bei Check und Fold.
      `facingBet` = musste er etwas callen, um weiterzuspielen? */
  onAction: (street: AnyStreet, action: TrackedAction, facingBet: boolean) => void;
  /** Beim Übergang auf den Flop aufrufen, wenn der Spieler noch dabei ist. */
  onSawFlop: () => void;
  /** Am Ende der Hand aufrufen. */
  finish: (outcome: { won: boolean; showdown: boolean; netChips: number }) => HandFacts;
}

export function createHandTracker(): HandTracker {
  const f = emptyHandFacts();

  return {
    onAction(street, action, facingBet) {
      if (street === 'preflop') {
        // Die Gelegenheit zählt, sobald überhaupt eine Entscheidung anstand.
        f.preflopOpportunity = true;
        if (action === 'call' || action === 'raise') f.vpip = true;
        if (action === 'raise') f.pfr = true;
      } else {
        if (action === 'raise') f.aggressiveActions += 1;
        else if (action === 'call') f.passiveActions += 1;
      }
      if (facingBet) {
        f.facedBet[street] = true;
        if (action === 'fold') f.foldedOn[street] = true;
      }
    },
    onSawFlop() {
      f.sawFlop = true;
    },
    finish(outcome) {
      f.won = outcome.won;
      f.showdown = outcome.showdown;
      f.wonShowdown = outcome.showdown && outcome.won;
      f.netChips = outcome.netChips;
      return { ...f, facedBet: { ...f.facedBet }, foldedOn: { ...f.foldedOn } };
    },
  };
}

/* ------------------------------------------------------------------ *
 * Auswertung
 * ------------------------------------------------------------------ */

/** Eine Kennzahl mit ihrem Nenner. Der Nenner ist kein Beiwerk: Ohne ihn kann
    niemand beurteilen, ob 33 % eine Aussage oder ein Zufall sind. */
export interface Metric {
  /** Prozentwert 0–100, oder null wenn es keine einzige Gelegenheit gab. */
  value: number | null;
  /** Wie oft das Ereignis eintrat. */
  count: number;
  /** Wie viele Gelegenheiten es gab. */
  opportunities: number;
}

function metric(count: number, opportunities: number): Metric {
  return {
    value: opportunities > 0 ? (100 * count) / opportunities : null,
    count,
    opportunities,
  };
}

export interface PlayerStats {
  hands: number;
  /** Voluntarily Put money In Pot – wie viele Hände werden gespielt. */
  vpip: Metric;
  /** Pre-Flop Raise – wie viele Hände werden erhöht. */
  pfr: Metric;
  /** Aggressionsfrequenz nach dem Flop: Bet/Raise geteilt durch alle
      gewerteten Aktionen (Bet/Raise + Call). */
  afq: Metric;
  /** Went To ShowDown – wie oft es nach gesehenem Flop bis zum Showdown geht. */
  wtsd: Metric;
  /** Won money at ShowDown – wie oft ein Showdown gewonnen wird. */
  wsd: Metric;
  /** Fold-Häufigkeit je Street, jeweils bezogen auf die Male, in denen ein
      Einsatz zu callen war. */
  foldBy: Record<AnyStreet, Metric>;
  /** Anteil gewonnener Hände. */
  winRate: Metric;
  /** Chip-Bilanz über alle erfassten Hände. */
  netChips: number;
}

export function emptyStats(): PlayerStats {
  const zero = metric(0, 0);
  return {
    hands: 0,
    vpip: zero,
    pfr: zero,
    afq: zero,
    wtsd: zero,
    wsd: zero,
    foldBy: { preflop: zero, flop: zero, turn: zero, river: zero },
    winRate: zero,
    netChips: 0,
  };
}

export function computeStats(facts: readonly HandFacts[]): PlayerStats {
  if (facts.length === 0) return emptyStats();

  let preflopOpps = 0;
  let vpipCount = 0;
  let pfrCount = 0;
  let aggressive = 0;
  let passive = 0;
  let sawFlop = 0;
  let showdowns = 0;
  let showdownWins = 0;
  let wins = 0;
  let netChips = 0;

  const foldCount: Record<AnyStreet, number> = { preflop: 0, flop: 0, turn: 0, river: 0 };
  const foldOpps: Record<AnyStreet, number> = { preflop: 0, flop: 0, turn: 0, river: 0 };

  for (const f of facts) {
    if (f.preflopOpportunity) {
      preflopOpps += 1;
      if (f.vpip) vpipCount += 1;
      if (f.pfr) pfrCount += 1;
    }
    aggressive += f.aggressiveActions;
    passive += f.passiveActions;
    if (f.sawFlop) sawFlop += 1;
    if (f.showdown) {
      showdowns += 1;
      if (f.wonShowdown) showdownWins += 1;
    }
    if (f.won) wins += 1;
    netChips += f.netChips;
    for (const s of ALL_STREETS) {
      if (f.facedBet[s]) {
        foldOpps[s] += 1;
        if (f.foldedOn[s]) foldCount[s] += 1;
      }
    }
  }

  return {
    hands: facts.length,
    vpip: metric(vpipCount, preflopOpps),
    pfr: metric(pfrCount, preflopOpps),
    afq: metric(aggressive, aggressive + passive),
    wtsd: metric(showdowns, sawFlop),
    wsd: metric(showdownWins, showdowns),
    foldBy: {
      preflop: metric(foldCount.preflop, foldOpps.preflop),
      flop: metric(foldCount.flop, foldOpps.flop),
      turn: metric(foldCount.turn, foldOpps.turn),
      river: metric(foldCount.river, foldOpps.river),
    },
    winRate: metric(wins, facts.length),
    netChips,
  };
}

/* ------------------------------------------------------------------ *
 * Aussagekraft
 * ------------------------------------------------------------------ */

export type Confidence = 'none' | 'weak' | 'fair' | 'solid';

/** Ab wann eine Kennzahl etwas bedeutet. Die Schwellen sind bewusst niedriger
    als in der Fachliteratur (dort gelten für VPIP erst ~100 Hände als solide,
    für Postflop-Werte deutlich mehr) – in einer Lern-App geht es nicht um ein
    Urteil über einen Gegner, sondern um eine Tendenz im eigenen Spiel. Was
    zählt, ist die Ehrlichkeit der Abstufung, nicht der exakte Wert. */
export function confidenceOf(opportunities: number): Confidence {
  if (opportunities < 1) return 'none';
  if (opportunities < 20) return 'weak';
  if (opportunities < 60) return 'fair';
  return 'solid';
}

/** Ab hier lohnt es sich überhaupt, eine Spielstil-Einordnung zu zeigen. */
export const MIN_HANDS_FOR_STYLE = 20;

/* ------------------------------------------------------------------ *
 * Spielertyp
 * ------------------------------------------------------------------ */

export type PlayStyle = 'rock' | 'tag' | 'lag' | 'fish' | 'unknown';

export interface StyleAssessment {
  style: PlayStyle;
  /** 0 = sehr tight, 1 = sehr loose. Für die waagerechte Achse im Diagramm. */
  looseness: number;
  /** 0 = sehr passiv, 1 = sehr aggressiv. Für die senkrechte Achse. */
  aggression: number;
  /** Reicht die Datenmenge für eine Einordnung? */
  reliable: boolean;
}

/* Schwellen für 6-max-Verhältnisse, wie sie am Übungstisch herrschen.
   VPIP unter ~24 % gilt dort als tight, darüber als loose; die Aggression
   messen wir aus PFR (preflop) und AFq (postflop) gemeinsam, weil beide für
   sich genommen leicht kippen. */
const VPIP_TIGHT = 18;
const VPIP_LOOSE = 32;
const AGG_PASSIVE = 25;
const AGG_AGGRESSIVE = 55;

function scale(value: number, low: number, high: number): number {
  if (high <= low) return 0.5;
  return Math.max(0, Math.min(1, (value - low) / (high - low)));
}

export function assessStyle(stats: PlayerStats): StyleAssessment {
  const vpip = stats.vpip.value;
  const pfr = stats.pfr.value;
  const afq = stats.afq.value;

  const reliable = stats.hands >= MIN_HANDS_FOR_STYLE && vpip !== null;
  if (vpip === null) {
    return { style: 'unknown', looseness: 0.5, aggression: 0.5, reliable: false };
  }

  const looseness = scale(vpip, VPIP_TIGHT, VPIP_LOOSE);

  /* Aggression aus zwei Quellen: Wie oft wird preflop erhöht statt nur
     mitgegangen (PFR im Verhältnis zu VPIP), und wie aggressiv wird nach dem
     Flop gespielt (AFq). Fehlt eine Quelle, zählt die andere allein. */
  const preflopAgg = vpip > 0 && pfr !== null ? (100 * pfr) / vpip : null;
  const parts: number[] = [];
  if (preflopAgg !== null) parts.push(scale(preflopAgg, AGG_PASSIVE, AGG_AGGRESSIVE));
  if (afq !== null) parts.push(scale(afq, AGG_PASSIVE, AGG_AGGRESSIVE));
  const aggression = parts.length ? parts.reduce((a, b) => a + b, 0) / parts.length : 0.5;

  if (!reliable) return { style: 'unknown', looseness, aggression, reliable };

  const loose = looseness >= 0.5;
  const aggressive = aggression >= 0.5;
  const style: PlayStyle = loose
    ? aggressive
      ? 'lag'
      : 'fish'
    : aggressive
      ? 'tag'
      : 'rock';

  return { style, looseness, aggression, reliable };
}

/* ------------------------------------------------------------------ *
 * Bewertung einzelner Kennzahlen
 * ------------------------------------------------------------------ */

export type Verdict = 'low' | 'good' | 'high' | 'unknown';

export interface MetricTarget {
  min: number;
  max: number;
}

/** Zielbereiche für lockere 6-max-Runden, wie sie am Übungstisch und im
    Homegame vorkommen. Das sind Orientierungswerte, keine Gesetze – deshalb
    sind sie als Spanne angegeben und werden in der Oberfläche auch so
    gezeigt. Quellen sind die gängigen Standardwerte solider Gewinnspieler
    (VPIP/PFR nah beieinander, klar aggressiv, ohne extrem zu foldern). */
export const TARGETS = {
  vpip: { min: 20, max: 30 },
  pfr: { min: 15, max: 24 },
  afq: { min: 40, max: 65 },
  wtsd: { min: 24, max: 34 },
  wsd: { min: 48, max: 62 },
} as const satisfies Record<string, MetricTarget>;

export type TargetKey = keyof typeof TARGETS;

export function judge(m: Metric, target: MetricTarget): Verdict {
  if (m.value === null || m.opportunities === 0) return 'unknown';
  if (m.value < target.min) return 'low';
  if (m.value > target.max) return 'high';
  return 'good';
}

/** Ein sprachfreier Hinweis-Code. Die Übersetzung liegt in der Oberfläche –
    diese Bibliothek bleibt frei von Anzeigetexten, damit sie in beiden
    Sprachen dieselbe Wahrheit liefert. */
export interface StatHint {
  key: TargetKey;
  verdict: Verdict;
  confidence: Confidence;
}

export function hintsFor(stats: PlayerStats): StatHint[] {
  const entries: Array<[TargetKey, Metric]> = [
    ['vpip', stats.vpip],
    ['pfr', stats.pfr],
    ['afq', stats.afq],
    ['wtsd', stats.wtsd],
    ['wsd', stats.wsd],
  ];
  return entries.map(([key, m]) => ({
    key,
    verdict: judge(m, TARGETS[key]),
    confidence: confidenceOf(m.opportunities),
  }));
}

/** Der eine Hinweis, der gerade am meisten bringt: die deutlichste Abweichung
    vom Zielbereich, die auf genug Gelegenheiten beruht. Null, wenn (noch)
    nichts Belastbares auffällt. Bewusst EIN Hinweis statt fünf – wer fünf
    Dinge gleichzeitig verbessern soll, verbessert keins. */
export function topHint(stats: PlayerStats): StatHint | null {
  let best: StatHint | null = null;
  let bestDistance = 0;

  for (const hint of hintsFor(stats)) {
    if (hint.verdict === 'good' || hint.verdict === 'unknown') continue;
    if (hint.confidence === 'none' || hint.confidence === 'weak') continue;
    const m = statByKey(stats, hint.key);
    if (m.value === null) continue;
    const t = TARGETS[hint.key];
    const distance = hint.verdict === 'low' ? t.min - m.value : m.value - t.max;
    if (distance > bestDistance) {
      bestDistance = distance;
      best = hint;
    }
  }
  return best;
}

export function statByKey(stats: PlayerStats, key: TargetKey): Metric {
  switch (key) {
    case 'vpip':
      return stats.vpip;
    case 'pfr':
      return stats.pfr;
    case 'afq':
      return stats.afq;
    case 'wtsd':
      return stats.wtsd;
    case 'wsd':
      return stats.wsd;
  }
}

/* ------------------------------------------------------------------ *
 * Speicherform
 * ------------------------------------------------------------------ */

/** Wie viele Hand-Fakten höchstens aufbewahrt werden. Jede Hand ist winzig
    (ein paar Zahlen und Wahrheitswerte), aber der Lernstand wandert als
    JSON-Text in die Cloud – deshalb eine harte Obergrenze. 500 Hände reichen
    für belastbare Kennzahlen weit aus. */
export const MAX_TRACKED_HANDS = 500;

function bool(v: unknown): boolean {
  return v === true;
}

function int(v: unknown): number {
  return typeof v === 'number' && Number.isFinite(v) ? Math.trunc(v) : 0;
}

function streetMap(v: unknown): Record<AnyStreet, boolean> {
  const o = (v ?? {}) as Record<string, unknown>;
  return {
    preflop: bool(o.preflop),
    flop: bool(o.flop),
    turn: bool(o.turn),
    river: bool(o.river),
  };
}

/** Baut Hand-Fakten Feld für Feld neu auf. Wie überall in dieser App gilt:
    Was aus Speicher oder Cloud kommt, wird nicht geglaubt, sondern geprüft. */
export function sanitizeHandFacts(raw: unknown): HandFacts[] {
  if (!Array.isArray(raw)) return [];
  const out: HandFacts[] = [];
  for (const item of raw.slice(-MAX_TRACKED_HANDS)) {
    if (!item || typeof item !== 'object') continue;
    const o = item as Record<string, unknown>;
    out.push({
      preflopOpportunity: bool(o.preflopOpportunity),
      vpip: bool(o.vpip),
      pfr: bool(o.pfr),
      aggressiveActions: Math.max(0, int(o.aggressiveActions)),
      passiveActions: Math.max(0, int(o.passiveActions)),
      facedBet: streetMap(o.facedBet),
      foldedOn: streetMap(o.foldedOn),
      sawFlop: bool(o.sawFlop),
      showdown: bool(o.showdown),
      wonShowdown: bool(o.wonShowdown),
      won: bool(o.won),
      netChips: int(o.netChips),
    });
  }
  return out;
}
