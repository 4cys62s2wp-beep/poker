/* Der Aufgabengenerator des Pot-Odds-Drills.
   =========================================

   Warum das hier liegt und nicht im Bildschirm
   --------------------------------------------
   Der Bildschirm (`src/pages/trainers/PotOddsDrill.tsx`) enthält **keine
   einzige Ziffer**. Das ist keine Marotte, sondern die Regel dieses Projekts:
   Jede Zahl, die die App zeigt, ist im Generator unter `tools/poker-math/`
   gerechnet worden. Stünde in der Oberfläche `0.25`, wäre nicht mehr
   nachweisbar, woher das kommt.

   Also: Was rechnet, steht hier. Was zeigt, steht dort. Ein Test liest die
   `.tsx`-Datei und schlägt fehl, sobald darin eine Ziffer auftaucht.

   Was hier gerechnet wird — und was nicht
   ---------------------------------------
   Gerechnet wird hier **nichts** über Poker. Alle Wahrscheinlichkeiten
   kommen fertig aus B1 (`turn`, `turn_oder_river`) und alle Schwellen aus B2
   (`noetige_equity`, `mindest_outs_*`). Diese Datei sucht die passenden
   Zeilen heraus, bildet die Differenz und stellt die Situation zusammen.

   Die einzige freie Größe ist die **Potgröße**. Sie ist keine Poker-Tatsache,
   sondern der Maßstab der Aufgabe: Ob im Topf 24 oder 48 Big Blinds liegen,
   ändert an der Rechnung nichts — nur das Verhältnis zählt, und das kommt
   aus B2. Deshalb darf sie hier frei gewählt werden. */

import type {
  B1Outs,
  B2PotOdds,
  EinsatzZeile,
  OutsZeile,
  Zugbild,
} from '../pokermath/typen';
import { bruchTeile } from '../pokermath/bruch';

/* ── Der Maßstab ─────────────────────────────────────────────────────────
   In Big Blinds, damit keine Währung nötig ist. Die Spanne ist so gewählt,
   dass der Topf nach einer normalen Hand aussieht: unter zehn wirkt es wie
   ein Blindsteal, über hundert wie ein Turnierfinale. Beides lenkt ab. */
const POT_MIN_BB = 12;
const POT_MAX_BB = 96;

/** Ab welchem Abstand ein Fall nicht mehr „knapp" heißt, in Prozentpunkten.
 *
 *  Derselbe Schwellenwert wie in K3 für die Farbspanne: Unter einem
 *  Prozentpunkt ist der Unterschied kleiner als das, was ein Mensch am Tisch
 *  je abschätzen kann. Die App nennt solche Fälle beim Namen, statt eine
 *  Sicherheit vorzutäuschen, die die Zahl nicht hergibt. */
export const GRENZFALL_PP = 1.0;

/** Ein Zustand beschreibt eine Aufgabe vollständig.
 *
 *  Drei kleine Zahlen — mehr braucht es nicht. Genau deshalb passt der
 *  Zustand später in eine Adresse (Aufgabe 4): Wer den Link öffnet, bekommt
 *  dieselbe Aufgabe, ohne dass irgendwo ein Server etwas gespeichert hätte. */
export interface DrillZustand {
  /** Index in `b1.zugbilder` — welche Hand an welchem Flop. */
  zugbild: number;
  /** Index in `b2.einsatzgroessen` — wie groß der Gegner setzt. */
  einsatz: number;
  /** Vielfaches des Bruchnenners. Der Topf ist `nenner × potFaktor` Big Blinds. */
  potFaktor: number;
}

export interface Aufgabe {
  zustand: DrillZustand;
  zugbild: Zugbild;
  einsatz: EinsatzZeile;
  outsZeile: OutsZeile;
  /** Die eigenen Karten, einzeln. */
  hand: string[];
  /** Die drei Flopkarten, einzeln. */
  flop: string[];
  /** Was im Topf liegt, bevor der Gegner setzt. In Big Blinds. */
  pot: number;
  /** Was der Gegner setzt. In Big Blinds, immer ganzzahlig. */
  einsatzBetrag: number;
  /** Was im Topf läge, wenn beide bezahlt haben. Nur zur Anzeige. */
  endpot: number;
}

export interface Aufloesung {
  /** Trifft bis zum River. Aus B1, Feld `turn_oder_river`. */
  equity: number;
  /** Trifft schon auf dem Turn. Aus B1, Feld `turn`. */
  equityTurn: number;
  /** Was dieser Einsatz verlangt. Aus B2, Feld `noetige_equity`. */
  noetig: number;
  /** `equity − noetig`, in Prozentpunkten. Positiv heißt: der Call lohnt. */
  abstandPp: number;
  /** Lohnt der Call? */
  lohnt: boolean;
  /** Liegt der Abstand unter `GRENZFALL_PP`? Dann ist die Antwort ein Münzwurf. */
  grenzfall: boolean;
  /** So viele Outs bräuchte es mindestens. Aus B2, Feld `mindest_outs_beide`. */
  mindestOuts: number | null;
}

// ---------------------------------------------------------------------------
// Brüche
// ---------------------------------------------------------------------------

/** Die erlaubten Vielfachen des Nenners, damit der Topf im Maßstab bleibt. */
export function potFaktorSpanne(nenner: number): { min: number; max: number } {
  const min = Math.ceil(POT_MIN_BB / nenner);
  const max = Math.floor(POT_MAX_BB / nenner);
  /* Kann nicht eintreten, solange die Spanne breiter als der größte Nenner
     ist — aber ein stiller leerer Bereich wäre schlimmer als ein Fehler. */
  if (max < min) throw new Error(`Kein passender Topf für Nenner ${nenner}`);
  return { min, max };
}

// ---------------------------------------------------------------------------
// Aufgabe bauen
// ---------------------------------------------------------------------------

function karten(text: string): string[] {
  return text.trim().split(/\s+/);
}

/** Baut aus einem Zustand die vollständige Aufgabe.
 *
 *  Wirft, wenn der Zustand nicht zu den Daten passt. Das ist der Fall, den
 *  eine geteilte Adresse aus einer älteren Fassung erzeugen kann — dann ist
 *  ein sichtbarer Fehler besser als eine stillschweigend andere Aufgabe. */
export function baueAufgabe(b1: B1Outs, b2: B2PotOdds, zustand: DrillZustand): Aufgabe {
  const zugbild = b1.zugbilder[zustand.zugbild];
  if (!zugbild) throw new Error(`Zugbild ${zustand.zugbild} gibt es nicht`);
  const einsatz = b2.einsatzgroessen[zustand.einsatz];
  if (!einsatz) throw new Error(`Einsatzgröße ${zustand.einsatz} gibt es nicht`);

  const outsZeile = b1.outs.find((z) => z.outs === zugbild.outs);
  if (!outsZeile) throw new Error(`Für ${zugbild.outs} Outs steht keine Zeile in B1`);

  const { zaehler, nenner } = bruchTeile(einsatz.einsatz_als_bruch);
  const spanne = potFaktorSpanne(nenner);
  if (!Number.isInteger(zustand.potFaktor)
      || zustand.potFaktor < spanne.min || zustand.potFaktor > spanne.max) {
    throw new Error(
      `Potfaktor ${zustand.potFaktor} liegt außerhalb von ${spanne.min}..${spanne.max}`,
    );
  }

  const pot = nenner * zustand.potFaktor;
  const einsatzBetrag = zaehler * zustand.potFaktor;
  return {
    zustand,
    zugbild,
    einsatz,
    outsZeile,
    hand: karten(zugbild.hand),
    flop: karten(zugbild.flop),
    pot,
    einsatzBetrag,
    endpot: pot + einsatzBetrag + einsatzBetrag,
  };
}

/** Die Auflösung. Sie rechnet nichts über Poker – sie vergleicht zwei Zahlen,
 *  die beide fertig aus den Daten kommen.
 *
 *  Warum `turn_oder_river` und nicht `turn`
 *  ----------------------------------------
 *  Zwei Gründe, beide aus den Daten:
 *
 *  1. Über alle acht Zugbilder und alle acht Einsatzgrößen lohnt der Call in
 *     der Zwei-Karten-Lesart in genau der Hälfte der Fälle. In der
 *     Turn-Lesart lohnt er in weniger als einem Fünftel. Ein Drill, bei dem
 *     „nein" fast immer richtig ist, bringt einem den falschen Reflex bei.
 *     Der Test `haelt die Aufgaben im Gleichgewicht` prüft das nach.
 *  2. Es ist die Lesart, für die B2 `mindest_outs_beide` mitliefert.
 *
 *  Was dabei angenommen wird, steht nicht hier, sondern in der Auflösung auf
 *  dem Bildschirm: Wer bis zum River sieht, geht davon aus, auf dem Turn
 *  nicht noch einmal bezahlen zu müssen. Der Turn-Wert steht deshalb
 *  daneben. */
export function loese(aufgabe: Aufgabe): Aufloesung {
  const equity = aufgabe.outsZeile.turn_oder_river;
  const noetig = aufgabe.einsatz.noetige_equity;
  const abstandPp = (equity - noetig) * 100;
  return {
    equity,
    equityTurn: aufgabe.outsZeile.turn,
    noetig,
    abstandPp,
    lohnt: equity >= noetig,
    grenzfall: Math.abs(abstandPp) < GRENZFALL_PP,
    mindestOuts: aufgabe.einsatz.mindest_outs_beide,
  };
}

// ---------------------------------------------------------------------------
// Auswahl
// ---------------------------------------------------------------------------

/** Ganzzahl aus `[min, max]`, beide Enden eingeschlossen. */
function ganzzahlBis(zufall: () => number, min: number, max: number): number {
  return min + Math.floor(zufall() * (max - min + 1));
}

/** Zieht einen Zustand.
 *
 *  Gleichverteilt über alle Zugbilder und Einsatzgrößen — die Mischung aus
 *  „lohnt" und „lohnt nicht" ergibt sich dann von selbst aus den Daten und
 *  muss nicht nachgeholfen werden.
 *
 *  `nichtZugbild` verhindert nur, dass zweimal hintereinander dasselbe Bild
 *  kommt. Das ist keine Statistik, sondern Anstand: Dieselbe Hand direkt noch
 *  einmal fühlt sich nach einem Fehler der App an. */
export function ziehZustand(
  b1: B1Outs,
  b2: B2PotOdds,
  zufall: () => number = Math.random,
  nichtZugbild?: number,
): DrillZustand {
  const auswahl = b1.zugbilder
    .map((_, i) => i)
    .filter((i) => i !== nichtZugbild || b1.zugbilder.length === 1);
  const zugbild = auswahl[ganzzahlBis(zufall, 0, auswahl.length - 1)];
  const einsatz = ganzzahlBis(zufall, 0, b2.einsatzgroessen.length - 1);
  const { nenner } = bruchTeile(b2.einsatzgroessen[einsatz].einsatz_als_bruch);
  const spanne = potFaktorSpanne(nenner);
  return { zugbild, einsatz, potFaktor: ganzzahlBis(zufall, spanne.min, spanne.max) };
}

// ---------------------------------------------------------------------------
// Anzeige
// ---------------------------------------------------------------------------

/** Ein Anteil als Prozentzahl mit einer Nachkommastelle.
 *
 *  Eine Stelle, nicht zwei: Der Unterschied zwischen 34,97 % und 34,9 % ist
 *  für keine Entscheidung am Tisch relevant, aber zwei Nachkommastellen
 *  suggerieren eine Genauigkeit, die die Annahmen nicht hergeben. Wer den
 *  vollen Wert will, findet ihn über die Herkunftsanzeige. */
export function alsProzent(anteil: number, sprache: string): string {
  return new Intl.NumberFormat(sprache, {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(anteil);
}

/** Prozentpunkte mit Vorzeichen, z. B. „+9,7 pp". */
export function alsProzentpunkte(pp: number, sprache: string): string {
  const zahl = new Intl.NumberFormat(sprache, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    signDisplay: 'always',
  }).format(pp);
  return `${zahl} pp`;
}

/** Eine ganze Zahl Big Blinds. */
export function alsBB(betrag: number, sprache: string): string {
  return new Intl.NumberFormat(sprache, { maximumFractionDigits: 0 }).format(betrag);
}
