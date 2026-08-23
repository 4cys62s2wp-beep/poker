// Validiert die datengetriebenen Inhalte: Szenarien, Push/Fold-Charts, Module.

import { describe, expect, it } from 'vitest';
import { parseCard } from '../cards';
import { expandRangeSpec, rangePercent } from '../ranges';
import { SCENARIOS } from '../../../content/scenarios';
import { PUSH_CHARTS } from '../../../content/pushfold';
import { ALL_MODULES } from '../../../content';

describe('Szenarien', () => {
  it('haben eindeutige IDs', () => {
    const ids = SCENARIOS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('haben genau eine beste Option und mindestens 3 Optionen', () => {
    for (const s of SCENARIOS) {
      expect(s.options.length, s.id).toBeGreaterThanOrEqual(3);
      expect(s.options.filter((o) => o.quality === 'best').length, s.id).toBe(1);
      for (const o of s.options) {
        expect(o.explanation.length, `${s.id}: ${o.label}`).toBeGreaterThan(40);
      }
    }
  });

  it('haben gültige Karten ohne Duplikate', () => {
    for (const s of SCENARIOS) {
      const all = [...s.heroCards, ...s.board].map((c) => parseCard(c));
      expect(new Set(all).size, s.id).toBe(all.length);
      expect(s.heroCards.length, s.id).toBe(2);
      expect([0, 3, 4, 5].includes(s.board.length), s.id).toBe(true);
    }
  });
});

describe('Push/Fold-Charts', () => {
  it('expandieren fehlerfrei und werden zur späten Position breiter', () => {
    for (const stack of ['10bb', '5bb'] as const) {
      const charts = PUSH_CHARTS.filter((c) => c.stack === stack);
      const order = ['UTG', 'HJ', 'CO', 'BTN', 'SB'];
      let prev = 0;
      for (const pos of order) {
        const chart = charts.find((c) => c.position === pos)!;
        const pct = rangePercent(expandRangeSpec(chart.push));
        expect(pct, `${stack} ${pos}`).toBeGreaterThan(prev);
        prev = pct;
      }
    }
  });

  it('5bb-Ranges sind breiter als 10bb-Ranges', () => {
    for (const pos of ['UTG', 'HJ', 'CO', 'BTN', 'SB'] as const) {
      const p10 = rangePercent(expandRangeSpec(PUSH_CHARTS.find((c) => c.stack === '10bb' && c.position === pos)!.push));
      const p5 = rangePercent(expandRangeSpec(PUSH_CHARTS.find((c) => c.stack === '5bb' && c.position === pos)!.push));
      expect(p5, pos).toBeGreaterThan(p10);
    }
  });
});

describe('Module', () => {
  it('alle 8 Module mit gültigen Lektionen, Quizfragen und Karten', () => {
    expect(ALL_MODULES.length).toBe(8);
    const lessonIds = new Set<string>();
    for (const m of ALL_MODULES) {
      expect(m.lessons.length).toBeGreaterThanOrEqual(5);
      for (const l of m.lessons) {
        expect(lessonIds.has(l.id), l.id).toBe(false);
        lessonIds.add(l.id);
        expect(l.sections.length, l.id).toBeGreaterThanOrEqual(3);
        expect(l.quiz.length, l.id).toBeGreaterThanOrEqual(4);
        for (const q of l.quiz) {
          expect(q.correctIndex, l.id).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex, l.id).toBeLessThan(q.options.length);
        }
        for (const sec of l.sections) {
          for (const c of sec.cards ?? []) {
            expect(() => parseCard(c), `${l.id}: ${c}`).not.toThrow();
          }
        }
      }
    }
  });
});
