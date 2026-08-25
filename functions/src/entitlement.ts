/* Entitlement-Statusmaschine – die einzige Wahrheit über den Abo-Zugang.
   ======================================================================

   Diese Datei ist bewusst FREI von Firebase, Stripe und Apple. Sie enthält
   nur Rechnung: „gegebener Zustand plus Ereignis ergibt neuen Zustand".

   Zwei Gründe dafür:

   1. **Prüfbarkeit heute.** Die Cloud Functions lassen sich derzeit nicht
      deployen (BLOCKER.md, B-001). Diese Logik läuft aber im normalen
      Testlauf mit – der wichtigste Teil ist damit belegt, nicht nur behauptet.

   2. **Es ist der gefährlichste Code im Projekt.** Hier entscheidet sich, wer
      bezahlt hat und wer Zugang bekommt. Ein Fehler ist entweder verschenktes
      Geld oder ein verärgerter zahlender Kunde. Solcher Code gehört in reine
      Funktionen, nicht verwoben mit Netzwerkaufrufen.

   Die dünnen Adapter, die Firebase und die Anbieter anbinden, liegen in
   index.ts und webhooks/. */

import type { Entitlement, PlanId, SubscriptionStatus, EntitlementSource } from './types';

/* ------------------------------------------------------------------ *
 * Das normalisierte Ereignis
 * ------------------------------------------------------------------ */

/**
 * Was ein Anbieter uns mitteilt, übersetzt in unsere Sprache.
 *
 * Stripe und Apple beschreiben dasselbe mit völlig verschiedenen Worten. Die
 * Übersetzung passiert in webhooks/stripeMap.ts bzw. webhooks/appleMap.ts –
 * ab hier ist alles gleich.
 */
export interface NormalizedEvent {
  /** Kennung des Ereignisses beim Anbieter. Grundlage der Idempotenz. */
  eventId: string;
  /** Wen es betrifft (Firebase-uid). */
  userId: string;
  source: EntitlementSource;
  status: SubscriptionStatus;
  plan: PlanId | null;
  /** Ende der bezahlten Laufzeit (ms) oder null, wenn der Anbieter nichts sagt. */
  currentPeriodEnd: number | null;
  providerSubscriptionId: string | null;
  /**
   * Wann das Ereignis beim Anbieter entstand (ms).
   *
   * Entscheidend für die Reihenfolge: Webhooks kommen nicht zuverlässig in
   * der Reihenfolge an, in der sie entstanden sind. Ohne diesen Zeitstempel
   * könnte ein verspätetes „gekündigt" ein neueres „wieder aktiv"
   * überschreiben – und ein zahlender Kunde stünde vor der Tür.
   */
  occurredAt: number;
}

/* ------------------------------------------------------------------ *
 * Das Ergebnis
 * ------------------------------------------------------------------ */

export type ApplyResult =
  /** Angewandt – so sieht der neue Berechtigungssatz aus. */
  | { kind: 'apply'; entitlement: Entitlement }
  /** Schon verarbeitet. Doppelzustellung, korrekt verworfen. */
  | { kind: 'duplicate'; eventId: string }
  /** Älter als der gespeicherte Stand – ignorieren, sonst Rückschritt. */
  | { kind: 'stale'; storedAt: number; eventAt: number }
  /** Geht uns nichts an oder ist unbrauchbar. */
  | { kind: 'ignore'; reason: string };

/** Was wir über bereits verarbeitete Ereignisse wissen müssen. */
export interface IdempotencyStore {
  /** Wurde dieses Ereignis schon angewandt? */
  has: (eventId: string) => Promise<boolean>;
  /** Als verarbeitet vermerken. */
  remember: (eventId: string) => Promise<void>;
}

/* ------------------------------------------------------------------ *
 * Die Übergangsregeln
 * ------------------------------------------------------------------ */

/**
 * Darf ein Zustand auf einen anderen folgen?
 *
 * Bewusst großzügig: Anbieter schicken Zustände auch mal in unerwarteter
 * Reihenfolge, und ein zu strenges Modell sperrt dann zahlende Kunden aus.
 * Verboten sind deshalb nur die Übergänge, die eine echte Rückabwicklung
 * ungeschehen machen würden.
 *
 * `refunded` und `revoked` sind Endzustände in einem wichtigen Sinn: Aus
 * ihnen führt nur ein NEUER Kauf heraus (`active`/`trialing`), nie ein
 * beiläufiges Statusereignis. Sonst könnte eine verspätete
 * „Laufzeit-Verlängerung", die vor der Erstattung entstand, den Zugang
 * zurückgeben, obwohl das Geld erstattet ist.
 */
export function isAllowedTransition(from: SubscriptionStatus, to: SubscriptionStatus): boolean {
  if (from === to) return true;
  if (from === 'refunded' || from === 'revoked') {
    return to === 'active' || to === 'trialing';
  }
  return true;
}

/**
 * Ereignis auf den gespeicherten Stand anwenden.
 *
 * Reihenfolge der Prüfungen ist bedeutsam:
 * 1. Pflichtfelder – Unbrauchbares gar nicht erst betrachten
 * 2. Idempotenz – doppelte Zustellung vor allem anderen abfangen
 * 3. Alter – ein verspätetes Ereignis darf nichts überschreiben
 * 4. Übergang – Rückabwicklung nicht rückgängig machen
 */
export async function applyEvent(
  stored: Entitlement | null,
  event: NormalizedEvent,
  seen: IdempotencyStore,
): Promise<ApplyResult> {
  if (!event.eventId) return { kind: 'ignore', reason: 'ohne Ereignis-Kennung' };
  if (!event.userId) return { kind: 'ignore', reason: 'ohne Nutzerzuordnung' };
  if (!Number.isFinite(event.occurredAt)) {
    return { kind: 'ignore', reason: 'ohne brauchbaren Zeitstempel' };
  }

  if (await seen.has(event.eventId)) {
    return { kind: 'duplicate', eventId: event.eventId };
  }

  if (stored && event.occurredAt < stored.updatedAt) {
    /* Verspätet eingetroffen. Nicht anwenden – aber trotzdem als gesehen
       vermerken, damit ein erneuter Zustellversuch nicht jedes Mal dieselbe
       Prüfung durchläuft. */
    await seen.remember(event.eventId);
    return { kind: 'stale', storedAt: stored.updatedAt, eventAt: event.occurredAt };
  }

  if (stored && !isAllowedTransition(stored.status, event.status)) {
    await seen.remember(event.eventId);
    return {
      kind: 'ignore',
      reason: `Übergang ${stored.status} → ${event.status} nicht zulässig`,
    };
  }

  const next: Entitlement = {
    userId: event.userId,
    plan: event.plan ?? stored?.plan ?? null,
    status: event.status,
    source: event.source,
    /* Ein Anbieter, der zum Laufzeitende nichts sagt, soll ein bekanntes
       Ende nicht löschen – deshalb der Rückgriff auf den gespeicherten Wert. */
    currentPeriodEnd: event.currentPeriodEnd ?? stored?.currentPeriodEnd ?? null,
    providerSubscriptionId:
      event.providerSubscriptionId ?? stored?.providerSubscriptionId ?? null,
    updatedAt: event.occurredAt,
  };

  await seen.remember(event.eventId);
  return { kind: 'apply', entitlement: next };
}

/* ------------------------------------------------------------------ *
 * Wechsel des Zahlungswegs
 * ------------------------------------------------------------------ */

/**
 * Was passiert, wenn jemand über Apple kauft und schon ein Stripe-Abo hat?
 *
 * Nicht theoretisch: Wer im Browser abschließt und später die iOS-App
 * installiert, kann dort versehentlich ein zweites Abo kaufen – Apple weiß
 * nichts vom ersten.
 *
 * Regel: Der zuletzt eingetroffene AKTIVE Kauf gewinnt und bestimmt die
 * Herkunft. Der Nutzer verliert dadurch keinen Zugang. Was er aber verliert,
 * ist Geld – deshalb muss die App genau hier warnen, bevor gekauft wird
 * (siehe SETUP_PAYMENTS.md, Abschnitt „Doppelte Abos vermeiden").
 *
 * Ein automatisches Stornieren des alten Abos wäre technisch möglich, wird
 * aber bewusst NICHT gemacht: Eine Software, die ungefragt fremde
 * Vertragsverhältnisse kündigt, ist ein Haftungsrisiko. Die App weist darauf
 * hin, entscheiden muss der Mensch.
 */
export function isSourceSwitch(stored: Entitlement | null, event: NormalizedEvent): boolean {
  if (!stored) return false;
  if (stored.source === event.source) return false;
  return event.status === 'active' || event.status === 'trialing';
}
