/* Bestehen, Mischen, Lesestand (FAHRPLAN 5.1, 5.3, 5.4). */

import { describe, expect, it } from 'vitest';
import {
  anordnung, bestanden, grenze, lektionsXp, mischeAlle, mischeFrage, XP_ERGEBNIS, XP_FEST,
} from '../lernen/quiz';
import { abschnittAus } from '../lernen/lesestand';
import { tageBis } from '../lernen/faellig';
import { ALL_MODULES } from '../../content';
import { EN_BUNDLE } from '../../content/en';

describe('Bestehen heißt verstanden', () => {
  it('liegt bei vier von fünf', () => {
    expect(grenze(5)).toBe(4);
    expect(bestanden(4, 5)).toBe(true);
    expect(bestanden(3, 5)).toBe(false);
  });

  it('lässt null von fünf nicht bestehen — das war der Fehler', () => {
    expect(bestanden(0, 5)).toBe(false);
  });

  it('rundet nach oben, bei vier Fragen drei, bei sechs fünf', () => {
    expect(grenze(4)).toBe(4);
    expect(grenze(6)).toBe(5);
    expect(grenze(10)).toBe(8);
  });

  it('kennt kein Quiz ohne Fragen als bestanden', () => {
    expect(bestanden(0, 0)).toBe(false);
  });

  it('ist durch Raten kaum zu schaffen', () => {
    /* Vier Optionen, fünf Fragen: Die Chance, durch Raten vier oder fünf
       zu treffen, liegt unter 2 %. */
    const p = 0.25;
    const treffer = 5 * p ** 4 * (1 - p) + p ** 5;
    expect(treffer).toBeLessThan(0.02);
  });
});

describe('Die XP einer Lektion', () => {
  it('sind 20 fest und 80 nach Ergebnis, höchstens 100', () => {
    expect(XP_FEST + XP_ERGEBNIS).toBe(100);
    expect(lektionsXp(5, 5)).toBe(100);
    expect(lektionsXp(4, 5)).toBe(84);
  });

  it('belohnen das Ergebnis stärker als das Auftauchen', () => {
    /* Vorher 60 + 40 × Anteil: Für nichts gab es drei Fünftel von allem. */
    expect(lektionsXp(0, 5)).toBeLessThan(lektionsXp(5, 5) / 4);
  });
});

describe('Das Mischen der Optionen', () => {
  const frage = {
    question: 'F', options: ['a', 'b', 'c', 'd'], correctIndex: 1, explanation: '',
  };

  it('behält alle Optionen und zeigt mit correctIndex auf die richtige', () => {
    for (let n = 0; n < 50; n += 1) {
      const g = mischeFrage(frage, `s${n}`);
      expect([...g.frage.options].sort()).toEqual(['a', 'b', 'c', 'd']);
      expect(g.frage.options[g.frage.correctIndex]).toBe('b');
      /* Die Abbildung führt zurück an die Originalstelle. */
      expect(g.original[g.frage.correctIndex]).toBe(1);
    }
  });

  it('ist bei gleichem Startwert gleich, bei anderem meist anders', () => {
    expect(anordnung(4, 'x')).toEqual(anordnung(4, 'x'));
    const verschieden = new Set(Array.from({ length: 40 }, (_, i) => anordnung(4, `s${i}`).join('')));
    expect(verschieden.size).toBeGreaterThan(8);
  });

  it('verteilt die richtige Antwort gleichmäßig auf alle Stellen', () => {
    /* Der Grund: In 58 % der Fragen war B richtig. Über viele Durchgänge soll
       jede Stelle etwa ein Viertel bekommen. */
    const zaehler = [0, 0, 0, 0];
    for (let n = 0; n < 2000; n += 1) zaehler[mischeFrage(frage, `z${n}`).frage.correctIndex] += 1;
    for (const z of zaehler) {
      expect(z).toBeGreaterThan(400);
      expect(z).toBeLessThan(600);
    }
  });

  it('gibt jeder Frage eines Durchgangs eine eigene Anordnung', () => {
    const fragen = Array.from({ length: 12 }, () => frage);
    const stellen = mischeAlle(fragen, 'durchgang').map((g) => g.original.join(''));
    expect(new Set(stellen).size).toBeGreaterThan(4);
  });
});

describe('Die Inhalte vertragen das Mischen', () => {
  it('enthalten keine Option, die sich auf eine Stelle bezieht', () => {
    /* „Antwort B", „A und C", „alle oben genannten" würden nach dem Mischen
       etwas anderes meinen. Spieler mit den Namen A, B, C sind etwas
       anderes: Sie stehen im Fragetext. */
    const treffer: string[] = [];
    for (const m of ALL_MODULES) {
      for (const l of m.lessons) {
        l.quiz.forEach((q, i) => {
          for (const o of q.options) {
            if (/^(alle (der )?(genannten|oben|vorherigen)|keine der|keines|nichts davon|beide (antworten|aussagen|oben))/i.test(o)
              || /^[a-d] und [a-d]$/i.test(o)
              || /\b(Antwort|Option|Aussage) [A-D]\b/.test(o)) {
              treffer.push(`${l.id}:${i} ${o}`);
            }
          }
        });
      }
    }
    expect(treffer).toEqual([]);
  });

  it('haben bei jeder Frage eine gültige richtige Antwort', () => {
    for (const m of ALL_MODULES) {
      for (const l of m.lessons) {
        l.quiz.forEach((q) => {
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThan(q.options.length);
        });
      }
    }
  });
});

describe('Der Lesestand', () => {
  it('nimmt den letzten Abschnitt, dessen Überschrift die Linie erreicht hat', () => {
    /* Fenster 800, Linie bei 320. */
    expect(abschnittAus([-900, -200, 280, 900], 800, false)).toBe(2);
    expect(abschnittAus([100, 500, 900], 800, false)).toBe(0);
  });

  it('beginnt bei null, auch wenn noch keine Überschrift die Linie erreicht hat', () => {
    expect(abschnittAus([600, 1200], 800, false)).toBe(0);
  });

  it('nimmt am Seitenende den letzten Abschnitt, auch einen kurzen', () => {
    expect(abschnittAus([-900, -400, 700], 800, true)).toBe(2);
  });

  it('kommt mit einer Lektion ohne Abschnitte zurecht', () => {
    expect(abschnittAus([], 800, false)).toBe(0);
  });
});

describe('Wann etwas fällig ist', () => {
  it('zählt Kalendertage, über Monats- und Jahreswechsel', () => {
    expect(tageBis('2026-10-05', '2026-10-04')).toBe(1);
    expect(tageBis('2026-11-01', '2026-10-30')).toBe(2);
    expect(tageBis('2027-01-01', '2026-12-31')).toBe(1);
    expect(tageBis('2026-10-04', '2026-10-04')).toBe(0);
  });

  it('verliert keinen Tag bei der Zeitumstellung', () => {
    expect(tageBis('2026-03-30', '2026-03-28')).toBe(2);
    expect(tageBis('2026-10-26', '2026-10-24')).toBe(2);
  });
});

describe('Die richtige Antwort verrät sich nicht durch ihre Länge (FAHRPLAN 5.3)', () => {
  /* In 75 % der 248 Fragen war die richtige Option die längste, in Modul 8
     in 93 %. Wer immer die längste wählte, bestand das Quiz. Die Sperre ist
     ein Deckel je Modul; er stand zuerst auf dem damaligen Wert und sank mit
     jeder überarbeiteten Frage. Bei zufälliger Länge läge der Anteil bei 25 %. */
  const DECKEL = 0.4;

  function anteil(module: typeof ALL_MODULES): Array<[string, number, number]> {
    return module.map((m) => {
      let laengste = 0;
      let alle = 0;
      for (const l of m.lessons) {
        for (const q of l.quiz) {
          alle += 1;
          const laengen = q.options.map((o) => o.length);
          const max = Math.max(...laengen);
          if (laengen[q.correctIndex] === max && laengen.filter((n) => n === max).length === 1) laengste += 1;
        }
      }
      return [m.id, laengste, alle];
    });
  }

  for (const [name, module] of [['deutsch', ALL_MODULES], ['englisch', EN_BUNDLE.modules]] as const) {
    it(`bleibt in jedem Modul (${name}) unter ${DECKEL * 100} %`, () => {
      for (const [id, laengste, alle] of anteil(module)) {
        expect(laengste / alle, `${id}: ${laengste} von ${alle}`).toBeLessThanOrEqual(DECKEL);
      }
    });
  }

  it('liegt über alle Module nahe der zufälligen Verteilung von einem Viertel', () => {
    const gesamt = anteil(ALL_MODULES).reduce((a, [, l, n]) => [a[0] + l, a[1] + n], [0, 0]);
    expect(gesamt[0] / gesamt[1]).toBeLessThan(0.35);
    /* Und nicht in die andere Richtung gekippt: Wer nie die längste wählt,
       besteht auch. */
    expect(gesamt[0] / gesamt[1]).toBeGreaterThan(0.15);
  });
});

describe('Kartenfragen und Erklärungen je Option (FAHRPLAN 5.10)', () => {
  const module = [['deutsch', ALL_MODULES], ['englisch', EN_BUNDLE.modules]] as const;

  it('nennen nur gültige, nicht doppelte Karten', () => {
    for (const [, mods] of module) {
      for (const m of mods) {
        for (const l of m.lessons) {
          l.quiz.forEach((q, i) => {
            const alle = [...(q.cards ?? []), ...(q.board ?? [])];
            for (const k of alle) expect(k, `${l.id}:${i}`).toMatch(/^[2-9TJQKA][shdc]$/);
            expect(new Set(alle).size, `${l.id}:${i} doppelte Karte`).toBe(alle.length);
          });
        }
      }
    }
  });

  it('haben bei jeder Frage mit Erklärung je Option genau eine Zeile — für die richtige leer', () => {
    for (const [, mods] of module) {
      for (const m of mods) {
        for (const l of m.lessons) {
          l.quiz.forEach((q, i) => {
            if (!q.optionFeedback) return;
            expect(q.optionFeedback, `${l.id}:${i}`).toHaveLength(q.options.length);
            expect(q.optionFeedback[q.correctIndex], `${l.id}:${i} richtige Option`).toBe('');
          });
        }
      }
    }
  });

  it('zeigen in beiden Sprachen dieselben Karten', () => {
    const de = ALL_MODULES.flatMap((m) => m.lessons.flatMap((l) => l.quiz.map((q) => [q.cards, q.board])));
    const en = EN_BUNDLE.modules.flatMap((m) => m.lessons.flatMap((l) => l.quiz.map((q) => [q.cards, q.board])));
    expect(en).toEqual(de);
  });

  it('haben mindestens fünfzehn Fragen mit Karten über den Optionen', () => {
    const n = ALL_MODULES.flatMap((m) => m.lessons.flatMap((l) => l.quiz)).filter((q) => q.cards || q.board).length;
    expect(n).toBeGreaterThanOrEqual(15);
  });

  it('nennen in Kartenfragen die Karten nicht noch einmal als Text', () => {
    /* Was als Karte über der Frage steht, steht nicht zusätzlich in
       Buchstaben darin. Spielerhände in Fragen mit mehreren Spielern
       (m1-l2) bleiben Text — dafür gibt es nur ein Feld für die eigene Hand. */
    const MIT_TEXT = new Set(['m1-l2']);
    for (const m of ALL_MODULES) {
      for (const l of m.lessons) {
        if (MIT_TEXT.has(l.id)) continue;
        l.quiz.forEach((q, i) => {
          if (!q.cards && !q.board) return;
          /* Ein Verweis auf eine einzelne Karte („mit dem A♠") ist erlaubt, eine
             Aufzählung der Hand nicht. */
          expect((q.question.match(/[AKQJT2-9][♠♥♦♣]/g) ?? []).length, `${l.id}:${i}`).toBeLessThanOrEqual(2);
        });
      }
    }
  });

  it('hat in der Omaha-Frage nur eine Pik-Karte in der Hand', () => {
    /* Die erste Fassung nannte A♠ K♠ als Hole Cards und verneinte den Flush —
       mit zwei Pik-Karten in der Hand ist es aber einer. Gefunden beim Umbau
       zur Kartenfrage. */
    const q = ALL_MODULES.find((m) => m.id === 'm1')!.lessons.find((l) => l.id === 'm1-l5')!.quiz[2];
    expect(q.cards!.filter((k) => k.endsWith('s'))).toHaveLength(1);
  });
});

describe('Die Ergebnisleiste reicht für jede Erklärung (FAHRPLAN 5.2)', () => {
  it('bekommt auch die längste Erklärung samt Hinweis zur gewählten Option unter', () => {
    /* Die Leiste hat eine feste Höhe (sonst verschöbe sich beim Antworten die
       Frage). 271 Zeichen brauchen darin 172 von 197 Pixeln; ab etwa 330 Zeichen
       würde gescrollt. Längere Erklärungen gehören gekürzt oder gesplittet. */
    const GRENZE = 340;
    for (const [name, module] of [['deutsch', ALL_MODULES], ['englisch', EN_BUNDLE.modules]] as const) {
      for (const m of module) {
        for (const l of m.lessons) {
          l.quiz.forEach((q, i) => {
            const hinweis = Math.max(0, ...(q.optionFeedback ?? []).map((t) => t.length));
            expect(q.explanation.length + hinweis, `${name} ${l.id}:${i}`).toBeLessThanOrEqual(GRENZE);
          });
        }
      }
    }
  });
});
