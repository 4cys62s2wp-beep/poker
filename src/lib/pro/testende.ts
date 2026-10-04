/* Ein ruhiger Hinweis vor dem Ende der Testphase (E-099).
   ========================================================

   Drei Tage und einen Tag vorher — je einmal, wegklickbar, mit dem, was danach
   gratis bleibt. Kein Zähler, der mitläuft, keine Farbe, kein „Letzte Chance“.
   Wer nichts tut, verliert nichts als die Tiefe. Die Regel ist rein; das
   Merken, was schon gezeigt wurde, ist ein Wert im Gerätespeicher. */

import { TRIAL_DAYS } from './plan';

/** Ab dieser Zahl verbleibender Tage erscheint der Hinweis, größte zuerst. */
export const HINWEIS_STUFEN = [3, 1] as const;
export type HinweisStufe = (typeof HINWEIS_STUFEN)[number];

/**
 * Welcher Hinweis steht jetzt an?
 * @param tageUebrig verbleibende Testtage (0 = keine oder abgelaufen)
 * @param gesehen    die kleinste Stufe, die der Nutzer schon weggeklickt hat
 *                   (`null` = noch keine)
 */
export function faelligerHinweis(tageUebrig: number, gesehen: HinweisStufe | null): HinweisStufe | null {
  if (!Number.isFinite(tageUebrig) || tageUebrig <= 0 || tageUebrig > TRIAL_DAYS) return null;
  /* Die engste Stufe, die erreicht ist: bei 1 Tag „1“, bei 2 oder 3 Tagen „3“. */
  const stufe = [...HINWEIS_STUFEN].reverse().find((s) => tageUebrig <= s);
  if (stufe === undefined) return null;
  if (gesehen !== null && gesehen <= stufe) return null;
  return stufe;
}

const SCHLUESSEL = 'pokermentor-testende-v1';

export function ladeGesehen(): HinweisStufe | null {
  try {
    const roh = Number(localStorage.getItem(SCHLUESSEL));
    return (HINWEIS_STUFEN as readonly number[]).includes(roh) ? (roh as HinweisStufe) : null;
  } catch {
    return null;
  }
}

export function merkeGesehen(stufe: HinweisStufe): void {
  try {
    localStorage.setItem(SCHLUESSEL, String(stufe));
  } catch {
    /* Ohne Speicher erscheint der Hinweis beim nächsten Besuch noch einmal — harmlos. */
  }
}
