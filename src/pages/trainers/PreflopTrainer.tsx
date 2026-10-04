import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { HandMatrix } from '../../components/HandMatrix';
import { CardsRow } from '../../components/PlayingCard';
import { BB_DEFENSE_VS_BTN, POSITION_NAMES, RFI_CHARTS } from '../../content/ranges';
import type { Eroeffner, Verteidiger } from '../../content/vsopen';
import { gegenOpen, vsOpenRange, VSOPEN_PAARE } from '../../lib/poker/vsopen';
import { expandRangeSpec } from '../../lib/poker/ranges';
import { ziehePreflopHand } from '../../lib/poker/aufgaben';
import { bucheSpot, ladeSpots, quoteVon } from '../../lib/lernen/spots';
import { Positionsschema } from '../../components/Positionsschema';
import type { Position } from '../../content/ranges';
import { useAppState } from '../../state/AppState';
import { Entscheidung } from '../../components/Entscheidung';
import { Uebungsstand } from '../../components/Uebungsstand';
import { useLang } from '../../i18n';
import { STR } from '../../i18n/pages/prefloptrainer';
import { STR as RANGEN } from '../../i18n/pages/rangeviewer';
import { Rueckmeldung } from '../../components/Rueckmeldung';
import { Zurueck } from '../../components/ui';
import { MitBegriffen } from '../../components/Begriff';
import { KonzeptLink } from '../../components/KonzeptLink';

type Scenario =
  | { kind: 'rfi'; position: (typeof RFI_CHARTS)[number]['position']; cards: [number, number]; label: string }
  | { kind: 'bbdef'; cards: [number, number]; label: string }
  | { kind: 'vsopen'; eroeffner: Eroeffner; selbst: Verteidiger; cards: [number, number]; label: string };

const RFI_SETS = new Map(RFI_CHARTS.map((c) => [c.position, expandRangeSpec(c.raise)]));
const BB_3BET = expandRangeSpec(BB_DEFENSE_VS_BTN.threeBet);
const BB_CALL_RAW = expandRangeSpec(BB_DEFENSE_VS_BTN.call);
// 3-Bet hat Vorrang vor Call
const BB_CALL = new Set([...BB_CALL_RAW].filter((l) => !BB_3BET.has(l)));

type SpotId = (typeof RFI_CHARTS)[number]['position'] | 'BB' | 'VS';
const SPOTS: SpotId[] = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB', 'VS'];

/** Die Reihenfolge, in der am 6-max-Tisch vor dem Flop gehandelt wird. */
const REIHENFOLGE: Position[] = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'];

/** Etwa die Hälfte der Aufgaben liegt an der Grenze der Range (E-093): Dort
 *  wird gelernt. Gleichverteilt war „immer Fold" in 69 % der Aufgaben richtig. */
function newScenario(fest: SpotId | null): Scenario {
  const wurf = Math.random();
  const spot: SpotId = fest ?? (wurf < 0.5
    ? RFI_CHARTS[Math.floor(Math.random() * RFI_CHARTS.length)].position
    : wurf < 0.65 ? 'BB' : 'VS');
  if (spot === 'VS') {
    /* Ein Platzpaar, dann eine Hand aus der Nähe der Grenze seiner Range:
       Gegen UTG ist AJo ein Fold, gegen den Cutoff ein Call — genau dort lernt man. */
    const paar = VSOPEN_PAARE[Math.floor(Math.random() * VSOPEN_PAARE.length)];
    const { label, cards } = ziehePreflopHand(vsOpenRange(paar.eroeffner, paar.selbst)!.weiter);
    return { kind: 'vsopen', eroeffner: paar.eroeffner, selbst: paar.selbst, cards, label };
  }
  if (spot === 'BB') {
    const { label, cards } = ziehePreflopHand(BB_DEFENSE);
    return { kind: 'bbdef', cards, label };
  }
  const { label, cards } = ziehePreflopHand(RFI_SETS.get(spot)!);
  return { kind: 'rfi', position: spot, cards, label };
}

const BB_DEFENSE = new Set([...BB_3BET, ...BB_CALL_RAW]);

/** Das Bild zur Aufgabe: wer noch dabei ist und was eingesetzt wurde. */
function schemaFuer(sc: Scenario): { eigen: Position; gefoldet: Position[]; einsaetze: Partial<Record<Position, number>> } {
  if (sc.kind === 'vsopen') {
    /* Vor dem Eröffner und zwischen Eröffner und dir haben alle gefoldet; die
       Blinds haben ihren Einsatz, solange sie noch nicht dran waren. */
    return {
      eigen: sc.selbst,
      gefoldet: REIHENFOLGE.slice(0, REIHENFOLGE.indexOf(sc.selbst)).filter((p) => p !== sc.eroeffner),
      einsaetze: {
        [sc.eroeffner]: 2.5,
        ...(sc.selbst === 'SB' ? { SB: 0.5, BB: 1 } : sc.selbst === 'BB' ? { BB: 1 } : {}),
      },
    };
  }
  if (sc.kind === 'bbdef') {
    return {
      eigen: 'BB',
      gefoldet: ['UTG', 'HJ', 'CO', 'SB'],
      einsaetze: { BTN: 2.5, BB: 1 },
    };
  }
  const idx = REIHENFOLGE.indexOf(sc.position);
  return {
    eigen: sc.position,
    gefoldet: REIHENFOLGE.slice(0, idx),
    einsaetze: { SB: 0.5, BB: 1 },
  };
}

/** Die Matrix nach der Antwort: wer 3-bettet, wer mitgeht. */
function matrixRaise(sc: Scenario): ReadonlySet<string> | undefined {
  if (sc.kind === 'rfi') return RFI_SETS.get(sc.position);
  if (sc.kind === 'vsopen') return vsOpenRange(sc.eroeffner, sc.selbst)!.threeBet;
  return BB_3BET;
}

function matrixCall(sc: Scenario): ReadonlySet<string> | undefined {
  if (sc.kind === 'rfi') return undefined;
  if (sc.kind === 'vsopen') return vsOpenRange(sc.eroeffner, sc.selbst)!.call;
  return BB_CALL;
}

/** Warum die Antwort so lautet: derselbe Text wie im Range-Viewer. */
function vsErklaerung(sc: Extract<Scenario, { kind: 'vsopen' }>, T: (typeof RANGEN)['de']): string {
  const art = sc.selbst === 'BB' ? 'bb' : sc.selbst === 'SB' ? 'sb' : 'ip';
  const frueh = sc.eroeffner === 'UTG' || sc.eroeffner === 'HJ';
  return `${T.vsSelbst[art]} ${T.vsEroeffner[frueh ? 'frueh' : 'spaet']}`;
}

export function PreflopTrainer() {
  const { data, recordTrainer } = useAppState();
  const { lang } = useLang();
  const L = STR[lang];
  const [fest, setFest] = useState<SpotId | null>(null);
  const [scenario, setScenario] = useState<Scenario>(() => newScenario(null));
  const [answer, setAnswer] = useState<string | null>(null);
  const [spotStand, setSpotStand] = useState(ladeSpots);
  const ergebnisRef = useRef<HTMLDivElement>(null);

  const stats = data.trainers['preflop'];
  const aktuellerSpot: SpotId = scenario.kind === 'rfi' ? scenario.position : scenario.kind === 'vsopen' ? 'VS' : 'BB';

  const correctAnswer = useMemo(() => {
    if (scenario.kind === 'rfi') {
      return RFI_SETS.get(scenario.position)!.has(scenario.label) ? 'raise' : 'fold';
    }
    if (scenario.kind === 'vsopen') {
      const a = gegenOpen(scenario.label, scenario.eroeffner, scenario.selbst);
      return a === 'threeBet' ? '3bet' : a === 'call' ? 'call' : 'fold';
    }
    if (BB_3BET.has(scenario.label)) return '3bet';
    if (BB_CALL.has(scenario.label)) return 'call';
    return 'fold';
  }, [scenario]);

  function choose(a: string) {
    if (answer) return;
    setAnswer(a);
    recordTrainer('preflop', a === correctAnswer);
    setSpotStand(bucheSpot(aktuellerSpot, a === correctAnswer));
  }

  function next() {
    setScenario(newScenario(fest));
    setAnswer(null);
  }

  /** Einen Spot gezielt üben — oder, wenn er schon gewählt ist, wieder alle. */
  function waehleSpot(id: SpotId) {
    const neu = fest === id ? null : id;
    setFest(neu);
    setScenario(newScenario(neu));
    setAnswer(null);
  }

  /* Nach der Antwort holt die Begründung die Leiste nicht ein: Sie rückt, ohne
     zu animieren, ins Bild (E-064). */
  useEffect(() => {
    if (answer) ergebnisRef.current?.scrollIntoView({ block: 'nearest' });
  }, [answer]);

  const isCorrect = answer === correctAnswer;
  const bild = schemaFuer(scenario);

  return (
    <div>
      <Zurueck to="/lernen" />
      <div className="page-header">
        <h1>{L.title}</h1>
        <p className="sub">{L.sub}</p>
      </div>

      <Uebungsstand werte={stats} />

      {/* Der Spot: Wo sitzt du, und was wird geübt? Jeder Spot zeigt seine
          Trefferquote; antippen übt ihn gezielt. */}
      <div className="spot-chips" role="group" aria-label={L.spotGruppe}>
        {SPOTS.map((id) => {
          const q = quoteVon(spotStand[id]);
          return (
            <button
              key={id}
              type="button"
              className={`spot-chip${aktuellerSpot === id ? ' jetzt' : ''}`}
              aria-pressed={fest === id}
              onClick={() => waehleSpot(id)}
            >
              <span className="spot-name">{id === 'BB' ? L.spotBB : id === 'VS' ? L.spotVs : id}</span>
              <span className="spot-quote">{q === null ? L.spotNeu : `${q} %`}</span>
            </button>
          );
        })}
      </div>

      <div className="card">
        {scenario.kind === 'rfi' ? (
          <p style={{ marginBottom: 14 }}>
            {L.rfiIntroBefore}
            <strong style={{ color: 'var(--auszeichnung-lesbar)' }}>{scenario.position}</strong> (
            {POSITION_NAMES[scenario.position]}){L.rfiIntroAfter}
          </p>
        ) : scenario.kind === 'vsopen' ? (
          <p className="trainer-frage">
            {L.vsIntro(scenario.selbst, scenario.eroeffner)}
          </p>
        ) : (
          <p style={{ marginBottom: 14 }}>
            {L.bbIntroBefore}
            <strong style={{ color: 'var(--auszeichnung-lesbar)' }}>{L.bbIntroStrong}</strong>
            {L.bbIntroAfter}
          </p>
        )}

        <Positionsschema eigen={bild.eigen} gefoldet={bild.gefoldet} einsaetze={bild.einsaetze} />

        <div className="row" style={{ margin: '14px 0 18px' }}>
          <CardsRow cards={[scenario.cards[0], scenario.cards[1]]} size="lg" />
          <span className="pill" style={{ fontSize: 'var(--fs-beschriftung)' }}>{scenario.label}</span>
        </div>

        {answer && (
          <div ref={ergebnisRef}>
            <Rueckmeldung urteil={isCorrect ? 'richtig' : 'falsch'} style={{ marginTop: 16 }}>
              {scenario.kind === 'rfi' ? (
                <>
                  {L.rfiVerdict(scenario.label, correctAnswer === 'raise', scenario.position)} <MitBegriffen text={L.rfiDesc[scenario.position]} />
                </>
              ) : scenario.kind === 'vsopen' ? (
                <>
                  {L.vsVerdict(scenario.label, correctAnswer, scenario.eroeffner)}{' '}
                  <MitBegriffen text={vsErklaerung(scenario, RANGEN[lang])} />
                </>
              ) : (
                <>
                  {L.bbVerdict(scenario.label, correctAnswer)} <MitBegriffen text={L.bbDefenseDesc} />
                </>
              )}
            </Rueckmeldung>

            <div style={{ marginTop: 18 }}>
              <div className="range-legend" style={{ marginBottom: 10 }}>
                <span>
                  <span className="sw raise" />
                  {scenario.kind === 'rfi' ? 'Raise' : '3-Bet'}
                </span>
                {scenario.kind !== 'rfi' && (
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
              <HandMatrix
                kompakt
                raise={matrixRaise(scenario)}
                call={matrixCall(scenario)}
                highlight={scenario.label}
              />
            </div>
          </div>
        )}
      </div>

      <KonzeptLink ziel="preflop" />

      {/* Antworten und Weitermachen an derselben Stelle, unten im
          Daumenbereich (E-039). Die Reihenfolge ist überall dieselbe:
          Fold · Call · Raise, der Raise als einziger betonter Knopf. */}
      <Entscheidung label={L.title}>
        {!answer ? (
          scenario.kind === 'rfi' ? (
            <>
              <ActionBtn label="Fold" value="fold" onClick={choose} />
              <ActionBtn label="Raise" value="raise" onClick={choose} betont />
            </>
          ) : (
            <>
              <ActionBtn label="Fold" value="fold" onClick={choose} />
              <ActionBtn label="Call" value="call" onClick={choose} />
              <ActionBtn label="3-Bet" value="3bet" onClick={choose} betont />
            </>
          )
        ) : (
          <button className="btn primary" onClick={next}>{L.nextHand}</button>
        )}
      </Entscheidung>
    </div>
  );
}

function ActionBtn({
  label,
  value,
  onClick,
  betont = false,
}: {
  label: string;
  value: string;
  onClick: (v: string) => void;
  betont?: boolean;
}) {
  return (
    <button className={`btn lg${betont ? ' primary' : ''}`} onClick={() => onClick(value)}>
      {label}
    </button>
  );
}
