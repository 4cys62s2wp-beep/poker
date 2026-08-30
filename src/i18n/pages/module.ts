import { defineStrings } from '..';

/* Texte der Modul-Übersicht. */
export const STR = defineStrings(
  {
    notFound: 'Modul nicht gefunden.',
    backToPath: 'Zurück zum Lernpfad',
    back: '← Lernpfad',
    lessonMeta: (duration: number, questions: number) => `ca. ${duration} Min. · ${questions} Quizfragen`,
    quizResult: (score: number, total: number) => ` · Quiz: ${score}/${total}`,

    /* ── Fortschritt im Modul (E-037) ───────────────────────────────── */
    fortschrittMarke: 'Fortschritt',
    fortschritt: (done: number, gesamt: number) => `${done} von ${gesamt} Lektionen`,
    fortschrittRing: (done: number, gesamt: number) => `${done} von ${gesamt} Lektionen abgeschlossen`,
    modulFertig: 'Modul abgeschlossen',
    lektionDran: 'Hier weiter',
    lektionFertig: 'Abgeschlossen',
    xpBis: (bis: number) => `bis ${bis} XP`,
    xpBekommen: (xp: number) => `+${xp} XP`,
  },
  {
    notFound: 'Module not found.',
    backToPath: 'Back to the learning path',
    back: '← Learning Path',
    lessonMeta: (duration: number, questions: number) => `approx. ${duration} min · ${questions} quiz questions`,
    quizResult: (score: number, total: number) => ` · Quiz: ${score}/${total}`,

    /* ── Progress within the module (E-037) ─────────────────────────── */
    fortschrittMarke: 'Progress',
    fortschritt: (done: number, gesamt: number) => `${done} of ${gesamt} lessons`,
    fortschrittRing: (done: number, gesamt: number) => `${done} of ${gesamt} lessons completed`,
    modulFertig: 'Module completed',
    lektionDran: 'Continue here',
    lektionFertig: 'Completed',
    xpBis: (bis: number) => `up to ${bis} XP`,
    xpBekommen: (xp: number) => `+${xp} XP`,
  },
);
