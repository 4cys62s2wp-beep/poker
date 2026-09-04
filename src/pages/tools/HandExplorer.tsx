import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { HandMatrix } from '../../components/HandMatrix';
import { RANKS_DESC } from '../../lib/poker/ranges';
import { CardsRow } from '../../components/PlayingCard';
import { RFI_CHARTS } from '../../content/ranges';
import { combosForLabel, expandRangeSpec } from '../../lib/poker/ranges';
import { MC_ITERATIONS, runEquityJobs } from '../../lib/poker/equityAsync';
import { useLang } from '../../i18n';
import { STR } from '../../i18n/pages/handexplorer';

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

function classify(label: string, L: (typeof STR)['de']): { name: string; pill: string; desc: string } {
  if (PREMIUM.has(label)) {
    return { name: L.catPremiumName, pill: 'gold', desc: L.catPremiumDesc };
  }
  if (STRONG.has(label)) {
    return { name: L.catStrongName, pill: 'ok', desc: L.catStrongDesc };
  }
  if (PAIRS.has(label)) {
    return { name: L.catPairName, pill: 'info', desc: L.catPairDesc };
  }
  if (PLAYABLE.has(label)) {
    return { name: L.catPlayableName, pill: 'violet', desc: L.catPlayableDesc };
  }
  return { name: L.catWeakName, pill: 'danger', desc: L.catWeakDesc };
}

export function HandExplorer() {
  const { lang } = useLang();
  const L = STR[lang];
  const [selected, setSelected] = useState<string>('AKs');

  /* Die gewählte Hand als ihre drei Bestandteile — damit die Auswahl
     daneben weiß, welcher Knopf an ist. Gelesen aus der Bezeichnung, nicht
     doppelt gehalten: Zwei Quellen für dieselbe Angabe laufen auseinander. */
  const hoch = selected[0];
  const tief = selected[1];
  const art: 's' | 'o' = selected.endsWith('s') ? 's' : 'o';

  /** Aus zwei Rängen und der Art die übliche Bezeichnung bilden.
   *
   *  Die höhere Karte steht vorn („AKs", nie „KAs"), und ein Paar trägt
   *  keinen Zusatz — das ist die Schreibweise, die die ganze App und die
   *  gerechneten Tabellen verwenden. */
  function setzeHand(a: string, b: string, wie: 's' | 'o') {
    const ia = RANKS_DESC.indexOf(a);
    const ib = RANKS_DESC.indexOf(b);
    const [oben, unten] = ia <= ib ? [a, b] : [b, a];
    setSelected(oben === unten ? `${oben}${unten}` : `${oben}${unten}${wie}`);
  }
  const cache = useRef(new Map<string, HandDetail>());
  const [detail, setDetail] = useState<HandDetail | null>(null);

  /* Die drei Monte-Carlo-Läufe laufen im Worker (Fallback: verzögert im
     Hauptthread). Bis das Ergebnis da ist, zeigt die Karte einen Ladezustand;
     einmal berechnete Hände kommen aus dem Cache und erscheinen sofort. */
  useEffect(() => {
    const cached = cache.current.get(selected);
    if (cached) {
      setDetail(cached);
      return;
    }
    setDetail(null);
    let alive = true;
    const [c0, c1] = combosForLabel(selected)[0];
    const hero = [c0, c1];
    const iterations = MC_ITERATIONS.explorer;
    runEquityJobs([
      { hero, board: [], opponents: 1, iterations },
      { hero, board: [], opponents: 3, iterations },
      { hero, board: [], opponents: 5, iterations },
    ]).then(([eq1, eq3, eq5]) => {
      const d: HandDetail = { eq1, eq3, eq5 };
      cache.current.set(selected, d);
      if (alive) setDetail(d);
    });
    return () => {
      alive = false;
    };
  }, [selected]);

  const openPositions = RFI.filter((r) => r.set.has(selected)).map((r) => r.position);
  const cls = classify(selected, L);
  const combo = combosForLabel(selected)[0];

  const vsRaise = PREMIUM.has(selected)
    ? L.vsRaisePremium
    : STRONG.has(selected)
      ? L.vsRaiseStrong
      : PAIRS.has(selected)
        ? L.vsRaisePair
        : L.vsRaiseWeak;

  return (
    <div>
      <Link to="/nachschlagen" className="pill" style={{ display: 'inline-flex', marginBottom: 14 }}>
        {L.back}
      </Link>
      <div className="page-header">
        <div className="eyebrow">{L.eyebrow}</div>
        <h1>{L.title}</h1>
        <p className="sub">
          {L.sub}
        </p>
      </div>

      <div
        className="grid"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 18, maxWidth: 1100, alignItems: 'start' }}
      >
        <div className="card">
          {/* Die zweite Auswahl (E-039).
              ---------------------------
              Die Matrix ist ein Diagramm: 169 Felder, die man als Bild
              liest. Ihre Zellen sind 28 Pixel groß — als Bedienfläche zu
              klein, und größer geht nicht, ohne das Bild zu zerstören
              (44 Pixel je Zelle ergäben 668 Pixel Breite auf einem 390
              Pixel breiten Gerät).

              Also bleibt die Matrix ein Diagramm, und daneben steht eine
              Auswahl mit richtigen Bedienflächen. Das ist die Bedingung,
              unter der die Ausnahme in DESIGN.md gilt: Was man über ein
              Diagramm erreichen kann, muss man auch ohne erreichen
              können. */}
          <div className="handwahl">
            <span className="handwahl-titel">{L.waehleTitel}</span>
            <span className="handwahl-marke">{L.ersteKarte}</span>
            <div className="handwahl-reihe">
              {[...RANKS_DESC].map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`handwahl-knopf${r === hoch ? ' an' : ''}`}
                  onClick={() => setzeHand(r, tief, art)}
                >
                  {r}
                </button>
              ))}
            </div>
            <span className="handwahl-marke">{L.zweiteKarte}</span>
            <div className="handwahl-reihe">
              {[...RANKS_DESC].map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`handwahl-knopf${r === tief ? ' an' : ''}`}
                  onClick={() => setzeHand(hoch, r, art)}
                >
                  {r}
                </button>
              ))}
            </div>
            <span className="handwahl-marke">{L.artTitel}</span>
            <div className="segmented">
              <button
                type="button"
                className={art === 's' && hoch !== tief ? 'on' : ''}
                disabled={hoch === tief}
                onClick={() => setzeHand(hoch, tief, 's')}
              >
                {L.suited}
              </button>
              <button
                type="button"
                className={art === 'o' && hoch !== tief ? 'on' : ''}
                disabled={hoch === tief}
                onClick={() => setzeHand(hoch, tief, 'o')}
              >
                {L.offsuit}
              </button>
              <button type="button" className={hoch === tief ? 'on' : ''} disabled>
                {L.paar}
              </button>
            </div>
          </div>

          <HandMatrix
            raise={new Set([selected])}
            highlight={selected}
            onCellClick={(label) => setSelected(label)}
          />
          <p className="small faint" style={{ marginTop: 12 }}>
            {L.matrixHint}
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

          <div className="stat-label" style={{ marginBottom: 8 }}>{L.winProb}</div>
          {[
            { n: 1, eq: detail?.eq1, label: L.vsOpponents(1) },
            { n: 3, eq: detail?.eq3, label: L.vsOpponents(3) },
            { n: 5, eq: detail?.eq5, label: L.vsOpponents(5) },
          ].map((row) => (
            <div key={row.n} style={{ marginBottom: 10 }}>
              <div className="row between" style={{ marginBottom: 4 }}>
                <span className="small muted">{row.label}</span>
                <strong>{row.eq === undefined ? L.calculating : L.fmtPct(Math.round(row.eq * 100))}</strong>
              </div>
              <div className="progressbar">
                <div style={{ width: `${(row.eq ?? 0) * 100}%` }} />
              </div>
            </div>
          ))}
          <p className="small faint" style={{ marginBottom: 16 }}>
            {L.mcNote}
          </p>

          <div className="stat-label" style={{ marginBottom: 6 }}>{L.howToPlay(selected)}</div>
          <ul className="list-plain">
            <li className="takeaway">
              <span className="tick">›</span>
              <span>
                <strong>{L.noRaise}</strong>{' '}
                {openPositions.length === 0
                  ? L.noOpen
                  : openPositions.length === 5
                    ? L.openAll
                    : L.openFrom(openPositions.join(', '))}
              </span>
            </li>
            <li className="takeaway">
              <span className="tick">›</span>
              <span>
                <strong>{L.someoneRaised}</strong> {vsRaise}
              </span>
            </li>
            <li className="takeaway">
              <span className="tick">›</span>
              <span>
                <strong>{L.combosLabel}</strong> {L.combosOf(combosForLabel(selected).length)}
                {selected.length === 2 ? L.comboPair : selected.endsWith('s') ? L.comboSuited : L.comboOffsuit}.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
