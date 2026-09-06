/* Anführungszeichen im Fließtext.
   ================================

   Die Oberfläche hat es von Anfang an richtig gemacht: 16 öffnende und 16
   schließende deutsche Anführungszeichen, kein einziges gerades. Die
   **Lerninhalte** — also das, was man minutenlang liest — hatten 883 gerade
   Anführungszeichen und 557 gerade Apostrophe. In derselben Lektion stand
   einmal „ich habe doch Odds" und ein paar Absätze weiter "zur besten Hand".

   Das ist keine Geschmacksfrage, sondern ein Bruch mit dem, was die App
   sonst überall tut. Diese Prüfung hält den Zustand nach E-050 fest.

   Sie liest die Zeichenketten über den TypeScript-Parser aus und nicht mit
   einem Regex über den Quelltext: Ein Anführungszeichen als Begrenzer und
   eines als Inhalt sehen gleich aus, und nur der Parser weiß, welches was
   ist. Ein Literal mit Einsetzungen (`… ${x} …`) wird dabei als **ein**
   Text geprüft — ein Zitat darf über die Grenze hinweg offen bleiben:

       `Nichts zu „${begriff}" gefunden.`

   Genau daran ist die Umstellung einmal gescheitert (siehe E-050). */

import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';

function dateien(ordner: string, aus: string[] = []): string[] {
  for (const eintrag of readdirSync(ordner)) {
    const p = join(ordner, eintrag);
    if (statSync(p).isDirectory()) dateien(p, aus);
    else if (/\.tsx?$/.test(p) && !p.includes('__tests__')) aus.push(p);
  }
  return aus;
}

const AUF_DE = '„'; // „
const ZU_DE = '“'; // “
const AUF_EN = '“'; // “
const ZU_EN = '”'; // ”

/**
 * Meldet, was in einem Text nicht aufgeht. Der Rückgabewert ist eine Liste
 * von Sätzen — leer heißt: in Ordnung.
 */
export function befunde(text: string, wo: string): string[] {
  const raus: string[] = [];
  const kurz = text.replace(/\n/g, ' ').slice(0, 60);
  let erwartet: string | null = null;
  for (const c of text) {
    if (c === '"') raus.push(`${wo}: gerades Anführungszeichen in „${kurz}…"`);
    else if (c === "'") raus.push(`${wo}: gerader Apostroph in „${kurz}…"`);
    else if (c === AUF_DE || (c === AUF_EN && erwartet === null)) {
      if (erwartet !== null) raus.push(`${wo}: öffnet zweimal in „${kurz}…"`);
      erwartet = c === AUF_DE ? ZU_DE : ZU_EN;
    } else if (c === ZU_DE || c === ZU_EN) {
      if (erwartet === null) raus.push(`${wo}: schließt ohne zu öffnen in „${kurz}…"`);
      else if (erwartet !== c) raus.push(`${wo}: schließt mit dem falschen Zeichen in „${kurz}…"`);
      erwartet = null;
    }
  }
  if (erwartet !== null) raus.push(`${wo}: Anführungszeichen bleibt offen in „${kurz}…"`);
  return raus;
}

/** Alle Texte einer Datei, Einsetzungs-Literale als ein Stück. */
function texteAus(datei: string): Array<[string, string]> {
  const quelle = readFileSync(datei, 'utf8');
  const baum = ts.createSourceFile(datei, quelle, ts.ScriptTarget.Latest, true);
  const raus: Array<[string, string]> = [];
  const zeile = (n: ts.Node) => baum.getLineAndCharacterOfPosition(n.getStart(baum)).line + 1;
  const lauf = (n: ts.Node): void => {
    if (ts.isTemplateExpression(n)) {
      raus.push([n.head.text + n.templateSpans.map((s) => s.literal.text).join(''), `${datei}:${zeile(n)}`]);
      for (const s of n.templateSpans) s.expression.forEachChild(lauf);
      return;
    }
    if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) {
      raus.push([n.text, `${datei}:${zeile(n)}`]);
    }
    n.forEachChild(lauf);
  };
  lauf(baum);
  return raus;
}

const alle = [...dateien('src/content'), ...dateien('src/i18n')].flatMap(texteAus);

describe('Typografie im Text', () => {
  it('findet überhaupt Text — sonst prüft dieser Test nichts', () => {
    expect(alle.length).toBeGreaterThan(5000);
  });

  it('erkennt einen Fehler (die Prüfung prüft sich selbst)', () => {
    expect(befunde('Er sagte "nein".', 'Probe')).toHaveLength(2);
    expect(befunde(`Er sagte ${AUF_DE}nein${ZU_EN}.`, 'Probe')).toHaveLength(1);
    expect(befunde(`${AUF_DE}offen ohne Ende`, 'Probe')).toHaveLength(1);
    expect(befunde("don't", 'Probe')).toHaveLength(1);
    expect(befunde(`Er sagte ${AUF_DE}nein${ZU_DE}.`, 'Probe')).toEqual([]);
    expect(befunde(`He said ${AUF_EN}no${ZU_EN}.`, 'Probe')).toEqual([]);
    expect(befunde('Hold’em', 'Probe')).toEqual([]);
  });

  it('benutzt nirgends gerade Anführungszeichen oder Apostrophe', () => {
    const raus = alle.flatMap(([t, wo]) => befunde(t, wo));
    expect(raus.slice(0, 12), `${raus.length} Stellen`).toEqual([]);
  });

  it('schreibt die englischen Inhalte nicht auf Deutsch', () => {
    /* „…" ist die deutsche Form. In den englischen Bündeln hat sie nichts
       zu suchen — und umgekehrt gilt ” im Deutschen nicht. */
    const englisch = dateien('src/content/en').flatMap(texteAus);
    const falsch = englisch.filter(([t]) => t.includes(AUF_DE)).map(([, wo]) => wo);
    expect(falsch.slice(0, 8)).toEqual([]);

    const deutsch = dateien('src/content')
      .filter((d) => !d.includes(`content${'/'}en`))
      .flatMap(texteAus);
    const falschDe = deutsch.filter(([t]) => t.includes(ZU_EN)).map(([, wo]) => wo);
    expect(falschDe.slice(0, 8)).toEqual([]);
  });
});
