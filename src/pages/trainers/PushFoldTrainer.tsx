import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { HandMatrix } from '../../components/HandMatrix';
import { CardsRow } from '../../components/PlayingCard';
import { PUSH_CHARTS, PUSH_STACK_INFO, type PushStack } from '../../content/pushfold';
import { POSITION_NAMES } from '../../content/ranges';
import { combosForLabel, expandRangeSpec, handLabel, rangePercent } from '../../lib/poker/ranges';
import { useAppState } from '../../state/AppState';

const CHART_SETS = PUSH_CHARTS.map((c) => ({ ...c, set: expandRangeSpec(c.push) }));

interface Spot {
  chartIdx: number;
  cards: [number, number];
  label: string;
}

function newSpot(): Spot {
  const chartIdx = Math.floor(Math.random() * CHART_SETS.length);
  const c1 = Math.floor(Math.random() * 52);
  let c2 = Math.floor(Math.random() * 51);
  if (c2 >= c1) c2 += 1;
  const label = handLabel(c1, c2);
  const combo = combosForLabel(label).find(([a, b]) => (a === c1 && b === c2) || (a === c2 && b === c1));
  return { chartIdx, cards: combo ?? [c1, c2], label };
}

export function PushFoldTrainer() {
  const { data, recordTrainer } = useAppState();
  const [spot, setSpot] = useState<Spot>(newSpot);
  const [answer, setAnswer] = useState<string | null>(null);

  const chart = CHART_SETS[spot.chartIdx];
  const stats = data.trainers['pushfold'];
  const correct = chart.set.has(spot.label) ? 'push' : 'fold';
  const pct = useMemo(() => Math.round(rangePercent(chart.set) * 100), [chart]);

  function choose(a: 'push' | 'fold') {
    if (answer) return;
    setAnswer(a);
    recordTrainer('pushfold', a === correct);
  }

  function next() {
    setSpot(newSpot());
    setAnswer(null);
  }

  const isCorrect = answer === correct;

  return (
    <div>
      <Link to="/trainer" className="pill" style={{ display: 'inline-flex', marginBottom: 14 }}>
        ← Trainer
      </Link>
      <div className="page-header">
        <div className="eyebrow">Turnier-Endgame</div>
        <h1>Push/Fold-Trainer</h1>
        <p className="sub">
          Kurzer Stack im Turnier, alle folden zu dir: All-in oder Fold? Trainiere die vereinfachten Nash-Ranges für
          10bb und 5bb – ohne Antes.
        </p>
      </div>

      <div className="row wrap" style={{ marginBottom: 16 }}>
        <span className="pill">✓ {stats?.correct ?? 0} richtig</span>
        <span className="pill">{stats?.attempts ?? 0} gesamt</span>
        <span className="pill gold">Serie: {stats?.streak ?? 0}</span>
      </div>

      <div className="card" style={{ maxWidth: 720 }}>
        <p style={{ marginBottom: 14 }}>
          Turnier, <strong style={{ color: 'var(--gold-bright)' }}>{chart.stack === '10bb' ? '≈ 10 Big Blinds' : '≈ 5 Big Blinds'}</strong>{' '}
          übrig. Du sitzt <strong style={{ color: 'var(--gold-bright)' }}>{chart.position}</strong> (
          {POSITION_NAMES[chart.position]}). Alle vor dir folden.
        </p>

        <div className="row" style={{ marginBottom: 18 }}>
          <CardsRow cards={[spot.cards[0], spot.cards[1]]} size="lg" />
          <span className="pill" style={{ fontSize: 14 }}>{spot.label}</span>
        </div>

        <div className="row wrap">
          <button
            className={`btn lg${answer ? (correct === 'push' ? ' success' : answer === 'push' ? ' danger' : '') : ''}`}
            onClick={() => choose('push')}
            disabled={!!answer}
          >
            All-in
          </button>
          <button
            className={`btn lg${answer ? (correct === 'fold' ? ' success' : answer === 'fold' ? ' danger' : '') : ''}`}
            onClick={() => choose('fold')}
            disabled={!!answer}
          >
            Fold
          </button>
        </div>

        {answer && (
          <>
            <div className={`feedback-box ${isCorrect ? 'good' : 'bad'}`} style={{ marginTop: 16 }}>
              <strong>{isCorrect ? 'Richtig! ' : 'Nicht ganz. '}</strong>
              {spot.label} ist mit {chart.stack} aus {chart.position}{' '}
              {correct === 'push' ? 'ein Standard-Shove' : 'kein profitabler Shove'} (Shove-Range: ~{pct} % aller
              Hände). {PUSH_STACK_INFO[chart.stack]}
            </div>

            <div style={{ marginTop: 18 }}>
              <div className="range-legend" style={{ marginBottom: 10 }}>
                <span>
                  <span className="sw" style={{ background: 'linear-gradient(150deg,#d9b45b,#a37f2e)' }} />
                  All-in
                </span>
                <span>
                  <span className="sw" style={{ background: 'rgba(9,13,11,0.7)', border: '1px solid var(--border)' }} />
                  Fold
                </span>
              </div>
              <HandMatrix raise={chart.set} highlight={spot.label} />
            </div>

            <button className="btn primary" style={{ marginTop: 18 }} onClick={next}>
              Nächste Hand
            </button>
          </>
        )}
        <p className="small faint" style={{ marginTop: 16 }}>
          Vereinfachte Nash-Push-Ranges ohne Antes. Mit Antes wird noch breiter geschoben; gegen Spieler, die zu
          wenig callen, ebenfalls.
        </p>
      </div>
    </div>
  );
}
