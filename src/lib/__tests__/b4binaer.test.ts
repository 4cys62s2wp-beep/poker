/* Die Binärdatei gegen die Quelle, aus der sie gemacht wurde.
   ==========================================================

   Ein Binärformat ist eine Wette: Alles hängt daran, dass Erzeuger und Leser
   denselben Aufbau meinen. Geht ein Byte verloren, verschiebt sich alles
   danach — und die Zahlen sähen trotzdem aus wie Zahlen. Ein Flushdraw mit
   61 % Equity fällt niemandem auf, der nicht nachrechnet.

   Deshalb wird hier nachgerechnet, und zwar gegen die **Rechenausgabe
   selbst** (`tools/poker-math/output/b4_preflop_equity.json`) — nicht gegen
   die Anzeigefassung, die aus derselben Umwandlung stammt und denselben
   Fehler tragen könnte.

   Die Stichprobe ist über alle 14 365 Handpaare gestreut, nicht am Anfang
   entnommen: Ein Fehler in der Versatzrechnung träfe die späten Paare
   zuerst. Toleranz ist **ein Basispunkt** — mehr ist ein Fehler, nicht eine
   Rundung. */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { KENNUNG, VERSION, leseMatrix } from '../pokermath/b4binaer';
import { pruefeMatchups } from '../pokermath/laden';

interface QuellKonfiguration {
  beziehung: { de: string; en: string };
  haeufigkeit: number;
  equity_a: number;
}

interface QuellMatchup {
  hand_a: string;
  hand_b: string;
  equity_a: number;
  spanne_pp: number;
  spanne_relevant: boolean;
  farbkonfigurationen: QuellKonfiguration[];
}

const QUELLE = 'tools/poker-math/output/b4_preflop_equity.json';
const BINAER = 'public/pokermath/b4_preflop_equity.bin';

const quelle: QuellMatchup[] = JSON.parse(readFileSync(QUELLE, 'utf8')).matchups;

/** Die Datei als ArrayBuffer, so wie sie im Browser ankommt. */
function alsPuffer(): ArrayBuffer {
  const roh = readFileSync(BINAER);
  return roh.buffer.slice(roh.byteOffset, roh.byteOffset + roh.byteLength) as ArrayBuffer;
}

const matrix = leseMatrix(alsPuffer());

/** Ein Basispunkt als Anteil — die Grenze, ab der es ein Fehler ist. */
const EIN_BASISPUNKT = 1 / 10000;

describe('Die Binärdatei ist vollständig', () => {
  it('trägt jedes Handpaar der Quelle', () => {
    expect(matrix).toHaveLength(quelle.length);
    expect(matrix.length).toBe(169 * 170 / 2);
  });

  it('trägt jedes Handpaar in derselben Reihenfolge', () => {
    /* Die Reihenfolge ist kein Zufall, sondern der Index: Wer sie ändert,
       verschiebt jede Konfiguration. */
    for (let i = 0; i < quelle.length; i += 1) {
      expect(`${matrix[i].a}|${matrix[i].b}`).toBe(`${quelle[i].hand_a}|${quelle[i].hand_b}`);
    }
  });

  it('trägt genauso viele Farbkonfigurationen, wie die Quelle kennzeichnet', () => {
    const ausQuelle = quelle.filter((m) => m.spanne_relevant)
      .reduce((n, m) => n + m.farbkonfigurationen.length, 0);
    const ausBinaer = matrix.reduce((n, m) => n + (m.farbkonfigurationen?.length ?? 0), 0);
    expect(ausBinaer).toBe(ausQuelle);
  });

  it('kennzeichnet dieselben Handpaare als spannenrelevant', () => {
    const abweichend = quelle
      .map((m, i) => ({ i, quelle: m.spanne_relevant, binaer: matrix[i].spanne_relevant }))
      .filter((x) => x.quelle !== x.binaer);
    expect(abweichend).toEqual([]);
  });

  it('nennt sich selbst beim Namen', () => {
    const kopf = readFileSync(BINAER).subarray(0, 5);
    expect(String.fromCharCode(...kopf.subarray(0, 4))).toBe(KENNUNG);
    expect(kopf[4]).toBe(VERSION);
  });
});

/**
 * Eine über die ganze Liste gestreute Stichprobe.
 *
 * Nicht zufällig: Ein Test, der bei jedem Lauf andere Paare prüft, ist bei
 * jedem Lauf ein anderer Test — und der eine rote Lauf lässt sich dann nicht
 * wiederholen. Ein fester Schritt über die Liste trifft Anfang, Mitte und
 * Ende gleichermaßen.
 */
const SCHRITT = 97;   // teilerfremd zu 14 365, läuft also durch alle Bereiche
const STICHPROBE = Array.from(
  { length: Math.floor(14365 / SCHRITT) },
  (_, n) => n * SCHRITT,
);

describe('Jeder Wert der Stichprobe stimmt mit der Quelle überein', () => {
  it(`prüft ${STICHPROBE.length} über die ganze Matrix verteilte Handpaare`, () => {
    expect(STICHPROBE.length).toBeGreaterThanOrEqual(100);
    expect(STICHPROBE[STICHPROBE.length - 1]).toBeGreaterThan(14000);
  });

  it.each(STICHPROBE.map((i) => [`${quelle[i].hand_a} gegen ${quelle[i].hand_b}`, i]))(
    '%s',
    (_name, i) => {
      const q = quelle[i as number];
      const b = matrix[i as number];

      expect(b.a).toBe(q.hand_a);
      expect(b.b).toBe(q.hand_b);
      expect(Math.abs(b.equity_a - q.equity_a),
        `Equity weicht um mehr als einen Basispunkt ab: `
        + `${b.equity_a} gegen ${q.equity_a}`).toBeLessThanOrEqual(EIN_BASISPUNKT);

      if (!q.spanne_relevant) {
        expect(b.farbkonfigurationen).toBeUndefined();
        expect(Math.abs(b.spanne_pp - q.spanne_pp)).toBeLessThanOrEqual(0.01);
        return;
      }

      expect(b.farbkonfigurationen).toHaveLength(q.farbkonfigurationen.length);
      q.farbkonfigurationen.forEach((qk, k) => {
        const bk = b.farbkonfigurationen![k];
        expect(bk.beziehung.de, `Beziehung ${k}`).toBe(qk.beziehung.de);
        expect(bk.beziehung.en, `Beziehung ${k}`).toBe(qk.beziehung.en);
        expect(bk.haeufigkeit, `Häufigkeit ${k}`).toBe(qk.haeufigkeit);
        expect(Math.abs(bk.equity_a - qk.equity_a),
          `Konfiguration ${k}: ${bk.equity_a} gegen ${qk.equity_a}`)
          .toBeLessThanOrEqual(EIN_BASISPUNKT);
      });
    },
  );
});

describe('Auch außerhalb der Stichprobe hält die Grenze', () => {
  it('weicht bei keinem einzigen der 14 365 Handpaare um mehr als einen Basispunkt ab', () => {
    /* Die Stichprobe ist zum Lesen da, dieser Test zum Sicherstellen. Über
       alle Werte zu laufen kostet Millisekunden — eine Stichprobe wäre hier
       Bequemlichkeit, nicht Sparsamkeit. */
    const schlimmste = { i: -1, abweichung: 0 };
    for (let i = 0; i < quelle.length; i += 1) {
      const d = Math.abs(matrix[i].equity_a - quelle[i].equity_a);
      if (d > schlimmste.abweichung) { schlimmste.i = i; schlimmste.abweichung = d; }
    }
    expect(schlimmste.abweichung,
      schlimmste.i < 0 ? 'keine' : `größte Abweichung bei ${quelle[schlimmste.i].hand_a} `
        + `gegen ${quelle[schlimmste.i].hand_b}`).toBeLessThanOrEqual(EIN_BASISPUNKT);
  });

  it('hält die Grenze auch für jede einzelne Farbkonfiguration', () => {
    let schlimmste = 0;
    for (let i = 0; i < quelle.length; i += 1) {
      const konf = matrix[i].farbkonfigurationen;
      if (!konf) continue;
      konf.forEach((bk, k) => {
        schlimmste = Math.max(schlimmste,
          Math.abs(bk.equity_a - quelle[i].farbkonfigurationen[k].equity_a));
      });
    }
    expect(schlimmste).toBeLessThanOrEqual(EIN_BASISPUNKT);
  });
});

describe('Die gelesene Matrix besteht dieselbe Prüfung wie früher das JSON', () => {
  it('geht unverändert durch pruefeMatchups', () => {
    /* Der Binärleser baut die Liste — geprüft wird sie danach trotzdem, mit
       derselben Funktion wie zuvor. Einem Format, dem man beim Lesen glaubt,
       sieht man seine Fehler erst auf dem Bildschirm an. */
    const geprueft = pruefeMatchups(matrix);
    expect(geprueft).toHaveLength(matrix.length);
  });
});

/* ---------------------------------------------------------------------------
   Was das Format wirklich bringt
   ---------------------------------------------------------------------------
   `npm run binaer` misst Größe und Ladezeit im echten Browser und schreibt
   das Ergebnis nach `docs/binaerformat.json`. Dieser Test hält es fest — vor
   allem die Zahl, die man am leichtesten schönredet: die gepackte Größe. */

interface Messung {
  gemessen_am: string;
  laeufe: number;
  groesse: {
    vorher: { roh_byte: number; gepackt_byte: number };
    nachher: {
      binaer_roh_byte: number; binaer_gepackt_byte: number;
      kopf_roh_byte: number; kopf_gepackt_byte: number;
      roh_byte: number; gepackt_byte: number;
    };
    faktor_roh: number;
    faktor_gepackt: number;
  };
  ladezeit: {
    json: { median_ms: number };
    binaer: { median_ms: number };
    faktor: number;
  };
  handpaare: number;
  konfigurationen_ausgeliefert: number;
}

describe('Die Messung zum Binärformat', () => {
  const M: Messung = JSON.parse(readFileSync('docs/binaerformat.json', 'utf8'));

  it('passt zu der Datei, die wirklich ausgeliefert wird', () => {
    /* Eine Messung, die zu einer älteren Fassung gehört, ist schlimmer als
       keine: Sie sieht aus wie ein Nachweis. */
    expect(M.groesse.nachher.binaer_roh_byte).toBe(readFileSync(BINAER).length);
    expect(M.handpaare).toBe(matrix.length);
  });

  it('vergleicht gegen die vollständige alte Fassung, nicht gegen einen Auszug', () => {
    /* Die alte Fassung wird für den Vergleich eigens noch einmal erzeugt.
       Wäre sie kleiner als die echte, schmeichelte der Vergleich. */
    expect(M.groesse.vorher.roh_byte).toBeGreaterThan(4_000_000);
  });

  it('misst auch die gepackte Größe — sonst schmeichelt der Vergleich', () => {
    /* Jeder ernsthafte Hoster komprimiert. Wer nur roh gegen roh vergleicht,
       rechnet sich einen Faktor schön, den der Nutzer nie sieht. */
    expect(M.groesse.vorher.gepackt_byte).toBeGreaterThan(0);
    expect(M.groesse.nachher.gepackt_byte).toBeGreaterThan(0);
    expect(M.groesse.nachher.gepackt_byte).toBeLessThan(M.groesse.vorher.gepackt_byte);
  });

  it('bleibt roh unter einem Viertel Megabyte', () => {
    /* Das ist die Zahl, die im Gerät liegt und die der Service Worker
       offline vorhält. */
    expect(M.groesse.nachher.roh_byte).toBeLessThan(256 * 1024);
  });

  it('bleibt gepackt unter 150 KB', () => {
    /* Das ist die Zahl, die über die Leitung geht. */
    expect(M.groesse.nachher.gepackt_byte).toBeLessThan(150 * 1024);
  });

  it('lädt und wertet schneller aus als das JSON', () => {
    expect(M.ladezeit.binaer.median_ms).toBeLessThan(M.ladezeit.json.median_ms);
    expect(M.ladezeit.faktor).toBeGreaterThan(2);
  });

  it('misst mehrfach und nennt den Median', () => {
    /* Ein einzelner Lauf misst den Zufall des Augenblicks. */
    expect(M.laeufe).toBeGreaterThanOrEqual(5);
  });
});
