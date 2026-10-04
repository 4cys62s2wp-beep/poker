/* Die Trefferliste: drei Gruppen, überall in derselben Reihenfolge. */

import { Link } from 'react-router-dom';
import { Icon } from './Icon';
import { Schloss } from './pro/Schloss';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/suche';
import { zeichenFuerPfad } from '../lib/zeichen';
import type { Ergebnis } from '../lib/suche';

interface Props {
  ergebnis: Ergebnis;
  abfrage: string;
  /** Nach dem Tipp auf einen Treffer — der Suchdialog schließt sich damit. */
  beiWahl?: () => void;
}

export function SuchTreffer({ ergebnis, abfrage, beiWahl }: Props) {
  const { lang } = useLang();
  const L = STR[lang];
  if (ergebnis.leer) {
    return <p className="small muted such-leer" role="status">{L.nichts(abfrage.trim())}</p>;
  }
  return (
    <div className="such-treffer">
      {ergebnis.werkzeuge.length > 0 && (
        <section aria-label={L.gruppeWerkzeuge}>
          <div className="eyebrow">{L.gruppeWerkzeuge}</div>
          <ul className="list-plain such-liste">
            {ergebnis.werkzeuge.map((z) => {
              const zeichen = zeichenFuerPfad(z.to);
              return (
                <li key={z.to}>
                  <Link to={z.to} className="such-zeile" onClick={beiWahl}>
                    <span className="zeichen">{zeichen && <Icon name={zeichen} size={18} />}</span>
                    <span className="text">
                      <strong>{z.titel}</strong>
                      {z.beschreibung && <span className="small muted">{z.beschreibung}</span>}
                    </span>
                    <Schloss pfad={z.to} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {ergebnis.lektionen.length > 0 && (
        <section aria-label={L.gruppeLektionen}>
          <div className="eyebrow">{L.gruppeLektionen}</div>
          <ul className="list-plain such-liste">
            {ergebnis.lektionen.map((h) => (
              <li key={h.lessonId}>
                <Link to={`/lernen/${h.moduleId}/${h.lessonId}`} className="such-zeile" onClick={beiWahl}>
                  <span className="text">
                    <strong>{h.lessonTitle}</strong>
                    <span className="small muted">
                      {h.art === 'ueberschrift' ? L.abschnitt(h.ausschnitt) : h.ausschnitt}
                    </span>
                  </span>
                  <Schloss pfad={`/lernen/${h.moduleId}/${h.lessonId}`} />
                  <span className="pill">{h.moduleTitle}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {ergebnis.begriffe.length > 0 && (
        <section aria-label={L.gruppeBegriffe}>
          <div className="eyebrow">{L.gruppeBegriffe}</div>
          <div className="such-begriffe">
            {ergebnis.begriffe.map((t) => (
              <Link key={t} to={`/nachschlagen/glossar?q=${encodeURIComponent(t)}`} className="chip-link" onClick={beiWahl}>
                {t}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
