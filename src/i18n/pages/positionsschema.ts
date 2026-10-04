import { defineStrings } from '..';

/* Texte des Positionsschemas — für Bildschirmleser; im Bild stehen nur Kürzel
   und Zahlen. */
export const STR = defineStrings(
  {
    sitzplan: 'Sitzplan: sechs Plätze um den Tisch, beginnend beim Button',
    duSitzt: (pos: string) => `Du sitzt auf ${pos}`,
    einsatz: (pos: string, n: string) => `${pos} hat ${n} Big Blinds eingesetzt`,
    gefoldet: (liste: string) => `Gefoldet haben: ${liste}`,
  },
  {
    sitzplan: 'Seating plan: six seats around the table, starting at the button',
    duSitzt: (pos: string) => `You sit at ${pos}`,
    einsatz: (pos: string, n: string) => `${pos} has put in ${n} big blinds`,
    gefoldet: (liste: string) => `Folded: ${liste}`,
  },
);
