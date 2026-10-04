import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Icon, type IconName } from './Icon';
import { useAppState, levelForXp, xpThreshold } from '../state/AppState';
import { useLang, levelTitleFor } from '../i18n';
import { STR } from '../i18n/pages/layout';
import { STR as PRO } from '../i18n/pages/pro';
import { zeichenFuer, type ZeichenPfad } from '../lib/zeichen';
import { STR as LEGAL } from '../i18n/pages/legal';
import { usePro } from '../lib/pro/ProProvider';
import { OnlineBadge } from './social/OnlineBadge';
import { useCloud } from '../lib/cloud/CloudProvider';
import { Kopfzeile } from './Kopfzeile';
import { SucheDialog } from './SucheDialog';
import { useTasten } from '../lib/useTasten';
import { STR as SUCHE } from '../i18n/pages/suche';
import { Marke } from './Marke';
import { Medaille } from './Medaille';
import { UpdateBand } from './UpdateBand';
import { breiteVon, findeOrt, ortName, waehleAktiv, type NavZiel, type OrtPfad } from '../lib/orte';
import { ladeLaufende, type LaufendeSession } from '../lib/session/laufend';
import { standDerUhr } from '../lib/live/uhr';

interface NavEintrag extends NavZiel {
  name: string;
  icon: IconName;
  zusatz?: ReactNode;
}

export function Layout() {
  const { data, toasts } = useAppState();
  const { lang } = useLang();
  const L = STR[lang];
  const P = PRO[lang];
  const G = LEGAL[lang];
  const proCtx = usePro();
  const level = levelForXp(data.xp);
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  useSectionHeadings(mainRef);

  /* Die Suche von überall: Lupe, Eintrag in der Seitenleiste, „/“ und Strg + K. */
  const [sucheOffen, setSucheOffen] = useState(false);
  useTasten([
    { tasten: ['/'], aktion: () => setSucheOffen(true) },
    { tasten: ['k'], strg: true, inFeldern: true, aktion: () => setSucheOffen(true) },
  ]);

  /* Läuft ein Abend? Der Eintrag „Abend führen" führt dann zur Uhr statt in ein
     leeres Formular (E-073), und „Live-Session" zeigt, was gerade gilt. Der
     Stand wird beim Wechsel der Seite neu gelesen; eine Uhr, die in der
     Seitenleiste mitläuft, wäre eine zweite Uhr. */
  const [laufend, setLaufend] = useState<LaufendeSession | null>(ladeLaufende);
  useEffect(() => { setLaufend(ladeLaufende()); }, [location.pathname]);
  const blinds = laufend ? standDerUhr(laufend, Date.now()).blinds : null;

  /* Die Seitenleiste folgt derselben Gliederung wie der Hub: drei Absichten –
     Lernen (mit Fortschritt), Nachschlagen (ohne) und Live-Session (am echten
     Tisch). Die Namen kommen aus der Ortstabelle (src/lib/orte.ts): Was hier
     steht, steht überall so. Spielstil und Pro-Insights sind von der
     Lernseite aus erreichbar und stehen nicht doppelt in der Leiste. */
  const eintrag = (pfad: OrtPfad & ZeichenPfad, extra?: Partial<NavEintrag>): NavEintrag => ({
    to: pfad, name: ortName(pfad, lang), icon: zeichenFuer(pfad), ...extra,
  });
  const navGroups: Array<{ label: string; items: NavEintrag[] }> = [
    { label: L.navOverview, items: [eintrag('/')] },
    {
      label: L.navLearn,
      items: [
        eintrag('/lernen'),
        eintrag('/lernen/wiederholen', { zusatz: <DueBubble /> }),
        eintrag('/lernen/uebungstisch'),
      ],
    },
    {
      label: L.navLookup,
      items: [eintrag('/nachschlagen'), eintrag('/nachschlagen/coach'), eintrag('/nachschlagen/glossar')],
    },
    {
      label: L.navSession,
      items: [
        eintrag('/session', {
          zusatz: blinds && (
            <span className="nav-laeuft" title={L.runningNow}>
              <span className="punkt" aria-hidden="true" />
              {blinds[0]}/{blinds[1]}
              <span className="sr-only"> {L.runningNow}</span>
            </span>
          ),
        }),
        eintrag('/session/live', {
          to: laufend ? '/session/live' : '/session/live/einrichten',
          pfade: ['/session/live'],
        }),
        eintrag('/session/abende', { pfade: ['/session/abende', '/session/spieler'] }),
        eintrag('/session/chips'),
        eintrag('/session/auszahlung'),
        eintrag('/session/bankroll'),
      ],
    },
  ];
  /* Freunde gibt es nur mit Cloud. Wo es sie nicht gibt, steht der Eintrag nicht
     da — ein Weg in eine Seite, die „nicht eingerichtet" sagt, ist keiner. */
  const cloud = useCloud();
  const fussEintraege: NavEintrag[] = [
    eintrag('/profil'),
    eintrag('/profil/einstellungen'),
    ...(cloud.phase === 'unavailable' ? [] : [eintrag('/freunde')]),
  ];
  const aktiv = waehleAktiv(
    [...navGroups.flatMap((g) => g.items), ...fussEintraege, eintrag('/pro')],
    location.pathname,
  );
  const navLink = (item: NavEintrag, kind: 'nav' | 'fuss' = 'nav') => (
    <Link
      key={item.to}
      to={item.to}
      className={`nav-link${item.to === aktiv ? ' active' : ''}${kind === 'fuss' ? ' fuss' : ''}`}
      aria-current={item.to === aktiv ? 'page' : undefined}
    >
      <span className="ico">
        <Icon name={item.icon} size={18} />
      </span>
      {item.name}
      {item.zusatz}
    </Link>
  );

  /* Der Titel des Browser-Tabs ist der Name des Ortes; auf dynamischen Seiten
     (Lektion, Modul, früherer Abend) die Überschrift der Seite. */
  useEffect(() => {
    const ort = findeOrt(location.pathname);
    const setze = () => {
      const h1 = mainRef.current?.querySelector('h1')?.textContent?.trim();
      const name = ort.genau ? ortName(ort.ort, lang) : h1 || ortName(ort.ort, lang);
      document.title = ort.ort === '/' ? 'PokerMentor' : `${name} · PokerMentor`;
    };
    setze();
    /* Lazy geladene Seiten haben beim ersten Lauf noch keine Überschrift. */
    const id = window.setTimeout(setze, 400);
    return () => window.clearTimeout(id);
  }, [location.pathname, lang]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <Marke groesse={34} />
          <span className="grad">PokerMentor</span>
        </div>
        <button type="button" className="sidebar-suche" onClick={() => setSucheOffen(true)}>
          <Icon name="search" size={16} />
          <span>{SUCHE[lang].label}</span>
          <kbd aria-hidden="true">/</kbd>
        </button>
        <nav className="sidebar-nav" aria-label={L.navOverview}>
          {navGroups.map((group) => (
            <div key={group.label}>
              <div className="nav-group">{group.label}</div>
              {group.items.map((item) => navLink(item))}
            </div>
          ))}
        </nav>
        {/* Die Fußzeile klebt unten: Bei 768 oder 860 Pixel Höhe rutschten
            „Du", Level und Rechtliches sonst aus dem Bild. */}
        <div className="sidebar-footer">
          {fussEintraege.map((item) => navLink(item, 'fuss'))}
          <div className="fuss-stand">
            <ProfileBadge />
            <div>{L.level} {level} · {levelTitleFor(level, lang)} · {data.xp} XP</div>
            <div className="progressbar">
              <div style={{ width: `${levelProgressPct(data.xp)}%` }} />
            </div>
          </div>
          <div style={{ marginBottom: 9 }}><OnlineBadge /></div>
          {proCtx.enabled && (
            <div style={{ marginBottom: 9 }}>
              {proCtx.pro ? (
                <span className="pill gold"><Icon name="crown" size={13} /> {P.proBadge}</span>
              ) : proCtx.trialActive ? (
                <Link to="/pro" className="pill gold" style={{ textDecoration: 'none' }}>
                  {P.trialBadge(proCtx.trialDaysLeft)}
                </Link>
              ) : (
                <Link to="/pro" className="pill" style={{ textDecoration: 'none' }}>
                  {P.upgradeNudge}
                </Link>
              )}
            </div>
          )}
          <Link to="/rechtliches" className="small faint" style={{ display: 'inline-block', marginTop: 4 }}>
            {G.navLegal}
          </Link>
          {/* § 312k BGB: ohne Anmeldung erreichbar, deshalb dauerhaft im Footer. */}
          {proCtx.enabled && (
            <Link to="/kuendigen" className="small faint" style={{ display: 'block', marginTop: 4 }}>
              {G.cancelNav}
            </Link>
          )}
        </div>
      </aside>

      <div className="inhalt">
        <Kopfzeile mainRef={mainRef} onSuche={() => setSucheOffen(true)} />
        <UpdateBand />
        <main className="main" ref={mainRef} data-breite={breiteVon(location.pathname)}>
          <Outlet />
        </main>
      </div>

      {sucheOffen && <SucheDialog onClose={() => setSucheOffen(false)} />}

      {/* Level-Ups und Badges tauchen ohne Nutzeraktion auf – ohne Live-Region
          bekommt ein Screenreader davon nichts mit. „polite“ statt „assertive“:
          Die Meldungen sind Belohnungen, keine Fehler. */}
      <div className="toast-stack" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            {t.icon && <Medaille name={t.icon} groesse={38} />}
            <div>
              <div className="t-title">{t.title}</div>
              {t.sub && <div className="t-sub">{t.sub}</div>}
            </div>
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
          alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 'var(--fs-kleingedrucktes)',
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
        background: 'var(--auszeichnung)',
        color: '#271e08',
        borderRadius: 99,
        fontSize: 'var(--fs-kleingedrucktes)',
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
