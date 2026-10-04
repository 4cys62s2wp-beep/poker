/* Lektion und Training verweisen aufeinander (FAHRPLAN 5.7). */

import { describe, expect, it } from 'vitest';
import { lektionenFuer, UEBUNG, uebungFuer, ZIEL_PFAD, type UebungsZiel } from '../lernen/uebung';
import { TRAINER } from '../trainerliste';
import { ALL_MODULES } from '../../content';
import { istOrt } from '../orte';

const ALLE_LEKTIONEN = new Set(ALL_MODULES.flatMap((m) => m.lessons.map((l) => l.id)));

describe('Die Zuordnung Lektion → Übung', () => {
  it('nennt nur Lektionen, die es gibt', () => {
    for (const id of Object.keys(UEBUNG)) expect(ALLE_LEKTIONEN.has(id), id).toBe(true);
  });

  it('führt jedes Ziel an einen Ort, den die App kennt', () => {
    for (const ziel of new Set(Object.values(UEBUNG))) {
      expect(istOrt(ZIEL_PFAD[ziel]), ziel).toBe(true);
    }
  });

  it('gibt jedem Trainer mindestens eine Lektion, die hinführt', () => {
    /* Sonst fehlte dem Trainer das „Konzept nachlesen". */
    for (const t of TRAINER) expect(lektionenFuer(t.id).length, t.id).toBeGreaterThan(0);
    expect(lektionenFuer('drill').length).toBeGreaterThan(0);
    expect(lektionenFuer('uebungstisch').length).toBeGreaterThan(0);
  });

  it('ordnet Pot Odds dem Pot-Odds-Drill zu', () => {
    expect(uebungFuer('m3-l3')).toBe('drill');
  });

  it('kennt zu Tilt und Bankroll keine Übung — dort gibt es nichts abzufragen', () => {
    expect(uebungFuer('m6-l1')).toBeNull();
    expect(uebungFuer('m6-l2')).toBeNull();
  });

  it('gibt die Lektionen eines Ziels in Kursreihenfolge zurück', () => {
    const ids = lektionenFuer('preflop');
    expect([...ids].sort()).toEqual(ids);
    expect(ids[0]).toBe('m2-l1');
  });

  it('hat für jedes Ziel einen Pfad', () => {
    const ziele: UebungsZiel[] = [...TRAINER.map((t) => t.id), 'drill', 'uebungstisch'];
    for (const z of ziele) expect(ZIEL_PFAD[z]).toBeDefined();
  });
});
