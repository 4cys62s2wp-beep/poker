/* Gemeinsame Bausteine: Rückmeldung, Aktionsfarben, Leerzustand.
   ==============================================================

   Gefunden in der Durchsicht:
   - Sieben Varianten, eine Antwort zu bewerten („Richtig!", „Stark
     geschätzt!", „Leider nein.", „Daneben." …), mit ✓ oder ✗ als Textzeichen
     aus der Schrift. In Wiederholung und Push/Fold-Trainer unterschied nur
     die Farbe (Regel 11.4).
   - Im Drill stand ein lachsrotes „27,8 %" neben einem grünen „Richtig": Die
     Zahl war nach „lohnt sich" gefärbt, das Urteil nach „richtig".
   - Dieselbe Raise-Farbe gab es in drei Goldtönen und die Call-Farbe in zwei
     Grüns: Matrix, Legende des Preflop-Trainers, Legende des Chart-
     Betrachters, Legende des Push/Fold-Trainers (E-079). */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { kontrast } from '../design/kontrast';
import { STR } from '../../i18n/rueckmeldung';

const CSS = readFileSync('src/styles/global.css', 'utf8');

function quellen(ordner: string, aus: string[] = []): string[] {
  for (const e of readdirSync(ordner)) {
    const p = join(ordner, e);
    if (statSync(p).isDirectory()) quellen(p, aus);
    else if (/\.(ts|tsx)$/.test(p) && !p.includes('__tests__')) aus.push(p);
  }
  return aus;
}

/** Quelltext ohne Kommentare — in Kommentaren darf das Zeichen vorkommen. */
const ohneKommentare = (t: string) => t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

describe('Rückmeldung', () => {
  it('kennt drei Wörter, deutsch und englisch', () => {
    expect(Object.keys(STR.de).sort()).toEqual(['falsch', 'knapp', 'richtig']);
    expect(STR.de.richtig).toBe('Richtig');
    expect(STR.de.falsch).toBe('Nicht ganz');
    expect(STR.de.knapp).toBe('Hauchdünn');
    expect(Object.keys(STR.en).sort()).toEqual(['falsch', 'knapp', 'richtig']);
  });

  it('schreibt nirgends mehr ✓ oder ✗ als Textzeichen', () => {
    const treffer: string[] = [];
    for (const d of quellen('src')) {
      const code = ohneKommentare(readFileSync(d, 'utf8'));
      for (const m of code.matchAll(/[✓✗✕✔✘]/g)) treffer.push(`${d}: ${m[0]}`);
    }
    expect(treffer, 'Haken und Kreuz kommen aus <Icon name="check|x" />').toEqual([]);
  });

  it('lässt in den Trainern kein eigenes feedback-box-Urteil stehen', () => {
    const treffer: string[] = [];
    for (const d of quellen('src/pages/trainers')) {
      if (/feedback-box \$\{/.test(readFileSync(d, 'utf8'))) treffer.push(d);
    }
    expect(treffer, '<Rueckmeldung urteil="richtig|falsch" /> benutzen').toEqual([]);
    for (const d of ['src/components/QuizRunner.tsx', 'src/pages/ReviewPage.tsx']) {
      expect(readFileSync(d, 'utf8'), d).toContain('<Rueckmeldung');
    }
  });

  it('färbt die Equity-Zahl des Drills nicht nach „lohnt sich“', () => {
    expect(CSS).not.toMatch(/\.drill-zahl\.(gut|schlecht)/);
    const drill = readFileSync('src/pages/trainers/PotOddsDrill.tsx', 'utf8');
    expect(drill).not.toMatch(/drill-zahl\$\{/);
  });
});

describe('Aktionsfarben', () => {
  const wert = (name: string) => CSS.match(new RegExp(`${name}:\\s*([^;]+);`))?.[1].trim() ?? '';

  it('führt Raise, Call und Fold als Tokens', () => {
    for (const t of ['--range-raise', '--range-raise-text', '--range-call', '--range-call-text', '--range-fold']) {
      expect(wert(t), `${t} fehlt`).toBeTruthy();
    }
  });

  it.each([['raise'], ['call']])('hält die Schrift auf %s an beiden Enden des Verlaufs', (art) => {
    const verlauf = wert(`--range-${art}`);
    const farben = [...verlauf.matchAll(/#[0-9a-fA-F]{6}/g)].map((m) => m[0]);
    const schrift = wert(`--range-${art}-text`);
    expect(farben.length).toBe(2);
    for (const f of farben) {
      const k = kontrast(schrift, f);
      expect(k, `${art}: ${schrift} auf ${f} = ${k.toFixed(2)}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('nimmt Zellen und Legenden aus denselben Tokens', () => {
    expect(CSS).toMatch(/\.matrix \.cell\.raise\s*\{[^}]*var\(--range-raise\)/);
    expect(CSS).toMatch(/\.matrix \.cell\.call\s*\{[^}]*var\(--range-call\)/);
    expect(CSS).toMatch(/\.range-legend \.sw\.raise\s*\{[^}]*var\(--range-raise\)/);
    const inline: string[] = [];
    for (const d of quellen('src/pages')) {
      const code = readFileSync(d, 'utf8');
      for (const m of code.matchAll(/className="sw"[^>]*style=/g)) inline.push(`${d}: ${m[0]}`);
    }
    expect(inline, 'Legenden: className="sw raise|call|fold"').toEqual([]);
  });

  it('färbt Fold nicht als Warnung', () => {
    expect(CSS).not.toMatch(/\.coach-verdict\.v-fold[^}]*danger/);
    expect(readFileSync('src/pages/PlayPage.tsx', 'utf8')).not.toMatch(/btn danger[^>]*\{ type: 'fold' \}/);
  });
});
