/* Spielstil-Analyse.
   ==================

   Zeigt dieselben Kennzahlen, mit denen Pokerspieler ihr eigenes Spiel
   beurteilen – und, anders als vergleichbare Apps, wie belastbar sie gerade
   sind. Über neun Hände ist ein VPIP von 33 % reines Rauschen; das als
   Diagnose zu zeigen, würde in einer LERN-App genau das Falsche beibringen.

   Die Rechnung steht vollständig in src/lib/poker/stats.ts und ist dort mit
   33 Tests belegt. Hier wird nur dargestellt. */

import { Link } from 'react-router-dom';
import { EmptyState, PageHeader, StatPill } from '../components/ui';
import { useAppState } from '../state/AppState';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/stats';
import { STR as NAV } from '../i18n/pages/layout';
import {
  assessStyle,
  computeStats,
  confidenceOf,
  hintsFor,
  judge,
  MIN_HANDS_FOR_STYLE,
  statByKey,
  TARGETS,
  topHint,
  type Metric,
  type Verdict,
} from '../lib/poker/stats';

const VERDICT_COLOR: Record<Verdict, string> = {
  good: 'var(--ok)',
  low: 'var(--info)',
  high: 'var(--danger)',
  unknown: 'var(--text-faint)',
};

export function StatsPage() {
  const { data } = useAppState();
  const { lang } = useLang();
  const L = STR[lang];
  const NV = NAV[lang];

  const stats = computeStats(data.handFacts);
  const style = assessStyle(stats);
  const hint = topHint(stats);
  const fmt = (n: number) => n.toLocaleString(lang === 'de' ? 'de-DE' : 'en-GB');

  if (stats.hands === 0) {
    return (
      <div>
        <PageHeader title={L.title} backTo="/lernen" backLabel={NV.navLearn} />
        <EmptyState
          icon="chart"
          title={L.emptyTitle}
          body={L.emptyBody}
          actionLabel={L.emptyCta}
          actionTo="/lernen/uebungstisch"
        />
      </div>
    );
  }

  const weak = stats.hands < MIN_HANDS_FOR_STYLE;

  return (
    <div>
      {/* Der Rückweg nennt das ZIEL, nicht die eigene Seite – und die
          Bereichszeile steht darüber, nicht als dritte Wiederholung
          desselben Wortes. */}
      {/* Keine Bereichszeile: Der Rückweg nennt den Bereich schon. Zweimal
          dasselbe Wort übereinander liest sich wie ein Fehler. */}
      <PageHeader
        title={L.title}
        sub={L.sub}
        backTo="/lernen"
        backLabel={NV.navLearn}
      />

      {/* ── Umfang und Belastbarkeit ──────────────────────────────────── */}
      <div className="card" style={{ marginBottom: 'var(--sp-4)', padding: 'var(--sp-4) var(--sp-5)' }}>
        <div className="row between wrap" style={{ gap: 'var(--sp-3)' }}>
          <span style={{ fontWeight: 'var(--fw-medium)' }}>{L.handsPlayed(stats.hands)}</span>
          <span
            className="pill"
            style={{ color: weak ? 'var(--danger)' : 'var(--ok)' }}
          >
            {L.confidence[confidenceOf(stats.hands)]}
          </span>
        </div>
        {weak && (
          <p className="small muted" style={{ marginTop: 'var(--sp-3)', marginBottom: 0 }}>
            {L.weakWarning(MIN_HANDS_FOR_STYLE)}
          </p>
        )}
        <p className="small faint" style={{ marginTop: 'var(--sp-3)', marginBottom: 0 }}>
          {L.onlyPracticeTable}
        </p>
      </div>

      {/* ── Spielstil-Diagramm ────────────────────────────────────────── */}
      <h2 className="section-title">{L.styleTitle}</h2>
      <div className="card" style={{ marginBottom: 'var(--sp-5)', padding: 'var(--sp-5)' }}>
        <StyleChart
          looseness={style.looseness}
          aggression={style.aggression}
          reliable={style.reliable}
          labels={{
            tight: L.axisTight, tightSub: L.axisTightSub,
            loose: L.axisLoose, looseSub: L.axisLooseSub,
            aggressive: L.axisAggressive, aggressiveSub: L.axisAggressiveSub,
            passive: L.axisPassive, passiveSub: L.axisPassiveSub,
          }}
        />
        <div style={{ marginTop: 'var(--sp-4)', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-h2)', fontWeight: 'var(--fw-bold)' }}>
            {style.reliable ? L.styleNames[style.style] : L.styleUnknown}
          </div>
          <p className="small muted" style={{ marginTop: 'var(--sp-2)', maxWidth: 440, marginInline: 'auto' }}>
            {style.reliable ? L.styleDesc[style.style] : L.styleUnknownBody(MIN_HANDS_FOR_STYLE)}
          </p>
        </div>
      </div>

      {/* ── Der eine Hinweis ──────────────────────────────────────────── */}
      <h2 className="section-title">{hint ? L.hintTitle : L.noHintTitle}</h2>
      <div
        className="card"
        style={{
          marginBottom: 'var(--sp-5)', padding: 'var(--sp-5)',
          borderColor: hint ? 'var(--gold-dim)' : 'var(--border)',
        }}
      >
        {hint ? (
          <>
            <div className="row" style={{ gap: 'var(--sp-2)', marginBottom: 'var(--sp-2)' }}>
              <span className="pill" style={{ color: VERDICT_COLOR[hint.verdict] }}>
                {L.metricNames[hint.key]} · {L.verdictLabel[hint.verdict]}
              </span>
            </div>
            <p style={{ margin: 0 }}>
              {L.hints[hint.key][hint.verdict === 'low' ? 'low' : 'high']}
            </p>
          </>
        ) : (
          <p className="small muted" style={{ margin: 0 }}>{L.noHintBody}</p>
        )}
      </div>

      {/* ── Kennzahlen ────────────────────────────────────────────────── */}
      <h2 className="section-title">{L.metricsTitle}</h2>
      <div
        style={{
          display: 'grid', gap: 'var(--sp-3)', marginBottom: 'var(--sp-5)',
          gridTemplateColumns: 'repeat(auto-fill, minmax(255px, 1fr))',
        }}
      >
        {hintsFor(stats).map((h) => (
          <MetricCard
            key={h.key}
            metric={statByKey(stats, h.key)}
            name={L.metricNames[h.key]}
            explain={L.metricExplain[h.key]}
            target={L.target(TARGETS[h.key].min, TARGETS[h.key].max)}
            targetRange={TARGETS[h.key]}
            verdict={judge(statByKey(stats, h.key), TARGETS[h.key])}
            verdictLabel={L.verdictLabel}
            noData={L.noData}
            ofOpportunities={L.ofOpportunities}
          />
        ))}
      </div>

      {/* ── Fold-Verhalten ────────────────────────────────────────────── */}
      <h2 className="section-title">{L.foldTitle}</h2>
      <p className="small muted" style={{ marginTop: 0, marginBottom: 'var(--sp-3)' }}>{L.foldSub}</p>
      <div className="card" style={{ marginBottom: 'var(--sp-5)', padding: 'var(--sp-5)' }}>
        {(['preflop', 'flop', 'turn', 'river'] as const).map((street) => {
          const m = stats.foldBy[street];
          return (
            <div key={street} style={{ marginBottom: 'var(--sp-3)' }}>
              <div className="row between" style={{ marginBottom: 'var(--sp-1)' }}>
                <span className="small">{L.streetNames[street]}</span>
                <span className="small faint" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {m.value === null
                    ? L.noData
                    : `${Math.round(m.value)} % · ${L.ofOpportunities(m.opportunities)}`}
                </span>
              </div>
              <div className="progressbar">
                <div style={{ width: `${m.value ?? 0}%`, background: 'var(--accent-live)' }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Bilanz ────────────────────────────────────────────────────── */}
      <h2 className="section-title">{L.balanceTitle}</h2>
      <div className="card row" style={{ gap: 'var(--sp-5)', padding: 'var(--sp-4) var(--sp-5)' }}>
        <StatPill value={fmt(stats.hands)} label={L.handsLabel} accent="neutral" />
        <StatPill
          value={stats.winRate.value === null ? '—' : `${Math.round(stats.winRate.value)} %`}
          label={L.wonLabel}
          accent="live"
        />
        <StatPill
          value={`${stats.netChips >= 0 ? '+' : ''}${fmt(stats.netChips)}`}
          label={L.chipsLabel}
          accent={stats.netChips >= 0 ? 'live' : 'neutral'}
        />
      </div>

      <p className="small faint" style={{ marginTop: 'var(--sp-5)' }}>
        <Link to="/lernen">← {NV.navLearn}</Link>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Das Diagramm
 * ------------------------------------------------------------------ */

/**
 * Zwei Achsen, vier Ecken, ein Punkt.
 *
 * Bewusst als Raute (Tight ↔ Loose waagerecht, Aggressiv ↔ Passiv senkrecht)
 * statt als Balkenpaar: Der Spielertyp ergibt sich erst aus BEIDEN Werten
 * zusammen, und eine Position im Raum zeigt das unmittelbar.
 *
 * Jede Ecke trägt eine Zeile Erklärung. „Tight" allein hilft niemandem, der
 * den Begriff nicht kennt – und genau die sind die Zielgruppe.
 */
function StyleChart({
  looseness, aggression, reliable, labels,
}: {
  looseness: number;
  aggression: number;
  reliable: boolean;
  labels: Record<string, string>;
}) {
  const S = 240;      // Kantenlänge des Zeichenbereichs
  const C = S / 2;    // Mittelpunkt
  const MARKER = 18;  // Außenradius der Markierung
  /* Die Achsen enden ein Stück vor dem Rand, damit die Markierung bei einem
     Extremwert (ganz loose, ganz aggressiv) vollständig im Bild bleibt.
     Ohne diesen Abzug wird genau der interessanteste Fall angeschnitten. */
  const R = S / 2 - MARKER;

  // 0..1 → Bildkoordinaten. Aggression zeigt nach OBEN, deshalb invertiert.
  const x = C + (looseness - 0.5) * 2 * R;
  const y = C - (aggression - 0.5) * 2 * R;

  const label = (text: string, sub: string, style: React.CSSProperties) => (
    <div style={{ position: 'absolute', textAlign: 'center', ...style }}>
      <div style={{ fontSize: 'var(--fs-small)', fontWeight: 'var(--fw-bold)' }}>{text}</div>
      <div style={{ fontSize: 'var(--fs-tiny)', color: 'var(--text-faint)' }}>{sub}</div>
    </div>
  );

  return (
    <div style={{ position: 'relative', maxWidth: 340, margin: '0 auto', paddingBlock: 'var(--sp-6)' }}>
      {label(labels.aggressive, labels.aggressiveSub, { top: 0, left: 0, right: 0 })}
      {label(labels.passive, labels.passiveSub, { bottom: 0, left: 0, right: 0 })}
      {label(labels.tight, labels.tightSub, { top: '50%', left: 0, transform: 'translateY(-50%)', width: 74 })}
      {label(labels.loose, labels.looseSub, { top: '50%', right: 0, transform: 'translateY(-50%)', width: 74 })}

      <svg
        viewBox={`0 0 ${S} ${S}`}
        style={{ display: 'block', width: '100%', maxWidth: S, margin: '0 auto' }}
        role="img"
        aria-label={`${labels.tight}/${labels.loose}, ${labels.passive}/${labels.aggressive}`}
      >
        {/* Ringe als Orientierung, von außen nach innen blasser */}
        {[1, 0.66, 0.33].map((f) => (
          <polygon
            key={f}
            points={`${C},${C - R * f} ${C + R * f},${C} ${C},${C + R * f} ${C - R * f},${C}`}
            fill="none"
            stroke="var(--border)"
            strokeWidth="1"
          />
        ))}
        <line x1={C - R} y1={C} x2={C + R} y2={C} stroke="var(--border)" strokeWidth="1" />
        <line x1={C} y1={C - R} x2={C} y2={C + R} stroke="var(--border)" strokeWidth="1" />

        {/* Die eigene Position. Ohne belastbare Datenmenge blass und ohne
            harte Kante – die Anzeige soll nicht sicherer wirken, als sie ist. */}
        <circle
          cx={x} cy={y} r={reliable ? 9 : 7}
          fill={reliable ? 'var(--gold)' : 'var(--text-faint)'}
          opacity={reliable ? 1 : 0.45}
        />
        <circle
          cx={x} cy={y} r={reliable ? 16 : 13}
          fill="none"
          stroke={reliable ? 'var(--gold)' : 'var(--text-faint)'}
          strokeWidth="1.5"
          opacity={reliable ? 0.35 : 0.2}
        />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Kennzahl-Kachel
 * ------------------------------------------------------------------ */

function MetricCard({
  metric, name, explain, target, targetRange, verdict, verdictLabel, noData, ofOpportunities,
}: {
  metric: Metric;
  name: string;
  explain: string;
  target: string;
  targetRange: { min: number; max: number };
  verdict: Verdict;
  verdictLabel: Record<Verdict, string>;
  noData: string;
  ofOpportunities: (n: number) => string;
}) {
  const color = VERDICT_COLOR[verdict];
  return (
    <div className="card" style={{ padding: 'var(--sp-4) var(--sp-5)' }}>
      <div className="small faint" style={{ marginBottom: 'var(--sp-1)' }}>{name}</div>

      <div className="row" style={{ alignItems: 'baseline', gap: 'var(--sp-2)' }}>
        <span
          style={{
            fontSize: 30, fontWeight: 'var(--fw-light)', color,
            fontVariantNumeric: 'tabular-nums', lineHeight: 1,
          }}
        >
          {metric.value === null ? '—' : Math.round(metric.value)}
        </span>
        {metric.value !== null && <span className="small faint">%</span>}
        <span className="small faint" style={{ marginLeft: 'auto' }}>
          {metric.opportunities > 0 ? ofOpportunities(metric.opportunities) : noData}
        </span>
      </div>

      {/* Zielbereich als Band, der eigene Wert als Strich darauf. Eine Zahl
          allein sagt nicht, ob sie gut ist – das Band schon. */}
      <div
        style={{
          position: 'relative', height: 6, borderRadius: 'var(--radius-pill)',
          background: 'rgba(236,233,223,0.07)', marginTop: 'var(--sp-3)',
        }}
      >
        <div
          style={{
            position: 'absolute', top: 0, bottom: 0,
            left: `${targetRange.min}%`, width: `${targetRange.max - targetRange.min}%`,
            background: 'var(--ok-dim)', borderRadius: 'var(--radius-pill)',
          }}
        />
        {metric.value !== null && (
          <div
            style={{
              position: 'absolute', top: -3, bottom: -3,
              left: `calc(${Math.max(0, Math.min(100, metric.value))}% - 1px)`,
              width: 2, background: color, borderRadius: 'var(--radius-pill)',
            }}
          />
        )}
      </div>

      <div className="row between" style={{ marginTop: 'var(--sp-2)' }}>
        <span className="small faint">{target}</span>
        <span className="small" style={{ color }}>{verdictLabel[verdict]}</span>
      </div>

      <p className="small muted" style={{ marginTop: 'var(--sp-3)', marginBottom: 0 }}>{explain}</p>
    </div>
  );
}
