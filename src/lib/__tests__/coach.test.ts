/* Der Coach — die Stelle, die einem sagt, was man tun soll.
   =======================================================

   `coach.ts` beantwortet die Frage, für die es diese App gibt: „Was mache
   ich hier?" Er läuft im Live-Coach, im Übungstisch und in der Hand des
   Tages. Bis E-045 hatte er **keine eigene Testdatei**.

   Was hier geprüft wird und was nicht:

   **Nicht** die Güte des Rats. Ob „Call" in einem bestimmten Spot besser
   ist als „Raise", ist eine Frage der Strategie und gehört in den Inhalt,
   nicht in einen Testlauf. Wer das hier prüfen wollte, müsste die Antwort
   ein zweites Mal hinschreiben — und dann prüft der Test die Abschrift.

   **Sondern** die Zusagen, die unabhängig von der Strategie gelten:

   - Er antwortet immer. Ein Bildschirm, der auf eine Empfehlung wartet und
     keine bekommt, ist schlimmer als ein mittelmäßiger Rat.
   - Er antwortet vollständig: eine Handlung, eine Überschrift, mindestens
     eine Begründung. „Fold" ohne Grund ist keine Lehre, sondern ein Befehl.
   - Er antwortet in der Sprache, in der gefragt wurde.
   - Und er sagt nichts, was am Pokertisch falsch WÄRE, egal welcher Schule
     man folgt: Asse wirft man nicht weg, 7-2 offsuit eröffnet man nicht
     unter der Pistole.

   Preflop wird nicht gestichprobt, sondern **vollständig durchgezählt**:
   169 Hände × 4 Positionen × Tischgrößen × mit und ohne Erhöhung. Der Raum
   ist klein genug, dass Stichproben Unsinn wären. */

import { describe, expect, it } from 'vitest';
import {
  coachPositions,
  facingBetVerdict,
  postflopAdvice,
  preflopAdvice,
  type CoachAction,
  type CoachLang,
  type CoachPosition,
} from '../poker/coach';
import { detectDraws, madeHandInfo } from '../poker/analysis';
import { matrixLabel } from '../poker/ranges';

const AKTIONEN: CoachAction[] = [
  'raise', 'bet', 'call', 'check', 'fold', 'checkcall', 'checkfold',
];
const POSITIONEN: CoachPosition[] = ['frueh', 'mitte', 'spaet', 'blinds'];
const SPRACHEN: CoachLang[] = ['de', 'en'];

const ALLE_HAENDE = Array.from({ length: 169 }, (_, i) => matrixLabel(Math.floor(i / 13), i % 13));

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

/** Der erste Verstoß gegen die Form eines Rats, oder `null`. */
function unvollstaendig(rat: { action: string; headline: string; reasons: string[] }): string | null {
  if (!AKTIONEN.includes(rat.action as CoachAction)) return `unbekannte Handlung „${rat.action}"`;
  if (typeof rat.headline !== 'string' || !rat.headline.trim()) return 'keine Überschrift';
  if (!Array.isArray(rat.reasons) || rat.reasons.length === 0) return 'keine Begründung';
  if (rat.reasons.some((r) => typeof r !== 'string' || !r.trim())) return 'leere Begründung';
  return null;
}

describe('Preflop antwortet der Coach auf jede Frage', () => {
  it('gibt für alle 169 Hände in jeder Lage einen vollständigen Rat', () => {
    let gefragt = 0;
    for (const sprache of SPRACHEN) {
      for (const hand of ALLE_HAENDE) {
        for (const pos of POSITIONEN) {
          for (const spieler of [2, 3, 6, 9]) {
            for (const erhoeht of [false, true]) {
              for (const limper of [0, 1, 3]) {
                const rat = preflopAdvice(hand, pos, spieler, erhoeht, limper, sprache);
                const fehler = unvollstaendig(rat);
                if (fehler) {
                  expect(fehler,
                    `${sprache} ${hand} ${pos} ${spieler}er erhöht=${erhoeht} limper=${limper}`)
                    .toBeNull();
                }
                gefragt += 1;
              }
            }
          }
        }
      }
    }
    /* Ohne diese Zahl sähe ein Lauf, der nichts fragt, genauso aus wie
       einer, der nichts findet. */
    expect(gefragt).toBe(2 * 169 * 4 * 4 * 2 * 3);
  });

  it('wirft niemals Asse weg', () => {
    /* Keine Schule der Welt foldet AA preflop. Wenn der Coach das je sagt,
       ist etwas grundsätzlich falsch — und ein Anfänger, der es befolgt,
       lernt genau das Falsche. */
    for (const sprache of SPRACHEN) {
      for (const pos of POSITIONEN) {
        for (const spieler of [2, 6, 9]) {
          for (const erhoeht of [false, true]) {
            const rat = preflopAdvice('AA', pos, spieler, erhoeht, 0, sprache);
            expect(['fold', 'checkfold'], `AA ${pos} erhöht=${erhoeht}`)
              .not.toContain(rat.action);
          }
        }
      }
    }
  });

  it('eröffnet nicht mit 7-2 offsuit unter der Pistole', () => {
    /* Die schlechteste Hand im Spiel, aus der schlechtesten Position, an
       einem vollen Tisch, ohne dass jemand vor einem erhöht hat. */
    for (const sprache of SPRACHEN) {
      for (const spieler of [6, 9]) {
        const rat = preflopAdvice('72o', 'frueh', spieler, false, 0, sprache);
        expect(['raise', 'bet'], `72o frueh ${spieler}er`).not.toContain(rat.action);
      }
    }
  });

  it('antwortet in der Sprache, in der gefragt wurde', () => {
    /* Eine fehlende Übersetzung fällt sonst erst auf, wenn jemand die App
       auf Englisch benutzt — und dann steht dort Deutsch. */
    for (const hand of ['AA', 'AKs', 'JTs', '72o', '55']) {
      for (const pos of POSITIONEN) {
        const de = preflopAdvice(hand, pos, 6, false, 0, 'de');
        const en = preflopAdvice(hand, pos, 6, false, 0, 'en');
        /* Die Handlung ist dieselbe — die Sprache ändert den Rat nicht. */
        expect(de.action, `${hand} ${pos}: Handlung hängt an der Sprache`).toBe(en.action);
        /* Verglichen wird der ganze Rat, nicht die Überschrift allein:
           „Fold" heißt auf Englisch auch „Fold", und ein Pokerbegriff, der
           in beiden Sprachen gleich lautet, ist keine fehlende Übersetzung.
           Ein ganzer Rat, der Wort für Wort gleich ist, wäre eine. */
        const ganz = (r: { headline: string; reasons: string[] }) =>
          [r.headline, ...r.reasons].join(' | ');
        expect(ganz(de), `${hand} ${pos}: Rat nicht übersetzt`).not.toBe(ganz(en));
        expect(ganz(en), `${hand} ${pos}: deutscher Rest im englischen Rat`)
          .not.toMatch(/[äöüß]/);
      }
    }
  });

  it('benennt die Positionen in beiden Sprachen', () => {
    for (const sprache of SPRACHEN) {
      const liste = coachPositions(sprache);
      expect(liste.length).toBeGreaterThan(0);
      for (const p of liste) expect(String(p.label ?? p).trim()).not.toBe('');
    }
  });
});

describe('Postflop antwortet der Coach auf jedes Board', () => {
  /* Hand und Board werden nicht von Hand gebaut, sondern aus einem
     gemischten Deck gezogen und durch dieselbe Auswertung geschickt wie in
     der App (`madeHandInfo`, `detectDraws`). Ein von Hand gebautes
     `MadeHandInfo` prüfte nur meine Vorstellung davon. */
  function zieheSpot(rng: () => number, boardKarten: number) {
    const deck = Array.from({ length: 52 }, (_, i) => i);
    for (let i = deck.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return { hole: deck.slice(0, 2), board: deck.slice(2, 2 + boardKarten) };
  }

  it('gibt für 4000 zufällige Situationen einen vollständigen Rat', () => {
    const rng = mulberry32(20260906);
    let gefragt = 0;
    let starkeHaende = 0;

    for (let n = 0; n < 4000; n += 1) {
      const strasse = (['flop', 'turn', 'river'] as const)[n % 3];
      const anzahl = strasse === 'flop' ? 3 : strasse === 'turn' ? 4 : 5;
      const { hole, board } = zieheSpot(rng, anzahl);
      const sprache = SPRACHEN[n % 2];
      const made = madeHandInfo(hole, board, sprache);
      const draws = detectDraws(hole, board, sprache);
      const equity = rng();
      const gegner = 1 + Math.floor(rng() * 5);

      const rat = postflopAdvice({ street: strasse, made, draws, equity, opponents: gegner }, sprache);
      const fehler = unvollstaendig(rat);
      if (fehler) {
        expect(fehler, `${sprache} ${strasse} ${made.name} eq=${equity.toFixed(2)}`).toBeNull();
      }

      /* Eine fertige Straße oder besser wirft man nicht weg. */
      if (made.category >= 4) {
        starkeHaende += 1;
        if (rat.action === 'fold' || rat.action === 'checkfold') {
          expect(rat.action, `${strasse}: ${made.name} soll weggeworfen werden`).toBe('bet');
        }
      }
      gefragt += 1;
    }

    expect(gefragt).toBe(4000);
    expect(starkeHaende, 'keine einzige starke Hand gezogen').toBeGreaterThan(20);
  });

  it('gibt ohne Draws und ohne Equity keinen Erhöhungsrat', () => {
    /* Der Extremfall: nichts getroffen, nichts in Aussicht, 2 % Equity.
       Wer hier setzt, blufft ohne Plan — und der Coach ist für Anfänger. */
    const made = { value: 0, category: 0, name: 'High Card' };
    const draws = {
      flushDraw: false, nutFlushDraw: false, openEnded: false, gutshot: false,
      overcards: 0, parts: [], totalOuts: 0, softOuts: 0,
    };
    for (const strasse of ['flop', 'turn', 'river'] as const) {
      const rat = postflopAdvice(
        { street: strasse, made, draws: draws as never, equity: 0.02, opponents: 3 },
        'de',
      );
      expect(['raise', 'bet'], `${strasse}: setzt mit nichts`).not.toContain(rat.action);
      expect(unvollstaendig(rat)).toBeNull();
    }
  });
});

describe('Die Pot-Odds-Auskunft rechnet richtig', () => {
  it('benutzt die Formel Einsatz durch (Pot + zweimal Einsatz)', () => {
    /* Der Nenner enthält den Einsatz zweimal: einmal, weil er schon im Pot
       liegt, und einmal, weil man ihn selbst bezahlt. Das ist die Stelle,
       an der beim Kopfrechnen am Tisch die meisten Fehler passieren —
       also wird sie hier unabhängig nachgerechnet. */
    for (const [pot, bet] of [[10, 5], [100, 25], [3, 3], [77, 13], [1000, 1]]) {
      const v = facingBetVerdict(0.5, pot, bet);
      expect(v.requiredPct).toBe(Math.round((bet / (pot + 2 * bet)) * 100));
    }
  });

  it('rät zum Mitgehen, sobald die Equity über der Grenze liegt', () => {
    const knapp = facingBetVerdict(0.25, 10, 5);   // nötig: 25 %
    expect(knapp.ok, 'genau auf der Grenze reicht nicht').toBe(false);
    expect(facingBetVerdict(0.28, 10, 5).ok).toBe(true);
    expect(facingBetVerdict(0.9, 10, 5).ok).toBe(true);
    expect(facingBetVerdict(0.01, 10, 5).ok).toBe(false);
  });

  it('sagt in beiden Sprachen etwas, und zwar Verschiedenes', () => {
    const de = facingBetVerdict(0.4, 20, 10, 'de');
    const en = facingBetVerdict(0.4, 20, 10, 'en');
    expect(de.text.trim()).not.toBe('');
    expect(en.text.trim()).not.toBe('');
    expect(de.text).not.toBe(en.text);
    expect(en.text).not.toMatch(/[äöüß]/);
  });

  it('bleibt bei einem Einsatz von null gutmütig', () => {
    /* Kommt vor, wenn jemand die Zahl noch nicht eingetippt hat. Ein
       „NaN %" auf dem Bildschirm wäre das Ende des Vertrauens. */
    const v = facingBetVerdict(0.5, 20, 0);
    expect(Number.isFinite(v.requiredPct)).toBe(true);
    expect(v.requiredPct).toBe(0);
    expect(v.ok).toBe(true);
  });
});
