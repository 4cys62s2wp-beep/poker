/* Preflop gegen eine Erhöhung: Fold, Call oder 3-Bet, je Platzpaar (E-100).
   =========================================================================

   6-max Cash, 100 bb, Eröffnung auf 2,5 bb, genau eine Erhöhung vor dir.

   **Herkunft, ehrlich:** Diese Tabelle ist von Hand aus verbreiteten
   Faustregeln zusammengestellt und vereinfacht — sie ist keine Solver-Lösung
   und wird auch nicht von `tools/poker-math` erzeugt. Das Werkzeug rechnet
   Wahrscheinlichkeiten nach, die man zählen kann (Outs, Equity); ein Gleichgewicht
   für Ranges könnte es nur vortäuschen, und eine vorgetäuschte Herkunft ist
   schlimmer als eine zugegebene. Was die Tabelle trotzdem festhält und ein
   Test prüft (`vsopen.test.ts`): Wer später in der Reihe sitzt oder gegen einen
   späteren Platz verteidigt, spielt **nie enger** — jede Hand, die gegen
   einen früheren Platz weitergespielt wird, wird auch gegen einen späteren
   weitergespielt, und die 3-Bet-Range wächst mit.

   Die Eröffnungs-Ranges stehen in `ranges.ts` (`RFI_CHARTS`); gegen den Button
   verteidigt der Big Blind wie bisher (`BB_DEFENSE_VS_BTN`). Bei Überschneidungen
   hat die 3-Bet Vorrang. */

import { BB_DEFENSE_VS_BTN, type Position } from './ranges';

export type Eroeffner = Exclude<Position, 'BB'>;
export type Verteidiger = Exclude<Position, 'UTG'>;

export interface VsOpenChart {
  eroeffner: Eroeffner;
  /** Wer antwortet. */
  selbst: Verteidiger;
  /** 3-Bet-Range (Kurzschreibweise, `expandRangeSpec`). */
  threeBet: string[];
  /** Call-Range; Hände, die auch in `threeBet` stehen, zählen als 3-Bet. */
  call: string[];
}

/** Wo die Tabelle entstanden ist — steht im Range-Viewer unter der Matrix. */
export const VSOPEN_QUELLE = {
  de: 'Von Hand aus gängigen Faustregeln zusammengestellt und vereinfacht — keine Solver-Lösung. 6-max, 100 bb, Eröffnung auf 2,5 bb.',
  en: 'Compiled by hand from common rules of thumb and simplified — not a solver solution. 6-max, 100 bb, open to 2.5 bb.',
};

export const VSOPEN_CHARTS: VsOpenChart[] = [
  /* ── Gegen UTG ─────────────────────────────────────────────────── */
  {
    eroeffner: 'UTG', selbst: 'HJ',
    threeBet: ['QQ+', 'AKs', 'AKo'],
    call: ['77', '88', '99', 'TT', 'JJ', 'AQs', 'AJs', 'KQs', 'AQo'],
  },
  {
    eroeffner: 'UTG', selbst: 'CO',
    threeBet: ['QQ+', 'AKs', 'AKo', 'A5s'],
    call: ['66', '77', '88', '99', 'TT', 'JJ', 'AQs', 'AJs', 'ATs', 'KQs', 'QJs', 'JTs', 'AQo'],
  },
  {
    eroeffner: 'UTG', selbst: 'BTN',
    threeBet: ['QQ+', 'AKs', 'AKo', 'A5s', 'A4s'],
    call: ['55', '66', '77', '88', '99', 'TT', 'JJ', 'AQs', 'AJs', 'ATs', 'KQs', 'KJs', 'QJs', 'JTs', 'T9s', '98s', 'AQo'],
  },
  {
    eroeffner: 'UTG', selbst: 'SB',
    threeBet: ['QQ+', 'AKs', 'AKo', 'AQs', 'A5s', 'A4s'],
    call: ['99', 'TT', 'JJ', 'AJs', 'KQs', 'AQo'],
  },
  {
    eroeffner: 'UTG', selbst: 'BB',
    threeBet: ['QQ+', 'AKs', 'AKo', 'A5s', 'A4s'],
    call: [
      '22+', 'A9s', 'ATs', 'AJs', 'AQs', 'KTs', 'KJs', 'KQs', 'QTs', 'QJs', 'JTs', 'T9s', '98s', '87s', '76s', '65s', '54s',
      'AQo', 'AJo', 'KQo',
    ],
  },

  /* ── Gegen HJ ──────────────────────────────────────────────────── */
  {
    eroeffner: 'HJ', selbst: 'CO',
    threeBet: ['QQ+', 'AKs', 'AKo', 'A5s', 'A4s'],
    call: ['55', '66', '77', '88', '99', 'TT', 'JJ', 'AQs', 'AJs', 'ATs', 'KQs', 'KJs', 'QJs', 'JTs', 'T9s', 'AQo', 'KQo'],
  },
  {
    eroeffner: 'HJ', selbst: 'BTN',
    threeBet: ['JJ+', 'AKs', 'AKo', 'AQs', 'A5s', 'A4s'],
    call: [
      '44', '55', '66', '77', '88', '99', 'TT', 'AJs', 'ATs', 'A9s', 'KQs', 'KJs', 'KTs', 'QJs', 'QTs', 'JTs', 'T9s', '98s', '87s',
      'AQo', 'KQo',
    ],
  },
  {
    eroeffner: 'HJ', selbst: 'SB',
    threeBet: ['JJ+', 'AKs', 'AKo', 'AQs', 'AQo', 'A5s', 'A4s', 'A3s'],
    call: ['77', '88', '99', 'TT', 'AJs', 'ATs', 'KQs', 'KJs', 'QJs', 'JTs'],
  },
  {
    eroeffner: 'HJ', selbst: 'BB',
    threeBet: ['QQ+', 'AKs', 'AKo', 'A5s', 'A4s', '76s'],
    call: [
      '22+', 'A8s', 'A9s', 'ATs', 'AJs', 'AQs', 'K9s', 'KTs', 'KJs', 'KQs', 'Q9s', 'QTs', 'QJs', 'J9s', 'JTs', 'T9s', 'T8s',
      '98s', '87s', '65s', '54s',
      'AQo', 'AJo', 'ATo', 'KQo', 'KJo',
    ],
  },

  /* ── Gegen CO ──────────────────────────────────────────────────── */
  {
    eroeffner: 'CO', selbst: 'BTN',
    threeBet: ['TT+', 'AQs+', 'AQo+', 'A5s', 'A4s', 'A3s'],
    call: [
      '22', '33', '44', '55', '66', '77', '88', '99', 'AJs', 'ATs', 'A9s', 'A8s', 'KQs', 'KJs', 'KTs', 'K9s', 'QJs', 'QTs',
      'JTs', 'J9s', 'T9s', '98s', '87s', '76s',
      'AJo', 'ATo', 'KQo', 'KJo',
    ],
  },
  {
    eroeffner: 'CO', selbst: 'SB',
    threeBet: ['TT+', 'AKs', 'AKo', 'AQs', 'AQo', 'AJs', 'A5s', 'A4s', 'A3s'],
    call: ['66', '77', '88', '99', 'ATs', 'A9s', 'KQs', 'KJs', 'KTs', 'QJs', 'JTs', 'T9s', 'AJo', 'KQo'],
  },
  {
    eroeffner: 'CO', selbst: 'BB',
    threeBet: ['JJ+', 'AKs', 'AKo', 'AQs', 'A5s', 'A4s', 'A3s', 'K9s'],
    call: [
      '22+', 'A2s+', 'K8s+', 'Q8s+', 'J8s+', 'T8s+', '97s+', '86s+', '76s', '65s', '54s',
      'A9o+', 'KTo+', 'QTo+', 'JTo', 'T9o',
    ],
  },

  /* ── Gegen BTN ─────────────────────────────────────────────────── */
  {
    eroeffner: 'BTN', selbst: 'SB',
    threeBet: ['99+', 'AJs+', 'AQo+', 'A5s', 'A4s', 'A3s', 'A2s', 'KQs'],
    call: [
      '22', '33', '44', '55', '66', '77', '88', 'ATs', 'A9s', 'A8s', 'KJs', 'KTs', 'K9s', 'QJs', 'QTs', 'JTs', 'J9s', 'T9s',
      '98s', '87s', '76s', '65s',
      'AJo', 'ATo', 'KQo', 'KJo', 'QJo',
    ],
  },
  {
    eroeffner: 'BTN', selbst: 'BB',
    threeBet: BB_DEFENSE_VS_BTN.threeBet,
    call: BB_DEFENSE_VS_BTN.call,
  },

  /* ── Gegen SB ──────────────────────────────────────────────────── */
  {
    /* Der Small Blind eröffnet weit und sitzt danach ohne Position: Der Big
       Blind verteidigt noch breiter als gegen den Button. */
    eroeffner: 'SB', selbst: 'BB',
    threeBet: [...BB_DEFENSE_VS_BTN.threeBet, '99', 'AJs', 'AJo', 'KQs'],
    call: [
      ...BB_DEFENSE_VS_BTN.call,
      'Q2s+', 'J5s+', 'T6s+', '95s+', '85s+', '74s+', 'K8o', 'Q8o', 'J7o', 'T7o', '97o', '86o', '76o',
    ],
  },
];
