/* Die Regeln der Tastenkürzel (FAHRPLAN 9.4). */

import { describe, expect, it } from 'vitest';
import { findeTaste, istEingabe, type Taste } from '../tasten';

const aktion = () => undefined;
const belegungen: Taste[] = [
  { tasten: ['/'], aktion },
  { tasten: ['k'], strg: true, inFeldern: true, aktion },
  { tasten: ['f', 'F'], aktion },
  { tasten: ['Escape'], imDialog: true, inFeldern: true, aktion },
];

const ev = (key: string, mehr: Partial<Parameters<typeof findeTaste>[0]> = {}) => ({
  key, ctrlKey: false, metaKey: false, altKey: false, ...mehr,
});
const feld = (tag: string, art?: string) => ({ tagName: tag.toUpperCase(), type: art, isContentEditable: false }) as unknown as EventTarget;

describe('istEingabe', () => {
  it('erkennt Felder, in die man Text tippt', () => {
    expect(istEingabe(feld('input', 'text'))).toBe(true);
    expect(istEingabe(feld('input', 'search'))).toBe(true);
    expect(istEingabe(feld('textarea'))).toBe(true);
    expect(istEingabe(feld('select'))).toBe(true);
  });

  it('lässt Knöpfe, Haken und Regler als Ziel zu', () => {
    expect(istEingabe(feld('input', 'checkbox'))).toBe(false);
    expect(istEingabe(feld('input', 'radio'))).toBe(false);
    expect(istEingabe(feld('button'))).toBe(false);
    expect(istEingabe(null)).toBe(false);
  });

  it('erkennt beschreibbare Flächen', () => {
    expect(istEingabe({ tagName: 'DIV', isContentEditable: true } as unknown as EventTarget)).toBe(true);
  });
});

describe('findeTaste', () => {
  it('findet die Belegung, egal ob groß oder klein', () => {
    expect(findeTaste(ev('f'), feld('button'), belegungen, false)).toBe(belegungen[2]);
    expect(findeTaste(ev('F'), feld('button'), belegungen, false)).toBe(belegungen[2]);
  });

  it('schweigt in einem Eingabefeld', () => {
    expect(findeTaste(ev('f'), feld('input', 'text'), belegungen, false)).toBeNull();
    expect(findeTaste(ev('/'), feld('textarea'), belegungen, false)).toBeNull();
  });

  it('gilt in einem Feld nur, wo die Taste es verlangt (Strg + K)', () => {
    expect(findeTaste(ev('k', { ctrlKey: true }), feld('input', 'text'), belegungen, false)).toBe(belegungen[1]);
  });

  it('fängt mit Strg, Befehl oder Alt nichts ab, was nicht danach verlangt', () => {
    expect(findeTaste(ev('f', { ctrlKey: true }), feld('button'), belegungen, false)).toBeNull();
    expect(findeTaste(ev('f', { metaKey: true }), feld('button'), belegungen, false)).toBeNull();
    expect(findeTaste(ev('f', { altKey: true }), feld('button'), belegungen, false)).toBeNull();
    expect(findeTaste(ev('/', { ctrlKey: true }), feld('button'), belegungen, false)).toBeNull();
  });

  it('verlangt Strg, wo die Belegung es nennt', () => {
    expect(findeTaste(ev('k'), feld('button'), belegungen, false)).toBeNull();
    expect(findeTaste(ev('k', { metaKey: true }), feld('button'), belegungen, false)).toBe(belegungen[1]);
  });

  it('lässt hinter einem Dialog nur zu, was dem Dialog gehört', () => {
    expect(findeTaste(ev('f'), feld('button'), belegungen, true)).toBeNull();
    expect(findeTaste(ev('Escape'), feld('input', 'text'), belegungen, true)).toBe(belegungen[3]);
  });

  it('übergeht Ereignisse, die schon behandelt wurden oder noch eine Eingabe bilden', () => {
    expect(findeTaste(ev('f', { defaultPrevented: true }), feld('button'), belegungen, false)).toBeNull();
    expect(findeTaste(ev('f', { isComposing: true }), feld('button'), belegungen, false)).toBeNull();
  });

  it('nimmt „/“ auch mit gedrückter Umschalttaste (deutsche Tastatur: Umschalt + 7)', () => {
    expect(findeTaste(ev('/'), feld('button'), belegungen, false)).toBe(belegungen[0]);
  });
});
