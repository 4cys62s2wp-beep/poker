/* Der Farbmodus: hell, dunkel, oder was das Gerät vorgibt.
   ======================================================

   Drei Modi, nicht fünf Farbwelten. Der Grund steht in ENTSCHEIDUNGEN.md,
   E-034; kurz: Jede weitere Welt verdoppelt die Kontrollarbeit bei jeder
   Farbänderung, und geprüft werden muss jede.

   Warum die Systemvorgabe hier aufgelöst wird und nicht im Stilblatt
   -----------------------------------------------------------------
   `@media (prefers-color-scheme: light)` wäre der naheliegende Weg. Dann
   stünde aber jeder helle Wert zweimal im Stilblatt: einmal für die Vorgabe,
   einmal für die ausdrückliche Wahl. Zwei Stellen mit derselben Farbe gehen
   auseinander.

   Stattdessen kennt das Stilblatt nur zwei Sätze, und diese Datei entscheidet,
   welcher gilt. „Systemvorgabe" ist damit keine dritte Farbwelt, sondern eine
   Regel darüber, welche der beiden gerade zählt.

   Kein Aufblitzen
   ---------------
   Die Wahl steht vor dem ersten Zeichnen fest: Ein kurzes Skript in
   `index.html` liest denselben Speicherschlüssel und setzt dasselbe Attribut,
   bevor React überhaupt lädt. Diese Datei übernimmt danach. Beide benutzen
   denselben Schlüssel und dieselben Werte — deshalb stehen sie hier als
   Konstanten und werden dort wörtlich eingesetzt. */

export const MODUS_SCHLUESSEL = 'pokermentor-farbmodus-v1';

/** Was jemand wählen kann. */
export type Modus = 'system' | 'hell' | 'dunkel';

/** Was am Ende gilt — „system" gibt es hier nicht mehr. */
export type Tokensatz = 'hell' | 'dunkel';

export const MODI: readonly Modus[] = ['system', 'hell', 'dunkel'] as const;

/** Die Vorauswahl. Ein Gerät, das seine Nutzerin schon kennt, weiß es besser
 *  als eine App, die sie zum ersten Mal sieht. */
export const STANDARD: Modus = 'system';

/** Was im Speicher steht — alles Unbekannte gilt als Standard. */
export function leseModus(): Modus {
  try {
    const roh = localStorage.getItem(MODUS_SCHLUESSEL);
    return (MODI as readonly string[]).includes(roh ?? '') ? (roh as Modus) : STANDARD;
  } catch {
    /* Privater Modus, gesperrter Speicher: Dann eben die Vorgabe. Eine
       Farbwahl ist nichts, wofür eine App scheitern darf. */
    return STANDARD;
  }
}

/** Die Vorgabe des Geräts. Ohne Auskunft gilt dunkel — der Grundzustand. */
export function systemvorgabe(): Tokensatz {
  try {
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'hell' : 'dunkel';
    }
  } catch {
    /* matchMedia fehlt in Testumgebungen. */
  }
  return 'dunkel';
}

/** Welcher der beiden Tokensätze aus einer Wahl folgt. */
export function tokensatzFuer(modus: Modus): Tokensatz {
  return modus === 'system' ? systemvorgabe() : modus;
}

/** Den Satz auf das Dokument schreiben. */
export function wendeAn(modus: Modus): Tokensatz {
  const satz = tokensatzFuer(modus);
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-modus', satz);
    /* Damit Formularfelder, Scrollbalken und die Auswahlmarkierung des
       Browsers mitziehen. Ohne das steht ein weißes Eingabefeld im dunklen
       Bildschirm, und niemand weiß, warum. */
    document.documentElement.style.colorScheme = satz === 'hell' ? 'light' : 'dark';
  }
  return satz;
}

/** Die Wahl merken und sofort anwenden. */
export function speichereModus(modus: Modus): Tokensatz {
  try {
    localStorage.setItem(MODUS_SCHLUESSEL, modus);
  } catch {
    /* Nicht speichern zu können heißt nicht, nicht umschalten zu können. */
  }
  return wendeAn(modus);
}

/**
 * Auf Änderungen der Systemvorgabe hören, solange „Systemvorgabe" gewählt ist.
 *
 * Gibt die Abmeldefunktion zurück. Wer ausdrücklich hell oder dunkel gewählt
 * hat, soll von einem Sonnenuntergang nicht überrascht werden — deshalb wirkt
 * das nur im Modus `system`.
 */
export function horcheAufSystem(modus: Modus, beiWechsel: (satz: Tokensatz) => void): () => void {
  if (modus !== 'system' || typeof window === 'undefined'
      || typeof window.matchMedia !== 'function') {
    return () => {};
  }
  const abfrage = window.matchMedia('(prefers-color-scheme: light)');
  const reagiere = () => beiWechsel(wendeAn('system'));
  abfrage.addEventListener('change', reagiere);
  return () => abfrage.removeEventListener('change', reagiere);
}
