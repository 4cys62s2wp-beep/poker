/* Farbe trägt Bedeutung — und nur eine.
   ====================================

   Gold stand auf dem Hauptknopf, auf dem gewählten Eintrag, auf jeder
   Augenbraue, an den Fortschrittsbalken und an der aktiven Seitenleiste. Wer
   fragte, was Gold bedeutet, bekam fünf Antworten, und DESIGN.md §2 („genau
   eine Akzentfarbe") widersprach Regel 10.9 („jeder Bereich hat seine
   Farbe") im selben Dokument (E-076).

   Jetzt gilt (Regel 12.5):
   - **Die Bereichsfarbe** hängt am Rahmen der App. Lernen Gold, Nachschlagen
     Blau, Live-Session Grün; Start, Profil und Freunde haben keine.
   - **Der Hauptknopf** ist flach und neutral — in jedem Bereich derselbe.
   - **Auswahl ist keine Handlung:** Fläche und Rand in der Textfarbe, nie der
     Stil des Hauptknopfs.
   - **Nichts glüht.** */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { bereichVon } from '../design/bereich';

const CSS = readFileSync('src/styles/global.css', 'utf8');

const block = (selektor: string): string => {
  const i = CSS.indexOf(`${selektor} {`);
  return i < 0 ? '' : CSS.slice(i, CSS.indexOf('}', i));
};

describe('bereichVon', () => {
  it('ordnet jeden Pfad einem Bereich zu', () => {
    expect(bereichVon('/lernen')).toBe('lernen');
    expect(bereichVon('/lernen/m1/m1-l1')).toBe('lernen');
    expect(bereichVon('/nachschlagen/coach')).toBe('nachschlagen');
    expect(bereichVon('/session/live/einrichten')).toBe('session');
  });

  it('lässt Start, Profil und Freunde farblos', () => {
    for (const pfad of ['/', '/profil', '/freunde', '/rechtliches', '/pro']) {
      expect(bereichVon(pfad), pfad).toBe('neutral');
    }
  });

  it('verwechselt keine Namen mit gleichem Anfang', () => {
    expect(bereichVon('/lernenx')).toBe('neutral');
    expect(bereichVon('/sessionen')).toBe('neutral');
  });
});

describe('Farbrollen im Stylesheet', () => {
  it('färbt die Augenbraue mit der Bereichsfarbe, nicht mit Gold', () => {
    expect(block('.eyebrow')).toMatch(/color:\s*var\(--bereich\)/);
    expect(block('.eyebrow')).not.toMatch(/--auszeichnung/);
  });

  it('definiert die Bereichsfarbe je Bereich — und eine neutrale Voreinstellung', () => {
    expect(CSS).toMatch(/\.modus-rahmen\s*\{[^}]*--bereich:\s*var\(--text-dim\)/);
    expect(CSS).toMatch(/data-bereich="lernen"\][^}]*--bereich:\s*var\(--auszeichnung-lesbar\)/);
    expect(CSS).toMatch(/data-bereich="nachschlagen"\][^}]*--bereich:\s*var\(--info-lesbar\)/);
    expect(CSS).toMatch(/data-bereich="session"\][^}]*--bereich:\s*var\(--ok-lesbar\)/);
  });

  it('setzt den Hauptknopf flach und neutral', () => {
    const b = block('.btn.primary');
    expect(b, 'kein Verlauf').not.toMatch(/gradient/);
    expect(b, 'Fläche in der Textfarbe').toMatch(/background:\s*var\(--text\)/);
    expect(b, 'kein Glühen').toMatch(/box-shadow:\s*none/);
  });

  it('zeigt eine Auswahl nie im Stil des Hauptknopfs', () => {
    const a = block('.segmented button.on');
    expect(a).not.toMatch(/gradient|knopf-auszeichnung/);
    expect(a).toMatch(/inset 0 0 0 1\.5px var\(--text\)/);
  });

  it('lässt Fortschrittsbalken und Schrittpunkte nicht glühen', () => {
    expect(block('.progressbar > div')).not.toMatch(/box-shadow/);
    expect(block('.progressbar.green > div')).not.toMatch(/box-shadow/);
    expect(CSS).not.toMatch(/\.step-dots \.dot\.on\s*\{[^}]*box-shadow/);
  });

  it('markiert in der Seitenleiste mit der Bereichsfarbe', () => {
    expect(block('.nav-link.active')).toMatch(/background:\s*var\(--bereich-schwach\)/);
    expect(block('.nav-link.active::before')).toMatch(/background:\s*var\(--bereich\)/);
  });
});

describe('Willkommensdialog', () => {
  it('zeigt keine Sprache als vorausgewählt', () => {
    const src = readFileSync('src/components/Onboarding.tsx', 'utf8');
    /* „Deutsch" stand als Hauptknopf neben „English" als gewöhnlichem — das
       sieht aus wie eine Auswahl, ist aber keine. */
    expect(src).not.toMatch(/className="btn primary"[^>]*>\s*\{?[^<]*chooseLang|btn primary[^>]*onClick=\{\(\) => chooseLang/);
  });
});
