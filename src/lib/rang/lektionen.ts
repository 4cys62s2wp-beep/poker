/* Der Stand innerhalb eines Moduls.
   ================================

   Dieselbe Überlegung wie beim Rangstand: Eine Rechnung, die drei
   Bildschirme brauchen, gehört nicht dreimal in JSX. Und eine Rechnung
   lässt sich prüfen. */

import { XP_ERGEBNIS, XP_FEST } from '../lernen/quiz';

/** Was eine Lektion höchstens einbringt.
 *
 *  Die Vergabe steht in `lib/lernen/quiz.ts` (`lektionsXp`): 20 Punkte fest,
 *  dazu bis zu 80 nach dem Ergebnis. Diese Datei nennt dieselben Zahlen unter
 *  den Namen, die die Anzeige braucht — eine Quelle, kein Band dazwischen. */
export const LEKTION_XP_GRUND = XP_FEST;
export const LEKTION_XP_QUIZ = XP_ERGEBNIS;
export const LEKTION_XP_HOECHSTENS = LEKTION_XP_GRUND + LEKTION_XP_QUIZ;

interface Lektion { id: string }

export interface Lektionsstand {
  gesamt: number;
  erledigt: number;
  /** 0 bis 1. Ein Modul ohne Lektionen gilt als fertig, nicht als leer —
   *  sonst zeigte der Ring dort für immer null an. */
  anteil: number;
  fertig: boolean;
  /** Die erste noch offene Lektion in der Reihenfolge des Moduls, oder
   *  `null`, wenn alle erledigt sind. Sie bekommt den Wegweiser. */
  naechsteId: string | null;
}

export function lektionsstand(
  lektionen: readonly Lektion[],
  erledigteLektionen: Record<string, unknown>,
): Lektionsstand {
  const gesamt = lektionen.length;
  const erledigt = lektionen.filter((l) => !!erledigteLektionen[l.id]).length;
  const naechste = lektionen.find((l) => !erledigteLektionen[l.id]);
  return {
    gesamt,
    erledigt,
    anteil: gesamt === 0 ? 1 : erledigt / gesamt,
    fertig: erledigt === gesamt,
    naechsteId: naechste?.id ?? null,
  };
}
