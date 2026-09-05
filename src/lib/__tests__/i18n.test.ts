/* Paritätstest: Das englische Inhalts-Bundle muss das deutsche strukturell
   exakt spiegeln – gleiche IDs, gleiche Reihenfolge, gleiche Quiz-Indizes,
   gleiche Karten. Nur so bleibt der Lernfortschritt sprachunabhängig. */

import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { DE_BUNDLE } from '../../i18n';
import { EN_BUNDLE } from '../../content/en';

describe('EN-Inhalte spiegeln DE strukturell', () => {
  it('Module: gleiche IDs, Lektionen, Quizstruktur, Karten', () => {
    expect(EN_BUNDLE.modules.length).toBe(DE_BUNDLE.modules.length);
    for (let i = 0; i < DE_BUNDLE.modules.length; i++) {
      const de = DE_BUNDLE.modules[i];
      const en = EN_BUNDLE.modules[i];
      expect(en.id).toBe(de.id);
      expect(en.level).toBe(de.level);
      expect(en.lessons.length).toBe(de.lessons.length);
      for (let j = 0; j < de.lessons.length; j++) {
        const dl = de.lessons[j];
        const el = en.lessons[j];
        expect(el.id).toBe(dl.id);
        expect(el.sections.length).toBe(dl.sections.length);
        expect(el.quiz.length).toBe(dl.quiz.length);
        for (let q = 0; q < dl.quiz.length; q++) {
          expect(el.quiz[q].correctIndex).toBe(dl.quiz[q].correctIndex);
          expect(el.quiz[q].options.length).toBe(dl.quiz[q].options.length);
        }
        for (let s = 0; s < dl.sections.length; s++) {
          expect(el.sections[s].cards ?? null).toEqual(dl.sections[s].cards ?? null);
          if (dl.sections[s].table) {
            expect(el.sections[s].table!.rows.length).toBe(dl.sections[s].table!.rows.length);
          }
        }
      }
    }
  });

  it('Glossar: identische Terms und Kategorien in gleicher Reihenfolge', () => {
    expect(EN_BUNDLE.glossary.map((g) => g.term)).toEqual(DE_BUNDLE.glossary.map((g) => g.term));
    expect(EN_BUNDLE.glossary.map((g) => g.category)).toEqual(DE_BUNDLE.glossary.map((g) => g.category));
  });

  it('Szenarien: gleiche IDs, Karten und Options-Qualitäten', () => {
    expect(EN_BUNDLE.scenarios.map((s) => s.id)).toEqual(DE_BUNDLE.scenarios.map((s) => s.id));
    for (let i = 0; i < DE_BUNDLE.scenarios.length; i++) {
      expect(EN_BUNDLE.scenarios[i].heroCards).toEqual(DE_BUNDLE.scenarios[i].heroCards);
      expect(EN_BUNDLE.scenarios[i].board).toEqual(DE_BUNDLE.scenarios[i].board);
      expect(EN_BUNDLE.scenarios[i].options.map((o) => o.quality)).toEqual(
        DE_BUNDLE.scenarios[i].options.map((o) => o.quality),
      );
    }
  });

  it('Tells, Abzeichen, Push-Charts strukturgleich', () => {
    expect(EN_BUNDLE.tells.map((t) => t.category)).toEqual(DE_BUNDLE.tells.map((t) => t.category));
    expect(EN_BUNDLE.tells.map((t) => t.reliability)).toEqual(DE_BUNDLE.tells.map((t) => t.reliability));
    expect(EN_BUNDLE.tellCategories.map((c) => c.id)).toEqual(DE_BUNDLE.tellCategories.map((c) => c.id));
    expect(EN_BUNDLE.badges.map((b) => b.id)).toEqual(DE_BUNDLE.badges.map((b) => b.id));
    expect(EN_BUNDLE.pushCharts.map((c) => `${c.stack}-${c.position}`)).toEqual(
      DE_BUNDLE.pushCharts.map((c) => `${c.stack}-${c.position}`),
    );
    for (let i = 0; i < DE_BUNDLE.pushCharts.length; i++) {
      expect(EN_BUNDLE.pushCharts[i].push).toEqual(DE_BUNDLE.pushCharts[i].push);
    }
  });

  it('Pro-Insights: gleiche Profile und Anzahl der Prinzipien', () => {
    expect(EN_BUNDLE.proProfiles.map((p) => p.id)).toEqual(DE_BUNDLE.proProfiles.map((p) => p.id));
    expect(EN_BUNDLE.beginnerMistakes.length).toBe(DE_BUNDLE.beginnerMistakes.length);
    expect(EN_BUNDLE.edgeSpots.length).toBe(DE_BUNDLE.edgeSpots.length);
  });
});

/* Der Lernstand auf der Startseite: Regel bleibt, Prüfung entfällt.
   ==============================================================
   Hier standen drei Prüfungen über `learnStatus` — den Satz „x Lektionen
   abgeschlossen" auf der alten Startseite. Die Regel aus E-032 (nennen, was
   geschafft ist, nie „x von y") gilt weiter und steht dort; den Satz gibt
   es seit E-035 nicht mehr, die Startseite zeigt den Fortschritt als
   Balken. Eine Prüfung über eine Zeichenkette, die niemand anzeigt, hält
   nichts fest — sie hielt hier nur den Eintrag im Wörterbuch am Leben
   (E-043). */


/* ── Wörterbucheinträge, die niemand mehr anzeigt (E-043) ────────────────
   Beim Durchsehen gefunden: 74 Schlüssel — in beiden Sprachen also 148
   Zeichenketten — die kein Bildschirm mehr benutzte. Reste alter
   Startseiten, eines alten Trainer-Hubs, einer entfernten
   Zurücksetzen-Funktion.

   Sie sind nicht nur Ballast. Wer `hub.ts` liest, hält `continueTitle` und
   `greetingMorning` für Teil der App und richtet die nächste Änderung
   danach aus. Und eine Übersetzung, die niemand sieht, wird trotzdem
   gepflegt. */

describe('Das Wörterbuch hat keine toten Einträge', () => {
  /* Schlüssel, die zur Laufzeit zusammengesetzt werden, kommen im Quelltext
     als Zeichenkette vor (`L[z.text]` mit `text: 'feldGlossar'`). Der Test
     zählt beides — Feldzugriff und Zeichenkette. */
  const quelltext = (() => {
    const dateien: string[] = [];
    const sammle = (pfad: string) => {
      for (const eintrag of readdirSync(pfad)) {
        const voll = join(pfad, eintrag);
        if (statSync(voll).isDirectory()) {
          if (!voll.includes('__tests__')) sammle(voll);
        } else if (/\.(tsx|ts)$/.test(voll) && !voll.includes('/i18n/pages/')) {
          dateien.push(voll);
        }
      }
    };
    sammle('src');
    return dateien.map((d) => readFileSync(d, 'utf8')).join('\n');
  })();

  it('benutzt jeden Schlüssel irgendwo', () => {
    const tot: string[] = [];
    for (const datei of readdirSync('src/i18n/pages')) {
      const s = readFileSync(join('src/i18n/pages', datei), 'utf8');
      const ersterBlock = s.slice(s.indexOf('defineStrings('), s.indexOf('\n  },'));
      for (const m of ersterBlock.matchAll(/^ {4}([a-zA-Z]\w*)\s*:/gm)) {
        const k = m[1];
        const alsFeld = new RegExp(`\\.${k}\\b`).test(quelltext);
        const alsWort = new RegExp(`['"\`]${k}['"\`]`).test(quelltext);
        if (!alsFeld && !alsWort) tot.push(`${datei}: ${k}`);
      }
    }
    expect(tot.sort(), 'Diese Einträge zeigt kein Bildschirm mehr an').toEqual([]);
  });
});
