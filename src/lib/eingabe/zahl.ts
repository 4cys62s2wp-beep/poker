/* Eine Zahl, wie ein Mensch sie eintippt.
   =======================================

   Vier Stellen der App lasen Zahlen aus einem Textfeld, alle mit derselben
   Zeile: `parseFloat(text.replace(',', '.'))`. Sie ist auf zwei Arten falsch.

   **Sie versteht die deutsche Schreibweise nicht.** Wer 1250 € Cash-out als
   „1.250" einträgt — so schreibt man das auf Deutsch —, bekommt `1.25`
   heraus. Das ist keine Fehlermeldung, sondern eine stille Verwechslung um
   den Faktor 1000. Gemessen:

   | Eingabe     | `parseFloat(replace)` | gemeint   |
   |-------------|-----------------------|-----------|
   | `1.250`     | 1,25                  | 1250      |
   | `1.234,56`  | 1,234                 | 1234,56   |
   | `1 250`     | 1                     | 1250      |
   | `1.000.000` | 1                     | 1000000   |

   **Und sie nimmt an, was keine Zahl ist.** `parseFloat('12abc')` ist 12.
   Jeder dieser Werte kommt an `isFinite(n) && n > 0` vorbei, es erscheint
   also keine Fehlermeldung — der Betrag ist einfach falsch. Im Pot-Odds-
   Rechner heißt das: ein falscher Rat, und das ist die eine Sache, für die
   es diese App gibt.

   Deshalb hier eine Funktion, die entweder eine Zahl liefert oder `null` —
   und nichts dazwischen. */

/** Das Tausendertrennzeichen der jeweiligen Sprache. */
const TRENNER = {
  de: { tausend: '.' },
  en: { tausend: ',' },
} as const;

/** Sieht die Zahl aus wie gruppiert? `1.250`, `12.345.678` — aber nicht `0.125`. */
function istGruppiert(text: string, trenner: string): boolean {
  const t = trenner === '.' ? '\\.' : trenner;
  return new RegExp(`^[1-9]\\d{0,2}(${t}\\d{3})+$`).test(text);
}

/**
 * Liest eine getippte Zahl. Gibt `null` zurück, wenn der Text keine ist —
 * dann darf die Oberfläche eine Fehlermeldung zeigen, statt weiterzurechnen.
 *
 * Leerzeichen und Währungszeichen dürfen drin stehen („1 250 €"). Sind
 * beide Trennzeichen vorhanden, entscheidet die Reihenfolge und nicht die
 * Sprache: das rechte ist das Dezimaltrennzeichen („1.234,56" wie
 * „1,234.56"). Steht nur eines da, entscheidet die Sprache — außer die
 * Zahl sieht eindeutig gruppiert aus.
 */
export function zahlAusEingabe(text: unknown, sprache: 'de' | 'en' = 'de'): number | null {
  if (typeof text !== 'string') return null;
  /* Ein Währungszeichen steht am Rand, nicht mitten in der Zahl: „12€34"
     ist keine Zahl, „1 250 €" schon. Leerzeichen und Hochkommas dagegen
     dürfen innen stehen — sie gruppieren Tausender. */
  const ohneWaehrung = text.trim().replace(/^[€$£¥]\s*/, '').replace(/\s*[€$£¥]$/, '');
  const ohneBeiwerk = ohneWaehrung.replace(/[\s\u00a0\u202f\u2009'’]/g, '');
  const zeichen = /^[+-]/.test(ohneBeiwerk) ? ohneBeiwerk[0] : '';
  const rumpf = zeichen === '' ? ohneBeiwerk : ohneBeiwerk.slice(1);
  if (rumpf === '' || !/^[\d.,]+$/.test(rumpf)) return null;

  const { tausend } = TRENNER[sprache];
  const punkte = (rumpf.match(/\./g) ?? []).length;
  const kommas = (rumpf.match(/,/g) ?? []).length;

  let normal: string;
  if (punkte > 0 && kommas > 0) {
    /* Beide da: das rechte ist das Dezimaltrennzeichen. */
    const dez = rumpf.lastIndexOf('.') > rumpf.lastIndexOf(',') ? '.' : ',';
    const gruppe = dez === '.' ? ',' : '.';
    normal = rumpf.split(gruppe).join('').replace(dez, '.');
  } else if (punkte + kommas === 0) {
    normal = rumpf;
  } else {
    const trenner = punkte > 0 ? '.' : ',';
    if (punkte + kommas > 1) {
      /* Mehr als eines derselben Sorte kann nur Gruppierung sein. */
      if (!istGruppiert(rumpf, trenner)) return null;
      normal = rumpf.split(trenner).join('');
    } else if (trenner === tausend && istGruppiert(rumpf, trenner)) {
      normal = rumpf.split(trenner).join('');
    } else {
      /* Sonst gilt es als Dezimaltrennzeichen — auch das der anderen
         Sprache: Wer in der englischen Oberfläche „12,50" tippt, meint
         zwölf fünfzig und keinen Fehler. */
      normal = rumpf.replace(trenner, '.');
    }
  }

  if (!/^\d*\.?\d*$/.test(normal) || !/\d/.test(normal)) return null;
  const wert = Number(zeichen + normal);
  return Number.isFinite(wert) ? wert : null;
}
