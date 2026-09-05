/* Die Rangnamen gibt es in beiden Sprachen (E-043).
   ==============================================
   In der englischen Oberfläche stand „150 XP to Küchentisch-Spieler": Die
   Titelliste war deutsch und wurde in beiden Sprachen angezeigt. Gespeichert
   wird nur die Zahl — die Namen sind reine Anzeige und gehören übersetzt. */

import { describe, expect, it } from 'vitest';
import { LEVEL_TITLES, LEVEL_TITLES_EN, levelTitles } from '../../state/AppState';
import { rangstand } from '../rang/stand';

describe('Beide Titellisten passen zueinander', () => {
  it('sind gleich lang', () => {
    /* Sonst hätte ein Rang in einer Sprache einen Namen und in der anderen
       keinen — und der Bildschirm schriebe „nächster Rang: undefined". */
    expect(LEVEL_TITLES_EN.length).toBe(LEVEL_TITLES.length);
  });

  it('enthalten keinen leeren Namen', () => {
    for (const liste of [LEVEL_TITLES, LEVEL_TITLES_EN]) {
      expect(liste.filter((t) => !t.trim())).toEqual([]);
    }
  });

  it('sind wirklich übersetzt, nicht kopiert', () => {
    const gleich = LEVEL_TITLES.filter((t, i) => t === LEVEL_TITLES_EN[i]);
    /* „Grinder", „Regular", „Crusher", „High Roller" sind im Poker auch auf
       Deutsch englisch — die dürfen gleich sein. Alles andere nicht. */
    expect(gleich).toEqual(['Grinder', 'Regular', 'Crusher', 'High Roller']);
  });

  it('haben in der englischen Liste keine deutschen Umlaute', () => {
    expect(LEVEL_TITLES_EN.filter((t) => /[äöüßÄÖÜ]/.test(t))).toEqual([]);
  });
});

describe('Der Rangstand benutzt die Liste der aktiven Sprache', () => {
  it('gibt auf Englisch englische Namen', () => {
    const de = rangstand(200, levelTitles('de'));
    const en = rangstand(200, levelTitles('en'));
    expect(de.titel).toBe(LEVEL_TITLES[de.level - 1]);
    expect(en.titel).toBe(LEVEL_TITLES_EN[en.level - 1]);
    expect(de.level).toBe(en.level);
  });

  it('rechnet unabhängig von der Sprache dasselbe', () => {
    /* Die Namen sind Anzeige; Schwellen, Anteil und Rest dürfen sich
       zwischen den Sprachen nicht unterscheiden. */
    for (const xp of [0, 1, 74, 75, 150, 999, 100000]) {
      const de = rangstand(xp, levelTitles('de'));
      const en = rangstand(xp, levelTitles('en'));
      expect({ ...de, titel: '', naechsterTitel: '' })
        .toEqual({ ...en, titel: '', naechsterTitel: '' });
    }
  });

  it('bleibt ohne Angabe bei den deutschen Namen', () => {
    /* Damit Aufrufe ohne Sprache — Tests, Werkzeuge — gültig bleiben. */
    expect(rangstand(0).titel).toBe(LEVEL_TITLES[0]);
  });
});
