import { defineStrings } from '..';

/* Karten-Picker (wird u. a. vom Live-Coach genutzt). */
export const STR = defineStrings(
  {
    pickCard: 'Karte wählen',
    whichSuit: (rank: string) => `${rank} – welche Farbe?`,
    otherRank: '← anderer Rang',
  },
  {
    pickCard: 'Pick a card',
    whichSuit: (rank: string) => `${rank} – which suit?`,
    otherRank: '← different rank',
  },
);
