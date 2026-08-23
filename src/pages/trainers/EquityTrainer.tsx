import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CardsRow } from '../../components/PlayingCard';
import { shuffledDeckWithout } from '../../lib/poker/cards';
import { equityVsHands } from '../../lib/poker/equity';
import { useAppState } from '../../state/AppState';

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
      <Link to="/trainer" className="pill" style={{ display: 'inline-flex', marginBottom: 14 }}>
        ← Trainer
      </Link>
      <div className="page-header">
        <h1>Equity-Schätzer</h1>
        <p className="sub">
          Schätze die Gewinnwahrscheinlichkeit deiner Hand (beide Hände offen). Innerhalb von ±{TOLERANCE}{' '}
          Prozentpunkten zählt als richtig.
        </p>
      </div>

      <div className="row wrap" style={{ marginBottom: 16 }}>
        <span className="pill">✓ {stats?.correct ?? 0} richtig</span>
        <span className="pill">{stats?.attempts ?? 0} gesamt</span>
        <span className="pill gold">Serie: {stats?.streak ?? 0}</span>
      </div>

      <div className="card" style={{ maxWidth: 640 }}>
        <div className="row between wrap" style={{ marginBottom: 16 }}>
          <div>
            <div className="stat-label" style={{ marginBottom: 6 }}>Deine Hand</div>
            <CardsRow cards={scenario.heroCards} size="lg" />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-faint)' }}>vs.</div>
          <div>
            <div className="stat-label" style={{ marginBottom: 6 }}>Gegner</div>
            <CardsRow cards={scenario.villainCards} size="lg" />
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <div className="stat-label" style={{ marginBottom: 6 }}>
            Board {scenario.board.length === 0 && '(Preflop)'}
          </div>
          {scenario.board.length > 0 ? (
            <CardsRow cards={scenario.board} />
          ) : (
            <span className="muted small">Noch keine Gemeinschaftskarten.</span>
          )}
        </div>

        <div className="stat-label">Deine Schätzung: Equity deiner Hand</div>
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
          <span className="big-stat" style={{ minWidth: 86, textAlign: 'right' }}>{guess} %</span>
        </div>

        {!revealed ? (
          <button className="btn primary" style={{ marginTop: 12 }} onClick={reveal}>
            Auflösen
          </button>
        ) : (
          <>
            <div className={`feedback-box ${good ? 'good' : 'bad'}`} style={{ marginTop: 12 }}>
              <strong>{good ? '✓ Stark geschätzt! ' : '✗ Daneben. '}</strong>
              Tatsächliche Equity: <strong>{equity} %</strong> (deine Schätzung: {guess} %, Abweichung {diff}{' '}
              Punkte). Gegner: {100 - equity} %.
            </div>
            <button className="btn primary" style={{ marginTop: 14 }} onClick={next}>
              Nächstes Matchup →
            </button>
          </>
        )}
      </div>
    </div>
  );
}
