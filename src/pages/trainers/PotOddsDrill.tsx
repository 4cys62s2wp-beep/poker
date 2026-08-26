/* Der Pot-Odds-Drill — der erste Bildschirm, der die gerechneten Daten zeigt.
   ==========================================================================

   In dieser Datei steht keine Ziffer.

   Das ist die Regel des Projekts, hier auf die Oberfläche angewandt: Jede
   Zahl, die die App zeigt, kommt aus `tools/poker-math/`. Stünde hier `0.25`,
   wäre nicht mehr nachvollziehbar, ob das gerechnet oder geraten war.
   Betroffen sind auch Größen und Abstände — die stehen in `global.css`.

   Der Test `zeigt keine einzige Ziffer im Quelltext` liest diese Datei und
   schlägt fehl, sobald eine auftaucht.

   Der Aufbau folgt den Gestaltungsregeln des Auftrags
   ---------------------------------------------------
   - Die Ergebniszahl ist das größte Element und steht in der oberen Hälfte.
   - Alles andere ist deutlich kleiner.
   - Dunkler Grund, hoher Kontrast (die App ist ohnehin dunkel).
   - Vom Öffnen bis zur ersten Aufgabe: zwei Berührungen. Deshalb gibt es
     keinen Startknopf — die erste Aufgabe steht da, sobald der Bildschirm da
     ist.
   - Einhändig: alles Tippbare liegt im unteren Drittel.
   - Zwischen Antwort und Auflösung bewegt sich nichts.
   - Kein Zeitdruck, kein Countdown, kein Konto, kein Netz. */

import { useEffect, useMemo, useRef, useState } from 'react';
import { BackLink } from '../../components/ui';
import { CardsRow } from '../../components/PlayingCard';
import { useLang } from '../../i18n';
import { STR } from '../../i18n/pages/potoddsdrill';
import { ladeB1, ladeB2 } from '../../lib/pokermath/laden';
import type { B1Outs, B2PotOdds } from '../../lib/pokermath/typen';
import {
  alsBB,
  alsProzent,
  alsProzentpunkte,
  baueAufgabe,
  loese,
  ziehZustand,
  type Aufgabe,
  type DrillZustand,
} from '../../lib/potodds/aufgabe';

interface Daten {
  b1: B1Outs;
  b2: B2PotOdds;
}

export function PotOddsDrill() {
  const { lang } = useLang();
  const L = STR[lang];

  const [daten, setDaten] = useState<Daten | null>(null);
  const [fehler, setFehler] = useState<string | null>(null);
  const [zustand, setZustand] = useState<DrillZustand | null>(null);
  /** Die Antwort des Nutzers, oder `null`, solange er nicht geantwortet hat. */
  const [antwort, setAntwort] = useState<boolean | null>(null);
  /** Ein Eintrag je beantworteter Aufgabe: richtig oder nicht. Nur in dieser
   *  Sitzung, nichts wird gespeichert — kein Konto, keine Ablage. */
  const [verlauf, setVerlauf] = useState<boolean[]>([]);
  const letztesZugbild = useRef<number | undefined>(undefined);

  useEffect(() => {
    let lebt = true;
    Promise.all([ladeB1(), ladeB2()])
      .then(([b1, b2]) => {
        if (!lebt) return;
        setDaten({ b1, b2 });
        const gezogen = ziehZustand(b1, b2);
        letztesZugbild.current = gezogen.zugbild;
        setZustand(gezogen);
      })
      .catch((f: unknown) => {
        /* Sichtbar scheitern. Ein leerer Bildschirm ohne Grund wäre die
           schlechteste aller Möglichkeiten. */
        if (lebt) setFehler(f instanceof Error ? f.message : String(f));
      });
    return () => { lebt = false; };
  }, []);

  const gebaut = useMemo<{ aufgabe: Aufgabe | null; fehler: string | null }>(() => {
    if (!daten || !zustand) return { aufgabe: null, fehler: null };
    try {
      return { aufgabe: baueAufgabe(daten.b1, daten.b2, zustand), fehler: null };
    } catch (f: unknown) {
      return { aufgabe: null, fehler: f instanceof Error ? f.message : String(f) };
    }
  }, [daten, zustand]);

  const aufgabe = gebaut.aufgabe;
  const aufloesung = useMemo(() => (aufgabe ? loese(aufgabe) : null), [aufgabe]);

  function antworte(nutzerMeintLohnt: boolean) {
    if (antwort !== null || !aufloesung) return;
    setAntwort(nutzerMeintLohnt);
    setVerlauf((v) => [...v, nutzerMeintLohnt === aufloesung.lohnt]);
  }

  function weiter() {
    if (!daten) return;
    const gezogen = ziehZustand(daten.b1, daten.b2, Math.random, letztesZugbild.current);
    letztesZugbild.current = gezogen.zugbild;
    setAntwort(null);
    setZustand(gezogen);
  }

  const schlimm = fehler ?? gebaut.fehler;
  if (schlimm) {
    return (
      <div>
        <BackLink to="/lernen" label={L.back} />
        <div className="card" style={{ borderColor: 'var(--danger)' }}>
          <div className="drill-fehler-titel">{L.errorTitle}</div>
          <p className="small" style={{ marginTop: 'var(--sp-2)' }}>{schlimm}</p>
          <p className="small muted">{L.errorHint}</p>
        </div>
      </div>
    );
  }

  if (!aufgabe || !aufloesung) {
    return (
      <div>
        <BackLink to="/lernen" label={L.back} />
        <p className="muted">{L.loading}</p>
      </div>
    );
  }

  const beantwortet = antwort !== null;
  const richtig = antwort === aufloesung.lohnt;
  const treffer = verlauf.filter(Boolean).length;

  return (
    <div>
      <BackLink to="/lernen" label={L.back} />

      <div className="drill">
        {/* ── Obere Hälfte: erst die Frage, dann die Zahl ─────────────── */}
        <div className="drill-oben" aria-live="polite">
          {!beantwortet ? (
            <>
              <div className="drill-frage">{L.question}</div>
              <div className="drill-zugbild">{aufgabe.zugbild.name}</div>
              <div className="drill-outs">
                {L.outsOf(aufgabe.zugbild.outs, aufgabe.zugbild.zielkategorie)}
              </div>
            </>
          ) : (
            <>
              <div className={`drill-zahl${aufloesung.lohnt ? ' gut' : ' schlecht'}`}>
                {alsProzent(aufloesung.equity, lang)}
              </div>
              <div className="drill-zahl-label">{L.equityLabel}</div>
              <div className="drill-gegen">
                <span className="drill-gegen-label">{L.neededLabel}</span>
                <span className="drill-gegen-wert">{alsProzent(aufloesung.noetig, lang)}</span>
              </div>
            </>
          )}
        </div>

        {/* ── Die Lage. Bleibt sichtbar, auch nach der Antwort ────────── */}
        <div className="drill-mitte">
          <div className="drill-lage">
            <div className="drill-karten">
              <div className="drill-karten-gruppe">
                <div className="drill-karten-label">{L.handLabel}</div>
                <CardsRow cards={aufgabe.hand} size="sm" />
              </div>
              <div className="drill-karten-gruppe">
                <div className="drill-karten-label">{L.flopLabel}</div>
                <CardsRow cards={aufgabe.flop} size="sm" />
              </div>
            </div>
            <div className="drill-betraege">
              <span>
                <span className="drill-betrag-label">{L.potLabel}</span>
                <span className="drill-betrag">{alsBB(aufgabe.pot, lang)}&nbsp;{L.bb}</span>
              </span>
              <span>
                <span className="drill-betrag-label">{L.betLabel}</span>
                <span className="drill-betrag">{alsBB(aufgabe.einsatzBetrag, lang)}&nbsp;{L.bb}</span>
              </span>
              {/* Der dritte Wert ist der Endtopf, nicht der eigene Call: Der
                  Call ist immer genau so hoch wie sein Einsatz, und dreimal
                  dieselbe Zahl nebeneinander sieht nach einem Fehler aus. */}
              <span>
                <span className="drill-betrag-label">{L.endpotLabel}</span>
                <span className="drill-betrag">{alsBB(aufgabe.endpot, lang)}&nbsp;{L.bb}</span>
              </span>
            </div>
          </div>

          {beantwortet && (
            <div className="drill-aufloesung">
              <div className={`drill-urteil${richtig ? ' gut' : ' schlecht'}`}>
                <strong>{richtig ? L.right : L.wrong}</strong>
                <span>{aufloesung.lohnt ? L.verdictYes : L.verdictNo}</span>
              </div>
              <div className="drill-neben">
                <span>
                  <span className="drill-neben-label">{L.turnLabel}</span>
                  <span className="drill-neben-wert">{alsProzent(aufloesung.equityTurn, lang)}</span>
                </span>
                <span>
                  <span className="drill-neben-label">{L.gapLabel}</span>
                  <span className="drill-neben-wert">{alsProzentpunkte(aufloesung.abstandPp, lang)}</span>
                </span>
              </div>
              <p className="drill-hinweis">
                {aufloesung.mindestOuts === null ? L.minOutsNone : L.minOuts(aufloesung.mindestOuts)}
              </p>
              {aufloesung.grenzfall && <p className="drill-hinweis warn">{L.closeNote}</p>}
              <p className="drill-hinweis muted">{L.assumption}</p>
            </div>
          )}
        </div>

        {/* ── Unteres Drittel: alles Tippbare ─────────────────────────── */}
        <div className="drill-unten">
          {!beantwortet ? (
            <div className="drill-knoepfe">
              <button type="button" className="drill-knopf ja" onClick={() => antworte(true)}>
                {L.yes}
              </button>
              <button type="button" className="drill-knopf nein" onClick={() => antworte(false)}>
                {L.no}
              </button>
            </div>
          ) : (
            <button type="button" className="drill-knopf weiter" onClick={weiter}>
              {L.next}
            </button>
          )}
          <div className="drill-stand">
            {verlauf.length ? L.score(treffer, verlauf.length) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
