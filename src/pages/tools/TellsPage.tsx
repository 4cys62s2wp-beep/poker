import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { TellCategory } from '../../content/tells';
import { useLang } from '../../i18n';
import { STR } from '../../i18n/pages/tellspage';

function Stars({ n }: { n: number }) {
  const { lang } = useLang();
  const L = STR[lang];
  return (
    <span className="stars" title={L.reliability(n)}>
      {'★'.repeat(n)}
      <span className="off">{'★'.repeat(5 - n)}</span>
    </span>
  );
}

export function TellsPage() {
  const { lang, content } = useLang();
  const L = STR[lang];
  const [category, setCategory] = useState<TellCategory | 'alle'>('alle');

  const filtered = content.tells.filter((t) => category === 'alle' || t.category === category);

  return (
    <div>
      <Link to="/nachschlagen" className="pill" style={{ display: 'inline-flex', marginBottom: 14 }}>
        {L.backToTools}
      </Link>
      <div className="page-header">
        <div className="eyebrow">{L.eyebrow}</div>
        <h1>{L.title}</h1>
        <p className="sub">{L.sub}</p>
      </div>

      <div className="row wrap" style={{ marginBottom: 18 }}>
        <button className={`btn sm${category === 'alle' ? ' primary' : ''}`} onClick={() => setCategory('alle')}>
          {L.all}
        </button>
        {content.tellCategories.map((c) => (
          <button
            key={c.id}
            className={`btn sm${category === c.id ? ' primary' : ''}`}
            onClick={() => setCategory(c.id)}
          >
            {c.label}
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
        <div style={{ fontWeight: 800, marginBottom: 6 }}>{L.ruleTitle}</div>
        <p className="small muted">{L.ruleText}</p>
      </div>
    </div>
  );
}
