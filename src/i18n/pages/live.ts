import { defineStrings } from '..';

/* Bereichsseite „Live spielen“ (src/pages/LivePage.tsx).

   Die „when“-Zeilen sind der eigentliche Inhalt dieser Seite: Live-Coach,
   Pokerabend und Übungstisch klingen ähnlich, sind aber für völlig
   verschiedene Situationen gedacht. Wer das nicht weiß, wählt falsch und
   hält die App für unübersichtlich. */
export const STR = defineStrings(
  {
    eyebrow: 'Live spielen',
    title: 'Am Tisch',
    sub: 'Vier Werkzeuge für vier Situationen. Der Unterschied steht jeweils in der farbigen Zeile.',
    backHome: 'Start',

    handsLabel: 'Hände',
    wonLabel: 'gewonnen',
    vpipLabel: 'gespielt',

    coachTitle: 'Live-Coach',
    coachBody:
      'Du gibst deine Hand und das Board ein, der Coach nennt Aktion, Sizing und Begründung – Street für Street.',
    coachWhen: 'Wenn du gerade wirklich am Tisch sitzt',

    tableTitle: 'Pokerabend',
    tableBody:
      'Die App übernimmt Karten, Chips, Blinds und Showdown. Das Gerät wandert reihum, jeder sieht nur seine Karten.',
    tableWhen: 'Wenn ihr zu mehreren spielt und Karten oder Chips fehlen',

    practiceTitle: 'Übungstisch',
    practiceBody:
      'No-Limit Hold’em gegen Computergegner, Heads-up bis 6-max, mit optionaler Live-Analyse.',
    practiceWhen: 'Wenn du allein üben willst',

    statsTitle: 'Spielstil-Analyse',
    statsBody:
      'Wie viele Hände du spielst, wie oft du erhöhst, wie aggressiv du nach dem Flop bist – und was das über deinen Stil verrät.',
    statsWhen: 'Wenn du wissen willst, woran du arbeiten musst',
  },
  {
    eyebrow: 'Play live',
    title: 'At the table',
    sub: 'Four tools for four situations. The difference is in the coloured line each time.',
    backHome: 'Home',

    handsLabel: 'hands',
    wonLabel: 'won',
    vpipLabel: 'played',

    coachTitle: 'Live Coach',
    coachBody:
      'Enter your hand and the board, and the coach names the action, sizing and reasoning – street by street.',
    coachWhen: 'When you are actually sitting at the table',

    tableTitle: 'Poker Night',
    tableBody:
      'The app handles cards, chips, blinds and showdown. The device passes around; everyone only sees their own cards.',
    tableWhen: 'When several of you play and cards or chips are missing',

    practiceTitle: 'Practice Table',
    practiceBody:
      'No-limit hold’em against computer opponents, heads-up to 6-max, with optional live analysis.',
    practiceWhen: 'When you want to practise alone',

    statsTitle: 'Playing-style analysis',
    statsBody:
      'How many hands you play, how often you raise, how aggressive you are after the flop – and what that says about your style.',
    statsWhen: 'When you want to know what to work on',
  },
);
