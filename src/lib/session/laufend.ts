/* Die laufende Session — der Zustand, der einen Absturz überlebt.
   ==============================================================

   Der eigentliche Zweck der Live-Session ist nicht der Timer. Er ist, dass
   eine angebrochene Runde nicht verlorengeht: Akku leer, Handy neu
   gestartet, App weggewischt — beim Öffnen steht alles wieder da.

   Deshalb gibt es keinen Speichern-Knopf. Jede Änderung schreibt.

   Warum das schon hier steht und nicht erst mit dem Timer
   -------------------------------------------------------
   Die Startseite braucht die Auskunft „läuft gerade etwas?", um statt eines
   Menüs einen Weg zurück anzubieten. Sie ist damit der erste Nutzer dieses
   Zustands, und der Zustand wächst mit den späteren Teilen mit — er ist
   heute klein, aber nicht vorläufig. */

import { durableDelete, durableSet } from '../storage';

export const SCHLUESSEL = 'pokermentor-session-laufend-v1';

/** Ein Spieler. Ein Name, mehr nicht — angelegt in Sekunden, ohne Konto. */
export interface Spieler {
  name: string;
  /** Wie viel er insgesamt eingezahlt hat, in Chips. Rebuys eingerechnet. */
  eingekauft: number;
  /** Sein Stand beim letzten Eintragen, in Chips. `null` = ausgeschieden. */
  stand: number | null;
  /** Wann er ausgeschieden ist, in Millisekunden seit 1970 — `null`, solange
   *  er noch dabei ist.
   *
   *  Der Zeitpunkt, nicht der Platz: Aus ihm ergibt sich die Reihenfolge von
   *  selbst, und er ist die einzige Angabe, die am Tisch ohnehin anfällt. Wer
   *  stattdessen Plätze einträgt, hat beim nächsten Rebuy zwei Angaben, die
   *  einander widersprechen können. */
  raus_um?: number | null;
}

export interface LaufendeSession {
  /** Beginn in Millisekunden seit 1970. Aus der Adresse der Session heraus
   *  unveränderlich — sie ist zugleich ihre Kennung. */
  begonnen: number;
  spieler: Spieler[];
  /** Startchips je Spieler, aus der Chipverteilung. */
  startchips: number;
  /** Die Blindstufen, in Chips: je Eintrag [Small, Big]. */
  stufen: Array<[number, number]>;
  /** Dauer einer Stufe in Sekunden. */
  stufendauer_s: number;
  /** Index der laufenden Stufe. */
  stufe: number;
  /** Millisekunden, die in der laufenden Stufe schon verbraucht sind —
   *  festgeschrieben beim letzten Anhalten. */
  verbraucht_ms: number;
  /** Wann zuletzt gestartet wurde, oder `null`, wenn pausiert. */
  laeuft_seit: number | null;
}

function istSpieler(v: unknown): v is Spieler {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return typeof o.name === 'string'
    && typeof o.eingekauft === 'number'
    && (o.stand === null || typeof o.stand === 'number')
    && (o.raus_um === undefined || o.raus_um === null || typeof o.raus_um === 'number');
}

/** Liest den Zustand. Alles, was nicht passt, gilt als „keine Session".
 *
 *  Hier wird bewusst **nicht** laut gescheitert wie bei den gerechneten
 *  Daten: Ein kaputter Eintrag im Gerätespeicher ist kein Fehler im
 *  Programm, sondern ein halb geschriebener Zustand nach einem Absturz. Wer
 *  daran die App scheitern lässt, sperrt jemanden aus seiner eigenen Runde
 *  aus. */
export function ladeLaufende(): LaufendeSession | null {
  try {
    const roh = localStorage.getItem(SCHLUESSEL);
    if (!roh) return null;
    const d = JSON.parse(roh) as Record<string, unknown>;
    if (typeof d.begonnen !== 'number' || !Array.isArray(d.spieler)) return null;
    if (!d.spieler.every(istSpieler)) return null;
    if (!Array.isArray(d.stufen) || d.stufen.length === 0) return null;
    return {
      begonnen: d.begonnen,
      spieler: d.spieler as Spieler[],
      startchips: typeof d.startchips === 'number' ? d.startchips : 0,
      stufen: d.stufen as Array<[number, number]>,
      stufendauer_s: typeof d.stufendauer_s === 'number' ? d.stufendauer_s : 0,
      stufe: typeof d.stufe === 'number' ? d.stufe : 0,
      verbraucht_ms: typeof d.verbraucht_ms === 'number' ? d.verbraucht_ms : 0,
      laeuft_seit: typeof d.laeuft_seit === 'number' ? d.laeuft_seit : null,
    };
  } catch {
    return null;
  }
}

/** Schreibt den Zustand. `null` beendet die Session. */
export function speichereLaufende(s: LaufendeSession | null): void {
  if (s === null) {
    durableDelete(SCHLUESSEL);
    return;
  }
  durableSet(SCHLUESSEL, JSON.stringify(s));
}

/** Wie lange die laufende Stufe schon läuft, in Millisekunden.
 *
 *  Rechnet aus dem Zeitstempel statt aus einem Zähler. Ein Zähler, der nur
 *  läuft, solange die Seite offen ist, steht still, sobald das Handy in der
 *  Tasche liegt — und genau dann läuft die Blindstufe weiter. */
export function verbraucht(s: LaufendeSession, jetzt: number): number {
  if (s.laeuft_seit === null) return s.verbraucht_ms;
  return s.verbraucht_ms + Math.max(0, jetzt - s.laeuft_seit);
}

/** Wie viele Spieler noch dabei sind. */
export function nochDabei(s: LaufendeSession): Spieler[] {
  return s.spieler.filter((p) => p.stand !== null);
}
