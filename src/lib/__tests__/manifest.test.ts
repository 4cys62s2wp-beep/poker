/* Das Manifest zeigt auf etwas, das es gibt (E-083).
   =================================================

   Die Verknüpfung „Pokerabend" führte auf `./#/session/tisch` — eine Route, die
   seit E-030 nicht mehr existiert; der Platzhalter `*` leitete still auf die
   Startseite um, und der Text darunter beschrieb den entfernten Tisch. Niemand
   sah es, weil es keine Prüfung gab. */

import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { istOrt } from '../orte';

interface Verknuepfung { name: string; short_name: string; description: string; url: string; icons: Array<{ src: string }> }
interface Bild { src: string; sizes: string; type: string; form_factor?: string; label: string }
const M = JSON.parse(readFileSync('public/manifest.webmanifest', 'utf8')) as {
  description: string;
  shortcuts: Verknuepfung[];
  screenshots: Bild[];
  icons: Array<{ src: string }>;
};
const datei = (src: string) => `public/${src.replace(/^\.\//, '')}`;

function groesse(pfad: string): [number, number] {
  const b = readFileSync(pfad);
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
}

describe('Manifest', () => {
  it('führt jede Verknüpfung zu einer Seite, die es gibt', () => {
    expect(M.shortcuts.length).toBeGreaterThanOrEqual(4);
    for (const v of M.shortcuts) {
      const pfad = v.url.replace(/^\.\/#/, '');
      expect(istOrt(pfad), `${v.name} → ${v.url}`).toBe(true);
    }
  });

  it('erkennt eine tote Verknüpfung (die Prüfung prüft sich selbst)', () => {
    expect(istOrt('/session/tisch')).toBe(false);
  });

  it('beschreibt keinen entfernten Tisch', () => {
    for (const v of M.shortcuts) expect(v.description, v.name).not.toMatch(/Karten, Chips und Blinds/);
    expect(M.shortcuts.some((v) => v.name === 'Abend starten' && v.url === './#/session/live/einrichten')).toBe(true);
  });

  it('hat eine Beschreibung in einer Sprache', () => {
    expect(M.description).not.toMatch(/Learn and train|English/);
  });

  it('kennt Vorschaubilder für Handy und Rechner, in der Größe, die sie haben', () => {
    const formen = new Set(M.screenshots.map((b) => b.form_factor));
    expect(formen).toEqual(new Set(['narrow', 'wide']));
    for (const b of M.screenshots) {
      expect(existsSync(datei(b.src)), b.src).toBe(true);
      const [w, h] = groesse(datei(b.src));
      expect(b.sizes, b.src).toBe(`${w}x${h}`);
      expect(b.label.length, b.src).toBeGreaterThan(5);
    }
  });

  it('verweist nur auf vorhandene Symbole', () => {
    for (const i of [...M.icons, ...M.shortcuts.flatMap((v) => v.icons)]) {
      expect(existsSync(datei(i.src)), i.src).toBe(true);
    }
  });
});

describe('Unbekannte Adressen', () => {
  it('führen auf eine eigene Seite statt still zur Startseite', () => {
    const app = readFileSync('src/App.tsx', 'utf8');
    expect(app).toMatch(/<Route path="\*" element=\{<NotFoundPage \/>\} \/>/);
  });
});
