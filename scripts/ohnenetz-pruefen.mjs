/* Was zeigt die App, wenn kein Netz da ist?
   =========================================

   PokerMentor verspricht Offline-Betrieb: Sie lässt sich installieren, die
   Daten liegen auf dem Gerät, der Drill soll im Zug funktionieren. Geprüft
   hat das bis E-052 nichts. Der Durchgang misst, wie schnell die Startseite
   ohne Netz kommt — aber nicht, ob die **anderen 89 Bildschirme** dann noch
   etwas zeigen.

   Zwei Fallen stecken in dieser Messung, und beide führen zu einem grünen
   Ergebnis, das nichts bedeutet:

   1. **Auf `localhost` meldet sich der Service Worker gar nicht an**
      (`main.tsx` schließt das aus, damit die Entwicklung nicht auf einem
      alten Stand hängt). Gemessen wird deshalb über `127.0.0.1` — und
      dieser Lauf bricht ab, wenn der Worker nicht wirklich aktiv ist.
   2. **Ein Hash-Wechsel lädt das Dokument nicht neu.** Wer offline nur den
      Hash ändert, misst die längst geladene Seite. Also wird jeder
      Bildschirm wirklich neu geladen.

   Gegenprobe: Ohne Service Worker lädt kein einziger Bildschirm offline —
   0 von 90 statt 90 von 90.

   Ergebnis nach `docs/ohnenetz.json`; `ohnenetz.test.ts` hält es fest. */

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync, writeFileSync } from 'node:fs';

const GRUND = 'http://127.0.0.1:4173';
const BREITE = 390;
const HOEHE = 844;

const adressen = JSON.parse(readFileSync('docs/bedienbar.json', 'utf8')).bildschirme_liste;

const browser = await chromium.launch();
const kontext = await browser.newContext({ viewport: { width: BREITE, height: HOEHE }, locale: 'de-DE' });
await kontext.addInitScript(() => localStorage.setItem('pokermentor-lang-v1', 'de'));
const seite = await kontext.newPage();

// Erst mit Netz starten, damit der Service Worker sich anmeldet und füllt.
await seite.goto(`${GRUND}/`, { waitUntil: 'networkidle' });
let swAktiv = false;
for (let versuch = 0; versuch < 12 && !swAktiv; versuch++) {
  swAktiv = await seite.evaluate(() => !!navigator.serviceWorker?.controller);
  if (!swAktiv) {
    await seite.waitForTimeout(700);
    await seite.reload({ waitUntil: 'networkidle' });
  }
}
if (!swAktiv) {
  console.error('Kein aktiver Service Worker — ohne ihn misst dieser Lauf nichts.');
  await browser.close();
  process.exit(1);
}
await seite.waitForTimeout(1200); // dem Worker Zeit geben, den Kern abzulegen

await kontext.setOffline(true);

const befunde = [];
const bildschirme = [];

for (const adresse of adressen) {
  const fehler = [];
  const horcher = (e) => fehler.push(String(e).replace(/\s+/g, ' ').slice(0, 140));
  seite.on('pageerror', horcher);
  try {
    await seite.goto(`${GRUND}/${adresse}`, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await seite.reload({ waitUntil: 'domcontentloaded', timeout: 20000 });
  } catch (e) {
    befunde.push({ adresse, art: 'laedt nicht', text: String(e).split('\n')[0].slice(0, 100) });
    bildschirme.push({ adresse, geladen: false, zeichen: 0 });
    seite.off('pageerror', horcher);
    continue;
  }
  await seite.waitForTimeout(700);

  const bild = await seite.evaluate(() => {
    const main = document.querySelector('main');
    const text = (main ?? document.body).innerText.trim();
    /* „Lädt…" als Endzustand ist offline schlimmer als eine Fehlermeldung:
       Es sagt, dass gleich etwas kommt, und es kommt nie. */
    const laeuft = [...document.querySelectorAll('*')]
      .filter((el) => el.children.length === 0 && /^(lädt|lade|wird geladen|rechnet|loading)/i.test((el.textContent ?? '').trim()))
      .map((el) => (el.textContent ?? '').trim().slice(0, 40));
    return { zeichen: text.length, anfang: text.slice(0, 70).replace(/\n/g, ' '), laeuft };
  });

  if (bild.zeichen < 30) befunde.push({ adresse, art: 'leer', text: `${bild.zeichen} Zeichen: „${bild.anfang}"` });
  if (bild.laeuft.length) befunde.push({ adresse, art: 'bleibt am Laden', text: bild.laeuft.slice(0, 2).join(' · ') });
  for (const f of fehler) befunde.push({ adresse, art: 'Fehler', text: f });

  bildschirme.push({ adresse, geladen: true, zeichen: bild.zeichen });
  seite.off('pageerror', horcher);
}

await browser.close();

const geladen = bildschirme.filter((b) => b.geladen).length;
const bericht = {
  geprueft_am: new Date().toISOString(),
  grund: GRUND,
  breite: BREITE,
  service_worker_aktiv: swAktiv,
  bildschirme: bildschirme.length,
  geladen,
  befunde_gesamt: befunde.length,
  je_art: befunde.reduce((a, b) => ({ ...a, [b.art]: (a[b.art] ?? 0) + 1 }), {}),
  befunde: befunde.slice(0, 100),
};
writeFileSync('docs/ohnenetz.json', `${JSON.stringify(bericht, null, 2)}\n`);

console.log(`${geladen} von ${bildschirme.length} Bildschirmen ohne Netz geladen.`);
console.log(`Befunde: ${befunde.length}`);
for (const b of befunde.slice(0, 12)) console.log(`  ${b.adresse} — ${b.art}: ${b.text}`);
