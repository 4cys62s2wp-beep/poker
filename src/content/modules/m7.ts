import type { Module } from '../types';

const m7: Module = {
  id: 'm7',
  title: 'Live-Poker',
  subtitle: 'Tells, Etikette und Strategie am echten Tisch',
  icon: '🎰',
  level: 'Fortgeschritten',
  lessons: [
    {
      id: 'm7-l1',
      title: 'Live vs. Online: die Unterschiede',
      duration: 9,
      intro:
        'Live-Poker folgt denselben Regeln wie Online-Poker – und spielt sich trotzdem wie ein anderes Spiel. Wer die Unterschiede bei Tempo, Gegnerpool, Sizings und Varianz versteht, kann seine Online-Fähigkeiten am echten Tisch gezielt in einen Vorteil verwandeln.',
      sections: [
        {
          heading: 'Tempo: ein Bruchteil der Hände',
          body:
            'Der fundamentalste Unterschied ist das Tempo. Ein Live-Tisch (meist 8- oder 9-handed) schafft etwa **25–30 Hände pro Stunde**: Der Dealer mischt physisch, Chips werden von Hand gezählt, Spieler brauchen Zeit. Online liefert ein einzelner 6-max-Tisch 75–90 Hände pro Stunde, und wer vier Tische parallel spielt, kommt auf über 300 – mehr als das Zehnfache.\n\nDas hat drei praktische Folgen:\n\n- **Premiums sind selten**: Auf AA oder KK wartest du live im Schnitt rund vier Stunden. Geduld ist keine Tugend, sondern eine Kernkompetenz.\n- **Jede Hand zählt mehr**: Ein grober Fehler pro Stunde wiegt live schwerer, weil du ihn nicht mit hunderten sauberer Hände verdünnst.\n- **Leerlauf ist Arbeitszeit**: Die vielen Hände, an denen du nicht beteiligt bist, sind deine wichtigste Informationsquelle. Wer dabei aufs Handy schaut, verschenkt den größten Live-Vorteil: Beobachtung.\n\nStell dich mental darauf ein, dass eine Live-Session sich langsam anfühlt. Langeweile ist der häufigste Grund, warum disziplinierte Online-Spieler live plötzlich zu viele Hände spielen.',
          table: {
            headers: ['Umgebung', 'Hände pro Stunde'],
            rows: [
              ['Live, 8–9 Spieler', 'ca. 25–30'],
              ['Online, 1 Tisch (6-max)', 'ca. 75–90'],
              ['Online, 4 Tische', '300+'],
            ],
          },
        },
        {
          heading: 'Der Spielerpool: looser und passiver',
          body:
            'Der durchschnittliche Live-Gegner auf niedrigen und mittleren Limits ist deutlich schwächer als der durchschnittliche Online-Gegner auf vergleichbaren Blinds. Online haben Tracking-Tools, Solver und Trainingsmaterial das Niveau massiv angehoben; live sitzen dagegen viele Freizeitspieler, die zum Spaß, aus Neugier oder wegen der Atmosphäre da sind.\n\nTypische Muster im Live-Pool:\n\n- **Viel Limping**: Ganze Ketten von Limpern vor dem Flop sind normal – online auf ernsthaften Limits fast ausgestorben.\n- **Zu viele Calls**: Viele Spieler callen preflop und postflop deutlich zu weit und folden zu selten.\n- **Zu wenig Aggression**: 3-Bets (das erneute Erhöhen eines Raises) sind selten und dann meist sehr stark.\n- **Multiway-Pötte**: Dass vier oder fünf Spieler den Flop sehen, ist auf 1/2 oder 1/3 eher Regel als Ausnahme.\n\nVorsicht vor dem Umkehrschluss: Nicht jeder Live-Spieler ist schwach. An fast jedem Tisch sitzen ein bis zwei solide Regulars, die genau wie du auf die Freizeitspieler warten. Deine erste Aufgabe in jeder Session ist, beide Gruppen zu identifizieren.',
          tip: 'Beobachte in der ersten halben Stunde vor allem Showdowns: Wer zeigt mit welcher Line welche Handstärke? Zwei, drei Showdowns sagen mehr über einen Spieler als jede Äußerlichkeit.',
        },
        {
          heading: 'Preflop: größere Sizings sind normal',
          body:
            'Online sind Open-Raises von 2,2–2,5bb Standard. Live wären sie oft ein Fehler: Auf typischen 1/2- oder 1/3-Tischen sind Opens von **4–6bb** üblich – und werden trotzdem von mehreren Spielern gecallt. Der Grund ist simpel: Loose Spieler reagieren kaum auf Sizing. Wer sowieso callen will, callt auch das Doppelte.\n\nDaraus folgen zwei Anpassungen:\n\n- **Size dich an den Tisch an**: Wenn 6bb-Opens noch drei Caller bekommen, verschenkst du mit 2,5bb Value mit deinen guten Händen. Über Limpern gilt als Faustregel: etwa 4bb plus 1bb pro Limper.\n- **Rechne mit niedrigeren SPRs**: Größere Preflop-Pötte bedeuten ein kleineres Verhältnis von Stack zu Pot (Stack-to-Pot Ratio). Bei 100bb landest du nach einem gecallten 6bb-Open schneller in Situationen, in denen Top Pair für den ganzen Stack gut genug sein kann.\n\nGleichzeitig steigt der Preis der Spekulation: Ein Call über 6bb mit 7♠ 6♠ braucht deutlich bessere Implied Odds (erwartete zukünftige Gewinne bei einem Treffer) als ein Call über 2,5bb. Passe deine Calling-Ranges an die tatsächlichen Sizings an, nicht an die Online-Gewohnheit.',
          example:
            'Auf einem 1/2-Tisch limpen drei Spieler. Du hältst A♥ Q♥ im Cutoff. Statt der Online-üblichen 2,5bb raist du auf etwa 7bb (4bb + 3 Limper). Callen zwei Limper, spielst du einen Pot von rund 23bb mit Position und der besten Hand-Range – genau das Szenario, von dem Live-Winrates leben.',
          cards: ['Ah', 'Qh'],
        },
        {
          heading: 'Soziale Komponente und Informationsfluss',
          body:
            'Live fehlen HUD (Heads-up Display mit Gegnerstatistiken), Handhistories und Notizfunktion – dafür bekommst du Informationen, die es online nicht gibt: Körpersprache, Tischgespräche, Reaktionen auf Karten und die Art, wie jemand mit Chips umgeht. Wer erzählt, dass er "nur zum Spaß hier" ist oder gleich zum Abendessen muss, gibt strategisch verwertbare Information preis.\n\nDu musst diese Informationen aber selbst erheben und behalten. Präge dir Showdowns aktiv ein ("Seat 3 hat den Flush-Draw am River mit Bottom Pair gecallt") und ordne jedem Gegner früh ein grobes Profil zu.\n\nDie soziale Komponente hat auch eine strategische Dimension: Gute Live-Spiele leben davon, dass sich Freizeitspieler wohlfühlen. Sei freundlich, gratuliere zu gewonnenen Pötten und kommentiere niemals abfällig schwache Spielzüge – wer den Fisch belehrt, vertreibt ihn oder macht ihn besser. Beides kostet dich Geld.\n\nUnd schließlich: Live-Sessions sind lang, oft wird am Tisch Alkohol serviert. Plane Pausen ein, trink beim ernsthaften Spiel keinen Alkohol und setze dir vor der Session ein Zeit- und Verlustlimit. Das ist keine Floskel, sondern Teil professioneller Selbststeuerung.',
        },
        {
          heading: 'Varianz: gleiches Spiel, längere Zeiträume',
          body:
            'Die Varianz **pro Hand** ist live und online ähnlich – Poker bleibt Poker. Aber weil du live nur einen Bruchteil der Hände spielst, dehnen sich Schwankungen in Echtzeit enorm: Eine Stichprobe von 30.000 Händen ist online in einem Monat machbar, live sind das über 1.000 Tischstunden – für die meisten ein ganzes Jahr oder mehr.\n\nDas bedeutet konkret:\n\n- **Downswings dauern Monate statt Wochen** – nicht weil das Spiel unfairer wäre, sondern weil dieselbe Händezahl länger braucht.\n- **Einzelne Sessions sagen fast nichts** über dein Können aus. Ergebnisse werden live in bb pro Stunde gemessen und brauchen hunderte Stunden, bevor sie aussagekräftig sind.\n- **Bankroll und Psyche** müssen darauf vorbereitet sein: Wer nach zehn Verlustsessions sein Spiel umwirft, reagiert auf Rauschen, nicht auf Signal.\n\nDie gute Nachricht: Weil der Live-Pool schwächer ist, sind die erreichbaren Winrates pro 100 Hände in guten Spielen höher als online – das dämpft die relative Schwankung. Garantien gibt es trotzdem keine. Führe von der ersten Session an ehrlich Buch (Datum, Limit, Stunden, Ergebnis); nur so trennst du langfristig Können von Zufall.',
          tip: 'Bewerte deine Live-Sessions nie am Ergebnis, sondern an der Qualität deiner Entscheidungen. Eine gewonnene Session voller Fehler ist ein schlechtes Zeichen, eine verlorene Session mit guten Entscheidungen ein gutes.',
        },
      ],
      takeaways: [
        'Live spielst du nur ca. 25–30 Hände pro Stunde – Geduld und Beobachtung in den Händen ohne eigene Beteiligung sind Kernkompetenzen.',
        'Der Live-Pool ist im Schnitt looser und passiver: viel Limping, zu viele Calls, wenige 3-Bets, häufige Multiway-Pötte.',
        'Preflop-Opens von 4–6bb sind live normal – passe Sizings und Calling-Ranges an den Tisch an, nicht an Online-Gewohnheiten.',
        'Die Varianz pro Hand ist ähnlich, aber Schwankungen dauern in Echtzeit viel länger; bewerte dich über Stunden und Entscheidungen, nicht über Sessions.',
        'Freundliches Auftreten und disziplinierter Umgang mit Zeit, Geld und Alkohol sind live Teil der Strategie.',
      ],
      quiz: [
        {
          question: 'Du wechselst von vier Online-Tischen zu einem Live-Tisch. Wie verändert sich dein Handvolumen ungefähr?',
          options: [
            'Es bleibt etwa gleich, da live schneller gedealt wird',
            'Es halbiert sich ungefähr',
            'Es sinkt auf rund ein Zehntel oder weniger',
            'Es steigt, weil live mehr Spieler am Tisch sitzen',
          ],
          correctIndex: 2,
          explanation:
            'Vier Online-Tische liefern 300+ Hände pro Stunde, ein Live-Tisch etwa 25–30. Das Volumen fällt also auf rund ein Zehntel – mit direkten Folgen für Geduld, Fehlerkosten und die Dauer von Schwankungen.',
        },
        {
          question: 'Der typische Low-Stakes-Live-Pool callt zu viel und foldet zu selten. Welche Grundanpassung folgt daraus?',
          options: [
            'Mehr große Bluffs, weil die Gegner unaufmerksam sind',
            'Mehr und dünnere Value Bets, weniger Bluffs',
            'Enger spielen und nur Premiums anfassen',
            'Kleinere Preflop-Raises, um Caller abzuschütteln',
          ],
          correctIndex: 1,
          explanation:
            'Gegen Spieler, die zu viel callen, verdienen Value Bets mehr und Bluffs weniger. Die Kernanpassung lautet: häufiger und dünner auf Value setzen, große Bluffs stark reduzieren.',
        },
        {
          question: 'Warum fühlen sich Downswings live oft dramatischer an als online, obwohl das Spiel dasselbe ist?',
          options: [
            'Live ist die Varianz pro Hand deutlich höher',
            'Der Rake macht Live-Poker unschlagbar',
            'Live-Dealer mischen schlechter als der Zufallsgenerator',
            'Dieselbe Händezahl dauert live viel länger, daher ziehen sich Schwankungen über Monate',
          ],
          correctIndex: 3,
          explanation:
            'Die Varianz pro Hand ist vergleichbar. Aber 30.000 Hände dauern live über 1.000 Stunden – ein Downswing, der online Wochen dauert, zieht sich live über Monate der Echtzeit.',
        },
        {
          question: 'Auf einem lebhaften 1/2-Tisch limpen drei Spieler vor dir. Du willst mit einer starken Hand raisen. Welches Sizing ist als Faustregel angemessen?',
          options: [
            'Etwa 2,5bb wie online üblich',
            'Etwa 4bb plus 1bb pro Limper, hier also rund 7bb',
            'Immer All-in, um die Limper zu bestrafen',
            'Nur callen, um den Pot klein zu halten',
          ],
          correctIndex: 1,
          explanation:
            'Live-Spieler reagieren wenig auf Sizing. Die Faustregel 4bb plus 1bb pro Limper baut mit starken Händen Value auf und dünnt das Feld zumindest etwas aus – 2,5bb würden hier Value verschenken.',
        },
        {
          question: 'Online liefert dir ein HUD Gegnerstatistiken. Was ersetzt diese Informationsquelle live am besten?',
          options: [
            'Aktive Beobachtung, vor allem das Einprägen von Showdowns',
            'Die Chipstacks der Gegner – große Stacks bedeuten gute Spieler',
            'Das Bauchgefühl nach den ersten zwei Händen',
            'Nichts – live spielt man grundsätzlich ohne Reads',
          ],
          correctIndex: 0,
          explanation:
            'Showdowns verknüpfen beobachtete Lines mit tatsächlichen Händen und sind damit die verlässlichste Read-Quelle. Wer die Hände ohne eigene Beteiligung zum Beobachten nutzt, baut sich sein eigenes HUD im Kopf.',
        },
      ],
    },
    {
      id: 'm7-l2',
      title: 'Casino-Ablauf & Etikette',
      duration: 10,
      intro:
        'Der erste Casinobesuch wirkt einschüchternd: fremde Abläufe, ungeschriebene Regeln, wachsame Blicke. In Wahrheit ist alles einfach, wenn man den Ablauf einmal kennt. Diese Lektion führt dich Schritt für Schritt durch den Besuch und die wichtigsten Regeln am Tisch.',
      sections: [
        {
          heading: 'Dein erster Besuch: Schritt für Schritt',
          body:
            'So läuft ein typischer Besuch im Cardroom ab:\n\n- **Einlass**: Ausweis mitbringen (Pflicht), auf den Dresscode achten – meist reicht gepflegte Freizeitkleidung.\n- **Anmelden**: Geh zur Rezeption des Pokerbereichs oder direkt zum **Floor** (der aufsichtführende Mitarbeiter, der Streitfälle entscheidet und Tische organisiert). Sag einfach: "Ich möchte auf die Liste für 1/2 No-Limit Hold\'em."\n- **Warteliste**: Bei vollen Tischen kommst du auf eine Liste und wirst per Aufruf oder Anzeige gerufen. Bleib in Hörweite.\n- **Einkaufen**: Chips bekommst du an der Kasse (Cage) oder je nach Haus direkt am Tisch. Üblich sind Buy-ins zwischen Minimum (oft 50bb) und Maximum (oft 100–250bb). Kauf dich für so viel ein, wie deine Bankroll und dein Spielplan hergeben – tiefe Stacks bevorzugen den besseren Spieler.\n- **Platz nehmen**: Du darfst sofort einen Blind nachzahlen (Post) oder kostenlos warten, bis der Big Blind zu dir kommt. Beides ist in Ordnung; die Wartezeit kannst du zum Beobachten nutzen.\n\nWenn du irgendetwas nicht weißt: Frag den Dealer außerhalb einer laufenden Hand. Niemand erwartet, dass Neulinge alle Abläufe kennen – Dealer helfen gern, und Fragen ist deutlich besser als Raten.',
          tip: 'Sag dem Dealer ruhig beim Hinsetzen, dass du zum ersten Mal live spielst. Das nimmt Druck raus, und der Dealer achtet dann eher darauf, dich vor Formfehlern zu bewahren.',
        },
        {
          heading: 'Rake: die Kosten des Spiels',
          body:
            'Das Casino verdient am Poker über den **Rake** – eine Gebühr, die aus fast jedem Pot entnommen wird. Die zwei gängigen Modelle:\n\n- **Pot-Rake**: Ein Prozentsatz des Pots (je nach Haus etwa 3–10 %) bis zu einem Maximalbetrag pro Hand, dem **Cap**. Beispiel: 10 % bis maximal 6 €. Verbreitet ist die Regel "No Flop, no Drop": Endet die Hand vor dem Flop, wird kein Rake genommen.\n- **Time-Rake**: Auf höheren Limits zahlt stattdessen jeder Spieler einen festen Betrag pro halbe Stunde, unabhängig von den Pötten.\n\nWarum das strategisch wichtig ist: Auf niedrigen Limits ist der Rake relativ zu den Blinds hoch und frisst einen erheblichen Teil der möglichen Winrate. Kleine Pötte, die gerade so über die Flop-Schwelle rutschen, werden prozentual am härtesten belastet. Das spricht live zusätzlich für eine Value-orientierte Spielweise: Du willst große Pötte mit starken Händen gewinnen, nicht viele Kleinstpötte, von denen der Cap jeweils einen großen Bissen nimmt.\n\nInformiere dich vor der Session über die Rake-Struktur deines Casinos – sie steht meist am Tisch oder auf der Website. Ein Unterschied von wenigen Euro im Cap kann über hunderte Stunden den Unterschied zwischen einem schlagbaren und einem kaum schlagbaren Spiel ausmachen.',
          table: {
            headers: ['Modell', 'Funktionsweise', 'Verbreitung'],
            rows: [
              ['Pot-Rake', 'Prozentsatz des Pots bis zum Cap, oft "No Flop, no Drop"', 'Standard auf niedrigen Limits'],
              ['Time-Rake', 'Fester Betrag pro Spieler und Zeitintervall', 'Üblich auf höheren Limits'],
            ],
          },
        },
        {
          heading: 'Verhalten am Tisch: die Grundregeln',
          body:
            'Ein paar Regeln machen den Unterschied zwischen einem willkommenen Gast und einem Ärgernis:\n\n- **Handle nur, wenn du an der Reihe bist**. Aktionen außer der Reihe (Out of Turn) geben Information preis und können bindend sein. Verfolge die Action, damit du bereit bist, wenn sie bei dir ankommt.\n- **Verbale Ansagen sind bindend**. Sagst du "Raise", musst du raisen – auch wenn du es dir anders überlegst.\n- **Schütze deine Karten**. Leg einen Chip oder Card Protector auf deine Hole Cards. Ungeschützte Karten kann der Dealer versehentlich einziehen (mucken) – und eingezogene Karten sind fast immer tot, selbst mitten in einem großen Pot.\n- **Chips sichtbar halten**. Deine höchsten Chip-Werte müssen vorne und sichtbar liegen; Gegner haben jederzeit das Recht, deine ungefähre Stackgröße zu erkennen. Chips verstecken gilt als Angle.\n- **One Player to a Hand**: Sprich während einer laufenden Hand nie über deine Karten oder mögliche Hände – auch nicht, wenn du gefoldet hast. Kommentare wie "Da liegt bestimmt der Flush" beeinflussen die Hand und sind tabu.\n- **Handy weg, wenn du in einer Hand bist** – in vielen Räumen ist das sogar formale Regel.\n\nNichts davon ist kompliziert. Wer aufmerksam ist und in normalem Tempo handelt, fällt nie negativ auf.',
        },
        {
          heading: 'String Bets und die One-Chip-Rule',
          body:
            'Zwei Formregeln stolpern fast alle Live-Neulinge einmal an:\n\n**String Bet**: Chips müssen in **einer zusammenhängenden Bewegung** in den Pot gebracht werden – oder du sagst deine Aktion vorher an. Wer erst einen Stapel setzt, zurückgreift und nachlegt ("Ich calle deine 20 ... und raise nochmal 50"), macht einen String Bet: Nur die erste Bewegung zählt, aus dem geplanten Raise wird ein bloßer Call. Die Regel verhindert, dass jemand die Reaktion des Gegners auf den ersten Teil der Bet abwartet.\n\nDie sichere Methode: **Ansagen, dann handeln.** Sag klar "Raise auf 75", danach darfst du die Chips in beliebig vielen Bewegungen nachschieben.\n\n**One-Chip-Rule**: Wirfst du gegen eine Bet ohne Ansage einen einzelnen Chip in den Pot, der größer ist als der Callbetrag, gilt das als **Call** – nicht als Raise. Der 100er-Chip auf eine 25er-Bet ist ohne das Wort "Raise" nur ein Call. Auch hier schützt dich die verbale Ansage.\n\nGewöhn dir deshalb von Anfang an an, jede nicht-triviale Aktion anzusagen: "Call", "Raise auf X", "All-in". Das ist regelsicher, eindeutig für den Dealer – und ganz nebenbei ein Baustein einer tell-armen Routine.',
          example:
            'Der Gegner bettet 25 €. Du schiebst wortlos einen einzelnen 100-€-Chip vor. Ergebnis: Call über 25 €, du bekommst 75 € zurück. Hättest du vorher "Raise auf 100" gesagt, wäre es ein Raise gewesen. Dieselben Chips, völlig andere Aktion – der Unterschied liegt allein in der Ansage.',
        },
        {
          heading: 'Trinkgeld und Umgangston',
          body:
            'In den USA ist Trinkgeld (Tip) für Dealer fest etabliert: üblich sind 1–2 $ pro gewonnenem Pot, bei sehr großen Pötten gern mehr. In Europa ist das Bild uneinheitlich – in manchen Ländern und Häusern ist Trinkgeld üblich, in anderen unüblich oder dem Personal sogar untersagt. Die pragmatische Lösung: Beobachte in den ersten Runden, was die anderen Spieler tun, oder frag den Dealer außerhalb einer Hand nach den Gepflogenheiten des Hauses. Als Winning Player solltest du Tips realistisch als Kostenfaktor einkalkulieren, aber nicht am falschen Ende knausern: Dealer und Servicekräfte prägen die Atmosphäre, von der gute Spiele leben.\n\nZum Umgangston: Sei der Spieler, neben dem man gern sitzt. Konkret heißt das:\n\n- Keine Belehrungen, kein Spott über schwache Spielzüge.\n- Kein **Slowroll**: Wenn du am Showdown sicher die beste Hand hältst, zeige sie sofort – bewusst zögern, um den Gegner leiden zu lassen, gilt als grober Verstoß gegen die Etikette.\n- Verluste ohne Drama hinnehmen; Wutausbrüche und Kartenwerfen schaden deinem Image und können zum Ausschluss führen.\n\nEtikette ist kein Selbstzweck: Ein angenehmer Tisch hält Freizeitspieler im Spiel und macht deine Session profitabler und schöner zugleich.',
        },
        {
          heading: 'Angle Shooting erkennen und sich schützen',
          body:
            '**Angle Shooting** bezeichnet Aktionen in der Grauzone des Regelwerks, die Gegner täuschen sollen, ohne formal Betrug zu sein. Die häufigsten Muster:\n\n- **Pump Fake**: Eine angedeutete Bet-Bewegung, um deine Reaktion zu testen, ohne Chips zu setzen.\n- **Unklare Gesten**: Eine Handbewegung, die wie ein Check aussieht, später aber als "Ich habe nie gecheckt" umgedeutet wird.\n- **Versteckte Big Chips**: Hohe Chipwerte hinter kleinen Stapeln verbergen, damit du den Stack unterschätzt.\n- **Falsche Ansage am Showdown**: "Ich habe die Straße", obwohl nichts da ist – in der Hoffnung, dass du deine bessere Hand ungezeigt weglegst (muckst).\n- **Aktionen out of turn**, um Reaktionen zu provozieren.\n\nSo schützt du dich:\n\n- **Am Showdown zählt nur, was auf dem Tisch liegt**: "Cards speak" – die aufgedeckten Karten entscheiden, nicht die Ansage. Wirf deine Hand niemals weg, weil jemand etwas behauptet. Lege sie offen hin und lass den Dealer werten.\n- **Bei Unklarheit: Dealer fragen**, bevor du handelst ("Ist das ein Check?").\n- **Floor rufen ist dein gutes Recht** – kein Drama, sondern der normale Weg, Streitfälle zu klären. Zögere nicht, auch als Neuling.\n\nDie meisten Spieler sind fair. Aber wer die Muster kennt, ist gegen die wenigen Ausnahmen gewappnet.',
          tip: 'Gewöhn dir an, deine Hand am Showdown immer offen auf den Tisch zu legen, wenn du sie zeigen willst oder musst – nie nur reinsagen, nie auf Zuruf mucken. Diese eine Gewohnheit neutralisiert die gefährlichsten Angles.',
        },
      ],
      takeaways: [
        'Der Ablauf ist einfach: anmelden beim Floor, Warteliste, Chips kaufen, hinsetzen – und bei Unsicherheit den Dealer fragen.',
        'Rake ist meist ein Prozentsatz des Pots mit Cap ("No Flop, no Drop"); auf niedrigen Limits ist er ein relevanter Kostenfaktor.',
        'Kernregeln: nur an der Reihe handeln, Karten schützen, Chips sichtbar halten, Ansagen sind bindend.',
        'String-Bet- und One-Chip-Rule vermeidest du zuverlässig, indem du jede Aktion vorher klar ansagst.',
        'Gegen Angle Shooting schützen dich drei Gewohnheiten: Karten offen hinlegen (Cards speak), bei Unklarheit den Dealer fragen, im Zweifel den Floor rufen.',
      ],
      quiz: [
        {
          question: 'Du betrittst zum ersten Mal einen Cardroom und willst 1/2 NLH spielen. Was ist der richtige erste Schritt?',
          options: [
            'Dich an den erstbesten freien Platz setzen und Bargeld auf den Tisch legen',
            'An der Rezeption des Pokerbereichs oder beim Floor auf die Liste für dein Limit setzen lassen',
            'Den Dealer während einer laufenden Hand nach einem Platz fragen',
            'Erst an den Automaten spielen, bis ein Platz frei wird',
          ],
          correctIndex: 1,
          explanation:
            'Plätze werden über Wartelisten vergeben, die Rezeption oder der Floor verwaltet. Einfach hinsetzen funktioniert nicht, und Dealer sollten während laufender Hände nicht mit Organisatorischem unterbrochen werden.',
        },
        {
          question: 'Ein Casino nimmt "10 % Rake, Cap 6 €, No Flop no Drop". Was bedeutet das?',
          options: [
            'Jeder Spieler zahlt 6 € pro Stunde Spielzeit',
            'Aus jedem Pot mit Flop werden 10 % entnommen, höchstens aber 6 €; endet die Hand preflop, fällt kein Rake an',
            'Der Gewinner zahlt immer genau 6 € an das Casino',
            'Es werden 10 % vom Buy-in jedes Spielers einbehalten',
          ],
          correctIndex: 1,
          explanation:
            'Pot-Rake ist ein Prozentsatz des Pots bis zum Cap pro Hand. "No Flop, no Drop" bedeutet, dass preflop entschiedene Hände rakefrei bleiben. Zeitgebühren pro Spieler sind ein anderes Modell (Time-Rake).',
        },
        {
          question: 'Du sagst nichts, setzt erst 20 € vor die Linie, greifst zurück und legst weitere 40 € nach. Was gilt?',
          options: [
            'Ein Raise auf 60 €, weil die Absicht erkennbar war',
            'Die Hand ist tot',
            'Nur die ersten 20 € zählen – ein String Bet wird auf die erste Bewegung reduziert',
            'Der Dealer entscheidet per Münzwurf',
          ],
          correctIndex: 2,
          explanation:
            'Ohne verbale Ansage zählt nur die erste zusammenhängende Vorwärtsbewegung. Das Nachlegen ist ein String Bet und wird gestrichen. Sicher bist du nur mit vorheriger Ansage: "Raise auf 60".',
        },
        {
          question: 'Der Gegner bettet 10 €. Du wirfst wortlos einen 50-€-Chip in den Pot. Welche Aktion hast du gemacht?',
          options: [
            'Einen Raise auf 50 €',
            'Einen Call über 10 € – die One-Chip-Rule wertet den einzelnen Chip ohne Ansage als Call',
            'Einen Fold, weil die Aktion unklar ist',
            'Ein All-in',
          ],
          correctIndex: 1,
          explanation:
            'Ein einzelner übergroßer Chip ohne Ansage gilt gegen eine Bet immer als Call. Wer raisen will, muss es vorher ansagen. Die Regel verhindert Mehrdeutigkeit und Angle-Versuche.',
        },
        {
          question: 'Warum solltest du deine Hole Cards mit einem Chip oder Card Protector abdecken?',
          options: [
            'Damit die Gegner die Kartenrücken nicht analysieren können',
            'Es ist reine Dekoration ohne praktische Funktion',
            'Ungeschützte Karten kann der Dealer versehentlich einziehen – und gemuckte Karten sind fast immer tot',
            'Weil unbedeckte Karten automatisch als Fold gewertet werden',
          ],
          correctIndex: 2,
          explanation:
            'Der Dealer sammelt Karten routiniert ein; ungeschützte Hände geraten dabei gelegentlich in den Muck. Einmal eingezogen, ist die Hand in der Regel tot – selbst wenn sie den Pot gewonnen hätte. Der Chip obendrauf verhindert das.',
        },
        {
          question: 'Am Showdown sagt dein Gegner selbstbewusst "Straße", du hältst zwei Paar. Was ist die richtige Reaktion?',
          options: [
            'Deine Karten offen hinlegen und den Dealer die Hände werten lassen – Cards speak',
            'Deine Hand mucken, um keine Zeit zu verschwenden',
            'Sofort den Sicherheitsdienst rufen',
            'Seine Ansage akzeptieren und den Pot rüberschieben',
          ],
          correctIndex: 0,
          explanation:
            'Verbale Ansagen am Showdown sind wertlos – es zählen nur die aufgedeckten Karten ("Cards speak"). Falsche Ansagen sind ein klassischer Angle, um dich zum Mucken der besseren Hand zu bewegen. Immer offen hinlegen, nie auf Zuruf folden.',
        },
      ],
    },
    {
      id: 'm7-l3',
      title: 'Tells lesen – mit System',
      duration: 9,
      intro:
        'Tells – unbewusste Verhaltenssignale über die Handstärke – sind der berühmteste Teil des Live-Pokers und zugleich der am meisten überschätzte. Diese Lektion zeigt, welche Signale wirklich Substanz haben, wie du sie systematisch erhebst und wie viel Gewicht sie in deinen Entscheidungen verdienen.',
      sections: [
        {
          heading: 'Vergiss Hollywood',
          body:
            'Im Kino verrät ein Augenzucken den Bluff und ein Keks-Geräusch die Nuts. Die Realität ist unspektakulärer: Verwertbare Tells sind subtil, spielerspezifisch und nie hundertprozentig. Wer glaubt, Gegner wie ein Buch zu lesen, macht typischerweise zwei teure Fehler:\n\n- **Überinterpretation**: Aus einer einzelnen Beobachtung ("Er hat geschluckt!") wird eine sichere Diagnose. Menschen schlucken, zittern und schauen weg – aus hundert Gründen.\n- **Falsche Priorität**: Physische Signale überstimmen die Betting-Logik. Wenn Range-Analyse und Sizing klar für einen Fold sprechen, rettet ein vermeintlicher Nervositäts-Tell den Call nicht.\n\nDie richtige Einordnung: Tells sind **Zünglein an der Waage in knappen Situationen** – nicht die Grundlage deiner Strategie. Erst kommt die normale Analyse (Range, Sizing, Board, Spielertyp). Ist die Entscheidung danach eng, darf ein solider Read den Ausschlag geben. Ist sie klar, ignorierst du den Tell.\n\nDazu kommt: Gegen aufmerksame Gegner können Signale auch gespielt sein. Gerade auffällig zur Schau gestelltes Verhalten – demonstratives Seufzen, betontes Desinteresse – ist häufiger Theater als Leck. Als Faustregel gilt: Bewusst gesendete Signale bedeuten oft das Gegenteil, unbewusste Leaks sind die wertvollen.',
        },
        {
          heading: 'Baseline: erst beobachten, dann deuten',
          body:
            'Kein Tell hat Bedeutung ohne Vergleichsmaßstab. Deshalb beginnt systematisches Tell-Lesen mit der **Baseline**: dem Normalverhalten eines Spielers, wenn nichts auf dem Spiel steht.\n\nBeobachte jeden Gegner zunächst in unkritischen Momenten: Wie sitzt er, wenn er nicht in der Hand ist? Redet er viel oder wenig? Wie schnell handelt er in Standard-Situationen? Wie fasst er seine Chips an? Erst wenn du dieses Grundrauschen kennst, wird eine **Abweichung** zum Signal: Der Dauerredner, der mitten im großen Pot verstummt. Der hektische Spieler, der plötzlich ganz still sitzt. Nicht das Verhalten selbst trägt die Information, sondern der Bruch mit dem Muster.\n\nDer wertvollste Kalibrierungsmoment ist der **Showdown**: Dort siehst du Verhalten und tatsächliche Hand nebeneinander. Präge dir ein: Wie hat sich Seat 5 verhalten, während er mit dem Set gebettet hat? Wie sah sein einziger aufgedeckter Bluff aus? Zwei, drei solcher Datenpunkte machen aus vagen Eindrücken einen belastbaren spielerspezifischen Read.\n\nPraktisch heißt das: Die beste Zeit zum Beobachten sind die Hände, an denen du **nicht** beteiligt bist. Beobachte gezielt einen Spieler pro Runde statt diffus den ganzen Tisch – und schau bei Aktionen der Gegner nicht auf das Board, sondern auf die Spieler: Das Board läuft dir nicht weg, die Reaktionen schon.',
          tip: 'Schau beim Austeilen des Flops nicht auf die Karten, sondern auf die Gegner, die vor dir handeln. Ihre erste Reaktion auf das Board ist unverfälschter als alles, was danach kommt.',
        },
        {
          heading: 'Timing-Tells: die Geschwindigkeit der Entscheidung',
          body:
            'Timing gehört zu den verlässlichsten Signalquellen, weil es schwer zu kontrollieren ist und direkt den Entscheidungsprozess spiegelt:\n\n- **Insta-Call**: Ein Call ohne jede Bedenkzeit bedeutet fast nie ein Monster – wer sehr stark ist, denkt zumindest kurz über einen Raise nach. Der blitzschnelle Call sagt: "Ich muss weder Raise noch Fold erwägen" – typisch für Draws und mittelstarke Hände, die weiterspielen, aber keinen großen Pot wollen.\n- **Insta-Bet**: Eine Bet, die kommt, bevor die vorherige Aktion ganz abgeschlossen ist, war vorbereitet. Das ist oft eine automatische Continuation Bet oder eine impulsiv-schwache Aktion – seltener eine sorgfältig geplante Value Bet.\n- **Langes Nachdenken, dann Check**: meist echte Schwäche oder eine aufgegebene Hand.\n- **Langes Nachdenken, dann Bet oder Raise**: Vorsicht – gerade bei Freizeitspielern häufiger stark als schwach. Wer wirklich blufft, will die Situation meist schnell hinter sich bringen; wer über das Sizing seiner Value Bet nachdenkt, braucht Zeit. Als gespieltes Theater ("lange grübeln, dann raisen") ist es allerdings auch beliebt – die Baseline entscheidet.\n\nWichtig: All das sind Tendenzen im Pool, keine Naturgesetze. Bei einem konkreten Gegner zählt sein individuelles Muster mehr als jede Faustregel.',
          example:
            'Du c-bettest auf 9♣ 7♦ 3♠ und dein Gegner callt, bevor deine Chips den Pot erreichen. Sein Insta-Call spricht gegen ein Set (damit würde er einen Raise zumindest erwägen) und für mittlere Paare, Gutshots oder Backdoor-Hände. Auf vielen guten Turn-Karten kannst du mit erhöhter Erfolgserwartung weiter Druck machen.',
          cards: ['9c', '7d', '3s'],
        },
        {
          heading: 'Hände, Chips und Stimme',
          body:
            'Neben dem Timing liefern drei Bereiche brauchbare Signale:\n\n**Chip-Handling vor der Aktion**: Greift ein Gegner demonstrativ zu seinen Chips, während du überlegst, ist das oft ein Abschreckungsversuch – er signalisiert Call-Bereitschaft, um deine Bet zu verhindern, und ist dann eher schwach bis mittelstark. Umgekehrt sind still abgezählte Chips, die unauffällig bereitliegen, häufiger echte Call- oder Raise-Absicht.\n\n**Zitternde Hände**: Der Klassiker aus der Tell-Literatur – und kontraintuitiv: Zittern beim Setzen bedeutet meist **Stärke**, nicht Nervosität. Es ist Adrenalinabbau nach dem Treffer einer großen Hand. Bluffer zittern selten; sie kontrollieren sich eher zu viel und wirken hölzern.\n\n**Redseligkeit und Verstummen**: Wer mitten in einem großen Pot entspannt weiterplaudert, flüssig antwortet und locker wirkt, ist überdurchschnittlich oft stark – echte Entspanntheit lässt sich schwer spielen. Das Gegenteil, plötzliches Verstummen, eingefrorene Haltung, flacher Atem und regloser Blick, findet sich gehäuft bei Bluffs: Der Körper geht in Deckung, um nichts zu verraten, und verrät genau dadurch etwas.\n\nAlle drei Kategorien funktionieren nur relativ zur Baseline des jeweiligen Spielers – ein grundsätzlich stiller Mensch, der still bleibt, sagt dir nichts.',
        },
        {
          heading: 'Bet-Sizing: der größte Tell von allen',
          body:
            'Der zuverlässigste "Tell" ist gar kein körperlicher: Es ist das **Bet-Sizing**. Freizeitspieler bemessen ihre Einsätze unbewusst nach Handstärke, nicht nach Strategie – und diese Muster sind stabiler und leichter zu lesen als jede Geste:\n\n- **Ungewöhnlich große Bets** (Overbets, plötzliche Verdreifachung) sind bei passiven Spielern überproportional oft sehr stark – "Ich will endlich bezahlt werden" oder Schutzpanik mit einem Monster.\n- **Auffällig kleine Bets** in großen Pötten sind oft mittelstarke Hände, die billig zum Showdown wollen (Blocking Bets).\n- **Der Min-Raise eines passiven Spielers** am Turn oder River ist einer der stärksten Alarmsignale im Live-Poker – dahinter steckt fast immer eine sehr große Hand.\n- **Abweichungen vom persönlichen Muster** zählen am meisten: Wer dreimal 60 % Pot als Value gebettet hat und plötzlich 130 % bettet, erzählt eine neue Geschichte – finde heraus, welche.\n\nOrdne deine Informationsquellen deshalb bewusst in eine Hierarchie (siehe Tabelle) und gewichte sie entsprechend. Sizing- und Aktionsmuster stehen oben, Gesichtsausdrücke ganz unten. So systematisierst du Reads, statt Eindrücken hinterherzulaufen.',
          table: {
            headers: ['Rang', 'Signalquelle', 'Verlässlichkeit'],
            rows: [
              ['1', 'Bet-Sizing und Aktionsmuster', 'hoch – schwer zu verstellen, direkt strategierelevant'],
              ['2', 'Timing der Entscheidungen', 'mittel bis hoch – schwer bewusst konstant zu halten'],
              ['3', 'Sprache und Stimmverhalten', 'mittel – aussagekräftig vor allem als Baseline-Bruch'],
              ['4', 'Körperhaltung, Hände, Mimik', 'niedrig – nur mit Baseline und nie allein entscheidend'],
            ],
          },
          tip: 'Führe pro Gegner im Kopf eine Mini-Datei mit genau zwei Einträgen: "Welches Sizing wählt er mit Value?" und "Welches mit Bluffs oder Schwäche?" Diese zwei Antworten sind mehr wert als zehn beobachtete Gesten.',
        },
      ],
      takeaways: [
        'Tells sind das Zünglein an der Waage in knappen Spots – niemals Ersatz für Range-, Board- und Sizing-Analyse.',
        'Ohne Baseline kein Read: Erst das Normalverhalten eines Spielers kennen, dann Abweichungen deuten – Showdowns sind der beste Kalibrierungsmoment.',
        'Insta-Calls zeigen selten Monster, sondern meist Draws und mittelstarke Hände, weil kein Raise erwogen wurde.',
        'Zitternde Hände bedeuten meist Stärke; plötzliches Verstummen und Erstarren eines redseligen Spielers deutet gehäuft auf Bluffs.',
        'Die verlässlichste Informationsquelle ist das Bet-Sizing – gewichte Signale nach der Hierarchie: Sizing vor Timing vor Sprache vor Körpersprache.',
      ],
      quiz: [
        {
          question: 'Welche Rolle sollten Tells in deinem Entscheidungsprozess spielen?',
          options: [
            'Sie sind die primäre Entscheidungsgrundlage im Live-Poker',
            'Sie geben in ansonsten knappen Situationen den Ausschlag, überstimmen aber keine klare strategische Analyse',
            'Sie sind komplett wertlos und sollten ignoriert werden',
            'Sie ersetzen die Range-Analyse, sobald man den Gegner eine Stunde beobachtet hat',
          ],
          correctIndex: 1,
          explanation:
            'Tells sind Zusatzinformation mit begrenzter Verlässlichkeit. Erst kommt die normale Analyse aus Range, Sizing und Spielertyp; nur wenn die Entscheidung danach eng ist, darf ein solider Read entscheiden.',
        },
        {
          question: 'Warum brauchst du eine Baseline, bevor du Verhalten deutest?',
          options: [
            'Weil Tells nur bei Anfängern funktionieren',
            'Weil das Casino Baselines vorschreibt',
            'Weil nicht das Verhalten selbst die Information trägt, sondern die Abweichung vom Normalverhalten des jeweiligen Spielers',
            'Weil man Tells nur am Showdown deuten darf',
          ],
          correctIndex: 2,
          explanation:
            'Stille bei einem stillen Spieler bedeutet nichts; Stille bei einem Dauerredner mitten im großen Pot ist ein Signal. Ohne Kenntnis des Grundrauschens lässt sich keine Abweichung erkennen.',
        },
        {
          question: 'Dein Gegner callt deine Flop-Bet, bevor deine Chips überhaupt liegen. Was ist die wahrscheinlichste Deutung?',
          options: [
            'Er hat fast sicher ein Set und slowplayt',
            'Er wollte weder Raise noch Fold erwägen – typisch für Draws und mittelstarke Hände',
            'Er hat sich verklickt',
            'Insta-Calls sind grundsätzlich nicht deutbar',
          ],
          correctIndex: 1,
          explanation:
            'Der Insta-Call verrät, dass weder Raise noch Fold ernsthaft geprüft wurden. Sehr starke Hände denken zumindest kurz über einen Raise nach – deshalb sprechen blitzschnelle Calls eher für Draws und mittlere Made Hands.',
        },
        {
          question: 'Ein Gegner setzt eine große Turn-Bet und seine Hände zittern dabei sichtbar. Klassische Deutung?',
          options: [
            'Nervosität wegen eines Bluffs – ein klarer Call',
            'Er hat zu viel Kaffee getrunken, das Signal ist wertlos',
            'Meist echte Stärke: Zittern ist typischer Adrenalinabbau nach dem Treffer einer großen Hand',
            'Er will das Zittern zeigen, also ist es sicher gespielt',
          ],
          correctIndex: 2,
          explanation:
            'Der kontraintuitive Klassiker: Zitternde Hände beim Setzen begleiten meist große Hände. Bluffer kontrollieren sich eher zu stark und wirken eingefroren statt zittrig. Wie immer gilt: mit der Baseline des Spielers abgleichen.',
        },
        {
          question: 'Welche Informationsquelle steht in der Zuverlässigkeitshierarchie ganz oben?',
          options: [
            'Mimik und Augenbewegungen',
            'Bet-Sizing und Aktionsmuster',
            'Die Sitzhaltung',
            'Die Kleidung des Gegners',
          ],
          correctIndex: 1,
          explanation:
            'Sizing-Muster sind schwer zu verstellen, direkt strategierelevant und über viele Hände stabil beobachtbar – etwa der Min-Raise des passiven Spielers als Alarmsignal. Körpersprache und Mimik stehen ganz unten und zählen nur mit Baseline.',
        },
      ],
    },
    {
      id: 'm7-l4',
      title: 'Die eigenen Tells minimieren',
      duration: 7,
      intro:
        'Während du Gegner liest, lesen sie dich. Die gute Nachricht: Du musst kein Pokerface aus Stein haben – du musst nur konsistent sein. Diese Lektion baut dir eine tell-arme Routine für jede Situation am Tisch.',
      sections: [
        {
          heading: 'Eine feste Routine für jede Aktion',
          body:
            'Tells entstehen durch **Variation**: Wer mit den Nuts anders handelt als mit einem Bluff, ist lesbar. Die Lösung ist keine Schauspielkunst, sondern Standardisierung – gleiche Abläufe für alle Hände:\n\n- **Gleiches Timing**: Baue vor jeder Aktion eine kurze, feste Pause ein – zähle innerlich zum Beispiel bis fünf, egal ob die Entscheidung trivial ist oder schwer. So verschwinden Insta-Aktionen (die Schwäche verraten) genauso wie auffällige Denkpausen. Bei wirklich schweren Entscheidungen darfst du natürlich länger brauchen – die Grundpause sorgt dafür, dass "kurz" und "lang" bei dir näher beieinanderliegen.\n- **Gleiche Bewegung**: Setze Chips immer mit derselben Hand, derselben Geste, auf dieselbe Stelle. Keine wuchtigen Splash-Bets mit starken Händen, kein zaghaftes Nachschieben mit Bluffs.\n- **Gleiche Ansagen**: Kündige Aktionen mit denselben knappen Worten an ("Raise, 75") – immer im selben Tonfall.\n- **Gleiche Haltung nach der Bet**: Entscheide dich für eine neutrale Position (z. B. Hände ruhig vor dir, Blick auf die Tischmitte) und nimm sie nach jeder Bet ein – nach Value Bets wie nach Bluffs.\n\nDer Maßstab ist einfach: Ein Beobachter, der nur dein Verhalten sieht, dürfte keinen Unterschied zwischen deiner stärksten und deiner schwächsten Hand feststellen. Routinen erreichen das zuverlässiger als jede Willensanstrengung im Einzelfall.',
          tip: 'Trainiere die Routine dort, wo sie nichts kostet: in Kleinstpötten und Standardsituationen. Wenn sie dort automatisch läuft, hält sie auch im 400bb-Pot, wenn dein Puls auf 140 ist.',
        },
        {
          heading: 'Karten anschauen: einmal, gleich, merken',
          body:
            'Der Moment, in dem du deine Hole Cards ansiehst, ist ein klassisches Leck. Drei Regeln dichten es ab:\n\n- **Immer zum gleichen Zeitpunkt schauen**. Viele erfahrene Spieler schauen erst, wenn die Action bei ihnen ankommt: Vorher gibt es schlicht nichts zu verraten, und nebenbei kannst du die Reaktionen der Gegner vor dir beobachten. Wichtig ist weniger der gewählte Zeitpunkt als seine Konstanz – wer mal sofort, mal spät schaut, erzeugt ein Muster.\n- **Einmal schauen und alles merken**: Ränge **und** Farben. Das klassische Leck: Am Flop erscheinen drei Herzen, und du musst nachschauen, ob dein Ass rot ist. Aufmerksame Gegner wissen dann: Wer auf einem monotonen Board nachschaut, hat fast nie den fertigen Flush (den hätte er sich gemerkt), sondern prüft eine einzelne Karte. Merke dir deshalb bei jedem ersten Blick beide Farben mit – nach kurzer Zeit ist das Automatismus.\n- **Keine Reaktion, kein Chip-Blick**: Schau nach dem Flop nicht reflexhaft auf deine Chips – der schnelle Blick zum eigenen Stack, wenn das Board dich getroffen hat, ist einer der bekanntesten Anfänger-Tells überhaupt. Board ansehen, kurze feste Pause, dann handeln.\n\nDiese Gewohnheiten kosten nichts, wirken sofort und halten ein ganzes Pokerleben.',
          example:
            'Du hältst A♠ 7♠, der Turn bringt das dritte Pik. Weil du dir beim ersten Blick beide Farben eingeprägt hast, bettest du ohne erneutes Nachschauen in normalem Rhythmus. Dein Gegner, der auf genau dieses Nachschauen achtet, bekommt die Information nicht – und dein Flush bleibt unsichtbar.',
          cards: ['As', '7s'],
        },
        {
          heading: 'Wenn du im großen Pot angesprochen wirst',
          body:
            'Früher oder später passiert es: Du setzt am River deinen Stack, und der Gegner beginnt zu reden. "Hast du das Set?" – "Wenn ich calle, zeigst du?" – manche starren dich einfach nur an. Dieses **Speech Play** hat ein Ziel: eine Reaktion provozieren, aus der sich etwas ablesen lässt.\n\nDie robusteste Verteidigung ist eine **vorab festgelegte, immer gleiche Antwortpolitik**. Die einfachste und meistempfohlene: freundliches Schweigen. Ein kurzes Lächeln oder ein neutrales "Viel Erfolg bei der Entscheidung" – und dann konsequent nichts mehr, bei jedem Pot, mit jeder Hand. Entscheidend ist nicht, was du tust, sondern dass es **immer dasselbe** ist. Wer mal antwortet und mal schweigt, macht die Abweichung selbst zum Tell: Reden mit Value, Schweigen mit Bluffs (oder umgekehrt) ist ein Muster, das gute Gegner nach zwei Showdowns kennen.\n\nDazu gehört die körperliche Komponente: gleiche Haltung, ruhiger Atem (bewusst normal weiteratmen – flacher Atem ist sicht- und hörbar), Blick auf einen festen Punkt statt Blickkontakt-Duelle. Beantworte auch scheinbar harmlose Fragen nicht ("Willst du, dass ich calle?") – jede echte Antwort ist Information, und Lügen unter Druck können die wenigsten überzeugend.\n\nFalls du gern am Tisch redest: erlaubt und sogar gut fürs Spielklima – aber stell das Reden ein, sobald du in einer laufenden großen Hand bist. Konsequent, nicht handabhängig.',
        },
        {
          heading: 'Sonnenbrille, Kapuze, Kopfhörer: pragmatisch betrachtet',
          body:
            'Die Ausrüstungsfrage wird überschätzt. Eine nüchterne Bewertung:\n\n- **Sonnenbrille**: Verbirgt Blickrichtung und Pupillen – also Signale, die ohnehin am unteren Ende der Zuverlässigkeitshierarchie stehen. Kosten: schlechtere Sicht auf Karten und Chips in dunklen Räumen, erschwerter sozialer Kontakt (schlecht fürs Spielklima und damit für die Spielqualität) und für manche Gegner eine Einladung, dich als ernsthaften Spieler zu meiden. Nutzen gering, Kosten real – für die meisten verzichtbar.\n- **Kapuze und Schal**: Verdecken Hals und Teile des Gesichts (etwa sichtbaren Puls). Marginaler Effekt, aber günstig und unauffälliger als die Brille. Geschmackssache.\n- **Kopfhörer**: Blocken Speech Play und helfen manchen bei der Konzentration – aber du verpasst Tischgespräche, Ansagen und wertvolle verbale Information der Gegner. Wenn überhaupt, dann ein Ohr frei, und heraus damit, sobald du in einer Hand bist.\n\nDie ehrliche Wahrheit: **Deine ausbeutbaren Lecks sind Timing, Sizing und Routinebrüche – und gegen die hilft keine Brille.** Ausrüstung darf eine Krücke für die Nervosität der ersten Sessions sein; das eigentliche Fundament sind die Routinen aus dieser Lektion. Wer konsistent handelt, ist auch mit freiem Gesicht kaum lesbar. Wer inkonsistent handelt, verrät sich auch hinter verspiegelten Gläsern.',
          tip: 'Investiere die Energie, die du in Verkleidung stecken würdest, in eine einzige Kennzahl: Wie gleichförmig sind dein Timing und deine Bewegungen über alle Handstärken hinweg? Das ist der komplette Kern der Tell-Vermeidung.',
        },
      ],
      takeaways: [
        'Tells entstehen durch Variation – die Gegenmaßnahme ist Standardisierung: gleiches Timing, gleiche Bewegung, gleiche Ansage, gleiche Haltung für jede Handstärke.',
        'Eine feste kurze Pause vor jeder Aktion eliminiert Insta-Aktionen und nivelliert Denkzeiten.',
        'Karten immer zum gleichen Zeitpunkt ansehen und Ränge plus Farben sofort merken – Nachschauen auf monotonen Boards ist ein bekanntes Leck.',
        'Gegen Speech Play in großen Pots schützt eine immer gleiche Antwortpolitik – meist freundliches, konsequentes Schweigen.',
        'Sonnenbrille und Co. verdecken nur die unzuverlässigsten Signale; Timing-, Sizing- und Routinedisziplin sind der eigentliche Schutz.',
      ],
      quiz: [
        {
          question: 'Was ist der wirksamste Grundschutz gegen eigene Timing-Tells?',
          options: [
            'Immer so schnell wie möglich handeln, um keine Denkzeit zu zeigen',
            'Eine feste kurze Pause vor jeder Aktion, unabhängig von der Handstärke',
            'Bei starken Händen bewusst lange nachdenken',
            'Das Timing zufällig variieren, um Verwirrung zu stiften',
          ],
          correctIndex: 1,
          explanation:
            'Die konstante Grundpause macht triviale und schwere Entscheidungen äußerlich ähnlicher. Immer schnell zu handeln ist selbst ein Muster und bei schweren Entscheidungen gar nicht durchzuhalten; absichtliche Variation ist schwer konsistent zu spielen.',
        },
        {
          question: 'Warum solltest du dir beim ersten Blick auf deine Hole Cards auch die Farben einprägen?',
          options: [
            'Weil der Dealer die Farben abfragen darf',
            'Weil man sonst die One-Chip-Rule verletzt',
            'Damit du auf monotonen Boards nicht nachschauen musst – das Nachschauen verrät, dass du höchstens eine Karte der Farbe hältst',
            'Farben sind irrelevant, nur die Ränge zählen',
          ],
          correctIndex: 2,
          explanation:
            'Wer auf einem Board mit drei gleichfarbigen Karten seine Hole Cards prüft, hat fast nie den fertigen Flush – den hätte er sich gemerkt. Aufmerksame Gegner lesen das Nachschauen als "höchstens eine passende Karte".',
        },
        {
          question: 'Du bettest am River all-in und dein Gegner fragt: "Zeigst du, wenn ich folde?" Was ist die beste Reaktion?',
          options: [
            'Ehrlich antworten, um fair zu bleiben',
            'Nur bei einem Bluff antworten, um ihn zum Fold zu bewegen',
            'Zurückstarren, bis er wegschaut',
            'Deine vorab festgelegte Standardreaktion zeigen – zum Beispiel freundliches Schweigen, wie in jedem anderen großen Pot auch',
          ],
          correctIndex: 3,
          explanation:
            'Entscheidend ist Konsistenz: Wer mal antwortet und mal schweigt, macht die Abweichung selbst zum Tell. Eine feste Antwortpolitik – typischerweise höfliches Schweigen – gibt unabhängig von der Handstärke null Information preis.',
        },
        {
          question: 'Wie ist eine Sonnenbrille am Pokertisch nüchtern zu bewerten?',
          options: [
            'Unverzichtbar – ohne sie ist man für gute Gegner ein offenes Buch',
            'Geringer Nutzen, weil sie nur die unzuverlässigsten Signale verdeckt – Timing- und Sizing-Lecks bleiben ungeschützt',
            'Verboten in allen Casinos',
            'Sinnvoll, weil sie automatisch das Bet-Sizing verbessert',
          ],
          correctIndex: 1,
          explanation:
            'Augensignale stehen ganz unten in der Zuverlässigkeitshierarchie. Die ausbeutbaren Lecks – Timing, Bewegungen, Sizing-Muster – verdeckt keine Brille. Routinen schützen; Ausrüstung ist höchstens eine Krücke für den Anfang.',
        },
        {
          question: 'Der Flop trifft deine Hand hart. Welches Verhalten wäre ein klassischer Anfänger-Tell, den du vermeiden solltest?',
          options: [
            'Der reflexhafte kurze Blick auf die eigenen Chips',
            'Das Board in normalem Tempo ansehen',
            'Die gewohnte feste Pause vor der Aktion',
            'Die übliche neutrale Sitzhaltung beibehalten',
          ],
          correctIndex: 0,
          explanation:
            'Der schnelle Blick zum eigenen Stack nach einem Treffer signalisiert Bet-Absicht und damit Stärke – eines der bekanntesten unbewussten Lecks. Die Routine dagegen: Board ansehen, feste Pause, dann in gewohnter Form handeln.',
        },
      ],
    },
    {
      id: 'm7-l5',
      title: 'Live-Strategieanpassungen',
      duration: 11,
      intro:
        'Online-Standardstrategie ist die Basis – aber wer sie unangepasst an einen loosen, passiven Live-Tisch trägt, lässt viel Geld liegen. Diese Lektion übersetzt die Eigenheiten des Live-Umfelds in konkrete strategische Anpassungen: Value, Bluffs, Multiway, tiefe Stacks, Straddles und Tischauswahl.',
      sections: [
        {
          heading: 'Mehr Value Bets – und dünnere',
          body:
            'Die wichtigste Live-Anpassung in einem Satz: **Verlagere dein Geldverdienen von Bluffs auf Value Bets.** Loose-passive Gegner folden zu selten und callen zu weit – jede dieser Eigenschaften macht Value Betting profitabler.\n\nKonkret heißt das:\n\n- **Bette starke Hände konsequent über drei Streets.** Slowplay ist gegen Spieler, die ohnehin callen, meist reine Geldverschwendung.\n- **Bette dünner auf Value.** Eine Bet ist "dünner Value", wenn sie von der gegnerischen Call-Range nur knapp mehrheitlich geschlagen wird. Gegen Calling Stations (Spieler, die notorisch zu viel callen) sind River-Bets mit Top Pair, mittelmäßigem Kicker oder sogar Second Pair oft klar profitabel – Hände, mit denen du online gegen Regs eher checkst.\n- **Size größer.** Loose Caller reagieren wenig elastisch auf Sizing: Sie callen 75 % Pot fast so oft wie 40 %. Wenn die Call-Wahrscheinlichkeit kaum sinkt, maximiert die größere Bet deinen Erwartungswert.\n\nDie mentale Hürde ist real: Dünne Value Bets werden regelmäßig gesnapcallt und gelegentlich zeigst du die schlechtere Hand. Das gehört dazu – entscheidend ist, dass der Call-Pool deiner Bet mehrheitlich aus schlechteren Händen besteht, nicht dass du jede einzelne Konfrontation gewinnst.',
          example:
            'Du hältst K♦ J♦ auf K♠ 8♥ 4♣ 7♦ 2♠ gegen einen Calling Station, der Flop und Turn gecallt hat. Online gegen einen Reg wäre der River oft ein Check. Hier bettest du klar auf Value, etwa 60–70 % Pot: Seine Call-Range ist voll mit schlechteren Königen, Achten und hartnäckigen Paaren, die dich auszahlen.',
          cards: ['Kd', 'Jd'],
        },
        {
          heading: 'Weniger große Bluffs',
          body:
            'Die Kehrseite derselben Medaille: **Große Bluffs verlieren in loosen Pools massiv an Wert.** Ein Bluff ist nur profitabel, wenn der Gegner oft genug foldet – genau das tun Live-Freizeitspieler nicht. Der Triple-Barrel, der online eine solide Fold Equity hat, wird auf 1/2 vom unbeeindruckten Station mit Third Pair gecallt.\n\nDaraus folgt keine Bluff-Abstinenz, sondern Selektion:\n\n- **Bluffe die Richtigen**: Gegen den tighten Reg, der fold-fähig ist, funktionieren Bluffs weiter. Gegen den Station, der "einfach mal schauen will", sind pure River-Bluffs verbrennen von Geld.\n- **Bluffe mit Equity**: Semi-Bluffs mit Flush- oder Straight-Draws behalten ihren Wert, weil sie zwei Gewinnwege haben – Fold jetzt oder Treffer später. Reine Air-Bluffs ohne Verbesserungschance streichst du weitgehend.\n- **Kleine Bluffs mit realer Fold Equity bleiben**: Das Stehlen verwaister Limp-Pötte oder eine Bet gegen offensichtliches Desinteresse kostet wenig und funktioniert auch live.\n- **Multiway blufft man kaum**: Jeder zusätzliche Spieler muss folden, damit der Bluff durchgeht – bei drei, vier Gegnern hält fast immer jemand eine Hand, die nicht loslässt.\n\nDie Faustregel für loose-passive Tische: Wenn du unsicher bist, ob eine Bet als Bluff oder als Value zählt, und der Gegner ein Station ist – checke die Bluffs, bette die Value.',
          tip: 'Prüfe vor jedem geplanten Bluff eine einzige Frage: "Welche konkreten besseren Hände foldet DIESER Gegner?" Fällt dir keine plausible Antwort ein, gibt es den Bluff nicht.',
        },
        {
          heading: 'Multiway-Pötte: nut-orientiert spielen',
          body:
            'Live siehst du deutlich häufiger Flops mit drei, vier oder fünf Spielern. Multiway verschieben sich die Anforderungen fundamental: **Je mehr Spieler, desto stärker muss die Gewinnerhand am Ende sein** – irgendjemand trifft fast immer etwas.\n\nDie Konsequenzen:\n\n- **Handauswahl preflop**: Hände mit Nut-Potenzial gewinnen an Wert – Pocket Pairs (Set-Mining mit exzellenten Implied Odds gegen viele Zahler), Suited Aces (Nut-Flush-Potenzial), gute Suited Connectors. Dominierbare Offsuit-Broadways wie KJo oder QTo verlieren an Wert: Sie treffen Top Pair mit Kicker-Problemen und werden in Multiway-Pötten regelmäßig von besseren gleichen Paaren ausbezahlt statt umgekehrt.\n- **Vorsicht mit Non-Nut-Draws**: Der kleine Flush-Draw ist multiway gefährlich – trifft er, ist die Gefahr real, gegen einen höheren Flush den Stack zu verlieren (Flush over Flush ist mit fünf Spielern am Flop keine Rarität mehr).\n- **Postflop ehrlicher spielen**: One Pair schrumpft im Wert, Bluffs sind selten sinnvoll (siehe oben), und starke Hände wollen betten – zum Value und zum Schutz gegen die vielen Draws, die multiway unterwegs sind. Wer mit einem Set auf drawlastigem Board gegen vier Gegner slowplayt, lädt zum kostenlosen Überholen ein.\n\nMerksatz: Heads-up gewinnt oft die frechere Hand, multiway gewinnt die bessere. Spiele Hände, die die bessere sein können.',
          example:
            'Fünf Spieler sehen den Flop. Mit 6♥ 5♥ triffst du auf A♥ 9♥ 2♣ deinen Flush-Draw – aber es ist der Baby-Flush-Draw in einem Feld, in dem A♥ X♥ und K♥ X♥ realistisch vertreten sind. Statt den Draw um jeden Preis zu maximieren, spielst du ihn kontrolliert: mitgehen ja, aber keine großen Pötte aufbauen, die praktisch nur ein höherer Flush callt.',
          cards: ['6h', '5h'],
        },
        {
          heading: 'Tiefe Stacks: 200bb und mehr',
          body:
            'Online-Cash-Games sind meist auf 100bb gedeckelt. Live wachsen Stacks über lange Sessions ungehindert – effektive Tiefen von 200bb, 300bb oder mehr sind normal, sobald zwei große Stacks aneinandergeraten. Das verändert die Strategie tiefgreifend:\n\n- **One Pair verliert an Wert für große Pötte**: Bei 100bb ist Top Pair Top Kicker oft ein legitimer Stack-off. Bei 250bb gilt: Wenn der ganze Stack in die Mitte geht, gewinnen überwiegend Two Pair plus, Sets, Straßen, Flushes. Wer AA bei 300bb gegen einen tighten Spieler nicht vom Overpair-Thron heben kann, zahlt teures Lehrgeld – **big pots need big hands**.\n- **Implied Odds explodieren**: Spekulative Hände mit Nut-Potenzial – Pocket Pairs, Suited Aces, Suited Connectors – steigen im Wert, weil ein Treffer ein Vielfaches des Preflop-Einsatzes gewinnen kann.\n- **Position wird noch wichtiger**: Je tiefer die Stacks, desto mehr Streets mit großen Entscheidungen – und desto wertvoller ist es, sie mit Informationsvorsprung zu treffen. Spiele tiefe Spots out of Position deutlich vorsichtiger.\n- **3-Bet-Ranges verschieben sich**: Sehr tief sinkt der Wert reiner Blocker-3-Bets, und auch AKo-Stack-offs preflop verlieren an Reiz; spielbare, boardtreffende Hände gewinnen.\n\nDie einfache Heuristik für tiefe Live-Spots: Frage dich früh in der Hand, welche Handstärke am Ende einen 250bb-Pot rechtfertigt – und plane rückwärts, ob deine Hand dieses Potenzial hat.',
        },
        {
          heading: 'Straddles verstehen',
          body:
            'Ein **Straddle** ist ein freiwilliger Blind-Einsatz vor dem Austeilen, klassisch von der UTG-Position (dem Spieler links vom Big Blind) in Höhe von **2 Big Blinds**. Der Straddler kauft sich damit das Recht, preflop als Letzter zu handeln; die Action beginnt links von ihm.\n\nDie Mathematik ist unromantisch: Als blinder Einsatz ohne Ansehen der Karten ist der Straddle für den Straddler selbst ein Minusgeschäft – er zahlt doppelten Blind ohne Informationsvorteil. Warum er trotzdem existiert: Er verdoppelt das Spiel und macht es actionreicher; an manchen Tischen gehört er zur Kultur, gelegentlich als von allen gespielter Round-Straddle.\n\nStrategisch entscheidend ist die Umrechnung: **Der Straddle verdoppelt die Blinds und halbiert damit die effektive Stack-Tiefe.** Behandle den Straddle als neuen Big Blind: Raises bemisst du als Vielfaches des Straddles (z. B. 3–4x), Ranges passt du an die flachere effektive Tiefe an – rohe High-Card-Stärke gewinnt, spekulative Implied-Odds-Hände verlieren etwas an Wert. Und beachte die veränderte Preflop-Reihenfolge: Der Straddler schließt die Action, die Blinds handeln vor ihm.\n\nWichtig für die Selbststeuerung: Ein Tisch, der jede Hand straddelt, spielt faktisch das doppelte Limit. Prüfe ehrlich, ob deine Bankroll dieses Spiel trägt – "1/2 mit Straddle" ist ökonomisch ein 2/4-Spiel.',
          table: {
            headers: ['Situation', 'Stack 200 €', 'Effektive Tiefe'],
            rows: [
              ['Blinds 1/2 ohne Straddle', '200 €', '100bb'],
              ['Blinds 1/2 mit 4-€-Straddle', '200 €', '50 Einheiten des Straddles'],
            ],
          },
        },
        {
          heading: 'Tisch- und Platzwahl: der unterschätzte Edge',
          body:
            'Kein strategisches Detail bringt live so viel Winrate wie die Wahl des richtigen Spiels. Online wechselst du Tische per Klick – live entscheidet oft ein einziger Tischwechsel über den Wert des ganzen Abends.\n\n**Tischauswahl** – gute Zeichen beim Vorbeigehen oder Umschauen:\n\n- Viele Limper und Multiway-Flops, hohe durchschnittliche Pötte\n- Lachen, Getränke, Unterhaltung – Spieler, die primär Spaß haben wollen\n- Große, unregelmäßige Stacks statt einheitlicher 100bb-Buy-ins\n\nEin stiller Tisch voller konzentrierter Regs mit Kopfhörern ist das Gegenteil. Lass dich beim Floor auf die Wechselliste für bessere Tische setzen – das ist üblich und niemand nimmt es krumm.\n\n**Platzwahl**: Das Geld fließt am Pokertisch tendenziell im Uhrzeigersinn – du gewinnst am meisten von den Spielern, auf die du Position hast. Ideal sitzt du daher **links von den loosen, aggressiven und schwächsten Spielern** (du hast Position auf sie und kontrollierst die Pötte gegen sie), während tighte, berechenbare Spieler links von dir wenig Schaden anrichten. Wird der Traumsitz frei, frag den Dealer nach dem Seat Change.\n\nZuletzt die Disziplinfrage: Bleib, solange das Spiel gut ist **und** du gut bist. Verlässt einer der beiden Faktoren den Raum – die Fische gehen heim oder deine Konzentration schwindet –, ist das Spiel für heute vorbei. Diese Ausstiegsdisziplin trennt langfristig erfolgreiche Live-Spieler zuverlässiger von den anderen als jede Fachkenntnis.',
          tip: 'Bewerte einen Tisch nie nach deinem aktuellen Ergebnis, sondern nach seiner Qualität: An einem schlechten Tisch zu gewinnen ist Glück, an einem guten zu verlieren ist Pech – bleib bei den guten Tischen und die Ergebnisse folgen.',
        },
      ],
      takeaways: [
        'Gegen loose-passive Pools verdienst du mit Value: mehr Value Bets, dünner und größer – Slowplay und große Bluffs verlieren massiv an Wert.',
        'Bluffe selektiv: gegen fold-fähige Gegner und mit Equity (Semi-Bluffs); multiway und gegen Stations bleiben Bluffs die Ausnahme.',
        'In Multiway-Pötten zählt Nut-Potenzial: Pocket Pairs, Suited Aces und Suited Connectors gewinnen, dominierbare Offsuit-Broadways und Non-Nut-Draws verlieren an Wert.',
        'Bei 200bb+ gilt: große Pötte brauchen große Hände – One Pair reicht selten für den Stack, Implied-Odds-Hände und Position gewinnen an Bedeutung.',
        'Ein Straddle verdoppelt faktisch das Limit und halbiert die effektive Tiefe; Tisch- und Platzwahl (links von den schwächsten Spielern) sind der größte einzelne Live-Edge.',
      ],
      quiz: [
        {
          question: 'Was ist eine "dünne" Value Bet und warum ist sie gegen Calling Stations wichtig?',
          options: [
            'Eine sehr kleine Bet mit den Nuts, um Calls zu provozieren',
            'Eine Bet mit einer Hand, die von der gegnerischen Call-Range nur knapp mehrheitlich geschlagen wird – gegen weite Call-Ranges werden solche Bets profitabel',
            'Ein kleiner Bluff mit komplett wertloser Hand',
            'Eine Bet, die man nur aus Position spielt',
          ],
          correctIndex: 1,
          explanation:
            'Dünner Value heißt: Die Bet gewinnt gegen den größeren Teil der Hände, die callen – auch wenn der Vorsprung klein ist. Je weiter die gegnerische Call-Range, desto mehr Hände qualifizieren sich dafür; deshalb bettest du gegen Stations Hände auf Value, die du gegen Regs checkst.',
        },
        {
          question: 'Warum funktionieren große River-Bluffs gegen typische Live-Freizeitspieler schlecht?',
          options: [
            'Weil live Bluffen gegen die Etikette verstößt',
            'Weil der Rake Bluffs unprofitabel macht',
            'Weil Bluffs Fold Equity brauchen – und loose-passive Spieler schlicht zu selten folden',
            'Weil man live seine Karten zeigen muss, wenn der Bluff durchgeht',
          ],
          correctIndex: 2,
          explanation:
            'Ein Bluff verdient sein Geld über Folds. Spieler, die mit Third Pair "einfach mal schauen wollen", liefern diese Folds nicht – der Bluff wird zur Spende. Bluffs bleiben gegen fold-fähige Gegner und als Semi-Bluff mit Equity sinnvoll.',
        },
        {
          question: 'Fünf Spieler sehen den Flop. Welche Aussage über Multiway-Pötte ist korrekt?',
          options: [
            'Die Gewinnerhand ist im Schnitt stärker, daher steigt der Wert von Nut-Potenzial und sinkt der Wert dominierbarer Hände wie KJo',
            'Bluffs werden profitabler, weil mehr Spieler folden können',
            'Top Pair gewinnt multiway genauso oft wie heads-up',
            'Kleine Flush-Draws werden multiway wertvoller, weil mehr Gegner auszahlen',
          ],
          correctIndex: 0,
          explanation:
            'Mit jedem zusätzlichen Spieler steigt die Chance, dass jemand eine starke Hand trifft. Nut-orientierte Hände (Pocket Pairs, Suited Aces) gewinnen; dominierbare Broadways und Non-Nut-Draws laufen häufiger in bessere gleiche Hände – und Bluffs scheitern, weil alle folden müssten.',
        },
        {
          question: 'Du spielst 300bb tief gegen einen tighten Gegner. Er raist deine Turn-Bet groß, du hältst ein Overpair. Welche Leitlinie gilt?',
          options: [
            'Overpairs sind bei jeder Stacktiefe ein klarer Stack-off',
            'Je tiefer die Stacks, desto stärker muss die Hand für den ganzen Stack sein – One Pair reicht bei 300bb selten',
            'Bei tiefen Stacks sollte man grundsätzlich jede Bet callen, weil die Implied Odds so gut sind',
            'Tiefe Stacks ändern strategisch nichts',
          ],
          correctIndex: 1,
          explanation:
            'Bei 100bb ist ein Overpair oft ein legitimer Stack-off, bei 300bb landen im All-in-Pot überwiegend Two Pair plus, Sets und bessere Hände – erst recht gegen tighte Gegner. Big pots need big hands: Plane früh, welche Handstärke den Riesenpot rechtfertigt.',
        },
        {
          question: 'Am 1/2-Tisch straddelt UTG jede Hand auf 4 €. Was bedeutet das praktisch?',
          options: [
            'Nichts – der Straddle ist nur ein Trinkgeld an den Pot',
            'Die effektive Stack-Tiefe verdoppelt sich',
            'Der Straddler bekommt eine zusätzliche Karte',
            'Das Spiel wird faktisch zum doppelten Limit: Blinds verdoppelt, effektive Tiefe in Einheiten des Straddles halbiert, Raises bemisst man am Straddle',
          ],
          correctIndex: 3,
          explanation:
            'Der Straddle wirkt wie ein neuer, doppelter Big Blind: Aus 200 € werden statt 100bb nur noch 50 Straddle-Einheiten, Sizings orientieren sich am Straddle, und ökonomisch spielst du ein 2/4-Spiel – inklusive der Bankroll-Frage, ob du das willst.',
        },
        {
          question: 'Ein sehr looser, aggressiver Freizeitspieler wechselt an deinen Tisch. Welcher Sitzplatz relativ zu ihm ist ideal?',
          options: [
            'Direkt rechts von ihm, damit er nach dir handeln muss',
            'Direkt links von ihm, damit du in den meisten Händen Position auf ihn hast',
            'Möglichst weit weg, um seinen Händen auszuweichen',
            'Der Sitzplatz ist egal, solange der Tisch gut ist',
          ],
          correctIndex: 1,
          explanation:
            'Das Geld fließt tendenziell im Uhrzeigersinn: Mit Position auf den loosen Aggressor siehst du seine Aktionen vor deiner Entscheidung, kontrollierst die Potgröße und isolierst ihn leichter. Links von ihm sitzen heißt, an seiner Action maximal mitzuverdienen.',
        },
      ],
    },
  ],
};

export default m7;
