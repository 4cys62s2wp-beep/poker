import { Link } from 'react-router-dom';
import { Icon, IconTile, type IconName } from '../components/Icon';
import { moduleProgress, useAppState, xpThreshold } from '../state/AppState';
import { useLang, levelTitleFor } from '../i18n';
import { STR } from '../i18n/pages/dashboard';

export function Dashboard() {
  const { data, level, dueReviewCount } = useAppState();
  const { lang, content } = useLang();
  const L = STR[lang];
  const totalLessons = content.modules.reduce((s, m) => s + m.lessons.length, 0);
  const doneLessons = Object.keys(data.completedLessons).length;

  const trainerTotals = Object.values(data.trainers).reduce(
    (acc, t) => ({ attempts: acc.attempts + t.attempts, correct: acc.correct + t.correct }),
    { attempts: 0, correct: 0 },
  );
  const accuracy = trainerTotals.attempts > 0 ? Math.round((100 * trainerTotals.correct) / trainerTotals.attempts) : null;

  // Nächste offene Lektion finden
  let nextLesson: { moduleId: string; lessonId: string; title: string; moduleTitle: string } | null = null;
  outer: for (const m of content.modules) {
    for (const l of m.lessons) {
      if (!data.completedLessons[l.id]) {
        nextLesson = { moduleId: m.id, lessonId: l.id, title: l.title, moduleTitle: m.title };
        break outer;
      }
    }
  }

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const dailyDone = data.daily?.date === todayStr;
  const dayIndex = Math.floor(Date.now() / 86400000) % L.tips.length;
  const curLevelXp = xpThreshold(level);
  const nextLevelXp = xpThreshold(level + 1);
  const levelPct = Math.min(100, Math.round((100 * (data.xp - curLevelXp)) / (nextLevelXp - curLevelXp)));

  const quickLinks: Array<{ to: string; icon: IconName; tone: 'gold' | 'green' | 'blue' | 'red' | 'violet'; label: string }> = [
    { to: '/coach', icon: 'coach', tone: 'gold', label: L.liveCoach },
    { to: '/tools/hands', icon: 'search', tone: 'green', label: L.handExplorer },
    { to: '/tools/tells', icon: 'eye', tone: 'violet', label: L.tellsReads },
    { to: '/trainer/szenario', icon: 'scene', tone: 'blue', label: L.scenarioTrainer },
  ];

  return (
    <div>
      <div className="card hero" style={{ marginBottom: 20 }}>
        <span className="watermark">♠</span>
        <div className="eyebrow">{L.eyebrow}</div>
        <h1 style={{ fontSize: 'clamp(26px, 4.4vw, 36px)', lineHeight: 1.15, maxWidth: 560 }}>
          {data.name ? L.welcomeBack(data.name) : L.heroTitle}
        </h1>
        <p className="sub" style={{ color: 'var(--text-dim)', marginTop: 8, maxWidth: 520 }}>
          {L.heroSub}
        </p>
      </div>

      <div className="grid cols-3">
        <div className="card">
          <div className="stat-label">{L.level}</div>
          <div className="big-stat">
            {level} <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-dim)', fontFamily: 'var(--font-body)' }}>{levelTitleFor(level, lang)}</span>
          </div>
          <div className="progressbar" style={{ margin: '10px 0 6px' }}>
            <div style={{ width: `${levelPct}%` }} />
          </div>
          <div className="small faint">
            {L.xpLine(data.xp, Math.max(0, nextLevelXp - data.xp), level + 1)}
          </div>
        </div>
        <div className="card">
          <div className="stat-label">{L.lessons}</div>
          <div className="big-stat">
            {doneLessons}
            <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-dim)' }}> / {totalLessons}</span>
          </div>
          <div className="progressbar green" style={{ margin: '10px 0 6px' }}>
            <div style={{ width: `${totalLessons ? Math.round((100 * doneLessons) / totalLessons) : 0}%` }} />
          </div>
          <div className="small faint">{L.completed}</div>
        </div>
        <div className="card">
          <div className="stat-label">{L.streak}</div>
          <div className="big-stat row" style={{ gap: 6 }}>
            {data.streak.count > 0 && <Icon name="flame" size={24} style={{ color: 'var(--gold-bright)' }} />}
            {data.streak.count > 0 ? data.streak.count : '–'}
            <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-dim)', fontFamily: 'var(--font-body)' }}>
              {data.streak.count > 0 ? (data.streak.count === 1 ? L.day : L.days) : ''}
            </span>
          </div>
          <div className="small faint" style={{ marginTop: 10 }}>
            {accuracy !== null ? L.accuracyLine(accuracy) : L.accuracyEmpty}
          </div>
        </div>
      </div>

      <div className="section-title">{L.today}</div>
      <div className="grid cols-3">
        {nextLesson ? (
          <Link to={`/lernen/${nextLesson.moduleId}/${nextLesson.lessonId}`} className="card clickable">
            <div className="row" style={{ marginBottom: 8 }}>
              <IconTile name="learn" tone="gold" size={34} />
              <span className="stat-label">{L.nextLesson}</span>
            </div>
            <div style={{ fontWeight: 800 }}>{nextLesson.title}</div>
            <div className="small faint" style={{ marginTop: 3 }}>{nextLesson.moduleTitle}</div>
          </Link>
        ) : (
          <div className="card">
            <div className="row" style={{ marginBottom: 8 }}>
              <IconTile name="learn" tone="green" size={34} />
              <span className="stat-label">{L.learnPath}</span>
            </div>
            <div style={{ fontWeight: 800 }}>{L.allLessonsDone}</div>
            <div className="small faint" style={{ marginTop: 3 }}>{L.keepFresh}</div>
          </div>
        )}
        <Link to="/tagesquiz" className="card clickable">
          <div className="row" style={{ marginBottom: 8 }}>
            <IconTile name="sun" tone={dailyDone ? 'green' : 'gold'} size={34} />
            <span className="stat-label">{L.dailyQuiz}</span>
          </div>
          <div style={{ fontWeight: 800 }}>
            {dailyDone ? L.dailyDone(data.daily?.score, data.daily?.total) : L.dailyTeaser}
          </div>
          <div className="small faint" style={{ marginTop: 3 }}>
            {dailyDone ? L.dailyTomorrow : L.dailyAcross}
          </div>
        </Link>
        <Link to="/wiederholen" className="card clickable">
          <div className="row" style={{ marginBottom: 8 }}>
            <IconTile name="repeat" tone={dueReviewCount > 0 ? 'gold' : 'blue'} size={34} />
            <span className="stat-label">{L.review}</span>
          </div>
          <div style={{ fontWeight: 800 }}>
            {dueReviewCount > 0 ? L.cardsDue(dueReviewCount) : L.nothingDue}
          </div>
          <div className="small faint" style={{ marginTop: 3 }}>
            {dueReviewCount > 0 ? L.reviewNudge : L.cardsInDeck(data.reviews.length)}
          </div>
        </Link>
      </div>

      <div className="section-title">{L.apply}</div>
      <div className="grid cols-4">
        {quickLinks.map((q) => (
          <Link key={q.to} to={q.to} className="card clickable" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <IconTile name={q.icon} tone={q.tone} />
            <div style={{ fontWeight: 800, fontSize: 14 }}>{q.label}</div>
          </Link>
        ))}
      </div>

      <div className="section-title">{L.tipOfDay}</div>
      <div className="card" style={{ borderColor: 'rgba(212,175,94,0.35)' }}>
        <p style={{ color: '#d8d5cb' }}>{L.tips[dayIndex]}</p>
      </div>

      <div className="section-title">{L.yourModules}</div>
      <div className="grid cols-2">
        {content.modules.map((m) => {
          const prog = moduleProgress(data, m.id);
          return (
            <Link key={m.id} to={`/lernen/${m.id}`} className="card clickable">
              <div className="row between">
                <div className="row">
                  <span style={{ fontSize: 22 }}>{m.icon}</span>
                  <div>
                    <div style={{ fontWeight: 800 }}>{m.title}</div>
                    <div className="small faint">{L.lessonCount(m.lessons.length)}</div>
                  </div>
                </div>
                <span className="pill">{Math.round(prog * 100)} %</span>
              </div>
              <div className="progressbar" style={{ marginTop: 12 }}>
                <div style={{ width: `${prog * 100}%` }} />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="suit-deco">♠ ♥ ♦ ♣</div>
    </div>
  );
}
