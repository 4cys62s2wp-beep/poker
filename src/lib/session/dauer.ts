/* Zeitspannen für die Anzeige.
   ===========================

   Eigene Datei, weil zwei Bildschirme dasselbe brauchen und eine
   Zeitformatierung, die es zweimal gibt, nach der dritten Änderung zweimal
   verschieden ist. */

/** Eine Spanne als „1:23:45" oder „12:34". Immer zweistellige Minuten und
 *  Sekunden, damit die Anzeige beim Herunterzählen nicht in der Breite
 *  springt. */
export function alsUhr(ms: number): string {
  const gesamt = Math.max(0, Math.floor(ms / 1000));
  const s = gesamt % 60;
  const m = Math.floor(gesamt / 60) % 60;
  const h = Math.floor(gesamt / 3600);
  const zwei = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${zwei(m)}:${zwei(s)}` : `${m}:${zwei(s)}`;
}

/** Eine Spanne grob, für einen Satz: „3 Stunden", „25 Minuten", „gerade eben".
 *
 *  Grob mit Absicht: Auf der Startseite interessiert „seit einer guten
 *  Stunde", nicht „seit 1:07:42". Genau wird es erst dort, wo es zählt. */
export function grobeDauer(ms: number, sprache: 'de' | 'en'): string {
  const minuten = Math.floor(ms / 60000);
  const de = sprache === 'de';
  if (minuten < 2) return de ? 'gerade eben' : 'just now';
  if (minuten < 60) return de ? `${minuten} Minuten` : `${minuten} minutes`;
  const stunden = Math.floor(minuten / 60);
  const rest = minuten % 60;
  const stundenText = stunden === 1
    ? (de ? '1 Stunde' : '1 hour')
    : (de ? `${stunden} Stunden` : `${stunden} hours`);
  if (rest < 10) return stundenText;
  return de ? `${stundenText} ${rest} Minuten` : `${stundenText} ${rest} minutes`;
}
