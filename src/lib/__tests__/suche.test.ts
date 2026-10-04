/* Eine Suche für Werkzeuge, Lektionen und Begriffe (FAHRPLAN 9.3). */

import { describe, expect, it } from 'vitest';
import { bestesZiel, suche, MIN_ZEICHEN, type Quellen } from '../suche';
import { werkzeugZiele } from '../suche/ziele';
import { istOrt } from '../orte';
import { ALL_MODULES } from '../../content';
import { EN_BUNDLE } from '../../content/en';
import GLOSSARY from '../../content/glossary';
import EN_GLOSSARY from '../../content/en/glossary';

function quellen(lang: 'de' | 'en'): Quellen {
  return {
    werkzeuge: werkzeugZiele(lang),
    module: lang === 'de' ? ALL_MODULES : EN_BUNDLE.modules,
    glossar: lang === 'de' ? GLOSSARY : EN_GLOSSARY,
  };
}

describe('Die Ziele', () => {
  it('führen alle zu Orten, die es gibt', () => {
    for (const lang of ['de', 'en'] as const) {
      for (const z of werkzeugZiele(lang)) {
        expect(istOrt(z.to), `${z.to} (${lang})`).toBe(true);
      }
    }
  });

  it('haben jeden Ort nur einmal und tragen einen Namen', () => {
    const ziele = werkzeugZiele('de');
    expect(new Set(ziele.map((z) => z.to)).size).toBe(ziele.length);
    for (const z of ziele) expect(z.titel.length, z.to).toBeGreaterThan(0);
  });

  it('enthalten alle sieben Trainer und die fünf Seiten der Live-Session', () => {
    const tos = werkzeugZiele('de').map((z) => z.to);
    expect(tos.filter((t) => t.startsWith('/lernen/trainer/'))).toHaveLength(7);
    for (const s of ['/session/live/einrichten', '/session/abende', '/session/chips', '/session/auszahlung', '/session/bankroll']) {
      expect(tos).toContain(s);
    }
  });
});

describe('suche', () => {
  it('findet „Bankroll“ als Werkzeug, als Lektion und als Begriff', () => {
    const e = suche('Bankroll', quellen('de'));
    expect(e.werkzeuge.map((z) => z.to)).toContain('/session/bankroll');
    expect(e.lektionen.some((l) => l.moduleId === 'm6')).toBe(true);
    expect(e.begriffe).toContain('Bankroll');
    expect(e.leer).toBe(false);
  });

  it('findet das Werkzeug auch über ein Stichwort der anderen Sprache', () => {
    expect(suche('Auszahlung', quellen('en')).werkzeuge.map((z) => z.to)).toContain('/session/auszahlung');
    expect(suche('payout', quellen('de')).werkzeuge.map((z) => z.to)).toContain('/session/auszahlung');
  });

  it('stellt den Treffer im Namen vor den im Stichwort', () => {
    const e = suche('Equity', quellen('de'));
    expect(e.werkzeuge[0].titel.toLowerCase()).toContain('equity');
  });

  it('stellt Lektionen mit dem Wort im Titel vor die mit dem Wort im Text', () => {
    const e = suche('Bankroll', quellen('de'), { lektionen: 50, begriffe: 6 });
    const arten = e.lektionen.map((l) => l.art);
    const ersterText = arten.findIndex((a) => a !== 'titel');
    if (ersterText >= 0) expect(arten.slice(ersterText).every((a) => a !== 'titel')).toBe(true);
  });

  it('beachtet die Grenzen je Gruppe', () => {
    const e = suche('ein', quellen('de'), { lektionen: 2, begriffe: 1 });
    expect(e.lektionen.length).toBeLessThanOrEqual(2);
    expect(e.begriffe.length).toBeLessThanOrEqual(1);
  });

  it('sucht unter zwei Zeichen nichts', () => {
    expect(MIN_ZEICHEN).toBe(2);
    expect(suche('a', quellen('de')).leer).toBe(true);
    expect(suche('  ', quellen('de')).leer).toBe(true);
  });

  it('sucht im Fließtext der Lektionen erst ab drei Zeichen', () => {
    // „zw“ steht in vielen Absätzen, aber in keinem Titel als eigenes Wort-Ziel.
    const kurz = suche('zw', quellen('de'), { lektionen: 500, begriffe: 6 });
    expect(kurz.lektionen.every((l) => l.art === 'titel')).toBe(true);
  });

  it('achtet nicht auf die Form des Apostrophs', () => {
    const gerade = suche("Hold'em", quellen('de'), { lektionen: 500, begriffe: 6 });
    const schief = suche('Hold’em', quellen('de'), { lektionen: 500, begriffe: 6 });
    expect(gerade.lektionen.length).toBe(schief.lektionen.length);
    expect(gerade.lektionen.length).toBeGreaterThan(0);
  });

  it('meldet bei Unsinn „leer“', () => {
    expect(suche('qqqxyz', quellen('de')).leer).toBe(true);
  });
});

describe('bestesZiel', () => {
  it('führt auf das Werkzeug, wenn es eines gibt', () => {
    expect(bestesZiel(suche('Bankroll', quellen('de')))).toBe('/session/bankroll');
  });

  it('führt sonst auf die Lektion, dann auf den Begriff', () => {
    const nurBegriff = { werkzeuge: [], lektionen: [], begriffe: ['Squeeze'], leer: false };
    expect(bestesZiel(nurBegriff)).toBe('/nachschlagen/glossar?q=Squeeze');
    const lektion = {
      werkzeuge: [], begriffe: ['x'], leer: false,
      lektionen: [{ moduleId: 'm1', moduleTitle: 'M', lessonId: 'm1-l1', lessonTitle: 'L', art: 'titel' as const, ausschnitt: '' }],
    };
    expect(bestesZiel(lektion)).toBe('/lernen/m1/m1-l1');
  });

  it('führt nirgends hin, wenn nichts gefunden wurde', () => {
    expect(bestesZiel(suche('qqqxyz', quellen('de')))).toBeNull();
  });
});
