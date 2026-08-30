/* Der Stand innerhalb eines Moduls.
   ================================

   Dieselbe Überlegung wie beim Rangstand: Eine Rechnung, die drei
   Bildschirme brauchen, gehört nicht dreimal in JSX. Und eine Rechnung
   lässt sich prüfen. */

/** Was eine Lektion höchstens einbringt.
 *
 *  Die Vergabe steht in `state/AppState.tsx` (`completeLesson`): 60 Punkte
 *  fürs Abschließen, dazu bis zu 40 für das Quiz. Die Zahl steht hier, weil
 *  ein Bildschirm sie anzeigt — und ein Test hält beide Stellen zusammen,
 *  damit sie nicht auseinanderlaufen. */
export const LEKTION_XP_GRUND = 60;
export const LEKTION_XP_QUIZ = 40;
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
