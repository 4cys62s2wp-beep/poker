/* Was ein Quiz leisten muss.
   ==========================

   **Bestehen heißt verstanden.** Bis hierher galt 0 von 5 als „abgeschlossen":
   `QuizRunner` rief am Ende immer `onFinish`, und `completeLesson` kannte keine
   Schwelle — das Ergebnis war ein Haken, das Abzeichen „Erste Schritte" und 60
   XP für fünf falsche Antworten. Die Lektion in der Modulübersicht stand dann
   als „Abgeschlossen · Quiz: 0/5" da, und die nächste hielt der Pfad für
   freigeschaltet.

   Jetzt gilt eine Grenze — vier von fünf. Darunter ist die Lektion
   **versucht**, mit dem besten Ergebnis, und der Hauptknopf heißt „Fehler
   nochmal üben". Die Grenze ist hoch genug, dass Raten sie nicht schafft
   (bei vier Optionen trifft man vier von fünf mit einer Wahrscheinlichkeit
   unter 2 %), und niedrig genug, dass ein Fehler verzeihlich bleibt.

   **Die Optionen werden gemischt.** In 58 % der 248 Fragen war B richtig, in
   keiner D; wer immer B antwortete, bestand. Gemischt wird je Anzeige — mit
   einem frischen Startwert im Quiz einer Lektion (ein zweiter Versuch zeigt
   eine andere Reihenfolge), mit dem Datum im Tages-Quiz (alle haben am selben
   Tag dieselbe). Gespeichert wird nie die gemischte Reihenfolge, sondern die
   Abbildung „angezeigte Stelle → Originalstelle": Der Wiederholstapel kennt
   Fragen nur nach ihrem Original-Index. */

import type { QuizQuestion } from '../../content/types';
import { seededRng } from '../zufall';

/** Anteil richtiger Antworten, ab dem eine Lektion als verstanden gilt. */
export const BESTEHENS_ANTEIL = 0.8;

/** Wie viele Fragen richtig sein müssen — bei fünf Fragen vier. */
export function grenze(total: number): number {
  return Math.ceil(BESTEHENS_ANTEIL * total);
}

export function bestanden(score: number, total: number): boolean {
  return total > 0 && score >= grenze(total);
}

/** Der feste Teil der XP für eine bestandene Lektion. */
export const XP_FEST = 20;
/** Der Teil, der am Ergebnis hängt. */
export const XP_ERGEBNIS = 80;

/** XP für das erste Bestehen: 20 fest, 80 nach Anteil. Vorher 60 + 40 × Anteil —
 *  damit bekam man für nichts fast zwei Drittel von allem. */
export function lektionsXp(score: number, total: number): number {
  return XP_FEST + Math.round((XP_ERGEBNIS * score) / Math.max(1, total));
}

/** Eine zufällige Anordnung von 0 … n−1 (Fisher-Yates mit Startwert). */
export function anordnung(n: number, startwert: string): number[] {
  const rng = seededRng(startwert);
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface GemischteFrage {
  /** Die Frage mit den Optionen in angezeigter Reihenfolge. */
  frage: QuizQuestion;
  /** Angezeigte Stelle → Stelle im Original. */
  original: number[];
}

/** Mischt die Optionen einer Frage; `correctIndex` zeigt auf die neue Stelle.
 *  Optionen, die sich auf eine Stelle beziehen („Antwort B"), gibt es in den
 *  Inhalten nicht (`quiz.test.ts` prüft das). */
export function mischeFrage(q: QuizQuestion, startwert: string): GemischteFrage {
  const original = anordnung(q.options.length, startwert);
  return {
    frage: {
      ...q,
      options: original.map((o) => q.options[o]),
      correctIndex: original.indexOf(q.correctIndex),
      /* Die Erklärung je Option wandert mit ihrer Option. */
      ...(q.optionFeedback ? { optionFeedback: original.map((o) => q.optionFeedback![o] ?? '') } : {}),
    },
    original,
  };
}

/** Die gemischten Fragen eines Durchgangs. Der Startwert jeder Frage hängt von
 *  ihrer Stelle ab, sonst bekämen zwei Fragen mit gleich vielen Optionen
 *  dieselbe Anordnung. */
export function mischeAlle(fragen: QuizQuestion[], startwert: string): GemischteFrage[] {
  return fragen.map((q, i) => mischeFrage(q, `${startwert}:${i}`));
}
