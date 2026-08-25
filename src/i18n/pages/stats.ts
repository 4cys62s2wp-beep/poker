import { defineStrings } from '..';

/* Texte der Spielstil-Analyse (src/pages/StatsPage.tsx).
   Die Bibliothek src/lib/poker/stats.ts liefert nur Zahlen und Codes –
   jede Formulierung steht hier, damit beide Sprachen dieselbe Aussage
   treffen und nichts nur auf Deutsch existiert. */
export const STR = defineStrings(
  {
    title: 'Dein Spielstil',
    sub: 'Aus deinen Händen am Übungstisch berechnet – dieselben Kennzahlen, mit denen Profis ihr eigenes Spiel prüfen.',

    emptyTitle: 'Noch keine Hände gespielt',
    emptyBody:
      'Sobald du am Übungstisch spielst, entsteht hier deine Auswertung: Wie viele Hände du spielst, wie oft du erhöhst, wie aggressiv du nach dem Flop bist – und was das über deinen Stil verrät.',
    emptyCta: 'Zum Übungstisch',

    handsPlayed: (n: number) => `${n} ${n === 1 ? 'Hand' : 'Hände'} ausgewertet`,
    onlyPracticeTable:
      'Gezählt werden nur Hände am Übungstisch. Am Pokerabend-Tisch spielen mehrere Leute auf einem Gerät – dort ließe sich nicht sauber trennen, wer welche Entscheidung getroffen hat.',

    // Aussagekraft
    confidenceTitle: 'Aussagekraft',
    confidence: {
      none: 'keine Daten',
      weak: 'noch wenig aussagekräftig',
      fair: 'brauchbar',
      solid: 'belastbar',
    },
    weakWarning: (need: number) =>
      `Über so wenige Hände sind diese Zahlen noch Zufall. Wer dreimal hintereinander schlechte Karten bekommt, hat 0 % gespielte Hände – das sagt nichts über den Stil. Ab etwa ${need} Händen wird das Bild belastbar.`,

    // Spielstil-Diagramm
    styleTitle: 'Deine Einordnung',
    axisTight: 'Tight',
    axisTightSub: 'wenige Hände',
    axisLoose: 'Loose',
    axisLooseSub: 'viele Hände',
    axisAggressive: 'Aggressiv',
    axisAggressiveSub: 'mehr Bets & Raises',
    axisPassive: 'Passiv',
    axisPassiveSub: 'mehr Calls',
    styleUnknown: 'Noch nicht einzuordnen',
    styleUnknownBody: (need: number) =>
      `Ab ${need} Händen zeigen wir dir hier, welcher Spielertyp du bist.`,
    styleNames: {
      rock: 'Rock',
      tag: 'TAG',
      lag: 'LAG',
      fish: 'Calling Station',
      unknown: '—',
    },
    styleDesc: {
      rock: 'Sehr wenige Hände, wenig Aggression. Du verlierst kaum – gewinnst aber auch selten groß, weil du zu viele spielbare Situationen wegwirfst.',
      tag: 'Tight-aggressiv: wenige Hände, die aber entschlossen. Das ist der Stil, mit dem die meisten soliden Gewinnspieler arbeiten.',
      lag: 'Loose-aggressiv: viele Hände, viel Druck. Funktioniert – verlangt aber gutes Postflop-Gespür, sonst wird es teuer.',
      fish: 'Viele Hände, wenig Aggression. Der teuerste Stil: Du zahlst oft mit, setzt aber selten selbst. Genau daran verdienen die anderen.',
      unknown: '',
    },

    // Kennzahlen
    metricsTitle: 'Kennzahlen',
    target: (min: number, max: number) => `Ziel ${min}–${max} %`,
    noData: 'keine Daten',
    ofOpportunities: (n: number) => `aus ${n}`,
    verdictLabel: {
      low: 'zu niedrig',
      good: 'im Zielbereich',
      high: 'zu hoch',
      unknown: '—',
    },
    metricNames: {
      vpip: 'Gespielte Hände (VPIP)',
      pfr: 'Preflop erhöht (PFR)',
      afq: 'Aggression nach dem Flop (AFq)',
      wtsd: 'Bis zum Showdown (WTSD)',
      wsd: 'Showdown gewonnen (W$SD)',
    },
    metricExplain: {
      vpip: 'Wie oft du freiwillig Chips in den Pot gibst. Blinds zählen nicht mit.',
      pfr: 'Wie oft du vor dem Flop erhöhst, statt nur mitzugehen.',
      afq: 'Anteil deiner Bets und Raises an allen gewerteten Aktionen nach dem Flop.',
      wtsd: 'Wie oft es nach gesehenem Flop bis zum Aufdecken geht.',
      wsd: 'Wie oft du einen Showdown gewinnst, wenn es dazu kommt.',
    },

    // Der eine Hinweis
    hintTitle: 'Woran du zuerst arbeiten solltest',
    noHintTitle: 'Nichts Auffälliges',
    noHintBody:
      'Deine Kennzahlen liegen im Rahmen oder es sind noch zu wenige Hände für ein Urteil. Spiel weiter – sobald etwas deutlich aus der Reihe fällt, steht es hier.',
    hints: {
      vpip: {
        low: 'Du spielst zu wenige Hände. Damit gibst du Situationen weg, in denen du klar vorne wärst – besonders in später Position und gegen schwache Gegner. Nimm suited Connectors und mittlere Paare häufiger mit.',
        high: 'Du spielst zu viele Hände. Das ist der häufigste und teuerste Anfängerfehler: Aus einer schwachen Starthand wird nach dem Flop selten etwas, und du zahlst die ganze Hand dafür. Wirf schwache Blätter aus früher Position konsequent weg.',
      },
      pfr: {
        low: 'Du gehst zu oft nur mit, statt zu erhöhen. Wer limpt, gibt die Initiative ab und weiß nach dem Flop nie, woran er ist. Wenn eine Hand gut genug zum Mitgehen ist, ist sie meist gut genug zum Erhöhen.',
        high: 'Du erhöhst vor dem Flop sehr oft. Das setzt Gegner unter Druck, kostet aber Chips, wenn du die Hände danach nicht spielen kannst. Achte darauf, dass die Blätter zu deinen Erhöhungen passen.',
      },
      afq: {
        low: 'Nach dem Flop spielst du zu passiv – viel Mitgehen, wenig eigene Bets. Damit gewinnst du nur, wenn du das beste Blatt hast. Wer selbst setzt, gewinnt zusätzlich die Pötte, in denen der Gegner aufgibt.',
        high: 'Du bist nach dem Flop sehr aggressiv. Das funktioniert gegen vorsichtige Gegner, wird aber teuer, wenn jemand mitgeht. Achte darauf, dass hinter deinen Bets auch etwas steckt.',
      },
      wtsd: {
        low: 'Du gibst nach dem Flop oft auf. Manchmal richtig – aber wer zu häufig folded, wird berechenbar und wird angegriffen. Prüfe, ob du wirklich schlechter dran bist oder nur unsicher.',
        high: 'Du gehst zu oft bis zum Aufdecken. Das ist meist ein Zeichen, dass du zu selten aufgibst, wenn die Hand nicht mehr gut ist. Ein Fold auf dem Turn spart mehr Chips als ein guter Call auf dem River einbringt.',
      },
      wsd: {
        low: 'Du gewinnst deine Showdowns selten. Das heißt: Du kommst mit zu schwachen Blättern bis zum Aufdecken. Steig früher aus, wenn dein Blatt sich nicht verbessert.',
        high: 'Du gewinnst fast jeden Showdown – klingt gut, heißt aber meist, dass du nur mit sehr starken Blättern bis zum Ende gehst. Damit bist du berechenbar und verdienst weniger, als du könntest.',
      },
    },

    // Fold-Verhalten
    foldTitle: 'Wie oft du aufgibst',
    foldSub: 'Jeweils bezogen auf die Situationen, in denen ein Einsatz zu callen war.',
    streetNames: {
      preflop: 'Preflop',
      flop: 'Flop',
      turn: 'Turn',
      river: 'River',
    },

    // Bilanz
    balanceTitle: 'Bilanz',
    handsLabel: 'Hände',
    wonLabel: 'gewonnen',
    chipsLabel: 'Chips',
    resetTitle: 'Auswertung zurücksetzen',
    resetBody:
      'Löscht die Kennzahlen, nicht deinen Lernfortschritt. Sinnvoll, wenn du etwas Neues ausprobierst und sehen willst, wie sich das auswirkt.',
    resetButton: 'Kennzahlen zurücksetzen',
    resetConfirm: 'Wirklich alle Kennzahlen löschen? Dein Lernfortschritt bleibt erhalten.',
    resetDone: 'Kennzahlen zurückgesetzt.',

    navStats: 'Spielstil',
  },
  {
    title: 'Your Playing Style',
    sub: 'Calculated from your hands at the practice table – the same metrics professionals use to review their own game.',

    emptyTitle: 'No hands played yet',
    emptyBody:
      'As soon as you play at the practice table, your analysis appears here: how many hands you play, how often you raise, how aggressive you are after the flop – and what that says about your style.',
    emptyCta: 'To the practice table',

    handsPlayed: (n: number) => `${n} ${n === 1 ? 'hand' : 'hands'} analysed`,
    onlyPracticeTable:
      'Only hands at the practice table are counted. At the poker night table several people share one device – there it would be impossible to tell cleanly who made which decision.',

    confidenceTitle: 'Reliability',
    confidence: {
      none: 'no data',
      weak: 'not yet meaningful',
      fair: 'usable',
      solid: 'reliable',
    },
    weakWarning: (need: number) =>
      `Over this few hands these numbers are still chance. Someone dealt three bad hands in a row shows 0 % hands played – that says nothing about their style. From around ${need} hands the picture becomes reliable.`,

    styleTitle: 'Your classification',
    axisTight: 'Tight',
    axisTightSub: 'fewer hands',
    axisLoose: 'Loose',
    axisLooseSub: 'more hands',
    axisAggressive: 'Aggressive',
    axisAggressiveSub: 'more bets & raises',
    axisPassive: 'Passive',
    axisPassiveSub: 'more calls',
    styleUnknown: 'Not classifiable yet',
    styleUnknownBody: (need: number) =>
      `From ${need} hands on we will show you which player type you are.`,
    styleNames: {
      rock: 'Rock',
      tag: 'TAG',
      lag: 'LAG',
      fish: 'Calling Station',
      unknown: '—',
    },
    styleDesc: {
      rock: 'Very few hands, little aggression. You rarely lose – but you rarely win big either, because you throw away too many playable spots.',
      tag: 'Tight-aggressive: few hands, but played with conviction. This is the style most solid winning players use.',
      lag: 'Loose-aggressive: many hands, lots of pressure. It works – but it demands good postflop instincts, otherwise it gets expensive.',
      fish: 'Many hands, little aggression. The most expensive style: you call often but rarely bet yourself. That is exactly what the others profit from.',
      unknown: '',
    },

    metricsTitle: 'Metrics',
    target: (min: number, max: number) => `Target ${min}–${max} %`,
    noData: 'no data',
    ofOpportunities: (n: number) => `of ${n}`,
    verdictLabel: {
      low: 'too low',
      good: 'on target',
      high: 'too high',
      unknown: '—',
    },
    metricNames: {
      vpip: 'Hands played (VPIP)',
      pfr: 'Preflop raise (PFR)',
      afq: 'Postflop aggression (AFq)',
      wtsd: 'Went to showdown (WTSD)',
      wsd: 'Won at showdown (W$SD)',
    },
    metricExplain: {
      vpip: 'How often you voluntarily put chips in the pot. Blinds do not count.',
      pfr: 'How often you raise before the flop instead of just calling.',
      afq: 'Share of your bets and raises among all counted actions after the flop.',
      wtsd: 'How often you reach showdown after seeing the flop.',
      wsd: 'How often you win a showdown once you get there.',
    },

    hintTitle: 'What to work on first',
    noHintTitle: 'Nothing standing out',
    noHintBody:
      'Your metrics are within range, or there are still too few hands for a verdict. Keep playing – as soon as something clearly stands out, it appears here.',
    hints: {
      vpip: {
        low: 'You play too few hands. That gives away spots where you would clearly be ahead – especially in late position and against weak opponents. Take suited connectors and medium pairs along more often.',
        high: 'You play too many hands. This is the most common and most expensive beginner mistake: a weak starting hand rarely turns into anything after the flop, and you pay for the whole hand. Fold weak holdings from early position consistently.',
      },
      pfr: {
        low: 'You call too often instead of raising. Limping hands over the initiative and leaves you guessing after the flop. If a hand is good enough to call with, it is usually good enough to raise with.',
        high: 'You raise very often before the flop. That puts opponents under pressure, but it costs chips when you cannot play the hands afterwards. Make sure your holdings match your raises.',
      },
      afq: {
        low: 'After the flop you play too passively – lots of calling, few bets of your own. That way you only win when you hold the best hand. Betting yourself also wins the pots where your opponent gives up.',
        high: 'You are very aggressive after the flop. That works against cautious opponents but gets expensive when someone calls. Make sure there is something behind your bets.',
      },
      wtsd: {
        low: 'You give up often after the flop. Sometimes correct – but folding too frequently makes you predictable and invites attacks. Check whether you are really behind or just uncertain.',
        high: 'You reach showdown too often. That usually means you give up too rarely once the hand is no longer good. A fold on the turn saves more chips than a good river call earns.',
      },
      wsd: {
        low: 'You rarely win your showdowns. That means you get to the showdown with hands that are too weak. Get out earlier when your hand does not improve.',
        high: 'You win almost every showdown – which sounds good, but usually means you only go to the end with very strong hands. That makes you predictable and earns you less than you could.',
      },
    },

    foldTitle: 'How often you fold',
    foldSub: 'Each relative to the spots where there was a bet to call.',
    streetNames: {
      preflop: 'Preflop',
      flop: 'Flop',
      turn: 'Turn',
      river: 'River',
    },

    balanceTitle: 'Balance',
    handsLabel: 'hands',
    wonLabel: 'won',
    chipsLabel: 'chips',
    resetTitle: 'Reset analysis',
    resetBody:
      'Clears the metrics, not your learning progress. Useful when you try something new and want to see how it plays out.',
    resetButton: 'Reset metrics',
    resetConfirm: 'Really delete all metrics? Your learning progress stays.',
    resetDone: 'Metrics reset.',

    navStats: 'Style',
  },
);
