import { Link } from 'react-router-dom';
import { IconTile, type IconName } from '../components/Icon';

const TOOLS: Array<{ to: string; icon: IconName; tone: 'gold' | 'green' | 'blue' | 'red' | 'violet'; title: string; desc: string }> = [
  {
    to: '/coach',
    icon: 'coach',
    tone: 'gold',
    title: 'Live-Coach',
    desc: 'Hand eingeben, Empfehlung bekommen: Street für Street – perfekt für den Pokerabend mit Freunden.',
  },
  {
    to: '/tools/hands',
    icon: 'search',
    tone: 'green',
    title: 'Starthand-Explorer',
    desc: 'Alle 169 Starthände: Gewinnwahrscheinlichkeit gegen 1–5 Gegner und wie du jede Hand spielst.',
  },
  {
    to: '/tools/tells',
    icon: 'eye',
    tone: 'violet',
    title: 'Tells & Reads',
    desc: 'Was Gesten, Einsätze und Timing verraten – mit Zuverlässigkeits-Bewertung für Low-Stakes-Runden.',
  },
  {
    to: '/tools/equity',
    icon: 'scale',
    tone: 'blue',
    title: 'Equity-Rechner',
    desc: 'Hand vs. Hand (bis zu 3 Spieler) mit beliebigem Board – Monte-Carlo-Simulation direkt im Browser.',
  },
  {
    to: '/tools/ranges',
    icon: 'grid',
    tone: 'gold',
    title: 'Range-Charts',
    desc: 'Alle Open-Raise-Ranges nach Position und die Big-Blind-Verteidigung als interaktive Matrix.',
  },
  {
    to: '/tools/odds',
    icon: 'chart',
    tone: 'blue',
    title: 'Odds-Spickzettel',
    desc: 'Outs, Odds und die wichtigsten Wahrscheinlichkeiten – kompakt zum Nachschlagen.',
  },
  {
    to: '/tools/bankroll',
    icon: 'notes',
    tone: 'green',
    title: 'Bankroll-Tracker',
    desc: 'Erfasse deine Live- und Online-Sessions und behalte Gewinn, Stundenlohn und Verlauf im Blick.',
  },
];

const EXTRA: Array<{ to: string; icon: IconName; tone: 'gold' | 'green' | 'blue' | 'red' | 'violet'; title: string; desc: string }> = [
  { to: '/spielen', icon: 'play', tone: 'red', title: 'Übungstisch', desc: 'No-Limit Hold’em gegen KI-Gegner mit Coach-Modus und Handhistorie.' },
  { to: '/wiederholen', icon: 'repeat', tone: 'gold', title: 'Wiederholen', desc: 'Dein Spaced-Repetition-Stapel aus falsch beantworteten Quizfragen.' },
  { to: '/glossar', icon: 'glossary', tone: 'blue', title: 'Glossar', desc: 'Alle Pokerbegriffe von A bis Z erklärt.' },
  { to: '/profil', icon: 'profile', tone: 'violet', title: 'Profil & Fortschritt', desc: 'XP, Level, Abzeichen, Statistiken und Daten-Backup.' },
];

export function ToolsHub() {
  return (
    <div>
      <div className="page-header">
        <div className="eyebrow">Werkzeugkasten</div>
        <h1>Tools</h1>
        <p className="sub">Werkzeuge für den Tisch und fürs Studium – dieselben Rechnungen, die Profis machen.</p>
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

      <div className="section-title">Außerdem</div>
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
