/* „Konzept nachlesen: <Lektion>" — vom Trainer zurück in die Lektion.
   Abgeleitet aus derselben Zuordnung wie der Knopf „Jetzt üben" nach dem
   Quiz (`lib/lernen/uebung.ts`); es gibt keine zweite Liste. */

import { Link } from 'react-router-dom';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/uebungsstand';
import { lektionenFuer, type UebungsZiel } from '../lib/lernen/uebung';

export function KonzeptLink({ ziel }: { ziel: UebungsZiel }) {
  const { lang, content } = useLang();
  const L = STR[lang];
  const ziele = lektionenFuer(ziel).slice(0, 2).flatMap((id) => {
    const modul = content.modules.find((m) => m.lessons.some((l) => l.id === id));
    const lektion = modul?.lessons.find((l) => l.id === id);
    return modul && lektion ? [{ zu: `/lernen/${modul.id}/${lektion.id}`, titel: lektion.title }] : [];
  });
  if (ziele.length === 0) return null;
  return (
    <p className="konzept-link small muted">
      {L.konzeptNachlesen}{' '}
      {ziele.map((z, i) => (
        <span key={z.zu}>
          {i > 0 && ' · '}
          <Link to={z.zu}>{z.titel}</Link>
        </span>
      ))}
    </p>
  );
}
