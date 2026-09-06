/* Was jemand tippt, und was die App daraus macht.
   ==============================================

   Der Maßstab ist nicht „es kommt eine Zahl heraus", sondern: **es kommt
   die Zahl heraus, die derjenige gemeint hat** — oder gar keine, damit die
   Oberfläche nachfragen kann. Eine stille Verwechslung um den Faktor 1000
   ist schlimmer als eine Fehlermeldung. */

import { describe, expect, it } from 'vitest';
import { zahlAusEingabe } from '../eingabe/zahl';

describe('Zahlen aus einem Textfeld', () => {
  it('liest die deutsche Schreibweise', () => {
    const faelle: Array<[string, number]> = [
      ['1250', 1250],
      ['1.250', 1250],          // so schreibt man 1250 auf Deutsch
      ['1.000.000', 1_000_000],
      ['12,50', 12.5],
      ['1.234,56', 1234.56],
      ['0,5', 0.5],
      ['0.125', 0.125],         // führende Null: keine Gruppierung
      ['12.50', 12.5],          // zwei Stellen: kein Tausenderpunkt
      ['1 250', 1250],          // Leerzeichen als Trenner
      ['1.250 €', 1250],
      ['-80,25', -80.25],
      ['+5', 5],
      [',5', 0.5],
      ['5,', 5],
    ];
    for (const [text, erwartet] of faelle) {
      expect(zahlAusEingabe(text, 'de'), `„${text}" auf Deutsch`).toBe(erwartet);
    }
  });

  it('liest die englische Schreibweise', () => {
    const faelle: Array<[string, number]> = [
      ['1,250', 1250],
      ['1,234.56', 1234.56],
      ['12.50', 12.5],
      ['1,000,000', 1_000_000],
      ['0.5', 0.5],
      ['12,50', 12.5],          // deutsch getippt, englische Oberfläche
    ];
    for (const [text, erwartet] of faelle) {
      expect(zahlAusEingabe(text, 'en'), `„${text}" auf Englisch`).toBe(erwartet);
    }
  });

  it('gibt nichts zurück, wenn es keine Zahl ist', () => {
    for (const text of ['', '   ', 'abc', '12abc', 'NaN', 'Infinity', '.', ',', '-', '1.2.3', '1,2,3', '€', '12€34', '1..2']) {
      expect(zahlAusEingabe(text, 'de'), `„${text}" ist keine Zahl`).toBeNull();
    }
    for (const nichttext of [null, undefined, 42, {}, []]) {
      expect(zahlAusEingabe(nichttext as unknown)).toBeNull();
    }
  });

  it('verwechselt keinen Betrag um den Faktor tausend', () => {
    /* Die Fälle, an denen `parseFloat(text.replace(',', '.'))` scheiterte —
       jeder von ihnen kam an `isFinite(n) && n > 0` vorbei, es gab also
       keine Fehlermeldung, nur einen falschen Betrag. */
    const alt = (s: string) => parseFloat(s.replace(',', '.'));
    for (const [text, gemeint] of [['1.250', 1250], ['1.234,56', 1234.56], ['1 250', 1250], ['1.000.000', 1_000_000]] as const) {
      expect(alt(text), `Der alte Weg las „${text}" falsch`).not.toBe(gemeint);
      expect(zahlAusEingabe(text, 'de'), `„${text}"`).toBe(gemeint);
    }
    expect(alt('12abc')).toBe(12);
    expect(zahlAusEingabe('12abc', 'de')).toBeNull();
  });

  it('bleibt bei sich: zweimal gelesen ergibt dasselbe', () => {
    /* Was die App selbst schreibt (`toFixed`, `String`), muss sie auch
       wieder lesen können — sonst driftet ein Wert beim Bearbeiten. */
    for (const n of [0, 0.5, 12.5, 240, 1250, 1234.56, 1_000_000, -80.25]) {
      expect(zahlAusEingabe(String(n), 'en'), `String(${n})`).toBe(n);
      expect(zahlAusEingabe(n.toFixed(2).replace('.', ','), 'de'), `deutsch ${n}`).toBe(Math.round(n * 100) / 100);
    }
  });
});
