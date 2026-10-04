/* Hinweis beim Erreichen eines Limits.
   Bewusst freundlich: sagt, wann es gratis weitergeht, und macht das
   Upgrade zum bequemeren Weg – nicht zum einzigen. Ein Blatt von unten wie
   überall sonst in der App (`Blatt.tsx`), nicht ein eigener Dialog. */

import { Link } from 'react-router-dom';
import { Blatt } from '../Blatt';
import { useLang } from '../../i18n';
import { STR } from '../../i18n/pages/pro';
import { usePro } from '../../lib/pro/ProProvider';
import { FEATURE_RULES } from '../../lib/pro/plan';

export function PaywallModal() {
  const { paywallReason, closePaywall, enabled } = usePro();
  const { lang } = useLang();
  const L = STR[lang];
  if (!enabled || paywallReason === null) return null;

  const body =
    paywallReason === 'coach' ? L.limitCoach(FEATURE_RULES.coach.freeDailyLimit ?? 0)
    : paywallReason === 'play' ? L.limitPlay(FEATURE_RULES['play-hands'].freeDailyLimit ?? 0)
    : L.lockedGeneric;
  const istLimit = paywallReason === 'coach' || paywallReason === 'play';

  return (
    <Blatt
      titel={istLimit ? L.limitTitle : L.lockedTitle}
      schliessenLabel={L.later}
      onClose={closePaywall}
    >
      <p className="muted paywall-text">{body}</p>
      <Link to="/pro" className="btn primary block" onClick={closePaywall}>
        {L.unlock}
      </Link>
    </Blatt>
  );
}
