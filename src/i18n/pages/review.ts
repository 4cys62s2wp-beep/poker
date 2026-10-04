import { defineStrings } from '..';

/* Texte der Wiederholen-Seite (Spaced Repetition). */
export const STR = defineStrings(
  {
    title: 'Wiederholen',
    sub: 'Falsch beantwortete Fragen kommen in wachsenden Abständen wieder – bis du sie dreimal in Folge richtig hast.',
    due: (n: number) => `${n} fällig`,
    inDeck: (n: number) => `${n} im Stapel`,
    doneToday: (n: number) => `${n} heute bearbeitet`,
    emptyTitle: 'Dein Stapel ist leer',
    emptyText: 'Noch nichts zu wiederholen. Was du im Quiz falsch beantwortest, landet hier von selbst.',
    toPath: 'Zum Lernpfad',
    allDoneTitle: 'Alles erledigt!',
    allDoneText: 'Für heute ist nichts mehr fällig.',
    nextDue: (tage: number) => `Die nächste Wiederholung ist ${tage === 1 ? 'morgen' : `in ${tage} Tagen`} dran.`,
    streakPill: (n: number) => `${n}/3 richtig in Folge`,
    nextCard: 'Nächste Karte',
    finish: 'Fertig',
  },
  {
    title: 'Review',
    sub: 'Questions you got wrong come back at growing intervals – until you get them right three times in a row.',
    due: (n: number) => `${n} due`,
    inDeck: (n: number) => `${n} in the deck`,
    doneToday: (n: number) => `${n} done today`,
    emptyTitle: 'Your deck is empty',
    emptyText: 'Nothing to review yet. What you get wrong in a quiz lands here on its own.',
    toPath: 'Go to Learning Path',
    allDoneTitle: 'All done!',
    allDoneText: 'Nothing else is due today.',
    nextDue: (tage: number) => `The next review is due ${tage === 1 ? 'tomorrow' : `in ${tage} days`}.`,
    streakPill: (n: number) => `${n}/3 correct in a row`,
    nextCard: 'Next card',
    finish: 'Done',
  },
);
