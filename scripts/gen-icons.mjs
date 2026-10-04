/* Erzeugt die PNG-App-Icons aus `public/icons/icon.svg`.
   =====================================================

   Bis E-083 zeichnete dieses Skript den Pik selbst per Herzformel — und das
   Ergebnis sah anders aus als das SVG im Browser-Tab: zwei Marken. Jetzt gibt
   es eine Quelle, das SVG, und der Browser rendert es.

   Drei Sorten:
   - `icon-192`, `icon-512`: die Kachel mit abgerundeten Ecken (Alpha außen).
   - `icon-180` (apple-touch-icon): ein **volles Quadrat** ohne Alpha — iOS
     rundet selbst, und Transparenz wird dort schwarz.
   - `icon-maskable-512`: volles Quadrat, der Pik in der Sicherheitszone
     (innere 80 %), damit Androids Masken ihn nicht anschneiden.

   Aufruf: `node scripts/gen-icons.mjs` (braucht Playwright, siehe README). */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { holeChromium } from './browser.mjs';

const aus = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'icons');
mkdirSync(aus, { recursive: true });
const svg = readFileSync(join(aus, 'icon.svg'), 'utf8');

/** Das SVG mit den gewünschten Abwandlungen. */
function variante({ eckig, pikMass }) {
  let s = svg;
  if (eckig) s = s.replace('rx="104"', 'rx="0"');
  if (pikMass !== 1.2) s = s.replace('scale(1.2)', `scale(${pikMass})`);
  return s;
}

const ziele = [
  { datei: 'icon-512.png', px: 512, eckig: false, pikMass: 1.2 },
  { datei: 'icon-192.png', px: 192, eckig: false, pikMass: 1.2 },
  { datei: 'icon-180.png', px: 180, eckig: true, pikMass: 1.2 },
  /* Sicherheitszone: Der Pik misst 56 % der Kachel; maskable darf höchstens 80 %
     tragen und soll mittig im inneren Kreis sitzen: 56 % × 0,85 ≈ 48 %. */
  { datei: 'icon-maskable-512.png', px: 512, eckig: true, pikMass: 1.02 },
];

const chromium = await holeChromium();
const browser = await chromium.launch();
for (const z of ziele) {
  const k = await browser.newContext({ viewport: { width: z.px, height: z.px }, deviceScaleFactor: 1 });
  const seite = await k.newPage();
  await seite.setContent(
    `<style>html,body{margin:0;background:transparent}svg{display:block;width:${z.px}px;height:${z.px}px}</style>${variante(z)}`,
  );
  const png = await seite.screenshot({ type: 'png', omitBackground: true, clip: { x: 0, y: 0, width: z.px, height: z.px } });
  writeFileSync(join(aus, z.datei), png);
  console.log(`✓ ${z.datei}`);
  await k.close();
}
await browser.close();
