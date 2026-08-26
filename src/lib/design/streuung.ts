/* Verstreute Gestaltungswerte finden.
   ==================================

   Ein Designfundament nützt nichts, solange daneben in dreißig Dateien
   `marginBottom: 18` steht. Diese Datei findet solche Stellen — nicht um sie
   zu verbieten, sondern um ihre Zahl sichtbar zu machen und am Wachsen zu
   hindern.

   Warum eine Sperrklinke und kein Verbot
   --------------------------------------
   Ein Test, der sofort alle bestehenden Stellen anmahnt, wäre am ersten Tag
   rot und würde am zweiten abgeschaltet. Ein Test, der die heutige Zahl
   festhält und nur beim Wachsen anschlägt, bleibt grün und lässt den Bestand
   trotzdem nur in eine Richtung laufen.

   Was gezählt wird
   ----------------
   - Zahlenwerte in `style={{ … }}`: `padding: 14`, `fontSize: 16.5`
   - Farben als `#rrggbb` oder `rgba(…)` direkt im Quelltext
   - Die drei Stufen des Altbestands, die keine Entsprechung in der
     Fünferskala haben

   Was NICHT gezählt wird: `var(--…)`, weil das der richtige Weg ist, und
   Zahlen außerhalb von Gestaltungsangaben (Schleifen, Indizes, Logik). */

export interface Streuung {
  zahlen: number;
  farben: number;
  alteStufen: number;
}

export const ALTE_STUFEN = ['--fs-stat', '--fs-h1', '--fs-h3'] as const;

/** Alle `style={{ … }}`-Blöcke eines Quelltextes, roh. */
function stilbloecke(quelle: string): string[] {
  const aus: string[] = [];
  const marke = 'style={{';
  let i = quelle.indexOf(marke);
  while (i >= 0) {
    let tiefe = 0;
    let j = i + marke.length - 2;
    for (; j < quelle.length; j += 1) {
      if (quelle[j] === '{') tiefe += 1;
      else if (quelle[j] === '}') {
        tiefe -= 1;
        if (tiefe === 0) break;
      }
    }
    aus.push(quelle.slice(i + marke.length, j));
    i = quelle.indexOf(marke, j);
  }
  return aus;
}

export function zaehleStreuung(quelle: string): Streuung {
  let zahlen = 0;
  for (const block of stilbloecke(quelle)) {
    /* Eine Zahl als Wert einer Gestaltungsangabe: nach einem Doppelpunkt,
       nicht Teil eines Namens und nicht innerhalb von `var(--…)`. */
    const ohneVar = block.replace(/var\(--[a-z0-9-]+\)/g, 'X');
    zahlen += [...ohneVar.matchAll(/:\s*-?\d+(\.\d+)?\b/g)].length;
  }
  const farben = [...quelle.matchAll(/#[0-9a-fA-F]{3,8}\b|rgba?\(/g)].length;
  const alteStufen = ALTE_STUFEN
    .map((t) => [...quelle.matchAll(new RegExp(t.replace(/-/g, '\\-'), 'g'))].length)
    .reduce((a, b) => a + b, 0);
  return { zahlen, farben, alteStufen };
}

/** Die drei Zahlen zu einer zusammenziehen — so lässt sich eine Datei
 *  vergleichen, ohne dass ein Tausch zwischen den Sorten durchrutscht. */
export function summe(s: Streuung): number {
  return s.zahlen + s.farben + s.alteStufen;
}
