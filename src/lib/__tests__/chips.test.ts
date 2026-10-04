import { describe, expect, it } from 'vitest';
import { planChips, type ChipInput } from '../chips';
import { verteile, type Sorte } from '../live/verteilung';
import { baueStruktur } from '../live/blinds';

function chip(id: string, count: number): ChipInput {
  return { id, label: id, color: '#ffffff', count };
}

describe('planChips — ein Adapter auf dieselbe Rechnung wie „Abend einrichten" (FAHRPLAN 7.10)', () => {
  const KOFFER = [chip('weiss', 150), chip('rot', 100), chip('gruen', 50)];
  const SORTEN: Sorte[] = [
    { name: 'weiss', anzahl: 150 }, { name: 'rot', anzahl: 100 }, { name: 'gruen', anzahl: 50 },
  ];

  it('liefert für denselben Koffer dieselben Werte wie verteile() und baueStruktur()', () => {
    /* Der gemessene Fehler: Weiß 5, Stack 1.650, Blinds 10/20 hier — Weiß 1,
       Stack 380, Blinds 1/2 dort. */
    const plan = planChips(5, KOFFER)!;
    const v = verteile({ sorten: SORTEN, spieler: 5 })!;
    expect(plan.stackValue).toBe(v.startchips);
    expect(plan.smallBlind).toBe(v.smallBlind);
    expect(plan.bigBlind).toBe(v.bigBlind);
    for (const s of v.sorten) {
      const a = plan.chips.find((c) => c.id === s.name)!;
      expect(a.value, s.name).toBe(s.wert);
      expect(a.perPlayer, s.name).toBe(s.jeSpieler);
      expect(a.leftover, s.name).toBe(s.uebrig);
    }
    const struktur = baueStruktur({
      dauer_min: 150, startchips: v.startchips, spieler: 5, kleinsterChip: v.smallBlind, tempo: 'normal',
    });
    expect(plan.levels.map((l) => [l.sb, l.bb])).toEqual(struktur.stufen.map((s) => [s.sb, s.bb]));
  });

  it('beginnt bei Weiß 1, Stack 380 und Blinds 1/2 — nicht bei 10/20', () => {
    const plan = planChips(5, KOFFER)!;
    expect(plan.chips.find((c) => c.id === 'weiss')!.value).toBe(1);
    expect(plan.stackValue).toBe(380);
    expect([plan.smallBlind, plan.bigBlind]).toEqual([1, 2]);
  });

  it('die häufigste Sorte bekommt den kleinsten Wert, die Ausgabe steigt', () => {
    const plan = planChips(4, [chip('rot', 100), chip('weiss', 200), chip('blau', 50)])!;
    expect(plan.chips[0].id).toBe('weiss');
    const werte = plan.chips.map((c) => c.value);
    expect([...werte].sort((a, b) => a - b)).toEqual(werte);
  });

  it('teilt gleichmäßig auf und legt den Rest in die Bank', () => {
    const plan = planChips(4, KOFFER)!;
    for (const a of plan.chips) {
      const original = KOFFER.find((c) => c.id === a.id)!;
      expect(a.perPlayer * 4 + a.leftover).toBe(original.count);
      expect(a.leftover).toBeLessThan(4);
    }
  });

  it('der kleinste Chip ist der Small Blind, der Fahrplan steigt', () => {
    const plan = planChips(5, KOFFER)!;
    expect(plan.levels[0].bb).toBe(plan.bigBlind);
    for (let i = 1; i < plan.levels.length; i += 1) {
      expect(plan.levels[i].bb).toBeGreaterThan(plan.levels[i - 1].bb);
    }
    for (const l of plan.levels) expect(l.sb * 2).toBe(l.bb);
  });

  it('behält Namen und Farbe der Sorte', () => {
    const plan = planChips(4, [
      { id: 'a', label: 'Weiß', color: '#e8e4d8', count: 200 },
      { id: 'b', label: 'Rot', color: '#c94f44', count: 100 },
    ])!;
    expect(plan.chips.find((c) => c.id === 'b')).toMatchObject({ label: 'Rot', color: '#c94f44' });
  });

  it('zwei Sorten dürfen gleich heißen', () => {
    const plan = planChips(4, [
      { id: 'a', label: 'Rot', color: '#c94f44', count: 200 },
      { id: 'b', label: 'Rot', color: '#c94f44', count: 100 },
    ])!;
    expect(plan.chips).toHaveLength(2);
  });

  it('eine einzige Chipsorte funktioniert (Wert 1, BB 2)', () => {
    const plan = planChips(4, [chip('nur', 200)])!;
    expect(plan.chips[0].value).toBe(1);
    expect(plan.chips[0].perPlayer).toBe(50);
    expect(plan.bigBlind).toBe(2);
    expect(plan.stackBB).toBe(25);
  });

  it('ungültige Eingaben ergeben null statt Absturz', () => {
    expect(planChips(1, KOFFER)).toBeNull();
    expect(planChips(4, [])).toBeNull();
    expect(planChips(4, [chip('leer', 0)])).toBeNull();
    expect(planChips(10, [chip('mini', 5)])).toBeNull();
  });

  it('warnt bei wenigen kleinen Chips (als Codes)', () => {
    const plan = planChips(8, [chip('weiss', 40), chip('rot', 40)])!;
    expect(plan.warnings).toContain('fewSmallChips');
    for (const w of plan.warnings) {
      expect(['fewSmallChips', 'shortStacks', 'chipsBelowPlayers', 'unusedChips']).toContain(w);
    }
  });

  it('meldet Sorten mit weniger Chips als Spielern', () => {
    const plan = planChips(6, [chip('weiss', 120), chip('rot', 4)])!;
    expect(plan.warnings).toContain('chipsBelowPlayers');
  });

  it('meldet Sorten, die liegen bleiben (mehr als fünf)', () => {
    const plan = planChips(4, ['a', 'b', 'c', 'd', 'e', 'f'].map((id, i) => chip(id, 400 - i * 40)))!;
    expect(plan.warnings).toContain('unusedChips');
    expect(plan.chips).toHaveLength(5);
  });

  it('ein großzügiger Koffer erzeugt keine Warnungen', () => {
    const plan = planChips(4, [chip('weiss', 400), chip('rot', 200), chip('blau', 120)])!;
    expect(plan.warnings).toEqual([]);
  });
});
