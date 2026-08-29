/* Die Hand des Tages und was von ihr bleibt.
   =========================================

   Geprüft wird das, was die Auswahl leisten muss: Sie ist den ganzen Tag
   dieselbe, sie ist morgen eine andere, und sie erfindet keine Poker-Zahl —
   sie zieht aus demselben Generator wie der Drill. */

import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { handDesTages, startwert, stromAus, tagesschluessel } from '../heute/hand';
import {
  antwortVon, ergaenze, serie, woche, type TagesAntwort,
} from '../heute/stand';
import { baueAufgabe, loese } from '../potodds/aufgabe';
import { pruefeB1, pruefeB2 } from '../pokermath/laden';

/* Aus der Datei, nicht über den Lader: Der Lader holt per `fetch` aus dem
   Browser. Geprüft wird hier die Auswahl, nicht der Weg zur Datei. */
function lade(name: string): unknown {
  const pfad = `public/pokermath/${name}.json`;
  if (!existsSync(pfad)) throw new Error(`${pfad} fehlt – erst "npm run daten" ausführen`);
  return JSON.parse(readFileSync(pfad, 'utf8'));
}

const b1 = pruefeB1(lade('b1_outs'));
const b2 = pruefeB2(lade('b2_potodds'));

describe('Der Tagesschlüssel', () => {
  it('nimmt den lokalen Tag, nicht den in London', () => {
    /* Der Grund: Wer um 23 Uhr antwortet, soll um 1 Uhr nicht dieselbe Hand
       noch einmal gestellt bekommen, weil UTC schon einen Tag weiter ist.
       Geprüft an einem Zeitpunkt, der in UTC auf den Folgetag fällt, sofern
       die Zeitzone östlich von Greenwich liegt — und an einem, der in UTC
       auf den Vortag fällt. Beide müssen den Tag der lokalen Uhr nennen. */
    const spaet = new Date(2026, 2, 14, 23, 30);
    const frueh = new Date(2026, 2, 14, 0, 30);
    expect(tagesschluessel(spaet)).toBe('2026-03-14');
    expect(tagesschluessel(frueh)).toBe('2026-03-14');
  });

  it('füllt Monat und Tag auf zwei Stellen auf', () => {
    expect(tagesschluessel(new Date(2026, 0, 5, 12))).toBe('2026-01-05');
  });
});

describe('Der Startwert', () => {
  it('macht aus benachbarten Tagen weit entfernte Werte', () => {
    /* Eine Buchstabensumme läge bei aufeinanderfolgenden Tagen nur um eins
       auseinander, und der Generator zöge dreimal aus derselben Gegend der
       Tabelle. Geprüft wird deshalb nicht „ungleich", sondern „nicht
       benachbart". */
    const a = startwert('2026-03-14');
    const b = startwert('2026-03-15');
    expect(Math.abs(a - b)).toBeGreaterThan(1000);
  });

  it('liefert für dieselbe Eingabe immer denselben Wert', () => {
    expect(startwert('2026-03-14')).toBe(startwert('2026-03-14'));
  });
});

describe('Der Zufallsstrom', () => {
  it('wiederholt sich bei gleichem Startwert Zug für Zug', () => {
    const a = stromAus(12345);
    const b = stromAus(12345);
    const zieheZehn = (f: () => number) => Array.from({ length: 10 }, f);
    expect(zieheZehn(a)).toEqual(zieheZehn(b));
  });

  it('bleibt im Bereich von null bis eins', () => {
    const f = stromAus(7);
    for (let i = 0; i < 500; i += 1) {
      const x = f();
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(1);
    }
  });
});

describe('Die Hand des Tages', () => {
  it('ist am selben Tag dieselbe, auch zu anderer Uhrzeit', () => {
    const morgens = handDesTages(b1, b2, new Date(2026, 2, 14, 7, 5));
    const abends = handDesTages(b1, b2, new Date(2026, 2, 14, 22, 40));
    expect(abends.zustand).toEqual(morgens.zustand);
    expect(abends.aufgabe.hand).toEqual(morgens.aufgabe.hand);
  });

  it('ist am nächsten Tag eine andere', () => {
    /* Nicht über einen einzelnen Tagespaarvergleich — der könnte zufällig
       gleich ausfallen. Über dreißig Tage in Folge: Sie dürfen nicht alle
       auf wenige Aufgaben zusammenfallen. */
    const zustaende = new Set<string>();
    for (let t = 1; t <= 30; t += 1) {
      zustaende.add(JSON.stringify(handDesTages(b1, b2, new Date(2026, 2, t)).zustand));
    }
    expect(zustaende.size).toBeGreaterThanOrEqual(25);
  });

  it('erfindet keine Zahl, sondern zieht aus dem Generator des Drills', () => {
    /* Der Beweis, dass hier keine zweite Rechenquelle entstanden ist: Aus
       dem gezogenen Zustand allein muss sich dieselbe Aufgabe und dieselbe
       Auflösung ergeben. */
    const heute = handDesTages(b1, b2, new Date(2026, 5, 1));
    const nachgebaut = baueAufgabe(b1, b2, heute.zustand);
    expect(nachgebaut).toEqual(heute.aufgabe);
    expect(loese(nachgebaut)).toEqual(heute.aufloesung);
  });

  it('stellt über ein Jahr beide Antworten oft genug', () => {
    /* Eine Frage, deren Antwort dreihundertmal „lohnt sich" lautet, ist
       keine Frage. Geprüft über 365 aufeinanderfolgende Tage: Keine Seite
       darf unter einem Fünftel liegen. */
    let lohnt = 0;
    for (let t = 0; t < 365; t += 1) {
      const d = new Date(2026, 0, 1 + t);
      if (handDesTages(b1, b2, d).aufloesung.lohnt) lohnt += 1;
    }
    expect(lohnt).toBeGreaterThan(365 / 5);
    expect(365 - lohnt).toBeGreaterThan(365 / 5);
  });
});

describe('Was von der Hand des Tages bleibt', () => {
  const a = (tag: string, richtig = true): TagesAntwort => ({
    tag, gewaehlt: richtig ? 'lohnt' : 'lohnt-nicht', richtig,
  });

  it('nimmt eine Antwort auf und findet sie wieder', () => {
    const liste = ergaenze([], a('2026-03-14'));
    expect(antwortVon(liste, '2026-03-14')?.richtig).toBe(true);
  });

  it('lässt einen zweiten Versuch am selben Tag nicht zu', () => {
    /* Sonst könnte jemand die Auflösung ansehen und danach richtig liegen —
       die Woche auf der Startseite wäre dann keine Auskunft mehr. */
    const erst = ergaenze([], a('2026-03-14', false));
    const dann = ergaenze(erst, a('2026-03-14', true));
    expect(dann).toEqual(erst);
    expect(antwortVon(dann, '2026-03-14')?.richtig).toBe(false);
  });

  it('zeigt sieben Tage, den ältesten zuerst und heute rechts', () => {
    const w = woche([a('2026-03-14')], '2026-03-14');
    expect(w).toHaveLength(7);
    expect(w[0].tag).toBe('2026-03-08');
    expect(w[6].tag).toBe('2026-03-14');
    expect(w[6].istHeute).toBe(true);
    expect(w[6].antwort?.richtig).toBe(true);
    expect(w[0].antwort).toBeNull();
  });

  it('kommt über einen Monatswechsel hinweg', () => {
    const w = woche([], '2026-03-02');
    expect(w[0].tag).toBe('2026-02-24');
    expect(w[6].tag).toBe('2026-03-02');
  });

  it('kommt über den 29. Februar eines Schaltjahres hinweg', () => {
    const w = woche([], '2028-03-01');
    expect(w.map((x) => x.tag)).toContain('2028-02-29');
  });

  it('zählt eine Serie bis heute', () => {
    const liste = ['2026-03-12', '2026-03-13', '2026-03-14'].map((t) => a(t));
    expect(serie(liste, '2026-03-14')).toBe(3);
  });

  it('bricht die Serie nicht, solange heute noch offen ist', () => {
    /* Der Tag ist noch nicht vorbei. Wer morgens auf die Startseite schaut,
       soll nicht lesen, dass seine Serie schon gerissen ist. */
    const liste = ['2026-03-12', '2026-03-13'].map((t) => a(t));
    expect(serie(liste, '2026-03-14')).toBe(2);
  });

  it('bricht die Serie, wenn ein Tag dazwischen fehlt', () => {
    const liste = ['2026-03-11', '2026-03-13', '2026-03-14'].map((t) => a(t));
    expect(serie(liste, '2026-03-14')).toBe(2);
  });

  it('zählt eine falsche Antwort für die Serie mit', () => {
    /* Die Serie misst das Auftauchen, nicht das Können. Wer eine Woche lang
       jeden Tag danebenliegt, hat trotzdem eine Woche lang geübt — und
       genau das ist es, was die Serie belohnen soll. */
    const liste = ['2026-03-13', '2026-03-14'].map((t) => a(t, false));
    expect(serie(liste, '2026-03-14')).toBe(2);
  });
});
