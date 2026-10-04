/* Chip-Rechner: Teilt einen (oder mehrere) Pokerkoffer fair auf.
   Eingabe: Spielerzahl + Chip-Sorten mit Anzahl.
   Ausgabe: Wert je Sorte, Verteilung pro Spieler, Startstack, passende Blinds
   und ein Blind-Fahrplan für Turnier-Abende.

   Seit E-094 rechnet diese Datei nicht mehr selbst. Sie ist der Adapter auf
   `verteile()` (Chipverteilung) und `baueStruktur()` (Blindstruktur), dieselben
   Rechnungen wie bei „Abend einrichten" (E-053: eine Rechnung nur an einer
   Stelle). Vorher gaben beide Bildschirme für denselben Koffer (150/100/50,
   fünf Spieler) verschiedene Auskünfte: hier Weiß 5, Stack 1.650, Blinds 10/20 —
   dort Weiß 1, Stack 380, Blinds 1/2. */

import { verteile } from './live/verteilung';
import { baueStruktur } from './live/blinds';


export interface ChipInput {
  id: string;
  label: string;
  /** Anzeigefarbe (Hex) für den Chip-Punkt in der UI. */
  color: string;
  /** Wie viele Chips dieser Sorte insgesamt im Koffer sind. */
  count: number;
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
export type ChipWarning = 'fewSmallChips' | 'shortStacks' | 'chipsBelowPlayers' | 'unusedChips';

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

/** Dauer und Tempo, mit denen der Fahrplan gerechnet wird: ein Abend von zweieinhalb
 *  Stunden bei normalem Tempo — dieselbe Vorgabe wie bei „Abend einrichten". */
export const FAHRPLAN_DAUER_MIN = 150;

export function planChips(players: number, input: ChipInput[]): ChipPlan | null {
  const chips = input.filter((c) => c.count > 0);
  if (players < 2 || chips.length === 0) return null;

  /* Die Kennung dient als Name, damit jede Sorte wieder ihrer Farbe zugeordnet
     werden kann — zwei Sorten dürfen im Koffer gleich heißen. */
  const v = verteile({ sorten: chips.map((c) => ({ name: c.id, anzahl: c.count })), spieler: players });
  if (!v || v.startchips <= 0) return null;
  /* Reicht der Koffer nicht, hat der Chip-Rechner bisher trotzdem eine
     Verteilung gezeigt (Sorten mit weniger Chips als Spielern bleiben in der
     Bank). Wo gar nichts auszuteilen ist, gibt es nichts zu zeigen. */
  if (v.sorten.every((s) => s.jeSpieler === 0)) return null;

  const nachId = new Map(chips.map((c) => [c.id, c]));
  const allocations: ChipAllocation[] = v.sorten
    .map((s) => {
      const c = nachId.get(s.name)!;
      return {
        id: c.id,
        label: c.label,
        color: c.color,
        value: s.wert,
        perPlayer: s.jeSpieler,
        perPlayerValue: s.jeSpieler * s.wert,
        leftover: s.uebrig,
      };
    })
    .sort((a, b) => a.value - b.value);

  const struktur = baueStruktur({
    dauer_min: FAHRPLAN_DAUER_MIN,
    startchips: v.startchips,
    spieler: players,
    kleinsterChip: v.smallBlind,
    tempo: 'normal',
  });
  const stackBB = Math.round(v.startchips / v.bigBlind);

  const warnings: ChipWarning[] = [];
  if (v.hinweise.includes('wenige-kleine-chips') || allocations[0].perPlayer < 8) warnings.push('fewSmallChips');
  if (stackBB < 40) warnings.push('shortStacks');
  if (v.hinweise.includes('material-reicht-nicht') || chips.some((c) => c.count < players)) warnings.push('chipsBelowPlayers');
  if (v.hinweise.includes('eine-sorte-bleibt-liegen')) warnings.push('unusedChips');

  return {
    chips: allocations,
    stackValue: v.startchips,
    stackBB,
    smallBlind: v.smallBlind,
    bigBlind: v.bigBlind,
    levels: struktur.stufen.map((s) => ({ level: s.nummer, sb: s.sb, bb: s.bb })),
    warnings,
  };
}
