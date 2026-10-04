/* Der Modultest (FAHRPLAN, Lücke „Einstieg für Spieler mit Vorkenntnissen“). */

import { describe, expect, it } from 'vitest';
import { TEST_FRAGEN, grenzeFuer, testBestanden, ziehTestFragen } from '../lernen/modultest';
import { ALL_MODULES } from '../../content';
import type { Module } from '../../content/types';

const frage = (n: number) => ({ question: `F${n}`, options: ['a', 'b'], correctIndex: 0, explanation: 'x' });
const modul = (lektionen: number[]): Module => ({
  id: 'mx', title: 'X', subtitle: '', icon: '', description: '',
  lessons: lektionen.map((anzahl, i) => ({
    id: `mx-l${i + 1}`, title: `L${i + 1}`, duration: 5, intro: '', sections: [],
    quiz: Array.from({ length: anzahl }, (_, q) => frage(q)),
  })),
} as unknown as Module);

describe('grenzeFuer / testBestanden', () => {
  it('verlangt bei acht Fragen sieben', () => {
    expect(grenzeFuer(8)).toBe(7);
    expect(testBestanden(7, 8)).toBe(true);
    expect(testBestanden(6, 8)).toBe(false);
  });

  it('rechnet bei weniger Fragen mit demselben Anteil, aufgerundet', () => {
    expect(grenzeFuer(5)).toBe(5);
    expect(grenzeFuer(4)).toBe(4);
    expect(grenzeFuer(1)).toBe(1);
    expect(testBestanden(0, 0)).toBe(false);
  });

  it('verlangt nie mehr, als es Fragen gibt', () => {
    for (let n = 1; n <= 20; n += 1) expect(grenzeFuer(n)).toBeLessThanOrEqual(n);
  });
});

describe('ziehTestFragen', () => {
  it('zieht acht Fragen aus einem Modul mit genug Fragen', () => {
    const f = ziehTestFragen(modul([5, 5, 5, 5, 5]), 'a');
    expect(f).toHaveLength(TEST_FRAGEN);
  });

  it('nimmt aus jeder Lektion eine, bevor eine zweimal vorkommt', () => {
    const f = ziehTestFragen(modul([5, 5, 5, 5, 5]), 'b');
    const je = new Map<string, number>();
    for (const x of f) je.set(x.lessonId, (je.get(x.lessonId) ?? 0) + 1);
    expect(je.size).toBe(5);
    expect(Math.max(...je.values())).toBeLessThanOrEqual(2);
  });

  it('nimmt bei weniger Lektionen als Fragen reihum mehrere je Lektion', () => {
    const f = ziehTestFragen(modul([5, 5]), 'c');
    expect(f).toHaveLength(8);
    const je = new Map<string, number>();
    for (const x of f) je.set(x.lessonId, (je.get(x.lessonId) ?? 0) + 1);
    expect([...je.values()].sort()).toEqual([4, 4]);
  });

  it('nimmt alle, wenn es weniger gibt als gewünscht', () => {
    expect(ziehTestFragen(modul([2, 1]), 'd')).toHaveLength(3);
  });

  it('zieht keine Frage doppelt', () => {
    const f = ziehTestFragen(modul([5, 5, 5, 5, 5]), 'e');
    expect(new Set(f.map((x) => `${x.lessonId}:${x.qi}`)).size).toBe(f.length);
  });

  it('ist bei gleichem Startwert gleich, bei anderem verschieden', () => {
    const m = modul([5, 5, 5, 5, 5]);
    const schluessel = (s: string) => ziehTestFragen(m, s).map((x) => `${x.lessonId}:${x.qi}`).join();
    expect(schluessel('x')).toBe(schluessel('x'));
    expect(schluessel('x')).not.toBe(schluessel('y'));
  });

  it('trägt den Schlüssel der Wiederholung: Modul, Lektion, Index in der Lektion', () => {
    const f = ziehTestFragen(ALL_MODULES[0], 'f')[0];
    const lektion = ALL_MODULES[0].lessons.find((l) => l.id === f.lessonId)!;
    expect(lektion.quiz[f.qi].question).toBe(f.question);
    expect(f.moduleId).toBe(ALL_MODULES[0].id);
  });

  it('findet in jedem echten Modul mindestens acht Fragen', () => {
    for (const m of ALL_MODULES) {
      expect(ziehTestFragen(m, 'g').length, m.id).toBeGreaterThanOrEqual(TEST_FRAGEN);
    }
  });
});
