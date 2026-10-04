/* Scrollposition: neue Seiten oben, Zurück an die alte Stelle.
   ===========================================================

   Der Browser stellt die Position beim Zurückgehen selbst wieder her — bei
   einer Einzelseiten-App mit nachgeladenen Seiten geht das schief: Die Seite
   ist beim Wiederherstellen noch leer, und die Position klemmt auf 0. Und beim
   Vorwärtsgehen behält er die Tiefe der Seite davor: „Pro-Insights" öffnete bei
   scrollY 2836, der Übungstisch bei 343.

   Darum wird beides selbst gemacht (`history.scrollRestoration = 'manual'`):

   - **Vorwärts** (PUSH): nach oben, und der Fokus auf die Überschrift — wer
     mit Screenreader navigiert, hört, wo er ist.
   - **Zurück** (POP): die gemerkte Position, aber erst, wenn die Seite hoch
     genug ist.
   - **Ersetzen** (REPLACE): nach oben nur, wenn sich die Seite geändert hat;
     der Drill ersetzt bei jeder Aufgabe seine Adresse, ohne dass der Bildschirm
     springen soll. */

export type Navigationsart = 'PUSH' | 'POP' | 'REPLACE';

export interface Scrollentscheidung {
  aktion: 'oben' | 'wiederherstellen' | 'nichts';
  /** Zielposition bei `wiederherstellen`. */
  y: number;
  /** Soll der Fokus auf die Überschrift? Nur beim Betreten einer neuen Seite. */
  fokus: boolean;
}

export function entscheideScroll(p: {
  art: Navigationsart;
  /** Hat sich der Pfad gegenüber der vorigen Seite geändert? `null`: erste Seite. */
  pfadGeaendert: boolean | null;
  gespeichert: number | undefined;
}): Scrollentscheidung {
  if (p.art === 'POP') {
    if (p.gespeichert !== undefined && p.gespeichert > 0) {
      return { aktion: 'wiederherstellen', y: p.gespeichert, fokus: false };
    }
    return { aktion: p.pfadGeaendert === null ? 'nichts' : 'oben', y: 0, fokus: false };
  }
  if (p.art === 'REPLACE') {
    return p.pfadGeaendert
      ? { aktion: 'oben', y: 0, fokus: true }
      : { aktion: 'nichts', y: 0, fokus: false };
  }
  return { aktion: 'oben', y: 0, fokus: true };
}

const SCHLUESSEL = 'pokermentor-scroll-v1';
const MAX = 60;

function lade(): Record<string, number> {
  try {
    const roh = sessionStorage.getItem(SCHLUESSEL);
    return roh ? (JSON.parse(roh) as Record<string, number>) : {};
  } catch {
    return {};
  }
}

const speicher: Record<string, number> = lade();

export function gemerktePosition(key: string): number | undefined {
  return speicher[key];
}

export function merkePosition(key: string, y: number): void {
  speicher[key] = Math.round(y);
  const schluessel = Object.keys(speicher);
  if (schluessel.length > MAX) {
    for (const k of schluessel.slice(0, schluessel.length - MAX)) delete speicher[k];
  }
  try {
    sessionStorage.setItem(SCHLUESSEL, JSON.stringify(speicher));
  } catch {
    /* Gesperrter Speicher: Die Position gilt dann nur, solange die App offen ist. */
  }
}
