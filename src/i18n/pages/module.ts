import { defineStrings } from '..';

/* Texte der Modul-Übersicht. */
export const STR = defineStrings(
  {
    notFound: 'Modul nicht gefunden.',
    backToPath: 'Zurück zum Lernpfad',
    lessonMeta: (duration: number, questions: number) => `ca. ${duration} Min. · ${questions} Quizfragen`,
    quizResult: (score: number, total: number) => ` · Quiz: ${score}/${total}`,

    /* ── Fortschritt im Modul (E-037) ───────────────────────────────── */
    fortschrittMarke: 'Fortschritt',
    fortschritt: (done: number, gesamt: number) => `${done} von ${gesamt} Lektionen`,
    fortschrittRing: (done: number, gesamt: number) => `${done} von ${gesamt} Lektionen abgeschlossen`,
    modulFertig: 'Modul abgeschlossen',
    lektionDran: 'Hier weiter',
    lektionFertig: 'Abgeschlossen',
    lektionVersucht: 'Noch einmal',
    perTest: 'Per Test bestanden',
    xpBis: (bis: number) => `bis ${bis} XP`,

    /* ── Modultest: „Kenne ich schon“ (E-097) ──────────────────────── */
    testKnopf: 'Kenne ich schon – Modultest',
    testTitel: 'Modultest',
    testSub: (n: number, grenze: number) =>
      `${n} Fragen aus dem ganzen Modul. Bei ${grenze} richtigen zählt es als geschafft — ohne XP, falsche Fragen kommen in die Wiederholung.`,
    testBestanden: 'Bestanden',
    testKnapp: 'Knapp daneben',
    testBestandenText: 'Das Modul zählt als geschafft. XP und Abzeichen für gelesene Lektionen gibt es dafür nicht.',
    testKnappText: (falsch: number) =>
      falsch === 1
        ? 'Eine Frage kommt in die Wiederholung. Geh das Modul in Ruhe durch — oder versuch den Test noch einmal.'
        : `${falsch} Fragen kommen in die Wiederholung. Geh das Modul in Ruhe durch — oder versuch den Test noch einmal.`,
    testWeiter: (modul: string) => `Weiter mit ${modul}`,
    testZumPfad: 'Zum Lernpfad',
    testNochmal: 'Test wiederholen',
    testDurchgehen: 'Modul durchgehen',
  },
  {
    notFound: 'Module not found.',
    backToPath: 'Back to the learning path',
    lessonMeta: (duration: number, questions: number) => `approx. ${duration} min · ${questions} quiz questions`,
    quizResult: (score: number, total: number) => ` · Quiz: ${score}/${total}`,

    /* ── Progress within the module (E-037) ─────────────────────────── */
    fortschrittMarke: 'Progress',
    fortschritt: (done: number, gesamt: number) => `${done} of ${gesamt} lessons`,
    fortschrittRing: (done: number, gesamt: number) => `${done} of ${gesamt} lessons completed`,
    modulFertig: 'Module completed',
    lektionDran: 'Continue here',
    lektionFertig: 'Completed',
    lektionVersucht: 'Try again',
    perTest: 'Passed by test',
    xpBis: (bis: number) => `up to ${bis} XP`,

    /* ── Module test: “I know this already” (E-097) ─────────────────── */
    testKnopf: 'I know this – module test',
    testTitel: 'Module test',
    testSub: (n: number, grenze: number) =>
      `${n} questions from across the module. With ${grenze} correct it counts as done — no XP, and wrong questions go into your review.`,
    testBestanden: 'Passed',
    testKnapp: 'Just missed',
    testBestandenText: 'The module counts as done. There is no XP and no badge for lessons you read.',
    testKnappText: (falsch: number) =>
      falsch === 1
        ? 'One question goes into your review. Work through the module at your own pace — or try the test again.'
        : `${falsch} questions go into your review. Work through the module at your own pace — or try the test again.`,
    testWeiter: (modul: string) => `Continue with ${modul}`,
    testZumPfad: 'To the learning path',
    testNochmal: 'Repeat the test',
    testDurchgehen: 'Work through the module',
  },
);
