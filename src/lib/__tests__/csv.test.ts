/* Die exportierte Datei landet in einer fremden Anwendung.
   ========================================================

   Ein Export ist erst fertig, wenn das Programm auf der anderen Seite ihn
   richtig liest. Diese Prüfungen sind deshalb keine Formatprüfungen, sondern
   Aussagen darüber, was Excel & Co. mit dem Ergebnis anstellen. */

import { describe, expect, it } from 'vitest';
import { csvDatei, csvText, csvZahl } from '../export/csv';

/** Ein einfacher Leser für RFC-4180-CSV — die Gegenprobe zum Schreiber. */
function lies(datei: string): string[][] {
  const text = datei.replace(/^﻿/, '');
  const zeilen: string[][] = [];
  let zeile: string[] = [];
  let zelle = '';
  let inAnführung = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inAnführung) {
      if (c === '"' && text[i + 1] === '"') { zelle += '"'; i++; }
      else if (c === '"') inAnführung = false;
      else zelle += c;
    } else if (c === '"') inAnführung = true;
    else if (c === ';') { zeile.push(zelle); zelle = ''; }
    else if (c === '\r' && text[i + 1] === '\n') {
      zeile.push(zelle); zeilen.push(zeile); zeile = []; zelle = ''; i++;
    } else zelle += c;
  }
  if (zelle !== '' || zeile.length > 0) { zeile.push(zelle); zeilen.push(zeile); }
  return zeilen;
}

describe('CSV-Export', () => {
  it('trennt Spalten auch dann richtig, wenn der Text Trennzeichen enthält', () => {
    /* Eine Notiz wie „Gegner sehr aggressiv; früh all-in" hätte ohne
       Anführungszeichen zwei Spalten aus einer gemacht — und damit jede
       folgende Spalte um eins verschoben. */
    const datei = csvDatei(
      ['Datum', 'Spiel', 'Notizen', 'Minuten'],
      [['2026-09-01', 'NL2 Cash', 'Gegner sehr aggressiv; früh all-in', 240]],
    );
    const tabelle = lies(datei);
    expect(tabelle).toHaveLength(2);
    expect(tabelle[1]).toHaveLength(4);
    expect(tabelle[1][2]).toBe('Gegner sehr aggressiv; früh all-in');
    expect(tabelle[1][3]).toBe('240');
  });

  it('hält einen Zeilenumbruch in der Zelle', () => {
    const tabelle = lies(csvDatei(['A', 'B'], [['erste\nzweite', 'x']]));
    expect(tabelle).toHaveLength(2);
    expect(tabelle[1][0]).toBe('erste\nzweite');
    expect(tabelle[1][1]).toBe('x');
  });

  it('führt keine Formel aus, die aus einer Sicherung kommt', () => {
    /* Der klassische Fall: Ein Feld beginnt mit `=` und die
       Tabellenkalkulation ruft beim Öffnen ein Programm auf. Das gilt für
       *jedes* Textfeld — auch für das Datum, das aus einer importierten
       Sicherung beliebigen Inhalt haben kann. */
    for (const gift of ['=cmd|\'/c calc\'!A1', '+1+1', '-2+3', '@SUM(A1)', '\tx', '\rx']) {
      const zelle = csvText(gift);
      expect(zelle.startsWith('"\''), `nicht entschärft: ${JSON.stringify(gift)}`).toBe(true);
      expect(lies(csvDatei(['A'], [[gift]]))[1][0]).toBe(`'${gift}`);
    }
  });

  it('entschärft auch das Datumsfeld', () => {
    const tabelle = lies(csvDatei(['Datum', 'Art'], [['=HYPERLINK("http://x")', 'live']]));
    expect(tabelle[1][0]).toBe('\'=HYPERLINK("http://x")');
  });

  it('schreibt Beträge so, wie ein deutsches Tabellenprogramm sie liest', () => {
    /* `12.50` wird im deutschen Gebietsschema zu „12. Mai". */
    expect(csvZahl(12.5)).toBe('12,50');
    expect(csvZahl(1234.567)).toBe('1234,57');
    expect(csvZahl(240)).toBe('240');
    expect(csvZahl(0)).toBe('0');
    expect(csvZahl(-80.25)).toBe('-80,25');
    for (const z of [csvZahl(12.5), csvZahl(240), csvZahl(-80.25)]) {
      expect(z, `kein Punkt erlaubt: ${z}`).not.toContain('.');
    }
  });

  it('schreibt keine Zahl in Exponentialschreibweise und keine Nicht-Zahl', () => {
    expect(csvZahl(1e21)).not.toContain('e');
    expect(csvZahl(NaN)).toBe('0');
    expect(csvZahl(Infinity)).toBe('0');
  });

  it('beginnt mit dem BOM, sonst zeigt Excel „GlÃ¼ck"', () => {
    expect(csvDatei(['Glück'], []).startsWith('﻿')).toBe(true);
  });

  it('liest sich vollständig zurück', () => {
    /* Die Gegenprobe über die ganze Datei: Was hineingeht, kommt heraus. */
    const kopf = ['Datum', 'Art', 'Spiel', 'Buy-in', 'Cash-out', 'Gewinn', 'Minuten', 'Notizen'];
    const zeilen = [
      ['2026-09-01', 'live', '1/2 NLH', 100, 180.5, 80.5, 240, 'gut gelaufen'],
      ['2026-09-02', 'online', 'NL2 "Zoom"', 25, 0, -25, 95, 'Tilt; früh weg\nnächstes Mal Pause'],
    ];
    const tabelle = lies(csvDatei(kopf, zeilen));
    expect(tabelle[0]).toEqual(kopf);
    expect(tabelle).toHaveLength(3);
    expect(tabelle[1]).toEqual(['2026-09-01', 'live', '1/2 NLH', '100', '180,50', '80,50', '240', 'gut gelaufen']);
    expect(tabelle[2][2]).toBe('NL2 "Zoom"');
    expect(tabelle[2][5]).toBe('-25');
    expect(tabelle[2][7]).toBe('Tilt; früh weg\nnächstes Mal Pause');
  });
});
