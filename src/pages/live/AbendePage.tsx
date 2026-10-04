/* Frühere Abende — die Liste.
   ==========================

   Es gibt kein Suchfeld. Wer einen früheren Abend sucht, sucht ihn über eine
   Person: „der Abend, an dem Mira gewonnen hat". Also stehen die Namen als
   Knöpfe da, und ein Tipp darauf führt zu allen Abenden dieser Person.

   Warum kein Suchfeld: Ein Suchfeld verlangt, dass man weiß, wonach man
   sucht, und dass man es gleich schreibt wie damals. Beides trifft bei
   handgetippten Namen nicht zu. Eine Liste von zwanzig Namen ist schneller
   gelesen als ein Name getippt. */

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState, PageHeader } from '../../components/ui';
import { zeichenFuer } from '../../lib/zeichen';
import { useLang } from '../../i18n';
import { STR } from '../../i18n/pages/abende';
import { ladeAbende, spielerUebersicht, zusammenfassung } from '../../lib/session/abende';
import { grobeDauer } from '../../lib/session/dauer';

export function AbendePage() {
  const { lang } = useLang();
  const L = STR[lang];
  const abende = useMemo(() => ladeAbende(), []);
  const namen = useMemo(() => spielerUebersicht(abende), [abende]);
  const z = useMemo(() => zusammenfassung(abende), [abende]);
  const kurz = (ms: number) => new Date(ms).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-GB', {
    weekday: 'short', day: 'numeric', month: 'short',
  });
  const datum = (ms: number) => new Date(ms).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-GB', {
    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
  });

  if (abende.length === 0) {
    return (
      <div className="page">
        <PageHeader title={L.listeTitel} backTo="/session"
          />
        <EmptyState
          icon={zeichenFuer('/session/abende')}
          title={L.leerTitel}
          body={L.leerSub}
          actionLabel={L.abendEinrichten}
          actionTo="/session/live/einrichten"
        />
      </div>
    );
  }

  return (
    <div className="page">
      <PageHeader title={L.listeTitel} sub={L.zusammenfassung(z.abende, z.personen, kurz(z.zuletzt ?? 0))}
        backTo="/session" />
      <p className="hinweis">{L.listeSub}</p>

      {/* Die Namen zuerst: Sie sind der Weg, nicht die Datumsliste. */}
      <section className="abende-namen">
        <h2>{L.alleNamen}</h2>
        <div className="abende-namen-reihe">
          {namen.map((s) => (
            <Link key={s.name} to={`/session/spieler/${encodeURIComponent(s.name)}`}
              className="abende-name">
              {s.name}
            </Link>
          ))}
        </div>
      </section>

      <div className="abende-liste">
        {abende.map((a) => {
          const sieger = a.spieler.filter((s) => s.platz === 1);
          return (
            <Link key={a.id} to={`/session/abende/${a.id}`} className="abend-karte">
              <span className="abend-datum">{datum(a.begonnen)}</span>
              <span className="abend-sieger">
                {sieger.map((s) => s.name).join(', ')} · {L.gewonnen}
              </span>
              <span className="hinweis">
                {L.spielerZahl(a.spieler.length)} · {grobeDauer(a.gespielt_ms, lang)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
