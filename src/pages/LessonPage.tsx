import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { findLesson, findModule } from '../content';
import { MarkdownLite } from '../components/MarkdownLite';
import { CardsRow } from '../components/PlayingCard';
import { QuizRunner } from '../components/QuizRunner';
import { useAppState } from '../state/AppState';

export function LessonPage() {
  const { moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const { data, completeLesson } = useAppState();
  const found = findLesson(moduleId ?? '', lessonId ?? '');
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizDone, setQuizDone] = useState(false);

  useEffect(() => {
    setShowQuiz(false);
    setQuizDone(false);
    window.scrollTo(0, 0);
  }, [moduleId, lessonId]);

  if (!found) {
    return (
      <div className="card">
        Lektion nicht gefunden. <Link to="/lernen" style={{ color: 'var(--gold-bright)' }}>Zurück zum Lernpfad</Link>
      </div>
    );
  }

  const { module, lesson } = found;
  const lessonIndex = module.lessons.findIndex((l) => l.id === lesson.id);
  const nextLesson = module.lessons[lessonIndex + 1];
  const nextModule = (() => {
    const mIdx = parseInt(module.id.slice(1), 10);
    return findModule(`m${mIdx + 1}`);
  })();
  const alreadyDone = !!data.completedLessons[lesson.id];

  function onQuizFinish(score: number, total: number) {
    completeLesson(lesson.id, score, total);
    setQuizDone(true);
  }

  return (
    <div>
      <Link to={`/lernen/${module.id}`} className="pill" style={{ display: 'inline-flex' }}>
        ← {module.title}
      </Link>

      <div className="page-header" style={{ marginTop: 14 }}>
        <div className="row wrap" style={{ marginBottom: 8 }}>
          <span className="pill gold">
            Lektion {lessonIndex + 1} / {module.lessons.length}
          </span>
          <span className="pill">⏱ ca. {lesson.duration} Min.</span>
          {alreadyDone && <span className="pill ok">✓ abgeschlossen</span>}
        </div>
        <h1>{lesson.title}</h1>
        <p className="sub">{lesson.intro}</p>
      </div>

      {!showQuiz && (
        <>
          <div className="prose">
            {lesson.sections.map((sec, i) => (
              <section key={i} className="lesson-section">
                <h2>{sec.heading}</h2>
                {sec.cards && sec.cards.length > 0 && (
                  <div style={{ margin: '4px 0 14px' }}>
                    <CardsRow cards={sec.cards} />
                  </div>
                )}
                <MarkdownLite text={sec.body} />
                {sec.table && (
                  <div className="table-wrap">
                    <table className="data">
                      <thead>
                        <tr>
                          {sec.table.headers.map((h, hi) => (
                            <th key={hi}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sec.table.rows.map((row, ri) => (
                          <tr key={ri}>
                            {row.map((cell, ci) => (
                              <td key={ci}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {sec.example && (
                  <div className="callout example">
                    <span className="label">Beispiel</span>
                    <MarkdownLite text={sec.example} />
                  </div>
                )}
                {sec.tip && (
                  <div className="callout tip">
                    <span className="label">💡 Coach-Tipp</span>
                    <MarkdownLite text={sec.tip} />
                  </div>
                )}
              </section>
            ))}

            <section className="lesson-section card" style={{ background: 'var(--bg-elev)' }}>
              <h2 style={{ fontSize: 17 }}>🎯 Das nimmst du mit</h2>
              <ul className="list-plain">
                {lesson.takeaways.map((t, i) => (
                  <li key={i} className="takeaway">
                    <span className="tick">✓</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <button className="btn primary lg" onClick={() => { setShowQuiz(true); window.scrollTo(0, 0); }}>
            Quiz starten ({lesson.quiz.length} Fragen) →
          </button>
        </>
      )}

      {showQuiz && (
        <div style={{ maxWidth: 720 }}>
          {!quizDone && (
            <button className="btn ghost sm" style={{ marginBottom: 16 }} onClick={() => setShowQuiz(false)}>
              ← Zurück zur Lektion
            </button>
          )}
          <QuizRunner questions={lesson.quiz} onFinish={onQuizFinish} />
          {quizDone && (
            <div className="row wrap" style={{ marginTop: 18 }}>
              {nextLesson ? (
                <button
                  className="btn primary"
                  onClick={() => navigate(`/lernen/${module.id}/${nextLesson.id}`)}
                >
                  Nächste Lektion: {nextLesson.title} →
                </button>
              ) : nextModule ? (
                <button className="btn primary" onClick={() => navigate(`/lernen/${nextModule.id}`)}>
                  Weiter zu Modul: {nextModule.title} →
                </button>
              ) : (
                <button className="btn primary" onClick={() => navigate('/lernen')}>
                  Zurück zum Lernpfad
                </button>
              )}
              <button className="btn" onClick={() => navigate(`/lernen/${module.id}`)}>
                Modulübersicht
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
