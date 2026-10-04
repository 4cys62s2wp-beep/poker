/* Die Zeile über dem Titel nennt den Bereich — oder es gibt sie nicht.
   ====================================================================

   Vorher stand über fast jedem Titel ein Satz, der nichts mit dem Ort zu tun
   hatte: „SPACED REPETITION", „DEIN CURRICULUM", „TURNIER-ENDGAME", „WISSEN
   WIRD KÖNNEN", „PokerMentor Pro" — Englisch, Slogans, und über „← Nachschlagen"
   noch einmal „NACHSCHLAGEN". Die Augenbraue hatte als Einzige im Layout
   keine Aufgabe (E-081). */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { STR as LERNEN } from '../../i18n/pages/learn';

function dateien(ordner: string, endung: RegExp, aus: string[] = []): string[] {
  for (const e of readdirSync(ordner)) {
    const p = join(ordner, e);
    if (statSync(p).isDirectory()) dateien(p, endung, aus);
    else if (endung.test(p)) aus.push(p);
  }
  return aus;
}

/** Die einzige Seite mit Augenbraue: oberste Ebene eines Bereichs, deren
 *  Titel den Bereich nicht nennt („Lernpfad"). Nachschlagen und Live-Session
 *  heißen als Seite wie als Bereich — dort wäre die Zeile eine Wiederholung. */
const MIT_AUGENBRAUE: Record<string, string> = {
  'src/i18n/pages/learn.ts': 'Lernen',
};

describe('Augenbraue', () => {
  it('nennt auf dem Lernpfad den Bereich', () => {
    expect(LERNEN.de.eyebrow).toBe('Lernen');
  });

  it('kommt in keiner anderen Textdatei als Schlüssel vor', () => {
    const fremde: string[] = [];
    for (const d of dateien('src/i18n/pages', /\.ts$/)) {
      const text = readFileSync(d, 'utf8');
      if (/^\s{4}(eyebrow|bereich):/m.test(text) && !(d in MIT_AUGENBRAUE)) fremde.push(d);
    }
    expect(fremde, 'Die Augenbraue nennt den Bereich oder entfällt.').toEqual([]);
  });

  it('wird in keiner anderen Seite gezeichnet', () => {
    const mit = dateien('src/pages', /\.tsx$/).filter((d) => {
      const t = readFileSync(d, 'utf8');
      return /<div className="eyebrow">\{\w+\.eyebrow\}<\/div>/.test(t);
    });
    expect(mit).toEqual(['src/pages/LearnPage.tsx']);
    const kopf = dateien('src/pages', /\.tsx$/).filter((d) => /eyebrow=\{/.test(readFileSync(d, 'utf8')));
    expect(kopf).toEqual([]);
  });

  it('trägt in der Farbe des Bereichs, auch die Linie davor', () => {
    const css = readFileSync('src/styles/global.css', 'utf8');
    const linie = css.slice(css.indexOf('.eyebrow::before'), css.indexOf('}', css.indexOf('.eyebrow::before')));
    expect(linie).toMatch(/var\(--bereich\)/);
    expect(linie).not.toMatch(/--auszeichnung/);
  });
});

describe('Untertitel', () => {
  const alle = dateien('src/i18n/pages', /\.ts$/).map((d) => readFileSync(d, 'utf8')).join('\n');

  it('begründen nicht das Design', () => {
    for (const satz of ['Getippt wird auf einen Namen', 'Such oder tipp', 'Bevor gespielt wird, nicht danach',
      'Wer seine Ergebnisse nicht kennt']) {
      expect(alle.includes(satz), `„${satz}" erklärt die Oberfläche statt dem Nutzer`).toBe(false);
    }
  });

  it('sprechen den Nutzer mit „du" an, nicht mit „wir"', () => {
    /* Rechtstexte sprechen für den Betreiber; dort ist „wir" richtig. */
    const ohneRecht = dateien('src/i18n/pages', /\.ts$/).filter((d) => !d.endsWith('legal.ts'))
      .map((d) => readFileSync(d, 'utf8')).join('\n');
    const wir = [...ohneRecht.matchAll(/'[^'\n]*\b(?:wir|Wir)\b[^'\n]*'/g)].map((m) => m[0].slice(0, 80));
    expect(wir).toEqual([]);
  });
});
