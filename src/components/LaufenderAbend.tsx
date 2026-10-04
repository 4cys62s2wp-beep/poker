/* Die Karte „Läuft gerade" — Startseite und Bereichsseite zeigen dieselbe.
   =====================================================================

   Wer einen Abend führt, kommt aus der Tasche, vom Tisch oder aus einer anderen
   App zurück und will eines wissen: Läuft er noch, welche Blinds, wie viel
   Zeit? Die Karte stand nur auf der Startseite; auf der Bereichsseite
   „Live-Session" war es eine Kachel mit „Läuft seit …" ohne Blinds. Jetzt ist
   es dieselbe Karte an beiden Orten (E-094). */

import { Link } from 'react-router-dom';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/hub';
import { standDerUhr } from '../lib/live/uhr';
import { alsUhr, grobeDauer } from '../lib/session/dauer';
import { nochDabei, type LaufendeSession } from '../lib/session/laufend';

export function LaufenderAbend({ laufend, mehr = false, ohneTitel = false }: { laufend: LaufendeSession; mehr?: boolean; ohneTitel?: boolean }) {
  const { lang } = useLang();
  const L = STR[lang];
  const jetzt = Date.now();
  const uhr = standDerUhr(laufend, jetzt);
  /* Ein Cash-Abend hat keine Restzeit, nur die gespielte; ein pausierter sagt es. */
  const zeit = uhr.cash
    ? L.laeuftGespielt(alsUhr(uhr.ueber_ms))
    : uhr.istLetzte
      ? L.laeuftLetzte
      : L.laeuftRest(alsUhr(uhr.rest_ms));
  return (
    <div className="start-einstieg gross">
      <span className="marke">{L.fortsetzenMarke}</span>
      {/* Ein Abend hat keinen Namen — die App hat nie einen erfragt. Was ihn
          benennt, ist sein Beginn; er ist auch anderswo seine Kennung. */}
      {!ohneTitel && (
        <span className="titel">{L.laeuftSeit(grobeDauer(jetzt - laufend.begonnen, lang, 'dativ'))}</span>
      )}
      <span className="unter">
        {L.laeuftMit(nochDabei(laufend).length, uhr.blinds[0], uhr.blinds[1])}
        {' · '}
        {uhr.laeuft ? zeit : L.laeuftPausiert}
      </span>
      <Link to="/session/live" className="start-knopf haupt">{L.zurueckInDieRunde}</Link>
      {mehr && <Link to="/session" className="start-mehr">{L.sessionAlles}</Link>}
    </div>
  );
}
