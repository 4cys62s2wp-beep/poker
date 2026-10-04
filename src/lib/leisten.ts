/* Eine klebende Leiste, die den Bildschirm auffrisst, klebt nicht mehr (E-101).
   ============================================================================

   Die Antwort-Leiste unten (`.entscheidung-leiste`) klebt, damit sie immer
   erreichbar ist. Bei doppelter Schrift wachsen ihre Knöpfe mit, und aus einer
   Leiste von 150 Pixeln werden 400 — fast die Hälfte eines Handys. Was dann
   noch zu sehen ist, ist die Leiste und ein Streifen Aufgabe.

   Sobald eine Leiste mehr als 40 % der Fensterhöhe füllt, bekommt sie
   `data-hoch`; das Stylesheet lässt sie dann mit der Seite scrollen. Gemessen
   wird, was da ist, statt eine Schriftgröße zu erraten: Die Leiste hat die
   Höhe, die ihr Inhalt braucht.

   Die Ergebnisleiste im Quiz (`.quiz-leiste`) ist ausgenommen: Sie hat eine
   feste, gedeckelte Höhe und scrollt ihren Text selbst. */

export const HOCH_ANTEIL = 0.4;

const LEISTE = '.entscheidung-leiste:not(.quiz-leiste)';

/** Ist diese Höhe für ein Fenster dieser Höhe zu viel für eine klebende Leiste? */
export function istZuHoch(leistenHoehe: number, fensterHoehe: number): boolean {
  return fensterHoehe > 0 && leistenHoehe > fensterHoehe * HOCH_ANTEIL;
}

function markiere(el: HTMLElement): void {
  const hoch = istZuHoch(el.getBoundingClientRect().height, window.innerHeight);
  if (hoch) el.dataset.hoch = '';
  else delete el.dataset.hoch;
}

/** Beobachtet alle Leisten unterhalb von `wurzel`, auch später hinzukommende. */
export function beobachteLeisten(wurzel: HTMLElement): () => void {
  if (typeof ResizeObserver === 'undefined' || typeof MutationObserver === 'undefined') return () => {};
  const gesehen = new Set<HTMLElement>();
  const groesse = new ResizeObserver((eintraege) => {
    for (const e of eintraege) markiere(e.target as HTMLElement);
  });
  const suche = () => {
    wurzel.querySelectorAll<HTMLElement>(LEISTE).forEach((el) => {
      if (gesehen.has(el)) return;
      gesehen.add(el);
      groesse.observe(el);
      markiere(el);
    });
    /* Entfernte Leisten vergessen: sonst hielte die Menge tote Knoten. */
    for (const el of gesehen) {
      if (!el.isConnected) { gesehen.delete(el); groesse.unobserve(el); }
    }
  };
  const aenderung = new MutationObserver(suche);
  aenderung.observe(wurzel, { childList: true, subtree: true });
  const beiFenster = () => gesehen.forEach(markiere);
  window.addEventListener('resize', beiFenster);
  suche();
  return () => {
    aenderung.disconnect();
    groesse.disconnect();
    window.removeEventListener('resize', beiFenster);
  };
}
