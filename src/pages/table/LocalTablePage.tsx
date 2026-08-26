/* Tisch auf einem Gerät: Die App ist Dealer, Chipverwalter und Schiedsrichter.
   Kern-Idee der Bedienung: Es ist immer nur EIN Bildschirm sichtbar –
   entweder „gib das Gerät weiter" (Karten verdeckt) oder „du bist dran"
   (Karten offen). Dadurch bleiben die Handkarten privat, obwohl alle
   dasselbe Gerät benutzen. */

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../../components/Icon';
import { PlayingCard } from '../../components/PlayingCard';
import { useLang } from '../../i18n';
import { STR } from '../../i18n/pages/localtable';
import {
  act,
  activeSeats,
  blindsForHand,
  currentPlayer,
  legalActions,
  reveal,
  settle,
  startHand,
  totalPot,
  type LocalSeat,
  type LocalTableConfig,
  type LocalTableState,
} from '../../lib/table/local';

type Screen = 'setup' | 'play' | 'final';

const MAX_SEATS = 9;

export function LocalTablePage() {
  const { lang } = useLang();
  const L = STR[lang];
  const nf = lang === 'de' ? 'de-DE' : 'en-GB';
  const n = (v: number) => v.toLocaleString(nf);

  const [screen, setScreen] = useState<Screen>('setup');
  const [names, setNames] = useState<string[]>(['', '', '']);
  const [stack, setStack] = useState('1000');
  const [sb, setSb] = useState('10');
  const [bb, setBb] = useState('20');
  const [raiseEvery, setRaiseEvery] = useState(0);
  const [setupError, setSetupError] = useState('');

  const [config, setConfig] = useState<LocalTableConfig | null>(null);
  const [table, setTable] = useState<LocalTableState | null>(null);
  const [buttonIndex, setButtonIndex] = useState(0);
  const [raiseOpen, setRaiseOpen] = useState(false);
  const [raiseValue, setRaiseValue] = useState(0);

  // ---------- Einrichtung ----------

  function begin() {
    const clean = names.map((x) => x.trim()).filter(Boolean);
    if (clean.length < 2) {
      setSetupError(L.needTwo);
      return;
    }
    const start = Math.max(1, Math.floor(Number(stack) || 0));
    const smallBlind = Math.max(1, Math.floor(Number(sb) || 0));
    const bigBlind = Math.max(smallBlind + 1, Math.floor(Number(bb) || 0));
    const seats: LocalSeat[] = clean.map((name, i) => ({ id: i, name, stack: start }));
    const cfg: LocalTableConfig = { seats, smallBlind, bigBlind, raiseBlindsEvery: raiseEvery };
    const first = startHand(cfg, 1, 0);
    if (!first) {
      setSetupError(L.needTwo);
      return;
    }
    setSetupError('');
    setConfig(cfg);
    setTable(first);
    setButtonIndex(0);
    setScreen('play');
  }

  // ---------- Spielzüge ----------

  function doAct(action: Parameters<typeof act>[1]) {
    if (!table) return;
    setRaiseOpen(false);
    setTable(act(table, action));
  }

  function nextHand() {
    if (!table || !config) return;
    const settled = settle(table);
    const stillIn = activeSeats(settled.seats);
    setConfig(settled);
    if (stillIn.length < 2) {
      setTable(null);
      setScreen('final');
      return;
    }
    const nextButton = (buttonIndex + 1) % stillIn.length;
    const next = startHand(settled, table.handNumber + 1, nextButton);
    if (!next) {
      setTable(null);
      setScreen('final');
      return;
    }
    setButtonIndex(nextButton);
    setTable(next);
  }

  function endTable() {
    if (!table || !config) return;
    if (!window.confirm(L.leaveConfirm)) return;
    setConfig(settle(table));
    setTable(null);
    setScreen('final');
  }

  const player = table ? currentPlayer(table) : null;
  const la = useMemo(
    () => (table && player && !table.game.handOver ? legalActions(table.game) : null),
    [table, player],
  );

  // ---------- Ansichten ----------

  if (screen === 'setup') {
    return (
      <div>
        <div className="page-header">
          <div className="eyebrow">{L.eyebrow}</div>
          <h1>{L.title}</h1>
          <p className="sub">{L.sub}</p>
        </div>

        <div className="grid cols-2" style={{ alignItems: 'start' }}>
          <div className="card">
            <div className="stat-label" style={{ marginBottom: 8 }}>{L.setupTitle}</div>
            {names.map((value, i) => (
              <div key={i} className="row" style={{ marginBottom: 8, flexWrap: 'nowrap' }}>
                <span
                  className="pill"
                  style={{ width: 30, height: 30, borderRadius: '50%', justifyContent: 'center', flexShrink: 0 }}
                >
                  {i + 1}
                </span>
                <input
                  className="text-input"
                  style={{ flex: 1, minWidth: 0 }}
                  value={value}
                  maxLength={20}
                  placeholder={L.playerName(i + 1)}
                  onChange={(e) => setNames((xs) => xs.map((x, j) => (j === i ? e.target.value : x)))}
                />
                {names.length > 2 && (
                  <button
                    className="btn sm ghost"
                    aria-label={L.removePlayer(value || L.playerName(i + 1))}
                    onClick={() => setNames((xs) => xs.filter((_, j) => j !== i))}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            {names.length < MAX_SEATS && (
              <button className="btn sm" style={{ marginTop: 6 }} onClick={() => setNames((xs) => [...xs, ''])}>
                {L.addPlayer}
              </button>
            )}
          </div>

          <div className="card">
            <div className="stat-label" style={{ marginBottom: 5 }}>{L.startStack}</div>
            <input
              className="text-input"
              style={{ width: '100%', marginBottom: 14 }}
              inputMode="numeric"
              value={stack}
              maxLength={7}
              onChange={(e) => setStack(e.target.value.replace(/\D/g, ''))}
            />

            <div className="stat-label" style={{ marginBottom: 5 }}>{L.blindsLabel}</div>
            <div className="row" style={{ marginBottom: 14 }}>
              <input
                className="text-input"
                style={{ width: 90 }}
                inputMode="numeric"
                value={sb}
                maxLength={6}
                onChange={(e) => setSb(e.target.value.replace(/\D/g, ''))}
              />
              <span className="faint">/</span>
              <input
                className="text-input"
                style={{ width: 90 }}
                inputMode="numeric"
                value={bb}
                maxLength={6}
                onChange={(e) => setBb(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            <div className="stat-label" style={{ marginBottom: 5 }}>{L.blindsRaise}</div>
            <div className="row wrap" style={{ marginBottom: 6 }}>
              {[0, 8, 12, 20].map((v) => (
                <button
                  key={v}
                  className={`btn sm${raiseEvery === v ? ' primary' : ''}`}
                  onClick={() => setRaiseEvery(v)}
                  aria-pressed={raiseEvery === v}
                >
                  {v === 0 ? L.blindsNever : L.blindsEvery(v)}
                </button>
              ))}
            </div>

            <p className="small faint" style={{ marginTop: 10 }}>
              <Link to="/tools/chips">{L.fromChipCalc}</Link>
            </p>

            {setupError && <div className="feedback-box bad" role="alert" style={{ marginTop: 12 }}>{setupError}</div>}

            <button className="btn primary" style={{ width: '100%', justifyContent: 'center', marginTop: 14 }} onClick={begin}>
              {L.startGame}
            </button>
          </div>
        </div>

        <div className="card" style={{ maxWidth: 720, marginTop: 16 }}>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>{L.tipTitle}</div>
          <p className="small muted">{L.tip}</p>
          <p className="small faint" style={{ marginTop: 10 }}>
            {L.onlineHint} <Link to="/live/tisch/online">{L.onlineLink}</Link>
          </p>
        </div>
      </div>
    );
  }

  if (screen === 'final' && config) {
    const ranked = [...config.seats].sort((a, b) => b.stack - a.stack);
    return (
      <div>
        <div className="page-header">
          <div className="eyebrow">{L.eyebrow}</div>
          <h1>{L.finalTitle}</h1>
          <p className="sub">{L.finalSub}</p>
        </div>
        <div className="card" style={{ maxWidth: 520 }}>
          {ranked.map((s, i) => (
            <div key={s.id} className="row between" style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <span className="row">
                <span
                  className="pill"
                  style={{ width: 30, height: 30, borderRadius: '50%', justifyContent: 'center', flexShrink: 0 }}
                >
                  {i + 1}
                </span>
                <strong>{s.name}</strong>
              </span>
              <span style={{ fontWeight: 800, color: s.stack > 0 ? 'var(--gold-bright)' : 'var(--text-faint)' }}>
                {s.stack > 0 ? n(s.stack) : L.bustedOut}
              </span>
            </div>
          ))}
          <button
            className="btn primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}
            onClick={() => { setScreen('setup'); setTable(null); }}
          >
            {L.newTable}
          </button>
        </div>
      </div>
    );
  }

  if (!table || !config) return null;
  const g = table.game;
  const blinds = blindsForHand(config, table.handNumber);

  /** Kopfzeile mit Hand-Nummer, Blinds und Pot – für alle sichtbar. */
  const header = (
    <div className="row between wrap" style={{ marginBottom: 14 }}>
      <span className="row" style={{ gap: 8 }}>
        <span className="pill">{L.handNumber(table.handNumber)}</span>
        <span className="pill">{L.blindsNow(n(blinds.sb), n(blinds.bb))}</span>
      </span>
      <span className="pill gold">{L.pot}: {n(totalPot(g))}</span>
    </div>
  );

  const boardRow = (
    <div className="row" style={{ justifyContent: 'center', gap: 6, minHeight: 62, marginBottom: 12 }}>
      {g.board.length === 0
        ? <span className="small faint">—</span>
        : g.board.map((c, i) => <PlayingCard key={i} card={c} size="md" />)}
    </div>
  );

  // --- Übergabe-Bildschirm: Karten sind verdeckt ---
  if (table.phase === 'pass' && player) {
    return (
      <div>
        {header}
        <div className="card" style={{ maxWidth: 520, textAlign: 'center', padding: '34px 22px' }}>
          <span
            style={{
              width: 52, height: 52, borderRadius: 16, display: 'inline-flex', alignItems: 'center',
              justifyContent: 'center', marginBottom: 14, background: 'var(--gold-dim)',
              color: 'var(--gold-bright)', border: '1px solid rgba(212,175,94,0.34)',
            }}
          >
            <Icon name="repeat" size={26} />
          </span>
          <h2 style={{ fontSize: 22, marginBottom: 6 }}>{L.passTitle(player.name)}</h2>
          <p className="small muted" style={{ marginBottom: 20 }}>{L.passSub}</p>
          {boardRow}
          <button
            className="btn primary"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => setTable(reveal(table))}
          >
            {L.passReveal}
          </button>
        </div>
        <TableOverview seats={g.players} n={n} />
      </div>
    );
  }

  // --- Showdown: alle dürfen schauen ---
  if (table.phase === 'showdown') {
    return (
      <div>
        {header}
        <div className="card" style={{ maxWidth: 560 }}>
          <div style={{ fontWeight: 800, marginBottom: 10 }}>{L.handOver}</div>
          {boardRow}
          <div className="stat-label" style={{ marginBottom: 6 }}>{L.winners}</div>
          {g.awards.map((a, i) => {
            const p = g.players.find((x) => x.id === a.playerId);
            return (
              <div key={i} className="feedback-box good" style={{ marginBottom: 8 }}>
                {a.handName
                  ? L.winsWith(p?.name ?? '?', n(a.amount), a.handName)
                  : L.wins(p?.name ?? '?', n(a.amount))}
              </div>
            );
          })}
          {/* Aufgedeckte Hände */}
          <div className="grid cols-2" style={{ marginTop: 12 }}>
            {g.players.filter((p) => p.revealed && p.cards.length > 0).map((p) => (
              <div key={p.id} className="row" style={{ gap: 8 }}>
                <span className="small" style={{ fontWeight: 700, minWidth: 70 }}>{p.name}</span>
                {p.cards.map((c, i) => <PlayingCard key={i} card={c} size="sm" />)}
              </div>
            ))}
          </div>
          <div className="row wrap" style={{ marginTop: 18 }}>
            <button className="btn primary" onClick={nextHand}>{L.nextHand}</button>
            <button className="btn ghost sm" onClick={endTable}>{L.endTable}</button>
          </div>
        </div>
        <TableOverview seats={g.players} n={n} />
      </div>
    );
  }

  // --- Zug: der aktuelle Spieler sieht seine Karten ---
  if (!player || !la) return null;
  const maxTo = la.maxRaiseTo;
  const minTo = Math.min(la.minRaiseTo, maxTo);
  const isBet = la.callAmount === 0;

  return (
    <div>
      {header}
      <div className="card" style={{ maxWidth: 560 }}>
        <div className="row between wrap" style={{ marginBottom: 10 }}>
          <strong>{L.yourCards(player.name)}</strong>
          <span className="pill">{L.yourStack}: {n(player.stack)}</span>
        </div>

        <div className="row" style={{ justifyContent: 'center', gap: 8, marginBottom: 16 }}>
          {player.cards.map((c, i) => <PlayingCard key={i} card={c} size="lg" />)}
        </div>

        <div className="stat-label" style={{ marginBottom: 4, textAlign: 'center' }}>{L.board}</div>
        {boardRow}

        {la.callAmount > 0 && (
          <p className="small muted" style={{ textAlign: 'center', marginBottom: 12 }}>
            {L.toCall(n(la.callAmount))}
          </p>
        )}

        {!raiseOpen ? (
          <div className="row wrap" style={{ gap: 8 }}>
            {la.canFold && (
              <button className="btn lg danger" onClick={() => doAct({ type: 'fold' })}>{L.fold}</button>
            )}
            {la.canCheck && (
              <button className="btn lg" onClick={() => doAct({ type: 'check' })}>{L.check}</button>
            )}
            {la.callAmount > 0 && (
              <button className="btn lg" onClick={() => doAct({ type: 'call' })}>{L.call(n(la.callAmount))}</button>
            )}
            {la.canBetOrRaise && (
              <button
                className="btn lg primary"
                onClick={() => { setRaiseValue(minTo); setRaiseOpen(true); }}
              >
                {L.showRaise}
              </button>
            )}
          </div>
        ) : (
          <div>
            <div className="stat-label" style={{ marginBottom: 6 }}>{L.raiseLabel}</div>
            <input
              type="range"
              min={minTo}
              max={maxTo}
              step={1}
              value={raiseValue}
              aria-label={L.raiseLabel}
              onChange={(e) => setRaiseValue(Number(e.target.value))}
              style={{ width: '100%' }}
            />
            <div className="row between" style={{ marginBottom: 10 }}>
              <span className="small faint">{n(minTo)}</span>
              <strong style={{ fontSize: 20 }}>{n(raiseValue)}</strong>
              <span className="small faint">{n(maxTo)}</span>
            </div>
            <div className="row wrap">
              <button className="btn primary" onClick={() => doAct({ type: 'raise', to: raiseValue })}>
                {isBet ? L.betTo(n(raiseValue)) : L.raiseTo(n(raiseValue))}
              </button>
              <button className="btn" onClick={() => { setRaiseValue(maxTo); doAct({ type: 'raise', to: maxTo }); }}>
                {L.allIn}
              </button>
              <button className="btn ghost sm" onClick={() => setRaiseOpen(false)}>{L.cancel}</button>
            </div>
          </div>
        )}
      </div>
      <TableOverview seats={g.players} n={n} activeId={player.id} />
    </div>
  );
}

/** Stack-Übersicht aller Spieler – enthält bewusst keine Handkarten. */
function TableOverview({
  seats,
  n,
  activeId,
}: {
  seats: Array<{ id: number; name: string; stack: number; bet: number; folded: boolean; allIn: boolean }>;
  n: (v: number) => string;
  activeId?: number;
}) {
  return (
    <div className="card" style={{ maxWidth: 560, marginTop: 14 }}>
      {seats.map((p) => (
        <div
          key={p.id}
          className="row between"
          style={{ padding: '7px 0', opacity: p.folded ? 0.45 : 1 }}
        >
          <span className="row" style={{ gap: 7 }}>
            <strong style={{ fontSize: 14.5 }}>{p.name}</strong>
            {p.id === activeId && <span className="pill gold">•</span>}
            {p.allIn && <span className="pill warn">All-in</span>}
          </span>
          <span className="small">
            {p.bet > 0 && <span className="faint" style={{ marginRight: 10 }}>→ {n(p.bet)}</span>}
            <strong>{n(p.stack)}</strong>
          </span>
        </div>
      ))}
    </div>
  );
}
