/* Bedienbar ohne Maus, verständlich ohne Blick.
   ===========================================

   `npm run pruefen` misst Kontrast und Tippflächen — das Sehen und das
   Tippen. Zwei andere Arten, diese App zu benutzen, waren bis E-043 von
   keiner Zahl gedeckt, und in beiden war sie kaputt:

   - **Tastatur.** Es gab drei Fokusregeln (Matrix, Zelle, Herkunftszeichen)
     und sonst keine. Auf 55 von 90 Bildschirmen zeigte das Weiterspringen
     mit Tab nichts an.
   - **Vorlesegerät.** Fünf Bedienelemente hatten keinen Namen oder nur
     einen Platzhalter, der beim ersten Zeichen verschwindet.

   Dieser Test hält das Ergebnis von `npm run bedienbar` fest. */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

interface Stelle {
  sprache: string;
  art: string;
  marke: string;
  bildschirme: string[];
  beispiel: Record<string, unknown>;
}

interface Bedienbar {
  geprueft_am: string;
  breite: number;
  sprachen: string[];
  bildschirme_liste: string[];
  bildschirme: number;
  messungen: number;
  fokusziele_geprueft: number;
  befunde_gesamt: number;
  stellen_gesamt: number;
  je_art: Array<{ art: string; anzahl: number }>;
  stellen: Stelle[];
}

const B: Bedienbar = JSON.parse(readFileSync('docs/bedienbar.json', 'utf8'));
const WEGE = JSON.parse(readFileSync('docs/wege.json', 'utf8')) as {
  wege: Array<{ hash: string }>;
};
const CSS = readFileSync('src/styles/global.css', 'utf8');
const SKRIPT = readFileSync('scripts/bedienbar-pruefen.mjs', 'utf8');

describe('Der Lauf misst das Richtige', () => {
  it('sieht jede Adresse', () => {
    const fehlend = WEGE.wege.map((w) => w.hash)
      .filter((h) => !B.bildschirme_liste.includes(h));
    expect(fehlend, 'Nach einem neuen Bildschirm `npm run bedienbar` erneut ausführen')
      .toEqual([]);
  });

  it('läuft über beide Sprachen', () => {
    /* Die Namen der Bedienelemente und die Sprache des Dokuments hängen
       daran; ein Lauf über die eine sagt über die andere nichts. */
    expect(B.sprachen).toEqual(['de', 'en']);
    expect(B.messungen).toBe(B.bildschirme * B.sprachen.length);
  });

  it('springt wirklich Bedienelemente an', () => {
    /* Ohne diese Zahl sähe ein Lauf, der aus Versehen nichts prüft,
       genauso aus wie einer, der nichts findet. */
    expect(B.fokusziele_geprueft).toBeGreaterThan(300);
  });

  it('prüft je Bildschirm mehrere Bauformen, nicht nur die erste', () => {
    /* Der erste Knopf ist auf 55 von 90 Bildschirmen derselbe — der
       Rückweg. Eine Regel, die nur ihn trifft, sähe grün aus, während
       jede Bauform darunter weiter unsichtbar bliebe. */
    expect(B.fokusziele_geprueft).toBeGreaterThan(B.messungen);
    expect(SKRIPT).toContain('nachBauform');
  });

  it('gegengeprüft: ohne Fokusregel wird der Lauf rot', () => {
    /* Nachgewiesen, nicht behauptet: Mit ausgeschalteter Regel meldete der
       Lauf 66× den Rückweg, 51× den Hauptknopf, 22× den kleinen Link, 9×
       die Lektionskarte. Die Regel selbst steht hier — verschwindet sie,
       fällt es hier auf, ohne dass jemand den Lauf starten muss. */
    expect(CSS).toMatch(/:focus-visible\s*\{[^}]*outline:/);
    expect(CSS).toContain(':focus:not(:focus-visible)');
  });
});

describe('Was der Lauf findet', () => {
  it('findet kein Bedienelement ohne Namen', () => {
    const ohne = B.stellen.filter((s) => s.art === 'bedienelement-ohne-namen');
    expect(ohne.map((s) => `${s.sprache} ${s.marke}`)).toEqual([]);
  });

  it('findet kein Feld, das nur einen Platzhalter als Namen hat', () => {
    /* Ein Platzhalter verschwindet beim ersten Zeichen — danach heißt das
       Feld „Eingabefeld". */
    const nur = B.stellen.filter((s) => s.art === 'nur-platzhalter-statt-namen');
    expect(nur.map((s) => `${s.sprache} ${s.marke}: ${s.beispiel.text}`)).toEqual([]);
  });

  it('findet keinen unsichtbaren Fokus', () => {
    const blind = B.stellen.filter((s) => s.art === 'fokus-nicht-sichtbar');
    expect(blind.map((s) => `${s.sprache} ${s.marke}`)).toEqual([]);
  });

  it('findet keine zerrissene Überschriftengliederung', () => {
    const gliederung = B.stellen.filter((s) => s.art.startsWith('ueberschrift')
      || s.art === 'keine-h1' || s.art === 'mehr-als-eine-h1'
      || s.art === 'gliederung-beginnt-nicht-bei-h1');
    expect(gliederung.map((s) => `${s.sprache} ${s.art} ${s.marke}`)).toEqual([]);
  });

  it('findet keine doppelte Kennung und kein Bild ohne Alternative', () => {
    const rest = B.stellen.filter((s) => ['doppelte-kennung', 'bild-ohne-alt',
      'nicht-genau-ein-hauptbereich', 'dokumentsprache-falsch'].includes(s.art));
    expect(rest.map((s) => `${s.sprache} ${s.art} ${s.marke}`)).toEqual([]);
  });

  it('findet kein Deutsch in der englischen Oberfläche', () => {
    /* So gefunden: „150 XP to Küchentisch-Spieler" — die Rangnamen gab es
       nur auf Deutsch. */
    const leck = B.stellen.filter((s) => s.art === 'deutsch-in-englischer-oberflaeche');
    expect(leck.map((s) => String(s.beispiel.text))).toEqual([]);
  });

  it('hat überhaupt keine Befunde', () => {
    expect(B.befunde_gesamt).toBe(0);
  });
});
