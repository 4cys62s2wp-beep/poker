import { defineStrings } from '..';

/* Texte des Bereichs „Nachschlagen" (src/pages/ReferencePage.tsx).

   Der Bereich hat bewusst KEIN Fortschrittskonzept: Wer hier landet, will
   eine Antwort und ist danach fertig. Deshalb keine Prozentzahlen, keine
   „x von y", keine Streak – und eine Suche ganz oben, weil das der schnellste
   Weg zu einer Antwort ist. */
export const STR = defineStrings(
  {
    eyebrow: 'Nachschlagen',
    title: 'Schnell etwas wissen',
    sub: 'Kein Kurs, keine Fortschrittsanzeige. Such oder tipp – zwei Schritte bis zur Antwort.',
    backHome: 'Start',

    searchLabel: 'Suchen',
    searchPlaceholder: 'Begriff, Hand oder Thema …',
    searchNothing: (q: string) => `Nichts zu „${q}" gefunden.`,
    searchHintGlossary: 'Im Glossar',
    searchHintTool: 'Bereich',
    searchClear: 'Suche leeren',

    coachTitle: 'Live-Coach',
    coachDesc: 'Deine Hand eingeben, Empfehlung mit Begründung bekommen',
    glossaryTitle: 'Glossar',
    glossaryDesc: 'Jeder Begriff, den am Tisch jemand fallen lässt',
    handsTitle: 'Starthände',
    handsDesc: 'Welche Hand aus welcher Position spielbar ist',
    rangesTitle: 'Range-Charts',
    rangesDesc: 'Eröffnen, Callen, 3-Betten – als Raster',
    oddsTitle: 'Odds-Tabellen',
    oddsDesc: 'Outs, Pot Odds und Verbesserungschancen zum Ablesen',
    equityTitle: 'Equity-Rechner',
    equityDesc: 'Hand gegen Hand oder gegen eine Range ausrechnen',
    tellsTitle: 'Tells & Reads',
    tellsDesc: 'Worauf man bei Gegnern achtet – und was nichts bedeutet',
  },
  {
    eyebrow: 'Reference',
    title: 'Look something up',
    sub: 'No course, no progress bar. Search or tap – two steps to an answer.',
    backHome: 'Home',

    searchLabel: 'Search',
    searchPlaceholder: 'Term, hand or topic …',
    searchNothing: (q: string) => `Nothing found for “${q}”.`,
    searchHintGlossary: 'In the glossary',
    searchHintTool: 'Section',
    searchClear: 'Clear search',

    coachTitle: 'Live coach',
    coachDesc: 'Enter your hand, get a recommendation with reasoning',
    glossaryTitle: 'Glossary',
    glossaryDesc: 'Every term someone drops at the table',
    handsTitle: 'Starting hands',
    handsDesc: 'Which hand is playable from which position',
    rangesTitle: 'Range charts',
    rangesDesc: 'Open, call, 3-bet – as a grid',
    oddsTitle: 'Odds tables',
    oddsDesc: 'Outs, pot odds and improvement chances at a glance',
    equityTitle: 'Equity calculator',
    equityDesc: 'Hand versus hand or against a range',
    tellsTitle: 'Tells & reads',
    tellsDesc: 'What to watch for in opponents – and what means nothing',
  },
);
