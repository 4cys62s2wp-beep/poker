/* Gemeinsame Typen zwischen Client und Funktionen.
   ================================================

   Die Definitionen spiegeln src/lib/payments/provider.ts. Bewusst kopiert
   statt importiert: `functions/` ist ein eigenes npm-Projekt mit eigenem
   Build und wird getrennt deployt – ein Import über die Projektgrenze hinweg
   würde entweder den Client-Code in das Funktions-Bündel ziehen oder eine
   gemeinsame Paketstruktur erzwingen, die für zwei Dateien nicht lohnt.

   DAMIT DAS NICHT AUSEINANDERLÄUFT: Ein Test vergleicht beide Fassungen
   Feld für Feld (functions/src/__tests__/types-parity.test.ts). Wer hier
   etwas ändert und dort nicht, bekommt einen roten Test. */

export type PlanId = 'monthly' | 'annual';

export type EntitlementSource = 'stripe' | 'apple' | 'mock';

export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'grace'
  | 'canceled'
  | 'expired'
  | 'refunded'
  | 'revoked';

export const ACCESS_GRANTING_STATUSES: readonly SubscriptionStatus[] = [
  'active',
  'trialing',
  'past_due',
  'grace',
  'canceled',
];

export const IMMEDIATE_REVOKE_STATUSES: readonly SubscriptionStatus[] = [
  'refunded',
  'revoked',
];

export interface Entitlement {
  userId: string;
  plan: PlanId | null;
  status: SubscriptionStatus;
  source: EntitlementSource;
  currentPeriodEnd: number | null;
  providerSubscriptionId: string | null;
  updatedAt: number;
}

/** Identisch zu grantsAccess() im Client – die letzte Instanz sitzt hier. */
export function grantsAccess(e: Entitlement | null, now: number): boolean {
  if (!e) return false;
  if (IMMEDIATE_REVOKE_STATUSES.includes(e.status)) return false;
  if (!ACCESS_GRANTING_STATUSES.includes(e.status)) return false;
  if (e.currentPeriodEnd !== null && e.currentPeriodEnd <= now) return false;
  return true;
}
