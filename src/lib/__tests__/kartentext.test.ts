/* Karten als Text (FAHRPLAN 9.2). */

import { describe, expect, it } from 'vitest';
import { kartenText, leseKarten } from '../poker/kartentext';
import { parseCard } from '../poker/cards';

describe('leseKarten', () => {
  it('liest Karten mit Leerzeichen, Komma und Semikolon', () => {
    const erwartet = ['As', 'Kh'].map(parseCard);
    expect(leseKarten('As Kh').cards).toEqual(erwartet);
    expect(leseKarten('As,Kh').cards).toEqual(erwartet);
    expect(leseKarten(' As ; Kh ').cards).toEqual(erwartet);
  });

  it('nimmt die Schreibweise nicht genau', () => {
    expect(leseKarten('as kH').cards).toEqual(['As', 'Kh'].map(parseCard));
  });

  it('liest „T“ als Zehn', () => {
    expect(leseKarten('Td').cards).toEqual([parseCard('Td')]);
  });

  it('liefert für leeren Text keine Karten und keinen Fehler', () => {
    expect(leseKarten('')).toEqual({ cards: [] });
    expect(leseKarten('  ')).toEqual({ cards: [] });
  });

  it('meldet die erste unlesbare Karte', () => {
    expect(leseKarten('As Xx').fehler).toEqual({ art: 'ungueltig', token: 'Xx' });
    expect(leseKarten('Ace').fehler).toEqual({ art: 'ungueltig', token: 'Ace' });
  });

  it('meldet eine doppelte Karte innerhalb des Textes', () => {
    expect(leseKarten('As Kh As').fehler).toEqual({ art: 'doppelt', token: 'As' });
  });
});

describe('kartenText', () => {
  it('schreibt zurück, was leseKarten liest', () => {
    for (const t of ['As Kh', '9h 2h Jc', 'Td', '']) {
      expect(kartenText(leseKarten(t).cards)).toBe(t);
    }
  });
});
