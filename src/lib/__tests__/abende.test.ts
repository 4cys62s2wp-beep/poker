/* Abende: was von einem gespielten Abend übrig bleibt.
   ===================================================

   Der Kern dieser Datei sind die **Plätze**. Sie werden gerechnet, nicht
   eingetragen — und damit sind sie eine Aussage über Zahlen, die einen
   Testfall braucht: Wer noch Chips hat, steht vor allen Ausgeschiedenen; wer
   länger durchgehalten hat, steht vor dem, der früher raus war; und zwei
   gleiche Stände bekommen denselben Platz statt einer erfundenen
   Reihenfolge. */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  HOECHSTZAHL, SCHLUESSEL_ABENDE, abendeVon, archiviere, ergaenze, ladeAbende,
  platziere, speichereAbende, spielerUebersicht, type Abend,
} from '../session/abende';
import type { LaufendeSession, Spieler } from '../session/laufend';

class SpeicherErsatz {
  private daten = new Map<string, string>();
  getItem(k: string) { return this.daten.has(k) ? this.daten.get(k)! : null; }
  setItem(k: string, v: string) { this.daten.set(k, String(v)); }
  removeItem(k: string) { this.daten.delete(k); }
}

const echterSpeicher = (globalThis as Record<string, unknown>).localStorage;
beforeEach(() => {
  Object.defineProperty(globalThis, 'localStorage', {
    value: new SpeicherErsatz(), configurable: true, writable: true,
  });
});
afterEach(() => {
  Object.defineProperty(globalThis, 'localStorage', {
    value: echterSpeicher, configurable: true, writable: true,
  });
});

const MINUTE = 60_000;
const START = 1_770_000_000_000;

function spieler(name: string, stand: number | null, raus_um: number | null = null): Spieler {
  return { name, eingekauft: 3000, stand, raus_um };
}

function laufend(ueber: Partial<LaufendeSession> = {}): LaufendeSession {
  return {
    begonnen: START,
    spieler: [spieler('Lorenz', 9000), spieler('Mira', 3000), spieler('Jonas', null, START + 40 * MINUTE)],
    startchips: 3000,
    stufen: [[25, 50], [50, 100], [75, 150], [100, 200]],
    stufendauer_s: 1200,
    stufe: 0,
    verbraucht_ms: 0,
    laeuft_seit: START,
    ...ueber,
  };
}

describe('Die Plätze werden gerechnet', () => {
  it('stellt jeden mit Chips vor jeden Ausgeschiedenen', () => {
    const p = platziere([
      spieler('Raus', null, START + 10 * MINUTE),
      spieler('Kleiner Stapel', 200),
    ]);
    expect(p.map((s) => s.name)).toEqual(['Kleiner Stapel', 'Raus']);
    expect(p[0].platz).toBe(1);
    expect(p[1].platz).toBe(2);
  });

  it('ordnet die Verbliebenen nach dem Stand', () => {
    const p = platziere([spieler('B', 3000), spieler('A', 9000), spieler('C', 100)]);
    expect(p.map((s) => s.name)).toEqual(['A', 'B', 'C']);
    expect(p.map((s) => s.platz)).toEqual([1, 2, 3]);
  });

  it('belohnt beim Ausscheiden das längere Durchhalten', () => {
    const p = platziere([
      spieler('Früh', null, START + 5 * MINUTE),
      spieler('Spät', null, START + 90 * MINUTE),
      spieler('Mitte', null, START + 40 * MINUTE),
    ]);
    expect(p.map((s) => s.name)).toEqual(['Spät', 'Mitte', 'Früh']);
  });

  it('gibt gleichen Ständen denselben Platz und überspringt danach', () => {
    /* 1, 2, 2, 4 — nicht 1, 2, 3, 4. Zwischen zwei gleichen Ständen eine
       Reihenfolge zu erfinden wäre eine Behauptung über Daten, die das
       nicht hergeben. */
    const p = platziere([
      spieler('A', 5000), spieler('B', 3000), spieler('C', 3000), spieler('D', 1000),
    ]);
    expect(p.map((s) => s.platz)).toEqual([1, 2, 2, 4]);
  });

  it('kommt mit einem Abend zurecht, bei dem niemand ausgeschieden ist', () => {
    const p = platziere([spieler('A', 4000), spieler('B', 2000)]);
    expect(p.every((s) => s.raus_um === null)).toBe(true);
    expect(p.map((s) => s.platz)).toEqual([1, 2]);
  });

  it('verliert niemanden', () => {
    const namen = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const p = platziere(namen.map((n, i) => spieler(n, i % 2 ? i * 100 : null, START + i * MINUTE)));
    expect(p).toHaveLength(namen.length);
    expect(new Set(p.map((s) => s.name))).toEqual(new Set(namen));
  });
});

describe('Aus dem laufenden Abend wird ein abgeschlossener', () => {
  it('übernimmt Namen, Stände und Zeit', () => {
    const a = archiviere(laufend(), START + 95 * MINUTE);
    expect(a.id).toBe(String(START));
    expect(a.begonnen).toBe(START);
    expect(a.beendet).toBe(START + 95 * MINUTE);
    expect(a.gespielt_ms).toBe(95 * MINUTE);
    expect(a.spieler.map((s) => s.name)).toEqual(['Lorenz', 'Mira', 'Jonas']);
    expect(a.spieler.map((s) => s.platz)).toEqual([1, 2, 3]);
  });

  it('zählt Pausen nicht als Spielzeit', () => {
    const angehalten = laufend({ verbraucht_ms: 30 * MINUTE, laeuft_seit: null });
    const a = archiviere(angehalten, START + 300 * MINUTE);
    expect(a.gespielt_ms).toBe(30 * MINUTE);
  });

  it('hält fest, wie weit die Blinds gekommen sind', () => {
    /* 95 Minuten bei 20 Minuten je Stufe: in der fünften — aber es gibt nur
       vier, also die vierte. */
    expect(archiviere(laufend(), START + 95 * MINUTE).erreichte_stufe).toBe(4);
    expect(archiviere(laufend(), START + 25 * MINUTE).erreichte_stufe).toBe(2);
    expect(archiviere(laufend(), START + 1 * MINUTE).erreichte_stufe).toBe(1);
  });

  it('stürzt bei einem beschädigten Stand ohne Stufendauer nicht ab', () => {
    expect(archiviere(laufend({ stufendauer_s: 0 }), START + 95 * MINUTE).erreichte_stufe).toBe(1);
  });
});

describe('Die Liste der Abende', () => {
  function abend(begonnen: number, namen: string[]): Abend {
    return archiviere(
      laufend({ begonnen, spieler: namen.map((n, i) => spieler(n, 1000 * (namen.length - i))) }),
      begonnen + 100 * MINUTE,
    );
  }

  it('kommt nach dem Schreiben unverändert zurück', () => {
    const eins = abend(START, ['Lorenz', 'Mira']);
    speichereAbende([eins]);
    expect(ladeAbende()).toEqual([eins]);
  });

  it('stellt den neuesten nach vorn', () => {
    let liste = ergaenze([], abend(START, ['A']));
    liste = ergaenze(liste, abend(START + 7 * 24 * 60 * MINUTE, ['B']));
    liste = ergaenze(liste, abend(START - 7 * 24 * 60 * MINUTE, ['C']));
    expect(liste.map((a) => a.spieler[0].name)).toEqual(['B', 'A', 'C']);
  });

  it('legt denselben Abend nicht zweimal an', () => {
    const eins = abend(START, ['A']);
    const liste = ergaenze(ergaenze([], eins), eins);
    expect(liste).toHaveLength(1);
  });

  it('hebt nicht unbegrenzt auf', () => {
    let liste: Abend[] = [];
    for (let i = 0; i < HOECHSTZAHL + 25; i += 1) liste = ergaenze(liste, abend(START + i * MINUTE, ['A']));
    expect(liste).toHaveLength(HOECHSTZAHL);
    /* Weggeworfen wird der älteste, nicht der neueste. */
    expect(liste[0].begonnen).toBe(START + (HOECHSTZAHL + 24) * MINUTE);
  });

  it('rettet den Rest, wenn ein einzelner Eintrag beschädigt ist', () => {
    /* Anders als beim laufenden Abend: Ein kaputter Eintrag von vor zwei
       Jahren darf nicht dreißig Erinnerungen mitnehmen. */
    const gut = abend(START, ['A']);
    localStorage.setItem(SCHLUESSEL_ABENDE, JSON.stringify([gut, { id: 5 }, null, gut]));
    expect(ladeAbende()).toHaveLength(2);
  });

  it('meldet eine leere Liste statt eines Fehlers, wenn nichts lesbar ist', () => {
    localStorage.setItem(SCHLUESSEL_ABENDE, '{kaputt');
    expect(ladeAbende()).toEqual([]);
  });
});

describe('Frühere Abende über einen Namen finden — ohne Suchfeld', () => {
  const abende = [
    archiviere(laufend({ begonnen: START, spieler: [spieler('Lorenz', 9000), spieler('Mira', 0)] }), START + MINUTE),
    archiviere(laufend({ begonnen: START - 10 * MINUTE, spieler: [spieler('mira ', 9000), spieler('Jonas', 0)] }), START),
  ];

  it('findet jeden Abend, an dem der Name vorkommt', () => {
    expect(abendeVon(abende, 'Lorenz')).toHaveLength(1);
    expect(abendeVon(abende, 'Mira')).toHaveLength(2);
    expect(abendeVon(abende, 'niemand')).toHaveLength(0);
  });

  it('stört sich nicht an Schreibweise und Leerzeichen', () => {
    /* Am Küchentisch tippt niemand einen Namen zweimal gleich. */
    expect(abendeVon(abende, '  MIRA')).toHaveLength(2);
  });

  it('listet jeden Namen genau einmal, den zuletzt gespielten zuerst', () => {
    const u = spielerUebersicht(abende);
    expect(u.map((s) => s.name)).toEqual(['Lorenz', 'Mira', 'Jonas']);
    expect(u.find((s) => s.name === 'Mira')!.abende).toBe(2);
  });

  it('nimmt die zuletzt benutzte Schreibweise', () => {
    const u = spielerUebersicht(abende);
    expect(u.find((s) => s.abende === 2)!.name).toBe('Mira');
  });

  it('zählt Siege aus den gerechneten Plätzen', () => {
    const u = spielerUebersicht(abende);
    expect(u.find((s) => s.name === 'Lorenz')!.siege).toBe(1);
    expect(u.find((s) => s.name === 'Mira')!.siege).toBe(1);
    expect(u.find((s) => s.name === 'Jonas')!.siege).toBe(0);
  });

  it('übergeht leere Namen, statt eine namenlose Zeile anzulegen', () => {
    const mitLeer = [archiviere(
      laufend({ begonnen: START, spieler: [spieler('A', 100), spieler('   ', null, START)] }),
      START + MINUTE,
    )];
    expect(spielerUebersicht(mitLeer).map((s) => s.name)).toEqual(['A']);
  });
});
