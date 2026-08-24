import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { HandMatrix } from '../../components/HandMatrix';
import { BB_DEFENSE_VS_BTN, RFI_CHARTS } from '../../content/ranges';
import { expandRangeSpec, rangePercent } from '../../lib/poker/ranges';
import { useLang } from '../../i18n';
import { STR } from '../../i18n/pages/rangeviewer';

type Tab = 'UTG' | 'HJ' | 'CO' | 'BTN' | 'SB' | 'BBDEF';

export function RangeViewer() {
  const { lang } = useLang();
  const L = STR[lang];
  const [tab, setTab] = useState<Tab>('UTG');

  const view = useMemo(() => {
    if (tab === 'BBDEF') {
      const threeBet = expandRangeSpec(BB_DEFENSE_VS_BTN.threeBet);
      const callRaw = expandRangeSpec(BB_DEFENSE_VS_BTN.call);
      const call = new Set([...callRaw].filter((l) => !threeBet.has(l)));
      return {
        title: L.bbdefTitle,
        description: L.desc.BBDEF,
        raise: threeBet,
        call,
        pct: rangePercent(new Set([...threeBet, ...call])),
        raiseLabel: '3-Bet',
      };
    }
    const chart = RFI_CHARTS.find((c) => c.position === tab)!;
    const raise = expandRangeSpec(chart.raise);
    return {
      title: L.rfiTitle(chart.position),
      description: L.desc[chart.position],
      raise,
      call: undefined as Set<string> | undefined,
      pct: rangePercent(raise),
      raiseLabel: 'Raise',
    };
  }, [tab, L]);

  return (
    <div>
      <Link to="/tools" className="pill" style={{ display: 'inline-flex', marginBottom: 14 }}>
        {L.back}
      </Link>
      <div className="page-header">
        <h1>{L.title}</h1>
        <p className="sub">{L.sub}</p>
      </div>

      <div className="row wrap" style={{ marginBottom: 18 }}>
        {(['UTG', 'HJ', 'CO', 'BTN', 'SB'] as Tab[]).map((p) => (
          <button key={p} className={`btn sm${tab === p ? ' primary' : ''}`} onClick={() => setTab(p)}>
            {p}
          </button>
        ))}
        <button className={`btn sm${tab === 'BBDEF' ? ' primary' : ''}`} onClick={() => setTab('BBDEF')}>
          BB vs. BTN
        </button>
      </div>

      <div className="card" style={{ maxWidth: 720 }}>
        <div className="row between wrap" style={{ marginBottom: 6 }}>
          <h2 style={{ fontSize: 18, fontWeight: 750 }}>{view.title}</h2>
          <span className="pill gold">{L.pctOfHands(Math.round(view.pct * 100))}</span>
        </div>
        <p className="small muted" style={{ marginBottom: 16 }}>{view.description}</p>

        <div className="range-legend" style={{ marginBottom: 10 }}>
          <span>
            <span className="sw" style={{ background: 'linear-gradient(150deg,#c9a44a,#a37f2e)' }} />
            {view.raiseLabel}
          </span>
          {view.call && (
            <span>
              <span className="sw" style={{ background: 'linear-gradient(150deg,#3f9a5c,#2e7a46)' }} />
              Call
            </span>
          )}
          <span>
            <span className="sw" style={{ background: 'var(--bg-elev)', border: '1px solid var(--border)' }} />
            Fold
          </span>
        </div>

        <HandMatrix raise={view.raise} call={view.call} />

        <p className="small faint" style={{ marginTop: 14 }}>
          {L.readingHelp}
        </p>
      </div>
    </div>
  );
}
