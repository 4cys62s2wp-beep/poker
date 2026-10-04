/* Jede Pokeraktion hat genau ein Wort.
   ====================================

   Siehe `src/i18n/begriffe.ts`. Diese Prüfung liest alle deutschen Texte der
   App — Oberfläche, Lektionen, Glossar, Szenarien — und meldet jeden
   verbotenen Ausdruck. Die Regeln stehen als Daten in der Liste; hier steht
   nur, wie sie angewandt werden. */

import { describe, expect, it } from 'vitest';
import { BEGRIFFE, MODUL_STUFEN } from '../../i18n/begriffe';
import { ALL_MODULES } from '../../content';
import { alleDeutschenTexte } from './helfer/deutsche-texte';

/* Die Liste selbst nennt die verbotenen Wörter — als Beispiele, nicht als Text. */
const TEXTE = alleDeutschenTexte().filter((t) => !t.datei.endsWith('i18n/begriffe.ts'));

/** Lektionen und Szenarien erklären Fachwörter; die Oberfläche benutzt sie. */
const LEKTIONEN = ['src/content/modules/', 'src/content/scenarios.ts', 'src/content/glossary.ts'];

function treffer(b: (typeof BEGRIFFE)[number]) {
  return TEXTE.filter((t) => {
    if (b.ausser?.some((a) => t.datei.includes(a))) return false;
    if (b.gilt === 'oberflaeche' && LEKTIONEN.some((a) => t.datei.includes(a))) return false;
    return b.verboten.test(t.text);
  });
}

describe('Begriffe', () => {
  it('findet überhaupt Text — sonst prüft dieser Test nichts', () => {
    expect(TEXTE.length).toBeGreaterThan(8000);
  });

  it.each(BEGRIFFE.map((b) => [b.gegenstand, b] as const))('%s: löst auf dem Beispielsatz aus', (_n, b) => {
    expect(b.verboten.test(b.beispiel), `„${b.beispiel}" müsste die Regel auslösen`).toBe(true);
    expect(b.verboten.test(b.wort), `das gültige Wort „${b.wort}" darf nicht selbst verboten sein`).toBe(false);
  });

  it.each(BEGRIFFE.map((b) => [b.gegenstand, b] as const))('%s: kein verbotener Ausdruck im Text', (_n, b) => {
    const t = treffer(b);
    expect(
      t.slice(0, 8).map((x) => `${x.wo} | ${x.text.replace(/\n/g, ' ').slice(0, 80)}`),
      `${t.length} Stellen — stattdessen „${b.wort}"`,
    ).toEqual([]);
  });

  it.each(BEGRIFFE.map((b) => [b.gegenstand, b] as const))('%s: das gültige Wort kommt vor', (_n, b) => {
    /* Eine Regel, deren Wort nirgends steht, ist tot — oder das Wort ist falsch
       geschrieben. */
    expect(TEXTE.some((t) => t.text.includes(b.wort)), `„${b.wort}" steht nirgends`).toBe(true);
  });
});

describe('Schwierigkeitsstufen', () => {
  it('heißen Einsteiger, Fortgeschritten, Experte — „Pro" gehört dem Abo', () => {
    const stufen = new Set(ALL_MODULES.map((m) => m.level));
    expect([...stufen].filter((s) => !(MODUL_STUFEN as readonly string[]).includes(s))).toEqual([]);
  });
});
