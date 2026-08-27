import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { QuizQuestion } from '../content/types';
import { QuizRunner } from '../components/QuizRunner';
import { Icon } from '../components/Icon';
import { useAppState } from '../state/AppState';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/dailyquiz';

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
  const { lang, content } = useLang();
  const L = STR[lang];
  const [started, setStarted] = useState(false);
  const today = todayStr();
  const alreadyDone = data.daily?.date === today;

  const questions = useMemo<DailyQuestion[]>(() => {
    const pool: Array<DailyQuestion & { moduleId: string; lessonId: string; qi: number }> = [];
    for (const m of content.modules) {
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
  }, [today, content.modules]);

  return (
    <div>
      <Link to="/lernen" className="pill" style={{ display: 'inline-flex', marginBottom: 14 }}>
        {L.back}
      </Link>
      <div className="page-header">
        <div className="eyebrow">{L.eyebrow}</div>
        <h1>{L.title}</h1>
        <p className="sub">
          {L.sub}
        </p>
      </div>

      {alreadyDone && !started && (
        <div className="card" style={{ maxWidth: 640, textAlign: 'center', padding: 36 }}>
          <div style={{ color: 'var(--auszeichnung-lesbar)', marginBottom: 10 }}>
            <Icon name="sun" size={38} />
          </div>
          <h2 style={{ fontSize: 20, marginBottom: 8 }}>{L.doneTitle}</h2>
          <p className="muted small">
            {L.resultPrefix} <strong>{data.daily?.score} / {data.daily?.total}</strong>{L.resultSuffix}
          </p>
        </div>
      )}

      {!alreadyDone && !started && (
        <div className="card" style={{ maxWidth: 640, textAlign: 'center', padding: 36 }}>
          <div style={{ color: 'var(--auszeichnung-lesbar)', marginBottom: 10 }}>
            <Icon name="sun" size={38} />
          </div>
          <h2 style={{ fontSize: 20, marginBottom: 8 }}>{L.readyTitle}</h2>
          <p className="muted small" style={{ marginBottom: 18 }}>
            {L.readyText(QUESTIONS_PER_DAY)}
          </p>
          <button className="btn primary lg" onClick={() => setStarted(true)}>
            {L.start}
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
