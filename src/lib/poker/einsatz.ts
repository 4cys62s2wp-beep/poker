/* Einsatzgrößen am Übungstisch.
   ============================

   Vor dem Flop sind es Vielfache des Big Blinds (2,5 · 3 · 4), gegen eine
   Erhöhung Vielfache der Erhöhung (2,5× · 3× · 4×), nach dem Flop Anteile des
   Pots (⅓ · ½ · ¾ · Pot), dazu immer All-in. Jede Vorgabe trägt ihren
   Zielbetrag. Vorgaben, die auf dasselbe Ergebnis kommen (⅓ Pot ist kleiner als
   das Minimum), werden eine — sonst stünden drei Knöpfe für „5" in der Leiste. */

import type { GameState, LegalActions } from './engine';
import { totalPot } from './engine';

export type VorgabeArt =
  | { art: 'min' }
  | { art: 'bb' }
  | { art: 'mal'; faktor: number }
  | { art: 'pot'; teil: number }
  | { art: 'allin' };

export interface Vorgabe {
  art: VorgabeArt;
  /** Gesamteinsatz der Runde in Chips („auf …"). */
  to: number;
}

const PREFLOP_BB = [2.5, 3, 4];
const PREFLOP_MAL = [2.5, 3, 4];
const POT_TEILE = [1 / 3, 1 / 2, 3 / 4, 1];

export function einsatzVorgaben(g: GameState, la: LegalActions): Vorgabe[] {
  if (!la.canBetOrRaise) return [];
  const roh: Vorgabe[] = [];

  if (g.street === 'preflop') {
    if (g.currentBet <= g.bigBlind) {
      for (const x of PREFLOP_BB) roh.push({ art: { art: 'bb' }, to: Math.round(x * g.bigBlind) });
    } else {
      for (const f of PREFLOP_MAL) roh.push({ art: { art: 'mal', faktor: f }, to: Math.round(f * g.currentBet) });
    }
  } else {
    const pot = totalPot(g);
    for (const teil of POT_TEILE) {
      const to = g.currentBet === 0
        ? Math.round(teil * pot)
        : Math.round(g.currentBet + teil * (pot + la.callAmount));
      roh.push({ art: { art: 'pot', teil }, to });
    }
  }

  const aus: Vorgabe[] = [];
  const gesehen = new Set<number>();
  for (const v of roh) {
    // Unter dem Minimum ist es das Minimum, über dem Stack ist es All-in.
    let to = v.to;
    let art = v.art;
    if (to < la.minRaiseTo) { to = la.minRaiseTo; art = { art: 'min' }; }
    if (to >= la.maxRaiseTo) continue;
    if (gesehen.has(to)) continue;
    gesehen.add(to);
    aus.push({ art, to });
  }
  aus.push({ art: { art: 'allin' }, to: la.maxRaiseTo });
  return aus;
}

/** Die Vorgabe, die beim Öffnen der Auswahl vorbelegt ist: die zweite, soweit sie
 *  da ist — vor dem Flop 3 BB, danach der halbe Pot. All-in nie von selbst. */
export function standardEinsatz(vorgaben: Vorgabe[]): number | null {
  if (vorgaben.length === 0) return null;
  const ohneAllIn = vorgaben.filter((v) => v.art.art !== 'allin');
  const wahl = ohneAllIn.length > 0 ? ohneAllIn[Math.min(1, ohneAllIn.length - 1)] : vorgaben[0];
  return wahl.to;
}

/** Ein Schritt nach oben oder unten: ein halber Big Blind, ab zehn Big Blinds ein ganzer. */
export function einsatzSchritt(to: number, richtung: 1 | -1, la: LegalActions, bb: number): number {
  const schritt = to < 10 * bb ? Math.max(1, Math.round(bb / 2)) : bb;
  return Math.max(la.minRaiseTo, Math.min(la.maxRaiseTo, to + richtung * schritt));
}
