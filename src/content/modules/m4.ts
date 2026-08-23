import type { Module } from '../types';

const m4: Module = {
  id: 'm4',
  title: 'Postflop-Spiel',
  subtitle: 'C-Bets, Value Bets und Bluffs – wo das Geld verdient wird',
  icon: '🎯',
  level: 'Fortgeschritten',
  lessons: [
    {
      id: 'm4-l1',
      title: 'Boardtexturen lesen',
      duration: 9,
      intro:
        'Der Flop verwandelt zwei verdeckte Karten in ein konkretes Kräfteverhältnis. Wer Boardtexturen schnell und richtig einordnet, weiß schon vor der ersten Postflop-Entscheidung, wem das Board gehört – und findet dadurch fast automatisch die besseren Linien.',
      sections: [
        {
          heading: 'Warum die Textur deine Strategie diktiert',
          body:
            'Die **Boardtextur** beschreibt, wie die Gemeinschaftskarten zusammenwirken: Wie hoch sind die Karten? Sind sie verbunden? Liegen zwei oder drei Karten einer Farbe? Ist das Board gepaart? Aus diesen Merkmalen ergibt sich, welche Preflop-Range wie viele starke Hände, wie viele Draws und wie viel Luft auf diesem Board hält.\n\nDieselbe Hand spielt sich auf verschiedenen Texturen komplett unterschiedlich. Top Pair auf einem trockenen Board ist ein bequemer Value-Kandidat über mehrere Streets. Dasselbe Top Pair auf einem eng verbundenen Board mit zwei Karten einer Farbe ist oft nur noch eine Hand, die einen Weg zum günstigen Showdown sucht.\n\nDeshalb beginnt jede gute Postflop-Entscheidung mit zwei Fragen: Erstens, wie ist die Textur beschaffen – trocken oder nass, statisch oder dynamisch? Zweitens, welche der beiden Ranges profitiert davon? Erst danach geht es um deine konkreten zwei Karten. Wer diese Reihenfolge verinnerlicht, denkt automatisch in Ranges statt in Einzelhänden – die wichtigste Denkgewohnheit im Postflop-Spiel.',
          tip: 'Gewöhne dir an, bei jedem Flop zuerst laut (oder im Kopf) die Textur zu benennen, bevor du auf deine eigenen Karten schaust. Nach ein paar Sessions passiert das automatisch – und deine Entscheidungen werden spürbar strukturierter.',
        },
        {
          heading: 'Trocken vs. nass',
          body:
            'Ein **trockenes (dry) Board** ist unverbunden und meist rainbow (drei verschiedene Farben): K♦ 7♠ 2♥, A♠ 8♦ 3♣, Q♥ 6♣ 2♠. Es gibt kaum Draws – wer hier vorne liegt, liegt meistens auch nach dem Turn noch vorne. Ranges treffen solche Boards selten hart: Der häufigste Fall ist "kein Paar gegen kein Paar".\n\nEin **nasses (wet) Board** ist verbunden und/oder zweifarbig: J♥ T♥ 8♣, T♠ 9♠ 8♦, Q♦ J♦ 9♠. Hier wimmelt es von Flushdraws, offenen Straight-Draws und Gutshots. Viele Hände haben ordentliche Equity gegeneinander, und selbst starke Made Hands sind verwundbar.\n\nDie strategische Konsequenz: Auf trockenen Boards kannst du mit kleinen Bets viel erreichen, weil der Gegner meist wenig hat und Draws kaum existieren. Auf nassen Boards musst du mit stärkeren Sizings arbeiten – Draws sollen für ihre Equity bezahlen, und deine starken Hände wollen den Pot aufbauen, solange sie noch klar vorne sind.',
          cards: ['Kd', '7s', '2h'],
          table: {
            headers: ['Merkmal', 'Trockenes Board', 'Nasses Board'],
            rows: [
              ['Beispiele', 'K♦ 7♠ 2♥, A♠ 8♦ 3♣', 'J♥ T♥ 8♣, T♠ 9♠ 8♦'],
              ['Draws', 'kaum vorhanden', 'viele Flush- und Straight-Draws'],
              ['Typisches C-Bet-Sizing', 'klein (25–33 %)', 'groß (66–75 %)'],
              ['Verwundbarkeit starker Hände', 'gering', 'hoch'],
            ],
          },
        },
        {
          heading: 'Statisch vs. dynamisch',
          body:
            'Die zweite Dimension: Wie stark können sich die Kräfteverhältnisse durch Turn und River noch verschieben?\n\nEin **statisches Board** wie K♦ 7♠ 2♥ verändert sich kaum. Wer am Flop die beste Hand hält, hält sie sehr oft auch am River. Gepaarte Boards wie 7♣ 7♦ 2♠ sind extrem statisch. Auf solchen Texturen hast du Zeit: Du kannst Value über drei Streets verteilen, kleinere Sizings wählen und musst kaum Angst vor Umkehrungen haben.\n\nEin **dynamisches Board** wie T♠ 9♠ 8♦ ist das Gegenteil: Fast jeder Turn – jede Q, J, 7, 6 oder dritte Pik-Karte – kann die Rangfolge der Hände komplett umwerfen. Hier gilt: Wer jetzt vorne ist, muss jetzt Geld in den Pot bekommen. Starke, aber verwundbare Hände wollen groß betten, solange ihre Equity noch da ist. Slowplay ist auf dynamischen Boards fast immer ein Fehler.\n\nWichtig: Nass und dynamisch überlappen stark, sind aber nicht identisch. A♥ K♥ 2♥ ist nass (Monotone-Board), aber relativ statisch – der fertige Flush ist schon da, und nur eine vierte Herz-Karte ändert viel.',
          example:
            'Auf K♦ 7♠ 2♥ ist A♣ K♠ (Top Pair, Top Kicker) am River noch sehr häufig die beste Hand. Auf T♠ 9♠ 8♦ kann sogar Two Pair mit T♥ 9♥ schon am Turn von jeder Q, J, 7, 6 oder dritten Pik-Karte überholt werden – dieselbe relative Stärke, völlig anderes Risiko.',
        },
        {
          heading: 'Range Advantage: Wessen Range trifft das Board?',
          body:
            'Der **Range Advantage** (Range-Vorteil) beantwortet die Frage: Welche der beiden gesamten Ranges hat auf diesem Board mehr Equity?\n\nKlassisches Beispiel: Du raist preflop, der Big Blind callt, der Flop kommt A♥ 7♦ 2♣. Dieses Board gehört dir. Deine Range enthält alle stärksten Hände komplett: AA, AK, AQ, AJ und alle starken Pocket Pairs wie KK und QQ. Der Big Blind dagegen hätte AA, KK und AK meist ge-3-bettet – seine Calling Range ist nach oben hin **gecappt** (gedeckelt). Dazu kommt: Deine Raising Range ist voller Ax-Hände, seine Calling Range voller mittlerer Karten, die dieses Board komplett verfehlen.\n\nDie Konsequenz aus einem klaren Range-Vorteil: Du darfst sehr häufig und günstig c-betten, denn der Gegner kann sich gegen kleine Bets kaum wehren – er hat schlicht zu selten etwas. Genau daraus entsteht die moderne Strategie der kleinen Range-Bets auf Ass-hohen und König-hohen trockenen Boards.\n\nMerke: Range Advantage hängt fast immer daran, wem die hohen Karten helfen und wer die ungecappte Range hat – und das ist auf hohen, trockenen Boards der Preflop-Aggressor.',
          cards: ['Ah', '7d', '2c'],
          tip: 'Stell dir bei jedem Flop die Frage: "Wer von uns hat hier mehr Overpairs und Top Pairs mit gutem Kicker?" Die Antwort verrät dir in Sekunden, wer den Range-Vorteil hält.',
        },
        {
          heading: 'Nut Advantage: Wer hält die Monster?',
          body:
            'Der **Nut Advantage** ist die zweite, feinere Frage: Wer hält mehr von den allerstärksten Händen – Sets, Straights, Two Pairs? Er kann beim anderen Spieler liegen als der reine Equity-Vorteil.\n\nBeispiel: Du raist am Button, der Big Blind callt, Flop T♠ 9♠ 8♦. Der Big Blind verteidigt preflop viele Hände wie T9s, 98s, 87s, 76s, J7s und kleine Paare – genau das Material, das auf diesem Board Straights, Two Pairs und Sets ergibt. Deine Overpairs wie QQ oder KK sind zwar noch oft vorne, aber sie sind hier keine Monster mehr, sondern eher Bluff-Catcher gegen Aggression.\n\nSolche mittleren, verbundenen Boards helfen der Calling Range des Big Blind deutlich mehr als der Range des Raisers. Die Konsequenz: Als Raiser c-bettest du hier seltener und vorsichtiger, und du musst damit rechnen, geraist zu werden. Umgekehrt darf der Big Blind auf solchen Texturen aggressiv werden – mit seinen starken Händen und passenden Semi-Bluffs.\n\nFaustregel: Hohe, trockene Boards gehören dem Preflop-Raiser. Mittlere und niedrige, verbundene Boards helfen dem Caller. Gepaarte und ganz niedrige Boards liegen dazwischen und verlangen einen genaueren Blick.',
          cards: ['Ts', '9s', '8d'],
        },
      ],
      takeaways: [
        'Boardtextur zuerst, eigene Hand danach: Trocken oder nass, statisch oder dynamisch – daraus folgt der Plan.',
        'Trockene, statische Boards erlauben kleine Bets und Value über mehrere Streets; nasse, dynamische Boards verlangen große Bets, solange die Equity noch da ist.',
        'Range Advantage = wessen Gesamt-Range mehr Equity hat. Hohe, trockene Boards wie A72 rainbow gehören dem Preflop-Raiser.',
        'Nut Advantage = wer mehr Sets, Straights und Two Pairs hält. Mittlere, verbundene Boards wie T98 two-tone helfen dem Caller.',
        'Die Calling Range des Gegners ist meist gecappt – deine stärksten Hände hat er oft gar nicht mehr in der Range.',
      ],
      quiz: [
        {
          question: 'Welches dieser Boards ist am ehesten trocken und statisch?',
          options: ['K♦ 7♠ 2♥', 'T♠ 9♠ 8♦', 'Q♥ J♥ 9♣', 'J♠ T♦ 8♠'],
          correctIndex: 0,
          explanation:
            'K72 rainbow ist unverbunden, ohne Flush- oder Straight-Draws – kaum ein Turn oder River verändert die Kräfteverhältnisse. Die anderen Boards sind verbunden und/oder zweifarbig und damit nass und dynamisch.',
        },
        {
          question: 'Was bedeutet es, wenn ein Board "dynamisch" ist?',
          options: [
            'Es liegen mindestens zwei hohe Karten',
            'Die Kräfteverhältnisse können sich durch Turn und River stark verschieben',
            'Der Pot wächst automatisch schneller',
            'Es ist immer ein gepaartes Board',
          ],
          correctIndex: 1,
          explanation:
            'Dynamisch heißt: Viele kommende Karten können die Rangfolge der Hände umwerfen. Deshalb müssen starke, verwundbare Hände auf dynamischen Boards sofort Value holen statt langsam zu spielen.',
        },
        {
          question: 'Warum hat der Preflop-Raiser auf A♥ 7♦ 2♣ einen klaren Range-Vorteil gegenüber dem Big Blind?',
          options: [
            'Weil der Big Blind auf diesem Board nie ein Ass halten kann',
            'Weil nur der Raiser Hände wie AA, AK und alle Overpairs vollständig in der Range hat, während der Big Blind diese meist ge-3-bettet hätte',
            'Weil trockene Boards grundsätzlich immer dem Raiser gehören',
            'Weil der Raiser Position auf den Big Blind hat',
          ],
          correctIndex: 1,
          explanation:
            'Der Big Blind hält zwar auch Ax-Hände, aber seine Calling Range ist gecappt: Die absoluten Top-Hände fehlen, weil er sie preflop ge-3-bettet hätte. Der Raiser hat sie alle – plus viele starke Ax. Position ist ein eigener, davon unabhängiger Vorteil.',
        },
        {
          question: 'Warum ist T♠ 9♠ 8♦ ein gutes Board für die Range des Big-Blind-Callers?',
          options: [
            'Seine Calling Range steckt voller Hände wie T9s, 98s, 87s und 76s, die hier Two Pairs, Straights und starke Draws machen – er hat den Nut Advantage',
            'Der Big Blind hat auf jedem Flop mehr Equity als der Raiser',
            'Der Raiser kann auf diesem Board kein Overpair halten',
            'Weil zwei Pik liegen und der Big Blind nur suited Hände callt',
          ],
          correctIndex: 0,
          explanation:
            'Mittlere, verbundene Karten treffen genau die suited Connectors und mittleren Hände, mit denen der Big Blind preflop verteidigt. Die Overpairs des Raisers sind noch oft vorne, aber die Monster liegen überproportional beim Caller.',
        },
        {
          question: 'Du hältst A♦ K♠ auf K♦ 7♠ 2♥ (Top Pair, Top Kicker). Welche Konsequenz ergibt sich aus der statischen Textur?',
          options: [
            'Du musst sofort groß betten, weil viele Draws dich überholen können',
            'Du kannst kleiner betten und den Value entspannt auf mehrere Streets verteilen, weil deine Hand nur selten überholt wird',
            'Du solltest checken, weil dich keine schlechtere Hand callt',
            'Du solltest den Pot mit einem Overbet sofort maximal aufblasen',
          ],
          correctIndex: 1,
          explanation:
            'Auf statischen Boards gibt es kaum Draws, deine Hand bleibt fast immer die beste. Es besteht keine Eile – kleinere Bets über drei Streets halten schwächere Hände in der Range des Gegners und maximieren so den Value.',
        },
      ],
    },
    {
      id: 'm4-l2',
      title: 'Continuation Bets',
      duration: 9,
      intro:
        'Die Continuation Bet (C-Bet) – die Bet des Preflop-Raisers am Flop – ist das meistgenutzte Werkzeug im Postflop-Spiel. Richtig eingesetzt gewinnt sie unzählige kleine Pötte fast risikolos; falsch eingesetzt verbrennt sie deine Winrate Stück für Stück.',
      sections: [
        {
          heading: 'Warum die C-Bet so stark ist',
          body:
            'Zwei Kräfte machen die C-Bet profitabel. Erstens die **Initiative**: Du hast preflop Stärke signalisiert und darfst diese Geschichte am Flop glaubwürdig fortsetzen. Zweitens die **Fold Equity**: Eine ungepaarte Starthand trifft am Flop nur in rund einem Drittel der Fälle ein Paar oder besser. Dein Gegner hat also meistens wenig – und Hände ohne Substanz können gegen eine Bet kaum weiterspielen.\n\nDie Mathematik dahinter ist bestechend: Eine Bluff-Bet von einem Drittel des Pots muss nur in 25 % der Fälle einen sofortigen Fold erzeugen, um sich selbst zu bezahlen. Jedes Extra-Prozent an Folds darüber ist reiner Gewinn – und dabei ist noch nicht eingerechnet, dass du auch nach einem Call oft noch gewinnen kannst.\n\nAber Vorsicht vor dem Autopiloten: Die Zeiten, in denen man jede Hand auf jedem Board c-bettet, sind vorbei. Gute Gegner attackieren Spieler, die zu oft betten, mit Raises und Floats. Die moderne C-Bet-Strategie richtet sich deshalb streng nach der Boardtextur: Auf manchen Boards bettest du fast immer klein, auf anderen selten und groß – die nächsten Abschnitte zeigen dir das System dahinter.',
          tip: 'Frage dich vor jeder C-Bet: Was will diese Bet erreichen – Folds von besseren Händen, Calls von schlechteren oder Schutz meiner Equity? Wenn du keine Antwort findest, ist Checken meist die bessere Wahl.',
        },
        {
          heading: 'Klein auf trockenen Boards: die Range-Bet',
          body:
            'Auf hohen, trockenen Boards mit klarem Range-Vorteil – A♥ 7♦ 2♣, K♦ 8♠ 3♥, Q♠ 7♦ 2♣ als Preflop-Raiser gegen den Big Blind – ist der moderne Standard eine **kleine C-Bet von 25–33 % des Pots mit nahezu der gesamten Range**.\n\nWarum funktioniert das? Der Gegner hat auf diesen Boards meistens nichts und kann gegen keine Bet-Größe profitabel weiterspielen. Du brauchst also gar kein großes Sizing, um Folds zu erzeugen. Gleichzeitig erreicht die kleine Bet drei Dinge auf einmal:\n\n- Deine Bluffs und schwachen Hände kaufen billig den Pot oder eine kostenlose Karte auf dem Turn.\n- Deine Value-Hände bekommen Calls von Händen, die gegen eine große Bet folden würden.\n- Du nimmst Händen wie zwei Overcards oder Gutshots ihre kostenlose Chance, dich zu überholen (Equity Denial).\n\nWeil du hier fast deine ganze Range bettest, ist die Bet auch kaum auszubeuten: Der Gegner kann aus der kleinen Bet nichts über deine Handstärke ablesen. Wichtig ist die Voraussetzung: Dieses Rezept gilt für Boards mit klarem Range-Vorteil – nicht als Universallösung für jeden Flop.',
          example:
            'Du raist am Button auf 2,5bb, der Big Blind callt. Flop K♦ 8♠ 3♥, Pot 5,5bb. Du bettest 1,75bb (ca. 33 %) – mit AK genauso wie mit 65s. Der Big Blind foldet alles ohne Treffer oder Draw-Potenzial, und schon dieser häufige Fall macht die Bet hochprofitabel.',
        },
        {
          heading: 'Groß und polarisiert auf nassen Boards',
          body:
            'Auf nassen, dynamischen Boards wie J♥ T♥ 8♣ dreht sich die Logik um. Hier trifft auch die Range des Gegners viel – kleine Bets erzeugen kaum Folds, und deine starken Hände sind verwundbar. Deshalb bettest du hier **seltener, aber größer: 66–75 % des Pots, mit einer polarisierten Range**.\n\nPolarisiert heißt: Du bettest deine starken Value-Hände (Two Pair+, Sets, starke Kombinationen aus Paar und Draw) und deine besten Semi-Bluffs (Flushdraws, offene Straight-Draws). Die Mitte deiner Range – schwache Paare, mittlere Showdown-Hände – checkt.\n\nDie große Bet erfüllt zwei Zwecke: Deine Value-Hände bauen den Pot auf, solange sie klar vorne sind, und zwingen Draws, einen schlechten Preis für ihre Equity zu bezahlen. Und deine Semi-Bluffs erzeugen echten Druck, weil auch mittlere Made Hands gegen ein 75-%-Sizing unangenehme Entscheidungen treffen müssen – mit dem Draw als Fallschirm, falls du gecallt wirst.\n\nAuf Boards, die klar die Range des Callers treffen (etwa T♠ 9♠ 8♦ als Button gegen Big Blind), reduzierst du die C-Bet-Frequenz insgesamt deutlich und checkst auch viele ordentliche Hände.',
          cards: ['Jh', 'Th', '8c'],
        },
        {
          heading: 'Wann checken: Check-Back-Kandidaten',
          body:
            'Nicht betten ist keine Kapitulation, sondern oft der Plan mit dem höchsten Erwartungswert. Die klassischen **Check-Back-Kandidaten** in Position:\n\n- **Mittlere Showdown-Hände**: zweites oder drittes Paar, Ass-hoch. Diese Hände werden von Schlechterem selten gecallt und von Besserem nicht gefoldet – eine Bet erreicht also fast nichts. Sie wollen günstig zum Showdown oder am Turn neu bewerten.\n- **Verwundbare Hände auf gefährlichen Boards**, die eine Check-Raise nicht gut verkraften würden.\n- **Schwache Hände mit Live-Equity**, etwa zwei Overcards mit Backdoor-Draws, die auf einem guten Turn zum Semi-Bluff werden können (Stichwort Delayed C-Bet, mehr dazu in Lektion 6).\n\nDer Check-Back kontrolliert die Potgröße, verhindert, dass du dich mit mittleren Händen selbst in schwierige Situationen bettest, und lädt aggressive Gegner ein, auf späteren Streets in dich hineinzubluffen – Bluffs, die du mit deiner Showdown-Stärke dann bequem callen kannst.',
          example:
            'Du raist am Button mit A♣ 9♣, der Big Blind callt. Flop Q♦ 9♦ 5♠. Dein zweites Paar mit Top-Kicker ist zu stark zum Aufgeben, aber zu schwach für drei Streets Value. Ein Check-Back hält den Pot klein, und am Turn entscheidest du neu – oft mit einem bequemen Call gegen eine Turn-Bet.',
        },
        {
          heading: 'Out of Position: Fuß vom Gas',
          body:
            'Alle bisherigen Rezepte werden vorsichtiger, sobald du **Out of Position (OOP)** bist – etwa wenn du aus UTG raist und der Button callt. Ohne Position fehlt dir die Information über die Aktion des Gegners, du kannst die Potgröße schlechter kontrollieren, und der Gegner kann dich mit Position **floaten**: Er callt den Flop leicht, um dir den Pot auf Turn oder River wegzunehmen, sobald du Schwäche zeigst.\n\nDeshalb gilt OOP: **deutlich niedrigere C-Bet-Frequenz, mehr Checks – auch mit ordentlichen Händen**. Besonders auf mittleren, verbundenen Boards, die der Calling Range des Gegners helfen, ist Checken oft die klar beste Option. Ein Check OOP heißt dabei nicht aufgeben: Deine Check-Range enthält Check-Calls mit Showdown-Händen, Check-Raises mit starken Händen und Semi-Bluffs – und bleibt dadurch unangenehm zu attackieren.\n\nAuf Boards mit massivem Range-Vorteil (A♥ 7♦ 2♣ nach deinem UTG-Raise) darfst du weiterhin häufig klein betten. Aber die Faustregel lautet: Je besser das Board für den Caller und je schlechter deine Position, desto öfter checkst du – und desto klarer brauchst du einen Plan für Turn und River, bevor du Chips investierst.',
          tip: 'Wenn du OOP c-betten willst, mache vorher den Turn-Test: Weißt du schon, auf welchen Turn-Karten du weiterbettest und auf welchen du aufgibst? Wenn nicht, checke lieber gleich.',
        },
      ],
      takeaways: [
        'Die C-Bet lebt von Initiative und Fold Equity: Der Gegner verfehlt den Flop in rund zwei Dritteln der Fälle.',
        'Trockene Boards mit Range-Vorteil: klein (25–33 %) und mit fast der gesamten Range betten.',
        'Nasse Boards: seltener, dafür groß (66–75 %) und polarisiert – starke Hände plus Semi-Bluffs, die Mitte checkt.',
        'Mittlere Showdown-Hände sind Check-Back-Kandidaten: Sie gewinnen mit Pot-Kontrolle mehr als mit einer Bet.',
        'Out of Position c-bettest du deutlich seltener – ohne Plan für den Turn ist der Check fast immer besser.',
      ],
      quiz: [
        {
          question: 'Du bettest als reiner Bluff 33 % des Pots. Wie oft muss der Gegner mindestens folden, damit die Bet für sich genommen profitabel ist?',
          options: ['25 %', '33 %', '50 %', '66 %'],
          correctIndex: 0,
          explanation:
            'Break-even = Einsatz geteilt durch (Einsatz + Pot): 0,33 / 1,33 ≈ 25 %. Genau diese günstige Rechnung macht kleine C-Bets auf trockenen Boards so stark.',
        },
        {
          question: 'Auf welchem Board ist eine große, polarisierte C-Bet (66–75 %) als Preflop-Raiser am sinnvollsten?',
          options: ['A♥ 7♦ 2♣', 'K♦ 8♠ 3♥', 'J♥ T♥ 8♣', 'K♣ K♠ 4♦'],
          correctIndex: 2,
          explanation:
            'J♥ T♥ 8♣ ist nass und dynamisch: Starke Hände müssen den Pot sofort aufbauen und Draws zur Kasse bitten. Auf den trockenen Boards A72, K83 und KK4 ist die kleine Range-Bet der Standard.',
        },
        {
          question: 'Welche Hand ist in Position der typischste Check-Back-Kandidat?',
          options: [
            'Top Pair mit Top Kicker',
            'Zweites Paar oder Ass-hoch mit Showdown Value',
            'Ein starker Flushdraw',
            'Ein Set auf nassem Board',
          ],
          correctIndex: 1,
          explanation:
            'Mittlere Showdown-Hände profitieren kaum von einer Bet: Schlechteres foldet, Besseres callt. Top Pair und Sets betten für Value, starke Flushdraws sind ideale Semi-Bluffs.',
        },
        {
          question: 'Warum solltest du Out of Position seltener c-betten als in Position?',
          options: [
            'OOP kannst du Turn und River schlechter kontrollieren, und der Gegner kann dich mit Position floaten',
            'OOP liegt der Range-Vorteil automatisch beim Gegner',
            'OOP sollte man grundsätzlich nur mit Monstern betten',
            'OOP sind Check-Raises nicht möglich',
          ],
          correctIndex: 0,
          explanation:
            'Ohne Position agierst du auf jeder Street zuerst und ohne Information. Gegner in Position können leicht callen und dir später den Pot streitig machen. Der Range-Vorteil selbst hängt vom Board ab, nicht von der Position.',
        },
        {
          question: 'Du raist am Button, der Big Blind callt. Flop K♦ 7♠ 2♥. Was ist der moderne Standard-Ansatz?',
          options: [
            'Nur mit einem König oder besser betten',
            'Mit fast der gesamten Range klein (25–33 %) c-betten',
            'Groß (75 %) mit einer polarisierten Range betten',
            'Meist checken, weil das Board niemandem hilft',
          ],
          correctIndex: 1,
          explanation:
            'Auf diesem hohen, trockenen Board hat der Raiser einen klaren Range-Vorteil und der Big Blind meist nichts. Die kleine Range-Bet gewinnt billig viele Pötte, holt Value und verrät nichts über deine Hand.',
        },
      ],
    },
    {
      id: 'm4-l3',
      title: 'Value Betting',
      duration: 9,
      intro:
        'Bluffs sind spektakulär, aber das große Geld im Poker kommt aus Value Bets – vor allem aus denen, die schwächere Spieler auslassen. Diese Lektion zeigt dir, wie du Value systematisch maximierst.',
      sections: [
        {
          heading: 'Die Definition, die Geld wert ist',
          body:
            'Eine **Value Bet** ist eine Bet, die von schlechteren Händen gecallt werden soll. Das klingt banal, wird aber ständig falsch verstanden. Der entscheidende Maßstab ist nicht "Ich liege wahrscheinlich vorne", sondern: **Wenn mein Gegner callt, gewinne ich dann in mehr als der Hälfte der Fälle?**\n\nDer Unterschied ist gewaltig. Du kannst mit 80 % Wahrscheinlichkeit die beste Hand halten – wenn aber nur die 20 % besseren Hände deine Bet callen und alles Schlechtere foldet, verliert deine "Value Bet" Geld. Umgekehrt kann eine Bet mit einer mittelstarken Hand hochprofitabel sein, wenn die Calling Range des Gegners voller schlechterer Hände steckt.\n\nDeshalb denkst du beim Value Betting immer von der Calling Range des Gegners aus: Welche konkreten Hände callen mich – und wie viele davon schlage ich? Diese Frage entscheidet nicht nur, ob du bettest, sondern auch, wie viel. Sie ist der rote Faden dieser gesamten Lektion.\n\nEin wichtiger Nebeneffekt: Wer diese Frage konsequent stellt, hört automatisch auf, mit mittleren Händen "zur Sicherheit" zu betten – eine der teuersten Gewohnheiten überhaupt, weil solche Bets nur die falsche Hälfte der gegnerischen Range im Pot hält.',
        },
        {
          heading: 'Dünne Value Bets: der Winrate-Treiber',
          body:
            'Eine **dünne (thin) Value Bet** ist eine Bet, die nur knapp öfter von Schlechterem als von Besserem gecallt wird – etwa mit Top Pair und mittlerem Kicker am River. Genau hier trennt sich die Spreu vom Weizen: Durchschnittliche Spieler checken diese Hände ängstlich durch, gute Spieler holen sich konsequent die letzte Bet.\n\nDie Wirkung auf die Winrate ist größer, als es scheint. Situationen für dünne Value Bets kommen ständig vor – viel öfter als die seltenen Monsterhände. Wer in hunderten solcher Spots pro Monat jeweils eine halbe Bet mehr gewinnt, verschiebt seine gesamte Winrate messbar nach oben.\n\nBesonders lohnend sind dünne Value Bets gegen **Calling Stations** – Gegner, die zu viele schwache Hände callen. Gegen sie weitet sich deine Value-Range dramatisch aus: Zweites Paar mit gutem Kicker kann am River eine klare Bet sein, wenn der Gegner mit jedem Paar und jedem Ass-hoch bezahlt.\n\nDie Gegenrichtung gilt genauso: Gegen sehr tighte Gegner, die nur mit starken Händen callen, schrumpft deine Value-Range – dieselbe Hand, die gegen die Station ein Pflicht-Bet ist, wird gegen den Nit zum Check.',
          example:
            'River-Board K♠ 9♦ 5♣ 2♦ 2♠, du hältst K♦ T♦ gegen eine Calling Station. Sie callt mit jedem König, vielen Neunen und manchen Pocket Pairs. Deine kleine bis mittlere Bet gewinnt gegen den Großteil dieser Range – checken würde bares Geld verschenken.',
        },
        {
          heading: 'Sizing-Logik: die Bet auf die Zielgruppe zuschneiden',
          body:
            'Die richtige Bet-Größe folgt aus zwei Fragen: Welche schlechteren Hände sollen callen – und wie preissensibel sind sie?\n\nManche Calling Ranges sind **elastisch**: Der Gegner callt eine kleine Bet mit vielen Händen, eine große nur mit wenigen. Hier gilt: Mit sehr starken Händen wählst du das größte Sizing, das die Zielhände gerade noch mitgehen. Mit dünnen Value-Händen bettest du kleiner, damit genug Schlechteres im Pot bleibt – eine kleine Bet, die von zweiten Paaren gecallt wird, schlägt eine große, die nur noch bessere Könige bezahlt.\n\nAndere Calling Ranges sind **inelastisch**: Calling Stations und Spieler, die an ihrem Draw oder Top Pair kleben, callen fast unabhängig von der Größe. Gegen sie bettest du mit starken Händen schlicht groß – jedes Prozent Pot, das du kleiner bettest, ist verschenkter Value.\n\nZwei häufige Fehler vermeidest du damit automatisch: Erstens das Standard-Sizing für alles ("immer 50 %"), das weder Value maximiert noch Bluffs günstig hält. Zweitens das umgekehrte Muster vieler Amateure – groß mit Monstern, winzig mit dünnem Value –, das aufmerksame Gegner sofort ausbeuten.',
          tip: 'Frage dich vor der Bet: "Welche konkrete Hand soll mich hier callen – und was ist der höchste Preis, den sie bezahlt?" Das Sizing ergibt sich dann fast von selbst.',
        },
        {
          heading: 'Drei Streets Value planen',
          body:
            'Mit einer sehr starken Hand – Set, Two Pair, starkes Overpair auf gutem Board – beginnt die Planung am Flop mit einer einfachen Frage: **Wie bekomme ich bis zum River einen großen Pot?**\n\nDie Antwort liegt in der Pot-Geometrie. Der Pot wächst multiplikativ: Jede Bet vergrößert die Basis für die nächste. Ein Beispiel mit 100bb-Stacks: Nach Raise und Call liegt am Flop ein Pot von rund 5,5bb. Drei Bets von je etwa 70 % des Pots, jeweils gecallt, ergeben am Ende einen Pot von rund 75bb – aus einem Mini-Pot wird ein großer Teil der Stacks.\n\nLässt du dagegen den Flop aus, stehst du am Turn vor demselben 5,5bb-Pot, und selbst zwei große Bets bringen den Pot nur noch auf gut 30bb. Die ausgelassene Street lässt sich ohne unglaubwürdige Overbets nicht mehr aufholen. Deshalb gilt: **Wer am River einen großen Pot will, muss am Flop anfangen zu betten.**\n\nSlowplay hat seinen Platz – auf extrem trockenen Boards gegen hyperaggressive Gegner, die für dich betten. Aber als Standard verliert es doppelt: Der Pot bleibt klein, und freie Karten geben dem Gegner gratis Chancen, dich zu überholen oder den Glauben an seine Hand zu verlieren.',
          cards: ['8h', '8d'],
          example:
            'Du hältst 8♥ 8♦ und floppst auf K♠ 8♣ 3♦ ein Set. Der Plan steht sofort: Bet Flop, Bet Turn, Bet River – gegen Kx-Hände willst du drei wachsende Streets Value. Checkst du den Flop "zum Verstecken", bekommst du die Stacks fast nie mehr rein.',
        },
        {
          heading: 'Value-Ziele definieren',
          body:
            'Der letzte Baustein ist eine simple Disziplin: **Benenne vor jeder Value Bet konkret die schlechteren Hände, die dich callen.** Nicht "er könnte was Schlechteres haben", sondern: "Er callt mit KQ, KJ, QJ und Flushdraws."\n\nDieser Test schützt dich in beide Richtungen. Findest du eine klare Liste, kannst du selbstbewusst betten und das Sizing auf genau diese Hände zuschneiden. Findest du keine einzige schlechtere Hand, die callt, ist deine Bet keine Value Bet – dann ist Checken richtig, oder die Bet müsste als Bluff funktionieren und bessere Hände zum Folden bringen. Eine Bet, die nur von Besserem gecallt und nur von Schlechterem gefoldet wird, ist der teuerste Zug im Poker.\n\nDie Value-Ziele verschieben sich dabei von Street zu Street. Am Flop callen dich noch Draws und schwache Paare; am River sind die Draws angekommen oder geplatzt, und die Calling Range besteht nur noch aus Made Hands. Deshalb wird derselbe Handwert über die Streets hinweg oft dünner – Top Pair, das am Flop dick Value war, kann am River nach vier Overcards nur noch ein Check sein.\n\nDiese eine Frage – "Wer callt mich mit Schlechterem?" – ist der zuverlässigste Kompass im gesamten Postflop-Spiel.',
        },
      ],
      takeaways: [
        'Value Bet heißt: Im Fall eines Calls gewinnst du öfter, als du verlierst – die Calling Range entscheidet, nicht dein Bauchgefühl.',
        'Dünne Value Bets sind der größte Winrate-Hebel: häufige Spots, in denen schwache Spieler systematisch Geld liegen lassen.',
        'Sizing folgt der Zielgruppe: groß gegen inelastische Caller, kleiner für dünnen Value, nie ein Einheits-Sizing für alles.',
        'Große Pötte entstehen nur durch frühe Bets: Mit starken Händen am Flop anfangen und drei Streets planen.',
        'Vor jeder Bet konkrete schlechtere Call-Hände benennen – gibt es keine, ist es keine Value Bet.',
      ],
      quiz: [
        {
          question: 'Wann ist eine Bet eine echte Value Bet?',
          options: [
            'Wenn du wahrscheinlich die beste Hand hältst',
            'Wenn dich schlechtere Hände oft genug callen – du also im Fall eines Calls meistens vorne liegst',
            'Wenn der Gegner häufig foldet',
            'Wenn du mindestens Top Pair hast',
          ],
          correctIndex: 1,
          explanation:
            'Entscheidend ist die Calling Range: Selbst mit der wahrscheinlich besten Hand verliert eine Bet Geld, wenn nur bessere Hände callen. Folds erzeugen Bluffs, nicht Value Bets.',
        },
        {
          question: 'River-Board K♠ 9♦ 5♣ 2♦ 2♠, du hältst K♦ T♦ gegen eine Calling Station, die mit jedem König und vielen Neunen callt. Beste Line?',
          options: [
            'Checken – du schlägst nur Bluffs',
            'Eine kleine bis mittlere Value Bet, weil schlechtere Kx- und 9x-Hände häufig callen',
            'Overbet All-in, um maximalen Druck zu machen',
            'Auf eine Check-Raise-Gelegenheit hoffen',
          ],
          correctIndex: 1,
          explanation:
            'Gegen eine Station ist Top Pair mit gutem Kicker eine klare dünne Value Bet: Ihre Calling Range steckt voller schlechterer Könige und Neunen. Ein Check verschenkt genau diese Calls.',
        },
        {
          question: 'Du floppst mit 100bb-Stacks ein Set auf trockenem Board. Warum solltest du meist sofort mit dem Value Betting beginnen?',
          options: [
            'Weil dich sonst zu viele Draws überholen',
            'Weil drei wachsende Bets nötig sind, um bis zum River einen großen Pot aufzubauen – wer eine Street auslässt, bekommt die Stacks kaum noch rein',
            'Weil Slowplay gegen die Etikette verstößt',
            'Weil der Gegner sonst am Turn immer foldet',
          ],
          correctIndex: 1,
          explanation:
            'Der Pot wächst multiplikativ: Jede Bet vergrößert die Basis der nächsten. Auf trockenen Boards ist Protection zweitrangig – das Argument für die Flop-Bet ist die Pot-Geometrie.',
        },
        {
          question: 'Dein Gegner callt River-Bets fast unabhängig von der Größe (inelastische Calling Range). Wie passt du dein Sizing mit einer sehr starken Hand an?',
          options: [
            'Kleiner betten, um sicher gecallt zu werden',
            'Größer betten – jedes Prozent weniger ist verschenkter Value',
            'Das Sizing spielt keine Rolle',
            'Checken und auf eine Bet des Gegners hoffen',
          ],
          correctIndex: 1,
          explanation:
            'Wenn die Call-Wahrscheinlichkeit kaum vom Preis abhängt, maximiert die größte glaubwürdige Bet den Erwartungswert. Klein zu betten wäre hier ein reines Geschenk.',
        },
        {
          question: 'Du willst am River betten, findest aber keine einzige schlechtere Hand, die callen würde. Was folgt daraus?',
          options: [
            'Trotzdem betten – zur Protection',
            'Die Bet wäre keine Value Bet: Checke, oder erwäge sie nur, wenn sie als Bluff bessere Hände zum Folden bringt',
            'Größer betten, damit der Gegner einen Fehler macht',
            'Immer Check-Call spielen',
          ],
          correctIndex: 1,
          explanation:
            'Am River gibt es keine Protection mehr – jede Bet ist entweder Value oder Bluff. Callt nichts Schlechteres, kann die Bet nur noch als Bluff Sinn ergeben; sonst ist der Check richtig.',
        },
      ],
    },
    {
      id: 'm4-l4',
      title: 'Bluffen mit System',
      duration: 9,
      intro:
        'Gute Bluffs sind keine Mutproben, sondern kalkulierte Investitionen: Sie nutzen Hände mit den richtigen Eigenschaften, erzählen eine glaubwürdige Geschichte und wissen, wann Schluss ist.',
      sections: [
        {
          heading: 'Was einen guten Bluff-Kandidaten ausmacht',
          body:
            'Nicht jede schwache Hand ist ein guter Bluff. Die besten Kandidaten erfüllen drei Kriterien:\n\n- **Equity und Backdoor-Potenzial**: Die Hand kann sich verbessern – durch einen Draw oder wenigstens Backdoor-Draws (Draws, die zwei passende Karten brauchen). Wirst du gecallt, ist die Hand nicht tot, und gute Turn-Karten erlauben glaubwürdige weitere Bets.\n- **Blocker**: Deine Karten reduzieren die Anzahl starker Combos beim Gegner. Hältst du ein Ass, kann er seltener AA oder Top Pair mit Ass halten – deine Fold Equity steigt.\n- **Wenig Showdown Value**: Die Hand gewinnt am Showdown fast nie von selbst. Ein mittleres Paar dagegen gewinnt ungebettet oft genug – es verliert durch einen Bluff mehr, als es gewinnt.\n\nDer dritte Punkt ist die wichtigste Sortierregel deiner Range: Hände mit Showdown Value checken und callen, Hände ohne Showdown Value – aber mit Potenzial – übernehmen die Bluff-Arbeit. So bleibt deine Bet-Range gefährlich und deine Check-Range stabil.\n\nKomplett hoffnungslose Hände ohne jedes Potenzial bluffst du dagegen sparsam: Ihnen fehlt der Plan B, wenn der Gegner nicht sofort foldet.',
          example:
            'Flop K♠ 8♥ 3♦ nach deinem Preflop-Raise. Q♠ J♠ ist ein idealer Bluff-Kandidat: kein Showdown Value, aber zwei Overcards gegen mittlere Paare, Backdoor-Flushdraw und Backdoor-Straight-Draws. 7♥ 7♣ dagegen checkt lieber – das Paar gewinnt ungebettet oft genug den Showdown.',
        },
        {
          heading: 'Semi-Bluffs: Bluffen mit Fallschirm',
          body:
            'Der **Semi-Bluff** – eine Bet oder Raise mit einem Draw – ist das Rückgrat jeder soliden Bluff-Strategie, weil er auf zwei Wegen gewinnt: Der Gegner foldet sofort, oder du triffst deinen Draw und gewinnst einen aufgeblasenen Pot.\n\nDiese doppelte Gewinnchance verändert die Mathematik fundamental. Ein reiner Bluff muss oft genug Folds erzeugen, um sich allein daraus zu bezahlen. Ein Semi-Bluff braucht viel weniger Fold Equity, weil deine Equity im Call-Fall einen großen Teil der Rechnung übernimmt.\n\nEin Beispiel: Du hältst 9♥ 8♥ auf T♥ 6♥ 2♣ – Flushdraw plus Gutshot, zusammen 12 Outs und damit rund 45 % Equity bis zum River. Bettest oder raist du und wirst gecallt, bist du fast ein Münzwurf gegen Top Pair. Foldet der Gegner auch nur gelegentlich, ist die aggressive Linie klar profitabel – und wenn dein Draw ankommt, ist der Pot bereits schön groß.\n\nDeshalb gilt: Deine großen, aggressiven Bluff-Linien baust du bevorzugt um Flushdraws, offene Straight-Draws und Combo-Draws herum. Reine Luft-Bluffs bleiben die Ausnahme für besondere Spots – etwa mit starken Blockern am River.',
          cards: ['9h', '8h'],
          tip: 'Wenn du unsicher bist, ob eine Hand aggressiv genug gespielt werden darf: Zähle die Outs. Ab etwa 8 Outs plus Fold Equity ist Aggression fast nie ein großer Fehler.',
        },
        {
          heading: 'Blocker gezielt nutzen',
          body:
            'Ein **Blocker** ist eine Karte in deiner Hand, die bestimmte Combos des Gegners unmöglich macht. Für Bluffs sind Blocker Gold wert, weil sie genau die Hände ausdünnen, vor denen dein Bluff Angst haben müsste.\n\nDas Paradebeispiel: Auf einem River-Board mit drei Herzen hältst du das A♥ – aber keinen Flush. Der Gegner kann jetzt den Nut Flush nicht halten, und viele seiner mittleren Herz-Hände hätten früher anders gespielt. Gleichzeitig ist es für ihn extrem schwer, ohne eigenen Flush eine große Bet zu callen. Genau solche Spots tragen Bluffs mit hohem Erwartungswert.\n\nWeitere klassische Blocker-Effekte: Ein Ass in der Hand blockt AA und Top-Pair-Combos auf Ass-hohen Boards. Hältst du auf K♠ Q♦ 7♣ 4♥ 2♦ selbst einen König, hat der Gegner seltener Top Pair – deine River-Bluffs gewinnen öfter.\n\nDie Kehrseite heißt **Unblocking**: Ideale Bluff-Karten blockieren die Fold-Hände des Gegners nicht. Bluffst du mit Karten, die genau seine schwachen, ohnehin foldenden Hände blockieren, entfernst du die falschen Combos aus seiner Range. Faustregel für den River: Blockiere seine starken Call-Hände, nicht seine Folds.',
        },
        {
          heading: 'Storytelling: Erzähl eine glaubwürdige Geschichte',
          body:
            'Jede Bet behauptet etwas. Ein Bluff funktioniert nur, wenn deine gesamte Linie – von preflop bis zum River – die Geschichte einer starken Hand erzählt, **die du genau so auch wirklich spielen würdest**.\n\nDie zentrale Prüffrage lautet: Welche Value-Hände spielen exakt diese Linie? Wenn du am River plötzlich groß raist, nachdem du zwei Streets nur passiv gecallt hast, muss der Gegner sich fragen, welche starke Hand so spielen würde. Gibt es kaum welche, kollabiert die Geschichte – und gute Gegner callen dich mit erstaunlich schwachen Händen.\n\nGlaubwürdig sind Bluffs vor allem dort, wo das Board deine Range trifft: Du hast preflop geraist und der Turn bringt ein Ass? Deine Barrel repräsentiert genau die Ax-Hände, die du reichlich hältst. Der River vervollständigt einen Flushdraw, den du als Aggressor glaubwürdig halten kannst? Auch das trägt eine große Bet.\n\nUmgekehrt gilt: Bluffe nicht gegen die eigene Geschichte. Eine große Bet auf einer Karte, die offensichtlich deiner Range nicht hilft, aber der des Gegners – etwa ein mittlerer Verbindungs-Turn nach deinem Raise auf hohem Board –, ist Geld, das in eine unglaubwürdige Erzählung fließt.',
          tip: 'Bevor du bluffst, wechsle kurz die Perspektive: "Wenn ich seine Hand hätte – würde diese Linie mich wirklich zum Folden bringen?" Wenn du selbst callen würdest, ist der Bluff meist keiner.',
        },
        {
          heading: 'Give-up-Disziplin und das richtige Verhältnis',
          body:
            'Zum systematischen Bluffen gehört das systematische Aufgeben. Ein Flop-Bluff mit Backdoor-Draws ist eine Investition unter Vorbehalt: Verbessert der Turn deine Equity oder bringt er eine glaubwürdige Scare Card, geht die Geschichte weiter. Bringt er einen Brick – eine Karte, die nichts verändert –, ist Aufgeben meistens richtig. Wer jeden angefangenen Bluff bis zum River durchzieht, verwandelt kleine, kalkulierte Verluste in große.\n\nAuch die Gesamtmenge braucht Struktur. Am River, wo keine Equity mehr nachkommt, gibt die Spieltheorie eine klare Richtschnur: Bei einer Pot-großen Bet bekommt dein Gegner 2:1 auf den Call und braucht 33 % Equity. Damit er nicht automatisch profitabel callen oder folden kann, sollte deine Bet-Range grob im Verhältnis **2:1 aus Value zu Bluffs** bestehen – etwa ein Drittel Bluffs. Je kleiner deine Bet, desto weniger Bluffs verträgt sie.\n\nDiese Zahlen sind Orientierung, kein Dogma: Gegen Spieler, die zu viel folden, bluffst du mehr; gegen Stationen fast gar nicht. Aber sie schützen dich vor den zwei klassischen Extremen – dem chronischen Überbluffen und dem völligen Verzicht, der deine Value Bets vorhersehbar macht.\n\nUnd nicht zuletzt: Ein aufgegebener Bluff ist kein verlorenes Duell, sondern eine korrekt begrenzte Investition. Wer das akzeptiert, blufft entspannter – und tiltet seltener.',
          table: {
            headers: ['River-Sizing', 'Anteil Bluffs (grob)', 'Value:Bluff'],
            rows: [
              ['1/2 Pot', '25 %', '3:1'],
              ['2/3 Pot', 'ca. 29 %', '2,5:1'],
              ['Pot', 'ca. 33 %', '2:1'],
            ],
          },
        },
      ],
      takeaways: [
        'Gute Bluff-Kandidaten haben Equity oder Backdoors, nützliche Blocker und wenig Showdown Value.',
        'Semi-Bluffs mit Draws sind das Rückgrat: zwei Gewinnwege statt einem, deshalb brauchen sie viel weniger Fold Equity.',
        'Blocker erhöhen die Fold Equity, indem sie die starken Call-Hände des Gegners ausdünnen – blockiere seine Calls, nicht seine Folds.',
        'Ein Bluff braucht eine konsistente Geschichte: Es muss Value-Hände geben, die exakt dieselbe Linie spielen.',
        'Give-up-Disziplin und grobe Verhältnisse (Pot-Bet am River: ca. 2:1 Value zu Bluffs) halten deine Bluffs profitabel.',
      ],
      quiz: [
        {
          question: 'Welche Hand ist auf K♠ 8♥ 3♦ nach deinem Preflop-Raise der beste Bluff-Kandidat?',
          options: [
            'Q♠ J♠',
            '7♥ 7♣',
            'A♦ 8♦',
            'K♥ Q♥',
          ],
          correctIndex: 0,
          explanation:
            'Q♠ J♠ hat keinen Showdown Value, aber Overcards zu den mittleren Paaren des Gegners plus Backdoor-Flush- und Straight-Draws. 77 und A8 haben Showdown Value und checken lieber; KQ ist eine Value-Hand.',
        },
        {
          question: 'Warum sind Semi-Bluffs das Rückgrat einer guten Bluff-Strategie?',
          options: [
            'Weil sie immer mehr Fold Equity haben als reine Bluffs',
            'Weil sie auf zwei Wegen gewinnen: durch sofortige Folds oder durch das Treffen des Draws',
            'Weil Draws am Showdown häufig auch ungetroffen gewinnen',
            'Weil man mit Draws größere Sizings verwenden darf',
          ],
          correctIndex: 1,
          explanation:
            'Die Equity des Draws übernimmt einen Teil der Rechnung: Selbst wenn der Fold ausbleibt, gewinnst du oft noch. Deshalb brauchen Semi-Bluffs deutlich weniger Fold Equity als reine Bluffs.',
        },
        {
          question: 'River-Board mit drei Herzen, du hältst das A♥ ohne Flush. Warum ist das ein starker Bluff-Spot?',
          options: [
            'Weil du bei einem Call immer noch den Flush treffen kannst',
            'Weil du den Nut Flush blockst: Der Gegner kann ihn nicht halten und kann ohne eigenen Flush große Bets kaum callen',
            'Weil das Ass am Showdown oft von selbst gewinnt',
            'Weil Herz-Boards statistisch mehr Folds erzeugen',
          ],
          correctIndex: 1,
          explanation:
            'Das A♥ als Blocker entfernt die stärkste Call-Hand komplett aus der Range des Gegners. Am River kommt keine Karte mehr – der Wert liegt allein im Blocker-Effekt, nicht in Equity.',
        },
        {
          question: 'Du bettest am River Pot-Größe. Welches Value:Bluff-Verhältnis ist grob balanciert?',
          options: ['1:1', '2:1', '3:1', '4:1'],
          correctIndex: 1,
          explanation:
            'Der Gegner bekommt bei einer Pot-Bet 2:1 und braucht 33 % Equity für den Call. Besteht deine Bet-Range zu etwa einem Drittel aus Bluffs (2:1 Value zu Bluffs), kann er weder mit Callen noch mit Folden automatisch profitieren.',
        },
        {
          question: 'Du c-bettest Q♠ J♠ auf K♠ 8♥ 3♦ und wirst gecallt. Der Turn ist die 4♣ – ein Brick, der auch deinen Backdoor-Flushdraw beerdigt. Was ist meistens richtig?',
          options: [
            'Weiterbetten, weil Aufgeben Schwäche zeigt',
            'Meist aufgeben – der Turn hat weder Equity noch Glaubwürdigkeit hinzugefügt',
            'All-in als maximaler Druck',
            'Egal was kommt: erst am River wieder betten',
          ],
          correctIndex: 1,
          explanation:
            'Der Flop-Bluff war eine Investition unter Vorbehalt. Ohne neue Equity und ohne Scare Card fehlt der zweiten Patrone die Grundlage – Give-up-Disziplin begrenzt den Verlust auf die kleine Flop-Bet.',
        },
      ],
    },
    {
      id: 'm4-l5',
      title: 'Draws richtig spielen',
      duration: 10,
      intro:
        'Draws sind Hände im Wartestand – und genau deshalb so oft falsch gespielt. Diese Lektion gibt dir die Zahlen und die Entscheidungslogik, um jeden Draw entweder profitabel zu callen, aggressiv zu verwandeln oder diszipliniert wegzulegen.',
      sections: [
        {
          heading: 'Outs zählen, Odds kennen',
          body:
            '**Outs** sind die Karten, die deine Hand zur (mutmaßlich) besten machen. Aus den Outs folgen die Trefferchancen – und die musst du auswendig können, denn sie sind die Grundlage jeder Draw-Entscheidung.\n\nDie wichtigsten Werte: Ein Flushdraw hat 9 Outs, ein offener Straight-Draw (OESD) 8, ein Gutshot 4. Ein Combo-Draw aus Flushdraw und OESD kommt auf 15 Outs und ist damit gegen ein Top Pair sogar leichter Favorit.\n\nFür die schnelle Rechnung am Tisch gibt es die **Regel von 2 und 4**: Outs mal 2 ergibt ungefähr die Trefferchance in Prozent für die nächste Karte. Outs mal 4 ergibt die Chance vom Flop bis zum River – aber Achtung: Diese Zahl gilt nur, wenn du garantiert beide Karten siehst, etwa nach einem All-in am Flop. Wer am Flop mit "Outs mal 4" callt, aber am Turn erneut bezahlen muss, rechnet sich seinen Draw doppelt so gut, wie er ist.\n\nZähle außerdem ehrlich: Outs, die dem Gegner eine noch bessere Hand geben können, sind keine vollen Outs. Ein Straight-Out, das gleichzeitig den Flush vervollständigt, oder ein Draw zum niedrigen Ende der Straight sind weniger wert, als die reine Zahl suggeriert.',
          table: {
            headers: ['Draw', 'Outs', 'Nächste Karte', 'Flop bis River'],
            rows: [
              ['Gutshot', '4', 'ca. 9 %', 'ca. 17 %'],
              ['OESD', '8', 'ca. 17 %', 'ca. 32 %'],
              ['Flushdraw', '9', 'ca. 19 %', 'ca. 35 %'],
              ['Flushdraw + OESD', '15', 'ca. 32 %', 'ca. 54 %'],
            ],
          },
        },
        {
          heading: 'Pot Odds konkret anwenden',
          body:
            '**Pot Odds** vergleichen den Preis eines Calls mit dem, was im Pot zu gewinnen ist. Die Formel: benötigte Equity = Call geteilt durch (Pot nach deinem Call).\n\nEin Beispiel: Im Pot liegen 10 €, der Gegner bettet 5 € (halbe Pot-Größe). Du musst 5 € callen, um einen Gesamtpot von 20 € zu gewinnen: 5 / 20 = **25 % benötigte Equity**.\n\nJetzt der Abgleich mit deinem Draw: Ein Flushdraw trifft mit der nächsten Karte in rund 19 % der Fälle. Das liegt unter den benötigten 25 % – der Call ist mit reinen Pot Odds knapp nicht gerechtfertigt. Ein Combo-Draw mit 32 % dagegen callt locker, und gegen eine kleinere Bet von einem Drittel Pot (benötigte Equity: 20 %) liegt auch der reine Flushdraw mit seinen ca. 19 % nur noch hauchdünn unter der Schwelle – schon minimale Implied Odds machen diesen Call profitabel.\n\nZwei Fehler solltest du dabei vermeiden. Erstens: am Flop mit der Flop-bis-River-Zahl rechnen, obwohl am Turn die nächste Bet droht – kalkuliere pro Street, wenn weitere Einsätze zu erwarten sind. Zweitens: Pot Odds isoliert betrachten. Knapp unprofitable Calls werden oft doch profitabel, sobald zukünftige Gewinne dazukommen – das ist das Thema des nächsten Abschnitts.',
          example:
            'Pot 10 €, Bet 5 €: Du brauchst 25 % Equity. Flushdraw (ca. 19 % pro Street) reicht allein nicht – OESD + Flushdraw (ca. 32 %) callt dagegen klar profitabel.',
        },
        {
          heading: 'Implied Odds: das verdeckte Geld',
          body:
            '**Implied Odds** erweitern die Pot-Odds-Rechnung um das Geld, das du in zukünftigen Streets zusätzlich gewinnst, wenn dein Draw ankommt. Sie erklären, warum viele knapp "unprofitable" Draw-Calls in Wahrheit gut sind – und wann eben nicht.\n\nDeine Implied Odds sind gut, wenn drei Dinge zusammenkommen:\n\n- **Tiefe Stacks**: Hinter der aktuellen Bet muss noch Geld liegen, das du gewinnen kannst. Mit 100bb ist das meist der Fall, nach großen Bets auf mehreren Streets schrumpft der Spielraum.\n- **Ein verdeckter Draw**: Eine Straight mit 8♥ 7♠ auf einem Rainbow-Board sieht niemand kommen – die dritte Herz-Karte beim offensichtlichen Flushdraw dagegen lässt beim Gegner alle Alarmglocken läuten. Verdeckte Draws werden bezahlt, offensichtliche selten.\n- **Ein zahlungsbereiter Gegner** mit einer starken, aber zweitbesten Hand – etwa einem Overpair, das nicht folden kann.\n\nFaustregel für den Gutshot: Mit rund 9 % pro Street solltest du insgesamt etwa das Zehnfache deines Calls gewinnen können, damit sich der Call trägt.\n\nDie dunkle Schwester heißt **Reverse Implied Odds**: Draws, die getroffen trotzdem verlieren können – der niedrige Flushdraw gegen einen höheren, das untere Straight-Ende – gewinnen kleine Pötte und verlieren große. Solche Draws bewertest du deutlich konservativer.',
        },
        {
          heading: 'Aggressiv oder passiv? Die vier Faktoren',
          body:
            'Jeder Draw stellt dieselbe Frage: **callen und günstig ziehen – oder mit Bet/Raise selbst Druck machen?** Vier Faktoren entscheiden:\n\n- **Fold Equity**: Kann der Gegner überhaupt folden? Gegen einen tighten Spieler, dessen Range viele mittelstarke Hände enthält, gewinnt ein Semi-Bluff-Raise doppelt. Gegen eine Station, die nie foldet, verliert der Raise seinen halben Wert – dann ist der Call mit korrekten Odds besser.\n- **Nut-Potenzial**: Draws zu den Nuts (Nut-Flushdraw, oberes Straight-Ende) spielen gern große Pötte und dürfen aggressiv. Schwache Draws wollen kleine Pötte und ziehen den Call vor.\n- **Position**: In Position kannst du nach einem Call den Turn kontrollieren, kostenlose Karten nehmen und deine Equity voll realisieren – der Call wird attraktiver. Out of Position ist Aggression oft der bessere Ausweg aus einer unangenehmen Lage.\n- **Stack-Tiefe**: Tiefe Stacks stärken die Implied Odds und damit den Call. Werden die Stacks im Verhältnis zum Pot klein, steigt der Wert des Semi-Bluff-Raises – notfalls bis zum All-in, weil du Fold Equity plus Equity kombinierst und nicht mehr weggedrängt werden kannst.\n\nDer Idealfall für Aggression: starker Draw mit Nut-Potenzial und echte Fold Equity gegen eine Range voller schwacher Hände – wie 8♠ 7♠ auf 9♠ 6♠ 2♦ mit 15 Outs.',
          cards: ['8s', '7s'],
        },
        {
          heading: 'Draws Out of Position',
          body:
            'Out of Position verlieren Draws an Wert: Du kannst dir keine kostenlosen Karten nehmen, kennst die Absicht des Gegners nicht und realisierst deine Equity schlechter. Deshalb verschiebt sich die Strategie.\n\nDie **Check-Raise als Semi-Bluff** wird OOP zur wichtigsten Waffe. Beispiel: Du verteidigst im Big Blind, floppst auf 9♠ 6♠ 2♦ einen Flushdraw und check-raist die kleine C-Bet des Raisers. Damit übernimmst du die Initiative, erzeugst sofort Fold Equity gegen seine vielen schwachen Range-Bets – und wenn er callt, hast du immer noch deine Outs. Starke Draws mit Nut-Potenzial sind die perfekten Kandidaten, weil sie große Pötte spielen wollen.\n\nDer **Check-Call** bleibt richtig für mittlere Draws mit passenden Pot Odds, besonders gegen kleine Bets. Aber sei ehrlich bei der Nachrechnung: OOP bekommst du nach dem Treffer seltener volle Bezahlung – deine effektiven Implied Odds sind schlechter als in Position. Schwache, nicht-nutzige Draws ohne Fold-Equity-Plan werden OOP schnell zu Geldverbrennern, vor allem in bereits großen Pötten.\n\nUnd das Herausleaden (die **Donk Bet** in den Preflop-Aggressor hinein) bleibt die Ausnahme: Auf den meisten Texturen ist Check-Raise oder Check-Call die stärkere Struktur, weil sie die Bet des Gegners erst abholt, statt sie zu verscheuchen.',
          tip: 'Sortiere deine Draws OOP in zwei Schubladen: Starke Draws mit Nut-Potenzial wollen check-raisen, mittlere Draws mit guten Odds wollen check-callen. Was in keine Schublade passt, foldet gegen Druck.',
        },
      ],
      takeaways: [
        'Kernzahlen auswendig: Flushdraw ca. 19 % pro Street und 35 % bis zum River, OESD ca. 17 %/32 %, Gutshot ca. 9 %/17 %.',
        'Regel von 4 nur bei garantierten zwei Karten (All-in am Flop) – sonst pro Street rechnen.',
        'Pot Odds liefern die Basis, Implied Odds das verdeckte Geld: am besten mit tiefen Stacks, verdecktem Draw und zahlungsbereitem Gegner.',
        'Aggressiv mit Fold Equity und Nut-Potenzial (Semi-Bluff-Raise), passiv mit guten Odds in Position – vier Faktoren: Position, Fold Equity, Nut-Potenzial, Stack-Tiefe.',
        'Out of Position ist die Check-Raise mit starken Draws die wichtigste Waffe; schwache Draws ohne Plan sind dort Geldverbrenner.',
      ],
      quiz: [
        {
          question: 'Du floppst einen Flushdraw (9 Outs). Wie hoch ist deine Chance, den Flush bis zum River zu treffen, wenn du beide Karten siehst?',
          options: ['ca. 19 %', 'ca. 35 %', 'ca. 45 %', 'ca. 54 %'],
          correctIndex: 1,
          explanation:
            '9 Outs mal 4 ergibt nach der Faustregel 36 % – exakt sind es rund 35 %. Die 19 % gelten für eine einzelne Karte, 54 % für den Combo-Draw mit 15 Outs.',
        },
        {
          question: 'Pot 12 €, der Gegner bettet 6 €. Du hältst nur einen Gutshot (4 Outs). Call oder Fold?',
          options: [
            'Call – die Pot Odds reichen locker',
            'Fold-Tendenz: Du brauchst 25 % Equity, hast aber nur rund 9 % für die nächste Karte – nur mit sehr guten Implied Odds vertretbar',
            'Call – nach der Regel von 4 hast du 16 % und das genügt',
            'Raise ist die einzige sinnvolle Option',
          ],
          correctIndex: 1,
          explanation:
            'Call 6 € für einen 24-€-Pot = 25 % benötigte Equity, der Gutshot liefert pro Street nur ca. 9 %. Die Regel von 4 gilt hier nicht, weil am Turn weitere Bets drohen. Ohne starke Implied Odds ist Fold richtig.',
        },
        {
          question: 'Welche Kombination spricht am stärksten für einen Semi-Bluff-Raise statt einen Call?',
          options: [
            'Hohe Fold Equity und ein Draw zu den Nuts',
            'Keine Fold Equity, aber gute Position',
            'Ein Gegner, der nie foldet, und ein schwacher Draw',
            'Ein bereits riesiger Pot und ein Gutshot',
          ],
          correctIndex: 0,
          explanation:
            'Der Semi-Bluff lebt von zwei Gewinnwegen: Folds und getroffene Draws. Beide sind maximal, wenn der Gegner folden kann und dein Draw im Call-Fall die stärkste Hand macht.',
        },
        {
          question: 'Wann sind deine Implied Odds am besten?',
          options: [
            'Tiefe Stacks, ein verdeckter Draw mit Nut-Potenzial und ein zahlungsbereiter Gegner',
            'Kurze Stacks und ein offensichtlicher Flushdraw',
            'Ein tighter Gegner, der nach der dritten Flush-Karte sofort aufgibt',
            'Implied Odds sind in jeder Situation ungefähr gleich',
          ],
          correctIndex: 0,
          explanation:
            'Implied Odds sind zukünftiges Geld: Es muss noch Stack dahinter liegen, der Gegner darf den Draw nicht kommen sehen und muss mit einer zweitbesten Hand bezahlen wollen.',
        },
        {
          question: 'Wann darfst du die Regel von 4 (Outs mal 4 am Flop) verwenden?',
          options: [
            'Immer, sobald du am Flop einen Draw hältst',
            'Nur wenn du garantiert beide Karten siehst, zum Beispiel bei einem All-in am Flop',
            'Nur bei Flushdraws mit 9 oder mehr Outs',
            'Nur wenn du in Position bist',
          ],
          correctIndex: 1,
          explanation:
            'Outs mal 4 beschreibt die Chance über zwei Karten. Musst du am Turn erneut bezahlen, kaufst du dir mit dem Flop-Call nur eine Karte – dann gilt Outs mal 2.',
        },
        {
          question: 'Big Blind gegen Button-Raiser: Du floppst auf 9♠ 6♠ 2♦ einen Combo-Draw (Flushdraw + OESD, 15 Outs) und er c-bettet klein. Was spricht für die Check-Raise statt Check-Call?',
          options: [
            'Mit rund 54 % Equity bis zum River plus Fold Equity gewinnst du auf zwei Wegen und vermeidest schwierige Turn-Spots Out of Position',
            'Out of Position ist die Check-Raise grundsätzlich Pflicht',
            'Die Check-Raise hält den Pot klein',
            'So kommst du am billigsten zum River',
          ],
          correctIndex: 0,
          explanation:
            'Der Combo-Draw ist gegen Top Pair sogar Favorit. Die Check-Raise attackiert die vielen schwachen Range-Bets des Raisers und macht dich unabhängig davon, wie unangenehm die Turn-Karte wird.',
        },
      ],
    },
    {
      id: 'm4-l6',
      title: 'Turn & River meistern',
      duration: 10,
      intro:
        'Auf Turn und River werden die Pötte groß und die Fehler teuer. Wer hier plant statt reagiert – beim Barreling wie beim Bluff-Catching – gewinnt genau die Big Blinds, die am Monatsende die Winrate ausmachen.',
      sections: [
        {
          heading: 'Double Barrel: die richtige zweite Patrone',
          body:
            'Eine **Double Barrel** ist die zweite Bet am Turn nach deiner C-Bet, eine **Triple Barrel** die dritte am River. Ob sie sinnvoll sind, entscheidet vor allem die Turn-Karte – gute Barrel-Karten haben mindestens eine dieser Eigenschaften:\n\n- **Sie treffen deine Range**: Overcards wie Ass oder König auf mittleren Boards sind klassische **Scare Cards** – Karten, die die Range des Preflop-Raisers deutlich stärker machen und die mittleren Paare des Gegners in Bedrängnis bringen.\n- **Sie verbessern deine Equity**: Ein Turn, der dir zusätzlich Flushdraw oder Gutshot schenkt, gibt deinem Bluff einen zweiten Gewinnweg – barreln wird fast automatisch richtig.\n- **Sie helfen der Range des Gegners nicht**: Bricks wie eine Offsuit-2 verändern nichts – hier barrelst du selektiv weiter, vor allem mit Equity oder guten Blockern.\n\nBeispiel: Du raist am Button, c-bettest auf 9♠ 6♥ 2♦ und der Big Blind callt. Der Turn A♦ ist die perfekte Barrel-Karte: Er trifft deine Range voller Ax-Hände, während die 9x- und Pocket-Pair-Hände des Gegners plötzlich gegen eine glaubwürdige stärkere Range spielen.\n\nFür die Triple Barrel gilt: Sie gehört geplant, nicht improvisiert. Schon am Turn solltest du wissen, auf welchen Rivers du die Geschichte zu Ende erzählst – idealerweise mit Blockern auf die Call-Hände des Gegners.',
          cards: ['9s', '6h', '2d', 'Ad'],
        },
        {
          heading: 'Die Delayed C-Bet',
          body:
            'Die **Delayed C-Bet** ist die verzögerte Fortsetzung: Du checkst als Preflop-Raiser den Flop (meist in Position), und wenn der Gegner am Turn erneut checkt, bettest du.\n\nWarum ist das stark? Der doppelte Check des Gegners erzählt viel: Hände mit echter Substanz hätten am Turn oft selbst gebettet, nachdem du am Flop Schwäche gezeigt hast. Seine Range ist nach Check-Check überdurchschnittlich schwach und gecappt – deine Turn-Bet gewinnt deshalb erstaunlich oft sofort, und das zu einem einzigen, kleinen Einsatz statt zwei Streets Barreling.\n\nDie idealen Kandidaten kennst du aus Lektion 2: Hände, die am Flop gecheckt haben, aber Potenzial mitbringen – zwei Overcards, die einen Gutshot aufgesammelt haben, Backdoor-Draws, die angekommen sind, oder mittlere Hände, die am Turn dünn Value betten, nachdem der Gegner zweimal Schwäche gezeigt hat.\n\nDie Delayed C-Bet hat noch einen strukturellen Vorteil: Sie schützt deine Flop-Check-Range. Wer nach einem Check-Back am Turn nie bettet, gibt jedem aufmerksamen Gegner die Lizenz, nach deinem Flop-Check automatisch zuzugreifen. Ein gesunder Anteil Delayed C-Bets macht deine Checks unangreifbar – und verwandelt vermeintliche Passivität in eine Falle.',
          tip: 'Gegen Spieler, die nach deinem Check-Back am Turn fast immer aufgeben, ist die Delayed C-Bet fast schon ein Automatismus – notiere dir solche Tendenzen konsequent.',
        },
        {
          heading: 'River: Value Bet oder Bluff-Catcher?',
          body:
            'Am River fällt die letzte Karte – ab jetzt gibt es keine Equity mehr, nur noch fertige Hände. Deshalb sortierst du deine Hand vor jeder River-Entscheidung in eine von drei Klassen:\n\n- **Value-Hand**: Schlechtere Hände callen deine Bet oft genug. Dann bette – die Größe richtet sich nach der Calling Range (Lektion 3).\n- **Bluff-Catcher**: Deine Hand schlägt die Bluffs des Gegners, aber praktisch keine seiner Value-Hände. Ein Bluff-Catcher bettet nie selbst: Er checkt und entscheidet gegen eine Bet zwischen Call und Fold.\n- **Luft**: Die Hand gewinnt keinen Showdown. Sie ist entweder ein Give-up oder – mit den richtigen Blockern und einer glaubwürdigen Geschichte – ein Bluff-Kandidat.\n\nDer häufigste teure Fehler ist die Vermischung der ersten beiden Klassen: Spieler betten mittlere Hände "um zu sehen, wo sie stehen", werden nur von Besserem gecallt, nur von Schlechterem gefoldet – und haben aus einem soliden Bluff-Catcher eine Geldverbrennung gemacht. Merke: Am River gibt es keine Protection und keine Informations-Bets mehr. Jede Bet ist entweder Value oder Bluff, und jede Hand dazwischen will checken.\n\nDiese Dreiteilung dauert am Anfang ein paar Sekunden pro River – mit Übung wird sie zum Reflex, der dich vor den meisten großen River-Fehlern bewahrt.',
        },
        {
          heading: 'Bluff-Catching mit Zahlen',
          body:
            'Ob ein Bluff-Catcher callen darf, ist reine Arithmetik: Du vergleichst die **benötigte Equity aus den Pot Odds** mit der **geschätzten Bluff-Frequenz** des Gegners. Da dein Bluff-Catcher genau dann gewinnt, wenn er blufft, ist deine Equity ungefähr sein Bluff-Anteil.\n\nDie Preisliste kennst du: Gegen eine Pot-Bet brauchst du 33 %, gegen eine halbe Pot-Bet 25 %. Jetzt die Gegenseite: Wie viele Bluffs erreichen mit dieser Linie den River? Konkrete Anhaltspunkte:\n\n- Sind Draws verpasst, die er so gespielt hätte? Ein River, auf dem Flushdraw und OESD gleichzeitig platzen, trägt viele natürliche Bluffs.\n- Ist dieser Gegner überhaupt fähig, dreimal zu feuern? Viele Spieler bluffen den Flop, manche den Turn – aber am River geben die meisten auf.\n- Blocke ich seine Value-Hände oder seine Bluffs? Ein Blocker auf die getroffene Flush-Farbe macht den Call besser.\n\nDie unbequeme Wahrheit aus Millionen analysierter Hände: **Der Durchschnittsgegner blufft am River deutlich zu selten**, besonders mit großen Sizings. Wenn deine Schätzung unter der benötigten Equity liegt, fold – auch wenn es sich nach Aufgeben anfühlt. Gute Folds sind unsichtbare Gewinne.',
          table: {
            headers: ['River-Bet des Gegners', 'Benötigte Equity für den Call'],
            rows: [
              ['1/3 Pot', '20 %'],
              ['1/2 Pot', '25 %'],
              ['2/3 Pot', 'ca. 29 %'],
              ['Pot', 'ca. 33 %'],
            ],
          },
          example:
            'Pot 20 €, der Gegner bettet 20 €. Du brauchst 33 % Equity. Seine Linie enthält nach deiner Einschätzung höchstens 20 % Bluffs (wenige verpasste Draws, passiver Spielertyp). 20 % < 33 % – der Fold ist klar, egal wie "bluffig" es sich anfühlt.',
        },
        {
          heading: 'Große River-Raises: Respekt zahlt sich aus',
          body:
            'Die teuerste Einzelsituation im Cash Game: Du value-bettest am River, und der Gegner raist groß. Die Statistik dazu ist eindeutig – **große River-Raises vom Durchschnittsgegner sind massiv value-lastig**. Der Grund ist psychologisch: Ein River-Raise-Bluff riskiert viel Geld ohne jede Equity gegen eine Range, die gerade Stärke gezeigt hat. Die wenigsten Spieler haben das im Repertoire; die meisten raisen dort nur Straights, Flushes, Sets und bessere Two Pairs.\n\nDie Konsequenz: Gegen unbekannte und passive Gegner darfst – und musst – du nach einem großen River-Raise auch starke Ein-Paar-Hände wie Top Pair Top Kicker meist folden. Ja, gelegentlich lässt du damit einen Bluff ungestraft davonkommen. Aber die Mischung aus seltenen Bluffs und deiner sichtbar starken Hand macht den Call zum Langzeit-Verlierer. Anders sieht es nur gegen nachweislich kreative, aggressive Gegner aus – dafür brauchst du aber echte Beobachtungen, nicht bloß ein Bauchgefühl.\n\nZum Schluss ein Wort zur Disziplin: Turn und River sind die Streets, auf denen Tilt am teuersten ist. Ein gefundener Fold, ein aufgegebener Bluff oder ein verlorener großer Pot sind Teil des Spiels – bewerte deine Entscheidungen nach der Qualität der Überlegung, nicht nach dem Ausgang der einzelnen Hand. Wer das trennt, spielt die großen Streets ruhiger, besser und mit gesundem Abstand zum Geld.',
          tip: 'Führe eine Liste der Gegner, die du bei einem großen River-Raise tatsächlich beim Bluffen erwischt hast. Sie wird kurz bleiben – und genau das ist die Lektion.',
        },
      ],
      takeaways: [
        'Gute Barrel-Karten treffen deine Range (Overcards, Scare Cards) oder verbessern deine Equity – Triple Barrels werden am Turn geplant, nicht am River improvisiert.',
        'Die Delayed C-Bet greift die schwache Check-Check-Range des Gegners an und schützt gleichzeitig deine eigene Flop-Check-Range.',
        'Am River jede Hand einordnen: Value-Hand bettet, Bluff-Catcher checkt und rechnet, Luft gibt auf oder blufft mit Blockern.',
        'Bluff-Catching ist Arithmetik: benötigte Equity (Pot-Bet: 33 %) gegen geschätzte Bluff-Frequenz – der Durchschnittsgegner blufft am River zu selten.',
        'Große River-Raises vom Durchschnittsgegner sind fast immer Value – disziplinierte Folds mit starken Ein-Paar-Händen gewinnen langfristig.',
      ],
      quiz: [
        {
          question: 'Du raist am Button und c-bettest auf 9♠ 6♥ 2♦, der Big Blind callt. Welcher Turn ist die beste Karte für eine Double Barrel?',
          options: ['A♦', '7♥', '2♣', '6♦'],
          correctIndex: 0,
          explanation:
            'Das Ass trifft die Range des Preflop-Raisers voller Ax-Hände und setzt die 9x- und Pocket-Pair-Hände des Gegners unter Druck. Die 7 verbindet eher die Range des Callers, und die Paarungskarten ändern wenig zu seinen Ungunsten.',
        },
        {
          question: 'Was ist eine Delayed C-Bet?',
          options: [
            'Eine besonders kleine C-Bet am Flop',
            'Du checkst als Preflop-Raiser den Flop und bettest erst den Turn, nachdem der Gegner erneut gecheckt hat',
            'Eine C-Bet, die du erst nach langem Nachdenken setzt',
            'Jede Bet am River nach zwei gecheckten Streets',
          ],
          correctIndex: 1,
          explanation:
            'Nach Check-Check ist die Range des Gegners überdurchschnittlich schwach und gecappt – die verzögerte Bet am Turn gewinnt deshalb sehr oft sofort und schützt zugleich deine Flop-Check-Range.',
        },
        {
          question: 'Am River bettet dein Gegner groß. Deine Hand schlägt seine Bluffs, aber keine seiner Value-Hände. Was ist deine Hand jetzt?',
          options: [
            'Eine dünne Value-Hand, die selbst betten sollte',
            'Ein Bluff-Catcher – die Entscheidung hängt von Pot Odds und seiner geschätzten Bluff-Frequenz ab',
            'Ein automatischer Fold, unabhängig von allen Zahlen',
            'Ein Kandidat für einen Raise als Bluff',
          ],
          correctIndex: 1,
          explanation:
            'Genau das ist die Definition des Bluff-Catchers: Er gewinnt nur gegen Bluffs. Ob der Call richtig ist, entscheidet der Vergleich zwischen benötigter Equity und Bluff-Anteil – nicht das Bauchgefühl.',
        },
        {
          question: 'Pot 20 €, der Gegner bettet am River 20 €. Du schätzt seine Bluff-Frequenz in dieser Linie auf etwa 20 %. Call oder Fold mit deinem Bluff-Catcher?',
          options: [
            'Call – 33 % Pot Odds sind ein guter Preis',
            'Fold – du brauchst 33 % Equity, gewinnst aber nur gegen rund 20 % seiner Range',
            'Call, weil man sich von großen Bets nie wegdrängen lassen darf',
            'Raise als Bluff, um seine Value-Hände zum Folden zu bringen',
          ],
          correctIndex: 1,
          explanation:
            'Gegen die Pot-Bet brauchst du 33 % Equity, seine geschätzten 20 % Bluffs liefern nur 20 %. Der Call verliert langfristig Geld – der Fold ist die klar bessere Entscheidung.',
        },
        {
          question: 'Ein durchschnittlicher, eher passiver Gegner raist deine River-Value-Bet groß. Du hältst Top Pair Top Kicker. Beste Reaktion?',
          options: [
            'Meist folden – große River-Raises sind bei diesem Spielertyp fast immer Value',
            'Immer callen, weil Top Pair Top Kicker zu stark zum Folden ist',
            '3-Bet All-in zur Protection',
            'Callen, weil Gegner am River genauso oft bluffen wie value-betten',
          ],
          correctIndex: 0,
          explanation:
            'River-Raise-Bluffs sind beim Durchschnittsgegner extrem selten – die Raise-Range besteht überwiegend aus Two Pair und besser. Gegen diese Range ist Top Pair ein Langzeit-Verlierer, und Protection existiert am River nicht.',
        },
      ],
    },
  ],
};

export default m4;
