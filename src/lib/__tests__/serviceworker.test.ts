/* Ein Zwischenspeicher, den niemand findet.
   ========================================

   Der Service Worker legte beim Installieren jede gebaute Datei ab — und
   fand beim Abruf keine davon. Der Grund steckte in einem Kopfzeilen-Detail:

   - Der Server schickt `Vary: Origin` (Vite ebenso wie GitHub Pages).
   - Die Seite fordert Skript und Stilblatt als
     `<script type="module" crossorigin>` an, also **mit** `Origin`-Kopf.
   - Abgelegt hat der Worker sie mit seiner eigenen Anfrage, die **keinen**
     hat.
   - `caches.match(req)` beachtet `Vary`, vergleicht die Köpfe, findet
     nichts — und geht ins Netz. Ohne Netz bleibt der Bildschirm leer.

   Gemessen im Worker selbst (E-072):

       ohne ignoreVary:  TREFFER NEIN  index-….js   → 0 Zeichen
       mit  ignoreVary:  TREFFER ja    index-….js   → 6750 Zeichen

   Die Dateinamen tragen einen Streuwert; die Adresse allein ist damit ein
   eindeutiger Schlüssel. Genau dafür ist `ignoreVary` gemacht.

   Dieser Test hält es fest: **Jeder** Zugriff auf den Zwischenspeicher im
   Service Worker trägt `ignoreVary: true`. Ein neuer, der es vergisst, ist
   genau derselbe Fehler noch einmal — und er wäre wieder unsichtbar, solange
   ein Netz da ist. */

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const SW = readFileSync('public/sw.js', 'utf8');

/** Alle Aufrufe von `caches.match(` samt ihrer Argumentliste. */
function zugriffe(): string[] {
  const treffer: string[] = [];
  const muster = /caches\.match\(/g;
  let m: RegExpExecArray | null;
  while ((m = muster.exec(SW)) !== null) {
    // Ab der öffnenden Klammer bis zur passenden schließenden lesen.
    let tiefe = 1;
    let i = m.index + m[0].length;
    for (; i < SW.length && tiefe > 0; i++) {
      if (SW[i] === '(') tiefe++;
      else if (SW[i] === ')') tiefe--;
    }
    treffer.push(SW.slice(m.index, i));
  }
  return treffer;
}

describe('Service Worker', () => {
  it('sucht im Zwischenspeicher überall mit ignoreVary', () => {
    const ohne = zugriffe().filter((z) => !z.includes('ignoreVary: true'));
    expect(ohne, 'ohne ignoreVary findet der Worker seine eigenen Dateien nicht').toEqual([]);
  });

  it('greift überhaupt auf den Zwischenspeicher zu — sonst prüft die Regel nichts', () => {
    expect(zugriffe().length).toBeGreaterThanOrEqual(2);
  });

  it('lädt die gebauten Dateien beim Installieren vor', () => {
    /* Ohne die erzeugte Liste sammelt der Worker nur ein, was jemand
       tatsächlich abgerufen hat — die englischen Inhalte und die
       Schriftschnitte, die auf der Startseite nicht vorkommen, fehlten
       (E-071). `scripts/sw-dateien.mjs` trägt die Namen beim Bauen ein. */
    expect(SW).toContain('const GEBAUTE_DATEIEN = []');
    expect(SW).toContain('...GEBAUTE_DATEIEN');
    const bau = readFileSync('package.json', 'utf8');
    expect(bau).toContain('node scripts/sw-dateien.mjs');
  });

  it('hat für die Konfigurationsdateien einen Rückfall — online live, offline der letzte Stand', () => {
    /* Ohne Netz fehlte `firebase-config.json`; die App hielt die Cloud für nicht
       eingerichtet und zeigte einem angemeldeten Nutzer „Geräte-Modus aktiv"
       statt seines Kontos (E-084). Nicht erreichbar ist nicht nicht vorhanden. */
    const zweig = SW.slice(SW.indexOf('firebase-config|monetization|legal'));
    const bis = zweig.indexOf("if (req.mode === 'navigate')");
    const block = zweig.slice(0, bis);
    expect(block).toContain('fetch(req)');
    expect(block).toContain('caches.match(req, { ignoreVary: true })');
    expect(block).toContain('res.ok');
    expect(SW).not.toMatch(/nie cachen/);
  });
});
