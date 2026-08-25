import { defineConfig, type Plugin } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Content-Security-Policy nur im Produktions-Build injizieren:
// Der Dev-Server braucht Inline-Skripte/WebSockets, der Einzeldatei-Build Inline-Bundles.
// connect-src erlaubt neben 'self' nur die Firebase-Endpunkte (Auth + Firestore).
// wss:// steht mit dabei, weil CSP Schemata strikt trennt: eine https-Quelle
// erlaubt keine WebSocket-Verbindung zum selben Host. Firestore nutzt normalerweise
// WebChannel über HTTPS, kann aber je nach Netz auf WebSockets wechseln.
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://www.googleapis.com wss://firestore.googleapis.com",
  "worker-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-src 'none'",
].join('; ');

function cspPlugin(): Plugin {
  return {
    name: 'inject-csp',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace(
        '<meta charset="UTF-8" />',
        `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${CSP}" />`,
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
