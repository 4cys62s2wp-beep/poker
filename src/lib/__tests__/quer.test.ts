/* Das Handy quer ist dasselbe Handy.
   =================================

   Alle anderen Läufe messen hochkant (390 × 844). Quer bleibt ein Fünftel
   der Höhe übrig — und niedrige Höhe bricht Layouts anders als schmale
   Breite. Wer am Tisch die Blindstufen laufen lässt, stellt das Gerät hin;
   wer am Übungstisch spielt, dreht es. Bis E-063 hat das nichts gemessen.

   `npm run quer` lädt jeden Bildschirm bei 844 × 390 und schreibt das
   Ergebnis nach `docs/quer.json`. Dieser Test hält es fest — und achtet
   darauf, dass die Messung wirklich quer war und alle Bildschirme umfasst. */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

interface Befund {
  adresse: string;
  art: string;
  text: string;
}
interface Quer {
  geprueft_am: string;
  breite: number;
  hoehe: number;
  leiste_max_anteil: number;
  bildschirme: number;
  hoechster_ueberlauf: number;
  hoechste_leiste: number;
  befunde_gesamt: number;
  je_art: Record<string, number>;
  befunde: Befund[];
}

const Q: Quer = JSON.parse(readFileSync('docs/quer.json', 'utf8'));
const BEDIENBAR = JSON.parse(readFileSync('docs/bedienbar.json', 'utf8')) as {
  bildschirme_liste: string[];
};

describe('Quer', () => {
  it('wurde wirklich quer gemessen', () => {
    // Sonst wäre es eine zweite Messung derselben Hochkantlage.
    expect(Q.breite).toBeGreaterThan(Q.hoehe);
    expect(Q.hoehe).toBeLessThanOrEqual(430);
  });

  it('deckt alle Bildschirme ab', () => {
    expect(Q.bildschirme).toBe(BEDIENBAR.bildschirme_liste.length);
    expect(Q.bildschirme).toBeGreaterThanOrEqual(90);
  });

  it('schiebt keinen Bildschirm zur Seite', () => {
    expect(Q.hoechster_ueberlauf).toBeLessThanOrEqual(1);
  });

  it('lässt keine feste Leiste den Bildschirm auffressen', () => {
    expect(Q.hoechste_leiste).toBeLessThanOrEqual(Q.hoehe * Q.leiste_max_anteil);
  });

  it('versteckt kein Bedienelement und lässt keinen Bildschirm leer', () => {
    expect(Q.befunde.slice(0, 10), `${Q.befunde_gesamt} Befunde`).toEqual([]);
    expect(Q.befunde_gesamt).toBe(0);
  });
});
