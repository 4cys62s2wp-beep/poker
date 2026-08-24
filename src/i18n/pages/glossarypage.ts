import { defineStrings } from '..';

/* Texte für das Glossar (/glossar). Die Kategorie-WERTE bleiben in beiden
   Sprachen die deutschen Schlüssel (GlossaryCategory) – übersetzt wird nur
   das Anzeige-Label über `categoryLabels`. */
export const STR = defineStrings(
  {
    eyebrow: 'Nachschlagen',
    title: 'Glossar',
    sub: (n: number) => `${n} Pokerbegriffe von A bis Z – damit du am Tisch jede Ansage verstehst.`,
    searchPlaceholder: 'Begriff suchen …',
    noResults: 'Kein Begriff gefunden.',
    seeAlso: 'Siehe auch:',
    categoryLabels: {
      Alle: 'Alle',
      Grundlagen: 'Grundlagen',
      Aktionen: 'Aktionen',
      Mathematik: 'Mathematik',
      Strategie: 'Strategie',
      Online: 'Online',
      Live: 'Live',
      Turnier: 'Turnier',
      Slang: 'Slang',
    },
  },
  {
    eyebrow: 'Look it up',
    title: 'Glossary',
    sub: (n: number) => `${n} poker terms from A to Z – so you understand every call-out at the table.`,
    searchPlaceholder: 'Search terms …',
    noResults: 'No term found.',
    seeAlso: 'See also:',
    categoryLabels: {
      Alle: 'All',
      Grundlagen: 'Basics',
      Aktionen: 'Actions',
      Mathematik: 'Math',
      Strategie: 'Strategy',
      Online: 'Online',
      Live: 'Live',
      Turnier: 'Tournament',
      Slang: 'Slang',
    },
  },
);
