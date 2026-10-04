/* Doppelte Schriftgröße (E-101): Das Protokoll von `npm run gross`.

   Bei 32 statt 16 Pixel Standardschrift darf keine Seite waagerecht überlaufen,
   kein Titel gekürzt sein, keine klebende Leiste mehr als 45 % der Höhe füllen und
   keine Spielkarte unter der Antwort-Leiste liegen. Die Zeile „Doppelte Schrift:
   Drill“ im Durchgang prüft die Auflösung nach der Antwort. */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { HOCH_ANTEIL, istZuHoch } from '../leisten';

interface Gross {
  schrift: string;
  bildschirme: number;
  hoechster_ueberlauf: number;
  hoechste_leiste: number;
  leiste_max_anteil: number;
  hoehe: number;
  befunde_gesamt: number;
  befunde: Array<{ adresse: string; art: string; text: string }>;
}

const G: Gross = JSON.parse(readFileSync('docs/gross.json', 'utf8'));
const D = JSON.parse(readFileSync('docs/durchgang.json', 'utf8')) as {
  schritte: Array<{ name: string; ergebnis: Record<string, number> | null }>;
};

describe('Doppelte Schriftgröße', () => {
  it('hat alle Bildschirme bei 200 % gemessen', () => {
    expect(G.schrift).toBe('200%');
    expect(G.bildschirme).toBeGreaterThanOrEqual(130);
  });

  it('findet nichts', () => {
    expect(G.befunde, JSON.stringify(G.befunde.slice(0, 5))).toEqual([]);
    expect(G.befunde_gesamt).toBe(0);
  });

  it('keine Seite läuft über, keine Leiste füllt den Bildschirm', () => {
    expect(G.hoechster_ueberlauf).toBeLessThanOrEqual(1);
    expect(G.hoechste_leiste).toBeLessThanOrEqual(G.hoehe * G.leiste_max_anteil);
  });

  it('die Leiste klebt nur, solange sie weniger als 40 % füllt (die Messlatte liegt darüber)', () => {
    expect(HOCH_ANTEIL).toBeLessThan(G.leiste_max_anteil);
  });
});

describe('Wann eine Leiste nicht mehr klebt', () => {
  it('ab mehr als 40 % der Fensterhöhe', () => {
    expect(istZuHoch(300, 844)).toBe(false);
    expect(istZuHoch(337, 844)).toBe(false);
    expect(istZuHoch(338, 844)).toBe(true);
    expect(istZuHoch(409, 844)).toBe(true);
  });

  it('ein Fenster ohne Höhe löst nichts aus', () => {
    expect(istZuHoch(100, 0)).toBe(false);
  });
});

describe('Drill bei doppelter Schrift (Durchgang)', () => {
  const m = D.schritte.find((s) => s.name.startsWith('Doppelte Schrift: Drill'))?.ergebnis;

  it('lief wirklich mit 32 Pixel Wurzelschrift', () => {
    expect(m?.schrift_px).toBe(32);
  });

  it('die Auflösung läuft nicht über und endet über der Leiste', () => {
    expect(m?.breit).toBeLessThanOrEqual(0);
    expect(m?.ende_ueber_leiste).toBeGreaterThanOrEqual(0);
  });
});
