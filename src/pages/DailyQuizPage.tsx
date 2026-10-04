import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QuizRunner } from '../components/QuizRunner';
import { Icon } from '../components/Icon';
import { useAppState } from '../state/AppState';
import { zeichenFuer } from '../lib/zeichen';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/dailyquiz';
import { Zurueck } from '../components/ui';
import { tagesschluessel } from '../lib/heute/hand';
import { quizPool, ziehe } from '../lib/tagesquiz';
import { appUrl, quizErgebnisText, teileText, type Teilergebnis } from '../lib/teilen';
import { aktuelleSerie } from '../lib/serie';

export function DailyQuizPage() {
  const { data, completeDailyQuiz, addReviewItem } = useAppState();
  const { lang, content } = useLang();
  const L = STR[lang];
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const today = tagesschluessel();
  const alreadyDone = data.daily?.date === today;
  const [geteilt, setGeteilt] = useState<Teilergebnis | null>(null);

  /* Das Ergebnis als eine Zeile Text (E-096): Teilen-Dialog, sonst Zwischenablage.
     Nur Zahlen und Tage — kein Geld, kein Bild, das erst fertig sein muss. */
  async function teile(score: number, total: number) {
    const datum = new Date().toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
    const text = quizErgebnisText(
      { datum, score, total, serie: aktuelleSerie(data.streak, today) },
      lang,
    );
    const r = await teileText(text, appUrl());
    setGeteilt(r);
    if (r !== 'geteilt') window.setTimeout(() => setGeteilt(null), 2400);
  }
  const teilenKnopf = (score: number, total: number) => (
    <>
      <button type="button" className="btn" onClick={() => void teile(score, total)}>
        <Icon name={geteilt === 'kopiert' ? 'check' : 'share'} size={18} />
        {geteilt === 'kopiert' ? L.kopiert : L.teilen}
      </button>
      <span className="sr-only" role="status">{geteilt === 'kopiert' ? L.kopiert : ''}</span>
    </>
  );

  /* Nur Fragen aus abgeschlossenen Lektionen (siehe `lib/tagesquiz.ts`).
     Der Pool hängt am Lernstand, nicht nur am Datum: Wer heute Morgen noch
     nichts gelernt hatte und mittags die erste Lektion abschließt, soll das
     Quiz dann auch bekommen. */
  const pool = useMemo(
    () => quizPool(content.modules, data.completedLessons),
    [content.modules, data.completedLessons],
  );
  const questions = useMemo(() => ziehe(pool, today), [pool, today]);
  const naechste = useMemo(() => {
    for (const m of content.modules) {
      for (const l of m.lessons) if (!data.completedLessons[l.id]) return { modul: m.id, lektion: l.id };
    }
    return null;
  }, [content.modules, data.completedLessons]);

  /* Im Quiz selbst gibt es keine Seitenkopfzeile: Fokusmodus (E-091). Der
     Startwert ist das Datum — alle sehen am selben Tag dieselbe Mischung. */
  if (started) {
    return (
      <QuizRunner
        titel={L.title}
        questions={questions}
        startwert={today}
        onSchliessen={() => navigate('/lernen')}
        onFinish={(score, total) => completeDailyQuiz(score, total)}
        onWrong={(i) => {
          const q = questions[i];
          addReviewItem(q.moduleId, q.lessonId, q.qi);
        }}
        ergebnis={(e) => (
          <div className="quiz-ergebnis">
            <div className="ergebnis-kopf" role="status" aria-live="polite">
              <div className="big-stat">{e.score} / {e.total}</div>
              <p className="muted small">
                {e.falsch.length > 0 ? L.toReview(e.falsch.length) : L.allRight}
              </p>
            </div>
            <div className="entscheidung-leiste entscheidung">
              <div className="entscheidung-innen stapel">
                {teilenKnopf(e.score, e.total)}
                <Link className="btn primary" to="/lernen">{L.toPath}</Link>
              </div>
            </div>
          </div>
        )}
      />
    );
  }

  return (
    <div>
      <Zurueck to="/lernen" />
      <div className="page-header">
        <h1>{L.title}</h1>
        <p className="sub">
          {L.sub}
        </p>
      </div>

      {alreadyDone && !started && (
        <div className="card" style={{ textAlign: 'center', padding: 36 }}>
          <div style={{ color: 'var(--auszeichnung-lesbar)', marginBottom: 10 }}>
            <Icon name={zeichenFuer('/lernen/tagesquiz')} size={38} />
          </div>
          <h2 style={{ fontSize: 'var(--fs-ueberschrift)', marginBottom: 8 }}>{L.doneTitle}</h2>
          <p className="muted small">
            {L.resultPrefix} <strong>{data.daily?.score} / {data.daily?.total}</strong>{L.resultSuffix}
          </p>
          <div style={{ marginTop: 'var(--sp-4)' }}>{teilenKnopf(data.daily?.score ?? 0, data.daily?.total ?? 0)}</div>
        </div>
      )}

      {!alreadyDone && !started && questions.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 36 }}>
          <div style={{ color: 'var(--auszeichnung-lesbar)', marginBottom: 10 }}>
            <Icon name={zeichenFuer('/lernen/tagesquiz')} size={38} />
          </div>
          <h2 style={{ fontSize: 'var(--fs-ueberschrift)', marginBottom: 8 }}>{L.emptyTitle}</h2>
          <p className="muted small" style={{ marginBottom: 18 }}>{L.emptyText}</p>
          <Link
            className="btn primary lg"
            to={naechste ? `/lernen/${naechste.modul}/${naechste.lektion}` : '/lernen'}
          >
            {L.emptyGo}
          </Link>
        </div>
      )}

      {!alreadyDone && !started && questions.length > 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 36 }}>
          <div style={{ color: 'var(--auszeichnung-lesbar)', marginBottom: 10 }}>
            <Icon name={zeichenFuer('/lernen/tagesquiz')} size={38} />
          </div>
          <h2 style={{ fontSize: 'var(--fs-ueberschrift)', marginBottom: 8 }}>{L.readyTitle}</h2>
          <p className="muted small" style={{ marginBottom: 18 }}>
            {L.readyText(questions.length)}
          </p>
          <button className="btn primary lg" onClick={() => setStarted(true)}>
            {L.start}
          </button>
        </div>
      )}
    </div>
  );
}
