/* Der Haken zu `tasten.ts`: hängt einen Zuhörer ans Fenster, solange die Seite
   offen ist, und nimmt immer die jüngsten Belegungen. */

import { useEffect, useRef } from 'react';
import { findeTaste, type Taste } from './tasten';

export function useTasten(bindungen: Taste[], aktiv = true): void {
  const neueste = useRef(bindungen);
  neueste.current = bindungen;
  useEffect(() => {
    if (!aktiv) return undefined;
    const beiTaste = (e: KeyboardEvent) => {
      const dialogOffen = document.querySelector('[role="dialog"][aria-modal="true"]') !== null;
      const t = findeTaste(e, e.target, neueste.current, dialogOffen);
      if (!t) return;
      e.preventDefault();
      t.aktion(e);
    };
    window.addEventListener('keydown', beiTaste);
    return () => window.removeEventListener('keydown', beiTaste);
  }, [aktiv]);
}
