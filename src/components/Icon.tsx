// Eigenes, minimales SVG-Icon-Set (Stroke-Stil, erbt currentColor).

import type { CSSProperties } from 'react';

export type IconName =
  | 'spade'
  | 'learn'
  | 'trainer'
  | 'coach'
  | 'play'
  | 'tools'
  | 'glossary'
  | 'profile'
  | 'friends'
  | 'search'
  | 'repeat'
  | 'sun'
  | 'scene'
  | 'push'
  | 'history'
  | 'chip'
  | 'download'
  | 'upload'
  | 'flame'
  | 'trash'
  | 'chart'
  | 'eye'
  | 'scale'
  | 'grid'
  | 'notes'
  | 'lock'
  | 'check'
  | 'crown'
  | 'table'
  | 'info';

interface Props {
  name: IconName;
  size?: number;
  style?: CSSProperties;
  className?: string;
}

const STROKE = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function Icon({ name, size = 20, style, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{ flexShrink: 0, ...style }}
      className={className}
    >
      {paths(name)}
    </svg>
  );
}

function paths(name: IconName) {
  switch (name) {
    case 'spade':
      return (
        <path
          fill="currentColor"
          d="M12 2.6c-1.6 3.4-6.6 6-6.6 9.6a3.2 3.2 0 0 0 5.6 2.1c-.2 1.9-.8 3.3-1.9 4.3v1.7h5.8v-1.7c-1.1-1-1.7-2.4-1.9-4.3a3.2 3.2 0 0 0 5.6-2.1c0-3.6-5-6.2-6.6-9.6z"
        />
      );
    case 'learn':
      return (
        <g {...STROKE}>
          <path d="M4 19V6a2 2 0 0 1 2-2h13v13H6a2 2 0 0 0-2 2z" />
          <path d="M4 19a2 2 0 0 0 2 2h13v-4" />
          <path d="M8.5 8h7" />
        </g>
      );
    case 'trainer':
      return (
        <g {...STROKE}>
          <circle cx="12" cy="12" r="8.2" />
          <circle cx="12" cy="12" r="4.4" />
          <circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none" />
        </g>
      );
    case 'coach':
      return (
        <g {...STROKE}>
          <circle cx="12" cy="12" r="8.6" />
          <path d="M15.2 8.8l-1.9 4.5-4.5 1.9 1.9-4.5z" />
        </g>
      );
    case 'play':
      return (
        <g {...STROKE}>
          <rect x="3.6" y="4.8" width="8.6" height="12.6" rx="1.6" transform="rotate(-8 7.9 11.1)" />
          <rect x="11.6" y="6.4" width="8.6" height="12.6" rx="1.6" transform="rotate(8 15.9 12.7)" />
        </g>
      );
    case 'tools':
      return (
        <g {...STROKE}>
          <path d="M4 7.5h16M4 12h16M4 16.5h16" />
          <circle cx="9.5" cy="7.5" r="1.9" fill="var(--bg-card, #161e19)" />
          <circle cx="15" cy="12" r="1.9" fill="var(--bg-card, #161e19)" />
          <circle cx="7.5" cy="16.5" r="1.9" fill="var(--bg-card, #161e19)" />
        </g>
      );
    case 'glossary':
      return (
        <g {...STROKE}>
          <path d="M12 6.2C10 4.9 7.6 4.3 4 4.3v13.9c3.6 0 6 .6 8 1.9 2-1.3 4.4-1.9 8-1.9V4.3c-3.6 0-6 .6-8 1.9z" />
          <path d="M12 6.2v13.9" />
        </g>
      );
    case 'profile':
      return (
        <g {...STROKE}>
          <circle cx="12" cy="8.2" r="3.7" />
          <path d="M4.8 20c1-3.7 3.7-5.5 7.2-5.5s6.2 1.8 7.2 5.5" />
        </g>
      );
    // Zwei Personen – bewusst anders als 'profile', damit sich Profil und
    // Freunde in der Navigation nicht verwechseln lassen.
    case 'friends':
      return (
        <g {...STROKE}>
          <circle cx="9.2" cy="8.6" r="3.3" />
          <path d="M3 19.4c.9-3.3 3.2-5 6.2-5s5.3 1.7 6.2 5" />
          <path d="M16 5.7a3.3 3.3 0 0 1 0 6.4" />
          <path d="M17.4 14.8c2 .6 3.3 2.1 3.9 4.6" />
        </g>
      );
    case 'search':
      return (
        <g {...STROKE}>
          <circle cx="11" cy="11" r="6.2" />
          <path d="M15.6 15.6L20.2 20.2" />
        </g>
      );
    case 'repeat':
      return (
        <g {...STROKE}>
          <path d="M4.5 12a7.5 7.5 0 0 1 12.8-5.3L19 8.2" />
          <path d="M19 4.4v3.8h-3.8" />
          <path d="M19.5 12a7.5 7.5 0 0 1-12.8 5.3L5 15.8" />
          <path d="M5 19.6v-3.8h3.8" />
        </g>
      );
    case 'sun':
      return (
        <g {...STROKE}>
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 3.2v2M12 18.8v2M3.2 12h2M18.8 12h2M5.8 5.8l1.4 1.4M16.8 16.8l1.4 1.4M18.2 5.8l-1.4 1.4M7.2 16.8l-1.4 1.4" />
        </g>
      );
    case 'scene':
      return (
        <g {...STROKE}>
          <rect x="3.6" y="5" width="16.8" height="14" rx="2" />
          <path d="M3.6 9.4h16.8M8.2 5v4.4M15.8 5v4.4" />
          <path d="M10.4 13l3.4 2.2-3.4 2.2z" fill="currentColor" strokeWidth="1" />
        </g>
      );
    case 'push':
      return (
        <g {...STROKE}>
          <path d="M12 19.5V6" />
          <path d="M6.5 11.5L12 6l5.5 5.5" />
          <path d="M5.5 21h13" />
        </g>
      );
    case 'history':
      return (
        <g {...STROKE}>
          <circle cx="12" cy="12" r="8.4" />
          <path d="M12 7.2v4.8l3.2 2" />
        </g>
      );
    case 'chip':
      return (
        <g {...STROKE}>
          <circle cx="12" cy="12" r="8.4" />
          <circle cx="12" cy="12" r="4" />
          <path d="M12 3.6v2.6M12 17.8v2.6M3.6 12h2.6M17.8 12h2.6" />
        </g>
      );
    case 'download':
      return (
        <g {...STROKE}>
          <path d="M12 4.5v10" />
          <path d="M7.5 10.5l4.5 4.5 4.5-4.5" />
          <path d="M5 19.5h14" />
        </g>
      );
    case 'upload':
      return (
        <g {...STROKE}>
          <path d="M12 14.5v-10" />
          <path d="M7.5 8.5L12 4l4.5 4.5" />
          <path d="M5 19.5h14" />
        </g>
      );
    case 'flame':
      return (
        <path
          {...STROKE}
          d="M12 3.5c.8 2.8-2.4 4.6-2.4 7a2.4 2.4 0 0 0 4.7.6c.6-2 2.7-2.3 2.7 1.2a5 5 0 1 1-10 .2C7 8 10.7 6.7 12 3.5z"
        />
      );
    case 'trash':
      return (
        <g {...STROKE}>
          <path d="M5 6.5h14M9.5 6.5V4.8a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1.7" />
          <path d="M6.5 6.5l.8 12.2a1.6 1.6 0 0 0 1.6 1.5h6.2a1.6 1.6 0 0 0 1.6-1.5l.8-12.2" />
          <path d="M10 10.5v6M14 10.5v6" />
        </g>
      );
    case 'chart':
      return (
        <g {...STROKE}>
          <path d="M4.5 4.5v15h15" />
          <path d="M8 15.5v-4M12 15.5V8M16 15.5v-6.5" />
        </g>
      );
    case 'eye':
      return (
        <g {...STROKE}>
          <path d="M3 12c2.2-4.2 5.2-6.3 9-6.3s6.8 2.1 9 6.3c-2.2 4.2-5.2 6.3-9 6.3S5.2 16.2 3 12z" />
          <circle cx="12" cy="12" r="2.7" />
        </g>
      );
    case 'scale':
      return (
        <g {...STROKE}>
          <path d="M12 4.5v15M7 19.5h10" />
          <path d="M5.5 7.5h13" />
          <path d="M5.5 7.5L3.2 12.6a2.8 2.8 0 0 0 5.6 0zM18.5 7.5l-2.8 5.1a2.8 2.8 0 0 0 5.6 0z" />
        </g>
      );
    case 'grid':
      return (
        <g {...STROKE}>
          <rect x="4" y="4" width="16" height="16" rx="1.5" />
          <path d="M4 9.3h16M4 14.6h16M9.3 4v16M14.6 4v16" />
        </g>
      );
    case 'notes':
      return (
        <g {...STROKE}>
          <rect x="5" y="3.8" width="14" height="16.4" rx="2" />
          <path d="M9 8.5h6M9 12h6M9 15.5h3.5" />
        </g>
      );
    case 'lock':
      return (
        <g {...STROKE}>
          <rect x="4.8" y="10.5" width="14.4" height="9.7" rx="2.2" />
          <path d="M8.3 10.5V7.8a3.7 3.7 0 0 1 7.4 0v2.7" />
          <path d="M12 14.4v2.2" />
        </g>
      );
    /* Fragezeichen im Kreis – steht neben jeder gerechneten Zahl und öffnet
       ihre Herkunft. Bewusst dünn und klein: Es soll auffindbar sein, ohne
       die Zahl daneben zu stören. */
    case 'info':
      return (
        <g {...STROKE}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.6 9.2a2.5 2.5 0 1 1 3.1 2.9c-.5.2-.7.6-.7 1.1v.6" />
          <path d="M12 16.9v.1" />
        </g>
      );
    case 'check':
      return (
        <g {...STROKE}>
          <path d="M5 12.6l4.4 4.4L19 7.4" />
        </g>
      );
    // Ovaler Pokertisch mit Chips – für den Mehrspieler-Bereich.
    case 'table':
      return (
        <g {...STROKE}>
          <ellipse cx="12" cy="12" rx="9" ry="6.2" />
          <ellipse cx="12" cy="12" rx="6.2" ry="3.6" />
          <circle cx="12" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="12" cy="17.4" r="0.9" fill="currentColor" stroke="none" />
        </g>
      );
    case 'crown':
      return (
        <g {...STROKE}>
          <path d="M4 17.4h16" />
          <path d="M4.4 7.2l3.9 3.2L12 5.4l3.7 5 3.9-3.2-1.5 8.2H5.9z" />
        </g>
      );
  }
}

/** Icon in einer gestalteten Kachel (für Hub-Karten und Navigation). */
export function IconTile({ name, tone = 'gold', size = 40 }: { name: IconName; tone?: 'gold' | 'green' | 'blue' | 'red' | 'violet'; size?: number }) {
  const tones: Record<string, { bg: string; color: string; border: string }> = {
    gold: { bg: 'var(--auszeichnung-schwach)', color: 'var(--auszeichnung-lesbar)', border: 'rgba(212,175,94,0.3)' },
    green: { bg: 'var(--ok-dim)', color: '#90d69c', border: 'rgba(88,179,104,0.3)' },
    blue: { bg: 'var(--info-dim)', color: '#94bdea', border: 'rgba(85,144,217,0.3)' },
    red: { bg: 'var(--danger-dim)', color: '#eda49f', border: 'rgba(224,92,85,0.3)' },
    violet: { bg: 'var(--kategorie-sozial-schwach)', color: '#bda6e8', border: 'rgba(155,127,212,0.3)' },
  };
  const t = tones[tone];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: 12,
        background: t.bg,
        color: t.color,
        border: `1px solid ${t.border}`,
        flexShrink: 0,
      }}
    >
      <Icon name={name} size={Math.round(size * 0.55)} />
    </span>
  );
}
