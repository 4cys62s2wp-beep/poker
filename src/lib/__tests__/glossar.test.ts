/* Antippbare Fachbegriffe (FAHRPLAN 5.6). */

import { describe, expect, it } from 'vitest';
import { baueIndex, findeEintrag, zerlege } from '../glossar/verknuepfen';
import { ALL_MODULES } from '../../content';
import DE from '../../content/glossary';
import EN from '../../content/en/glossary';

const index = baueIndex(DE);

describe('Ein fett gesetzter Begriff findet seinen Eintrag', () => {
  it('direkt', () => {
    expect(findeEintrag(index, 'Implied Odds')?.term).toBe('Implied Odds');
    expect(findeEintrag(index, 'fold equity')?.term).toBe('Fold Equity');
  });

  it('über Abkürzungen und andere Schreibweisen', () => {
    expect(findeEintrag(index, 'UTG')?.term).toBe('Under the Gun');
    expect(findeEintrag(index, '3-Bet')?.term).toBe('Three-Bet');
    expect(findeEintrag(index, 'Dealer-Button')?.term).toBe('Button');
    expect(findeEintrag(index, 'Out of Position (OOP)')?.term).toBe('Position');
  });

  it('mit Mehrzahl und Satzzeichen', () => {
    expect(findeEintrag(index, 'Big Blinds')?.term).toBe('Big Blind');
    expect(findeEintrag(index, 'Semi-Bluff:')?.term).toBe('Semi-Bluff');
  });

  it('findet nichts für einen Satz, der kein Begriff ist', () => {
    expect(findeEintrag(index, 'genau zwei')).toBeNull();
    expect(findeEintrag(index, '40–50 %')).toBeNull();
    expect(findeEintrag(index, '')).toBeNull();
  });
});

describe('Die Abkürzungen zeigen auf Einträge, die es gibt', () => {
  it('in beiden Sprachen', () => {
    for (const glossar of [DE, EN]) {
      const idx = baueIndex(glossar);
      for (const alias of ['utg', '3-bet', '4-bet', 'btn', 'sb', 'bb', 'co', 'hj', 'ip', 'oop', 'split pot', 'polar']) {
        expect(idx.get(alias), alias).toBeDefined();
      }
    }
  });
});

describe('In den Lektionen sind deutlich mehr Begriffe antippbar als vorher', () => {
  it('verknüpft mindestens 150 der fett gesetzten Begriffe', () => {
    /* Vorher: 0 von 858. Mit exakten Treffern allein 104. */
    let treffer = 0;
    for (const m of ALL_MODULES) {
      for (const l of m.lessons) {
        for (const s of l.sections) {
          for (const t of [s.body, s.example ?? '', s.tip ?? '']) {
            for (const mt of t.matchAll(/\*\*(.+?)\*\*/g)) if (findeEintrag(index, mt[1])) treffer += 1;
          }
        }
      }
    }
    expect(treffer).toBeGreaterThanOrEqual(150);
  });
});

describe('Fließtext ohne Markierung', () => {
  it('verknüpft das erste Vorkommen eines Fachbegriffs', () => {
    const s = zerlege('Ein Semi-Bluff nutzt Fold Equity und Implied Odds, ein Semi-Bluff eben.', DE, 5);
    const links = s.filter((x) => x.eintrag).map((x) => x.eintrag!.term);
    expect(links).toEqual(['Semi-Bluff', 'Fold Equity', 'Implied Odds']);
  });

  it('verknüpft jeden Begriff nur einmal je Text', () => {
    const s = zerlege('Semi-Bluff, Semi-Bluff, Semi-Bluff.', DE);
    expect(s.filter((x) => x.eintrag)).toHaveLength(1);
  });

  it('begrenzt die Zahl der Verknüpfungen je Text', () => {
    const s = zerlege('Semi-Bluff, Fold Equity, Implied Odds, Squeeze, Overbet.', DE, 2);
    expect(s.filter((x) => x.eintrag)).toHaveLength(2);
  });

  it('lässt Grundwörter in Ruhe', () => {
    const s = zerlege('Du callst, foldest, checkst und raist auf dem Flop am Turn.', DE, 5);
    expect(s.filter((x) => x.eintrag)).toHaveLength(0);
  });

  it('verliert beim Zerlegen keinen Buchstaben', () => {
    const text = 'Der Semi-Bluff hat Fold Equity — und ein „Squeeze“ ist selten.';
    expect(zerlege(text, DE, 5).map((x) => x.text).join('')).toBe(text);
  });

  it('erkennt deutsche Endungen am Begriff', () => {
    const s = zerlege('Mehrere Semi-Bluffs kosten Geld.', DE);
    expect(s.find((x) => x.eintrag)?.text).toBe('Semi-Bluffs');
  });

  it('verknüpft nichts mitten in einem Wort', () => {
    const s = zerlege('Das Wort Squeezebox ist kein Begriff.', DE);
    expect(s.filter((x) => x.eintrag)).toHaveLength(0);
  });
});
