/* Ein modaler Dialog, auch ohne Maus.
   ==================================

   Vier Dialoge hat diese App, und bis E-058 konnten drei verschiedene Dinge:

   - `Onboarding` machte es vollständig: Startfokus, Fokusfalle, der Rest der
     Seite auf `aria-hidden`.
   - `Herkunft` und `PaywallModal` setzten den Startfokus und schlossen bei
     Escape — hielten den Fokus aber nicht fest.
   - Die beiden Dialoge am Live-Tisch konnten **nichts** davon. Gemessen mit
     gedrückter Tastatur: Der Fokus blieb nach dem Öffnen auf dem Knopf
     *hinter* dem Dialog, Escape schloss nicht, und von acht Tab-Schritten
     landeten vier auf verdeckten Knöpfen — „Weiter", „Stände", „Beenden".
     Wer am Pokerabend mit der Tastatur bedient, drückte also Knöpfe, die er
     nicht sehen konnte.

   Drei Eigenschaften machen einen Dialog bedienbar, und sie stehen jetzt an
   einer Stelle:

   1. **Der Fokus wandert hinein.** Sonst liest ein Vorlesegerät weiter, was
      hinter dem Dialog steht.
   2. **Escape schließt.** Die Maus hat den Hintergrund zum Wegklicken; die
      Tastatur hat Escape. Wo eine Entscheidung erzwungen ist (die
      Sprachwahl beim ersten Start), wird `schliessen` weggelassen — dann
      gilt die Regel bewusst nicht.
   3. **Tab bleibt drin.** Ein Dialog, aus dem der Fokus herausläuft, ist
      schlimmer als keiner: Er verdeckt, was man gerade bedient.

   Dazu kommt, was beim Schließen zählt: **Der Fokus geht dorthin zurück,
   wo er herkam.** Sonst steht man nach „Doch nicht" am Seitenanfang. */

import { useEffect, useRef, type RefObject } from 'react';

/** Was den Fokus annehmen kann. */
export const FOKUSSIERBAR =
  'button:not([disabled]), input:not([disabled]), select, textarea, a[href], [tabindex]:not([tabindex="-1"])';

interface Optionen {
  /** Ist der Dialog gerade eingehängt? Standard: ja. */
  aktiv?: boolean;
  /** Wird bei Escape gerufen. Fehlt sie, ist der Dialog bewusst nicht abbrechbar. */
  schliessen?: () => void;
  /** Startfokus setzen? Standard: ja. Aus, wenn ein Feld `autoFocus` trägt. */
  startfokus?: boolean;
  /**
   * Wohin der Startfokus soll, wenn nicht auf das erste Element.
   *
   * Die Paywall benutzt das: Dort steht der Kaufknopf zuerst, der Fokus
   * gehört aber auf „später". Ein Dialog, der ungefragt erscheint, drängt
   * niemanden mit dem Cursor zur Kasse.
   */
  zuerst?: RefObject<HTMLElement | null>;
}

/**
 * Macht den Dialog unter `ref` mit der Tastatur bedienbar: Startfokus,
 * Escape, Fokusfalle, und beim Schließen zurück zum Auslöser.
 *
 * Der Aufrufer hängt nichts weiter ein — die Tastenbehandlung sitzt am
 * Dokument, damit sie auch greift, wenn der Fokus (noch) außerhalb liegt.
 * Genau das war der Fall am Live-Tisch.
 */
export function useDialogTastatur(
  ref: RefObject<HTMLElement | null>,
  { aktiv = true, schliessen, startfokus = true, zuerst }: Optionen = {},
): void {
  /* `schliessen` ist meist eine Pfeilfunktion aus dem Rendern und wäre bei
     jedem Durchlauf eine andere. Stünde sie in den Abhängigkeiten, liefe der
     Effekt ständig neu an — und holte den Fokus jedes Mal zurück auf den
     ersten Knopf, mitten im Tippen. */
  const schliessenRef = useRef(schliessen);
  schliessenRef.current = schliessen;

  useEffect(() => {
    const dialog = ref.current;
    if (!aktiv || !dialog) return undefined;

    const vorher = document.activeElement as HTMLElement | null;
    if (startfokus) {
      (zuerst?.current ?? dialog.querySelector<HTMLElement>(FOKUSSIERBAR))?.focus();
    }

    const beiTaste = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && schliessenRef.current) {
        e.preventDefault();
        schliessenRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const stellen = [...dialog.querySelectorAll<HTMLElement>(FOKUSSIERBAR)];
      if (stellen.length === 0) return;
      const erste = stellen[0];
      const letzte = stellen[stellen.length - 1];
      const aktivesElement = document.activeElement;
      const drin = dialog.contains(aktivesElement);
      if (e.shiftKey ? aktivesElement === erste || !drin : aktivesElement === letzte || !drin) {
        e.preventDefault();
        (e.shiftKey ? letzte : erste).focus();
      }
    };

    document.addEventListener('keydown', beiTaste);
    return () => {
      document.removeEventListener('keydown', beiTaste);
      /* Zurück zum Auslöser — aber nur, wenn es ihn noch gibt und der Fokus
         nicht inzwischen woanders bewusst hingesetzt wurde. */
      if (vorher && document.body.contains(vorher)) vorher.focus();
    };
  }, [ref, aktiv, startfokus, zuerst]);
}
