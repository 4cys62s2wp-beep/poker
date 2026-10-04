/* Die eine Serie.
   ===============

   Es gibt genau einen Zähler für „Tage in Folge": `data.streak`. Jede
   Lernhandlung füttert ihn — Lektion, Trainer, Wiederholung, Tages-Quiz, die
   gespielte Hand und die Hand des Tages. Vorher zählte die Hand des Tages
   ihre eigene Reihe (`pokermentor-heute-v1`), und die Startseite zeigte
   „1 Tag in Folge" neben „3 Tage-Streak": zwei Zahlen für dieselbe Sache,
   und keine davon stimmte für den, der beides tut.

   Was dieser Zähler allein nicht weiß: ob die Reihe noch lebt. `count` bleibt
   stehen, bis die nächste Handlung ihn auf 1 zurücksetzt — wer drei Tage
   nichts getan hat, hätte sonst weiter „5 Tage in Folge" vor sich. Diese
   beiden Funktionen sagen, was heute gilt. */

export interface SerieStand {
  lastDay: string;
  count: number;
}

/** `JJJJ-MM-TT` des lokalen Tages, `zurueck` Tage vor `von`. */
export function tagVor(von: string, zurueck: number): string {
  const [j, m, t] = von.split('-').map(Number);
  /* Über ein Date-Objekt: Monats- und Jahreswechsel sind sonst Fehlerquellen. */
  const d = new Date(j, m - 1, t - zurueck);
  const zwei = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${zwei(d.getMonth() + 1)}-${zwei(d.getDate())}`;
}

/** Wie viele Tage in Folge gelten *heute*: Die Reihe lebt, wenn heute oder
 *  gestern etwas getan wurde. Alles Ältere ist abgerissen — auch wenn der
 *  gespeicherte Zähler noch größer als null ist. */
export function aktuelleSerie(streak: SerieStand, heute: string): number {
  if (streak.count <= 0) return 0;
  return streak.lastDay === heute || streak.lastDay === tagVor(heute, 1) ? streak.count : 0;
}

/** Steht die Reihe auf dem Spiel? Ja, wenn sie lebt, aber heute noch nichts
 *  getan wurde — ab Mitternacht wäre sie weg. Davor darf die App sagen:
 *  „Heute noch etwas tun, dann bleibt sie." */
export function serieGefaehrdet(streak: SerieStand, heute: string): boolean {
  return streak.count > 0 && streak.lastDay === tagVor(heute, 1);
}
