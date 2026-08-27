/* Das Designfundament am gerenderten Ergebnis.
   ==========================================

   `npm run streuung` zählt verstreute Werte im Quelltext. Zwei Dinge kann
   diese Zählung nicht sehen, und beide entscheiden, ob jemand die App am
   Tisch benutzen kann:

   - **Kontrast.** Im Quelltext steht `color: var(--text-dim)`. Ob das lesbar
     ist, hängt davon ab, worauf es liegt — und das steht in einer anderen
     Datei, oft zwei Ebenen weiter oben, manchmal unter einem Verlauf.
   - **Tippflächen.** Im Quelltext steht `min-height: var(--tipp-min)`. Ob
     der Knopf am Ende 44 Pixel hoch ist, entscheidet die Zeile, in der er
     steht.

   `npm run pruefen` misst deshalb beides an der laufenden App, bei 390
   Pixeln, über alle Bildschirme. Dieser Test hält das Ergebnis fest — und
   prüft nach, dass die Grenzwerte im Messskript dieselben sind wie im Code. */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { KONTRAST_ERGEBNIS, KONTRAST_UEBRIG, kontrast } from '../design/kontrast';

interface Stelle {
  art: string;
  marke: string;
  bildschirme: string[];
  beispiel: Record<string, unknown>;
}

interface Pruefung {
  geprueft_am: string;
  breite: number;
  grenzwerte: {
    kontrast_ergebnis: number;
    kontrast_uebrig: number;
    ergebnis_ab_px: number;
    tipp_min_px: number;
    tipp_abstand_px: number;
  };
  modi: string[];
  bildschirme: number;
  messungen: number;
  befunde_gesamt: number;
  stellen_gesamt: number;
  je_art: Array<{ art: string; anzahl: number }>;
  stellen: Stelle[];
}

const P: Pruefung = JSON.parse(readFileSync('docs/pruefung.json', 'utf8'));
const WEGE = JSON.parse(readFileSync('docs/wege.json', 'utf8')) as {
  wege: Array<{ hash: string; inhalt: boolean }>;
};
const CSS = readFileSync('src/styles/global.css', 'utf8');

describe('Die Prüfung misst das Richtige', () => {
  it('benutzt dieselben Grenzwerte wie der Code', () => {
    /* Zwei Stellen mit derselben Zahl driften auseinander. Hier fällt es auf. */
    expect(P.grenzwerte.kontrast_ergebnis).toBe(KONTRAST_ERGEBNIS);
    expect(P.grenzwerte.kontrast_uebrig).toBe(KONTRAST_UEBRIG);

    const tipp = CSS.match(/--tipp-min:\s*(\d+)px/);
    expect(tipp, '--tipp-min fehlt in global.css').not.toBeNull();
    expect(P.grenzwerte.tipp_min_px).toBe(Number(tipp![1]));

    const abstand = CSS.match(/--tipp-abstand:\s*(\d+)px/);
    expect(abstand, '--tipp-abstand fehlt in global.css').not.toBeNull();
    expect(P.grenzwerte.tipp_abstand_px).toBe(Number(abstand![1]));
  });

  it('rechnet Kontrast so wie kontrast.ts', () => {
    /* Das Messskript läuft im Browser und kann kein Modul der App laden, also
       steht die WCAG-Formel dort ein zweites Mal. Hier wird verglichen. */
    expect(kontrast('#ffffff', '#000000')).toBeCloseTo(21, 2);
    expect(kontrast('#c43e38', '#e9e5d7')).toBeCloseTo(4.07, 2);
    expect(kontrast('#b43934', '#e9e5d7')).toBeGreaterThanOrEqual(KONTRAST_UEBRIG);
    expect(kontrast('#28723b', '#e9e5d7')).toBeGreaterThanOrEqual(KONTRAST_UEBRIG);
  });

  it('misst bei der Breite, für die die App gebaut ist', () => {
    expect(P.breite).toBeLessThanOrEqual(430);
  });

  it('lässt keinen Bildschirm aus', () => {
    const erwartet = WEGE.wege.filter((w) => w.inhalt).length;
    expect(P.bildschirme, 'Nach einem neuen Bildschirm `npm run pruefen` erneut ausführen')
      .toBe(erwartet);
  });

  it('misst beide Farbmodi, nicht nur den eingestellten', () => {
    /* Ein Lauf über den dunklen Satz sagt nichts über den hellen — und der
       helle ist der, den niemand von uns täglich sieht. Genau dort ist der
       Fehler aufgetaucht, den dieser Lauf gefunden hat: dunkle Schrift auf
       dunklem Gold, 2,76 zu 1. */
    expect(P.modi).toEqual(['dunkel', 'hell']);
    expect(P.messungen).toBe(P.bildschirme * P.modi.length);
  });
});

describe('Was die Prüfung findet', () => {
  it('findet keinen Text unter der Kontrastgrenze', () => {
    const schlecht = P.stellen.filter((s) => s.art === 'kontrast-zu-gering');
    expect(schlecht.map((s) => `${s.marke} (${s.beispiel.verhaeltnis} statt ${s.beispiel.noetig})`))
      .toEqual([]);
  });

  it('findet keine Bedienfläche unter einer Fingerbreite', () => {
    const klein = P.stellen.filter((s) => s.art === 'tippflaeche-zu-klein');
    expect(klein.map((s) => `${s.marke} (${s.beispiel.breite_px}×${s.beispiel.hoehe_px})`))
      .toEqual([]);
  });

  it('findet keine zwei Bedienflächen ohne Abstand', () => {
    /* Zwei Flächen, die sich berühren, sind eine Fläche mit zwei
       Bedeutungen: Ein Tipp knapp neben der Mitte landet auf dem Nachbarn,
       und der Nutzer erfährt nie, warum er auf einmal woanders ist. */
    const eng = P.stellen.filter((s) => s.art === 'tippflaechen-zu-eng');
    expect(eng.map((s) => `${s.marke} (${s.beispiel.abstand_px} px)`)).toEqual([]);
  });

  it('findet keinen seitlichen Überlauf', () => {
    /* Waagerecht scrollen heißt auf einem Handy: Die Hälfte des Satzes ist
       weg, und niemand merkt es. */
    expect(P.stellen.filter((s) => s.art === 'seitlicher-ueberlauf')).toEqual([]);
  });

  it('bleibt insgesamt bei null', () => {
    /* Eine Sperrklinke wäre hier zu nachsichtig: Wir stehen bei null, und ab
       null ist jeder neue Befund eine Verschlechterung, die jemand bemerkt
       hat, bevor ein Nutzer sie bemerkt. */
    expect(P.befunde_gesamt).toBe(0);
  });
});
