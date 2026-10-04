import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { buildCsp, isValidAuthDomain } from './src/lib/csp';
import { setzeAdresse } from './src/lib/oeffentlicheAdresse';
import { defineConfig, type Plugin } from 'vitest/config';
import react from '@vitejs/plugin-react';

/* Die Anmelde-Domain steht in public/firebase-config.json und wird hier zur
   BAUZEIT gelesen, statt sie fest einzutragen: Wer das Projekt wechselt,
   tauscht die Konfigurationsdatei – und die Richtlinie zieht automatisch mit,
   statt still auf die alte Domain zu zeigen.

   Die Richtlinie selbst steht in src/lib/csp.ts und ist dort getestet. Hier
   bleibt nur das Lesen der Datei. */
function authDomainFromConfig(): string | null {
  try {
    const raw = JSON.parse(readFileSync('public/firebase-config.json', 'utf8')) as unknown;
    const d = (raw as { authDomain?: unknown }).authDomain;
    return isValidAuthDomain(d) ? d : null;
  } catch {
    return null;
  }
}

/* Die Hashes der inline-Skripte aus dem FERTIGEN HTML.
   ==================================================
   index.html enthält genau ein inline-Skript: das, welches den Farbmodus
   setzt, bevor das Stilblatt greift. `script-src 'self'` hat es still
   blockiert (E-043) — die Konsole meldete es auf jeder Seite, und niemand
   las die Konsole.

   Erlaubt wird es über seinen Hash und nicht über `'unsafe-inline'`: So
   ist genau dieses eine Skript erlaubt, Zeichen für Zeichen, und jede
   Änderung daran fällt sofort auf. Gerechnet wird nach allen anderen
   Umformungen (`order: 'post'`), damit der Hash zum ausgelieferten Text
   passt und nicht zum Entwurf. */
function inlineSkriptHashes(html: string): string[] {
  return [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)]
    .map((m) => `'sha256-${createHash('sha256').update(m[1], 'utf8').digest('base64')}'`);
}

function adressPlugin(): Plugin {
  return {
    name: 'oeffentliche-adresse',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => setzeAdresse(html, process.env.VITE_PUBLIC_URL),
    },
  };
}

function cspPlugin(): Plugin {
  return {
    name: 'inject-csp',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        const csp = buildCsp(authDomainFromConfig(), inlineSkriptHashes(html));
        return html.replace(
          '<meta charset="UTF-8" />',
          `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${csp}" />`,
        );
      },
    },
  };
}

/* Welcher Stand ist das? Datum und Kurzfassung der Version — damit „Ich habe die
   neue Fassung" eine Auskunft ist und kein Gefühl. Ohne Git (Tarball-Build)
   bleibt nur das Datum. */
function bauStand(): string {
  const datum = new Date().toISOString().slice(0, 10);
  try {
    const sha = (process.env.GITHUB_SHA ?? execSync('git rev-parse HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString()).trim().slice(0, 7);
    return sha ? `${datum} · ${sha}` : datum;
  } catch {
    return datum;
  }
}

export default defineConfig({
  plugins: [react(), adressPlugin(), cspPlugin()],
  base: './',
  define: {
    __SINGLE__: 'false',
    __BAU__: JSON.stringify(bauStand()),
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  test: {
    // Die Regeltests brauchen Java und den laufenden Firestore-Emulator und
    // liefen bei `npm test` sonst zwangsläufig rot. Sie haben mit
    // `npm run test:rules` einen eigenen Lauf (vitest.rules.config.ts).
    exclude: ['**/node_modules/**', '**/dist/**', '**/rules.test.ts'],
  },
});
