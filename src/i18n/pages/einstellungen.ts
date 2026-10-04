import { defineStrings } from '..';

/* Texte der Einstellungen (src/pages/EinstellungenPage.tsx).

   Die Seite ist eine gruppierte Liste (E-095): Konto, Profil, Darstellung,
   App, Über, und zuletzt Daten — mit der zerstörenden Aktion als letztem
   Element der Seite. Vorher stand „Fortschritt zurücksetzen …“ bei 4042 von
   5280 Pixeln direkt unter dem Farbmodus. */
export const STR = defineStrings(
  {
    title: 'Einstellungen',

    kontoTitel: 'Konto',
    profilTitel: 'Profil auf diesem Gerät',
    profilIntro:
      'Jedes Profil hat eigenen Fortschritt, eigene XP und eigene Abzeichen – so können mehrere Personen am selben Gerät trainieren.',
    nameLabel: 'Name dieses Profils',
    namePlaceholder: 'Dein Name',
    speichern: 'Speichern',
    gespeichert: 'Gespeichert',
    aktiv: 'aktiv',
    mitKonto: 'mit Konto',
    wechseln: 'Wechseln',
    loeschenFrage: 'Wirklich löschen',
    abbrechen: 'Abbrechen',
    loeschenAria: (name: string) => `Profil ${name} löschen`,
    neuesProfil: '+ Neues Profil anlegen',
    erstellen: 'Profil erstellen & wechseln',

    darstellungTitel: 'Darstellung',
    sprache: 'Sprache / Language',
    deutsch: 'Deutsch',
    englisch: 'English',
    farben: 'Farben',
    farbName: { system: 'Systemvorgabe', hell: 'Hell', dunkel: 'Dunkel' },
    farbHinweis: 'Die Live-Session bleibt immer dunkel — auf dem Tisch blendet eine helle Fläche die Runde.',

    appTitel: 'App',

    ueberTitel: 'Über PokerMentor',
    versprechen: [
      { t: 'Kein Echtgeld', d: 'Hier wird mit Chips geübt. Die App nimmt kein Geld an und zahlt keines aus.' },
      { t: 'Kein Tracking', d: 'Keine Werbung, keine Analyse-Dienste. Ohne Konto verlässt dein Fortschritt das Gerät nicht.' },
      { t: 'Funktioniert offline', d: 'Nach dem ersten Laden brauchst du kein Netz — auch nicht am Pokertisch.' },
      { t: 'Jede Zahl hat eine Herkunft', d: 'Hinter jeder gerechneten Zahl steht „Warum diese Zahl?“ mit Quelle und Rechenweg.' },
    ],
    version: 'Version 2.2',
    bauStand: (stand: string) => `Stand: ${stand}`,
    verantwortung:
      'Poker ist ein Geschicklichkeitsspiel mit erheblichem Glücksanteil: Spiele verantwortungsvoll und setze dir Grenzen, bevor du an einen echten Tisch gehst (Modul „Psychologie & Bankroll“).',
    feedback: 'Feedback geben',
    feedbackBetreff: 'PokerMentor – Feedback',
    feedbackKopf: 'Dein Feedback (bitte hier schreiben):',

    datenTitel: 'Daten',
    backupTitel: 'Daten sichern & übertragen',
    backupText: 'Mit einem Backup nimmst du deinen Fortschritt mit – z. B. vom Handy auf den Laptop.',
    backupDownload: 'Backup herunterladen',
    backupImport: 'Backup einspielen …',
    importOk: 'Backup erfolgreich eingespielt – dein Fortschritt wurde übernommen.',
    importFehler: 'Das war keine gültige PokerMentor-Backup-Datei.',
    zuruecksetzen: 'Fortschritt zurücksetzen …',
    zurueckFrage: 'Vorher sichern?',
    zurueckText1: 'Wirklich den kompletten Fortschritt',
    zurueckStark: 'dieses Profils',
    zurueckText2:
      'löschen (XP, Lektionen, Abzeichen, Sessions)? Andere Profile bleiben unberührt. Das kann nicht rückgängig gemacht werden.',
    zurueckSichern: 'Erst Backup herunterladen',
    zurueckJa: 'Ja, alles löschen',
  },
  {
    title: 'Settings',

    kontoTitel: 'Account',
    profilTitel: 'Profile on this device',
    profilIntro:
      'Each profile has its own progress, XP and badges – so several people can train on the same device.',
    nameLabel: 'Name of this profile',
    namePlaceholder: 'Your name',
    speichern: 'Save',
    gespeichert: 'Saved',
    aktiv: 'active',
    mitKonto: 'with account',
    wechseln: 'Switch',
    loeschenFrage: 'Really delete',
    abbrechen: 'Cancel',
    loeschenAria: (name: string) => `Delete profile ${name}`,
    neuesProfil: '+ Create new profile',
    erstellen: 'Create profile & switch',

    darstellungTitel: 'Appearance',
    sprache: 'Sprache / Language',
    deutsch: 'Deutsch',
    englisch: 'English',
    farben: 'Colours',
    farbName: { system: 'System default', hell: 'Light', dunkel: 'Dark' },
    farbHinweis: 'The live session always stays dark — on the table a bright surface dazzles everyone.',

    appTitel: 'App',

    ueberTitel: 'About PokerMentor',
    versprechen: [
      { t: 'No real money', d: 'You practise with chips here. The app neither takes nor pays out any money.' },
      { t: 'No tracking', d: 'No ads, no analytics services. Without an account your progress never leaves the device.' },
      { t: 'Works offline', d: 'After the first load you need no network — not even at the poker table.' },
      { t: 'Every number has a source', d: 'Behind every calculated number is “Why this number?” with source and method.' },
    ],
    version: 'Version 2.2',
    bauStand: (stand: string) => `Build: ${stand}`,
    verantwortung:
      'Poker is a game of skill with a significant element of luck: play responsibly and set yourself limits before you sit down at a real table (module “Psychology & Bankroll”).',
    feedback: 'Send feedback',
    feedbackBetreff: 'PokerMentor – feedback',
    feedbackKopf: 'Your feedback (please write here):',

    datenTitel: 'Data',
    backupTitel: 'Back up & transfer data',
    backupText: 'With a backup you can take your progress with you – e.g. from your phone to your laptop.',
    backupDownload: 'Download backup',
    backupImport: 'Import backup …',
    importOk: 'Backup imported successfully – your progress has been restored.',
    importFehler: 'That was not a valid PokerMentor backup file.',
    zuruecksetzen: 'Reset progress …',
    zurueckFrage: 'Back up first?',
    zurueckText1: 'Really delete the entire progress of',
    zurueckStark: 'this profile',
    zurueckText2: '(XP, lessons, badges, sessions)? Other profiles are not affected. This cannot be undone.',
    zurueckSichern: 'Download a backup first',
    zurueckJa: 'Yes, delete everything',
  },
);
