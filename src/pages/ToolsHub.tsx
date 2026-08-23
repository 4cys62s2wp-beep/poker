import { Link } from 'react-router-dom';

const TOOLS = [
  {
    to: '/tools/equity',
    icon: '⚖️',
    title: 'Equity-Rechner',
    desc: 'Hand vs. Hand (bis zu 3 Spieler) mit beliebigem Board – Monte-Carlo-Simulation direkt im Browser.',
  },
  {
    to: '/tools/ranges',
    icon: '🗺️',
    title: 'Range-Charts',
    desc: 'Alle Open-Raise-Ranges nach Position und die Big-Blind-Verteidigung als interaktive Matrix.',
  },
  {
    to: '/tools/odds',
    icon: '📊',
    title: 'Odds-Spickzettel',
    desc: 'Outs, Odds und die wichtigsten Wahrscheinlichkeiten – kompakt zum Nachschlagen.',
  },
  {
    to: '/tools/bankroll',
    icon: '📒',
    title: 'Bankroll-Tracker',
    desc: 'Erfasse deine Live- und Online-Sessions und behalte Gewinn, Stundenlohn und Verlauf im Blick.',
  },
];

const EXTRA = [
  { to: '/glossar', icon: '📖', title: 'Glossar', desc: 'Alle Pokerbegriffe von A bis Z erklärt.' },
  { to: '/profil', icon: '👤', title: 'Profil & Fortschritt', desc: 'XP, Level, Abzeichen und deine Statistiken.' },
];

export function ToolsHub() {
  return (
    <div>
      <div className="page-header">
        <h1>Tools</h1>
        <p className="sub">Werkzeuge für dein Studium – dieselben Rechnungen, die Profis nach der Session machen.</p>
      </div>

      <div className="grid cols-2">
        {TOOLS.map((t) => (
          <Link key={t.to} to={t.to} className="card clickable">
            <div className="row" style={{ alignItems: 'flex-start' }}>
              <span style={{ fontSize: 30 }}>{t.icon}</span>
              <div>
                <div style={{ fontWeight: 750, fontSize: 17 }}>{t.title}</div>
                <div className="small muted" style={{ marginTop: 3 }}>{t.desc}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="section-title">Außerdem</div>
      <div className="grid cols-2">
        {EXTRA.map((t) => (
          <Link key={t.to} to={t.to} className="card clickable">
            <div className="row" style={{ alignItems: 'flex-start' }}>
              <span style={{ fontSize: 30 }}>{t.icon}</span>
              <div>
                <div style={{ fontWeight: 750, fontSize: 17 }}>{t.title}</div>
                <div className="small muted" style={{ marginTop: 3 }}>{t.desc}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
