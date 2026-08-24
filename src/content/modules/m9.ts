import type { Module } from '../types';

const m9: Module = {
  id: 'm9',
  title: 'Poker-Varianten',
  subtitle: 'PLO, Short Deck, Stud & Co. – die Welt jenseits von Hold\'em',
  icon: '🌍',
  level: 'Fortgeschritten',
  lessons: [
    {
      id: 'm9-l1',
      title: 'Pot-Limit Omaha (PLO)',
      duration: 10,
      intro:
        'Omaha ist nach Hold\'em die zweitgrößte Poker-Variante der Welt – und der Ort, an dem Hold\'em-Spieler die teuersten Umgewöhnungsfehler machen. Diese Lektion erklärt die Regeln und die wichtigsten Strategie-Unterschiede.',
      sections: [
        {
          heading: 'Die Regeln: vier Karten, genau zwei zählen',
          body:
            'In Omaha bekommst du **vier** verdeckte Karten statt zwei. Die wichtigste Regel, die Einsteiger ständig vergessen: Du musst **genau zwei** deiner vier Karten mit **genau drei** Boardkarten kombinieren – nicht mehr, nicht weniger.\n\nLiegen vier Herz-Karten auf dem Board und du hältst nur das Herz-Ass, hast du KEINEN Flush – du brauchst zwei Herz-Karten in der Hand. Genauso macht ein Paar auf dem Board mit einer passenden Karte in deiner Hand noch lange kein Full House.\n\nGespielt wird fast immer **Pot-Limit**: Die maximale Bet ist die aktuelle Potgröße. Dadurch wachsen die Pötte langsamer als bei No-Limit, explodieren aber trotzdem regelmäßig – denn mit vier Karten treffen alle öfter etwas.',
          example:
            'Board: K♥ Q♥ 7♥ 2♥ 3♠. Du hältst A♥ A♠ 9♦ 8♦. Kein Flush! Du hast nur EIN Herz – für den Flush brauchst du zwei aus der Hand.',
        },
        {
          heading: 'Equities laufen eng zusammen',
          body:
            'Mit vier Karten hat jeder Spieler sechs Zwei-Karten-Kombinationen – dadurch liegen die Gewinnchancen vor dem Flop viel enger beieinander als in Hold\'em. Selbst das beste Startblatt (A-A-K-K double-suited) ist gegen eine ordentliche Hand selten deutlich besser als 60:40.\n\nDie Konsequenzen: Preflop-Aggression hat weniger Wert als in Hold\'em, dominierte Situationen entstehen erst nach dem Flop, und die Varianz ist spürbar höher. PLO wird deshalb oft „Action-Spiel“ genannt – aber die guten Spieler gewinnen nicht durch Action, sondern durch bessere Entscheidungen auf Turn und River.',
          tip:
            'Bankroll-Faustregel: Für PLO brauchst du wegen der höheren Varianz deutlich mehr Puffer als für Hold\'em – eher 50–100 Buy-ins statt 25–50.',
        },
        {
          heading: 'Nuts oder nichts',
          body:
            'Der wichtigste Strategie-Unterschied: In PLO gewinnen am Showdown viel öfter die **Nuts** oder Near-Nuts. Wenn drei Spieler den Flop sehen, hält beim großen All-in selten jemand weniger als ein Set, den Nut-Flush oder die Nut-Straße.\n\nDaraus folgen die klassischen PLO-Grundsätze:\n\n- Spiele Starthände, die **zusammenarbeiten** (vier Karten, die Straßen, Flushs und Sets gleichzeitig ermöglichen), z. B. J-T-9-8 double-suited.\n- Non-Nut-Draws sind gefährlich: Der kleine Flush verliert in PLO ständig gegen den größeren.\n- Ein Overpair ohne Verbesserungspotenzial ist fast nie eine Hand für große Pötte.\n\nHold\'em-Spieler überschätzen in PLO vor allem: nackte Asse, Top Pair und kleine Flushs. Das sind die drei teuersten Umgewöhnungsfehler.',
          cards: ['Jh', 'Th', '9s', '8s'],
        },
        {
          heading: 'Warum PLO boomt',
          body:
            'PLO wächst seit Jahren, weil es beides bietet: mehr Action für Freizeitspieler (jeder trifft öfter) und mehr Komplexität für ambitionierte Spieler (mehr Kombinationen, mehr schwierige Entscheidungen).\n\nWer solide Hold\'em-Grundlagen hat – Pot Odds, Position, Range-Denken –, bringt das Fundament mit. Aber PLO bestraft Auto-Pilot: Handwerte verschieben sich, Blocker werden noch wichtiger (vier eigene Karten blocken viel mehr), und Position ist wegen der vielen knappen Entscheidungen noch wertvoller als in Hold\'em.',
        },
      ],
      takeaways: [
        'Genau zwei Handkarten + genau drei Boardkarten – ohne Ausnahme.',
        'Equities laufen eng: Preflop ist selten jemand großer Favorit, die Varianz ist hoch.',
        'PLO ist ein Nuts-Spiel: Non-Nut-Flushs und nackte Overpairs sind die teuersten Fallen.',
        'Spiele koordinierte Starthände, die mehrere Nut-Draws gleichzeitig ermöglichen.',
        'Mehr Buy-ins als Bankroll-Puffer einplanen (eher 50–100).',
      ],
      quiz: [
        {
          question: 'Board: A♠ K♠ Q♠ J♠ 2♦. Du hältst T♠ 9♥ 8♦ 7♣. Was hast du?',
          options: [
            'Einen Royal Flush in Pik',
            'Eine Ass-hohe Straße (Broadway)',
            'Gar keine Straße – nur Ass-hoch',
            'Eine Königs-hohe Straße (K-Q-J-T-9)',
          ],
          correctIndex: 3,
          explanation:
            'In Omaha musst du genau zwei Handkarten verwenden. T♠ + 9♥ kombiniert mit K♠ Q♠ J♠ vom Board ergibt K-Q-J-T-9 – eine Königs-hohe Straße. Royal Flush oder Broadway sind unmöglich: Dafür müsstest du nur eine einzige Handkarte (T♠) nutzen, und genau das ist verboten. Diese Regel übersehen Hold\'em-Umsteiger am häufigsten.',
        },
        {
          question: 'Warum ist Preflop-Aggression in PLO weniger wertvoll als in Hold\'em?',
          options: [
            'Weil man in PLO nicht raisen darf',
            'Weil die Equities der Starthände viel enger beieinander liegen',
            'Weil es keine Blinds gibt',
            'Weil alle Spieler immer folden',
          ],
          correctIndex: 1,
          explanation:
            'Selbst Top-Hände sind selten klar besser als 60:40 – der Vorsprung, den du mit einem Raise ausbauen willst, ist einfach kleiner als in Hold\'em.',
        },
        {
          question: 'Welche Hand ist die klassische Hold\'em-Spieler-Falle in PLO?',
          options: [
            'Der Nut-Flush',
            'Ein Set auf trockenem Board',
            'Nackte Asse ohne koordinierte Beikarten',
            'Die Nut-Straße mit Flush-Draw',
          ],
          correctIndex: 2,
          explanation:
            'A-A-x-x ohne Zusammenarbeit der Beikarten sieht mächtig aus, ist aber nach dem Flop oft nur ein verwundbares Overpair – und verliert große Pötte gegen Sets, Straßen und Flushs.',
        },
        {
          question: 'Was bedeutet „Pot-Limit“?',
          options: [
            'Man darf maximal die aktuelle Potgröße setzen',
            'Der Pot ist auf 100bb begrenzt',
            'Man darf nur einmal pro Street setzen',
            'Es gibt keine Raises',
          ],
          correctIndex: 0,
          explanation:
            'Die maximale Bet/Raise entspricht der Potgröße (inklusive des eigenen Calls beim Raise). Dadurch wachsen Pötte kontrollierter als bei No-Limit – aber exponentiell schnell, wenn mehrere Streets gesetzt wird.',
        },
        {
          question: 'Warum sind kleine Flushs in PLO so gefährlich?',
          options: [
            'Weil Flushs in PLO nichts zählen',
            'Weil bei vier Handkarten pro Spieler viel öfter auch der höhere Flush im Spiel ist',
            'Weil man mit einem Flush nicht mehr setzen darf',
            'Weil das Board dann immer ein Paar zeigt',
          ],
          correctIndex: 1,
          explanation:
            'Mit sechs Zwei-Karten-Kombinationen pro Spieler steigt die Wahrscheinlichkeit dramatisch, dass jemand den besseren Flush hält. „Non-Nut“-Hände verlieren in PLO die großen Pötte.',
        },
      ],
    },
    {
      id: 'm9-l2',
      title: 'Short Deck (6+ Hold\'em)',
      duration: 8,
      intro:
        'Short Deck ist die Lieblings-Variante der High Roller: Hold\'em mit 36 Karten, veränderten Handrankings und deutlich mehr Action. Wer die Unterschiede nicht kennt, zahlt teuer.',
      sections: [
        {
          heading: 'Das Spiel mit 36 Karten',
          body:
            'Bei Short Deck werden alle Zweier bis Fünfer aus dem Deck entfernt – übrig bleiben 36 Karten von der Sechs bis zum Ass. Das Ass bleibt flexibel: Es bildet weiterhin die höchste Straße und ersetzt in der niedrigsten Straße die Fünf, sodass **A-6-7-8-9** eine gültige Straße ist.\n\nGespielt wird meist mit **Antes von allen Spielern** statt klassischer Blinds (der Button zahlt oft doppelt) – das macht jeden Pot von Anfang an größer und belohnt aggressives Spiel.\n\nPopulär wurde die Variante durch die Triton-High-Roller-Serie in Asien; inzwischen bieten sie auch große Online-Anbieter an.',
        },
        {
          heading: 'Neue Rankings: Der Flush steigt auf',
          body:
            'Weil vier Ränge fehlen, verschieben sich die Wahrscheinlichkeiten – und damit die Handrankings. Die wichtigste Änderung in den heute üblichen Regeln: **Der Flush schlägt das Full House.** Mit nur neun Karten pro Farbe ist ein Flush deutlich seltener geworden, ein Full House durch die dichteren Ränge deutlich häufiger.\n\nIn manchen älteren Regelvarianten schlägt zusätzlich der Drilling die Straße – die verbreiteten Online- und Triton-Regeln behalten aber die normale Reihenfolge (Straße > Drilling) bei. Frag im Zweifel IMMER vor dem ersten Blatt nach den Hausregeln.',
          table: {
            headers: ['Hand', 'Klassisch', 'Short Deck (üblich)'],
            rows: [
              ['Flush vs. Full House', 'Full House gewinnt', 'Flush gewinnt'],
              ['Straße vs. Drilling', 'Straße gewinnt', 'Straße gewinnt (Hausregeln prüfen!)'],
              ['Niedrigste Straße', 'A-2-3-4-5', 'A-6-7-8-9'],
            ],
          },
        },
        {
          heading: 'Strategie: Alles rückt zusammen',
          body:
            'Mit 36 Karten triffst du alles öfter: Straßen-Draws kommen häufiger an (ein offener Straßendraw trifft bis zum River fast die Hälfte der Zeit), Paare und gepaarte Boards sind allgegenwärtig, und die Equities laufen ähnlich eng wie in PLO.\n\nDie wichtigsten Anpassungen:\n\n- **Suited und connected** gewinnt an Wert – A-K-suited und Verbindungshände wie J-T-9 spielen sich hervorragend.\n- **Einzelne Paare verlieren an Wert**: Bei so vielen möglichen Straßen und Full Houses ist Top Pair schneller geschlagen als in Hold\'em.\n- **Flush-Draws sind Gold**, weil der Flush jetzt sogar Full Houses schlägt – aber sie kommen seltener an (nur noch 5 statt 9 Outs... genauer: 5 Karten deiner Farbe bleiben übrig).\n\nShort Deck belohnt Spieler, die neu rechnen, statt Hold\'em-Instinkte zu recyceln.',
          tip:
            'Die Regel von 2 und 4 gilt in Short Deck NICHT mehr – mit 36 Karten ist jedes Out ungefähr 3 % pro Karte wert. Ein Flush-Draw mit 5 Outs bringt bis zum River nur noch rund 30 %.',
        },
      ],
      takeaways: [
        '36 Karten (ohne 2–5), Antes statt Blinds, A-6-7-8-9 ist die niedrigste Straße.',
        'In den üblichen Regeln schlägt der Flush das Full House – Hausregeln immer prüfen.',
        'Straßen kommen viel öfter, einzelne Paare verlieren an Wert.',
        'Alte Faustregeln (Regel von 2 und 4) gelten nicht mehr – pro Out ca. 3 % je Karte rechnen.',
      ],
      quiz: [
        {
          question: 'Welche Karten fehlen im Short-Deck-Spiel?',
          options: ['Alle Bildkarten', 'Die Zweier bis Fünfer', 'Die Sechser bis Neuner', 'Die Asse'],
          correctIndex: 1,
          explanation: 'Es bleiben 36 Karten von der Sechs bis zum Ass übrig – daher der Name „6+ Hold\'em“.',
        },
        {
          question: 'Warum schlägt der Flush in Short Deck üblicherweise das Full House?',
          options: [
            'Aus Tradition',
            'Weil der Flush mit nur 9 Karten pro Farbe seltener geworden ist als das Full House',
            'Weil Full Houses verboten sind',
            'Weil das Ass fehlt',
          ],
          correctIndex: 1,
          explanation:
            'Rankings folgen der Seltenheit: Weniger Karten pro Farbe machen Flushs seltener, dichtere Ränge machen Full Houses häufiger – also tauschen sie die Plätze.',
        },
        {
          question: 'Was ist die niedrigste Straße in Short Deck?',
          options: ['A-2-3-4-5', '6-7-8-9-T', 'A-6-7-8-9', '5-6-7-8-9'],
          correctIndex: 2,
          explanation: 'Das Ass ersetzt die fehlende Fünf: A-6-7-8-9 ist die neue „Wheel“-Straße.',
        },
        {
          question: 'Wie viel ist ein Out in Short Deck ungefähr pro Karte wert?',
          options: ['Ca. 2 %', 'Ca. 3 %', 'Ca. 5 %', 'Ca. 10 %'],
          correctIndex: 1,
          explanation:
            'Mit nur 36 Karten ist jede unbekannte Karte „wertvoller“: rund 3 % pro Out und Karte statt ~2 % im vollen Deck.',
        },
      ],
    },
    {
      id: 'm9-l3',
      title: 'Seven Card Stud & Razz',
      duration: 8,
      intro:
        'Vor dem Hold\'em-Boom war Seven Card Stud DAS Pokerspiel. Wer es lernt, trainiert Fähigkeiten, die in jeder Variante Gold wert sind: Aufmerksamkeit, Gedächtnis und Geduld.',
      sections: [
        {
          heading: 'So funktioniert Stud',
          body:
            'Seven Card Stud kennt keine Gemeinschaftskarten und meist kein No-Limit – gespielt wird klassisch mit **festen Einsätzen (Fixed Limit)** und Antes.\n\nJeder Spieler erhält nach und nach **sieben eigene Karten**: zwei verdeckt und eine offen zum Start („Third Street“), dann drei weitere offene Karten und zum Schluss eine verdeckte. Die schlechteste offene Startkarte muss den „**Bring-in**“ zahlen und eröffnet damit die Action; ab der vierten Karte beginnt jeweils die beste sichtbare Hand.\n\nAm Showdown gewinnt wie gewohnt die beste Fünf-Karten-Hand aus den sieben eigenen Karten.',
        },
        {
          heading: 'Die Kernfähigkeit: tote Karten lesen',
          body:
            'Weil viele Karten offen liegen, ist Stud ein Spiel des Beobachtens: Welche Karten sind schon sichtbar – und damit für deine Draws **tot**?\n\nEin Beispiel: Du hältst vier Pik zur Flush-Chance. In Hold\'em rechnest du stumpf mit 9 Outs. In Stud zählst du zuerst, wie viele Pik bereits bei den Gegnern offen liegen – sind es drei, hast du nur noch sechs echte Outs. Gute Stud-Spieler merken sich JEDE gefoldete offene Karte.\n\nDie zweite Kernregel: Starthände brauchen entweder ein großes Paar, drei zusammenhängende hohe Karten oder drei zur gleichen Farbe – und die Stärke deiner Hand hängt immer davon ab, wie „lebendig“ deine Outs noch sind.',
          tip:
            'Genau dieses Beobachtungstraining macht Stud so wertvoll für Hold\'em-Spieler: Wer gelernt hat, tote Karten zu verfolgen, nimmt automatisch auch am Hold\'em-Tisch mehr wahr.',
        },
        {
          heading: 'Razz: Stud auf links gedreht',
          body:
            'Razz ist Seven Card Stud als **Lowball**: Die NIEDRIGSTE Hand gewinnt. Straßen und Flushs zählen nicht gegen dich, Asse sind immer niedrig – die bestmögliche Hand ist **A-2-3-4-5**, das „Wheel“.\n\nRazz dreht alle Instinkte um: Ein König als offene Startkarte ist eine Katastrophe, drei Karten unter der Acht sind Premium. Und weil jeder die offenen Karten der Gegner sieht, entsteht ein faszinierendes Informationsspiel: Zeigt dein Gegner 2-4-6 offen, während du 3-5-7 zeigst, aber verdeckt zwei Bildkarten hältst, weißt nur DU, wie schwach du wirklich bist – und umgekehrt.\n\nRazz gilt als das frustrierendste und zugleich lehrreichste Spiel der Mixed-Game-Welt: pure Disziplin und Odds-Rechnung.',
        },
      ],
      takeaways: [
        'Stud: sieben eigene Karten, kein Gemeinschafts-Board, klassisch Fixed Limit mit Antes und Bring-in.',
        'Die Kernfähigkeit ist das Verfolgen toter Karten – Outs sind nur so gut wie ihre „Lebendigkeit“.',
        'Razz ist Stud als Lowball: A-2-3-4-5 („Wheel“) ist die beste Hand.',
        'Stud-Training verbessert Aufmerksamkeit und Gedächtnis für jede andere Variante.',
      ],
      quiz: [
        {
          question: 'Wer zahlt in Stud den Bring-in?',
          options: [
            'Der Spieler links vom Dealer',
            'Der Spieler mit der schlechtesten offenen Startkarte',
            'Der Spieler mit der besten offenen Startkarte',
            'Alle Spieler gleichzeitig',
          ],
          correctIndex: 1,
          explanation:
            'Die niedrigste offene Karte eröffnet mit dem Bring-in die Action der Third Street. Ab der vierten Karte beginnt dann jeweils die beste sichtbare Hand.',
        },
        {
          question: 'Du hast vier Pik zur Flush-Chance, aber drei Pik liegen offen bei den Gegnern. Wie viele echte Outs hast du?',
          options: ['9', '6', '13', '3'],
          correctIndex: 1,
          explanation: 'Von 13 Pik sind 4 in deiner Hand und 3 sichtbar tot – bleiben 6 lebendige Outs.',
        },
        {
          question: 'Was ist die beste Hand in Razz?',
          options: ['A-A-A-A-K', 'A-2-3-4-5', '2-3-4-5-6', 'Royal Flush'],
          correctIndex: 1,
          explanation:
            'Razz ist Lowball: Die niedrigste Hand gewinnt, Straßen/Flushs zählen nicht, das Ass ist niedrig – A-2-3-4-5 („Wheel“) ist unschlagbar.',
        },
        {
          question: 'In welchem Setzformat wird Stud klassisch gespielt?',
          options: ['No-Limit', 'Pot-Limit', 'Fixed Limit', 'Ohne Einsätze'],
          correctIndex: 2,
          explanation:
            'Stud-Spiele laufen traditionell mit festen Einsatzgrößen – das verschiebt den Fokus von großen Bluffs hin zu präziser Odds-Rechnung über viele Streets.',
        },
      ],
    },
    {
      id: 'm9-l4',
      title: 'Mixed Games, Split Pots & Homegame-Formate',
      duration: 8,
      intro:
        'Die komplettesten Pokerspieler der Welt spielen nicht nur eine Variante. Diese Lektion gibt dir die Landkarte: Mixed Games, Split-Pot-Spiele und die Formate, die private Runden aufregender machen.',
      sections: [
        {
          heading: 'HORSE & 8-Game: der Zehnkampf des Pokers',
          body:
            'Bei Mixed Games rotiert die Variante nach festem Schema. Die bekanntesten Formate:\n\n- **HORSE**: Hold\'em, Omaha Hi/Lo, Razz, Stud, Stud Eight-or-better (Hi/Lo) – klassisch Fixed Limit.\n- **8-Game**: die fünf HORSE-Spiele plus 2-7 Triple Draw, No-Limit Hold\'em und Pot-Limit Omaha.\n\nDie prestigeträchtigsten Mixed-Titel (etwa das 50.000-Dollar-Poker-Players-Championship der WSOP) gelten in der Szene als wahre Weltmeisterschaften – weil man dort keinen einzigen Spielfehler in fremden Varianten verstecken kann.\n\nFür dein Lernen heißt das: Jede zusätzliche Variante zwingt dich, Poker-PRINZIPIEN statt auswendig gelernter Spielzüge zu verstehen – Equity, Position, Pot Odds und Gegner-Lesen funktionieren überall, nur die Vorzeichen ändern sich.',
        },
        {
          heading: 'Split-Pot-Spiele: zwei Gewinner pro Hand',
          body:
            'In **Hi/Lo-Varianten** (z. B. Omaha Hi/Lo, Stud Hi/Lo) wird der Pot geteilt: Die beste hohe Hand gewinnt eine Hälfte, die beste niedrige Hand (meist „8 or better“: fünf verschiedene Karten bis maximal zur Acht) die andere.\n\nDas strategische Ziel ist das **Scooping** – beide Hälften mit einer Hand gewinnen, etwa mit A-2-3-4-5, das gleichzeitig eine Straße (hoch) und ein perfektes Low ist. Wer dagegen ständig nur um eine Hälfte spielt, gewinnt langfristig fast nichts: Der halbe Pot enthält ja auch die Hälfte deiner eigenen Einsätze.\n\nAnfängerregel für alle Split-Spiele: Spiele Hände mit **Scoop-Potenzial** (A-2-x-x mit Ass suited in Omaha Hi/Lo) und meide Hände, die nur eine Richtung können.',
          tip: 'Merksatz der Mixed-Game-Profis: „Drei Viertel gewinnen ist gut, scoopen ist das Ziel, um die Hälfte kämpfen ist verlieren in Zeitlupe.“',
        },
        {
          heading: 'Homegame-Klassiker: Bomb Pots, Stand-up & Co.',
          body:
            'Private Runden lieben Formate, die Action garantieren:\n\n- **Bomb Pot**: Alle zahlen vor der Hand einen festen Betrag, Preflop wird übersprungen, es geht direkt mit großem Pot zum Flop – oft als Double-Board-Variante mit zwei Flops.\n- **Stand-up Game**: Wer zuerst eine Hand gewinnt, darf sich „setzen“ – der letzte Stehende zahlt eine Strafe.\n- **Dealer\'s Choice**: Wer den Button hat, wählt die Variante der Runde – die Homegame-Version von Mixed Games.\n\nStrategisch gilt bei allen Action-Formaten dasselbe: Große Pötte ohne Preflop-Information bedeuten **Nut-orientiertes Spiel**. In einem Bomb Pot mit sieben Spielern ist Top Pair fast wertlos – gespielt werden Draws zu den Nuts und fertige Monster.',
        },
      ],
      takeaways: [
        'HORSE und 8-Game rotieren durch mehrere Varianten – die Königsdisziplin kompletter Spieler.',
        'In Hi/Lo-Spielen ist Scooping (beide Pot-Hälften) das Ziel – halbe Pötte sind Zeitlupen-Verlust.',
        'Bomb Pots & Co. sind Multiway-Action ohne Preflop-Info: strikt Nut-orientiert spielen.',
        'Jede neue Variante vertieft dein Verständnis der universellen Poker-Prinzipien.',
      ],
      quiz: [
        {
          question: 'Wofür steht das „R“ in HORSE?',
          options: ['River', 'Razz', 'Rush', 'Rebuy'],
          correctIndex: 1,
          explanation: 'HORSE = Hold\'em, Omaha Hi/Lo, Razz, Stud, Stud Eight-or-better.',
        },
        {
          question: 'Was bedeutet „Scoopen“ in einem Hi/Lo-Spiel?',
          options: [
            'Den Pot aufgeben',
            'Beide Pot-Hälften (High und Low) mit einer Hand gewinnen',
            'Nur die Low-Hälfte gewinnen',
            'Alle Chips nachkaufen',
          ],
          correctIndex: 1,
          explanation:
            'Wer High und Low gleichzeitig gewinnt, kassiert den ganzen Pot – das strategische Ziel jeder Split-Pot-Variante.',
        },
        {
          question: 'Warum ist Top Pair in einem 7-Spieler-Bomb-Pot fast wertlos?',
          options: [
            'Weil Paare dort nicht zählen',
            'Weil ohne Preflop-Selektion sieben zufällige Ranges den Flop sehen – irgendjemand trifft fast immer besser',
            'Weil man mit Top Pair nicht setzen darf',
            'Weil der Pot geteilt wird',
          ],
          correctIndex: 1,
          explanation:
            'Multiway ohne Preflop-Filter bedeutet: Die Gewinnhand ist im Schnitt viel stärker. Es gewinnen Nuts und Nut-Draws, nicht marginale Paare.',
        },
        {
          question: 'Welche Omaha-Hi/Lo-Starthand hat das beste Scoop-Potenzial?',
          options: ['K-K-Q-J ohne Suits', 'A-2-3-4 mit Ass suited', '9-9-8-8', 'Q-J-T-9 offsuit'],
          correctIndex: 1,
          explanation:
            'A-2-x-x mit niedrigen Beikarten kann das beste Low UND (über Wheel-Straßen und Nut-Flush) das beste High machen – der Prototyp einer Scoop-Hand.',
        },
      ],
    },
    {
      id: 'm9-l5',
      title: 'Welche Variante passt zu dir?',
      duration: 7,
      intro:
        'Zum Abschluss: eine ehrliche Entscheidungshilfe. Welche Variante lohnt sich wann – und wie überträgst du dein Hold\'em-Wissen, ohne teure Umgewöhnungsfehler zu machen?',
      sections: [
        {
          heading: 'Die Landkarte im Überblick',
          body:
            'Es gibt keine „beste“ Variante – nur die beste für dein Ziel:\n\n- **No-Limit Hold\'em** bleibt die Basis: größte Spielerauswahl, meiste Lernressourcen, das strategische Fundament für alles andere. Dein Hauptspiel, bis die Grundlagen sitzen.\n- **Pot-Limit Omaha** für alle, die mehr Action und mehr Komplexität wollen – und die Bankroll für höhere Varianz haben.\n- **Short Deck**, wenn du gern neu rechnest und flache Equities magst.\n- **Stud/Razz/Mixed** für Geduldige, die die kompletteste Poker-Ausbildung wollen.\n\nDer bewährte Lernpfad: Hold\'em-Fundament (diese App!) → gelegentlich PLO zum Reinschnuppern → Mixed Games, wenn dich Poker als Ganzes packt.',
          table: {
            headers: ['Variante', 'Action', 'Varianz', 'Lernkurve', 'Für wen?'],
            rows: [
              ['NL Hold\'em', 'mittel', 'mittel', 'moderat', 'Fundament für alle'],
              ['PLO', 'hoch', 'hoch', 'steil', 'Action-Fans mit Bankroll-Puffer'],
              ['Short Deck', 'sehr hoch', 'hoch', 'moderat', 'Rechner & Gambler'],
              ['Stud/Razz', 'niedrig', 'niedrig', 'lang', 'Geduldige Beobachter'],
              ['Mixed Games', 'variiert', 'mittel', 'am längsten', 'Komplettspieler'],
            ],
          },
        },
        {
          heading: 'Skills, die überall gelten – und welche nicht',
          body:
            'Diese Fähigkeiten aus deinem Hold\'em-Training übertragen sich auf JEDE Variante:\n\n- Pot Odds, Equity und EV-Denken\n- Position und Initiative\n- Range-Denken statt Einzelhand-Raten\n- Tilt-Kontrolle und Bankroll-Disziplin\n- Gegner beobachten und einordnen\n\nNICHT übertragbar sind dagegen konkrete Handwerte und Faustregeln: Was in Hold\'em ein Monster ist, ist in PLO Durchschnitt; die Regel von 2 und 4 stirbt in Short Deck; Top Pair ist in Bomb Pots Deko. Der häufigste Fehler beim Varianten-Wechsel ist es, alte Handbewertungen mitzunehmen – die Prinzipien reisen mit, die Zahlen musst du neu lernen.',
          tip:
            'Wechsle die Variante immer ein bis zwei Limits TIEFER als dein Hold\'em-Stammlimit – das Lehrgeld ist so deutlich günstiger.',
        },
        {
          heading: 'Bankroll-Anpassung nach Varianz',
          body:
            'Je enger die Equities und je größer die Pötte, desto mehr Puffer braucht deine Bankroll:\n\n- NL Hold\'em Cash: 25–50 Buy-ins (dein bekannter Richtwert)\n- PLO Cash: 50–100 Buy-ins\n- Short Deck: eher noch konservativer – die Ante-Struktur zwingt zu viel Action\n- Fixed-Limit-Spiele (Stud & Co.): deutlich mildere Schwankungen, hier reichen 300–400 Big Bets\n\nDie Regel dahinter ist immer dieselbe: Varianz bestimmt den Puffer. Wer diese Anpassung ignoriert, verwechselt am Ende einen normalen PLO-Downswing mit „Ich kann das Spiel nicht“ – oder ist schlicht broke, bevor der Skill greifen konnte.',
        },
      ],
      takeaways: [
        'NL Hold\'em ist und bleibt das Fundament – Varianten kommen danach.',
        'Prinzipien (Odds, Position, Ranges, Disziplin) reisen mit – konkrete Handwerte nicht.',
        'Beim Varianten-Wechsel: ein bis zwei Limits tiefer einsteigen.',
        'Bankroll an die Varianz anpassen: PLO braucht ~doppelt so viel Puffer wie Hold\'em.',
      ],
      quiz: [
        {
          question: 'Welche Fähigkeit überträgt sich NICHT direkt von Hold\'em auf andere Varianten?',
          options: [
            'Pot-Odds-Rechnung',
            'Positionsbewusstsein',
            'Konkrete Handbewertungen wie „Top Pair ist stark“',
            'Tilt-Kontrolle',
          ],
          correctIndex: 2,
          explanation:
            'Prinzipien reisen mit, absolute Handwerte nicht: Top Pair ist in PLO oder Bomb Pots oft nahezu wertlos. Die Zahlen jeder Variante musst du neu lernen.',
        },
        {
          question: 'Wie viel Bankroll-Puffer empfiehlt sich für PLO-Cash im Vergleich zu Hold\'em?',
          options: [
            'Halb so viel – PLO ist einfacher',
            'Gleich viel',
            'Etwa doppelt so viel (50–100 Buy-ins)',
            'Bankroll spielt in PLO keine Rolle',
          ],
          correctIndex: 2,
          explanation:
            'Die engeren Equities und größeren Multiway-Pötte erhöhen die Varianz deutlich – der Puffer muss mitwachsen.',
        },
        {
          question: 'Was ist der empfohlene Lernpfad für Einsteiger?',
          options: [
            'Sofort alle Varianten parallel lernen',
            'Hold\'em-Fundament zuerst, dann Varianten erkunden',
            'Mit Razz anfangen',
            'Nur Short Deck spielen',
          ],
          correctIndex: 1,
          explanation:
            'Hold\'em bietet die meisten Ressourcen und Gegner und baut das strategische Fundament, auf dem jede weitere Variante aufsetzt.',
        },
        {
          question: 'Warum solltest du eine neue Variante auf niedrigeren Limits starten?',
          options: [
            'Weil höhere Limits verboten sind',
            'Weil du dort garantiert gewinnst',
            'Weil Umgewöhnungsfehler unvermeidlich sind – auf kleinen Limits kosten sie wenig Lehrgeld',
            'Weil die Regeln dort anders sind',
          ],
          correctIndex: 2,
          explanation:
            'Selbst starke Hold\'em-Spieler zahlen in neuen Varianten anfangs Lehrgeld. Wer tiefer einsteigt, kauft dieselbe Lernerfahrung zum Bruchteil des Preises.',
        },
      ],
    },
  ],
};

export default m9;
