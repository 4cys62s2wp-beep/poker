/* Die öffentliche Adresse der App — an einer Stelle.
   =================================================

   `og:url` und `og:image` in `index.html` standen fest auf der github.io-Adresse.
   Zieht die App auf eine eigene Domain um, bleibt jede geteilte Vorschau auf der
   alten stehen — und niemand merkt es, weil die App selbst (QR-Code,
   „Link kopieren") längst die neue benutzt.

   Jetzt steht in `index.html` ein Platzhalter; beim Bauen setzt `vite.config.ts`
   die Adresse aus `VITE_PUBLIC_URL` ein, sonst die Vorgabe unten. Der Umzug ist
   eine Zeile in den Einstellungen des Hostings, keine Änderung im Quelltext. */

/** Wo die App heute liegt. */
export const STANDARD_ADRESSE = 'https://4cys62s2wp-beep.github.io/poker/';

export const PLATZHALTER = '%OEFFENTLICHE_ADRESSE%';

/** Eine brauchbare Adresse: https, mit Schrägstrich am Ende. Alles andere → Vorgabe. */
export function bereinige(roh: string | undefined): string {
  const a = (roh ?? '').trim();
  if (!/^https:\/\/[^\s/]+(\/[^\s]*)?$/.test(a)) return STANDARD_ADRESSE;
  return a.endsWith('/') ? a : `${a}/`;
}

export function setzeAdresse(html: string, roh: string | undefined): string {
  return html.split(PLATZHALTER).join(bereinige(roh));
}
