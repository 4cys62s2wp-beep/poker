/* Der Satz über den Speicherort hängt am Zustand (FAHRPLAN 8.2). */

import { describe, expect, it } from 'vitest';
import { speicherort } from '../speicherort';
import { STR } from '../../i18n/pages/profile';

describe('speicherort', () => {
  it('sagt „Gerät“, solange es kein Konto gibt', () => {
    expect(speicherort(null)).toBe('geraet');
    expect(speicherort(undefined)).toBe('geraet');
  });

  it('sagt „Konto“ erst mit bestätigter E-Mail', () => {
    expect(speicherort({ verified: true })).toBe('konto');
    expect(speicherort({ verified: false })).toBe('konto-offen');
  });
});

describe('Die Sätze dazu', () => {
  it('widersprechen einander nicht: Keiner behauptet „nur auf diesem Gerät“ mit Konto', () => {
    for (const l of ['de', 'en'] as const) {
      const konto = STR[l].speicherKonto.toLowerCase();
      expect(konto).not.toMatch(/nur auf diesem gerät|on this device only/);
      expect(STR[l].speicherGeraet.toLowerCase()).toMatch(/nur auf diesem gerät|on this device only/);
      expect(STR[l].speicherKontoOffen.toLowerCase()).toMatch(/nur auf diesem gerät|on this device only/);
    }
  });
});
