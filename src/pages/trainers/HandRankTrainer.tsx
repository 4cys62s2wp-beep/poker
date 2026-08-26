import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CardsRow } from '../../components/PlayingCard';
import { shuffledDeckWithout } from '../../lib/poker/cards';
import { categoryOf, evaluateBest } from '../../lib/poker/evaluator';
import { useAppState } from '../../state/AppState';
import { useLang } from '../../i18n';
import { STR } from '../../i18n/pages/handranktrainer';

interface Scenario {
  hole: number[];
  board: number[];
}

function newScenario(): Scenario {
  const deck = shuffledDeckWithout([]);
  return { hole: deck.slice(0, 2), board: deck.slice(2, 7) };
}

export function HandRankTrainer() {
  const { data, recordTrainer } = useAppState();
  const { lang } = useLang();
  const L = STR[lang];
  const [scenario, setScenario] = useState<Scenario>(newScenario);
  const [selected, setSelected] = useState<number | null>(null);

  const stats = data.trainers['handranking'];

  const correctCategory = useMemo(
    () => categoryOf(evaluateBest([...scenario.hole, ...scenario.board])),
    [scenario],
  );

  const options = useMemo(() => {
    // Korrekte Kategorie + 3 benachbarte/plausible Distraktoren
    const set = new Set<number>([correctCategory]);
    const candidates = [
      correctCategory - 1,
      correctCategory + 1,
      correctCategory - 2,
      correctCategory + 2,
      correctCategory + 3,
      correctCategory - 3,
    ].filter((c) => c >= 0 && c <= 8);
    for (const c of candidates) {
      if (set.size >= 4) break;
      set.add(c);
    }
    let filler = 0;
    while (set.size < 4 && filler <= 8) set.add(filler++);
    return [...set].sort((a, b) => b - a);
  }, [correctCategory]);

  const answered = selected !== null;

  function choose(cat: number) {
    if (answered) return;
    setSelected(cat);
    recordTrainer('handranking', cat === correctCategory);
  }

  function next() {
    setScenario(newScenario());
    setSelected(null);
  }

  return (
    <div>
      <Link to="/lernen" className="pill" style={{ display: 'inline-flex', marginBottom: 14 }}>
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
        <div className="stat-label" style={{ margin: '16px 0 6px' }}>{L.board}</div>
        <CardsRow cards={scenario.board} />

        <div style={{ marginTop: 20 }}>
          {options.map((cat) => {
            let cls = 'quiz-option';
            if (answered) {
              if (cat === correctCategory) cls += ' correct';
              else if (cat === selected) cls += ' wrong';
              else cls += ' dimmed';
            }
            return (
              <button key={cat} className={cls} onClick={() => choose(cat)} disabled={answered}>
                {L.categories[cat]}
              </button>
            );
          })}
        </div>

        {answered && (
          <>
            <div className={`feedback-box ${selected === correctCategory ? 'good' : 'bad'}`}>
              <strong>{selected === correctCategory ? L.correctFb : L.wrongFb}</strong>
              {L.bestHandPrefix}<strong>{L.categories[correctCategory]}</strong>.
            </div>
            <button className="btn primary" style={{ marginTop: 14 }} onClick={next}>
              {L.nextHand}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
