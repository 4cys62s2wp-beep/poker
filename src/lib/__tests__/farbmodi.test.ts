/* Die Farbmodi, für jede Kombination nachgerechnet.
   ================================================

   Die Kontrastgrenzen gelten in **jedem** Modus, nicht im gerade aktiven.
   Ein Test, der nur den dunklen Satz prüft, sagt genau nichts über den
   hellen — und der helle ist der, den niemand von uns täglich sieht.

   Deshalb liest diese Datei beide Tokensätze aus `global.css` und rechnet
   jede Kombination aus Token, Fläche und Modus durch. Es steht hier **keine
   einzige Kontrastzahl**; jede wird gerechnet. Eine hingeschriebene Zahl
   wäre eine Behauptung über eine Farbe, die sich inzwischen geändert haben
   kann.

   Was der Test nicht kann: beurteilen, ob eine Farbe schön ist. Was er kann:
   verhindern, dass eine unlesbare durchrutscht. */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  KONTRAST_ERGEBNIS, KONTRAST_UEBRIG, kontrast, legeAuf, zerlege,
} from '../design/kontrast';
import {
  FLAECHEN, OHNE_TEXTGRENZE, TEXT_AUF_GEDAEMPFT, TEXT_ERGEBNIS, TEXT_NORMAL,
} from '../design/farbrollen';
import { MODI, STANDARD } from '../design/modus';

const CSS = readFileSync('src/styles/global.css', 'utf8');

/** Die Tokens eines Blocks, angesprochen über seinen Selektor. */
function satz(selektor: string): Record<string, string> {
  const anfang = CSS.indexOf(selektor);
  expect(anfang, `Der Block "${selektor}" fehlt in global.css`).toBeGreaterThanOrEqual(0);
  const ende = CSS.indexOf('\n}', anfang);
  const block = CSS.slice(anfang, ende);
  const aus: Record<string, string> = {};
  for (const t of block.matchAll(/^\s*(--[a-z0-9-]+):\s*([^;]+);/gm)) {
    aus[t[1]] = t[2].trim();
  }
  return aus;
}

const SAETZE = {
  dunkel: satz(':root,\n[data-modus="dunkel"] {'),
  hell: satz('[data-modus="hell"] {'),
} as const;

type Satzname = keyof typeof SAETZE;
const NAMEN = Object.keys(SAETZE) as Satzname[];

// ---------------------------------------------------------------------------

describe('Die beiden Tokensätze passen zueinander', () => {
  it('kennen genau dieselben Tokens', () => {
    /* Ein Token, den nur ein Satz kennt, fällt im anderen auf die Farbe des
       Grundzustands zurück — und dann steht im hellen Modus ein dunkler
       Wert, ohne dass jemand es beim Bauen sieht. */
    const dunkel = Object.keys(SAETZE.dunkel).sort();
    const hell = Object.keys(SAETZE.hell).sort();
    expect(hell.filter((t) => !dunkel.includes(t)), 'nur im hellen Satz').toEqual([]);
    expect(dunkel.filter((t) => !hell.includes(t)), 'nur im dunklen Satz').toEqual([]);
  });

  it('ordnet jeden Token genau einer Rolle zu', () => {
    /* Ein Token ohne Rolle würde von dieser Prüfung stillschweigend
       übersprungen. Genau das darf nicht passieren. */
    const eingeordnet = new Set<string>([
      ...FLAECHEN, ...TEXT_ERGEBNIS, ...TEXT_NORMAL,
      ...TEXT_AUF_GEDAEMPFT.flat(), ...OHNE_TEXTGRENZE,
    ]);
    const ohne = Object.keys(SAETZE.dunkel).filter((t) => !eingeordnet.has(t));
    expect(ohne, 'Diese Tokens stehen in keiner Rolle in farbrollen.ts').toEqual([]);
  });

  it('unterscheidet sich in jedem Token — sonst wäre er nicht modusabhängig', () => {
    const gleich = Object.keys(SAETZE.dunkel)
      .filter((t) => SAETZE.dunkel[t] === SAETZE.hell[t]);
    expect(gleich, 'Gleiche Werte in beiden Sätzen gehören zurück in :root').toEqual([]);
  });
});

describe.each(NAMEN)('Modus „%s"', (name) => {
  const T = SAETZE[name];
  const grundfarben = FLAECHEN.map((f) => [f, T[f]] as const);

  it('kennt alle Flächen', () => {
    for (const [n, w] of grundfarben) expect(w, n).toBeTruthy();
  });

  it.each(TEXT_ERGEBNIS)('%s hält 7 zu 1 auf jeder Fläche', (token) => {
    for (const [flaeche, grund] of grundfarben) {
      const v = kontrast(T[token], grund);
      expect(v, `${token} auf ${flaeche}: ${v.toFixed(2)}`)
        .toBeGreaterThanOrEqual(KONTRAST_ERGEBNIS);
    }
  });

  it.each(TEXT_NORMAL)('%s hält 4,5 zu 1 auf jeder Fläche', (token) => {
    for (const [flaeche, grund] of grundfarben) {
      const v = kontrast(T[token], grund);
      expect(v, `${token} auf ${flaeche}: ${v.toFixed(2)}`)
        .toBeGreaterThanOrEqual(KONTRAST_UEBRIG);
    }
  });

  it.each(TEXT_AUF_GEDAEMPFT)('%s hält 4,5 zu 1 auf %s über jeder Fläche', (vorne, gedaempft) => {
    /* Die gedämpfte Fläche ist durchscheinend: Was der Text wirklich unter
       sich hat, hängt von der Fläche darunter ab. */
    for (const [flaeche, grund] of grundfarben) {
      const wirklich = legeAuf(T[gedaempft], grund);
      const v = kontrast(T[vorne], wirklich);
      expect(v, `${vorne} auf ${gedaempft} über ${flaeche} (${wirklich}): ${v.toFixed(2)}`)
        .toBeGreaterThanOrEqual(KONTRAST_UEBRIG);
    }
  });

  it('setzt keinen Token auf eine unlesbare Schreibweise', () => {
    for (const [token, wert] of Object.entries(T)) {
      expect(() => zerlege(wert), `${token}: "${wert}"`).not.toThrow();
    }
  });
});

describe('Der helle Modus ermüdet nicht', () => {
  const H = SAETZE.hell;

  it('benutzt kein Reinweiß als Fläche', () => {
    /* Reinweiß wirft bei Tageslicht mehr Licht zurück als Papier; das Auge
       regelt dauernd nach. */
    for (const f of FLAECHEN) {
      expect(H[f].toLowerCase(), f).not.toMatch(/^#(fff|ffffff)$/);
    }
  });

  it('benutzt kein Reinschwarz für Text', () => {
    /* Reinschwarz auf Weiß erzeugt beim Weiterlesen Nachbilder. */
    for (const t of [...TEXT_NORMAL, ...TEXT_ERGEBNIS]) {
      expect(H[t].toLowerCase(), t).not.toMatch(/^#(000|000000)$/);
    }
  });

  it('hat helle Flächen und dunklen Text — nicht umgekehrt', () => {
    /* Die Gegenprobe zur Verwechslung: Wer die beiden Blöcke vertauscht,
       bekäme lauter bestandene Kontrastprüfungen und einen dunklen „hellen"
       Modus. */
    expect(kontrast(H['--bg'], '#ffffff')).toBeLessThan(kontrast(H['--bg'], '#000000'));
    expect(kontrast(H['--text'], '#000000')).toBeLessThan(kontrast(H['--text'], '#ffffff'));
  });
});

describe('Der Akzent ist je Modus ein eigener Wert — und dieselbe Farbe', () => {
  const hell = SAETZE.hell['--akzent'];
  const dunkel = SAETZE.dunkel['--akzent'];

  it('ist nicht derselbe Wert', () => {
    /* Derselbe Grünton besteht die Prüfung nicht auf beiden Gründen. */
    expect(hell).not.toBe(dunkel);
  });

  it('würde als jeweils anderer Wert durchfallen', () => {
    /* Die Begründung, nachgerechnet statt behauptet: Der dunkle Akzent auf
       hellem Grund und umgekehrt. */
    expect(kontrast(dunkel, SAETZE.hell['--bg'])).toBeLessThan(KONTRAST_UEBRIG);
    expect(kontrast(hell, SAETZE.dunkel['--bg'])).toBeLessThan(KONTRAST_UEBRIG);
  });

  it('bleibt als dieselbe Farbe erkennbar', () => {
    /* Gleicher Farbton, andere Helligkeit. Mehr als 20 Grad Unterschied
       wären zwei Farben, nicht zwei Fassungen einer. */
    const ton = (farbe: string) => {
      const [r, g, b] = zerlege(farbe).rgb.map((x) => x / 255);
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      if (max === min) return 0;
      const d = max - min;
      const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
      return ((h * 60) + 360) % 360;
    };
    expect(Math.abs(ton(hell) - ton(dunkel))).toBeLessThanOrEqual(20);
  });
});

describe('Die Bedienung', () => {
  it('bietet genau drei Möglichkeiten', () => {
    expect([...MODI]).toEqual(['system', 'hell', 'dunkel']);
  });

  it('hat die Systemvorgabe vorausgewählt', () => {
    /* Ein Gerät, das seine Nutzerin schon kennt, weiß es besser als eine
       App, die sie zum ersten Mal sieht. */
    expect(STANDARD).toBe('system');
  });

  it('benutzt in index.html denselben Schlüssel wie im Programm', async () => {
    /* Das Skript gegen das Aufblitzen läuft vor allem anderen und kann
       nichts importieren — der Schlüssel steht dort wörtlich. Wenn beide
       auseinandergehen, blitzt es wieder, und niemand weiß warum. */
    const { MODUS_SCHLUESSEL } = await import('../design/modus');
    const html = readFileSync('index.html', 'utf8');
    expect(html).toContain(MODUS_SCHLUESSEL);
    expect(html).toContain("setAttribute('data-modus'");
  });
});

describe('Der Live-Bereich erzwingt den dunklen Satz', () => {
  const APP = readFileSync('src/App.tsx', 'utf8');

  it('setzt das Attribut an einer Stelle, nicht in den Bildschirmen', () => {
    expect(APP).toMatch(/data-modus':\s*'dunkel'/);
    const inBildschirmen = readFileSync('src/pages/live/TischPage.tsx', 'utf8')
      + readFileSync('src/pages/live/EinrichtenPage.tsx', 'utf8');
    expect(inBildschirmen).not.toMatch(/data-modus/);
  });

  it('nennt den Live-Bereich als einzigen Fall', () => {
    const liste = APP.match(/const DUNKEL_ERZWUNGEN = \[([^\]]*)\]/);
    expect(liste, 'Die Liste der erzwungenen Bereiche fehlt').not.toBeNull();
    const bereiche = [...liste![1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
    expect(bereiche).toEqual(['/session']);
  });

  it('hängt der dunkle Satz an einem Attribut und nicht nur an :root', () => {
    /* Nur so kann ein Element mitten im Baum ihn für alles darunter
       erzwingen. Stünde er allein in `:root`, bräuchte der Live-Bereich eine
       zweite Kopie aller Farben. */
    expect(CSS).toContain('[data-modus="dunkel"] {');
  });
});
