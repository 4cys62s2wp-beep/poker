import { defineStrings } from '..';

/* Texte der Erinnerungskarte in den Einstellungen (src/components/ErinnerungKarte.tsx). */
export const STR = defineStrings(
  {
    titel: 'Täglich erinnern',
    text:
      'Die App schickt dir keine Mitteilungen — sie kennt dich nicht und fragt auch nicht danach. '
      + 'Stattdessen bekommst du einen Kalendereintrag, der dich jeden Tag zur Hand des Tages erinnert.',
    uhrzeit: 'Uhrzeit',
    laden: 'Kalendereintrag laden',
    hinweis: 'Öffne die Datei mit deinem Kalender. Ein zweiter Download mit neuer Uhrzeit ersetzt den Eintrag.',
    eintragTitel: 'PokerMentor: Hand des Tages',
    eintragText: 'Eine Hand, eine Frage – dauert eine Minute.',
    dateiname: 'pokermentor-erinnerung.ics',
    markeHinweis: 'Auf diesem Gerät zeigt das App-Symbol zusätzlich die Zahl fälliger Wiederholungen.',
  },
  {
    titel: 'Remind me daily',
    text:
      'The app sends no notifications — it does not know you and does not ask. '
      + 'Instead you get a calendar entry that reminds you of the hand of the day every day.',
    uhrzeit: 'Time',
    laden: 'Download calendar entry',
    hinweis: 'Open the file with your calendar. A second download with a new time replaces the entry.',
    eintragTitel: 'PokerMentor: Hand of the day',
    eintragText: 'One hand, one question – takes a minute.',
    dateiname: 'pokermentor-reminder.ics',
    markeHinweis: 'On this device the app icon also shows the number of reviews that are due.',
  },
);
