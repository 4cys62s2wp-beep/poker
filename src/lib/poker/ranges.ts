// Range-Logik: Hand-Labels ("AKs", "77", "T9o"), 13x13-Matrix und
// Expansion von Kurzschreibweisen ("77+", "A5s+") zu konkreten Combos.

import type { Card } from './cards';
import { makeCard, rankOf, suitOf, RANK_CHARS } from './cards';

/** Ränge absteigend für die Matrix-Darstellung. */
export const RANKS_DESC = 'AKQJT98765432';

/** Rang-Index (0=Zwei ... 12=Ass) aus Zeichen. */
function rankIndex(ch: string): number {
  const i = RANK_CHARS.indexOf(ch.toUpperCase());
  if (i < 0) throw new Error(`Ungültiger Rang: ${ch}`);
  return i;
}

/** Label für Matrixzelle (Zeile row, Spalte col), 0-basiert, oben links = AA. */
export function matrixLabel(row: number, col: number): string {
  if (row === col) return RANKS_DESC[row] + RANKS_DESC[col];
  if (col > row) return RANKS_DESC[row] + RANKS_DESC[col] + 's';
  return RANKS_DESC[col] + RANKS_DESC[row] + 'o';
}

/** Label ("AKs", "QQ", "T9o") für zwei konkrete Karten. */
export function handLabel(c1: Card, c2: Card): string {
  const r1 = rankOf(c1);
  const r2 = rankOf(c2);
  const hi = Math.max(r1, r2);
  const lo = Math.min(r1, r2);
  if (hi === lo) return RANK_CHARS[hi] + RANK_CHARS[lo];
  const suited = suitOf(c1) === suitOf(c2);
  return RANK_CHARS[hi] + RANK_CHARS[lo] + (suited ? 's' : 'o');
}

/** Alle konkreten 2-Karten-Combos für ein Label. */
export function combosForLabel(label: string): Array<[Card, Card]> {
  const combos: Array<[Card, Card]> = [];
  const r1 = rankIndex(label[0]);
  const r2 = rankIndex(label[1]);
  if (label.length === 2) {
    // Paar: 6 Combos
    for (let s1 = 0; s1 < 4; s1++)
      for (let s2 = s1 + 1; s2 < 4; s2++)
        combos.push([makeCard(r1, s1), makeCard(r1, s2)]);
    return combos;
  }
  const suited = label[2] === 's';
  if (suited) {
    for (let s = 0; s < 4; s++) combos.push([makeCard(r1, s), makeCard(r2, s)]);
  } else {
    for (let s1 = 0; s1 < 4; s1++)
      for (let s2 = 0; s2 < 4; s2++)
        if (s1 !== s2) combos.push([makeCard(r1, s1), makeCard(r2, s2)]);
  }
  return combos;
}

/**
 * Expandiert Kurzschreibweisen zu einer Menge von Labels:
 * - "AKs", "77", "T9o": einzelnes Label
 * - "77+": alle Paare ab 77 aufwärts
 * - "A5s+": A5s bis AKs (fester hoher Rang, Kicker aufwärts)
 * - "K9o+": K9o bis KQo
 */
export function expandRangeSpec(spec: string[]): Set<string> {
  const out = new Set<string>();
  for (const raw of spec) {
    const s = raw.trim();
    if (!s) continue;
    const plus = s.endsWith('+');
    const core = plus ? s.slice(0, -1) : s;
    const hi = rankIndex(core[0]);
    const lo = rankIndex(core[1]);
    const suffix = core.length === 3 ? core[2] : '';
    if (!plus) {
      out.add(normalizeLabel(core));
      continue;
    }
    if (core.length === 2 && core[0] === core[1]) {
      // Paare aufwärts
      for (let r = hi; r <= 12; r++) out.add(RANK_CHARS[r] + RANK_CHARS[r]);
    } else {
      // Kicker aufwärts bis knapp unter den hohen Rang
      for (let r = lo; r < hi; r++) out.add(RANK_CHARS[hi] + RANK_CHARS[r] + suffix);
    }
  }
  return out;
}

/** Normalisiert ein Label (hoher Rang zuerst). */
function normalizeLabel(label: string): string {
  const r1 = rankIndex(label[0]);
  const r2 = rankIndex(label[1]);
  if (r1 >= r2) return label[0].toUpperCase() + label[1].toUpperCase() + (label[2] ?? '');
  return label[1].toUpperCase() + label[0].toUpperCase() + (label[2] ?? '');
}

/** Alle konkreten Combos einer expandierten Range (optional ohne tote Karten). */
export function combosForRange(labels: Iterable<string>, dead: Card[] = []): Array<[Card, Card]> {
  const deadSet = new Set(dead);
  const combos: Array<[Card, Card]> = [];
  for (const label of labels) {
    for (const [a, b] of combosForLabel(label)) {
      if (!deadSet.has(a) && !deadSet.has(b)) combos.push([a, b]);
    }
  }
  return combos;
}

/** Anteil der 1326 Starthand-Combos, den eine Label-Menge abdeckt (0–1). */
export function rangePercent(labels: Iterable<string>): number {
  let n = 0;
  for (const label of labels) n += combosForLabel(label).length;
  return n / 1326;
}
