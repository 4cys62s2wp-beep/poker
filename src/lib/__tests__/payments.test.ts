import { describe, expect, it } from 'vitest';
import {
  ACCESS_GRANTING_STATUSES,
  chooseProvider,
  grantsAccess,
  IMMEDIATE_REVOKE_STATUSES,
  type Entitlement,
  type SubscriptionStatus,
} from '../payments/provider';
import { MockProvider } from '../payments/mock';

const NOW = Date.UTC(2026, 7, 25, 12, 0, 0);
const DAY = 86_400_000;

function ent(patch: Partial<Entitlement> = {}): Entitlement {
  return {
    userId: 'u1',
    plan: 'monthly',
    status: 'active',
    source: 'mock',
    currentPeriodEnd: NOW + 10 * DAY,
    providerSubscriptionId: 'sub_1',
    updatedAt: NOW,
    ...patch,
  };
}

describe('Zugangsentscheidung', () => {
  it('gewährt Zugang bei aktivem Abo', () => {
    expect(grantsAccess(ent(), NOW)).toBe(true);
  });

  it('verweigert Zugang ohne jeden Berechtigungssatz', () => {
    expect(grantsAccess(null, NOW)).toBe(false);
  });

  it('lässt bei fehlgeschlagener Zahlung den Zugang zunächst offen', () => {
    // Eine abgelaufene Karte ist ein Verwaltungsproblem, kein Grund,
    // jemandem mitten im Lernen die Tür zuzuschlagen.
    expect(grantsAccess(ent({ status: 'past_due' }), NOW)).toBe(true);
    expect(grantsAccess(ent({ status: 'grace' }), NOW)).toBe(true);
  });

  it('lässt nach der Kündigung bis zum Laufzeitende weiterlernen', () => {
    // Wer den Monat bezahlt hat, bekommt den Monat.
    expect(grantsAccess(ent({ status: 'canceled' }), NOW)).toBe(true);
  });

  it('sperrt nach Ablauf der bezahlten Laufzeit', () => {
    const abgelaufen = ent({ status: 'canceled', currentPeriodEnd: NOW - 1 });
    expect(grantsAccess(abgelaufen, NOW)).toBe(false);
  });

  it('sperrt bei Erstattung SOFORT, ohne Rücksicht auf die Restlaufzeit', () => {
    // Das Geld ist zurück – die Laufzeit spielt keine Rolle mehr.
    const erstattet = ent({ status: 'refunded', currentPeriodEnd: NOW + 300 * DAY });
    expect(grantsAccess(erstattet, NOW)).toBe(false);
  });

  it('sperrt bei Entzug sofort (z. B. Familienfreigabe zurückgezogen)', () => {
    const entzogen = ent({ status: 'revoked', currentPeriodEnd: NOW + 300 * DAY });
    expect(grantsAccess(entzogen, NOW)).toBe(false);
  });

  it('sperrt bei abgelaufenem Abo', () => {
    expect(grantsAccess(ent({ status: 'expired' }), NOW)).toBe(false);
  });

  it('vertraut ohne bekanntes Laufzeitende allein dem Status', () => {
    expect(grantsAccess(ent({ currentPeriodEnd: null }), NOW)).toBe(true);
    expect(grantsAccess(ent({ status: 'expired', currentPeriodEnd: null }), NOW)).toBe(false);
  });

  it('entscheidet genau am Ablaufzeitpunkt gegen den Zugang', () => {
    // Grenzfall bewusst festgelegt: <= gilt als abgelaufen.
    expect(grantsAccess(ent({ currentPeriodEnd: NOW }), NOW)).toBe(false);
    expect(grantsAccess(ent({ currentPeriodEnd: NOW + 1 }), NOW)).toBe(true);
  });

  it('deckt jeden möglichen Status ab – keiner fällt durchs Raster', () => {
    const alle: SubscriptionStatus[] = [
      'active', 'trialing', 'past_due', 'grace', 'canceled', 'expired', 'refunded', 'revoked',
    ];
    for (const s of alle) {
      const eingeordnet =
        ACCESS_GRANTING_STATUSES.includes(s) || IMMEDIATE_REVOKE_STATUSES.includes(s) || s === 'expired';
      expect(eingeordnet, `Status ${s} ist nirgends eingeordnet`).toBe(true);
    }
  });
});

describe('Auswahl des Zahlungswegs', () => {
  it('wählt gar nichts, solange die Monetarisierung aus ist', () => {
    expect(chooseProvider({ isNativeIos: false, monetizationEnabled: false, useMock: true })).toBe('none');
  });

  it('erzwingt auf iOS StoreKit – auch wenn Mock erlaubt wäre', () => {
    // App-Store-Richtlinie 3.1.1 lässt keine Ausnahme zu.
    expect(chooseProvider({ isNativeIos: true, monetizationEnabled: true, useMock: true })).toBe('storekit');
  });

  it('nimmt im Web den Mock, wenn er erlaubt ist', () => {
    expect(chooseProvider({ isNativeIos: false, monetizationEnabled: true, useMock: true })).toBe('mock');
  });

  it('nimmt im Web sonst Stripe', () => {
    expect(chooseProvider({ isNativeIos: false, monetizationEnabled: true, useMock: false })).toBe('stripe');
  });
});

describe('MockProvider', () => {
  function provider() {
    return new MockProvider({ now: () => NOW });
  }

  it('verweigert den Kauf ohne angemeldetes Konto', async () => {
    const p = provider();
    const res = await p.createCheckout({ userId: '', plan: 'monthly' });
    expect(res).toEqual({ kind: 'error', reason: 'not-signed-in' });
  });

  it('legt beim Kauf ein aktives Abo mit passender Laufzeit an', async () => {
    const p = provider();
    await p.createCheckout({ userId: 'u1', plan: 'annual' });
    const sub = await p.getSubscriptionStatus('u1');
    expect(sub?.status).toBe('active');
    expect(sub?.plan).toBe('annual');
    expect(sub?.currentPeriodEnd).toBe(NOW + 365 * DAY);
  });

  it('meldet einen Fehlschlag statt still zu scheitern', async () => {
    const p = new MockProvider({ now: () => NOW, failCheckout: true });
    const res = await p.createCheckout({ userId: 'u1', plan: 'monthly' });
    expect(res).toEqual({ kind: 'error', reason: 'failed' });
    expect(await p.getSubscriptionStatus('u1')).toBeNull();
  });

  it('lässt nach der Kündigung die Laufzeit stehen', async () => {
    const p = provider();
    await p.createCheckout({ userId: 'u1', plan: 'monthly' });
    await p.cancelSubscription('u1');
    const sub = await p.getSubscriptionStatus('u1');
    expect(sub?.status).toBe('canceled');
    expect(sub?.currentPeriodEnd).toBe(NOW + 30 * DAY);
    expect(grantsAccess(sub, NOW)).toBe(true);
  });

  it('weist ein Ereignis mit falscher Signatur ab', async () => {
    // Der wichtigste Pfad überhaupt: Ohne Signaturprüfung könnte sich jeder
    // ein Abo eintragen, indem er den Webhook selbst aufruft.
    const p = provider();
    const { body, headers } = MockProvider.forgedEvent({ id: 'e1', userId: 'u1', status: 'active' });
    expect(await p.handleWebhook(body, headers)).toEqual({ kind: 'invalid-signature' });
    expect(await p.getSubscriptionStatus('u1')).toBeNull();
  });

  it('wendet ein gültiges Ereignis an', async () => {
    const p = provider();
    const { body, headers } = MockProvider.event({
      id: 'e1', userId: 'u1', status: 'active', plan: 'monthly', currentPeriodEnd: NOW + 30 * DAY,
    });
    expect(await p.handleWebhook(body, headers)).toEqual({ kind: 'applied', userId: 'u1', status: 'active' });
    expect((await p.getSubscriptionStatus('u1'))?.status).toBe('active');
  });

  it('verwirft eine Doppelzustellung, ohne den Status erneut zu ändern', async () => {
    // Anbieter stellen bei Zeitüberschreitung erneut zu. Ohne Idempotenz
    // könnte ein zweiter Durchlauf einen inzwischen neueren Status
    // überschreiben.
    const p = provider();
    const erst = MockProvider.event({ id: 'e1', userId: 'u1', status: 'active' });
    await p.handleWebhook(erst.body, erst.headers);

    const zweit = MockProvider.event({ id: 'e2', userId: 'u1', status: 'canceled' });
    await p.handleWebhook(zweit.body, zweit.headers);

    // Jetzt kommt das ERSTE Ereignis noch einmal – es darf nichts bewirken.
    const res = await p.handleWebhook(erst.body, erst.headers);
    expect(res).toEqual({ kind: 'duplicate', eventId: 'e1' });
    expect((await p.getSubscriptionStatus('u1'))?.status).toBe('canceled');
  });

  it('ignoriert unbrauchbare Nachrichten, ohne zu stürzen', async () => {
    const p = provider();
    const h = { 'x-mock-signature': 'mock-signature-nur-fuer-entwicklung' };
    expect((await p.handleWebhook('kein json', h)).kind).toBe('ignored');
    expect((await p.handleWebhook('{}', h)).kind).toBe('ignored');
    expect((await p.handleWebhook('{"id":"e1"}', h)).kind).toBe('ignored');
  });

  it('führt einen vollständigen Lebenslauf durch', async () => {
    const p = provider();
    await p.createCheckout({ userId: 'u1', plan: 'monthly' });

    const schritte: Array<[SubscriptionStatus, boolean]> = [
      ['active', true],
      ['past_due', true],   // Zahlung scheitert – Zugang bleibt
      ['grace', true],      // Kulanzfrist – Zugang bleibt
      ['active', true],     // Karte erneuert
      ['canceled', true],   // gekündigt – bis Laufzeitende
      ['expired', false],   // Laufzeit vorbei
    ];

    for (const [i, [status, erwartet]] of schritte.entries()) {
      const ev = MockProvider.event({
        id: `ev${i}`, userId: 'u1', status, currentPeriodEnd: NOW + 30 * DAY,
      });
      await p.handleWebhook(ev.body, ev.headers);
      const sub = await p.getSubscriptionStatus('u1');
      expect(grantsAccess(sub, NOW), `nach ${status}`).toBe(erwartet);
    }
  });

  it('entzieht bei Erstattung sofort, obwohl Laufzeit übrig ist', async () => {
    const p = provider();
    await p.createCheckout({ userId: 'u1', plan: 'annual' });
    const ev = MockProvider.event({ id: 'r1', userId: 'u1', status: 'refunded' });
    await p.handleWebhook(ev.body, ev.headers);
    const sub = await p.getSubscriptionStatus('u1');
    expect(sub?.currentPeriodEnd).toBeGreaterThan(NOW); // Laufzeit steht noch
    expect(grantsAccess(sub, NOW)).toBe(false);         // Zugang trotzdem weg
  });

  it('hält die Abos zweier Nutzer sauber getrennt', async () => {
    const p = provider();
    await p.createCheckout({ userId: 'u1', plan: 'monthly' });
    const ev = MockProvider.event({ id: 'e1', userId: 'u2', status: 'refunded' });
    await p.handleWebhook(ev.body, ev.headers);
    expect((await p.getSubscriptionStatus('u1'))?.status).toBe('active');
    expect((await p.getSubscriptionStatus('u2'))?.status).toBe('refunded');
  });
});
