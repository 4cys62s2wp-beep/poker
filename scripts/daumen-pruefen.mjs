/**
 * Der Daumenlauf: Liegt das, was man tun soll, dort, wo der Daumen ist?
 * ====================================================================
 *
 * Was die anderen Läufe nicht sehen
 * ---------------------------------
 * `npm run pruefen` misst, ob eine Bedienfläche groß genug ist und ob sie
 * genug Kontrast hat. Beides kann stimmen, während der Knopf trotzdem falsch
 * sitzt: Eine 44 Pixel große Fläche in der Bildschirmmitte besteht jede
 * dieser Prüfungen und ist einhändig trotzdem schlecht zu treffen.
 *
 * DESIGN.md sagt seit Abschnitt 10: „Der Daumen erreicht die untere
 * Bildschirmhälfte, mehr nicht." Dieser Lauf misst genau das — und zwar nur
 * dort, wo es zutrifft.
 *
 * Wo es zutrifft
 * --------------
 * Nicht auf jedem Bildschirm. Ein Glossar liest man, ein Tabellenwerk schlägt
 * man nach; dort gibt es keine Entscheidung, die im Daumenbereich liegen
 * müsste. Gemessen wird deshalb an einer Auszeichnung im Quelltext: Jeder
 * Bildschirm, auf dem man antwortet oder entscheidet, trägt seine Knöpfe in
 * einem Element mit der Klasse `entscheidung`. Was diese Klasse trägt, wird
 * gemessen; was sie nicht trägt, gilt als Lesebildschirm.
 *
 * Das ist bewusst eine Auszeichnung und keine Heuristik: Eine Regel, die
 * „irgendwie erkennt", ob ein Knopf wichtig ist, erkennt beim nächsten
 * Bildschirm etwas anderes. Wer eine Entscheidungsleiste baut, sagt es.
 *
 * Aufruf:
 *
 *   npm run build && npx vite preview --port 4173 &
 *   node scripts/daumen-pruefen.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const GRUND = process.env.WEGE_GRUND ?? 'http://127.0.0.1:4173';
const BREITE = 390;
const HOEHE = 844;

/** Ab welchem Anteil der Bildschirmhöhe der Daumenbereich beginnt.
 *
 *  Die Hälfte, nicht zwei Drittel: DESIGN.md, Abschnitt 10, sagt „untere
 *  Bildschirmhälfte". Die Zahl steht hier und in DESIGN.md, sonst nirgends. */
const DAUMEN_AB = 0.5;

const wege = JSON.parse(readFileSync('docs/wege.json', 'utf8'));
/* ALLE Adressen, nicht nur die Lektionen.
 *
 * Bis E-039 stand hier `filter((w) => w.inhalt)` — und `inhalt: true`
 * bedeutet in `wege.json` „ist eine Lektion", nicht „ist ein Bildschirm".
 * Der Lauf meldete brav „49 Bildschirme geprüft" und hatte dabei keinen
 * einzigen Trainer gesehen, keine Startseite, keinen Tisch. Zwei Jahre
 * Prüfprotokoll über den immer gleichen Seitentyp.
 *
 * Die Lehre steht in DESIGN.md 9.1: Eine Prüfung, die eine Zahl meldet,
 * muss auch sagen, worüber. „49 Bildschirme" klang nach allen. */
const bildschirme = wege.wege.map((w) => w.hash);

const browser = await chromium.launch();
const kontext = await browser.newContext({
  viewport: { width: BREITE, height: HOEHE }, locale: 'de-DE',
});
await kontext.addInitScript(() => {
  localStorage.setItem('pokermentor-lang-v1', 'de');
  localStorage.setItem('pokermentor-farbmodus-v1', 'dunkel');
});
const seite = await kontext.newPage();

const messungen = [];
for (const hash of bildschirme) {
  await seite.goto(`${GRUND}/${hash}`, { waitUntil: 'domcontentloaded' });
  await seite.waitForTimeout(450);
  const m = await seite.evaluate(([daumenAb]) => {
    const fenster = window.innerHeight;
    const grenze = fenster * daumenAb;
    const sichtbar = (el) => {
      const r = el.getBoundingClientRect();
      const st = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && st.visibility !== 'hidden' && st.display !== 'none';
    };
    const leisten = [...document.querySelectorAll('.entscheidung')].filter(sichtbar);
    return {
      scrollt: document.documentElement.scrollHeight > fenster + 1,
      ueberlauf_px: Math.max(0, document.documentElement.scrollHeight - fenster),
      fensterhoehe: fenster,
      grenze_px: Math.round(grenze),
      /* Eine Entscheidungsleiste je Bildschirm. Zwei wären zwei Angebote,
         und dann ist keines das Hauptangebot. */
      leisten: leisten.length,
      leiste: leisten.length === 0 ? null : (() => {
        const el = leisten[0];
        const r = el.getBoundingClientRect();
        const knoepfe = [...el.querySelectorAll('button, a[href]')].filter(sichtbar);
        return {
          oben_px: Math.round(r.top),
          unten_px: Math.round(r.bottom),
          mitte_px: Math.round(r.top + r.height / 2),
          /* Im Daumenbereich heißt: Die Mitte der Leiste liegt unterhalb
             der Grenze — nicht nur ihr unterer Rand. Eine Leiste, die von
             oben bis knapp über die Mitte reicht, ist keine. */
          im_daumenbereich: r.top + r.height / 2 >= grenze,
          /* Und sie muss zu sehen sein, ohne zu scrollen. */
          ohne_scrollen: r.bottom <= fenster,
          knoepfe: knoepfe.length,
          /* Klebt sie? Eine klebende Leiste bleibt auch dann erreichbar,
             wenn die Seite länger ist als der Bildschirm — und manche
             Aufgaben sind nun einmal länger als andere. */
          klebt: getComputedStyle(el).position === 'sticky',
          kleinster_knopf_px: knoepfe.length === 0 ? 0
            : Math.round(Math.min(...knoepfe.map((k) => k.getBoundingClientRect().height))),
          /* Volle Breite: Ein Knopf, der die Zeile teilt, ist am Rand
             schlechter zu treffen als einer, der sie füllt. Gemessen als
             Anteil der Leistenbreite, den die Knöpfe zusammen einnehmen. */
          breitenanteil: r.width === 0 ? 0 : Math.round(
            (knoepfe.reduce((n, k) => n + k.getBoundingClientRect().width, 0) / r.width) * 100,
          ) / 100,
        };
      })(),
    };
  }, [DAUMEN_AB]);
  messungen.push({ hash, ...m });
}

await browser.close();

const mitLeiste = messungen.filter((m) => m.leiste);
const befunde = [];
for (const m of mitLeiste) {
  if (m.leisten > 1) {
    befunde.push({ hash: m.hash, art: 'mehr-als-eine-entscheidungsleiste', wert: m.leisten });
  }
  if (!m.leiste.im_daumenbereich) {
    befunde.push({
      hash: m.hash, art: 'entscheidung-nicht-im-daumenbereich',
      wert: m.leiste.mitte_px, grenze: m.grenze_px,
    });
  }
  if (!m.leiste.ohne_scrollen) {
    befunde.push({
      hash: m.hash, art: 'entscheidung-nur-nach-scrollen', wert: m.leiste.unten_px,
    });
  }
}
/* Scrollen allein ist kein Befund.
   ------------------------------
   Erst hieß die Regel „ein Entscheidungsbildschirm scrollt nicht". Sie
   meldete zwei Trainer — und beim nächsten Lauf andere Zahlen, weil die
   Aufgaben zufällig gezogen werden und manche länger sind als andere. Eine
   Regel, deren Ergebnis vom Zufall abhängt, prüft nichts.

   Was wirklich zählt: Bleibt die Entscheidung erreichbar? Eine klebende
   Leiste leistet das auch auf einer langen Seite. Eine mitscrollende nicht —
   und genau die ist der Fehler. */
for (const m of mitLeiste) {
  if (m.scrollt && !m.leiste.klebt) {
    befunde.push({ hash: m.hash, art: 'lange-seite-ohne-klebende-leiste', wert: m.ueberlauf_px });
  }
}

const ausgabe = {
  geprueft_am: new Date().toISOString(),
  breite: BREITE,
  hoehe: HOEHE,
  daumen_ab: DAUMEN_AB,
  bildschirme: messungen.length,
  mit_entscheidung: mitLeiste.length,
  befunde,
  messungen,
};
writeFileSync('docs/daumen.json', `${JSON.stringify(ausgabe, null, 2)}\n`);

console.log(`${messungen.length} Bildschirme, davon ${mitLeiste.length} mit Entscheidungsleiste.`);
console.log(`Befunde: ${befunde.length}`);
for (const b of befunde) console.log(`  ${b.hash}: ${b.art} (${b.wert}${b.grenze ? ` / Grenze ${b.grenze}` : ''})`);
