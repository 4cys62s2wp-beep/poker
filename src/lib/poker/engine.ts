// No-Limit-Texas-Hold'em-Engine für 2–6 Spieler.
// Beträge in Chips (Big Blind = BIG_BLIND Chips).
// Unterstützt: Blinds, Setzrunden, Min-Raise-Regeln (inkl. unvollständiger
// All-in-Raises, die die Action nicht neu öffnen), Side Pots, Split Pots,
// Rückzahlung ungecallter Einsätze.

import type { Card } from './cards';
import { cardToPretty, shuffledDeckWithout } from './cards';
import { evaluateBest, categoryName } from './evaluator';

export type Street = 'preflop' | 'flop' | 'turn' | 'river' | 'showdown';

export interface EnginePlayer {
  id: number;
  name: string;
  isHero: boolean;
  stack: number;
  /** Einsatz in der aktuellen Setzrunde. */
  bet: number;
  /** Gesamteinsatz in dieser Hand (für Side Pots). */
  committed: number;
  folded: boolean;
  allIn: boolean;
  cards: Card[];
  /** Hat in der aktuellen Setzrunde seit der letzten (vollen) Erhöhung gehandelt. */
  hasActed: boolean;
  /** Karten am Showdown offengelegt? */
  revealed: boolean;
}

export interface LogEntry {
  street: Street;
  text: string;
  playerId?: number;
}

export interface PotAward {
  playerId: number;
  amount: number;
  handName?: string;
}

export interface GameState {
  players: EnginePlayer[];
  buttonIndex: number;
  deck: Card[];
  board: Card[];
  street: Street;
  /** Index des Spielers, der am Zug ist (-1 = keiner / Hand vorbei). */
  toActIndex: number;
  /** Höchster Einsatz der aktuellen Setzrunde. */
  currentBet: number;
  /** Größe der letzten vollen Erhöhung (für Min-Raise). */
  lastRaiseSize: number;
  smallBlind: number;
  bigBlind: number;
  handOver: boolean;
  awards: PotAward[];
  log: LogEntry[];
  handNumber: number;
}

export interface LegalActions {
  canFold: boolean;
  canCheck: boolean;
  /** Betrag, der zum Callen fehlt (0 wenn Check möglich). */
  callAmount: number;
  canBetOrRaise: boolean;
  /** Minimaler Gesamteinsatz (bet-to) bei Bet/Raise. */
  minRaiseTo: number;
  /** Maximaler Gesamteinsatz (All-in). */
  maxRaiseTo: number;
}

export type Action =
  | { type: 'fold' }
  | { type: 'check' }
  | { type: 'call' }
  | { type: 'raise'; to: number }; // "to" = Gesamteinsatz in dieser Runde (bet-to)

function log(state: GameState, text: string, playerId?: number) {
  state.log.push({ street: state.street, text, playerId });
}

function activePlayers(state: GameState): EnginePlayer[] {
  return state.players.filter((p) => !p.folded);
}

function canStillAct(p: EnginePlayer): boolean {
  return !p.folded && !p.allIn;
}

function nextIndexFrom(state: GameState, from: number, pred: (p: EnginePlayer) => boolean): number {
  const n = state.players.length;
  for (let i = 1; i <= n; i++) {
    const idx = (from + i) % n;
    if (pred(state.players[idx])) return idx;
  }
  return -1;
}

/** Startet eine neue Hand. Spieler mit stack <= 0 sitzen aus (müssen vorher entfernt werden). */
export function createHand(
  playersIn: Array<{ id: number; name: string; stack: number; isHero: boolean }>,
  buttonIndex: number,
  smallBlind: number,
  bigBlind: number,
  handNumber: number,
  rng: () => number = Math.random,
): GameState {
  if (playersIn.length < 2) throw new Error('Mindestens 2 Spieler nötig');
  const players: EnginePlayer[] = playersIn.map((p) => ({
    ...p,
    bet: 0,
    committed: 0,
    folded: false,
    allIn: false,
    cards: [],
    hasActed: false,
    revealed: false,
  }));

  const state: GameState = {
    players,
    buttonIndex,
    deck: shuffledDeckWithout([], rng),
    board: [],
    street: 'preflop',
    toActIndex: -1,
    currentBet: 0,
    lastRaiseSize: bigBlind,
    smallBlind,
    bigBlind,
    handOver: false,
    awards: [],
    log: [],
    handNumber,
  };

  const n = players.length;
  const headsUp = n === 2;
  // Heads-up: Button = Small Blind
  const sbIndex = headsUp ? buttonIndex : (buttonIndex + 1) % n;
  const bbIndex = (sbIndex + 1) % n;

  postBlind(state, sbIndex, smallBlind, 'Small Blind');
  postBlind(state, bbIndex, bigBlind, 'Big Blind');
  state.currentBet = bigBlind;
  state.lastRaiseSize = bigBlind;

  // Karten austeilen
  for (const p of state.players) {
    p.cards = [state.deck.pop()!, state.deck.pop()!];
  }
  log(state, `Hand #${handNumber} – Blinds ${smallBlind}/${bigBlind}`);

  // Erster Spieler: nach dem BB (preflop)
  state.toActIndex = nextIndexFrom(state, bbIndex, canStillAct);
  // Sonderfall: alle bereits all-in durch Blinds
  if (state.toActIndex === -1 || state.players.filter(canStillAct).length <= 1) {
    // Falls niemand mehr handeln kann → direkt ausspielen; falls genau einer
    // handeln kann, dieser aber nur callen/folden könnte, läuft die Runde normal.
    if (state.players.filter(canStillAct).length === 0) {
      runOutBoard(state);
      return state;
    }
  }
  return state;
}

function postBlind(state: GameState, idx: number, amount: number, label: string) {
  const p = state.players[idx];
  const paid = Math.min(amount, p.stack);
  p.stack -= paid;
  p.bet += paid;
  p.committed += paid;
  if (p.stack === 0) p.allIn = true;
  log(state, `${p.name} setzt ${label} (${paid})`, p.id);
}

/** Legale Aktionen für den Spieler am Zug. */
export function legalActions(state: GameState): LegalActions {
  const p = state.players[state.toActIndex];
  const toCall = Math.min(state.currentBet - p.bet, p.stack);
  const canCheck = toCall === 0;
  const minRaiseTo = Math.min(state.currentBet + state.lastRaiseSize, p.bet + p.stack);
  const maxRaiseTo = p.bet + p.stack;
  // Raise nur möglich, wenn der Spieler mehr als den Call einsetzen kann
  const canBetOrRaise = maxRaiseTo > state.currentBet;
  return {
    canFold: !canCheck,
    canCheck,
    callAmount: canCheck ? 0 : toCall,
    canBetOrRaise,
    minRaiseTo,
    maxRaiseTo,
  };
}

/** Wendet eine Aktion des Spielers am Zug an (mutiert den State). */
export function applyAction(state: GameState, action: Action): void {
  if (state.handOver || state.toActIndex < 0) throw new Error('Keine Aktion möglich');
  const p = state.players[state.toActIndex];
  const la = legalActions(state);

  switch (action.type) {
    case 'fold': {
      p.folded = true;
      p.hasActed = true;
      log(state, `${p.name} foldet`, p.id);
      break;
    }
    case 'check': {
      if (!la.canCheck) throw new Error('Check nicht möglich');
      p.hasActed = true;
      log(state, `${p.name} checkt`, p.id);
      break;
    }
    case 'call': {
      const amount = la.callAmount;
      if (amount <= 0) {
        // Call ohne offenen Einsatz = Check
        p.hasActed = true;
        log(state, `${p.name} checkt`, p.id);
        break;
      }
      p.stack -= amount;
      p.bet += amount;
      p.committed += amount;
      p.hasActed = true;
      if (p.stack === 0) {
        p.allIn = true;
        log(state, `${p.name} callt ${amount} und ist all-in`, p.id);
      } else {
        log(state, `${p.name} callt ${amount}`, p.id);
      }
      break;
    }
    case 'raise': {
      if (!la.canBetOrRaise) throw new Error('Raise nicht möglich');
      let to = Math.floor(action.to);
      if (to > la.maxRaiseTo) to = la.maxRaiseTo;
      const isAllIn = to === la.maxRaiseTo;
      if (to < la.minRaiseTo && !isAllIn) throw new Error('Raise unter Minimum');
      if (to <= state.currentBet) throw new Error('Raise muss den Einsatz erhöhen');

      const raiseSize = to - state.currentBet;
      const add = to - p.bet;
      p.stack -= add;
      p.bet = to;
      p.committed += add;
      p.hasActed = true;
      if (p.stack === 0) p.allIn = true;

      const isBet = state.currentBet === 0;
      const fullRaise = raiseSize >= state.lastRaiseSize;
      if (fullRaise) {
        // Volle Erhöhung: Action wird für alle anderen neu geöffnet
        state.lastRaiseSize = raiseSize;
        for (const other of state.players) {
          if (other.id !== p.id && canStillAct(other)) other.hasActed = false;
        }
      }
      state.currentBet = to;
      const verb = isBet ? 'setzt' : 'erhöht auf';
      log(state, `${p.name} ${verb} ${to}${p.allIn ? ' (all-in)' : ''}`, p.id);
      break;
    }
  }

  advance(state);
}

/** Prüft Rundenende / Handende und bewegt den Zeiger weiter. */
function advance(state: GameState): void {
  const active = activePlayers(state);

  // Nur noch einer übrig → gewinnt sofort
  if (active.length === 1) {
    endHandByFold(state, active[0]);
    return;
  }

  const actors = active.filter((p) => !p.allIn);
  const roundDone =
    actors.length === 0 ||
    actors.every((p) => p.hasActed && p.bet === state.currentBet);

  if (!roundDone) {
    state.toActIndex = nextIndexFrom(state, state.toActIndex, (p) =>
      canStillAct(p) && !(p.hasActed && p.bet === state.currentBet),
    );
    if (state.toActIndex === -1) {
      // Sollte nicht passieren, aber sicherheitshalber Runde beenden
      finishStreet(state);
    }
    return;
  }

  finishStreet(state);
}

function finishStreet(state: GameState): void {
  // Einsätze der Runde abschließen
  for (const p of state.players) p.bet = 0;
  state.currentBet = 0;
  state.lastRaiseSize = state.bigBlind;
  for (const p of state.players) p.hasActed = false;

  const active = activePlayers(state);
  const actors = active.filter((p) => !p.allIn);

  if (state.street === 'river') {
    showdown(state);
    return;
  }

  // Wenn höchstens einer noch handeln kann → Board ausspielen und Showdown
  if (actors.length <= 1) {
    runOutBoard(state);
    return;
  }

  dealNextStreet(state);
  // Postflop beginnt links vom Button
  state.toActIndex = nextIndexFrom(state, state.buttonIndex, canStillAct);
}

function dealNextStreet(state: GameState): void {
  if (state.street === 'preflop') {
    state.street = 'flop';
    state.board.push(state.deck.pop()!, state.deck.pop()!, state.deck.pop()!);
    log(state, `Flop: ${state.board.map(cardToPretty).join(' ')}`);
  } else if (state.street === 'flop') {
    state.street = 'turn';
    state.board.push(state.deck.pop()!);
    log(state, `Turn: ${state.board.map(cardToPretty).join(' ')}`);
  } else if (state.street === 'turn') {
    state.street = 'river';
    state.board.push(state.deck.pop()!);
    log(state, `River: ${state.board.map(cardToPretty).join(' ')}`);
  }
}

function runOutBoard(state: GameState): void {
  while (state.street !== 'river') {
    dealNextStreet(state);
  }
  showdown(state);
}

/** Ungecallten Überschuss des höchsten Committers zurückzahlen. */
function refundUncalled(state: GameState): void {
  const active = state.players.filter((p) => !p.folded);
  const sorted = [...state.players].sort((a, b) => b.committed - a.committed);
  const top = sorted[0];
  // Höchster Einsatz, den irgendein anderer Spieler mitgegangen ist
  const secondMax = Math.max(
    0,
    ...state.players.filter((p) => p.id !== top.id).map((p) => p.committed),
  );
  if (top.committed > secondMax && !top.folded && active.length >= 1) {
    const refund = top.committed - secondMax;
    top.stack += refund;
    top.committed -= refund;
    if (refund > 0) log(state, `${top.name} erhält ${refund} ungecallten Einsatz zurück`, top.id);
  }
}

function endHandByFold(state: GameState, winner: EnginePlayer): void {
  refundUncalled(state);
  const pot = state.players.reduce((sum, p) => sum + p.committed, 0);
  winner.stack += pot;
  state.awards = [{ playerId: winner.id, amount: pot }];
  log(state, `${winner.name} gewinnt ${pot} (alle anderen gefoldet)`, winner.id);
  for (const p of state.players) {
    p.committed = 0;
    p.bet = 0;
  }
  state.handOver = true;
  state.toActIndex = -1;
}

function showdown(state: GameState): void {
  state.street = 'showdown';
  refundUncalled(state);

  const contenders = state.players.filter((p) => !p.folded);
  const values = new Map<number, number>();
  for (const p of contenders) {
    values.set(p.id, evaluateBest([...p.cards, ...state.board]));
    p.revealed = true;
    log(
      state,
      `${p.name} zeigt ${p.cards.map(cardToPretty).join(' ')} – ${categoryName(values.get(p.id)!)}`,
      p.id,
    );
  }

  // Side Pots über Einsatz-Level bilden
  const levels = [...new Set(state.players.map((p) => p.committed).filter((c) => c > 0))].sort(
    (a, b) => a - b,
  );
  const awards = new Map<number, number>();
  let prev = 0;
  for (const level of levels) {
    let potTier = 0;
    for (const p of state.players) {
      potTier += Math.max(0, Math.min(p.committed, level) - prev);
    }
    const eligible = contenders.filter((p) => p.committed >= level);
    if (eligible.length > 0 && potTier > 0) {
      let best = -1;
      let winners: EnginePlayer[] = [];
      for (const p of eligible) {
        const v = values.get(p.id)!;
        if (v > best) {
          best = v;
          winners = [p];
        } else if (v === best) {
          winners.push(p);
        }
      }
      const share = Math.floor(potTier / winners.length);
      let remainder = potTier - share * winners.length;
      for (const w of winners) {
        let amt = share;
        if (remainder > 0) {
          amt += 1;
          remainder -= 1;
        }
        awards.set(w.id, (awards.get(w.id) ?? 0) + amt);
      }
    }
    prev = level;
  }

  state.awards = [];
  for (const [playerId, amount] of awards) {
    const p = state.players.find((pl) => pl.id === playerId)!;
    p.stack += amount;
    const handName = categoryName(values.get(playerId)!);
    state.awards.push({ playerId, amount, handName });
    log(state, `${p.name} gewinnt ${amount} mit ${handName}`, playerId);
  }
  for (const p of state.players) {
    p.committed = 0;
    p.bet = 0;
  }
  state.handOver = true;
  state.toActIndex = -1;
}

/** Gesamter Pot (inkl. laufender Einsätze) – für die Anzeige. */
export function totalPot(state: GameState): number {
  return state.players.reduce((sum, p) => sum + p.committed, 0);
}
