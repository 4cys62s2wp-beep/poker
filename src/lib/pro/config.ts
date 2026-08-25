/* Monetarisierungs-Konfiguration.
   Liegt neben der index.html als monetization.json. Fehlt die Datei, ist die
   Monetarisierung komplett aus – die App verhält sich wie eine reine
   Gratis-Version, ohne Paywall, ohne Preise, ohne Upgrade-Hinweise.
   Siehe MONETIZATION_SETUP.md. */

export interface MonetizationConfig {
  /** Master-Schalter. false = alles gratis (Standard ohne Datei). */
  enabled: boolean;
  /** Stripe-Payment-Link (oder anderer Checkout) für das Monatsabo. */
  checkoutMonthlyUrl: string;
  /** Checkout für das Jahresabo. */
  checkoutAnnualUrl: string;
  /** Kundenportal zum Kündigen/Zahlungsdaten ändern (Pflicht in DE). */
  portalUrl: string;
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
  checkoutMonthlyUrl: '',
  checkoutAnnualUrl: '',
  portalUrl: '',
  priceMonthly: '',
  priceAnnual: '',
};

function isHttpsUrl(v: unknown): v is string {
  return typeof v === 'string' && /^https:\/\/[^\s"'<>]{4,300}$/.test(v);
}

/** Validiert streng: nur https-URLs, nur kurze Preistexte. */
export function parseConfig(input: unknown): MonetizationConfig {
  const c = (typeof input === 'object' && input !== null ? input : {}) as Record<string, unknown>;
  if (c.enabled !== true) return MONETIZATION_OFF;
  if (!isHttpsUrl(c.checkoutMonthlyUrl) || !isHttpsUrl(c.portalUrl)) return MONETIZATION_OFF;

  const text = (v: unknown, max = 40): string => (typeof v === 'string' ? v.slice(0, max) : '');
  return {
    enabled: true,
    checkoutMonthlyUrl: c.checkoutMonthlyUrl,
    checkoutAnnualUrl: isHttpsUrl(c.checkoutAnnualUrl) ? c.checkoutAnnualUrl : '',
    portalUrl: c.portalUrl,
    priceMonthly: text(c.priceMonthly) || '4,99 €',
    priceAnnual: text(c.priceAnnual),
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
