/* Erzeugt die Vorschaubilder für das Manifest.
   ===========================================

   Chrome zeigt beim Installieren (Android) und im Installationsdialog (Desktop)
   Bilder der App — wenn das Manifest welche kennt. Ohne `screenshots` sieht der
   Dialog dürftig aus, und „reichhaltig installieren" gibt es gar nicht.

   Die Bilder kommen aus der gebauten App, nicht aus einem Grafikprogramm: Sie
   stimmen mit dem überein, was man danach bekommt.

   Aufruf (App muss auf Port 4173 laufen): `npm run screenshots`. */

import { mkdirSync } from 'node:fs';
import { holeChromium } from './browser.mjs';

const chromium = await holeChromium();
const browser = await chromium.launch();
mkdirSync('public/screenshots', { recursive: true });

const bilder = [
  { datei: 'start-schmal.png', route: '#/', breite: 390, hoehe: 844 },
  { datei: 'lernpfad-schmal.png', route: '#/lernen', breite: 390, hoehe: 844 },
  { datei: 'drill-schmal.png', route: '#/lernen/drill', breite: 390, hoehe: 844 },
  { datei: 'start-weit.png', route: '#/', breite: 1280, hoehe: 720 },
  { datei: 'lernpfad-weit.png', route: '#/lernen', breite: 1280, hoehe: 720 },
];

for (const b of bilder) {
  const k = await browser.newContext({ viewport: { width: b.breite, height: b.hoehe }, deviceScaleFactor: 1, locale: 'de-DE' });
  await k.addInitScript(() => {
    /* Mit gewählter Sprache entfällt der Willkommensdialog: Die Bilder zeigen die
       App, nicht die Begrüßung. */
    localStorage.setItem('pokermentor-lang-v1', 'de');
    localStorage.setItem('pokermentor-farbmodus-v1', 'dunkel');
  });
  const s = await k.newPage();
  await s.goto(`http://localhost:4173/${b.route}`, { waitUntil: 'domcontentloaded' });
  await s.waitForTimeout(1200);
  await s.screenshot({ path: `public/screenshots/${b.datei}`, type: 'png' });
  console.log(`✓ ${b.datei} (${b.breite}×${b.hoehe})`);
  await k.close();
}
await browser.close();
