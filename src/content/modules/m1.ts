import type { Module } from '../types';

const m1: Module = {
  id: 'm1',
  title: 'Grundlagen',
  subtitle: 'Regeln, Handrankings und die Basis für alles Weitere',
  icon: '🎓',
  level: 'Einsteiger',
  lessons: [
    {
      id: 'm1-l1',
      title: 'So funktioniert Texas Hold\'em',
      duration: 9,
      intro:
        'Texas Hold\'em ist in fünf Minuten erklärt und dauert ein Leben lang zu meistern. Diese Lektion führt dich einmal komplett durch eine Hand – von den Blinds bis zum Showdown.',
      sections: [
        {
          heading: 'Das Ziel des Spiels',
          body:
            'Texas Hold\'em wird mit einem Standarddeck aus **52 Karten** gespielt. Jeder Spieler erhält zwei verdeckte Karten, die **Hole Cards**, die nur ihm gehören. Dazu kommen im Lauf der Hand bis zu fünf offene Gemeinschaftskarten (**Community Cards**) in die Tischmitte, die allen Spielern gemeinsam zur Verfügung stehen.\n\nDeine finale Hand ist immer die **beste Fünf-Karten-Kombination** aus diesen sieben Karten. Dabei darfst du beide Hole Cards nutzen, nur eine oder sogar keine – im letzten Fall spielst du das Board.\n\nEs gibt genau zwei Wege, einen Pot zu gewinnen:\n\n- Du hältst am **Showdown** die beste Hand.\n- Alle anderen Spieler **folden**, bevor es zum Showdown kommt – dann gewinnst du sofort, egal welche Karten du hältst.\n\nDieser zweite Weg ist der Grund, warum Poker ein Strategiespiel ist und kein reines Kartenglück: Ein großer Teil aller Pötte wird ohne Showdown entschieden. Langfristig gewinnt nicht, wer die besten Karten bekommt, sondern wer mit seinen Karten die besseren Entscheidungen trifft.',
          tip: 'Denke von Anfang an in Entscheidungen, nicht in Ergebnissen. Eine gut gespielte Hand kann verlieren, eine schlecht gespielte gewinnen – auf lange Sicht zählt nur die Qualität deiner Entscheidungen.',
        },
        {
          heading: 'Blinds und der Dealer-Button',
          body:
            'Ohne Zwangseinsätze würde jeder einfach auf Asse warten. Deshalb gibt es die **Blinds**: Der Spieler links vom **Dealer-Button** zahlt den **Small Blind** (SB), der Spieler links davon den **Big Blind** (BB) – typischerweise ist der Small Blind halb so groß wie der Big Blind, etwa 0,50/1 oder 1/2.\n\nDer Dealer-Button ist eine kleine Scheibe, die markiert, wer formal der Kartengeber ist. Nach jeder Hand wandert der Button **im Uhrzeigersinn** einen Platz weiter. Dadurch rotieren auch die Blinds um den Tisch, und jeder Spieler zahlt sie gleich oft – das Spiel bleibt fair.\n\nDie Blinds erfüllen zwei Funktionen:\n\n- Sie legen einen **Grundpot** an, um den es sich zu kämpfen lohnt.\n- Sie zwingen zur Aktion: Wer nur wartet, verliert Runde für Runde seine Blinds.\n\nDie Größe des Big Blind ist außerdem die zentrale Maßeinheit im Poker. Stackgrößen und Einsätze werden in **Big Blinds (bb)** angegeben – ein Standard-Stack im Cash Game sind 100bb. So kannst du Situationen unabhängig vom konkreten Geldbetrag vergleichen.',
          example:
            'An einem 1/2-Tisch sitzt du mit 200 Einheiten – also 100bb. Der Spieler links vom Button zahlt 1 (Small Blind), der nächste 2 (Big Blind). Im Pot liegen damit schon 3 Einheiten, bevor irgendjemand seine Karten angesehen hat.',
        },
        {
          heading: 'Preflop: Die erste Setzrunde',
          body:
            'Nachdem alle Spieler ihre zwei Hole Cards erhalten haben, beginnt die erste Setzrunde: **Preflop**. Es startet der Spieler links vom Big Blind – diese Position heißt **UTG** (Under the Gun). Er hat drei Möglichkeiten:\n\n- **Fold**: Karten weglegen und die Hand aufgeben.\n- **Call**: den Big Blind bezahlen (auch **Limp** genannt).\n- **Raise**: erhöhen, üblicherweise auf das 2- bis 3-Fache des Big Blind.\n\nDanach geht die Aktion im Uhrzeigersinn weiter, bis alle Spieler entweder gefoldet oder den gleichen Betrag bezahlt haben. Eine Besonderheit hat der Big Blind: Er hat bereits einen vollen Einsatz im Pot. Wurde vor ihm nicht erhöht, darf er kostenlos **checken** und den Flop ansehen; wurde erhöht, muss auch er callen, raisen oder folden.\n\nSchon hier zeigt sich ein Grundprinzip guter Strategie: Wer preflop einsteigt, sollte das meist mit einem Raise tun, nicht mit einem Limp. Ein Raise baut den Pot mit einer starken Hand auf, verdrängt schwächere Hände und verschafft dir die **Initiative** für die weiteren Setzrunden.',
        },
        {
          heading: 'Flop, Turn und River',
          body:
            'Nach der Preflop-Runde folgen drei weitere Straßen, jeweils mit eigener Setzrunde:\n\n- **Flop**: Die ersten drei Gemeinschaftskarten werden gleichzeitig aufgedeckt.\n- **Turn**: Die vierte Gemeinschaftskarte kommt dazu.\n- **River**: Die fünfte und letzte Gemeinschaftskarte komplettiert das Board.\n\nAb dem Flop ändert sich die Reihenfolge: Es beginnt nicht mehr UTG, sondern der **erste noch aktive Spieler links vom Button** – meist der Small Blind. Der Spieler auf dem Button handelt postflop immer als Letzter, ein enormer Vorteil, den wir in Lektion 3 genau beleuchten.\n\nSolange noch niemand gesetzt hat, kannst du **checken** (schieben) oder selbst eine **Bet** machen. Sobald eine Bet im Raum steht, bleiben Call, Raise oder Fold. Eine Setzrunde endet, wenn alle aktiven Spieler den gleichen Betrag bezahlt haben oder alle gecheckt haben.\n\nIm Live-Poker verbrennt der Dealer vor Flop, Turn und River jeweils eine Karte verdeckt (**Burn Card**) – ein historischer Schutz gegen markierte Karten, der am Spiel selbst nichts ändert.',
          example:
            'Du hältst A♥ K♥, der Flop kommt K♠ 8♥ 3♦. Du hast Top Pair mit bestem Kicker getroffen. Der Turn bringt die 8♦, der River die 2♣ – dein finales Blatt ist zwei Paare: Könige und Achten mit Ass-Kicker (K-K-8-8-A).',
        },
        {
          heading: 'Der Showdown',
          body:
            'Sind nach der River-Setzrunde noch mindestens zwei Spieler übrig, kommt es zum **Showdown**: Die Hole Cards werden aufgedeckt, die beste Fünf-Karten-Hand gewinnt den Pot.\n\nFür die Reihenfolge des Aufdeckens gilt: Wer auf dem River zuletzt gesetzt oder erhöht hat (der letzte **Aggressor**), zeigt zuerst. Wurde der River nur durchgecheckt, beginnt der erste aktive Spieler links vom Button. Wer sieht, dass er geschlagen ist, darf seine Karten auch ungezeigt wegwerfen (**mucken**) – verzichtet damit aber auf jeden Anspruch auf den Pot.\n\nHaben zwei oder mehr Spieler exakt gleichwertige Fünf-Karten-Hände, wird der Pot geteilt (**Split Pot**). Wichtig: Es zählen nur die besten fünf Karten – eine sechste oder siebte Karte kann niemals als Tiebreaker dienen.\n\nDanach schiebt der Dealer den Pot zum Gewinner, der Button wandert einen Platz weiter, und die nächste Hand beginnt. Eine komplette Hand dauert online oft unter einer Minute – genau diese hohe Frequenz macht Poker so lernintensiv: Du triffst hunderte Entscheidungen pro Stunde.',
          tip: 'Wenn du unsicher bist, wer gewonnen hat: Lege einfach deine Karten offen hin. Der Dealer (oder die Software) ermittelt die beste Hand – im Zweifel niemals selbst mucken.',
        },
      ],
      takeaways: [
        'Deine Hand ist immer die beste Fünf-Karten-Kombination aus zwei Hole Cards und fünf Community Cards.',
        'Es gibt zwei Wege zu gewinnen: die beste Hand am Showdown oder alle Gegner zum Folden bringen.',
        'Blinds sind Zwangseinsätze, die Aktion erzwingen; Button und Blinds rotieren im Uhrzeigersinn.',
        'Preflop beginnt UTG (links vom Big Blind), ab dem Flop beginnt der erste aktive Spieler links vom Button.',
        'Vier Setzrunden strukturieren jede Hand: Preflop, Flop, Turn, River – danach folgt der Showdown.',
      ],
      quiz: [
        {
          question: 'Welcher Spieler muss preflop als Erster handeln?',
          options: [
            'Der Spieler auf dem Button',
            'Der Small Blind',
            'Der Spieler links vom Big Blind (UTG)',
            'Der Big Blind',
          ],
          correctIndex: 2,
          explanation:
            'Preflop beginnt der Spieler links vom Big Blind, genannt UTG (Under the Gun). Die Blinds haben bereits Einsätze im Pot und handeln preflop zuletzt.',
        },
        {
          question: 'Wer eröffnet die Setzrunde nach dem Flop, wenn alle Spieler noch in der Hand sind?',
          options: [
            'UTG, wie preflop',
            'Der Small Blind als erster aktiver Spieler links vom Button',
            'Der Spieler, der preflop erhöht hat',
            'Der Button, weil er der Dealer ist',
          ],
          correctIndex: 1,
          explanation:
            'Postflop beginnt immer der erste noch aktive Spieler links vom Button – in der Regel der Small Blind. Der Button handelt postflop stets als Letzter.',
        },
        {
          question: 'Du hältst 7♣ 2♦ und das Board zeigt A-K-Q-J-T in verschiedenen Farben. Welche Hand spielst du am Showdown?',
          options: [
            'High Card Ass mit 7er-Kicker',
            'Die Straße auf dem Board – du spielst alle fünf Gemeinschaftskarten',
            'Gar keine, weil deine Hole Cards nicht passen',
            'Ein Paar, weil eine Hole Card zählen muss',
          ],
          correctIndex: 1,
          explanation:
            'Deine Hand ist die beste Fünf-Karten-Kombination aus sieben Karten. Du darfst beide, eine oder keine Hole Card nutzen – hier spielst du das Board (A-K-Q-J-T).',
        },
        {
          question: 'Warum gibt es überhaupt Blinds?',
          options: [
            'Sie belohnen den Dealer für das Austeilen',
            'Sie erzwingen Aktion und sorgen dafür, dass in jedem Pot etwas zu gewinnen ist',
            'Sie gleichen den Nachteil der frühen Positionen aus',
            'Sie sind eine Gebühr an den Kartenraum',
          ],
          correctIndex: 1,
          explanation:
            'Ohne Blinds könnte jeder risikofrei auf Premiumhände warten. Die Zwangseinsätze legen einen Grundpot an und bestrafen reines Abwarten.',
        },
        {
          question: 'Alle deine Gegner folden auf deine Bet am Turn. Was passiert?',
          options: [
            'Du musst deine Hand zeigen, um den Pot zu bekommen',
            'Der Pot wird zwischen dir und dem letzten Folder geteilt',
            'Du gewinnst den Pot sofort, ohne deine Karten zu zeigen',
            'Die Hand wird trotzdem bis zum River ausgespielt',
          ],
          correctIndex: 2,
          explanation:
            'Folden alle Gegner, gewinnst du den Pot sofort und musst deine Karten nicht zeigen. Das ist der zweite Gewinnweg neben dem Showdown – und er macht Bluffs überhaupt erst möglich.',
        },
      ],
    },
    {
      id: 'm1-l2',
      title: 'Die Handrankings',
      duration: 10,
      intro:
        'Die zehn Handkategorien musst du im Schlaf beherrschen – jede Entscheidung am Tisch baut darauf auf. Diese Lektion zeigt dir alle Rankings, das Kicker-Konzept und die Fallen, in die Anfänger am häufigsten tappen.',
      sections: [
        {
          heading: 'Die 10 Kategorien im Überblick',
          body:
            'Alle Pokerhände lassen sich in zehn Kategorien einordnen. Die Rangfolge ist kein Zufall, sondern spiegelt die **Seltenheit** wider: Je unwahrscheinlicher eine Hand, desto höher ihr Rang. Ein Flush schlägt eine Straße, weil er seltener vorkommt – nicht weil er hübscher aussieht.\n\nInnerhalb jeder Kategorie entscheidet die Höhe der Karten: Ein Flush mit Ass schlägt einen Flush mit König, ein Paar Asse schlägt ein Paar Könige. Die Farben (Pik, Herz, Karo, Kreuz) sind dabei **völlig gleichwertig** – es gibt im Poker keine Rangfolge der Farben.\n\nDie Tabelle zeigt alle zehn Kategorien mit der ungefähren Wahrscheinlichkeit, dass deine beste Fünf-Karten-Hand aus sieben Karten (also am River in Hold\'em) genau in diese Kategorie fällt. Präge dir vor allem die Reihenfolge im Mittelfeld ein: **Full House schlägt Flush, Flush schlägt Straße, Straße schlägt Drilling** – genau dort passieren die meisten teuren Verwechslungen.',
          table: {
            headers: ['Rang', 'Hand', 'Beispiel', 'Häufigkeit am River'],
            rows: [
              ['1', 'Royal Flush', 'A-K-Q-J-T in einer Farbe', '~0,003 %'],
              ['2', 'Straight Flush', '9-8-7-6-5 in einer Farbe', '~0,03 %'],
              ['3', 'Vierling (Quads)', 'Q-Q-Q-Q-7', '~0,17 %'],
              ['4', 'Full House', 'K-K-K-9-9', '~2,6 %'],
              ['5', 'Flush', 'A-J-8-5-2 in einer Farbe', '~3,0 %'],
              ['6', 'Straße (Straight)', '9-8-7-6-5 gemischt', '~4,6 %'],
              ['7', 'Drilling (Trips/Set)', '7-7-7-K-2', '~4,8 %'],
              ['8', 'Zwei Paare (Two Pair)', 'J-J-8-8-A', '~23,5 %'],
              ['9', 'Ein Paar (One Pair)', 'T-T-A-7-4', '~43,8 %'],
              ['10', 'High Card', 'A-Q-9-6-3', '~17,4 %'],
            ],
          },
        },
        {
          heading: 'Die Monster: Royal Flush bis Full House',
          body:
            'Ganz oben thront der **Royal Flush**: A-K-Q-J-T in derselben Farbe – die bestmögliche Hand, unschlagbar und extrem selten. Er ist genau genommen nur der höchste **Straight Flush**, also fünf aufeinanderfolgende Karten einer Farbe. Ein Straight Flush wie 9♥ 8♥ 7♥ 6♥ 5♥ schlägt alles außer einem höheren Straight Flush.\n\nDer **Vierling** (Four of a Kind, Quads) besteht aus allen vier Karten eines Rangs plus einer Beikarte. Halten zwei Spieler einen Vierling – möglich, wenn er auf dem Board liegt – entscheidet die Beikarte.\n\nDas **Full House** kombiniert einen Drilling mit einem Paar, etwa K-K-K-9-9, gelesen als Könige voll mit Neunen. Beim Vergleich zweier Full Houses zählt zuerst der Drilling, dann das Paar: K-K-K-2-2 schlägt Q-Q-Q-A-A, denn die Könige im Drilling stechen die Damen – die Asse im Paar spielen erst bei gleichem Drilling eine Rolle.\n\nDiese Hände sind so stark, dass die Frage selten lautet, ob du gewinnst, sondern wie du den Pot **maximal groß** bekommst. Merke dir trotzdem: Auch Monster verlieren gelegentlich – ein Flush über Flush oder Full House über Full House gehört zu den teuersten Situationen im Poker (Cooler genannt).',
          cards: ['As', 'Ks', 'Qs', 'Js', 'Ts'],
          example:
            'Board: K♦ K♣ 9♠ 9♦ 2♥. Spieler A hält K♥ Q♥ (Full House Könige voll mit Neunen), Spieler B hält 9♣ 8♣ (Full House Neunen voll mit Königen). A gewinnt klar – der höhere Drilling entscheidet, nicht das Paar.',
        },
        {
          heading: 'Das Mittelfeld: Flush, Straße, Drilling',
          body:
            'Der **Flush** besteht aus fünf Karten derselben Farbe, die nicht aufeinanderfolgen. Beim Vergleich zweier Flushes zählt die höchste Karte, bei Gleichheit die zweithöchste und so weiter. Ein Flush mit Ass (**Nut Flush**) ist unschlagbar unter den Flushes.\n\nDie **Straße** (Straight) sind fünf aufeinanderfolgende Karten in gemischten Farben. Das Ass ist flexibel: Es bildet die höchste Straße A-K-Q-J-T (**Broadway**) und die niedrigste Straße 5-4-3-2-A (**Wheel**). Was nicht geht: eine Straße um die Ecke wie K-A-2-3-4 – das Ass steht entweder ganz oben oder ganz unten, nie in der Mitte.\n\nDer **Drilling** (drei Karten eines Rangs) hat im Hold\'em zwei Namen, die du kennen solltest: Ein **Set** triffst du mit einem Pocket Pair plus einer passenden Boardkarte – stark und gut versteckt. **Trips** entstehen, wenn ein Paar auf dem Board liegt und du die dritte Karte hältst – ebenfalls stark, aber für alle sichtbarer und anfälliger dafür, dass ein Gegner dieselben Trips mit besserem Kicker hält.\n\nDie Reihenfolge dieser drei Kategorien musst du sicher abrufen können: **Flush schlägt Straße, Straße schlägt Drilling.** Beide Verwechslungen kosten Anfänger regelmäßig ganze Stacks.',
          cards: ['Ad', '2c', '3h', '4s', '5d'],
          tip: 'Merkhilfe für das Mittelfeld: Je schwerer zu treffen, desto höher der Rang. Fünf gleichfarbige Karten sind seltener als fünf aufeinanderfolgende – deshalb Flush über Straße.',
        },
        {
          heading: 'Der Kicker entscheidet',
          body:
            'Die häufigste Showdown-Situation ist unspektakulär: Beide Spieler halten dasselbe Paar. Dann entscheidet der **Kicker** – die höchste Beikarte, die mit in die Fünf-Karten-Hand einzieht.\n\nEin Beispiel: Board A♣ 8♠ 6♥ 4♦ 2♣. Spieler A hält A♥ K♦, Spieler B hält A♦ Q♦. Beide haben ein Paar Asse, aber die vollständigen Hände lauten A-A-K-8-6 gegen A-A-Q-8-6. Der König schlägt die Dame – Spieler A gewinnt. Genau deshalb sind Hände wie A♥ K♦ so viel wertvoller als A♦ 7♣: Trifft das Ass, gewinnst du mit dem besseren Kicker die großen Duelle Paar gegen Paar. Man sagt: A7 ist von AK **dominiert**.\n\nWichtig ist die Grenze des Konzepts: Es zählen immer nur **fünf Karten**. Wenn dein Kicker es nicht in die beste Fünf-Karten-Hand schafft, ist er wertlos – er wird vom Board verdrängt. Prüfe am Showdown also nie nur, wer das höhere Paar hat, sondern baue beide kompletten Fünf-Karten-Hände und vergleiche sie Karte für Karte. Diese Disziplin schützt dich vor Fehleinschätzungen, die selbst erfahrenen Spielern noch unterlaufen.',
          cards: ['Ah', 'Kd', 'Ad', 'Qd'],
        },
        {
          heading: 'Split Pots und typische Verwechslungen',
          body:
            'Sind die besten Fünf-Karten-Hände exakt gleich, wird der Pot geteilt. Das passiert öfter, als Anfänger denken – vor allem, wenn das Board die Hände angleicht. Beispiel: Board A♠ K♥ Q♦ J♣ 3♠, Spieler A hält A♥ 2♥, Spieler B hält A♦ 9♦. Beide spielen A-A-K-Q-J – die 2 und die 9 schaffen es nicht in die besten fünf Karten. Split Pot, obwohl B den besseren Kicker zu halten scheint.\n\nDie häufigsten Anfängerfehler im Überblick:\n\n- **Straße über Flush gelegt**: Falsch – der Flush gewinnt, weil er seltener ist.\n- **Zwei Paare über Drilling gelegt**: Falsch – der Drilling gewinnt.\n- **Farben-Rangfolge erfunden**: Pik-Flush schlägt angeblich Herz-Flush – falsch, es entscheidet allein die Kartenhöhe.\n- **Straße um die Ecke**: K-A-2-3-4 ist keine Straße.\n- **Sechs Karten gezählt**: Zwei Paare plus ein drittes Paar ergeben trotzdem nur zwei Paare – die besten zwei zählen, dazu der höchste Kicker.\n\nNimm dir bei jedem Showdown die zwei Sekunden, beide Hände sauber als fünf Karten auszusprechen. Aus dieser Routine entsteht die Sicherheit, auf der jede weitere Strategie aufbaut.',
          example:
            'Board 7♥ 7♦ 5♣ 5♠ Q♦. Du hältst 9♠ 9♣. Deine Hand ist NICHT drei Paare, sondern Zwei Paare: Neunen und Siebenen mit Dame als Kicker (9-9-7-7-Q). Die Fünfen fallen komplett aus der Wertung.',
        },
      ],
      takeaways: [
        'Die Rangfolge spiegelt Seltenheit: Full House schlägt Flush, Flush schlägt Straße, Straße schlägt Drilling.',
        'Farben sind gleichwertig – bei gleichen Kategorien entscheidet allein die Kartenhöhe.',
        'Der Kicker entscheidet Duelle mit gleichem Paar, zählt aber nur, wenn er in die besten fünf Karten einzieht.',
        'Das Ass spielt oben (Broadway A-K-Q-J-T) und unten (Wheel 5-4-3-2-A), aber nie um die Ecke.',
        'Vergleiche am Showdown immer komplette Fünf-Karten-Hände – niemals mehr, niemals weniger.',
      ],
      quiz: [
        {
          question: 'Dein Gegner zeigt eine Straße (T-9-8-7-6), du hältst einen Flush mit König als höchster Karte. Wer gewinnt?',
          options: [
            'Der Gegner – Straßen schlagen Flushes',
            'Du – der Flush schlägt jede Straße',
            'Split Pot, beide Hände sind gleich stark',
            'Es kommt darauf an, welche Farbe dein Flush hat',
          ],
          correctIndex: 1,
          explanation:
            'Der Flush steht über der Straße, weil fünf gleichfarbige Karten seltener sind als fünf aufeinanderfolgende. Die Farbe des Flushes ist dabei egal – Farben haben keine Rangfolge.',
        },
        {
          question: 'Board: A♣ 8♠ 6♥ 4♦ 2♣. Spieler A hält A♥ K♦, Spieler B hält A♦ Q♦. Wer gewinnt den Pot?',
          options: [
            'Spieler B, weil er zusätzlich Flush-Chancen hatte',
            'Split Pot – beide haben ein Paar Asse',
            'Spieler A – bei gleichem Paar entscheidet der Kicker, K schlägt Q',
            'Spieler B, weil Karo vor Herz rangiert',
          ],
          correctIndex: 2,
          explanation:
            'Beide halten ein Paar Asse, also entscheidet der Kicker: A-A-K-8-6 schlägt A-A-Q-8-6. Verpasste Draws und Farben spielen am Showdown keine Rolle.',
        },
        {
          question: 'Du hältst 4♠ 3♠ und das Board zeigt K♦ A♥ 2♣ 5♦ 9♠. Welche Hand hast du?',
          options: [
            'Nur High Card Ass',
            'Eine Straße: 5-4-3-2-A (das Wheel)',
            'Eine Straße: K-A-2-3-4 um die Ecke',
            'Ein Paar Dreien',
          ],
          correctIndex: 1,
          explanation:
            'Das Ass kann als niedrigste Karte spielen und bildet mit 2-3-4-5 das Wheel, die niedrigste Straße. Eine Straße um die Ecke (K-A-2-3-4) gibt es dagegen nicht.',
        },
        {
          question: 'Board: A♠ K♥ Q♦ J♣ 3♠. Spieler A hält A♥ 2♥, Spieler B hält A♦ 9♦. Was passiert am Showdown?',
          options: [
            'Spieler B gewinnt, weil die 9 die 2 als Kicker schlägt',
            'Split Pot – beide spielen A-A-K-Q-J, die zweite Hole Card zählt nicht',
            'Spieler A gewinnt, weil er zuerst gecallt hat',
            'Spieler B gewinnt mit zwei Paaren',
          ],
          correctIndex: 1,
          explanation:
            'Es zählen nur die besten fünf Karten: Beide Spieler spielen A-A-K-Q-J. Die 9 und die 2 schaffen es nicht in die Wertung – der Kicker ist vom Board verdrängt, der Pot wird geteilt.',
        },
        {
          question: 'Zwei Full Houses treffen aufeinander: K-K-K-2-2 gegen Q-Q-Q-A-A. Welches gewinnt?',
          options: [
            'Q-Q-Q-A-A, weil Asse das höchste Paar sind',
            'K-K-K-2-2, weil zuerst der Drilling verglichen wird',
            'Split Pot, beide sind Full Houses',
            'Das hängt von den Kickern ab',
          ],
          correctIndex: 1,
          explanation:
            'Beim Full House wird zuerst der Drilling verglichen: Könige schlagen Damen. Das Paar dient nur als Tiebreaker bei identischem Drilling. Ein Kicker existiert im Full House nicht – es besteht bereits aus fünf Karten.',
        },
        {
          question: 'Was ist der Unterschied zwischen einem Set und Trips?',
          options: [
            'Ein Set ist stärker im Ranking als Trips',
            'Set: Pocket Pair trifft das Board; Trips: Paar liegt auf dem Board, du hältst die dritte Karte',
            'Trips bestehen aus vier gleichen Karten',
            'Es gibt keinen Unterschied, beide Begriffe sind identisch definiert',
          ],
          correctIndex: 1,
          explanation:
            'Beides ist ein Drilling und im Ranking gleichwertig. Ein Set (Pocket Pair + Boardkarte) ist aber besser versteckt, während Trips für alle sichtbar sind und Kicker-Probleme haben können.',
        },
      ],
    },
    {
      id: 'm1-l3',
      title: 'Position ist Macht',
      duration: 8,
      intro:
        'Kein einzelner Faktor beeinflusst deine Gewinnrate so stark wie die Position. Wer versteht, warum der Button Gold wert ist, spielt ab sofort ein anderes Spiel.',
      sections: [
        {
          heading: 'Die Positionen am 6-max-Tisch',
          body:
            'Am 6-max-Tisch (maximal sechs Spieler) hat jeder Sitz relativ zum Dealer-Button einen Namen:\n\n- **UTG** (Under the Gun): handelt preflop als Erster – auch **Lojack (LJ)** genannt.\n- **HJ** (Hijack): ein Sitz vor dem Cutoff.\n- **CO** (Cutoff): ein Sitz vor dem Button.\n- **BTN** (Button): der Dealer – handelt postflop immer als Letzter.\n- **SB** (Small Blind): links vom Button, zahlt den halben Zwangseinsatz.\n- **BB** (Big Blind): zahlt den vollen Zwangseinsatz.\n\nDa der Button jede Hand weiterwandert, durchläufst du alle Positionen im Rotationsprinzip. Deine Position bestimmt zwei Dinge: **wann** du handeln musst und **wie viele Spieler** nach dir noch Karten halten.\n\nUTG spricht preflop zuerst, während noch fünf Gegner warten – entsprechend eng (**tight**) solltest du dort spielen. Der Button spricht preflop als Drittletzter, postflop als Letzter, und hat nur noch die beiden Blinds hinter sich – dort kannst du mit Abstand am meisten Hände profitabel spielen. Man unterscheidet grob **frühe Position** (UTG), **mittlere Position** (HJ), **späte Position** (CO, BTN) und die **Blinds** als Sonderfall.',
          table: {
            headers: ['Position', 'Kürzel', 'Preflop-Reihenfolge', 'Charakter'],
            rows: [
              ['Under the Gun / Lojack', 'UTG/LJ', '1.', 'früh – eng spielen'],
              ['Hijack', 'HJ', '2.', 'mittel'],
              ['Cutoff', 'CO', '3.', 'spät – weiter öffnen'],
              ['Button', 'BTN', '4.', 'beste Position'],
              ['Small Blind', 'SB', '5.', 'schlechteste Position'],
              ['Big Blind', 'BB', '6. (schließt ab)', 'verteidigt den Blind'],
            ],
          },
        },
        {
          heading: 'Der 9-max-Tisch (Full Ring)',
          body:
            'Am Full-Ring-Tisch mit neun Spielern kommen vor dem Lojack drei weitere frühe Positionen hinzu: **UTG**, **UTG+1** und **UTG+2**. Danach folgen wie gehabt LJ, HJ, CO, BTN, SB und BB.\n\nDas Prinzip bleibt identisch, nur die Gewichte verschieben sich: Wer am 9-max-Tisch UTG eröffnet, hat noch **acht** Gegner hinter sich, die alle eine starke Hand halten können. Die Wahrscheinlichkeit, dass mindestens einer davon ein Premium wie QQ+ oder AK aufwacht, ist deutlich höher als am 6-max-Tisch mit fünf Gegnern. Deshalb sind die Eröffnungs-Ranges der frühen Positionen im Full Ring noch enger.\n\nEin nützliches Umrechnungsprinzip: Die letzten sechs Positionen am 9-max-Tisch (LJ bis BB) entsprechen strategisch ziemlich genau dem kompletten 6-max-Tisch. Ein 6-max-Spieler sitzt also gewissermaßen permanent in einem Spiel, in dem die drei engsten Positionen bereits gefoldet haben – genau darum ist 6-max das aktivere, aggressivere Format.\n\nFür dein Lernen heißt das: Die Positionslogik, die du hier verinnerlichst, überträgt sich eins zu eins auf jede Tischgröße. Es ändert sich nur, wie viele Spieler hinter dir lauern.',
          tip: 'Zähle vor jeder Entscheidung kurz, wie viele Spieler nach dir noch handeln. Diese eine Zahl ist die schnellste Orientierung, wie stark deine Hand sein muss.',
        },
        {
          heading: 'In Position vs. Out of Position',
          body:
            '**In Position (IP)** bist du, wenn du in den Setzrunden nach dem Flop **nach** deinem Gegner handelst. **Out of Position (OOP)** bedeutet, du musst zuerst handeln. Dieser Unterschied bleibt für die gesamte Hand bestehen – wer postflop IP ist, ist es am Flop, Turn und River.\n\nDie Vorteile, als Letzter zu handeln, sind konkret messbar:\n\n- **Mehr Information**: Du siehst Check oder Bet deines Gegners, bevor du dich festlegen musst. Er muss raten – du weißt.\n- **Pot-Kontrolle**: Du entscheidest, ob eine Straße mit Einsatz oder kostenlos endet. Checkt dein Gegner, kannst du mit einem Draw gratis die nächste Karte sehen oder mit einer Marginalhand den Pot klein halten.\n- **Bessere Bluffs**: Zeigt der Gegner per Check Schwäche, kannst du profitabel Druck machen.\n- **Value maximieren**: Mit starken Händen kannst du am Ende jeder Straße noch eine Bet nachschieben.\n\nEine wichtige Feinheit betrifft die Blinds: Der Small Blind handelt preflop erst spät, ist aber **postflop gegen jeden Spieler OOP** – deshalb ist der SB die schlechteste Position am Tisch. Der Big Blind ist gegen alle außer dem SB ebenfalls OOP, bekommt aber als Ausgleich den Abschluss der Preflop-Runde und hat bereits einen Einsatz im Pot.',
          example:
            'Du hältst 8♥ 7♥ auf dem Button, der Flop kommt K♠ 6♥ 5♦ – ein offener Straßendraw. Dein Gegner checkt. IP kannst du wählen: gratis den Turn ansehen oder als Semi-Bluff setzen. OOP mit derselben Hand müsstest du zuerst handeln – und nach einem Check oft eine Bet bezahlen, ohne zu wissen, woran du bist.',
        },
        {
          heading: 'Warum der Button die beste Position ist',
          body:
            'Der Button vereint alle Positionsvorteile: Er handelt **postflop garantiert als Letzter**, egal wer sonst in der Hand ist. Preflop sitzen nur noch die beiden Blinds hinter ihm – zwei Spieler, die ohne eigene Initiative Geld in den Pot zahlen mussten und postflop immer OOP spielen.\n\nDie Konsequenzen sind messbar: In den Datenbanken praktisch aller Winning Player ist der Button die **profitabelste Position**, mit deutlichem Abstand vor dem Cutoff. Die Blinds sind dagegen für jeden Spieler der Welt langfristig Verlustpositionen – die Zwangseinsätze und der permanente Positionsnachteil lassen sich nur abmildern, nie ganz ausgleichen. Gewinnen bedeutet, in den anderen Positionen mehr zu verdienen, als die Blinds kosten.\n\nDeshalb öffnet ein solider 6-max-Spieler vom Button grob **40–50 %** aller Hände, von UTG dagegen nur etwa **15–20 %**. Dieselbe Hand wechselt je nach Sitz die Kategorie: K♦ 9♦ ist UTG ein klarer Fold, auf dem Button ein Standard-Raise.\n\nDer Informationsvorteil wirkt dabei wie Zinseszins: Auf jeder der drei Postflop-Straßen triffst du deine Entscheidung mit mehr Wissen als der Gegner. Über hunderte Hände summieren sich diese kleinen Vorteile zu einem großen Teil deiner gesamten Gewinnrate.',
          tip: 'Wenn du dir nur eine Regel aus dieser Lektion merkst: Spiele auf dem Button deutlich mehr Hände als überall sonst – und in frühen Positionen sowie aus dem Small Blind deutlich weniger.',
        },
      ],
      takeaways: [
        'Position bestimmt, wann du handelst und wie viele Gegner nach dir noch Karten halten.',
        'In Position (nach dem Gegner handeln) bringt mehr Information, Pot-Kontrolle und bessere Bluff- und Value-Möglichkeiten.',
        'Der Button ist die profitabelste Position: postflop immer als Letzter, preflop nur die Blinds dahinter.',
        'Der Small Blind ist die schlechteste Position – postflop gegen jeden Gegner Out of Position.',
        'Dieselbe Hand kann je nach Position Fold oder Raise sein: früh eng spielen, spät die Range öffnen.',
      ],
      quiz: [
        {
          question: 'Warum gilt der Button als beste Position am Tisch?',
          options: [
            'Weil der Button die Karten austeilt und sie zuerst sieht',
            'Weil er postflop immer als Letzter handelt und preflop nur noch die Blinds hinter sich hat',
            'Weil er keine Blinds zahlen muss und deshalb gratis spielt',
            'Weil er preflop als Erster handeln darf',
          ],
          correctIndex: 1,
          explanation:
            'Der Button handelt in jeder Postflop-Setzrunde garantiert als Letzter und hat preflop nur die beiden Blinds hinter sich. Dieser dauerhafte Informationsvorteil macht ihn zur profitabelsten Position.',
        },
        {
          question: 'Du sitzt im Small Blind und callst einen Raise des Buttons. Wie ist deine Situation postflop?',
          options: [
            'Du bist in Position, weil du preflop nach UTG gehandelt hast',
            'Du bist Out of Position und musst am Flop, Turn und River jeweils zuerst handeln',
            'Die Position wechselt auf jeder Straße',
            'Du handelst nur am Flop zuerst, danach der Button',
          ],
          correctIndex: 1,
          explanation:
            'Postflop beginnt immer der erste aktive Spieler links vom Button – im Blind-Duell gegen den Button also du. Dieser Nachteil bleibt die ganze Hand bestehen und macht den SB zur schlechtesten Position.',
        },
        {
          question: 'Was ist der konkrete Kern des Informationsvorteils, wenn du in Position bist?',
          options: [
            'Du darfst dir mehr Zeit für deine Entscheidungen nehmen',
            'Du siehst die Aktion des Gegners (Check oder Bet), bevor du dich selbst festlegen musst',
            'Du bekommst deine Karten später ausgeteilt',
            'Deine Bets zählen mehr, weil sie den Pot schließen',
          ],
          correctIndex: 1,
          explanation:
            'In Position reagierst du auf die Aktion des Gegners, statt raten zu müssen. Ein Check verrät oft Schwäche, eine Bet oft Stärke – du triffst jede Entscheidung mit mehr Wissen.',
        },
        {
          question: 'Warum solltest du UTG am 6-max-Tisch deutlich weniger Hände spielen als auf dem Button?',
          options: [
            'Weil UTG höhere Einsätze zahlen muss',
            'Weil hinter dir noch fünf Gegner handeln, von denen jeder eine starke Hand halten kann – und du postflop meist OOP bist',
            'Weil UTG-Hände statistisch schlechtere Karten bekommen',
            'Weil die Regeln UTG nur bestimmte Hände erlauben',
          ],
          correctIndex: 1,
          explanation:
            'UTG spricht zuerst und hat die maximale Zahl an Gegnern hinter sich. Je mehr Spieler noch handeln, desto wahrscheinlicher wacht eine starke Hand auf – und ohne Positionsvorteil brauchst du selbst mehr Substanz.',
        },
        {
          question: 'Welche Aussage über die Blinds ist korrekt?',
          options: [
            'Gute Spieler machen im Big Blind langfristig Gewinn',
            'Die Blinds sind für praktisch jeden Spieler langfristige Verlustpositionen – Ziel ist, dort möglichst wenig zu verlieren',
            'Der Small Blind ist besser als der Big Blind, weil er weniger zahlt',
            'Blinds sind neutral, weil sich die Zwangseinsätze über die Runde ausgleichen',
          ],
          correctIndex: 1,
          explanation:
            'Zwangseinsatz plus permanenter Positionsnachteil machen die Blinds für jeden zu Verlustpositionen. Gewonnen wird das Geld in den anderen Positionen – in den Blinds geht es um Schadensbegrenzung.',
        },
      ],
    },
    {
      id: 'm1-l4',
      title: 'Aktionen & Setzregeln',
      duration: 9,
      intro:
        'Check, Bet, Call, Raise, Fold, All-in – sechs Aktionen, aus denen jede Pokerhand besteht. Diese Lektion erklärt die Setzregeln von No-Limit Hold\'em präzise, inklusive Mindest-Raise und Side Pots.',
      sections: [
        {
          heading: 'Die Grundaktionen',
          body:
            'Wenn du am Zug bist, hängen deine Optionen davon ab, ob vor dir bereits gesetzt wurde:\n\n**Noch keine Bet in dieser Runde:**\n\n- **Check**: Du schiebst – kein Einsatz, die Aktion geht weiter. Checken alle, ist die Runde kostenlos vorbei.\n- **Bet**: Du bringst als Erster Chips in die Runde und eröffnest das Setzen.\n\n**Es liegt bereits eine Bet vor dir:**\n\n- **Fold**: Du gibst die Hand auf. Deine bereits gezahlten Einsätze bleiben im Pot.\n- **Call**: Du gleichst den Einsatz aus und bleibst in der Hand.\n- **Raise**: Du erhöhst den Einsatz – die Gegner müssen erneut reagieren.\n\nDazu kommt das **All-in**: Du setzt alle deine verbliebenen Chips. Nach dem Prinzip der **Table Stakes** kannst du nie mehr verlieren, als vor Beginn der Hand vor dir liegt – niemand kann dich mit einer riesigen Bet aus der Hand kaufen, du kannst immer für deinen Stack callen.\n\nZwei Formalien solltest du live kennen: Mündliche Ansagen (etwa Raise auf 20) sind **bindend**. Und Chips musst du in einer Bewegung setzen – wer nachlegt (**String Bet**), dessen Erhöhung zählt nicht, es gilt nur der zuerst gesetzte Betrag.',
          tip: 'Sage live immer zuerst deutlich an, was du tust (Call oder Raise auf Betrag X), und schiebe erst dann die Chips. Das verhindert String-Bet-Probleme und Missverständnisse.',
        },
        {
          heading: 'Mindest-Raise in No-Limit',
          body:
            'In No-Limit darfst du jederzeit beliebig viel setzen – bis hin zu deinem gesamten Stack. Es gibt aber Untergrenzen:\n\n- Die **Mindest-Bet** ist ein Big Blind.\n- Ein **Raise** muss mindestens so groß sein wie die letzte Bet oder Erhöhung derselben Setzrunde.\n\nDas klingt abstrakt, ist mit Zahlen aber einfach. Blinds 1/2: Der Big Blind (2) ist die erste Bet der Preflop-Runde. Das Mindest-Raise erhöht um weitere 2, also auf insgesamt **4**. Raist nun jemand auf 6 (eine Erhöhung um 4), muss das nächste Raise um mindestens 4 höher gehen – also auf mindestens **10**. Es zählt immer der **Erhöhungsschritt**, nicht der Gesamtbetrag.\n\nEine Sonderregel betrifft kurze All-ins: Geht ein Spieler all-in, ohne damit ein volles Mindest-Raise zu erreichen, gilt das nicht als echtes Raise. Spieler, die vorher bereits gehandelt haben, dürfen dann nur callen oder folden – die Setzrunde wird für sie nicht neu eröffnet.\n\nIn der Praxis wirst du selten das Minimum setzen. Übliche Größen sind preflop das 2,2- bis 3-Fache des Big Blind als Eröffnung; postflop orientieren sich Bets am Pot, etwa ein Drittel bis voller Pot. Die Mindestregeln musst du trotzdem kennen – sie entscheiden, welche Aktionen überhaupt erlaubt sind.',
          example:
            'Blinds 1/2. Spieler A raist auf 7 (Erhöhung um 5). Spieler B will 3-betten: Sein Raise muss um mindestens 5 erhöhen, also auf mindestens 12 gehen. Ein Raise auf 10 wäre regelwidrig und würde live korrigiert.',
        },
        {
          heading: 'No-Limit, Pot-Limit, Fixed-Limit',
          body:
            'Die Setzstruktur bestimmt den Charakter eines Spiels grundlegend:\n\n- **No-Limit (NL)**: Jederzeit jeder Betrag bis zum ganzen Stack. Maximaler Druck, maximale Fehlerbestrafung – der Standard für Texas Hold\'em und Thema dieser App.\n- **Pot-Limit (PL)**: Die maximale Bet ist auf die aktuelle Potgröße begrenzt. Beim Raise gilt: Erst den Call gedanklich in den Pot legen, dann darfst du um diesen neuen Pot erhöhen. Beispiel: Im Pot liegen 10, der Gegner bettet 10. Nach deinem gedachten Call läge der Pot bei 30 – du darfst also um bis zu 30 erhöhen, insgesamt maximal 40 einzahlen. Pot-Limit ist heute vor allem die Struktur von Omaha (PLO).\n- **Fixed-Limit (FL)**: Bets und Raises haben feste Größen. In einem 2/4-Spiel wird preflop und am Flop in Schritten von 2 gesetzt, am Turn und River in Schritten von 4; pro Runde ist meist bei einer Bet plus drei Raises Schluss (Cap). Fixed-Limit war früher dominant und ist heute ein Nischenformat.\n\nFür dich als Lernenden zählt vor allem eins: In No-Limit kann jede einzelne Entscheidung deinen ganzen Stack kosten oder gewinnen. Genau deshalb ist solides Grundlagenwissen hier so wertvoll – und genau deshalb konzentrieren wir uns auf NL Hold\'em.',
        },
        {
          heading: 'All-in und Side Pots',
          body:
            'Was passiert, wenn ein Spieler all-in ist, die anderen aber weiterspielen wollen? Dann entstehen **Side Pots** – klingt kompliziert, folgt aber einer simplen Regel: **Jeder Spieler kann pro Gegner nur so viel gewinnen, wie er selbst eingezahlt hat.**\n\nEin Beispiel mit drei Spielern: A hat noch 40, B und C haben je 200. A geht all-in mit 40, B und C callen. Der **Main Pot** enthält 120 (3 × 40) – nur um diesen Pot spielt A mit. Setzen B und C danach weitere Chips, wandern diese in einen **Side Pot**, den nur B und C gewinnen können. Bettet B am Turn 60 und C callt, liegt im Side Pot 120.\n\nAm Showdown wird von außen nach innen ausgewertet: Erst wird der Side Pot zwischen B und C verglichen, dann der Main Pot zwischen allen dreien. Es ist also möglich, dass A mit der besten Hand den Main Pot gewinnt, während B mit der zweitbesten Hand den Side Pot einstreicht.\n\nBei mehreren All-ins mit unterschiedlichen Stackgrößen entstehen entsprechend mehrere Side Pots – das Prinzip bleibt gleich und wird von Dealer oder Software automatisch korrekt aufgeteilt. Du musst es nicht live ausrechnen können, aber verstehen, **wer um welches Geld spielt**: Das beeinflusst, wie sich die verbleibenden Spieler untereinander verhalten sollten.',
          example:
            'A (Stack 40) ist am Flop all-in, B und C spielen mit vollen Stacks weiter. Am River hält A das beste Blatt, B das zweitbeste. Ergebnis: A gewinnt den Main Pot (120), B gewinnt den kompletten Side Pot – obwohl seine Hand schlechter ist als die von A.',
        },
        {
          heading: 'Setzrunden sauber zu Ende denken',
          body:
            'Eine Setzrunde endet erst, wenn jeder aktive Spieler auf die letzte Bet oder das letzte Raise reagiert hat und alle gleich viel in der Runde stehen haben – oder all-in sind. Zwei Konsequenzen daraus stolpern Anfänger oft:\n\nErstens: Ein Call schließt die Runde nur, wenn danach niemand mehr handeln darf. Callst du preflop ein Raise, kann ein Spieler hinter dir erneut erhöhen (**3-Bet**) – dann bist du wieder am Zug und musst die Differenz callen, selbst raisen oder deine bereits investierten Chips aufgeben.\n\nZweitens: Der Big Blind hat preflop die sogenannte **Option**. Haben alle nur gecallt, darf er checken oder selbst raisen – die Runde ist erst nach seiner Entscheidung vorbei.\n\nZum Schluss ein Blick auf die Etikette, die zugleich Regel ist: Handle nur, wenn du **am Zug** bist. Wer vorzeitig foldet oder bettet, verschenkt Information und beeinflusst die Hand unfair. Wirf beim Fold deine Karten verdeckt Richtung Dealer und kommentiere laufende Hände nicht – auch nicht, welche Karten du weggeworfen hast. Diese Standards machen dich an jedem Live-Tisch sofort als seriösen Spieler erkennbar und halten das Spiel für alle fair.',
          tip: 'Präge dir den Unterschied zwischen Bet und Raise ein: Eine Bet eröffnet das Setzen in einer Runde, ein Raise erhöht eine bestehende Bet. Der Big Blind zählt preflop als erste Bet – deshalb ist die erste Erhöhung preflop bereits ein Raise.',
        },
      ],
      takeaways: [
        'Ohne Bet vor dir: Check oder Bet. Mit Bet vor dir: Fold, Call oder Raise.',
        'Ein Raise muss mindestens so groß sein wie die letzte Bet oder Erhöhung – es zählt der Erhöhungsschritt, nicht der Gesamtbetrag.',
        'Table Stakes: Du kannst nie mehr verlieren als deinen Stack – ein All-in für weniger nimmt dir nie das Recht zu callen.',
        'No-Limit erlaubt jeden Betrag, Pot-Limit maximal den Pot (nach gedachtem Call), Fixed-Limit nur feste Schritte.',
        'Side Pots regeln All-in-Situationen: Jeder gewinnt pro Gegner höchstens, was er selbst eingezahlt hat.',
      ],
      quiz: [
        {
          question: 'Blinds 1/2, ein Gegner hat auf 6 erhöht. Auf welchen Betrag muss dein Raise mindestens gehen?',
          options: [
            'Auf 8, das Doppelte des Big Blind mehr',
            'Auf 10 – die letzte Erhöhung betrug 4, also mindestens 6 + 4',
            'Auf 12, das Doppelte des letzten Einsatzes',
            'Auf 7, ein Big Blind mehr reicht immer',
          ],
          correctIndex: 1,
          explanation:
            'Der Gegner hat von 2 auf 6 erhöht, der Erhöhungsschritt beträgt 4. Dein Raise muss mindestens denselben Schritt draufliegen: 6 + 4 = 10.',
        },
        {
          question: 'Im Pot liegen 10, dein Gegner bettet 10. Wie viel darfst du in einem Pot-Limit-Spiel maximal insgesamt einzahlen?',
          options: [
            '20 – das Doppelte seiner Bet',
            '30 – der Pot inklusive seiner Bet',
            '40 – Call 10, danach Raise um den neuen Pot von 30',
            'Beliebig viel, Pot-Limit begrenzt nur die erste Bet',
          ],
          correctIndex: 2,
          explanation:
            'Pot-Limit-Rechnung: Erst den Call gedanklich einzahlen (Pot: 10 + 10 + 10 = 30), dann darfst du um diesen Pot erhöhen. Insgesamt also 10 Call + 30 Raise = 40.',
        },
        {
          question: 'Spieler A (Stack 40) geht all-in, B und C (je 200) callen und setzen am Turn weitere Chips. Wer kann welchen Pot gewinnen?',
          options: [
            'A kann alles gewinnen, wenn er die beste Hand hält',
            'A spielt nur um den Main Pot (3 × 40); die weiteren Einsätze bilden einen Side Pot nur für B und C',
            'Alle drei spielen um einen gemeinsamen Pot, A schuldet die Differenz',
            'B und C dürfen nach dem All-in nicht weiter setzen',
          ],
          correctIndex: 1,
          explanation:
            'Jeder gewinnt pro Gegner höchstens, was er selbst eingezahlt hat. A ist mit 40 im Main Pot (120) beteiligt; alles darüber hinaus landet im Side Pot, um den nur B und C spielen.',
        },
        {
          question: 'Wann darfst du checken?',
          options: [
            'Immer, wenn du am Zug bist',
            'Nur preflop als Big Blind',
            'Wenn in der laufenden Setzrunde noch keine Bet vor dir liegt',
            'Nur, wenn alle Gegner vorher gecheckt haben und du auf dem Button sitzt',
          ],
          correctIndex: 2,
          explanation:
            'Checken heißt, ohne Einsatz weiterzugeben – das geht nur, solange in der aktuellen Runde niemand gesetzt hat. Liegt eine Bet vor dir, bleiben nur Fold, Call oder Raise. Der BB-Check preflop ist ein Spezialfall derselben Regel: Sein Blind gilt bereits als Einsatz.',
        },
        {
          question: 'Was bedeutet das Table-Stakes-Prinzip?',
          options: [
            'Du darfst während einer Hand Chips nachkaufen, wenn dein Stack leer ist',
            'Du kannst nie mehr verlieren als deinen Stack zu Beginn der Hand – und kannst immer für deinen Stack callen',
            'Der Mindest-Buy-in beträgt immer 100 Big Blinds',
            'Alle Spieler müssen mit gleich großen Stacks starten',
          ],
          correctIndex: 1,
          explanation:
            'Table Stakes begrenzt dein Risiko auf die Chips, die vor dir liegen. Eine Bet über deinem Stack kannst du per All-in für weniger callen – niemand kann dich aus einer Hand herauskaufen.',
        },
      ],
    },
    {
      id: 'm1-l5',
      title: 'Varianten & Formate',
      duration: 8,
      intro:
        'Cash Game, Turnier oder Sit & Go? 6-max oder Full Ring? Das Format bestimmt, welche Strategie richtig ist – und welches Umfeld sich am besten zum Lernen eignet.',
      sections: [
        {
          heading: 'Cash Game: Chips sind Geld',
          body:
            'Im **Cash Game** entspricht jeder Chip direkt einem Geldwert. Die Blinds bleiben konstant, du kannst jederzeit ein- und aussteigen und deinen Stack nach einer verlorenen Hand wieder auffüllen (**Rebuy**). Der Standard-Buy-in liegt bei **100 Big Blinds** – daher rechnet fast die gesamte moderne Theorie mit 100bb-Stacks.\n\nStrategisch ist das Cash Game das **reinste Poker**: Weil sich die Rahmenbedingungen nie ändern, ist jede Hand eine eigenständige, wiederholbare Situation. Eine Entscheidung ist genau dann gut, wenn sie langfristig Chips gewinnt – es gibt keine Turnier-Sondereffekte, die das verzerren. Genau deshalb eignet sich das Format so gut zum Lernen: Du kannst dieselben Situationen (Button-Open, Blind-Verteidigung, C-Bet am Flop) hunderte Male üben und deine Fehler sauber analysieren.\n\nMental verlangt das Cash Game vor allem **Gleichmut gegenüber Geldschwankungen**. Weil die Chips echtes Geld sind, verführt ein verlorener Stack zum frustrierten Weiterspielen (**Tilt**). Zwei Schutzmechanismen helfen: Erstens feste Regeln, wann du eine Session beendest. Zweitens **Bankroll Management** – spiele nur auf Limits, für die dein Pokerbudget mindestens 25 bis 30 Buy-ins umfasst. So bleibt eine normale Verluststrecke eine Fußnote statt einer Katastrophe.',
          tip: 'Bewerte deine Sessions nie am Geldergebnis eines Abends, sondern an der Qualität deiner Entscheidungen. Kurzfristig regiert der Zufall – langfristig setzt sich die bessere Strategie durch.',
        },
        {
          heading: 'Turniere: Überleben und wachsen',
          body:
            'Im **Turnier** zahlst du einmal einen festen Buy-in und erhältst dafür Turnierchips ohne direkten Geldwert. Die **Blinds steigen** in festen Intervallen, wer keine Chips mehr hat, scheidet aus. Bezahlt werden meist nur die besten rund **15 %** der Teilnehmer, mit stark ansteigenden Preisen zur Spitze hin.\n\nDaraus folgen echte strategische Unterschiede zum Cash Game:\n\n- **Wechselnde Stacktiefen**: Durch steigende Blinds schrumpfen die Stacks in Big Blinds. Statt 100bb spielst du oft mit 40, 20 oder 10bb – kurze Stacks verlangen andere, oft simplere Entscheidungen bis hin zum reinen Push-or-Fold.\n- **Chips sind nicht linear Geld wert**: Der Verlust deines letzten Chips kostet dich das ganze Turnier, ein verdoppelter Stack verdoppelt aber nicht deine Gewinnaussichten. Dieses Konzept heißt **ICM** (Independent Chip Model) und macht knappe Entscheidungen nahe der Geldränge vorsichtiger.\n- **Kein Rebuy** (außer in Re-Entry-Phasen): Fehler sind endgültiger, Überleben hat eigenen Wert.\n\nMental sind Turniere ein Wechselbad: stundenlange Disziplin, dann plötzlich alles-entscheidende Momente – und in der großen Mehrheit der Turniere scheidest du ohne Preisgeld aus. Die **Varianz** ist deutlich höher als im Cash Game; selbst sehr gute Spieler haben lange Durststrecken. Dafür winken mit einem einzigen Sieg überproportionale Preisgelder.',
        },
        {
          heading: 'Sit & Go: Das Turnier im Kleinformat',
          body:
            'Ein **Sit & Go** (SnG) ist ein Turnier ohne festen Startzeitpunkt: Es beginnt, sobald alle Plätze besetzt sind – klassisch ein einzelner Tisch mit 6 oder 9 Spielern, bei dem etwa die besten drei bezahlt werden (traditionell 50/30/20 % des Preispools).\n\nFür Lernende haben SnGs einen besonderen Reiz: Sie durchlaufen in 30 bis 60 Minuten **alle Phasen eines Turniers** im Zeitraffer – tiefe Stacks am Anfang, mittlere Phase mit steigenden Blinds, die angespannte **Bubble** (der letzte unbezahlte Platz) und das Endspiel mit kurzen Stacks. Wer SnGs spielt, lernt zwangsläufig Push-or-Fold-Situationen und erste ICM-Überlegungen – Fähigkeiten, die in großen Turnieren Gold wert sind.\n\nModerne Ableger variieren das Prinzip: **Spin-and-Go-Formate** mit drei Spielern und ausgelostem Preispool sind extrem schnell und varianzreich; **Multi-Table-SnGs** überbrücken die Lücke zu großen Turnieren.\n\nDie überschaubare Dauer ist auch aus Sicht des verantwortungsvollen Spielens ein Vorteil: Ein SnG hat ein klares Ende und einen festen, im Voraus bekannten Einsatz – das erleichtert Budget- und Zeitkontrolle erheblich im Vergleich zu offenen Cash-Game-Sessions.',
          example:
            'Ein 9-Spieler-SnG mit 10 Einheiten Buy-in: Der Preispool beträgt 90 (plus Gebühr an den Anbieter). Platz 1 erhält 45, Platz 2 erhält 27, Platz 3 erhält 18. Die Plätze 4 bis 9 gehen leer aus – Platz 4, die Bubble, ist der bitterste Platz im Poker.',
        },
        {
          heading: 'Full Ring, 6-max, Heads-Up',
          body:
            'Auch die Tischgröße prägt die Strategie:\n\n- **Full Ring** (9–10 Spieler): Mehr Spieler pro Hand bedeuten engere Ranges – irgendjemand hat öfter eine starke Hand. Das Spiel ist langsamer und geduldiger; gute Starthanddisziplin wird stärker belohnt, Aggression ist seltener zwingend.\n- **6-max** (maximal 6 Spieler): Die frühen Positionen fallen weg, du zahlst öfter Blinds und musst deutlich mehr Hände spielen. Das Spiel ist aggressiver, es gibt mehr Duelle mit marginalen Händen – und dadurch mehr Lerngelegenheiten pro Stunde. 6-max ist online der De-facto-Standard im Cash Game, und die meisten Strategieinhalte (auch in dieser App) beziehen sich darauf.\n- **Heads-Up** (1 gegen 1): Du bist in jeder Hand beteiligt und musst extrem weite Ranges spielen – fast jede Hand hat Wert. Heads-Up ist das intensivste Format und schult Aggression und Hand-Reading wie kein anderes, ist aber als Einstieg zu anspruchsvoll.\n\nDie Grundregel dahinter hast du in Lektion 3 schon kennengelernt: **Je weniger Spieler am Tisch, desto weiter werden alle Ranges.** Eine Hand wie A♦ 8♦ ist im Full Ring aus früher Position ein Fold, in 6-max eine normale Eröffnung und im Heads-Up eine klar starke Hand.',
        },
        {
          heading: 'Ausblick Omaha und deine Empfehlung',
          body:
            'Neben Hold\'em begegnet dir früher oder später **Omaha**, meist als **Pot-Limit Omaha (PLO)**: Du bekommst **vier** Hole Cards und musst für deine finale Hand **genau zwei** davon verwenden – nicht mehr, nicht weniger. Das klingt nach einem Detail, ändert aber alles: Mit vier Karten hat jeder Spieler viel öfter starke Hände und starke Draws, die Pötte eskalieren schneller, und die Varianz ist erheblich höher. Ein klassischer Anfängerfehler dort: mit nur einer passenden Karte einen Flush zu sehen, der keiner ist. PLO ist ein großartiges Spiel – aber erst, wenn Hold\'em sitzt.\n\nFür deinen Einstieg empfehlen wir zwei Wege:\n\n- **6-max Cash Game auf Micro-Limits**: konstante Bedingungen, wiederholbare Situationen, jederzeit pausierbar – das effizienteste Lernumfeld. Genau darauf sind die folgenden Module ausgerichtet.\n- **Kleine Turniere oder SnGs mit niedrigem Buy-in**: fester, überschaubarer Einsatz und der komplette Turnierzyklus als Lernstoff.\n\nWofür du dich auch entscheidest: Spiele nur mit Geld, dessen Verlust dich nicht belastet, setze dir feste Zeit- und Budgetgrenzen, und betrachte die ersten Monate als Ausbildung, nicht als Einnahmequelle. Poker belohnt langfristig gute Entscheidungen – aber kurzfristig kann jede Strähne in beide Richtungen ausschlagen.',
          tip: 'Wähle EIN Format und bleibe mehrere Wochen dabei. Wer zwischen Cash, Turnieren und Formaten springt, lernt überall ein bisschen und nirgends richtig.',
        },
      ],
      takeaways: [
        'Cash Game: konstante Blinds, Chips sind Geld, jede Hand eine wiederholbare Situation – das beste Lernumfeld.',
        'Turniere: steigende Blinds, wechselnde Stacktiefen und ICM machen Chips nicht linear geldwert; die Varianz ist deutlich höher.',
        'Sit & Gos durchlaufen alle Turnierphasen im Zeitraffer und haben klar begrenzte Dauer und Einsatz.',
        'Je weniger Spieler am Tisch, desto weiter die Ranges: Full Ring eng, 6-max aggressiv, Heads-Up extrem weit.',
        'Empfehlung: 6-max Cash auf Micro-Limits oder kleine Turniere – mit festem Budget und klaren Grenzen.',
      ],
      quiz: [
        {
          question: 'Was ist der grundlegendste strategische Unterschied zwischen Cash Game und Turnier?',
          options: [
            'Im Turnier gelten andere Handrankings',
            'Im Cash Game sind Blinds und Stacktiefe konstant und Chips direkt Geld; im Turnier steigen die Blinds und Chips sind nicht linear geldwert',
            'Im Cash Game gibt es keine Blinds',
            'Turniere werden immer Heads-Up gespielt',
          ],
          correctIndex: 1,
          explanation:
            'Das Cash Game bietet konstante, wiederholbare Bedingungen mit direktem Geldwert der Chips. Im Turnier verändern steigende Blinds ständig die Stacktiefen, und wegen des Ausscheidens (ICM) ist Chipwert nicht gleich Geldwert.',
        },
        {
          question: 'Warum spielst du in 6-max weitere Ranges als im Full Ring?',
          options: [
            'Weil die Blinds in 6-max höher sind',
            'Weil weniger Gegner am Tisch sitzen: Die Chance auf eine starke Gegenhand sinkt, und du zahlst häufiger Blinds',
            'Weil in 6-max mehr Community Cards aufgedeckt werden',
            'Weil Full-Ring-Regeln lockere Hände verbieten',
          ],
          correctIndex: 1,
          explanation:
            'Mit fünf statt acht oder neun Gegnern ist es unwahrscheinlicher, dass jemand eine Premiumhand hält – und die Blinds treffen dich öfter. Beides macht weitere, aggressivere Ranges richtig.',
        },
        {
          question: 'Du hältst in Pot-Limit Omaha A♠ K♠ Q♦ J♦ und das Board zeigt vier Pik-Karten. Hast du mit dem A♠ einen Flush?',
          options: [
            'Ja, das Ass komplettiert den Flush vom Board',
            'Nein – in Omaha musst du genau zwei Hole Cards verwenden, mit nur einer Pik-Karte gibt es keinen Flush',
            'Ja, aber nur wenn niemand zwei Pik hält',
            'Nein, in Omaha gibt es keine Flushes',
          ],
          correctIndex: 1,
          explanation:
            'Die zentrale Omaha-Regel: genau zwei aus vier Hole Cards plus genau drei Boardkarten. Mit nur einer Pik-Karte in der Hand kannst du keinen Flush bilden – einer der häufigsten Anfängerfehler in PLO.',
        },
        {
          question: 'Was beschreibt das ICM-Konzept im Turnierpoker?',
          options: [
            'Die optimale Raise-Größe bei steigenden Blinds',
            'Dass Turnierchips nicht linear in Geldwert übersetzbar sind – der Verlust aller Chips wiegt schwerer, als ein Verdoppeln nützt',
            'Die Regel, dass Blinds alle 15 Minuten steigen müssen',
            'Ein System zur Sitzplatzvergabe bei Turnierstart',
          ],
          correctIndex: 1,
          explanation:
            'ICM (Independent Chip Model) übersetzt Chipstände in Geld-Erwartungswerte. Weil Ausscheiden endgültig ist, ist der erste verlorene Chip mehr wert als der letzte gewonnene – das macht knappe Situationen nahe der Geldränge vorsichtiger.',
        },
        {
          question: 'Warum ist ein Sit & Go für Einsteiger ein sinnvolles Übungsformat?',
          options: [
            'Weil dort immer schwächere Gegner sitzen',
            'Weil es alle Turnierphasen in kurzer Zeit durchläuft und Einsatz sowie Dauer klar begrenzt sind',
            'Weil die Blinds konstant bleiben wie im Cash Game',
            'Weil man dort unbegrenzt Rebuys machen kann',
          ],
          correctIndex: 1,
          explanation:
            'Ein SnG komprimiert tiefe Stacks, Bubble und Endspiel in 30 bis 60 Minuten und hat einen festen Buy-in – ideales Training für Turnierfähigkeiten bei voller Budget- und Zeitkontrolle.',
        },
      ],
    },
  ],
};

export default m1;
