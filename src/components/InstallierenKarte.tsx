/* Der Installieren-Hinweis: nur dort, wo er etwas bringt, und nur, wenn er geht. */

import { useLang } from '../i18n';
import { STR } from '../i18n/pages/installieren';
import { useInstallieren } from '../lib/installieren';

export function InstallierenKarte() {
  const { lang } = useLang();
  const L = STR[lang];
  const { art, installiere } = useInstallieren();
  if (art === 'installiert' || art === 'keine') return null;
  return (
    <section className="installieren-karte card" aria-label={L.titel}>
      <div className="titel">{L.titel}</div>
      {art === 'knopf' ? (
        <>
          <p className="small muted">{L.knopfText}</p>
          <button type="button" className="btn sm" onClick={() => void installiere()}>{L.knopf}</button>
        </>
      ) : (
        <p className="small muted">{L.iosText}</p>
      )}
    </section>
  );
}
