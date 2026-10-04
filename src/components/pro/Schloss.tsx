/* Das Schloss — überall dasselbe (E-098).
   =======================================

   Vorher trugen nur die Module eines, als Zeichen ohne Wort; die Kacheln für
   Push/Fold, Szenario und Pro-Insights zeigten keins, die Seiten dahinter
   sperrten trotzdem. Jetzt liest jede Kachel, jeder Suchtreffer und jede
   Lektionszeile dieselbe Auskunft: `usePro().gesperrt(adresse)`. Wer Pro hat
   (oder die Testphase, oder wo es keine Monetarisierung gibt), sieht nichts. */

import { Icon } from '../Icon';
import { useLang } from '../../i18n';
import { STR } from '../../i18n/pages/pro';
import { usePro } from '../../lib/pro/ProProvider';

export function Schloss({ pfad }: { pfad: string }) {
  const { lang } = useLang();
  const L = STR[lang];
  const { gesperrt } = usePro();
  if (!gesperrt(pfad)) return null;
  /* Ein Modul ist ab Lektion 2 gesperrt, die erste steht offen — die Auskunft
     muss das sagen, sonst klingt „nur mit Pro“ nach einer verschlossenen Tür. */
  const modul = /^\/lernen\/m\d+$/.test(pfad.split(/[?#]/)[0]);
  return (
    <span className="pill gold schloss">
      <Icon name="lock" size={13} />
      {L.proBadge}
      <span className="sr-only">{`: ${modul ? L.lockedTileModule : L.lockedTile}`}</span>
    </span>
  );
}
