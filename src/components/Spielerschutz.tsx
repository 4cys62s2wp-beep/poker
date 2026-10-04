/* Die Fußzeile „Spiel mit Grenzen · Hilfe: check-dein-spiel.de".
   ============================================================

   Sie steht auf den zwei Seiten, auf denen Geld vorkommt (Bankroll,
   Auszahlung) — ruhig, am Ende, ohne Warnfarbe. Wer auf dieser Seite ist, hat
   sich nicht verirrt; er braucht keine Mahnung, aber er soll wissen, wo er
   Hilfe findet, bevor er sie braucht (Modul 6 behandelt das ausführlich). */

import { useLang } from '../i18n';
import { STR } from '../i18n/pages/spielerschutz';

export function Spielerschutz() {
  const { lang } = useLang();
  const L = STR[lang];
  return (
    <p className="spielerschutz small faint">
      {L.text} · {L.hilfe}{' '}
      <a href="https://www.check-dein-spiel.de" target="_blank" rel="noopener noreferrer" aria-label={L.linkAria}>
        {L.link}
      </a>
    </p>
  );
}
