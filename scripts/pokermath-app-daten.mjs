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
/* Die drei Pfade lassen sich über Umgebungsvariablen umlenken. Das ist keine
   Einstellung für den Alltag — im Normalfall bleibt es bei den Vorgaben —,
   sondern für die Prüfung: Sie lässt dieses Skript gegen eine kleine
   Probedatei laufen, ohne die ausgelieferten Zahlen anzufassen. Ein Skript,
   das sich nur im Ernstfall ausführen lässt, wird erst im Ernstfall geprüft. */
const QUELLE = process.env.POKERMATH_QUELLE ?? join(WURZEL, 'tools', 'poker-math', 'output');
const ZIEL = process.env.POKERMATH_ZIEL ?? join(WURZEL, 'public', 'pokermath');
const SW = process.env.POKERMATH_SW ?? join(WURZEL, 'public', 'sw.js');

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

/**
 * B4 — die Preflop-Equity-Matrix, auf Anzeigegröße gebracht.
 *
 * Die vollständige Datei trägt für jedes Handpaar alle Farbkonfigurationen
 * mit ihren Boardzahlen; das sind mehrere Dutzend Megabyte. Die App bekommt:
 *
 * - je Handpaar den gewichteten Wert, die Spanne und das Kennzeichen,
 * - die einzelnen Farbkonfigurationen **nur** für die gekennzeichneten
 *   Handpaare. Nur dort braucht die App sie, und nur dort darf sie einen
 *   Einzelwert nicht ohne Hinweis zeigen (K3).
 *
 * Was die Kennzeichnung bedeutet, steht nicht hier, sondern als Besonderheit
 * im Herkunftsblock — erzeugt vom Rechenskript, nicht formuliert von diesem.
 */
function appB4(d) {
  const datei = 'b4_preflop_equity.json';
  return {
    ...kopf(datei, d, 'b4_preflop_equity'),
    matchups: hole(datei, d, 'matchups', 'liste').map((m) => {
      const eintrag = {
        a: hole(datei, m, 'hand_a', 'text'),
        b: hole(datei, m, 'hand_b', 'text'),
        equity_a: runde(hole(datei, m, 'equity_a', 'zahl'), 6),
        spanne_pp: runde(hole(datei, m, 'spanne_pp', 'zahl'), 4),
        spanne_relevant: hole(datei, m, 'spanne_relevant'),
      };
      if (eintrag.spanne_relevant) {
        eintrag.farbkonfigurationen = hole(datei, m, 'farbkonfigurationen', 'liste')
          .map((k) => ({
            beziehung: holeText(datei, k, 'beziehung'),
            haeufigkeit: hole(datei, k, 'haeufigkeit', 'zahl'),
            equity_a: runde(hole(datei, k, 'equity_a', 'zahl'), 6),
          }));
      }
      return eintrag;
    }),
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
// Das Binärformat der Equity-Matrix
// ---------------------------------------------------------------------------

/**
 * Warum die Matrix als Binärdatei ausgeliefert wird.
 *
 * Als JSON ist sie 5,0 MB groß, und der Service Worker speichert sie für den
 * Offline-Betrieb vollständig mit. Der Grund ist nicht die Datenmenge,
 * sondern ihre Verpackung: `"equity_a": 0.195705` sind 22 Zeichen für eine
 * Zahl, die in zwei Byte passt. Eine Equity ist ein Anteil zwischen 0 und 1;
 * in Basispunkten — Hundertstelprozent — ausgedrückt ist sie eine ganze Zahl
 * zwischen 0 und 10 000, und feiner als ein Basispunkt zeigt die App nie
 * etwas an.
 *
 * Was NICHT weggelassen wird: kein einziger Wert. Die Binärdatei trägt
 * dieselben Handpaare, dieselben Farbkonfigurationen und dieselben
 * Häufigkeiten wie die JSON-Fassung. Eine Datei kleiner zu machen, indem man
 * Daten daraus entfernt, wäre keine Leistung.
 *
 * Herkunft und Befunde bleiben JSON: Sie sind Text, sie sind klein, und sie
 * sind die Grundlage von „Warum diese Zahl?". Text in ein Binärformat zu
 * pressen spart nichts und kostet Lesbarkeit.
 *
 * Aufbau (alles little-endian):
 *
 *   "PMB4"            4 Byte   Kennung
 *   version           uint8    = 1
 *   reserviert        uint8    = 0
 *   handpaare         uint32
 *   konfigurationen   uint32
 *   klassen           uint8    169 Starthand-Klassen
 *   beziehungen       uint8    Zahl der verschiedenen Beziehungstexte
 *   je Klasse         4 Byte   ASCII, mit Null aufgefüllt ("AA\0\0", "AKs\0")
 *   je Beziehung      2 × (uint8 Länge + UTF-8)   deutsch, englisch
 *   je Handpaar       7 Byte   klasse_a, klasse_b, equity_bp (uint16),
 *                              konf_anzahl, spanne_hundertstel_pp (uint16)
 *   je Konfiguration  4 Byte   equity_bp (uint16), haeufigkeit, beziehung
 *
 * Die Konfigurationen eines Handpaars stehen hintereinander; der Anfang
 * ergibt sich aus der Summe der `konf_anzahl` aller vorherigen Handpaare.
 * Ein Feld für den Versatz wäre vier Byte je Handpaar für eine Zahl, die man
 * ausrechnen kann.
 *
 * `spanne_hundertstel_pp` gilt nur, wenn ein Handpaar **keine**
 * Konfigurationen mitbringt. Wo welche dastehen, wird die Spanne aus ihnen
 * gerechnet — sonst stünden zwei Zahlen da, die einander widersprechen
 * können.
 */
const BINAER_KENNUNG = 'PMB4';
const BINAER_VERSION = 1;

/** Ein Anteil zwischen 0 und 1 als Basispunkte. */
function basispunkte(anteil) {
  const bp = Math.round(anteil * 10000);
  if (bp < 0 || bp > 10000) {
    throw new Error(`Equity ${anteil} liegt außerhalb von 0 bis 1`);
  }
  return bp;
}

/** Baut die Binärdatei aus der bereits geprüften Anzeigefassung. */
function b4Binaer(app) {
  const klassen = [];
  const klassenIndex = new Map();
  const beziehungen = [];
  const beziehungIndex = new Map();

  const merkeKlasse = (name) => {
    if (!klassenIndex.has(name)) {
      klassenIndex.set(name, klassen.length);
      klassen.push(name);
    }
    return klassenIndex.get(name);
  };
  const merkeBeziehung = (paar) => {
    const schluessel = `${paar.de}\u0000${paar.en}`;
    if (!beziehungIndex.has(schluessel)) {
      beziehungIndex.set(schluessel, beziehungen.length);
      beziehungen.push(paar);
    }
    return beziehungIndex.get(schluessel);
  };

  /* Erst sammeln, dann schreiben – die Länge der Tabellen muss vor dem
     ersten Byte feststehen. */
  const paare = app.matchups.map((m) => ({
    a: merkeKlasse(m.a),
    b: merkeKlasse(m.b),
    equity: basispunkte(m.equity_a),
    spanne: Math.round(m.spanne_pp * 100),
    konf: (m.farbkonfigurationen ?? []).map((k) => ({
      equity: basispunkte(k.equity_a),
      haeufigkeit: k.haeufigkeit,
      beziehung: merkeBeziehung(k.beziehung),
    })),
  }));

  if (klassen.length > 255) throw new Error(`${klassen.length} Klassen passen nicht in ein Byte`);
  if (beziehungen.length > 255) throw new Error('Zu viele Beziehungstexte für ein Byte');
  for (const p of paare) {
    if (p.konf.length > 255) throw new Error('Zu viele Konfigurationen für ein Byte');
    if (p.spanne > 65535) throw new Error(`Spanne ${p.spanne} passt nicht in zwei Byte`);
    for (const k of p.konf) {
      if (k.haeufigkeit > 255) {
        throw new Error(`Häufigkeit ${k.haeufigkeit} passt nicht in ein Byte`);
      }
    }
  }

  const kodierer = new TextEncoder();
  const beziehungBytes = beziehungen.map((b) => [kodierer.encode(b.de), kodierer.encode(b.en)]);
  for (const [de, en] of beziehungBytes) {
    if (de.length > 255 || en.length > 255) throw new Error('Beziehungstext zu lang für ein Byte Länge');
  }

  const konfGesamt = paare.reduce((n, p) => n + p.konf.length, 0);
  const laenge = 4 + 1 + 1 + 4 + 4 + 1 + 1
    + klassen.length * 4
    + beziehungBytes.reduce((n, [de, en]) => n + 1 + de.length + 1 + en.length, 0)
    + paare.length * 7
    + konfGesamt * 4;

  const puffer = new ArrayBuffer(laenge);
  const sicht = new DataView(puffer);
  const bytes = new Uint8Array(puffer);
  let i = 0;

  for (const zeichen of BINAER_KENNUNG) bytes[i++] = zeichen.charCodeAt(0);
  sicht.setUint8(i++, BINAER_VERSION);
  sicht.setUint8(i++, 0);
  sicht.setUint32(i, paare.length, true); i += 4;
  sicht.setUint32(i, konfGesamt, true); i += 4;
  sicht.setUint8(i++, klassen.length);
  sicht.setUint8(i++, beziehungen.length);

  for (const name of klassen) {
    const roh = kodierer.encode(name);
    if (roh.length > 4) throw new Error(`Klassenname ${name} ist länger als vier Byte`);
    bytes.set(roh, i);
    i += 4;
  }
  for (const [de, en] of beziehungBytes) {
    sicht.setUint8(i++, de.length); bytes.set(de, i); i += de.length;
    sicht.setUint8(i++, en.length); bytes.set(en, i); i += en.length;
  }
  for (const p of paare) {
    sicht.setUint8(i++, p.a);
    sicht.setUint8(i++, p.b);
    sicht.setUint16(i, p.equity, true); i += 2;
    sicht.setUint8(i++, p.konf.length);
    sicht.setUint16(i, p.konf.length === 0 ? p.spanne : 0, true); i += 2;
  }
  for (const p of paare) {
    for (const k of p.konf) {
      sicht.setUint16(i, k.equity, true); i += 2;
      sicht.setUint8(i++, k.haeufigkeit);
      sicht.setUint8(i++, k.beziehung);
    }
  }
  if (i !== laenge) throw new Error(`Binärdatei: ${i} Byte geschrieben, ${laenge} berechnet`);
  return Buffer.from(puffer);
}

/** Kürzen, ohne die Bedeutung zu verschieben.
 *
 *  Sechs Nachkommastellen sind ein Millionstel – feiner, als jede Anzeige je
 *  zeigt, und grob genug, dass die Datei nicht am Nachkommarauschen
 *  erstickt. */
function runde(wert, stellen) {
  const faktor = 10 ** stellen;
  return Math.round(wert * faktor) / faktor;
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
  /* Die Binärdatei gehört genauso in den Offline-Vorrat wie die JSON-Dateien.
     Fehlt sie dort, startet die App ohne Netz — und zeigt beim ersten
     Handpaar einen leeren Bildschirm. */
  const dateien = ergebnisse
    .map(([name]) => `'./pokermath/${name}.json'`)
    .concat(ergebnisse.some(([n]) => n === 'b4_preflop_equity')
      ? ["'./pokermath/b4_preflop_equity.bin'"] : [])
    .join(', ');

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
  /* B4 läuft noch. Fehlt die Datei, wird der Block übersprungen – die
     anderen drei sollen deswegen nicht ausfallen. */
  ['b4_preflop_equity', appB4],
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

  /* B4 wird geteilt: Herkunft und Befunde bleiben JSON (Text, klein, die
     Grundlage von „Warum diese Zahl?"), die Matrix wandert in die
     Binärdatei. Gebaut wird sie hier, VOR dem ersten Schreibzugriff — sie
     gehört zum Alles-oder-nichts wie alles andere auch. */
  const b4 = ergebnisse.find(([name]) => name === 'b4_preflop_equity');
  let messung = null;
  if (b4) {
    const [, inhalt] = b4;
    const alsJson = Buffer.byteLength(JSON.stringify(inhalt) + '\n');
    const binaer = b4Binaer(inhalt);
    /* Was in der Binärdatei steht, steht nicht noch einmal im JSON. */
    b4[1] = { ...inhalt, matchups: undefined, matrix: 'b4_preflop_equity.bin' };
    delete b4[1].matchups;
    const rest = Buffer.byteLength(JSON.stringify(b4[1]) + '\n');
    messung = {
      vorher_json_byte: alsJson,
      nachher_binaer_byte: binaer.length,
      nachher_kopf_json_byte: rest,
      nachher_gesamt_byte: binaer.length + rest,
      verhaeltnis: Math.round((alsJson / (binaer.length + rest)) * 10) / 10,
      handpaare: inhalt.matchups.length,
      konfigurationen: inhalt.matchups.reduce(
        (n, m) => n + (m.farbkonfigurationen?.length ?? 0), 0,
      ),
      binaer,
    };
  }

  mkdirSync(ZIEL, { recursive: true });
  for (const [name, inhalt] of ergebnisse) {
    const text = JSON.stringify(inhalt) + '\n';
    writeFileSync(join(ZIEL, `${name}.json`), text, 'utf8');
    gebaut.push([name, text.length]);
  }
  if (messung) {
    writeFileSync(join(ZIEL, 'b4_preflop_equity.bin'), messung.binaer);
    gebaut.push(['b4_preflop_equity.bin', messung.binaer.length]);
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

  if (messung) {
    const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
    console.log(
      `\nDie Equity-Matrix als Binärdatei:\n`
      + `  vorher  (JSON)          ${kb(messung.vorher_json_byte).padStart(10)}\n`
      + `  nachher (Binärdatei)    ${kb(messung.nachher_binaer_byte).padStart(10)}\n`
      + `  nachher (Kopf als JSON) ${kb(messung.nachher_kopf_json_byte).padStart(10)}\n`
      + `  nachher (zusammen)      ${kb(messung.nachher_gesamt_byte).padStart(10)}`
      + `   ·  Faktor ${messung.verhaeltnis}\n`
      + `  ${messung.handpaare} Handpaare, ${messung.konfigurationen} Farbkonfigurationen`,
    );
  }

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
