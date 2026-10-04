/* Auszahlungs-Rechner für den Heimturnier-Abend.
   ==============================================

   Die Rechnung selbst steht in src/lib/poker/payout.ts und ist dort mit
   14 Tests abgesichert. Diese Datei ist nur Oberfläche: Eingaben einsammeln,
   Ergebnis zeigen.

   Die wichtigste Gestaltungsentscheidung steht im Untertitel: Diese Frage
   gehört an den ANFANG des Abends. Wird sie erst gestellt, wenn das Geld auf
   dem Tisch liegt, rechnet jeder anders.

   Drei Dinge, die der erste Entwurf falsch machte (E-094):
   - Die Felder waren Zahlenfelder, die bei jedem Tastendruck begrenzt
     wurden. Wer „12" tippen wollte und mit „1" begann, sah „2" (Mindestwert)
     — und „7,50" ließ sich gar nicht schreiben. Jetzt sind es Textfelder, die
     `zahlAusEingabe` liest und erst beim Verlassen zurechtrücken.
   - Das Geld war immer „Zahl ohne Einheit". Ein Abend mit Spielgeld-Chips
     braucht dasselbe Blatt, nur ohne Euro: Die Einheit ist wählbar.
   - Wer den Abend in der App führt, musste alles noch einmal eintippen. */



import { useMemo, useState } from 'react';
import { PageHeader, EmptyState } from '../../components/ui';
import { zeichenFuer } from '../../lib/zeichen';
import { useLang } from '../../i18n';
import { STR } from '../../i18n/pages/payout';
import { berechneAuszahlung, plaetzeNachFeld, strukturFuer } from '../../lib/poker/payout';
import { zahlAusEingabe } from '../../lib/eingabe/zahl';
import { ladeLaufende } from '../../lib/session/laufend';
import { auszahlungAusAbend } from '../../lib/session/abrechnung';
import { Spielerschutz } from '../../components/Spielerschutz';

const RUNDUNGEN = [0, 1, 5, 10, 25, 50];

type Einheit = 'euro' | 'chips';

export function PayoutPage() {
  const { lang } = useLang();
  const L = STR[lang];
  const nf = lang === 'de' ? 'de-DE' : 'en-GB';
  const abend = useMemo(() => auszahlungAusAbend(ladeLaufende()), []);

  const zuText = (n: number) => n.toLocaleString(nf, { useGrouping: false, maximumFractionDigits: 2 });

  const [einheit, setEinheit] = useState<Einheit>('euro');
  const [spielerT, setSpielerT] = useState('8');
  const [buyInT, setBuyInT] = useState('10');
  const [rebuysT, setRebuysT] = useState('0');
  const [rundung, setRundung] = useState(1);

  /* Gerechnet wird mit dem, was im Feld steht, begrenzt auf das Sinnvolle.
     Ein halbfertiger Text („7,") bleibt stehen; erst beim Verlassen des Felds
     wird er zur Zahl. */
  const lies = (t: string, min: number, max: number, ganz: boolean): number | null => {
    const n = zahlAusEingabe(t, lang);
    if (n === null) return null;
    const v = ganz ? Math.floor(n) : n;
    return Math.min(max, Math.max(min, v));
  };
  const spieler = lies(spielerT, 2, 200, true);
  const buyIn = lies(buyInT, 0, 100000, false);
  const rebuys = lies(rebuysT, 0, 500, true);

  const plan = useMemo(
    () => berechneAuszahlung({ spieler: spieler ?? 0, buyIn: buyIn ?? 0, rebuys: rebuys ?? 0, rundung }),
    [spieler, buyIn, rebuys, rundung],
  );

  const geld = (n: number) => {
    const zahl = n.toLocaleString(nf, {
      maximumFractionDigits: rundung > 0 || Number.isInteger(n) ? 0 : 2,
      ...(einheit === 'euro' ? { style: 'currency' as const, currency: 'EUR' } : {}),
    });
    return einheit === 'euro' ? zahl : `${zahl} ${L.einheitChips}`;
  };
  /* In der Auswahl steht nur die Zahl: „1 Chips“ wäre falsches Deutsch, und die
     Einheit steht gleich daneben im Schalter. */
  const stufe = (n: number) => (einheit === 'euro' ? geld(n) : n.toLocaleString(nf));

  /* Bei kleinen Feldern bekommt nur der Sieger etwas. Das überrascht Leute,
     deshalb steht die Begründung direkt daneben statt in einer Fußnote. */
  const kleinesFeld = spieler !== null && spieler >= 2 && strukturFuer(spieler).length === 1;

  const staffel = plaetzeNachFeld().map((z) => L.staffelTeil(z.abSpieler, z.plaetze)).join(', ');

  function uebernimm() {
    if (!abend) return;
    setEinheit(abend.einheit);
    setSpielerT(zuText(abend.spieler));
    setBuyInT(zuText(abend.buyIn));
    setRebuysT(zuText(abend.rebuys));
  }

  return (
    <div>
      <PageHeader
        title={L.title}
        sub={L.sub}
        backTo="/session"
      />

      {abend && (
        <div className="card row between wrap" style={{ gap: 'var(--sp-3)', marginBottom: 'var(--sp-4)' }}>
          <span className="small muted">{L.ausAbendHinweis(abend.spieler, abend.rebuys)}</span>
          <button type="button" className="btn sm" onClick={uebernimm}>{L.ausAbend}</button>
        </div>
      )}

      <div className="card" style={{ marginBottom: 'var(--sp-4)' }}>
        <div style={{ marginBottom: 'var(--sp-4)' }}>
          <div className="small muted" id="pa-einheit">{L.einheitLabel}</div>
          <div className="segmented" role="radiogroup" aria-labelledby="pa-einheit" style={{ marginTop: 'var(--sp-1)' }}>
            {(['euro', 'chips'] as const).map((e) => (
              <button
                key={e}
                type="button"
                role="radio"
                aria-checked={einheit === e}
                className={einheit === e ? 'on' : ''}
                onClick={() => setEinheit(e)}
              >
                {e === 'euro' ? L.einheitEuro : L.einheitChips}
              </button>
            ))}
          </div>
        </div>
        <div
          style={{
            display: 'grid', gap: 'var(--sp-4)',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          }}
        >
          <Feld
            id="pa-spieler" label={L.playersLabel} fehler={L.zahlFehler}
            text={spielerT} wert={spieler} onText={setSpielerT} zuText={zuText}
            min={2} max={200} ganz
          />
          <Feld
            id="pa-buyin" label={L.buyInLabel} fehler={L.zahlFehler}
            text={buyInT} wert={buyIn} onText={setBuyInT} zuText={zuText}
            min={0} max={100000}
          />
          <Feld
            id="pa-rebuys" label={L.rebuysLabel} hint={L.rebuysHint} fehler={L.zahlFehler}
            text={rebuysT} wert={rebuys} onText={setRebuysT} zuText={zuText}
            min={0} max={500} ganz
          />

          <div>
            <label htmlFor="pa-rundung" className="small muted" style={{ display: 'block' }}>
              {L.roundingLabel}
            </label>
            <select
              id="pa-rundung"
              className="text-input"
              value={rundung}
              onChange={(e) => setRundung(Number(e.target.value))}
              style={{ marginTop: 'var(--sp-1)', width: '100%' }}
            >
              {RUNDUNGEN.map((r) => (
                <option key={r} value={r}>{r === 0 ? L.roundingNone : stufe(r)}</option>
              ))}
            </select>
            <div className="small faint" style={{ marginTop: 'var(--sp-1)' }}>{L.roundingHint}</div>
          </div>
        </div>
      </div>

      {plan.auszahlungen.length === 0 ? (
        <EmptyState icon={zeichenFuer('/session/auszahlung')} title={L.emptyTitle} body={L.emptyBody} />
      ) : (
        <>
          <div
            className="card row between wrap"
            style={{ gap: 'var(--sp-4)', marginBottom: 'var(--sp-4)' }}
          >
            <div>
              <div className="small muted">{L.potLabel}</div>
              <div
                className="big-stat"
                style={{ fontSize: 'var(--fs-h1)', fontVariantNumeric: 'tabular-nums' }}
              >
                {geld(plan.topf)}
              </div>
            </div>
            <div className="small muted">{L.placesPaid(plan.bezahltePlaetze)}</div>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {plan.auszahlungen.map((a) => (
                  <tr key={a.platz} style={{ borderTop: a.platz === 1 ? 'none' : '1px solid var(--border)' }}>
                    <td
                      style={{
                        padding: 'var(--sp-3) var(--sp-4)', width: '3.5rem',
                        color: a.platz === 1 ? 'var(--auszeichnung)' : 'var(--text-dim)',
                        fontWeight: 'var(--fw-bold)', fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {L.place(a.platz)}
                    </td>
                    <td
                      style={{
                        padding: 'var(--sp-3) var(--sp-2)', textAlign: 'right',
                        fontWeight: 'var(--fw-bold)', fontVariantNumeric: 'tabular-nums',
                        fontSize: a.platz === 1 ? 'var(--fs-h3)' : 'var(--fs-body)',
                      }}
                    >
                      {geld(a.betrag)}
                    </td>
                    <td
                      className="small muted"
                      style={{
                        padding: 'var(--sp-3) var(--sp-4)', textAlign: 'right',
                        width: '4.5rem', fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {Math.round(a.anteil * 100)} %
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {plan.rundungsrest > 0 && (
            <p className="small faint" style={{ marginTop: 'var(--sp-3)' }}>
              {L.restNote(geld(plan.rundungsrest))}
            </p>
          )}
        </>
      )}

      <div className="card" style={{ marginTop: 'var(--sp-5)' }}>
        <div className="eyebrow">{L.ruleTitle}</div>
        <p className="small muted" style={{ marginTop: 'var(--sp-2)', marginBottom: 0 }}>
          {L.ruleBody(staffel)}
        </p>
        {kleinesFeld && (
          <p className="small muted" style={{ marginTop: 'var(--sp-2)', marginBottom: 0 }}>
            {L.smallFieldNote}
          </p>
        )}
        <p className="small faint" style={{ marginTop: 'var(--sp-3)', marginBottom: 0 }}>
          {L.printHint}
        </p>
      </div>

      <Spielerschutz />
    </div>
  );
}

/** Ein Zahlenfeld, das Text bleibt, solange getippt wird.
 *
 *  Ein Feld vom Typ „number", das bei jedem Tastendruck begrenzt wird, nimmt
 *  dem Tippenden die Eingabe aus der Hand: Wer für „12" mit der „1" beginnt,
 *  sieht sofort den Mindestwert. Hier wird erst beim Verlassen des Felds
 *  begrenzt und die Schreibweise der Sprache hergestellt; ein leeres oder
 *  unlesbares Feld bleibt, wie es ist, und sagt es. */
function Feld({
  id, label, hint, fehler, text, wert, onText, zuText, min, max, ganz = false,
}: {
  id: string; label: string; hint?: string; fehler: string;
  text: string; wert: number | null; onText: (t: string) => void;
  zuText: (n: number) => string; min: number; max: number; ganz?: boolean;
}) {
  const unlesbar = text.trim() !== '' && wert === null;
  return (
    <div>
      <label htmlFor={id} className="small muted" style={{ display: 'block' }}>{label}</label>
      <input
        id={id}
        className="text-input"
        type="text"
        inputMode={ganz ? 'numeric' : 'decimal'}
        autoComplete="off"
        value={text}
        aria-invalid={unlesbar}
        aria-describedby={unlesbar ? `${id}-fehler` : undefined}
        onChange={(e) => onText(e.target.value)}
        onBlur={() => {
          if (wert !== null) onText(zuText(Math.min(max, Math.max(min, wert))));
        }}
        style={{ marginTop: 'var(--sp-1)', width: '100%' }}
      />
      {unlesbar && <div className="small" id={`${id}-fehler`} role="alert" style={{ marginTop: 'var(--sp-1)', color: 'var(--danger-lesbar)' }}>{fehler}</div>}
      {hint && !unlesbar && <div className="small faint" style={{ marginTop: 'var(--sp-1)' }}>{hint}</div>}
    </div>
  );
}
