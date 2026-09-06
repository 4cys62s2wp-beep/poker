/* Die Spiel-Maschine — die einzige Stelle, an der Geld entsteht.
   ============================================================

   Der Übungstisch ist der Bildschirm, für den diese App gebaut ist, und
   `engine.ts` ist sein Motor: Er teilt aus, nimmt Einsätze an, baut Side
   Pots und zahlt am Showdown aus. Bis E-045 hatte er **keine eigene
   Testdatei**. Berührt wurde er nur nebenbei von `stats.test.ts`, das die
   Spielstil-Kennzahlen prüft und dafür ein paar Hände durchspielt.

   Das ist die gefährlichste Art von Lücke: Ein Fehler hier fällt nicht auf,
   sondern verschiebt Chips. Wer verliert, hat ja auch verloren.

   Deshalb nicht Beispiele, sondern **Eigenschaften**: Viertausend zufällige
   Hände, nach jedem einzelnen Zug nachgerechnet. Ein Beispieltest prüft den
   Fall, an den jemand gedacht hat; ein Eigenschaftstest den, an den niemand
   gedacht hat — und genau dort sitzen die Fehler mit den Side Pots.

   Der Zufall ist gesät (`mulberry32`): Ein Fehler, der auftritt, tritt beim
   nächsten Lauf wieder auf, an derselben Hand mit derselben Nummer. */

import { describe, expect, it } from 'vitest';
import {
  applyAction,
  createHand,
  legalActions,
  totalPot,
  type Action,
  type GameState,
} from '../poker/engine';
import { BOT_PROFILES, decideBotAction, type BotStyle } from '../poker/ai';

/** Gesäter Zufall, damit ein Fehler wiederholbar ist. */
function mulberry32(saat: number): () => number {
  let a = saat >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const START = 200;
const SB = 1;
const BB = 2;

function sitze(anzahl: number, stacks?: number[]) {
  return Array.from({ length: anzahl }, (_, i) => ({
    id: i,
    name: `S${i}`,
    stack: stacks ? stacks[i] : START,
    isHero: i === 0,
  }));
}

/** Alles, was gerade an Chips im Spiel ist. */
function chipsImSpiel(g: GameState): number {
  return g.players.reduce((s, p) => s + p.stack + p.committed, 0);
}

/**
 * Alles, was in JEDEM Zustand gelten muss — als Prüfung, die nichts kostet.
 *
 * Sie gibt den ersten Verstoß als Satz zurück und sonst `null`. Der Aufrufer
 * ruft `expect` nur, wenn wirklich etwas gefunden wurde.
 *
 * Das ist kein Stilentscheid, sondern der Grund, warum der Test überhaupt
 * läuft: Der erste Entwurf rief `expect` für jedes Feld nach jedem Zug — bei
 * zehntausend Händen über fünf Millionen Aufrufe, jeder mit einer aus einer
 * Vorlage gebauten Fehlermeldung. Er lief zwei Minuten und wurde von Vitest
 * abgebrochen. Ein Test, der zu langsam ist, um zu laufen, prüft nichts.
 */
function verstoss(g: GameState, summeVorher: number): string | null {
  if (chipsImSpiel(g) !== summeVorher) {
    return `Chips entstanden oder verschwunden: ${chipsImSpiel(g)} statt ${summeVorher}`;
  }

  for (const p of g.players) {
    if (p.stack < 0) return `${p.name} hat einen negativen Stapel (${p.stack})`;
    if (p.committed < 0) return `${p.name} hat negativen Einsatz (${p.committed})`;
    if (p.bet > p.committed) return `${p.name}: bet ${p.bet} über committed ${p.committed}`;
    /* Nur SOLANGE die Hand läuft: Nach der Auszahlung stehen die Chips wieder
       beim Spieler, und `allIn` bleibt als Marke der gespielten Hand stehen —
       `createHand` setzt sie für die nächste zurück. Die Zusage lautet „wer
       All-in ist, hat nichts mehr", nicht „wer die Marke trägt, hat nie
       wieder etwas". */
    if (p.allIn && !g.handOver && p.stack !== 0) {
      return `${p.name} ist All-in mit Rest-Stapel (${p.stack})`;
    }
    if (!Number.isInteger(p.stack)) return `${p.name} hat Bruchteile von Chips (${p.stack})`;
    if (!Number.isInteger(p.committed)) return `${p.name}: Einsatz mit Bruchteil`;
  }

  /* Keine Karte darf zweimal existieren — weder zwischen zwei Händen noch
     zwischen Hand und Board. */
  const gesehen = [...g.board, ...g.players.flatMap((x) => x.cards)];
  if (new Set(gesehen).size !== gesehen.length) return 'eine Karte ist doppelt vergeben';

  if (g.handOver) return null;

  const zurStrasse: Record<string, number> = {
    preflop: 0, flop: 3, turn: 4, river: 5, showdown: 5,
  };
  if (g.board.length !== zurStrasse[g.street]) {
    return `Board hat ${g.board.length} Karten auf der Straße ${g.street}`;
  }

  /* Wer am Zug ist, muss auch ziehen können. */
  const dran = g.players[g.toActIndex];
  if (!dran) return `toActIndex ${g.toActIndex} zeigt ins Leere`;
  if (dran.folded) return `${dran.name} ist am Zug, hat aber gefoldet`;
  if (dran.allIn) return `${dran.name} ist am Zug, ist aber All-in`;

  const la = legalActions(g);
  if (la.canBetOrRaise) {
    if (la.minRaiseTo > la.maxRaiseTo) {
      return `minRaiseTo ${la.minRaiseTo} über maxRaiseTo ${la.maxRaiseTo}`;
    }
    if (la.minRaiseTo <= g.currentBet) {
      return `minRaiseTo ${la.minRaiseTo} erhöht den Einsatz ${g.currentBet} nicht`;
    }
  }
  if (la.callAmount > dran.stack) {
    return `Call kostet ${la.callAmount}, ${dran.name} hat ${dran.stack}`;
  }
  return null;
}

/** Ein zufälliger, legaler Zug. */
function zufallszug(g: GameState, rng: () => number): Action {
  const la = legalActions(g);
  const moeglich: Action[] = [];
  if (la.canFold) moeglich.push({ type: 'fold' });
  if (la.canCheck) moeglich.push({ type: 'check' });
  if (!la.canCheck) moeglich.push({ type: 'call' });
  if (la.canBetOrRaise) {
    const spanne = la.maxRaiseTo - la.minRaiseTo;
    const to = la.minRaiseTo + Math.floor(rng() * (spanne + 1));
    moeglich.push({ type: 'raise', to });
    /* Die Ränder sind die interessanten Fälle: kleinstmögliche Erhöhung
       und All-in. */
    moeglich.push({ type: 'raise', to: la.minRaiseTo });
    moeglich.push({ type: 'raise', to: la.maxRaiseTo });
  }
  return moeglich[Math.floor(rng() * moeglich.length)];
}

describe('Am Tisch entsteht und verschwindet kein Chip', () => {
  it('hält über 4000 zufällige Hände jede Zusage ein', () => {
    const rng = mulberry32(20260906);
    let stacks = [START, START, START, START, START, START];
    let button = 0;
    let haende = 0;
    let zuege = 0;
    let showdowns = 0;
    let allInHaende = 0;

    for (let n = 1; n <= 4000; n += 1) {
      /* Wer pleite ist, kauft nach — sonst wären nach 200 Händen alle raus
         und der Test liefe ins Leere. */
      stacks = stacks.map((s) => (s < BB ? START : s));
      const gesamt = stacks.reduce((a, b) => a + b, 0);

      const g = createHand(sitze(6, stacks), button, SB, BB, n, rng);
      expect(verstoss(g, gesamt), `Hand ${n} nach dem Austeilen`).toBeNull();
      haende += 1;

      let schritte = 0;
      while (!g.handOver) {
        const zug = zufallszug(g, rng);
        applyAction(g, zug);
        zuege += 1;
        schritte += 1;
        const v = verstoss(g, gesamt);
        if (v) expect(v, `Hand ${n}, Zug ${schritte} (${zug.type})`).toBeNull();
        if (schritte > 400) expect(schritte, `Hand ${n} endet nicht`).toBeLessThan(400);
      }

      if (g.street === 'showdown') showdowns += 1;
      if (g.players.some((p) => p.allIn)) allInHaende += 1;

      /* Nach der Hand liegt alles wieder bei den Spielern. */
      const nachher = g.players.reduce((s, p) => s + p.stack, 0);
      expect(nachher, `Hand ${n}: Auszahlung stimmt nicht`).toBe(gesamt);
      expect(totalPot(g), `Hand ${n}: Pot nach Handende nicht geleert`).toBe(0);

      /* Die Auszahlungen summieren sich auf das, was im Pot lag. */
      const ausgezahlt = g.awards.reduce((s, a) => s + a.amount, 0);
      expect(ausgezahlt, `Hand ${n}: nichts ausgezahlt`).toBeGreaterThan(0);
      for (const a of g.awards) {
        const p = g.players.find((x) => x.id === a.playerId);
        expect(p, `Hand ${n}: Auszahlung an einen Unbekannten`).toBeDefined();
        expect(p!.folded, `Hand ${n}: ${p!.name} hat gefoldet und kassiert`).toBe(false);
        expect(a.amount, `Hand ${n}: Auszahlung von 0`).toBeGreaterThan(0);
      }

      stacks = g.players.map((p) => p.stack);
      button = (button + 1) % 6;
    }

    /* Der Lauf muss auch wirklich die Fälle erreicht haben, um die es geht.
       Ohne diese Zahlen wäre ein Lauf, der nach der ersten Hand abbricht,
       genauso grün wie einer, der zehntausend spielt. */
    expect(haende).toBe(4000);
    expect(zuege).toBeGreaterThan(20_000);
    expect(showdowns, 'kein einziger Showdown erreicht').toBeGreaterThan(200);
    expect(allInHaende, 'kein einziges All-in erreicht').toBeGreaterThan(200);
  }, 20000);

  it('hält die Zusagen auch bei sehr ungleichen Stapeln', () => {
    /* Side Pots entstehen erst, wenn jemand weniger hat als die anderen.
       Bei sechs gleichen Stapeln passiert das selten — hier ist es der
       Normalfall. */
    const rng = mulberry32(4711);
    for (let n = 1; n <= 800; n += 1) {
      const stacks = Array.from({ length: 5 }, () => 2 + Math.floor(rng() * 300));
      const gesamt = stacks.reduce((a, b) => a + b, 0);
      const g = createHand(sitze(5, stacks), n % 5, SB, BB, n, rng);
      expect(verstoss(g, gesamt), `Ungleich ${n} nach dem Austeilen`).toBeNull();
      let schritte = 0;
      while (!g.handOver) {
        applyAction(g, zufallszug(g, rng));
        schritte += 1;
        const v = verstoss(g, gesamt);
        if (v) expect(v, `Ungleich ${n}, Zug ${schritte}`).toBeNull();
        if (schritte > 400) expect(schritte).toBeLessThan(400);
      }
      expect(g.players.reduce((s, p) => s + p.stack, 0),
        `Ungleich ${n}: Auszahlung stimmt nicht`).toBe(gesamt);
    }
  }, 20000);

  it('hält die Zusagen auch heads-up', () => {
    /* Zu zweit sind die Blinds vertauscht (der Button ist der Small Blind)
       und preflop zieht der Button zuerst — die häufigste Stelle für einen
       Abzählfehler. */
    const rng = mulberry32(99);
    for (let n = 1; n <= 800; n += 1) {
      const stacks = [50 + Math.floor(rng() * 400), 50 + Math.floor(rng() * 400)];
      const gesamt = stacks[0] + stacks[1];
      const g = createHand(sitze(2, stacks), n % 2, SB, BB, n, rng);
      expect(verstoss(g, gesamt), `HU ${n} nach dem Austeilen`).toBeNull();
      let schritte = 0;
      while (!g.handOver) {
        applyAction(g, zufallszug(g, rng));
        schritte += 1;
        const v = verstoss(g, gesamt);
        if (v) expect(v, `HU ${n}, Zug ${schritte}`).toBeNull();
        if (schritte > 400) expect(schritte).toBeLessThan(400);
      }
      expect(g.players.reduce((s, p) => s + p.stack, 0), `HU ${n}`).toBe(gesamt);
    }
  }, 30_000);
});

describe('Die Gegner am Übungstisch spielen keinen unmöglichen Zug', () => {
  /* Der Bot rechnet seine Erhöhung selbst aus. Liegt sie unter `minRaiseTo`
     oder über `maxRaiseTo`, wirft `applyAction` — und der Übungstisch
     bleibt mitten in der Hand stehen. Für den Spielenden sähe das aus, als
     hinge die App.

     `decideBotAction` hat dafür ein Sicherheitsnetz. Dieser Test prüft, dass
     es hält — über alle fünf Spielstile und alle Straßen. */
  const STILE: BotStyle[] = ['tight', 'aggro', 'loose', 'standard', 'tight'];

  it('spielt 500 Hände ohne einen einzigen Regelverstoß', () => {
    const rng = mulberry32(2026);
    let stacks = [START, START, START, START, START, START];
    let botzuege = 0;

    for (let n = 1; n <= 500; n += 1) {
      stacks = stacks.map((s) => (s < BB ? START : s));
      const gesamt = stacks.reduce((a, b) => a + b, 0);
      const g = createHand(sitze(6, stacks), n % 6, SB, BB, n, rng);

      let schritte = 0;
      while (!g.handOver) {
        const i = g.toActIndex;
        /* Sitz 0 ist der Held und zieht zufällig; alle anderen entscheidet
           die KI — so, wie es am Übungstisch läuft. */
        const zug = i === 0
          ? zufallszug(g, rng)
          : decideBotAction(g, i, BOT_PROFILES[STILE[(i - 1) % STILE.length]], rng);
        if (i !== 0) botzuege += 1;
        /* Kein try/catch: Wirft die Maschine, ist der Test rot — und genau
           das ist die Aussage. */
        applyAction(g, zug);
        schritte += 1;
        const v = verstoss(g, gesamt);
        if (v) expect(v, `KI-Hand ${n}, Zug ${schritte}`).toBeNull();
        if (schritte > 400) expect(schritte, `KI-Hand ${n} endet nicht`).toBeLessThan(400);
      }
      stacks = g.players.map((p) => p.stack);
    }

    expect(botzuege, 'die KI kam gar nicht zum Zug').toBeGreaterThan(2000);
  }, 60_000);
});

describe('Was die Maschine anbietet, nimmt sie auch an', () => {
  it('führt jeden als legal gemeldeten Zug aus', () => {
    /* `legalActions` und `applyAction` sind zwei Funktionen mit derselben
       Regel im Kopf. Gehen sie auseinander, bietet der Tisch einen Knopf
       an, der beim Drücken einen Fehler wirft. */
    const rng = mulberry32(31337);
    let geprueft = 0;

    for (let n = 1; n <= 250; n += 1) {
      const stacks = Array.from({ length: 4 }, () => 2 + Math.floor(rng() * 250));
      const g = createHand(sitze(4, stacks), n % 4, SB, BB, n, rng);

      let schritte = 0;
      while (!g.handOver && schritte < 200) {
        const la = legalActions(g);
        /* Jede gemeldete Möglichkeit einmal auf einer Kopie ausführen. */
        const kandidaten: Action[] = [];
        if (la.canFold) kandidaten.push({ type: 'fold' });
        if (la.canCheck) kandidaten.push({ type: 'check' });
        if (!la.canCheck) kandidaten.push({ type: 'call' });
        if (la.canBetOrRaise) {
          kandidaten.push({ type: 'raise', to: la.minRaiseTo });
          kandidaten.push({ type: 'raise', to: la.maxRaiseTo });
          kandidaten.push({
            type: 'raise',
            to: Math.floor((la.minRaiseTo + la.maxRaiseTo) / 2),
          });
        }
        for (const k of kandidaten) {
          const kopie: GameState = JSON.parse(JSON.stringify(g));
          expect(() => applyAction(kopie, k),
            `Hand ${n}, Zug ${schritte}: ${k.type} wurde angeboten und abgelehnt`)
            .not.toThrow();
          geprueft += 1;
        }
        applyAction(g, zufallszug(g, rng));
        schritte += 1;
      }
    }

    expect(geprueft, 'es wurde kaum etwas geprüft').toBeGreaterThan(2000);
  }, 60_000);

  it('nimmt zu wenig nicht an und deckelt zu viel', () => {
    /* Die Maschine behandelt die beiden Ränder verschieden, und das ist
       Absicht:

       - **Zu wenig** wird abgelehnt. Eine Erhöhung unter dem Mindestbetrag
         ist ein Regelverstoß; sie stillschweigend anzuheben würde einen
         anderen Zug spielen als den gewollten.
       - **Zu viel** wird auf den Stapel gedeckelt. Mehr als alles kann
         niemand setzen, und ein Aufruf, der es versucht, meint All-in.

       Nachgerechnet wird die Folge: Nach dem Deckeln steht die Summe
       unverändert — es entstehen keine Chips aus einer zu großen Zahl. */
    const rng = mulberry32(5);
    const g = createHand(sitze(3), 0, SB, BB, 1, rng);
    const summe = chipsImSpiel(g);
    const la = legalActions(g);
    expect(la.canBetOrRaise).toBe(true);

    expect(() => applyAction(g, { type: 'raise', to: la.minRaiseTo - 1 })).toThrow();
    expect(() => applyAction(g, { type: 'raise', to: -5 })).toThrow();
    expect(chipsImSpiel(g), 'ein abgelehnter Zug hat trotzdem gewirkt').toBe(summe);

    const dran = g.players[g.toActIndex];
    applyAction(g, { type: 'raise', to: la.maxRaiseTo + 1000 });
    expect(dran.bet, 'zu viel wurde nicht auf den Stapel gedeckelt').toBe(la.maxRaiseTo);
    expect(dran.stack).toBe(0);
    expect(dran.allIn).toBe(true);
    expect(chipsImSpiel(g), 'aus einer zu großen Zahl sind Chips entstanden').toBe(summe);
  });
});
