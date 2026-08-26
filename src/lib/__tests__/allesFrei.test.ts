/* Der Beweis, dass gerade nichts kostenpflichtig ist.
   ==================================================

   Dieser Test liest die WIRKLICH AUSGELIEFERTE `public/monetization.json` –
   nicht eine im Test erfundene. Genau darin liegt sein Wert: Wer den einen
   Schalter versehentlich umlegt, sieht es hier und nicht beim Nutzer.

   Siehe ENTSCHEIDUNGEN.md, E-009. */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { FEATURE_RULES, checkAccess, type FeatureKey } from '../pro/plan';
import { parseConfig } from '../pro/config';

const AUSGELIEFERT = JSON.parse(readFileSync('public/monetization.json', 'utf8')) as unknown;
const KONFIG = parseConfig(AUSGELIEFERT);

/** Ein frisch installierter Nutzer: kein Abo, keine Testphase, nichts benutzt. */
const FRISCHER_NUTZER = {
  enabled: KONFIG.enabled,
  pro: false,
  trialActive: false,
  used: {} as Record<string, number>,
};

const ALLE_FEATURES = Object.keys(FEATURE_RULES) as FeatureKey[];

describe('Aktuell ist kein Feature kostenpflichtig', () => {
  it('die ausgelieferte Konfiguration hat die Monetarisierung aus', () => {
    expect(KONFIG.enabled).toBe(false);
  });

  it('gibt einem frischen Nutzer Vollzugriff auf JEDES Feature', () => {
    // Kein Feature darf 'pro-only' oder 'limit-reached' melden.
    const gesperrt = ALLE_FEATURES.filter(
      (k) => checkAccess(FRISCHER_NUTZER, k).state !== 'allowed',
    );
    expect(gesperrt).toEqual([]);
  });

  it('hält den Zugriff auch bei hohem Verbrauch offen', () => {
    // Ohne aktive Monetarisierung greift kein Tages- oder Gesamtlimit.
    const vielGenutzt = { ...FRISCHER_NUTZER, used: Object.fromEntries(
      ALLE_FEATURES.map((k) => [k, 10_000]),
    ) };
    for (const k of ALLE_FEATURES) {
      expect(checkAccess(vielGenutzt, k).state, k).toBe('allowed');
    }
  });

  it('deckt wirklich alle Features ab und nicht nur eine Handvoll', () => {
    // Schutz gegen einen Test, der grün bleibt, weil die Liste leer läuft.
    expect(ALLE_FEATURES.length).toBeGreaterThanOrEqual(10);
  });
});

describe('Der Schalter wirkt in beide Richtungen', () => {
  /* Gegenprobe: Ein Test, der nur „alles offen" prüft, wäre auch dann grün,
     wenn checkAccess schlicht immer 'allowed' zurückgäbe. Diese Fälle zeigen,
     dass das Gating noch funktioniert – es ist nur ausgeschaltet. */

  const gegated = { enabled: true, pro: false, trialActive: false, used: {} };

  it('sperrt reine Pro-Features, sobald die Monetarisierung an ist', () => {
    expect(checkAccess(gegated, 'pro-insights').state).toBe('pro-only');
    expect(checkAccess(gegated, 'modules-advanced').state).toBe('pro-only');
  });

  it('greift bei erreichtem Tageslimit', () => {
    const ausgeschöpft = { ...gegated, used: { coach: 99 } };
    expect(checkAccess(ausgeschöpft, 'coach').state).toBe('limit-reached');
  });

  it('öffnet mit Abo oder Testphase wieder alles', () => {
    for (const ctx of [
      { ...gegated, pro: true },
      { ...gegated, trialActive: true },
    ]) {
      for (const k of ALLE_FEATURES) {
        expect(checkAccess(ctx, k).state, k).toBe('allowed');
      }
    }
  });
});

describe('Ein einziger Wert schaltet um', () => {
  it('genügt, "enabled" zu setzen – der Rest der Datei bleibt gleich', () => {
    const nurUmgelegt = { ...(AUSGELIEFERT as object), enabled: true,
      functionsBaseUrl: 'https://example.invalid' };
    expect(parseConfig(nurUmgelegt).enabled).toBe(true);
    expect(checkAccess(
      { enabled: true, pro: false, trialActive: false, used: {} },
      'pro-insights',
    ).state).toBe('pro-only');
  });

  it('bleibt aus, wenn nur "enabled" gesetzt wird, ohne erreichbare Funktionen', () => {
    // Zweiter Riegel: Lieber gar keine Paywall als eine, die ins Leere führt.
    const halbfertig = { ...(AUSGELIEFERT as object), enabled: true };
    expect(parseConfig(halbfertig).enabled).toBe(false);
  });
});
