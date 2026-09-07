/* Der Offline-Betrieb ist ein Versprechen, kein Nebeneffekt.
   =========================================================

   PokerMentor lässt sich installieren, hält die Daten auf dem Gerät und
   soll im Zug funktionieren. Gemessen hat das bis E-052 nichts: Der
   Durchgang prüft, wie schnell die **Startseite** ohne Netz kommt, aber
   nicht, ob die anderen 89 Bildschirme dann noch etwas zeigen.

   `npm run ohnenetz` lädt jeden Bildschirm bei abgeschaltetem Netz wirklich
   neu und schreibt das Ergebnis nach `docs/ohnenetz.json`. Dieser Test hält
   es fest — und achtet vor allem darauf, dass die Messung **echt** war:
   Ohne aktiven Service Worker wäre sie wertlos, und ohne die volle Zahl an
   Bildschirmen hätte jemand die Liste verkürzt statt den Fehler behoben. */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

interface Befund { adresse: string; art: string; text: string }
interface OhneNetz {
  geprueft_am: string;
  grund: string;
  breite: number;
  service_worker_aktiv: boolean;
  kern_dateien_im_speicher: number;
  gebaute_dateien: number;
  gebaute_dateien_im_speicher: number;
  bildschirme: number;
  geladen: number;
  befunde_gesamt: number;
  je_art: Record<string, number>;
  befunde: Befund[];
}

const O: OhneNetz = JSON.parse(readFileSync('docs/ohnenetz.json', 'utf8'));
const BEDIENBAR = JSON.parse(readFileSync('docs/bedienbar.json', 'utf8')) as { bildschirme_liste: string[] };

describe('Ohne Netz', () => {
  it('wurde mit einem laufenden Service Worker gemessen', () => {
    /* Auf `localhost` meldet sich der Worker nicht an (`main.tsx`). Eine
       Messung ohne ihn ist grün, weil ein Hash-Wechsel nichts nachlädt —
       und sagt damit nichts. */
    expect(O.service_worker_aktiv).toBe(true);
    expect(O.grund).not.toContain('localhost');
  });

  it('deckt alle Bildschirme ab', () => {
    expect(O.bildschirme).toBe(BEDIENBAR.bildschirme_liste.length);
    expect(O.bildschirme).toBeGreaterThanOrEqual(90);
  });

  it('lädt jeden Bildschirm auch ohne Netz', () => {
    expect(O.geladen).toBe(O.bildschirme);
  });

  it('lässt keinen Bildschirm leer oder ewig am Laden', () => {
    expect(O.befunde.slice(0, 10), `${O.befunde_gesamt} Befunde`).toEqual([]);
    expect(O.befunde_gesamt).toBe(0);
  });

  it('hat jede gebaute Datei im Zwischenspeicher', () => {
    /* Das ist die belastbare Zusage dieses Laufs: Was im Zwischenspeicher des
       Workers liegt, kann er ohne Netz ausliefern. Vor E-071 sammelte er nur
       ein, was jemand tatsächlich abgerufen hatte — die englischen Inhalte
       und die zusätzlichen Schriftschnitte fehlten. */
    expect(O.gebaute_dateien).toBeGreaterThanOrEqual(10);
    expect(O.gebaute_dateien_im_speicher).toBe(O.gebaute_dateien);
  });

  it('ist bei schmaler Gerätebreite gemessen', () => {
    expect(O.breite).toBeLessThanOrEqual(430);
  });
});
