import { useMemo, useState } from 'react';
import { HandMatrix } from '../../components/HandMatrix';
import { RFI_CHARTS } from '../../content/ranges';
import { VSOPEN_QUELLE, type Eroeffner, type Verteidiger } from '../../content/vsopen';
import { expandRangeSpec, rangePercent } from '../../lib/poker/ranges';
import { anteil, eroeffnerFuer, verteidigerPlaetze, vsOpenRange } from '../../lib/poker/vsopen';
import { useLang } from '../../i18n';
import { STR } from '../../i18n/pages/rangeviewer';
import { Zurueck } from '../../components/ui';

type Modus = 'rfi' | 'vs';
const RFI_PLAETZE: Eroeffner[] = ['UTG', 'HJ', 'CO', 'BTN', 'SB'];

export function RangeViewer() {
  const { lang } = useLang();
  const L = STR[lang];
  const [modus, setModus] = useState<Modus>('rfi');
  const [rfi, setRfi] = useState<Eroeffner>('UTG');
  const [selbst, setSelbst] = useState<Verteidiger>('BB');
  const [eroeffner, setEroeffner] = useState<Eroeffner>('BTN');
  const [zelle, setZelle] = useState<string | null>(null);

  const view = useMemo(() => {
    if (modus === 'vs') {
      const r = vsOpenRange(eroeffner, selbst)!;
      const art = selbst === 'BB' ? 'bb' : selbst === 'SB' ? 'sb' : 'ip';
      const frueh = eroeffner === 'UTG' || eroeffner === 'HJ';
      return {
        title: L.vsTitle(selbst, eroeffner),
        description: `${L.vsSelbst[art]} ${L.vsEroeffner[frueh ? 'frueh' : 'spaet']} ${L.vsRegel}`,
        raise: r.threeBet,
        call: r.call,
        pill: L.vsAnteil(Math.round(anteil(r.threeBet) * 100), Math.round(anteil(r.call) * 100)),
        raiseLabel: '3-Bet',
      };
    }
    const chart = RFI_CHARTS.find((c) => c.position === rfi)!;
    const raise = expandRangeSpec(chart.raise);
    return {
      title: L.rfiTitle(chart.position),
      description: L.desc[chart.position],
      raise: raise as ReadonlySet<string>,
      call: undefined as ReadonlySet<string> | undefined,
      pill: L.pctOfHands(Math.round(rangePercent(raise) * 100)),
      raiseLabel: 'Raise',
    };
  }, [modus, rfi, selbst, eroeffner, L]);

  function waehleSelbst(neu: Verteidiger) {
    setSelbst(neu);
    /* Der Eröffner muss vor dir sitzen: Bleibt der bisherige nicht möglich,
       gilt der späteste, der es ist. */
    const moegliche = eroeffnerFuer(neu);
    if (!moegliche.includes(eroeffner)) setEroeffner(moegliche[moegliche.length - 1]);
    setZelle(null);
  }

  return (
    <div>
      <Zurueck to="/nachschlagen" />
      <div className="page-header">
        <h1>{L.title}</h1>
        <p className="sub">{L.sub}</p>
      </div>

      <div className="segmented range-modus" role="radiogroup" aria-label={L.modusGruppe}>
        <button type="button" role="radio" aria-checked={modus === 'rfi'} className={modus === 'rfi' ? 'on' : ''} onClick={() => { setModus('rfi'); setZelle(null); }}>
          {L.modusRfi}
        </button>
        <button type="button" role="radio" aria-checked={modus === 'vs'} className={modus === 'vs' ? 'on' : ''} onClick={() => { setModus('vs'); setZelle(null); }}>
          {L.modusVs}
        </button>
      </div>

      {modus === 'rfi' ? (
        <div className="row wrap range-wahl">
          {RFI_PLAETZE.map((p) => (
            <button key={p} className={`btn sm${rfi === p ? ' primary' : ''}`} aria-pressed={rfi === p} onClick={() => { setRfi(p); setZelle(null); }}>
              {p}
            </button>
          ))}
        </div>
      ) : (
        <>
          <div className="stat-label satz">{L.duSitzt}</div>
          <div className="row wrap range-wahl">
            {verteidigerPlaetze().map((p) => (
              <button key={p} className={`btn sm${selbst === p ? ' primary' : ''}`} aria-pressed={selbst === p} onClick={() => waehleSelbst(p)}>
                {p}
              </button>
            ))}
          </div>
          <div className="stat-label satz">{L.eroeffnerFrage}</div>
          <div className="row wrap range-wahl">
            {eroeffnerFuer(selbst).map((p) => (
              <button key={p} className={`btn sm${eroeffner === p ? ' primary' : ''}`} aria-pressed={eroeffner === p} onClick={() => { setEroeffner(p); setZelle(null); }}>
                {p}
              </button>
            ))}
          </div>
        </>
      )}

      <div className="card">
        <div className="row between wrap range-kopf">
          <h2 className="range-titel">{view.title}</h2>
          <span className="pill gold">{view.pill}</span>
        </div>
        <p className="small muted range-text">{view.description}</p>

        <div className="range-legend range-legende">
          <span>
            <span className="sw raise" />
            {view.raiseLabel}
          </span>
          {view.call && (
            <span>
              <span className="sw call" />
              Call
            </span>
          )}
          <span>
            <span className="sw fold" />
            Fold
          </span>
        </div>

        <HandMatrix raise={view.raise} call={view.call} highlight={zelle ?? undefined} onCellClick={setZelle} nurAuskunft />
        <p className="auskunft-zeile" role="status">
          {zelle ? L.auskunft(zelle, view.raise.has(zelle) ? view.raiseLabel : view.call?.has(zelle) ? 'Call' : 'Fold') : ''}
        </p>

        <p className="small faint range-fuss">
          {L.readingHelp}
        </p>
        {modus === 'vs' && <p className="small faint">{VSOPEN_QUELLE[lang]}</p>}
      </div>
    </div>
  );
}
