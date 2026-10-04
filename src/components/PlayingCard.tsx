import type { Card } from '../lib/poker/cards';
import { RANK_CHARS, SUIT_CHARS, SUIT_SYMBOLS, parseCard, rankOf, suitOf } from '../lib/poker/cards';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/playingcard';

/** Wie groß die Karte gezeichnet wird.
 *
 *  `xl` ist seit E-036 dazugekommen. Der Grund steht dort ausführlich; kurz:
 *  Poker hat genau einen Gegenstand, den man ansehen will, und der war in
 *  dieser App 48 Pixel breit. Eine Karte, die man erkennt, bevor man liest,
 *  ist keine Verzierung — sie ist der Inhalt. */
type Groesse = 'sm' | 'md' | 'lg' | 'xl';

interface Props {
  /** Karte als Zahl (0–51) oder String ("As"). Ohne Angabe: Kartenrücken. */
  card?: Card | string;
  size?: Groesse;
}

export function PlayingCard({ card, size = 'md' }: Props) {
  const { lang } = useLang();
  const T = STR[lang];
  const sizeCls = size === 'md' ? '' : ` ${size}`;
  if (card === undefined) {
    // role="img" – auf einem <div> (Rolle "generic") ignorieren die meisten
    // Screenreader das aria-label.
    return <div className={`pcard back${sizeCls}`} role="img" aria-label={T.faceDown} />;
  }
  const c = typeof card === 'string' ? parseCard(card) : card;
  const rankIdx = rankOf(c);
  const rank = RANK_CHARS[rankIdx];
  const suit = suitOf(c);
  const suitCls = SUIT_CHARS[suit];
  const symbol = SUIT_SYMBOLS[suit];
  const displayRank = rank === 'T' ? '10' : rank;
  // Sprechbar statt „10♦“: „Karo Zehn“ / „Ten of diamonds“.
  const label = T.cardLabel(T.ranks[rankIdx], T.suits[suit]);
  return (
    <div className={`pcard suit-${suitCls}${sizeCls}`} role="img" aria-label={label}>
      <span className="corner">
        <span className="rang" data-rang={displayRank}>{displayRank}</span>
        <span className="c-suit">{symbol}</span>
      </span>
      <span className="center-suit">{symbol}</span>
      {/* Der zweite Index unten rechts, auf dem Kopf — nur auf der großen
          Karte (E-075). Auf einer echten Karte ist er das Kennzeichen, an dem
          das Auge eine Spielkarte erkennt; auf einem Handy, wo Karten sich
          überlappen und angeschnitten sind, zeigte er an fünf Stellen eine 9
          als 6. Wo die große Karte überlappt, blendet das Stylesheet ihn aus.
          `aria-hidden`: Für einen Screenreader ist er eine Wiederholung. */}
      {size === 'xl' && (
        <span className="corner unten" aria-hidden="true">
          <span className="rang" data-rang={displayRank}>{displayRank}</span>
          <span className="c-suit">{symbol}</span>
        </span>
      )}
    </div>
  );
}

export function CardsRow({ cards, size = 'md' }: { cards: Array<Card | string | undefined>; size?: Groesse }) {
  return (
    <div className="cards-row">
      {cards.map((c, i) => (
        <PlayingCard key={i} card={c} size={size} />
      ))}
    </div>
  );
}
