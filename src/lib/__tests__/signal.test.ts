/* Ton und Wachhalten am Tisch (FAHRPLAN 7.5).

   Der Fehler, den dieser Test festhält: Für jeden Ton entstand ein neuer
   AudioContext, aus dem Sekundentakt, ohne Nutzergeste — auf dem iPhone blieb
   er angehalten, der Ton kam nie. Gemessen wird deshalb nicht „ein Ton wurde
   gespielt", sondern: Es gibt genau einen Zusammenhang, er wird entsperrt, und
   ohne ihn vibriert das Gerät. */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  entsperreTon, gleichIstEsSoweit, haltWach, stufeGewechselt, tonTesten, vergissKontext,
} from '../live/signal';

let angelegt = 0;
let gespielt = 0;
let anfangsZustand: 'running' | 'suspended' = 'suspended';
let fortsetzenKlappt = true;

class FalscherKlang {
  state: 'running' | 'suspended' | 'closed' = anfangsZustand;
  currentTime = 0;
  destination = {};
  constructor() { angelegt += 1; this.state = anfangsZustand; }
  async resume() { if (fortsetzenKlappt) this.state = 'running'; }
  async close() { this.state = 'closed'; }
  createGain() {
    return { gain: { setValueAtTime() {}, linearRampToValueAtTime() {} }, connect: (x: unknown) => x };
  }
  createOscillator() {
    const o = {
      type: '', frequency: { value: 0 }, onended: null as null | (() => void),
      connect: (x: unknown) => x,
      start() { gespielt += 1; },
      stop() { queueMicrotask(() => o.onended?.()); },
    };
    return o;
  }
}

const fenster = globalThis as unknown as Record<string, unknown>;
let vibriert: Array<number | number[]> = [];

beforeEach(() => {
  angelegt = 0; gespielt = 0; vibriert = []; anfangsZustand = 'suspended'; fortsetzenKlappt = true;
  vergissKontext();
  fenster.window = { AudioContext: FalscherKlang };
  Object.defineProperty(globalThis, 'navigator', {
    value: { vibrate: (m: number | number[]) => { vibriert.push(m); return true; } },
    configurable: true, writable: true,
  });
});
afterEach(() => { delete fenster.window; });

describe('Der Ton — ein Zusammenhang, im Klick entsperrt', () => {
  it('legt über viele Töne genau einen AudioContext an', async () => {
    await entsperreTon();
    await gleichIstEsSoweit();
    await stufeGewechselt();
    await gleichIstEsSoweit();
    expect(angelegt).toBe(1);
  });

  it('entsperrt den angehaltenen Zusammenhang und bestätigt mit einem Ton', async () => {
    const ok = await entsperreTon();
    expect(ok).toBe(true);
    expect(gespielt).toBeGreaterThan(0);
  });

  it('meldet, wenn das Gerät nicht entsperren lässt', async () => {
    fortsetzenKlappt = false;
    expect(await entsperreTon()).toBe(false);
  });

  it('vibriert statt zu schweigen, wenn kein Ton kommt', async () => {
    fortsetzenKlappt = false;
    await entsperreTon();
    expect(await stufeGewechselt()).toBe(false);
    expect(vibriert.length).toBeGreaterThan(0);
  });

  it('bleibt still, wenn der Ton ausgeschaltet ist', async () => {
    await entsperreTon();
    const vorher = gespielt;
    await gleichIstEsSoweit(false);
    await stufeGewechselt(false);
    expect(gespielt).toBe(vorher);
    expect(vibriert).toEqual([]);
  });

  it('Ton testen sagt, ob etwas zu hören war', async () => {
    await entsperreTon();
    expect(await tonTesten()).toBe('ok');
    fortsetzenKlappt = false;
    vergissKontext();
    expect(await tonTesten()).toBe('stumm');
  });

  it('ein Gerät ohne Klang bricht nichts ab', async () => {
    fenster.window = {};
    expect(await entsperreTon()).toBe(false);
    expect(await gleichIstEsSoweit()).toBe(false);
  });
});

describe('Der Bildschirm bleibt an — und das Gerät sagt, ob es geklappt hat', () => {
  it('gibt ok zurück, wenn die Sperre gewährt wird', async () => {
    let gesperrt = 0;
    Object.defineProperty(globalThis, 'navigator', {
      value: { wakeLock: { request: async () => { gesperrt += 1; return { release: async () => {} }; } } },
      configurable: true, writable: true,
    });
    (globalThis as unknown as { document: unknown }).document = {
      addEventListener() {}, removeEventListener() {}, visibilityState: 'visible',
    };
    const w = await haltWach();
    expect(w.ok).toBe(true);
    expect(gesperrt).toBe(1);
    w.loesen();
  });

  it('gibt nicht-ok zurück, wenn es keine Sperre gibt', async () => {
    Object.defineProperty(globalThis, 'navigator', { value: {}, configurable: true, writable: true });
    expect((await haltWach()).ok).toBe(false);
  });

  it('gibt nicht-ok zurück, wenn die Sperre verweigert wird', async () => {
    Object.defineProperty(globalThis, 'navigator', {
      value: { wakeLock: { request: async () => { throw new Error('nein'); } } },
      configurable: true, writable: true,
    });
    expect((await haltWach()).ok).toBe(false);
  });
});
