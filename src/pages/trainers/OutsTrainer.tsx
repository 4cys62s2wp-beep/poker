import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CardsRow } from '../../components/PlayingCard';
import { RANK_CHARS, makeCard } from '../../lib/poker/cards';
import { useAppState } from '../../state/AppState';
import { useLang } from '../../i18n';
import { STR, type OutsTemplateKey } from '../../i18n/pages/outstrainer';

interface Scenario {
  hole: number[];
  board: number[];
  /** Frage & Erklärung kommen sprachabhängig aus dem Wörterbuch. */
  key: OutsTemplateKey;
  outs: number;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffledSuits(): number[] {
  const s = [0, 1, 2, 3];
  for (let i = s.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [s[i], s[j]] = [s[j], s[i]];
  }
  return s;
}

const r = (ch: string) => RANK_CHARS.indexOf(ch);

function newScenario(): Scenario {
  const template = Math.floor(Math.random() * 7);
  const [s1, s2, s3] = shuffledSuits();

  switch (template) {
    case 0: {
      // Flushdraw: 9 Outs
      const hi = pick(['A', 'K', 'Q']);
      const lo = pick(['5', '6', '7']);
      const b1 = pick(['9', 'T']);
      const b2 = pick(['2', '3']);
      const b3 = pick(['J', 'Q', 'K'].filter((x) => x !== hi));
      return {
        hole: [makeCard(r(hi), s1), makeCard(r(lo), s1)],
        board: [makeCard(r(b1), s1), makeCard(r(b2), s1), makeCard(r(b3), s2)],
        key: 'flush',
        outs: 9,
      };
    }
    case 1: {
      // OESD: 8 Outs
      const base = pick([['9', '8', '7', '6'], ['T', '9', '8', '7'], ['8', '7', '6', '5']]);
      const x = pick(['2', 'K']);
      return {
        hole: [makeCard(r(base[0]), s1), makeCard(r(base[1]), s2)],
        board: [makeCard(r(base[2]), s3), makeCard(r(base[3]), s1), makeCard(r(x), s2)],
        key: 'oesd',
        outs: 8,
      };
    }
    case 2: {
      // Gutshot: 4 Outs
      const x = pick(['2', '3']);
      return {
        hole: [makeCard(r('J'), s1), makeCard(r('T'), s2)],
        board: [makeCard(r('8'), s3), makeCard(r('7'), s1), makeCard(r(x), s2)],
        key: 'gutshot',
        outs: 4,
      };
    }
    case 3: {
      // Zwei Overcards: 6 Outs
      const b = pick([['Q', '7', '2'], ['J', '8', '3'], ['T', '6', '2']]);
      return {
        hole: [makeCard(r('A'), s1), makeCard(r('K'), s2)],
        board: [makeCard(r(b[0]), s3), makeCard(r(b[1]), s1), makeCard(r(b[2]), s2)],
        key: 'overcards',
        outs: 6,
      };
    }
    case 4: {
      // Flushdraw + zwei Overcards: 15 Outs
      return {
        hole: [makeCard(r('A'), s1), makeCard(r('K'), s1)],
        board: [makeCard(r('Q'), s1), makeCard(r('7'), s1), makeCard(r('2'), s2)],
        key: 'flushOvercards',
        outs: 15,
      };
    }
    case 5: {
      // Flushdraw + Gutshot: 12 Outs
      return {
        hole: [makeCard(r('J'), s1), makeCard(r('T'), s1)],
        board: [makeCard(r('8'), s1), makeCard(r('7'), s1), makeCard(r('2'), s2)],
        key: 'flushGutshot',
        outs: 12,
      };
    }
    default: {
      // Set → Full House / Quads am Turn: 7 Outs
      const setRank = pick(['7', '8', '9']);
      const b2 = pick(['K', 'Q']);
      const b3 = pick(['2', '3']);
      return {
        hole: [makeCard(r(setRank), s1), makeCard(r(setRank), s2)],
        board: [makeCard(r(setRank), s3), makeCard(r(b2), s1), makeCard(r(b3), s2)],
        key: 'setFull',
        outs: 7,
      };
    }
  }
}

function buildOptions(correct: number): number[] {
  const set = new Set<number>([correct]);
  const offsets = [-3, -2, -1, 1, 2, 3, 4];
  while (set.size < 4) {
    const o = pick(offsets);
    const v = correct + o;
    if (v > 0) set.add(v);
  }
  return [...set].sort((a, b) => a - b);
}

export function OutsTrainer() {
  const { data, recordTrainer } = useAppState();
  const { lang } = useLang();
  const L = STR[lang];
  const [scenario, setScenario] = useState<Scenario>(newScenario);
  const [options, setOptions] = useState<number[]>(() => buildOptions(scenario.outs));
  const [selected, setSelected] = useState<number | null>(null);

  const stats = data.trainers['outs'];
  const answered = selected !== null;

  function choose(v: number) {
    if (answered) return;
    setSelected(v);
    recordTrainer('outs', v === scenario.outs);
  }

  function next() {
    const s = newScenario();
    setScenario(s);
    setOptions(buildOptions(s.outs));
    setSelected(null);
  }

  return (
    <div>
      <Link to="/trainer" className="pill" style={{ display: 'inline-flex', marginBottom: 14 }}>
        {L.back}
      </Link>
      <div className="page-header">
        <h1>{L.title}</h1>
        <p className="sub">{L.sub}</p>
      </div>

      <div className="row wrap" style={{ marginBottom: 16 }}>
        <span className="pill">{L.correctCount(stats?.correct ?? 0)}</span>
        <span className="pill">{L.totalCount(stats?.attempts ?? 0)}</span>
        <span className="pill gold">{L.streak(stats?.streak ?? 0)}</span>
      </div>

      <div className="card" style={{ maxWidth: 640 }}>
        <div className="stat-label" style={{ marginBottom: 6 }}>{L.yourHand}</div>
        <CardsRow cards={scenario.hole} size="lg" />
        <div className="stat-label" style={{ margin: '16px 0 6px' }}>{L.flop}</div>
        <CardsRow cards={scenario.board} />

        <p style={{ margin: '18px 0 12px', fontWeight: 600 }}>{L.questions[scenario.key]}</p>

        <div className="row wrap">
          {options.map((v) => {
            let cls = 'btn lg';
            if (answered) {
              if (v === scenario.outs) cls += ' success';
              else if (v === selected) cls += ' danger';
            }
            return (
              <button key={v} className={cls} onClick={() => choose(v)} disabled={answered}>
                {L.outsBtn(v)}
              </button>
            );
          })}
        </div>

        {answered && (
          <>
            <div className={`feedback-box ${selected === scenario.outs ? 'good' : 'bad'}`} style={{ marginTop: 16 }}>
              <strong>{selected === scenario.outs ? L.correctFb : L.wrongFb(scenario.outs)}</strong>
              {L.explanations[scenario.key]}{' '}
              <span className="muted">
                {L.equityNote(Math.min(95, scenario.outs * 4))}
              </span>
            </div>
            <button className="btn primary" style={{ marginTop: 14 }} onClick={next}>
              {L.nextSituation}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
