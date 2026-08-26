/* Blindstruktur: aus Dauer und Startchips.
   =======================================

   Der Nutzer sagt zwei Dinge: wie lange der Abend dauern soll und wie viele
   Chips jeder bekommt. Den Rest rechnet die App.

   Warum keine Verdopplung je Stufe
   ---------------------------------
   Eine Verdopplung ist der übliche Vorschlag und für einen Heimabend falsch.
   Sie verkürzt das Spiel drastisch: Nach acht Stufen ist der Big Blind das
   128-fache des Anfangs, und wer dann noch dabei ist, spielt Push-or-Fold.
   Der Abend endet nicht, er bricht ab.

   Was stattdessen gerechnet wird
   ------------------------------
   Gesucht ist der Faktor, mit dem sich der Big Blind je Stufe multipliziert,
   so dass am **Ende** ein Finale möglich ist. „Möglich" heißt: Die drei, die
   übrig sind, haben zusammen alle Chips, also im Schnitt

       (Startchips × Spieler) / 3

   und das soll zwischen 12 und 30 Big Blinds sein.

   - Unter 12 Big Blinds gibt es keine Entscheidung mehr, nur noch All-in.
   - Über 30 hat sich nichts zusammengezogen, und der Abend läuft über die
     geplante Zeit hinaus.

   Aus dem Zielwert folgt der Big Blind der letzten Stufe, aus ihm und dem
   Anfang der Faktor:

       Faktor = (BB_letzte / BB_erste) ^ (1 / (Stufen − 1))

   Jede Stufe steigt also um denselben **Anteil** — das ist die gleichmäßige
   Steigung. Eine lineare Steigung wäre ungleichmäßig: Am Anfang wäre der
   Sprung riesig, am Ende kaum spürbar.

   Die Stufen werden anschließend auf bezahlbare Werte gerundet: Der Big Blind
   ist immer ein gerades Vielfaches des kleinsten Chips, damit der Small Blind
   (= BB/2) mit ganzen Chips bezahlbar bleibt. */

/** Wie lang eine Stufe dauert, in Minuten. */
export const VOREINSTELLUNG = {
  gemuetlich: 25,
  normal: 20,
  schnell: 12,
} as const;

export type Tempo = keyof typeof VOREINSTELLUNG;

/** Ziel für den Schluss: durchschnittlicher Stack der letzten Drei, in Big
 *  Blinds. Die Begründung steht im Kopf dieser Datei. */
export const FINALE_SPIELER = 3;
export const ZIEL_BB_MIN = 12;
export const ZIEL_BB_MAX = 30;

/** Der größte Faktor, den eine Stufe haben darf.
 *
 *  1,6 heißt: Der Big Blind wächst je Stufe um 60 Prozent. Das ist spürbar
 *  und noch spielbar. Eine Verdopplung wären 100 Prozent — dann ist nach
 *  wenigen Stufen jeder Stack so klein, dass nur noch All-in bleibt.
 *
 *  Verlangt der Zielwert einen größeren Faktor, wird **nicht** stillschweigend
 *  verdoppelt. Stattdessen bleibt es bei 1,6, `finale_moeglich` wird falsch,
 *  und `noetige_dauer_min` sagt, wie lange es mit dieser Steigung dauern
 *  würde. Der Abend ist dann zu kurz für so viele Startchips — und das ist
 *  eine Auskunft und kein Rechenfehler. */
export const FAKTOR_MAX = 1.6;

export interface Stufe {
  nummer: number;
  sb: number;
  bb: number;
  /** Wann diese Stufe beginnt, in Sekunden ab Start. */
  beginn_s: number;
}

export interface Struktur {
  stufen: Stufe[];
  stufendauer_s: number;
  /** Der Faktor, mit dem der Big Blind je Stufe wächst. */
  faktor: number;
  /** Durchschnittlicher Stack der letzten Drei bei der letzten Stufe, in BB. */
  bb_am_ende: number;
  /** Liegt `bb_am_ende` im angestrebten Bereich? */
  finale_moeglich: boolean;
  /** Wie lange es mit der größten zulässigen Steigung dauern würde, in
   *  Minuten. Nur gesetzt, wenn die geplante Dauer nicht reicht. */
  noetige_dauer_min: number | null;
}

export interface Vorgabe {
  /** Geplante Dauer in Minuten. Regelfall 120 bis 180. */
  dauer_min: number;
  startchips: number;
  spieler: number;
  /** Der kleinste Chip. Er ist zugleich der erste Small Blind. */
  kleinsterChip: number;
  tempo: Tempo;
  /** Blinds bleiben, wie sie sind. Für einen Abend ohne Turnierende. */
  gleichbleibend?: boolean;
}

/** Auf ein gerades Vielfaches des kleinsten Chips runden, mindestens zwei. */
function bezahlbar(bb: number, chip: number): number {
  const vielfaches = Math.max(2, Math.round(bb / chip));
  return (vielfaches % 2 === 0 ? vielfaches : vielfaches + 1) * chip;
}

export function baueStruktur(v: Vorgabe): Struktur {
  const stufendauer_s = VOREINSTELLUNG[v.tempo] * 60;
  const anzahl = Math.max(1, Math.round((v.dauer_min * 60) / stufendauer_s));
  const bbErste = v.kleinsterChip * 2;

  if (v.gleichbleibend) {
    const stufen = Array.from({ length: anzahl }, (_, i) => ({
      nummer: i + 1,
      sb: bbErste / 2,
      bb: bbErste,
      beginn_s: i * stufendauer_s,
    }));
    const bbEnde = (v.startchips * v.spieler) / FINALE_SPIELER / bbErste;
    return {
      stufen,
      stufendauer_s,
      faktor: 1,
      bb_am_ende: bbEnde,
      /* Bei gleichbleibenden Blinds ist das Ende offen — das ist der Zweck
         dieser Einstellung und kein Mangel. */
      finale_moeglich: false,
      noetige_dauer_min: null,
    };
  }

  /* Der Big Blind, bei dem die letzten Drei im Schnitt in der Mitte des
     Zielbereichs liegen. */
  const chipsGesamt = v.startchips * v.spieler;
  const zielBB = (ZIEL_BB_MIN + ZIEL_BB_MAX) / 2;
  const bbLetzte = Math.max(bbErste, chipsGesamt / FINALE_SPIELER / zielBB);

  const gewuenscht = anzahl > 1 ? (bbLetzte / bbErste) ** (1 / (anzahl - 1)) : 1;
  const faktor = Math.min(gewuenscht, FAKTOR_MAX);



  const stufen: Stufe[] = [];
  let vorher = 0;
  for (let i = 0; i < anzahl; i += 1) {
    /* Nach dem Runden kann eine Stufe auf derselben Höhe landen wie die
       vorige. Eine Stufe, bei der sich nichts ändert, ist keine — dann eine
       Sprosse weiter. */
    let bb = bezahlbar(bbErste * faktor ** i, v.kleinsterChip);
    if (bb <= vorher) bb = vorher + 2 * v.kleinsterChip;
    vorher = bb;
    stufen.push({ nummer: i + 1, sb: bb / 2, bb, beginn_s: i * stufendauer_s });
  }

  const bb_am_ende = chipsGesamt / FINALE_SPIELER / stufen[stufen.length - 1].bb;
  const finale_moeglich = bb_am_ende >= ZIEL_BB_MIN && bb_am_ende <= ZIEL_BB_MAX;

  /* Nur wenn es nicht aufgeht: ausrechnen, wie lange es bräuchte. Der
     gedeckelte Faktor allein ist kein Mangel — er kann gedeckelt sein und das
     Ende trotzdem tragen. Erst wenn beides zusammenkommt, ist der Abend zu
     kurz für so viele Startchips, und dann gehört die Zahl genannt statt
     stillschweigend verdoppelt. */
  const noetige_dauer_min = finale_moeglich
    ? null
    : Math.ceil(
      (Math.log(bbLetzte / bbErste) / Math.log(FAKTOR_MAX) + 1)
      * (stufendauer_s / 60));

  return { stufen, stufendauer_s, faktor, bb_am_ende, finale_moeglich, noetige_dauer_min };
}

/** Welche Stufe läuft nach so vielen Sekunden — und wie lange noch? */
export function stufeBei(s: Struktur, verstrichen_s: number): {
  index: number; rest_s: number; letzte: boolean;
} {
  const index = Math.min(
    s.stufen.length - 1,
    Math.floor(verstrichen_s / s.stufendauer_s),
  );
  const rest_s = Math.max(0, (index + 1) * s.stufendauer_s - verstrichen_s);
  return { index, rest_s, letzte: index === s.stufen.length - 1 };
}
