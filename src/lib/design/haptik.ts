/* Kurze Rückmeldung über den Vibrationsmotor.
   ==========================================

   Am Tisch ist es laut, und man schaut nicht hin. Wer eine Zahl einträgt,
   während er gleichzeitig Chips schiebt, bekommt vom Bildschirm keine
   Bestätigung mit — der Stoß in der Hand ist die einzige Rückmeldung, die
   ankommt.

   Warum so kurz
   -------------
   Zehn bis fünfzehn Millisekunden fühlen sich wie ein Tastendruck an. Alles
   darüber fühlt sich wie eine Fehlermeldung an, und das ist es nicht.

   Warum das nicht direkt im Bildschirm steht
   ------------------------------------------
   Weil es drei Dinge gibt, die man dabei falsch machen kann, und sie sollen
   nur einmal richtig gemacht werden: `navigator.vibrate` gibt es nicht
   überall, es wirft in manchen Browsern statt `false` zurückzugeben, und wer
   „Bewegung reduzieren" eingestellt hat, will das hier auch nicht. */

/** Länge der einzelnen Stöße in Millisekunden. */
const KURZ = 12;
const DOPPELT = [12, 60, 12];

/** Innerhalb dieser Spanne gilt ein zweiter Stoß als derselbe Griff.
 *
 *  Seit die Rückmeldung an einer Stelle für die ganze App ausgelöst wird
 *  (`horcheAufBedienung`), kann eine Handlung sie zweimal anstoßen: einmal
 *  über den allgemeinen Weg, einmal aus dem Bildschirm heraus. Zwei Stöße im
 *  Abstand weniger Millisekunden fühlen sich nicht wie zwei Bestätigungen an,
 *  sondern wie ein Stottern. Fünfzig Millisekunden sind kürzer als jeder
 *  bewusste zweite Tipp und länger als jede Kette aus einem Griff. */
const ENTPRELLEN_MS = 50;

let zuletzt = 0;

function darfVibrieren(): boolean {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return false;
  /* Wer Bewegung reduziert, meint auch das hier. Die Einstellung ist die
     einzige Auskunft, die wir über die Empfindlichkeit des Nutzers haben. */
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    } catch {
      /* matchMedia kann in Testumgebungen fehlen – dann eben ohne. */
    }
  }
  return true;
}

function stosse(muster: number | number[]): void {
  if (!darfVibrieren()) return;
  try {
    navigator.vibrate(muster);
  } catch {
    /* Manche Browser werfen, statt false zurückzugeben. Eine fehlgeschlagene
       Vibration ist kein Grund, eine Eingabe scheitern zu lassen. */
  }
}

/** Eine Eingabe wurde angenommen. Der Normalfall.
 *
 *  Mehrfach im selben Griff aufgerufen, stößt sie einmal an. */
export function bestaetigt(jetzt: number = Date.now()): void {
  if (jetzt - zuletzt < ENTPRELLEN_MS) return;
  zuletzt = jetzt;
  stosse(KURZ);
}

/** Etwas hat sich grundsätzlich geändert — Stufenwechsel, Runde vorbei.
 *  Zwei Stöße, damit es sich hörbar von einer normalen Eingabe unterscheidet.
 *
 *  Ohne Entprellung: Ein Umschlag kommt nicht aus einem Fingertipp, sondern
 *  aus dem Ablauf der Zeit, und zwei davon kurz hintereinander wären eine
 *  echte Auskunft. */
export function umschlag(): void {
  stosse(DOPPELT);
}

/**
 * Ist dieses Element eine Bedienfläche, deren Betätigung eine Bestätigung
 * ist? Eigene Funktion, weil sie sich prüfen lässt, ohne einen Browser zu
 * starten.
 *
 * Ein Link im Fließtext ist keine: Er führt woandershin, er bestätigt
 * nichts. Ein abgeschaltetes Element ebenfalls nicht — dort passiert
 * gerade nichts, und eine Rückmeldung auf nichts ist eine Lüge.
 */
export function istBestaetigung(ziel: Element | null): boolean {
  if (!ziel) return false;
  const el = ziel.closest('button, a[href], input, select, [role="button"], [role="switch"]');
  if (!el) return false;
  if (el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true') return false;
  if (el.tagName === 'INPUT') {
    /* In ein Textfeld zu tippen ist keine Bestätigung, sondern Schreiben.
       Gelesen wird das Attribut und nicht `el.type`: Diese Funktion soll
       sich prüfen lassen, ohne dass ein Browser die Klassen mitbringt. */
    const art = (el.getAttribute('type') ?? 'text').toLowerCase();
    if (!['button', 'submit', 'checkbox', 'radio', 'reset'].includes(art)) return false;
  }
  const eltern = el.parentElement;
  if (el.tagName === 'A' && eltern && ['P', 'LI', 'SPAN', 'STRONG', 'EM'].includes(eltern.tagName)) {
    return false;
  }
  return true;
}

/**
 * Die Rückmeldung an **einer** Stelle für die ganze App anmelden.
 *
 * Der Auftrag verlangt eine haptische Rückmeldung bei jeder bestätigten
 * Eingabe. Das in jeden Bildschirm einzeln zu schreiben hieße: Es fehlt beim
 * nächsten neuen Knopf, und niemandem fällt es auf — genau die Art Regel,
 * die sich nicht selbst durchsetzt. Ein Zuhörer an der Wurzel gilt für alles,
 * was es heute gibt, und für alles, was dazukommt.
 *
 * Gibt eine Funktion zum Abmelden zurück.
 */
export function horcheAufBedienung(wurzel: Document | HTMLElement): () => void {
  const beiKlick = (e: Event) => {
    if (istBestaetigung(e.target as Element | null)) bestaetigt();
  };
  /* In der Erfassungsphase: Ein Bildschirm, der das Ereignis abfängt, soll
     die Rückmeldung nicht mit verschlucken. */
  wurzel.addEventListener('click', beiKlick, true);
  return () => wurzel.removeEventListener('click', beiKlick, true);
}

/** Nur für Tests: Ist die Rückmeldung auf diesem Gerät überhaupt möglich? */
export const _darfVibrieren = darfVibrieren;

/** Nur für Tests: die Entprellung zurücksetzen. */
export function _entprellenZuruecksetzen(): void {
  zuletzt = 0;
}
