/* Der Rangstand.
   =============
   Geprüft wird die Auskunft, die drei Bildschirme brauchen — und die
   Ränder, an denen eine Fortschrittsanzeige sonst hässlich wird. */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { rangstand } from '../rang/stand';
import {
  LEKTION_XP_GRUND, LEKTION_XP_HOECHSTENS, LEKTION_XP_QUIZ, lektionsstand,
} from '../rang/lektionen';
import { LEVEL_TITLES, xpThreshold } from '../../state/AppState';

describe('Der Rangstand', () => {
  it('fängt bei null XP am Anfang von Level 1 an', () => {
    const r = rangstand(0);
    expect(r.level).toBe(1);
    expect(r.anteil).toBe(0);
    expect(r.titel).toBe(LEVEL_TITLES[0]);
    expect(r.naechsterTitel).toBe(LEVEL_TITLES[1]);
  });

  it('steht genau auf der Schwelle am Anfang des neuen Levels', () => {
    /* Der häufigste Fehler bei so einer Rechnung: Auf der Schwelle zeigt
       sie das alte Level voll statt das neue leer. */
    const schwelle = xpThreshold(3);
    const r = rangstand(schwelle);
    expect(r.level).toBe(3);
    expect(r.anteil).toBe(0);
    expect(r.von).toBe(schwelle);
  });

  it('ist kurz vor der Schwelle fast voll, aber nicht voll', () => {
    const r = rangstand(xpThreshold(3) - 1);
    expect(r.level).toBe(2);
    expect(r.anteil).toBeGreaterThan(0.9);
    expect(r.anteil).toBeLessThan(1);
    expect(r.fehlt).toBe(1);
  });

  it('nennt genau die fehlenden XP bis zum nächsten Rang', () => {
    const r = rangstand(200);
    expect(r.fehlt).toBe(r.bis - 200);
  });

  it('lässt die Level weiterlaufen, wenn die Rangnamen ausgehen', () => {
    /* Gefunden beim Schreiben dieses Tests: `levelForXp` kennt keine
       Obergrenze, die Titelliste schon. Ein Spielstand soll nicht aufhören
       zu wachsen, nur weil die Namen ausgehen — der Ring füllt sich also
       weiter, und nur der Rangname bleibt stehen. Wichtig ist, dass ein
       Bildschirm das erkennen kann, statt „nächster Rang: undefined" zu
       schreiben. */
    const weitDrueber = xpThreshold(LEVEL_TITLES.length) + 10_000;
    const r = rangstand(weitDrueber);
    expect(r.hoechsterRang).toBe(true);
    expect(r.level).toBeGreaterThan(LEVEL_TITLES.length);
    expect(r.titel).toBe(LEVEL_TITLES[LEVEL_TITLES.length - 1]);
    expect(r.naechsterTitel).toBeNull();
    /* Der Fortschritt zum nächsten Level bleibt trotzdem eine Zahl. */
    expect(r.fehlt).toBeGreaterThan(0);
    expect(r.anteil).toBeGreaterThanOrEqual(0);
    expect(r.anteil).toBeLessThanOrEqual(1);
  });

  it('meldet den letzten Rang genau ab dem Level, das ihn trägt', () => {
    expect(rangstand(xpThreshold(LEVEL_TITLES.length)).hoechsterRang).toBe(true);
    expect(rangstand(xpThreshold(LEVEL_TITLES.length) - 1).hoechsterRang).toBe(false);
  });

  it('hält den Anteil auch bei beschädigten Daten zwischen null und eins', () => {
    for (const kaputt of [-5000, Number.NaN, Number.POSITIVE_INFINITY]) {
      const r = rangstand(kaputt);
      expect(r.anteil).toBeGreaterThanOrEqual(0);
      expect(r.anteil).toBeLessThanOrEqual(1);
      expect(r.level).toBeGreaterThanOrEqual(1);
    }
  });

  it('wächst über alle Ränge hinweg ohne Sprung zurück', () => {
    /* Ein Level, das bei mehr XP kleiner wird, wäre der Fehler, den man
       erst bemerkt, wenn ein Nutzer ihn meldet. */
    let vorher = 0;
    for (let xp = 0; xp < xpThreshold(LEVEL_TITLES.length) + 500; xp += 37) {
      const r = rangstand(xp);
      expect(r.level).toBeGreaterThanOrEqual(vorher);
      vorher = r.level;
    }
  });
});

describe('Der Stand in einem Modul', () => {
  const lektionen = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];

  it('zählt, was erledigt ist, und zeigt auf die nächste offene', () => {
    const st = lektionsstand(lektionen, { a: {} });
    expect(st.erledigt).toBe(1);
    expect(st.gesamt).toBe(3);
    expect(st.naechsteId).toBe('b');
    expect(st.fertig).toBe(false);
  });

  it('überspringt eine Lücke und nimmt die erste offene, nicht die letzte', () => {
    /* Wer Lektion 1 und 3 gemacht hat, soll bei 2 weitermachen — der Kurs
       baut aufeinander auf. */
    const st = lektionsstand(lektionen, { a: {}, c: {} });
    expect(st.naechsteId).toBe('b');
  });

  it('meldet ein fertiges Modul ohne nächste Lektion', () => {
    const st = lektionsstand(lektionen, { a: {}, b: {}, c: {} });
    expect(st.fertig).toBe(true);
    expect(st.anteil).toBe(1);
    expect(st.naechsteId).toBeNull();
  });

  it('behandelt ein Modul ohne Lektionen als fertig, nicht als leer', () => {
    /* Sonst zeigte der Ring dort für immer null an — und ein Ring auf null
       sieht aus wie ein Fehler, nicht wie ein Sonderfall. */
    const st = lektionsstand([], {});
    expect(st.anteil).toBe(1);
    expect(st.fertig).toBe(true);
  });

  it('hält die angezeigte XP-Höchstzahl mit der Vergabe zusammen', () => {
    /* Der Bildschirm zeigt „bis 100 XP". Vergeben werden sie in
       `completeLesson`. Zwei Stellen, eine Zahl — dieser Test ist das Band
       dazwischen: Wer die Vergabe ändert und die Anzeige vergisst, sieht es
       hier. */
    const quelle = readFileSync('src/state/AppState.tsx', 'utf8');
    const zeile = quelle.match(/d\.xp \+= (\d+) \+ Math\.round\(\((\d+) \*/);
    expect(zeile, 'Die XP-Vergabe in completeLesson sieht anders aus als erwartet').not.toBeNull();
    expect(Number(zeile![1])).toBe(LEKTION_XP_GRUND);
    expect(Number(zeile![2])).toBe(LEKTION_XP_QUIZ);
    expect(LEKTION_XP_HOECHSTENS).toBe(LEKTION_XP_GRUND + LEKTION_XP_QUIZ);
  });
});
