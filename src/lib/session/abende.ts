/* Abende — was von einem gespielten Abend übrig bleibt.
   ====================================================

   Ein Abend ist keine Statistik. Er ist eine Erinnerung: wer da war, wie
   lange es ging, wer am Ende die Chips hatte. Deshalb steht hier nichts, was
   man nicht auch am Küchentisch sagen würde.

   Was bewusst NICHT hier steht
   ----------------------------
   Kein Verlauf über Hände, keine Spielweise, keine Kennzahl je Person. Die
   Erfassung am Tisch ist absichtlich grob — sie darf keine halbe Minute
   kosten, sonst wird sie am dritten Abend weggelassen und die Daten sind ab
   da falsch. Lieber wenige Zahlen, die stimmen, als viele, die niemand
   pflegt.

   Kein Konto, kein Name außer dem, den jemand ansagt. Ein Spieler ist in
   dieser App eine Zeichenkette und sonst nichts.

   Die Plätze werden gerechnet, nicht eingetragen
   ----------------------------------------------
   Wer wo landet, ergibt sich aus zwei Angaben, die ohnehin anfallen: dem
   Endstand und dem Zeitpunkt des Ausscheidens. Eine Platzeingabe wäre eine
   dritte Angabe, die den beiden anderen widersprechen kann. */

import { durableSet } from '../storage';
import type { LaufendeSession, Spieler } from './laufend';
import { verbraucht } from './laufend';

export const SCHLUESSEL_ABENDE = 'pokermentor-session-abende-v1';

/** Wie viele Abende aufbewahrt werden.
 *
 *  Der Gerätespeicher ist begrenzt und wird mit dem Lernfortschritt geteilt.
 *  Zweihundert Abende sind bei einem Abend pro Woche knapp vier Jahre — weit
 *  jenseits dessen, was jemand durchblättert. */
export const HOECHSTZAHL = 200;

export interface AbendSpieler {
  name: string;
  /** Insgesamt eingezahlt, in Chips. Rebuys eingerechnet. */
  eingekauft: number;
  /** Endstand in Chips, oder `null`, wenn ausgeschieden. */
  stand: number | null;
  /** Wann jemand ausgeschieden ist, oder `null`. */
  raus_um: number | null;
  /** Gerechnet, nicht eingetragen. 1 ist der Sieg. */
  platz: number;
}

export interface Abend {
  /** Der Beginn ist zugleich die Kennung — zwei Abende können nicht in
   *  derselben Millisekunde beginnen. */
  id: string;
  begonnen: number;
  beendet: number;
  /** Reine Spielzeit ohne Pausen, in Millisekunden. */
  gespielt_ms: number;
  startchips: number;
  stufendauer_s: number;
  stufen: Array<[number, number]>;
  /** Wie weit die Blinds gekommen sind, 1-basiert. */
  erreichte_stufe: number;
  spieler: AbendSpieler[];
}

/** Die Plätze aus Endstand und Ausscheidezeit.
 *
 *  Die Regeln, in dieser Reihenfolge:
 *
 *  1. Wer noch Chips hat, steht vor allen Ausgeschiedenen.
 *  2. Unter denen mit Chips entscheidet der Stand, der größere zuerst.
 *  3. Unter den Ausgeschiedenen entscheidet der Zeitpunkt: Wer länger
 *     durchgehalten hat, steht weiter vorn.
 *  4. Gleichstand bekommt denselben Platz; der nächste Platz überspringt
 *     entsprechend viele (1, 2, 2, 4). Etwas anderes wäre eine erfundene
 *     Reihenfolge zwischen zwei gleichen Ständen.
 */
export function platziere(spieler: Spieler[]): AbendSpieler[] {
  const mitRang = spieler.map((s) => ({
    ...s,
    raus_um: s.raus_um ?? null,
    /* Ein Schlüssel, der alle drei Regeln in eine Zahlenfolge bringt:
       erst „noch dabei", dann der Stand, dann die Ausscheidezeit. */
    rang: s.stand !== null
      ? [1, s.stand, 0]
      : [0, 0, s.raus_um ?? 0],
  }));

  const kleiner = (a: number[], b: number[]) => {
    for (let i = 0; i < a.length; i += 1) {
      if (a[i] !== b[i]) return b[i] - a[i];
    }
    return 0;
  };

  const sortiert = [...mitRang].sort((a, b) => kleiner(a.rang, b.rang));

  const ergebnis: AbendSpieler[] = [];
  let platz = 0;
  let zuletzt: number[] | null = null;
  sortiert.forEach((s, i) => {
    if (zuletzt === null || kleiner(zuletzt, s.rang) !== 0) platz = i + 1;
    zuletzt = s.rang;
    ergebnis.push({
      name: s.name,
      eingekauft: s.eingekauft,
      stand: s.stand,
      raus_um: s.raus_um,
      platz,
    });
  });
  return ergebnis;
}

/** Aus einem laufenden Abend den abgeschlossenen machen. */
export function archiviere(s: LaufendeSession, beendet: number): Abend {
  const gespielt_ms = verbraucht(s, beendet);
  const dauer_ms = s.stufendauer_s * 1000;
  const erreichte_stufe = dauer_ms > 0
    ? Math.min(s.stufen.length, Math.floor(gespielt_ms / dauer_ms) + 1)
    : 1;
  return {
    id: String(s.begonnen),
    begonnen: s.begonnen,
    beendet,
    gespielt_ms,
    startchips: s.startchips,
    stufendauer_s: s.stufendauer_s,
    stufen: s.stufen,
    erreichte_stufe,
    spieler: platziere(s.spieler),
  };
}

function istAbendSpieler(v: unknown): v is AbendSpieler {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return typeof o.name === 'string'
    && typeof o.eingekauft === 'number'
    && typeof o.platz === 'number'
    && (o.stand === null || typeof o.stand === 'number');
}

/** Liest die Abende. Ein beschädigter Eintrag fällt heraus, der Rest bleibt.
 *
 *  Anders als beim laufenden Abend wird hier nicht alles verworfen: Ein
 *  kaputter Eintrag von vor zwei Jahren darf nicht die Erinnerung an die
 *  letzten dreißig Abende löschen. */
export function ladeAbende(): Abend[] {
  try {
    const roh = localStorage.getItem(SCHLUESSEL_ABENDE);
    if (!roh) return [];
    const d = JSON.parse(roh);
    if (!Array.isArray(d)) return [];
    return d.filter((a): a is Abend => {
      if (typeof a !== 'object' || a === null) return false;
      const o = a as Record<string, unknown>;
      return typeof o.id === 'string'
        && typeof o.begonnen === 'number'
        && Array.isArray(o.spieler)
        && o.spieler.every(istAbendSpieler);
    });
  } catch {
    return [];
  }
}

export function speichereAbende(abende: Abend[]): void {
  durableSet(SCHLUESSEL_ABENDE, JSON.stringify(abende.slice(0, HOECHSTZAHL)));
}

/** Einen Abend aufnehmen. Der neueste steht vorn.
 *
 *  Ein Abend mit derselben Kennung ersetzt den alten, statt ihn zu
 *  verdoppeln — sonst legt zweimaliges Beenden zwei Erinnerungen an dasselbe
 *  an. */
export function ergaenze(abende: Abend[], neu: Abend): Abend[] {
  return [neu, ...abende.filter((a) => a.id !== neu.id)]
    .sort((a, b) => b.begonnen - a.begonnen)
    .slice(0, HOECHSTZAHL);
}

/** Alle Abende, an denen dieser Name mitgespielt hat.
 *
 *  Verglichen wird ohne Rücksicht auf Groß- und Kleinschreibung und
 *  Leerzeichen am Rand: „Mira" und „mira " sind am Küchentisch dieselbe
 *  Person, und niemand tippt einen Namen zweimal gleich. */
export function abendeVon(abende: Abend[], name: string): Abend[] {
  const gesucht = normal(name);
  return abende.filter((a) => a.spieler.some((s) => normal(s.name) === gesucht));
}

function normal(name: string): string {
  return name.trim().toLocaleLowerCase('de');
}

export interface SpielerUebersicht {
  /** Der Name in der Schreibweise des letzten Abends. */
  name: string;
  abende: number;
  siege: number;
  zuletzt: number;
}

/** Alle Namen, die je mitgespielt haben — für das Antippen statt Suchen.
 *
 *  Sortiert nach dem letzten Abend, nicht alphabetisch: Wer letzte Woche
 *  dabei war, wird eher gesucht als jemand von vor zwei Jahren. */
export function spielerUebersicht(abende: Abend[]): SpielerUebersicht[] {
  const nach = new Map<string, SpielerUebersicht>();
  /* Von neu nach alt, damit die zuletzt benutzte Schreibweise gewinnt. */
  for (const a of [...abende].sort((x, y) => y.begonnen - x.begonnen)) {
    for (const s of a.spieler) {
      const schluessel = normal(s.name);
      if (!schluessel) continue;
      const bisher = nach.get(schluessel);
      if (bisher) {
        bisher.abende += 1;
        if (s.platz === 1) bisher.siege += 1;
      } else {
        nach.set(schluessel, {
          name: s.name.trim(),
          abende: 1,
          siege: s.platz === 1 ? 1 : 0,
          zuletzt: a.begonnen,
        });
      }
    }
  }
  return [...nach.values()].sort((a, b) => b.zuletzt - a.zuletzt);
}
