/* Die Equity-Matrix aus der Binärdatei lesen.
   ==========================================

   Warum überhaupt binär
   ---------------------
   Als JSON war die Matrix 5,0 MB groß, und der Service Worker speicherte sie
   für den Offline-Betrieb vollständig mit. Der Grund war nicht die
   Datenmenge, sondern ihre Verpackung: `"equity_a": 0.195705` sind 22
   Zeichen für eine Zahl, die in zwei Byte passt. Eine Equity ist ein Anteil
   zwischen 0 und 1; in **Basispunkten** — Hundertstelprozent — ist sie eine
   ganze Zahl zwischen 0 und 10 000, und feiner als einen Basispunkt zeigt
   die App nie etwas an.

   Was dabei NICHT weggelassen wird: kein einziger Wert. Dieselben Handpaare,
   dieselben Farbkonfigurationen, dieselben Häufigkeiten. Eine Datei kleiner
   zu machen, indem man Daten daraus entfernt, wäre keine Leistung.

   Der Aufbau steht im Erzeuger (`scripts/pokermath-app-daten.mjs`,
   `b4Binaer`). Hier steht das Gegenstück. Beide Seiten getrennt zu schreiben
   ist Absicht: Ein Format, das nur ein Programm lesen kann, ist kein Format.

   Wie streng gelesen wird
   -----------------------
   Genauso streng wie beim JSON: Jede Unstimmigkeit wirft `SchemaFehler` mit
   dem Pfad der schuldigen Stelle. Eine Binärdatei fällt nicht auf, wenn sie
   halb stimmt — ein falsches Byte im Kopf verschiebt alles danach, und die
   Zahlen sähen trotzdem aus wie Zahlen. */

import { SchemaFehler } from './laden';
import type { Matchup } from './typen';

/** Kennung am Dateianfang. Ohne sie wäre jede Datei eine Matrix. */
export const KENNUNG = 'PMB4';
export const VERSION = 1;

/** Ein Anteil zwischen 0 und 1, gespeichert in Hundertstelprozent. */
const BASISPUNKTE_JE_EINS = 10000;

class Leser {
  private i = 0;

  constructor(private readonly sicht: DataView, private readonly bytes: Uint8Array) {}

  private pruefe(anzahl: number, was: string): void {
    if (this.i + anzahl > this.bytes.length) {
      throw new SchemaFehler(`b4_preflop_equity.bin@${this.i}`,
        `ist zu Ende, aber ${was} fehlt noch`);
    }
  }

  uint8(was: string): number {
    this.pruefe(1, was);
    return this.sicht.getUint8(this.i++);
  }

  uint16(was: string): number {
    this.pruefe(2, was);
    const wert = this.sicht.getUint16(this.i, true);
    this.i += 2;
    return wert;
  }

  uint32(was: string): number {
    this.pruefe(4, was);
    const wert = this.sicht.getUint32(this.i, true);
    this.i += 4;
    return wert;
  }

  /** Rohbytes, ohne sie zu deuten. */
  roh(anzahl: number, was: string): Uint8Array {
    this.pruefe(anzahl, was);
    const teil = this.bytes.subarray(this.i, this.i + anzahl);
    this.i += anzahl;
    return teil;
  }

  get gelesen(): number { return this.i; }
  get uebrig(): number { return this.bytes.length - this.i; }
}

const dekodierer = new TextDecoder('utf-8', { fatal: true });

function basispunkteAlsAnteil(bp: number, pfad: string): number {
  if (bp > BASISPUNKTE_JE_EINS) {
    throw new SchemaFehler(pfad, `${bp} Basispunkte sind mehr als 100 %`);
  }
  return bp / BASISPUNKTE_JE_EINS;
}

/**
 * Liest die Matrix. Wirft `SchemaFehler`, sobald etwas nicht zusammenpasst.
 *
 * Zurück kommt dieselbe Liste, die früher aus dem JSON kam — die
 * aufrufende Seite merkt keinen Unterschied außer der Ladezeit.
 */
export function leseMatrix(puffer: ArrayBuffer): Matchup[] {
  const bytes = new Uint8Array(puffer);
  const leser = new Leser(new DataView(puffer), bytes);

  const kennung = String.fromCharCode(...leser.roh(4, 'die Kennung'));
  if (kennung !== KENNUNG) {
    throw new SchemaFehler('b4_preflop_equity.bin',
      `beginnt mit "${kennung}" statt "${KENNUNG}" — das ist keine Equity-Matrix`);
  }
  const version = leser.uint8('die Version');
  if (version !== VERSION) {
    throw new SchemaFehler('b4_preflop_equity.bin',
      `ist Fassung ${version}, diese App liest Fassung ${VERSION}`);
  }
  leser.uint8('das reservierte Byte');

  const anzahlPaare = leser.uint32('die Zahl der Handpaare');
  const anzahlKonf = leser.uint32('die Zahl der Farbkonfigurationen');
  const anzahlKlassen = leser.uint8('die Zahl der Starthand-Klassen');
  const anzahlBeziehungen = leser.uint8('die Zahl der Beziehungstexte');

  const klassen: string[] = [];
  for (let n = 0; n < anzahlKlassen; n += 1) {
    const roh = leser.roh(4, `der Name der Klasse ${n}`);
    /* Mit Null aufgefüllt: alles ab dem ersten Nullbyte gehört nicht dazu. */
    const ende = roh.indexOf(0);
    klassen.push(dekodierer.decode(roh.subarray(0, ende === -1 ? roh.length : ende)));
  }

  const beziehungen: Array<{ de: string; en: string }> = [];
  for (let n = 0; n < anzahlBeziehungen; n += 1) {
    const de = dekodierer.decode(leser.roh(leser.uint8(`die Länge von Beziehung ${n} (de)`),
      `der deutsche Text der Beziehung ${n}`));
    const en = dekodierer.decode(leser.roh(leser.uint8(`die Länge von Beziehung ${n} (en)`),
      `der englische Text der Beziehung ${n}`));
    beziehungen.push({ de, en });
  }

  /* Erst die Handpaare, dann alle Konfigurationen am Stück. Der Anfang der
     Konfigurationen eines Paares ergibt sich aus der Summe der vorherigen
     Anzahlen — ein Feld dafür wären vier Byte je Handpaar für eine Zahl, die
     man ausrechnen kann. */
  const koepfe: Array<{ a: number; b: number; equity: number; konf: number; spanne: number }> = [];
  for (let n = 0; n < anzahlPaare; n += 1) {
    koepfe.push({
      a: leser.uint8(`die erste Klasse von Handpaar ${n}`),
      b: leser.uint8(`die zweite Klasse von Handpaar ${n}`),
      equity: leser.uint16(`die Equity von Handpaar ${n}`),
      konf: leser.uint8(`die Zahl der Konfigurationen von Handpaar ${n}`),
      spanne: leser.uint16(`die Spanne von Handpaar ${n}`),
    });
  }

  const gezaehlt = koepfe.reduce((n, k) => n + k.konf, 0);
  if (gezaehlt !== anzahlKonf) {
    throw new SchemaFehler('b4_preflop_equity.bin',
      `nennt ${anzahlKonf} Farbkonfigurationen, die Handpaare zählen ${gezaehlt}`);
  }

  const matchups: Matchup[] = [];
  for (let n = 0; n < anzahlPaare; n += 1) {
    const kopf = koepfe[n];
    const pfad = `b4_preflop_equity.matchups[${n}]`;
    const a = klassen[kopf.a];
    const b = klassen[kopf.b];
    if (a === undefined || b === undefined) {
      throw new SchemaFehler(pfad, `verweist auf eine Klasse, die es nicht gibt (${kopf.a}, ${kopf.b})`);
    }

    const eintrag: Matchup = {
      a,
      b,
      equity_a: basispunkteAlsAnteil(kopf.equity, `${pfad}.equity_a`),
      spanne_pp: kopf.spanne / 100,
      spanne_relevant: kopf.konf > 0,
    };

    if (kopf.konf > 0) {
      const konfigurationen = [];
      for (let k = 0; k < kopf.konf; k += 1) {
        const q = `${pfad}.farbkonfigurationen[${k}]`;
        const equity = leser.uint16(`die Equity der Konfiguration ${k} von Handpaar ${n}`);
        const haeufigkeit = leser.uint8(`die Häufigkeit der Konfiguration ${k} von Handpaar ${n}`);
        const beziehung = leser.uint8(`die Beziehung der Konfiguration ${k} von Handpaar ${n}`);
        if (beziehungen[beziehung] === undefined) {
          throw new SchemaFehler(q, `verweist auf Beziehungstext ${beziehung}, den es nicht gibt`);
        }
        if (haeufigkeit < 1) {
          throw new SchemaFehler(q, 'hat die Häufigkeit 0 — dann käme sie nie vor');
        }
        konfigurationen.push({
          beziehung: beziehungen[beziehung],
          haeufigkeit,
          equity_a: basispunkteAlsAnteil(equity, `${q}.equity_a`),
        });
      }
      eintrag.farbkonfigurationen = konfigurationen;
      /* Die Spanne wird aus den Konfigurationen gerechnet und nicht
         mitgeliefert. Zwei Zahlen für dieselbe Sache können auseinandergehen;
         eine gerechnete kann es nicht. */
      const werte = konfigurationen.map((f) => f.equity_a);
      eintrag.spanne_pp = Math.round((Math.max(...werte) - Math.min(...werte)) * 100 * 10000) / 10000;
    }

    matchups.push(eintrag);
  }

  if (leser.uebrig !== 0) {
    throw new SchemaFehler('b4_preflop_equity.bin',
      `hat ${leser.uebrig} Byte übrig — die Datei passt nicht zu ihrem eigenen Kopf`);
  }
  return matchups;
}
