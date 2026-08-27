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

/** Eine Farbe mit Alpha, wie sie in `rgba(...)` steht. */
export interface MitAlpha {
  rgb: [number, number, number];
  alpha: number;
}

/** `#rrggbb` oder `rgba(r, g, b, a)` in Anteile und Deckkraft zerlegen. */
export function zerlege(farbe: string): MitAlpha {
  const roh = farbe.trim();
  const m = roh.match(/^rgba?\(([^)]+)\)$/i);
  if (m) {
    const teile = m[1].split(/[,/]/).map((x) => Number.parseFloat(x.trim()));
    if (teile.length < 3 || teile.slice(0, 3).some(Number.isNaN)) {
      throw new Error(`"${farbe}" ist kein lesbares rgb/rgba`);
    }
    return {
      rgb: [teile[0], teile[1], teile[2]],
      alpha: teile.length > 3 && !Number.isNaN(teile[3]) ? teile[3] : 1,
    };
  }
  const [r, g, b] = kanaele(roh).map((x) => x * 255);
  return { rgb: [r, g, b], alpha: 1 };
}

/** Als `#rrggbb` zurückschreiben. */
export function alsHex(rgb: [number, number, number]): string {
  return `#${rgb.map((x) => Math.round(Math.min(255, Math.max(0, x)))
    .toString(16).padStart(2, '0')).join('')}`;
}

/**
 * Eine durchscheinende Farbe auf einen Grund legen.
 *
 * Nötig, weil die gedämpften Flächen (`--ok-dim` und Verwandte) als `rgba`
 * über der Kartenfläche liegen. Ihr Kontrast gegen den Text darauf lässt sich
 * nur ausrechnen, wenn man vorher weiß, welche Farbe dabei herauskommt —
 * sonst prüfte man eine Farbe, die so nie auf dem Bildschirm steht.
 */
export function legeAuf(oben: string, unten: string): string {
  const o = zerlege(oben);
  const u = zerlege(unten);
  return alsHex([0, 1, 2].map(
    (i) => o.rgb[i] * o.alpha + u.rgb[i] * (1 - o.alpha),
  ) as [number, number, number]);
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
