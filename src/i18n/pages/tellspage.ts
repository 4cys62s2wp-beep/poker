import { defineStrings } from '..';

/* Texte für Tells & Reads (/tools). Die Tell-Daten selbst kommen aus
   content.tells / content.tellCategories (sprachabhängiges Bundle). */
export const STR = defineStrings(
  {
    backToTools: '← Tools',
    eyebrow: 'Live-Poker lesen',
    title: 'Tells & Reads',
    sub: 'Was Gesten, Einsätze und Timing wirklich verraten – mit ehrlicher Bewertung, wie verlässlich jedes Signal ist. Fokus: lockere Runden mit Freizeitspielern.',
    all: 'Alle',
    reliability: (n: number) => `Zuverlässigkeit: ${n} von 5`,
    ruleTitle: 'Die wichtigste Regel zum Schluss',
    ruleText: 'Tells sind das Sahnehäubchen, nicht der Kuchen. Solide Ranges, Position und Pot Odds gewinnen das Geld – Tells kippen nur die knappen Entscheidungen. Wer wegen eines „sicheren Reads“ die Mathematik ignoriert, bezahlt Lehrgeld.',
  },
  {
    backToTools: '← Tools',
    eyebrow: 'Reading live poker',
    title: 'Tells & Reads',
    sub: 'What gestures, bets and timing really give away – with an honest rating of how reliable each signal is. Focus: casual games with recreational players.',
    all: 'All',
    reliability: (n: number) => `Reliability: ${n} out of 5`,
    ruleTitle: 'The most important rule, saved for last',
    ruleText: 'Tells are the icing, not the cake. Solid ranges, position and pot odds win the money – tells only tip the close decisions. Ignore the math because of a “sure read” and you’ll pay for the lesson.',
  },
);
