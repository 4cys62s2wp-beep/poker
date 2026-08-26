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

await schritt('Die Startseite bietet Fortsetzen statt Menü', async () => {
  /* Wer die App öffnet, während ein Abend läuft, soll nicht durch ein Menü.
     Ganz oben steht die laufende Runde, mit Startzeit und Namen. */
  await seite.goto(`${GRUND}/#/`, { waitUntil: 'domcontentloaded' });
  await seite.waitForTimeout(400);
  const karte = seite.locator('.start-fortsetzen');
  const text = (await karte.innerText()).trim().replace(/\n/g, ' · ');
  const ziel = await karte.getAttribute('href');
  const obenAbstand = await karte.evaluate((el) => Math.round(el.getBoundingClientRect().top));
  await karte.click();
  await seite.waitForTimeout(400);
  return {
    text,
    ziel,
    oben_px: obenAbstand,
    fuehrt_an_den_tisch: new URL(seite.url()).hash === '#/session/live',
    nennt_namen: /Lorenz/.test(text),
  };
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

await schritt('Ohne Netz weiterspielen', async () => {
  /* Der Live-Bereich muss am Küchentisch ohne Empfang laufen. Ein Test über
     den Quelltext („es steht kein fetch darin") ist ein Anfang; er sagt aber
     nichts darüber, ob die App überhaupt aus dem Gerät startet. Also wird
     hier wirklich das Netz abgeschaltet. */
  await seite.waitForTimeout(1200);       // dem Service Worker Zeit geben
  const angemeldet = await seite.evaluate(
    async () => (await navigator.serviceWorker?.getRegistrations?.() ?? []).length > 0,
  );

  await kontext.setOffline(true);
  let neugeladen = false;
  let zeit = '';
  let blinds = '';
  try {
    await seite.reload({ waitUntil: 'domcontentloaded' });
    await seite.waitForSelector('.tisch-zeit', { timeout: 8000 });
    zeit = (await seite.locator('.tisch-zeit').innerText()).trim();
    blinds = (await seite.locator('.tisch-blinds').innerText()).trim();
    neugeladen = true;
  } catch {
    /* Kein Neuladen möglich — wird unten festgehalten, nicht verschwiegen. */
  }
  await kontext.setOffline(false);
  if (!neugeladen) {
    await seite.reload({ waitUntil: 'domcontentloaded' });
    await seite.waitForTimeout(500);
  }

  return {
    service_worker_angemeldet: angemeldet,
    neu_geladen_ohne_netz: neugeladen,
    zeit,
    blinds,
    abend_noch_da: await seite.evaluate((k) => localStorage.getItem(k) !== null, SCHLUESSEL),
  };
});

await schritt('Ein Ereignis am Tisch erfassen', async () => {
  /* Der Auftrag setzt eine Obergrenze: unter dreißig Sekunden. Gemessen wird
     hier beides — die Zahl der Griffe (das ist die eigentliche Aussage) und
     die Zeit, die der Browser dafür braucht. */
  const begonnen = Date.now();
  let griffe = 0;

  await seite.getByRole('button', { name: 'Stände' }).click(); griffe += 1;
  await seite.waitForTimeout(200);
  const zeilen = await seite.locator('.stand-zeile').count();

  /* Ben ist raus. */
  await seite.locator('.stand-zeile').last().getByRole('button', { name: 'Raus' }).click();
  griffe += 1;
  await seite.waitForTimeout(150);

  /* Ada kauft nach. */
  await seite.locator('.stand-zeile').nth(3).getByRole('button', { name: 'Nachgekauft' }).click();
  griffe += 1;
  await seite.waitForTimeout(150);

  const nochDabei = (await seite.locator('.tisch-frage-blatt.staende .hinweis').last().innerText()).trim();
  await seite.getByRole('button', { name: 'Fertig' }).click(); griffe += 1;
  await seite.waitForTimeout(250);

  const gespeichert = await seite.evaluate((k) => JSON.parse(localStorage.getItem(k)), SCHLUESSEL);
  return {
    zeilen,
    griffe,
    dauer_ms: Date.now() - begonnen,
    noch_dabei_text: nochDabei,
    ausgeschieden: gespeichert.spieler.filter((p) => p.stand === null).length,
    raus_um_gesetzt: gespeichert.spieler.some((p) => typeof p.raus_um === 'number'),
    nachgekauft: gespeichert.spieler.filter((p) => p.eingekauft > gespeichert.startchips).length,
    blatt_wieder_zu: await seite.locator('.tisch-frage-blatt.staende').count() === 0,
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
    abende_gespeichert: await seite.evaluate(
      () => JSON.parse(localStorage.getItem('pokermentor-session-abende-v1') ?? '[]').length,
    ),
  };
});

await schritt('Der Abend steht in der Liste', async () => {
  const karten = seite.locator('.abend-karte');
  const namen = seite.locator('.abende-namen-reihe .abende-name');
  return {
    abende: await karten.count(),
    erste_karte: (await karten.first().innerText()).trim().replace(/\n/g, ' · '),
    namen_als_knoepfe: await namen.count(),
    namen: await namen.allInnerTexts(),
  };
});

await schritt('Ein Tipp auf einen Namen führt zu dieser Person', async () => {
  /* Kein Suchfeld: Der Weg zu früheren Abenden führt über den Namen. */
  const name = (await seite.locator('.abende-namen-reihe .abende-name').first().innerText()).trim();
  await seite.locator('.abende-namen-reihe .abende-name').first().click();
  await seite.waitForTimeout(400);
  return {
    getippt: name,
    adresse: decodeURIComponent(new URL(seite.url()).hash),
    ueberschrift: (await seite.locator('h1').first().innerText()).trim(),
    untertitel: (await seite.locator('.page-header .sub, .page-header p').first().innerText()).trim(),
    abende: await seite.locator('.abend-karte').count(),
    suchfeld: await seite.locator('input[type="search"]').count(),
  };
});

await schritt('Ein Tipp auf einen Abend zeigt den Abend', async () => {
  await seite.locator('.abend-karte').first().click();
  await seite.waitForTimeout(400);
  const zeilen = seite.locator('.abend-zeile');
  return {
    adresse: new URL(seite.url()).hash.replace(/\/\d+$/, '/<id>'),
    zeilen: await zeilen.count(),
    plaetze: (await seite.locator('.abend-platz').allInnerTexts()).map((t) => t.trim()),
    zurueck_sichtbar: await seite.locator('a[href="#/session/abende"]').count() > 0,
  };
});

/* ── Das private Gerät: der Drill ──────────────────────────────────────────
   Der Auftrag beschreibt zwei Geräterollen. Der Tisch ist gemessen
   (`npm run tisch`); das private Gerät ist der Lernbildschirm, und für ihn
   gelten zwei eigene Regeln: Ergebniszahlen groß, alles andere klein — und
   zwischen Eingabe und Ergebnis kein Warten und keine Bewegung. */

await schritt('Der Drill zeigt eine Aufgabe', async () => {
  await seite.goto(`${GRUND}/#/lernen/drill`, { waitUntil: 'domcontentloaded' });
  await seite.waitForSelector('.drill-knopf.ja', { timeout: 8000 });
  await seite.waitForTimeout(300);
  return seite.evaluate(() => {
    const groesse = (el) => Math.round(parseFloat(getComputedStyle(el).fontSize) * 10) / 10;
    const sichtbar = (el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    };
    const texte = [...document.querySelectorAll('.drill *')]
      .filter((el) => sichtbar(el) && [...el.childNodes]
        .some((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim()))
      .map((el) => ({ klasse: el.className || el.tagName.toLowerCase(), px: groesse(el) }))
      .sort((a, b) => b.px - a.px);
    return {
      groesste: texte[0],
      zweitgroesste: texte.find((t) => t.px < texte[0].px),
      knoepfe: [...document.querySelectorAll('.drill-knopf')].filter(sichtbar).length,
    };
  });
});

await schritt('Zwischen Eingabe und Ergebnis liegt nichts', async () => {
  /* Gemessen wird zweierlei: wie lange es dauert, bis die Auflösung dasteht,
     und ob sich dabei etwas bewegt. Ein Knopf, der beim Antworten wegrutscht,
     ist schlimmer als eine Wartezeit — man tippt daneben. */
  const vorher = await seite.evaluate(() => {
    const r = document.querySelector('.drill-knopf.ja').getBoundingClientRect();
    return { oben: Math.round(r.top), links: Math.round(r.left) };
  });
  const t0 = Date.now();
  await seite.locator('.drill-knopf.ja').click();
  await seite.waitForSelector('.drill-zahl', { timeout: 4000 });
  const dauer_ms = Date.now() - t0;

  const nachher = await seite.evaluate(() => {
    const knopf = document.querySelector('.drill-knopf.weiter') ?? document.querySelector('.drill-knopf');
    const r = knopf.getBoundingClientRect();
    const zahl = document.querySelector('.drill-zahl');
    const st = getComputedStyle(zahl);
    return {
      oben: Math.round(r.top),
      links: Math.round(r.left),
      ergebnis_px: Math.round(parseFloat(st.fontSize) * 10) / 10,
      ergebnis_text: zahl.textContent.trim(),
      uebergang: st.transitionDuration,
      belebung: st.animationName,
    };
  });

  return {
    dauer_ms,
    knopf_bewegt_px: Math.abs(nachher.oben - vorher.oben) + Math.abs(nachher.links - vorher.links),
    ...nachher,
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
