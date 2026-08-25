/* Hält die doppelt geführten Typen synchron.
   ==========================================

   `functions/src/types.ts` und `src/lib/payments/provider.ts` beschreiben
   dasselbe Statusmodell. Doppelt geführt, weil `functions/` ein eigenes
   npm-Projekt mit eigenem Build ist (siehe Kopf von types.ts).

   Doppelte Wahrheit ohne Absicherung ist eine Zeitbombe: Wer eine Fassung
   ändert und die andere vergisst, bekommt eine Abweichung zwischen dem, was
   der Server entscheidet, und dem, was der Client anzeigt – genau in dem
   Bereich, in dem es um Geld geht. Dieser Test macht daraus einen roten
   Testlauf statt eines stillen Fehlers. */

import { describe, expect, it } from 'vitest';
import * as fn from '../types';
import * as client from '../../../src/lib/payments/provider';

/* TypeScript-Typen existieren zur Laufzeit nicht und lassen sich nicht
   vergleichen. Prüfbar sind die WERTE – und die tragen die eigentliche
   Bedeutung: Welche Zustände Zugang gewähren, welche sofort entziehen. */

describe('Statuslisten stimmen überein', () => {
  it('gewährt beidseitig dieselben Zustände Zugang', () => {
    expect([...fn.ACCESS_GRANTING_STATUSES].sort()).toEqual(
      [...client.ACCESS_GRANTING_STATUSES].sort(),
    );
  });

  it('entzieht beidseitig bei denselben Zuständen sofort', () => {
    expect([...fn.IMMEDIATE_REVOKE_STATUSES].sort()).toEqual(
      [...client.IMMEDIATE_REVOKE_STATUSES].sort(),
    );
  });
});

describe('grantsAccess entscheidet auf beiden Seiten gleich', () => {
  const NOW = Date.UTC(2026, 7, 25);
  const DAY = 86_400_000;

  const alle: fn.SubscriptionStatus[] = [
    'active', 'trialing', 'past_due', 'grace', 'canceled', 'expired', 'refunded', 'revoked',
  ];
  const enden: Array<number | null> = [null, NOW - DAY, NOW, NOW + DAY];

  it('liefert für jede Kombination aus Status und Laufzeitende dasselbe', () => {
    for (const status of alle) {
      for (const currentPeriodEnd of enden) {
        const e = {
          userId: 'u1',
          plan: 'monthly' as const,
          status,
          source: 'stripe' as const,
          currentPeriodEnd,
          providerSubscriptionId: 'sub_1',
          updatedAt: NOW,
        };
        expect(
          fn.grantsAccess(e, NOW),
          `Abweichung bei status=${status}, ende=${currentPeriodEnd}`,
        ).toBe(client.grantsAccess(e, NOW));
      }
    }
  });

  it('behandelt auch den leeren Fall gleich', () => {
    expect(fn.grantsAccess(null, NOW)).toBe(client.grantsAccess(null, NOW));
  });
});
