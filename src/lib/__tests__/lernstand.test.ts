/* Der Lernstand je Thema (FAHRPLAN, Lücke „Lernstand je Thema“). */

import { describe, expect, it } from 'vitest';
import {
  FENSTER, MIN_ANTWORTEN, THEMEN, lernstand, lesbareLetzte, merkeAntwort, schwaechste, stufeVon, zaehle,
} from '../lernstand';
import { sanitizeAppData } from '../../state/AppState';
import { lektionenFuer } from '../lernen/uebung';
import { istOrt } from '../orte';

const folge = (n: number, richtig: number) => '1'.repeat(richtig) + '0'.repeat(n - richtig);

describe('merkeAntwort', () => {
  it('hängt die neueste Antwort hinten an', () => {
    expect(merkeAntwort(undefined, true)).toBe('1');
    expect(merkeAntwort('1', false)).toBe('10');
  });

  it('behält nie mehr als 20 Antworten, die ältesten fallen heraus', () => {
    let s: string | undefined;
    for (let i = 0; i < 35; i += 1) s = merkeAntwort(s, i % 2 === 0);
    expect(s!.length).toBe(FENSTER);
    expect(s).toBe(merkeAntwort(s!.slice(0, -1), s!.endsWith('1')));
  });
});

describe('lesbareLetzte', () => {
  it('nimmt nur 0 und 1 bis zur Länge 20', () => {
    expect(lesbareLetzte('10110')).toBe('10110');
    expect(lesbareLetzte('')).toBeUndefined();
    expect(lesbareLetzte('1'.repeat(21))).toBeUndefined();
    expect(lesbareLetzte('10a')).toBeUndefined();
    expect(lesbareLetzte(5)).toBeUndefined();
    expect(lesbareLetzte(undefined)).toBeUndefined();
  });
});

describe('stufeVon', () => {
  it('stuft erst ab zehn Antworten ein', () => {
    expect(stufeVon({ antworten: MIN_ANTWORTEN - 1, richtig: MIN_ANTWORTEN - 1 })).toBe('zuWenig');
    expect(stufeVon({ antworten: MIN_ANTWORTEN, richtig: MIN_ANTWORTEN })).toBe('sicher');
  });

  it('kennt drei Stufen mit den Grenzen 80 und 55 Prozent', () => {
    expect(stufeVon({ antworten: 20, richtig: 16 })).toBe('sicher');
    expect(stufeVon({ antworten: 20, richtig: 15 })).toBe('wackelt');
    expect(stufeVon({ antworten: 20, richtig: 11 })).toBe('wackelt');
    expect(stufeVon({ antworten: 20, richtig: 10 })).toBe('offen');
    expect(stufeVon({ antworten: 20, richtig: 0 })).toBe('offen');
  });
});

describe('zaehle', () => {
  it('zählt Antworten und richtige im Fenster', () => {
    expect(zaehle('10110')).toEqual({ antworten: 5, richtig: 3 });
    expect(zaehle(undefined)).toEqual({ antworten: 0, richtig: 0 });
    expect(zaehle('kaputt')).toEqual({ antworten: 0, richtig: 0 });
  });
});

describe('lernstand', () => {
  it('zeigt nur Themen, in denen schon geantwortet wurde', () => {
    expect(lernstand({})).toEqual([]);
    const z = lernstand({ outs: { attempts: 3, letzte: '110' } });
    expect(z.map((x) => x.thema)).toEqual(['outs']);
    expect(z[0].stufe).toBe('zuWenig');
  });

  it('zählt Pot-Odds-Trainer und Drill zu einem Thema', () => {
    const z = lernstand({
      potodds: { attempts: 6, letzte: folge(6, 6) },
      potoddsdrill: { attempts: 6, letzte: folge(6, 3) },
    });
    expect(z).toHaveLength(1);
    expect(z[0].antworten).toBe(12);
    expect(z[0].richtig).toBe(9);
    expect(z[0].gesamt).toBe(12);
    expect(z[0].stufe).toBe('wackelt');
  });

  it('behandelt einen Altstand ohne Fenster als „zu wenig Daten“, ohne eine Quote zu erfinden', () => {
    const z = lernstand({ preflop: { attempts: 200 } });
    expect(z[0].stufe).toBe('zuWenig');
    expect(z[0].quote).toBeNull();
    expect(z[0].gesamt).toBe(200);
  });

  it('bringt Themen in Kursreihenfolge', () => {
    const z = lernstand({
      pushfold: { attempts: 1, letzte: '1' }, handranking: { attempts: 1, letzte: '1' }, outs: { attempts: 1, letzte: '1' },
    });
    expect(z.map((x) => x.thema)).toEqual(['handranking', 'outs', 'pushfold']);
  });

  it('führt jedes Thema zu einer Übung und zu einer Lektion, die es gibt', () => {
    const alle = lernstand(Object.fromEntries(THEMEN.flatMap((t) => t.trainer).map((id) => [id, { attempts: 1, letzte: '1' }])));
    expect(alle).toHaveLength(THEMEN.length);
    for (const z of alle) {
      expect(istOrt(z.uebenPfad), z.thema).toBe(true);
      expect(z.lektion, `Zu „${z.thema}“ fehlt die Lektion`).not.toBeNull();
    }
    expect(lektionenFuer('potodds')[0]).toBe(alle.find((z) => z.thema === 'potodds')!.lektion);
  });
});

describe('schwaechste', () => {
  const zeilen = lernstand({
    outs: { attempts: 20, letzte: folge(20, 18) },
    preflop: { attempts: 20, letzte: folge(20, 9) },
    equity: { attempts: 20, letzte: folge(20, 13) },
    szenario: { attempts: 4, letzte: folge(4, 0) },
  });

  it('nimmt das Thema mit der niedrigsten Quote unter den eingestuften', () => {
    expect(schwaechste(zeilen)!.thema).toBe('preflop');
  });

  it('übergeht Themen mit zu wenig Daten, auch wenn sie 0 Prozent haben', () => {
    expect(schwaechste(zeilen.filter((z) => z.thema === 'szenario'))).toBeNull();
  });

  it('erfindet nichts, wenn alles sicher ist', () => {
    expect(schwaechste(lernstand({ outs: { attempts: 20, letzte: folge(20, 19) } }))).toBeNull();
  });
});

describe('sanitizeAppData und das Fenster', () => {
  it('behält ein brauchbares Fenster und wirft ein kaputtes weg', () => {
    const d = sanitizeAppData({
      trainers: {
        outs: { attempts: 5, correct: 3, streak: 1, bestStreak: 2, letzte: '10101' },
        preflop: { attempts: 5, correct: 3, streak: 1, bestStreak: 2, letzte: '10x01' },
        equity: { attempts: 5, correct: 3, streak: 1, bestStreak: 2 },
      },
    });
    expect(d.trainers.outs.letzte).toBe('10101');
    expect('letzte' in d.trainers.preflop).toBe(false);
    expect('letzte' in d.trainers.equity).toBe(false);
  });
});
