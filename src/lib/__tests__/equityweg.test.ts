/* Zwei Wege, dieselbe Zahl.
   ========================

   Die Equity wird auf zwei Wegen gerechnet: normalerweise in einem Web
   Worker, und wenn der ausfällt (Einzeldatei-Build, alte WebView, CSP)
   synchron im Hauptthread. Bis E-053 stand die Rechenzeile in beiden
   Dateien — buchstäblich zweimal derselbe Ausdruck.

   Solange beide gleich blieben, fiel das nicht auf. Wer eine davon geändert
   hätte, hätte je nach Browser verschiedene Zahlen bekommen, und die Zahl
   ist hier nicht Deko, sondern der Rat, den die App gibt: „Call" oder
   „Fold" hängt daran.

   Dieser Test hält fest, dass es nur eine Stelle gibt — und dass sie
   dieselben Aufträge gleich beantwortet. */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { rechneAuftraege, type EquityJob } from '../poker/equityProtocol';
import { parseCard } from '../poker/cards';

/** „AsAh" → zwei Karten. Lesbarer als 48 und 49. */
function hand(text: string): number[] {
  return (text.match(/../g) ?? []).map(parseCard);
}

const WORKER = readFileSync('src/lib/poker/equityWorker.ts', 'utf8');
const ASYNC = readFileSync('src/lib/poker/equityAsync.ts', 'utf8');

describe('Der Rechenweg für Equity', () => {
  it('steht nur an einer Stelle', () => {
    /* Weder der Worker noch der Rückfallweg rufen den Rechenkern selbst auf —
       beide gehen über `rechneAuftraege`. */
    for (const [name, quelle] of [['equityWorker.ts', WORKER], ['equityAsync.ts', ASYNC]] as const) {
      expect(quelle.includes('equityVsRandomHands'), `${name} rechnet selbst`).toBe(false);
      expect(quelle.includes('rechneAuftraege'), `${name} benutzt den gemeinsamen Weg nicht`).toBe(true);
    }
  });

  it('beantwortet einen Auftrag mit einer anzeigbaren Zahl', () => {
    /* AA gegen einen zufälligen Gegner liegt bei rund 85 %. Die Schranken
       sind weit — geprüft wird, dass überhaupt gerechnet wird und das
       Ergebnis im Bereich liegt, nicht die dritte Nachkommastelle. */
    const aa: EquityJob[] = [{ hero: hand('AsAh'), board: [], opponents: 1, iterations: 3000 }];
    const [wert] = rechneAuftraege(aa);
    expect(wert).toBeGreaterThan(0.75);
    expect(wert).toBeLessThan(0.95);
  });

  it('hält die Reihenfolge ein', () => {
    /* Der Worker antwortet mit einem Feld ohne Kennungen — die Zuordnung
       hängt allein an der Reihenfolge. Eine starke und eine schwache Hand
       nacheinander müssen also auch in dieser Reihenfolge zurückkommen. */
    const jobs: EquityJob[] = [
      { hero: hand('AsAh'), board: [], opponents: 1, iterations: 3000 },
      { hero: hand('7s2h'), board: [], opponents: 1, iterations: 3000 },
    ];
    const [stark, schwach] = rechneAuftraege(jobs);
    expect(stark).toBeGreaterThan(schwach + 0.2);
  });

  it('verträgt null Gegner, ohne Unsinn zu liefern', () => {
    /* `Math.max(1, opponents)` steht aus einem Grund da: Eine Equity gegen
       niemanden gibt es nicht, und 0 Gegner käme sonst als NaN heraus. */
    const [wert] = rechneAuftraege([{ hero: hand('AsAh'), board: [], opponents: 0, iterations: 500 }]);
    expect(Number.isFinite(wert)).toBe(true);
    expect(wert).toBeGreaterThan(0.5);
    expect(wert).toBeLessThanOrEqual(1);
  });

  it('gibt für eine leere Liste eine leere Liste', () => {
    expect(rechneAuftraege([])).toEqual([]);
  });
});
