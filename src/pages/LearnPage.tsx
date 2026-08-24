import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { moduleProgress, useAppState } from '../state/AppState';
import { useLang, levelLabel } from '../i18n';
import { STR } from '../i18n/pages/learn';

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
  const { data } = useAppState();
  const { lang, content } = useLang();
  const L = STR[lang];
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

  return (
    <div>
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
        <Link to="/pros" className="card clickable" style={{ display: 'block', marginBottom: 16, borderColor: 'rgba(212,175,94,0.35)' }}>
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
            return (
              <Link key={m.id} to={`/lernen/${m.id}`} className="card clickable">
                <div className="row between" style={{ marginBottom: 8 }}>
                  <span className="pill">{L.moduleN(idx + 1)}</span>
                  <span className={`pill ${LEVEL_PILL[m.level] ?? ''}`}>{levelLabel(m.level, lang)}</span>
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
