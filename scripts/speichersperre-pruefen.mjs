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

   Ein zweiter Teil misst den anderen Fall: Der Speicher ist nicht gesperrt,
   sondern **voll**. Dort ging bis E-062 eine Eingabe still verloren.

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

/* Zweiter Teil: Der Speicher ist nicht gesperrt, sondern **voll**.
   `localStorage.setItem` wirft, alles andere geht weiter. Bis E-062 hat die
   App das verschluckt: Die Eingabe stand auf dem Schirm, im Speicher stand
   der alte Stand, und nach dem nächsten Start war sie weg.

   Geprüft wird beides — dass die Nutzerin es erfährt, und dass der neuere
   Stand den Neustart übersteht. */
const vollKontext = await browser.newContext({ viewport: { width: BREITE, height: HOEHE }, locale: 'de-DE' });
await vollKontext.addInitScript(() => {
  localStorage.setItem('pokermentor-lang-v1', 'de');
  const echt = Storage.prototype.setItem;
  Storage.prototype.setItem = function (k, v) {
    if (window.__speicherVoll === true && String(k).startsWith('pokermentor-')) {
      throw new DOMException('Quota exceeded', 'QuotaExceededError');
    }
    return echt.call(this, k, v);
  };
});

const vollSeite = await vollKontext.newPage();
vollSeite.setDefaultTimeout(15000);
const NAME_ALT = 'Erster Name';
const NAME_NEU = 'Zweiter Name';
let vollBefund = null;
let vollErgebnis = null;
try {
  await vollSeite.goto(`${GRUND}/#/profil`, { waitUntil: 'domcontentloaded' });
  await vollSeite.waitForTimeout(1800);
  const feld = vollSeite.locator('input[placeholder="z. B. Lorenz"]').first();
  const speichern = vollSeite.locator('button', { hasText: 'Speichern' }).first();

  await feld.fill(NAME_ALT);
  await speichern.click();
  await vollSeite.waitForTimeout(900);

  await vollSeite.evaluate(() => { window.__speicherVoll = true; });
  await feld.fill(NAME_NEU);
  await speichern.click();
  await vollSeite.waitForTimeout(1400);

  /* Der Hinweis steht in der Live-Region, nicht im Fließtext: `innerText`
     des Body liefert ihn nicht zurück. Deshalb gezielt die Meldung selbst. */
  const hinweis = await vollSeite.evaluate(() =>
    [...document.querySelectorAll('.toast')].map((t) => t.innerText.replace(/\s+/g, ' ').trim()).join(' | '));

  await vollSeite.evaluate(() => { window.__speicherVoll = false; });
  await vollSeite.reload({ waitUntil: 'domcontentloaded' });
  await vollSeite.waitForTimeout(2200);
  const nachNeustart = await vollSeite.evaluate(() => {
    let k = null;
    for (let i = 0; i < localStorage.length; i++) { const x = localStorage.key(i); if (x?.startsWith('pokermentor-data-')) k = x; }
    return JSON.parse(localStorage.getItem(k) ?? '{}').name ?? '';
  });

  vollErgebnis = { hinweis, stand_nach_neustart: nachNeustart, erwartet: NAME_NEU };
  if (!/gespeichert|saved/i.test(hinweis)) vollBefund = 'kein Hinweis, dass nicht gespeichert werden konnte';
  else if (nachNeustart !== NAME_NEU) vollBefund = `nach dem Neustart steht „${nachNeustart}" statt „${NAME_NEU}"`;
} catch (e) {
  vollBefund = `Messung abgebrochen: ${String(e).split('\n')[0].slice(0, 120)}`;
}
if (vollBefund) befunde.push({ adresse: '#/profil', art: 'voller Speicher', text: vollBefund });

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
  voller_speicher: vollErgebnis,
  befunde_gesamt: befunde.length,
  je_art: befunde.reduce((a, b) => ({ ...a, [b.art]: (a[b.art] ?? 0) + 1 }), {}),
  befunde: befunde.slice(0, 100),
};
writeFileSync('docs/speichersperre.json', `${JSON.stringify(bericht, null, 2)}\n`);

console.log(`${geladen} von ${bildschirme.length} Bildschirmen ohne Gerätespeicher geladen.`);
console.log(`Voller Speicher: ${vollBefund ?? 'Hinweis kommt, Stand übersteht den Neustart'}`);
console.log(`Befunde: ${befunde.length}`);
for (const b of befunde.slice(0, 12)) console.log(`  ${b.adresse} — ${b.art}: ${b.text}`);

/* Ein Lauf, der Befunde meldet und trotzdem mit 0 endet, lässt den Schritt in
   der Action grün aussehen — und genau das ist passiert (E-071). Wer misst,
   muss auch scheitern können. */
if (befunde.length > 0) {
  console.error(`\n${befunde.length} Befunde — siehe docs/speichersperre.json`);
  process.exitCode = 1;
}
