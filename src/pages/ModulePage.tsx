import { Link, useParams } from 'react-router-dom';
import { useAppState } from '../state/AppState';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/module';
import { STR as PRO } from '../i18n/pages/pro';
import { ProLock } from '../components/pro/ProLock';
import { usePro } from '../lib/pro/ProProvider';
import { isFreeLesson } from '../lib/pro/plan';
import { Icon } from '../components/Icon';
import { Levelring } from '../components/Levelring';
import { LEKTION_XP_HOECHSTENS, lektionsstand } from '../lib/rang/lektionen';

export function ModulePage() {
  const { moduleId } = useParams();
  const { data } = useAppState();
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

      <ol className="lektionen" style={{ maxWidth: 760 }}>
        {module.lessons.map((lesson, i) => {
          const result = data.completedLessons[lesson.id];
          const lessonLocked = !unlocked && !isFreeLesson(module.id, lesson.id);
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
                    {result && L.quizResult(result.quizScore, result.quizTotal)}
                  </span>
                </div>
                {lessonLocked ? (
                  <span className="pill gold" title={P.lockedTitle} aria-label={P.lockedTitle}>
                    <Icon name="lock" size={14} />
                  </span>
                ) : result ? (
                  <span className="hinweis fertig">{L.lektionFertig}</span>
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
        <div style={{ maxWidth: 760, marginTop: 16 }}>
          <ProLock text={P.lockedModule} compact />
        </div>
      )}
    </div>
  );
}
