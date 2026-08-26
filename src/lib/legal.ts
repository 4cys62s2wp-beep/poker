/* Anbieterdaten für Impressum & Co.
   Kommen aus legal.json neben der index.html, die als leere Vorlage
   mitgeliefert wird. Solange die Felder leer sind, zeigt die App nur die
   Teile, die ohne persönliche Angaben korrekt sind (Datenschutz-Hinweise,
   Spielerschutz). Ein Impressum darf nicht erfunden werden – deshalb
   erscheint es erst, wenn die Daten wirklich hinterlegt sind, und ein
   unvollständiger Satz zählt als nicht hinterlegt.

   Fehlt die Datei ganz, gilt dasselbe. */

export interface LegalConfig {
  /** Vollständiger Name bzw. Firma des Anbieters. */
  provider: string;
  /** Straße und Hausnummer. */
  street: string;
  /** PLZ und Ort. */
  city: string;
  country: string;
  email: string;
  /** Optional: Telefon, USt-IdNr., Handelsregister, Vertretungsberechtigter. */
  phone?: string;
  vatId?: string;
  register?: string;
  represented?: string;
  /** Kleinunternehmer nach §19 UStG (dann kein MwSt.-Ausweis). */
  smallBusiness?: boolean;
}

function txt(v: unknown, max = 160): string {
  return typeof v === 'string' ? v.slice(0, max).trim() : '';
}

export function parseLegal(input: unknown): LegalConfig | null {
  const c = (typeof input === 'object' && input !== null ? input : {}) as Record<string, unknown>;
  const provider = txt(c.provider);
  const street = txt(c.street);
  const city = txt(c.city);
  const email = txt(c.email, 120);
  // Nur ein vollständiger Datensatz ist ein gültiges Impressum.
  if (!provider || !street || !city || !email.includes('@')) return null;
  return {
    provider,
    street,
    city,
    country: txt(c.country) || 'Deutschland',
    email,
    phone: txt(c.phone, 40) || undefined,
    vatId: txt(c.vatId, 40) || undefined,
    register: txt(c.register) || undefined,
    represented: txt(c.represented) || undefined,
    smallBusiness: c.smallBusiness === true,
  };
}

let promise: Promise<LegalConfig | null> | null = null;

export function loadLegalConfig(): Promise<LegalConfig | null> {
  if (!promise) promise = fetchLegal();
  return promise;
}

async function fetchLegal(): Promise<LegalConfig | null> {
  if (__SINGLE__) return null;
  try {
    const url = new URL('legal.json', document.baseURI).toString();
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    return parseLegal(await res.json());
  } catch {
    return null;
  }
}
