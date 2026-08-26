/* Die Adresse einer Aufgabe.
   =========================

   Jede Situation im Pot-Odds-Drill hat eine eigene Adresse, und in dieser
   Adresse steht die Situation vollständig drin. Wer den Link öffnet, sieht
   dieselbe Aufgabe wie der, der ihn geschickt hat.

   Es gibt dafür keine Datenbank und keinen Server. Es gibt auch nichts, was
   ausfallen oder ablaufen könnte: Der Zustand *ist* die Adresse.

   Wie sie aussieht
   ----------------
   `#/lernen/drill/3-5-c-1k9z`

   Drei Zahlen zur Basis 36 und ein Fingerabdruck:

   | Stelle | Bedeutung |
   |--------|-----------|
   | 1 | Index des Zugbilds in `b1_outs.zugbilder` |
   | 2 | Index der Einsatzgröße in `b2_potodds.einsatzgroessen` |
   | 3 | Der Potfaktor |
   | 4 | Fingerabdruck der Daten, auf die sich die Indizes beziehen |

   Absichtlich lesbar. Wer wissen will, was in der Adresse steht, kann es
   nachschlagen — das passt zu einer App, deren ganzer Punkt ist, dass man
   ihre Zahlen nachprüfen kann.

   Wozu der Fingerabdruck
   ----------------------
   Indizes sind nur so gut wie die Liste, in die sie zeigen. Käme ein neuntes
   Zugbild an dritter Stelle dazu, zeigte jeder alte Link ab dort auf eine
   andere Hand — und niemand würde es merken. Genau das ist der Fehler, gegen
   den dieses Projekt gebaut ist.

   Deshalb trägt die Adresse einen Fingerabdruck **über genau das, worauf die
   Indizes zeigen**: die Hände und Flops der Zugbilder und die Brüche der
   Einsatzgrößen. Ändern sich Zahlen, ohne dass sich diese Listen ändern,
   bleiben alle Links gültig. Ändert sich die Reihenfolge, wird jeder alte
   Link **abgelehnt** statt stillschweigend umgedeutet. */

import type { B1Outs, B2PotOdds } from '../pokermath/typen';
import type { DrillZustand } from './aufgabe';

/** Wie lange die Rückmeldung „Link kopiert" stehen bleibt, in Millisekunden. */
export const KOPIERT_MS = 2400;

const TRENNER = '-';
const BASIS = 36;
/** Länge des Fingerabdrucks. Vier Stellen zur Basis 36 sind gut 1,6 Millionen
 *  Möglichkeiten — genug, dass eine geänderte Reihenfolge praktisch nie
 *  denselben Abdruck ergibt. */
const ABDRUCK_LAENGE = 4;

/** Erlaubte Zeichen einer Stelle. Ohne diese Prüfung würde `parseInt` aus
 *  „3x" klaglos eine Zahl machen, und eine kaputte Adresse sähe gültig aus. */
const STELLE = /^[0-9a-z]+$/;

/** Fingerabdruck über genau das, worauf die Indizes zeigen.
 *
 *  Nicht über die ganze Datei: Dann würde jede neu gerechnete Nachkommastelle
 *  alle geteilten Links ungültig machen, obwohl sie auf dieselbe Hand zeigen.
 *
 *  Das Verfahren ist FNV-1a — klein, ohne Abhängigkeit, und es geht hier
 *  nicht um Sicherheit, sondern darum, eine Änderung zu bemerken. */
export function fingerabdruck(b1: B1Outs, b2: B2PotOdds): string {
  const stoff = [
    b1.zugbilder.map((z) => `${z.hand}/${z.flop}`).join('|'),
    b2.einsatzgroessen.map((e) => e.einsatz_als_bruch).join('|'),
  ].join('#');

  let hash = 0x811c9dc5;
  for (let i = 0; i < stoff.length; i += 1) {
    hash ^= stoff.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(BASIS).padStart(ABDRUCK_LAENGE, '0').slice(-ABDRUCK_LAENGE);
}

/** Baut die Adresse einer Aufgabe. */
export function kodiere(zustand: DrillZustand, abdruck: string): string {
  return [
    zustand.zugbild.toString(BASIS),
    zustand.einsatz.toString(BASIS),
    zustand.potFaktor.toString(BASIS),
    abdruck,
  ].join(TRENNER);
}

/** Liest eine Adresse.
 *
 *  Gibt `null` zurück, wenn sie nicht lesbar ist. Ob die Zustandswerte zu den
 *  Daten passen, entscheidet `baueAufgabe` — hier wird nur die Form geprüft.
 *  Zwei Prüfungen an zwei Stellen, jede mit ihrem eigenen Wissen. */
export function dekodiere(code: string): { zustand: DrillZustand; abdruck: string } | null {
  const teile = code.split(TRENNER);
  if (teile.length !== 4) return null;

  const [z, e, p, abdruck] = teile;
  if (abdruck.length !== ABDRUCK_LAENGE || !STELLE.test(abdruck)) return null;

  const zahlen: number[] = [];
  for (const stelle of [z, e, p]) {
    if (!STELLE.test(stelle)) return null;
    const wert = parseInt(stelle, BASIS);
    /* Zurückrechnen und vergleichen: So fällt jede Schreibweise auf, die
       zwar lesbar ist, aber nicht die kanonische — etwa „03". Sonst gäbe es
       zwei Adressen für dieselbe Aufgabe. */
    if (!Number.isSafeInteger(wert) || wert.toString(BASIS) !== stelle) return null;
    zahlen.push(wert);
  }

  return {
    zustand: { zugbild: zahlen[0], einsatz: zahlen[1], potFaktor: zahlen[2] },
    abdruck,
  };
}
