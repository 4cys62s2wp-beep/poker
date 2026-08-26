/* Die haptische Rückmeldung darf unter keinen Umständen eine Eingabe
   scheitern lassen. Genau das prüfen diese Tests: nicht, dass es vibriert,
   sondern dass nichts kaputtgeht, wenn es das nicht kann. */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  _darfVibrieren, _entprellenZuruecksetzen, bestaetigt, istBestaetigung, umschlag,
} from '../design/haptik';

const echt = globalThis.navigator;

afterEach(() => {
  Object.defineProperty(globalThis, 'navigator', { value: echt, configurable: true });
  vi.restoreAllMocks();
});

function setzeNavigator(v: unknown) {
  Object.defineProperty(globalThis, 'navigator', { value: v, configurable: true });
}

describe('Haptische Rückmeldung', () => {
  it('stößt kurz an, wenn das Gerät es kann', () => {
    const vibrate = vi.fn((_muster: number | number[]) => true);
    setzeNavigator({ vibrate });
    bestaetigt();
    expect(vibrate).toHaveBeenCalledTimes(1);
    const muster = vibrate.mock.calls[0][0] as number;
    expect(muster).toBeGreaterThan(0);
    expect(muster).toBeLessThanOrEqual(20);
  });

  it('unterscheidet den Umschlag hörbar von einer Eingabe', () => {
    const vibrate = vi.fn((_muster: number | number[]) => true);
    setzeNavigator({ vibrate });
    umschlag();
    expect(Array.isArray(vibrate.mock.calls[0][0])).toBe(true);
  });

  it('tut nichts, wenn das Gerät nicht vibrieren kann', () => {
    setzeNavigator({});
    expect(() => bestaetigt()).not.toThrow();
    expect(_darfVibrieren()).toBe(false);
  });

  it('schluckt einen Fehler aus dem Browser', () => {
    /* Manche Browser werfen, statt false zurückzugeben. Eine Eingabe, die
       daran scheitert, wäre der schlimmere Fehler. */
    setzeNavigator({ vibrate: () => { throw new Error('nicht erlaubt'); } });
    expect(() => bestaetigt()).not.toThrow();
    expect(() => umschlag()).not.toThrow();
  });

  it('schweigt, wenn der Nutzer Bewegung reduziert hat', () => {
    const vibrate = vi.fn((_muster: number | number[]) => true);
    setzeNavigator({ vibrate });
    vi.stubGlobal('window', { matchMedia: () => ({ matches: true }) });
    bestaetigt();
    expect(vibrate).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});

/* ─────────────────────────────────────────────────────────────────────────
   Eine Stelle für die ganze App
   ───────────────────────────────────────────────────────────────────────── */

describe('Was als Bestätigung gilt', () => {
  /** Ein Element nachbauen, ohne einen Browser zu brauchen.
   *
   *  Vitest läuft hier ohne DOM. Nachgebaut wird genau so viel, wie
   *  `istBestaetigung` anfasst: Tagname, Attribute, Elternteil und
   *  `closest`. Mehr wäre eine zweite, halbe Browserimplementierung. */
  interface Knoten {
    tagName: string;
    parentElement: Knoten | null;
    hasAttribute(name: string): boolean;
    getAttribute(name: string): string | null;
    closest(auswahl: string): Knoten | null;
  }

  /** Ein Auswahlteil wie `button`, `a[href]` oder `[role="button"]`. */
  function passtAuf(k: Knoten, teil: string): boolean {
    const m = teil.match(/^([a-z]+)?(?:\[([^\]=]+)(?:="([^"]*)")?\])?$/);
    if (!m) return false;
    const [, tag, attribut, wert] = m;
    if (tag && k.tagName !== tag.toUpperCase()) return false;
    if (attribut && !k.hasAttribute(attribut)) return false;
    if (attribut && wert !== undefined && k.getAttribute(attribut) !== wert) return false;
    return Boolean(tag || attribut);
  }

  function el(tag: string, attribute: Record<string, string> = {}, kinder: Knoten[] = []): Knoten {
    const k: Knoten = {
      tagName: tag.toUpperCase(),
      parentElement: null,
      hasAttribute: (n) => n in attribute,
      getAttribute: (n) => (n in attribute ? attribute[n] : null),
      closest(auswahl) {
        const teile = auswahl.split(',').map((t) => t.trim());
        let lauf: Knoten | null = k;
        while (lauf) {
          if (teile.some((t) => passtAuf(lauf!, t))) return lauf;
          lauf = lauf.parentElement;
        }
        return null;
      },
    };
    for (const kind of kinder) kind.parentElement = k;
    return k;
  }

  /** Der Nachbau reicht für die Funktion; TypeScript muss es glauben. */
  const pruefe = (k: Knoten | null) => istBestaetigung(k as unknown as Element | null);

  it('zählt Knöpfe, Schalter und eigenständige Links', () => {
    expect(pruefe(el('button'))).toBe(true);
    expect(pruefe(el('a', { href: '#/lernen' }))).toBe(true);
    expect(pruefe(el('div', { role: 'button' }))).toBe(true);
    expect(pruefe(el('input', { type: 'checkbox' }))).toBe(true);
  });

  it('zählt auch, was im Knopf liegt', () => {
    /* Getippt wird auf das Symbol im Knopf, nicht auf den Knopf. */
    const symbol = el('span');
    el('button', {}, [symbol]);
    expect(pruefe(symbol)).toBe(true);
  });

  it('zählt Schreiben nicht als Bestätigen', () => {
    expect(pruefe(el('input', { type: 'text' }))).toBe(false);
    expect(pruefe(el('input'))).toBe(false);
  });

  it('zählt einen Link im Fließtext nicht', () => {
    /* Er führt woandershin, er bestätigt nichts. */
    const link = el('a', { href: '#/glossar' });
    el('p', {}, [link]);
    expect(pruefe(link)).toBe(false);
  });

  it('zählt ein abgeschaltetes Element nicht', () => {
    /* Dort passiert gerade nichts, und eine Rückmeldung auf nichts ist eine
       Lüge über den Zustand. */
    expect(pruefe(el('button', { disabled: '' }))).toBe(false);
    expect(pruefe(el('button', { 'aria-disabled': 'true' }))).toBe(false);
  });

  it('zählt reinen Text nicht', () => {
    expect(pruefe(el('p'))).toBe(false);
    expect(pruefe(null)).toBe(false);
  });
});

describe('Zwei Stöße im selben Griff sind einer', () => {
  it('lässt den zweiten Aufruf innerhalb weniger Millisekunden aus', () => {
    const vibrate = vi.fn((_muster: number | number[]) => true);
    setzeNavigator({ vibrate });
    _entprellenZuruecksetzen();
    bestaetigt(1_000);
    bestaetigt(1_010);
    expect(vibrate).toHaveBeenCalledTimes(1);
  });

  it('lässt den bewussten zweiten Tipp durch', () => {
    const vibrate = vi.fn((_muster: number | number[]) => true);
    setzeNavigator({ vibrate });
    _entprellenZuruecksetzen();
    bestaetigt(1_000);
    bestaetigt(1_400);
    expect(vibrate).toHaveBeenCalledTimes(2);
  });

  it('entprellt den Umschlag nicht — er kommt nicht aus einem Fingertipp', () => {
    const vibrate = vi.fn((_muster: number | number[]) => true);
    setzeNavigator({ vibrate });
    _entprellenZuruecksetzen();
    umschlag();
    umschlag();
    expect(vibrate).toHaveBeenCalledTimes(2);
  });
});

describe('Die Rückmeldung steht an genau einer Stelle', () => {
  it('wird von keinem Bildschirm einzeln ausgelöst', async () => {
    /* Der Auftrag verlangt sie bei jeder bestätigten Eingabe. In jeden
       Bildschirm einzeln geschrieben, fehlt sie beim nächsten neuen Knopf —
       und niemandem fällt es auf. */
    const { readdirSync, readFileSync, statSync } = await import('node:fs');
    const { join } = await import('node:path');
    const treffer: string[] = [];
    const durchsuche = (verzeichnis: string) => {
      for (const eintrag of readdirSync(verzeichnis)) {
        const pfad = join(verzeichnis, eintrag);
        if (statSync(pfad).isDirectory()) durchsuche(pfad);
        else if (/\.tsx?$/.test(eintrag) && /\bbestaetigt\s*\(/.test(readFileSync(pfad, 'utf8'))) {
          treffer.push(pfad);
        }
      }
    };
    durchsuche('src/pages');
    durchsuche('src/components');
    expect(treffer, 'Diese Dateien lösen die Rückmeldung selbst aus. '
      + 'Sie kommt vom Zuhörer in App.tsx — ein zweiter Aufruf ist doppelt.')
      .toEqual([]);
  });

  it('ist in App.tsx angemeldet', () => {
    const app = readFileSync('src/App.tsx', 'utf8');
    expect(app).toMatch(/horcheAufBedienung\(document\)/);
  });
});
