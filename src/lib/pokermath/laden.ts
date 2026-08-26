/* Lädt die gerechneten Daten und prüft sie – laut, nicht still.
   =============================================================

   Warum es wirft statt `null` zurückzugeben
   -----------------------------------------
   Eine frühere Fassung lieferte bei jedem Zweifel `null`. Das ist für einen
   Konfigurationsschalter richtig (dann bleibt eine Funktion eben aus), für
   **Zahlen in einer Lern-App** aber falsch: Der Bildschirm hätte dann still
   weniger angezeigt, und niemand hätte gemerkt, dass ein Feld fehlt.

   Deshalb wirft jede Prüfung mit dem genauen Pfad. Die Oberfläche fängt das
   und zeigt den Fehler **sichtbar** an — sie stürzt nicht ab, aber sie
   schweigt auch nicht.

   Die Versionsprüfung
   -------------------
   Passt `vertrag_version` nicht, wird geworfen – auch bei sonst gültiger
   Datei. Ein Feld kann seine Bedeutung ändern, ohne seinen Typ zu ändern;
   dann sieht die falsche Zahl völlig richtig aus. */

import {
  ERWARTETE_VERTRAG_VERSION,
  type Annahmen,
  type B1Outs,
  type B2PotOdds,
  type B3Kombinatorik,
  type Befund,
  type Herkunft,
  type Kopf,
} from './typen';

/** Ein Schemafehler mit dem Pfad, an dem er auftrat.
 *
 *  Der Pfad ist das Wichtigste daran: „b1_outs.outs[7].turn fehlt" sagt einem
 *  Menschen, was zu tun ist. „Daten ungültig" sagt nichts. */
export class SchemaFehler extends Error {
  readonly pfad: string;
  constructor(pfad: string, was: string) {
    super(`${pfad}: ${was}`);
    this.name = 'SchemaFehler';
    this.pfad = pfad;
  }
}

// ---------------------------------------------------------------------------
// Prüfhelfer – jeder wirft mit Pfad
// ---------------------------------------------------------------------------

function objekt(v: unknown, pfad: string): Record<string, unknown> {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) {
    throw new SchemaFehler(pfad, `ist kein Objekt, sondern ${typeof v}`);
  }
  return v as Record<string, unknown>;
}

function zahl(v: unknown, pfad: string, min = -Infinity, max = Infinity): number {
  if (typeof v !== 'number' || !Number.isFinite(v)) {
    throw new SchemaFehler(pfad, `ist keine endliche Zahl, sondern ${JSON.stringify(v)}`);
  }
  if (v < min || v > max) {
    throw new SchemaFehler(pfad, `liegt mit ${v} außerhalb von ${min}..${max}`);
  }
  return v;
}

/** Eine Wahrscheinlichkeit. Außerhalb von 0..1 ist sie keine. */
function anteil(v: unknown, pfad: string): number {
  return zahl(v, pfad, 0, 1);
}

function ganzzahl(v: unknown, pfad: string, min = 0, max = Number.MAX_SAFE_INTEGER): number {
  const n = zahl(v, pfad, min, max);
  if (!Number.isInteger(n)) throw new SchemaFehler(pfad, `ist keine ganze Zahl: ${n}`);
  return n;
}

function text(v: unknown, pfad: string, maxLaenge = 4000): string {
  if (typeof v !== 'string' || v.length === 0) {
    throw new SchemaFehler(pfad, 'ist kein nichtleerer Text');
  }
  if (v.length > maxLaenge) throw new SchemaFehler(pfad, `ist länger als ${maxLaenge} Zeichen`);
  return v;
}

function liste(v: unknown, pfad: string): unknown[] {
  if (!Array.isArray(v) || v.length === 0) {
    throw new SchemaFehler(pfad, 'ist keine nichtleere Liste');
  }
  return v;
}

function jedes<T>(v: unknown, pfad: string, pruefe: (e: unknown, p: string) => T): T[] {
  return liste(v, pfad).map((e, i) => pruefe(e, `${pfad}[${i}]`));
}

function optionaleGanzzahl(v: unknown, pfad: string, min: number, max: number): number | null {
  return v === null ? null : ganzzahl(v, pfad, min, max);
}

// ---------------------------------------------------------------------------
// Kopf und Herkunft
// ---------------------------------------------------------------------------

function pruefeAnnahmen(v: unknown, pfad: string): Annahmen {
  const o = objekt(v, pfad);
  const k = objekt(o.kartenzahlen, `${pfad}.kartenzahlen`);
  return {
    sicht: text(o.sicht, `${pfad}.sicht`),
    unbekannte_karten: text(o.unbekannte_karten, `${pfad}.unbekannte_karten`),
    split_pot: text(o.split_pot, `${pfad}.split_pot`),
    kartenzahlen: {
      deck: ganzzahl(k.deck, `${pfad}.kartenzahlen.deck`, 1, 52),
      eigene_karten: ganzzahl(k.eigene_karten, `${pfad}.kartenzahlen.eigene_karten`, 1, 5),
      unbekannt_nach_flop: ganzzahl(k.unbekannt_nach_flop, `${pfad}.kartenzahlen.unbekannt_nach_flop`, 1, 52),
      unbekannt_nach_turn: ganzzahl(k.unbekannt_nach_turn, `${pfad}.kartenzahlen.unbekannt_nach_turn`, 1, 52),
    },
    besonderheiten: (Array.isArray(o.besonderheiten) ? o.besonderheiten : []).map((e, i) => {
      const b = objekt(e, `${pfad}.besonderheiten[${i}]`);
      return {
        schluessel: text(b.schluessel, `${pfad}.besonderheiten[${i}].schluessel`, 120),
        satz: text(b.satz, `${pfad}.besonderheiten[${i}].satz`),
      };
    }),
  };
}

function pruefeHerkunft(v: unknown, pfad: string): Herkunft {
  const o = objekt(v, pfad);
  const methode = text(o.methode, `${pfad}.methode`, 40);
  if (methode !== 'exakt' && methode !== 'monte-carlo') {
    throw new SchemaFehler(`${pfad}.methode`, `ist weder 'exakt' noch 'monte-carlo': ${methode}`);
  }
  let bibliothek: Herkunft['bibliothek'] = null;
  if (o.bibliothek !== null && o.bibliothek !== undefined) {
    const b = objekt(o.bibliothek, `${pfad}.bibliothek`);
    bibliothek = {
      name: text(b.name, `${pfad}.bibliothek.name`, 60),
      version: text(b.version, `${pfad}.bibliothek.version`, 40),
    };
  }
  return {
    methode,
    erzeugt_am: text(o.erzeugt_am, `${pfad}.erzeugt_am`, 40),
    zweck: text(o.zweck, `${pfad}.zweck`),
    annahmen: pruefeAnnahmen(o.annahmen, `${pfad}.annahmen`),
    bibliothek,
    faelle_enumeriert: o.faelle_enumeriert === null || o.faelle_enumeriert === undefined
      ? null
      : ganzzahl(o.faelle_enumeriert, `${pfad}.faelle_enumeriert`, 1),
    quelle: text(o.quelle, `${pfad}.quelle`, 300),
  };
}

function pruefeKopf(v: unknown, block: string): Kopf & Record<string, unknown> {
  const o = objekt(v, block);
  const version = ganzzahl(o.vertrag_version, `${block}.vertrag_version`, 1, 999);
  if (version !== ERWARTETE_VERTRAG_VERSION) {
    throw new SchemaFehler(
      `${block}.vertrag_version`,
      `ist ${version}, erwartet wird ${ERWARTETE_VERTRAG_VERSION}. `
      + 'Die Daten neu erzeugen: npm run daten',
    );
  }
  const gefunden = text(o.block, `${block}.block`, 60);
  if (gefunden !== block) {
    throw new SchemaFehler(`${block}.block`, `enthält Daten des Blocks "${gefunden}"`);
  }
  return { ...o, vertrag_version: version, block, herkunft: pruefeHerkunft(o.herkunft, `${block}.herkunft`) };
}

function pruefeBefunde(v: unknown, pfad: string): Befund[] {
  return jedes(v, pfad, (e, p) => {
    const o = objekt(e, p);
    return {
      schluessel: text(o.schluessel, `${p}.schluessel`, 80),
      aussage: text(o.aussage, `${p}.aussage`),
    };
  });
}

// ---------------------------------------------------------------------------
// Die drei Blöcke
// ---------------------------------------------------------------------------

export function pruefeB1(roh: unknown): B1Outs {
  const k = pruefeKopf(roh, 'b1_outs');
  return {
    ...k,
    outs: jedes(k.outs, 'b1_outs.outs', (e, p) => {
      const o = objekt(e, p);
      const zeile = {
        outs: ganzzahl(o.outs, `${p}.outs`, 1, 52),
        turn: anteil(o.turn, `${p}.turn`),
        river_nach_fehlschlag: anteil(o.river_nach_fehlschlag, `${p}.river_nach_fehlschlag`),
        turn_oder_river: anteil(o.turn_oder_river, `${p}.turn_oder_river`),
        regel_zwei_karten: anteil(o.regel_zwei_karten, `${p}.regel_zwei_karten`),
        regel_abweichung_pp: zahl(o.regel_abweichung_pp, `${p}.regel_abweichung_pp`, -100, 100),
      };
      /* Innere Stimmigkeit, keine Typprüfung: Zwei Straßen können nie
         schlechter sein als eine. Eine Datei, die das verletzt, ist kaputt –
         auch wenn jeder Einzelwert für sich gültig aussieht. */
      if (zeile.turn_oder_river < zeile.turn || zeile.turn_oder_river < zeile.river_nach_fehlschlag) {
        throw new SchemaFehler(`${p}.turn_oder_river`,
          'ist kleiner als eine einzelne Straße – das kann nicht sein');
      }
      return zeile;
    }),
    zugbilder: jedes(k.zugbilder, 'b1_outs.zugbilder', (e, p) => {
      const o = objekt(e, p);
      const z = {
        name: text(o.name, `${p}.name`, 120),
        hand: text(o.hand, `${p}.hand`, 20),
        flop: text(o.flop, `${p}.flop`, 30),
        zielkategorie: text(o.zielkategorie, `${p}.zielkategorie`, 40),
        outs: ganzzahl(o.outs, `${p}.outs`, 1, 52),
        outs_falsch_gezaehlt: ganzzahl(o.outs_falsch_gezaehlt, `${p}.outs_falsch_gezaehlt`, 1, 52),
      };
      if (z.outs_falsch_gezaehlt < z.outs) {
        throw new SchemaFehler(`${p}.outs_falsch_gezaehlt`,
          'ist kleiner als die richtige Zählung – das ist der Sache nach unmöglich');
      }
      return z;
    }),
    gegenbeispiele: jedes(k.gegenbeispiele, 'b1_outs.gegenbeispiele', (e, p) => {
      const o = objekt(e, p);
      return {
        name: text(o.name, `${p}.name`, 120),
        hand: text(o.hand, `${p}.hand`, 20),
        flop: text(o.flop, `${p}.flop`, 30),
        out: text(o.out, `${p}.out`, 10),
        gegner: text(o.gegner, `${p}.gegner`, 20),
        hero_nachher: text(o.hero_nachher, `${p}.hero_nachher`, 40),
        gegner_nachher: text(o.gegner_nachher, `${p}.gegner_nachher`, 40),
        erklaerung: text(o.erklaerung, `${p}.erklaerung`),
      };
    }),
    befunde: pruefeBefunde(k.befunde, 'b1_outs.befunde'),
  };
}

export function pruefeB2(roh: unknown): B2PotOdds {
  const k = pruefeKopf(roh, 'b2_potodds');
  return {
    ...k,
    einsatzgroessen: jedes(k.einsatzgroessen, 'b2_potodds.einsatzgroessen', (e, p) => {
      const o = objekt(e, p);
      return {
        name: text(o.name, `${p}.name`, 60),
        einsatz_als_potanteil: zahl(o.einsatz_als_potanteil, `${p}.einsatz_als_potanteil`, 0, 100),
        einsatz_als_bruch: text(o.einsatz_als_bruch, `${p}.einsatz_als_bruch`, 20),
        /* Obergrenze 0,5 ist keine Vorsicht, sondern Mathematik: Der Gegner
           legt denselben Betrag hinein, mehr als die Hälfte kann nie nötig
           sein. Eine Datei, die das behauptet, hat einen Rechenfehler. */
        noetige_equity: zahl(o.noetige_equity, `${p}.noetige_equity`, 0, 0.5),
        pot_odds_zu_eins: zahl(o.pot_odds_zu_eins, `${p}.pot_odds_zu_eins`, 0, 1000),
        mindest_outs_turn: optionaleGanzzahl(o.mindest_outs_turn, `${p}.mindest_outs_turn`, 1, 52),
        mindest_outs_river: optionaleGanzzahl(o.mindest_outs_river, `${p}.mindest_outs_river`, 1, 52),
        mindest_outs_beide: optionaleGanzzahl(o.mindest_outs_beide, `${p}.mindest_outs_beide`, 1, 52),
      };
    }),
    befunde: pruefeBefunde(k.befunde, 'b2_potodds.befunde'),
  };
}

export function pruefeB3(roh: unknown): B3Kombinatorik {
  const k = pruefeKopf(roh, 'b3_kombinatorik');

  const zahlenkarte = (v: unknown, pfad: string): Record<string, number> => {
    const o = objekt(v, pfad);
    const ergebnis: Record<string, number> = {};
    for (const [schluessel, wert] of Object.entries(o)) {
      ergebnis[schluessel] = ganzzahl(wert, `${pfad}.${schluessel}`, 0, 10000);
    }
    if (Object.keys(ergebnis).length === 0) throw new SchemaFehler(pfad, 'ist leer');
    return ergebnis;
  };

  const blockerZeilen = (v: unknown, pfad: string) => jedes(v, pfad, (e, p) => {
    const o = objekt(e, p);
    const z = {
      bekannte_karten: ganzzahl(o.bekannte_karten, `${p}.bekannte_karten`, 1, 52),
      ohne_blocker: ganzzahl(o.ohne_blocker, `${p}.ohne_blocker`, 1, 100),
      schlimmstenfalls: ganzzahl(o.schlimmstenfalls, `${p}.schlimmstenfalls`, 0, 100),
      bestenfalls: ganzzahl(o.bestenfalls, `${p}.bestenfalls`, 0, 100),
      im_mittel: zahl(o.im_mittel, `${p}.im_mittel`, 0, 100),
    };
    if (z.schlimmstenfalls > z.bestenfalls || z.bestenfalls > z.ohne_blocker) {
      throw new SchemaFehler(p, 'schlimmster, bester und Ausgangswert stehen nicht in dieser Reihenfolge');
    }
    return z;
  });

  const bl = objekt(k.blocker, 'b3_kombinatorik.blocker');
  const bsp = objekt(k.beispiel, 'b3_kombinatorik.beispiel');
  const g = objekt(k.gesamt, 'b3_kombinatorik.gesamt');

  return {
    ...k,
    kombos_je_typ: zahlenkarte(k.kombos_je_typ, 'b3_kombinatorik.kombos_je_typ'),
    klassen_je_typ: zahlenkarte(k.klassen_je_typ, 'b3_kombinatorik.klassen_je_typ'),
    gesamt: {
      starthand_klassen: ganzzahl(g.starthand_klassen, 'b3_kombinatorik.gesamt.starthand_klassen', 1, 1000),
      zweikartenblaetter: ganzzahl(g.zweikartenblaetter, 'b3_kombinatorik.gesamt.zweikartenblaetter', 1, 10000),
    },
    blocker: {
      Paar: blockerZeilen(bl.Paar, 'b3_kombinatorik.blocker.Paar'),
      suited: blockerZeilen(bl.suited, 'b3_kombinatorik.blocker.suited'),
      offsuit: blockerZeilen(bl.offsuit, 'b3_kombinatorik.blocker.offsuit'),
    },
    beispiel: {
      hand: text(bsp.hand, 'b3_kombinatorik.beispiel.hand', 20),
      board: text(bsp.board, 'b3_kombinatorik.beispiel.board', 30),
      summe_vorher: ganzzahl(bsp.summe_vorher, 'b3_kombinatorik.beispiel.summe_vorher', 1, 10000),
      summe_nachher: ganzzahl(bsp.summe_nachher, 'b3_kombinatorik.beispiel.summe_nachher', 0, 10000),
      je_starthand: jedes(bsp.je_starthand, 'b3_kombinatorik.beispiel.je_starthand', (e, p) => {
        const o = objekt(e, p);
        const s = {
          hand: text(o.hand, `${p}.hand`, 6),
          typ: text(o.typ, `${p}.typ`, 20),
          vorher: ganzzahl(o.vorher, `${p}.vorher`, 0, 100),
          nachher: ganzzahl(o.nachher, `${p}.nachher`, 0, 100),
          weggeblockt: ganzzahl(o.weggeblockt, `${p}.weggeblockt`, 0, 100),
        };
        if (s.weggeblockt !== s.vorher - s.nachher) {
          throw new SchemaFehler(p, `geht nicht auf: ${s.vorher} − ${s.nachher} ≠ ${s.weggeblockt}`);
        }
        return s;
      }),
    },
    befunde: pruefeBefunde(k.befunde, 'b3_kombinatorik.befunde'),
  };
}

// ---------------------------------------------------------------------------
// Laden
// ---------------------------------------------------------------------------

const ORDNER = 'pokermath';
const zwischenspeicher = new Map<string, Promise<unknown>>();

async function hole<T>(block: string, pruefe: (roh: unknown) => T): Promise<T> {
  if (!zwischenspeicher.has(block)) {
    zwischenspeicher.set(block, (async () => {
      let roh: unknown;
      try {
        const url = new URL(`${ORDNER}/${block}.json`, document.baseURI).toString();
        const antwort = await fetch(url, { cache: 'no-store' });
        if (!antwort.ok) {
          throw new SchemaFehler(block, `konnte nicht geladen werden (HTTP ${antwort.status})`);
        }
        roh = await antwort.json();
      } catch (fehler) {
        if (fehler instanceof SchemaFehler) throw fehler;
        throw new SchemaFehler(block, `ist nicht erreichbar oder kein gültiges JSON: ${fehler}`);
      }
      return pruefe(roh);
    })());
  }
  return (await zwischenspeicher.get(block)!) as T;
}

export const ladeB1 = () => hole('b1_outs', pruefeB1);
export const ladeB2 = () => hole('b2_potodds', pruefeB2);
export const ladeB3 = () => hole('b3_kombinatorik', pruefeB3);

/** Nur für Tests. */
export function _leereZwischenspeicher(): void {
  zwischenspeicher.clear();
}
