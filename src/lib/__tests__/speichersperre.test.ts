/* Wenn das Gerät den Speicher verweigert.
   ======================================

   `localStorage` ist kein Feld, das immer da ist. Im privaten Fenster, bei
   gesperrten Website-Daten und unter mancher Unternehmensrichtlinie wirft
   schon der reine Lesezugriff einen `SecurityError` — nicht `null`, nicht
   `undefined`, sondern eine Ausnahme.

   Eine einzige ungeschützte Stelle im Startpfad genügt dann, damit die
   Fehlergrenze übernimmt: Die Nutzerin sieht auf **jedem** Bildschirm nur
   noch „Da ist etwas schiefgelaufen". Genau das ist im Gegenversuch
   passiert — ein `try` aus `leseModus()` entfernt, und alle geprüften
   Bildschirme zeigten die Absturzseite.

   Unit-Tests finden so etwas nie: In jsdom funktioniert `localStorage`
   immer. Deshalb prüft dieser Test den Quelltext selbst, über den
   TypeScript-Parser: Jeder Zugriff auf `localStorage` oder
   `sessionStorage` muss innerhalb derselben Funktion in einem `try` liegen.

   „Derselben Funktion" ist wichtig: Ein `try` weiter außen fängt nichts
   mehr, sobald dazwischen ein Rückruf oder ein `await` steht. */

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

const SPEICHER = new Set(['localStorage', 'sessionStorage']);

/** Ist `knoten` ein Zugriff auf einen der beiden Web-Speicher? */
function speicherzugriff(knoten: ts.Node): string | null {
  if (!ts.isPropertyAccessExpression(knoten)) return null;
  const ziel = knoten.expression;
  if (ts.isIdentifier(ziel) && SPEICHER.has(ziel.text)) return ziel.text;
  // window.localStorage.getItem(…)
  if (
    ts.isPropertyAccessExpression(ziel) &&
    ts.isIdentifier(ziel.name) &&
    SPEICHER.has(ziel.name.text)
  ) {
    return ziel.name.text;
  }
  return null;
}

/** Grenzen, hinter denen ein äußeres `try` nicht mehr greift. */
function istFunktionsgrenze(knoten: ts.Node): boolean {
  return (
    ts.isFunctionDeclaration(knoten) ||
    ts.isFunctionExpression(knoten) ||
    ts.isArrowFunction(knoten) ||
    ts.isMethodDeclaration(knoten) ||
    ts.isConstructorDeclaration(knoten) ||
    ts.isGetAccessorDeclaration(knoten) ||
    ts.isSetAccessorDeclaration(knoten)
  );
}

/**
 * Liegt der Zugriff im `try`-Block eines `try/catch` derselben Funktion?
 * Ein `try` **ohne** `catch` (nur `finally`) zählt nicht — es fängt nicht.
 */
function abgesichert(knoten: ts.Node): boolean {
  let kind: ts.Node = knoten;
  let eltern = kind.parent;
  while (eltern) {
    if (ts.isTryStatement(eltern) && eltern.tryBlock === kind && eltern.catchClause) return true;
    if (istFunktionsgrenze(eltern)) return false;
    kind = eltern;
    eltern = eltern.parent;
  }
  return false;
}

function ungeschuetzt(): string[] {
  const funde: string[] = [];
  for (const pfad of dateien(WURZEL)) {
    const quelle = ts.createSourceFile(
      pfad,
      readFileSync(pfad, 'utf8'),
      ts.ScriptTarget.Latest,
      true,
      /\.tsx$/.test(pfad) ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
    );
    const gehe = (knoten: ts.Node): void => {
      const name = speicherzugriff(knoten);
      if (name && !abgesichert(knoten)) {
        const { line } = quelle.getLineAndCharacterOfPosition(knoten.getStart(quelle));
        funde.push(`${relative(process.cwd(), pfad)}:${line + 1} — ${name}`);
      }
      ts.forEachChild(knoten, gehe);
    };
    ts.forEachChild(quelle, gehe);
  }
  return funde;
}

describe('gesperrter Gerätespeicher', () => {
  it('greift nirgends ungeschützt auf localStorage oder sessionStorage zu', () => {
    expect(ungeschuetzt()).toEqual([]);
  });

  it('findet überhaupt Zugriffe — sonst prüft die Regel nichts', () => {
    // Schutznetz gegen einen Test, der nur deshalb grün ist, weil der
    // Parser nichts mehr erkennt (etwa nach einem Umbau der Speicherschicht).
    let gezaehlt = 0;
    for (const pfad of dateien(WURZEL)) {
      const quelle = ts.createSourceFile(
        pfad,
        readFileSync(pfad, 'utf8'),
        ts.ScriptTarget.Latest,
        true,
        /\.tsx$/.test(pfad) ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
      );
      const gehe = (knoten: ts.Node): void => {
        if (speicherzugriff(knoten)) gezaehlt++;
        ts.forEachChild(knoten, gehe);
      };
      ts.forEachChild(quelle, gehe);
    }
    expect(gezaehlt).toBeGreaterThanOrEqual(20);
  });
});

/* Der Quelltext ist nur die Hälfte. Firebase, der Router und die
   Browser-Laufzeit fassen den Speicher selbst an — ein Versionssprung kann
   das ändern, ohne dass sich eine Zeile im Projekt rührt. `npm run
   speichersperre` lädt deshalb jeden Bildschirm zweimal mit gesperrtem
   Speicher; hier wird das Ergebnis festgehalten. */
interface Befund {
  adresse: string;
  art: string;
  text: string;
}
interface Sperre {
  geprueft_am: string;
  grund: string;
  breite: number;
  sperre_wirkt: boolean;
  bildschirme: number;
  geladen: number;
  befunde_gesamt: number;
  je_art: Record<string, number>;
  befunde: Befund[];
}

const S: Sperre = JSON.parse(readFileSync('docs/speichersperre.json', 'utf8'));
const BEDIENBAR = JSON.parse(readFileSync('docs/bedienbar.json', 'utf8')) as {
  bildschirme_liste: string[];
};

describe('Messung mit gesperrtem Speicher', () => {
  it('wurde mit wirklich gesperrtem Speicher gemessen', () => {
    // Ohne diese Bestätigung wäre der Lauf grün, weil er nichts gesperrt hat.
    expect(S.sperre_wirkt).toBe(true);
  });

  it('deckt alle Bildschirme ab', () => {
    expect(S.bildschirme).toBe(BEDIENBAR.bildschirme_liste.length);
    expect(S.bildschirme).toBeGreaterThanOrEqual(90);
  });

  it('lädt jeden Bildschirm auch ohne Gerätespeicher', () => {
    expect(S.geladen).toBe(S.bildschirme);
  });

  it('zeigt nirgends die Absturzseite statt des Bildschirms', () => {
    expect(S.befunde.slice(0, 10), `${S.befunde_gesamt} Befunde`).toEqual([]);
    expect(S.befunde_gesamt).toBe(0);
  });
});
