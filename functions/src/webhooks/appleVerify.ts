/* Signaturprüfung für App Store Server Notifications V2.
   ======================================================

   Apple schickt seine Benachrichtigungen als **JWS** (JSON Web Signature) im
   Format `header.payload.signature`, signiert mit ES256. Anders als bei Stripe
   gibt es kein gemeinsames Geheimnis: Die Echtheit hängt an einer
   Zertifikatskette, die bis zur **Apple Root CA G3** zurückreicht.

   Der Kopf enthält dafür ein Feld `x5c` – eine Liste von Zertifikaten,
   base64-kodiert, in der Reihenfolge:

       x5c[0] = Blatt        (mit dem tatsächlich signiert wurde)
       x5c[1] = Zwischen-CA  (von Apple)
       x5c[2] = Wurzel       (Apple Root CA G3)

   Was geprüft werden MUSS – und warum jeder Schritt zählt
   ------------------------------------------------------
   1. **Die Kette ist lückenlos.** Jedes Zertifikat muss vom nächsten
      ausgestellt sein. Ohne diese Prüfung könnte jemand eine eigene Kette
      mitschicken und alles Weitere sähe stimmig aus.
   2. **Die Wurzel ist WIRKLICH Apples.** Der Vergleich erfolgt gegen einen
      fest hinterlegten Fingerabdruck, nicht gegen das mitgeschickte
      Zertifikat – sonst prüfte man einen Ausweis gegen die Kopie, die der
      Ausweisinhaber selbst dazugelegt hat.
   3. **Kein Zertifikat ist abgelaufen.**
   4. **Die Signatur passt** zum Blatt-Zertifikat.
   5. **Die Nutzdaten gehören zu uns** (Bundle-ID), sonst könnte eine echte,
      korrekt signierte Benachrichtigung für eine FREMDE App bei uns Wirkung
      entfalten.

   Was hier fehlt und warum
   ------------------------
   Ein Sperrlisten-Abgleich (OCSP/CRL). Der bräuchte einen Netzaufruf pro
   Benachrichtigung. Apple selbst hält das für die Prüfung dieser
   Benachrichtigungen nicht für erforderlich; die kurze Laufzeit der
   Blatt-Zertifikate begrenzt das Risiko. Bewusst weggelassen, hier genannt.

   Prüfbarkeit heute
   -----------------
   Kein Apple-Konto vorhanden (BLOCKER.md, B-002). Die Tests erzeugen deshalb
   eine EIGENE Zertifikatskette mit denselben Eigenschaften und lassen die
   Prüfung darauf los. Damit ist die Logik belegt – Apples echte Schlüssel hat
   sie noch nie gesehen. */

import { createHash, createVerify, X509Certificate } from 'node:crypto';

/**
 * SHA-256-Fingerabdruck der Apple Root CA G3.
 *
 * Fest hinterlegt statt aus der Kette gelesen – das ist der Kern der ganzen
 * Prüfung. Ein Angreifer kann eine vollständige, in sich stimmige Kette
 * bauen; woran er scheitert, ist dieser Wert.
 *
 * TODO (Apple): Vor dem ersten Echtbetrieb gegen das Zertifikat von
 * https://www.apple.com/certificateauthority/ gegenprüfen. Der Wert unten ist
 * der öffentlich dokumentierte Fingerabdruck der Apple Root CA G3; er wird
 * hier nicht blind vertraut, sondern gehört einmal von Hand bestätigt.
 */
export const APPLE_ROOT_CA_G3_SHA256 =
  '63:34:3A:BF:B8:9A:6A:03:EB:B5:7E:9B:3F:5F:A7:BE:7C:4F:5C:75:6F:30:17:B3:A8:C4:88:C3:65:3E:91:79';

export type AppleVerifyResult =
  | { ok: true; payload: Record<string, unknown> }
  | { ok: false; reason: AppleVerifyFailure };

export type AppleVerifyFailure =
  | 'kein-jws'
  | 'kopf-unlesbar'
  | 'kette-fehlt'
  | 'kette-unlesbar'
  | 'kette-unterbrochen'
  | 'wurzel-unbekannt'
  | 'zertifikat-abgelaufen'
  | 'signatur-falsch'
  | 'nutzdaten-unlesbar'
  | 'fremde-app';

/** Optionen – alles übergeben statt intern ermittelt, damit prüfbar. */
export interface AppleVerifyOptions {
  /** Erwartete Bundle-ID. Fehlt sie, wird die Herkunft NICHT geprüft –
      nur für Tests zulässig. */
  expectedBundleId?: string;
  /** Zeitpunkt der Prüfung (ms). */
  now: number;
  /** Fingerabdruck der erwarteten Wurzel. Für Tests überschreibbar. */
  trustedRootFingerprint?: string;
}

function decodeBase64Url(part: string): Buffer {
  return Buffer.from(part.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
}

function parseJson(buf: Buffer): Record<string, unknown> | null {
  try {
    const v: unknown = JSON.parse(buf.toString('utf8'));
    return v && typeof v === 'object' ? (v as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/** SHA-256-Fingerabdruck eines Zertifikats im Format `AB:CD:…`. */
export function fingerprintOf(cert: X509Certificate): string {
  const der = cert.raw;
  const hash = createHash('sha256').update(der).digest('hex').toUpperCase();
  return (hash.match(/.{2}/g) ?? []).join(':');
}

/**
 * Prüft eine App-Store-Benachrichtigung und gibt die Nutzdaten zurück.
 *
 * Die Reihenfolge der Prüfungen ist bewusst gewählt: Erst die billigen
 * Formprüfungen, dann die Kette, dann die teure Signaturprüfung. Wer die
 * Signatur zuerst prüfte, würde bei jedem Unsinn unnötig rechnen – und das
 * ist eine öffentlich erreichbare Adresse.
 */
export function verifyAppleNotification(
  signedPayload: string,
  opts: AppleVerifyOptions,
): AppleVerifyResult {
  const parts = signedPayload.split('.');
  if (parts.length !== 3) return { ok: false, reason: 'kein-jws' };
  const [headerPart, payloadPart, signaturePart] = parts;

  const header = parseJson(decodeBase64Url(headerPart));
  if (!header) return { ok: false, reason: 'kopf-unlesbar' };

  const x5c = header.x5c;
  if (!Array.isArray(x5c) || x5c.length < 2) return { ok: false, reason: 'kette-fehlt' };

  let chain: X509Certificate[];
  try {
    chain = x5c.map((b64) => new X509Certificate(Buffer.from(String(b64), 'base64')));
  } catch {
    return { ok: false, reason: 'kette-unlesbar' };
  }

  // --- 1. Kette lückenlos? Jedes Glied muss vom nächsten ausgestellt sein.
  for (let i = 0; i < chain.length - 1; i++) {
    if (!chain[i].verify(chain[i + 1].publicKey)) {
      return { ok: false, reason: 'kette-unterbrochen' };
    }
  }

  // --- 2. Ist die Wurzel wirklich Apples? Gegen den FESTEN Wert, nicht gegen
  //        das mitgeschickte Zertifikat.
  const expectedRoot = opts.trustedRootFingerprint ?? APPLE_ROOT_CA_G3_SHA256;
  const root = chain[chain.length - 1];
  if (fingerprintOf(root) !== expectedRoot.toUpperCase()) {
    return { ok: false, reason: 'wurzel-unbekannt' };
  }

  // --- 3. Läuft noch jedes Zertifikat?
  for (const cert of chain) {
    const from = Date.parse(cert.validFrom);
    const to = Date.parse(cert.validTo);
    if (!Number.isFinite(from) || !Number.isFinite(to)) {
      return { ok: false, reason: 'zertifikat-abgelaufen' };
    }
    if (opts.now < from || opts.now > to) {
      return { ok: false, reason: 'zertifikat-abgelaufen' };
    }
  }

  // --- 4. Signatur gegen das Blatt prüfen.
  const leaf = chain[0];
  const signingInput = `${headerPart}.${payloadPart}`;
  const signature = decodeBase64Url(signaturePart);

  let signatureOk = false;
  try {
    const verifier = createVerify('SHA256');
    verifier.update(signingInput, 'utf8');
    verifier.end();
    /* Zwei Fallstricke, die beide zu „gültige Signatur wird abgelehnt" führen:

       1. ES256 liefert die Signatur im JOSE-Format (r||s, je 32 Byte). Node
          erwartet ohne Angabe DER – daher `dsaEncoding: 'ieee-p1363'`.
       2. `cert.publicKey` ist BEREITS ein öffentlicher Schlüssel. Ihn noch
          einmal durch createPublicKey() zu schicken wirft – und der Wurf
          landete hier im catch und sah aus wie eine falsche Signatur. */
    signatureOk = verifier.verify(
      { key: leaf.publicKey, dsaEncoding: 'ieee-p1363' },
      signature,
    );
  } catch {
    /* Hierher führt nur echter Unsinn (etwa ein Schlüsseltyp, mit dem sich
       gar nicht prüfen lässt). Ein Fehlschlag der Prüfung selbst liefert
       `false`, keine Ausnahme. */
    signatureOk = false;
  }
  if (!signatureOk) return { ok: false, reason: 'signatur-falsch' };

  // --- 5. Nutzdaten lesen und Herkunft prüfen.
  const payload = parseJson(decodeBase64Url(payloadPart));
  if (!payload) return { ok: false, reason: 'nutzdaten-unlesbar' };

  if (opts.expectedBundleId) {
    /* Eine echte, korrekt signierte Benachrichtigung für eine FREMDE App
       darf bei uns nichts bewirken. Die Bundle-ID steht je nach Ereignistyp
       an zwei Stellen. */
    const data = (payload.data ?? {}) as Record<string, unknown>;
    const bundleId = typeof data.bundleId === 'string' ? data.bundleId : payload.bundleId;
    if (bundleId !== opts.expectedBundleId) {
      return { ok: false, reason: 'fremde-app' };
    }
  }

  return { ok: true, payload };
}
