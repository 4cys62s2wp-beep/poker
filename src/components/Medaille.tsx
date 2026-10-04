/* Die Medaille eines Abzeichens.
   ==============================

   Bis E-095 war sie ein Emoji in einem Kreis: 22 Zeichen, die auf jedem Gerät
   anders aussahen, sich nicht einfärben ließen und deren „noch nicht
   verdient“ ein `filter: grayscale(1)` mit Deckkraft war — also genau das
   Verblassen, das Regel 10.10 verbietet. Jetzt ist es ein Zeichen aus dem
   eigenen Satz in einem Ring. Verdient: Auszeichnungsfarbe, Schimmer.
   Noch nicht verdient: ein gestrichelter Umriss — es tritt zurück, ohne zu
   verblassen, und man erkennt, was es zu holen gibt. */

import type { CSSProperties } from 'react';
import { Icon, type IconName } from './Icon';

export function Medaille({
  name, verdient = true, groesse = 54,
}: { name: IconName; verdient?: boolean; groesse?: number }) {
  const stil = { '--medaille': `${groesse}px` } as CSSProperties;
  return (
    <span className={`medaille${verdient ? '' : ' offen'}`} style={stil} aria-hidden="true">
      <Icon name={name} size={Math.round(groesse * 0.46)} />
    </span>
  );
}
