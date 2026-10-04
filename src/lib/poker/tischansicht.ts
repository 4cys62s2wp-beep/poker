/* Was am Tisch zu sehen ist, aus dem Protokoll gelesen.
   ====================================================

   Die Engine schreibt zu jeder Aktion einen Eintrag mit Straße, Spieler und
   strukturierter Aktion (`LogAktion`). Daraus entstehen die Marke am Sitz
   („Raise 7") und die Kurzzeile unter dem Board („David erhöht auf 7") — ohne
   den Protokolltext zu zerlegen. */

import type { GameState, LogAktion } from './engine';

/** Die letzte freiwillige Aktion jedes Sitzes in der laufenden Setzrunde
 *  (Blinds zählen nicht, Fold zeigt der Sitz selbst). */
export function aktionJeSitz(g: GameState): Map<number, LogAktion> {
  const m = new Map<number, LogAktion>();
  if (g.handOver) return m;
  for (const e of g.log) {
    if (e.street !== g.street || e.playerId === undefined || !e.aktion) continue;
    if (e.aktion.art === 'blind' || e.aktion.art === 'fold') continue;
    m.set(e.playerId, e.aktion);
  }
  return m;
}

/** Was zuletzt jemand getan hat (außer Blinds) — für die Kurzzeile. */
export function letzteAktion(g: GameState): { playerId: number; aktion: LogAktion } | null {
  for (let i = g.log.length - 1; i >= 0; i -= 1) {
    const e = g.log[i];
    if (e.playerId !== undefined && e.aktion && e.aktion.art !== 'blind') {
      return { playerId: e.playerId, aktion: e.aktion };
    }
  }
  return null;
}

/** Nur der Vorname: „Anna „die Steinwand“" → „Anna". Am Sitz ist kein Platz für mehr. */
export function vorname(name: string): string {
  return name.split(/\s+/)[0] ?? name;
}
