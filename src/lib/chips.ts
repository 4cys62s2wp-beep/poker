/* Chip-Rechner: Teilt einen (oder mehrere) Pokerkoffer fair auf.
   Eingabe: Spielerzahl + Chip-Sorten mit Anzahl (Werte optional).
   Ausgabe: Wert-Vorschlag pro Sorte, Verteilung pro Spieler, Startstack,
   passende Blinds und ein Blind-Fahrplan für Turnier-Abende. */

export interface ChipInput {
  id: string;
  label: string;
  /** Anzeigefarbe (Hex) für den Chip-Punkt in der UI. */
  color: string;
  /** Wie viele Chips dieser Sorte insgesamt im Koffer sind. */
  count: number;
  /** Optionaler fester Wert (leer = automatisch vergeben). */
  value?: number;
}

export interface ChipAllocation {
  id: string;
  label: string;
  color: string;
  value: number;
  perPlayer: number;
  perPlayerValue: number;
  leftover: number;
}

export interface BlindLevel {
  level: number;
  sb: number;
  bb: number;
}

/** Hinweis-Codes statt fertiger Texte: Die Übersetzung passiert in der UI
    (src/i18n/pages/chips.ts) – so bleibt die Rechenlogik sprachfrei. */
export type ChipWarning = 'fewSmallChips' | 'shortStacks' | 'chipsBelowPlayers';

export interface ChipPlan {
  chips: ChipAllocation[];
  /** Startstack pro Spieler in Punkten. */
  stackValue: number;
  /** Startstack in Big Blinds. */
  stackBB: number;
  smallBlind: number;
  bigBlind: number;
  levels: BlindLevel[];
  /** Sprachfreie Hinweis-Codes – Texte siehe STR[lang].warnings. */
  warnings: ChipWarning[];
}

/* Bewährte Heimspiel-Wertleitern: Die häufigste Chipsorte bekommt den
   kleinsten Wert (in echten Koffern gibt es die kleinen Chips am öftesten). */
const VALUE_LADDERS: Record<number, number[]> = {
  1: [1],
  2: [5, 25],
  3: [5, 25, 100],
  4: [5, 25, 100, 500],
  5: [5, 25, 100, 500, 1000],
  6: [5, 25, 100, 500, 1000, 5000],
  7: [1, 5, 25, 100, 500, 1000, 5000],
  8: [1, 5, 25, 100, 500, 1000, 5000, 10000],
};

/** „Schöne“ BB-Vielfache des kleinsten Chips – gerade, damit der Small Blind
    (= BB/2) immer mit ganzen Chips bezahlbar bleibt. */
const BB_MULTIPLIERS = [2, 4, 10, 20, 40, 100, 200, 400, 1000, 2000, 4000, 10000];

export function planChips(players: number, input: ChipInput[]): ChipPlan | null {
  const chips = input.filter((c) => c.count > 0);
  if (players < 2 || chips.length === 0) return null;

  // Werte vergeben: manuelle Werte respektieren, Rest automatisch nach Häufigkeit.
  const ladder = VALUE_LADDERS[Math.min(chips.length, 8)];
  const usedValues = new Set(chips.filter((c) => c.value && c.value > 0).map((c) => c.value));
  const autoValues = ladder.filter((v) => !usedValues.has(v));
  const byCount = [...chips].sort((a, b) => b.count - a.count);
  const valueOf = new Map<string, number>();
  let autoIdx = 0;
  for (const c of byCount) {
    if (c.value && c.value > 0) {
      valueOf.set(c.id, Math.floor(c.value));
    } else {
      valueOf.set(c.id, autoValues[Math.min(autoIdx++, autoValues.length - 1)] ?? 1);
    }
  }

  // Verteilung: jede Sorte gleichmäßig aufteilen, Rest bleibt in der Bank.
  const allocations: ChipAllocation[] = chips
    .map((c) => {
      const value = valueOf.get(c.id)!;
      const perPlayer = Math.floor(c.count / players);
      return {
        id: c.id,
        label: c.label,
        color: c.color,
        value,
        perPlayer,
        perPlayerValue: perPlayer * value,
        leftover: c.count - perPlayer * players,
      };
    })
    .sort((a, b) => a.value - b.value);

  const stackValue = allocations.reduce((s, a) => s + a.perPlayerValue, 0);
  if (stackValue <= 0) return null;

  const smallest = allocations[0].value;

  // Blinds: Ziel ~100 BB Startstack, BB als gerades Vielfaches des kleinsten Chips.
  let bigBlind = smallest * 2;
  let bestScore = Infinity;
  for (const m of BB_MULTIPLIERS) {
    const bb = smallest * m;
    if (bb * 20 > stackValue && bb !== smallest * 2) break; // unter 20 BB macht kein Setup Sinn
    const score = Math.abs(stackValue / bb - 100);
    if (score < bestScore) {
      bestScore = score;
      bigBlind = bb;
    }
  }
  const smallBlind = bigBlind / 2;
  const stackBB = Math.round(stackValue / bigBlind);

  // Turnier-Fahrplan: von den Start-Blinds die Leiter hoch, bis die Blinds
  // etwa ein Drittel des Startstacks erreichen.
  const levels: BlindLevel[] = [];
  const startIdx = BB_MULTIPLIERS.findIndex((m) => smallest * m === bigBlind);
  for (let i = Math.max(0, startIdx), lvl = 1; i < BB_MULTIPLIERS.length && lvl <= 12; i++, lvl++) {
    const bb = smallest * BB_MULTIPLIERS[i];
    levels.push({ level: lvl, sb: bb / 2, bb });
    if (bb >= stackValue / 3) break;
  }

  const warnings: ChipWarning[] = [];
  if (allocations[0].perPlayer < 8) warnings.push('fewSmallChips');
  if (stackBB < 40) warnings.push('shortStacks');
  if (chips.some((c) => c.count < players)) warnings.push('chipsBelowPlayers');

  return { chips: allocations, stackValue, stackBB, smallBlind, bigBlind, levels, warnings };
}
