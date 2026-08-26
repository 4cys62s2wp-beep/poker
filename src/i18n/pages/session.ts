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

    onlineTitle: 'Online-Tisch',
    onlineBody:
      'Wenn nicht alle am selben Tisch sitzen: Jeder öffnet den Tisch auf '
      + 'seinem Gerät und sieht denselben Stand.',
    onlineWhen: 'Wenn jemand nicht dabei sein kann',

    abendTitle: 'Abend führen',
    abendBody:
      'Koffer eintragen, Blinds ausrechnen lassen, Uhr laufen lassen. Das '
      + 'Gerät liegt in der Mitte und zeigt allen dasselbe.',
    abendWhen: 'Vom ersten bis zum letzten Blatt',

    abendeTitle: 'Frühere Abende',
    abendeBody:
      'Wer war dabei, wie lange ging es, wer hatte am Ende die Chips. Ein '
      + 'Tipp auf einen Namen zeigt alle Abende dieser Person.',
    abendeWhen: 'Am Tag danach',

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

    onlineTitle: 'Online table',
    onlineBody:
      'When not everyone is at the same table: each person opens the table on '
      + 'their own device and sees the same state.',
    onlineWhen: 'When somebody cannot make it',

    abendTitle: 'Run the evening',
    abendBody:
      'Enter the case, let the blinds be worked out, start the clock. The '
      + 'device lies in the middle and shows everyone the same thing.',
    abendWhen: 'From the first hand to the last',

    abendeTitle: 'Earlier evenings',
    abendeBody:
      'Who was there, how long it went, who had the chips at the end. A tap '
      + 'on a name shows every evening that person played.',
    abendeWhen: 'The day after',

    bankrollTitle: 'Bankroll',
    bankrollBody: 'Log your results – live and online kept apart, with history and export.',
    bankrollWhen: 'After the session',

    sessionsLabel: 'sessions',
    resultLabel: 'Balance',
    handsLabel: 'hands at the table',
  },
);
