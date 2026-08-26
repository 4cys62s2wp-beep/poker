/* Auszahlungsstruktur für einen Heimturnier-Abend.
   =================================================

   Das Problem, das diese Datei löst
   ---------------------------------
   Am Ende eines Abends steht ein Topf und die Frage, wer wie viel bekommt.
   Wird sie erst dann gestellt, streitet der Tisch – jeder rechnet anders, und
   der Sieger hat naturgemäß die großzügigste Meinung. Deshalb gehört diese
   Rechnung an den ANFANG des Abends.

   Reine Rechnung, keine Seiteneffekte, keine Oberfläche. Damit ist sie
   prüfbar, und die Oberfläche kann dumm bleiben.

   Warum diese Anteile
   -------------------
   Die Prozentsätze folgen dem, was sich in Heimspielen bewährt hat und was
   auch große Turniere näherungsweise verwenden: Je größer das Feld, desto
   mehr Plätze werden bezahlt, aber der Sieger bekommt relativ weniger. Eine
   Faustregel, die überall gilt: **etwa jeder zehnte Spieler wird bezahlt,
   mindestens aber einer.**

   Bewusst NICHT enthalten: Deals, ICM-Rechnungen, Bounty-Strukturen. Das sind
   Turnierthemen, keine Heimspielthemen – und ICM ohne laufende Stacks wäre
   eine Zahl, die so tut, als wüsste sie etwas. */

/** Die Anteile je Feldgröße, von Platz 1 abwärts. Summe jeweils exakt 1. */
const STRUKTUREN: Array<{ abSpieler: number; anteile: number[] }> = [
  // Bis 5 Spieler: Nur der Sieger. Bei so kleinen Feldern ist alles andere
  // Symbolpolitik – der zweite Platz bekäme weniger, als er eingezahlt hat.
  { abSpieler: 2, anteile: [1] },
  // Ab 6: Zwei Plätze. Der zweite bekommt etwa sein Buy-in zurück und mehr.
  { abSpieler: 6, anteile: [0.65, 0.35] },
  // Ab 10: Drei Plätze.
  { abSpieler: 10, anteile: [0.5, 0.3, 0.2] },
  // Ab 16: Vier Plätze.
  { abSpieler: 16, anteile: [0.4, 0.27, 0.19, 0.14] },
  // Ab 25: Fünf Plätze.
  { abSpieler: 25, anteile: [0.36, 0.24, 0.17, 0.13, 0.1] },
  // Ab 40: Sechs Plätze.
  { abSpieler: 40, anteile: [0.32, 0.22, 0.155, 0.115, 0.095, 0.095] },
];

export interface Auszahlung {
  /** Platz, 1-basiert. */
  platz: number;
  /** Betrag in derselben Einheit wie das Buy-in. Ganzzahlig, wenn `rundung` gesetzt. */
  betrag: number;
  /** Anteil am Topf, 0..1 – für die Anzeige „36 %". */
  anteil: number;
}

export interface AuszahlungsPlan {
  /** Gesamter Topf (Spieler × Buy-in + Rebuys). */
  topf: number;
  /** Wie viele Plätze Geld sehen. */
  bezahltePlaetze: number;
  auszahlungen: Auszahlung[];
  /** Was durch die Rundung übrig blieb und auf Platz 1 gelegt wurde. */
  rundungsrest: number;
}

export interface AuszahlungsEingabe {
  spieler: number;
  buyIn: number;
  /** Zusätzliche Buy-ins (Rebuys/Add-ons) über die Grundeinzahlung hinaus. */
  rebuys?: number;
  /**
   * Auf welches Vielfache gerundet wird. 0 oder undefined = gar nicht runden.
   * Sinnvoll ist der kleinste Schein oder die kleinste Münze, die am Tisch
   * liegt – krumme Beträge auszuzahlen dauert länger als das Turnier.
   */
  rundung?: number;
}

/** Die passende Struktur für eine Feldgröße. */
export function strukturFuer(spieler: number): number[] {
  let gewaehlt = STRUKTUREN[0].anteile;
  for (const s of STRUKTUREN) {
    if (spieler >= s.abSpieler) gewaehlt = s.anteile;
  }
  return gewaehlt;
}

function istEndlich(n: unknown): n is number {
  return typeof n === 'number' && Number.isFinite(n);
}

/**
 * Den Auszahlungsplan rechnen.
 *
 * Unbrauchbare Eingaben liefern einen leeren Plan statt zu werfen: Die
 * Oberfläche zeigt beim Tippen ständig Zwischenstände („1 Spieler", leeres
 * Feld), und dafür ist eine Ausnahme das falsche Werkzeug.
 */
export function berechneAuszahlung(e: AuszahlungsEingabe): AuszahlungsPlan {
  const spieler = istEndlich(e.spieler) ? Math.floor(e.spieler) : 0;
  const buyIn = istEndlich(e.buyIn) ? e.buyIn : 0;
  const rebuys = istEndlich(e.rebuys) ? Math.max(0, Math.floor(e.rebuys)) : 0;
  const rundung = istEndlich(e.rundung) && e.rundung > 0 ? e.rundung : 0;

  const leer: AuszahlungsPlan = { topf: 0, bezahltePlaetze: 0, auszahlungen: [], rundungsrest: 0 };
  if (spieler < 2 || buyIn <= 0) return leer;

  const topf = (spieler + rebuys) * buyIn;
  const anteile = strukturFuer(spieler);

  if (rundung <= 0) {
    return {
      topf,
      bezahltePlaetze: anteile.length,
      auszahlungen: anteile.map((a, i) => ({ platz: i + 1, betrag: topf * a, anteil: a })),
      rundungsrest: 0,
    };
  }

  /* Gerundet wird ABWÄRTS, und der Rest geht an Platz 1. Aufrunden könnte
     mehr ausschütten, als im Topf liegt – und ein Plan, der mehr verspricht
     als da ist, ist schlimmer als ein krummer Betrag. */
  const gerundet = anteile.map((a) => Math.floor((topf * a) / rundung) * rundung);
  const rest = topf - gerundet.reduce((s, b) => s + b, 0);
  gerundet[0] += rest;

  return {
    topf,
    bezahltePlaetze: anteile.length,
    auszahlungen: gerundet.map((betrag, i) => ({
      platz: i + 1,
      betrag,
      // Der ausgewiesene Anteil folgt dem TATSÄCHLICHEN Betrag, nicht der
      // Tabelle – sonst stünde neben „36 %" ein Betrag, der es nicht ist.
      anteil: topf > 0 ? betrag / topf : 0,
    })),
    rundungsrest: rest,
  };
}
