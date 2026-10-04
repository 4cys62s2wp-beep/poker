/* Das Urteil über eine Antwort — an einer Stelle.
   ================================================

   Quiz, Wiederholung und alle Trainer bewerten eine Antwort. Jeder tat es mit
   eigenem Wort und einem ✓ oder ✗ als Textzeichen. Das Zeichen kam aus der
   Schrift, nicht aus dem Symbolsatz; und in der Wiederholung und im
   Push/Fold-Trainer gab es gar keines, sodass dort nur die Farbe
   unterschied (Regel 11.4).

   Jetzt: drei Urteile, je ein Wort und eine Form. Der Haken und das Kreuz
   kommen aus `Icon`; das Wort steht daneben, die Farbe kommt dazu. */

import type { ReactNode } from 'react';
import { Icon } from './Icon';
import { useLang } from '../i18n';
import { STR } from '../i18n/rueckmeldung';

export type Urteil = 'richtig' | 'falsch' | 'knapp';

const FORM = { richtig: 'good', falsch: 'bad', knapp: 'warn' } as const;

/** Kopfzeile des Urteils: Zeichen und Wort. Auch für Bildschirme, die ihre
 *  Rückmeldung selbst setzen (der Pot-Odds-Drill), damit Zeichen, Größe und
 *  Wort an einer Stelle liegen. */
export function UrteilKopf({ urteil }: { urteil: Urteil }) {
  const { lang } = useLang();
  return (
    <strong className="rueckmeldung-kopf" data-urteil={urteil}>
      <Icon name={urteil === 'richtig' ? 'check' : 'x'} size={18} />
      {STR[lang][urteil]}
    </strong>
  );
}

export function Rueckmeldung({
  urteil, children, className, style,
}: {
  urteil: Urteil;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`feedback-box ${FORM[urteil]}${className ? ` ${className}` : ''}`}
      style={style}
      role="status"
      aria-live="polite"
    >
      <UrteilKopf urteil={urteil} />
      {children}
    </div>
  );
}
