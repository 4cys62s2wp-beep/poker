// Handanalyse für den Live-Coach: Was halte ich gerade, welche Draws habe ich,
// wie viele Outs? Grundlage für die Empfehlungslogik in coach.ts.

import type { Card } from './cards';
import { RANK_CHARS, rankOf, suitOf } from './cards';
import { categoryOf, categoryName, evaluateBest } from './evaluator';

/** Sprache der erzeugten Beschriftungen (Logik/Zahlen sind sprachneutral). */
export type AnalysisLang = 'de' | 'en';

/** Englische Pendants zu HAND_CATEGORY_NAMES aus evaluator.ts (Index = Kategorie). */
const HAND_CATEGORY_NAMES_EN = [
  'High Card',
  'One Pair',
  'Two Pair',
  'Three of a Kind',
  'Straight',
  'Flush',
  'Full House',
  'Four of a Kind',
  'Straight Flush',
];

function categoryNameFor(value: number, lang: AnalysisLang): string {
  const de = categoryName(value);
  if (lang === 'de') return de;
  if (de === 'Royal Flush') return 'Royal Flush';
  return HAND_CATEGORY_NAMES_EN[categoryOf(value)];
}

/** Beschriftungen der Draw-Bausteine pro Sprache. */
const DRAW_LABELS = {
  de: {
    nutFlushDraw: 'Nut-Flushdraw',
    flushDraw: 'Flushdraw',
    multiStraightDraw: 'Straßen-Draw (mehrere Enden)',
    openEnded: 'Open-Ended Straight Draw',
    gutshot: 'Gutshot',
    twoOvercards: 'Zwei Overcards (unsicher)',
    oneOvercard: 'Eine Overcard (unsicher)',
    setImproves: 'Set verbessert sich zu Full House/Quads',
  },
  en: {
    nutFlushDraw: 'Nut Flush Draw',
    flushDraw: 'Flush Draw',
    multiStraightDraw: 'Straight Draw (multiple ends)',
    openEnded: 'Open-Ended Straight Draw',
    gutshot: 'Gutshot',
    twoOvercards: 'Two Overcards (unreliable)',
    oneOvercard: 'One Overcard (unreliable)',
    setImproves: 'Set improving to Full House/Quads',
  },
} as const satisfies Record<AnalysisLang, Record<string, string>>;

export type PairType =
  | 'overpair'
  | 'toppair'
  | 'middlepair'
  | 'bottompair'
  | 'underpair'
  | 'boardpair';

export interface MadeHandInfo {
  value: number;
  category: number;
  name: string;
  /** Nur gesetzt, wenn category === 1 (ein Paar). */
  pairType?: PairType;
  /** Bester Kicker-Rang (nur bei Top Pair relevant). */
  kickerRank?: number;
}

export interface OutsPart {
  label: string;
  outs: number;
  /** „Weiche“ Outs (z. B. Overcards): unsicher, zählen nicht in totalOuts. */
  soft?: boolean;
}

export interface DrawInfo {
  flushDraw: boolean;
  nutFlushDraw: boolean;
  /** 2+ Straßen-Out-Ränge (OESD oder Double-Gutshot). */
  openEnded: boolean;
  gutshot: boolean;
  /** Anzahl Overcards in der Hand (0–2), nur wenn Hand ungepaart. */
  overcards: number;
  /** Aufschlüsselung der Outs. */
  parts: OutsPart[];
  /** Summe der „sauberen“ Outs (Flush/Straße/Set-Verbesserung), Überschneidungen bereinigt. */
  totalOuts: number;
  /** Zusätzliche unsichere Outs (Overcards). */
  softOuts: number;
}

/** Analysiert die gemachte Hand (Board mit 3–5 Karten). */
export function madeHandInfo(hole: Card[], board: Card[], lang: AnalysisLang = 'de'): MadeHandInfo {
  const value = evaluateBest([...hole, ...board]);
  const category = categoryOf(value);
  const info: MadeHandInfo = { value, category, name: categoryNameFor(value, lang) };

  if (category === 1) {
    const h1 = rankOf(hole[0]);
    const h2 = rankOf(hole[1]);
    const boardRanks = board.map(rankOf);
    const maxBoard = Math.max(...boardRanks);
    const boardHasPair = new Set(boardRanks).size < boardRanks.length;

    if (h1 === h2) {
      // Pocket Pair
      if (h1 > maxBoard) info.pairType = 'overpair';
      else if (h1 < Math.min(...boardRanks)) info.pairType = 'underpair';
      else info.pairType = 'middlepair';
    } else if (boardRanks.includes(h1) || boardRanks.includes(h2)) {
      const pairedRank = boardRanks.includes(h1) ? h1 : h2;
      const kicker = pairedRank === h1 ? h2 : h1;
      const sortedBoard = [...new Set(boardRanks)].sort((a, b) => b - a);
      if (pairedRank === sortedBoard[0]) {
        info.pairType = 'toppair';
        info.kickerRank = kicker;
      } else if (pairedRank === sortedBoard[sortedBoard.length - 1]) {
        info.pairType = 'bottompair';
      } else {
        info.pairType = 'middlepair';
      }
    } else if (boardHasPair) {
      info.pairType = 'boardpair';
    }
  }

  return info;
}

/** Erkennt Draws und zählt Outs (Board mit 3 oder 4 Karten). */
export function detectDraws(hole: Card[], board: Card[], lang: AnalysisLang = 'de'): DrawInfo {
  const all = [...hole, ...board];
  const made = categoryOf(evaluateBest(all));
  const L = DRAW_LABELS[lang];
  const parts: OutsPart[] = [];

  // --- Flushdraw ---
  const suitCounts = [0, 0, 0, 0];
  for (const c of all) suitCounts[suitOf(c)]++;
  let flushDraw = false;
  let nutFlushDraw = false;
  let flushSuit = -1;
  for (let s = 0; s < 4; s++) {
    if (suitCounts[s] === 4 && hole.some((c) => suitOf(c) === s)) {
      flushDraw = true;
      flushSuit = s;
      nutFlushDraw = hole.some((c) => suitOf(c) === s && rankOf(c) === 12);
    }
  }
  // Bereits fertiger Flush → kein Draw
  if (made >= 5) {
    flushDraw = false;
    nutFlushDraw = false;
  }
  if (flushDraw) {
    parts.push({ label: nutFlushDraw ? L.nutFlushDraw : L.flushDraw, outs: 9 });
  }

  // --- Straßen-Draws ---
  const rankSet = new Set(all.map(rankOf));
  const holeRanks = new Set(hole.map(rankOf));
  const straightOutRanks = new Set<number>();
  if (made < 4) {
    // Fenster: Wheel (A-2-3-4-5) + alle normalen Straßen
    const windows: number[][] = [[12, 0, 1, 2, 3]];
    for (let top = 4; top <= 12; top++) {
      windows.push([top - 4, top - 3, top - 2, top - 1, top]);
    }
    for (const win of windows) {
      const missing = win.filter((r) => !rankSet.has(r));
      if (missing.length === 1 && win.some((r) => holeRanks.has(r))) {
        straightOutRanks.add(missing[0]);
      }
    }
  }
  const openEnded = straightOutRanks.size >= 2;
  const gutshot = straightOutRanks.size === 1;
  if (straightOutRanks.size > 0) {
    let straightOuts = straightOutRanks.size * 4;
    // Überschneidung mit Flush-Outs abziehen
    if (flushDraw) straightOuts -= straightOutRanks.size;
    parts.push({
      label: openEnded
        ? straightOutRanks.size > 2
          ? L.multiStraightDraw
          : L.openEnded
        : L.gutshot,
      outs: straightOuts,
    });
  }

  // --- Overcards ---
  let overcards = 0;
  const h1 = rankOf(hole[0]);
  const h2 = rankOf(hole[1]);
  const boardRanks = board.map(rankOf);
  const maxBoard = Math.max(...boardRanks);
  const unpaired = h1 !== h2 && !boardRanks.includes(h1) && !boardRanks.includes(h2);
  if (unpaired && made <= 1) {
    if (h1 > maxBoard) overcards++;
    if (h2 > maxBoard) overcards++;
    if (overcards > 0) {
      let ocOuts = overcards * 3;
      // Überschneidung: Ist eine Overcard NICHT in der Flushfarbe, steckt unter
      // ihren 3 restlichen Karten genau eine Flushfarben-Karte (schon gezählt).
      if (flushDraw) {
        for (const c of hole) {
          if (rankOf(c) > maxBoard && suitOf(c) !== flushSuit) ocOuts -= 1;
        }
      }
      parts.push({
        label: overcards === 2 ? L.twoOvercards : L.oneOvercard,
        outs: ocOuts,
        soft: true,
      });
    }
  }

  // --- Set → Full House / Quads ---
  if (made === 3 && h1 === h2) {
    parts.push({ label: L.setImproves, outs: board.length === 3 ? 7 : 10 });
  }

  const totalOuts = parts.filter((p) => !p.soft).reduce((s, p) => s + p.outs, 0);
  const softOuts = parts.filter((p) => p.soft).reduce((s, p) => s + p.outs, 0);
  return { flushDraw, nutFlushDraw, openEnded, gutshot, overcards, parts, totalOuts, softOuts };
}

export function rankName(r: number): string {
  return RANK_CHARS[r] === 'T' ? '10' : RANK_CHARS[r];
}

export const PAIR_TYPE_NAMES: Record<PairType, string> = {
  overpair: 'Overpair (dein Paar ist höher als das Board)',
  toppair: 'Top Pair (Paar mit der höchsten Boardkarte)',
  middlepair: 'Mittleres Paar',
  bottompair: 'Bottom Pair (Paar mit der niedrigsten Boardkarte)',
  underpair: 'Underpair (dein Paar ist niedriger als das Board)',
  boardpair: 'Nur das Board ist gepaart',
};

export const PAIR_TYPE_NAMES_EN: Record<PairType, string> = {
  overpair: 'Overpair (your pair is higher than the board)',
  toppair: 'Top Pair (pairing the highest board card)',
  middlepair: 'Middle Pair',
  bottompair: 'Bottom Pair (pairing the lowest board card)',
  underpair: 'Underpair (your pair is lower than the board)',
  boardpair: 'Only the board is paired',
};

/** Sprachabhängiger Name eines Paar-Typs. */
export function pairTypeName(pt: PairType, lang: AnalysisLang = 'de'): string {
  return (lang === 'en' ? PAIR_TYPE_NAMES_EN : PAIR_TYPE_NAMES)[pt];
}
