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
import { holeChromium } from './browser.mjs';

/* Playwright liegt nicht im Projekt (siehe browser.mjs) — der Fundort
   wird zur Laufzeit gesucht, damit dieser Lauf überall startet. */
const chromium = await holeChromium();

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
  const stufen = seite.locator('.einrichten-plan li');
  return {
    startchips: (await gross.innerText()).trim(),
    blindstufen: await stufen.count(),
    erste_stufe: (await stufen.first().locator('.plan-blinds').innerText()).trim(),
    letzte_stufe: (await stufen.last().locator('.plan-blinds').innerText()).trim(),
    zeitplan_mit_uhrzeit: /\d{1,2}[:.]\d{2}/.test((await stufen.first().locator('.plan-zeit').innerText())),
    finale_satz: (await seite.locator('.einrichten-block').last().locator('p.hinweis').first().innerText()).trim(),
    plan_ende: (await seite.locator('.einrichten-block').last().locator('p.hinweis').last().innerText()).trim(),
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
    /* Seit E-094 beginnt der Abend bereit und steht still: Die Uhr läuft erst,
       wenn jemand „Uhr starten" tippt — sonst läuft die erste Stufe, während
       noch Chips verteilt werden. */
    startet_pausiert: gespeichert?.laeuft_seit === null,
    marke: (await seite.locator('.tisch-pausiert').innerText()).trim(),
  };
});

await schritt('Uhr starten setzt die Uhr in Gang', async () => {
  await seite.getByRole('button', { name: 'Uhr starten' }).click();
  await seite.waitForTimeout(400);
  const gespeichert = await seite.evaluate((k) => JSON.parse(localStorage.getItem(k)), SCHLUESSEL);
  return {
    laeuft: gespeichert?.laeuft_seit !== null,
    marke_weg: await seite.locator('.tisch-pausiert').count() === 0,
  };
});

await schritt('Die Uhr läuft wirklich', async () => {
  const vorher = (await seite.locator('.tisch-zeit').innerText()).trim();
  await seite.waitForTimeout(2200);
  const nachher = (await seite.locator('.tisch-zeit').innerText()).trim();
  return { vorher, nachher, hat_sich_bewegt: vorher !== nachher };
});

await schritt('Die laufende Runde steht in der großen Karte', async () => {
  /* „Fortsetzen statt Menü" (Phase 2) gilt weiter — die Runde steht auf der
     Startseite und ist einen Tipp entfernt. Sie steht seit E-035 aber nicht
     mehr in einer eigenen kleinen Karte oben, sondern in der großen unten:
     Dieselbe Auskunft zweimal auf einem Bildschirm ist einmal zu viel, und
     unten ist sie größer und im Daumenbereich. */
  await seite.goto(`${GRUND}/#/`, { waitUntil: 'domcontentloaded' });
  await seite.waitForSelector('.start-einstieg.gross');
  await seite.waitForTimeout(400);
  const karte = seite.locator('.start-einstieg.gross');
  const text = (await karte.innerText()).trim().replace(/\n/g, ' · ');
  const knopf = karte.locator('.start-knopf');
  const ziel = await knopf.getAttribute('href');
  const kasten = await knopf.boundingBox();
  await knopf.click();
  await seite.waitForTimeout(400);
  return {
    text,
    ziel,
    knopf_hoehe: Math.round(kasten?.height ?? 0),
    fuehrt_an_den_tisch: new URL(seite.url()).hash === '#/session/live',
    nennt_spielerzahl: /\d+ Spieler/.test(text),
    nennt_blinds: /Blinds \d+\/\d+/.test(text),
    /* Die alte Karte oben darf nicht mehr da sein — sonst stünde dasselbe
       zweimal. */
    alte_karte_oben: await seite.locator('.start-fortsetzen').count(),
  };
});

/* ── Der Tischzustand ──────────────────────────────────────────────────────
   Läuft eine Runde, entfällt die Hand des Tages (E-036): Wer das Gerät
   zwischen Chips und Karten aufnimmt, will die Uhr sehen, keine
   Übungsaufgabe. Der Bildschirm ist dann wieder genau der aus E-032/E-035 —
   und für ihn gelten dessen Regeln unverändert. Gemessen wird das hier,
   solange die Runde noch läuft. */

await schritt('Am Tisch bleibt die Startseite der Bildschirm von vorher', async () => {
  await seite.goto(`${GRUND}/#/`, { waitUntil: 'domcontentloaded' });
  await seite.waitForSelector('.start-einstieg.gross');
  await seite.waitForTimeout(400);
  const gemessen = await seite.evaluate(() => {
    const masse = (auswahl) => {
      const el = document.querySelector(auswahl);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { oben: Math.round(r.top), unten: Math.round(r.bottom), hoehe: Math.round(r.height) };
    };
    const gross = masse('.start-einstieg.gross');
    return {
      /* Der Punkt: keine Tagesaufgabe, solange gespielt wird. */
      hand_des_tages_da: document.querySelectorAll('.heute').length,
      scrollt: document.documentElement.scrollHeight > window.innerHeight + 1,
      reihenfolge: [...document.querySelectorAll('.start-einstieg')]
        .map((el) => el.className.replace('start-einstieg ', '')),
      klein: masse('.start-einstieg.klein'),
      mittel: masse('.start-einstieg.mittel'),
      gross,
      rest_unten_px: gross ? window.innerHeight - gross.unten : null,
      gestenstreifen_px: Number.parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--gestenstreifen'), 10,
      ),
    };
  });
  /* Zurück an den Tisch: Die folgenden Schritte prüfen die laufende Runde
     weiter, und dieser Abstecher darf sie nicht unterbrechen. */
  await seite.goto(`${GRUND}/#/session/live`, { waitUntil: 'domcontentloaded' });
  await seite.waitForSelector('.tisch-zeit');
  await seite.waitForTimeout(300);
  return gemessen;
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

await schritt('Auszahlung übernimmt den laufenden Abend', async () => {
  /* Wer den Abend in der App führt, tippt Spieler, Einsatz und Rebuys nicht
     noch einmal ein (E-094). */
  await seite.goto(`${GRUND}/#/session/auszahlung`, { waitUntil: 'domcontentloaded' });
  await seite.waitForSelector('#pa-spieler');
  const knopf = seite.getByRole('button', { name: 'Aus dem laufenden Abend übernehmen' });
  const angeboten = await knopf.count();
  const hinweis = angeboten ? (await knopf.locator('xpath=preceding-sibling::span').innerText()).trim() : '';
  if (angeboten) await knopf.click();
  await seite.waitForTimeout(200);
  const ergebnis = {
    angeboten,
    hinweis,
    spieler: await seite.locator('#pa-spieler').inputValue(),
    buyin: await seite.locator('#pa-buyin').inputValue(),
    rebuys: await seite.locator('#pa-rebuys').inputValue(),
    einheit_chips: await seite.getByRole('radio', { name: 'Chips' }).getAttribute('aria-checked'),
  };
  await seite.goto(`${GRUND}/#/session/live`, { waitUntil: 'domcontentloaded' });
  await seite.waitForSelector('.tisch-zeit');
  return ergebnis;
});

await schritt('Beenden fragt nach und tut es dann', async () => {
  /* Das Beenden liegt hinter „Mehr" (E-094): Neben „Pause" stand es vorher,
     eine Handbreite entfernt von dem Knopf, den man am häufigsten drückt. */
  await seite.getByRole('button', { name: 'Mehr', exact: true }).click();
  await seite.waitForTimeout(300);
  await seite.getByRole('button', { name: /^Abend beenden/ }).click();
  await seite.waitForTimeout(300);
  const gefragt = await seite.locator('.tisch-frage').count() > 0;
  const frage = (await seite.locator('.tisch-frage strong').innerText()).trim();
  await seite.locator('.tisch-frage button').first().click();
  await seite.waitForTimeout(500);
  const adresse = new URL(seite.url()).hash;
  const abschluss = {
    ueberschrift: (await seite.locator('h1').first().innerText()).trim(),
    hat_pruefzeile: await seite.locator('.abend-pruefung').count() > 0,
    hat_teilen: await seite.getByRole('button', { name: /Teilen/ }).count() > 0,
  };
  const ergebnis = {
    gefragt,
    frage,
    adresse_danach: adresse.replace(/\/abende\/[^?]+/, '/abende/ID'),
    abschluss,
    abend_beendet: await seite.evaluate((k) => localStorage.getItem(k) === null, SCHLUESSEL),
    abende_gespeichert: await seite.evaluate(
      () => JSON.parse(localStorage.getItem('pokermentor-session-abende-v1') ?? '[]').length,
    ),
  };
  await seite.goto(`${GRUND}/#/session/abende`, { waitUntil: 'domcontentloaded' });
  await seite.waitForTimeout(400);
  return ergebnis;
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

/* ── Die Farbmodi ─────────────────────────────────────────────────────────
   Drei Modi, und einer davon ist eine Regel und keine Farbwelt: Die
   Systemvorgabe löst zu hell oder dunkel auf. Über allem steht, dass der
   Live-Bereich in jedem Modus dunkel bleibt. */

await schritt('Die Farbwahl liegt unter dem Personensymbol', async () => {
  /* Seit E-095 unter „Einstellungen“ (Zahnrad im Profil), nicht mehr mitten im
     Profil. Gewählt wird die Gruppe „Farben“ — die Seite hat mehr als eine. */
  await seite.goto(`${GRUND}/#/profil/einstellungen`, { waitUntil: 'domcontentloaded' });
  await seite.waitForSelector('[aria-labelledby="einst-farben"]');
  await seite.waitForTimeout(300);
  const knoepfe = seite.locator('[aria-labelledby="einst-farben"] button');
  const anzahl = await knoepfe.count();
  const eintraege = [];
  for (let i = 0; i < anzahl; i += 1) {
    eintraege.push({
      text: (await knoepfe.nth(i).innerText()).trim(),
      gewaehlt: await knoepfe.nth(i).getAttribute('aria-checked') === 'true',
    });
  }
  return {
    anzahl,
    eintraege,
    /* Nicht auf der Startseite: Die Wahl wird einmal getroffen und dann
       jahrelang nicht mehr; Fläche dort brauchen die drei Karten. */
    auf_startseite: await seite.evaluate(async () => {
      const antwort = await fetch('./index.html');
      return (await antwort.text()).includes('radiogroup');
    }),
  };
});

await schritt('Umschalten wirkt sofort und wird gemerkt', async () => {
  /* Beide Richtungen, damit die Messung nicht davon abhängt, was das
     Testgerät zufällig vorgibt: erst ausdrücklich dunkel, dann hell. */
  const lies = () => seite.evaluate(() => ({
    grund: getComputedStyle(document.body).backgroundColor,
    attribut: document.documentElement.getAttribute('data-modus'),
    farbschema: getComputedStyle(document.documentElement).colorScheme,
    gespeichert: localStorage.getItem('pokermentor-farbmodus-v1'),
  }));
  const knoepfe = seite.locator('[aria-labelledby="einst-farben"] button');

  await knoepfe.nth(2).click();
  await seite.waitForTimeout(200);
  const dunkel = await lies();

  await knoepfe.nth(1).click();
  await seite.waitForTimeout(200);
  const hell = await lies();

  return {
    dunkel,
    hell,
    hat_gewechselt: dunkel.grund !== hell.grund,
    /* Ohne Neustart: Zwischen Klick und Farbe liegt kein Neuladen. */
    ohne_neuladen: await seite.evaluate(() => performance.getEntriesByType('navigation').length === 1),
  };
});

await schritt('Nach dem Neuladen steht die Farbe vor dem ersten Zeichnen fest', async () => {
  /* Der blinde Fleck dieses Schritts, gefunden in E-043.
     ---------------------------------------------------
     Gemessen wurde bei `domcontentloaded`. Das Programm hängt als
     `type="module"` im Dokument und läuft damit VOR diesem Ereignis — der
     Wert war also längst von React gesetzt, und der Schritt hätte auch
     dann Grün gemeldet, wenn das inline-Skript gar nicht gelaufen wäre.

     Genau das war der Fall: Die Sicherheitsrichtlinie erlaubte kein
     inline-Skript, die Konsole meldete auf jeder Seite „Refused to execute
     inline script", und die Vorbeugung gegen das Aufblitzen lief nie.

     Jetzt wird bei `commit` gemessen — direkt nachdem das Dokument zu
     laufen beginnt und bevor irgendein Modul an der Reihe war. Und die
     Konsole wird mitgelesen: Eine Richtlinie, die etwas still verbietet,
     meldet sich nur dort. */
  const fehler = [];
  const konsole = (m) => { if (m.type() === 'error') fehler.push(m.text().slice(0, 160)); };
  seite.on('console', konsole);
  await seite.reload({ waitUntil: 'commit' });
  await seite.waitForTimeout(80);
  const beiCommit = await seite
    .evaluate(() => document.documentElement.getAttribute('data-modus'))
    .catch(() => null);
  await seite.waitForTimeout(900);
  seite.off('console', konsole);
  const roh = await seite.evaluate(async () => (await (await fetch('./index.html')).text()));
  return {
    bei_commit: beiCommit,
    spaeter: await seite.evaluate(() => document.documentElement.getAttribute('data-modus')),
    skript_vor_stilblatt: roh.indexOf('data-modus') < roh.search(/<link[^>]+rel="stylesheet"/),
    konsolenfehler: fehler,
  };
});

await schritt('Der Live-Bereich bleibt dunkel, auch bei heller Wahl', async () => {
  /* Die Wahl steht auf „hell" — der Schritt davor hat sie gesetzt. */
  await seite.goto(`${GRUND}/#/session`, { waitUntil: 'domcontentloaded' });
  await seite.waitForTimeout(400);
  const werte = await seite.evaluate(() => {
    const rahmen = document.querySelector('.modus-rahmen');
    const c = getComputedStyle(rahmen);
    const w = document.documentElement;
    return {
      wahl_am_dokument: w.getAttribute('data-modus'),
      rahmen_attribut: rahmen.getAttribute('data-modus'),
      grund: c.getPropertyValue('--bg').trim(),
      text: c.getPropertyValue('--text').trim(),
      akzent: c.getPropertyValue('--akzent').trim(),
    };
  });
  await seite.goto(`${GRUND}/#/lernen`, { waitUntil: 'domcontentloaded' });
  await seite.waitForTimeout(300);
  const lernen = await seite.evaluate(() => ({
    rahmen_attribut: document.querySelector('.modus-rahmen').getAttribute('data-modus'),
    grund: getComputedStyle(document.querySelector('.modus-rahmen')).getPropertyValue('--bg').trim(),
  }));
  return { live: werte, lernen };
});

/* ── Die Startseite: die drei Karten sind die Navigation ───────────────────
   Seit E-032 gibt es keine untere Leiste mehr. Damit tragen die drei Karten
   die Navigation allein — und dann dürfen sie nicht oben kleben, während die
   untere Bildschirmhälfte leer bleibt. Ausgerechnet die ist die, die der
   Daumen erreicht. */

await schritt('Die Startseite füllt den Bildschirm', async () => {
  await seite.goto(`${GRUND}/#/`, { waitUntil: 'domcontentloaded' });
  await seite.waitForSelector('.start-einstieg.gross');
  await seite.waitForTimeout(400);
  return seite.evaluate(() => {
    const masse = (auswahl) => {
      const el = document.querySelector(auswahl);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { oben: Math.round(r.top), unten: Math.round(r.bottom), hoehe: Math.round(r.height) };
    };
    const gross = masse('.start-einstieg.gross');
    return {
      /* Nicht nach einer Klasse suchen, sondern nach der Rolle: Eine neue
         Leiste hieße beim nächsten Mal anders, und ein Test auf
         `nav.bottom-nav` ginge dann durch. Gezählt wird, was für einen
         Screenreader Navigation IST — <nav> und role="navigation" —, und
         jede davon wird vermessen. */
      navigationen: [...document.querySelectorAll('nav, [role="navigation"]')]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          const st = getComputedStyle(el);
          return r.width > 0 && r.height > 0
            && st.visibility !== 'hidden' && st.display !== 'none';
        })
        .map((el) => {
          const r = el.getBoundingClientRect();
          return {
            marke: el.tagName.toLowerCase()
              + (el.className ? `.${String(el.className).trim().split(/\s+/).join('.')}` : ''),
            oben: Math.round(r.top),
            unten: Math.round(r.bottom),
            breite: Math.round(r.width),
            /* Der Abstand der Unterkante zum unteren Bildschirmrand. Klein
               heißt: sitzt dort, wo eine Tableiste sitzen würde. */
            abstand_unterkante: Math.round(window.innerHeight - r.bottom),
            spannt_die_breite: r.width > window.innerWidth * 0.6,
          };
        }),
      scrollt: document.documentElement.scrollHeight > window.innerHeight + 1,
      fensterhoehe: window.innerHeight,

      /* Die Hand des Tages (E-036). Gemessen wird nicht, dass es sie gibt,
         sondern dass sie das Erste ist und dass man sie beantworten kann,
         ohne zu scrollen: Eine Aufgabe unterhalb des Bildrands ist keine
         Aufgabe, sondern eine, die man findet, wenn man schon sucht. */
      heute: (() => {
        const el = document.querySelector('.heute');
        if (!el) return null;
        const knoepfe = [...el.querySelectorAll('.heute-knopf')];
        const eltern = el.parentElement;
        return {
          ist_erstes_kind: eltern ? eltern.firstElementChild === el : false,
          steht_ueber_den_karten: el.getBoundingClientRect().bottom
            <= (document.querySelector('.start-einstieg')?.getBoundingClientRect().top ?? 0),
          knoepfe: knoepfe.length,
          knopf_hoehe: knoepfe.length
            ? Math.round(Math.min(...knoepfe.map((k) => k.getBoundingClientRect().height))) : 0,
          knoepfe_ohne_scrollen: knoepfe.length > 0
            && knoepfe.every((k) => k.getBoundingClientRect().bottom <= window.innerHeight),
          karten_sichtbar: el.querySelectorAll('.pcard').length,
          kartenbreite_px: Math.round(
            el.querySelector('.pcard')?.getBoundingClientRect().width ?? 0,
          ),
          wochenpunkte: el.querySelectorAll('.heute-woche .punkt').length,
        };
      })(),

      reihenfolge: [...document.querySelectorAll('.start-einstieg')]
        .map((el) => el.className.replace('start-einstieg ', '')),
      klein: masse('.start-einstieg.klein'),
      mittel: masse('.start-einstieg.mittel'),
      gross,
      /* Was zwischen der untersten Karte und dem Bildschirmrand steht. Mehr
         als der Sicherheitsabstand ist Leerraum. */
      rest_unten_px: gross ? window.innerHeight - gross.unten : null,
      gestenstreifen_px: Number.parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--gestenstreifen'), 10,
      ),
      stand_oben_px: masse('.start-stand')?.oben ?? null,
      lernen_text: document.querySelector('.start-einstieg.mittel .name')?.textContent.trim(),

      /* Wie viel der Innenfläche einer Karte ihr Inhalt wirklich belegt.
         Die Karten füllen die Höhe des Bildschirms; wenn ihr Inhalt das
         nicht tut, sieht die Karte innen leer aus — genau das war der
         Anlass für E-035. Gemessen wird senkrecht, weil nur senkrecht
         gestreckt wird: von der Oberkante des ersten bis zur Unterkante des
         letzten Kindes, geteilt durch die Innenhöhe. */
      fuellung: [...document.querySelectorAll('.start-einstieg')].map((karte) => {
        const st = getComputedStyle(karte);
        const innen = karte.clientHeight
          - Number.parseFloat(st.paddingTop) - Number.parseFloat(st.paddingBottom);
        const kinder = [...karte.children].filter((k) => {
          const r = k.getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        });
        if (kinder.length === 0 || innen <= 0) return null;
        /* Die Summe der Kindhöhen samt Außenabständen — siehe die
           ausführliche Begründung im Schritt „Die Karten sind auf jedem
           Bezugsgerät innen gefüllt". */
        const belegt = kinder.reduce((n, k) => {
          const ks = getComputedStyle(k);
          return n + k.getBoundingClientRect().height
            + Number.parseFloat(ks.marginTop) + Number.parseFloat(ks.marginBottom);
        }, 0);
        return {
          karte: karte.className.replace('start-einstieg ', ''),
          innen_px: Math.round(innen),
          belegt_px: Math.round(belegt),
          anteil: Math.round((belegt / innen) * 1000) / 1000,
          /* Abgeschnitten wäre schlimmer als leer. */
          ueberlauf_px: Math.max(0, karte.scrollHeight - karte.clientHeight),
        };
      }).filter(Boolean),
    };
  });
});

/* ── Innen gefüllt, nicht nur außen groß ──────────────────────────────────
   Die Karten füllen die Bildschirmhöhe. Solange ihr Inhalt aus zwei
   Textzeilen bestand, sahen sie deswegen innen leer aus — der Anlass für
   E-035. Der Schritt darüber misst das auf dem Gerät des Durchgangs; dieser
   misst es auf allen drei Bezugsgeräten aus DESIGN.md, Regel 10.1, denn
   eine Karte, die nur auf einem davon gefüllt ist, ist nicht gefüllt. */

await schritt('Die Karten sind auf jedem Bezugsgerät innen gefüllt', async () => {
  const urspruenglich = seite.viewportSize();
  const messungen = [];
  for (const [breite, hoehe] of [[375, 667], [390, 844], [360, 740]]) {
    await seite.setViewportSize({ width: breite, height: hoehe });
    await seite.goto(`${GRUND}/#/`, { waitUntil: 'domcontentloaded' });
    await seite.waitForSelector('.start-einstieg.gross');
    await seite.waitForTimeout(400);
    messungen.push({
      geraet: `${breite}x${hoehe}`,
      ...(await seite.evaluate(() => ({
        scrollt: document.documentElement.scrollHeight > window.innerHeight + 1,
        /* Was zwischen der untersten Karte und dem Bildschirmrand bleibt. */
        rest_unten_px: Math.round(window.innerHeight
          - document.querySelector('.start-einstieg.gross').getBoundingClientRect().bottom),
        /* Die Hand des Tages muss auf JEDEM Gerät beantwortbar sein, ohne
           zu scrollen — auch auf dem kurzen, auf dem die Seite als Ganzes
           nicht mehr auf einen Bildschirm passt (E-036). */
        heute_knoepfe_ohne_scrollen: (() => {
          const k = [...document.querySelectorAll('.heute-knopf')];
          return k.length === 2 && k.every((x) => x.getBoundingClientRect().bottom <= window.innerHeight);
        })(),
        letzte_karte: [...document.querySelectorAll('.start-einstieg')]
          .pop()?.className.replace('start-einstieg ', '') ?? null,
        karten: [...document.querySelectorAll('.start-einstieg')].map((karte) => {
          const st = getComputedStyle(karte);
          const innen = karte.clientHeight
            - Number.parseFloat(st.paddingTop) - Number.parseFloat(st.paddingBottom);
          const kinder = [...karte.children].filter((k) => {
            const r = k.getBoundingClientRect();
            return r.width > 0 && r.height > 0;
          });
          if (kinder.length === 0 || innen <= 0) return null;
          /* Die Summe der Kindhöhen samt ihrer eigenen Außenabstände — nicht
             die Spanne vom ersten zum letzten Kind: Eine Spanne zählt die
             Lücke dazwischen als belegt mit und wäre bei einer Karte, die
             ihre zwei Zeilen an den oberen und den unteren Rand schiebt,
             immer 1. Die Abstände zählen mit, weil sie zur Gestaltung
             gehören; was übrig bleibt, ist der Rest, den die
             Höhenverteilung nicht vergeben konnte. In einer Flexspalte
             fallen Außenabstände nicht zusammen, die Summe ist also
             genau. */
          const belegt = kinder.reduce((n, k) => {
            const ks = getComputedStyle(k);
            return n + k.getBoundingClientRect().height
              + Number.parseFloat(ks.marginTop) + Number.parseFloat(ks.marginBottom);
          }, 0);
          return {
            karte: karte.className.replace('start-einstieg ', ''),
            /* Die Außenhöhe steht mit im Protokoll, damit die Tabelle in
               DESIGN.md, Regel 10.1, aus derselben Messung kommt wie die
               Füllung und nicht aus einer zweiten von Hand. */
            aussen_px: Math.round(karte.getBoundingClientRect().height),
            innen_px: Math.round(innen),
            belegt_px: Math.round(belegt),
            anteil: Math.round((belegt / innen) * 1000) / 1000,
            ueberlauf_px: Math.max(0, karte.scrollHeight - karte.clientHeight),
          };
        }).filter(Boolean),
      }))),
    });
  }
  await seite.setViewportSize(urspruenglich);
  await seite.goto(`${GRUND}/#/`, { waitUntil: 'domcontentloaded' });
  await seite.waitForTimeout(300);
  return { messungen };
});

/* ── Die Hand des Tages lässt sich sofort beantworten ─────────────────────
   Der ganze Zweck dieses Bildschirmteils ist, dass man ihn benutzen kann,
   ohne irgendwohin zu gehen. Geprüft wird deshalb nicht seine Anwesenheit,
   sondern der Vorgang: antippen, Auflösung lesen, neu laden, Auflösung steht
   immer noch da. Ohne den letzten Teil wäre die Antwort von heute Morgen
   mittags verschwunden. */

await schritt('Die Hand des Tages wird auf der Startseite beantwortet', async () => {
  await seite.goto(`${GRUND}/#/`, { waitUntil: 'domcontentloaded' });
  await seite.waitForSelector('.heute-knopf');
  await seite.waitForTimeout(300);
  const vorher = await seite.evaluate(() => ({
    frage: document.querySelector('.heute-frage strong')?.textContent.trim(),
    karten: [...document.querySelectorAll('.heute .pcard')].map((k) => k.getAttribute('aria-label')),
    punkte_offen: document.querySelectorAll('.heute-woche .punkt.offen').length,
  }));
  /* Der gespeicherte Lernstand des aktiven Profils — dort steht die eine
     Serie (E-087). Aus dem Speicher gelesen, nicht von der Oberfläche: Die
     Oberfläche könnte eine Zahl zeigen, die nirgends gezählt wurde. */
  const lernstand = () => seite.evaluate(() => {
    try {
      const index = JSON.parse(localStorage.getItem('pokermentor-profiles-v1') ?? 'null');
      const d = JSON.parse(localStorage.getItem(`pokermentor-data-${index.activeId}`) ?? 'null');
      return { streak: d.streak.count, tag: d.streak.lastDay, xp: d.xp };
    } catch { return null; }
  });
  const stand0 = await lernstand();
  await seite.locator('.heute-knopf').first().click();
  await seite.waitForSelector('.heute-aufloesung');
  await seite.waitForTimeout(300);
  const stand1 = await lernstand();
  const serieAngezeigt = await seite.evaluate(() => ({
    karte: document.querySelector('.heute-aufloesung .serie')?.firstChild?.textContent?.trim(),
    lernkarte: document.querySelector('.start-stand .wert')?.textContent?.replace(/\s+/g, ' ').trim() ?? null,
    stand_sichtbar: document.querySelectorAll('.start-stand').length,
    erklaerung_da: document.querySelectorAll('.start-erklaerung').length,
  }));
  const danach = await seite.evaluate(() => ({
    urteil: document.querySelector('.heute-aufloesung .urteil')?.textContent.trim(),
    zahlen: document.querySelector('.heute-aufloesung .zahlen')?.textContent.trim(),
    warum_ziel: document.querySelector('.heute-warum')?.getAttribute('href'),
    knoepfe_weg: document.querySelectorAll('.heute-knopf').length,
    punkt_gefuellt: document.querySelectorAll(
      '.heute-woche .punkt.richtig, .heute-woche .punkt.falsch',
    ).length,
  }));
  await seite.reload({ waitUntil: 'domcontentloaded' });
  await seite.waitForSelector('.heute-aufloesung');
  await seite.waitForTimeout(300);
  const nachNeuladen = await seite.evaluate(() => ({
    urteil: document.querySelector('.heute-aufloesung .urteil')?.textContent.trim(),
    frage_wieder_da: document.querySelectorAll('.heute-knopf').length,
    karten: [...document.querySelectorAll('.heute .pcard')].map((k) => k.getAttribute('aria-label')),
  }));
  const stand2 = await lernstand();
  return {
    frage: vorher.frage,
    /* Die Antwort zählt für die Serie und gibt kleine XP — und nach dem
       Neuladen nicht ein zweites Mal. */
    streak_vorher: stand0?.streak ?? null,
    streak_nachher: stand1?.streak ?? null,
    streak_tag: stand1?.tag ?? null,
    xp_dazu: stand0 && stand1 ? stand1.xp - stand0.xp : null,
    xp_nach_neuladen_unveraendert: !!stand1 && !!stand2 && stand1.xp === stand2.xp
      && stand1.streak === stand2.streak,
    serie_in_der_karte: serieAngezeigt.karte,
    serie_in_der_lernkarte: serieAngezeigt.lernkarte,
    lernkarte_zeigt_stand: serieAngezeigt.stand_sichtbar === 1,
    erklaerung_nach_antwort_weg: serieAngezeigt.erklaerung_da === 0,
    karten_vorher: vorher.karten,
    punkte_offen_vorher: vorher.punkte_offen,
    ...danach,
    urteil_nach_neuladen: nachNeuladen.urteil,
    frage_wieder_da: nachNeuladen.frage_wieder_da,
    /* Dieselbe Hand nach dem Neuladen — nicht irgendeine. */
    hand_bleibt: JSON.stringify(nachNeuladen.karten) === JSON.stringify(vorher.karten),
  };
});

/* ── Der Willkommensdialog führt durch Sprache, Name und Ziel ─────────────
   Er erscheint nur beim allerersten Öffnen — dieser Lauf braucht deshalb
   einen eigenen Kontext ohne gespeicherte Sprache. Geprüft wird der Weg, den
   jemand wirklich geht: Name eintippen, das optionale Ziel wählen, auf der
   Startseite ankommen — mit dem Namen oben und ohne Erklärung, die der Wahl
   widerspricht. Dazu der Sprung zum Konto, der nur dort erscheint, wo es
   eines geben kann (`kontoAnbieten`, FAHRPLAN 3.6). */

const ANBIETER = JSON.stringify({
  provider: 'Test', street: 'Weg 1', city: '10115 Berlin', country: 'Deutschland', email: 'test@beispiel.de',
});

async function frischerStart({ mitAnbieter }) {
  const k = await browser.newContext({ viewport: { width: 375, height: 667 }, locale: 'de-DE' });
  if (mitAnbieter) {
    await k.route('**/legal.json', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: ANBIETER }));
  }
  const p = await k.newPage();
  await p.goto(`${GRUND}/#/`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('[role="dialog"]');
  await p.waitForTimeout(400);
  return { k, p };
}

await schritt('Der Willkommensdialog führt durch Name und Ziel', async () => {
  const { k, p } = await frischerStart({ mitAnbieter: false });
  const dialog = p.locator('[role="dialog"]');
  const tagline = (await dialog.locator('p').first().innerText()).trim();
  const kontoLinkOhne = await dialog.getByRole('button', { name: 'Ich habe schon ein Konto' }).count();
  await dialog.getByRole('button', { name: 'Deutsch' }).click();
  await dialog.getByPlaceholder('Dein Name (optional)').fill('Mira');
  await dialog.getByRole('button', { name: 'Weiter' }).click();
  await p.waitForTimeout(200);
  const zielFrage = (await dialog.locator('.stat-label').innerText()).trim();
  const zielKnoepfe = await dialog.locator('button').allInnerTexts();
  const karte = await dialog.locator('.card').boundingBox();
  await dialog.getByRole('button', { name: 'Pokerabende leiten' }).click();
  await p.waitForSelector('.heute-knopf');
  await p.waitForTimeout(300);
  const danach = await p.evaluate(() => ({
    dialog_weg: document.querySelectorAll('[role="dialog"]').length === 0,
    oben_rechts: document.querySelector('.mobile-top-you')?.textContent.replace(/\s+/g, ' ').trim(),
    ziel_gespeichert: localStorage.getItem('pokermentor-ziel-v1'),
    erklaerung_da: document.querySelectorAll('.heute-erklaerung').length,
    frage: document.querySelector('.heute-frage strong')?.textContent.trim(),
    marke: document.querySelector('.heute-kopf .marke')?.textContent.trim(),
  }));
  await k.close();
  return {
    tagline,
    konto_link_ohne_anbieter: kontoLinkOhne,
    ziel_frage: zielFrage,
    ziel_knoepfe: zielKnoepfe.map((t) => t.trim()),
    dialog_passt_auf_667: !!karte && karte.y + karte.height <= 667,
    ...danach,
  };
});

await schritt('„Ich habe schon ein Konto“ springt zur Kontokarte', async () => {
  const { k, p } = await frischerStart({ mitAnbieter: true });
  const dialog = p.locator('[role="dialog"]');
  await p.waitForSelector('[role="dialog"] button:has-text("Ich habe schon ein Konto")');
  await dialog.getByRole('button', { name: 'Ich habe schon ein Konto' }).click();
  await p.waitForSelector('#konto');
  await p.waitForTimeout(900);
  const befund = await p.evaluate(() => {
    const ziel = document.getElementById('konto');
    const r = ziel.getBoundingClientRect();
    return {
      adresse: location.hash,
      fokus_auf_konto: document.activeElement === ziel,
      oben_px: Math.round(r.top),
      sichtbar: r.top >= 0 && r.bottom <= window.innerHeight,
      unter_der_kopfzeile: r.top >= (document.querySelector('.mobile-top')?.getBoundingClientRect().bottom ?? 0) - 1,
      dialog_weg: document.querySelectorAll('[role="dialog"]').length === 0,
    };
  });
  await k.close();
  return befund;
});

/* ── Das Tages-Quiz fragt nur, was man gelernt hat ───────────────────────
   Es zog fünf Fragen aus allen 248 — vier davon aus Modulen, die der Nutzer
   nie geöffnet hatte. Geprüft wird an einem Gerät ohne Fortschritt (es gibt
   kein Quiz, sondern den Hinweis) und an einem mit einer abgeschlossenen
   Lektion (es gibt eins, und es nennt seine Herkunft). */

await schritt('Das Tages-Quiz fragt nur, was man gelernt hat', async () => {
  const k = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'de-DE' });
  await k.addInitScript(() => localStorage.setItem('pokermentor-lang-v1', 'de'));
  const p = await k.newPage();
  await p.goto(`${GRUND}/#/lernen/tagesquiz`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('main h1');
  await p.waitForTimeout(500);
  const leer = await p.evaluate(() => ({
    titel: document.querySelector('main h2')?.textContent.trim(),
    start_knopf: [...document.querySelectorAll('main button')].filter((b) => /starten/.test(b.textContent)).length,
    weg: document.querySelector('main a.btn.primary')?.getAttribute('href'),
  }));
  await p.evaluate(() => {
    const idx = JSON.parse(localStorage.getItem('pokermentor-profiles-v1'));
    const key = `pokermentor-data-${idx.activeId}`;
    const d = JSON.parse(localStorage.getItem(key));
    d.completedLessons = { 'm1-l1': { completedAt: new Date().toISOString(), quizScore: 5, quizTotal: 5 } };
    localStorage.setItem(key, JSON.stringify(d));
  });
  await p.reload({ waitUntil: 'domcontentloaded' });
  await p.waitForSelector('main h1');
  await p.waitForTimeout(500);
  const bereit = await p.evaluate(() => ({
    titel: document.querySelector('main h2')?.textContent.trim(),
    text: document.querySelector('main .card p')?.textContent.trim(),
    start_knopf: [...document.querySelectorAll('main button')].filter((b) => /starten/.test(b.textContent)).length,
    seite: document.querySelector('main')?.textContent ?? '',
  }));
  /* Das Tagesziel auf der Startseite kennt das Quiz erst jetzt. */
  await p.goto(`${GRUND}/#/`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.heute-knopf');
  await p.locator('.heute-knopf').first().click();
  await p.waitForSelector('.heute-noch');
  const ziel = (await p.locator('.heute-noch .ziel').innerText()).replace(/\s+/g, ' ').trim();
  await k.close();
  return {
    ohne_fortschritt_titel: leer.titel,
    ohne_fortschritt_start_knopf: leer.start_knopf,
    ohne_fortschritt_weg: leer.weg,
    mit_lektion_titel: bereit.titel,
    mit_lektion_text: bereit.text,
    mit_lektion_start_knopf: bereit.start_knopf,
    fuenf_fragen_genannt: (bereit.seite.match(/[Ff]ünf|\b5 Fragen/g) ?? []).length,
    tagesziel_auf_start: ziel,
  };
});

await schritt('Erinnern ohne Server: Kalendereintrag und Glossar-Sprung', async () => {
  const k = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'de-DE', acceptDownloads: true });
  await k.addInitScript(() => {
    localStorage.setItem('pokermentor-lang-v1', 'de');
    /* Gezählt wird, ob die App um Mitteilungen bittet — nicht, wie der Browser
       voreingestellt ist (der Kopflose sagt „denied", ein normaler „default"). */
    window.__mitteilungsanfragen = 0;
    if (window.Notification) {
      const echt = Notification.requestPermission.bind(Notification);
      Notification.requestPermission = (...a) => { window.__mitteilungsanfragen += 1; return echt(...a); };
    }
  });
  const p = await k.newPage();
  await p.goto(`${GRUND}/#/profil/einstellungen`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.erinnerung-karte');
  await p.locator('#erinnerung-uhrzeit').fill('07:30');
  const [download] = await Promise.all([
    p.waitForEvent('download'),
    p.getByRole('button', { name: 'Kalendereintrag laden' }).click(),
  ]);
  const pfad = await download.path();
  const { readFileSync } = await import('node:fs');
  const ics = readFileSync(pfad, 'utf8');
  const anfragen = await p.evaluate(() => window.__mitteilungsanfragen);
  await p.goto(`${GRUND}/#/nachschlagen/glossar?q=Call`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.glossar-eintrag');
  await p.waitForTimeout(300);
  const glossar = await p.evaluate(() => ({
    offen: [...document.querySelectorAll('.glossar-eintrag.auf .glossar-begriff')].map((e) => e.textContent.trim()),
    treffer: document.querySelectorAll('.glossar-eintrag').length,
  }));
  await k.close();
  return {
    dateiname: download.suggestedFilename(),
    beginnt_richtig: ics.startsWith('BEGIN:VCALENDAR\r\n'),
    taeglich: ics.includes('RRULE:FREQ=DAILY'),
    uhrzeit_im_termin: /DTSTART:\d{8}T073000/.test(ics),
    mit_erinnerung: ics.includes('BEGIN:VALARM'),
    mitteilungsanfragen: anfragen,
    glossar_offen: glossar.offen,
    glossar_treffer_mehr_als_einer: glossar.treffer > 1,
  };
});

/* ── Lektion und Quiz ─────────────────────────────────────────────────────
   Drei Schritte an einem Gerät ohne Fortschritt:
   1. Die Lektion zeigt, wo man liest, und führt mit „Weiter" durch.
   2. Das Quiz ist eine eigene Adresse im Fokusmodus: Beim Antworten
      verschiebt sich nichts, das Verlassen fragt erst ab der ersten Antwort,
      und der Zwischenstand überlebt es.
   3. Bestehen heißt verstanden: Ein schlechter Durchgang gibt keinen Haken,
      kein Abzeichen, keine XP; ein guter schon. */

const lektionsKontext = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'de-DE' });
await lektionsKontext.addInitScript(() => localStorage.setItem('pokermentor-lang-v1', 'de'));
const lp = await lektionsKontext.newPage();
lp.on('pageerror', (e) => seitenfehler.push(`Lektion: ${e.message}`));
const lernstand = () => lp.evaluate(() => {
  const idx = JSON.parse(localStorage.getItem('pokermentor-profiles-v1'));
  const d = JSON.parse(localStorage.getItem(`pokermentor-data-${idx.activeId}`));
  return {
    xp: d.xp,
    fertig: Object.keys(d.completedLessons),
    versucht: d.lessonAttempts,
    fortschritt: d.lessonProgress,
    abzeichen: Object.keys(d.badges),
    wiederholung: d.reviews.length,
    streak: d.streak.count,
  };
});

await schritt('Die Lektion zeigt, wo man liest, und führt mit „Weiter“ durch', async () => {
  await lp.goto(`${GRUND}/#/lernen/m1/m1-l1`, { waitUntil: 'domcontentloaded' });
  await lp.waitForSelector('.lektions-leiste');
  await lp.waitForTimeout(500);
  const leiste = async () => lp.evaluate(() => {
    const el = document.querySelector('.lektions-leiste');
    const r = el.getBoundingClientRect();
    return {
      stand: el.querySelector('.stand')?.textContent.trim(),
      knopf: el.querySelector('.btn')?.textContent.trim(),
      unten_px: Math.round(r.bottom),
      fenster_px: window.innerHeight,
      klebt: getComputedStyle(el).position === 'sticky',
      scroll_y: Math.round(window.scrollY),
    };
  });
  const anfang = await leiste();
  const abschnitte = await lp.locator('section.lesson-section[id^="abschnitt-"]').count();
  // Zweimal „Weiter" — die Leiste folgt dem Lesen.
  await lp.locator('.lektions-leiste button').click();
  await lp.waitForTimeout(900);
  await lp.locator('.lektions-leiste button').click();
  await lp.waitForTimeout(900);
  const mitte = await leiste();
  const gemerkt = (await lernstand()).fortschritt['m1-l1'] ?? null;
  // Ans Ende: Aus „Weiter" wird das Quiz.
  await lp.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await lp.waitForTimeout(700);
  const ende = await leiste();
  // Zurück auf die Liste und wieder hinein: Die Seite springt an die gemerkte Stelle.
  const gemerktEnde = (await lernstand()).fortschritt['m1-l1'] ?? null;
  await lp.goto(`${GRUND}/#/lernen/m1`, { waitUntil: 'domcontentloaded' });
  await lp.waitForSelector('.lektionen');
  await lp.locator('.lektion-karte').first().click();
  await lp.waitForSelector('.lektions-leiste');
  await lp.waitForTimeout(1200);
  const wieder = await lp.evaluate(() => ({
    hinweis: document.querySelector('.lese-hinweis')?.textContent.replace(/\s+/g, ' ').trim() ?? null,
    scroll_y: Math.round(window.scrollY),
  }));
  await lp.evaluate(() => window.scrollTo(0, 0));
  return {
    abschnitte,
    stand_am_anfang: anfang.stand,
    knopf_am_anfang: anfang.knopf,
    klebt: anfang.klebt,
    leiste_unten_am_fensterrand: anfang.unten_px === anfang.fenster_px,
    stand_nach_zweimal_weiter: mitte.stand,
    scrollte_beim_weiter: mitte.scroll_y > anfang.scroll_y,
    abschnitt_gemerkt_nach_weiter: gemerkt,
    knopf_am_ende: ende.knopf,
    abschnitt_gemerkt_am_ende: gemerktEnde,
    wiederkehr_hinweis: wieder.hinweis,
    wiederkehr_sprang: wieder.scroll_y > 300,
  };
});

/** Messwerte der Quiz-Seite: wo steht was. */
const quizGeometrie = () => lp.evaluate(() => {
  const top = (sel) => Math.round(document.querySelector(sel)?.getBoundingClientRect().top ?? -1);
  const optionen = [...document.querySelectorAll('.quiz-option')].map((o) => Math.round(o.getBoundingClientRect().top));
  const leiste = document.querySelector('.quiz-leiste');
  const r = leiste.getBoundingClientRect();
  return {
    frage_oben: top('.quiz-frage'),
    optionen,
    leiste_oben: Math.round(r.top),
    leiste_hoehe: Math.round(r.height),
    leiste_unten: Math.round(r.bottom),
    fenster: window.innerHeight,
    klebt: getComputedStyle(leiste).position === 'sticky',
    zaehler: document.querySelector('.quiz-zaehler')?.textContent.trim(),
  };
});

await schritt('Das Quiz ist eine eigene Adresse im Fokusmodus', async () => {
  await lp.goto(`${GRUND}/#/lernen/m1/m1-l1`, { waitUntil: 'domcontentloaded' });
  await lp.waitForSelector('.lektions-leiste');
  await lp.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await lp.waitForTimeout(600);
  await lp.getByRole('button', { name: /Quiz starten/ }).click();
  await lp.waitForSelector('.quiz-fokus');
  await lp.waitForTimeout(400);
  const adresse = lp.url().split('#')[1];
  const vorher = await quizGeometrie();
  const kopf = await lp.evaluate(() => ({
    schliessen: document.querySelectorAll('.quiz-schliessen').length,
    seitenkopf: document.querySelectorAll('main .page-header').length,
    h1: document.querySelectorAll('main h1').length,
  }));
  await lp.locator('.quiz-option').first().click();
  await lp.waitForTimeout(350);
  const nachher = await quizGeometrie();
  const verschiebung = Math.max(
    ...vorher.optionen.map((y, i) => Math.abs(y - nachher.optionen[i])),
    Math.abs(vorher.frage_oben - nachher.frage_oben),
    Math.abs(vorher.leiste_oben - nachher.leiste_oben),
    Math.abs(vorher.leiste_hoehe - nachher.leiste_hoehe),
  );
  const text = await lp.evaluate(() => ({
    urteil: document.querySelector('.quiz-leiste .rueckmeldung-kopf')?.textContent.trim(),
    knopf: document.querySelector('.quiz-weiter')?.textContent.trim(),
    karten_unter_leiste: document.querySelector('.quiz-leiste').getBoundingClientRect().bottom <= window.innerHeight,
  }));
  // Weiter zu Frage 2, dann verlassen: Die Rückfrage kommt, der Stand bleibt.
  await lp.locator('.quiz-weiter').click();
  await lp.waitForTimeout(250);
  await lp.locator('.quiz-schliessen').click();
  await lp.waitForSelector('.quiz-rueckfrage');
  const rueckfrageText = (await lp.locator('.quiz-rueckfrage').innerText()).replace(/\s+/g, ' ');
  await lp.getByRole('button', { name: 'Verlassen', exact: true }).click();
  await lp.waitForSelector('.lektions-leiste');
  await lp.waitForTimeout(500);
  const zurueck = lp.url().split('#')[1];
  await lp.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await lp.waitForTimeout(500);
  const fortsetzen = (await lp.locator('.lektions-leiste .btn.primary').innerText()).trim();
  await lp.locator('.lektions-leiste .btn.primary').click();
  await lp.waitForSelector('.quiz-fokus');
  await lp.waitForTimeout(300);
  const wieder = (await quizGeometrie()).zaehler;
  // Browser-Zurück verlässt nur das Quiz.
  await lp.goBack();
  await lp.waitForSelector('.lektions-leiste');
  const nachZurueck = lp.url().split('#')[1];
  return {
    adresse,
    frage_oben_px: vorher.frage_oben,
    kopf,
    verschiebung_beim_antworten_px: verschiebung,
    leiste_hoehe_px: vorher.leiste_hoehe,
    leiste_klebt: vorher.klebt,
    leiste_am_fensterrand: vorher.leiste_unten === vorher.fenster,
    nach_antwort: text,
    rueckfrage: rueckfrageText,
    nach_verlassen: zurueck,
    knopf_danach: fortsetzen,
    zaehler_nach_fortsetzen: wieder,
    nach_browser_zurueck: nachZurueck,
  };
});

await schritt('Bestehen heißt verstanden', async () => {
  const neueLektion = async () => {
    await lp.evaluate(() => sessionStorage.clear());
    await lp.goto(`${GRUND}/#/lernen/m1/m1-l1/quiz`, { waitUntil: 'domcontentloaded' });
    await lp.waitForSelector('.quiz-fokus');
    await lp.waitForTimeout(300);
  };
  /** Ein Durchgang. `richtigeTexte`: Frage → Text der richtigen Option; ohne
   *  Angabe wird immer die erste gewählt (und die richtige gemerkt). */
  const durchgang = async (richtigeTexte) => {
    const gemerkt = {};
    const reihenfolgen = {};
    for (let i = 0; i < 5; i += 1) {
      await lp.waitForSelector('.quiz-option');
      const frage = (await lp.locator('.quiz-frage').innerText()).trim();
      reihenfolgen[frage] = await lp.locator('.quiz-option').allInnerTexts();
      if (richtigeTexte) {
        await lp.evaluate((ziel) => {
          const o = [...document.querySelectorAll('.quiz-option')]
            .find((b) => b.textContent.replace(/^[A-D]/, '').replace(/\s+/g, ' ').trim() === ziel);
          o.click();
        }, richtigeTexte[frage]);
      } else {
        await lp.locator('.quiz-option').first().click();
      }
      await lp.waitForSelector('.quiz-option.correct');
      gemerkt[frage] = await lp.evaluate(() => document.querySelector('.quiz-option.correct')
        .textContent.replace(/^[A-D]/, '').replace(/\s+/g, ' ').trim());
      await lp.locator('.quiz-weiter').click();
      await lp.waitForTimeout(150);
    }
    await lp.waitForSelector('.quiz-ergebnis');
    await lp.waitForTimeout(350);
    return { gemerkt, reihenfolgen };
  };
  const ergebnis = () => lp.evaluate(() => ({
    urteil: document.querySelector('.ergebnis-kopf .urteil')?.textContent.trim(),
    punkte: document.querySelector('.ergebnis-kopf .big-stat')?.textContent.trim(),
    kacheln: [...document.querySelectorAll('.ergebnis-kachel')].map((k) => k.textContent.replace(/\s+/g, ' ').trim()),
    falsch_liste: document.querySelectorAll('.ergebnis-falsch li').length,
    in_wiederholung: document.querySelectorAll('.ergebnis-falsch li .small').length,
    knoepfe: [...document.querySelectorAll('.entscheidung .btn')].map((b) => b.textContent.trim()),
    toasts: document.querySelectorAll('.toast, .toast-stapel > *').length,
    leiste_im_daumenbereich: (() => {
      const r = document.querySelector('.entscheidung').getBoundingClientRect();
      return r.top + r.height / 2 >= window.innerHeight / 2;
    })(),
  }));

  /* Ein sauberer Stand: Frühere Schritte haben im selben Browser Fragen aus
     derselben Lektion falsch beantwortet. Lägen sie schon im Wiederholungsstapel,
     käme eine zweite falsche Antwort auf dieselbe Frage nicht hinzu — und die
     Zahl „im Stapel" wäre je nach Würfelglück um eins zu klein. */
  await lp.evaluate(() => {
    const idx = JSON.parse(localStorage.getItem('pokermentor-profiles-v1'));
    const key = `pokermentor-data-${idx.activeId}`;
    const d = JSON.parse(localStorage.getItem(key));
    d.completedLessons = {}; d.lessonAttempts = {}; d.reviews = []; d.xp = 0; d.badges = {};
    localStorage.setItem(key, JSON.stringify(d));
  });
  await lp.reload({ waitUntil: 'domcontentloaded' });
  const vor = await lernstand();
  await neueLektion();
  /* Ein Durchgang, in dem immer die erste Option gewählt wird, besteht mit
     etwa 1,6 % Wahrscheinlichkeit durch Zufall. Dann noch einmal. */
  let erster = await durchgang();
  let e1 = await ergebnis();
  for (let n = 0; n < 4 && e1.urteil === 'Bestanden'; n += 1) {
    await lp.evaluate(() => {
      const idx = JSON.parse(localStorage.getItem('pokermentor-profiles-v1'));
      const key = `pokermentor-data-${idx.activeId}`;
      const d = JSON.parse(localStorage.getItem(key));
      d.completedLessons = {}; d.xp = 0; d.badges = {}; d.reviews = [];
      localStorage.setItem(key, JSON.stringify(d));
    });
    await lp.reload({ waitUntil: 'domcontentloaded' });
    await neueLektion();
    erster = await durchgang();
    e1 = await ergebnis();
  }
  const nachFehlschlag = await lernstand();
  const reihenfolge1 = erster.reihenfolgen;

  // Die Modulübersicht sagt „versucht", nicht „abgeschlossen".
  await lp.goto(`${GRUND}/#/lernen/m1`, { waitUntil: 'domcontentloaded' });
  await lp.waitForSelector('.lektionen');
  const modulZeile = await lp.evaluate(() => {
    const z = document.querySelector('.lektionen .lektion');
    return {
      klassen: [...z.classList],
      meta: z.querySelector('.meta')?.textContent.trim(),
      hinweis: z.querySelector('.hinweis')?.textContent.trim(),
    };
  });

  // Fehler nochmal üben: nur die falschen Fragen, ohne Folgen.
  await lp.goto(`${GRUND}/#/lernen/m1/m1-l1/quiz`, { waitUntil: 'domcontentloaded' });
  await lp.waitForSelector('.quiz-fokus');
  const richtigeErste = erster.gemerkt;
  // Neuer Durchgang mit den richtigen Antworten, aber zuerst: den Fehlschlag noch einmal herstellen und üben.
  await lp.evaluate(() => sessionStorage.clear());
  await lp.reload({ waitUntil: 'domcontentloaded' });
  await lp.waitForSelector('.quiz-fokus');
  const zweiter = await durchgang();
  const e2 = await ergebnis();
  await lp.getByRole('button', { name: 'Fehler nochmal üben' }).click();
  await lp.waitForSelector('.quiz-fokus');
  const uebungsFragen = await lp.evaluate(() => document.querySelector('.quiz-zaehler')?.textContent.trim());
  const nochmal = Number(uebungsFragen?.split('/')[1] ?? 0);
  for (let i = 0; i < nochmal; i += 1) {
    await lp.waitForSelector('.quiz-option');
    await lp.locator('.quiz-option').first().click();
    await lp.waitForSelector('.quiz-option.correct');
    await lp.locator('.quiz-weiter').click();
    await lp.waitForTimeout(150);
  }
  await lp.waitForSelector('.quiz-ergebnis');
  const uebung = await lp.evaluate(() => ({
    titel: document.querySelector('.ergebnis-kopf h2')?.textContent.trim(),
    hinweis: document.querySelector('.ergebnis-kopf p')?.textContent.trim(),
  }));
  const nachUebung = await lernstand();

  // Und jetzt bestehen: mit den richtigen Antworten (gemerkt aus den Durchgängen).
  const richtige = { ...richtigeErste, ...zweiter.gemerkt };
  await lp.getByRole('button', { name: 'Quiz noch einmal von vorn' }).click();
  await lp.waitForSelector('.quiz-fokus');
  await lp.waitForTimeout(300);
  const dritter = await durchgang(richtige);
  const e3 = await ergebnis();
  const nachBestehen = await lernstand();
  const reihenfolge3 = dritter.reihenfolgen;
  const andereReihenfolge = Object.keys(reihenfolge1).filter(
    (f) => reihenfolge3[f] && JSON.stringify(reihenfolge1[f]) !== JSON.stringify(reihenfolge3[f]),
  ).length;

  return {
    fehlschlag: e1,
    xp_nach_fehlschlag: nachFehlschlag.xp - vor.xp,
    lektion_fertig_nach_fehlschlag: nachFehlschlag.fertig.includes('m1-l1'),
    versucht_gemerkt: nachFehlschlag.versucht['m1-l1'] ?? null,
    abzeichen_nach_fehlschlag: nachFehlschlag.abzeichen,
    wiederholung_nach_fehlschlag: nachFehlschlag.wiederholung,
    modul_zeile: modulZeile,
    uebung,
    lektion_fertig_nach_uebung: nachUebung.fertig.includes('m1-l1'),
    bestanden: e3,
    xp_durch_bestehen: nachBestehen.xp - nachUebung.xp,
    lektion_fertig_nach_bestehen: nachBestehen.fertig.includes('m1-l1'),
    versucht_danach: nachBestehen.versucht['m1-l1'] ?? null,
    abzeichen_nach_bestehen: nachBestehen.abzeichen,
    optionen_gemischt: andereReihenfolge,
  };
});

await lektionsKontext.close();

await schritt('Jeder Bildschirm hat einen sichtbaren Weg zur Startseite', async () => {
  /* Ohne untere Leiste trägt die Marke oben diesen Weg. Geprüft wird an
     einem tief liegenden Bildschirm, nicht an der Startseite selbst. */
  await seite.goto(`${GRUND}/#/nachschlagen/glossar`, { waitUntil: 'domcontentloaded' });
  await seite.waitForTimeout(400);
  const marke = seite.locator('.mobile-top-marke');
  const kasten = await marke.boundingBox();
  await marke.click();
  await seite.waitForTimeout(400);
  return {
    sichtbar: await marke.count() > 0,
    hoehe_px: Math.round(kasten?.height ?? 0),
    breite_px: Math.round(kasten?.width ?? 0),
    fuehrt_nach: new URL(seite.url()).hash || '#/',
  };
});

/* ── Der Lernpfad zeigt, wo man steht ─────────────────────────────────────
   Seit E-037 ist der Lernpfad ein Pfad und kein Kachelraster. Was das
   leisten muss, lässt sich nur am gerenderten Ergebnis prüfen: **genau ein**
   Wegweiser („Hier weiter"), erledigte Stufen als solche erkennbar, und der
   Weg selbst über den Trainern statt unter ihnen. */

await schritt('Der Lernpfad zeigt genau eine Stelle zum Weitermachen', async () => {
  /* Ein Zustand mit Fortschritt: Ohne ihn wäre jede Stufe offen und die
     Regel „genau einer" nicht geprüft, sondern nur nicht verletzt. */
  await seite.goto(`${GRUND}/#/lernen`, { waitUntil: 'domcontentloaded' });
  await seite.waitForSelector('.lernpfad');
  await seite.evaluate(() => {
    const idx = JSON.parse(localStorage.getItem('pokermentor-profiles-v1'));
    const schluessel = `pokermentor-data-${idx.activeId}`;
    const d = JSON.parse(localStorage.getItem(schluessel));
    d.xp = 640;
    for (const id of ['m1-l1', 'm1-l2', 'm1-l3', 'm1-l4', 'm1-l5', 'm2-l1', 'm2-l2']) {
      d.completedLessons[id] = { completedAt: new Date().toISOString(), quizScore: 5, quizTotal: 5 };
    }
    localStorage.setItem(schluessel, JSON.stringify(d));
  });
  await seite.reload({ waitUntil: 'domcontentloaded' });
  await seite.waitForSelector('.lernpfad');
  await seite.waitForTimeout(400);
  return seite.evaluate(() => {
    const stufen = [...document.querySelectorAll('.lernpfad .stufe')];
    const pfad = document.querySelector('.lernpfad');
    const rang = document.querySelector('.rangstand');
    /* Der erste Trainer auf der Seite. Der Pfad muss davor kommen — vor
       E-037 stand er 3707 Pixel weiter unten. */
    const ersterTrainer = document.querySelector('.card.clickable');
    return {
      stufen: stufen.length,
      offen: stufen.filter((x) => x.classList.contains('offen')).length,
      fertig: stufen.filter((x) => x.classList.contains('fertig')).length,
      spaeter: stufen.filter((x) => x.classList.contains('spaeter')).length,
      /* Die Reihenfolge im Baum: erledigt, dann die offene, dann der Rest.
         Eine offene Stufe hinter einer späteren wäre ein Wegweiser ins
         Nichts. */
      reihenfolge: stufen.map((x) => [...x.classList].find((c) => c !== 'stufe')),
      hinweise: [...document.querySelectorAll('.lernpfad .stufe-hinweis')]
        .map((x) => x.textContent.trim()),
      rang_steht_oben: rang && pfad
        ? rang.getBoundingClientRect().top < pfad.getBoundingClientRect().top : false,
      rang_text: rang?.innerText.replace(/\n/g, ' · ') ?? null,
      pfad_vor_den_trainern: pfad && ersterTrainer
        ? pfad.getBoundingClientRect().top < ersterTrainer.getBoundingClientRect().top : null,
      /* Wie weit man scrollen müsste, um den Pfad zu sehen. */
      pfad_oben_px: pfad ? Math.round(pfad.getBoundingClientRect().top + window.scrollY) : null,
    };
  });
});

await schritt('Das Modul zeigt Fortschritt und die nächste Lektion', async () => {
  await seite.goto(`${GRUND}/#/lernen/m2`, { waitUntil: 'domcontentloaded' });
  await seite.waitForSelector('.lektionen');
  await seite.waitForTimeout(400);
  return seite.evaluate(() => {
    const lektionen = [...document.querySelectorAll('.lektionen .lektion')];
    return {
      lektionen: lektionen.length,
      fertig: lektionen.filter((x) => x.classList.contains('fertig')).length,
      dran: lektionen.filter((x) => x.classList.contains('dran')).length,
      zustaende: lektionen.map((x) => [...x.classList].find((c) => c !== 'lektion')),
      stand_text: document.querySelector('.modulstand')?.innerText.replace(/\n/g, ' · ') ?? null,
      /* Der Ring ist ein Bild — für einen Screenreader muss er sprechen. */
      ring_beschriftung: document.querySelector('.modulstand .levelring')
        ?.getAttribute('aria-label') ?? null,
      xp_hinweise: [...document.querySelectorAll('.lektionen .hinweis.xp')]
        .map((x) => x.textContent.trim()),
    };
  });
});

/* ── Der Übungstisch: nichts überdeckt das Board ───────────────────────────
   Der Auftraggeber hat es gemeldet und der Rundgang hat es bestätigt: Bei
   fünf Gegnern legte sich der obere Sitz über Flop und River. Ursache war
   die Anordnung — Sitze an Prozentkoordinaten, die nach unten aus sich
   herauswachsen. Seit E-040 sind es Bänder, die sich nicht überlappen
   können.

   Geprüft wird nicht die Anordnung, sondern die Folge: Kein Sitz schneidet
   das Board, keiner den eigenen Platz. Eine neue Anordnung, die denselben
   Fehler macht, fällt hier auf. */

await schritt('Am Übungstisch überdeckt kein Sitz das Board', async () => {
  await seite.goto(`${GRUND}/#/lernen/uebungstisch`, { waitUntil: 'domcontentloaded' });
  await seite.waitForTimeout(500);
  /* Sechs Plätze — der Fall, in dem der Fehler auftrat. */
  await seite.getByRole('radio', { name: /6-max/ }).click();
  await seite.getByRole('button', { name: /Hand austeilen/ }).click();
  await seite.waitForSelector('.filz');
  /* Warten, bis der Held am Zug ist: Dann steht der Tisch vollständig. */
  for (let i = 0; i < 40; i += 1) {
    if (await seite.locator('.aktions-zeile button:not(:disabled)').count() > 0) break;
    await seite.waitForTimeout(400);
  }
  await seite.waitForTimeout(300);
  return seite.evaluate(() => {
    const kasten = (el) => el.getBoundingClientRect();
    const schneidet = (a, b) => a && b && b.bottom > a.top && b.top < a.bottom
      && b.right > a.left && b.left < a.right;
    const sitze = [...document.querySelectorAll('.sitz')].map(kasten);
    const board = document.querySelector('.board');
    const du = document.querySelector('.filz-du');
    const bk = board ? kasten(board) : null;
    const dk = du ? kasten(du) : null;
    return {
      sitze: sitze.length,
      /* Der gemeldete Fehler. */
      sitz_ueber_board: sitze.filter((z) => schneidet(bk, z)).length,
      sitz_ueber_du: sitze.filter((z) => schneidet(dk, z)).length,
      /* Und das, was man ohne Scrollen sehen muss: die Gemeinschaftskarten
         und die eigene Hand. */
      board_ohne_scrollen: bk ? bk.bottom <= window.innerHeight : null,
      du_ohne_scrollen: dk ? dk.bottom <= window.innerHeight : null,
      /* Fünf Plätze, auch wenn erst drei liegen — an einem echten Tisch
         sieht man, wie viele Karten noch kommen. */
      board_plaetze: document.querySelectorAll('.board .pcard, .board .board-platz').length,
      /* Die eigene Hand ist die größte Darstellung auf dem Tisch. */
      eigene_kartenbreite: Math.round(
        document.querySelector('.du-karten .pcard')?.getBoundingClientRect().width ?? 0,
      ),
      groesste_gegnerkarte: Math.round(Math.max(0, ...[...document.querySelectorAll('.sitz .pcard')]
        .map((k) => k.getBoundingClientRect().width))),
      /* Die Entscheidung liegt unten und ist ohne Scrollen erreichbar. */
      leiste_unten_px: Math.round(
        document.querySelector('.entscheidung')?.getBoundingClientRect().bottom ?? 0,
      ),
      leiste_im_daumenbereich: (() => {
        const e = document.querySelector('.entscheidung');
        if (!e) return false;
        const r = kasten(e);
        return r.top + r.height / 2 >= window.innerHeight / 2;
      })(),
      knoepfe: [...document.querySelectorAll('.entscheidung button')].map((b) => b.textContent.trim()),
    };
  });
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

await schritt('Die Serie im Drill überlebt das Schließen', async () => {
  /* Der Drill war der einzige Trainer, dessen Ergebnis mit dem Bildschirm
     verschwand (E-038). Eine Serie, die man nicht behalten kann, ist keine —
     geprüft wird deshalb nicht, dass die Zahl erscheint, sondern dass sie
     nach dem Neuladen noch da ist. */
  await seite.goto(`${GRUND}/#/lernen/drill`, { waitUntil: 'domcontentloaded' });
  await seite.waitForSelector('.drill-knopf.ja');
  await seite.waitForTimeout(400);
  const vorher = await seite.evaluate(
    () => document.querySelector('.uebungsstand')?.innerText.replace(/\n/g, ' | ') ?? null,
  );
  /* Beide Knöpfe einmal: Einer davon ist richtig, egal welche Aufgabe
     gezogen wurde — die Versuchszahl steigt in jedem Fall um zwei. */
  await seite.locator('.drill-knopf.ja').click();
  await seite.waitForSelector('.drill-knopf.weiter');
  await seite.locator('.drill-knopf.weiter').click();
  await seite.waitForSelector('.drill-knopf.nein');
  await seite.locator('.drill-knopf.nein').click();
  await seite.waitForTimeout(400);
  const nachZwei = await seite.evaluate(() => ({
    text: document.querySelector('.uebungsstand')?.innerText.replace(/\n/g, ' | ') ?? null,
    werte: [...document.querySelectorAll('.uebungsstand .zahl')].map((x) => x.textContent.trim()),
  }));
  await seite.reload({ waitUntil: 'domcontentloaded' });
  await seite.waitForSelector('.uebungsstand');
  await seite.waitForTimeout(400);
  const nachNeuladen = await seite.evaluate(() => ({
    text: document.querySelector('.uebungsstand')?.innerText.replace(/\n/g, ' | ') ?? null,
    werte: [...document.querySelectorAll('.uebungsstand .zahl')].map((x) => x.textContent.trim()),
  }));
  return {
    vorher,
    nach_zwei: nachZwei.text,
    nach_neuladen: nachNeuladen.text,
    /* Die Trefferquote ist die Zahl, die beide Antworten mitzählt. */
    quote_bleibt: nachZwei.werte[1] === nachNeuladen.werte[1],
    quote_nach_zwei: nachZwei.werte[1],
    /* Vorher stand dort ein Strich, weil es noch keine Versuche gab. */
    ohne_versuche_kein_prozent: /–|-/.test(String(vorher)),
    felder: nachNeuladen.werte.length,
  };
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

/* ── Die mittleren Ebenen (E-042) ─────────────────────────────────────────
   Nachschlagen und Live-Session bestanden aus Karten mit einem Namen und
   einem Satz, der den Namen erklärte. Geprüft wird nicht das Aussehen,
   sondern die Folge: Passt der Bereich auf einen Bildschirm, und steht auf
   den Kacheln etwas, das man sonst erst durch Antippen erführe? */

await schritt('Der Nachschlagen-Bereich ist eine Übersicht, keine Strecke', async () => {
  await seite.goto(`${GRUND}/#/nachschlagen`, { waitUntil: 'domcontentloaded' });
  await seite.waitForSelector('.bereich');
  await seite.waitForTimeout(300);
  return seite.evaluate(() => {
    const kacheln = [...document.querySelectorAll('.bereich')];
    const letzte = kacheln[kacheln.length - 1];
    return {
      kacheln: kacheln.length,
      /* „Zwei Schritte bis zur Antwort" setzt voraus, dass man die Auswahl
         als Auswahl sieht. Auf dem Bezugsgerät (390 × 844) passt sie
         vollständig; auf dem kleinsten (375 × 667) bleibt eine kurze
         Wischbewegung — bei sieben Einträgen ist das nicht zu vermeiden,
         und die Seite ist nicht länger als anderthalb Bildschirme. */
      unterkante_px: Math.round(letzte.getBoundingClientRect().bottom),
      fenster: window.innerHeight,
      seitenhoehe: document.documentElement.scrollHeight,
      sichtbar_ohne_scrollen: kacheln.filter(
        (k) => k.getBoundingClientRect().bottom <= window.innerHeight,
      ).length,
      /* Jede Kachel trägt eine Inhaltszeile, keine Beschreibung. */
      mit_inhalt: kacheln.filter((k) => (k.querySelector('.bereich-inhalt')?.textContent ?? '').trim()).length,
      /* Und mindestens eine zeigt den Gegenstand selbst. */
      mit_vorschau: kacheln.filter((k) => k.querySelector('.bereich-vorschau')).length,
      /* Zahlen aus den Daten, nicht aus dem Text. */
      inhalte: kacheln.map((k) => k.querySelector('.bereich-inhalt')?.textContent.trim() ?? ''),
      /* Eine Bereichsfarbe für alle, nicht sieben (Regel 10.9). */
      symbolfarben: [...new Set(kacheln.map(
        (k) => getComputedStyle(k.querySelector('.bereich-symbol')).color,
      ))].length,
    };
  });
});

await schritt('Das Glossar ist ein Wörterbuch, keine Wand', async () => {
  await seite.goto(`${GRUND}/#/nachschlagen/glossar`, { waitUntil: 'domcontentloaded' });
  await seite.waitForSelector('.glossar-eintrag');
  await seite.waitForTimeout(300);
  const vorher = await seite.evaluate(() => {
    const erster = document.querySelector('.glossar-eintrag');
    return {
      seitenhoehe: document.documentElement.scrollHeight,
      eintraege: document.querySelectorAll('.glossar-eintrag').length,
      /* Zugeklappt eine Zeile Erklärung — meistens steht die Antwort damit
         schon da, ohne dass man tippen muss. */
      erste_hoehe: Math.round(erster.getBoundingClientRect().height),
      /* Nach Anfangsbuchstaben gruppiert: Das unterscheidet ein Wörterbuch
         von einer Liste. */
      buchstaben: document.querySelectorAll('.glossar-buchstabe').length,
      aufgeklappt: document.querySelectorAll('.glossar-eintrag.auf').length,
    };
  });
  /* Ein Tipp klappt auf. */
  await seite.locator('.glossar-eintrag').first().click();
  await seite.waitForTimeout(200);
  const nachher = await seite.evaluate(() => {
    const erster = document.querySelector('.glossar-eintrag');
    return {
      erste_hoehe: Math.round(erster.getBoundingClientRect().height),
      aufgeklappt: document.querySelectorAll('.glossar-eintrag.auf').length,
      angesagt: erster.getAttribute('aria-expanded'),
    };
  });
  return { ...vorher, nach_tipp: nachher };
});

await schritt('Kein Rückweg nennt einen Bereich, den es nicht gibt', async () => {
  /* Fünf Werkzeugseiten schickten mit „← Tools" zurück — einen Bereich, den
     die App seit dem Umbau auf Lernen / Nachschlagen / Live-Session (E-030)
     nicht mehr hat. Der Wegelauf sah nur, dass der Link ankommt. */
  const seitenMitRueckweg = [
    '#/nachschlagen/glossar', '#/nachschlagen/haende', '#/nachschlagen/odds',
    '#/nachschlagen/ranges', '#/nachschlagen/tells', '#/nachschlagen/equity',
    '#/session/bankroll', '#/session/chips', '#/session/auszahlung',
  ];
  const bereiche = ['Start', 'Lernen', 'Nachschlagen', 'Live-Session'];
  const gefunden = [];
  for (const hash of seitenMitRueckweg) {
    await seite.goto(`${GRUND}/${hash}`, { waitUntil: 'domcontentloaded' });
    await seite.waitForTimeout(240);
    const beschriftung = await seite.evaluate(() => {
      const el = [...document.querySelectorAll('a')]
        .find((a) => a.textContent.trim().startsWith('←'));
      return el ? el.textContent.replace('←', '').trim() : null;
    });
    gefunden.push({ hash, beschriftung });
  }
  return {
    rueckwege: gefunden,
    unbekannte_bereiche: gefunden
      .filter((g) => g.beschriftung && !bereiche.includes(g.beschriftung))
      .map((g) => `${g.hash}: ${g.beschriftung}`),
    ohne_rueckweg: gefunden.filter((g) => !g.beschriftung).map((g) => g.hash),
  };
});

/* ── Was der erste Start kostet (E-043) ───────────────────────────────────
   Firebase wiegt gebaut 706 kB. Bis E-043 wurde es bei jedem Start geholt,
   weil der CloudProvider beim Einhängen bedingungslos `getCloud()` rief —
   auch bei jemandem, der sich nie anmeldet.

   Geprüft wird die Folge, nicht die Umsetzung: Die Startseite holt genau
   eine Datei, und das Konto kommt trotzdem an, wenn man es aufruft. */

await schritt('Die Startseite lädt nichts, was sie nicht braucht', async () => {
  const geholt = [];
  const horcher = (r) => { if (r.url().endsWith('.js')) geholt.push(r.url().split('/').pop()); };
  seite.on('request', horcher);
  try {
    await seite.goto(`${GRUND}/`, { waitUntil: 'networkidle' });
    await seite.waitForTimeout(1200);
    const nachStart = [...geholt];

    await seite.goto(`${GRUND}/#/profil/einstellungen`, { waitUntil: 'domcontentloaded' });
    await seite.waitForTimeout(2800);
    const nachProfil = geholt.filter((n) => !nachStart.includes(n));

    return {
      dateien_startseite: nachStart.length,
      dateien_nach_profil: nachProfil.length,
      /* Die Kontokarte ist da und sagt nicht „wird geprüft". */
      kontokarte_da: await seite.locator('.cloud-card, [data-konto]').count() > 0
        || (await seite.evaluate(() => /Konto|Anmelden|Account|Sign in/i.test(document.body.innerText))),
    };
  } finally {
    seite.off('request', horcher);
  }
});

/* ── Quer gehalten (E-044) ────────────────────────────────────────────────
   Ein Gerät, auf dem ein Pokertisch liegt, hält man quer. Gemessen bei
   844 × 390 lag der Tisch 564 Pixel hoch im Bild: Die Gegner waren
   vollständig über dem Bildrand, das Board zur Hälfte. Man entschied, ohne
   zu sehen, gegen wen und worauf.

   Geprüft wird die Folge: Alle Sitze, das Board und die eigenen Karten
   liegen über der Entscheidungsleiste. */

await schritt('Quer gehalten sieht man den ganzen Tisch', async () => {
  const quer = await browser.newContext({
    viewport: { width: 844, height: 390 }, locale: 'de-DE',
  });
  await quer.addInitScript(() => {
    localStorage.setItem('pokermentor-lang-v1', 'de');
    localStorage.setItem('pokermentor-farbmodus-v1', 'dunkel');
  });
  const q = await quer.newPage();
  try {
    await q.goto(`${GRUND}/#/lernen/uebungstisch`, { waitUntil: 'domcontentloaded' });
    await q.waitForTimeout(400);
    await q.getByRole('radio', { name: /6-max/ }).click();
    await q.getByRole('button', { name: /Hand austeilen/ }).click();
    await q.waitForSelector('.filz');
    for (let i = 0; i < 40; i += 1) {
      if (await q.locator('.aktions-zeile button:not(:disabled)').count() > 0) break;
      await q.waitForTimeout(300);
    }
    await q.waitForTimeout(300);
    await q.evaluate(() => window.scrollTo(0, 0));
    await q.waitForTimeout(200);
    return await q.evaluate(() => {
      const oben = (el) => Math.round(el.getBoundingClientRect().top);
      const unten = (el) => Math.round(el.getBoundingClientRect().bottom);
      /* Quer steht die Leiste als Spalte neben dem Tisch (E-093), nicht
         darunter: Dann ist die Grenze ihre linke Kante, nicht ihre obere. */
      const leiste = document.querySelector('.entscheidung');
      const lr = leiste ? leiste.getBoundingClientRect() : null;
      const seitlich = !!lr && lr.width < window.innerWidth * 0.6;
      const grenze = leiste && !seitlich ? oben(leiste) : window.innerHeight;
      const rechts = (el) => Math.round(el.getBoundingClientRect().right);
      const sitze = [...document.querySelectorAll('.sitz')];
      const board = document.querySelector('.board');
      const eigene = document.querySelector('.du-karten');
      const sichtbar = (el) => el && oben(el) >= 0 && unten(el) <= grenze
        && (!seitlich || rechts(el) <= Math.round(lr.left));
      return {
        fenster: `${window.innerWidth}x${window.innerHeight}`,
        filz_hoehe: Math.round(document.querySelector('.filz').getBoundingClientRect().height),
        sitze: sitze.length,
        sitze_ueber_der_leiste: sitze.filter(sichtbar).length,
        board_ueber_der_leiste: sichtbar(board),
        eigene_karten_ueber_der_leiste: sichtbar(eigene),
        /* Die eigene Hand bleibt die größte Darstellung (Regel 10.8). */
        eigene_kartenbreite: Math.round(
          document.querySelector('.du-karten .pcard')?.getBoundingClientRect().width ?? 0,
        ),
        boardkartenbreite: Math.round(
          document.querySelector('.board .pcard, .board .board-platz')?.getBoundingClientRect().width ?? 0,
        ),
        seitlicher_ueberlauf: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
      };
    });
  } finally {
    await quer.close();
  }
});

/* ── Der Übungstisch: alles im Bild ─────────────────────────────────────────
   Gemessen vor E-093: Bei 375 × 667 lag die Leiste über der halben Hand und
   über dem eigenen Namensschild, bei 390 × 844 der Coach-Kasten unter ihr, und
   die Einsatzwahl öffnete sich hinter der Leiste. Geprüft wird die Folge, auf
   drei Geräten: Nichts Nötiges liegt unter der Leiste, die Einsatzgrößen
   stehen im Bild und tragen ihren Betrag, und nach dem Zug bleibt die Leiste
   stehen — mit gesperrten Knöpfen und dem Namen dessen, der überlegt. */

await schritt('Am Übungstisch liegt alles im Bild: Hand, Einsatzwahl, Urteil', async () => {
  const geraete = [
    { name: 'klein', breite: 375, hoehe: 667 },
    { name: 'mittel', breite: 390, hoehe: 844 },
    { name: 'breit', breite: 1366, hoehe: 860 },
  ];
  const aus = {};
  for (const g of geraete) {
    const ctx = await browser.newContext({ viewport: { width: g.breite, height: g.hoehe }, locale: 'de-DE' });
    await ctx.addInitScript(() => {
      localStorage.setItem('pokermentor-lang-v1', 'de');
      localStorage.setItem('pokermentor-farbmodus-v1', 'dunkel');
    });
    const q = await ctx.newPage();
    try {
      await q.goto(`${GRUND}/#/lernen/uebungstisch`, { waitUntil: 'domcontentloaded' });
      await q.waitForTimeout(400);
      await q.getByRole('radio', { name: /6-max/ }).click();
      await q.getByRole('button', { name: /Hand austeilen/ }).click();
      await q.waitForSelector('.filz');
      const warteAufMich = async () => {
        for (let i = 0; i < 60; i += 1) {
          if (await q.locator('.aktions-zeile button:not(:disabled)').count() > 0) return true;
          await q.waitForTimeout(300);
        }
        return false;
      };
      const dran = await warteAufMich();
      await q.waitForTimeout(300);
      await q.evaluate(() => window.scrollTo(0, 0));
      const bild = await q.evaluate(() => {
        const r = (sel) => { const e = document.querySelector(sel); if (!e) return null; const x = e.getBoundingClientRect(); return { oben: Math.round(x.top), unten: Math.round(x.bottom) }; };
        const leiste = r('.tisch-leiste');
        return {
          fenster: window.innerHeight,
          leiste,
          schild: r('.filz-du .sitz-schild'),
          karten: r('.du-karten'),
          board: r('.board'),
          leiste_am_rand: leiste ? Math.abs(leiste.unten - window.innerHeight) <= 1 : null,
        };
      });
      const tippKnopf = await q.getByRole('button', { name: 'Tipp', exact: true }).count();
      const statusVorher = (await q.locator('.tisch-status').innerText()).trim();

      // Einsatzwahl öffnen
      await q.getByRole('button', { name: /^(Raise|Bet) …/ }).click();
      await q.waitForTimeout(200);
      const wahl = await q.evaluate(() => {
        const fenster = window.innerHeight;
        const im = (e) => { const x = e.getBoundingClientRect(); return x.top >= 0 && x.bottom <= fenster + 1; };
        const knoepfe = [...document.querySelectorAll('.vorgabe')];
        const ok = document.querySelector('.betrag-bestaetigen');
        return {
          vorgaben: knoepfe.map((k) => k.textContent.replace(/\s+/g, ' ').trim()),
          alle_im_bild: knoepfe.every(im) && !!ok && im(ok),
          bestaetigen: ok?.textContent.trim(),
          leiste: (() => { const x = document.querySelector('.tisch-leiste').getBoundingClientRect(); return { oben: Math.round(x.top), unten: Math.round(x.bottom) }; })(),
          schild_unten: Math.round(document.querySelector('.filz-du .sitz-schild').getBoundingClientRect().bottom),
          karten_unten: Math.round(document.querySelector('.du-karten').getBoundingClientRect().bottom),
        };
      });
      await q.getByRole('button', { name: 'Mehr' }).click();
      const mehr = (await q.locator('.betrag-bestaetigen').innerText()).trim();
      await q.getByRole('button', { name: 'Weniger' }).click();
      const wiederWeniger = (await q.locator('.betrag-bestaetigen').innerText()).trim();
      // Ein Fehltipp führt nichts aus: Erst „Raise auf …" setzt.
      const nochDran = await q.locator('.aktions-zeile').count() === 0 && await q.locator('.betrag-bestaetigen').count() === 1;
      await q.locator('.betrag-bestaetigen').click();
      await q.waitForTimeout(300);
      const danach = {
        status: (await q.locator('.tisch-status').innerText()).trim(),
        gesperrte_knoepfe: await q.locator('.aktions-zeile button:disabled').count(),
        urteil: (await q.locator('.urteil:not(.tipp-knopf):visible').allInnerTexts()).map((t) => t.trim()),
      };
      aus[g.name] = { dran, bild, tipp_knopf: tippKnopf, status_vorher: statusVorher, wahl, mehr, wieder_weniger: wiederWeniger, noch_nicht_gesetzt: nochDran, danach };
    } finally {
      await ctx.close();
    }
  }

  // Nach dem eigenen Fold: „Hand zu Ende spielen", ohne Wartezeit.
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'de-DE' });
  await ctx.addInitScript(() => { localStorage.setItem('pokermentor-lang-v1', 'de'); });
  const f = await ctx.newPage();
  let fold = {};
  try {
    await f.goto(`${GRUND}/#/lernen/uebungstisch`, { waitUntil: 'domcontentloaded' });
    await f.waitForTimeout(400);
    await f.getByRole('radio', { name: /6-max/ }).click();
    await f.getByRole('button', { name: /Hand austeilen/ }).click();
    for (let i = 0; i < 60; i += 1) {
      if (await f.locator('.aktions-zeile button:not(:disabled)').count() > 0) break;
      await f.waitForTimeout(300);
    }
    await f.getByRole('button', { name: 'Fold', exact: true }).click();
    await f.getByRole('button', { name: /Hand zu Ende spielen/ }).waitFor({ timeout: 4000 });
    const statusNachFold = (await f.locator('.tisch-status').innerText()).trim();
    const t0 = Date.now();
    await f.getByRole('button', { name: /Hand zu Ende spielen/ }).click();
    await f.getByRole('button', { name: /Nächste Hand/ }).waitFor({ timeout: 4000 });
    fold = { status_nach_fold: statusNachFold, dauer_ms: Date.now() - t0 };
  } finally {
    await ctx.close();
  }
  return { geraete: aus, fold };
});

/* ── Profil, Einstellungen, Konto (E-095) ─────────────────────────────────
   Das Profil war 5280 Pixel lang, mit der Farbwahl bei 3552 und dem
   Zurücksetzen direkt darunter. Gemessen wird, was jetzt gelten soll:
   Das Profil zeigt Identität und Fortschritt, höchstens sechs Abzeichen und
   die nächsten drei; die Einstellungen sind eine gruppierte Liste, und die
   zerstörende Aktion steht ganz am Ende — mit der Frage „Vorher sichern?“. */

await schritt('Profil: Identität und Fortschritt, Einstellungen hinter dem Zahnrad', async () => {
  const k = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'de-DE' });
  await k.addInitScript(() => localStorage.setItem('pokermentor-lang-v1', 'de'));
  const p = await k.newPage();
  await p.goto(`${GRUND}/#/profil`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.profil-kopf');
  await p.waitForTimeout(300);
  const leer = await p.evaluate(() => ({
    hoehe: document.documentElement.scrollHeight,
    avatar: document.querySelector('.profil-avatar')?.textContent?.trim(),
    name: document.querySelector('.profil-name')?.textContent?.trim(),
    medaillen_verdient: document.querySelectorAll('.abzeichen-stueck.verdient').length,
    naechste: document.querySelectorAll('.naechste-liste li').length,
    offen_zeile: document.querySelector('.abzeichen-fuss .small')?.textContent?.trim(),
    emoji_in_abzeichen: /\p{Extended_Pictographic}/u.test(document.querySelector('.naechste-liste')?.textContent ?? ''),
    namensfeld: document.querySelectorAll('#profil-name').length,
    zuruecksetzen: [...document.querySelectorAll('button')].filter((b) => /zurücksetzen/i.test(b.textContent)).length,
    zahnrad: document.querySelector('main .einstellungen-knopf')?.getAttribute('aria-label'),
  }));
  /* Mit vielen verdienten Abzeichen: höchstens sechs, die übrigen als Zeile. */
  await p.evaluate(() => {
    const idx = JSON.parse(localStorage.getItem('pokermentor-profiles-v1'));
    const key = `pokermentor-data-${idx.activeId}`;
    const d = JSON.parse(localStorage.getItem(key));
    const ids = ['first-lesson', 'quiz-perfect', 'module-basics', 'module-math', 'five-lessons', 'twenty-lessons',
      'all-modules', 'trainer-first', 'trainer-100'];
    d.badges = Object.fromEntries(ids.map((id, i) => [id, `2026-03-0${i + 1}T10:00:00.000Z`]));
    localStorage.setItem(key, JSON.stringify(d));
  });
  await p.reload({ waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.profil-kopf');
  await p.waitForTimeout(300);
  const viele = await p.evaluate(() => ({
    verdient: document.querySelectorAll('.abzeichen-stueck.verdient').length,
    erstes: document.querySelector('.abzeichen-stueck.verdient .b-name')?.textContent?.trim(),
    weitere: document.querySelector('.abzeichen + p')?.textContent?.trim(),
  }));
  await p.getByRole('button', { name: 'Alle ansehen' }).click();
  await p.waitForTimeout(200);
  const alle = await p.evaluate(() => ({
    stuecke: document.querySelectorAll('.abzeichen-stueck').length,
    offene: document.querySelectorAll('.medaille.offen').length,
    ausgeklappt: document.querySelector('.abzeichen-fuss button')?.getAttribute('aria-expanded'),
  }));
  /* Zahnrad: ein Tipp führt zu den Einstellungen. */
  await p.goto(`${GRUND}/#/profil`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.profil-kopf');
  await p.locator('main .einstellungen-knopf').click();
  await p.waitForTimeout(400);
  const ziel = { adresse: new URL(p.url()).hash, ueberschrift: (await p.locator('h1').first().innerText()).trim() };
  await k.close();
  return { leer, viele, alle, ziel };
});

await schritt('Einstellungen: gruppiert, Zurücksetzen zuletzt und mit „Vorher sichern?“', async () => {
  const k = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'de-DE' });
  await k.addInitScript(() => localStorage.setItem('pokermentor-lang-v1', 'de'));
  const p = await k.newPage();
  await p.goto(`${GRUND}/#/profil/einstellungen`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('#profil-name');
  await p.waitForTimeout(500);
  const gruppen = (await p.locator('h2.section-title').allInnerTexts()).map((t) => t.trim());
  const lage = await p.evaluate(() => {
    const reset = [...document.querySelectorAll('button')].find((b) => /zurücksetzen/i.test(b.textContent));
    const alle = [...document.querySelectorAll('main button, main a, main input, main select')]
      .filter((e) => e.getBoundingClientRect().width > 0);
    const letztes = alle[alle.length - 1];
    return {
      hoehe: document.documentElement.scrollHeight,
      reset_ist_letztes_bedienelement: letztes === reset,
      email_feld: document.querySelectorAll('#profil-email, input[type="email"][placeholder*="beispiel"]').length,
    };
  });
  await p.getByRole('button', { name: /Fortschritt zurücksetzen/ }).click();
  await p.waitForTimeout(200);
  const frage = await p.evaluate(() => {
    const d = document.querySelector('[role="alertdialog"]');
    return {
      titel: d?.querySelector('div')?.textContent?.trim(),
      knoepfe: [...(d?.querySelectorAll('button') ?? [])].map((b) => b.textContent.trim()),
    };
  });
  await p.getByRole('button', { name: 'Abbrechen' }).last().click();
  await p.waitForTimeout(150);
  const danach = await p.getByRole('button', { name: /Fortschritt zurücksetzen/ }).count();
  await k.close();
  return { gruppen, ...lage, frage, abgebrochen_ok: danach === 1 };
});

await schritt('Kontokarte: kein Sprung, Google-Knopf nach Vorgabe, gleichwertige Wahl', async () => {
  const k = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'de-DE' });
  await k.addInitScript(() => localStorage.setItem('pokermentor-lang-v1', 'de'));
  await k.route('**/legal.json', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: ANBIETER }));
  const p = await k.newPage();
  await p.goto(`${GRUND}/#/profil/einstellungen`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.konto-platzhalter, .google-knopf');
  const platzhalter_hoehe = await p.locator('.konto-platzhalter').evaluate((e) => Math.round(e.getBoundingClientRect().height))
    .catch(() => null);
  await p.waitForSelector('.google-knopf');
  await p.waitForTimeout(300);
  const karte = await p.evaluate(() => {
    const kachel = document.getElementById('konto').nextElementSibling;
    const g = document.querySelector('.google-knopf');
    const gs = getComputedStyle(g);
    const tabs = [...document.querySelectorAll('.konto-umschalter button')];
    const senden = document.querySelector('.konto-senden');
    return {
      hoehe: Math.round(kachel.getBoundingClientRect().height),
      google_flaeche: gs.backgroundColor,
      google_ist_hauptknopf: g.classList.contains('primary'),
      google_hoehe: Math.round(g.getBoundingClientRect().height),
      google_g_farben: g.querySelectorAll('svg path').length,
      tabs: tabs.map((t) => ({ text: t.textContent.trim(), breite: Math.round(t.getBoundingClientRect().width) })),
      senden_text: senden?.textContent?.trim(),
    };
  });
  await p.getByRole('radio', { name: 'Neues Konto' }).click();
  await p.waitForTimeout(200);
  const neu = await p.evaluate(() => ({
    titel: document.getElementById('konto').nextElementSibling.querySelector('div')?.textContent?.trim(),
    name_feld: document.querySelectorAll('input[autocomplete="name"]').length,
    senden: document.querySelector('.konto-senden')?.textContent?.trim(),
  }));
  const feedback = await p.locator('a[href^="mailto:"]').count();
  await k.close();
  /* Ohne Anbieterangaben: kein „Neues Konto“, kein Google, kein Feedback-Link. */
  const k2 = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'de-DE' });
  await k2.addInitScript(() => localStorage.setItem('pokermentor-lang-v1', 'de'));
  const p2 = await k2.newPage();
  await p2.goto(`${GRUND}/#/profil/einstellungen`, { waitUntil: 'domcontentloaded' });
  await p2.waitForSelector('.konto-senden');
  const ohne = {
    google: await p2.locator('.google-knopf').count(),
    umschalter: await p2.locator('.konto-umschalter').count(),
    feedback: await p2.locator('a[href^="mailto:"]').count(),
  };
  await k2.close();
  return { platzhalter_hoehe, karte, neu, feedback_mit_adresse: feedback, ohne_anbieter: ohne };
});

/* ── Nachschlagen, Desktop und Feinschliff (E-096) ────────────────────────
   Gemessen wird, was früher fehlte: eine Suche für alles, eine Range-Matrix, die
   am Handy ganz im Bild liegt, ein Equity-Rechner mit Kartenwahl, Tasten am
   Schreibtisch, ein Drill ohne Loch über den Knöpfen, ein Tages-Quiz zum
   Teilen. */

async function neuerKontext(breite, hoehe, sprache = 'de', extra = {}) {
  const k = await browser.newContext({ viewport: { width: breite, height: hoehe }, locale: sprache === 'de' ? 'de-DE' : 'en-GB', ...extra });
  await k.addInitScript(([sp]) => {
    localStorage.setItem('pokermentor-lang-v1', sp);
    localStorage.setItem('pokermentor-farbmodus-v1', 'dunkel');
  }, [sprache]);
  return k;
}

await schritt('Suche: eine für Werkzeuge, Lektionen und Begriffe', async () => {
  const k = await neuerKontext(390, 844);
  const p = await k.newPage();
  await p.goto(`${GRUND}/#/`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.mobile-top-suche');
  await p.locator('.mobile-top-suche').click();
  await p.waitForSelector('#suche-dialog');
  const fokus_im_feld = await p.evaluate(() => document.activeElement?.id === 'suche-dialog');
  await p.locator('#suche-dialog').fill('Bankroll');
  await p.waitForTimeout(200);
  const gruppen = await p.locator('[role="dialog"] section').evaluateAll((els) => els.map((e) => ({
    name: e.getAttribute('aria-label'),
    treffer: e.querySelectorAll('a').length,
  })));
  await p.locator('#suche-dialog').press('Enter');
  await p.waitForTimeout(400);
  const nach_enter = { adresse: new URL(p.url()).hash, dialog_zu: await p.locator('[role="dialog"]').count() === 0 };
  /* Auf „Nachschlagen“ und „Lernen“ dieselben Gruppen. */
  await p.goto(`${GRUND}/#/nachschlagen`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('#nachschlagen-suche');
  await p.locator('#nachschlagen-suche').fill('Bankroll');
  await p.waitForTimeout(200);
  const nachschlagen = await p.locator('main section[aria-label]').evaluateAll((els) => els.map((e) => e.getAttribute('aria-label')));
  await p.goto(`${GRUND}/#/lernen`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('#lernen-suche');
  await p.locator('#lernen-suche').fill('Bankroll');
  await p.waitForTimeout(200);
  const lernen = await p.locator('main section[aria-label]').evaluateAll((els) => els.map((e) => e.getAttribute('aria-label')));
  await p.locator('#lernen-suche').fill('qqqxyz');
  await p.waitForTimeout(200);
  const leer = (await p.locator('.such-leer').innerText()).trim();
  await k.close();
  return { fokus_im_feld, gruppen, nach_enter, nachschlagen, lernen, leer };
});

await schritt('Suche: Tasten „/“ und Strg + K am Schreibtisch', async () => {
  const k = await neuerKontext(1280, 800);
  const p = await k.newPage();
  await p.goto(`${GRUND}/#/lernen`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.sidebar-suche');
  await p.keyboard.press('/');
  const mit_slash = await p.locator('#suche-dialog').count();
  await p.keyboard.press('Escape');
  await p.waitForTimeout(200);
  await p.keyboard.press('Control+k');
  const mit_strg_k = await p.locator('#suche-dialog').count();
  await p.keyboard.press('Escape');
  await p.waitForTimeout(200);
  /* In einem Eingabefeld schweigt „/“. */
  await p.locator('#lernen-suche').click();
  await p.keyboard.type('a/b');
  const wert = await p.locator('#lernen-suche').inputValue();
  const dialog_im_feld = await p.locator('#suche-dialog').count();
  /* Der Eintrag in der Seitenleiste öffnet sie auch. */
  await p.locator('.sidebar-suche').click();
  const mit_klick = await p.locator('#suche-dialog').count();
  await k.close();
  return { mit_slash, mit_strg_k, wert_im_feld: wert, dialog_im_feld, mit_klick };
});

await schritt('Range-Matrix: am Handy ganz im Bild, ein Tipp nennt die Hand', async () => {
  const k = await neuerKontext(390, 844);
  const p = await k.newPage();
  await p.goto(`${GRUND}/#/nachschlagen/ranges`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.matrix .cell');
  await p.waitForTimeout(300);
  const mass = await p.evaluate(() => {
    const m = document.querySelector('.matrix');
    const scroll = document.querySelector('.matrix-scroll');
    const zellen = [...m.querySelectorAll('.cell')];
    const letzte = zellen[12].getBoundingClientRect();
    const r = m.getBoundingClientRect();
    return {
      matrix_breite: Math.round(r.width),
      rechts_im_bild: Math.round(letzte.right) <= window.innerWidth,
      scrollt_seitlich: scroll.scrollWidth > scroll.clientWidth + 1,
      zelle_px: Math.round(zellen[0].getBoundingClientRect().width),
      zellen: zellen.length,
      erste_zelle_text: zellen[0].textContent.trim(),
      suited_zelle_text: zellen[1].textContent.trim(),
      zusatz_sichtbar: getComputedStyle(zellen[1].querySelector('.art')).display !== 'none',
    };
  });
  await p.locator('.matrix .cell').nth(1).click();
  await p.waitForTimeout(150);
  const auskunft = (await p.locator('.auskunft-zeile').innerText()).trim();
  const druckzustand = await p.locator('.matrix .cell').nth(1).getAttribute('aria-pressed');
  await k.close();
  return { ...mass, auskunft, aria_pressed: druckzustand };
});

await schritt('Live-Coach: Spielerzahl als gleiche Spalten', async () => {
  const k = await neuerKontext(390, 844);
  const p = await k.newPage();
  await p.goto(`${GRUND}/#/nachschlagen/coach`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.segmented.raster');
  const raster = await p.evaluate(() => {
    const knoepfe = [...document.querySelector('.segmented.raster').querySelectorAll('button')];
    const b = knoepfe.map((e) => Math.round(e.getBoundingClientRect().width));
    const zeilen = new Set(knoepfe.map((e) => Math.round(e.getBoundingClientRect().top))).size;
    return { anzahl: knoepfe.length, breiten: [...new Set(b)], zeilen, hoehe_min: Math.min(...knoepfe.map((e) => Math.round(e.getBoundingClientRect().height))) };
  });
  const umbruch = await p.evaluate(() => [...document.querySelectorAll('.segmented button')]
    .filter((b) => b.getBoundingClientRect().height > 60).map((b) => b.textContent.trim()));
  await k.close();
  return { ...raster, hohe_knoepfe: umbruch };
});

await schritt('Equity-Rechner: Karten wählen statt Kürzel tippen', async () => {
  const k = await neuerKontext(390, 844);
  const p = await k.newPage();
  await p.goto(`${GRUND}/#/nachschlagen/equity`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.karten-ziel');
  const start = await p.evaluate(() => ({
    ziele: document.querySelectorAll('.karten-ziel').length,
    aktiv: document.querySelector('.karten-ziel.aktiv .karten-ziel-name')?.textContent?.trim(),
    belegt: document.querySelectorAll('.karten-slot:not(.leer)').length,
  }));
  /* Flop wählen: 9♥ 2♥ J♣. */
  for (const [rang, farbe] of [['9', '♥'], ['2', '♥'], ['J', '♣']]) {
    await p.locator('.picker-key', { hasText: new RegExp(`^${rang}$`) }).click();
    await p.locator('.picker-key.suit', { hasText: farbe }).click();
  }
  const nach_flop = await p.evaluate(() => ({
    board_karten: document.querySelectorAll('.karten-ziel.aktiv .karten-slot:not(.leer)').length,
    gesperrt: [...document.querySelectorAll('.picker-key')].filter((e) => e.disabled).length,
  }));
  /* Eine schon vergebene Karte ist gesperrt: A♠ liegt in Hand 1. */
  await p.locator('.picker-key', { hasText: /^A$/ }).click();
  const spaten_gesperrt = await p.locator('.picker-key.suit.s').isDisabled();
  await p.getByRole('button', { name: /Anderer Rang|anderer Rang/ }).click();
  await p.getByRole('button', { name: 'Equity berechnen' }).click();
  await p.waitForSelector('main .progressbar', { timeout: 8000 });
  const ergebnis = await p.evaluate(() => ({
    balken: document.querySelectorAll('main .progressbar').length,
    prozent: [...document.querySelectorAll('main .big-stat')].map((e) => e.textContent.trim()),
  }));
  /* Schnelleingabe: Text wird zur Auswahl. */
  await p.locator('details.schnelleingabe summary').click();
  await p.locator('details.schnelleingabe input').nth(2).fill('Td 9d');
  await p.waitForTimeout(150);
  const aus_text = await p.evaluate(() => document.querySelectorAll('.karten-ziel:nth-child(3) .karten-slot:not(.leer)').length);
  await p.locator('details.schnelleingabe input').nth(2).fill('As 9d');
  await p.waitForTimeout(150);
  const doppelt = (await p.locator('details.schnelleingabe .feedback-box').innerText().catch(() => '')).trim();
  await k.close();
  return { start, nach_flop, spaten_gesperrt, ergebnis, hand3_aus_text: aus_text, doppelt_meldung: doppelt };
});

await schritt('Tastatur am Desktop: Quiz, Drill und Übungstisch', async () => {
  const k = await neuerKontext(1280, 800);
  const p = await k.newPage();
  /* Quiz: 2 antwortet, Enter geht weiter. */
  await p.goto(`${GRUND}/#/lernen/m1/m1-l1/quiz`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.quiz-option');
  await p.keyboard.press('2');
  await p.waitForTimeout(200);
  const kbd_sichtbar_quiz = await p.evaluate(() => {
    const e = document.querySelector('.quiz-weiter .kbd-hinweis');
    return e ? getComputedStyle(e).display !== 'none' : null;
  });
  const quiz_beantwortet = await p.locator('.quiz-option.correct, .quiz-option.wrong').count() > 0;
  const zaehler_vorher = (await p.locator('.quiz-zaehler').innerText()).trim();
  await p.keyboard.press('Enter');
  await p.waitForTimeout(250);
  const zaehler_nachher = (await p.locator('.quiz-zaehler').innerText()).trim();
  await p.keyboard.press('b');
  await p.waitForTimeout(200);
  const buchstabe_wirkt = await p.locator('.quiz-option.correct, .quiz-option.wrong').count() > 0;

  /* Drill: J antwortet, Enter geht weiter; die Knöpfe stehen unter der Karte. */
  await p.goto(`${GRUND}/#/lernen/drill`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.drill-knopf.ja');
  await p.waitForTimeout(600);
  const drill_lage = await p.evaluate(() => {
    const karte = document.querySelector('.drill-lage').getBoundingClientRect();
    const knoepfe = document.querySelector('.drill-unten').getBoundingClientRect();
    return { luecke_px: Math.round(knoepfe.top - karte.bottom), knoepfe_oben_vor: Math.round(knoepfe.top) };
  });
  await p.keyboard.press('j');
  await p.waitForSelector('.drill-knopf.weiter');
  await p.waitForTimeout(200);
  const drill_nachher = await p.evaluate(() => ({
    knoepfe_oben_nach: Math.round(document.querySelector('.drill-unten').getBoundingClientRect().top),
    aufloesung_unter_knopf: document.querySelector('.drill-aufloesung').getBoundingClientRect().top
      >= document.querySelector('.drill-unten').getBoundingClientRect().bottom - 1,
  }));
  await p.keyboard.press('Enter');
  await p.waitForSelector('.drill-knopf.ja');
  const drill_weiter = true;

  /* Übungstisch: F foldet. */
  await p.goto(`${GRUND}/#/lernen/uebungstisch`, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(400);
  await p.getByRole('radio', { name: /6-max/ }).click();
  await p.getByRole('button', { name: /Hand austeilen/ }).click();
  for (let i = 0; i < 60; i += 1) {
    if (await p.locator('.aktions-zeile button:not(:disabled)').count() > 0) break;
    await p.waitForTimeout(300);
  }
  const kbd_tisch = await p.$$eval('.aktions-zeile .kbd-hinweis', (els) => els.map((e) => e.dataset.taste));
  await p.keyboard.press('f');
  const gefoldet = await p.getByRole('button', { name: /Hand zu Ende spielen/ }).waitFor({ timeout: 4000 }).then(() => true).catch(() => false);
  await k.close();

  /* Am Handy: kein Hinweis, kein Eingriff in die Seite. */
  const m = await neuerKontext(390, 844);
  const mp = await m.newPage();
  await mp.goto(`${GRUND}/#/lernen/m1/m1-l1/quiz`, { waitUntil: 'domcontentloaded' });
  await mp.waitForSelector('.quiz-option');
  const kbd_handy = await mp.evaluate(() => [...document.querySelectorAll('.kbd-hinweis')].filter((e) => getComputedStyle(e).display !== 'none').length);
  await m.close();
  return {
    kbd_sichtbar_quiz, quiz_beantwortet, zaehler_vorher, zaehler_nachher, buchstabe_wirkt,
    drill_lage, drill_nachher, drill_weiter, kbd_tisch, gefoldet, kbd_handy,
  };
});

await schritt('Tages-Quiz: das Ergebnis lässt sich teilen', async () => {
  const k = await neuerKontext(390, 844, 'de', { permissions: ['clipboard-read', 'clipboard-write'] });
  await k.addInitScript(() => {
    /* Ohne Teilen-Dialog des Geräts: die Zwischenablage ist der Weg. */
    try { delete Navigator.prototype.share; } catch { /* nichts */ }
    Object.defineProperty(navigator, 'share', { value: undefined, configurable: true });
  });
  const p = await k.newPage();
  /* Einen Lernstand mit abgeschlossener Lektion herstellen, damit es ein Quiz gibt. */
  await p.goto(`${GRUND}/#/`, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(400);
  await p.evaluate(() => {
    const idx = JSON.parse(localStorage.getItem('pokermentor-profiles-v1'));
    const key = `pokermentor-data-${idx.activeId}`;
    const d = JSON.parse(localStorage.getItem(key));
    d.completedLessons = { 'm1-l1': { completedAt: new Date().toISOString(), quizScore: 5, quizTotal: 5 } };
    localStorage.setItem(key, JSON.stringify(d));
  });
  await p.goto(`${GRUND}/#/lernen/tagesquiz`, { waitUntil: 'domcontentloaded' });
  await p.reload({ waitUntil: 'domcontentloaded' });
  await p.getByRole('button', { name: 'Tages-Quiz starten' }).click();
  for (let i = 0; i < 12; i += 1) {
    if (await p.locator('.quiz-ergebnis').count() > 0) break;
    await p.locator('.quiz-option').first().click();
    await p.locator('.quiz-weiter:not(:disabled)').click();
    await p.waitForTimeout(120);
  }
  await p.waitForSelector('.quiz-ergebnis');
  const knoepfe = await p.locator('.quiz-ergebnis .entscheidung button, .quiz-ergebnis .entscheidung a').allInnerTexts();
  await p.getByRole('button', { name: 'Ergebnis teilen' }).click();
  await p.waitForTimeout(300);
  const text = await p.evaluate(() => navigator.clipboard.readText());
  const nach = (await p.locator('.quiz-ergebnis .entscheidung button').first().innerText()).trim();
  await k.close();
  return { knoepfe: knoepfe.map((t) => t.trim()), text, bestaetigung: nach };
});

/* ── Lernstand je Thema (E-097) ───────────────────────────────────────────
   Das Profil zeigte eine Summe über alle Trainer. Gemessen wird: ohne Antworten
   ein Satz statt sieben Nullzeilen, mit Antworten eine Zeile je Thema in drei
   Stufen, das schwächste mit zwei Wegen, und der Ringpuffer füllt sich beim
   Üben wirklich. */

await schritt('Lernstand: je Thema eine Stufe, das schwächste mit zwei Wegen', async () => {
  const k = await neuerKontext(390, 844);
  const p = await k.newPage();
  await p.goto(`${GRUND}/#/profil`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.lernstand');
  const leer = await p.evaluate(() => ({
    zeilen: document.querySelectorAll('.lernstand-zeile').length,
    text: document.querySelector('.lernstand .card p')?.textContent?.trim(),
    weg: document.querySelector('.lernstand .card a')?.getAttribute('href'),
  }));
  await p.evaluate(() => {
    const idx = JSON.parse(localStorage.getItem('pokermentor-profiles-v1'));
    const key = `pokermentor-data-${idx.activeId}`;
    const d = JSON.parse(localStorage.getItem(key));
    const f = (n, r) => '1'.repeat(r) + '0'.repeat(n - r);
    d.trainers = {
      outs: { attempts: 40, correct: 30, streak: 2, bestStreak: 6, letzte: f(20, 18) },
      preflop: { attempts: 30, correct: 14, streak: 0, bestStreak: 3, letzte: f(20, 9) },
      equity: { attempts: 6, correct: 4, streak: 1, bestStreak: 3, letzte: f(6, 4) },
      potodds: { attempts: 12, correct: 8, streak: 1, bestStreak: 4, letzte: f(12, 8) },
    };
    localStorage.setItem(key, JSON.stringify(d));
  });
  await p.reload({ waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.lernstand-zeile');
  const mit = await p.evaluate(() => ({
    zeilen: [...document.querySelectorAll('.lernstand-zeile')].map((z) => ({
      thema: z.querySelector('.thema').textContent.trim(),
      stufe: z.querySelector('.stufe-marke').textContent.trim(),
      bilanz: z.querySelector('.bilanz').textContent.trim(),
      wege: [...z.querySelectorAll('.lernstand-wege a')].map((a) => ({ text: a.textContent.trim(), ziel: a.getAttribute('href') })),
    })),
  }));
  /* Üben schreibt in den Ringpuffer. */
  await p.goto(`${GRUND}/#/lernen/trainer/handranking`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.quiz-option');
  await p.locator('.quiz-option').first().click();
  await p.waitForTimeout(300);
  const gespeichert = await p.evaluate(() => {
    const idx = JSON.parse(localStorage.getItem('pokermentor-profiles-v1'));
    return JSON.parse(localStorage.getItem(`pokermentor-data-${idx.activeId}`)).trainers.handranking;
  });
  await k.close();
  return { leer, mit, nach_einer_antwort: { attempts: gespeichert.attempts, letzte_laenge: gespeichert.letzte?.length ?? 0 } };
});

/* ── Modultest: „Kenne ich schon“ (E-097) ────────────────────────────────
   Erfahrene sahen 0 von 49 Lektionen, den Rang „Neuling“ und Grundlagenfragen im
   Tages-Quiz. Gemessen wird der Weg: „Ich spiele schon“ im Willkommensdialog, das
   Angebot auf der Startseite, der Test mit lauter richtigen Antworten (aus den
   Inhaltsdateien gelesen) und danach die Folgen — Modul erledigt, keine XP, kein
   Abzeichen „Erste Schritte“ — und der Weg des Scheiterns. */

const M1 = (await import('../src/content/modules/m1.ts')).default;
const M2 = (await import('../src/content/modules/m2.ts')).default;

async function beantworteTest(p, modul, richtig) {
  const gefragt = [];
  for (let i = 0; i < 12; i += 1) {
    if (await p.locator('.quiz-ergebnis').count() > 0) break;
    await p.waitForSelector('.quiz-option');
    const frage = (await p.locator('.quiz-frage').innerText()).trim();
    const q = modul.lessons.flatMap((l) => l.quiz).find((x) => x.question === frage);
    gefragt.push(frage);
    if (richtig && q) {
      const ziel = q.options[q.correctIndex];
      await p.evaluate((t) => {
        const b = [...document.querySelectorAll('.quiz-option')].find((x) => x.textContent.replace(/^[A-D]/, '').trim() === t);
        b.click();
      }, ziel);
    } else {
      await p.locator('.quiz-option').first().click();
    }
    await p.locator('.quiz-weiter:not(:disabled)').click();
    await p.waitForTimeout(100);
  }
  await p.waitForSelector('.quiz-ergebnis');
  return gefragt.length;
}

await schritt('Modultest: „Ich spiele schon“ bietet ihn an, Bestehen füllt das Modul', async () => {
  const { k, p } = await frischerStart({ mitAnbieter: false });
  const dialog = p.locator('[role="dialog"]');
  await dialog.getByRole('button', { name: 'Deutsch' }).click();
  await dialog.getByRole('button', { name: 'Weiter' }).click();
  const ziele = (await dialog.locator('button.btn').allInnerTexts()).map((t) => t.trim());
  await dialog.getByRole('button', { name: 'Ich spiele schon' }).click();
  await p.waitForSelector('.start-lektion');
  await p.waitForTimeout(400);
  const angebot = await p.locator('.start-mehr', { hasText: 'Kenne ich schon' }).allInnerTexts();
  await p.locator('.start-mehr', { hasText: 'Kenne ich schon' }).click();
  await p.waitForSelector('.modultest-angebot');
  const seite = {
    adresse: new URL(p.url()).hash,
    angebot_text: (await p.locator('.modultest-angebot p').innerText()).trim(),
  };
  await p.getByRole('button', { name: 'Kenne ich schon – Modultest' }).click();
  await p.waitForSelector('.quiz-option');
  const fragen = await beantworteTest(p, M1, true);
  const ergebnis = {
    fragen,
    urteil: (await p.locator('.quiz-ergebnis .urteil').innerText()).trim(),
    stand: (await p.locator('.quiz-ergebnis .big-stat').innerText()).trim(),
    knoepfe: (await p.locator('.quiz-ergebnis .entscheidung a, .quiz-ergebnis .entscheidung button').allInnerTexts()).map((t) => t.trim()),
  };
  const gespeichert = await p.evaluate(() => {
    const idx = JSON.parse(localStorage.getItem('pokermentor-profiles-v1'));
    const d = JSON.parse(localStorage.getItem(`pokermentor-data-${idx.activeId}`));
    return {
      lektionen: Object.keys(d.completedLessons),
      alle_per_test: Object.values(d.completedLessons).every((r) => r.perTest === true),
      xp: d.xp,
      abzeichen: Object.keys(d.badges),
    };
  });
  /* Nach dem Test: das Modul gilt als erledigt, die Startseite bietet das nächste an.
     Der Test hat keine eigene Adresse; wer auf der Modulseite bleibt, sieht sein
     Ergebnis — zum Nachsehen geht es über die Startseite wieder hinein. */
  await p.goto(`${GRUND}/#/`, { waitUntil: 'domcontentloaded' });
  await p.goto(`${GRUND}/#/lernen/m1`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.lektion');
  const modul = await p.evaluate(() => ({
    angebot_noch_da: document.querySelectorAll('.modultest-angebot').length,
    hinweise: [...document.querySelectorAll('.lektion .hinweis')].map((e) => e.textContent.trim()),
    meta_mit_quiz: [...document.querySelectorAll('.lektion .meta')].some((e) => /Quiz: 0\/0/.test(e.textContent)),
  }));
  await p.goto(`${GRUND}/#/`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.start-lektion');
  const start = {
    naechste: (await p.locator('.start-lektion .name').innerText()).trim(),
    naechstes_angebot: await p.locator('.start-mehr', { hasText: 'Kenne ich schon' }).allInnerTexts(),
  };
  await k.close();
  return { ziele, angebot, seite, ergebnis, gespeichert, modul, start };
});

await schritt('Modultest: Scheitern lässt das Modul offen und füllt die Wiederholung', async () => {
  const k = await neuerKontext(390, 844);
  const p = await k.newPage();
  await p.goto(`${GRUND}/#/lernen/m2`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.modultest-angebot');
  await p.getByRole('button', { name: 'Kenne ich schon – Modultest' }).click();
  await p.waitForSelector('.quiz-option');
  await beantworteTest(p, M2, false);
  const ergebnis = {
    urteil: (await p.locator('.quiz-ergebnis .urteil').innerText()).trim(),
    knoepfe: (await p.locator('.quiz-ergebnis .entscheidung a, .quiz-ergebnis .entscheidung button').allInnerTexts()).map((t) => t.trim()),
  };
  const gespeichert = await p.evaluate(() => {
    const idx = JSON.parse(localStorage.getItem('pokermentor-profiles-v1'));
    const d = JSON.parse(localStorage.getItem(`pokermentor-data-${idx.activeId}`));
    return { lektionen: Object.keys(d.completedLessons).length, wiederholung: d.reviews.length, xp: d.xp };
  });
  await p.getByRole('button', { name: 'Test wiederholen' }).click();
  await p.waitForSelector('.quiz-option');
  const neu = (await p.locator('.quiz-zaehler').innerText()).trim();
  await k.close();
  return { ergebnis, gespeichert, wiederholt_bei: neu };
});

/* ── Auszahlung und Bankroll (E-094) ──────────────────────────────────────
   Beide Seiten rechnen mit Geld. Gemessen wird, was früher falsch war:
   Ein Feld, das beim Tippen den Wert verändert, und eine Liste, die hinter
   einem Formular verschwindet. */

await schritt('Auszahlung: Tippen verfälscht nichts, der Text passt zur Tabelle', async () => {
  await seite.goto(`${GRUND}/#/session/auszahlung`, { waitUntil: 'domcontentloaded' });
  await seite.waitForSelector('#pa-spieler');
  const feld = seite.locator('#pa-spieler');
  await feld.click();
  await feld.press('Control+A');
  await seite.keyboard.type('1');
  const nach_eins = await feld.inputValue();
  await seite.keyboard.type('2');
  const nach_zwoelf = await feld.inputValue();
  const buyin = seite.locator('#pa-buyin');
  await buyin.click();
  await buyin.press('Control+A');
  await seite.keyboard.type('7,5');
  await seite.waitForTimeout(150);
  const text = await seite.locator('main').innerText();
  const unlesbar = seite.locator('#pa-rebuys');
  await unlesbar.click();
  await unlesbar.press('Control+A');
  await seite.keyboard.type('abc');
  await seite.waitForTimeout(150);
  const fehler_sichtbar = await seite.locator('#pa-rebuys-fehler').count();
  await seite.getByRole('radio', { name: 'Chips' }).click();
  await seite.waitForTimeout(150);
  const chips_text = await seite.locator('main').innerText();
  return {
    nach_eins_getippt: nach_eins,
    nach_zwoelf_getippt: nach_zwoelf,
    plaetze_bei_12: /3 Plätze werden bezahlt/.test(text),
    topf_in_euro: /90\s?€/.test(text),
    alte_faustregel_da: /zehnte/.test(text),
    staffel_genannt: /ab 10 Spielern 3 Plätze/.test(text),
    fehler_bei_buchstaben: fehler_sichtbar,
    einheit_chips: /Chips/.test(chips_text) && !/90\s?€/.test(chips_text),
    spielerschutz_zeile: /check-dein-spiel\.de/.test(text),
  };
});

await schritt('Bankroll: Liste vor dem Formular, Löschen mit Rückgängig', async () => {
  await seite.goto(`${GRUND}/#/session/bankroll`, { waitUntil: 'domcontentloaded' });
  await seite.waitForSelector('text=Neue Session');
  const erstes_formular_offen = await seite.locator('text=Neue Session').count() > 0;
  const art_vorbelegt = await seite.getByRole('radio', { name: 'Live' }).last().getAttribute('aria-checked');
  const spiel_leer = await seite.getByLabel('Spiel / Limit').inputValue();
  await seite.getByLabel('Dauer (Minuten)').fill('90');
  await seite.getByLabel('Buy-in (€)').fill('10');
  await seite.getByLabel('Cash-out (€)').fill('25');
  await seite.getByRole('button', { name: 'Session speichern' }).click();
  await seite.waitForTimeout(300);
  const nach_speichern = await seite.evaluate(() => ({
    formular_zu: !document.body.innerText.includes('Neue Session'),
    knopf: [...document.querySelectorAll('button')].some((b) => b.innerText.trim() === '+ Session'),
    zeilen: document.querySelectorAll('.session-liste .card').length,
    datum_iso: /\d{4}-\d{2}-\d{2}/.test(document.querySelector('.session-liste')?.innerText ?? ''),
    betrag: document.querySelector('.session-zeile-betrag')?.innerText.trim(),
  }));
  await seite.getByRole('button', { name: 'Session löschen' }).click();
  await seite.waitForTimeout(200);
  const nach_loeschen = await seite.evaluate(() => ({
    zeilen: document.querySelectorAll('.session-liste .card').length,
    rueckgaengig: [...document.querySelectorAll('button')].some((b) => b.innerText.trim() === 'Rückgängig'),
  }));
  await seite.getByRole('button', { name: 'Rückgängig' }).click();
  await seite.waitForTimeout(200);
  const nach_rueckgaengig = await seite.locator('.session-liste .card').count();
  await seite.getByRole('button', { name: 'Session löschen' }).click();
  await seite.waitForTimeout(5600);
  await seite.reload({ waitUntil: 'domcontentloaded' });
  await seite.waitForTimeout(400);
  const nach_ablauf = await seite.locator('.session-liste .card').count();
  return {
    erstes_formular_offen,
    art_vorbelegt_live: art_vorbelegt,
    spiel_leer: spiel_leer === '',
    nach_speichern,
    nach_loeschen,
    nach_rueckgaengig,
    nach_ablauf_und_neuladen: nach_ablauf,
  };
});

await schritt('Range-Viewer: gegen ein Open mit drei Farben, der Eröffner sitzt vor dir', async () => {
  const k = await neuerKontext(390, 844);
  const p = await k.newPage();
  await p.goto(`${GRUND}/#/nachschlagen/ranges`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.matrix .cell');
  await p.getByRole('radio', { name: 'Gegen ein Open' }).click();
  await p.waitForTimeout(250);
  const lesen = () => p.evaluate(() => {
    const gruppen = [...document.querySelectorAll('.range-wahl')];
    return {
      titel: document.querySelector('.range-titel')?.textContent?.trim(),
      anteil: document.querySelector('main .card .pill.gold')?.textContent?.trim(),
      legende: [...document.querySelectorAll('.range-legende > span')].map((e) => e.textContent.trim()),
      eroeffner: gruppen[1] ? [...gruppen[1].querySelectorAll('button')].map((b) => b.textContent.trim()) : [],
      quelle: document.body.innerText.includes('keine Solver-Lösung'),
      breit: document.documentElement.scrollWidth - window.innerWidth,
    };
  });
  const start = await lesen();
  await p.locator('.range-wahl').first().getByRole('button', { name: 'BTN', exact: true }).click();
  await p.waitForTimeout(150);
  const button = await lesen();
  const auskunft = async (eroeffner) => {
    await p.locator('.range-wahl').nth(1).getByRole('button', { name: eroeffner, exact: true }).click();
    await p.waitForTimeout(120);
    await p.locator('.matrix button[title="AJo"]').click();
    await p.waitForTimeout(120);
    return (await p.locator('.auskunft-zeile').innerText()).trim();
  };
  const ajo_gegen_co = await auskunft('CO');
  const ajo_gegen_utg = await auskunft('UTG');
  await k.close();
  return { start, button, ajo_gegen_co, ajo_gegen_utg };
});

await schritt('Preflop-Trainer: der Spot „vs. Open“ fragt nach Platz und Eröffner', async () => {
  const k = await neuerKontext(390, 844);
  const p = await k.newPage();
  await p.goto(`${GRUND}/#/lernen/trainer/preflop`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.spot-chip');
  await p.locator('.spot-chip', { hasText: 'vs. Open' }).click();
  await p.waitForTimeout(250);
  const davor = await p.evaluate(() => ({
    gedrueckt: document.querySelector('.spot-chip[aria-pressed="true"]')?.textContent?.trim(),
    frage: document.querySelector('main .card p')?.textContent?.trim(),
    knoepfe: [...document.querySelectorAll('.entscheidung button')].map((b) => b.textContent.trim()),
    chips: document.querySelectorAll('.spot-chip').length,
    breit: document.documentElement.scrollWidth - window.innerWidth,
  }));
  await p.locator('.entscheidung button', { hasText: 'Fold' }).click();
  await p.waitForTimeout(250);
  const danach = await p.evaluate(() => ({
    urteil: document.querySelector('main .card .rueckmeldung, main .card [role="status"]')?.textContent?.replace(/\s+/g, ' ').trim().slice(0, 140),
    zellen_call: document.querySelectorAll('.matrix .cell.call').length,
    zellen_3bet: document.querySelectorAll('.matrix .cell.raise').length,
    weiter: [...document.querySelectorAll('.entscheidung button')].map((b) => b.textContent.trim()),
  }));
  await k.close();
  return { davor, danach };
});

await schritt('Live-Coach: nach dem Raise fragt er, von wo er kam', async () => {
  const k = await neuerKontext(390, 844);
  const p = await k.newPage();
  await p.goto(`${GRUND}/#/nachschlagen/coach`, { waitUntil: 'domcontentloaded' });
  await p.waitForSelector('.segmented.raster');
  const wahl = () => p.evaluate(() => {
    const gruppe = document.querySelector('.coach-wahl');
    return gruppe ? [...gruppe.querySelectorAll('button')].map((b) => b.textContent.trim()) : null;
  });
  const ohne_raise = await wahl();
  await p.getByRole('button', { name: 'Schon ein Raise' }).click();
  await p.waitForTimeout(150);
  const spaet = await wahl();
  await p.getByRole('button', { name: 'Blinds', exact: true }).click();
  await p.waitForTimeout(150);
  const blinds = await wahl();
  await p.getByRole('button', { name: 'Früh', exact: true }).click();
  await p.waitForTimeout(150);
  const frueh = await wahl();
  await k.close();
  return { ohne_raise, spaet, blinds, frueh };
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

/* Ein Lauf, der Befunde meldet und trotzdem mit 0 endet, lässt den Schritt in
   der Action grün aussehen (E-071). Abbruch, ein gescheiterter Schritt oder
   ein Fehler im Browser sind Befunde. */
const gescheitert = schritte.filter((s) => s.fehler).length;
if (fehler || gescheitert > 0 || seitenfehler.length > 0) {
  console.error(`\n${gescheitert} gescheiterte Schritte, ${seitenfehler.length} Browserfehler`
    + ` — siehe docs/durchgang.json`);
  process.exitCode = 1;
}
