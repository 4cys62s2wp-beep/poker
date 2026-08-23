import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ALL_MODULES } from '../content';
import type { QuizQuestion } from '../content/types';
import { QuizRunner } from '../components/QuizRunner';
import { Icon } from '../components/Icon';
import { useAppState } from '../state/AppState';

const QUESTIONS_PER_DAY = 5;

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Deterministischer RNG aus dem Datum – alle bekommen am selben Tag dieselben Fragen. */
function seededRng(seedStr: string): () => number {
  let s = 0;
  for (let i = 0; i < seedStr.length; i++) s = (s * 31 + seedStr.charCodeAt(i)) >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

interface DailyQuestion extends QuizQuestion {
  source: string;
}

export function DailyQuizPage() {
  const { data, completeDailyQuiz, addReviewItem } = useAppState();
  const [started, setStarted] = useState(false);
  const today = todayStr();
  const alreadyDone = data.daily?.date === today;

  const questions = useMemo<DailyQuestion[]>(() => {
    const pool: Array<DailyQuestion & { moduleId: string; lessonId: string; qi: number }> = [];
    for (const m of ALL_MODULES) {
      for (const l of m.lessons) {
        l.quiz.forEach((q, qi) => {
          pool.push({ ...q, source: `${m.title} · ${l.title}`, moduleId: m.id, lessonId: l.id, qi });
        });
      }
    }
    const rng = seededRng(today);
    // Fisher-Yates mit Datums-Seed, dann die ersten N
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, QUESTIONS_PER_DAY);
  }, [today]);

  return (
    <div>
      <Link to="/trainer" className="pill" style={{ display: 'inline-flex', marginBottom: 14 }}>
        ← Trainer
      </Link>
      <div className="page-header">
        <div className="eyebrow">Jeden Tag fünf Fragen</div>
        <h1>Tages-Quiz</h1>
        <p className="sub">
          Fünf zufällige Fragen quer durch alle Module – jeden Tag neu. Bonus: 30 XP plus 4 XP pro richtiger Antwort.
        </p>
      </div>

      {alreadyDone && !started && (
        <div className="card" style={{ maxWidth: 640, textAlign: 'center', padding: 36 }}>
          <div style={{ color: 'var(--gold-bright)', marginBottom: 10 }}>
            <Icon name="sun" size={38} />
          </div>
          <h2 style={{ fontSize: 20, marginBottom: 8 }}>Heute schon erledigt!</h2>
          <p className="muted small">
            Dein Ergebnis: <strong>{data.daily?.score} / {data.daily?.total}</strong>. Morgen warten fünf neue Fragen.
          </p>
        </div>
      )}

      {!alreadyDone && !started && (
        <div className="card" style={{ maxWidth: 640, textAlign: 'center', padding: 36 }}>
          <div style={{ color: 'var(--gold-bright)', marginBottom: 10 }}>
            <Icon name="sun" size={38} />
          </div>
          <h2 style={{ fontSize: 20, marginBottom: 8 }}>Bereit für heute?</h2>
          <p className="muted small" style={{ marginBottom: 18 }}>
            {QUESTIONS_PER_DAY} Fragen aus allen Themenbereichen. Falsche Antworten wandern in deinen
            Wiederholungsstapel.
          </p>
          <button className="btn primary lg" onClick={() => setStarted(true)}>
            Tages-Quiz starten
          </button>
        </div>
      )}

      {started && (
        <div style={{ maxWidth: 680 }}>
          <QuizRunner
            questions={questions}
            onFinish={(score, total) => completeDailyQuiz(score, total)}
            onWrong={(qi) => {
              const q = questions[qi] as DailyQuestion & { moduleId?: string; lessonId?: string; qi?: number };
              if (q.moduleId && q.lessonId !== undefined && q.qi !== undefined) {
                addReviewItem(q.moduleId, q.lessonId!, q.qi!);
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
