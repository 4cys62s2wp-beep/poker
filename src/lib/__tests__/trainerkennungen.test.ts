/* Jede Trainer-Kennung muss das Laden überleben.
   =============================================

   `sanitizeAppData` prüft beim Lesen aus dem Gerätespeicher jede Kennung
   gegen ein Muster und wirft weg, was nicht passt. Das ist richtig so — ein
   beschädigter Speicher darf die App nicht verbiegen —, aber es ist eine
   stille Prüfung: Wer eine Kennung wählt, die nicht passt, sieht seine Zahlen
   im Bildschirm, findet sie im Speicher und wundert sich nach dem Neuladen.

   Genau das ist passiert: Der Drill hieß zuerst `potodds-drill`, und der
   Bindestrich fiel durch das Muster. Dieser Test ist das Netz darunter. */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { sanitizeAppData } from '../../state/AppState';
import { TRAINER } from '../trainerliste';

/** Die Kennung des Pot-Odds-Drills, gelesen aus seinem Bildschirm.
 *
 *  Nicht abgeschrieben, sondern aus der Quelle geholt: Eine zweite Kopie
 *  wäre genau die Sorte Zahl, die auseinanderläuft. */
function drillKennung(): string {
  const quelle = readFileSync('src/pages/trainers/PotOddsDrill.tsx', 'utf8');
  const treffer = quelle.match(/const DRILL_KENNUNG = '([^']+)'/);
  expect(treffer, 'DRILL_KENNUNG steht nicht mehr da, wo der Test sie sucht').not.toBeNull();
  return treffer![1];
}

describe('Trainer-Kennungen', () => {
  const kennungen = [...TRAINER.map((t) => t.id as string), drillKennung()];

  it('kennt jede Übung, die Zahlen führt', () => {
    /* Sieben aus der Liste plus der Drill, der nicht darin steht, weil er
       einen eigenen Weg hat. */
    expect(kennungen.length).toBeGreaterThanOrEqual(8);
    expect(new Set(kennungen).size).toBe(kennungen.length);
  });

  it('überlebt mit jeder Kennung das Laden aus dem Gerätespeicher', () => {
    for (const id of kennungen) {
      const gespeichert = {
        trainers: { [id]: { attempts: 7, correct: 5, streak: 2, bestStreak: 4 } },
      };
      const gelesen = sanitizeAppData(gespeichert);
      expect(
        gelesen.trainers[id],
        `Die Kennung „${id}" überlebt das Laden nicht. sanitizeAppData wirft sie weg, `
        + 'und der Fortschritt dieser Übung ist nach dem Neuladen verschwunden — ohne '
        + 'Fehlermeldung. Entweder die Kennung an das Muster anpassen oder das Muster '
        + 'erweitern; stillschweigend verlieren ist keine Möglichkeit.',
      ).toEqual({ attempts: 7, correct: 5, streak: 2, bestStreak: 4 });
    }
  });

  it('wirft weiterhin weg, was offensichtlich kaputt ist', () => {
    /* Die Gegenprobe: Der Schutz soll bleiben, nur nicht die eigenen
       Kennungen treffen. */
    const gelesen = sanitizeAppData({
      trainers: { '../../boese': { attempts: 1 }, '': { attempts: 1 } },
    });
    expect(Object.keys(gelesen.trainers)).toEqual([]);
  });
});
