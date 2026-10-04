/* Die Schriftskala wird durchgesetzt, nicht nur beschrieben.
   =========================================================

   DESIGN.md §1 kannte seit E-032 fünf Stufen — und das Stylesheet daneben
   hatte 73 Schriftgrößen, die keine davon benutzten (0,4375 rem, 0,5 rem,
   0,53125 rem …). Fließtext stand bei 15 px, Kleingedrucktes bei 11,5 px, und
   dieses Kleingedruckte trug 39 Stellen, darunter „Er setzt 32 in 96" — die
   Angabe, ohne die man die Frage nicht beantworten kann (E-074).

   Dieser Test hält fest, was seither gilt:

   1. **Fließtext 16 px.** Über 45 000 Wörter Lektionstext werden in dieser
      Größe gelesen; 15 px sind für lange Strecken auf dem Handy zu klein.
   2. **Nichts unter 12 px** außer an Kartenflächen, Würfelknopf und
      Matrixzellen — dort bestimmt die Geometrie die Größe.
   3. **Serife nur für Titel.** Fraunces hat Kontraste, die unterhalb der
      Überschriftstufe zerfallen: „Du", „50 %" und Zählerstände sind in ihr
      schlechter lesbar als in der Grotesk.
   4. **Zeilen unter 70 Zeichen.** `.prose` stand auf 730 px, das sind rund
      95 Zeichen je Zeile. */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const CSS = readFileSync('src/styles/global.css', 'utf8');

/** Alle Regelblöcke: Selektor und Inhalt. Verschachtelte @media werden
 *  flachgezogen — gebraucht wird nur „welcher Selektor setzt was". */
function bloecke(): Array<{ selektor: string; inhalt: string }> {
  const aus: Array<{ selektor: string; inhalt: string }> = [];
  const ohneKommentare = CSS.replace(/\/\*[\s\S]*?\*\//g, '');
  const muster = /([^{}]+)\{([^{}]*)\}/g;
  let m: RegExpExecArray | null;
  while ((m = muster.exec(ohneKommentare)) !== null) {
    aus.push({ selektor: m[1].trim().replace(/\s+/g, ' '), inhalt: m[2] });
  }
  return aus;
}

const rem = (wert: string): number | null => {
  const m = wert.match(/^([0-9.]+)rem$/);
  return m ? Number(m[1]) : null;
};

/** Hier bestimmt die Geometrie die Größe, nicht das Lesen. */
const GEOMETRIE = ['.pcard', '.filz .board', '.du-karten', '.matrix .cell', '.dealer-btn',
  '.picker-key', '.suit-deco', '.abzeichen-medaille', '.filz::after'];

describe('Schriftskala', () => {
  it('setzt Fließtext auf 16 px', () => {
    expect(CSS).toMatch(/--fs-fliesstext:\s*1rem;/);
    expect(CSS).toMatch(/body\s*\{[^}]*font-size:\s*(1rem|var\(--fs-fliesstext\))/);
  });

  it('hält Beschriftung bei mindestens 14 px und Kleingedrucktes bei mindestens 12 px', () => {
    expect(rem(CSS.match(/--fs-beschriftung:\s*([^;]+);/)?.[1] ?? '')).toBeGreaterThanOrEqual(0.875);
    expect(rem(CSS.match(/--fs-kleingedrucktes:\s*([^;]+);/)?.[1] ?? '')).toBeGreaterThanOrEqual(0.75);
  });

  it('lässt unter 12 px nur die Geometrie sprechen', () => {
    const zuKlein: string[] = [];
    for (const b of bloecke()) {
      const w = b.inhalt.match(/font-size:\s*([^;]+);/)?.[1].trim();
      const r = w ? rem(w) : null;
      if (r !== null && r < 0.75 && !GEOMETRIE.some((g) => b.selektor.includes(g))) {
        zuKlein.push(`${b.selektor} → ${w}`);
      }
    }
    expect(zuKlein, 'Text unter 12 px ist auf dem Handy nicht lesbar. Entweder eine der '
      + 'fünf Stufen nehmen oder in GEOMETRIE begründen.').toEqual([]);
  });

  it('führt keine Rohgröße im Textbereich mehr: alles zwischen 12 und 24 px ist ein Token', () => {
    const roh: string[] = [];
    for (const b of bloecke()) {
      const w = b.inhalt.match(/font-size:\s*([^;]+);/)?.[1].trim();
      const r = w ? rem(w) : null;
      if (r !== null && r <= 1.5 && !GEOMETRIE.some((g) => b.selektor.includes(g))
        && !['.brand .spade', '.nav-link .ico', '.mobile-top .spade', '.tell-item .t-ico'].some((s) => b.selektor.includes(s))
        && b.selektor !== 'body') {
        roh.push(`${b.selektor} → ${w}`);
      }
    }
    expect(roh, 'Eine Größe, die keine der fünf Stufen ist, entsteht „weil sie gerade passt" '
      + '(DESIGN.md §1). Die passende Stufe nehmen.').toEqual([]);
  });

  it('setzt die Serife nur auf Titel — nie unterhalb der Überschriftstufe', () => {
    const verstoesse: string[] = [];
    /* Diese Blöcke setzen die Größe an anderer Stelle (h1–h3, Marke) oder sind
       Anzeigeziffern oberhalb der Überschriftstufe. */
    const OHNE_EIGENE_GROESSE = ['h1, h2, h3', '.start-einstieg .titel'];
    for (const b of bloecke()) {
      if (!/font-family:\s*var\(--font-display\)/.test(b.inhalt)) continue;
      const w = b.inhalt.match(/font-size:\s*([^;]+);/)?.[1].trim();
      if (!w) {
        if (!OHNE_EIGENE_GROESSE.includes(b.selektor)) verstoesse.push(`${b.selektor} → keine Größe`);
        continue;
      }
      const klein = w === 'var(--fs-fliesstext)' || w === 'var(--fs-beschriftung)'
        || w === 'var(--fs-kleingedrucktes)' || w === 'var(--fs-small)' || w === 'var(--fs-body)'
        || w === 'var(--fs-tiny)' || (rem(w) !== null && (rem(w) as number) < 1.1875);
      if (klein) verstoesse.push(`${b.selektor} → ${w}`);
    }
    expect(verstoesse, 'Fraunces hat feine Kontraste, die unterhalb der Überschriftstufe '
      + 'zerfallen. Für Zahlen, Namen und Knöpfe: Manrope mit tabular-nums.').toEqual([]);
  });

  it('begrenzt den Fließtext auf eine lesbare Zeilenlänge', () => {
    const w = CSS.match(/\.prose\s*\{\s*max-width:\s*([0-9.]+)ch;/)?.[1];
    expect(w, '.prose braucht eine Breite in ch, nicht in px').toBeTruthy();
    expect(Number(w)).toBeLessThanOrEqual(70);
  });

  it('zeigt die Angaben, die eine Entscheidung braucht, nie im Kleingedruckten', () => {
    const lage = bloecke().find((b) => b.selektor === '.heute-frage .lage');
    expect(lage?.inhalt).toMatch(/font-size:\s*var\(--fs-fliesstext\)/);
    expect(lage?.inhalt).toMatch(/color:\s*var\(--text\)/);
  });

  it('schreibt lange Etiketten in Satzschreibung statt in Versalien', () => {
    /* „Wie viele Spieler sitzen am Tisch (mit dir)?" in Großbuchstaben liest
       sich wie Schreien — und aus Handnotation „AKs" wird „AKS". */
    expect(CSS).toMatch(/\.stat-label\.satz\s*\{[^}]*text-transform:\s*none/);
  });
});
