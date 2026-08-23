import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { HandMatrix } from '../../components/HandMatrix';
import { CardsRow } from '../../components/PlayingCard';
import { RFI_CHARTS } from '../../content/ranges';
import { combosForLabel, expandRangeSpec } from '../../lib/poker/ranges';
import { equityVsRandomHands } from '../../lib/poker/equity';

const RFI = RFI_CHARTS.map((c) => ({ position: c.position, set: expandRangeSpec(c.raise) }));
const PREMIUM = expandRangeSpec(['QQ+', 'AKs', 'AKo']);
const STRONG = expandRangeSpec(['99+', 'AQs+', 'AQo+', 'AJs', 'ATs', 'KQs']);
const PAIRS = expandRangeSpec(['22+']);
const PLAYABLE = expandRangeSpec([
  '22+', 'A2s+', 'K2s+', 'Q4s+', 'J7s+', 'T7s+', '96s+', '86s+', '75s+', '64s+', '54s',
  'A2o+', 'K9o+', 'Q9o+', 'J9o+', 'T8o+', '98o',
]);

interface HandDetail {
  eq1: number;
  eq3: number;
  eq5: number;
}

function classify(label: string): { name: string; pill: string; desc: string } {
  if (PREMIUM.has(label)) {
    return {
      name: 'Premium',
      pill: 'gold',
      desc: 'Absolute Top-Hand: aus jeder Position erhöhen und Re-Raises nicht scheuen.',
    };
  }
  if (STRONG.has(label)) {
    return {
      name: 'Stark',
      pill: 'ok',
      desc: 'Klarer Open-Raise aus fast allen Positionen; gegen einen Raise meist ein Call.',
    };
  }
  if (PAIRS.has(label)) {
    return {
      name: 'Set-Mining-Paar',
      pill: 'info',
      desc: 'Kleines bis mittleres Paar: billig mitspielen und auf den Drilling (Set) hoffen.',
    };
  }
  if (PLAYABLE.has(label)) {
    return {
      name: 'Spielbar (spät)',
      pill: 'violet',
      desc: 'Nur aus späten Positionen oder billig spielen – in Position deutlich mehr wert.',
    };
  }
  return {
    name: 'Schwach',
    pill: 'danger',
    desc: 'Langfristig ein Verlustgeschäft – fast immer folden, auch wenn sie „hübsch aussieht“.',
  };
}

export function HandExplorer() {
  const [selected, setSelected] = useState<string>('AKs');
  const cache = useRef(new Map<string, HandDetail>());
  const [, force] = useState(0);

  const detail = useMemo(() => {
    if (cache.current.has(selected)) return cache.current.get(selected)!;
    const combo = combosForLabel(selected)[0];
    const hero = [combo[0], combo[1]];
    const d: HandDetail = {
      eq1: equityVsRandomHands(hero, [], 1, 5000),
      eq3: equityVsRandomHands(hero, [], 3, 4000),
      eq5: equityVsRandomHands(hero, [], 5, 4000),
    };
    cache.current.set(selected, d);
    return d;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const openPositions = RFI.filter((r) => r.set.has(selected)).map((r) => r.position);
  const cls = classify(selected);
  const combo = combosForLabel(selected)[0];

  const vsRaise = PREMIUM.has(selected)
    ? 'Re-Raise (3-Bet) auf ca. 3x den ursprünglichen Raise.'
    : STRONG.has(selected)
      ? 'Call – und nach dem Flop ehrlich weiterspielen.'
      : PAIRS.has(selected)
        ? 'Call nur, wenn die Stacks mindestens 15-mal so groß sind wie der Raise (Set-Mining).'
        : 'Fold – gegen eine Erhöhung brauchst du deutlich mehr Substanz.';

  return (
    <div>
      <Link to="/tools" className="pill" style={{ display: 'inline-flex', marginBottom: 14 }}>
        ← Tools
      </Link>
      <div className="page-header">
        <div className="eyebrow">Alle 169 Starthände</div>
        <h1>🔍 Starthand-Explorer</h1>
        <p className="sub">
          Tippe eine Hand in der Matrix an: Gewinnwahrscheinlichkeit gegen 1, 3 und 5 Gegner, Einordnung und konkrete
          Empfehlung, wie du sie spielst.
        </p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'minmax(280px, 640px)', gap: 18 }}>
        <div className="card">
          <HandMatrix
            raise={new Set([selected])}
            highlight={selected}
            onCellClick={(label) => {
              setSelected(label);
              force((x) => x + 1);
            }}
          />
          <p className="small faint" style={{ marginTop: 12 }}>
            Diagonale = Paare · oben rechts = suited · unten links = offsuit
          </p>
        </div>

        <div className="card">
          <div className="row between wrap" style={{ marginBottom: 12 }}>
            <div className="row">
              <span className="big-stat">{selected}</span>
              <CardsRow cards={[combo[0], combo[1]]} size="sm" />
            </div>
            <span className={`pill ${cls.pill}`}>{cls.name}</span>
          </div>
          <p className="small muted" style={{ marginBottom: 16 }}>{cls.desc}</p>

          <div className="stat-label" style={{ marginBottom: 8 }}>Gewinnwahrscheinlichkeit (alle Karten kommen)</div>
          {[
            { n: 1, eq: detail.eq1, label: 'gegen 1 Gegner' },
            { n: 3, eq: detail.eq3, label: 'gegen 3 Gegner' },
            { n: 5, eq: detail.eq5, label: 'gegen 5 Gegner' },
          ].map((row) => (
            <div key={row.n} style={{ marginBottom: 10 }}>
              <div className="row between" style={{ marginBottom: 4 }}>
                <span className="small muted">{row.label}</span>
                <strong>{Math.round(row.eq * 100)} %</strong>
              </div>
              <div className="progressbar">
                <div style={{ width: `${row.eq * 100}%` }} />
              </div>
            </div>
          ))}
          <p className="small faint" style={{ marginBottom: 16 }}>
            Monte-Carlo-Simulation gegen zufällige Hände, alle fünf Boardkarten werden ausgeteilt. Gegen echte
            Einsätze liegen Gegner meist über dem Zufall.
          </p>

          <div className="stat-label" style={{ marginBottom: 6 }}>So spielst du {selected}</div>
          <ul className="list-plain">
            <li className="takeaway">
              <span className="tick">›</span>
              <span>
                <strong>Niemand hat erhöht:</strong>{' '}
                {openPositions.length === 0
                  ? 'Kein Open-Raise – aus keiner Position. Im Big Blind: gratis Flop ansehen.'
                  : openPositions.length === 5
                    ? 'Aus jeder Position erhöhen (3–4 bb, plus 1 bb pro Limper).'
                    : `Erhöhen aus: ${openPositions.join(', ')} (3–4 bb, plus 1 bb pro Limper). Aus früheren Positionen folden.`}
              </span>
            </li>
            <li className="takeaway">
              <span className="tick">›</span>
              <span>
                <strong>Jemand hat erhöht:</strong> {vsRaise}
              </span>
            </li>
            <li className="takeaway">
              <span className="tick">›</span>
              <span>
                <strong>Combos:</strong> {combosForLabel(selected).length} von 1326 möglichen Starthand-Kombinationen
                {selected.length === 2 ? ' (Paar)' : selected.endsWith('s') ? ' (suited)' : ' (offsuit)'}.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
