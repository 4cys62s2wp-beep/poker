/* Das Handy quer.
   ===============

   Alle bisherigen Läufe messen hochkant: 390 × 844. Quer ist dasselbe Gerät
   844 × 390 — ein Fünftel der Höhe. Das ist keine Randlage: Wer am Tisch die
   Blindstufen laufen lässt, stellt das Gerät hin; wer am Übungstisch spielt,
   dreht es.

   Niedrige Höhe bricht auf drei Arten, und alle drei sind hier gemessen:

   1. **Waagerechtes Überlaufen.** Eine Breite, die hochkant nie auffällt,
      schiebt quer die Seite zur Seite.
   2. **Bedienelemente unter einer festen Leiste.** Was hochkant knapp über
      dem Rand liegt, verschwindet quer darunter — und ist nicht mehr
      erreichbar.
   3. **Eine feste Leiste, die den Bildschirm auffrisst.** Über 40 % der Höhe
      lässt vom Inhalt zu wenig übrig.

   Gegenprobe: Ein 1200 px breites Element und eine 120-px-Leiste eingesetzt →
   beide Regeln schlagen an (356 px Überlauf, 2 verdeckte Bedienelemente).

   Ergebnis nach `docs/quer.json`; `quer.test.ts` hält es fest. */

import { holeChromium } from './browser.mjs';
import { readFileSync, writeFileSync } from 'node:fs';

const chromium = await holeChromium();

const GRUND = 'http://localhost:4173';
const BREITE = 844;
const HOEHE = 390;
/** Ab diesem Anteil der Höhe frisst eine feste Leiste den Bildschirm auf. */
const LEISTE_MAX = 0.4;

const adressen = JSON.parse(readFileSync('docs/bedienbar.json', 'utf8')).bildschirme_liste;

const browser = await chromium.launch();
const kontext = await browser.newContext({ viewport: { width: BREITE, height: HOEHE }, locale: 'de-DE' });
await kontext.addInitScript(() => localStorage.setItem('pokermentor-lang-v1', 'de'));
const seite = await kontext.newPage();

const befunde = [];
const messungen = [];

for (const adresse of adressen) {
  await seite.goto(`${GRUND}/${adresse}`, { waitUntil: 'domcontentloaded' });
  await seite.waitForTimeout(380);

  const m = await seite.evaluate(() => {
    const breiter = document.documentElement.scrollWidth - document.documentElement.clientWidth;

    /* Feste Leisten am unteren Rand: breiter als die halbe Seite und bis
       ganz nach unten. Das ist die Form, die Inhalt verdeckt. */
    const fest = [...document.querySelectorAll('*')].filter((el) => {
      const st = getComputedStyle(el);
      if (st.position !== 'fixed' && st.position !== 'sticky') return false;
      const r = el.getBoundingClientRect();
      return r.height > 0 && r.width > innerWidth * 0.5 && r.bottom > innerHeight - 4;
    });
    const leistenHoehe = fest.reduce((a, el) => Math.max(a, el.getBoundingClientRect().height), 0);

    const verdeckt = [];
    if (leistenHoehe > 0) {
      const grenze = innerHeight - leistenHoehe;
      for (const el of document.querySelectorAll('button, a[href], input, select')) {
        const r = el.getBoundingClientRect();
        if (r.height === 0) continue;
        // Nur was ganz im Bereich der Leiste liegt und nicht zu ihr gehört.
        if (r.top >= grenze && r.bottom <= innerHeight && !fest.some((f) => f.contains(el))) {
          verdeckt.push((el.textContent ?? el.getAttribute('aria-label') ?? el.tagName).trim().slice(0, 40));
        }
      }
    }

    const main = document.querySelector('main');
    const text = (main ?? document.body).innerText.trim();
    return {
      breiter,
      leistenHoehe: Math.round(leistenHoehe),
      verdeckt,
      zeichen: text.length,
      absturz: document.querySelector('main[role="alert"]') !== null,
      hoehe: innerHeight,
    };
  });

  if (m.breiter > 1) befunde.push({ adresse, art: 'waagerechter Überlauf', text: `${m.breiter} px` });
  if (m.verdeckt.length) befunde.push({ adresse, art: 'unter der Leiste', text: m.verdeckt.slice(0, 3).join(' · ') });
  if (m.leistenHoehe > m.hoehe * LEISTE_MAX) {
    befunde.push({ adresse, art: 'Leiste zu hoch', text: `${m.leistenHoehe} von ${m.hoehe} px` });
  }
  if (m.absturz) befunde.push({ adresse, art: 'Absturzseite', text: '' });
  else if (m.zeichen < 30) befunde.push({ adresse, art: 'fast nichts sichtbar', text: `${m.zeichen} Zeichen` });

  messungen.push({ adresse, breiter: m.breiter, leiste: m.leistenHoehe, zeichen: m.zeichen });
}

await browser.close();

const bericht = {
  geprueft_am: new Date().toISOString(),
  breite: BREITE,
  hoehe: HOEHE,
  leiste_max_anteil: LEISTE_MAX,
  bildschirme: messungen.length,
  hoechster_ueberlauf: messungen.reduce((a, m) => Math.max(a, m.breiter), 0),
  hoechste_leiste: messungen.reduce((a, m) => Math.max(a, m.leiste), 0),
  befunde_gesamt: befunde.length,
  je_art: befunde.reduce((a, b) => ({ ...a, [b.art]: (a[b.art] ?? 0) + 1 }), {}),
  befunde: befunde.slice(0, 100),
};
writeFileSync('docs/quer.json', `${JSON.stringify(bericht, null, 2)}\n`);

console.log(`${messungen.length} Bildschirme quer (${BREITE}×${HOEHE}) geprüft.`);
console.log(`Höchster Überlauf: ${bericht.hoechster_ueberlauf} px · höchste feste Leiste: ${bericht.hoechste_leiste} px`);
console.log(`Befunde: ${befunde.length}`);
for (const b of befunde.slice(0, 12)) console.log(`  ${b.adresse} — ${b.art}: ${b.text}`);

/* Ein Lauf, der Befunde meldet und trotzdem mit 0 endet, lässt den Schritt in
   der Action grün aussehen — und genau das ist passiert (E-071). Wer misst,
   muss auch scheitern können. */
if (befunde.length > 0) {
  console.error(`\n${befunde.length} Befunde — siehe docs/quer.json`);
  process.exitCode = 1;
}
