/* Die haptische Rückmeldung darf unter keinen Umständen eine Eingabe
   scheitern lassen. Genau das prüfen diese Tests: nicht, dass es vibriert,
   sondern dass nichts kaputtgeht, wenn es das nicht kann. */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { _darfVibrieren, bestaetigt, umschlag } from '../design/haptik';

const echt = globalThis.navigator;

afterEach(() => {
  Object.defineProperty(globalThis, 'navigator', { value: echt, configurable: true });
  vi.restoreAllMocks();
});

function setzeNavigator(v: unknown) {
  Object.defineProperty(globalThis, 'navigator', { value: v, configurable: true });
}

describe('Haptische Rückmeldung', () => {
  it('stößt kurz an, wenn das Gerät es kann', () => {
    const vibrate = vi.fn((_muster: number | number[]) => true);
    setzeNavigator({ vibrate });
    bestaetigt();
    expect(vibrate).toHaveBeenCalledTimes(1);
    const muster = vibrate.mock.calls[0][0] as number;
    expect(muster).toBeGreaterThan(0);
    expect(muster).toBeLessThanOrEqual(20);
  });

  it('unterscheidet den Umschlag hörbar von einer Eingabe', () => {
    const vibrate = vi.fn((_muster: number | number[]) => true);
    setzeNavigator({ vibrate });
    umschlag();
    expect(Array.isArray(vibrate.mock.calls[0][0])).toBe(true);
  });

  it('tut nichts, wenn das Gerät nicht vibrieren kann', () => {
    setzeNavigator({});
    expect(() => bestaetigt()).not.toThrow();
    expect(_darfVibrieren()).toBe(false);
  });

  it('schluckt einen Fehler aus dem Browser', () => {
    /* Manche Browser werfen, statt false zurückzugeben. Eine Eingabe, die
       daran scheitert, wäre der schlimmere Fehler. */
    setzeNavigator({ vibrate: () => { throw new Error('nicht erlaubt'); } });
    expect(() => bestaetigt()).not.toThrow();
    expect(() => umschlag()).not.toThrow();
  });

  it('schweigt, wenn der Nutzer Bewegung reduziert hat', () => {
    const vibrate = vi.fn((_muster: number | number[]) => true);
    setzeNavigator({ vibrate });
    vi.stubGlobal('window', { matchMedia: () => ({ matches: true }) });
    bestaetigt();
    expect(vibrate).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
