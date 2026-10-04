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
    /* Mit Zahl, damit der Singular stimmt: „1 Tage in Folge" stand hier
       einen Durchlauf lang. */
    streakLabel: (n: number) => (n === 1 ? 'Tag in Folge' : 'Tage in Folge'),
    streakNone: 'Serie',
    /* Die Serie lebt, aber heute ist noch nichts getan: ab Mitternacht wäre
       sie weg. Ein Satz, der das sagt, ohne zu drängen. */
    serieHalten: 'heute halten',


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
    /* Nur, wo der Abschnitt beim Lesen gemessen wurde (E-092) — keine erfundene Zahl. */
    weiterBei: (n: number, total: number) => `Weiter bei Abschnitt ${n} von ${total}`,
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
    laeuftRest: (zeit: string) => `noch ${zeit}`,
    laeuftGespielt: (zeit: string) => `${zeit} gespielt`,
    laeuftLetzte: 'letzte Stufe',
    laeuftPausiert: 'pausiert',

    /* ── Die Hand des Tages (E-036) ─────────────────────────────────── */
    heuteMarke: 'Hand des Tages',
    heuteHand: 'Deine Hand',
    heuteFlop: 'Flop',
    heuteFrage: 'Lohnt der Call?',
    heuteJa: 'Lohnt sich',
    heuteNein: 'Lohnt nicht',
    /* Ein vollständiger Satz mit Einheit: „Er setzt 32 in 96" ließ offen,
       wer er ist und was gezählt wird. */
    heuteSetzt: (einsatz: string, topf: string) =>
      `Dein Gegner setzt ${einsatz} BB in einen Pot von ${topf} BB.`,
    /* Die Rechnung, die hinter der Frage steht — für den, der noch nicht
       weiß, was „mitgehen" kostet und bringt. */
    heuteRechnung: (zahlt: string, gewinnt: string) => `Du zahlst ${zahlt}, um ${gewinnt} zu gewinnen.`,
    /* Solange die erste Lektion offen ist, wird „Call" erklärt statt
       vorausgesetzt. Der Begriff in der Mitte ist ein Link ins Glossar. */
    heuteFrageEinsteiger: ['Mitgehen (', 'Call', ') – lohnt sich das?'] as const,
    heuteErklaerung:
      'Die App rechnet dir vor, was sich lohnt – und zeigt zu jeder Zahl, wie sie entstanden ist.',
    heuteGegen: (equity: string, noetig: string) => `${equity} gegen ${noetig} nötig`,
    heuteKnapp: 'Hauchdünn — hier entscheidet niemand falsch.',
    heuteWarum: 'Warum? Ganze Rechnung ansehen',
    heuteSerie: (tage: number) => (tage === 1 ? '1 Tag in Folge' : `${tage} Tage in Folge`),
    heuteErsterTag: 'Erster Tag',
    heuteMorgen: 'Morgen wartet die nächste Hand',

    /* ── „Heute noch": was nach der Antwort offen ist (E-088) ───────── */
    zielMarke: 'Heute:',
    zielHand: 'Hand',
    zielFragen: (n: number) => `${n} Fragen`,
    zielErledigt: 'erledigt',
    zielOffen: 'offen',
    heuteNoch: 'Heute noch',
    wiederholen: (n: number) => (n === 1 ? '1 Frage wiederholen' : `${n} Fragen wiederholen`),
    tagesquizPunkt: 'Tages-Quiz machen',
    lektionPunkt: (titel: string) => `Weiter mit „${titel}“`,
    ersteLektionPunkt: (titel: string) => `Erste Lektion: „${titel}“`,
    heuteFertig: 'Für heute ist alles erledigt.',
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
    streakLabel: (_n: number) => 'day streak',
    streakNone: 'Streak',
    serieHalten: 'keep it going',


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
    weiterBei: (n: number, total: number) => `Continue at section ${n} of ${total}`,
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
    laeuftRest: (zeit: string) => `${zeit} left`,
    laeuftGespielt: (zeit: string) => `${zeit} played`,
    laeuftLetzte: 'final level',
    laeuftPausiert: 'paused',

    /* ── Hand of the day (E-036) ────────────────────────────────────── */
    heuteMarke: 'Hand of the day',
    heuteHand: 'Your hand',
    heuteFlop: 'Flop',
    heuteFrage: 'Is the call worth it?',
    heuteJa: 'Worth it',
    heuteNein: 'Not worth it',
    heuteSetzt: (einsatz: string, topf: string) =>
      `Your opponent bets ${einsatz} BB into a pot of ${topf} BB.`,
    heuteRechnung: (zahlt: string, gewinnt: string) => `You pay ${zahlt} to win ${gewinnt}.`,
    heuteFrageEinsteiger: ['Matching the bet (', 'call', ') – is it worth it?'] as const,
    heuteErklaerung:
      'The app works out what is worth it – and shows how every number came about.',
    heuteGegen: (equity: string, noetig: string) => `${equity} against ${noetig} needed`,
    heuteKnapp: 'Razor thin — nobody decides wrong here.',
    heuteWarum: 'Why? See the full calculation',
    heuteSerie: (tage: number) => (tage === 1 ? '1 day in a row' : `${tage} days in a row`),
    heuteErsterTag: 'Day one',
    heuteMorgen: 'Tomorrow brings the next hand',

    zielMarke: 'Today:',
    zielHand: 'Hand',
    zielFragen: (n: number) => `${n} questions`,
    zielErledigt: 'done',
    zielOffen: 'open',
    heuteNoch: 'Still to do today',
    wiederholen: (n: number) => (n === 1 ? 'Review 1 question' : `Review ${n} questions`),
    tagesquizPunkt: 'Take the daily quiz',
    lektionPunkt: (titel: string) => `Continue with “${titel}”`,
    ersteLektionPunkt: (titel: string) => `First lesson: “${titel}”`,
    heuteFertig: 'Everything is done for today.',
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
