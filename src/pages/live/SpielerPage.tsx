/* Alle Abende einer Person.
   ========================

   Erreichbar nur, indem man auf einen Namen tippt. Es gibt keine Adresse,
   die man kennen müsste, und kein Suchfeld, in das man sie schreibt.

   Eine Person ist hier ein Name und sonst nichts — kein Konto, kein Profil,
   keine Kennzahl über ihre Spielweise. Was dasteht, ist abzählbar: an wie
   vielen Abenden, wie oft gewonnen, wann zuletzt. */

import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/ui';
import { useLang } from '../../i18n';
import { STR } from '../../i18n/pages/abende';
import { abendeVon, ladeAbende, spielerUebersicht } from '../../lib/session/abende';
import { grobeDauer } from '../../lib/session/dauer';

export function SpielerPage() {
  const { lang } = useLang();
  const L = STR[lang];
  const { name = '' } = useParams();

  const alle = useMemo(() => ladeAbende(), []);
  const meine = useMemo(() => abendeVon(alle, name), [alle, name]);
  const uebersicht = useMemo(
    () => spielerUebersicht(meine).find((s) => s.abende === meine.length) ?? null,
    [meine],
  );

  const datum = (ms: number) => new Date(ms).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="page">
      <PageHeader
        eyebrow={L.bereich}
        title={L.spielerTitel(uebersicht?.name ?? name)}
        sub={uebersicht ? L.spielerSub(uebersicht.abende, uebersicht.siege) : undefined}
        backTo="/session/abende"
        backLabel={L.zurueckListe}
      />

      <div className="abende-liste">
        {meine.map((a) => {
          const ich = a.spieler.find((s) => s.name.trim().toLocaleLowerCase('de')
            === name.trim().toLocaleLowerCase('de'))!;
          return (
            <Link key={a.id} to={`/session/abende/${a.id}`} className="abend-karte">
              <span className="abend-datum">{datum(a.begonnen)}</span>
              <span className="abend-sieger">
                {L.platz(ich.platz)} {ich.platz === 1 ? L.gewonnen : ''}
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
