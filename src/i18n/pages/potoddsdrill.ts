import { defineStrings } from '..';

/* Texte des Pot-Odds-Drills (src/pages/trainers/PotOddsDrill.tsx).

   Hier steht keine Zahl. Alles, was eine Zahl enthält, ist eine Funktion und
   bekommt sie übergeben — aus den gerechneten Daten. */
export const STR = defineStrings(
  {
    title: 'Pot-Odds-Drill',

    handLabel: 'Deine Hand',
    flopLabel: 'Flop',
    potLabel: 'Im Pot',
    betLabel: 'Er setzt',
    endpotLabel: 'Pot danach',
    bb: 'BB',

    question: 'Lohnt der Call?',
    yes: 'Lohnt sich',
    no: 'Lohnt nicht',

    equityLabel: 'So oft triffst du bis zum River',
    neededLabel: 'Nötig bei diesem Einsatz',
    turnLabel: 'Nur bis zum Turn',
    gapLabel: 'Abstand',

    verdictYes: 'Der Call lohnt sich',
    verdictNo: 'Der Call lohnt sich nicht',

    closeNote: 'Hauchdünn. Wer hier anders entscheidet, entscheidet nicht falsch.',
    minOuts: (n: number) => `Ab ${n} Outs trägt sich dieser Einsatz.`,
    minOutsNone: 'Dieser Einsatz trägt sich mit keiner Zahl von Outs aus dieser Tabelle.',
    /* Mit Punkt statt Präposition: Die Zielkategorie kommt aus den Daten
       („Straße", „Flush", „Ein Paar"), und keine deutsche Präposition passt
       zu allen. „bis zum Straße" stand einen Durchlauf lang da. */
    outsOf: (n: number, ziel: string) => `${n} Outs · zählt ab: ${ziel}`,

    /* Ein Satz, nicht drei: Die lange Fassung hat die Mindest-Outs unter die
       Bedienleiste geschoben. Was sie erklärte — dass der Turn-Wert die
       vorsichtige Lesart ist — sagt die Beschriftung daneben ohnehin. */
    assumption: 'Zwei Karten zu sehen heißt: auf dem Turn wird nicht noch einmal gesetzt.',

    next: 'Nächste Aufgabe',
    score: (richtig: number, gesamt: number) => `${richtig} von ${gesamt}`,

    share: 'Teilen',
    shareCopied: 'Link kopiert',
    shareTitle: 'Pot-Odds-Aufgabe',

    addressTitle: 'Diese Adresse führt nicht mehr zu dieser Aufgabe',
    addressUnreadable:
      'Der Link ist unvollständig oder verändert. In der Adresse steht die '
      + 'Situation selbst — fehlt ein Zeichen, fehlt die Aufgabe.',
    addressStale:
      'Der Link stammt aus einer Zeit, in der die Aufgaben anders sortiert '
      + 'waren. Die App zeigt lieber gar nichts als versehentlich eine andere '
      + 'Hand.',
    addressNew: 'Neue Aufgabe',

    loading: 'Daten werden geladen …',
    errorTitle: 'Die Aufgaben konnten nicht geladen werden',
    errorBody: 'Prüfe deine Verbindung und versuche es noch einmal.',
    retry: 'Erneut versuchen',
    details: 'Technische Einzelheiten',
    /* Der Einzeldatei-Build liegt oft allein irgendwo — dort ist
       eine Verbindungsprüfung kein Rat, sondern eine Zumutung. */
    errorHintSingle: 'Diese Einzeldatei braucht den Ordner „pokermath“ neben sich.',
  },
  {
    title: 'Pot odds drill',

    handLabel: 'Your hand',
    flopLabel: 'Flop',
    potLabel: 'In the pot',
    betLabel: 'He bets',
    endpotLabel: 'Pot after',
    bb: 'BB',

    question: 'Is the call worth it?',
    yes: 'Worth it',
    no: 'Not worth it',

    equityLabel: 'How often you get there by the river',
    neededLabel: 'Needed against this bet',
    turnLabel: 'By the turn only',
    gapLabel: 'Margin',

    verdictYes: 'The call is worth it',
    verdictNo: 'The call is not worth it',

    closeNote: 'Wafer-thin. Deciding the other way here is not deciding wrongly.',
    minOuts: (n: number) => `From ${n} outs this bet pays for itself.`,
    minOutsNone: 'No number of outs in this table makes this bet pay for itself.',
    outsOf: (n: number, ziel: string) => `${n} outs · counts from: ${ziel}`,

    assumption: 'Seeing two cards assumes no second bet on the turn.',

    next: 'Next hand',
    score: (richtig: number, gesamt: number) => `${richtig} of ${gesamt}`,

    share: 'Share',
    shareCopied: 'Link copied',
    shareTitle: 'Pot odds spot',

    addressTitle: 'This address no longer leads to this spot',
    addressUnreadable:
      'The link is incomplete or altered. The address holds the situation '
      + 'itself — a missing character means a missing spot.',
    addressStale:
      'The link is from a time when the spots were ordered differently. The '
      + 'app would rather show nothing than accidentally show a different hand.',
    addressNew: 'New spot',

    loading: 'Loading the computed data …',
    errorTitle: 'The tasks could not be loaded',
    errorBody: 'Check your connection and try again.',
    retry: 'Try again',
    details: 'Technical details',
    errorHintSingle: 'This single file needs the “pokermath” folder next to it.',
  },
);
