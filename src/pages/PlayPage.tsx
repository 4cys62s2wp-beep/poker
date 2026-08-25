import { useEffect, useMemo, useRef, useState } from 'react';
import { CardsRow } from '../components/PlayingCard';
import { IconTile } from '../components/Icon';
import { BOT_PROFILES, decideBotAction, positionOf, type BotStyle } from '../lib/poker/ai';
import { categoryNameIn, evaluateBest } from '../lib/poker/evaluator';
import { equityVsRandomHands } from '../lib/poker/equity';
import {
  applyAction,
  createHand,
  legalActions,
  setEngineLanguage,
  totalPot,
  type GameState,
} from '../lib/poker/engine';
import { useAppState } from '../state/AppState';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/play';
import { STR as PRO } from '../i18n/pages/pro';
import { usePro } from '../lib/pro/ProProvider';

const START_STACK = 200; // 100bb bei Blinds 1/2
const SB = 1;
const BB = 2;

/** Spielstile der KI-Sitze; die Anzeigenamen liegen sprachabhängig im Wörterbuch (STR[lang].botNames). */
const BOT_STYLES: BotStyle[] = ['tight', 'aggro', 'loose', 'standard', 'tight'];

/** Sitzpositionen (Prozent) je Spielerzahl; Hero ist immer Index 0 (unten Mitte). */
const LAYOUTS: Record<number, Array<{ x: number; y: number }>> = {
  2: [
    { x: 50, y: 88 },
    { x: 50, y: 4 },
  ],
  3: [
    { x: 50, y: 88 },
    { x: 12, y: 18 },
    { x: 88, y: 18 },
  ],
  6: [
    { x: 50, y: 88 },
    { x: 8, y: 62 },
    { x: 12, y: 12 },
    { x: 50, y: 2 },
    { x: 88, y: 12 },
    { x: 92, y: 62 },
  ],
};

export function PlayPage() {
  const { data, recordHand, addHandRecord } = useAppState();
  const { lang } = useLang();
  const L = STR[lang];
  const P = PRO[lang];
  const { access, can, consume, openPaywall } = usePro();
  const [numOpponents, setNumOpponents] = useState<number | null>(null);
  const [coachMode, setCoachMode] = useState(true);
  const gameRef = useRef<GameState | null>(null);
  const [, setTick] = useState(0);
  const rerender = () => setTick((t) => t + 1);
  const botTimer = useRef<number | null>(null);
  const stacksRef = useRef<number[]>([]);
  const buttonRef = useRef(0);
  const handCounter = useRef(0);
  const handRecorded = useRef(false);
  const [showRaisePanel, setShowRaisePanel] = useState(false);

  /* Coach-Overlay ist eine Pro-Funktion, der Tisch selbst ist gratis mit
     Tageslimit. Ohne Monetarisierung sind can()/access() immer offen. */
  const coachAllowed = can('play-coach');
  const coachOn = coachMode && coachAllowed;
  const playAccess = access('play-hands');
  const freeLeft =
    playAccess.state === 'allowed' && playAccess.remaining !== undefined && playAccess.limit !== undefined
      ? P.remaining(playAccess.remaining, playAccess.limit)
      : null;

  // Engine-Log in der UI-Sprache schreiben lassen
  useEffect(() => {
    setEngineLanguage(lang);
  }, [lang]);

  /* Eine Nutzung = eine ausgeteilte Hand. Ohne Monetarisierung liefert
     access() immer „allowed“ – dann läuft alles wie bisher. */
  function handAllowed(): boolean {
    if (access('play-hands').state === 'allowed') return true;
    openPaywall('play');
    return false;
  }

  function startSession(opponents: number) {
    // Erst prüfen, dann den Tisch aufbauen – sonst bliebe ein leerer Tisch stehen.
    if (!handAllowed()) return;
    setNumOpponents(opponents);
    stacksRef.current = new Array(opponents + 1).fill(START_STACK);
    buttonRef.current = 0;
    handCounter.current = 0;
    startHand(opponents);
  }

  function startHand(opponents?: number) {
    if (!handAllowed()) return;
    consume('play-hands');
    const n = (opponents ?? numOpponents ?? 1) + 1;
    // Rebuy für Pleite-Spieler
    for (let i = 0; i < n; i++) {
      if (stacksRef.current[i] < BB * 2) stacksRef.current[i] = START_STACK;
    }
    handCounter.current += 1;
    buttonRef.current = (buttonRef.current + 1) % n;
    handRecorded.current = false;
    setShowRaisePanel(false);
    setEngineLanguage(lang);
    const players = Array.from({ length: n }, (_, i) => ({
      id: i,
      name: i === 0 ? L.heroName : L.botNames[i - 1],
      stack: stacksRef.current[i],
      isHero: i === 0,
    }));
    gameRef.current = createHand(players, buttonRef.current, SB, BB, handCounter.current);
    rerender();
  }

  // Bot-Zug-Schleife
  useEffect(() => {
    const g = gameRef.current;
    if (!g) return;

    if (g.handOver) {
      if (!handRecorded.current) {
        handRecorded.current = true;
        const heroWon = g.awards.some((a) => a.playerId === 0 && a.amount > 0);
        const hero = g.players[0];
        const delta = hero.stack - stacksRef.current[0];
        recordHand(heroWon);
        addHandRecord({
          handNumber: g.handNumber,
          heroCards: hero.cards,
          board: g.board,
          result: heroWon ? 'won' : hero.folded ? 'folded' : 'lost',
          amount: delta,
          players: g.players.length,
          log: g.log.map((e) => e.text),
        });
      }
      // Stacks sichern
      for (const p of g.players) stacksRef.current[p.id] = p.stack;
      return;
    }

    const actor = g.players[g.toActIndex];
    if (!actor || actor.isHero) return;

    botTimer.current = window.setTimeout(() => {
      const gg = gameRef.current;
      if (!gg || gg.handOver) return;
      const idx = gg.toActIndex;
      const bot = gg.players[idx];
      if (!bot || bot.isHero) return;
      const profile = BOT_PROFILES[BOT_STYLES[bot.id - 1]];
      try {
        applyAction(gg, decideBotAction(gg, idx, profile));
      } catch {
        // Fallback: sichere Aktion
        const la = legalActions(gg);
        applyAction(gg, la.canCheck ? { type: 'check' } : { type: 'fold' });
      }
      rerender();
    }, 550 + Math.random() * 700);
    return () => {
      if (botTimer.current) window.clearTimeout(botTimer.current);
    };
  });

  const g = gameRef.current;

  // Coach-Infos für den Hero
  const hero = g?.players[0];
  const heroTurn = !!g && !g.handOver && g.toActIndex === 0;
  const la = heroTurn && g ? legalActions(g) : null;

  const coachInfo = useMemo(() => {
    if (!g || !hero || hero.folded || !coachOn || !heroTurn) return null;
    const opponents = g.players.filter((p) => !p.folded && !p.isHero).length;
    const equity = equityVsRandomHands(hero.cards, g.board, opponents, 500);
    const pot = totalPot(g);
    const call = la?.callAmount ?? 0;
    const required = call > 0 ? call / (pot + call) : 0;
    const handName =
      g.board.length >= 3 ? categoryNameIn(evaluateBest([...hero.cards, ...g.board]), lang) : null;
    return { equity, required, call, handName, opponents };
  }, [g, hero, coachOn, heroTurn, la?.callAmount, lang]);

  if (numOpponents === null) {
    return (
      <div>
        <div className="page-header">
          <div className="eyebrow">{L.eyebrow}</div>
          <h1>{L.title}</h1>
          <p className="sub">{L.intro}</p>
        </div>

        <div className="card" style={{ maxWidth: 640 }}>
          <div className="section-title" style={{ marginTop: 0 }}>{L.chooseTable}</div>
          <div className="grid cols-3">
            <button
              className="card clickable"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
              onClick={() => startSession(1)}
            >
              <IconTile name="profile" tone="gold" size={38} />
              <div style={{ fontWeight: 800 }}>{L.headsUp}</div>
              <div className="small faint">{L.opponents(1)}</div>
            </button>
            <button
              className="card clickable"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
              onClick={() => startSession(2)}
            >
              <IconTile name="play" tone="green" size={38} />
              <div style={{ fontWeight: 800 }}>{L.threeHanded}</div>
              <div className="small faint">{L.opponents(2)}</div>
            </button>
            <button
              className="card clickable"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
              onClick={() => startSession(5)}
            >
              <IconTile name="chip" tone="red" size={38} />
              <div style={{ fontWeight: 800 }}>{L.sixMax}</div>
              <div className="small faint">{L.opponents(5)}</div>
            </button>
          </div>
          {freeLeft && (
            <p className="small faint" style={{ marginTop: 12, marginBottom: 0 }}>
              {freeLeft}
            </p>
          )}
          <hr className="divider" />
          <label className="row" style={{ cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={coachOn}
              onChange={(e) => {
                if (!coachAllowed) {
                  openPaywall();
                  return;
                }
                setCoachMode(e.target.checked);
              }}
              style={{ width: 18, height: 18, accentColor: 'var(--gold)' }}
            />
            <div>
              <div className="row" style={{ fontWeight: 700 }}>
                {L.coachMode}
                {!coachAllowed && (
                  <span className="pill gold" title={P.lockedTitle}>{P.proBadge}</span>
                )}
              </div>
              <div className="small muted">{L.coachModeDesc}</div>
            </div>
          </label>
          <p className="small faint" style={{ marginTop: 14 }}>
            {L.blindsInfo(SB, BB, START_STACK, START_STACK / BB)}
          </p>
        </div>

        {data.hands.length > 0 && (
          <>
            <div className="section-title">{L.recentHands}</div>
            <HandHistoryList hands={data.hands} />
          </>
        )}
      </div>
    );
  }

  if (!g) return null;

  const layout = LAYOUTS[g.players.length] ?? LAYOUTS[6];
  const pot = totalPot(g);
  const lastAward = g.handOver ? g.awards : null;

  function heroAct(action: Parameters<typeof applyAction>[1]) {
    const gg = gameRef.current;
    if (!gg || gg.handOver || gg.toActIndex !== 0) return;
    try {
      applyAction(gg, action);
      setShowRaisePanel(false);
      rerender();
    } catch {
      // Ungültige Aktion ignorieren
    }
  }

  function raiseTo(fraction: number | 'min' | 'allin') {
    if (!la || !g) return;
    let to: number;
    if (fraction === 'min') to = la.minRaiseTo;
    else if (fraction === 'allin') to = la.maxRaiseTo;
    else {
      const potAfterCall = pot + la.callAmount;
      to = Math.round(g.currentBet + la.callAmount === 0
        ? Math.max(la.minRaiseTo, fraction * pot)
        : g.currentBet + fraction * potAfterCall);
    }
    to = Math.max(la.minRaiseTo, Math.min(la.maxRaiseTo, to));
    heroAct({ type: 'raise', to });
  }

  return (
    <div>
      <div className="row between wrap" style={{ marginBottom: 14 }}>
        <h1 style={{ fontSize: 22, fontWeight: 750 }}>{L.tableTitle}</h1>
        <div className="row">
          <span className="pill">{L.handPill(g.handNumber)}</span>
          <span className="pill gold">{L.streetLabel[g.street]}</span>
          <button
            className="btn sm ghost"
            onClick={() => {
              setNumOpponents(null);
              gameRef.current = null;
            }}
          >
            {L.leaveTable}
          </button>
        </div>
      </div>

      <div className="table-felt" style={{ marginBottom: 16, height: 380, position: 'relative' }}>
        {/* Board & Pot in der Mitte */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '42%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          {g.board.length > 0 ? (
            <CardsRow cards={g.board} />
          ) : (
            <div className="small" style={{ color: 'rgba(255,255,255,0.5)' }}>♠ PokerMentor ♠</div>
          )}
          <div className="chip-bet" style={{ marginTop: 10 }}>
            <span className="chip-dot" /> {L.potLabel}: {pot > 0 ? pot : g.handOver ? g.awards.reduce((s, a) => s + a.amount, 0) : 0}
          </div>
        </div>

        {/* Sitze */}
        {g.players.map((p, i) => {
          const posLayout = layout[i];
          const isButton = g.buttonIndex === i;
          const acting = !g.handOver && g.toActIndex === i;
          const posName = positionOf(g, i);
          return (
            <div
              key={p.id}
              style={{
                position: 'absolute',
                left: `${posLayout.x}%`,
                top: `${posLayout.y}%`,
                transform: 'translate(-50%, 0)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <div className={`seat${p.folded ? ' folded' : ''}${acting ? ' acting' : ''}`}>
                <div className="name">
                  {p.name} {isButton && <span className="dealer-btn">D</span>}
                </div>
                <div className="stack">{L.chipsAmount(p.stack)}</div>
                <div className="tag">
                  {posName}
                  {!p.isHero && ` · ${L.styleLabel[BOT_STYLES[p.id - 1]]}`}
                </div>
                <div style={{ marginTop: 5, display: 'flex', justifyContent: 'center' }}>
                  {p.isHero || p.revealed ? (
                    <CardsRow cards={p.cards} size="sm" />
                  ) : p.folded ? (
                    <span className="small faint">{L.foldedTag}</span>
                  ) : (
                    <CardsRow cards={[undefined, undefined]} size="sm" />
                  )}
                </div>
              </div>
              {p.bet > 0 && (
                <span className="chip-bet">
                  <span className="chip-dot" /> {p.bet}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Gewinner-Anzeige */}
      {g.handOver && lastAward && (
        <div className="card" style={{ marginBottom: 14, borderColor: 'rgba(217,180,91,0.4)' }}>
          {lastAward.map((a, i) => {
            const p = g.players.find((pl) => pl.id === a.playerId)!;
            return (
              <div key={i} style={{ fontWeight: 700 }}>
                {L.winnerLine(p.isHero, p.name, a.amount, a.handName)}
              </div>
            );
          })}
          <div className="row wrap" style={{ marginTop: 12 }}>
            <button className="btn primary" onClick={() => startHand()}>
              {L.nextHand}
            </button>
            {freeLeft && <span className="small faint">{freeLeft}</span>}
          </div>
        </div>
      )}

      {/* Coach-Panel */}
      {coachOn && coachInfo && heroTurn && (
        <div className="card" style={{ marginBottom: 14, background: 'var(--bg-elev)' }}>
          <div className="row wrap">
            <span className="pill gold">{L.coachPill}</span>
            <span className="pill">{L.coachEquity(coachInfo.opponents, Math.round(coachInfo.equity * 100))}</span>
            {coachInfo.call > 0 && (
              <span className="pill info">
                {L.coachPotOdds(coachInfo.call, pot + coachInfo.call, Math.round(coachInfo.required * 100))}
              </span>
            )}
            {coachInfo.handName && <span className="pill ok">{L.coachCurrent(coachInfo.handName)}</span>}
          </div>
          {coachInfo.call > 0 && (
            <p className="small muted" style={{ marginTop: 8 }}>
              {coachInfo.equity > coachInfo.required + 0.05
                ? L.adviceCall
                : coachInfo.equity < coachInfo.required - 0.05
                  ? L.adviceFold
                  : L.adviceClose}
              {' '}{L.adviceNote}
            </p>
          )}
        </div>
      )}

      {/* Aktions-Buttons */}
      {heroTurn && la && (
        <div className="card">
          <div className="row wrap">
            {la.canFold && (
              <button className="btn danger lg" onClick={() => heroAct({ type: 'fold' })}>
                {L.fold}
              </button>
            )}
            {la.canCheck ? (
              <button className="btn lg" onClick={() => heroAct({ type: 'check' })}>
                {L.check}
              </button>
            ) : (
              <button className="btn lg" onClick={() => heroAct({ type: 'call' })}>
                {L.call(la.callAmount)}
              </button>
            )}
            {la.canBetOrRaise && (
              <button className="btn primary lg" onClick={() => setShowRaisePanel((s) => !s)}>
                {g.currentBet === 0 ? L.bet : L.raise} …
              </button>
            )}
          </div>
          {showRaisePanel && la.canBetOrRaise && (
            <div className="row wrap" style={{ marginTop: 12 }}>
              <button className="btn sm" onClick={() => raiseTo('min')}>{L.minRaise(la.minRaiseTo)}</button>
              <button className="btn sm" onClick={() => raiseTo(0.5)}>{L.halfPot}</button>
              <button className="btn sm" onClick={() => raiseTo(0.75)}>{L.threeQuarterPot}</button>
              <button className="btn sm" onClick={() => raiseTo(1)}>{L.fullPot}</button>
              <button className="btn sm danger" onClick={() => raiseTo('allin')}>{L.allIn(la.maxRaiseTo)}</button>
            </div>
          )}
        </div>
      )}

      {!heroTurn && !g.handOver && (
        <div className="card small muted">{L.thinking(g.players[g.toActIndex]?.name ?? '')}</div>
      )}

      {/* Verlauf */}
      <div className="section-title">{L.historyTitle}</div>
      <div className="card game-log">
        {g.log.map((entry, i) => {
          const isStreet = entry.playerId === undefined;
          return (
            <div key={i} className={isStreet ? 'street-mark' : ''}>
              {L.fixLogGrammar(entry.text)}
            </div>
          );
        })}
      </div>

      {data.hands.length > 0 && g.handOver && (
        <>
          <div className="section-title">{L.recentHands}</div>
          <HandHistoryList hands={data.hands.slice(0, 10)} />
        </>
      )}
    </div>
  );
}

const RESULT_CLS: Record<'won' | 'lost' | 'folded', string> = {
  won: 'ok',
  lost: 'danger',
  folded: '',
};

function HandHistoryList({ hands }: { hands: Array<import('../state/AppState').HandRecord> }) {
  const { lang } = useLang();
  const L = STR[lang];
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <div className="grid" style={{ maxWidth: 720 }}>
      {hands.map((h) => {
        const time = new Date(h.date).toLocaleTimeString(L.timeLocale, { hour: '2-digit', minute: '2-digit' });
        const open = openId === h.id;
        return (
          <div key={h.id} className="card" style={{ padding: 14 }}>
            <div
              className="row between wrap"
              style={{ cursor: 'pointer' }}
              onClick={() => setOpenId(open ? null : h.id)}
            >
              <div className="row wrap">
                <CardsRow cards={h.heroCards} size="sm" />
                {h.board.length > 0 && (
                  <>
                    <span className="faint">|</span>
                    <CardsRow cards={h.board} size="sm" />
                  </>
                )}
              </div>
              <div className="row">
                <span className={`pill ${RESULT_CLS[h.result]}`}>{L.resultLabel[h.result]}</span>
                <span style={{ fontWeight: 800, color: h.amount >= 0 ? 'var(--ok)' : 'var(--danger)', fontVariantNumeric: 'tabular-nums' }}>
                  {h.amount >= 0 ? '+' : ''}{h.amount}
                </span>
                <span className="small faint">{time}</span>
                <span className="faint">{open ? '▾' : '▸'}</span>
              </div>
            </div>
            {open && (
              <div className="game-log" style={{ marginTop: 12, maxHeight: 260 }}>
                {h.log.map((line, i) => (
                  <div key={i}>{L.fixLogGrammar(line)}</div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
