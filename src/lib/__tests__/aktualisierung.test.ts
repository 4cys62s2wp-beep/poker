/* Neue Versionen werden angekündigt, nicht untergeschoben (E-085).
   ===============================================================

   Der Worker übernahm jede neue Fassung beim Installieren sofort. Mitten in der
   Lektion tauschte sich der Zwischenspeicher aus; der nächste Abruf holte eine
   Datei der neuen Fassung zur alten Seite. */

import { readFileSync } from 'node:fs';
import { afterEach, describe, expect, it, vi } from 'vitest';

const SW = readFileSync('public/sw.js', 'utf8');

describe('Service Worker', () => {
  it('übernimmt eine neue Fassung nicht von selbst', () => {
    const install = SW.slice(SW.indexOf("addEventListener('install'"), SW.indexOf("addEventListener('activate'"));
    expect(install).not.toContain('skipWaiting');
  });

  it('übernimmt sie auf Nachricht der App', () => {
    expect(SW).toMatch(/addEventListener\('message'[\s\S]*SKIP_WAITING[\s\S]*self\.skipWaiting\(\)/);
  });
});

describe('Neu laden nur einmal', () => {
  afterEach(() => { vi.unstubAllGlobals(); vi.resetModules(); });

  it('lädt beim ersten Fehler neu und beim zweiten nicht (keine Schleife)', async () => {
    const speicher = new Map<string, string>();
    const reload = vi.fn();
    vi.stubGlobal('sessionStorage', {
      getItem: (k: string) => speicher.get(k) ?? null,
      setItem: (k: string, v: string) => void speicher.set(k, v),
    });
    vi.stubGlobal('window', { location: { reload } });
    const { ladeEinmalNeu } = await import('../aktualisierung');
    expect(ladeEinmalNeu()).toBe(true);
    expect(ladeEinmalNeu()).toBe(false);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('lädt bei gesperrtem Speicher gar nicht neu', async () => {
    const reload = vi.fn();
    vi.stubGlobal('sessionStorage', { getItem: () => { throw new Error('gesperrt'); }, setItem: () => { throw new Error('gesperrt'); } });
    vi.stubGlobal('window', { location: { reload } });
    const { ladeEinmalNeu } = await import('../aktualisierung');
    expect(ladeEinmalNeu()).toBe(false);
    expect(reload).not.toHaveBeenCalled();
  });

  it('bietet ohne wartende Fassung nichts an', async () => {
    const { uebernimmFassung } = await import('../aktualisierung');
    expect(uebernimmFassung()).toBeNull();
  });
});

describe('Verdrahtung', () => {
  it('registriert den Worker über die eigene Datei und zeigt das Band im Rahmen', () => {
    expect(readFileSync('src/main.tsx', 'utf8')).toContain('registriereWorker()');
    expect(readFileSync('src/components/Layout.tsx', 'utf8')).toContain('<UpdateBand />');
    /* Der Tisch liegt außerhalb des Rahmens — dort erscheint nie ein Band. */
    expect(readFileSync('src/pages/live/TischPage.tsx', 'utf8')).not.toContain('UpdateBand');
  });

  it('fängt ein fehlendes Seitenpaket ab', () => {
    expect(readFileSync('src/lib/aktualisierung.ts', 'utf8')).toContain("'vite:preloadError'");
  });

  it('zeigt den Stand des Baus im Profil und setzt ihn in beiden Builds', () => {
    expect(readFileSync('vite.config.ts', 'utf8')).toContain('__BAU__');
    expect(readFileSync('vite.single.config.ts', 'utf8')).toContain('__BAU__');
    expect(readFileSync('src/pages/ProfilePage.tsx', 'utf8')).toContain('P.bauStand(__BAU__)');
  });
});
