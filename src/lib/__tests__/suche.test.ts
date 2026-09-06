/* Die Suche darf nicht an der Form eines Apostrophs scheitern.
   ===========================================================

   Seit E-050 steht in den Texten „Hold’em". Eine Tastatur liefert je nach
   Gerät mal ’ und mal ' — beides muss dasselbe finden. */

import { describe, expect, it } from 'vitest';
import { suchbar } from '../eingabe/suche';
import { ALL_MODULES } from '../../content/index';

describe('Suchtext', () => {
  it('macht aus beiden Apostrophformen dieselbe', () => {
    expect(suchbar('Hold’em')).toBe(suchbar("Hold'em"));
    expect(suchbar('„Wert“')).toBe(suchbar('"Wert"'));
    expect(suchbar('“Value”')).toBe(suchbar('"Value"'));
    expect(suchbar('GROSS')).toBe('gross');
  });

  it('ändert die Länge nicht — sonst zeigt die Lernsuche die falsche Stelle', () => {
    /* `makeSnippet` sucht die Fundstelle im aufbereiteten Text und schneidet
       sie aus dem **Originaltext** heraus. Das geht nur auf, wenn jedes
       Zeichen durch genau eines ersetzt wird. */
    for (const t of ['Hold’em', '„Wert“ und “value”', 'ganz normal', 'ÄÖÜ ß']) {
      expect(suchbar(t).length, t).toBe(t.length);
    }
  });

  it('findet „Hold’em" im Lernstoff, egal wie der Apostroph getippt wird', () => {
    const stellen = ALL_MODULES.flatMap((m) =>
      m.lessons.flatMap((l) => [l.title, l.intro, ...l.sections.flatMap((s) => [s.heading, s.body])]));
    const mitApostroph = stellen.filter((t) => t.includes('Hold’em'));
    expect(mitApostroph.length, 'Der Lernstoff nennt „Hold’em" nirgends').toBeGreaterThan(3);

    /* Beide Schreibweisen der Anfrage müssen dieselben Stellen finden. */
    const treffer = (frage: string) => stellen.filter((t) => suchbar(t).includes(suchbar(frage))).length;
    expect(treffer("hold'em")).toBe(treffer('hold’em'));
    expect(treffer("Hold'em")).toBeGreaterThanOrEqual(mitApostroph.length);
  });
});
