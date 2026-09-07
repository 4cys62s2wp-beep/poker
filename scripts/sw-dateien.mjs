/* Die gebauten Dateien in den Service Worker eintragen.
   ====================================================

   Der Worker legte Skript und Stilblatt bislang erst beim **zweiten** Besuch
   ab: Beim ersten übernimmt er die Seite zwar (`clients.claim()`), aber da
   sind sie längst geladen. Wer die App öffnete und dann offline ging, ohne
   sie ein zweites Mal zu starten, stand vor einer leeren Seite.

   Gesehen hat das keine Messung — der HTTP-Zwischenspeicher des Browsers
   sprang ein und lieferte die Dateien, obwohl der Worker sie nicht hatte.
   Erst als `npm run ohnenetz` nachsah, *was* im Zwischenspeicher liegt statt
   nur *ob es lädt*, kam es heraus (E-071).

   Die Namen tragen einen Streuwert, den erst der Build kennt. Dieser Schritt
   trägt sie nach `dist/sw.js` ein — dieselbe Bauart wie der Datenblock, den
   `npm run daten` setzt. */

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const DIST = 'dist';
const SW = join(DIST, 'sw.js');

/** Alles unter dist/assets plus die Symbole — alles, was ein Bildschirm braucht. */
function gebauteDateien() {
  const aus = [];
  const gehe = (ordner, praefix) => {
    for (const eintrag of readdirSync(ordner)) {
      const p = join(ordner, eintrag);
      if (statSync(p).isDirectory()) gehe(p, `${praefix}${eintrag}/`);
      else aus.push(`${praefix}${eintrag}`);
    }
  };
  gehe(join(DIST, 'assets'), './assets/');
  gehe(join(DIST, 'icons'), './icons/');
  return aus.sort();
}

const dateien = gebauteDateien();
const stand = createHash('sha256').update(dateien.join('\n')).digest('hex').slice(0, 12);

let sw = readFileSync(SW, 'utf8');
const vorher = sw;
sw = sw.replace(/^const GEBAUTE_DATEIEN = \[\];$/m, `const GEBAUTE_DATEIEN = ${JSON.stringify(dateien)};`);
sw = sw.replace(/^const BAU_STAND = 'entwicklung';$/m, `const BAU_STAND = '${stand}';`);

if (sw === vorher) {
  console.error('In dist/sw.js fehlen die Platzhalter GEBAUTE_DATEIEN / BAU_STAND.');
  process.exit(1);
}

writeFileSync(SW, sw, 'utf8');
console.log(`${dateien.length} gebaute Dateien in den Service Worker eingetragen (Baustand ${stand}).`);
