/* Der Rahmen um die Seiten — gemessen, nicht behauptet (E-082).
   ============================================================

   `npm run rahmen` lädt die gebaute App in einem echten Browser und misst, was
   nur ein Browser sieht: ob die Kopfzeile nach dem Scrollen wirklich bei y = 0
   liegt, ob Zurück an die alte Stelle führt, ob die Seitenleiste genau einen
   aktiven Eintrag hat, ob Seiten zentriert stehen und ob eine Meldung die Marke
   verdeckt. Dieser Test hält das Ergebnis fest. */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

interface Rahmen {
  befunde_gesamt: number;
  befunde: Array<{ bereich: string; wo: string; text: string }>;
  messwerte: {
    kopfzeile: Array<{ adresse: string; seitenhoehe: number; gescrollt: number; titel: string; rueckweg: string }>;
    lesefortschritt: { oben: number; unten: number };
    scroll: { vorher: number; neueSeite: number; zurueck: number; vorwaertsErneut: number };
    quer: { position: string };
    meldung: { top: number; kopfUnten: number; ueberMarke: boolean; ueberDu: boolean };
    seitenleiste: { seiten: number };
    fussleiste: Array<{ hoehe: number; unten: number; legalUnten: number; duOben: number }>;
    zentrierung: Array<{ adresse: string; rand: { links: number; rechts: number } }>;
    startseite: { linksX: number; rechtsX: number };
  };
}

const R: Rahmen = JSON.parse(readFileSync('docs/rahmen.json', 'utf8'));
const M = R.messwerte;

describe('Rahmen', () => {
  it('hat keinen Befund', () => {
    expect(R.befunde.slice(0, 10), `${R.befunde_gesamt} Befunde`).toEqual([]);
  });

  it('hat die Kopfzeile auf wirklich langen Seiten geprüft', () => {
    /* Sonst wäre „klebt" auf einer Seite gemessen, die gar nicht scrollt. */
    expect(M.kopfzeile.length).toBeGreaterThanOrEqual(4);
    for (const s of M.kopfzeile) {
      expect(s.seitenhoehe, s.adresse).toBeGreaterThan(2500);
      expect(s.gescrollt, s.adresse).toBeGreaterThanOrEqual(1000);
      expect(s.titel, s.adresse).not.toBe('');
      expect(s.rueckweg, s.adresse).not.toBe('');
    }
  });

  it('klebt quer nicht (ein Sechstel der Höhe wäre zu viel)', () => {
    expect(M.quer.position).toBe('static');
  });

  it('zeigt in der Lektion, wie weit man ist', () => {
    expect(M.lesefortschritt.oben).toBeLessThan(0.05);
    expect(M.lesefortschritt.unten).toBeGreaterThan(0.95);
  });

  it('öffnet neue Seiten oben und führt zurück an die alte Stelle', () => {
    expect(M.scroll.vorher).toBeGreaterThan(1000);
    expect(M.scroll.neueSeite).toBeLessThanOrEqual(1);
    expect(Math.abs(M.scroll.zurueck - M.scroll.vorher)).toBeLessThanOrEqual(4);
    expect(M.scroll.vorwaertsErneut).toBeLessThanOrEqual(1);
  });

  it('legt Meldungen unter die Kopfzeile', () => {
    expect(M.meldung.top).toBeGreaterThanOrEqual(M.meldung.kopfUnten);
    expect(M.meldung.ueberMarke || M.meldung.ueberDu).toBe(false);
  });

  it('hat die Seitenleiste auf mindestens 24 Seiten geprüft und die Fußzeile bei zwei Höhen', () => {
    expect(M.seitenleiste.seiten).toBeGreaterThanOrEqual(24);
    expect(new Set(M.fussleiste.map((f) => f.hoehe))).toEqual(new Set([860, 768]));
    for (const f of M.fussleiste) {
      expect(f.unten).toBeLessThanOrEqual(f.hoehe);
      expect(f.legalUnten).toBeLessThanOrEqual(f.hoehe);
      expect(f.duOben).toBeGreaterThan(0);
    }
  });

  it('zentriert jede Seite bei 1920 Pixeln und teilt die Startseite in zwei Spalten', () => {
    expect(M.zentrierung.length).toBeGreaterThanOrEqual(15);
    for (const z of M.zentrierung) {
      expect(Math.abs(z.rand.links - z.rand.rechts), z.adresse).toBeLessThanOrEqual(3);
    }
    expect(M.startseite.rechtsX).toBeGreaterThan(M.startseite.linksX + 100);
  });
});
