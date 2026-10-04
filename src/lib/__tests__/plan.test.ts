import { describe, expect, it } from 'vitest';
import {
  checkAccess,
  istGesperrt,
  proZiel,
  isFreeModule,
  isFreeTrainer,
  FEATURE_RULES,
  trialDaysLeft,
  TRIAL_DAYS,
  type EntitlementContext,
} from '../pro/plan';

const base: EntitlementContext = { enabled: true, pro: false, trialActive: false, used: {} };

describe('checkAccess', () => {
  it('ohne aktivierte Monetarisierung ist alles frei', () => {
    const ctx = { ...base, enabled: false };
    expect(checkAccess(ctx, 'modules-advanced').state).toBe('allowed');
    expect(checkAccess(ctx, 'pro-insights').state).toBe('allowed');
    expect(checkAccess({ ...ctx, used: { coach: 999 } }, 'coach').state).toBe('allowed');
  });

  it('Pro-Abo öffnet alles, auch bei ausgeschöpften Zählern', () => {
    const ctx = { ...base, pro: true, used: { coach: 500, 'play-hands': 9999 } };
    for (const key of ['modules-advanced', 'coach', 'play-hands', 'trainers-advanced'] as const) {
      expect(checkAccess(ctx, key).state).toBe('allowed');
    }
  });

  it('laufende Testphase verhält sich wie Pro', () => {
    const ctx = { ...base, trialActive: true, used: { coach: 42 } };
    expect(checkAccess(ctx, 'pro-insights').state).toBe('allowed');
    expect(checkAccess(ctx, 'coach').state).toBe('allowed');
  });

  it('Pro-only-Features sind gratis gesperrt', () => {
    for (const key of ['modules-advanced', 'trainers-advanced', 'pro-insights'] as const) {
      expect(checkAccess(base, key)).toEqual({ state: 'pro-only' });
    }
  });

  it('gemessene Features: Restanzahl runter bis zum Limit', () => {
    expect(checkAccess(base, 'coach')).toEqual({ state: 'allowed', remaining: 3, limit: 3 });
    expect(checkAccess({ ...base, used: { coach: 2 } }, 'coach')).toEqual({ state: 'allowed', remaining: 1, limit: 3 });
    expect(checkAccess({ ...base, used: { coach: 3 } }, 'coach')).toEqual({ state: 'limit-reached', limit: 3 });
    expect(checkAccess({ ...base, used: { coach: 99 } }, 'coach')).toEqual({ state: 'limit-reached', limit: 3 });
  });

  it('negative oder unsinnige Zähler brechen nichts', () => {
    expect(checkAccess({ ...base, used: { coach: -5 } }, 'coach').state).toBe('allowed');
    expect(checkAccess({ ...base, used: {} }, 'play-hands')).toEqual({ state: 'allowed', remaining: 25, limit: 25 });
  });
});

describe('Gratis-Inhalte', () => {
  it('die ersten drei Module sind gratis, der Rest ist Pro', () => {
    expect(isFreeModule('m1')).toBe(true);
    expect(isFreeModule('m3')).toBe(true);
    expect(isFreeModule('m4')).toBe(false);
    expect(isFreeModule('m9')).toBe(false);
  });

  it('die fünf Basis-Trainer sind gratis, Szenario/Push-Fold sind Pro', () => {
    expect(isFreeTrainer('potodds')).toBe(true);
    expect(isFreeTrainer('outs')).toBe(true);
    expect(isFreeTrainer('szenario')).toBe(false);
    expect(isFreeTrainer('pushfold')).toBe(false);
  });
});

describe('Die Lernschleife bleibt gratis (E-098)', () => {
  it('Wiederholen, Coach am Tisch, Bankroll und Export sind keine Features mit Sperre', () => {
    for (const key of ['review', 'play-coach', 'bankroll-unlimited', 'export', 'cloud-sync']) {
      expect(Object.keys(FEATURE_RULES)).not.toContain(key);
    }
  });

  it('Pro verkauft Tiefe: Module, zwei Trainer, Insights, Coach- und Tischlimit', () => {
    expect(Object.keys(FEATURE_RULES).sort()).toEqual(
      ['coach', 'modules-advanced', 'play-hands', 'pro-insights', 'trainers-advanced'],
    );
  });
});

describe('proZiel und istGesperrt', () => {
  const gratis: EntitlementContext = { enabled: true, pro: false, trialActive: false, used: {} };

  it('Trainer, Insights, Module und Lektionen ab 2 liegen hinter Pro', () => {
    expect(proZiel('/lernen/trainer/szenario')).toBe('trainers-advanced');
    expect(proZiel('/lernen/trainer/pushfold')).toBe('trainers-advanced');
    expect(proZiel('/lernen/pros')).toBe('pro-insights');
    expect(proZiel('/lernen/m4')).toBe('modules-advanced');
    expect(proZiel('/lernen/m4/m4-l2')).toBe('modules-advanced');
    expect(proZiel('/lernen/m4/m4-l2/quiz')).toBe('modules-advanced');
  });

  it('die erste Lektion jedes Moduls und die Gratis-Module sind offen', () => {
    expect(proZiel('/lernen/m4/m4-l1')).toBeNull();
    expect(proZiel('/lernen/m1')).toBeNull();
    expect(proZiel('/lernen/m2/m2-l3')).toBeNull();
    expect(proZiel('/lernen/m6/m6-l4')).toBeNull();
  });

  it('Wiederholen, Tisch, Tages-Quiz, Drill und die fünf Trainer sind offen', () => {
    for (const pfad of ['/lernen/wiederholen', '/lernen/uebungstisch', '/lernen/tagesquiz', '/lernen/drill',
      '/lernen/trainer/preflop', '/lernen/trainer/potodds', '/session/bankroll', '/nachschlagen/coach']) {
      expect(proZiel(pfad), pfad).toBeNull();
    }
  });

  it('Abfrage und Anker ändern nichts', () => {
    expect(proZiel('/lernen/pros?x=1')).toBe('pro-insights');
    expect(proZiel('/lernen/trainer/szenario/')).toBe('trainers-advanced');
  });

  it('das Schloss steht nur ohne Pro, ohne Testphase und mit Monetarisierung', () => {
    expect(istGesperrt(gratis, '/lernen/pros')).toBe(true);
    expect(istGesperrt({ ...gratis, pro: true }, '/lernen/pros')).toBe(false);
    expect(istGesperrt({ ...gratis, trialActive: true }, '/lernen/pros')).toBe(false);
    expect(istGesperrt({ ...gratis, enabled: false }, '/lernen/pros')).toBe(false);
    expect(istGesperrt(gratis, '/lernen/wiederholen')).toBe(false);
  });
});

describe('trialDaysLeft', () => {
  const start = '2026-08-01T12:00:00.000Z';

  it('ohne Startdatum keine Testphase', () => {
    expect(trialDaysLeft(null)).toBe(0);
    expect(trialDaysLeft('kein-datum')).toBe(0);
  });

  it('zählt tageweise herunter', () => {
    expect(trialDaysLeft(start, new Date('2026-08-01T12:00:00.000Z'))).toBe(TRIAL_DAYS);
    expect(trialDaysLeft(start, new Date('2026-08-02T13:00:00.000Z'))).toBe(TRIAL_DAYS - 1);
    // 5 Tage und 23 Stunden vergangen → der 6. Tag läuft noch, 2 Tage übrig
    expect(trialDaysLeft(start, new Date('2026-08-07T11:00:00.000Z'))).toBe(2);
    expect(trialDaysLeft(start, new Date('2026-08-07T13:00:00.000Z'))).toBe(1);
  });

  it('läuft ab und bleibt bei 0', () => {
    expect(trialDaysLeft(start, new Date('2026-08-08T12:00:01.000Z'))).toBe(0);
    expect(trialDaysLeft(start, new Date('2027-01-01T00:00:00.000Z'))).toBe(0);
  });

  it('zurückgestellte Uhr bestraft den Nutzer nicht', () => {
    expect(trialDaysLeft(start, new Date('2026-07-01T00:00:00.000Z'))).toBe(TRIAL_DAYS);
  });
});
