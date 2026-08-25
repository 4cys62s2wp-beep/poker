/* Auswahl und Erzeugung des passenden Zahlungswegs.
   =================================================

   Die eine Stelle, an der entschieden wird, welcher Provider gilt. Alles
   darüber (Oberfläche, Berechtigungslogik) kennt nur `PaymentProvider` und
   erfährt nie, welcher es geworden ist. */

import { chooseProvider, type PaymentProvider, type RuntimeEnvironment } from './provider';
import { MockProvider } from './mock';
import { StripeProvider } from './stripe';
import { StoreKitProvider } from './storekit';

export * from './provider';
export { MockProvider } from './mock';
export { StripeProvider } from './stripe';
export { StoreKitProvider, APPLE_MANAGE_SUBSCRIPTIONS_URL } from './storekit';

export interface ProviderDeps {
  functionsBaseUrl: string;
  getIdToken: () => Promise<string | null>;
}

/**
 * Läuft die App in einer nativen iOS-Hülle?
 *
 * Erkannt wird die Brücke, die eine solche Hülle setzt – NICHT der
 * User-Agent. Der lässt sich fälschen und sagt ohnehin nur, welcher Browser
 * es ist, nicht ob StoreKit erreichbar wäre. Die Brücke ist da oder sie ist
 * es nicht.
 */
export function detectNativeIos(): boolean {
  return typeof window !== 'undefined' && window.__pokermentorStoreKit !== undefined;
}

/**
 * Darf der Mock-Weg benutzt werden?
 *
 * NUR im Entwicklungsmodus. Ein Mock in Produktion wäre eine kostenlose
 * Pro-Mitgliedschaft für jeden, der ihn auslöst.
 */
export function mockAllowed(): boolean {
  return import.meta.env.DEV === true;
}

export function currentEnvironment(monetizationEnabled: boolean): RuntimeEnvironment {
  return {
    isNativeIos: detectNativeIos(),
    monetizationEnabled,
    useMock: mockAllowed(),
  };
}

/** Liefert den gültigen Zahlungsweg – oder null, wenn keiner gilt. */
export function createProvider(
  env: RuntimeEnvironment,
  deps: ProviderDeps,
): PaymentProvider | null {
  switch (chooseProvider(env)) {
    case 'storekit':
      return new StoreKitProvider();
    case 'stripe':
      return new StripeProvider(deps);
    case 'mock':
      return new MockProvider();
    case 'none':
      return null;
  }
}
