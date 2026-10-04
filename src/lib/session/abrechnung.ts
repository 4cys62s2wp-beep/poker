/* Die Abrechnung eines Abends: wer bekommt, wer zahlt, an wen.
   ===========================================================

   Am Ende eines Abends steht dieselbe Frage wie am Anfang: Wer bekommt wie
   viel? Wird sie nach dem Abend gestellt, rechnet jeder anders. Diese Datei
   rechnet sie einmal, aus den Zahlen, die der Tisch ohnehin kennt — Einzahlung,
   Endstand, Platz —, und sagt dazu, wer wem wie viel überweist.

   Reine Rechnung, keine Oberfläche. Sie rechnet in ganzen Cent, damit die
   Summe aller Salden immer genau null ist; eine Rechnung in Kommazahlen
   entdeckt ihre Rundungsfehler erst am Stammtisch.

   Zweck und Grenze
   ----------------
   Das ist Zahlenverwaltung zwischen Privatleuten, kein Zahlungsverkehr (E-010,
   E-030): Die App bewegt kein Geld, sie rechnet auf, was die Runde ohnehin
   untereinander ausmacht. */

import { berechneAuszahlung } from '../poker/payout';
import type { Abend } from './abende';
import type { LaufendeSession } from './laufend';

export interface Saldo {
  name: string;
  platz: number;
  /** In Euro. */
  eingezahlt: number;
  ausgezahlt: number;
  /** ausgezahlt − eingezahlt; positiv heißt: bekommt Geld. */
  netto: number;
}

export interface Zahlung {
  von: string;
  an: string;
  betrag: number;
}

export interface Abrechnung {
  zeilen: Saldo[];
  zahlungen: Zahlung[];
  /** Der Topf in Euro. */
  topf: number;
  /** Stimmt, was gezählt wurde, mit dem, was eingekauft wurde? */
  pruefung: { eingekauft: number; gezaehlt: number; abweichung: number };
}

const cent = (euro: number) => Math.round(euro * 100);
const euro = (c: number) => c / 100;

/**
 * Die Ausgleichszahlungen: Wer im Minus ist, zahlt an den größten Gewinner, bis
 * alles ausgeglichen ist. Jede Zahlung gleicht mindestens einen Spieler
 * vollständig aus, also sind es höchstens n − 1.
 */
export function ausgleich(salden: Array<{ name: string; netto: number }>): Zahlung[] {
  const schuldner = salden
    .map((s) => ({ name: s.name, c: cent(s.netto) }))
    .filter((s) => s.c < 0)
    .sort((a, b) => a.c - b.c);
  const gewinner = salden
    .map((s) => ({ name: s.name, c: cent(s.netto) }))
    .filter((s) => s.c > 0)
    .sort((a, b) => b.c - a.c);

  const aus: Zahlung[] = [];
  let i = 0;
  let j = 0;
  while (i < schuldner.length && j < gewinner.length) {
    const betrag = Math.min(-schuldner[i].c, gewinner[j].c);
    if (betrag > 0) aus.push({ von: schuldner[i].name, an: gewinner[j].name, betrag: euro(betrag) });
    schuldner[i].c += betrag;
    gewinner[j].c -= betrag;
    if (schuldner[i].c === 0) i += 1;
    if (gewinner[j].c === 0) j += 1;
  }
  return aus;
}

/** Cent-Beträge so auf null bringen, dass die Summe genau stimmt: Ein Rest von
 *  ein, zwei Cent geht an den Spieler mit dem größten Betrag. */
function glaetten(centBetraege: number[]): number[] {
  const rest = centBetraege.reduce((a, b) => a + b, 0);
  if (rest === 0 || centBetraege.length === 0) return centBetraege;
  const aus = [...centBetraege];
  let ziel = 0;
  aus.forEach((c, k) => { if (Math.abs(c) > Math.abs(aus[ziel])) ziel = k; });
  aus[ziel] -= rest;
  return aus;
}

/**
 * Die Abrechnung eines gespeicherten Abends; `null`, wenn dazu die Angaben fehlen
 * (kein Einsatz in Euro eingetragen).
 *
 * Turnier: Der Topf wird nach Platz verteilt (`payout.ts`); wer sich einen Platz
 * teilt, teilt dessen Anteil. Cash: Jeder bekommt seinen Endstand zurück, zum
 * eingetragenen Kurs.
 */
export function abrechne(abend: Abend): Abrechnung | null {
  if (!abend.euroJeSpieler || abend.euroJeSpieler <= 0) return null;
  const n = abend.spieler.length;
  if (n < 2) return null;

  const gezaehlt = abend.spieler.reduce((s, p) => s + (p.stand ?? 0), 0);
  const eingekauft = abend.spieler.reduce((s, p) => s + p.eingekauft, 0);
  const pruefung = { eingekauft, gezaehlt, abweichung: gezaehlt - eingekauft };

  if (abend.modus === 'cash') {
    if (!abend.punkteJeEuro || abend.punkteJeEuro <= 0) return null;
    const kurs = abend.punkteJeEuro;
    const eingezahlt = abend.spieler.map((p) => cent(p.eingekauft / kurs));
    const ausgezahlt = abend.spieler.map((p) => cent((p.stand ?? 0) / kurs));
    // Stimmen die Chips nicht, gibt es keine Zahlungen — sie würden nicht aufgehen.
    const stimmt = pruefung.abweichung === 0;
    const netto = stimmt
      ? glaetten(ausgezahlt.map((a, k) => a - eingezahlt[k]))
      : ausgezahlt.map((a, k) => a - eingezahlt[k]);
    const zeilen = abend.spieler.map((p, k) => ({
      name: p.name,
      platz: p.platz,
      eingezahlt: euro(eingezahlt[k]),
      ausgezahlt: euro(eingezahlt[k] + netto[k]),
      netto: euro(netto[k]),
    }));
    return {
      zeilen,
      zahlungen: stimmt ? ausgleich(zeilen) : [],
      topf: euro(eingezahlt.reduce((a, b) => a + b, 0)),
      pruefung,
    };
  }

  // Turnier: Einzahlungen = Buy-ins, jeder Rebuy ein weiterer Buy-in.
  const buyIns = abend.spieler.map((p) => (abend.startchips > 0 ? Math.max(1, Math.round(p.eingekauft / abend.startchips)) : 1));
  const rebuys = buyIns.reduce((a, b) => a + b, 0) - n;
  const plan = berechneAuszahlung({ spieler: n, buyIn: abend.euroJeSpieler, rebuys, rundung: 1 });
  const eingezahlt = buyIns.map((b) => cent(b * abend.euroJeSpieler!));

  // Wer sich einen Platz teilt, teilt die Anteile der Plätze, die er belegt.
  const nachPlatz = new Map<number, number[]>();
  abend.spieler.forEach((p, k) => nachPlatz.set(p.platz, [...(nachPlatz.get(p.platz) ?? []), k]));
  const ausgezahlt = new Array<number>(n).fill(0);
  for (const [platz, indizes] of nachPlatz) {
    let summe = 0;
    for (let q = 0; q < indizes.length; q += 1) {
      summe += cent(plan.auszahlungen[platz - 1 + q]?.betrag ?? 0);
    }
    const anteil = Math.floor(summe / indizes.length);
    indizes.forEach((k, q) => { ausgezahlt[k] = anteil + (q === 0 ? summe - anteil * indizes.length : 0); });
  }
  const netto = glaetten(ausgezahlt.map((a, k) => a - eingezahlt[k]));
  const zeilen = abend.spieler.map((p, k) => ({
    name: p.name,
    platz: p.platz,
    eingezahlt: euro(eingezahlt[k]),
    ausgezahlt: euro(eingezahlt[k] + netto[k]),
    netto: euro(netto[k]),
  }));
  return {
    zeilen,
    zahlungen: ausgleich(zeilen),
    topf: euro(eingezahlt.reduce((a, b) => a + b, 0)),
    pruefung,
  };
}

/** Was der Auszahlungs-Rechner aus einem laufenden Abend übernimmt.
 *
 *  Die Rebuys stehen nirgends gezählt; sie ergeben sich daraus, wie viele
 *  Startstapel insgesamt eingekauft wurden, abzüglich der ersten je Spieler.
 *  Mit Euro-Einsatz rechnet der Rechner in Euro, sonst in Chips. */
export function auszahlungAusAbend(
  a: LaufendeSession | null,
): { spieler: number; buyIn: number; rebuys: number; einheit: 'euro' | 'chips' } | null {
  if (!a || a.spieler.length < 2) return null;
  const euro = a.euroJeSpieler && a.euroJeSpieler > 0 ? a.euroJeSpieler : null;
  const buyIn = euro ?? a.startchips;
  if (!(buyIn > 0)) return null;
  const chipsGesamt = a.spieler.reduce((s, p) => s + p.eingekauft, 0);
  const rebuys = a.startchips > 0
    ? Math.max(0, Math.round(chipsGesamt / a.startchips) - a.spieler.length)
    : 0;
  return { spieler: a.spieler.length, buyIn, rebuys, einheit: euro ? 'euro' : 'chips' };
}
