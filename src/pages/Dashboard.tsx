import { Link } from 'react-router-dom';
import { ALL_MODULES } from '../content';
import { Icon, IconTile, type IconName } from '../components/Icon';
import { levelTitle, moduleProgress, useAppState, xpThreshold } from '../state/AppState';

const DAILY_TIPS = [
  'Position ist der größte Gewinnfaktor: Spiele am Button deutlich mehr Hände als Under the Gun.',
  'Denk in Ranges, nicht in einzelnen Händen: Was würde dein Gegner hier mit seiner GESAMTEN Range tun?',
  'Pot Odds in einer Sekunde: Bei einer halben Pot-Bet brauchst du 25 % Equity für einen profitablen Call.',
  'Open-Limpen ist fast immer ein Fehler. Wenn eine Hand gut genug zum Spielen ist, ist sie gut genug zum Raisen.',
  'Die Regel von 2 und 4: Outs × 4 am Flop (bis River), Outs × 2 am Turn – so schätzt du deine Equity blitzschnell.',
  'Tilt kostet mehr als schlechte Karten. Erkenne deine Auslöser und mach eine Pause, BEVOR du schlecht spielst.',
  'Value Bets zahlen deine Miete: Auf niedrigen Limits gewinnst du mit dünnen Value Bets mehr als mit großen Bluffs.',
  'Bankroll-Regel: Mindestens 25–50 Buy-ins für dein Cash-Game-Limit. Darunter steigst du ab – ohne Ausnahme.',
  'Beobachte auch die Hände, in denen du nicht spielst. Dort sammelst du kostenlose Reads über deine Gegner.',
  'Ein Fold ist nie ein Fehler von 100 bb – ein schlechter Call schon. Diszipliniertes Folden ist eine Waffe.',
  'Suited Connectors spielen sich am besten in Position mit tiefen Stacks – nicht aus früher Position.',
  'Am River gilt gegen die meisten Gegner: Große Raises sind fast immer Value. Glaub ihnen öfter.',
];

export function Dashboard() {
  const { data, level, dueReviewCount } = useAppState();
  const totalLessons = ALL_MODULES.reduce((s, m) => s + m.lessons.length, 0);
  const doneLessons = Object.keys(data.completedLessons).length;

  const trainerTotals = Object.values(data.trainers).reduce(
    (acc, t) => ({ attempts: acc.attempts + t.attempts, correct: acc.correct + t.correct }),
    { attempts: 0, correct: 0 },
  );
  const accuracy = trainerTotals.attempts > 0 ? Math.round((100 * trainerTotals.correct) / trainerTotals.attempts) : null;

  // Nächste offene Lektion finden
  let nextLesson: { moduleId: string; lessonId: string; title: string; moduleTitle: string } | null = null;
  outer: for (const m of ALL_MODULES) {
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
  const dayIndex = Math.floor(Date.now() / 86400000) % DAILY_TIPS.length;
  const curLevelXp = xpThreshold(level);
  const nextLevelXp = xpThreshold(level + 1);
  const levelPct = Math.min(100, Math.round((100 * (data.xp - curLevelXp)) / (nextLevelXp - curLevelXp)));

  const quickLinks: Array<{ to: string; icon: IconName; tone: 'gold' | 'green' | 'blue' | 'red' | 'violet'; label: string }> = [
    { to: '/coach', icon: 'coach', tone: 'gold', label: 'Live-Coach' },
    { to: '/tools/hands', icon: 'search', tone: 'green', label: 'Starthand-Explorer' },
    { to: '/tools/tells', icon: 'eye', tone: 'violet', label: 'Tells & Reads' },
    { to: '/trainer/szenario', icon: 'scene', tone: 'blue', label: 'Szenario-Trainer' },
  ];

  return (
    <div>
      <div className="card hero" style={{ marginBottom: 20 }}>
        <span className="watermark">♠</span>
        <div className="eyebrow">Deine Poker-Schule</div>
        <h1 style={{ fontSize: 'clamp(26px, 4.4vw, 36px)', lineHeight: 1.15, maxWidth: 560 }}>
          {data.name ? `Willkommen zurück, ${data.name}!` : 'Lerne Poker. Richtig.'}
        </h1>
        <p className="sub" style={{ color: 'var(--text-dim)', marginTop: 8, maxWidth: 520 }}>
          Strategien lernen, Skills trainieren, am Tisch anwenden – online wie live. Ohne Echtgeld, mit System.
        </p>
      </div>

      <div className="grid cols-3">
        <div className="card">
          <div className="stat-label">Level</div>
          <div className="big-stat">
            {level} <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-dim)', fontFamily: 'var(--font-body)' }}>{levelTitle(level)}</span>
          </div>
          <div className="progressbar" style={{ margin: '10px 0 6px' }}>
            <div style={{ width: `${levelPct}%` }} />
          </div>
          <div className="small faint">
            {data.xp} XP · noch {Math.max(0, nextLevelXp - data.xp)} XP bis Level {level + 1}
          </div>
        </div>
        <div className="card">
          <div className="stat-label">Lektionen</div>
          <div className="big-stat">
            {doneLessons}
            <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-dim)' }}> / {totalLessons}</span>
          </div>
          <div className="progressbar green" style={{ margin: '10px 0 6px' }}>
            <div style={{ width: `${totalLessons ? Math.round((100 * doneLessons) / totalLessons) : 0}%` }} />
          </div>
          <div className="small faint">abgeschlossen</div>
        </div>
        <div className="card">
          <div className="stat-label">Lern-Streak</div>
          <div className="big-stat row" style={{ gap: 6 }}>
            {data.streak.count > 0 && <Icon name="flame" size={24} style={{ color: 'var(--gold-bright)' }} />}
            {data.streak.count > 0 ? data.streak.count : '–'}
            <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-dim)', fontFamily: 'var(--font-body)' }}>
              {data.streak.count > 0 ? (data.streak.count === 1 ? 'Tag' : 'Tage') : ''}
            </span>
          </div>
          <div className="small faint" style={{ marginTop: 10 }}>
            {accuracy !== null ? `Trainer-Quote: ${accuracy} % richtig` : 'Starte einen Trainer, um deine Quote zu sehen'}
          </div>
        </div>
      </div>

      <div className="section-title">Heute</div>
      <div className="grid cols-3">
        {nextLesson ? (
          <Link to={`/lernen/${nextLesson.moduleId}/${nextLesson.lessonId}`} className="card clickable">
            <div className="row" style={{ marginBottom: 8 }}>
              <IconTile name="learn" tone="gold" size={34} />
              <span className="stat-label">Nächste Lektion</span>
            </div>
            <div style={{ fontWeight: 800 }}>{nextLesson.title}</div>
            <div className="small faint" style={{ marginTop: 3 }}>{nextLesson.moduleTitle}</div>
          </Link>
        ) : (
          <div className="card">
            <div className="row" style={{ marginBottom: 8 }}>
              <IconTile name="learn" tone="green" size={34} />
              <span className="stat-label">Lernpfad</span>
            </div>
            <div style={{ fontWeight: 800 }}>Alle Lektionen abgeschlossen!</div>
            <div className="small faint" style={{ marginTop: 3 }}>Halte dein Wissen mit den Trainern frisch.</div>
          </div>
        )}
        <Link to="/tagesquiz" className="card clickable">
          <div className="row" style={{ marginBottom: 8 }}>
            <IconTile name="sun" tone={dailyDone ? 'green' : 'gold'} size={34} />
            <span className="stat-label">Tages-Quiz</span>
          </div>
          <div style={{ fontWeight: 800 }}>
            {dailyDone ? `Erledigt: ${data.daily?.score}/${data.daily?.total} richtig` : '5 Fragen · +30 XP Bonus'}
          </div>
          <div className="small faint" style={{ marginTop: 3 }}>
            {dailyDone ? 'Morgen warten neue Fragen.' : 'Quer durch alle Module, jeden Tag neu.'}
          </div>
        </Link>
        <Link to="/wiederholen" className="card clickable">
          <div className="row" style={{ marginBottom: 8 }}>
            <IconTile name="repeat" tone={dueReviewCount > 0 ? 'gold' : 'blue'} size={34} />
            <span className="stat-label">Wiederholen</span>
          </div>
          <div style={{ fontWeight: 800 }}>
            {dueReviewCount > 0 ? `${dueReviewCount} Karten fällig` : 'Nichts fällig'}
          </div>
          <div className="small faint" style={{ marginTop: 3 }}>
            {dueReviewCount > 0 ? 'Kurz wiederholen, bevor es verblasst.' : `${data.reviews.length} Karten im Stapel.`}
          </div>
        </Link>
      </div>

      <div className="section-title">Anwenden</div>
      <div className="grid cols-4">
        {quickLinks.map((q) => (
          <Link key={q.to} to={q.to} className="card clickable" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <IconTile name={q.icon} tone={q.tone} />
            <div style={{ fontWeight: 800, fontSize: 14 }}>{q.label}</div>
          </Link>
        ))}
      </div>

      <div className="section-title">Tipp des Tages</div>
      <div className="card" style={{ borderColor: 'rgba(212,175,94,0.35)' }}>
        <p style={{ color: '#d8d5cb' }}>{DAILY_TIPS[dayIndex]}</p>
      </div>

      <div className="section-title">Deine Module</div>
      <div className="grid cols-2">
        {ALL_MODULES.map((m) => {
          const prog = moduleProgress(data, m.id);
          return (
            <Link key={m.id} to={`/lernen/${m.id}`} className="card clickable">
              <div className="row between">
                <div className="row">
                  <span style={{ fontSize: 22 }}>{m.icon}</span>
                  <div>
                    <div style={{ fontWeight: 800 }}>{m.title}</div>
                    <div className="small faint">{m.lessons.length} Lektionen</div>
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
