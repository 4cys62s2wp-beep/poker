import { defineStrings } from '..';

/* Texte des Tages-Quiz. */
export const STR = defineStrings(
  {
    back: '← Trainer',
    eyebrow: 'Jeden Tag fünf Fragen',
    title: 'Tages-Quiz',
    sub: 'Fünf zufällige Fragen quer durch alle Module – jeden Tag neu. Bonus: 30 XP plus 4 XP pro richtiger Antwort.',
    doneTitle: 'Heute schon erledigt!',
    resultPrefix: 'Dein Ergebnis:',
    resultSuffix: '. Morgen warten fünf neue Fragen.',
    readyTitle: 'Bereit für heute?',
    readyText: (n: number) => `${n} Fragen aus allen Themenbereichen. Falsche Antworten wandern in deinen Wiederholungsstapel.`,
    start: 'Tages-Quiz starten',
  },
  {
    back: '← Trainers',
    eyebrow: 'Five questions every day',
    title: 'Daily Quiz',
    sub: 'Five random questions from across all modules – new every day. Bonus: 30 XP plus 4 XP per correct answer.',
    doneTitle: 'Already done for today!',
    resultPrefix: 'Your score:',
    resultSuffix: '. Five new questions await tomorrow.',
    readyTitle: 'Ready for today?',
    readyText: (n: number) => `${n} questions from every topic area. Wrong answers go into your review deck.`,
    start: 'Start Daily Quiz',
  },
);
