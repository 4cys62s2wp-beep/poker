import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppState } from '../state/AppState';
import { QuizRunner, type QuizErgebnis } from '../components/QuizRunner';
import { TEST_FRAGEN, grenzeFuer, testBestanden, ziehTestFragen } from '../lib/lernen/modultest';
import { frischerStartwert } from '../lib/zufall';
import type { PoolFrage } from '../lib/tagesquiz';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/module';
import { STR as PRO } from '../i18n/pages/pro';
import { ProLock } from '../components/pro/ProLock';
import { Schloss } from '../components/pro/Schloss';
import { usePro } from '../lib/pro/ProProvider';
import { FREE_MODULE_IDS } from '../lib/pro/plan';
import { isFreeLesson } from '../lib/pro/plan';
import { Icon } from '../components/Icon';
import { Levelring } from '../components/Levelring';
import { LEKTION_XP_HOECHSTENS, lektionsstand } from '../lib/rang/lektionen';
import { Zurueck } from '../components/ui';

/** Je Modul eine eigene Instanz: Wechselt nur die Adresse von einem Modul zum
 *  nächsten, darf ein laufender Test des vorigen nicht stehenbleiben. */
export function ModulePage() {
  const { moduleId } = useParams();
  return <ModulInhalt key={moduleId} />;
}

function ModulInhalt() {
  const { moduleId } = useParams();
  const { data, completeModuleByTest, addReviewItem } = useAppState();
  const [test, setTest] = useState<{ fragen: PoolFrage[]; startwert: string } | null>(null);
  const { lang, content } = useLang();
  const L = STR[lang];
  const P = PRO[lang];
  const { fullAccess } = usePro();
  /* Ohne Monetarisierung, mit Abo oder in der Testphase bleibt alles offen. */
  const unlocked = fullAccess;
  const module = content.modules.find((m) => m.id === (moduleId ?? ''));

  if (!module) {
    return (
      <div className="card">
        {L.notFound} <Link to="/lernen" style={{ color: 'var(--auszeichnung-lesbar)' }}>{L.backToPath}</Link>
      </div>
    );
  }

  /* Die Lektionsliste bleibt immer sichtbar – wer sieht, was ihn erwartet,
     entscheidet besser als vor einer blanken Wand. Gesperrte Lektionen sind
     markiert; die erste Lektion jedes Moduls ist immer frei. */
  const lockedLessons = module.lessons.filter((l) => !unlocked && !isFreeLesson(module.id, l.id));
  const hasLocked = lockedLessons.length > 0;

  const stand = lektionsstand(module.lessons, data.completedLessons);

  const testFragen = Math.min(TEST_FRAGEN, module.lessons.reduce((n, l) => n + l.quiz.length, 0));

  function startTest() {
    const startwert = frischerStartwert();
    setTest({ fragen: ziehTestFragen(module!, startwert), startwert });
  }

  /* Der Modultest läuft im Fokusmodus an Ort und Stelle — keine eigene Adresse,
     keine dritte Ebene (E-097). */
  if (test) {
    const naechstes = content.modules.find((m) => m.id === `m${parseInt(module.id.slice(1), 10) + 1}`);
    return (
      <QuizRunner
        /* Jeder Durchgang eine eigene Instanz: Sonst bliebe nach „Test wiederholen“
           das Ergebnis des vorigen stehen. */
        key={test.startwert}
        titel={`${L.testTitel}: ${module.title}`}
        questions={test.fragen}
        startwert={test.startwert}
        onSchliessen={() => setTest(null)}
        onWrong={(i) => {
          const q = test.fragen[i];
          addReviewItem(q.moduleId, q.lessonId, q.qi);
        }}
        onFinish={(score, total) => {
          if (testBestanden(score, total)) completeModuleByTest(module.lessons.map((l) => l.id));
        }}
        ergebnis={(e: QuizErgebnis) => {
          const geschafft = testBestanden(e.score, e.total);
          return (
            <div className="quiz-ergebnis">
              <div className="ergebnis-kopf" role="status" aria-live="polite">
                <span className={`urteil ${geschafft ? 'gut' : 'offen'}`}>
                  <Icon name={geschafft ? 'check' : 'x'} size={20} />
                  {geschafft ? L.testBestanden : L.testKnapp}
                </span>
                <div className="big-stat">{e.score} / {e.total}</div>
              </div>
              <p className="small muted">{geschafft ? L.testBestandenText : L.testKnappText(e.falsch.length)}</p>
              <div className="entscheidung-leiste entscheidung">
                <div className="entscheidung-innen stapel">
                  {geschafft ? (
                    <Link className="btn primary" to={naechstes ? `/lernen/${naechstes.id}` : '/lernen'}>
                      {naechstes ? L.testWeiter(naechstes.title) : L.testZumPfad}
                    </Link>
                  ) : (
                    <button type="button" className="btn primary" onClick={() => setTest(null)}>{L.testDurchgehen}</button>
                  )}
                  <button type="button" className="btn" onClick={startTest}>{L.testNochmal}</button>
                </div>
              </div>
            </div>
          );
        }}
      />
    );
  }

  return (
    <div>
      <Zurueck to="/lernen" />
      <div className="page-header" style={{ marginTop: 10 }}>
        <h1>
          {module.icon} {module.title}
        </h1>
        <p className="sub">{module.subtitle}</p>
      </div>

      {/* Der Stand im Modul, als Ring (E-037). Anders als auf der Startseite
          steht hier eine Gesamtzahl, und das ist kein Widerspruch zu E-032:
          Dort war der Nenner eine Zusage über Inhalt, den es noch nicht
          gibt („49 Lektionen"). Ein Modul hat genau die Lektionen, die es
          hat — hier ist der Nenner eine Tatsache. */}
      <section className="modulstand" aria-label={L.fortschrittMarke}>
        <Levelring
          wert={stand.fertig ? <Icon name="check" size={20} /> : stand.erledigt}
          anteil={stand.anteil}
          groesse={56}
          className={`gross${stand.fertig ? ' fertig' : ' auszeichnung'}`}
          beschriftung={L.fortschrittRing(stand.erledigt, stand.gesamt)}
        />
        <div className="text">
          <span className="marke">{L.fortschrittMarke}</span>
          <strong className="titel">
            {stand.fertig ? L.modulFertig : L.fortschritt(stand.erledigt, stand.gesamt)}
          </strong>
        </div>
      </section>

      {/* „Kenne ich schon“: für alle, die ein Modul nicht von vorn lesen wollen.
          Nur, wo das ganze Modul offen ist — sonst ließen sich mit dem Test
          gesperrte Lektionen als erledigt eintragen. */}
      {!stand.fertig && !hasLocked && (
        <div className="modultest-angebot card">
          <p className="small muted">{L.testSub(testFragen, grenzeFuer(testFragen))}</p>
          <button type="button" className="btn" onClick={startTest}>{L.testKnopf}</button>
        </div>
      )}

      <ol className="lektionen">
        {module.lessons.map((lesson, i) => {
          const result = data.completedLessons[lesson.id];
          const lessonLocked = !unlocked && !isFreeLesson(module.id, lesson.id);
          /* Versucht, aber nicht bestanden: noch nicht abgeschlossen, und die
             Zeile sagt, wo man steht, statt „Abgeschlossen · Quiz 0/5" zu
             behaupten (E-091). */
          const versucht = !result ? data.lessonAttempts[lesson.id] : undefined;
          const dran = !result && !lessonLocked && stand.naechsteId === lesson.id;
          const zustand = result ? 'fertig' : lessonLocked ? 'gesperrt' : dran ? 'dran' : 'spaeter';
          return (
            <li key={lesson.id} className={`lektion ${zustand}`}>
              <Link to={`/lernen/${module.id}/${lesson.id}`} className="lektion-karte">
                <span className="nummer" aria-hidden="true">
                  {result ? <Icon name="check" size={16} /> : i + 1}
                </span>
                <div className="text">
                  <span className="titel">{lesson.title}</span>
                  <span className="meta">
                    {L.lessonMeta(lesson.duration, lesson.quiz.length)}
                    {result && !result.perTest && L.quizResult(result.quizScore, result.quizTotal)}
                    {versucht && L.quizResult(versucht.bestScore, versucht.total)}
                  </span>
                </div>
                {lessonLocked ? (
                  <Schloss pfad={`/lernen/${module.id}/${lesson.id}`} />
                ) : result ? (
                  <span className="hinweis fertig">{result.perTest ? L.perTest : L.lektionFertig}</span>
                ) : versucht ? (
                  <span className="hinweis dran">{L.lektionVersucht}</span>
                ) : dran ? (
                  <span className="hinweis dran">{L.lektionDran}</span>
                ) : (
                  /* Was eine Lektion einbringt, steht dort, wo man sie noch
                     machen kann — hinterher ist es keine Auskunft mehr,
                     sondern eine Erinnerung an etwas Erledigtes. */
                  <span className="hinweis xp">{L.xpBis(LEKTION_XP_HOECHSTENS)}</span>
                )}
              </Link>
            </li>
          );
        })}
      </ol>

      {hasLocked && (
        <div style={{ marginTop: 16 }}>
          <ProLock text={P.lockedLesson(FREE_MODULE_IDS.length)} compact />
        </div>
      )}
    </div>
  );
}
