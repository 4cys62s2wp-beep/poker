/* Anker für den Beginn der Testphase.
   ===================================

   Das Problem, das diese Datei löst
   ---------------------------------
   Der Beginn der Testphase steht im Lernstand des Profils. Wer ihn im
   Browser-Speicher auf „heute" zurückschreibt, bekommt sieben neue Tage –
   beliebig oft. Im Gating-Test (Phase 3.5) nachgewiesen.

   Warum es das ABO nicht betrifft
   -------------------------------
   Ein bezahltes Abo lässt sich so nicht erschleichen: Der Status kommt aus
   `entitlements/{uid}` in Firestore, und den darf laut `firestore.rules`
   ausschließlich der Server schreiben – belegt durch Tests gegen den
   Emulator. Nur die Testphase läuft lokal, weil sie ohne Konto funktionieren
   soll.

   Die Lösung
   ----------
   Der früheste je gesehene Beginn wird zusätzlich getrennt abgelegt – in
   localStorage UND im IndexedDB-Spiegel (durableSet). Beim Laden gewinnt
   immer der FRÜHERE Wert. Wer das Datum vorwärts schiebt, ändert damit
   nichts.

   Was das NICHT leistet – und warum das in Ordnung ist
   ----------------------------------------------------
   Wer den gesamten Browser-Speicher löscht, bekommt eine neue Testphase.
   Das ist beabsichtigt: Genau so verhält sich auch ein echter Neunutzer oder
   ein privates Fenster, und dagegen hilft ohne Konto grundsätzlich nichts.
   Der Preis ist außerdem hoch – der gesamte Lernfortschritt geht mit
   verloren. Für ein 5-€-Abo ist diese Hürde angemessen; alles darüber
   verlangt ein Konto und eine serverseitig geführte Testphase (siehe
   docs/TODO_MANUELL.md). */

import { durableDelete, durableSet } from '../storage';

const ANCHOR_KEY = 'pokermentor-trial-anchor-v1';

function isValidIso(v: unknown): v is string {
  return typeof v === 'string' && v.length <= 40 && Number.isFinite(new Date(v).getTime());
}

/** Den gespeicherten Anker lesen. Null, wenn keiner existiert. */
export function readTrialAnchor(): string | null {
  try {
    const raw = localStorage.getItem(ANCHOR_KEY);
    return isValidIso(raw) ? raw : null;
  } catch {
    // Privates Fenster mit gesperrtem Speicher: kein Anker, kein Drama.
    return null;
  }
}

/**
 * Den Beginn der Testphase gegen den Anker abgleichen.
 *
 * Reine Funktion – der Zugriff auf den Speicher passiert außen. Damit ist die
 * eigentliche Regel prüfbar, ohne einen Browser vorzutäuschen.
 *
 * @returns Der Wert, der gelten soll, und ob der Anker geschrieben werden muss.
 */
export function reconcileTrialStart(
  fromData: string | null,
  anchor: string | null,
): { effective: string | null; writeAnchor: string | null } {
  const dataOk = isValidIso(fromData) ? fromData : null;
  const anchorOk = isValidIso(anchor) ? anchor : null;

  if (!dataOk && !anchorOk) return { effective: null, writeAnchor: null };

  // Nur einer von beiden vorhanden: Der gilt, und der andere wird nachgezogen.
  if (!anchorOk) return { effective: dataOk, writeAnchor: dataOk };
  if (!dataOk) return { effective: anchorOk, writeAnchor: null };

  // Beide vorhanden: Der FRÜHERE gewinnt. Genau hier scheitert der Versuch,
  // das Datum nach vorne zu schieben.
  const earlier =
    new Date(dataOk).getTime() <= new Date(anchorOk).getTime() ? dataOk : anchorOk;
  return { effective: earlier, writeAnchor: earlier === dataOk ? dataOk : null };
}

/** Anker setzen (nur, wenn er dadurch früher wird oder noch fehlt). */
export function writeTrialAnchor(iso: string): void {
  if (!isValidIso(iso)) return;
  const current = readTrialAnchor();
  if (current && new Date(current).getTime() <= new Date(iso).getTime()) return;
  durableSet(ANCHOR_KEY, iso);
}

/** Nur für den Profil-Wechsel und Tests: Anker verwerfen. */
export function clearTrialAnchor(): void {
  durableDelete(ANCHOR_KEY);
}
