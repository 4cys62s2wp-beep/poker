import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppState, type SessionEntry } from '../../state/AppState';
import { useLang } from '../../i18n';
import { STR } from '../../i18n/pages/bankroll';
import { downloadBlob } from '../../lib/download';

function euro(n: number): string {
  return n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 });
}

export function BankrollTracker() {
  const { data, addSession, deleteSession } = useAppState();
  const { lang } = useLang();
  const L = STR[lang];
  const [filter, setFilter] = useState<'alle' | 'online' | 'live'>('alle');
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

  const filteredSessions = useMemo(
    () => data.sessions.filter((s) => filter === 'alle' || s.type === filter),
    [data.sessions, filter],
  );

  const stats = useMemo(() => {
    const sessions = filteredSessions;
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
  }, [filteredSessions]);

  /** CSV-Zelle absichern: Anführungszeichen escapen und Formel-Injection
      (=, +, -, @ am Zellanfang würde Excel/Numbers als Formel ausführen) entschärfen. */
  function csvCell(value: string | number): string {
    let s = String(value);
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
    return `"${s.replace(/"/g, '""')}"`;
  }

  function exportCsv() {
    const header = 'Datum;Art;Spiel;Buy-in;Cash-out;Gewinn;Minuten;Notizen';
    const rows = filteredSessions.map((s) =>
      [s.date, s.type, csvCell(s.game), s.buyIn, s.cashOut, (s.cashOut - s.buyIn).toFixed(2), s.minutes, csvCell(s.notes ?? '')].join(';'),
    );
    downloadBlob('\uFEFF' + [header, ...rows].join('\n'), 'pokermentor-sessions.csv', 'text/csv;charset=utf-8');
  }

  function submit() {
    setFormError(null);
    const buyIn = parseFloat(form.buyIn.replace(',', '.'));
    const cashOut = parseFloat(form.cashOut.replace(',', '.'));
    const minutes = parseInt(form.minutes, 10);
    if (!form.date) return setFormError(L.errDate);
    if (!isFinite(buyIn) || buyIn < 0) return setFormError(L.errBuyIn);
    if (!isFinite(cashOut) || cashOut < 0) return setFormError(L.errCashOut);
    if (!isFinite(minutes) || minutes <= 0) return setFormError(L.errMinutes);
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
      <Link to="/session" className="pill" style={{ display: 'inline-flex', marginBottom: 14 }}>
        {L.backToTools}
      </Link>
      <div className="page-header">
        <h1>{L.title}</h1>
        <p className="sub">{L.sub}</p>
      </div>

      <div className="row wrap between" style={{ marginBottom: 16, maxWidth: 680 }}>
        <div className="segmented">
          <button className={filter === 'alle' ? 'on' : ''} onClick={() => setFilter('alle')}>{L.filterAll}</button>
          <button className={filter === 'online' ? 'on' : ''} onClick={() => setFilter('online')}>{L.filterOnline}</button>
          <button className={filter === 'live' ? 'on' : ''} onClick={() => setFilter('live')}>{L.filterLive}</button>
        </div>
        {data.sessions.length > 0 && (
          <button className="btn sm ghost" onClick={exportCsv}>
            {L.exportCsv}
          </button>
        )}
      </div>

      {stats && (
        <>
          <div className="grid cols-4" style={{ marginBottom: 18 }}>
            <div className="card">
              <div className="stat-label">{L.statTotal}</div>
              <div className="big-stat" style={{ color: stats.profit >= 0 ? 'var(--ok)' : 'var(--danger)', fontSize: 24 }}>
                {euro(stats.profit)}
              </div>
            </div>
            <div className="card">
              <div className="stat-label">{L.statHourly}</div>
              <div className="big-stat" style={{ fontSize: 24 }}>{euro(stats.hourly)}/h</div>
              <div className="small faint">{L.hours(stats.hours)}</div>
            </div>
            <div className="card">
              <div className="stat-label">{L.statSessions}</div>
              <div className="big-stat" style={{ fontSize: 24 }}>{filteredSessions.length}</div>
              <div className="small faint">{L.winRate(stats.winRate)}</div>
            </div>
            <div className="card">
              <div className="stat-label">{L.statBestWorst}</div>
              <div style={{ fontWeight: 700, color: 'var(--ok)' }}>{euro(stats.best)}</div>
              <div style={{ fontWeight: 700, color: 'var(--danger-lesbar)' }}>{euro(stats.worst)}</div>
            </div>
          </div>

          {stats.cumulative.length >= 2 && (
            <div className="card" style={{ marginBottom: 18 }}>
              <div className="stat-label" style={{ marginBottom: 8 }}>{L.chartTitle}</div>
              <ProfitChart values={stats.cumulative} ariaLabel={L.chartAria} />
            </div>
          )}
        </>
      )}

      <div className="card" style={{ maxWidth: 680, marginBottom: 18 }}>
        <div className="section-title" style={{ marginTop: 0 }}>{L.newSession}</div>
        <div className="grid cols-2" style={{ gap: 12 }}>
          <label>
            <div className="stat-label" style={{ marginBottom: 5 }}>{L.labelDate}</div>
            <input type="date" className="text-input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </label>
          <label>
            <div className="stat-label" style={{ marginBottom: 5 }}>{L.labelType}</div>
            <select className="text-input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as 'online' | 'live' })}>
              <option value="online">{L.optionOnline}</option>
              <option value="live">{L.optionLive}</option>
            </select>
          </label>
          <label>
            <div className="stat-label" style={{ marginBottom: 5 }}>{L.labelGame}</div>
            <input className="text-input" value={form.game} onChange={(e) => setForm({ ...form, game: e.target.value })} placeholder={L.gamePlaceholder} />
          </label>
          <label>
            <div className="stat-label" style={{ marginBottom: 5 }}>{L.labelDuration}</div>
            <input className="text-input" inputMode="numeric" value={form.minutes} onChange={(e) => setForm({ ...form, minutes: e.target.value })} placeholder={L.durationPlaceholder} />
          </label>
          <label>
            <div className="stat-label" style={{ marginBottom: 5 }}>{L.labelBuyIn}</div>
            <input className="text-input" inputMode="decimal" value={form.buyIn} onChange={(e) => setForm({ ...form, buyIn: e.target.value })} placeholder={L.buyInPlaceholder} />
          </label>
          <label>
            <div className="stat-label" style={{ marginBottom: 5 }}>{L.labelCashOut}</div>
            <input className="text-input" inputMode="decimal" value={form.cashOut} onChange={(e) => setForm({ ...form, cashOut: e.target.value })} placeholder={L.cashOutPlaceholder} />
          </label>
        </div>
        <label style={{ display: 'block', marginTop: 12 }}>
          <div className="stat-label" style={{ marginBottom: 5 }}>{L.labelNotes}</div>
          <input className="text-input" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder={L.notesPlaceholder} />
        </label>
        {formError && <div className="feedback-box bad" style={{ marginTop: 12 }}>{formError}</div>}
        <button className="btn primary" style={{ marginTop: 14 }} onClick={submit}>
          {L.save}
        </button>
      </div>

      {filteredSessions.length > 0 && (
        <>
          <div className="section-title">{L.sessionsTitle}</div>
          <div className="grid" style={{ maxWidth: 680 }}>
            {[...filteredSessions].reverse().map((s: SessionEntry) => {
              const p = s.cashOut - s.buyIn;
              return (
                <div key={s.id} className="card row between wrap">
                  <div>
                    <div className="row" style={{ fontWeight: 700, gap: 8 }}>
                      <span className={`pill ${s.type === 'live' ? 'violet' : 'info'}`}>{s.type === 'live' ? L.pillLive : L.pillOnline}</span>
                      {s.game}
                    </div>
                    <div className="small faint">
                      {s.date} · {L.minutes(s.minutes)}
                      {s.notes && ` · ${s.notes}`}
                    </div>
                  </div>
                  <div className="row">
                    <span style={{ fontWeight: 800, color: p >= 0 ? 'var(--ok)' : 'var(--danger)' }}>
                      {p >= 0 ? '+' : ''}{euro(p)}
                    </span>
                    <button className="btn sm ghost" onClick={() => deleteSession(s.id)} title={L.deleteTitle} aria-label={L.deleteAria}>
                      ✕
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

function ProfitChart({ values, ariaLabel }: { values: number[]; ariaLabel: string }) {
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
    <svg viewBox={`0 0 ${w} ${h}`} className="sparkline" preserveAspectRatio="none" role="img" aria-label={ariaLabel}>
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
