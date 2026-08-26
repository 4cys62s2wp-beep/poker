/* Die Datenschnittstelle: Was das Konvertierungsskript schreibt, muss die App
   annehmen – und alles andere muss sie LAUT ablehnen.

   Geprüft wird gegen die ECHTEN Dateien aus public/pokermath/. Ein Test mit
   selbstgebauten Daten würde nur prüfen, dass die Prüfung zu sich selbst passt. */

import { readFileSync, existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SchemaFehler, pruefeB1, pruefeB2, pruefeB3 } from '../pokermath/laden';
import { ERWARTETE_VERTRAG_VERSION } from '../pokermath/typen';

function lade(name: string): unknown {
  const pfad = `public/pokermath/${name}.json`;
  if (!existsSync(pfad)) {
    throw new Error(`${pfad} fehlt – erst "npm run daten" ausführen`);
  }
  return JSON.parse(readFileSync(pfad, 'utf8'));
}

const B1 = lade('b1_outs');
const B2 = lade('b2_potodds');
const B3 = lade('b3_kombinatorik');

const kopie = <T>(v: T): T => structuredClone(v);

describe('Die ausgelieferten Dateien werden angenommen', () => {
  it('B1', () => {
    const d = pruefeB1(B1);
    expect(d.outs.length).toBeGreaterThan(10);
    expect(d.zugbilder.length).toBeGreaterThan(0);
    expect(d.gegenbeispiele.length).toBeGreaterThan(0);
    expect(d.befunde.length).toBeGreaterThan(0);
  });
  it('B2', () => expect(pruefeB2(B2).einsatzgroessen.length).toBeGreaterThan(0));
  it('B3', () => expect(pruefeB3(B3).gesamt.zweikartenblaetter).toBeGreaterThan(0));
});

describe('Der Herkunftsblock ist vollständig – er speist „Warum diese Zahl?"', () => {
  it.each([
    ['b1_outs', B1, pruefeB1],
    ['b2_potodds', B2, pruefeB2],
    ['b3_kombinatorik', B3, pruefeB3],
  ] as const)('%s trägt Methode, Annahmen und Kartenzahlen', (_n, roh, pruefe) => {
    const h = pruefe(roh as never).herkunft;
    expect(h.methode).toBe('exakt');
    expect(h.annahmen.sicht.de).toContain('Heldensicht');
    expect(h.annahmen.sicht.en).toContain('hero');
    expect(h.annahmen.split_pot.de).toContain('0,5');
    expect(h.annahmen.split_pot.en).toContain('0.5');
    expect(h.annahmen.kartenzahlen.deck).toBe(52);
    /* Die Kartenzahlen müssen zueinander passen: 52 minus eigene Karten minus
       Flop. Das prüft nicht die Datei, sondern die Rechnung dahinter. */
    const k = h.annahmen.kartenzahlen;
    expect(k.unbekannt_nach_flop).toBe(k.deck - k.eigene_karten - 3);
    expect(k.unbekannt_nach_turn).toBe(k.unbekannt_nach_flop - 1);
    expect(h.quelle).toContain('tools/poker-math/output/');
  });

  it('B1 nennt die Bibliothek samt Version', () => {
    const b = pruefeB1(B1).herkunft.bibliothek;
    expect(b.name).not.toBeNull();
    if (b.name === null) throw new Error('unerreichbar');
    expect(b.name.length).toBeGreaterThan(0);
    expect(b.version).toMatch(/^\d+\.\d+/);
  });

  it('B2 und B3 nennen den Grund, warum keine nötig war', () => {
    /* Kein Evaluator nötig – aber ein fehlendes Feld sähe aus wie ein
       Versäumnis. Also steht dort der Grund, und zwar in beiden Sprachen und
       aus den Daten, nicht aus der Oberfläche. Früher B-002. */
    for (const b of [pruefeB2(B2).herkunft.bibliothek, pruefeB3(B3).herkunft.bibliothek]) {
      expect(b.name).toBeNull();
      if (b.name !== null) throw new Error('unerreichbar');
      expect(b.begruendung.de.length).toBeGreaterThan(0);
      expect(b.begruendung.en.length).toBeGreaterThan(0);
    }
  });

  it('jede Datei sagt, über wie viele Fälle gerechnet wurde', () => {
    /* Früher B-003: Die Herkunftsanzeige versprach die Fallzahl, und die
       Daten lieferten sie nicht. Jetzt zählt der Generator mit. */
    for (const d of [pruefeB1(B1), pruefeB2(B2), pruefeB3(B3)]) {
      const f = d.herkunft.faelle_enumeriert;
      expect(f.gesamt).toBeGreaterThan(0);
      expect(f.je_teil.length).toBeGreaterThan(0);
      for (const z of f.je_teil) {
        // Der Name jeder Zählstelle steht in der Herkunftsanzeige.
        expect(z.bezeichnung.de.length).toBeGreaterThan(0);
        expect(z.bezeichnung.en.length).toBeGreaterThan(0);
      }
      const summe = f.je_teil.reduce((a, z) => a + z.anzahl, 0);
      expect(summe).toBe(f.gesamt);
    }
  });

  it('die Aufschlüsselung der Fälle ergibt die Gesamtzahl', () => {
    /* Zwei Zahlen, die dasselbe beschreiben, müssen zusammenpassen. Täten
       sie es nicht, wäre eine von beiden erfunden – und man sähe es keiner
       von beiden an. */
    for (const h of [pruefeB1(B1), pruefeB2(B2), pruefeB3(B3)].map((d) => d.herkunft)) {
      const summe = h.faelle_enumeriert.je_teil.reduce((a, z) => a + z.anzahl, 0);
      expect(summe).toBe(h.faelle_enumeriert.gesamt);
    }
  });

  it('B1 trägt seine besonderen Annahmen mit, etwa die sauberen Outs', () => {
    const b = pruefeB1(B1).herkunft.annahmen.besonderheiten;
    expect(b.length).toBeGreaterThan(0);
    expect(b.map((e) => e.schluessel)).toContain('saubere_outs');
  });
});

describe('Fehler scheitern LAUT, nicht still', () => {
  it('eine falsche Vertragsversion wirft mit Hinweis, was zu tun ist', () => {
    const d = kopie(B1) as Record<string, unknown>;
    d.vertrag_version = ERWARTETE_VERTRAG_VERSION + 1;
    expect(() => pruefeB1(d)).toThrow(SchemaFehler);
    expect(() => pruefeB1(d)).toThrow(/npm run daten/);
  });

  it('der geworfene Fehler nennt den Pfad, nicht nur „ungültig"', () => {
    const d = kopie(B1) as { outs: Record<string, unknown>[] };
    delete d.outs[7].turn;
    try {
      pruefeB1(d);
      expect.unreachable('hätte werfen müssen');
    } catch (f) {
      expect(f).toBeInstanceOf(SchemaFehler);
      expect((f as SchemaFehler).pfad).toBe('b1_outs.outs[7].turn');
    }
  });

  it('ein fehlender Herkunftsblock wirft', () => {
    const d = kopie(B1) as Record<string, unknown>;
    delete d.herkunft;
    expect(() => pruefeB1(d)).toThrow(/herkunft/);
  });

  it('eine fehlende Annahme wirft', () => {
    const d = kopie(B1) as { herkunft: { annahmen: Record<string, unknown> } };
    delete d.herkunft.annahmen.split_pot;
    expect(() => pruefeB1(d)).toThrow(/annahmen\.split_pot/);
  });

  it('eine Datei im falschen Block wirft', () => {
    expect(() => pruefeB1(B2)).toThrow(SchemaFehler);
    expect(() => pruefeB2(B1)).toThrow(SchemaFehler);
  });

  it.each([NaN, Infinity, -Infinity, null, '0.5'])('%s als Wahrscheinlichkeit wirft', (wert) => {
    const d = kopie(B1) as { outs: Record<string, unknown>[] };
    d.outs[3].turn = wert;
    expect(() => pruefeB1(d)).toThrow(SchemaFehler);
  });
});

describe('Innere Widersprüche werden erkannt – nicht nur Typen', () => {
  it('zwei Straßen dürfen nie schlechter sein als eine', () => {
    const d = kopie(B1) as { outs: Record<string, number>[] };
    d.outs[5].turn_oder_river = d.outs[5].turn / 2;
    expect(() => pruefeB1(d)).toThrow(/kleiner als eine einzelne Straße/);
  });

  it('die falsche Outs-Zählung kann nie kleiner sein als die richtige', () => {
    const d = kopie(B1) as { zugbilder: Record<string, number>[] };
    d.zugbilder[0].outs_falsch_gezaehlt = 1;
    expect(() => pruefeB1(d)).toThrow(/unmöglich/);
  });

  it('eine nötige Equity über 50 % wirft', () => {
    /* Mathematisch unmöglich: Der Gegner legt denselben Betrag hinein. */
    const d = kopie(B2) as { einsatzgroessen: Record<string, number>[] };
    d.einsatzgroessen[0].noetige_equity = 0.6;
    expect(() => pruefeB2(d)).toThrow(SchemaFehler);
  });

  it('eine Blocker-Zeile, die nicht aufgeht, wirft mit der Rechnung im Text', () => {
    const d = kopie(B3) as { beispiel: { je_starthand: Record<string, number>[] } };
    d.beispiel.je_starthand[0].weggeblockt += 1;
    expect(() => pruefeB3(d)).toThrow(/geht nicht auf/);
  });

  it('vertauschter bester und schlimmster Blockerfall wirft', () => {
    const d = kopie(B3) as { blocker: { Paar: Record<string, number>[] } };
    const z = d.blocker.Paar[0];
    [z.schlimmstenfalls, z.bestenfalls] = [z.bestenfalls + 1, z.schlimmstenfalls];
    expect(() => pruefeB3(d)).toThrow(/Reihenfolge/);
  });
});
