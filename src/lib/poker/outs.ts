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

/**
 * Chance, mit `outs` Outs auf der **einen noch kommenden** Karte zu treffen:
 * am Turn, wenn nur noch der River aussteht — 46 unbekannte Karten.
 *
 * Nicht zu verwechseln mit der Turn-Karte nach dem Flop: Dort sind es 47,
 * also `outs / 47`. Der Unterschied ist klein (bei 9 Outs 19,6 statt 19,1 %)
 * und genau deshalb gefährlich — er fällt nicht auf. Die Odds-Tabelle nennt
 * die Annahme in ihrer Fußnote mit; wer diese Funktion anderswo benutzt,
 * muss dasselbe tun.
 */
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
