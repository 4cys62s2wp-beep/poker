/* Woran man erkennt, dass jemand ein Konto hat — ohne Firebase zu laden.
   ====================================================================

   Der Cloud-Teil ist der mit Abstand schwerste Brocken der App: Firebase
   wiegt gebaut 706 kB (rund 213 kB übertragen). Bis E-043 wurde er bei
   **jedem** Start geholt, weil der CloudProvider beim Einhängen
   bedingungslos `getCloud()` rief — auch bei jemandem, der sich nie
   anmeldet und die App nur zum Üben benutzt. Gemessen: 37 % der Bytes des
   ersten Starts für eine Funktion, die die meisten nie anfassen.

   Firebase muss aber sofort geladen werden, wenn jemand angemeldet ist —
   sonst stünde er beim Öffnen als abgemeldet da. Die Frage ist also: Woher
   weiß man das, bevor man Firebase fragt?

   Aus zwei Spuren, die die App selbst hinterlässt:

   1. **Ein verknüpftes Profil.** `activeProfile.cloudUid` steht im
      Gerätespeicher, sobald ein Profil an ein Konto gebunden wurde.
   2. **Diese Marke.** Sie wird beim Anmelden gesetzt und beim Abmelden
      gelöscht — für den Fall, dass jemand angemeldet ist, ohne dass das
      gerade aktive Profil verknüpft wäre.

   Geht beides verloren, ist der Schaden klein und heilt von selbst: Die
   App startet als abgemeldet, und sobald die Kontokarte im Profil
   erscheint, wird Firebase geladen und die Sitzung wiederhergestellt. */

const MARKE = 'pokermentor-konto-v1';

/** Merken, dass auf diesem Gerät ein Konto benutzt wird. */
export function merkeKonto(ja: boolean): void {
  try {
    if (ja) localStorage.setItem(MARKE, '1');
    else localStorage.removeItem(MARKE);
  } catch {
    /* Privater Modus oder gesperrter Speicher: Dann wird Firebase eben
       erst beim Öffnen der Kontokarte geladen. Kein Grund abzustürzen. */
  }
}

/** Ist auf diesem Gerät schon einmal ein Konto benutzt worden? */
export function kontoGemerkt(): boolean {
  try {
    return localStorage.getItem(MARKE) === '1';
  } catch {
    return false;
  }
}
