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

/**
 * Version des Datenvertrags zwischen Rechenausgabe und App.
 *
 * 1 → erste Fassung (vom Python-Skript erzeugt)
 * 2 → `herkunft` ergänzt: Methode, Annahmen, Bibliothek und Fallzahl an einer
 *      Stelle gebündelt, damit die Oberfläche „Warum diese Zahl?" daraus
 *      speisen kann, ohne im Dokument herumzusuchen.
 */
const VERTRAG_VERSION = 2;

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
 * `bibliothek` und `faelle` können fehlen – nicht jeder Block braucht einen
 * Evaluator, und die Fallzahl liefert der Generator derzeit nicht (siehe
 * BLOCKER.md, B-003). Fehlt etwas, steht dort `null`, und die Oberfläche sagt
 * das offen, statt eine Zeile wegzulassen.
 */
function herkunft(datei, d, block) {
  const m = hole(datei, d, 'metadaten');
  const a = hole(datei, m, 'annahmen');
  const karten = hole(datei, a, 'kartenzahlen');

  const evaluator = m.evaluator ?? null;

  return {
    methode: hole(datei, m, 'methode', 'text'),
    erzeugt_am: hole(datei, m, 'erzeugt_am', 'text'),
    zweck: hole(datei, m, 'zweck', 'text'),
    annahmen: {
      sicht: hole(datei, a, 'sicht', 'text'),
      unbekannte_karten: hole(datei, a, 'unbekannte_karten', 'text'),
      split_pot: hole(datei, a, 'split_pot', 'text'),
      kartenzahlen: {
        deck: hole(datei, karten, 'deck', 'zahl'),
        eigene_karten: hole(datei, karten, 'eigene_karten', 'zahl'),
        unbekannt_nach_flop: hole(datei, karten, 'unbekannt_nach_flop', 'zahl'),
        unbekannt_nach_turn: hole(datei, karten, 'unbekannt_nach_turn', 'zahl'),
      },
      /* Die blockspezifischen Annahmen als Liste von Paaren, damit die
         Oberfläche sie ohne Kenntnis der Schlüssel anzeigen kann. */
      besonderheiten: Object.entries(a.block_spezifisch ?? {})
        .map(([schluessel, satz]) => ({ schluessel, satz })),
    },
    bibliothek: evaluator
      ? { name: evaluator.name, version: evaluator.version }
      : null,
    /* Wie viele Fälle durchgezählt wurden. Der Generator gibt das derzeit
       nicht aus; selbst nachrechnen wäre genau das, was in diesem
       Arbeitsbereich nicht erlaubt ist. Siehe BLOCKER.md, B-003. */
    faelle_enumeriert: null,
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
      name: hole(datei, b, 'name', 'text'),
      hand: hole(datei, b, 'hand', 'text'),
      flop: hole(datei, b, 'flop', 'text'),
      zielkategorie: hole(datei, b, 'zielkategorie', 'text'),
      outs: hole(datei, b, 'outs_bis_zielkategorie', 'zahl'),
      outs_falsch_gezaehlt: hole(datei, b, 'outs_mit_boardtreffern', 'zahl'),
    })),
    gegenbeispiele: hole(datei, d, 'gegenbeispiele_saubere_outs', 'liste').map((g) => ({
      name: hole(datei, g, 'name', 'text'),
      hand: hole(datei, g, 'hand', 'text'),
      flop: hole(datei, g, 'flop', 'text'),
      out: hole(datei, g, 'out', 'text'),
      gegner: hole(datei, g, 'gegner', 'text'),
      hero_nachher: hole(datei, g, 'hero_nachher', 'text'),
      gegner_nachher: hole(datei, g, 'gegner_nachher', 'text'),
      erklaerung: hole(datei, g, 'erklaerung', 'text'),
    })),
    befunde: hole(datei, d, 'befunde', 'liste').map((b) => ({
      schluessel: hole(datei, b, 'schluessel', 'text'),
      aussage: hole(datei, b, 'aussage', 'text'),
    })),
  };
}

function appB2(d) {
  const datei = 'b2_potodds.json';
  return {
    ...kopf(datei, d, 'b2_potodds'),
    einsatzgroessen: hole(datei, d, 'einsatzgroessen', 'liste').map((z) => ({
      name: hole(datei, z, 'name', 'text'),
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
      aussage: hole(datei, b, 'aussage', 'text'),
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
      aussage: hole(datei, b, 'aussage', 'text'),
    })),
  };
}

// ---------------------------------------------------------------------------
// Lauf
// ---------------------------------------------------------------------------

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

  mkdirSync(ZIEL, { recursive: true });
  for (const [name, inhalt] of ergebnisse) {
    const text = JSON.stringify(inhalt) + '\n';
    writeFileSync(join(ZIEL, `${name}.json`), text, 'utf8');
    gebaut.push([name, text.length]);
  }

  for (const [name, groesse] of gebaut) {
    console.log(`  ${name.padEnd(22)} ${(groesse / 1024).toFixed(1).padStart(8)} KB`);
  }
  for (const name of fehlend) {
    console.log(`  ${name.padEnd(22)} noch nicht gerechnet – übersprungen`);
  }
  console.log(`Vertrag Version ${VERTRAG_VERSION} · geschrieben nach public/pokermath/`);

  const ohneBibliothek = ergebnisse.filter(([, i]) => i.herkunft.bibliothek === null);
  if (ohneBibliothek.length > 0) {
    console.log(
      `\nHinweis: ${ohneBibliothek.map(([n]) => n).join(', ')} `
      + 'nennen keine Evaluator-Bibliothek. Die Oberfläche sagt das offen. '
      + 'Siehe BLOCKER.md, B-002.',
    );
  }
  console.log('Hinweis: Keine Ausgabe nennt eine Fallzahl. Siehe BLOCKER.md, B-003.');
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
