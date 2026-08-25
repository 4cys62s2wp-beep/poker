import { describe, expect, it } from 'vitest';
import {
  mapAppleNotification,
  mapApplePlan,
  mapStripePlan,
  mapStripeStatus,
  normalizeAppleEvent,
  normalizeStripeEvent,
} from '../webhooks/map';

const PRICES = { monthly: 'price_monatlich', annual: 'price_jaehrlich' };
const PRODUCTS = { monthly: 'com.pokermentor.pro.monthly', annual: 'com.pokermentor.pro.annual' };

const uidFür = (map: Record<string, string>) => (key: string) => map[key] ?? null;

describe('Stripe-Status übersetzen', () => {
  it('bildet die geläufigen Zustände ab', () => {
    expect(mapStripeStatus('active')).toBe('active');
    expect(mapStripeStatus('trialing')).toBe('trialing');
    expect(mapStripeStatus('past_due')).toBe('past_due');
    expect(mapStripeStatus('canceled')).toBe('canceled');
  });

  it('trennt "Zahlung läuft noch" von "endgültig gescheitert"', () => {
    // past_due = Stripe versucht es weiter (Zugang bleibt).
    // unpaid    = Stripe hat aufgegeben (Zugang endet).
    expect(mapStripeStatus('past_due')).toBe('past_due');
    expect(mapStripeStatus('unpaid')).toBe('expired');
  });

  it('wartet bei einer noch laufenden Erstzahlung ab', () => {
    // incomplete: z. B. 3-D-Secure noch offen. Kein Zugang, aber auch kein
    // Endzustand – wir warten auf das nächste Ereignis.
    expect(mapStripeStatus('incomplete')).toBeNull();
    expect(mapStripeStatus('incomplete_expired')).toBe('expired');
  });

  it('gibt bei Unbekanntem null statt zu raten', () => {
    expect(mapStripeStatus('irgendwas_neues')).toBeNull();
    expect(mapStripeStatus('')).toBeNull();
  });
});

describe('Stripe-Tarif erkennen', () => {
  it('ordnet bekannte Preise zu', () => {
    expect(mapStripePlan('price_monatlich', PRICES)).toBe('monthly');
    expect(mapStripePlan('price_jaehrlich', PRICES)).toBe('annual');
  });

  it('gibt bei fremdem oder fehlendem Preis null', () => {
    expect(mapStripePlan('price_fremd', PRICES)).toBeNull();
    expect(mapStripePlan(null, PRICES)).toBeNull();
  });
});

describe('Stripe-Ereignis normalisieren', () => {
  const basis = {
    id: 'evt_1',
    type: 'customer.subscription.updated',
    created: 1_800_000_000, // Sekunden
    data: {
      object: {
        id: 'sub_1',
        customer: 'cus_1',
        status: 'active',
        current_period_end: 1_802_592_000, // Sekunden
        items: { data: [{ price: { id: 'price_monatlich' } }] },
      },
    },
  };

  it('rechnet Sekunden in Millisekunden um', () => {
    // Der Klassiker: Ein Laufzeitende von 1,8 Milliarden MILLISEKUNDEN läge
    // im Januar 1970 und würde jeden Zugang sofort sperren.
    const e = normalizeStripeEvent(basis, PRICES, uidFür({ cus_1: 'u1' }));
    expect(e?.occurredAt).toBe(1_800_000_000_000);
    expect(e?.currentPeriodEnd).toBe(1_802_592_000_000);
  });

  it('übernimmt Nutzer, Status, Tarif und Abo-Kennung', () => {
    const e = normalizeStripeEvent(basis, PRICES, uidFür({ cus_1: 'u1' }));
    expect(e?.userId).toBe('u1');
    expect(e?.status).toBe('active');
    expect(e?.plan).toBe('monthly');
    expect(e?.providerSubscriptionId).toBe('sub_1');
    expect(e?.source).toBe('stripe');
  });

  it('verwirft ein Ereignis, dessen Kunde uns unbekannt ist', () => {
    // Die uid kommt AUSSCHLIESSLICH aus unserer eigenen Zuordnung. Ohne
    // Treffer gibt es nichts anzuwenden – sonst könnte ein Ereignis
    // behaupten, für einen fremden Nutzer zu gelten.
    expect(normalizeStripeEvent(basis, PRICES, () => null)).toBeNull();
  });

  it('ignoriert Ereignisse, die keine Abos betreffen', () => {
    const rechnung = { ...basis, type: 'invoice.payment_succeeded' };
    expect(normalizeStripeEvent(rechnung, PRICES, uidFür({ cus_1: 'u1' }))).toBeNull();
  });

  it('macht aus einer Rückerstattung den Status refunded', () => {
    const refund = { ...basis, type: 'charge.refunded' };
    const e = normalizeStripeEvent(refund, PRICES, uidFür({ cus_1: 'u1' }));
    expect(e?.status).toBe('refunded');
  });

  it('verwirft Unvollständiges, statt zu raten', () => {
    const lookup = uidFür({ cus_1: 'u1' });
    expect(normalizeStripeEvent({ type: 'customer.subscription.updated' }, PRICES, lookup)).toBeNull();
    expect(normalizeStripeEvent({ id: 'evt_1' }, PRICES, lookup)).toBeNull();
    expect(normalizeStripeEvent({ ...basis, data: { object: {} } }, PRICES, lookup)).toBeNull();
  });

  it('kommt ohne Laufzeitende zurecht', () => {
    const ohne = {
      ...basis,
      data: { object: { ...basis.data.object, current_period_end: undefined } },
    };
    const e = normalizeStripeEvent(ohne, PRICES, uidFür({ cus_1: 'u1' }));
    expect(e?.currentPeriodEnd).toBeNull();
  });
});

describe('Apple-Benachrichtigung übersetzen', () => {
  it('erkennt Kauf und Verlängerung', () => {
    expect(mapAppleNotification('SUBSCRIBED', undefined)).toBe('active');
    expect(mapAppleNotification('DID_RENEW', undefined)).toBe('active');
  });

  it('unterscheidet Kündigung von Kündigungs-Rücknahme', () => {
    // Derselbe Typ, gegensätzliche Bedeutung – erst der Untertyp entscheidet.
    expect(mapAppleNotification('DID_CHANGE_RENEWAL_STATUS', 'AUTO_RENEW_DISABLED')).toBe('canceled');
    expect(mapAppleNotification('DID_CHANGE_RENEWAL_STATUS', 'AUTO_RENEW_ENABLED')).toBe('active');
    expect(mapAppleNotification('DID_CHANGE_RENEWAL_STATUS', undefined)).toBeNull();
  });

  it('unterscheidet Zahlungsversuch von ausdrücklicher Kulanzfrist', () => {
    expect(mapAppleNotification('DID_FAIL_TO_RENEW', undefined)).toBe('past_due');
    expect(mapAppleNotification('DID_FAIL_TO_RENEW', 'GRACE_PERIOD')).toBe('grace');
    expect(mapAppleNotification('GRACE_PERIOD_EXPIRED', undefined)).toBe('expired');
  });

  it('erkennt Erstattung und Entzug', () => {
    expect(mapAppleNotification('REFUND', undefined)).toBe('refunded');
    expect(mapAppleNotification('REVOKE', undefined)).toBe('revoked');
  });

  it('lässt eine abgelehnte Erstattung das Abo wiederbeleben', () => {
    // Genau der Fall, für den die Statusmaschine aus refunded heraus nur
    // active/trialing zulässt.
    expect(mapAppleNotification('REFUND_DECLINED', undefined)).toBe('active');
    expect(mapAppleNotification('REFUND_REVERSED', undefined)).toBe('active');
  });

  it('löst bei rein informativen Typen keinen Statuswechsel aus', () => {
    expect(mapAppleNotification('TEST', undefined)).toBeNull();
    expect(mapAppleNotification('CONSUMPTION_REQUEST', undefined)).toBeNull();
    expect(mapAppleNotification('RENEWAL_EXTENDED', undefined)).toBeNull();
  });

  it('gibt bei Unbekanntem null statt zu raten', () => {
    expect(mapAppleNotification('IRGENDWAS_NEUES', undefined)).toBeNull();
  });
});

describe('Apple-Tarif erkennen', () => {
  it('ordnet die Produkt-Kennungen zu', () => {
    expect(mapApplePlan(PRODUCTS.monthly, PRODUCTS)).toBe('monthly');
    expect(mapApplePlan(PRODUCTS.annual, PRODUCTS)).toBe('annual');
    expect(mapApplePlan('com.fremd.app', PRODUCTS)).toBeNull();
  });
});

describe('Apple-Ereignis normalisieren', () => {
  const nachricht = {
    notificationUUID: 'uuid-1',
    notificationType: 'DID_RENEW',
    signedDate: 1_800_000_000_000, // Apple rechnet bereits in Millisekunden
  };
  const transaktion = {
    originalTransactionId: 'otx_1',
    productId: PRODUCTS.annual,
    expiresDate: 1_831_536_000_000,
  };

  it('übernimmt die Angaben unverändert – Apple rechnet schon in Millisekunden', () => {
    const e = normalizeAppleEvent(nachricht, transaktion, PRODUCTS, uidFür({ otx_1: 'u1' }));
    expect(e?.occurredAt).toBe(1_800_000_000_000);
    expect(e?.currentPeriodEnd).toBe(1_831_536_000_000);
    expect(e?.plan).toBe('annual');
    expect(e?.source).toBe('apple');
    expect(e?.providerSubscriptionId).toBe('otx_1');
  });

  it('verwirft ein Ereignis ohne bekannte Zuordnung', () => {
    expect(normalizeAppleEvent(nachricht, transaktion, PRODUCTS, () => null)).toBeNull();
  });

  it('verwirft ein Ereignis ohne Transaktionsdaten', () => {
    expect(normalizeAppleEvent(nachricht, null, PRODUCTS, uidFür({ otx_1: 'u1' }))).toBeNull();
  });

  it('ignoriert eine Test-Benachrichtigung', () => {
    // Apple schickt sie beim Einrichten – sie darf keinen Status setzen.
    const test = { ...nachricht, notificationType: 'TEST' };
    expect(normalizeAppleEvent(test, transaktion, PRODUCTS, uidFür({ otx_1: 'u1' }))).toBeNull();
  });

  it('verwirft Unvollständiges', () => {
    const lookup = uidFür({ otx_1: 'u1' });
    expect(normalizeAppleEvent({ notificationType: 'DID_RENEW' }, transaktion, PRODUCTS, lookup)).toBeNull();
    expect(normalizeAppleEvent({ notificationUUID: 'u' }, transaktion, PRODUCTS, lookup)).toBeNull();
  });
});
