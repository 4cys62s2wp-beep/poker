/* Die Rangnamen — an genau einer Stelle.
   ====================================

   Es gab sie an dreien (E-044). Zwei davon habe ich in dieser Sitzung
   selbst geschaffen:

   - `LEVEL_TITLES` in `state/AppState.tsx`: die deutsche Liste, benutzt vom
     Rangstand.
   - `LEVEL_TITLES_I18N` in `i18n/index.tsx`: **beide** Sprachen, benutzt von
     der Kopfzeile — und offenbar seit E-012 dort, ohne dass der Rangstand
     davon wusste.
   - `LEVEL_TITLES_EN`, von mir ergänzt, weil ich die zweite Liste nicht
     gesehen hatte.

   Die beiden englischen Listen waren schon auseinander: „Rookie" gegen
   „Newcomer", „Climber" gegen „Riser". Genau das Problem, vor dem die
   Kommentare in diesem Projekt an einem Dutzend Stellen warnen — und es
   entsteht nicht durch Nachlässigkeit, sondern dadurch, dass man die andere
   Stelle nicht kennt.

   Deshalb steht die Liste hier: in einem Modul, das nichts weiter tut und
   das beide Seiten importieren können, ohne einen Kreis zu bauen. Der Typ
   der Sprache steht als `'de' | 'en'` da und wird nicht aus `i18n`
   geholt — sonst zöge diese Datei die gesamten Lerninhalte hinter sich her.

   Gültig sind die Namen aus `i18n`: Sie waren zuerst da und sind übersetzt
   worden, als es um die englische Fassung ging. */

export type Rangsprache = 'de' | 'en';

export const RANGNAMEN: Record<Rangsprache, readonly string[]> = {
  de: [
    'Neuling', 'Küchentisch-Spieler', 'Solider Anfänger', 'Aufsteiger', 'Grinder',
    'Regular', 'Range-Denker', 'Blattleser', 'Tisch-Kapitän', 'Crusher',
    'Poker-Mentor', 'High Roller', 'Final-Table-Stammgast', 'Elite-Grinder', 'Poker-Legende',
  ],
  en: [
    'Rookie', 'Kitchen-Table Player', 'Solid Beginner', 'Climber', 'Grinder',
    'Regular', 'Range Thinker', 'Hand Reader', 'Table Captain', 'Crusher',
    'Poker Mentor', 'High Roller', 'Final-Table Regular', 'Elite Grinder', 'Poker Legend',
  ],
};

/** Die Rangnamen der aktiven Sprache. */
export function rangnamen(sprache: Rangsprache): readonly string[] {
  return RANGNAMEN[sprache] ?? RANGNAMEN.de;
}

/** Der Name zu einem Level. Über die Liste hinaus gilt der letzte: Die Level
 *  gehen weiter, die Namen nicht (siehe `Rangstand.hoechsterRang`). */
export function rangname(level: number, sprache: Rangsprache): string {
  const namen = rangnamen(sprache);
  return namen[Math.min(Math.max(level, 1) - 1, namen.length - 1)];
}
