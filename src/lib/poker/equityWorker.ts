// Web-Worker-Einstiegspunkt: rechnet Monte-Carlo-Equities abseits des UI-Threads.
// Wird ausschließlich über equityAsync.ts angesprochen.

import { equityVsRandomHands } from './equity';
import type { EquityRequest, EquityResponse } from './equityProtocol';

/* Die tsconfig lädt die DOM-Typen (kein "webworker"-lib), deshalb hier ein
   minimaler lokaler Typ für den Worker-Scope statt eines /// <reference>,
   das sich mit den DOM-Deklarationen beißen würde. */
interface WorkerScope {
  onmessage: ((ev: MessageEvent<EquityRequest>) => void) | null;
  postMessage(message: EquityResponse): void;
}

const ctx = self as unknown as WorkerScope;

ctx.onmessage = (ev) => {
  const { id, jobs } = ev.data;
  const equities = jobs.map((j) =>
    equityVsRandomHands(j.hero, j.board, Math.max(1, j.opponents), j.iterations),
  );
  ctx.postMessage({ id, equities });
};
