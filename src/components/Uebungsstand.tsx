/* Der Übungsstand über jedem Trainer.
   ==================================

   Vorher standen hier drei graue Pillen: „✓ 0 richtig", „0 gesamt",
   „Serie: 0". Drei Zahlen nebeneinander, alle gleich wichtig aussehend, und
   die interessanteste — die Serie — sah aus wie die anderen.

   Was sich geändert hat (E-038)
   -----------------------------
   1. **Die Serie ist die Hauptzahl.** Sie ist das Einzige, was man beim
      nächsten Antippen verlieren kann, und deshalb das Einzige, was Spannung
      erzeugt. Sie steht groß und in Akzentfarbe.
   2. **Die Bestserie wird gezeigt.** Sie wurde die ganze Zeit mitgezählt
      (`bestStreak`) und war nirgends zu sehen — eine Bestmarke, die niemand
      kennt, ist keine.
   3. **Keine Quote ohne Versuche.** „0 %" nach null Aufgaben ist keine
      Auskunft, sondern ein Vorwurf.

   In dieser Datei steht keine Ziffer. */

import { Icon } from './Icon';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/uebungsstand';

export interface Uebungswerte {
  attempts: number;
  correct: number;
  streak: number;
  bestStreak: number;
}

export function Uebungsstand({ werte }: { werte?: Uebungswerte }) {
  const { lang } = useLang();
  const L = STR[lang];
  const attempts = werte?.attempts ?? 0;
  const correct = werte?.correct ?? 0;
  const streak = werte?.streak ?? 0;
  const beste = werte?.bestStreak ?? 0;
  const quote = attempts === 0 ? null : Math.round((100 * correct) / attempts);
  /* Die laufende Serie ist die Bestserie, sobald sie sie erreicht — und das
     ist der Moment, den man sehen will. */
  const rekord = streak > 0 && streak >= beste;

  return (
    <div className="uebungsstand">
      <div className={`wert serie${streak > 0 ? ' laeuft' : ''}${rekord ? ' rekord' : ''}`}>
        <span className="zahl" aria-label={L.serieRing(streak)}>
          {streak > 0 && <Icon name="flame" size={18} />}
          {streak}
        </span>
        <span className="marke">{rekord ? L.neuerRekord : L.serie}</span>
      </div>
      <div className="wert">
        <span className="zahl" aria-label={quote === null ? L.nochNichts : L.trefferRing(quote)}>
          {quote === null ? L.ohneQuote : `${quote} %`}
        </span>
        <span className="marke">{L.treffer}</span>
      </div>
      <div className="wert">
        <span className="zahl" aria-label={L.besteRing(beste)}>{beste}</span>
        <span className="marke">{L.beste}</span>
      </div>
    </div>
  );
}
