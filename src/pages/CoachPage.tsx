import { useMemo, useState } from 'react';
import { CardPicker } from '../components/CardPicker';
import { CardsRow } from '../components/PlayingCard';
import type { Card } from '../lib/poker/cards';
import { detectDraws, madeHandInfo } from '../lib/poker/analysis';
import {
  ACTION_LABEL,
  ACTION_STYLE,
  coachPositions,
  facingBetVerdict,
  postflopAdvice,
  preflopAdvice,
  type CoachAdvice,
  type CoachPosition,
} from '../lib/poker/coach';
import { equityVsRandomHands } from '../lib/poker/equity';
import { handLabel } from '../lib/poker/ranges';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/coach';
import { STR as PRO } from '../i18n/pages/pro';
import { usePro } from '../lib/pro/ProProvider';

type Step = 'setup' | 'hand' | 'preflop' | 'flop-in' | 'flop' | 'turn-in' | 'turn' | 'river-in' | 'river';

const STREET_OF: Record<string, 'flop' | 'turn' | 'river'> = {
  flop: 'flop',
  turn: 'turn',
  river: 'river',
};

export function CoachPage() {
  const { lang } = useLang();
  const L = STR[lang];
  const P = PRO[lang];
  const { access, consume, openPaywall } = usePro();
  const positions = coachPositions(lang);
  const [step, setStep] = useState<Step>('setup');
  const [players, setPlayers] = useState(6);
  const [position, setPosition] = useState<CoachPosition>('spaet');
  const [raisedBefore, setRaisedBefore] = useState(false);
  const [limpers, setLimpers] = useState(0);
  const [hole, setHole] = useState<Card[]>([]);
  const [board, setBoard] = useState<Card[]>([]);
  const [opponents, setOpponents] = useState(2);
  const [potInput, setPotInput] = useState('');
  const [betInput, setBetInput] = useState('');

  const used = useMemo(() => new Set<Card>([...hole, ...board]), [hole, board]);

  /* Eine Nutzung = eine neue Hand, nicht jede Street. Ohne Monetarisierung
     liefert access() immer „allowed“ – dann verhält sich alles wie bisher. */
  const coachAccess = access('coach');
  const freeLeft =
    coachAccess.state === 'allowed' && coachAccess.remaining !== undefined && coachAccess.limit !== undefined
      ? P.remaining(coachAccess.remaining, coachAccess.limit)
      : null;

  const equity = useMemo(() => {
    if (hole.length < 2) return 0;
    return equityVsRandomHands(hole, board, Math.max(1, opponents), 3000);
  }, [hole, board, opponents]);

  const advice: CoachAdvice | null = useMemo(() => {
    if (hole.length < 2) return null;
    if (step === 'preflop') {
      return preflopAdvice(handLabel(hole[0], hole[1]), position, players, raisedBefore, limpers, lang);
    }
    if (step === 'flop' || step === 'turn' || step === 'river') {
      const made = madeHandInfo(hole, board, lang);
      const draws = step === 'river' ? null : detectDraws(hole, board, lang);
      return postflopAdvice({ street: STREET_OF[step], made, draws, equity, opponents }, lang);
    }
    return null;
  }, [step, hole, board, position, players, raisedBefore, limpers, equity, opponents, lang]);

  const facing = useMemo(() => {
    const pot = parseFloat(potInput.replace(',', '.'));
    const bet = parseFloat(betInput.replace(',', '.'));
    if (!isFinite(pot) || !isFinite(bet) || pot <= 0 || bet <= 0 || hole.length < 2) return null;
    return facingBetVerdict(equity, pot, bet, lang);
  }, [potInput, betInput, equity, hole.length, lang]);

  /** Karteneingabe für eine neue Hand öffnen (verbucht wird erst bei der Eingabe). */
  function openHandEntry() {
    if (access('coach').state !== 'allowed') {
      openPaywall('coach');
      return;
    }
    setOpponents(Math.min(2, players - 1));
    setStep('hand');
  }

  function resetHand(keepSetup: boolean) {
    if (keepSetup && access('coach').state !== 'allowed') {
      openPaywall('coach');
      return;
    }
    setHole([]);
    setBoard([]);
    setPotInput('');
    setBetInput('');
    setOpponents(Math.min(2, players - 1));
    setStep(keepSetup ? 'hand' : 'setup');
  }

  const showAnalysis = step === 'preflop' || step === 'flop' || step === 'turn' || step === 'river';
  const made = showAnalysis && board.length >= 3 ? madeHandInfo(hole, board, lang) : null;
  const draws = showAnalysis && (step === 'flop' || step === 'turn') ? detectDraws(hole, board, lang) : null;

  const stepIndex = ['hand', 'preflop', 'flop-in', 'flop', 'turn-in', 'turn', 'river-in', 'river'].indexOf(step);

  return (
    <div>
      <div className="page-header">
        <div className="eyebrow">{L.eyebrow}</div>
        <h1>{L.title}</h1>
        <p className="sub">
          {L.sub}
        </p>
      </div>

      {step === 'setup' && (
        <div className="card" style={{ maxWidth: 640 }}>
          <div className="stat-label" style={{ marginBottom: 8 }}>{L.playersQuestion}</div>
          <div className="segmented" style={{ marginBottom: 20 }}>
            {[2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <button key={n} className={players === n ? 'on' : ''} onClick={() => setPlayers(n)}>
                {n}
              </button>
            ))}
          </div>

          <div className="stat-label" style={{ marginBottom: 8 }}>{L.positionQuestion}</div>
          <div className="segmented" style={{ marginBottom: 6 }}>
            {positions.map((p) => (
              <button key={p.id} className={position === p.id ? 'on' : ''} onClick={() => setPosition(p.id)}>
                {p.label}
              </button>
            ))}
          </div>
          <p className="small faint" style={{ marginBottom: 20 }}>
            {positions.find((p) => p.id === position)?.hint}
          </p>

          <div className="stat-label" style={{ marginBottom: 8 }}>{L.beforeQuestion}</div>
          <div className="segmented" style={{ marginBottom: 14 }}>
            <button className={!raisedBefore ? 'on' : ''} onClick={() => setRaisedBefore(false)}>
              {L.noRaiseYet}
            </button>
            <button className={raisedBefore ? 'on' : ''} onClick={() => setRaisedBefore(true)}>
              {L.someoneRaised}
            </button>
          </div>

          {!raisedBefore && (
            <>
              <div className="stat-label" style={{ marginBottom: 8 }}>{L.limpersQuestion}</div>
              <div className="segmented" style={{ marginBottom: 14 }}>
                {[0, 1, 2, 3, 4].map((n) => (
                  <button key={n} className={limpers === n ? 'on' : ''} onClick={() => setLimpers(n)}>
                    {n}
                  </button>
                ))}
              </div>
            </>
          )}

          <button className="btn primary lg block" onClick={openHandEntry}>
            {L.toHand}
          </button>

          {freeLeft && (
            <p className="small faint" style={{ marginTop: 10, textAlign: 'center' }}>
              {freeLeft}
            </p>
          )}

          <p className="small faint" style={{ marginTop: 14 }}>
            {L.setupNote}
          </p>
        </div>
      )}

      {step === 'hand' && (
        <div className="card" style={{ maxWidth: 640 }}>
          <CardPicker
            count={2}
            used={used}
            label={L.holeLabel}
            onComplete={(cards) => {
              if (access('coach').state !== 'allowed') {
                openPaywall('coach');
                return;
              }
              consume('coach');
              setHole(cards);
              setStep('preflop');
            }}
          />
        </div>
      )}

      {step === 'flop-in' && (
        <div className="card" style={{ maxWidth: 640 }}>
          <div className="row" style={{ marginBottom: 14 }}>
            <span className="stat-label">{L.yourHand}</span>
            <CardsRow cards={hole} size="sm" />
          </div>
          <CardPicker
            count={3}
            used={used}
            label={L.flopLabel}
            onComplete={(cards) => {
              setBoard(cards);
              setStep('flop');
            }}
          />
        </div>
      )}

      {(step === 'turn-in' || step === 'river-in') && (
        <div className="card" style={{ maxWidth: 640 }}>
          <div className="row wrap" style={{ marginBottom: 14 }}>
            <span className="stat-label">{L.handShort}</span>
            <CardsRow cards={hole} size="sm" />
            <span className="stat-label">{L.boardShort}</span>
            <CardsRow cards={board} size="sm" />
          </div>
          <CardPicker
            count={1}
            used={used}
            label={step === 'turn-in' ? L.turnCardLabel : L.riverCardLabel}
            onComplete={(cards) => {
              setBoard([...board, ...cards]);
              setStep(step === 'turn-in' ? 'turn' : 'river');
            }}
          />
        </div>
      )}

      {showAnalysis && advice && (
        <div style={{ maxWidth: 680 }}>
          <div className="card" style={{ marginBottom: 14 }}>
            <div className="row between wrap" style={{ marginBottom: 14 }}>
              <div className="row wrap">
                <CardsRow cards={hole} />
                {board.length > 0 && (
                  <>
                    <span className="faint" style={{ margin: '0 4px' }}>|</span>
                    <CardsRow cards={board} />
                  </>
                )}
              </div>
              <span className="pill gold">
                {step === 'preflop' ? L.streetPreflop : step === 'flop' ? L.streetFlop : step === 'turn' ? L.streetTurn : L.streetRiver}
              </span>
            </div>

            <div className={`coach-verdict ${ACTION_STYLE[advice.action].cls}`}>
              <span style={{ fontSize: 26 }}>{ACTION_STYLE[advice.action].icon}</span>
              <div>
                <div className="v-action">{advice.headline}</div>
                <div className="small muted">{L.recommendation} {ACTION_LABEL[advice.action]}</div>
              </div>
            </div>

            <ul className="list-plain">
              {advice.reasons.map((r, i) => (
                <li key={i} className="takeaway">
                  <span className="tick">›</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
            {advice.lowStakes && (
              <div className="callout tip" style={{ marginBottom: 0 }}>
                <span className="label">{L.homegameTip}</span>
                {advice.lowStakes}
              </div>
            )}
          </div>

          <div className="card" style={{ marginBottom: 14 }}>
            <div className="row between wrap">
              <div>
                <div className="stat-label">{L.winChance}</div>
                <div className="big-stat">{Math.round(equity * 100)} %</div>
                <div className="small faint">{L.vsRandom(opponents)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="stat-label" style={{ marginBottom: 6 }}>{L.activeOpponents}</div>
                <div className="segmented">
                  {Array.from({ length: Math.min(8, players - 1) }, (_, i) => i + 1).map((n) => (
                    <button key={n} className={opponents === n ? 'on' : ''} onClick={() => setOpponents(n)}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {made && (
              <div className="row wrap" style={{ marginTop: 12 }}>
                <span className="pill ok">{L.currentHand} {made.name}</span>
                {draws?.parts.map((p, i) => (
                  <span key={i} className="pill info">
                    {p.label}: {p.outs} {L.outsWord}
                  </span>
                ))}
              </div>
            )}
            <p className="small faint" style={{ marginTop: 10 }}>
              {L.equityNote}
            </p>
          </div>

          {step !== 'preflop' && (
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="stat-label" style={{ marginBottom: 8 }}>{L.facingBetQuestion}</div>
              <div className="row wrap">
                <input
                  className="text-input"
                  style={{ maxWidth: 150 }}
                  inputMode="decimal"
                  placeholder={L.potPlaceholder}
                  value={potInput}
                  onChange={(e) => setPotInput(e.target.value)}
                />
                <input
                  className="text-input"
                  style={{ maxWidth: 150 }}
                  inputMode="decimal"
                  placeholder={L.betPlaceholder}
                  value={betInput}
                  onChange={(e) => setBetInput(e.target.value)}
                />
              </div>
              {facing && (
                <div className={`feedback-box ${facing.ok ? 'good' : 'bad'}`} style={{ marginTop: 12 }}>
                  {facing.text}
                </div>
              )}
            </div>
          )}

          <div className="row wrap" style={{ marginBottom: 8 }}>
            {step === 'preflop' && (advice.action === 'fold' ? (
              <button className="btn lg" onClick={() => setStep('flop-in')}>
                {L.playAnywayFlop}
              </button>
            ) : (
              <button className="btn primary lg" onClick={() => setStep('flop-in')}>
                {L.toFlop}
              </button>
            ))}
            {step === 'flop' && (
              <button className="btn primary lg" onClick={() => setStep('turn-in')}>
                {L.toTurn}
              </button>
            )}
            {step === 'turn' && (
              <button className="btn primary lg" onClick={() => setStep('river-in')}>
                {L.toRiver}
              </button>
            )}
            <button className="btn lg" onClick={() => resetHand(true)}>
              {L.newHand}
            </button>
            <button className="btn lg ghost" onClick={() => resetHand(false)}>
              {L.changeSetup}
            </button>
            {freeLeft && <span className="small faint">{freeLeft}</span>}
          </div>

          {stepIndex >= 0 && (
            <div className="row" style={{ marginTop: 6 }}>
              <div className="step-dots">
                {L.stepNames.map((s, i) => {
                  const active =
                    (i === 0 && stepIndex >= 0) ||
                    (i === 1 && stepIndex >= 1) ||
                    (i === 2 && stepIndex >= 3) ||
                    (i === 3 && stepIndex >= 5) ||
                    (i === 4 && stepIndex >= 7);
                  return <span key={s} className={`dot${active ? ' on' : ''}`} title={s} />;
                })}
              </div>
              <span className="small faint">{L.progressLine}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
