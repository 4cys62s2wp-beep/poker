import { defineStrings } from '..';

/* Texte der Lektionsseite. */
export const STR = defineStrings(
  {
    notFound: 'Lektion nicht gefunden.',
    backToPath: 'Zurück zum Lernpfad',
    lessonOf: (n: number, total: number) => `Lektion ${n} / ${total}`,
    duration: (min: number) => `ca. ${min} Min.`,
    completedPill: '✓ abgeschlossen',
    example: 'Beispiel',
    coachTip: 'Coach-Tipp',
    takeaways: 'Das nimmst du mit',
    startQuiz: (n: number) => `Quiz starten (${n} Fragen) →`,
    backToLesson: '← Zurück zur Lektion',
    nextLesson: (title: string) => `Nächste Lektion: ${title} →`,
    nextModule: (title: string) => `Weiter zu Modul: ${title} →`,
    moduleOverview: 'Modulübersicht',
  },
  {
    notFound: 'Lesson not found.',
    backToPath: 'Back to the learning path',
    lessonOf: (n: number, total: number) => `Lesson ${n} / ${total}`,
    duration: (min: number) => `approx. ${min} min`,
    completedPill: '✓ completed',
    example: 'Example',
    coachTip: 'Coach Tip',
    takeaways: 'Key takeaways',
    startQuiz: (n: number) => `Start quiz (${n} questions) →`,
    backToLesson: '← Back to lesson',
    nextLesson: (title: string) => `Next lesson: ${title} →`,
    nextModule: (title: string) => `Continue to module: ${title} →`,
    moduleOverview: 'Module Overview',
  },
);
