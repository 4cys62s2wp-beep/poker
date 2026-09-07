/* Was zeigt die App, wenn das Gerät den Speicher verweigert?
   =========================================================

   `localStorage` ist kein Feld, das immer da ist. Im privaten Fenster, bei
   gesperrten Website-Daten und unter mancher Unternehmensrichtlinie wirft
   schon der Lesezugriff einen `SecurityError`. Eine einzige ungeschützte
   Stelle im Startpfad genügt, damit die Fehlergrenze übernimmt — und die
   Nutzerin auf **jedem** Bildschirm nur noch „Da ist etwas schiefgelaufen"
   sieht.

   `speichersperre.test.ts` hält den Quelltext sauber: Jeder Zugriff liegt in
   einem `try`. Dieser Lauf prüft, was der Quelltext nicht zeigen kann — die
   Fremdbibliotheken. Firebase, der Router und die Browser-Laufzeit fassen
   den Speicher selbst an; ein Versionssprung kann das verändern, ohne dass
   eine Zeile im Projekt sich rührt.

   Zwei Fallen, beide mit grünem Ergebnis ohne Aussage:

   1. **Ein Absturz erzeugt hier keinen `pageerror`.** React fängt ihn ab,
      die Fehlergrenze rendert ihre eigene Seite — mit reichlich Text. Wer
      nur auf leere Seiten und `pageerror` schaut, misst grün, obwohl alle
      90 Bildschirme abgestürzt sind. Genau das ist im ersten Anlauf
      passiert. Deshalb wird `main[role="alert"]` gesucht.
   2. **Die Sperre könnte gar nicht greifen.** Deshalb prüft der Lauf im
      Fenster selbst nach, ob der Zugriff wirklich wirft — und bricht ab,
      wenn nicht.

   Gegenprobe: Ein `try` aus `leseModus()` entfernt → alle geprüften
   Bildschirme melden die Absturzseite.

   Ergebnis nach `docs/speichersperre.json`; `speichersperre.test.ts` hält
   es fest. */

import { holeChromium } from './browser.mjs';
import { readFileSync, writeFileSync } from 'node:fs';

const chromium = await holeChromium();

const GRUND = 'http://localhost:4173';
const BREITE = 390;
const HOEHE = 844;

const adressen = JSON.parse(readFileSync('docs/bedienbar.json', 'utf8')).bildschirme_liste;

const browser = await chromium.launch();
const kontext = await browser.newContext({ viewport: { width: BREITE, height: HOEHE }, locale: 'de-DE' });

/* Vor jedem Skript im Fenster: beide Web-Speicher werfen bei jedem Zugriff.
   So verhält sich Safari im privaten Modus historisch, und so verhält sich
   jeder Browser mit gesperrten Website-Daten. */
await kontext.addInitScript(() => {
  const werfen = () => {
    throw new DOMException('Zugriff verweigert', 'SecurityError');
  };
  for (const name of ['localStorage', 'sessionStorage']) {
    Object.defineProperty(window, name, {
      configurable: true,
      get() {
        return {
          getItem: werfen,
          setItem: werfen,
          removeItem: werfen,
          clear: werfen,
          key: werfen,
          get length() {
            return werfen();
          },
        };
      },
    });
  }
});

const seite = await kontext.newPage();
await seite.goto(`${GRUND}/`, { waitUntil: 'domcontentloaded' });

const sperreWirkt = await seite.evaluate(() => {
  try {
    localStorage.getItem('x');
    return false;
  } catch {
    return true;
  }
});
if (!sperreWirkt) {
  console.error('Die Speichersperre greift nicht — dieser Lauf würde nichts messen.');
  await browser.close();
  process.exit(1);
}

const befunde = [];
const bildschirme = [];

for (const adresse of adressen) {
  const laut = [];
  const beiFehler = (e) => laut.push(String(e).replace(/\s+/g, ' ').slice(0, 140));
  const beiKonsole = (m) => {
    if (m.type() === 'error') laut.push(m.text().replace(/\s+/g, ' ').slice(0, 140));
  };
  seite.on('pageerror', beiFehler);
  seite.on('console', beiKonsole);

  try {
    await seite.goto(`${GRUND}/${adresse}`, { waitUntil: 'domcontentloaded', timeout: 20000 });
    // Zweiter Aufruf: Beim ersten Start ist der Speicher ohnehin leer. Erst
    // der Neuaufbau zeigt, ob die App ohne ihr Gedächtnis wieder hochkommt.
    await seite.reload({ waitUntil: 'domcontentloaded', timeout: 20000 });
  } catch (e) {
    befunde.push({ adresse, art: 'laedt nicht', text: String(e).split('\n')[0].slice(0, 100) });
    bildschirme.push({ adresse, geladen: false, zeichen: 0 });
    seite.off('pageerror', beiFehler);
    seite.off('console', beiKonsole);
    continue;
  }
  await seite.waitForTimeout(500);

  const bild = await seite.evaluate(() => {
    const main = document.querySelector('main');
    const text = (main ?? document.body).innerText.trim();
    return {
      absturz: document.querySelector('main[role="alert"]') !== null,
      zeichen: text.length,
      anfang: text.slice(0, 70).replace(/\n/g, ' '),
    };
  });

  if (bild.absturz) befunde.push({ adresse, art: 'Absturzseite', text: bild.anfang });
  else if (bild.zeichen < 30) befunde.push({ adresse, art: 'leer', text: `${bild.zeichen} Zeichen: „${bild.anfang}"` });
  for (const f of laut.slice(0, 2)) befunde.push({ adresse, art: 'Fehler', text: f });

  bildschirme.push({ adresse, geladen: true, zeichen: bild.zeichen });
  seite.off('pageerror', beiFehler);
  seite.off('console', beiKonsole);
}

await browser.close();

const geladen = bildschirme.filter((b) => b.geladen).length;
const bericht = {
  geprueft_am: new Date().toISOString(),
  grund: GRUND,
  breite: BREITE,
  hoehe: HOEHE,
  sperre_wirkt: sperreWirkt,
  bildschirme: bildschirme.length,
  geladen,
  befunde_gesamt: befunde.length,
  je_art: befunde.reduce((a, b) => ({ ...a, [b.art]: (a[b.art] ?? 0) + 1 }), {}),
  befunde: befunde.slice(0, 100),
};
writeFileSync('docs/speichersperre.json', `${JSON.stringify(bericht, null, 2)}\n`);

console.log(`${geladen} von ${bildschirme.length} Bildschirmen ohne Gerätespeicher geladen.`);
console.log(`Befunde: ${befunde.length}`);
for (const b of befunde.slice(0, 12)) console.log(`  ${b.adresse} — ${b.art}: ${b.text}`);
