/* Hält das Layout größere Schrift aus?
   ====================================

   Wer in den Browser-Einstellungen „Schriftgröße: sehr groß“ wählt, setzt die
   Wurzelschrift auf das Doppelte. Regel 10.15 sorgt dafür, dass die Schrift
   mitwächst (`schriftgroesse.test.ts`); ob das **Layout** das trägt, hat bis
   hierher niemand geprüft. Gemessen wurde von Hand: Bei 200 % schob die Seite
   sich um 6 Pixel zur Seite, die Nachschlagen-Chips liefen ineinander, die
   Session-Kacheln hießen „Abend f…“, und im Preflop-Trainer verdeckte die
   klebende Leiste die Situationskarte samt Handkarten.

   Dieser Lauf stellt die Standardschrift des Browsers auf 32 statt 16 Pixel —
   über das Protokoll des Browsers (`Page.setFontSizes`), nicht über ein
   eingeschobenes Stylesheet: So verhält sich alles wie bei der echten
   Einstellung, auch Medienabfragen in `em` (die beziehen sich auf die
   Standardschrift, nicht auf `html`) — und prüft alle Bildschirme bei 390 Pixel
   Breite auf vier Dinge:

   1. **Waagerechtes Überlaufen** der Seite (`scrollWidth > innerWidth`).
   2. **Abgeschnittene Texte:** ein Element mit `overflow: hidden`, dessen Inhalt
      breiter ist als es selbst — mit Auslassungspunkten oder ohne.
   3. **Eine klebende Leiste, die den Bildschirm auffrisst:** über 45 % der Höhe.
   4. **Die Situation unter der Leiste:** Wo die Antwort in einer klebenden
      Leiste unten steht, muss die erste Spielkarte der Aufgabe beim Öffnen ganz
      darüber liegen — sonst sieht man die Frage nicht, auf die man antworten soll.

   Ergebnis nach `docs/gross.json`; `gross.test.ts` hält es fest. */

import { holeChromium } from './browser.mjs';
import { readFileSync, writeFileSync } from 'node:fs';

const chromium = await holeChromium();

const GRUND = 'http://localhost:4173';
const BREITE = 390;
const HOEHE = 844;
const SCHRIFT = '200%';
const STANDARDSCHRIFT_PX = 32;
const LEISTE_MAX = 0.45;

const adressen = JSON.parse(readFileSync('docs/bedienbar.json', 'utf8')).bildschirme_liste;

const browser = await chromium.launch();
const kontext = await browser.newContext({ viewport: { width: BREITE, height: HOEHE }, locale: 'de-DE' });
await kontext.addInitScript(() => localStorage.setItem('pokermentor-lang-v1', 'de'));
const seite = await kontext.newPage();
const protokoll = await kontext.newCDPSession(seite);
await protokoll.send('Page.setFontSizes', { fontSizes: { standard: STANDARDSCHRIFT_PX, fixed: 26 } });

const befunde = [];
const messungen = [];

for (const adresse of adressen) {
  await seite.goto(`${GRUND}/${adresse}`, { waitUntil: 'domcontentloaded' });
  await seite.waitForTimeout(420);

  const m = await seite.evaluate(() => {
    const breiter = document.documentElement.scrollWidth - document.documentElement.clientWidth;

    /* Abgeschnitten: Inhalt breiter als das Element, das ihn verbirgt. Nur
       Elemente mit eigenem Text — Balken und Symbole haben keinen. */
    const abgeschnitten = [];
    for (const el of document.querySelectorAll('main *, .sidebar *, header *')) {
      if (el.closest('.matrix, .matrix-scroll, .table-wrap, svg, .sr-only')) continue;
      const st = getComputedStyle(el);
      if (st.overflowX === 'visible' || st.overflowX === 'auto' || st.overflowX === 'scroll') continue;
      if (st.display === 'none' || el.getClientRects().length === 0) continue;
      const eigenerText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 0);
      if (!eigenerText) continue;
      if (el.scrollWidth > el.clientWidth + 1) {
        abgeschnitten.push(`${el.tagName.toLowerCase()}${el.className ? '.' + String(el.className).split(' ')[0] : ''}: „${el.textContent.trim().slice(0, 36)}“`);
      }
    }

    const fest = [...document.querySelectorAll('*')].filter((el) => {
      const st = getComputedStyle(el);
      if (st.position !== 'fixed' && st.position !== 'sticky') return false;
      const r = el.getBoundingClientRect();
      return r.height > 0 && r.width > innerWidth * 0.5 && r.bottom > innerHeight - 4;
    });
    const leiste = fest.reduce((a, el) => Math.max(a, el.getBoundingClientRect().height), 0);

    /* Die Antwort-Leiste (`.entscheidung`): Wird die erste Spielkarte beim
       Öffnen von ihr angeschnitten oder überdeckt? Eine Karte unterhalb des
       Bildrands ist nicht verdeckt, sie liegt nur weiter unten. */
    const antwort = document.querySelector('.entscheidung');
    let karteVerdeckt = null;
    if (antwort && getComputedStyle(antwort).position !== 'static') {
      const oben = antwort.getBoundingClientRect().top;
      const karte = document.querySelector('main .pcard');
      if (karte) {
        const r = karte.getBoundingClientRect();
        karteVerdeckt = r.top < innerHeight && r.bottom > oben;
      }
    }

    /* Das Seitenende: Ganz unten gescrollt, darf nichts unter der Leiste enden.
       Sonst bleibt das Letzte der Seite für immer verdeckt. */
    let endeVerdeckt = null;
    const leisteEl = [...document.querySelectorAll('.entscheidung, .drill-bedienung')].find((el) => {
      const st = getComputedStyle(el);
      return st.position === 'fixed' || st.position === 'sticky';
    });
    if (leisteEl) {
      window.scrollTo(0, document.documentElement.scrollHeight);
      const oben = leisteEl.getBoundingClientRect().top;
      let tiefster = 0;
      for (const el of document.querySelectorAll('main p, main h1, main h2, main h3, main li, main button, main a, main .card, main .drill-oben')) {
        if (leisteEl.contains(el)) continue;
        const r = el.getBoundingClientRect();
        if (r.height === 0 || r.top >= innerHeight) continue;
        tiefster = Math.max(tiefster, r.bottom);
      }
      endeVerdeckt = tiefster > oben + 1 ? Math.round(tiefster - oben) : 0;
      window.scrollTo(0, 0);
    }

    const main = document.querySelector('main');
    return {
      endeVerdeckt,
      breiter,
      abgeschnitten: abgeschnitten.slice(0, 4),
      leiste: Math.round(leiste),
      karteVerdeckt,
      schrift: parseFloat(getComputedStyle(document.documentElement).fontSize),
      absturz: document.querySelector('main[role="alert"]') !== null,
      zeichen: (main ?? document.body).innerText.trim().length,
    };
  });

  if (m.schrift < 31) befunde.push({ adresse, art: 'Schrift nicht verdoppelt', text: `${m.schrift} px` });
  if (m.breiter > 1) befunde.push({ adresse, art: 'waagerechter Überlauf', text: `${m.breiter} px` });
  for (const a of m.abgeschnitten) befunde.push({ adresse, art: 'abgeschnittener Text', text: a });
  if (m.leiste > HOEHE * LEISTE_MAX) befunde.push({ adresse, art: 'Leiste zu hoch', text: `${m.leiste} von ${HOEHE} px` });
  if (m.endeVerdeckt > 0) befunde.push({ adresse, art: 'Seitenende unter der Leiste', text: `${m.endeVerdeckt} px des Letzten liegen unter der Leiste` });
  if (m.karteVerdeckt === true) befunde.push({ adresse, art: 'Karte unter der Leiste', text: 'die erste Spielkarte liegt beim Öffnen unter der Antwort-Leiste' });
  if (m.absturz) befunde.push({ adresse, art: 'Absturzseite', text: '' });

  messungen.push({ adresse, breiter: m.breiter, leiste: m.leiste });
}

await browser.close();

const bericht = {
  geprueft_am: new Date().toISOString(),
  breite: BREITE,
  hoehe: HOEHE,
  schrift: SCHRIFT,
  leiste_max_anteil: LEISTE_MAX,
  bildschirme: messungen.length,
  hoechster_ueberlauf: messungen.reduce((a, m) => Math.max(a, m.breiter), 0),
  hoechste_leiste: messungen.reduce((a, m) => Math.max(a, m.leiste), 0),
  befunde_gesamt: befunde.length,
  je_art: befunde.reduce((a, b) => ({ ...a, [b.art]: (a[b.art] ?? 0) + 1 }), {}),
  befunde: befunde.slice(0, 200),
};
writeFileSync('docs/gross.json', `${JSON.stringify(bericht, null, 2)}\n`);

console.log(`${messungen.length} Bildschirme bei ${SCHRIFT} Schrift (${BREITE}×${HOEHE}) geprüft.`);
console.log(`Höchster Überlauf: ${bericht.hoechster_ueberlauf} px · höchste feste Leiste: ${bericht.hoechste_leiste} px`);
console.log(`Befunde: ${befunde.length}`);
for (const [art, n] of Object.entries(bericht.je_art)) console.log(`  ${n}× ${art}`);
for (const b of befunde.slice(0, 30)) console.log(`  ${b.adresse} — ${b.art}: ${b.text}`);

if (befunde.length > 0) {
  console.error(`\n${befunde.length} Befunde — siehe docs/gross.json`);
  process.exitCode = 1;
}
