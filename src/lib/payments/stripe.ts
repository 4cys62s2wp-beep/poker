/* StripeProvider – der Web-Weg.
   =============================

   Aufteilung Client / Server
   --------------------------
   Diese Datei läuft im BROWSER. Sie enthält deshalb bewusst keinen einzigen
   Stripe-Schlüssel und keine Stripe-Bibliothek. Sie ruft nur unsere eigenen
   Cloud Functions auf, und die sprechen mit Stripe.

   Warum so streng: Ein Stripe-Geheimschlüssel im Bundle wäre ein Totalschaden
   – damit könnte jeder Rückerstattungen auslösen und Kundendaten abrufen. Und
   selbst eine fertige Checkout-URL im Bundle ist ein Problem, sobald dieselbe
   Codebasis als iOS-App ausgeliefert wird (Richtlinie 3.1.1, siehe
   docs/BESTANDSAUFNAHME.md).

   Deshalb kennt der Client nur: „mach mir einen Kauf" und bekommt eine
   frisch erzeugte, kurzlebige URL zurück.

   `handleWebhook` steht hier nur als Vertragserfüllung. Die echte
   Implementierung liegt in functions/ – im Browser ist sie weder aufrufbar
   noch sinnvoll. */

import {
  type CancelResult,
  type CheckoutRequest,
  type CheckoutResult,
  type Entitlement,
  type PaymentProvider,
  type WebhookResult,
} from './provider';

/** Wie der Client unsere eigenen Funktionen erreicht. */
export interface StripeClientOptions {
  /**
   * Basis-Adresse der Cloud Functions, z. B.
   * `https://europe-west3-pokermentor-9ac7f.cloudfunctions.net`.
   * Kommt aus der Konfiguration, nicht aus dem Quelltext.
   */
  functionsBaseUrl: string;
  /** Liefert das Firebase-ID-Token des angemeldeten Nutzers. */
  getIdToken: () => Promise<string | null>;
  /** Für Tests überschreibbar. */
  fetchImpl?: typeof fetch;
}

export class StripeProvider implements PaymentProvider {
  readonly source = 'stripe' as const;

  constructor(private readonly opts: StripeClientOptions) {}

  isAvailable(): boolean {
    return typeof this.opts.functionsBaseUrl === 'string' && this.opts.functionsBaseUrl.startsWith('https://');
  }

  async createCheckout(req: CheckoutRequest): Promise<CheckoutResult> {
    if (!req.userId) return { kind: 'error', reason: 'not-signed-in' };
    if (!this.isAvailable()) return { kind: 'error', reason: 'unavailable' };

    const res = await this.call<{ url?: string }>('createCheckoutSession', {
      plan: req.plan,
      successUrl: req.successUrl,
      cancelUrl: req.cancelUrl,
      locale: req.locale ?? 'de',
    });
    if (!res.ok) return { kind: 'error', reason: res.reason };
    /* Die uid wird bewusst NICHT mitgeschickt: Der Server liest sie aus dem
       geprüften Token. Käme sie aus dem Client, könnte jeder ein Abo auf ein
       fremdes Konto buchen – oder schlimmer, sich eines erschleichen. */
    if (!res.data.url) return { kind: 'error', reason: 'failed' };
    return { kind: 'redirect', url: res.data.url };
  }

  async cancelSubscription(userId: string): Promise<CancelResult> {
    if (!userId) return { kind: 'error', reason: 'not-signed-in' };
    if (!this.isAvailable()) return { kind: 'error', reason: 'unavailable' };

    /* Nicht selbst kündigen, sondern ins Kundenportal führen. Dort kann der
       Nutzer auch Zahlungsdaten ändern und Rechnungen abrufen – und Stripe
       übernimmt die Bestätigungsmail, die in Deutschland ohnehin fällig ist
       (§ 312k BGB verlangt eine Bestätigung der Kündigung). */
    const res = await this.call<{ url?: string }>('createPortalSession', {});
    if (!res.ok) return { kind: 'error', reason: res.reason };
    if (!res.data.url) return { kind: 'error', reason: 'failed' };
    return { kind: 'redirect', url: res.data.url };
  }

  async handleWebhook(): Promise<WebhookResult> {
    /* Absichtlich nicht implementiert. Ein Webhook ohne Signaturgeheimnis ist
       wertlos, und das Geheimnis gehört niemals in ein Browser-Bundle. Die
       echte Verarbeitung steht in functions/src/webhooks/stripe.ts. */
    throw new Error(
      'handleWebhook läuft nur serverseitig – siehe functions/src/webhooks/stripe.ts',
    );
  }

  async getSubscriptionStatus(userId: string): Promise<Entitlement | null> {
    if (!userId || !this.isAvailable()) return null;
    const res = await this.call<{ entitlement?: Entitlement | null }>('getEntitlement', {});
    return res.ok ? (res.data.entitlement ?? null) : null;
  }

  /* ---------------------------------------------------------------- */

  private async call<T>(
    fn: string,
    body: Record<string, unknown>,
  ): Promise<{ ok: true; data: T } | { ok: false; reason: 'not-signed-in' | 'network' | 'failed' }> {
    const token = await this.opts.getIdToken();
    if (!token) return { ok: false, reason: 'not-signed-in' };

    const doFetch = this.opts.fetchImpl ?? fetch;
    try {
      const res = await doFetch(`${this.opts.functionsBaseUrl}/${fn}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) return { ok: false, reason: 'failed' };
      return { ok: true, data: (await res.json()) as T };
    } catch {
      return { ok: false, reason: 'network' };
    }
  }
}
