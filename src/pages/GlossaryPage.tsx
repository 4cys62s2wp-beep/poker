import { useMemo, useState } from 'react';
import type { GlossaryCategory } from '../content/types';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/glossarypage';

/* Kategorie-Schlüssel bleiben in beiden Sprachen deutsch (GlossaryCategory);
   angezeigt wird das übersetzte Label aus STR[lang].categoryLabels. */
const CATEGORIES: Array<GlossaryCategory | 'Alle'> = [
  'Alle',
  'Grundlagen',
  'Aktionen',
  'Mathematik',
  'Strategie',
  'Online',
  'Live',
  'Turnier',
  'Slang',
];

export function GlossaryPage() {
  const { lang, content } = useLang();
  const L = STR[lang];
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<GlossaryCategory | 'Alle'>('Alle');

  const glossary = content.glossary;
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return glossary.filter((e) => {
      if (category !== 'Alle' && e.category !== category) return false;
      if (!q) return true;
      return e.term.toLowerCase().includes(q) || e.definition.toLowerCase().includes(q);
    });
  }, [glossary, query, category]);

  return (
    <div>
      <div className="page-header">
        <div className="eyebrow">{L.eyebrow}</div>
        <h1>{L.title}</h1>
        <p className="sub">{L.sub(glossary.length)}</p>
      </div>

      <input
        className="search-input"
        style={{ maxWidth: 480, marginBottom: 14 }}
        placeholder={L.searchPlaceholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="row wrap" style={{ marginBottom: 18 }}>
        {CATEGORIES.map((c) => (
          <button key={c} className={`btn sm${category === c ? ' primary' : ''}`} onClick={() => setCategory(c)}>
            {L.categoryLabels[c]}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 760 }}>
        {filtered.length === 0 && <p className="muted">{L.noResults}</p>}
        {filtered.map((e) => (
          <div key={e.term} className="glossary-item">
            <div className="row wrap between">
              <span className="term">{e.term}</span>
              <span className="pill">{L.categoryLabels[e.category]}</span>
            </div>
            <div className="def">{e.definition}</div>
            {e.related && e.related.length > 0 && (
              <div className="small faint" style={{ marginTop: 5 }}>
                {L.seeAlso} {e.related.join(' · ')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
