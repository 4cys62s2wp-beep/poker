/* Lädt die gerechneten Daten und prüft sie streng.
   ================================================

   Warum so streng
   ---------------
   Diese Dateien liegen im `public/`-Ordner und werden über das Netz geholt.
   Sie kommen zwar aus dem eigenen Generator, aber die App darf das nicht
   voraussetzen: Ein halb übertragener Download, eine veraltete Datei im
   Zwischenspeicher des Browsers oder eine Version aus einem anderen Zweig
   sehen alle wie gültiges JSON aus.

   Deshalb gilt hier dasselbe Vorgehen wie bei `monetization.json` und
   `legal.json`: **Bei jedem Zweifel `null`.** Eine Seite ohne Zahlen kann
   sagen „Daten fehlen"; eine Seite mit falschen Zahlen bringt jemandem etwas
   Falsches bei.

   Die Versionsprüfung
   -------------------
   Passt `vertrag_version` nicht, wird die Datei abgelehnt – auch dann, wenn
   sie sonst gültig aussieht. Genau dafür ist die Version da: Ein Feld kann
   seine Bedeutung ändern, ohne seinen Typ zu ändern, und dann sieht die
   falsche Zahl völlig richtig aus. */

import {
  ERWARTETE_VERTRAG_VERSION,
  type Annahmen,
  type B1Outs,
  type B2PotOdds,
  type B3Kombinatorik,
  type B4Equity,
  type Befund,
  type Kopf,
} from './typen';

// ---------------------------------------------------------------------------
// Kleine Prüfhelfer
// ---------------------------------------------------------------------------

function istObjekt(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/** Eine endliche Zahl im erlaubten Bereich – NaN und Infinity fallen durch. */
function zahl(v: unknown, min = -Infinity, max = Infinity): number | null {
  return typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max ? v : null;
}

/** Eine Wahrscheinlichkeit. Außerhalb von 0..1 ist sie keine. */
function anteil(v: unknown): number | null {
  return zahl(v, 0, 1);
}

function ganzzahl(v: unknown, min = 0, max = Number.MAX_SAFE_INTEGER): number | null {
  const n = zahl(v, min, max);
  return n !== null && Number.isInteger(n) ? n : null;
}

function text(v: unknown, maxLaenge = 4000): string | null {
  return typeof v === 'string' && v.length > 0 && v.length <= maxLaenge ? v : null;
}

function liste(v: unknown): unknown[] | null {
  return Array.isArray(v) && v.length > 0 ? v : null;
}

/** Alle Einträge durch eine Prüfung schicken. Fällt einer durch, fällt alles durch:
 *  Eine Tabelle mit einer stillschweigend fehlenden Zeile ist gefährlicher als
 *  gar keine Tabelle. */
function alle<T>(roh: unknown, pruefe: (e: unknown) => T | null): T[] | null {
  const arr = liste(roh);
  if (!arr) return null;
  const ergebnis: T[] = [];
  for (const e of arr) {
    const geprueft = pruefe(e);
    if (geprueft === null) return null;
    ergebnis.push(geprueft);
  }
  return ergebnis;
}

function pruefeAnnahmen(v: unknown): Annahmen | null {
  if (!istObjekt(v)) return null;
  const sicht = text(v.sicht);
  const unbekannte = text(v.unbekannte_karten);
  const split = text(v.split_pot);
  if (!sicht || !unbekannte || !split) return null;
  return { sicht, unbekannte_karten: unbekannte, split_pot: split };
}

function pruefeKopf(v: unknown, block: string): Kopf | null {
  if (!istObjekt(v)) return null;
  if (v.vertrag_version !== ERWARTETE_VERTRAG_VERSION) return null;
  if (v.block !== block) return null;
  if (v.methode !== 'exakt' && v.methode !== 'monte-carlo') return null;
  const erzeugt = text(v.erzeugt_am, 40);
  const quelle = text(v.quelle, 200);
  const annahmen = pruefeAnnahmen(v.annahmen);
  if (!erzeugt || !quelle || !annahmen) return null;
  return {
    vertrag_version: ERWARTETE_VERTRAG_VERSION,
    block,
    methode: v.methode,
    erzeugt_am: erzeugt,
    annahmen,
    quelle,
  };
}

function pruefeBefunde(v: unknown): Befund[] | null {
  return alle<Befund>(v, (e) => {
    if (!istObjekt(e)) return null;
    const schluessel = text(e.schluessel, 80);
    const aussage = text(e.aussage);
    return schluessel && aussage ? { schluessel, aussage } : null;
  });
}

// ---------------------------------------------------------------------------
// Die vier Blöcke
// ---------------------------------------------------------------------------

export function parseB1(roh: unknown): B1Outs | null {
  if (!istObjekt(roh)) return null;
  const kopf = pruefeKopf(roh, 'b1_outs');
  if (!kopf) return null;

  const outs = alle(roh.outs, (e) => {
    if (!istObjekt(e)) return null;
    const o = ganzzahl(e.outs, 1, 52);
    const turn = anteil(e.turn);
    const river = anteil(e.river_nach_fehlschlag);
    const beide = anteil(e.turn_oder_river);
    const regel = anteil(e.regel_zwei_karten);
    const abw = zahl(e.regel_abweichung_pp, -100, 100);
    if (o === null || turn === null || river === null || beide === null
        || regel === null || abw === null) return null;
    /* Innere Stimmigkeit: Zwei Straßen können nie schlechter sein als eine.
       Eine Datei, die das verletzt, ist kaputt – egal wie gültig ihr JSON ist. */
    if (beide < turn || beide < river) return null;
    return {
      outs: o, turn, river_nach_fehlschlag: river, turn_oder_river: beide,
      regel_zwei_karten: regel, regel_abweichung_pp: abw,
    };
  });

  const zugbilder = alle(roh.zugbilder, (e) => {
    if (!istObjekt(e)) return null;
    const name = text(e.name, 120);
    const hand = text(e.hand, 20);
    const flop = text(e.flop, 30);
    const ziel = text(e.zielkategorie, 40);
    const o = ganzzahl(e.outs, 0, 52);
    const falsch = ganzzahl(e.outs_falsch_gezaehlt, 0, 52);
    if (!name || !hand || !flop || !ziel || o === null || falsch === null) return null;
    // Die falsch gezählte Variante kann nie kleiner sein als die richtige.
    if (falsch < o) return null;
    return { name, hand, flop, zielkategorie: ziel, outs: o, outs_falsch_gezaehlt: falsch };
  });

  const gegenbeispiele = alle(roh.gegenbeispiele, (e) => {
    if (!istObjekt(e)) return null;
    const felder = ['name', 'hand', 'flop', 'out', 'gegner', 'hero_nachher',
      'gegner_nachher', 'erklaerung'] as const;
    const werte: Record<string, string> = {};
    for (const f of felder) {
      const w = text(e[f]);
      if (!w) return null;
      werte[f] = w;
    }
    return werte as unknown as B1Outs['gegenbeispiele'][number];
  });

  const befunde = pruefeBefunde(roh.befunde);
  if (!outs || !zugbilder || !gegenbeispiele || !befunde) return null;
  return { ...kopf, outs, zugbilder, gegenbeispiele, befunde };
}

export function parseB2(roh: unknown): B2PotOdds | null {
  if (!istObjekt(roh)) return null;
  const kopf = pruefeKopf(roh, 'b2_potodds');
  if (!kopf) return null;

  const einsatzgroessen = alle(roh.einsatzgroessen, (e) => {
    if (!istObjekt(e)) return null;
    const name = text(e.name, 60);
    const potanteil = zahl(e.einsatz_als_potanteil, 0, 100);
    const bruch = text(e.einsatz_als_bruch, 20);
    /* Obergrenze 0,5 ist keine Vorsicht, sondern Mathematik: Der Gegner legt
       denselben Betrag hinein, mehr als die Hälfte kann nie nötig sein. */
    const equity = zahl(e.noetige_equity, 0, 0.5);
    const odds = zahl(e.pot_odds_zu_eins, 0, 1000);
    if (!name || potanteil === null || !bruch || equity === null || odds === null) return null;

    const outsFeld = (v: unknown) =>
      v === null ? null : ganzzahl(v, 1, 52);
    const t = outsFeld(e.mindest_outs_turn);
    const r = outsFeld(e.mindest_outs_river);
    const b = outsFeld(e.mindest_outs_beide);
    // `null` ist erlaubt (nicht erreichbar), eine ungültige Zahl nicht.
    if (e.mindest_outs_turn !== null && t === null) return null;
    if (e.mindest_outs_river !== null && r === null) return null;
    if (e.mindest_outs_beide !== null && b === null) return null;

    return {
      name, einsatz_als_potanteil: potanteil, einsatz_als_bruch: bruch,
      noetige_equity: equity, pot_odds_zu_eins: odds,
      mindest_outs_turn: t, mindest_outs_river: r, mindest_outs_beide: b,
    };
  });

  const befunde = pruefeBefunde(roh.befunde);
  if (!einsatzgroessen || !befunde) return null;
  return { ...kopf, einsatzgroessen, befunde };
}

export function parseB3(roh: unknown): B3Kombinatorik | null {
  if (!istObjekt(roh)) return null;
  const kopf = pruefeKopf(roh, 'b3_kombinatorik');
  if (!kopf) return null;

  const zahlenkarte = (v: unknown): Record<string, number> | null => {
    if (!istObjekt(v)) return null;
    const ergebnis: Record<string, number> = {};
    for (const [k, w] of Object.entries(v)) {
      const n = ganzzahl(w, 0, 10000);
      if (n === null) return null;
      ergebnis[k] = n;
    }
    return Object.keys(ergebnis).length > 0 ? ergebnis : null;
  };

  const blockerZeilen = (v: unknown) =>
    alle(v, (e) => {
      if (!istObjekt(e)) return null;
      const bekannt = ganzzahl(e.bekannte_karten, 1, 52);
      const ohne = ganzzahl(e.ohne_blocker, 1, 100);
      const schlimm = ganzzahl(e.schlimmstenfalls, 0, 100);
      const best = ganzzahl(e.bestenfalls, 0, 100);
      const mittel = zahl(e.im_mittel, 0, 100);
      if (bekannt === null || ohne === null || schlimm === null
          || best === null || mittel === null) return null;
      // Schlimmster Fall darf nie über dem besten liegen, keiner über dem Ausgangswert.
      if (schlimm > best || best > ohne) return null;
      return { bekannte_karten: bekannt, ohne_blocker: ohne,
        schlimmstenfalls: schlimm, bestenfalls: best, im_mittel: mittel };
    });

  const kombos = zahlenkarte(roh.kombos_je_typ);
  const klassen = zahlenkarte(roh.klassen_je_typ);
  const g = istObjekt(roh.gesamt) ? roh.gesamt : null;
  const klassenZahl = g ? ganzzahl(g.starthand_klassen, 1, 1000) : null;
  const blaetter = g ? ganzzahl(g.zweikartenblaetter, 1, 10000) : null;

  const bl = istObjekt(roh.blocker) ? roh.blocker : null;
  const paar = bl ? blockerZeilen(bl.Paar) : null;
  const suited = bl ? blockerZeilen(bl.suited) : null;
  const offsuit = bl ? blockerZeilen(bl.offsuit) : null;

  const bsp = istObjekt(roh.beispiel) ? roh.beispiel : null;
  const bHand = bsp ? text(bsp.hand, 20) : null;
  const bBoard = bsp ? text(bsp.board, 30) : null;
  const vorher = bsp ? ganzzahl(bsp.summe_vorher, 1, 10000) : null;
  const nachher = bsp ? ganzzahl(bsp.summe_nachher, 0, 10000) : null;
  const jeHand = bsp ? alle(bsp.je_starthand, (e) => {
    if (!istObjekt(e)) return null;
    const hand = text(e.hand, 6);
    const typ = text(e.typ, 20);
    const v = ganzzahl(e.vorher, 0, 100);
    const n = ganzzahl(e.nachher, 0, 100);
    const weg = ganzzahl(e.weggeblockt, 0, 100);
    if (!hand || !typ || v === null || n === null || weg === null) return null;
    if (n > v || weg !== v - n) return null;  // muss aufgehen
    return { hand, typ, vorher: v, nachher: n, weggeblockt: weg };
  }) : null;

  const befunde = pruefeBefunde(roh.befunde);
  if (!kombos || !klassen || klassenZahl === null || blaetter === null
      || !paar || !suited || !offsuit || !bHand || !bBoard
      || vorher === null || nachher === null || !jeHand || !befunde) return null;
  if (nachher > vorher) return null;

  return {
    ...kopf,
    kombos_je_typ: kombos,
    klassen_je_typ: klassen,
    gesamt: { starthand_klassen: klassenZahl, zweikartenblaetter: blaetter },
    blocker: { Paar: paar, suited, offsuit },
    beispiel: { hand: bHand, board: bBoard, summe_vorher: vorher,
      summe_nachher: nachher, je_starthand: jeHand },
    befunde,
  };
}

export function parseB4(roh: unknown): B4Equity | null {
  if (!istObjekt(roh)) return null;
  const kopf = pruefeKopf(roh, 'b4_preflop_equity');
  if (!kopf) return null;
  const hinweis = text(roh.hinweis_zur_spanne);

  const matchups = alle(roh.matchups, (e) => {
    if (!istObjekt(e)) return null;
    const a = text(e.a, 6);
    const b = text(e.b, 6);
    const equity = anteil(e.equity_a);
    const spanne = zahl(e.spanne_pp, 0, 100);
    if (!a || !b || equity === null || spanne === null) return null;
    if (typeof e.spanne_relevant !== 'boolean') return null;

    let konfigurationen;
    if (e.spanne_relevant) {
      /* Ist die Spanne erheblich, MÜSSEN die Konfigurationen beiliegen – sonst
         könnte die App den Einzelwert nicht mit der Spanne zeigen, und genau
         das verlangt die Vorgabe. Fehlen sie, ist die Datei unbrauchbar. */
      konfigurationen = alle(e.farbkonfigurationen, (k) => {
        if (!istObjekt(k)) return null;
        const bez = text(k.beziehung, 120);
        const h = ganzzahl(k.haeufigkeit, 1, 10000);
        const eq = anteil(k.equity_a);
        return bez && h !== null && eq !== null
          ? { beziehung: bez, haeufigkeit: h, equity_a: eq } : null;
      });
      if (!konfigurationen) return null;
    }
    return { a, b, equity_a: equity, spanne_pp: spanne,
      spanne_relevant: e.spanne_relevant, farbkonfigurationen: konfigurationen };
  });

  const befunde = pruefeBefunde(roh.befunde);
  if (!hinweis || !matchups || !befunde) return null;
  return { ...kopf, hinweis_zur_spanne: hinweis, matchups, befunde };
}

// ---------------------------------------------------------------------------
// Laden
// ---------------------------------------------------------------------------

const ORDNER = 'pokermath';

/** Einmal geladen, dann behalten. Die Dateien ändern sich zur Laufzeit nicht. */
const zwischenspeicher = new Map<string, Promise<unknown>>();

async function hole<T>(block: string, pruefe: (roh: unknown) => T | null): Promise<T | null> {
  if (!zwischenspeicher.has(block)) {
    zwischenspeicher.set(block, (async () => {
      try {
        const url = new URL(`${ORDNER}/${block}.json`, document.baseURI).toString();
        const antwort = await fetch(url, { cache: 'no-store' });
        if (!antwort.ok) return null;
        return pruefe(await antwort.json());
      } catch {
        // Kein Netz, kaputtes JSON, abgebrochener Download – alles derselbe Fall.
        return null;
      }
    })());
  }
  return (await zwischenspeicher.get(block)!) as T | null;
}

export const ladeB1 = () => hole('b1_outs', parseB1);
export const ladeB2 = () => hole('b2_potodds', parseB2);
export const ladeB3 = () => hole('b3_kombinatorik', parseB3);
/** Groß – erst laden, wenn jemand die Equity-Ansicht wirklich öffnet. */
export const ladeB4 = () => hole('b4_preflop_equity', parseB4);

/** Nur für Tests: den Zwischenspeicher leeren. */
export function _leereZwischenspeicher(): void {
  zwischenspeicher.clear();
}
