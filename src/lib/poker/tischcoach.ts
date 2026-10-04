/* Der Coach am Übungstisch.
   ========================

   Bis E-093 rechnete der Tisch seinen Rat selbst: Equity gegen drei zufällige
   Hände geteilt durch den Preis des Calls. Das riet mit 77 im Cutoff bei
   ungeöffnetem Pot zum Fold — obwohl die Eröffnungs-Range des Cutoffs „22+"
   enthält. Zufallshände sind kein Gegner, der nach der Range eröffnet hat.

   `coachForTable` baut den Rat aus derselben Logik wie der Live-Coach
   (`preflopAdvice`, `postflopAdvice`, `facingBetVerdict`) und bildet ihn auf
   die Knöpfe des Tisches ab. `bewerteAktion` vergleicht danach, was gespielt
   wurde, mit dem Rat — in drei Stufen, nur dort „Fehler", wo der Rat eindeutig
   war. Beides ist eine Schätzung nach Faustregeln, keine Lösung (E-093). */

import type { Card } from './cards';
import type { GameState } from './engine';
import { legalActions, totalPot } from './engine';
import { positionOf } from './ai';
import { handLabel } from './ranges';
import {
  facingBetVerdict,
  postflopAdvice,
  preflopAdvice,
  type CoachAdvice,
  type CoachLang,
  type CoachPosition,
} from './coach';
import { detectDraws, madeHandInfo } from './analysis';
import type { Position } from '../../content/ranges';

/** Was der Tisch als Knöpfe kennt. */
export type TischAktion = 'fold' | 'check' | 'call' | 'raise';

export interface TischRat {
  /** Die Empfehlung, auf die Knöpfe des Tisches abgebildet. */
  empfehlung: TischAktion;
  /** Die Begründung aus dem Live-Coach (Überschrift, Gründe, Hinweis). */
  advice: CoachAdvice;
  /** Eindeutig genug, dass eine andere Wahl ein „Fehler" heißen darf? */
  klar: boolean;
  /** Pot Odds, wenn ein Einsatz offen ist (Anteile 0–1). */
  odds?: { benoetigt: number; equity: number; ok: boolean };
  /** Die aktuelle Hand in Worten („Ein Paar"), ab dem Flop. */
  handName?: string;
  /** Der genaue Platz — Eingabe für Anzeige und Begründung. */
  position: Position;
}

/** Wie der Coach die sechs Plätze einteilt. */
export function coachPosition(pos: Position): CoachPosition {
  switch (pos) {
    case 'UTG': return 'frueh';
    case 'HJ': return 'mitte';
    case 'CO':
    case 'BTN': return 'spaet';
    default: return 'blinds';
  }
}

/** Wie viele Spieler vor dir nur mitgegangen sind (Limper), ohne die Blinds. */
export function limperVorDir(g: GameState, seat: number): number {
  return g.log.filter(
    (e) => e.street === 'preflop' && e.aktion?.art === 'call' && e.playerId !== undefined && e.playerId !== g.players[seat].id,
  ).length;
}

/**
 * Der Rat für den Spieler am Zug (immer Sitz 0, der Mensch).
 * `equity` ist die geschätzte Equity gegen die verbliebenen Gegner (0–1) und
 * wird erst ab dem Flop gebraucht; fehlt sie dort, gibt es keinen Rat.
 */
export function coachForTable(g: GameState, equity: number | null, lang: CoachLang = 'de'): TischRat | null {
  const hero = g.players[0];
  if (!hero || hero.folded || g.handOver || g.toActIndex !== 0 || hero.cards.length < 2) return null;
  const la = legalActions(g);
  const pos = positionOf(g, 0);
  const gegner = g.players.filter((p) => !p.folded && !p.isHero).length;
  const pot = totalPot(g);

  /* ── Vor dem Flop: Range statt Zufallshände ─────────────────────── */
  if (g.street === 'preflop') {
    const geoeffnet = g.currentBet > g.bigBlind;
    const label = handLabel(hero.cards[0], hero.cards[1]);
    const exakt = pos === 'BB' ? undefined : pos;
    const advice = preflopAdvice(
      label, coachPosition(pos), g.players.length, geoeffnet, geoeffnet ? 0 : limperVorDir(g, 0), lang, exakt,
    );
    let empfehlung: TischAktion;
    switch (advice.action) {
      case 'raise':
      case 'bet':
        empfehlung = la.canBetOrRaise ? 'raise' : la.canCheck ? 'check' : 'call';
        break;
      case 'call':
        empfehlung = la.canCheck ? 'check' : 'call';
        break;
      default: // fold, checkfold, check
        empfehlung = la.canCheck ? 'check' : 'fold';
    }
    /* Eindeutig ist, wer vor einer Eröffnung steht: In der Range oder nicht.
       Gegen eine Erhöhung entscheiden Gegner und Preis — da bleibt es ein Rat. */
    return { empfehlung, advice, klar: !geoeffnet, position: pos };
  }

  /* ── Ab dem Flop: gemachte Hand, Draws, Equity, Preis ───────────── */
  if (equity === null || g.board.length < 3) return null;
  const board: Card[] = g.board;
  const made = madeHandInfo(hero.cards, board, lang);
  const street = g.street === 'turn' ? 'turn' : g.street === 'river' ? 'river' : 'flop';
  const draws = street === 'river' ? null : detectDraws(hero.cards, board, lang);
  const advice = postflopAdvice({ street, made, draws, equity, opponents: Math.max(1, gegner) }, lang);

  if (la.callAmount > 0) {
    /* Ein Einsatz ist offen: Der Preis entscheidet mit. `pot` enthält den
       Einsatz schon, also gehört der Call einmal dazu (nicht doppelt). */
    const v = facingBetVerdict(equity, pot - la.callAmount, la.callAmount, lang);
    const odds = { benoetigt: v.requiredPct / 100, equity: v.equityPct / 100, ok: v.ok };
    let empfehlung: TischAktion;
    if ((advice.action === 'bet' || advice.action === 'raise') && la.canBetOrRaise) empfehlung = 'raise';
    else empfehlung = v.ok ? 'call' : 'fold';
    const stark = advice.action === 'bet' || advice.action === 'raise';
    return { empfehlung, advice, klar: stark, odds, handName: made.name, position: pos };
  }

  /* Niemand hat gesetzt: setzen oder checken. */
  let empfehlung: TischAktion;
  if ((advice.action === 'bet' || advice.action === 'raise') && la.canBetOrRaise) empfehlung = 'raise';
  else empfehlung = 'check';
  return { empfehlung, advice, klar: false, handName: made.name, position: pos };
}

export type Urteil = 'gut' | 'vertretbar' | 'fehler';

const STUFE: Record<TischAktion, number> = { fold: 0, check: 1, call: 1, raise: 2 };

/**
 * Was gespielt wurde, gegen den Rat gehalten. Gleich ist gut, eine Stufe daneben
 * (Fold ↔ Call/Check ↔ Raise) ist vertretbar, zwei Stufen daneben ein Fehler —
 * aber nur, wo der Rat eindeutig war; sonst bleibt es vertretbar.
 */
export function bewerteAktion(rat: TischRat, tat: TischAktion): Urteil {
  if (tat === rat.empfehlung) return 'gut';
  /* Check und Call sind dieselbe Stufe; wer checken konnte und gecallt hätte,
     gibt es nicht — der Fall ist gleich. */
  const abstand = Math.abs(STUFE[tat] - STUFE[rat.empfehlung]);
  if (abstand === 0) return 'gut';
  if (abstand >= 2 && rat.klar) return 'fehler';
  return 'vertretbar';
}
