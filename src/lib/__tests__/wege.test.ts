/* Wege und Erreichbarkeit.
   =======================

   Geprüft wird am gerenderten Ergebnis, nicht am Quelltext — der Grund steht
   in DESIGN.md, Abschnitt 6: Ein Lauf über den Quelltext hat elf Sackgassen
   nicht gefunden, weil die Links alle da waren, aber in einer Seitenleiste
   standen, die unter 920 Pixel ausgeblendet ist.

   Das Messen macht deshalb ein echter Browser: `npm run wege` startet die
   gebaute App bei 390 Pixel Breite, folgt allen sichtbaren Links und schreibt
   das Ergebnis nach `docs/wege.json`.

   Was DIESER Test dazu beiträgt: Er hält das Ergebnis fest. Er schlägt an,
   wenn eine neue Adresse angemeldet wird, ohne dass jemand den Browserlauf
   wiederholt hat — und er lässt die drei Zahlen nicht von null weg. */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

interface Weg { hash: string; tiefe: number; zurueck: boolean; inhalt: boolean }
interface Wege {
  geprueft_am: string;
  breite: number;
  bildschirme: number;
  groesste_tiefe: number;
  sackgassen: string[];
  tiefer_als_zwei: string[];
  unerreichbar: string[];
  absichtlich_unverlinkt: string[];
  wege: Weg[];
}

const W: Wege = JSON.parse(readFileSync('docs/wege.json', 'utf8'));
const APP = readFileSync('src/App.tsx', 'utf8');

describe('Erreichbarkeit', () => {
  it('ist bei schmaler Gerätebreite gemessen', () => {
    /* 390 Pixel ist die Breite, für die diese App gebaut ist. Eine Messung
       bei 1280 Pixel würde die Seitenleiste einbeziehen und wäre wertlos. */
    expect(W.breite).toBeLessThanOrEqual(430);
  });

  it('kennt keine Sackgasse', () => {
    expect(W.sackgassen).toEqual([]);
  });

  it('hält jeden Bildschirm bei höchstens zwei Berührungen', () => {
    expect(W.tiefer_als_zwei).toEqual([]);
    expect(W.groesste_tiefe).toBeLessThanOrEqual(2);
  });

  it('lässt keinen angemeldeten Bildschirm unerreichbar', () => {
    expect(W.unerreichbar).toEqual([]);
  });

  it('führt jeden Bildschirm mit einem Weg zurück zur Startseite', () => {
    for (const w of W.wege) expect(w.zurueck).toBe(true);
  });
});

describe('Die Wegeliste passt zu den angemeldeten Adressen', () => {
  /** Feste Adressen aus App.tsx — ohne Platzhalter und ohne Umleitungen. */
  const angemeldet = [...APP.matchAll(/<Route path="([^"]+)"(?![^>]*Navigate)/g)]
    .map((m) => m[1])
    .filter((p) => !p.includes(':') && p !== '*');

  it('kennt jede angemeldete Adresse', () => {
    const bekannt = new Set([
      ...W.wege.map((w) => w.hash.replace(/^#/, '')),
      ...W.absichtlich_unverlinkt,
    ]);
    const fehlend = angemeldet.filter((p) => !bekannt.has(p));
    expect(fehlend, 'Neue Adresse ohne Messung. `npm run wege` ausführen: '
      + 'Ob sie erreichbar ist, entscheidet der Browser, nicht der Quelltext.')
      .toEqual([]);
  });

  it('nennt für jede absichtlich unverlinkte Adresse einen Grund', () => {
    /* Die Begründungen stehen im Prüfskript. Was hier zählt: Die Liste ist
       kurz und wird nicht zum Ablageort für Vergessenes. */
    expect(W.absichtlich_unverlinkt.length).toBeLessThanOrEqual(3);
  });
});
