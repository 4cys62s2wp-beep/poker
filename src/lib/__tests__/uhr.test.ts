/* Uhr und Zustand der Live-Session.
   ================================

   Geprüft werden die beiden Eigenschaften, deren Fehlen einen Abend
   tatsächlich ruiniert:

   1. **Die Zeit stimmt auch dann, wenn niemand hingeschaut hat.** Das Gerät
      liegt in der Tischmitte und sperrt sich; ein herunterzählender Zähler
      stünde dann still, während die Blindstufe weiterläuft. Diese Tests
      führen die Uhr deshalb nie „in Echtzeit", sondern springen — genau so,
      wie es am Tisch passiert.
   2. **Der Stand überlebt alles.** Neu geladen, App weggewischt, Akku leer:
      beim Öffnen steht die Runde wieder da, an derselben Stelle.

   Kein Test wartet. Ein Test, der eine Stufendauer abwartet, wird nach der
   dritten Ausführung übersprungen und ist dann kein Test mehr. */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  VORWARNUNG_S, anhalten, fortsetzen, standDerUhr,
} from '../live/uhr';
import {
  SCHLUESSEL, ladeLaufende, nochDabei, speichereLaufende, verbraucht,
  type LaufendeSession,
} from '../session/laufend';

/* ---------------------------------------------------------------- Umgebung */

/** Ein Gerätespeicher, der sich wie der echte verhält. Vitest läuft ohne
 *  Browser; ohne diesen Ersatz prüfte der Zustandsteil gar nichts. */
class SpeicherErsatz {
  private daten = new Map<string, string>();
  getItem(k: string) { return this.daten.has(k) ? this.daten.get(k)! : null; }
  setItem(k: string, v: string) { this.daten.set(k, String(v)); }
  removeItem(k: string) { this.daten.delete(k); }
  clear() { this.daten.clear(); }
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

/* ------------------------------------------------------------- Beispielabend */

const MINUTE = 60_000;
/** Ein beliebiger, fester Startzeitpunkt. Kein `Date.now()`: ein Test, dessen
 *  Ergebnis von der Uhrzeit seiner Ausführung abhängt, ist keiner. */
const START = 1_770_000_000_000;

/** Ein Abend zu fünft, zwanzig Minuten je Stufe, sechs Stufen. */
function abend(ueber: Partial<LaufendeSession> = {}): LaufendeSession {
  return {
    begonnen: START,
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
    laeuft_seit: START,
    ...ueber,
  };
}

const STUFE_MS = 20 * MINUTE;

/* ------------------------------------------------------------------ Die Uhr */

describe('Uhr: welche Blindstufe gerade gilt', () => {
  it('beginnt auf der ersten Stufe mit der vollen Zeit', () => {
    const u = standDerUhr(abend(), START);
    expect(u.stufeIndex).toBe(0);
    expect(u.blinds).toEqual([25, 50]);
    expect(u.rest_ms).toBe(STUFE_MS);
    expect(u.naechste).toEqual([50, 100]);
    expect(u.istLetzte).toBe(false);
  });

  it('nennt in der Mitte jeder Stufe genau diese Stufe', () => {
    const s = abend();
    for (let i = 0; i < s.stufen.length; i += 1) {
      const mitte = START + i * STUFE_MS + STUFE_MS / 2;
      const u = standDerUhr(s, mitte);
      expect(u.stufeIndex, `Mitte der Stufe ${i + 1}`).toBe(i);
      expect(u.blinds).toEqual(s.stufen[i]);
    }
  });

  it('wechselt genau auf die Sekunde, nicht davor und nicht danach', () => {
    const s = abend();
    expect(standDerUhr(s, START + STUFE_MS - 1).stufeIndex).toBe(0);
    expect(standDerUhr(s, START + STUFE_MS).stufeIndex).toBe(1);
  });

  it('rechnet aus Zeitstempeln — ein Sprung über zwei Stunden landet richtig', () => {
    /* Das Gerät war gesperrt, es gab keinen einzigen Takt. Ein Zähler stünde
       jetzt bei null; die Rechnung aus Zeitstempeln nicht. */
    const u = standDerUhr(abend(), START + 125 * MINUTE);
    expect(u.stufeIndex).toBe(5);
    expect(u.verstrichen_ms).toBe(125 * MINUTE);
  });

  it('bleibt auf der letzten Stufe stehen, statt ins Leere zu laufen', () => {
    const s = abend();
    const spaet = standDerUhr(s, START + 40 * 60 * MINUTE);
    expect(spaet.stufeIndex).toBe(s.stufen.length - 1);
    expect(spaet.istLetzte).toBe(true);
    expect(spaet.naechste).toBeNull();
    expect(spaet.rest_ms).toBe(0);
  });

  it('gibt nie eine negative Restzeit und nie mehr als eine Stufendauer aus', () => {
    const s = abend();
    for (let m = 0; m <= 300; m += 7) {
      const u = standDerUhr(s, START + m * MINUTE);
      expect(u.rest_ms, `${m} min`).toBeGreaterThanOrEqual(0);
      expect(u.rest_ms, `${m} min`).toBeLessThanOrEqual(STUFE_MS);
    }
  });

  it('überlebt einen beschädigten Stand ohne Stufendauer', () => {
    /* `ladeLaufende` setzt fehlende Zahlenfelder auf 0. Eine Division durch
       null würde hier einen Abend beenden, der noch läuft. */
    const u = standDerUhr(abend({ stufendauer_s: 0 }), START + 90 * MINUTE);
    expect(u.stufeIndex).toBe(0);
    expect(u.blinds).toEqual([25, 50]);
    expect(Number.isFinite(u.rest_ms)).toBe(true);
  });
});

describe('Uhr: die Vorwarnung', () => {
  it('meldet sich genau in der letzten Minute vor dem Wechsel', () => {
    const s = abend();
    const wechsel = START + STUFE_MS;
    expect(standDerUhr(s, wechsel - (VORWARNUNG_S + 1) * 1000).knapp).toBe(false);
    expect(standDerUhr(s, wechsel - VORWARNUNG_S * 1000).knapp).toBe(true);
    expect(standDerUhr(s, wechsel - 1000).knapp).toBe(true);
  });

  it('schweigt in der Pause — dort soll nichts piepen', () => {
    const s = abend();
    const kurzVorSchluss = anhalten(s, START + STUFE_MS - 10_000);
    expect(standDerUhr(kurzVorSchluss, START + 5 * 60 * MINUTE).knapp).toBe(false);
    expect(standDerUhr(kurzVorSchluss, START + 5 * 60 * MINUTE).rest_ms).toBe(10_000);
  });

  it('schweigt auf der letzten Stufe — es kommt nichts mehr', () => {
    const s = abend();
    expect(standDerUhr(s, START + 6 * STUFE_MS - 30_000).knapp).toBe(false);
  });
});

/* --------------------------------------------------------- Pause und Weiter */

describe('Pause hält alles an und setzt an derselben Stelle fort', () => {
  it('friert die verstrichene Zeit ein', () => {
    const s = anhalten(abend(), START + 5 * MINUTE);
    expect(s.laeuft_seit).toBeNull();
    expect(s.verbraucht_ms).toBe(5 * MINUTE);
    /* Eine Stunde später ist immer noch dieselbe Zeit verstrichen. */
    expect(verbraucht(s, START + 65 * MINUTE)).toBe(5 * MINUTE);
    expect(standDerUhr(s, START + 65 * MINUTE).stufeIndex).toBe(0);
  });

  it('verliert beim Fortsetzen nichts und zählt nichts doppelt', () => {
    const pausiert = anhalten(abend(), START + 5 * MINUTE);
    const weiter = fortsetzen(pausiert, START + 65 * MINUTE);
    /* Direkt nach dem Fortsetzen: genau die fünf Minuten von vorher. */
    expect(verbraucht(weiter, START + 65 * MINUTE)).toBe(5 * MINUTE);
    /* Fünfzehn Minuten später: zwanzig — also der Stufenwechsel. */
    const u = standDerUhr(weiter, START + 80 * MINUTE);
    expect(u.verstrichen_ms).toBe(20 * MINUTE);
    expect(u.stufeIndex).toBe(1);
  });

  it('ist unempfindlich gegen zweimaliges Drücken', () => {
    const einmal = anhalten(abend(), START + 5 * MINUTE);
    const zweimal = anhalten(einmal, START + 40 * MINUTE);
    expect(zweimal).toEqual(einmal);

    const laeuft = abend();
    expect(fortsetzen(laeuft, START + 40 * MINUTE)).toEqual(laeuft);
  });

  it('trägt mehrere Pausen über einen ganzen Abend richtig zusammen', () => {
    /* 12 min gespielt, 40 min Pause, 12 min gespielt, 3 min Pause, 6 min
       gespielt = 30 Minuten Spielzeit: Stufe 2, davon 10 Minuten gelaufen. */
    let s = abend();
    s = anhalten(s, START + 12 * MINUTE);
    s = fortsetzen(s, START + 52 * MINUTE);
    s = anhalten(s, START + 64 * MINUTE);
    s = fortsetzen(s, START + 67 * MINUTE);
    const u = standDerUhr(s, START + 73 * MINUTE);
    expect(u.verstrichen_ms).toBe(30 * MINUTE);
    expect(u.stufeIndex).toBe(1);
    expect(u.rest_ms).toBe(10 * MINUTE);
    expect(u.laeuft).toBe(true);
  });

  it('lässt eine rückwärts gestellte Uhr keine Zeit zurücknehmen', () => {
    /* Sommerzeit, Zeitzonenwechsel, ein Nutzer stellt die Uhr. Die
       verstrichene Zeit darf dabei nicht negativ werden. */
    expect(verbraucht(abend(), START - 60 * MINUTE)).toBe(0);
    expect(standDerUhr(abend(), START - 60 * MINUTE).stufeIndex).toBe(0);
  });
});

/* -------------------------------------------------- Der Zustand überlebt alles */

describe('Der laufende Abend überlebt Neuladen und Schließen', () => {
  it('kommt nach dem Schreiben unverändert zurück', () => {
    const s = abend();
    speichereLaufende(s);
    expect(ladeLaufende()).toEqual(s);
  });

  it('läuft nach einem Neuladen an der richtigen Stelle weiter', () => {
    speichereLaufende(abend());
    /* Neu geladen heißt: nichts im Speicher der Seite, nur der Gerätespeicher. */
    const wieder = ladeLaufende()!;
    const u = standDerUhr(wieder, START + 47 * MINUTE);
    expect(u.stufeIndex).toBe(2);
    expect(u.blinds).toEqual([75, 150]);
    expect(u.rest_ms).toBe(13 * MINUTE);
  });

  it('behält eine Pause über das Neuladen hinweg', () => {
    speichereLaufende(anhalten(abend(), START + 5 * MINUTE));
    const wieder = ladeLaufende()!;
    expect(wieder.laeuft_seit).toBeNull();
    expect(standDerUhr(wieder, START + 300 * MINUTE).verstrichen_ms).toBe(5 * MINUTE);
  });

  it('braucht keinen Speicherknopf: jede Änderung steht sofort im Gerät', () => {
    speichereLaufende(abend());
    const geaendert = anhalten(ladeLaufende()!, START + 9 * MINUTE);
    speichereLaufende(geaendert);
    expect(ladeLaufende()!.verbraucht_ms).toBe(9 * MINUTE);
  });

  it('sperrt niemanden aus, wenn der Stand beschädigt ist', () => {
    /* Halb geschrieben nach einem Absturz: kein Fehler im Programm, sondern
       ein kaputter Eintrag. Dann gilt: kein Abend offen. */
    const kaputt = [
      '{"begonnen":',                                    // abgeschnitten
      '{"begonnen":"gestern","spieler":[],"stufen":[[1,2]]}',
      '{"begonnen":1,"spieler":"Lorenz","stufen":[[1,2]]}',
      '{"begonnen":1,"spieler":[{"name":"A"}],"stufen":[[1,2]]}',
      '{"begonnen":1,"spieler":[],"stufen":[]}',         // ohne Blindstufen
      '{"begonnen":1,"spieler":[]}',                     // ohne Blindstufen
    ];
    for (const roh of kaputt) {
      localStorage.setItem(SCHLUESSEL, roh);
      expect(ladeLaufende(), roh.slice(0, 40)).toBeNull();
    }
  });

  it('meldet keinen Abend, wenn keiner läuft', () => {
    expect(ladeLaufende()).toBeNull();
  });

  it('beendet den Abend, wenn er beendet wird', () => {
    speichereLaufende(abend());
    speichereLaufende(null);
    expect(ladeLaufende()).toBeNull();
  });

  it('zählt nur die Spieler, die noch dabei sind', () => {
    expect(nochDabei(abend()).map((s) => s.name)).toEqual(['Lorenz', 'Mira', 'Jonas', 'Ada']);
  });

  it('kommt ohne Netz aus — im Quelltext steht kein Abruf', () => {
    /* Der Live-Bereich muss am Küchentisch ohne Empfang vollständig
       funktionieren. Ein einziger Netzaufruf in diesem Pfad würde das
       lautlos brechen, deshalb steht die Bedingung als Test da. */
    const dateien = ['../session/laufend.ts', '../live/uhr.ts', '../live/blinds.ts',
      '../live/verteilung.ts'];
    for (const datei of dateien) {
      const quelle = readFileSync(fileURLToPath(new URL(datei, import.meta.url)), 'utf-8');
      expect(quelle, datei).not.toMatch(/\bfetch\s*\(|XMLHttpRequest|https?:\/\//);
    }
  });
});
