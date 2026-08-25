/* StoreKitProvider – der iOS-Weg. GERÜST, noch nicht funktionsfähig.
   ==================================================================

   Warum das hier nur eine Hülle ist
   ---------------------------------
   Drei Dinge fehlen, und keines davon lässt sich mit Code beschaffen
   (siehe BLOCKER.md, B-002):

   1. **Eine native iOS-Hülle.** Eine PWA kann StoreKit nicht aufrufen –
      das ist keine Bequemlichkeitsfrage, sondern eine harte Grenze des
      Browsers. Es braucht eine echte App (Capacitor, React Native oder
      Swift mit WKWebView), die eine Brücke bereitstellt.
   2. **Ein Apple-Developer-Account** (99 $/Jahr) zum Anlegen der
      Abo-Produkte in App Store Connect.
   3. **Ein Signaturschlüssel** für App Store Server Notifications V2.

   Was hier trotzdem schon richtig ist
   -----------------------------------
   Die Schnittstelle. Sobald die Brücke existiert, wird an genau drei
   markierten Stellen der Aufruf eingesetzt – nichts anderes in der App muss
   sich ändern. Genau dafür gibt es die Abstraktion.

   Wichtig für die Kündigung
   -------------------------
   Apple verlangt, dass Abos in den Systemeinstellungen gekündigt werden. Die
   App darf das nicht selbst tun; sie darf nur dorthin führen. Wer über Apple
   gekauft hat und ein Stripe-Kundenportal sieht, läuft ins Leere – deshalb
   entscheidet die Herkunft (`source`) im Entitlement, welcher Weg gezeigt
   wird. */

import {
  type CancelResult,
  type CheckoutRequest,
  type CheckoutResult,
  type Entitlement,
  type PaymentProvider,
  type PlanId,
  type WebhookResult,
} from './provider';

/** Adresse der Abo-Verwaltung in den iOS-Systemeinstellungen. Von Apple so
    vorgegeben und seit Jahren stabil. */
export const APPLE_MANAGE_SUBSCRIPTIONS_URL = 'https://apps.apple.com/account/subscriptions';

/**
 * Die Brücke, die eine native Hülle bereitstellen muss.
 *
 * Bewusst winzig gehalten: je kleiner die Berührungsfläche zwischen Web und
 * Nativem, desto weniger kann beim späteren Einbau schiefgehen. Alles
 * Weitere – Preise, Berechtigungen, Statuslogik – bleibt im Web-Teil.
 */
export interface StoreKitBridge {
  /** Kauf über das Betriebssystem auslösen. */
  purchase(productId: string): Promise<{ completed: boolean; cancelled: boolean }>;
  /** Frühere Käufe wiederherstellen (von Apple vorgeschrieben!). */
  restorePurchases(): Promise<{ restored: boolean }>;
}

declare global {
  interface Window {
    /** Wird von der nativen Hülle gesetzt. Fehlt im Browser – genau daran
        erkennt isAvailable(), dass StoreKit hier nichts zu suchen hat. */
    __pokermentorStoreKit?: StoreKitBridge;
  }
}

/** Produkt-Kennungen aus App Store Connect.
    TODO (Apple): Müssen exakt mit den dort angelegten Produkten
    übereinstimmen. Erst anlegbar, wenn der Developer-Account existiert. */
export const APPLE_PRODUCT_IDS: Record<PlanId, string> = {
  monthly: 'com.pokermentor.pro.monthly',
  annual: 'com.pokermentor.pro.annual',
};

export class StoreKitProvider implements PaymentProvider {
  readonly source = 'apple' as const;

  private get bridge(): StoreKitBridge | undefined {
    return typeof window !== 'undefined' ? window.__pokermentorStoreKit : undefined;
  }

  isAvailable(): boolean {
    return this.bridge !== undefined;
  }

  async createCheckout(req: CheckoutRequest): Promise<CheckoutResult> {
    if (!req.userId) return { kind: 'error', reason: 'not-signed-in' };

    const bridge = this.bridge;
    if (!bridge) {
      /* Der normale Fall heute: Wir laufen im Browser, es gibt keine Brücke.
         Kein Fehler im engeren Sinn – dieser Weg steht hier schlicht nicht
         zur Verfügung, und chooseProvider() hätte ihn gar nicht erst gewählt. */
      return { kind: 'error', reason: 'unavailable' };
    }

    // TODO (Apple) 1/3: Sobald die Brücke existiert, ist der Aufruf schon richtig.
    const res = await bridge.purchase(APPLE_PRODUCT_IDS[req.plan]);
    if (res.cancelled) return { kind: 'error', reason: 'cancelled' };
    if (!res.completed) return { kind: 'error', reason: 'failed' };

    /* Wichtig: Der Kauf ist damit NICHT verbucht. Die Wahrheit kommt über
       App Store Server Notifications V2 auf dem Server an – genau wie bei
       Stripe. Der Client meldet nur, dass der Dialog erfolgreich war. Ihm
       hier zu glauben, hieße, den Status fälschbar zu machen. */
    return { kind: 'native', completed: true };
  }

  async cancelSubscription(): Promise<CancelResult> {
    /* Apple lässt keine Kündigung durch die App zu. Der einzig zulässige Weg
       ist, den Nutzer in die Systemeinstellungen zu führen. */
    return { kind: 'system-settings', url: APPLE_MANAGE_SUBSCRIPTIONS_URL };
  }

  async handleWebhook(): Promise<WebhookResult> {
    // TODO (Apple) 2/3: Echte Prüfung der App Store Server Notifications V2
    // (JWS gegen die Apple Root CA) liegt in functions/src/webhooks/apple.ts.
    throw new Error(
      'handleWebhook läuft nur serverseitig – siehe functions/src/webhooks/apple.ts',
    );
  }

  async getSubscriptionStatus(): Promise<Entitlement | null> {
    /* TODO (Apple) 3/3: Rückfallebene über die App Store Server API
       (`/inApps/v1/subscriptions/{transactionId}`). Braucht denselben
       Signaturschlüssel wie die Benachrichtigungen und läuft deshalb
       ebenfalls serverseitig. Im Normalbetrieb wird sie nicht gebraucht:
       Der Status steht im Entitlement-Dokument. */
    return null;
  }

  /** Von Apple vorgeschrieben: Es muss eine sichtbare Möglichkeit geben,
      frühere Käufe wiederherzustellen – etwa nach einem Gerätewechsel.
      Fehlt sie, ist das ein Ablehnungsgrund. */
  async restorePurchases(): Promise<boolean> {
    const bridge = this.bridge;
    if (!bridge) return false;
    const res = await bridge.restorePurchases();
    return res.restored;
  }
}
