import { Link } from 'react-router-dom';
import { ALL_MODULES } from '../content';
import { moduleProgress, useAppState } from '../state/AppState';

const LEVEL_PILL: Record<string, string> = {
  Einsteiger: 'ok',
  Fortgeschritten: 'info',
  Profi: 'gold',
};

export function LearnPage() {
  const { data } = useAppState();

  return (
    <div>
      <div className="page-header">
        <h1>Lernpfad</h1>
        <p className="sub">
          Acht Module vom ersten Blatt bis zur Profi-Strategie. Arbeite sie der Reihe nach durch – jede Lektion endet
          mit einem Quiz, das dein Verständnis prüft und XP bringt.
        </p>
      </div>

      <div className="grid cols-2">
        {ALL_MODULES.map((m, idx) => {
          const prog = moduleProgress(data, m.id);
          const done = Math.round(prog * m.lessons.length);
          return (
            <Link key={m.id} to={`/lernen/${m.id}`} className="card clickable">
              <div className="row between" style={{ marginBottom: 8 }}>
                <span className="pill">Modul {idx + 1}</span>
                <span className={`pill ${LEVEL_PILL[m.level] ?? ''}`}>{m.level}</span>
              </div>
              <div className="row" style={{ alignItems: 'flex-start' }}>
                <span style={{ fontSize: 30 }}>{m.icon}</span>
                <div>
                  <div style={{ fontWeight: 750, fontSize: 17 }}>{m.title}</div>
                  <div className="small muted" style={{ marginTop: 3 }}>
                    {m.subtitle}
                  </div>
                </div>
              </div>
              <div className="progressbar" style={{ margin: '14px 0 8px' }}>
                <div style={{ width: `${prog * 100}%` }} />
              </div>
              <div className="small faint">
                {done} / {m.lessons.length} Lektionen abgeschlossen
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
