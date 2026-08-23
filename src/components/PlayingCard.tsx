import type { Card } from '../lib/poker/cards';
import { RANK_CHARS, SUIT_CHARS, SUIT_SYMBOLS, parseCard, rankOf, suitOf } from '../lib/poker/cards';

interface Props {
  /** Karte als Zahl (0–51) oder String ("As"). Ohne Angabe: Kartenrücken. */
  card?: Card | string;
  size?: 'sm' | 'md' | 'lg';
}

export function PlayingCard({ card, size = 'md' }: Props) {
  const sizeCls = size === 'md' ? '' : ` ${size}`;
  if (card === undefined) {
    return <div className={`pcard back${sizeCls}`} aria-label="Verdeckte Karte" />;
  }
  const c = typeof card === 'string' ? parseCard(card) : card;
  const rank = RANK_CHARS[rankOf(c)];
  const suit = suitOf(c);
  const suitCls = SUIT_CHARS[suit];
  const symbol = SUIT_SYMBOLS[suit];
  const displayRank = rank === 'T' ? '10' : rank;
  return (
    <div className={`pcard suit-${suitCls}${sizeCls}`} aria-label={`${displayRank}${symbol}`}>
      <span className="corner">
        {displayRank}
        <span className="c-suit">{symbol}</span>
      </span>
      <span className="center-suit">{symbol}</span>
    </div>
  );
}

export function CardsRow({ cards, size = 'md' }: { cards: Array<Card | string | undefined>; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <div className="cards-row">
      {cards.map((c, i) => (
        <PlayingCard key={i} card={c} size={size} />
      ))}
    </div>
  );
}
