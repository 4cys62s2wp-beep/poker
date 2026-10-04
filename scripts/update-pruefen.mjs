/* Neue Fassung: kommt das Band, und tauscht sich nichts von selbst?
   ================================================================

   Der Service Worker übernahm jede neue Fassung sofort (`skipWaiting`). Das
   lässt sich nur im Browser prüfen — mit einem Server, dessen `sw.js` sich
   zwischen zwei Besuchen ändert. Dieser Lauf startet einen eigenen kleinen
   Server auf `dist/`, besucht die App, ändert die Datei und prüft:

   1. Die erste Installation zeigt **kein** Band (sie ist keine Neuigkeit).
   2. Eine geänderte `sw.js` wartet — `reg.waiting` ist gesetzt, der alte
      Worker steuert weiter — und die Seite lädt **nicht** von selbst neu.
   3. Das Band „Neue Version bereit" erscheint.
   4. „Neu laden" übernimmt die Fassung: Die Seite lädt neu, ein neuer Worker
      steuert, das Band ist weg.
   5. Das Fehlen eines Seitenpakets lädt **einmal** neu, nicht in einer Schleife.

   Gegenprobe: `self.skipWaiting()` in `install` eingefügt → Prüfung 2 schlägt an.

   Ergebnis nach `docs/update.json`; `update.test.ts` hält es fest. */

import { holeChromium } from './browser.mjs';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const chromium = await holeChromium();
const DIST = 'dist';
const PORT = 4271;
const GRUND = `http://127.0.0.1:${PORT}`;
const TYPEN = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.woff2': 'font/woff2', '.bin': 'application/octet-stream' };

let swZusatz = '';
const server = createServer((req, res) => {
  const pfad = normalize(decodeURIComponent(new URL(req.url, GRUND).pathname)).replace(/^(\.\.[/\\])+/, '');
  let datei = join(DIST, pfad === '/' || pfad === '' ? 'index.html' : pfad);
  if (!existsSync(datei) || statSync(datei).isDirectory()) datei = join(DIST, 'index.html');
  let body = readFileSync(datei);
  if (datei.endsWith('sw.js')) body = Buffer.from(`${body.toString('utf8')}\n${swZusatz}`);
  res.writeHead(200, { 'content-type': TYPEN[extname(datei)] ?? 'application/octet-stream', 'cache-control': 'no-store' });
  res.end(body);
});
await new Promise((ok) => server.listen(PORT, '127.0.0.1', ok));

const befunde = [];
const befund = (art, text) => befunde.push({ art, text });
const messwerte = {};

const browser = await chromium.launch();
const k = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'de-DE' });
await k.addInitScript(() => localStorage.setItem('pokermentor-lang-v1', 'de'));
const seite = await k.newPage();
const warte = (ms) => seite.waitForTimeout(ms);

try {
  await seite.goto(`${GRUND}/#/`, { waitUntil: 'load' });
  await seite.evaluate(() => navigator.serviceWorker.ready);
  /* Die Seite wird erst beim zweiten Laden vom Worker gesteuert (clients.claim
     greift, aber `controller` ist nach dem ersten Laden oft schon gesetzt). */
  await seite.reload({ waitUntil: 'load' });
  await warte(800);
  const start = await seite.evaluate(async () => {
    const reg = await navigator.serviceWorker.getRegistration();
    return { steuert: !!navigator.serviceWorker.controller, aktiv: reg?.active?.state ?? null,
      wartend: !!reg?.waiting, band: !!document.querySelector('.update-band') };
  });
  if (!start.steuert) befund('Vorbereitung', 'Der Worker steuert die Seite nicht — Messung nicht möglich');
  if (start.band) befund('Erstinstallation', 'zeigt ein Band, obwohl nichts neu ist');
  messwerte.start = start;

  /* Eine neue Fassung ausliefern. */
  await seite.evaluate(() => { window.__marke = 'unverändert'; });
  swZusatz = `// neue Fassung ${Date.now()}`;
  await seite.evaluate(async () => { const r = await navigator.serviceWorker.getRegistration(); await r?.update(); });
  await warte(1500);
  const wartet = await seite.evaluate(async () => {
    const reg = await navigator.serviceWorker.getRegistration();
    return { wartend: !!reg?.waiting, aktiv: reg?.active?.state ?? null, marke: window.__marke,
      band: !!document.querySelector('.update-band'), text: document.querySelector('.update-band')?.textContent?.trim() ?? '' };
  });
  if (!wartet.wartend) befund('Warten', 'die neue Fassung wartet nicht (übernahm sich selbst?)');
  if (wartet.marke !== 'unverändert') befund('Warten', 'die Seite hat von selbst neu geladen');
  if (!wartet.band) befund('Band', 'kein Band „Neue Version bereit"');
  if (wartet.band && !/Neue Version bereit/.test(wartet.text)) befund('Band', `Text: ${wartet.text}`);
  messwerte.wartet = wartet;

  /* Übernehmen. */
  const geladen = seite.waitForEvent('load', { timeout: 8000 }).catch(() => null);
  await seite.locator('.update-band button').click();
  const ok = await geladen;
  await warte(900);
  const danach = await seite.evaluate(async () => {
    const reg = await navigator.serviceWorker.getRegistration();
    return { marke: window.__marke ?? null, band: !!document.querySelector('.update-band'),
      wartend: !!reg?.waiting, steuert: !!navigator.serviceWorker.controller };
  });
  if (!ok) befund('Übernehmen', 'die Seite hat nach „Neu laden“ nicht neu geladen');
  if (danach.marke !== null) befund('Übernehmen', 'die Seite ist dieselbe geblieben');
  if (danach.band) befund('Übernehmen', 'das Band steht nach dem Neuladen noch da');
  if (danach.wartend) befund('Übernehmen', 'es wartet noch eine Fassung');
  messwerte.danach = danach;

  /* Ein fehlendes Seitenpaket lädt einmal neu — nicht in einer Schleife. */
  await seite.evaluate(() => sessionStorage.clear());
  let ladungen = 0;
  seite.on('load', () => { ladungen += 1; });
  await seite.evaluate(() => { window.dispatchEvent(new Event('vite:preloadError', { cancelable: true })); });
  await warte(1200);
  await seite.evaluate(() => { window.dispatchEvent(new Event('vite:preloadError', { cancelable: true })); });
  await warte(1200);
  if (ladungen !== 1) befund('Schleife', `${ladungen} Neuladungen bei zwei Fehlern, erwartet 1`);
  messwerte.preloadFehler = { neuladungen: ladungen };
} catch (f) {
  befund('Lauf', `abgebrochen: ${f.message.split('\n')[0]}`);
}

await browser.close();
server.close();

const bericht = {
  geprueft_am: new Date().toISOString(),
  befunde_gesamt: befunde.length,
  messwerte,
  befunde,
};
writeFileSync('docs/update.json', `${JSON.stringify(bericht, null, 2)}\n`);
console.log('Neue Fassung geprüft: Erstinstallation, Warten, Band, Übernehmen, Neuladen höchstens einmal.');
console.log(`Befunde: ${befunde.length}`);
for (const b of befunde) console.log(`  [${b.art}] ${b.text}`);
if (befunde.length > 0) {
  console.error(`\n${befunde.length} Befunde — siehe docs/update.json`);
  process.exitCode = 1;
}
