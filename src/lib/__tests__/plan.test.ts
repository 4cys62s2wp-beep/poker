import { describe, expect, it } from 'vitest';
import {
  checkAccess,
  isFreeModule,
  isFreeTrainer,
  trialDaysLeft,
  TRIAL_DAYS,
  type EntitlementContext,
} from '../pro/plan';

const base: EntitlementContext = { enabled: true, pro: false, trialActive: false, used: {} };

describe('checkAccess', () => {
  it('ohne aktivierte Monetarisierung ist alles frei', () => {
    const ctx = { ...base, enabled: false };
    expect(checkAccess(ctx, 'modules-advanced').state).toBe('allowed');
    expect(checkAccess(ctx, 'cloud-sync').state).toBe('allowed');
    expect(checkAccess({ ...ctx, used: { coach: 999 } }, 'coach').state).toBe('allowed');
  });

  it('Pro-Abo öffnet alles, auch bei ausgeschöpften Zählern', () => {
    const ctx = { ...base, pro: true, used: { coach: 500, 'play-hands': 9999 } };
    for (const key of ['modules-advanced', 'coach', 'play-hands', 'cloud-sync'] as const) {
      expect(checkAccess(ctx, key).state).toBe('allowed');
    }
  });

  it('laufende Testphase verhält sich wie Pro', () => {
    const ctx = { ...base, trialActive: true, used: { coach: 42 } };
    expect(checkAccess(ctx, 'pro-insights').state).toBe('allowed');
    expect(checkAccess(ctx, 'coach').state).toBe('allowed');
  });

  it('Pro-only-Features sind gratis gesperrt', () => {
    for (const key of ['modules-advanced', 'pro-insights', 'review', 'play-coach', 'cloud-sync'] as const) {
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

  it('Bankroll nutzt ein Gesamtlimit statt eines Tageslimits', () => {
    expect(checkAccess({ ...base, used: { 'bankroll-unlimited': 14 } }, 'bankroll-unlimited').state).toBe('allowed');
    expect(checkAccess({ ...base, used: { 'bankroll-unlimited': 15 } }, 'bankroll-unlimited').state).toBe('limit-reached');
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
