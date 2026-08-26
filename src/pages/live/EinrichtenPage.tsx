/* Abend einrichten: vom Koffer zur Blindstruktur.
   ==============================================

   Ein Bildschirm, kein Assistent mit Schritten. Wer am Tisch sitzt, will
   nicht durch vier Seiten blättern — er trägt ein, was da ist, und sieht
   sofort, was dabei herauskommt.

   Gerechnet wird bei jeder Eingabe. Zwischen Eingabe und Ergebnis liegt
   keine Wartezeit und keine Animation (DESIGN.md, Abschnitt 4).

   In dieser Datei steht keine Gestaltungszahl. Alles, was aussieht wie eine
   Zahl, ist entweder eine Eingabe des Nutzers oder ein Rechenergebnis. */

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackLink } from '../../components/ui';
import { useLang } from '../../i18n';
import { STR } from '../../i18n/pages/live';
import { VOREINSTELLUNG, baueStruktur, type Tempo } from '../../lib/live/blinds';
import { verteile, type Sorte } from '../../lib/live/verteilung';
import { speichereLaufende } from '../../lib/session/laufend';

/** Ein üblicher Koffer als Vorschlag — man ändert ihn schneller, als man ihn
 *  von null einträgt. */
const VORSCHLAG: Sorte[] = [
  { name: 'weiß', anzahl: 150 },
  { name: 'rot', anzahl: 100 },
  { name: 'grün', anzahl: 50 },
];

const DAUERN = [90, 120, 150, 180, 240];
const TEMPI: Tempo[] = ['gemuetlich', 'normal', 'schnell'];

export function EinrichtenPage() {
  const { lang } = useLang();
  const L = STR[lang];
  const navigate = useNavigate();

  const [sorten, setSorten] = useState<Sorte[]>(VORSCHLAG);
  const [namen, setNamen] = useState<string[]>(['', '']);
  const [euro, setEuro] = useState('');
  const [dauer, setDauer] = useState(DAUERN[2]);
  const [tempo, setTempo] = useState<Tempo>('normal');
  const [gleich, setGleich] = useState(false);

  const spieler = namen.filter((n) => n.trim() !== '').length;

  const plan = useMemo(() => {
    if (spieler < 2) return null;
    return verteile({
      sorten,
      spieler,
      euroJeSpieler: euro.trim() === '' ? undefined : Number(euro.replace(',', '.')),
    });
  }, [sorten, spieler, euro]);

  const struktur = useMemo(() => {
    if (!plan) return null;
    return baueStruktur({
      dauer_min: dauer,
      startchips: plan.startchips,
      spieler,
      kleinsterChip: plan.smallBlind,
      tempo,
      gleichbleibend: gleich,
    });
  }, [plan, dauer, spieler, tempo, gleich]);

  const bereit = plan !== null && plan.reicht && struktur !== null;

  function starte() {
    if (!bereit || !plan || !struktur) return;
   
    speichereLaufende({
      begonnen: Date.now(),
      spieler: namen
        .map((n) => n.trim())
        .filter((n) => n !== '')
        .map((name) => ({ name, eingekauft: plan.startchips, stand: plan.startchips })),
      startchips: plan.startchips,
      stufen: struktur.stufen.map((s) => [s.sb, s.bb] as [number, number]),
      stufendauer_s: struktur.stufendauer_s,
      stufe: 0,
      verbraucht_ms: 0,
      laeuft_seit: Date.now(),
    });
    navigate('/session/live');
  }

  return (
    <div>
      <BackLink to="/session" label={L.zurueck} />
      <div className="page-header">
        <h1>{L.einrichtenTitel}</h1>
        <p className="sub">{L.einrichtenSub}</p>
      </div>

      <div className="einrichten">
        {/* ── Koffer ───────────────────────────────────────────────────── */}
        <section className="einrichten-block">
          <h2>{L.kofferTitel}</h2>
          <p className="hinweis">{L.kofferSub}</p>
          {sorten.map((s, i) => (
            <div key={i} className="einrichten-zeile">
              <input
                aria-label={L.farbe}
                value={s.name}
                placeholder={L.farbe}
                onChange={(e) => setSorten(sorten.map((x, j) =>
                  (j === i ? { ...x, name: e.target.value } : x)))}
              />
              <input
                aria-label={L.anzahl}
                className="schmal"
                inputMode="numeric"
                value={s.anzahl || ''}
                placeholder={L.anzahl}
                onChange={(e) => setSorten(sorten.map((x, j) =>
                  (j === i ? { ...x, anzahl: Number(e.target.value.replace(/\D/g, '')) } : x)))}
              />
              <button
                type="button"
                className="einrichten-knopf"
                aria-label={L.farbeWeg}
                onClick={() => setSorten(sorten.filter((_, j) => j !== i))}
              >
                −
              </button>
            </div>
          ))}
          <button
            type="button"
            className="einrichten-knopf"
            onClick={() => setSorten([...sorten, { name: '', anzahl: 0 }])}
          >
            {L.farbeHinzu}
          </button>
        </section>

        {/* ── Spieler ──────────────────────────────────────────────────── */}
        <section className="einrichten-block">
          <h2>{L.spielerNamen}</h2>
          <p className="hinweis">{L.spielerNamenSub}</p>
          {namen.map((n, i) => (
            <div key={i} className="einrichten-zeile">
              <input
                aria-label={L.namePlatzhalter}
                value={n}
                placeholder={L.namePlatzhalter}
                onChange={(e) => setNamen(namen.map((x, j) => (j === i ? e.target.value : x)))}
              />
              <button
                type="button"
                className="einrichten-knopf"
                aria-label={L.farbeWeg}
                onClick={() => setNamen(namen.filter((_, j) => j !== i))}
              >
                −
              </button>
            </div>
          ))}
          <button
            type="button"
            className="einrichten-knopf"
            onClick={() => setNamen([...namen, ''])}
          >
            {L.spielerHinzu}
          </button>
        </section>

        {/* ── Geld ─────────────────────────────────────────────────────── */}
        <section className="einrichten-block">
          <h2>{L.einsatzTitel}</h2>
          <p className="hinweis">{L.einsatzSub}</p>
          <div className="einrichten-zeile">
            <input
              aria-label={L.euroJeSpieler}
              inputMode="decimal"
              value={euro}
              placeholder={L.euroJeSpieler}
              onChange={(e) => setEuro(e.target.value)}
            />
          </div>
        </section>

        {/* ── Dauer und Tempo ──────────────────────────────────────────── */}
        <section className="einrichten-block">
          <h2>{L.dauerTitel}</h2>
          <p className="hinweis">{L.dauerSub}</p>
          <div className="einrichten-wahl">
            {DAUERN.map((d) => (
              <button
                key={d}
                type="button"
                aria-pressed={dauer === d}
                onClick={() => { setDauer(d); }}
              >
                {L.dauerMinuten(d)}
              </button>
            ))}
          </div>
        </section>

        <section className="einrichten-block">
          <h2>{L.tempoTitel}</h2>
          <div className="einrichten-wahl">
            {TEMPI.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={tempo === t && !gleich}
                onClick={() => { setTempo(t); setGleich(false); }}
              >
                {t === 'gemuetlich' ? L.tempoGemuetlich
                  : t === 'normal' ? L.tempoNormal : L.tempoSchnell}
                <br />
                <span className="hinweis">{L.tempoStufe(VOREINSTELLUNG[t])}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            className="einrichten-knopf"
            aria-pressed={gleich}
            onClick={() => { setGleich(!gleich); }}
          >
            {L.gleichbleibend}
          </button>
          <p className="hinweis">{L.gleichbleibendSub}</p>
        </section>

        {/* ── Ergebnis ─────────────────────────────────────────────────── */}
        {plan && (
          <section className="einrichten-block">
            <h2>{L.ergebnisTitel}</h2>

            {plan.hinweise.includes('material-reicht-nicht') && (
              <p className="einrichten-warnung">{L.hinweisMaterial(plan.maxSpieler)}</p>
            )}
            {plan.hinweise.includes('wenige-kleine-chips') && (
              <p className="einrichten-warnung">{L.hinweisWenigKleine}</p>
            )}
            {plan.hinweise.includes('eine-sorte-bleibt-liegen') && (
              <p className="einrichten-warnung">{L.hinweisSorteLiegt}</p>
            )}

            <div className="einrichten-ergebnis">
              <span className="hinweis">{L.startchips}</span>
              <span className="einrichten-gross">{plan.startchips.toLocaleString(lang)}</span>
              <div className="einrichten-tabelle">
                {plan.sorten.map((s) => (
                  <div key={s.name}>
                    <span>{L.jeSpielerKurz(s.jeSpieler, s.name)}</span>
                    <span>{L.wertJeChip(s.wert)}</span>
                  </div>
                ))}
                <div>
                  <span>{L.blindsAnfang}</span>
                  <span>{plan.smallBlind} / {plan.bigBlind}</span>
                </div>
                {plan.punkteJeEuro !== null && (
                  <div>
                    <span>{L.kurs(plan.punkteJeEuro.toLocaleString(lang), euro)}</span>
                    <span />
                  </div>
                )}
              </div>
            </div>

            {struktur && (
              <>
                <p className="hinweis">
                  {struktur.finale_moeglich
                    ? L.finaleGut(Math.round(struktur.bb_am_ende))
                    : struktur.noetige_dauer_min !== null
                      ? L.finaleZuKurz(struktur.noetige_dauer_min)
                      : ''}
                </p>
                <div className="einrichten-stufen">
                  {struktur.stufen.map((s) => (
                    <span key={s.nummer}>{s.sb} / {s.bb}</span>
                  ))}
                </div>
              </>
            )}
          </section>
        )}

        <button
          type="button"
          className="einrichten-knopf haupt"
          disabled={!bereit}
          onClick={starte}
        >
          {bereit ? L.losgehts : L.losgehtsFehlt}
        </button>
      </div>
    </div>
  );
}
