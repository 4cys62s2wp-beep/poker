/* Die Zahl auf dem App-Symbol.
   ============================

   Wo der Browser es kann — installierte Apps in Chromium auf dem Desktop und
   auf Android —, steht die Zahl der fälligen Wiederholungen am Symbol. Wo
   nicht, passiert nichts: keine Ersatzlösung, keine Nachfrage.

   Insbesondere wird **keine Mitteilungserlaubnis angefordert**. Auf dem
   iPhone verlangt das Symbol-Abzeichen sie, und eine App, die ungefragt um
   Mitteilungen bittet, verbraucht das Vertrauen, das sie für die
   Anmeldung braucht. Dort bleibt das Symbol still. */

type MitMarke = Navigator & {
  setAppBadge?: (zahl?: number) => Promise<void>;
  clearAppBadge?: () => Promise<void>;
};

/** Setzt die Zahl am App-Symbol, bei 0 räumt sie ab. */
export function setzeAppMarke(zahl: number): void {
  if (typeof navigator === 'undefined') return;
  const nav = navigator as MitMarke;
  try {
    if (zahl > 0 && typeof nav.setAppBadge === 'function') {
      nav.setAppBadge(zahl).catch(() => { /* nicht erlaubt: bleibt still */ });
    } else if (zahl <= 0 && typeof nav.clearAppBadge === 'function') {
      nav.clearAppBadge().catch(() => { /* dito */ });
    }
  } catch {
    /* Synchron geworfen: ebenfalls nicht schlimm. */
  }
}

/** Kann dieser Browser die Zahl überhaupt zeigen? */
export function appMarkeMoeglich(): boolean {
  return typeof navigator !== 'undefined' && typeof (navigator as MitMarke).setAppBadge === 'function';
}
