/* Der Modultest: „Kenne ich schon“.
   =================================

   Ein großer Teil der Zielgruppe kann schon spielen, gerade wer über die
   Live-Session kommt. Der Lernpfad schickte trotzdem jeden mit „Hier weiter“ zu
   „So funktioniert Texas Hold’em“ und zählte erledigte Module nur über gelesene
   Lektionen: Erfahrene sahen 0 von 49 Lektionen, den Rang „Neuling“ und
   Grundlagen-Fragen im Tages-Quiz (E-097).

   Ein Modultest zieht acht Fragen aus den Quizzen des Moduls — quer durch alle
   Lektionen, damit nicht eine Lektion allein geprüft wird. Wer mindestens sieben
   schafft, hat das Modul „per Test bestanden“: Es zählt als erledigt, bringt aber
   keine XP und nicht das Abzeichen „Erste Schritte“ — beides gehört dem, der die
   Lektionen durchgearbeitet hat. Falsche Fragen kommen in die Wiederholung. */

import type { Module } from '../../content/types';
import type { PoolFrage } from '../tagesquiz';
import { seededRng } from '../zufall';

/** Wie viele Fragen der Test stellt. */
export const TEST_FRAGEN = 8;
/** Wie viele davon richtig sein müssen — bei acht Fragen sieben. */
export const TEST_GRENZE = 7;

/** Anzahl richtiger Antworten, ab der der Test bestanden ist. Bei weniger Fragen
 *  (ein kleines Modul) gilt derselbe Anteil, aufgerundet; nie weniger als alle
 *  bis auf eine. */
export function grenzeFuer(total: number): number {
  return Math.min(total, Math.ceil((TEST_GRENZE / TEST_FRAGEN) * total));
}

export function testBestanden(score: number, total: number): boolean {
  return total > 0 && score >= grenzeFuer(total);
}

/**
 * Die Fragen des Tests: erst in jeder Lektion mischen, dann reihum je eine aus
 * jeder Lektion, bis `n` zusammen sind. So kommt jede Lektion vor, bevor eine
 * zweimal vorkommt — und wo es weniger Fragen gibt als `n`, werden es alle.
 */
export function ziehTestFragen(modul: Module, startwert: string, n = TEST_FRAGEN): PoolFrage[] {
  const rng = seededRng(startwert);
  const je: PoolFrage[][] = modul.lessons.map((l) => {
    const fragen: PoolFrage[] = l.quiz.map((q, qi) => ({
      ...q, source: `${modul.title} · ${l.title}`, moduleId: modul.id, lessonId: l.id, qi,
    }));
    for (let i = fragen.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      [fragen[i], fragen[j]] = [fragen[j], fragen[i]];
    }
    return fragen;
  });
  /* Die Reihenfolge der Lektionen mischen, damit nicht immer die erste die
     zweite Frage verliert, wenn das Modul mehr Lektionen als Fragen hat. */
  const reihenfolge = je.map((_, i) => i);
  for (let i = reihenfolge.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [reihenfolge[i], reihenfolge[j]] = [reihenfolge[j], reihenfolge[i]];
  }
  const aus: PoolFrage[] = [];
  for (let runde = 0; aus.length < n; runde += 1) {
    let neu = false;
    for (const k of reihenfolge) {
      const f = je[k][runde];
      if (f && aus.length < n) { aus.push(f); neu = true; }
    }
    if (!neu) break;
  }
  /* Die gezogenen Fragen noch einmal mischen: Sonst stünden die der ersten Runde
     alle vor denen der zweiten, und die Lektionen kämen der Reihe nach. */
  for (let i = aus.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [aus[i], aus[j]] = [aus[j], aus[i]];
  }
  return aus;
}
