import { Link } from 'react-router-dom';
import { IconTile, type IconName } from '../components/Icon';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/toolshub';

export function ToolsHub() {
  const { lang } = useLang();
  const L = STR[lang];

  const TOOLS: Array<{ to: string; icon: IconName; tone: 'gold' | 'green' | 'blue' | 'red' | 'violet'; title: string; desc: string }> = [
    { to: '/coach', icon: 'coach', tone: 'gold', title: L.coachTitle, desc: L.coachDesc },
    { to: '/tools/hands', icon: 'search', tone: 'green', title: L.handsTitle, desc: L.handsDesc },
    { to: '/tools/chips', icon: 'chip', tone: 'red', title: L.chipsTitle, desc: L.chipsDesc },
    { to: '/tools/tells', icon: 'eye', tone: 'violet', title: L.tellsTitle, desc: L.tellsDesc },
    { to: '/tools/equity', icon: 'scale', tone: 'blue', title: L.equityTitle, desc: L.equityDesc },
    { to: '/tools/ranges', icon: 'grid', tone: 'gold', title: L.rangesTitle, desc: L.rangesDesc },
    { to: '/tools/odds', icon: 'chart', tone: 'blue', title: L.oddsTitle, desc: L.oddsDesc },
    { to: '/tools/bankroll', icon: 'notes', tone: 'green', title: L.bankrollTitle, desc: L.bankrollDesc },
  ];

  const EXTRA: Array<{ to: string; icon: IconName; tone: 'gold' | 'green' | 'blue' | 'red' | 'violet'; title: string; desc: string }> = [
    { to: '/spielen', icon: 'play', tone: 'red', title: L.playTitle, desc: L.playDesc },
    { to: '/pros', icon: 'chip', tone: 'gold', title: L.prosTitle, desc: L.prosDesc },
    { to: '/wiederholen', icon: 'repeat', tone: 'gold', title: L.reviewTitle, desc: L.reviewDesc },
    { to: '/glossar', icon: 'glossary', tone: 'blue', title: L.glossaryTitle, desc: L.glossaryDesc },
    { to: '/profil', icon: 'profile', tone: 'violet', title: L.profileTitle, desc: L.profileDesc },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="eyebrow">{L.eyebrow}</div>
        <h1>{L.title}</h1>
        <p className="sub">{L.sub}</p>
      </div>

      <div className="grid cols-2">
        {TOOLS.map((t) => (
          <Link key={t.to} to={t.to} className="card clickable">
            <div className="row" style={{ alignItems: 'flex-start' }}>
              <IconTile name={t.icon} tone={t.tone} />
              <div>
                <div style={{ fontWeight: 800, fontSize: 16.5 }}>{t.title}</div>
                <div className="small muted" style={{ marginTop: 3 }}>{t.desc}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="section-title">{L.also}</div>
      <div className="grid cols-2">
        {EXTRA.map((t) => (
          <Link key={t.to} to={t.to} className="card clickable">
            <div className="row" style={{ alignItems: 'flex-start' }}>
              <IconTile name={t.icon} tone={t.tone} />
              <div>
                <div style={{ fontWeight: 800, fontSize: 16.5 }}>{t.title}</div>
                <div className="small muted" style={{ marginTop: 3 }}>{t.desc}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
