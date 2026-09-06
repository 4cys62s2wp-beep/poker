/* „5,9 % (1 von 16)" — eines von beiden ist falsch.
   ================================================

   Der Odds-Spickzettel schreibt hinter manche Prozentzahl eine Häufigkeit:
   „0,45 % (1 von 221)". Zwei Schreibweisen sind dabei üblich, und sie
   unterscheiden sich um genau eins:

   - **Kehrwert** („1 von N", englisch „1 in N"): N = 1/p. Ein bestimmtes
     Paar kommt in einer von 221 Händen.
   - **Gegenquote** („N : 1"): N = (1−p)/p. Gegen ein bestimmtes Paar stehen
     die Chancen 220 zu 1.

   Bis E-056 stand in dieser Tabelle beides durcheinander — unter derselben
   Beschriftung. Gerechnet:

   | Zeile | Prozent | 1/p | Gegenquote | stand da |
   |---|---|---|---|---|
   | Ein bestimmtes Paar | 0,45 % | **221** | 220 | 221 ✓ |
   | Irgendein Pocket Pair | 5,9 % | **17** | 16 | 16 ✗ |
   | AK | 1,2 % | **83** | 81,9 | 82 ✗ |
   | Set am Flop | 11,8 % | **8,5** | 7,5 | 7,5 ✗ |

   Im Deutschen ließ sich „1 zu 16" noch als Gegenquote lesen. Die englische
   Fassung schrieb „1 in 16", und das heißt eindeutig Kehrwert — dort waren
   drei von vier Zeilen schlicht falsch.

   Genau dagegen ist dieses Projekt gebaut: gegen Tabellen, die einander
   widersprechen, weil jemand die Annahme weggelassen hat. Dass es die eigene
   Tabelle traf, macht den Fall nicht kleiner.

   Dieser Test braucht kein Poker-Wissen. Er nimmt die Prozentzahl aus der
   Zelle und prüft, ob die Zahl daneben ihr Kehrwert ist. */

import { describe, expect, it } from 'vitest';
import { STR } from '../../i18n/pages/oddstables';
import { ALL_MODULES } from '../../content/index';
import { EN_BUNDLE } from '../../content/en/index';

interface Behauptung {
  sprache: string;
  zeile: string;
  prozent: number;
  genannt: number;
}

/** „5,9 % (1 von 17)" → { prozent: 5.9, genannt: 17 } */
function lies(sprache: string, ereignis: string, zelle: string): Behauptung | null {
  const p = zelle.match(/(\d{1,3}(?:[.,]\d+)?)\s*%/);
  const n = zelle.match(/1\s*(?:von|in)\s*(\d{1,4}(?:[.,]\d+)?)/);
  if (!p || !n) return null;
  return {
    sprache,
    zeile: ereignis,
    prozent: Number(p[1].replace(',', '.')),
    genannt: Number(n[1].replace(',', '.')),
  };
}

/** Jede Zeichenkette aus einem Lernbündel, flach. */
function texte(wert: unknown, aus: string[] = []): string[] {
  if (typeof wert === 'string') aus.push(wert);
  else if (Array.isArray(wert)) for (const w of wert) texte(w, aus);
  else if (wert && typeof wert === 'object') for (const w of Object.values(wert)) texte(w, aus);
  return aus;
}

/* Dieselbe Prüfung gilt für den Lehrtext: Dort stand sie von Anfang an
   richtig („knapp 6 %, also etwa 1 zu 17"), während die Nachschlagetabelle
   zwei Tipps weiter 1 zu 16 zeigte. Beide Orte prüfen heißt: Sie können
   sich nicht mehr widersprechen. */
const AUS_TEXTEN: Behauptung[] = [
  ...ALL_MODULES.flatMap((m) => texte(m).map((t) => ['de', t] as const)),
  ...EN_BUNDLE.modules.flatMap((m) => texte(m).map((t) => ['en', t] as const)),
].flatMap(([sprache, t]) =>
  [...t.matchAll(/(\d{1,3}(?:[.,]\d+)?)\s*%\s*\((?:1\s*(?:zu|von|in)\s*)(\d{1,4}(?:[.,]\d+)?)\)/g)]
    .map((m) => ({
      sprache,
      zeile: t.slice(Math.max(0, (m.index ?? 0) - 40), (m.index ?? 0) + 30).replace(/\n/g, ' '),
      prozent: Number(m[1].replace(',', '.')),
      genannt: Number(m[2].replace(',', '.')),
    })));

const BEHAUPTUNGEN: Behauptung[] = [
  ...(['de', 'en'] as const).flatMap((sprache) =>
    STR[sprache].preflopProbs
      .map(([ereignis, wert]) => lies(sprache, ereignis, wert))
      .filter((b): b is Behauptung => b !== null)),
  ...AUS_TEXTEN,
];

describe('Häufigkeiten im Odds-Spickzettel', () => {
  it('findet überhaupt welche — sonst prüft dieser Test nichts', () => {
    expect(BEHAUPTUNGEN.length).toBeGreaterThanOrEqual(14);
  });

  it.each(BEHAUPTUNGEN.map((b) => [`${b.sprache}: ${b.zeile} — ${b.prozent} % / 1 von ${b.genannt}`, b]))(
    '%s ist der Kehrwert und nicht die Gegenquote',
    (_name, roh) => {
      const b = roh as Behauptung;
      const kehrwert = 100 / b.prozent;
      const gegenquote = (100 - b.prozent) / b.prozent;
      /* Die Prozentzahl ist selbst schon gerundet; die Toleranz muss diese
         Rundung tragen, aber nicht den Unterschied von eins zwischen den
         beiden Schreibweisen verschlucken. */
      const spielraum = Math.max(0.6, kehrwert * 0.012);
      expect(
        Math.abs(kehrwert - b.genannt),
        `„1 von ${b.genannt}" — Kehrwert wäre ${kehrwert.toFixed(1)}, `
        + `die Gegenquote ${gegenquote.toFixed(1)}. Beides steht sonst `
        + 'durcheinander in derselben Tabelle.',
      ).toBeLessThanOrEqual(spielraum);
    },
  );

  it('erkennt eine Gegenquote, die als Kehrwert ausgegeben wird', () => {
    /* Die Gegenprobe: der alte Wert 16 bei 5,9 % muss durchfallen. */
    const alt = lies('de', 'Probe', '5,9 % (1 von 16)')!;
    const kehrwert = 100 / alt.prozent;
    expect(Math.abs(kehrwert - alt.genannt)).toBeGreaterThan(Math.max(0.6, kehrwert * 0.012));
  });
});
