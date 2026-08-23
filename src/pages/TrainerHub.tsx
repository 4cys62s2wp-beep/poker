import { Link } from 'react-router-dom';
import { IconTile, type IconName } from '../components/Icon';
import { useAppState } from '../state/AppState';

const TRAINERS: Array<{ id: string; to: string; icon: IconName; tone: 'gold' | 'green' | 'blue' | 'red' | 'violet'; title: string; desc: string }> = [
  {
    id: 'szenario',
    to: '/trainer/szenario',
    icon: 'scene',
    tone: 'gold',
    title: 'Szenario-Trainer',
    desc: 'Komplette Spielsituationen mit allen Infos – finde die beste Entscheidung und verstehe das Konzept dahinter.',
  },
  {
    id: 'preflop',
    to: '/trainer/preflop',
    icon: 'grid',
    tone: 'green',
    title: 'Preflop-Trainer',
    desc: 'Raise oder Fold? Triff Preflop-Entscheidungen nach Position und vergleiche dich mit den Charts.',
  },
  {
    id: 'potodds',
    to: '/trainer/potodds',
    icon: 'scale',
    tone: 'blue',
    title: 'Pot-Odds-Trainer',
    desc: 'Berechne blitzschnell, wie viel Equity du für einen profitablen Call brauchst.',
  },
  {
    id: 'equity',
    to: '/trainer/equity',
    icon: 'chart',
    tone: 'violet',
    title: 'Equity-Schätzer',
    desc: 'Hand gegen Hand: Schätze die Gewinnwahrscheinlichkeit – und entwickle ein Gefühl für Matchups.',
  },
  {
    id: 'handranking',
    to: '/trainer/handranking',
    icon: 'play',
    tone: 'red',
    title: 'Handranking-Trainer',
    desc: 'Erkenne in Sekunden, welche beste Hand aus sieben Karten entsteht.',
  },
  {
    id: 'outs',
    to: '/trainer/outs',
    icon: 'eye',
    tone: 'blue',
    title: 'Outs-Zähler',
    desc: 'Zähle deine Outs in typischen Draw-Situationen – die Grundlage jeder Equity-Rechnung.',
  },
  {
    id: 'pushfold',
    to: '/trainer/pushfold',
    icon: 'push',
    tone: 'gold',
    title: 'Push/Fold-Trainer',
    desc: 'Kurzer Stack im Turnier: All-in oder Fold? Trainiere die Nash-Ranges für 10bb und 5bb.',
  },
];

export function TrainerHub() {
  const { data } = useAppState();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const dailyDone = data.daily?.date === todayStr;

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

      <Link to="/tagesquiz" className="card clickable" style={{ display: 'block', marginBottom: 16, borderColor: 'rgba(212,175,94,0.35)' }}>
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <IconTile name="sun" tone="gold" />
          <div style={{ flex: 1 }}>
            <div className="row between wrap">
              <div style={{ fontWeight: 800, fontSize: 17 }}>Tages-Quiz</div>
              {dailyDone ? (
                <span className="pill ok">Heute erledigt: {data.daily?.score}/{data.daily?.total}</span>
              ) : (
                <span className="pill gold">+30 XP Bonus</span>
              )}
            </div>
            <div className="small muted" style={{ marginTop: 3 }}>
              Fünf Fragen quer durch alle Module – jeden Tag neu.
            </div>
          </div>
        </div>
      </Link>

      <div className="grid cols-2">
        {TRAINERS.map((t) => {
          const stats = data.trainers[t.id];
          const acc = stats && stats.attempts > 0 ? Math.round((100 * stats.correct) / stats.attempts) : null;
          return (
            <Link key={t.id} to={t.to} className="card clickable">
              <div className="row" style={{ alignItems: 'flex-start' }}>
                <IconTile name={t.icon} tone={t.tone} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 16.5 }}>{t.title}</div>
                  <div className="small muted" style={{ marginTop: 3 }}>
                    {t.desc}
                  </div>
                  <div className="row wrap" style={{ marginTop: 12 }}>
                    {acc !== null ? (
                      <>
                        <span className="pill">{stats!.attempts} Aufgaben</span>
                        <span className={`pill ${acc >= 70 ? 'ok' : ''}`}>{acc} % richtig</span>
                        <span className="pill gold">Beste Serie: {stats!.bestStreak}</span>
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
