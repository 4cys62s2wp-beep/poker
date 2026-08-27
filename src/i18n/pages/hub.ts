import { defineStrings } from '..';

/* Texte des Hub-Screens (src/pages/HubPage.tsx).

   Besonderheit: Jede Karte hat ZWEI Texte – einen erklärenden Untertitel für
   Erstnutzer und eine Zustandszeile für alle, die schon etwas getan haben.
   Wer zum ersten Mal öffnet, braucht zu wissen, was ihn erwartet; wer
   wiederkommt, braucht zu wissen, wo er stehengeblieben ist. Dieselbe Zeile
   kann nicht beides. */
export const STR = defineStrings(
  {
    greetingMorning: 'Guten Morgen',
    greetingDay: 'Hallo',
    greetingEvening: 'Guten Abend',
    greetingAnonymous: 'Willkommen',

    // Kopfzeile
    levelLabel: 'Level',
    xpLabel: 'XP',
    streakLabel: 'Tage-Streak',
    streakNone: 'Streak',

    // Quick Access
    continueTitle: 'Weiter machen',
    continueLesson: (title: string) => `Lektion: ${title}`,
    continueFirst: 'Erste Lektion starten',
    continueReview: (n: number) => `${n} Karten zur Wiederholung fällig`,
    continueQuiz: 'Tages-Quiz noch offen',
    continueTable: 'Pokerabend fortsetzen',

    // Die drei Karten
    learnTitle: 'Lernen',
    learnSub: 'Kurs, Trainer, Übungstisch – vom ersten Blatt bis GTO',
    learnStatus: (done: number) => (done === 1
      ? '1 Lektion abgeschlossen'
      : `${done} Lektionen abgeschlossen`),

    lookupTitle: 'Nachschlagen',
    lookupSub: 'Glossar, Starthände, Ranges, Odds – und der Live-Coach',
    lookupStatus: 'Zwei Schritte bis zur Antwort',

    sessionTitle: 'Live-Session',
    sessionSub: 'Chips einteilen, Blinds hochziehen, gerecht auszahlen',
    sessionStatus: 'Alles für den Abend',
    sessionStatusPlayed: (n: number) => `${n} ${n === 1 ? 'Session' : 'Sessions'} erfasst`,

    // Erstnutzer
    /* Beim allerersten Öffnen steht hier ein Satz, der sagt, was die App
       tut — keine Fortschrittszahl. „0 von 49 Lektionen" sagt einem Neuling
       nichts. */
    wasDieAppTut:
      'PokerMentor rechnet dir vor, was sich lohnt — und zeigt dir zu jeder '
      + 'Zahl, wie sie entstanden ist. Am Tisch führt es die Blinds, die Zeit '
      + 'und die Chips.',

    fortsetzenMarke: 'Läuft gerade',
    fortsetzenTitel: 'Zurück in die Runde',
    fortsetzenSeit: (dauer: string, spieler: number) =>
      `Seit ${dauer} · ${spieler === 1 ? '1 Spieler' : `${spieler} Spieler`}`,
    fortsetzenNamen: (namen: string) => namen,

    firstTimeTitle: 'Wo willst du anfangen?',
    firstTimeSub:
      'Drei Wege durch die App. Du kannst jederzeit wechseln – nichts geht dabei verloren.',
  },
  {
    greetingMorning: 'Good morning',
    greetingDay: 'Hello',
    greetingEvening: 'Good evening',
    greetingAnonymous: 'Welcome',

    levelLabel: 'Level',
    xpLabel: 'XP',
    streakLabel: 'day streak',
    streakNone: 'Streak',

    continueTitle: 'Pick up where you left off',
    continueLesson: (title: string) => `Lesson: ${title}`,
    continueFirst: 'Start the first lesson',
    continueReview: (n: number) => `${n} cards due for review`,
    continueQuiz: 'Daily quiz still open',
    continueTable: 'Resume poker night',

    learnTitle: 'Learn',
    learnSub: 'Course, trainers, practice table – from your first hand to GTO',
    learnStatus: (done: number) => (done === 1
      ? '1 lesson completed'
      : `${done} lessons completed`),

    lookupTitle: 'Reference',
    lookupSub: 'Glossary, starting hands, ranges, odds – and the live coach',
    lookupStatus: 'Two steps to an answer',

    sessionTitle: 'Live session',
    sessionSub: 'Split the chips, raise the blinds, pay out fairly',
    sessionStatus: 'Everything for the evening',
    sessionStatusPlayed: (n: number) => `${n} ${n === 1 ? 'session' : 'sessions'} logged`,

    wasDieAppTut:
      'PokerMentor works out what pays — and shows you, for every number, how '
      + 'it came about. At the table it runs the blinds, the clock and the '
      + 'chips.',

    fortsetzenMarke: 'Running now',
    fortsetzenTitel: 'Back into the round',
    fortsetzenSeit: (dauer: string, spieler: number) =>
      `For ${dauer} · ${spieler === 1 ? '1 player' : `${spieler} players`}`,
    fortsetzenNamen: (namen: string) => namen,

    firstTimeTitle: 'Where do you want to start?',
    firstTimeSub:
      'Three ways through the app. You can switch any time – nothing gets lost.',
  },
);
