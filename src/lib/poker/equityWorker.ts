// Web-Worker-Einstiegspunkt: rechnet Monte-Carlo-Equities abseits des UI-Threads.
// Wird ausschließlich über equityAsync.ts angesprochen.

import { rechneAuftraege } from './equityProtocol';
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
  ctx.postMessage({ id, equities: rechneAuftraege(jobs) });
};
