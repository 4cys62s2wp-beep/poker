import { defineStrings } from '..';

/* Texte der Profilseite (src/pages/ProfilePage.tsx): Identität und Fortschritt.
   Alles Einstellbare steht in einstellungen.ts (E-095). */
export const STR = defineStrings(
  {
    title: 'Profil',
    einstellungen: 'Einstellungen',

    /* Wo der Fortschritt liegt — je nach Zustand ein anderer Satz (E-095).
       Vorher stand oben „doppelt auf diesem Gerät … und mit Konto zusätzlich in
       der Cloud“ und weiter unten „Alle Daten liegen nur auf diesem Gerät“. */
    speicherGeraet: 'Dein Fortschritt liegt nur auf diesem Gerät. Ein Backup oder ein Konto nimmt ihn mit.',
    speicherKonto: 'Dein Fortschritt liegt auf diesem Gerät und in deinem Konto.',
    speicherKontoOffen:
      'Dein Konto ist noch nicht bestätigt. Bis dahin liegt dein Fortschritt nur auf diesem Gerät.',

    /** Ein Profil ohne Namen heißt „Profil 1“, nicht „Ohne Namen“ oder „?“. */
    unbenannt: (n: number) => `Profil ${n}`,

    /* ── Der Rang als Bild (E-037) ──────────────────────────────────── */
    rangMarke: 'Dein Rang',
    rangRing: (level: number, titel: string) => `Level ${level}, ${titel}`,
    rangBis: (fehlt: number, titel: string) => `Noch ${fehlt} XP bis ${titel}`,
    rangWeiter: (fehlt: number) => `Noch ${fehlt} XP bis zum nächsten Level`,
    rangGesamt: (xp: number) => `${xp} XP insgesamt`,
    rangSammlung: (verdient: number, gesamt: number) =>
      `${verdient} von ${gesamt} Abzeichen`,
    lessonsDoneOf: (done: number, gesamt: number) => `${done} von ${gesamt} Lektionen`,

    statTrainerAnswers: 'Trainer-Antworten',
    pctCorrect: (pct: number) => `${pct} % richtig`,
    statHandsPlayed: 'Hände gespielt',
    handsWon: (n: number) => `${n} gewonnen`,
    statStreak: 'Lernserie',
    streakDays: (n: number) => (n === 1 ? 'Tag in Folge' : 'Tage in Folge'),
    statSessions: 'Sessions erfasst',
    sessionsSub: 'im Bankroll-Tracker',
    firstTask: 'Erste Aufgabe lösen',
    firstHand: 'Erste Hand spielen',
    firstSession: 'Ersten Abend erfassen',

    badgesTitle: 'Abzeichen',
    badgeSeit: (wann: string) => (wann ? `seit ${wann}` : 'verdient'),
    nochKeins: 'Noch keins verdient — das erste ist nur eine Lektion entfernt.',
    naechste: 'Als Nächstes',
    offenZeile: (n: number) => (n === 1 ? 'Noch 1 Abzeichen zu entdecken' : `Noch ${n} Abzeichen zu entdecken`),
    alleAnsehen: 'Alle ansehen',
    weniger: 'Weniger zeigen',
    weitereVerdient: (n: number) => (n === 1 ? '1 weiteres verdient' : `${n} weitere verdient`),
  },
  {
    title: 'Profile',
    einstellungen: 'Settings',

    speicherGeraet: 'Your progress lives on this device only. A backup or an account takes it with you.',
    speicherKonto: 'Your progress lives on this device and in your account.',
    speicherKontoOffen:
      'Your account is not verified yet. Until then your progress lives on this device only.',

    unbenannt: (n: number) => `Profile ${n}`,

    /* ── Rank as a picture (E-037) ──────────────────────────────────── */
    rangMarke: 'Your rank',
    rangRing: (level: number, titel: string) => `Level ${level}, ${titel}`,
    rangBis: (fehlt: number, titel: string) => `${fehlt} XP to ${titel}`,
    rangWeiter: (fehlt: number) => `${fehlt} XP to the next level`,
    rangGesamt: (xp: number) => `${xp} XP in total`,
    rangSammlung: (verdient: number, gesamt: number) =>
      `${verdient} of ${gesamt} badges`,
    lessonsDoneOf: (done: number, gesamt: number) => `${done} of ${gesamt} lessons`,

    statTrainerAnswers: 'Trainer Answers',
    pctCorrect: (pct: number) => `${pct}% correct`,
    statHandsPlayed: 'Hands Played',
    handsWon: (n: number) => `${n} won`,
    statStreak: 'Learning Streak',
    streakDays: (n: number) => (n === 1 ? 'day in a row' : 'days in a row'),
    statSessions: 'Sessions Logged',
    sessionsSub: 'in the bankroll tracker',
    firstTask: 'Solve your first task',
    firstHand: 'Play your first hand',
    firstSession: 'Record your first evening',

    badgesTitle: 'Badges',
    badgeSeit: (wann: string) => (wann ? `since ${wann}` : 'earned'),
    nochKeins: 'None earned yet — the first one is a single lesson away.',
    naechste: 'Up next',
    offenZeile: (n: number) => (n === 1 ? '1 more badge to discover' : `${n} more badges to discover`),
    alleAnsehen: 'View all',
    weniger: 'Show fewer',
    weitereVerdient: (n: number) => (n === 1 ? '1 more earned' : `${n} more earned`),
  },
);
