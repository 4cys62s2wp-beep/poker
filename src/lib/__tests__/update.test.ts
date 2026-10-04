/* Neue Fassung: Band, Warten, Übernehmen — im Browser gemessen (E-085).
   `npm run update` startet einen eigenen Server, ändert dessen `sw.js` und
   prüft, dass die neue Fassung wartet, ein Band erscheint, „Neu laden" sie
   übernimmt und ein fehlendes Seitenpaket nur einmal neu lädt. */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

interface Bericht {
  befunde_gesamt: number;
  befunde: Array<{ art: string; text: string }>;
  messwerte: {
    start: { steuert: boolean; band: boolean; wartend: boolean };
    wartet: { wartend: boolean; marke: string; band: boolean; text: string };
    danach: { marke: string | null; band: boolean; wartend: boolean; steuert: boolean };
    preloadFehler: { neuladungen: number };
  };
}
const B: Bericht = JSON.parse(readFileSync('docs/update.json', 'utf8'));
const M = B.messwerte;

describe('Neue Fassung', () => {
  it('hat keinen Befund', () => {
    expect(B.befunde, `${B.befunde_gesamt} Befunde`).toEqual([]);
  });

  it('zeigt bei der ersten Installation kein Band', () => {
    expect(M.start.steuert).toBe(true);
    expect(M.start.band).toBe(false);
  });

  it('lässt die neue Fassung warten, ohne die Seite neu zu laden', () => {
    expect(M.wartet.wartend).toBe(true);
    expect(M.wartet.marke).toBe('unverändert');
  });

  it('sagt es dem Nutzer', () => {
    expect(M.wartet.band).toBe(true);
    expect(M.wartet.text).toMatch(/Neue Version bereit/);
  });

  it('übernimmt sie erst auf Tipp: neue Seite, neuer Worker, kein Band', () => {
    expect(M.danach.marke).toBeNull();
    expect(M.danach.band).toBe(false);
    expect(M.danach.wartend).toBe(false);
    expect(M.danach.steuert).toBe(true);
  });

  it('lädt ein fehlendes Seitenpaket höchstens einmal neu', () => {
    expect(M.preloadFehler.neuladungen).toBe(1);
  });
});
