/* MockProvider: vollständiger Zahlungsweg ohne jedes Konto.
   ==========================================================

   Wofür
   -----
   Entwicklung und Tests, solange es weder Stripe- noch Apple-Konto gibt
   (siehe BLOCKER.md). Der Mock durchläuft dieselben Zustände wie ein echter
   Anbieter – inklusive fehlgeschlagener Zahlung, Kulanzfrist, Kündigung und
   Erstattung. Damit lässt sich das Berechtigungsmodell heute vollständig
   prüfen, ohne einen Cent zu bewegen.

   Sicherheitshinweis
   ------------------
   Dieser Weg darf NIEMALS in einem Produktions-Build aktiv sein. Er wird nur
   gewählt, wenn `useMock` gesetzt ist (siehe chooseProvider), und das ist an
   den Entwicklungsmodus gebunden. Ein Mock in Produktion wäre eine kostenlose
   Pro-Mitgliedschaft für jeden. */

import {
  type CancelResult,
  type CheckoutRequest,
  type CheckoutResult,
  type Entitlement,
  type PaymentProvider,
  type PlanId,
  type SubscriptionStatus,
  type WebhookResult,
} from './provider';

const DAY = 86_400_000;

export interface MockOptions {
  /** Zeitquelle – für Tests überschreibbar, damit nichts von der echten Uhr abhängt. */
  now?: () => number;
  /** Soll ein Kauf scheitern? Für den Fehlerpfad. */
  failCheckout?: boolean;
}

/**
 * Ein Anbieter, der seine Abos im Arbeitsspeicher hält.
 *
 * Bewusst kein Firestore: Der Mock spielt den ANBIETER, nicht unsere
 * Datenbank. Was in Firestore landet, entscheidet der Entitlement-Service
 * anhand der Webhooks – genau wie bei Stripe. Würde der Mock direkt nach
 * Firestore schreiben, würde er den Teil überspringen, den zu prüfen der
 * ganze Sinn der Übung ist.
 */
export class MockProvider implements PaymentProvider {
  readonly source = 'mock' as const;

  private subs = new Map<string, Entitlement>();
  private seenEvents = new Set<string>();
  private now: () => number;
  private failCheckout: boolean;

  constructor(opts: MockOptions = {}) {
    this.now = opts.now ?? (() => Date.now());
    this.failCheckout = opts.failCheckout ?? false;
  }

  isAvailable(): boolean {
    return true;
  }

  async createCheckout(req: CheckoutRequest): Promise<CheckoutResult> {
    if (!req.userId) return { kind: 'error', reason: 'not-signed-in' };
    if (this.failCheckout) return { kind: 'error', reason: 'failed' };

    /* Ein echter Anbieter würde jetzt eine Bezahlseite öffnen und den Status
       erst über den Webhook melden. Der Mock tut dasselbe: Er legt das Abo an
       und erzeugt das Ereignis – anwenden muss es der Entitlement-Service. */
    const periodDays = req.plan === 'annual' ? 365 : 30;
    this.subs.set(req.userId, {
      userId: req.userId,
      plan: req.plan,
      status: 'active',
      source: 'mock',
      currentPeriodEnd: this.now() + periodDays * DAY,
      providerSubscriptionId: `mock_sub_${req.userId}`,
      updatedAt: this.now(),
    });

    return { kind: 'redirect', url: `mock://checkout/${req.plan}` };
  }

  async cancelSubscription(userId: string): Promise<CancelResult> {
    const sub = this.subs.get(userId);
    if (!sub) return { kind: 'error', reason: 'unavailable' };
    // Wie bei Stripe: gekündigt, aber bis zum Laufzeitende weiter nutzbar.
    this.subs.set(userId, { ...sub, status: 'canceled', updatedAt: this.now() });
    return { kind: 'redirect', url: 'mock://portal' };
  }

  async handleWebhook(rawBody: string, headers: Record<string, string>): Promise<WebhookResult> {
    // Der Mock prüft eine Signatur genau wie ein echter Anbieter – sonst
    // bliebe der wichtigste Pfad ungetestet.
    if (headers['x-mock-signature'] !== MOCK_SIGNATURE) {
      return { kind: 'invalid-signature' };
    }

    let event: MockEvent;
    try {
      event = JSON.parse(rawBody) as MockEvent;
    } catch {
      return { kind: 'ignored', reason: 'kein gültiges JSON' };
    }
    if (!event?.id || !event.userId || !event.status) {
      return { kind: 'ignored', reason: 'Pflichtfelder fehlen' };
    }

    if (this.seenEvents.has(event.id)) {
      return { kind: 'duplicate', eventId: event.id };
    }
    this.seenEvents.add(event.id);

    const existing = this.subs.get(event.userId);
    this.subs.set(event.userId, {
      userId: event.userId,
      plan: event.plan ?? existing?.plan ?? null,
      status: event.status,
      source: 'mock',
      currentPeriodEnd: event.currentPeriodEnd ?? existing?.currentPeriodEnd ?? null,
      providerSubscriptionId: existing?.providerSubscriptionId ?? `mock_sub_${event.userId}`,
      updatedAt: this.now(),
    });

    return { kind: 'applied', userId: event.userId, status: event.status };
  }

  async getSubscriptionStatus(userId: string): Promise<Entitlement | null> {
    return this.subs.get(userId) ?? null;
  }

  /* --- Nur für Tests: Zustände von außen herbeiführen --------------- */

  /** Ereignis erzeugen, wie es ein Anbieter schicken würde. */
  static event(e: MockEvent): { body: string; headers: Record<string, string> } {
    return {
      body: JSON.stringify(e),
      headers: { 'x-mock-signature': MOCK_SIGNATURE },
    };
  }

  /** Ereignis mit falscher Signatur – für den Angriffspfad. */
  static forgedEvent(e: MockEvent): { body: string; headers: Record<string, string> } {
    return {
      body: JSON.stringify(e),
      headers: { 'x-mock-signature': 'gefaelscht' },
    };
  }
}

export const MOCK_SIGNATURE = 'mock-signature-nur-fuer-entwicklung';

export interface MockEvent {
  id: string;
  userId: string;
  status: SubscriptionStatus;
  plan?: PlanId;
  currentPeriodEnd?: number;
}
