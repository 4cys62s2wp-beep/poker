/* Installieren im passenden Moment (E-086).
   =========================================

   Im Code gab es kein `beforeinstallprompt`; im Profil stand ein Fließtext mit
   „PWA". Jetzt: ein echter Knopf unter Chromium, eine Anleitung auf iOS, nichts
   in der installierten App — und nur an zwei Stellen. */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { installationsart } from '../installieren';
import { STR } from '../../i18n/pages/installieren';

describe('installationsart', () => {
  it('bietet in der installierten App nichts an', () => {
    expect(installationsart({ standalone: true, hatDialog: true, ios: true })).toBe('installiert');
  });

  it('bietet unter Chromium den Knopf an', () => {
    expect(installationsart({ standalone: false, hatDialog: true, ios: false })).toBe('knopf');
  });

  it('zeigt auf iOS die Anleitung — dort gibt es keinen Dialog', () => {
    expect(installationsart({ standalone: false, hatDialog: false, ios: true })).toBe('anleitung');
  });

  it('bietet dort nichts an, wo es nicht geht', () => {
    expect(installationsart({ standalone: false, hatDialog: false, ios: false })).toBe('keine');
  });
});

describe('Verwendung', () => {
  function dateien(ordner: string, aus: string[] = []): string[] {
    for (const e of readdirSync(ordner)) {
      const p = join(ordner, e);
      if (statSync(p).isDirectory()) dateien(p, aus);
      else if (/\.tsx?$/.test(p) && !p.includes('__tests__')) aus.push(p);
    }
    return aus;
  }

  it('steht nur beim Einrichten eines Abends und im Profil', () => {
    const mit = dateien('src').filter((d) => readFileSync(d, 'utf8').includes('<InstallierenKarte'));
    expect(mit.sort()).toEqual(['src/pages/ProfilePage.tsx', 'src/pages/live/EinrichtenPage.tsx']);
  });

  it('hört früh auf das Angebot des Browsers und bietet nach Besuchen oder Lektionen nichts an', () => {
    const lib = readFileSync('src/lib/installieren.ts', 'utf8');
    expect(lib).toContain("'beforeinstallprompt'");
    expect(lib).toContain("'appinstalled'");
    expect(lib).toContain('(display-mode: standalone)');
    for (const d of dateien('src')) {
      expect(readFileSync(d, 'utf8'), d).not.toMatch(/besuche?\s*>=?\s*3|visitCount|nach der ersten Lektion/i);
    }
  });

  it('sagt nirgends „PWA“', () => {
    for (const l of ['de', 'en'] as const) {
      expect(JSON.stringify(STR[l])).not.toMatch(/PWA/);
    }
    expect(readFileSync('src/i18n/pages/profile.ts', 'utf8')).not.toContain('PWA');
  });
});
