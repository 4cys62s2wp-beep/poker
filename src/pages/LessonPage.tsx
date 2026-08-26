import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MarkdownLite } from '../components/MarkdownLite';
import { CardsRow } from '../components/PlayingCard';
import { QuizRunner } from '../components/QuizRunner';
import { useAppState } from '../state/AppState';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/lesson';
import { STR as PRO } from '../i18n/pages/pro';
import { ProLock } from '../components/pro/ProLock';
import { usePro } from '../lib/pro/ProProvider';
import { isFreeLesson } from '../lib/pro/plan';

export function LessonPage() {
  const { moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const { data, completeLesson, addReviewItem } = useAppState();
  const { lang, content } = useLang();
  const L = STR[lang];
  const P = PRO[lang];
  const { fullAccess } = usePro();
  /* Ohne Monetarisierung, mit Abo oder in der Testphase bleibt alles offen. */
  const unlocked = fullAccess;
  const foundModule = content.modules.find((m) => m.id === (moduleId ?? ''));
  const foundLesson = foundModule?.lessons.find((l) => l.id === (lessonId ?? ''));
  const found = foundModule && foundLesson ? { module: foundModule, lesson: foundLesson } : undefined;
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
        {L.notFound} <Link to="/lernen" style={{ color: 'var(--gold-bright)' }}>{L.backToPath}</Link>
      </div>
    );
  }

  const { module, lesson } = found;
  const lessonIndex = module.lessons.findIndex((l) => l.id === lesson.id);
  const nextLesson = module.lessons[lessonIndex + 1];
  const nextModule = (() => {
    const mIdx = parseInt(module.id.slice(1), 10);
    return content.modules.find((m) => m.id === `m${mIdx + 1}`);
  })();
  const alreadyDone = !!data.completedLessons[lesson.id];
  /* Modul 1–3 sind gratis; alles darüber nur mit Pro. */
  const locked = !unlocked && !isFreeLesson(module.id, lesson.id);

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
            {L.lessonOf(lessonIndex + 1, module.lessons.length)}
          </span>
          <span className="pill">{L.duration(lesson.duration)}</span>
          {alreadyDone && <span className="pill ok">{L.completedPill}</span>}
        </div>
        <h1>{lesson.title}</h1>
        <p className="sub">{lesson.intro}</p>
      </div>

      {locked && (
        <div style={{ maxWidth: 720 }}>
          <ProLock text={P.lockedModule} />
        </div>
      )}

      {!locked && !showQuiz && (
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
                    <span className="label">{L.example}</span>
                    <MarkdownLite text={sec.example} />
                  </div>
                )}
                {sec.tip && (
                  <div className="callout tip">
                    <span className="label">{L.coachTip}</span>
                    <MarkdownLite text={sec.tip} />
                  </div>
                )}
              </section>
            ))}

            <section className="lesson-section card" style={{ background: 'var(--bg-elev)' }}>
              <h2 style={{ fontSize: 17 }}>{L.takeaways}</h2>
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
            {L.startQuiz(lesson.quiz.length)}
          </button>
        </>
      )}

      {!locked && showQuiz && (
        <div style={{ maxWidth: 720 }}>
          {!quizDone && (
            <button className="btn ghost sm" style={{ marginBottom: 16 }} onClick={() => setShowQuiz(false)}>
              {L.backToLesson}
            </button>
          )}
          <QuizRunner
            questions={lesson.quiz}
            onFinish={onQuizFinish}
            onWrong={(qi) => addReviewItem(module.id, lesson.id, qi)}
          />
          {quizDone && (
            <div className="row wrap" style={{ marginTop: 18 }}>
              {nextLesson ? (
                <button
                  className="btn primary"
                  onClick={() => navigate(`/lernen/${module.id}/${nextLesson.id}`)}
                >
                  {L.nextLesson(nextLesson.title)}
                </button>
              ) : nextModule ? (
                <button className="btn primary" onClick={() => navigate(`/lernen/${nextModule.id}`)}>
                  {L.nextModule(nextModule.title)}
                </button>
              ) : (
                <button className="btn primary" onClick={() => navigate('/lernen')}>
                  {L.backToPath}
                </button>
              )}
              <button className="btn" onClick={() => navigate(`/lernen/${module.id}`)}>
                {L.moduleOverview}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
