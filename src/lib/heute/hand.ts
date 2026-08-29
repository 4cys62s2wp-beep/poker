/* Die Hand des Tages.
   ==================

   Warum es sie gibt
   -----------------
   Eine App, die man auf dem Startbildschirm hat und trotzdem nicht öffnet,
   hat kein Gestaltungsproblem, sondern kein Angebot: Beim Öffnen sieht man
   dasselbe wie gestern, und bevor irgendetwas passiert, muss man sich durch
   ein Menü entscheiden. Die Hand des Tages dreht beides um — es steht etwas
   Neues da, und es ist sofort beantwortbar.

   Warum sie nichts Neues rechnet
   ------------------------------
   Sie zieht eine Aufgabe aus demselben Generator wie der Pot-Odds-Drill
   (`lib/potodds/aufgabe.ts`) und löst sie mit derselben Funktion. Jede Zahl
   kommt damit weiterhin aus `tools/poker-math/`, und die Regel des Projekts
   bleibt unangetastet: Was rechnet, steht im Generator; was zeigt, steht im
   Bildschirm.

   Das Einzige, was hier entsteht, ist die **Auswahl**: welche Aufgabe heute
   dran ist.

   Warum aus dem Datum und nicht aus dem Zufall
   ---------------------------------------------
   Zwei Gründe, und beide sind wichtiger als sie klingen:

   1. **Den ganzen Tag dieselbe.** Wer die App mittags noch einmal öffnet,
      soll dieselbe Hand sehen — sonst ist die Antwort von heute Morgen
      verschwunden und die Frage war nichts wert.
   2. **Ohne Server und ohne Netz.** Alle Geräte, die dasselbe Datum haben,
      ziehen dieselbe Hand, weil sie dieselbe Rechnung machen. Das ist der
      billigste denkbare „tägliche Inhalt": Er kostet keine Zeile
      Serverkode und funktioniert im Flugzeug.

   Der Tag ist der **lokale** Tag, nicht UTC: Wer um 23 Uhr die Hand von
   heute beantwortet, soll nicht um 1 Uhr dieselbe noch einmal bekommen,
   weil in London schon morgen ist — und umgekehrt. */

import type { B1Outs, B2PotOdds } from '../pokermath/typen';
import {
  baueAufgabe, loese, ziehZustand,
  type Aufgabe, type Aufloesung, type DrillZustand,
} from '../potodds/aufgabe';

/** Der lokale Kalendertag als `JJJJ-MM-TT`.
 *
 *  Nicht `toISOString()` — das rechnet nach UTC um und liefert abends den
 *  falschen Tag. */
export function tagesschluessel(jetzt: Date = new Date()): string {
  const zwei = (n: number) => String(n).padStart(2, '0');
  return `${jetzt.getFullYear()}-${zwei(jetzt.getMonth() + 1)}-${zwei(jetzt.getDate())}`;
}

/** Ein Startwert aus einer Zeichenkette (FNV-1a, 32 Bit).
 *
 *  Warum FNV und nicht „Buchstaben addieren": Eine Summe verteilt schlecht —
 *  aufeinanderfolgende Tage unterscheiden sich dann nur um eins, und der
 *  Generator zieht dreimal hintereinander dieselbe Gegend der Tabelle. FNV
 *  streut auch bei Eingaben, die sich in einem Zeichen unterscheiden. */
export function startwert(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Ein wiederholbarer Zufallsstrom (mulberry32).
 *
 *  Klein, ohne Abhängigkeit, und gut genug: Der Strom muss nicht
 *  kryptografisch sein, er muss nur bei gleichem Startwert gleich bleiben
 *  und bei benachbarten Startwerten verschieden aussehen. */
export function stromAus(saat: number): () => number {
  let a = saat >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface TagesHand {
  /** Der Tag, für den sie gilt — zugleich der Schlüssel im Gerätespeicher. */
  tag: string;
  zustand: DrillZustand;
  aufgabe: Aufgabe;
  aufloesung: Aufloesung;
}

/** Die Hand für einen Tag. Gleiches Datum und gleiche Daten, gleiche Hand. */
export function handDesTages(b1: B1Outs, b2: B2PotOdds, jetzt: Date = new Date()): TagesHand {
  const tag = tagesschluessel(jetzt);
  const zustand = ziehZustand(b1, b2, stromAus(startwert(tag)));
  const aufgabe = baueAufgabe(b1, b2, zustand);
  return { tag, zustand, aufgabe, aufloesung: loese(aufgabe) };
}
