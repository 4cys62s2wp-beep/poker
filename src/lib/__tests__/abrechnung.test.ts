/* Abrechnung und gepflegte Abende (FAHRPLAN 7.8). */

import { describe, expect, it } from 'vitest';
import { abrechne, ausgleich, auszahlungAusAbend } from '../session/abrechnung';
import {
  archiviere, istProbe, korrigiere, loescheAbend, zusammenfassung, ergaenze, type Abend,
} from '../session/abende';
import type { LaufendeSession } from '../session/laufend';

function zufall(seed: number) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

function abend(ueber: Partial<Abend> = {}): Abend {
  return {
    id: '1', begonnen: 1_770_000_000_000, beendet: 1_770_000_000_000 + 3 * 3_600_000, gespielt_ms: 3 * 3_600_000,
    startchips: 1000, stufendauer_s: 1200, stufen: [[1, 2]], erreichte_stufe: 1,
    spieler: [
      { name: 'Mira', eingekauft: 1000, stand: 3000, raus_um: null, platz: 1 },
      { name: 'Ben', eingekauft: 2000, stand: 0, raus_um: 5, platz: 3 },
      { name: 'Ada', eingekauft: 1000, stand: 1000, raus_um: null, platz: 2 },
      { name: 'Jonas', eingekauft: 1000, stand: null, raus_um: 3, platz: 4 },
    ],
    ...ueber,
  };
}

describe('Die Ausgleichszahlungen', () => {
  it('gleichen alles aus, mit höchstens n − 1 Zahlungen', () => {
    const rng = zufall(7);
    for (let lauf = 0; lauf < 300; lauf += 1) {
      const n = 2 + Math.floor(rng() * 9);
      const roh = Array.from({ length: n }, () => Math.round((rng() - 0.5) * 20000));
      const rest = roh.reduce((a, b) => a + b, 0);
      roh[0] -= rest; // Summe genau null (in Cent)
      const salden = roh.map((c, k) => ({ name: `S${k}`, netto: c / 100 }));
      const z = ausgleich(salden);
      expect(z.length, `${lauf}`).toBeLessThanOrEqual(n - 1);
      // Jeder ist am Ende bei null.
      const stand = new Map(salden.map((s) => [s.name, Math.round(s.netto * 100)]));
      for (const p of z) {
        stand.set(p.von, stand.get(p.von)! + Math.round(p.betrag * 100));
        stand.set(p.an, stand.get(p.an)! - Math.round(p.betrag * 100));
        expect(p.betrag).toBeGreaterThan(0);
      }
      for (const [name, c] of stand) expect(c, `${lauf}: ${name}`).toBe(0);
    }
  });

  it('kennt keine Zahlung, wenn alle bei null stehen', () => {
    expect(ausgleich([{ name: 'A', netto: 0 }, { name: 'B', netto: 0 }])).toEqual([]);
  });
});

describe('Abrechnung eines Turniers', () => {
  it('verteilt den Topf nach Platz — Summe der Salden ist null', () => {
    const r = abrechne(abend({ euroJeSpieler: 10 }))!;
    expect(r).not.toBeNull();
    expect(r.zeilen.reduce((s, z) => s + Math.round(z.netto * 100), 0)).toBe(0);
    // 5 Buy-ins (Ben hat einmal nachgekauft) zu 10 € = 50 € Topf.
    expect(r.topf).toBe(50);
    expect(r.zeilen.find((z) => z.name === 'Ben')!.eingezahlt).toBe(20);
    expect(r.zeilen.find((z) => z.name === 'Mira')!.netto).toBeGreaterThan(0);
    expect(r.zeilen.find((z) => z.name === 'Jonas')!.netto).toBe(-10);
  });

  it('hat höchstens n − 1 Zahlungen und gleicht jeden aus', () => {
    const r = abrechne(abend({ euroJeSpieler: 10 }))!;
    expect(r.zahlungen.length).toBeLessThanOrEqual(r.zeilen.length - 1);
    const stand = new Map(r.zeilen.map((z) => [z.name, Math.round(z.netto * 100)]));
    for (const p of r.zahlungen) {
      stand.set(p.von, stand.get(p.von)! + Math.round(p.betrag * 100));
      stand.set(p.an, stand.get(p.an)! - Math.round(p.betrag * 100));
    }
    for (const [, c] of stand) expect(c).toBe(0);
  });

  it('teilt sich ein Platz, teilen sich die Spieler dessen Anteil', () => {
    const a = abend({
      euroJeSpieler: 10,
      spieler: [
        { name: 'A', eingekauft: 1000, stand: 2000, raus_um: null, platz: 1 },
        { name: 'B', eingekauft: 1000, stand: 2000, raus_um: null, platz: 1 },
        { name: 'C', eingekauft: 1000, stand: 0, raus_um: 1, platz: 3 },
        { name: 'D', eingekauft: 1000, stand: null, raus_um: 0, platz: 4 },
      ],
    });
    const r = abrechne(a)!;
    const nettoA = r.zeilen.find((z) => z.name === 'A')!.netto;
    const nettoB = r.zeilen.find((z) => z.name === 'B')!.netto;
    expect(Math.abs(nettoA - nettoB)).toBeLessThanOrEqual(0.01);
    expect(r.zeilen.reduce((s, z) => s + Math.round(z.netto * 100), 0)).toBe(0);
  });

  it('gibt ohne Einsatz in Euro keine Abrechnung', () => {
    expect(abrechne(abend())).toBeNull();
  });

  it('meldet, wenn gezählte und eingekaufte Chips nicht zusammenpassen', () => {
    const r = abrechne(abend({ euroJeSpieler: 10 }))!;
    // 5000 eingekauft, 4000 gezählt
    expect(r.pruefung).toEqual({ eingekauft: 5000, gezaehlt: 4000, abweichung: -1000 });
  });
});

describe('Abrechnung eines Cash-Abends', () => {
  const cash = (stande: number[]) => abend({
    modus: 'cash', euroJeSpieler: 20, punkteJeEuro: 50,
    spieler: stande.map((s, k) => ({ name: `S${k}`, eingekauft: 1000, stand: s, raus_um: null, platz: k + 1 })),
  });

  it('rechnet Endstand minus Einsatz zum Kurs', () => {
    const r = abrechne(cash([1500, 500, 1000]))!;
    expect(r.zeilen.map((z) => z.netto)).toEqual([10, -10, 0]);
    expect(r.zahlungen).toEqual([{ von: 'S1', an: 'S0', betrag: 10 }]);
  });

  it('macht keine Zahlungen, wenn die Chips nicht aufgehen', () => {
    const r = abrechne(cash([1500, 500, 900]))!;
    expect(r.pruefung.abweichung).toBe(-100);
    expect(r.zahlungen).toEqual([]);
  });

  it('braucht den Kurs', () => {
    expect(abrechne({ ...cash([1000, 1000]), punkteJeEuro: undefined })).toBeNull();
  });
});

describe('Frühere Abende pflegen', () => {
  it('erkennt eine Probe: unter zehn Minuten', () => {
    expect(istProbe(9 * 60_000)).toBe(true);
    expect(istProbe(10 * 60_000)).toBe(false);
  });

  it('löscht einen Abend — und mit ergaenze kommt er zurück', () => {
    const a = abend();
    const ohne = loescheAbend([a], a.id);
    expect(ohne).toEqual([]);
    expect(ergaenze(ohne, a)).toEqual([a]);
  });

  it('korrigiert einen Endstand und rechnet die Plätze neu', () => {
    const a = abend();
    const neu = korrigiere(a, { Ada: { stand: 5000 } });
    expect(neu.spieler.find((s) => s.name === 'Ada')!.platz).toBe(1);
    expect(neu.spieler.find((s) => s.name === 'Mira')!.platz).toBe(2);
  });

  it('korrigiert die Rebuys (eingezahlt)', () => {
    const neu = korrigiere(abend(), { Mira: { eingekauft: 3000 } });
    expect(neu.spieler.find((s) => s.name === 'Mira')!.eingekauft).toBe(3000);
  });

  it('fasst die Abende zusammen', () => {
    const a = abend();
    const b = abend({ id: '2', begonnen: a.begonnen + 86_400_000 });
    const z = zusammenfassung([a, b]);
    expect(z).toEqual({ abende: 2, personen: 4, zuletzt: b.begonnen });
    expect(zusammenfassung([]).zuletzt).toBeNull();
  });

  it('übernimmt Modus und Einsatz aus dem laufenden Abend ins Archiv', () => {
    const s: LaufendeSession = {
      begonnen: 1, spieler: [{ name: 'A', eingekauft: 1000, stand: 1000 }, { name: 'B', eingekauft: 1000, stand: 1000 }],
      startchips: 1000, stufen: [[1, 2]], stufendauer_s: 1200, stufe: 0, verbraucht_ms: 0, laeuft_seit: null,
      modus: 'cash', euroJeSpieler: 20, punkteJeEuro: 50,
    };
    const a = archiviere(s, 10);
    expect(a.modus).toBe('cash');
    expect(a.euroJeSpieler).toBe(20);
    expect(a.punkteJeEuro).toBe(50);
  });
});

describe('Übernahme in den Auszahlungs-Rechner', () => {
  const lauf = (ueber: Partial<LaufendeSession> = {}): LaufendeSession => ({
    begonnen: 1, startchips: 1000, stufen: [[1, 2]], stufendauer_s: 1200, stufe: 0, verbraucht_ms: 0,
    laeuft_seit: null,
    spieler: [
      { name: 'A', eingekauft: 1000, stand: 1000 },
      { name: 'B', eingekauft: 3000, stand: 500 },
      { name: 'C', eingekauft: 1000, stand: 2500 },
    ],
    ...ueber,
  });

  it('zählt die Rebuys aus dem, was insgesamt eingekauft wurde', () => {
    // 5.000 Chips bei 1.000 Startchips = 5 Stapel, drei davon die ersten je Spieler.
    expect(auszahlungAusAbend(lauf({ euroJeSpieler: 10 }))).toEqual({
      spieler: 3, buyIn: 10, rebuys: 2, einheit: 'euro',
    });
  });

  it('rechnet in Chips, wenn kein Euro-Einsatz eingetragen ist', () => {
    expect(auszahlungAusAbend(lauf())).toEqual({ spieler: 3, buyIn: 1000, rebuys: 2, einheit: 'chips' });
  });

  it('nimmt nichts mit, wenn es keine Runde gibt oder nur eine Person', () => {
    expect(auszahlungAusAbend(null)).toBeNull();
    expect(auszahlungAusAbend(lauf({ spieler: [{ name: 'A', eingekauft: 1000, stand: 1000 }] }))).toBeNull();
  });

  it('zählt keine negativen Rebuys', () => {
    const l = lauf({ spieler: [{ name: 'A', eingekauft: 500, stand: 1 }, { name: 'B', eingekauft: 500, stand: 1 }] });
    expect(auszahlungAusAbend(l)!.rebuys).toBe(0);
  });
});
