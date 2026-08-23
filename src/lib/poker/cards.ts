// Kartenrepräsentation: Eine Karte ist eine Zahl 0–51.
// rank = card >> 2  (0 = Zwei ... 12 = Ass)
// suit = card & 3   (0 = Pik, 1 = Herz, 2 = Karo, 3 = Kreuz)

export type Card = number;

export const RANK_CHARS = '23456789TJQKA';
export const SUIT_CHARS = 'shdc';
export const SUIT_SYMBOLS = ['♠', '♥', '♦', '♣'];
export const RANK_NAMES = [
  'Zwei', 'Drei', 'Vier', 'Fünf', 'Sechs', 'Sieben', 'Acht', 'Neun',
  'Zehn', 'Bube', 'Dame', 'König', 'Ass',
];

export function makeCard(rank: number, suit: number): Card {
  return (rank << 2) | suit;
}

export function rankOf(card: Card): number {
  return card >> 2;
}

export function suitOf(card: Card): number {
  return card & 3;
}

/** Parst z. B. "As" → Karte (Pik-Ass). */
export function parseCard(str: string): Card {
  const rank = RANK_CHARS.indexOf(str[0].toUpperCase());
  const suit = SUIT_CHARS.indexOf(str[1].toLowerCase());
  if (rank < 0 || suit < 0) throw new Error(`Ungültige Karte: ${str}`);
  return makeCard(rank, suit);
}

/** Formatiert eine Karte als z. B. "As". */
export function cardToString(card: Card): string {
  return RANK_CHARS[rankOf(card)] + SUIT_CHARS[suitOf(card)];
}

/** Formatiert eine Karte hübsch, z. B. "A♠". */
export function cardToPretty(card: Card): string {
  return RANK_CHARS[rankOf(card)] + SUIT_SYMBOLS[suitOf(card)];
}

export function freshDeck(): Card[] {
  const deck: Card[] = [];
  for (let c = 0; c < 52; c++) deck.push(c);
  return deck;
}

/** Fisher-Yates-Shuffle (in place). */
export function shuffle<T>(arr: T[], rng: () => number = Math.random): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Neues gemischtes Deck ohne die angegebenen toten Karten. */
export function shuffledDeckWithout(dead: Card[], rng: () => number = Math.random): Card[] {
  const deadSet = new Set(dead);
  const deck = freshDeck().filter((c) => !deadSet.has(c));
  return shuffle(deck, rng);
}
