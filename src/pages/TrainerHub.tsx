import { Link } from 'react-router-dom';
import { useAppState } from '../state/AppState';

const TRAINERS = [
  {
    id: 'preflop',
    to: '/trainer/preflop',
    icon: '🃏',
    title: 'Preflop-Trainer',
    desc: 'Raise oder Fold? Triff Preflop-Entscheidungen nach Position und vergleiche dich mit den Charts.',
  },
  {
    id: 'potodds',
    to: '/trainer/potodds',
    icon: '🧮',
    title: 'Pot-Odds-Trainer',
    desc: 'Berechne blitzschnell, wie viel Equity du für einen profitablen Call brauchst.',
  },
  {
    id: 'equity',
    to: '/trainer/equity',
    icon: '⚖️',
    title: 'Equity-Schätzer',
    desc: 'Hand gegen Hand: Schätze die Gewinnwahrscheinlichkeit – und entwickle ein Gefühl für Matchups.',
  },
  {
    id: 'handranking',
    to: '/trainer/handranking',
    icon: '🏆',
    title: 'Handranking-Trainer',
    desc: 'Erkenne in Sekunden, welche beste Hand aus sieben Karten entsteht.',
  },
  {
    id: 'outs',
    to: '/trainer/outs',
    icon: '🔢',
    title: 'Outs-Zähler',
    desc: 'Zähle deine Outs in typischen Draw-Situationen – die Grundlage jeder Equity-Rechnung.',
  },
];

export function TrainerHub() {
  const { data } = useAppState();

  return (
    <div>
      <div className="page-header">
        <div className="eyebrow">Wissen wird Können</div>
        <h1>Trainer</h1>
        <p className="sub">
          Wissen wird erst durch Wiederholung zur Fähigkeit. Jede richtige Antwort bringt 5 XP – und lange Serien
          bringen Abzeichen.
        </p>
      </div>

      <div className="grid cols-2">
        {TRAINERS.map((t) => {
          const stats = data.trainers[t.id];
          const acc = stats && stats.attempts > 0 ? Math.round((100 * stats.correct) / stats.attempts) : null;
          return (
            <Link key={t.id} to={t.to} className="card clickable">
              <div className="row" style={{ alignItems: 'flex-start' }}>
                <span style={{ fontSize: 30 }}>{t.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 750, fontSize: 17 }}>{t.title}</div>
                  <div className="small muted" style={{ marginTop: 3 }}>
                    {t.desc}
                  </div>
                  <div className="row wrap" style={{ marginTop: 12 }}>
                    {acc !== null ? (
                      <>
                        <span className="pill">{stats!.attempts} Aufgaben</span>
                        <span className={`pill ${acc >= 70 ? 'ok' : ''}`}>{acc} % richtig</span>
                        <span className="pill gold">🔥 Beste Serie: {stats!.bestStreak}</span>
                      </>
                    ) : (
                      <span className="pill">Noch nicht gestartet</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
