/* Kontrast nach WCAG 2.1, gerechnet statt behauptet.
   ==================================================

   Eine Farbe „gut lesbar" zu nennen ist eine Meinung. Das Verhältnis
   zwischen zwei Helligkeiten ist eine Zahl, und die lässt sich prüfen.

   Warum das hier liegt und nicht nur im Test: Wer eine neue Farbe einträgt,
   soll sie ausrechnen können, ohne einen Test zu schreiben. */

/** Eine Farbe als `#rrggbb` oder `#rgb` in ihre Anteile zerlegen. */
export function kanaele(farbe: string): [number, number, number] {
  const roh = farbe.trim().replace('#', '');
  const voll = roh.length === 3 ? roh.split('').map((z) => z + z).join('') : roh;
  if (!/^[0-9a-fA-F]{6}$/.test(voll)) {
    throw new Error(`"${farbe}" ist keine Farbe in der Form #rrggbb`);
  }
  return [0, 2, 4].map((i) => parseInt(voll.slice(i, i + 2), 16) / 255) as [number, number, number];
}

/** Relative Helligkeit nach WCAG. Die Beiwerte stehen so in der Norm. */
export function helligkeit(farbe: string): number {
  const [r, g, b] = kanaele(farbe).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Kontrastverhältnis zweier Farben. 1 heißt gleich, 21 ist das Höchste
 *  (Schwarz gegen Weiß). Die Reihenfolge der Farben ist ohne Belang. */
export function kontrast(a: string, b: string): number {
  const [hell, dunkel] = [helligkeit(a), helligkeit(b)].sort((x, y) => y - x);
  return (hell + 0.05) / (dunkel + 0.05);
}

/** Was die App verlangt.
 *
 *  7 zu 1 für Ergebniszahlen: Sie werden am Tisch gelesen, oft mit dem
 *  Handy flach auf der Tischplatte und mit Licht von der Seite. Die Norm
 *  verlangt für großen Text weniger, aber „groß" hilft nicht gegen
 *  Spiegelungen.
 *
 *  4,5 zu 1 für alles Übrige — das ist AA für normalen Text. */
export const KONTRAST_ERGEBNIS = 7;
export const KONTRAST_UEBRIG = 4.5;
