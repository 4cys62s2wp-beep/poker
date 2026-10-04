/* Gratis und Pro: jede Sperre steht überall, wo es sie gibt (E-098).

   Der Fehler, den dieser Test festhält: Die Seiten Push/Fold, Szenario und
   Pro-Insights waren gesperrt, ihre Kacheln trugen kein Schloss, und die
   Wiederholung — die Lernschleife — lag hinter der Sperre, während die Startseite
   sie anbot. Der Test liest die Quellen, weil er so auch eine **neue** Seite mit
   `ProLock` findet, an die niemand beim Schloss gedacht hat. */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  FREE_TRAINER_PATHS,
  PRO_ADRESSEN_LISTE,
  PRO_TRAINER_IDS,
  proZiel,
} from '../pro/plan';
import { TRAINER } from '../trainerliste';

function dateien(ordner: string): string[] {
  return readdirSync(ordner).flatMap((n) => {
    const pfad = join(ordner, n);
    return statSync(pfad).isDirectory() ? dateien(pfad) : pfad.endsWith('.tsx') ? [pfad] : [];
  });
}

const SEITEN = dateien('src/pages').map((pfad) => ({ pfad, text: readFileSync(pfad, 'utf8') }));
const APP = readFileSync('src/App.tsx', 'utf8');
const LERNEN = readFileSync('src/pages/LearnPage.tsx', 'utf8');

/** Statische Adressen und die Seite (Komponente), die sie zeigt. */
function routen(): Array<{ pfad: string; komponente: string }> {
  return [...APP.matchAll(/<Route path="([^"]+)" element=\{<(\w+) \/>\}/g)].map((m) => ({
    pfad: m[1], komponente: m[2],
  }));
}

function seiteVon(komponente: string): { pfad: string; text: string } | undefined {
  return SEITEN.find((s) => new RegExp(`export function ${komponente}\\b`).test(s.text));
}

describe('Jede Seite mit Sperre steht in der Tabelle', () => {
  const mitSperre = routen().filter((r) => seiteVon(r.komponente)?.text.includes('<ProLock'));

  it('es gibt Seiten mit Sperre (sonst prüft dieser Test nichts)', () => {
    expect(mitSperre.length).toBeGreaterThanOrEqual(5);
  });

  it('jede statische Adresse einer gesperrten Seite hat ein Pro-Ziel', () => {
    const statisch = mitSperre.filter((r) => !r.pfad.includes(':'));
    const fehlt = statisch.filter((r) => proZiel(r.pfad) === null).map((r) => r.pfad);
    expect(fehlt).toEqual([]);
  });

  it('Module und Lektionen: die dynamischen Adressen kennen ihre Sperre', () => {
    const dynamisch = mitSperre.filter((r) => r.pfad.includes(':')).map((r) => r.pfad).sort();
    expect(dynamisch).toEqual(['/lernen/:moduleId', '/lernen/:moduleId/:lessonId']);
    expect(proZiel('/lernen/m5')).not.toBeNull();
    expect(proZiel('/lernen/m5/m5-l2')).not.toBeNull();
  });
});

describe('Jede Sperre hat ein Schloss an ihrer Kachel', () => {
  it('Trainerkacheln lesen das Schloss aus der Adresse', () => {
    expect(LERNEN).toContain('<Schloss pfad={u.to} />');
  });

  it('jede feste Pro-Adresse hat eine Kachel mit Schloss: aus der Trainerliste oder von Hand', () => {
    const ohneKachel = PRO_ADRESSEN_LISTE.filter((pfad) => {
      const ueberTrainer = TRAINER.some((t) => t.zu === pfad);
      const vonHand = LERNEN.includes(`<Schloss pfad="${pfad}" />`);
      return !ueberTrainer && !vonHand;
    });
    expect(ohneKachel).toEqual([]);
  });

  it('Module und Lektionen tragen es im Lernpfad und auf der Modulseite', () => {
    expect(LERNEN).toContain('<Schloss pfad={`/lernen/${m.id}`} />');
    expect(readFileSync('src/pages/ModulePage.tsx', 'utf8')).toContain('<Schloss pfad={`/lernen/${module.id}/${lesson.id}`} />');
  });

  it('die Suche zeigt es an Werkzeugen und Lektionen', () => {
    const treffer = readFileSync('src/components/SuchTreffer.tsx', 'utf8');
    expect(treffer).toContain('<Schloss pfad={z.to} />');
    expect(treffer).toContain('<Schloss pfad={`/lernen/${h.moduleId}/${h.lessonId}`} />');
  });
});

describe('Die Lernschleife liegt nicht hinter der Sperre', () => {
  it('Wiederholen fragt den Pro-Status nicht ab', () => {
    const text = readFileSync('src/pages/ReviewPage.tsx', 'utf8');
    expect(text).not.toMatch(/usePro|ProLock|fullAccess/);
  });

  it('der Coach am Übungstisch hängt an keinem Feature', () => {
    const text = readFileSync('src/pages/PlayPage.tsx', 'utf8');
    expect(text).not.toMatch(/play-coach|coachAllowed/);
  });

  it('Fehler sammeln sich für alle im Wiederholungsstapel', () => {
    const app = readFileSync('src/state/AppState.tsx', 'utf8');
    const a = app.indexOf('const addReviewItem');
    expect(a).toBeGreaterThan(0);
    expect(app.slice(a, a + 1500)).not.toMatch(/fullAccess|usePro|checkAccess/);
  });
});

describe('Die Trainerliste und die Grenze sagen dasselbe', () => {
  it('jeder Trainer ist gratis oder Pro, keiner beides, keiner keins', () => {
    const ids = TRAINER.map((t) => t.id).sort();
    const gratis = [...FREE_TRAINER_PATHS];
    const pro = [...PRO_TRAINER_IDS];
    expect([...gratis, ...pro].sort()).toEqual(ids);
    expect(gratis.filter((g) => (pro as string[]).includes(g))).toEqual([]);
  });

  it('die Sperre einer Trainerkachel ist genau die Pro-Zugehörigkeit', () => {
    for (const t of TRAINER) {
      expect(proZiel(t.zu) !== null, t.id).toBe((PRO_TRAINER_IDS as readonly string[]).includes(t.id));
    }
  });
});

describe('Der Messlauf im Browser (npm run sperren)', () => {
  const lauf = JSON.parse(readFileSync('docs/sperren.json', 'utf8')) as {
    pruefungen: number; befunde_gesamt: number; befunde: Array<{ pruefung: string; text: string }>;
  };

  it('hat gemessen und nichts gefunden', () => {
    expect(lauf.befunde, JSON.stringify(lauf.befunde)).toEqual([]);
    expect(lauf.befunde_gesamt).toBe(0);
  });

  it('hat viel geprüft (sonst bliebe er grün, weil er nichts tat)', () => {
    expect(lauf.pruefungen).toBeGreaterThanOrEqual(65);
  });
});
