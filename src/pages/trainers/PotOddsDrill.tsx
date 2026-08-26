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
   - Kein Zeitdruck, kein Countdown, kein Konto, kein Netz.

   Und: Neben jeder gerechneten Zahl steht ihr Herkunftszeichen. Nicht neben
   Topf und Einsatz — die sind der Maßstab der Aufgabe und stehen in keiner
   Datei. Neben allem, was aus B1 oder B2 kommt, steht es.

   Die Adresse führt, nicht der Bildschirm
   ---------------------------------------
   Welche Aufgabe zu sehen ist, entscheidet allein die Adresse. „Nächste
   Aufgabe" setzt eine neue Adresse; was daraufhin angezeigt wird, liest der
   Bildschirm wieder aus ihr heraus. Das ist ein Umweg — und er ist der
   Grund, warum jeder Link zuverlässig dieselbe Situation zeigt: Es gibt
   keinen zweiten Weg, auf dem eine Aufgabe entstehen könnte. */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BackLink } from '../../components/ui';
import { CardsRow } from '../../components/PlayingCard';
import { Zahl } from '../../components/Herkunft';
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
import { KOPIERT_MS, dekodiere, fingerabdruck, kodiere } from '../../lib/potodds/adresse';

interface Daten {
  b1: B1Outs;
  b2: B2PotOdds;
}

/** Warum eine Adresse nicht zu einer Aufgabe führt. */
type Adressfehler = 'unlesbar' | 'veraltet';

export function PotOddsDrill() {
  const { lang } = useLang();
  const L = STR[lang];
  const { code } = useParams<{ code?: string }>();
  const navigate = useNavigate();

  const [daten, setDaten] = useState<Daten | null>(null);
  const [fehler, setFehler] = useState<string | null>(null);
  const [adressfehler, setAdressfehler] = useState<Adressfehler | null>(null);
  const [zustand, setZustand] = useState<DrillZustand | null>(null);
  const [kopiert, setKopiert] = useState(false);
  /** Die Antwort des Nutzers, oder `null`, solange er nicht geantwortet hat. */
  const [antwort, setAntwort] = useState<boolean | null>(null);
  /** Ein Eintrag je beantworteter Aufgabe: richtig oder nicht. Nur in dieser
   *  Sitzung, nichts wird gespeichert — kein Konto, keine Ablage. */
  const [verlauf, setVerlauf] = useState<boolean[]>([]);
  const letztesZugbild = useRef<number | undefined>(undefined);

  useEffect(() => {
    let lebt = true;
    Promise.all([ladeB1(), ladeB2()])
      .then(([b1, b2]) => { if (lebt) setDaten({ b1, b2 }); })
      .catch((f: unknown) => {
        /* Sichtbar scheitern. Ein leerer Bildschirm ohne Grund wäre die
           schlechteste aller Möglichkeiten. */
        if (lebt) setFehler(f instanceof Error ? f.message : String(f));
      });
    return () => { lebt = false; };
  }, []);

  /* Setzt eine neue Adresse. Angezeigt wird erst, was der Effekt darunter
     wieder daraus liest – ein Umweg mit Absicht (siehe Kopf der Datei). */
  const neueAufgabe = useCallback(() => {
    if (!daten) return;
    const gezogen = ziehZustand(daten.b1, daten.b2, Math.random, letztesZugbild.current);
    navigate(`/lernen/drill/${kodiere(gezogen, fingerabdruck(daten.b1, daten.b2))}`,
      { replace: true });
  }, [daten, navigate]);

  /* Die Adresse lesen. Ohne Code: eine ziehen und die Adresse setzen, damit
     auch die allererste Aufgabe teilbar ist. */
  useEffect(() => {
    if (!daten) return;
    if (!code) { neueAufgabe(); return; }

    const gelesen = dekodiere(code);
    if (!gelesen) { setAdressfehler('unlesbar'); return; }
    if (gelesen.abdruck !== fingerabdruck(daten.b1, daten.b2)) {
      setAdressfehler('veraltet');
      return;
    }
    try {
      /* Probeweise bauen: Eine Adresse kann formal richtig sein und trotzdem
         auf einen Index zeigen, den es nicht gibt. Lieber hier abfangen als
         dem Nutzer eine technische Fehlermeldung zeigen. */
      baueAufgabe(daten.b1, daten.b2, gelesen.zustand);
    } catch {
      setAdressfehler('veraltet');
      return;
    }
    letztesZugbild.current = gelesen.zustand.zugbild;
    setAdressfehler(null);
    setAntwort(null);
    setKopiert(false);
    setZustand(gelesen.zustand);
  }, [daten, code, neueAufgabe]);

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

  /* Der Link ist die Adresse, in der die Aufgabe steht – mehr braucht es
     nicht. Teilen, wenn das Gerät es kann; sonst in die Zwischenablage. */
  async function teilen() {
    const url = window.location.href;
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({ title: L.shareTitle, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setKopiert(true);
      window.setTimeout(() => setKopiert(false), KOPIERT_MS);
    } catch {
      /* Abgebrochen oder nicht erlaubt – dann eben nicht. Ein Fehlerdialog
         für einen nicht geteilten Link wäre lauter als der Vorgang wert. */
    }
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

  if (adressfehler) {
    return (
      <div>
        <BackLink to="/lernen" label={L.back} />
        <div className="card">
          <div className="drill-fehler-titel">{L.addressTitle}</div>
          <p className="small" style={{ marginTop: 'var(--sp-2)' }}>
            {adressfehler === 'unlesbar' ? L.addressUnreadable : L.addressStale}
          </p>
          <button
            type="button"
            className="drill-knopf weiter"
            style={{ marginTop: 'var(--sp-4)' }}
            onClick={() => { setAdressfehler(null); navigate('/lernen/drill', { replace: true }); }}
          >
            {L.addressNew}
          </button>
        </div>
      </div>
    );
  }

  if (!daten || !aufgabe || !aufloesung) {
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
              <Zahl
                className="drill-outs"
                wert={L.outsOf(aufgabe.zugbild.outs, aufgabe.zugbild.zielkategorie)}
                quelle={{ quellen: [{ pfad: aufgabe.pfade.outs, herkunft: daten.b1.herkunft }] }}
              />
            </>
          ) : (
            <>
              <Zahl
                className={`drill-zahl${aufloesung.lohnt ? ' gut' : ' schlecht'}`}
                wert={alsProzent(aufloesung.equity, lang)}
                quelle={{ quellen: [{ pfad: aufloesung.pfade.equity, herkunft: daten.b1.herkunft }] }}
              />
              <div className="drill-zahl-label">{L.equityLabel}</div>
              <div className="drill-gegen">
                <span className="drill-gegen-label">{L.neededLabel}</span>
                <Zahl
                  className="drill-gegen-wert"
                  wert={alsProzent(aufloesung.noetig, lang)}
                  quelle={{ quellen: [{ pfad: aufloesung.pfade.noetig, herkunft: daten.b2.herkunft }] }}
                />
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
              {/* Direkt unter das Urteil, nicht ans Ende: Wenn der Abstand
                  hauchdünn ist, gehört das zum Urteil dazu. Weiter unten
                  stünde es unter der Bedienleiste, und „Daneben" bliebe
                  härter stehen, als es die Zahl hergibt. */}
              {aufloesung.grenzfall && <p className="drill-hinweis warn">{L.closeNote}</p>}
              <div className="drill-neben">
                <span>
                  <span className="drill-neben-label">{L.turnLabel}</span>
                  <Zahl
                    className="drill-neben-wert"
                    wert={alsProzent(aufloesung.equityTurn, lang)}
                    quelle={{ quellen: [{ pfad: aufloesung.pfade.equityTurn, herkunft: daten.b1.herkunft }] }}
                  />
                </span>
                <span>
                  <span className="drill-neben-label">{L.gapLabel}</span>
                  {/* Der Abstand steht in keiner Datei – die App bildet ihn
                      aus zwei Werten. Also nennt die Herkunft beide, jede mit
                      ihren eigenen Annahmen. */}
                  <Zahl
                    className="drill-neben-wert"
                    wert={alsProzentpunkte(aufloesung.abstandPp, lang)}
                    quelle={{ quellen: [
                      { pfad: aufloesung.pfade.equity, herkunft: daten.b1.herkunft },
                      { pfad: aufloesung.pfade.noetig, herkunft: daten.b2.herkunft },
                    ] }}
                  />
                </span>
              </div>
              <Zahl
                className="drill-hinweis"
                wert={aufloesung.mindestOuts === null ? L.minOutsNone : L.minOuts(aufloesung.mindestOuts)}
                quelle={{ quellen: [{ pfad: aufloesung.pfade.mindestOuts, herkunft: daten.b2.herkunft }] }}
              />
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
            <button type="button" className="drill-knopf weiter" onClick={neueAufgabe}>
              {L.next}
            </button>
          )}
          <div className="drill-fuss">
            <span className="drill-stand">
              {verlauf.length ? L.score(treffer, verlauf.length) : null}
            </span>
            <button type="button" className="drill-teilen" onClick={teilen}>
              {kopiert ? L.shareCopied : L.share}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
