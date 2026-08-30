/* Wo man im Levelsystem steht.
   ===========================

   Die Schwellen und die Rangnamen stehen in `state/AppState.tsx` — sie sind
   Teil des gespeicherten Zustands und bleiben dort. Was hier entsteht, ist
   die **Auskunft**, die ein Bildschirm braucht, um den Stand zu zeigen:
   Wie weit ist der Ring, wie viele XP fehlen, wie heißt der nächste Rang.

   Warum das nicht in der Seite steht
   ----------------------------------
   Weil es an drei Stellen gebraucht wird — Lernpfad, Profil, Startseite —
   und eine dreimal abgeschriebene Rechnung dreimal anders altert. Und weil
   sich eine Rechnung prüfen lässt, ein JSX-Ausdruck nicht. */

import { LEVEL_TITLES, levelForXp, xpThreshold } from '../../state/AppState';

export interface Rangstand {
  level: number;
  /** Der Rangname zu diesem Level. */
  titel: string;
  /** Der Rangname des nächsten Levels, oder `null`, wenn es keinen mehr gibt. */
  naechsterTitel: string | null;
  /** XP, ab denen dieses Level gilt. */
  von: number;
  /** XP, ab denen das nächste Level gilt. */
  bis: number;
  /** Wie weit zwischen `von` und `bis`, 0 bis 1. */
  anteil: number;
  /** Wie viele XP bis zum nächsten Level fehlen. */
  fehlt: number;
  /** Ob der letzte **Rangname** erreicht ist. Die Level selbst gehen weiter:
   *  `levelForXp` kennt keine Obergrenze, die Titelliste schon. Das ist
   *  Absicht — ein Spielstand soll nicht aufhören zu wachsen, nur weil die
   *  Namen ausgehen —, aber ein Bildschirm muss es wissen, sonst schreibt
   *  er „nächster Rang: undefined". */
  hoechsterRang: boolean;
}

export function rangstand(xp: number): Rangstand {
  /* Negative oder unsinnige XP kann es nicht geben — aber ein beschädigter
     Gerätespeicher kann alles enthalten, und ein Ring mit negativer Füllung
     sähe aus wie ein Fehler in der App statt wie einer in den Daten. */
  const sicher = Number.isFinite(xp) && xp > 0 ? xp : 0;
  const level = levelForXp(sicher);
  const von = xpThreshold(level);
  const bis = xpThreshold(level + 1);
  const spanne = bis - von;
  return {
    level,
    titel: LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)],
    naechsterTitel: level < LEVEL_TITLES.length ? LEVEL_TITLES[level] : null,
    von,
    bis,
    anteil: spanne <= 0 ? 1 : Math.max(0, Math.min(1, (sicher - von) / spanne)),
    fehlt: Math.max(0, bis - sicher),
    hoechsterRang: level >= LEVEL_TITLES.length,
  };
}
