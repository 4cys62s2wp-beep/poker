/* Kleinigkeiten rund um die Bankroll-Liste.
   =========================================

   Eigene Datei, weil beide Stücke reine Rechnung sind und deshalb getestet
   werden können, was in einer Seite voller Oberfläche nicht geht. */

import type { Abend } from './session/abende';
import { abrechne } from './session/abrechnung';

/** Heute als „2026-10-04" — nach der Uhr des Geräts, nicht nach UTC.
 *
 *  `new Date().toISOString().slice(0, 10)` rechnet in UTC. Wer zwischen
 *  Mitternacht und zwei Uhr nachts in Deutschland einen Abend einträgt,
 *  bekäme den Vortag vorbelegt — und trüge ihn, ohne es zu merken, auf den
 *  falschen Tag ein. */
export function heuteIso(jetzt: Date = new Date()): string {
  const zwei = (n: number) => String(n).padStart(2, '0');
  return `${jetzt.getFullYear()}-${zwei(jetzt.getMonth() + 1)}-${zwei(jetzt.getDate())}`;
}

/** „2026-10-02" als „2. Okt. 2026" — in der Sprache der Oberfläche.
 *  Ein unlesbares Datum kommt unverändert zurück, statt „Invalid Date" zu
 *  zeigen. */
export function datumAnzeigen(iso: string, sprache: 'de' | 'en'): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  /* Aus den Teilen gebaut statt `new Date(iso)`: Der Text wird als UTC
     gelesen und läge westlich von Greenwich auf dem Vortag. */
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(sprache === 'de' ? 'de-DE' : 'en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

/** Was aus einem Abend in die Bankroll übernommen wird. */
export interface Vorbelegung {
  date: string;
  type: 'live';
  buyIn: number;
  cashOut: number;
  minutes: number;
}

/**
 * Die Bankroll-Zeile eines Spielers aus einem gespeicherten Abend: Einzahlung
 * und Auszahlung in Euro, Dauer in Minuten.
 *
 * Gibt `null` zurück, wenn der Abend kein Geld kennt (Spielgeld) oder die
 * Prüfsumme nicht stimmt — eine Zeile aus einer Abrechnung, die nicht
 * aufgeht, wäre eine falsche Zahl in einer Liste, die ehrlich sein soll.
 */
export function vorbelegungAusAbend(abend: Abend, name: string): Vorbelegung | null {
  const a = abrechne(abend);
  if (!a || a.pruefung.abweichung !== 0) return null;
  const z = a.zeilen.find((x) => x.name === name);
  if (!z) return null;
  return {
    date: heuteIso(new Date(abend.begonnen)),
    type: 'live',
    buyIn: z.eingezahlt,
    cashOut: z.ausgezahlt,
    minutes: Math.max(1, Math.round(abend.gespielt_ms / 60000)),
  };
}
