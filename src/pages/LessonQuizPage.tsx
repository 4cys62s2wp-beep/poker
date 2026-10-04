/* Das Quiz einer Lektion — eine eigene Adresse, im Fokusmodus.

   Ergebnis ist ein Bildschirm mit drei Kacheln (XP, Stand im Modul, neues
   Abzeichen) und der Liste dessen, was falsch war: mit der richtigen Antwort,
   einer aufklappbaren Erklärung und dem Hinweis, dass die Frage in die
   Wiederholung kommt. Bestanden ist, wer die Grenze erreicht (E-091). */

import { useMemo, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import type { QuizQuestion } from '../content/types';
import { QuizRunner, type QuizErgebnis, type QuizZustand } from '../components/QuizRunner';
import { Icon } from '../components/Icon';
import { useAppState } from '../state/AppState';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/quiz';
import { STR as LESSON } from '../i18n/pages/lesson';
import { usePro } from '../lib/pro/ProProvider';
import { isFreeLesson } from '../lib/pro/plan';
import { bestanden, grenze } from '../lib/lernen/quiz';
import { ladeQuizZustand, speichereQuizZustand } from '../lib/lernen/zwischenstand';
import { lektionsstand } from '../lib/rang/lektionen';
import { uebungFuer, ZIEL_PFAD } from '../lib/lernen/uebung';
import { ortName } from '../lib/orte';

/** Je Lektion eine eigene Instanz: Wechselt nur die Adresse von einem Quiz zum
 *  nächsten, dürfen Ergebnis, Zwischenstand und Durchgangszähler der vorigen
 *  Lektion nicht stehenbleiben. */
export function LessonQuizPage() {
  const { lessonId } = useParams();
  return <LessonQuizInhalt key={lessonId} />;
}

function LessonQuizInhalt() {
  const { moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const { data, completeLesson, addReviewItem } = useAppState();
  const { lang, content } = useLang();
  const L = STR[lang];
  const LS = LESSON[lang];
  const { fullAccess } = usePro();

  const module = content.modules.find((m) => m.id === moduleId);
  const lesson = module?.lessons.find((l) => l.id === lessonId);

  /* Stand vor diesem Durchgang: Die Kacheln im Ergebnis zeigen, was **dieser**
     Durchgang gebracht hat. Gemerkt wird er im Moment des Abschlusses. */
  const vorher = useRef({ xp: data.xp, abzeichen: new Set(Object.keys(data.badges)) });
  const [durchgang, setDurchgang] = useState(0);
  const [uebung, setUebung] = useState<QuizQuestion[] | null>(null);
  /* Nur beim ersten Durchgang an den Zwischenstand anknüpfen; ein Neustart
     beginnt von vorn. */
  const [fortsetzen] = useState<QuizZustand | null>(
    () => (lesson ? ladeQuizZustand(lesson.id, lesson.quiz.length) : null),
  );

  const ziel = lesson ? uebungFuer(lesson.id) : null;
  const nachLektion = useMemo(() => {
    if (!module || !lesson) return null;
    const i = module.lessons.findIndex((l) => l.id === lesson.id);
    return module.lessons[i + 1] ?? null;
  }, [module, lesson]);

  if (!module || !lesson) return <Navigate to="/lernen" replace />;
  const gesperrt = !fullAccess && !isFreeLesson(module.id, lesson.id);
  if (gesperrt) return <Navigate to={`/lernen/${module.id}/${lesson.id}`} replace />;

  const zurLektion = `/lernen/${module.id}/${lesson.id}`;
  const nextModule = content.modules.find((m) => m.id === `m${parseInt(module.id.slice(1), 10) + 1}`);

  function ergebnis(e: QuizErgebnis) {
    const geschafft = bestanden(e.score, e.total);
    const stand = lektionsstand(module!.lessons, data.completedLessons);
    const xpDazu = Math.max(0, data.xp - vorher.current.xp);
    const neu = Object.keys(data.badges).filter((id) => !vorher.current.abzeichen.has(id));
    const abzeichen = neu.map((id) => content.badges.find((b) => b.id === id)).filter(Boolean);

    return (
      <div className="quiz-ergebnis">
        <div className="ergebnis-kopf" role="status" aria-live="polite">
          <span className={`urteil ${geschafft ? 'gut' : 'offen'}`}>
            <Icon name={geschafft ? 'check' : 'x'} size={20} />
            {geschafft ? L.passed : L.failed}
          </span>
          <div className="big-stat">{L.scoreOf(e.score, e.total)}</div>
        </div>

        <div className="ergebnis-kacheln">
          {geschafft ? (
            <>
              <div className="ergebnis-kachel">
                <strong>+{xpDazu}</strong>
                <span>{L.tileXp}</span>
              </div>
              <div className="ergebnis-kachel">
                <strong>{stand.erledigt}/{stand.gesamt}</strong>
                <span>{L.tileModule}</span>
              </div>
              {abzeichen.map((b) => (
                <div key={b!.id} className="ergebnis-kachel abzeichen">
                  <strong aria-hidden="true">{b!.icon}</strong>
                  <span>{L.tileBadge}: {b!.title}</span>
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="ergebnis-kachel">
                <strong>{e.score}/{e.total}</strong>
                <span>{L.tileScore}</span>
              </div>
              <div className="ergebnis-kachel">
                <strong>{grenze(e.total)}/{e.total}</strong>
                <span>{L.tileNeeded}</span>
              </div>
            </>
          )}
        </div>

        {e.falsch.length > 0 && (
          <section className="ergebnis-falsch" aria-label={L.wrongTitle}>
            <h2>{L.wrongTitle}</h2>
            <ul>
              {e.falsch.map((f) => (
                <li key={f.index}>
                  <p className="frage">{f.frage.question}</p>
                  <p className="antwort falsch">
                    <Icon name="x" size={16} />
                    <span><span className="sr-only">{L.yourAnswer}: </span>{f.frage.options[f.gewaehlt]}</span>
                  </p>
                  <p className="antwort richtig">
                    <Icon name="check" size={16} />
                    <span><span className="sr-only">{L.rightAnswer}: </span>{f.frage.options[f.frage.correctIndex]}</span>
                  </p>
                  <details>
                    <summary>{LS.explain}</summary>
                    {f.frage.optionFeedback?.[f.gewaehlt] && <p>{f.frage.optionFeedback[f.gewaehlt]}</p>}
                    <p>{f.frage.explanation}</p>
                  </details>
                  <p className="small faint">{L.inReview}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="entscheidung-leiste entscheidung">
          <div className="entscheidung-innen stapel">
            {geschafft ? (
              <>
                {nachLektion ? (
                  <Link className="btn primary" to={`/lernen/${module!.id}/${nachLektion.id}`}>
                    {LS.nextLesson(nachLektion.title)}
                  </Link>
                ) : nextModule ? (
                  <Link className="btn primary" to={`/lernen/${nextModule.id}`}>
                    {LS.nextModule(nextModule.title)}
                  </Link>
                ) : (
                  <Link className="btn primary" to="/lernen">{LS.backToPath}</Link>
                )}
                {ziel && (
                  <Link className="btn" to={ZIEL_PFAD[ziel]}>
                    {L.practiceNow(ortName(ZIEL_PFAD[ziel], lang))}
                  </Link>
                )}
                <Link className="btn" to={`/lernen/${module!.id}`}>{LS.moduleOverview}</Link>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="btn primary"
                  onClick={() => setUebung(e.falsch.map((f) => f.frage))}
                >
                  {L.practice}
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => { setUebung(null); setDurchgang((d) => d + 1); }}
                >
                  {L.retryAll}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* Üben: nur die falschen Fragen, ohne Folgen für die Lektion. */
  if (uebung) {
    return (
      <QuizRunner
        key={`uebung-${durchgang}`}
        titel={L.practiceTitle}
        questions={uebung}
        onFinish={() => {}}
        onSchliessen={() => navigate(zurLektion)}
        ergebnis={(e) => (
          <div className="quiz-ergebnis">
            <div className="ergebnis-kopf" role="status" aria-live="polite">
              <h2 className="ergebnis-titel">{L.practiceTitle}</h2>
              <div className="big-stat">{L.practiceDone(e.score, e.total)}</div>
              <p className="muted small">{L.practiceHint}</p>
            </div>
            <div className="entscheidung-leiste entscheidung">
              <div className="entscheidung-innen stapel">
                <button
                  type="button"
                  className="btn primary"
                  onClick={() => { setUebung(null); setDurchgang((d) => d + 1); }}
                >
                  {L.retryAll}
                </button>
                <Link className="btn" to={zurLektion}>{LS.backToLessonShort}</Link>
              </div>
            </div>
          </div>
        )}
      />
    );
  }

  return (
    <QuizRunner
      key={durchgang}
      titel={LS.quizOf(lesson.title)}
      questions={lesson.quiz}
      fortsetzen={durchgang === 0 ? fortsetzen : null}
      onZustand={(z) => speichereQuizZustand(lesson.id, z)}
      onSchliessen={() => navigate(zurLektion)}
      onWrong={(qi) => addReviewItem(module.id, lesson.id, qi)}
      onFinish={(score, total) => {
        vorher.current = { xp: data.xp, abzeichen: new Set(Object.keys(data.badges)) };
        completeLesson(lesson.id, score, total);
      }}
      ergebnis={ergebnis}
    />
  );
}
