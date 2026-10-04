/* Wo man im Quiz stehengeblieben ist.
   ===================================

   Das Quiz ist eine eigene Adresse (`/lernen/:modul/:lektion/quiz`); „Zurück"
   verlässt nur das Quiz. Vorher war es ein Zustand der Lektionsseite, und ein
   Zurück bei Frage 2 von 5 verwarf alles.

   Der Zwischenstand liegt in `sessionStorage`: Er soll das Verlassen und
   Wiederkommen überstehen, aber nicht den Tag — wer morgen wiederkommt, fängt
   mit frischem Kopf von vorn an. Gespeichert werden der Startwert der
   Mischung und die bestätigten Antworten, nichts sonst. */

import type { QuizZustand } from '../../components/QuizRunner';

const praefix = 'pokermentor-quiz-';

export function ladeQuizZustand(lektion: string, fragen: number): QuizZustand | null {
  try {
    const roh = sessionStorage.getItem(praefix + lektion);
    if (!roh) return null;
    const z = JSON.parse(roh) as Partial<QuizZustand> | null;
    if (!z || typeof z.startwert !== 'string' || !Array.isArray(z.antworten)) return null;
    const antworten = z.antworten.filter((a): a is number => Number.isInteger(a) && a >= 0 && a < 8);
    /* Mehr Antworten als Fragen, oder gar keine: nichts, woran man anknüpfen
       könnte. */
    if (antworten.length === 0 || antworten.length >= fragen) return null;
    return { startwert: z.startwert, antworten };
  } catch {
    return null;
  }
}

export function speichereQuizZustand(lektion: string, z: QuizZustand | null): void {
  try {
    if (z) sessionStorage.setItem(praefix + lektion, JSON.stringify(z));
    else sessionStorage.removeItem(praefix + lektion);
  } catch {
    /* Ohne Sitzungsspeicher bleibt das Quiz ein Quiz — nur ohne Wiederaufnahme. */
  }
}
