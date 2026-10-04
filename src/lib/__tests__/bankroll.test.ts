/* Die Bankroll-Hilfen (FAHRPLAN 7.13). */

import { describe, expect, it } from 'vitest';
import { datumAnzeigen, heuteIso, vorbelegungAusAbend } from '../bankroll';
import type { Abend } from '../session/abende';

function abend(ueber: Partial<Abend> = {}): Abend {
  return {
    id: '1', begonnen: new Date(2026, 9, 2, 20, 15).getTime(), beendet: new Date(2026, 9, 2, 23, 15).getTime(),
    gespielt_ms: 2.5 * 3_600_000, startchips: 1000, stufendauer_s: 1200, stufen: [[1, 2]], erreichte_stufe: 1,
    euroJeSpieler: 10,
    spieler: [
      { name: 'Mira', eingekauft: 1000, stand: 2000, raus_um: null, platz: 1 },
      { name: 'Ben', eingekauft: 1000, stand: 1000, raus_um: null, platz: 2 },
      { name: 'Ada', eingekauft: 1000, stand: 0, raus_um: 5, platz: 3 },
    ],
    ...ueber,
  };
}

describe('heuteIso', () => {
  it('nimmt den Tag des Geräts, nicht den in UTC', () => {
    // 00:30 Ortszeit: In UTC ist es je nach Zeitzone noch der Vortag.
    expect(heuteIso(new Date(2026, 9, 4, 0, 30))).toBe('2026-10-04');
    expect(heuteIso(new Date(2026, 0, 1, 23, 59))).toBe('2026-01-01');
  });
});

describe('datumAnzeigen', () => {
  it('schreibt das Datum in der Sprache der Oberfläche', () => {
    expect(datumAnzeigen('2026-10-02', 'de')).toMatch(/^2\. Okt\.? 2026$/);
    expect(datumAnzeigen('2026-10-02', 'en')).toMatch(/^2 Oct 2026$/);
  });

  it('verschiebt den Tag nie, auch am Monatsanfang nicht', () => {
    expect(datumAnzeigen('2026-03-01', 'en')).toMatch(/^1 Mar 2026$/);
    expect(datumAnzeigen('2026-12-31', 'en')).toMatch(/^31 Dec 2026$/);
  });

  it('gibt Unlesbares unverändert zurück', () => {
    expect(datumAnzeigen('', 'de')).toBe('');
    expect(datumAnzeigen('gestern', 'de')).toBe('gestern');
  });
});

describe('vorbelegungAusAbend', () => {
  it('übernimmt Einzahlung, Auszahlung, Tag und Dauer eines Spielers', () => {
    const v = vorbelegungAusAbend(abend(), 'Mira');
    expect(v).not.toBeNull();
    expect(v!.date).toBe('2026-10-02');
    expect(v!.type).toBe('live');
    expect(v!.buyIn).toBe(10);
    expect(v!.minutes).toBe(150);
    // Mira gewinnt: Auszahlung über der Einzahlung.
    expect(v!.cashOut).toBeGreaterThan(v!.buyIn);
  });

  it('lässt über alle Spieler Einzahlung und Auszahlung aufgehen', () => {
    const a = abend();
    const summe = a.spieler.reduce((s, p) => {
      const v = vorbelegungAusAbend(a, p.name)!;
      return { ein: s.ein + v.buyIn, aus: s.aus + v.cashOut };
    }, { ein: 0, aus: 0 });
    expect(summe.aus).toBeCloseTo(summe.ein, 2);
  });

  it('gibt nichts zurück, wenn der Abend kein Geld kennt', () => {
    expect(vorbelegungAusAbend(abend({ euroJeSpieler: undefined }), 'Mira')).toBeNull();
  });

  it('gibt nichts zurück, wenn die Prüfsumme nicht stimmt', () => {
    const a = abend();
    a.spieler[0].stand = 2500;
    expect(vorbelegungAusAbend(a, 'Mira')).toBeNull();
  });

  it('gibt nichts zurück für einen Namen, der nicht mitgespielt hat', () => {
    expect(vorbelegungAusAbend(abend(), 'Niemand')).toBeNull();
  });
});
