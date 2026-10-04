/* Alle deutschen Texte der Oberfläche und der Inhalte.
   =====================================================

   Gemeinsame Grundlage für Prüfungen, die über den ganzen Wortlaut laufen.
   Sie liest über den TypeScript-Parser, nicht mit einem Regex über den
   Quelltext (Begründung: typografie.test.ts), und unterscheidet Deutsch von
   Englisch an drei Stellen:

   - `defineStrings(de, en)` — nur das erste Argument ist deutsch;
   - ein Objekt unter dem Schlüssel `en` (die Engine-Texte);
   - ein Pfad mit `/en/` (die englischen Inhalte). */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';

export interface Text {
  text: string;
  wo: string;
  datei: string;
}

function dateien(ordner: string, aus: string[] = []): string[] {
  for (const eintrag of readdirSync(ordner)) {
    const p = join(ordner, eintrag);
    if (statSync(p).isDirectory()) dateien(p, aus);
    else if (/\.tsx?$/.test(p) && !p.includes('__tests__')) aus.push(p);
  }
  return aus;
}

function istEnglisch(n: ts.Node): boolean {
  for (let p: ts.Node | undefined = n; p?.parent; p = p.parent) {
    const eltern: ts.Node = p.parent;
    if (ts.isPropertyAssignment(eltern) && eltern.initializer === p) {
      const name = ts.isIdentifier(eltern.name) ? eltern.name.text : ts.isStringLiteral(eltern.name) ? eltern.name.text : '';
      if (name === 'en') return true;
    }
    if (ts.isCallExpression(eltern)
      && ts.isIdentifier(eltern.expression) && eltern.expression.text === 'defineStrings'
      && eltern.arguments[1] === p) return true;
  }
  return false;
}

/** Alle deutschen Zeichenketten einer Datei. */
export function deutscheTexteAus(datei: string): Text[] {
  if (datei.includes('/en/')) return [];
  const quelle = readFileSync(datei, 'utf8');
  const baum = ts.createSourceFile(datei, quelle, ts.ScriptTarget.Latest, true,
    datei.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const raus: Text[] = [];
  const zeile = (n: ts.Node) => baum.getLineAndCharacterOfPosition(n.getStart(baum)).line + 1;
  const lauf = (n: ts.Node): void => {
    if (ts.isImportDeclaration(n) || ts.isImportEqualsDeclaration(n)) return;
    if (ts.isTemplateExpression(n)) {
      if (!istEnglisch(n)) {
        raus.push({
          text: n.head.text + n.templateSpans.map((s) => s.literal.text).join(''),
          wo: `${datei}:${zeile(n)}`, datei,
        });
      }
      for (const s of n.templateSpans) s.expression.forEachChild(lauf);
      return;
    }
    if ((ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) && !istEnglisch(n)) {
      /* Bezeichner in Typen und Schlüsseln sind kein Wortlaut. */
      const p = n.parent;
      const istSchluessel = ts.isPropertyAssignment(p) && p.name === n;
      const istTyp = ts.isLiteralTypeNode(p);
      if (!istSchluessel && !istTyp) raus.push({ text: n.text, wo: `${datei}:${zeile(n)}`, datei });
    }
    n.forEachChild(lauf);
  };
  lauf(baum);
  return raus;
}

/** Alles Deutsche unter `src` außer Tests. */
export function alleDeutschenTexte(): Text[] {
  return dateien('src').flatMap(deutscheTexteAus);
}
