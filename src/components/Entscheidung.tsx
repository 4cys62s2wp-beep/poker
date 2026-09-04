/* Die Entscheidungsleiste.
   =======================

   Wo die Knöpfe stehen, mit denen man antwortet — und zwar auf jedem
   Übungsbildschirm an derselben Stelle: unten, im Daumenbereich, über dem
   Gestenstreifen.

   Warum das eine eigene Komponente ist (E-039)
   --------------------------------------------
   Vorher lagen die Antwortknöpfe in jedem Trainer dort, wo sie im Textfluss
   zufällig hinkamen — meist in der Bildschirmmitte, auf zwei Bildschirmen
   sogar unterhalb des Bildrands. Beide Zustände bestehen die Tippprüfung:
   Die Fläche ist groß genug und hat Kontrast. Was sie nicht bestehen, ist
   die Regel aus DESIGN.md, Abschnitt 10 — „Der Daumen erreicht die untere
   Bildschirmhälfte, mehr nicht."

   Warum sie klebt
   ---------------
   `position: sticky` statt einfach „weit unten": Zwei Übungen sind länger
   als ein Bildschirm (Handranking mit sieben Kategorien, Pot-Odds mit der
   Formelzeile). Eine Leiste, die mitscrollt, wäre dort mal erreichbar und
   mal nicht. Eine, die klebt, ist immer erreichbar — und auf den kurzen
   Bildschirmen sitzt sie ohnehin unten.

   Zwei Klassen, zwei Bedeutungen
   ------------------------------
   `entscheidung` sagt: Hier wird entschieden. Daran misst `npm run daumen`.
   `entscheidung-leiste` ist EINE Bauart davon — die klebende Leiste. Der
   Pot-Odds-Drill trägt nur die erste: Seine Knöpfe standen schon unten, und
   seine Höhenkette hält eine Zusage, die keine andere hält („zwischen
   Eingabe und Ergebnis bewegt sich nichts"). Als beide Klassen zusammen an
   ihm hingen, sprang der Antwortknopf um 24 Pixel — die Zusage war weg, und
   der Durchgang hat es gemeldet.

   Die Auszeichnung ist die, an der Wer eine solche Leiste baut, sagt es damit; was
   sie nicht trägt, gilt als Lesebildschirm. Eine Heuristik, die „irgendwie
   erkennt", welcher Knopf wichtig ist, erkennt beim nächsten Bildschirm
   etwas anderes.

   In dieser Datei steht keine Ziffer. */

import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Beschreibt die Leiste für Screenreader. */
  label?: string;
  /** Mehr Möglichkeiten, als in eine Zeile passen (Handranking hat sieben
   *  Kategorien). Dann bricht die Leiste um, statt die Knöpfe unter die
   *  Mindestgröße zu drücken. */
  viele?: boolean;
}

export function Entscheidung({ children, label, viele = false }: Props) {
  return (
    <div className="entscheidung entscheidung-leiste" role="group" aria-label={label}>
      <div className={`entscheidung-innen${viele ? ' viele' : ''}`}>{children}</div>
    </div>
  );
}
