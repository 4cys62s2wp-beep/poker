/**
 * Ein vollständiger Durchgang: vom Koffer bis zur laufenden Uhr.
 *
 * Die Rechenwege der Live-Session sind einzeln geprüft — Chipverteilung,
 * Blindstruktur, Uhr, Zustand. Was keine dieser Prüfungen erfasst, ist die
 * Frage, ob jemand tatsächlich vom leeren Bildschirm bis zum laufenden Abend
 * kommt: ob die Eingaben ankommen, ob der Knopf freigeschaltet wird, ob der
 * Übergang in den Vollbildmodus den Zustand mitnimmt, ob Pause und Verlassen
 * tun, was sie sagen.
 *
 * Das lässt sich nur an der laufenden App prüfen, mit echten Klicks. Genau
 * das macht dieses Skript. Es hält jeden Schritt mit seinem beobachteten
 * Ergebnis in `docs/durchgang.json` fest; der Test daneben lässt keinen
 * Schritt fehlschlagen und keinen verschwinden.
 *
 * Aufruf:
 *
 *   npm run build && npx http-server dist -p 4173 -s &
 *   node scripts/durchgang-pruefen.mjs
 */
import { writeFileSync } from 'node:fs';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const GRUND = process.env.WEGE_GRUND ?? 'http://127.0.0.1:4173';
const SCHLUESSEL = 'pokermentor-session-laufend-v1';

/** Ein handelsüblicher 300er-Koffer und fünf Leute. */
const KOFFER = [['weiß', 150], ['rot', 100], ['grün', 50]];
const NAMEN = ['Lorenz', 'Mira', 'Jonas', 'Ada', 'Ben'];

const schritte = [];
let fehler = null;

/** Einen Schritt ausführen und sein beobachtetes Ergebnis festhalten. */
async function schritt(name, was) {
  if (fehler) { schritte.push({ name, ergebnis: null, uebersprungen: true }); return null; }
  try {
    const ergebnis = await was();
    schritte.push({ name, ergebnis, uebersprungen: false });
    return ergebnis;
  } catch (e) {
    fehler = `${name}: ${e.message}`;
    schritte.push({ name, ergebnis: null, uebersprungen: false, fehler: e.message });
    return null;
  }
}

const browser = await chromium.launch();
const kontext = await browser.newContext({
  viewport: { width: 390, height: 844 },
  locale: 'de-DE',
});
await kontext.addInitScript(() => localStorage.setItem('pokermentor-lang-v1', 'de'));
const seite = await kontext.newPage();

/** Ein Fehler im Browser ist ein Fehler im Durchgang, auch wenn danach noch
 *  etwas angezeigt wird. */
const seitenfehler = [];
seite.on('pageerror', (e) => seitenfehler.push(e.message));

await schritt('Einrichten öffnen', async () => {
  await seite.goto(`${GRUND}/#/session/live/einrichten`, { waitUntil: 'domcontentloaded' });
  await seite.waitForTimeout(400);
  const knopf = seite.locator('button.einrichten-knopf.haupt');
  return {
    ueberschrift: await seite.locator('h1').first().innerText(),
    startknopf_gesperrt: await knopf.isDisabled(),
    startknopf_text: await knopf.innerText(),
  };
});

await schritt('Koffer eintragen', async () => {
  const farben = seite.getByLabel('Farbe');
  const anzahlen = seite.getByLabel('Anzahl');
  for (let i = 0; i < KOFFER.length; i += 1) {
    await farben.nth(i).fill(KOFFER[i][0]);
    await anzahlen.nth(i).fill(String(KOFFER[i][1]));
  }
  return { zeilen: await farben.count(), chips_gesamt: KOFFER.reduce((s, k) => s + k[1], 0) };
});

await schritt('Spieler eintragen', async () => {
  const hinzu = seite.getByRole('button', { name: 'Spieler hinzufügen' });
  let felder = seite.getByLabel('Name');
  while (await felder.count() < NAMEN.length) {
    await hinzu.click();
    felder = seite.getByLabel('Name');
  }
  for (let i = 0; i < NAMEN.length; i += 1) await felder.nth(i).fill(NAMEN[i]);
  return { spieler: await felder.count() };
});

await schritt('Dauer und Tempo wählen', async () => {
  await seite.getByRole('button', { name: '3 h', exact: true }).click();
  await seite.getByRole('button', { name: /^Normal/ }).click();
  await seite.waitForTimeout(300);
  return {
    dauer_gewaehlt: await seite.getByRole('button', { name: '3 h', exact: true })
      .getAttribute('aria-pressed'),
  };
});

await schritt('Ergebnis erscheint, bevor irgendetwas beginnt', async () => {
  /* Der Auftrag verlangt keine Wartezeit zwischen Eingabe und Ergebnis: Die
     Vorschau steht schon da, während man noch tippt. */
  const gross = seite.locator('.einrichten-gross');
  const stufen = seite.locator('.einrichten-stufen span');
  return {
    startchips: (await gross.innerText()).trim(),
    blindstufen: await stufen.count(),
    erste_stufe: (await stufen.first().innerText()).trim(),
    letzte_stufe: (await stufen.last().innerText()).trim(),
    finale_satz: (await seite.locator('.einrichten-block p.hinweis').last().innerText()).trim(),
  };
});

await schritt('Start ist jetzt freigegeben', async () => {
  const knopf = seite.locator('button.einrichten-knopf.haupt');
  return { gesperrt: await knopf.isDisabled(), text: (await knopf.innerText()).trim() };
});

await schritt('Abend starten', async () => {
  await seite.locator('button.einrichten-knopf.haupt').click();
  await seite.waitForTimeout(500);
  const gespeichert = await seite.evaluate((k) => JSON.parse(localStorage.getItem(k)), SCHLUESSEL);
  return {
    adresse: new URL(seite.url()).hash,
    navigationsleiste: await seite.locator('nav').count() > 0,
    zeit: (await seite.locator('.tisch-zeit').innerText()).trim(),
    blinds: (await seite.locator('.tisch-blinds').innerText()).trim(),
    danach: (await seite.locator('.tisch-naechste').innerText()).trim(),
    gespeichert_spieler: gespeichert?.spieler?.length ?? null,
    gespeichert_startchips: gespeichert?.startchips ?? null,
    gespeichert_stufen: gespeichert?.stufen?.length ?? null,
    laeuft: gespeichert?.laeuft_seit !== null,
  };
});

await schritt('Die Uhr läuft wirklich', async () => {
  const vorher = (await seite.locator('.tisch-zeit').innerText()).trim();
  await seite.waitForTimeout(2200);
  const nachher = (await seite.locator('.tisch-zeit').innerText()).trim();
  return { vorher, nachher, hat_sich_bewegt: vorher !== nachher };
});

await schritt('Neu laden setzt an derselben Stelle fort', async () => {
  const vorher = (await seite.locator('.tisch-zeit').innerText()).trim();
  await seite.reload({ waitUntil: 'domcontentloaded' });
  await seite.waitForTimeout(500);
  const nachher = (await seite.locator('.tisch-zeit').innerText()).trim();
  const alsSekunden = (t) => {
    const [m, s] = t.split(':').map(Number);
    return m * 60 + s;
  };
  return {
    vorher,
    nachher,
    abstand_s: Math.abs(alsSekunden(vorher) - alsSekunden(nachher)),
    abend_noch_da: await seite.evaluate((k) => localStorage.getItem(k) !== null, SCHLUESSEL),
  };
});

await schritt('Pause hält an', async () => {
  await seite.getByRole('button', { name: 'Pause' }).click();
  await seite.waitForTimeout(300);
  const vorher = (await seite.locator('.tisch-zeit').innerText()).trim();
  await seite.waitForTimeout(2200);
  const nachher = (await seite.locator('.tisch-zeit').innerText()).trim();
  return {
    vorher,
    nachher,
    steht_still: vorher === nachher,
    marke_sichtbar: await seite.locator('.tisch-pausiert').count() > 0,
  };
});

await schritt('Weiter läuft an derselben Stelle an', async () => {
  const vorher = (await seite.locator('.tisch-zeit').innerText()).trim();
  await seite.getByRole('button', { name: 'Weiter' }).click();
  await seite.waitForTimeout(300);
  const gleich_danach = (await seite.locator('.tisch-zeit').innerText()).trim();
  await seite.waitForTimeout(2200);
  const spaeter = (await seite.locator('.tisch-zeit').innerText()).trim();
  return {
    vorher, gleich_danach, spaeter,
    kein_sprung: vorher === gleich_danach,
    laeuft_wieder: gleich_danach !== spaeter,
  };
});

await schritt('Beenden fragt nach und tut es dann', async () => {
  await seite.getByRole('button', { name: 'Beenden', exact: true }).click();
  await seite.waitForTimeout(300);
  const gefragt = await seite.locator('.tisch-frage').count() > 0;
  const frage = (await seite.locator('.tisch-frage strong').innerText()).trim();
  await seite.locator('.tisch-frage button').first().click();
  await seite.waitForTimeout(500);
  return {
    gefragt,
    frage,
    adresse_danach: new URL(seite.url()).hash,
    abend_beendet: await seite.evaluate((k) => localStorage.getItem(k) === null, SCHLUESSEL),
  };
});

await browser.close();

const ergebnis = {
  geprueft_am: new Date().toISOString(),
  breite: 390,
  seitenfehler,
  abgebrochen_bei: fehler,
  schritte,
};
writeFileSync('docs/durchgang.json', `${JSON.stringify(ergebnis, null, 2)}\n`, 'utf-8');

for (const s of schritte) {
  const zeichen = s.fehler ? '✕' : s.uebersprungen ? '·' : '✓';
  console.log(`${zeichen} ${s.name}${s.fehler ? `  — ${s.fehler}` : ''}`);
}
if (seitenfehler.length) console.log(`\nFehler im Browser: ${seitenfehler.join(' | ')}`);
console.log(fehler ? `\nABGEBROCHEN: ${fehler}` : '\nDurchgang vollständig.');
