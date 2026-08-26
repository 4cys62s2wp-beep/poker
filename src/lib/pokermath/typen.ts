/* Die Datenschnittstelle zwischen dem Rechengenerator und der App.
   =================================================================

   Woher die Daten kommen
   ----------------------
   Aus `tools/poker-math/`. Dort wird jede Zahl gerechnet und geprüft; die App
   rechnet **nichts** davon zur Laufzeit nach. Der Generator schreibt eine
   verschlankte Fassung nach `public/pokermath/`, und nur die liest die App.

   Warum die Feldnamen deutsch sind
   --------------------------------
   Weil sie im Generator so heißen. Eine Übersetzungsschicht wäre genau die
   Stelle, an der `turn_oder_river` irgendwann auf das Turn-Feld gemappt wird
   und es niemandem auffällt. Die Namen bleiben von der Rechnung bis zum
   Bildschirm dieselben.

   Der Vertrag
   -----------
   Jede Datei trägt `vertrag_version`. Passt sie nicht zu
   `ERWARTETE_VERTRAG_VERSION`, wird die Datei **abgelehnt** statt halb
   verstanden. Lieber keine Zahl als eine, deren Bedeutung sich verschoben hat.

   Erhöht wird die Version, wenn ein Feld verschwindet oder seine Bedeutung
   wechselt. Ein neues Feld allein ist kein Grund – was die App nicht kennt,
   ignoriert sie. */

/** Muss zu `VERTRAG_VERSION` in `tools/poker-math/src/app_schnittstelle.py` passen. */
export const ERWARTETE_VERTRAG_VERSION = 1;

/** Die Annahmen, unter denen jede Zahl gilt. Sie gehören zur Zahl.
 *
 *  Diese Felder sind **nicht** optional: Eine Wahrscheinlichkeit ohne ihre
 *  Annahme ist nicht ungenau, sondern bedeutungslos. Die App zeigt sie an,
 *  wo sie Zahlen zeigt. */
export interface Annahmen {
  /** Aus wessen Sicht gerechnet wurde. */
  sicht: string;
  /** Wie viele Karten als unbekannt gelten und warum. */
  unbekannte_karten: string;
  /** Wie geteilte Pötte gezählt werden. */
  split_pot: string;
}

export interface Kopf {
  vertrag_version: number;
  block: string;
  /** `'exakt'` oder `'monte-carlo'`. Bei Schätzungen gehört die Unsicherheit
   *  sichtbar dazu – die App darf sie nicht als exakte Zahl darstellen. */
  methode: 'exakt' | 'monte-carlo';
  erzeugt_am: string;
  annahmen: Annahmen;
  /** Wo die vollständige Fassung mit allen Belegen liegt. */
  quelle: string;
}

/** Ein Satz über die Daten, im Generator aus den Daten erzeugt.
 *  Die App darf ihn anzeigen, aber nicht umformulieren – er gehört den Zahlen. */
export interface Befund {
  schluessel: string;
  aussage: string;
}

// ---------------------------------------------------------------------------
// B1 — Outs
// ---------------------------------------------------------------------------

export interface OutsZeile {
  outs: number;
  /** Wahrscheinlichkeit, dass der Turn ein Out bringt. 0..1 */
  turn: number;
  /** Der Turn hat verfehlt – wie oft trifft der River? 0..1 */
  river_nach_fehlschlag: number;
  /** Mindestens eine der beiden Straßen trifft. 0..1 */
  turn_oder_river: number;
  /** Was die 2/4-Faustregel für zwei Karten verspricht. 0..1 */
  regel_zwei_karten: number;
  /** Regel minus Wirklichkeit, in Prozentpunkten. Positiv = zu viel versprochen. */
  regel_abweichung_pp: number;
}

export interface Zugbild {
  name: string;
  hand: string;
  flop: string;
  zielkategorie: string;
  /** Richtig gezählt: Die Karte hebt die Kategorie UND eine eigene Karte bildet sie mit. */
  outs: number;
  /** Zählt man Paare mit, die nur auf dem Board liegen. Zum Vergleich – nicht anzeigen
   *  ohne den Unterschied zu erklären. */
  outs_falsch_gezaehlt: number;
}

/** Ein Fall, in dem ein gezähltes Out die eigene Hand verbessert und man
 *  trotzdem verliert. Nachgerechnet, nicht ausgedacht. */
export interface Gegenbeispiel {
  name: string;
  hand: string;
  flop: string;
  out: string;
  gegner: string;
  hero_nachher: string;
  gegner_nachher: string;
  erklaerung: string;
}

export interface B1Outs extends Kopf {
  outs: OutsZeile[];
  zugbilder: Zugbild[];
  gegenbeispiele: Gegenbeispiel[];
  befunde: Befund[];
}

// ---------------------------------------------------------------------------
// B2 — Pot Odds
// ---------------------------------------------------------------------------

export interface EinsatzZeile {
  name: string;
  /** Der Einsatz als Anteil des Pots, z. B. 0.5 für den halben Pot. */
  einsatz_als_potanteil: number;
  /** Derselbe Wert exakt, z. B. `"1/3"`. Für die Anzeige, wo 0,333 falsch aussieht. */
  einsatz_als_bruch: string;
  /** Ab dieser Equity lohnt der Call. 0..1 */
  noetige_equity: number;
  /** Die Sprechweise „X zu 1". */
  pot_odds_zu_eins: number;
  /** `null` = mit bis zu 21 Outs nicht erreichbar. */
  mindest_outs_turn: number | null;
  mindest_outs_river: number | null;
  mindest_outs_beide: number | null;
}

export interface B2PotOdds extends Kopf {
  einsatzgroessen: EinsatzZeile[];
  befunde: Befund[];
}

// ---------------------------------------------------------------------------
// B3 — Kombinatorik
// ---------------------------------------------------------------------------

export interface BlockerZeile {
  bekannte_karten: number;
  ohne_blocker: number;
  schlimmstenfalls: number;
  bestenfalls: number;
  im_mittel: number;
}

export interface StarthandAmBoard {
  hand: string;
  typ: string;
  vorher: number;
  nachher: number;
  weggeblockt: number;
}

export interface B3Kombinatorik extends Kopf {
  kombos_je_typ: Record<string, number>;
  klassen_je_typ: Record<string, number>;
  gesamt: { starthand_klassen: number; zweikartenblaetter: number };
  blocker: Record<'Paar' | 'suited' | 'offsuit', BlockerZeile[]>;
  beispiel: {
    hand: string;
    board: string;
    summe_vorher: number;
    summe_nachher: number;
    je_starthand: StarthandAmBoard[];
  };
  befunde: Befund[];
}

// ---------------------------------------------------------------------------
// B4 — Preflop-Equity
// ---------------------------------------------------------------------------

/** Eine Farbkonfiguration eines Handpaars.
 *
 *  Warum das überhaupt einzeln steht: AKs gegen QJs ist eine andere Rechnung,
 *  wenn beide Hände dieselbe Farbe teilen – geteilte Farbe senkt beider
 *  Flush-Potenzial. Ein einzelner Mittelwert verwischt das. */
export interface Farbkonfiguration {
  /** Lesbar, z. B. „A suited, B suited, gleiche Farbe". */
  beziehung: string;
  /** Wie viele konkrete Kartenpaarungen diese Konfiguration hat. */
  haeufigkeit: number;
  equity_a: number;
}

export interface Matchup {
  /** Starthand-Kürzel, z. B. `"AKs"`. */
  a: string;
  b: string;
  /** Gewichteter Mittelwert über alle Farbkonfigurationen. 0..1 */
  equity_a: number;
  /** Abstand zwischen höchster und niedrigster Konfiguration, in Prozentpunkten. */
  spanne_pp: number;
  /**
   * Ist das wahr, darf die App **keinen Einzelwert ohne die Spanne zeigen**.
   * Dann liegen auch `farbkonfigurationen` bei.
   */
  spanne_relevant: boolean;
  farbkonfigurationen?: Farbkonfiguration[];
}

export interface B4Equity extends Kopf {
  hinweis_zur_spanne: string;
  matchups: Matchup[];
  befunde: Befund[];
}
