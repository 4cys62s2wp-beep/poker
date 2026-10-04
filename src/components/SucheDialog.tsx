/* Die Suche von überall: ein Blatt mit Suchfeld und Treffern.
   ==========================================================

   Erreichbar über die Lupe in der Kopfzeile (Handy), den Eintrag in der
   Seitenleiste und die Tasten „/“ und Strg + K (Desktop). Sie fragt denselben
   Index wie die Felder auf „Nachschlagen“ und „Lernen“; Enter führt auf den
   besten Treffer, ein Tipp auf einen Treffer schließt das Blatt (E-096). */

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Blatt } from './Blatt';
import { SuchFeld } from './SuchFeld';
import { SuchTreffer } from './SuchTreffer';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/suche';
import { MIN_ZEICHEN, bestesZiel, suche } from '../lib/suche';
import { useSuchquellen } from '../lib/suche/nutzen';

export function SucheDialog({ onClose }: { onClose: () => void }) {
  const { lang } = useLang();
  const L = STR[lang];
  const navigate = useNavigate();
  const quellen = useSuchquellen();
  const [q, setQ] = useState('');
  const ergebnis = useMemo(() => suche(q, quellen), [q, quellen]);
  const sucht = q.trim().length >= MIN_ZEICHEN;

  function absenden(e: React.FormEvent) {
    e.preventDefault();
    const ziel = bestesZiel(ergebnis);
    if (ziel) { navigate(ziel); onClose(); }
  }

  return (
    <Blatt kopf={L.dialogKopf} titel={L.dialogTitel} schliessenLabel={L.schliessen} onClose={onClose} startfokus={false}>
      <form role="search" onSubmit={absenden}>
        <SuchFeld id="suche-dialog" value={q} onChange={setQ} autoFokus />
      </form>
      <div className="such-dialog-treffer">
        {sucht
          ? <SuchTreffer ergebnis={ergebnis} abfrage={q} beiWahl={onClose} />
          : <p className="small faint">{L.tastenHinweis}</p>}
      </div>
    </Blatt>
  );
}
