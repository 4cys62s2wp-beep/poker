import { useState } from 'react';
import { BEGINNER_MISTAKES, EDGE_SPOTS, PRO_PROFILES, PRO_SOURCE_NOTE } from '../content/pros';
import { Icon } from '../components/Icon';

export function ProInsightsPage() {
  const [openId, setOpenId] = useState<string | null>(PRO_PROFILES[0].id);

  return (
    <div>
      <div className="page-header">
        <div className="eyebrow">Von den Besten lernen</div>
        <h1>Pro-Insights</h1>
        <p className="sub">
          Was Fedor Holz, Daniel Negreanu, Doug Polk & Co. wirklich lehren – verdichtet auf die Prinzipien, die dein
          Spiel verändern. Dazu: die teuersten Anfängerfehler aus Profi-Sicht und die Spots, in denen dein Edge liegt.
        </p>
      </div>

      <div className="section-title">Die Köpfe</div>
      <div className="grid" style={{ maxWidth: 780 }}>
        {PRO_PROFILES.map((pro) => {
          const open = openId === pro.id;
          const initials = pro.name.split(' ').map((w) => w[0]).join('').slice(0, 2);
          return (
            <div key={pro.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <button
                onClick={() => setOpenId(open ? null : pro.id)}
                style={{
                  display: 'flex', width: '100%', alignItems: 'center', gap: 14, padding: '16px 18px',
                  background: 'transparent', border: 0, cursor: 'pointer', textAlign: 'left',
                }}
                aria-expanded={open}
              >
                <span
                  style={{
                    width: 46, height: 46, borderRadius: 14, display: 'inline-flex', alignItems: 'center',
                    justifyContent: 'center', fontWeight: 800, fontSize: 17, flexShrink: 0,
                    fontFamily: 'var(--font-display)',
                    background: `${pro.color}22`, color: pro.color, border: `1.5px solid ${pro.color}55`,
                  }}
                >
                  {initials}
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontWeight: 800, fontSize: 17 }}>{pro.name}</span>
                  <span className="small muted" style={{ display: 'block' }}>{pro.tagline}</span>
                </span>
                <span className="faint" style={{ fontSize: 18 }}>{open ? '▾' : '▸'}</span>
              </button>

              {open && (
                <div style={{ padding: '0 18px 18px' }}>
                  <p className="small muted" style={{ marginBottom: 14 }}>{pro.knownFor}</p>
                  {pro.principles.map((pr, i) => (
                    <div key={i} style={{ marginBottom: 14 }}>
                      <div style={{ fontWeight: 800, marginBottom: 3, color: pro.color }}>{pr.title}</div>
                      <p className="small" style={{ color: '#d8d5cb', lineHeight: 1.6 }}>{pr.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="section-title">Die teuersten Anfängerfehler – aus Profi-Sicht</div>
      <div style={{ maxWidth: 780 }}>
        {BEGINNER_MISTAKES.map((m, i) => (
          <div key={i} className="tell-item">
            <span
              style={{
                width: 30, height: 30, borderRadius: '50%', display: 'inline-flex', alignItems: 'center',
                justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0, marginTop: 2,
                background: 'var(--danger-dim)', color: '#eda49f', border: '1px solid rgba(224,92,85,0.35)',
              }}
            >
              {i + 1}
            </span>
            <div style={{ flex: 1 }}>
              <div className="t-name">{m.title}</div>
              <div className="t-desc">{m.text}</div>
              <div className="small faint" style={{ marginTop: 4 }}>Quelle: {m.source}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-title">Wo dein Edge liegt</div>
      <div className="grid cols-2" style={{ maxWidth: 900 }}>
        {EDGE_SPOTS.map((e, i) => (
          <div key={i} className="card">
            <div className="row" style={{ marginBottom: 8 }}>
              <span style={{ color: 'var(--gold-bright)' }}>
                <Icon name="flame" size={18} />
              </span>
              <span style={{ fontWeight: 800 }}>{e.title}</span>
            </div>
            <p className="small" style={{ color: '#d8d5cb', lineHeight: 1.6 }}>{e.text}</p>
          </div>
        ))}
      </div>

      <p className="small faint" style={{ maxWidth: 780, marginTop: 24 }}>{PRO_SOURCE_NOTE}</p>
      <div className="suit-deco">♠ ♥ ♦ ♣</div>
    </div>
  );
}
