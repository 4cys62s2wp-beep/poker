// Tells & Reads für Live-Poker – mit ehrlicher Zuverlässigkeitsbewertung.
// Fokus: lockere Low-Stakes-Runden und Homegames.

export type TellCategory = 'grundregeln' | 'koerper' | 'einsatz' | 'timing' | 'reden' | 'homegame';

export const TELL_CATEGORIES: Array<{ id: TellCategory; label: string; icon: string }> = [
  { id: 'grundregeln', label: 'Grundregeln', icon: '📐' },
  { id: 'koerper', label: 'Körpersprache', icon: '🫣' },
  { id: 'einsatz', label: 'Einsätze & Chips', icon: '💰' },
  { id: 'timing', label: 'Timing', icon: '⏱️' },
  { id: 'reden', label: 'Sprechverhalten', icon: '💬' },
  { id: 'homegame', label: 'Homegame-Muster', icon: '🍻' },
];

export interface Tell {
  icon: string;
  name: string;
  /** Was es meistens bedeutet. */
  read: string;
  /** Zuverlässigkeit 1–5. */
  reliability: number;
  desc: string;
  category: TellCategory;
}

export const TELLS: Tell[] = [
  // ---------- Grundregeln ----------
  {
    icon: '📏',
    name: 'Erst die Baseline, dann der Tell',
    read: 'Ohne Vergleich kein Read',
    reliability: 5,
    desc: 'Beobachte jeden Spieler zuerst in normalen Situationen: Wie sitzt er, wie setzt er, wie redet er, wenn nichts los ist? Ein Tell ist immer eine ABWEICHUNG vom Normalverhalten – nicht das Verhalten selbst. Wer immer zittert, verrät mit Zittern nichts.',
    category: 'grundregeln',
  },
  {
    icon: '⚖️',
    name: 'Ein Tell ist ein Indiz, kein Beweis',
    read: 'Tells verschieben Wahrscheinlichkeiten',
    reliability: 5,
    desc: 'Nutze Tells, um knappe Entscheidungen zu kippen – nicht, um klare Mathematik zu überstimmen. Ein starker Read macht aus einem knappen Fold einen Call, aber aus einem klaren Fold macht er keinen Hero Call.',
    category: 'grundregeln',
  },
  {
    icon: '🎭',
    name: 'Schwach gespielt = stark, stark gespielt = schwach',
    read: 'Die älteste Regel von Mike Caro',
    reliability: 4,
    desc: 'Freizeitspieler schauspielern gern – aber fast immer in dieselbe Richtung: Wer seufzt, die Schultern hängen lässt und „widerwillig“ setzt, hält meist ein Monster. Wer besonders forsch und einschüchternd auftritt, ist öfter schwach. Gilt vor allem für ungeübte Spieler.',
    category: 'grundregeln',
  },
  {
    icon: '🐟',
    name: 'Anfänger-Tells sind ehrlicher',
    read: 'Je unerfahrener, desto lesbarer',
    reliability: 4,
    desc: 'Geübte Spieler kontrollieren oder faken ihr Verhalten. In lockeren Runden mit Gelegenheitsspielern sind Tells dagegen oft echt – genau dort lohnt sich das Beobachten am meisten. Und: Das Bet-Sizing verrät bei Anfängern meist mehr als jede Geste.',
    category: 'grundregeln',
  },
  // ---------- Körpersprache ----------
  {
    icon: '🫨',
    name: 'Zitternde Hände beim Setzen',
    read: 'Meist echte Stärke',
    reliability: 4,
    desc: 'Das Zittern kommt vom Adrenalin nach einem großen Treffer – es ist kaum bewusst steuerbar und deshalb einer der verlässlichsten Tells überhaupt. Bluffer zittern selten: Sie versteifen sich eher. Vorsicht nur bei generell nervösen Spielern (Baseline!).',
    category: 'koerper',
  },
  {
    icon: '🗿',
    name: 'Plötzliche Regungslosigkeit',
    read: 'Oft ein Bluff',
    reliability: 3,
    desc: 'Wer blufft, will keine „verräterischen“ Signale senden – und erstarrt deshalb: flacher Atem, starrer Blick, keine Bewegung. Wirkt jemand nach einer großen Bet wie eingefroren, obwohl er sonst lebhaft ist, ist das öfter Schwäche als Stärke.',
    category: 'koerper',
  },
  {
    icon: '👀',
    name: 'Blick zu den eigenen Chips nach dem Flop',
    read: 'Hat getroffen, will setzen',
    reliability: 4,
    desc: 'Der schnelle, unwillkürliche Blick vom Board zu den eigenen Chips ist ein klassischer Treffer-Reflex: „Wie viel kann ich setzen?“ Achte in dem Moment, in dem der Flop kommt, nicht aufs Board – schau auf die Augen deiner Gegner.',
    category: 'koerper',
  },
  {
    icon: '🃏',
    name: 'Nochmal die eigenen Karten checken (Flush-Board)',
    read: 'Meist nur eine Karte der Farbe = Draw',
    reliability: 3,
    desc: 'Kommen zwei oder drei gleichfarbige Karten aufs Board und jemand schaut seine Hole Cards nach, prüft er fast immer, OB er die Farbe hält – ein fertiger Flush oder zwei gleichfarbige Karten merkt man sich. Heißt: eher Draw oder gar nichts als ein Monster.',
    category: 'koerper',
  },
  {
    icon: '🧍',
    name: 'Plötzlich aufrecht und aufmerksam',
    read: 'Starke Starthand',
    reliability: 3,
    desc: 'Wer nach dem Austeilen unbewusst die Haltung strafft, sich nach vorn lehnt oder sein Getränk beiseitestellt, hat meistens etwas vor. Kombiniert mit einem Raise aus früher Position: glaub ihm die starke Hand.',
    category: 'koerper',
  },
  {
    icon: '😀',
    name: 'Entspanntes Plaudern während großer Bets',
    read: 'Meist stark',
    reliability: 4,
    desc: 'Echte Entspannung ist schwer zu spielen: Wer nach einer großen Bet locker weiterredet, lacht und Blickkontakt hält, fühlt sich sicher – meist zu Recht. Bluffer wirken angespannter, antworten einsilbig oder gar nicht.',
    category: 'koerper',
  },
  {
    icon: '👋',
    name: 'Griff zu den Chips, bevor du dran bist',
    read: 'Will callen oder raisen – kein Bluff-Ziel',
    reliability: 4,
    desc: 'Wer schon zu seinen Chips greift, während du noch überlegst, signalisiert: „Ich gehe mit.“ Bei Anfängern meist ehrlich – spar dir den Bluff und value-bette dünner. Manche Geübte nutzen es umgekehrt als Fake, um deine Bet zu verhindern (Baseline prüfen).',
    category: 'koerper',
  },
  // ---------- Einsätze & Chips ----------
  {
    icon: '📈',
    name: 'Ungewöhnlich große Bet',
    read: 'Bei Anfängern: stark – oder Panik-Schutz',
    reliability: 4,
    desc: 'Freizeitspieler überbetten selten als Bluff. Eine plötzliche Riesen-Bet heißt meist: sehr starke Hand ODER eine mittlere Hand, die „nicht gecallt werden will“ (z. B. Top Pair auf Flush-Board). In beiden Fällen: Mit mittleren Händen folden, nur mit echten Monstern weitermachen.',
    category: 'einsatz',
  },
  {
    icon: '🪙',
    name: 'Mini-Bets',
    read: 'Schwäche oder Draw',
    reliability: 4,
    desc: 'Winzige Bets („1 in einen 10er-Pot“) sind bei Gelegenheitsspielern fast nie Stärke – sie wollen billig eine Karte sehen oder „mal fühlen“. Antworte mit einem ordentlichen Raise, wenn du etwas hältst – oder nimm den günstigen Preis mit deinem Draw dankend mit.',
    category: 'einsatz',
  },
  {
    icon: '🚨',
    name: 'Großer River-Raise vom passiven Spieler',
    read: 'Fast immer die Nuts',
    reliability: 5,
    desc: 'Der zuverlässigste Read im Low-Stakes-Poker: Wenn jemand, der den ganzen Abend nur gecallt hat, am River plötzlich groß erhöht, hat er praktisch nie einen Bluff. Fold auch mit Händen, die sich „zu gut zum Wegwerfen“ anfühlen – genau das ist der Fehler, der Stacks kostet.',
    category: 'einsatz',
  },
  {
    icon: '🎯',
    name: 'Sizing-Muster erkennen',
    read: 'Der ehrlichste „Tell“ überhaupt',
    reliability: 5,
    desc: 'Viele Spieler setzen unbewusst nach Muster: groß mit starken Händen, klein mit Draws, halber Pot mit „irgendwas“. Führe im Kopf Buch: Welche Hände zeigt jemand nach welcher Bet-Größe vor? Nach zwei, drei Showdowns liest du seine Einsätze wie ein offenes Buch.',
    category: 'einsatz',
  },
  // ---------- Timing ----------
  {
    icon: '⚡',
    name: 'Insta-Call',
    read: 'Draw oder mittlere Hand – selten ein Monster',
    reliability: 4,
    desc: 'Wer sofort callt, hatte keine schwere Entscheidung: keine starke Hand (sonst käme ein Raise in Betracht), keine schwache (sonst Fold-Überlegung). Meist: Draw oder mittleres Paar. Am River gegen Insta-Caller: dünne Value-Bets funktionieren.',
    category: 'timing',
  },
  {
    icon: '🐌',
    name: 'Langes Überlegen, dann Raise',
    read: 'Meist echt stark',
    reliability: 3,
    desc: 'Die lange Denkpause war selten „Fold oder Raise“, sondern fast immer „Call oder Raise“ – also eine starke Hand, die überlegt, wie sie am meisten verdient. Vorsicht mit deinen Bluff-Catchern.',
    category: 'timing',
  },
  {
    icon: '💨',
    name: 'Sofortiger Check',
    read: 'Schwäche',
    reliability: 3,
    desc: 'Ein Check ohne jede Denkzeit heißt meist: kein Treffer, kein Plan. Nimm dir den Pot mit einer Bet – besonders in Position. Aber merke dir Spieler, die absichtlich schnell mit Monstern checken (Trap), nachdem du es einmal gesehen hast.',
    category: 'timing',
  },
  {
    icon: '🎬',
    name: 'Lange Pause + kleine Bet',
    read: 'Blocking Bet / Unsicherheit',
    reliability: 3,
    desc: 'Wer lange nachdenkt und dann klein setzt, will meist billig zum Showdown oder eine günstige Karte kaufen. Mit starken Händen darfst du hier raisen – die kleine Bet hält selten einem Widerstand stand.',
    category: 'timing',
  },
  // ---------- Sprechverhalten ----------
  {
    icon: '🗣️',
    name: '„Wie viel hast du noch?“',
    read: 'Plant eine große Bet – meist stark',
    reliability: 4,
    desc: 'Die Frage nach deinem Stack ist selten Show: Da plant jemand, dich all-in zu setzen oder eine große Value-Bet zu platzieren. Mit mittleren Händen ist das dein Warnsignal.',
    category: 'reden',
  },
  {
    icon: '🤫',
    name: 'Plötzliches Verstummen',
    read: 'Hat getroffen',
    reliability: 3,
    desc: 'Der redselige Nachbar, der mitten im Satz aufhört, als der Flop kommt, verarbeitet gerade seinen Treffer. Umgekehrt gilt: Wer nach dem Flop plötzlich anfängt zu plaudern, ist oft unbeteiligt – oder blufft und überkompensiert.',
    category: 'reden',
  },
  {
    icon: '🎤',
    name: 'Ungefragte Erklärungen',
    read: 'Eher Schwäche/Bluff',
    reliability: 3,
    desc: '„Ich glaub, du hast eh nichts“, „Ich muss dich mal testen“ – wer seine Bet ungefragt begründet, sucht Bestätigung und will dich zum Folden ODER Callen überreden. Meist steckt keine starke Hand dahinter; starke Hände schweigen und lassen dich raten.',
    category: 'reden',
  },
  // ---------- Homegame-Muster ----------
  {
    icon: '🍺',
    name: '„Einer callt immer“',
    read: 'Bluffe weniger, value-bette dünner',
    reliability: 5,
    desc: 'Das wichtigste Gesetz lockerer Runden: Multiway-Pötte und Callstations machen Bluffs unrentabel. Dein Gewinnplan: mehr Hände auf Value spielen, auch mit Top Pair mittlerer Kicker ruhig dreimal setzen – bezahlt wird sowieso.',
    category: 'homegame',
  },
  {
    icon: '🚂',
    name: 'Limper-Ketten',
    read: 'Mit starken Händen GROSS erhöhen',
    reliability: 4,
    desc: 'Wenn vier Leute für 1 bb mitgehen, macht ein 3-bb-Raise nichts – alle callen. Erhöhe mit deinen starken Händen deutlich größer (5–7 bb): Du wirst immer noch gecallt, aber jetzt von schlechteren Händen in einem Pot, den du dominierst.',
    category: 'homegame',
  },
  {
    icon: '🧲',
    name: 'Paare werden nicht gefoldet',
    read: 'Overcard-Bluffs funktionieren nicht',
    reliability: 4,
    desc: 'Freizeitspieler, die irgendein Paar halten, gehen damit oft bis zum River. Deshalb: Erzähl keine „Geschichten“ mit Barrel-Bluffs – sie werden nicht verstanden. Gewinne stattdessen die Pötte, in denen du wirklich etwas hältst, und zwar konsequent.',
    category: 'homegame',
  },
  {
    icon: '🥴',
    name: 'Stimmung & Alkohol verändern das Spiel',
    read: 'Später am Abend wird looser gespielt',
    reliability: 3,
    desc: 'Nach dem dritten Bier und ein paar verlorenen Pötten spielen viele deutlich looser und aggressiver („Jetzt erst recht!“). Passe dich an: Callstände weiter runter, Value-Bets größer – und beobachte, wer gerade tiltet.',
    category: 'homegame',
  },
  {
    icon: '🪞',
    name: 'Deine eigenen Tells: eine Routine für alles',
    read: 'Gleiches Timing, gleiche Bewegung, gleiche Haltung',
    reliability: 5,
    desc: 'Der einfachste Schutz: Mach alles immer gleich. Schau deine Karten erst an, wenn du dran bist. Warte vor JEDER Aktion drei Sekunden. Setze Chips immer mit derselben Bewegung. Wer keine Abweichungen zeigt, ist nicht lesbar – egal wie aufmerksam der Tisch ist.',
    category: 'homegame',
  },
];
