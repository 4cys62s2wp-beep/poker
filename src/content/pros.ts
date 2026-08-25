// Pro-Insights: verifizierte Prinzipien bekannter Poker-Profis.
// Alle Aussagen sind sinngemäße Zusammenfassungen öffentlich dokumentierter
// Interviews, Kurse, Bücher und Strategie-Artikel (u. a. PokerNews, Card Player,
// GipsyTeam, MasterClass, Upswing Poker, Pokercode) – keine erfundenen Zitate.

export interface ProPrinciple {
  title: string;
  text: string;
}

export interface ProProfile {
  id: string;
  name: string;
  /** Kurz-Einordnung unter dem Namen. */
  tagline: string;
  /** Belegbare Fakten zur Person. */
  knownFor: string;
  principles: ProPrinciple[];
  /** Akzentfarbe für das Monogramm. */
  color: string;
}

export const PRO_PROFILES: ProProfile[] = [
  {
    id: 'holz',
    name: 'Fedor Holz',
    tagline: 'Deutschlands erfolgreichster Poker-Profi',
    knownFor:
      'Über 30 Millionen Dollar Live-Turniergewinne, WSOP-Bracelet-Gewinner, legendärer High-Roller-Run 2016. Gründer der Pokerschule Pokercode und der Mindset-App Primed Mind.',
    color: '#d4af5e',
    principles: [
      {
        title: 'Mindset ist die halbe Miete',
        text:
          'Holz beschreibt seinen Erfolg als Zusammenspiel aus technischer Vorbereitung und mentaler Klarheit unter Druck – und stellt Mindset in seinen Kursen bewusst an den Anfang. Seine ehrliche Zahl dazu: Rund 80 % seiner Turniertage waren Verlusttage. Wer das nicht emotional aushält, kann sein technisches Wissen nie abrufen.',
      },
      {
        title: 'Gegner sofort einordnen',
        text:
          'Bei jedem neuen Gegner versucht Holz, ihn schnell in eine von sechs Kategorien einzuordnen (vom extrem tighten „Nit“ bis zum Aggressor) – nicht als Schublade, sondern um zu verstehen, WIE dieser Spieler denkt, und daraus die passende Gegenstrategie abzuleiten.',
      },
      {
        title: 'Der wertvollste Tell: Bet-Sizing & Chip-Handling',
        text:
          'Nach eigener Aussage hat ihm kaum etwas so viel Geld gebracht wie die Beobachtung von Einsatzgrößen und der Art, wie Chips gesetzt werden: Bluffs fallen tendenziell etwas kleiner aus als erwartet, Value-Bets etwas größer. Ordentlich gestapelte Einsätze deuten auf tighte, passive Spieler; hingeworfene, „beiläufige“ Chips oft auf schwächere Hände.',
      },
      {
        title: 'Reflexion und Umfeld',
        text:
          'Holz betont, wie stark die Poker-Community um dich herum dein Spiel prägt: Regelmäßiges Review der eigenen Hände und der Austausch mit besseren Spielern beschleunigen das Lernen mehr als jedes Solo-Studium. Poker verändert sich ständig – wer aufhört, Fehler zu suchen, fällt zurück.',
      },
      {
        title: 'Logik schlägt Auswendiglernen',
        text:
          'Statt Charts stur zu memorieren, will Holz verstehen, WARUM eine Strategie funktioniert. Wer die Logik hinter einer Range begreift, kann sie an jede neue Situation anpassen – auswendig gelerntes Wissen bricht zusammen, sobald der Gegner vom Skript abweicht.',
      },
    ],
  },
  {
    id: 'little',
    name: 'Jonathan Little',
    tagline: 'Zweifacher WPT-Champion & produktivster Poker-Lehrer',
    knownFor:
      'Über 7 Millionen Dollar Live-Turniergewinne, mehr als 15 Strategie-Bücher, Gründer von PokerCoaching.com. Bekannt für seine Analysen typischer Amateur-Fehler.',
    color: '#5590d9',
    principles: [
      {
        title: 'Nie auf genau eine Hand setzen',
        text:
          'Der größte Anfängerfehler im Hand-Reading: den Gegner auf exakt eine Hand festlegen („Er hat sicher AK“). In Wahrheit spielt jeder Gegner viele verschiedene Hände auf dieselbe Weise – denke immer in Ranges, nie in Einzelhänden.',
      },
      {
        title: 'Hör auf zu kleben („Stop being so sticky“)',
        text:
          'Amateure können sich nicht von Top Pair trennen – besonders in Multiway-Pötten wird Check-Call mit Top Pair und schwachem Kicker zum Dauerabo aufs Verlieren. Eine gute Hand ist kein Grund, jede Bet zu bezahlen.',
      },
      {
        title: 'Setzgrößen mit Sinn',
        text:
          'Zu kleine 3-Bets sind ein klassischer, teurer Fehler: Sie geben dem Gegner so gute Pot Odds, dass er fast immer korrekt weiterspielen darf. Jede Bet-Größe sollte einen Zweck haben – nicht Gewohnheit sein.',
      },
      {
        title: 'Spiele nie mit vollem Kopf',
        text:
          'Wer mit Streit, Geldsorgen oder Frust im Kopf am Tisch sitzt, spielt messbar schlechter. Littles Rat: Emotionales Denken so früh wie möglich aus dem Spiel entfernen – notfalls durch konsequentes Aufstehen.',
      },
      {
        title: 'Keine Strategie in Stein meißeln',
        text:
          'Die meisten Amateure entwickeln einmal eine Komfort-Strategie und behalten sie für immer – mit Sätzen wie „Ich calle IMMER mit Top Pair“. Gewinner passen sich an: an Gegner, Stack-Tiefen und Spielverlauf.',
      },
    ],
  },
  {
    id: 'polk',
    name: 'Doug Polk',
    tagline: 'Drei WSOP-Bracelets, jahrelang bester Heads-Up-Spieler der Welt',
    knownFor:
      'Gewann 2021 das berühmte Heads-Up-Duell gegen Daniel Negreanu mit 1,2 Millionen Dollar Vorsprung. Gründer von Upswing Poker.',
    color: '#e0564f',
    principles: [
      {
        title: 'Kontrollierte Aggression',
        text:
          'Polks Grundprinzip: mit guten – nicht nur mit Premium-Händen – maximalen Druck aufbauen, aber ohne sich für Gegenaggression verwundbar zu machen. Aggression ist ein Werkzeug mit Dosierung, kein Dauerzustand.',
      },
      {
        title: 'Bluffe keine Callstations',
        text:
          'Gegen schwache Spieler rät Polk ausdrücklich davon ab, viel zu bluffen: Deine „Story“ ist für sie unsichtbar – sie schauen auf ihre zwei Karten und callen. Der Gewinn gegen diese Gegner kommt aus Value, nicht aus Kreativität.',
      },
      {
        title: 'Präzision schlägt wilde Aggression',
        text:
          'Loose-aggressiv zu spielen maximiert die Winrate nur, wenn die Aggression präzise ist. Wahllose Bluffs „verschütten“ Geld – jede aggressive Aktion braucht einen Grund: Fold Equity, Equity oder Blocker.',
      },
    ],
  },
  {
    id: 'negreanu',
    name: 'Daniel Negreanu',
    tagline: 'Sieben WSOP-Bracelets, zweifacher WSOP Player of the Year',
    knownFor:
      'Einer der bekanntesten Pokerspieler der Welt, Erfinder des „Small Ball“-Stils, MasterClass-Dozent. Über 50 Millionen Dollar Live-Turniergewinne.',
    color: '#58b368',
    principles: [
      {
        title: 'Small Ball: viele kleine Pötte',
        text:
          'Negreanus Markenzeichen: mehr Hände spielen, die Pötte klein und kontrollierbar halten und den Edge über bessere Postflop-Entscheidungen holen. In vielen kleinen Pötten darf geblufft werden – aber wenn am River ein Riesen-Pot entsteht, hält er fast immer eine starke Hand.',
      },
      {
        title: 'Postflop-Können schlägt Chart-Wissen',
        text:
          'Poker ist nicht nur Preflop-Tabellen: Die Qualität deiner Entscheidungen nach dem Flop entscheidet langfristig über Gewinn und Verlust. Wer nur Charts lernt, hat nach dem Flop keinen Plan.',
      },
      {
        title: 'Position wird mit der Stack-Tiefe wichtiger',
        text:
          'Je tiefer die Stacks, desto mehr Entscheidungen kommen noch – und desto wertvoller ist es, sie als Letzter zu treffen. Out of position zu spielen heißt, jede Street Information zu verschenken.',
      },
      {
        title: 'Klein setzen, wenn klein reicht',
        text:
          'Wenn eine kleine Bet denselben Job erledigt wie eine große – etwa auf Boards, die beide Spieler meist verfehlen –, ist die kleine Bet die bessere: gleicher Effekt, weniger Risiko.',
      },
    ],
  },
  {
    id: 'galfond',
    name: 'Phil Galfond',
    tagline: 'Drei WSOP-Bracelets, High-Stakes-Online-Legende',
    knownFor:
      'Unter „OMGClayAiken“ einer der erfolgreichsten Online-High-Stakes-Spieler aller Zeiten, Gründer der Trainingsseite Run It Once, Gewinner der „Galfond Challenge“.',
    color: '#9b7fd4',
    principles: [
      {
        title: 'Frag bei allem: Warum?',
        text:
          'Galfonds wichtigste Lernfrage: Warum checke oder bette ich hier? Warum tut mein Gegner, was er tut? Warum sehen die Charts so aus? Wer das „Warum“ versteht, braucht kein Auswendiglernen – und erkennt richtige Antworten auch in Situationen, die in keinem Chart stehen.',
      },
      {
        title: 'Selbstkenntnis ist der beste Gegner-Read',
        text:
          'Der größte Edge entsteht laut Galfond, wenn du das Verhalten deines Gegners besser verstehst als er selbst. Der Weg dorthin: die eigenen Ängste und Unwohl-Momente am Tisch kennen – denn genau dieselben Gefühle steuern auch deine Gegner.',
      },
      {
        title: 'Eigene Hände ehrlich reviewen',
        text:
          'Galfond empfiehlt, gespielte Hände durchzugehen und die eigene Entscheidung zu begründen. Dabei entdeckst du Denkfehler und Muster – bei dir und damit automatisch auch bei deinem Spielerpool.',
      },
      {
        title: 'Intuition erklären können',
        text:
          'Galfond vertraut Intuition nur, wenn er sie in einen klaren Gedankengang übersetzen kann: Welche Informationen führen zu welchem Schluss? „Fühlte sich richtig an“ ist keine Begründung – sondern der Anfang einer Analyse.',
      },
    ],
  },
  {
    id: 'elwood',
    name: 'Zachary Elwood',
    tagline: 'Der führende Experte für Poker-Tells',
    knownFor:
      'Autor der Standardwerke „Reading Poker Tells“, „Verbal Poker Tells“ und „Exploiting Poker Tells“ – die meistempfohlene Tell-Literatur unter Profis.',
    color: '#4fb8c9',
    principles: [
      {
        title: 'Ein Tell ist eine Tendenz, kein Gesetz',
        text:
          'Elwood definiert einen Tell als etwas, das ein bestimmter Spieler EHER tut als nicht tut. Manche Verhaltensweisen sind bedeutungslose Angewohnheiten – wertvoll wird ein Signal erst durch Wiederholung beim selben Spieler.',
      },
      {
        title: 'Kontext entscheidet alles',
        text:
          'Dieselbe Geste – starren, seufzen, wegschauen – kann in einer Situation Stärke und in der nächsten Schwäche bedeuten. Wer die Situation nicht versteht, trifft mit einem „korrekten“ Tell trotzdem die falsche Entscheidung.',
      },
      {
        title: 'System statt Bauchgefühl',
        text:
          'Elwoods Ansatz ist ein mentales Ordnungssystem: Verhalten nach Situation sortieren (vor der Bet, nach der Bet, beim Warten), Baseline beobachten, Abweichungen notieren. Tells lesen ist Handwerk, keine Magie.',
      },
    ],
  },
];

/** Die teuersten Fehler von Freizeitspielern – laut Profis und Leak-Datenbanken. */
export interface MistakeEntry {
  title: string;
  text: string;
  /** Wer diesen Punkt prominent macht. */
  source: string;
}

export const BEGINNER_MISTAKES: MistakeEntry[] = [
  {
    title: 'Passives Spiel nach dem Flop',
    text:
      'Der mit Abstand häufigste Haupt-Leak in Analysen von Low-Stakes-Spielern: checken und callen, wo betten und raisen richtig wäre. Passive Spieler gewinnen nur, wenn sie die beste Hand halten – aggressive Spieler gewinnen zusätzlich all die Pötte, die niemand haben will.',
    source: 'Leak-Analysen (u. a. Holdem Pro: bei 44 % der Spieler der größte Leak)',
  },
  {
    title: 'Open-Limpen',
    text:
      'Der klassischste Live- und Micro-Stakes-Fehler: nur mitgehen statt erhöhen. Du gewinnst den Pot nie sofort, lädst alle billig ein und spielst ohne Initiative. Wenn eine Hand spielbar ist, ist sie raisbar.',
    source: 'Upswing Poker, praktisch jeder moderne Kurs',
  },
  {
    title: 'Den Big Blind zu oft aufgeben',
    text:
      'Moderne Analysen zeigen: Freizeitspieler folden im Big Blind viel zu häufig und verschenken damit still und leise Blind für Blind. Mit dem Rabatt des bereits gesetzten Blinds darfst du deutlich breiter verteidigen, als sich „richtig“ anfühlt.',
    source: 'Upswing Poker, GTO-Analysen',
  },
  {
    title: 'Zu viele Hände raisen',
    text:
      'Das Gegenstück zum Limpen und laut Upswing sogar schlimmer: Wer mit zu breiter Range erhöht, baut exponentiell größere Pötte mit zu schwachen Händen – und verliert schneller, als jeder Limper es könnte.',
    source: 'Upswing Poker',
  },
  {
    title: 'Eine Hand lesen statt einer Range',
    text:
      '„Er hat sicher Asse“ ist kein Read, sondern Raten. Gegner spielen viele Hände identisch – wer nur eine Möglichkeit sieht, trifft systematisch falsche Entscheidungen.',
    source: 'Jonathan Little',
  },
  {
    title: 'Top Pair nicht folden können',
    text:
      'Top Pair fühlt sich wie ein Gewinnlos an – ist gegen große Aggression, vor allem multiway, aber oft klar geschlagen. „Sticky“ zu sein ist einer der teuersten Charakterzüge am Pokertisch.',
    source: 'Jonathan Little',
  },
  {
    title: 'Callstations bluffen wollen',
    text:
      'Die schöne Dreifass-Bluff-Story funktioniert nur bei Gegnern, die zuhören. Freizeitspieler schauen auf ihre zwei Karten und callen. Gegen sie gilt: mehr Value, null Heldentaten.',
    source: 'Doug Polk',
  },
  {
    title: 'Mit Emotionen weiterspielen',
    text:
      'Nach einem Bad Beat „schnell zurückgewinnen“ wollen ist der Anfang jeder Horror-Session. Profis behandeln emotionale Klarheit als Voraussetzung fürs Spielen – nicht als Nice-to-have.',
    source: 'Jonathan Little, Fedor Holz',
  },
];

/** Wo laut Profis auf Low Stakes der echte Edge liegt. */
export interface EdgeEntry {
  title: string;
  text: string;
}

export const EDGE_SPOTS: EdgeEntry[] = [
  {
    title: 'Die goldene Low-Stakes-Regel: Value first',
    text:
      'Auf niedrigen Limits wird zu viel gecallt. Die Konsequenz: dünner und öfter value betten, große Bluffs streichen. Der Edge liegt nicht in spektakulären Moves, sondern darin, mit guten Händen konsequent bezahlt zu werden.',
  },
  {
    title: 'Die Leaks der anderen gezielt angreifen',
    text:
      'Limper isolieren, überfoldende Blinds stehlen, Callstations value betten, gegen Nits große Bets respektieren: Jeder typische Fehler deiner Gegner hat eine direkte Gegenmaßnahme – und Low-Stakes-Tische bestehen aus genau diesen Fehlern.',
  },
  {
    title: 'Tisch- und Sitzplatzwahl',
    text:
      'Profis suchen sich ihre Spiele aus: lieber der fünftbeste Spieler an einem weichen Tisch als der beste am harten. Live gilt zusätzlich: Die lockersten Spieler sitzen am besten rechts von dir, damit du nach ihnen handelst.',
  },
  {
    title: 'Studieren, was niemand sonst studiert',
    text:
      'Die brutale Wahrheit über Low Stakes: Kaum jemand dort arbeitet an seinem Spiel. Schon 20–30 Minuten strukturiertes Lernen pro Tag – genau das, was diese App abbildet – überholen den durchschnittlichen Tisch innerhalb weniger Wochen.',
  },
  {
    title: 'Disziplin in den großen Momenten',
    text:
      'Ein einziger disziplinierter Fold gegen den plötzlichen River-Raise eines passiven Spielers spart mehr, als zehn clevere Bluffs einbringen. Profis gewinnen nicht, weil sie mehr riskieren – sondern weil sie die teuren Fehler weglassen.',
  },
];

export const PRO_SOURCE_NOTE =
  'Alle Prinzipien sind sinngemäße Zusammenfassungen öffentlich dokumentierter Aussagen aus Interviews, Kursen und Büchern der genannten Profis (u. a. PokerNews, Card Player, GipsyTeam, MasterClass, Upswing Poker, Pokercode, „Reading Poker Tells“). Keine wörtlichen Zitate, keine erfundenen Aussagen. PokerMentor steht in keiner Verbindung zu den genannten Personen: keine Kooperation, kein Sponsoring, keine Empfehlung durch sie.';
