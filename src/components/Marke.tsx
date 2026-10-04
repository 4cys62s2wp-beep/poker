/* Die Markenkachel: ein Pik auf grünem Grund (`public/icons/icon.svg`). */

import { Icon } from './Icon';

export function Marke({ groesse = 34 }: { groesse?: number }) {
  return (
    <span
      className="marke-kachel"
      aria-hidden="true"
      style={{ ['--kachel' as string]: `${groesse}px` }}
    >
      {/* Der Pik füllt 60 % der Kachel — ein Zeichen, das man auf einem
          Home-Bildschirm erkennen soll, und nicht ein Muster darauf. */}
      <Icon name="spade" size={Math.round(groesse * 0.8)} />
    </span>
  );
}
