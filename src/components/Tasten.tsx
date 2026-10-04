/* Tastenkürzel einer Seite — eine Komponente ohne Bild.
   =====================================================

   Die Seiten (Quiz, Drill, Übungstisch) haben vor ihrer eigentlichen Anzeige
   frühe Rückgaben für Lade-, Fehler- und Einrichtungszustände; ein Haken
   dahinter wäre bedingt aufgerufen. Als Komponente im Bild hängt er genau so
   lange am Fenster, wie die Bedienung da ist, und verschwindet mit ihr. */

import { useTasten } from '../lib/useTasten';
import type { Taste } from '../lib/tasten';

export function Tasten({ belegungen }: { belegungen: Taste[] }) {
  useTasten(belegungen);
  return null;
}

/** Der Hinweis an einem Knopf: nur dort sichtbar, wo es eine Tastatur gibt
 *  (Maus und breites Fenster) — am Handy wäre er Rauschen. */
export function Kbd({ children }: { children: string }) {
  /* Die Taste steht im Attribut und wird per CSS gezeichnet: So gehört sie nicht
     zum Text des Knopfes — weder für Vorlesegeräte noch für `textContent`. */
  return <kbd className="kbd-hinweis" data-taste={children} aria-hidden="true" />;
}
