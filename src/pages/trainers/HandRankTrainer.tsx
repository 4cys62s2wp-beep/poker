import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CardsRow } from '../../components/PlayingCard';
import { shuffledDeckWithout } from '../../lib/poker/cards';
import { HAND_CATEGORY_NAMES, categoryOf, evaluateBest } from '../../lib/poker/evaluator';
import { useAppState } from '../../state/AppState';

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
      <Link to="/trainer" className="pill" style={{ display: 'inline-flex', marginBottom: 14 }}>
        ← Trainer
      </Link>
      <div className="page-header">
        <h1>🏆 Handranking-Trainer</h1>
        <p className="sub">
          Aus deinen zwei Karten und dem Board entsteht deine beste Fünf-Karten-Hand. Welche Kategorie ist es?
        </p>
      </div>

      <div className="row wrap" style={{ marginBottom: 16 }}>
        <span className="pill">✓ {stats?.correct ?? 0} richtig</span>
        <span className="pill">{stats?.attempts ?? 0} gesamt</span>
        <span className="pill gold">🔥 Serie: {stats?.streak ?? 0}</span>
      </div>

      <div className="card" style={{ maxWidth: 640 }}>
        <div className="stat-label" style={{ marginBottom: 6 }}>Deine Hand</div>
        <CardsRow cards={scenario.hole} size="lg" />
        <div className="stat-label" style={{ margin: '16px 0 6px' }}>Board</div>
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
                {HAND_CATEGORY_NAMES[cat]}
              </button>
            );
          })}
        </div>

        {answered && (
          <>
            <div className={`feedback-box ${selected === correctCategory ? 'good' : 'bad'}`}>
              <strong>{selected === correctCategory ? '✓ Richtig! ' : '✗ Leider nein. '}</strong>
              Die beste Hand ist: <strong>{HAND_CATEGORY_NAMES[correctCategory]}</strong>.
            </div>
            <button className="btn primary" style={{ marginTop: 14 }} onClick={next}>
              Nächste Hand →
            </button>
          </>
        )}
      </div>
    </div>
  );
}
