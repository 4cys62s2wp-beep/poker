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
    learnSub: 'Kurs, Trainer und Wiederholung – vom ersten Blatt bis GTO',
    learnStatus: (done: number, total: number) => `${done} von ${total} Lektionen`,

    liveTitle: 'Live spielen',
    liveSub: 'Coach für den echten Pokerabend, Übungstisch, Spielstil-Analyse',
    liveStatusCoach: 'Live-Coach, Tisch und Analyse',
    liveStatusHands: (n: number) => `${n} ${n === 1 ? 'Hand' : 'Hände'} gespielt`,

    toolsTitle: 'Session-Tools',
    toolsSub: 'Chip-Rechner, Blind-Struktur, Bankroll und Rechner',
    toolsStatus: 'Alles für den Abend',

    friendsTitle: 'Mit Freunden spielen',
    friendsSub: 'Kommt bald',

    // Erstnutzer
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
    learnSub: 'Course, trainers and review – from your first hand to GTO',
    learnStatus: (done: number, total: number) => `${done} of ${total} lessons`,

    liveTitle: 'Play live',
    liveSub: 'Coach for a real poker night, practice table, playing-style analysis',
    liveStatusCoach: 'Live coach, table and analysis',
    liveStatusHands: (n: number) => `${n} ${n === 1 ? 'hand' : 'hands'} played`,

    toolsTitle: 'Session tools',
    toolsSub: 'Chip calculator, blind structure, bankroll and calculators',
    toolsStatus: 'Everything for the evening',

    friendsTitle: 'Play with friends',
    friendsSub: 'Coming soon',

    firstTimeTitle: 'Where do you want to start?',
    firstTimeSub:
      'Three ways through the app. You can switch any time – nothing gets lost.',
  },
);
