/* Neue Seiten oben, Zurück an die alte Stelle (E-082). */

import { describe, expect, it } from 'vitest';
import { entscheideScroll, gemerktePosition, merkePosition } from '../scroll';

describe('entscheideScroll', () => {
  it('scrollt nach vorn nach oben und setzt den Fokus', () => {
    expect(entscheideScroll({ art: 'PUSH', pfadGeaendert: true, gespeichert: undefined }))
      .toEqual({ aktion: 'oben', y: 0, fokus: true });
  });

  it('stellt nach hinten die gemerkte Position wieder her — ohne den Fokus zu stehlen', () => {
    expect(entscheideScroll({ art: 'POP', pfadGeaendert: true, gespeichert: 2836 }))
      .toEqual({ aktion: 'wiederherstellen', y: 2836, fokus: false });
  });

  it('geht nach hinten auf eine unbekannte Seite nach oben', () => {
    expect(entscheideScroll({ art: 'POP', pfadGeaendert: true, gespeichert: undefined }).aktion).toBe('oben');
  });

  it('rührt die erste Seite nicht an', () => {
    expect(entscheideScroll({ art: 'POP', pfadGeaendert: null, gespeichert: undefined }).aktion).toBe('nichts');
  });

  it('lässt beim Ersetzen derselben Seite alles stehen (der Drill ersetzt bei jeder Aufgabe)', () => {
    expect(entscheideScroll({ art: 'REPLACE', pfadGeaendert: false, gespeichert: undefined }).aktion).toBe('nichts');
  });

  it('scrollt beim Ersetzen durch eine andere Seite nach oben (Umleitung alter Pfade)', () => {
    expect(entscheideScroll({ art: 'REPLACE', pfadGeaendert: true, gespeichert: undefined }))
      .toEqual({ aktion: 'oben', y: 0, fokus: true });
  });
});

describe('Gedächtnis der Positionen', () => {
  it('merkt sich die Position je Adresseintrag', () => {
    merkePosition('a1', 500);
    merkePosition('b2', 120.4);
    expect(gemerktePosition('a1')).toBe(500);
    expect(gemerktePosition('b2')).toBe(120);
    expect(gemerktePosition('unbekannt')).toBeUndefined();
  });

  it('vergisst die ältesten, damit es nicht wächst', () => {
    for (let i = 0; i < 90; i += 1) merkePosition(`k${i}`, i + 1);
    expect(gemerktePosition('k0')).toBeUndefined();
    expect(gemerktePosition('k89')).toBe(90);
  });
});
