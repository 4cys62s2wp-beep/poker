import { defineStrings } from '..';

/* Texte der Profilseite (src/pages/ProfilePage.tsx). */
export const STR = defineStrings(
  {
    eyebrow: 'Dein Weg',
    title: 'Profil & Fortschritt',
    sub: 'Dein Fortschritt wird doppelt auf diesem Gerät gesichert – und mit Konto zusätzlich in der Cloud.',

    statLevel: 'Level',
    statXp: 'XP',
    nextLevel: (xp: number) => `nächstes Level: ${xp} XP`,
    statLessons: 'Lektionen',
    lessonsDone: 'abgeschlossen',
    statBadges: 'Abzeichen',
    badgesEarned: 'verdient',

    statTrainerAnswers: 'Trainer-Antworten',
    pctCorrect: (pct: number) => `${pct} % richtig`,
    statHandsPlayed: 'Hände gespielt',
    handsWon: (n: number) => `${n} gewonnen`,
    statStreak: 'Lern-Streak',
    streakDays: 'Tage in Folge',
    statSessions: 'Sessions erfasst',
    sessionsSub: 'im Bankroll-Tracker',

    badgesTitle: 'Abzeichen',
    badgeEarnedPill: '✓ verdient',

    accountSection: 'Konto & Synchronisation',

    profilesSection: 'Profile auf diesem Gerät',
    profilesIntro:
      'Jedes Profil hat eigenen Fortschritt, eigene XP und eigene Abzeichen – so können mehrere Personen am selben Gerät parallel trainieren. Der Fortschritt bleibt auch nach Neuladen oder Schließen des Browsers erhalten.',
    unnamed: 'Ohne Namen',
    activePill: 'aktiv',
    cloudPill: 'Cloud',
    switchProfile: 'Wechseln',
    confirmDelete: 'Wirklich löschen',
    cancel: 'Abbrechen',
    deleteAria: (name: string) => `Profil ${name} löschen`,
    newProfile: '+ Neues Profil anlegen',
    namePlaceholder: 'Name',
    emailOptionalPlaceholder: 'E-Mail (optional)',
    createAndSwitch: 'Profil erstellen & wechseln',

    settingsSection: 'Einstellungen',
    profileNameLabel: 'Name dieses Profils',
    profileNamePlaceholder: 'z. B. Lorenz',
    emailLabel: 'E-Mail (optional, für die Profil-Zuordnung)',
    emailPlaceholder: 'du@example.de',
    save: 'Speichern',
    languageLabel: 'Sprache / Language',
    modusLabel: 'Farben',
    modusName: { system: 'Systemvorgabe', hell: 'Hell', dunkel: 'Dunkel' },
    modusHinweis: 'Die Live-Session bleibt immer dunkel — auf dem Tisch blendet eine helle Fläche die Runde.',
    langGerman: 'Deutsch',
    langEnglish: 'English',
    resetStart: 'Fortschritt zurücksetzen …',
    resetConfirm1: 'Wirklich den kompletten Fortschritt',
    resetConfirmStrong: 'dieses Profils',
    resetConfirm2:
      'löschen (XP, Lektionen, Abzeichen, Sessions)? Andere Profile bleiben unberührt. Das kann nicht rückgängig gemacht werden.',
    resetYes: 'Ja, alles löschen',

    backupTitle: 'Daten sichern & übertragen',
    backupDesc:
      'Alle Daten liegen nur auf diesem Gerät. Mit einem Backup nimmst du deinen Fortschritt mit – z. B. vom Handy auf den Laptop.',
    backupDownload: 'Backup herunterladen',
    backupImport: 'Backup einspielen …',
    importOk: 'Backup erfolgreich eingespielt – dein Fortschritt wurde übernommen.',
    importError: 'Das war keine gültige PokerMentor-Backup-Datei.',

    installTitle: 'Als App installieren',
    installBody1: 'PokerMentor ist eine PWA: Öffne die Website auf dem Handy und wähle im Browser-Menü',
    installStrong: '„Zum Startbildschirm hinzufügen“',
    installBody2:
      '(iOS: Teilen-Symbol → „Zum Home-Bildschirm“). Danach startet die App wie eine native App und funktioniert auch offline.',

    aboutTitle: 'Über PokerMentor',
    aboutBody:
      'Version 2.2 · Eine Lern- und Trainings-App für Poker – ohne Echtgeld und ohne Tracking. Poker ist ein Geschicklichkeitsspiel mit erheblichem Glücksanteil: Spiele verantwortungsvoll und setze dir Grenzen, bevor du an einen echten Tisch gehst (Modul „Psychologie & Bankroll“).',
  },
  {
    eyebrow: 'Your Journey',
    title: 'Profile & Progress',
    sub: 'Your progress is saved twice on this device – and additionally in the cloud with an account.',

    statLevel: 'Level',
    statXp: 'XP',
    nextLevel: (xp: number) => `next level: ${xp} XP`,
    statLessons: 'Lessons',
    lessonsDone: 'completed',
    statBadges: 'Badges',
    badgesEarned: 'earned',

    statTrainerAnswers: 'Trainer Answers',
    pctCorrect: (pct: number) => `${pct}% correct`,
    statHandsPlayed: 'Hands Played',
    handsWon: (n: number) => `${n} won`,
    statStreak: 'Learning Streak',
    streakDays: 'days in a row',
    statSessions: 'Sessions Logged',
    sessionsSub: 'in the bankroll tracker',

    badgesTitle: 'Badges',
    badgeEarnedPill: '✓ earned',

    accountSection: 'Account & Sync',

    profilesSection: 'Profiles on This Device',
    profilesIntro:
      'Each profile has its own progress, XP and badges – so several people can train side by side on the same device. Progress is kept even after reloading or closing the browser.',
    unnamed: 'Unnamed',
    activePill: 'active',
    cloudPill: 'Cloud',
    switchProfile: 'Switch',
    confirmDelete: 'Really delete',
    cancel: 'Cancel',
    deleteAria: (name: string) => `Delete profile ${name}`,
    newProfile: '+ Create new profile',
    namePlaceholder: 'Name',
    emailOptionalPlaceholder: 'Email (optional)',
    createAndSwitch: 'Create profile & switch',

    settingsSection: 'Settings',
    profileNameLabel: 'Name of this profile',
    profileNamePlaceholder: 'e.g. Lorenz',
    emailLabel: 'Email (optional, to identify the profile)',
    emailPlaceholder: 'you@example.com',
    save: 'Save',
    languageLabel: 'Sprache / Language',
    modusLabel: 'Colours',
    modusName: { system: 'System default', hell: 'Light', dunkel: 'Dark' },
    modusHinweis: 'The live session always stays dark — on the table a bright surface dazzles everyone.',
    langGerman: 'Deutsch',
    langEnglish: 'English',
    resetStart: 'Reset progress …',
    resetConfirm1: 'Really delete the entire progress of',
    resetConfirmStrong: 'this profile',
    resetConfirm2: '(XP, lessons, badges, sessions)? Other profiles are not affected. This cannot be undone.',
    resetYes: 'Yes, delete everything',

    backupTitle: 'Back Up & Transfer Data',
    backupDesc:
      'All data lives only on this device. With a backup you can take your progress with you – e.g. from your phone to your laptop.',
    backupDownload: 'Download backup',
    backupImport: 'Import backup …',
    importOk: 'Backup imported successfully – your progress has been restored.',
    importError: 'That was not a valid PokerMentor backup file.',

    installTitle: 'Install as an App',
    installBody1: 'PokerMentor is a PWA: open the website on your phone and choose',
    installStrong: '“Add to Home Screen”',
    installBody2:
      'in the browser menu (iOS: share icon → “Add to Home Screen”). After that the app launches like a native app and also works offline.',

    aboutTitle: 'About PokerMentor',
    aboutBody:
      'Version 2.2 · A learning and training app for poker – no real money, no tracking. Poker is a game of skill with a significant element of luck: play responsibly and set yourself limits before you sit down at a real table (module “Psychology & Bankroll”).',
  },
);
