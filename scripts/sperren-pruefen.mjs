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

/** Ein Fenster mit eingeschalteter Monetarisierung. `tage` = Alter der Testphase. */
async function fenster(tage) {
  const kontext = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'de-DE' });
  await kontext.route('**/monetization.json', (r) =>
    r.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        enabled: true, functionsBaseUrl: 'https://funktionen.example.org', hasAnnual: false,
        priceMonthly: '4,99 €', priceAnnual: '',
      }),
    }));
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
