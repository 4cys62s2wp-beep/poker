#!/usr/bin/env node
/* Erzeugt aus den Rechenausgaben das schlanke Format, das die App lädt.
   ====================================================================

   Warum überhaupt umgewandelt wird
   --------------------------------
   Die Dateien unter `tools/poker-math/output/` sind für den **Nachweis**
   gebaut: Sie tragen Belege, Zwischenwerte und vollständige Verteilungen. Das
   ist dort richtig – nur muss die App das nicht über das Netz holen, um eine
   Prozentzahl anzuzeigen.

   Warum Node und nicht Python
   ---------------------------
   Der Generator ist Python, aber dieses Skript gehört zur App: Es läuft mit
   `npm run daten`, braucht kein venv, und die App-Prüfung kann es mitlaufen
   lassen. Wer am Frontend arbeitet, soll die Daten neu bauen können, ohne
   erst eine Python-Umgebung einzurichten.

   Was es NICHT tut
   ----------------
   Rechnen. Es liest, wählt aus und schreibt. Keine Zahl entsteht hier – wenn
   eine fehlt, bricht es ab und die Lücke gehört nach BLOCKER.md.

   Laut scheitern
   --------------
   Fehlt ein Feld in der Quelle, wirft dieses Skript mit dem genauen Pfad und
   schreibt **nichts**. Eine halb erzeugte Datei wäre schlimmer als keine: Die
   App würde sie laden und einen Teil der Zahlen stumm weglassen. */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HIER = dirname(fileURLToPath(import.meta.url));
const WURZEL = resolve(HIER, '..');
const QUELLE = join(WURZEL, 'tools', 'poker-math', 'output');
const ZIEL = join(WURZEL, 'public', 'pokermath');
const SW = join(WURZEL, 'public', 'sw.js');

/**
 * Version des Datenvertrags zwischen Rechenausgabe und App.
 *
 * 1 → erste Fassung (vom Python-Skript erzeugt)
 * 2 → `herkunft` ergänzt: Methode, Annahmen, Bibliothek und Fallzahl an einer
 *      Stelle gebündelt, damit die Oberfläche „Warum diese Zahl?" daraus
 *      speisen kann, ohne im Dokument herumzusuchen.
 * 3 → Jeder anzeigbare Text ist ein {de, en}-Paar statt einer deutschen
 *      Zeichenkette; `faelle_enumeriert` trägt die mitgezählte Fallzahl samt
 *      Aufschlüsselung; `bibliothek` nennt bei Blöcken ohne Evaluator den
 *      Grund, statt `null` zu sein.
 */
const VERTRAG_VERSION = 3;

// ---------------------------------------------------------------------------
// Zugriff, der laut scheitert
// ---------------------------------------------------------------------------

class QuellFehler extends Error {
  constructor(datei, pfad, was) {
    super(`${datei}: ${pfad} ${was}`);
    this.name = 'QuellFehler';
  }
}

/** Ein Feld holen. Fehlt es, bricht der Lauf ab – mit dem Pfad im Klartext. */
function hole(datei, wurzel, pfad, pruefung = 'vorhanden') {
  let stelle = wurzel;
  const teile = pfad.split('.');
  for (const teil of teile) {
    if (stelle === null || stelle === undefined || typeof stelle !== 'object') {
      throw new QuellFehler(datei, pfad, `bricht bei "${teil}" ab`);
    }
    if (!(teil in stelle)) {
      const vorhanden = Array.isArray(stelle) ? `[${stelle.length} Einträge]`
        : Object.keys(stelle).slice(0, 10).join(', ');
      throw new QuellFehler(datei, pfad, `fehlt. Vorhanden wären: ${vorhanden}`);
    }
    stelle = stelle[teil];
  }
  if (pruefung === 'zahl' && (typeof stelle !== 'number' || !Number.isFinite(stelle))) {
    throw new QuellFehler(datei, pfad, `ist keine endliche Zahl, sondern ${JSON.stringify(stelle)}`);
  }
  if (pruefung === 'text' && (typeof stelle !== 'string' || stelle.length === 0)) {
    throw new QuellFehler(datei, pfad, 'ist kein nichtleerer Text');
  }
  if (pruefung === 'liste' && (!Array.isArray(stelle) || stelle.length === 0)) {
    throw new QuellFehler(datei, pfad, 'ist keine nichtleere Liste');
  }
  return stelle;
}

/**
 * Ein zweisprachiges Textpaar holen und prüfen.
 *
 * Eine nackte Zeichenkette an dieser Stelle ist ein Fehler und keine
 * Notlösung: Sie erschiene in der englischen App als deutscher Satz, und das
 * fällt niemandem auf, der die App auf Deutsch benutzt.
 */
function holeText(datei, wurzel, pfad) {
  const wert = hole(datei, wurzel, pfad);
  if (typeof wert !== 'object' || wert === null
      || typeof wert.de !== 'string' || typeof wert.en !== 'string'
      || !wert.de || !wert.en) {
    throw new QuellFehler(datei, pfad,
      `ist kein zweisprachiges Textpaar: ${JSON.stringify(wert)}`);
  }
  return { de: wert.de, en: wert.en };
}

function lade(name) {
  const pfad = join(QUELLE, `${name}.json`);
  if (!existsSync(pfad)) return null;
  return JSON.parse(readFileSync(pfad, 'utf8'));
}

// ---------------------------------------------------------------------------
// Der Herkunftsblock — die Grundlage für „Warum diese Zahl?"
// ---------------------------------------------------------------------------

/**
 * Alles, was die Oberfläche über die Entstehung einer Zahl sagen können muss.
 *
 * Bewusst aus der Quelle übernommen und nicht formuliert: Die Sätze stammen
 * aus dem Rechenskript, das sie aus den Daten erzeugt hat.
 *
 * Seit Vertrag 3 ist nichts davon mehr optional: Jeder Block zählt seine
 * Fälle mit, und jeder Block sagt, womit gerechnet wurde – entweder mit einer
 * Bibliothek samt Version oder mit dem Grund, warum keine nötig war. Fehlt
 * eines davon, bricht dieser Lauf ab, statt der App eine Lücke zu geben, die
 * sie dann selbst füllen müsste.
 */
function herkunft(datei, d, block) {
  const m = hole(datei, d, 'metadaten');
  const a = hole(datei, m, 'annahmen');
  const karten = hole(datei, a, 'kartenzahlen');

  const evaluator = hole(datei, m, 'evaluator');
  const faelle = hole(datei, m, 'faelle_enumeriert');

  return {
    methode: hole(datei, m, 'methode', 'text'),
    erzeugt_am: hole(datei, m, 'erzeugt_am', 'text'),
    zweck: holeText(datei, m, 'zweck'),
    annahmen: {
      sicht: holeText(datei, a, 'sicht'),
      unbekannte_karten: holeText(datei, a, 'unbekannte_karten'),
      split_pot: holeText(datei, a, 'split_pot'),
      kartenzahlen: {
        deck: hole(datei, karten, 'deck', 'zahl'),
        eigene_karten: hole(datei, karten, 'eigene_karten', 'zahl'),
        unbekannt_nach_flop: hole(datei, karten, 'unbekannt_nach_flop', 'zahl'),
        unbekannt_nach_turn: hole(datei, karten, 'unbekannt_nach_turn', 'zahl'),
      },
      /* Die blockspezifischen Annahmen als Liste von Paaren, damit die
         Oberfläche sie ohne Kenntnis der Schlüssel anzeigen kann. */
      besonderheiten: Object.entries(a.block_spezifisch ?? {})
        .map(([schluessel, satz]) => ({
          schluessel,
          satz: holeText(datei, a.block_spezifisch, schluessel),
        })),
    },
    /* Entweder die Bibliothek mit Version – oder der Grund, warum keine nötig
       war. Beides ist eine Auskunft; ein fehlendes Feld wäre keine. */
    bibliothek: evaluator.name === null
      ? { name: null, begruendung: holeText(datei, evaluator, 'begruendung') }
      : {
        name: hole(datei, evaluator, 'name', 'text'),
        version: hole(datei, evaluator, 'version', 'text'),
      },
    /* Mitgezählt, nicht hergeleitet: Der Rechenblock hat beim Laufen
       hochgezählt, wie viele Einzelfälle er durchgegangen ist. */
    faelle_enumeriert: {
      gesamt: hole(datei, faelle, 'gesamt', 'zahl'),
      je_teil: hole(datei, faelle, 'je_teil', 'liste').map((teil) => ({
        schluessel: hole(datei, teil, 'schluessel', 'text'),
        bezeichnung: holeText(datei, teil, 'bezeichnung'),
        anzahl: hole(datei, teil, 'anzahl', 'zahl'),
      })),
    },
    quelle: `tools/poker-math/output/${block}.json`,
  };
}

function kopf(datei, d, block) {
  return {
    vertrag_version: VERTRAG_VERSION,
    block,
    herkunft: herkunft(datei, d, block),
  };
}

// ---------------------------------------------------------------------------
// Die Blöcke
// ---------------------------------------------------------------------------

function appB1(d) {
  const datei = 'b1_outs.json';
  const zeilen = hole(datei, d, 'outs', 'liste');
  return {
    ...kopf(datei, d, 'b1_outs'),
    outs: zeilen.map((z, i) => ({
      outs: hole(datei, z, 'outs', 'zahl'),
      turn: hole(datei, z, 'turn', 'zahl'),
      river_nach_fehlschlag: hole(datei, z, 'river_nach_fehlschlag', 'zahl'),
      turn_oder_river: hole(datei, z, 'turn_oder_river', 'zahl'),
      regel_zwei_karten: hole(datei, z, 'faustregel.zwei_karten', 'zahl'),
      regel_abweichung_pp: hole(datei, z, 'faustregel.abweichung_pp_turn_oder_river', 'zahl'),
      _i: i,
    })).map(({ _i, ...rest }) => rest),
    zugbilder: hole(datei, d, 'beispiele', 'liste').map((b) => ({
      name: holeText(datei, b, 'name'),
      hand: hole(datei, b, 'hand', 'text'),
      flop: hole(datei, b, 'flop', 'text'),
      zielkategorie: holeText(datei, b, 'zielkategorie'),
      outs: hole(datei, b, 'outs_bis_zielkategorie', 'zahl'),
      outs_falsch_gezaehlt: hole(datei, b, 'outs_mit_boardtreffern', 'zahl'),
    })),
    gegenbeispiele: hole(datei, d, 'gegenbeispiele_saubere_outs', 'liste').map((g) => ({
      name: holeText(datei, g, 'name'),
      hand: hole(datei, g, 'hand', 'text'),
      flop: hole(datei, g, 'flop', 'text'),
      out: hole(datei, g, 'out', 'text'),
      gegner: hole(datei, g, 'gegner', 'text'),
      hero_nachher: holeText(datei, g, 'hero_nachher'),
      gegner_nachher: holeText(datei, g, 'gegner_nachher'),
      erklaerung: holeText(datei, g, 'erklaerung'),
    })),
    befunde: hole(datei, d, 'befunde', 'liste').map((b) => ({
      schluessel: hole(datei, b, 'schluessel', 'text'),
      aussage: {
        de: hole(datei, b, 'aussage', 'text'),
        en: hole(datei, b, 'aussage_en', 'text'),
      },
    })),
  };
}

function appB2(d) {
  const datei = 'b2_potodds.json';
  return {
    ...kopf(datei, d, 'b2_potodds'),
    einsatzgroessen: hole(datei, d, 'einsatzgroessen', 'liste').map((z) => ({
      name: holeText(datei, z, 'name'),
      einsatz_als_potanteil: hole(datei, z, 'einsatz_als_potanteil', 'zahl'),
      einsatz_als_bruch: hole(datei, z, 'einsatz_als_bruch', 'text'),
      noetige_equity: hole(datei, z, 'anteil_am_endpot', 'zahl'),
      pot_odds_zu_eins: hole(datei, z, 'pot_odds_zu_eins', 'zahl'),
      mindest_outs_turn: hole(datei, z, 'mindest_outs.turn'),
      mindest_outs_river: hole(datei, z, 'mindest_outs.river_nach_fehlschlag'),
      mindest_outs_beide: hole(datei, z, 'mindest_outs.turn_oder_river'),
    })),
    befunde: hole(datei, d, 'befunde', 'liste').map((b) => ({
      schluessel: hole(datei, b, 'schluessel', 'text'),
      aussage: {
        de: hole(datei, b, 'aussage', 'text'),
        en: hole(datei, b, 'aussage_en', 'text'),
      },
    })),
  };
}

function appB3(d) {
  const datei = 'b3_kombinatorik.json';
  const kurz = (pfad) => hole(datei, d, pfad, 'liste').map((z) => ({
    bekannte_karten: hole(datei, z, 'bekannte_karten', 'zahl'),
    ohne_blocker: hole(datei, z, 'kombos_ohne_blocker', 'zahl'),
    schlimmstenfalls: hole(datei, z, 'schlimmstenfalls_uebrig', 'zahl'),
    bestenfalls: hole(datei, z, 'bestenfalls_uebrig', 'zahl'),
    im_mittel: hole(datei, z, 'im_mittel_uebrig', 'zahl'),
  }));

  return {
    ...kopf(datei, d, 'b3_kombinatorik'),
    kombos_je_typ: hole(datei, d, 'kombos_je_typ'),
    klassen_je_typ: hole(datei, d, 'klassen_je_typ'),
    gesamt: {
      starthand_klassen: hole(datei, d, 'gesamt.starthand_klassen', 'zahl'),
      zweikartenblaetter: hole(datei, d, 'gesamt.zweikartenblaetter', 'zahl'),
    },
    blocker: {
      Paar: kurz('blocker.Paar'),
      suited: kurz('blocker.suited'),
      offsuit: kurz('blocker.offsuit'),
    },
    beispiel: {
      hand: hole(datei, d, 'beispiel.hand', 'text'),
      board: hole(datei, d, 'beispiel.board', 'text'),
      summe_vorher: hole(datei, d, 'beispiel.summe_vorher', 'zahl'),
      summe_nachher: hole(datei, d, 'beispiel.summe_nachher', 'zahl'),
      je_starthand: hole(datei, d, 'beispiel.je_starthand', 'liste').map((e) => ({
        hand: hole(datei, e, 'hand', 'text'),
        typ: hole(datei, e, 'typ', 'text'),
        vorher: hole(datei, e, 'vorher', 'zahl'),
        nachher: hole(datei, e, 'nachher', 'zahl'),
        weggeblockt: hole(datei, e, 'weggeblockt', 'zahl'),
      })),
    },
    befunde: hole(datei, d, 'befunde', 'liste').map((b) => ({
      schluessel: hole(datei, b, 'schluessel', 'text'),
      aussage: {
        de: hole(datei, b, 'aussage', 'text'),
        en: hole(datei, b, 'aussage_en', 'text'),
      },
    })),
  };
}

// ---------------------------------------------------------------------------
// Lauf
// ---------------------------------------------------------------------------

/** Trägt Datenstand und Dateiliste in den Service Worker ein.
 *
 *  Warum automatisch und nicht als Zeile in einer Anleitung: Die Zahlen
 *  werden für den Offline-Betrieb mitgespeichert. Bliebe der Cache-Name
 *  gleich, zeigte ein Gerät nach neuen Zahlen weiter die alten – und das
 *  fällt bei einer Zahl niemandem auf. Ein Schritt, den ein Mensch von Hand
 *  machen müsste, wird irgendwann vergessen; dieser hier nicht.
 *
 *  Der Stand ist das jüngste `erzeugt_am` aller Blöcke, auf Zeichen
 *  reduziert, die in einem Cache-Namen nichts anrichten. */
function serviceWorkerText(ergebnisse) {
  const staende = ergebnisse.map(([, i]) => i.herkunft.erzeugt_am).sort();
  const stand = staende[staende.length - 1].replace(/[^0-9A-Za-z]/g, '-');
  const dateien = ergebnisse.map(([name]) => `'./pokermath/${name}.json'`).join(', ');

  const text = readFileSync(SW, 'utf8');
  const zeilen = [
    [/^const DATEN_STAND = .*$/m, `const DATEN_STAND = '${stand}';`],
    [/^const DATEN_DATEIEN = .*$/m, `const DATEN_DATEIEN = [${dateien}];`],
  ];
  /* Geprüft wird, ob die Zeilen DA sind – nicht, ob sich der Text ändert.
     Eine frühere Fassung verglich das Ergebnis mit dem Original und brach
     ab, wenn beides gleich war. Das trifft aber genau den Normalfall: Wer
     das Skript zweimal hintereinander laufen lässt, ändert nichts, und der
     zweite Lauf schlug fehl. */
  for (const [muster] of zeilen) {
    if (!muster.test(text)) {
      throw new Error(
        `In public/sw.js fehlt die Zeile ${muster}. Ohne sie liefe die App `
        + 'offline mit veralteten Zahlen weiter.',
      );
    }
  }
  const neu = zeilen.reduce((t, [muster, ersatz]) => t.replace(muster, ersatz), text);
  return { stand, text: neu };
}

const BLOECKE = [
  ['b1_outs', appB1],
  ['b2_potodds', appB2],
  ['b3_kombinatorik', appB3],
];

function main() {
  const gebaut = [];
  const fehlend = [];
  const ergebnisse = [];

  /* Erst alles bauen, dann alles schreiben. Wirft ein Block, ist noch nichts
     auf der Platte – eine halb erneuerte Sammlung wäre die schlimmste Variante:
     Sie sieht vollständig aus. */
  for (const [name, bauen] of BLOECKE) {
    const quelle = lade(name);
    if (quelle === null) { fehlend.push(name); continue; }
    ergebnisse.push([name, bauen(quelle)]);
  }

  /* Auch der Service Worker gehört zum Alles-oder-nichts: Sein Datenstand
     entscheidet, ob ein installiertes Gerät die neuen Zahlen überhaupt sieht.
     Deshalb wird sein neuer Inhalt VOR dem ersten Schreibzugriff gebaut. */
  const sw = serviceWorkerText(ergebnisse);

  mkdirSync(ZIEL, { recursive: true });
  for (const [name, inhalt] of ergebnisse) {
    const text = JSON.stringify(inhalt) + '\n';
    writeFileSync(join(ZIEL, `${name}.json`), text, 'utf8');
    gebaut.push([name, text.length]);
  }
  writeFileSync(SW, sw.text, 'utf8');

  for (const [name, groesse] of gebaut) {
    console.log(`  ${name.padEnd(22)} ${(groesse / 1024).toFixed(1).padStart(8)} KB`);
  }
  for (const name of fehlend) {
    console.log(`  ${name.padEnd(22)} noch nicht gerechnet – übersprungen`);
  }
  console.log(`Vertrag Version ${VERTRAG_VERSION} · geschrieben nach public/pokermath/`);

  console.log(`Service Worker auf Datenstand ${sw.stand} gesetzt (public/sw.js).`);

  /* Was die Herkunftsanzeige verspricht, hier einmal laut nachgezählt – wer
     das Skript laufen lässt, soll sehen, dass die Angaben da sind. */
  for (const [name, inhalt] of ergebnisse) {
    const h = inhalt.herkunft;
    const womit = h.bibliothek.name
      ? `${h.bibliothek.name} ${h.bibliothek.version}`
      : 'ohne Bibliothek (Begründung liegt bei)';
    console.log(
      `  ${name.padEnd(22)} ${h.faelle_enumeriert.gesamt.toLocaleString('de-DE')
        .padStart(12)} Fälle · ${womit}`,
    );
  }
  return 0;
}

try {
  process.exit(main());
} catch (fehler) {
  console.error(`\nABBRUCH – nichts geschrieben.\n${fehler.message}\n`);
  console.error('Das ist Absicht: Eine halb erzeugte Sammlung sieht vollständig');
  console.error('aus, und die App würde einen Teil der Zahlen stumm weglassen.\n');
  process.exit(1);
}
