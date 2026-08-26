import { defineStrings } from '..';

/* Texte des Bereichs „Live-Session" (src/pages/SessionPage.tsx).

   Hier sitzt jemand am echten Tisch. Die Frage ist nie „was ist das?",
   sondern „wann brauche ich das?" – deshalb trägt jede Karte eine Zeile,
   die genau das beantwortet. */
export const STR = defineStrings(
  {
    eyebrow: 'Live-Session',
    title: 'Der Abend läuft',
    sub: 'Chips einteilen, Blinds hochziehen, am Ende gerecht auszahlen.',
    backHome: 'Start',

    chipsTitle: 'Chip-Rechner',
    chipsBody: 'Den Koffer auf die Spieler aufteilen, Werte festlegen, Start-Blinds und Blind-Fahrplan bekommen.',
    chipsWhen: 'Bevor die erste Karte fällt',

    payoutTitle: 'Auszahlung',
    payoutBody: 'Preisgeld auf die vorderen Plätze verteilen – nach einer Struktur, über die vorher niemand streitet.',
    payoutWhen: 'Bevor gespielt wird, nicht danach',

    tableTitle: 'Pokerabend',
    tableBody: 'Die App übernimmt Karten, Chips, Blinds und Showdown. Das Gerät wandert reihum.',
    tableWhen: 'Wenn kein Kartendeck da ist',

    bankrollTitle: 'Bankroll',
    bankrollBody: 'Ergebnisse festhalten – Live und Online getrennt, mit Verlauf und Export.',
    bankrollWhen: 'Nach der Session',

    sessionsLabel: 'Sessions',
    resultLabel: 'Bilanz',
    handsLabel: 'Hände am Tisch',
  },
  {
    eyebrow: 'Live session',
    title: 'The night is on',
    sub: 'Split the chips, raise the blinds, pay out fairly at the end.',
    backHome: 'Home',

    chipsTitle: 'Chip calculator',
    chipsBody: 'Split the case across players, set values, get starting blinds and a blind schedule.',
    chipsWhen: 'Before the first card',

    payoutTitle: 'Payouts',
    payoutBody: 'Spread the prize pool over the top places – using a structure nobody argues about afterwards.',
    payoutWhen: 'Before play starts, not after',

    tableTitle: 'Poker night',
    tableBody: 'The app handles cards, chips, blinds and showdown. The device passes around the table.',
    tableWhen: 'When there is no deck around',

    bankrollTitle: 'Bankroll',
    bankrollBody: 'Log your results – live and online kept apart, with history and export.',
    bankrollWhen: 'After the session',

    sessionsLabel: 'sessions',
    resultLabel: 'Balance',
    handsLabel: 'hands at the table',
  },
);
