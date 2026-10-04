import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppState, type SessionEntry } from '../../state/AppState';
import { useLang } from '../../i18n';
import { STR } from '../../i18n/pages/bankroll';
import { downloadBlob } from '../../lib/download';
import { csvDatei } from '../../lib/export/csv';
import { zahlAusEingabe } from '../../lib/eingabe/zahl';
import { Zurueck } from '../../components/ui';
import { Icon } from '../../components/Icon';
import { Spielerschutz } from '../../components/Spielerschutz';
import { datumAnzeigen, heuteIso, type Vorbelegung } from '../../lib/bankroll';

export function BankrollTracker() {
  const { data, addSession, deleteSession } = useAppState();
  const { lang } = useLang();
  const L = STR[lang];
  const nf = lang === 'de' ? 'de-DE' : 'en-GB';
  const euro = (n: number) => n.toLocaleString(nf, { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 });
  const vorz = (n: number) => `${n > 0 ? '+' : n < 0 ? '−' : ''}${euro(Math.abs(n))}`;
  const klasse = (n: number) => (n >= 0 ? 'ergebnis-plus' : 'ergebnis-minus');

  const { state } = useLocation();
  /* Kommt jemand aus dem Abschluss eines Abends, steht die Zeile schon da —
     zum Prüfen, nicht zum Abnicken: Gespeichert wird erst auf Knopfdruck. */
  const vorlage = (state as { vorbelegung?: Vorbelegung } | null)?.vorbelegung;

  const [filter, setFilter] = useState<'alle' | 'online' | 'live'>('alle');
  const [offen, setOffen] = useState(() => data.sessions.length === 0 || !!vorlage);
  const [form, setForm] = useState({
    date: vorlage?.date ?? heuteIso(),
    type: (vorlage?.type ?? 'live') as 'online' | 'live',
    game: '',
    buyIn: vorlage ? String(vorlage.buyIn).replace('.', lang === 'de' ? ',' : '.') : '',
    cashOut: vorlage ? String(vorlage.cashOut).replace('.', lang === 'de' ? ',' : '.') : '',
    minutes: vorlage ? String(vorlage.minutes) : '',
    notes: '',
  });
  const [formError, setFormError] = useState<string | null>(null);

  /* Löschen mit fünf Sekunden Rückweg. Die Session verschwindet sofort aus
     Liste und Rechnung, wird aber erst danach wirklich entfernt. Wer die Seite
     vorher verlässt, löscht damit bestätigend: Sonst bliebe etwas stehen, das
     der Mensch schon weggeschickt hat. */
  const [ausstehend, setAusstehend] = useState<SessionEntry | null>(null);
  const timer = useRef<number | null>(null);
  const ausstehendRef = useRef<SessionEntry | null>(null);
  ausstehendRef.current = ausstehend;
  /* Die Löschfunktion steht in einem Ref: Ihr Aufräumen beim Verlassen der
     Seite darf nicht schon laufen, nur weil sich ihre Identität ändert. */
  const loeschRef = useRef(deleteSession);
  loeschRef.current = deleteSession;
  const endgueltig = useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
    const a = ausstehendRef.current;
    if (a) loeschRef.current(a.id);
    ausstehendRef.current = null;
    setAusstehend(null);
  }, []);
  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
    if (ausstehendRef.current) loeschRef.current(ausstehendRef.current.id);
  }, []);

  function loesche(s: SessionEntry) {
    endgueltig();
    ausstehendRef.current = s;
    setAusstehend(s);
    timer.current = window.setTimeout(endgueltig, 5000);
  }

  function zurueck() {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
    ausstehendRef.current = null;
    setAusstehend(null);
  }

  const sichtbar = useMemo(
    () => data.sessions.filter((s) => s.id !== ausstehend?.id),
    [data.sessions, ausstehend],
  );
  const filteredSessions = useMemo(
    () => sichtbar.filter((s) => filter === 'alle' || s.type === filter),
    [sichtbar, filter],
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

  function exportCsv() {
    const datei = csvDatei(
      ['Datum', 'Art', 'Spiel', 'Buy-in', 'Cash-out', 'Gewinn', 'Minuten', 'Notizen'],
      filteredSessions.map((s) => [
        s.date, s.type, s.game, s.buyIn, s.cashOut, s.cashOut - s.buyIn, s.minutes, s.notes ?? '',
      ]),
    );
    downloadBlob(datei, 'pokermentor-sessions.csv', 'text/csv;charset=utf-8');
  }

  function submit() {
    setFormError(null);
    const buyIn = zahlAusEingabe(form.buyIn, lang);
    const cashOut = zahlAusEingabe(form.cashOut, lang);
    const minutes = zahlAusEingabe(form.minutes, lang);
    if (!form.date) return setFormError(L.errDate);
    if (buyIn === null || buyIn < 0) return setFormError(L.errBuyIn);
    if (cashOut === null || cashOut < 0) return setFormError(L.errCashOut);
    if (minutes === null || minutes <= 0) return setFormError(L.errMinutes);
    addSession({
      date: form.date,
      type: form.type,
      game: form.game.trim() || L.gameFallback,
      buyIn,
      cashOut,
      minutes: Math.round(minutes),
      notes: form.notes.trim() || undefined,
    });
    setForm((f) => ({ ...f, buyIn: '', cashOut: '', minutes: '', notes: '' }));
    setOffen(false);
  }

  return (
    <div>
      <Zurueck to="/session" />
      <div className="page-header">
        <h1>{L.title}</h1>
        <p className="sub">{L.sub}</p>
      </div>

      <div className="row wrap between" style={{ marginBottom: 16 }}>
        <div className="segmented" role="radiogroup" aria-label={L.labelType}>
          {([['alle', L.filterAll], ['online', L.filterOnline], ['live', L.filterLive]] as const).map(([wert, text]) => (
            <button
              key={wert}
              type="button"
              role="radio"
              aria-checked={filter === wert}
              className={filter === wert ? 'on' : ''}
              onClick={() => setFilter(wert)}
            >
              {text}
            </button>
          ))}
        </div>
        {sichtbar.length > 0 && (
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
              <div className={`big-stat ${klasse(stats.profit)}`} style={{ fontSize: 'var(--fs-ueberschrift)' }}>
                {euro(stats.profit)}
              </div>
            </div>
            <div className="card">
              <div className="stat-label">{L.statHourly}</div>
              <div className="big-stat" style={{ fontSize: 'var(--fs-ueberschrift)' }}>{euro(stats.hourly)}/h</div>
              <div className="small faint">{L.hours(stats.hours)}</div>
            </div>
            <div className="card">
              <div className="stat-label">{L.statSessions}</div>
              <div className="big-stat" style={{ fontSize: 'var(--fs-ueberschrift)' }}>{filteredSessions.length}</div>
              <div className="small faint">{L.winRate(stats.winRate)}</div>
            </div>
            <div className="card">
              <div className="stat-label">{L.statBestWorst}</div>
              <div className={klasse(stats.best)} style={{ fontWeight: 700 }}>{euro(stats.best)}</div>
              <div className={klasse(stats.worst)} style={{ fontWeight: 700 }}>{euro(stats.worst)}</div>
            </div>
          </div>

          {stats.cumulative.length >= 2 && (
            <div className="card" style={{ marginBottom: 18 }}>
              <div className="verlauf-kopf">
                <div className="stat-label">{L.chartTitle}</div>
                <div className={`verlauf-stand ${klasse(stats.profit)}`}>
                  <span className="small faint">{L.verlaufStand} </span>{vorz(stats.profit)}
                </div>
              </div>
              <ProfitChart values={stats.cumulative} ariaLabel={L.verlaufAria(vorz(stats.profit))} />
            </div>
          )}
        </>
      )}

      {/* Die Liste zuerst: Wer wiederkommt, will sehen, was da ist — nicht ein
          Formular mit sieben Feldern. Das Formular steht hinter „+ Session",
          beim allerersten Besuch aber offen. */}
      {sichtbar.length > 0 && (
        <div className="session-liste-kopf">
          <div className="section-title" style={{ margin: 0 }}>{L.sessionsTitle}</div>
          {!offen && (
            <button type="button" className="btn sm primary" onClick={() => setOffen(true)}>
              {L.neueSessionKnopf}
            </button>
          )}
        </div>
      )}

      {ausstehend && (
        <div className="rueckgaengig-zeile" role="status">
          <span>{L.geloescht}</span>
          <button type="button" className="btn sm" onClick={zurueck}>{L.rueckgaengig}</button>
        </div>
      )}

      {filteredSessions.length > 0 && (
        <div className="session-liste">
          {[...filteredSessions].reverse().map((s: SessionEntry) => {
            const p = s.cashOut - s.buyIn;
            return (
              <div key={s.id} className="card row between wrap">
                <div>
                  <div className="row" style={{ fontWeight: 700, gap: 8 }}>
                    <span className="pill">{s.type === 'live' ? L.pillLive : L.pillOnline}</span>
                    {s.game}
                  </div>
                  <div className="small faint">
                    {datumAnzeigen(s.date, lang)} · {L.minutes(s.minutes)}
                    {s.notes && ` · ${s.notes}`}
                  </div>
                </div>
                <div className="row">
                  <span className={`session-zeile-betrag ${klasse(p)}`}>{vorz(p)}</span>
                  <button className="btn sm ghost" onClick={() => loesche(s)} title={L.deleteTitle} aria-label={L.deleteAria}>
                    <Icon name="x" size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {sichtbar.length === 0 && !offen && <p className="hinweis">{L.leerListe}</p>}

      {offen && (
        <div className="card" style={{ marginBottom: 18 }}>
          <div className="section-title" style={{ marginTop: 0 }}>{L.newSession}</div>
          {vorlage && <p className="small muted" style={{ marginTop: 0 }}>{L.ausAbend}</p>}
          <div className="grid cols-2" style={{ gap: 12 }}>
            <label>
              <div className="stat-label" style={{ marginBottom: 5 }}>{L.labelDate}</div>
              <input
                type="date"
                lang={lang}
                className="text-input"
                value={form.date}
                max={heuteIso()}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </label>
            <div>
              <div className="stat-label" id="bk-art" style={{ marginBottom: 5 }}>{L.labelType}</div>
              <div className="segmented" role="radiogroup" aria-labelledby="bk-art">
                {([['live', L.optionLive], ['online', L.optionOnline]] as const).map(([wert, text]) => (
                  <button
                    key={wert}
                    type="button"
                    role="radio"
                    aria-checked={form.type === wert}
                    className={form.type === wert ? 'on' : ''}
                    onClick={() => setForm({ ...form, type: wert })}
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>
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
          {formError && <div className="feedback-box bad" role="alert" style={{ marginTop: 12 }}>{formError}</div>}
          <div className="row wrap" style={{ marginTop: 14 }}>
            <button className="btn primary" onClick={submit}>
              {L.save}
            </button>
            {sichtbar.length > 0 && (
              <button type="button" className="btn" onClick={() => setOffen(false)}>{L.formSchliessen}</button>
            )}
          </div>
        </div>
      )}

      <Spielerschutz />
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
      <line className="nulllinie" x1={pad} y1={zeroY} x2={w - pad} y2={zeroY} strokeDasharray="4 4" />
      <polyline
        points={points}
        fill="none"
        stroke={last >= 0 ? 'var(--ergebnis-gut)' : 'var(--ergebnis-schlecht)'}
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
