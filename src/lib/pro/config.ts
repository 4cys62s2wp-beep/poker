/* Monetarisierungs-Konfiguration.
   Liegt neben der index.html als monetization.json und wird mit
   `"enabled": false` ausgeliefert – die App verhält sich damit wie eine reine
   Gratis-Version, ohne Paywall, ohne Preise, ohne Upgrade-Hinweise.
   Siehe SETUP_PAYMENTS.md.

   Die Datei wird mitgeliefert, statt zu fehlen: Ein Ausschalter, der nur aus
   der Abwesenheit einer Datei besteht, ist unsichtbar – und erzeugte bei
   jedem Seitenaufruf einen 404 in der Konsole. Fehlt sie trotzdem (ältere
   Installation, Einzeldatei-Vorschau), bleibt die Monetarisierung ebenfalls
   aus. Beide Wege führen zum selben sicheren Ergebnis.

   `enabled` ist DER Schalter
   --------------------------
   Aktuell ist kein Feature kostenpflichtig (ENTSCHEIDUNGEN.md, E-009). Das
   ist kein Rückbau, sondern dieser eine Wert: Solange er `false` ist, liefert
   `checkAccess()` für jedes Feature `allowed`, und `usePro().fullAccess` ist
   wahr. Ihn umzulegen – zusammen mit einer erreichbaren `functionsBaseUrl` –
   schaltet das vollständig gebaute Gating wieder scharf.

   Nachgewiesen in `src/lib/__tests__/allesFrei.test.ts`: Der Test liest diese
   ausgelieferte Datei und prüft beide Richtungen. */

export interface MonetizationConfig {
  /** Master-Schalter. false = alles gratis (Standard ohne Datei). */
  enabled: boolean;
  /**
   * Basis-Adresse der Cloud Functions, z. B.
   * `https://europe-west3-pokermentor-9ac7f.cloudfunctions.net`.
   *
   * Hier stand früher ein fertiger Stripe-Payment-Link. Das war für eine
   * reine Web-App zulässig, ist aber in einem iOS-Bundle ein
   * Ablehnungsgrund nach App-Store-Richtlinie 3.1.1 – auch dann, wenn der
   * Link auf iOS nie angezeigt würde. Der Client kennt jetzt keine
   * Checkout-Adresse mehr, sondern lässt sich vom Server eine erzeugen.
   */
  functionsBaseUrl: string;
  /** Ob ein Jahresabo angeboten wird (Preis muss dann gesetzt sein). */
  hasAnnual: boolean;
  /** Anzeigepreise inkl. MwSt., z. B. "4,99 €". */
  priceMonthly: string;
  priceAnnual: string;
  /** Ersparnis-Hinweis beim Jahresabo, z. B. "2 Monate geschenkt". */
  annualNote?: string;
  /** Kontakt für Rechnungsfragen (erscheint auf der Upgrade-Seite). */
  supportEmail?: string;
}

export const MONETIZATION_OFF: MonetizationConfig = {
  enabled: false,
  functionsBaseUrl: '',
  hasAnnual: false,
  priceMonthly: '',
  priceAnnual: '',
};

function isHttpsUrl(v: unknown): v is string {
  return typeof v === 'string' && /^https:\/\/[^\s"'<>]{4,300}$/.test(v);
}

/** Validiert streng: nur https-Adressen, nur kurze Preistexte.
    Bei jedem Zweifel die sichere Antwort: Monetarisierung aus. */
export function parseConfig(input: unknown): MonetizationConfig {
  const c = (typeof input === 'object' && input !== null ? input : {}) as Record<string, unknown>;
  if (c.enabled !== true) return MONETIZATION_OFF;
  // Ohne erreichbare Funktionen gibt es keinen Kaufweg – dann lieber gar keine
  // Paywall zeigen als eine, die ins Leere führt.
  if (!isHttpsUrl(c.functionsBaseUrl)) return MONETIZATION_OFF;

  const text = (v: unknown, max = 40): string => (typeof v === 'string' ? v.slice(0, max) : '');
  const priceAnnual = text(c.priceAnnual);
  return {
    enabled: true,
    functionsBaseUrl: c.functionsBaseUrl.replace(/\/+$/, ''),
    hasAnnual: c.hasAnnual === true && priceAnnual.length > 0,
    priceMonthly: text(c.priceMonthly) || '4,99 €',
    priceAnnual,
    annualNote: text(c.annualNote, 60) || undefined,
    supportEmail: text(c.supportEmail, 120) || undefined,
  };
}

let promise: Promise<MonetizationConfig> | null = null;

export function loadMonetizationConfig(): Promise<MonetizationConfig> {
  if (!promise) promise = fetchConfig();
  return promise;
}

async function fetchConfig(): Promise<MonetizationConfig> {
  // Einzeldatei-Vorschau: keine Paywall.
  if (__SINGLE__) return MONETIZATION_OFF;
  try {
    const url = new URL('monetization.json', document.baseURI).toString();
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return MONETIZATION_OFF;
    return parseConfig(await res.json());
  } catch {
    return MONETIZATION_OFF;
  }
}
