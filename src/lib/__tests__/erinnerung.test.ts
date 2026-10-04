/* Erinnern ohne Server (FAHRPLAN 4.6).
   ====================================

   Geprüft wird, was ein Kalender bekommt — und dass die App nichts tut, was
   Vertrauen kostet: keine Mitteilungserlaubnis, kein Push, kein Dienst. */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { baueIcs, ersterTermin, falte, maskiere, UHRZEIT_MUSTER } from '../erinnerung';
import { setzeAppMarke } from '../appmarke';

function dateienUnter(ordner: string, aus: string[] = []): string[] {
  for (const eintrag of readdirSync(ordner)) {
    const p = join(ordner, eintrag);
    if (statSync(p).isDirectory()) dateienUnter(p, aus);
    else aus.push(p);
  }
  return aus;
}

const E = {
  uhrzeit: '19:00',
  adresse: 'https://beispiel.de/poker/',
  titel: 'PokerMentor: Hand des Tages',
  beschreibung: 'Eine Hand, eine Frage – dauert eine Minute.',
  jetzt: new Date(2026, 9, 4, 10, 28, 0),
};

describe('Der Kalendereintrag', () => {
  const ics = baueIcs(E);

  it('ist ein gültiger Rahmen mit CRLF-Zeilenenden', () => {
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
    /* Kein einsames LF: Manche Kalender lehnen die Datei sonst ab. */
    expect(ics.replace(/\r\n/g, '')).not.toMatch(/[\r\n]/);
  });

  it('wiederholt sich täglich und hat eine feste Kennung', () => {
    expect(ics).toContain('RRULE:FREQ=DAILY');
    /* Dieselbe Kennung bei jedem Download: Ein zweiter ersetzt den ersten. */
    expect(baueIcs({ ...E, uhrzeit: '07:30' })).toContain('UID:hand-des-tages@pokermentor');
  });

  it('beginnt heute, wenn die Zeit noch aussteht, sonst morgen', () => {
    expect(ersterTermin(E.jetzt, '19:00')).toBe('20261004T190000');
    expect(ersterTermin(E.jetzt, '08:00')).toBe('20261005T080000');
    /* Genau jetzt gilt als vorbei. */
    expect(ersterTermin(E.jetzt, '10:28')).toBe('20261005T102800');
  });

  it('wechselt über das Monatsende', () => {
    expect(ersterTermin(new Date(2026, 9, 31, 23, 0), '07:00')).toBe('20261101T070000');
  });

  it('ist schwebend (ohne Zeitzone) und blockiert keinen Kalender', () => {
    expect(ics).toMatch(/DTSTART:\d{8}T\d{6}\r\n/);
    expect(ics).toContain('TRANSP:TRANSPARENT');
  });

  it('enthält eine Anzeige-Erinnerung zur Startzeit', () => {
    expect(ics).toContain('BEGIN:VALARM');
    expect(ics).toContain('TRIGGER:PT0M');
    expect(ics).toContain('ACTION:DISPLAY');
  });

  it('verweist auf die App', () => {
    expect(ics).toContain('URL:https://beispiel.de/poker/');
  });

  it('lehnt eine ungültige Uhrzeit ab', () => {
    expect(() => baueIcs({ ...E, uhrzeit: '25:00' })).toThrow();
    expect(() => baueIcs({ ...E, uhrzeit: '' })).toThrow();
    expect(UHRZEIT_MUSTER.test('00:00')).toBe(true);
    expect(UHRZEIT_MUSTER.test('23:59')).toBe(true);
    expect(UHRZEIT_MUSTER.test('7:30')).toBe(false);
  });
});

describe('Maskieren und Falten', () => {
  it('maskiert Komma, Semikolon, Backslash und Zeilenumbruch', () => {
    expect(maskiere('a,b;c\\d\ne')).toBe('a\\,b\;c\\\\d\\ne');
  });

  it('bricht Zeilen bei 75 Byte, ohne ein Zeichen zu zerschneiden', () => {
    const lang = `SUMMARY:${'ä'.repeat(60)}`;
    const gefaltet = falte(lang).split('\r\n');
    const enc = new TextEncoder();
    for (const z of gefaltet) expect(enc.encode(z).length).toBeLessThanOrEqual(75);
    /* Entfaltet ergibt es wieder das Original. */
    expect(gefaltet.map((z, i) => (i === 0 ? z : z.slice(1))).join('')).toBe(lang);
  });

  it('lässt eine kurze Zeile unverändert', () => {
    expect(falte('SUMMARY:kurz')).toBe('SUMMARY:kurz');
  });
});

describe('Die App-Marke', () => {
  it('tut nichts und wirft nichts, wo der Browser sie nicht kennt', () => {
    expect(() => setzeAppMarke(3)).not.toThrow();
    expect(() => setzeAppMarke(0)).not.toThrow();
  });
});

describe('Keine Mitteilungen', () => {
  it('fordert nirgends eine Mitteilungserlaubnis an und baut kein Push', () => {
    /* Auf dem iPhone verlangt das Symbol-Abzeichen sie, und eine App, die
       ungefragt um Mitteilungen bittet, verbraucht das Vertrauen, das sie für
       die Anmeldung braucht. Dazu: kein Push-Dienst. */
    const treffer: string[] = [];
    for (const datei of dateienUnter('src')) {
      if (!/\.(ts|tsx)$/.test(datei) || datei.includes('__tests__')) continue;
      const q = readFileSync(datei, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
      if (/Notification\.requestPermission|pushManager|PushManager|firebase\/messaging/.test(q)) {
        treffer.push(datei);
      }
    }
    expect(treffer).toEqual([]);
  });
});
