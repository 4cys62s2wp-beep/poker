// Bot-Entscheidungslogik für den Übungstisch.
// Preflop: chartbasiert (RFI-Ranges + einfache Verteidigungslogik).
// Postflop: Equity-Schätzung (Monte Carlo) + Pot Odds + Stil-Parameter.

import type { Action, GameState } from './engine';
import { legalActions, totalPot } from './engine';
import { handLabel } from './ranges';
import { expandRangeSpec } from './ranges';
import { equityVsRandomHands } from './equity';
import { RFI_CHARTS, BB_DEFENSE_VS_BTN, type Position } from '../../content/ranges';

export type BotStyle = 'tight' | 'standard' | 'loose' | 'aggro';

export interface BotProfile {
  style: BotStyle;
  /** 0–1: Wie oft blufft der Bot in passenden Spots. */
  bluffFreq: number;
  /** Additiver Equity-Bonus/Malus auf Schwellen (looser = negativ). */
  looseness: number;
}

export const BOT_PROFILES: Record<BotStyle, BotProfile> = {
  tight: { style: 'tight', bluffFreq: 0.12, looseness: 0.05 },
  standard: { style: 'standard', bluffFreq: 0.22, looseness: 0 },
  loose: { style: 'loose', bluffFreq: 0.18, looseness: -0.08 },
  aggro: { style: 'aggro', bluffFreq: 0.38, looseness: -0.04 },
};

// Vorexpandierte Label-Mengen
const RFI_SETS = new Map<string, Set<string>>(
  RFI_CHARTS.map((c) => [c.position, expandRangeSpec(c.raise)]),
);
const PREMIUM = expandRangeSpec(['QQ+', 'AKs', 'AKo']);
const STRONG = expandRangeSpec(['77+', 'AQs+', 'AQo+', 'AJs', 'ATs', 'KQs', 'KJs', 'QJs', 'JTs', 'T9s']);
const SPECULATIVE = expandRangeSpec(['22+', 'A2s+', '54s+', 'KTs+', 'QTs+', 'JTs', 'ATo+', 'KQo']);
const BB_DEFEND = new Set<string>([
  ...expandRangeSpec(BB_DEFENSE_VS_BTN.threeBet),
  ...expandRangeSpec(BB_DEFENSE_VS_BTN.call),
]);

/** Position eines Sitzes relativ zum Button (für 2–6 Spieler). */
export function positionOf(state: GameState, seatIndex: number): Position {
  const n = state.players.length;
  const offset = (seatIndex - state.buttonIndex + n) % n;
  if (n === 2) return offset === 0 ? 'SB' : 'BB';
  const orders: Record<number, Position[]> = {
    3: ['BTN', 'SB', 'BB'],
    4: ['BTN', 'SB', 'BB', 'CO'],
    5: ['BTN', 'SB', 'BB', 'HJ', 'CO'],
    6: ['BTN', 'SB', 'BB', 'UTG', 'HJ', 'CO'],
  };
  return orders[n][offset];
}

function clampRaiseTo(state: GameState, to: number): Action {
  const la = legalActions(state);
  const clamped = Math.max(la.minRaiseTo, Math.min(Math.round(to), la.maxRaiseTo));
  return { type: 'raise', to: clamped };
}

function preflopDecision(state: GameState, seatIndex: number, profile: BotProfile, rng: () => number): Action {
  const p = state.players[seatIndex];
  const la = legalActions(state);
  const label = handLabel(p.cards[0], p.cards[1]);
  const pos = positionOf(state, seatIndex);
  const bb = state.bigBlind;
  const raisedPot = state.currentBet > bb;
  const limpers = state.players.filter(
    (pl) => !pl.folded && !pl.isHero && pl.bet === bb && pl.id !== p.id,
  ).length;

  if (!raisedPot) {
    // Ungeraist (evtl. Limper)
    if (pos === 'BB' && la.canCheck) {
      if ((PREMIUM.has(label) || STRONG.has(label)) && la.canBetOrRaise && rng() < 0.85) {
        return clampRaiseTo(state, 4 * bb + limpers * bb);
      }
      return { type: 'check' };
    }
    const rfi = RFI_SETS.get(pos === 'BB' ? 'BTN' : pos) ?? RFI_SETS.get('CO')!;
    if (rfi.has(label) && la.canBetOrRaise) {
      const size = 2.5 * bb + limpers * bb;
      return clampRaiseTo(state, size);
    }
    // Lockere Bots limpen/completen gelegentlich spekulative Hände
    if (
      profile.style === 'loose' &&
      SPECULATIVE.has(label) &&
      la.callAmount > 0 &&
      la.callAmount <= bb &&
      rng() < 0.5
    ) {
      return { type: 'call' };
    }
    if (la.canCheck) return { type: 'check' };
    return { type: 'fold' };
  }

  // Gegen ein Raise
  const facing = la.callAmount;
  const bigRaise = state.currentBet > 12 * bb; // 3-Bet/4-Bet-Territorium
  if (PREMIUM.has(label)) {
    if (bigRaise && rng() < 0.4) return { type: 'call' };
    return la.canBetOrRaise ? clampRaiseTo(state, state.currentBet * 3) : { type: 'call' };
  }
  if (bigRaise) {
    // Gegen 3-Bets eng weiterspielen
    if (STRONG.has(label) && facing <= p.stack * 0.15 && rng() < 0.7) return { type: 'call' };
    return { type: 'fold' };
  }
  if (STRONG.has(label)) {
    if (la.canBetOrRaise && rng() < (profile.style === 'aggro' ? 0.3 : 0.12)) {
      return clampRaiseTo(state, state.currentBet * 3);
    }
    return { type: 'call' };
  }
  if (pos === 'BB' && BB_DEFEND.has(label) && facing <= 3 * bb) {
    return { type: 'call' };
  }
  if (SPECULATIVE.has(label) && facing <= Math.min(6 * bb, p.stack * 0.06) && rng() < 0.7 - profile.looseness) {
    return { type: 'call' };
  }
  if (profile.style === 'loose' && facing <= 3 * bb && rng() < 0.35) {
    return { type: 'call' };
  }
  return { type: 'fold' };
}

function postflopDecision(state: GameState, seatIndex: number, profile: BotProfile, rng: () => number): Action {
  const p = state.players[seatIndex];
  const la = legalActions(state);
  const opponents = state.players.filter((pl) => !pl.folded && pl.id !== p.id).length;
  let equity = equityVsRandomHands(p.cards, state.board, opponents, 300, rng);
  // Leichtes Rauschen, damit Bots nicht perfekt lesbar sind
  equity += (rng() - 0.5) * 0.06;

  const pot = totalPot(state);
  const facing = la.callAmount;

  if (facing === 0) {
    // Niemand hat gesetzt
    const valueThreshold = 0.62 + profile.looseness;
    if (equity > valueThreshold && la.canBetOrRaise) {
      const size = pot * (equity > 0.8 ? 0.75 : 0.55);
      return betOrRaiseTo(state, p.bet + size);
    }
    if (equity > 0.4 && equity <= valueThreshold && la.canBetOrRaise && rng() < profile.bluffFreq) {
      return betOrRaiseTo(state, p.bet + pot * 0.5); // Semi-Bluff
    }
    if (equity <= 0.4 && la.canBetOrRaise && rng() < profile.bluffFreq * 0.4 && opponents === 1) {
      return betOrRaiseTo(state, p.bet + pot * 0.6); // reiner Bluff, nur heads-up
    }
    return { type: 'check' };
  }

  // Gegen eine Bet: Pot Odds
  const required = facing / (pot + facing);
  if (equity > 0.78 && la.canBetOrRaise && rng() < 0.65) {
    return betOrRaiseTo(state, state.currentBet * 2.6);
  }
  if (equity > required + 0.03 + profile.looseness * 0.5) {
    return { type: 'call' };
  }
  // Seltener Bluff-Raise
  if (la.canBetOrRaise && rng() < profile.bluffFreq * 0.15 && opponents === 1) {
    return betOrRaiseTo(state, state.currentBet * 2.8);
  }
  return { type: 'fold' };
}

function betOrRaiseTo(state: GameState, to: number): Action {
  return clampRaiseTo(state, to);
}

/** Entscheidung des Bots am Zug. */
export function decideBotAction(
  state: GameState,
  seatIndex: number,
  profile: BotProfile,
  rng: () => number = Math.random,
): Action {
  const la = legalActions(state);
  const action =
    state.street === 'preflop'
      ? preflopDecision(state, seatIndex, profile, rng)
      : postflopDecision(state, seatIndex, profile, rng);

  // Sicherheitsnetz: nur legale Aktionen zurückgeben
  if (action.type === 'check' && !la.canCheck) return { type: 'fold' };
  if (action.type === 'raise' && !la.canBetOrRaise) {
    return la.canCheck ? { type: 'check' } : { type: 'call' };
  }
  return action;
}
