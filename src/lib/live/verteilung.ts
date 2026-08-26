/* Chipverteilung aus vorhandenem Material.
   =======================================

   Ausgangspunkt ist nicht, was schön wäre, sondern was auf dem Tisch liegt:
   ein Koffer, manchmal zwei, mit einer bestimmten Zahl Chips je Farbe.

   Zwei Regeln aus der Praxis
   --------------------------
   **Der kleinste Chip ist der Small Blind.** Sonst muss jemand für den Small
   Blind Wechselgeld suchen, und zwar in jeder Hand. Ein Chip, der kleiner ist
   als der Small Blind, hat keinen Zweck; einer, der größer ist, macht die
   erste Stunde zur Rechnerei.

   **Die Wertleiter bleibt grob.** Fünf Stufen sind am Tisch handhabbar, acht
   nicht. Wer feiner abstuft, gewinnt Genauigkeit, die niemand braucht, und
   verliert Übersicht, die alle brauchen: Beim Setzen muss man den Wert eines
   Stapels auf einen Blick sehen.

   Was hier NICHT passiert
   -----------------------
   Es wird nichts verteilt, was es nicht gibt. Jede ausgegebene Menge wird
   gegen den Koffer gerechnet; reicht er nicht, sagt das Ergebnis es und nennt
   die größte Spielerzahl, für die es reicht. */

/** Eine Chipsorte, so wie sie im Koffer liegt. */
export interface Sorte {
  /** Frei wählbarer Name — „rot", „grün", was auf dem Chip steht. */
  name: string;
  /** Wie viele davon insgesamt da sind. */
  anzahl: number;
}

export interface Eingabe {
  sorten: Sorte[];
  spieler: number;
  /** Was jeder einzahlt, in Euro. Ohne Angabe wird kein Kurs gerechnet. */
  euroJeSpieler?: number;
}

export interface SortenPlan {
  name: string;
  /** Der Wert eines Chips dieser Sorte, in Punkten. */
  wert: number;
  /** Wie viele jeder Spieler bekommt. */
  jeSpieler: number;
  /** Wie viele im Koffer sind. */
  imKoffer: number;
  /** Was nach dem Austeilen übrig bleibt — die Bank für Wechselgeld. */
  uebrig: number;
}

export type Hinweis =
  | 'material-reicht-nicht'
  | 'wenige-kleine-chips'
  | 'eine-sorte-bleibt-liegen';

export interface Verteilung {
  sorten: SortenPlan[];
  /** Was jeder Spieler an Punkten bekommt. */
  startchips: number;
  smallBlind: number;
  bigBlind: number;
  /** Nur wenn Geld im Spiel ist: wie viele Punkte ein Euro wert ist. */
  punkteJeEuro: number | null;
  /** Die größte Spielerzahl, für die das Material reicht. */
  maxSpieler: number;
  reicht: boolean;
  hinweise: Hinweis[];
}

/* Die grobe Leiter. Fünf Stufen, jede das Fünffache der vorigen — das ist
   die Abstufung, die man ohne Nachdenken im Kopf hat: fünf Rote sind ein
   Grüner. Eine Leiter mit 1, 2, 5, 10, 20, 50 wäre feiner und am Tisch
   unbrauchbar, weil man beim Setzen rechnen müsste. */
export const LEITER = [1, 5, 25, 100, 500];

/* Wie viele der kleinsten Sorte ein Spieler mindestens braucht.
   Rechnung: In einer Runde am Tisch zahlt er einmal Small Blind (1 Chip) und
   einmal Big Blind (2 Chips), zusammen 3. Zwei Runden hält eine Blindstufe
   ungefähr, macht 6. Dazu 2 Stück, um einmal wechseln zu können, ohne die
   Bank zu bemühen. */
export const MIN_KLEINSTE_JE_SPIELER = 8;

/** Die größte Spielerzahl, für die das Material reicht. */
export function maxSpieler(sorten: Sorte[]): number {
  const brauchbar = sorten.filter((s) => s.anzahl > 0);
  if (brauchbar.length === 0) return 0;
  /* Die häufigste Sorte wird die kleinste (siehe `verteile`), und von ihr
     braucht jeder MIN_KLEINSTE_JE_SPIELER. Von jeder anderen mindestens
     einen — eine Sorte, von der niemand etwas bekommt, ist keine Sorte. */
  const sortiert = [...brauchbar].sort((a, b) => b.anzahl - a.anzahl);
  const grenzen = sortiert.map((s, i) =>
    Math.floor(s.anzahl / (i === 0 ? MIN_KLEINSTE_JE_SPIELER : 1)));
  return Math.max(0, Math.min(...grenzen));
}

/**
 * Verteilt den Koffer.
 *
 * Die häufigste Sorte bekommt den kleinsten Wert. Das ist keine Konvention,
 * sondern folgt aus dem Koffer: Von den kleinen Chips liegen immer die
 * meisten drin, weil man sie am häufigsten braucht.
 */
export function verteile({ sorten, spieler, euroJeSpieler }: Eingabe): Verteilung | null {
  const brauchbar = sorten.filter((s) => s.anzahl > 0 && s.name.trim() !== '');
  if (spieler < 2 || brauchbar.length === 0) return null;

  /* Grob halten: Mehr Sorten als Leiterstufen werden nicht bewertet — die
     seltensten bleiben im Koffer. Am Tisch fünf Werte auseinanderzuhalten ist
     das Äußerste. */
  const nachHaeufigkeit = [...brauchbar].sort((a, b) => b.anzahl - a.anzahl);
  const genutzt = nachHaeufigkeit.slice(0, LEITER.length);
  const liegenGeblieben = nachHaeufigkeit.length > LEITER.length;

  const plan: SortenPlan[] = genutzt.map((s, i) => {
    const wert = LEITER[i];
    const jeSpieler = Math.floor(s.anzahl / spieler);
    return {
      name: s.name,
      wert,
      jeSpieler,
      imKoffer: s.anzahl,
      uebrig: s.anzahl - jeSpieler * spieler,
    };
  });

  const startchips = plan.reduce((s, p) => s + p.jeSpieler * p.wert, 0);
  const smallBlind = LEITER[0];
  const bigBlind = smallBlind * 2;

  const grenze = maxSpieler(brauchbar);
  const reicht = spieler <= grenze && plan.every((p) => p.jeSpieler > 0);

  const hinweise: Hinweis[] = [];
  if (!reicht) hinweise.push('material-reicht-nicht');
  else if (plan[0].jeSpieler < MIN_KLEINSTE_JE_SPIELER) hinweise.push('wenige-kleine-chips');
  if (liegenGeblieben) hinweise.push('eine-sorte-bleibt-liegen');

  return {
    sorten: plan,
    startchips,
    smallBlind,
    bigBlind,
    punkteJeEuro: euroJeSpieler && euroJeSpieler > 0
      ? startchips / euroJeSpieler
      : null,
    maxSpieler: grenze,
    reicht,
    hinweise,
  };
}
