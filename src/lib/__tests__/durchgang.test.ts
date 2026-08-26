/* Ein vollständiger Durchgang: Koffer → Uhr → Beenden.
   ===================================================

   Die Rechenwege der Live-Session sind einzeln geprüft. Was dabei nicht
   auffällt: ob jemand tatsächlich durchkommt. Ein Eingabefeld, das seinen
   Wert nicht weitergibt; ein Startknopf, der gesperrt bleibt; ein Übergang in
   den Vollbildmodus, der den Zustand verliert — jeder einzelne Rechenweg
   bliebe dabei grün.

   `npm run durchgang` klickt den Weg deshalb in einem echten Browser durch
   und schreibt jeden Schritt mit seinem beobachteten Ergebnis nach
   `docs/durchgang.json`. Dieser Test liest das Protokoll und lässt weder
   einen Fehlschlag noch ein stillschweigendes Weglassen durch. */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

interface Schritt {
  name: string;
  ergebnis: Record<string, unknown> | null;
  uebersprungen: boolean;
  fehler?: string;
}

interface Durchgang {
  geprueft_am: string;
  breite: number;
  seitenfehler: string[];
  abgebrochen_bei: string | null;
  schritte: Schritt[];
}

const D: Durchgang = JSON.parse(readFileSync('docs/durchgang.json', 'utf8'));

/** Das Ergebnis eines Schritts, oder ein sprechender Fehlschlag. */
function schritt(name: string): Record<string, unknown> {
  const s = D.schritte.find((x) => x.name === name);
  expect(s, `Schritt „${name}" fehlt im Protokoll — `
    + '`npm run durchgang` nach einer Änderung erneut ausführen.').toBeDefined();
  expect(s!.fehler, `Schritt „${name}" ist fehlgeschlagen`).toBeUndefined();
  expect(s!.uebersprungen, `Schritt „${name}" wurde übersprungen`).toBe(false);
  return s!.ergebnis as Record<string, unknown>;
}

describe('Der Durchgang kommt überhaupt durch', () => {
  it('bricht nirgendwo ab', () => {
    expect(D.abgebrochen_bei).toBeNull();
  });

  it('läuft ohne einen einzigen Fehler im Browser', () => {
    expect(D.seitenfehler).toEqual([]);
  });

  it('geht jeden Schritt wirklich, statt welche zu überspringen', () => {
    expect(D.schritte.length).toBeGreaterThanOrEqual(12);
    for (const s of D.schritte) {
      expect(s.uebersprungen, s.name).toBe(false);
      expect(s.ergebnis, s.name).not.toBeNull();
    }
  });

  it('misst bei der Breite, für die die App gebaut ist', () => {
    expect(D.breite).toBeLessThanOrEqual(430);
  });
});

describe('Einrichten', () => {
  it('gibt den Start erst frei, wenn er etwas zu starten hat', () => {
    /* Ein Knopf, der ins Leere führt, ist schlimmer als ein gesperrter: Er
       verspricht etwas. Vorher steht auf ihm, was fehlt. */
    const vorher = schritt('Einrichten öffnen');
    expect(vorher.startknopf_gesperrt).toBe(true);
    expect(String(vorher.startknopf_text)).toMatch(/eintragen/i);

    const nachher = schritt('Start ist jetzt freigegeben');
    expect(nachher.gesperrt).toBe(false);
  });

  it('zeigt das Ergebnis, bevor irgendetwas beginnt', () => {
    /* Kein Assistent mit Schritten, keine Wartezeit: Der Plan steht da,
       während man noch tippt. */
    const e = schritt('Ergebnis erscheint, bevor irgendetwas beginnt');
    expect(Number(String(e.startchips).replace(/\D/g, ''))).toBeGreaterThan(0);
    expect(e.blindstufen as number).toBeGreaterThanOrEqual(2);
    expect(String(e.erste_stufe)).toMatch(/^\d+ \/ \d+$/);
    expect(String(e.letzte_stufe)).toMatch(/^\d+ \/ \d+$/);
  });

  it('sagt in einem Satz, ob der Abend ein Finale trägt', () => {
    const e = schritt('Ergebnis erscheint, bevor irgendetwas beginnt');
    expect(String(e.finale_satz).length).toBeGreaterThan(20);
    expect(String(e.finale_satz)).toMatch(/Big Blinds|Stunden/);
  });

  it('lässt die Blinds steigen statt springen', () => {
    const e = schritt('Ergebnis erscheint, bevor irgendetwas beginnt');
    const bb = (s: string) => Number(s.split('/')[1].trim());
    const erste = bb(String(e.erste_stufe));
    const letzte = bb(String(e.letzte_stufe));
    const stufen = e.blindstufen as number;
    const faktor = (letzte / erste) ** (1 / (stufen - 1));
    expect(faktor).toBeGreaterThan(1);
    expect(faktor, 'Ein Faktor über 1,6 ist eine Verdopplung in Tarnkleidung')
      .toBeLessThanOrEqual(1.6);
  });
});

describe('Der Übergang an den Tisch', () => {
  it('nimmt alles mit, was eingetragen wurde', () => {
    const e = schritt('Abend starten');
    expect(e.gespeichert_spieler).toBe(5);
    expect(e.gespeichert_startchips as number).toBeGreaterThan(0);
    expect(e.gespeichert_stufen as number).toBeGreaterThanOrEqual(2);
    expect(e.laeuft).toBe(true);
  });

  it('landet im Vollbild ohne Navigationsleiste', () => {
    const e = schritt('Abend starten');
    expect(e.adresse).toBe('#/session/live');
    expect(e.navigationsleiste).toBe(false);
  });

  it('zeigt sofort Zeit, Blinds und die kommende Stufe', () => {
    const e = schritt('Abend starten');
    expect(String(e.zeit)).toMatch(/^\d+:\d{2}$/);
    expect(String(e.blinds)).toMatch(/^\d+ \/ \d+$/);
    expect(String(e.danach)).toMatch(/^\d+ \/ \d+$/);
  });
});

describe('Die Uhr am Tisch', () => {
  it('läuft', () => {
    expect(schritt('Die Uhr läuft wirklich').hat_sich_bewegt).toBe(true);
  });

  it('verliert beim Neuladen keine Sekunde', () => {
    const e = schritt('Neu laden setzt an derselben Stelle fort');
    expect(e.abend_noch_da).toBe(true);
    /* Eine Sekunde Spielraum: Das Neuladen selbst dauert, und die Zeit läuft
       dabei richtigerweise weiter. Mehr wäre ein Fehler in der Rechnung. */
    expect(e.abstand_s as number).toBeLessThanOrEqual(1);
  });

  it('steht in der Pause wirklich still und zeigt das an', () => {
    const e = schritt('Pause hält an');
    expect(e.steht_still).toBe(true);
    expect(e.marke_sichtbar).toBe(true);
  });

  it('springt beim Fortsetzen nicht und läuft danach weiter', () => {
    const e = schritt('Weiter läuft an derselben Stelle an');
    expect(e.kein_sprung).toBe(true);
    expect(e.laeuft_wieder).toBe(true);
  });
});

describe('Beenden', () => {
  it('fragt nach, statt es einfach zu tun', () => {
    /* Ein Fehlgriff auf dem Tischgerät darf nicht den Abend beenden. */
    const e = schritt('Beenden fragt nach und tut es dann');
    expect(e.gefragt).toBe(true);
    expect(String(e.frage)).toMatch(/\?$/);
  });

  it('beendet danach wirklich und führt zurück', () => {
    const e = schritt('Beenden fragt nach und tut es dann');
    expect(e.abend_beendet).toBe(true);
    expect(e.adresse_danach).toBe('#/session');
  });
});
