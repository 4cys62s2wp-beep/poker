/* Flächen, Radien und Breiten sind Tokens — und eine Karte hebt sich ab.
   ====================================================================

   Gemessen am Stand vor E-077: Grund und Karte unterschieden sich um 1,12
   zu 1 im dunklen und 1,09 zu 1 im hellen Modus. Die Karte stand nur durch
   einen Rand mit Alpha 0,075 vom Grund ab; auf einem Telefon in der Sonne
   verschwamm jede Gruppe mit dem Hintergrund. Daneben standen 19 Eckradien
   als nackte Pixelzahl im Stylesheet, und drei verschiedene Lesebreiten
   wurden je Seite neu erfunden. */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { kontrast } from '../design/kontrast';

const CSS = readFileSync('src/styles/global.css', 'utf8');

/** Den Wert eines Tokens im Tokensatz des jeweiligen Modus lesen. */
function token(name: string, modus: 'dunkel' | 'hell'): string {
  const start = CSS.indexOf(modus === 'dunkel' ? ':root,\n[data-modus="dunkel"] {' : '[data-modus="hell"] {');
  expect(start, `Tokensatz ${modus} fehlt`).toBeGreaterThan(-1);
  const ende = CSS.indexOf('\n}', start);
  const treffer = CSS.slice(start, ende).match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{3,6});`));
  expect(treffer, `${name} fehlt im Modus ${modus}`).toBeTruthy();
  return treffer![1];
}

describe('Karte gegen Grund', () => {
  for (const modus of ['dunkel', 'hell'] as const) {
    it(`hebt die Karte im Modus ${modus} mindestens 1,15 zu 1 vom Grund ab`, () => {
      const wert = kontrast(token('--bg', modus), token('--bg-card', modus));
      expect(wert, `Grund zu Karte nur ${wert.toFixed(3)}:1`).toBeGreaterThanOrEqual(1.15);
    });
  }

  it('erkennt eine zu schwache Abhebung (die Prüfung prüft sich selbst)', () => {
    /* Der Stand vor E-077. */
    expect(kontrast('#0c110e', '#161d18')).toBeLessThan(1.15);
  });
});

describe('Radien', () => {
  const ausserhalbTokens = CSS.replace(/--radius[a-z-]*:\s*[^;]+;/g, '');

  it('führt die Skala als Tokens', () => {
    for (const stufe of ['--radius-xs', '--radius-sm', '--radius', '--radius-lg', '--radius-pill']) {
      expect(CSS, `${stufe} fehlt`).toMatch(new RegExp(`${stufe}:\\s*\\d+px;`));
    }
  });

  it('schreibt die Stufen der Skala nirgends mehr als Zahl', () => {
    const roh = [...ausserhalbTokens.matchAll(/border-radius:\s*(8|10|16|22|999)px\b/g)].map((m) => m[0]);
    expect(roh, 'Eckradius der Skala als Pixelzahl — var(--radius-…) benutzen').toEqual([]);
  });
});

describe('Inhaltsbreiten', () => {
  it('führt vier Breiten als Tokens', () => {
    for (const b of ['--breite-lesen', '--breite-schmal', '--breite-standard', '--breite-weit']) {
      expect(CSS, `${b} fehlt`).toMatch(new RegExp(`${b}:\\s*[^;]+;`));
    }
  });

  it('erfindet keine eigene Breite aus 560, 640 oder 1140 Pixeln', () => {
    const roh = [...CSS.matchAll(/^\s+max-width:\s*(560|640|660|1140)px;/gm)].map((m) => m[0].trim());
    expect(roh, 'max-width als Pixelzahl — var(--breite-…) benutzen').toEqual([]);
  });

  it('lässt Fließtext in Lesebreite stehen', () => {
    expect(CSS).toMatch(/\.prose\s*\{[^}]*max-width:\s*var\(--breite-lesen\)/);
  });
});
