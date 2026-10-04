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
import { zahlAusEingabe } from '../../lib/eingabe/zahl';
import { Link, useNavigate } from 'react-router-dom';
import { InstallierenKarte } from '../../components/InstallierenKarte';
import { Zurueck } from '../../components/ui';
import { useLang } from '../../i18n';
import { STR } from '../../i18n/pages/live';
import { VOREINSTELLUNG, baueStruktur, type Tempo } from '../../lib/live/blinds';
import { verteile, type Sorte } from '../../lib/live/verteilung';
import { ladeLaufende, speichereLaufende } from '../../lib/session/laufend';
import { ladeAbende, sichereLaufendenAbend, speichereAbende, spielerUebersicht } from '../../lib/session/abende';
import { grobeDauer } from '../../lib/session/dauer';
import { FARBEN, kofferAlsSorten, ladeKoffer } from '../../lib/koffer';
import { ladeVorlage, speichereVorlage } from '../../lib/session/vorlage';

/** Ein üblicher Koffer als Vorschlag — man ändert ihn schneller, als man ihn
 *  von null einträgt. */
const VORSCHLAG: Sorte[] = [
  { name: 'weiß', anzahl: 150, farbe: FARBEN[0] },
  { name: 'rot', anzahl: 100, farbe: FARBEN[1] },
  { name: 'grün', anzahl: 50, farbe: FARBEN[3] },
];

/** Womit das Formular beginnt: der Koffer aus dem Chip-Rechner („Mein Koffer"),
 *  sonst der vom letzten Abend, sonst ein üblicher Vorschlag — so schnell geändert
 *  wie ein leeres Formular befüllt. */
function startKoffer(): { sorten: Sorte[]; ausRechner: boolean } {
  const k = ladeKoffer();
  const aus = k ? kofferAlsSorten(k) : [];
  if (aus.length > 0) return { sorten: aus, ausRechner: true };
  return { sorten: ladeVorlage()?.sorten ?? VORSCHLAG, ausRechner: false };
}

const DAUERN = [90, 120, 150, 180, 240];

function uhrzeit(ms: number, lang: string): string {
  return new Date(ms).toLocaleTimeString(lang === 'de' ? 'de-DE' : 'en-GB', { hour: '2-digit', minute: '2-digit' });
}
const TEMPI: Tempo[] = ['gemuetlich', 'normal', 'schnell'];

export function EinrichtenPage() {
  const { lang } = useLang();
  const L = STR[lang];
  const navigate = useNavigate();

  /* Einmal beim Öffnen gelesen, nicht bei jedem Zeichen. */
  const [vorlage] = useState(ladeVorlage);
  const [start] = useState(startKoffer);
  const [bekannte] = useState(() => spielerUebersicht(ladeAbende()).slice(0, 12));
  const [sorten, setSorten] = useState<Sorte[]>(start.sorten);
  const [namen, setNamen] = useState<string[]>(['', '']);
  const [euro, setEuro] = useState(vorlage?.euro ?? '');
  const [dauer, setDauer] = useState(vorlage?.dauer ?? DAUERN[2]);
  const [tempo, setTempo] = useState<Tempo>(vorlage?.tempo ?? 'normal');
  const [gleich, setGleich] = useState(vorlage?.gleich ?? false);
  /* Der Zeitplan rechnet ab dem Öffnen dieses Bildschirms — der Abend beginnt
     pausiert und startet mit dem Tipp auf „Uhr starten". */
  const [geoeffnet] = useState(() => Date.now());
  /* Einmal beim Öffnen gelesen: Läuft schon ein Abend, steht das hier oben —
     und ein Neustart legt ihn ab, statt ihn zu überschreiben. */
  const [laufend] = useState(ladeLaufende);

  const spieler = namen.filter((n) => n.trim() !== '').length;

  const plan = useMemo(() => {
    if (spieler < 2) return null;
    return verteile({
      sorten,
      spieler,
      euroJeSpieler: zahlAusEingabe(euro, lang) ?? undefined,
    });
  }, [sorten, spieler, euro, lang]);

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
  const euroNum = zahlAusEingabe(euro, lang) ?? undefined;

  function starte() {
    if (!bereit || !plan || !struktur) return;
    const jetzt = Date.now();
    /* Erst ablegen, was noch läuft — dann den neuen Abend beginnen. Gelesen
       wird hier frisch, nicht aus dem Zustand beim Öffnen: Ein zweiter Tab
       könnte inzwischen einen Abend gestartet haben. */
    speichereAbende(sichereLaufendenAbend(ladeAbende(), ladeLaufende(), jetzt));
    speichereVorlage({ sorten, dauer, tempo, gleich, euro });
    speichereLaufende({
      begonnen: jetzt,
      spieler: namen
        .map((n) => n.trim())
        .filter((n) => n !== '')
        .map((name) => ({ name, eingekauft: plan.startchips, stand: plan.startchips })),
      startchips: plan.startchips,
      /* Ohne Turnierende gibt es eine Stufe, die gilt (Cash): kein Countdown, kein
         Danach, kein Ton (E-094). */
      stufen: (gleich ? struktur.stufen.slice(0, 1) : struktur.stufen).map((s) => [s.sb, s.bb] as [number, number]),
      stufendauer_s: struktur.stufendauer_s,
      stufe: 0,
      verbraucht_ms: 0,
      /* Pausiert: Wer einen Abend anlegt, sitzt noch nicht am Tisch. Die Uhr
         läuft mit „Uhr starten" — dort, wo der Ton entsperrt werden kann. */
      laeuft_seit: null,
      modus: gleich ? 'cash' : 'turnier',
      ...(euroNum ? { euroJeSpieler: euroNum } : {}),
      ...(plan.punkteJeEuro ? { punkteJeEuro: plan.punkteJeEuro } : {}),
    });
    navigate('/session/live');
  }

  return (
    <div>
      <Zurueck to="/session" />
      <div className="page-header">
        <h1>{L.einrichtenTitel}</h1>
        <p className="sub">{L.einrichtenSub}</p>
      </div>

      {laufend && (
        <section className="einrichten-laeuft" role="status">
          <p className="einrichten-laeuft-titel">
            {L.laeuftNoch(grobeDauer(Date.now() - laufend.begonnen, lang, 'dativ'))}
          </p>
          <p className="hinweis">{L.laeuftNochSub}</p>
          <Link to="/session/live" className="btn primary">{L.zurUhr}</Link>
        </section>
      )}

      {/* Hier, nicht beim Lernen: Wer einen Abend einrichtet, will Vollbild und
          einen Bildschirm, der anbleibt — das ist der Grund, die App zu installieren. */}
      <InstallierenKarte />

      <div className="einrichten">
        {/* ── Koffer ───────────────────────────────────────────────────── */}
        <section className="einrichten-block">
          <h2>{L.kofferTitel}</h2>
          <p className="hinweis">{L.kofferSub}</p>
          {start.ausRechner && (
            <p className="hinweis">{L.kofferAusRechner} <Link to="/session/chips">{L.kofferAendern}</Link></p>
          )}
          {sorten.map((s, i) => (
            <div key={i} className="einrichten-zeile">
              {s.farbe && <span className="chip-punkt" style={{ background: s.farbe }} aria-hidden="true" />}
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
            onClick={() => setSorten([
              ...sorten,
              { name: '', anzahl: 0, farbe: FARBEN.find((f) => !sorten.some((x) => x.farbe === f)) ?? FARBEN[0] },
            ])}
          >
            {L.farbeHinzu}
          </button>
        </section>

        {/* ── Spieler ──────────────────────────────────────────────────── */}
        <section className="einrichten-block">
          <h2>{L.spielerNamen}</h2>
          <p className="hinweis">{L.spielerNamenSub}</p>
          {/* Wer schon einmal dabei war, ist ein Tipp entfernt (E-094). */}
          {bekannte.length > 0 && (
            <div className="zuletzt-dabei" role="group" aria-label={L.zuletztDabei}>
              <span className="hinweis">{L.zuletztDabei}</span>
              <div className="abende-namen-reihe">
                {bekannte.map((b) => {
                  const schonDa = namen.some((n) => n.trim().toLocaleLowerCase('de') === b.name.toLocaleLowerCase('de'));
                  return (
                    <button
                      key={b.name}
                      type="button"
                      className="abende-name"
                      disabled={schonDa}
                      onClick={() => setNamen((alt) => {
                        const leer = alt.findIndex((x) => x.trim() === '');
                        return leer >= 0 ? alt.map((x, j) => (j === leer ? b.name : x)) : [...alt, b.name];
                      })}
                    >
                      {b.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
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
                {/* Ein Zeitplan, kein Feld voller Knöpfe: Welche Blinds, ab wann —
                    gerechnet ab jetzt, weil die Uhr erst mit „Uhr starten" läuft. */}
                {gleich ? (
                  <p className="hinweis">{L.planCash(plan.smallBlind, plan.bigBlind)}</p>
                ) : (
                  <>
                    <ol className="einrichten-plan">
                      {struktur.stufen.map((s) => (
                        <li key={s.nummer}>
                          <span className="plan-stufe">{L.planStufe(s.nummer)}</span>
                          <span className="plan-blinds">{s.sb.toLocaleString(lang)} / {s.bb.toLocaleString(lang)}</span>
                          <span className="plan-zeit">{L.planAb(uhrzeit(geoeffnet + s.beginn_s * 1000, lang))}</span>
                        </li>
                      ))}
                    </ol>
                    <p className="hinweis">
                      {L.planEnde(uhrzeit(geoeffnet + dauer * 60_000, lang))}
                    </p>
                  </>
                )}
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
