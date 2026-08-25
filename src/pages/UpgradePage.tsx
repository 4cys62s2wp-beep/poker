/* Upgrade-Seite (/pro): Preis, Nutzen, Vergleich, FAQ.
   Ist die Monetarisierung nicht konfiguriert, existiert die Seite nicht –
   dann leitet sie auf die Startseite um. */

import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/pro';
import { STR as LEGAL } from '../i18n/pages/legal';
import { usePro } from '../lib/pro/ProProvider';
import { useCloud } from '../lib/cloud/CloudProvider';

export function UpgradePage() {
  const { lang } = useLang();
  const L = STR[lang];
  const G = LEGAL[lang];
  const { config, enabled, pro, trialActive, trialDaysLeft } = usePro();
  const cloud = useCloud();
  const [annual, setAnnual] = useState(true);

  if (!enabled) return <Navigate to="/" replace />;

  const hasAnnual = !!config.checkoutAnnualUrl && !!config.priceAnnual;
  /** Monatsäquivalent des Jahrespreises – reine Zusatzangabe neben dem Endpreis. */
  const monthlyEquivalent = (() => {
    const n = parseFloat(config.priceAnnual.replace(/[^\d,.]/g, '').replace(',', '.'));
    if (!isFinite(n) || n <= 0) return '';
    const per = n / 12;
    const currency = config.priceAnnual.replace(/[\d\s,.]/g, '') || '€';
    return lang === 'de'
      ? `${per.toFixed(2).replace('.', ',')} ${currency}`
      : `${currency}${per.toFixed(2)}`;
  })();
  const showAnnual = annual && hasAnnual;
  const checkoutUrl = showAnnual ? config.checkoutAnnualUrl : config.checkoutMonthlyUrl;
  // E-Mail vorbefüllen, damit Zahlung und Konto sicher zusammenfinden.
  const checkoutHref = cloud.user?.email
    ? `${checkoutUrl}${checkoutUrl.includes('?') ? '&' : '?'}prefilled_email=${encodeURIComponent(cloud.user.email)}`
    : checkoutUrl;

  return (
    <div>
      <div className="page-header">
        <div className="eyebrow">{L.eyebrow}</div>
        <h1>{pro ? L.activeTitle : L.title}</h1>
        <p className="sub">{pro ? L.activeSub : L.sub}</p>
      </div>

      {pro ? (
        <div className="card" style={{ maxWidth: 560, marginBottom: 22, borderColor: 'rgba(88,179,104,0.32)' }}>
          <div className="row" style={{ marginBottom: 10 }}>
            <span className="pill ok">✓ {L.proBadge}</span>
          </div>
          <div className="row wrap">
            <a className="btn sm" href={config.portalUrl} target="_blank" rel="noopener noreferrer">
              {L.manage}
            </a>
            <Link className="btn sm ghost" to="/kuendigen">{L.cancelLink}</Link>
          </div>
        </div>
      ) : (
        <>
          {trialActive && (
            <div className="card" style={{ maxWidth: 560, marginBottom: 22, borderColor: 'rgba(212,175,94,0.34)' }}>
              <div style={{ fontWeight: 800, marginBottom: 5 }}>{L.trialTitle(trialDaysLeft)}</div>
              <p className="small muted">{L.trialSub}</p>
            </div>
          )}

          {/* Preisblock */}
          <div className="card" style={{ maxWidth: 560, marginBottom: 22 }}>
            {hasAnnual && (
              <div className="row" style={{ marginBottom: 16, gap: 8 }}>
                <button
                  className={`btn sm${!showAnnual ? ' primary' : ''}`}
                  onClick={() => setAnnual(false)}
                  aria-pressed={!showAnnual}
                >
                  {L.monthly}
                </button>
                <button
                  className={`btn sm${showAnnual ? ' primary' : ''}`}
                  onClick={() => setAnnual(true)}
                  aria-pressed={showAnnual}
                >
                  {L.annual}
                  {config.annualNote && (
                    /* Auf dem aktiven (goldenen) Knopf wäre eine goldene Plakette
                       unlesbar – dort dunkel auf hell, sonst hell auf dunkel. */
                    <span
                      className={showAnnual ? 'pill' : 'pill gold'}
                      style={
                        showAnnual
                          ? { marginLeft: 7, background: 'rgba(20,16,6,0.22)', color: '#2b2205', borderColor: 'rgba(20,16,6,0.28)' }
                          : { marginLeft: 7 }
                      }
                    >
                      {config.annualNote}
                    </span>
                  )}
                </button>
              </div>
            )}

            <div className="row" style={{ alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
              <span style={{ fontFamily: 'var(--font-display, inherit)', fontSize: 40, fontWeight: 800, letterSpacing: '-0.5px' }}>
                {showAnnual ? config.priceAnnual : config.priceMonthly}
              </span>
              <span className="muted">{showAnnual ? L.perYear : L.perMonth}</span>
            </div>
            {showAnnual && monthlyEquivalent && (
              <div className="small faint" style={{ marginBottom: 4 }}>{L.perMonthEquivalent(monthlyEquivalent)}</div>
            )}
            <div className="small faint">{L.vatNote}</div>

            {/* § 312j BGB: wesentliche Merkmale, Gesamtpreis, Laufzeit und
                Kündigungsbedingungen unmittelbar vor dem Bestell-Button. */}
            <div
              style={{
                marginTop: 16, padding: '12px 14px', borderRadius: 12,
                background: 'rgba(236,233,223,0.04)', border: '1px solid var(--border)',
              }}
            >
              <div className="stat-label" style={{ marginBottom: 5 }}>{L.checkoutSummaryTitle}</div>
              <p className="small muted" style={{ margin: 0 }}>
                {L.checkoutSummary(
                  showAnnual ? config.priceAnnual : config.priceMonthly,
                  showAnnual ? L.periodAnnual : L.periodMonthly,
                )}
              </p>
            </div>

            <a
              className="btn primary"
              href={checkoutHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{ justifyContent: 'center', marginTop: 14, width: '100%' }}
            >
              {trialActive ? L.ctaTrial : L.cta}
            </a>
            <p className="small faint" style={{ marginTop: 11, textAlign: 'center' }}>{L.reassure}</p>
            <p className="small faint" style={{ marginTop: 5, textAlign: 'center' }}>{L.securePay}</p>
          </div>
        </>
      )}

      {/* Nutzen */}
      <div className="section-title">{L.benefitsTitle}</div>
      <div className="grid cols-2">
        {L.benefits.map((b) => (
          <div key={b.t} className="card" style={{ padding: '15px 16px' }}>
            <div className="row" style={{ alignItems: 'flex-start', gap: 10 }}>
              <span style={{ color: 'var(--gold-bright)', marginTop: 2 }}>
                <Icon name="check" size={17} />
              </span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15.5 }}>{b.t}</div>
                <div className="small muted" style={{ marginTop: 3 }}>{b.d}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Vergleich */}
      <div className="section-title">{L.compareTitle}</div>
      <div className="table-wrap compact">
        <table className="data" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>{L.compareFeature}</th>
              <th style={{ textAlign: 'right' }}>{L.compareFree}</th>
              <th style={{ textAlign: 'right' }}>{L.comparePro}</th>
            </tr>
          </thead>
          <tbody>
            {L.rows.map((r) => (
              <tr key={r[0]}>
                <td>{r[0]}</td>
                <td style={{ textAlign: 'right', color: 'var(--text-dim)' }}>{r[1]}</td>
                <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--gold-bright)' }}>{r[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FAQ */}
      <div className="section-title">{L.faqTitle}</div>
      <div style={{ maxWidth: 640 }}>
        {L.faq.map((f) => (
          <details key={f.q} className="card" style={{ marginBottom: 9, padding: '13px 16px' }}>
            <summary style={{ fontWeight: 700, cursor: 'pointer' }}>{f.q}</summary>
            <p className="small muted" style={{ marginTop: 8 }}>{f.a}</p>
          </details>
        ))}
      </div>

      <p className="small faint" style={{ marginTop: 20 }}>
        <Link to="/rechtliches">{G.navLegal}</Link>
        {config.supportEmail && <> · {config.supportEmail}</>}
      </p>

      <div className="suit-deco">♠ ♥ ♦ ♣</div>
    </div>
  );
}
