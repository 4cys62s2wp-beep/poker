/* Steht die Sperre dort, wo sie gilt — und nur dort?
   ==================================================

   `public/monetization.json` ist ausgeliefert mit `enabled: false`, damit ist
   die App heute vollständig gratis, und kein Lauf sieht je ein Schloss. Genau
   das hat die Lücken verdeckt: Push/Fold, Szenario und Pro-Insights waren
   gesperrt, ohne dass ihre Kachel es sagte; Wiederholen lag hinter der Sperre,
   während die Startseite es anbot.

   Dieser Lauf schaltet die Monetarisierung **im Fenster** ein (die Datei wird
   abgefangen, nichts wird verändert) und lässt die Testphase abgelaufen sein.
   Dann prüft er für ein Gratis-Konto:

     - jede Kachel einer gesperrten Seite trägt das Schloss mit dem Wort „Pro“,
       jede offene keins;
     - die gesperrten Seiten zeigen eine Vorschau, den Satz, was gratis bleibt,
       und laufen nicht über (kein waagerechtes Scrollen);
     - Wiederholen und der Coach am Übungstisch sind offen;
     - in der Testphase steht nirgends ein Schloss.

   Ergebnis nach `docs/sperren.json`; `sperren.test.ts` hält es fest. */

import { holeChromium } from './browser.mjs';
import { writeFileSync } from 'node:fs';

const chromium = await holeChromium();
const GRUND = 'http://localhost:4173';

const GESPERRT_TRAINER = ['szenario', 'pushfold'];
const OFFEN_TRAINER = ['preflop', 'potodds', 'equity', 'handranking', 'outs'];
const GESPERRT_MODULE = ['m4', 'm5', 'm7', 'm8', 'm9'];
const OFFEN_MODULE = ['m1', 'm2', 'm3', 'm6'];

const browser = await chromium.launch();
const befunde = [];
const geprueft = [];
const pruefe = (name, ok, text = '') => {
  geprueft.push(name);
  if (!ok) befunde.push({ pruefung: name, text });
};

/** Ein Fenster mit eingeschalteter Monetarisierung. `tage` = Alter der Testphase,
 *  `verzoegerung` = so lange antwortet die Konfigurationsdatei nicht (ein langsames Netz). */
async function fenster(tage, verzoegerung = 0) {
  const kontext = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'de-DE' });
  await kontext.route('**/monetization.json', async (r) => {
    if (verzoegerung > 0) await new Promise((fertig) => setTimeout(fertig, verzoegerung));
    await r.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        enabled: true, functionsBaseUrl: 'https://funktionen.example.org', hasAnnual: true,
        priceMonthly: '4,99 €', priceAnnual: '39,99 €', annualNote: '2 Monate geschenkt',
        supportEmail: 'hilfe@example.org',
      }),
    });
  });
  await kontext.addInitScript((alter) => {
    try {
      localStorage.setItem('pokermentor-lang-v1', 'de');
      localStorage.setItem('pokermentor-trial-anchor-v1', new Date(Date.now() - alter * 86_400_000).toISOString());
    } catch { /* nichts */ }
  }, tage);
  const seite = await kontext.newPage();
  seite.setDefaultTimeout(15000);
  return { kontext, seite };
}

async function gehe(seite, hash, warte = 700) {
  await seite.goto(`${GRUND}/#/`, { waitUntil: 'domcontentloaded' });
  await seite.evaluate((h) => { location.hash = h; }, hash);
  await seite.waitForTimeout(warte);
}

const hatSchloss = (seite, href) =>
  seite.evaluate((h) => {
    const a = document.querySelector(`main a[href="#${h}"]`);
    const s = a?.querySelector('.schloss');
    return a ? { da: true, schloss: !!s, text: s?.textContent?.replace(/\s+/g, ' ').trim() ?? '' } : { da: false, schloss: false, text: '' };
  }, href);

/* ---------- Gratis, Testphase abgelaufen ---------- */
{
  const { kontext, seite } = await fenster(30);

  await gehe(seite, '/lernen', 1500);
  for (const id of GESPERRT_TRAINER) {
    const r = await hatSchloss(seite, `/lernen/trainer/${id}`);
    pruefe(`Kachel ${id}: Schloss mit Wort`, r.da && r.schloss && /Pro/.test(r.text), JSON.stringify(r));
  }
  for (const id of OFFEN_TRAINER) {
    const r = await hatSchloss(seite, `/lernen/trainer/${id}`);
    pruefe(`Kachel ${id}: kein Schloss`, r.da && !r.schloss, JSON.stringify(r));
  }
  {
    const r = await hatSchloss(seite, '/lernen/pros');
    pruefe('Kachel Pro-Insights: Schloss mit Wort', r.da && r.schloss && /Pro/.test(r.text), JSON.stringify(r));
  }
  for (const id of GESPERRT_MODULE) {
    const r = await hatSchloss(seite, `/lernen/${id}`);
    pruefe(`Modul ${id}: Schloss mit Wort`, r.da && r.schloss && /Pro/.test(r.text), JSON.stringify(r));
  }
  for (const id of OFFEN_MODULE) {
    const r = await hatSchloss(seite, `/lernen/${id}`);
    pruefe(`Modul ${id}: kein Schloss`, r.da && !r.schloss, JSON.stringify(r));
  }

  const gratisSatz = {};
  for (const [adresse, name] of [
    ['/lernen/trainer/szenario', 'Szenario'],
    ['/lernen/trainer/pushfold', 'Push/Fold'],
    ['/lernen/pros', 'Pro-Insights'],
  ]) {
    await gehe(seite, adresse);
    const m = await seite.evaluate(() => ({
      sperre: !!document.querySelector('main .pro-sperre'),
      vorschau: document.querySelectorAll('main .sperre-vorschau li').length,
      gratis: document.querySelector('main .sperre-gratis')?.textContent?.trim() ?? '',
      breit: document.documentElement.scrollWidth - window.innerWidth,
      knopf: !!document.querySelector('main .pro-sperre a[href="#/pro"]'),
      klein: [...document.querySelectorAll('main .pro-sperre a, main .pro-sperre button')]
        .map((e) => e.getBoundingClientRect())
        .filter((r) => r.width < 44 || r.height < 44)
        .map((r) => `${Math.round(r.width)}×${Math.round(r.height)}`),
    }));
    pruefe(`${name}: Knopf mindestens 44 × 44`, m.klein.length === 0, m.klein.join(', '));
    pruefe(`${name}: Sperr-Karte mit Weg zu Pro`, m.sperre && m.knopf, JSON.stringify(m));
    pruefe(`${name}: Vorschau mit zwei Beispielen`, m.vorschau === 2, `${m.vorschau} Beispiele`);
    pruefe(`${name}: sagt, was gratis bleibt`, /Gratis bleiben: 4 Module, 6 Trainer/.test(m.gratis), m.gratis);
    pruefe(`${name}: kein waagerechtes Scrollen`, m.breit <= 0, `${m.breit} px zu breit`);
    gratisSatz[name] = m.gratis;
    await seite.screenshot({ path: `${process.env.SPERREN_BILDER ?? '/tmp'}/sperre-${name.replace(/\W/g, '')}.png`, fullPage: true }).catch(() => {});
  }

  /* Das Modul: erste Lektion offen, die übrigen mit Schloss, eine kompakte Karte darunter. */
  await gehe(seite, '/lernen/m4');
  {
    const m = await seite.evaluate(() => {
      const zeilen = [...document.querySelectorAll('main a[href^="#/lernen/m4/m4-l"]')];
      return {
        erste: zeilen[0] ? !zeilen[0].querySelector('.schloss') : null,
        uebrige: zeilen.slice(1).every((z) => !!z.querySelector('.schloss')),
        anzahl: zeilen.length,
        karte: !!document.querySelector('main .pro-sperre.kompakt'),
      };
    });
    pruefe('Modul m4: erste Lektion offen', m.erste === true, JSON.stringify(m));
    pruefe('Modul m4: übrige Lektionen mit Schloss', m.anzahl > 1 && m.uebrige, JSON.stringify(m));
    pruefe('Modul m4: Sperr-Karte', m.karte);
  }
  await gehe(seite, '/lernen/m4/m4-l2');
  pruefe('Lektion m4-l2: Sperr-Karte', (await seite.locator('main .pro-sperre').count()) === 1);
  await gehe(seite, '/lernen/m4/m4-l1');
  pruefe('Lektion m4-l1: offen', (await seite.locator('main .pro-sperre').count()) === 0);

  /* Wiederholen: offen, mit Leerzustand statt Sperre. */
  await gehe(seite, '/lernen/wiederholen');
  pruefe('Wiederholen: keine Sperr-Karte', (await seite.locator('main .pro-sperre').count()) === 0);
  {
    const text = await seite.evaluate(() => document.querySelector('main')?.innerText ?? '');
    pruefe('Wiederholen: kein Pro-Hinweis im Text', !/Pro-Funktion|gehört zu PokerMentor Pro/.test(text), text.slice(0, 120));
  }

  /* Übungstisch: der Coach schaltet sich, ohne dass ein Blatt „Pro“ aufgeht. */
  await gehe(seite, '/lernen/uebungstisch', 1200);
  {
    const schalter = seite.getByRole('switch', { name: 'Coach' }).first();
    const davor = await schalter.getAttribute('aria-checked');
    await schalter.click();
    await seite.waitForTimeout(400);
    const danach = await schalter.getAttribute('aria-checked');
    const blatt = await seite.locator('[role="dialog"]').count();
    const marke = await seite.locator('main .schalter-label .pill').count();
    pruefe('Übungstisch: Coach lässt sich schalten', davor !== danach, `${davor} → ${danach}`);
    pruefe('Übungstisch: kein Pro-Blatt beim Coach', blatt === 0, `${blatt} Dialog(e)`);
    pruefe('Übungstisch: keine Pro-Marke am Coach', marke === 0, `${marke} Marke(n)`);
  }

  /* Suche: Szenario-Trainer mit Schloss, offener Trainer ohne. */
  await gehe(seite, '/lernen', 1200);
  {
    await seite.locator('#lernen-suche').fill('trainer');
    await seite.waitForTimeout(600);
    const r = await seite.evaluate(() => {
      const zeilen = [...document.querySelectorAll('main .such-zeile')];
      const mit = (h) => zeilen.find((z) => z.getAttribute('href') === `#${h}`);
      return {
        szenario: !!mit('/lernen/trainer/szenario')?.querySelector('.schloss'),
        pushfold: !!mit('/lernen/trainer/pushfold')?.querySelector('.schloss'),
        potodds: mit('/lernen/trainer/potodds') ? !!mit('/lernen/trainer/potodds')?.querySelector('.schloss') : null,
      };
    });
    pruefe('Suche: Szenario-Trainer mit Schloss', r.szenario, JSON.stringify(r));
    pruefe('Suche: Push/Fold-Trainer mit Schloss', r.pushfold, JSON.stringify(r));
    pruefe('Suche: Pot-Odds-Trainer ohne Schloss', r.potodds === false, JSON.stringify(r));
  }

  await kontext.close();
}

/* ---------- Pro-Start: Aufruf von /pro, Rückkehr aus dem Kauf, Kündigung (E-099) ---------- */
{
  const { kontext, seite } = await fenster(30, 1200);
  /* Direkter Aufruf, langsames Netz: Die Konfiguration kommt erst nach 1,2 s.
     Früher stand hier nach dem ersten Rendern die Startseite. */
  await seite.goto(`${GRUND}/#/pro`, { waitUntil: 'domcontentloaded' });
  await seite.waitForTimeout(400);
  {
    const m = await seite.evaluate(() => ({
      hash: location.hash,
      platzhalter: !!document.querySelector('main .pro-laedt'),
      h1: document.querySelector('main h1')?.textContent ?? '',
    }));
    pruefe('/pro beim Laden: bleibt auf /pro', m.hash === '#/pro', m.hash);
    pruefe('/pro beim Laden: Kopf und Platzhalter', m.platzhalter && m.h1.length > 3, JSON.stringify(m));
  }
  await seite.waitForTimeout(1800);
  {
    const m = await seite.evaluate(() => {
      const main = document.querySelector('main')?.innerText ?? '';
      return {
        hash: location.hash,
        preis: /39,99 €/.test(main),
        tabelle: main,
        kauf: [...document.querySelectorAll('main button')].some((b) => /Zahlungspflichtig abonnieren/.test(b.textContent ?? '')),
        breit: document.documentElement.scrollWidth - window.innerWidth,
        klein: [...document.querySelectorAll('main a, main button, main summary')]
          .filter((e) => e.getClientRects().length > 0)
          .map((e) => ({ r: e.getBoundingClientRect(), t: (e.textContent ?? '').trim().slice(0, 24) }))
          .filter(({ r }) => r.height < 44 || r.width < 44)
          .map(({ r, t }) => `${t} ${Math.round(r.width)}×${Math.round(r.height)}`),
      };
    });
    pruefe('/pro nach dem Laden: bleibt auf /pro', m.hash === '#/pro', m.hash);
    pruefe('/pro: Preis und Kaufknopf mit Zahlungspflicht', m.preis && m.kauf, JSON.stringify({ preis: m.preis, kauf: m.kauf }));
    pruefe('/pro: Tabelle sagt „6 von 8“ und „Alle 8“ bei den Trainern', /6 von 8/.test(m.tabelle) && /Alle 8/.test(m.tabelle), '');
    pruefe('/pro: Tabelle sagt „4 von 9“ und „Alle 9“ bei den Modulen', /4 von 9/.test(m.tabelle) && /Alle 9/.test(m.tabelle), '');
    pruefe('/pro: keine Versprechen gegen E-098/E-010', !/Synchronisation|Geld kosten|keiner gern|Overlay|Sync auf/i.test(m.tabelle), '');
    pruefe('/pro: kein waagerechtes Scrollen', m.breit <= 0, `${m.breit} px`);
    pruefe('/pro: alle Bedienflächen mindestens 44 × 44', m.klein.length === 0, m.klein.join('; '));
    await seite.screenshot({ path: `${process.env.SPERREN_BILDER ?? '/tmp'}/pro-seite.png`, fullPage: true }).catch(() => {});
  }

  /* Rückkehr: bezahlt, Berechtigung noch nicht da. */
  await seite.goto(`${GRUND}/#/`, { waitUntil: 'domcontentloaded' });
  await seite.evaluate(() => { location.hash = '/pro?kauf=ok'; });
  await seite.waitForTimeout(2200);
  {
    const m = await seite.evaluate(() => {
      const main = document.querySelector('main')?.innerText ?? '';
      return {
        hash: location.hash,
        wartet: /Zahlung wird bestätigt/.test(main),
        kaufknopf: [...document.querySelectorAll('main button')].some((b) => /Zahlungspflichtig/.test(b.textContent ?? '')),
        status: !!document.querySelector('main [role="status"]'),
      };
    });
    pruefe('Rückkehr ?kauf=ok: bleibt auf /pro', m.hash.startsWith('#/pro'), m.hash);
    pruefe('Rückkehr ?kauf=ok: „Zahlung wird bestätigt …“ in einer Statusmeldung', m.wartet && m.status, JSON.stringify(m));
    pruefe('Rückkehr ?kauf=ok: kein zweiter Kaufknopf', !m.kaufknopf, 'der Knopf steht noch da');
    await seite.screenshot({ path: `${process.env.SPERREN_BILDER ?? '/tmp'}/pro-wartet.png`, fullPage: false }).catch(() => {});
  }

  /* Rückkehr: abgebrochen. */
  await seite.evaluate(() => { location.hash = '/pro?kauf=abbruch'; });
  await seite.waitForTimeout(700);
  {
    const m = await seite.evaluate(() => {
      const main = document.querySelector('main')?.innerText ?? '';
      return {
        nichts: /Nichts gebucht/.test(main),
        kaufknopf: [...document.querySelectorAll('main button')].some((b) => /Zahlungspflichtig/.test(b.textContent ?? '')),
      };
    });
    pruefe('Rückkehr ?kauf=abbruch: „Nichts gebucht“ und der Kaufknopf bleibt', m.nichts && m.kaufknopf, JSON.stringify(m));
  }
  await kontext.close();
}

{
  /* Die Kündigung, langsames Netz: Nie „nicht verfügbar“, auch nicht für einen Augenblick. */
  const { kontext, seite } = await fenster(30, 1200);
  await seite.goto(`${GRUND}/#/kuendigen`, { waitUntil: 'domcontentloaded' });
  const gesehen = [];
  for (let i = 0; i < 20; i++) {
    gesehen.push(await seite.evaluate(() => ({
      text: document.querySelector('main')?.innerText ?? '',
      formular: !!document.querySelector('#c-name'),
    })));
    await seite.waitForTimeout(100);
  }
  await seite.waitForTimeout(1200);
  const spaeter = await seite.evaluate(() => !!document.querySelector('#c-name'));
  pruefe('Kündigung beim Laden: nie „nicht verfügbar“', !gesehen.some((g) => /nicht verfügbar|noch nicht|nicht eingerichtet|Kein Abo/i.test(g.text.replace(/Hier kündigst.*/s, ''))), gesehen[0].text.slice(0, 120));
  pruefe('Kündigung beim Laden: erst Platzhalter, dann Formular', !gesehen[0].formular && spaeter, JSON.stringify({ anfang: gesehen[0].formular, spaeter }));
  await kontext.close();
}

{
  /* Ohne Monetarisierung (heutiger Zustand) gibt es die Seite nicht — aber erst nach dem Laden. */
  const kontext = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'de-DE' });
  const seite = await kontext.newPage();
  seite.setDefaultTimeout(15000);
  await seite.goto(`${GRUND}/#/pro`, { waitUntil: 'domcontentloaded' });
  await seite.waitForTimeout(1500);
  pruefe('Monetarisierung aus: /pro führt auf die Startseite', (await seite.evaluate(() => location.hash)) === '#/', await seite.evaluate(() => location.hash));
  await seite.goto(`${GRUND}/#/kuendigen`, { waitUntil: 'domcontentloaded' });
  await seite.waitForTimeout(1500);
  pruefe('Monetarisierung aus: Kündigung sagt, dass es kein Abo gibt', !(await seite.evaluate(() => !!document.querySelector('#c-name'))), '');
  await kontext.close();
}

{
  /* Der ruhige Hinweis: drei Tage und einen Tag vor Ende, je einmal, wegklickbar. */
  const hinweis = async (tage) => {
    const { kontext, seite } = await fenster(tage);
    await seite.goto(`${GRUND}/#/`, { waitUntil: 'domcontentloaded' });
    await seite.waitForTimeout(1600);
    const text = await seite.evaluate(() => document.querySelector('main .testende-hinweis')?.textContent?.replace(/\s+/g, ' ').trim() ?? null);
    return { kontext, seite, text };
  };
  {
    const a = await hinweis(4); // 7 − 4 = 3 Tage übrig
    pruefe('Testende: 3 Tage vorher steht der Hinweis', !!a.text && /endet in 3 Tagen/.test(a.text) && /Danach bleiben gratis: 4 Module, 6 Trainer/.test(a.text), a.text ?? 'kein Hinweis');
    await a.seite.locator('main .testende-hinweis button').click();
    await a.seite.waitForTimeout(300);
    const weg = (await a.seite.locator('main .testende-hinweis').count()) === 0;
    await a.seite.reload({ waitUntil: 'domcontentloaded' });
    await a.seite.waitForTimeout(1600);
    const bleibtWeg = (await a.seite.locator('main .testende-hinweis').count()) === 0;
    pruefe('Testende: „Verstanden“ blendet ihn aus, auch nach dem Neuladen', weg && bleibtWeg, JSON.stringify({ weg, bleibtWeg }));
    await a.kontext.close();
  }
  {
    const b = await hinweis(6); // 1 Tag übrig
    pruefe('Testende: 1 Tag vorher „endet morgen“', !!b.text && /endet morgen/.test(b.text), b.text ?? 'kein Hinweis');
    await b.kontext.close();
  }
  {
    const c = await hinweis(1); // 6 Tage übrig
    pruefe('Testende: mitten in der Testphase kein Hinweis', c.text === null, c.text ?? '');
    await c.kontext.close();
  }
  {
    const d = await hinweis(30); // abgelaufen
    pruefe('Testende: nach dem Ende kein Hinweis', d.text === null, d.text ?? '');
    await d.kontext.close();
  }
}

/* ---------- Testphase läuft: nirgends ein Schloss ---------- */
{
  const { kontext, seite } = await fenster(1);
  await gehe(seite, '/lernen', 1500);
  const n = await seite.locator('main .schloss').count();
  pruefe('Testphase: kein Schloss auf der Lernseite', n === 0, `${n} Schloss/Schlösser`);
  await gehe(seite, '/lernen/trainer/szenario');
  pruefe('Testphase: Szenario offen', (await seite.locator('main .pro-sperre').count()) === 0);
  await kontext.close();
}

/* ---------- Monetarisierung aus (heutiger Zustand): nirgends ein Schloss ---------- */
{
  const kontext = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'de-DE' });
  const seite = await kontext.newPage();
  seite.setDefaultTimeout(15000);
  await gehe(seite, '/lernen', 1500);
  const n = await seite.locator('main .schloss').count();
  pruefe('Monetarisierung aus: kein Schloss', n === 0, `${n} Schloss/Schlösser`);
  await gehe(seite, '/lernen/pros');
  pruefe('Monetarisierung aus: Pro-Insights offen', (await seite.locator('main .pro-sperre').count()) === 0);
  await kontext.close();
}

await browser.close();

const ergebnis = {
  geprueft_am: new Date().toISOString(),
  grund: GRUND,
  pruefungen: geprueft.length,
  befunde_gesamt: befunde.length,
  befunde,
};
writeFileSync('docs/sperren.json', JSON.stringify(ergebnis, null, 2) + '\n');

console.log(`${geprueft.length} Prüfungen, ${befunde.length} Befunde.`);
for (const b of befunde) console.log(`  ✗ ${b.pruefung}${b.text ? ` — ${b.text}` : ''}`);
process.exit(befunde.length === 0 ? 0 : 1);
