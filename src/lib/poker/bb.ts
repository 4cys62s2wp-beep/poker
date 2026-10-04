/* Beträge am Übungstisch in Big Blinds.
   ====================================

   Die Engine rechnet in Chips (Big Blind = 2, damit der Small Blind eine ganze
   Zahl bleibt). Gezeigt wird in Big Blinds: „Raise auf 6" heißt drei Big Blinds
   und ist im Trainer, in der Lektion und im Coach dieselbe Zahl (E-093). Ein
   halber Big Blind steht mit Komma („2,5"), im Englischen mit Punkt. */

export type BbSprache = 'de' | 'en';

/** Chips → Big Blinds als Text, auf eine Nachkommastelle gerundet („2,5", „7"). */
export function formatBB(chips: number, bb: number, lang: BbSprache = 'de'): string {
  const v = Math.round((chips / bb) * 10) / 10;
  const s = Number.isInteger(v) ? String(v) : v.toFixed(1);
  return lang === 'de' ? s.replace('.', ',') : s;
}
