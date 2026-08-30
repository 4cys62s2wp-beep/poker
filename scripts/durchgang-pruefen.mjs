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

/* ── Die Farbmodi ─────────────────────────────────────────────────────────
   Drei Modi, und einer davon ist eine Regel und keine Farbwelt: Die
   Systemvorgabe löst zu hell oder dunkel auf. Über allem steht, dass der
   Live-Bereich in jedem Modus dunkel bleibt. */

await schritt('Die Farbwahl liegt unter dem Personensymbol', async () => {
  await seite.goto(`${GRUND}/#/profil`, { waitUntil: 'domcontentloaded' });
  await seite.waitForSelector('[role="radiogroup"]');
  await seite.waitForTimeout(300);
  const knoepfe = seite.locator('[role="radiogroup"] button');
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
  const knoepfe = seite.locator('[role="radiogroup"] button');

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
  /* Gemessen wird das Attribut zum frühestmöglichen Zeitpunkt und die
     Reihenfolge im Dokument: Läuft das Skript vor dem Stilblatt, kann es
     kein Aufblitzen geben. */
  const frueh = [];
  const horcher = async () => {
    try { frueh.push(await seite.evaluate(() => document.documentElement.getAttribute('data-modus'))); } catch { /* zu früh */ }
  };
  seite.on('domcontentloaded', horcher);
  await seite.reload({ waitUntil: 'commit' });
  await seite.waitForTimeout(700);
  seite.off('domcontentloaded', horcher);
  const roh = await seite.evaluate(async () => (await (await fetch('./index.html')).text()));
  return {
    bei_domcontentloaded: frueh[0] ?? null,
    spaeter: await seite.evaluate(() => document.documentElement.getAttribute('data-modus')),
    skript_vor_stilblatt: roh.indexOf('data-modus') < roh.search(/<link[^>]+rel="stylesheet"/),
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
  await seite.locator('.heute-knopf').first().click();
  await seite.waitForSelector('.heute-aufloesung');
  await seite.waitForTimeout(300);
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
  return {
    frage: vorher.frage,
    karten_vorher: vorher.karten,
    punkte_offen_vorher: vorher.punkte_offen,
    ...danach,
    urteil_nach_neuladen: nachNeuladen.urteil,
    frage_wieder_da: nachNeuladen.frage_wieder_da,
    /* Dieselbe Hand nach dem Neuladen — nicht irgendeine. */
    hand_bleibt: JSON.stringify(nachNeuladen.karten) === JSON.stringify(vorher.karten),
  };
});

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
