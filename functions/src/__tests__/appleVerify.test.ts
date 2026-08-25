/* Prüft die Apple-Signaturprüfung mit einer SELBST ERZEUGTEN Kette.
   =================================================================

   Es gibt kein Apple-Developer-Konto (BLOCKER.md, B-002) und damit keine
   echten Apple-Zertifikate. Die Tests bauen deshalb eine eigene Kette mit
   denselben Eigenschaften: Wurzel → Zwischen-CA → Blatt, ES256 (P-256).

   Was das belegt: Die Prüflogik ist richtig – Kettenlücken, falsche Wurzel,
   abgelaufene Zertifikate, manipulierte Nutzdaten und fremde Bundle-IDs
   werden erkannt.

   Was das NICHT belegt: dass Apples echte Zertifikate und Formate durchgehen.
   Das ist erst mit dem echten Konto prüfbar und steht als Risiko in STATUS.md. */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createPrivateKey, createSign, X509Certificate } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { fingerprintOf, verifyAppleNotification, type AppleVerifyResult } from '../webhooks/appleVerify';

/** Grund eines Fehlschlags – oder null, wenn die Prüfung durchging.
    Grenzt die Union ein, statt sie mit `as` zu übergehen. */
function reasonOf(res: AppleVerifyResult): string | null {
  return res.ok ? null : res.reason;
}

const BUNDLE_ID = 'com.pokermentor.app';

let dir: string;
let chainB64: string[];      // Blatt, Zwischen, Wurzel – wie Apple es schickt
let leafKeyPem: string;
let rootFingerprint: string;
let NOW: number;

/** Führt openssl aus. Auf jedem System vorhanden, auf dem Node läuft. */
function ssl(args: string[]): void {
  execFileSync('openssl', args, { cwd: dir, stdio: 'pipe' });
}

function certToB64(file: string): string {
  const pem = readFileSync(join(dir, file), 'utf8');
  return pem.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
}

beforeAll(() => {
  dir = mkdtempSync(join(tmpdir(), 'apple-verify-'));

  // --- Wurzel -----------------------------------------------------------
  ssl(['ecparam', '-name', 'prime256v1', '-genkey', '-noout', '-out', 'root.key']);
  ssl(['req', '-new', '-x509', '-key', 'root.key', '-out', 'root.crt', '-days', '3650',
       '-subj', '/CN=Test Root CA', '-sha256']);

  // --- Zwischen-CA, von der Wurzel ausgestellt ---------------------------
  ssl(['ecparam', '-name', 'prime256v1', '-genkey', '-noout', '-out', 'inter.key']);
  ssl(['req', '-new', '-key', 'inter.key', '-out', 'inter.csr', '-subj', '/CN=Test Intermediate']);
  writeFileSync(join(dir, 'inter.ext'), 'basicConstraints=critical,CA:TRUE\n');
  ssl(['x509', '-req', '-in', 'inter.csr', '-CA', 'root.crt', '-CAkey', 'root.key',
       '-CAcreateserial', '-out', 'inter.crt', '-days', '1825', '-sha256',
       '-extfile', 'inter.ext']);

  // --- Blatt, von der Zwischen-CA ausgestellt ----------------------------
  ssl(['ecparam', '-name', 'prime256v1', '-genkey', '-noout', '-out', 'leaf.key']);
  ssl(['req', '-new', '-key', 'leaf.key', '-out', 'leaf.csr', '-subj', '/CN=Test Leaf']);
  ssl(['x509', '-req', '-in', 'leaf.csr', '-CA', 'inter.crt', '-CAkey', 'inter.key',
       '-CAcreateserial', '-out', 'leaf.crt', '-days', '365', '-sha256']);

  // --- Eine zweite, fremde Wurzel für den Angriffspfad -------------------
  ssl(['ecparam', '-name', 'prime256v1', '-genkey', '-noout', '-out', 'evil.key']);
  ssl(['req', '-new', '-x509', '-key', 'evil.key', '-out', 'evil.crt', '-days', '3650',
       '-subj', '/CN=Angreifer Root', '-sha256']);

  chainB64 = [certToB64('leaf.crt'), certToB64('inter.crt'), certToB64('root.crt')];
  leafKeyPem = readFileSync(join(dir, 'leaf.key'), 'utf8');
  rootFingerprint = fingerprintOf(new X509Certificate(readFileSync(join(dir, 'root.crt'))));
  NOW = Date.now();
});

afterAll(() => {
  rmSync(dir, { recursive: true, force: true });
});

function b64url(buf: Buffer | string): string {
  return Buffer.from(buf).toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Baut eine gültige Benachrichtigung – so wie Apple sie schicken würde. */
function makeJws(
  payload: Record<string, unknown>,
  opts: { chain?: string[]; keyPem?: string } = {},
): string {
  const header = { alg: 'ES256', x5c: opts.chain ?? chainB64 };
  const h = b64url(JSON.stringify(header));
  const p = b64url(JSON.stringify(payload));
  const signer = createSign('SHA256');
  signer.update(`${h}.${p}`, 'utf8');
  signer.end();
  const sig = signer.sign({
    key: createPrivateKey(opts.keyPem ?? leafKeyPem),
    dsaEncoding: 'ieee-p1363',
  });
  return `${h}.${p}.${b64url(sig)}`;
}

const gültigeNutzdaten = {
  notificationType: 'DID_RENEW',
  data: { bundleId: BUNDLE_ID, signedTransactionInfo: 'xyz' },
};

function verify(jws: string, over: Partial<Parameters<typeof verifyAppleNotification>[1]> = {}) {
  return verifyAppleNotification(jws, {
    now: NOW,
    expectedBundleId: BUNDLE_ID,
    trustedRootFingerprint: rootFingerprint,
    ...over,
  });
}

describe('Gültige Benachrichtigung', () => {
  it('wird angenommen und liefert die Nutzdaten', () => {
    const res = verify(makeJws(gültigeNutzdaten));
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.payload.notificationType).toBe('DID_RENEW');
  });
});

describe('Form', () => {
  it('weist alles ab, was kein JWS ist', () => {
    expect(reasonOf(verify('unsinn'))).toBe('kein-jws');
    expect(reasonOf(verify('a.b'))).toBe('kein-jws');
    expect(reasonOf(verify(''))).toBe('kein-jws');
  });

  it('weist einen unlesbaren Kopf ab', () => {
    expect(reasonOf(verify('!!!.abc.def'))).toBe('kopf-unlesbar');
  });

  it('weist eine fehlende Zertifikatskette ab', () => {
    const h = b64url(JSON.stringify({ alg: 'ES256' }));
    expect(reasonOf(verify(`${h}.${b64url('{}')}.sig`))).toBe('kette-fehlt');
  });

  it('weist eine zu kurze Kette ab', () => {
    const h = b64url(JSON.stringify({ alg: 'ES256', x5c: [chainB64[0]] }));
    expect(reasonOf(verify(`${h}.${b64url('{}')}.sig`))).toBe('kette-fehlt');
  });

  it('weist unlesbare Zertifikate ab', () => {
    const h = b64url(JSON.stringify({ alg: 'ES256', x5c: ['kein-zertifikat', 'auch-nicht'] }));
    expect(reasonOf(verify(`${h}.${b64url('{}')}.sig`))).toBe('kette-unlesbar');
  });
});

describe('Zertifikatskette', () => {
  it('erkennt eine unterbrochene Kette', () => {
    // Blatt und Wurzel ohne die Zwischen-CA: Das Blatt ist nicht von der
    // Wurzel ausgestellt, die Kette hat ein Loch.
    const kaputt = [chainB64[0], chainB64[2]];
    expect(reasonOf(verify(makeJws(gültigeNutzdaten, { chain: kaputt })))).toBe('kette-unterbrochen');
  });

  it('weist eine fremde Wurzel ab, obwohl die Kette in sich stimmt', () => {
    // Der Kern der ganzen Prüfung: Ein Angreifer kann eine vollständige,
    // in sich schlüssige Kette bauen. Woran er scheitert, ist der fest
    // hinterlegte Fingerabdruck.
    const res = verify(makeJws(gültigeNutzdaten), {
      trustedRootFingerprint: 'AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99',
    });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.reason).toBe('wurzel-unbekannt');
  });

  it('weist ein noch nicht gültiges Zertifikat ab', () => {
    const res = verify(makeJws(gültigeNutzdaten), { now: NOW - 10 * 365 * 86_400_000 });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.reason).toBe('zertifikat-abgelaufen');
  });

  it('weist ein abgelaufenes Zertifikat ab', () => {
    const res = verify(makeJws(gültigeNutzdaten), { now: NOW + 10 * 365 * 86_400_000 });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.reason).toBe('zertifikat-abgelaufen');
  });
});

describe('Signatur', () => {
  it('erkennt eine Signatur mit dem falschen Schlüssel', () => {
    const fremderSchlüssel = readFileSync(join(dir, 'evil.key'), 'utf8');
    const res = verify(makeJws(gültigeNutzdaten, { keyPem: fremderSchlüssel }));
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.reason).toBe('signatur-falsch');
  });

  it('erkennt manipulierte Nutzdaten', () => {
    // Der wichtigste Angriff: gültige Benachrichtigung abfangen, Inhalt
    // ändern (z. B. "abgelaufen" zu "verlängert"), weiterschicken.
    const echt = makeJws(gültigeNutzdaten);
    const [h, , s] = echt.split('.');
    const gefälscht = b64url(JSON.stringify({
      notificationType: 'DID_RENEW',
      data: { bundleId: BUNDLE_ID, gefälscht: true },
    }));
    const res = verify(`${h}.${gefälscht}.${s}`);
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.reason).toBe('signatur-falsch');
  });

  it('erkennt eine ausgetauschte Signatur', () => {
    const echt = makeJws(gültigeNutzdaten);
    const [h, p] = echt.split('.');
    const res = verify(`${h}.${p}.${b64url(Buffer.alloc(64))}`);
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.reason).toBe('signatur-falsch');
  });
});

describe('Herkunft der App', () => {
  it('weist eine Benachrichtigung für eine FREMDE App ab', () => {
    // Sie ist echt und korrekt signiert – aber sie gehört einer anderen App.
    // Ohne diese Prüfung könnte sie bei uns Wirkung entfalten.
    const jws = makeJws({
      notificationType: 'DID_RENEW',
      data: { bundleId: 'com.jemand.anders' },
    });
    const res = verify(jws);
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.reason).toBe('fremde-app');
  });

  it('findet die Bundle-ID auch auf der obersten Ebene', () => {
    const jws = makeJws({ notificationType: 'TEST', bundleId: BUNDLE_ID });
    expect(verify(jws).ok).toBe(true);
  });

  it('prüft die Herkunft nicht, wenn keine erwartet wird', () => {
    const jws = makeJws({ notificationType: 'TEST', data: { bundleId: 'egal' } });
    expect(verify(jws, { expectedBundleId: undefined }).ok).toBe(true);
  });
});

describe('Fingerabdruck', () => {
  it('liefert das erwartete Format', () => {
    const fp = fingerprintOf(new X509Certificate(readFileSync(join(dir, 'root.crt'))));
    expect(fp).toMatch(/^([0-9A-F]{2}:){31}[0-9A-F]{2}$/);
  });

  it('unterscheidet zwei Zertifikate', () => {
    const a = fingerprintOf(new X509Certificate(readFileSync(join(dir, 'root.crt'))));
    const b = fingerprintOf(new X509Certificate(readFileSync(join(dir, 'evil.crt'))));
    expect(a).not.toBe(b);
  });
});
