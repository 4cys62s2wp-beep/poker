/* Aufgaben, die etwas lehren: gewichtet ziehen statt gleichverteilt.
   ================================================================

   Der Preflop-Trainer zog Hände gleichverteilt. Das hat einen Preis: „immer
   Fold" war in 69 % der Aufgaben richtig, in der Eröffnung sogar in 74 % —
   wer nichts lernte, kam trotzdem auf zwei von drei. Und der Handranking-
   Trainer zeigte in 85 % der Fälle High Card, ein Paar oder zwei Paare; ein
   Flush oder eine Straße kamen in 7,6 % vor.

   Gelernt wird an der Grenze. Deshalb: etwa die Hälfte der Preflop-Hände
   liegt an der Rangegrenze (ein Feld in der Matrix von der Gegenseite
   entfernt), und die Kategorie im Handranking wird gewählt, dann gezogen. */

import type { Card } from './cards';
import { makeCard } from './cards';
import { categoryOf, evaluateBest } from './evaluator';
import { RANKS_DESC, combosForLabel, matrixLabel } from './ranges';

export type Zufall = () => number;

/** Position eines Labels in der 13×13-Matrix. */
const ORT = new Map<string, [number, number]>();
for (let r = 0; r < 13; r += 1) for (let c = 0; c < 13; c += 1) ORT.set(matrixLabel(r, c), [r, c]);

/**
 * Hände, bei denen die Entscheidung kippt: Das Label selbst liegt in der Range
 * (oder nicht), und mindestens ein Nachbarfeld in der Matrix liegt auf der
 * anderen Seite.
 */
export function grenzhaende(range: ReadonlySet<string>): string[] {
  const aus: string[] = [];
  for (const [label, [r, c]] of ORT) {
    const drin = range.has(label);
    const nachbarn: Array<[number, number]> = [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]];
    const kippt = nachbarn.some(([nr, nc]) => nr >= 0 && nr < 13 && nc >= 0 && nc < 13 && range.has(matrixLabel(nr, nc)) !== drin);
    if (kippt) aus.push(label);
  }
  return aus;
}

export interface GezogeneHand {
  label: string;
  cards: [Card, Card];
  /** Lag die Hand an der Grenze der Range? */
  grenze: boolean;
}

function zufallsKarten(rng: Zufall): [Card, Card] {
  const c1 = Math.floor(rng() * 52);
  let c2 = Math.floor(rng() * 51);
  if (c2 >= c1) c2 += 1;
  return [c1, c2];
}

function labelVon(c1: Card, c2: Card): string {
  const r1 = c1 >> 2;
  const r2 = c2 >> 2;
  const hi = Math.max(r1, r2);
  const lo = Math.min(r1, r2);
  const ch = (r: number) => RANKS_DESC[12 - r];
  if (hi === lo) return ch(hi) + ch(lo);
  return ch(hi) + ch(lo) + ((c1 & 3) === (c2 & 3) ? 's' : 'o');
}

/**
 * Eine Starthand für eine Range: mit der Wahrscheinlichkeit `anteilGrenze` von
 * der Grenze der Range (jedes Grenzlabel gleich wahrscheinlich, eine zufällige
 * Kartenkombination dazu), sonst wie eine echte Hand aus dem Stapel.
 */
export function ziehePreflopHand(
  range: ReadonlySet<string>,
  rng: Zufall = Math.random,
  anteilGrenze = 0.55,
): GezogeneHand {
  if (rng() < anteilGrenze) {
    const alle = grenzhaende(range);
    /* Je zur Hälfte von innen und von außen: Bei einer engen Range liegt außen
       ein viel größerer Ring, und gleichverteilt wäre die Grenze wieder fast
       immer „Fold". */
    const innen = alle.filter((l) => range.has(l));
    const aussen = alle.filter((l) => !range.has(l));
    const seite = (rng() < 0.5 ? innen : aussen);
    const liste = seite.length > 0 ? seite : alle;
    if (liste.length > 0) {
      const label = liste[Math.floor(rng() * liste.length)];
      const combos = combosForLabel(label);
      const cards = combos[Math.floor(rng() * combos.length)];
      return { label, cards, grenze: true };
    }
  }
  const [a, b] = zufallsKarten(rng);
  const label = labelVon(a, b);
  const gefunden = combosForLabel(label).find(([x, y]) => (x === a && y === b) || (x === b && y === a));
  return { label, cards: gefunden ?? [a, b], grenze: grenzhaende(range).includes(label) };
}

/* ── Handranking ──────────────────────────────────────────────────────── */

/** Wie oft welche Kategorie vorkommen soll (0 = High Card … 8 = Straight Flush).
 *  Nicht die natürliche Verteilung, aber auch keine Gleichverteilung: Paare
 *  bleiben die häufigsten, seltene Hände kommen oft genug, um sie zu erkennen. */
export const KATEGORIE_GEWICHT = [0.08, 0.19, 0.18, 0.13, 0.12, 0.12, 0.1, 0.05, 0.03];

function waehleKategorie(rng: Zufall): number {
  const x = rng();
  let summe = 0;
  for (let k = 0; k < KATEGORIE_GEWICHT.length; k += 1) {
    summe += KATEGORIE_GEWICHT[k];
    if (x < summe) return k;
  }
  return KATEGORIE_GEWICHT.length - 1;
}

function ziehe(rng: Zufall, n: number, ausser: Set<Card>): Card[] {
  const aus: Card[] = [];
  while (aus.length < n) {
    const c = Math.floor(rng() * 52);
    if (!ausser.has(c) && !aus.includes(c)) aus.push(c);
  }
  return aus;
}

function mische<T>(arr: T[], rng: Zufall): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Sieben Karten mit genau der gewünschten Kategorie. Vierling und Straight Flush
 *  werden gebaut (Ablehnung brauchte tausende Versuche), alles andere gezogen —
 *  mit Obergrenze, danach zählt die letzte Ziehung. */
function karten7(kategorie: number, rng: Zufall, maxVersuche: number): Card[] {
  if (kategorie === 8) {
    const spitze = 3 + Math.floor(rng() * 10); // 5-hoch … Ass-hoch
    const farbe = Math.floor(rng() * 4);
    const raenge = [0, 1, 2, 3, 4].map((i) => (spitze - i + 13) % 13);
    const fuenf = raenge.map((r) => makeCard(r, farbe));
    return mische([...fuenf, ...ziehe(rng, 2, new Set(fuenf))], rng);
  }
  if (kategorie === 7) {
    const rang = Math.floor(rng() * 13);
    const vier = [0, 1, 2, 3].map((s) => makeCard(rang, s));
    return mische([...vier, ...ziehe(rng, 3, new Set(vier))], rng);
  }
  let letzte: Card[] = [];
  for (let i = 0; i < maxVersuche; i += 1) {
    letzte = ziehe(rng, 7, new Set());
    if (categoryOf(evaluateBest(letzte)) === kategorie) return letzte;
  }
  return letzte;
}

export interface Handranking {
  hole: Card[];
  board: Card[];
  kategorie: number;
}

export function ziehHandranking(rng: Zufall = Math.random, maxVersuche = 800): Handranking {
  const kategorie = waehleKategorie(rng);
  const sieben = karten7(kategorie, rng, maxVersuche);
  return {
    hole: sieben.slice(0, 2),
    board: sieben.slice(2, 7),
    kategorie: categoryOf(evaluateBest(sieben)),
  };
}

/** Die fünf Karten, die die beste Hand bilden (aus den sieben). */
export function besteFuenf(sieben: Card[]): Card[] {
  const ziel = evaluateBest(sieben);
  for (let a = 0; a < 3; a += 1)
    for (let b = a + 1; b < 4; b += 1)
      for (let c = b + 1; c < 5; c += 1)
        for (let d = c + 1; d < 6; d += 1)
          for (let e = d + 1; e < 7; e += 1) {
            const fuenf = [sieben[a], sieben[b], sieben[c], sieben[d], sieben[e]];
            if (evaluateBest(fuenf) === ziel) return fuenf;
          }
  return sieben.slice(0, 5);
}
