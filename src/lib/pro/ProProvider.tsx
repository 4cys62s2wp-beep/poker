/* Pro-Status und Zugriffsprüfung für die gesamte App.

   Quellen, in dieser Reihenfolge:
   1. Konfiguration fehlt/aus  → alles frei (Standardzustand der App)
   2. Cloud-Konto mit aktivem Abo (servergeschrieben) → Pro
   3. Laufende Testphase → Pro
   4. Sonst Gratis mit Limits

   Wichtig: Der Abo-Status kommt aus einem Dokument, das nur der
   Zahlungs-Webhook schreiben darf. Lokal lässt sich Pro nicht setzen. */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useAppState } from '../../state/AppState';
import { useCloud } from '../cloud/CloudProvider';
import { getCloud } from '../cloud/cloud';
import { loadMonetizationConfig, MONETIZATION_OFF, type MonetizationConfig } from './config';
import { checkAccess, trialDaysLeft, type Access, type FeatureKey } from './plan';

interface ProValue {
  config: MonetizationConfig;
  /** Monetarisierung aktiv (sonst ist die App komplett gratis). */
  enabled: boolean;
  /** Aktives, bezahltes Abo. */
  pro: boolean;
  /** Testphase läuft gerade. */
  trialActive: boolean;
  /** Verbleibende Testtage (0 = keine/abgelaufen). */
  trialDaysLeft: number;
  /** Testphase wurde noch nie gestartet. */
  trialAvailable: boolean;
  startTrial: () => void;
  /** Zugriff auf ein Feature prüfen. */
  access: (key: FeatureKey) => Access;
  /** Kurzform: darf der Nutzer das Feature jetzt benutzen? */
  can: (key: FeatureKey) => boolean;
  /** Eine Nutzung verbuchen (nur nötig bei limitierten Gratis-Features). */
  consume: (key: FeatureKey, amount?: number) => void;
  /** Paywall anzeigen (mit optionalem Auslöser fürs Wording). */
  openPaywall: (reason?: string) => void;
  closePaywall: () => void;
  paywallReason: string | null;
}

const Ctx = createContext<ProValue | null>(null);

export function ProProvider({ children }: { children: ReactNode }) {
  const { data, todayUsage, consumeFeature, startTrial: startTrialState } = useAppState();
  const cloud = useCloud();
  const [config, setConfig] = useState<MonetizationConfig>(MONETIZATION_OFF);
  const [subscribed, setSubscribed] = useState(false);
  const [paywallReason, setPaywallReason] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    loadMonetizationConfig().then((c) => {
      if (alive) setConfig(c);
    });
    return () => {
      alive = false;
    };
  }, []);

  // Abo-Status des angemeldeten Kontos beobachten.
  const uid = cloud.user?.uid ?? null;
  useEffect(() => {
    if (!config.enabled || !uid) {
      setSubscribed(false);
      return;
    }
    let unsub: (() => void) | undefined;
    let alive = true;
    getCloud().then((handle) => {
      if (!alive || !handle) return;
      unsub = handle.watchSubscription(uid, (active) => {
        if (alive) setSubscribed(active);
      });
    });
    return () => {
      alive = false;
      unsub?.();
    };
  }, [config.enabled, uid]);

  const daysLeft = useMemo(
    () => (config.enabled ? trialDaysLeft(data.trialStartedAt) : 0),
    [config.enabled, data.trialStartedAt],
  );
  const trialActive = config.enabled && daysLeft > 0;
  const pro = config.enabled && subscribed;

  const ctx = useMemo(
    () => ({ enabled: config.enabled, pro, trialActive, used: todayUsage }),
    [config.enabled, pro, trialActive, todayUsage],
  );

  const access = useCallback((key: FeatureKey) => checkAccess(ctx, key), [ctx]);
  const can = useCallback((key: FeatureKey) => checkAccess(ctx, key).state === 'allowed', [ctx]);
  const consume = useCallback(
    (key: FeatureKey, amount = 1) => {
      // Bei Pro/Testphase gar nicht erst zählen – spart Schreibzugriffe.
      if (!ctx.enabled || ctx.pro || ctx.trialActive) return;
      consumeFeature(key, amount);
    },
    [ctx, consumeFeature],
  );

  const openPaywall = useCallback((reason?: string) => setPaywallReason(reason ?? ''), []);
  const closePaywall = useCallback(() => setPaywallReason(null), []);

  // Testphase automatisch mit dem ersten Besuch starten, sobald die
  // Monetarisierung aktiv ist (Reverse Trial: erst Wert zeigen, dann fragen).
  const autoStarted = useRef(false);
  useEffect(() => {
    if (config.enabled && !autoStarted.current && data.trialStartedAt === null) {
      autoStarted.current = true;
      startTrialState();
    }
  }, [config.enabled, data.trialStartedAt, startTrialState]);

  const value = useMemo<ProValue>(
    () => ({
      config,
      enabled: config.enabled,
      pro,
      trialActive,
      trialDaysLeft: daysLeft,
      trialAvailable: data.trialStartedAt === null,
      startTrial: startTrialState,
      access,
      can,
      consume,
      openPaywall,
      closePaywall,
      paywallReason,
    }),
    [config, pro, trialActive, daysLeft, data.trialStartedAt, startTrialState, access, can, consume,
     openPaywall, closePaywall, paywallReason],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePro(): ProValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('usePro außerhalb des ProProviders');
  return v;
}
