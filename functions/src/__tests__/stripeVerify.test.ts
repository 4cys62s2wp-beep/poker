import { describe, expect, it } from 'vitest';
import { createHmac } from 'node:crypto';
import {
  constantTimeEquals,
  DEFAULT_TOLERANCE_SECONDS,
  parseSignatureHeader,
  signForTest,
  verifyStripeSignature,
} from '../webhooks/stripeVerify';

const SECRET = 'whsec_testgeheimnis_nur_fuer_tests';
const BODY = '{"id":"evt_1","type":"customer.subscription.updated","data":{"object":{"id":"sub_1"}}}';
const NOW = 1_800_000_000; // Sekunden

describe('Kopfzeile zerlegen', () => {
  it('liest Zeitstempel und Signatur', () => {
    const p = parseSignatureHeader('t=123,v1=abc');
    expect(p.timestamp).toBe(123);
    expect(p.signatures).toEqual(['abc']);
  });

  it('nimmt mehrere Signaturen entgegen', () => {
    // Beim Schlüsselwechsel schickt Stripe für eine Übergangszeit zwei.
    const p = parseSignatureHeader('t=123,v1=abc,v1=def');
    expect(p.signatures).toEqual(['abc', 'def']);
  });

  it('ignoriert Unbekanntes, statt daran zu scheitern', () => {
    // Stripe darf die Kopfzeile erweitern, ohne uns zu brechen.
    const p = parseSignatureHeader('t=123,v0=alt,v1=abc,irgendwas=neu');
    expect(p.timestamp).toBe(123);
    expect(p.signatures).toEqual(['abc']);
  });

  it('verträgt Leerraum', () => {
    const p = parseSignatureHeader(' t=123 , v1=abc ');
    expect(p.timestamp).toBe(123);
    expect(p.signatures).toEqual(['abc']);
  });

  it('liefert leer bei Unsinn', () => {
    const p = parseSignatureHeader('völliger unsinn');
    expect(p.timestamp).toBeNull();
    expect(p.signatures).toEqual([]);
  });
});

describe('Signaturprüfung', () => {
  it('akzeptiert eine gültige Signatur', () => {
    const header = signForTest(BODY, SECRET, NOW);
    expect(verifyStripeSignature(BODY, header, SECRET, NOW)).toEqual({ ok: true, timestamp: NOW });
  });

  it('weist eine gefälschte Signatur ab', () => {
    // Der entscheidende Fall: Ohne diese Prüfung könnte jeder, der die
    // Webhook-Adresse kennt, sich selbst ein Abo eintragen.
    const header = `t=${NOW},v1=${'0'.repeat(64)}`;
    expect(verifyStripeSignature(BODY, header, SECRET, NOW)).toEqual({
      ok: false, reason: 'signatur-falsch',
    });
  });

  it('weist eine Signatur mit falschem Geheimnis ab', () => {
    const header = signForTest(BODY, 'falsches_geheimnis', NOW);
    expect(verifyStripeSignature(BODY, header, SECRET, NOW).ok).toBe(false);
  });

  it('erkennt jede Veränderung am Rumpf', () => {
    const header = signForTest(BODY, SECRET, NOW);
    const manipuliert = BODY.replace('sub_1', 'sub_boese');
    expect(verifyStripeSignature(manipuliert, header, SECRET, NOW).ok).toBe(false);
  });

  it('erkennt schon ein einzelnes zusätzliches Leerzeichen', () => {
    // Genau deshalb muss die Function den ROHTEXT durchreichen. Wer JSON
    // parst und neu serialisiert, macht die Prüfung wertlos.
    const header = signForTest(BODY, SECRET, NOW);
    expect(verifyStripeSignature(BODY + ' ', header, SECRET, NOW).ok).toBe(false);
  });

  it('nimmt die zweite von mehreren Signaturen an, wenn sie passt', () => {
    const gute = createHmac('sha256', SECRET).update(`${NOW}.${BODY}`).digest('hex');
    const header = `t=${NOW},v1=${'f'.repeat(64)},v1=${gute}`;
    expect(verifyStripeSignature(BODY, header, SECRET, NOW).ok).toBe(true);
  });

  it('lehnt ab, wenn die Kopfzeile fehlt', () => {
    expect(verifyStripeSignature(BODY, undefined, SECRET, NOW)).toEqual({
      ok: false, reason: 'kopfzeile-fehlt',
    });
  });

  it('lehnt ab, wenn Zeitstempel oder Signatur fehlen', () => {
    expect(verifyStripeSignature(BODY, `v1=${'a'.repeat(64)}`, SECRET, NOW).ok).toBe(false);
    expect(verifyStripeSignature(BODY, `t=${NOW}`, SECRET, NOW)).toEqual({
      ok: false, reason: 'signatur-fehlt',
    });
  });
});

describe('Zeitfenster', () => {
  it('lehnt einen zu alten Aufruf ab', () => {
    // Schutz gegen das Wiedereinspielen eines abgefangenen Aufrufs.
    const alt = NOW - DEFAULT_TOLERANCE_SECONDS - 1;
    const header = signForTest(BODY, SECRET, alt);
    expect(verifyStripeSignature(BODY, header, SECRET, NOW)).toEqual({ ok: false, reason: 'zu-alt' });
  });

  it('akzeptiert genau an der Grenze', () => {
    const grenze = NOW - DEFAULT_TOLERANCE_SECONDS;
    const header = signForTest(BODY, SECRET, grenze);
    expect(verifyStripeSignature(BODY, header, SECRET, NOW).ok).toBe(true);
  });

  it('lehnt auch einen Zeitstempel weit in der ZUKUNFT ab', () => {
    // Nur nach hinten zu prüfen wäre ein Fehler: Ein Aufruf mit einem
    // Zeitstempel im Jahr 2030 wäre sonst bis dahin gültig.
    const zukunft = NOW + DEFAULT_TOLERANCE_SECONDS + 1;
    const header = signForTest(BODY, SECRET, zukunft);
    expect(verifyStripeSignature(BODY, header, SECRET, NOW)).toEqual({ ok: false, reason: 'zu-alt' });
  });

  it('erlaubt ein eigenes Zeitfenster', () => {
    const alt = NOW - 1000;
    const header = signForTest(BODY, SECRET, alt);
    expect(verifyStripeSignature(BODY, header, SECRET, NOW, 2000).ok).toBe(true);
    expect(verifyStripeSignature(BODY, header, SECRET, NOW, 500).ok).toBe(false);
  });
});

describe('Vergleich ohne Zeitunterschied', () => {
  it('erkennt Gleichheit und Ungleichheit', () => {
    expect(constantTimeEquals('abc', 'abc')).toBe(true);
    expect(constantTimeEquals('abc', 'abd')).toBe(false);
  });

  it('stürzt bei unterschiedlicher Länge nicht ab', () => {
    // timingSafeEqual wirft bei ungleicher Länge – das muss abgefangen sein.
    expect(constantTimeEquals('kurz', 'deutlich laenger')).toBe(false);
    expect(constantTimeEquals('', 'x')).toBe(false);
  });

  it('verträgt leere Zeichenketten', () => {
    expect(constantTimeEquals('', '')).toBe(true);
  });
});
