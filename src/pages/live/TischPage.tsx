/* Das Tischgerät.
   ==============

   Es liegt in der Mitte, alle sehen es, niemand hält es. Deshalb zeigt es
   **drei Angaben** und sonst nichts: die laufenden Blinds, die Restzeit der
   Stufe und die nächste Stufe. Jede weitere Angabe kostet Größe, und Größe
   ist hier die eigentliche Leistung — aus zwei Metern lesbar.

   Was hier bewusst fehlt: die Nummer der Stufe und die Zahl der verbliebenen
   Spieler. Beides ist interessant, aber niemand am Tisch braucht es, um zu
   wissen, was er setzen muss. Die Blindwerte benennen die Stufe besser als
   ihre Nummer, und wer noch dabei ist, sieht man am Tisch. Gemessen wird
   diese Regel, nicht behauptet: `npm run tisch` zählt die Elemente mit
   Zahlen im gerenderten Ergebnis.

   Vollbild ohne die normale Navigationsleiste: Wer den Tisch führt, soll
   nicht versehentlich ins Glossar wischen. Verlassen geht über eine bewusste
   Bestätigung.

   Warum die Zeit aus Zeitstempeln kommt und nicht aus einem Zähler
   ---------------------------------------------------------------
   Ein Zähler läuft nur, solange die Seite offen ist. Das Handy liegt aber auf
   dem Tisch und sperrt sich, jemand nimmt es hoch, jemand wechselt kurz in
   eine andere App — und die Blindstufe läuft die ganze Zeit weiter. Aus
   `laeuft_seit` und `verbraucht_ms` ergibt sich die Wahrheit auch dann, wenn
   niemand hingeschaut hat.

   In dieser Datei steht keine Gestaltungszahl. */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useDialogTastatur } from '../../lib/dialog/tastatur';
import { Link, useNavigate } from 'react-router-dom';
import { useLang } from '../../i18n';
import { STR } from '../../i18n/pages/live';
import { umschlag } from '../../lib/design/haptik';
import { entsperreTon, gleichIstEsSoweit, haltWach, stufeGewechselt, tonTesten } from '../../lib/live/signal';
import {
  anhalten, fortsetzen, minuteDazu, minuteWeg, standDerUhr, stufeVor, stufeZurueck,
} from '../../lib/live/uhr';
import { alsUhr } from '../../lib/session/dauer';
import { archiviere, ergaenze, istProbe, ladeAbende, speichereAbende } from '../../lib/session/abende';
import {
  ladeLaufende, nochDabei, speichereLaufende, type LaufendeSession, type Spieler,
} from '../../lib/session/laufend';
import { Schalter } from '../../components/Schalter';

export function TischPage() {
  const { lang } = useLang();
  const L = STR[lang];
  const navigate = useNavigate();

  const [session, setSession] = useState<LaufendeSession | null | 'laedt'>('laedt');
  const [jetzt, setJetzt] = useState(Date.now());
  const [frage, setFrage] = useState(false);
  const [staende, setStaende] = useState(false);
  const [steuern, setSteuern] = useState(false);
  const [tonErgebnis, setTonErgebnis] = useState<'ok' | 'stumm' | null>(null);
  const [wachOk, setWachOk] = useState(true);
  /* Nach „Nachgekauft" fünf Sekunden lang ein Rückgängig-Hinweis — keine
     Rückfrage vorher (ein Griff je Ereignis), aber ein Ausweg danach. */
  const [zurueck, setZurueck] = useState<{ index: number; vorher: Spieler; bis: number } | null>(null);
  const [neuerSpieler, setNeuerSpieler] = useState<string | null>(null);

  /* Beide Dialoge liegen über dem Tisch. Ohne diese drei Eigenschaften —
     Startfokus, Escape, Fokusfalle — bediente die Tastatur die Knöpfe
     dahinter, die man gar nicht sieht (E-058). */
  const frageRef = useRef<HTMLDivElement>(null);
  const staendeRef = useRef<HTMLDivElement>(null);
  const steuernRef = useRef<HTMLDivElement>(null);
  useDialogTastatur(frageRef, { aktiv: frage, schliessen: () => setFrage(false) });
  useDialogTastatur(staendeRef, { aktiv: staende, schliessen: () => setStaende(false) });
  useDialogTastatur(steuernRef, { aktiv: steuern, schliessen: () => setSteuern(false) });
  const gewarnt = useRef<number | null>(null);
  const letzteStufe = useRef<number | null>(null);
  /* Zehn Sekunden nach einem Wechsel heißt die Marke „Neue Blinds" — ohne
     Blinken und ohne Vollbild-Band (E-027). */
  const neueBlindsBis = useRef(0);

  useEffect(() => { setSession(ladeLaufende()); }, []);

  /* Der Bildschirm bleibt an, solange dieser Bildschirm offen ist. */
  useEffect(() => {
    let loesen: (() => void) | null = null;
    haltWach().then((w) => { loesen = w.loesen; setWachOk(w.ok); });
    return () => { loesen?.(); };
  }, []);

  /* Ein Takt je Sekunde — nur zum Neuzeichnen. Gerechnet wird aus den
     Zeitstempeln, nicht aus der Zahl der Takte. */
  useEffect(() => {
    const takt = window.setInterval(() => setJetzt(Date.now()), 1000);
    return () => window.clearInterval(takt);
  }, []);

  const schreibe = useCallback((s: LaufendeSession) => {
    setSession(s);
    speichereLaufende(s);
  }, []);

  if (session === 'laedt') return null;

  if (session === null) {
    return (
      <div className="tisch">
        <div className="tisch-mitte">
          <p className="tisch-marke">{L.keineSession}</p>
          <Link to="/session/live/einrichten" className="tisch-knopf haupt"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            {L.einrichten}
          </Link>
          <Link to="/session" className="tisch-marke">{L.zurueck}</Link>
        </div>
      </div>
    );
  }

  /* Alles Gerechnete kommt aus `standDerUhr`. In dieser Datei wird nicht
     gerechnet, sie zeigt an. */
  const uhr = standDerUhr(session, jetzt);
  const { laeuft, stufeIndex, istLetzte, rest_ms, naechste, knapp, cash, ueber_ms } = uhr;
  const [sb, bb] = uhr.blinds;
  const tonAn = session.ton !== false;
  /* Noch nicht gestartet: Der Abend beginnt pausiert (E-094). Wer ihn anlegt,
     sitzt noch nicht am Tisch; die Uhr läuft erst mit dem ersten Tipp. */
  const nochNichtGestartet = !laeuft && session.verbraucht_ms === 0;
  const stufendauer_ms = session.stufendauer_s * 1000;
  const nf = lang === 'de' ? 'de-DE' : 'en-GB';
  const zahl = (n: number) => n.toLocaleString(nf);

  /* Vorankündigung und Wechsel. Beides nur, solange die Uhr läuft — in der
     Pause soll nichts piepen. Und nur im Turnier: Ein Cash-Abend hat nichts
     anzukündigen. */
  if (knapp && gewarnt.current !== stufeIndex) {
    gewarnt.current = stufeIndex;
    void gleichIstEsSoweit(tonAn);
  }
  if (!cash && letzteStufe.current !== null && letzteStufe.current !== stufeIndex) {
    neueBlindsBis.current = Date.now() + 10_000;
    if (laeuft) {
      void stufeGewechselt(tonAn);
      umschlag();
    }
  }
  letzteStufe.current = stufeIndex;

  /** Start und Fortsetzen sind die Gesten, in denen der Ton entsperrt wird. */
  function pauseUmschalten() {
    if (session === null || session === 'laedt') return;
    const jetzt = Date.now();
    if (session.laeuft_seit === null) void entsperreTon();
    schreibe(session.laeuft_seit === null
      ? fortsetzen(session, jetzt)
      : anhalten(session, jetzt));
  }

  function beenden(verwerfen = false) {
    if (session === null || session === 'laedt') return;
    /* Erst in die Abende schreiben, dann die laufende Runde beenden. In
       dieser Reihenfolge, weil ein Abbruch dazwischen die Erinnerung behält
       statt sie zu verlieren: Ein doppelter Eintrag wird beim Aufnehmen
       erkannt, ein verlorener nicht. Eine Probe wird nur verworfen, wenn jemand
       es ausdrücklich sagt. */
    if (verwerfen) {
      speichereLaufende(null);
      navigate('/session');
      return;
    }
    const abend = archiviere(session, Date.now());
    speichereAbende(ergaenze(ladeAbende(), abend));
    speichereLaufende(null);
    /* Der Abschluss ist der Abend selbst — mit Abrechnung und Teilen. */
    navigate(`/session/abende/${abend.id}?neu=1`);
  }

  /** Ein Ereignis am Tisch — ein Griff, keine Eingabemaske. */
  function aendere(i: number, wie: (s: LaufendeSession['spieler'][number]) => LaufendeSession['spieler'][number]) {
    if (session === null || session === 'laedt') return;
    schreibe({ ...session, spieler: session.spieler.map((p, j) => (j === i ? wie(p) : p)) });
  }

  function steuere(wie: (s: LaufendeSession, jetzt: number) => LaufendeSession) {
    if (session === null || session === 'laedt') return;
    schreibe(wie(session, Date.now()));
  }

  function nachkaufen(i: number) {
    if (session === null || session === 'laedt') return;
    const vorher = session.spieler[i];
    aendere(i, (x) => ({
      ...x,
      eingekauft: x.eingekauft + session.startchips,
      stand: (x.stand ?? 0) + session.startchips,
    }));
    setZurueck({ index: i, vorher, bis: Date.now() + 5000 });
  }

  function rueckgaengig() {
    if (!zurueck) return;
    aendere(zurueck.index, () => zurueck.vorher);
    setZurueck(null);
  }

  function spielerDazu() {
    if (session === null || session === 'laedt' || neuerSpieler === null) return;
    const name = neuerSpieler.trim();
    if (!name) return;
    schreibe({
      ...session,
      spieler: [...session.spieler, { name, eingekauft: session.startchips, stand: session.startchips }],
    });
    setNeuerSpieler(null);
  }

  async function tonPruefen() {
    setTonErgebnis(await tonTesten());
  }

  const eingekauftGesamt = session.spieler.reduce((n, p) => n + p.eingekauft, 0);
  const gezaehltGesamt = session.spieler.reduce((n, p) => n + (p.stand ?? 0), 0);
  const abweichung = gezaehltGesamt - eingekauftGesamt;
  /* Der Rückgängig-Hinweis verschwindet nach fünf Sekunden von selbst. */
  const zurueckSichtbar = zurueck !== null && jetzt < zurueck.bis;

  /* Die große Zahl: die Restzeit — auf der letzten Stufe nach dem Ablauf die
     Zeit darüber hinaus („+0:12"), statt bei 0:00 stehen zu bleiben. Im
     Cash-Abend die gespielte Zeit. */
  const grosseZeit = cash
    ? alsUhr(ueber_ms)
    : istLetzte && rest_ms === 0
      ? `+${alsUhr(Math.max(0, ueber_ms - stufendauer_ms))}`
      : alsUhr(rest_ms);

  return (
    <div className={`tisch${laeuft ? '' : ' pausiert'}${cash ? ' cash' : ''}`}>
      <div className="tisch-kopf">
        {/* Ein Weg aus dem Tisch, der nichts beendet: Vorher führte bei laufender
            Runde nichts hinaus außer „Beenden". */}
        <Link to="/session" className="tisch-zurueck" aria-label={L.zurAppLang}>
          <span aria-hidden="true">‹</span> {L.zurApp}
        </Link>
        {!wachOk && <span className="tisch-wach" role="status">{L.wachWarnung}</span>}
      </div>

      <div className="tisch-mitte">
        <div className="tisch-angabe tisch-angabe-blinds">
          <span className="tisch-marke">{jetzt < neueBlindsBis.current ? L.neueBlinds : L.blinds}</span>
          <span className="tisch-blinds">{zahl(sb)} / {zahl(bb)}</span>
        </div>

        <div className="tisch-angabe tisch-angabe-zeit">
          {/* An der Stelle des Etiketts, aus zwei Metern lesbar (Regel 11.4):
              „Pausiert" und „Bereit" sind Zustände, keine Fußnoten. */}
          {!laeuft ? (
            <span className="tisch-pausiert">{nochNichtGestartet ? L.bereit : L.pausiert}</span>
          ) : cash ? (
            <span className="tisch-marke">{L.gespielt}</span>
          ) : null}
          <span className={`tisch-zeit${knapp ? ' knapp' : ''}${grosseZeit.length > 5 ? ' lang' : ''}`}>{grosseZeit}</span>
        </div>

        {!cash && (
          <div className="tisch-angabe tisch-angabe-danach">
            {naechste ? (
              <>
                <span className="tisch-marke">{L.danach}</span>
                <span className="tisch-naechste">{zahl(naechste[0])} / {zahl(naechste[1])}</span>
              </>
            ) : (
              <>
                <span className="tisch-marke">{L.letzteStufe}</span>
                <span className="tisch-naechste">{L.seit(alsUhr(ueber_ms))}</span>
              </>
            )}
          </div>
        )}
      </div>

      <div className="tisch-unten">
        <button type="button" className="tisch-knopf haupt" onClick={pauseUmschalten}>
          {laeuft ? L.pause : nochNichtGestartet ? L.uhrStarten : L.weiter}
        </button>
        <button type="button" className="tisch-knopf" onClick={() => setStaende(true)}>
          {L.staende}
        </button>
        <button type="button" className="tisch-knopf" onClick={() => setSteuern(true)}>
          {L.mehr}
        </button>
      </div>

      {steuern && (
        <div ref={steuernRef} className="tisch-frage" role="dialog" aria-modal="true" aria-label={L.steuerTitel}>
          <div className="tisch-frage-blatt">
            <strong>{L.steuerTitel}</strong>
            <span className="hinweis">{L.steuerSub}</span>

            {!cash && (
              <div className="steuer-raster">
                <button type="button" className="tisch-knopf" onClick={() => steuere(stufeZurueck)}>{L.stufeZurueck}</button>
                <button type="button" className="tisch-knopf" onClick={() => steuere(stufeVor)} disabled={istLetzte}>{L.stufeVor}</button>
                <button type="button" className="tisch-knopf" onClick={() => steuere(minuteWeg)}>{L.minuteWeniger}</button>
                <button type="button" className="tisch-knopf" onClick={() => steuere(minuteDazu)}>{L.minuteMehr}</button>
              </div>
            )}

            {!cash && (
              <>
                <Schalter
                  an={tonAn}
                  onChange={(v) => {
                    if (v) void entsperreTon();
                    schreibe({ ...session, ton: v });
                  }}
                  label={L.tonLabel}
                  beschreibung={L.tonBeschreibung}
                  zustand={{ an: L.tonAn, aus: L.tonAus }}
                />
                <button type="button" className="tisch-knopf" onClick={() => void tonPruefen()}>{L.tonTesten}</button>
                {tonErgebnis && (
                  <span className="hinweis" role="status">{tonErgebnis === 'ok' ? L.tonOk : L.tonStumm}</span>
                )}
              </>
            )}

            <button type="button" className="tisch-knopf" onClick={() => { setSteuern(false); setFrage(true); }}>
              {L.abendBeenden}
            </button>
            <button type="button" className="tisch-knopf haupt" onClick={() => setSteuern(false)}>
              {L.fertig}
            </button>
          </div>
        </div>
      )}

      {staende && (
        <div ref={staendeRef} className="tisch-frage" role="dialog" aria-modal="true" aria-label={L.staendeTitel}>
          <div className="tisch-frage-blatt staende">
            <strong>{L.staendeTitel}</strong>
            <span className="hinweis">{L.staendeSub}</span>

            {session.spieler.map((p, i) => {
              const rebuys = session.startchips > 0 ? Math.max(0, Math.round(p.eingekauft / session.startchips) - 1) : 0;
              return (
                <div key={i} className={`stand-block${p.stand === null ? ' raus' : ''}`}>
                  {/* Zweizeilig: der Name in voller Breite, darunter klein, was er
                      eingesetzt hat — vorher „Bene…" und „Charl…". */}
                  <span className="stand-name">{p.name}</span>
                  <span className="stand-meta">
                    {rebuys > 0 ? L.rebuyZeile(rebuys, zahl(p.eingekauft)) : L.keinRebuy(zahl(p.eingekauft))}
                  </span>
                  <div className="stand-zeile">
                    {p.stand === null ? (
                      <button type="button" className="tisch-knopf schmal"
                        onClick={() => aendere(i, (x) => ({ ...x, stand: 0, raus_um: null }))}>
                        {L.dochDabei}
                      </button>
                    ) : (
                      <>
                        <input
                          className="stand-chips"
                          aria-label={`${p.name} · ${L.chips}`}
                          inputMode="numeric"
                          value={p.stand ? zahl(p.stand) : ''}
                          placeholder={L.chips}
                          onChange={(e) => aendere(i, (x) => ({
                            ...x, stand: Number(e.target.value.replace(/\D/g, '')),
                          }))}
                        />
                        <button type="button" className="tisch-knopf schmal" onClick={() => nachkaufen(i)}>
                          {L.rebuy}
                        </button>
                        <button type="button" className="tisch-knopf schmal"
                          onClick={() => aendere(i, (x) => ({
                            ...x, stand: null, raus_um: Date.now(),
                          }))}>
                          {L.raus}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {neuerSpieler === null ? (
              <button type="button" className="tisch-knopf schmal" onClick={() => setNeuerSpieler('')}>
                {L.spielerDazu}
              </button>
            ) : (
              <div className="stand-zeile">
                <input
                  className="stand-name-feld"
                  aria-label={L.neuerName}
                  placeholder={L.neuerName}
                  value={neuerSpieler}
                  autoFocus
                  onChange={(e) => setNeuerSpieler(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') spielerDazu(); }}
                />
                <button type="button" className="tisch-knopf schmal" onClick={spielerDazu}>{L.dazuKnopf}</button>
              </div>
            )}

            {/* Eine Prüfsumme nur bei Abweichung: Stimmt die Zahl, sagt sie nichts. */}
            {abweichung !== 0 && (
              <span className="hinweis stand-pruefung" role="status">
                {abweichung > 0 ? L.pruefsummeZuViel(zahl(abweichung)) : L.pruefsummeFehlt(zahl(-abweichung))}
              </span>
            )}

            {zurueckSichtbar && zurueck && (
              <div className="stand-rueckgaengig" role="status">
                <span>{L.nachgekauftHinweis(session.spieler[zurueck.index]?.name ?? '')}</span>
                <button type="button" className="tisch-knopf schmal" onClick={rueckgaengig}>{L.rueckgaengig}</button>
              </div>
            )}

            <span className="hinweis">{L.nochDabei(nochDabei(session).length)}</span>
            <button type="button" className="tisch-knopf haupt" onClick={() => setStaende(false)}>
              {L.fertig}
            </button>
          </div>
        </div>
      )}

      {frage && (
        <div ref={frageRef} className="tisch-frage" role="dialog" aria-modal="true" aria-label={L.verlassenFrage}>
          <div className="tisch-frage-blatt">
            <strong>{L.verlassenFrage}</strong>
            <span className="hinweis">{istProbe(uhr.verstrichen_ms) ? L.probeHinweis : L.verlassenSub}</span>
            <button type="button" className="tisch-knopf" onClick={() => beenden(false)}>{L.beendenZeigen}</button>
            {istProbe(uhr.verstrichen_ms) && (
              <button type="button" className="tisch-knopf" onClick={() => beenden(true)}>{L.probeVerwerfen}</button>
            )}
            <button type="button" className="tisch-knopf haupt" onClick={() => setFrage(false)}>
              {L.verlassenNein}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
