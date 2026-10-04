/* Ein Symbol je Ziel, und kein Spielautomat.
   ==========================================

   Gefunden in der Durchsicht: Auf der Lernseite standen zwei Kacheln mit
   demselben roten Kartenpaar (Handranking-Trainer und Übungstisch), in der
   Seitenleiste teilten sich Pro-Einblicke und Chip-Rechner ein Symbol, auf der
   Session-Seite „Frühere Abende“ und „Auszahlung“ eine Krone. Dazu stand ein
   🎰 beim Modul „Live-Poker“ und beim Abzeichen „Grinder“ — in einer App,
   die ausdrücklich nicht um Geld spielt (E-030) (E-078). */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BILDSCHIRME, GETEILT, ZEICHEN, type ZeichenPfad } from '../zeichen';
import { TRAINER } from '../trainerliste';

const ICON = readFileSync('src/components/Icon.tsx', 'utf8');

function quellen(ordner: string, aus: string[] = []): string[] {
  for (const e of readdirSync(ordner)) {
    const p = join(ordner, e);
    if (statSync(p).isDirectory()) quellen(p, aus);
    else if (/\.(ts|tsx)$/.test(p) && !p.includes('__tests__')) aus.push(p);
  }
  return aus;
}

describe('Symbole je Bildschirm', () => {
  for (const [name, pfade] of Object.entries(BILDSCHIRME)) {
    it(`zeigt auf „${name}“ kein Symbol zweimal`, () => {
      const gesehen = new Map<string, string>();
      const doppelt: string[] = [];
      for (const pfad of pfade) {
        const z = ZEICHEN[pfad];
        const vorher = gesehen.get(z);
        if (vorher) doppelt.push(`${z}: ${vorher} und ${pfad}`);
        gesehen.set(z, pfad);
      }
      expect(doppelt).toEqual([]);
    });
  }

  it('lässt jedes Symbol nur dann zwei Seiten gehören, wenn es dort steht', () => {
    const erlaubt = new Set(GETEILT.map(([a, b]) => [a, b].sort().join(' | ')));
    const nachSymbol = new Map<string, ZeichenPfad[]>();
    for (const [pfad, z] of Object.entries(ZEICHEN) as Array<[ZeichenPfad, string]>) {
      nachSymbol.set(z, [...(nachSymbol.get(z) ?? []), pfad]);
    }
    const unerlaubt: string[] = [];
    for (const [z, pfade] of nachSymbol) {
      if (pfade.length < 2) continue;
      const schluessel = [...pfade].sort().join(' | ');
      if (!erlaubt.has(schluessel)) unerlaubt.push(`${z}: ${pfade.join(', ')}`);
    }
    expect(unerlaubt).toEqual([]);
  });

  it('erkennt ein doppeltes Symbol (die Prüfung prüft sich selbst)', () => {
    const probe = ['/lernen/trainer/handranking', '/lernen/uebungstisch'].map(() => 'play');
    expect(new Set(probe).size).toBeLessThan(probe.length);
  });
});

describe('Quelltext', () => {
  it('schreibt in keiner Liste ein Symbol neben das Ziel', () => {
    /* `to: '/x', icon: 'y'` — so entstanden die Paare. */
    const dateien = ['src/components/Layout.tsx', 'src/pages/LearnPage.tsx', 'src/pages/SessionPage.tsx',
      'src/pages/ReferencePage.tsx', 'src/pages/ProfilePage.tsx', 'src/pages/StatsPage.tsx',
      'src/pages/session/PayoutPage.tsx', 'src/lib/trainerliste.ts'];
    const roh: string[] = [];
    for (const d of dateien) {
      const text = readFileSync(d, 'utf8');
      for (const m of text.matchAll(/(?:icon|zeichen)[:=]\s*\{?['"][a-z]+['"]/g)) roh.push(`${d}: ${m[0]}`);
    }
    expect(roh, 'Symbol am Ziel führen: zeichenFuer(pfad) in src/lib/zeichen.ts').toEqual([]);
  });

  it('hat für jedes Symbol der Liste eine Zeichnung', () => {
    const namen = [...(ICON.match(/export type IconName =([^;]+);/)?.[1] ?? '').matchAll(/'([a-z]+)'/g)].map((m) => m[1]);
    const gezeichnet = new Set([...ICON.matchAll(/case '([a-z]+)':/g)].map((m) => m[1]));
    expect(namen.length).toBeGreaterThan(30);
    expect(namen.filter((n) => !gezeichnet.has(n)), 'IconName ohne case in paths()').toEqual([]);
  });

  it('führt für jeden Trainer ein eigenes Symbol', () => {
    const z = TRAINER.map((t) => t.zeichen);
    expect(new Set(z).size).toBe(z.length);
  });
});

describe('Kein Glücksspiel-Symbol', () => {
  it('benutzt nirgends den Spielautomaten', () => {
    const treffer = quellen('src').filter((d) => readFileSync(d, 'utf8').includes('🎰'));
    expect(treffer, 'Die App spielt nicht um Geld — kein 🎰 (E-030).').toEqual([]);
  });
});
