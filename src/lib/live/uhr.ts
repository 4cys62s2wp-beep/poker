/* Der Stand der Uhr — aus Zeitstempeln gerechnet, nicht gezählt.
   ============================================================

   Warum das hier steht und nicht im Bildschirm
   --------------------------------------------
   Der Tischbildschirm zeigt drei Zahlen, und alle drei sind gerechnet: welche
   Blindstufe gerade gilt, wie lange sie noch läuft, was danach kommt. Stünde
   diese Rechnung im Bildschirm, könnte man sie nur prüfen, indem man den
   Bildschirm baut und wartet — bei einer Stufendauer von zwanzig Minuten ein
   Test, den niemand ausführt.

   Hier ist sie eine Funktion von zwei Werten: dem gespeicherten Stand und
   „jetzt". Damit lässt sich jeder Zeitpunkt eines Abends in einer
   Millisekunde prüfen, auch die letzte Stufe nach vier Stunden.

   Der eigentliche Grund für Zeitstempel statt Zähler
   --------------------------------------------------
   Ein Zähler zählt nur, solange die Seite offen ist. Das Gerät liegt aber in
   der Tischmitte und sperrt sich, jemand nimmt es hoch, jemand wechselt kurz
   in eine andere App. Die Blindstufe läuft dabei weiter — die Uhr auf dem
   Bildschirm nicht. Aus `laeuft_seit` und `verbraucht_ms` ergibt sich die
   verstrichene Zeit auch dann richtig, wenn eine Stunde lang niemand
   hingeschaut hat. */

import { verbraucht, type LaufendeSession } from '../session/laufend';

/** Wie lange vor dem Stufenwechsel die Vorankündigung kommt, in Sekunden.
 *
 *  Eine Minute: lang genug, um die laufende Hand zu Ende zu spielen, kurz
 *  genug, dass niemand die Ankündigung wieder vergisst. */
export const VORWARNUNG_S = 60;

export interface Uhrenstand {
  /** Läuft die Uhr gerade, oder ist sie angehalten? */
  laeuft: boolean;
  /** Gesamte gespielte Zeit seit Beginn, in Millisekunden. */
  verstrichen_ms: number;
  /** Index der geltenden Blindstufe in `session.stufen`. */
  stufeIndex: number;
  /** Small und Big Blind der geltenden Stufe, in Chips. */
  blinds: [number, number];
  /** Die nächste Stufe, oder `null` auf der letzten. */
  naechste: [number, number] | null;
  istLetzte: boolean;
  /** Restzeit der geltenden Stufe in Millisekunden. Auf der letzten Stufe
   *  läuft sie ebenfalls ab und bleibt dann bei 0 stehen — die letzte Stufe
   *  gilt bis zum Ende des Abends. */
  rest_ms: number;
  /** Ist die Vorwarnzeit erreicht? Nur, solange die Uhr läuft: in der Pause
   *  soll nichts piepen und nichts blinken. */
  knapp: boolean;
}

/** Der vollständige Stand der Uhr zum Zeitpunkt `jetzt`. */
export function standDerUhr(session: LaufendeSession, jetzt: number): Uhrenstand {
  const laeuft = session.laeuft_seit !== null;
  const verstrichen_ms = verbraucht(session, jetzt);
  const dauer_ms = session.stufendauer_s * 1000;
  const letzter = session.stufen.length - 1;

  /* Eine Stufendauer von 0 wäre eine Division durch null. Sie entsteht nur
     aus einem beschädigten Stand (`ladeLaufende` setzt fehlende Felder auf 0),
     und dann gilt: die erste Stufe, unbegrenzt. Ein Absturz an dieser Stelle
     würde einen Abend beenden, der noch läuft. */
  const stufeIndex = dauer_ms > 0
    ? Math.min(letzter, Math.floor(verstrichen_ms / dauer_ms))
    : 0;

  const rest_ms = dauer_ms > 0
    ? Math.max(0, (stufeIndex + 1) * dauer_ms - verstrichen_ms)
    : 0;

  const istLetzte = stufeIndex === letzter;

  return {
    laeuft,
    verstrichen_ms,
    stufeIndex,
    blinds: session.stufen[stufeIndex],
    naechste: istLetzte ? null : session.stufen[stufeIndex + 1],
    istLetzte,
    rest_ms,
    knapp: laeuft && !istLetzte && rest_ms <= VORWARNUNG_S * 1000,
  };
}

/** Hält die Uhr an. Schreibt die bis dahin verbrauchte Zeit fest.
 *
 *  Getrennt vom Bildschirm, weil „Pause" und „Weiter" die einzigen zwei
 *  Handgriffe sind, bei denen ein Fehler den ganzen Abend verschiebt: Wer
 *  hier `verbraucht_ms` nicht festschreibt, verliert beim Fortsetzen die
 *  gesamte bisherige Zeit. */
export function anhalten(session: LaufendeSession, jetzt: number): LaufendeSession {
  if (session.laeuft_seit === null) return session;
  return { ...session, verbraucht_ms: verbraucht(session, jetzt), laeuft_seit: null };
}

/** Setzt die Uhr an derselben Stelle fort. */
export function fortsetzen(session: LaufendeSession, jetzt: number): LaufendeSession {
  if (session.laeuft_seit !== null) return session;
  return { ...session, laeuft_seit: jetzt };
}
