import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CardsRow } from '../../components/PlayingCard';
import { shuffledDeckWithout } from '../../lib/poker/cards';
import { equityVsHands } from '../../lib/poker/equity';
import { useAppState } from '../../state/AppState';
import { useLang } from '../../i18n';
import { STR } from '../../i18n/pages/equitytrainer';

const TOLERANCE = 7; // Prozentpunkte

interface Scenario {
  heroCards: number[];
  villainCards: number[];
  board: number[];
}

function newScenario(): Scenario {
  const deck = shuffledDeckWithout([]);
  const heroCards = [deck[0], deck[1]];
  const villainCards = [deck[2], deck[3]];
  // 50 % preflop, 35 % Flop, 15 % Turn
  const r = Math.random();
  const boardLen = r < 0.5 ? 0 : r < 0.85 ? 3 : 4;
  const board = deck.slice(4, 4 + boardLen);
  return { heroCards, villainCards, board };
}

export function EquityTrainer() {
  const { data, recordTrainer } = useAppState();
  const { lang } = useLang();
  const L = STR[lang];
  const [scenario, setScenario] = useState<Scenario>(newScenario);
  const [guess, setGuess] = useState(50);
  const [revealed, setRevealed] = useState(false);

  const stats = data.trainers['equity'];

  const equity = useMemo(() => {
    const eq = equityVsHands([scenario.heroCards, scenario.villainCards], scenario.board, 6000);
    return Math.round(eq[0] * 100);
  }, [scenario]);

  function reveal() {
    if (revealed) return;
    setRevealed(true);
    recordTrainer('equity', Math.abs(guess - equity) <= TOLERANCE);
  }

  function next() {
    setScenario(newScenario());
    setGuess(50);
    setRevealed(false);
  }

  const diff = Math.abs(guess - equity);
  const good = diff <= TOLERANCE;

  return (
    <div>
      <Link to="/lernen" className="pill" style={{ display: 'inline-flex', marginBottom: 14 }}>
        {L.back}
      </Link>
      <div className="page-header">
        <h1>{L.title}</h1>
        <p className="sub">{L.sub(TOLERANCE)}</p>
      </div>

      <div className="row wrap" style={{ marginBottom: 16 }}>
        <span className="pill">{L.correctCount(stats?.correct ?? 0)}</span>
        <span className="pill">{L.totalCount(stats?.attempts ?? 0)}</span>
        <span className="pill gold">{L.streak(stats?.streak ?? 0)}</span>
      </div>

      <div className="card" style={{ maxWidth: 640 }}>
        <div className="row between wrap" style={{ marginBottom: 16 }}>
          <div>
            <div className="stat-label" style={{ marginBottom: 6 }}>{L.yourHand}</div>
            <CardsRow cards={scenario.heroCards} size="lg" />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-faint)' }}>{L.vs}</div>
          <div>
            <div className="stat-label" style={{ marginBottom: 6 }}>{L.villain}</div>
            <CardsRow cards={scenario.villainCards} size="lg" />
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <div className="stat-label" style={{ marginBottom: 6 }}>
            {L.board} {scenario.board.length === 0 && L.preflopTag}
          </div>
          {scenario.board.length > 0 ? (
            <CardsRow cards={scenario.board} />
          ) : (
            <span className="muted small">{L.noBoard}</span>
          )}
        </div>

        <div className="stat-label">{L.guessLabel}</div>
        <div className="row" style={{ margin: '8px 0 4px' }}>
          <input
            type="range"
            min={0}
            max={100}
            value={guess}
            className="slider"
            onChange={(e) => setGuess(parseInt(e.target.value, 10))}
            disabled={revealed}
          />
          <span className="big-stat" style={{ minWidth: 86, textAlign: 'right' }}>{L.pct(guess)}</span>
        </div>

        {!revealed ? (
          <button className="btn primary" style={{ marginTop: 12 }} onClick={reveal}>
            {L.reveal}
          </button>
        ) : (
          <>
            <div className={`feedback-box ${good ? 'good' : 'bad'}`} style={{ marginTop: 12 }}>
              <strong>{good ? L.correctFb : L.wrongFb}</strong>
              {L.actualPrefix}<strong>{L.pct(equity)}</strong>
              {L.resultDetail(guess, diff, 100 - equity)}
            </div>
            <button className="btn primary" style={{ marginTop: 14 }} onClick={next}>
              {L.nextMatchup}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
