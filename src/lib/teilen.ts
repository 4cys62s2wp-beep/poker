/* Etwas als Text weitergeben: Teilen-Dialog, sonst Zwischenablage.
   ===============================================================

   Dasselbe Verfahren hatten der Abschluss eines Abends (E-094) und der Drill;
   jetzt auch das Tages-Quiz (E-096). Es steht an einer Stelle, damit der Weg
   bei allen derselbe ist: erst `navigator.share`, und wer abbricht oder keinen
   Dialog hat, bekommt den Text in die Zwischenablage. Gesagt wird beides. */

export type Teilergebnis = 'geteilt' | 'kopiert' | 'fehler';

/** Die Adresse der App, wie sie gerade geöffnet ist — zieht sie um, stimmt der
 *  Link automatisch (wie beim QR-Code in „App teilen“). */
export function appUrl(): string {
  return `${location.origin}${location.pathname}`;
}

export async function teileText(text: string, url?: string): Promise<Teilergebnis> {
  try {
    if (typeof navigator.share === 'function') {
      await navigator.share(url ? { text, url } : { text });
      return 'geteilt';
    }
  } catch {
    /* Abgebrochen oder verweigert: dann eben die Zwischenablage. */
  }
  try {
    await navigator.clipboard.writeText(url ? `${text}\n${url}` : text);
    return 'kopiert';
  } catch {
    return 'fehler';
  }
}

export interface QuizText {
  /** Der Tag als lesbares Datum. */
  datum: string;
  score: number;
  total: number;
  /** Tage in Folge; unter zwei wird nichts genannt. */
  serie: number;
}

/** Die Ergebniszeile des Tages-Quiz — nur Zahlen und Tage, kein Geld, kein Spott. */
export function quizErgebnisText(a: QuizText, lang: 'de' | 'en'): string {
  const kopf = lang === 'de' ? `PokerMentor Tages-Quiz, ${a.datum}` : `PokerMentor Daily Quiz, ${a.datum}`;
  const stand = lang === 'de'
    ? `${a.score} von ${a.total} richtig`
    : `${a.score} of ${a.total} correct`;
  const serie = a.serie >= 2
    ? (lang === 'de' ? ` · ${a.serie} Tage in Folge` : ` · ${a.serie} days in a row`)
    : '';
  return `${kopf}: ${stand}${serie}`;
}
