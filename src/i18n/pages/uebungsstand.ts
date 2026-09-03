/* Der Übungsstand — die Texte für die Leiste über jedem Trainer.
   ============================================================
   Eine Datei für alle sieben, weil die Leiste in allen dieselbe ist. Vorher
   stand in jedem Trainer dieselbe Zeile aus drei grauen Pillen, und jede
   Änderung daran wäre siebenmal fällig gewesen. */
import { defineStrings } from '..';

export const STR = defineStrings(
  {
    serie: 'Serie',
    serieRing: (n: number) => `Serie: ${n} richtige in Folge`,
    treffer: 'Treffer',
    trefferRing: (prozent: number) => `Trefferquote: ${prozent} Prozent`,
    beste: 'Beste',
    besteRing: (n: number) => `Beste Serie: ${n}`,
    nochNichts: 'Noch nichts',
    ersteAufgabe: 'Erste Aufgabe wartet',
    /* Kein Prozentwert ohne Versuche: „0 %" nach null Aufgaben ist keine
       Auskunft, sondern ein Vorwurf. */
    ohneQuote: '–',
    neuerRekord: 'Neue Bestserie',
  },
  {
    serie: 'Streak',
    serieRing: (n: number) => `Streak: ${n} correct in a row`,
    treffer: 'Hit rate',
    trefferRing: (prozent: number) => `Hit rate: ${prozent} percent`,
    beste: 'Best',
    besteRing: (n: number) => `Best streak: ${n}`,
    nochNichts: 'Nothing yet',
    ersteAufgabe: 'First task is waiting',
    ohneQuote: '–',
    neuerRekord: 'New best streak',
  },
);
