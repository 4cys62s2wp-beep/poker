/* Die mittleren Ebenen tragen Inhalt, keine Beschreibung (E-042).
   =============================================================

   Was hier festgehalten wird, ist die Regel, nicht das Aussehen: Eine Zahl
   auf einer Kachel muss aus denselben Daten kommen wie die Seite dahinter.
   Eine Vorschau, die etwas anderes behauptet als das Ziel, ist schlimmer
   als gar keine — sie kostet Vertrauen in alle anderen auch. */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  OUTS_FLUSHDRAW, OUTS_GUTSHOT, chanceEineKarte, chanceZweiKarten,
} from '../poker/outs';
import { RFI_CHARTS } from '../../content/ranges';
import { expandRangeSpec, matrixLabel, rangePercent } from '../poker/ranges';
import glossary from '../../content/glossary';
import { TELLS } from '../../content/tells';

describe('Die Verbesserungschancen stehen an einer Stelle', () => {
  it('rechnet mit den Nennern nach dem Flop und nach dem Turn', () => {
    /* Nach dem Flop kennt man fünf Karten, also sind 47 unbekannt; nach dem
       Turn 46. Zwei Nenner, zwei Formeln. */
    expect(chanceEineKarte(9)).toBeCloseTo(9 / 46, 10);
    expect(chanceZweiKarten(9)).toBeCloseTo(1 - (38 / 47) * (37 / 46), 10);
  });

  it('liefert die beiden Zahlen, nach denen am häufigsten gefragt wird', () => {
    /* Flushdraw ~35 %, Gutshot ~17 % bis zum River — die Faustzahlen, die
       auch auf der Kachel stehen. */
    expect(Math.round(chanceZweiKarten(OUTS_FLUSHDRAW) * 100)).toBe(35);
    expect(Math.round(chanceZweiKarten(OUTS_GUTSHOT) * 100)).toBe(16);
  });

  it('steht nur einmal im Quelltext', () => {
    /* Die Odds-Tabelle hatte dieselben zwei Formeln als eigene Abschrift.
       Zwei Abschriften laufen auseinander — und dann behauptet die Kachel
       eine andere Zahl als die Tabelle dahinter. */
    const tabelle = readFileSync('src/pages/tools/OddsTables.tsx', 'utf8');
    expect(tabelle).toContain("from '../../lib/poker/outs'");
    expect(tabelle).not.toMatch(/function\s+(oneCard|twoCards)\s*\(/);
  });
});

describe('Die Kacheln zeigen, was hinter ihnen liegt', () => {
  const SEITE = readFileSync('src/pages/ReferencePage.tsx', 'utf8');

  it('nimmt die Zahlen aus den Daten, nicht aus dem Text', () => {
    /* Der Prüfpunkt: Keine der Zahlen auf einer Kachel darf im Quelltext
       der Seite als Ziffernfolge stehen. Sonst ist die Vorschau eine
       Behauptung, die beim nächsten neuen Begriff still falsch wird. */
    expect(SEITE).toContain('content.glossary.length');
    expect(SEITE).toContain('content.tells.length');
    expect(SEITE).toContain('RFI_CHARTS');
    expect(SEITE).toContain('chanceZweiKarten');
  });

  it('hat für jede Zahl auch wirklich Daten', () => {
    expect(glossary.length).toBeGreaterThan(100);
    expect(TELLS.length).toBeGreaterThan(10);
    expect(RFI_CHARTS.length).toBeGreaterThan(1);
  });

  it('rechnet den Anteil einer Range in Prozent, nicht als Anteil', () => {
    /* Beim ersten Versuch stand auf der Kachel „Button eröffnet 0 %":
       `rangePercent` liefert einen Anteil zwischen 0 und 1, gerundet also
       null. Der Fehler war im Bild sofort zu sehen und im Quelltext gar
       nicht — deshalb steht er hier. */
    const btn = RFI_CHARTS.find((c) => c.position === 'BTN');
    expect(btn, 'BTN-Chart fehlt').toBeDefined();
    const anteil = rangePercent(expandRangeSpec(btn!.raise));
    expect(anteil).toBeGreaterThan(0);
    expect(anteil).toBeLessThanOrEqual(1);
    expect(Math.round(anteil * 100)).toBeGreaterThan(20);
    expect(SEITE).toContain('rangePercent(range) * 100');
  });
});

describe('Das Mini-Raster zeigt denselben Ausschnitt wie die große Matrix', () => {
  it('läuft über alle 169 Felder in derselben Anordnung', () => {
    const felder = Array.from({ length: 169 }, (_, i) => matrixLabel(Math.floor(i / 13), i % 13));
    expect(new Set(felder).size).toBe(169);
    /* Oben links das stärkste Paar, unten rechts das schwächste — dieselbe
       Ecke wie in der großen Matrix. */
    expect(felder[0]).toBe('AA');
    expect(felder[168]).toBe('22');
  });

  it('markiert genau die Hände der Range', () => {
    const range = expandRangeSpec(['QQ+', 'AKs']);
    const an = Array.from({ length: 169 }, (_, i) => matrixLabel(Math.floor(i / 13), i % 13))
      .filter((l) => range.has(l));
    expect(an.sort()).toEqual(['AA', 'AKs', 'KK', 'QQ']);
  });
});
