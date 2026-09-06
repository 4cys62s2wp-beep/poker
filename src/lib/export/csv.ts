/* CSV für Tabellenkalkulationen — deutsch, weil die Datei es ist.
   ==============================================================

   Der Export des Bankroll-Trackers trägt eine deutsche Kopfzeile und ein
   Semikolon als Trennzeichen; beides ist eine bewusste Entscheidung (siehe
   `i18n/pages/bankroll.ts`). Dann muss aber auch der Rest der Datei deutsch
   sein: Excel liest im deutschen Gebietsschema `12.50` nicht als Betrag,
   sondern als **12. Mai**. Ein Buy-in wird so zu einem Datum, und die
   Summenzeile darunter bleibt leer.

   Zwei Regeln, die diese Datei verlässlich machen:

   1. **Text kommt in Anführungszeichen.** Nicht nur der Bequemlichkeit
      wegen: Ein Semikolon oder ein Zeilenumbruch in einer Notiz verschöbe
      sonst alle folgenden Spalten.
   2. **Text, der wie eine Formel beginnt, bekommt ein Hochkomma.** `=`, `+`,
      `-`, `@` und Steuerzeichen am Zellanfang führt eine
      Tabellenkalkulation beim Öffnen aus. Die Werte stammen aus einer
      Sicherungsdatei, die durch fremde Hände gegangen sein kann. */

/** Alles, was am Zellanfang als Formel gelesen würde. */
const FORMELSTART = /^[=+\-@\t\r]/;

/** Ein Textfeld: eingefasst, escaped, entschärft. */
export function csvText(wert: string): string {
  const entschaerft = FORMELSTART.test(wert) ? `'${wert}` : wert;
  return `"${entschaerft.replace(/"/g, '""')}"`;
}

/**
 * Eine Zahl in deutscher Schreibweise, ohne Tausenderpunkt (der wäre in
 * einer Zelle nur eine weitere Quelle für Fehldeutungen). Ganze Zahlen
 * bleiben ganz, alles andere bekommt zwei Nachkommastellen — Cent.
 */
export function csvZahl(n: number): string {
  if (!Number.isFinite(n)) return '0';
  const gerundet = Math.round(n * 100) / 100;
  return gerundet.toFixed(Number.isInteger(gerundet) ? 0 : 2).replace('.', ',');
}

/**
 * Baut die vollständige Datei. Voran steht ein BOM, sonst zeigt Excel
 * „Glücksspiel" als „GlÃ¼cksspiel"; die Zeilen enden nach RFC 4180 mit
 * CRLF, damit ein Umbruch *innerhalb* einer Notiz eindeutig bleibt.
 */
export function csvDatei(
  kopf: readonly string[],
  zeilen: ReadonlyArray<ReadonlyArray<string | number>>,
): string {
  const alle = [
    kopf.map(csvText).join(';'),
    ...zeilen.map((z) => z.map((w) => (typeof w === 'number' ? csvZahl(w) : csvText(w))).join(';')),
  ];
  return '\uFEFF' + alle.join('\r\n') + '\r\n';
}
