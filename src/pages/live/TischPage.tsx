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
import { Link, useNavigate } from 'react-router-dom';
import { useLang } from '../../i18n';
import { STR } from '../../i18n/pages/live';
import { umschlag } from '../../lib/design/haptik';
import { gleichIstEsSoweit, haltWach, stufeGewechselt } from '../../lib/live/signal';
import { anhalten, fortsetzen, standDerUhr } from '../../lib/live/uhr';
import { alsUhr } from '../../lib/session/dauer';
import { archiviere, ergaenze, ladeAbende, speichereAbende } from '../../lib/session/abende';
import {
  ladeLaufende, nochDabei, speichereLaufende, type LaufendeSession,
} from '../../lib/session/laufend';

export function TischPage() {
  const { lang } = useLang();
  const L = STR[lang];
  const navigate = useNavigate();

  const [session, setSession] = useState<LaufendeSession | null | 'laedt'>('laedt');
  const [jetzt, setJetzt] = useState(Date.now());
  const [frage, setFrage] = useState(false);
  const [staende, setStaende] = useState(false);
  const gewarnt = useRef<number | null>(null);
  const letzteStufe = useRef<number | null>(null);

  useEffect(() => { setSession(ladeLaufende()); }, []);

  /* Der Bildschirm bleibt an, solange dieser Bildschirm offen ist. */
  useEffect(() => {
    let loesen: (() => void) | null = null;
    haltWach().then((f) => { loesen = f; });
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
  const { laeuft, stufeIndex, istLetzte, rest_ms, naechste, knapp } = uhr;
  const [sb, bb] = uhr.blinds;

  /* Vorankündigung und Wechsel. Beides nur, solange die Uhr läuft — in der
     Pause soll nichts piepen. */
  if (knapp && gewarnt.current !== stufeIndex) {
    gewarnt.current = stufeIndex;
    void gleichIstEsSoweit();
  }
  if (laeuft && letzteStufe.current !== null && letzteStufe.current !== stufeIndex) {
    void stufeGewechselt();
    umschlag();
  }
  letzteStufe.current = stufeIndex;

  function pauseUmschalten() {
    if (session === null || session === 'laedt') return;
    const jetzt = Date.now();
    schreibe(session.laeuft_seit === null
      ? fortsetzen(session, jetzt)
      : anhalten(session, jetzt));
  }

  function beenden() {
    if (session === null || session === 'laedt') return;
    /* Erst in die Abende schreiben, dann die laufende Runde beenden. In
       dieser Reihenfolge, weil ein Abbruch dazwischen die Erinnerung behält
       statt sie zu verlieren: Ein doppelter Eintrag wird beim Aufnehmen
       erkannt, ein verlorener nicht. */
    speichereAbende(ergaenze(ladeAbende(), archiviere(session, Date.now())));
    speichereLaufende(null);
    navigate('/session/abende');
  }

  /** Ein Ereignis am Tisch — ein Griff, keine Eingabemaske. */
  function aendere(i: number, wie: (s: LaufendeSession['spieler'][number]) => LaufendeSession['spieler'][number]) {
    if (session === null || session === 'laedt') return;
    schreibe({ ...session, spieler: session.spieler.map((p, j) => (j === i ? wie(p) : p)) });
  }

  return (
    <div className={`tisch${laeuft ? '' : ' pausiert'}`}>
      <div className="tisch-kopf">
        {!laeuft && <span className="tisch-pausiert">{L.pausiert}</span>}
      </div>

      <div className="tisch-mitte">
        <div className="tisch-angabe">
          <span className="tisch-marke">{L.blinds}</span>
          <span className="tisch-blinds">{sb} / {bb}</span>
        </div>

        <span className={`tisch-zeit${knapp ? ' knapp' : ''}`}>{alsUhr(rest_ms)}</span>

        <div className="tisch-angabe">
          {naechste ? (
            <>
              <span className="tisch-marke">{L.danach}</span>
              <span className="tisch-naechste">{naechste[0]} / {naechste[1]}</span>
            </>
          ) : (
            <span className="tisch-naechste">{L.letzteStufe}</span>
          )}
        </div>
      </div>

      <div className="tisch-unten">
        <button type="button" className="tisch-knopf haupt" onClick={pauseUmschalten}>
          {laeuft ? L.pause : L.weiter}
        </button>
        <button type="button" className="tisch-knopf" onClick={() => setStaende(true)}>
          {L.staende}
        </button>
        <button type="button" className="tisch-knopf" onClick={() => setFrage(true)}>
          {L.verlassen}
        </button>
      </div>

      {staende && (
        <div className="tisch-frage" role="dialog" aria-modal="true" aria-label={L.staendeTitel}>
          <div className="tisch-frage-blatt staende">
            <strong>{L.staendeTitel}</strong>
            <span className="hinweis">{L.staendeSub}</span>

            {session.spieler.map((p, i) => (
              <div key={i} className={`stand-zeile${p.stand === null ? ' raus' : ''}`}>
                <span className="stand-name">{p.name}</span>
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
                      value={p.stand || ''}
                      placeholder={L.chips}
                      onChange={(e) => aendere(i, (x) => ({
                        ...x, stand: Number(e.target.value.replace(/\D/g, '')),
                      }))}
                    />
                    <button type="button" className="tisch-knopf schmal"
                      onClick={() => aendere(i, (x) => ({
                        ...x,
                        eingekauft: x.eingekauft + session.startchips,
                        stand: (x.stand ?? 0) + session.startchips,
                      }))}>
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
            ))}

            <span className="hinweis">{L.nochDabei(nochDabei(session).length)}</span>
            <button type="button" className="tisch-knopf haupt" onClick={() => setStaende(false)}>
              {L.fertig}
            </button>
          </div>
        </div>
      )}

      {frage && (
        <div className="tisch-frage" role="dialog" aria-modal="true" aria-label={L.verlassenFrage}>
          <div className="tisch-frage-blatt">
            <strong>{L.verlassenFrage}</strong>
            <span className="hinweis">{L.verlassenSub}</span>
            <button type="button" className="tisch-knopf" onClick={beenden}>{L.verlassenJa}</button>
            <button type="button" className="tisch-knopf haupt" onClick={() => setFrage(false)}>
              {L.verlassenNein}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
