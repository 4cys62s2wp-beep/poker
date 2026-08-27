import { useEffect, useRef, type RefObject } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Icon, type IconName } from './Icon';
import { useAppState, levelForXp, xpThreshold } from '../state/AppState';
import { useLang, levelTitleFor } from '../i18n';
import { STR } from '../i18n/pages/layout';
import { STR as PRO } from '../i18n/pages/pro';
import { STR as LEGAL } from '../i18n/pages/legal';
import { usePro } from '../lib/pro/ProProvider';
import { STR as FRIENDS } from '../i18n/pages/friends';
import { OnlineBadge } from './social/OnlineBadge';

export function Layout() {
  const { data, toasts } = useAppState();
  const { lang } = useLang();
  const L = STR[lang];
  const P = PRO[lang];
  const G = LEGAL[lang];
  const FR = FRIENDS[lang];
  const proCtx = usePro();
  const level = levelForXp(data.xp);
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  useSectionHeadings(mainRef);

  /* Die Seitenleiste folgt derselben Gliederung wie der Hub: drei Absichten
     plus Persönliches – Lernen (mit Fortschritt), Nachschlagen (ohne) und
     Live-Session (am echten Tisch). Vorher waren es vier Gruppen, benannt
     nach der ART der Sache („Anwenden“) statt nach der ABSICHT.
     (docs/SCREEN_STRUKTUR.md, ENTSCHEIDUNGEN.md E-011) */
  const navGroups: Array<{ label: string; items: Array<{ to: string; icon: IconName; label: string; end?: boolean }> }> = [
    { label: L.navOverview, items: [{ to: '/', icon: 'spade', label: L.start, end: true }] },
    {
      label: L.navLearn,
      items: [
        { to: '/lernen', icon: 'learn', label: L.learnPath },
        { to: '/lernen/wiederholen', icon: 'repeat', label: L.review },
        { to: '/lernen/uebungstisch', icon: 'play', label: L.practiceTable },
        { to: '/lernen/statistik', icon: 'chart', label: L.playStyle },
        { to: '/lernen/pros', icon: 'chip', label: L.proInsights },
      ],
    },
    {
      label: L.navLookup,
      items: [
        { to: '/nachschlagen', icon: 'search', label: L.lookupAll },
        { to: '/nachschlagen/coach', icon: 'coach', label: L.liveCoach },
        { to: '/nachschlagen/glossar', icon: 'glossary', label: L.glossary },
      ],
    },
    {
      label: L.navSession,
      items: [
        { to: '/session/chips', icon: 'chip', label: L.chipCalc },
        { to: '/session/auszahlung', icon: 'crown', label: L.payout },
        { to: '/session/bankroll', icon: 'notes', label: L.bankroll },
      ],
    },
    {
      label: L.navYou,
      items: [
        { to: '/profil', icon: 'profile', label: L.profile },
        { to: '/freunde', icon: 'friends', label: FR.navFriends },
        ...(proCtx.enabled ? [{ to: '/pro', icon: 'crown' as IconName, label: P.navPro }] : []),
      ],
    },
  ];

  /* Längste Übereinstimmung zuerst: '/lernen/trainer' muss vor '/lernen'
     stehen, sonst hieße jede Trainer-Seite „Lernpfad“. */
  const titles: Array<[prefix: string, title: string]> = [
    ['/lernen/wiederholen', L.review],
    ['/lernen/tagesquiz', L.dailyQuiz],
    ['/lernen/pros', L.proInsights],
    ['/lernen/uebungstisch', L.practiceTable],
    ['/lernen/statistik', L.playStyle],
    ['/lernen', L.learnPath],
    ['/nachschlagen/coach', L.liveCoach],
    ['/nachschlagen/glossar', L.glossary],
    ['/nachschlagen/haende', L.handExplorer],
    ['/nachschlagen/ranges', L.ranges],
    ['/nachschlagen/odds', L.odds],
    ['/nachschlagen/equity', L.equity],
    ['/nachschlagen/tells', L.tells],
    ['/nachschlagen', L.navLookup],
    ['/session/chips', L.chipCalc],
    ['/session/auszahlung', L.payout],
    ['/session/bankroll', L.bankroll],
    ['/session', L.navSession],
    ['/profil', L.profile],
    ['/freunde', FR.navFriends],
    ['/pro', P.navPro],
    ['/rechtliches', G.navLegal],
    ['/kuendigen', G.cancelTitle],
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
                {item.to === '/lernen/wiederholen' && <DueBubble />}
              </NavLink>
            ))}
          </div>
        ))}
        <div className="sidebar-footer">
          <div style={{ marginBottom: 9 }}><OnlineBadge /></div>
          <ProfileBadge />
          {proCtx.enabled && (
            <div style={{ marginBottom: 9 }}>
              {proCtx.pro ? (
                <span className="pill gold"><Icon name="crown" size={13} /> {P.proBadge}</span>
              ) : proCtx.trialActive ? (
                <NavLink to="/pro" className="pill gold" style={{ textDecoration: 'none' }}>
                  {P.trialBadge(proCtx.trialDaysLeft)}
                </NavLink>
              ) : (
                <NavLink to="/pro" className="pill" style={{ textDecoration: 'none' }}>
                  {P.upgradeNudge}
                </NavLink>
              )}
            </div>
          )}
          <div className="row between" style={{ marginBottom: 6 }}>
            <span>
              {L.level} {level} · {levelTitleFor(level, lang)}
            </span>
          </div>
          <div className="progressbar">
            <div style={{ width: `${levelProgressPct(data.xp)}%` }} />
          </div>
          <div style={{ marginTop: 6 }}>{data.xp} XP</div>
          <NavLink to="/rechtliches" className="small faint" style={{ display: 'inline-block', marginTop: 10 }}>
            {G.navLegal}
          </NavLink>
          {/* § 312k BGB: ohne Anmeldung erreichbar, deshalb dauerhaft im Footer. */}
          {proCtx.enabled && (
            <NavLink to="/kuendigen" className="small faint" style={{ display: 'block', marginTop: 4 }}>
              {G.cancelNav}
            </NavLink>
          )}
        </div>
      </aside>

      <div className="inhalt">
        <div className="mobile-top">
          {/* Seit die untere Leiste weg ist (E-032), ist die Marke der Weg
              zurück zur Startseite. Sie steht auf jedem Bildschirm an
              derselben Stelle — genau das, was eine Marke oben links seit
              jeher bedeutet, und was ein Nutzer dort ohnehin antippt. */}
          <NavLink to="/" end className="mobile-top-marke">
            <span className="spade">
              <Icon name="spade" size={15} />
            </span>
            <span className="grad">PokerMentor</span>
          </NavLink>
          {/* Der Weg zum Profil auf dem Handy. Er stand vorher in der unteren
              Leiste; dort ist mit drei Bereichen kein Platz mehr für einen
              fünften beschrifteten Punkt. Hier ist er sichtbar, beschriftet
              und auf jedem Bildschirm erreichbar. */}
          <NavLink
            to="/profil"
            className={({ isActive }) => `mobile-top-you${isActive ? ' active' : ''}`}
          >
            <Icon name="profile" size={16} />
            <span>{L.mobileYou}</span>
          </NavLink>
        </div>
        <main className="main" ref={mainRef}>
          <Outlet />
        </main>
      </div>

      {/* Level-Ups und Badges tauchen ohne Nutzeraktion auf – ohne Live-Region
          bekommt ein Screenreader davon nichts mit. „polite“ statt „assertive“:
          Die Meldungen sind Belohnungen, keine Fehler. */}
      <div className="toast-stack" role="status" aria-live="polite">
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

/* Abschnittsüberschriften stehen auf den Seiten historisch als
   <div class="section-title"> im DOM und fehlen damit in der Überschriften-
   Gliederung (Screenreader-Navigation per H-Taste). Die Seitendateien gehören
   anderen Modulen, deshalb wird die Semantik hier nachgereicht: role="heading"
   + aria-level="2" – rein additiv, optisch identisch. Sobald eine Seite auf
   <h2 class="section-title"> umgestellt ist (in global.css bereits identisch
   gestylt), fasst diese Funktion sie nicht mehr an. */
function useSectionHeadings(scope: RefObject<HTMLElement>) {
  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    const upgrade = () => {
      root.querySelectorAll<HTMLElement>('div.section-title:not([role])').forEach((el) => {
        el.setAttribute('role', 'heading');
        el.setAttribute('aria-level', '2');
      });
    };
    upgrade();
    if (typeof MutationObserver === 'undefined') return;
    // Nur childList/subtree: Die eigenen Attribut-Änderungen lösen den
    // Observer nicht erneut aus.
    const mo = new MutationObserver(upgrade);
    mo.observe(root, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, [scope]);
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
