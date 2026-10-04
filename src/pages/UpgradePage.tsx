/* Upgrade-Seite (/pro): Preis, Nutzen, Vergleich, FAQ.
   Ist die Monetarisierung nicht konfiguriert, existiert die Seite nicht –
   dann leitet sie auf die Startseite um, aber erst, **wenn die Konfiguration
   geladen ist** (E-099): Davor ist `enabled` immer falsch, und jeder direkte
   Aufruf — auch der Rücksprung von der Zahlungsseite — landete auf der
   Startseite. Der Rücksprung trägt `?kauf=ok` oder `?kauf=abbruch`. */

import { useEffect, useMemo, useState } from 'react';
import { zahlAusEingabe } from '../lib/eingabe/zahl';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/pro';
import { STR as LEGAL } from '../i18n/pages/legal';
import { usePro } from '../lib/pro/ProProvider';
import { useCloud } from '../lib/cloud/CloudProvider';
import { APPLE_MANAGE_SUBSCRIPTIONS_URL } from '../lib/payments';
import { vergleichsZahlen } from '../lib/pro/vergleich';
import { kaufStand } from '../lib/pro/kauf';
import { TRAINER } from '../lib/trainerliste';

export function UpgradePage() {
  const { lang, content } = useLang();
  const L = STR[lang];
  const G = LEGAL[lang];
  const { config, enabled, bereit, pro, trialActive, trialDaysLeft, cancelRoute, startCheckout, manageBilling } = usePro();
  const cloud = useCloud();
  const [suche] = useSearchParams();
  const kauf = suche.get('kauf');
  /* Firebase wird erst hier geladen, nicht beim Start der App:
     die Upgrade-Seite ist einer der wenigen Orte, an denen ein Konto
     überhaupt eine Rolle spielt (E-043). */
  const aktiviere = cloud.aktiviere;
  useEffect(() => aktiviere(), [aktiviere]);
  const [annual, setAnnual] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  /* Nach dem Kauf schreibt der Webhook die Berechtigung; sie kommt über die
     Beobachtung an und schaltet `pro` von selbst. Bis dahin zählt eine Uhr,
     nur um nach einer Weile zu sagen, dass es länger dauert. */
  const [seit] = useState(() => Date.now());
  const [jetzt, setJetzt] = useState(seit);
  useEffect(() => {
    if (kauf !== 'ok' || pro) return undefined;
    const takt = setInterval(() => setJetzt(Date.now()), 5000);
    return () => clearInterval(takt);
  }, [kauf, pro]);
  const stand = kaufStand(kauf, pro, jetzt - seit);

  const zahlen = useMemo(
    () => vergleichsZahlen({
      module: content.modules,
      trainerInListe: TRAINER.length,
      szenarien: content.scenarios.length,
      profile: content.proProfiles.length,
    }),
    [content],
  );

  /* Ladezustand: Kopf und ein Platzhalter in der Höhe des Preisblocks, kein
     Umleiten und kein Sprung. */
  if (!bereit) {
    return (
      <div>
        <div className="page-header">
          <h1>{L.title}</h1>
          <p className="sub">{L.sub}</p>
        </div>
        <div className="card pro-laedt" role="status">
          <span className="muted">{L.laedtSeite}</span>
        </div>
      </div>
    );
  }
  if (!enabled) return <Navigate to="/" replace />;

  const hasAnnual = config.hasAnnual;
  /** Monatsäquivalent des Jahrespreises – reine Zusatzangabe neben dem Endpreis. */
  const monthlyEquivalent = (() => {
    const n = zahlAusEingabe(config.priceAnnual.replace(/[^\d,.]/g, ''));
    if (n === null || n <= 0) return '';
    const per = n / 12;
    const currency = config.priceAnnual.replace(/[\d\s,.]/g, '') || '€';
    return lang === 'de'
      ? `${per.toFixed(2).replace('.', ',')} ${currency}`
      : `${currency}${per.toFixed(2)}`;
  })();
  const showAnnual = annual && hasAnnual;
  /* Solange eine Zahlung bestätigt wird, steht kein Kaufknopf da: Wer ihn
     jetzt noch einmal drückt, zahlt zweimal. */
  const kaufOffen = !pro && stand !== 'wartet' && stand !== 'dauertLange';

  /* Der Kauf läuft nicht mehr über eine Adresse im Bundle, sondern über die
     Zahlungs-Abstraktion: Im Browser erzeugt der Server eine kurzlebige
     Stripe-Sitzung, in der iOS-Hülle öffnet das Betriebssystem seinen
     eigenen Dialog. Die Seite erfährt nicht, welcher Weg genommen wurde –
     genau das verlangt App-Store-Richtlinie 3.1.1. */
  async function buy() {
    if (busy) return;
    setBusy(true);
    setError('');
    const res = await startCheckout(showAnnual ? 'annual' : 'monthly');
    if (res.kind === 'redirect') {
      window.location.href = res.url;
      return; // Seite wird verlassen, busy bleibt bewusst gesetzt
    }
    if (res.kind === 'error' && res.reason !== 'cancelled') {
      setError(res.reason === 'not-signed-in' ? L.errorSignIn : L.errorCheckout);
    }
    setBusy(false);
  }

  async function manage() {
    if (busy) return;
    setBusy(true);
    const res = await manageBilling();
    if (res.kind === 'redirect' || res.kind === 'system-settings') {
      window.open(res.url, '_blank', 'noopener,noreferrer');
    } else {
      setError(L.errorCheckout);
    }
    setBusy(false);
  }

  return (
    <div>
      <div className="page-header">
        <h1>{stand === 'aktiv' ? L.kaufAktivTitel : pro ? L.activeTitle : L.title}</h1>
        <p className="sub">{stand === 'aktiv' ? L.kaufAktivText : pro ? L.activeSub : L.sub}</p>
      </div>

      {(stand === 'wartet' || stand === 'dauertLange') && (
        <div className="card pro-karte" role="status">
          <div className="pro-karte-titel">{stand === 'wartet' ? L.kaufWartetTitel : L.kaufLangeTitel}</div>
          <p className="small muted">{stand === 'wartet' ? L.kaufWartetText : L.kaufLangeText}</p>
          {stand === 'dauertLange' && config.supportEmail && <p className="small faint">{config.supportEmail}</p>}
        </div>
      )}

      {stand === 'abbruch' && !pro && (
        <div className="card pro-karte" role="status">
          <div className="pro-karte-titel">{L.kaufAbbruchTitel}</div>
          <p className="small muted">{L.kaufAbbruchText}</p>
        </div>
      )}

      {pro && (
        <div className="card pro-karte gruen">
          <div className="row pro-karte-zeile">
            <span className="pill ok"><Icon name="check" size={13} /> {L.proBadge}</span>
          </div>
          <div className="row wrap">
            {stand === 'aktiv' && <Link className="btn sm primary" to="/lernen">{L.weiterLernen}</Link>}
            <button className="btn sm" type="button" disabled={busy} onClick={() => void manage()}>
              {cancelRoute === 'native' ? L.manageNative : L.manage}
            </button>
            <Link className="btn sm ghost" to="/kuendigen">{L.cancelLink}</Link>
          </div>
        </div>
      )}

      {!pro && trialActive && (
        <div className="card pro-karte gold">
          <div className="pro-karte-titel">{L.trialTitle(trialDaysLeft)}</div>
          <p className="small muted">{L.trialSub}</p>
        </div>
      )}

      {kaufOffen && (
        <div className="card pro-karte">
          {hasAnnual && (
            <div className="segmented pro-wahl" role="radiogroup" aria-label={L.title}>
              <button type="button" role="radio" aria-checked={!showAnnual} className={!showAnnual ? 'on' : ''} onClick={() => setAnnual(false)}>
                {L.monthly}
              </button>
              <button type="button" role="radio" aria-checked={showAnnual} className={showAnnual ? 'on' : ''} onClick={() => setAnnual(true)}>
                {L.annual}
              </button>
            </div>
          )}

          <div className="row pro-preis">
            <span className="betrag">{showAnnual ? config.priceAnnual : config.priceMonthly}</span>
            <span className="muted">{showAnnual ? L.perYear : L.perMonth}</span>
            {showAnnual && config.annualNote && <span className="pill gold">{config.annualNote}</span>}
          </div>
          {showAnnual && monthlyEquivalent && (
            <div className="small faint">{L.perMonthEquivalent(monthlyEquivalent)}</div>
          )}
          <div className="small faint">{L.vatNote}</div>

          {/* § 312j BGB: wesentliche Merkmale, Gesamtpreis, Laufzeit und
              Kündigungsbedingungen unmittelbar vor dem Bestell-Button. */}
          <div className="pro-bestellung">
            <div className="stat-label">{L.checkoutSummaryTitle}</div>
            <p className="small muted">
              {L.checkoutSummary(
                showAnnual ? config.priceAnnual : config.priceMonthly,
                showAnnual ? L.periodAnnual : L.periodMonthly,
              )}
            </p>
          </div>

          <button className="btn primary block" type="button" disabled={busy} onClick={() => void buy()}>
            {busy ? L.ctaBusy : trialActive ? L.ctaTrial : L.cta}
          </button>
          {error && <div className="feedback-box bad pro-fehler">{error}</div>}
          <p className="small faint pro-klein">{L.reassure}</p>
          <p className="small faint pro-klein">{L.securePay}</p>
        </div>
      )}

      {/* Nutzen */}
      <div className="section-title">{L.benefitsTitle}</div>
      <div className="grid cols-2">
        {L.benefits(zahlen).map((b) => (
          <div key={b.t} className="card pro-nutzen">
            <span className="haken"><Icon name="check" size={17} /></span>
            <div>
              <div className="titel">{b.t}</div>
              <div className="small muted">{b.d}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Vergleich */}
      <div className="section-title">{L.compareTitle}</div>
      <div className="table-wrap compact">
        <table className="data pro-vergleich">
          <thead>
            <tr>
              <th>{L.compareFeature}</th>
              <th>{L.compareFree}</th>
              <th>{L.comparePro}</th>
            </tr>
          </thead>
          <tbody>
            {L.rows(zahlen).map((r) => (
              <tr key={r[0]}>
                <td>{r[0]}</td>
                <td className="frei">{r[1]}</td>
                <td className="pro">{r[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FAQ */}
      <div className="section-title">{L.faqTitle}</div>
      <div>
        {L.faq.map((f) => (
          <details key={f.q} className="card pro-frage">
            <summary>{f.q}</summary>
            <p className="small muted">{f.a}</p>
          </details>
        ))}
      </div>

      <p className="small faint pro-fuss">
        <Link to="/rechtliches">{G.navLegal}</Link>
        {config.supportEmail && <> · {config.supportEmail}</>}
      </p>

      <div className="suit-deco">♠ ♥ ♦ ♣</div>
    </div>
  );
}
