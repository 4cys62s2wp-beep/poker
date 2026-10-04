import { defineStrings } from '..';

/* Texte des Tages-Quiz. */
export const STR = defineStrings(
  {
    title: 'Tages-Quiz',
    sub: 'Jeden Tag neue Fragen zu dem, was du schon gelernt hast. Bonus: 30 XP plus 4 XP pro richtiger Antwort.',
    doneTitle: 'Heute schon erledigt!',
    resultPrefix: 'Dein Ergebnis:',
    resultSuffix: '. Morgen gibt es neue Fragen.',
    readyTitle: 'Bereit für heute?',
    readyText: (n: number) => `${n} Fragen aus deinen abgeschlossenen Lektionen. Falsche Antworten wandern in deinen Wiederholungsstapel.`,
    start: 'Tages-Quiz starten',
    emptyTitle: 'Erst eine Lektion abschließen',
    emptyText: 'Das Tages-Quiz fragt nur, was du schon gelernt hast. Sobald du eine Lektion abgeschlossen hast, steht es hier bereit.',
    emptyGo: 'Zur nächsten Lektion',
    toPath: 'Zum Lernpfad',
    allRight: 'Alles richtig – bis morgen!',
    toReview: (n: number) => (n === 1 ? 'Eine Frage kommt in deine Wiederholung.' : `${n} Fragen kommen in deine Wiederholung.`),
  },
  {
    title: 'Daily Quiz',
    sub: 'New questions every day on what you have already learned. Bonus: 30 XP plus 4 XP per correct answer.',
    doneTitle: 'Already done for today!',
    resultPrefix: 'Your score:',
    resultSuffix: '. There will be new questions tomorrow.',
    readyTitle: 'Ready for today?',
    readyText: (n: number) => `${n} questions from your completed lessons. Wrong answers go into your review deck.`,
    start: 'Start Daily Quiz',
    emptyTitle: 'Finish a lesson first',
    emptyText: 'The Daily Quiz only asks what you have already learned. Once you have finished a lesson, it will be waiting here.',
    emptyGo: 'To the next lesson',
    toPath: 'To the learning path',
    allRight: 'All correct – see you tomorrow!',
    toReview: (n: number) => (n === 1 ? 'One question goes into your review.' : `${n} questions go into your review.`),
  },
);
