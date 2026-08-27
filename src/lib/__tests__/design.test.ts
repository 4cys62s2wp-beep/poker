/* Das Designfundament, nachgemessen.
   =================================

   Diese Datei prüft keine Absichten, sondern Werte — und sie liest sie aus
   `global.css`, nicht aus einer zweiten Liste. Eine Farbtabelle im Test wäre
   genau die Stelle, an der später der Kontrast stimmt und die App trotzdem
   schlecht lesbar ist.

   Vier Regeln stehen hier:
   1. Kontrast: Ergebniszahlen 7 zu 1, alles Übrige 4,5 zu 1.
   2. Die Fünferskala existiert und ist gestuft.
   3. Berührflächen: 44 Punkt, 8 Punkt Abstand.
   4. Der Altbestand wächst nicht — verstreute Zahlenwerte werden gezählt
      und dürfen nicht mehr werden. */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { KONTRAST_ERGEBNIS, KONTRAST_UEBRIG, kontrast } from '../design/kontrast';
import { summe, zaehleStreuung } from '../design/streuung';

const CSS = readFileSync('src/styles/global.css', 'utf8');

/** Alle Tokens aus dem `:root`-Block, roh wie sie dastehen. */
function tokens(): Record<string, string> {
  const anfang = CSS.indexOf(':root');
  const ende = CSS.indexOf('\n}', anfang);
  const block = CSS.slice(anfang, ende);
  const aus: Record<string, string> = {};
  for (const treffer of block.matchAll(/^\s*(--[a-z0-9-]+):\s*([^;]+);/gm)) {
    aus[treffer[1]] = treffer[2].trim();
  }
  return aus;
}

const T = tokens();

/** Einen Token bis zu einem festen Wert auflösen (`var(--x)` folgen). */
function wert(name: string, tiefe = 0): string {
  const roh = T[name];
  if (roh === undefined) throw new Error(`Token ${name} gibt es nicht`);
  const verweis = roh.match(/^var\((--[a-z0-9-]+)\)$/);
  if (verweis) {
    if (tiefe > 5) throw new Error(`${name} verweist im Kreis`);
    return wert(verweis[1], tiefe + 1);
  }
  return roh;
}

// ---------------------------------------------------------------------------

describe('Kontrast — gerechnet, nicht behauptet', () => {
  const GRUND = ['--bg', '--bg-card'] as const;

  it('rechnet richtig (die Prüfung prüft sich selbst)', () => {
    // Die beiden Extreme der Norm.
    expect(kontrast('#000000', '#ffffff')).toBeCloseTo(21, 2);
    expect(kontrast('#777777', '#777777')).toBeCloseTo(1, 6);
  });

  it.each(['--ergebnis-gut', '--ergebnis-schlecht'])(
    '%s erreicht 7 zu 1 auf jedem Grund', (name) => {
      for (const grund of GRUND) {
        expect(kontrast(wert(name), wert(grund))).toBeGreaterThanOrEqual(KONTRAST_ERGEBNIS);
      }
    });

  it.each(['--akzent', '--text', '--text-dim', '--text-faint', '--text-stark', '--auszeichnung'])(
    '%s erreicht 4,5 zu 1 auf jedem Grund', (name) => {
      for (const grund of GRUND) {
        expect(kontrast(wert(name), wert(grund))).toBeGreaterThanOrEqual(KONTRAST_UEBRIG);
      }
    });

  it('erkennt eine zu blasse Farbe', () => {
    /* Der alte Live-Akzent lag bei 3,92 zu 1 und war damit als Text nicht
       zulässig. Genau dieser Fall soll auffallen. */
    expect(kontrast('#2f7f5e', wert('--bg'))).toBeLessThan(KONTRAST_UEBRIG);
  });
});

describe('Die Fünferskala', () => {
  const STUFEN = ['--fs-ergebnis', '--fs-ueberschrift', '--fs-fliesstext',
    '--fs-beschriftung', '--fs-kleingedrucktes'] as const;

  it('hat genau fünf Stufen, alle vorhanden', () => {
    for (const s of STUFEN) expect(wert(s)).toBeTruthy();
  });

  /** Kleinster Wert einer Angabe: aus `clamp(a, b, c)` das a, sonst die Zahl. */
  function kleinste(px: string): number {
    const zahlen = [...px.matchAll(/([\d.]+)px/g)].map((m) => Number(m[1]));
    if (zahlen.length === 0) throw new Error(`Keine Pixelangabe in "${px}"`);
    return Math.min(...zahlen);
  }

  it('ist durchgehend absteigend', () => {
    const werte = STUFEN.map((s) => kleinste(wert(s)));
    for (let i = 1; i < werte.length; i += 1) {
      expect(werte[i]).toBeLessThan(werte[i - 1]);
    }
  });

  it('setzt „Ergebnis" um ein Vielfaches über „Fließtext"', () => {
    /* Die Vorgabe lautet „um ein Vielfaches". Vier ist die untere Grenze
       dessen, was man so nennen kann — bei drei sieht es nach Überschrift
       aus, nicht nach Ergebnis. */
    const verhaeltnis = kleinste(wert('--fs-ergebnis')) / kleinste(wert('--fs-fliesstext'));
    expect(verhaeltnis).toBeGreaterThanOrEqual(4);
  });

  it('kennt eine Ziffernbreite für ruhige Anzeigen', () => {
    expect(wert('--ziffern')).toContain('tabular-nums');
  });
});

describe('Berührflächen', () => {
  it('hält 44 Punkt und 8 Punkt Abstand', () => {
    expect(Number(wert('--tipp-min').replace('px', ''))).toBeGreaterThanOrEqual(44);
    expect(Number(wert('--tipp-abstand').replace('px', ''))).toBeGreaterThanOrEqual(8);
  });

  it('hält den unteren Rand für Systemgesten frei', () => {
    expect(Number(wert('--gestenstreifen').replace('px', ''))).toBeGreaterThan(0);
  });

  it('führt --touch-min auf denselben Wert', () => {
    /* Zwei Namen für dieselbe Sache sind erlaubt, zwei Werte nicht. */
    expect(wert('--touch-min')).toBe(wert('--tipp-min'));
  });
});

// ---------------------------------------------------------------------------
// Sperrklinke gegen verstreute Gestaltungswerte
// ---------------------------------------------------------------------------

describe('Verstreute Zahlenwerte werden nicht mehr', () => {
  const basis: Record<string, number> = JSON.parse(
    readFileSync('src/lib/design/streuung-basis.json', 'utf8'));

  function alleDateien(pfad: string, aus: string[] = []): string[] {
    for (const eintrag of readdirSync(pfad)) {
      const voll = join(pfad, eintrag);
      if (statSync(voll).isDirectory()) alleDateien(voll, aus);
      else if (voll.endsWith('.tsx')) aus.push(voll);
    }
    return aus;
  }

  const heute: Record<string, number> = {};
  for (const ordner of ['src/pages', 'src/components']) {
    for (const datei of alleDateien(ordner)) {
      const n = summe(zaehleStreuung(readFileSync(datei, 'utf8')));
      if (n > 0) heute[datei] = n;
    }
  }

  it('erkennt einen verstreuten Wert (die Prüfung prüft sich selbst)', () => {
    expect(summe(zaehleStreuung('<div style={{ padding: 14 }} />'))).toBe(1);
    expect(summe(zaehleStreuung('<div style={{ padding: "var(--sp-4)" }} />'))).toBe(0);
    expect(zaehleStreuung('const c = "#ff0000";').farben).toBe(1);
    expect(zaehleStreuung('font-size: var(--fs-h1);').alteStufen).toBe(1);
  });

  it('keine Datei enthält mehr Werte als festgehalten', () => {
    const gewachsen = Object.entries(heute)
      .filter(([datei, n]) => n > (basis[datei] ?? 0))
      .map(([datei, n]) => `${datei}: ${basis[datei] ?? 0} → ${n}`);
    expect(gewachsen, 'Neue verstreute Werte. Entweder Tokens verwenden oder '
      + '`npm run streuung` aufrufen und die Begründung dazuschreiben.').toEqual([]);
  });

  it('keine neue Datei fängt mit verstreuten Werten an', () => {
    const neu = Object.keys(heute).filter((d) => !(d in basis));
    expect(neu, 'Neu gebaute Bildschirme verwenden ausschließlich Tokens.').toEqual([]);
  });

  it('hält den Gesamtstand fest, damit die Richtung sichtbar bleibt', () => {
    const jetzt = Object.values(heute).reduce((a, b) => a + b, 0);
    const fest = Object.values(basis).reduce((a, b) => a + b, 0);
    expect(jetzt).toBeLessThanOrEqual(fest);
  });
});
