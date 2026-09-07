/* Regressionstest für die Wiederherstellung aus dem IndexedDB-Spiegel.

   Hintergrund: Die App legt beim Start sofort Nebendaten in localStorage an
   (Sprachwahl, gespeichertes Chip-Setup). Wenn die Wiederherstellung schon bei
   irgendeinem „pokermentor*"-Schlüssel abbricht, gilt der Fortschritt
   fälschlich als vorhanden – und ist nach einer Speicherräumung endgültig weg.
   Genau das war ein echter Fehler und darf nicht zurückkommen. */

import { describe, expect, it } from 'vitest';
import { isProgressKey } from '../storage';

describe('isProgressKey', () => {
  it('erkennt echte Fortschrittsdaten', () => {
    expect(isProgressKey('pokermentor-profiles-v1')).toBe(true);
    expect(isProgressKey('pokermentor-data-p123abc')).toBe(true);
    expect(isProgressKey('pokermentor-v1')).toBe(true);
  });

  it('behandelt Nebendaten NICHT als Fortschritt – sie dürfen die Wiederherstellung nicht blockieren', () => {
    expect(isProgressKey('pokermentor-lang-v1')).toBe(false);
    expect(isProgressKey('pokermentor-chips-setup')).toBe(false);
  });

  it('ignoriert fremde Schlüssel', () => {
    expect(isProgressKey('irgendwas-anderes')).toBe(false);
    expect(isProgressKey('')).toBe(false);
  });
});

/* Ein voller Speicher darf nicht schweigend verschluckt werden.
   ===========================================================

   `localStorage` wirft einen `QuotaExceededError`, wenn kein Platz mehr ist.
   Früher fing `durableSet` das ab und sagte niemandem etwas: Die Eingabe stand
   auf dem Schirm, im Speicher stand der alte Stand, und nach dem nächsten
   Start war sie weg (E-062).

   Jetzt meldet `durableSet` zurück, ob `localStorage` den Wert genommen hat.
   Auf dieser Rückmeldung steht der Hinweis an die Nutzerin — und im Spiegel
   die Marke, die beim nächsten Start den neueren Stand zurückholt. */

class FalscherSpeicher {
  private daten = new Map<string, string>();
  public voll = false;
  get length(): number {
    return this.daten.size;
  }
  key(i: number): string | null {
    return [...this.daten.keys()][i] ?? null;
  }
  getItem(k: string): string | null {
    return this.daten.get(k) ?? null;
  }
  setItem(k: string, v: string): void {
    if (this.voll) throw new Error('QuotaExceededError');
    this.daten.set(k, v);
  }
  removeItem(k: string): void {
    this.daten.delete(k);
  }
  clear(): void {
    this.daten.clear();
  }
}

describe('durableSet meldet einen vollen Speicher', () => {
  it('gibt true zurück, solange localStorage schreibt — und false, sobald es das nicht mehr tut', async () => {
    const speicher = new FalscherSpeicher();
    const vorher = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
    Object.defineProperty(globalThis, 'localStorage', { value: speicher, configurable: true, writable: true });
    try {
      const { durableSet } = await import('../storage');
      expect(durableSet('pokermentor-test', 'a')).toBe(true);
      expect(speicher.getItem('pokermentor-test')).toBe('a');

      speicher.voll = true;
      expect(durableSet('pokermentor-test', 'b')).toBe(false);
      // Der alte Wert steht noch da — genau das ist der gefährliche Teil.
      expect(speicher.getItem('pokermentor-test')).toBe('a');

      speicher.voll = false;
      expect(durableSet('pokermentor-test', 'c')).toBe(true);
    } finally {
      if (vorher) Object.defineProperty(globalThis, 'localStorage', vorher);
      else delete (globalThis as { localStorage?: unknown }).localStorage;
    }
  });
});
