/* Lektion und Training verweisen aufeinander.
   ===========================================

   Eine Lektion erklärt, der Trainer lässt üben — und beide wussten nichts
   voneinander: Nach dem Quiz zu „Pot Odds" stand kein Weg zum Pot-Odds-Drill,
   und im Trainer kein Weg zur Lektion. CONCEPT.md nennt das Leitprinzip 2:
   Lernen und Üben sind ein Weg.

   Die Zuordnung steht **hier**, an einer Stelle, nicht in 49 Lektionen und
   zwei Sprachen. Aus ihr ergeben sich beide Richtungen: die Lektion kennt
   ihre Übung, der Trainer seine Lektionen. Ein Test hält sie gegen die
   Inhalte. */

import type { TrainerId } from '../trainerliste';
import type { OrtPfad } from '../orte';

/** Wohin eine Lektion zum Üben führt. */
export type UebungsZiel = TrainerId | 'drill' | 'uebungstisch';

export const ZIEL_PFAD: Record<UebungsZiel, OrtPfad> = {
  szenario: '/lernen/trainer/szenario',
  preflop: '/lernen/trainer/preflop',
  potodds: '/lernen/trainer/potodds',
  equity: '/lernen/trainer/equity',
  handranking: '/lernen/trainer/handranking',
  outs: '/lernen/trainer/outs',
  pushfold: '/lernen/trainer/pushfold',
  drill: '/lernen/drill',
  uebungstisch: '/lernen/uebungstisch',
};

/** Lektion → Übung, in Kursreihenfolge. Nicht jede Lektion hat eine: Zu
 *  Tilt und Bankroll gibt es nichts zu trainieren, was ein Trainer abfragte. */
export const UEBUNG: Record<string, UebungsZiel> = {
  'm1-l1': 'uebungstisch',
  'm1-l2': 'handranking',
  'm1-l3': 'szenario',
  'm1-l4': 'uebungstisch',
  'm2-l1': 'preflop',
  'm2-l2': 'preflop',
  'm2-l3': 'preflop',
  'm2-l4': 'preflop',
  'm2-l5': 'szenario',
  'm3-l1': 'outs',
  'm3-l2': 'equity',
  'm3-l3': 'drill',
  'm3-l4': 'potodds',
  'm3-l5': 'potodds',
  'm3-l6': 'equity',
  'm4-l1': 'szenario',
  'm4-l2': 'szenario',
  'm4-l3': 'szenario',
  'm4-l4': 'szenario',
  'm4-l5': 'outs',
  'm4-l6': 'szenario',
  'm5-l5': 'pushfold',
};

export function uebungFuer(lektionId: string): UebungsZiel | null {
  return UEBUNG[lektionId] ?? null;
}

/* Den Pot-Odds-Drill gibt es als Ziel von „Jetzt üben", aber er trägt kein
   „Konzept nachlesen": Seine Höhenkette (zwischen Antwort und Auflösung bewegt
   sich nichts, auch auf einem 667 Pixel hohen Gerät) lässt keine zusätzliche
   Zeile zu, und seine Rechnung zeigt er ohnehin selbst („Warum? Ganze Rechnung
   ansehen"). */

/** Die Lektionen, die zu einer Übung hinführen — in Kursreihenfolge. */
export function lektionenFuer(ziel: UebungsZiel): string[] {
  return Object.entries(UEBUNG).filter(([, z]) => z === ziel).map(([id]) => id);
}
