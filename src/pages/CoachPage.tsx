import { useMemo, useState } from 'react';
import { CardPicker } from '../components/CardPicker';
import { CardsRow } from '../components/PlayingCard';
import type { Card } from '../lib/poker/cards';
import { detectDraws, madeHandInfo } from '../lib/poker/analysis';
import {
  ACTION_LABEL,
  ACTION_STYLE,
  COACH_POSITIONS,
  facingBetVerdict,
  postflopAdvice,
  preflopAdvice,
  type CoachAdvice,
  type CoachPosition,
} from '../lib/poker/coach';
import { equityVsRandomHands } from '../lib/poker/equity';
import { handLabel } from '../lib/poker/ranges';

type Step = 'setup' | 'hand' | 'preflop' | 'flop-in' | 'flop' | 'turn-in' | 'turn' | 'river-in' | 'river';

const STREET_OF: Record<string, 'flop' | 'turn' | 'river'> = {
  flop: 'flop',
  turn: 'turn',
  river: 'river',
};

export function CoachPage() {
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

  const equity = useMemo(() => {
    if (hole.length < 2) return 0;
    return equityVsRandomHands(hole, board, Math.max(1, opponents), 3000);
  }, [hole, board, opponents]);

  const advice: CoachAdvice | null = useMemo(() => {
    if (hole.length < 2) return null;
    if (step === 'preflop') {
      return preflopAdvice(handLabel(hole[0], hole[1]), position, players, raisedBefore, limpers);
    }
    if (step === 'flop' || step === 'turn' || step === 'river') {
      const made = madeHandInfo(hole, board);
      const draws = step === 'river' ? null : detectDraws(hole, board);
      return postflopAdvice({ street: STREET_OF[step], made, draws, equity, opponents });
    }
    return null;
  }, [step, hole, board, position, players, raisedBefore, limpers, equity, opponents]);

  const facing = useMemo(() => {
    const pot = parseFloat(potInput.replace(',', '.'));
    const bet = parseFloat(betInput.replace(',', '.'));
    if (!isFinite(pot) || !isFinite(bet) || pot <= 0 || bet <= 0 || hole.length < 2) return null;
    return facingBetVerdict(equity, pot, bet);
  }, [potInput, betInput, equity, hole.length]);

  function resetHand(keepSetup: boolean) {
    setHole([]);
    setBoard([]);
    setPotInput('');
    setBetInput('');
    setOpponents(Math.min(2, players - 1));
    setStep(keepSetup ? 'hand' : 'setup');
  }

  const showAnalysis = step === 'preflop' || step === 'flop' || step === 'turn' || step === 'river';
  const made = showAnalysis && board.length >= 3 ? madeHandInfo(hole, board) : null;
  const draws = showAnalysis && (step === 'flop' || step === 'turn') ? detectDraws(hole, board) : null;

  const stepIndex = ['hand', 'preflop', 'flop-in', 'flop', 'turn-in', 'turn', 'river-in', 'river'].indexOf(step);

  return (
    <div>
      <div className="page-header">
        <div className="eyebrow">Dein Berater am Tisch</div>
        <h1>Live-Coach</h1>
        <p className="sub">
          Gib deine Hand ein und erhalte Street für Street eine klare Empfehlung: setzen, callen oder aussteigen –
          zugeschnitten auf lockere Low-Stakes-Runden.
        </p>
      </div>

      {step === 'setup' && (
        <div className="card" style={{ maxWidth: 640 }}>
          <div className="stat-label" style={{ marginBottom: 8 }}>Wie viele Spieler sitzen am Tisch (mit dir)?</div>
          <div className="segmented" style={{ marginBottom: 20 }}>
            {[2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <button key={n} className={players === n ? 'on' : ''} onClick={() => setPlayers(n)}>
                {n}
              </button>
            ))}
          </div>

          <div className="stat-label" style={{ marginBottom: 8 }}>Wo sitzt du (relativ zum Dealer)?</div>
          <div className="segmented" style={{ marginBottom: 6 }}>
            {COACH_POSITIONS.map((p) => (
              <button key={p.id} className={position === p.id ? 'on' : ''} onClick={() => setPosition(p.id)}>
                {p.label}
              </button>
            ))}
          </div>
          <p className="small faint" style={{ marginBottom: 20 }}>
            {COACH_POSITIONS.find((p) => p.id === position)?.hint}
          </p>

          <div className="stat-label" style={{ marginBottom: 8 }}>Was ist vor dir passiert?</div>
          <div className="segmented" style={{ marginBottom: 14 }}>
            <button className={!raisedBefore ? 'on' : ''} onClick={() => setRaisedBefore(false)}>
              Noch kein Raise
            </button>
            <button className={raisedBefore ? 'on' : ''} onClick={() => setRaisedBefore(true)}>
              Jemand hat erhöht
            </button>
          </div>

          {!raisedBefore && (
            <>
              <div className="stat-label" style={{ marginBottom: 8 }}>Wie viele sind nur mitgegangen (Limper)?</div>
              <div className="segmented" style={{ marginBottom: 14 }}>
                {[0, 1, 2, 3, 4].map((n) => (
                  <button key={n} className={limpers === n ? 'on' : ''} onClick={() => setLimpers(n)}>
                    {n}
                  </button>
                ))}
              </div>
            </>
          )}

          <button
            className="btn primary lg block"
            onClick={() => {
              setOpponents(Math.min(2, players - 1));
              setStep('hand');
            }}
          >
            Weiter: Hand eingeben →
          </button>

          <p className="small faint" style={{ marginTop: 14 }}>
            Hinweis: Gedacht für private Runden und fürs Training. In Casinos und Cardrooms ist Handy-Hilfe am Tisch nicht
            erlaubt – dort bleibt die App in der Tasche.
          </p>
        </div>
      )}

      {step === 'hand' && (
        <div className="card" style={{ maxWidth: 640 }}>
          <CardPicker
            count={2}
            used={used}
            label="Deine beiden Karten"
            onComplete={(cards) => {
              setHole(cards);
              setStep('preflop');
            }}
          />
        </div>
      )}

      {step === 'flop-in' && (
        <div className="card" style={{ maxWidth: 640 }}>
          <div className="row" style={{ marginBottom: 14 }}>
            <span className="stat-label">Deine Hand:</span>
            <CardsRow cards={hole} size="sm" />
          </div>
          <CardPicker
            count={3}
            used={used}
            label="Flop – die ersten drei Boardkarten"
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
            <span className="stat-label">Hand:</span>
            <CardsRow cards={hole} size="sm" />
            <span className="stat-label">Board:</span>
            <CardsRow cards={board} size="sm" />
          </div>
          <CardPicker
            count={1}
            used={used}
            label={step === 'turn-in' ? 'Turn-Karte' : 'River-Karte'}
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
                {step === 'preflop' ? 'Preflop' : step === 'flop' ? 'Flop' : step === 'turn' ? 'Turn' : 'River'}
              </span>
            </div>

            <div className={`coach-verdict ${ACTION_STYLE[advice.action].cls}`}>
              <span style={{ fontSize: 26 }}>{ACTION_STYLE[advice.action].icon}</span>
              <div>
                <div className="v-action">{advice.headline}</div>
                <div className="small muted">Empfehlung: {ACTION_LABEL[advice.action]}</div>
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
                <span className="label">Homegame-Tipp</span>
                {advice.lowStakes}
              </div>
            )}
          </div>

          <div className="card" style={{ marginBottom: 14 }}>
            <div className="row between wrap">
              <div>
                <div className="stat-label">Gewinnchance (Simulation)</div>
                <div className="big-stat">{Math.round(equity * 100)} %</div>
                <div className="small faint">gegen {opponents} zufällige {opponents === 1 ? 'Hand' : 'Hände'}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="stat-label" style={{ marginBottom: 6 }}>Aktive Gegner</div>
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
                <span className="pill ok">Aktuell: {made.name}</span>
                {draws?.parts.map((p, i) => (
                  <span key={i} className="pill info">
                    {p.label}: {p.outs} Outs
                  </span>
                ))}
              </div>
            )}
            <p className="small faint" style={{ marginTop: 10 }}>
              Hinweis: Gegen echte Einsätze halten Gegner meist bessere Hände als der Zufall – zieh gedanklich ein
              paar Prozentpunkte ab, wenn viel Action herrscht.
            </p>
          </div>

          {step !== 'preflop' && (
            <div className="card" style={{ marginBottom: 14 }}>
              <div className="stat-label" style={{ marginBottom: 8 }}>Jemand setzt – lohnt sich der Call?</div>
              <div className="row wrap">
                <input
                  className="text-input"
                  style={{ maxWidth: 150 }}
                  inputMode="decimal"
                  placeholder="Pot (z. B. 10)"
                  value={potInput}
                  onChange={(e) => setPotInput(e.target.value)}
                />
                <input
                  className="text-input"
                  style={{ maxWidth: 150 }}
                  inputMode="decimal"
                  placeholder="Einsatz (z. B. 5)"
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
                Ich spiele trotzdem – Flop eingeben →
              </button>
            ) : (
              <button className="btn primary lg" onClick={() => setStep('flop-in')}>
                Weiter: Flop eingeben →
              </button>
            ))}
            {step === 'flop' && (
              <button className="btn primary lg" onClick={() => setStep('turn-in')}>
                Weiter: Turn →
              </button>
            )}
            {step === 'turn' && (
              <button className="btn primary lg" onClick={() => setStep('river-in')}>
                Weiter: River →
              </button>
            )}
            <button className="btn lg" onClick={() => resetHand(true)}>
              Neue Hand
            </button>
            <button className="btn lg ghost" onClick={() => resetHand(false)}>
              Setup ändern
            </button>
          </div>

          {stepIndex >= 0 && (
            <div className="row" style={{ marginTop: 6 }}>
              <div className="step-dots">
                {['Hand', 'Preflop', 'Flop', 'Turn', 'River'].map((s, i) => {
                  const active =
                    (i === 0 && stepIndex >= 0) ||
                    (i === 1 && stepIndex >= 1) ||
                    (i === 2 && stepIndex >= 3) ||
                    (i === 3 && stepIndex >= 5) ||
                    (i === 4 && stepIndex >= 7);
                  return <span key={s} className={`dot${active ? ' on' : ''}`} title={s} />;
                })}
              </div>
              <span className="small faint">Hand → Preflop → Flop → Turn → River</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
