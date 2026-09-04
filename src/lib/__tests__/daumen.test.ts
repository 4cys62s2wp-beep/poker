/* Der Daumenlauf: Liegt das, was man tun soll, dort, wo der Daumen ist?
   ====================================================================

   `npm run pruefen` misst, ob eine Bedienfläche groß genug ist und ob sie
   Kontrast hat. Beides kann stimmen, während der Knopf trotzdem falsch
   sitzt: Eine 44 Pixel große Fläche in der Bildschirmmitte besteht jede
   dieser Prüfungen und ist einhändig trotzdem schlecht zu treffen.

   Genau das war der Zustand: Die Antwortknöpfe der sieben Trainer lagen
   dort, wo sie im Textfluss zufällig hinkamen. Dieser Test hält das
   Ergebnis von `npm run daumen` fest. */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

interface Leiste {
  oben_px: number;
  unten_px: number;
  mitte_px: number;
  im_daumenbereich: boolean;
  ohne_scrollen: boolean;
  klebt: boolean;
  knoepfe: number;
  kleinster_knopf_px: number;
  breitenanteil: number;
}

interface Messung {
  hash: string;
  scrollt: boolean;
  fensterhoehe: number;
  grenze_px: number;
  leisten: number;
  leiste: Leiste | null;
}

const D: {
  daumen_ab: number;
  bildschirme: number;
  mit_entscheidung: number;
  befunde: Array<{ hash: string; art: string; wert: number }>;
  messungen: Messung[];
} = JSON.parse(readFileSync('docs/daumen.json', 'utf8'));

const mitLeiste = D.messungen.filter((m) => m.leiste);

describe('Der Daumenlauf', () => {
  it('sieht jeden Bildschirm an', () => {
    expect(D.bildschirme).toBeGreaterThanOrEqual(90);
  });

  it('findet die Entscheidungsbildschirme', () => {
    /* Sieben Trainer, der Pot-Odds-Drill und der Übungstisch tragen eine
       Entscheidungsleiste. Weniger hieße: Einer hat sie verloren. */
    expect(D.mit_entscheidung).toBeGreaterThanOrEqual(8);
    expect(mitLeiste).toHaveLength(D.mit_entscheidung);
  });

  it('meldet keinen Befund', () => {
    expect(D.befunde).toEqual([]);
  });
});

describe('Jede Entscheidung liegt im Daumenbereich', () => {
  it('setzt die Grenze bei der halben Bildschirmhöhe', () => {
    /* DESIGN.md, Abschnitt 10: „Der Daumen erreicht die untere
       Bildschirmhälfte, mehr nicht." Die Zahl steht dort und im Lauf,
       sonst nirgends. */
    expect(D.daumen_ab).toBe(0.5);
  });

  it('legt jede Leiste in die untere Hälfte', () => {
    for (const m of mitLeiste) {
      expect(m.leiste!.im_daumenbereich, `${m.hash}: Mitte bei ${m.leiste!.mitte_px}, `
        + `Grenze ${m.grenze_px}`).toBe(true);
    }
  });

  it('lässt jede Leiste ohne Scrollen erreichen', () => {
    /* Eine Entscheidung unterhalb des Bildrands ist keine, sondern eine,
       die man findet, wenn man ohnehin schon sucht. */
    for (const m of mitLeiste) {
      expect(m.leiste!.ohne_scrollen, m.hash).toBe(true);
    }
  });

  it('lässt jede Leiste kleben, damit auch lange Aufgaben sie behalten', () => {
    /* Zwei Übungen sind länger als ein Bildschirm, und wie lang eine
       Szenario-Aufgabe wird, entscheidet der Zufall. Eine mitscrollende
       Leiste wäre dort mal erreichbar und mal nicht. */
    for (const m of mitLeiste) {
      expect(m.leiste!.klebt, m.hash).toBe(true);
    }
  });

  it('duldet nur eine Entscheidungsleiste je Bildschirm', () => {
    /* Zwei Leisten sind zwei Angebote, und dann ist keines das
       Hauptangebot. */
    for (const m of mitLeiste) {
      expect(m.leisten, m.hash).toBe(1);
    }
  });

  it('macht jeden Knopf darin mindestens eine Fingerbreite hoch', () => {
    for (const m of mitLeiste) {
      expect(m.leiste!.knoepfe, m.hash).toBeGreaterThan(0);
      expect(m.leiste!.kleinster_knopf_px, m.hash).toBeGreaterThanOrEqual(44);
    }
  });

  it('lässt die Knöpfe die Breite ausnutzen, statt sie am Rand zu lassen', () => {
    /* Ein Knopf, der die Zeile teilt, ist am Rand schlechter zu treffen als
       einer, der sie füllt. Gemessen als Anteil der Leistenbreite, den die
       Knöpfe zusammen einnehmen — Abstände dazwischen gehen ab, deshalb
       nicht 1. */
    for (const m of mitLeiste) {
      expect(m.leiste!.breitenanteil, m.hash).toBeGreaterThan(0.8);
    }
  });
});
