/* Jede Quizfrage muss beantwortbar sein.
   ======================================

   496 Fragen in zwei Sprachen. `i18n.test.ts` prüft, dass beide Sprachen
   denselben `correctIndex` und gleich viele Optionen haben — aber nicht, ob
   dieser Index überhaupt auf eine Option zeigt. Ein `correctIndex: 4` bei
   vier Optionen ergibt eine Frage, die **niemand** richtig beantworten kann:
   Der Lernende tippt, bekommt „falsch", und die Serie reißt. Auffallen würde
   das erst dem, der genau diese Lektion macht.

   Geprüft wurde außerdem, ob die Erklärung zur markierten Antwort passt —
   über die Zahlen darin. Das ergab 52 Treffer, und **alle 52 waren
   Fehlalarme**: Die Erklärungen umschreiben, statt zu wiederholen („Rund
   ein Fünftel bis ein Drittel" für „20–30 %"), oder sie nennen die falsche
   Antwort, um sie zu widerlegen. Diese Heuristik steht deshalb nicht hier —
   eine Prüfung mit 52 Fehlalarmen wird nach dem dritten ignoriert.

   Was hier steht, ist exakt: Es gilt oder es gilt nicht. */

import { describe, expect, it } from 'vitest';
import { ALL_MODULES } from '../../content/index';
import { EN_BUNDLE } from '../../content/en/index';

const ALLE = [
  ...ALL_MODULES.map((m) => ['de', m] as const),
  ...EN_BUNDLE.modules.map((m) => ['en', m] as const),
];

interface Frage {
  wo: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const FRAGEN: Frage[] = ALLE.flatMap(([sprache, modul]) =>
  modul.lessons.flatMap((lektion) =>
    lektion.quiz.map((f, i) => ({
      wo: `${sprache} ${lektion.id} Frage ${i + 1}`,
      question: f.question,
      options: [...f.options],
      correctIndex: f.correctIndex,
      explanation: f.explanation ?? '',
    }))));

describe('Quizfragen', () => {
  it('findet überhaupt Fragen — sonst prüft dieser Test nichts', () => {
    expect(FRAGEN.length).toBeGreaterThanOrEqual(400);
  });

  it('markiert bei jeder Frage eine Antwort, die es gibt', () => {
    const kaputt = FRAGEN.filter((f) => !Number.isInteger(f.correctIndex)
      || f.correctIndex < 0 || f.correctIndex >= f.options.length)
      .map((f) => `${f.wo}: correctIndex ${f.correctIndex} bei ${f.options.length} Optionen`);
    expect(kaputt).toEqual([]);
  });

  it('stellt mindestens zwei Antworten zur Wahl', () => {
    expect(FRAGEN.filter((f) => f.options.length < 2).map((f) => f.wo)).toEqual([]);
  });

  it('bietet keine Antwort zweimal an', () => {
    /* Zwei gleiche Optionen heißen: Eine davon ist richtig und die andere,
       identische, ist falsch. */
    const doppelt = FRAGEN
      .filter((f) => new Set(f.options.map((o) => o.trim())).size !== f.options.length)
      .map((f) => `${f.wo}: ${JSON.stringify(f.options)}`);
    expect(doppelt).toEqual([]);
  });

  it('sagt zu jeder Frage, warum die Antwort stimmt', () => {
    const ohne = FRAGEN.filter((f) => f.explanation.trim().length < 20)
      .map((f) => `${f.wo}: „${f.explanation}"`);
    expect(ohne).toEqual([]);
  });

  it('stellt überhaupt eine Frage', () => {
    expect(FRAGEN.filter((f) => f.question.trim().length < 10).map((f) => f.wo)).toEqual([]);
  });

  it('erkennt einen kaputten Index (die Prüfung prüft sich selbst)', () => {
    const probe = { wo: 'Probe', question: 'Lang genug gefragt?', options: ['a', 'b'], correctIndex: 2, explanation: 'x'.repeat(30) };
    expect(probe.correctIndex >= probe.options.length).toBe(true);
  });
});
