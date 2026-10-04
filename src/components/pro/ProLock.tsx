/* Sperr-Karte: erscheint anstelle eines Pro-Inhalts.
   Zeigt immer, WAS dahinter steckt – eine Sperre ohne Nutzenversprechen
   verärgert nur, statt zu überzeugen – und, was gratis bleibt (E-098). Eine
   Vorschau (ein, zwei echte Beispiele) steht davor, wo es sie gibt. */

import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../Icon';
import { useLang } from '../../i18n';
import { STR } from '../../i18n/pages/pro';
import { FREE_MODULE_IDS, GRATIS_TRAINER_ANZAHL } from '../../lib/pro/plan';

interface Props {
  /** Kurzer Text, der den konkreten Nutzen benennt. */
  text?: string;
  /** Überschrift, z. B. der Name des gesperrten Inhalts. */
  title?: string;
  compact?: boolean;
  /** Echte Beispiele aus dem gesperrten Inhalt. */
  vorschau?: ReactNode;
}

export function ProLock({ text, title, compact, vorschau }: Props) {
  const { lang } = useLang();
  const L = STR[lang];

  return (
    <>
      {vorschau && (
        <section className="sperre-vorschau" aria-label={L.previewTitle}>
          <h2 className="section-title">{L.previewTitle}</h2>
          {vorschau}
        </section>
      )}
      <div className={`card pro-sperre${compact ? ' kompakt' : ''}`}>
        <span className="sperre-zeichen">
          <Icon name="lock" size={22} />
        </span>
        <div className="sperre-titel">{title ?? L.lockedTitle}</div>
        <p className="small muted sperre-text">{text ?? L.lockedGeneric}</p>
        {!compact && (
          <p className="small faint sperre-gratis">{L.staysFree(FREE_MODULE_IDS.length, GRATIS_TRAINER_ANZAHL)}</p>
        )}
        <Link to="/pro" className="btn primary sm">
          {L.unlock}
        </Link>
      </div>
    </>
  );
}
