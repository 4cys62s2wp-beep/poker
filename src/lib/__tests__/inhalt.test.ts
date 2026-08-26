/* Die Zahlen im Lehrtext gegen die gerechneten Daten.
   ==================================================

   Das ganze Projekt ist gegen einen Fehler gebaut: gegen die Tabellen im
   Netz, die einander widersprechen, weil irgendwann jemand eine Zahl
   abgeschrieben und dabei die Annahme weggelassen hat.

   Der Lehrtext dieser App enthält genau solche Zahlen — „9 Outs × 4 = 36 %,
   exakt sind es 35,0 %". Bisher standen sie da, weil sie beim Schreiben
   richtig waren. Ab jetzt stehen sie da, weil ein Test sie gegen
   `public/pokermath/b1_outs.json` hält: dieselbe Datei, aus der die
   Trainer ihre Zahlen nehmen.

   Was der Test nicht kann: beurteilen, ob ein Satz **sinnvoll** ist. Er
   prüft, ob die Zahl darin zu einer gerechneten passt — und das ist genau
   die Stelle, an der die widersprüchlichen Tabellen entstehen. */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

interface OutsZeile {
  outs: number;
  turn: number;
  river_nach_fehlschlag: number;
  turn_oder_river: number;
  regel_zwei_karten: number;
}

const B1 = JSON.parse(readFileSync('public/pokermath/b1_outs.json', 'utf8')) as {
  outs: OutsZeile[];
};
const NACH_OUTS = new Map(B1.outs.map((z) => [z.outs, z]));

/** Alle Inhaltsdateien, deutsch wie englisch, als ein Text. */
function inhaltstext(): string {
  const teile: string[] = [];
  const sammle = (verzeichnis: string) => {
    for (const eintrag of readdirSync(verzeichnis)) {
      const pfad = join(verzeichnis, eintrag);
      if (statSync(pfad).isDirectory()) sammle(pfad);
      else if (/\.tsx?$/.test(eintrag)) teile.push(readFileSync(pfad, 'utf8'));
    }
  };
  sammle('src/content');
  return teile.join('\n');
}

const TEXT = inhaltstext();

/** „9 Outs × 4 = 36 % … exakt: 35,0 %" — Faustregel und exakter Wert in einem Satz. */
const BEHAUPTUNG = /(\d{1,2})\s*(?:Outs?|outs)?\s*[×x*]\s*([24])\s*(?:=|ergibt)([^\n]{0,60}?)(?:[Ee]xakt|exact)[^\n]{0,45}?(\d{1,2}[.,]\d)\s*%/g;

interface Fund {
  outs: number;
  faktor: number;
  behauptet: number;
  passt_zu: string[];
}

function funde(): Fund[] {
  const gefunden: Fund[] = [];
  for (const m of TEXT.matchAll(BEHAUPTUNG)) {
    const outs = Number(m[1]);
    const zeile = NACH_OUTS.get(outs);
    const behauptet = Number(m[4].replace(',', '.'));
    const kandidaten: Record<string, number> = zeile
      ? {
        turn: zeile.turn * 100,
        river: zeile.river_nach_fehlschlag * 100,
        'turn oder river': zeile.turn_oder_river * 100,
      }
      : {};
    gefunden.push({
      outs,
      faktor: Number(m[2]),
      behauptet,
      /* Auf ein Zehntel gerundet steht die Zahl im Text — mehr Genauigkeit
         wäre am Tisch ohnehin nicht zu gebrauchen. */
      passt_zu: Object.entries(kandidaten)
        .filter(([, wert]) => Math.abs(wert - behauptet) < 0.06)
        .map(([name]) => name),
    });
  }
  return gefunden;
}

const FUNDE = funde();

describe('Der Lehrtext behauptet nichts über Wahrscheinlichkeiten, was nicht gerechnet ist', () => {
  it('findet überhaupt Behauptungen — sonst prüft dieser Test nichts', () => {
    /* Eine Prüfung, die nach einer Umformulierung stillschweigend null
       Behauptungen findet, ist schlimmer als keine: Sie ist grün. */
    expect(FUNDE.length).toBeGreaterThanOrEqual(12);
  });

  it.each(FUNDE.map((f, i) => [`${i + 1}. ${f.outs} Outs → ${f.behauptet} %`, f]))(
    '%s steht so in den gerechneten Daten',
    (_name, f) => {
      const zeile = NACH_OUTS.get((f as Fund).outs);
      expect(zeile, `Für ${(f as Fund).outs} Outs gibt es keine gerechnete Zeile`).toBeDefined();
      expect((f as Fund).passt_zu.length, `${(f as Fund).behauptet} % passt zu keinem der `
        + `gerechneten Werte: Turn ${(zeile!.turn * 100).toFixed(1)} %, `
        + `River ${(zeile!.river_nach_fehlschlag * 100).toFixed(1)} %, `
        + `beide ${(zeile!.turn_oder_river * 100).toFixed(1)} %`).toBeGreaterThan(0);
    },
  );

  it('rechnet die Faustregel selbst richtig vor', () => {
    /* „9 × 4 = 36 %" ist eine Multiplikation, keine Meinung. */
    for (const m of TEXT.matchAll(/(\d{1,2})\s*(?:Outs?|outs)?\s*[×x*]\s*([24])\s*=\s*(\d{1,3})\s*%/g)) {
      const [, outs, faktor, ergebnis] = m;
      expect(Number(ergebnis), `${outs} × ${faktor}`).toBe(Number(outs) * Number(faktor));
    }
  });

  it('nennt in der Outs-Tabelle dieselben Werte wie die Daten', () => {
    /* Zeilen der Form ['4 (Gutshot)', '16 %', '16,5 %'] — Faustregel und
       exakter Wert nebeneinander. */
    const zeilen = [...TEXT.matchAll(
      /\['(\d{1,2})[^']*',\s*'(\d{1,3})\s*%',\s*'(\d{1,2}[.,]\d)\s*%'\]/g,
    )];
    expect(zeilen.length, 'Keine Tabellenzeile gefunden').toBeGreaterThanOrEqual(2);
    for (const [, outs, regel, exakt] of zeilen) {
      const zeile = NACH_OUTS.get(Number(outs));
      expect(zeile, `${outs} Outs`).toBeDefined();
      expect(Number(regel), `Regel von 4 bei ${outs} Outs`).toBe(Number(outs) * 4);
      expect(Number(exakt.replace(',', '.')), `exakter Wert bei ${outs} Outs`)
        .toBeCloseTo(zeile!.turn_oder_river * 100, 1);
    }
  });

  it('rechnet auch die Korrekturformel richtig vor', () => {
    /* „Bei mehr als 8 Outs: (Outs × 4) − (Outs − 8)" — die Beispiele dazu
       müssen der Formel folgen, sonst lernt jemand eine falsche Abkürzung. */
    const beispiele = [...TEXT.matchAll(/(\d{1,2}) Outs: (\d{1,3}) [−-] (\d{1,2}) = (\d{1,3})\s*%/g)];
    expect(beispiele.length).toBeGreaterThanOrEqual(2);
    for (const [, outs, vier, abzug, ergebnis] of beispiele) {
      const n = Number(outs);
      expect(Number(vier), `${n} × 4`).toBe(n * 4);
      expect(Number(abzug), `${n} − 8`).toBe(n - 8);
      expect(Number(ergebnis), `${n}: ${vier} − ${abzug}`).toBe(Number(vier) - Number(abzug));
    }
  });
});
