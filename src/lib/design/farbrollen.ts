/* Welche Rolle jeder Farbtoken spielt.
   ===================================

   Ein Kontrastwert ist nur dann eine Aussage, wenn klar ist, **was auf was**
   liegt. „`--ok-dim` erreicht 1,2 zu 1" ist keine Beanstandung, sondern ein
   Missverständnis: Der Token ist eine Fläche, kein Text.

   Diese Datei sagt für jeden farbigen Token, wofür er da ist. Sie ist damit
   zweierlei: die Grundlage der Prüfung in `farbmodi.test.ts` und die
   Antwort auf die Frage, die man sich beim Lesen von `global.css` sonst
   selbst zusammenreimen muss.

   Was hier **nicht** steht, sind Farbwerte. Die stehen einmal je Modus im
   Stilblatt. */

/** Die Flächen, auf denen Text stehen kann. */
export const FLAECHEN = [
  '--bg', '--bg-deep', '--bg-elev', '--bg-card', '--bg-card-hover',
] as const;

/** Text, der die 7-zu-1-Grenze halten muss: die Ergebniszahlen. */
export const TEXT_ERGEBNIS = ['--ergebnis-gut', '--ergebnis-schlecht'] as const;

/** Text auf den normalen Flächen, 4,5 zu 1. */
export const TEXT_NORMAL = [
  '--text', '--text-dim', '--text-faint', '--text-stark',
  '--akzent', '--auszeichnung',
] as const;

/**
 * Text, der auf einer **gedämpften Fläche** steht, nicht auf dem nackten
 * Grund: die farbigen Marken (`.pill.ok` und Verwandte). Die gedämpfte
 * Fläche ist durchscheinend — was darunter liegt, entscheidet mit.
 */
export const TEXT_AUF_GEDAEMPFT: ReadonlyArray<readonly [vorne: string, gedaempft: string]> = [
  ['--ok-lesbar', '--ok-dim'],
  ['--danger-lesbar', '--danger-dim'],
  ['--info-lesbar', '--info-dim'],
  ['--warn-lesbar', '--warn-dim'],
  ['--kategorie-sozial-lesbar', '--kategorie-sozial-schwach'],
  ['--auszeichnung-lesbar', '--auszeichnung-schwach'],
] as const;

/**
 * Tokens, die keine Textfarbe sind und deshalb keine Kontrastgrenze haben:
 * Flächen, Rahmen, Schleier, Verläufe, Knopffüllungen.
 *
 * Sie stehen hier trotzdem, und zwar vollständig: Der Test rechnet nach, dass
 * jeder farbige Token in genau einer Rolle vorkommt. Ein Token, den niemand
 * eingeordnet hat, fiele sonst durch die Prüfung, ohne dass es auffällt.
 */
export const OHNE_TEXTGRENZE = [
  '--border', '--border-strong',
  '--akzent-dim', '--accent-live-dim',
  '--ok', '--ok-dim', '--danger', '--danger-dim', '--info', '--info-dim',
  '--warn', '--warn-dim',
  '--kategorie-sozial', '--kategorie-sozial-schwach',
  '--auszeichnung-schwach', '--auszeichnung-tief',
  '--auszeichnung-a28', '--auszeichnung-a30', '--auszeichnung-a40',
  '--auszeichnung-a45', '--auszeichnung-lesbar-a35',
  '--auszeichnung-verlauf-hell', '--auszeichnung-verlauf-tief',
  '--flaeche-tisch', '--flaeche-tisch-hell', '--flaeche-tisch-tief',
  '--flaeche-tisch-verlauf-hell', '--flaeche-tisch-verlauf-tief',
  '--veil-1', '--veil-2', '--veil-3',
  '--scrim', '--scrim-strong',
  '--lift-hi', '--lift-shadow',
  '--focus-ring',
] as const;
