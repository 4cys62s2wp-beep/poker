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
