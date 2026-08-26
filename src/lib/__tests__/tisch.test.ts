/* Das Tischgerät — gemessen, nicht behauptet.
   =========================================

   Zwei Regeln aus dem Auftrag gelten für das Gerät, das in der Tischmitte
   liegt: Es zeigt **höchstens drei Angaben**, und seine Schrift ist **aus
   zwei Metern lesbar**. Beides sind Aussagen über das gerenderte Ergebnis,
   nicht über den Quelltext — eine Schriftgröße aus `clamp()` kennt man erst,
   wenn ein Browser sie ausgerechnet hat.

   Gemessen wird deshalb mit `npm run tisch` in einem echten Browser, bei
   zwei Breiten: Handy (390 px) und Tablet quer (1024 px). Das Ergebnis liegt
   in `docs/tisch.json`. Dieser Test hält es fest.

   Die nötige Schriftgröße ist keine gesetzte Zahl. Sie wird aus Leseabstand,
   Sehwinkel und Versalhöhe ausgerechnet; der Test rechnet sie hier ein
   zweites Mal nach, damit sie nicht unbemerkt zu einer Behauptung wird. */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

interface Text {
  text: string;
  klasse: string;
  schriftgroesse_px: number;
  fett: string;
  ziffern: string;
  oben_px: number;
  hoehe_px: number;
  breite_px: number;
}

interface Knopf {
  text: string;
  breite_px: number;
  hoehe_px: number;
  unterkante_abstand_px: number;
}

interface Messung {
  geraet: string;
  breite: number;
  fensterhoehe_px: number;
  navigationsleiste_vorhanden: boolean;
  alle_texte: Text[];
  angaben: Text[];
  knoepfe: Knopf[];
  seitlicher_ueberlauf_px: number;
  mitte_ueberlauf_px: number;
}

interface Tisch {
  erzeugt_am: string;
  leseabstand: {
    abstand_mm: number;
    sehwinkel_grad: number;
    versalhoehe_anteil: number;
    zeichenhoehe_mm: number;
    noetige_schriftgroesse_px: number;
    rechenweg: string;
  };
  groesste_angabe_px: number;
  messungen: Messung[];
}

const T: Tisch = JSON.parse(readFileSync('docs/tisch.json', 'utf8'));

/** Mindestgröße für einen Fingertipp und der Abstand dazwischen — dieselben
 *  Werte wie in `global.css`, dort begründet. */
const TIPP_MIN = 44;

describe('Die Leseentfernung ist gerechnet, nicht gesetzt', () => {
  it('lässt sich aus den mitgeschriebenen Größen nachrechnen', () => {
    const { abstand_mm, sehwinkel_grad, versalhoehe_anteil } = T.leseabstand;
    const zeichenhoehe_mm = abstand_mm * Math.tan((sehwinkel_grad * Math.PI) / 180);
    const px = zeichenhoehe_mm / versalhoehe_anteil / (25.4 / 96);
    expect(T.leseabstand.zeichenhoehe_mm).toBeCloseTo(zeichenhoehe_mm, 1);
    expect(T.leseabstand.noetige_schriftgroesse_px).toBeCloseTo(px, 1);
  });

  it('geht von zwei Metern aus — dem Abstand über einen Esstisch', () => {
    expect(T.leseabstand.abstand_mm).toBe(2000);
  });

  it('nennt seinen Rechenweg', () => {
    expect(T.leseabstand.rechenweg).toMatch(/tan/);
  });
});

describe.each(T.messungen)('Tischgerät bei $breite px ($geraet)', (m) => {
  it('zeigt höchstens drei Angaben mit Zahlen', () => {
    /* Der eigentliche Sinn der Regel: Jede vierte Angabe nimmt den drei
       übrigen die Größe weg, und Größe ist auf diesem Gerät die Leistung. */
    expect(m.angaben.map((a) => a.text)).toHaveLength(3);
  });

  it('zeigt genau die drei, um die es geht: Blinds, Restzeit, danach', () => {
    const klassen = m.angaben.map((a) => a.klasse).sort();
    expect(klassen).toEqual(['tisch-blinds', 'tisch-naechste', 'tisch-zeit']);
  });

  it('schreibt jede davon groß genug für zwei Meter Abstand', () => {
    for (const a of m.angaben) {
      expect(a.schriftgroesse_px, `„${a.text}" (${a.klasse})`)
        .toBeGreaterThanOrEqual(T.leseabstand.noetige_schriftgroesse_px);
    }
  });

  it('macht die Restzeit zur größten Zahl', () => {
    /* Sie ist der Grund, warum das Gerät überhaupt in der Mitte liegt. */
    const zeit = m.angaben.find((a) => a.klasse === 'tisch-zeit')!;
    for (const a of m.angaben) {
      if (a === zeit) continue;
      expect(zeit.schriftgroesse_px).toBeGreaterThan(a.schriftgroesse_px);
    }
  });

  it('setzt die Ziffern auf gleiche Breite', () => {
    /* Sonst springt die Uhr bei jedem Sekundenwechsel seitlich — aus zwei
       Metern sieht das aus wie ein Flackern. */
    for (const a of m.angaben) {
      expect(a.ziffern, a.klasse).toContain('tabular-nums');
    }
  });

  it('blendet die normale Navigationsleiste aus', () => {
    /* Wer den Tisch führt, soll nicht versehentlich ins Glossar wischen. */
    expect(m.navigationsleiste_vorhanden).toBe(false);
  });

  it('schneidet nichts ab und scrollt nirgendwo', () => {
    /* Auf dem Tischgerät scrollt niemand — es liegt flach und wird nicht
       angefasst. Eine halb abgeschnittene Zahl ist damit unlesbar. */
    expect(m.mitte_ueberlauf_px).toBe(0);
    expect(m.seitlicher_ueberlauf_px).toBe(0);
  });

  it('hat genau zwei Bedienknöpfe, beide groß genug zum Treffen', () => {
    expect(m.knoepfe).toHaveLength(2);
    for (const k of m.knoepfe) {
      expect(k.hoehe_px, k.text).toBeGreaterThanOrEqual(TIPP_MIN);
      expect(k.breite_px, k.text).toBeGreaterThanOrEqual(TIPP_MIN);
    }
  });

  it('lässt die Unterkante für die Systemgesten frei', () => {
    /* Ein Knopf direkt an der Unterkante wird zur Wischgeste des Systems,
       nicht zum Tipp auf den Knopf. */
    for (const k of m.knoepfe) {
      expect(k.unterkante_abstand_px, k.text).toBeGreaterThanOrEqual(8);
    }
  });

  it('stellt die Bedienung ins untere Drittel', () => {
    const drittel = m.fensterhoehe_px * (2 / 3);
    for (const k of m.knoepfe) {
      const oben = m.fensterhoehe_px - k.unterkante_abstand_px - k.hoehe_px;
      expect(oben, k.text).toBeGreaterThanOrEqual(drittel - k.hoehe_px);
    }
  });
});

describe('Beide Geräterollen sind gemessen', () => {
  it('deckt Handy und Tablet ab', () => {
    const namen = T.messungen.map((m) => m.geraet);
    expect(namen).toContain('handy');
    expect(namen).toContain('tablet-quer');
  });

  it('misst das Handy bei der Breite, für die die App gebaut ist', () => {
    expect(T.messungen.find((m) => m.geraet === 'handy')!.breite).toBeLessThanOrEqual(430);
  });
});
