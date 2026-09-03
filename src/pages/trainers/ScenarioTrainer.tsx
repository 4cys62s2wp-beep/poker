import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CardsRow } from '../../components/PlayingCard';
import type { Scenario } from '../../content/scenarios';
import { useAppState } from '../../state/AppState';
import { Uebungsstand } from '../../components/Uebungsstand';
import { useLang } from '../../i18n';
import { STR } from '../../i18n/pages/scenariotrainer';
import { STR as PRO_STR } from '../../i18n/pages/pro';
import { ProLock } from '../../components/pro/ProLock';
import { usePro } from '../../lib/pro/ProProvider';

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
  const { lang, content } = useLang();
  const L = STR[lang];
  const P = PRO_STR[lang];
  const { fullAccess } = usePro();
  const unlocked = fullAccess;
  // Die Warteschlange wird aus den Inhalten abgeleitet: Ein Sprachwechsel
  // liefert sofort die Szenarien der neuen Sprache (kein eingefrorener State).
  // `round` erzwingt eine neue Mischung, sobald alle Szenarien durch sind.
  const [round, setRound] = useState(0);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const queue = useMemo<Scenario[]>(() => shuffled(content.scenarios), [content, round]);

  // Sprache mitten in der Sitzung gewechselt → bei Szenario 1 neu beginnen.
  const [seenContent, setSeenContent] = useState(content);
  if (seenContent !== content) {
    setSeenContent(content);
    setIndex(0);
    setSelected(null);
  }

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
    const nextIndex = index + 1;
    if (nextIndex % queue.length === 0) {
      // Stapel durchgespielt: neu mischen und von vorn beginnen.
      setRound((r) => r + 1);
      setIndex(0);
    } else {
      setIndex(nextIndex);
    }
    setSelected(null);
  }

  const qualityCls: Record<string, string> = { best: ' correct', ok: '', bad: ' wrong' };

  // Kopf der Seite bleibt sichtbar – der Nutzer sieht, was ihn erwartet.
  if (!unlocked) {
    return (
      <div>
        <Link to="/lernen" className="pill" style={{ display: 'inline-flex', marginBottom: 14 }}>
          {L.back}
        </Link>
        <div className="page-header">
          <div className="eyebrow">{L.eyebrow}</div>
          <h1>{L.title}</h1>
          <p className="sub">{L.sub}</p>
        </div>
        <div style={{ maxWidth: 720 }}>
          <ProLock text={P.lockedTrainer} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link to="/lernen" className="pill" style={{ display: 'inline-flex', marginBottom: 14 }}>
        {L.back}
      </Link>
      <div className="page-header">
        <div className="eyebrow">{L.eyebrow}</div>
        <h1>{L.title}</h1>
        <p className="sub">{L.sub}</p>
      </div>

      <Uebungsstand werte={stats} />

      <div className="card" style={{ maxWidth: 720 }}>
        <div className="row between wrap" style={{ marginBottom: 10 }}>
          <h2 style={{ fontSize: 19 }}>{scenario.title}</h2>
          <span className="pill info">{L.street(scenario.street)}</span>
        </div>
        <p className="muted" style={{ marginBottom: 14, fontSize: 15 }}>{scenario.situation}</p>

        <div className="row wrap" style={{ marginBottom: 18 }}>
          <div>
            <div className="stat-label" style={{ marginBottom: 5 }}>{L.yourHand}</div>
            <CardsRow cards={scenario.heroCards} />
          </div>
          {scenario.board.length > 0 && (
            <div style={{ marginLeft: 12 }}>
              <div className="stat-label" style={{ marginBottom: 5 }}>{L.board}</div>
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
                    {L.qualityLabel[opt.quality]}
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
              <span className="label">{L.lessonLabel}</span>
              {scenario.lesson}
            </div>
            <button className="btn primary" style={{ marginTop: 8 }} onClick={next}>
              {L.nextScenario}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
