/* Firebase Cloud Functions – die dünnen Adapter.
   ==============================================

   Hier steht bewusst so wenig Logik wie möglich. Alles, was entscheidet,
   liegt in entitlement.ts und webhooks/ – geprüft durch Tests, die ohne
   Firebase laufen. Diese Datei tut nur drei Dinge: Anfrage entgegennehmen,
   Identität feststellen, Ergebnis zurückgeben.

   ACHTUNG – NOCH NICHT DEPLOYT
   ---------------------------
   Cloud Functions verlangen den Blaze-Tarif, der derzeit nicht verfügbar ist
   (BLOCKER.md, B-001). Dieser Code lässt sich lokal im Emulator ausführen:

       npx firebase-tools@15.28.1 emulators:start --only functions,firestore

   Zum Deployen ab Oktober: siehe RUNME.sh.

   WARUM DIESE DATEI NICHT IM NORMALEN TESTLAUF STECKT
   ---------------------------------------------------
   Sie importiert firebase-functions und firebase-admin. Beide sind hier
   absichtlich NICHT installiert (functions/ hat eine eigene package.json und
   wird getrennt gebaut). Der Testlauf des Hauptprojekts prüft deshalb die
   Logik, nicht die Verdrahtung – und bleibt dafür ohne jede Firebase-
   Abhängigkeit lauffähig. */

import { onRequest, onCall, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

import { applyEvent, type IdempotencyStore, type NormalizedEvent } from './entitlement';
import { grantsAccess, type Entitlement, type PlanId } from './types';
import { verifyStripeSignature } from './webhooks/stripeVerify';
import { verifyAppleNotification } from './webhooks/appleVerify';
import { normalizeStripeEvent, normalizeAppleEvent } from './webhooks/map';

/* ---------------- Geheimnisse ---------------- *
   Niemals im Quelltext. Gesetzt über
   `firebase functions:secrets:set NAME` (siehe RUNME.sh). */
const STRIPE_SECRET_KEY = defineSecret('STRIPE_SECRET_KEY');
const STRIPE_WEBHOOK_SECRET = defineSecret('STRIPE_WEBHOOK_SECRET');
const APPLE_BUNDLE_ID = defineSecret('APPLE_BUNDLE_ID');

/* Preis- und Produktkennungen. Keine Geheimnisse, aber projektabhängig.
   TODO: Nach dem Anlegen in Stripe bzw. App Store Connect eintragen. */
const STRIPE_PRICES = {
  monthly: process.env.STRIPE_PRICE_MONTHLY ?? '',
  annual: process.env.STRIPE_PRICE_ANNUAL ?? '',
};
const APPLE_PRODUCTS: Record<PlanId, string> = {
  monthly: 'com.pokermentor.pro.monthly',
  annual: 'com.pokermentor.pro.annual',
};

const REGION = 'europe-west3'; // Frankfurt – wie die Firestore-Datenbank

admin.initializeApp();
const db = admin.firestore();

/* ------------------------------------------------------------------ *
 * Speicher-Anbindung
 * ------------------------------------------------------------------ */

/** Gedächtnis für verarbeitete Ereignisse. Der Client kommt hier nicht heran
    (firestore.rules sperrt webhookEvents/ vollständig). */
const idempotency: IdempotencyStore = {
  async has(eventId) {
    const snap = await db.collection('webhookEvents').doc(eventId).get();
    return snap.exists;
  },
  async remember(eventId) {
    await db.collection('webhookEvents').doc(eventId).set({
      at: admin.firestore.FieldValue.serverTimestamp(),
    });
  },
};

async function readEntitlement(uid: string): Promise<Entitlement | null> {
  const snap = await db.collection('entitlements').doc(uid).get();
  return snap.exists ? (snap.data() as Entitlement) : null;
}

async function writeEntitlement(e: Entitlement): Promise<void> {
  await db.collection('entitlements').doc(e.userId).set(e);
}

/** Stripe-Kunde → unsere uid. Angelegt beim Erzeugen der Checkout-Session. */
async function uidForStripeCustomer(customerId: string): Promise<string | null> {
  const snap = await db.collection('providerLinks').doc(`stripe:${customerId}`).get();
  const uid = snap.exists ? (snap.data()?.uid as unknown) : null;
  return typeof uid === 'string' ? uid : null;
}

/** Apple-Transaktion → unsere uid. Angelegt beim ersten Kauf. */
async function uidForAppleTransaction(originalTransactionId: string): Promise<string | null> {
  const snap = await db.collection('providerLinks').doc(`apple:${originalTransactionId}`).get();
  const uid = snap.exists ? (snap.data()?.uid as unknown) : null;
  return typeof uid === 'string' ? uid : null;
}

/** Ein normalisiertes Ereignis anwenden und das Ergebnis speichern. */
async function persist(event: NormalizedEvent): Promise<string> {
  const stored = await readEntitlement(event.userId);
  const res = await applyEvent(stored, event, idempotency);
  if (res.kind === 'apply') {
    await writeEntitlement(res.entitlement);
    return `angewandt: ${res.entitlement.status}`;
  }
  return res.kind;
}

/* ------------------------------------------------------------------ *
 * Aufrufbare Funktionen (vom Client)
 * ------------------------------------------------------------------ */

/**
 * Berechtigungssatz lesen.
 *
 * Im Normalbetrieb liest der Client direkt aus Firestore (die Regeln erlauben
 * es). Diese Funktion ist die Rückfallebene, wenn ein Webhook verloren ging –
 * dann kann sie beim Anbieter nachfragen.
 */
export const getEntitlement = onCall({ region: REGION }, async (req) => {
  const uid = req.auth?.uid;
  if (!uid) throw new HttpsError('unauthenticated', 'Anmeldung erforderlich');
  const e = await readEntitlement(uid);
  return { entitlement: e, hasAccess: grantsAccess(e, Date.now()) };
});

/**
 * Stripe-Checkout anlegen.
 *
 * Die uid kommt aus dem GEPRÜFTEN Token, niemals aus der Anfrage. Käme sie
 * aus dem Client, könnte jeder ein Abo auf ein fremdes Konto buchen.
 */
export const createCheckoutSession = onCall(
  { region: REGION, secrets: [STRIPE_SECRET_KEY] },
  async (req) => {
    const uid = req.auth?.uid;
    if (!uid) throw new HttpsError('unauthenticated', 'Anmeldung erforderlich');

    const plan = req.data?.plan as PlanId | undefined;
    if (plan !== 'monthly' && plan !== 'annual') {
      throw new HttpsError('invalid-argument', 'Unbekannter Tarif');
    }
    const price = STRIPE_PRICES[plan];
    if (!price) throw new HttpsError('failed-precondition', 'Preis nicht konfiguriert');

    const stripe = new Stripe(STRIPE_SECRET_KEY.value());

    /* Kunden wiederverwenden, sonst entstehen bei jedem Anlauf neue Kunden
       und die Zuordnung zerfasert. */
    const existing = await db.collection('providerLinks')
      .where('uid', '==', uid).where('provider', '==', 'stripe').limit(1).get();
    let customerId = existing.empty ? null : (existing.docs[0].data()?.customerId as string);

    if (!customerId) {
      const customer = await stripe.customers.create({ metadata: { uid } });
      customerId = customer.id;
      await db.collection('providerLinks').doc(`stripe:${customerId}`).set({
        uid, provider: 'stripe', customerId,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price, quantity: 1 }],
      success_url: String(req.data?.successUrl ?? ''),
      cancel_url: String(req.data?.cancelUrl ?? ''),
      locale: req.data?.locale === 'en' ? 'en' : 'de',
    });

    return { url: session.url };
  },
);

/** Kundenportal öffnen (Kündigung, Zahlungsdaten, Rechnungen). */
export const createPortalSession = onCall(
  { region: REGION, secrets: [STRIPE_SECRET_KEY] },
  async (req) => {
    const uid = req.auth?.uid;
    if (!uid) throw new HttpsError('unauthenticated', 'Anmeldung erforderlich');

    const links = await db.collection('providerLinks')
      .where('uid', '==', uid).where('provider', '==', 'stripe').limit(1).get();
    if (links.empty) throw new HttpsError('not-found', 'Kein Stripe-Kunde hinterlegt');

    const stripe = new Stripe(STRIPE_SECRET_KEY.value());
    const session = await stripe.billingPortal.sessions.create({
      customer: links.docs[0].data()?.customerId as string,
      return_url: String(req.data?.returnUrl ?? ''),
    });
    return { url: session.url };
  },
);

/* ------------------------------------------------------------------ *
 * Webhooks (vom Anbieter)
 * ------------------------------------------------------------------ */

/**
 * Stripe-Webhook.
 *
 * `req.rawBody` ist zwingend: Der geparste und wieder serialisierte Rumpf
 * hätte eine andere Byte-Folge und damit eine andere Signatur.
 */
export const stripeWebhook = onRequest(
  { region: REGION, secrets: [STRIPE_WEBHOOK_SECRET] },
  async (req, res) => {
    const raw = req.rawBody?.toString('utf8') ?? '';
    const check = verifyStripeSignature(
      raw,
      req.header('stripe-signature'),
      STRIPE_WEBHOOK_SECRET.value(),
      Math.floor(Date.now() / 1000),
    );
    if (!check.ok) {
      // 400 statt 401: Stripe wiederholt bei 4xx nicht endlos.
      res.status(400).send(`Signatur abgelehnt: ${check.reason}`);
      return;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      res.status(400).send('Kein gültiges JSON');
      return;
    }

    const customerId = ((parsed as { data?: { object?: { customer?: unknown } } })
      ?.data?.object?.customer ?? '') as string;
    const uid = customerId ? await uidForStripeCustomer(customerId) : null;

    const event = normalizeStripeEvent(parsed as never, STRIPE_PRICES, () => uid);
    if (!event) {
      // 200: Das Ereignis geht uns nichts an – kein Grund für Wiederholungen.
      res.status(200).send('ignoriert');
      return;
    }

    res.status(200).send(await persist(event));
  },
);

/**
 * Apple App Store Server Notifications V2.
 *
 * Apple verschachtelt: Die Benachrichtigung ist ein JWS, und darin steckt
 * `signedTransactionInfo` als weiteres JWS. Beide werden mit derselben
 * Prüfung entpackt.
 */
export const appleWebhook = onRequest(
  { region: REGION, secrets: [APPLE_BUNDLE_ID] },
  async (req, res) => {
    const signedPayload = (req.body as { signedPayload?: unknown })?.signedPayload;
    if (typeof signedPayload !== 'string') {
      res.status(400).send('signedPayload fehlt');
      return;
    }

    const bundleId = APPLE_BUNDLE_ID.value();
    const outer = verifyAppleNotification(signedPayload, {
      now: Date.now(),
      expectedBundleId: bundleId,
    });
    if (!outer.ok) {
      res.status(400).send(`Signatur abgelehnt: ${outer.reason}`);
      return;
    }

    const data = (outer.payload.data ?? {}) as Record<string, unknown>;
    let transaction: Record<string, unknown> | null = null;
    if (typeof data.signedTransactionInfo === 'string') {
      // Die innere Transaktion trägt keine eigene Bundle-ID-Prüfung: Sie
      // steckt bereits in der äußeren, geprüften Benachrichtigung.
      const inner = verifyAppleNotification(data.signedTransactionInfo, { now: Date.now() });
      if (inner.ok) transaction = inner.payload;
    }

    const otx = typeof transaction?.originalTransactionId === 'string'
      ? transaction.originalTransactionId
      : '';
    const uid = otx ? await uidForAppleTransaction(otx) : null;

    const event = normalizeAppleEvent(
      outer.payload as never,
      transaction,
      APPLE_PRODUCTS,
      () => uid,
    );
    if (!event) {
      res.status(200).send('ignoriert');
      return;
    }

    res.status(200).send(await persist(event));
  },
);

/**
 * Verknüpft eine Apple-Transaktion mit dem angemeldeten Konto.
 *
 * Muss die iOS-App direkt nach einem Kauf aufrufen. Ohne diese Verknüpfung
 * kann der Webhook das Ereignis niemandem zuordnen und verwirft es.
 *
 * TODO (Apple): Die Transaktionskennung sollte zusätzlich gegen die App Store
 * Server API geprüft werden, damit niemand eine fremde Kennung auf sein Konto
 * bucht. Ohne Developer-Account nicht umsetzbar (BLOCKER.md, B-002).
 */
export const linkAppleTransaction = onCall({ region: REGION }, async (req) => {
  const uid = req.auth?.uid;
  if (!uid) throw new HttpsError('unauthenticated', 'Anmeldung erforderlich');
  const otx = req.data?.originalTransactionId;
  if (typeof otx !== 'string' || !otx) {
    throw new HttpsError('invalid-argument', 'originalTransactionId fehlt');
  }

  const ref = db.collection('providerLinks').doc(`apple:${otx}`);
  const existing = await ref.get();
  if (existing.exists && existing.data()?.uid !== uid) {
    // Schon einem anderen Konto zugeordnet – nicht überschreiben.
    throw new HttpsError('already-exists', 'Transaktion gehört zu einem anderen Konto');
  }
  await ref.set({ uid, provider: 'apple', originalTransactionId: otx });
  return { ok: true };
});
