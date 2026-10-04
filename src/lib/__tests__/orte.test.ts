/* Ein Name pro Ort — und der Titel der Seite heißt wie ihr Name.
   ==============================================================

   Gefunden: Dieselbe Seite hieß in der Seitenleiste „Spielstil", als Titel „Dein
   Spielstil"; „Nachschlagen" als Seite „Schnell etwas wissen"; sieben Trainer
   und der Tages-Quiz führten mit „← Trainer" auf eine Seite, die es nicht mehr
   gibt (E-079). Die Namen stehen jetzt in `src/lib/orte.ts`. */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ORTE, findeOrt, istOrt, ortKurz, ortName, type OrtPfad } from '../orte';
import { STR as DAILY } from '../../i18n/pages/dailyquiz';
import { STR as DRILL } from '../../i18n/pages/potoddsdrill';
import { STR as FRIENDS } from '../../i18n/pages/friends';
import { STR as GLOSSAR } from '../../i18n/pages/glossarypage';
import { STR as HAENDE } from '../../i18n/pages/handexplorer';
import { STR as LEARN } from '../../i18n/pages/learn';
import { STR as NACH } from '../../i18n/pages/nachschlagen';
import { STR as ODDS } from '../../i18n/pages/oddstables';
import { STR as PAY } from '../../i18n/pages/payout';
import { STR as PLAY } from '../../i18n/pages/play';
import { STR as PROFILE } from '../../i18n/pages/profile';
import { STR as PROINS } from '../../i18n/pages/proinsights';
import { STR as RANGES } from '../../i18n/pages/rangeviewer';
import { STR as REVIEW } from '../../i18n/pages/review';
import { STR as SESSION } from '../../i18n/pages/session';
import { STR as STATS } from '../../i18n/pages/stats';
import { STR as TELLS } from '../../i18n/pages/tellspage';
import { STR as BANK } from '../../i18n/pages/bankroll';
import { STR as CHIPS } from '../../i18n/pages/chips';
import { STR as COACH } from '../../i18n/pages/coach';
import { STR as EQUITYCALC } from '../../i18n/pages/equitycalc';

function dateien(ordner: string, aus: string[] = []): string[] {
  for (const e of readdirSync(ordner)) {
    const p = join(ordner, e);
    if (statSync(p).isDirectory()) dateien(p, aus);
    else if (p.endsWith('.tsx')) aus.push(p);
  }
  return aus;
}

describe('Die Ortstabelle', () => {
  it('führt jeden Ort mit Namen in beiden Sprachen', () => {
    for (const o of ORTE) {
      expect(o.name('de').length, o.pfad).toBeGreaterThan(1);
      expect(o.name('en').length, o.pfad).toBeGreaterThan(1);
    }
  });

  it('hat für jeden Eltern-Ort einen Eintrag und keinen Kreis', () => {
    for (const o of ORTE) {
      if (o.eltern !== null) expect(istOrt(o.eltern), `${o.pfad} → ${o.eltern}`).toBe(true);
      let n = 0;
      for (let p: OrtPfad | null = o.pfad; p !== null; n += 1) {
        expect(n, `Kreis bei ${o.pfad}`).toBeLessThan(6);
        p = ORTE.find((x) => x.pfad === p)!.eltern;
      }
    }
  });

  it('kennt jeden festen Pfad, den die App anmeldet', () => {
    const app = readFileSync('src/App.tsx', 'utf8');
    const fest = [...app.matchAll(/<Route path="([^":*]+)" element=\{<(?!Navigate)/g)].map((m) => m[1]);
    /* Die Tischseite liegt außerhalb des Layouts, ist aber ein Ort. */
    const unbekannt = fest.filter((p) => !istOrt(p));
    expect(fest.length).toBeGreaterThan(30);
    expect(unbekannt).toEqual([]);
  });

  it('gibt der Kurzform ein Wort, wo der volle Name zu lang ist', () => {
    expect(ortKurz('/nachschlagen', 'de')).toBe('Suchen');
    expect(ortKurz('/profil', 'de')).toBe('Du');
    expect(ortKurz('/lernen', 'de')).toBe('Lernpfad');
  });
});

describe('Titel und Name sind dasselbe Wort', () => {
  const paare: Array<[OrtPfad, (l: 'de' | 'en') => string]> = [
    ['/lernen', (l) => LEARN[l].title],
    ['/lernen/wiederholen', (l) => REVIEW[l].title],
    ['/lernen/tagesquiz', (l) => DAILY[l].title],
    ['/lernen/pros', (l) => PROINS[l].title],
    ['/lernen/uebungstisch', (l) => PLAY[l].title],
    ['/lernen/statistik', (l) => STATS[l].title],
    ['/lernen/drill', (l) => DRILL[l].title],
    ['/nachschlagen', (l) => NACH[l].title],
    ['/nachschlagen/coach', (l) => COACH[l].title],
    ['/nachschlagen/glossar', (l) => GLOSSAR[l].title],
    ['/nachschlagen/haende', (l) => HAENDE[l].title],
    ['/nachschlagen/ranges', (l) => RANGES[l].title],
    ['/nachschlagen/odds', (l) => ODDS[l].title],
    ['/nachschlagen/equity', (l) => EQUITYCALC[l].title],
    ['/nachschlagen/tells', (l) => TELLS[l].title],
    ['/session', (l) => SESSION[l].title],
    ['/session/chips', (l) => CHIPS[l].title],
    ['/session/auszahlung', (l) => PAY[l].title],
    ['/session/bankroll', (l) => BANK[l].title],
    ['/profil', (l) => PROFILE[l].title],
    ['/freunde', (l) => FRIENDS[l].title],
  ];

  it.each(paare.map(([p, f]) => [p, f] as const))('%s', (pfad, titel) => {
    for (const l of ['de', 'en'] as const) {
      expect(titel(l), `${pfad} (${l})`).toBe(ortName(pfad, l));
    }
  });
});

describe('Dynamische Seiten', () => {
  it('hängen unter ihrem Elternort', () => {
    expect(findeOrt('/lernen/m1')).toMatchObject({ ort: '/lernen', eltern: '/lernen' });
    expect(findeOrt('/lernen/m1/m1-l2')).toMatchObject({ ort: '/lernen', eltern: '/lernen/m1' });
    expect(findeOrt('/lernen/drill/3-5-c')).toMatchObject({ ort: '/lernen/drill', eltern: '/lernen' });
    expect(findeOrt('/session/abende/abc')).toMatchObject({ ort: '/session/abende', eltern: '/session/abende' });
    expect(findeOrt('/session/spieler/Mira')).toMatchObject({ ort: '/session/abende' });
    expect(findeOrt('/')).toMatchObject({ ort: '/', eltern: null });
  });

  it('kennt „Zurück" von jedem festen Ort aus', () => {
    expect(findeOrt('/lernen/trainer/preflop').eltern).toBe('/lernen');
    expect(findeOrt('/kuendigen').eltern).toBe('/rechtliches');
  });
});

describe('Rückwege im Quelltext', () => {
  it('beschriften nirgends selbst: keine Pille mit Pfeil, kein „← Trainer"', () => {
    const treffer: string[] = [];
    for (const d of [...dateien('src/pages'), ...dateien('src/components')]) {
      if (d.endsWith('components/ui/index.tsx')) continue;
      const t = readFileSync(d, 'utf8');
      if (/className="pill"[^>]*>\s*(?:←|\{L\.back)/.test(t)) treffer.push(d);
    }
    expect(treffer, '<Zurueck to="…" /> benutzen').toEqual([]);
    for (const d of readdirSync('src/i18n/pages')) {
      const t = readFileSync(join('src/i18n/pages', d), 'utf8');
      expect(t, d).not.toMatch(/back: '← Trainer/);
    }
  });
});
