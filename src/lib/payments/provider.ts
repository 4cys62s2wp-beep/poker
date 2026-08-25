/* Zahlungs-Abstraktion: die einzige Stelle, an der es zwei Wege gibt.
   ================================================================

   Warum es diese Schicht gibt
   ---------------------------
   App-Store-Richtlinie 3.1.1: Digitale Inhalte, die IN der iOS-App
   freigeschaltet werden, müssen über StoreKit laufen. Stripe oder PayPal im
   iOS-Client bedeuten Ablehnung. Die Reader-App-Ausnahme greift für eine
   Lern-App nicht.

   Daraus folgt: zwei Zahlungswege, aber EIN Berechtigungsmodell. Welcher Weg
   benutzt wurde, darf nirgendwo sonst in der App eine Rolle spielen. Wer auf
   dem iPhone abschließt und sich später im Browser anmeldet, hat denselben
   Zugang – das entscheidet allein der Entitlement-Service, nicht der Provider.

   Was hier NICHT hingehört
   ------------------------
   Keine Preise, keine Feature-Aufteilung, keine Limits. Das steht in
   src/lib/pro/plan.ts und bleibt für beide Wege identisch. Diese Datei weiß
   nur, wie man einen Kauf anstößt und wie man einen Status erfährt.

   Sicherheitsgrenze
   -----------------
   `handleWebhook` läuft AUSSCHLIESSLICH serverseitig (Cloud Function). Die
   Signatur steht hier, damit Vertrag und Implementierung an einer Stelle
   beschrieben sind – der Client ruft sie nie auf und kann es auch nicht:
   Ohne Signaturgeheimnis ist jeder Aufruf wertlos. */

/** Welches Abo. Die Preise stehen bewusst nicht hier – sie unterscheiden sich
    je nach Weg (Apple behält 15–30 %) und je nach Land. */
export type PlanId = 'monthly' | 'annual';

/** Woher das Abo stammt. Wichtig für die Kündigung: Ein über Apple
    abgeschlossenes Abo kann NUR über Apple gekündigt werden – ein
    Kundenportal von Stripe würde ins Leere führen. */
export type EntitlementSource = 'stripe' | 'apple' | 'mock';

/* ------------------------------------------------------------------ *
 * Statusmodell
 * ------------------------------------------------------------------ */

/**
 * Die Zustände, die ein Abo annehmen kann. Bewusst providerunabhängig
 * benannt: Stripe und Apple beschreiben dasselbe mit anderen Worten, die
 * Übersetzung passiert in der jeweiligen Implementierung.
 *
 * - `active`      – bezahlt und gültig
 * - `trialing`    – kostenlose Testphase des Anbieters (nicht unsere eigene)
 * - `past_due`    – Zahlung fehlgeschlagen, Anbieter versucht es erneut.
 *                   Zugang bleibt zunächst offen (Kulanzfrist)
 * - `grace`       – Apple: „Billing Grace Period". Zugang bleibt offen
 * - `canceled`    – gekündigt; bis `currentPeriodEnd` bleibt der Zugang
 * - `expired`     – Laufzeit abgelaufen, kein Zugang
 * - `refunded`    – erstattet; Zugang endet SOFORT, ohne Restlaufzeit
 * - `revoked`     – Apple: Familienfreigabe entzogen o. Ä.; endet sofort
 */
export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'grace'
  | 'canceled'
  | 'expired'
  | 'refunded'
  | 'revoked';

/**
 * Welche Zustände Zugang gewähren.
 *
 * `past_due` und `grace` gewähren Zugang bewusst weiter: Eine abgelaufene
 * Kreditkarte ist ein Verwaltungsproblem, kein Grund, jemandem mitten im Lernen
 * die Tür zuzuschlagen. Beide Anbieter versuchen die Zahlung mehrfach; erst
 * wenn das endgültig scheitert, kommt `expired`.
 *
 * `canceled` gewährt ebenfalls Zugang – bis zum Ende der bezahlten Laufzeit.
 * Wer für den Monat bezahlt hat, bekommt den Monat.
 *
 * `refunded` und `revoked` enden dagegen sofort: Da ist das Geld zurück.
 */
export const ACCESS_GRANTING_STATUSES: readonly SubscriptionStatus[] = [
  'active',
  'trialing',
  'past_due',
  'grace',
  'canceled',
];

/** Endet der Zugang sofort, ohne Rücksicht auf die Restlaufzeit? */
export const IMMEDIATE_REVOKE_STATUSES: readonly SubscriptionStatus[] = [
  'refunded',
  'revoked',
];

/**
 * Der Berechtigungssatz eines Nutzers – die einzige Wahrheit über sein Abo.
 * Wird ausschließlich serverseitig geschrieben (siehe firestore.rules).
 */
export interface Entitlement {
  /** Firebase-uid. Verbindet iOS- und Web-Zugang zu einem Konto. */
  userId: string;
  plan: PlanId | null;
  status: SubscriptionStatus;
  source: EntitlementSource;
  /** Ende der bezahlten Laufzeit als Zeitstempel in Millisekunden.
      null = unbekannt (dann entscheidet allein der Status). */
  currentPeriodEnd: number | null;
  /** Kennung beim Anbieter – für Rückfragen und zur Zuordnung von Webhooks. */
  providerSubscriptionId: string | null;
  /** Wann dieser Satz zuletzt geändert wurde (ms). */
  updatedAt: number;
}

/**
 * Gewährt dieser Berechtigungssatz gerade Zugang?
 *
 * Reine Funktion mit übergebener Zeit – niemals `Date.now()` im Innern, sonst
 * wäre sie nicht prüfbar. Diese Funktion läuft auf dem Server als letzte
 * Instanz UND im Client für die Anzeige. Dass beide Seiten dieselbe Funktion
 * benutzen, ist Absicht: Es kann keine Abweichung zwischen dem geben, was der
 * Nutzer sieht, und dem, was er darf.
 */
export function grantsAccess(e: Entitlement | null, now: number): boolean {
  if (!e) return false;
  if (IMMEDIATE_REVOKE_STATUSES.includes(e.status)) return false;
  if (!ACCESS_GRANTING_STATUSES.includes(e.status)) return false;
  // Laufzeitende zählt nur, wenn es überhaupt bekannt ist.
  if (e.currentPeriodEnd !== null && e.currentPeriodEnd <= now) return false;
  return true;
}

/* ------------------------------------------------------------------ *
 * Ergebnistypen
 * ------------------------------------------------------------------ */

/**
 * Was beim Anstoßen eines Kaufs herauskommt. Zwei Formen, weil die beiden
 * Wege grundverschieden funktionieren:
 *
 * - `redirect`: Stripe – der Browser geht zu einer Bezahlseite.
 * - `native`:   StoreKit – das Betriebssystem zeigt seinen eigenen Dialog,
 *               es gibt keine URL. Der Kauf ist danach entweder erfolgt oder
 *               abgebrochen; der Server erfährt es über die Benachrichtigung.
 */
export type CheckoutResult =
  | { kind: 'redirect'; url: string }
  | { kind: 'native'; completed: boolean }
  | { kind: 'error'; reason: CheckoutError };

export type CheckoutError =
  /** Nicht angemeldet – ohne Konto gibt es nichts zu verknüpfen. */
  | 'not-signed-in'
  /** Der Weg steht in dieser Umgebung nicht zur Verfügung. */
  | 'unavailable'
  /** Der Nutzer hat abgebrochen. */
  | 'cancelled'
  /** Netz oder Anbieter nicht erreichbar. */
  | 'network'
  /** Alles andere. */
  | 'failed';

/** Wie eine Kündigung abläuft. Auch hier zwei Formen. */
export type CancelResult =
  /** Web: Kundenportal öffnen (Stripe). */
  | { kind: 'redirect'; url: string }
  /** iOS: Apple verlangt, dass die Kündigung in den Systemeinstellungen
      passiert. Die App darf sie nicht selbst durchführen – sie kann nur
      dorthin führen. */
  | { kind: 'system-settings'; url: string }
  | { kind: 'error'; reason: CheckoutError };

/** Was ein Webhook bewirkt hat. Für Protokoll und Tests. */
export type WebhookResult =
  | { kind: 'applied'; userId: string; status: SubscriptionStatus }
  /** Ereignis war schon verarbeitet – Doppelzustellung, korrekt verworfen. */
  | { kind: 'duplicate'; eventId: string }
  /** Ereignis geht uns nichts an (z. B. ein Produkt, das wir nicht führen). */
  | { kind: 'ignored'; reason: string }
  /** Signatur ungültig. Der Aufruf wird verworfen und protokolliert. */
  | { kind: 'invalid-signature' };

/* ------------------------------------------------------------------ *
 * Der Vertrag
 * ------------------------------------------------------------------ */

export interface CheckoutRequest {
  userId: string;
  plan: PlanId;
  /** Wohin nach erfolgreichem Kauf (nur für den Weiterleitungs-Weg). */
  successUrl?: string;
  /** Wohin bei Abbruch. */
  cancelUrl?: string;
  /** Sprache für die Bezahlseite. */
  locale?: 'de' | 'en';
}

/**
 * Was jeder Zahlungsweg können muss.
 *
 * Wer eine neue Implementierung hinzufügt (PayPal, Google Play …), muss
 * NUR diese vier Methoden erfüllen. Weder das Frontend noch die
 * Berechtigungslogik erfahren davon.
 */
export interface PaymentProvider {
  /** Welcher Weg – für Protokoll und für die Kündigungs-Führung. */
  readonly source: EntitlementSource;

  /** Steht dieser Weg in der aktuellen Umgebung überhaupt zur Verfügung?
      StoreKit etwa nur in einer nativen iOS-Hülle, nie im Browser. */
  isAvailable(): boolean;

  /** Kauf anstoßen. */
  createCheckout(req: CheckoutRequest): Promise<CheckoutResult>;

  /** Kündigung anstoßen bzw. den Nutzer dorthin führen. */
  cancelSubscription(userId: string): Promise<CancelResult>;

  /**
   * Anbieter-Ereignis verarbeiten. NUR serverseitig.
   *
   * `rawBody` muss der unveränderte Rohtext sein – jede Umformung (auch
   * JSON.parse und zurück) macht die Signaturprüfung wertlos.
   */
  handleWebhook(rawBody: string, headers: Record<string, string>): Promise<WebhookResult>;

  /**
   * Status direkt beim Anbieter erfragen. Rückfallebene, wenn ein Webhook
   * verloren ging – der Normalfall ist, dass der Status aus dem
   * Entitlement-Dokument kommt.
   */
  getSubscriptionStatus(userId: string): Promise<Entitlement | null>;
}

/* ------------------------------------------------------------------ *
 * Auswahl des Weges
 * ------------------------------------------------------------------ */

/**
 * Welcher Weg gilt in dieser Umgebung?
 *
 * Bewusst eine reine Funktion mit übergebener Umgebung statt einer Abfrage
 * von `navigator` im Innern: So ist jede Kombination prüfbar, ohne einen
 * Browser vorzutäuschen.
 *
 * Regel: Läuft die App als native iOS-Hülle, gilt StoreKit – ohne Ausnahme.
 * Alles andere wäre ein Verstoß gegen 3.1.1.
 */
export interface RuntimeEnvironment {
  /** Läuft die App in einer nativen iOS-Hülle mit StoreKit-Brücke? */
  isNativeIos: boolean;
  /** Ist die Monetarisierung überhaupt eingeschaltet? */
  monetizationEnabled: boolean;
  /** Entwicklungsmodus: Mock-Weg erlauben. */
  useMock: boolean;
}

export type ProviderChoice = 'storekit' | 'stripe' | 'mock' | 'none';

export function chooseProvider(env: RuntimeEnvironment): ProviderChoice {
  if (!env.monetizationEnabled) return 'none';
  // Reihenfolge ist bedeutsam: iOS schlägt alles andere.
  if (env.isNativeIos) return 'storekit';
  if (env.useMock) return 'mock';
  return 'stripe';
}
