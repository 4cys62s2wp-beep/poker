/* „Neue Version bereit · Neu laden" — siehe src/lib/aktualisierung.ts. */

import { useSyncExternalStore } from 'react';
import { abonniere, uebernimmFassung } from '../lib/aktualisierung';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/layout';

export function UpdateBand() {
  const { lang } = useLang();
  const L = STR[lang];
  const uebernehmen = useSyncExternalStore(abonniere, uebernimmFassung, () => null);
  if (!uebernehmen) return null;
  return (
    <div className="update-band" role="status">
      <span>{L.updateBereit}</span>
      <button type="button" className="btn sm primary" onClick={uebernehmen}>{L.updateLaden}</button>
    </div>
  );
}
