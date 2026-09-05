/* Die Rangnamen: in beiden Sprachen, und nur einmal (E-043, E-044).
   ===============================================================
   In der englischen Oberfläche stand „150 XP to Küchentisch-Spieler". Die
   übersetzte Liste gab es zu dem Zeitpunkt längst — in `i18n/index.tsx`,
   von der Kopfzeile benutzt, vom Rangstand nicht. Beim Beheben habe ich
   eine dritte angelegt, und die beiden englischen wichen schon voneinander
   ab („Rookie" gegen „Newcomer").

   Jetzt steht die Liste in `lib/rang/titel.ts`, und dieser Test hält fest,
   dass es dabei bleibt. */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { RANGNAMEN, rangname, rangnamen } from '../rang/titel';
import { rangstand } from '../rang/stand';

describe('Beide Titellisten passen zueinander', () => {
  it('sind gleich lang', () => {
    /* Sonst hätte ein Rang in einer Sprache einen Namen und in der anderen
       keinen — und der Bildschirm schriebe „nächster Rang: undefined". */
    expect(RANGNAMEN.en.length).toBe(RANGNAMEN.de.length);
  });

  it('enthalten keinen leeren Namen', () => {
    for (const liste of [RANGNAMEN.de, RANGNAMEN.en]) {
      expect(liste.filter((t: string) => !t.trim())).toEqual([]);
    }
  });

  it('sind wirklich übersetzt, nicht kopiert', () => {
    const gleich = RANGNAMEN.de.filter((t, i) => t === RANGNAMEN.en[i]);
    /* „Grinder", „Regular", „Crusher", „High Roller" sind im Poker auch auf
       Deutsch englisch — die dürfen gleich sein. Alles andere nicht. */
    expect(gleich).toEqual(['Grinder', 'Regular', 'Crusher', 'High Roller']);
  });

  it('haben in der englischen Liste keine deutschen Umlaute', () => {
    expect(RANGNAMEN.en.filter((t: string) => /[äöüßÄÖÜ]/.test(t))).toEqual([]);
  });
});

describe('Der Rangstand benutzt die Liste der aktiven Sprache', () => {
  it('gibt auf Englisch englische Namen', () => {
    const de = rangstand(200, rangnamen('de'));
    const en = rangstand(200, rangnamen('en'));
    expect(de.titel).toBe(RANGNAMEN.de[de.level - 1]);
    expect(en.titel).toBe(RANGNAMEN.en[en.level - 1]);
    expect(de.level).toBe(en.level);
  });

  it('rechnet unabhängig von der Sprache dasselbe', () => {
    /* Die Namen sind Anzeige; Schwellen, Anteil und Rest dürfen sich
       zwischen den Sprachen nicht unterscheiden. */
    for (const xp of [0, 1, 74, 75, 150, 999, 100000]) {
      const de = rangstand(xp, rangnamen('de'));
      const en = rangstand(xp, rangnamen('en'));
      expect({ ...de, titel: '', naechsterTitel: '' })
        .toEqual({ ...en, titel: '', naechsterTitel: '' });
    }
  });

  it('bleibt ohne Angabe bei den deutschen Namen', () => {
    /* Damit Aufrufe ohne Sprache — Tests, Werkzeuge — gültig bleiben. */
    expect(rangstand(0).titel).toBe(RANGNAMEN.de[0]);
  });
});


describe('Es gibt die Liste nur einmal', () => {
  it('steht in keiner zweiten Datei', () => {
    /* Zwei Abschriften driften auseinander — hier war es schon passiert,
       bevor es jemandem auffiel. */
    const dateien = ['src/state/AppState.tsx', 'src/i18n/index.tsx'];
    for (const d of dateien) {
      const s = readFileSync(d, 'utf8');
      expect(s, `${d} zählt Rangnamen selbst auf`).not.toContain('Küchentisch-Spieler');
      expect(s, `${d} zählt Rangnamen selbst auf`).not.toContain('Kitchen-Table Player');
    }
  });

  it('gibt über die Liste hinaus den letzten Namen', () => {
    /* Die Level gehen weiter, die Namen nicht. */
    const letzter = RANGNAMEN.de[RANGNAMEN.de.length - 1];
    expect(rangname(RANGNAMEN.de.length + 50, 'de')).toBe(letzter);
    expect(rangname(0, 'de')).toBe(RANGNAMEN.de[0]);
  });
});
