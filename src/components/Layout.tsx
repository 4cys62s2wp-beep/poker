import { NavLink, Outlet } from 'react-router-dom';
import { useAppState, levelForXp, levelTitle, xpThreshold } from '../state/AppState';

const NAV_GROUPS: Array<{ label: string; items: Array<{ to: string; icon: string; label: string; end?: boolean }> }> = [
  {
    label: 'Übersicht',
    items: [{ to: '/', icon: '♠', label: 'Start', end: true }],
  },
  {
    label: 'Lernen',
    items: [
      { to: '/lernen', icon: '📚', label: 'Lernpfad' },
      { to: '/trainer', icon: '🎯', label: 'Trainer' },
      { to: '/glossar', icon: '📖', label: 'Glossar' },
    ],
  },
  {
    label: 'Anwenden',
    items: [
      { to: '/coach', icon: '🧭', label: 'Live-Coach' },
      { to: '/spielen', icon: '🃏', label: 'Übungstisch' },
      { to: '/tools', icon: '🧰', label: 'Tools' },
    ],
  },
  {
    label: 'Du',
    items: [{ to: '/profil', icon: '👤', label: 'Profil' }],
  },
];

const MOBILE_ITEMS = [
  { to: '/', icon: '♠', label: 'Start', end: true },
  { to: '/lernen', icon: '📚', label: 'Lernen' },
  { to: '/coach', icon: '🧭', label: 'Coach' },
  { to: '/trainer', icon: '🎯', label: 'Trainer' },
  { to: '/tools', icon: '🧰', label: 'Mehr' },
];

export function Layout() {
  const { data, toasts } = useAppState();
  const level = levelForXp(data.xp);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="spade">♠</span>
          <span className="grad">PokerMentor</span>
        </div>
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <div className="nav-group">{group.label}</div>
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                <span className="ico">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
        <div className="sidebar-footer">
          <div className="row between" style={{ marginBottom: 6 }}>
            <span>
              Level {level} · {levelTitle(level)}
            </span>
          </div>
          <div className="progressbar">
            <div style={{ width: `${levelProgressPct(data.xp)}%` }} />
          </div>
          <div style={{ marginTop: 6 }}>{data.xp} XP</div>
        </div>
      </aside>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="mobile-top">
          <span className="spade">♠</span>
          <span className="grad">PokerMentor</span>
        </div>
        <main className="main">
          <Outlet />
        </main>
      </div>

      <nav className="bottom-nav">
        {MOBILE_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => (isActive ? 'active' : '')}>
            <span className="ico">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="toast-stack">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            <div className="t-title">{t.title}</div>
            {t.sub && <div className="t-sub">{t.sub}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function levelProgressPct(xp: number): number {
  const level = levelForXp(xp);
  const cur = xpThreshold(level);
  const next = xpThreshold(level + 1);
  return Math.min(100, Math.round((100 * (xp - cur)) / (next - cur)));
}
