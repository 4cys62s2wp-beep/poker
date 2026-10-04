/* Was jemand am Übungstisch eingestellt hat: Gegnerzahl, Coach, Tipp vorher.
   Wie die Farbwahl ein Schlüssel im Gerätespeicher — nichts, was in den Lernstand
   oder in die Cloud gehört. */

import { durableSet } from '../storage';

const SCHLUESSEL = 'pokermentor-tisch-v1';

export interface TischEinstellung {
  /** Bewertung nach jeder Entscheidung. */
  coach: boolean;
  /** Den Rat schon vor dem Zug zeigen (statt nur auf Wunsch). */
  tippVorher: boolean;
  /** Gegner am Tisch: 1, 2 oder 5. */
  gegner: 1 | 2 | 5;
}

export const STANDARD_TISCH: TischEinstellung = { coach: true, tippVorher: false, gegner: 5 };

export function ladeTischEinstellung(): TischEinstellung {
  try {
    const roh = JSON.parse(localStorage.getItem(SCHLUESSEL) ?? 'null') as Partial<TischEinstellung> | null;
    if (!roh || typeof roh !== 'object') return { ...STANDARD_TISCH };
    return {
      coach: typeof roh.coach === 'boolean' ? roh.coach : STANDARD_TISCH.coach,
      tippVorher: typeof roh.tippVorher === 'boolean' ? roh.tippVorher : STANDARD_TISCH.tippVorher,
      gegner: roh.gegner === 1 || roh.gegner === 2 || roh.gegner === 5 ? roh.gegner : STANDARD_TISCH.gegner,
    };
  } catch {
    return { ...STANDARD_TISCH };
  }
}

export function speichereTischEinstellung(e: TischEinstellung): void {
  durableSet(SCHLUESSEL, JSON.stringify(e));
}
