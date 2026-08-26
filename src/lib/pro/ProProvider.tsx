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
import { readTrialAnchor, reconcileTrialStart, writeTrialAnchor } from './trialAnchor';
import { cancelRouteFor, grantsAccess, type Entitlement } from '../payments/provider';
import {
  APPLE_MANAGE_SUBSCRIPTIONS_URL,
  createProvider,
  currentEnvironment,
  type CancelResult,
  type CheckoutResult,
  type PlanId,
} from '../payments';

interface ProValue {
  config: MonetizationConfig;
  /** Monetarisierung aktiv (sonst ist die App komplett gratis). */
  enabled: boolean;
  /** Aktives, bezahltes Abo. */
  pro: boolean;
  /**
   * **Der zentrale Schalter.** Ist er `true`, ist JEDES Feature offen –
   * ohne Sperre, ohne Limit, ohne Paywall.
   *
   * Er ist wahr, wenn die Monetarisierung aus ist (heutiger Zustand), oder
   * wenn ein bezahltes Abo läuft, oder während der Testphase.
   *
   * Die Oberfläche liest diesen Wert, statt die Regel selbst zu bilden. Vorher
   * stand `!enabled || pro || trialActive` an acht Stellen im Code – acht
   * Kopien einer Entscheidung, die an genau einer Stelle getroffen werden
   * muss. Siehe ENTSCHEIDUNGEN.md, E-009.
   */
  fullAccess: boolean;
  /** Der volle Berechtigungssatz – null, solange keiner vorliegt.
      Wird für die Kündigungs-Führung gebraucht (Apple vs. Web). */
  entitlement: Entitlement | null;
  /** Wohin die Kündigung führen muss: `native` = Systemeinstellungen,
      `web` = Kundenportal. Nach dem Verhalten benannt, nicht nach dem
      Anbieter – die Oberfläche muss den Anbieter nicht kennen. */
  cancelRoute: 'native' | 'web' | 'none';
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
  /**
   * Kauf anstoßen. Welcher Weg genommen wird (Stripe im Browser, StoreKit in
   * der iOS-Hülle), entscheidet die Abstraktion – die Oberfläche erfährt es
   * nicht und darf es auch nicht.
   */
  startCheckout: (plan: PlanId) => Promise<CheckoutResult>;
  /** Zur Verwaltung/Kündigung führen. Bei Apple in die Systemeinstellungen. */
  manageBilling: () => Promise<CancelResult>;
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
  const [entitlement, setEntitlement] = useState<Entitlement | null>(null);
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

  // Berechtigungssatz des angemeldeten Kontos beobachten.
  const uid = cloud.user?.uid ?? null;
  useEffect(() => {
    if (!config.enabled || !uid) {
      setEntitlement(null);
      return;
    }
    let unsub: (() => void) | undefined;
    let alive = true;
    getCloud().then((handle) => {
      if (!alive || !handle) return;
      unsub = handle.watchEntitlement(uid, (e) => {
        if (alive) setEntitlement(e);
      });
    });
    return () => {
      alive = false;
      unsub?.();
    };
  }, [config.enabled, uid]);

  /* Der Beginn der Testphase wird gegen einen getrennt abgelegten Anker
     geprüft: Der FRÜHERE Wert gilt. Ohne das ließe sich die Testphase durch
     Zurücksetzen des Datums im Browser-Speicher beliebig oft neu starten –
     im Gating-Test nachgewiesen. Siehe trialAnchor.ts. */
  const effectiveTrialStart = useMemo(() => {
    const { effective, writeAnchor } = reconcileTrialStart(data.trialStartedAt, readTrialAnchor());
    if (writeAnchor) writeTrialAnchor(writeAnchor);
    return effective;
  }, [data.trialStartedAt]);

  const daysLeft = useMemo(
    () => (config.enabled ? trialDaysLeft(effectiveTrialStart) : 0),
    [config.enabled, effectiveTrialStart],
  );
  const trialActive = config.enabled && daysLeft > 0;
  /* Dieselbe Funktion, die auch serverseitig entscheidet (functions/src/types.ts,
     durch einen Paritätstest synchron gehalten). Damit kann nicht auseinander-
     fallen, was der Nutzer sieht und was er darf. */
  const pro = config.enabled && grantsAccess(entitlement, Date.now());

  const ctx = useMemo(
    () => ({
      enabled: config.enabled,
      pro,
      trialActive,
      // Tageszähler plus Gesamtstände, die direkt aus den Daten ablesbar sind
      // (robuster als ein eigener Zähler, der beim Tageswechsel verloren ginge).
      used: { ...todayUsage, 'bankroll-unlimited': data.sessions.length },
    }),
    [config.enabled, pro, trialActive, todayUsage, data.sessions.length],
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

  /* Der Zahlungsweg wird bei jedem Aufruf neu bestimmt statt einmal beim
     Start: Die native iOS-Brücke kann später gesetzt werden als der erste
     Rendervorgang, und ein einmal falsch gewählter Weg wäre auf iOS ein
     Richtlinienverstoß. */
  const withProvider = useCallback(
    async <T,>(
      fn: (p: NonNullable<ReturnType<typeof createProvider>>) => Promise<T>,
      fallback: T,
    ): Promise<T> => {
      const handle = await getCloud();
      const provider = createProvider(currentEnvironment(config.enabled), {
        functionsBaseUrl: config.functionsBaseUrl,
        getIdToken: () => (handle ? handle.getIdToken() : Promise.resolve(null)),
      });
      if (!provider) return fallback;
      return fn(provider);
    },
    [config.enabled, config.functionsBaseUrl],
  );

  const startCheckout = useCallback(
    (plan: PlanId) =>
      withProvider<CheckoutResult>(
        (p) =>
          p.createCheckout({
            userId: cloud.user?.uid ?? '',
            plan,
            successUrl: `${window.location.origin}${window.location.pathname}#/pro`,
            cancelUrl: `${window.location.origin}${window.location.pathname}#/pro`,
            locale: langRefForCheckout(),
          }),
        { kind: 'error', reason: 'unavailable' },
      ),
    [withProvider, cloud.user?.uid],
  );

  const manageBilling = useCallback(
    () =>
      withProvider<CancelResult>(
        (p) => p.cancelSubscription(cloud.user?.uid ?? ''),
        /* Ohne Provider (etwa weil die Monetarisierung aus ist) trotzdem
           etwas Sinnvolles: Wer über Apple gekauft hat, kommt so immer noch
           an seine Kündigung. */
        entitlement?.source === 'apple'
          ? { kind: 'system-settings', url: APPLE_MANAGE_SUBSCRIPTIONS_URL }
          : { kind: 'error', reason: 'unavailable' },
      ),
    [withProvider, cloud.user?.uid, entitlement?.source],
  );

  const openPaywall = useCallback((reason?: string) => setPaywallReason(reason ?? ''), []);
  const closePaywall = useCallback(() => setPaywallReason(null), []);

  /* Testphase automatisch mit dem ersten Besuch starten, sobald die
     Monetarisierung aktiv ist (Reverse Trial: erst Wert zeigen, dann fragen).

     Geprüft wird der ABGEGLICHENE Beginn, nicht der aus dem Lernstand: Wer
     `trialStartedAt` im Browser-Speicher löscht, soll keine neue Testphase
     auslösen. Der Anker weiß noch, wann sie wirklich begann. */
  const autoStarted = useRef(false);
  useEffect(() => {
    if (config.enabled && !autoStarted.current && effectiveTrialStart === null) {
      autoStarted.current = true;
      startTrialState();
    }
  }, [config.enabled, effectiveTrialStart, startTrialState]);

  /* Der zentrale Schalter (E-009). Genau hier – und nur hier – wird
     entschieden, ob alles offen ist. Heute ist er durch `enabled: false` in
     public/monetization.json dauerhaft wahr; ein einziger Wert in dieser
     Datei stellt das wieder um. */
  const fullAccess = !config.enabled || pro || trialActive;

  const value = useMemo<ProValue>(
    () => ({
      config,
      enabled: config.enabled,
      pro,
      fullAccess,
      entitlement,
      cancelRoute: cancelRouteFor(entitlement),
      trialActive,
      trialDaysLeft: daysLeft,
      trialAvailable: effectiveTrialStart === null,
      startTrial: startTrialState,
      access,
      can,
      consume,
      startCheckout,
      manageBilling,
      openPaywall,
      closePaywall,
      paywallReason,
    }),
    [config, pro, fullAccess, entitlement, trialActive, daysLeft, effectiveTrialStart,
     startTrialState, access, can, consume, startCheckout, manageBilling, openPaywall,
     closePaywall, paywallReason],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** Sprache für die Bezahlseite. Bewusst aus dem Dokument gelesen statt über
    einen weiteren Kontext: Der Wert wird genau einmal pro Kauf gebraucht. */
function langRefForCheckout(): 'de' | 'en' {
  return typeof document !== 'undefined' && document.documentElement.lang === 'en' ? 'en' : 'de';
}

export function usePro(): ProValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('usePro außerhalb des ProProviders');
  return v;
}
