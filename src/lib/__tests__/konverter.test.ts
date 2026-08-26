/* Das Umwandlungsskript, bevor es gebraucht wird.
   ==============================================

   `npm run daten` nimmt die Rechenergebnisse und schreibt daraus die
   Anzeigefassung. Für B4 — die Preflop-Equity-Matrix — ist dieser Weg
   gebaut, aber noch nie gelaufen: Der Rechenlauf dauert Stunden, und die
   Datei entsteht erst am Ende.

   Das ist die schlechteste Zeit für einen Fehler. Wer nach vier Stunden
   Rechnung merkt, dass der Umwandler ein Feld anders nennt als der
   Generator, hat die vier Stunden nicht verloren — aber die Nacht.

   Dieser Test lässt das Skript deshalb jetzt schon laufen, gegen eine
   kleine, von Hand gebaute Probedatei mit drei Handpaaren, und gibt das
   Ergebnis der echten Ladeprüfung der App zu fressen. Was hier grün ist,
   scheitert später nicht mehr an der Form. */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { pruefeB4 } from '../pokermath/laden';

const PROBE = 'src/lib/__tests__/proben/b4_preflop_equity.json';

let arbeit = '';
let ausgabe: unknown;
let swText = '';

beforeAll(() => {
  arbeit = mkdtempSync(join(tmpdir(), 'pokermath-probe-'));
  const quelle = join(arbeit, 'quelle');
  const ziel = join(arbeit, 'ziel');
  const sw = join(arbeit, 'sw.js');

  execFileSync('mkdir', ['-p', quelle, ziel]);
  writeFileSync(join(quelle, 'b4_preflop_equity.json'), readFileSync(PROBE));
  /* Der Service Worker wird mitgeschrieben; für die Probe reicht eine Datei
     mit den beiden Zeilen, die das Skript ersetzt. */
  writeFileSync(sw, "const DATEN_STAND = 'alt';\nconst DATEN_DATEIEN = [];\n");

  execFileSync('node', ['scripts/pokermath-app-daten.mjs'], {
    env: {
      ...process.env,
      POKERMATH_QUELLE: quelle,
      POKERMATH_ZIEL: ziel,
      POKERMATH_SW: sw,
    },
    encoding: 'utf8',
  });

  ausgabe = JSON.parse(readFileSync(join(ziel, 'b4_preflop_equity.json'), 'utf8'));
  swText = readFileSync(sw, 'utf8');
});

afterAll(() => {
  if (arbeit && existsSync(arbeit)) rmSync(arbeit, { recursive: true, force: true });
});

describe('Der B4-Weg von der Rechenausgabe in die App', () => {
  it('läuft überhaupt durch', () => {
    expect(ausgabe).toBeTypeOf('object');
  });

  it('liefert etwas, das die Ladeprüfung der App annimmt', () => {
    /* Dieselbe Funktion, die im Browser läuft — keine nachgebaute. */
    const d = pruefeB4(ausgabe);
    expect(d.matchups).toHaveLength(3);
    expect(d.befunde).toHaveLength(1);
  });

  it('bringt Farbkonfigurationen genau dort mit, wo die Spanne zählt', () => {
    for (const m of pruefeB4(ausgabe).matchups) {
      expect(m.spanne_relevant, `${m.a} gegen ${m.b}`)
        .toBe(m.farbkonfigurationen !== undefined);
    }
  });

  it('gibt einer Hand gegen sich selbst genau die Hälfte', () => {
    const selbst = pruefeB4(ausgabe).matchups.filter((m) => m.a === m.b);
    expect(selbst.length).toBeGreaterThan(0);
    for (const m of selbst) expect(Math.abs(m.equity_a - 0.5)).toBeLessThan(1e-9);
  });

  it('nimmt die Herkunft mit — sonst kann die App „Warum diese Zahl" nicht beantworten', () => {
    const h = (ausgabe as { herkunft: Record<string, unknown> }).herkunft;
    expect(h.methode).toBe('exakt');
    expect((h.zweck as { de: string }).de).toMatch(/Probedatei/);
    expect((h.faelle_enumeriert as { gesamt: number }).gesamt).toBe(3);
    expect(h.quelle).toBe('tools/poker-math/output/b4_preflop_equity.json');
  });

  it('trägt die Befunde zweisprachig ein', () => {
    const b = pruefeB4(ausgabe).befunde[0];
    expect(b.aussage.de).toMatch(/50,0 %/);
    expect(b.aussage.en).toMatch(/50\.0 %/);
  });

  it('setzt den Service Worker auf den neuen Datenstand', () => {
    /* Bliebe der Cache-Name gleich, zeigte ein installiertes Gerät nach neuen
       Zahlen weiter die alten — und das fällt bei einer Zahl niemandem auf. */
    expect(swText).not.toMatch(/DATEN_STAND = 'alt'/);
    expect(swText).toMatch(/DATEN_DATEIEN = \['\.\/pokermath\/b4_preflop_equity\.json'\]/);
  });
});

describe('Das Skript bricht ab, statt eine halbe Sammlung zu schreiben', () => {
  it('schreibt nichts, wenn ein Pflichtfeld fehlt', () => {
    const kaputt = mkdtempSync(join(tmpdir(), 'pokermath-kaputt-'));
    try {
      const quelle = join(kaputt, 'quelle');
      const ziel = join(kaputt, 'ziel');
      execFileSync('mkdir', ['-p', quelle, ziel]);

      const d = JSON.parse(readFileSync(PROBE, 'utf8'));
      delete d.matchups[0].equity_a;
      writeFileSync(join(quelle, 'b4_preflop_equity.json'), JSON.stringify(d));
      writeFileSync(join(kaputt, 'sw.js'), "const DATEN_STAND = 'alt';\nconst DATEN_DATEIEN = [];\n");

      let gescheitert = false;
      let meldung = '';
      try {
        execFileSync('node', ['scripts/pokermath-app-daten.mjs'], {
          env: {
            ...process.env,
            POKERMATH_QUELLE: quelle,
            POKERMATH_ZIEL: ziel,
            POKERMATH_SW: join(kaputt, 'sw.js'),
          },
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'pipe'],
        });
      } catch (e) {
        gescheitert = true;
        meldung = String((e as { stderr?: string }).stderr ?? '');
      }

      expect(gescheitert, 'Ein fehlendes Pflichtfeld muss den Lauf abbrechen').toBe(true);
      expect(meldung).toMatch(/ABBRUCH – nichts geschrieben/);
      /* Und zwar wirklich nichts: Eine halb erzeugte Sammlung sieht
         vollständig aus, und die App ließe einen Teil der Zahlen stumm weg. */
      expect(existsSync(join(ziel, 'b4_preflop_equity.json'))).toBe(false);
      expect(readFileSync(join(kaputt, 'sw.js'), 'utf8')).toMatch(/DATEN_STAND = 'alt'/);
    } finally {
      rmSync(kaputt, { recursive: true, force: true });
    }
  });
});
