/* Woher der Browser für die Messläufe kommt.
   =========================================

   Die neun Läufe messen die gebaute App in einem echten Browser. Dafür
   brauchen sie Playwright — und das stand bis E-054 in jedem Skript als
   absoluter Pfad auf eine globale Installation
   (`/opt/node22/lib/node_modules/…`).

   Dieser Pfad existiert genau auf einer Maschine. Überall sonst — auf dem
   Rechner des Entwicklers, in der GitHub-Action — bricht der Lauf sofort mit
   `ERR_MODULE_NOT_FOUND` ab. Damit war die ganze Prüfapparatur, auf der die
   Qualität dieses Projekts ruht, für alle außer einer Umgebung unbenutzbar.

   Playwright steht bewusst **nicht** in den `devDependencies`: Es zieht einen
   Browser nach sich und würde jedes `npm ci` verlangsamen, obwohl es nur für
   die gelegentlichen Messläufe gebraucht wird. Stattdessen wird es hier
   gesucht, wo es liegen kann — und wenn es nirgends liegt, sagt die
   Fehlermeldung, was zu tun ist. */

/** Übliche Fundorte, in dieser Reihenfolge. */
const ORTE = [
  'playwright', // im Projekt installiert
  'playwright-core', // schlanke Variante
  '/opt/node22/lib/node_modules/playwright/index.mjs', // global (Container)
  '/usr/lib/node_modules/playwright/index.mjs',
];

/**
 * Liefert `chromium`. Wirft mit einer brauchbaren Anleitung, wenn Playwright
 * nirgends zu finden ist — eine Fehlermeldung, die nur `ERR_MODULE_NOT_FOUND`
 * sagt, hilft niemandem weiter.
 */
export async function holeChromium() {
  for (const ort of ORTE) {
    try {
      const modul = await import(ort);
      if (modul.chromium) return modul.chromium;
    } catch {
      // nächster Ort
    }
  }
  throw new Error(
    'Playwright nicht gefunden. Die Messläufe brauchen einen echten Browser:\n'
    + '  npm i -D playwright && npx playwright install chromium\n'
    + 'Danach läuft z. B. `npm run pruefen` (bei laufendem `npm run preview`).',
  );
}
