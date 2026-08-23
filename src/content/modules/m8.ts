import type { Module } from '../types';

const m8: Module = {
  id: 'm8',
  title: 'Online-Poker',
  subtitle: 'Software, Multi-Tabling und der digitale Vorteil',
  icon: '💻',
  level: 'Fortgeschritten',
  lessons: [
    {
      id: 'm8-l1',
      title: 'Online erfolgreich starten',
      duration: 9,
      intro:
        'Online-Poker bietet dir mehr Hände, mehr Auswahl und bessere Lernwerkzeuge als jedes Live-Casino. Diese Lektion zeigt dir, wie du seriös, klein und mit realistischen Erwartungen startest.',
      sections: [
        {
          heading: 'Nur bei seriösen, lizenzierten Anbietern spielen',
          body:
            'Bevor es um Strategie geht, kommt die wichtigste Entscheidung: **wo** du spielst. Spiele ausschließlich bei lizenzierten Anbietern. In Deutschland ist die **GGL** (Gemeinsame Glücksspielbehörde der Länder) zuständig – sie führt eine öffentliche Liste der erlaubten Anbieter (Whitelist). Ein Anbieter mit deutscher Lizenz muss Spielerschutz-Standards erfüllen: Alterskontrolle (**18+**, ohne Ausnahme), Anbindung an das Sperrsystem **OASIS**, Einzahlungslimits und geprüfte Zufallszahlengeneratoren.\n\nWarum ist das so wichtig? Bei unregulierten Seiten trägst du Risiken, die nichts mit Poker zu tun haben: verzögerte oder verweigerte Auszahlungen, unklarer Umgang mit deinen Daten und kein Ansprechpartner bei Streitfällen. Dein Skill am Tisch nützt dir nichts, wenn dein Guthaben nicht sicher ist.\n\nPrüfe vor der Registrierung:\n\n- **Lizenz**: Steht der Anbieter auf der offiziellen Whitelist der GGL (bzw. hat er eine seriöse EU-Lizenz, falls du außerhalb Deutschlands spielst)?\n- **Auszahlung**: Gibt es nachvollziehbare, dokumentierte Auszahlungswege?\n- **Limits und Selbstschutz**: Kannst du Einzahlungs- und Verlustlimits selbst setzen?\n\nSetze dir direkt bei der Anmeldung ein Einzahlungslimit, das zu deiner Bankroll passt – nicht erst, wenn es nötig wird.',
          tip: 'Behandle dein Pokerkonto wie ein separates Hobby-Budget: Nur Geld einzahlen, dessen Verlust du problemlos verkraften kannst. Poker ist ein Skill-Spiel mit hoher Varianz – kein Einkommen und keine Geldanlage.',
        },
        {
          heading: 'Starte auf Micro-Limits',
          body:
            'Auch wenn du live schon Erfahrung hast: Starte online auf den kleinsten Limits, den **Micro-Limits** (z. B. NL2 oder NL5 – die Zahl steht für den maximalen Buy-in in Cent bzw. Euro, Standard-Buy-in ist 100 Big Blinds).\n\nDafür gibt es drei Gründe:\n\n- **Lernkosten minimieren**: Deine ersten tausenden Online-Hände sind voller Anpassungsfehler – neue Software, neues Tempo, neue Gegnertypen. Diese Fehler sollen Cents kosten, nicht Euros.\n- **Technik automatisieren**: Buttons, Bet-Slider, Time-Bank und Lobby müssen in Fleisch und Blut übergehen, bevor echtes Geld auf dem Spiel steht.\n- **Ehrliche Standortbestimmung**: Ein Tracker (dazu später mehr) zeigt dir nach einer größeren Stichprobe, ob du das Limit wirklich schlägst. Erst dann ist ein Aufstieg sinnvoll.\n\nDer Aufstieg folgt deiner Bankroll, nicht deinem Ego: Mit einer konservativen Regel wie **mindestens 25–40 Buy-ins** für das aktuelle Limit bist du gegen normale Downswings abgesichert. Wer NL2 über eine ordentliche Stichprobe klar schlägt und die Bankroll für NL5 hat, steigt auf – und geht bei einem größeren Downswing diszipliniert wieder ein Limit runter. Dieses Auf und Ab ist normal und kein Rückschritt.',
          example:
            'Du zahlst 50 € ein und spielst NL2 (Buy-in 2 €). Das sind 25 Buy-ins – genug Puffer für normale Schwankungen. Erst wenn die Bankroll durch Gewinne auf etwa 125–200 € gewachsen ist, ist NL5 dran.',
        },
        {
          heading: 'Cash Game, Sit & Go oder MTT?',
          body:
            'Online hast du drei Grundformate zur Auswahl – und sie unterscheiden sich stark in Zeitbedarf, Varianz und den Skills, die sie trainieren:\n\n- **Cash Game**: Du kannst jederzeit ein- und aussteigen, die Blinds bleiben konstant, Stacks sind meist um 100bb. Ideal zum Erlernen fundamentaler Postflop-Strategie – und das Default-Format dieser App.\n- **Sit & Go (SNG)**: Ein Einzeltisch-Turnier, das startet, sobald genug Spieler sitzen. Feste Dauer (oft 30–60 Minuten), planbar, trainiert Push/Fold und Spiel mit kurzen Stacks.\n- **MTT (Multi-Table-Turnier)**: Viele Tische, ein Sieger. Große Preise sind möglich, aber selten – die Varianz ist enorm, und ein tiefer Run kann viele Stunden dauern.\n\nFür den Einstieg empfiehlt sich ein klarer Fokus auf **ein** Format. Wer alles gleichzeitig spielt, lernt alles nur halb. Cash Game ist der beste Lehrmeister für Postflop-Poker, weil du fast jede Hand mit relevanter Stacktiefe spielst und Fehler direkt sichtbar werden.',
          table: {
            headers: ['Format', 'Zeitbedarf', 'Varianz', 'Trainiert vor allem'],
            rows: [
              ['Cash Game', 'Flexibel, jederzeit Ausstieg', 'Moderat', 'Postflop-Spiel, tiefe Stacks'],
              ['Sit & Go', 'Planbar, 30–60 Min.', 'Mittel', 'Push/Fold, kurze Stacks, ICM-Basics'],
              ['MTT', 'Unplanbar, oft mehrere Stunden', 'Sehr hoch', 'Anpassung an Stackgrößen, Endphase'],
            ],
          },
        },
        {
          heading: 'Table Selection: der unterschätzte Skill',
          body:
            'Online laufen oft Dutzende Tische auf demselben Limit – und sie sind nicht gleich profitabel. **Table Selection** (die gezielte Tischauswahl) ist einer der am stärksten unterschätzten Edges überhaupt: Dein Gewinn kommt nicht daher, dass du gut spielst, sondern daher, dass du **besser als deine Gegner** spielst. Denselben Skill an einem weicheren Tisch einzusetzen, erhöht deine Winrate ohne einen einzigen neuen Strategie-Baustein.\n\nWorauf du in der Lobby achten kannst (sofern der Anbieter die Daten zeigt):\n\n- **Spieler pro Flop** (z. B. "Plrs/Flop"): Hohe Werte deuten auf viele lockere Spieler hin.\n- **Durchschnittlicher Pot**: Groß bei loose-passiven Tischen mit vielen Callern.\n- **Am Tisch beobachten**: Limper, Minibets, seltsame Stackgrößen und Showdowns mit schwachen Händen sind gute Zeichen.\n\nGenauso wichtig ist die **Sitzplatzwahl**: Du willst die schwächsten, lockersten Spieler möglichst **rechts** von dir haben, damit du in den meisten Händen Position auf sie hast. Und sei konsequent beim Verlassen: Wenn die schwachen Spieler gehen und nur noch Regulars (**Regs** – regelmäßige, meist solide Spieler) übrig sind, wechsle den Tisch. Sentimentalität kostet Winrate.',
          tip: 'Mache Table Selection zur festen Routine: Prüfe alle 15–20 Minuten kurz, ob dein Tisch noch gut ist und ob die Lobby einen besseren bietet. Zwei Minuten Aufwand, messbarer Effekt.',
        },
        {
          heading: 'Realistische Erwartungen',
          body:
            'Zum seriösen Start gehört ein ehrliches Erwartungsmanagement. Auch gute Spieler auf Micro-Limits erzielen Winrates von wenigen Big Blinds pro 100 Hände – in absoluten Zahlen sind das auf NL2 ein paar Euro pro Abend, an guten Tagen. Online-Poker ist auf absehbare Zeit **kein Einkommen**, sondern ein anspruchsvolles Strategiehobby, bei dem sich Können langfristig auszahlt.\n\nDrei Wahrheiten, die du von Anfang an akzeptieren solltest:\n\n- **Varianz dominiert kurzfristig**: Selbst mit klarem Skill-Vorsprung sind Break-even- oder Verlustphasen über zehntausende Hände normal. Einzelne Sessions sagen fast nichts aus.\n- **Der Fortschritt passiert abseits des Tisches**: Wer nur spielt, stagniert. Review, Theorie und ehrliche Fehleranalyse machen den Unterschied (Lektion 6).\n- **Disziplin schlägt Talent**: Bankroll-Regeln, Stop-Loss und Game Selection konsequent umzusetzen bringt mehr als jeder einzelne Fancy Play.\n\nUnd noch einmal in aller Klarheit: Spiele nur mit Geld, das du entbehren kannst, setze dir Limits, und mach Pausen. Wenn Poker sich nicht mehr wie ein Hobby anfühlt, sondern wie ein Zwang, nutze die Selbstschutz-Werkzeuge deines Anbieters oder Hilfsangebote wie die Beratung der Bundeszentrale für gesundheitliche Aufklärung.',
        },
      ],
      takeaways: [
        'Spiele nur bei lizenzierten Anbietern (in Deutschland: GGL-Whitelist, 18+) und setze dir von Anfang an Einzahlungslimits.',
        'Starte auf Micro-Limits mit mindestens 25–40 Buy-ins Bankroll und steige erst nach nachgewiesenem Erfolg auf.',
        'Fokussiere dich auf ein Format – Cash Game ist der beste Lehrmeister für Postflop-Strategie.',
        'Table Selection und Sitzplatzwahl (schwache Spieler rechts von dir) erhöhen deine Winrate ohne neuen Strategie-Aufwand.',
        'Erwarte kleine Gewinne, große Schwankungen und langsamen Fortschritt – Poker ist ein Strategiehobby, kein Einkommen.',
      ],
      quiz: [
        {
          question: 'Warum solltest du in Deutschland auf die GGL-Whitelist achten, bevor du dich bei einem Pokeranbieter registrierst?',
          options: [
            'Weil dort die Anbieter mit den höchsten Boni gelistet sind',
            'Weil nur gelistete Anbieter die deutschen Spielerschutz-Auflagen erfüllen und legal anbieten dürfen',
            'Weil die Whitelist die Anbieter mit den schwächsten Gegnern zeigt',
            'Weil unlizenzierte Anbieter grundsätzlich manipulierte Karten verteilen',
          ],
          correctIndex: 1,
          explanation:
            'Die GGL-Whitelist zeigt, welche Anbieter in Deutschland zugelassen sind – mit Alterskontrolle, OASIS-Anbindung, Limits und geprüfter Software. Über Boni oder die Spielstärke der Gegner sagt sie nichts aus, und pauschale Manipulationsvorwürfe sind kein sachliches Argument.',
        },
        {
          question: 'Du hast 60 € Bankroll und willst nach konservativer Buy-in-Regel Cash Game spielen. Welches Limit passt?',
          options: [
            'NL10 (Buy-in 10 €), um schneller aufzusteigen',
            'NL5 (Buy-in 5 €), das sind immerhin 12 Buy-ins',
            'NL2 (Buy-in 2 €), das sind 30 Buy-ins',
            'Das höchste Limit, auf dem schwache Gegner sitzen',
          ],
          correctIndex: 2,
          explanation:
            'Mit 25–40 Buy-ins für das aktuelle Limit bist du gegen normale Downswings abgesichert. 60 € ergeben auf NL2 genau diesen Puffer – NL5 oder NL10 wären deutlich unterkapitalisiert.',
        },
        {
          question: 'Was ist der Kern von Table Selection?',
          options: [
            'Immer den Tisch mit dem größten Durchschnittspot wählen, egal wer dort sitzt',
            'Gezielt Tische und Sitzplätze wählen, an denen dein Skill-Vorsprung gegenüber den Gegnern am größten ist',
            'Tische mit vielen Regulars suchen, um von ihnen zu lernen',
            'Möglichst oft den Tisch wechseln, damit niemand Reads auf dich bekommt',
          ],
          correctIndex: 1,
          explanation:
            'Dein Gewinn entsteht aus dem Skill-Unterschied zu deinen Gegnern. Ein großer Durchschnittspot ist nur ein Indiz – entscheidend ist, dass schwache Spieler am Tisch sitzen, idealerweise rechts von dir.',
        },
        {
          question: 'Warum ist das Cash Game für den Lernstart meist besser geeignet als MTTs?',
          options: [
            'Weil man im Cash Game nicht verlieren kann',
            'Weil Cash-Game-Ergebnisse keiner Varianz unterliegen',
            'Weil MTTs verboten sind, solange man Anfänger ist',
            'Weil du fast jede Hand mit relevanter Stacktiefe spielst und Postflop-Fundamentals trainierst – bei moderaterer Varianz',
          ],
          correctIndex: 3,
          explanation:
            'Im Cash Game bleiben Blinds und Stacktiefe konstant, du trainierst permanent Postflop-Spiel, und die Varianz ist deutlich geringer als in MTTs, wo große Preise selten sind und ein Run Stunden dauern kann. Verlieren kannst du natürlich in jedem Format.',
        },
        {
          question: 'Welche Erwartung an den Online-Einstieg ist realistisch?',
          options: [
            'Auch mit Skill-Vorsprung sind längere Break-even-Phasen über tausende Hände normal',
            'Wer die Theorie beherrscht, gewinnt in praktisch jeder Session',
            'Auf Micro-Limits lässt sich mit Disziplin schnell ein Nebeneinkommen aufbauen',
            'Nach 1.000 Händen weißt du sicher, ob du ein Gewinner bist',
          ],
          correctIndex: 0,
          explanation:
            'Kurzfristig dominiert die Varianz: Selbst gute Spieler erleben lange Break-even- oder Verluststrecken. 1.000 Hände sind eine winzige Stichprobe, Sessions-Garantien gibt es nicht, und Micro-Limit-Gewinne bleiben absolut gesehen klein.',
        },
      ],
    },
    {
      id: 'm8-l2',
      title: 'Online-Dynamiken verstehen',
      duration: 8,
      intro:
        'Online-Poker ist nicht einfach Live-Poker am Bildschirm: Das Tempo, die Gegner und die Kostenstruktur folgen eigenen Gesetzen. Wer diese Dynamiken versteht, passt seine Strategie und seine Erwartungen richtig an.',
      sections: [
        {
          heading: 'Mehr Hände: schnelleres Lernen, schnellere Swings',
          body:
            'Der größte Unterschied zum Live-Poker ist das **Volumen**. Live spielst du etwa 25–30 Hände pro Stunde. Online schafft ein einziger 6-max-Tisch rund 70–90 Hände pro Stunde – und mit mehreren Tischen vervielfacht sich das. Ein Online-Abend kann so viele Hände enthalten wie eine ganze Live-Woche.\n\nDas hat zwei Seiten:\n\n- **Schnelleres Lernen**: Du siehst seltene Situationen (Set over Set, 3-Bet-Pötte, River-Bluff-Spots) viel häufiger und sammelst in Monaten eine Erfahrung, für die Live-Spieler Jahre brauchen. Mit einem Tracker wird jede Hand zudem auswertbar.\n- **Schnellere Swings**: Varianz wird in Händen gemessen, nicht in Stunden. Ein Downswing von 30.000 Händen ist live ein Jahr Leidenszeit – online vielleicht drei Wochen. Die Schwankungen fühlen sich deshalb heftiger an, obwohl sie pro Hand identisch sind.\n\nPraktisch heißt das: Deine Bankroll-Regeln und deine mentale Stabilität werden online schneller und härter getestet. Gleichzeitig bekommst du aber auch schneller belastbare Daten darüber, ob du wirklich gewinnst. Beides zusammen macht Online-Poker zum effizientesten Trainingsumfeld, das es gibt – vorausgesetzt, du hältst die Schwankungen finanziell und emotional aus.',
          tip: 'Bewerte dich nie nach Sessions, sondern nach Stichproben: Erst ab mehreren zehntausend Händen sagt deine Winrate etwas Belastbares aus. Alles darunter ist vor allem Rauschen.',
        },
        {
          heading: 'Das Feld ist stärker als live',
          body:
            'Wer vom Live-Poker kommt, erlebt online oft einen Realitätsschock: Auf vergleichbaren Blinds sind die Gegner **deutlich stärker**. Ein 1-€/2-€-Live-Tisch spielt sich häufig weicher als Online-Limits, die nominell nur einen Bruchteil davon kosten.\n\nDie Gründe:\n\n- **Selektion**: Online-Regs spielen zehntausende Hände pro Monat, nutzen Tracker und Study-Tools und leben teils vom Spiel. Freizeitspieler verteilen sich auf viele Tische und Formate.\n- **Niedrige Einstiegshürden für Profis**: Wer live 2 €/5 € schlagen kann, sitzt online oft auf Limits, die für Aufsteiger aus den Micros die nächste Stufe wären.\n- **Werkzeuge**: Statistiken, Datenbanken und Solver-Wissen (Lektion 6) sind online Standard unter ambitionierten Spielern.\n\nWas folgt daraus? Erstens: Nimm die Limit-Leiter ernst – "NL10 ist ja nur Kleingeld" ist die falsche Brille, gemessen an der Gegnerstärke ist es ehrliches Poker. Zweitens: Deine Edge kommt auf jedem Limit vor allem von den schwächeren Spielern am Tisch, nicht davon, Regs zu überlisten. Game Selection bleibt deshalb auch online dein bester Freund. Drittens: Sieh die starke Konkurrenz als Feature – nirgendwo bekommst du ehrlicheres Feedback über dein tatsächliches Niveau.',
        },
        {
          heading: 'Fast-Fold: Zoom, Snap & Co.',
          body:
            'Viele Anbieter haben **Fast-Fold-Formate** (je nach Seite Zoom, fastforward, Snap o. ä. genannt): Du spielst nicht an einem festen Tisch, sondern in einem Spielerpool. Sobald du foldest, sitzt du sofort mit neuen Gegnern in einer neuen Hand. So kommst du an einem einzigen "Tisch" auf über 200 Hände pro Stunde.\n\nDas verändert die Strategie spürbar:\n\n- **Der Pool spielt tighter**: Weil jeder schwache Hände kostenlos wegwerfen und sofort weiterspielen kann, verschwindet viel Langeweile-Loose-Play. Aggression – besonders 3-Bets und große Turn/River-Bets – ist im Schnitt ehrlicher. Gib großen Bets tendenziell mehr Kredit.\n- **Kaum Reads, kein Image**: Du siehst dieselben Gegner nur sporadisch. Dein Table-Image existiert praktisch nicht – Bluffs, die auf deinem tighten Ruf aufbauen, funktionieren schlechter. Spiele näher an einer soliden Standardstrategie und stütze Anpassungen auf Pool-Tendenzen statt auf Einzel-Reads.\n- **Verlockung Autopilot**: Das hohe Tempo verführt zu mechanischem Klicken. Genau dann schleichen sich Standardfehler ein.\n\nFast-Fold ist hervorragend, um Volumen zu machen und Preflop-Disziplin zu trainieren – aber ein schwächeres Umfeld für Exploits, die auf Beobachtung einzelner Gegner beruhen.',
          example:
            'Du openst im Fast-Fold-Pool A♦ J♣ vom Button, der Big Blind 3-bettet. An einem normalen Tisch wüsstest du vielleicht, dass dieser Spieler light 3-bettet. Im Pool fehlt dieser Read – und Pool-3-Bets sind im Schnitt value-lastig. Ein disziplinierter Fold oder Call statt eines leichten 4-Bets ist hier meist die bessere Wahl.',
          cards: ['Ad', 'Jc'],
        },
        {
          heading: 'Rake und Rakeback: die unsichtbare Kostenstruktur',
          body:
            'Der Anbieter verdient am **Rake**: einem kleinen Prozentsatz jedes Pots (im Cash Game meist rund 3–5 %, gedeckelt durch einen **Cap**, einen Maximalbetrag pro Pot). Das klingt harmlos, summiert sich aber enorm – gerade auf Micro-Limits, wo der Cap relativ zu den Blinds hoch ist. Dort kann der insgesamt gezahlte Rake umgerechnet zweistellige bb/100-Werte erreichen, also mehr, als gute Spieler an Winrate erzielen.\n\nZwei Konsequenzen:\n\n- **Rake verändert Strategie**: Je höher der Rake, desto wertvoller wird tightes, einfaches Spiel. Marginale Calls und kleine Pötte, die oft am Showdown enden, verlieren an Wert, weil der Anbieter überall mitschneidet. Preflop-Aggression (Pötte gewinnen, bevor Rake anfällt – viele Seiten nehmen ohne Flop keinen Rake, "no flop, no drop") gewinnt an Wert.\n- **Rakeback zurückholen**: Viele Anbieter geben über Treueprogramme, Missionen oder direkte Rückzahlungen einen Teil des Rakes zurück (**Rakeback**). Für Vielspieler macht das mehrere bb/100 aus – bei knappen Winrates der Unterschied zwischen Gewinn und Verlust.\n\nVergleiche Anbieter deshalb nie nur nach Spielerpool, sondern immer nach dem Paket aus Rake-Struktur, Cap und Rakeback. Ein nominell weicherer Pool kann durch brutalen Rake unprofitabler sein als ein härterer Pool mit fairer Kostenstruktur.',
        },
      ],
      takeaways: [
        'Online spielst du pro Tisch etwa drei- bis viermal so viele Hände wie live – du lernst schneller, erlebst Downswings aber auch in Wochen statt Jahren.',
        'Auf vergleichbaren Blinds sind Online-Gegner im Schnitt deutlich stärker als live – nimm auch kleine Limits ernst.',
        'In Fast-Fold-Pools gilt: tighter und ehrlicher – gib großen Bets mehr Kredit und verlasse dich auf Pool-Tendenzen statt auf Einzel-Reads.',
        'Rake ist auf Micro-Limits ein massiver Kostenfaktor; Rakeback und die Rake-Struktur gehören in jede Anbieterwahl.',
        'Beurteile dein Spiel über große Stichproben, nicht über einzelne Sessions.',
      ],
      quiz: [
        {
          question: 'Warum fühlen sich Downswings online oft heftiger an als live, obwohl die Varianz pro Hand gleich ist?',
          options: [
            'Weil Online-Software Verlustphasen verstärkt',
            'Weil online mehr Hände pro Zeit gespielt werden und ein Downswing derselben Länge (in Händen) in viel kürzerer Zeit passiert',
            'Weil die Gegner online mehr Glück haben',
            'Weil der Rake die Karten beeinflusst',
          ],
          correctIndex: 1,
          explanation:
            'Varianz wird in Händen gemessen. 30.000 Hände Downswing sind live ein Jahr, online wenige Wochen – dieselbe Schwankung, komprimiert auf kurze Zeit. Software oder Rake haben auf die Kartenverteilung keinen Einfluss.',
        },
        {
          question: 'Ein solider Live-1-€/2-€-Spieler wechselt online auf NL200 (1 €/2 € Blinds). Was ist die realistischste Erwartung?',
          options: [
            'Ungefähr dieselbe Gegnerstärke, da die Blinds identisch sind',
            'Schwächere Gegner, weil online mehr Freizeitspieler unterwegs sind',
            'Deutlich stärkere Gegner als live – ein Start auf viel kleineren Online-Limits wäre klüger',
            'Die Gegnerstärke spielt keine Rolle, wenn die Strategie stimmt',
          ],
          correctIndex: 2,
          explanation:
            'Online-Felder sind bei gleichen Blinds klar stärker: Regs mit riesigem Volumen, Trackern und Study-Routinen dominieren die mittleren Limits. Die Blinds sagen nichts über die Gegnerstärke aus – und genau die bestimmt deine Winrate.',
        },
        {
          question: 'Welche Anpassung ist in Fast-Fold-Formaten (z. B. Zoom) typischerweise richtig?',
          options: [
            'Mehr bluffen, weil die Gegner keine Reads auf dich haben',
            'Großen Bets und 3-Bets mehr Kredit geben, weil der Pool tighter und ehrlicher spielt',
            'Looser spielen, weil man Gegner schnell wieder loswird',
            'Auf Preflop-Disziplin verzichten, weil das Tempo zählt',
          ],
          correctIndex: 1,
          explanation:
            'Weil jeder schwache Hände sofort folden und weiterspielen kann, ist der Fast-Fold-Pool im Schnitt tighter und Aggression value-lastiger. Bluffs, die auf deinem Image aufbauen, funktionieren dagegen schlechter – es gibt schlicht kein Image.',
        },
        {
          question: 'Was bedeutet der Rake-Cap?',
          options: [
            'Die maximale Anzahl an Händen, für die Rake anfällt',
            'Der Mindestbetrag, den der Anbieter pro Pot einbehält',
            'Der Prozentsatz, den der Anbieter von jedem Buy-in nimmt',
            'Der Maximalbetrag, den der Anbieter pro Pot als Rake einbehält',
          ],
          correctIndex: 3,
          explanation:
            'Der Rake ist ein Prozentsatz des Pots, aber pro Pot durch den Cap gedeckelt. Wichtig: Relativ zu den Blinds ist der Cap auf Micro-Limits oft hoch, was den effektiven Rake dort besonders teuer macht.',
        },
        {
          question: 'Warum kann Rakeback für einen Vielspieler entscheidend sein?',
          options: [
            'Weil zurückgezahlter Rake mehrere bb/100 ausmachen kann – bei knappen Winrates der Unterschied zwischen Plus und Minus',
            'Weil Rakeback die Varianz eliminiert',
            'Weil Anbieter mit Rakeback schwächere Gegner garantieren',
            'Weil Rakeback den Rake-Cap erhöht',
          ],
          correctIndex: 0,
          explanation:
            'Auf kleinen Limits frisst der Rake einen großen Teil der möglichen Winrate. Wer einen Teil davon über Treueprogramme zurückbekommt, verbessert sein Ergebnis direkt – an Varianz oder Gegnerstärke ändert Rakeback nichts.',
        },
      ],
    },
    {
      id: 'm8-l3',
      title: 'Multi-Tabling',
      duration: 8,
      intro:
        'Mehrere Tische gleichzeitig zu spielen ist der große Effizienzhebel des Online-Pokers – und eine der häufigsten Ursachen für stagnierende Winrates. Diese Lektion zeigt dir, wann und wie du sinnvoll skalierst.',
      sections: [
        {
          heading: 'Erst ein Tisch, dann Skalierung',
          body:
            'Multi-Tabling multipliziert dein Volumen – aber es multipliziert auch deine Fehler. Deshalb gilt eine klare Voraussetzung: Füge erst dann einen zweiten Tisch hinzu, wenn ein einzelner Tisch **profitabel und weitgehend automatisiert** läuft.\n\nKonkret solltest du drei Kriterien erfüllen:\n\n- **Nachgewiesene Profitabilität**: Dein Tracker zeigt über eine ordentliche Stichprobe (Größenordnung mehrere zehntausend Hände), dass du dein Limit schlägst – nicht nur das Gefühl nach ein paar guten Abenden.\n- **Automatisierte Standards**: Preflop-Ranges, Standard-C-Bets (Continuation Bets) und klare Folds laufen ohne Nachdenken ab. Bewusste Denkzeit brauchst du nur noch für wirklich schwierige Spots.\n- **Keine Zeitnot**: Du gerätst an einem Tisch praktisch nie unter Zeitdruck und nutzt die freie Zeit bereits, um Gegner zu beobachten.\n\nDann erhöhst du **schrittweise**: von einem auf zwei Tische, einige Sessions stabilisieren, dann drei – und nach jedem Schritt ehrlich prüfen (Abschnitt weiter unten), ob die Qualität hält. Wer von null auf acht Tische springt, trainiert vor allem eines: schnelles, schlechtes Poker. Merke: Volumen verstärkt das Spiel, das du mitbringst – gutes wie schlechtes.',
          tip: 'Ein guter Zwischentest: Kannst du an einem Tisch nebenbei die Ranges deiner Gegner mitverfolgen und Notes machen, ohne Fehler zu produzieren? Dann ist Kapazität für einen weiteren Tisch da.',
        },
        {
          heading: 'Tiling vs. Stacking',
          body:
            'Für die Anordnung der Tische auf dem Bildschirm haben sich zwei Grundlayouts etabliert:\n\n- **Tiling** (Kacheln): Alle Tische liegen nebeneinander und sind gleichzeitig sichtbar. Vorteil: Du siehst jede Action sofort, kannst Gegner auch dann beobachten, wenn du nicht in der Hand bist, und behältst den Überblick. Nachteil: Ab etwa vier bis sechs Tischen werden die Fenster klein, und deine Augen springen ständig.\n- **Stacking** (Stapeln): Alle Tische liegen übereinander; der Tisch, an dem du handeln musst, springt in den Vordergrund. Vorteil: volle Fenstergröße, beliebig viele Tische, ein fester Blickpunkt. Nachteil: Du siehst nur den aktiven Tisch – Reads, Verlauf und Kontext der übrigen Hände gehen weitgehend verloren, und du reagierst nur noch, statt zu beobachten.\n\nDazwischen gibt es Mischformen (z. B. Kaskaden oder ein Haupt-Grid mit Stapel für Zusatztische). Für Lernende ist **Tiling mit wenigen Tischen** klar die bessere Wahl: Beobachtung ist Trainingszeit. Stacking lohnt sich erst, wenn du bewusst auf maximales Volumen mit einer eingeschliffenen Standardstrategie gehst – ein legitimes Modell, aber eines, das Lernen gegen Durchsatz eintauscht.',
          example:
            'Typisches Setup eines ambitionierten Micro-Grinders: vier Tische im 2x2-Tiling auf einem Monitor, Tracker-Statistiken daneben. Alles sichtbar, keine überlappenden Fenster, jede Showdown-Hand der Gegner wird registriert.',
        },
        {
          heading: 'Hotkeys und Bet-Voreinstellungen der Lobby',
          body:
            'Je mehr Tische, desto wertvoller wird jede gesparte Sekunde. Fast jede Poker-Software bietet dafür eingebaute Werkzeuge, die du **vor** dem Multi-Tabling einrichten solltest:\n\n- **Hotkeys**: Tastenkürzel für Fold, Check/Call, Bet/Raise und das Bestätigen von Beträgen. Das ist schneller und präziser als Klicken – gerade wenn mehrere Tische gleichzeitig Action verlangen.\n- **Bet-Voreinstellungen**: Vordefinierte Sizings wie 2,5bb fürs Open-Raise oder 33 %, 50 %, 66 % und 75 % Pot für Postflop-Bets, als Buttons oder Tastenkürzel. So bleiben deine Sizings konsistent, statt unter Zeitdruck zu Zufallswerten zu werden.\n- **Automatische Time-Bank und Auto-Top-up**: Zeitpolster aktivieren, Stack automatisch auf 100bb auffüllen – zwei Klickquellen weniger.\n\nEine wichtige Grenze: Nutze die **eingebauten Funktionen deines Anbieters**. Externe Automatisierungs-Tools, die für dich klicken oder Entscheidungen treffen, verstoßen bei praktisch allen Anbietern gegen die Nutzungsbedingungen und können zur Kontosperrung führen. Der Unterschied ist einfach zu merken: Software darf dir Handgriffe abnehmen – niemals Entscheidungen.',
        },
        {
          heading: 'Der ehrliche Preis jedes Zusatztisches',
          body:
            'Jeder zusätzliche Tisch senkt deine Aufmerksamkeit pro Hand – und damit deine **Winrate pro Tisch**. Das ist kein Versagen, sondern Arithmetik der Aufmerksamkeit: Weniger Zeit pro Entscheidung bedeutet mehr Standardfehler, weniger Beobachtung und weniger Exploits. Die entscheidende Frage lautet deshalb nicht "Wie viele Tische schaffe ich?", sondern: Steigt mein **Stundengewinn** mit dem letzten Zusatztisch noch?\n\nDie Rechnung dahinter ist simpel: Stundengewinn = Winrate (bb/100) mal gespielte Hände pro Stunde. Mehr Tische erhöhen die Hände, senken aber die Winrate – irgendwo liegt dein persönlicher Sweet Spot, und der ist bei jedem anders. Die Tabelle zeigt eine illustrative Beispielrechnung (die echten Zahlen liefert dir nur dein Tracker): Von einem auf vier Tische steigt der Stundengewinn hier deutlich, beim Sprung auf acht bricht die Winrate so stark ein, dass unterm Strich weniger übrig bleibt als mit vier.\n\nZwei versteckte Kosten gehören ehrlich dazu: Erstens lernst du mit vielen Tischen pro Hand weniger, weil Beobachtungszeit fehlt – wer noch aufsteigen will, zahlt mit Volumen also auch Entwicklungszeit. Zweitens steigt die mentale Belastung überproportional; Tilt trifft dann alle Tische gleichzeitig.',
          table: {
            headers: ['Tische', 'Winrate pro Tisch (bb/100)', 'Hände/Stunde gesamt', 'Gewinn/Stunde (bb)'],
            rows: [
              ['1', '8', '80', '6,4'],
              ['2', '7', '160', '11,2'],
              ['4', '5', '320', '16,0'],
              ['8', '2', '640', '12,8'],
            ],
          },
          tip: 'Filtere deinen Tracker regelmäßig nach Anzahl gleichzeitiger Tische und vergleiche die Winrates. Steigt der Stundengewinn beim letzten Skalierungsschritt nicht mehr, geh einen Tisch zurück – dein Ego ist keine Kennzahl.',
        },
        {
          heading: 'Fokusregeln für saubere Sessions',
          body:
            'Multi-Tabling verzeiht keine geteilte Aufmerksamkeit – die verteilt es schon selbst. Ein paar Regeln, die sich bei disziplinierten Spielern bewährt haben:\n\n- **Keine Zweitbeschäftigung**: Kein Stream, kein Chat, kein Handy neben den Tischen. Was nach harmloser Ablenkung aussieht, kostet genau die Restaufmerksamkeit, die schwierige Spots brauchen.\n- **Ein Format pro Session**: Cash und Turniere gleichzeitig zu spielen erzwingt ständige Strategie-Wechsel (Stacktiefen, Push/Fold vs. Postflop) – ein zuverlässiger Fehlergenerator.\n- **Tische abbauen können**: Bei Müdigkeit, Tilt-Anzeichen oder einem besonders schwierigen Tisch reduzierst du sofort die Tischzahl. Runterskalieren ist eine Stärke, kein Rückzug.\n- **Feste Blöcke mit Pausen**: 60–90 Minuten konzentriert spielen, dann 10 Minuten weg vom Bildschirm. Konzentration ist eine begrenzte Ressource, und Multi-Tabling verbraucht sie schneller.\n- **Schwierige Hände markieren, nicht grübeln**: Ein Klick auf die Markierungsfunktion, weiter geht es. Die Analyse gehört in den Review nach der Session (Lektion 6), nicht zwischen zwei laufende Tische.\n\nDiese Regeln klingen banal – aber der Unterschied zwischen einem 4-Tisch-Grinder mit und ohne Fokusdisziplin liegt oft bei mehreren bb/100.',
        },
      ],
      takeaways: [
        'Skaliere erst, wenn ein Tisch nachweislich profitabel läuft und deine Standardentscheidungen automatisiert sind – dann schrittweise.',
        'Tiling (alle Tische sichtbar) ist zum Lernen besser; Stacking maximiert Volumen auf Kosten von Beobachtung und Reads.',
        'Richte Hotkeys und Bet-Voreinstellungen der Lobby ein – aber nutze nie externe Tools, die Entscheidungen automatisieren.',
        'Jeder Zusatztisch senkt die Winrate pro Tisch; entscheidend ist der Stundengewinn, den du im Tracker pro Tischzahl misst.',
        'Fokusregeln (keine Ablenkung, ein Format, Pausen, Tische abbauen) sind beim Multi-Tabling bares Geld.',
      ],
      quiz: [
        {
          question: 'Wann ist der richtige Zeitpunkt für den zweiten Tisch?',
          options: [
            'Sobald die Bankroll zwei Buy-ins hergibt',
            'Wenn ein Tisch über eine große Stichprobe profitabel läuft und Standardentscheidungen ohne Nachdenken ablaufen',
            'Sofort – mehr Tische bedeuten automatisch mehr Gewinn',
            'Erst wenn man auf NL50 oder höher spielt',
          ],
          correctIndex: 1,
          explanation:
            'Multi-Tabling multipliziert dein aktuelles Spiel – auch die Fehler. Erst nachgewiesene Profitabilität plus automatisierte Standards schaffen die freie Kapazität, die ein weiterer Tisch beansprucht. Bankroll oder Limit sind dafür nicht das Kriterium.',
        },
        {
          question: 'Was ist der wichtigste Nachteil von Stacking gegenüber Tiling?',
          options: [
            'Stacking funktioniert nur mit zwei Monitoren',
            'Gestapelte Tische verbrauchen mehr Rechenleistung',
            'Du siehst fast nur den aktiven Tisch und verlierst Beobachtung, Reads und Handkontext der übrigen Tische',
            'Beim Stacking sind Hotkeys deaktiviert',
          ],
          correctIndex: 2,
          explanation:
            'Beim Stacking springt nur der Tisch mit anstehender Action in den Vordergrund – du reagierst, statt zu beobachten. Genau die Beobachtungszeit ist aber Trainings- und Read-Zeit, weshalb Tiling für Lernende die bessere Wahl ist.',
        },
        {
          question: 'Deine Tracker-Daten: 4 Tische = 16 bb Stundengewinn, 6 Tische = 13 bb Stundengewinn. Was ist die richtige Konsequenz?',
          options: [
            'Auf 8 Tische erhöhen, um den Rückgang durch Volumen auszugleichen',
            'Bei 6 Tischen bleiben, weil mehr Hände immer besser fürs Lernen sind',
            'Die Winrate pro Tisch ignorieren – nur Volumen zählt',
            'Zurück auf 4 Tische – der letzte Skalierungsschritt senkt den Stundengewinn',
          ],
          correctIndex: 3,
          explanation:
            'Entscheidend ist der Stundengewinn. Sinkt er beim Hochskalieren, hat die sinkende Aufmerksamkeit pro Hand den Volumenvorteil überkompensiert – die richtige Reaktion ist ein Schritt zurück, nicht noch mehr Tische.',
        },
        {
          question: 'Welche Nutzung von Software ist beim Multi-Tabling unproblematisch?',
          options: [
            'Ein externes Tool, das automatisch schwache Hände foldet',
            'Die eingebauten Hotkeys und Bet-Voreinstellungen der Anbieter-Software',
            'Ein Skript, das auf Basis von Stats selbstständig 3-Bets ausführt',
            'Ein Programm, das die Time-Bank umgeht und für dich klickt',
          ],
          correctIndex: 1,
          explanation:
            'Eingebaute Funktionen des Anbieters (Hotkeys, Sizing-Buttons, Auto-Top-up) nehmen dir Handgriffe ab und sind erlaubt. Externe Tools, die Entscheidungen treffen oder automatisch agieren, verstoßen praktisch überall gegen die Nutzungsbedingungen.',
        },
        {
          question: 'Mitten in der 4-Tisch-Session merkst du Müdigkeit und erste Tilt-Anzeichen. Was ist der beste Umgang damit?',
          options: [
            'Tischzahl sofort reduzieren oder die Session beenden',
            'Einen fünften Tisch öffnen, um die Ablenkung zu übertönen',
            'Weiterspielen, aber nur noch Premium-Hände anschauen',
            'Musik anmachen und durchziehen – Volumen geht vor',
          ],
          correctIndex: 0,
          explanation:
            'Runterskalieren ist eine der wichtigsten Multi-Tabling-Fähigkeiten: Müdigkeit und Tilt senken die Entscheidungsqualität an allen Tischen gleichzeitig. Weniger Tische oder Schluss machen begrenzt den Schaden sofort.',
        },
      ],
    },
    {
      id: 'm8-l4',
      title: 'HUDs, Stats & Tracking',
      duration: 10,
      intro:
        'Tracking-Software verwandelt deine Hände in Daten – über dich und deine Gegner. Diese Lektion erklärt die wichtigsten Statistiken, ihre typischen Wertebereiche und warum du zuerst die Regeln deines Anbieters kennen musst.',
      sections: [
        {
          heading: 'Was Tracker und HUDs sind',
          body:
            'Ein **Tracker** (bekannte Programme sind z. B. PokerTracker, Hold\'em Manager oder Hand2Note) liest die Handhistorien mit, die deine Poker-Software lokal speichert, und baut daraus eine Datenbank: jede gespielte Hand, jeder Gegner, jede Statistik. Damit kannst du nach der Session dein eigenes Spiel filtern und analysieren – der eigentliche Kern des Tools.\n\nEin **HUD** (Heads-up Display) ist die Live-Komponente: ein Overlay, das während des Spiels Statistiken direkt neben jedem Gegner am Tisch einblendet. Statt dich auf dein Gedächtnis zu verlassen ("der raist irgendwie oft"), siehst du Zahlen: Wie viele Hände spielt er? Wie oft raist er preflop? Wie oft gibt er auf eine C-Bet auf?\n\nZwei Dinge solltest du von Anfang an richtig einordnen:\n\n- **Stichprobe schlägt Zahl**: Jede Statistik ist nur so gut wie die Anzahl der Hände dahinter (eigener Abschnitt unten).\n- **Das HUD ersetzt kein Denken**: Es beantwortet die Frage "Wie spielt dieser Gegnertyp typischerweise?" – die Übersetzung in konkrete Entscheidungen bleibt deine Aufgabe.\n\nUnd ganz wichtig, bevor du irgendetwas installierst: Nicht jeder Anbieter erlaubt HUDs – dazu unten mehr.',
        },
        {
          heading: 'Die Kernstats und ihre typischen Wertebereiche',
          body:
            'Sechs Statistiken bilden das Fundament fast jeder Gegner-Einschätzung (Wertebereiche bezogen auf 6-max Cash Game, 100bb):\n\n- **VPIP** (Voluntarily Put Money In Pot): Anteil der Hände, in denen ein Spieler freiwillig Geld investiert (Call oder Raise preflop). Das Maß für Looseness.\n- **PFR** (Preflop Raise): Anteil der Hände mit Preflop-Raise. Das Maß für Preflop-Aggression.\n- **Gap** (VPIP minus PFR): Ein kleiner Gap heißt: Wer spielt, raist meist. Ein großer Gap verrät viele passive Calls und Limps – typisch für schwache Spieler.\n- **3-Bet%**: Wie oft jemand gegen ein Open-Raise erneut raist. Niedrige Werte bedeuten fast immer starke Value-Hände.\n- **Fold to C-Bet**: Wie oft jemand am Flop auf eine Continuation Bet aufgibt. Extremwerte in beide Richtungen sind direkt ausnutzbar.\n- **AF** (Aggression Factor): Verhältnis von aggressiven Aktionen (Bet/Raise) zu Calls postflop. Zeigt, ob jemand eher bettet oder callt.\n\nDie Tabelle zeigt grobe Orientierungswerte – Übergänge sind fließend, und einzelne Stats ergeben erst im Zusammenspiel ein Bild.',
          table: {
            headers: ['Stat', 'Solider Reg (6-max)', 'Auffällig tight/passiv', 'Auffällig loose'],
            rows: [
              ['VPIP', '22–27 %', 'unter 18 %', 'über 35 %'],
              ['PFR', '17–22 %', 'unter 12 %', 'über 30 %'],
              ['Gap (VPIP−PFR)', '3–6 Punkte', '—', 'über 10 Punkte (passiv)'],
              ['3-Bet%', '7–10 %', 'unter 4 %', 'über 12 %'],
              ['Fold to C-Bet', '40–60 %', 'über 65 %', 'unter 35 % (Station)'],
              ['AF', '2–4', 'unter 1,5', 'über 5'],
            ],
          },
        },
        {
          heading: 'Stats in Entscheidungen übersetzen',
          body:
            'Zahlen nützen erst etwas, wenn du sie in Anpassungen übersetzt. Drei typische Muster:\n\n- **Der Nit** (z. B. VPIP 14 / PFR 11 / 3-Bet 3 %): Spielt nur starke Hände. Konsequenz: Stiehl seine Blinds großzügig – aber wenn er 3-bettet oder am River raist, ist deine Top-Pair-Hand oft geschlagen. Discipline-Folds gegen Nits sind eine der einfachsten Geldquellen.\n- **Der Loose-Passive** (z. B. VPIP 45 / PFR 8, großer Gap, AF unter 1,5): Callt zu viel, raist zu selten. Konsequenz: Value-bette dünner und größer, bluffe deutlich weniger – er foldet ja nicht. Wenn dieser Spielertyp plötzlich raist, hat er fast immer eine sehr starke Hand.\n- **Der überaggressive Reg** (z. B. 3-Bet 13 %, hohe C-Bet- und Barrel-Frequenzen): Setzt dich ständig unter Druck. Konsequenz: Mehr gute Bluffcatcher wählen, öfter mit soliden Händen callen statt folden, gelegentlich light 4-betten.\n\nWichtig ist die Kombination: Ein VPIP von 30 bedeutet bei einem Fold-to-C-Bet von 70 % etwas völlig anderes (foldet postflop viel – bette häufig) als bei 25 % (Calling Station – bluffe nie, value-bette dünn). Lies Stats immer als Profil, nie als Einzelzahl.',
          example:
            'Du hältst A♥ Q♠ auf dem Button. Ein Spieler mit VPIP 13 / PFR 10 / 3-Bet 2 % (über 1.500 Hände) 3-bettet dein Open-Raise aus dem Small Blind. Trotz der schönen Hand ist Fold hier stark: Seine 3-Bet-Range besteht fast nur aus QQ+ und AK – gegen diese Range ist A♥ Q♠ weit hinten.',
          cards: ['Ah', 'Qs'],
        },
        {
          heading: 'Stichprobengröße: Wann sind Stats belastbar?',
          body:
            'Der häufigste HUD-Fehler ist nicht die falsche Zahl, sondern die richtige Zahl auf einer zu kleinen Stichprobe. Faustregeln:\n\n- **VPIP und PFR** stabilisieren sich am schnellsten, weil jede Hand einen Datenpunkt liefert. Ab etwa 100–200 Händen erkennst du die grobe Richtung (tight oder loose), ab einigen hundert Händen wird das Bild verlässlich.\n- **3-Bet%** braucht deutlich mehr, denn die Gelegenheit zur 3-Bet kommt nur in einem Teil der Hände: Unter etwa 500–1.000 Händen ist der Wert mit Vorsicht zu genießen.\n- **Postflop-Stats** wie Fold to C-Bet oder River-Aggression basieren auf noch selteneren Situationen – hier brauchst du oft vierstellige Handzahlen, bevor du große Entscheidungen darauf stützt.\n\nPraktische Konsequenz: Bei 40 Händen Stichprobe sagt ein VPIP von 55 immerhin "wahrscheinlich loose" – aber ein Fold-to-C-Bet von 80 % bei fünf Gelegenheiten sagt fast nichts. Viele Spieler lassen sich die Handzahl deshalb direkt im HUD anzeigen und färben Stats erst ab Mindeststichproben ein.\n\nGrundsatz: Je größer die Abweichung vom Normalbereich und je größer die Stichprobe, desto stärker darf die Anpassung sein. Kleine Stichprobe plus moderate Abweichung ist meist ein Fall für die Standardstrategie.',
          tip: 'Nutze bei kleinen Stichproben Prior-Wissen über den Pool: Ein unbekannter Spieler auf Micro-Limits mit 60 % VPIP über 30 Hände ist mit hoher Wahrscheinlichkeit wirklich loose – solche Extremwerte entstehen selten zufällig.',
        },
        {
          heading: 'Anbieterregeln respektieren – und die Alternativen',
          body:
            'Ganz wichtig: **Viele Anbieter verbieten oder beschränken HUDs und Tracker inzwischen.** Manche erlauben gar keine Drittsoftware, manche anonymisieren Spielernamen, manche gestatten Tracking nur für die eigenen Hände ohne Live-Overlay. Die Regeln stehen in den Nutzungsbedingungen – und sie zu verletzen kann Verwarnung, Kontosperrung und Einbehalt von Guthaben bedeuten. Informiere dich also **vor** der Installation, was dein Anbieter erlaubt, und halte dich daran. Kein Informationsvorsprung ist eine gesperrte Bankroll wert.\n\nDie gute Nachricht: Auch ohne HUD kannst du systematisch Reads sammeln:\n\n- **Farblabels**: Fast jede Poker-Software erlaubt es, Spieler farblich zu markieren (z. B. Grün = schwach/loose, Rot = starker Reg, Blau = Nit). Das ist in Sekunden erledigt und über Sessions hinweg Gold wert.\n- **Notes**: Kurze Notizen zu konkreten Showdowns ("3-bettet A5s aus dem SB", "overbettet River mit Nuts") sind oft wertvoller als jede Statistik, weil sie echte Entscheidungen dokumentieren.\n- **Session-Review im Tracker**: Wo das Tracken der eigenen Hände erlaubt ist, bleibt der größte Nutzen ohnehin bestehen – die Analyse deines eigenen Spiels nach der Session. Dein größter Leak sitzt selten am anderen Ende des Tisches.',
        },
      ],
      takeaways: [
        'Tracker bauen eine Datenbank aus deinen Handhistorien; HUDs blenden Gegner-Stats live am Tisch ein.',
        'Kernstats für 6-max: VPIP 22–27 und PFR 17–22 sind solide; großer Gap = passiv, niedrige 3-Bet% = value-lastig.',
        'Lies Stats immer als Profil und beachte die Stichprobe: VPIP/PFR früh brauchbar, 3-Bet% und Postflop-Stats erst nach hunderten bis tausenden Händen.',
        'Prüfe vor jeder Installation die Regeln deines Anbieters – HUD-Verstöße können das Konto kosten.',
        'Farblabels, Notes und der Review der eigenen Hände sind starke, fast überall erlaubte Alternativen.',
      ],
      quiz: [
        {
          question: 'Ein Gegner hat VPIP 44 und PFR 7. Was sagt dir dieser große Gap?',
          options: [
            'Er ist ein aggressiver Reg, der viel 3-bettet',
            'Er spielt viele Hände, aber fast immer passiv per Call oder Limp – ein klassisch schwaches Profil',
            'Er spielt zu wenige Hände und sollte looser werden',
            'Der Gap ist bedeutungslos, solange der AF unbekannt ist',
          ],
          correctIndex: 1,
          explanation:
            'VPIP 44 heißt: fast jede zweite Hand wird gespielt. PFR 7 heißt: fast nie per Raise. Die Differenz von 37 Punkten verrät massenhaft passive Calls – das Profil eines Loose-Passive, gegen den du dünn value-betten und selten bluffen solltest.',
        },
        {
          question: 'Ein tighter Spieler (3-Bet 2 % über 1.500 Hände) 3-bettet dein Button-Open mit A♥ Q♠. Warum ist Fold hier meist richtig?',
          options: [
            'Weil man gegen 3-Bets grundsätzlich nur mit Assen weiterspielt',
            'Weil AQ offsuit generell eine Verlusthand ist',
            'Weil seine 3-Bet-Range bei 2 % fast nur aus QQ+ und AK besteht und AQ dagegen klar hinten liegt',
            'Weil die Stichprobe von 1.500 Händen zu klein für eine Entscheidung ist',
          ],
          correctIndex: 2,
          explanation:
            'Eine 3-Bet-Quote von 2 % entspricht praktisch nur den Premium-Händen. Gegen QQ+/AK ist AQ dominiert oder weit abgeschlagen. 1.500 Hände sind für eine Preflop-Stat wie 3-Bet% zudem eine ordentliche Stichprobe – der Read ist belastbar.',
        },
        {
          question: 'Warum ist ein Fold-to-C-Bet-Wert nach 30 Händen kaum belastbar, ein VPIP nach 30 Händen aber immerhin ein grober Hinweis?',
          options: [
            'Weil VPIP jede Hand einen Datenpunkt liefert, eine C-Bet-Situation aber nur in wenigen dieser Hände überhaupt vorkommt',
            'Weil Fold to C-Bet nur in Turnieren gemessen wird',
            'Weil VPIP vom Anbieter berechnet wird und Fold to C-Bet vom Tracker',
            'Beide Werte sind nach 30 Händen exakt gleich verlässlich',
          ],
          correctIndex: 0,
          explanation:
            'Die Verlässlichkeit hängt an der Zahl der Gelegenheiten. VPIP sammelt mit jeder ausgeteilten Hand Daten; einer C-Bet gegenübergestanden hat ein Spieler in 30 Händen vielleicht drei- bis fünfmal – solche Mini-Stichproben streuen extrem.',
        },
        {
          question: 'Du wechselst zu einem Anbieter und willst dein gewohntes HUD nutzen. Was ist der korrekte erste Schritt?',
          options: [
            'Installieren und testen – wenn es läuft, ist es erlaubt',
            'Das HUD verdeckt laufen lassen, solange niemand fragt',
            'In den Nutzungsbedingungen prüfen, ob und in welcher Form Tracker/HUDs erlaubt sind – und sich daran halten',
            'Im Forum fragen und der Mehrheitsmeinung folgen',
          ],
          correctIndex: 2,
          explanation:
            'Maßgeblich sind allein die Nutzungsbedingungen des Anbieters. Viele Seiten verbieten oder beschränken HUDs; Verstöße können Sperrung und Einbehalt von Guthaben nach sich ziehen. Dass Software technisch funktioniert, sagt nichts über ihre Zulässigkeit.',
        },
        {
          question: 'Dein Anbieter erlaubt keine HUDs. Welche Kombination ersetzt den Informationsverlust am besten?',
          options: [
            'Auswendiglernen aller Gegnernamen',
            'Farblabels für Spielertypen, Notes zu konkreten Showdowns und konsequenter Review der eigenen Hände',
            'Nur noch Fast-Fold spielen, wo Reads ohnehin egal sind',
            'Ein verstecktes HUD eines Drittanbieters verwenden',
          ],
          correctIndex: 1,
          explanation:
            'Farblabels und Notes sind fast überall erlaubt, schnell gepflegt und dokumentieren echte Entscheidungen der Gegner. Der Review der eigenen Hände bleibt ohnehin der wertvollste Teil des Trackings. Verbotene Software zu verstecken riskiert das Konto.',
        },
      ],
    },
    {
      id: 'm8-l5',
      title: 'Timing-Tells & Online-Reads',
      duration: 8,
      intro:
        'Auch ohne Gesichter gibt es online Tells: Wie schnell jemand klickt, welche Beträge er wählt und wie er seinen Stack verwaltet, verrät mehr, als viele denken. Diese Lektion zeigt dir die wichtigsten Muster – und ihre Grenzen.',
      sections: [
        {
          heading: 'Insta-Aktionen: die vorgeklickten Buttons',
          body:
            'Poker-Software bietet Checkboxen, mit denen Spieler ihre Aktion **vorwählen**, bevor sie am Zug sind ("Check/Fold", "Call Any", "Check"). Diese Vorwahl erzeugt die auffälligste Klasse von Online-Tells: Aktionen, die **sofort** und ohne jede Denkzeit erfolgen.\n\n- **Insta-Check**: Häufig ein vorgeklicktes "Check/Fold" – der Spieler hatte kein Interesse an der Hand, bevor er die Action gesehen hat. Das ist eine Einladung, häufiger zu betten. Vorsicht bei der Wiederholung: Aufmerksame Gegner nutzen Insta-Checks gelegentlich auch mit starken Händen als Falle.\n- **Insta-Call**: Der Spieler hatte den Call schon beschlossen, bevor deine Bet kam – typisch für Draws und mittelstarke Hände, die nie ans Raisen dachten. Sehr starke Hände überlegen dagegen meist kurz, ob ein Raise besser wäre.\n- **Insta-Bet/Raise**: Oft eine vorgefasste, emotionale oder automatische Entscheidung; die Bandbreite reicht von Frust-Bluffs bis zu Auto-Value. Allein wenig verlässlich – erst in Kombination mit dem Sizing interessant.\n\nDie Logik hinter allen Insta-Tells ist dieselbe: **Null Denkzeit bedeutet, dass keine Entscheidung zwischen mehreren Optionen stattgefunden hat.** Was das konkret heißt, hängt von der Situation ab – aber es schließt bestimmte Handklassen aus, und genau das ist ein Read.',
          tip: 'Zieh Schlüsse aus Insta-Aktionen vor allem bei passiven Freizeitspielern. Regs kennen diese Tells selbst und bauen gelegentlich absichtlich falsche Signale ein.',
        },
        {
          heading: 'Der lange Tank – und was danach kommt',
          body:
            'Das Gegenstück zur Insta-Aktion ist der **Tank**: eine ungewöhnlich lange Denkpause, oft bis tief in die Time-Bank. Entscheidend ist weniger der Tank selbst als das, was danach passiert:\n\n- **Langer Tank, dann Check oder kleine Bet**: Bei Freizeitspielern oft echte Ratlosigkeit mit schwacher bis mittelmäßiger Hand – jemand hat lange überlegt und sich dann für die passivste bzw. billigste Option entschieden. Gegen dieses Muster darfst du tendenziell mehr Druck machen.\n- **Langer Tank, dann große Bet oder Raise**: Vorsicht. Ein Teil davon ist Hollywood – die klassische "schwere Entscheidung", die Stärke tarnen soll –, ein anderer Teil sind Spieler, die mit einem Monster über das optimale Sizing nachgedacht haben. Bei Freizeitspielern auf kleinen Limits ist die Kombination aus Tank und großer River-Aggression überdurchschnittlich oft stark.\n- **Genuiner Tank mit anschließendem Call**: Meist genau das, wonach es aussieht – eine echte Grenzentscheidung mit einem Bluffcatcher.\n\nZwei Einschränkungen gehören immer dazu: Multi-Tabler tanken ständig, weil an einem anderen Tisch gerade Action ist – ihr Timing ist überwiegend Rauschen. Und Verbindungsprobleme oder Ablenkung erzeugen dieselben Muster wie Strategie. Ein Timing-Read sollte deshalb nie allein eine große Entscheidung tragen.',
        },
        {
          heading: 'Sizing-Tells: Beträge sprechen',
          body:
            'Verlässlicher als Timing sind **Sizing-Tells** – denn das Sizing ist immer eine bewusste Wahl:\n\n- **Runde vs. krumme Beträge**: Wer den Bet-Slider oder die Standard-Buttons nutzt, produziert typische Werte (halber Pot, 2/3 Pot). Manuell eingetippte Beträge (z. B. 1,37 € in einen 2-€-Pot) verraten, dass jemand über genau diese Zahl nachgedacht hat – bei Freizeitspielern oft ein "Ich will einen billigen Showdown"- oder ein "Zahl mich bloß nicht aus"-Betrag.\n- **Min-Raises auf Turn und River**: Auf Micro-Limits eines der zuverlässigsten Muster überhaupt: Ein minimaler Raise gegen deine Bet auf späten Streets kommt von Freizeitspielern ganz überwiegend mit sehr starken Händen. Der Gedanke dahinter: "Ich will Action, aber ihn nicht verschrecken." Solche Raises ohne starke Hand zu callen ist ein verbreitetes Leak.\n- **Plötzliche Abweichung vom eigenen Muster**: Ein Spieler, der dreimal 60 % Pot gebettet hat und am River plötzlich 20 % oder 150 % wählt, sendet ein Signal. Kleine Blockbets sind oft dünne Showdown-Hände, plötzliche Overbets bei passiven Spielern fast immer Value.\n\nGoldene Regel für kleine Limits: **Ungewöhnliche Aggression von passiven Spielern ist Value, bis das Gegenteil bewiesen ist.** Freizeitspieler bluffen viel seltener in großen, seltsamen Sizings, als es sich am Tisch anfühlt.',
          example:
            'Du valuebettest Top Pair mit K♠ Q♦ auf K♥ 8♣ 3♦ 6♠ 2♣ am River. Ein passiver Freizeitspieler (AF 1,2), der bisher nur gecallt hat, min-raist deine Bet. Das ist auf Micro-Limits fast nie ein Bluff – meist zeigt er Two Pair oder besser. Ein disziplinierter Fold spart hier langfristig viel Geld.',
          cards: ['Ks', 'Qd'],
        },
        {
          heading: 'Stack-Größen und Auto-Rebuy als Information',
          body:
            'Noch bevor die erste Hand gespielt ist, liefert der Stack eines Gegners Hinweise:\n\n- **Konstant 100bb**: Wer immer mit vollem Stack sitzt und nach verlorenen Pötten sofort wieder auf 100bb steht, nutzt **Auto-Rebuy** (automatisches Auffüllen) – ein typisches Merkmal von Regs und ernsthaften Spielern. Kalibriere dich auf solide Ranges.\n- **Krumme Stacks** (z. B. 47bb oder 23bb): Der Spieler hat verloren und nicht aufgefüllt oder ist mit einem Teilbetrag eingestiegen. Beides deutet oft auf einen Freizeitspieler hin, der seinen Stack nicht aktiv managt. Häufig korreliert das mit passiverem, schwächerem Spiel – prüfe es aber am Tisch nach.\n- **Bewusste Short Stacks** (z. B. exakt der Minimum-Buy-in an jedem Tisch): Das kann eine absichtliche Kurzstack-Strategie sein – diese Spieler sind nicht schwach, sondern spielen ein enges Push-orientiertes Schema. Der Unterschied zum "vergessenen" krummen Stack: Konsistenz über Tische und Sessions.\n\nDazu kommen Kontextinfos: Sitzt derselbe Name an vielen Tischen gleichzeitig, ist es mit hoher Wahrscheinlichkeit ein Reg. Solche Vorab-Einschätzungen sind keine Gewissheiten, aber sie geben dir eine Startannahme, die du mit jedem Showdown aktualisierst – deutlich besser, als jede Session bei null zu beginnen.',
        },
        {
          heading: 'Verlässlichkeit: Sizing schlägt Timing',
          body:
            'Zum Schluss die wichtigste Einordnung: Online-Tells sind **Hinweise, keine Beweise** – und sie sind nicht gleich stark.\n\nDie Hierarchie in der Praxis:\n\n- **Sizing-Muster** sind am verlässlichsten, weil jede Betgröße eine aktive Entscheidung ist und Muster über viele Hände beobachtbar sind.\n- **Timing** ist deutlich schwächer: Multi-Tabling, Ablenkung, Verbindungsprobleme und bewusste Gegenmanipulation erzeugen ständig falsche Signale. Ein Timing-Read ist ein Zünglein an der Waage bei knappen Entscheidungen – nie das Hauptargument für einen Hero Call oder einen großen Bluff.\n- **Stack- und Kontext-Infos** liefern Startannahmen über den Spielertyp, die du laufend überprüfen musst.\n\nZwei Grundsätze machen aus Tells einen echten Edge statt einer Fehlerquelle: Erstens, gewichte Reads nach **Spielertyp** – bei ablenkungsanfälligen Freizeitspielern sind Timing- und Sizing-Tells ehrlich, bei erfahrenen Regs potenziell inszeniert. Zweitens, kombiniere: Wenn Timing, Sizing und die erzählte Handgeschichte alle in dieselbe Richtung zeigen, darfst du von der Standardlinie abweichen. Zeigt nur eines von dreien in eine Richtung, bleib bei der soliden Grundstrategie. Ein einzelner weicher Read hat noch niemandem einen Stack gerettet – aber schon vielen einen gekostet.',
          tip: 'Achte auch auf deine eigenen Muster: Nutze konsistente Sizings und variiere deine Denkzeit bewusst (die Time-Bank gehört dir). Wer selbst insta-callt und Monster immer antankt, verschenkt dieselben Informationen, die er bei anderen sucht.',
        },
      ],
      takeaways: [
        'Insta-Aktionen entstehen durch vorgeklickte Buttons: Insta-Check signalisiert Desinteresse, Insta-Call meist Draws oder mittlere Hände ohne Raise-Absicht.',
        'Min-Raises und ungewöhnliche Aggression von passiven Spielern auf Turn/River sind auf kleinen Limits ganz überwiegend Value.',
        'Manuell eingetippte, krumme Beträge und plötzliche Sizing-Abweichungen verraten eine bewusste Absicht – lies sie im Kontext.',
        'Auto-Rebuy auf 100bb deutet auf Regs, unaufgefüllte krumme Stacks oft auf Freizeitspieler; konsequente Min-Buy-ins sind dagegen Strategie.',
        'Sizing-Reads sind verlässlicher als Timing-Reads: Timing entscheidet höchstens knappe Spots, nie große allein.',
      ],
      quiz: [
        {
          question: 'Dein Gegner callt deine Turn-Bet ohne jede Denkzeit (Insta-Call). Welche Handklasse wird dadurch am unwahrscheinlichsten?',
          options: [
            'Ein Flush Draw',
            'Ein mittleres Paar',
            'Ein Monster wie ein Set, das ein Raise erwogen hätte',
            'Ein schwacher Bluffcatcher',
          ],
          correctIndex: 2,
          explanation:
            'Ein Insta-Call bedeutet: Die Entscheidung stand fest, bevor die Bet kam – es wurde nie zwischen Call und Raise abgewogen. Sehr starke Hände denken typischerweise zumindest kurz über einen Raise nach; Draws und mittlere Hände callen dagegen oft vorentschieden.',
        },
        {
          question: 'Ein passiver Freizeitspieler min-raist am River deine Value-Bet mit Top Pair. Was ist auf Micro-Limits die beste Standardreaktion?',
          options: [
            'Folden – dieses Muster ist bei passiven Spielern ganz überwiegend eine sehr starke Hand',
            '3-betten, um den offensichtlichen Bluff zu bestrafen',
            'Callen, weil Min-Raises immer schwach sind',
            'Callen, weil man River-Raises nie folden darf',
          ],
          correctIndex: 0,
          explanation:
            'Der Min-Raise auf späten Streets von passiven Spielern ist einer der verlässlichsten Online-Tells: Er will Action mit einem Monster, ohne dich zu verschrecken. Mit einem einfachen Top Pair ist der disziplinierte Fold langfristig klar am profitabelsten.',
        },
        {
          question: 'Warum sind Timing-Tells online grundsätzlich weniger verlässlich als Sizing-Tells?',
          options: [
            'Weil Denkzeiten von der Software zufällig verzögert werden',
            'Weil Timing durch Multi-Tabling, Ablenkung und bewusste Manipulation verrauscht ist, während jedes Sizing eine aktive Entscheidung darstellt',
            'Weil Sizing-Tells nur bei Regs funktionieren',
            'Sie sind nicht weniger verlässlich – Timing ist der stärkste Online-Read',
          ],
          correctIndex: 1,
          explanation:
            'Ein Tank kann Strategie sein – oder ein anderer Tisch, ein Anruf, eine schlechte Verbindung. Die Betgröße dagegen wählt der Spieler immer selbst, und Sizing-Muster lassen sich über viele Hände verifizieren. Deshalb gehört das größere Gewicht aufs Sizing.',
        },
        {
          question: 'Ein Spieler sitzt seit einer Stunde mit 41bb am Tisch und füllt nach verlorenen Pötten nicht auf. Was ist die plausibelste Ersteinschätzung?',
          options: [
            'Ein Profi mit bewusster Kurzstack-Strategie',
            'Ein Reg, dessen Auto-Rebuy technisch defekt ist',
            'Ein Freizeitspieler, der seinen Stack nicht aktiv managt – als Startannahme, die du am Tisch überprüfst',
            'Stackgrößen erlauben grundsätzlich keine Rückschlüsse',
          ],
          correctIndex: 2,
          explanation:
            'Bewusste Kurzstack-Spieler kaufen sich konsistent mit dem Minimum ein und halten diese Größe aktiv. Ein krummer, nicht aufgefüllter Stack deutet dagegen auf fehlendes Stack-Management – typisch für Freizeitspieler. Es bleibt eine Startannahme, kein Urteil.',
        },
        {
          question: 'Timing (langer Tank) spricht für Schwäche, aber das Sizing (Overbet eines passiven Spielers) für Stärke. Wie entscheidest du bei einem knappen Bluffcatch am River?',
          options: [
            'Dem Timing folgen und callen – Tanks sind fast immer schwach',
            'Eine Münze werfen, da sich die Reads aufheben',
            'Immer callen, um dir Informationen über den Gegner zu kaufen',
            'Dem Sizing folgen und folden – Sizing-Reads wiegen schwerer als Timing-Reads',
          ],
          correctIndex: 3,
          explanation:
            'Bei widersprüchlichen Signalen gewinnt das verlässlichere: Die Overbet eines passiven Freizeitspielers ist ein starkes Value-Signal, während der Tank durch Ablenkung oder Inszenierung entstanden sein kann. Ohne zusätzliche Evidenz ist der Fold die disziplinierte Wahl.',
        },
      ],
    },
    {
      id: 'm8-l6',
      title: 'Study-Workflow & Tools',
      duration: 10,
      intro:
        'Zwischen ambitionierten Spielern entscheidet nicht das Talent, sondern der Study-Workflow: Wie systematisch verwandelst du gespielte Hände in besseres Spiel? Diese Lektion baut dir eine komplette Lernroutine – von der Handmarkierung bis zum Wochenplan.',
      sections: [
        {
          heading: 'Markieren jetzt, analysieren später',
          body:
            'Die Grundlage jedes Study-Workflows ist die Trennung von **Spielzeit** und **Lernzeit**. Während der Session hast du genau eine Aufgabe: gute Entscheidungen treffen. Analyse mitten in der Session ist doppelt schädlich – sie bindet Aufmerksamkeit, die deine laufenden Tische brauchen, und sie passiert im emotional schlechtesten Moment, direkt nach dem Ärger über eine Hand.\n\nDeshalb: **Markieren statt grübeln.** Jede Poker-Software und jeder Tracker bietet eine Funktion, Hände mit einem Klick zu markieren. Markiere alles, was dich zögern ließ: unklare River-Entscheidungen, große verlorene Pötte, aber auch gewonnene Hände, bei denen du dir unsicher warst (die werden am häufigsten vergessen – gewonnen heißt nicht gut gespielt).\n\nNach der Session – oder besser: am nächsten Tag mit kühlem Kopf – gehst du die markierten Hände durch. Qualität schlägt Quantität: **Drei Hände gründlich** zu analysieren (Ranges zuweisen, Equity rechnen, Alternativen durchdenken, eine konkrete Lehre notieren) bringt mehr als dreißig Hände im Schnelldurchlauf. Führe dabei eine simple Leak-Liste: Wiederholt sich ein Fehlertyp ("calle River zu oft gegen passive Spieler"), hast du dein nächstes Study-Thema gefunden.',
          tip: 'Beende jede Review-Einheit mit einem Satz, den du aufschreibst: "Nächste Session achte ich auf X." Ein konkreter Vorsatz pro Review verändert mehr als zehn vage Erkenntnisse.',
        },
        {
          heading: 'Equity-Rechner richtig nutzen',
          body:
            'Ein **Equity-Rechner** (wie der Trainer in dieser App) berechnet, wie oft eine Hand oder Range gegen eine andere gewinnt. Er ist das wichtigste Einsteiger-Study-Tool – wenn du ihn richtig einsetzt:\n\n- **Hand gegen Range, nicht Hand gegen Hand**: "Mein Top Pair gegen sein Set" zu rechnen ist Ergebnis-Denken. Die richtige Frage lautet: "Mein Top Pair gegen alle Hände, die er hier plausibel spielt." Weise dem Gegner eine ehrliche Range zu und rechne dagegen.\n- **Standard-Matchups auswendig lernen**: Einige Zahlen solltest du im Schlaf kennen, z. B.: Flush Draw am Flop trifft bis zum River rund 35 %, ein offenes Straight Draw rund 31 %. Ein Overpair gegen ein kleineres Paar liegt vor dem Flop bei etwa 80 %, zwei Overcards gegen ein Paar (das klassische "Coinflip" wie A♣ K♦ gegen 8♠ 8♥) bei etwa 45 zu 55.\n- **Mit Pot Odds verbinden**: Equity allein entscheidet nichts. Erst der Vergleich mit dem Preis (Pot Odds) macht daraus eine Entscheidung: 25 % Equity sind ein klarer Call, wenn du nur 15 % brauchst – und ein klarer Fold, wenn du 33 % brauchst.\n\nNutze den Rechner im Review für jede markierte Hand: Erst schätzen, dann rechnen. Die Differenz zwischen Schätzung und Ergebnis ist dein Lernfortschritt – mit der Zeit brauchst du den Rechner für Standardspots gar nicht mehr.',
          cards: ['Ac', 'Kd', '8s', '8h'],
        },
        {
          heading: 'Solver: die Grundidee in einfachen Worten',
          body:
            'Über kaum ein Tool wird mehr geredet als über **Solver** (GTO-Software wie PioSOLVER oder GTO Wizard). Die Grundidee ist einfacher, als der Hype vermuten lässt: Ein Solver bekommt eine konkrete Situation vorgegeben – die Ranges beider Spieler, die Stacktiefe, das Board und erlaubte Betgrößen – und berechnet dann eine **Gleichgewichtsstrategie** (GTO, Game Theory Optimal): eine Spielweise für beide Seiten, bei der sich kein Spieler durch Abweichen verbessern kann. Das Ergebnis sind Frequenzen ("diese Hand bettet zu 70 %, checkt zu 30 %") statt einfacher Ja/Nein-Antworten.\n\nWofür Solver gut sind:\n\n- **Prinzipien lernen**: Welche Boards begünstigen wessen Range? Wann sind kleine, wann große Bets sinnvoll? Welche Handklassen eignen sich als Bluffs? Diese Muster verallgemeinern sich auf viele Situationen.\n- **Eigene Linien überprüfen**: War meine River-Overbet grundsätzlich vertretbar oder eine Erfindung des Moments?\n\nWofür Solver schlecht sind:\n\n- **Blindes Kopieren gegen schwache Gegner**: GTO ist die Verteidigungsstrategie gegen perfekte Gegner. Gegen einen Spieler, der zu viel callt, ist die beste Antwort nicht Gleichgewicht, sondern Ausbeutung: mehr Value, weniger Bluffs.\n- **Frequenz-Detailtreue**: Ob eine Hand zu 70 oder 55 % gebettet wird, ist für dein Ergebnis auf Micro-Limits bedeutungslos.\n\nFür Micro-Limits gilt: Solver-**Konzepte** verstehen lohnt sich, Solver-**Frequenzen** auswendig lernen nicht.',
        },
        {
          heading: 'Lernquellen sinnvoll kombinieren',
          body:
            'Das Angebot an Pokerwissen ist riesig – die Kunst liegt in der Auswahl:\n\n- **Videos und Streams**: Trainingsvideos, in denen starke Spieler ihre Entscheidungen laut begründen, sind der schnellste Einstieg in modernes Denken. Achte auf Inhalte zu deinem Format und Limit – NL2 spielt sich anders als High Stakes. Reine Highlight-Clips sind Unterhaltung, kein Training.\n- **Foren und Communities**: Hände posten und diskutieren zwingt dich, Entscheidungen zu begründen – einer der stärksten Lerneffekte überhaupt. Lies kritisch: Auch selbstbewusste Antworten können falsch sein.\n- **Bücher-Klassiker**: "The Theory of Poker" (David Sklansky) für zeitlose Grundkonzepte, "Applications of No-Limit Hold\'em" (Matthew Janda) und "Modern Poker Theory" (Michael Acevedo) für theoriebasiertes No-Limit-Spiel, "The Mental Game of Poker" (Jared Tendler) für Tilt und Mindset. Bücher sind langsamer als Videos, aber tiefer.\n- **Coaching und Lerngruppen**: Ein guter Coach findet deine Leaks schneller als jedes Selbststudium – sinnvoll aber erst, wenn Grundlagen und eigene Datenbasis stehen. Günstiger und oft fast so wirksam: eine feste Study-Gruppe, die wöchentlich Hände tauscht.\n\nDie wichtigste Regel: **Aktiv schlägt passiv.** Eine Stunde eigene Hände analysieren und diskutieren bringt mehr als drei Stunden Videos nebenbei laufen zu lassen.',
        },
        {
          heading: 'Dein Wochen-Lernplan',
          body:
            'Wissen wird erst durch Routine zu Können. Ein bewährtes Verhältnis für ambitionierte Freizeitspieler ist etwa **3:1 bis 4:1 zwischen Spielzeit und Studienzeit** – wer nur spielt, wiederholt seine Fehler; wer nur studiert, dem fehlt die Praxis, an der sich die Theorie beweisen muss.\n\nDrei Prinzipien machen einen Wochenplan wirksam:\n\n- **Verzahnung**: Jede Session startet mit dem Fokusvorsatz aus dem letzten Review, jeder Review speist sich aus den markierten Händen der letzten Session. Spielen und Studieren bilden einen Kreislauf, keine getrennten Welten.\n- **Ein Thema pro Woche**: Arbeite gezielt an deinem aktuell größten Leak (z. B. Blind Defense oder River-Calls) statt an allem gleichzeitig. Themenwechsel erst, wenn sich im Spiel etwas messbar verändert hat.\n- **Kleine, feste Einheiten**: 30–45 Minuten konzentriertes Studieren schlagen den seltenen Vier-Stunden-Marathon, weil sie tatsächlich stattfinden.\n\nDer folgende Beispielplan verteilt rund acht Stunden Poker pro Woche – passe die Dauer an dein Leben an, aber behalte die Struktur: Session, Review, Theorie im Wechsel und ein bewusst freier Tag als Abstand vom Spiel.',
          table: {
            headers: ['Tag', 'Aktivität', 'Dauer'],
            rows: [
              ['Montag', 'Session (Fokusvorsatz aus letztem Review)', '90 Min.'],
              ['Dienstag', 'Review: 3 markierte Hände + Equity-Rechner', '30 Min.'],
              ['Mittwoch', 'Session', '90 Min.'],
              ['Donnerstag', 'Theorie: Video oder Buchkapitel zum aktuellen Leak', '45 Min.'],
              ['Freitag', 'Session', '90 Min.'],
              ['Samstag', 'Review + eine Hand im Forum/der Study-Gruppe diskutieren', '45 Min.'],
              ['Sonntag', 'Frei – bewusste Pause', '—'],
            ],
          },
          tip: 'Plane Study-Einheiten wie Termine fest in den Kalender – "irgendwann diese Woche" findet nie statt. Und halte den freien Tag ein: Abstand schützt vor Übersättigung und ist gelebter verantwortungsvoller Umgang mit dem Spiel.',
        },
      ],
      takeaways: [
        'Trenne Spielen und Lernen: Hände in der Session nur markieren, Analyse erst danach mit kühlem Kopf.',
        'Rechne im Review Hand gegen Range (nicht gegen einzelne Hände) und verbinde Equity immer mit Pot Odds.',
        'Solver berechnen Gleichgewichtsstrategien – lerne die Konzepte dahinter, statt Frequenzen zu kopieren; gegen schwache Gegner schlägt Exploit das Gleichgewicht.',
        'Aktives Lernen (eigene Hände analysieren, diskutieren) schlägt passiven Videokonsum deutlich.',
        'Ein fester Wochenplan mit etwa 3:1 bis 4:1 Spiel- zu Studienzeit und einem freien Tag macht Fortschritt planbar.',
      ],
      quiz: [
        {
          question: 'Warum solltest du eine strittige Hand während der Session nur markieren statt sie sofort zu analysieren?',
          options: [
            'Weil Analyse während der Session die Aufmerksamkeit der laufenden Tische bindet und im emotional schlechtesten Moment stattfindet',
            'Weil die Handhistorie erst nach der Session verfügbar ist',
            'Weil Analysen am Tisch gegen die Nutzungsbedingungen verstoßen',
            'Weil markierte Hände automatisch vom Tracker gelöst werden',
          ],
          correctIndex: 0,
          explanation:
            'In der Session ist deine Aufgabe, Entscheidungen zu treffen – nicht, vergangene zu bewerten. Direkt nach einem Ärger-Pot analysierst du zudem emotional verzerrt. Markieren dauert einen Klick, die saubere Analyse folgt später mit kühlem Kopf.',
        },
        {
          question: 'Was ist der wichtigste Grundsatz beim Arbeiten mit einem Equity-Rechner?',
          options: [
            'Immer die exakte Hand des Gegners eingeben, sobald der Showdown sie zeigt',
            'Deine Hand gegen die plausible Range des Gegners rechnen und das Ergebnis mit den Pot Odds vergleichen',
            'Nur Preflop-Situationen rechnen, weil Postflop zu komplex ist',
            'Equity über 50 % bedeutet immer Call, darunter immer Fold',
          ],
          correctIndex: 1,
          explanation:
            'Gegen die eine aufgedeckte Hand zu rechnen ist Ergebnis-Denken – entscheidend ist die gesamte plausible Range. Und Equity wird erst im Vergleich zum Preis zur Entscheidung: 30 % Equity können je nach Pot Odds ein klarer Call oder ein klarer Fold sein.',
        },
        {
          question: 'Was berechnet ein Solver im Kern?',
          options: [
            'Die Gewinnwahrscheinlichkeit deiner Hand gegen eine zufällige Hand',
            'Die profitabelste Ausbeutungsstrategie gegen den konkreten Gegner am Tisch',
            'Eine Gleichgewichtsstrategie für eine definierte Situation, bei der sich kein Spieler durch Abweichen verbessern kann',
            'Die Wahrscheinlichkeit, mit der der Gegner blufft',
          ],
          correctIndex: 2,
          explanation:
            'Ein Solver bekommt Ranges, Stacks, Board und Betgrößen vorgegeben und findet dazu die GTO-Gleichgewichtsstrategie in Form von Frequenzen. Gegner-Exploits berechnet er gerade nicht – dafür müsstest du die Fehler des Gegners erst als Annahme einbauen.',
        },
        {
          question: 'Dein Gegner auf NL2 callt viel zu oft (Calling Station). Was ist die richtige Konsequenz aus der Solver-Lektion?',
          options: [
            'Exakt die GTO-Frequenzen spielen, weil sie unausbeutbar sind',
            'Vom Gleichgewicht abweichen: deutlich mehr und dünner value-betten, kaum noch bluffen',
            'Mehr bluffen, weil der Solver Bluffs in jeder Range vorsieht',
            'Den Solver mit höheren Stakes füttern, um bessere Antworten zu bekommen',
          ],
          correctIndex: 1,
          explanation:
            'GTO ist die Verteidigung gegen perfekte Gegner. Gegen systematische Fehler – hier: zu viele Calls – ist die gezielte Abweichung profitabler: Bluffs verlieren an Wert, dünne Value-Bets gewinnen massiv. Genau dafür ist Exploit-Spiel da.',
        },
        {
          question: 'Welche Wochenroutine entspricht am besten den Prinzipien dieser Lektion (bei ca. 8 Stunden Zeit für Poker)?',
          options: [
            '8 Stunden spielen – Praxis ist durch nichts zu ersetzen',
            '6 Stunden Trainingsvideos schauen, 2 Stunden spielen',
            '8 Stunden an einem einzigen Tag: 4 spielen, 4 studieren',
            'Etwa 6 Stunden spielen und 2 Stunden aktiv studieren (Review, Theorie, Hände diskutieren), verteilt über die Woche, mit einem freien Tag',
          ],
          correctIndex: 3,
          explanation:
            'Ein Verhältnis von etwa 3:1 zwischen Spiel- und aktiver Studienzeit, über die Woche verteilt und mit bewusster Pause, verbindet Praxis, Analyse und Erholung. Nur spielen wiederholt Fehler, überwiegend passiver Videokonsum baut kaum Können auf, und Marathon-Tage sind weder lern- noch konzentrationsfreundlich.',
        },
      ],
    },
  ],
};

export default m8;
