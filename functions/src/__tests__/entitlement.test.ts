import { describe, expect, it } from 'vitest';
import {
  applyEvent,
  isAllowedTransition,
  isSourceSwitch,
  type IdempotencyStore,
  type NormalizedEvent,
} from '../entitlement';
import { grantsAccess, type Entitlement, type SubscriptionStatus } from '../types';

const T0 = Date.UTC(2026, 7, 25, 12, 0, 0);
const DAY = 86_400_000;

/** Gedächtnis für verarbeitete Ereignisse – im Betrieb eine Firestore-Sammlung. */
function memoryStore(): IdempotencyStore & { size: () => number } {
  const seen = new Set<string>();
  return {
    has: async (id) => seen.has(id),
    remember: async (id) => void seen.add(id),
    size: () => seen.size,
  };
}

function stored(patch: Partial<Entitlement> = {}): Entitlement {
  return {
    userId: 'u1',
    plan: 'monthly',
    status: 'active',
    source: 'stripe',
    currentPeriodEnd: T0 + 30 * DAY,
    providerSubscriptionId: 'sub_1',
    updatedAt: T0,
    ...patch,
  };
}

function event(patch: Partial<NormalizedEvent> = {}): NormalizedEvent {
  return {
    eventId: 'evt_1',
    userId: 'u1',
    source: 'stripe',
    status: 'active',
    plan: 'monthly',
    currentPeriodEnd: T0 + 30 * DAY,
    providerSubscriptionId: 'sub_1',
    occurredAt: T0 + 1000,
    ...patch,
  };
}

describe('Erstes Ereignis', () => {
  it('legt einen Berechtigungssatz an, wenn noch keiner existiert', async () => {
    const res = await applyEvent(null, event(), memoryStore());
    expect(res.kind).toBe('apply');
    if (res.kind !== 'apply') return;
    expect(res.entitlement.status).toBe('active');
    expect(res.entitlement.userId).toBe('u1');
    expect(res.entitlement.updatedAt).toBe(T0 + 1000);
  });

  it('verwirft Ereignisse ohne Kennung, Nutzer oder Zeitstempel', async () => {
    const s = memoryStore();
    expect((await applyEvent(null, event({ eventId: '' }), s)).kind).toBe('ignore');
    expect((await applyEvent(null, event({ userId: '' }), s)).kind).toBe('ignore');
    expect((await applyEvent(null, event({ occurredAt: NaN }), s)).kind).toBe('ignore');
    // Unbrauchbares darf nicht als „gesehen" vermerkt werden.
    expect(s.size()).toBe(0);
  });
});

describe('Idempotenz', () => {
  it('verwirft eine Doppelzustellung', async () => {
    const s = memoryStore();
    const e = event();
    await applyEvent(null, e, s);
    const zweite = await applyEvent(stored(), e, s);
    expect(zweite).toEqual({ kind: 'duplicate', eventId: 'evt_1' });
  });

  it('lässt einen späteren Zustand durch eine Doppelzustellung nicht zurückfallen', async () => {
    // Der wichtigste Fall: Anbieter stellen bei Zeitüberschreitung erneut zu.
    // Ohne Idempotenz würde ein wiederholtes „aktiv" eine spätere
    // Erstattung überschreiben – der Nutzer behielte den Zugang trotz
    // zurückgezahltem Geld.
    const s = memoryStore();
    const aktiv = event({ eventId: 'e_aktiv', status: 'active', occurredAt: T0 + 1000 });
    let ent = (await applyEvent(null, aktiv, s)) as { kind: 'apply'; entitlement: Entitlement };

    const erstattet = event({ eventId: 'e_refund', status: 'refunded', occurredAt: T0 + 2000 });
    ent = (await applyEvent(ent.entitlement, erstattet, s)) as typeof ent;
    expect(ent.entitlement.status).toBe('refunded');

    const nochmal = await applyEvent(ent.entitlement, aktiv, s);
    expect(nochmal.kind).toBe('duplicate');
    expect(grantsAccess(ent.entitlement, T0 + 3000)).toBe(false);
  });
});

describe('Reihenfolge', () => {
  it('ignoriert ein verspätet eingetroffenes älteres Ereignis', async () => {
    // Webhooks kommen nicht zuverlässig in der Reihenfolge an, in der sie
    // entstanden sind. Ein spät zugestelltes „gekündigt" darf ein neueres
    // „wieder aktiv" nicht überschreiben.
    const s = memoryStore();
    const jetzt = stored({ status: 'active', updatedAt: T0 + 5000 });
    const alt = event({ eventId: 'e_alt', status: 'canceled', occurredAt: T0 + 1000 });

    const res = await applyEvent(jetzt, alt, s);
    expect(res.kind).toBe('stale');
    if (res.kind === 'stale') {
      expect(res.storedAt).toBe(T0 + 5000);
      expect(res.eventAt).toBe(T0 + 1000);
    }
  });

  it('vermerkt auch ein veraltetes Ereignis als gesehen', async () => {
    // Sonst liefe jeder erneute Zustellversuch dieselbe Prüfung erneut.
    const s = memoryStore();
    await applyEvent(stored({ updatedAt: T0 + 5000 }), event({ occurredAt: T0 }), s);
    expect(s.size()).toBe(1);
  });

  it('lässt ein gleichzeitiges Ereignis durch', async () => {
    const res = await applyEvent(stored({ updatedAt: T0 }), event({ occurredAt: T0 }), memoryStore());
    expect(res.kind).toBe('apply');
  });
});

describe('Zulässige Übergänge', () => {
  it('erlaubt den gewöhnlichen Verlauf', () => {
    expect(isAllowedTransition('active', 'past_due')).toBe(true);
    expect(isAllowedTransition('past_due', 'active')).toBe(true);
    expect(isAllowedTransition('active', 'canceled')).toBe(true);
    expect(isAllowedTransition('canceled', 'expired')).toBe(true);
    expect(isAllowedTransition('grace', 'active')).toBe(true);
  });

  it('lässt aus einer Erstattung nur einen echten Neukauf herausführen', () => {
    // Sonst könnte eine verspätete Laufzeitverlängerung, die VOR der
    // Erstattung entstand, den Zugang zurückgeben.
    expect(isAllowedTransition('refunded', 'active')).toBe(true);
    expect(isAllowedTransition('refunded', 'trialing')).toBe(true);
    expect(isAllowedTransition('refunded', 'canceled')).toBe(false);
    expect(isAllowedTransition('refunded', 'past_due')).toBe(false);
    expect(isAllowedTransition('revoked', 'grace')).toBe(false);
  });

  it('erlaubt immer den Verbleib im selben Zustand', () => {
    const alle: SubscriptionStatus[] = [
      'active', 'trialing', 'past_due', 'grace', 'canceled', 'expired', 'refunded', 'revoked',
    ];
    for (const s of alle) expect(isAllowedTransition(s, s)).toBe(true);
  });

  it('weist einen unzulässigen Übergang ab, statt ihn anzuwenden', async () => {
    const s = memoryStore();
    const res = await applyEvent(
      stored({ status: 'refunded', updatedAt: T0 }),
      event({ status: 'past_due', occurredAt: T0 + 1000 }),
      s,
    );
    expect(res.kind).toBe('ignore');
    if (res.kind === 'ignore') expect(res.reason).toContain('nicht zulässig');
  });
});

describe('Beibehalten fehlender Angaben', () => {
  it('löscht ein bekanntes Laufzeitende nicht, wenn der Anbieter schweigt', async () => {
    const res = await applyEvent(
      stored({ currentPeriodEnd: T0 + 90 * DAY }),
      event({ currentPeriodEnd: null, occurredAt: T0 + 1000 }),
      memoryStore(),
    );
    expect(res.kind).toBe('apply');
    if (res.kind === 'apply') expect(res.entitlement.currentPeriodEnd).toBe(T0 + 90 * DAY);
  });

  it('behält Tarif und Abo-Kennung bei, wenn das Ereignis sie nicht nennt', async () => {
    const res = await applyEvent(
      stored({ plan: 'annual', providerSubscriptionId: 'sub_alt' }),
      event({ plan: null, providerSubscriptionId: null, occurredAt: T0 + 1000 }),
      memoryStore(),
    );
    if (res.kind !== 'apply') throw new Error('sollte angewandt werden');
    expect(res.entitlement.plan).toBe('annual');
    expect(res.entitlement.providerSubscriptionId).toBe('sub_alt');
  });
});

describe('Wechsel des Zahlungswegs', () => {
  it('erkennt einen Apple-Kauf bei bestehendem Stripe-Abo', () => {
    const s = stored({ source: 'stripe' });
    expect(isSourceSwitch(s, event({ source: 'apple', status: 'active' }))).toBe(true);
  });

  it('wertet ein Ende beim anderen Anbieter nicht als Wechsel', () => {
    const s = stored({ source: 'stripe' });
    expect(isSourceSwitch(s, event({ source: 'apple', status: 'expired' }))).toBe(false);
  });

  it('meldet keinen Wechsel beim selben Anbieter oder ohne Vorgeschichte', () => {
    expect(isSourceSwitch(stored({ source: 'stripe' }), event({ source: 'stripe' }))).toBe(false);
    expect(isSourceSwitch(null, event({ source: 'apple' }))).toBe(false);
  });

  it('übernimmt beim Wechsel die neue Herkunft', async () => {
    // Wichtig für die Kündigung: Wer über Apple gekauft hat, muss über Apple
    // kündigen – ein Stripe-Portal würde ins Leere führen.
    const res = await applyEvent(
      stored({ source: 'stripe' }),
      event({ source: 'apple', status: 'active', occurredAt: T0 + 1000 }),
      memoryStore(),
    );
    if (res.kind !== 'apply') throw new Error('sollte angewandt werden');
    expect(res.entitlement.source).toBe('apple');
  });
});

describe('Vollständiger Lebenslauf', () => {
  it('führt vom Kauf bis zum Ablauf und gewährt jeweils richtig Zugang', async () => {
    const s = memoryStore();
    let ent: Entitlement | null = null;

    const verlauf: Array<[string, SubscriptionStatus, boolean]> = [
      ['Kauf',                    'active',   true],
      ['Zahlung scheitert',       'past_due', true],  // Zugang bleibt
      ['Kulanzfrist',             'grace',    true],  // Zugang bleibt
      ['Karte erneuert',          'active',   true],
      ['Nutzer kündigt',          'canceled', true],  // bis Laufzeitende
      ['Laufzeit vorbei',         'expired',  false],
    ];

    for (const [i, [name, status, erwartet]] of verlauf.entries()) {
      const res = await applyEvent(
        ent,
        event({ eventId: `e${i}`, status, occurredAt: T0 + i * 1000 }),
        s,
      );
      expect(res.kind, name).toBe('apply');
      if (res.kind !== 'apply') return;
      ent = res.entitlement;
      expect(grantsAccess(ent, T0 + i * 1000), name).toBe(erwartet);
    }
  });

  it('entzieht bei Erstattung sofort, obwohl Laufzeit übrig ist', async () => {
    const s = memoryStore();
    const res = await applyEvent(
      stored({ currentPeriodEnd: T0 + 300 * DAY }),
      event({ status: 'refunded', currentPeriodEnd: null, occurredAt: T0 + 1000 }),
      s,
    );
    if (res.kind !== 'apply') throw new Error('sollte angewandt werden');
    expect(res.entitlement.currentPeriodEnd).toBe(T0 + 300 * DAY); // Laufzeit steht
    expect(grantsAccess(res.entitlement, T0 + 2000)).toBe(false);  // Zugang trotzdem weg
  });
});
