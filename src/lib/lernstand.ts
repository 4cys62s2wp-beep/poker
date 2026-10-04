/* Der Lernstand je Thema.
   =======================

   Das Profil zeigte von allem, was jemand geübt hatte, eine Summe: „Trainer-
   Antworten 212, 74 % richtig“. Aus ihr lässt sich nichts tun. Gute Lern-Apps
   sagen, wie sicher man in einem Thema ist, und schlagen das Schwächste zum
   Üben vor (E-097). Die Daten lagen schon da — Versuche und richtige Antworten
   je Trainer —, nur nicht die Frage, wie es *zuletzt* lief: Eine Quote über
   alle Antworten seit dem ersten Tag sagt nichts darüber, ob man ein Thema
   inzwischen kann. Deshalb merkt sich `recordTrainer` die letzten 20 Antworten
   je Trainer.

   Keine Ranglisten, kein Vergleich mit anderen: Die Zahlen gehören der Person,
   die übt. Reine Rechnung ohne Oberfläche. */

import { lektionenFuer, ZIEL_PFAD, type UebungsZiel } from './lernen/uebung';
import type { OrtPfad } from './orte';

/** Wie viele Antworten das Fenster hält. */
export const FENSTER = 20;
/** Ab so vielen Antworten wird eingestuft; darunter ist es zu wenig Datenlage. */
export const MIN_ANTWORTEN = 10;
/** Ab dieser Quote im Fenster gilt ein Thema als sicher … */
export const SICHER_AB = 0.8;
/** … und ab dieser als „wackelt“; darunter ist es noch offen. */
export const WACKELT_AB = 0.55;

/** Die letzten Antworten als Zeichenfolge, die älteste zuerst: „1“ richtig,
 *  „0“ falsch. Eine Zeichenfolge statt einer Liste, weil sie im Gerätespeicher
 *  und im Backup klein bleibt. */
export function merkeAntwort(letzte: string | undefined, richtig: boolean): string {
  return `${letzte ?? ''}${richtig ? '1' : '0'}`.slice(-FENSTER);
}

/** Nur eine brauchbare Zeichenfolge übersteht das Laden. */
export function lesbareLetzte(roh: unknown): string | undefined {
  return typeof roh === 'string' && /^[01]{1,20}$/.test(roh) ? roh : undefined;
}

export type Stufe = 'sicher' | 'wackelt' | 'offen' | 'zuWenig';

export interface Fenster {
  /** Wie viele Antworten im Fenster liegen (höchstens 20, je Trainer). */
  antworten: number;
  richtig: number;
}

export function zaehle(letzte: string | undefined): Fenster {
  const s = lesbareLetzte(letzte) ?? '';
  return { antworten: s.length, richtig: [...s].filter((c) => c === '1').length };
}

export function stufeVon(f: Fenster): Stufe {
  if (f.antworten < MIN_ANTWORTEN) return 'zuWenig';
  const quote = f.richtig / f.antworten;
  if (quote >= SICHER_AB) return 'sicher';
  if (quote >= WACKELT_AB) return 'wackelt';
  return 'offen';
}

export type ThemaId = 'potodds' | 'outs' | 'handranking' | 'preflop' | 'pushfold' | 'equity' | 'szenario';

interface Thema {
  id: ThemaId;
  /** Welche Trainer-Kennungen zu diesem Thema zählen. */
  trainer: string[];
  /** Wohin „Jetzt üben“ führt. */
  ziel: UebungsZiel;
}

/** Die Themen in Kursreihenfolge. Pot Odds zählt den Trainer und den Drill
 *  zusammen: Beide üben dieselbe Rechnung. */
export const THEMEN: Thema[] = [
  { id: 'handranking', trainer: ['handranking'], ziel: 'handranking' },
  { id: 'preflop', trainer: ['preflop'], ziel: 'preflop' },
  { id: 'outs', trainer: ['outs'], ziel: 'outs' },
  { id: 'potodds', trainer: ['potodds', 'potoddsdrill'], ziel: 'potodds' },
  { id: 'equity', trainer: ['equity'], ziel: 'equity' },
  { id: 'pushfold', trainer: ['pushfold'], ziel: 'pushfold' },
  { id: 'szenario', trainer: ['szenario'], ziel: 'szenario' },
];

export interface Zeile extends Fenster {
  thema: ThemaId;
  stufe: Stufe;
  /** Anteil richtig im Fenster, 0..1; `null`, solange es keine Antwort gibt. */
  quote: number | null;
  /** Alle Antworten, die je gegeben wurden — nur zur Anzeige „4 von 10“. */
  gesamt: number;
  uebenPfad: OrtPfad;
  /** Die Lektion, die das Thema erklärt — die erste, die zur Übung führt. */
  lektion: string | null;
}

interface Stand {
  attempts: number;
  letzte?: string;
}

/**
 * Eine Zeile je Thema, in dem es schon eine Antwort gibt. Themen ohne
 * Antwort fehlen: Sieben Zeilen „noch zu wenig Daten“ wären die „Wand aus
 * Nullen“, die das Profil gerade verloren hat.
 */
export function lernstand(trainers: Record<string, Stand | undefined>): Zeile[] {
  const zeilen: Zeile[] = [];
  for (const t of THEMEN) {
    let antworten = 0;
    let richtig = 0;
    let gesamt = 0;
    for (const id of t.trainer) {
      const s = trainers[id];
      if (!s) continue;
      gesamt += s.attempts;
      const f = zaehle(s.letzte);
      antworten += f.antworten;
      richtig += f.richtig;
    }
    /* Ein Stand aus der Zeit vor dem Ringpuffer hat Versuche, aber kein Fenster:
       Er zählt als „zu wenig Daten“, bis neue Antworten dazukommen — eine Quote
       aus Altdaten zu erfinden wäre falsch. */
    if (gesamt === 0) continue;
    const f = { antworten, richtig };
    zeilen.push({
      thema: t.id,
      ...f,
      stufe: stufeVon(f),
      quote: antworten > 0 ? richtig / antworten : null,
      gesamt,
      uebenPfad: ZIEL_PFAD[t.ziel],
      lektion: lektionenFuer(t.ziel)[0] ?? null,
    });
  }
  return zeilen;
}

/**
 * Das schwächste Thema: das mit der niedrigsten Quote unter denen, die sich
 * einstufen lassen — und nur, wenn es nicht „sicher“ ist. Wer überall sicher
 * ist, bekommt keinen Übungsvorschlag erfunden.
 */
export function schwaechste(zeilen: Zeile[]): Zeile | null {
  const kandidaten = zeilen.filter((z) => z.stufe !== 'zuWenig' && z.stufe !== 'sicher' && z.quote !== null);
  if (kandidaten.length === 0) return null;
  return kandidaten.reduce((a, b) => ((b.quote as number) < (a.quote as number) ? b : a));
}
