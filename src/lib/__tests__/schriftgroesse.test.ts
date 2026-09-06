/* Die Browser-Einstellung „Schriftgröße" muss etwas bewirken.
   ==========================================================

   Jeder Browser hat sie, und Menschen mit nachlassenden Augen benutzen sie:
   Einstellungen → Darstellung → Schriftgröße. Sie wirkt, indem der Browser
   die **Wurzel-Schriftgröße** ändert — und erreicht damit nur, was in `rem`
   oder `em` bemessen ist.

   Bis E-057 stand die gesamte Skala in `px`: 67 Deklarationen im
   Stylesheet, 47 weitere direkt in Komponenten, kein einziges `rem`.
   Gemessen mit `Page.setFontSizes` auf 24 px Standardschrift:

   | | vorher | nachher |
   |---|---|---|
   | Wurzel | 24 | 24 |
   | Fließtext | **15,5** | 23,3 |
   | Überschrift | **27** | 40,5 |
   | Kleingedrucktes | **13,5** | 20,3 |
   | Seitenhöhe einer Lektion | **5507** | 10371 |

   Vorher änderte sich außer der Wurzel nichts — die Einstellung wurde still
   ignoriert. Für eine App mit langen Lesestrecken ist das kein Randfall.

   **Warum dieser Test die Komponenten mitliest und nicht nur die Token:**
   Bei der Umstellung blieb `.page-header h1` mit
   `font-size: clamp(27px, 4.4vw, 38px)` zurück — eine Überschrift, mitten
   in einer Komponentenregel, die kein Token benutzt. Ein Test, der nur die
   fünf Stufen prüft, hätte grün gemeldet, während jede Seitenüberschrift
   weiter festgenagelt war. */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const CSS = readFileSync('src/styles/global.css', 'utf8');

/**
 * Die einzigen Größen, die in Pixeln bleiben dürfen — mit Begründung im
 * Stylesheet: Anzeigeziffern, die an der Bildschirmbreite hängen und nicht
 * am Lesebedürfnis. Sie messen schon 58 bis 220 Pixel; wer die Browserschrift
 * vergrößert, braucht den Fließtext größer, nicht diese Zahl.
 */
const ERLAUBT_IN_PX = [
  'clamp(72px, 27vw, 220px)',
  'clamp(64px, 19vw, 148px)',
  'clamp(58px, 15vw, 96px)',
];

function dateien(ordner: string, aus: string[] = []): string[] {
  for (const eintrag of readdirSync(ordner)) {
    const p = join(ordner, eintrag);
    if (statSync(p).isDirectory()) dateien(p, aus);
    else if (p.endsWith('.tsx')) aus.push(p);
  }
  return aus;
}

describe('Schriftgrößen wachsen mit der Browser-Einstellung', () => {
  it('bemisst die fünf Stufen in rem', () => {
    const stufen = ['--fs-ergebnis', '--fs-ueberschrift', '--fs-fliesstext',
      '--fs-beschriftung', '--fs-kleingedrucktes'];
    for (const stufe of stufen) {
      const wert = CSS.match(new RegExp(`${stufe}:\\s*([^;]+);`))?.[1] ?? '';
      expect(wert, `${stufe} fehlt`).toBeTruthy();
      expect(wert.includes('rem'), `${stufe} = „${wert}" — ohne rem wirkt die `
        + 'Browser-Einstellung nicht').toBe(true);
      expect(/\d+(\.\d+)?px/.test(wert), `${stufe} = „${wert}" enthält noch px`).toBe(false);
    }
  });

  it('nagelt auch in keiner Komponentenregel eine Schriftgröße fest', () => {
    const fest = [...CSS.matchAll(/font-size:\s*([^;]+);/g)]
      .map((m) => m[1].trim())
      .filter((wert) => /\d+(\.\d+)?px/.test(wert))
      .filter((wert) => !ERLAUBT_IN_PX.includes(wert));
    expect(fest, 'Schriftgrößen in px wachsen nicht mit. Entweder in rem '
      + 'umrechnen (Wert ÷ 16) oder in ERLAUBT_IN_PX begründen.').toEqual([]);
  });

  it('nagelt auch im Quelltext der Bildschirme keine fest', () => {
    /* `fontSize: 17` in einem Style-Objekt wird von React zu 17px. */
    const fest: string[] = [];
    for (const datei of [...dateien('src/pages'), ...dateien('src/components')]) {
      const text = readFileSync(datei, 'utf8');
      for (const m of text.matchAll(/fontSize:\s*(\d+(?:\.\d+)?|'[^']*px')/g)) {
        fest.push(`${datei}: fontSize: ${m[1]}`);
      }
    }
    expect(fest.slice(0, 10), `${fest.length} Stellen`).toEqual([]);
  });

  it('erkennt eine px-Angabe (die Prüfung prüft sich selbst)', () => {
    const probe = 'font-size: 14px;';
    const gefunden = [...probe.matchAll(/font-size:\s*([^;]+);/g)]
      .map((m) => m[1].trim())
      .filter((w) => /\d+(\.\d+)?px/.test(w))
      .filter((w) => !ERLAUBT_IN_PX.includes(w));
    expect(gefunden).toEqual(['14px']);
  });
});
