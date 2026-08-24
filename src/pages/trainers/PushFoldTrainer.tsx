import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { HandMatrix } from '../../components/HandMatrix';
import { CardsRow } from '../../components/PlayingCard';
import { POSITION_NAMES } from '../../content/ranges';
import { combosForLabel, expandRangeSpec, handLabel, rangePercent } from '../../lib/poker/ranges';
import { useAppState } from '../../state/AppState';
import { useLang } from '../../i18n';
import { STR } from '../../i18n/pages/pushfoldtrainer';

interface Spot {
  chartIdx: number;
  cards: [number, number];
  label: string;
}

function newSpot(chartCount: number): Spot {
  const chartIdx = Math.floor(Math.random() * chartCount);
  const c1 = Math.floor(Math.random() * 52);
  let c2 = Math.floor(Math.random() * 51);
  if (c2 >= c1) c2 += 1;
  const label = handLabel(c1, c2);
  const combo = combosForLabel(label).find(([a, b]) => (a === c1 && b === c2) || (a === c2 && b === c1));
  return { chartIdx, cards: combo ?? [c1, c2], label };
}

export function PushFoldTrainer() {
  const { data, recordTrainer } = useAppState();
  const { lang, content } = useLang();
  const L = STR[lang];
  const chartSets = useMemo(
    () => content.pushCharts.map((c) => ({ ...c, set: expandRangeSpec(c.push) })),
    [content],
  );
  const [spot, setSpot] = useState<Spot>(() => newSpot(chartSets.length));
  const [answer, setAnswer] = useState<string | null>(null);

  const chart = chartSets[spot.chartIdx];
  const stats = data.trainers['pushfold'];
  const correct = chart.set.has(spot.label) ? 'push' : 'fold';
  const pct = useMemo(() => Math.round(rangePercent(chart.set) * 100), [chart]);

  function choose(a: 'push' | 'fold') {
    if (answer) return;
    setAnswer(a);
    recordTrainer('pushfold', a === correct);
  }

  function next() {
    setSpot(newSpot(chartSets.length));
    setAnswer(null);
  }

  const isCorrect = answer === correct;

  return (
    <div>
      <Link to="/trainer" className="pill" style={{ display: 'inline-flex', marginBottom: 14 }}>
        {L.back}
      </Link>
      <div className="page-header">
        <div className="eyebrow">{L.eyebrow}</div>
        <h1>{L.title}</h1>
        <p className="sub">{L.sub}</p>
      </div>

      <div className="row wrap" style={{ marginBottom: 16 }}>
        <span className="pill">{L.correctCount(stats?.correct ?? 0)}</span>
        <span className="pill">{L.totalCount(stats?.attempts ?? 0)}</span>
        <span className="pill gold">{L.streak(stats?.streak ?? 0)}</span>
      </div>

      <div className="card" style={{ maxWidth: 720 }}>
        <p style={{ marginBottom: 14 }}>
          {L.introBefore}
          <strong style={{ color: 'var(--gold-bright)' }}>{L.stackApprox(chart.stack)}</strong>
          {L.introAfterStack}
          <strong style={{ color: 'var(--gold-bright)' }}>{chart.position}</strong> ({POSITION_NAMES[chart.position]})
          {L.introAfterPosition}
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
            {L.allInBtn}
          </button>
          <button
            className={`btn lg${answer ? (correct === 'fold' ? ' success' : answer === 'fold' ? ' danger' : '') : ''}`}
            onClick={() => choose('fold')}
            disabled={!!answer}
          >
            {L.foldBtn}
          </button>
        </div>

        {answer && (
          <>
            <div className={`feedback-box ${isCorrect ? 'good' : 'bad'}`} style={{ marginTop: 16 }}>
              <strong>{isCorrect ? L.correctFb : L.wrongFb}</strong>
              {L.verdict(spot.label, chart.stack, chart.position, correct === 'push', pct)}{' '}
              {content.pushStackInfo[chart.stack]}
            </div>

            <div style={{ marginTop: 18 }}>
              <div className="range-legend" style={{ marginBottom: 10 }}>
                <span>
                  <span className="sw" style={{ background: 'linear-gradient(150deg,#d9b45b,#a37f2e)' }} />
                  {L.legendAllIn}
                </span>
                <span>
                  <span className="sw" style={{ background: 'rgba(9,13,11,0.7)', border: '1px solid var(--border)' }} />
                  {L.legendFold}
                </span>
              </div>
              <HandMatrix raise={chart.set} highlight={spot.label} />
            </div>

            <button className="btn primary" style={{ marginTop: 18 }} onClick={next}>
              {L.nextHand}
            </button>
          </>
        )}
        <p className="small faint" style={{ marginTop: 16 }}>
          {L.footnote}
        </p>
      </div>
    </div>
  );
}
