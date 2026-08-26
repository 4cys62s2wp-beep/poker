/* Der Pot-Odds-Drill.
   ==================

   Zwei Dinge werden hier geprüft, die man einem Bildschirm nicht ansieht:

   1. Ob die Aufgaben zu den gerechneten Daten passen — geprüft gegen die
      ECHTEN Dateien aus `public/pokermath/`, nicht gegen selbstgebaute.
   2. Ob in der Oberfläche wirklich keine Zahl steht. Diese Regel ist leicht
      zu verletzen und unmöglich beim Lesen zuverlässig zu bemerken; ein
      `padding: 12` rutscht in jedem zweiten Commit durch. Deshalb liest ein
      Test den Quelltext.

   Außerdem: Die Sätze in den Kommentaren des Generators machen Aussagen über
   die Daten („in genau der Hälfte der Fälle"). Nach der Regel K2 muss jede
   solche Aussage von einem Testfall gedeckt sein, sonst ist sie formuliert
   statt hergeleitet. Der Abschnitt „Die Aussagen aus dem Quelltext" tut das. */

import { readFileSync, existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { pruefeB1, pruefeB2 } from '../pokermath/laden';
import { bruchTeile } from '../pokermath/bruch';
import {
  alsBB,
  alsProzent,
  alsProzentpunkte,
  baueAufgabe,
  loese,
  potFaktorSpanne,
  ziehZustand,
  GRENZFALL_PP,
  type DrillZustand,
} from '../potodds/aufgabe';
import { dekodiere, fingerabdruck, kodiere } from '../potodds/adresse';

function lade(name: string): unknown {
  const pfad = `public/pokermath/${name}.json`;
  if (!existsSync(pfad)) throw new Error(`${pfad} fehlt – erst "npm run daten" ausführen`);
  return JSON.parse(readFileSync(pfad, 'utf8'));
}

const B1 = pruefeB1(lade('b1_outs'));
const B2 = pruefeB2(lade('b2_potodds'));

/** Alle Zugbilder × alle Einsatzgrößen, mit dem kleinsten passenden Topf. */
function alleZustaende(): DrillZustand[] {
  const alle: DrillZustand[] = [];
  B1.zugbilder.forEach((_z, zugbild) => {
    B2.einsatzgroessen.forEach((e, einsatz) => {
      const { nenner } = bruchTeile(e.einsatz_als_bruch);
      alle.push({ zugbild, einsatz, potFaktor: potFaktorSpanne(nenner).min });
    });
  });
  return alle;
}

/** Ein Zufallsgenerator, der sich wiederholen lässt. Ein Test mit
 *  `Math.random` schlägt irgendwann fehl und niemand weiß, womit. */
function festerZufall(saat: number): () => number {
  let s = saat >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// ---------------------------------------------------------------------------

describe('Der Einsatz als Bruch', () => {
  it('zerlegt Brüche und ganze Zahlen', () => {
    expect(bruchTeile('3/4')).toEqual({ zaehler: 3, nenner: 4 });
    expect(bruchTeile('2')).toEqual({ zaehler: 2, nenner: 1 });
  });

  it.each(['0/4', '3/0', 'x/2', '1/2/3', '', '1.5'])('lehnt %s ab', (schlecht) => {
    expect(() => bruchTeile(schlecht)).toThrow();
  });

  it('deckt sich bei jeder Einsatzgröße mit der Dezimalzahl', () => {
    for (const e of B2.einsatzgroessen) {
      const { zaehler, nenner } = bruchTeile(e.einsatz_als_bruch);
      expect(zaehler / nenner).toBeCloseTo(e.einsatz_als_potanteil, 12);
    }
  });
});

describe('Die Situation geht auf', () => {
  it('setzt Topf und Einsatz immer in ganzen Big Blinds an', () => {
    for (const z of alleZustaende()) {
      const a = baueAufgabe(B1, B2, z);
      expect(Number.isInteger(a.pot)).toBe(true);
      expect(Number.isInteger(a.einsatzBetrag)).toBe(true);
      expect(a.einsatzBetrag).toBeGreaterThan(0);
    }
  });

  it('trifft mit dem Einsatz genau den Anteil aus B2', () => {
    for (const z of alleZustaende()) {
      const a = baueAufgabe(B1, B2, z);
      expect(a.einsatzBetrag / a.pot).toBeCloseTo(a.einsatz.einsatz_als_potanteil, 12);
    }
  });

  it('legt in den Endtopf beide Einsätze', () => {
    for (const z of alleZustaende()) {
      const a = baueAufgabe(B1, B2, z);
      expect(a.endpot).toBe(a.pot + a.einsatzBetrag * 2);
    }
  });

  it('zeigt genau zwei eigene Karten und drei Flopkarten', () => {
    for (const z of alleZustaende()) {
      const a = baueAufgabe(B1, B2, z);
      expect(a.hand).toHaveLength(2);
      expect(a.flop).toHaveLength(3);
    }
  });

  it('nimmt die Outs-Zeile, die zum Zugbild gehört', () => {
    for (const z of alleZustaende()) {
      const a = baueAufgabe(B1, B2, z);
      expect(a.outsZeile.outs).toBe(a.zugbild.outs);
    }
  });
});

describe('Ein Zustand, der nicht zu den Daten passt, scheitert laut', () => {
  const gut = alleZustaende()[0];
  it('unbekanntes Zugbild', () => {
    expect(() => baueAufgabe(B1, B2, { ...gut, zugbild: B1.zugbilder.length }))
      .toThrow(/Zugbild/);
  });
  it('unbekannte Einsatzgröße', () => {
    expect(() => baueAufgabe(B1, B2, { ...gut, einsatz: B2.einsatzgroessen.length }))
      .toThrow(/Einsatzgröße/);
  });
  it('Topf außerhalb des Maßstabs', () => {
    expect(() => baueAufgabe(B1, B2, { ...gut, potFaktor: 0 })).toThrow(/Potfaktor/);
    expect(() => baueAufgabe(B1, B2, { ...gut, potFaktor: 10000 })).toThrow(/Potfaktor/);
  });
  it('gebrochener Potfaktor', () => {
    expect(() => baueAufgabe(B1, B2, { ...gut, potFaktor: 4.5 })).toThrow(/Potfaktor/);
  });
});

describe('Die Auflösung kommt aus den Daten, nicht aus einer Formel hier', () => {
  it('nimmt Equity und Schwelle wörtlich aus B1 und B2', () => {
    for (const z of alleZustaende()) {
      const a = baueAufgabe(B1, B2, z);
      const l = loese(a);
      expect(l.equity).toBe(a.outsZeile.turn_oder_river);
      expect(l.equityTurn).toBe(a.outsZeile.turn);
      expect(l.noetig).toBe(a.einsatz.noetige_equity);
      expect(l.mindestOuts).toBe(a.einsatz.mindest_outs_beide);
    }
  });

  it('urteilt genau dann „lohnt", wenn die Equity die Schwelle erreicht', () => {
    for (const z of alleZustaende()) {
      const l = loese(baueAufgabe(B1, B2, z));
      expect(l.lohnt).toBe(l.equity >= l.noetig);
      expect(l.abstandPp).toBeCloseTo((l.equity - l.noetig) * 100, 10);
    }
  });

  it('nennt knappe Fälle knapp', () => {
    for (const z of alleZustaende()) {
      const l = loese(baueAufgabe(B1, B2, z));
      expect(l.grenzfall).toBe(Math.abs(l.abstandPp) < GRENZFALL_PP);
    }
  });

  it('ist mit den Mindest-Outs aus B2 einig', () => {
    /* Zwei Wege zur selben Aussage: über die Equity und über die Outs-Zahl.
       Weichen sie ab, ist eine der beiden Spalten in B2 falsch. */
    for (const z of alleZustaende()) {
      const a = baueAufgabe(B1, B2, z);
      const l = loese(a);
      if (l.mindestOuts !== null) {
        expect(l.lohnt).toBe(a.zugbild.outs >= l.mindestOuts);
      }
    }
  });
});

describe('Die Aussagen aus dem Quelltext', () => {
  /* Regel K2: Wer im Kommentar über die Daten spricht, muss es prüfen. */
  function verteilung(feld: 'turn' | 'turn_oder_river') {
    let lohnt = 0;
    let gesamt = 0;
    for (const z of alleZustaende()) {
      const a = baueAufgabe(B1, B2, z);
      if (a.outsZeile[feld] >= a.einsatz.noetige_equity) lohnt += 1;
      gesamt += 1;
    }
    return { lohnt, gesamt };
  }

  it('„in der Zwei-Karten-Lesart lohnt der Call in genau der Hälfte der Fälle"', () => {
    const v = verteilung('turn_oder_river');
    expect(v.lohnt * 2).toBe(v.gesamt);
  });

  it('„in der Turn-Lesart in weniger als einem Fünftel"', () => {
    const v = verteilung('turn');
    expect(v.lohnt * 5).toBeLessThan(v.gesamt);
  });
});

describe('Das Ziehen', () => {
  it('liefert nur Zustände, die sich bauen lassen', () => {
    const zufall = festerZufall(20260826);
    for (let i = 0; i < 500; i += 1) {
      expect(() => baueAufgabe(B1, B2, ziehZustand(B1, B2, zufall))).not.toThrow();
    }
  });

  it('wiederholt das zuletzt gezeigte Zugbild nicht', () => {
    const zufall = festerZufall(7);
    let letztes = ziehZustand(B1, B2, zufall).zugbild;
    for (let i = 0; i < 500; i += 1) {
      const naechstes = ziehZustand(B1, B2, zufall, letztes).zugbild;
      expect(naechstes).not.toBe(letztes);
      letztes = naechstes;
    }
  });

  it('erreicht auf Dauer jedes Zugbild und jede Einsatzgröße', () => {
    const zufall = festerZufall(1234);
    const zugbilder = new Set<number>();
    const einsaetze = new Set<number>();
    for (let i = 0; i < 2000; i += 1) {
      const z = ziehZustand(B1, B2, zufall);
      zugbilder.add(z.zugbild);
      einsaetze.add(z.einsatz);
    }
    expect(zugbilder.size).toBe(B1.zugbilder.length);
    expect(einsaetze.size).toBe(B2.einsatzgroessen.length);
  });

  it('ist bei gleicher Saat wiederholbar', () => {
    const a = ziehZustand(B1, B2, festerZufall(42));
    const b = ziehZustand(B1, B2, festerZufall(42));
    expect(a).toEqual(b);
  });
});

describe('Die Anzeige', () => {
  it('schreibt Prozente sprachrichtig mit einer Nachkommastelle', () => {
    /* Das Leerzeichen vor dem Prozentzeichen ist ein geschütztes (U+00A0) –
       Intl setzt es so, und genau deshalb steht hier keine Näherung. */
    expect(alsProzent(0.3497, 'de')).toBe('35,0\u00a0%');
    expect(alsProzent(0.25, 'en')).toBe('25.0%');
  });

  it('schreibt Prozentpunkte immer mit Vorzeichen', () => {
    expect(alsProzentpunkte(9.72, 'de')).toBe('+9,7 pp');
    expect(alsProzentpunkte(-0.86, 'de')).toBe('-0,9 pp');
  });

  it('schreibt Big Blinds ohne Nachkommastellen', () => {
    expect(alsBB(48, 'de')).toBe('48');
  });
});

// ---------------------------------------------------------------------------
// Die Regel des Projekts, am Quelltext geprüft
// ---------------------------------------------------------------------------

/** Entfernt Kommentare und Zeichenketten, damit nur echter Code übrig bleibt.
 *
 *  Ein Zeichen-für-Zeichen-Durchlauf statt eines regulären Ausdrucks: Ein
 *  `//` in einer Zeichenkette oder ein Apostroph in einem Kommentar bringt
 *  jede Regex-Lösung durcheinander, und dann prüft der Test etwas anderes,
 *  als er zu prüfen vorgibt. */
function nurCode(quelle: string): string {
  let aus = '';
  let i = 0;
  while (i < quelle.length) {
    const c = quelle[i];
    const d = quelle[i + 1];
    if (c === '/' && d === '*') {
      i = quelle.indexOf('*/', i + 2);
      i = i < 0 ? quelle.length : i + 2;
    } else if (c === '/' && d === '/') {
      const ende = quelle.indexOf('\n', i);
      i = ende < 0 ? quelle.length : ende;
    } else if (c === '"' || c === "'" || c === '`') {
      i += 1;
      while (i < quelle.length && quelle[i] !== c) {
        i += quelle[i] === '\\' ? 2 : 1;
      }
      i += 1;
    } else {
      aus += c;
      i += 1;
    }
  }
  return aus;
}

describe('Keine Zahl im Quelltext der Oberfläche', () => {
  const DATEI = 'src/pages/trainers/PotOddsDrill.tsx';

  it('erkennt eine eingeschmuggelte Zahl (der Test prüft sich selbst)', () => {
    expect(nurCode('const a = 12; // 34\nconst b = "56";')).toMatch(/12/);
    expect(nurCode('const a = 1; /* 2 */ "3" `4`')).not.toMatch(/[2-4]/);
  });

  it('enthält keinen einzigen Zahlenwert', () => {
    const code = nurCode(readFileSync(DATEI, 'utf8'));
    /* Ziffern in Bezeichnern (`b1`, `B1Outs`, `ladeB2`) sind keine Zahlen.
       Gesucht ist eine Ziffer, vor der kein Bezeichnerzeichen steht. */
    const treffer = code.match(/(?<![A-Za-z0-9_$.])\d[\d._]*/g) ?? [];
    expect(treffer).toEqual([]);
  });
});

describe('Der Service Worker kennt den Datenstand', () => {
  const sw = readFileSync('public/sw.js', 'utf8');

  it('trägt den jüngsten Stand der ausgelieferten Daten', () => {
    const staende = [B1.herkunft.erzeugt_am, B2.herkunft.erzeugt_am].sort();
    const erwartet = staende[staende.length - 1].replace(/[^0-9A-Za-z]/g, '-');
    const gefunden = sw.match(/^const DATEN_STAND = '(.*)';$/m)?.[1];
    /* Nicht Gleichheit, sondern „mindestens so neu": B3 kann jünger sein als
       die beiden hier geladenen Blöcke. Ein älterer Stand hieße dagegen, dass
       `npm run daten` gelaufen ist, ohne den Cache zu erneuern – dann zeigt
       ein installiertes Gerät weiter die alten Zahlen. */
    expect(gefunden).toBeDefined();
    expect(gefunden! >= erwartet).toBe(true);
  });

  it('speichert die Datendateien für den Betrieb ohne Netz mit', () => {
    const liste = sw.match(/^const DATEN_DATEIEN = \[(.*)\];$/m)?.[1] ?? '';
    for (const block of ['b1_outs', 'b2_potodds', 'b3_kombinatorik']) {
      expect(liste).toContain(`./pokermath/${block}.json`);
    }
  });
});

// ---------------------------------------------------------------------------
// „Warum diese Zahl" — die Herkunftsangabe muss stimmen
// ---------------------------------------------------------------------------

/** Löst einen Feldpfad wie `b1_outs.outs[8].turn_oder_river` in den Dateien auf.
 *
 *  Der Sinn: Die App behauptet neben jeder Zahl, wo sie steht. Eine Behauptung,
 *  die niemand prüft, ist eine Zierde. Dieser Test öffnet die Datei und schaut
 *  nach. */
function amPfad(pfad: string): unknown {
  const [datei, ...rest] = pfad.split('.');
  const dateien: Record<string, unknown> = { b1_outs: B1, b2_potodds: B2 };
  let wert = dateien[datei];
  if (wert === undefined) throw new Error(`Unbekannte Datei "${datei}" in "${pfad}"`);
  for (const stueck of rest) {
    const treffer = stueck.match(/^([A-Za-z_]+)(\[(\d+)\])?$/);
    if (!treffer) throw new Error(`Unlesbares Pfadstück "${stueck}" in "${pfad}"`);
    wert = (wert as Record<string, unknown>)[treffer[1]];
    if (treffer[3] !== undefined) wert = (wert as unknown[])[Number(treffer[3])];
    if (wert === undefined) throw new Error(`"${pfad}" führt ins Leere bei "${stueck}"`);
  }
  return wert;
}

describe('Die Herkunftsangabe zeigt auf die Zahl, die angezeigt wird', () => {
  it('prüft sich zuerst selbst', () => {
    expect(amPfad('b1_outs.block')).toBe('b1_outs');
    expect(() => amPfad('b1_outs.gibtsnicht')).toThrow(/ins Leere/);
    expect(() => amPfad('b9.x')).toThrow(/Unbekannte Datei/);
  });

  it('trifft für jede Aufgabe jeden einzelnen Wert', () => {
    for (const z of alleZustaende()) {
      const a = baueAufgabe(B1, B2, z);
      const l = loese(a);
      expect(amPfad(a.pfade.outs)).toBe(a.zugbild.outs);
      expect(amPfad(l.pfade.equity)).toBe(l.equity);
      expect(amPfad(l.pfade.equityTurn)).toBe(l.equityTurn);
      expect(amPfad(l.pfade.noetig)).toBe(l.noetig);
      expect(amPfad(l.pfade.mindestOuts)).toBe(l.mindestOuts);
    }
  });

  it('nennt für jeden Wert die richtige Datei', () => {
    const a = baueAufgabe(B1, B2, alleZustaende()[0]);
    const l = loese(a);
    for (const p of [a.pfade.outs, l.pfade.equity, l.pfade.equityTurn]) {
      expect(p.startsWith('b1_outs.')).toBe(true);
    }
    for (const p of [l.pfade.noetig, l.pfade.mindestOuts]) {
      expect(p.startsWith('b2_potodds.')).toBe(true);
    }
  });
});

describe('Der Herkunftsblock trägt alles, was die Anzeige verspricht', () => {
  it.each([['b1_outs', B1], ['b2_potodds', B2]] as const)('%s', (_name, d) => {
    const h = d.herkunft;
    expect(['exakt', 'monte-carlo']).toContain(h.methode);
    // Jeder anzeigbare Text in beiden Sprachen: Eine englische App, die einen
    // deutschen Satz zeigt, hat den Satz nicht gezeigt.
    for (const paar of [h.zweck, h.annahmen.sicht, h.annahmen.unbekannte_karten,
      h.annahmen.split_pot]) {
      expect(paar.de.length).toBeGreaterThan(0);
      expect(paar.en.length).toBeGreaterThan(0);
      expect(paar.de).not.toBe(paar.en);
    }
    expect(h.annahmen.kartenzahlen.deck).toBeGreaterThan(h.annahmen.kartenzahlen.unbekannt_nach_flop);
    expect(h.annahmen.kartenzahlen.unbekannt_nach_flop)
      .toBeGreaterThan(h.annahmen.kartenzahlen.unbekannt_nach_turn);
    expect(Number.isNaN(new Date(h.erzeugt_am).getTime())).toBe(false);
    expect(h.quelle.length).toBeGreaterThan(0);
  });

  it('nennt die Fallzahl und sagt, woraus sie sich zusammensetzt', () => {
    /* Früher stand hier das Gegenteil: Solange die Angabe fehlte, MUSSTE das
       Feld null sein, damit niemand eine erfundene Zahl für bare Münze nimmt.
       Der Generator zählt jetzt mit, also prüft der Test jetzt, dass die Zahl
       da ist und zu ihrer Aufschlüsselung passt. */
    for (const d of [B1, B2]) {
      const f = d.herkunft.faelle_enumeriert;
      expect(f.gesamt).toBeGreaterThan(0);
      const summe = f.je_teil.reduce((a, z) => a + z.anzahl, 0);
      expect(summe).toBe(f.gesamt);
    }
  });

  it('nennt bei B2 den Grund, warum keine Bibliothek nötig war', () => {
    const b = B2.herkunft.bibliothek;
    expect(b.name).toBeNull();
    if (b.name !== null) throw new Error('unerreichbar');
    expect(b.begruendung.de.length).toBeGreaterThan(0);
    expect(b.begruendung.en.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Die Adresse einer Aufgabe
// ---------------------------------------------------------------------------

describe('Die Adresse trägt die Aufgabe', () => {
  const abdruck = fingerabdruck(B1, B2);

  it('kommt für jede Aufgabe unverändert zurück', () => {
    for (const z of alleZustaende()) {
      const gelesen = dekodiere(kodiere(z, abdruck));
      expect(gelesen).not.toBeNull();
      expect(gelesen!.zustand).toEqual(z);
      expect(gelesen!.abdruck).toBe(abdruck);
    }
  });

  it('führt bei gleicher Adresse zur gleichen Aufgabe', () => {
    /* Das ist die Zusage an den, der einen Link bekommt. */
    for (const z of alleZustaende()) {
      const code = kodiere(z, abdruck);
      const a = baueAufgabe(B1, B2, dekodiere(code)!.zustand);
      const b = baueAufgabe(B1, B2, dekodiere(code)!.zustand);
      expect(a.zugbild).toEqual(b.zugbild);
      expect(a.pot).toBe(b.pot);
      expect(a.einsatzBetrag).toBe(b.einsatzBetrag);
      expect(loese(a)).toEqual(loese(b));
    }
  });

  it('gibt jeder Aufgabe eine eigene Adresse', () => {
    const alle = alleZustaende().map((z) => kodiere(z, abdruck));
    expect(new Set(alle).size).toBe(alle.length);
  });

  it('bleibt kurz genug für eine Nachricht', () => {
    for (const z of alleZustaende()) {
      expect(kodiere(z, abdruck).length).toBeLessThanOrEqual(12);
    }
  });

  it.each([
    ['leer', ''],
    ['zu wenige Teile', '1-2-3'],
    ['zu viele Teile', '1-2-3-abcd-5'],
    ['Abdruck zu kurz', '1-2-3-abc'],
    ['Großbuchstaben', '1-2-3-ABCD'],
    ['Sonderzeichen', '1-2-!-abcd'],
    ['führende Null', '01-2-3-abcd'],
    ['Komma', '1-2,5-3-abcd'],
    ['negativ', '-1-2-3-abcd'],
  ])('lehnt %s ab', (_was, code) => {
    expect(dekodiere(code)).toBeNull();
  });
});

describe('Der Fingerabdruck bemerkt genau die Änderungen, auf die es ankommt', () => {
  it('bleibt gleich, wenn sich nur eine gerechnete Zahl ändert', () => {
    /* Sonst würde jede neu gerechnete Nachkommastelle alle geteilten Links
       ungültig machen, obwohl sie auf dieselbe Hand zeigen. */
    const andere = structuredClone(B1);
    andere.outs[0].turn = 0.5;
    andere.herkunft.erzeugt_am = '2099-01-01T00:00:00+00:00';
    expect(fingerabdruck(andere, B2)).toBe(fingerabdruck(B1, B2));
  });

  it('ändert sich, wenn ein Zugbild dazukommt', () => {
    const andere = structuredClone(B1);
    andere.zugbilder.unshift({ ...andere.zugbilder[0], hand: 'Qs Js' });
    expect(fingerabdruck(andere, B2)).not.toBe(fingerabdruck(B1, B2));
  });

  it('ändert sich, wenn die Reihenfolge der Zugbilder wechselt', () => {
    /* Der wichtigste Fall: Die Indizes zeigen dann auf andere Hände, und
       ohne diesen Wechsel würde jeder alte Link stillschweigend etwas
       anderes zeigen. */
    const andere = structuredClone(B1);
    andere.zugbilder.reverse();
    expect(fingerabdruck(andere, B2)).not.toBe(fingerabdruck(B1, B2));
  });

  it('ändert sich, wenn eine Einsatzgröße dazukommt', () => {
    const andere = structuredClone(B2);
    andere.einsatzgroessen.push({ ...andere.einsatzgroessen[0], einsatz_als_bruch: '7/8' });
    expect(fingerabdruck(B1, andere)).not.toBe(fingerabdruck(B1, B2));
  });

  it('hat immer dieselbe Länge', () => {
    expect(fingerabdruck(B1, B2)).toMatch(/^[0-9a-z]{4}$/);
  });
});

describe('Die Zahlen in BLOCKER.md stimmen', () => {
  /* Regel K2, auf die Dokumentation angewandt: Wer über Daten schreibt, muss
     es nachrechnen. B-007 wägt ab, ob sich alle Aufgaben als statische Seiten
     vorab erzeugen lassen – und nennt dafür eine Anzahl. Ändern sich die
     Daten, ändert sich die Anzahl, und dieser Test schlägt an, bevor in der
     Datei eine falsche Zahl stehen bleibt. */
  function zaehleZustaende(): number {
    let summe = 0;
    for (const e of B2.einsatzgroessen) {
      const { nenner } = bruchTeile(e.einsatz_als_bruch);
      const s = potFaktorSpanne(nenner);
      summe += s.max - s.min + 1;
    }
    return summe * B1.zugbilder.length;
  }

  it('nennt die richtige Zahl möglicher Aufgaben', () => {
    const text = readFileSync('BLOCKER.md', 'utf8');
    expect(text).toContain(`Es gibt ${zaehleZustaende()} Zustände`);
  });

  it('nennt die richtige Zahl an Zugbild-Einsatz-Paaren', () => {
    const text = readFileSync('BLOCKER.md', 'utf8');
    const paare = B1.zugbilder.length * B2.einsatzgroessen.length;
    expect(text).toContain(`| ${paare} Seiten.`);
  });
});
