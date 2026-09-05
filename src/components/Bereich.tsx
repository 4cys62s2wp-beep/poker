/* Die Bereichskachel — ein Weg, der zeigt, wohin er führt.
   =====================================================

   Die beiden mittleren Ebenen (Nachschlagen, Live-Session) bestanden aus
   Karten, auf denen ein Name stand und darunter ein Satz, der den Namen
   erklärte: „Glossar — Jeder Begriff, den am Tisch jemand fallen lässt."
   Sieben davon untereinander sind sieben Absätze, kein Bereich.

   Dieselbe Lehre wie auf der Startseite (E-035) und am Tisch (E-041): **Zeig
   den Gegenstand, nicht seine Beschriftung.** Statt eines erklärenden Satzes
   trägt jede Kachel, was hinter ihr liegt — die Anzahl der Begriffe, die
   Bilanz der erfassten Abende, das Raster der Eröffnungshände. Das ist
   kürzer als der Satz, den es ersetzt, und es sagt mehr.

   Die Farbe kommt vom Bereich, nicht von der Kachel (Regel 10.9). Vorher
   hatte jeder Eintrag seine eigene: sieben Farben nebeneinander sagen
   „sieben unverwandte Dinge", und der Chip-Rechner stand in Rot da wie eine
   Fehlermeldung. */

import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Icon, type IconName } from './Icon';
import { matrixLabel } from '../lib/poker/ranges';

interface Props {
  to: string;
  icon: IconName;
  titel: string;
  /** Was hinter der Kachel liegt — eine Zeile, aus echten Daten. */
  inhalt: ReactNode;
  /** Optionale Einordnung, etwa der Zeitpunkt im Ablauf eines Abends. */
  marke?: string;
  /** Optionale Vorschau rechts: das Ding selbst, klein. */
  vorschau?: ReactNode;
}

export function Bereichskachel({ to, icon, titel, inhalt, marke, vorschau }: Props) {
  return (
    <Link to={to} className="bereich">
      <span className="bereich-kopf">
        <span className="bereich-symbol" aria-hidden="true"><Icon name={icon} size={18} /></span>
        <span className="bereich-titel">{titel}</span>
        {marke && <span className="bereich-marke">{marke}</span>}
      </span>
      <span className="bereich-inhalt">{inhalt}</span>
      {vorschau && <span className="bereich-vorschau" aria-hidden="true">{vorschau}</span>}
    </Link>
  );
}

/* Das Raster in klein.
   ------------------
   169 Felder, 4 Pixel groß, ohne Beschriftung: Man liest keine einzelne
   Hand, man liest die Form — und die Form ist die Auskunft („von links oben
   nach rechts unten wird es dünner"). Genau deshalb darf es so klein sein.

   Es ist dieselbe Anordnung wie in der großen Matrix (`matrixLabel`), damit
   die Vorschau nicht irgendein Muster zeigt, sondern denselben Ausschnitt
   in klein. Für Vorlesegeräte ist es nichts: Die Kachel sagt daneben in
   Worten, was hier zu sehen ist. */
export function MiniRaster({ range }: { range: Set<string> }) {
  return (
    <span className="mini-raster">
      {Array.from({ length: 169 }, (_, i) => {
        const label = matrixLabel(Math.floor(i / 13), i % 13);
        return <i key={label} className={range.has(label) ? 'an' : undefined} />;
      })}
    </span>
  );
}
