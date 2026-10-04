/* Die Uhr steuern, Cash ohne Countdown, die letzte Stufe zählt hoch
   (FAHRPLAN 7.3, 7.6). */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  minuteDazu, minuteWeg, standDerUhr, stufeVor, stufeZurueck,
} from '../live/uhr';
import { ladeLaufende, speichereLaufende, type LaufendeSession } from '../session/laufend';

class SpeicherErsatz {
  private daten = new Map<string, string>();
  getItem(k: string) { return this.daten.has(k) ? this.daten.get(k)! : null; }
  setItem(k: string, v: string) { this.daten.set(k, String(v)); }
  removeItem(k: string) { this.daten.delete(k); }
  clear() { this.daten.clear(); }
}
const echterSpeicher = (globalThis as Record<string, unknown>).localStorage;
beforeEach(() => {
  Object.defineProperty(globalThis, 'localStorage', { value: new SpeicherErsatz(), configurable: true, writable: true });
});
afterEach(() => {
  Object.defineProperty(globalThis, 'localStorage', { value: echterSpeicher, configurable: true, writable: true });
});

const MIN = 60_000;

function session(extra: Partial<LaufendeSession> = {}): LaufendeSession {
  return {
    begonnen: 0,
    spieler: [{ name: 'A', eingekauft: 1000, stand: 1000 }, { name: 'B', eingekauft: 1000, stand: 1000 }],
    startchips: 1000,
    stufen: [[1, 2], [2, 4], [3, 6], [5, 10]],
    stufendauer_s: 20 * 60,
    stufe: 0,
    verbraucht_ms: 0,
    laeuft_seit: null,
    ...extra,
  };
}

describe('Die Uhr steuern (7.3)', () => {
  it('Stufe vor springt an den Anfang der nächsten', () => {
    const s = stufeVor(session({ verbraucht_ms: 7 * MIN }), 0);
    expect(standDerUhr(s, 0).stufeIndex).toBe(1);
    expect(standDerUhr(s, 0).rest_ms).toBe(20 * MIN);
  });

  it('Stufe zurück springt an den Anfang der vorigen', () => {
    const s = stufeZurueck(session({ verbraucht_ms: 45 * MIN }), 0);
    expect(standDerUhr(s, 0).stufeIndex).toBe(1);
    expect(standDerUhr(stufeZurueck(session({ verbraucht_ms: 3 * MIN }), 0), 0).stufeIndex).toBe(0);
  });

  it('auf der letzten Stufe gibt es kein „vor"', () => {
    const s = session({ verbraucht_ms: 70 * MIN });
    expect(stufeVor(s, 0)).toBe(s);
  });

  it('eine laufende Uhr läuft nach dem Verschieben weiter, ab jetzt', () => {
    const s = session({ verbraucht_ms: 5 * MIN, laeuft_seit: 1_000_000 });
    const neu = stufeVor(s, 2_000_000);
    expect(neu.laeuft_seit).toBe(2_000_000);
    // Eine Minute später stehen 19 Minuten auf der Uhr.
    expect(standDerUhr(neu, 2_000_000 + MIN).rest_ms).toBe(19 * MIN);
  });

  it('eine pausierte Uhr bleibt pausiert', () => {
    const neu = stufeVor(session({ verbraucht_ms: 5 * MIN }), 123);
    expect(neu.laeuft_seit).toBeNull();
  });

  it('eine Minute dazu verlängert die Restzeit, ohne eine Stufe zurückzufallen', () => {
    const mitten = minuteDazu(session({ verbraucht_ms: 5 * MIN }), 0);
    expect(standDerUhr(mitten, 0).rest_ms).toBe(16 * MIN);
    // Am Anfang der Stufe gibt es nichts mehr zu verlängern.
    const anfang = minuteDazu(session({ verbraucht_ms: 20 * MIN }), 0);
    expect(standDerUhr(anfang, 0).stufeIndex).toBe(1);
    expect(standDerUhr(anfang, 0).rest_ms).toBe(20 * MIN);
  });

  it('eine Minute weg kürzt die Restzeit, ohne die Blinds zu wechseln', () => {
    const mitten = minuteWeg(session({ verbraucht_ms: 5 * MIN }), 0);
    expect(standDerUhr(mitten, 0).rest_ms).toBe(14 * MIN);
    const knapp = minuteWeg(session({ verbraucht_ms: 19 * MIN + 30_000 }), 0);
    expect(standDerUhr(knapp, 0).stufeIndex).toBe(0);
    expect(standDerUhr(knapp, 0).rest_ms).toBe(1000);
  });
});

describe('Die letzte Stufe zählt hoch (7.3)', () => {
  it('zeigt, wie lange sie schon läuft', () => {
    const u = standDerUhr(session({ verbraucht_ms: 60 * MIN + 12_000 }), 0);
    expect(u.istLetzte).toBe(true);
    expect(u.ueber_ms).toBe(12_000);
  });

  it('ist auf den anderen Stufen null', () => {
    expect(standDerUhr(session({ verbraucht_ms: 5 * MIN }), 0).ueber_ms).toBe(0);
  });
});

describe('Ein Cash-Abend hat keinen Countdown (7.6)', () => {
  const cash = (extra: Partial<LaufendeSession> = {}) =>
    session({ modus: 'cash', stufen: [[1, 2]], ...extra });

  it('kennt kein „Danach" und keine Vorwarnung', () => {
    // Auch nach zehn Stunden: nichts piept, nichts kommt danach.
    const u = standDerUhr(cash({ laeuft_seit: 0 }), 10 * 60 * MIN);
    expect(u.cash).toBe(true);
    expect(u.naechste).toBeNull();
    expect(u.knapp).toBe(false);
    expect(u.rest_ms).toBe(0);
  });

  it('zählt die gespielte Zeit hoch', () => {
    expect(standDerUhr(cash({ verbraucht_ms: 95 * MIN }), 0).ueber_ms).toBe(95 * MIN);
  });

  it('lässt sich nicht verschieben — es gibt nichts zu verschieben', () => {
    const s = cash({ verbraucht_ms: 5 * MIN });
    expect(stufeVor(s, 0)).toBe(s);
    expect(minuteDazu(s, 0)).toBe(s);
    expect(minuteWeg(s, 0)).toBe(s);
  });

  it('bleibt beim Speichern und Laden ein Cash-Abend', () => {
    speichereLaufende(cash({ ton: false, euroJeSpieler: 20, punkteJeEuro: 50 }));
    const geladen = ladeLaufende()!;
    expect(geladen.modus).toBe('cash');
    expect(geladen.ton).toBe(false);
    expect(geladen.euroJeSpieler).toBe(20);
    expect(geladen.punkteJeEuro).toBe(50);
  });

  it('ohne Angabe ist es ein Turnier (alte Abende)', () => {
    speichereLaufende(session());
    expect(ladeLaufende()!.modus).toBeUndefined();
    expect(standDerUhr(ladeLaufende()!, 0).cash).toBe(false);
  });
});
