import { Link, useParams } from 'react-router-dom';
import { useAppState } from '../state/AppState';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/module';

export function ModulePage() {
  const { moduleId } = useParams();
  const { data } = useAppState();
  const { lang, content } = useLang();
  const L = STR[lang];
  const module = content.modules.find((m) => m.id === (moduleId ?? ''));

  if (!module) {
    return (
      <div className="card">
        {L.notFound} <Link to="/lernen" style={{ color: 'var(--gold-bright)' }}>{L.backToPath}</Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/lernen" className="pill" style={{ marginBottom: 16, display: 'inline-flex' }}>
        {L.back}
      </Link>
      <div className="page-header" style={{ marginTop: 10 }}>
        <h1>
          {module.icon} {module.title}
        </h1>
        <p className="sub">{module.subtitle}</p>
      </div>

      <div className="grid" style={{ maxWidth: 760 }}>
        {module.lessons.map((lesson, i) => {
          const result = data.completedLessons[lesson.id];
          return (
            <Link key={lesson.id} to={`/lernen/${module.id}/${lesson.id}`} className="card clickable">
              <div className="row between">
                <div className="row">
                  <span
                    className="pill"
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: '50%',
                      justifyContent: 'center',
                      fontSize: 14,
                      flexShrink: 0,
                      ...(result
                        ? { background: 'var(--ok-dim)', color: '#8fd49b', borderColor: 'rgba(88,179,104,0.4)' }
                        : {}),
                    }}
                  >
                    {result ? '✓' : i + 1}
                  </span>
                  <div>
                    <div style={{ fontWeight: 700 }}>{lesson.title}</div>
                    <div className="small faint">
                      {L.lessonMeta(lesson.duration, lesson.quiz.length)}
                      {result && L.quizResult(result.quizScore, result.quizTotal)}
                    </div>
                  </div>
                </div>
                <span className="faint">→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
