import type { ReactNode } from 'react';

/* Der Levelring — Fortschritt als Bild statt als Satz.
   ===================================================

   Bisher stand da „Level 1 · Neuling · nächstes Level: 150 XP". Drei
   Angaben in einer Zeile, die man lesen muss, um zu erfahren, dass man am
   Anfang steht. Ein Ring sagt dasselbe, bevor man liest: Wie weit er
   herumgeht, ist der Fortschritt; was in der Mitte steht, ist der Rang.

   Warum ein Ring und kein Balken
   ------------------------------
   Ein Balken hat einen Anfang und ein Ende und wirkt wie eine Strecke, die
   man abarbeitet. Ein Ring schließt sich und fängt wieder an — genau das
   tut ein Level. Und ein Ring hat eine Mitte, in der die Zahl stehen kann,
   ohne dass daneben noch eine Beschriftung nötig wäre.

   In dieser Datei stehen Zahlen — und zwar nur geometrische: die Maße des
   Kreises im SVG-Koordinatensystem. Sie sind keine Aussage über Poker und
   keine über Gestaltung; sie legen fest, wie ein Kreis gezeichnet wird.
   Die sichtbare Größe kommt von außen. */

interface Props {
  /** Was in der Mitte steht — eine Zahl, oder ein Zeichen, wenn die Stufe
   *  fertig ist (dann ist die Nummer keine Auskunft mehr). */
  wert: ReactNode;
  /** Wie weit der Ring gefüllt ist, 0 bis 1. */
  anteil: number;
  /** Kantenlänge in Pixeln. Kommt aus der Gestaltung, nicht von hier. */
  groesse?: number;
  /** Beschreibt den Ring für Screenreader — er ist sonst nur ein Bild. */
  beschriftung: string;
  className?: string;
}

/* Das SVG rechnet in einem eigenen Koordinatensystem von 0 bis 100. Der
   Radius ist so gewählt, dass die Strichstärke innen und außen Platz hat. */
const MITTE = 50;
const RADIUS = 42;
const UMFANG = 2 * Math.PI * RADIUS;

export function Levelring({ wert, anteil, groesse = 56, beschriftung, className }: Props) {
  const geklemmt = Math.max(0, Math.min(1, anteil));
  return (
    <div
      className={`levelring${className ? ` ${className}` : ''}`}
      style={{ width: groesse, height: groesse }}
      role="img"
      aria-label={beschriftung}
    >
      <svg viewBox="0 0 100 100" aria-hidden="true">
        {/* Die Bahn: zeigt, wie weit es überhaupt geht. Ohne sie wüsste man
            bei einem Viertel nicht, ob das viel oder wenig ist. */}
        <circle className="bahn" cx={MITTE} cy={MITTE} r={RADIUS} />
        <circle
          className="fuellung"
          cx={MITTE}
          cy={MITTE}
          r={RADIUS}
          strokeDasharray={`${UMFANG * geklemmt} ${UMFANG}`}
          /* Beginn oben statt rechts: Ein Fortschritt, der bei drei Uhr
             anfängt, wird als schon begonnen gelesen. */
          transform={`rotate(-90 ${MITTE} ${MITTE})`}
        />
      </svg>
      <span className="mitte" aria-hidden="true">{wert}</span>
    </div>
  );
}
