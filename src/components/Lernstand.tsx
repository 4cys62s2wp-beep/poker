/* „Dein Lernstand“ — wie sicher man je Thema ist, und was als Nächstes dran ist.
   ===========================================================================

   Das Profil zeigte eine Summe über alle Trainer. Hier steht je Thema, wie die
   letzten 20 Antworten liefen, in drei Stufen mit Wort (die Farbe allein sagte
   es sonst nur denen, die sie sehen): sicher, wackelt, noch offen. Das
   schwächste Thema bekommt zwei Wege weiter — üben und nachlesen (E-097). */

import { Link } from 'react-router-dom';
import { Icon } from './Icon';
import { useAppState } from '../state/AppState';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/lernstand';
import { MIN_ANTWORTEN, lernstand, schwaechste, type Stufe } from '../lib/lernstand';

const ZEICHEN: Record<Stufe, 'check' | 'info' | 'x' | null> = {
  sicher: 'check', wackelt: 'info', offen: 'x', zuWenig: null,
};

export function Lernstand() {
  const { data } = useAppState();
  const { lang } = useLang();
  const L = STR[lang];
  const zeilen = lernstand(data.trainers);
  const duemmste = schwaechste(zeilen);

  return (
    <section aria-labelledby="lernstand-titel" className="lernstand">
      <h2 className="section-title" id="lernstand-titel">{L.titel}</h2>
      {zeilen.length === 0 ? (
        <div className="card">
          <p className="small muted lernstand-text">{L.leer}</p>
          <Link className="btn sm primary" to="/lernen">{L.leerWeg}</Link>
        </div>
      ) : (
        <div className="card">
          <p className="small muted lernstand-text">{L.sub}</p>
          <ul className="list-plain lernstand-liste">
            {zeilen.map((z) => (
              <li key={z.thema} className={`lernstand-zeile ${z.stufe}`}>
                <span className="thema">{L.themen[z.thema]}</span>
                <span className={`stufe-marke ${z.stufe}`}>
                  {ZEICHEN[z.stufe] && <Icon name={ZEICHEN[z.stufe]!} size={14} />}
                  {L.stufen[z.stufe]}
                </span>
                <span className="small muted bilanz">
                  {z.stufe === 'zuWenig' ? L.bisher(z.antworten, MIN_ANTWORTEN) : L.bilanz(z.richtig, z.antworten)}
                </span>
                {duemmste?.thema === z.thema && (
                  <span className="lernstand-wege">
                    <Link className="btn sm primary" to={z.uebenPfad}>{L.ueben}</Link>
                    {z.lektion && (
                      <Link className="btn sm" to={`/lernen/${z.lektion.split('-')[0]}/${z.lektion}`}>{L.nachlesen}</Link>
                    )}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
