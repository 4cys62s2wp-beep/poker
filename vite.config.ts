import { readFileSync } from 'node:fs';
import { buildCsp, isValidAuthDomain } from './src/lib/csp';
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

function cspPlugin(): Plugin {
  return {
    name: 'inject-csp',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace(
        '<meta charset="UTF-8" />',
        `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${buildCsp(authDomainFromConfig())}" />`,
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), cspPlugin()],
  base: './',
  define: {
    __SINGLE__: 'false',
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
