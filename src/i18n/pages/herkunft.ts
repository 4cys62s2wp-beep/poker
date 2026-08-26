import { defineStrings } from '..';

/* Texte der Herkunftsanzeige (src/components/Herkunft.tsx).

   Hier stehen ausschließlich Beschriftungen. Jede Angabe über eine Zahl —
   Methode, Zweck, Annahmen, Bibliothek, Stand — kommt wörtlich aus dem
   Herkunftsblock der Datei und wird hier nicht umformuliert.

   Die einzige Ausnahme ist `methodeExakt` / `methodeMonteCarlo`: eine
   Erklärung der beiden Fachwörter. Sie sagt nichts über einen konkreten
   Wert aus, sondern erklärt, was das Wort bedeutet, das in den Daten steht.
   Ohne sie wäre die Anzeige für den, für den sie gedacht ist, wertlos. */
export const STR = defineStrings(
  {
    oeffnen: 'Warum diese Zahl?',
    schliessen: 'Schließen',

    titel: 'Warum diese Zahl',

    woSteht: 'Wo sie steht',
    abgeleitet: 'In der App aus diesen beiden Werten gebildet:',

    rechenweg: 'Wie gerechnet wurde',
    methodeExakt:
      'Jeder mögliche Fall wurde einzeln durchgerechnet. Nichts ist geschätzt, '
      + 'nichts gemittelt. Dieselbe Rechnung kommt immer auf dasselbe Ergebnis.',
    methodeMonteCarlo:
      'Nicht jeder Fall wurde durchgerechnet, sondern sehr viele zufällig '
      + 'gezogene. Das Ergebnis ist deshalb eine sehr genaue Schätzung, keine '
      + 'exakte Zahl.',
    faelle: 'Durchgerechnete Fälle',
    faelleFehlen:
      'Wie viele Fälle durchgerechnet wurden, steht nicht in den Daten. '
      + 'Die Zahl hier zu erfinden wäre schlimmer, als sie wegzulassen.',

    zweck: 'Wofür dieser Block gerechnet wurde',

    annahmen: 'Woraus gerechnet wurde',
    sicht: 'Sicht',
    unbekannt: 'Unbekannte Karten',
    splitPot: 'Geteilte Pötte',
    kartenzahlen: 'Kartenzahlen',
    karten: (k: { deck: number; eigene_karten: number; unbekannt_nach_flop: number; unbekannt_nach_turn: number }) =>
      `Deck ${k.deck} · eigene Karten ${k.eigene_karten} · `
      + `nach dem Flop unbekannt ${k.unbekannt_nach_flop} · nach dem Turn ${k.unbekannt_nach_turn}`,

    besonderheiten: 'Was dabei zu beachten ist',

    womit: 'Womit gerechnet wurde',
    bibliothek: (name: string, version: string) => `${name}, Version ${version}`,
    bibliothekFehlt:
      'Für diesen Block war keine Bibliothek zum Bewerten von Blättern nötig — '
      + 'es ist reine Kombinatorik. Die Daten nennen deshalb keine.',

    stand: 'Stand',
    quelle: 'Vollständige Fassung mit allen Belegen',
  },
  {
    oeffnen: 'Why this number?',
    schliessen: 'Close',

    titel: 'Why this number',

    woSteht: 'Where it lives',
    abgeleitet: 'Formed in the app from these two values:',

    rechenweg: 'How it was computed',
    methodeExakt:
      'Every possible case was worked through one by one. Nothing is estimated, '
      + 'nothing averaged. The same computation always gives the same result.',
    methodeMonteCarlo:
      'Not every case was worked through, but a very large number of randomly '
      + 'drawn ones. The result is therefore a very close estimate, not an '
      + 'exact figure.',
    faelle: 'Cases worked through',
    faelleFehlen:
      'How many cases were worked through is not in the data. Inventing the '
      + 'figure here would be worse than leaving it out.',

    zweck: 'What this block was computed for',

    annahmen: 'What it was computed from',
    sicht: 'Point of view',
    unbekannt: 'Unknown cards',
    splitPot: 'Split pots',
    kartenzahlen: 'Card counts',
    karten: (k: { deck: number; eigene_karten: number; unbekannt_nach_flop: number; unbekannt_nach_turn: number }) =>
      `deck ${k.deck} · own cards ${k.eigene_karten} · `
      + `unknown after the flop ${k.unbekannt_nach_flop} · after the turn ${k.unbekannt_nach_turn}`,

    besonderheiten: 'What to keep in mind',

    womit: 'What it was computed with',
    bibliothek: (name: string, version: string) => `${name}, version ${version}`,
    bibliothekFehlt:
      'This block needed no hand-evaluation library — it is pure combinatorics. '
      + 'The data therefore names none.',

    stand: 'As of',
    quelle: 'Full version with all the evidence',
  },
);
