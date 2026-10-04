import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useNavigationType, useParams } from 'react-router-dom';
import { MarkdownLite } from '../components/MarkdownLite';
import { CardsRow } from '../components/PlayingCard';
import { Positionsschema } from '../components/Positionsschema';
import { useAppState } from '../state/AppState';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/lesson';
import { STR as PRO } from '../i18n/pages/pro';
import { ProLock } from '../components/pro/ProLock';
import { usePro } from '../lib/pro/ProProvider';
import { isFreeLesson } from '../lib/pro/plan';
import { Icon } from '../components/Icon';
import { Zurueck } from '../components/ui';
import { grenze } from '../lib/lernen/quiz';
import { ladeQuizZustand } from '../lib/lernen/zwischenstand';
import { abschnittAus } from '../lib/lernen/lesestand';

export function LessonPage() {
  const { moduleId, lessonId } = useParams();
  const { data, recordLessonProgress } = useAppState();
  const navType = useNavigationType();
  const navigate = useNavigate();
  const { lang, content } = useLang();
  const L = STR[lang];
  const P = PRO[lang];
  const { fullAccess } = usePro();
  /* Ohne Monetarisierung, mit Abo oder in der Testphase bleibt alles offen. */
  const unlocked = fullAccess;
  const foundModule = content.modules.find((m) => m.id === (moduleId ?? ''));
  const foundLesson = foundModule?.lessons.find((l) => l.id === (lessonId ?? ''));
  const found = foundModule && foundLesson ? { module: foundModule, lesson: foundLesson } : undefined;

  /* ── Lesestand ─────────────────────────────────────────────────────────
     Welcher Abschnitt gerade gelesen wird, kommt aus dem Bild: die letzte
     Überschrift, die ins obere Drittel gewandert ist. Gespeichert wird nur
     vorwärts; beim Wiederkommen springt die Seite dorthin (und sagt es). */
  const abschnittAnzahl = foundLesson?.sections.length ?? 0;
  const lektionsId = foundLesson?.id ?? '';
  const [aktuell, setAktuell] = useState(0);
  const [gesprungen, setGesprungen] = useState<number | null>(null);
  const gemerkt = data.lessonProgress[lektionsId] ?? 0;
  const gemerktRef = useRef(gemerkt);
  gemerktRef.current = gemerkt;

  const messe = useCallback(() => {
    if (abschnittAnzahl === 0) return;
    const tops: number[] = [];
    for (let i = 0; i < abschnittAnzahl; i += 1) {
      const el = document.getElementById(`abschnitt-${i}`);
      tops.push(el ? el.getBoundingClientRect().top : Number.POSITIVE_INFINITY);
    }
    const amEnde = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    const a = abschnittAus(tops, window.innerHeight, amEnde);
    setAktuell(a);
    if (a >= 1 && a > gemerktRef.current) recordLessonProgress(lektionsId, a);
  }, [abschnittAnzahl, lektionsId, recordLessonProgress]);

  useEffect(() => {
    if (abschnittAnzahl === 0) return undefined;
    let rahmen = 0;
    const beiScroll = () => {
      cancelAnimationFrame(rahmen);
      rahmen = requestAnimationFrame(messe);
    };
    window.addEventListener('scroll', beiScroll, { passive: true });
    window.addEventListener('resize', beiScroll);
    rahmen = requestAnimationFrame(messe);
    return () => {
      window.removeEventListener('scroll', beiScroll);
      window.removeEventListener('resize', beiScroll);
      cancelAnimationFrame(rahmen);
    };
  }, [messe, abschnittAnzahl]);

  /* Wiederkommen: an die gemerkte Stelle springen — außer beim Zurück aus dem
     Quiz, wo die Scrollverwaltung die genaue Position selbst wiederherstellt.
     Zwei Bilder Wartezeit, weil sie nach einem Seitenwechsel selbst nach oben
     scrollt. */
  const gesprungenFuer = useRef('');
  useEffect(() => {
    if (!lektionsId || navType === 'POP' || gesprungenFuer.current === lektionsId) return undefined;
    gesprungenFuer.current = lektionsId;
    const ziel = gemerktRef.current;
    if (ziel < 1) return undefined;
    let zweites = 0;
    const erstes = requestAnimationFrame(() => {
      zweites = requestAnimationFrame(() => {
        const el = document.getElementById(`abschnitt-${ziel}`);
        if (!el) return;
        el.scrollIntoView({ block: 'start' });
        setGesprungen(ziel);
      });
    });
    return () => { cancelAnimationFrame(erstes); cancelAnimationFrame(zweites); };
  }, [lektionsId, navType]);

  const geheZu = (i: number) => {
    const el = document.getElementById(`abschnitt-${i}`);
    if (!el) return;
    const ruhig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ block: 'start', behavior: ruhig ? 'auto' : 'smooth' });
  };

  if (!found) {
    return (
      <div className="card">
        {L.notFound} <Link to="/lernen" style={{ color: 'var(--auszeichnung-lesbar)' }}>{L.backToPath}</Link>
      </div>
    );
  }

  const { module, lesson } = found;
  const lessonIndex = module.lessons.findIndex((l) => l.id === lesson.id);
  const alreadyDone = !!data.completedLessons[lesson.id];
  /* Modul 1–3 sind gratis; alles darüber nur mit Pro. */
  const locked = !unlocked && !isFreeLesson(module.id, lesson.id);

  /* Ein verlassenes Quiz wird an derselben Stelle fortgesetzt (sessionStorage). */
  const zwischenstand = ladeQuizZustand(lesson.id, lesson.quiz.length);
  const versucht = data.lessonAttempts[lesson.id];
  const quizWeg = `/lernen/${module.id}/${lesson.id}/quiz`;
  const lesenMax = Math.max(0, abschnittAnzahl - 1);
  const amLetzten = aktuell >= lesenMax;

  return (
    <div>
      <Zurueck to={`/lernen/${module.id}`} label={module.title} />

      <div className="page-header" style={{ marginTop: 14 }}>
        <div className="row wrap" style={{ marginBottom: 8 }}>
          <span className="pill gold">
            {L.lessonOf(lessonIndex + 1, module.lessons.length)}
          </span>
          <span className="pill">{L.duration(lesson.duration)}</span>
          {alreadyDone && <span className="pill ok"><Icon name="check" size={13} /> {L.completedPill}</span>}
          {!alreadyDone && versucht && (
            <span className="pill warn">{L.triedPill(versucht.bestScore, versucht.total)}</span>
          )}
        </div>
        <h1>{lesson.title}</h1>
        <p className="sub">{lesson.intro}</p>
      </div>

      {gesprungen !== null && !locked && (
        <div className="lese-hinweis" role="status">
          <span>{L.resumedAt(gesprungen + 1, abschnittAnzahl)}</span>
          <button
            type="button"
            className="btn sm ghost"
            onClick={() => { window.scrollTo({ top: 0 }); setGesprungen(null); }}
          >
            {L.fromStart}
          </button>
        </div>
      )}

      {locked && (
        <div>
          <ProLock text={P.lockedModule} />
        </div>
      )}

      {!locked && (
        <>
          <div className="prose">
            {lesson.sections.map((sec, i) => (
              <section key={i} id={`abschnitt-${i}`} className="lesson-section">
                <h2>{sec.heading}</h2>
                {sec.cards && sec.cards.length > 0 && (
                  <div style={{ margin: '4px 0 14px' }}>
                    <CardsRow cards={sec.cards} size={sec.cards.length > 5 ? 'sm' : 'md'} />
                  </div>
                )}
                {sec.schema === 'sitzplan' && (
                  <div style={{ margin: '4px 0 14px' }}>
                    <Positionsschema />
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
              <h2 style={{ fontSize: 'var(--fs-fliesstext)' }}>{L.takeaways}</h2>
              <ul className="list-plain">
                {lesson.takeaways.map((t, i) => (
                  <li key={i} className="takeaway">
                    <span className="tick"><Icon name="check" size={16} /></span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {!alreadyDone && versucht && (
            <p className="small muted">{L.triedHint(grenze(versucht.total), versucht.total)}</p>
          )}

          {/* Eine klebende Leiste im Daumenbereich (Regel 9a.2): Wo man auch
              ist, „Weiter" liegt unter dem Daumen. Am letzten Abschnitt wird
              daraus das Quiz — der einzige Knopf, den die Seite am Ende
              braucht. */}
          <div className="entscheidung-leiste entscheidung lektions-leiste">
            <div className="entscheidung-innen stapel">
              <span className="stand" aria-live="polite">
                {L.sectionOf(Math.min(aktuell, lesenMax) + 1, abschnittAnzahl)}
              </span>
              {/* Immer derselbe Knopf: Wechselte er am Ende von Knopf zu Link,
                  verlöre eine Tastatur-Nutzerin hier den Fokus. */}
              <button
                type="button"
                className="btn primary"
                onClick={() => (amLetzten ? navigate(quizWeg) : geheZu(aktuell + 1))}
              >
                {amLetzten
                  ? (zwischenstand ? L.resumeQuiz(zwischenstand.antworten.length + 1) : L.startQuiz(lesson.quiz.length))
                  : L.nextSection}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
