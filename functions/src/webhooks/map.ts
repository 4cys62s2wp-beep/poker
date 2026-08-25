/* Übersetzung: Anbieter-Ereignis → unser normalisiertes Ereignis.
   ===============================================================

   Stripe und Apple beschreiben dasselbe mit völlig verschiedenen Worten.
   Hier – und nur hier – wird übersetzt. Ab der Statusmaschine
   (entitlement.ts) ist alles gleich.

   Alles reine Funktionen: Sie bekommen ein bereits GEPRÜFTES Ereignis (die
   Signaturprüfung ist vorher passiert) und geben ein normalisiertes zurück
   oder null, wenn uns das Ereignis nichts angeht. */

import type { NormalizedEvent } from '../entitlement';
import type { PlanId, SubscriptionStatus } from '../types';

/* ------------------------------------------------------------------ *
 * Stripe
 * ------------------------------------------------------------------ */

/**
 * Stripe-Abo-Status → unserer.
 *
 * `incomplete_expired` bedeutet: Die allererste Zahlung ist nie zustande
 * gekommen. Das ist kein Ablauf eines Abos, sondern ein Kauf, den es nie gab.
 * `expired` ist trotzdem richtig – Zugang gab es nie.
 */
export function mapStripeStatus(status: string): SubscriptionStatus | null {
  switch (status) {
    case 'active':
      return 'active';
    case 'trialing':
      return 'trialing';
    case 'past_due':
      return 'past_due';
    case 'unpaid':
      /* Stripe hat aufgegeben, die Zahlung einzutreiben. Anders als `past_due`
         ist das das Ende der Fahnenstange, nicht mehr die Kulanzfrist. */
      return 'expired';
    case 'canceled':
      return 'canceled';
    case 'incomplete':
      /* Erste Zahlung läuft noch (z. B. 3-D-Secure). Noch kein Zugang, aber
         auch kein Endzustand – wir warten auf das nächste Ereignis. */
      return null;
    case 'incomplete_expired':
      return 'expired';
    case 'paused':
      return 'expired';
    default:
      return null;
  }
}

/** Erkennt unsere beiden Tarife an der Stripe-Preis-Kennung. */
export interface StripePriceMap {
  monthly: string;
  annual: string;
}

export function mapStripePlan(priceId: string | null, prices: StripePriceMap): PlanId | null {
  if (!priceId) return null;
  if (priceId === prices.monthly) return 'monthly';
  if (priceId === prices.annual) return 'annual';
  return null;
}

/** Was wir aus einem Stripe-Ereignis brauchen – bewusst schmal gehalten. */
export interface StripeEventShape {
  id?: unknown;
  type?: unknown;
  created?: unknown;
  data?: { object?: Record<string, unknown> };
}

/**
 * Stripe-Ereignis normalisieren.
 *
 * @param uidLookup Ordnet eine Stripe-Kunden-Kennung unserer Firebase-uid zu.
 *   Diese Zuordnung entsteht beim Anlegen der Checkout-Session – die uid darf
 *   NIE aus dem Ereignis selbst kommen, sondern nur aus unserer eigenen
 *   Zuordnung. Sonst könnte ein Ereignis behaupten, für einen fremden Nutzer
 *   zu gelten.
 */
export function normalizeStripeEvent(
  event: StripeEventShape,
  prices: StripePriceMap,
  uidLookup: (customerId: string) => string | null,
): NormalizedEvent | null {
  const eventId = typeof event.id === 'string' ? event.id : '';
  const type = typeof event.type === 'string' ? event.type : '';
  if (!eventId || !type) return null;

  // Nur Abo-Ereignisse. Alles andere (Rechnungen, Zahlungsmethoden …) ignorieren.
  const relevant =
    type.startsWith('customer.subscription.') || type === 'charge.refunded';
  if (!relevant) return null;

  const obj = event.data?.object ?? {};
  const customerId = typeof obj.customer === 'string' ? obj.customer : '';
  if (!customerId) return null;

  const userId = uidLookup(customerId);
  if (!userId) return null;

  /* Stripe zählt in SEKUNDEN, wir in Millisekunden. Diese Verwechslung ist
     ein Klassiker – ein Laufzeitende von 1.7 Milliarden Millisekunden liegt
     im Januar 1970 und würde jeden Zugang sofort sperren. */
  const created = typeof event.created === 'number' ? event.created * 1000 : NaN;

  let status: SubscriptionStatus | null;
  if (type === 'charge.refunded') {
    status = 'refunded';
  } else {
    status = mapStripeStatus(typeof obj.status === 'string' ? obj.status : '');
  }
  if (!status) return null;

  const periodEndSec =
    typeof obj.current_period_end === 'number' ? obj.current_period_end : null;

  const items = obj.items as { data?: Array<{ price?: { id?: unknown } }> } | undefined;
  const priceId = items?.data?.[0]?.price?.id;

  return {
    eventId,
    userId,
    source: 'stripe',
    status,
    plan: mapStripePlan(typeof priceId === 'string' ? priceId : null, prices),
    currentPeriodEnd: periodEndSec !== null ? periodEndSec * 1000 : null,
    providerSubscriptionId: typeof obj.id === 'string' ? obj.id : null,
    occurredAt: created,
  };
}

/* ------------------------------------------------------------------ *
 * Apple
 * ------------------------------------------------------------------ */

/**
 * Apple-Benachrichtigungstyp (+ Untertyp) → unser Status.
 *
 * Apple trennt Typ und Untertyp; erst zusammen ergeben sie einen Sinn.
 * `DID_CHANGE_RENEWAL_STATUS` etwa heißt je nach Untertyp „gekündigt" oder
 * „Kündigung zurückgenommen" – das sind gegensätzliche Ereignisse.
 */
export function mapAppleNotification(
  notificationType: string,
  subtype: string | undefined,
): SubscriptionStatus | null {
  switch (notificationType) {
    case 'SUBSCRIBED':
    case 'DID_RENEW':
      return 'active';

    case 'OFFER_REDEEMED':
      return 'active';

    case 'DID_CHANGE_RENEWAL_STATUS':
      // AUTO_RENEW_DISABLED = gekündigt, läuft aber weiter bis zum Ende.
      // AUTO_RENEW_ENABLED  = Kündigung zurückgenommen.
      if (subtype === 'AUTO_RENEW_DISABLED') return 'canceled';
      if (subtype === 'AUTO_RENEW_ENABLED') return 'active';
      return null;

    case 'DID_FAIL_TO_RENEW':
      /* Ohne Untertyp: Zahlung fehlgeschlagen, Apple versucht es weiter.
         Mit GRACE_PERIOD: ausdrückliche Kulanzfrist. Beide behalten Zugang. */
      return subtype === 'GRACE_PERIOD' ? 'grace' : 'past_due';

    case 'EXPIRED':
      return 'expired';

    case 'GRACE_PERIOD_EXPIRED':
      return 'expired';

    case 'REFUND':
      return 'refunded';

    case 'REVOKE':
      // Familienfreigabe entzogen – Zugang endet sofort.
      return 'revoked';

    case 'REFUND_DECLINED':
    case 'REFUND_REVERSED':
      /* Erstattung abgelehnt bzw. zurückgenommen: Das Abo lebt wieder.
         Genau der Fall, für den isAllowedTransition() aus `refunded` heraus
         nur `active`/`trialing` zulässt. */
      return 'active';

    case 'CONSUMPTION_REQUEST':
    case 'RENEWAL_EXTENDED':
    case 'TEST':
      // Kein Statuswechsel. TEST schickt Apple beim Einrichten.
      return null;

    default:
      return null;
  }
}

export function mapApplePlan(productId: string, products: Record<PlanId, string>): PlanId | null {
  if (productId === products.monthly) return 'monthly';
  if (productId === products.annual) return 'annual';
  return null;
}

export interface AppleNotificationShape {
  notificationUUID?: unknown;
  notificationType?: unknown;
  subtype?: unknown;
  signedDate?: unknown;
  data?: Record<string, unknown>;
}

/**
 * Apple-Benachrichtigung normalisieren.
 *
 * @param uidLookup Ordnet die `originalTransactionId` unserer uid zu. Wie bei
 *   Stripe gilt: Die uid kommt aus unserer eigenen Zuordnung, nie aus dem
 *   Ereignis.
 * @param decodedTransaction Die bereits entschlüsselten Transaktionsdaten
 *   (Apple verschachtelt sie als weiteres JWS – die Function entpackt sie
 *   vorher mit derselben Prüfung).
 */
export function normalizeAppleEvent(
  notification: AppleNotificationShape,
  decodedTransaction: Record<string, unknown> | null,
  products: Record<PlanId, string>,
  uidLookup: (originalTransactionId: string) => string | null,
): NormalizedEvent | null {
  const eventId =
    typeof notification.notificationUUID === 'string' ? notification.notificationUUID : '';
  const type =
    typeof notification.notificationType === 'string' ? notification.notificationType : '';
  if (!eventId || !type) return null;

  const subtype = typeof notification.subtype === 'string' ? notification.subtype : undefined;
  const status = mapAppleNotification(type, subtype);
  if (!status) return null;

  const tx = decodedTransaction ?? {};
  const originalTransactionId =
    typeof tx.originalTransactionId === 'string' ? tx.originalTransactionId : '';
  if (!originalTransactionId) return null;

  const userId = uidLookup(originalTransactionId);
  if (!userId) return null;

  // Apple rechnet bereits in Millisekunden – anders als Stripe.
  const signedDate =
    typeof notification.signedDate === 'number' ? notification.signedDate : NaN;
  const expiresDate = typeof tx.expiresDate === 'number' ? tx.expiresDate : null;
  const productId = typeof tx.productId === 'string' ? tx.productId : '';

  return {
    eventId,
    userId,
    source: 'apple',
    status,
    plan: mapApplePlan(productId, products),
    currentPeriodEnd: expiresDate,
    providerSubscriptionId: originalTransactionId,
    occurredAt: signedDate,
  };
}
