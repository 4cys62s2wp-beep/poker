/* Die Antwort auf eine Eröffnung: Fold, Call oder 3-Bet (E-100).
   Liest `content/vsopen.ts`; hier steht nur, was daraus gerechnet wird. */

import { VSOPEN_CHARTS, type Eroeffner, type VsOpenChart, type Verteidiger } from '../../content/vsopen';
import type { Position } from '../../content/ranges';
import { combosForLabel, expandRangeSpec } from './ranges';

export type GegenOpen = 'threeBet' | 'call' | 'fold';

export interface VsOpenRange {
  eroeffner: Eroeffner;
  selbst: Verteidiger;
  threeBet: ReadonlySet<string>;
  /** Ohne die Hände, die als 3-Bet gespielt werden. */
  call: ReadonlySet<string>;
  /** 3-Bet und Call zusammen. */
  weiter: ReadonlySet<string>;
}

const schluessel = (e: Position, s: Position) => `${e}>${s}`;

const RANGEN = new Map<string, VsOpenRange>(
  VSOPEN_CHARTS.map((c: VsOpenChart) => {
    const threeBet = expandRangeSpec(c.threeBet);
    const call = new Set([...expandRangeSpec(c.call)].filter((l) => !threeBet.has(l)));
    return [
      schluessel(c.eroeffner, c.selbst),
      { eroeffner: c.eroeffner, selbst: c.selbst, threeBet, call, weiter: new Set([...threeBet, ...call]) },
    ];
  }),
);

/** Die Range für dieses Platzpaar — oder `undefined`, wenn der Eröffner nicht vor dir sitzt. */
export function vsOpenRange(eroeffner: Position, selbst: Position): VsOpenRange | undefined {
  return RANGEN.get(schluessel(eroeffner, selbst));
}

/** Alle Platzpaare, für die es eine Range gibt, in der Reihenfolge der Tabelle. */
export const VSOPEN_PAARE: ReadonlyArray<{ eroeffner: Eroeffner; selbst: Verteidiger }> =
  VSOPEN_CHARTS.map((c) => ({ eroeffner: c.eroeffner, selbst: c.selbst }));

/** Gegen wen du auf diesem Platz antworten kannst: alle Eröffner vor dir, mit Range. */
export function eroeffnerFuer(selbst: Position): Eroeffner[] {
  return VSOPEN_PAARE.filter((p) => p.selbst === selbst).map((p) => p.eroeffner);
}

/** Auf welchen Plätzen sitzt jemand, der auf eine Eröffnung antwortet? */
export function verteidigerPlaetze(): Verteidiger[] {
  return [...new Set(VSOPEN_PAARE.map((p) => p.selbst))];
}

/** Was die Tabelle für diese Hand sagt. Ohne Range für das Paar: `null`. */
export function gegenOpen(label: string, eroeffner: Position, selbst: Position): GegenOpen | null {
  const r = vsOpenRange(eroeffner, selbst);
  if (!r) return null;
  if (r.threeBet.has(label)) return 'threeBet';
  if (r.call.has(label)) return 'call';
  return 'fold';
}

function kombos(labels: Iterable<string>): number {
  let n = 0;
  for (const l of labels) n += combosForLabel(l).length;
  return n;
}

/** Anteil der 1326 Starthände, die diese Menge ausmacht (0–1). */
export function anteil(labels: Iterable<string>): number {
  return kombos(labels) / 1326;
}
