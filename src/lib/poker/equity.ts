// Equity-Berechnung per Monte-Carlo-Simulation.

import type { Card } from './cards';
import { freshDeck } from './cards';
import { evaluateBest } from './evaluator';

/**
 * Equity mehrerer bekannter Hände gegeneinander (Board wird zufällig vervollständigt).
 * Rückgabe: Equity-Anteil pro Hand (Summe = 1), Splits anteilig.
 */
export function equityVsHands(
  hands: Card[][],
  board: Card[],
  iterations = 10000,
  rng: () => number = Math.random,
): number[] {
  const dead = new Set<Card>([...hands.flat(), ...board]);
  const stub = freshDeck().filter((c) => !dead.has(c));
  const need = 5 - board.length;
  const shares = new Array<number>(hands.length).fill(0);
  const values = new Array<number>(hands.length).fill(0);
  const iters = need === 0 ? 1 : iterations;

  for (let it = 0; it < iters; it++) {
    // Partielles Fisher-Yates: nur `need` Karten ziehen
    for (let i = 0; i < need; i++) {
      const j = i + Math.floor(rng() * (stub.length - i));
      [stub[i], stub[j]] = [stub[j], stub[i]];
    }
    const fullBoard = need === 0 ? board : [...board, ...stub.slice(0, need)];
    let best = -1;
    let winners: number[] = [];
    for (let p = 0; p < hands.length; p++) {
      const v = evaluateBest([...hands[p], ...fullBoard]);
      values[p] = v;
      if (v > best) {
        best = v;
        winners = [p];
      } else if (v === best) {
        winners.push(p);
      }
    }
    for (const w of winners) shares[w] += 1 / winners.length;
  }
  return shares.map((s) => s / iters);
}

/**
 * Hero-Equity gegen n zufällige Gegnerhände (Monte Carlo).
 * Gut als schnelle "Handstärke"-Schätzung für Bots und Coach-Anzeigen.
 */
export function equityVsRandomHands(
  hero: Card[],
  board: Card[],
  numOpponents: number,
  iterations = 400,
  rng: () => number = Math.random,
): number {
  const dead = new Set<Card>([...hero, ...board]);
  const baseStub = freshDeck().filter((c) => !dead.has(c));
  const need = 5 - board.length;
  const drawCount = need + numOpponents * 2;
  let share = 0;

  for (let it = 0; it < iterations; it++) {
    const stub = baseStub.slice();
    for (let i = 0; i < drawCount; i++) {
      const j = i + Math.floor(rng() * (stub.length - i));
      [stub[i], stub[j]] = [stub[j], stub[i]];
    }
    const fullBoard = need === 0 ? board : [...board, ...stub.slice(0, need)];
    const heroVal = evaluateBest([...hero, ...fullBoard]);
    let bestOpp = -1;
    let tieCount = 0;
    for (let o = 0; o < numOpponents; o++) {
      const off = need + o * 2;
      const v = evaluateBest([stub[off], stub[off + 1], ...fullBoard]);
      if (v > bestOpp) {
        bestOpp = v;
        tieCount = 1;
      } else if (v === bestOpp) {
        tieCount++;
      }
    }
    if (heroVal > bestOpp) share += 1;
    else if (heroVal === bestOpp) share += 1 / (tieCount + 1);
  }
  return share / iterations;
}

/**
 * Hero-Equity gegen eine Gegner-Range (Combos werden zufällig gezogen).
 * Rückgabe: Equity des Heros (0–1). Gibt -1 zurück, wenn die Range
 * nach Entfernen toter Karten leer ist.
 */
export function equityVsRange(
  hero: Card[],
  rangeCombos: Array<[Card, Card]>,
  board: Card[],
  iterations = 2000,
  rng: () => number = Math.random,
): number {
  const dead = new Set<Card>([...hero, ...board]);
  const usable = rangeCombos.filter(([a, b]) => !dead.has(a) && !dead.has(b));
  if (usable.length === 0) return -1;

  const need = 5 - board.length;
  let share = 0;
  for (let it = 0; it < iterations; it++) {
    const [va, vb] = usable[Math.floor(rng() * usable.length)];
    const stub = freshDeck().filter((c) => !dead.has(c) && c !== va && c !== vb);
    for (let i = 0; i < need; i++) {
      const j = i + Math.floor(rng() * (stub.length - i));
      [stub[i], stub[j]] = [stub[j], stub[i]];
    }
    const fullBoard = need === 0 ? board : [...board, ...stub.slice(0, need)];
    const hv = evaluateBest([...hero, ...fullBoard]);
    const vv = evaluateBest([va, vb, ...fullBoard]);
    if (hv > vv) share += 1;
    else if (hv === vv) share += 0.5;
  }
  return share / iterations;
}
