/* Das Tages-Quiz zieht nur aus dem, was man gelernt hat.
   ======================================================

   Es zog vorher fünf Fragen aus allen 248 — am 2. Oktober 2026 stammten vier
   aus Modulen, die der Nutzer nie geöffnet hatte, eine aus dem für Gratis
   gesperrten Profi-Modul. Eine Prüfung über Stoff, den man nie gesehen hat,
   ist keine Wiederholung, sondern ein Rätsel — und eine falsche Antwort
   wanderte dann auch noch in den Wiederholstapel, als hätte man etwas
   vergessen, das man nie wusste.

   Der Pool besteht deshalb aus den Fragen **abgeschlossener** Lektionen. Ist
   er leer, gibt es kein Quiz, sondern den Hinweis, zuerst eine Lektion zu
   machen. (Sobald Paket 5.1 eine Bestehensgrenze einführt, heißt
   „abgeschlossen" hier „bestanden" — `abgeschlossen` ist das einzige, was
   sich dann ändert.) */

import type { Module, QuizQuestion } from '../content/types';
import { seededRng } from './zufall';

/** Wie viele Fragen ein Tag bringt. */
export const FRAGEN_PRO_TAG = 5;

export interface PoolFrage extends QuizQuestion {
  /** Anzeige: „Modul · Lektion". */
  source: string;
  moduleId: string;
  lessonId: string;
  /** Index in `lesson.quiz` — der Schlüssel für den Wiederholstapel. */
  qi: number;
}

/** Alle Fragen der abgeschlossenen Lektionen. */
export function quizPool(modules: Module[], abgeschlossen: Record<string, unknown>): PoolFrage[] {
  const pool: PoolFrage[] = [];
  for (const m of modules) {
    for (const l of m.lessons) {
      if (!abgeschlossen[l.id]) continue;
      l.quiz.forEach((q, qi) => {
        pool.push({ ...q, source: `${m.title} · ${l.title}`, moduleId: m.id, lessonId: l.id, qi });
      });
    }
  }
  return pool;
}

/** Die Fragen von `tag`: Mischen mit Datums-Seed, die ersten `n`. Weniger,
 *  wenn der Pool kleiner ist — nie aufgefüllt aus Ungelerntem. */
export function ziehe(pool: PoolFrage[], tag: string, n = FRAGEN_PRO_TAG): PoolFrage[] {
  const kopie = pool.slice();
  const rng = seededRng(tag);
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [kopie[i], kopie[j]] = [kopie[j], kopie[i]];
  }
  return kopie.slice(0, n);
}
