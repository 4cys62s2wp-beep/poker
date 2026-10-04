/* Ein Blatt von unten — Erklärung auf Wunsch.
   ===========================================

   Dasselbe Muster wie „Warum diese Zahl" (`Herkunft.tsx`) und das Begriffsblatt
   (`Begriff.tsx`): Es verschiebt nichts auf der Seite und kommt von dort, wo
   der Daumen ist. Der Übungstisch nutzt es für „Warum?" — die Erklärung gehört
   nicht in die Leiste, sie wird gerufen. */

import { useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useDialogTastatur } from '../lib/dialog/tastatur';

interface Props {
  /** Kleine Zeile über dem Titel. */
  kopf?: string;
  titel: string;
  schliessenLabel: string;
  onClose: () => void;
  children: ReactNode;
  /** Startfokus auf „Schließen“ setzen? Aus, wenn ein Feld im Blatt `autoFocus`
   *  trägt (die Suche). */
  startfokus?: boolean;
}

export function Blatt({ kopf, titel, schliessenLabel, onClose, children, startfokus = true }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const zuRef = useRef<HTMLButtonElement>(null);
  useDialogTastatur(dialogRef, { schliessen: onClose, zuerst: zuRef, startfokus });

  return createPortal(
    <div ref={dialogRef} className="herkunft-grund" role="dialog" aria-modal="true" aria-label={titel} onClick={onClose}>
      <div className="herkunft-blatt" onClick={(e) => e.stopPropagation()}>
        <div className="herkunft-kopf">
          <div>
            {kopf && <div className="herkunft-titel">{kopf}</div>}
            <div className="herkunft-wert">{titel}</div>
          </div>
          <button ref={zuRef} type="button" className="herkunft-zu" onClick={onClose}>
            {schliessenLabel}
          </button>
        </div>
        <div className="herkunft-inhalt">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
