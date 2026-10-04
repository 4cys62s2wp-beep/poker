/* Was jemand schon gesehen hat — damit „Neu" nur einmal „neu" ist.
   Ein Schlüssel im Gerätespeicher, eine kommagetrennte Liste. */

import { durableSet } from './storage';

const SCHLUESSEL = 'pokermentor-gesehen-v1';

function lese(): Set<string> {
  try {
    return new Set((localStorage.getItem(SCHLUESSEL) ?? '').split(',').filter(Boolean));
  } catch {
    return new Set();
  }
}

export function wurdeGesehen(id: string): boolean {
  return lese().has(id);
}

export function markiereGesehen(id: string): void {
  const s = lese();
  if (s.has(id)) return;
  s.add(id);
  durableSet(SCHLUESSEL, [...s].join(','));
}
