/* Kleines Online-Abzeichen: „3 online" mit grünem Punkt, führt zu /freunde.

   Rendert bewusst NICHTS, wenn das Freundes-System nicht verfügbar ist
   (keine Cloud-Konfiguration, nicht angemeldet, E-Mail nicht bestätigt) –
   dadurch kann die Komponente überall im Rahmen stehen, ohne dass die
   Geräte-Variante der App eine leere Fläche zeigt. */

import { Link } from 'react-router-dom';
import { useSocial } from '../../lib/social/SocialProvider';
import { useLang } from '../../i18n';
import { STR } from '../../i18n/pages/friends';

export function OnlineBadge({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const social = useSocial();
  const { lang } = useLang();
  const F = STR[lang];

  if (!social.available) return null;

  const online = social.onlineCount;
  const open = social.requests.length;

  return (
    <Link
      to="/freunde"
      className={`pill${online > 0 ? ' ok' : ''}${className ? ` ${className}` : ''}`}
      style={{ textDecoration: 'none', gap: 6, ...style }}
      aria-label={F.badgeAria(online)}
      title={F.badgeAria(online)}
    >
      <span
        aria-hidden="true"
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          flexShrink: 0,
          background: online > 0 ? 'var(--ok)' : 'var(--text-faint)',
          boxShadow: online > 0 ? '0 0 6px rgba(88,179,104,0.85)' : 'none',
        }}
      />
      {online > 0 ? F.badgeOnline(online) : F.badgeNobody}
      {/* Offene Anfragen fallen sonst niemandem auf, der die Seite nicht öffnet. */}
      {open > 0 && (
        <span
          style={{
            background: 'var(--gold)',
            color: '#271e08',
            borderRadius: 99,
            fontSize: 11,
            fontWeight: 800,
            padding: '0 6px',
          }}
        >
          {open}
        </span>
      )}
    </Link>
  );
}
