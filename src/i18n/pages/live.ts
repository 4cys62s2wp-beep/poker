import { defineStrings } from '..';

/* Texte des Live-Bereichs. Hier steht keine Zahl — was eine enthält, ist
   eine Funktion und bekommt sie übergeben. */
export const STR = defineStrings(
  {
    // ── Einrichten ──────────────────────────────────────────────────────
    einrichtenTitel: 'Abend einrichten',
    einrichtenSub: 'Was liegt auf dem Tisch, und wie lange soll es gehen?',
    zurueck: 'Live-Session',

    kofferTitel: 'Was liegt im Koffer?',
    kofferSub: 'Eine Zeile je Farbe. Die häufigste bekommt den kleinsten Wert.',
    farbe: 'Farbe',
    anzahl: 'Anzahl',
    farbeHinzu: 'Farbe hinzufügen',
    farbeWeg: 'Entfernen',

    einsatzTitel: 'Geld im Spiel?',
    einsatzSub: 'Freiwillig. Ohne Angabe wird kein Kurs gerechnet.',
    euroJeSpieler: 'Euro je Person',

    dauerTitel: 'Wie lange?',
    dauerSub: 'Regelfall zwei bis drei Stunden.',
    dauerMinuten: (m: number) => `${Math.floor(m / 60)} h ${m % 60 > 0 ? `${m % 60} min` : ''}`.trim(),
    tempoTitel: 'Wie schnell steigen die Blinds?',
    tempoGemuetlich: 'Gemütlich',
    tempoNormal: 'Normal',
    tempoSchnell: 'Schnell',
    tempoStufe: (min: number) => `${min} Minuten je Stufe`,
    gleichbleibend: 'Blinds bleiben, wie sie sind',
    gleichbleibendSub: 'Für einen Abend ohne Turnierende.',

    // ── Ergebnis der Verteilung ─────────────────────────────────────────
    ergebnisTitel: 'Das kommt dabei heraus',
    startchips: 'Startchips je Person',
    blindsAnfang: 'Blinds am Anfang',
    kurs: (punkte: string, euro: string) => `${punkte} Punkte für ${euro} €`,
    jeSpielerKurz: (n: number, farbe: string) => `${n} × ${farbe}`,
    uebrigInBank: (n: number) => `${n} bleiben als Wechselgeld liegen`,
    wertJeChip: (w: number) => `je ${w}`,

    hinweisMaterial: (max: number) =>
      max < 2
        ? 'Das Material reicht für keinen vollständigen Tisch.'
        : `Das Material reicht nicht für so viele. Möglich sind höchstens ${max}.`,
    hinweisWenigKleine: 'Wenige kleine Chips. Nach ein paar Runden muss gewechselt werden.',
    hinweisSorteLiegt: 'Eine Farbe bleibt im Koffer — fünf Werte sind am Tisch das Äußerste.',

    stufenTitel: 'Blindstufen',
    finaleGut: (bb: number) => `Am Ende bleiben den letzten drei im Schnitt ${bb} Big Blinds — das trägt ein Finale.`,
    finaleZuKurz: (noetig: number) =>
      `Für so viele Startchips ist der Abend zu kurz. Mit dieser Steigung bräuchte es etwa ${Math.round(noetig / 60)} Stunden.`,

    spielerNamen: 'Wer spielt mit?',
    spielerNamenSub: 'Ein Name genügt. Ohne Konto, ohne Anmeldung.',
    namePlatzhalter: 'Name',
    spielerHinzu: 'Spieler hinzufügen',

    losgehts: 'Abend starten',
    losgehtsFehlt: 'Erst Koffer und Spieler eintragen',

    // ── Tisch ───────────────────────────────────────────────────────────
    blinds: 'Blinds',
    restzeit: 'Restzeit',
    danach: 'Danach',
    letzteStufe: 'Letzte Stufe',
    pause: 'Pause',
    weiter: 'Weiter',
    pausiert: 'Pausiert',
    verlassen: 'Beenden',
    verlassenFrage: 'Abend wirklich beenden?',
    verlassenSub: 'Die Runde wird abgeschlossen. Der Stand bleibt erhalten.',
    verlassenJa: 'Beenden',
    verlassenNein: 'Weiterspielen',
    keineSession: 'Es läuft gerade kein Abend.',
    einrichten: 'Abend einrichten',
  },
  {
    einrichtenTitel: 'Set up the evening',
    einrichtenSub: 'What is on the table, and how long should it run?',
    zurueck: 'Live session',

    kofferTitel: 'What is in the case?',
    kofferSub: 'One row per colour. The most numerous gets the smallest value.',
    farbe: 'Colour',
    anzahl: 'Count',
    farbeHinzu: 'Add colour',
    farbeWeg: 'Remove',

    einsatzTitel: 'Money involved?',
    einsatzSub: 'Optional. Without it, no rate is worked out.',
    euroJeSpieler: 'Euro per person',

    dauerTitel: 'How long?',
    dauerSub: 'Usually two to three hours.',
    dauerMinuten: (m: number) => `${Math.floor(m / 60)} h ${m % 60 > 0 ? `${m % 60} min` : ''}`.trim(),
    tempoTitel: 'How fast do the blinds rise?',
    tempoGemuetlich: 'Leisurely',
    tempoNormal: 'Normal',
    tempoSchnell: 'Fast',
    tempoStufe: (min: number) => `${min} minutes per level`,
    gleichbleibend: 'Blinds stay as they are',
    gleichbleibendSub: 'For an evening without a tournament finish.',

    ergebnisTitel: 'Here is what comes out',
    startchips: 'Starting chips per person',
    blindsAnfang: 'Blinds at the start',
    kurs: (punkte: string, euro: string) => `${punkte} points for €${euro}`,
    jeSpielerKurz: (n: number, farbe: string) => `${n} × ${farbe}`,
    uebrigInBank: (n: number) => `${n} stay in the bank for change`,
    wertJeChip: (w: number) => `${w} each`,

    hinweisMaterial: (max: number) =>
      max < 2
        ? 'The material is not enough for a full table.'
        : `Not enough material for that many. At most ${max} are possible.`,
    hinweisWenigKleine: 'Few small chips. After a few rounds you will need to make change.',
    hinweisSorteLiegt: 'One colour stays in the case — five values is the most a table can handle.',

    stufenTitel: 'Blind levels',
    finaleGut: (bb: number) => `At the end the last three average ${bb} big blinds — that carries a final.`,
    finaleZuKurz: (noetig: number) =>
      `The evening is too short for that many starting chips. At this rate it would take about ${Math.round(noetig / 60)} hours.`,

    spielerNamen: 'Who is playing?',
    spielerNamenSub: 'A name is enough. No account, no sign-in.',
    namePlatzhalter: 'Name',
    spielerHinzu: 'Add player',

    losgehts: 'Start the evening',
    losgehtsFehlt: 'Enter the case and the players first',

    blinds: 'Blinds',
    restzeit: 'Time left',
    danach: 'Then',
    letzteStufe: 'Final level',
    pause: 'Pause',
    weiter: 'Resume',
    pausiert: 'Paused',
    verlassen: 'Finish',
    verlassenFrage: 'Really finish the evening?',
    verlassenSub: 'The round will be closed. The standings are kept.',
    verlassenJa: 'Finish',
    verlassenNein: 'Keep playing',
    keineSession: 'No evening is running right now.',
    einrichten: 'Set up the evening',
  },
);
