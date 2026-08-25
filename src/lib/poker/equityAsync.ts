// Equity-Berechnung ohne UI-Blockade.
//
// Standardweg: ein Web Worker rechnet die Monte-Carlo-Simulation in einem
// eigenen Thread – der Hauptthread bleibt flüssig, auch auf schwachen Handys.
// Fällt der Worker aus (Einzeldatei-Build, alte WebView, CSP), wird synchron
// gerechnet, aber per setTimeout hinter den nächsten Frame geschoben, damit
// die UI vorher ihren Ladezustand zeichnen kann (gleiches Muster wie im
// Equity-Rechner).

import { equityVsRandomHands } from './equity';
import type { EquityJob, EquityRequest, EquityResponse } from './equityProtocol';

export type { EquityJob } from './equityProtocol';

/* Iterationszahlen der Anzeige-Features. Gemessen gegen eine 300.000er-Referenz
   liegt der Fehler bei 2.000 Iterationen im Mittel bei ~0,7 Prozentpunkten,
   bei 5.000 bei ~0,5 – beides deutlich unter dem, was die auf ganze Prozent
   gerundete Anzeige auflöst. Mehr Iterationen lohnen hier also nicht. */
export const MC_ITERATIONS = {
  /** Live-Coach: eine Zahl pro Kartenwahl/Gegnerzahl. */
  coach: 2000,
  /** Starthand-Explorer: drei Läufe (1/3/5 Gegner) pro Hand, Ergebnis wird gecacht. */
  explorer: 3000,
} as const;

/** Wie lange auf eine Worker-Antwort gewartet wird, bevor synchron gerechnet wird. */
const WORKER_TIMEOUT_MS = 10000;

interface Pending {
  jobs: EquityJob[];
  resolve: (equities: number[]) => void;
  timer: ReturnType<typeof setTimeout>;
}

let worker: Worker | null = null;
/* Der Einzeldatei-Build wird als eine einzelne index.html weitergereicht –
   eine Worker-Datei daneben gibt es dort nicht. Also gleich synchron rechnen,
   statt auf einen Ladefehler zu warten. */
let workerUnavailable = __SINGLE__;
let nextId = 1;
const pending = new Map<number, Pending>();

function computeSync(jobs: EquityJob[]): number[] {
  return jobs.map((j) => equityVsRandomHands(j.hero, j.board, Math.max(1, j.opponents), j.iterations));
}

/** Alle offenen Anfragen synchron nachrechnen (Worker ist gestorben). */
function drainToSync() {
  const stuck = [...pending.values()];
  pending.clear();
  for (const p of stuck) {
    clearTimeout(p.timer);
    p.resolve(computeSync(p.jobs));
  }
}

function killWorker() {
  workerUnavailable = true;
  if (worker) {
    worker.terminate();
    worker = null;
  }
  drainToSync();
}

function getWorker(): Worker | null {
  if (workerUnavailable) return null;
  if (worker) return worker;
  if (typeof Worker === 'undefined') {
    workerUnavailable = true;
    return null;
  }
  try {
    const w = new Worker(new URL('./equityWorker.ts', import.meta.url), { type: 'module' });
    w.onmessage = (ev: MessageEvent<EquityResponse>) => {
      const entry = pending.get(ev.data.id);
      if (!entry) return;
      pending.delete(ev.data.id);
      clearTimeout(entry.timer);
      entry.resolve(ev.data.equities);
    };
    w.onerror = killWorker;
    w.onmessageerror = killWorker;
    worker = w;
    return w;
  } catch {
    // z. B. blockiert durch CSP oder Worker-lose Umgebung
    workerUnavailable = true;
    return null;
  }
}

/**
 * Rechnet mehrere Equity-Aufträge und liefert je einen Wert (0–1) in derselben
 * Reihenfolge. Blockiert den Hauptthread nie länger als eine Iterationsschleife
 * im Fallback – und im Regelfall gar nicht.
 */
export function runEquityJobs(jobs: EquityJob[]): Promise<number[]> {
  if (jobs.length === 0) return Promise.resolve([]);
  const w = getWorker();
  if (!w) {
    return new Promise((resolve) => {
      // Erst den Ladezustand zeichnen lassen, dann rechnen.
      setTimeout(() => resolve(computeSync(jobs)), 30);
    });
  }
  const id = nextId++;
  const request: EquityRequest = { id, jobs };
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      // Worker antwortet nicht – ab jetzt synchron weiterrechnen.
      killWorker();
    }, WORKER_TIMEOUT_MS);
    pending.set(id, { jobs, resolve, timer });
    try {
      w.postMessage(request);
    } catch {
      pending.delete(id);
      clearTimeout(timer);
      killWorker();
      resolve(computeSync(jobs));
    }
  });
}
