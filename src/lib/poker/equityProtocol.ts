// Nachrichtenformat zwischen Hauptthread und Equity-Worker.
// Bewusst winzig gehalten: Karten sind Zahlen 0–51, also strukturklonbar
// ohne jede Konvertierung.

import type { Card } from './cards';
import { equityVsRandomHands } from './equity';

/** Ein Monte-Carlo-Auftrag: Hero-Equity gegen `opponents` zufällige Hände. */
export interface EquityJob {
  hero: Card[];
  board: Card[];
  opponents: number;
  iterations: number;
}

/** Hauptthread → Worker. */
export interface EquityRequest {
  id: number;
  jobs: EquityJob[];
}

/** Worker → Hauptthread: ein Equity-Wert (0–1) je Auftrag, gleiche Reihenfolge. */
export interface EquityResponse {
  id: number;
  equities: number[];
}

/**
 * Rechnet eine Reihe von Aufträgen ab — und zwar an *einer* Stelle.
 *
 * Vorher stand dieselbe Zeile zweimal da: einmal im Worker, einmal im
 * synchronen Rückfallweg von `equityAsync.ts`. Solange beide gleich blieben,
 * fiel das nicht auf; wer eine davon geändert hätte, hätte je nach Browser
 * verschiedene Zahlen bekommen — und die Zahl ist hier der Rat, den die App
 * gibt. Deshalb gibt es sie nur noch hier.
 */
export function rechneAuftraege(jobs: EquityJob[]): number[] {
  return jobs.map((j) => equityVsRandomHands(j.hero, j.board, Math.max(1, j.opponents), j.iterations));
}
