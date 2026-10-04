/* Die Quellen der Suche in der gewählten Sprache. */

import { useMemo } from 'react';
import { useLang } from '../../i18n';
import { werkzeugZiele } from './ziele';
import type { Quellen } from './index';

export function useSuchquellen(): Quellen {
  const { lang, content } = useLang();
  return useMemo(
    () => ({ werkzeuge: werkzeugZiele(lang), module: content.modules, glossar: content.glossary }),
    [lang, content],
  );
}
