import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CardsRow } from '../../components/PlayingCard';
import { SCENARIOS, type Scenario } from '../../content/scenarios';
import { useAppState } from '../../state/AppState';

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function ScenarioTrainer() {
  const { data, recordTrainer } = useAppState();
  const [queue, setQueue] = useState<Scenario[]>(() => shuffled(SCENARIOS));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const scenario = queue[index % queue.length];
  const stats = data.trainers['szenario'];

  // Optionen pro Szenario mischen (stabil pro Anzeige)
  const optionOrder = useMemo(() => shuffled(scenario.options.map((_, i) => i)), [scenario]);

  const answered = selected !== null;
  const bestIndex = scenario.options.findIndex((o) => o.quality === 'best');

  function choose(originalIdx: number) {
    if (answered) return;
    setSelected(originalIdx);
    recordTrainer('szenario', originalIdx === bestIndex);
  }

  function next() {
    if ((index + 1) % queue.length === 0) setQueue(shuffled(SCENARIOS));
    setIndex((i) => i + 1);
    setSelected(null);
  }

  const qualityCls: Record<string, string> = { best: ' correct', ok: '', bad: ' wrong' };
  const qualityLabel: Record<string, string> = { best: 'Beste Option', ok: 'Vertretbar', bad: 'Fehler' };

  return (
    <div>
      <Link to="/trainer" className="pill" style={{ display: 'inline-flex', marginBottom: 14 }}>
        ← Trainer
      </Link>
      <div className="page-header">
        <div className="eyebrow">Komplette Spots analysieren</div>
        <h1>Szenario-Trainer</h1>
        <p className="sub">
          Echte Spielsituationen mit allen Informationen – finde die beste Entscheidung. Nach der Antwort siehst du
          die Bewertung jeder Option. Kontext, falls nicht anders angegeben: 6-max Cash, 100bb.
        </p>
      </div>

      <div className="row wrap" style={{ marginBottom: 16 }}>
        <span className="pill">✓ {stats?.correct ?? 0} richtig</span>
        <span className="pill">{stats?.attempts ?? 0} gesamt</span>
        <span className="pill gold">Serie: {stats?.streak ?? 0}</span>
      </div>

      <div className="card" style={{ maxWidth: 720 }}>
        <div className="row between wrap" style={{ marginBottom: 10 }}>
          <h2 style={{ fontSize: 19 }}>{scenario.title}</h2>
          <span className="pill info">{scenario.street}</span>
        </div>
        <p className="muted" style={{ marginBottom: 14, fontSize: 15 }}>{scenario.situation}</p>

        <div className="row wrap" style={{ marginBottom: 18 }}>
          <div>
            <div className="stat-label" style={{ marginBottom: 5 }}>Deine Hand</div>
            <CardsRow cards={scenario.heroCards} />
          </div>
          {scenario.board.length > 0 && (
            <div style={{ marginLeft: 12 }}>
              <div className="stat-label" style={{ marginBottom: 5 }}>Board</div>
              <CardsRow cards={scenario.board} />
            </div>
          )}
        </div>

        {optionOrder.map((origIdx) => {
          const opt = scenario.options[origIdx];
          let cls = 'quiz-option';
          if (answered) {
            cls += qualityCls[opt.quality];
            if (origIdx === selected && opt.quality === 'ok') cls += ''; // neutral bleibt neutral
            if (origIdx !== selected && opt.quality === 'ok') cls += ' dimmed';
          }
          return (
            <div key={origIdx}>
              <button className={cls} onClick={() => choose(origIdx)} disabled={answered}>
                {opt.label}
                {answered && (
                  <span className={`pill ${opt.quality === 'best' ? 'ok' : opt.quality === 'bad' ? 'danger' : ''}`} style={{ marginLeft: 'auto' }}>
                    {qualityLabel[opt.quality]}
                  </span>
                )}
              </button>
              {answered && (
                <p className="small muted" style={{ margin: '-4px 4px 14px' }}>
                  {opt.explanation}
                </p>
              )}
            </div>
          );
        })}

        {answered && (
          <>
            <div className="callout tip" style={{ marginTop: 6 }}>
              <span className="label">Das Konzept dahinter</span>
              {scenario.lesson}
            </div>
            <button className="btn primary" style={{ marginTop: 8 }} onClick={next}>
              Nächstes Szenario
            </button>
          </>
        )}
      </div>
    </div>
  );
}
