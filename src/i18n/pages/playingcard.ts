import { defineStrings } from '..';

/* Spielkarten-Grafik. Die Karte ist ein <div role="img"> – ohne dieses
   Wörterbuch würde ein Screenreader „10♦“ vorlesen (bzw. gar nichts). */
export const STR = defineStrings(
  {
    faceDown: 'Verdeckte Karte',
    /** Reihenfolge wie RANK_CHARS ('23456789TJQKA'). */
    ranks: ['Zwei', 'Drei', 'Vier', 'Fünf', 'Sechs', 'Sieben', 'Acht', 'Neun', 'Zehn', 'Bube', 'Dame', 'König', 'Ass'],
    /** Reihenfolge wie SUIT_CHARS ('shdc'). */
    suits: ['Pik', 'Herz', 'Karo', 'Kreuz'],
    cardLabel: (rank: string, suit: string) => `${suit} ${rank}`,
  },
  {
    faceDown: 'Face-down card',
    ranks: ['Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack', 'Queen', 'King', 'Ace'],
    suits: ['spades', 'hearts', 'diamonds', 'clubs'],
    cardLabel: (rank: string, suit: string) => `${rank} of ${suit}`,
  },
);
