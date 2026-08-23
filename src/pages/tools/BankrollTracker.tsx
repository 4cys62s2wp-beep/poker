import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppState, type SessionEntry } from '../../state/AppState';

function euro(n: number): string {
  return n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 });
}

export function BankrollTracker() {
  const { data, addSession, deleteSession } = useAppState();
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    type: 'online' as 'online' | 'live',
    game: 'NL2 Cash',
    buyIn: '',
    cashOut: '',
    minutes: '',
    notes: '',
  });
  const [formError, setFormError] = useState<string | null>(null);

  const stats = useMemo(() => {
    const sessions = data.sessions;
    if (sessions.length === 0) return null;
    let profit = 0;
    let minutes = 0;
    let best = -Infinity;
    let worst = Infinity;
    let wins = 0;
    const cumulative: number[] = [];
    for (const s of sessions) {
      const p = s.cashOut - s.buyIn;
      profit += p;
      minutes += s.minutes;
      best = Math.max(best, p);
      worst = Math.min(worst, p);
      if (p > 0) wins++;
      cumulative.push(profit);
    }
    return {
      profit,
      hours: minutes / 60,
      hourly: minutes > 0 ? profit / (minutes / 60) : 0,
      best,
      worst,
      winRate: Math.round((100 * wins) / sessions.length),
      cumulative,
    };
  }, [data.sessions]);

  function submit() {
    setFormError(null);
    const buyIn = parseFloat(form.buyIn.replace(',', '.'));
    const cashOut = parseFloat(form.cashOut.replace(',', '.'));
    const minutes = parseInt(form.minutes, 10);
    if (!form.date) return setFormError('Bitte ein Datum angeben.');
    if (!isFinite(buyIn) || buyIn < 0) return setFormError('Buy-in: bitte eine Zahl ≥ 0 angeben.');
    if (!isFinite(cashOut) || cashOut < 0) return setFormError('Cash-out: bitte eine Zahl ≥ 0 angeben.');
    if (!isFinite(minutes) || minutes <= 0) return setFormError('Dauer: bitte Minuten > 0 angeben.');
    addSession({
      date: form.date,
      type: form.type,
      game: form.game.trim() || 'Session',
      buyIn,
      cashOut,
      minutes,
      notes: form.notes.trim() || undefined,
    });
    setForm((f) => ({ ...f, buyIn: '', cashOut: '', minutes: '', notes: '' }));
  }

  return (
    <div>
      <Link to="/tools" className="pill" style={{ display: 'inline-flex', marginBottom: 14 }}>
        ← Tools
      </Link>
      <div className="page-header">
        <h1>📒 Bankroll-Tracker</h1>
        <p className="sub">
          Wer seine Ergebnisse nicht kennt, kann sich nicht verbessern. Erfasse jede Session ehrlich – live und
          online. Die Daten bleiben lokal auf deinem Gerät.
        </p>
      </div>

      {stats && (
        <>
          <div className="grid cols-4" style={{ marginBottom: 18 }}>
            <div className="card">
              <div className="stat-label">Gesamtergebnis</div>
              <div className="big-stat" style={{ color: stats.profit >= 0 ? 'var(--ok)' : 'var(--danger)', fontSize: 24 }}>
                {euro(stats.profit)}
              </div>
            </div>
            <div className="card">
              <div className="stat-label">Stundenlohn</div>
              <div className="big-stat" style={{ fontSize: 24 }}>{euro(stats.hourly)}/h</div>
              <div className="small faint">{stats.hours.toFixed(1).replace('.', ',')} Stunden</div>
            </div>
            <div className="card">
              <div className="stat-label">Sessions</div>
              <div className="big-stat" style={{ fontSize: 24 }}>{data.sessions.length}</div>
              <div className="small faint">{stats.winRate} % gewonnen</div>
            </div>
            <div className="card">
              <div className="stat-label">Beste / Schlechteste</div>
              <div style={{ fontWeight: 700, color: 'var(--ok)' }}>{euro(stats.best)}</div>
              <div style={{ fontWeight: 700, color: 'var(--danger)' }}>{euro(stats.worst)}</div>
            </div>
          </div>

          {stats.cumulative.length >= 2 && (
            <div className="card" style={{ marginBottom: 18 }}>
              <div className="stat-label" style={{ marginBottom: 8 }}>Verlauf (kumuliert)</div>
              <ProfitChart values={stats.cumulative} />
            </div>
          )}
        </>
      )}

      <div className="card" style={{ maxWidth: 680, marginBottom: 18 }}>
        <div className="section-title" style={{ marginTop: 0 }}>Neue Session</div>
        <div className="grid cols-2" style={{ gap: 12 }}>
          <label>
            <div className="stat-label" style={{ marginBottom: 5 }}>Datum</div>
            <input type="date" className="text-input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </label>
          <label>
            <div className="stat-label" style={{ marginBottom: 5 }}>Art</div>
            <select className="text-input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as 'online' | 'live' })}>
              <option value="online">💻 Online</option>
              <option value="live">🎰 Live</option>
            </select>
          </label>
          <label>
            <div className="stat-label" style={{ marginBottom: 5 }}>Spiel / Limit</div>
            <input className="text-input" value={form.game} onChange={(e) => setForm({ ...form, game: e.target.value })} placeholder="z. B. NL2 Cash, 1/2 Live" />
          </label>
          <label>
            <div className="stat-label" style={{ marginBottom: 5 }}>Dauer (Minuten)</div>
            <input className="text-input" inputMode="numeric" value={form.minutes} onChange={(e) => setForm({ ...form, minutes: e.target.value })} placeholder="z. B. 90" />
          </label>
          <label>
            <div className="stat-label" style={{ marginBottom: 5 }}>Buy-in (€)</div>
            <input className="text-input" inputMode="decimal" value={form.buyIn} onChange={(e) => setForm({ ...form, buyIn: e.target.value })} placeholder="z. B. 10" />
          </label>
          <label>
            <div className="stat-label" style={{ marginBottom: 5 }}>Cash-out (€)</div>
            <input className="text-input" inputMode="decimal" value={form.cashOut} onChange={(e) => setForm({ ...form, cashOut: e.target.value })} placeholder="z. B. 14,50" />
          </label>
        </div>
        <label style={{ display: 'block', marginTop: 12 }}>
          <div className="stat-label" style={{ marginBottom: 5 }}>Notizen (optional)</div>
          <input className="text-input" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Wie hast du gespielt? Wichtige Hände?" />
        </label>
        {formError && <div className="feedback-box bad" style={{ marginTop: 12 }}>{formError}</div>}
        <button className="btn primary" style={{ marginTop: 14 }} onClick={submit}>
          Session speichern
        </button>
      </div>

      {data.sessions.length > 0 && (
        <>
          <div className="section-title">Alle Sessions</div>
          <div className="grid" style={{ maxWidth: 680 }}>
            {[...data.sessions].reverse().map((s: SessionEntry) => {
              const p = s.cashOut - s.buyIn;
              return (
                <div key={s.id} className="card row between wrap">
                  <div>
                    <div style={{ fontWeight: 700 }}>
                      {s.type === 'live' ? '🎰' : '💻'} {s.game}
                    </div>
                    <div className="small faint">
                      {s.date} · {s.minutes} Min.
                      {s.notes && ` · ${s.notes}`}
                    </div>
                  </div>
                  <div className="row">
                    <span style={{ fontWeight: 800, color: p >= 0 ? 'var(--ok)' : 'var(--danger)' }}>
                      {p >= 0 ? '+' : ''}{euro(p)}
                    </span>
                    <button className="btn sm ghost" onClick={() => deleteSession(s.id)} title="Löschen">
                      🗑
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function ProfitChart({ values }: { values: number[] }) {
  const w = 600;
  const h = 120;
  const pad = 6;
  const min = Math.min(0, ...values);
  const max = Math.max(0, ...values);
  const span = max - min || 1;
  const x = (i: number) => pad + (i * (w - 2 * pad)) / Math.max(1, values.length - 1);
  const y = (v: number) => h - pad - ((v - min) * (h - 2 * pad)) / span;
  const points = values.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  const zeroY = y(0);
  const last = values[values.length - 1];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="sparkline" preserveAspectRatio="none" role="img" aria-label="Gewinnverlauf">
      <line x1={pad} y1={zeroY} x2={w - pad} y2={zeroY} stroke="rgba(255,255,255,0.15)" strokeDasharray="4 4" />
      <polyline
        points={points}
        fill="none"
        stroke={last >= 0 ? 'var(--ok)' : 'var(--danger)'}
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
