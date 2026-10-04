/* Die Auswahl der Abzeichen auf dem Profil (FAHRPLAN 8.4). */

import { describe, expect, it } from 'vitest';
import { waehleAbzeichen, ZEIGE_NAECHSTE, ZEIGE_VERDIENT } from '../abzeichen';
import { BADGES } from '../../content/badges';
import { BADGES as EN } from '../../content/en/badges';

const def = (n: number) => Array.from({ length: n }, (_, i) => ({ id: `b${i}` }));

describe('waehleAbzeichen', () => {
  it('zeigt höchstens sechs verdiente, das neueste zuerst', () => {
    const alle = def(10);
    const erworben = Object.fromEntries(alle.map((d, i) => [d.id, `2026-01-${String(i + 1).padStart(2, '0')}`]));
    const a = waehleAbzeichen(alle, erworben);
    expect(a.verdient.map((v) => v.def.id)).toEqual(['b9', 'b8', 'b7', 'b6', 'b5', 'b4']);
    expect(a.weitereVerdient).toBe(10 - ZEIGE_VERDIENT);
    expect(a.naechste).toEqual([]);
    expect(a.offen).toBe(0);
  });

  it('nennt die nächsten drei fehlenden in der Reihenfolge der Sammlung', () => {
    const alle = def(8);
    const a = waehleAbzeichen(alle, { b0: '2026-01-01', b2: '2026-01-02' });
    expect(a.naechste.map((d) => d.id)).toEqual(['b1', 'b3', 'b4']);
    expect(a.naechste).toHaveLength(ZEIGE_NAECHSTE);
    expect(a.offen).toBe(6);
  });

  it('zählt beim selben Zeitpunkt das spätere der Sammlung vorn', () => {
    const a = waehleAbzeichen(def(3), { b0: '2026-02-01', b1: '2026-02-01' });
    expect(a.verdient.map((v) => v.def.id)).toEqual(['b1', 'b0']);
  });

  it('rechnet mit einem unlesbaren Datum, ohne zu stürzen', () => {
    const a = waehleAbzeichen(def(3), { b0: 'gestern', b1: '2026-02-01' });
    expect(a.verdient.map((v) => v.def.id)).toEqual(['b1', 'b0']);
    expect(a.offen).toBe(1);
  });

  it('kommt mit einer leeren Sammlung und ohne Verdientes zurecht', () => {
    expect(waehleAbzeichen([], {})).toEqual({ verdient: [], weitereVerdient: 0, naechste: [], offen: 0 });
    const a = waehleAbzeichen(def(5), {});
    expect(a.verdient).toEqual([]);
    expect(a.offen).toBe(5);
  });
});

describe('Die Medaillen', () => {
  it('sind in beiden Sprachen Zeichen aus dem eigenen Satz, nicht Emoji', () => {
    for (const b of [...BADGES, ...EN]) {
      expect(b.icon, b.id).toMatch(/^[a-z]+$/);
    }
  });

  it('gleichen in beiden Sprachen derselben Sache', () => {
    expect(EN.map((b) => [b.id, b.icon])).toEqual(BADGES.map((b) => [b.id, b.icon]));
  });

  it('teilen sich kein Zeichen, damit man sie auseinanderhält', () => {
    const ids = BADGES.map((b) => b.icon);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
