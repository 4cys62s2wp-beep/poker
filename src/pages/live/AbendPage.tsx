/* Ein einzelner Abend.
   ===================

   Was hier steht, ist das, was man am nächsten Tag noch wissen will: wer
   dabei war, wer gewonnen hat, wie lange es ging. Die Namen sind wieder
   Knöpfe — von hier aus kommt man zu den anderen Abenden derselben Person.

   In dieser Datei steht keine Gestaltungszahl und keine gerechnete Zahl. Die
   Plätze kommen fertig aus `abende.ts`. */

import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageHeader } from '../../components/ui';
import { useLang } from '../../i18n';
import { STR } from '../../i18n/pages/abende';
import { ladeAbende } from '../../lib/session/abende';
import { grobeDauer } from '../../lib/session/dauer';

export function AbendPage() {
  const { lang } = useLang();
  const L = STR[lang];
  const { id } = useParams();
  const abend = useMemo(() => ladeAbende().find((a) => a.id === id), [id]);

  if (!abend) {
    return (
      <div className="page">
        <PageHeader eyebrow={L.bereich} title={L.unbekannterAbend}
          backTo="/session/abende" backLabel={L.zurueckListe} />
      </div>
    );
  }

  const datum = new Date(abend.begonnen).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const letzte = abend.stufen[Math.max(0, abend.erreichte_stufe - 1)];
  const zahl = (n: number) => n.toLocaleString(lang === 'de' ? 'de-DE' : 'en-GB');

  return (
    <div className="page">
      <PageHeader eyebrow={L.bereich} title={datum}
        backTo="/session/abende" backLabel={L.zurueckListe} />

      <div className="abend-kopfzahlen">
        <div><span className="hinweis">{L.dauer}</span><span>{grobeDauer(abend.gespielt_ms, lang)}</span></div>
        <div><span className="hinweis">{L.stufe}</span><span>{letzte[0]} / {letzte[1]}</span></div>
        <div><span className="hinweis">{L.startchips}</span><span>{zahl(abend.startchips)}</span></div>
      </div>

      <div className="abend-tabelle">
        {abend.spieler.map((s) => (
          <div key={s.name} className={`abend-zeile${s.stand === null ? ' raus' : ''}`}>
            <span className="abend-platz">{L.platz(s.platz)}</span>
            <Link to={`/session/spieler/${encodeURIComponent(s.name)}`} className="abende-name">
              {s.name}
            </Link>
            <span className="abend-stand">
              {s.stand === null ? L.keineChips : `${zahl(s.stand)} ${L.chips}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
