import { defineStrings } from '..';

/* Texte der Modul-Übersicht. */
export const STR = defineStrings(
  {
    notFound: 'Modul nicht gefunden.',
    backToPath: 'Zurück zum Lernpfad',
    back: '← Lernpfad',
    lessonMeta: (duration: number, questions: number) => `ca. ${duration} Min. · ${questions} Quizfragen`,
    quizResult: (score: number, total: number) => ` · Quiz: ${score}/${total}`,
  },
  {
    notFound: 'Module not found.',
    backToPath: 'Back to the learning path',
    back: '← Learning Path',
    lessonMeta: (duration: number, questions: number) => `approx. ${duration} min · ${questions} quiz questions`,
    quizResult: (score: number, total: number) => ` · Quiz: ${score}/${total}`,
  },
);
