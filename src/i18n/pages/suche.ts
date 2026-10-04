import { defineStrings } from '..';

/* Texte der Suche (SuchFeld, SuchTreffer, SucheDialog): ein Wortlaut für alle
   Stellen, an denen gesucht wird (E-096). */
export const STR = defineStrings(
  {
    label: 'Suchen',
    platzhalter: 'Werkzeug, Lektion oder Begriff …',
    nichts: (q: string) => `Nichts zu „${q}“ gefunden.`,
    gruppeWerkzeuge: 'Werkzeuge',
    gruppeLektionen: 'Lektionen',
    gruppeBegriffe: 'Begriffe',
    abschnitt: (ueberschrift: string) => `Abschnitt: ${ueberschrift}`,
    dialogKopf: 'Überall',
    dialogTitel: 'Suche',
    schliessen: 'Schließen',
    oeffnen: 'Suche öffnen',
    tastenHinweis: 'Von überall mit „/“ oder Strg + K',
  },
  {
    label: 'Search',
    platzhalter: 'Tool, lesson or term …',
    nichts: (q: string) => `Nothing found for “${q}”.`,
    gruppeWerkzeuge: 'Tools',
    gruppeLektionen: 'Lessons',
    gruppeBegriffe: 'Terms',
    abschnitt: (ueberschrift: string) => `Section: ${ueberschrift}`,
    dialogKopf: 'Everywhere',
    dialogTitel: 'Search',
    schliessen: 'Close',
    oeffnen: 'Open search',
    tastenHinweis: 'From anywhere with “/” or Ctrl + K',
  },
);
