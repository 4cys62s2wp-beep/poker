/* Keine Entwicklersprache in der Oberfläche.
   ==========================================

   Gefunden: Wer den Drill öffnete, während die Daten nicht kamen, las „Im
   Projekt neu erzeugen: npm run daten". Das Profil sagte „localStorage +
   IndexedDB" und „FIREBASE_SETUP.md", die Freunde-Seite „sobald eine
   firebase-config.json hinterlegt ist", ein Fehlertext „in Firebase noch nicht
   freigeschaltet", das Namensfeld „z. B. Lorenz". Das alles stand für den
   Betreiber da und erreichte den Nutzer (E-084). */

import { describe, expect, it } from 'vitest';
import { alleDeutschenTexte, alleEnglischenTexte } from './helfer/deutsche-texte';

/** Wörter, die ein Nutzer nie lesen soll. */
const VERBOTEN: Array<[RegExp, string]> = [
  [/\.json\b/i, 'Dateiname mit .json'],
  [/\.md\b/, 'Dateiname mit .md'],
  [/\bfirebase\b/i, 'Firebase'],
  [/\binstallation\b/i, '„Installation“ als Name für die App'],
  [/npm run/, 'Befehl'],
  [/localStorage|IndexedDB/, 'Speichertechnik'],
  [/\bPWA\b/, 'PWA'],
  [/example\.de/, 'Platzhalteradresse'],
  [/Lorenz/, 'ein echter Name als Platzhalter'],
];

/** Rechtstexte nennen ihre Auftragsverarbeiter beim Namen — das verlangt das Gesetz. */
const AUSGENOMMEN = ['i18n/pages/legal.ts'];

function suche(texte: ReturnType<typeof alleDeutschenTexte>) {
  return texte
    .filter((t) => (t.datei.includes('src/i18n/pages/') || t.datei.includes('src/lib/cloud/cloud.ts')))
    .filter((t) => !AUSGENOMMEN.some((a) => t.datei.endsWith(a)))
    /* Wortlaut hat Leerzeichen; Pfade und Dateinamen im Code (`firebase/app`) nicht. */
    .filter((t) => /\s/.test(t.text))
    .flatMap((t) => VERBOTEN.filter(([re]) => re.test(t.text)).map(([, was]) => `${t.wo} — ${was}: ${t.text.slice(0, 60)}`));
}

describe('Oberfläche', () => {
  it('sagt auf Deutsch nichts, was nur der Betreiber braucht', () => {
    expect(suche(alleDeutschenTexte())).toEqual([]);
  });

  it('sagt es auf Englisch auch nicht', () => {
    expect(suche(alleEnglischenTexte())).toEqual([]);
  });

  it('erkennt Entwicklersprache (die Prüfung prüft sich selbst)', () => {
    expect(VERBOTEN.some(([re]) => re.test('Im Projekt neu erzeugen: npm run daten'))).toBe(true);
    expect(VERBOTEN.some(([re]) => re.test('Sobald eine firebase-config.json hinterlegt ist'))).toBe(true);
    expect(VERBOTEN.some(([re]) => re.test('Dein Fortschritt wird gesichert'))).toBe(false);
  });
});
