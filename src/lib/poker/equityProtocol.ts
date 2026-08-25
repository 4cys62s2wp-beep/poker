// Nachrichtenformat zwischen Hauptthread und Equity-Worker.
// Bewusst winzig gehalten: Karten sind Zahlen 0–51, also strukturklonbar
// ohne jede Konvertierung.

import type { Card } from './cards';

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
