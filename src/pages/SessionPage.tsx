/* Bereich „Live-Session" – die mittlere Ebene zwischen Hub und Detail.
   ====================================================================

   Wer hier landet, sitzt am echten Tisch. Die Frage ist deshalb nie „was ist
   das?", sondern „wann brauche ich das?" – und darauf antwortet jede Karte
   in einer eigenen Zeile.

   Warum große Karten und nicht das dichte Raster von „Nachschlagen": Es sind
   vier Einträge, und drei davon haben einen klaren Zeitpunkt im Ablauf eines
   Abends (vorher – währenddessen – danach). Diese Reihenfolge ist die
   eigentliche Information. Ein Raster würde sie verstecken. */

import { Link } from 'react-router-dom';
import { Icon, type IconName } from '../components/Icon';
import { PageHeader, StatPill } from '../components/ui';
import { useAppState } from '../state/AppState';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/session';

export function SessionPage() {
  const { data } = useAppState();
  const { lang } = useLang();
  const L = STR[lang];
  const nf = lang === 'de' ? 'de-DE' : 'en-GB';

  const sessions = data.sessions.length;
  // Bilanz = Auszahlung minus Einsatz, über alle erfassten Sitzungen.
  const bilanz = data.sessions.reduce((s, e) => s + (e.cashOut - e.buyIn), 0);

  /* Die Reihenfolge ist der Ablauf eines Abends, nicht eine Rangfolge nach
     Wichtigkeit: einteilen → auszahlen festlegen → spielen → festhalten. */
  const entries: Array<{
    to: string; icon: IconName; title: string; body: string; when: string; accent: string;
  }> = [
    /* Zuerst der Abend selbst: Chipverteilung, Blindstruktur und Uhr in
       einem Weg. Die einzelnen Rechner darunter bleiben — wer nur schnell
       etwas nachrechnen will, braucht keinen ganzen Abend. */
    {
      to: '/session/live/einrichten', icon: 'table',
      title: L.abendTitle, body: L.abendBody, when: L.abendWhen,
      accent: 'var(--akzent)',
    },
    /* Danach das, was von den Abenden bleibt. Es steht direkt hinter dem
       Abend selbst, weil man es am Tag danach sucht — und weil der Weg zu
       einer Person nur über diese Liste führt. */
    {
      to: '/session/abende', icon: 'crown',
      title: L.abendeTitle, body: L.abendeBody, when: L.abendeWhen,
      accent: 'var(--akzent-dim)',
    },
    {
      to: '/session/chips', icon: 'chip',
      title: L.chipsTitle, body: L.chipsBody, when: L.chipsWhen,
      accent: 'var(--danger-lesbar)',
    },
    {
      to: '/session/auszahlung', icon: 'crown',
      title: L.payoutTitle, body: L.payoutBody, when: L.payoutWhen,
      accent: 'var(--auszeichnung)',
    },
    /* Hier standen der Ein-Geräte-Tisch und der Online-Tisch. Beide sind
       aus dem inhaltlichen Rahmen gefallen: Sie sind gespieltes Poker, nicht
       verwaltetes (E-030). Sie stehen mit Vorbehalt in BACKLOG.md und kommen
       nur über eine ausdrückliche Entscheidung über die Altersstufe zurück,
       nicht nebenbei. */
    {
      to: '/session/bankroll', icon: 'notes',
      title: L.bankrollTitle, body: L.bankrollBody, when: L.bankrollWhen,
      accent: 'var(--ok)',
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow={L.eyebrow}
        title={L.title}
        sub={L.sub}
        backTo="/"
        backLabel={L.backHome}
      />

      {(sessions > 0 || data.handsPlayed > 0) && (
        <div
          className="card row wrap"
          style={{ gap: 'var(--sp-5)', padding: 'var(--sp-4) var(--sp-5)', marginBottom: 'var(--sp-5)' }}
        >
          {sessions > 0 && (
            <>
              <StatPill value={sessions} label={L.sessionsLabel} accent="live" />
              <StatPill
                value={bilanz.toLocaleString(nf, { maximumFractionDigits: 0 })}
                label={L.resultLabel}
                accent={bilanz >= 0 ? 'learn' : 'neutral'}
              />
            </>
          )}
          {data.handsPlayed > 0 && (
            <StatPill value={data.handsPlayed} label={L.handsLabel} accent="neutral" />
          )}
        </div>
      )}

      <div
        style={{
          display: 'grid', gap: 'var(--sp-3)',
          gridTemplateColumns: 'repeat(auto-fill, minmax(285px, 1fr))',
        }}
      >
        {entries.map((e) => (
          <Link
            key={e.to}
            to={e.to}
            className="card"
            style={{
              display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)',
              padding: 'var(--sp-5)', textDecoration: 'none', color: 'inherit',
              minHeight: 'var(--touch-min)',
            }}
          >
            <span className="row" style={{ gap: 'var(--sp-3)' }}>
              <span style={{ color: e.accent }}><Icon name={e.icon} size={21} /></span>
              <span style={{ fontWeight: 'var(--fw-bold)', fontSize: 'var(--fs-h3)' }}>{e.title}</span>
            </span>
            <p className="small muted" style={{ margin: 0 }}>{e.body}</p>
            <p className="small" style={{ margin: 0, marginTop: 'var(--sp-1)', color: e.accent }}>
              {e.when}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
