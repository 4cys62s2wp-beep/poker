/* Das Suchfeld — dasselbe auf „Nachschlagen“, auf „Lernen“ und im Suchdialog. */

import { Icon } from './Icon';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/suche';

interface Props {
  id: string;
  value: string;
  onChange: (v: string) => void;
  autoFokus?: boolean;
}

export function SuchFeld({ id, value, onChange, autoFokus = false }: Props) {
  const { lang } = useLang();
  const L = STR[lang];
  return (
    <div className="such-feld">
      <label htmlFor={id} className="sr-only">{L.label}</label>
      <span className="such-lupe" aria-hidden="true"><Icon name="search" size={17} /></span>
      <input
        id={id}
        className="search-input"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={L.platzhalter}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        autoFocus={autoFokus}
      />
    </div>
  );
}
