import { defineStrings } from '..';

/* Texte der Lernpfad-Übersicht. */
export const STR = defineStrings(
  {
    eyebrow: 'Lernen',
    title: 'Lernpfad',
    sub: 'Neun Module vom ersten Blatt bis zu Profi-Strategie und Varianten. Arbeite sie der Reihe nach durch – jede Lektion endet mit einem Quiz, das dein Verständnis prüft und XP bringt.',
    minuten: (n: number) => `${n} Min.`,
    weiterLektion: (titel: string, min: number) => `Weiter: ${titel} · ${min} Min.`,
    proTitle: 'Pro-Insights: Von den Besten lernen',
    proSub: 'Die Prinzipien von Fedor Holz, Negreanu, Polk & Co. – plus die teuersten Anfängerfehler aus Profi-Sicht.',
    newPill: 'Neu',

    /* ── Der Lernpfad als Pfad (E-037) ──────────────────────────────── */
    rangMarke: 'Dein Rang',
    rangBis: (fehlt: number, titel: string) => `Noch ${fehlt} XP bis ${titel}`,
    rangHoechster: 'Höchster Rang erreicht',
    rangRing: (level: number, titel: string) => `Level ${level}, ${titel}`,
    pfadMarke: 'Der Weg',
    stufeOffen: 'Hier weiter',
    stufeFertig: 'Fertig',
    stufeRing: (done: number, gesamt: number) => `${done} von ${gesamt} Lektionen`,
    doneLine: (done: number, total: number) => `${done} / ${total} Lektionen abgeschlossen`,

    // Übungsblock: alles, was zum Kurs gehört, aber keine Lektion ist.
    trainerQuote: (p: number) => `${p} % richtig`,
    drillTitle: 'Pot-Odds-Drill',
    drillSub: 'Eine Situation, eine Entscheidung, die gerechnete Zahl. Ohne Zeitdruck.',
    drillPill: 'Neu',

    practiceGroupTitle: 'Üben und festigen',
    reviewTitle: 'Wiederholen',
    reviewSub: 'Was du falsch hattest, im richtigen Abstand nochmal',
    reviewDue: (n: number) => `${n} fällig`,
    quizTitle: 'Tages-Quiz',
    quizSub: 'Fünf Fragen, jeden Tag neu',
    quizOpen: 'offen',
    practiceTitle: 'Übungstisch',
    practiceSub: 'Gegen Computergegner spielen, ohne Einsatz',
    styleTitle: 'Spielstil-Analyse',
    styleSub: 'Was deine Hände über dich verraten',
  },
  {
    eyebrow: 'Learn',
    title: 'Learning Path',
    sub: 'Nine modules from your first hand to pro strategy and variants. Work through them in order – every lesson ends with a quiz that checks your understanding and earns you XP.',
    minuten: (n: number) => `${n} min`,
    weiterLektion: (titel: string, min: number) => `Next: ${titel} · ${min} min`,
    proTitle: 'Pro Insights: Learn from the Best',
    proSub: 'The principles of Fedor Holz, Negreanu, Polk & co. – plus the most expensive beginner mistakes from a pro’s point of view.',
    newPill: 'New',

    /* ── The learning path as a path (E-037) ────────────────────────── */
    rangMarke: 'Your rank',
    rangBis: (fehlt: number, titel: string) => `${fehlt} XP to ${titel}`,
    rangHoechster: 'Highest rank reached',
    rangRing: (level: number, titel: string) => `Level ${level}, ${titel}`,
    pfadMarke: 'The path',
    stufeOffen: 'Continue here',
    stufeFertig: 'Done',
    stufeRing: (done: number, gesamt: number) => `${done} of ${gesamt} lessons`,
    doneLine: (done: number, total: number) => `${done} / ${total} lessons completed`,

    trainerQuote: (p: number) => `${p} % correct`,
    drillTitle: 'Pot odds drill',
    drillSub: 'One spot, one decision, the computed number. No clock.',
    drillPill: 'New',

    practiceGroupTitle: 'Practise and cement',
    reviewTitle: 'Review',
    reviewSub: 'What you got wrong, again at the right interval',
    reviewDue: (n: number) => `${n} due`,
    quizTitle: 'Daily quiz',
    quizSub: 'Five questions, new every day',
    quizOpen: 'open',
    practiceTitle: 'Practice table',
    practiceSub: 'Play computer opponents, nothing at stake',
    styleTitle: 'Playing-style analysis',
    styleSub: 'What your hands say about you',
  },
);
