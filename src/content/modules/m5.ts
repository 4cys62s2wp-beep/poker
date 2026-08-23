import type { Module } from '../types';

const m5: Module = {
  id: 'm5',
  title: 'Fortgeschrittene Konzepte',
  subtitle: 'Ranges, GTO, Blocker und Turnierstrategie',
  icon: '🧠',
  level: 'Profi',
  lessons: [
    {
      id: 'm5-l1',
      title: 'In Ranges denken',
      duration: 11,
      intro:
        'Starke Spieler versuchen nicht zu erraten, welche zwei Karten der Gegner hält. Sie arbeiten mit der Menge aller Hände, die er in dieser Situation haben kann – und verengen diese Menge Street für Street. Dieses Range-Denken ist der wichtigste Schritt vom Hobby- zum ernsthaften Spieler.',
      sections: [
        {
          heading: 'Warum Hand-Raten scheitert',
          body:
            'Der klassische Anfängersatz lautet: "Ich setze ihn auf AK." Das Problem: Selbst der beste Spieler der Welt kann aus Aktionen nicht eine einzelne Hand ableiten. Zu jeder Betting-Line passen Dutzende von Händen, und wer sich auf eine festlegt, liegt fast immer falsch – und trifft Entscheidungen auf Basis einer Fiktion.\n\nEine **Range** ist stattdessen die Menge aller Hände, die ein Spieler an einem bestimmten Punkt konsistent mit seinen bisherigen Aktionen halten kann – idealerweise gewichtet, denn manche Hände spielt er nur manchmal so. Statt "Er hat AK" denkst du: "Sein Barrel-Range besteht grob aus Top Pair oder besser, ein paar starken Draws und einigen Bluffs."\n\nDer Vorteil ist mathematischer Natur: Gegen eine Range kannst du Equity rechnen, Combos zählen und Verteidigungsfrequenzen bestimmen. Gegen eine geratene Einzelhand kannst du nur hoffen. Range-Denken macht Entscheidungen außerdem reproduzierbar: Dieselbe Situation führt zur selben Analyse, unabhängig davon, ob du gerade gewinnst oder tiltest.',
          tip: 'Formuliere Reads nie als Einzelhand, sondern als Kategorie-Liste: "Value: X, Draws: Y, Bluffs: Z." Wenn dir für eine Kategorie nichts einfällt, ist das selbst eine wertvolle Information.',
        },
        {
          heading: 'Schritt 1: Die Preflop-Range festlegen',
          body:
            'Jede Range-Analyse beginnt preflop, denn dort ist die Information am verlässlichsten: Position plus Aktion definieren die Ausgangsmenge. Ein Open-Raise aus früher Position bedeutet eine enge, starke Range; ein Open vom Button eine sehr weite.\n\nFür 6-max mit 100bb sind das grobe moderne Richtwerte für Open-Raises (RFI, "Raise First In"):\n\n- **UTG**: ca. 16 % – etwa 22+, A9s+, A5s, KTs+, QTs+, JTs, T9s, 98s, ATo+, KJo+\n- **Hijack**: ca. 20 %\n- **Cutoff**: ca. 27 %\n- **Button**: ca. 43 % – inklusive vieler suited Hände und schwacher Broadways\n- **Small Blind**: ca. 45 %, je nach Strategie auch mit Limp-Anteil\n\nGenauso wichtig: Auch Calls definieren Ranges. Wer im Big Blind gegen ein Button-Open nur callt, hat meist keine Premiums mehr (die würde er oft 3-betten), dafür viele mittlere und spekulative Hände. Diese Vorab-Einordnung ist dein Fundament – alles Weitere ist nur noch Filtern.',
          example:
            'Ein tighter Spieler openraist UTG und du hältst Q♥ J♥. Gegen seine ca. 16-%-Range bist du oft dominiert (AQ, KQ, QQ, JJ treffen dieselben Boards besser). Dieselbe Hand gegen ein Button-Open ist dagegen klar spielbar – gleiche Karten, völlig andere Situation, weil die gegnerische Range eine andere ist.',
        },
        {
          heading: 'Schritt 2: Street für Street verengen',
          body:
            'Jede Aktion ist ein Filter: Hände, die diese Aktion (fast) nie spielen würden, fliegen aus der Range. Hände, die sie immer spielen würden, bleiben voll gewichtet. So verengst du die Preflop-Range über Flop, Turn und River.\n\nDrei Prinzipien helfen dabei:\n\n- **Kategorien statt Einzelhände**: Sortiere die verbleibende Range nach Value-Händen, Draws und Bluffs/Air. Beobachte, wie sich die Anteile mit jeder Street verschieben.\n- **Sizing beachten**: Eine kleine C-Bet (Continuation Bet, die Anschlussbet des Preflop-Aggressors) auf trockenem Board verengt die Range kaum – viele Spieler betten dort ihre komplette Range. Eine große Turn-Bet nach Check-Raise verengt dramatisch.\n- **Karten-Effekte einrechnen**: Jede neue Boardkarte verändert die Range, ohne dass jemand handelt. Kommt der Flush an, werden Draws zu Value; verpasst der Draw am River, wandern dieselben Combos in die Bluff-Kategorie.\n\nWichtig ist die Asymmetrie: Aggressive Aktionen (Bets, Raises) filtern stark, passive (Checks, Calls) schwächer. Und: Was ein Spieler NICHT tut, zählt auch. Wer den Flop hinter checkt, hat danach seltener starke Hände – seine Range ist "capped", also nach oben gedeckelt.',
          tip: 'Frage dich bei jeder gegnerischen Aktion: "Welche Hände aus seiner bisherigen Range spielen so – und welche nicht?" Wenn du diese Frage im Spiel routinemäßig stellst, denkst du bereits in Ranges.',
        },
        {
          heading: 'Beispielhand: Eine komplette Range-Analyse',
          body:
            'Cash Game 6-max, 100bb. Ein solider Reg openraist im Cutoff auf 2,5bb, du callst im Big Blind mit 8♠ 8♦. Seine Startrange: ca. 27 % – alle Paare, Broadways, suited Aces, suited Connectors, dazu ATo+, KJo+.\n\n**Flop K♦ 7♣ 2♥** (Pot 5,5bb): Du checkst, er bettet 1,8bb. Auf diesem trockenen K-hoch-Board c-betten gute Regs klein und sehr häufig, oft die gesamte Range. Filterwirkung: minimal. Dein Call mit 88 ist Standard – du schlägst seine vielen ungepaarten Hände.\n\n**Turn 4♠** (Pot 9,1bb): Er barrelt 6,5bb, rund 70 %. Jetzt filtert es: Die zweite, größere Bet spielen vor allem Kx (AK, KQ, KJs, KTs), Sets (KK, 77, 22), AA – und als Bluffs Gutshots und offene Draws wie 65s, 86s, 53s, A5s. Hände wie QJ oder A8s geben meist auf. Deine 88 schlagen nur noch die Bluffs, aber davon gibt es genug: Call.\n\n**River A♥** (Pot 22,1bb): Er bettet 16,5bb. Zähle nach: Das Ass verwandelt seine A-high-Bluffs in Value (A5s hat jetzt Top Pair, 53s sogar die Straße A-2-3-4-5), AK wird Two Pair, AA zum Set. Übrig als Bluffs bleiben fast nur verpasste 65s und 86s – wenige Combos. Deine 88 blocken davon nichts Relevantes. Die Range-Analyse sagt klar: **Fold**.',
          cards: ['Kd', '7c', '2h', '4s', 'Ah'],
          example:
            'Der Kern der Analyse: Nicht "Hat er mich geschlagen?", sondern "Wie viele Value-Combos gegen wie viele Bluff-Combos bleiben nach dieser Line auf dieser Karte übrig?" Am River oben stehen grob 40+ Value-Combos gegen eine Handvoll verpasster Draws – deshalb ist der Fold rechnerisch klar, obwohl 88 ein Paar ist.',
        },
        {
          heading: 'Häufige Denkfehler',
          body:
            'Range-Denken scheitert selten am Konzept, meist an der Disziplin. Die typischen Fehler:\n\n- **Einzelhand-Fixierung**: "Er hat Asse" oder "Er blufft sicher" – beides ersetzt Analyse durch Bauchgefühl. Halte immer die ganze gewichtete Menge im Blick.\n- **Range-Morphing**: Du willst callen und redest dir nachträglich Bluffs in die gegnerische Range, die seine Line gar nicht hergibt. Die Range wird durch seine Aktionen definiert, nicht durch dein Wunschergebnis.\n- **Projektion**: Du gibst dem Gegner deine eigene Range. Ein Spieler, der niemals mit Draws raist, hat nach einem Raise eben keine Draws – auch wenn du selbst dort raisen würdest.\n- **Monsters under the Bed**: Aus Angst gibst du dem Gegner nur noch die Nuts und foldest Hände, die gegen seine echte Gesamtrange klar profitabel weiterspielen.\n- **Kein Update**: Du legst preflop eine Range fest und ignorierst dann, dass Turn-Barrel und River-Karte sie längst verändert haben.\n\nDer gemeinsame Nenner: Emotion überschreibt Logik. Die Gegenmaßnahme ist ein fester Prozess – Startrange festlegen, nach jeder Aktion filtern, am Ende Combos vergleichen. Immer in dieser Reihenfolge, unabhängig davon, wie die Session gerade läuft.',
          tip: 'Analysiere nach der Session eine markierte Hand schriftlich als Range-Walkthrough. Zehn saubere schriftliche Analysen bringen mehr als hundert gefühlte Reads am Tisch.',
        },
      ],
      takeaways: [
        'Eine Range ist die gewichtete Menge aller Hände, die zu den bisherigen Aktionen passen – nie eine einzelne geratene Hand.',
        'Position plus Preflop-Aktion definieren die Startrange; jede weitere Aktion und jede Boardkarte filtern sie.',
        'Aggressive Aktionen verengen Ranges stark, passive schwach – und wer nur checkt und callt, wird oft "capped".',
        'Am River entscheidet das Verhältnis von Value- zu Bluff-Combos, nicht die absolute Stärke deiner Hand.',
        'Die größten Fehler sind emotional: Range-Morphing, Projektion und Angst vor den Nuts. Ein fester Analyse-Prozess schützt davor.',
      ],
      quiz: [
        {
          question: 'Was ist der Kernunterschied zwischen Range-Denken und "Ich setze ihn auf AK"?',
          options: [
            'Range-Denken funktioniert nur mit Tracking-Software',
            'Range-Denken bedeutet, immer vom Schlimmsten auszugehen',
            'Es gibt keinen – beides sind Reads',
            'Range-Denken arbeitet mit der gewichteten Menge aller konsistenten Hände statt mit einer geratenen Einzelhand',
          ],
          correctIndex: 3,
          explanation:
            'Eine Einzelhand zu raten ist fast immer falsch und nicht berechenbar. Gegen eine Range kannst du dagegen Equity und Combos rechnen und kommst zu reproduzierbaren Entscheidungen.',
        },
        {
          question: 'Ein guter Reg c-bettet auf K♦ 7♣ 2♥ ein Drittel Pot. Wie stark verengt das seine Range?',
          options: [
            'Sehr stark – er zeigt mindestens Top Pair an',
            'Kaum – auf trockenen Boards betten viele Spieler dort fast ihre gesamte Range klein',
            'Es entfernt alle Bluffs aus seiner Range',
            'Es entfernt alle starken Hände, weil er die slowplayen würde',
          ],
          correctIndex: 1,
          explanation:
            'Kleine C-Bets auf trockenen, Range-freundlichen Boards werden oft mit (fast) der kompletten Range gespielt. Die Filterwirkung ist minimal – echte Informationen liefern erst spätere, größere Bets.',
        },
        {
          question: 'Was beschreibt der Denkfehler "Range-Morphing" am treffendsten?',
          options: [
            'Du vergisst, die Range nach dem Turn zu aktualisieren',
            'Du gibst dem Gegner zu viele Nuts-Combos',
            'Du passt die gegnerische Range nachträglich so an, dass sie deinen gewünschten Call rechtfertigt',
            'Du verwechselst suited und offsuit Combos',
          ],
          correctIndex: 2,
          explanation:
            'Beim Range-Morphing erfindest du Bluffs oder schwächere Hände in der gegnerischen Range, weil du callen willst. Die Range muss aber aus seinen Aktionen folgen, nicht aus deinem Wunschergebnis.',
        },
        {
          question: 'In der Beispielhand (Board K♦ 7♣ 2♥ 4♠ A♥) wird 88 am River zum Fold. Was ist der Hauptgrund?',
          options: [
            'Das Ass verwandelt viele seiner Bluffs in Value-Hände, sodass kaum Bluff-Combos übrig bleiben',
            '88 kann keinen Bluff mehr schlagen',
            'Der Gegner hat immer AK, wenn er dreimal bettet',
            'Pocket Pairs sind am River grundsätzlich Folds',
          ],
          correctIndex: 0,
          explanation:
            'Der River trifft die Barrel-Range massiv: A5s, 53s, AK und AA werden zu Value, während als Bluffs fast nur verpasste 65s/86s bleiben. Das Value-Bluff-Verhältnis kippt so stark, dass der Call unprofitabel wird.',
        },
        {
          question: 'Warum hat eine Big-Blind-Calling-Range gegen ein Button-Open meist keine Premiums wie AA oder AK mehr?',
          options: [
            'Weil man Premiums im Big Blind foldet',
            'Weil der Button Premiums blockt',
            'Weil Premiums out of position unspielbar sind',
            'Weil diese Hände überwiegend 3-bettet würden und damit aus der reinen Call-Range herausgefiltert sind',
          ],
          correctIndex: 3,
          explanation:
            'Auch die eigene Aktion filtert die Range: Wer mit Premiums fast immer 3-bettet, signalisiert mit einem Call, dass er genau diese Hände selten hält. Calls definieren Ranges genauso wie Raises.',
        },
      ],
    },
    {
      id: 'm5-l2',
      title: 'GTO vs. Exploitative Play',
      duration: 11,
      intro:
        'GTO und exploitatives Spiel werden oft als Gegensätze verkauft – in Wahrheit sind sie zwei Werkzeuge desselben Handwerks. Diese Lektion erklärt beide Denkweisen, die Mathematik dahinter (MDF und Alpha) und wie du sie in der Praxis kombinierst.',
      sections: [
        {
          heading: 'Was GTO wirklich bedeutet',
          body:
            'GTO steht für **Game Theory Optimal** und bezeichnet eine Gleichgewichtsstrategie (Nash-Equilibrium): eine Mischstrategie, gegen die kein Gegner langfristig profitabel abweichen kann – egal, was er tut. GTO ist damit **unausbeutbar**, nicht "maximal gewinnbringend".\n\nDas zentrale Werkzeug ist **Indifferenz**: Eine GTO-Strategie mischt Value-Bets und Bluffs in genau dem Verhältnis, bei dem die Bluff-Catcher des Gegners mit Call und Fold denselben Erwartungswert haben – nämlich null Extragewinn. Der Gegner kann sich nicht verbessern, egal wie er sich entscheidet. Genau deshalb spielen Solver so viele Aktionen mit gemischten Frequenzen ("30 % Bet, 70 % Check").\n\nZwei Missverständnisse solltest du vermeiden. Erstens: GTO heißt nicht tight oder passiv – Gleichgewichtsstrategien bluffen viel und aggressiv, nur eben in ausbalancierten Anteilen. Zweitens: Gegen Spieler mit großen Fehlern lässt GTO Geld liegen, denn es greift diese Fehler nicht gezielt an. Es gewinnt gegen Fehler automatisch etwas, aber nicht das Maximum.\n\nDer praktische Wert von GTO-Studium liegt weniger im Auswendiglernen von Frequenzen als im Verständnis der Struktur: Welche Hände eignen sich als Bluffs, welche Boards gehören welcher Range, wie viel Verteidigung ist nötig.',
          tip: 'Nutze Solver-Outputs als Landkarte, nicht als Gesetzbuch: Verstehe, WARUM eine Hand gebettet wird (Equity, Blocker, Playability) – die Begründung ist übertragbar, die exakte Frequenz nicht.',
        },
        {
          heading: 'MDF: Wie oft musst du verteidigen?',
          body:
            'Die **Minimum Defense Frequency (MDF)** beantwortet die Frage: Welchen Anteil meiner Range muss ich gegen eine Bet mindestens weiterspielen, damit der Gegner nicht mit jedem beliebigen Bluff automatisch Profit macht?\n\nDie Formel: **MDF = Pot / (Pot + Bet)**.\n\nDas Gegenstück ist **Alpha**, die Break-even-Erfolgsquote eines Bluffs: **Alpha = Bet / (Bet + Pot)** – der Anteil an Folds, den ein reiner Bluff braucht, um sich selbst zu bezahlen. Es gilt immer: Alpha = 1 − MDF.\n\nBeispiel: Bei einer Pot-Size-Bet riskiert der Bluffer eine Poteinheit, um eine zu gewinnen. Foldest du öfter als in 50 % der Fälle, druckt er mit jedem Bluff Geld. Bei einer kleinen Drittel-Pot-Bet reicht ihm dagegen schon ein Fold in 25 % der Fälle – deshalb musst du gegen kleine Bets sehr weit verteidigen.\n\nWichtige Einschränkung: MDF ist ein Konzept gegen Gegner, die ausreichend bluffen. Gegen jemanden, der praktisch nie blufft, ist "unter MDF folden" kein Leak, sondern der korrekte Exploit. MDF sagt dir, was Balance erfordern würde – nicht, was gegen diesen konkreten Gegner am meisten gewinnt.',
          table: {
            headers: ['Bet-Größe', 'MDF (dein Verteidigungsanteil)', 'Alpha (Break-even des Bluffs)'],
            rows: [
              ['33 % Pot', '75 %', '25 %'],
              ['50 % Pot', '67 %', '33 %'],
              ['66 % Pot', '60 %', '40 %'],
              ['100 % Pot', '50 %', '50 %'],
              ['150 % Pot', '40 %', '60 %'],
              ['200 % Pot', '33 %', '67 %'],
            ],
          },
          example:
            'Der Gegner bettet 50 in einen 100er-Pot (halber Pot). Alpha = 50 / 150 = 33 %: Foldest du öfter als in einem Drittel der Fälle, macht jeder seiner Bluffs automatisch Gewinn. Deine MDF = 100 / 150 = 67 % – rund zwei Drittel deiner Range sollten weiterspielen, wenn du unausbeutbar sein willst.',
        },
        {
          heading: 'Exploitative Play: Fehler maximal bestrafen',
          body:
            'Exploitatives Spiel bedeutet: Du identifizierst eine systematische Abweichung des Gegners vom Gleichgewicht und weichst selbst so weit ab, dass du diesen Fehler maximal bestrafst.\n\nDie Logik ist immer dieselbe: Jeder gegnerische Fehler hat einen passenden Gegen-Hebel.\n\n- Er foldet zu oft auf C-Bets? Du bluffst (fast) jede Hand.\n- Er callt zu viel? Du bluffst kaum noch und value-bettest dünner und größer.\n- Er blufft zu selten auf großen River-Bets? Du foldest deine Bluff-Catcher weit unter MDF.\n- Er 3-bettet nur Premiums? Du foldest Hände, die gegen diese Range dominiert sind, und set-minst günstig.\n\nZwei Dinge machen exploitatives Spiel anspruchsvoll. Erstens brauchst du belastbare Beobachtungen – ein einzelner Showdown ist ein Hinweis, kein Beweis. Zweitens öffnest du mit jeder Abweichung eine eigene Angriffsfläche: Wer nie blufft, kann selbst ausgebeutet werden. Gegen schwache, unaufmerksame Gegner ist das egal – sie passen sich nicht an. Gegen starke Regs musst du abwägen, wie sichtbar dein Exploit ist und wie schnell er auffliegt.\n\nDie Faustregel: Je größer und stabiler der gegnerische Fehler und je unaufmerksamer der Gegner, desto extremer darfst du abweichen.',
          example:
            'Ein Gegner hat in zwei Stunden dreimal am River gecheckt-gecallt und nie einen Bluff gezeigt; große River-Raises hatten immer die Nuts. Als er nun auf dem River deine Value-Bet raist, foldest du sogar ein starkes Two Pair – weit unter MDF, aber gegen dieses Profil klar profitabel.',
        },
        {
          heading: 'Die Synthese: GTO als Baseline, Exploits als Abweichung',
          body:
            'In der Praxis schließen sich beide Ansätze nicht aus, sondern bilden ein Stufenmodell:\n\n- **Stufe 1 – Baseline**: Gegen Unbekannte spielst du eine solide, grob ausbalancierte Strategie nahe an den GTO-Prinzipien. Sie schützt dich davor, selbst ausgebeutet zu werden, während du Informationen sammelst.\n- **Stufe 2 – Hypothesen**: Du beobachtest Abweichungen – Stats, Showdowns, Sizings, Timing – und bildest daraus konkrete Vermutungen ("foldet zu viel gegen Turn-Barrels").\n- **Stufe 3 – Exploits**: Je sicherer die Hypothese, desto weiter weichst du gezielt ab. Bestätigt sie sich nicht, kehrst du zur Baseline zurück.\n\nGTO-Wissen ist dabei die Voraussetzung für gutes exploitatives Spiel, nicht sein Gegner: Nur wer weiß, wie das Gleichgewicht ungefähr aussieht, erkennt überhaupt, WAS ein Fehler ist und in welche Richtung der Hebel zeigt. Ohne Referenzpunkt ist "Exploit" nur ein anderes Wort für Bauchgefühl.\n\nUmgekehrt gilt: Wer stur Solver-Frequenzen nachspielt, während der Gegner offensichtliche Riesenfehler macht, verschenkt genau die Edge, aus der am Tisch das Geld kommt. Die höchste Winrate entsteht fast immer aus einer soliden Baseline plus mutigen, gut begründeten Abweichungen.',
          tip: 'Formuliere jeden Exploit als überprüfbaren Satz mit Gegenmaßnahme: "Er überfoldet den Turn, also barrele ich jeden Gutshot – bis ein Showdown das Gegenteil zeigt." So bleibt dein Spiel anpassungsfähig statt dogmatisch.',
        },
        {
          heading: 'Low-Stakes-Realität: Mehr Value, weniger Fancy Play',
          body:
            'Auf niedrigen Limits – online wie live – hat die Spielerpopulation stabile, gut dokumentierte Tendenzen: Es wird zu viel gecallt, zu selten gefoldet und auf großen River-Sizings deutlich zu wenig geblufft. Daraus folgt eine klare Prioritätenliste:\n\n- **Value-Betten ist König**: Bette deine guten Hände größer und dünner, als es GTO täte. Gegen Spieler, die mit Third Pair callen, ist die dünne Value-Bet der größte Einzel-Gewinnbringer überhaupt.\n- **Weniger große Bluffs**: Multi-Street-Bluffs und Hero-Calls auf dich selbst zugeschnittene "Balance" zahlen sich gegen Gegner, die nicht folden bzw. nicht bluffen, schlicht nicht aus.\n- **Overfold gegen Aggression**: Ein River-Check-Raise auf Low Stakes ist fast immer Value. Deine Bluff-Catcher darfst du dort guten Gewissens aufgeben.\n- **Kein Fancy Play Syndrome**: Trickreiche Slowplays, wilde Overbet-Bluffs und Level-Wars sind Lösungen für Probleme, die es auf diesen Limits kaum gibt. Sie kosten meist mehr, als sie bringen.\n\nDas heißt nicht, dass GTO-Studium dort wertlos ist – es liefert die Baseline und das Verständnis. Aber die Abweichungen von dieser Baseline zeigen auf Low Stakes fast alle in dieselbe Richtung: simpel, value-orientiert, diszipliniert.',
          example:
            'Du hältst am River Top Pair mit mittlerem Kicker gegen eine Calling Station. Der Solver würde hier oft checken, um ausbalanciert zu bleiben. Gegen diesen Gegnertyp ist die halbe Pot-Bet trotzdem klar besser: Er callt mit so vielen schlechteren Händen, dass die dünne Value-Bet den Check deutlich schlägt.',
        },
      ],
      takeaways: [
        'GTO ist die unausbeutbare Gleichgewichtsstrategie: Sie mischt Value und Bluffs so, dass der Gegner indifferent wird – sie maximiert aber nicht den Profit gegen Fehler.',
        'MDF = Pot / (Pot + Bet) gibt an, wie viel du gegen eine Bet mindestens verteidigen musst; Alpha = Bet / (Bet + Pot) ist die Break-even-Foldquote eines Bluffs.',
        'Exploitatives Spiel weicht gezielt vom Gleichgewicht ab, um erkannte Fehler maximal zu bestrafen – und wird selbst ausbeutbar.',
        'Praxisformel: solide GTO-nahe Baseline gegen Unbekannte, mutige Abweichungen bei belastbaren Reads.',
        'Auf Low Stakes gewinnt fast immer dieselbe Anpassung: mehr und dünnere Value-Bets, weniger große Bluffs, Overfold gegen River-Aggression.',
      ],
      quiz: [
        {
          question: 'Der Gegner bettet 2/3 Pot. Wie hoch ist deine Minimum Defense Frequency?',
          options: ['40 %', '50 %', '60 %', '67 %'],
          correctIndex: 2,
          explanation:
            'MDF = Pot / (Pot + Bet) = 1 / (1 + 2/3) = 60 %. Die restlichen 40 % entsprechen Alpha – der Foldquote, ab der jeder Bluff des Gegners profitabel wird.',
        },
        {
          question: 'Was garantiert eine echte GTO-Strategie – und was garantiert sie NICHT?',
          options: [
            'Sie garantiert, langfristig nicht ausgebeutet werden zu können – aber nicht den Maximalprofit gegen fehlerhafte Gegner',
            'Sie garantiert maximalen Gewinn gegen jeden Gegnertyp',
            'Sie garantiert, dass man nie einen großen Pot verliert',
            'Sie garantiert Gewinne nur gegen andere GTO-Spieler',
          ],
          correctIndex: 0,
          explanation:
            'GTO ist eine Verteidigungs-Garantie: Kein Gegner kann profitabel gegen sie abweichen. Gegen große Fehler gewinnt sie automatisch etwas, aber weniger als eine gezielt ausbeutende Strategie.',
        },
        {
          question: 'Ein Bluff mit Pot-Size-Bet ist als reiner Bluff break-even, wenn der Gegner wie oft foldet?',
          options: ['25 %', '33 %', '50 %', '67 %'],
          correctIndex: 2,
          explanation:
            'Alpha = Bet / (Bet + Pot) = 1 / 2 = 50 %. Du riskierst eine Poteinheit, um eine zu gewinnen – foldet der Gegner öfter als die Hälfte, ist jeder Bluff sofort profitabel.',
        },
        {
          question: 'Du stellst fest, dass ein Gegner auf großen River-Bets praktisch nie blufft. Was ist die korrekte Anpassung?',
          options: [
            'Weiter exakt MDF verteidigen, um balanced zu bleiben',
            'Selbst mehr am River bluffen',
            'Nur noch mit den Nuts callen und diese slowplayen',
            'Bluff-Catcher deutlich unter MDF folden – gegen diesen Fehler ist Overfolding der Exploit',
          ],
          correctIndex: 3,
          explanation:
            'MDF schützt nur gegen Gegner, die tatsächlich bluffen. Blufft jemand nie, verlieren deine Bluff-Catcher gegen seine Betting-Range fast immer – konsequentes Folden ist dann der profitabelste Weg.',
        },
        {
          question: 'Warum ist "mehr Value, weniger Fancy Play" die richtige Grundausrichtung auf Low Stakes?',
          options: [
            'Weil die Rake dort Bluffs verbietet',
            'Weil die Population zu viel callt und zu wenig blufft – dünne Value-Bets gewinnen dort am meisten, große Bluffs am wenigsten',
            'Weil GTO auf Low Stakes nicht funktioniert',
            'Weil man dort keine Reads sammeln kann',
          ],
          correctIndex: 1,
          explanation:
            'Die stabilste Populationstendenz auf niedrigen Limits ist Call-Happiness bei gleichzeitig zu wenigen eigenen Bluffs. Der passende Exploit: dünner und größer value-betten, seltener groß bluffen, gegen Aggression überfolden.',
        },
      ],
    },
    {
      id: 'm5-l3',
      title: 'Blocker & Card Removal',
      duration: 9,
      intro:
        'Deine eigenen Karten verraten dir mehr, als sie wert sind: Jede Karte in deiner Hand fehlt dem Gegner in seiner Range. Dieses Card-Removal-Prinzip entscheidet in knappen Spots, welche Hand du bluffst und mit welcher du callst.',
      sections: [
        {
          heading: 'Das Prinzip: Deine Karten fehlen seiner Range',
          body:
            'Ein **Blocker** ist eine Karte in deiner Hand (oder auf dem Board), die die Anzahl bestimmter gegnerischer Combos reduziert – der Effekt heißt **Card Removal**.\n\nDas Rechnen dahinter ist simple Combo-Arithmetik: Von jedem Rang existieren vier Karten. AA gibt es normalerweise in 6 Combos. Hältst du selbst ein Ass, bleiben für den Gegner nur noch 3 – du hast seine Asse-Wahrscheinlichkeit halbiert. AK gibt es in 16 Combos; mit einem Ass in deiner Hand nur noch 12.\n\nWarum ist das strategisch relevant? Weil viele Entscheidungen am River hauchdünn sind: Ob ein Call oder ein Bluff profitabel ist, hängt oft davon ab, ob die gegnerische Range ein paar Value-Combos mehr oder weniger enthält. Blocker verschieben genau dieses Verhältnis – mal zu deinen Gunsten, mal dagegen.\n\nDaraus folgen die zwei Grundanwendungen:\n\n- **Beim Bluffen** willst du die Hände blocken, mit denen der Gegner callen würde – vor allem seine stärksten.\n- **Beim Bluff-Catchen** willst du seine Value-Hände blocken und seine Bluffs gerade NICHT blocken ("unblocken"), damit möglichst viele Bluff-Combos übrig bleiben.',
          example:
            'Auf dem Board K♦ 7♣ 2♥ existieren ohne Removal 3 Combos des Top Sets KK. Hältst du selbst einen König, etwa K♠ Q♦, bleibt genau 1 Combo übrig – du hast zwei Drittel seines Top Sets aus seiner Range entfernt. Genau solche Combo-Verschiebungen machen aus einem knappen Spot einen klaren.',
        },
        {
          heading: 'Der Klassiker: Das nackte A♠ auf dem Flush-Board',
          body:
            'Das bekannteste Blocker-Beispiel: Auf einem Board mit drei Pik-Karten – etwa 9♠ 6♠ 2♠ – hältst du A♠ ohne zweite Pik-Karte, zum Beispiel A♠ K♦.\n\nZwei Effekte greifen gleichzeitig. Erstens: Der Gegner kann den **Nut Flush unmöglich halten**, denn die dafür nötige Karte liegt in deiner Hand. Seine Calling-Range gegen große Bets verliert damit ihre Spitze. Zweitens: Du kannst den Nut Flush glaubwürdig **repräsentieren** – aus Sicht des Gegners ist A♠ X♠ ein zentraler Teil deiner möglichen Value-Range.\n\nDeshalb sind Hände mit dem nackten Nut-Blocker erstklassige Bluff-Kandidaten auf monotonen Boards und auf Boards, auf denen der Flush-Draw am Turn oder River ankommt: Du bettest oder raist groß und setzt Hände wie kleine Flushes, Sets und Overpairs unter maximalen Druck.\n\nDie gleiche Logik funktioniert abgeschwächt mit dem K♠ als Second-Nut-Blocker. Wichtig bleibt aber die Range-Logik aus Lektion 1: Der Blocker macht den Bluff besser, nicht automatisch gut. Gegen einen Gegner, der ohnehin nie einen Flush foldet, hilft dir das schönste A♠ nichts – dann bettest du es lieber gar nicht erst als Bluff.',
          cards: ['As', 'Kd', '9s', '6s', '2s'],
          tip: 'Merke dir die Hierarchie auf Flush-Boards: Der Nut-Blocker ist zum Bluffen wertvoll, weil er die stärkste Calling-Hand entfernt UND deine Story glaubwürdig macht. Beides zusammen gibt es bei kaum einem anderen Blocker-Typ.',
        },
        {
          heading: 'Nut-Blocker preflop: Warum A5s der perfekte 3-Bet-Bluff ist',
          body:
            'Auch preflop arbeiten Blocker. Moderne 3-Bet-Ranges (eine 3-Bet ist das Re-Raise gegen ein Open-Raise) enthalten neben Value-Händen gezielte Bluffs – und die Klassiker dafür sind **A5s bis A2s**, allen voran A5s.\n\nDrei Gründe machen diese Hände ideal:\n\n- **Blocker-Effekt**: Dein Ass halbiert die AA-Combos des Gegners (6 auf 3) und reduziert AK von 16 auf 12. Genau die Hände, die dich 4-betten oder deine 3-Bet callen und dominieren würden, gibt es seltener. Deine 3-Bet gewinnt dadurch öfter sofort den Pot.\n- **Spielbarkeit**: Wirst du gecallt, hast du eine echte Hand: Nut-Flush-Potenzial, die Wheel-Straße (A-2-3-4-5) und mit der Fünf eine Verbindung zu niedrigen Boards, die die Range des Callers verfehlen.\n- **Kein Range-Verlust**: A5s ist als Call gegen ein Open nur mittelmäßig – du "verbrennst" also keine Hand, die als Call deutlich mehr wert wäre. Ein Ass mit besserem Kicker wie ATs callt lieber, eine Hand wie 96o ist als 3-Bet-Bluff schlicht zu schwach spielbar.\n\nDieses Muster – Nut-Blocker plus Playability plus geringe Alternativkosten – ist die Blaupause für gute Bluff-Auswahl in fast jedem Spot.',
          cards: ['Ah', '5h'],
          example:
            'Der Button openraist, du hältst A♥ 5♥ im Small Blind. Statt zu callen (out of position, mittelmäßige Hand) 3-bettest du: Du blockst AA/AK, faltest viele schlechtere Buttonhände sofort raus und behältst bei einem Call Nut-Draws und Wheel-Potenzial als Fallback.',
        },
        {
          heading: 'Removal beim Bluff-Catchen: Blocke Value, unblocke Bluffs',
          body:
            'Beim Callen dreht sich die Logik um. Ein guter Bluff-Catcher erfüllt zwei Removal-Kriterien:\n\n- Er **blockt Value**: Karten, die die gegnerischen Nuts unwahrscheinlicher machen, erhöhen den Bluff-Anteil in seiner Betting-Range.\n- Er **unblockt Bluffs**: Er enthält möglichst keine Karten aus den verpassten Draws, mit denen der Gegner blufft. Hältst du selbst Teile seiner Bluff-Region, bleiben weniger Bluff-Combos übrig – und dein Call wird schlechter.\n\nBeispiel: Board T♠ 8♠ 4♦ 2♣ 3♠, der Gegner overbettet den River. Mit A♦ A♠ ist dein Call deutlich besser als mit A♦ A♥ – gleiche Handstärke, aber das A♠ entfernt sämtliche Nut-Flush-Combos aus seiner Value-Range. Umgekehrt ist J♥ T♥ (Top Pair) hier ein schlechterer Bluff-Catcher, als er aussieht: Dein Bube steckt genau in den verpassten Straßen-Draws (QJ, J9), du blockst also einen Teil der Hände, mit denen er überhaupt bluffen kann.\n\nDieses Denken erklärt scheinbar paradoxe Solver-Entscheidungen: Manchmal callt die schwächere Hand und foldet die stärkere, weil die schwächere die besseren Removal-Eigenschaften hat. Am River, wo Equity praktisch feststeht, sind Blocker oft das einzige Kriterium, das zwei gleich starke Bluff-Catcher noch unterscheidet.',
          tip: 'Frage dich vor knappen River-Calls immer beides: "Welche seiner Value-Hände blocke ich?" UND "Welche seiner Bluffs blocke ich?" Ein Call wird stärker durch Ersteres und schwächer durch Letzteres.',
        },
        {
          heading: 'Die Grenzen des Blocker-Denkens',
          body:
            'Blocker sind ein Feinschliff-Werkzeug – und werden oft dramatisch überschätzt. Drei Grenzen solltest du kennen:\n\n- **Kleine Effekte**: Ein Blocker verschiebt typischerweise wenige Combos in Ranges mit Dutzenden von Kombinationen. Er verändert Wahrscheinlichkeiten um einige Prozentpunkte – er dreht keine klar verlorene Situation um. Erst wenn ein Spot ohnehin knapp ist, gibt der Blocker den Ausschlag.\n- **Range vor Removal**: Die Reihenfolge der Analyse ist fix: erst Ranges und Frequenzen, dann Combos, ganz am Ende Blocker. "Ich habe das A♠, also raise ich" ist kein Plan, wenn die gegnerische Range gar nicht genug foldbare Hände enthält.\n- **Gegner müssen mitspielen**: Blocker-Bluffs gewinnen nur gegen Gegner, die überhaupt starke Hände folden können. Und Blocker-Calls gewinnen nur gegen Gegner, die überhaupt bluffen. Auf Low Stakes, wo zu wenig geblufft wird, ist der "Removal-Hero-Call" einer der teuersten Fehler ambitionierter Spieler – das Konzept stimmt, die Population passt nicht.\n\nKurz: Blocker beantworten nie die Frage, OB eine Line grundsätzlich Sinn ergibt. Sie beantworten die Frage, WELCHE deiner Kandidaten-Hände die Line am besten umsetzt.',
          example:
            'Zwei Spieler bluffen denselben River-Spot: Der eine, weil der Solver dort mit Nut-Blocker-Händen blufft und der Gegner ein fähiger Reg ist. Der andere, weil er "das A♠ hat" – gegen eine Calling Station, die nie foldet. Gleiches Konzept, einmal richtig und einmal teuer angewendet.',
        },
      ],
      takeaways: [
        'Card Removal ist Combo-Arithmetik: Jede Karte in deiner Hand reduziert bestimmte gegnerische Combos – ein Ass halbiert z. B. seine AA-Combos von 6 auf 3.',
        'Zum Bluffen eignen sich Hände, die die gegnerischen Calling- und Nut-Hände blocken – der Klassiker ist das nackte A♠ auf Pik-Boards.',
        'A5s ist der Muster-3-Bet-Bluff: Nut-Blocker gegen AA/AK, echte Playability (Wheel, Nut Flush), geringe Alternativkosten.',
        'Gute Bluff-Catcher blocken Value und unblocken Bluffs – am River ist das oft das entscheidende Kriterium zwischen Call und Fold.',
        'Blocker sind ein Tie-Breaker in knappen Spots, kein Ersatz für Range-Analyse – und wertlos gegen Gegner, die nie folden oder nie bluffen.',
      ],
      quiz: [
        {
          question: 'Du hältst A♥ K♦. Wie viele AA-Combos kann dein Gegner noch halten?',
          options: ['6', '4', '3', '1'],
          correctIndex: 2,
          explanation:
            'Ohne Removal gibt es 6 AA-Combos. Mit einem Ass in deiner Hand bleiben drei Asse im Deck, aus denen sich nur noch 3 Zweierkombinationen bilden lassen.',
        },
        {
          question: 'Warum ist A♠ K♦ auf dem Board 9♠ 6♠ 2♠ ein starker Bluff-Kandidat?',
          options: [
            'Weil der Gegner den Nut Flush nicht halten kann und du ihn gleichzeitig glaubwürdig repräsentierst',
            'Weil A-high oft am Showdown gewinnt',
            'Weil das Board niedrig ist und deine Overcards live sind',
            'Weil K♦ die zweitbeste Hand blockt',
          ],
          correctIndex: 0,
          explanation:
            'Das A♠ in deiner Hand entfernt alle Nut-Flush-Combos aus der gegnerischen Range und macht deine eigene Story ("Ich habe den Nut Flush") glaubwürdig – die Doppelwirkung des klassischen Nut-Blocker-Bluffs.',
        },
        {
          question: 'Was macht A5s zu einem besseren 3-Bet-Bluff als etwa K9o?',
          options: [
            'A5s gewinnt öfter unimproved am Showdown',
            'A5s blockt AA/AK, hat Nut-Flush- und Wheel-Potenzial und ist als Call ohnehin nur mittelmäßig',
            'K9o blockt zu viele Bluffs des Gegners',
            'A5s ist gegen alle Hände des Gegners Favorit',
          ],
          correctIndex: 1,
          explanation:
            'A5s kombiniert die drei Kriterien guter Bluff-Auswahl: Nut-Blocker gegen die Continue-Range (AA halbiert, AK reduziert), echte Spielbarkeit bei einem Call und geringe Alternativkosten. K9o bietet nichts davon in vergleichbarem Maß.',
        },
        {
          question: 'Am River hat der Gegner mit verpassten QJ-Straight-Draws seine wichtigsten Bluffs. Welche Aussage über deinen Bluff-Catcher stimmt?',
          options: [
            'Mit einer Q oder einem J in der Hand wird dein Call besser',
            'Mit einer Q oder einem J in der Hand wird dein Call schlechter, weil du seine Bluff-Combos blockst',
            'Blocker spielen beim Callen keine Rolle, nur beim Bluffen',
            'Du solltest nur callen, wenn du QJ selbst hältst',
          ],
          correctIndex: 1,
          explanation:
            'Beim Bluff-Catchen willst du die Bluffs des Gegners unblocken: Hältst du selbst Q oder J, existieren weniger QJ-Bluff-Combos – der Bluff-Anteil seiner Betting-Range sinkt und dein Call verliert an Wert.',
        },
        {
          question: 'Was ist die wichtigste Grenze des Blocker-Denkens?',
          options: [
            'Blocker funktionieren nur bei suited Händen',
            'Blocker verschieben nur wenige Combos – sie sind ein Tie-Breaker in knappen Spots, ersetzen aber keine Range-Analyse und wirken nicht gegen Gegner, die nie folden oder nie bluffen',
            'Blocker gelten nur preflop, nicht postflop',
            'Blocker sind nur relevant, wenn man selbst die Nuts hält',
          ],
          correctIndex: 1,
          explanation:
            'Removal-Effekte sind klein im Verhältnis zur Gesamtrange. Erst wenn Range-Analyse und Frequenzen einen Spot knapp machen, entscheidet der Blocker – und nur gegen Gegner, deren Verhalten die Line überhaupt profitabel machen kann.',
        },
      ],
    },
    {
      id: 'm5-l4',
      title: 'Polarisiert vs. linear',
      duration: 9,
      intro:
        'Nicht nur WAS du bettest, sondern WIE deine gesamte Betting-Range aufgebaut ist, bestimmt das richtige Sizing. Die beiden Grundbaupläne heißen polarisiert und linear – wer sie versteht, liest gegnerische Sizings plötzlich wie einen offenen Text.',
      sections: [
        {
          heading: 'Zwei Baupläne für eine Range',
          body:
            'Eine **polarisierte Range** besteht aus zwei Extremen: sehr starken Value-Händen ("Nuts" oder nahe dran) und Bluffs – die Mitte fehlt. Die Logik: Deine starken Hände wollen maximalen Value, deine Bluffs maximalen Fold-Druck, und beide profitieren vom selben aggressiven Vorgehen. Mittelstarke Hände passen nicht hinein: Sie gewinnen nichts von schlechteren Händen, die callen, und folden keine besseren raus – sie checken lieber.\n\nEine **lineare Range** (auch "merged", also verschmolzen) ist das Gegenmodell: Sie beginnt bei den stärksten Händen und reicht lückenlos nach unten bis zu einem Cutoff – Nuts, starke Hände, gute mittlere Hände. Bluffs im engeren Sinn enthält sie wenige; ihre schwächsten Hände sind eher dünne Value-Bets oder Semi-Bluffs mit Substanz.\n\nDer Unterschied wird an einer 3-Bet-Range greifbar: Polar 3-bettest du QQ+/AK plus Bluffs wie A5s – und callst die Mitte (TT, AQs, KQs). Linear 3-bettest du einfach die besten X Prozent am Stück: QQ+, AK, AQ, TT, KQs und so weiter, ganz ohne klassische Bluffs.\n\nWelcher Bauplan richtig ist, hängt davon ab, wie der Gegner auf Druck reagiert – das ist der Schlüssel zu den nächsten Abschnitten.',
          tip: 'Eselsbrücke: Polar = Hantel (zwei schwere Enden, nichts in der Mitte). Linear = Rampe (von oben lückenlos abfallend). Frage dich bei jeder Bet – deiner und der des Gegners: Hantel oder Rampe?',
        },
        {
          heading: 'Sizing folgt der Range-Struktur',
          body:
            'Range-Bauplan und Bet-Größe gehören zusammen – das ist keine Stilfrage, sondern Mathematik.\n\n**Polar = groß.** Deine Nuts wollen den Pot maximal aufblasen, und deine Bluffs brauchen Fold Equity gegen genau die mittleren Hände, die dich schlagen. Dazu kommt der Frequenz-Effekt: Je größer die Bet, desto schlechtere Pot Odds bekommt der Caller – und desto mehr Bluffs darf deine Range im Gleichgewicht enthalten, ohne ausbeutbar zu werden. Deshalb existieren Overbets (Bets über Potgröße) praktisch nur aus polaren Ranges, typischerweise wenn deine Range die Nuts enthalten kann und die gegnerische "capped" ist.\n\n**Linear = klein bis mittel.** Eine Range voller guter, aber nicht übermächtiger Hände will Value von schlechteren Händen, Equity Denial (schwache Hände zum Folden ihrer Outs bringen) und einen kontrollierten Pot. Große Sizings würden genau die Hände rausfalten, von denen du Value willst, und den Pot gegen die Hände aufblasen, die dich schlagen.\n\nAls River-Richtwerte aus der Gleichgewichtslogik: Der Bluff-Anteil einer polaren Bet wächst mit dem Sizing – er entspricht genau den Pot Odds, die der Caller bekommt.',
          table: {
            headers: ['River-Sizing', 'Bluff-Anteil (GTO-Richtwert)', 'Value : Bluff'],
            rows: [
              ['50 % Pot', '25 %', '3 : 1'],
              ['75 % Pot', '30 %', 'ca. 2,3 : 1'],
              ['100 % Pot', '33 %', '2 : 1'],
              ['200 % Pot', '40 %', '1,5 : 1'],
            ],
          },
          example:
            'Rechenprobe für die Pot-Size-Bet: Der Caller zahlt 1 Einheit, um 3 zu gewinnen (Pot 1 + deine Bet 1 + sein Call 1), braucht also 33 % Equity. Besteht deine Range zu exakt einem Drittel aus Bluffs, gewinnt sein Bluff-Catcher genau 33 % – er ist indifferent zwischen Call und Fold.',
        },
        {
          heading: 'Typische polare Spots',
          body:
            'Polar konstruierst du deine Range immer dann, wenn die Mitte deiner Range lieber günstig zum Showdown will und die Extreme von Druck profitieren:\n\n- **River-Bets nach verpassten oder angekommenen Draws**: Am River gibt es keine Semi-Bluffs mehr – jede Bet ist Value oder Bluff. Wer dort bettet, tut es fast per Definition polar, und die Größe wählt er nach der Stärke seiner Value-Region.\n- **Overbets gegen capped Ranges**: Hat der Gegner durch seine Line starke Hände ausgeschlossen (z. B. Check hinter am Flop, Call statt Raise am Turn), während du die Nuts halten kannst, ist die Overbet das Werkzeug der Wahl – maximale Value, maximale Bluff-Kapazität.\n- **3-Bets out of position gegen kompetente Opens**: Aus den Blinds gegen ein Button-Open spielst du eher "3-Bet oder Fold" mit polarer Struktur – Value plus Blocker-Bluffs wie A5s –, weil Calls out of position gegen gute Spieler teuer sind.\n- **Check-Raises auf dynamischen Boards**: Ein Check-Raise verkörpert Sets, Two Pairs und starke Draws als Semi-Bluffs – Hantel-Struktur in Reinform.\n\nDas Lesegerät funktioniert auch umgekehrt: Overbettet ein solider Spieler den River, weißt du sofort – Nuts oder Luft, selten dazwischen. Deine mittelstarken Hände werden dadurch zu reinen Bluff-Catchern, und die Blocker-Kriterien aus der letzten Lektion übernehmen.',
          example:
            'Du checkst den Turn als Preflop-Caller, der Gegner checkt hinter – seine Range ist damit weitgehend capped. Auf einem River, der deine Straßen und Sets komplettieren kann, overbettest du polar: alle Nut-Combos plus die passende Menge Blocker-Bluffs. Seine Top-Pair-Hände stehen vor der Maximaldruck-Entscheidung.',
        },
        {
          heading: 'Typische lineare Spots',
          body:
            'Linear baust du deine Range, wenn Folds unwahrscheinlich oder unerwünscht sind – wenn du also primär von schlechteren Händen bezahlt werden willst:\n\n- **Value-3-Bets gegen loose Caller**: Gegen einen Spieler, der 3-Bets mit viel zu vielen Händen callt, sind Bluff-3-Bets sinnlos (er foldet ja nicht) und dünne Value-3-Bets Gold wert. Du 3-bettest linear: einfach alle Hände, die seine Calling-Range dominieren – bis hinunter zu AJs, KQs, 99.\n- **Kleine C-Bets auf trockenen Boards**: Auf Boards wie K♦ 7♣ 2♥, die deine Preflop-Range klar bevorzugen, bettet die moderne Strategie oft die (fast) gesamte Range klein – ein lineares Konstrukt: viele dünne Value-Hände und Equity-Denial-Bets, kaum reine Polarität.\n- **Dünne River-Value gegen Stationen**: Gegen Spieler, die mit jedem Paar callen, bettest du Top Pair mit mittlerem Kicker klein bis mittel für Value – eine Hand, die in polarer Logik ein Check wäre.\n- **Isolation-Raises gegen Limper**: Auch hier willst du keinen Fold, sondern den Pot mit der besseren Hand in Position aufbauen – also raist du eine lineare, dominierende Range.\n\nDie Grundregel zum Mitnehmen: **Gegen Spieler, die zu viel folden, polarisierst du. Gegen Spieler, die zu viel callen, spielst du linear.** Wer gegen eine Calling Station polar blufft oder gegen einen Nit linear dünn value-bettet, hat den Bauplan mit dem Gegner verwechselt.',
          tip: 'Prüfe dein River-Sizing mit einer Frage: "Von welchen Händen will ich gecallt werden – und callt dieser Gegner sie bei dieser Größe wirklich?" Wenn die Antwort nicht zusammenpasst, stimmt entweder Sizing oder Bauplan nicht.',
        },
      ],
      takeaways: [
        'Polar = Nuts plus Bluffs ohne Mitte ("Hantel"); linear/merged = lückenlos von oben nach unten, value-lastig ("Rampe").',
        'Sizing folgt der Struktur: polare Ranges betten groß bis Overbet, lineare Ranges klein bis mittel.',
        'Je größer die Bet, desto mehr Bluffs verträgt die Range im Gleichgewicht – bei Pot-Size am River rund ein Drittel (Value:Bluff = 2:1).',
        'Polar spielst du bei River-Bets, Overbets gegen capped Ranges, OOP-3-Bets und Check-Raises; linear bei Value-3-Bets gegen Caller, kleinen Range-C-Bets und dünner Value gegen Stationen.',
        'Exploit-Kompass: Gegen Overfolder polarisieren, gegen Overcaller linear und value-lastig spielen.',
      ],
      quiz: [
        {
          question: 'Woraus besteht eine polarisierte Betting-Range?',
          options: [
            'Aus den besten X Prozent aller Hände, lückenlos absteigend',
            'Aus sehr starken Value-Händen und Bluffs – ohne die mittelstarken Hände dazwischen',
            'Nur aus Bluffs mit guten Blockern',
            'Aus allen Händen mit mindestens 50 % Equity',
          ],
          correctIndex: 1,
          explanation:
            'Polar heißt: die beiden Enden des Spektrums. Die Mitte fehlt, weil mittelstarke Hände von großen Bets nichts gewinnen – sie checken lieber Richtung Showdown.',
        },
        {
          question: 'Warum gehören Overbets fast ausschließlich zu polaren Ranges?',
          options: [
            'Weil Overbets nur mit den Nuts erlaubt sind',
            'Weil mittelstarke Hände bei riesigen Sizings weder Value bekommen noch bessere Hände folden – nur Nuts und Bluffs profitieren, und das große Sizing erlaubt zugleich mehr Bluffs',
            'Weil Overbets die Varianz senken',
            'Weil lineare Ranges nie am River betten',
          ],
          correctIndex: 1,
          explanation:
            'Eine Overbet nützt genau zwei Handklassen: Nuts (maximaler Value) und Bluffs (maximaler Druck, und die schlechten Pot Odds des Callers erlauben im Gleichgewicht einen höheren Bluff-Anteil). Die Mitte verliert bei diesem Sizing in beide Richtungen.',
        },
        {
          question: 'Wie hoch ist der GTO-Bluff-Anteil einer Pot-Size-Bet am River ungefähr?',
          options: ['25 %', '33 %', '50 %', '67 %'],
          correctIndex: 1,
          explanation:
            'Der Caller bekommt bei Pot-Size 2:1 auf seinen Call und braucht 33 % Equity. Besteht die Betting-Range zu einem Drittel aus Bluffs, ist sein Bluff-Catcher exakt indifferent – das ist das Gleichgewichtsverhältnis von 2:1 Value zu Bluff.',
        },
        {
          question: 'Ein looser Spieler callt 3-Bets mit viel zu vielen dominierten Händen. Wie baust du deine 3-Bet-Range gegen ihn?',
          options: [
            'Polar: Premiums plus A5s-Bluffs',
            'Linear: alle Hände, die seine Calling-Range dominieren, auch dünnere Value wie AJs oder 99 – und praktisch keine Bluffs',
            'Gar nicht 3-betten, nur callen',
            'Nur AA und KK, um sicherzugehen',
          ],
          correctIndex: 1,
          explanation:
            'Gegen jemanden, der nicht foldet, verlieren Bluff-3-Bets ihren Zweck, während dünne Value-3-Bets stark profitieren. Die richtige Struktur ist linear und value-lastig – das Gegenteil der polaren Standardkonstruktion gegen gute Regs.',
        },
        {
          question: 'Ein solider Reg overbettet den River, nachdem er den Turn stark durchgebettet hat. Was folgt für deine mittelstarken Hände?',
          options: [
            'Sie sind jetzt klare Value-Raises',
            'Sie werden zu reinen Bluff-Catchern – seine Range ist Nuts oder Bluff, und Blocker-Kriterien entscheiden über Call oder Fold',
            'Sie sind automatische Calls wegen der Pot Odds',
            'Sie sind automatische Folds, weil Overbets nie geblufft werden',
          ],
          correctIndex: 1,
          explanation:
            'Eine Overbet signalisiert bei kompetenten Spielern eine polare Range. Deine Mitte schlägt alle seine Bluffs und verliert gegen seinen gesamten Value – genau die Definition eines Bluff-Catchers, bei dem Removal-Überlegungen den Ausschlag geben.',
        },
      ],
    },
    {
      id: 'm5-l5',
      title: 'Turnierstrategie & ICM',
      duration: 12,
      intro:
        'Turniere spielen sich nach denselben Kartenregeln wie Cash Games – aber nach völlig anderer Ökonomie: Blinds steigen, Stacks werden flach, und Chips lassen sich nicht mehr eins zu eins in Geld übersetzen. Wer Cash-Game-Logik unverändert ins Turnier trägt, verbrennt Equity an genau den teuersten Stellen.',
      sections: [
        {
          heading: 'Was Turniere anders macht',
          body:
            'Drei strukturelle Unterschiede prägen jede Turnierentscheidung:\n\n- **Steigende Blinds**: Im Cash Game bleibt die Stacktiefe konstant bei etwa 100bb – im Turnier schrumpft dein Stack in Big Blinds gemessen permanent, selbst wenn du keinen Pot spielst. Abwarten hat einen Preis; kontrollierte Aggression (vor allem Blind-Steals) wird zur Pflicht.\n- **Antes**: Ab den mittleren Phasen zahlt der Tisch zusätzlich Antes (meist als Big Blind Ante). Der Preflop-Pot ist dadurch deutlich größer, ein Steal gewinnt sofort mehr – Open-Ranges und Big-Blind-Verteidigung werden entsprechend weiter.\n- **Flache Stacks und keine Nachkäufe**: Während 100bb+ im Cash Game Raum für Multi-Street-Manöver lassen, spielst du im Turnier oft mit 15–40bb. Implied Odds schrumpfen (Set-Mining und spekulative Calls verlieren an Wert), die Preflop-Entscheidung wird zur Hauptentscheidung – und ein verlorener Stack bedeutet das Aus, nicht ein Rebuy.\n\nDazu kommt der fundamentalste Unterschied: Bezahlt wird nicht pro Chip, sondern nach Platzierung. Dieser Umstand – formalisiert im ICM – verändert die Mathematik jeder großen Entscheidung und ist Thema der letzten Abschnitte.',
          tip: 'Beobachte im Turnier permanent zwei Zahlen: deine eigene Stacktiefe in Big Blinds und die der Gegner am Tisch. Fast jede strategische Anpassung hängt an diesen Werten, nicht an der absoluten Chipzahl.',
        },
        {
          heading: 'Strategie nach Stacktiefe',
          body:
            'Die Stacktiefe diktiert, welche Werkzeuge dir überhaupt zur Verfügung stehen:\n\n- **Über 60bb**: Nahe am Cash-Game-Spiel – volle Range-Vielfalt, Postflop-Spielraum, spekulative Hände behalten ihren Wert.\n- **25–60bb**: Vorsicht bei aufgeblähten Pötten: Eine 3-Bet plus Call bindet schnell ein Viertel des Stacks. 4-Bets committen faktisch; Hände wie kleine Paare und Suited Connectors verlieren an Implied Odds.\n- **15–25bb**: Die 3-Bet wird oft zum All-in ("3-Bet-Shove" oder Resteal) – flach genug, um Fold Equity plus Showdown-Equity zu kombinieren, zu flach für Raise-Call-Manöver.\n- **Unter 15–20bb**: Die **Push/Fold-Tendenz** übernimmt: Erst raisen und dann auf einen Shove folden verbrennt zu viel vom Stack, Postflop out of position ist mit Mini-Stacks kaum profitabel spielbar. Unter etwa 10bb ist Open-Shove oder Fold fast immer die beste Wahl.\n\nGrundsätze fürs Shoving: **Position schlägt Kartenstärke** – als grobe Nash-Orientierung shovest du mit 10bb vom Button deutlich über 40 % der Hände, aus früher Position im 6-max eher 15–20 %. Der erste Raiser hat den Vorteil der Fold Equity; **Call-Ranges sind darum immer deutlich enger als Shove-Ranges**. Und: Lieber eine Runde zu früh mit Fold Equity shoven als geblindet auf 4bb ohne Druckmittel.',
          example:
            'Blinds 500/1.000 mit Big Blind Ante, du hältst am Button 9.500 Chips (unter 10bb) und A♦ 7♣. Ein Standard-Raise auf 2.200 wäre ein Fehler: Nach einem Shove aus den Blinds müsstest du meist folden und hättest ein Viertel deines Stacks verschenkt. Korrekt ist der Open-Shove – A7o liegt mit dieser Tiefe am Button klar in der Shove-Range.',
        },
        {
          heading: 'ICM: Warum Chips nicht linear Geld sind',
          body:
            'Das **Independent Chip Model (ICM)** übersetzt Chipstacks in Geld-Equity, also in den fairen Anteil am Preisgeld. Die Kernerkenntnis: **Der Geldwert von Chips wächst unterproportional** – jeder zusätzliche Chip ist weniger wert als der vorherige.\n\nDer Grund liegt in der Auszahlungsstruktur: Bezahlt werden Platzierungen, nicht Chips. Wer alle Chips gewinnt, bekommt trotzdem nur den ersten Preis – typischerweise 20–30 % des Preispools, nicht 100 %. Der Rest des Werts steckt in den Plätzen darunter, und auf die haben auch kurze Stacks noch Anspruch.\n\nDas Zahlenbeispiel macht es greifbar: 9-Spieler-Sit-and-Go, Auszahlung 50/30/20, jeder startet mit gleich vielen Chips – also je 11,1 % Equity am Preispool. Verdoppelst du in der ersten Hand deinen Stack, hast du doppelt so viele Chips, aber nach ICM nur rund 20 % Equity statt 22,2 %. Umgekehrt heißt das: Der Spieler, der sein Turnierleben riskierte, hat mehr Geld-Equity aufs Spiel gesetzt, als er gewinnen konnte.\n\nDaraus folgt die wichtigste Turnierregel: **Ein Chip-EV-neutraler Flip ist nach ICM ein Verlustgeschäft.** Knappe Spots, die im Cash Game automatische Calls wären, werden im Turnier zu Folds – und zwar umso deutlicher, je näher die nächste Auszahlungsgrenze rückt.',
          tip: 'Merksatz: Verlierst du deinen Stack, verlierst du 100 % deiner Turnier-Equity – verdoppelst du ihn, gewinnst du weniger als 100 % dazu. Diese Asymmetrie ist ICM in einem Satz.',
        },
        {
          heading: 'Risk Premium: Bubble und Final Table',
          body:
            'Die Differenz zwischen der Equity, die ein Call nach reinem Chip-EV bräuchte, und der, die er nach ICM braucht, heißt **Risk Premium**. Sie ist der Aufpreis dafür, dein Turnierleben zu riskieren – und sie ist nicht konstant, sondern explodiert an zwei Stellen:\n\n**Die Bubble** (kurz vor den bezahlten Plätzen): Hier ist das Risk Premium am höchsten, oft 5–15 Prozentpunkte zusätzliche Equity, die ein Call braucht. Die praktischen Folgen: Big Stacks shoven und raisen fast ungestraft, weil niemand ohne Monster callen will. Mittlere Stacks leiden am meisten – sie haben viel zu verlieren und müssen am tightesten spielen. Kurze Stacks bleiben vergleichsweise frei, weil ihr Restwert klein ist.\n\n**Der Final Table**: Jeder Bust eines anderen Spielers bedeutet für dich einen Pay Jump. Deshalb gilt: Mit kurzem Stack kann es korrekt sein, sehr tight zu warten, während zwei andere Kurzstacks um ihr Überleben kämpfen ("Laddern"). Konfrontationen zwischen zwei großen Stacks sind nach ICM besonders teuer – der lachende Dritte ist immer der, der zuschaut.\n\nExtrembeispiel Satellite: Werden fünf gleiche Tickets an die letzten fünf von sechs Spielern vergeben, kann es korrekt sein, **sogar AA vor dem Flop zu folden**, wenn dich ein größerer Stack coverst – dein möglicher Zugewinn ist minimal, dein Risiko total. Kein anderes Beispiel zeigt so klar, dass Chips und Geld zwei verschiedene Währungen sind.',
          example:
            'Bubble eines Turniers, du hältst Q♠ Q♥ im Big Blind mit 25bb. Der Chipleader shovt vom Button, ein Mini-Stack mit 2bb sitzt am Nachbartisch. Nach Chip-EV ist QQ ein Standard-Call – nach ICM kann der Fold korrekt sein: Gegen seine weite Range gewinnst du zwar meist Chips, aber das Risk Premium der Bubble frisst den Geld-EV des Calls auf, während der sichere Min-Cash greifbar ist.',
        },
        {
          heading: 'Turnier-Realität: Varianz und Bankroll',
          body:
            'Zum Schluss der unbequeme Teil: Turniere sind die varianzreichste Form des Pokers. Die Auszahlungsstruktur ist extrem kopflastig – der Großteil des Preispools steckt in den obersten Plätzen, die du auch als exzellenter Spieler nur selten erreichst. Selbst langfristige Gewinner erleben Durststrecken von Dutzenden, in großen Feldern Hunderten von Turnieren ohne nennenswerten Cash. Das ist kein Zeichen schlechten Spiels, sondern mathematische Normalität.\n\nDaraus folgen drei Konsequenzen:\n\n- **Bankroll**: Für Multi-Table-Turniere gelten 100+ Buy-ins als vernünftige Untergrenze, bei großen Feldern eher deutlich mehr. Wer mit 20 Buy-ins MTTs spielt, spielt gegen die Varianz, nicht gegen die Gegner.\n- **Bewertung über Entscheidungen, nicht Ergebnisse**: Ein einzelnes Turnierergebnis sagt fast nichts über deine Spielstärke. Bewerte dich an der Qualität deiner Push/Fold-, ICM- und Bubble-Entscheidungen – die Resultate folgen erst über sehr große Stichproben.\n- **Verantwortungsvoller Rahmen**: Spiele nur mit Geld, dessen Verlust du problemlos verkraftest, setze dir Limits für Buy-ins und Spielzeit, und mache Pausen nach tiefen Runs – die emotionale Achterbahn eines Deep Runs mit Bubble-Bust gehört zu den tiltanfälligsten Situationen im Poker überhaupt.\n\nWer diese Rahmenbedingungen akzeptiert, kann die strategische Tiefe von Turnieren genießen, ohne dass die Varianz das Urteilsvermögen oder die Finanzen beschädigt.',
          tip: 'Führe ein Turnier-Log mit Buy-ins, Cashes und den zwei bis drei wichtigsten Entscheidungen pro Turnier. Es objektiviert deine Entwicklung – und schützt dich davor, Varianz mit Können (oder Unvermögen) zu verwechseln.',
        },
      ],
      takeaways: [
        'Steigende Blinds, Antes und flache Stacks machen Turniere zu einem anderen Spiel: Warten kostet, Steals gewinnen mehr, Preflop dominiert.',
        'Die Stacktiefe diktiert die Werkzeuge – unter 15–20bb übernimmt die Push/Fold-Logik, und Shove-Ranges sind deutlich weiter als Call-Ranges.',
        'ICM: Chips wachsen unterproportional im Geldwert – ein früher Double-up im 9er-SNG bringt ca. 20 % statt 22,2 % Equity.',
        'Das Risk Premium macht knappe Calls auf der Bubble und am Final Table zu Folds; Big Stacks üben Druck aus, mittlere Stacks leiden am meisten.',
        'Turniere haben extreme Varianz: 100+ Buy-ins Bankroll, Entscheidungen statt Ergebnisse bewerten, feste Limits setzen.',
      ],
      quiz: [
        {
          question: 'Warum ist ein Chip-EV-neutraler Coinflip um deinen gesamten Stack in einem Turnier meist ein Geld-EV-Verlust?',
          options: [
            'Weil Flips in Turnieren seltener gewonnen werden',
            'Weil Chips unterproportional in Geld-Equity wachsen: Der verdoppelte Stack ist weniger als doppelt so viel wert, der verlorene Stack kostet 100 %',
            'Weil die Rake in Turnieren höher ist',
            'Weil man nach einem Flip tighter spielen muss',
          ],
          correctIndex: 1,
          explanation:
            'Das ist der Kern von ICM: Die Auszahlung erfolgt nach Platzierungen, deshalb ist jeder zusätzliche Chip weniger wert als der vorherige. Ein 50/50-Flip tauscht 100 % deiner Equity gegen einen Zugewinn von weniger als 100 %.',
        },
        {
          question: 'Du startest ein 9er-SNG (Auszahlung 50/30/20) mit 11,1 % Equity und verdoppelst in Hand eins. Wie viel Equity hast du nach ICM ungefähr?',
          options: ['22,2 %', 'ca. 20 %', '25 %', 'Genau 16,7 %'],
          correctIndex: 1,
          explanation:
            'Doppelte Chips bedeuten nicht doppelte Equity: Nach ICM landet der verdoppelte Stack bei rund 20 % statt der linearen 22,2 %. Die Differenz ist der Preis der gedeckelten Auszahlungsstruktur.',
        },
        {
          question: 'Mit 9bb am Button hältst du A♦ 7♣. Was ist die beste Standardaktion?',
          options: [
            'Fold – A7o ist zu schwach für Aggression',
            'Min-Raise mit Fold-Absicht gegen einen Shove',
            'Open-Shove – bei dieser Tiefe gehört die Hand am Button klar in die Push-Range',
            'Limpen und den Flop ansehen',
          ],
          correctIndex: 2,
          explanation:
            'Unter etwa 10bb dominiert Push/Fold: Raise-Fold verschenkt einen relevanten Teil des Stacks, Postflop-Spielraum existiert kaum. A7o liegt am Button mit dieser Tiefe deutlich innerhalb der (über 40 % weiten) Nash-Shove-Range.',
        },
        {
          question: 'Wer leidet auf der Bubble am stärksten unter dem ICM-Druck?',
          options: [
            'Der Chipleader',
            'Die kürzesten Stacks',
            'Die mittleren Stacks – sie haben viel zu verlieren und müssen die knappsten Spots aufgeben',
            'Alle gleich, ICM wirkt symmetrisch',
          ],
          correctIndex: 2,
          explanation:
            'Big Stacks riskieren relativ wenig und können Druck ausüben; Kurzstacks haben wenig Restwert zu schützen. Mittlere Stacks tragen das höchste Risk Premium: Ein verlorener Flip kostet sie den fast sicheren Geldplatz.',
        },
        {
          question: 'In welchem Szenario kann es korrekt sein, AA preflop zu folden?',
          options: [
            'Nie – AA ist immer ein Call',
            'Auf der Bubble eines Satellites mit gleichwertigen Tickets, wenn ein größerer Stack dich covert: minimaler Zugewinn, totales Risiko',
            'Immer, wenn drei Spieler all-in sind',
            'Am Final Table eines normalen Turniers grundsätzlich',
          ],
          correctIndex: 1,
          explanation:
            'In Satellites zählt nur das Überschreiten der Ticketlinie – zusätzliche Chips haben fast keinen Wert. Wenn ein Call dein Turnierleben riskiert, aber kaum Equity hinzugewinnen kann, ist selbst AA nach ICM ein Fold. Das Extrembeispiel zeigt: Chips und Geld sind verschiedene Währungen.',
        },
        {
          question: 'Warum gelten für Multi-Table-Turniere deutlich höhere Bankroll-Anforderungen als für Cash Games?',
          options: [
            'Weil die Buy-ins immer höher sind',
            'Weil die kopflastige Auszahlungsstruktur extreme Varianz erzeugt – auch Gewinner cashen selten groß und erleben lange Durststrecken',
            'Weil man in Turnieren nicht rebuyen darf',
            'Weil ICM die Winrate halbiert',
          ],
          correctIndex: 1,
          explanation:
            'Der Großteil des Preispools steckt in den Top-Plätzen, die selbst starke Spieler nur selten erreichen. Lange Strecken ohne nennenswerten Cash sind mathematisch normal – deshalb sind 100+ Buy-ins die vernünftige Untergrenze.',
        },
      ],
    },
    {
      id: 'm5-l6',
      title: 'Gegnertypen & Stats',
      duration: 10,
      intro:
        'Die profitabelste Fähigkeit im Poker ist nicht die perfekte eigene Strategie, sondern das schnelle, treffsichere Einordnen der Gegner. Diese Lektion gibt dir die fünf Grundtypen, die wichtigsten Kennzahlen – und eine Methode, um auch live ohne jede Software Profile zu bilden.',
      sections: [
        {
          heading: 'Die fünf Grundtypen',
          body:
            'Spielertypen sind Schubladen – aber nützliche: Sie verdichten hunderte Einzelbeobachtungen zu einer handlungsfähigen Vorhersage. Die Klassiker entstehen aus zwei Achsen: tight vs. loose (wie viele Hände jemand spielt) und passiv vs. aggressiv (ob er eher callt oder eher bettet und raist).\n\n- **TAG** (tight-aggressiv): der solide Standard-Reg. Wenige, aber starke Hände mit Initiative.\n- **LAG** (loose-aggressiv): spielt viele Hände mit permanentem Druck. In guten Händen der schwierigste Gegner, in schlechten ein Geldautomat mit Selbstzerstörungsknopf.\n- **Nit**: extrem tight und risikoscheu. Aggression bedeutet fast immer eine Monster-Hand.\n- **Calling Station**: loose-passiv – callt mit allem, raist fast nie, foldet selten. Der profitabelste Gegnertyp, wenn man richtig anpasst.\n- **Maniac**: hyperaggressiv ohne Plan. Raist und blufft weit jenseits jeder Balance.\n\nWichtig: Typen sind Startpunkte, keine Urteile auf Lebenszeit. Ein TAG kann nach einem verlorenen Buy-in zum Maniac tilten; ein vermeintlicher Nit taut nach zwei Bier auf. Aktualisiere dein Profil laufend – die Schublade hilft nur, solange der Spieler auch drinliegt.',
          table: {
            headers: ['Typ', 'VPIP/PFR (grob)', 'Erkennungsmerkmale', 'Dein Exploit'],
            rows: [
              ['TAG', '23/19', 'selektiv, Initiative, positionsbewusst', 'wenig angreifbar – Ranges respektieren, capped Spots attackieren'],
              ['LAG', '28/23', 'viele Opens und 3-Bets, ständiger Druck', 'in Position callen, leichter 4-betten, Bluff-Catcher stärker gewichten'],
              ['Nit', '14/10', 'foldet fast alles, raist nur Premiums', 'Blinds konsequent stehlen, auf Aggression fast alles folden'],
              ['Calling Station', '45/8', 'callt jede Street, raist fast nie', 'dünn und groß value-betten, niemals bluffen'],
              ['Maniac', '55/40', 'raist blind drauflos, riesige Sizings', 'Premiums callen lassen statt raisen, auscallen, nicht ausbluffen lassen'],
            ],
          },
          tip: 'Gib jedem Gegner nach zwei, drei Orbits ein Arbeits-Label – und notiere, welche Beobachtung es widerlegen würde. So bleibt dein Read eine Hypothese statt ein Vorurteil.',
        },
        {
          heading: 'VPIP und PFR: Das Fundament jedes Profils',
          body:
            '**VPIP** ("Voluntarily Put Money In Pot") misst, in wie viel Prozent der Hände ein Spieler freiwillig Geld investiert – durch Call oder Raise, Blinds zählen nicht. **PFR** ("Preflop Raise") misst, wie oft er dabei preflop raist. Zusammen gelesen sind sie das Röntgenbild eines Spielers.\n\nRichtwerte für 6-max Online-Cash:\n\n- Solide Regs: VPIP 21–26, PFR jeweils 2–4 Punkte darunter (z. B. 24/20).\n- Unter 18 VPIP: tight bis nitty. Über 32: loose. Über 40: fast immer ein Freizeitspieler.\n\nDie wertvollste Information steckt im **Abstand zwischen VPIP und PFR**: Er zeigt, wie oft jemand passiv nur callt. Ein 24/20 spielt fast alle Hände mit Initiative – gefährlich. Ein 35/10 callt permanent ohne Plan – der klassische Fisch, dessen weite, schwache Calling-Ranges du mit Value-Händen isolierst.\n\nEntscheidend ist außerdem die **Stichprobengröße**: VPIP und PFR sagen ab etwa 50–100 Händen etwas Belastbares aus. Wer nach acht Händen "24/20, solider Reg" liest, interpretiert Rauschen. Als Faustregel: Erst wenn eine Stat auf mehreren Dutzend Gelegenheiten basiert, darfst du strategisch auf sie wetten.',
          example:
            'Zwei Gegner mit identischem VPIP 28: Der eine ist 28/24 – ein LAG, der dich mit 3-Bets und Barrels unter Druck setzen wird. Der andere ist 28/6 – ein passiver Caller, gegen den du dünn value-bettest und dem du keine großen Bluffs zahlst. Gleiche erste Zahl, entgegengesetzte Anpassung: Erst das Paar aus VPIP und PFR ergibt das Bild.',
        },
        {
          heading: 'AF und 3-Bet%: Aggression messen',
          body:
            'Der **Aggression Factor (AF)** misst das Postflop-Verhalten: AF = (Bets + Raises) / Calls. Ein AF von 2–3 gilt als gesund ausbalanciert. Unter 1,5 spielt jemand passiv – seine Bets darfst du ernst nehmen, seine Calls sind schwach und breit. Über 4 ist jemand hyperaggressiv – seine Betting-Range enthält viele Bluffs, deine Bluff-Catcher steigen im Wert.\n\nDie **3-Bet%** zeigt, wie oft jemand gegen ein Open-Raise re-raist. Moderne Richtwerte für 6-max:\n\n- 7–9 %: gesunde, gemischte 3-Bet-Range (Value plus Bluffs wie A5s).\n- Unter 4 %: fast nur Premiums. Gegen die 3-Bet dieses Spielers foldest du Hände wie AQo oder 99 ohne schlechtes Gewissen – und 4-Bet-Bluffs sind Geldverbrennung.\n- Über 11 %: sehr light. Hier weitet sich deine Verteidigung: mehr 4-Bets (auch als Bluff mit Blocker-Händen) und mehr Calls in Position.\n\nAuch hier gilt die Stichproben-Warnung, sogar verschärft: Eine 3-Bet-Gelegenheit entsteht nur in einem Bruchteil der Hände. Unter 300–500 Händen ist eine 3-Bet% kaum belastbar; der AF braucht ebenfalls einige hundert Hände. Bis dahin wiegt eine einzige gezeigte Hand am Showdown oft schwerer als die Zahl im HUD (Heads-up Display, die eingeblendete Statistikanzeige beim Online-Spiel).',
          tip: 'Priorisiere Stats nach Stabilität: VPIP/PFR zuerst (schnell aussagekräftig), dann Fold-to-C-Bet und 3-Bet%, zuletzt Feinheiten wie River-Aggression. Und ein Showdown, der eine Stat bestätigt oder widerlegt, ist mehr wert als zehn weitere Hände Sample.',
        },
        {
          heading: 'Live ohne Stats: Profile aus Beobachtung',
          body:
            'Am Live-Tisch gibt es kein HUD – aber mehr Informationen, als die meisten Spieler abrufen. So baust du systematisch Profile:\n\n- **Showdowns sind Gold**: Jede aufgedeckte Hand verrät eine komplette Line rückwärts. Wer 74s aus früher Position zeigt, hat dir seine gesamte Range-Philosophie offenbart. Rekonstruiere nach jedem Showdown kurz: Wie hat er diese Hand auf jeder Street gespielt?\n- **Zähle gespielte Hände pro Orbit**: Ein Orbit hat am vollen Tisch neun Hände. Wer drei bis vier davon spielt, liegt bei VPIP 35–45 – dein Live-Ersatz für die Stat. Zwei Orbits Beobachtung genügen für eine erste Einordnung.\n- **Achte auf das Wie**: Limpt jemand oder raist er? Wie groß sind seine Raises – und ändern sich die Sizings mit der Handstärke? Viele Live-Spieler betten ihre starken Hände groß und ihre schwachen klein (oder umgekehrt) und merken es nie.\n- **Kontext-Signale**: Einkaufshöhe (Minimum-Buy-in deutet oft auf Vorsicht oder schmale Bankroll), Umgang mit Chips, Gesprächigkeit nach gewonnenen und verlorenen Pötten, Trinkverhalten, sichtbares Tilt-Verhalten nach Bad Beats.\n\nSolange du keine individuellen Reads hast, spielst du gegen den **Populations-Default** für Live Low Stakes: zu loose und zu passiv preflop, zu viele Calls postflop, große Bets und Raises fast immer Value. Das ist exakt das Calling-Station-Anpassungspaket – dünn value-betten, wenig bluffen, Aggression respektieren – bis ein Spieler dir individuell etwas anderes zeigt.',
          example:
            'Neuer Tisch, Live 1/2: Nach zwei Orbits hast du notiert: Spieler A limpt jede zweite Hand und callt jede C-Bet (Station – dünn value-betten). Spielerin B hat in 18 Händen zweimal geraist und sonst gefoldet (tight – ihre Raises respektieren, ihre Blinds stehlen). Spieler C raist jede dritte Hand auf das Fünffache (Maniac-Verdacht – Premiums auscallen lassen). Drei verwertbare Profile, null Software.',
        },
      ],
      takeaways: [
        'Die fünf Grundtypen (TAG, LAG, Nit, Calling Station, Maniac) entstehen aus den Achsen tight/loose und passiv/aggressiv – jeder hat ein festes Exploit-Paket.',
        'VPIP und PFR zusammen sind das Röntgenbild: Solide 6-max-Regs liegen um 21–26 VPIP mit kleinem Abstand zum PFR; ein großer Abstand verrät passives Callen.',
        'AF 2–3 ist gesund; 3-Bet% unter 4 heißt Premiums-only, über 11 heißt light – aber alle Stats brauchen ausreichende Samples (3-Bet% erst ab mehreren hundert Händen).',
        'Live ersetzt Beobachtung das HUD: Showdowns rekonstruieren, gespielte Hände pro Orbit zählen, Sizing-Muster und Kontext-Signale lesen.',
        'Ohne individuelle Reads gilt der Low-Stakes-Populations-Default: viel Value, wenig Bluffs, große Aggression respektieren.',
      ],
      quiz: [
        {
          question: 'Ein Gegner hat über 400 Hände die Stats 45/8 mit niedrigem AF. Welcher Typ und welcher Exploit?',
          options: [
            'LAG – tighter spielen und Bluff-Catcher aufwerten',
            'Calling Station – dünn und groß value-betten, praktisch nie bluffen',
            'Nit – Blinds stehlen und auf Aggression folden',
            'TAG – solide dagegenhalten und capped Spots angreifen',
          ],
          correctIndex: 1,
          explanation:
            '45 % gespielte Hände bei nur 8 % Raises und wenig Postflop-Aggression ist das Profil des loose-passiven Callers. Gegen ihn gewinnen dünne Value-Bets maximal – und Bluffs verlieren, weil er nicht foldet.',
        },
        {
          question: 'Was verrät ein großer Abstand zwischen VPIP und PFR (z. B. 35/10)?',
          options: [
            'Der Spieler 3-bettet zu viel',
            'Der Spieler spielt viele Hände passiv als Call statt mit Initiative – ein typisches Schwächesignal',
            'Der Spieler ist besonders tricky und balanced',
            'Der Spieler foldet zu oft preflop',
          ],
          correctIndex: 1,
          explanation:
            'Die Differenz VPIP minus PFR ist der Anteil passiv gespielter Hände. Ein großer Abstand bedeutet weite, schwache Calling-Ranges ohne Initiative – die du mit Value-Raises isolierst und auf die du dünn value-bettest.',
        },
        {
          question: 'Ein Spieler mit 3-Bet% von 3 (über großes Sample) 3-bettet dein Cutoff-Open. Du hältst AQo. Beste Reaktion?',
          options: [
            'Fold – seine 3-Bet-Range besteht fast nur aus Premiums, gegen die AQo dominiert ist',
            '4-Bet als Bluff, um Druck aufzubauen',
            'Call und auf jedem Ass-Flop stacken',
            'Call, weil AQo gegen jede 3-Bet-Range vorne liegt',
          ],
          correctIndex: 0,
          explanation:
            'Eine 3-Bet% von 3 bedeutet praktisch QQ+/AK. Dagegen ist AQo massiv dominiert (AK) oder weit hinten (QQ+), und 4-Bet-Bluffs funktionieren gegen eine Premium-Range nicht. Der disziplinierte Fold ist klar am profitabelsten.',
        },
        {
          question: 'Wie schätzt du live ohne Software den VPIP eines Gegners ab?',
          options: [
            'An der Höhe seines Buy-ins',
            'Indem du zählst, wie viele Hände er pro Orbit freiwillig spielt',
            'An seiner Sitzposition am Tisch',
            'Gar nicht – ohne HUD ist VPIP nicht einschätzbar',
          ],
          correctIndex: 1,
          explanation:
            'Ein Orbit am vollen Tisch umfasst neun Hände: Wer drei bis vier davon spielt, liegt grob bei VPIP 35–45. Zwei, drei Orbits konzentrierter Beobachtung liefern damit denselben Kern-Read wie ein HUD.',
        },
        {
          question: 'Warum solltest du eine 3-Bet% von 15 nach nur 40 Händen NICHT als "light 3-bettor" interpretieren?',
          options: [
            'Weil 15 % eine normale 3-Bet-Frequenz ist',
            'Weil in 40 Händen nur wenige 3-Bet-Gelegenheiten vorkommen – die Stat ist fast reines Rauschen und braucht mehrere hundert Hände',
            'Weil 3-Bet% nur live aussagekräftig ist',
            'Weil man 3-Bets nicht exploiten kann',
          ],
          correctIndex: 1,
          explanation:
            'Eine 3-Bet-Situation entsteht nur in einem Bruchteil aller Hände; nach 40 Händen basiert die Zahl auf einer Handvoll Gelegenheiten. Frequenz-Stats wie 3-Bet% werden erst ab etwa 300–500 Händen belastbar – vorher wiegt ein gezeigter Showdown schwerer.',
        },
      ],
    },
  ],
};

export default m5;
