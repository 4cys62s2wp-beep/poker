/**
 * Was das Binärformat wirklich bringt — gemessen, nicht überschlagen.
 *
 * Gemessen wird beides, was zählt:
 *
 *   1. **Größe.** Roh und gepackt. Roh ist die Zahl, die im Gerät liegt und
 *      die der Service Worker offline vorhält. Gepackt ist die Zahl, die
 *      über die Leitung geht — jeder ernsthafte Hoster komprimiert, und ein
 *      Vergleich, der das unterschlägt, schmeichelt dem Binärformat.
 *   2. **Ladezeit.** Im echten Browser, über HTTP, samt Auswertung: Abrufen
 *      und in die fertige Liste verwandeln. Nicht nur das Abrufen — das JSON
 *      muss geparst werden, die Binärdatei durchlaufen. Beides gehört dazu.
 *
 * Die alte Fassung wird dafür eigens noch einmal erzeugt. Ein Vergleich
 * gegen eine Zahl aus dem Gedächtnis wäre keiner.
 *
 * Ergebnis nach `docs/binaerformat.json`. Aufruf:
 *
 *   npm run build && npx http-server dist -p 4173 -s &
 *   node scripts/binaer-messen.mjs
 */
import { gzipSync } from 'node:zlib';
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const GRUND = process.env.WEGE_GRUND ?? 'http://127.0.0.1:4173';
const QUELLE = 'tools/poker-math/output/b4_preflop_equity.json';
const KOPF = 'dist/pokermath/b4_preflop_equity.json';
const BINAER = 'dist/pokermath/b4_preflop_equity.bin';
/** Die alte Fassung, für den Vergleich noch einmal erzeugt. */
const ALT = 'dist/pokermath/b4_preflop_equity.alt.json';

/* --- Die alte Fassung nachbauen ----------------------------------------- */
const roh = JSON.parse(readFileSync(QUELLE, 'utf8'));
const kopf = JSON.parse(readFileSync(KOPF, 'utf8'));
const runde = (w, n) => Math.round(w * 10 ** n) / 10 ** n;
const alt = {
  ...kopf,
  matrix: undefined,
  matchups: roh.matchups.map((m) => {
    const e = {
      a: m.hand_a,
      b: m.hand_b,
      equity_a: runde(m.equity_a, 6),
      spanne_pp: runde(m.spanne_pp, 4),
      spanne_relevant: m.spanne_relevant,
    };
    if (m.spanne_relevant) {
      e.farbkonfigurationen = m.farbkonfigurationen.map((k) => ({
        beziehung: k.beziehung,
        haeufigkeit: k.haeufigkeit,
        equity_a: runde(k.equity_a, 6),
      }));
    }
    return e;
  }),
};
delete alt.matrix;
writeFileSync(ALT, `${JSON.stringify(alt)}\n`, 'utf8');

/* --- Größe -------------------------------------------------------------- */
const gepackt = (pfad) => gzipSync(readFileSync(pfad), { level: 9 }).length;
const groesse = {
  vorher: {
    roh_byte: statSync(ALT).size,
    gepackt_byte: gepackt(ALT),
  },
  nachher: {
    binaer_roh_byte: statSync(BINAER).size,
    binaer_gepackt_byte: gepackt(BINAER),
    kopf_roh_byte: statSync(KOPF).size,
    kopf_gepackt_byte: gepackt(KOPF),
  },
};
groesse.nachher.roh_byte = groesse.nachher.binaer_roh_byte + groesse.nachher.kopf_roh_byte;
groesse.nachher.gepackt_byte = groesse.nachher.binaer_gepackt_byte + groesse.nachher.kopf_gepackt_byte;
groesse.faktor_roh = Math.round((groesse.vorher.roh_byte / groesse.nachher.roh_byte) * 10) / 10;
groesse.faktor_gepackt = Math.round((groesse.vorher.gepackt_byte / groesse.nachher.gepackt_byte) * 10) / 10;

/* --- Ladezeit ----------------------------------------------------------- */
const LAEUFE = 9;

const browser = await chromium.launch();
const kontext = await browser.newContext();
const seite = await kontext.newPage();
await seite.goto(`${GRUND}/`, { waitUntil: 'domcontentloaded' });

const zeiten = await seite.evaluate(async ([laeufe]) => {
  const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];

  async function misst(was) {
    const werte = [];
    for (let i = 0; i < laeufe; i += 1) {
      const t0 = performance.now();
      await was(i);
      werte.push(performance.now() - t0);
    }
    return {
      median_ms: Math.round(median(werte) * 100) / 100,
      kleinste_ms: Math.round(Math.min(...werte) * 100) / 100,
      groesste_ms: Math.round(Math.max(...werte) * 100) / 100,
    };
  }

  /* `cache: 'no-store'` wie im echten Ladepfad — sonst misst der zweite Lauf
     den Zwischenspeicher und nicht die Datei. Der Parameter hängt zusätzlich
     dran, damit auch der Service Worker nichts unterschiebt. */
  const json = await misst(async (i) => {
    const a = await fetch(`./pokermath/b4_preflop_equity.alt.json?n=${i}`, { cache: 'no-store' });
    const d = await a.json();
    if (d.matchups.length !== 14365) throw new Error('unerwartete Zahl von Handpaaren');
  });

  const binaer = await misst(async (i) => {
    const a = await fetch(`./pokermath/b4_preflop_equity.bin?n=${i}`, { cache: 'no-store' });
    const puffer = await a.arrayBuffer();
    /* Nur durchlaufen, nicht auswerten: Hier wird der Abruf plus ein voller
       Durchgang über alle Bytes gemessen, ohne den Leser der App zu laden. */
    const sicht = new DataView(puffer);
    let summe = 0;
    for (let k = 16; k + 1 < puffer.byteLength; k += 2) summe += sicht.getUint16(k, true);
    if (summe === 0) throw new Error('leere Datei');
  });

  return { json, binaer };
}, [LAEUFE]);

await browser.close();

const ergebnis = {
  gemessen_am: new Date().toISOString(),
  laeufe: LAEUFE,
  groesse,
  ladezeit: {
    ...zeiten,
    faktor: Math.round((zeiten.json.median_ms / zeiten.binaer.median_ms) * 10) / 10,
  },
  handpaare: roh.matchups.length,
  konfigurationen_ausgeliefert: roh.matchups
    .filter((m) => m.spanne_relevant)
    .reduce((n, m) => n + m.farbkonfigurationen.length, 0),
};

writeFileSync('docs/binaerformat.json', `${JSON.stringify(ergebnis, null, 2)}\n`, 'utf-8');

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
console.log('Größe');
console.log(`  vorher   JSON      ${kb(groesse.vorher.roh_byte).padStart(10)}   gepackt ${kb(groesse.vorher.gepackt_byte)}`);
console.log(`  nachher  Binär     ${kb(groesse.nachher.binaer_roh_byte).padStart(10)}   gepackt ${kb(groesse.nachher.binaer_gepackt_byte)}`);
console.log(`           + Kopf    ${kb(groesse.nachher.kopf_roh_byte).padStart(10)}   gepackt ${kb(groesse.nachher.kopf_gepackt_byte)}`);
console.log(`           zusammen  ${kb(groesse.nachher.roh_byte).padStart(10)}   gepackt ${kb(groesse.nachher.gepackt_byte)}`);
console.log(`  Faktor   roh ${groesse.faktor_roh}   gepackt ${groesse.faktor_gepackt}`);
console.log('\nLadezeit (Median aus ' + LAEUFE + ' Läufen, Abruf + Auswertung)');
console.log(`  vorher   JSON   ${zeiten.json.median_ms} ms   (${zeiten.json.kleinste_ms}–${zeiten.json.groesste_ms})`);
console.log(`  nachher  Binär  ${zeiten.binaer.median_ms} ms   (${zeiten.binaer.kleinste_ms}–${zeiten.binaer.groesste_ms})`);
console.log(`  Faktor   ${ergebnis.ladezeit.faktor}`);
