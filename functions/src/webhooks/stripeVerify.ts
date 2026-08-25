/* Signaturprüfung für Stripe-Webhooks.
   ====================================

   Warum eigenhändig statt `stripe.webhooks.constructEvent`?
   ---------------------------------------------------------
   Die Stripe-Bibliothek kann das natürlich – und im Produktivbetrieb wird sie
   auch benutzt (siehe index.ts). Diese Fassung existiert zusätzlich aus einem
   Grund: Sie hängt von nichts ab außer Node-Bordmitteln und ist deshalb HEUTE
   prüfbar, ohne dass ein Stripe-Konto oder das npm-Paket vorhanden sein muss.

   Das ist kein Selbstzweck. Ohne Signaturprüfung könnte jeder, der die
   Webhook-Adresse kennt, sich selbst ein Abo eintragen – ein einziger
   POST-Aufruf. Das ist die verwundbarste Stelle des ganzen Systems, und sie
   ungetestet zu lassen, wäre fahrlässig.

   Das Verfahren (von Stripe dokumentiert)
   ---------------------------------------
   Kopfzeile:  Stripe-Signature: t=1737894000,v1=abc123…,v1=def456…
   Signiert wird:  `${t}.${rawBody}`  per HMAC-SHA256 mit dem Webhook-Geheimnis.
   Gültig, wenn EINE der v1-Signaturen passt (Stripe schickt beim Schlüssel-
   wechsel mehrere) und der Zeitstempel nicht zu alt ist. */

import { createHmac, timingSafeEqual } from 'node:crypto';

/** Wie alt eine Signatur höchstens sein darf. Stripe empfiehlt fünf Minuten.
    Schützt gegen das Wiedereinspielen eines abgefangenen Aufrufs. */
export const DEFAULT_TOLERANCE_SECONDS = 300;

export type VerifyResult =
  | { ok: true; timestamp: number }
  | { ok: false; reason: VerifyFailure };

export type VerifyFailure =
  | 'kopfzeile-fehlt'
  | 'kopfzeile-unlesbar'
  | 'zeitstempel-fehlt'
  | 'zu-alt'
  | 'signatur-fehlt'
  | 'signatur-falsch';

interface ParsedHeader {
  timestamp: number | null;
  signatures: string[];
}

/** `t=123,v1=abc,v1=def` zerlegen. Unbekannte Bestandteile werden ignoriert –
    Stripe darf die Kopfzeile erweitern, ohne uns zu brechen. */
export function parseSignatureHeader(header: string): ParsedHeader {
  const out: ParsedHeader = { timestamp: null, signatures: [] };
  for (const part of header.split(',')) {
    const eq = part.indexOf('=');
    if (eq < 0) continue;
    const key = part.slice(0, eq).trim();
    const value = part.slice(eq + 1).trim();
    if (key === 't') {
      const n = Number(value);
      if (Number.isFinite(n) && n > 0) out.timestamp = n;
    } else if (key === 'v1' && value) {
      out.signatures.push(value);
    }
  }
  return out;
}

/**
 * Prüft die Signatur eines Stripe-Webhooks.
 *
 * @param rawBody UNVERÄNDERTER Rohtext des Aufrufs. Wer hier ein bereits
 *   geparstes und wieder serialisiertes Objekt übergibt, bekommt garantiert
 *   „signatur-falsch": Schon eine andere Reihenfolge der Felder oder ein
 *   anderes Zahlenformat ändert den Hash. Genau deshalb muss die Function
 *   den Rohtext durchreichen.
 * @param nowSeconds Zeit in Sekunden – übergeben statt intern ermittelt,
 *   damit auch der Ablauf prüfbar ist.
 */
export function verifyStripeSignature(
  rawBody: string,
  signatureHeader: string | undefined,
  secret: string,
  nowSeconds: number,
  toleranceSeconds: number = DEFAULT_TOLERANCE_SECONDS,
): VerifyResult {
  if (!signatureHeader) return { ok: false, reason: 'kopfzeile-fehlt' };

  const parsed = parseSignatureHeader(signatureHeader);
  if (parsed.timestamp === null && parsed.signatures.length === 0) {
    return { ok: false, reason: 'kopfzeile-unlesbar' };
  }
  if (parsed.timestamp === null) return { ok: false, reason: 'zeitstempel-fehlt' };
  if (parsed.signatures.length === 0) return { ok: false, reason: 'signatur-fehlt' };

  /* Zeitfenster in BEIDE Richtungen prüfen. Nur nach hinten zu schauen wäre
     ein Fehler: Ein Aufruf mit einem weit in der Zukunft liegenden
     Zeitstempel wäre sonst beliebig lange gültig. */
  const age = Math.abs(nowSeconds - parsed.timestamp);
  if (age > toleranceSeconds) return { ok: false, reason: 'zu-alt' };

  const expected = createHmac('sha256', secret)
    .update(`${parsed.timestamp}.${rawBody}`, 'utf8')
    .digest('hex');

  for (const candidate of parsed.signatures) {
    if (constantTimeEquals(expected, candidate)) {
      return { ok: true, timestamp: parsed.timestamp };
    }
  }
  return { ok: false, reason: 'signatur-falsch' };
}

/**
 * Vergleich ohne Zeitunterschied.
 *
 * Ein gewöhnliches `===` bricht beim ersten abweichenden Zeichen ab. Aus den
 * Laufzeitunterschieden lässt sich die richtige Signatur Zeichen für Zeichen
 * erraten – ein bekannter Angriff auf genau solche Prüfungen.
 */
export function constantTimeEquals(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  // timingSafeEqual verlangt gleiche Länge und verrät sie damit. Das ist
  // hinnehmbar: Die Länge einer Hex-SHA256 ist ohnehin bekannt.
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/** Erzeugt eine gültige Kopfzeile – ausschließlich für Tests. */
export function signForTest(rawBody: string, secret: string, timestamp: number): string {
  const sig = createHmac('sha256', secret).update(`${timestamp}.${rawBody}`, 'utf8').digest('hex');
  return `t=${timestamp},v1=${sig}`;
}
