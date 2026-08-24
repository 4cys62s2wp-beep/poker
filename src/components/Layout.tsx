import { useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Icon, type IconName } from './Icon';
import { useAppState, levelForXp, xpThreshold } from '../state/AppState';
import { useLang, levelTitleFor } from '../i18n';
import { STR } from '../i18n/pages/layout';

export function Layout() {
  const { data, toasts } = useAppState();
  const { lang } = useLang();
  const L = STR[lang];
  const level = levelForXp(data.xp);
  const location = useLocation();

  const navGroups: Array<{ label: string; items: Array<{ to: string; icon: IconName; label: string; end?: boolean }> }> = [
    { label: L.navOverview, items: [{ to: '/', icon: 'spade', label: L.start, end: true }] },
    {
      label: L.navLearn,
      items: [
        { to: '/lernen', icon: 'learn', label: L.learnPath },
        { to: '/pros', icon: 'chip', label: L.proInsights },
        { to: '/wiederholen', icon: 'repeat', label: L.review },
        { to: '/trainer', icon: 'trainer', label: L.trainer },
        { to: '/glossar', icon: 'glossary', label: L.glossary },
      ],
    },
    {
      label: L.navApply,
      items: [
        { to: '/coach', icon: 'coach', label: L.liveCoach },
        { to: '/spielen', icon: 'play', label: L.practiceTable },
        { to: '/tools', icon: 'tools', label: L.tools },
      ],
    },
    { label: L.navYou, items: [{ to: '/profil', icon: 'profile', label: L.profile }] },
  ];

  const mobileItems: Array<{ to: string; icon: IconName; label: string; end?: boolean }> = [
    { to: '/', icon: 'spade', label: L.start, end: true },
    { to: '/lernen', icon: 'learn', label: L.mobileLearn },
    { to: '/coach', icon: 'coach', label: L.mobileCoach },
    { to: '/trainer', icon: 'trainer', label: L.trainer },
    { to: '/tools', icon: 'tools', label: L.mobileMore },
  ];

  const titles: Array<[prefix: string, title: string]> = [
    ['/lernen', L.learnPath],
    ['/pros', L.proInsights],
    ['/wiederholen', L.review],
    ['/tagesquiz', L.dailyQuiz],
    ['/trainer', L.trainer],
    ['/coach', L.liveCoach],
    ['/spielen', L.practiceTable],
    ['/tools', L.tools],
    ['/glossar', L.glossary],
    ['/profil', L.profile],
  ];

  useEffect(() => {
    const match = titles.find(([p]) => location.pathname.startsWith(p));
    document.title = match ? `${match[1]} · PokerMentor` : 'PokerMentor';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, lang]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="spade">
            <Icon name="spade" size={18} />
          </span>
          <span className="grad">PokerMentor</span>
        </div>
        {navGroups.map((group) => (
          <div key={group.label}>
            <div className="nav-group">{group.label}</div>
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                <span className="ico">
                  <Icon name={item.icon} size={18} />
                </span>
                {item.label}
                {item.to === '/wiederholen' && <DueBubble />}
              </NavLink>
            ))}
          </div>
        ))}
        <div className="sidebar-footer">
          <ProfileBadge />
          <div className="row between" style={{ marginBottom: 6 }}>
            <span>
              {L.level} {level} · {levelTitleFor(level, lang)}
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
          <span className="spade">
            <Icon name="spade" size={15} />
          </span>
          <span className="grad">PokerMentor</span>
        </div>
        <main className="main">
          <Outlet />
        </main>
      </div>

      <nav className="bottom-nav">
        {mobileItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => (isActive ? 'active' : '')}>
            <span className="ico">
              <Icon name={item.icon} size={21} />
            </span>
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

function ProfileBadge() {
  const { activeProfile, profiles } = useAppState();
  if (!activeProfile.name && profiles.length <= 1) return null;
  return (
    <div className="row" style={{ marginBottom: 10 }}>
      <span
        style={{
          width: 26, height: 26, borderRadius: '50%', display: 'inline-flex',
          alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12,
          background: `${activeProfile.color}26`, color: activeProfile.color,
          border: `1.5px solid ${activeProfile.color}55`, flexShrink: 0,
        }}
      >
        {(activeProfile.name || '?').slice(0, 1).toUpperCase()}
      </span>
      <span style={{ fontWeight: 700, color: 'var(--text-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {activeProfile.name || 'Profil'}
      </span>
    </div>
  );
}

function DueBubble() {
  const { dueReviewCount } = useAppState();
  if (dueReviewCount === 0) return null;
  return (
    <span
      style={{
        marginLeft: 'auto',
        background: 'var(--gold)',
        color: '#271e08',
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 800,
        padding: '1px 7px',
      }}
    >
      {dueReviewCount}
    </span>
  );
}

function levelProgressPct(xp: number): number {
  const level = levelForXp(xp);
  const cur = xpThreshold(level);
  const next = xpThreshold(level + 1);
  return Math.min(100, Math.round((100 * (xp - cur)) / (next - cur)));
}
