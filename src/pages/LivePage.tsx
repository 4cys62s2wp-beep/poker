/* Bereich „Live spielen“ – die mittlere Ebene zwischen Hub und Detail.
   ====================================================================

   Hier war vorher nichts: Live-Coach, Übungstisch und Pokerabend hingen
   nebeneinander in der Seitenleiste, ohne dass erkennbar war, dass sie
   zusammengehören und wofür jedes gedacht ist. Ein Anfänger konnte nicht
   wissen, ob er „Live-Coach“ oder „Übungstisch“ braucht – die Namen sagen
   es nicht.

   Diese Seite beantwortet genau diese Frage. */

import { Link } from 'react-router-dom';
import { Icon, type IconName } from '../components/Icon';
import { PageHeader, StatPill } from '../components/ui';
import { useAppState } from '../state/AppState';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/live';
import { computeStats } from '../lib/poker/stats';

export function LivePage() {
  const { data } = useAppState();
  const { lang } = useLang();
  const L = STR[lang];
  const stats = computeStats(data.handFacts);

  const entries: Array<{
    to: string; icon: IconName; title: string; body: string; when: string; accent: string;
  }> = [
    {
      to: '/live/coach',
      icon: 'coach',
      title: L.coachTitle,
      body: L.coachBody,
      when: L.coachWhen,
      accent: 'var(--accent-live)',
    },
    {
      to: '/live/tisch',
      icon: 'table',
      title: L.tableTitle,
      body: L.tableBody,
      when: L.tableWhen,
      accent: 'var(--gold)',
    },
    {
      to: '/live/uebungstisch',
      icon: 'play',
      title: L.practiceTitle,
      body: L.practiceBody,
      when: L.practiceWhen,
      accent: 'var(--info)',
    },
    {
      to: '/live/statistik',
      icon: 'chart',
      title: L.statsTitle,
      body: L.statsBody,
      when: L.statsWhen,
      accent: 'var(--violet)',
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

      {data.handsPlayed > 0 && (
        <div
          className="card row"
          style={{ gap: 'var(--sp-5)', padding: 'var(--sp-4) var(--sp-5)', marginBottom: 'var(--sp-5)' }}
        >
          <StatPill value={data.handsPlayed} label={L.handsLabel} accent="live" />
          <StatPill value={data.handsWon} label={L.wonLabel} accent="neutral" />
          {stats.vpip.value !== null && (
            <StatPill value={`${Math.round(stats.vpip.value)} %`} label={L.vpipLabel} accent="neutral" />
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
            {/* „Wann brauche ich das?“ ist bei diesen vier die eigentliche
                Frage – die Namen allein beantworten sie nicht. */}
            <p
              className="small"
              style={{ margin: 0, marginTop: 'var(--sp-1)', color: e.accent }}
            >
              {e.when}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
