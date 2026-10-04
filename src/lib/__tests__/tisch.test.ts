/* Das Tischgerät — gemessen, nicht behauptet.
   =========================================

   Zwei Regeln aus dem Auftrag gelten für das Gerät, das in der Tischmitte
   liegt: Es zeigt **höchstens drei Angaben**, und seine Schrift ist **aus
   zwei Metern lesbar**. Beides sind Aussagen über das gerenderte Ergebnis,
   nicht über den Quelltext — eine Schriftgröße aus `clamp()` kennt man erst,
   wenn ein Browser sie ausgerechnet hat.

   Gemessen wird deshalb mit `npm run tisch` in einem echten Browser, bei
   fünf Geräten (Handy hochkant, Tablet quer, Handy quer in drei Größen) und
   sechs Zuständen (bereit, pausiert, knapp, letzte Stufe, Wechsel, Cash). Das
   Ergebnis liegt in `docs/tisch.json`. Dieser Test hält es fest.

   Die nötige Schriftgröße ist keine gesetzte Zahl. Sie wird aus Leseabstand,
   Sehwinkel und Versalhöhe ausgerechnet; der Test rechnet sie hier ein
   zweites Mal nach, damit sie nicht unbemerkt zu einer Behauptung wird. */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

interface Text {
  text: string;
  klasse: string;
  schriftgroesse_px: number;
  farbe: string;
  links_px: number;
  rechts_px: number;
  unten_px: number;
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
  zustand: string;
  breite: number;
  fensterhoehe_px: number;
  fensterbreite_px: number;
  kopf_bedienung: Array<{ text: string; breite_px: number; hoehe_px: number; oben_px: number }>;
  bedienleiste_oben_px: number | null;
  tisch_farbe: string;
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

/** Die Klasse ohne Zusatz („tisch-zeit knapp" → „tisch-zeit"). */
const ist = (a: { klasse: string }, k: string) => a.klasse.split(' ')[0] === k;

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

describe.each(T.messungen)('Tischgerät bei $breite px ($geraet, $zustand)', (m) => {
  /* Der Cash-Abend hat keinen Countdown und kein „Danach": zwei Angaben (E-094). */
  const erwartet = m.zustand === 'cash'
    ? ['tisch-blinds', 'tisch-zeit']
    : ['tisch-blinds', 'tisch-naechste', 'tisch-zeit'];

  it('zeigt höchstens drei Angaben mit Zahlen', () => {
    /* Der eigentliche Sinn der Regel: Jede vierte Angabe nimmt den drei
       übrigen die Größe weg, und Größe ist auf diesem Gerät die Leistung. */
    expect(m.angaben.map((a) => a.text)).toHaveLength(erwartet.length);
  });

  it('zeigt genau die, um die es geht: Blinds, Restzeit, danach', () => {
    const klassen = m.angaben.map((a) => a.klasse.split(' ')[0]).sort();
    expect(klassen).toEqual(erwartet);
  });

  it('schreibt jede davon groß genug für zwei Meter Abstand', () => {
    for (const a of m.angaben) {
      expect(a.schriftgroesse_px, `„${a.text}" (${a.klasse})`)
        .toBeGreaterThanOrEqual(T.leseabstand.noetige_schriftgroesse_px);
    }
  });

  it('macht die Restzeit zur größten Zahl', () => {
    /* Sie ist der Grund, warum das Gerät überhaupt in der Mitte liegt. */
    const zeit = m.angaben.find((a) => ist(a, 'tisch-zeit'))!;
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

  it('zeigt alle Angaben vollständig im Bild und über der Bedienleiste', () => {
    /* Quer standen die Blinds 98 Pixel über dem Bildrand und „Danach" halb
       unter dem Knopf (FAHRPLAN 7.2). */
    for (const a of m.angaben) {
      expect(a.links_px, `„${a.text}" links`).toBeGreaterThanOrEqual(0);
      expect(a.rechts_px, `„${a.text}" rechts`).toBeLessThanOrEqual(m.fensterbreite_px);
      expect(a.oben_px, `„${a.text}" oben`).toBeGreaterThanOrEqual(0);
      expect(a.unten_px, `„${a.text}" unten`).toBeLessThanOrEqual(m.bedienleiste_oben_px!);
    }
  });

  it('hat höchstens drei Bedienknöpfe unten, alle groß genug zum Treffen', () => {
    /* Die Dreierregel begrenzt die *Angaben*, nicht die Bedienung — sie
       schützt die Schriftgröße, und Knöpfe stehen unten und nehmen den
       Zahlen keinen Platz. Trotzdem eine Obergrenze (Regel 8.1): Drei
       nebeneinander füllen die Breite bei 390 px aus; ein vierter würde jeden
       auf unter eine Fingerbreite drücken. */
    expect(m.knoepfe.length).toBeGreaterThanOrEqual(2);
    expect(m.knoepfe.length).toBeLessThanOrEqual(3);
    for (const k of m.knoepfe) {
      expect(k.hoehe_px, k.text).toBeGreaterThanOrEqual(TIPP_MIN);
      expect(k.breite_px, k.text).toBeGreaterThanOrEqual(TIPP_MIN);
    }
  });

  it('lässt oben links einen Weg aus dem Tisch, der nichts beendet', () => {
    /* Vorher führte bei laufender Runde nichts hinaus außer „Beenden". */
    const weg = m.kopf_bedienung.find((k) => /App/.test(k.text));
    expect(weg, 'Link „App" im Kopf').toBeDefined();
    expect(weg!.hoehe_px).toBeGreaterThanOrEqual(TIPP_MIN);
    expect(weg!.oben_px).toBeLessThan(m.fensterhoehe_px / 2);
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

const von = (zustand: string) => T.messungen.filter((m) => m.zustand === zustand);

describe('Die Zustände des Tischgeräts (FAHRPLAN 7.4, 7.3, 7.6)', () => {
  it('färbt die Restzeit der letzten Minute anders als die Blinds', () => {
    /* In Akzentgrün stand sie wie die Blinds da: Man las „knapp" nicht. */
    for (const m of von('knapp')) {
      const zeit = m.angaben.find((a) => ist(a, 'tisch-zeit'))!;
      const blinds = m.angaben.find((a) => ist(a, 'tisch-blinds'))!;
      expect(zeit.farbe, m.geraet).not.toBe(blinds.farbe);
    }
  });

  it('lässt die Zeit in der Pause in der Textfarbe — Zurücktreten heißt nicht verblassen', () => {
    for (const m of von('pausiert')) {
      const zeit = m.angaben.find((a) => ist(a, 'tisch-zeit'))!;
      expect(zeit.farbe, m.geraet).toBe(m.tisch_farbe);
    }
  });

  it('schreibt „Pausiert" und „Bereit" aus zwei Metern lesbar', () => {
    for (const z of ['pausiert', 'bereit']) {
      for (const m of von(z)) {
        const wort = m.alle_texte.find((t) => ist(t, 'tisch-pausiert'));
        expect(wort, `${m.geraet}/${z}`).toBeDefined();
        expect(wort!.schriftgroesse_px, `${m.geraet}/${z}`).toBeGreaterThanOrEqual(T.leseabstand.noetige_schriftgroesse_px);
      }
    }
  });

  it('nennt die Marke nach einem Stufenwechsel „Neue Blinds"', () => {
    for (const m of von('wechsel')) {
      const marke = m.alle_texte.filter((t) => ist(t, 'tisch-marke')).map((t) => t.text);
      expect(marke, m.geraet).toContain('Neue Blinds');
    }
  });

  it('zählt auf der letzten Stufe „seit …" hoch', () => {
    for (const m of von('letzte-stufe')) {
      const danach = m.angaben.find((a) => ist(a, 'tisch-naechste'))!;
      expect(danach.text, m.geraet).toMatch(/^seit \d/);
    }
  });

  it('zeigt im Cash-Abend die gespielte Zeit und kein „Danach"', () => {
    for (const m of von('cash')) {
      expect(m.angaben.map((a) => a.klasse.split(' ')[0]), m.geraet).not.toContain('tisch-naechste');
      expect(m.alle_texte.some((t) => t.text === 'Gespielt'), m.geraet).toBe(true);
    }
  });

  it('misst jeden Zustand auf jedem Gerät', () => {
    for (const z of ['bereit', 'pausiert', 'knapp', 'letzte-stufe', 'wechsel', 'cash']) {
      expect(von(z).length, z).toBeGreaterThanOrEqual(5);
    }
  });
});

describe('Beide Geräterollen sind gemessen', () => {
  it('deckt Handy und Tablet ab', () => {
    const namen = T.messungen.map((m) => m.geraet);
    expect(namen).toContain('handy');
    expect(namen).toContain('tablet-quer');
  });

  it('deckt das Handy quer in drei Größen ab (844×390, 932×430, 667×375)', () => {
    const quer = new Set(T.messungen.filter((m) => m.geraet.startsWith('handy-quer'))
      .map((m) => `${m.fensterbreite_px}x${m.fensterhoehe_px}`));
    expect([...quer].sort()).toEqual(['667x375', '844x390', '932x430']);
  });

  it('misst das Handy bei der Breite, für die die App gebaut ist', () => {
    expect(T.messungen.find((m) => m.geraet === 'handy' && m.zustand === 'bereit')!.breite).toBeLessThanOrEqual(430);
  });
});
