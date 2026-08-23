import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CardsRow } from '../../components/PlayingCard';
import { parseCard, type Card } from '../../lib/poker/cards';
import { equityVsHands } from '../../lib/poker/equity';

interface ParseResult {
  cards: Card[];
  error?: string;
}

function parseCards(input: string, expected: number | null): ParseResult {
  const tokens = input
    .trim()
    .replace(/[,;]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  if (tokens.length === 0) return { cards: [] };
  const cards: Card[] = [];
  for (const t of tokens) {
    if (t.length !== 2) return { cards: [], error: `„${t}“ ist keine gültige Karte (z. B. As, Kh, Td)` };
    try {
      cards.push(parseCard(t));
    } catch {
      return { cards: [], error: `„${t}“ ist keine gültige Karte (z. B. As, Kh, Td)` };
    }
  }
  if (expected !== null && cards.length !== expected) {
    return { cards: [], error: `Bitte genau ${expected} Karten angeben` };
  }
  return { cards };
}

export function EquityCalc() {
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

    const p1 = parseCards(hand1, 2);
    const p2 = parseCards(hand2, 2);
    if (p1.error || p1.cards.length !== 2) return setError(p1.error ?? 'Hand 1: bitte 2 Karten angeben');
    if (p2.error || p2.cards.length !== 2) return setError(p2.error ?? 'Hand 2: bitte 2 Karten angeben');

    const hands = [p1.cards, p2.cards];
    if (hand3.trim()) {
      const p3 = parseCards(hand3, 2);
      if (p3.error || p3.cards.length !== 2) return setError(p3.error ?? 'Hand 3: bitte 2 Karten angeben');
      hands.push(p3.cards);
    }

    const pb = parseCards(board, null);
    if (pb.error) return setError(`Board: ${pb.error}`);
    if (![0, 3, 4, 5].includes(pb.cards.length)) {
      return setError('Das Board braucht 0, 3, 4 oder 5 Karten');
    }

    const all = [...hands.flat(), ...pb.cards];
    if (new Set(all).size !== all.length) return setError('Doppelte Karte gefunden – jede Karte gibt es nur einmal');

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
      <Link to="/tools" className="pill" style={{ display: 'inline-flex', marginBottom: 14 }}>
        ← Tools
      </Link>
      <div className="page-header">
        <h1>⚖️ Equity-Rechner</h1>
        <p className="sub">
          Karten im Format <strong>Rang + Farbe</strong> eingeben: A K Q J T 9 … 2 und s (♠), h (♥), d (♦), c (♣).
          Beispiel: „As Kh“ = A♠ K♥.
        </p>
      </div>

      <div className="card" style={{ maxWidth: 640 }}>
        <div className="grid" style={{ gap: 12 }}>
          <label>
            <div className="stat-label" style={{ marginBottom: 5 }}>Hand 1</div>
            <input className="text-input" value={hand1} onChange={(e) => setHand1(e.target.value)} placeholder="z. B. As Kh" />
          </label>
          <label>
            <div className="stat-label" style={{ marginBottom: 5 }}>Hand 2</div>
            <input className="text-input" value={hand2} onChange={(e) => setHand2(e.target.value)} placeholder="z. B. Qd Qc" />
          </label>
          <label>
            <div className="stat-label" style={{ marginBottom: 5 }}>Hand 3 (optional)</div>
            <input className="text-input" value={hand3} onChange={(e) => setHand3(e.target.value)} placeholder="leer lassen für Heads-Up" />
          </label>
          <label>
            <div className="stat-label" style={{ marginBottom: 5 }}>Board (0, 3, 4 oder 5 Karten)</div>
            <input className="text-input" value={board} onChange={(e) => setBoard(e.target.value)} placeholder="z. B. 9h 2h Jc" />
          </label>
        </div>

        {error && (
          <div className="feedback-box bad" style={{ marginTop: 14 }}>
            {error}
          </div>
        )}

        <button className="btn primary lg" style={{ marginTop: 16 }} onClick={compute} disabled={busy}>
          {busy ? 'Rechne …' : 'Equity berechnen'}
        </button>

        {result && (
          <div style={{ marginTop: 22 }}>
            {result.board.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div className="stat-label" style={{ marginBottom: 6 }}>Board</div>
                <CardsRow cards={result.board} />
              </div>
            )}
            {result.hands.map((h, i) => {
              const pct = result.equities[i] * 100;
              return (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div className="row between" style={{ marginBottom: 6 }}>
                    <CardsRow cards={h} size="sm" />
                    <span className="big-stat" style={{ fontSize: 22 }}>{pct.toFixed(1).replace('.', ',')} %</span>
                  </div>
                  <div className="progressbar">
                    <div style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            <p className="small faint">Monte-Carlo-Simulation mit 30.000 Durchläufen (±0,5 Prozentpunkte). Splits zählen anteilig.</p>
          </div>
        )}
      </div>
    </div>
  );
}
