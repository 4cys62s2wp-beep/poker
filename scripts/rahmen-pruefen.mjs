/* Der Rahmen um die Seiten: Kopfzeile, Scrollposition, Seitenleiste, Breite.
   =========================================================================

   Ein Rahmen ist das, was man nie bewusst ansieht und sofort vermisst. Fünf
   Dinge wurden gefunden, die nur ein echter Browser sieht:

   1. **Die Kopfzeile klebt.** Am Handy war sie ein Block am Seitenanfang; wer in
      der Lektion (5600 px) nach unten gescrollt war, hatte keinen Rückweg.
      Gemessen wird: nach dem Scrollen liegt sie bei y = 0, nennt den Ort aus
      Rückziel und Überschrift, und die Lektion zeigt ihren Lesestand. Quer
      (390 px Höhe) klebt sie nicht.
   2. **Die Scrollposition gehört der App.** Neue Seiten öffnen oben (vorher bei
      scrollY 2836 und 343); Zurück stellt die alte Tiefe wieder her, und
      Vorwärts springt wieder nach oben.
   3. **Die Seitenleiste hat genau einen aktiven Eintrag** — vorher zwei, und
      auf der Live-Session-Seite keinen — und ihre Fußzeile bleibt bei 768 und
      860 Pixeln Höhe im Bild.
   4. **Seiten sitzen zentriert** in einer Spalte, deren Breite der Ort bestimmt:
      links und rechts gleich viel Rand, auch bei 1920 Pixeln.
   5. **Meldungen liegen nicht über Marke und „Du".**

   Gegenprobe: `.mobile-top` auf `position: static` und das Zurücksetzen der
   Scrollposition ausgebaut → beide Prüfungen schlagen an.

   Ergebnis nach `docs/rahmen.json`; `rahmen.test.ts` hält es fest. */

import { holeChromium } from './browser.mjs';
import { writeFileSync } from 'node:fs';

const chromium = await holeChromium();
const GRUND = 'http://localhost:4173';
const browser = await chromium.launch();

const befunde = [];
const befund = (bereich, wo, text) => befunde.push({ bereich, wo, text });
const messwerte = {};

const kontext = async (breite, hoehe) => {
  const k = await browser.newContext({ viewport: { width: breite, height: hoehe }, locale: 'de-DE' });
  await k.addInitScript(() => localStorage.setItem('pokermentor-lang-v1', 'de'));
  return k;
};
const gehe = async (seite, adresse, warte = 700) => {
  await seite.goto(`${GRUND}/${adresse}`, { waitUntil: 'domcontentloaded' });
  await seite.waitForTimeout(warte);
};

/* ── 1 + 2: Handy hochkant ─────────────────────────────────────────────── */
{
  const k = await kontext(390, 844);
  const seite = await k.newPage();

  const LANG = [
    ['lernen/m1/m1-l1', 'Lektion'],
    ['nachschlagen/glossar', 'Glossar'],
    ['nachschlagen/tells', 'Tells'],
    ['profil', 'Profil'],
  ];
  const kopf = [];
  for (const [adresse, name] of LANG) {
    await gehe(seite, `#/${adresse}`);
    const oben = await seite.evaluate(() => {
      const z = document.querySelector('.mobile-top');
      const ort = document.querySelector('.mobile-top-ort');
      return {
        position: getComputedStyle(z).position,
        ortSichtbar: !!ort && getComputedStyle(ort).display !== 'none',
        hoehe: Math.round(z.getBoundingClientRect().height),
        kopfH: getComputedStyle(document.documentElement).getPropertyValue('--kopf-h').trim(),
        seitenhoehe: document.documentElement.scrollHeight,
      };
    });
    if (oben.ortSichtbar) befund('Kopfzeile', adresse, 'zeigt den Ort schon ganz oben');
    if (oben.position !== 'sticky') befund('Kopfzeile', adresse, `position ist ${oben.position}, nicht sticky`);
    if (`${oben.hoehe}px` !== oben.kopfH) befund('Kopfzeile', adresse, `Höhe ${oben.hoehe}px, --kopf-h ist ${oben.kopfH}`);

    await seite.evaluate(() => window.scrollTo(0, 1800));
    await seite.waitForTimeout(400);
    const unten = await seite.evaluate(() => {
      const z = document.querySelector('.mobile-top');
      const r = z.getBoundingClientRect();
      const ort = document.querySelector('.mobile-top-ort');
      const h1 = document.querySelector('main h1')?.textContent?.trim() ?? '';
      const bereich = ort?.querySelector('.rueckname')?.textContent?.trim() ?? '';
      const titel = ort?.querySelector('.seitentitel')?.textContent?.trim() ?? '';
      const mar = document.querySelector('.mobile-top-marke').getBoundingClientRect();
      const du = document.querySelector('.mobile-top-you').getBoundingClientRect();
      const or = ort?.getBoundingClientRect();
      const hoehen = ort ? Math.round(or.height) : 0;
      return {
        top: Math.round(r.top),
        y: Math.round(window.scrollY),
        sichtbar: !!ort && getComputedStyle(ort).display !== 'none',
        bereich, titel, h1, hoehen,
        ueberlappt: !!or && (or.left < mar.right - 1 || or.right > du.left + 1),
        linie: getComputedStyle(z).boxShadow !== 'none',
        elementAnPunkt: document.elementFromPoint(195, 20)?.closest('.mobile-top') !== null,
      };
    });
    if (unten.y < 1000) befund('Kopfzeile', adresse, `Seite zu kurz zum Testen (${unten.y} px gescrollt)`);
    if (unten.top !== 0) befund('Kopfzeile', adresse, `liegt nach dem Scrollen bei y = ${unten.top}`);
    if (!unten.sichtbar) befund('Kopfzeile', adresse, 'zeigt nach dem Scrollen keinen Ort');
    if (unten.sichtbar && unten.titel !== unten.h1) befund('Kopfzeile', adresse, `Titel „${unten.titel}“ ≠ Überschrift „${unten.h1}“`);
    if (unten.sichtbar && !unten.bereich) befund('Kopfzeile', adresse, 'nennt keinen Rückweg');
    if (unten.hoehen < 44) befund('Kopfzeile', adresse, `Ortszeile nur ${unten.hoehen} px hoch`);
    if (unten.ueberlappt) befund('Kopfzeile', adresse, 'Ortszeile überlappt Marke oder „Du“');
    if (!unten.linie) befund('Kopfzeile', adresse, 'kein Haarstrich nach dem Scrollen');
    if (!unten.elementAnPunkt) befund('Kopfzeile', adresse, 'liegt nicht oben (Inhalt darüber)');
    kopf.push({ seite: name, adresse, seitenhoehe: oben.seitenhoehe, gescrollt: unten.y, titel: unten.titel, rueckweg: unten.bereich });
  }
  messwerte.kopfzeile = kopf;

  /* Klick auf die Ortszeile führt zum Rückziel. */
  await gehe(seite, '#/lernen/m1/m1-l1');
  await seite.evaluate(() => window.scrollTo(0, 1500));
  await seite.waitForTimeout(350);
  await seite.locator('.mobile-top-ort').click();
  await seite.waitForTimeout(500);
  const nachKlick = await seite.evaluate(() => location.hash);
  if (!/#\/lernen\/m1$/.test(nachKlick)) befund('Kopfzeile', 'lernen/m1/m1-l1', `Klick auf die Ortszeile führt nach ${nachKlick}`);

  /* Lesefortschritt in der Lektion — in einem frischen Fenster: Dieselbe Adresse
     ein zweites Mal zu öffnen, stellt die alte Tiefe wieder her (das ist gewollt). */
  const frisch = await kontext(390, 844);
  const lese = await frisch.newPage();
  await gehe(lese, '#/lernen/m1/m1-l1');
  const l0 = await lese.evaluate(() => getComputedStyle(document.querySelector('.lesefortschritt')).getPropertyValue('--lese').trim());
  await lese.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await lese.waitForTimeout(400);
  const l1 = await lese.evaluate(() => getComputedStyle(document.querySelector('.lesefortschritt')).getPropertyValue('--lese').trim());
  await frisch.close();
  if (Number(l0) > 0.02) befund('Lesefortschritt', 'Lektion', `oben schon ${l0}`);
  if (Number(l1) < 0.95) befund('Lesefortschritt', 'Lektion', `unten nur ${l1}`);
  messwerte.lesefortschritt = { oben: Number(l0), unten: Number(l1) };

  /* Scrollposition: Vorwärts oben, Zurück an die alte Stelle, Vorwärts wieder oben. */
  await gehe(seite, '#/lernen');
  await seite.evaluate(() => window.scrollTo(0, 1400));
  await seite.waitForTimeout(300);
  const vorher = await seite.evaluate(() => Math.round(window.scrollY));
  await seite.evaluate(() => document.querySelector('a[href$="/lernen/trainer/outs"]').click());
  await seite.waitForTimeout(700);
  const neu = await seite.evaluate(() => ({ y: Math.round(window.scrollY), hash: location.hash,
    fokus: document.activeElement?.tagName }));
  if (neu.y > 1) befund('Scrollposition', 'lernen → Trainer', `neue Seite öffnet bei y = ${neu.y}`);
  if (neu.fokus !== 'H1') befund('Scrollposition', 'lernen → Trainer', `Fokus liegt auf ${neu.fokus}, nicht auf der Überschrift`);
  await seite.goBack();
  await seite.waitForTimeout(900);
  const zurueck = await seite.evaluate(() => Math.round(window.scrollY));
  if (Math.abs(zurueck - vorher) > 4) befund('Scrollposition', 'Trainer → zurück', `y = ${zurueck}, vorher ${vorher}`);
  await seite.goForward();
  await seite.waitForTimeout(700);
  const vor = await seite.evaluate(() => Math.round(window.scrollY));
  if (vor > 1) befund('Scrollposition', 'zurück → vorwärts', `y = ${vor}`);
  messwerte.scroll = { vorher, neueSeite: neu.y, zurueck, vorwaertsErneut: vor };
  await k.close();
}

/* ── Quer: klebt nicht ─────────────────────────────────────────────────── */
{
  const k = await kontext(844, 390);
  const seite = await k.newPage();
  await gehe(seite, '#/lernen/m1/m1-l1');
  const pos = await seite.evaluate(() => getComputedStyle(document.querySelector('.mobile-top')).position);
  if (pos !== 'static') befund('Kopfzeile', 'quer', `position ist ${pos}: nähme ein Sechstel der Höhe`);
  messwerte.quer = { position: pos };
  await k.close();
}

/* ── Meldung nicht über Marke und „Du“ ─────────────────────────────────── */
{
  const k = await kontext(390, 844);
  const seite = await k.newPage();
  await gehe(seite, '#/lernen/drill', 900);
  await seite.locator('.drill-knopf.ja').click();
  await seite.waitForSelector('.toast', { timeout: 6000 }).catch(() => {});
  await seite.waitForTimeout(500);
  const t = await seite.evaluate(() => {
    const toast = document.querySelector('.toast');
    if (!toast) return null;
    const r = toast.getBoundingClientRect();
    const kopf = document.querySelector('.mobile-top').getBoundingClientRect();
    const mar = document.querySelector('.mobile-top-marke').getBoundingClientRect();
    const du = document.querySelector('.mobile-top-you').getBoundingClientRect();
    const schneidet = (a, b) => !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
    return { top: Math.round(r.top), links: Math.round(r.left), rechts: Math.round(innerWidth - r.right),
      kopfUnten: Math.round(kopf.bottom), ueberMarke: schneidet(r, mar), ueberDu: schneidet(r, du) };
  });
  if (!t) befund('Meldung', 'Drill', 'keine Meldung erschienen — Prüfung nicht möglich');
  else {
    if (t.ueberMarke || t.ueberDu) befund('Meldung', 'Drill', 'liegt über Marke oder „Du“');
    if (t.top < t.kopfUnten) befund('Meldung', 'Drill', `beginnt bei ${t.top} px, die Kopfzeile endet bei ${t.kopfUnten}`);
    if (Math.abs(t.links - t.rechts) > 2) befund('Meldung', 'Drill', `nicht mittig (${t.links} / ${t.rechts})`);
    messwerte.meldung = t;
  }
  await k.close();
}

/* ── 3: Seitenleiste ───────────────────────────────────────────────────── */
{
  const ERWARTET = {
    '#/': '#/', '#/lernen': '#/lernen', '#/lernen/wiederholen': '#/lernen/wiederholen',
    '#/lernen/uebungstisch': '#/lernen/uebungstisch', '#/lernen/statistik': '#/lernen',
    '#/lernen/pros': '#/lernen', '#/lernen/drill': '#/lernen', '#/lernen/trainer/outs': '#/lernen',
    '#/lernen/m1': '#/lernen', '#/lernen/m1/m1-l1': '#/lernen',
    '#/nachschlagen': '#/nachschlagen', '#/nachschlagen/coach': '#/nachschlagen/coach',
    '#/nachschlagen/glossar': '#/nachschlagen/glossar', '#/nachschlagen/odds': '#/nachschlagen',
    '#/nachschlagen/ranges': '#/nachschlagen', '#/session': '#/session',
    '#/session/live/einrichten': '#/session/live/einrichten', '#/session/abende': '#/session/abende',
    '#/session/chips': '#/session/chips', '#/session/auszahlung': '#/session/auszahlung',
    '#/session/bankroll': '#/session/bankroll', '#/profil': '#/profil', '#/freunde': '#/freunde',
    '#/session/spieler/Mira': '#/session/abende', '#/rechtliches': null,
  };
  const k = await kontext(1366, 860);
  const seite = await k.newPage();
  const je = [];
  for (const [adresse, soll] of Object.entries(ERWARTET)) {
    await gehe(seite, adresse, 450);
    const aktiv = await seite.evaluate(() =>
      [...document.querySelectorAll('.sidebar .nav-link.active')].map((a) => a.getAttribute('href')));
    const ist = aktiv.length === 1 ? aktiv[0] : null;
    if (aktiv.length > 1) befund('Seitenleiste', adresse, `${aktiv.length} aktive Einträge: ${aktiv.join(', ')}`);
    else if (soll === null && aktiv.length !== 0) befund('Seitenleiste', adresse, `${aktiv[0]} aktiv, erwartet keiner`);
    else if (soll !== null && ist !== soll) befund('Seitenleiste', adresse, `aktiv ${ist ?? 'keiner'}, erwartet ${soll}`);
    je.push({ adresse, aktiv });
  }
  messwerte.seitenleiste = { seiten: je.length };

  /* Ohne laufenden Abend führt „Abend führen" zum Einrichten; mit einem
     laufenden zur Uhr — und „Live-Session" zeigt Punkt und Blinds. */
  await gehe(seite, '#/session', 450);
  const ohne = await seite.evaluate(() => ({
    ziel: [...document.querySelectorAll('.sidebar .nav-link')].find((a) => a.textContent.includes('Abend führen'))?.getAttribute('href'),
    punkt: !!document.querySelector('.sidebar .nav-laeuft'),
  }));
  if (ohne.ziel !== '#/session/live/einrichten') befund('Seitenleiste', 'ohne Abend', `„Abend führen“ → ${ohne.ziel}`);
  if (ohne.punkt) befund('Seitenleiste', 'ohne Abend', 'zeigt „läuft“, obwohl kein Abend läuft');
  const k2 = await kontext(1366, 860);
  await k2.addInitScript(() => localStorage.setItem('pokermentor-session-laufend-v1', JSON.stringify({
    begonnen: Date.now() - 600000,
    spieler: [{ name: 'A', eingekauft: 3000, stand: null }, { name: 'B', eingekauft: 3000, stand: null }],
    startchips: 3000, stufen: [[25, 50], [50, 100]], stufendauer_s: 1200, stufe: 0, verbraucht_ms: 0, laeuft_seit: Date.now() - 600000,
  })));
  const s2 = await k2.newPage();
  await gehe(s2, '#/session', 600);
  const mit = await s2.evaluate(() => ({
    ziel: [...document.querySelectorAll('.sidebar .nav-link')].find((a) => a.textContent.includes('Abend führen'))?.getAttribute('href'),
    laeuft: document.querySelector('.sidebar .nav-laeuft')?.textContent?.replace(/\s+/g, ' ').trim() ?? null,
    aktiv: [...document.querySelectorAll('.sidebar .nav-link.active')].map((a) => a.getAttribute('href')),
  }));
  if (mit.ziel !== '#/session/live') befund('Seitenleiste', 'mit Abend', `„Abend führen“ → ${mit.ziel}`);
  if (!mit.laeuft || !/\d+\/\d+/.test(mit.laeuft)) befund('Seitenleiste', 'mit Abend', `kein Punkt mit Blinds (${mit.laeuft})`);
  if (mit.aktiv.length !== 1) befund('Seitenleiste', 'mit Abend', `${mit.aktiv.length} aktive Einträge`);
  messwerte.seitenleiste.laufenderAbend = mit;
  await k2.close();

  /* Fußzeile im Bild bei 860 und 768 Pixel Höhe. */
  const fuss = [];
  for (const h of [860, 768]) {
    await seite.setViewportSize({ width: 1366, height: h });
    for (const adresse of ['#/', '#/lernen', '#/session/live/einrichten']) {
      await gehe(seite, adresse, 450);
      const f = await seite.evaluate(() => {
        const foot = document.querySelector('.sidebar-footer');
        const r = foot.getBoundingClientRect();
        const legal = [...foot.querySelectorAll('a')].find((a) => a.getAttribute('href') === '#/rechtliches')?.getBoundingClientRect();
        const du = [...foot.querySelectorAll('a')].find((a) => a.getAttribute('href') === '#/profil')?.getBoundingClientRect();
        return { unten: Math.round(r.bottom), hoehe: innerHeight, legalUnten: legal ? Math.round(legal.bottom) : null,
          duOben: du ? Math.round(du.top) : null };
      });
      if (f.unten > f.hoehe + 1) befund('Seitenleiste', `${adresse} @${h}`, `Fußzeile endet bei ${f.unten}, Bild ${f.hoehe}`);
      if (f.legalUnten === null || f.legalUnten > f.hoehe) befund('Seitenleiste', `${adresse} @${h}`, '„Rechtliches“ nicht im Bild');
      if (f.duOben === null || f.duOben < 0) befund('Seitenleiste', `${adresse} @${h}`, '„Profil“ nicht im Bild');
      fuss.push({ adresse, hoehe: h, ...f });
    }
  }
  messwerte.fussleiste = fuss;
  await k.close();
}

/* ── 4: zentriert ──────────────────────────────────────────────────────── */
{
  const SEITEN = ['#/', '#/lernen', '#/lernen/m1', '#/lernen/m1/m1-l1', '#/lernen/drill', '#/lernen/trainer/preflop',
    '#/lernen/wiederholen', '#/lernen/uebungstisch', '#/nachschlagen', '#/nachschlagen/glossar',
    '#/nachschlagen/odds', '#/session', '#/session/bankroll', '#/profil', '#/freunde', '#/rechtliches'];
  const k = await kontext(1920, 1080);
  const seite = await k.newPage();
  const mess = [];
  for (const adresse of SEITEN) {
    await gehe(seite, adresse, 600);
    const m = await seite.evaluate(() => {
      const main = document.querySelector('main.main');
      const cs = getComputedStyle(main);
      const innen = main.getBoundingClientRect();
      const links = innen.left + parseFloat(cs.paddingLeft);
      const rechts = innen.right - parseFloat(cs.paddingRight);
      const kinder = [...main.children].filter((c) => c.getBoundingClientRect().height > 0);
      const w = kinder.map((c) => {
        const r = c.getBoundingClientRect();
        return { links: Math.round(r.left - links), rechts: Math.round(rechts - r.right), breite: Math.round(r.width) };
      });
      const sb = document.querySelector('.sidebar').getBoundingClientRect().right;
      const flaeche = { links: Math.round(Math.min(...kinder.map((c) => c.getBoundingClientRect().left)) - sb),
        rechts: Math.round(innerWidth - Math.max(...kinder.map((c) => c.getBoundingClientRect().right))) };
      return { w, flaeche, breite: main.dataset.breite };
    });
    const ungleich = Math.abs(m.flaeche.links - m.flaeche.rechts);
    if (ungleich > 3) befund('Zentrierung', adresse, `Rand links ${m.flaeche.links} px, rechts ${m.flaeche.rechts} px`);
    mess.push({ adresse, breite: m.breite, rand: m.flaeche });
  }
  messwerte.zentrierung = mess;

  /* Die Startseite hat bei 1920 zwei Spalten. */
  await gehe(seite, '#/', 600);
  const spalten = await seite.evaluate(() => {
    const links = document.querySelector('.start > .heute, .start > .start-einstieg.mittel');
    const rechts = document.querySelector('.start > .start-einstieg.gross');
    if (!links || !rechts) return null;
    return { linksX: Math.round(links.getBoundingClientRect().left), rechtsX: Math.round(rechts.getBoundingClientRect().left) };
  });
  if (!spalten || spalten.rechtsX <= spalten.linksX + 100) befund('Startseite', '1920', 'nicht zweispaltig');
  messwerte.startseite = spalten;
  await k.close();

  /* Und bei 820 (Tablet) steht sie einspaltig in der Mitte. */
  const t = await kontext(820, 1180);
  const ts = await t.newPage();
  await gehe(ts, '#/', 600);
  const tab = await ts.evaluate(() => {
    const s = document.querySelector('.start').getBoundingClientRect();
    return { links: Math.round(s.left), rechts: Math.round(innerWidth - s.right), breite: Math.round(s.width) };
  });
  if (Math.abs(tab.links - tab.rechts) > 3) befund('Zentrierung', 'Tablet #/', `${tab.links} / ${tab.rechts}`);
  if (tab.breite < 450) befund('Zentrierung', 'Tablet #/', `nur ${tab.breite} px breit`);
  messwerte.tablet = tab;
  await t.close();
}

/* ── Statusleiste in der Farbe der Seite ───────────────────────────────── */
{
  const hex = (rgb) => `#${rgb.match(/\d+/g).slice(0, 3).map((n) => Number(n).toString(16).padStart(2, '0')).join('')}`;
  const leiste = async (seite) => seite.evaluate(() => ({
    meta: document.querySelector('meta[name="theme-color"]')?.getAttribute('content') ?? null,
    grund: getComputedStyle(document.body).backgroundColor,
  }));
  const mess = {};
  for (const modus of ['dunkel', 'hell']) {
    const k = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'de-DE' });
    await k.addInitScript(([m]) => { localStorage.setItem('pokermentor-lang-v1', 'de'); localStorage.setItem('pokermentor-farbmodus-v1', m); }, [modus]);
    const seite = await k.newPage();
    await gehe(seite, '#/', 600);
    const l = await leiste(seite);
    if (!l.meta || l.meta.toLowerCase() !== hex(l.grund)) befund('Statusleiste', modus, `theme-color ${l.meta}, Seitengrund ${hex(l.grund)}`);
    mess[modus] = { meta: l.meta, grund: hex(l.grund) };
    if (modus === 'dunkel') {
      /* Umschalten in der App zieht die Leiste nach. */
      await gehe(seite, '#/profil', 600);
      await seite.getByRole('radio', { name: 'Hell' }).click();
      await seite.waitForTimeout(300);
      const nach = await leiste(seite);
      if (!nach.meta || nach.meta.toLowerCase() !== hex(nach.grund)) befund('Statusleiste', 'Umschalten', `theme-color ${nach.meta}, Seitengrund ${hex(nach.grund)}`);
      mess.umgeschaltet = { meta: nach.meta, grund: hex(nach.grund) };
    }
    await k.close();
  }
  messwerte.statusleiste = mess;
}

await browser.close();

const bericht = {
  geprueft_am: new Date().toISOString(),
  befunde_gesamt: befunde.length,
  je_bereich: befunde.reduce((a, b) => ({ ...a, [b.bereich]: (a[b.bereich] ?? 0) + 1 }), {}),
  messwerte,
  befunde: befunde.slice(0, 100),
};
writeFileSync('docs/rahmen.json', `${JSON.stringify(bericht, null, 2)}\n`);

console.log(`Rahmen geprüft: Kopfzeile, Scrollposition, Seitenleiste, Zentrierung, Meldung.`);
console.log(`Befunde: ${befunde.length}`);
for (const b of befunde.slice(0, 20)) console.log(`  [${b.bereich}] ${b.wo}: ${b.text}`);
if (befunde.length > 0) {
  console.error(`\n${befunde.length} Befunde — siehe docs/rahmen.json`);
  process.exitCode = 1;
}
