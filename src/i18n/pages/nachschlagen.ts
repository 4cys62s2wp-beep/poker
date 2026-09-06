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
    sub: 'Such oder tipp – zwei Schritte bis zur Antwort.',
    backHome: 'Start',

    searchLabel: 'Suchen',
    searchPlaceholder: 'Begriff, Hand oder Thema …',
    searchNothing: (q: string) => `Nichts zu „${q}“ gefunden.`,
    searchHintGlossary: 'Im Glossar',
    searchHintTool: 'Bereich',

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

    /* Was auf der Kachel steht: nicht die Erklärung des Namens, sondern das,
       was dahinter liegt. Alle Zahlen kommen aus denselben Daten wie die
       Seite dahinter (E-042). */
    coachInhalt: 'Hand rein, Empfehlung mit Begründung raus',
    glossaryInhalt: (n: number) => `${n} Begriffe von A bis Z`,
    handsInhalt: (p: number) => `Alle 169 Hände · Button eröffnet ${p} %`,
    rangesInhalt: (n: number) => `${n} Eröffnungs-Charts, dazu Call und 3-Bet`,
    oddsInhalt: (fd: number, gs: number) =>
      `Flushdraw ${fd} %, Gutshot ${gs} % bis zum River`,
    equityInhalt: 'Hand gegen Hand, Hand gegen Range',
    tellsInhalt: (n: number) => `${n} Tells, jeder mit Zuverlässigkeit`,
  },
  {
    eyebrow: 'Reference',
    title: 'Look something up',
    sub: 'Search or tap – two steps to an answer.',
    backHome: 'Home',

    searchLabel: 'Search',
    searchPlaceholder: 'Term, hand or topic …',
    searchNothing: (q: string) => `Nothing found for “${q}”.`,
    searchHintGlossary: 'In the glossary',
    searchHintTool: 'Section',

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

    coachInhalt: 'Hand in, recommendation with reasoning out',
    glossaryInhalt: (n: number) => `${n} terms from A to Z`,
    handsInhalt: (p: number) => `All 169 hands · button opens ${p} %`,
    rangesInhalt: (n: number) => `${n} opening charts, plus call and 3-bet`,
    oddsInhalt: (fd: number, gs: number) =>
      `Flush draw ${fd} %, gutshot ${gs} % by the river`,
    equityInhalt: 'Hand versus hand, hand versus range',
    tellsInhalt: (n: number) => `${n} tells, each with a reliability rating`,
  },
);
