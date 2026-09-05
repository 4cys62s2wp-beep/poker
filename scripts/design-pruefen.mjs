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
/** Mindestabstand zwischen zwei Bedienflächen. Steht als `--tipp-abstand`
 *  in global.css; der Test vergleicht beide Stellen. */
const TIPP_ABSTAND = 8;
/** Ab dieser Schriftgröße gilt ein Text als Ergebniszahl im Sinne der Regel. */
const ERGEBNIS_AB_PX = 40;

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
const bildschirme = wege.wege.map((w) => ({ id: w.hash, hash: w.hash }));

/* Und die Bildschirme, die hinter einem Klick liegen.
 *
 * `wege.json` kennt Adressen. Der Übungstisch hat unter seiner Adresse aber
 * zwei Bildschirme: die Auswahl der Tischgröße — und den Tisch selbst, auf
 * dem gespielt wird. Der Lauf sah bis E-041 nur die Auswahl und meldete
 * trotzdem „90 Bildschirme geprüft".
 *
 * Was das gekostet hat, stand danach im hellen Modus auf dem Filz: Namen
 * der Gegner in Anthrazit auf Dunkelgrün, gemessen unter 2 zu 1. Dieselbe
 * Lehre wie in E-039 (DESIGN.md 9.1), nur eine Ebene tiefer: Eine Prüfung,
 * die eine Zahl meldet, muss auch sagen, worüber — und „alle Adressen" ist
 * nicht dasselbe wie „alles, was man zu sehen bekommt".
 *
 * Die Liste ist absichtlich kurz und namentlich: Jeder Eintrag kostet einen
 * Klickpfad, der brechen kann. Wer einen hinzufügt, soll ihn begründen. */
const HINTER_EINEM_KLICK = [
  {
    id: '#/lernen/uebungstisch · Tisch mit sechs Plätzen',
    hash: '#/lernen/uebungstisch',
    async oeffnen(seite) {
      await seite.locator('.card.clickable').filter({ hasText: /6-max/ }).first().click();
      await seite.waitForSelector('.filz');
      /* Warten, bis der Held am Zug ist: Dann steht der Tisch vollständig,
         mit Einsätzen, Dealerknopf und einem Sitz, der gerade dran ist. */
      for (let i = 0; i < 40; i += 1) {
        if (await seite.locator('.entscheidung button').count() > 0) break;
        await seite.waitForTimeout(300);
      }
      await seite.waitForTimeout(200);
    },
  },
];

/* Beide Farbmodi, nicht nur der gerade eingestellte. Ein Lauf über den
   dunklen Satz sagt genau nichts über den hellen — und der helle ist der,
   den niemand von uns täglich sieht. Verstreute Farbwerte, die kein Token
   benutzen, fallen genau hier auf und nirgends sonst. */
const MODI = ['dunkel', 'hell'];

const browser = await chromium.launch();
const befunde = [];
const geprueft = [];

for (const modus of MODI) {
const kontext = await browser.newContext({ viewport: { width: BREITE, height: HOEHE }, locale: 'de-DE' });
await kontext.addInitScript(([m]) => {
  localStorage.setItem('pokermentor-lang-v1', 'de');
  localStorage.setItem('pokermentor-farbmodus-v1', m);
}, [modus]);
const seite = await kontext.newPage();

for (const bs of [...bildschirme, ...HINTER_EINEM_KLICK]) {
  await seite.goto(`${GRUND}/${bs.hash}`, { waitUntil: 'domcontentloaded' });
  await seite.waitForTimeout(320);
  if (bs.oeffnen) await bs.oeffnen(seite);

  const messung = await seite.evaluate(
    ([grenzErgebnis, grenzUebrig, tippMin, ergebnisAb, tippAbstand]) => {
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
       * Ein `background-image` in seine Ebenen zerlegen, oberste zuerst.
       *
       * Bis E-041 wurden alle Ebenen eines Elements zu einer Liste von
       * Farbstopps verrührt. Auf dem Filz stehen drei: zwei fast
       * durchsichtige Gewebemuster und darunter ein deckender Verlauf.
       * Verrührt ergab das „vielleicht liegt der Text auf einem 1,4 %
       * weißen Schleier über dem Seitenhintergrund" — und im hellen Modus
       * war der Seitenhintergrund fast weiß. Gemeldet wurden 1,25 zu 1 für
       * weiße Schrift, die in Wirklichkeit auf dunkelgrünem Filz steht.
       *
       * Ebenen einzeln zu betrachten heißt auch: Eine Ebene, deren Stopps
       * alle deckend sind, deckt. Unter ihr liegt nichts mehr, was den
       * Kontrast beeinflussen könnte — die Suche endet dort.
       */
      const ebenen = (bild) => {
        const teile = [];
        let tiefe = 0;
        let akt = '';
        for (const z of bild) {
          if (z === '(') tiefe += 1;
          if (z === ')') tiefe -= 1;
          if (z === ',' && tiefe === 0) { teile.push(akt); akt = ''; continue; }
          akt += z;
        }
        teile.push(akt);
        return teile.map((t) => t.trim()).filter(Boolean);
      };

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
        /* Deckkraft gehört zum Grund (E-041).
           ---------------------------------
           `opacity: 0.5` an einem Element blendet dessen ganzen Teilbaum
           gegen das, was dahinter liegt — Schrift und eigener Grund
           gleichermaßen. Wer nur `color` und `background-color` liest,
           misst eine Lesbarkeit, die es auf dem Bildschirm nicht gibt.

           Aufgefallen ist das am Übungstisch: Ein Gegner, der weggeworfen
           hat, wird auf halbe Deckkraft gesetzt. Sein Name stand danach bei
           2,4 zu 1 auf dem Filz — die alte Rechnung meldete 8,9.

           Die Kette wird deshalb erst gesammelt und dann von oben nach
           unten multipliziert: Was ein Vorfahre malt, wird nur von SEINEN
           Deckkräften gedämpft, nicht von denen seiner Kinder. */
        const kette = [];
        for (let k = el; k; k = k.parentElement) kette.push(k);
        const deck = new Array(kette.length);
        let bisher = 1;
        for (let i = kette.length - 1; i >= 0; i -= 1) {
          const o = parseFloat(getComputedStyle(kette[i]).opacity);
          bisher *= Number.isFinite(o) ? o : 1;
          deck[i] = bisher;
        }

        const schichten = [];          // von oben nach unten
        let unterste = null;           // die deckende Quelle: mögliche Farben
        let verlauf = false;
        suche:
        for (let i = 0; i < kette.length; i += 1) {
          const st = getComputedStyle(kette[i]);
          if (st.backgroundImage && st.backgroundImage !== 'none') {
            for (const lage of ebenen(st.backgroundImage)) {
              const s = stopps(lage);
              if (!s.length) continue;
              verlauf = true;
              if (deck[i] >= 0.999 && s.every((x) => x.alpha >= 0.999)) {
                unterste = s.map((x) => x.rgb);
                break suche;
              }
              schichten.push({ typ: 'bild', stopps: s, deckkraft: deck[i] });
            }
          }
          const f = alsZahlen(st.backgroundColor);
          if (f && f.alpha * deck[i] >= 0.999) { unterste = [f.rgb]; break; }
          if (f && f.alpha > 0) {
            schichten.push({ typ: 'farbe', rgb: f.rgb, alpha: f.alpha * deck[i] });
          }
        }
        if (!unterste) {
          const b = alsZahlen(getComputedStyle(document.body).backgroundColor);
          unterste = [b && b.alpha >= 0.999 ? b.rgb : [0, 0, 0]];
        }

        /* Von unten nach oben zusammenlegen. Die Zahl der Möglichkeiten wird
           begrenzt, indem nach jeder Schicht nur die hellste und die
           dunkelste behalten wird — die ungünstigste liegt immer unter
           diesen beiden. */
        let moeglich = unterste;
        for (const schicht of schichten.reverse()) {
          const naechste = [];
          for (const unten of moeglich) {
            if (schicht.typ === 'farbe') {
              naechste.push(legeAuf(schicht.rgb, schicht.alpha, unten));
            } else {
              for (const s of schicht.stopps) {
                naechste.push(legeAuf(s.rgb, s.alpha * schicht.deckkraft, unten));
              }
            }
          }
          naechste.sort((a, b) => helligkeit(a) - helligkeit(b));
          moeglich = naechste.length > 2
            ? [naechste[0], naechste[naechste.length - 1]]
            : naechste;
        }
        return { moeglich, verlauf, deckkraft: deck[0] };
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
        const { moeglich, verlauf, deckkraft } = gruende(el);
        const groesse = parseFloat(st.fontSize);
        let schlechtester = null;
        let v = Infinity;
        for (const grund of moeglich) {
          /* Die Schrift liegt mit der Deckkraft ihrer Gruppe auf dem Grund;
             bei voller Deckkraft ist das die Farbe selbst. */
          const gemalt = deckkraft >= 0.999
            ? vorn.rgb : legeAuf(vorn.rgb, vorn.alpha * deckkraft, grund);
          const w = kontrast(gemalt, grund);
          if (w < v) { v = w; schlechtester = grund; }
        }
        /* Ein Kartensymbol ist keine Ergebniszahl.
           ------------------------------------
           Die schärfere Grenze ab 40 Pixeln gilt Ergebniszahlen: der einen
           großen Zahl, wegen der man den Bildschirm aufgeschlagen hat. Das
           Symbol in der Mitte einer Spielkarte ist 52 Pixel groß und
           trotzdem keine: Es wiederholt nur, was in der Ecke schon steht.
           Rot auf Elfenbein ist die Farbe einer Spielkarte — auf 7 zu 1
           gedunkelt wäre es keine mehr.

           Die Bedingung, unter der die Ausnahme gilt (DESIGN.md 9.2): Was
           das Symbol sagt, sagt der Rang in der Ecke auch — und der wird
           nach der normalen Grenze gemessen, wie jeder andere Text. */
        const istKartensymbol = el.closest('.pcard') !== null;
        const noetig = groesse >= ergebnisAb && !istKartensymbol
          ? grenzErgebnis : grenzUebrig;
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
            deckkraft: Math.round(deckkraft * 100) / 100,
          });
        }
      }

      /* ---- Tippflächen --------------------------------------------------
         Ein Diagramm ist keine Bedienleiste.
         --------------------------------
         Die Starthand-Matrix hat 169 Felder. Bei einer Fingerbreite je Feld
         wäre sie 668 Pixel breit — auf einem 390 Pixel breiten Gerät also
         nicht mehr als Ganzes zu sehen, und als Ganzes gesehen zu werden
         ist ihr einziger Zweck: Man liest die Form, nicht die einzelne
         Zelle.

         Sie ist deshalb von der Größen- und Abstandsregel ausgenommen —
         aber nicht bedingungslos. Die Bedingung steht in DESIGN.md 9.2:
         **Was über ein Diagramm erreichbar ist, muss auch ohne erreichbar
         sein.** Im Starthand-Explorer leistet das die Auswahl daneben
         (E-039); wo eine Matrix nur zeigt und nichts auslöst, stellt sich
         die Frage nicht.

         Die Ausnahme gilt genau für dieses eine Bauteil und ist hier
         benannt, nicht in einer Liste von Selektoren versteckt. */
      const imDiagramm = (el) => el.closest('.matrix') !== null;

      const flaechen = [];
      for (const el of document.querySelectorAll('button, a[href], input, select, textarea, [role="button"]')) {
        if (!sichtbar(el)) continue;
        const r = el.getBoundingClientRect();
        /* Ein Link im Fließtext ist keine Bedienfläche, sondern Text — er
           wird nach seiner Zeilenhöhe beurteilt und nicht nach 44 Pixeln. */
        const imFliesstext = el.tagName === 'A'
          && el.parentElement
          && ['P', 'LI', 'SPAN', 'STRONG', 'EM'].includes(el.parentElement.tagName);
        if (imFliesstext) continue;
        if (imDiagramm(el)) continue;

        /* Was man wirklich antippt.
           ------------------------
           Ein Kontrollkästchen ist 14 × 22 Pixel groß, und daran ändert kein
           Stilblatt etwas — der Browser zeichnet es selbst. Bedient wird es
           trotzdem über die ganze Beschriftung: Ein Klick auf das `<label>`
           schaltet es. Gemessen wird deshalb die Fläche, die den Klick
           annimmt, und das ist bei einem eingefassten Bedienelement das
           Label. Seit E-039.

           Das ist keine Ausnahme, sondern die genauere Messung: Vorher
           meldete der Lauf ein Ziel als zu klein, das in Wahrheit eine
           Fingerbreite hoch ist. */
        const label = el.closest('label');
        const wirksam = label && label.contains(el) ? label.getBoundingClientRect() : r;
        flaechen.push({ el, r: wirksam });
        if (wirksam.height < tippMin - 0.5 || wirksam.width < tippMin - 0.5) {
          gefunden.push({
            art: 'tippflaeche-zu-klein',
            marke: wegMarke(el),
            text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 40),
            breite_px: Math.round(wirksam.width),
            hoehe_px: Math.round(wirksam.height),
          });
        }
      }

      /* ---- Abstand zwischen Bedienflächen -------------------------------
         Zwei Knöpfe, die sich berühren, sind ein Knopf mit zwei Bedeutungen.
         Verschachtelte Flächen (ein Knopf in einer Karte, die selbst ein Link
         ist) sind ein anderer Fall und werden hier nicht gezählt.

         Seit E-039 mit einer Bedingung: Der Abstand zählt nur, wenn
         mindestens eine der beiden Flächen unter der Mindestgröße liegt.

         Warum: Der Abstand ist kein Selbstzweck, er ist der Ausgleich für
         zu kleine Ziele. Zwei Flächen, die beide eine Fingerbreite messen,
         darf man aneinanderlegen — so ist jede Tastatur gebaut und jeder
         segmentierte Umschalter. Ohne diese Bedingung meldete der Lauf 2442
         Befunde, von denen keiner ein Fehlgriff war, und verdeckte damit
         die, die es waren. */
      for (let i = 0; i < flaechen.length; i += 1) {
        for (let j = i + 1; j < flaechen.length; j += 1) {
          const a = flaechen[i];
          const b = flaechen[j];
          if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
          const waagerecht = Math.max(a.r.left - b.r.right, b.r.left - a.r.right);
          const senkrecht = Math.max(a.r.top - b.r.bottom, b.r.top - a.r.bottom);
          /* Überlappen sie in beiden Richtungen, liegen sie übereinander —
             ein eigener Fall, kein Abstandsproblem. */
          if (waagerecht < 0 && senkrecht < 0) continue;
          const abstand = Math.max(waagerecht, senkrecht);
          const beideGross = a.r.width >= tippMin - 0.5 && a.r.height >= tippMin - 0.5
            && b.r.width >= tippMin - 0.5 && b.r.height >= tippMin - 0.5;
          if (abstand < tippAbstand - 0.5 && !beideGross) {
            gefunden.push({
              art: 'tippflaechen-zu-eng',
              marke: `${wegMarke(a.el)} ↔ ${wegMarke(b.el)}`,
              text: `${(a.el.textContent || '').trim().slice(0, 18)} ↔ ${(b.el.textContent || '').trim().slice(0, 18)}`,
              abstand_px: Math.round(abstand * 10) / 10,
            });
          }
        }
      }

      return {
        befunde: gefunden,
        seitlicher_ueberlauf_px: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
      };
    },
    [KONTRAST_ERGEBNIS, KONTRAST_UEBRIG, TIPP_MIN, ERGEBNIS_AB_PX, TIPP_ABSTAND],
  );

  if (messung.seitlicher_ueberlauf_px > 0) {
    messung.befunde.push({
      art: 'seitlicher-ueberlauf',
      marke: 'html',
      text: '',
      ueberlauf_px: messung.seitlicher_ueberlauf_px,
    });
  }

  geprueft.push(`${modus}:${bs.id}`);
  for (const b of messung.befunde) befunde.push({ modus, bildschirm: bs.id, ...b });
}

await kontext.close();
}

await browser.close();

/** Gleiche Befunde auf verschiedenen Bildschirmen sind ein Fehler, nicht
 *  zwanzig: Die Stelle im Stilblatt ist dieselbe. */
const nachArt = new Map();
for (const b of befunde) {
  const schluessel = `${b.modus} · ${b.art} · ${b.marke}`;
  const eintrag = nachArt.get(schluessel)
    ?? { modus: b.modus, art: b.art, marke: b.marke, bildschirme: [], beispiel: b };
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
    tipp_abstand_px: TIPP_ABSTAND,
  },
  modi: MODI,
  /* Nicht nur wie viele, sondern welche. Eine Zahl kann stimmen und trotzdem
     den falschen Ausschnitt meinen (E-039, DESIGN.md 9.1) — die Liste kann
     das nicht: Der Test hält jede Adresse aus wege.json dagegen. */
  bildschirme_liste: [...new Set(geprueft.map((g) => g.slice(g.indexOf(':') + 1)))],
  bildschirme: geprueft.length / MODI.length,
  messungen: geprueft.length,
  befunde_gesamt: befunde.length,
  stellen_gesamt: stellen.length,
  je_art: [...befunde.reduce((m, b) => m.set(b.art, (m.get(b.art) ?? 0) + 1), new Map())]
    .map(([art, anzahl]) => ({ art, anzahl })).sort((a, b) => b.anzahl - a.anzahl),
  stellen,
};

writeFileSync('docs/pruefung.json', `${JSON.stringify(ergebnis, null, 2)}\n`, 'utf-8');

console.log(`${geprueft.length / MODI.length} Bildschirme in ${MODI.length} Modi geprüft `
  + `(${geprueft.length} Messungen), ${befunde.length} Befunde an ${stellen.length} Stellen.`);
for (const a of ergebnis.je_art) console.log(`  ${String(a.anzahl).padStart(4)}  ${a.art}`);
console.log('\nDie zehn häufigsten Stellen:');
for (const s of stellen.slice(0, 10)) {
  const b = s.beispiel;
  const zusatz = s.art === 'kontrast-zu-gering' ? ` (${b.verhaeltnis} statt ${b.noetig})`
    : s.art === 'tippflaeche-zu-klein' ? ` (${b.breite_px}×${b.hoehe_px})`
      : s.art === 'tippflaechen-zu-eng' ? ` (${b.abstand_px} px)` : '';
  console.log(`  ${String(s.bildschirme.length).padStart(3)}×  [${s.modus}] ${s.marke}${zusatz}`);
}
