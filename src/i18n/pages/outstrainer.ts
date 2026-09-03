import { defineStrings } from '..';

/** Schlüssel der Aufgaben-Vorlagen im Outs-Zähler. */
export type OutsTemplateKey =
  | 'flush'
  | 'oesd'
  | 'gutshot'
  | 'overcards'
  | 'flushOvercards'
  | 'flushGutshot'
  | 'setFull';

export const STR = defineStrings(
  {
    back: '← Trainer',
    title: 'Outs-Zähler',
    sub: 'Outs sind die Karten, die deine Hand verbessern · Regel von 2 und 4',
    correctCount: (n: number) => `✓ ${n} richtig`,
    totalCount: (n: number) => `${n} gesamt`,
    streak: (n: number) => `Serie: ${n}`,
    yourHand: 'Deine Hand',
    flop: 'Flop',
    questions: {
      flush: 'Wie viele Outs hast du auf den Flush?',
      oesd: 'Wie viele Outs hast du auf die Straße?',
      gutshot: 'Wie viele Outs hast du auf die Straße?',
      overcards: 'Wie viele Outs hast du auf ein Top Pair (Ass oder König)?',
      flushOvercards: 'Wie viele Outs hast du auf Flush ODER Top Pair (Ass/König)?',
      flushGutshot: 'Wie viele Outs hast du auf Flush ODER Straße?',
      setFull: 'Du hast ein Set. Wie viele Turn-Karten verbessern dich zu Full House oder Quads?',
    } as Record<OutsTemplateKey, string>,
    explanations: {
      flush:
        'Von 13 Karten deiner Farbe siehst du bereits 4 (zwei auf der Hand, zwei auf dem Board). Es bleiben 13 − 4 = 9 Outs.',
      oesd: 'Ein Open-Ended Straight Draw kann an beiden Enden vervollständigt werden: 2 Ränge × 4 Karten = 8 Outs.',
      gutshot: 'Dir fehlt genau die 9 in der Mitte (Gutshot / Bauchschuss): Nur 1 Rang × 4 Karten = 4 Outs.',
      overcards: 'Je 3 verbleibende Asse und 3 Könige: 3 + 3 = 6 Outs. Achtung: Overcard-Outs sind oft „verschmutzt“.',
      flushOvercards:
        '9 Flush-Outs + 3 Asse + 3 Könige (jeweils außerhalb deiner Farbe bereits mitgezählt: A und K deiner Farbe stecken in deiner Hand) = 15 Outs.',
      flushGutshot: '9 Flush-Outs + 4 Neunen für den Gutshot − 1 (die 9 deiner Farbe wäre doppelt gezählt) = 12 Outs.',
      setFull:
        'Je 3 Karten der beiden anderen Board-Ränge (3 + 3 = 6) plus die letzte Karte deines Set-Rangs (1) = 7 Outs.',
    } as Record<OutsTemplateKey, string>,
    outsBtn: (n: number) => `${n} Outs`,
    correctFb: '✓ Richtig! ',
    wrongFb: (outs: number) => `✗ Es sind ${outs} Outs. `,
    equityNote: (pct: number) => `Equity-Schätzung (Regel von 4): ca. ${pct} % bis zum River.`,
    nextSituation: 'Nächste Situation →',
  },
  {
    back: '← Trainers',
    title: 'Outs Counter',
    sub: 'Outs are the cards that improve your hand · rule of 2 and 4',
    correctCount: (n: number) => `✓ ${n} correct`,
    totalCount: (n: number) => `${n} total`,
    streak: (n: number) => `Streak: ${n}`,
    yourHand: 'Your Hand',
    flop: 'Flop',
    questions: {
      flush: 'How many outs do you have to the flush?',
      oesd: 'How many outs do you have to the straight?',
      gutshot: 'How many outs do you have to the straight?',
      overcards: 'How many outs do you have to top pair (ace or king)?',
      flushOvercards: 'How many outs do you have to a flush OR top pair (ace/king)?',
      flushGutshot: 'How many outs do you have to a flush OR a straight?',
      setFull: 'You have a set. How many turn cards improve you to a full house or quads?',
    } as Record<OutsTemplateKey, string>,
    explanations: {
      flush:
        'Of the 13 cards in your suit you can already see 4 (two in your hand, two on the board). That leaves 13 − 4 = 9 outs.',
      oesd: 'An open-ended straight draw can be completed at either end: 2 ranks × 4 cards = 8 outs.',
      gutshot: 'You’re missing exactly the 9 in the middle (a gutshot): just 1 rank × 4 cards = 4 outs.',
      overcards: '3 remaining aces plus 3 kings: 3 + 3 = 6 outs. Careful: overcard outs are often “dirty”.',
      flushOvercards:
        '9 flush outs + 3 aces + 3 kings (counting only those outside your suit: the A and K of your suit are in your hand) = 15 outs.',
      flushGutshot: '9 flush outs + 4 nines for the gutshot − 1 (the 9 of your suit would be counted twice) = 12 outs.',
      setFull:
        '3 cards of each of the other two board ranks (3 + 3 = 6) plus the last card of your set rank (1) = 7 outs.',
    } as Record<OutsTemplateKey, string>,
    outsBtn: (n: number) => `${n} outs`,
    correctFb: '✓ Correct! ',
    wrongFb: (outs: number) => `✗ It’s ${outs} outs. `,
    equityNote: (pct: number) => `Equity estimate (rule of 4): about ${pct}% by the river.`,
    nextSituation: 'Next Situation →',
  },
);
