/* Eine Hand in Worten: „Paar Damen", „Straße bis Dame".
   ====================================================

   Der Auswerter kennt nur die Kategorie („Ein Paar"). Am Showdown reicht das
   nicht: „Ein Paar schlägt Ein Paar" sagt nicht, warum. Der Wert der Hand trägt
   die Ränge schon in sich (Kategorie · Rang · Kicker …, je fünfzehnerweise),
   hier werden sie wieder ausgelesen. */

import type { Card } from './cards';
import type { GameState } from './engine';
import { categoryOf, evaluateBest } from './evaluator';

type Sprache = 'de' | 'en';

const BASIS = 15;
const POTENZ = [BASIS ** 4, BASIS ** 3, BASIS ** 2, BASIS, 1];
const KATEGORIE = BASIS ** 5;

const SING: Record<Sprache, string[]> = {
  de: ['Zwei', 'Drei', 'Vier', 'Fünf', 'Sechs', 'Sieben', 'Acht', 'Neun', 'Zehn', 'Bube', 'Dame', 'König', 'Ass'],
  en: ['Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack', 'Queen', 'King', 'Ace'],
};
const PLUR: Record<Sprache, string[]> = {
  de: ['Zweien', 'Dreien', 'Vieren', 'Fünfen', 'Sechsen', 'Siebenen', 'Achten', 'Neunen', 'Zehnen', 'Buben', 'Damen', 'Könige', 'Asse'],
  en: ['Twos', 'Threes', 'Fours', 'Fives', 'Sixes', 'Sevens', 'Eights', 'Nines', 'Tens', 'Jacks', 'Queens', 'Kings', 'Aces'],
};

/** Die fünf Rangstellen nach der Kategorie, höchste zuerst. */
export function rangStellen(wert: number): number[] {
  const rest = wert % KATEGORIE;
  return POTENZ.map((p) => Math.floor(rest / p) % BASIS);
}

/** Wie viele Stellen die „Hauptsache" der Kategorie ausmachen; danach kommen Kicker. */
function hauptStellen(kategorie: number): number {
  switch (kategorie) {
    case 2:
    case 6: return 2;
    case 0: return 0;
    case 1:
    case 3: return 1;
    default: return 5;
  }
}

export function handText(wert: number, lang: Sprache = 'de'): string {
  const k = categoryOf(wert);
  const [a, b] = rangStellen(wert);
  const s = SING[lang];
  const p = PLUR[lang];
  if (lang === 'en') {
    switch (k) {
      case 0: return `${s[a]} high`;
      case 1: return `Pair of ${p[a]}`;
      case 2: return `Two pair, ${p[a]} and ${p[b]}`;
      case 3: return `Three ${p[a]}`;
      case 4: return `${s[a]}-high straight`;
      case 5: return `${s[a]}-high flush`;
      case 6: return `Full house, ${p[a]} full of ${p[b]}`;
      case 7: return `Four ${p[a]}`;
      default: return a === 12 ? 'Royal flush' : `${s[a]}-high straight flush`;
    }
  }
  switch (k) {
    case 0: return `${s[a]} hoch`;
    case 1: return `Paar ${p[a]}`;
    case 2: return `Zwei Paare, ${p[a]} und ${p[b]}`;
    case 3: return `Drilling ${p[a]}`;
    case 4: return `Straße bis ${s[a]}`;
    case 5: return `Flush, ${s[a]} hoch`;
    case 6: return `Full House, ${p[a]} voll mit ${p[b]}`;
    case 7: return `Vierling ${p[a]}`;
    default: return a === 12 ? 'Royal Flush' : `Straight Flush bis ${s[a]}`;
  }
}

/** Der erste Rang, in dem zwei gleich starke Hände sich unterscheiden — der Kicker. */
function kickerStelle(x: number, y: number): number | null {
  const k = categoryOf(x);
  if (k !== categoryOf(y)) return null;
  const sx = rangStellen(x);
  const sy = rangStellen(y);
  const haupt = hauptStellen(k);
  for (let i = 0; i < haupt; i += 1) if (sx[i] !== sy[i]) return null;
  if (k >= 4 || k === 6) return null; // hier gibt es keinen Kicker
  for (let i = haupt; i < 5; i += 1) if (sx[i] !== sy[i]) return i;
  return null;
}

export interface Beteiligter {
  name: string;
  isHero: boolean;
  text: string;
}

export interface ShowdownVergleich {
  /** Teilen mehrere den Pot? Dann gibt es keinen Verlierer zu nennen. */
  geteilt: boolean;
  sieger: Beteiligter;
  /** Die stärkste Hand unter denen, die verloren haben (nur ohne Teilung). */
  gegner?: Beteiligter;
}

/**
 * Wer am Showdown gewonnen hat und gegen wen — mit dem Grund, den ein Mensch
 * nennen würde („Paar Damen"; bei gleicher Hauptsache mit Kicker). Ohne
 * Showdown (alle anderen gefoldet) gibt es nichts zu vergleichen.
 */
export function showdownVergleich(g: GameState, lang: Sprache = 'de', kickerWort = 'Kicker'): ShowdownVergleich | null {
  if (!g.handOver || g.street !== 'showdown') return null;
  const dabei = g.players.filter((p) => !p.folded && p.cards.length === 2);
  if (dabei.length < 2) return null;
  const wert = new Map<number, number>();
  for (const p of dabei) wert.set(p.id, evaluateBest([...(p.cards as Card[]), ...g.board]));

  const bestes = Math.max(...dabei.map((p) => wert.get(p.id)!));
  const gewinner = dabei.filter((p) => wert.get(p.id) === bestes);
  const siegerSpieler = gewinner[0];
  const verlierer = dabei.filter((p) => wert.get(p.id) !== bestes);
  const gegnerSpieler = verlierer.sort((a, b) => wert.get(b.id)! - wert.get(a.id)!)[0];

  const beschreibe = (p: (typeof dabei)[number], mit: number | null, andere: number): Beteiligter => {
    let text = handText(wert.get(p.id)!, lang);
    const stelle = mit === null ? null : kickerStelle(wert.get(p.id)!, andere);
    if (stelle !== null) {
      text += `, ${kickerWort} ${SING[lang][rangStellen(wert.get(p.id)!)[stelle]]}`;
    }
    return { name: p.name, isHero: p.isHero, text };
  };

  if (gewinner.length > 1 || !gegnerSpieler) {
    return { geteilt: gewinner.length > 1, sieger: beschreibe(siegerSpieler, null, bestes) };
  }
  return {
    geteilt: false,
    sieger: beschreibe(siegerSpieler, 1, wert.get(gegnerSpieler.id)!),
    gegner: beschreibe(gegnerSpieler, 1, bestes),
  };
}
