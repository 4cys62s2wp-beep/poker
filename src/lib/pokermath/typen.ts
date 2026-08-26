/* Die Datenschnittstelle zwischen dem Rechengenerator und der App.
   =================================================================

   Woher die Daten kommen
   ----------------------
   Aus `tools/poker-math/`. Dort wird jede Zahl gerechnet und geprüft; die App
   rechnet **nichts** davon zur Laufzeit nach. `scripts/pokermath-app-daten.mjs`
   erzeugt daraus die schlanke Fassung in `public/pokermath/`, und nur die
   liest die App.

   Warum die Feldnamen deutsch sind
   --------------------------------
   Weil sie im Generator so heißen. Eine Übersetzungsschicht wäre genau die
   Stelle, an der `turn_oder_river` irgendwann auf das Turn-Feld gemappt wird
   und es niemandem auffällt. Die Namen bleiben von der Rechnung bis zum
   Bildschirm dieselben.

   Der Vertrag
   -----------
   Jede Datei trägt `vertrag_version`. Passt sie nicht, **wirft** der Loader.
   Lieber ein sichtbarer Fehler als eine Zahl, deren Bedeutung sich verschoben
   hat.

   Version 2 gegenüber 1: Methode, Annahmen, Bibliothek und Fallzahl sind im
   Block `herkunft` gebündelt, damit „Warum diese Zahl?" daraus speisen kann,
   ohne im Dokument herumzusuchen. */

export const ERWARTETE_VERTRAG_VERSION = 2;

/** Wie viele Karten aus Heldensicht bekannt und unbekannt sind. */
export interface Kartenzahlen {
  deck: number;
  eigene_karten: number;
  unbekannt_nach_flop: number;
  unbekannt_nach_turn: number;
}

export interface Besonderheit {
  schluessel: string;
  satz: string;
}

/** Die Annahmen, unter denen jede Zahl gilt. Sie gehören zur Zahl.
 *
 *  Nicht optional: Eine Wahrscheinlichkeit ohne ihre Annahme ist nicht
 *  ungenau, sondern bedeutungslos. */
export interface Annahmen {
  sicht: string;
  unbekannte_karten: string;
  split_pot: string;
  kartenzahlen: Kartenzahlen;
  /** Was nur für diesen Rechenblock gilt – etwa „saubere Outs" bei B1. */
  besonderheiten: Besonderheit[];
}

/** Alles, was die Oberfläche über die Entstehung einer Zahl sagen kann.
 *
 *  Speist den Bildschirm „Warum diese Zahl?". Was `null` ist, wird dort
 *  **offen benannt** und nicht weggelassen: Eine fehlende Angabe ist selbst
 *  eine Auskunft. */
export interface Herkunft {
  /** `'exakt'` oder `'monte-carlo'`. */
  methode: string;
  erzeugt_am: string;
  zweck: string;
  annahmen: Annahmen;
  /** Welcher Evaluator gerechnet hat. `null`, wo keiner nötig war. */
  bibliothek: { name: string; version: string } | null;
  /** Wie viele Fälle durchgezählt wurden. Derzeit überall `null`,
   *  siehe BLOCKER.md, B-003. */
  faelle_enumeriert: number | null;
  /** Pfad zur vollständigen Fassung mit allen Belegen. */
  quelle: string;
}

export interface Kopf {
  vertrag_version: number;
  block: string;
  herkunft: Herkunft;
}

/** Ein Satz über die Daten, im Generator aus den Daten erzeugt.
 *  Die App darf ihn anzeigen, aber nicht umformulieren. */
export interface Befund {
  schluessel: string;
  aussage: string;
}

// ---------------------------------------------------------------------------
// B1 — Outs
// ---------------------------------------------------------------------------

export interface OutsZeile {
  outs: number;
  /** Der Turn bringt ein Out. 0..1 */
  turn: number;
  /** Der Turn hat verfehlt – der River trifft. 0..1 */
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
  /** Richtig gezählt: hebt die Kategorie UND eine eigene Karte bildet sie mit. */
  outs: number;
  /** Mit Board-Paaren mitgezählt. Nur zum Vergleich zeigen, nie allein. */
  outs_falsch_gezaehlt: number;
}

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
  /** Einsatz als Anteil des Pots, z. B. 0.5 für den halben Pot. */
  einsatz_als_potanteil: number;
  /** Exakt, z. B. `"1/3"` – für die Anzeige, wo 0,333 falsch aussieht. */
  einsatz_als_bruch: string;
  /** Ab dieser Equity lohnt der Call. 0..0,5 */
  noetige_equity: number;
  pot_odds_zu_eins: number;
  /** `null` = mit den geprüften Outs-Zahlen nicht erreichbar. */
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
