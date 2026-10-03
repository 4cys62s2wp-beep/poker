/* Zeitspannen in Sätzen.
   =====================

   „Läuft seit 5848 Stunden 28 Minuten" stand einmal auf der Einrichtungsseite
   — für einen Abend, der seit Februar nicht beendet worden war. Ab einem Tag
   zählen deshalb Tage, und das Deutsche braucht dort den richtigen Fall:
   „seit 3 Tagen", aber „3 Tage gespielt". */

import { describe, expect, it } from 'vitest';
import { alsUhr, grobeDauer } from '../session/dauer';

const MIN = 60_000;
const STD = 60 * MIN;
const TAG = 24 * STD;

describe('grobeDauer', () => {
  it('sagt „gerade eben" unter zwei Minuten', () => {
    expect(grobeDauer(90_000, 'de')).toBe('gerade eben');
  });

  it('zählt Minuten und Stunden wie bisher', () => {
    expect(grobeDauer(25 * MIN, 'de')).toBe('25 Minuten');
    expect(grobeDauer(STD + 5 * MIN, 'de')).toBe('1 Stunde');
    expect(grobeDauer(3 * STD + 20 * MIN, 'de')).toBe('3 Stunden 20 Minuten');
  });

  it('wechselt ab einem Tag auf Tage statt Tausender von Stunden', () => {
    expect(grobeDauer(5848 * STD, 'de')).toBe('243 Tage');
    expect(grobeDauer(5848 * STD, 'en')).toBe('243 days');
    expect(grobeDauer(TAG + 3 * STD, 'de')).toBe('1 Tag');
  });

  it('setzt nach „seit" den Dativ', () => {
    expect(grobeDauer(3 * TAG, 'de', 'dativ')).toBe('3 Tagen');
    expect(grobeDauer(3 * TAG, 'de')).toBe('3 Tage');
    // Bei Stunden und Minuten sind beide Fälle gleich.
    expect(grobeDauer(2 * STD, 'de', 'dativ')).toBe('2 Stunden');
  });
});

describe('alsUhr', () => {
  it('springt beim Herunterzählen nicht in der Breite', () => {
    expect(alsUhr(65_000)).toBe('1:05');
    expect(alsUhr(3_725_000)).toBe('1:02:05');
  });
});
