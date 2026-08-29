/* Was von der Hand des Tages übrig bleibt.
   =======================================

   Ein Eintrag je Tag, mehr nicht: Wurde heute schon geantwortet, und war es
   richtig? Daraus ergeben sich die Woche auf der Startseite und die Frage,
   ob die Karte noch eine Frage stellt oder schon die Auflösung zeigt.

   Warum eine Liste von Tagen und kein Zähler
   ------------------------------------------
   Ein Zähler („7 Tage in Folge") kann nur wachsen oder auf null springen.
   Eine Liste kann man **zeigen**: sieben Punkte, von denen fünf voll sind.
   Das ist der Unterschied zwischen einer Behauptung über den eigenen Fleiß
   und einem Bild davon — und ein Bild lädt zum Weitermachen ein, wo eine
   Zahl nur feststellt.

   Warum nur die letzten Tage
   --------------------------
   Gespeichert werden höchstens `HOECHSTZAHL` Einträge. Was älter ist, ist
   für die Anzeige ohne Belang, und ein Gerätespeicher, der jahrelang
   mitwächst, ist eine Zeitbombe für den Tag, an dem er voll ist. */

import { durableSet } from '../storage';

export const SCHLUESSEL = 'pokermentor-heute-v1';

/** Wie viele Tage aufgehoben werden. Zehn Wochen — genug für jede Ansicht,
 *  die eine Woche zeigt, und wenig genug, um nie ins Gewicht zu fallen. */
export const HOECHSTZAHL = 70;

/** Wie viele Tage die Startseite als Punkte zeigt. */
export const WOCHE = 7;

export interface TagesAntwort {
  /** `JJJJ-MM-TT`, lokaler Tag. */
  tag: string;
  /** Was angetippt wurde. */
  gewaehlt: 'lohnt' | 'lohnt-nicht';
  richtig: boolean;
}

function istAntwort(v: unknown): v is TagesAntwort {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return typeof o.tag === 'string'
    && (o.gewaehlt === 'lohnt' || o.gewaehlt === 'lohnt-nicht')
    && typeof o.richtig === 'boolean';
}

/** Liest die Antworten. Alles, was nicht passt, gilt als „nichts da".
 *
 *  Wie bei der laufenden Session wird hier bewusst nicht laut gescheitert:
 *  Ein halb geschriebener Eintrag im Gerätespeicher darf niemanden aus
 *  seiner eigenen App aussperren. */
export function ladeAntworten(): TagesAntwort[] {
  try {
    const roh = localStorage.getItem(SCHLUESSEL);
    if (!roh) return [];
    const d = JSON.parse(roh);
    if (!Array.isArray(d)) return [];
    return d.filter(istAntwort);
  } catch {
    return [];
  }
}

export function speichereAntworten(antworten: TagesAntwort[]): void {
  durableSet(SCHLUESSEL, JSON.stringify(antworten.slice(0, HOECHSTZAHL)));
}

/** Eine Antwort aufnehmen. Der jüngste Tag steht vorn.
 *
 *  Ein zweiter Versuch am selben Tag ersetzt den ersten **nicht**: Wer die
 *  Auflösung schon gesehen hat, könnte sonst nachträglich richtig liegen,
 *  und die Woche auf der Startseite wäre keine Auskunft mehr, sondern eine
 *  Gefälligkeit. */
export function ergaenze(antworten: TagesAntwort[], neu: TagesAntwort): TagesAntwort[] {
  if (antworten.some((a) => a.tag === neu.tag)) return antworten;
  return [neu, ...antworten]
    .sort((a, b) => (a.tag < b.tag ? 1 : -1))
    .slice(0, HOECHSTZAHL);
}

export function antwortVon(antworten: TagesAntwort[], tag: string): TagesAntwort | null {
  return antworten.find((a) => a.tag === tag) ?? null;
}

/** Die letzten sieben Tage bis einschließlich `heute`, ältester zuerst.
 *
 *  Ältester zuerst, weil die Woche von links nach rechts gelesen wird und
 *  „heute" damit rechts außen steht — dort, wo der Daumen ist und wo der
 *  nächste Punkt hinkommt. */
export function woche(
  antworten: TagesAntwort[], heute: string, tage = WOCHE,
): Array<{ tag: string; antwort: TagesAntwort | null; istHeute: boolean }> {
  const [j, m, t] = heute.split('-').map(Number);
  const zwei = (n: number) => String(n).padStart(2, '0');
  const aus: Array<{ tag: string; antwort: TagesAntwort | null; istHeute: boolean }> = [];
  for (let zurueck = tage - 1; zurueck >= 0; zurueck -= 1) {
    /* Über ein Date-Objekt, nicht über Tagesarithmetik von Hand: Monats- und
       Jahreswechsel und Schaltjahre sind sonst drei Fehlerquellen. */
    const d = new Date(j, m - 1, t - zurueck);
    const tag = `${d.getFullYear()}-${zwei(d.getMonth() + 1)}-${zwei(d.getDate())}`;
    aus.push({ tag, antwort: antwortVon(antworten, tag), istHeute: zurueck === 0 });
  }
  return aus;
}

/** Wie viele Tage in Folge bis heute beantwortet wurden.
 *
 *  „Bis heute" heißt: Ein noch unbeantwortetes Heute bricht die Serie nicht —
 *  der Tag ist ja noch nicht vorbei. Gezählt wird dann ab gestern. */
export function serie(antworten: TagesAntwort[], heute: string): number {
  const gesehen = new Set(antworten.map((a) => a.tag));
  const [j, m, t] = heute.split('-').map(Number);
  const zwei = (n: number) => String(n).padStart(2, '0');
  const tagVor = (zurueck: number) => {
    const d = new Date(j, m - 1, t - zurueck);
    return `${d.getFullYear()}-${zwei(d.getMonth() + 1)}-${zwei(d.getDate())}`;
  };
  let zurueck = gesehen.has(heute) ? 0 : 1;
  let zahl = 0;
  while (gesehen.has(tagVor(zurueck))) {
    zahl += 1;
    zurueck += 1;
  }
  return zahl;
}
