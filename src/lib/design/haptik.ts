/* Kurze Rückmeldung über den Vibrationsmotor.
   ==========================================

   Am Tisch ist es laut, und man schaut nicht hin. Wer eine Zahl einträgt,
   während er gleichzeitig Chips schiebt, bekommt vom Bildschirm keine
   Bestätigung mit — der Stoß in der Hand ist die einzige Rückmeldung, die
   ankommt.

   Warum so kurz
   -------------
   Zehn bis fünfzehn Millisekunden fühlen sich wie ein Tastendruck an. Alles
   darüber fühlt sich wie eine Fehlermeldung an, und das ist es nicht.

   Warum das nicht direkt im Bildschirm steht
   ------------------------------------------
   Weil es drei Dinge gibt, die man dabei falsch machen kann, und sie sollen
   nur einmal richtig gemacht werden: `navigator.vibrate` gibt es nicht
   überall, es wirft in manchen Browsern statt `false` zurückzugeben, und wer
   „Bewegung reduzieren" eingestellt hat, will das hier auch nicht. */

/** Länge der einzelnen Stöße in Millisekunden. */
const KURZ = 12;
const DOPPELT = [12, 60, 12];

function darfVibrieren(): boolean {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return false;
  /* Wer Bewegung reduziert, meint auch das hier. Die Einstellung ist die
     einzige Auskunft, die wir über die Empfindlichkeit des Nutzers haben. */
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    } catch {
      /* matchMedia kann in Testumgebungen fehlen – dann eben ohne. */
    }
  }
  return true;
}

function stosse(muster: number | number[]): void {
  if (!darfVibrieren()) return;
  try {
    navigator.vibrate(muster);
  } catch {
    /* Manche Browser werfen, statt false zurückzugeben. Eine fehlgeschlagene
       Vibration ist kein Grund, eine Eingabe scheitern zu lassen. */
  }
}

/** Eine Eingabe wurde angenommen. Der Normalfall. */
export function bestaetigt(): void {
  stosse(KURZ);
}

/** Etwas hat sich grundsätzlich geändert — Stufenwechsel, Runde vorbei.
 *  Zwei Stöße, damit es sich hörbar von einer normalen Eingabe unterscheidet. */
export function umschlag(): void {
  stosse(DOPPELT);
}

/** Nur für Tests: Ist die Rückmeldung auf diesem Gerät überhaupt möglich? */
export const _darfVibrieren = darfVibrieren;
