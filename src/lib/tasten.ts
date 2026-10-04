/* Tastenkürzel am Desktop — die Regeln, ohne Oberfläche.
   ======================================================

   Die App war bis E-096 für Tastatur und Maus gebaut, nicht von ihnen aus
   gedacht: Das Quiz beschriftete die Antworten mit A–D, ohne dass eine Taste
   etwas tat; der Drill und der Übungstisch kannten gar keine. Am Handy ist das
   gleichgültig, am Schreibtisch ist es der Unterschied zwischen drei
   Antworten pro Minute und zwölf.

   Drei Regeln gelten für jede Taste, und sie stehen hier an einer Stelle,
   damit sie sich prüfen lassen:

   1. **In einem Eingabefeld schweigen die Kürzel.** Wer „f“ in ein Namensfeld
      tippt, will kein Fold.
   2. **Mit Strg, Befehl oder Alt wird nichts abgefangen**, außer die Taste
      fordert es ausdrücklich an (Strg + K für die Suche). Sonst bricht das
      Kürzel das Kopieren, Neuladen und die Browser-Navigation.
   3. **Hinter einem Dialog gelten die Kürzel der Seite nicht.** Die Tastatur
      bedient, was oben liegt. */

export interface Taste {
  /** `event.key`-Werte; bei Buchstaben ist die Schreibweise egal. */
  tasten: string[];
  /** Strg (Mac: Befehl) gehört zum Kürzel. Standard: nein. */
  strg?: boolean;
  /** Auch gültig, solange der Fokus in einem Eingabefeld steht. Standard: nein. */
  inFeldern?: boolean;
  /** Auch gültig, solange ein Dialog offen ist (die Taste gehört dem Dialog). */
  imDialog?: boolean;
  aktion: (e: KeyboardEvent) => void;
}

interface Ereignis {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  repeat?: boolean;
  defaultPrevented?: boolean;
  isComposing?: boolean;
}

/** Steht der Fokus in etwas, in das man Text tippt? */
export function istEingabe(ziel: EventTarget | null): boolean {
  if (!ziel || !(ziel as HTMLElement).tagName) return false;
  const el = ziel as HTMLElement;
  const tag = el.tagName.toLowerCase();
  if (tag === 'textarea' || tag === 'select') return true;
  if (tag === 'input') {
    const art = (el as HTMLInputElement).type;
    return !['button', 'checkbox', 'radio', 'submit', 'reset', 'range', 'color', 'file', 'image'].includes(art);
  }
  return el.isContentEditable === true;
}

/** Welche Belegung gilt für dieses Ereignis — oder keine. */
export function findeTaste(
  e: Ereignis,
  ziel: EventTarget | null,
  bindungen: Taste[],
  dialogOffen: boolean,
): Taste | null {
  if (e.defaultPrevented || e.isComposing) return null;
  const mitStrg = e.ctrlKey || e.metaKey;
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  for (const b of bindungen) {
    if (!b.tasten.some((t) => (t.length === 1 ? t.toLowerCase() : t) === key)) continue;
    if (Boolean(b.strg) !== mitStrg) continue;
    if (e.altKey) continue;
    if (!b.inFeldern && istEingabe(ziel)) continue;
    if (dialogOffen && !b.imDialog) continue;
    return b;
  }
  return null;
}
