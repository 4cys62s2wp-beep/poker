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
  bildschirme_liste: string[];
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

  it('lässt keine Adresse aus — wirklich keine', () => {
    /* Hier stand `filter((w) => w.inhalt)`, und `inhalt: true` heißt in
       `wege.json` „ist eine Lektion", nicht „ist ein Bildschirm". Der Lauf
       meldete brav „49 Bildschirme geprüft" und hatte dabei keinen einzigen
       Trainer gesehen, keine Startseite, keinen Tisch — und der Test
       bestätigte ihm die 49. Zwei Stellen, die dieselbe falsche Annahme
       teilten, prüfen einander nicht.

       Beim Ausweiten auf alle 90 Adressen kamen 3661 Befunde ans Licht,
       darunter der ganze Live-Bereich mit dunkler Schrift auf dunklem
       Grund (1,02 zu 1). Siehe E-039.

       Seit E-041 wird nicht mehr die Anzahl verglichen, sondern die Liste:
       Eine Zahl kann stimmen und trotzdem den falschen Ausschnitt meinen. */
    const fehlend = WEGE.wege.map((w) => w.hash)
      .filter((h) => !P.bildschirme_liste.some((b) => b === h || b.startsWith(`${h} ·`)));
    expect(fehlend, 'Nach einem neuen Bildschirm `npm run pruefen` erneut ausführen')
      .toEqual([]);
    expect(P.bildschirme).toBe(P.bildschirme_liste.length);
    /* Und die Gegenprobe zur alten Annahme: Es gibt mehr Bildschirme als
       Lektionen. Wer den Filter zurückholt, sieht es hier. */
    expect(WEGE.wege.length).toBeGreaterThan(WEGE.wege.filter((w) => w.inhalt).length);
  });

  it('sieht auch, was hinter einem Klick liegt', () => {
    /* Der Übungstisch hat unter einer Adresse zwei Bildschirme: die Auswahl
       der Tischgröße und den Tisch, auf dem gespielt wird. Bis E-041 sah der
       Lauf nur die Auswahl — und meldete trotzdem „90 Bildschirme geprüft".
       Was das gekostet hat, stand danach im hellen Modus auf dem Filz: die
       Namen der Gegner in Anthrazit auf Dunkelgrün, unter 2 zu 1. */
    expect(P.bildschirme_liste).toContain('#/lernen/uebungstisch · Tisch mit sechs Plätzen');
    expect(P.bildschirme_liste.length).toBeGreaterThan(WEGE.wege.length);
  });

  it('rechnet Deckkraft mit, nicht nur Farbe', () => {
    /* `opacity: 0.5` blendet einen ganzen Teilbaum gegen das, was dahinter
       liegt. Wer nur `color` und `background-color` liest, misst eine
       Lesbarkeit, die es auf dem Bildschirm nicht gibt: Für den Namen eines
       ausgestiegenen Gegners meldete die alte Rechnung 8,9 zu 1, gemalt
       waren es 2,4. Beim Nachrüsten kamen 303 Befunde ans Licht — an sechs
       Stellen, die alle seit Jahren so aussahen. Siehe E-041. */
    const SKRIPT = readFileSync('scripts/design-pruefen.mjs', 'utf8');
    expect(SKRIPT).toMatch(/getComputedStyle\(kette\[i\]\)\.opacity/);
    /* Und die Folge im Stilblatt: ein Wert für „tritt zurück", gemessen. */
    const gedimmt = CSS.match(/--gedimmt:\s*([\d.]+)/);
    expect(gedimmt, '--gedimmt fehlt in global.css').not.toBeNull();
    expect(Number(gedimmt![1])).toBeGreaterThanOrEqual(0.85);
    /* Kein zweiter, danebenstehender Wert: Wer eine Fläche zurücktreten
       lässt, benutzt den Token. Ausgenommen sind Übergänge (`transition`)
       und Bewegungen (`@keyframes`), die bei 0 anfangen und bei 1 enden. */
    const ohneBewegung = CSS.replace(/@keyframes[\s\S]*?\n\}/g, '');
    const streuung = [...ohneBewegung.matchAll(/^\s*opacity:\s*(0?\.\d+)\s*;/gm)]
      .map((m) => m[1]);
    expect(streuung).toEqual([]);
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
