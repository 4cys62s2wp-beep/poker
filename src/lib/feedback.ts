/* Eine Mail an den Betreiber — für Feedback und Fehlerberichte.
   ============================================================

   Es gibt keinen Server, der Berichte einsammelt (und keinen Tracker, der es
   unbemerkt täte): Wer etwas melden will, schreibt eine Mail, und die App
   legt nur an, was beim Beschreiben hilft — Version, Sprache, Browser und bei
   einem Absturz die Fehlermeldung. Nichts davon verlässt das Gerät, bevor
   jemand in seinem Mailprogramm auf „Senden“ drückt, und der Text ist dort
   vorher zu lesen und zu ändern.

   Die Adresse kommt aus `legal.json` (Punkt 3.6). Ohne sie gibt es keinen
   Link: eine erfundene Adresse wäre schlimmer als keine. */

export interface FeedbackAngaben {
  /** Die Adresse des Betreibers. */
  email: string;
  betreff: string;
  /** Die erste Zeile im Text, über der Trennlinie (leer lassen = nichts). */
  kopf?: string;
  /** Baustand der App. */
  bau: string;
  version: string;
  sprache: string;
  userAgent: string;
  /** Die Fehlermeldung bei einem Absturz. */
  fehler?: string;
}

/** Wie viele Zeichen einer Fehlermeldung mitgehen — lange Meldungen sprengen
 *  die Adresszeile mancher Mailprogramme. */
export const FEHLER_MAX = 400;

export function feedbackMail(a: FeedbackAngaben): string {
  const technik = [
    `${a.version} · ${a.bau} · ${a.sprache}`,
    a.userAgent,
    ...(a.fehler ? [a.fehler.replace(/\s+/g, ' ').trim().slice(0, FEHLER_MAX)] : []),
  ].join('\n');
  const text = `${a.kopf ? `${a.kopf}\n\n\n` : ''}—\n${technik}`;
  return `mailto:${a.email}?subject=${encodeURIComponent(a.betreff)}&body=${encodeURIComponent(text)}`;
}
