/* Sicherheitstests der Firestore-Regeln (firestore.rules) gegen den echten
   Firestore-Emulator. Diese Regeln sind das EINZIGE, was Handkarten und
   Nutzerdaten schützt – sie hier zu prüfen ist wichtiger als jeder UI-Test.

   Laufen nicht mit `npm test`, weil sie Java und den Emulator brauchen:
       npm run test:rules
   Der Emulator wird dabei automatisch gestartet und wieder beendet. */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  collection,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

let env: RulesTestEnvironment;

/* Drei Testnutzer. `unverified` hat die E-Mail nicht bestätigt – die Regeln
   verlangen überall email_verified, das muss nachweisbar greifen. */
const ALICE = 'uid-alice';
const BOB = 'uid-bob';

function as(uid: string, verified = true) {
  return env
    .authenticatedContext(uid, { email: `${uid}@example.com`, email_verified: verified })
    .firestore();
}
function anon() {
  return env.unauthenticatedContext().firestore();
}

const CODE = 'ABC234';

/** Legt einen Tisch mit Alice als Gastgeber und Bob als Mitglied an –
    unter Umgehung der Regeln, damit der Ausgangszustand realistisch ist. */
async function seedTable() {
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    await setDoc(doc(db, 'tables', CODE), {
      code: CODE,
      hostUid: ALICE,
      createdAt: 1,
      updatedAt: 1,
      version: 1,
      phase: 'lobby',
      config: { startStack: 1000 },
      seats: [{ uid: ALICE, name: 'Alice', stack: 1000, joinedAt: 1 }],
      state: null,
      handNumber: 0,
      buttonUid: ALICE,
      seq: 0,
    });
    for (const uid of [ALICE, BOB]) {
      await setDoc(doc(db, 'tables', CODE, 'members', uid), {
        uid,
        name: uid,
        ready: false,
        lastSeen: Date.now(),
        joinedAt: 1,
        pending: null,
      });
    }
    // Alice hält AsKs, Bob hält 2c2d.
    await setDoc(doc(db, 'tables', CODE, 'private', ALICE), { handNumber: 1, cards: [51, 47] });
    await setDoc(doc(db, 'tables', CODE, 'private', BOB), { handNumber: 1, cards: [0, 13] });
  });
}

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: 'pokermentor-rules-test',
    firestore: {
      rules: readFileSync(resolve(__dirname, '../../../firestore.rules'), 'utf8'),
      host: '127.0.0.1',
      port: 8085,
    },
  });
});

afterAll(async () => {
  await env?.cleanup();
});

beforeEach(async () => {
  await env.clearFirestore();
});

describe('Lernfortschritt (users/{uid})', () => {
  it('lässt jeden seinen eigenen Stand lesen und schreiben', async () => {
    await assertSucceeds(setDoc(doc(as(ALICE), 'users', ALICE), { payload: '{}' }));
    await assertSucceeds(getDoc(doc(as(ALICE), 'users', ALICE)));
  });

  it('verweigert den Zugriff auf fremde Lernstände', async () => {
    await assertFails(getDoc(doc(as(BOB), 'users', ALICE)));
    await assertFails(setDoc(doc(as(BOB), 'users', ALICE), { payload: 'x' }));
  });

  it('sperrt nicht angemeldete Besucher komplett aus', async () => {
    await assertFails(getDoc(doc(anon(), 'users', ALICE)));
    await assertFails(setDoc(doc(anon(), 'users', ALICE), { payload: 'x' }));
  });

  it('sperrt aus, solange die E-Mail nicht bestätigt ist', async () => {
    const db = as(ALICE, false);
    await assertFails(getDoc(doc(db, 'users', ALICE)));
    await assertFails(setDoc(doc(db, 'users', ALICE), { payload: 'x' }));
  });
});

describe('Abo-Status (customers/{uid})', () => {
  it('darf gelesen, aber niemals selbst geschrieben werden', async () => {
    await assertSucceeds(getDoc(doc(as(ALICE), 'customers', ALICE)));
    // Der Kern der Paywall: Niemand trägt sich selbst ein aktives Abo ein.
    await assertFails(setDoc(doc(as(ALICE), 'customers', ALICE), { status: 'active' }));
  });

  it('verwehrt Einblick in fremde Abo-Daten', async () => {
    await assertFails(getDoc(doc(as(BOB), 'customers', ALICE)));
  });
});

describe('Handkarten (tables/{code}/private/{uid})', () => {
  beforeEach(seedTable);

  it('lässt jeden nur seine EIGENEN Karten lesen', async () => {
    await assertSucceeds(getDoc(doc(as(ALICE), 'tables', CODE, 'private', ALICE)));
    await assertSucceeds(getDoc(doc(as(BOB), 'tables', CODE, 'private', BOB)));
  });

  it('verwehrt einem Mitspieler die Karten des anderen', async () => {
    // Das ist die wichtigste Zusicherung der ganzen App.
    await assertFails(getDoc(doc(as(BOB), 'tables', CODE, 'private', ALICE)));
  });

  it('verwehrt sogar dem Gastgeber das Auslesen fremder Karten', async () => {
    // Das Gerät des Gastgebers kennt die Blätter beim Austeilen – aber aus der
    // Datenbank zurückholen kann es sie nicht.
    await assertFails(getDoc(doc(as(ALICE), 'tables', CODE, 'private', BOB)));
  });

  it('lässt nur den Gastgeber Karten austeilen', async () => {
    await assertSucceeds(
      setDoc(doc(as(ALICE), 'tables', CODE, 'private', BOB), { handNumber: 2, cards: [3, 4] }),
    );
    await assertFails(
      setDoc(doc(as(BOB), 'tables', CODE, 'private', BOB), { handNumber: 2, cards: [51, 47] }),
    );
  });
});

describe('Tischzustand (tables/{code})', () => {
  beforeEach(seedTable);

  it('lässt jeden mit dem Code den Tisch sehen', async () => {
    await assertSucceeds(getDoc(doc(as(BOB), 'tables', CODE)));
  });

  it('lässt nur den Gastgeber den Spielstand fortschreiben', async () => {
    await assertSucceeds(updateDoc(doc(as(ALICE), 'tables', CODE), { version: 2 }));
    await assertFails(updateDoc(doc(as(BOB), 'tables', CODE), { version: 2 }));
  });

  it('verhindert das Zurückrollen der Version', async () => {
    // Sonst wäre die optimistische Konflikterkennung wertlos.
    await assertFails(updateDoc(doc(as(ALICE), 'tables', CODE), { version: 1 }));
    await assertFails(updateDoc(doc(as(ALICE), 'tables', CODE), { version: 0 }));
  });

  it('lässt den Gastgeber die Gastgeberrolle nicht abgeben, solange er da ist', async () => {
    await assertFails(updateDoc(doc(as(ALICE), 'tables', CODE), { version: 2, hostUid: BOB }));
  });

  it('lässt nur den Gastgeber den Tisch löschen', async () => {
    await assertFails(deleteDoc(doc(as(BOB), 'tables', CODE)));
    await assertSucceeds(deleteDoc(doc(as(ALICE), 'tables', CODE)));
  });

  it('verwehrt beim Anlegen, sich als fremder Gastgeber einzutragen', async () => {
    const base = {
      code: 'XYZ789',
      createdAt: 1,
      updatedAt: 1,
      version: 1,
      phase: 'lobby',
      config: {},
      seats: [],
      state: null,
      handNumber: 0,
      buttonUid: null,
      seq: 0,
    };
    await assertFails(setDoc(doc(as(BOB), 'tables', 'XYZ789'), { ...base, hostUid: ALICE }));
    await assertSucceeds(setDoc(doc(as(BOB), 'tables', 'XYZ789'), { ...base, hostUid: BOB }));
  });
});

describe('Mitglieder (tables/{code}/members/{uid})', () => {
  beforeEach(seedTable);

  it('lässt niemanden im Namen eines anderen handeln', async () => {
    // Ohne diese Regel könnte jeder für jeden „Fold" anmelden.
    await assertFails(
      setDoc(doc(as(BOB), 'tables', CODE, 'members', ALICE), {
        uid: ALICE,
        name: 'Alice',
        ready: true,
        lastSeen: Date.now(),
        joinedAt: 1,
        pending: { handNumber: 1, seq: 0, action: 'fold' },
      }),
    );
  });

  it('lässt jeden seinen eigenen Zugwunsch setzen', async () => {
    await assertSucceeds(
      setDoc(doc(as(BOB), 'tables', CODE, 'members', BOB), {
        uid: BOB,
        name: 'Bob',
        ready: true,
        lastSeen: Date.now(),
        joinedAt: 1,
        pending: { handNumber: 1, seq: 0, action: 'call' },
      }),
    );
  });

  it('verhindert einen Herzschlag weit in der Zukunft', async () => {
    // Sonst könnte sich ein Client dauerhaft „anwesend" stellen und die
    // Übernahme durch einen anderen Spieler blockieren.
    await assertFails(
      setDoc(doc(as(BOB), 'tables', CODE, 'members', BOB), {
        uid: BOB,
        name: 'Bob',
        ready: false,
        lastSeen: Date.now() + 10 * 60 * 1000,
        joinedAt: 1,
        pending: null,
      }),
    );
  });
});

describe('Freunde und Anwesenheit', () => {
  it('verhindert das Durchblättern aller Freundescodes', async () => {
    // Einzelabruf mit bekanntem Code ja – Auflisten niemals.
    await assertFails(getDocs(collection(as(ALICE), 'friendCodes')));
  });

  it('lässt einen Freundescode nur auf das eigene Konto zeigen', async () => {
    await assertFails(setDoc(doc(as(ALICE), 'friendCodes', 'AAAA-1111'), { uid: BOB }));
    await assertSucceeds(setDoc(doc(as(ALICE), 'friendCodes', 'AAAA-1111'), { uid: ALICE }));
  });

  it('verhindert gefälschte Freundschaftsanfragen im fremden Namen', async () => {
    // Bob darf keine Anfrage einwerfen, die aussieht, als käme sie von Alice.
    await assertFails(
      setDoc(doc(as(BOB), 'social', 'uid-carol', 'requests', ALICE), {
        fromUid: ALICE,
        name: 'Alice',
        createdAt: serverTimestamp(),
      }),
    );
  });

  it('verwehrt den Blick in fremde Freundeslisten', async () => {
    await assertFails(getDocs(collection(as(BOB), 'social', ALICE, 'friends')));
  });

  it('zeigt den Online-Status nur Freunden', async () => {
    await assertFails(getDoc(doc(as(BOB), 'presence', ALICE)));

    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'social', BOB, 'friends', ALICE), {
        name: 'Alice',
        since: new Date(),
      });
    });
    await assertSucceeds(getDoc(doc(as(BOB), 'presence', ALICE)));
  });

  it('lässt niemanden den Online-Status eines anderen setzen', async () => {
    await assertFails(setDoc(doc(as(BOB), 'presence', ALICE), { lastSeen: serverTimestamp() }));
  });
});

describe('Alles Übrige', () => {
  it('ist gesperrt', async () => {
    await assertFails(getDoc(doc(as(ALICE), 'irgendwas', 'x')));
    await assertFails(setDoc(doc(as(ALICE), 'irgendwas', 'x'), { a: 1 }));
  });
});
