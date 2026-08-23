import type { Module } from '../types';

const m3: Module = {
  id: 'm3',
  title: 'Poker-Mathematik',
  subtitle: 'Outs, Odds und Equity – rechnen wie ein Profi',
  icon: '🧮',
  level: 'Fortgeschritten',
  lessons: [
    {
      id: 'm3-l1',
      title: 'Outs zählen',
      duration: 8,
      intro:
        'Bevor du Odds berechnen kannst, musst du wissen, wie viele Karten dir überhaupt helfen. Outs zählen ist die Basisfertigkeit der gesamten Poker-Mathematik – und sie ist in wenigen Minuten erlernt.',
      sections: [
        {
          heading: 'Was sind Outs?',
          body:
            'Ein **Out** ist eine noch nicht sichtbare Karte, die deine Hand zur (mutmaßlich) besten Hand verbessert. Entscheidend ist die Perspektive: Du kennst nur deine zwei Holecards und die Boardkarten. Nach dem Flop sind das 5 von 52 Karten – es bleiben **47 unbekannte Karten**, nach dem Turn noch **46**. Dass einige davon in den Händen der Gegner oder im Muck liegen, spielt für die Rechnung keine Rolle: Aus deiner Sicht ist jede unbekannte Karte gleich wahrscheinlich die nächste Board-Karte.\n\nDas Zählen selbst ist einfache Inventur. Beispiel: Du hältst A♥ Q♥ und der Flop kommt K♥ 7♥ 2♠. Für den Flush brauchst du ein weiteres Herz. Es gibt 13 Herzkarten, zwei hältst du selbst, zwei liegen auf dem Board – bleiben **9 Outs** zum Nut Flush.\n\nWichtig ist die Einschränkung "zur besten Hand". Eine Karte, die dich verbessert, aber trotzdem verlieren lässt, ist kein echtes Out. Deshalb zählst du zuerst brutto und prüfst danach kritisch, welche Outs wirklich sauber sind – dazu gleich mehr.',
          cards: ['Ah', 'Qh'],
          tip: 'Zähle Outs immer konkret über die Kartenfarben und Ränge, nicht aus dem Gefühl. "Ich brauche ein Herz" wird zu "13 minus 2 minus 2 gleich 9". Diese Disziplin verhindert die häufigsten Zählfehler.',
        },
        {
          heading: 'Standard-Draws im Überblick',
          body:
            'Die häufigsten Draw-Situationen wiederholen sich ständig – ihre Out-Zahlen solltest du auswendig kennen, damit am Tisch keine Rechenzeit verloren geht.\n\nDie wichtigsten Werte: Ein **Flushdraw** hat 9 Outs. Ein **OESD** (Open-Ended Straight Draw, beidseitig offener Straßendraw) hat 8 Outs – zwei Ränge mit je vier Karten. Ein **Gutshot** (Straßendraw mit Lücke in der Mitte) hat nur 4 Outs. Zwei Overcards wie A♦ K♣ auf Q-8-4 haben 6 Outs auf Top Pair – allerdings sind das notorisch unsichere Outs. Ein Pocket Pair hat 2 Outs auf das Set, zwei Paar haben 4 Outs zum Full House, und ein geflopptes Set hat am Turn 7 Outs, um sich zu Full House oder Quads zu verbessern (6 Karten paaren das Board, 1 Karte bringt Quads).\n\nBei kombinierten Draws addierst du die Outs, ziehst aber **Überschneidungen** ab: Flushdraw plus OESD sind nicht 17, sondern 15 Outs, weil zwei der Straight-Karten gleichzeitig den Flush bringen und nicht doppelt zählen dürfen.',
          table: {
            headers: ['Draw', 'Outs', 'Beispiel'],
            rows: [
              ['Pocket Pair → Set', '2', '5♦ 5♣ auf A-9-2'],
              ['Eine Overcard', '3', 'A♠ 7♠ auf K-8-3 (nur das Ass hilft)'],
              ['Gutshot', '4', '9♣ 8♦ auf J-7-2 (nur eine Zehn hilft)'],
              ['Zwei Paar → Full House', '4', 'K♥ Q♣ auf K-Q-6'],
              ['Zwei Overcards', '6', 'A♦ K♣ auf Q-8-4'],
              ['Set → Full House/Quads (am Turn)', '7', '8♠ 8♦ auf 8♥-K-4'],
              ['OESD', '8', 'J♠ T♠ auf 9-8-3'],
              ['Flushdraw', '9', 'A♥ Q♥ auf K♥-7♥-2♠'],
              ['Flushdraw + Gutshot', '12', 'Q♥ J♥ auf K♥-9♥-4♠'],
              ['Flushdraw + OESD', '15', 'J♥ T♥ auf 9♥-8♥-2♣'],
            ],
          },
        },
        {
          heading: 'Kombinierte Draws: Monster erkennen',
          body:
            'Kombinierte Draws gehören zu den stärksten Händen, die du am Flop halten kannst – oft sind sie sogar Favorit gegen ein fertiges Top Pair.\n\nRechne das Beispiel J♥ T♥ auf 9♥ 8♥ 2♣ durch: Für die Straight helfen dir alle vier Queens und alle vier Sevens (8 Outs). Für den Flush helfen neun Herzkarten. Q♥ und 7♥ sind aber in beiden Listen enthalten und zählen nur einmal: 8 + 9 − 2 = **15 Outs**. Ein solcher Draw hat gegen ein Top Pair rund 54 % Equity über zwei Karten – du bist mit der "Nichts-Hand" tatsächlich vorne.\n\nGenauso funktioniert Flushdraw plus Gutshot: 9 + 4 − 1 = **12 Outs**. Und Flushdraw plus zwei Overcards (etwa A♥ K♥ auf Q♥ 8♥ 3♦) bringt es auf 9 + 6 = 15 Outs, wobei die Overcard-Outs unsicherer sind als die Flush-Outs.\n\nDie strategische Konsequenz: Solche Hände spielst du selten passiv. Mit so viel Equity plus Fold Equity (der Chance, dass der Gegner foldet) sind Raises und Semi-Bluffs meist die profitabelste Linie.',
          cards: ['Jh', 'Th'],
          example:
            'J♥ T♥ auf 9♥ 8♥ 2♣ gegen A♠ 9♦ (Top Pair): Dein Combo-Draw gewinnt in gut der Hälfte der Fälle – obwohl du im Moment nur Jack-high hältst.',
        },
        {
          heading: 'Outs discounten: sauber statt schmutzig',
          body:
            'Nicht jedes Out ist ein echtes Out. **Verschmutzte Outs** (tainted outs) verbessern deine Hand, geben dem Gegner aber gleichzeitig eine noch bessere. Wer brutto rechnet, überschätzt seine Equity systematisch.\n\nDie drei häufigsten Fälle:\n\n- **Draw gegen Draw**: Du hältst J♣ T♦ auf 9♥ 8♥ 2♣ (OESD, 8 Outs). Hat der Gegner plausibel einen Flushdraw, machen Q♥ und 7♥ zwar deine Straight, aber seinen Flush. Rechne mit 6 sauberen Outs.\n- **Overcards gegen starke Ranges**: Mit A♦ K♣ auf Q-8-4 zählst du 6 Outs auf Top Pair. Gegen ein Set oder zwei Paar sind diese Outs praktisch wertlos, gegen KQ hilft dir nur das Ass. Je stärker die gegnerische Range, desto härter musst du discounten – oft auf 3 oder weniger.\n- **Dominierte Draws**: Mit 8♥ 7♥ auf einem Herz-Board können deine 9 Flush-Outs gegen einen höheren Flushdraw sogar in die Katastrophe führen.\n\nEine brauchbare Faustregel: Ziehe in unklaren Situationen ein bis zwei Outs ab. Perfekte Präzision gibt es hier nicht – aber der Unterschied zwischen 8 brutto und 6 netto entscheidet regelmäßig zwischen Call und Fold.',
          tip: 'Frage dich bei jedem Out: "Wenn diese Karte kommt und der Gegner nicht foldet – gewinne ich dann wirklich meistens?" Wenn die ehrliche Antwort "unklar" lautet, discounte.',
        },
      ],
      takeaways: [
        'Ein Out ist eine unbekannte Karte, die deine Hand zur besten Hand macht – nach dem Flop gibt es 47 unbekannte Karten, nach dem Turn 46.',
        'Die Standardwerte auswendig: Flushdraw 9, OESD 8, Gutshot 4, zwei Overcards 6, Pocket Pair auf Set 2.',
        'Bei kombinierten Draws Outs addieren, Überschneidungen abziehen: Flushdraw + OESD = 15, nicht 17.',
        'Discounte verschmutzte Outs, die dem Gegner eine bessere Hand geben – vor allem Straight-Outs auf Flush-Boards und Overcard-Outs gegen starke Ranges.',
        'Monster-Draws mit 12+ Outs spielst du aggressiv: Sie haben oft mehr Equity als ein fertiges Top Pair.',
      ],
      quiz: [
        {
          question: 'Du hältst A♥ Q♥, der Flop kommt K♥ 7♥ 2♠. Wie viele Outs hast du auf den Flush?',
          options: ['7', '9', '11', '13'],
          correctIndex: 1,
          explanation:
            'Es gibt 13 Herzkarten. Zwei hältst du, zwei liegen auf dem Board – bleiben 9 Outs.',
        },
        {
          question: 'Wie viele Outs haben ein OESD und ein Gutshot?',
          options: [
            'OESD 8, Gutshot 4',
            'OESD 4, Gutshot 8',
            'Beide 8',
            'OESD 8, Gutshot 6',
          ],
          correctIndex: 0,
          explanation:
            'Der OESD wird von zwei Rängen mit je 4 Karten komplettiert (8 Outs), der Gutshot nur von einem Rang (4 Outs).',
        },
        {
          question: 'Du hältst 5♦ 5♣, der Flop bringt kein Set. Wie viele Outs hast du am Turn auf dein Set?',
          options: ['1', '2', '3', '4'],
          correctIndex: 1,
          explanation:
            'Von den vier Fünfen hältst du zwei – es bleiben genau 2 Outs (5♥ und 5♠).',
        },
        {
          question:
            'Du hast J♣ T♦ auf 9♥ 8♥ 2♣ und vermutest beim Gegner stark einen Flushdraw. Mit wie vielen sauberen Outs solltest du rechnen?',
          options: ['8', '6', '4', '10'],
          correctIndex: 1,
          explanation:
            'Q♥ und 7♥ komplettieren zwar deine Straight, aber gleichzeitig den gegnerischen Flush. Diese beiden Outs discountest du: 8 − 2 = 6.',
        },
        {
          question: 'Flushdraw und OESD gleichzeitig – wie viele Outs hast du insgesamt?',
          options: ['17', '15', '13', '12'],
          correctIndex: 1,
          explanation:
            '9 Flush-Outs plus 8 Straight-Outs minus 2 Karten, die in beiden Listen stehen: 15 Outs.',
        },
      ],
    },
    {
      id: 'm3-l2',
      title: 'Die Regel von 2 und 4',
      duration: 7,
      intro:
        'Aus Outs wird Equity – und zwar im Kopf, in unter einer Sekunde. Die Regel von 2 und 4 ist die wichtigste Abkürzung der Poker-Mathematik.',
      sections: [
        {
          heading: 'So funktioniert die Regel',
          body:
            '**Equity** ist dein prozentualer Anteil am Pot – die Wahrscheinlichkeit, dass deine Hand am Ende gewinnt. Die Regel von 2 und 4 übersetzt Outs direkt in Equity:\n\n- **Outs × 2**: deine ungefähre Equity in Prozent, wenn noch **eine** Karte kommt (Flop auf Turn oder Turn auf River).\n- **Outs × 4**: deine ungefähre Equity, wenn du **beide** verbleibenden Karten sehen wirst – also vom Flop bis zum River.\n\nWarum funktioniert das? Nach dem Turn sind 46 Karten unbekannt, jedes Out trifft also mit 1/46 ≈ 2,2 %. Der Faktor 2 ist eine leicht abgerundete Version davon. Über zwei Karten hast du zwei Chancen, deshalb ungefähr das Doppelte – Faktor 4.\n\nBeispiel Flushdraw: 9 Outs × 2 = 18 % für eine Karte (exakt: 19,6 % am River). 9 × 4 = 36 % vom Flop bis zum River (exakt: 35,0 %). Für Entscheidungen am Tisch ist diese Genauigkeit mehr als ausreichend – die Fehlerquelle ist fast nie die Regel, sondern falsch gezählte Outs.',
          tip: 'Merke dir die drei wichtigsten Ergebnisse als Fixpunkte: Gutshot ca. 8/16 %, OESD ca. 16/32 %, Flushdraw ca. 18/36 % (eine Karte / zwei Karten).',
        },
        {
          heading: 'Beispiele durchrechnen',
          body:
            'Drei typische Situationen:\n\n- **Gutshot am Turn**: 4 Outs × 2 = 8 %. Exakt sind es 4/46 ≈ 8,7 %. Du triffst also nur etwa jedes elfte Mal – Gutshots allein rechtfertigen selten große Calls.\n- **OESD am Flop, du bist all-in**: 8 Outs × 4 = 32 %. Exakt: 31,5 %. Etwa jedes dritte Mal kommt die Straight an.\n- **Flushdraw plus Gutshot am Flop, all-in**: 12 Outs × 4 = 48 %. Exakt: 45,0 %. Du bist gegen die meisten fertigen Hände fast ein Coinflip.\n\nDie Tabelle zeigt, wie nah Regel und Realität beieinanderliegen – und wo die Abweichung beginnt: Bis etwa 8 Outs ist die Regel von 4 fast punktgenau, darüber überschätzt sie zunehmend.',
          table: {
            headers: ['Outs', 'Regel von 4', 'Exakt (Flop bis River)'],
            rows: [
              ['4 (Gutshot)', '16 %', '16,5 %'],
              ['8 (OESD)', '32 %', '31,5 %'],
              ['9 (Flushdraw)', '36 %', '35,0 %'],
              ['12 (Flush + Gutshot)', '48 %', '45,0 %'],
              ['15 (Flush + OESD)', '60 %', '54,1 %'],
            ],
          },
        },
        {
          heading: 'Der häufigste Fehler: ×4 ohne All-in',
          body:
            'Die Regel von 4 gilt nur, wenn du **garantiert beide Karten siehst, ohne weiter bezahlen zu müssen** – praktisch also nur, wenn am Flop jemand all-in ist (du oder der Gegner).\n\nDer klassische Denkfehler geht so: Du hältst einen Flushdraw am Flop, der Gegner bettet, und du rechnest dir 36 % Equity schön. Aber dein Call bezahlt nur die Turn-Karte! Kommt der Flush dort nicht an, wird der Gegner am Turn meist erneut betten – und du musst für den River **noch einmal** zahlen. Für die aktuelle Entscheidung zählt deshalb nur die Regel von 2: rund 18 %.\n\nRichtig gedacht: Jede Street ist eine eigene Entscheidung mit eigenem Preis. Nur wenn kein weiterer Einsatz mehr möglich ist, darfst du beide Karten zusammen bewerten.\n\nDieser eine Unterschied – 18 % statt 36 % – ist einer der teuersten Rechenfehler überhaupt, weil er aus klaren Folds vermeintliche Calls macht. Wenn du am Flop gegen eine Bet mit ×4 rechnest, obwohl noch Chips hinter den Stacks liegen, bezahlst du systematisch zu viel für deine Draws.',
          example:
            'Flushdraw am Flop, Gegner bettet, beide haben noch tiefe Stacks: Rechne 9 × 2 = 18 % für den Call. Nur wenn der Gegner all-in geht, gilt 9 × 4 = 36 %.',
        },
        {
          heading: 'Genauigkeitsgrenzen bei vielen Outs',
          body:
            'Ab etwa 9 oder 10 Outs beginnt die Regel von 4 zu überschätzen. Der Grund: Die Multiplikation tut so, als könntest du an Turn **und** River treffen und zählt diese Fälle doppelt. Bei wenigen Outs fällt das kaum ins Gewicht, bei vielen Outs summiert sich der Fehler.\n\nDeutlich wird das beim 15-Outs-Monster-Draw: 15 × 4 = 60 %, exakt sind es aber 54,1 % – fast sechs Prozentpunkte Unterschied. Bei 20 Outs würde die Regel sogar 80 % behaupten, real sind es rund 68 %.\n\nFür solche Fälle gibt es eine einfache **Korrekturformel**: Bei mehr als 8 Outs rechnest du (Outs × 4) − (Outs − 8).\n\n- 12 Outs: 48 − 4 = 44 % (exakt 45,0 %)\n- 15 Outs: 60 − 7 = 53 % (exakt 54,1 %)\n\nDie Regel von 2 hat dieses Problem übrigens kaum – sie ist über den gesamten Bereich leicht **zu niedrig** (9 Outs: 18 % statt 19,6 %), was in der Praxis eine harmlose, konservative Abweichung ist.\n\nUnterm Strich: Regel von 2 immer bedenkenlos, Regel von 4 bis 8 Outs bedenkenlos, darüber mit Korrektur.',
          tip: 'Merksatz für große Draws: Ab 9 Outs von der ×4-Schätzung die Differenz zu 8 Outs abziehen. So bleibst du auch bei Monster-Draws auf ein bis zwei Prozentpunkte genau.',
        },
      ],
      takeaways: [
        'Outs × 2 schätzt deine Equity für eine kommende Karte, Outs × 4 für beide Karten vom Flop bis zum River.',
        'Die Regel von 4 gilt nur bei All-in am Flop – sonst bezahlst du jede Street einzeln und rechnest mit × 2.',
        'Fixpunkte: Gutshot ca. 16 %, OESD ca. 32 %, Flushdraw ca. 36 % (jeweils zwei Karten, all-in).',
        'Ab 9 Outs überschätzt die Regel von 4: Korrigiere mit (Outs × 4) − (Outs − 8).',
        'Der größte Fehler ist selten die Schätzformel, sondern falsch gezählte oder nicht discountete Outs.',
      ],
      quiz: [
        {
          question:
            'Du hältst einen Flushdraw am Turn, nur der River kommt noch. Welche Equity liefert die Regel von 2?',
          options: ['9 %', '18 %', '27 %', '36 %'],
          correctIndex: 1,
          explanation:
            '9 Outs × 2 = 18 %. Der exakte Wert ist 9/46 ≈ 19,6 % – die Regel liegt leicht darunter.',
        },
        {
          question: 'Wann darfst du deine Outs mit 4 multiplizieren?',
          options: [
            'Immer, wenn du am Flop bist',
            'Nur wenn du Turn und River garantiert ohne weiteren Einsatz siehst, z. B. bei All-in am Flop',
            'Immer, wenn du mehr als 8 Outs hast',
            'Nur bei Flushdraws',
          ],
          correctIndex: 1,
          explanation:
            'Die ×4-Regel bewertet beide kommenden Karten. Das ist nur zulässig, wenn du für sie nicht erneut bezahlen musst – also praktisch nur bei All-in am Flop.',
        },
        {
          question: 'Du bist am Flop all-in mit einem Gutshot (4 Outs). Welche Equity liefert die Regel von 4?',
          options: ['8 %', '12 %', '16 %', '20 %'],
          correctIndex: 2,
          explanation: '4 Outs × 4 = 16 %. Der exakte Wert liegt bei 16,5 % – die Regel passt hier fast perfekt.',
        },
        {
          question:
            'Mit 15 Outs am Flop (all-in) behauptet die Regel von 4: 60 %. Wo liegt der exakte Wert ungefähr?',
          options: ['60 %', '54 %', '48 %', '65 %'],
          correctIndex: 1,
          explanation:
            'Exakt sind es 54,1 %. Bei vielen Outs überschätzt die Regel; die Korrektur (Outs × 4) − (Outs − 8) = 53 % kommt nahe heran.',
        },
        {
          question:
            'Flushdraw am Flop, der Gegner bettet, beide Stacks sind noch tief. Womit rechnest du für diesen Call?',
          options: [
            '9 × 4 = 36 %, weil noch zwei Karten kommen',
            '9 × 2 = 18 %, weil dein Call nur die Turn-Karte bezahlt',
            '9 × 3 = 27 % als Kompromiss',
            '50 %, weil der Flush entweder kommt oder nicht',
          ],
          correctIndex: 1,
          explanation:
            'Ohne All-in bezahlst du jede Street einzeln. Für die aktuelle Entscheidung zählt nur die nächste Karte – also die Regel von 2.',
        },
      ],
    },
    {
      id: 'm3-l3',
      title: 'Pot Odds',
      duration: 9,
      intro:
        'Pot Odds beantworten die wichtigste Frage am Tisch: Ist dieser Call sein Geld wert? Wer den Preis eines Calls mit seiner Equity vergleichen kann, trifft mathematisch fundierte Entscheidungen statt Bauchentscheidungen.',
      sections: [
        {
          heading: 'Die Grundidee: der Preis eines Calls',
          body:
            '**Pot Odds** beschreiben das Verhältnis zwischen dem, was du gewinnen kannst, und dem, was du dafür riskieren musst. Daraus ergibt sich direkt die Equity, die du für einen profitablen Call mindestens brauchst.\n\nDie Formel: **Benötigte Equity = Call / (Pot nach deinem Call)** – also Call geteilt durch die Summe aus bisherigem Pot, gegnerischer Bet und deinem eigenen Call.\n\nBeispiel: Im Pot liegen 100 €, der Gegner bettet 50 €. Du musst 50 € callen, der Pot nach deinem Call beträgt 100 + 50 + 50 = 200 €. Benötigte Equity: 50/200 = **25 %**. Gewinnst du öfter als jedes vierte Mal, ist der Call langfristig profitabel.\n\nDieselbe Information als Verhältnis: Du bekommst 150 € (Pot plus Bet) für 50 € Einsatz, also **3:1**. Die Umrechnung in Prozent: 1/(3+1) = 25 %. Beide Schreibweisen sind gleichwertig – gewöhne dir die an, mit der du schneller rechnest.\n\nDer entscheidende Punkt: Du musst **nicht** öfter gewinnen als verlieren. Bei 3:1 reichen 25 %, weil der Pot deine drei Niederlagen mit einem einzigen Gewinn bezahlt.',
          tip: 'Präge dir die Denkweise ein: "Was kostet mich der Call, was liegt danach im Pot?" – nicht "Wie stark ist meine Hand?". Pot Odds sind eine Preisfrage, keine Stärkefrage.',
        },
        {
          heading: 'Schritt für Schritt am Beispiel',
          body:
            'Nimm diese Turn-Situation: Du hältst A♥ Q♥ auf K♥ 7♥ 2♠ 4♦ – Nut-Flushdraw, 9 Outs. Im Pot liegen 120 €, der Gegner bettet 60 €.\n\n- **Schritt 1 – Preis bestimmen**: Dein Call kostet 60 €. Pot nach Call: 120 + 60 + 60 = 240 €. Benötigte Equity: 60/240 = 25 %.\n- **Schritt 2 – Equity schätzen**: Eine Karte kommt noch, also Regel von 2: 9 × 2 = 18 % (exakt 19,6 %).\n- **Schritt 3 – Vergleichen**: 19,6 % Equity gegen 25 % benötigt. Deine Equity liegt darunter – rein nach direkten Pot Odds ist der Call ein Fehler.\n\nDieser Dreischritt – Preis, Equity, Vergleich – ist das Rückgrat jeder Call-Entscheidung. Er dauert mit etwas Übung keine fünf Sekunden.\n\nWichtig: "Fold nach direkten Pot Odds" ist nicht immer das letzte Wort. Wenn du nach einem getroffenen Flush noch weitere Einsätze gewinnen kannst, verbessern diese zukünftigen Gewinne deinen effektiven Preis – das sind die Implied Odds der nächsten Lektion. Aber die direkte Rechnung ist immer der Ausgangspunkt: Erst wenn du weißt, wie groß die Lücke ist, kannst du beurteilen, ob zukünftige Gewinne sie realistisch schließen.',
          cards: ['Ah', 'Qh'],
        },
        {
          heading: 'Benötigte Equity nach Bet-Größe',
          body:
            'Weil sich Bet-Größen fast immer am Pot orientieren, kannst du die benötigte Equity für die Standardgrößen einfach auswendig lernen – dann entfällt die Rechnung am Tisch komplett.\n\nDie Herleitung am Beispiel der halben Potsize-Bet: Bei Pot P bettet der Gegner P/2. Du callst P/2, der Endpot ist P + P/2 + P/2 = 2P. Benötigte Equity: (P/2) / 2P = 25 %.\n\nZwei Beobachtungen lohnen sich: Erstens wächst die benötigte Equity **langsamer** als die Bet-Größe – eine doppelte Potsize-Bet verlangt nicht doppelt so viel Equity wie eine Potsize-Bet, sondern 40 % statt 33,3 %. Zweitens sind selbst große Bets nie ein automatischer Fold: Gegen 2x Pot brauchst du 40 % – ein starker Combo-Draw bringt das mit.\n\nUmgekehrt gilt für dich als Aggressor: Je größer deine Bet, desto mehr Equity zwingst du den Draws deines Gegners ab. Eine 1/3-Pot-Bet gibt jedem Flushdraw einen profitablen Call; eine Potsize-Bet stellt ihn vor eine echte Entscheidung.',
          table: {
            headers: ['Bet-Größe', 'Pot Odds', 'Benötigte Equity'],
            rows: [
              ['1/3 Pot', '4:1', '20 %'],
              ['1/2 Pot', '3:1', '25 %'],
              ['2/3 Pot', '2,5:1', 'ca. 28,6 %'],
              ['3/4 Pot', '2,33:1', '30 %'],
              ['Pot', '2:1', 'ca. 33,3 %'],
              ['2x Pot', '1,5:1', '40 %'],
            ],
          },
        },
        {
          heading: 'Entscheiden: Equity gegen Preis',
          body:
            'Jetzt fügst du beide Werkzeuge zusammen: Outs zählen und Regel von 2 und 4 liefern deine Equity, die Pot-Odds-Tabelle den Preis. Liegt die Equity über der benötigten Schwelle, ist der Call profitabel; liegt sie darunter, foldest du – oder du prüfst, ob Implied Odds die Lücke schließen.\n\nEin paar Referenzfälle für den Turn (eine Karte kommt):\n\n- **Flushdraw (ca. 19,6 %)**: Call gegen 1/3 Pot (20 % benötigt) ist praktisch break-even, gegen alles Größere brauchst du Implied Odds.\n- **OESD (ca. 17,4 %)**: Ähnliches Bild – nur kleine Bets sind direkt callbar.\n- **Gutshot (ca. 8,7 %)**: Selbst gegen 1/3 Pot weit entfernt von profitabel; ohne massive Implied Odds ist Fold Standard.\n\nAm Flop gegen ein All-in drehen sich die Verhältnisse, weil die Regel von 4 gilt: Ein Flushdraw mit 35 % callt jede Bet bis Potsize (33,3 % benötigt) profitabel, ein 12-Outs-Draw mit 45 % ist gegen fast jedes Sizing ein Call.\n\nDenke daran, dass ein Fold nach Pot Odds kein verlorenes Duell ist, sondern eine gewonnene Rechnung: Jeder vermiedene Minus-Call ist Geld, das in deinem Stack bleibt.',
          example:
            'Turn, Pot 90 €, Gegner bettet 90 € (Potsize, 33,3 % benötigt). Du hältst einen Flushdraw mit ca. 19,6 % Equity. Direkter Fold – die Lücke von fast 14 Prozentpunkten schließen auch gute Implied Odds nur selten.',
        },
      ],
      takeaways: [
        'Benötigte Equity = Call / (Pot nach deinem Call) – Pot plus gegnerische Bet plus dein eigener Call.',
        'Auswendig lernen: 1/3 Pot → 20 %, 1/2 Pot → 25 %, 2/3 Pot → ca. 28,6 %, Pot → ca. 33,3 %, 2x Pot → 40 %.',
        'Entscheidung in drei Schritten: Preis berechnen, Equity schätzen (Regel von 2 und 4), vergleichen.',
        'Du musst nicht öfter gewinnen als verlieren – bei 3:1 reichen 25 %, weil ein Gewinn drei Niederlagen bezahlt.',
        'Liegt die Equity knapp unter dem Preis, entscheiden Implied Odds – liegt sie weit darunter, ist Fold klar.',
      ],
      quiz: [
        {
          question: 'Im Pot liegen 80 €, der Gegner bettet 40 €. Wie viel Equity brauchst du für einen profitablen Call?',
          options: ['20 %', '25 %', '33 %', '40 %'],
          correctIndex: 1,
          explanation:
            'Call 40 €, Pot nach Call: 80 + 40 + 40 = 160 €. Benötigte Equity: 40/160 = 25 %.',
        },
        {
          question: 'Der Gegner bettet genau Potsize. Welche Equity brauchst du für den Call?',
          options: ['25 %', '28,6 %', '33,3 %', '50 %'],
          correctIndex: 2,
          explanation:
            'Bei Pot P und Bet P callst du P in einen Endpot von 3P: P/3P = 33,3 %. Als Verhältnis: 2:1.',
        },
        {
          question: 'Du bekommst Pot Odds von 4:1. Welche Equity brauchst du mindestens?',
          options: ['15 %', '20 %', '25 %', '30 %'],
          correctIndex: 1,
          explanation: 'Umrechnung: 1/(4+1) = 20 %. Ein Gewinn bezahlt vier Niederlagen.',
        },
        {
          question:
            'Flushdraw am Turn (ca. 20 % Equity), der Gegner bettet 1/2 Pot (25 % benötigt). Wie lautet die Einschätzung rein nach direkten Pot Odds?',
          options: [
            'Klarer Call – Flushdraws callt man immer',
            'Fold – deine Equity liegt unter der benötigten Schwelle',
            'Raise ist mathematisch erzwungen',
            'Call, weil 20 % nah genug an 25 % liegt',
          ],
          correctIndex: 1,
          explanation:
            'Direkt betrachtet fehlen dir rund 5 Prozentpunkte. Nur gute Implied Odds können den Call rechtfertigen – die reine Pot-Odds-Rechnung sagt Fold.',
        },
        {
          question: 'Welche benötigte Equity gehört zu einer 2/3-Pot-Bet?',
          options: ['20 %', '25 %', 'ca. 28,6 %', 'ca. 33,3 %'],
          correctIndex: 2,
          explanation:
            'Call 2/3 P in einen Endpot von P + 2/3 P + 2/3 P = 7/3 P: (2/3)/(7/3) = 2/7 ≈ 28,6 %.',
        },
      ],
    },
    {
      id: 'm3-l4',
      title: 'Implied Odds & Reverse Implied Odds',
      duration: 8,
      intro:
        'Direkte Pot Odds betrachten nur den aktuellen Pot – aber Poker wird über mehrere Streets gespielt. Implied Odds beziehen zukünftige Gewinne mit ein und erklären, warum manche Draws trotz "zu schlechter" Pot Odds hochprofitabel sind.',
      sections: [
        {
          heading: 'Was sind Implied Odds?',
          body:
            '**Implied Odds** sind deine effektiven Odds, wenn du die Einsätze mitrechnest, die du auf späteren Streets **zusätzlich** gewinnst, falls dein Draw ankommt. Der Pot, um den du wirklich spielst, ist oft größer als der Pot, der jetzt auf dem Tisch liegt.\n\nBeispiel: Am Turn liegen 100 € im Pot, der Gegner bettet 50 €. Direkte Rechnung: 50/200 = 25 % benötigt, dein Flushdraw bringt aber nur 19,6 % – Fold. Erwartest du jedoch, nach einem getroffenen Flush am River im Schnitt noch 100 € zu gewinnen, spielst du effektiv um 300 €: 50/300 ≈ 16,7 % benötigt. Jetzt ist der Call profitabel.\n\nDie ehrliche Frage lautet also: **Wie viel muss ich am River noch gewinnen, damit sich der Call lohnt – und ist das realistisch?** Im Beispiel kannst du die Mindestsumme direkt ausrechnen: Du brauchst zusätzliche Gewinne von etwa 55 €, damit die Rechnung aufgeht.\n\nVorsicht vor Selbstbetrug: "Implied Odds" ist die beliebteste Ausrede für schlechte Calls. Zukünftige Gewinne sind kein Wunschkonzert, sondern eine Schätzung, die von Gegner, Stacktiefe und Board abhängen muss.',
          tip: 'Rechne die Lücke konkret aus: (Benötigter Gesamtgewinn) minus (aktueller Pot plus Bet). Wenn du dem Gegner diese Summe nach einem offensichtlichen Flush-River realistisch nicht mehr abnehmen kannst, sind deine Implied Odds eine Illusion.',
        },
        {
          heading: 'Wann Draws trotz schlechter Pot Odds profitabel sind',
          body:
            'Gute Implied Odds entstehen nicht von selbst – sie brauchen konkrete Voraussetzungen:\n\n- **Tiefe effektive Stacks**: Nur was noch hinter den Stacks liegt, kannst du später gewinnen. Ist der Gegner fast all-in, gibt es keine Implied Odds.\n- **Ein verdeckter Draw**: Ein Gutshot, der mit einer unscheinbaren Karte ankommt, wird viel öfter ausbezahlt als der dritte Flush-Karten-River, den jeder sieht. Verdeckte Straights haben die besten Implied Odds, offensichtliche Flushes die schlechtesten.\n- **Ein Gegner mit starker, zahlungsbereiter Hand**: Gegen ein Overpair oder ein Set wirst du bezahlt; gegen einen Gegner, der selbst nur blufft oder schnell aufgibt, nicht.\n- **Position**: In Position steuerst du die Potgröße am River und kannst den maximalen Value herausholen.\n\nJe mehr dieser Punkte erfüllt sind, desto größer darf die Lücke zwischen deiner Equity und den direkten Pot Odds sein. Fehlen sie alle, gelten die direkten Pot Odds fast unverändert.\n\nAls Größenordnung: Ein knapp verpasster Preis (2–5 Prozentpunkte Lücke) ist mit guten Voraussetzungen meist callbar. Eine Lücke von rund 25 Prozentpunkten – etwa ein Gutshot gegen eine Potsize-Bet – schließt du dagegen nur in Ausnahmefällen mit sehr tiefen Stacks.',
          example:
            'Du callst am Turn mit einem verdeckten Gutshot gegen ein wahrscheinliches Overpair, Stacks sind 200bb tief. Kommt deine Straight mit einer harmlosen Karte an, gewinnst du oft den gesamten Rest-Stack – genau dafür lohnt sich der knapp unprofitable direkte Call.',
        },
        {
          heading: 'Set-Mining: die 15:1-Faustregel',
          body:
            '**Set-Mining** – ein kleines oder mittleres Pocket Pair preflop callen, um ein Set zu floppen – ist die reinste Form des Implied-Odds-Spiels. Die Zahlen: Mit einem Pocket Pair floppst du in rund **11,8 %** der Fälle ein Set oder besser, also etwa einmal in 8,5 Versuchen (7,5:1 dagegen).\n\nTrotzdem lautet die bewährte Faustregel: Calle nur, wenn die **effektiven Stacks mindestens etwa das 15-Fache des Calls** betragen (15:1, teils wird konservativer 20:1 empfohlen). Warum so viel mehr als 7,5:1? Weil drei Abschläge nötig sind: Du wirst nach einem Treffer nicht immer voll ausbezahlt (der Gegner hat oft nichts oder gibt auf), dein Set verliert gelegentlich gegen ein höheres Set oder einen eingelaufenen Draw, und manchmal foldet der Gegner schon am Flop auf deine erste Bet.\n\nKonkret bei 100bb: Ein Open-Raise auf 3bb darfst du mit 22–66 bequem callen (3 × 15 = 45bb benötigt). Ein 3-Bet auf 12bb ist dagegen kein reiner Set-Mining-Call mehr: 12 × 15 = 180bb – mehr, als im Stack liegt. Dann muss die Hand anderen Value mitbringen oder in den Fold.\n\nDie Regel skaliert mit der Stacktiefe: Je tiefer, desto profitabler wird Set-Mining; je kürzer die Stacks, desto schneller wird aus dem Standard-Call ein Standard-Fold.',
          cards: ['6d', '6c'],
        },
        {
          heading: 'Reverse Implied Odds: wenn Treffen teuer wird',
          body:
            '**Reverse Implied Odds** sind die dunkle Seite der Medaille: Du verlierst auf späteren Streets zusätzliches Geld, gerade **weil** deine Hand ankommt – als zweitbeste Hand.\n\nDer Klassiker sind dominierte Draws:\n\n- **Kleiner Flushdraw**: Mit 8♥ 7♥ triffst du deinen Flush genauso oft wie mit A♥ 5♥ – aber wenn ein Gegner gleichzeitig einen höheren Flushdraw hält, gewinnt er den großen Pot und du bezahlst ihn. Du gewinnst klein (wenn niemand etwas hat) und verlierst groß (wenn Flush auf Flush trifft).\n- **Das dumme Ende der Straight**: Mit 6♠ 5♠ auf 7-8-9 hast du zwar eine fertige Straight, aber jede T-6- und jede J-T-Kombination beim Gegner macht dich zum Underdog im dicken Pot.\n- **Dominierte Paare**: KTo trifft auf K-hoch-Boards Top Pair – und verliert dann teuer gegen KQ, AK und besser. Auch fertige Hände können Reverse-Implied-Odds-Probleme haben.\n\nDie Konsequenz für deine Rechnung: Bei Nut-Draws darfst du Implied Odds großzügig ansetzen, bei Non-Nut-Draws musst du sie kürzen – und teilweise sogar negative zukünftige Beträge einplanen. Genau deshalb sind A♥ 5♥ und K♥ Q♥ deutlich bessere Preflop-Kandidaten als 8♥ 7♥, obwohl alle drei gleich oft den Flush treffen: Der Unterschied liegt nicht in der Trefferquote, sondern in dem, was der Treffer wert ist.',
          tip: 'Stelle dir vor jedem Draw-Call die Frage: "Wenn ich treffe – bin ich dann sicher vorne?" Nut-Draws dürfen auf Auszahlung hoffen, dominierte Draws müssen sie fürchten.',
        },
      ],
      takeaways: [
        'Implied Odds rechnen zukünftige Gewinne in den Preis ein: Der relevante Pot ist der, um den du wirklich spielst.',
        'Gute Implied Odds brauchen tiefe Stacks, einen verdeckten Draw, einen zahlungsbereiten Gegner und idealerweise Position.',
        'Set-Mining-Faustregel: Call nur, wenn die effektiven Stacks mindestens etwa das 15-Fache des Calls betragen.',
        'Die 15:1-Anforderung liegt weit über den 7,5:1 gegen ein Set, weil du nicht immer ausbezahlt wirst und Sets gelegentlich verlieren.',
        'Reverse Implied Odds treffen dominierte Draws: Du gewinnst kleine Pötte und verlierst große – Nut-Draws sind deshalb weit mehr wert als ihre Trefferquote vermuten lässt.',
      ],
      quiz: [
        {
          question: 'Was beschreiben Implied Odds?',
          options: [
            'Die Odds, die der Gegner auf seinen Draw bekommt',
            'Die Wahrscheinlichkeit, dass dein Draw bis zum River ankommt',
            'Erwartete zusätzliche Gewinne auf späteren Streets, die deinen effektiven Preis für den Call verbessern',
            'Die Pot Odds nach Abzug des Rake',
          ],
          correctIndex: 2,
          explanation:
            'Implied Odds erweitern die direkte Pot-Odds-Rechnung um das Geld, das du nach einem Treffer voraussichtlich noch gewinnst.',
        },
        {
          question:
            'Wie lautet die Set-Mining-Faustregel für einen Preflop-Call mit einem kleinen Pocket Pair?',
          options: [
            'Effektive Stacks mindestens das 5-Fache des Calls',
            'Effektive Stacks mindestens das 10-Fache des Calls',
            'Effektive Stacks mindestens etwa das 15-Fache des Calls',
            'Effektive Stacks mindestens das 50-Fache des Calls',
          ],
          correctIndex: 2,
          explanation:
            'Die verbreitete Faustregel verlangt rund 15:1 (konservativ bis 20:1), damit sich Set-Mining trotz unvollständiger Auszahlung lohnt.',
        },
        {
          question:
            'Warum verlangt die Set-Mining-Regel etwa 15:1, obwohl die Odds gegen ein Set am Flop nur rund 7,5:1 stehen?',
          options: [
            'Weil die Regel einen festen Aufschlag für den Rake enthält',
            'Weil du dein Set nicht immer voll ausbezahlt bekommst und es gelegentlich verliert',
            'Weil Sets in der Praxis seltener kommen als die Theorie sagt',
            'Weil die Regel auch Turn- und River-Sets abdecken muss',
          ],
          correctIndex: 1,
          explanation:
            'Der Aufschlag kompensiert zwei Realitäten: Der Gegner zahlt dein Set oft nicht aus, und selbst getroffene Sets verlieren manchmal.',
        },
        {
          question:
            'Du hältst 8♥ 7♥ mit Flushdraw. Warum sind deine Implied Odds schlechter als mit A♥ 5♥ in derselben Situation?',
          options: [
            'Weil dein Flush gegen einen höheren Flush verlieren kann – du gewinnst kleine Pötte und verlierst große',
            'Weil 87s weniger Flush-Outs hat als A5s',
            'Weil 87s den Flush seltener trifft',
            'Weil das Ass die Trefferwahrscheinlichkeit erhöht',
          ],
          correctIndex: 0,
          explanation:
            'Beide Hände treffen gleich oft. Aber der Non-Nut-Flush hat Reverse Implied Odds: Trifft gleichzeitig ein höherer Flush, verlierst du einen großen Pot.',
        },
        {
          question:
            'Effektive Stacks 40bb, ein Gegner raist auf 4bb, du hältst 3♠ 3♦. Was sagt die Set-Mining-Faustregel?',
          options: [
            'Call – Sets gewinnen fast immer große Pötte',
            'Fold – du bräuchtest etwa 60bb effektiv (4bb × 15)',
            'Call – 40bb reichen für 15:1 locker aus',
            'All-in, um die Implied Odds zu maximieren',
          ],
          correctIndex: 1,
          explanation:
            '4bb × 15 = 60bb benötigte effektive Stacktiefe. Mit nur 40bb ist reines Set-Mining unprofitabel – die Hand geht in den Fold (oder braucht einen anderen Plan).',
        },
      ],
    },
    {
      id: 'm3-l5',
      title: 'Expected Value (EV)',
      duration: 9,
      intro:
        'Der Expected Value ist die gemeinsame Währung aller Poker-Entscheidungen: der durchschnittliche Gewinn oder Verlust einer Aktion, wenn du sie unendlich oft wiederholst. Wer in EV denkt, hört auf, einzelne Hände zu bewerten – und fängt an, Entscheidungen zu bewerten.',
      sections: [
        {
          heading: 'Die EV-Formel',
          body:
            'Der **Expected Value (EV)**, deutsch Erwartungswert, verdichtet eine Entscheidung auf eine einzige Zahl:\n\n**EV = (Gewinnwahrscheinlichkeit × Gewinn) − (Verlustwahrscheinlichkeit × Einsatz)**\n\nDabei ist der **Gewinn** das, was du bei Erfolg dazugewinnst – bei einem Call also der Pot inklusive der gegnerischen Bet, aber ohne dein eigenes Geld. Der **Einsatz** ist das, was du bei Misserfolg verlierst – bei einem Call genau der Call-Betrag. Die beiden Wahrscheinlichkeiten ergänzen sich zu 100 %.\n\nEin schnelles Beispiel: Du callst 25 € und gewinnst damit in 25 % der Fälle einen Pot von 100 €. EV = 0,25 × 100 − 0,75 × 25 = 25 − 18,75 = **+6,25 €**. Im Durchschnitt bringt dir dieser Call also 6,25 € – nicht in dieser einen Hand, sondern gemittelt über viele Wiederholungen.\n\nEV und Pot Odds sind zwei Seiten derselben Rechnung: Die benötigte Equity aus der Pot-Odds-Formel ist genau der Punkt, an dem der EV eines Calls null wird. Pot Odds beantworten die Ja/Nein-Frage schneller; die EV-Rechnung sagt dir zusätzlich, **wie** profitabel oder teuer eine Entscheidung ist.',
          tip: 'Positive EV-Entscheidungen heißen +EV, negative −EV. Dein gesamtes Poker-Ergebnis ist nichts anderes als die Summe aller EVs deiner Entscheidungen plus kurzfristiges Kartenglück – nur den ersten Teil kannst du kontrollieren.',
        },
        {
          heading: 'Rechenbeispiel 1: Call mit Flushdraw am Turn',
          body:
            'Situation: Pot 100 €, der Gegner bettet 50 €. Du hältst den Nut-Flushdraw, eine Karte kommt noch – Equity 9/46 ≈ 19,6 %. Lohnt der Call von 50 €?\n\n- **Gewinnfall**: In 19,6 % der Fälle gewinnst du Pot plus Bet = 150 €.\n- **Verlustfall**: In 80,4 % der Fälle verlierst du deinen Call von 50 €.\n\nEV = 0,1957 × 150 − 0,8043 × 50 = 29,35 − 40,22 ≈ **−10,90 €**.\n\nJeder dieser Calls kostet dich im Durchschnitt fast elf Euro – unabhängig davon, ob der Flush in der konkreten Hand einläuft oder nicht. Das deckt sich mit der Pot-Odds-Betrachtung: benötigt 25 %, vorhanden 19,6 %.\n\nInteressant wird die Gegenprobe: Wie groß müsste der Pot sein, damit derselbe Call +EV wird? Der EV wird bei einem Gewinnbetrag von etwa 205 € neutral (0,196 × 205 ≈ 0,804 × 50). Du bräuchtest also gut 55 € zusätzliche zukünftige Gewinne – exakt die Zahl, die in der Implied-Odds-Lektion auftauchte. EV-Rechnung, Pot Odds und Implied Odds sind ein einziges zusammenhängendes System.',
          cards: ['Ah', 'Qh'],
        },
        {
          heading: 'Rechenbeispiel 2: All-in-Call mit Combo-Draw',
          body:
            'Situation: Am Flop liegen 120 € im Pot, der Gegner geht mit seinen letzten 80 € all-in. Du hältst Flushdraw plus Gutshot – 12 Outs, beide Karten kommen garantiert, also gilt die Regel von 4 mit Korrektur: rund 45 % Equity.\n\n- **Gewinnfall**: In 45 % der Fälle gewinnst du 120 + 80 = 200 €.\n- **Verlustfall**: In 55 % der Fälle verlierst du deinen Call von 80 €.\n\nEV = 0,45 × 200 − 0,55 × 80 = 90 − 44 = **+46 €**.\n\nObwohl du in der Mehrheit der Fälle verlierst, ist dieser Call hochprofitabel: Der Pot bietet dir mehr, als deine Unterlegenheit kostet. Genau das ist die Kernbotschaft des EV-Denkens – "meistens verlieren" und "profitabel spielen" schließen sich nicht aus.\n\nZum Vergleich die Pot-Odds-Sicht: Du callst 80 € in einen Endpot von 280 €, benötigst also 80/280 ≈ 28,6 % Equity. Mit 45 % liegst du weit darüber. Beide Methoden führen zwingend zum selben Ergebnis; die EV-Zahl macht nur sichtbar, wie viel Geld auf dem Spiel steht: Wer solche Calls aus Angst vor dem Verlieren ablehnt, verschenkt hier im Schnitt 46 € pro Entscheidung.',
        },
        {
          heading: 'Rechenbeispiel 3: EV eines Bluffs',
          body:
            'EV-Rechnung funktioniert nicht nur für Calls. Beim Bluff ist die Gewinnwahrscheinlichkeit die **Fold-Wahrscheinlichkeit** des Gegners.\n\nSituation: Am River liegen 100 € im Pot, deine Hand kann am Showdown nicht gewinnen. Du überlegst, 50 € zu bluffen.\n\nEV = (Fold-Wahrscheinlichkeit × 100) − (Call-Wahrscheinlichkeit × 50).\n\nDer Break-even-Punkt liegt dort, wo der EV null wird: F × 100 = (1 − F) × 50, also F = 50/150 = **33,3 %**. Allgemein: Ein Bluff muss in Einsatz/(Einsatz + Pot) der Fälle durchkommen – dieselbe Struktur wie die Pot-Odds-Formel, nur aus der Perspektive des Aggressors.\n\nFoldet der Gegner in 45 % der Fälle, ergibt sich EV = 0,45 × 100 − 0,55 × 50 = 45 − 27,50 = **+17,50 €**. Ein Bluff, der meistens scheitert, ist trotzdem klar profitabel.\n\nBemerkenswert: Der Gegner muss nur in einem Drittel der Fälle folden, obwohl du einen halben Pot riskierst. Kleine Bluffs brauchen wenig Erfolgsquote, große Bluffs viel – eine Potsize-Bluff-Bet braucht 50 %. Deshalb ist die realistische Einschätzung der gegnerischen Fold-Bereitschaft wichtiger als jede Rechenkunst.',
          example:
            'Bluff 50 € in 100 € Pot: break-even ab 33,3 % Folds. Schätzt du die Fold-Quote des Gegners auf 45 %, verdient der Bluff im Schnitt 17,50 € – obwohl er öfter scheitert als gelingt.',
        },
        {
          heading: 'In EV denken, nicht in Ergebnissen',
          body:
            'Die schwierigste Lektion der Poker-Mathematik ist psychologisch: **Das Ergebnis einer einzelnen Hand sagt fast nichts über die Qualität deiner Entscheidung.** Der +46-€-Call aus Beispiel 2 verliert in 55 % der Fälle – und war trotzdem jedes Mal richtig. Der −10,90-€-Call aus Beispiel 1 gewinnt in fast jedem fünften Fall – und war trotzdem jedes Mal falsch.\n\nWer Entscheidungen nach Ergebnissen bewertet, lernt systematisch das Falsche. Dieses Denkmuster hat einen Namen: **Results-Oriented Thinking**. Es führt dazu, dass du korrekte Draws aufgibst, weil sie dreimal hintereinander nicht ankamen, oder schlechte Calls wiederholst, weil einer davon zufällig gewann.\n\nDie Alternative: Bewerte nach der Entscheidung. Frage nach jeder größeren Hand nicht "Habe ich gewonnen?", sondern "War die Aktion +EV, mit den Informationen, die ich hatte?". Auf lange Sicht – über zehntausende Hände – konvergiert dein Ergebnis gegen die Summe deiner EVs; die Varianz gleicht sich aus, die Entscheidungsqualität bleibt.\n\nDieses Denken ist auch die Grundlage für verantwortungsvolles Spiel: Wer EV versteht, akzeptiert Downswings als statistische Normalität, spielt nur mit einer Bankroll, deren Verlust er verkraften kann, und jagt Verlusten nicht hinterher. Kurzfristig regiert der Zufall – langfristig regiert die Mathematik.',
          tip: 'Führe eine kleine Review-Routine ein: Analysiere nach der Session zwei oder drei große Pötte nur nach der Frage "richtige Entscheidung?" – und ignoriere dabei bewusst, wie die Hand ausging.',
        },
      ],
      takeaways: [
        'EV = (Gewinnwahrscheinlichkeit × Gewinn) − (Verlustwahrscheinlichkeit × Einsatz) – der Durchschnittsertrag einer Entscheidung über viele Wiederholungen.',
        'Ein Call kann +EV sein, obwohl du meistens verlierst – entscheidend ist das Verhältnis von Pot zu Einsatz.',
        'Für Bluffs gilt: Break-even-Fold-Quote = Einsatz / (Einsatz + Pot); ein halber Pot braucht nur 33,3 % Folds.',
        'Pot Odds, Implied Odds und EV sind ein System: Die benötigte Equity ist genau der Punkt, an dem der EV null wird.',
        'Bewerte Entscheidungen, nicht Ergebnisse – kurzfristig regiert die Varianz, langfristig die Summe deiner EVs.',
      ],
      quiz: [
        {
          question:
            'Du callst 25 € und gewinnst in 25 % der Fälle einen Pot von 100 €. Wie hoch ist der EV des Calls?',
          options: ['−6,25 €', '0 €', '+6,25 €', '+25 €'],
          correctIndex: 2,
          explanation:
            'EV = 0,25 × 100 − 0,75 × 25 = 25 − 18,75 = +6,25 €.',
        },
        {
          question: 'Was bedeutet ein negativer EV bei einem Call?',
          options: [
            'Du verlierst diese konkrete Hand mit Sicherheit',
            'Der Call gewinnt höchstens den halben Pot',
            'Der Call ist nur bei tiefen Stacks erlaubt',
            'Auf lange Sicht verlierst du mit diesem Call im Durchschnitt Geld',
          ],
          correctIndex: 3,
          explanation:
            'EV ist ein Durchschnittswert über viele Wiederholungen. Ein −EV-Call kann einzelne Hände gewinnen, kostet aber langfristig Geld.',
        },
        {
          question:
            'Du bluffst 50 € in einen 100-€-Pot (deine Hand gewinnt nie am Showdown). Wie oft muss der Gegner mindestens folden, damit der Bluff break-even ist?',
          options: ['25 %', '33,3 %', '50 %', '66,7 %'],
          correctIndex: 1,
          explanation:
            'Break-even-Fold-Quote = Einsatz / (Einsatz + Pot) = 50/150 = 33,3 %.',
        },
        {
          question: 'Du machst einen klar profitablen (+EV) Call, verlierst aber die Hand. Wie bewertest du die Entscheidung?',
          options: [
            'Die Entscheidung war richtig – EV bewertet Entscheidungen, nicht einzelne Ergebnisse',
            'Die Entscheidung war falsch, das Ergebnis beweist es',
            'EV-Rechnungen gelten nur für All-in-Situationen',
            'Die Entscheidung war neutral, weil sich Glück und Können aufheben',
          ],
          correctIndex: 0,
          explanation:
            'Einzelne Ergebnisse sind Varianz. Über viele Wiederholungen konvergiert dein Resultat gegen den EV – die Entscheidung bleibt richtig, auch wenn die Hand verliert.',
        },
        {
          question:
            'Pot 120 €, der Gegner geht mit 80 € all-in, du hast mit einem Combo-Draw rund 45 % Equity. Wie hoch ist der EV deines Calls?',
          options: ['−44 €', '+10 €', '+46 €', '+90 €'],
          correctIndex: 2,
          explanation:
            'EV = 0,45 × 200 − 0,55 × 80 = 90 − 44 = +46 €. Trotz Underdog-Rolle ist der Call klar profitabel.',
        },
      ],
    },
    {
      id: 'm3-l6',
      title: 'Kombinatorik & Wahrscheinlichkeiten',
      duration: 9,
      intro:
        'Combos zählen macht aus vagen Vermutungen präzises Hand-Reading: Statt "er könnte AK haben" weißt du, wie viele AK-Kombinationen überhaupt noch möglich sind. Dazu bekommst du die wichtigsten Wahrscheinlichkeiten, die jeder ernsthafte Spieler kennen sollte.',
      sections: [
        {
          heading: 'Combos: die Grundeinheit des Hand-Readings',
          body:
            'Eine **Combo** ist eine konkrete Zwei-Karten-Kombination. Insgesamt gibt es 1326 mögliche Starthände – aber für das Hand-Reading zählt vor allem, wie viele Combos jede Hand-Klasse hat:\n\n- **Pocket Pairs: 6 Combos.** Aus vier Karten eines Rangs lassen sich sechs Paare bilden (A♠A♥, A♠A♦, A♠A♣, A♥A♦, A♥A♣, A♦A♣).\n- **Unpaired Hände: 16 Combos.** 4 × 4 Kombinationen zweier verschiedener Ränge – davon **4 suited** und **12 offsuit**.\n\nDiese Asymmetrie ist strategisch enorm wichtig. AKo kommt dreimal so oft vor wie AKs. Und eine Range wie "AK oder QQ" besteht aus 16 + 6 = 22 Combos, ist also fast drei Viertel der Zeit AK – ein Detail, das viele Entscheidungen gegen genau diese Range dreht.\n\nGewöhne dir an, Ranges nicht in Hand-Namen, sondern in Combo-Zahlen zu denken: "Er hat QQ+ und AK" bedeutet 6 + 6 + 6 + 16 = 34 Combos. Erst diese Zahlen machen Aussagen wie "meistens hat er ein Overpair" überprüfbar – in diesem Fall wäre sie übrigens falsch: 18 Overpair-Combos (ohne AA wären es je nach Board weniger) stehen 16 AK-Combos gegenüber, es ist fast ein Münzwurf.',
          cards: ['As', 'Kh'],
        },
        {
          heading: 'Preflop-Wahrscheinlichkeiten',
          body:
            'Aus den Combo-Zahlen folgen die Preflop-Wahrscheinlichkeiten direkt: Wahrscheinlichkeit = Combos / 1326.\n\n- **Ein bestimmtes Paar** (z. B. AA): 6/1326 = **0,45 %**, also einmal in 221 Händen. Wer eine Stunde online auf zwei Tischen spielt, sieht Asse im Schnitt etwa einmal.\n- **Irgendein Pocket Pair**: 78/1326 = **5,9 %**, rund einmal alle 17 Hände.\n- **AK (suited oder offsuit)**: 16/1326 = **1,2 %**, etwa einmal alle 83 Hände. AA, KK und AK zusammen – die klassischen Premium-Konfrontationshände – kommen auf gut 2 % aller Starthände.\n\nDiese Zahlen erden dein Spiel in zwei Richtungen. Erstens gegen Ungeduld: Premiums sind selten, und wer sie erzwingen will, spielt zwangsläufig zu viele schwache Hände. Zweitens gegen Paranoia: Wenn du KK hältst, hat ein einzelner Gegner nur in etwa 0,5 % der Fälle AA – die Angst vor dem Monster unter dem Bett ist meistens teurer als das Monster selbst.',
          table: {
            headers: ['Ereignis', 'Wahrscheinlichkeit', 'Odds'],
            rows: [
              ['Bestimmtes Paar (z. B. AA)', '0,45 %', '220:1'],
              ['Irgendein Pocket Pair', '5,9 %', 'ca. 16:1'],
              ['AK (suited oder offsuit)', '1,2 %', 'ca. 82:1'],
              ['Zwei suited Karten', '23,5 %', 'ca. 3,3:1'],
            ],
          },
        },
        {
          heading: 'Die wichtigsten Flop-Wahrscheinlichkeiten',
          body:
            'Auch postflop wiederholen sich dieselben Zahlen immer wieder – diese vier solltest du sicher abrufen können:\n\n- **Set oder besser mit Pocket Pair: ca. 11,8 %** – etwa einmal in 8,5 Flops. Die Grundlage der Set-Mining-Rechnung aus Lektion 4.\n- **Fertiger Flush mit zwei suited Karten: ca. 0,8 %** – ein echtes Ausnahmeereignis. Wer suited Hände wegen des fertigen Flushs spielt, spielt sie aus dem falschen Grund.\n- **Flushdraw mit zwei suited Karten: ca. 11 %** – das ist der eigentliche Wert von suited: regelmäßig starke Draws, die aggressiv weitergespielt werden können.\n- **Mindestens ein Paar mit zwei unpaired Karten: ca. 32 %** – du verfehlst den Flop also in zwei von drei Fällen. Diese Zahl erklärt, warum Continuation Bets funktionieren: Auch dein Gegner trifft meistens nichts.\n\nEin Muster fällt auf: Direkte Volltreffer (Flush, Set) sind selten, brauchbare Teiltreffer (Draws, ein Paar) sind häufig. Postflop-Poker ist deshalb selten ein Duell fertiger Monsterhände, sondern meist ein Kampf zwischen mittelstarken Händen, Draws und komplett verfehlten Boards – wer die Häufigkeiten kennt, weiß, wie oft Druck sich lohnt.',
          tip: 'Merke die Paarung: 11,8 % Set (Pocket Pair) und 11 % Flushdraw (suited) liegen fast gleichauf – rund jeder neunte Flop. Und ein Drittel für "irgendein Paar mit unpaired Karten" ist die vielleicht meistgenutzte Zahl im Poker.',
        },
        {
          heading: 'Combos im Hand-Reading nutzen',
          body:
            'Der praktische Wert der Kombinatorik: **Card Removal**. Jede sichtbare Karte – deine Holecards, das Board – streicht Combos aus der gegnerischen Range.\n\nDurchgerechnetes Beispiel: Das Board zeigt A♠ 7♦ 2♣, du willst wissen, wie oft der Gegner Top Pair oder besser hält. Vor dem Flop hatte er 16 AK-Combos. Jetzt liegt ein Ass auf dem Board: Es bleiben 3 Asse × 4 Könige = **12 AK-Combos**. Genauso schrumpft AA von 6 auf **3 Combos** (aus drei verbliebenen Assen) und 77 sowie 22 auf je **3 Combos**.\n\nAngenommen, seine Preflop-Range enthält AA, AK, AQ, 77 und 22. Dann hält er auf diesem Flop: 3 + 3 + 3 = 9 Set/Overset-Combos gegen 12 + 12 = 24 Top-Pair-Combos. Top Pair ist fast dreimal so wahrscheinlich wie ein Set – eine Erkenntnis, die ohne Zählen reine Gefühlssache wäre.\n\nHältst du selbst ein Ass, verschiebt sich alles noch einmal: Seine AK-Combos fallen auf 8, seine AA-Combos auf 3 (bzw. 1, wenn zusätzlich das Board-Ass zählt). Genau so entsteht modernes Hand-Reading: nicht raten, sondern zählen, wie viele Combos jeder Handkategorie übrig sind – und die eigene Entscheidung an diesen Mehrheitsverhältnissen ausrichten.',
          example:
            'Board A♠ 7♦ 2♣, gegnerische Range AA/AK/AQ/77/22: 9 Set-Combos gegen 24 Top-Pair-Combos. Gegen eine große Bet ist "er hat doch eh das Set" also messbar zu pessimistisch.',
        },
        {
          heading: 'Blocker: die Grundidee',
          body:
            'Ein **Blocker** ist eine Karte in deiner Hand, die bestimmte gegnerische Combos unmöglich macht. Das ist Card Removal, aktiv gedacht: Du fragst nicht nur "was kann er halten?", sondern "was kann er **wegen meiner Karten nicht** halten?".\n\nDie zwei wichtigsten Anwendungen:\n\n- **Bluffs auswählen**: Auf einem Board mit drei Herzkarten hältst du A♥ (ohne zweites Herz). Damit ist der Nut Flush für alle Gegner unmöglich – jede gegnerische Flush-Combo mit dem A♥ ist gestrichen. Deine Bluffs auf diesem Board sind glaubwürdiger und erfolgreicher, weil die stärkste Hand, mit der dich der Gegner callen könnte, gar nicht existiert. Genau deshalb sind Hände wie A♥ 5♠ auf Herz-Boards Standard-Bluffkandidaten.\n- **Calls und Folds feinjustieren**: Hältst du ein Ass, halbieren sich die AA-Combos des Gegners von 6 auf 3 und seine AK-Combos sinken von 16 auf 12. Mit A♣ K♦ gegen eine 4-Bet ist AA schlicht seltener, als es sich anfühlt.\n\nWichtig für den Anfang: Blocker verschieben Wahrscheinlichkeiten um Prozentpunkte, sie zaubern keine Gewissheiten. Ein Blocker macht aus einem knappen Spot einen etwas besseren – aus einem schlechten Bluff macht er keinen guten. Als Feinjustierung auf solide Grundlagen gehört Blocker-Denken aber fest ins Repertoire jedes fortgeschrittenen Spielers.',
          cards: ['Ah', '5s'],
        },
      ],
      takeaways: [
        'Combo-Grundzahlen: Pocket Pair 6, unpaired Hand 16 (4 suited + 12 offsuit), insgesamt 1326 Starthände.',
        'Kernwahrscheinlichkeiten preflop: irgendein Paar 5,9 %, AA 0,45 % (1 zu 221), AK 1,2 %.',
        'Kernwahrscheinlichkeiten am Flop: Set mit Pocket Pair 11,8 %, Flushdraw mit suited ca. 11 %, fertiger Flush nur 0,8 %.',
        'Card Removal macht Hand-Reading messbar: Sichtbare Karten streichen Combos – auf A-hoch-Boards bleiben von 16 AK-Combos nur 12.',
        'Blocker sind aktives Card Removal: Karten in deiner Hand, die gegnerische Combos unmöglich machen – ideal zur Bluff-Auswahl, aber nur als Feinjustierung.',
      ],
      quiz: [
        {
          question: 'Wie viele Combos haben AKs, AKo und AK insgesamt?',
          options: ['4 / 12 / 16', '6 / 12 / 18', '4 / 8 / 12', '6 / 16 / 22'],
          correctIndex: 0,
          explanation:
            'Suited gibt es einmal pro Farbe (4), offsuit 4 × 4 − 4 = 12. Zusammen 16 Combos für eine unpaired Hand.',
        },
        {
          question: 'Wie wahrscheinlich bekommst du AA ausgeteilt?',
          options: [
            'Ca. 1,2 % (1 zu 83)',
            'Ca. 0,45 % (1 zu 221)',
            'Ca. 5,9 % (1 zu 17)',
            'Ca. 0,9 % (1 zu 110)',
          ],
          correctIndex: 1,
          explanation:
            '6 von 1326 Combos sind AA: 6/1326 = 0,45 %, also einmal in 221 Händen. 5,9 % gilt für irgendein Paar, 1,2 % für AK.',
        },
        {
          question: 'Auf dem Board liegt A♠ 7♦ 2♣. Wie viele AK-Combos kann dein Gegner noch halten?',
          options: ['16', '12', '9', '8'],
          correctIndex: 1,
          explanation:
            'Ein Ass ist auf dem Board sichtbar: Es bleiben 3 Asse × 4 Könige = 12 Combos.',
        },
        {
          question: 'Wie oft floppst du mit einem Pocket Pair ein Set (oder besser)?',
          options: ['Ca. 6 %', 'Ca. 11,8 %', 'Ca. 17 %', 'Ca. 25 %'],
          correctIndex: 1,
          explanation:
            'Mit zwei eigenen Karten des Rangs bleiben zwei Outs im Deck – über drei Flop-Karten ergibt das rund 11,8 %, etwa einmal in 8,5 Flops.',
        },
        {
          question: 'Wie oft floppst du mit zwei suited Karten direkt einen fertigen Flush?',
          options: ['Ca. 0,8 %', 'Ca. 5 %', 'Ca. 11 %', 'Ca. 19,6 %'],
          correctIndex: 0,
          explanation:
            'Alle drei Flop-Karten müssten aus den 11 verbliebenen Karten deiner Farbe kommen: nur rund 0,8 %. Der Flushdraw (ca. 11 %) ist der realistische Wert von suited Händen.',
        },
        {
          question:
            'Auf einem Board mit drei Herzkarten hältst du A♥ (ohne zweites Herz). Was ist die wichtigste Konsequenz?',
          options: [
            'Du solltest nie bluffen, weil du den Flush blockierst',
            'Niemand kann den Nut Flush halten – dein A♥ ist ein Blocker und macht deine Bluffs glaubwürdiger',
            'Der Gegner hat dadurch mehr Flush-Combos in seiner Range',
            'Blocker spielen nur preflop eine Rolle',
          ],
          correctIndex: 1,
          explanation:
            'Dein A♥ streicht alle gegnerischen Nut-Flush-Combos. Genau solche Hände sind darum bevorzugte Bluff-Kandidaten auf monotonen Boards.',
        },
      ],
    },
  ],
};

export default m3;
