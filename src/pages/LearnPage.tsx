import { useMemo, useState } from 'react';
import { STR as NAV } from '../i18n/pages/layout';
import { BackLink } from '../components/ui';
import { Link } from 'react-router-dom';
import { moduleProgress, useAppState } from '../state/AppState';
import { useLang, levelLabel } from '../i18n';
import { STR } from '../i18n/pages/learn';
import { Icon, IconTile, type IconName } from '../components/Icon';
import { usePro } from '../lib/pro/ProProvider';
import { isFreeModule } from '../lib/pro/plan';

const LEVEL_PILL: Record<string, string> = {
  Einsteiger: 'ok',
  Fortgeschritten: 'info',
  Profi: 'gold',
};

interface SearchHit {
  moduleId: string;
  moduleTitle: string;
  lessonId: string;
  lessonTitle: string;
  /** Textauszug rund um den Treffer. */
  snippet: string;
}

function makeSnippet(text: string, query: string): string {
  const idx = text.toLowerCase().indexOf(query);
  if (idx < 0) return '';
  const start = Math.max(0, idx - 40);
  const end = Math.min(text.length, idx + query.length + 60);
  return `${start > 0 ? '…' : ''}${text.slice(start, end).replace(/\n/g, ' ')}${end < text.length ? '…' : ''}`;
}

export function LearnPage() {
  const { data, dueReviewCount } = useAppState();
  const { lang, content } = useLang();
  const L = STR[lang];
  const { fullAccess } = usePro();
  /* Ohne Monetarisierung, mit Abo oder in der Testphase ist alles offen –
     dann sieht die Seite exakt so aus wie bisher. */
  const unlocked = fullAccess;
  const [query, setQuery] = useState('');

  const hits = useMemo<SearchHit[]>(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 3) return [];
    const results: SearchHit[] = [];
    for (const m of content.modules) {
      for (const l of m.lessons) {
        let snippet = '';
        if (l.title.toLowerCase().includes(q)) {
          snippet = l.intro;
        } else if (l.intro.toLowerCase().includes(q)) {
          snippet = makeSnippet(l.intro, q);
        } else {
          for (const sec of l.sections) {
            if (sec.heading.toLowerCase().includes(q)) {
              snippet = L.sectionSnippet(sec.heading);
              break;
            }
            if (sec.body.toLowerCase().includes(q)) {
              snippet = makeSnippet(sec.body.replace(/\*\*/g, ''), q);
              break;
            }
          }
        }
        if (snippet) {
          results.push({
            moduleId: m.id,
            moduleTitle: m.title,
            lessonId: l.id,
            lessonTitle: l.title,
            snippet,
          });
        }
        if (results.length >= 12) return results;
      }
    }
    return results;
  }, [query, content.modules, L]);

  const searching = query.trim().length >= 3;

  const heute = new Date().toISOString().slice(0, 10);
  const quizOffen = data.daily?.date !== heute;

  const uebungen: Array<{
    to: string; icon: IconName; tone: 'gold' | 'green' | 'blue' | 'red' | 'violet';
    title: string; sub: string; badge?: string;
  }> = [
    { to: '/lernen/trainer', icon: 'trainer', tone: 'gold', title: L.trainerTitle, sub: L.trainerSub },
    {
      to: '/lernen/wiederholen', icon: 'repeat', tone: 'blue',
      title: L.reviewTitle, sub: L.reviewSub,
      badge: dueReviewCount > 0 ? L.reviewDue(dueReviewCount) : undefined,
    },
    {
      to: '/lernen/tagesquiz', icon: 'check', tone: 'green',
      title: L.quizTitle, sub: L.quizSub,
      badge: quizOffen ? L.quizOpen : undefined,
    },
    { to: '/lernen/uebungstisch', icon: 'play', tone: 'red', title: L.practiceTitle, sub: L.practiceSub },
    { to: '/lernen/statistik', icon: 'chart', tone: 'violet', title: L.styleTitle, sub: L.styleSub },
  ];

  return (
    <div>
      <BackLink to="/" label={NAV[lang].start} />
      <div className="page-header">
        <div className="eyebrow">{L.eyebrow}</div>
        <h1>{L.title}</h1>
        <p className="sub">
          {L.sub}
        </p>
      </div>

      <input
        className="search-input"
        style={{ maxWidth: 480, marginBottom: 20 }}
        placeholder={L.searchPlaceholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {searching && (
        <div style={{ maxWidth: 720, marginBottom: 24 }}>
          {hits.length === 0 && <p className="muted">{L.noHits}</p>}
          {hits.map((h) => (
            <Link key={h.lessonId} to={`/lernen/${h.moduleId}/${h.lessonId}`} className="card clickable" style={{ display: 'block', marginBottom: 10, padding: 14 }}>
              <div className="row between wrap">
                <span style={{ fontWeight: 800 }}>{h.lessonTitle}</span>
                <span className="pill">{h.moduleTitle}</span>
              </div>
              <p className="small muted" style={{ marginTop: 4 }}>{h.snippet}</p>
            </Link>
          ))}
        </div>
      )}

      {!searching && (
        <>
        {/* Üben und festigen.
            Dieser Block hat lange gefehlt, und das Fehlen war unsichtbar:
            Trainer, Wiederholen, Tages-Quiz, Übungstisch und Spielstil-Analyse
            standen nur in der Seitenleiste – die unter 920 px ausgeblendet
            ist. Auf dem Handy waren sie damit über den Lernbereich gar nicht
            erreichbar. Ein Durchlauf über alle Seiten hat es aufgedeckt. */}
        <div className="section-title">{L.practiceGroupTitle}</div>
        <div className="grid cols-2" style={{ marginBottom: 'var(--sp-5)' }}>
          {uebungen.map((u) => (
            <Link key={u.to} to={u.to} className="card clickable">
              <div className="row" style={{ alignItems: 'flex-start' }}>
                <IconTile name={u.icon} tone={u.tone} />
                <div style={{ minWidth: 0 }}>
                  <div className="row" style={{ gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 'var(--fw-bold)' }}>{u.title}</span>
                    {u.badge && <span className="pill gold">{u.badge}</span>}
                  </div>
                  <div className="small muted" style={{ marginTop: 3 }}>{u.sub}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Link to="/lernen/pros" className="card clickable" style={{ display: 'block', marginBottom: 16, borderColor: 'rgba(212,175,94,0.35)' }}>
          <div className="row between wrap">
            <div>
              <div style={{ fontWeight: 800, fontSize: 16.5 }}>{L.proTitle}</div>
              <div className="small muted" style={{ marginTop: 3 }}>
                {L.proSub}
              </div>
            </div>
            <span className="pill gold">{L.newPill}</span>
          </div>
        </Link>
        <div className="grid cols-2">
          {content.modules.map((m, idx) => {
            const prog = moduleProgress(data, m.id);
            const done = Math.round(prog * m.lessons.length);
            const locked = !unlocked && !isFreeModule(m.id);
            const levelPill = (
              <span className={`pill ${LEVEL_PILL[m.level] ?? ''}`}>{levelLabel(m.level, lang)}</span>
            );
            return (
              <Link key={m.id} to={`/lernen/${m.id}`} className="card clickable">
                <div className="row between" style={{ marginBottom: 8 }}>
                  <span className="pill">{L.moduleN(idx + 1)}</span>
                  {locked ? (
                    <span className="row" style={{ gap: 6 }}>
                      <span className="pill gold" title={L.lockedHint} aria-label={L.lockedHint}>
                        <Icon name="lock" size={14} />
                      </span>
                      {levelPill}
                    </span>
                  ) : (
                    levelPill
                  )}
                </div>
                <div className="row" style={{ alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 30 }}>{m.icon}</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 17 }}>{m.title}</div>
                    <div className="small muted" style={{ marginTop: 3 }}>
                      {m.subtitle}
                    </div>
                  </div>
                </div>
                <div className="progressbar" style={{ margin: '14px 0 8px' }}>
                  <div style={{ width: `${prog * 100}%` }} />
                </div>
                <div className="small faint">
                  {L.doneLine(done, m.lessons.length)}
                </div>
              </Link>
            );
          })}
        </div>
        </>
      )}
    </div>
  );
}
