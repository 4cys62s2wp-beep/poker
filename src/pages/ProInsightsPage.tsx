import { useState } from 'react';
import { STR as NAV } from '../i18n/pages/layout';
import { BackLink } from '../components/ui';
import { Icon } from '../components/Icon';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/proinsights';
import { STR as PRO_STR } from '../i18n/pages/pro';
import { ProLock } from '../components/pro/ProLock';
import { usePro } from '../lib/pro/ProProvider';

export function ProInsightsPage() {
  const { lang, content } = useLang();
  const L = STR[lang];
  const P = PRO_STR[lang];
  const { fullAccess } = usePro();
  const unlocked = fullAccess;
  const [openId, setOpenId] = useState<string | null>(content.proProfiles[0].id);

  // Gesperrt: Kopf und ein echter Vorgeschmack (erster Kopf) bleiben sichtbar –
  // eine reine Wand überzeugt niemanden.
  if (!unlocked) {
    const teaser = content.proProfiles[0];
    const teaserInitials = teaser.name.split(' ').map((w) => w[0]).join('').slice(0, 2);
    return (
      <div>
        <BackLink to="/lernen" label={NAV[lang].navLearn} />
      <div className="page-header">
          <div className="eyebrow">{L.eyebrow}</div>
          <h1>{L.title}</h1>
          <p className="sub">{L.sub}</p>
        </div>

        <div className="section-title">{L.headsTitle}</div>
        <div className="grid" style={{ maxWidth: 780 }}>
          <div className="card">
            <div className="row">
              <span
                style={{
                  width: 46, height: 46, borderRadius: 14, display: 'inline-flex', alignItems: 'center',
                  justifyContent: 'center', fontWeight: 800, fontSize: 17, flexShrink: 0,
                  fontFamily: 'var(--font-display)',
                  /* Die Farbe der Person tönt die Fläche und zeichnet den
                     Rand — die Buchstaben stehen im Textton. Als Schriftfarbe
                     verfehlten diese Farben den Kontrast: im hellen Modus
                     1,85 zu 1. Eine Kennfarbe ist keine Textfarbe. */
                  background: `${teaser.color}22`, color: 'var(--text)', border: `1.5px solid ${teaser.color}55`,
                }}
              >
                {teaserInitials}
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontWeight: 800, fontSize: 17 }}>{teaser.name}</span>
                <span className="small muted" style={{ display: 'block' }}>{teaser.tagline}</span>
              </span>
            </div>
          </div>

          <ProLock text={P.lockedGeneric} />
        </div>

        <div className="suit-deco">♠ ♥ ♦ ♣</div>
      </div>
    );
  }

  return (
    <div>
      <BackLink to="/lernen" label={NAV[lang].navLearn} />
      <div className="page-header">
        <div className="eyebrow">{L.eyebrow}</div>
        <h1>{L.title}</h1>
        <p className="sub">{L.sub}</p>
      </div>

      <div className="section-title">{L.headsTitle}</div>
      <div className="grid" style={{ maxWidth: 780 }}>
        {content.proProfiles.map((pro) => {
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
                    /* Siehe oben: Kennfarbe tönt, Textton schreibt. */
                    background: `${pro.color}22`, color: 'var(--text)', border: `1.5px solid ${pro.color}55`,
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
      <div style={{ maxWidth: 780 }}>
        {content.beginnerMistakes.map((m, i) => (
          <div key={i} className="tell-item">
            <span
              style={{
                width: 30, height: 30, borderRadius: '50%', display: 'inline-flex', alignItems: 'center',
                justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0, marginTop: 2,
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
      <div className="grid cols-2" style={{ maxWidth: 900 }}>
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

      <p className="small faint" style={{ maxWidth: 780, marginTop: 24 }}>{content.proSourceNote}</p>
      <div className="suit-deco">♠ ♥ ♦ ♣</div>
    </div>
  );
}
