/* Die drei Urteile, mit denen die App eine Antwort bewertet.
   ============================================================

   Vorher gab es sieben Varianten für dasselbe: „Richtig!", „Stark
   geschätzt!", „Leider nein.", „Daneben.", „Leider falsch.", „Nicht ganz.",
   „Es sind 9 Outs." — je Trainer eine eigene Stimme, und ein ✓ oder ✗ als
   Textzeichen davor, das mit der Schrift mal groß, mal klein, mal gar nicht
   erschien. Jetzt gibt es drei Wörter und ein Zeichen aus dem Symbolsatz
   (E-079). */

import { defineStrings } from '.';

export const STR = defineStrings(
  { richtig: 'Richtig', falsch: 'Nicht ganz', knapp: 'Hauchdünn' },
  { richtig: 'Correct', falsch: 'Not quite', knapp: 'Razor-thin' },
);
