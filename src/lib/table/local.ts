/* Tisch auf einem Gerät („Küchentisch-Modus").

   Die App übernimmt, was sonst Karten und Chips erledigen: Sie mischt, gibt,
   führt den Pot, zieht die Blinds hoch und wertet den Showdown aus. Das Gerät
   wandert reihum – immer zu dem Spieler, der gerade am Zug ist. Genau so läuft
   Poker ohnehin, deshalb fällt das Weiterreichen kaum auf.

   Braucht kein Internet, kein Konto und keine Einrichtung. Die Spiellogik ist
   dieselbe geprüfte Engine wie am Übungstisch – hier nur ohne Bots. */

import { applyAction, createHand, legalActions, totalPot, type Action, type GameState } from '../poker/engine';

export interface LocalSeat {
  id: number;
  name: string;
  stack: number;
}

export interface LocalTableConfig {
  seats: LocalSeat[];
  smallBlind: number;
  bigBlind: number;
  /** Nach wie vielen Händen die Blinds steigen (0 = nie, Cash-Game). */
  raiseBlindsEvery: number;
}

/** Sichtbarkeitszustand: Wer darf gerade auf das Display schauen? */
export type LocalPhase =
  /** „Gib das Gerät an X" – Karten verdeckt. */
  | 'pass'
  /** X schaut auf seine Karten und entscheidet. */
  | 'act'
  /** Hand vorbei, Ergebnis für alle sichtbar. */
  | 'showdown';

export interface LocalTableState {
  game: GameState;
  phase: LocalPhase;
  config: LocalTableConfig;
  /** Laufende Handnummer (1-basiert). */
  handNumber: number;
  /** Sitz, der zuletzt gehandelt hat – für die „weitergeben"-Anzeige. */
  lastActorId: number | null;
}

/** Blind-Stufe nach n Händen: verdoppelt sich in festen Abständen. */
export function blindsForHand(config: LocalTableConfig, handNumber: number): { sb: number; bb: number } {
  if (config.raiseBlindsEvery <= 0) return { sb: config.smallBlind, bb: config.bigBlind };
  const step = Math.floor((handNumber - 1) / config.raiseBlindsEvery);
  const factor = 2 ** Math.min(step, 12); // Deckel, damit nichts explodiert
  return { sb: config.smallBlind * factor, bb: config.bigBlind * factor };
}

/** Spieler mit Chips – nur die bekommen noch Karten. */
export function activeSeats(seats: LocalSeat[]): LocalSeat[] {
  return seats.filter((s) => s.stack > 0);
}

/**
 * Startet eine neue Hand. `buttonIndex` bezieht sich auf die Liste der
 * Spieler MIT Chips; wer pleite ist, sitzt aus.
 */
export function startHand(
  config: LocalTableConfig,
  handNumber: number,
  buttonIndex: number,
  rng: () => number = Math.random,
): LocalTableState | null {
  const seats = activeSeats(config.seats);
  if (seats.length < 2) return null;

  const { sb, bb } = blindsForHand(config, handNumber);
  const game = createHand(
    seats.map((s) => ({ id: s.id, name: s.name, stack: s.stack, isHero: false })),
    buttonIndex % seats.length,
    sb,
    bb,
    handNumber,
    rng,
  );

  return {
    game,
    // Direkt in die Übergabe: Das Gerät soll zum ersten Spieler wandern.
    phase: game.handOver ? 'showdown' : 'pass',
    config,
    handNumber,
    lastActorId: null,
  };
}

/** Der Spieler nimmt das Gerät entgegen und sieht seine Karten. */
export function reveal(state: LocalTableState): LocalTableState {
  if (state.phase !== 'pass') return state;
  return { ...state, phase: 'act' };
}

/**
 * Aktion des aktuellen Spielers anwenden. Danach geht das Gerät weiter –
 * oder die Hand ist vorbei.
 */
export function act(state: LocalTableState, action: Action): LocalTableState {
  if (state.phase !== 'act' || state.game.handOver) return state;
  const actorId = state.game.players[state.game.toActIndex]?.id ?? null;

  const game: GameState = structuredClone(state.game);
  applyAction(game, action);

  return {
    ...state,
    game,
    lastActorId: actorId,
    phase: game.handOver ? 'showdown' : 'pass',
  };
}

/** Stände nach der Hand in die Sitzplätze zurückschreiben. */
export function settle(state: LocalTableState): LocalTableConfig {
  const byId = new Map(state.game.players.map((p) => [p.id, p.stack]));
  return {
    ...state.config,
    seats: state.config.seats.map((s) => ({ ...s, stack: byId.get(s.id) ?? s.stack })),
  };
}

/** Wer ist gerade am Zug? */
export function currentPlayer(state: LocalTableState) {
  return state.game.players[state.game.toActIndex] ?? null;
}

export { legalActions, totalPot };
