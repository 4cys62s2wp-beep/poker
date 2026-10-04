/* Karten als Text lesen und schreiben („As Kh“).
   ==============================================

   Der Equity-Rechner nimmt Karten per Auswahl entgegen (E-096); die Texteingabe
   bleibt als Schnelleingabe für alle, die das Kürzel ohnehin kennen. Beide Wege
   treffen sich hier: Was getippt wird, wird zu Karten, und was gewählt wird,
   erscheint als derselbe Text. Reine Funktionen, damit sie sich prüfen lassen. */

import { cardToString, parseCard, type Card } from './cards';

export type Lesefehler =
  | { art: 'ungueltig'; token: string }
  | { art: 'doppelt'; token: string };

export interface Gelesen {
  cards: Card[];
  fehler?: Lesefehler;
}

/**
 * Liest „As Kh“, „as,kh“ oder „9h 2h Jc“. Trennzeichen sind Leerzeichen,
 * Komma und Semikolon; die Schreibweise ist egal (`as` = `As`). Eine Karte
 * innerhalb des Textes kommt nur einmal vor.
 */
export function leseKarten(text: string): Gelesen {
  const tokens = text.trim().replace(/[,;]+/g, ' ').split(/\s+/).filter(Boolean);
  const cards: Card[] = [];
  for (const t of tokens) {
    if (t.length !== 2) return { cards: [], fehler: { art: 'ungueltig', token: t } };
    let karte: Card;
    try {
      karte = parseCard(t);
    } catch {
      return { cards: [], fehler: { art: 'ungueltig', token: t } };
    }
    if (cards.includes(karte)) return { cards: [], fehler: { art: 'doppelt', token: t } };
    cards.push(karte);
  }
  return { cards };
}

/** Karten als Text, wie ihn die Schnelleingabe zeigt: „As Kh“. */
export function kartenText(cards: Card[]): string {
  return cards.map(cardToString).join(' ');
}
