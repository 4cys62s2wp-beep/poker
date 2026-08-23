import { useMemo, useState } from 'react';
import glossary from '../content/glossary';
import type { GlossaryCategory } from '../content/types';

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
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<GlossaryCategory | 'Alle'>('Alle');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return glossary.filter((e) => {
      if (category !== 'Alle' && e.category !== category) return false;
      if (!q) return true;
      return e.term.toLowerCase().includes(q) || e.definition.toLowerCase().includes(q);
    });
  }, [query, category]);

  return (
    <div>
      <div className="page-header">
        <div className="eyebrow">Nachschlagen</div>
        <h1>Glossar</h1>
        <p className="sub">{glossary.length} Pokerbegriffe von A bis Z – damit du am Tisch jede Ansage verstehst.</p>
      </div>

      <input
        className="search-input"
        style={{ maxWidth: 480, marginBottom: 14 }}
        placeholder="Begriff suchen …"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="row wrap" style={{ marginBottom: 18 }}>
        {CATEGORIES.map((c) => (
          <button key={c} className={`btn sm${category === c ? ' primary' : ''}`} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 760 }}>
        {filtered.length === 0 && <p className="muted">Kein Begriff gefunden.</p>}
        {filtered.map((e) => (
          <div key={e.term} className="glossary-item">
            <div className="row wrap between">
              <span className="term">{e.term}</span>
              <span className="pill">{e.category}</span>
            </div>
            <div className="def">{e.definition}</div>
            {e.related && e.related.length > 0 && (
              <div className="small faint" style={{ marginTop: 5 }}>
                Siehe auch: {e.related.join(' · ')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
