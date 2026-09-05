import { defineStrings } from '..';

/* Texte des Hub-Screens (src/pages/HubPage.tsx).

   Besonderheit: Jede Karte hat ZWEI Texte – einen erklärenden Untertitel für
   Erstnutzer und eine Zustandszeile für alle, die schon etwas getan haben.
   Wer zum ersten Mal öffnet, braucht zu wissen, was ihn erwartet; wer
   wiederkommt, braucht zu wissen, wo er stehengeblieben ist. Dieselbe Zeile
   kann nicht beides. */
export const STR = defineStrings(
  {

    // Kopfzeile
    levelLabel: 'Level',
    xpLabel: 'XP',
    streakLabel: 'Tage-Streak',
    streakNone: 'Streak',


    // Die drei Karten
    learnTitle: 'Lernen',

    lookupTitle: 'Nachschlagen',

    sessionTitle: 'Live-Session',
    sessionSub: 'Chips, Blinds und Uhr für den Abend',

    // Erstnutzer
    /* Beim allerersten Öffnen steht hier ein Satz, der sagt, was die App
       tut — keine Fortschrittszahl. „0 von 49 Lektionen" sagt einem Neuling
       nichts. */
    wasDieAppTut:
      'Rechnet dir vor, was sich lohnt — und zeigt zu jeder Zahl, wie sie '
      + 'entstanden ist. Am Tisch führt sie Blinds, Zeit und Chips.',

    // ── Inhalt der drei Karten ──────────────────────────────────────────
    // Kein Schmuck, sondern das, was die Karte ohnehin zu sagen hat — und
    // damit zugleich ein kürzerer Weg ins Ziel (E-035).
    feldGlossar: 'Glossar',
    feldHaende: 'Starthände',
    feldOdds: 'Odds',
    feldCoach: 'Live-Coach',

    weiterMit: 'Weiter mit',
    ersteLektion: 'Erste Lektion',
    weiterlernen: 'Weiterlernen',
    anfangen: 'Anfangen',
    alleLektionenFertig: 'Alle Lektionen durch',
    nochmalDurchgehen: 'Noch einmal durchgehen',
    fortschritt: 'Fortschritt im Kurs',

    abendStarten: 'Abend starten',
    zurueckInDieRunde: 'Zurück in die Runde',
    sessionAlles: 'Chips, Auszahlung, frühere Abende',
    laeuftSeit: (dauer: string) => `Läuft seit ${dauer}`,
    laeuftMit: (spieler: number, sb: number, bb: number) =>
      `${spieler === 1 ? '1 Spieler' : `${spieler} Spieler`} · Blinds ${sb}/${bb}`,

    /* ── Die Hand des Tages (E-036) ─────────────────────────────────── */
    heuteMarke: 'Heute',
    heuteHand: 'Deine Hand',
    heuteFlop: 'Flop',
    heuteFrage: 'Lohnt der Call?',
    heuteJa: 'Lohnt sich',
    heuteNein: 'Lohnt nicht',
    heuteRichtig: 'Richtig',
    heuteDaneben: 'Daneben',
    heuteSetzt: (einsatz: string, topf: string) => `Er setzt ${einsatz} in ${topf}.`,
    heuteGegen: (equity: string, noetig: string) => `${equity} gegen ${noetig} nötig`,
    heuteKnapp: 'Hauchdünn — hier entscheidet niemand falsch.',
    heuteWarum: 'Warum? Ganze Rechnung ansehen',
    heuteSerie: (tage: number) => (tage === 1 ? '1 Tag in Folge' : `${tage} Tage in Folge`),
    heuteErsterTag: 'Erster Tag',
    heuteMorgen: 'Morgen wartet die nächste Hand',
    heuteWoche: 'Die letzten sieben Tage',
    heuteTagOffen: 'noch offen',
    heuteTagRichtig: 'richtig',
    heuteTagFalsch: 'daneben',
    heuteTagNichts: 'nicht dabei',

    letzterAbendMarke: 'Zuletzt',
    letzterAbend: (datum: string, sieger: string) => `${datum} · ${sieger} gewonnen`,

    fortsetzenMarke: 'Läuft gerade',

  },
  {

    levelLabel: 'Level',
    xpLabel: 'XP',
    streakLabel: 'day streak',
    streakNone: 'Streak',


    learnTitle: 'Learn',

    lookupTitle: 'Reference',

    sessionTitle: 'Live session',
    sessionSub: 'Chips, blinds and clock for the evening',

    wasDieAppTut:
      'PokerMentor works out what pays — and shows you, for every number, how '
      + 'it came about. At the table it runs the blinds, the clock and the '
      + 'chips.',

    feldGlossar: 'Glossary',
    feldHaende: 'Starting hands',
    feldOdds: 'Odds',
    feldCoach: 'Live coach',

    weiterMit: 'Continue with',
    ersteLektion: 'First lesson',
    weiterlernen: 'Keep learning',
    anfangen: 'Start',
    alleLektionenFertig: 'All lessons done',
    nochmalDurchgehen: 'Go through again',
    fortschritt: 'Progress through the course',

    abendStarten: 'Start an evening',
    zurueckInDieRunde: 'Back to the round',
    sessionAlles: 'Chips, payout, earlier evenings',
    laeuftSeit: (dauer: string) => `Running for ${dauer}`,
    laeuftMit: (spieler: number, sb: number, bb: number) =>
      `${spieler === 1 ? '1 player' : `${spieler} players`} · blinds ${sb}/${bb}`,

    /* ── Hand of the day (E-036) ────────────────────────────────────── */
    heuteMarke: 'Today',
    heuteHand: 'Your hand',
    heuteFlop: 'Flop',
    heuteFrage: 'Is the call worth it?',
    heuteJa: 'Worth it',
    heuteNein: 'Not worth it',
    heuteRichtig: 'Correct',
    heuteDaneben: 'Not quite',
    heuteSetzt: (einsatz: string, topf: string) => `He bets ${einsatz} into ${topf}.`,
    heuteGegen: (equity: string, noetig: string) => `${equity} against ${noetig} needed`,
    heuteKnapp: 'Razor thin — nobody decides wrong here.',
    heuteWarum: 'Why? See the full calculation',
    heuteSerie: (tage: number) => (tage === 1 ? '1 day in a row' : `${tage} days in a row`),
    heuteErsterTag: 'Day one',
    heuteMorgen: 'Tomorrow brings the next hand',
    heuteWoche: 'The last seven days',
    heuteTagOffen: 'still open',
    heuteTagRichtig: 'correct',
    heuteTagFalsch: 'not quite',
    heuteTagNichts: 'not played',

    letzterAbendMarke: 'Last',
    letzterAbend: (datum: string, sieger: string) => `${datum} · ${sieger} won`,

    fortsetzenMarke: 'Running now',

  },
);
