/* Ein Fachbegriff, der sich antippen lässt.
   =========================================

   Antippen öffnet ein Blatt von unten (dasselbe Muster wie „Warum diese
   Zahl", `Herkunft.tsx`): Es verschiebt nichts auf der Seite und kommt dort
   her, wo der Daumen ist. Es zeigt die Erklärung des Glossars, verwandte
   Begriffe und den Weg ins Glossar. */

import { useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import type { GlossaryEntry } from '../content/types';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/herkunft';
import { STR as GL } from '../i18n/pages/glossarypage';
import { useDialogTastatur } from '../lib/dialog/tastatur';
import { zerlege } from '../lib/glossar/verknuepfen';

/** Der Begriff als Knopf im Text — gestrichelt unterstrichen, damit man ihn
 *  als antippbar erkennt, ohne dass er wie ein Link ins Nichts aussieht. */
export function Begriff({ eintrag, children }: { eintrag: GlossaryEntry; children: ReactNode }) {
  const { lang } = useLang();
  const [offen, setOffen] = useState(false);
  return (
    <>
      <button
        type="button"
        className="begriff"
        aria-haspopup="dialog"
        aria-label={`${GL[lang].begriffOeffnen}: ${eintrag.term}`}
        onClick={() => setOffen(true)}
      >
        {children}
      </button>
      {offen && <BegriffBlatt eintrag={eintrag} schliessen={() => setOffen(false)} />}
    </>
  );
}

function BegriffBlatt({ eintrag, schliessen }: { eintrag: GlossaryEntry; schliessen: () => void }) {
  const { lang } = useLang();
  const T = STR[lang];
  const G = GL[lang];
  const dialogRef = useRef<HTMLDivElement>(null);
  const zuRef = useRef<HTMLButtonElement>(null);
  useDialogTastatur(dialogRef, { schliessen, zuerst: zuRef });

  return createPortal(
    <div ref={dialogRef} className="herkunft-grund" role="dialog" aria-modal="true" aria-label={eintrag.term} onClick={schliessen}>
      <div className="herkunft-blatt" onClick={(e) => e.stopPropagation()}>
        <div className="herkunft-kopf">
          <div>
            <div className="herkunft-titel">{G.categoryLabels[eintrag.category]}</div>
            <div className="herkunft-wert">{eintrag.term}</div>
          </div>
          <button ref={zuRef} type="button" className="herkunft-zu" onClick={schliessen}>
            {T.schliessen}
          </button>
        </div>
        <div className="herkunft-inhalt">
          <p>{eintrag.definition}</p>
          {eintrag.related && eintrag.related.length > 0 && (
            <p className="herkunft-leise">{G.seeAlso} {eintrag.related.join(' · ')}</p>
          )}
          <Link className="btn sm" to={`/nachschlagen/glossar?q=${encodeURIComponent(eintrag.term)}`} onClick={schliessen}>
            {G.imGlossar}
          </Link>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** Fließtext, in dem das erste Vorkommen der Fachbegriffe antippbar ist. */
export function MitBegriffen({ text, max = 2 }: { text: string; max?: number }) {
  const { content } = useLang();
  const stuecke = zerlege(text, content.glossary, max);
  return (
    <>
      {stuecke.map((s, i) => (s.eintrag
        // eslint-disable-next-line react/no-array-index-key
        ? <Begriff key={i} eintrag={s.eintrag}>{s.text}</Begriff>
        // eslint-disable-next-line react/no-array-index-key
        : <span key={i}>{s.text}</span>))}
    </>
  );
}
