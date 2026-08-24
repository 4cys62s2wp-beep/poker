import { useState } from 'react';
import type { Card } from '../lib/poker/cards';
import { RANK_CHARS, SUIT_CHARS, SUIT_SYMBOLS, makeCard } from '../lib/poker/cards';
import { PlayingCard } from './PlayingCard';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/cardpicker';

interface Props {
  /** Wie viele Karten sollen gewählt werden? */
  count: number;
  /** Bereits vergebene Karten (werden gesperrt). */
  used: Set<Card>;
  /** Wird aufgerufen, sobald alle Karten gewählt sind. */
  onComplete: (cards: Card[]) => void;
  label?: string;
}

const RANK_ORDER = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]; // A → 2

/** Schneller 2-Tap-Karten-Picker: erst Rang, dann Farbe. */
export function CardPicker({ count, used, onComplete, label }: Props) {
  const { lang } = useLang();
  const L = STR[lang];
  const [picked, setPicked] = useState<Card[]>([]);
  const [pendingRank, setPendingRank] = useState<number | null>(null);

  const allUsed = new Set<Card>([...used, ...picked]);

  function pickSuit(suit: number) {
    if (pendingRank === null) return;
    const card = makeCard(pendingRank, suit);
    if (allUsed.has(card)) return;
    const next = [...picked, card];
    setPendingRank(null);
    if (next.length >= count) {
      setPicked([]);
      onComplete(next);
    } else {
      setPicked(next);
    }
  }

  function rankFullyUsed(rank: number): boolean {
    return [0, 1, 2, 3].every((s) => allUsed.has(makeCard(rank, s)));
  }

  return (
    <div>
      <div className="row between wrap" style={{ marginBottom: 12 }}>
        <span className="stat-label">
          {label ?? L.pickCard} ({picked.length + 1}/{count})
        </span>
        <div className="cards-row">
          {picked.map((c) => (
            <PlayingCard key={c} card={c} size="sm" />
          ))}
          {picked.length < count && <div className="pcard back sm" style={{ opacity: 0.4 }} />}
        </div>
      </div>

      {pendingRank === null ? (
        <div className="picker-grid">
          {RANK_ORDER.map((r) => (
            <button
              key={r}
              className="picker-key"
              onClick={() => setPendingRank(r)}
              disabled={rankFullyUsed(r)}
            >
              {RANK_CHARS[r] === 'T' ? '10' : RANK_CHARS[r]}
            </button>
          ))}
        </div>
      ) : (
        <div>
          <div className="row between" style={{ marginBottom: 10 }}>
            <span className="pill gold" style={{ fontSize: 14 }}>
              {L.whichSuit(RANK_CHARS[pendingRank] === 'T' ? '10' : RANK_CHARS[pendingRank])}
            </span>
            <button className="btn sm ghost" onClick={() => setPendingRank(null)}>
              {L.otherRank}
            </button>
          </div>
          <div className="picker-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {[0, 1, 2, 3].map((s) => (
              <button
                key={s}
                className={`picker-key suit ${SUIT_CHARS[s]}`}
                onClick={() => pickSuit(s)}
                disabled={allUsed.has(makeCard(pendingRank, s))}
              >
                {SUIT_SYMBOLS[s]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
