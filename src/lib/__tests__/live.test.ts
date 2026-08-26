/* Chipverteilung und Blindstruktur.
   ================================

   Die beiden Rechnungen, auf denen der Live-Bereich steht. Geprüft wird nicht,
   dass sie „funktionieren", sondern die Eigenschaften, deren Fehlen am Tisch
   auffällt:

   - Es wird nichts ausgegeben, was nicht im Koffer liegt.
   - Der Small Blind ist mit einem einzigen Chip bezahlbar.
   - Die Blinds steigen gleichmäßig und nicht sprunghaft.
   - Am Ende ist ein Finale möglich.

   Die Testfälle kommen aus der Praxis: fünf bis sechs Spieler, ein bis zwei
   Standardkoffer. */

import { describe, expect, it } from 'vitest';
import {
  LEITER, MIN_KLEINSTE_JE_SPIELER, maxSpieler, verteile, type Sorte,
} from '../live/verteilung';
import {
  FAKTOR_MAX, FINALE_SPIELER, VOREINSTELLUNG, ZIEL_BB_MAX, ZIEL_BB_MIN,
  baueStruktur, stufeBei,
} from '../live/blinds';

/** Ein handelsüblicher 300er-Koffer. */
const KOFFER_300: Sorte[] = [
  { name: 'weiß', anzahl: 150 },
  { name: 'rot', anzahl: 100 },
  { name: 'grün', anzahl: 50 },
];

/** Zwei davon. */
const KOFFER_600: Sorte[] = KOFFER_300.map((s) => ({ ...s, anzahl: s.anzahl * 2 }));

/** Ein 500er mit vier Farben. */
const KOFFER_500: Sorte[] = [
  { name: 'weiß', anzahl: 200 },
  { name: 'rot', anzahl: 150 },
  { name: 'grün', anzahl: 100 },
  { name: 'schwarz', anzahl: 50 },
];

describe('Chipverteilung — es wird nichts verteilt, was es nicht gibt', () => {
  it.each([
    ['300er, 5 Spieler', KOFFER_300, 5],
    ['300er, 6 Spieler', KOFFER_300, 6],
    ['600er, 6 Spieler', KOFFER_600, 6],
    ['500er, 5 Spieler', KOFFER_500, 5],
  ])('%s: keine Sorte wird überzogen', (_n, koffer, spieler) => {
    const v = verteile({ sorten: koffer, spieler })!;
    for (const s of v.sorten) {
      expect(s.jeSpieler * spieler).toBeLessThanOrEqual(s.imKoffer);
      expect(s.uebrig).toBe(s.imKoffer - s.jeSpieler * spieler);
      expect(s.uebrig).toBeGreaterThanOrEqual(0);
    }
  });

  it('gibt jedem denselben Startstack', () => {
    const v = verteile({ sorten: KOFFER_300, spieler: 6 })!;
    const ausSorten = v.sorten.reduce((s, p) => s + p.jeSpieler * p.wert, 0);
    expect(v.startchips).toBe(ausSorten);
  });

  it('macht den kleinsten Chip zum Small Blind', () => {
    /* Sonst muss in jeder Hand jemand Wechselgeld suchen. */
    const v = verteile({ sorten: KOFFER_300, spieler: 5 })!;
    expect(v.smallBlind).toBe(LEITER[0]);
    expect(v.bigBlind).toBe(LEITER[0] * 2);
    expect(v.sorten[0].wert).toBe(v.smallBlind);
  });

  it('gibt der häufigsten Sorte den kleinsten Wert', () => {
    /* Folgt aus dem Koffer: Von den kleinen Chips liegen immer die meisten
       drin, weil man sie am häufigsten braucht. */
    const v = verteile({ sorten: KOFFER_500, spieler: 5 })!;
    const nachWert = [...v.sorten].sort((a, b) => a.wert - b.wert);
    const nachAnzahl = [...v.sorten].sort((a, b) => b.imKoffer - a.imKoffer);
    expect(nachWert[0].name).toBe(nachAnzahl[0].name);
  });

  it('bleibt grob: höchstens fünf Werte', () => {
    const viele: Sorte[] = Array.from({ length: 8 }, (_, i) => ({
      name: `f${i}`, anzahl: 100 - i * 5,
    }));
    const v = verteile({ sorten: viele, spieler: 5 })!;
    expect(v.sorten.length).toBeLessThanOrEqual(LEITER.length);
    expect(v.hinweise).toContain('eine-sorte-bleibt-liegen');
  });

  it('sagt es, wenn das Material nicht reicht — und nennt die Grenze', () => {
    const knapp: Sorte[] = [{ name: 'weiß', anzahl: 30 }, { name: 'rot', anzahl: 10 }];
    const v = verteile({ sorten: knapp, spieler: 8 })!;
    expect(v.reicht).toBe(false);
    expect(v.hinweise).toContain('material-reicht-nicht');
    expect(v.maxSpieler).toBeLessThan(8);
    /* Die genannte Grenze muss auch halten. */
    const grenzfall = verteile({ sorten: knapp, spieler: v.maxSpieler })!;
    expect(grenzfall.reicht).toBe(true);
  });

  it('gibt jedem genug von der kleinsten Sorte, wo es reicht', () => {
    for (const koffer of [KOFFER_300, KOFFER_500, KOFFER_600]) {
      const v = verteile({ sorten: koffer, spieler: 6 })!;
      if (v.reicht) {
        expect(v.sorten[0].jeSpieler).toBeGreaterThanOrEqual(MIN_KLEINSTE_JE_SPIELER);
      }
    }
  });

  it('rechnet den Kurs nur, wenn Geld im Spiel ist', () => {
    const ohne = verteile({ sorten: KOFFER_300, spieler: 5 })!;
    expect(ohne.punkteJeEuro).toBeNull();
    const mit = verteile({ sorten: KOFFER_300, spieler: 5, euroJeSpieler: 10 })!;
    expect(mit.punkteJeEuro).toBe(mit.startchips / 10);
  });

  it('lehnt Unsinn ab, statt etwas zu erfinden', () => {
    expect(verteile({ sorten: KOFFER_300, spieler: 1 })).toBeNull();
    expect(verteile({ sorten: [], spieler: 5 })).toBeNull();
    expect(maxSpieler([])).toBe(0);
  });
});

describe('Blindstruktur — gleichmäßig statt sprunghaft', () => {
  /* Die Startchips kommen aus der Verteilung und nicht aus der Luft: Ein
     300er-Koffer auf sechs Spieler ergibt 305 Punkte, also gut 150 Big
     Blinds. Erfundene 3000 Startchips bei einem Chip von 1 wären 1500 Big
     Blinds — eine Zahl, die es an keinem Heimtisch gibt, und die Struktur
     müsste dafür verdoppeln. */
  const ausKoffer = verteile({ sorten: KOFFER_300, spieler: 6 })!;
  const grund = {
    startchips: ausKoffer.startchips,
    spieler: 6,
    kleinsterChip: ausKoffer.smallBlind,
  };

  it.each(['gemuetlich', 'normal', 'schnell'] as const)(
    '%s: die Blinds steigen durchgehend', (tempo) => {
      const s = baueStruktur({ ...grund, dauer_min: 150, tempo });
      for (let i = 1; i < s.stufen.length; i += 1) {
        expect(s.stufen[i].bb).toBeGreaterThan(s.stufen[i - 1].bb);
      }
    });

  it('verdoppelt nie — auch nicht, wenn die Rechnung es verlangte', () => {
    /* Der Kern der Entscheidung: Eine Verdopplung je Stufe verkürzt den
       Abend drastisch. Der Faktor bleibt darunter, und zwar auch dann, wenn
       die Zielrechnung mehr fordert. */
    for (const dauer of [90, 120, 150, 180, 240]) {
      const s = baueStruktur({ ...grund, dauer_min: dauer, tempo: 'normal' });
      expect(s.faktor).toBeLessThanOrEqual(FAKTOR_MAX);
      expect(s.faktor).toBeGreaterThan(1);
    }
  });

  it('sagt es, wenn der Abend für die Startchips zu kurz ist', () => {
    /* 1500 Big Blinds lassen sich in zwei Stunden nicht einfangen, ohne zu
       verdoppeln. Statt es trotzdem zu tun: die nötige Dauer nennen. */
    const zuViel = baueStruktur({
      startchips: 3000, spieler: 6, kleinsterChip: 1, dauer_min: 120, tempo: 'normal',
    });
    expect(zuViel.faktor).toBe(FAKTOR_MAX);
    expect(zuViel.finale_moeglich).toBe(false);
    expect(zuViel.noetige_dauer_min).not.toBeNull();
    expect(zuViel.noetige_dauer_min!).toBeGreaterThan(120);
  });

  it('macht jeden Small Blind mit ganzen Chips bezahlbar', () => {
    for (const chip of [1, 5, 25]) {
      const s = baueStruktur({ ...grund, kleinsterChip: chip, dauer_min: 180, tempo: 'normal' });
      for (const stufe of s.stufen) {
        expect(stufe.bb % (2 * chip)).toBe(0);
        expect(stufe.sb % chip).toBe(0);
        expect(stufe.sb * 2).toBe(stufe.bb);
      }
    }
  });

  it('fängt beim doppelten kleinsten Chip an', () => {
    const s = baueStruktur({ ...grund, kleinsterChip: 5, dauer_min: 120, tempo: 'normal' });
    expect(s.stufen[0].sb).toBe(5);
    expect(s.stufen[0].bb).toBe(10);
  });

  it.each([
    ['300er', KOFFER_300, 120, 5], ['300er', KOFFER_300, 150, 6],
    ['300er', KOFFER_300, 180, 6], ['600er', KOFFER_600, 120, 5],
    ['600er', KOFFER_600, 150, 6], ['600er', KOFFER_600, 180, 6],
    ['600er', KOFFER_600, 180, 8], ['500er', KOFFER_500, 150, 5],
  ])('%s, %s Minuten, %s Spieler: entweder Finale oder eine ehrliche Ansage',
    (_n, koffer, dauer, spieler) => {
      const v = verteile({ sorten: koffer, spieler })!;
      const s = baueStruktur({
        startchips: v.startchips, spieler, kleinsterChip: v.smallBlind,
        dauer_min: dauer, tempo: 'normal',
      });
      /* Das ist die eigentliche Zusage: Entweder das Ende trägt ein Finale —
         oder die App sagt, wie lange es dafür bräuchte. Ein drittes gibt es
         nicht, und stillschweigend verdoppelt wird nie. */
      if (s.finale_moeglich) {
        expect(s.bb_am_ende).toBeGreaterThanOrEqual(ZIEL_BB_MIN);
        expect(s.bb_am_ende).toBeLessThanOrEqual(ZIEL_BB_MAX);
        expect(s.noetige_dauer_min).toBeNull();
      } else {
        expect(s.noetige_dauer_min).not.toBeNull();
        expect(s.noetige_dauer_min!).toBeGreaterThan(dauer);
      }
    });

  it('erreicht mit genug Zeit tatsächlich ein Finale', () => {
    /* Die Gegenprobe: Wenn die Ansage stimmt, muss die genannte Dauer auch
       reichen. Sonst wäre sie eine Ausrede. */
    for (const [koffer, spieler] of [[KOFFER_300, 6], [KOFFER_600, 6],
      [KOFFER_500, 5]] as const) {
      const v = verteile({ sorten: koffer, spieler })!;
      const kurz = baueStruktur({
        startchips: v.startchips, spieler, kleinsterChip: v.smallBlind,
        dauer_min: 90, tempo: 'normal',
      });
      if (kurz.noetige_dauer_min === null) continue;
      const lang = baueStruktur({
        startchips: v.startchips, spieler, kleinsterChip: v.smallBlind,
        dauer_min: kurz.noetige_dauer_min, tempo: 'normal',
      });
      expect(lang.faktor).toBeLessThanOrEqual(FAKTOR_MAX);
      expect(lang.bb_am_ende).toBeLessThanOrEqual(ZIEL_BB_MAX);
    }
  });

  it('rechnet das Finale über die letzten Drei', () => {
    const s = baueStruktur({ ...grund, dauer_min: 150, tempo: 'normal' });
    const letzte = s.stufen[s.stufen.length - 1];
    expect(s.bb_am_ende).toBeCloseTo(
      (grund.startchips * grund.spieler) / FINALE_SPIELER / letzte.bb, 6);
  });

  it('kettet sich sauber an die Verteilung', () => {
    /* Der Weg, den die App geht: Koffer → Verteilung → Struktur. Was dabei
       herauskommt, muss am Tisch bezahlbar sein. */
    for (const spieler of [4, 5, 6, 7, 8]) {
      const v = verteile({ sorten: KOFFER_600, spieler })!;
      if (!v.reicht) continue;
      const s = baueStruktur({
        startchips: v.startchips, spieler, kleinsterChip: v.smallBlind,
        dauer_min: 150, tempo: 'normal',
      });
      expect(s.stufen[0].sb).toBe(v.smallBlind);
      expect(s.stufen[0].bb).toBe(v.bigBlind);
      for (const stufe of s.stufen) expect(stufe.bb % (2 * v.smallBlind)).toBe(0);
    }
  });

  it('deckt die geplante Dauer ab', () => {
    for (const tempo of ['gemuetlich', 'normal', 'schnell'] as const) {
      const s = baueStruktur({ ...grund, dauer_min: 150, tempo });
      const gesamt = s.stufen.length * s.stufendauer_s;
      /* Höchstens eine halbe Stufe daneben — mehr wäre keine Planung. */
      expect(Math.abs(gesamt - 150 * 60)).toBeLessThanOrEqual(s.stufendauer_s / 2);
      expect(s.stufendauer_s).toBe(VOREINSTELLUNG[tempo] * 60);
    }
  });

  it('lässt die Blinds stehen, wenn man das will', () => {
    const s = baueStruktur({ ...grund, dauer_min: 120, tempo: 'normal', gleichbleibend: true });
    expect(s.faktor).toBe(1);
    expect(new Set(s.stufen.map((x) => x.bb)).size).toBe(1);
    expect(s.finale_moeglich).toBe(false);
  });
});

describe('Welche Stufe gerade läuft', () => {
  const v = verteile({ sorten: KOFFER_300, spieler: 6 })!;
  const s = baueStruktur({
    startchips: v.startchips, spieler: 6, kleinsterChip: v.smallBlind,
    dauer_min: 120, tempo: 'normal',
  });

  it('beginnt bei der ersten', () => {
    expect(stufeBei(s, 0).index).toBe(0);
    expect(stufeBei(s, 0).rest_s).toBe(s.stufendauer_s);
  });

  it('wechselt genau am Stufenende', () => {
    expect(stufeBei(s, s.stufendauer_s - 1).index).toBe(0);
    expect(stufeBei(s, s.stufendauer_s).index).toBe(1);
  });

  it('bleibt bei der letzten stehen, statt darüber hinauszulaufen', () => {
    const weit = stufeBei(s, s.stufendauer_s * 1000);
    expect(weit.index).toBe(s.stufen.length - 1);
    expect(weit.letzte).toBe(true);
    expect(weit.rest_s).toBeGreaterThanOrEqual(0);
  });
});
