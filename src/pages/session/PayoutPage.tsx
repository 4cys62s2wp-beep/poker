/* Auszahlungs-Rechner für den Heimturnier-Abend.
   ==============================================

   Die Rechnung selbst steht in src/lib/poker/payout.ts und ist dort mit
   14 Tests abgesichert. Diese Datei ist nur Oberfläche: Eingaben einsammeln,
   Ergebnis zeigen.

   Die wichtigste Gestaltungsentscheidung steht im Untertitel: Diese Frage
   gehört an den ANFANG des Abends. Wird sie erst gestellt, wenn das Geld auf
   dem Tisch liegt, rechnet jeder anders. */

import { useMemo, useState } from 'react';
import { PageHeader, EmptyState } from '../../components/ui';
import { useLang } from '../../i18n';
import { STR } from '../../i18n/pages/payout';
import { berechneAuszahlung, strukturFuer } from '../../lib/poker/payout';

const RUNDUNGEN = [0, 1, 5, 10, 25, 50];

export function PayoutPage() {
  const { lang } = useLang();
  const L = STR[lang];
  const nf = lang === 'de' ? 'de-DE' : 'en-GB';

  const [spieler, setSpieler] = useState(8);
  const [buyIn, setBuyIn] = useState(10);
  const [rebuys, setRebuys] = useState(0);
  const [rundung, setRundung] = useState(1);

  const plan = useMemo(
    () => berechneAuszahlung({ spieler, buyIn, rebuys, rundung }),
    [spieler, buyIn, rebuys, rundung],
  );

  const geld = (n: number) =>
    n.toLocaleString(nf, { maximumFractionDigits: rundung > 0 ? 0 : 2 });

  /* Bei kleinen Feldern bekommt nur der Sieger etwas. Das überrascht Leute,
     deshalb steht die Begründung direkt daneben statt in einer Fußnote. */
  const kleinesFeld = spieler >= 2 && strukturFuer(spieler).length === 1;

  return (
    <div>
      <PageHeader
        eyebrow={L.eyebrow}
        title={L.title}
        sub={L.sub}
        backTo="/session"
        backLabel={L.back}
      />

      <div className="card" style={{ marginBottom: 'var(--sp-4)' }}>
        <div
          style={{
            display: 'grid', gap: 'var(--sp-4)',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          }}
        >
          <Feld
            id="pa-spieler" label={L.playersLabel}
            value={spieler} onChange={setSpieler} min={2} max={200}
          />
          <Feld
            id="pa-buyin" label={L.buyInLabel}
            value={buyIn} onChange={setBuyIn} min={0} max={100000}
          />
          <Feld
            id="pa-rebuys" label={L.rebuysLabel} hint={L.rebuysHint}
            value={rebuys} onChange={setRebuys} min={0} max={500}
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
                <option key={r} value={r}>{r === 0 ? L.roundingNone : geld(r)}</option>
              ))}
            </select>
            <div className="small faint" style={{ marginTop: 'var(--sp-1)' }}>{L.roundingHint}</div>
          </div>
        </div>
      </div>

      {plan.auszahlungen.length === 0 ? (
        <EmptyState icon="chip" title={L.emptyTitle} body={L.emptyBody} />
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
          {L.ruleBody}
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
    </div>
  );
}

/** Ein Zahlenfeld. Leert sich zu 0 statt zu NaN – sonst verschwindet beim
    Löschen der letzten Ziffer das ganze Ergebnis. */
function Feld({
  id, label, hint, value, onChange, min, max,
}: {
  id: string; label: string; hint?: string;
  value: number; onChange: (n: number) => void; min: number; max: number;
}) {
  return (
    <div>
      <label htmlFor={id} className="small muted" style={{ display: 'block' }}>{label}</label>
      <input
        id={id}
        className="text-input"
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value);
          onChange(Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min);
        }}
        style={{ marginTop: 'var(--sp-1)', width: '100%' }}
      />
      {hint && <div className="small faint" style={{ marginTop: 'var(--sp-1)' }}>{hint}</div>}
    </div>
  );
}
