import { useEffect, useMemo, useRef, useState } from 'react';
import { STR as NAV } from '../i18n/pages/layout';
import { Zurueck, EmptyState } from '../components/ui';
import { Link } from 'react-router-dom';
import type { QuizQuestion } from '../content/types';
import { Icon } from '../components/Icon';
import { useAppState, type ReviewItem } from '../state/AppState';
import { zeichenFuer } from '../lib/zeichen';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/review';
import { STR as QUIZ } from '../i18n/pages/quiz';
import { Rueckmeldung } from '../components/Rueckmeldung';
import { CardsRow } from '../components/PlayingCard';
import { frischerStartwert } from '../lib/zufall';
import { mischeFrage } from '../lib/lernen/quiz';
import { tageBis } from '../lib/lernen/faellig';

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
  const [selected, setSelected] = useState<number | null>(null);
  const [sessionDone, setSessionDone] = useState(0);
  /* Die Optionen stehen bei jeder Anzeige anders (E-091); der Startwert wechselt
     mit jeder Karte. */
  const [startwert, setStartwert] = useState(frischerStartwert);

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
  const weiterRef = useRef<HTMLButtonElement>(null);
  /* Die gewählte Option wird gesperrt; der Fokus wandert zu „Nächste Karte". */
  useEffect(() => {
    if (answered) weiterRef.current?.focus({ preventScroll: true });
  }, [answered]);
  const gemischt = useMemo(
    () => (current ? mischeFrage(current.question, `${startwert}:${current.item.key}`) : null),
    [current, startwert],
  );

  function choose(i: number) {
    if (answered || !current) return;
    setSelected(i);
  }

  function next() {
    if (!current || selected === null) return;
    const correct = gemischt !== null && selected === gemischt.frage.correctIndex;
    answerReview(current.item.key, correct);
    setSelected(null);
    setStartwert(frischerStartwert());
    setSessionDone((s) => s + 1);
  }

  const nextDue = useMemo(() => {
    const future = data.reviews.filter((r) => r.due > today).sort((a, b) => a.due.localeCompare(b.due));
    return future[0]?.due ?? null;
  }, [data.reviews, today]);

  return (
    <div>
      <Zurueck to="/lernen" />
      <div className="page-header">
        <h1>{L.title}</h1>
        <p className="sub">
          {L.sub}
        </p>
      </div>

      {/* Zahlen nur, wenn es etwas zu zählen gibt: „0 fällig · 0 im Stapel" über
          einem leeren Stapel sagte zweimal dasselbe wie der Leerzustand. */}
      {(data.reviews.length > 0 || sessionDone > 0) && (
        <div className="row wrap" style={{ marginBottom: 18 }}>
          {dueCards.length > 0 && <span className="pill gold">{L.due(dueCards.length)}</span>}
          {data.reviews.length > 0 && <span className="pill">{L.inDeck(data.reviews.length)}</span>}
          {sessionDone > 0 && <span className="pill ok">{L.doneToday(sessionDone)}</span>}
        </div>
      )}

      {!current && data.reviews.length === 0 && (
        <div>
          <EmptyState
            icon={zeichenFuer('/lernen/wiederholen')}
            title={L.emptyTitle}
            body={L.emptyText}
            actionLabel={L.toPath}
            actionTo="/lernen"
          />
        </div>
      )}

      {!current && data.reviews.length > 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 36 }}>
          <div style={{ color: 'var(--auszeichnung-lesbar)', marginBottom: 10 }}>
            <Icon name={zeichenFuer('/lernen/wiederholen')} size={38} />
          </div>
          <h2 style={{ fontSize: 'var(--fs-ueberschrift)', marginBottom: 8 }}>{L.allDoneTitle}</h2>
          <p className="muted small">
            {L.allDoneText}
            {nextDue && <> {L.nextDue(tageBis(nextDue, today))}</>}
          </p>
        </div>
      )}

      {current && gemischt && (
        <div className="quiz-fokus">
          <div className="row between wrap" style={{ marginBottom: 14 }}>
            <span className="small faint">
              {current.moduleTitle} · {current.lessonTitle}
            </span>
            <span className="pill">
              {L.streakPill(current.item.streak)}
            </span>
          </div>
          <h2 className="quiz-frage">{gemischt.frage.question}</h2>
          {(gemischt.frage.cards || gemischt.frage.board) && (
            <div className="quiz-karten">
              {gemischt.frage.cards && <CardsRow cards={gemischt.frage.cards} size="md" />}
              {gemischt.frage.board && <CardsRow cards={gemischt.frage.board} size="md" />}
            </div>
          )}
          <div className="quiz-optionen">
            {gemischt.frage.options.map((opt, i) => {
              let cls = 'quiz-option';
              if (answered) {
                if (i === gemischt.frage.correctIndex) cls += ' correct';
                else if (i === selected) cls += ' wrong';
                else cls += ' dimmed';
              }
              return (
                <button key={i} type="button" className={cls} onClick={() => choose(i)} disabled={answered}>
                  <span className="pill" style={{ minWidth: 28, justifyContent: 'center', flexShrink: 0 }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
          {/* Dieselbe Ergebnisleiste wie im Quiz: feste Höhe, nichts verschiebt sich. */}
          <div className="quiz-leiste entscheidung-leiste entscheidung">
            <div className="quiz-leiste-innen">
              <div className="quiz-leiste-text">
                {answered && (
                  <Rueckmeldung urteil={selected === gemischt.frage.correctIndex ? 'richtig' : 'falsch'}>
                    {selected !== gemischt.frage.correctIndex && selected !== null
                      && gemischt.frage.optionFeedback?.[selected] && (
                      <>{gemischt.frage.optionFeedback[selected]}{' '}</>
                    )}
                    {gemischt.frage.explanation}
                  </Rueckmeldung>
                )}
              </div>
              {/* Wie im Quiz: der Knopf bleibt, vor der Antwort gesperrt. */}
              <button
                ref={weiterRef}
                type="button"
                className="btn primary quiz-weiter"
                onClick={next}
                disabled={!answered}
              >
                {!answered ? QUIZ[lang].hint : dueCards.length > 1 ? L.nextCard : L.finish}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
