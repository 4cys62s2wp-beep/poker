/**
 * Erreichbarkeit am gerenderten Ergebnis prüfen — nicht am Quelltext.
 *
 * Der Grund steht in DESIGN.md, Abschnitt 6: Ein Lauf über den Quelltext hat
 * elf Sackgassen nicht gefunden, weil die Links alle da waren. Sie standen in
 * der Seitenleiste, und die ist unter 920 Pixel ausgeblendet. Auf dem Handy
 * existierten sie nicht.
 *
 * Dieses Skript startet einen echten Browser bei 390 Pixel Breite, beginnt
 * auf der Startseite und folgt allen **sichtbaren** Links in die Tiefe. Für
 * jede erreichte Adresse hält es fest:
 *
 *   - in welcher Tiefe sie zuerst auftauchte,
 *   - ob von dort ein sichtbarer Weg zurück zur Startseite führt.
 *
 * Ergebnis nach `docs/wege.json`. Aufruf:
 *
 *   npm run build && npx http-server dist -p 4173 -s &
 *   node scripts/wege-pruefen.mjs
 */
import { writeFileSync, readFileSync } from 'node:fs';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const GRUND = process.env.WEGE_GRUND ?? 'http://127.0.0.1:4173';
const BREITE = 390;
const HOEHE = 844;
const MAX_TIEFE = 3;

/**
 * Was nicht als eigener Bildschirm zählt.
 *
 * Eine Lektion ist Inhalt des Modulbildschirms, kein eigener Bildschirm —
 * so wie ein Glossareintrag Inhalt des Glossars ist. Zählte man sie mit,
 * lägen 49 Adressen bei Tiefe drei, und die Zahl sagte nichts mehr über die
 * Navigation aus, sondern nur noch darüber, wie viele Lektionen es gibt.
 *
 * Besucht werden sie trotzdem — nur nicht in die Tiefenrechnung gezählt.
 */
const KEIN_EIGENER_BILDSCHIRM = [
  /^#\/lernen\/m\d+\/m\d+-l\d+$/,   // einzelne Lektion
];

const browser = await chromium.launch();
const kontext = await browser.newContext({ viewport: { width: BREITE, height: HOEHE } });
const seite = await kontext.newPage();

// Sprache setzen, damit der Willkommensdialog nicht jeden Klick abfängt.
await seite.goto(`${GRUND}/`, { waitUntil: 'domcontentloaded' });
await seite.evaluate(() => localStorage.setItem('pokermentor-lang-v1', 'de'));

/** Alle sichtbaren Ziele auf der aktuellen Seite. */
async function sichtbareZiele() {
  return seite.$$eval('a[href]', (as) => as
    .filter((a) => {
      const r = a.getBoundingClientRect();
      const st = getComputedStyle(a);
      return r.width > 0 && r.height > 0 && st.visibility !== 'hidden' && st.display !== 'none';
    })
    .map((a) => a.getAttribute('href') ?? '')
    .filter((h) => h.startsWith('#/')));
}

async function oeffne(hash) {
  await seite.goto(`${GRUND}/${hash}`, { waitUntil: 'domcontentloaded' });
  await seite.waitForTimeout(280);
}

const gesehen = new Map();   // hash -> { tiefe, zurueck, ziele }
let rand = ['#/'];
gesehen.set('#/', { tiefe: 0, zurueck: true, ziele: [] });

for (let tiefe = 0; tiefe <= MAX_TIEFE && rand.length > 0; tiefe += 1) {
  const naechste = [];
  for (const hash of rand) {
    await oeffne(hash);
    const ziele = [...new Set(await sichtbareZiele())];
    /* Ein Weg zurück zur Startseite: entweder ein sichtbarer Link auf #/ —
       das ist der Zurück-Link oder die untere Navigation — oder die
       Startseite selbst. */
    const zurueck = hash === '#/' || ziele.includes('#/');
    const eintrag = gesehen.get(hash) ?? { tiefe, zurueck: false, ziele: [] };
    eintrag.ziele = ziele;
    eintrag.zurueck = zurueck;
    gesehen.set(hash, eintrag);

    for (const z of ziele) {
      if (gesehen.has(z)) continue;
      gesehen.set(z, {
        tiefe: tiefe + 1,
        zurueck: false,
        ziele: [],
        inhalt: KEIN_EIGENER_BILDSCHIRM.some((m) => m.test(z)),
      });
      naechste.push(z);
    }
  }
  rand = naechste;
}

const liste = [...gesehen.entries()]
  .map(([hash, e]) => ({ hash, tiefe: e.tiefe, zurueck: e.zurueck, inhalt: e.inhalt === true }))
  .sort((a, b) => a.tiefe - b.tiefe || a.hash.localeCompare(b.hash));

const bildschirme = liste.filter((e) => !e.inhalt);
const sackgassen = liste.filter((e) => !e.zurueck);
const zuTief = bildschirme.filter((e) => e.tiefe > 2);

/**
 * Adressen, die absichtlich nicht verlinkt sind — und warum.
 *
 * `/pro` erscheint nur, solange die Monetarisierung eingeschaltet ist; sie ist
 * es nicht. `/kuendigen` wird aus der Zahlungsverwaltung heraus geöffnet.
 * Beides ist richtig so und darf nicht als Mangel gezählt werden.
 */
const ABSICHTLICH_UNVERLINKT = ['/pro', '/kuendigen'];

// Alle im Quelltext angemeldeten Adressen, um die unerreichbaren zu finden.
const app = readFileSync('src/App.tsx', 'utf8');
const angemeldet = [...app.matchAll(/<Route path="([^"]+)"(?![^>]*Navigate)/g)]
  .map((m) => m[1])
  .filter((p) => !p.includes(':') && p !== '*');
const erreicht = new Set(liste.map((e) => e.hash.replace(/^#/, '')));
const unerreichbar = angemeldet
  .filter((p) => !erreicht.has(p))
  .filter((p) => !ABSICHTLICH_UNVERLINKT.includes(p));

const ergebnis = {
  geprueft_am: new Date().toISOString().slice(0, 19) + 'Z',
  breite: BREITE,
  erreichbar: liste.length,
  bildschirme: bildschirme.length,
  groesste_tiefe: Math.max(...bildschirme.map((e) => e.tiefe)),
  sackgassen: sackgassen.map((e) => e.hash),
  tiefer_als_zwei: zuTief.map((e) => e.hash),
  unerreichbar,
  absichtlich_unverlinkt: ABSICHTLICH_UNVERLINKT,
  wege: liste,
};
writeFileSync('docs/wege.json', `${JSON.stringify(ergebnis, null, 2)}\n`, 'utf8');

console.log(`${liste.length} Adressen erreichbar, davon ${bildschirme.length} eigene `
  + `Bildschirme. Größte Tiefe unter den Bildschirmen: ${ergebnis.groesste_tiefe}`);
console.log(`Sackgassen (kein sichtbarer Weg zur Startseite): ${sackgassen.length}`);
for (const e of sackgassen) console.log(`   ${e.hash}`);
console.log(`Tiefer als zwei: ${zuTief.length}`);
for (const e of zuTief) console.log(`   ${e.hash} (Tiefe ${e.tiefe})`);
console.log(`Im Quelltext angemeldet, aber nicht erreichbar: ${unerreichbar.length}`);
for (const p of unerreichbar) console.log(`   ${p}`);

await browser.close();
