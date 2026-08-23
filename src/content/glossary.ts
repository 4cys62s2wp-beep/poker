// Poker-Glossar für PokerMentor.
// 159 Einträge, alphabetisch sortiert. `related` verweist auf exakte
// `term`-Strings anderer Einträge.

import type { GlossaryEntry } from './types';

const glossary: GlossaryEntry[] = [
  {
    term: 'Aggression Factor',
    definition:
      'Statistik aus Tracking-Programmen, die das Verhältnis von aggressiven Aktionen (Bet, Raise) zu passiven Calls misst. Ein hoher Wert kennzeichnet einen aggressiven, ein niedriger Wert einen passiven Spielstil.',
    category: 'Online',
    related: ['HUD', 'VPIP', 'PFR'],
  },
  {
    term: 'Air',
    definition:
      'Eine Hand ohne jeglichen Wert, die weder ein Paar noch einen brauchbaren Draw hält. Wer mit Air setzt, blufft und verlässt sich vollständig auf Fold Equity.',
    category: 'Slang',
    related: ['Bluff', 'Fold Equity'],
  },
  {
    term: 'All-in',
    definition:
      'Ein Einsatz, bei dem ein Spieler alle verbleibenden Chips in den Pot legt. Danach sind keine weiteren Aktionen dieses Spielers mehr möglich; setzen andere Spieler weiter, entstehen Side Pots.',
    category: 'Aktionen',
    related: ['Side Pot', 'Stack', 'Pot Committed'],
  },
  {
    term: 'Angle Shooting',
    definition:
      'Unfaire Tricks am Rande der Regeln, etwa das Verschleiern der eigenen Stackgröße oder absichtlich mehrdeutige Ansagen. Angle Shooting ist oft nicht direkt verboten, gilt aber als schwerer Verstoß gegen die Poker-Etikette.',
    category: 'Live',
    related: ['String Bet', 'Tell'],
  },
  {
    term: 'Ante',
    definition:
      'Ein Pflichteinsatz, den alle Spieler vor dem Austeilen der Karten zahlen. Antes vergrößern den Pot und erhöhen den Anreiz, um ihn zu kämpfen; in Turnieren sind sie ab den mittleren Levels üblich.',
    category: 'Grundlagen',
    related: ['Blinds', 'Dead Money'],
  },
  {
    term: 'Backdoor',
    definition:
      'Ein Draw, der zwei passende Karten in Folge benötigt, etwa drei Karten einer Farbe am Flop, die noch Turn und River derselben Farbe brauchen. Backdoor-Draws sind für sich genommen schwach, machen eine Hand aber oft gerade stark genug für einen Semi-Bluff.',
    category: 'Grundlagen',
    related: ['Runner-Runner', 'Draw', 'Semi-Bluff'],
  },
  {
    term: 'Bad Beat',
    definition:
      'Eine Niederlage trotz klar besserer Hand zum Zeitpunkt des Einsatzes, weil der Gegner einen unwahrscheinlichen Draw trifft. Bad Beats sind unvermeidbarer Teil der Varianz und kein Zeichen für schlechtes Spiel.',
    category: 'Slang',
    related: ['Suckout', 'Varianz', 'Tilt'],
  },
  {
    term: 'Bankroll',
    definition:
      'Das gesamte Geld, das ein Spieler ausschließlich für Poker reserviert hat. Die Bankroll ist das Betriebskapital und sollte strikt vom übrigen Vermögen getrennt werden.',
    category: 'Grundlagen',
    related: ['Bankroll Management', 'Buy-in'],
  },
  {
    term: 'Bankroll Management',
    definition:
      'Regeln dafür, mit welchem Anteil der Bankroll man an einem Spiel teilnimmt, um das Ruinrisiko trotz Varianz klein zu halten. Übliche Richtwerte sind mindestens 20 bis 30 Buy-ins für Cash Games und deutlich mehr für Turniere.',
    category: 'Strategie',
    related: ['Bankroll', 'Varianz', 'Downswing'],
  },
  {
    term: 'Bet Sizing',
    definition:
      'Die Wahl der Einsatzhöhe, meist angegeben als Anteil der Potgröße. Gutes Bet Sizing berücksichtigt Boardtextur, Ranges und das Ziel des Einsatzes, etwa Value, Bluff oder Protection.',
    category: 'Strategie',
    related: ['Value Bet', 'Overbet', 'Boardtextur'],
  },
  {
    term: 'Blank',
    definition:
      'Eine Turn- oder River-Karte, die die Kräfteverhältnisse voraussichtlich nicht verändert, etwa eine niedrige Karte ohne Flush- oder Straight-Bezug. Auch Brick genannt.',
    category: 'Slang',
    related: ['Boardtextur', 'Scare Card'],
  },
  {
    term: 'Blinds',
    definition:
      'Die beiden Pflichteinsätze links vom Button: Small Blind und Big Blind. Sie erzeugen einen Anfangspot, um den sich das Spiel dreht, und rotieren mit jeder Hand im Uhrzeigersinn.',
    category: 'Grundlagen',
    related: ['Button', 'Ante', 'Position'],
  },
  {
    term: 'Blocker',
    definition:
      'Eine eigene Karte, die die Anzahl möglicher gegnerischer Kombinationen reduziert. Wer etwa das Ass einer Farbe hält, blockiert den Nut Flush des Gegners und kann auf entsprechenden Boards glaubwürdiger bluffen.',
    category: 'Strategie',
    related: ['Combo', 'Range', 'Bluff'],
  },
  {
    term: 'Bluff',
    definition:
      'Ein Einsatz mit einer schwachen Hand, der bessere Hände zum Folden bringen soll. Der Erfolg hängt von Fold Equity, einer glaubwürdigen Story und der Range des Gegners ab.',
    category: 'Strategie',
    related: ['Semi-Bluff', 'Fold Equity', 'Air'],
  },
  {
    term: 'Board',
    definition:
      'Die offen in der Tischmitte liegenden Gemeinschaftskarten: Flop, Turn und River. Alle Spieler kombinieren das Board mit ihren Hole Cards zur bestmöglichen Fünf-Karten-Hand.',
    category: 'Grundlagen',
    related: ['Community Cards', 'Flop', 'Boardtextur'],
  },
  {
    term: 'Boardtextur',
    definition:
      'Die Beschaffenheit der Gemeinschaftskarten, etwa trocken, koordiniert, gepaart oder einfarbig. Die Textur bestimmt, welche Ranges getroffen werden und welche Bet-Größen und Frequenzen sinnvoll sind.',
    category: 'Strategie',
    related: ['Dry Board', 'Wet Board', 'Scare Card'],
  },
  {
    term: 'Bomb Pot',
    definition:
      'Eine Absprache am Live-Tisch, bei der alle Spieler vor der Hand einen festen Betrag einzahlen und die Preflop-Setzrunde übersprungen wird. Der Flop wird direkt aufgedeckt, was große Multiway-Pots erzeugt.',
    category: 'Live',
    related: ['Ante', 'Multiway Pot'],
  },
  {
    term: 'Bounty',
    definition:
      'Kopfgeld in speziellen Turnierformaten: Wer einen Gegner eliminiert, erhält sofort eine Prämie. Bounties verändern die korrekte Strategie, weil Calls gegen kurze Stacks zusätzlichen Wert erhalten.',
    category: 'Turnier',
    related: ['Buy-in', 'MTT'],
  },
  {
    term: 'Broadway',
    definition:
      'Sammelbegriff für die hohen Karten Zehn bis Ass; die Broadway Straight ist die höchstmögliche Straße von Zehn bis Ass. Starthände wie KQ oder AJ werden Broadway-Hände genannt.',
    category: 'Grundlagen',
    related: ['Straight', 'Nuts'],
  },
  {
    term: 'Bubble',
    definition:
      'Die Phase kurz vor den bezahlten Plätzen eines Turniers. Auf der Bubble steigt der ICM-Druck stark: Große Stacks können aggressiv stehlen, kurze Stacks müssen eng spielen.',
    category: 'Turnier',
    related: ['ICM', 'ITM', 'Final Table'],
  },
  {
    term: 'Button',
    definition:
      'Die Dealer-Position, markiert durch eine Scheibe, die nach jeder Hand im Uhrzeigersinn wandert. Der Button handelt postflop als Letzter und ist damit die profitabelste Position am Tisch.',
    category: 'Grundlagen',
    related: ['Position', 'Cutoff', 'Blinds'],
  },
  {
    term: 'Buy-in',
    definition:
      'Der Betrag, mit dem man in ein Cash Game einsteigt oder der als Startgeld eines Turniers fällig wird. In Turnieren enthält der Buy-in meist eine zusätzliche Gebühr für den Veranstalter.',
    category: 'Grundlagen',
    related: ['Bankroll', 'Rake', 'Rebuy'],
  },
  {
    term: 'C-Bet',
    definition:
      'Kurz für Continuation Bet: der Einsatz des Preflop-Aggressors am Flop, der die Initiative fortsetzt. C-Bets funktionieren besonders gut auf trockenen Boards, die die eigene Range besser treffen als die des Gegners.',
    category: 'Aktionen',
    related: ['Open Raise', 'Double Barrel', 'Dry Board'],
  },
  {
    term: 'Call',
    definition:
      'Das Mitgehen eines Einsatzes in gleicher Höhe, um in der Hand zu bleiben. Erhöht danach kein weiterer Spieler, endet die Setzrunde.',
    category: 'Aktionen',
    related: ['Raise', 'Fold', 'Check'],
  },
  {
    term: 'Calling Station',
    definition:
      'Ein passiver Spieler, der zu viele Einsätze mitgeht und kaum foldet oder erhöht. Gegen Calling Stations sind Bluffs unprofitabel; stattdessen sollte konsequent und auch dünn auf Value gesetzt werden.',
    category: 'Slang',
    related: ['Fish', 'Value Bet', 'Loose'],
  },
  {
    term: 'Cash Game',
    definition:
      'Spielform, bei der Chips direkten Geldwert haben und jederzeit ein- und ausgestiegen werden kann. Die Blinds bleiben konstant, im Gegensatz zum Turnier mit steigenden Levels.',
    category: 'Grundlagen',
    related: ['Buy-in', 'MTT'],
  },
  {
    term: 'Check',
    definition:
      'Das Weitergeben des Wortes ohne eigenen Einsatz, möglich nur, wenn in der laufenden Setzrunde noch niemand gesetzt hat. Checken hält den Pot klein und kann auch als Falle dienen.',
    category: 'Aktionen',
    related: ['Check-Raise', 'Slowplay', 'Call'],
  },
  {
    term: 'Check-Raise',
    definition:
      'Erst checken, dann nach dem Einsatz eines Gegners in derselben Setzrunde erhöhen. Der Check-Raise erzeugt maximalen Druck und wird sowohl mit sehr starken Händen als auch als Bluff eingesetzt.',
    category: 'Aktionen',
    related: ['Check', 'Raise', 'Slowplay'],
  },
  {
    term: 'Chip Leader',
    definition:
      'Der Spieler mit dem größten Stack eines Turniers oder Tisches. Chip Leader können gegnerische Stacks bedrohen und besonders auf der Bubble viel Druck ausüben.',
    category: 'Turnier',
    related: ['Stack', 'Bubble'],
  },
  {
    term: 'Chop',
    definition:
      'Die Teilung des Pots zwischen mehreren Spielern mit gleichwertigen Händen. In Turnieren bezeichnet ein Chop auch einen Deal, bei dem die verbliebenen Spieler das Restpreisgeld untereinander aufteilen.',
    category: 'Grundlagen',
    related: ['Showdown', 'Side Pot'],
  },
  {
    term: 'Coin Flip',
    definition:
      'Eine Situation, in der zwei Hände annähernd gleiche Gewinnchancen haben, klassisch ein Paar gegen zwei Overcards mit etwa 50 zu 50. In Turnieren entscheiden solche Flips häufig über das Weiterkommen.',
    category: 'Mathematik',
    related: ['Equity', 'All-in', 'Varianz'],
  },
  {
    term: 'Cold Call',
    definition:
      'Der Call eines Raises, ohne zuvor selbst in den Pot investiert zu haben. Cold Calls sind oft schwächer als eine Three-Bet, weil sie Initiative und Fold Equity aufgeben.',
    category: 'Aktionen',
    related: ['Flat Call', 'Three-Bet'],
  },
  {
    term: 'Combo',
    definition:
      'Eine konkrete Kartenkombination innerhalb einer Hand-Kategorie. AK existiert in 16 Combos, davon 4 suited und 12 offsuit; Pocket-Paare haben je 6 Combos. Combo-Zählen macht Range-Analysen präzise.',
    category: 'Mathematik',
    related: ['Range', 'Blocker'],
  },
  {
    term: 'Community Cards',
    definition:
      'Die für alle sichtbaren Gemeinschaftskarten in der Tischmitte, in Hold\'em maximal fünf. Sie stehen jedem Spieler zur Bildung seiner besten Fünf-Karten-Hand zur Verfügung.',
    category: 'Grundlagen',
    related: ['Board', 'Flop', 'Hole Cards'],
  },
  {
    term: 'Cooler',
    definition:
      'Ein praktisch unvermeidbares Aufeinandertreffen zweier sehr starker Hände, etwa Set gegen Set. Anders als beim Bad Beat macht dabei niemand einen Fehler; der Verlust ist reine Varianz.',
    category: 'Slang',
    related: ['Bad Beat', 'Set', 'Varianz'],
  },
  {
    term: 'Crying Call',
    definition:
      'Ein widerwilliger Call mit einer vermutlich geschlagenen Hand, meist am River gegen einen kleinen Einsatz. Er ist korrekt, wenn die Pot Odds nur eine geringe Gewinnwahrscheinlichkeit erfordern.',
    category: 'Slang',
    related: ['Pot Odds', 'Hero Call'],
  },
  {
    term: 'Cutoff',
    definition:
      'Die Position direkt rechts vom Button und zweitbeste Position am Tisch. Vom Cutoff wird häufig erhöht, um die Blinds zu stehlen oder dem Button die Position abzuschneiden.',
    category: 'Grundlagen',
    related: ['Button', 'Position', 'Steal'],
  },
  {
    term: 'Dead Money',
    definition:
      'Chips im Pot, die von Spielern stammen, die nicht mehr um den Pot kämpfen, etwa aufgegebene Blinds und Limps. Dead Money erhöht den Anreiz für Steals und Squeezes.',
    category: 'Strategie',
    related: ['Ante', 'Steal', 'Squeeze'],
  },
  {
    term: 'Deep Stack',
    definition:
      'Ein Stack von deutlich mehr als 100 Big Blinds. Tiefe Stacks erhöhen die Bedeutung von Position und Implied Odds und machen spekulative Hände wie Suited Connectors wertvoller.',
    category: 'Strategie',
    related: ['Effective Stack', 'Implied Odds', 'Suited Connectors'],
  },
  {
    term: 'Donk Bet',
    definition:
      'Ein Einsatz out of position in den Preflop-Aggressor hinein, bevor dieser seine C-Bet setzen kann. Lange als Anfängerfehler verpönt, ist die Donk Bet auf bestimmten Boardtexturen heute ein legitimer Spielzug.',
    category: 'Aktionen',
    related: ['C-Bet', 'Position'],
  },
  {
    term: 'Double Barrel',
    definition:
      'Die zweite Bet in Folge: Nach einer C-Bet am Flop wird auch am Turn erneut gesetzt. Ein Double Barrel ergibt vor allem auf Turn-Karten Sinn, die die eigene Range stärken oder den Gegner unter Druck setzen.',
    category: 'Aktionen',
    related: ['C-Bet', 'Scare Card'],
  },
  {
    term: 'Downswing',
    definition:
      'Eine längere Verlustphase, in der die Ergebnisse deutlich unter dem Erwartungswert liegen. Downswings treffen auch Gewinnspieler und können je nach Format Zehntausende Hände dauern.',
    category: 'Mathematik',
    related: ['Varianz', 'Upswing', 'Bankroll Management'],
  },
  {
    term: 'Draw',
    definition:
      'Eine unfertige Hand, die noch passende Karten benötigt, um stark zu werden, etwa ein Flush Draw oder ein Straight Draw. Draws werden über Outs, Pot Odds und Implied Odds bewertet.',
    category: 'Grundlagen',
    related: ['Outs', 'Flush Draw', 'OESD'],
  },
  {
    term: 'Dry Board',
    definition:
      'Ein unkoordiniertes Board ohne Flush Draws und mit wenigen Straight-Möglichkeiten, etwa K-7-2 in drei Farben. Auf trockenen Boards sind kleine C-Bets mit hoher Frequenz üblich.',
    category: 'Strategie',
    related: ['Boardtextur', 'Wet Board', 'C-Bet'],
  },
  {
    term: 'Effective Stack',
    definition:
      'Der kleinere der beteiligten Stacks, der bestimmt, wie viel in einer Hand maximal gespielt werden kann. Alle Überlegungen zu Implied Odds und Commitment beziehen sich auf den effektiven Stack.',
    category: 'Strategie',
    related: ['Stack', 'SPR', 'Pot Committed'],
  },
  {
    term: 'Equity',
    definition:
      'Der prozentuale Anteil am Pot, der einer Hand nach ihrer Gewinnwahrscheinlichkeit rechnerisch zusteht. Mit 60 Prozent Equity in einem 100er-Pot beträgt der eigene Anteil im Durchschnitt 60.',
    category: 'Mathematik',
    related: ['EV', 'Outs', 'Coin Flip'],
  },
  {
    term: 'EV',
    definition:
      'Kurz für Expected Value, den Erwartungswert einer Entscheidung: der durchschnittliche Gewinn oder Verlust bei sehr häufiger Wiederholung. Plus-EV-Entscheidungen sind langfristig profitabel, unabhängig vom Ausgang der einzelnen Hand.',
    category: 'Mathematik',
    related: ['Equity', 'Pot Odds', 'Varianz'],
  },
  {
    term: 'Final Table',
    definition:
      'Der letzte Tisch eines Turniers, an dem die höchsten Preisgelder ausgespielt werden. Am Final Table dominieren ICM-Überlegungen, weil jede Platzierung große Geldsprünge bedeutet.',
    category: 'Turnier',
    related: ['ICM', 'MTT', 'Chip Leader'],
  },
  {
    term: 'Fish',
    definition:
      'Bezeichnung für einen schwachen Freizeitspieler mit deutlichen strategischen Schwächen. Fische erkennt man oft an zu vielen gespielten Händen, Limps und passivem Spiel.',
    category: 'Slang',
    related: ['Calling Station', 'Whale', 'Regular'],
  },
  {
    term: 'Flat Call',
    definition:
      'Das bloße Mitgehen eines Einsatzes oder Raises, obwohl auch eine Erhöhung möglich wäre. Geflattet wird etwa, um die eigene Range zu tarnen, Position auszunutzen oder schwächere Spieler in der Hand zu halten.',
    category: 'Aktionen',
    related: ['Cold Call', 'Slowplay'],
  },
  {
    term: 'Float',
    definition:
      'Der Call einer C-Bet mit einer schwachen Hand in der Absicht, den Pot auf einer späteren Straße mit einem Bluff zu übernehmen. Floats funktionieren am besten in Position gegen Spieler, die nach dem Flop häufig aufgeben.',
    category: 'Strategie',
    related: ['C-Bet', 'Bluff', 'Position'],
  },
  {
    term: 'Flop',
    definition:
      'Die ersten drei Gemeinschaftskarten, die gleichzeitig aufgedeckt werden, gefolgt von der zweiten Setzrunde. Der Flop bestimmt den Charakter der Hand maßgeblich.',
    category: 'Grundlagen',
    related: ['Turn', 'River', 'Board'],
  },
  {
    term: 'Flush',
    definition:
      'Fünf Karten derselben Farbe, unabhängig von der Reihenfolge. Der Flush schlägt die Straße und verliert gegen ein Full House; halten mehrere Spieler einen Flush, entscheidet die höchste Karte.',
    category: 'Grundlagen',
    related: ['Flush Draw', 'Full House', 'Straight'],
  },
  {
    term: 'Flush Draw',
    definition:
      'Vier Karten einer Farbe mit neun Outs auf den Flush. Am Flop kommt ein Flush Draw bis zum River in etwa 35 Prozent der Fälle an und eignet sich hervorragend für Semi-Bluffs.',
    category: 'Grundlagen',
    related: ['Draw', 'Outs', 'Semi-Bluff'],
  },
  {
    term: 'Fold',
    definition:
      'Das Aufgeben der Hand; die Karten werden abgelegt und alle bereits getätigten Einsätze bleiben im Pot. Diszipliniertes Folden ist eine der wichtigsten Fähigkeiten im Poker.',
    category: 'Aktionen',
    related: ['Call', 'Muck', 'Fold Equity'],
  },
  {
    term: 'Fold Equity',
    definition:
      'Der Anteil des erwarteten Gewinns, der daraus entsteht, dass der Gegner auf einen Einsatz foldet. Fold Equity macht Semi-Bluffs profitabel, selbst wenn der eigene Draw nicht ankommt.',
    category: 'Strategie',
    related: ['Semi-Bluff', 'Bluff', 'EV'],
  },
  {
    term: 'Four-Bet',
    definition:
      'Die vierte Einsatzstufe: eine Erhöhung gegen eine Three-Bet. Four-Bet-Ranges sind typischerweise polarisiert und bestehen aus Premiumhänden und ausgewählten Bluffs.',
    category: 'Aktionen',
    related: ['Three-Bet', 'Polarisiert', 'Raise'],
  },
  {
    term: 'Freeroll',
    definition:
      'Ein Turnier ohne Buy-in, das trotzdem Preisgeld oder Tickets ausschüttet. Als Freeroll bezeichnet man außerdem eine Situation, in der ein Spieler den Pot nur teilen oder gewinnen, aber nicht mehr verlieren kann.',
    category: 'Turnier',
    related: ['Buy-in', 'Satellite'],
  },
  {
    term: 'Freezeout',
    definition:
      'Ein Turnierformat ohne Rebuy oder Re-Entry: Wer seine Chips verliert, scheidet endgültig aus. Der Klassiker unter den Turnierformaten, etwa beim Main Event der WSOP.',
    category: 'Turnier',
    related: ['Rebuy', 'MTT', 'WSOP'],
  },
  {
    term: 'Full House',
    definition:
      'Ein Drilling plus ein Paar, etwa drei Damen und zwei Fünfen. Das Full House schlägt den Flush und verliert nur gegen Vierling, Straight Flush und höhere Full Houses.',
    category: 'Grundlagen',
    related: ['Set', 'Quads', 'Trips'],
  },
  {
    term: 'Grinder',
    definition:
      'Ein Spieler, der Poker mit hohem Volumen und konstanter Disziplin als Einkommensquelle betreibt. Grinder maximieren ihren Stundensatz oft über viele gleichzeitige Tische oder lange Sessions.',
    category: 'Slang',
    related: ['Regular', 'Win Rate'],
  },
  {
    term: 'GTO',
    definition:
      'Kurz für Game Theory Optimal: eine spieltheoretisch ausbalancierte Strategie, die nicht ausbeutbar ist. GTO dient als Grundgerüst; gegen schwache Gegner ist gezieltes Abweichen (Exploiting) profitabler.',
    category: 'Strategie',
    related: ['Solver', 'Range', 'MDF'],
  },
  {
    term: 'Gutshot',
    definition:
      'Ein Straight Draw, dem genau eine Karte in der Mitte fehlt, mit nur vier Outs. Auch Bauchschuss oder Inside Straight Draw genannt; oft eine sinnvolle Ergänzung für Semi-Bluffs.',
    category: 'Grundlagen',
    related: ['OESD', 'Draw', 'Outs'],
  },
  {
    term: 'Hand History',
    definition:
      'Die automatische Aufzeichnung gespielter Hände durch die Pokerseite oder eine Tracking-Software. Hand Histories sind die Grundlage für Datenbank-Analysen und das gezielte Studium eigener Fehler.',
    category: 'Online',
    related: ['HUD', 'Solver'],
  },
  {
    term: 'Heads-Up',
    definition:
      'Ein Duell zwischen genau zwei Spielern, sei es als eigenes Format oder als Endphase eines Turniers. Heads-Up erfordert sehr weite Ranges und deutlich mehr Aggression als das Spiel am vollen Tisch.',
    category: 'Grundlagen',
    related: ['Position', 'Final Table'],
  },
  {
    term: 'Hero Call',
    definition:
      'Ein mutiger Call mit einer schwachen Hand, die im Kern nur Bluffs schlägt, gestützt auf ein starkes Read, dass der Gegner blufft. Das Gegenstück zum disziplinierten Fold.',
    category: 'Aktionen',
    related: ['Crying Call', 'Bluff', 'Tell'],
  },
  {
    term: 'Hijack',
    definition:
      'Die Position zwei Plätze rechts vom Button, direkt vor dem Cutoff. Ab dem Hijack eröffnen sich zunehmend profitable Steal-Möglichkeiten gegen die Blinds.',
    category: 'Grundlagen',
    related: ['Cutoff', 'Button', 'Position'],
  },
  {
    term: 'Hole Cards',
    definition:
      'Die verdeckten Startkarten eines Spielers, in Texas Hold\'em genau zwei. Nur ihr Besitzer darf sie sehen und mit ihnen zusammen mit dem Board die beste Fünf-Karten-Hand bilden.',
    category: 'Grundlagen',
    related: ['Community Cards', 'Texas Hold\'em'],
  },
  {
    term: 'HUD',
    definition:
      'Kurz für Heads-Up Display: eine Software-Einblendung, die Statistiken über die Gegner in Echtzeit am Online-Tisch anzeigt. Typische HUD-Werte sind VPIP, PFR und Aggression Factor.',
    category: 'Online',
    related: ['VPIP', 'PFR', 'Aggression Factor'],
  },
  {
    term: 'ICM',
    definition:
      'Das Independent Chip Model rechnet Turnierchips in Geldwert um, weil Chips im Turnier nicht linear an Wert gewinnen. ICM erklärt, warum auf der Bubble und am Final Table deutlich enger gespielt werden muss als im Cash Game.',
    category: 'Turnier',
    related: ['Bubble', 'Final Table', 'MTT'],
  },
  {
    term: 'Implied Odds',
    definition:
      'Erweiterte Pot Odds, die zukünftige Gewinne einbeziehen, falls der eigene Draw trifft. Gute Implied Odds rechtfertigen Calls, die nach reinen Pot Odds zu teuer wären, besonders mit tiefen Stacks.',
    category: 'Mathematik',
    related: ['Pot Odds', 'Reverse Implied Odds', 'Set Mining'],
  },
  {
    term: 'Isolation',
    definition:
      'Ein Raise mit dem Ziel, mit einem schwachen Spieler allein im Pot zu landen, typischerweise gegen einen Limper. Der Iso-Raise verdrängt die übrigen Spieler und sichert Initiative und meist auch Position.',
    category: 'Strategie',
    related: ['Limp', 'Open Raise', 'Fish'],
  },
  {
    term: 'ITM',
    definition:
      'Kurz für In the Money: das Erreichen der bezahlten Plätze eines Turniers. Die ITM-Quote allein sagt wenig über den Erfolg aus; entscheidend sind tiefe Läufe und Final-Table-Platzierungen.',
    category: 'Turnier',
    related: ['Bubble', 'ROI', 'Final Table'],
  },
  {
    term: 'Kicker',
    definition:
      'Die Beikarte, die bei ansonsten gleichwertigen Händen den Ausschlag gibt. Treffen zwei Spieler ein Ass-Paar, gewinnt der höhere Kicker; dominierte Hände wie A5 verlieren so regelmäßig gegen AK.',
    category: 'Grundlagen',
    related: ['Top Pair', 'Showdown'],
  },
  {
    term: 'LAG',
    definition:
      'Kurz für Loose-Aggressive: ein Stil mit vielen gespielten Händen und hoher Aggression. Gut umgesetzt ist LAG sehr profitabel, verlangt aber ausgezeichnetes Postflop-Spiel und viel Erfahrung.',
    category: 'Strategie',
    related: ['TAG', 'Loose', 'Maniac'],
  },
  {
    term: 'Limp',
    definition:
      'Der bloße Call des Big Blinds vor dem Flop statt eines Raises. Limpen gilt in den meisten Situationen als schwach, weil es weder Initiative aufbaut noch Fold Equity erzeugt.',
    category: 'Aktionen',
    related: ['Open Raise', 'Isolation'],
  },
  {
    term: 'Loose',
    definition:
      'Ein Spielstil mit überdurchschnittlich vielen gespielten Starthänden. Loose kann aggressiv (LAG) oder passiv (Calling Station) ausgeprägt sein; das Gegenteil ist tight.',
    category: 'Strategie',
    related: ['LAG', 'Calling Station', 'VPIP'],
  },
  {
    term: 'Maniac',
    definition:
      'Ein extrem looser und hyperaggressiver Spieler, der fast jede Hand spielt und permanent Druck macht. Gegen Maniacs gewinnt man, indem man geduldig starke Hände abcallt, statt selbst zu bluffen.',
    category: 'Slang',
    related: ['LAG', 'Tilt'],
  },
  {
    term: 'MDF',
    definition:
      'Kurz für Minimum Defense Frequency: der Mindestanteil der Range, den man gegen einen Einsatz verteidigen muss, damit der Gegner nicht mit jedem beliebigen Bluff automatisch Profit macht. Bei einer potgroßen Bet liegt die MDF bei 50 Prozent.',
    category: 'Mathematik',
    related: ['Fold Equity', 'GTO', 'Pot Odds'],
  },
  {
    term: 'Min-Raise',
    definition:
      'Die kleinstmögliche Erhöhung, also genau das Doppelte des vorherigen Einsatzes. Min-Raises sind vor allem in Turnieren mit kurzen Stacks verbreitet, um günstig Druck aufzubauen.',
    category: 'Aktionen',
    related: ['Raise', 'Open Raise'],
  },
  {
    term: 'MTT',
    definition:
      'Kurz für Multi-Table Tournament: ein Turnier über viele Tische, das bis zum Sieger gespielt wird. MTTs bieten hohe Preisgelder bei hoher Varianz, weil der Großteil des Geldes an den obersten Plätzen liegt.',
    category: 'Turnier',
    related: ['Sit and Go', 'ICM', 'Freezeout'],
  },
  {
    term: 'Muck',
    definition:
      'Der Stapel abgelegter und verbrannter Karten beim Dealer; als Verb das Wegwerfen der eigenen Hand, ohne sie zu zeigen. Berührt eine Hand den Muck, ist sie in der Regel tot.',
    category: 'Grundlagen',
    related: ['Fold', 'Showdown'],
  },
  {
    term: 'Multiway Pot',
    definition:
      'Ein Pot mit drei oder mehr beteiligten Spielern. In Multiway-Pots sinkt der Wert von Bluffs und einzelnen Paaren, während Draws auf die Nuts an Wert gewinnen.',
    category: 'Grundlagen',
    related: ['Heads-Up', 'Nuts'],
  },
  {
    term: 'Nit',
    definition:
      'Ein extrem tighter Spieler, der nur Premiumhände spielt und große Einsätze fast nur mit den Nuts tätigt. Gegen Nits sollte man häufig stehlen und ihre seltene Aggression respektieren.',
    category: 'Slang',
    related: ['TAG', 'Steal', 'Nuts'],
  },
  {
    term: 'Nuts',
    definition:
      'Die bestmögliche Hand auf einem gegebenen Board. Wer die Nuts hält, kann in dieser Setzrunde nicht geschlagen werden und sollte den Pot maximal aufbauen.',
    category: 'Grundlagen',
    related: ['Blocker', 'Slowplay'],
  },
  {
    term: 'OESD',
    definition:
      'Kurz für Open-Ended Straight Draw: ein beidseitig offener Straight Draw mit acht Outs, etwa 9-8 auf 7-6-2. Er kommt bis zum River in rund 31 Prozent der Fälle an.',
    category: 'Grundlagen',
    related: ['Gutshot', 'Draw', 'Outs'],
  },
  {
    term: 'Offsuit',
    definition:
      'Zwei Startkarten unterschiedlicher Farbe, notiert mit einem o wie in AKo. Offsuit-Hände haben zwölf Combos und etwas weniger Equity und Spielbarkeit als die suited Variante.',
    category: 'Grundlagen',
    related: ['Suited', 'Combo'],
  },
  {
    term: 'Open Raise',
    definition:
      'Die erste Erhöhung in einer noch ungeöffneten Preflop-Runde. Übliche Größen liegen zwischen 2 und 3 Big Blinds; die passende Range hängt stark von der eigenen Position ab.',
    category: 'Aktionen',
    related: ['Raise', 'Three-Bet', 'Position'],
  },
  {
    term: 'Outs',
    definition:
      'Die Karten im Deck, die die eigene Hand voraussichtlich zur Gewinnerhand verbessern. Mit der Vier-und-Zwei-Regel lassen sich Outs schnell in eine Trefferwahrscheinlichkeit umrechnen.',
    category: 'Mathematik',
    related: ['Draw', 'Equity', 'Pot Odds'],
  },
  {
    term: 'Overbet',
    definition:
      'Ein Einsatz, der größer ist als der aktuelle Pot. Overbets üben maximalen Druck aus und werden meist mit einer polarisierten Range aus sehr starken Händen und Bluffs gespielt.',
    category: 'Aktionen',
    related: ['Polarisiert', 'Bet Sizing', 'Value Bet'],
  },
  {
    term: 'Overcard',
    definition:
      'Eine Hole Card, die höher ist als alle Karten des Boards, oder eine Boardkarte über dem eigenen Paar. Zwei Overcards gegen ein kleineres Paar sind der klassische Coin Flip.',
    category: 'Grundlagen',
    related: ['Coin Flip', 'Overpair'],
  },
  {
    term: 'Overpair',
    definition:
      'Ein Pocket Pair, das höher ist als alle Gemeinschaftskarten, etwa QQ auf J-8-3. Overpairs sind meist stark, geraten auf koordinierten Boards aber schnell unter Druck.',
    category: 'Grundlagen',
    related: ['Pocket Pair', 'Top Pair', 'Wet Board'],
  },
  {
    term: 'PFR',
    definition:
      'Kurz für Preflop Raise: der Prozentsatz der Hände, mit denen ein Spieler vor dem Flop erhöht. Zusammen mit VPIP charakterisiert PFR den Spielstil; eine große Lücke zwischen beiden Werten deutet auf passives Spiel hin.',
    category: 'Online',
    related: ['VPIP', 'HUD', 'Aggression Factor'],
  },
  {
    term: 'Pocket Pair',
    definition:
      'Zwei gleichrangige Hole Cards, etwa zwei Achten. Kleine Pocket Pairs werden oft per Set Mining gespielt, große Pocket Pairs zählen zu den Premiumhänden.',
    category: 'Grundlagen',
    related: ['Set', 'Set Mining', 'Overpair'],
  },
  {
    term: 'Polarisiert',
    definition:
      'Eine Range, die nur aus sehr starken Händen und Bluffs besteht, ohne mittelstarke Hände dazwischen. Polarisierte Ranges setzen groß; das Gegenteil ist eine kondensierte oder merged Range.',
    category: 'Strategie',
    related: ['Range', 'Overbet', 'Four-Bet'],
  },
  {
    term: 'Position',
    definition:
      'Die Sitzreihenfolge relativ zum Button, die bestimmt, wer in den Setzrunden zuletzt handelt. Wer in Position ist, sieht die Aktionen der Gegner zuerst und realisiert dadurch deutlich mehr Equity.',
    category: 'Strategie',
    related: ['Button', 'Cutoff', 'Under the Gun'],
  },
  {
    term: 'Pot Committed',
    definition:
      'Der Zustand, in dem der bereits investierte Anteil des Stacks so groß ist, dass ein Fold rechnerisch kaum noch korrekt sein kann. Wer pot committed ist, callt praktisch jede verbleibende Bet.',
    category: 'Strategie',
    related: ['Pot Odds', 'SPR', 'All-in'],
  },
  {
    term: 'Pot Odds',
    definition:
      'Das Verhältnis zwischen Potgröße und dem zu zahlenden Einsatz, umgerechnet in die benötigte Gewinnwahrscheinlichkeit. Muss man 20 in einen 80er-Pot zahlen, sind 20 Prozent Equity für einen Call nötig.',
    category: 'Mathematik',
    related: ['Implied Odds', 'Equity', 'Outs'],
  },
  {
    term: 'Preflop',
    definition:
      'Die erste Setzrunde nach dem Austeilen der Hole Cards und vor dem Flop. Preflop-Entscheidungen folgen weitgehend standardisierten Ranges je nach Position.',
    category: 'Grundlagen',
    related: ['Flop', 'Open Raise', 'Hole Cards'],
  },
  {
    term: 'Probe Bet',
    definition:
      'Ein Einsatz out of position am Turn oder River, nachdem der Preflop-Aggressor am Flop auf seine C-Bet verzichtet hat. Die Probe Bet greift die gezeigte Schwäche gezielt an.',
    category: 'Aktionen',
    related: ['C-Bet', 'Donk Bet'],
  },
  {
    term: 'Protection',
    definition:
      'Setzen mit einer gemachten, aber verwundbaren Hand, damit Draws und Overcards keine günstigen weiteren Karten sehen. Protection ist auf nassen Boards besonders wichtig.',
    category: 'Strategie',
    related: ['Value Bet', 'Wet Board', 'Draw'],
  },
  {
    term: 'Quads',
    definition:
      'Vierling: alle vier Karten eines Rangs, etwa vier Könige. Quads werden nur von einem Straight Flush oder höheren Quads geschlagen und sind entsprechend selten.',
    category: 'Grundlagen',
    related: ['Full House', 'Set'],
  },
  {
    term: 'Rainbow',
    definition:
      'Ein Flop mit drei verschiedenen Farben, auf dem kein direkter Flush Draw möglich ist. Rainbow-Boards sind tendenziell trocken und begünstigen häufig den Preflop-Aggressor.',
    category: 'Grundlagen',
    related: ['Dry Board', 'Boardtextur'],
  },
  {
    term: 'Raise',
    definition:
      'Die Erhöhung eines bestehenden Einsatzes. Ein Raise baut den Pot auf, erzeugt Fold Equity und zwingt die Gegner zu schwierigen Entscheidungen.',
    category: 'Aktionen',
    related: ['Open Raise', 'Check-Raise', 'Three-Bet'],
  },
  {
    term: 'Rake',
    definition:
      'Die Gebühr, die der Betreiber vom Pot oder vom Turnier-Buy-in einbehält. Der Rake senkt die Win Rate aller Spieler; Rakeback-Programme erstatten einen Teil davon zurück.',
    category: 'Grundlagen',
    related: ['Buy-in', 'Win Rate'],
  },
  {
    term: 'Range',
    definition:
      'Die Gesamtheit aller Hände, die ein Spieler in einer bestimmten Situation plausibel halten kann. Gute Spieler denken nicht in einzelnen Händen, sondern weisen Gegnern Ranges zu und verengen sie mit jeder Aktion.',
    category: 'Strategie',
    related: ['Combo', 'Polarisiert', 'GTO'],
  },
  {
    term: 'Rebuy',
    definition:
      'Der Nachkauf von Chips in Turnieren mit entsprechender Option, meist begrenzt auf eine feste Frühphase. Beim verwandten Re-Entry steigt man nach dem Ausscheiden komplett neu in das Turnier ein.',
    category: 'Turnier',
    related: ['Freezeout', 'Buy-in'],
  },
  {
    term: 'Regular',
    definition:
      'Ein Stammspieler, der regelmäßig und meist mit solidem Standardspiel an denselben Limits spielt. Kurzform Reg; das Gegenstück zum Freizeitspieler.',
    category: 'Slang',
    related: ['Grinder', 'Fish', 'TAG'],
  },
  {
    term: 'Reverse Implied Odds',
    definition:
      'Das Risiko, in späteren Setzrunden zusätzlich zu verlieren, obwohl die eigene Hand trifft, weil der Gegner dann eine noch bessere Hand hält. Typisch für dominierte Draws wie kleine Flush Draws.',
    category: 'Mathematik',
    related: ['Implied Odds', 'Kicker', 'Draw'],
  },
  {
    term: 'River',
    definition:
      'Die fünfte und letzte Gemeinschaftskarte, gefolgt von der letzten Setzrunde. Am River gibt es keine Draws mehr; jede Bet ist entweder Value oder Bluff.',
    category: 'Grundlagen',
    related: ['Turn', 'Showdown', 'Board'],
  },
  {
    term: 'River Rat',
    definition:
      'Spöttische Bezeichnung für einen Spieler, der mit schwachen Draws mitgeht und auffällig oft erst am River die Gewinnerhand trifft. Der Begriff gehört zum Umfeld von Suckout und Bad Beat.',
    category: 'Slang',
    related: ['Suckout', 'Bad Beat', 'Fish'],
  },
  {
    term: 'ROI',
    definition:
      'Kurz für Return on Investment: der durchschnittliche Gewinn im Verhältnis zum eingesetzten Buy-in, meist in Prozent angegeben. Ein Turnier-ROI von 20 Prozent bedeutet im Schnitt 20 Gewinn je 100 Buy-in.',
    category: 'Mathematik',
    related: ['Win Rate', 'ITM', 'Buy-in'],
  },
  {
    term: 'Royal Flush',
    definition:
      'Die höchstmögliche Hand: ein Straight Flush von Zehn bis Ass in einer Farbe. Ein Royal Flush ist unschlagbar und extrem selten.',
    category: 'Grundlagen',
    related: ['Straight', 'Flush', 'Nuts'],
  },
  {
    term: 'Run it Twice',
    definition:
      'Vereinbarung, nach einem All-in die verbleibenden Karten zweimal auszuteilen und den Pot je zur Hälfte auszuspielen. Das senkt die Varianz, ohne den Erwartungswert zu verändern.',
    category: 'Live',
    related: ['All-in', 'Varianz'],
  },
  {
    term: 'Runner-Runner',
    definition:
      'Ein Draw, der mit Turn und River zwei passende Karten in Folge trifft, etwa ein Backdoor Flush. Runner-Runner-Treffer sind selten und ein häufiger Auslöser von Bad-Beat-Geschichten.',
    category: 'Grundlagen',
    related: ['Backdoor', 'Suckout'],
  },
  {
    term: 'Rush/Zoom',
    definition:
      'Fast-Fold-Pokervarianten, bei denen man nach jedem Fold sofort an einen neuen Tisch mit einer neuen Hand versetzt wird. Das Format vervielfacht das Handvolumen und reduziert die Bedeutung von Reads und History.',
    category: 'Online',
    related: ['Hand History', 'Grinder'],
  },
  {
    term: 'Satellite',
    definition:
      'Ein Qualifikationsturnier, dessen Preise Tickets für ein teureres Turnier sind statt Geld. Im Satellite zählt nur das Erreichen der Ticketplätze, was extreme ICM-Anpassungen erfordert.',
    category: 'Turnier',
    related: ['ICM', 'Buy-in', 'WSOP'],
  },
  {
    term: 'Scare Card',
    definition:
      'Eine Turn- oder River-Karte, die viele Draws vervollständigt oder starke Hände plötzlich bedroht, etwa eine dritte Karte einer Farbe oder ein Ass. Scare Cards sind gute Kandidaten für Bluffs.',
    category: 'Strategie',
    related: ['Blank', 'Boardtextur', 'Double Barrel'],
  },
  {
    term: 'Semi-Bluff',
    definition:
      'Ein Einsatz mit einem Draw, der aktuell noch hinten liegt, aber zur besten Hand werden kann. Semi-Bluffs gewinnen auf zwei Wegen: sofort durch Folds des Gegners oder später durch das Treffen des Draws.',
    category: 'Strategie',
    related: ['Bluff', 'Fold Equity', 'Flush Draw'],
  },
  {
    term: 'Set',
    definition:
      'Ein Drilling aus einem Pocket Pair und einer passenden Boardkarte. Sets sind stark versteckt und gehören zu den profitabelsten Händen im No-Limit Hold\'em.',
    category: 'Grundlagen',
    related: ['Trips', 'Set Mining', 'Pocket Pair'],
  },
  {
    term: 'Set Mining',
    definition:
      'Das Callen mit kleinen Pocket Pairs vor dem Flop allein in der Hoffnung, ein Set zu treffen. Die Trefferchance liegt bei rund 12 Prozent, daher braucht Set Mining tiefe Stacks und gute Implied Odds.',
    category: 'Strategie',
    related: ['Set', 'Implied Odds', 'Pocket Pair'],
  },
  {
    term: 'Short Stack',
    definition:
      'Ein vergleichsweise kleiner Stack, im Cash Game etwa 40 Big Blinds oder weniger, in Turnieren oft unter 20. Kurze Stacks vereinfachen das Spiel in Richtung Push-or-Fold und entwerten spekulative Hände.',
    category: 'Strategie',
    related: ['Deep Stack', 'All-in', 'Stack'],
  },
  {
    term: 'Showdown',
    definition:
      'Das Aufdecken der Hände nach der letzten Setzrunde, wenn mindestens zwei Spieler verbleiben. Die beste Fünf-Karten-Hand gewinnt den Pot; bei Gleichstand wird geteilt.',
    category: 'Grundlagen',
    related: ['Muck', 'River', 'Chop'],
  },
  {
    term: 'Showdown Value',
    definition:
      'Der Wert einer Hand, die am Showdown gelegentlich gewinnt, aber zu schwach für eine Value Bet ist, etwa ein mittleres Paar. Hände mit Showdown Value checkt man meist, statt mit ihnen zu bluffen.',
    category: 'Strategie',
    related: ['Value Bet', 'Bluff', 'Showdown'],
  },
  {
    term: 'Side Pot',
    definition:
      'Ein Nebenpot, der entsteht, wenn ein Spieler all-in ist und die übrigen Spieler weitersetzen. Der All-in-Spieler kann nur den Hauptpot gewinnen, an dem er beteiligt ist.',
    category: 'Grundlagen',
    related: ['All-in', 'Chop'],
  },
  {
    term: 'Sit and Go',
    definition:
      'Ein Turnier ohne festen Startzeitpunkt, das beginnt, sobald genügend Spieler angemeldet sind, oft an einem einzigen Tisch. Klassische Sit and Gos bezahlen die ersten drei Plätze.',
    category: 'Turnier',
    related: ['MTT', 'Heads-Up', 'ICM'],
  },
  {
    term: 'Slowplay',
    definition:
      'Das bewusst passive Spielen einer sehr starken Hand, um Gegner in Sicherheit zu wiegen und später zu kassieren. Slowplay lohnt vor allem auf trockenen Boards gegen aggressive Gegner; auf nassen Boards ist es riskant.',
    category: 'Strategie',
    related: ['Check-Raise', 'Nuts', 'Dry Board'],
  },
  {
    term: 'Snap Call',
    definition:
      'Ein sofortiger Call ohne jede Bedenkzeit, meist mit einer sehr starken Hand oder in einer eindeutigen Situation. Die Geschwindigkeit einer Aktion kann im Live-Spiel selbst ein Tell sein.',
    category: 'Slang',
    related: ['Tell', 'Hero Call'],
  },
  {
    term: 'Solver',
    definition:
      'Software, die für definierte Spielsituationen näherungsweise spieltheoretisch optimale Strategien berechnet. Solver haben das moderne Pokerstudium geprägt, ersetzen aber kein Verständnis der Grundprinzipien.',
    category: 'Online',
    related: ['GTO', 'Range', 'Hand History'],
  },
  {
    term: 'SPR',
    definition:
      'Kurz für Stack-to-Pot Ratio: das Verhältnis des effektiven Stacks zur Potgröße am Flop. Ein niedriger SPR begünstigt Commitment mit einem Paar, ein hoher SPR verlangt stärkere Hände für große Pots.',
    category: 'Mathematik',
    related: ['Effective Stack', 'Pot Committed'],
  },
  {
    term: 'Squeeze',
    definition:
      'Eine Three-Bet gegen einen Open Raise plus mindestens einen Caller. Der Squeeze nutzt das Dead Money im Pot und die durch das Callen geschwächten Ranges der Beteiligten aus.',
    category: 'Aktionen',
    related: ['Three-Bet', 'Dead Money', 'Cold Call'],
  },
  {
    term: 'Stack',
    definition:
      'Die gesamten Chips eines Spielers am Tisch. Die Stackgröße, gemessen in Big Blinds, bestimmt maßgeblich die korrekte Strategie.',
    category: 'Grundlagen',
    related: ['Effective Stack', 'Short Stack', 'Deep Stack'],
  },
  {
    term: 'Steal',
    definition:
      'Ein Raise aus später Position mit dem primären Ziel, Blinds und Antes ohne Gegenwehr einzusammeln. Steals sind mit steigenden Blinds ein zentraler Gewinnfaktor in Turnieren.',
    category: 'Strategie',
    related: ['Blinds', 'Cutoff', 'Button'],
  },
  {
    term: 'Straddle',
    definition:
      'Ein freiwilliger Blindeinsatz in doppelter Höhe des Big Blinds vor dem Austeilen, meist aus der Position links vom Big Blind. Der Straddler erhält dafür preflop die letzte Aktion; faktisch verdoppelt der Straddle die Spielhöhe.',
    category: 'Live',
    related: ['Blinds', 'Position'],
  },
  {
    term: 'Straight',
    definition:
      'Fünf Karten in lückenloser Reihenfolge, unabhängig von der Farbe, etwa 5-6-7-8-9. Das Ass kann oben (Broadway) oder unten (Wheel: A-2-3-4-5) verwendet werden.',
    category: 'Grundlagen',
    related: ['Broadway', 'OESD', 'Gutshot'],
  },
  {
    term: 'String Bet',
    definition:
      'Ein regelwidriger Einsatz in mehreren Nachschüben ohne vorherige Ansage. Im Live-Poker zählt dann nur die erste Bewegung; die Regel verhindert das Ablesen gegnerischer Reaktionen zwischen den Teilbeträgen.',
    category: 'Live',
    related: ['Angle Shooting', 'Tell'],
  },
  {
    term: 'Suckout',
    definition:
      'Das Gewinnen einer Hand als klarer Außenseiter durch eine späte Glückskarte. Aus Sicht des Verlierers ist derselbe Vorgang ein Bad Beat.',
    category: 'Slang',
    related: ['Bad Beat', 'River Rat', 'Runner-Runner'],
  },
  {
    term: 'Suited',
    definition:
      'Zwei Startkarten derselben Farbe, notiert mit einem s wie in AKs. Suited-Hände haben vier Combos und dank Flush-Potenzial mehr Equity und Spielbarkeit als Offsuit-Hände.',
    category: 'Grundlagen',
    related: ['Offsuit', 'Suited Connectors', 'Flush Draw'],
  },
  {
    term: 'Suited Connectors',
    definition:
      'Aufeinanderfolgende Karten derselben Farbe wie 87s. Sie treffen Straßen und Flushes und spielen sich am besten in Position mit tiefen Stacks und guten Implied Odds.',
    category: 'Grundlagen',
    related: ['Suited', 'Implied Odds', 'Deep Stack'],
  },
  {
    term: 'Table Image',
    definition:
      'Das Bild, das die Gegner vom eigenen Spielstil haben, geprägt durch gezeigte Hände und beobachtete Frequenzen. Ein tightes Image verleiht Bluffs mehr Glaubwürdigkeit; ein wildes Image bringt mehr Action auf Value-Hände.',
    category: 'Strategie',
    related: ['Tell', 'Bluff', 'Value Bet'],
  },
  {
    term: 'TAG',
    definition:
      'Kurz für Tight-Aggressive: ein Stil mit sorgfältig ausgewählten Starthänden, die dann konsequent aggressiv gespielt werden. TAG gilt als solides Grundgerüst für Einsteiger und niedrige Limits.',
    category: 'Strategie',
    related: ['LAG', 'Nit', 'Regular'],
  },
  {
    term: 'Tell',
    definition:
      'Ein unbewusstes Verhalten, das Rückschlüsse auf die Handstärke zulässt, etwa Zittern, Atmung oder die Geschwindigkeit einer Bet. Live-Tells sind wertvoll, sollten aber nur als Zusatzinformation zur Strategie dienen.',
    category: 'Live',
    related: ['Table Image', 'Snap Call'],
  },
  {
    term: 'Texas Hold\'em',
    definition:
      'Die weltweit populärste Pokervariante: zwei verdeckte Hole Cards, bis zu fünf Gemeinschaftskarten und vier Setzrunden. Gespielt wird meist ohne Einsatzobergrenze als No-Limit Hold\'em.',
    category: 'Grundlagen',
    related: ['Hole Cards', 'Community Cards'],
  },
  {
    term: 'Three-Bet',
    definition:
      'Die dritte Einsatzstufe: eine Erhöhung gegen einen Open Raise, wobei der Big Blind als erste Bet zählt. Three-Bets werden für Value und als Bluff gespielt und sind ein Kernstück aggressiver Preflop-Strategie.',
    category: 'Aktionen',
    related: ['Open Raise', 'Four-Bet', 'Squeeze'],
  },
  {
    term: 'Tilt',
    definition:
      'Ein emotionaler Zustand, meist nach Bad Beats oder Verlustserien, in dem Entscheidungen von Frust statt Logik gesteuert werden. Tilt-Kontrolle ist ein entscheidender Teil des Mentalspiels; im Zweifel hilft eine Pause.',
    category: 'Slang',
    related: ['Bad Beat', 'Downswing', 'Varianz'],
  },
  {
    term: 'Time Bank',
    definition:
      'Ein zusätzliches Zeitkontingent für schwierige Entscheidungen im Online-Poker, das die normale Bedenkzeit verlängert. Je nach Format wird die Time Bank pro Hand oder pro Level aufgefüllt.',
    category: 'Online',
    related: ['Snap Call', 'Rush/Zoom'],
  },
  {
    term: 'Top Pair',
    definition:
      'Ein Paar mit der höchsten Boardkarte, etwa AK auf A-9-4. Top Pair mit gutem Kicker ist meist eine Value-Hand für ein bis zwei Setzrunden, aber selten für einen riesigen Pot.',
    category: 'Grundlagen',
    related: ['Kicker', 'Overpair', 'Value Bet'],
  },
  {
    term: 'Trips',
    definition:
      'Ein Drilling aus einer eigenen Karte und einem Paar auf dem Board. Trips sind offensichtlicher und wegen möglicher Kicker-Probleme etwas schwächer als ein Set.',
    category: 'Grundlagen',
    related: ['Set', 'Kicker'],
  },
  {
    term: 'Turn',
    definition:
      'Die vierte Gemeinschaftskarte, gefolgt von der dritten Setzrunde. Am Turn wachsen die Einsatzgrößen deutlich und die Ranges beider Spieler werden erheblich enger.',
    category: 'Grundlagen',
    related: ['Flop', 'River', 'Double Barrel'],
  },
  {
    term: 'Under the Gun',
    definition:
      'Die Position direkt links vom Big Blind, die preflop als Erste handeln muss. UTG erfordert die engste Eröffnungsrange, weil alle anderen Spieler noch hinter einem sitzen.',
    category: 'Grundlagen',
    related: ['Position', 'Open Raise'],
  },
  {
    term: 'Upswing',
    definition:
      'Eine Phase, in der die Ergebnisse deutlich über dem Erwartungswert liegen. Upswings fühlen sich wie Können an, sind aber ebenso ein Produkt der Varianz wie Downswings.',
    category: 'Mathematik',
    related: ['Downswing', 'Varianz'],
  },
  {
    term: 'Value Bet',
    definition:
      'Ein Einsatz mit der vermutlich besten Hand, der von schlechteren Händen bezahlt werden soll. Die Kunst besteht darin, die Größe so zu wählen, dass die gegnerische Range maximal bezahlt.',
    category: 'Aktionen',
    related: ['Bluff', 'Bet Sizing', 'Showdown Value'],
  },
  {
    term: 'Varianz',
    definition:
      'Die natürliche Schwankung der Ergebnisse um den Erwartungswert, im Englischen Variance. Wegen der Varianz sagen kurze Zeiträume fast nichts über die Spielstärke aus; entscheidend ist der langfristige EV.',
    category: 'Mathematik',
    related: ['EV', 'Downswing', 'Upswing'],
  },
  {
    term: 'Villain',
    definition:
      'Neutrale Bezeichnung für den Gegner in einer Handbesprechung, während der betrachtete Spieler Hero heißt. Der Begriff wertet nicht, sondern strukturiert die Analyse.',
    category: 'Slang',
    related: ['Hero Call', 'Range'],
  },
  {
    term: 'VPIP',
    definition:
      'Kurz für Voluntarily Put Money In Pot: der Prozentsatz der Hände, in denen ein Spieler freiwillig Geld investiert. VPIP ist die wichtigste Kennzahl für die Looseness eines Spielers; solide Regulars liegen meist bei 20 bis 28 Prozent.',
    category: 'Online',
    related: ['PFR', 'HUD', 'Loose'],
  },
  {
    term: 'Wet Board',
    definition:
      'Ein stark koordiniertes Board mit vielen möglichen Draws, etwa 9-8-7 mit zwei Karten einer Farbe. Auf nassen Boards sind größere Einsätze zur Protection üblich, und die Equities liegen enger beieinander.',
    category: 'Strategie',
    related: ['Dry Board', 'Boardtextur', 'Protection'],
  },
  {
    term: 'Whale',
    definition:
      'Ein sehr schwacher Spieler mit sehr viel Geld, der an hohen Limits große Summen verliert. Whales sind oft der Grund, warum ganze Runden hoher Cash Games überhaupt zustande kommen.',
    category: 'Slang',
    related: ['Fish', 'Calling Station'],
  },
  {
    term: 'Win Rate',
    definition:
      'Die durchschnittliche Gewinnrate, in Cash Games meist gemessen in Big Blinds pro 100 Hände (bb/100). Eine belastbare Win Rate erfordert wegen der Varianz sehr große Stichproben.',
    category: 'Mathematik',
    related: ['ROI', 'Varianz', 'EV'],
  },
  {
    term: 'WSOP',
    definition:
      'Die World Series of Poker in Las Vegas, die größte und traditionsreichste Turnierserie der Welt mit dem Main Event als Höhepunkt. Sieger erhalten neben dem Preisgeld ein Bracelet, die prestigeträchtigste Trophäe im Poker.',
    category: 'Turnier',
    related: ['MTT', 'Freezeout', 'Satellite'],
  },
];

export default glossary;
