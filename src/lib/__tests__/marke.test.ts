/* Eine Marke — in beiden Modi sichtbar, gleich auf Tab, Home-Bildschirm und App.
   ============================================================================

   Gefunden: Die Markenkachel hing an `--auszeichnung-lesbar`, der im hellen
   Modus dunkelbraun ist — Pik auf Grün 1,4 bis 1,6 zu 1. Daneben zeichnete
   `gen-icons.mjs` den Pik per Herzformel, und das Ergebnis sah anders aus als
   das SVG im Browser-Tab: zwei Marken (E-083). */

import { readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import { kontrast } from '../design/kontrast';

const CSS = readFileSync('src/styles/global.css', 'utf8');
const SVG = readFileSync('public/icons/icon.svg', 'utf8');
const ICON = readFileSync('src/components/Icon.tsx', 'utf8');

const token = (n: string) => CSS.match(new RegExp(`${n}:\\s*(#[0-9a-fA-F]{6});`))?.[1] ?? '';

/** Ein PNG lesen: 8 Bit, RGB oder RGBA, ohne Zeilenversatz. Genug für Icons. */
function dekodiere(datei: string): { b: number; h: number; px: (x: number, y: number) => [number, number, number, number] } {
  const buf = readFileSync(datei);
  let pos = 8;
  let b = 0; let h = 0; let farbtyp = 0;
  const idat: Buffer[] = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const typ = buf.toString('ascii', pos + 4, pos + 8);
    const daten = buf.subarray(pos + 8, pos + 8 + len);
    if (typ === 'IHDR') { b = daten.readUInt32BE(0); h = daten.readUInt32BE(4); farbtyp = daten[9]; }
    if (typ === 'IDAT') idat.push(daten);
    pos += 12 + len;
  }
  const kanaele = farbtyp === 6 ? 4 : 3;
  const roh = inflateSync(Buffer.concat(idat));
  const zeile = b * kanaele;
  const aus = Buffer.alloc(h * zeile);
  for (let y = 0; y < h; y += 1) {
    const filter = roh[y * (zeile + 1)];
    for (let i = 0; i < zeile; i += 1) {
      const x = roh[y * (zeile + 1) + 1 + i];
      const links = i >= kanaele ? aus[y * zeile + i - kanaele] : 0;
      const oben = y > 0 ? aus[(y - 1) * zeile + i] : 0;
      const obenLinks = y > 0 && i >= kanaele ? aus[(y - 1) * zeile + i - kanaele] : 0;
      let v = x;
      if (filter === 1) v = x + links;
      else if (filter === 2) v = x + oben;
      else if (filter === 3) v = x + ((links + oben) >> 1);
      else if (filter === 4) {
        const p = links + oben - obenLinks;
        const pa = Math.abs(p - links); const pb = Math.abs(p - oben); const pc = Math.abs(p - obenLinks);
        v = x + (pa <= pb && pa <= pc ? links : pb <= pc ? oben : obenLinks);
      }
      aus[y * zeile + i] = v & 255;
    }
  }
  return { b, h, px: (x, y) => {
    const o = y * zeile + x * kanaele;
    return [aus[o], aus[o + 1], aus[o + 2], kanaele === 4 ? aus[o + 3] : 255];
  } };
}

describe('Markentokens', () => {
  it('stehen außerhalb der Modusblöcke — Marken sind Bild, keine Textfarbe', () => {
    const dunkel = CSS.indexOf(':root,\n[data-modus="dunkel"] {');
    for (const t of ['--marke-pik', '--marke-grund-hell', '--marke-grund-tief']) {
      expect(token(t), `${t} fehlt`).not.toBe('');
      expect(CSS.indexOf(`${t}:`), `${t} liegt in einem Modusblock`).toBeLessThan(dunkel);
      expect(CSS.split(`${t}:`).length - 1, `${t} mehrfach definiert`).toBe(1);
    }
  });

  it('halten 3 zu 1 gegen beide Grünwerte (der Pik ist ein Bild, kein Fließtext)', () => {
    for (const g of ['--marke-grund-hell', '--marke-grund-tief']) {
      const k = kontrast(token('--marke-pik'), token(g));
      expect(k, `Pik auf ${g}: ${k.toFixed(2)}`).toBeGreaterThanOrEqual(3);
    }
  });

  it('erkennt den alten Fehler (die Prüfung prüft sich selbst)', () => {
    /* Dunkelbraun auf Grün — der helle Modus vor E-083. */
    expect(kontrast('#5f4810', '#1d7a58')).toBeLessThan(2);
  });
});

describe('Icon-Quelle', () => {
  it('trägt dieselben Farben wie die Tokens', () => {
    expect(SVG).toContain(`fill="${token('--marke-pik')}"`);
    expect(SVG).toContain(`stop-color="${token('--marke-grund-hell')}"`);
    expect(SVG).toContain(`stop-color="${token('--marke-grund-tief')}"`);
  });

  it('hat in der Oberfläche denselben Pik-Pfad wie im SVG', () => {
    const svgPfad = SVG.match(/id="pik"[^>]*\sd="([^"]+)"/)?.[1] ?? SVG.match(/\sd="(M256 96[^"]+)"/)?.[1];
    expect(svgPfad, 'Pfad im SVG').toBeTruthy();
    expect(ICON).toContain(`d="${svgPfad}"`);
  });
});

describe('PNG-Icons', () => {
  it('sind aus dem SVG gerendert: Mitte der Kachel trägt die Pik-Farbe', () => {
    for (const [datei, g] of [['icon-512.png', 512], ['icon-192.png', 192], ['icon-180.png', 180], ['icon-maskable-512.png', 512]] as const) {
      const p = dekodiere(`public/icons/${datei}`);
      expect(p.b, datei).toBe(g);
      const [r, gr, bl] = p.px(g >> 1, Math.round(g * 0.52));
      expect(Math.abs(r - 0xed) + Math.abs(gr - 0xcf) + Math.abs(bl - 0x87), `${datei} Mitte rgb(${r},${gr},${bl})`).toBeLessThan(24);
    }
  });

  it('haben dort Alpha, wo es hingehört: Home-Bildschirm und maskable ohne Ecken, Tab-Icon mit', () => {
    expect(dekodiere('public/icons/icon-180.png').px(0, 0)[3], 'apple-touch-icon').toBe(255);
    expect(dekodiere('public/icons/icon-maskable-512.png').px(0, 0)[3], 'maskable').toBe(255);
    expect(dekodiere('public/icons/icon-512.png').px(0, 0)[3], 'icon-512 Ecke').toBe(0);
    expect(dekodiere('public/icons/icon-192.png').px(0, 0)[3], 'icon-192 Ecke').toBe(0);
  });

  it('lassen den Pik in der Sicherheitszone des maskable-Icons', () => {
    const p = dekodiere('public/icons/icon-maskable-512.png');
    /* Außerhalb des inneren Kreises (Radius 40 % der Kante) darf kein Pik-Gelb liegen. */
    const r = 512 * 0.4;
    let zuViel = 0;
    for (let y = 0; y < 512; y += 4) {
      for (let x = 0; x < 512; x += 4) {
        if (Math.hypot(x - 256, y - 256) <= r) continue;
        const [pr, pg, pb] = p.px(x, y);
        if (pr > 0xd0 && pg > 0xb0 && pb > 0x60) zuViel += 1;
      }
    }
    expect(zuViel).toBe(0);
  });
});

describe('Verwendung', () => {
  it('zeichnet Seitenleiste, Kopfzeile und Willkommensdialog mit derselben Kachel', () => {
    for (const d of ['src/components/Layout.tsx', 'src/components/Kopfzeile.tsx', 'src/components/Onboarding.tsx']) {
      expect(readFileSync(d, 'utf8'), d).toContain('<Marke');
    }
    expect(CSS).toMatch(/\.marke-kachel\s*\{[^}]*var\(--marke-pik\)/);
    expect(CSS).not.toMatch(/\.brand \.spade/);
  });
});

describe('Das erste Bild beim Kaltstart', () => {
  const HTML = readFileSync('index.html', 'utf8');
  const wurzel = HTML.slice(HTML.indexOf('<div id="root">'), HTML.indexOf('<script type="module"'));

  it('steht in #root: Marke und Name vor dem ersten Byte JavaScript', () => {
    expect(wurzel).toContain('class="kaltstart"');
    expect(wurzel).toContain('PokerMentor</span>');
  });

  it('trägt Pfad und Farben der Marke', () => {
    const pfad = SVG.match(/\sd="(M256 96[^"]+)"/)?.[1];
    expect(wurzel).toContain(`d="${pfad}"`);
    expect(wurzel).toContain(`fill="${token('--marke-pik')}"`);
    expect(wurzel).toContain(`stop-color="${token('--marke-grund-hell')}"`);
    expect(wurzel).toContain(`stop-color="${token('--marke-grund-tief')}"`);
  });

  it('sagt ohne JavaScript, was fehlt', () => {
    expect(wurzel).toMatch(/<noscript>[\s\S]*JavaScript[\s\S]*<\/noscript>/);
  });
});
