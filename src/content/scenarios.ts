// Szenario-Trainer: komplette Spielsituationen mit bewerteten Optionen.
// Kontext (falls nicht anders angegeben): 6-max Cash Game, 100bb effektiv.
// quality: 'best' = beste Option (genau eine pro Szenario), 'ok' = vertretbar, 'bad' = Fehler.

export interface ScenarioOption {
  label: string;
  quality: 'best' | 'ok' | 'bad';
  explanation: string;
}

export interface Scenario {
  id: string;
  street: 'Preflop' | 'Flop' | 'Turn' | 'River' | 'Turnier';
  title: string;
  situation: string;
  heroCards: string[];
  board: string[];
  options: ScenarioOption[];
  /** Das Konzept, das dieser Spot lehrt. */
  lesson: string;
}

export const SCENARIOS: Scenario[] = [
  // ---------- Preflop ----------
  {
    id: 'pre-1',
    street: 'Preflop',
    title: 'Hübsch, aber giftig',
    situation: 'Du sitzt Under the Gun am 6-max-Tisch. Alle warten auf dich.',
    heroCards: ['Kh', 'Ts'],
    board: [],
    options: [
      {
        label: 'Fold',
        quality: 'best',
        explanation:
          'KTo aus früher Position ist ein klassisches Verlustgeschäft: Wirst du gecallt, dominiert dich oft ein besseres K (KQ, AK) oder ein besseres T. Solche „hübschen“ Offsuit-Hände gehören vorne in den Muck.',
      },
      {
        label: 'Raise auf 2,5bb',
        quality: 'bad',
        explanation:
          'Aus früher Position warten noch fünf Spieler hinter dir – die Wahrscheinlichkeit, dass jemand eine dominierende Hand hält, ist hoch. KTo eröffnest du erst ab dem Cutoff.',
      },
      {
        label: 'Limp (nur mitgehen)',
        quality: 'bad',
        explanation:
          'Open-Limpen ist fast immer die schlechteste Wahl: Du gewinnst den Pot nie sofort, spielst einen aufgeblähten Multiway-Pot ohne Initiative und machst dich lesbar.',
      },
    ],
    lesson: 'Position bestimmt, welche Hände spielbar sind – Offsuit-Broadways ohne Ass sind früh reine Trap-Hände.',
  },
  {
    id: 'pre-2',
    street: 'Preflop',
    title: 'Kleines Paar, großer Plan',
    situation: 'Ein solider Spieler eröffnet Under the Gun auf 2,5bb. Du sitzt im Hijack, beide habt ihr volle 100bb.',
    heroCards: ['6c', '6d'],
    board: [],
    options: [
      {
        label: 'Call (Set-Mining)',
        quality: 'best',
        explanation:
          'Mit 100bb Stacks lohnt sich der Call perfekt: Du triffst am Flop in ~12 % dein Set und gewinnst dann oft einen großen Pot gegen sein Overpair oder Top Pair. Die 15x-Regel ist locker erfüllt.',
      },
      {
        label: '3-Bet auf 8bb',
        quality: 'bad',
        explanation:
          'Eine 3-Bet mit 66 gegen eine frühe Open-Range spielt einen aufgeblähten Pot mit einer Hand, die fast nie vorne liegt, wenn viel Geld reingeht. Gegen 4-Bets musst du folden, gegen Calls spielst du raten.',
      },
      {
        label: 'Fold',
        quality: 'ok',
        explanation:
          'Nicht falsch, wenn die Stacks kurz wären oder aggressive Spieler hinter dir squeezen. Mit tiefen Stacks verschenkst du aber einen der profitabelsten Standard-Spots im Poker.',
      },
    ],
    lesson: 'Set-Mining: kleines Paar + tiefe Stacks + wahrscheinlich starke Gegner-Range = Traumkombination.',
  },
  {
    id: 'pre-3',
    street: 'Preflop',
    title: 'Die Falle, die keine ist',
    situation: 'Du bekommst Under the Gun das beste Blatt im Poker. Am Tisch wird viel gecallt.',
    heroCards: ['As', 'Ah'],
    board: [],
    options: [
      {
        label: 'Raise auf 3bb',
        quality: 'best',
        explanation:
          'Mit Assen willst du den Pot aufbauen, solange du sicher vorne bist. An Call-freudigen Tischen wirst du fast immer bezahlt – die „Falle“ mit Limpen ist unnötig und gefährlich.',
      },
      {
        label: 'Limpen und auf einen Raise hoffen',
        quality: 'bad',
        explanation:
          'Der klassische Anfängertrick funktioniert selten: Meist limpen alle hinterher, und du spielst AA gegen fünf zufällige Hände – genau das Szenario, in dem Asse am häufigsten verlieren.',
      },
      {
        label: 'Gleich All-in',
        quality: 'bad',
        explanation:
          '100bb All-in preflop foldet alles außer KK/AA – du gewinnst nur die Blinds. Maximaler Einsatz, minimaler Gewinn: das Gegenteil von Value.',
      },
    ],
    lesson: 'Starke Hände wollen wachsende Pötte: normal raisen und den Gegnern jede Straße Gelegenheit zum Bezahlen geben.',
  },
  {
    id: 'pre-4',
    street: 'Preflop',
    title: 'Könige unter Druck setzen',
    situation: 'Der Cutoff eröffnet auf 2,5bb, du sitzt am Button.',
    heroCards: ['Kd', 'Kc'],
    board: [],
    options: [
      {
        label: '3-Bet auf ca. 8bb',
        quality: 'best',
        explanation:
          'KK ist die zweitbeste Starthand – du willst Value von schlechteren Händen (AK, QQ, AQ, Bluffs), den Pot vergrößern und die Blinds aus dem Pot drängen. In Position ist ~3x der Standard.',
      },
      {
        label: 'Nur callen',
        quality: 'ok',
        explanation:
          'Gelegentlich als Trap gegen sehr aggressive Spieler vertretbar, aber du lässt die Blinds billig mitspielen und der Pot bleibt klein, wenn du gewinnst. Als Standard verschenkst du Geld.',
      },
      {
        label: 'Fold – „er hat bestimmt Asse“',
        quality: 'bad',
        explanation:
          'KK preflop zu folden ist ein legendärer Fehler. Die Wahrscheinlichkeit, dass genau jetzt jemand AA hält, ist winzig – gegen eine normale Open-Range bist du haushoher Favorit.',
      },
    ],
    lesson: 'Mit Premium-Händen aggressiv Value aufbauen – Angst vor dem Monster unter dem Bett kostet langfristig am meisten.',
  },
  {
    id: 'pre-5',
    street: 'Preflop',
    title: 'Big-Blind-Rabatt nutzen',
    situation: 'Der Button eröffnet auf 2,5bb, der Small Blind foldet. Du sitzt im Big Blind.',
    heroCards: ['Ah', '4h'],
    board: [],
    options: [
      {
        label: 'Call',
        quality: 'best',
        explanation:
          'Du musst nur 1,5bb nachlegen, um 4,5bb zu gewinnen – hervorragende Pot Odds. A4s spielt gut: Nut-Flush-Potenzial, Wheel-Draws, Ass-Paare. Klare Verteidigung gegen eine breite Button-Range.',
      },
      {
        label: '3-Bet auf 11bb',
        quality: 'ok',
        explanation:
          'A4s ist ein legitimer 3-Bet-Bluff-Kandidat (Ass-Blocker, spielbar bei Call). Als Teilstrategie gut – aber als Standard gegen unbekannte Gegner ist der Call die einfachere, sichere Wahl.',
      },
      {
        label: 'Fold',
        quality: 'bad',
        explanation:
          'Viel zu tight: Gegen eine 40-%-Button-Range mit diesen Pot Odds foldest du eine Hand, die klar profitabel verteidigt. Wer im BB zu viel foldet, wird von Stealern zerlegt.',
      },
    ],
    lesson: 'Der Big Blind bekommt einen Rabatt – suited Asse gehören fast immer in die Verteidigung.',
  },
  {
    id: 'pre-6',
    street: 'Preflop',
    title: 'Familienpot im Homegame',
    situation: 'Lockere 9er-Runde: Drei Spieler limpen vor dir. Du sitzt im Mittelfeld.',
    heroCards: ['Qd', 'Jc'],
    board: [],
    options: [
      {
        label: 'Fold',
        quality: 'best',
        explanation:
          'QJo sieht spielbar aus, ist aber gegen vier Gegner ein Kicker-Albtraum: Triffst du dein Paar, verlierst du oft gegen besseres. Multiway gewinnen die Nut-Hände – nicht die Zweitbesten.',
      },
      {
        label: 'Mitlimpen',
        quality: 'ok',
        explanation:
          'Billig mitschauen ist nicht katastrophal, aber du spielst eine dominierte Hand ohne Initiative aus mittlerer Position. Es gibt bessere Spots.',
      },
      {
        label: 'Iso-Raise auf 6bb',
        quality: 'bad',
        explanation:
          'Gegen Limper raist du zum Isolieren mit starken Händen – QJo ist keine. In Callfreudigen Runden folden die Limper sowieso nicht: Du baust nur einen großen Pot mit einer mittelmäßigen Hand.',
      },
    ],
    lesson: 'In Multiway-Pötten zählen Nut-Potenzial und Kicker – dominierte Broadways werden teuer.',
  },
  {
    id: 'pre-7',
    street: 'Preflop',
    title: 'Suited Connectors richtig starten',
    situation: 'Alle folden zu dir in den Cutoff.',
    heroCards: ['8h', '7h'],
    board: [],
    options: [
      {
        label: 'Raise auf 2,5bb',
        quality: 'best',
        explanation:
          '87s gehört ab dem Cutoff in die Standard-Eröffnungsrange: Du kannst die Blinds sofort gewinnen, hast Position und eine Hand, die Monster (Straßen, Flushs) floppen kann, die schwer zu lesen sind.',
      },
      {
        label: 'Limp',
        quality: 'bad',
        explanation:
          'Limpen verschenkt die Chance auf die Blinds und verrät Schwäche. Wenn eine Hand gut genug zum Spielen ist, ist sie gut genug zum Raisen.',
      },
      {
        label: 'Fold',
        quality: 'ok',
        explanation:
          'Nicht dramatisch, aber zu tight: Aus später Position sind suited Connectors klar profitabel. Wer sie foldet, lässt Steal-Gewinne und versteckte Monster liegen.',
      },
    ],
    lesson: 'Späte Position eröffnet breiter – suited Connectors sind dort Raise-Kandidaten, keine Limp-Hände.',
  },
  {
    id: 'pre-8',
    street: 'Preflop',
    title: 'Der Fels erhebt sich',
    situation:
      'Du eröffnest am Button auf 2,5bb. Der tighteste Spieler des Abends – erste 4-Bet seit Stunden – erhöht aus dem Big Blind auf 12bb.',
    heroCards: ['Ac', 'Kd'],
    board: [],
    options: [
      {
        label: 'Call und Flop ansehen',
        quality: 'best',
        explanation:
          'Gegen die 4-Bet-Range eines extremen Nits (praktisch nur QQ+/AK) ist AKo maximal ein Coinflip. Der Call hält den Pot kontrolliert; du spielst weiter, wenn du ein Ass oder einen König triffst.',
      },
      {
        label: 'All-in (5-Bet-Shove)',
        quality: 'ok',
        explanation:
          'Gegen normale Gegner ist der Shove mit AKo Standard. Gegen einen Fels, der hier fast nur KK/AA hält, schiebst du aber oft als klarer Außenseiter Geld rein. Reads schlagen Standardlinien.',
      },
      {
        label: 'Fold',
        quality: 'ok',
        explanation:
          'Klingt feige, ist gegen die extremsten Nits aber diskutabel: Wenn seine Range wirklich nur KK/AA ist, liegst du fast immer weit hinten. Ein disziplinierter Exploit – nur nicht zu oft.',
      },
    ],
    lesson: 'Reads verändern Standardstrategie: Gegen ultra-tighte 4-Bet-Ranges verliert sogar AK massiv an Wert.',
  },
  // ---------- Flop ----------
  {
    id: 'flop-1',
    street: 'Flop',
    title: 'Trockenes Board, kleine Bet',
    situation:
      'Du eröffnest am Button, der Big Blind callt. Pot: 5,5bb. Der Flop ist so trocken wie es geht – und trifft deine Range.',
    heroCards: ['As', 'Ks'],
    board: ['Kd', '7c', '2h'],
    options: [
      {
        label: 'C-Bet klein (ca. 1/3 Pot)',
        quality: 'best',
        explanation:
          'Top Pair Top Kicker auf trockenem Board: Es gibt kaum Draws, die du schützen musst. Eine kleine Bet holt Value von schlechteren Königen, Paaren und Ass-hoch – und hält seine schwächeren Hände im Spiel.',
      },
      {
        label: 'Check-Back',
        quality: 'ok',
        explanation:
          'Als gelegentlicher Trap-Move okay, aber du verschenkst eine von drei möglichen Value-Streets. Auf trockenen Boards verändert sich bis zum Turn selten etwas zu deinen Gunsten.',
      },
      {
        label: 'Pot-Bet',
        quality: 'bad',
        explanation:
          'Eine große Bet foldet genau die Hände raus, von denen du Geld willst (77-QQ ohne Set, K-x bleibt eh). Auf trockenen Boards gewinnen kleine Bets mehr, weil sie öfter bezahlt werden.',
      },
    ],
    lesson: 'Bet-Sizing folgt der Board-Textur: trocken = klein und häufig, nass = groß und selektiv.',
  },
  {
    id: 'flop-2',
    street: 'Flop',
    title: 'Overpair im Minenfeld',
    situation:
      'Multiway-Pot mit drei Spielern, Pot 12bb. Ein Gegner bettet den vollen Pot, der zweite callt. Du bist als Letzter dran.',
    heroCards: ['Qc', 'Qd'],
    board: ['Js', 'Ts', '9d'],
    options: [
      {
        label: 'Fold',
        quality: 'best',
        explanation:
          'Auf J-T-9 mit zwei Pik schlägt dich bereits jede Straße (KQ, Q8, 87), zwei Paare und Sets – und genau diese Hände betten und callen hier. Dein Overpair ist auf diesem Board kaum mehr als ein Bluff-Catcher, multiway ist er geschlagen.',
      },
      {
        label: 'Call',
        quality: 'ok',
        explanation:
          'Heads-up gegen einen aggressiven Spieler wäre der Call gut. Gegen Bet UND Call auf dem nassesten aller Boards verbrennst du aber meist Geld – mindestens einer hat dich.',
      },
      {
        label: 'Raise All-in',
        quality: 'bad',
        explanation:
          'Du isolierst dich exakt gegen die Hände, die dich schlagen. Es callt keine schlechtere Hand – der klassische „Ich will es nicht wissen“-Move, der Stacks kostet.',
      },
    ],
    lesson: 'Ein Overpair ist keine Monster-Hand: Auf vernetzten Boards gegen mehrere Gegner diszipliniert loslassen.',
  },
  {
    id: 'flop-3',
    street: 'Flop',
    title: 'Nut-Draw mit Rückendeckung',
    situation:
      'Der Cutoff hat preflop eröffnet, du hast am Button gecallt. Pot 6,5bb. Er c-bettet 1/2 Pot (3,25bb).',
    heroCards: ['Ah', '9h'],
    board: ['Kh', '7h', '2c'],
    options: [
      {
        label: 'Call',
        quality: 'best',
        explanation:
          'Nut-Flushdraw (9 Outs, ~35 % bis River) plus mögliches Ass als Overcard: Gegen eine halbe Pot-Bet brauchst du nur 25 % Equity – ein komfortabler Call mit Position und großen Implied Odds.',
      },
      {
        label: 'Raise (Semi-Bluff)',
        quality: 'ok',
        explanation:
          'Aggressiv und legitim: Du gewinnst sofort, wenn er foldet, und hast einen starken Draw als Fallback. Etwas riskanter, weil du gegen eine 3-Bet in einen unangenehmen Spot gerätst.',
      },
      {
        label: 'Fold',
        quality: 'bad',
        explanation:
          'Mit dem besten Draw des Boards und exzellenten Pot Odds zu folden verschenkt massiv Equity. Nut-Draws sind Hände, mit denen du im Pot bleiben willst.',
      },
    ],
    lesson: 'Nut-Flushdraws in Position sind Geldmaschinen: mindestens callen, gern auch mal aggressiv spielen.',
  },
  {
    id: 'flop-4',
    street: 'Flop',
    title: 'Set trifft C-Bet',
    situation:
      'Der Hijack eröffnet, du callst im Big Blind. Pot 5,5bb. Am Flop triffst du dein Set – er c-bettet 4bb.',
    heroCards: ['7s', '7d'],
    board: ['Ad', '7c', '2s'],
    options: [
      {
        label: 'Raise auf ca. 12bb',
        quality: 'best',
        explanation:
          'Er hat oft ein Ass, das dich bezahlt – und genau jetzt hält seine Range am meisten Top-Pair-Hände. Raise für Value, solange er verliebt in sein A-x ist; auf späteren Karten wird es schwerer, den Stack reinzubekommen.',
      },
      {
        label: 'Nur callen (Slowplay)',
        quality: 'ok',
        explanation:
          'Auf diesem trockenen Board nicht schlimm, weil kaum Karten deine Hand entwerten. Aber du riskierst, dass die Action auf Turn/River abreißt – 100bb bekommt man selten mit nur einer Raise-Street rein.',
      },
      {
        label: 'Fold',
        quality: 'bad',
        explanation: 'Du hältst die drittstärkste mögliche Hand. Hier zu folden wäre ein Bedienfehler.',
      },
    ],
    lesson: 'Sets auf Ass-Boards direkt hochspielen: Der Gegner hat jetzt Top Pair – später vielleicht kalte Füße.',
  },
  {
    id: 'flop-5',
    street: 'Flop',
    title: 'Range-Vorteil ausspielen',
    situation:
      'Du eröffnest im Cutoff, der Big Blind callt. Pot 5,5bb. Der Flop verfehlt dich – aber wessen Range trifft solche Boards?',
    heroCards: ['Ac', '5c'],
    board: ['Ks', '8d', '3h'],
    options: [
      {
        label: 'C-Bet klein (ca. 1/3 Pot)',
        quality: 'best',
        explanation:
          'K-8-3 regenbogen trifft deine Preflop-Range (AK, KQ, Überpaare) viel härter als seine Call-Range. Eine kleine Bet lässt seine vielen verpassten Hände folden – billig, effektiv, mit Ass-Blocker und Backdoor-Flush als Absicherung.',
      },
      {
        label: 'Check und aufgeben',
        quality: 'ok',
        explanation:
          'Zu passiv für diesen Spot: Genau auf solchen Boards ist die C-Bet am profitabelsten. Checken ist gegen sehr sticky Gegner vertretbar, verschenkt aber Fold Equity.',
      },
      {
        label: 'Pot-Bet als „echter“ Bluff',
        quality: 'bad',
        explanation:
          'Zu teuer für den Job: Seine schwachen Hände folden auch gegen 1/3 Pot. Die große Bet riskiert drei Mal mehr für dasselbe Ergebnis – schlechtes Preis-Leistungs-Verhältnis.',
      },
    ],
    lesson: 'C-Bets funktionieren auf Boards, die die eigene Range treffen – und dann reicht die kleine Münze.',
  },
  {
    id: 'flop-6',
    street: 'Flop',
    title: 'Bottom Pair im Familienpot',
    situation: 'Vier Spieler sehen den Flop im gelimpten Pot (4bb). Ein Spieler in früher Position bettet 3bb, ein weiterer callt.',
    heroCards: ['5c', '4c'],
    board: ['Qs', '9d', '4h'],
    options: [
      {
        label: 'Fold',
        quality: 'best',
        explanation:
          'Bottom Pair mit Mini-Kicker gegen Bet und Call in einem Vierer-Pot: Du bist fast sicher hinten, hast maximal fünf Outs und keinerlei Implied Odds. Der einfache, disziplinierte Fold spart bares Geld.',
      },
      {
        label: 'Call – „vielleicht kommt eine 4“',
        quality: 'bad',
        explanation:
          'Zwei Outs auf Trips (die 4) plus schwache Fünfer-Outs rechtfertigen keinen Call gegen echte Action. Genau diese „Hoffnungs-Calls“ summieren sich am Abend zum großen Minus.',
      },
      {
        label: 'Raise als Bluff',
        quality: 'bad',
        explanation:
          'Gegen zwei Beteiligte in einem Multiway-Pot blufft man nicht mit Bottom Pair – irgendwer hat immer eine Dame. Teuerste Option mit der schlechtesten Erfolgschance.',
      },
    ],
    lesson: 'Schwache Paare multiway sind Fold-Kandidaten – gute Spieler verlieren mit ihnen am wenigsten.',
  },
  // ---------- Turn ----------
  {
    id: 'turn-1',
    street: 'Turn',
    title: 'Der Preis ist zu heiß',
    situation:
      'Du callst am Flop mit deinem Straßendraw. Der Turn hilft nicht. Pot 14bb – dein Gegner bettet jetzt 10bb (2/3 Pot). Ihr habt beide noch ~80bb.',
    heroCards: ['8s', '7s'],
    board: ['9c', '6d', '2s', '2d'],
    options: [
      {
        label: 'Fold',
        quality: 'best',
        explanation:
          'Acht Outs bedeuten am Turn nur noch ~17 % – für den Call brauchst du rechnerisch 29 %. Die Lücke müssten Implied Odds füllen, aber dein Draw ist offensichtlich: Trifft die Straße, bezahlt er selten noch groß.',
      },
      {
        label: 'Call',
        quality: 'ok',
        explanation:
          'Vertretbar mit sehr tiefen Stacks gegen einen Spieler, der niemals foldet und immer bezahlt. Als Standard verlierst du mit diesem Call auf Dauer aber Geld – die direkten Odds stimmen einfach nicht.',
      },
      {
        label: 'Raise All-in als Semi-Bluff',
        quality: 'bad',
        explanation:
          'Eine 2/3-Pot-Bet am Turn signalisiert echte Stärke – deine Fold Equity ist gering, und wirst du gecallt, bist du klarer Außenseiter. Semi-Bluffs brauchen realistische Chancen, dass der Gegner foldet.',
      },
    ],
    lesson: 'Am Turn halbieren sich die Draw-Chancen – gute Spieler rechnen neu, statt „committed“ zu sein.',
  },
  {
    id: 'turn-2',
    street: 'Turn',
    title: 'Der Passive erwacht',
    situation:
      'Du bettest Flop und Turn mit Top Pair. Jetzt raist dich der Spieler, der den ganzen Abend nur gecallt und gefoldet hat, auf das Dreifache.',
    heroCards: ['Ad', 'Jh'],
    board: ['Jc', '8s', '4d', 'Kh'],
    options: [
      {
        label: 'Fold',
        quality: 'best',
        explanation:
          'Wenn passive Freizeitspieler plötzlich raisen, haben sie praktisch immer eine starke Hand – hier oft zwei Paare, ein Set oder KJ. Top Pair mit gutem Kicker ist gegen diese Range weit hinten. Der Fold tut kurz weh und spart langfristig Stacks.',
      },
      {
        label: 'Call und River ansehen',
        quality: 'ok',
        explanation:
          'Gegen unbekannte oder aggressive Gegner wäre der Call Standard. Gegen den erwiesenen Passivling bezahlst du aber meist nur, um am River die schlechte Nachricht zu bekommen.',
      },
      {
        label: '3-Bet All-in',
        quality: 'bad',
        explanation:
          'Du eskalierst genau gegen die Range, die dich schlägt. Schlechtere Hände folden, bessere callen sofort – das Lehrbuchbeispiel einer wertlosen Aggression.',
      },
    ],
    lesson: 'Der stärkste Read im Low-Stakes-Poker: unerwartete Aggression von passiven Spielern ist fast nie ein Bluff.',
  },
  {
    id: 'turn-3',
    street: 'Turn',
    title: 'Nuts – und jetzt?',
    situation:
      'Du hast am Flop deinen Straßendraw gecallt, der Turn vollendet die Nuts. Dein Gegner (hat Flop gebettet) checkt jetzt. Pot 15bb.',
    heroCards: ['Th', '9h'],
    board: ['8c', '7d', '2s', '6s'],
    options: [
      {
        label: 'Bet ca. 2/3 Pot',
        quality: 'best',
        explanation:
          'Mit der besten Hand willst du den Pot füttern – und auf diesem Board gibt es viele Hände (Sets, zwei Paare, Flushdraws, kleinere Straßendraws), die eine ordentliche Bet bezahlen. Nicht zu klein: Jede Street zählt.',
      },
      {
        label: 'Check-Back als Trap',
        quality: 'ok',
        explanation:
          'Gegen hyperaggressive Gegner, die den River sicher anbetten, kann die Falle klappen. Meist verschenkst du aber eine ganze Value-Street und gibst Flushdraws eine Gratiskarte, die dir die Action killt.',
      },
      {
        label: 'Mini-Bet (1bb) „zum Anfüttern“',
        quality: 'bad',
        explanation:
          'Die Mini-Bet gewinnt fast nichts und gibt jedem Draw perfekte Odds, dich am River zu überholen oder auszusteigen. Wenn schon betten, dann einen Betrag, der den Pot echt wachsen lässt.',
      },
    ],
    lesson: 'Mit den Nuts Value maximieren: solide Bets auf jeder Street schlagen Tricks fast immer.',
  },
  {
    id: 'turn-4',
    street: 'Turn',
    title: 'Asse auf dem Horror-Board',
    situation:
      'Du hast preflop 3-gebettet und wurdest gecallt. Auf dem komplett vernetzten Board hat dein Gegner am Flop gecheckt-gecallt. Der Turn bringt den vierten Pik nicht, aber die Gefahr bleibt. Er bettet nun klein (1/4 Pot). Du hältst kein Pik.',
    heroCards: ['Ad', 'Ac'],
    board: ['9s', '8s', '7s', '2h'],
    options: [
      {
        label: 'Call',
        quality: 'best',
        explanation:
          'Dein Overpair ist hier nur noch ein Bluff-Catcher: Flushs, Straßen und Sets schlagen dich, aber die kleine Bet kann auch von Draws und schwächeren Händen kommen. Zum Preis von 1/4 Pot callst du – mehr aber nicht.',
      },
      {
        label: 'Raise „zum Schutz“',
        quality: 'bad',
        explanation:
          'Wovor schützt du dich? Fertige Flushs folden nicht, Draws zahlen höchstens einmal. Du bläst den Pot mit einer Ein-Paar-Hand auf einem Board auf, das deine Range zerstört.',
      },
      {
        label: 'Fold',
        quality: 'ok',
        explanation:
          'Gegen große Bets wäre Folden stark. Gegen 1/4 Pot ist es zu tight – bei diesem Preis muss dein Gegner nur selten bluffen, damit der Call richtig ist.',
      },
    ],
    lesson: 'Auch Asse sind manchmal nur ein Bluff-Catcher: Auf monotonen, vernetzten Boards klein mitgehen statt aufblasen.',
  },
  // ---------- River ----------
  {
    id: 'river-1',
    street: 'River',
    title: 'Die teuerste Falle im Poker',
    situation:
      'Du hast mit Top Pair drei Streets Value gebettet. Am River raist dich ein gemütlicher Freizeitspieler plötzlich auf das Vierfache deiner Bet.',
    heroCards: ['Kc', 'Qd'],
    board: ['Kh', '9c', '5d', '3s', '8h'],
    options: [
      {
        label: 'Fold',
        quality: 'best',
        explanation:
          'Der große River-Raise vom Freizeitspieler ist die zuverlässigste Information im Low-Stakes-Poker: praktisch immer zwei Paare oder besser. „Er könnte ja bluffen“ ist die teuerste Ausrede der Pokergeschichte.',
      },
      {
        label: 'Call – „Ich muss es sehen“',
        quality: 'bad',
        explanation:
          'Neugier kostet hier real Geld: Damit der Call richtig ist, müsste er öfter als jedes vierte Mal bluffen – passive Freizeitspieler bluffen in diesem Spot fast nie.',
      },
      {
        label: '3-Bet All-in',
        quality: 'bad',
        explanation: 'Mit einem Paar gegen die stärkste Range des Abends zu eskalieren ist der schnellste Weg, den Stack zu verlieren.',
      },
    ],
    lesson: 'River-Raises von passiven Spielern glauben – der disziplinierte Fold ist eine der wertvollsten Poker-Fähigkeiten.',
  },
  {
    id: 'river-2',
    street: 'River',
    title: 'Die dünne Value-Bet',
    situation:
      'Heads-up gegen eine Callstation, die mit jedem Paar bis zum Ende geht. Der River verändert nichts. Sie checkt zu dir. Pot 18bb.',
    heroCards: ['Ad', 'Qd'],
    board: ['Qs', '8c', '4d', '2h', '7c'],
    options: [
      {
        label: 'Value-Bet ca. 1/2 Pot',
        quality: 'best',
        explanation:
          'Top Pair Top Kicker gegen jemanden, der mit Q-x, 8-x und Pocket Pairs bezahlt: Diese Bet gewinnt im Schnitt bares Geld. Genau solche „dünnen“ Value-Bets unterscheiden Gewinner von Break-even-Spielern.',
      },
      {
        label: 'Check-Back – „sicher ist sicher“',
        quality: 'ok',
        explanation:
          'Du gewinnst den Showdown meist trotzdem, verschenkst aber die dritte Value-Street. Gegen Callstations ist Vorsicht am River fast immer verlorenes Geld.',
      },
      {
        label: 'Overbet 2x Pot',
        quality: 'bad',
        explanation:
          'Selbst Callstations haben Schmerzgrenzen: Die Riesen-Bet foldet die schwachen Hände raus und wird nur von Händen gecallt, die dich schlagen könnten. Zu groß für zu dünnen Value.',
      },
    ],
    lesson: 'Gegen Caller dünn value betten: Wer nur mit den Nuts bettet, lässt das meiste Geld liegen.',
  },
  {
    id: 'river-3',
    street: 'River',
    title: 'Showdown-Wert erkennen',
    situation:
      'Heads-up. Dein Flushdraw ist angekommen – nein, doch nicht: Der River verfehlt alles. Dein Gegner checkt zum zweiten Mal. Pot 12bb.',
    heroCards: ['Ah', '6h'],
    board: ['Kh', '9h', '4c', '2d', '8s'],
    options: [
      {
        label: 'Check – Showdown mitnehmen',
        quality: 'best',
        explanation:
          'Ass-hoch schlägt alle verpassten Draws deines Gegners – und genau die checkt er hier oft. Dein „Nichts“ hat echten Showdown-Wert: Wer mit solchen Händen blufft, verwandelt Gewinn-Situationen in Verlust-Spots.',
      },
      {
        label: 'Kleine Bluff-Bet (1/3 Pot)',
        quality: 'ok',
        explanation:
          'Foldet vielleicht ein besseres Paar? Selten. Meist folden nur die Hände, die du eh schlägst, und die besseren callen. Vertretbar gegen sehr tighte Gegner, aber der Check ist schlauer.',
      },
      {
        label: 'Overbet-Bluff All-in',
        quality: 'bad',
        explanation:
          'Maximales Risiko, um Hände zu verdrängen, die du teilweise sowieso schlägst – und jedes K-x callt dich sofort. Bluffe mit deinen hoffnungslosesten Händen, nicht mit Showdown-Wert.',
      },
    ],
    lesson: 'Vor jedem River-Bluff fragen: Schlage ich beim Check vielleicht schon genug? Ass-hoch ist oft gut genug.',
  },
  // ---------- Turnier ----------
  {
    id: 'tour-1',
    street: 'Turnier',
    title: 'Kurzer Stack, klare Ansage',
    situation:
      'Turnier, die Blinds fressen dich auf: Noch 8bb am Button. Alle folden zu dir – Small Blind und Big Blind sind solide Spieler.',
    heroCards: ['Ad', '8d'],
    board: [],
    options: [
      {
        label: 'All-in',
        quality: 'best',
        explanation:
          'A8s ist am Button mit 8bb ein klarer Standard-Shove (Nash-Range dort ist deutlich breiter). Du setzt maximalen Fold-Druck auf zwei zufällige Blinds-Hände und bist gecallt selten dominiert.',
      },
      {
        label: 'Min-Raise mit Fold-Plan',
        quality: 'bad',
        explanation:
          'Mit 8bb kannst du nach einem Min-Raise nicht mehr sinnvoll folden – du zerteilst deinen Stack in wirkungslose Häppchen. Kurz gestapelt gibt es nur noch zwei Knöpfe: All-in oder Fold.',
      },
      {
        label: 'Fold – auf besseren Spot warten',
        quality: 'bad',
        explanation:
          'Bei 8bb kostet jede Blind-Runde fast 20 % deines Stacks. A8s am Button ist deutlich über der Shove-Schwelle – wer solche Spots foldet, blindet sich in die Bedeutungslosigkeit.',
      },
    ],
    lesson: 'Unter ~12bb wird Push-or-Fold zur Hauptstrategie – halbe Sachen verbrennen Fold Equity.',
  },
  {
    id: 'tour-2',
    street: 'Turnier',
    title: 'Bubble-Mathematik',
    situation:
      'Turnier-Bubble: Noch 10 Spieler, 9 bekommen Geld. Du hast einen bequemen Mittel-Stack (35bb). Der Chipleader (110bb) schiebt vor dir All-in – er macht das fast jede Hand. Zwei Kurzstacks (je 4bb) sitzen an den anderen Tischen.',
    heroCards: ['Ac', 'Qs'],
    board: [],
    options: [
      {
        label: 'Fold',
        quality: 'best',
        explanation:
          'Chip-technisch bist du gegen seine Any-Two-Range vorne – aber es geht nicht um Chips, sondern um Geld (ICM): Verlierst du, verpasst du das sichere Preisgeld, während zwei Kurzstacks praktisch blind ausscheiden. Der Fold kostet wenig, der Call riskiert alles.',
      },
      {
        label: 'Call – „Ich bin ja vorne“',
        quality: 'ok',
        explanation:
          'Gegen seine breite Range hat AQo gute Equity, und mit dem Doppel-Up wärst du Chipleader. Aber auf der Bubble mit sterbenden Kurzstacks bezahlst du ein hohes „Risk Premium“ – knapper Spot, meist zu dünn.',
      },
      {
        label: 'Snap-Call ohne nachzudenken',
        quality: 'bad',
        explanation:
          'Wer auf der Bubble reine Chip-Mathematik spielt, verschenkt Preisgeld-Erwartung. ICM-Situationen verlangen immer eine Extra-Denksekunde.',
      },
    ],
    lesson: 'ICM: Auf der Bubble sind Chips nicht gleich Geld – große Konfrontationen meiden, wenn andere fast draußen sind.',
  },
];
