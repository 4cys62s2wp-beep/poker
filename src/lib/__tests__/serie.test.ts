/* Die eine Serie (E-087).
   =======================

   Geprüft wird, was die Anzeige entscheidet: Lebt die Reihe noch, steht sie
   auf dem Spiel — und stimmt das Wort zur Zahl. */

import { describe, expect, it } from 'vitest';
import { aktuelleSerie, serieGefaehrdet, tagVor } from '../serie';
import { STR as HUB } from '../../i18n/pages/hub';
import { STR as PROFIL } from '../../i18n/pages/profile';

const HEUTE = '2026-03-14';

describe('tagVor', () => {
  it('geht über Monats- und Jahreswechsel und den 29. Februar', () => {
    expect(tagVor('2026-03-01', 1)).toBe('2026-02-28');
    expect(tagVor('2028-03-01', 1)).toBe('2028-02-29');
    expect(tagVor('2026-01-01', 1)).toBe('2025-12-31');
    expect(tagVor(HEUTE, 0)).toBe(HEUTE);
  });
});

describe('aktuelleSerie', () => {
  it('zählt, wenn heute etwas getan wurde', () => {
    expect(aktuelleSerie({ lastDay: HEUTE, count: 4 }, HEUTE)).toBe(4);
  });

  it('zählt, wenn gestern etwas getan wurde und heute noch Zeit ist', () => {
    expect(aktuelleSerie({ lastDay: '2026-03-13', count: 4 }, HEUTE)).toBe(4);
  });

  it('ist null, sobald ein Tag fehlt — auch wenn der Zähler noch dasteht', () => {
    /* Der gespeicherte Zähler wird erst von der nächsten Handlung
       zurückgesetzt. Bis dahin darf die Anzeige ihn nicht für gültig
       halten. */
    expect(aktuelleSerie({ lastDay: '2026-03-12', count: 9 }, HEUTE)).toBe(0);
    expect(aktuelleSerie({ lastDay: '', count: 0 }, HEUTE)).toBe(0);
  });
});

describe('serieGefaehrdet', () => {
  it('ist wahr nur, wenn sie lebt und heute noch nichts getan wurde', () => {
    expect(serieGefaehrdet({ lastDay: '2026-03-13', count: 3 }, HEUTE)).toBe(true);
    expect(serieGefaehrdet({ lastDay: HEUTE, count: 3 }, HEUTE)).toBe(false);
    expect(serieGefaehrdet({ lastDay: '2026-03-12', count: 3 }, HEUTE)).toBe(false);
    expect(serieGefaehrdet({ lastDay: '2026-03-13', count: 0 }, HEUTE)).toBe(false);
  });
});

describe('Das Wort zur Zahl', () => {
  it('steht im Singular bei eins, überall gleich', () => {
    expect(HUB.de.streakLabel(1)).toBe('Tag in Folge');
    expect(HUB.de.streakLabel(2)).toBe('Tage in Folge');
    expect(HUB.de.heuteSerie(1)).toBe('1 Tag in Folge');
    expect(PROFIL.de.streakDays(1)).toBe('Tag in Folge');
    expect(PROFIL.de.streakDays(0)).toBe('Tage in Folge');
    expect(PROFIL.en.streakDays(1)).toBe('day in a row');
  });
});
