import { defineStrings } from '..';

/* Die Seite für Adressen, die es nicht gibt. Vorher leitete die App still auf
   die Startseite um — wer einen alten Link oder eine tote Verknüpfung antippte,
   landete ohne ein Wort woanders (E-083). */
export const STR = defineStrings(
  {
    title: 'Diese Seite gibt es nicht',
    body: 'Der Link ist alt oder falsch geschrieben. Von der Startseite kommst du überall hin.',
    home: 'Zur Startseite',
  },
  {
    title: 'This page doesn’t exist',
    body: 'The link is old or mistyped. From the start page you can get anywhere.',
    home: 'Go to start',
  },
);
