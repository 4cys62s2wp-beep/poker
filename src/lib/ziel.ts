/* Was jemand mit der App vorhat.
   ==============================

   Der Willkommensdialog fragt es — optional, mit „Überspringen". Die Antwort
   ändert nur, was die Startseite **erklärt**, nicht was sie zeigt oder wo es
   steht: Die Aufgabe bleibt oben (E-036), die Live-Session im Daumenbereich
   (Regel 10.2). Wer „Pokerabende leiten" wählt, bekommt keine
   Einführung in den Lernteil; wer „Poker lernen" wählt oder nichts, bekommt
   sie wie bisher.

   Kein Tagesziel mit drei Stufen („locker / regelmäßig / ehrgeizig"): Die App
   stellt keine Mahnung in Aussicht, die sie nicht halten wird. */

import { useSyncExternalStore } from 'react';
import { durableSet } from './storage';

export const ZIEL_SCHLUESSEL = 'pokermentor-ziel-v1';

export type Ziel = 'lernen' | 'abend';

export function ladeZiel(): Ziel | null {
  try {
    const v = localStorage.getItem(ZIEL_SCHLUESSEL);
    return v === 'lernen' || v === 'abend' ? v : null;
  } catch {
    return null;
  }
}

const hoerer = new Set<() => void>();

function abonniere(f: () => void): () => void {
  hoerer.add(f);
  return () => { hoerer.delete(f); };
}

export function speichereZiel(z: Ziel): void {
  durableSet(ZIEL_SCHLUESSEL, z);
  /* Die Startseite steht beim Wählen schon hinter dem Dialog und liest das
     Ziel nicht noch einmal von selbst. */
  hoerer.forEach((f) => f());
}

/** Das gewählte Ziel, und es zieht nach, wenn der Dialog es setzt. */
export function useZiel(): Ziel | null {
  return useSyncExternalStore(abonniere, ladeZiel, () => null);
}

/* Wer schon spielt (E-097).
   -------------------------
   Im Willkommensdialog gibt es neben „Poker lernen“ und „Pokerabende leiten“
   ein „Ich spiele schon“. Es ist kein drittes Ziel — gelernt wird weiter —,
   sondern ein Hinweis: Die Startseite bietet dann für die ersten Module den
   Modultest an („Kenne ich schon“), statt jeden mit „So funktioniert Texas
   Hold’em“ zu beginnen. Angeboten, nicht erzwungen. */

export const ERFAHRUNG_SCHLUESSEL = 'pokermentor-erfahrung-v1';

export function ladeErfahrung(): boolean {
  try {
    return localStorage.getItem(ERFAHRUNG_SCHLUESSEL) === 'ja';
  } catch {
    return false;
  }
}

export function speichereErfahrung(): void {
  durableSet(ERFAHRUNG_SCHLUESSEL, 'ja');
  hoerer.forEach((f) => f());
}

/** Ob jemand angegeben hat, schon zu spielen — und es zieht nach. */
export function useErfahrung(): boolean {
  return useSyncExternalStore(abonniere, ladeErfahrung, () => false);
}
