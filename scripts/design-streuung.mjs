/**
 * Zählt verstreute Gestaltungswerte in Bildschirmen und Komponenten und
 * schreibt den Stand nach `src/lib/design/streuung-basis.json`.
 *
 * Aufruf: `npm run streuung`
 *
 * Der Test `design.test.ts` vergleicht gegen diese Datei und schlägt an,
 * sobald eine Datei mehr Werte enthält als festgehalten — oder eine neue
 * Datei mit Werten dazukommt. Wer aufräumt, ruft dieses Skript auf und
 * schreibt die kleinere Zahl fest.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ORDNER = ['src/pages', 'src/components'];
const BASIS = join(WURZEL, 'src/lib/design/streuung-basis.json');

function dateien(pfad, aus = []) {
  for (const eintrag of readdirSync(pfad)) {
    const voll = join(pfad, eintrag);
    if (statSync(voll).isDirectory()) dateien(voll, aus);
    else if (voll.endsWith('.tsx')) aus.push(voll);
  }
  return aus;
}

// Die Zählregel steht in src/lib/design/streuung.ts und wird hier als Text
// geladen, damit es sie nur einmal gibt.
const regel = readFileSync(join(WURZEL, 'src/lib/design/streuung.ts'), 'utf8');
const js = regel
  .replace(/^import[^;]+;$/gm, '')
  .replace(/export interface [\s\S]*?\n}\n/g, '')
  .replace(/: Streuung\b/g, '')
  .replace(/: string\[\]/g, '')
  .replace(/: string\b/g, '')
  .replace(/: number\b/g, '')
  .replace(/ as const/g, '')
  .replace(/export /g, '');
const modul = new Function(`${js}; return { zaehleStreuung, summe };`)();

const stand = {};
for (const ordner of ORDNER) {
  for (const datei of dateien(join(WURZEL, ordner))) {
    const s = modul.zaehleStreuung(readFileSync(datei, 'utf8'));
    const gesamt = modul.summe(s);
    if (gesamt > 0) stand[relative(WURZEL, datei)] = gesamt;
  }
}

const sortiert = Object.fromEntries(Object.entries(stand).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(BASIS, `${JSON.stringify(sortiert, null, 2)}\n`, 'utf8');

const gesamt = Object.values(sortiert).reduce((a, b) => a + b, 0);
console.log(`${Object.keys(sortiert).length} Dateien mit verstreuten Werten, ${gesamt} Stellen`);
for (const [datei, n] of Object.entries(sortiert).sort(([, a], [, b]) => b - a).slice(0, 10)) {
  console.log(`  ${String(n).padStart(4)}  ${datei}`);
}
