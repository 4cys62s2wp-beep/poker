import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TELLS, TELL_CATEGORIES, type TellCategory } from '../../content/tells';

function Stars({ n }: { n: number }) {
  return (
    <span className="stars" title={`Zuverlässigkeit: ${n} von 5`}>
      {'★'.repeat(n)}
      <span className="off">{'★'.repeat(5 - n)}</span>
    </span>
  );
}

export function TellsPage() {
  const [category, setCategory] = useState<TellCategory | 'alle'>('alle');

  const filtered = TELLS.filter((t) => category === 'alle' || t.category === category);

  return (
    <div>
      <Link to="/tools" className="pill" style={{ display: 'inline-flex', marginBottom: 14 }}>
        ← Tools
      </Link>
      <div className="page-header">
        <div className="eyebrow">Live-Poker lesen</div>
        <h1>🫣 Tells & Reads</h1>
        <p className="sub">
          Was Gesten, Einsätze und Timing wirklich verraten – mit ehrlicher Bewertung, wie verlässlich jedes Signal
          ist. Fokus: lockere Runden mit Freizeitspielern.
        </p>
      </div>

      <div className="row wrap" style={{ marginBottom: 18 }}>
        <button className={`btn sm${category === 'alle' ? ' primary' : ''}`} onClick={() => setCategory('alle')}>
          Alle
        </button>
        {TELL_CATEGORIES.map((c) => (
          <button
            key={c.id}
            className={`btn sm${category === c.id ? ' primary' : ''}`}
            onClick={() => setCategory(c.id)}
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 760 }}>
        {filtered.map((t) => (
          <div key={t.name} className="tell-item">
            <span className="t-ico">{t.icon}</span>
            <div style={{ flex: 1 }}>
              <div className="row between wrap">
                <span className="t-name">{t.name}</span>
                <Stars n={t.reliability} />
              </div>
              <div className="t-read">→ {t.read}</div>
              <div className="t-desc">{t.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ maxWidth: 760, marginTop: 22 }}>
        <div style={{ fontWeight: 800, marginBottom: 6 }}>⚠️ Die wichtigste Regel zum Schluss</div>
        <p className="small muted">
          Tells sind das Sahnehäubchen, nicht der Kuchen. Solide Ranges, Position und Pot Odds gewinnen das Geld –
          Tells kippen nur die knappen Entscheidungen. Wer wegen eines „sicheren Reads“ die Mathematik ignoriert,
          bezahlt Lehrgeld.
        </p>
      </div>
    </div>
  );
}
