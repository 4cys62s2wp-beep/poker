import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { HandMatrix } from '../../components/HandMatrix';
import { CardsRow } from '../../components/PlayingCard';
import { BB_DEFENSE_VS_BTN, POSITION_NAMES, RFI_CHARTS } from '../../content/ranges';
import { combosForLabel, expandRangeSpec, handLabel } from '../../lib/poker/ranges';
import { useAppState } from '../../state/AppState';
import { useLang } from '../../i18n';
import { STR } from '../../i18n/pages/prefloptrainer';

type Scenario =
  | { kind: 'rfi'; position: (typeof RFI_CHARTS)[number]['position']; cards: [number, number]; label: string }
  | { kind: 'bbdef'; cards: [number, number]; label: string };

const RFI_SETS = new Map(RFI_CHARTS.map((c) => [c.position, expandRangeSpec(c.raise)]));
const BB_3BET = expandRangeSpec(BB_DEFENSE_VS_BTN.threeBet);
const BB_CALL_RAW = expandRangeSpec(BB_DEFENSE_VS_BTN.call);
// 3-Bet hat Vorrang vor Call
const BB_CALL = new Set([...BB_CALL_RAW].filter((l) => !BB_3BET.has(l)));

function randomLabelAndCombo(): { label: string; cards: [number, number] } {
  // Zufällige echte Starthand (über Combos gleichverteilt)
  const c1 = Math.floor(Math.random() * 52);
  let c2 = Math.floor(Math.random() * 51);
  if (c2 >= c1) c2 += 1;
  const label = handLabel(c1, c2);
  // Hübsche Reihenfolge: höhere Karte zuerst
  const combo = combosForLabel(label);
  const found = combo.find(([a, b]) => (a === c1 && b === c2) || (a === c2 && b === c1));
  return { label, cards: found ?? [c1, c2] };
}

function newScenario(): Scenario {
  if (Math.random() < 0.72) {
    const chart = RFI_CHARTS[Math.floor(Math.random() * RFI_CHARTS.length)];
    const { label, cards } = randomLabelAndCombo();
    return { kind: 'rfi', position: chart.position, cards, label };
  }
  const { label, cards } = randomLabelAndCombo();
  return { kind: 'bbdef', cards, label };
}

export function PreflopTrainer() {
  const { data, recordTrainer } = useAppState();
  const { lang } = useLang();
  const L = STR[lang];
  const [scenario, setScenario] = useState<Scenario>(newScenario);
  const [answer, setAnswer] = useState<string | null>(null);

  const stats = data.trainers['preflop'];

  const correctAnswer = useMemo(() => {
    if (scenario.kind === 'rfi') {
      return RFI_SETS.get(scenario.position)!.has(scenario.label) ? 'raise' : 'fold';
    }
    if (BB_3BET.has(scenario.label)) return '3bet';
    if (BB_CALL.has(scenario.label)) return 'call';
    return 'fold';
  }, [scenario]);

  function choose(a: string) {
    if (answer) return;
    setAnswer(a);
    recordTrainer('preflop', a === correctAnswer);
  }

  function next() {
    setScenario(newScenario());
    setAnswer(null);
  }

  const isCorrect = answer === correctAnswer;

  return (
    <div>
      <Link to="/lernen" className="pill" style={{ display: 'inline-flex', marginBottom: 14 }}>
        {L.back}
      </Link>
      <div className="page-header">
        <h1>{L.title}</h1>
        <p className="sub">{L.sub}</p>
      </div>

      <div className="row wrap" style={{ marginBottom: 16 }}>
        <span className="pill">{L.correctCount(stats?.correct ?? 0)}</span>
        <span className="pill">{L.totalCount(stats?.attempts ?? 0)}</span>
        <span className="pill gold">{L.streak(stats?.streak ?? 0)}</span>
      </div>

      <div className="card" style={{ maxWidth: 720 }}>
        {scenario.kind === 'rfi' ? (
          <p style={{ marginBottom: 14 }}>
            {L.rfiIntroBefore}
            <strong style={{ color: 'var(--auszeichnung-lesbar)' }}>{scenario.position}</strong> (
            {POSITION_NAMES[scenario.position]}){L.rfiIntroAfter}
          </p>
        ) : (
          <p style={{ marginBottom: 14 }}>
            {L.bbIntroBefore}
            <strong style={{ color: 'var(--auszeichnung-lesbar)' }}>{L.bbIntroStrong}</strong>
            {L.bbIntroAfter}
          </p>
        )}

        <div className="row" style={{ marginBottom: 18 }}>
          <CardsRow cards={[scenario.cards[0], scenario.cards[1]]} size="lg" />
          <span className="pill" style={{ fontSize: 14 }}>{scenario.label}</span>
        </div>

        <div className="row wrap">
          {scenario.kind === 'rfi' ? (
            <>
              <ActionBtn label="Raise" value="raise" answer={answer} correct={correctAnswer} onClick={choose} />
              <ActionBtn label="Fold" value="fold" answer={answer} correct={correctAnswer} onClick={choose} />
            </>
          ) : (
            <>
              <ActionBtn label="3-Bet" value="3bet" answer={answer} correct={correctAnswer} onClick={choose} />
              <ActionBtn label="Call" value="call" answer={answer} correct={correctAnswer} onClick={choose} />
              <ActionBtn label="Fold" value="fold" answer={answer} correct={correctAnswer} onClick={choose} />
            </>
          )}
        </div>

        {answer && (
          <>
            <div className={`feedback-box ${isCorrect ? 'good' : 'bad'}`} style={{ marginTop: 16 }}>
              <strong>{isCorrect ? L.correctFb : L.wrongFb}</strong>
              {scenario.kind === 'rfi' ? (
                <>
                  {L.rfiVerdict(scenario.label, correctAnswer === 'raise', scenario.position)} {L.rfiDesc[scenario.position]}
                </>
              ) : (
                <>
                  {L.bbVerdict(scenario.label, correctAnswer)} {L.bbDefenseDesc}
                </>
              )}
            </div>

            <div style={{ marginTop: 18 }}>
              <div className="range-legend" style={{ marginBottom: 10 }}>
                <span>
                  <span className="sw" style={{ background: 'linear-gradient(150deg,#c9a44a,#a37f2e)' }} />
                  {scenario.kind === 'rfi' ? 'Raise' : '3-Bet'}
                </span>
                {scenario.kind === 'bbdef' && (
                  <span>
                    <span className="sw" style={{ background: 'linear-gradient(150deg,#3f9a5c,#2e7a46)' }} />
                    Call
                  </span>
                )}
                <span>
                  <span className="sw" style={{ background: 'var(--bg-elev)', border: '1px solid var(--border)' }} />
                  Fold
                </span>
              </div>
              <HandMatrix
                raise={scenario.kind === 'rfi' ? RFI_SETS.get(scenario.position) : BB_3BET}
                call={scenario.kind === 'bbdef' ? BB_CALL : undefined}
                highlight={scenario.label}
              />
            </div>

            <button className="btn primary" style={{ marginTop: 18 }} onClick={next}>
              {L.nextHand}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function ActionBtn({
  label,
  value,
  answer,
  correct,
  onClick,
}: {
  label: string;
  value: string;
  answer: string | null;
  correct: string;
  onClick: (v: string) => void;
}) {
  let cls = 'btn lg';
  if (answer) {
    if (value === correct) cls += ' success';
    else if (value === answer) cls += ' danger';
  }
  return (
    <button className={cls} onClick={() => onClick(value)} disabled={!!answer}>
      {label}
    </button>
  );
}
