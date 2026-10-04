/* Der Tagesplan und das Tages-Quiz aus Gelerntem (FAHRPLAN 4.2, 4.5). */

import { describe, expect, it } from 'vitest';
import { offenePunkte, tagesziel } from '../tagesplan';
import { FRAGEN_PRO_TAG, quizPool, ziehe } from '../tagesquiz';
import type { Module } from '../../content/types';

const frage = (n: number) => ({ question: `F${n}`, options: ['a', 'b'], correctIndex: 0, explanation: '' });
const lektion = (id: string, n: number) => ({
  id, title: id, duration: 5, intro: '', sections: [], takeaways: [],
  quiz: Array.from({ length: n }, (_, i) => frage(i)),
});
const MODULE = [
  { id: 'm1', title: 'Eins', subtitle: '', icon: '', level: 'Einsteiger', lessons: [lektion('m1-l1', 5), lektion('m1-l2', 5)] },
  { id: 'm5', title: 'Profi', subtitle: '', icon: '', level: 'Experte', lessons: [lektion('m5-l1', 5)] },
] as unknown as Module[];

describe('Die offenen Punkte', () => {
  const naechste = { modul: 'm1', lektion: 'm1-l2', titel: 'Zweite', erste: false };

  it('ordnen nach Dringlichkeit: Wiederholung, Quiz, Lektion', () => {
    const p = offenePunkte({ faellig: 3, quizOffen: true, naechste });
    expect(p.map((x) => x.art)).toEqual(['wiederholen', 'tagesquiz', 'lektion']);
    expect(p[0].zahl).toBe(3);
    expect(p[0].zu).toBe('/lernen/wiederholen');
    expect(p[2].zu).toBe('/lernen/m1/m1-l2');
  });

  it('lassen weg, was nicht offen ist', () => {
    expect(offenePunkte({ faellig: 0, quizOffen: false, naechste }).map((x) => x.art)).toEqual(['lektion']);
    expect(offenePunkte({ faellig: 0, quizOffen: true, naechste: null }).map((x) => x.art)).toEqual(['tagesquiz']);
    expect(offenePunkte({ faellig: 0, quizOffen: false, naechste: null })).toEqual([]);
  });
});

describe('Das Tagesziel', () => {
  it('kennt kein Quiz-Ziel, solange es kein Quiz geben kann', () => {
    expect(tagesziel(true, false, false)).toEqual({ hand: true, fragen: null });
  });

  it('zählt Fertiges als erledigt, Offenes als offen', () => {
    expect(tagesziel(true, true, false)).toEqual({ hand: true, fragen: false });
    expect(tagesziel(true, true, true)).toEqual({ hand: true, fragen: true });
    expect(tagesziel(false, true, false)).toEqual({ hand: false, fragen: false });
  });
});

describe('Das Tages-Quiz zieht nur aus Gelerntem', () => {
  it('hat keinen Pool, solange nichts abgeschlossen ist', () => {
    expect(quizPool(MODULE, {})).toEqual([]);
  });

  it('nimmt nur Fragen abgeschlossener Lektionen', () => {
    const pool = quizPool(MODULE, { 'm1-l1': {} });
    expect(pool).toHaveLength(5);
    expect(new Set(pool.map((f) => f.lessonId))).toEqual(new Set(['m1-l1']));
    /* Nie aus dem Profi-Modul, das man nie geöffnet hat. */
    expect(pool.some((f) => f.moduleId === 'm5')).toBe(false);
  });

  it('zieht am selben Tag dieselben, an einem anderen andere', () => {
    const pool = quizPool(MODULE, { 'm1-l1': {}, 'm1-l2': {}, 'm5-l1': {} });
    const a = ziehe(pool, '2026-10-04').map((f) => `${f.lessonId}:${f.qi}`);
    const b = ziehe(pool, '2026-10-04').map((f) => `${f.lessonId}:${f.qi}`);
    const c = ziehe(pool, '2026-10-05').map((f) => `${f.lessonId}:${f.qi}`);
    expect(a).toEqual(b);
    expect(a).not.toEqual(c);
    expect(a).toHaveLength(FRAGEN_PRO_TAG);
  });

  it('füllt einen kleinen Pool nicht aus Ungelerntem auf', () => {
    const pool = quizPool(MODULE.map((m) => ({
      ...m, lessons: m.lessons.map((l) => ({ ...l, quiz: l.quiz.slice(0, 2) })),
    })) as Module[], { 'm1-l1': {} });
    expect(ziehe(pool, '2026-10-04')).toHaveLength(2);
  });

  it('trägt jede Frage mit dem Schlüssel für den Wiederholstapel', () => {
    const f = quizPool(MODULE, { 'm1-l2': {} })[3];
    expect(f.moduleId).toBe('m1');
    expect(f.lessonId).toBe('m1-l2');
    expect(f.qi).toBe(3);
  });
});
