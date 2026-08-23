import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../../state/AppState';

interface Problem {
  pot: number;
  bet: number;
  /** Benötigte Equity in Prozent (exakt). */
  required: number;
  options: number[];
  correctIndex: number;
}

const BET_FRACTIONS = [
  { f: 0.25, name: 'Viertel-Pot' },
  { f: 1 / 3, name: 'Drittel-Pot' },
  { f: 0.5, name: 'Halber Pot' },
  { f: 2 / 3, name: 'Zwei-Drittel-Pot' },
  { f: 0.75, name: 'Dreiviertel-Pot' },
  { f: 1, name: 'Pot-Bet' },
  { f: 1.5, name: 'Overbet (1,5x Pot)' },
];

function newProblem(): Problem {
  const pot = (4 + Math.floor(Math.random() * 25)) * 10; // 40–280
  const frac = BET_FRACTIONS[Math.floor(Math.random() * BET_FRACTIONS.length)];
  const bet = Math.max(5, Math.round(pot * frac.f / 5) * 5);
  const required = (100 * bet) / (pot + 2 * bet);

  const correct = Math.round(required * 10) / 10;
  const distractorOffsets = [
    [-12, -6, 7], [-8, 6, 12], [-10, 5, 11], [-7, -13, 8],
  ][Math.floor(Math.random() * 4)];
  const options = [correct, ...distractorOffsets.map((o) => Math.max(2, Math.round((correct + o) * 10) / 10))];
  // Duplikate vermeiden
  const unique = [...new Set(options)];
  while (unique.length < 4) unique.push(Math.round((correct + unique.length * 4 + 3) * 10) / 10);
  const shuffled = unique.slice(0, 4).sort(() => Math.random() - 0.5);
  return { pot, bet, required, options: shuffled, correctIndex: shuffled.indexOf(correct) };
}

export function PotOddsTrainer() {
  const { data, recordTrainer } = useAppState();
  const [problem, setProblem] = useState<Problem>(newProblem);
  const [selected, setSelected] = useState<number | null>(null);

  const stats = data.trainers['potodds'];
  const answered = selected !== null;
  const isCorrect = selected === problem.correctIndex;

  function choose(i: number) {
    if (answered) return;
    setSelected(i);
    recordTrainer('potodds', i === problem.correctIndex);
  }

  function next() {
    setProblem(newProblem());
    setSelected(null);
  }

  const { pot, bet } = problem;
  const totalAfterCall = pot + 2 * bet;

  return (
    <div>
      <Link to="/trainer" className="pill" style={{ display: 'inline-flex', marginBottom: 14 }}>
        ← Trainer
      </Link>
      <div className="page-header">
        <h1>Pot-Odds-Trainer</h1>
        <p className="sub">
          Wie viel Equity brauchst du mindestens, damit dein Call profitabel ist? Formel: Call ÷ (Pot + Bet + Call).
        </p>
      </div>

      <div className="row wrap" style={{ marginBottom: 16 }}>
        <span className="pill">✓ {stats?.correct ?? 0} richtig</span>
        <span className="pill">{stats?.attempts ?? 0} gesamt</span>
        <span className="pill gold">Serie: {stats?.streak ?? 0}</span>
      </div>

      <div className="card" style={{ maxWidth: 640 }}>
        <div className="grid cols-3" style={{ marginBottom: 18, textAlign: 'center' }}>
          <div>
            <div className="stat-label">Pot</div>
            <div className="big-stat">{pot}</div>
          </div>
          <div>
            <div className="stat-label">Gegner setzt</div>
            <div className="big-stat" style={{ color: 'var(--danger)' }}>{bet}</div>
          </div>
          <div>
            <div className="stat-label">Dein Call</div>
            <div className="big-stat" style={{ color: 'var(--gold-bright)' }}>{bet}</div>
          </div>
        </div>

        <p style={{ marginBottom: 14 }}>
          Wie viel <strong>Equity</strong> brauchst du mindestens für einen profitablen Call?
        </p>

        {problem.options.map((opt, i) => {
          let cls = 'quiz-option';
          if (answered) {
            if (i === problem.correctIndex) cls += ' correct';
            else if (i === selected) cls += ' wrong';
            else cls += ' dimmed';
          }
          return (
            <button key={i} className={cls} onClick={() => choose(i)} disabled={answered}>
              ca. {opt.toLocaleString('de-DE')} %
            </button>
          );
        })}

        {answered && (
          <>
            <div className={`feedback-box ${isCorrect ? 'good' : 'bad'}`}>
              <strong>{isCorrect ? '✓ Richtig! ' : '✗ Nicht ganz. '}</strong>
              Rechnung: Du callst {bet} und kannst {pot} + {bet} + {bet} = {totalAfterCall} gewinnen. Benötigte Equity
              = {bet} ÷ {totalAfterCall} = <strong>{problem.required.toFixed(1).replace('.', ',')} %</strong>.
              {' '}Merksatz: Halbe Pot-Bet → 25 %, Pot-Bet → 33 %.
            </div>
            <button className="btn primary" style={{ marginTop: 14 }} onClick={next}>
              Nächste Aufgabe →
            </button>
          </>
        )}
      </div>
    </div>
  );
}
