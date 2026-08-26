/* Der Einsatz als Bruch.
   =====================

   B2 gibt jede Einsatzgröße doppelt an: als Dezimalzahl
   (`einsatz_als_potanteil`) und als Bruch (`einsatz_als_bruch`). Das ist
   keine Doppelung aus Bequemlichkeit — aus 0,3333… lässt sich kein glatter
   Einsatz bilden, aus 1/3 schon: Der Topf muss nur durch drei teilbar sein.

   Weil beide Darstellungen dasselbe meinen müssen, gehört die Zerlegung
   hierher und nicht in den Aufgabengenerator: Die Prüfung beim Laden braucht
   sie genauso. */

/** Zerlegt `"3/4"` in Zähler und Nenner. `"2"` wird zu 2/1. */
export function bruchTeile(bruch: string): { zaehler: number; nenner: number } {
  const teile = bruch.split('/');
  const zaehler = Number(teile[0]);
  const nenner = teile.length > 1 ? Number(teile[1]) : 1;
  if (teile.length > 2
      || !Number.isInteger(zaehler) || !Number.isInteger(nenner)
      || nenner <= 0 || zaehler <= 0) {
    throw new Error(`Einsatz-Bruch "${bruch}" ist kein Bruch aus zwei positiven ganzen Zahlen`);
  }
  return { zaehler, nenner };
}
