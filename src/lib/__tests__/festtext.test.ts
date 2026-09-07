/* Deutscher Text, der an der Sprachwahl vorbeigeht.
   ================================================

   Die App gibt es auf Deutsch und Englisch, und `i18n.test.ts` prüft, dass
   beide Sprachdateien dieselbe Struktur haben. Was dieser Vergleich nicht
   sehen kann: einen Satz, der gar nicht erst in einer Sprachdatei steht,
   sondern fest in einer Komponente. Der bleibt in der englischen Fassung
   deutsch stehen — und keine Strukturprüfung merkt es je.

   Geprüft werden die beiden Stellen, an denen so etwas sichtbar wird:
   Text zwischen den Tags und die vier Attribute, die die Nutzerin zu lesen
   bekommt (`aria-label`, `placeholder`, `title`, `alt`).

   Gelesen über den TypeScript-Parser, nicht per Regex: Dieses Projekt ist
   durchgehend deutsch kommentiert, und ein Regex über den Quelltext fände
   in jedem zweiten Kommentar einen Treffer.

   Sprachneutrales bleibt erlaubt und ist auch vorhanden: der Name
   „PokerMentor", Pokerbegriffe wie „Call" und „Fold", die in beiden Sprachen
   gleich heißen, und die beiden Sprachnamen im Willkommensdialog, die
   absichtlich in ihrer eigenen Sprache stehen. Deshalb sucht die Regel nach
   **deutschen** Merkmalen und nicht nach Text überhaupt. */

import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import ts from 'typescript';

const WURZEL = join(process.cwd(), 'src');

function dateien(ordner: string, aus: string[] = []): string[] {
  for (const eintrag of readdirSync(ordner)) {
    const p = join(ordner, eintrag);
    if (statSync(p).isDirectory()) dateien(p, aus);
    else if (/\.tsx?$/.test(p) && !p.includes('__tests__')) aus.push(p);
  }
  return aus;
}

/** Umlaute, ß und ein paar Wörter, die es nur auf Deutsch gibt. */
const DEUTSCH =
  /[äöüÄÖÜß]|\b(und|oder|nicht|dein|deine|dich|kein|keine|wird|wurde|noch|schon|weniger|Karten|Spieler|Runde|zurück|weiter|Fehler|Speicher)\b/;
const HAT_WORT = /[A-Za-zÄÖÜäöüß]{3,}/;
const SICHTBARE_ATTRIBUTE = new Set(['aria-label', 'placeholder', 'title', 'alt']);

function festerDeutscherText(): string[] {
  const funde: string[] = [];
  for (const pfad of dateien(WURZEL)) {
    // Sprachdateien und Lerninhalte sind per Definition sprachgebunden.
    if (pfad.includes('/i18n/') || pfad.includes('/content/')) continue;
    const quelle = ts.createSourceFile(
      pfad,
      readFileSync(pfad, 'utf8'),
      ts.ScriptTarget.Latest,
      true,
      /\.tsx$/.test(pfad) ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
    );
    const melde = (knoten: ts.Node, text: string, art: string): void => {
      const t = text.trim();
      if (!HAT_WORT.test(t) || !DEUTSCH.test(t)) return;
      const { line } = quelle.getLineAndCharacterOfPosition(knoten.getStart(quelle));
      funde.push(`${relative(process.cwd(), pfad)}:${line + 1} [${art}] ${t.slice(0, 60)}`);
    };
    const gehe = (k: ts.Node): void => {
      if (ts.isJsxText(k)) melde(k, k.text, 'Text');
      if (
        ts.isJsxAttribute(k) &&
        SICHTBARE_ATTRIBUTE.has(k.name.getText(quelle)) &&
        k.initializer &&
        ts.isStringLiteral(k.initializer)
      ) {
        melde(k, k.initializer.text, k.name.getText(quelle));
      }
      ts.forEachChild(k, gehe);
    };
    ts.forEachChild(quelle, gehe);
  }
  return funde;
}

describe('Zweisprachigkeit', () => {
  it('hat keinen fest eingebauten deutschen Text in Komponenten', () => {
    expect(festerDeutscherText()).toEqual([]);
  });

  it('sieht überhaupt JSX-Text — sonst prüft die Regel nichts', () => {
    /* Schutznetz: Fände der Parser gar keine Textknoten mehr (Umbau auf eine
       andere Vorlagensprache, geänderte Dateiendungen), wäre die Regel still
       grün und wertlos. */
    let gezaehlt = 0;
    for (const pfad of dateien(WURZEL)) {
      if (pfad.includes('/i18n/') || pfad.includes('/content/')) continue;
      const quelle = ts.createSourceFile(
        pfad,
        readFileSync(pfad, 'utf8'),
        ts.ScriptTarget.Latest,
        true,
        /\.tsx$/.test(pfad) ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
      );
      const gehe = (k: ts.Node): void => {
        if (ts.isJsxText(k) && HAT_WORT.test(k.text)) gezaehlt++;
        ts.forEachChild(k, gehe);
      };
      ts.forEachChild(quelle, gehe);
    }
    expect(gezaehlt).toBeGreaterThanOrEqual(10);
  });
});
