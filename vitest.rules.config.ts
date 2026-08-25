import { defineConfig } from 'vitest/config';

/* Eigener Lauf für die Firestore-Regeltests: Sie brauchen Java und den
   Firestore-Emulator, deshalb laufen sie nicht bei `npm test` mit.
   Start über `npm run test:rules` – das Skript fährt den Emulator hoch,
   führt diese Konfiguration aus und beendet ihn wieder. */
export default defineConfig({
  test: {
    include: ['src/**/rules.test.ts'],
    // Ein einzelner Emulator, geteilte Datenbank: parallele Dateien würden sich
    // über clearFirestore() gegenseitig die Testdaten unter den Füßen wegziehen.
    fileParallelism: false,
    testTimeout: 20000,
    hookTimeout: 30000,
  },
});
