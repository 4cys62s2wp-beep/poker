import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { HandMatrix } from '../../components/HandMatrix';
import { BB_DEFENSE_VS_BTN, RFI_CHARTS } from '../../content/ranges';
import { expandRangeSpec, rangePercent } from '../../lib/poker/ranges';

type Tab = 'UTG' | 'HJ' | 'CO' | 'BTN' | 'SB' | 'BBDEF';

export function RangeViewer() {
  const [tab, setTab] = useState<Tab>('UTG');

  const view = useMemo(() => {
    if (tab === 'BBDEF') {
      const threeBet = expandRangeSpec(BB_DEFENSE_VS_BTN.threeBet);
      const callRaw = expandRangeSpec(BB_DEFENSE_VS_BTN.call);
      const call = new Set([...callRaw].filter((l) => !threeBet.has(l)));
      return {
        title: 'Big Blind vs. Button-Open (2,5bb)',
        description: BB_DEFENSE_VS_BTN.description,
        raise: threeBet,
        call,
        pct: rangePercent(new Set([...threeBet, ...call])),
        raiseLabel: '3-Bet',
      };
    }
    const chart = RFI_CHARTS.find((c) => c.position === tab)!;
    const raise = expandRangeSpec(chart.raise);
    return {
      title: `Open-Raise (RFI) aus ${chart.position}`,
      description: chart.description,
      raise,
      call: undefined as Set<string> | undefined,
      pct: rangePercent(raise),
      raiseLabel: 'Raise',
    };
  }, [tab]);

  return (
    <div>
      <Link to="/tools" className="pill" style={{ display: 'inline-flex', marginBottom: 14 }}>
        ← Tools
      </Link>
      <div className="page-header">
        <h1>Range-Charts</h1>
        <p className="sub">
          6-max Cash Game, 100bb effektiv, vereinfacht für die Praxis. Charts sind dein Startpunkt – mit Reads darfst
          du abweichen.
        </p>
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
          <span className="pill gold">{Math.round(view.pct * 100)} % aller Hände</span>
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
          Lesehilfe: Diagonale = Paare, oberhalb = suited (s), unterhalb = offsuit (o).
        </p>
      </div>
    </div>
  );
}
