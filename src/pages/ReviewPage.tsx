import { useMemo, useState } from 'react';
import { STR as NAV } from '../i18n/pages/layout';
import { BackLink } from '../components/ui';
import { Link } from 'react-router-dom';
import type { QuizQuestion } from '../content/types';
import { Icon } from '../components/Icon';
import { useAppState, type ReviewItem } from '../state/AppState';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/review';
import { STR as PRO_STR } from '../i18n/pages/pro';
import { ProLock } from '../components/pro/ProLock';
import { usePro } from '../lib/pro/ProProvider';

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
  const { lang, content } = useLang();
  const L = STR[lang];
  const P = PRO_STR[lang];
  const { fullAccess } = usePro();
  const unlocked = fullAccess;
  const [selected, setSelected] = useState<number | null>(null);
  const [sessionDone, setSessionDone] = useState(0);

  const today = todayStr();
  const dueCards = useMemo<DueCard[]>(() => {
    const cards: DueCard[] = [];
    for (const item of data.reviews) {
      if (item.due > today) continue;
      const module = content.modules.find((m) => m.id === item.moduleId);
      const lesson = module?.lessons.find((l) => l.id === item.lessonId);
      const q = lesson?.quiz[item.questionIndex];
      if (module && lesson && q) {
        cards.push({ item, question: q, lessonTitle: lesson.title, moduleTitle: module.title });
      }
    }
    return cards;
  }, [data.reviews, today, content.modules]);

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
      <BackLink to="/lernen" label={NAV[lang].navLearn} />
      <div className="page-header">
        <div className="eyebrow">{L.eyebrow}</div>
        <h1>{L.title}</h1>
        <p className="sub">
          {L.sub}
        </p>
      </div>

      <div className="row wrap" style={{ marginBottom: 18 }}>
        <span className="pill gold">{L.due(dueCards.length)}</span>
        <span className="pill">{L.inDeck(data.reviews.length)}</span>
        {sessionDone > 0 && <span className="pill ok">{L.doneToday(sessionDone)}</span>}
      </div>

      {!unlocked && (
        <div style={{ maxWidth: 640 }}>
          <ProLock text={P.lockedGeneric} />
        </div>
      )}

      {unlocked && !current && (
        <div className="card" style={{ maxWidth: 640, textAlign: 'center', padding: 36 }}>
          <div style={{ color: 'var(--auszeichnung-lesbar)', marginBottom: 10 }}>
            <Icon name="repeat" size={38} />
          </div>
          {data.reviews.length === 0 ? (
            <>
              <h2 style={{ fontSize: 20, marginBottom: 8 }}>{L.emptyTitle}</h2>
              <p className="muted small" style={{ maxWidth: 420, margin: '0 auto 16px' }}>
                {L.emptyText}
              </p>
              <Link to="/lernen" className="btn primary">
                {L.toPath}
              </Link>
            </>
          ) : (
            <>
              <h2 style={{ fontSize: 20, marginBottom: 8 }}>{L.allDoneTitle}</h2>
              <p className="muted small">
                {L.allDoneText}
                {nextDue && <> {L.nextDueBefore} <strong>{nextDue}</strong>.</>}
              </p>
            </>
          )}
        </div>
      )}

      {unlocked && current && (
        <div style={{ maxWidth: 680 }}>
          <div className="card">
            <div className="row between wrap" style={{ marginBottom: 14 }}>
              <span className="small faint">
                {current.moduleTitle} · {current.lessonTitle}
              </span>
              <span className="pill">
                {L.streakPill(current.item.streak)}
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
                    {selected === current.question.correctIndex ? L.correctLabel : L.wrongLabel}
                  </strong>
                  {current.question.explanation}
                </div>
                <button className="btn primary" style={{ marginTop: 14 }} onClick={next}>
                  {dueCards.length > 1 ? L.nextCard : L.finish}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
