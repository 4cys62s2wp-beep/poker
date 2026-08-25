// Equity-Berechnung per Monte-Carlo-Simulation.
//
// Alle Schleifen arbeiten auf wiederverwendeten Arrays: pro Iteration wird
// nichts mehr allokiert (kein `slice()`, kein Spread) – das spart in den
// heißen Pfaden rund ein Fünftel der Laufzeit und entlastet den GC.

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
  const iters = need === 0 ? 1 : iterations;

  // Pro Hand ein festes Arbeits-Array: [eigene Karten, bekanntes Board, gezogene Karten].
  // Nur die letzten `need` Plätze ändern sich je Iteration.
  const works: Card[][] = hands.map((hand) => {
    const w = new Array<Card>(hand.length + 5);
    for (let i = 0; i < hand.length; i++) w[i] = hand[i];
    for (let i = 0; i < board.length; i++) w[hand.length + i] = board[i];
    return w;
  });
  const winners: number[] = [];

  for (let it = 0; it < iters; it++) {
    // Partielles Fisher-Yates: nur `need` Karten ziehen
    for (let i = 0; i < need; i++) {
      const j = i + Math.floor(rng() * (stub.length - i));
      const tmp = stub[i];
      stub[i] = stub[j];
      stub[j] = tmp;
      for (let p = 0; p < works.length; p++) works[p][hands[p].length + board.length + i] = stub[i];
    }
    let best = -1;
    winners.length = 0;
    for (let p = 0; p < works.length; p++) {
      const v = evaluateBest(works[p]);
      if (v > best) {
        best = v;
        winners.length = 0;
        winners.push(p);
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
  // Ein einziger Stub, der über alle Iterationen weitergemischt wird: Das
  // partielle Fisher-Yates zieht aus jeder Permutation gleichverteilt, ein
  // Zurücksetzen (früher `baseStub.slice()`) ist dafür nicht nötig.
  const stub = freshDeck().filter((c) => !dead.has(c));
  const need = 5 - board.length;
  const drawCount = need + numOpponents * 2;
  let share = 0;

  // Arbeits-Arrays: [Hero-Karten | Board | gezogene Karten] bzw. dasselbe für den Gegner.
  const heroWork = new Array<Card>(hero.length + 5);
  for (let i = 0; i < hero.length; i++) heroWork[i] = hero[i];
  for (let i = 0; i < board.length; i++) heroWork[hero.length + i] = board[i];
  const oppWork = new Array<Card>(2 + 5);
  for (let i = 0; i < board.length; i++) oppWork[2 + i] = board[i];
  const heroDrawn = hero.length + board.length;
  const oppDrawn = 2 + board.length;

  for (let it = 0; it < iterations; it++) {
    for (let i = 0; i < drawCount; i++) {
      const j = i + Math.floor(rng() * (stub.length - i));
      const tmp = stub[i];
      stub[i] = stub[j];
      stub[j] = tmp;
    }
    for (let i = 0; i < need; i++) {
      heroWork[heroDrawn + i] = stub[i];
      oppWork[oppDrawn + i] = stub[i];
    }
    const heroVal = evaluateBest(heroWork);
    let bestOpp = -1;
    let tieCount = 0;
    for (let o = 0; o < numOpponents; o++) {
      const off = need + o * 2;
      oppWork[0] = stub[off];
      oppWork[1] = stub[off + 1];
      const v = evaluateBest(oppWork);
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
  const base = freshDeck().filter((c) => !dead.has(c));
  const stub = new Array<Card>(base.length - 2);
  const heroWork = new Array<Card>(hero.length + 5);
  for (let i = 0; i < hero.length; i++) heroWork[i] = hero[i];
  for (let i = 0; i < board.length; i++) heroWork[hero.length + i] = board[i];
  const villWork = new Array<Card>(2 + 5);
  for (let i = 0; i < board.length; i++) villWork[2 + i] = board[i];
  const heroDrawn = hero.length + board.length;
  const villDrawn = 2 + board.length;

  let share = 0;
  for (let it = 0; it < iterations; it++) {
    const [va, vb] = usable[Math.floor(rng() * usable.length)];
    // Stub ohne die beiden Villain-Karten – Reihenfolge wie im frischen Deck.
    let n = 0;
    for (let i = 0; i < base.length; i++) {
      const c = base[i];
      if (c !== va && c !== vb) stub[n++] = c;
    }
    for (let i = 0; i < need; i++) {
      const j = i + Math.floor(rng() * (n - i));
      const tmp = stub[i];
      stub[i] = stub[j];
      stub[j] = tmp;
      heroWork[heroDrawn + i] = stub[i];
      villWork[villDrawn + i] = stub[i];
    }
    villWork[0] = va;
    villWork[1] = vb;
    const hv = evaluateBest(heroWork);
    const vv = evaluateBest(villWork);
    if (hv > vv) share += 1;
    else if (hv === vv) share += 0.5;
  }
  return share / iterations;
}
