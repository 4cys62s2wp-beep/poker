/**
 * Das Designfundament am gerenderten Ergebnis prüfen.
 *
 * Die Sperrklinke in `npm run streuung` zählt verstreute Werte im Quelltext.
 * Sie kann zwei Dinge nicht sehen, und beide entscheiden darüber, ob jemand
 * die App am Tisch bedienen kann:
 *
 *   1. **Kontrast.** Im Quelltext steht `color: var(--text-dim)`. Ob das
 *      lesbar ist, hängt davon ab, worauf es liegt — und das steht in einer
 *      ganz anderen Datei, oft zwei Ebenen weiter oben.
 *   2. **Tippflächen.** Im Quelltext steht `min-height: var(--tipp-min)`.
 *      Ob der Knopf am Ende 44 Pixel hoch ist, entscheidet die Zeile, in der
 *      er steht.
 *
 * Also wird beides an der laufenden App gemessen, bei 390 Pixel Breite, über
 * alle Bildschirme aus `docs/wege.json`. Ergebnis nach `docs/pruefung.json`.
 *
 * Das ist eine Bestandsaufnahme, keine Reparatur. Was sie findet, ist eine
 * Liste — und eine Sperrklinke, damit sie nicht länger wird.
 *
 * Aufruf:
 *
 *   npm run build && npx http-server dist -p 4173 -s &
 *   node scripts/design-pruefen.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const GRUND = process.env.WEGE_GRUND ?? 'http://127.0.0.1:4173';
const BREITE = 390;
const HOEHE = 844;

/* Die Grenzwerte stehen in src/lib/design/kontrast.ts und global.css. Hier
   stehen sie ein zweites Mal, weil dieses Skript im Browser läuft und kein
   Modul der App laden kann; der Test vergleicht beide Stellen. */
const KONTRAST_ERGEBNIS = 7;
const KONTRAST_UEBRIG = 4.5;
const TIPP_MIN = 44;
/** Ab dieser Schriftgröße gilt ein Text als Ergebniszahl im Sinne der Regel. */
const ERGEBNIS_AB_PX = 40;

const wege = JSON.parse(readFileSync('docs/wege.json', 'utf8'));
const bildschirme = wege.wege.filter((w) => w.inhalt).map((w) => w.hash);

const browser = await chromium.launch();
const kontext = await browser.newContext({ viewport: { width: BREITE, height: HOEHE }, locale: 'de-DE' });
await kontext.addInitScript(() => localStorage.setItem('pokermentor-lang-v1', 'de'));
const seite = await kontext.newPage();

const befunde = [];
const geprueft = [];

for (const hash of bildschirme) {
  await seite.goto(`${GRUND}/${hash}`, { waitUntil: 'domcontentloaded' });
  await seite.waitForTimeout(320);

  const messung = await seite.evaluate(
    ([grenzErgebnis, grenzUebrig, tippMin, ergebnisAb]) => {
      /* ---- WCAG, dieselbe Formel wie in src/lib/design/kontrast.ts ---- */
      const anteile = (rgb) => rgb.map((x) => {
        const v = x / 255;
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      });
      const helligkeit = (rgb) => {
        const [r, g, b] = anteile(rgb);
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };
      const kontrast = (a, b) => {
        const [hell, dunkel] = [helligkeit(a), helligkeit(b)].sort((x, y) => y - x);
        return (hell + 0.05) / (dunkel + 0.05);
      };
      const alsZahlen = (farbe) => {
        const m = farbe.match(/rgba?\(([^)]+)\)/);
        if (!m) return null;
        const t = m[1].split(/[,/]/).map((x) => parseFloat(x));
        return { rgb: [t[0], t[1], t[2]], alpha: t.length > 3 ? t[3] : 1 };
      };

      /** Zwei Farben übereinanderlegen: `oben` mit `alpha` auf `unten`. */
      const legeAuf = (oben, alpha, unten) => unten.map(
        (u, i) => oben[i] * alpha + u * (1 - alpha),
      );

      /** Alle Farbstopps eines Verlaufs, in der Reihenfolge ihres Auftretens. */
      const stopps = (bild) => [...bild.matchAll(/rgba?\(([^)]+)\)/g)]
        .map((m) => alsZahlen(m[0])).filter(Boolean);

      /**
       * Die möglichen Gründe, auf denen ein Element wirklich liegt.
       *
       * Ein Verlauf hat keine Farbe, sondern viele. Statt ihn für „nicht
       * messbar" zu erklären, werden seine Farbstopps einzeln auf den
       * darunterliegenden Grund gelegt und **der ungünstigste** genommen.
       * Das ist strenger als die Wirklichkeit — wo genau ein Wort auf dem
       * Verlauf sitzt, entscheidet die Zeilenumbrechung — und Strenge ist
       * hier die richtige Richtung: Ein Befund zu viel kostet eine Prüfung,
       * ein Befund zu wenig kostet Lesbarkeit.
       */
      const gruende = (el) => {
        const schichten = [];          // von oben nach unten
        let k = el;
        let basis = null;
        while (k) {
          const st = getComputedStyle(k);
          if (st.backgroundImage && st.backgroundImage !== 'none') {
            const s = stopps(st.backgroundImage);
            if (s.length) schichten.push({ typ: 'bild', stopps: s });
          }
          const f = alsZahlen(st.backgroundColor);
          if (f && f.alpha >= 0.999) { basis = f.rgb; break; }
          if (f && f.alpha > 0) schichten.push({ typ: 'farbe', rgb: f.rgb, alpha: f.alpha });
          k = k.parentElement;
        }
        if (!basis) {
          const b = alsZahlen(getComputedStyle(document.body).backgroundColor);
          basis = b && b.alpha >= 0.999 ? b.rgb : [0, 0, 0];
        }

        /* Von unten nach oben zusammenlegen. Die Zahl der Möglichkeiten wird
           begrenzt, indem nach jeder Schicht nur die hellste und die
           dunkelste behalten wird — die ungünstigste liegt immer unter
           diesen beiden. */
        let moeglich = [basis];
        for (const schicht of schichten.reverse()) {
          const naechste = [];
          for (const unten of moeglich) {
            if (schicht.typ === 'farbe') {
              naechste.push(legeAuf(schicht.rgb, schicht.alpha, unten));
            } else {
              for (const s of schicht.stopps) naechste.push(legeAuf(s.rgb, s.alpha, unten));
            }
          }
          naechste.sort((a, b) => helligkeit(a) - helligkeit(b));
          moeglich = naechste.length > 2
            ? [naechste[0], naechste[naechste.length - 1]]
            : naechste;
        }
        return { moeglich, verlauf: schichten.some((s) => s.typ === 'bild') };
      };

      const sichtbar = (el) => {
        const r = el.getBoundingClientRect();
        const st = getComputedStyle(el);
        return r.width > 0 && r.height > 0
          && st.visibility !== 'hidden' && st.display !== 'none' && st.opacity !== '0';
      };

      const wegMarke = (el) => {
        const teile = [];
        let k = el;
        for (let i = 0; k && i < 3; i += 1) {
          teile.unshift(k.tagName.toLowerCase()
            + (typeof k.className === 'string' && k.className ? `.${k.className.trim().split(/\s+/).join('.')}` : ''));
          k = k.parentElement;
        }
        return teile.join(' > ');
      };

      const gefunden = [];

      /* ---- Kontrast jedes Textes ---------------------------------------- */
      for (const el of document.querySelectorAll('body *')) {
        if (!sichtbar(el)) continue;
        const eigen = [...el.childNodes]
          .filter((n) => n.nodeType === Node.TEXT_NODE)
          .map((n) => n.textContent.trim()).join('');
        if (!eigen) continue;

        const st = getComputedStyle(el);
        const vorn = alsZahlen(st.color);
        if (!vorn || vorn.alpha < 0.95) continue;   // halbdurchsichtige Schrift: eigener Fall
        const { moeglich, verlauf } = gruende(el);
        const groesse = parseFloat(st.fontSize);
        let schlechtester = null;
        let v = Infinity;
        for (const grund of moeglich) {
          const w = kontrast(vorn.rgb, grund);
          if (w < v) { v = w; schlechtester = grund; }
        }
        const noetig = groesse >= ergebnisAb ? grenzErgebnis : grenzUebrig;
        if (v < noetig) {
          gefunden.push({
            art: 'kontrast-zu-gering',
            marke: wegMarke(el),
            text: eigen.slice(0, 40),
            schriftgroesse_px: Math.round(groesse * 10) / 10,
            verhaeltnis: Math.round(v * 100) / 100,
            noetig,
            vordergrund: st.color,
            grund: `rgb(${schlechtester.map((x) => Math.round(x)).join(', ')})`,
            ueber_verlauf: verlauf,
          });
        }
      }

      /* ---- Tippflächen -------------------------------------------------- */
      for (const el of document.querySelectorAll('button, a[href], input, select, textarea, [role="button"]')) {
        if (!sichtbar(el)) continue;
        const r = el.getBoundingClientRect();
        /* Ein Link im Fließtext ist keine Bedienfläche, sondern Text — er
           wird nach seiner Zeilenhöhe beurteilt und nicht nach 44 Pixeln. */
        const imFliesstext = el.tagName === 'A'
          && el.parentElement
          && ['P', 'LI', 'SPAN', 'STRONG', 'EM'].includes(el.parentElement.tagName);
        if (imFliesstext) continue;
        if (r.height < tippMin - 0.5 || r.width < tippMin - 0.5) {
          gefunden.push({
            art: 'tippflaeche-zu-klein',
            marke: wegMarke(el),
            text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 40),
            breite_px: Math.round(r.width),
            hoehe_px: Math.round(r.height),
          });
        }
      }

      return {
        befunde: gefunden,
        seitlicher_ueberlauf_px: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
      };
    },
    [KONTRAST_ERGEBNIS, KONTRAST_UEBRIG, TIPP_MIN, ERGEBNIS_AB_PX],
  );

  if (messung.seitlicher_ueberlauf_px > 0) {
    messung.befunde.push({
      art: 'seitlicher-ueberlauf',
      marke: 'html',
      text: '',
      ueberlauf_px: messung.seitlicher_ueberlauf_px,
    });
  }

  geprueft.push(hash);
  for (const b of messung.befunde) befunde.push({ bildschirm: hash, ...b });
}

await browser.close();

/** Gleiche Befunde auf verschiedenen Bildschirmen sind ein Fehler, nicht
 *  zwanzig: Die Stelle im Stilblatt ist dieselbe. */
const nachArt = new Map();
for (const b of befunde) {
  const schluessel = `${b.art} · ${b.marke}`;
  const eintrag = nachArt.get(schluessel)
    ?? { art: b.art, marke: b.marke, bildschirme: [], beispiel: b };
  eintrag.bildschirme.push(b.bildschirm);
  nachArt.set(schluessel, eintrag);
}
const stellen = [...nachArt.values()].sort((a, b) => b.bildschirme.length - a.bildschirme.length);

const ergebnis = {
  geprueft_am: new Date().toISOString(),
  breite: BREITE,
  grenzwerte: {
    kontrast_ergebnis: KONTRAST_ERGEBNIS,
    kontrast_uebrig: KONTRAST_UEBRIG,
    ergebnis_ab_px: ERGEBNIS_AB_PX,
    tipp_min_px: TIPP_MIN,
  },
  bildschirme: geprueft.length,
  befunde_gesamt: befunde.length,
  stellen_gesamt: stellen.length,
  je_art: [...befunde.reduce((m, b) => m.set(b.art, (m.get(b.art) ?? 0) + 1), new Map())]
    .map(([art, anzahl]) => ({ art, anzahl })).sort((a, b) => b.anzahl - a.anzahl),
  stellen,
};

writeFileSync('docs/pruefung.json', `${JSON.stringify(ergebnis, null, 2)}\n`, 'utf-8');

console.log(`${geprueft.length} Bildschirme geprüft, ${befunde.length} Befunde an ${stellen.length} Stellen.`);
for (const a of ergebnis.je_art) console.log(`  ${String(a.anzahl).padStart(4)}  ${a.art}`);
console.log('\nDie zehn häufigsten Stellen:');
for (const s of stellen.slice(0, 10)) {
  const b = s.beispiel;
  const zusatz = s.art === 'kontrast-zu-gering' ? ` (${b.verhaeltnis} statt ${b.noetig})`
    : s.art === 'tippflaeche-zu-klein' ? ` (${b.breite_px}×${b.hoehe_px})` : '';
  console.log(`  ${String(s.bildschirme.length).padStart(3)}×  ${s.marke}${zusatz}`);
}
