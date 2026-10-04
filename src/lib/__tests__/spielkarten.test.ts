/* Eine Karte, die man nicht falsch lesen kann.
   ===========================================

   Auf einer echten Karte steht der Rang zweimal: oben links und, auf dem Kopf,
   unten rechts. Das Auge erkennt daran eine Spielkarte. Auf einem Handy, wo
   Karten sich überlappen und angeschnitten sind, ist derselbe zweite Index ein
   Fehler: Eine 9, auf den Kopf gestellt, ist eine 6. Gesehen an fünf Stellen,
   ausgerechnet auch im Handranking-Trainer (E-075).

   Was jetzt gilt:
   1. Der zweite Index wird nur auf der großen Karte gezeichnet.
   2. Wo die große Karte überlappt (Tisch, Bereichsvorschau), blendet das
      Stylesheet ihn aus.
   3. 6 und 9 tragen einen Strich — wie auf Karten aus dem Casino.
   4. Die kleine Karte ist mindestens 32 × 44 Pixel groß, ihr Rang mindestens
      12 Pixel hoch und sie trägt kein Mittelsymbol mehr. */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const TSX = readFileSync('src/components/PlayingCard.tsx', 'utf8');
const CSS = readFileSync('src/styles/global.css', 'utf8');

const block = (selektor: string): string => {
  const i = CSS.indexOf(`${selektor} {`);
  return i < 0 ? '' : CSS.slice(i, CSS.indexOf('}', i));
};

describe('Spielkarten', () => {
  it('zeichnet den zweiten Index nur auf der großen Karte', () => {
    expect(TSX).toMatch(/size === 'xl' &&\s*\(\s*<span className="corner unten"/);
    // und nirgends sonst
    expect(TSX.match(/corner unten/g)?.length).toBe(1);
  });

  it('blendet den zweiten Index dort aus, wo große Karten überlappen', () => {
    expect(CSS).toMatch(/\.du-karten \.pcard \.corner\.unten[^{]*\{\s*display:\s*none/);
  });

  it('unterstreicht 6 und 9 — oben wie unten', () => {
    expect(TSX).toContain('data-rang={displayRank}');
    expect(CSS).toMatch(/\.pcard \.rang\[data-rang="6"\],\s*\.pcard \.rang\[data-rang="9"\]\s*\{[^}]*text-decoration:\s*underline/);
  });

  it('macht die kleine Karte lesbar', () => {
    const sm = block('.pcard.sm');
    expect(Number(sm.match(/width:\s*(\d+)px/)?.[1])).toBeGreaterThanOrEqual(32);
    expect(Number(sm.match(/height:\s*(\d+)px/)?.[1])).toBeGreaterThanOrEqual(44);
    const ecke = block('.pcard.sm .corner');
    const rang = Number(ecke.match(/font-size:\s*([0-9.]+)rem/)?.[1]);
    expect(rang, 'Rang auf der kleinen Karte').toBeGreaterThanOrEqual(0.875);
    expect(block('.pcard.sm .center-suit')).toMatch(/display:\s*none/);
  });

  it('hält die kleine Karte auch auf schmalen Geräten bei mindestens 32 × 44', () => {
    const schmal = CSS.slice(CSS.indexOf('@media (max-width: 640px)'));
    const m = schmal.match(/\.pcard\.sm \{ width: (\d+)px; height: (\d+)px/);
    expect(Number(m?.[1])).toBeGreaterThanOrEqual(32);
    expect(Number(m?.[2])).toBeGreaterThanOrEqual(44);
  });
});
