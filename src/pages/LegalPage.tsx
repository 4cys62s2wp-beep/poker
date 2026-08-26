/* Rechtliches: Impressum, Datenschutz, Nutzungsbedingungen, Spielerschutz.
   Das Impressum erscheint nur mit hinterlegten Anbieterdaten (legal.json) –
   erfundene Angaben wären schlimmer als keine. */

import { useEffect, useState } from 'react';
import { STR as NAV } from '../i18n/pages/layout';
import { BackLink } from '../components/ui';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/legal';
import { loadLegalConfig, type LegalConfig } from '../lib/legal';
import { usePro } from '../lib/pro/ProProvider';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card" style={{ maxWidth: 720, marginBottom: 14 }}>
      <div style={{ fontWeight: 800, fontSize: 16.5, marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

export function LegalPage() {
  const { lang } = useLang();
  const L = STR[lang];
  const { enabled } = usePro();
  const [legal, setLegal] = useState<LegalConfig | null>(null);

  useEffect(() => {
    let alive = true;
    loadLegalConfig().then((c) => {
      if (alive) setLegal(c);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div>
      <BackLink to="/profil" label={NAV[lang].profile} />
      <div className="page-header">
        <div className="eyebrow">{L.navLegal}</div>
        <h1>{L.title}</h1>
        <p className="sub">{L.sub}</p>
      </div>

      <Section title={L.imprintTitle}>
        {legal ? (
          <>
            <p className="small faint" style={{ marginBottom: 8 }}>{L.imprintNote}</p>
            <p className="small" style={{ lineHeight: 1.75 }}>
              {legal.provider}<br />
              {legal.street}<br />
              {legal.city}<br />
              {legal.country}
            </p>
            <p className="small" style={{ marginTop: 10, lineHeight: 1.75 }}>
              <strong>{L.contact}:</strong><br />
              {legal.email}
              {legal.phone && <><br />{legal.phone}</>}
            </p>
            {legal.represented && (
              <p className="small" style={{ marginTop: 10 }}><strong>{L.represented}:</strong> {legal.represented}</p>
            )}
            {legal.register && (
              <p className="small" style={{ marginTop: 6 }}><strong>{L.register}:</strong> {legal.register}</p>
            )}
            {legal.vatId && (
              <p className="small" style={{ marginTop: 6 }}><strong>{L.vatId}:</strong> {legal.vatId}</p>
            )}
            {legal.smallBusiness && (
              <p className="small faint" style={{ marginTop: 10 }}>{L.smallBusinessNote}</p>
            )}
          </>
        ) : (
          <p className="small muted">{L.imprintMissing}</p>
        )}
      </Section>

      <Section title={L.privacyTitle}>
        <p className="small muted" style={{ marginBottom: 12 }}>{L.privacyIntro}</p>

        <div style={{ fontWeight: 700, marginBottom: 4 }}>{L.privacyLocalTitle}</div>
        <p className="small muted" style={{ marginBottom: 12 }}>{L.privacyLocal}</p>

        <div style={{ fontWeight: 700, marginBottom: 4 }}>{L.privacyAccountTitle}</div>
        <p className="small muted" style={{ marginBottom: 12 }}>{L.privacyAccount}</p>

        {enabled && (
          <>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>{L.privacyPaymentTitle}</div>
            <p className="small muted" style={{ marginBottom: 12 }}>{L.privacyPayment}</p>
          </>
        )}

        <div style={{ fontWeight: 700, marginBottom: 4 }}>{L.privacyHostingTitle}</div>
        <p className="small muted" style={{ marginBottom: 12 }}>{L.privacyHosting}</p>

        <div style={{ fontWeight: 700, marginBottom: 4 }}>{L.privacyRightsTitle}</div>
        <p className="small muted">{L.privacyRights}</p>
      </Section>

      <Section title={L.termsTitle}>
        <p className="small muted" style={{ marginBottom: 12 }}>{L.termsUse}</p>
        {enabled && (
          <>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>{L.termsSubTitle}</div>
            <p className="small muted" style={{ marginBottom: 12 }}>{L.termsSub}</p>

            <div style={{ fontWeight: 700, marginBottom: 4 }}>{L.termsRevokeTitle}</div>
            <p className="small muted" style={{ marginBottom: 6 }}>{L.termsRevoke}</p>
            <p className="small faint" style={{ marginBottom: 12 }}>{L.termsRevokeExpiry}</p>
          </>
        )}
        <div style={{ fontWeight: 700, marginBottom: 4 }}>{L.termsLiabilityTitle}</div>
        <p className="small muted">{L.termsLiability}</p>
      </Section>

      <Section title={L.responsibleTitle}>
        <p className="small muted">{L.responsible}</p>
      </Section>

      <div className="suit-deco">♠ ♥ ♦ ♣</div>
    </div>
  );
}
