/* Wo steht ein Kauf, wenn man von der Zahlungsseite zurückkommt? (E-099)
   =====================================================================

   Stripe schickt nach dem Kauf auf `#/pro?kauf=ok`, nach dem Abbruch auf
   `#/pro?kauf=abbruch`. Dass die Zahlung durch ist, weiß die App aber erst,
   wenn der Webhook die Berechtigung geschrieben hat und sie über die
   Beobachtung ankommt — Sekunden später, manchmal Minuten. Bis dahin steht
   „Zahlung wird bestätigt …“, nicht die Startseite und kein Schweigen. */

export type KaufStand =
  /** Nichts zu melden: kein Rücksprung von der Zahlungsseite. */
  | 'keiner'
  /** Abgebrochen. Es wurde nichts berechnet. */
  | 'abbruch'
  /** Bezahlt, die Berechtigung ist angekommen. */
  | 'aktiv'
  /** Bezahlt, die Berechtigung fehlt noch. */
  | 'wartet'
  /** Dauert länger als üblich. */
  | 'dauertLange';

/** Nach dieser Zeit ohne Berechtigung sagt die Seite, dass es länger dauert. */
export const WARTEZEIT_MS = 45_000;

export function kaufStand(kauf: string | null, pro: boolean, wartetSeitMs: number): KaufStand {
  if (kauf === 'abbruch') return 'abbruch';
  if (kauf !== 'ok') return 'keiner';
  if (pro) return 'aktiv';
  return wartetSeitMs >= WARTEZEIT_MS ? 'dauertLange' : 'wartet';
}
