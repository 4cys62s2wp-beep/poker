/* Wo in einer Lektion man gerade liest.
   =====================================

   Eine Lektion ist im Schnitt 922 Wörter und 5600 Pixel lang. Wer unterwegs
   aufhört, begann beim nächsten Mal wieder oben, und die Startseite konnte
   nichts über den Stand sagen — sie darf keine Zahl nennen, die niemand
   erhoben hat (E-032). Jetzt wird der Abschnitt beim Lesen **gemessen**:
   Gespeichert wird der zuletzt erreichte, nie ein früherer. */

/** Der Anteil der Fensterhöhe, ab dem eine Überschrift als „erreicht" gilt:
 *  Sie ist ins obere Drittel gewandert, also liest man dort. */
export const LESELINIE = 0.4;

/**
 * Welcher Abschnitt wird gerade gelesen?
 *
 * @param oberkanten Abstand der Überschriften zum oberen Fensterrand, in
 *        Reihenfolge des Textes (negativ = schon vorbei).
 * @param fensterhoehe Höhe des Fensters.
 * @param amEnde ob bis ans Seitenende gescrollt ist — dann gilt der letzte
 *        Abschnitt, auch wenn er zu kurz ist, um die Linie je zu erreichen.
 * @returns Index des Abschnitts (0-basiert).
 */
export function abschnittAus(oberkanten: number[], fensterhoehe: number, amEnde: boolean): number {
  if (oberkanten.length === 0) return 0;
  if (amEnde) return oberkanten.length - 1;
  let aktuell = 0;
  for (let i = 0; i < oberkanten.length; i += 1) {
    if (oberkanten[i] <= fensterhoehe * LESELINIE) aktuell = i;
  }
  return aktuell;
}
