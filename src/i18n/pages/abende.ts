/* Texte der Abend-Bildschirme. Keine Zahl steht hier — Zahlen kommen aus den
   gespeicherten Abenden, Sätze über Zahlen bekommen ihre Werte übergeben. */

export const STR = {
  de: {
    listeTitel: 'Frühere Abende',
    listeSub: 'Tippe einen Namen an, um alle Abende dieser Person zu sehen.',
    leerTitel: 'Noch kein Abend aufgezeichnet.',
    leerSub: 'Der erste wird gespeichert, sobald ein Abend beendet wird.',
    abendEinrichten: 'Abend einrichten',
    zurueckListe: 'Frühere Abende',
    zurueckSession: 'Live-Session',

    spielerTitel: (name: string) => name,
    spielerSub: (abende: number, siege: number) =>
      `${abende === 1 ? '1 Abend' : `${abende} Abende`}, ${siege === 1 ? '1 Sieg' : `${siege} Siege`}.`,
    alleNamen: 'Wer schon mitgespielt hat',

    dauer: 'Dauer',
    stufe: 'Blinds am Ende',
    startchips: 'Startchips',
    platz: (n: number) => `${n}.`,
    gewonnen: 'gewonnen',
    ausgeschieden: 'ausgeschieden',
    chips: 'Chips',
    keineChips: '—',
    spielerZahl: (n: number) => (n === 1 ? '1 Person' : `${n} Personen`),
    unbekannterAbend: 'Diesen Abend gibt es nicht mehr.',
  },
  en: {
    listeTitel: 'Earlier evenings',
    listeSub: 'Tap a name to see every evening with that person.',
    leerTitel: 'No evening recorded yet.',
    leerSub: 'The first one is kept as soon as an evening is finished.',
    abendEinrichten: 'Set up an evening',
    zurueckListe: 'Earlier evenings',
    zurueckSession: 'Live session',

    spielerTitel: (name: string) => name,
    spielerSub: (abende: number, siege: number) =>
      `${abende === 1 ? '1 evening' : `${abende} evenings`}, ${siege === 1 ? '1 win' : `${siege} wins`}.`,
    alleNamen: 'Who has played',

    dauer: 'Duration',
    stufe: 'Blinds at the end',
    startchips: 'Starting stack',
    platz: (n: number) => `${n}.`,
    gewonnen: 'won',
    ausgeschieden: 'out',
    chips: 'chips',
    keineChips: '—',
    spielerZahl: (n: number) => (n === 1 ? '1 person' : `${n} people`),
    unbekannterAbend: 'That evening no longer exists.',
  },
} as const;
