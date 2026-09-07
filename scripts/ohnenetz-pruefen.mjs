/* Was zeigt die App, wenn kein Netz da ist?
   =========================================

   PokerMentor verspricht Offline-Betrieb. Dieser Lauf prüft ihn — und hat
   dabei zweimal die Methode gewechselt, weil die ersten beiden nichts maßen.

   **Warum `setOffline` hier nicht taugt.** `context.setOffline(true)` setzt
   `navigator.onLine` auf false und blockiert die Anfragen der Seite. Zwei
   Dinge tut es nicht, und beide sind für diesen Lauf tödlich:

   1. Anfragen, die der **Service Worker** stellt, gehen weiter ins Netz.
      Gemessen: `fetch('/manifest.webmanifest?nie-geladen=…')` über den
      Worker lieferte eine 200, während der Kontext als offline galt.
   2. **`caches.match()` im Worker findet nichts mehr.** Der Worker
      protokollierte sich selbst mit (ohne Debugger, der die Messung
      verfälscht hätte):

          ohne setOffline:  TREFFER ja basic 200   index-….js
          mit  setOffline:  TREFFER nein           index-….js

      Der Worker lief also bei jeder Anfrage ins Netz. Solange der
      Vorschau-Server lief, fiel das nicht auf — er bekam alles und die
      Messung meldete „90 von 90 ohne Netz geladen". In Wahrheit: 90 von 90
      **mit** Netz, während `navigator.onLine` false war. Auf einem Runner
      mit neuerem Chromium, wo `setOffline` strenger greift, kippte
      derselbe Lauf auf 90 leere Bildschirme.

   **Was jetzt gemessen wird.** Der Lauf startet seinen **eigenen**
   Vorschau-Server, wärmt den Service Worker auf, prüft, dass jede gebaute
   Datei in dessen Zwischenspeicher liegt — und **schaltet den Server dann
   ab**. Was nicht läuft, kann nichts liefern; das ist die einzige Sperre,
   an der auch ein Service Worker nicht vorbeikommt, und sie braucht keine
   Emulation, die man nachher erklären muss.

   Gegenprobe im Fenster: Eine Anfrage, die in keinem Zwischenspeicher
   liegen kann, muss danach scheitern.

   Zwei Fallen bleiben, beide mit grünem Ergebnis ohne Aussage:

   - **Auf `localhost` meldet sich der Service Worker gar nicht an**
     (`main.tsx` schließt das aus). Gemessen wird deshalb über `127.0.0.1`,
     und der Lauf bricht ab, wenn der Worker nicht wirklich aktiv ist.
   - **Ein Hash-Wechsel lädt das Dokument nicht neu.** Also wird jeder
     Bildschirm wirklich neu geladen.

   Nach E-061 wird zusätzlich die **Absturzseite** gesucht: Eine gut
   gestaltete Fehlerseite hat reichlich Text und erzeugt keinen
   `pageerror` — sie käme sonst als „in Ordnung" durch.

   Ergebnis nach `docs/ohnenetz.json`; `ohnenetz.test.ts` hält es fest. */

import { holeChromium } from './browser.mjs';

/* Playwright liegt nicht im Projekt (siehe browser.mjs) — der Fundort
   wird zur Laufzeit gesucht, damit dieser Lauf überall startet. */
const chromium = await holeChromium();
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

/* Ein eigener Server auf einem eigenen Port — und das ist der Kern dieses
   Laufs, keine Bequemlichkeit.

   `context.setOffline(true)` setzt `navigator.onLine` auf false und blockiert
   die Anfragen der **Seite**. Anfragen, die der **Service Worker** stellt,
   gehen weiter ins Netz. Gemessen: mit abgeschaltetem Netz lieferte
   `fetch('/manifest.webmanifest?nie-geladen=…')` über den Worker eine 200.
   Da jeder Bildschirm hier über den Worker läuft, hat dieser Lauf bis E-071
   nichts über den Offline-Betrieb ausgesagt — er hat gemessen, ob die App
   rendert, während `navigator.onLine` false ist.

   Deshalb wird der Server jetzt **abgeschaltet**. Was nicht läuft, kann
   nichts liefern; das ist die einzige Sperre, an der auch ein Service Worker
   nicht vorbeikommt. */
const PORT = 4183;
const GRUND = `http://127.0.0.1:${PORT}`;
const BREITE = 390;
const HOEHE = 844;

const adressen = JSON.parse(readFileSync('docs/bedienbar.json', 'utf8')).bildschirme_liste;

/** Alle Dateien unter einem Ordner des Builds, mit ihrem Web-Pfad. */
function leseOrdner(ordner, praefix) {
  const aus = [];
  for (const eintrag of readdirSync(ordner)) {
    const p = join(ordner, eintrag);
    if (statSync(p).isDirectory()) aus.push(...leseOrdner(p, `${praefix}${eintrag}/`));
    else aus.push(`${praefix}${eintrag}`);
  }
  return aus;
}

/** Befunde, die schon vor dem Rundgang feststehen. */
const befundeVorab = [];

/** Wartet, bis der Server antwortet (oder eben nicht mehr). */
async function erreichbar(soll) {
  for (let i = 0; i < 60; i++) {
    let da = false;
    try {
      const r = await fetch(`${GRUND}/`, { signal: AbortSignal.timeout(1500) });
      da = r.ok;
    } catch {
      da = false;
    }
    if (da === soll) return true;
    await new Promise((f) => setTimeout(f, 500));
  }
  return false;
}

/* Direkt `vite` starten, nicht über `npx`: Der Umweg legt einen Elternprozess
   dazwischen, und ein `kill` auf ihn lässt den eigentlichen Server
   weiterlaufen — der erste Versuch scheiterte genau daran. */
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview',
  '--port', String(PORT), '--host', '127.0.0.1'], { stdio: 'ignore' });
if (!(await erreichbar(true))) {
  console.error(`Die eigene Vorschau auf Port ${PORT} kam nicht hoch.`);
  server.kill('SIGKILL');
  process.exit(1);
}

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
/* Und jetzt der Teil, der vorher eine Wartezeit war: 1200 ms „dem Worker
   Zeit geben". Auf dieser Maschine reichte das; auf dem CI-Runner nicht — der
   Lauf meldete dort Befunde auf ganzer Linie, während er hier grün war
   (E-071). Der Grund ist derselbe wie überall in dieser Datei: Der Worker
   legt Dateien beim Abruf ab, und `cache.put` ist asynchron. Wer offline
   schaltet, bevor das durch ist, misst einen halb gefüllten Zwischenspeicher.

   Statt zu warten wird jetzt nachgesehen: Liegen die Dateien, die jeder
   Bildschirm braucht — das Skript, das Stilblatt, die Startseite selbst —
   wirklich im Zwischenspeicher? Erst dann geht das Netz aus. */
async function kernImSpeicher() {
  return seite.evaluate(async () => {
    const gebraucht = [
      location.origin + '/',
      ...[...document.querySelectorAll('script[src], link[rel="stylesheet"]')]
        .map((el) => el.src || el.href)
        .filter((u) => u.startsWith(location.origin)),
    ];
    const fehlend = [];
    for (const url of gebraucht) {
      const treffer = await caches.match(url, { ignoreSearch: true });
      if (!treffer) fehlend.push(url.replace(location.origin, ''));
    }
    return { gebraucht: gebraucht.length, fehlend };
  });
}

let kern = await kernImSpeicher();
for (let versuch = 0; versuch < 40 && kern.fehlend.length > 0; versuch++) {
  await seite.waitForTimeout(500);
  kern = await kernImSpeicher();
}
if (kern.fehlend.length > 0) {
  console.error('Der Service Worker hat den Kern nicht abgelegt — ohne ihn misst dieser Lauf nichts.');
  console.error(`Fehlend: ${kern.fehlend.join(', ')}`);
  server.kill('SIGKILL');
  await browser.close();
  process.exit(1);
}

/* Die eigentliche Zusage: **jede** gebaute Datei liegt im Zwischenspeicher —
   auch die, die auf der Startseite nie abgerufen wird (die englischen
   Inhalte, die zusätzlichen Schriftschnitte). Vor E-071 sammelte der Worker
   nur ein, was jemand tatsächlich geladen hatte; wer offline auf Englisch
   umschaltete, stand vor leeren Lektionen. */
const gebaut = [
  ...leseOrdner('dist/assets', './assets/'),
  ...leseOrdner('dist/icons', './icons/'),
];
const fehlendGebaut = await seite.evaluate(async (liste) => {
  const fehlt = [];
  for (const pfad of liste) {
    if (!(await caches.match(new URL(pfad, location.origin).href, { ignoreSearch: true }))) fehlt.push(pfad);
  }
  return fehlt;
}, gebaut);
console.log(`Zwischenspeicher: ${gebaut.length - fehlendGebaut.length} von ${gebaut.length} gebauten Dateien.`);
if (fehlendGebaut.length) {
  befundeVorab.push({ adresse: '(Vorabladung)', art: 'nicht im Zwischenspeicher', text: fehlendGebaut.slice(0, 5).join(', ') });
}

/* Jetzt den Server abschalten — und nachsehen, dass er wirklich weg ist.
   Kein `setOffline`: Es würde dem Worker seinen eigenen Zwischenspeicher
   verstecken (siehe Kopf) und damit genau das kaputtmachen, was hier
   geprüft werden soll. */
server.kill('SIGTERM');
if (!(await erreichbar(false))) {
  console.error('Die Vorschau lief weiter — dieser Lauf würde nichts messen.');
  server.kill('SIGKILL');
  await browser.close();
  process.exit(1);
}

/* Gegenprobe im Fenster: Eine Anfrage, die in keinem Zwischenspeicher liegen
   kann, muss jetzt scheitern. Gelingt sie, ist noch ein Weg ins Netz offen
   und alles Folgende wäre wertlos. */
const nochNetz = await seite.evaluate(async () => {
  try {
    await fetch(`/manifest.webmanifest?nie-geladen=${Date.now()}`, { cache: 'no-store' });
    return true;
  } catch {
    return false;
  }
});
if (nochNetz) {
  console.error('Trotz abgeschaltetem Server kam eine frische Anfrage durch — der Lauf misst nichts.');
  await browser.close();
  process.exit(1);
}
console.log('Server abgeschaltet, frische Anfragen scheitern.');

const befunde = [...befundeVorab];
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
    /* Eine gut gestaltete Fehlerseite sieht für eine Messung aus wie eine
       funktionierende Seite — 150 Zeichen Text, kein `pageerror`, weil
       React ihn abgefangen hat. Siehe E-061. */
    const absturz = document.querySelector('main[role="alert"]') !== null;
    return { zeichen: text.length, anfang: text.slice(0, 70).replace(/\n/g, ' '), laeuft, absturz };
  });

  if (bild.absturz) befunde.push({ adresse, art: 'Absturzseite', text: bild.anfang });
  else if (bild.zeichen < 30) befunde.push({ adresse, art: 'leer', text: `${bild.zeichen} Zeichen: „${bild.anfang}"` });
  if (bild.laeuft.length) befunde.push({ adresse, art: 'bleibt am Laden', text: bild.laeuft.slice(0, 2).join(' · ') });
  for (const f of fehler) befunde.push({ adresse, art: 'Fehler', text: f });

  bildschirme.push({ adresse, geladen: true, zeichen: bild.zeichen });
  seite.off('pageerror', horcher);
}

await browser.close();
server.kill('SIGKILL');

const geladen = bildschirme.filter((b) => b.geladen).length;
const bericht = {
  geprueft_am: new Date().toISOString(),
  grund: GRUND,
  breite: BREITE,
  browser: browser.version(),
  service_worker_aktiv: swAktiv,
  kern_dateien_im_speicher: kern.gebraucht,
  server_abgeschaltet: true,
  frische_anfrage_scheitert: !nochNetz,
  gebaute_dateien: gebaut.length,
  gebaute_dateien_im_speicher: gebaut.length - fehlendGebaut.length,
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

/* Ein Lauf, der Befunde meldet und trotzdem mit 0 endet, lässt den Schritt in
   der Action grün aussehen — und genau das ist passiert (E-071). Wer misst,
   muss auch scheitern können. */
if (befunde.length > 0) {
  console.error(`\n${befunde.length} Befunde — siehe docs/ohnenetz.json`);
  process.exitCode = 1;
}
