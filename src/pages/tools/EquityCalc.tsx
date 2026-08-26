import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CardsRow } from '../../components/PlayingCard';
import { parseCard, type Card } from '../../lib/poker/cards';
import { equityVsHands } from '../../lib/poker/equity';
import { useLang } from '../../i18n';
import { STR } from '../../i18n/pages/equitycalc';

interface ParseResult {
  cards: Card[];
  error?: string;
}

function parseCards(input: string, expected: number | null, L: (typeof STR)['de']): ParseResult {
  const tokens = input
    .trim()
    .replace(/[,;]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  if (tokens.length === 0) return { cards: [] };
  const cards: Card[] = [];
  for (const t of tokens) {
    if (t.length !== 2) return { cards: [], error: L.invalidCard(t) };
    try {
      cards.push(parseCard(t));
    } catch {
      return { cards: [], error: L.invalidCard(t) };
    }
  }
  if (expected !== null && cards.length !== expected) {
    return { cards: [], error: L.exactCards(expected) };
  }
  return { cards };
}

export function EquityCalc() {
  const { lang } = useLang();
  const L = STR[lang];
  const [hand1, setHand1] = useState('As Kh');
  const [hand2, setHand2] = useState('Qd Qc');
  const [hand3, setHand3] = useState('');
  const [board, setBoard] = useState('');
  const [result, setResult] = useState<{ equities: number[]; hands: Card[][]; board: Card[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function compute() {
    setError(null);
    setResult(null);

    const p1 = parseCards(hand1, 2, L);
    const p2 = parseCards(hand2, 2, L);
    if (p1.error || p1.cards.length !== 2) return setError(p1.error ?? L.handNeedsTwo(1));
    if (p2.error || p2.cards.length !== 2) return setError(p2.error ?? L.handNeedsTwo(2));

    const hands = [p1.cards, p2.cards];
    if (hand3.trim()) {
      const p3 = parseCards(hand3, 2, L);
      if (p3.error || p3.cards.length !== 2) return setError(p3.error ?? L.handNeedsTwo(3));
      hands.push(p3.cards);
    }

    const pb = parseCards(board, null, L);
    if (pb.error) return setError(L.boardError(pb.error));
    if (![0, 3, 4, 5].includes(pb.cards.length)) {
      return setError(L.boardCount);
    }

    const all = [...hands.flat(), ...pb.cards];
    if (new Set(all).size !== all.length) return setError(L.duplicate);

    setBusy(true);
    // Rechnung asynchron, damit die UI nicht blockiert
    window.setTimeout(() => {
      const equities = equityVsHands(hands, pb.cards, 30000);
      setResult({ equities, hands, board: pb.cards });
      setBusy(false);
    }, 30);
  }

  return (
    <div>
      <Link to="/nachschlagen" className="pill" style={{ display: 'inline-flex', marginBottom: 14 }}>
        {L.back}
      </Link>
      <div className="page-header">
        <h1>{L.title}</h1>
        <p className="sub">
          {L.subBefore}<strong>{L.subStrong}</strong>{L.subAfter}
        </p>
      </div>

      <div className="card" style={{ maxWidth: 640 }}>
        <div className="grid" style={{ gap: 12 }}>
          <label>
            <div className="stat-label" style={{ marginBottom: 5 }}>{L.hand1}</div>
            <input className="text-input" value={hand1} onChange={(e) => setHand1(e.target.value)} placeholder={L.ph1} />
          </label>
          <label>
            <div className="stat-label" style={{ marginBottom: 5 }}>{L.hand2}</div>
            <input className="text-input" value={hand2} onChange={(e) => setHand2(e.target.value)} placeholder={L.ph2} />
          </label>
          <label>
            <div className="stat-label" style={{ marginBottom: 5 }}>{L.hand3}</div>
            <input className="text-input" value={hand3} onChange={(e) => setHand3(e.target.value)} placeholder={L.ph3} />
          </label>
          <label>
            <div className="stat-label" style={{ marginBottom: 5 }}>{L.boardLabel}</div>
            <input className="text-input" value={board} onChange={(e) => setBoard(e.target.value)} placeholder={L.phBoard} />
          </label>
        </div>

        {error && (
          <div className="feedback-box bad" style={{ marginTop: 14 }}>
            {error}
          </div>
        )}

        <button className="btn primary lg" style={{ marginTop: 16 }} onClick={compute} disabled={busy}>
          {busy ? L.computing : L.compute}
        </button>

        {result && (
          <div style={{ marginTop: 22 }}>
            {result.board.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div className="stat-label" style={{ marginBottom: 6 }}>{L.board}</div>
                <CardsRow cards={result.board} />
              </div>
            )}
            {result.hands.map((h, i) => {
              const pct = result.equities[i] * 100;
              return (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div className="row between" style={{ marginBottom: 6 }}>
                    <CardsRow cards={h} size="sm" />
                    <span className="big-stat" style={{ fontSize: 22 }}>{L.fmtPct(pct)}</span>
                  </div>
                  <div className="progressbar">
                    <div style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            <p className="small faint">{L.mcNote}</p>
          </div>
        )}
      </div>
    </div>
  );
}
