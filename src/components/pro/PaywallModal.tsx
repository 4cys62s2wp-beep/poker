/* Paywall-Dialog beim Erreichen eines Limits.
   Bewusst freundlich: sagt, wann es gratis weitergeht, und macht das
   Upgrade zum bequemeren Weg – nicht zum einzigen. */

import { useEffect, useRef } from 'react';
import { useDialogTastatur } from '../../lib/dialog/tastatur';
import { Link } from 'react-router-dom';
import { Icon } from '../Icon';
import { useLang } from '../../i18n';
import { STR } from '../../i18n/pages/pro';
import { usePro } from '../../lib/pro/ProProvider';

export function PaywallModal() {
  const { paywallReason, closePaywall, enabled } = usePro();
  const { lang } = useLang();
  const L = STR[lang];
  const dialogRef = useRef<HTMLDivElement>(null);
  const spaeterRef = useRef<HTMLButtonElement>(null);
  const open = enabled && paywallReason !== null;

  /* Startfokus, Escape und Fokusfalle an einer Stelle (E-058). Vorher fehlte
     hier die Falle: Tab lief aus dem Dialog heraus auf die Seite dahinter. */
  useDialogTastatur(dialogRef, { aktiv: open, schliessen: closePaywall, zuerst: spaeterRef });

  if (!open) return null;

  const body =
    paywallReason === 'coach' ? L.limitCoach
    : paywallReason === 'play' ? L.limitPlay
    : paywallReason === 'bankroll' ? L.limitBankroll
    : L.lockedGeneric;
  const isLimit = paywallReason === 'coach' || paywallReason === 'play' || paywallReason === 'bankroll';

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={isLimit ? L.limitTitle : L.lockedTitle}
      onClick={closePaywall}
      style={{
        position: 'fixed', inset: 0, zIndex: 220, display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: 20,
        background: 'rgba(6,9,7,0.72)', backdropFilter: 'blur(3px)',
      }}
    >
      <div className="card" style={{ maxWidth: 420, width: '100%', textAlign: 'center', padding: '28px 22px' }}
        onClick={(e) => e.stopPropagation()}>
        <span
          style={{
            width: 46, height: 46, borderRadius: 14, display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center', marginBottom: 13,
            background: 'var(--auszeichnung-schwach)', color: 'var(--auszeichnung-lesbar)',
            border: '1px solid rgba(212,175,94,0.34)',
          }}
        >
          <Icon name={isLimit ? 'sun' : 'lock'} size={23} />
        </span>
        <div style={{ fontWeight: 800, fontSize: '1.125rem', marginBottom: 7 }}>
          {isLimit ? L.limitTitle : L.lockedTitle}
        </div>
        <p className="small muted" style={{ marginBottom: 18 }}>{body}</p>
        <div style={{ display: 'grid', gap: 9 }}>
          <Link to="/pro" className="btn primary" style={{ justifyContent: 'center' }} onClick={closePaywall}>
            {L.unlock}
          </Link>
          <button ref={spaeterRef} className="btn ghost sm" onClick={closePaywall}>
            {L.later}
          </button>
        </div>
      </div>
    </div>
  );
}
