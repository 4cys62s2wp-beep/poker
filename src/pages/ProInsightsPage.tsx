import { useState, type CSSProperties } from 'react';
import { STR as NAV } from '../i18n/pages/layout';
import { Zurueck } from '../components/ui';
import { Icon } from '../components/Icon';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/proinsights';
import { STR as PRO_STR } from '../i18n/pages/pro';
import { ProLock } from '../components/pro/ProLock';
import { usePro } from '../lib/pro/ProProvider';

/* Die Kennfarbe der Person tönt die Fläche und zeichnet den Rand — die
   Buchstaben stehen im Textton. Als Schriftfarbe verfehlten diese Farben den
   Kontrast: im hellen Modus 1,85 zu 1. Eine Kennfarbe ist keine Textfarbe. */
function Initialen({ name, farbe }: { name: string; farbe: string }) {
  const buchstaben = name.split(' ').map((w) => w[0]).join('').slice(0, 2);
  return (
    <span className="initialen" style={{ '--kennfarbe': farbe } as CSSProperties}>
      {buchstaben}
    </span>
  );
}

export function ProInsightsPage() {
  const { lang, content } = useLang();
  const L = STR[lang];
  const P = PRO_STR[lang];
  const { fullAccess } = usePro();
  const unlocked = fullAccess;
  const [openId, setOpenId] = useState<string | null>(content.proProfiles[0].id);

  // Gesperrt: Kopf, zwei echte Köpfe als Vorschau und die Sperr-Karte —
  // eine reine Wand überzeugt niemanden (E-098).
  if (!unlocked) {
    return (
      <div>
        <Zurueck to="/lernen" />
        <div className="page-header">
          <h1>{L.title}</h1>
          <p className="sub">{L.sub}</p>
        </div>

        <ProLock
          text={P.lockedInsights(content.proProfiles.length)}
          vorschau={
            <ul className="list-plain vorschau-liste">
              {content.proProfiles.slice(0, 2).map((pro) => (
                <li key={pro.id} className="card row">
                  <Initialen name={pro.name} farbe={pro.color} />
                  <span className="insight-text">
                    <span className="insight-name">{pro.name}</span>
                    <span className="small muted">{pro.tagline}</span>
                  </span>
                </li>
              ))}
            </ul>
          }
        />

        <div className="suit-deco">♠ ♥ ♦ ♣</div>
      </div>
    );
  }

  return (
    <div>
      <Zurueck to="/lernen" />
      <div className="page-header">
        <h1>{L.title}</h1>
        <p className="sub">{L.sub}</p>
      </div>

      <div className="section-title">{L.headsTitle}</div>
      <div className="grid">
        {content.proProfiles.map((pro) => {
          const open = openId === pro.id;
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
                <Initialen name={pro.name} farbe={pro.color} />
                <span className="insight-text">
                  <span className="insight-name">{pro.name}</span>
                  <span className="small muted">{pro.tagline}</span>
                </span>
                <span className="faint" style={{ fontSize: '1.125rem' }}>{open ? '▾' : '▸'}</span>
              </button>

              {open && (
                <div style={{ padding: '0 18px 18px' }}>
                  <p className="small muted" style={{ marginBottom: 14 }}>{pro.knownFor}</p>
                  {pro.principles.map((pr, i) => (
                    <div key={i} style={{ marginBottom: 14 }}>
                      {/* Ohne die Kennfarbe als Schrift: gemessen 2,02 zu 1
                          im hellen Modus. Die Zuordnung zur Person leistet
                          die getönte Kachel daneben. */}
                      <div style={{ fontWeight: 800, marginBottom: 3 }}>{pr.title}</div>
                      <p className="small" style={{ color: 'var(--text-stark)', lineHeight: 1.6 }}>{pr.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="section-title">{L.mistakesTitle}</div>
      <div>
        {content.beginnerMistakes.map((m, i) => (
          <div key={i} className="tell-item">
            <span
              style={{
                width: 30, height: 30, borderRadius: '50%', display: 'inline-flex', alignItems: 'center',
                justifyContent: 'center', fontWeight: 800, fontSize: 'var(--fs-beschriftung)', flexShrink: 0, marginTop: 2,
                background: 'var(--danger-dim)', color: 'var(--danger-lesbar)', border: '1px solid rgba(224,92,85,0.35)',
              }}
            >
              {i + 1}
            </span>
            <div style={{ flex: 1 }}>
              <div className="t-name">{m.title}</div>
              <div className="t-desc">{m.text}</div>
              <div className="small faint" style={{ marginTop: 4 }}>{L.source(m.source)}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-title">{L.edgeTitle}</div>
      <div className="grid cols-2">
        {content.edgeSpots.map((e, i) => (
          <div key={i} className="card">
            <div className="row" style={{ marginBottom: 8 }}>
              <span style={{ color: 'var(--auszeichnung-lesbar)' }}>
                <Icon name="flame" size={18} />
              </span>
              <span style={{ fontWeight: 800 }}>{e.title}</span>
            </div>
            <p className="small" style={{ color: 'var(--text-stark)', lineHeight: 1.6 }}>{e.text}</p>
          </div>
        ))}
      </div>

      <p className="small faint" style={{ marginTop: 24 }}>{content.proSourceNote}</p>
      <div className="suit-deco">♠ ♥ ♦ ♣</div>
    </div>
  );
}
