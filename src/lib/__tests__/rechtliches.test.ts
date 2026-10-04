/* Rechtsseite ehrlich, und das Konto an die Anbieterangaben gekoppelt (E-084).
   ==========================================================================

   Gefunden: Die Seite sagte bei fehlenden Anbieterangaben „… ist das
   unkritisch", obwohl die App längst Konten mit E-Mail-Adresse und Passwort
   anbot (Art. 13 DSGVO verlangt dafür Name und Anschrift des Verantwortlichen);
   die Datenschutzerklärung verwies auf „die oben genannte Adresse", die es
   nicht gab; die Hilfenummer war Text, kein Link. */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { kontoAnbieten, parseLegal } from '../legal';
import { STR } from '../../i18n/pages/legal';

const VOLL = { provider: 'A B', street: 'Weg 1', city: '12345 Ort', email: 'a@b.de' };

describe('Konto nur mit Anbieterangaben', () => {
  it('bietet kein Konto an, solange der Datensatz fehlt oder unvollständig ist', () => {
    expect(kontoAnbieten(null)).toBe(false);
    expect(kontoAnbieten(undefined)).toBe(false);
    expect(kontoAnbieten(parseLegal({ ...VOLL, email: '' }))).toBe(false);
    expect(kontoAnbieten(parseLegal({ ...VOLL, street: '' }))).toBe(false);
  });

  it('bietet es mit vollständigen Angaben an', () => {
    expect(kontoAnbieten(parseLegal(VOLL))).toBe(true);
  });

  it('versteckt Registrierung und Google-Anmeldung, nicht Abmelden und Anmelden', () => {
    const karte = readFileSync('src/components/CloudAccountCard.tsx', 'utf8');
    expect(karte).toContain('kontoAnbieten(legal)');
    expect(karte).toMatch(/mode !== 'reset' && neuanmeldung/);
    /* „Neues Konto“ steht im Umschalter, und der hängt an neuanmeldung. */
    expect(karte).toMatch(/mode !== 'reset' && neuanmeldung && \(\s*<div className="segmented konto-umschalter"[\s\S]*setMode\(m\)/);
    /* Wer ein Konto hat, behält Abmelden: der Zweig mit `user` hängt nicht an neuanmeldung. */
    const mitKonto = karte.slice(karte.indexOf('if (user) {'), karte.indexOf('return (', karte.indexOf('if (user) {') + 20) + 1);
    expect(mitKonto).not.toContain('neuanmeldung');
    expect(mitKonto).toContain('cloud.logout');
  });
});

describe('Ehrliche Texte', () => {
  for (const l of ['de', 'en'] as const) {
    it(`sagt auf ${l} nicht „unkritisch“ und nennt keine „Installation“`, () => {
      expect(STR[l].imprintMissing).not.toMatch(/unkritisch|uncritical/i);
      expect(STR[l].imprintMissing).not.toMatch(/installation/i);
    });

    it(`verweist auf ${l} nur auf eine Adresse, wenn es eine gibt`, () => {
      expect(STR[l].privacyRights).not.toMatch(/oben genannte|address above/i);
      expect(STR[l].privacyAccount).not.toMatch(/schreib|email us|send us|kurze E-Mail/i);
      expect(STR[l].privacyRightsMail1.length).toBeGreaterThan(5);
    });
  }

  it('setzt die Adresse nur mit hinterlegtem Impressum ein', () => {
    const seite = readFileSync('src/pages/LegalPage.tsx', 'utf8');
    expect(seite).toMatch(/\{legal && <>[\s\S]*privacyRightsMail1/);
  });
});

describe('Hilfe antippen', () => {
  const seite = readFileSync('src/pages/LegalPage.tsx', 'utf8');
  const css = readFileSync('src/styles/global.css', 'utf8');

  it('führt die Telefonnummer als tel:-Link und die Adresse als https-Link', () => {
    expect(seite).toMatch(/href=\{`tel:/);
    expect(seite).toMatch(/href=\{`https:\/\/\$\{HILFE_ADRESSE\}`\}/);
    expect(seite).toContain('noopener noreferrer');
  });

  it('gibt beiden die volle Tippfläche', () => {
    expect(css).toMatch(/\.hilfe-link\s*\{[^}]*min-height:\s*var\(--touch-min\)/);
  });

  it('nennt die Behörde mit ihrem heutigen Namen', () => {
    for (const l of ['de', 'en'] as const) {
      expect(STR[l].responsibleA).toMatch(/Bundesinstitut für Öffentliche Gesundheit|Federal Institute for Public Health/);
    }
  });
});
