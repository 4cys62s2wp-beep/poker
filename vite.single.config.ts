import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Baut die komplette App in eine einzelne HTML-Datei (für Vorschau/Artifact).
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  base: './',
  define: {
    __SINGLE__: 'true',
  },
  build: {
    outDir: 'dist-single',
    sourcemap: false,
  },
});
