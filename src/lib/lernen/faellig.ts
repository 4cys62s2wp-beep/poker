/* Wann etwas fällig ist, in Worten.
   =================================

   Die Wiederholungsseite nannte das Datum als `2026-10-05`: die Schreibweise
   des Speichers, nicht die eines Menschen. Gesagt wird, wie weit es weg ist. */

/** Ganze Kalendertage von `heute` bis `faellig` (beides `JJJJ-MM-TT`). */
export function tageBis(faellig: string, heute: string): number {
  const [j1, m1, t1] = heute.split('-').map(Number);
  const [j2, m2, t2] = faellig.split('-').map(Number);
  /* UTC, damit die Zeitumstellung keinen Tag verschluckt oder verdoppelt. */
  return Math.round((Date.UTC(j2, m2 - 1, t2) - Date.UTC(j1, m1 - 1, t1)) / 86_400_000);
}
