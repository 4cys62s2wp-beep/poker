/* Suchen, ohne auf die Form der Zeichen zu achten.
   ================================================

   Seit E-050 steht in den Texten „Hold’em" mit typografischem Apostroph.
   Eine Tastatur liefert je nach Gerät und Einstellung mal ’ und mal ' —
   iOS setzt beim Tippen automatisch das typografische Zeichen, ein
   angestecktes Keyboard und die meisten Android-Tastaturen das gerade. Wer
   „Hold'em" eintippt, würde sonst nichts finden, obwohl das Wort dasteht.

   Wichtig ist, dass die Umformung **zeichenweise** bleibt: Jedes ersetzte
   Zeichen wird durch genau eines ersetzt. Nur so stimmt die Fundstelle
   (`indexOf`) noch mit dem ursprünglichen Text überein — die Lernsuche
   hebt den Treffer im Originaltext hervor. */

/** Text so aufbereiten, dass die Form der Anführungszeichen nicht zählt. */
export function suchbar(text: string): string {
  return text.toLowerCase().replace(/[„“”]/g, '"').replace(/[’‘]/g, "'");
}
