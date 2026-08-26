import { describe, expect, it } from 'vitest';
import { berechneAuszahlung, strukturFuer } from '../poker/payout';

const summe = (xs: number[]) => xs.reduce((s, x) => s + x, 0);

describe('Auszahlungsstruktur', () => {
  it('bezahlt bei kleinen Feldern nur den Sieger', () => {
    expect(strukturFuer(2)).toEqual([1]);
    expect(strukturFuer(5)).toEqual([1]);
  });

  it('bezahlt mit wachsendem Feld mehr Plätze', () => {
    const plaetze = [5, 6, 10, 16, 25, 40].map((n) => strukturFuer(n).length);
    expect(plaetze).toEqual([1, 2, 3, 4, 5, 6]);
    // Monoton: Ein größeres Feld darf nie WENIGER Plätze bezahlen.
    for (let i = 1; i < plaetze.length; i++) {
      expect(plaetze[i]).toBeGreaterThanOrEqual(plaetze[i - 1]);
    }
  });

  it('verteilt in jeder Struktur genau den ganzen Topf', () => {
    for (const n of [2, 6, 10, 16, 25, 40, 100]) {
      expect(summe(strukturFuer(n))).toBeCloseTo(1, 10);
    }
  });

  it('gibt nach vorn hin immer mehr, nie weniger', () => {
    for (const n of [6, 10, 16, 25, 40]) {
      const a = strukturFuer(n);
      for (let i = 1; i < a.length; i++) {
        expect(a[i]).toBeLessThanOrEqual(a[i - 1]);
      }
    }
  });

  it('lässt den Sieger mit wachsendem Feld relativ weniger bekommen', () => {
    expect(strukturFuer(40)[0]).toBeLessThan(strukturFuer(10)[0]);
    expect(strukturFuer(10)[0]).toBeLessThan(strukturFuer(6)[0]);
  });
});

describe('Auszahlung rechnen', () => {
  it('rechnet den Topf aus Spielern, Buy-in und Rebuys', () => {
    expect(berechneAuszahlung({ spieler: 8, buyIn: 10 }).topf).toBe(80);
    expect(berechneAuszahlung({ spieler: 8, buyIn: 10, rebuys: 3 }).topf).toBe(110);
  });

  it('schüttet ungerundet exakt den Topf aus', () => {
    const p = berechneAuszahlung({ spieler: 12, buyIn: 25 });
    expect(summe(p.auszahlungen.map((a) => a.betrag))).toBeCloseTo(p.topf, 10);
  });

  it('schüttet auch gerundet exakt den Topf aus – das ist der Kern', () => {
    // Ohne den Rundungsrest auf Platz 1 bliebe Geld auf dem Tisch liegen,
    // und der Abend endet mit einer Diskussion statt mit einer Auszahlung.
    for (const spieler of [6, 9, 13, 17, 28, 44]) {
      for (const rundung of [1, 5, 10]) {
        const p = berechneAuszahlung({ spieler, buyIn: 23, rundung });
        expect(summe(p.auszahlungen.map((a) => a.betrag)), `${spieler}/${rundung}`)
          .toBe(p.topf);
      }
    }
  });

  it('rundet abwärts und legt den Rest auf Platz 1', () => {
    // Aufrunden könnte mehr versprechen, als im Topf liegt.
    const p = berechneAuszahlung({ spieler: 10, buyIn: 7, rundung: 5 });
    expect(p.topf).toBe(70);
    for (let i = 1; i < p.auszahlungen.length; i++) {
      expect(p.auszahlungen[i].betrag % 5).toBe(0);
    }
    expect(p.rundungsrest).toBeGreaterThan(0);
    expect(p.auszahlungen[0].betrag).toBeGreaterThan(p.topf * strukturFuer(10)[0] - 5);
  });

  it('weist den Anteil zum tatsächlichen Betrag aus, nicht zur Tabelle', () => {
    const p = berechneAuszahlung({ spieler: 10, buyIn: 7, rundung: 5 });
    for (const a of p.auszahlungen) {
      expect(a.anteil).toBeCloseTo(a.betrag / p.topf, 10);
    }
  });

  it('gibt nie mehr aus, als im Topf liegt', () => {
    for (const spieler of [2, 3, 7, 11, 19, 33, 60]) {
      for (const rundung of [0, 1, 2, 5, 10, 25]) {
        const p = berechneAuszahlung({ spieler, buyIn: 13, rebuys: 4, rundung });
        expect(summe(p.auszahlungen.map((a) => a.betrag))).toBeLessThanOrEqual(p.topf + 1e-9);
      }
    }
  });

  it('zahlt niemandem einen negativen Betrag aus', () => {
    // Kann passieren, wenn die Rundung größer ist als ein hinterer Anteil.
    const p = berechneAuszahlung({ spieler: 40, buyIn: 1, rundung: 25 });
    for (const a of p.auszahlungen) expect(a.betrag).toBeGreaterThanOrEqual(0);
    expect(summe(p.auszahlungen.map((a) => a.betrag))).toBe(p.topf);
  });

  it('liefert bei unbrauchbarer Eingabe einen leeren Plan statt zu werfen', () => {
    for (const e of [
      { spieler: 1, buyIn: 10 },
      { spieler: 0, buyIn: 10 },
      { spieler: 8, buyIn: 0 },
      { spieler: 8, buyIn: -5 },
      { spieler: NaN, buyIn: 10 },
      { spieler: 8, buyIn: Infinity },
    ]) {
      const p = berechneAuszahlung(e);
      expect(p.auszahlungen).toEqual([]);
      expect(p.topf).toBe(0);
    }
  });

  it('ignoriert eine unsinnige Rundung, statt daran zu zerbrechen', () => {
    for (const rundung of [0, -5, NaN]) {
      const p = berechneAuszahlung({ spieler: 10, buyIn: 20, rundung });
      expect(summe(p.auszahlungen.map((a) => a.betrag))).toBeCloseTo(200, 10);
    }
  });
});
