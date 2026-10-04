/* Sitzt jemand am Schreibtisch? Maus, breites Fenster, Tastatur.
   ==============================================================

   Dieselbe Bedingung steht in global.css (die Blöcke „Tastenkürzel am
   Desktop“): Tastenhinweise an den Knöpfen und der Drill mit den Knöpfen unter
   der Karte gelten nur dort. Wer sie ändert, ändert beide Stellen. */

export const SCHREIBTISCH = '(hover: hover) and (pointer: fine) and (min-width: 921px)';

export function istSchreibtisch(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    && window.matchMedia(SCHREIBTISCH).matches;
}
