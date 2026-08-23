// 5- und 7-Karten-Hand-Evaluator für Texas Hold'em.
// Höherer Rückgabewert = stärkere Hand.
//
// Encoding: category * 15^5 + Tiebreaker (bis zu 5 Ränge, Basis 15).
// Kategorien: 8 Straight Flush, 7 Vierling, 6 Full House, 5 Flush,
// 4 Straße, 3 Drilling, 2 Zwei Paare, 1 Paar, 0 High Card.

import type { Card } from './cards';
import { rankOf, suitOf } from './cards';

export const HAND_CATEGORY_NAMES = [
  'High Card',
  'Ein Paar',
  'Zwei Paare',
  'Drilling',
  'Straße',
  'Flush',
  'Full House',
  'Vierling',
  'Straight Flush',
];

const BASE = 15;
const B2 = BASE * BASE;
const B3 = B2 * BASE;
const B4 = B3 * BASE;
const CAT = B4 * BASE;

export function categoryOf(value: number): number {
  return Math.floor(value / CAT);
}

export function categoryName(value: number): string {
  const cat = categoryOf(value);
  // Royal Flush als Sonderfall des Straight Flush ausweisen
  if (cat === 8 && Math.floor(value % CAT / B4) === 12) return 'Royal Flush';
  return HAND_CATEGORY_NAMES[cat];
}

/** Findet den höchsten Straßen-Topp-Rang in einer Rang-Bitmaske, -1 wenn keine. */
function straightTop(rankMask: number): number {
  // Wheel: A-2-3-4-5
  const wheel = (1 << 12) | 0b1111;
  for (let top = 12; top >= 4; top--) {
    const need = 0b11111 << (top - 4);
    if ((rankMask & need) === need) return top;
  }
  if ((rankMask & wheel) === wheel) return 3; // 5-high Straße (Top = Fünf)
  return -1;
}

/** Bewertet exakt 5 Karten. */
export function evaluate5(cards: Card[]): number {
  const ranks = cards.map(rankOf);
  const suits = cards.map(suitOf);
  const counts = new Array<number>(13).fill(0);
  let rankMask = 0;
  for (const r of ranks) {
    counts[r]++;
    rankMask |= 1 << r;
  }
  const isFlush = suits.every((s) => s === suits[0]);
  const st = straightTop(rankMask);

  if (isFlush && st >= 0) return 8 * CAT + st * B4;

  // Gruppen sortieren: erst nach Anzahl, dann nach Rang (absteigend)
  const groups: Array<[count: number, rank: number]> = [];
  for (let r = 12; r >= 0; r--) if (counts[r] > 0) groups.push([counts[r], r]);
  groups.sort((a, b) => (b[0] - a[0]) || (b[1] - a[1]));

  if (groups[0][0] === 4) {
    return 7 * CAT + groups[0][1] * B4 + groups[1][1] * B3;
  }
  if (groups[0][0] === 3 && groups[1][0] >= 2) {
    return 6 * CAT + groups[0][1] * B4 + groups[1][1] * B3;
  }
  if (isFlush) {
    const sorted = [...ranks].sort((a, b) => b - a);
    return 5 * CAT + sorted[0] * B4 + sorted[1] * B3 + sorted[2] * B2 + sorted[3] * BASE + sorted[4];
  }
  if (st >= 0) return 4 * CAT + st * B4;
  if (groups[0][0] === 3) {
    return 3 * CAT + groups[0][1] * B4 + groups[1][1] * B3 + groups[2][1] * B2;
  }
  if (groups[0][0] === 2 && groups[1][0] === 2) {
    return 2 * CAT + groups[0][1] * B4 + groups[1][1] * B3 + groups[2][1] * B2;
  }
  if (groups[0][0] === 2) {
    return CAT + groups[0][1] * B4 + groups[1][1] * B3 + groups[2][1] * B2 + groups[3][1] * BASE;
  }
  const sorted = [...ranks].sort((a, b) => b - a);
  return sorted[0] * B4 + sorted[1] * B3 + sorted[2] * B2 + sorted[3] * BASE + sorted[4];
}

// Alle 21 Fünfer-Kombinationen aus 7 Karten (Indizes vorberechnet).
const COMBOS_7C5: number[][] = [];
for (let a = 0; a < 3; a++)
  for (let b = a + 1; b < 4; b++)
    for (let c = b + 1; c < 5; c++)
      for (let d = c + 1; d < 6; d++)
        for (let e = d + 1; e < 7; e++) COMBOS_7C5.push([a, b, c, d, e]);

/** Bewertet die beste 5-Karten-Hand aus 5–7 Karten. */
export function evaluateBest(cards: Card[]): number {
  if (cards.length === 5) return evaluate5(cards);
  if (cards.length === 6) {
    let best = 0;
    for (let skip = 0; skip < 6; skip++) {
      const five = cards.filter((_, i) => i !== skip);
      const v = evaluate5(five);
      if (v > best) best = v;
    }
    return best;
  }
  if (cards.length === 7) {
    let best = 0;
    const five: Card[] = new Array(5);
    for (const combo of COMBOS_7C5) {
      for (let i = 0; i < 5; i++) five[i] = cards[combo[i]];
      const v = evaluate5(five);
      if (v > best) best = v;
    }
    return best;
  }
  throw new Error(`evaluateBest erwartet 5–7 Karten, erhielt ${cards.length}`);
}
