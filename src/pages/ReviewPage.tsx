import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { findLesson, findModule } from '../content';
import type { QuizQuestion } from '../content/types';
import { Icon } from '../components/Icon';
import { useAppState, type ReviewItem } from '../state/AppState';

interface DueCard {
  item: ReviewItem;
  question: QuizQuestion;
  lessonTitle: string;
  moduleTitle: string;
}

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function ReviewPage() {
  const { data, answerReview } = useAppState();
  const [selected, setSelected] = useState<number | null>(null);
  const [sessionDone, setSessionDone] = useState(0);

  const today = todayStr();
  const dueCards = useMemo<DueCard[]>(() => {
    const cards: DueCard[] = [];
    for (const item of data.reviews) {
      if (item.due > today) continue;
      const found = findLesson(item.moduleId, item.lessonId);
      const q = found?.lesson.quiz[item.questionIndex];
      if (found && q) {
        cards.push({ item, question: q, lessonTitle: found.lesson.title, moduleTitle: found.module.title });
      }
    }
    return cards;
  }, [data.reviews, today]);

  const current = dueCards[0];
  const answered = selected !== null;

  function choose(i: number) {
    if (answered || !current) return;
    setSelected(i);
  }

  function next() {
    if (!current || selected === null) return;
    const correct = selected === current.question.correctIndex;
    answerReview(current.item.key, correct);
    setSelected(null);
    setSessionDone((s) => s + 1);
  }

  const nextDue = useMemo(() => {
    const future = data.reviews.filter((r) => r.due > today).sort((a, b) => a.due.localeCompare(b.due));
    return future[0]?.due ?? null;
  }, [data.reviews, today]);

  return (
    <div>
      <div className="page-header">
        <div className="eyebrow">Spaced Repetition</div>
        <h1>Wiederholen</h1>
        <p className="sub">
          Fragen, die du in Lektions-Quizzen falsch beantwortet hast, landen automatisch in diesem Stapel und kommen
          in wachsenden Abständen wieder – bis du sie dreimal in Folge richtig hast. So bleibt Wissen wirklich hängen.
        </p>
      </div>

      <div className="row wrap" style={{ marginBottom: 18 }}>
        <span className="pill gold">{dueCards.length} fällig</span>
        <span className="pill">{data.reviews.length} im Stapel</span>
        {sessionDone > 0 && <span className="pill ok">{sessionDone} heute bearbeitet</span>}
      </div>

      {!current && (
        <div className="card" style={{ maxWidth: 640, textAlign: 'center', padding: 36 }}>
          <div style={{ color: 'var(--gold-bright)', marginBottom: 10 }}>
            <Icon name="repeat" size={38} />
          </div>
          {data.reviews.length === 0 ? (
            <>
              <h2 style={{ fontSize: 20, marginBottom: 8 }}>Dein Stapel ist leer</h2>
              <p className="muted small" style={{ maxWidth: 420, margin: '0 auto 16px' }}>
                Beantworte Quizfragen im Lernpfad – jede falsche Antwort wandert automatisch hierher und wird zur
                Wiederholung fällig.
              </p>
              <Link to="/lernen" className="btn primary">
                Zum Lernpfad
              </Link>
            </>
          ) : (
            <>
              <h2 style={{ fontSize: 20, marginBottom: 8 }}>Alles erledigt!</h2>
              <p className="muted small">
                Für heute ist nichts mehr fällig.
                {nextDue && <> Die nächste Wiederholung wartet am <strong>{nextDue}</strong>.</>}
              </p>
            </>
          )}
        </div>
      )}

      {current && (
        <div style={{ maxWidth: 680 }}>
          <div className="card">
            <div className="row between wrap" style={{ marginBottom: 14 }}>
              <span className="small faint">
                {current.moduleTitle} · {current.lessonTitle}
              </span>
              <span className="pill">
                {current.item.streak}/3 richtig in Folge
              </span>
            </div>
            <h3 style={{ marginBottom: 16, fontSize: 17, lineHeight: 1.45 }}>{current.question.question}</h3>
            {current.question.options.map((opt, i) => {
              let cls = 'quiz-option';
              if (answered) {
                if (i === current.question.correctIndex) cls += ' correct';
                else if (i === selected) cls += ' wrong';
                else cls += ' dimmed';
              }
              return (
                <button key={i} className={cls} onClick={() => choose(i)} disabled={answered}>
                  <span className="pill" style={{ minWidth: 28, justifyContent: 'center', flexShrink: 0 }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              );
            })}
            {answered && (
              <>
                <div className={`feedback-box ${selected === current.question.correctIndex ? 'good' : 'bad'}`}>
                  <strong>
                    {selected === current.question.correctIndex ? 'Richtig! ' : 'Leider falsch. '}
                  </strong>
                  {current.question.explanation}
                </div>
                <button className="btn primary" style={{ marginTop: 14 }} onClick={next}>
                  {dueCards.length > 1 ? 'Nächste Karte' : 'Fertig'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
