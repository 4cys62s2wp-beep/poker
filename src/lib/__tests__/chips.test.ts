import { describe, expect, it } from 'vitest';
import { planChips, type ChipInput } from '../chips';

function chip(id: string, count: number, value?: number): ChipInput {
  return { id, label: id, color: '#fff', count, value };
}

describe('planChips', () => {
  const KOFFER_300 = [chip('weiss', 100), chip('rot', 100), chip('blau', 50), chip('gruen', 25), chip('schwarz', 25)];

  it('häufigste Sorte bekommt den kleinsten Wert', () => {
    const plan = planChips(4, KOFFER_300)!;
    const weiss = plan.chips.find((c) => c.id === 'weiss')!;
    const schwarz = plan.chips.find((c) => c.id === 'schwarz')!;
    expect(weiss.value).toBe(5);
    expect(schwarz.value).toBeGreaterThan(weiss.value);
    // Ausgabe ist aufsteigend nach Wert sortiert
    const values = plan.chips.map((c) => c.value);
    expect([...values].sort((a, b) => a - b)).toEqual(values);
  });

  it('teilt gleichmäßig auf und legt den Rest in die Bank', () => {
    const plan = planChips(4, KOFFER_300)!;
    for (const a of plan.chips) {
      const original = KOFFER_300.find((c) => c.id === a.id)!;
      expect(a.perPlayer * 4 + a.leftover).toBe(original.count);
      expect(a.leftover).toBeLessThan(4);
    }
    // 25er-Sorten: 6 pro Spieler, 1 übrig
    expect(plan.chips.find((c) => c.id === 'gruen')!.perPlayer).toBe(6);
    expect(plan.chips.find((c) => c.id === 'gruen')!.leftover).toBe(1);
  });

  it('Blinds: BB ist gerades Vielfaches des kleinsten Chips, SB = BB/2, Stack 40–150 BB', () => {
    for (const players of [2, 4, 6, 9]) {
      const plan = planChips(players, KOFFER_300)!;
      const smallest = plan.chips[0].value;
      expect(plan.bigBlind % (smallest * 2)).toBe(0);
      expect(plan.smallBlind * 2).toBe(plan.bigBlind);
      expect(plan.stackBB).toBeGreaterThanOrEqual(40);
      expect(plan.stackBB).toBeLessThanOrEqual(150);
    }
  });

  it('Blind-Fahrplan beginnt bei den Start-Blinds und steigt monoton', () => {
    const plan = planChips(5, KOFFER_300)!;
    expect(plan.levels[0].bb).toBe(plan.bigBlind);
    for (let i = 1; i < plan.levels.length; i++) {
      expect(plan.levels[i].bb).toBeGreaterThan(plan.levels[i - 1].bb);
    }
    expect(plan.levels[plan.levels.length - 1].bb).toBeGreaterThanOrEqual(plan.stackValue / 3);
  });

  it('manuelle Werte werden respektiert', () => {
    const plan = planChips(3, [chip('a', 90, 10), chip('b', 60), chip('c', 30)])!;
    expect(plan.chips.find((c) => c.id === 'a')!.value).toBe(10);
  });

  it('eine einzige Chipsorte funktioniert (Wert 1, BB 2)', () => {
    const plan = planChips(4, [chip('nur', 200)])!;
    expect(plan.chips[0].value).toBe(1);
    expect(plan.chips[0].perPlayer).toBe(50);
    expect(plan.bigBlind).toBe(2);
    expect(plan.stackBB).toBe(25);
  });

  it('ungültige Eingaben ergeben null statt Absturz', () => {
    expect(planChips(1, KOFFER_300)).toBeNull();
    expect(planChips(4, [])).toBeNull();
    expect(planChips(4, [chip('leer', 0)])).toBeNull();
    expect(planChips(10, [chip('mini', 5)])).toBeNull();
  });

  it('warnt bei wenigen kleinen Chips und kurzen Stacks', () => {
    const plan = planChips(8, [chip('weiss', 40), chip('rot', 40)])!;
    expect(plan.warnings.length).toBeGreaterThan(0);
  });
});
