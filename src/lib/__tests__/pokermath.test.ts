/* Die Datenschnittstelle: Was der Generator schreibt, muss die App annehmen –
   und alles andere muss sie ablehnen.

   Geprüft wird gegen die ECHTEN Dateien aus public/pokermath/, nicht gegen
   erfundene. Ein Test mit selbstgebauten Daten würde nur prüfen, dass die
   Prüfung zu sich selbst passt. */

import { readFileSync, existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseB1, parseB2, parseB3, parseB4 } from '../pokermath/laden';
import { ERWARTETE_VERTRAG_VERSION } from '../pokermath/typen';

function lade(name: string): unknown | null {
  const pfad = `public/pokermath/${name}.json`;
  return existsSync(pfad) ? JSON.parse(readFileSync(pfad, 'utf8')) : null;
}

const B1 = lade('b1_outs');
const B2 = lade('b2_potodds');
const B3 = lade('b3_kombinatorik');
const B4 = lade('b4_preflop_equity');

describe('Die ausgelieferten Dateien werden angenommen', () => {
  it('B1 wird gelesen', () => {
    expect(B1, 'public/pokermath/b1_outs.json fehlt').not.toBeNull();
    const d = parseB1(B1);
    expect(d).not.toBeNull();
    expect(d!.outs.length).toBeGreaterThan(10);
    expect(d!.zugbilder.length).toBeGreaterThan(0);
    expect(d!.gegenbeispiele.length).toBeGreaterThan(0);
  });

  it('B2 wird gelesen', () => {
    const d = parseB2(B2);
    expect(d).not.toBeNull();
    expect(d!.einsatzgroessen.length).toBeGreaterThan(0);
  });

  it('B3 wird gelesen', () => {
    const d = parseB3(B3);
    expect(d).not.toBeNull();
    expect(d!.gesamt.zweikartenblaetter).toBeGreaterThan(0);
  });

  it.skipIf(B4 === null)('B4 wird gelesen, sobald es gerechnet ist', () => {
    const d = parseB4(B4);
    expect(d).not.toBeNull();
    expect(d!.matchups.length).toBeGreaterThan(0);
  });
});

describe('Die Annahmen kommen mit', () => {
  /* Eine Zahl ohne ihre Annahme ist bedeutungslos. Deshalb ist der
     Annahmenblock nicht optional – fehlt er, wird die Datei abgelehnt. */
  it.each([
    ['b1_outs', B1, parseB1],
    ['b2_potodds', B2, parseB2],
    ['b3_kombinatorik', B3, parseB3],
  ] as const)('%s trägt Sicht, Kartenzahl und Split-Regel', (_n, roh, parse) => {
    const d = parse(roh as never);
    expect(d!.annahmen.sicht).toContain('Heldensicht');
    expect(d!.annahmen.unbekannte_karten.length).toBeGreaterThan(20);
    expect(d!.annahmen.split_pot).toContain('0,5');
  });

  it('ohne Annahmenblock wird abgelehnt', () => {
    const kaputt = { ...(B1 as object), annahmen: undefined };
    expect(parseB1(kaputt)).toBeNull();
  });
});

describe('Der Vertrag wird durchgesetzt', () => {
  it('eine andere Vertragsversion wird abgelehnt', () => {
    const alt = { ...(B1 as object), vertrag_version: ERWARTETE_VERTRAG_VERSION + 1 };
    expect(parseB1(alt)).toBeNull();
    const zuAlt = { ...(B1 as object), vertrag_version: ERWARTETE_VERTRAG_VERSION - 1 };
    expect(parseB1(zuAlt)).toBeNull();
  });

  it('eine Datei im falschen Block wird abgelehnt', () => {
    // Sonst könnte b2 als b1 gelesen werden – und b1 hat kein `outs`.
    expect(parseB1(B2)).toBeNull();
    expect(parseB2(B1)).toBeNull();
    expect(parseB3(B1)).toBeNull();
  });

  it('eine unbekannte Methode wird abgelehnt', () => {
    expect(parseB1({ ...(B1 as object), methode: 'geschaetzt' })).toBeNull();
  });
});

describe('Unbrauchbare Werte fallen durch', () => {
  const zeilen = () => structuredClone(B1 as { outs: Record<string, number>[] });

  it('eine Wahrscheinlichkeit über eins wird abgelehnt', () => {
    const d = zeilen();
    d.outs[3].turn = 1.5;
    expect(parseB1(d)).toBeNull();
  });

  it('NaN und Infinity fallen durch', () => {
    for (const wert of [NaN, Infinity, -Infinity]) {
      const d = zeilen();
      d.outs[3].turn_oder_river = wert;
      expect(parseB1(d), String(wert)).toBeNull();
    }
  });

  it('zwei Straßen dürfen nie schlechter sein als eine', () => {
    /* Innere Stimmigkeit: Das ist keine Typprüfung, sondern eine Aussage über
       die Sache selbst. Eine Datei, die das verletzt, ist kaputt – auch wenn
       jeder Einzelwert für sich gültig aussieht. */
    const d = zeilen();
    d.outs[5].turn_oder_river = d.outs[5].turn / 2;
    expect(parseB1(d)).toBeNull();
  });

  it('eine fehlende Zeile lässt die ganze Datei durchfallen', () => {
    // Lieber keine Tabelle als eine mit stillschweigend fehlender Zeile.
    const d = structuredClone(B1 as { outs: unknown[] });
    d.outs[7] = { outs: 8 };
    expect(parseB1(d)).toBeNull();
  });

  it('eine nötige Equity über 50 % wird abgelehnt', () => {
    /* Mathematisch unmöglich: Der Gegner legt denselben Betrag hinein. Eine
       Datei, die das behauptet, hat einen Rechenfehler. */
    const d = structuredClone(B2 as { einsatzgroessen: Record<string, number>[] });
    d.einsatzgroessen[0].noetige_equity = 0.6;
    expect(parseB2(d)).toBeNull();
  });

  it('eine Blocker-Zeile, die nicht aufgeht, wird abgelehnt', () => {
    const d = structuredClone(B3 as {
      beispiel: { je_starthand: Record<string, number>[] };
    });
    d.beispiel.je_starthand[0].weggeblockt += 1;
    expect(parseB3(d)).toBeNull();
  });
});

describe('K3: Wo die Farbbeziehung zählt, müssen die Werte beiliegen', () => {
  it('ein gekennzeichnetes Matchup ohne Farbkonfigurationen wird abgelehnt', () => {
    /* Ist die Spanne erheblich, darf die App keinen Einzelwert ohne Hinweis
       zeigen. Fehlen die Konfigurationen, könnte sie das nicht – dann ist die
       Datei unbrauchbar und nicht bloß unvollständig. */
    const gebaut = {
      vertrag_version: ERWARTETE_VERTRAG_VERSION,
      block: 'b4_preflop_equity',
      methode: 'exakt',
      erzeugt_am: '2026-08-26T00:00:00+00:00',
      annahmen: { sicht: 'Heldensicht.', unbekannte_karten: 'Alle übrigen Karten gelten als unbekannt.', split_pot: 'Split zählt als 0,5.' },
      quelle: 'tools/poker-math/output/b4_preflop_equity.json',
      hinweis_zur_spanne: 'Bei gekennzeichneten Matchups die Spanne nennen.',
      matchups: [{ a: 'AKs', b: 'QJs', equity_a: 0.6, spanne_pp: 2.5, spanne_relevant: true }],
      befunde: [{ schluessel: 'x', aussage: 'Ein Satz.' }],
    };
    expect(parseB4(gebaut)).toBeNull();

    const mit = {
      ...gebaut,
      matchups: [{
        ...gebaut.matchups[0],
        farbkonfigurationen: [
          { beziehung: 'A suited, B suited, keine gemeinsame Farbe', haeufigkeit: 12, equity_a: 0.61 },
          { beziehung: 'A suited, B suited, gleiche Farbe', haeufigkeit: 4, equity_a: 0.585 },
        ],
      }],
    };
    expect(parseB4(mit)).not.toBeNull();
  });
});
