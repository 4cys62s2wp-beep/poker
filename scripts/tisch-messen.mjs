/**
 * Das Tischgerät am gerenderten Ergebnis messen — nicht am Quelltext.
 *
 * Die Regel aus dem Auftrag lautet: Das Gerät in der Tischmitte zeigt
 * **höchstens drei Angaben**, in einer Schrift, die aus zwei Metern lesbar
 * ist. Beides lässt sich nicht behaupten, sondern nur messen: Wie viele
 * Elemente mit Zahlen stehen wirklich da? Wie groß ist die Schrift wirklich,
 * nachdem `clamp()` und die Fensterbreite mitgeredet haben?
 *
 * Gemessen wird bei zwei Breiten, weil beide Geräte vorkommen: ein Handy
 * (390 px) und ein Tablet quer (1024 px). Die Regel muss auf beiden gelten.
 *
 * Zwei Meter Leseabstand
 * ----------------------
 * Ein Zeichen ist bequem lesbar, wenn es unter einem Sehwinkel von rund
 * 0,3 Grad erscheint (das entspricht etwa der doppelten Größe der
 * Sehschärfe-Schwelle von 5 Bogenminuten, wie sie Schriftgrößen-Normen für
 * Fernlesbarkeit zugrunde legen). Bei 2 m Abstand sind das
 *
 *   2000 mm × tan(0,3°) ≈ 10,5 mm Zeichenhöhe.
 *
 * Die Zeichenhöhe (Versalhöhe) beträgt bei üblichen Schriften rund 70 % der
 * Schriftgröße, also braucht es etwa 15 mm Schriftgröße. Ein CSS-Pixel ist
 * per Definition 1/96 Zoll = 0,2646 mm, also
 *
 *   15 mm ÷ 0,2646 mm ≈ 57 CSS-Pixel.
 *
 * Diese Zahl steht nicht im Skript, sie wird unten ausgerechnet und
 * mitgeschrieben — wer sie anzweifelt, sieht die Rechnung.
 *
 * Ergebnis nach `docs/tisch.json`. Aufruf:
 *
 *   npm run build && npx http-server dist -p 4173 -s &
 *   node scripts/tisch-messen.mjs
 */
import { writeFileSync } from 'node:fs';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const GRUND = process.env.WEGE_GRUND ?? 'http://127.0.0.1:4173';

/** Die beiden Geräte, die tatsächlich in der Tischmitte liegen. */
const GERAETE = [
  { name: 'handy', breite: 390, hoehe: 844 },
  { name: 'tablet-quer', breite: 1024, hoehe: 768 },
];

/* --- Der Leseabstand, ausgerechnet statt hingeschrieben ------------------ */
const ABSTAND_MM = 2000;
const SEHWINKEL_GRAD = 0.3;
const VERSALHOEHE_ANTEIL = 0.7;
const MM_JE_CSS_PIXEL = 25.4 / 96;

const zeichenhoehe_mm = ABSTAND_MM * Math.tan((SEHWINKEL_GRAD * Math.PI) / 180);
const noetige_schriftgroesse_px = zeichenhoehe_mm / VERSALHOEHE_ANTEIL / MM_JE_CSS_PIXEL;

/** Ein laufender Abend, in den Gerätespeicher gelegt. Ohne ihn zeigt der
 *  Bildschirm den leeren Zustand, und gemessen wäre nichts. */
const ABEND = {
  begonnen: 1770000000000,
  spieler: [
    { name: 'Lorenz', eingekauft: 3000, stand: 3000 },
    { name: 'Mira', eingekauft: 3000, stand: 3000 },
    { name: 'Jonas', eingekauft: 3000, stand: 3000 },
    { name: 'Ada', eingekauft: 3000, stand: 3000 },
    { name: 'Ben', eingekauft: 3000, stand: null },
  ],
  startchips: 3000,
  stufen: [[25, 50], [50, 100], [75, 150], [100, 200], [150, 300], [200, 400]],
  stufendauer_s: 1200,
  stufe: 0,
  verbraucht_ms: 0,
  laeuft_seit: null,        // angehalten: sonst piept die Messung sich durch
};

const browser = await chromium.launch();
const messungen = [];

for (const geraet of GERAETE) {
  const kontext = await browser.newContext({
    viewport: { width: geraet.breite, height: geraet.hoehe },
    /* Ein deutsches Gerät. Ohne diese Angabe misst der Lauf die englische
       Fassung, und die Zeilen sind dort anders lang. */
    locale: 'de-DE',
  });
  /* Vor dem ersten Skript der Seite, nicht danach: Die App liest die Sprache
     beim Start einmal. Wer sie erst nach dem Laden hineinschreibt, misst den
     Bildschirm in der Sprache, die der Browser vorgeschlagen hat. */
  await kontext.addInitScript(([abend]) => {
    localStorage.setItem('pokermentor-lang-v1', 'de');
    localStorage.setItem('pokermentor-session-laufend-v1', JSON.stringify(abend));
  }, [ABEND]);
  const seite = await kontext.newPage();

  await seite.goto(`${GRUND}/#/session/live`, { waitUntil: 'domcontentloaded' });
  await seite.waitForTimeout(400);

  const messung = await seite.evaluate(() => {
    const sichtbar = (el) => {
      const r = el.getBoundingClientRect();
      const st = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && st.visibility !== 'hidden' && st.opacity !== '0';
    };
    /* Blattelemente: die, die selbst Text tragen und keinen Text-tragenden
       Nachkommen haben. Nur sie sind „eine Angabe"; ein Container zählt
       sonst den Text seiner Kinder ein zweites Mal. */
    const blaetter = [...document.querySelectorAll('.tisch *')].filter((el) => {
      if (!sichtbar(el)) return false;
      const eigen = [...el.childNodes]
        .filter((n) => n.nodeType === Node.TEXT_NODE)
        .map((n) => n.textContent.trim())
        .join('');
      return eigen.length > 0;
    });

    const beschreibe = (el) => {
      const st = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        text: el.textContent.trim(),
        klasse: el.className || el.tagName.toLowerCase(),
        schriftgroesse_px: Math.round(parseFloat(st.fontSize) * 10) / 10,
        fett: st.fontWeight,
        ziffern: st.fontVariantNumeric,
        oben_px: Math.round(r.top),
        hoehe_px: Math.round(r.height),
        breite_px: Math.round(r.width),
      };
    };

    const alle = blaetter.map(beschreibe);
    /* Eine „Angabe" ist ein Element, dessen eigener Text eine Zahl enthält.
       Beschriftungen wie „Blinds" sind Bezeichner, keine Angaben. */
    const mitZahl = alle.filter((e) => /\d/.test(e.text));

    const knoepfe = [...document.querySelectorAll('.tisch button, .tisch a')]
      .filter(sichtbar)
      .map((el) => {
        const r = el.getBoundingClientRect();
        return {
          text: el.textContent.trim(),
          breite_px: Math.round(r.width),
          hoehe_px: Math.round(r.height),
          unterkante_abstand_px: Math.round(window.innerHeight - r.bottom),
        };
      });

    return {
      fensterhoehe_px: window.innerHeight,
      navigationsleiste_vorhanden: !!document.querySelector('nav'),
      grund_farbe: getComputedStyle(document.body).backgroundColor,
      alle_texte: alle,
      angaben: mitZahl,
      knoepfe,
      seitlicher_ueberlauf_px: Math.max(
        0, document.documentElement.scrollWidth - window.innerWidth,
      ),
      /* Abgeschnitten ist schlimmer als klein: Eine Zahl, die halb unter dem
         Rand steht, liest niemand — und auf dem Tischgerät scrollt niemand. */
      mitte_ueberlauf_px: (() => {
        const m = document.querySelector('.tisch-mitte');
        return m ? Math.max(0, m.scrollHeight - m.clientHeight) : 0;
      })(),
    };
  });

  messungen.push({ geraet: geraet.name, breite: geraet.breite, ...messung });
  await kontext.close();
}

await browser.close();

const groesste = Math.max(...messungen.map(
  (m) => Math.max(...m.angaben.map((a) => a.schriftgroesse_px)),
));

const ergebnis = {
  erzeugt_am: new Date().toISOString(),
  leseabstand: {
    abstand_mm: ABSTAND_MM,
    sehwinkel_grad: SEHWINKEL_GRAD,
    versalhoehe_anteil: VERSALHOEHE_ANTEIL,
    zeichenhoehe_mm: Math.round(zeichenhoehe_mm * 100) / 100,
    noetige_schriftgroesse_px: Math.round(noetige_schriftgroesse_px * 10) / 10,
    rechenweg: 'Zeichenhöhe = Abstand × tan(Sehwinkel); Schriftgröße = '
      + 'Zeichenhöhe ÷ Versalhöhen-Anteil ÷ (25,4/96) mm je CSS-Pixel',
  },
  groesste_angabe_px: groesste,
  messungen,
};

writeFileSync('docs/tisch.json', `${JSON.stringify(ergebnis, null, 2)}\n`, 'utf-8');

for (const m of messungen) {
  console.log(`${m.geraet} (${m.breite} px): ${m.angaben.length} Angaben mit Zahlen, `
    + `größte Schrift ${Math.max(...m.angaben.map((a) => a.schriftgroesse_px))} px, `
    + `Navigationsleiste: ${m.navigationsleiste_vorhanden ? 'ja' : 'nein'}, `
    + `Überlauf ${m.mitte_ueberlauf_px} px seitlich ${m.seitlicher_ueberlauf_px} px`);
  for (const a of m.angaben) console.log(`    ${a.schriftgroesse_px.toString().padStart(6)} px  ${a.text}`);
}
console.log(`\nNötig für zwei Meter Leseabstand: ${ergebnis.leseabstand.noetige_schriftgroesse_px} px`);
