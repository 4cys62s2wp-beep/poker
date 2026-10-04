/* Trefferquote je Übungsspot.
   ===========================

   „Du triffst im Cutoff 62 %, im Big Blind 41 %" sagt mehr als eine Quote über
   alles. Die Zahl liegt im Gerätespeicher neben dem Lernstand, nicht in ihm:
   `AppData.trainers` zählt je Trainer und fließt in Abzeichen und XP — ein
   zweiter Eintrag je Spot würde doppelt zählen. */

import { durableSet } from '../storage';

const SCHLUESSEL = 'pokermentor-spots-v1';

export interface SpotStand {
  versuche: number;
  richtig: number;
}

export function ladeSpots(): Record<string, SpotStand> {
  try {
    const roh = JSON.parse(localStorage.getItem(SCHLUESSEL) ?? '{}') as Record<string, Partial<SpotStand>>;
    const aus: Record<string, SpotStand> = {};
    for (const [k, v] of Object.entries(roh)) {
      if (typeof v?.versuche !== 'number' || typeof v?.richtig !== 'number') continue;
      const versuche = Math.max(0, Math.floor(v.versuche));
      aus[k] = { versuche, richtig: Math.min(versuche, Math.max(0, Math.floor(v.richtig))) };
    }
    return aus;
  } catch {
    return {};
  }
}

export function bucheSpot(spot: string, richtig: boolean): Record<string, SpotStand> {
  const alle = ladeSpots();
  const alt = alle[spot] ?? { versuche: 0, richtig: 0 };
  alle[spot] = { versuche: alt.versuche + 1, richtig: alt.richtig + (richtig ? 1 : 0) };
  durableSet(SCHLUESSEL, JSON.stringify(alle));
  return alle;
}

/** Die Quote in Prozent — erst ab drei Versuchen, vorher ist sie keine Auskunft. */
export function quoteVon(s?: SpotStand): number | null {
  if (!s || s.versuche < 3) return null;
  return Math.round((100 * s.richtig) / s.versuche);
}
