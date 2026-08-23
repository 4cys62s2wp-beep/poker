import { useState } from 'react';
import type { QuizQuestion } from '../content/types';

interface Props {
  questions: QuizQuestion[];
  /** Wird nach der letzten Frage aufgerufen. */
  onFinish: (score: number, total: number) => void;
  /** Optional: bei jeder Antwort aufgerufen (für Trainer-Statistiken). */
  onAnswer?: (correct: boolean) => void;
  /** Optional: bei falscher Antwort mit dem Fragen-Index aufgerufen (Spaced Repetition). */
  onWrong?: (questionIndex: number) => void;
}

export function QuizRunner({ questions, onFinish, onAnswer, onWrong }: Props) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[index];
  if (!q) return null;

  const answered = selected !== null;
  const isLast = index === questions.length - 1;

  function choose(i: number) {
    if (answered) return;
    setSelected(i);
    const correct = i === q.correctIndex;
    if (correct) setScore((s) => s + 1);
    else onWrong?.(index);
    onAnswer?.(correct);
  }

  function next() {
    if (isLast) {
      setFinished(true);
      onFinish(score, questions.length);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  }

  if (finished) {
    const pct = Math.round((100 * score) / questions.length);
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40 }}>{pct === 100 ? '🏆' : pct >= 60 ? '🎉' : '📚'}</div>
        <div className="big-stat">
          {score} / {questions.length}
        </div>
        <p className="muted" style={{ marginTop: 6 }}>
          {pct === 100
            ? 'Perfekt! Du hast alles verstanden.'
            : pct >= 60
              ? 'Gut gemacht! Schau dir die Erklärungen der falschen Antworten noch einmal an.'
              : 'Lies die Lektion am besten noch einmal – dann klappt es!'}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="row between" style={{ marginBottom: 12 }}>
        <span className="pill gold">
          Frage {index + 1} / {questions.length}
        </span>
        <span className="pill">✓ {score} richtig</span>
      </div>
      <div className="progressbar" style={{ marginBottom: 18 }}>
        <div style={{ width: `${(100 * index) / questions.length}%` }} />
      </div>
      <h3 style={{ marginBottom: 16, fontSize: 17, lineHeight: 1.45 }}>{q.question}</h3>
      {q.options.map((opt, i) => {
        let cls = 'quiz-option';
        if (answered) {
          if (i === q.correctIndex) cls += ' correct';
          else if (i === selected) cls += ' wrong';
          else cls += ' dimmed';
        }
        return (
          <button key={i} className={cls} onClick={() => choose(i)} disabled={answered}>
            <span
              className="pill"
              style={{ minWidth: 28, justifyContent: 'center', flexShrink: 0 }}
            >
              {String.fromCharCode(65 + i)}
            </span>
            {opt}
          </button>
        );
      })}
      {answered && (
        <>
          <div className={`feedback-box ${selected === q.correctIndex ? 'good' : 'bad'}`}>
            <strong>{selected === q.correctIndex ? '✓ Richtig! ' : '✗ Leider falsch. '}</strong>
            {q.explanation}
          </div>
          <div style={{ marginTop: 14 }}>
            <button className="btn primary" onClick={next}>
              {isLast ? 'Quiz abschließen' : 'Nächste Frage →'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
