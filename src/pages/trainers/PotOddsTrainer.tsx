import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../../state/AppState';
import { Entscheidung } from '../../components/Entscheidung';
import { Uebungsstand } from '../../components/Uebungsstand';
import { useLang } from '../../i18n';
import { STR } from '../../i18n/pages/potoddstrainer';

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
  const { lang } = useLang();
  const L = STR[lang];
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
      <Link to="/lernen" className="pill" style={{ display: 'inline-flex', marginBottom: 14 }}>
        {L.back}
      </Link>
      <div className="page-header">
        <h1>{L.title}</h1>
        <p className="sub">{L.sub}</p>
      </div>

      <Uebungsstand werte={stats} />

      <div className="card" style={{ maxWidth: 640 }}>
        <div className="grid cols-3" style={{ marginBottom: 18, textAlign: 'center' }}>
          <div>
            <div className="stat-label">{L.potLabel}</div>
            <div className="big-stat">{pot}</div>
          </div>
          <div>
            <div className="stat-label">{L.betLabel}</div>
            <div className="big-stat" style={{ color: 'var(--danger-lesbar)' }}>{bet}</div>
          </div>
          <div>
            <div className="stat-label">{L.callLabel}</div>
            <div className="big-stat" style={{ color: 'var(--auszeichnung-lesbar)' }}>{bet}</div>
          </div>
        </div>

        <p style={{ marginBottom: 14 }}>
          {L.questionBefore}
          <strong>{L.questionStrong}</strong>
          {L.questionAfter}
        </p>

        {/* Nach der Antwort stehen die Möglichkeiten hier als Übersicht:
            Sie sind dann keine Knöpfe mehr, sondern das Ergebnis. Vorher
            stehen sie unten in der Entscheidungsleiste (E-039). */}
        {answered && (
          <div className="wahlbilanz">
            {problem.options.map((opt, i) => (
              <div
                key={i}
                className={`wahl${i === problem.correctIndex ? ' richtig'
                  : i === selected ? ' falsch' : ' blass'}`}
              >
                {L.option(opt)}
              </div>
            ))}
          </div>
        )}

        {answered && (
          <>
            <div className={`feedback-box ${isCorrect ? 'good' : 'bad'}`}>
              <strong>{isCorrect ? L.correctFb : L.wrongFb}</strong>
              {L.calc(bet, pot, totalAfterCall)}<strong>{L.requiredPct(problem.required)}</strong>.
              {' '}{L.mnemonic}
            </div>
          </>
        )}
      </div>

      <Entscheidung label={L.title} viele={!answered}>
        {!answered ? (
          problem.options.map((opt, i) => (
            <button key={i} className="quiz-option" onClick={() => choose(i)}>
              {L.option(opt)}
            </button>
          ))
        ) : (
          <button className="btn primary" onClick={next}>{L.nextProblem}</button>
        )}
      </Entscheidung>
    </div>
  );
}
