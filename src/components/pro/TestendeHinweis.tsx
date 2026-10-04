/* Drei Tage und einen Tag vor dem Ende der Testphase: ein Satz, was danach
   gratis bleibt (E-099). Je einmal, wegklickbar, ohne Zähler und ohne Farbe. */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../i18n';
import { STR } from '../../i18n/pages/pro';
import { usePro } from '../../lib/pro/ProProvider';
import { FREE_MODULE_IDS, GRATIS_TRAINER_ANZAHL } from '../../lib/pro/plan';
import { faelligerHinweis, ladeGesehen, merkeGesehen } from '../../lib/pro/testende';

export function TestendeHinweis() {
  const { lang } = useLang();
  const L = STR[lang];
  const { enabled, pro, trialActive, trialDaysLeft } = usePro();
  const [gesehen, setGesehen] = useState(ladeGesehen);

  const stufe = enabled && !pro && trialActive ? faelligerHinweis(trialDaysLeft, gesehen) : null;
  if (stufe === null) return null;

  return (
    <section className="card testende-hinweis" aria-label={L.testendeTitel(trialDaysLeft)}>
      <div className="titel">{L.testendeTitel(trialDaysLeft)}</div>
      <p className="small muted">{L.testendeText(FREE_MODULE_IDS.length, GRATIS_TRAINER_ANZAHL)}</p>
      <div className="row wrap">
        <Link className="btn sm" to="/pro">{L.unlock}</Link>
        <button
          type="button"
          className="btn sm ghost"
          onClick={() => { merkeGesehen(stufe); setGesehen(stufe); }}
        >
          {L.testendeOk}
        </button>
      </div>
    </section>
  );
}
