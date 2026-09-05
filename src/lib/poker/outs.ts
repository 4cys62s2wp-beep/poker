/* Verbesserungschancen aus der Zahl der Outs.
   =========================================

   Zwei Formeln, die in der App an mehreren Stellen gebraucht werden: in der
   Odds-Tabelle zum Ablesen und als Vorschau auf der Nachschlagen-Seite.

   Sie stehen hier und nicht in der Tabelle, weil eine zweite Abschrift
   irgendwann auseinanderläuft — und weil eine Zahl, die auf einer Kachel
   steht, dieselbe sein muss wie die in der Tabelle dahinter. Sonst ist die
   Vorschau eine Behauptung statt eines Auszugs.

   Die Nenner: Nach dem Flop kennt man fünf Karten (zwei eigene, drei auf dem
   Board), also sind 47 unbekannt; nach dem Turn 46. */

/** Chance, mit `outs` Outs auf der nächsten Karte zu treffen (Turn ODER River). */
export function chanceEineKarte(outs: number): number {
  return outs / 46;
}

/** Chance, mit `outs` Outs bis zum River zu treffen (Turn UND River). */
export function chanceZweiKarten(outs: number): number {
  return 1 - ((47 - outs) / 47) * ((46 - outs) / 46);
}

/** Die zwei Draws, nach denen am häufigsten gefragt wird — als Outs. */
export const OUTS_FLUSHDRAW = 9;
export const OUTS_GUTSHOT = 4;
