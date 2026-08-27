/* Sperr-Karte: erscheint anstelle eines Pro-Inhalts.
   Zeigt immer, WAS dahinter steckt – eine Sperre ohne Nutzenversprechen
   verärgert nur, statt zu überzeugen. */

import { Link } from 'react-router-dom';
import { Icon } from '../Icon';
import { useLang } from '../../i18n';
import { STR } from '../../i18n/pages/pro';

interface Props {
  /** Kurzer Text, der den konkreten Nutzen benennt. */
  text?: string;
  /** Überschrift, z. B. der Name des gesperrten Inhalts. */
  title?: string;
  compact?: boolean;
}

export function ProLock({ text, title, compact }: Props) {
  const { lang } = useLang();
  const L = STR[lang];

  return (
    <div
      className="card"
      style={{
        borderColor: 'rgba(212,175,94,0.3)',
        background: 'linear-gradient(160deg, rgba(212,175,94,0.07), rgba(236,233,223,0.02))',
        textAlign: 'center',
        padding: compact ? '18px 16px' : '30px 22px',
      }}
    >
      <span
        style={{
          width: 44, height: 44, borderRadius: 14, display: 'inline-flex',
          alignItems: 'center', justifyContent: 'center', marginBottom: 12,
          background: 'var(--auszeichnung-schwach)', color: 'var(--auszeichnung-lesbar)',
          border: '1px solid rgba(212,175,94,0.34)',
        }}
      >
        <Icon name="lock" size={22} />
      </span>
      <div style={{ fontWeight: 800, fontSize: compact ? 15.5 : 17, marginBottom: 5 }}>
        {title ?? L.lockedTitle}
      </div>
      <p className="small muted" style={{ marginBottom: 14, maxWidth: 420, marginInline: 'auto' }}>
        {text ?? L.lockedGeneric}
      </p>
      <Link to="/pro" className="btn primary sm">
        {L.unlock}
      </Link>
    </div>
  );
}
