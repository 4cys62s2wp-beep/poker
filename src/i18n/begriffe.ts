/* Eine Aktion, ein Wort.
   ======================

   Die App hatte für dieselbe Sache zwei oder drei Wörter, je nachdem, wer den
   Bildschirm geschrieben hatte: „Raise“ am Knopf und „erhöht auf 7“ im Verlauf;
   „Shove“, „All-in“ und „schieben“ im selben Trainer; „Topf“ im Drill und „Pot“
   im Trainer daneben; „Flushdraw“ 87-mal, „Flush Draw“ 15-mal und
   „Flush-Draw“ 9-mal; „KI-Gegner“ und „Computergegner“; „Dealer-Knopf“ und
   „Dealer-Button“; „Streak“ und „Serie“. Wer lernt, was ein Wort heißt, und es
   dann anders wiederfindet, lernt zwei Dinge.

   Diese Liste legt fest, welches Wort gilt. `begriffe.test.ts` liest alle
   deutschen Texte der App und meldet jeden verbotenen Ausdruck. Wer ein neues
   Wort einführt, trägt es hier ein — mit dem Grund, nicht nur mit der Regel.

   Nicht erfasst ist, was Bedeutung verändert: „erhöhen“ als gewöhnliches Verb
   („erhöht die Wahrscheinlichkeit“) ist kein Poker-Raise und bleibt erlaubt.
   Verboten sind nur die Formen, in denen es die Aktion meint. */

export interface Begriff {
  /** Worum es geht. */
  gegenstand: string;
  /** Das eine Wort. */
  wort: string;
  /** Was nicht vorkommen darf. */
  verboten: RegExp;
  /** Ein Satz, der die Regel auslösen muss — die Prüfung prüft sich selbst. */
  beispiel: string;
  /** Warum gerade dieses Wort. */
  grund: string;
  /**
   * Wo die Regel gilt. `oberflaeche` heißt: Bildschirme, Knöpfe, Trainer —
   * nicht die Lektionen, in denen ein Begriff ausdrücklich erklärt wird
   * (dort steht „Shove“ als Fachwort mit Erklärung).
   */
  gilt: 'alles' | 'oberflaeche';
  /** Pfadteile, in denen das Wort etwas anderes meint. */
  ausser?: string[];
}

export const BEGRIFFE: Begriff[] = [
  {
    gegenstand: 'Raise (die Aktion)',
    wort: 'Raise',
    verboten: /\b(?:hat|haben) erhöht\b|\berhöht auf\b|\bErhöhung\b/,
    beispiel: 'Hero erhöht auf 7',
    grund: 'Am Knopf steht „Raise …“, im Verlauf stand „erhöht auf“ — dieselbe '
      + 'Handlung mit zwei Wörtern. Raise ist das Wort, das Spieler am Tisch benutzen; '
      + 'als Verb passt es zu callt, foldet, checkt: „raist auf“.',
    gilt: 'oberflaeche',
  },
  {
    gegenstand: 'All-in (die Aktion)',
    wort: 'All-in',
    verboten: /\b[Ss]hove|\bgeschoben\b|\bschiebst\b/,
    beispiel: 'ein Standard-Shove',
    grund: 'Push, Shove, schieben und All-in meinten im Push/Fold-Trainer dasselbe. '
      + '„Push/Fold“ bleibt als Name des Trainers; die Handlung heißt All-in.',
    gilt: 'oberflaeche',
    ausser: ['src/content/modules/', 'src/content/scenarios.ts', 'src/content/glossary.ts'],
  },
  {
    gegenstand: 'Pot (das Geld in der Mitte)',
    wort: 'Pot',
    verboten: /\bTopf\b/,
    beispiel: 'Im Topf',
    grund: 'Das Modul, die Lektionen und der Trainer sagen Pot, nur der Drill sagte '
      + 'Topf: 584 zu 19. Wer „Pot Odds“ lernt, soll den Pot wiederfinden.',
    gilt: 'alles',
    /* Dort ist es der Preispool des Abends, nicht der Pot einer Hand. */
    ausser: ['src/i18n/pages/payout.ts', 'src/lib/poker/payout.ts', 'src/i18n/pages/abende.ts'],
  },
  {
    gegenstand: 'Flushdraw',
    wort: 'Flushdraw',
    verboten: /Flush[ -][Dd]raw/,
    beispiel: 'ein Flush Draw am Flop',
    grund: 'Drei Schreibweisen (87, 15 und 9 Mal). Die häufigste gilt; der '
      + 'Glossareintrag und seine Verweise heißen genauso.',
    gilt: 'alles',
  },
  {
    gegenstand: 'Overcards',
    wort: 'Overcards',
    verboten: /Überkarte/,
    beispiel: 'zwei Überkarten',
    grund: 'Die Oberfläche und die Lektionen sagen Overcards; nur die Beispiele des '
      + 'Drills sagten Überkarten (aus tools/poker-math, E-020).',
    gilt: 'alles',
  },
  {
    gegenstand: 'Gegner, die der Computer spielt',
    wort: 'Computergegner',
    verboten: /\bKI-Gegner\b/,
    beispiel: 'gegen KI-Gegner',
    grund: 'Auf der Lernseite stand Computergegner, auf der Übungstisch-Seite KI-Gegner. '
      + 'Die Gegner rechnen nicht lernend; „Computer“ verspricht nicht mehr, als da ist.',
    gilt: 'alles',
  },
  {
    gegenstand: 'Der Dealer-Button',
    wort: 'Dealer-Button',
    verboten: /\bDealer-Knopf\b/,
    beispiel: 'Dealer-Knopf',
    grund: 'Die Lektionen sagen Dealer-Button (und Button für die Position). Ein '
      + 'Knopf ist in der App ein Ding zum Tippen.',
    gilt: 'alles',
  },
  {
    gegenstand: 'Gewonnene Folge',
    wort: 'Serie',
    verboten: /\bStreak\b/,
    beispiel: 'Lern-Streak',
    grund: 'Die Trainer sagen Serie, das Profil sagte Streak. Dazu kommt „Tage in Folge“ '
      + 'für die Lernserie.',
    gilt: 'alles',
  },
  {
    gegenstand: 'Aufgeben (Verb)',
    wort: 'foldet',
    verboten: /\bfolded\b/,
    beispiel: 'wer zu häufig folded',
    grund: 'Das Verlaufsprotokoll sagt „foldet“, „callt“, „checkt“. Ein Wort im Perfekt '
      + 'stand allein da.',
    gilt: 'alles',
    /* In diesen Pfaden ist `folded` ein Bezeichner im Code, kein Wortlaut. */
    ausser: ['src/pages/', 'src/state/', 'src/components/', 'src/lib/poker/'],
  },
];

/** Die Stufen, die ein Modul haben darf. „Pro“ gehört dem Abo, nicht der Schwierigkeit. */
export const MODUL_STUFEN = ['Einsteiger', 'Fortgeschritten', 'Experte'] as const;
