import type { Module } from '../types';

const m2: Module = {
  id: 'm2',
  title: 'Preflop-Strategie',
  subtitle: 'Starthände, Ranges und die erste Entscheidung',
  icon: '🃏',
  level: 'Einsteiger',
  lessons: [
    {
      id: 'm2-l1',
      title: 'Starthände verstehen',
      duration: 9,
      intro:
        'Jede Hand beginnt mit zwei Karten und einer Entscheidung. Wer die 169 Starthände systematisch einordnen kann, trifft diese erste Entscheidung nicht mehr aus dem Bauch, sondern mit Plan.',
      sections: [
        {
          heading: 'Die 169 Starthände',
          body:
            'In Texas Hold\'em gibt es genau **169 verschiedene Starthände**, wenn man nur nach Rang und der Frage suited/offsuit unterscheidet: 13 Paare (AA bis 22), 78 suited Hände (beide Karten in derselben Farbe) und 78 offsuit Hände.\n\nHinter jeder dieser Hand-Klassen stecken unterschiedlich viele konkrete Kartenkombinationen, sogenannte **Combos**. Ein Paar wie AA kann auf 6 Arten ausgeteilt werden, eine suited Hand wie AKs auf 4 Arten, eine offsuit Hand wie AKo auf 12 Arten. In Summe ergibt das 1326 mögliche Combos.\n\nWarum ist das wichtig? Weil du dadurch ein Gefühl für Häufigkeiten bekommst: Offsuit-Hände machen den Löwenanteil aller ausgeteilten Hände aus, suited Hände nur rund 24 %. Und ein bestimmtes Paar bekommst du nur in etwa einer von 221 Händen – AA ist also wirklich selten. Irgendein Paar hältst du in rund 6 % der Fälle, also etwa einmal pro 17 Hände.\n\nDieses Combo-Denken ist die Grundlage für alles, was später kommt: Ranges lesen, Blocker verstehen, Wahrscheinlichkeiten abschätzen.',
          table: {
            headers: ['Typ', 'Hand-Klassen', 'Combos pro Hand', 'Combos gesamt'],
            rows: [
              ['Paare', '13', '6', '78'],
              ['Suited', '78', '4', '312'],
              ['Offsuit', '78', '12', '936'],
              ['Gesamt', '169', '–', '1326'],
            ],
          },
        },
        {
          heading: 'Notation: AKs vs. AKo',
          body:
            'Die Standard-Notation ist kompakt: Ränge werden mit 2–9, T (Ten), J, Q, K, A abgekürzt. Ein kleines **s** dahinter steht für suited, ein **o** für offsuit. AKs ist also Ass-König in derselben Farbe, AKo in zwei verschiedenen Farben. Bei Paaren entfällt der Zusatz – QQ ist einfach QQ.\n\nDer Unterschied zwischen suited und offsuit wirkt klein, ist aber strategisch bedeutsam. AKs gewinnt gegen eine zufällige Hand etwa 67 % der Zeit, AKo etwa 65 %. Zwei Prozentpunkte klingen nach wenig, aber der eigentliche Vorteil liegt in der **Spielbarkeit**: Eine suited Hand floppt in rund 11 % der Fälle einen Flushdraw und macht bis zum River in gut 6 % der Fälle einen Flush. Das bedeutet mehr Situationen, in denen du profitabel weiterspielen kannst – semi-bluffen, Druck aufbauen, große Pötte gewinnen.\n\nDeshalb gilt als Faustregel: Suited Hände darfst du deutlich weiter unten in deine Range aufnehmen als ihre offsuit Geschwister. K9s kann in später Position ein solider Open-Raise sein, während K9o meist in den Muck gehört.',
          cards: ['As', 'Ks', 'Ah', 'Kd'],
          tip: 'Verwechsle Equity nicht mit Spielbarkeit. Q7o hat gegen eine zufällige Hand über 50 % Equity, ist aber kaum profitabel spielbar, weil sie selten starke, klar dominierende Hände macht.',
        },
        {
          heading: 'Die wichtigsten Hand-Kategorien',
          body:
            'Statt 169 Hände einzeln zu lernen, denkst du in Kategorien mit ähnlichen Eigenschaften:\n\n- **Premiums** (AA, KK, QQ, AK): Die stärksten Hände. Sie dominieren fast alles und wollen den Pot früh aufbauen – fast immer raisen oder 3-betten.\n- **Broadways** (AQ, AJ, AT, KQ, KJ, QJ usw.): Zwei Karten Ten oder höher. Sie machen oft Top Pair mit gutem Kicker, sind aber anfällig für Domination durch Premiums.\n- **Suited Connectors** (JTs, T9s, 98s, 76s ...): Verbundene suited Karten. Sie treffen Straights und Flushes, spielen sich am besten in Position und mit tiefen Stacks.\n- **Kleine und mittlere Paare** (22–88): Ihr Hauptwert liegt im Set-Mining – auf dem Flop triffst du in knapp 12 % der Fälle ein Set, das große Pötte gewinnen kann.\n- **Suited Aces** (A2s–A9s): Nut-Flush-Potenzial plus Blocker-Wert. Hände wie A5s sind später außerdem klassische Bluff-Kandidaten.\n\nJede Kategorie hat ein eigenes Profil aus Showdown-Stärke, Draw-Potenzial und Positionsabhängigkeit. Genau daraus leiten sich die Preflop-Ranges der nächsten Lektionen ab.',
          example:
            'Du hältst 7♥ 6♥ – ein klassischer Suited Connector. Gegen AA hat diese Hand rund 23 % Equity und damit mehr als etwa KQo (ca. 13 %), weil sie mit Straights und Flushes gewinnen kann, statt vom Ass dominiert zu werden.',
        },
        {
          heading: 'Warum tight-aggressiv der richtige Start ist',
          body:
            'Der bewährteste Einstiegsstil heißt **tight-aggressiv** (TAG): Du spielst relativ wenige Hände (in 6-max grob 20–25 %), aber wenn du spielst, dann mit Initiative – also mit Raise statt Call, mit Bet statt Check.\n\nTight zu spielen hat zwei große Vorteile. Erstens startest du im Schnitt mit der stärkeren Range als deine Gegner und gewinnst dadurch die vielen kleinen Standardsituationen. Zweitens vermeidest du die teuersten Anfängerfehler: dominierte Hände wie KTo oder A7o aus früher Position, die postflop ein gutes, aber zweitbestes Paar treffen.\n\nAggressiv zu spielen bringt dir zwei Gewinnwege statt einem: Du kannst am Showdown die beste Hand haben **oder** deine Gegner zum Folden bringen. Wer nur callt, kann nur auf dem ersten Weg gewinnen und überlässt dem Gegner die Kontrolle über den Pot.\n\nWichtig: Tight heißt nicht passiv oder ängstlich. Es heißt selektiv. Du wartest auf Situationen mit Vorteil – gute Hand, gute Position, klarer Plan – und setzt dann konsequent Druck. Mit wachsender Erfahrung kannst du deine Ranges Schritt für Schritt erweitern, aber die Reihenfolge ist entscheidend: erst solide, dann kreativ.',
          tip: 'Faustregel für den Anfang: Wenn du unsicher bist, ob eine Hand spielbar ist, folde sie. Der Fehler, eine Grenzhand zu folden, kostet langfristig viel weniger als der Fehler, zu viele schwache Hände zu spielen.',
        },
      ],
      takeaways: [
        'Es gibt 169 Starthand-Klassen: 13 Paare, 78 suited, 78 offsuit – zusammen 1326 Combos.',
        'Suited Hände sind wertvoller als offsuit: etwas mehr Equity, deutlich mehr Spielbarkeit durch Flush-Potenzial.',
        'Denke in Kategorien (Premiums, Broadways, Suited Connectors, kleine Paare, Suited Aces) statt in Einzelhänden.',
        'Tight-aggressiv ist der beste Startstil: wenige Hände spielen, diese aber mit Initiative.',
        'Selektivität schützt dich vor dominierten Händen – dem teuersten Anfängerfehler.',
      ],
      quiz: [
        {
          question: 'Wie viele Combos hat ein Pocket Pair wie 99 im Vergleich zu einer offsuit Hand wie AJo?',
          options: [
            '4 vs. 12',
            '6 vs. 12',
            '6 vs. 16',
            '12 vs. 6',
          ],
          correctIndex: 1,
          explanation:
            'Ein Paar hat 6 Combos (aus vier Karten eines Rangs lassen sich 6 Zweierkombinationen bilden), eine offsuit Hand 12. Eine suited Hand hätte 4 Combos.',
        },
        {
          question: 'Warum ist A♠ K♠ stärker als A♥ K♦, obwohl beide dieselben Ränge haben?',
          options: [
            'Weil Pik die höchste Farbe im Ranking ist',
            'Weil suited Hände öfter ein Paar treffen',
            'Weil die suited Variante Flush-Potenzial hat und dadurch mehr Equity und Spielbarkeit gewinnt',
            'Der Unterschied ist rein psychologisch',
          ],
          correctIndex: 2,
          explanation:
            'Farben haben in Hold\'em kein Ranking und die Paar-Wahrscheinlichkeit ist identisch. AKs gewinnt zusätzliche Equity (ca. 2 Prozentpunkte) und viele spielbare Situationen durch Flushdraws.',
        },
        {
          question: 'Zu welcher Kategorie gehört 7♦ 6♦ und was ist ihre Hauptstärke?',
          options: [
            'Broadway – starke Top Pairs',
            'Suited Ace – Nut-Flush-Potenzial',
            'Suited Connector – Straight- und Flush-Potenzial',
            'Kleines Paar – Set-Mining',
          ],
          correctIndex: 2,
          explanation:
            '76s ist ein Suited Connector: zwei verbundene Karten derselben Farbe, die vor allem über Straights und Flushes große Hände machen.',
        },
        {
          question: 'Wie oft bekommst du ungefähr irgendein Pocket Pair ausgeteilt?',
          options: [
            'Etwa jede 5. Hand',
            'Etwa jede 17. Hand',
            'Etwa jede 50. Hand',
            'Etwa jede 221. Hand',
          ],
          correctIndex: 1,
          explanation:
            'Die Wahrscheinlichkeit für irgendein Paar liegt bei knapp 6 %, also etwa 1 zu 17. 1 zu 221 gilt für ein bestimmtes Paar wie AA.',
        },
        {
          question: 'Was ist der Kern des tight-aggressiven Stils?',
          options: [
            'Möglichst viele Flops günstig sehen und dann entscheiden',
            'Wenige, starke Hände spielen und diese mit Raises und Bets vorantreiben',
            'Nur Premiums spielen und damit immer All-in gehen',
            'Aggressiv bluffen, sobald die Gegner schwach wirken',
          ],
          correctIndex: 1,
          explanation:
            'TAG bedeutet Selektivität bei der Handauswahl plus Initiative beim Spielen. So startest du mit Range-Vorteil und hast zwei Gewinnwege: beste Hand oder Fold des Gegners.',
        },
      ],
    },
    {
      id: 'm2-l2',
      title: 'Open-Raise nach Position',
      duration: 8,
      intro:
        'Wenn alle vor dir gefoldet haben, hast du genau zwei gute Optionen: raisen oder folden. Wie breit du raist, hängt fast ausschließlich von deiner Position ab.',
      sections: [
        {
          heading: 'Raise First In (RFI)',
          body:
            '**RFI (Raise First In)** beschreibt die Situation, in der vor dir noch niemand freiwillig Geld in den Pot gelegt hat und du als Erster die Entscheidung triffst. Die moderne Standardantwort ist eine reine **Raise-or-Fold-Strategie**: Entweder deine Hand ist gut genug für einen Open-Raise, oder sie wandert in den Muck.\n\nWarum raisen statt callen? Ein Open-Raise erreicht drei Dinge gleichzeitig. Erstens kannst du sofort gewinnen, wenn alle folden – die Blinds sind zwar klein, aber diese Gewinne summieren sich. Zweitens baust du mit deinen starken Händen den Pot auf, solange du wahrscheinlich vorne liegst. Drittens übernimmst du die **Initiative**: Als Preflop-Aggressor kannst du auf vielen Flops eine glaubwürdige Continuation Bet (C-Bet) setzen, selbst wenn du nichts getroffen hast.\n\nDeine RFI-Range ist dabei keine Geschmacksfrage, sondern folgt einer klaren Logik: Je mehr Spieler noch hinter dir sitzen, desto wahrscheinlicher hält jemand eine starke Hand – und desto tighter musst du sein. Je später deine Position, desto öfter wirst du außerdem postflop in Position spielen, was jede Hand wertvoller macht.',
        },
        {
          heading: 'Von UTG bis Button: Ranges werden breiter',
          body:
            'In 6-max öffnest du **Under the Gun (UTG)** nur etwa 15–18 % der Hände: alle Paare, gute Broadways, starke suited Hände. Vom **Hijack (HJ)** werden es rund 18–22 %, vom **Cutoff (CO)** etwa 25–28 %.\n\nDer große Sprung kommt am **Button (BTN)**: Hier sind 40–48 % Standard. Zwei Gründe: Nur noch die beiden Blinds können dich bekämpfen, und postflop spielst du garantiert in Position – du siehst jede Aktion deiner Gegner zuerst und kontrollierst die Potgröße. Der **Small Blind (SB)** öffnet, wenn alle folden, ebenfalls breit (grob 40–50 %), spielt aber praktisch raise-or-fold – dazu mehr in der Blind-Defense-Lektion.\n\nDie Tabelle zeigt dir grobe Richtwerte mit typischen Grenzhänden. Lerne die Ranges nicht stur auswendig, sondern versteh das Muster: Mit jeder Position, die frei wird, kommen die nächstbesten Hände dazu – schwächere suited Aces, kleinere suited Connectors, mehr offsuit Broadways.',
          table: {
            headers: ['Position', 'RFI-Range (ca.)', 'Typische Grenzhände'],
            rows: [
              ['UTG', '15–18 %', 'AJo, KQo, ATs, T9s, 66'],
              ['HJ', '18–22 %', 'ATo, KJo, A9s, 98s, 44'],
              ['CO', '25–28 %', 'A9o, KTo, K8s, QTo, 76s'],
              ['BTN', '40–48 %', 'A2o, K9o, Q9o, J8s, 54s'],
              ['SB', '40–50 % (raise-or-fold)', 'ähnlich BTN, etwas tighter'],
            ],
          },
          tip: 'Merk dir die beiden Ankerpunkte UTG ca. 17 % und Button ca. 45 %. Die Positionen dazwischen kannst du dir als gleichmäßige Treppe vorstellen.',
        },
        {
          heading: 'Das richtige Open-Sizing',
          body:
            'Online ist das Standard-Open heute klein: **2,2–3bb**, an vielen Tischen genau 2,5bb. Kleine Opens riskieren weniger, wenn du eine 3-Bet kassierst und aufgeben musst, und erlauben dir, eine breitere Range profitabel zu spielen. Aus dem Small Blind wählst du eher 3–3,5bb, weil du postflop out of position bist und den Big Blind nicht mit Traumodds einladen willst.\n\n**Live** sind größere Opens Standard: **3–5bb**, in loosen Runden auch mehr. Der Grund ist praktisch: Live-Spieler callen deutlich zu viel, und ein 2,5bb-Open produziert dort oft Familienpötte mit vier, fünf Spielern. Du vergrößerst das Sizing so weit, dass du meist nur ein bis zwei Caller bekommst.\n\nEntscheidend ist in beiden Welten: **Wähle eine feste Größe pro Position und benutze sie für deine gesamte Range.** Wer mit AA groß und mit 76s klein raist, verrät seine Handstärke – aufmerksame Gegner lesen das schneller, als du denkst. Angepasst wird das Sizing an die Situation (Position, Limper, Tischdynamik), niemals an die eigene Handstärke.',
          example:
            'Online-Cash-Game, 100bb: Du sitzt am CO mit A♦ J♦ und alle folden zu dir. Standardspiel: Raise auf 2,5bb. Dieselbe Größe würdest du hier auch mit 55, KQo oder AA wählen.',
        },
        {
          heading: 'Warum Open-Limpen fast immer ein Fehler ist',
          body:
            'Open-Limpen – als Erster nur den Big Blind callen – ist in fast allen Situationen ein Leak. Die Gründe:\n\n- **Keine Fold Equity:** Du kannst den Pot nicht sofort gewinnen. Ein Raise gewinnt regelmäßig die Blinds kampflos, ein Limp nie.\n- **Keine Initiative:** Postflop hat niemand die Story des Aggressors. Deine C-Bets fehlen, deine Range wirkt schwach, und genau so wird sie auch behandelt.\n- **Du lädst Angriffe ein:** Gute Spieler raisen Limper konsequent an (Isolation). Du zahlst dann entweder zu viel für eine schwache Hand oder wirfst deinen Limp weg.\n- **Multiway-Pötte:** Limps produzieren Pötte mit vielen Spielern, in denen deine mittelstarken Hände massiv an Wert verlieren.\n- **Deine Range ist gecappt:** Da du starke Hände raisen würdest, signalisiert ein Limp fast immer Schwäche.\n\nDie einzige nennenswerte Ausnahme im Cash Game: Der Small Blind darf gegen den Big Blind in manchen Strategien einen Teil seiner Range limpen (Complete), weil er nur einen halben Blind nachlegen muss. Für den Anfang gilt trotzdem die einfache Regel: **Wenn niemand vor dir drin ist – raise oder folde.**',
        },
      ],
      takeaways: [
        'Wenn alle vor dir folden, gibt es nur zwei gute Optionen: Open-Raise oder Fold.',
        'Ranges werden mit der Position breiter: UTG ca. 15–18 %, Button ca. 40–48 %.',
        'Standard-Sizing: online 2,2–3bb, live 3–5bb – immer dieselbe Größe für die gesamte Range einer Position.',
        'Open-Limpen verschenkt Fold Equity und Initiative und lädt Isolation-Raises ein.',
        'Position ist der wichtigste Faktor deiner Preflop-Entscheidung – wichtiger als die genauen Karten am Rand der Range.',
      ],
      quiz: [
        {
          question: 'Alle folden zu dir am Button. Welche Aussage beschreibt die moderne Standardstrategie?',
          options: [
            'Mit starken Händen raisen, mit spekulativen Händen limpen',
            'Etwa 40–48 % der Hände raisen, den Rest folden',
            'Nur etwa 20 % raisen, weil noch drei Spieler hinter dir sitzen',
            'Fast jede Hand spielen, weil der Button die beste Position ist',
          ],
          correctIndex: 1,
          explanation:
            'Am Button gilt raise-or-fold mit einer breiten Range von rund 40–48 %. Limpen verschenkt Initiative, und 100 % zu spielen wäre gegen kompetente Blinds klar verlustbringend.',
        },
        {
          question: 'Warum kann der Button so viel breiter öffnen als UTG?',
          options: [
            'Weil der Button zuletzt die Karten bekommt',
            'Weil nur noch zwei Gegner übrig sind und der Button postflop immer in Position spielt',
            'Weil die Blinds am Button verpflichtet sind zu folden',
            'Weil der Button kleinere Raises machen darf',
          ],
          correctIndex: 1,
          explanation:
            'Weniger verbleibende Gegner bedeutet seltener eine starke Hand hinter dir, und garantierte Position postflop macht jede Hand profitabler spielbar.',
        },
        {
          question: 'Was ist ein typisches Online-Open-Sizing in einem 6-max Cash Game mit 100bb?',
          options: [
            '1bb (Limp)',
            '2,2–2,5bb',
            '4–5bb',
            'Immer genau 3,5bb, unabhängig von der Position',
          ],
          correctIndex: 1,
          explanation:
            'Online sind 2,2–3bb Standard, sehr häufig 2,5bb. 4–5bb ist eher ein Live-Sizing, wo Spieler deutlich looser callen.',
        },
        {
          question: 'Welcher Grund spricht NICHT gegen Open-Limpen?',
          options: [
            'Ein Limp kann den Pot nicht sofort gewinnen',
            'Ein Limp verschenkt die Initiative für den Flop',
            'Ein Limp hält den Pot klein und spart damit langfristig automatisch Geld',
            'Ein Limp lädt Gegner zu Isolation-Raises ein',
          ],
          correctIndex: 2,
          explanation:
            'Der kleine Pot ist kein Vorteil: Du verlierst zwar wenig pro Hand, gewinnst aber auch fast nie etwas und gibst alle strategischen Vorteile ab. Die anderen drei Punkte sind echte Nachteile des Limpens.',
        },
        {
          question: 'Du hältst KTo Under the Gun in 6-max. Was ist das Standardspiel?',
          options: [
            'Fold – die Hand liegt außerhalb der UTG-Range von ca. 15–18 %',
            'Open-Raise – jeder Broadway ist von überall spielbar',
            'Limp, um günstig einen Flop zu sehen',
            'Open-Raise auf 5bb, um die Hand zu schützen',
          ],
          correctIndex: 0,
          explanation:
            'KTo ist gegen die Ranges, die einen UTG-Raise bekämpfen, zu oft dominiert (AK, KQ, KJ, TT+). Aus UTG ist Fold Standard; am Button wäre dieselbe Hand ein klarer Raise.',
        },
      ],
    },
    {
      id: 'm2-l3',
      title: '3-Bets richtig einsetzen',
      duration: 11,
      intro:
        'Die 3-Bet – ein Reraise gegen einen Open-Raise – ist eine der profitabelsten Waffen im modernen Spiel. Wer nur mit Assen und Königen 3-bettet, ist leicht zu lesen; wer wahllos 3-bettet, verbrennt Geld. Diese Lektion zeigt dir die Balance.',
      sections: [
        {
          heading: 'Was eine 3-Bet leistet',
          body:
            'Eine **3-Bet** ist der zweite Raise preflop: Der Open-Raise zählt als zweite Bet (nach dem Big Blind als erster), dein Reraise ist die dritte – daher der Name.\n\nEine gute 3-Bet arbeitet auf mehreren Ebenen gleichzeitig:\n\n- **Value:** Mit starken Händen wächst der Pot, solange du die Equity-Führung hast. AA in einem 3-Bet-Pot gewinnt im Schnitt deutlich mehr als AA in einem Single-Raised Pot.\n- **Fold Equity:** Ein großer Teil der Open-Ranges deiner Gegner kann eine 3-Bet nicht profitabel weiterspielen. Du gewinnst den Pot oft sofort – inklusive des Open-Raises.\n- **Isolation:** Du drängst die Spieler hinter dir aus dem Pot und spielst den Flop meist heads-up mit Initiative und klarem Plan.\n- **Schutz deiner Calling-Range:** Wer nie 3-bettet, erlaubt Gegnern, sehr breit und sorglos zu openen.\n\nAls grobe Orientierung: Solide 6-max-Spieler 3-betten insgesamt etwa 7–10 % ihrer Hände, abhängig von Position und Gegner. Deutlich weniger bedeutet fast immer: zu passiv.',
        },
        {
          heading: 'Value-3-Bets: der Kern',
          body:
            'Das Fundament jeder 3-Bet-Range sind die **Value-Hände**: Hände, die gegen die Continue-Range des Openers (also Calls und 4-Bets) vorne liegen. Der unumstrittene Kern ist **QQ+ und AK** – diese Hände 3-bettest du gegen praktisch jeden Open aus jeder Position.\n\nWie weit du die Value-Range darüber hinaus ausdehnst, hängt von der Range des Openers ab. Gegen einen tighten UTG-Open (ca. 15–18 %) bleibt es beim Kern, denn Hände wie AQ oder JJ liegen gegen die UTG-Continue-Range oft nur knapp vorne oder hinten. Gegen einen Button-Open (40 %+) sieht die Welt anders aus: Jetzt sind auch TT, 99, AQ, AJs und KQs klare Value-3-Bets, weil der Opener mit viel schwächerem Material weiterspielen muss.\n\nEin verbreiteter Anfängerfehler ist das **Slowplay von Premiums**: nur callen mit AA oder KK, um die Hand zu verstecken. Das kostet doppelt – du verpasst Value, wenn du vorne liegst, und du lässt Hände günstig mitspielen, die dich auf vielen Flops überholen. Baue den Pot auf, solange du die beste Hand hast.',
          example:
            'CO opent auf 2,5bb, du sitzt am BTN mit A♣ Q♠. Gegen die CO-Range von ca. 25–28 % ist AQo eine profitable Value-3-Bet auf etwa 7,5–8bb. Gegen einen UTG-Open wäre dieselbe Hand eher ein Call oder sogar ein Fold.',
        },
        {
          heading: 'Bluff-3-Bets und die Macht der Blocker',
          body:
            'Würdest du nur QQ+/AK 3-betten, könnten deine Gegner perfekt reagieren: fold gegen deine 3-Bet, weiter geht es. Deshalb mischst du **Bluff-3-Bets** bei – und wählst sie nicht zufällig, sondern nach zwei Kriterien: Blocker und Spielbarkeit.\n\nDer Prototyp ist **A5s** (und ähnliche Hände wie A4s, A3s, A2s). Das Ass ist ein **Blocker**: Wenn du ein Ass hältst, sinkt die Zahl der AA-Combos deines Gegners von 6 auf 3 und die der AK-Combos von 16 auf 12. Genau die Hände, die dich am liebsten bekämpfen würden, sind seltener geworden – deine 3-Bet erzeugt öfter einen Fold.\n\nDazu kommt die Spielbarkeit: Wirst du gecallt, kann A5s einen Nut Flush machen, mit der 5 eine Wheel-Straight (A-2-3-4-5) treffen und mit dem Ass-Paar zumindest gelegentlich am Showdown gewinnen. Vergleiche das mit einer Hand wie 96o, die nach einem Call fast immer chancenlos ist.\n\nWeitere gute Bluff-Kandidaten, je nach Situation: suited Connectors wie 76s, suited Broadways wie KJs am Rand deiner Continue-Range, und suited Kings wie K6s gegen sehr breite Opens.',
          cards: ['Ah', '5h'],
          tip: 'Wähle Bluff-3-Bets aus Händen, die knapp zu schwach zum Callen sind. Deine klaren Calls (z. B. 99, AJs in Position) callst du weiter – so verlieren beide Teile deiner Strategie nichts.',
        },
        {
          heading: 'Linear vs. polarisiert',
          body:
            'Es gibt zwei Grundtypen von 3-Bet-Ranges:\n\n- **Linear (merged):** Du 3-bettest deine besten Hände von oben nach unten – etwa QQ+, AK, dann JJ, TT, AQ, AJs, KQs und so weiter. Es gibt kaum reine Bluffs, nur ein Kontinuum von stark bis solide.\n- **Polarisiert:** Deine 3-Bet-Range besteht aus zwei Blöcken – Premiums oben, Bluffs wie A5s unten. Die mittelstarken Hände (99, AJs, KQs, JTs) landen stattdessen in deiner **Calling-Range**.\n\nDie Wahl folgt einer einfachen Regel: **Hast du eine Calling-Range, polarisiere. Hast du keine, spiele linear.** In Position gegen einen Open kannst du gut mit mittelstarken Händen callen – also 3-bettest du polarisiert. Im Small Blind dagegen ist Callen unattraktiv (du bist postflop immer out of position, und der Big Blind kann squeezen), deshalb spielen viele dort raise-or-fold mit einer eher linearen 3-Bet-Range.\n\nAuch der Gegnertyp zählt: Gegen Spieler, die auf 3-Bets zu oft callen, verschiebst du dich Richtung linear – mehr solide Value-Hände, weniger Bluffs, denn deine Bluffs bekommen keine Folds. Gegen Spieler, die zu oft folden, darfst du polarisierter und bluff-lastiger werden.',
        },
        {
          heading: 'Das richtige 3-Bet-Sizing',
          body:
            'Die bewährte Faustregel: **in Position etwa 3x, out of position etwa 4x die Größe des Opens.**\n\nWarum der Unterschied? Out of position brauchst du mehr Fold Equity und willst dem Opener schlechtere Odds und schlechtere Spielbarkeit für seinen Call geben – schließlich hat er postflop den Positionsvorteil. In Position darfst du etwas kleiner bleiben: Wirst du gecallt, spielst du den Flop mit Positionsvorteil und Initiative, ein sehr profitables Setup.\n\nWichtig wie beim Open-Raise: **Ein Sizing für die gesamte Range.** Wer mit AA auf 12bb und mit A5s auf 8bb 3-bettet, schenkt aufmerksamen Gegnern eine Anleitung zum Gegenspiel.\n\nZwei praktische Anpassungen: Sitzen zwischen Opener und dir bereits Caller, vergrößerst du das Sizing (siehe Squeeze in Lektion 5). Und bei tieferen Stacks als 100bb darf die 3-Bet ebenfalls etwas wachsen, damit die Stack-to-Pot-Ratio – das Verhältnis von Reststack zu Potgröße – für deine starken Hände günstig bleibt. Als Kontrolle hilft der Blick auf den Gegner: Callt er deine 3-Bets mit offensichtlich zu schwachen Händen, ist dein Sizing eher zu klein als zu groß.',
          table: {
            headers: ['Situation', 'Open-Größe', '3-Bet-Größe (ca.)'],
            rows: [
              ['In Position (z. B. BTN vs. CO)', '2,5bb', '7,5–8bb (~3x)'],
              ['Out of Position (z. B. BB vs. BTN)', '2,5bb', '10–11bb (~4x)'],
              ['Live, in Position', '4bb', '12–14bb (~3x)'],
            ],
          },
        },
        {
          heading: 'Wenn du selbst ge-3-bettet wirst',
          body:
            'Früher oder später trifft es dich: Du openst, hinter dir kommt die 3-Bet. Jetzt gilt die Grundlogik **4-Bet / Call / Fold**:\n\n- **4-Bet for Value:** KK und AA immer, QQ und AK je nach Gegner und Positionen. Sizing: etwa das 2,2–2,5-fache der 3-Bet, out of position eher etwas größer.\n- **4-Bet als Bluff:** Wieder sind Blocker-Hände wie A5s ideal – sie blocken AA/AK und haben Equity, falls es doch zum Showdown kommt. Sparsam einsetzen.\n- **Call:** Hände, die gut gegen die 3-Bet-Range spielen, vor allem in Position – z. B. TT, 99, AQs, KQs, JTs. Out of position callst du deutlich tighter.\n- **Fold:** Der Rest – und das ist völlig in Ordnung. Der untere Teil deiner Open-Range (etwa A9o oder K7s vom Button) hat gegen eine 3-Bet nichts verloren. Grob die Hälfte deiner Opens darf gegen eine 3-Bet in den Muck.\n\nDer häufigste Fehler ist das zu breite Callen out of position: Du zahlst 8–10bb, um dann ohne Position und ohne Initiative einen Flop zu spielen, den du in zwei Dritteln der Fälle verfehlst. Diszipliniertes Folden ist hier bares Geld.',
          tip: 'Notiere dir, welche Gegner fast nie 3-betten. Gegen deren 3-Bets kannst du selbst Hände wie QQ und AK gelegentlich nur callen oder sogar folden – eine 3-Bet-Frequenz von 2–3 % bedeutet fast immer QQ+/AK.',
        },
      ],
      takeaways: [
        'Der Value-Kern jeder 3-Bet-Range ist QQ+/AK; gegen breite Opens erweiterst du ihn (TT+, AQ, gute suited Broadways).',
        'Bluff-3-Bets wählst du nach Blockern und Spielbarkeit – A5s ist der Prototyp.',
        'Mit Calling-Range polarisiert 3-betten, ohne Calling-Range (z. B. im SB) eher linear.',
        'Sizing: ca. 3x das Open in Position, ca. 4x out of position – ein Sizing für die ganze Range.',
        'Gegen 3-Bets gilt 4-Bet/Call/Fold: diszipliniert folden ist oft die profitabelste Option, besonders out of position.',
      ],
      quiz: [
        {
          question: 'Welche Hände bilden den Kern der Value-3-Bet-Range, den du gegen praktisch jeden Open spielst?',
          options: [
            'Alle Paare und alle suited Aces',
            'QQ+, AK',
            'TT+, AJ+, KQ',
            'Nur AA und KK',
          ],
          correctIndex: 1,
          explanation:
            'QQ+/AK ist der unumstrittene Kern. TT/AQ und Co. kommen erst gegen breitere Opens (z. B. vom Button) dazu; nur AA/KK wäre zu tight und zu leicht zu lesen.',
        },
        {
          question: 'Warum ist A♥ 5♥ ein besserer Bluff-3-Bet-Kandidat als 9♠ 6♦?',
          options: [
            'Weil A5s öfter ein Paar floppt',
            'Weil das Ass AA/AK blockt und die Hand gecallt Nut-Flush- und Straight-Potenzial hat',
            'Weil A5s gegen AA vorne liegt',
            'Weil suited Hände beim Bluffen mehr Fold Equity erzeugen',
          ],
          correctIndex: 1,
          explanation:
            'Der Ass-Blocker reduziert die Combos der stärksten Gegenhände (AA von 6 auf 3, AK von 16 auf 12), und die Hand bleibt nach einem Call spielbar. Die Fold Equity selbst hängt vom Sizing ab, nicht von der Suitedness.',
        },
        {
          question: 'Wann ist eine polarisierte 3-Bet-Range der linearen vorzuziehen?',
          options: [
            'Wenn du keine Calling-Range hast, etwa im Small Blind',
            'Wenn du mittelstarke Hände stattdessen callen kannst, etwa in Position gegen einen Open',
            'Immer gegen tighte Spieler aus früher Position',
            'Nur in Turnieren mit kurzen Stacks',
          ],
          correctIndex: 1,
          explanation:
            'Polarisiert heißt: Premiums plus Bluffs 3-betten, die Mitte callen. Das funktioniert nur, wenn Callen eine gute Option ist – typischerweise in Position. Ohne Calling-Range (z. B. SB) spielst du eher linear.',
        },
        {
          question: 'BTN opent auf 2,5bb, du sitzt im Big Blind mit KK. Welches 3-Bet-Sizing ist Standard?',
          options: [
            'Ca. 5bb (2x)',
            'Ca. 7,5bb (3x)',
            'Ca. 10–11bb (4x)',
            'All-in, um die Hand zu schützen',
          ],
          correctIndex: 2,
          explanation:
            'Out of position 3-bettest du größer, etwa 4x das Open. Du willst dem Button, der postflop Positionsvorteil hätte, keine attraktiven Odds für den Call geben.',
        },
        {
          question: 'Du openst 2,5bb vom CO mit A♦ 9♦, der BTN 3-bettet auf 8bb. Was ist die Standardreaktion?',
          options: [
            '4-Bet, weil das Ass AA blockt',
            'Call, weil die Hand suited ist',
            'Fold – der untere Teil der Open-Range spielt gegen 3-Bets nicht weiter',
            'Call, um den Flush zu treffen',
          ],
          correctIndex: 2,
          explanation:
            'A9s liegt am Rand der CO-Range und ist gegen eine BTN-3-Bet-Range dominiert oder hinten. Ein großer Teil deiner Opens darf gegen 3-Bets einfach folden – das ist einkalkuliert.',
        },
        {
          question: 'Was ist der häufigste Fehler beim Verteidigen gegen 3-Bets?',
          options: [
            'Zu oft 4-betten mit Premiums',
            'Out of position zu breit callen und dann ohne Position und Initiative spielen',
            'Zu oft folden mit AA',
            'Die 3-Bet-Größe des Gegners ignorieren',
          ],
          correctIndex: 1,
          explanation:
            'Breite OOP-Calls sind teuer: Du triffst die meisten Flops nicht, hast keine Initiative und musst ohne Positionsvorteil raten. Diszipliniertes Folden ist die einfachere und profitablere Lösung.',
        },
      ],
    },
    {
      id: 'm2-l4',
      title: 'Blind Defense',
      duration: 8,
      intro:
        'In den Blinds hast du bereits Geld im Pot, bevor du deine Karten kennst. Wie du dieses erzwungene Investment verteidigst, entscheidet über einen großen Teil deiner Winrate – denn in keiner anderen Position verlieren selbst gute Spieler mehr Geld.',
      sections: [
        {
          heading: 'Der Discount des Big Blind',
          body:
            'Der Big Blind hat gegenüber allen anderen Positionen einen entscheidenden Vorteil beim Verteidigen: **Du hast bereits 1bb investiert und bekommst den Call deshalb mit Rabatt.**\n\nRechnen wir es durch: Der Button opent auf 2,5bb, der Small Blind foldet. Im Pot liegen jetzt 2,5bb (Open) + 0,5bb (SB) + 1bb (dein Blind) = 4bb. Dich kostet der Call nur noch 1,5bb. Du zahlst also 1,5bb für einen Pot, der nach deinem Call 5,5bb groß ist – du brauchst nur rund **27 % Equity**, damit der Call rechnerisch aufgeht.\n\nDazu kommt ein zweiter Vorteil: Du bist der letzte Spieler, der preflop entscheidet (**Closing the Action**). Hinter dir kann niemand mehr raisen und dich aus dem Pot drängen – dein Call ist sicher.\n\nGegen ein zufälliges Blatt haben selbst schwache Hände wie 96s oder Q7o über 40 % Equity. Deshalb kann der Big Blind gegen kleine Opens erstaunlich breit verteidigen. Der Haken: Rohe Equity ist nicht alles, denn du spielst den Rest der Hand out of position – dazu gleich mehr.',
          table: {
            headers: ['BTN-Open', 'Dein Call', 'Pot nach Call', 'Benötigte Equity'],
            rows: [
              ['2bb', '1bb', '4,5bb', '~22 %'],
              ['2,5bb', '1,5bb', '5,5bb', '~27 %'],
              ['3bb', '2bb', '6,5bb', '~31 %'],
            ],
          },
        },
        {
          heading: 'Die Defend-Range gegen einen Button-Open',
          body:
            'Gegen einen 2,5bb-Open vom Button verteidigt der Big Blind in der modernen Theorie sehr breit: **insgesamt rund die Hälfte aller Hände**, aufgeteilt in 3-Bets und Calls.\n\n- **3-Bet (ca. 10–15 %):** Polarisiert – Value mit QQ+/AK, gegen die breite Button-Range auch TT/JJ, AQ und gute suited Broadways, dazu Bluffs wie A5s–A2s, K9s oder suited Connectors.\n- **Call (ca. 30–40 %):** Der breite Mittelbau – Paare, suited Hände fast jeder Art, verbundene Karten, Broadways, viele Ax-Hände. Suited Hände wie 86s oder J7s sind dank Pot Odds klare Defends.\n- **Fold:** Der unspielbare Rest – unverbundene offsuit Hände wie 92o, T4o, J3o. Auch mit Discount sind diese Hände zu schwach: Sie treffen selten und wenn, dann dominiert.\n\nDie Logik dahinter: Je kleiner das Open und je später die Position des Openers, desto breiter darfst du verteidigen. Gegen einen UTG-Open auf 3bb schrumpft deine Defend-Range deutlich zusammen – die Odds sind schlechter und die gegnerische Range ist viel stärker.',
          example:
            'BTN opent 2,5bb, du hältst im BB 8♣ 6♣. Fold wäre zu tight: Die Hand hat gut 40 % Equity gegen die Button-Range, kostet mit Discount nur 1,5bb und trifft Draws, die auch out of position spielbar sind. Standard: Call. Dieselbe Hand offsuit (8♥ 6♦) ist dagegen ein Fold.',
        },
        {
          heading: 'Small Blind: die schwierigste Position',
          body:
            'Der Small Blind ist die undankbarste Position am Tisch, und zwar aus drei Gründen:\n\n- **Immer out of position:** Postflop musst du gegen jeden Gegner zuerst handeln – auch gegen den Big Blind.\n- **Nur der halbe Discount:** Dein erzwungenes Investment beträgt 0,5bb, deine Pot Odds sind also deutlich schlechter als im Big Blind.\n- **Ein Spieler sitzt noch hinter dir:** Dein Call schließt die Action nicht ab. Der Big Blind kann squeezen, und selbst wenn er nur callt, spielst du einen Multiway-Pot aus der schlechtesten Position.\n\nDie Konsequenz der modernen Theorie: **Im Small Blind spielst du gegen Opens überwiegend raise-or-fold.** Mit deinen guten Händen 3-bettest du (eher linear, wie in Lektion 3 besprochen), der Rest foldet. Flat Calls reduzierst du auf ein Minimum – etwa einige starke Hände, die nicht ganz zur 3-Bet reichen, gegen kleine Opens.\n\nRechne damit, in beiden Blinds langfristig Geld zu verlieren – das ist normal und unvermeidbar, weil du blind investieren musst. Dein Ziel ist nicht, die Blinds zu Gewinnpositionen zu machen, sondern **weniger zu verlieren als deine Gegner in derselben Situation**.',
          tip: 'Wenn alle zu dir im Small Blind folden, gilt das Gegenteil von Vorsicht: Gegen nur noch einen Gegner openst du breit (grob 40–50 %), am besten auf 3–3,5bb. Viele Spieler folden im Big Blind viel zu oft gegen SB-Opens.',
        },
        {
          heading: 'Nicht überverteidigen: Equity ist nicht gleich Gewinn',
          body:
            'Die Pot-Odds-Rechnung von oben hat einen Haken: Sie unterstellt, dass du deine Equity vollständig **realisierst** – also so oft gewinnst, wie es deine rohe Gewinnwahrscheinlichkeit verspricht. Out of position gelingt das nicht.\n\nOhne Position gibst du auf jeder Street zuerst Information preis, kannst schlechter bluffen, wirst öfter von Bets aus guten Draws gedrängt und gewinnst mit Marginalhänden kleinere Pötte. Eine Hand wie J4o mag gegen die Button-Range 35 % rohe Equity haben – realisieren wirst du davon out of position nur einen Teil, und die Hand wird zum Verlustgeschäft, obwohl die Pot Odds sie scheinbar rechtfertigen.\n\nDaraus folgen drei praktische Regeln:\n\n- **Suited schlägt offsuit deutlich:** Suited Hände realisieren ihre Equity besser, weil sie öfter starke, klar spielbare Draws treffen. Verteidige suited großzügig, offsuit-Schrott diszipliniert folden.\n- **Verbundenheit zählt:** 76s ist ein klarer Defend, 72s nicht.\n- **Gegen größere Opens tighter werden:** Gegen 3bb+ und gegen frühe Positionen schrumpft deine Defend-Range erheblich.\n\nÜberverteidigen aus Prinzip („ich habe doch Odds") ist einer der teuersten Leaks im Big Blind. Die Odds sind ein notwendiges, aber kein hinreichendes Argument.',
        },
      ],
      takeaways: [
        'Der Big Blind verteidigt mit Discount: Gegen ein 2,5bb-Open brauchst du nur rund 27 % Equity für den Call.',
        'Gegen einen Button-Open verteidigt der BB etwa die Hälfte aller Hände – per Call und polarisierter 3-Bet.',
        'Der Small Blind ist die schwierigste Position: immer out of position, halber Discount, ein Spieler hinter dir – deshalb überwiegend raise-or-fold.',
        'Out of position realisierst du deine Equity nur teilweise: Verteidige suited und verbundene Hände, folde offsuit-Schrott trotz Odds.',
        'In den Blinds Geld zu verlieren ist normal – dein Ziel ist, weniger zu verlieren als der Durchschnitt.',
      ],
      quiz: [
        {
          question: 'BTN opent auf 2,5bb, SB foldet. Wie viel Equity brauchst du im Big Blind ungefähr für einen profitablen Call (reine Pot Odds)?',
          options: [
            '~15 %',
            '~27 %',
            '~38 %',
            '~50 %',
          ],
          correctIndex: 1,
          explanation:
            'Du zahlst 1,5bb in einen Pot, der nach deinem Call 5,5bb enthält: 1,5 / 5,5 ≈ 27 %. Dein bereits gesetzter Blind gehört zum Pot und zählt nicht mehr als deine Investition.',
        },
        {
          question: 'Welche zwei Faktoren erlauben dem Big Blind, so breit zu verteidigen?',
          options: [
            'Position postflop und Initiative',
            'Der 1bb-Discount und das Schließen der Action (niemand kann hinter dir raisen)',
            'Die Möglichkeit zu squeezen und der halbe Blind',
            'Die Fold Equity und das Nut-Potenzial',
          ],
          correctIndex: 1,
          explanation:
            'Der bereits gesetzte Blind verbilligt den Call, und als letzter Entscheider riskierst du kein Reraise mehr. Position und Initiative hat der BB nach einem Call gerade nicht.',
        },
        {
          question: 'Warum gilt der Small Blind als schwierigste Position?',
          options: [
            'Weil er die höchste Pflichtabgabe zahlt',
            'Weil er postflop immer zuerst handeln muss, nur den halben Discount hat und der BB noch hinter ihm sitzt',
            'Weil er nie 3-betten darf',
            'Weil seine Range gecappt ist',
          ],
          correctIndex: 1,
          explanation:
            'Diese Kombination – garantiert out of position, schlechtere Odds als der BB, Action nicht geschlossen – macht Flat Calls unattraktiv und führt zur Raise-or-Fold-Tendenz.',
        },
        {
          question: 'BTN opent 2,5bb. Welche Hand ist im Big Blind der klarste Fold?',
          options: [
            '8♠ 6♠',
            'J♣ 3♦',
            '5♥ 5♦',
            'K♦ 9♦',
          ],
          correctIndex: 1,
          explanation:
            'J3o ist unverbunden, offsuit und trifft fast nur dominierte Paare – solche Hände realisieren out of position viel zu wenig Equity. 86s, 55 und K9s sind dagegen Standard-Defends.',
        },
        {
          question: 'Was übersieht die Aussage „Ich habe Pot Odds, also muss ich callen" im Big Blind?',
          options: [
            'Dass der Pot durch Rake kleiner wird',
            'Dass rohe Equity out of position nur teilweise realisiert wird',
            'Dass der Button immer stärker ist als der Big Blind',
            'Dass man im Big Blind grundsätzlich raisen sollte',
          ],
          correctIndex: 1,
          explanation:
            'Ohne Position gewinnst du mit Marginalhänden seltener und weniger, als die rohe Equity verspricht. Pot Odds sind notwendig, aber nicht hinreichend – Spielbarkeit entscheidet mit.',
        },
      ],
    },
    {
      id: 'm2-l5',
      title: 'Isolation, Squeeze & Multiway',
      duration: 9,
      intro:
        'Nicht jeder Pot beginnt mit einem sauberen Open-Raise. Limper, Caller und mehrere Gegner verändern die Lage grundlegend – und wer die richtigen Werkzeuge kennt, macht aus diesen unordentlichen Situationen Profit.',
      sections: [
        {
          heading: 'Limper isolieren',
          body:
            'Wenn ein oder mehrere Spieler vor dir limpen, ist die Standardantwort mit spielbaren Händen der **Isolation-Raise** (kurz: Iso-Raise). Du raist größer als üblich, um den Pot möglichst heads-up gegen den Limper zu spielen – mit Initiative, Position und der stärkeren Range.\n\nDie bewährte Sizing-Formel online: **3bb plus 1bb pro Limper.** Ein Limper: Raise auf 4bb. Zwei Limper: 5bb. Bist du out of position, addierst du noch etwa 1bb dazu. Live skalierst du entsprechend der größeren Standard-Opens hoch – gegen einen Limper sind dort 5–6bb üblich, in callfreudigen Runden mehr.\n\nWarum größer als ein normales Open? Der Limper hat bereits investiert und bekommt dadurch bessere Odds für den Call. Mit einem zu kleinen Raise erreichst du nichts: Alle callen, und du spielst einen Multiway-Pot ohne echten Vorteil.\n\nDeine Iso-Range ist breiter als deine normale Open-Range in derselben Position, denn Limper signalisieren meist schwache, passive Ranges – starke Hände hätten sie geraist. Gute Kandidaten: alle Hände deiner normalen Open-Range plus zusätzliche Broadways und suited Hände, die von der schwachen Limper-Range profitieren.',
          example:
            'Online 6-max, ein Spieler limpt aus dem HJ, du sitzt am BTN mit K♠ J♠. Standard: Iso-Raise auf 4bb (3bb + 1 pro Limper). Callt nur der Limper, spielst du den Flop in Position, mit Initiative und gegen eine Range, die fast nie eine Premium-Hand enthält.',
        },
        {
          heading: 'Das Squeeze-Play',
          body:
            'Ein **Squeeze** ist eine 3-Bet, nachdem ein Spieler geopent hat und mindestens ein weiterer den Open gecallt hat. Der Name beschreibt das Prinzip: Die Gegner werden in die Zange genommen.\n\nDie Situation ist für eine große 3-Bet ideal, weil beide Gegner unter Druck stehen:\n\n- **Der Opener** muss fürchten, dass hinter ihm noch der Caller lauert – er kann nicht einfach breit callen und braucht gegen deine große Bet eine echte Hand.\n- **Der Caller** hat durch seinen Call bereits Schwäche gezeigt: Seine stärksten Hände (QQ+, AK) hätte er meist selbst ge-3-bettet. Seine Range ist **gecappt** und foldet oft.\n\nDazu kommt: Es liegt bereits deutlich mehr Geld im Pot als bei einer normalen 3-Bet – du gewinnst sofort mehr, wenn beide folden.\n\nBeim Sizing musst du den Caller einpreisen. Faustregel: **etwa 4x das Open in Position, 5x out of position, plus rund ein Open pro zusätzlichem Caller.** Beispiel: Open 2,5bb, ein Caller, du squeezt in Position auf etwa 10–11bb, aus dem Big Blind eher auf 12–13bb. Zu kleine Squeezes sind ein klassischer Fehler – sie geben beiden Gegnern gute Odds, und plötzlich spielst du einen aufgeblähten Multiway-Pot.\n\nDeine Squeeze-Range baust du wie eine polarisierte 3-Bet-Range: Value mit QQ+/AK (gegen loose Gegner breiter), Bluffs mit Blocker-Händen wie A5s.',
          tip: 'Squeeze-Bluffs funktionieren am besten, wenn der Opener aus später Position kommt (breite Range) und der Caller als loose-passiv bekannt ist. Gegen einen UTG-Open plus Call eines tighten Spielers squeezt du fast nur for Value.',
        },
        {
          heading: 'Wie Multiway-Pötte Handwerte verschieben',
          body:
            'Sobald drei oder mehr Spieler den Flop sehen, verschieben sich die Handwerte fundamental. Der Grund ist einfache Mathematik: **Deine Equity sinkt mit jedem zusätzlichen Gegner**, weil mehr Hände dich schlagen können. AA gewinnt heads-up gegen eine zufällige Hand rund 85 % – gegen vier zufällige Hände nur noch etwa 56 %.\n\nNoch wichtiger ist die Verschiebung der **relativen** Werte:\n\n- **Nut-Potenzial gewinnt:** Hände, die die bestmögliche Hand machen können, steigen im Wert – kleine Paare (Set), suited Aces (Nut Flush), suited Connectors (Straights). In großen Multiway-Pötten wird am Ende oft eine sehr starke Hand gezeigt; du willst diejenige halten, die gewinnt.\n- **Marginales verliert:** Offsuit Broadways wie KJo oder QTo leben von Top Pair mit gutem Kicker. Heads-up reicht das oft – gegen vier Gegner ist Top Pair häufig nur die zweitbeste Hand, und du verlierst genau dann viel, wenn du triffst (Reverse Implied Odds).\n- **Kleine Flushes und Dominiertes werden gefährlich:** Mit 96s einen Flush zu treffen, wenn drei Gegner ebenfalls suited Hände halten können, ist ein klassisches Setup für große Verluste.\n\nMerksatz: **Heads-up gewinnt oft das beste Paar – multiway gewinnt die beste Hand.** Spiele multiway also Hände, die Nuts machen können, und sei vorsichtig mit allem, was nur ein gutes Paar produziert.',
          cards: ['Ad', '4d', 'Kh', 'Jc'],
        },
        {
          heading: 'Praktische Anpassungen für Multiway-Pötte',
          body:
            'Aus der verschobenen Wertelandschaft folgen konkrete Regeln für dein Spiel, sobald ein Pot multiway wird:\n\n- **Bluffe deutlich seltener:** Ein Bluff muss jeden einzelnen Gegner zum Folden bringen. Bei drei Gegnern, die je 50 % folden, klappt das nur in 12,5 % der Fälle. Auch die klassische C-Bet ohne Treffer verliert multiway massiv an Wert.\n- **Value-Bette stärker, aber ehrlicher:** Deine Value-Range wird enger – Top Pair mit schwachem Kicker ist multiway selten eine Value-Bet. Wenn du aber bettest, wirst du öfter ausbezahlt, weil bei mehreren Gegnern öfter jemand etwas hält.\n- **Respektiere Aggression:** Ein Raise in einem Multiway-Pot repräsentiert fast immer eine sehr starke Range. Gegen mehrere Gegner blufft kaum jemand – glaube der Story öfter als heads-up.\n- **Preflop vorbeugen:** Die beste Multiway-Anpassung passiert vor dem Flop – mit ausreichend großen Iso-Raises und Squeezes verhinderst du unübersichtliche Familienpötte, bevor sie entstehen.\n\nUnd ein Wort zur Selbstkontrolle: Multiway-Pötte mit vielen Limpern und Callern fühlen sich nach Action und leichtem Geld an. Bleib bei deinen Kriterien – Nut-Potenzial, Position, klarer Plan – statt mit jeder hübschen Hand mitzugehen. Diszipliniertes Passen ist auch hier die häufigste richtige Antwort.',
          tip: 'Frag dich in jedem Multiway-Pot vor dem Einstieg: Welche Hand will ich am Ende zeigen? Wenn die realistische Antwort „ein Paar mit gutem Kicker" lautet, ist Vorsicht angebracht.',
        },
      ],
      takeaways: [
        'Gegen Limper isolierst du mit spielbaren Händen: online 3bb + 1bb pro Limper, out of position und live größer.',
        'Ein Squeeze ist eine 3-Bet nach Open und mindestens einem Call – groß sizen (ca. 4x IP / 5x OOP plus ein Open pro Extra-Caller), weil die Caller-Range gecappt ist.',
        'Multiway sinkt deine Equity mit jedem Gegner – Nut-Potenzial (Sets, Nut Flushes, Straights) gewinnt, marginale Top-Pair-Hände verlieren an Wert.',
        'Multiway bluffst du seltener, value-bettest ehrlicher und respektierst Raises deutlich mehr.',
        'Die beste Multiway-Anpassung ist Prävention: ausreichend große Iso-Raises und Squeezes schon preflop.',
      ],
      quiz: [
        {
          question: 'Zwei Spieler limpen, du willst am Button mit A♠ Q♦ isolieren. Welches Online-Sizing ist Standard?',
          options: [
            '2,5bb wie ein normales Open',
            '4bb',
            '5bb',
            '8bb',
          ],
          correctIndex: 2,
          explanation:
            'Die Formel lautet 3bb + 1bb pro Limper: bei zwei Limpern also 5bb. Ein normales Open-Sizing gäbe beiden Limpern zu gute Odds für den Call.',
        },
        {
          question: 'Was macht ein Squeeze-Play aus?',
          options: [
            'Ein Raise gegen mehrere Limper',
            'Eine 3-Bet, nachdem ein Open bereits mindestens einen Caller gefunden hat',
            'Eine 4-Bet aus den Blinds',
            'Ein All-in mit einem Draw',
          ],
          correctIndex: 1,
          explanation:
            'Squeeze = 3-Bet gegen Open plus Caller. Die Zangenwirkung entsteht, weil der Opener den Caller hinter sich fürchten muss und die Caller-Range gecappt ist.',
        },
        {
          question: 'Warum ist die Range des Callers in einer Squeeze-Situation typischerweise gecappt?',
          options: [
            'Weil er out of position sitzt',
            'Weil er seine stärksten Hände (QQ+, AK) meist selbst ge-3-bettet hätte statt nur zu callen',
            'Weil Caller grundsätzlich schwache Spieler sind',
            'Weil er weniger Chips investiert hat als der Opener',
          ],
          correctIndex: 1,
          explanation:
            'Ein Flat Call schließt die Top-Hände weitgehend aus der Range aus – genau deshalb foldet der Caller gegen einen großen Squeeze so oft.',
        },
        {
          question: 'Welche Hand gewinnt in einem Pot mit vier Spielern am meisten an relativem Wert?',
          options: [
            'K♥ J♦',
            'A♦ 4♦',
            'Q♠ T♥',
            'A♣ 8♥',
          ],
          correctIndex: 1,
          explanation:
            'A4s kann den Nut Flush und die Wheel-Straight machen – echtes Nut-Potenzial. Die offsuit Broadways und Ax-Hände leben von Top Pair, das multiway oft nur die zweitbeste Hand ist.',
        },
        {
          question: 'Drei Gegner sehen mit dir den Flop, du hast mit A♣ K♦ nichts getroffen. Warum ist eine Bluff-C-Bet hier viel schwächer als heads-up?',
          options: [
            'Weil der Pot zu klein für einen Bluff ist',
            'Weil alle Gegner gleichzeitig folden müssen, was mit jedem zusätzlichen Spieler unwahrscheinlicher wird',
            'Weil AK gegen drei Gegner keine Equity mehr hat',
            'Weil C-Bets nur in Position funktionieren',
          ],
          correctIndex: 1,
          explanation:
            'Ein Bluff braucht Folds von jedem einzelnen Gegner. Folden drei Spieler je z. B. 50 %, gelingt der komplette Bluff nur in 12,5 % der Fälle. AK behält zwar Equity, aber die Fold Equity bricht ein.',
        },
      ],
    },
  ],
};

export default m2;
