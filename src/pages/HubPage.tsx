/* Die Startseite.
   ==============

   Drei Einstiege, **ungleich gewichtet**. Die Gewichtung folgt der
   Nutzungssituation und nicht der Wichtigkeit:

   - LIVE-SESSION unten und am größten. Sie wird unter Zeitdruck geöffnet,
     oft einhändig, während die andere Hand Chips stapelt — und der Daumen
     erreicht die untere Bildschirmhälfte, mehr nicht.
   - LERNEN in der Mitte, mittlere Größe. Wird in Ruhe geöffnet.
   - NACHSCHLAGEN oben und klein. Wer gezielt sucht, findet auch ein kleines
     Ziel.

   Die drei Karten sind die Navigation
   -----------------------------------
   Es gibt keine untere Leiste mehr. Sie führte zu denselben Zielen wie die
   Karten und machte diesen Bildschirm damit zu einem ohne eigenen Inhalt —
   das war der Grund für die leere untere Hälfte, nicht ein Layoutfehler
   (E-032). Deshalb teilen sich die Karten die Fläche vollständig auf.

   Und weil sie die Fläche füllen, brauchen sie Inhalt
   ---------------------------------------------------
   Zwei Textzeilen, auf eine ganze Karte gestreckt, sehen aus wie ein
   Versehen. Jede Karte trägt deshalb das, was sie ohnehin zu sagen hat —
   und wird dadurch zugleich ein kürzerer Weg (E-035):

   - Nachschlagen: die vier häufigsten Ziele als eigene Felder, jedes direkt
     an sein Ziel statt auf die Übersicht.
   - Lernen: die nächste offene Lektion mit Namen, ein Knopf dorthin, der
     Fortschritt als Balken, und Streak, Level und XP — sie gehören hierher
     und standen vorher abgetrennt darüber.
   - Live-Session: läuft eine Runde, steht sie hier mit Spielerzahl und
     Blindstufe; läuft keine, steht hier der Knopf, der eine startet.

   **Keine dekorativen Abbildungen.** Sie füllen Fläche, ohne etwas
   auszusagen, und altern schlecht.

   Die Karten sind deshalb keine Links mehr, sondern Kästen mit einem
   antippbaren Kopf: Ein Link in einem Link ist kein gültiges HTML, und ein
   Bildschirmleser käme damit nicht zurecht.

   Größen und Abstände stehen vollständig in `global.css`, Abschnitt
   „Startseite". In dieser Datei steht keine Gestaltungszahl. */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { HeuteKarte } from '../components/HeuteKarte';
import { Icon } from '../components/Icon';
import { useAppState } from '../state/AppState';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/hub';
import { usePro } from '../lib/pro/ProProvider';
import { grobeDauer } from '../lib/session/dauer';
import { standDerUhr } from '../lib/live/uhr';
import { ladeAbende, type Abend } from '../lib/session/abende';
import { ladeLaufende, nochDabei, type LaufendeSession } from '../lib/session/laufend';
import { handDesTages, tagesschluessel, type TagesHand } from '../lib/heute/hand';
import {
  antwortVon, ergaenze, ladeAntworten, serie, speichereAntworten, woche,
  type TagesAntwort,
} from '../lib/heute/stand';
import { ladeB1, ladeB2 } from '../lib/pokermath/laden';
import { fingerabdruck } from '../lib/potodds/adresse';

/** Die vier Ziele, die aus „Nachschlagen" am häufigsten gesucht werden.
 *
 *  Vier und nicht acht: Sie stehen in einer Reihe, und bei 390 Pixeln
 *  Breite bleiben damit gut 80 Pixel je Feld — genug zum Treffen. Ein
 *  fünftes würde alle vier unter die Mindestgröße drücken. */
const NACHSCHLAGEN = [
  { zu: '/nachschlagen/glossar', text: 'feldGlossar' },
  { zu: '/nachschlagen/haende', text: 'feldHaende' },
  { zu: '/nachschlagen/odds', text: 'feldOdds' },
  { zu: '/nachschlagen/coach', text: 'feldCoach' },
] as const;

export function HubPage() {
  const { data, level } = useAppState();
  const { lang, content } = useLang();
  const L = STR[lang];
  const { enabled: proEnabled } = usePro();

  /* Erst nach dem ersten Rendern lesen: Der Gerätespeicher steht beim
     Serverrendern nicht zur Verfügung, und ein Fehler dort würde die
     Startseite kosten. */
  const [laufend, setLaufend] = useState<LaufendeSession | null>(null);
  const [abende, setAbende] = useState<Abend[]>([]);
  useEffect(() => {
    setLaufend(ladeLaufende());
    setAbende(ladeAbende());
  }, []);

  /* ── Die Hand des Tages ────────────────────────────────────────────────
     Die gerechneten Tabellen kommen über das Netz beziehungsweise aus dem
     Zwischenspeicher des Service Workers. Bis sie da sind, steht an dieser
     Stelle nichts — kein Platzhalter, der später springt, und vor allem
     keine erfundene Hand. Bleibt das Laden erfolglos, bleibt die Karte
     schlicht weg: Die Startseite muss auch ohne sie vollständig sein.

     Läuft gerade eine Runde, entfällt sie ebenfalls. Das ist keine
     Sparmaßnahme, sondern der Unterschied zwischen zwei Situationen: Am
     Tisch liegt das Gerät zwischen Chips und Karten, und wer es dann
     aufnimmt, will die Uhr sehen — nicht eine Übungsaufgabe. Der Bildschirm
     für den Tisch bleibt dadurch unverändert der von vorher. */
  const [heute, setHeute] = useState<{ hand: TagesHand; abdruck: string } | null>(null);
  const [antworten, setAntworten] = useState<TagesAntwort[]>([]);
  useEffect(() => {
    let lebt = true;
    setAntworten(ladeAntworten());
    Promise.all([ladeB1(), ladeB2()])
      .then(([b1, b2]) => {
        if (!lebt) return;
        setHeute({ hand: handDesTages(b1, b2), abdruck: fingerabdruck(b1, b2) });
      })
      .catch(() => { /* Ohne Daten keine Hand des Tages. Mehr passiert nicht. */ });
    return () => { lebt = false; };
  }, []);

  const heuteTag = heute?.hand.tag ?? tagesschluessel();
  const heuteAntwort = antwortVon(antworten, heuteTag);

  const beantworte = useCallback((gewaehlt: 'lohnt' | 'lohnt-nicht') => {
    if (!heute) return;
    const richtig = (gewaehlt === 'lohnt') === heute.hand.aufloesung.lohnt;
    setAntworten((bisher) => {
      const neu = ergaenze(bisher, { tag: heute.hand.tag, gewaehlt, richtig });
      speichereAntworten(neu);
      return neu;
    });
  }, [heute]);

  /* Nur, was wirklich abgeschlossen wurde — ohne Nenner. Eine Gesamtzahl ist
     eine Zusage über den Inhalt, und die deckt der vorhandene nicht: Sie
     zählt Lektionen, die es gibt, und verspricht damit stillschweigend, dass
     sie vollständig sind. Siehe E-032. */
  const doneLessons = Object.keys(data.completedLessons).length;

  /** Die erste Lektion, die noch offen ist — in der Reihenfolge des Kurses.
   *
   *  „Offen" heißt hier schlicht „nicht abgeschlossen". Eine feinere
   *  Auskunft (angefangen, zur Hälfte gelesen) gibt es nicht, weil die App
   *  sie nie erhoben hat; sie hier zu erfinden hieße, eine Zahl zu zeigen,
   *  die niemand gemessen hat. */
  const naechste = useMemo(() => {
    for (const modul of content.modules) {
      for (const lektion of modul.lessons) {
        if (!data.completedLessons[lektion.id]) return { modul, lektion };
      }
    }
    return null;
  }, [content.modules, data.completedLessons]);

  const gesamtLektionen = content.modules.reduce((s, m) => s + m.lessons.length, 0);
  const anteil = gesamtLektionen === 0 ? 0
    : Math.round((100 * doneLessons) / gesamtLektionen);

  /* Erstnutzer erkennen wir daran, dass noch nichts passiert ist — und dazu
     gehören die gespielten Abende. Ohne sie hätte jemand, der die App nur
     für den Pokerabend benutzt, nach dem zehnten Abend immer noch den Satz
     vor sich, der erklärt, was die App tut. Gefunden beim Durchgang: Er
     spielt einen vollständigen Abend und landet danach auf einer
     Startseite, die ihn für einen Neuling hält. */
  const erstesMal = doneLessons === 0 && data.handsPlayed === 0 && data.xp === 0
    && abende.length === 0;

  const uhr = laufend ? standDerUhr(laufend, Date.now()) : null;

  /** Der zuletzt gespielte Abend — nur, wenn gerade keiner läuft.
   *
   *  Er steht hier aus demselben Grund wie die nächste Lektion in der Karte
   *  darüber: Er ist Inhalt, den die Karte ohnehin hat, und ein Tipp darauf
   *  ist der kurze Weg zu genau dem Abend. Ohne ihn hätte die größte Karte
   *  der Seite nur einen Knopf zu zeigen — und ein Knopf, der auf die volle
   *  Höhe gestreckt wird, ist die Leere, die E-035 loswerden wollte, nur in
   *  Knopfform. Gemessen: 0,6 der Innenfläche ohne diese Zeile.
   *
   *  Der jüngste wird gesucht, nicht der erste genommen: `ergaenze` hält die
   *  Liste zwar sortiert, aber `ladeAbende` sortiert nicht nach — ein von
   *  Hand oder aus einer Sicherung eingespielter Speicher käme in beliebiger
   *  Reihenfolge, und dann stünde hier der falsche Abend. */
  const datum = (ms: number) => new Date(ms).toLocaleDateString(
    lang === 'de' ? 'de-DE' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short' },
  );
  const letzter = laufend || abende.length === 0 ? null
    : abende.reduce((a, b) => (b.begonnen > a.begonnen ? b : a));
  const sieger = letzter?.spieler.filter((s) => s.platz === 1).map((s) => s.name).join(', ');

  return (
    <div className="start">
      {/* Beim allerersten Öffnen ein Satz, der sagt, was die App tut. Läuft
          eine Runde, steht sie unten in ihrer eigenen Karte — dort ist sie
          größer und im Daumenbereich, und zweimal dasselbe auf einem
          Bildschirm ist einmal zu viel (E-035). */}
      {erstesMal && !laufend && !heute && <p className="start-erklaerung">{L.wasDieAppTut}</p>}

      {/* Ganz oben und am größten: das Einzige auf dieser Seite, das man
          tun kann, ohne irgendwohin zu gehen (E-036). */}
      {heute && !laufend && (
        <HeuteKarte
          hand={heute.hand}
          abdruck={heute.abdruck}
          antwort={heuteAntwort}
          woche={woche(antworten, heuteTag)}
          serie={serie(antworten, heuteTag)}
          onAntwort={beantworte}
        />
      )}

      {/* ── Klein, oben: Nachschlagen ─────────────────────────────────── */}
      <div className="start-einstieg klein">
        <Link to="/nachschlagen" className="start-kopf">
          <span className="titel">{L.lookupTitle}</span>
        </Link>
        <div className="start-felder">
          {NACHSCHLAGEN.map((z) => (
            <Link key={z.zu} to={z.zu} className="start-feld">{L[z.text]}</Link>
          ))}
        </div>
      </div>

      {/* ── Mittel, Mitte: Lernen ─────────────────────────────────────── */}
      <div className="start-einstieg mittel">
        <Link to="/lernen" className="start-kopf">
          <span className="titel">{L.learnTitle}</span>
        </Link>

        {naechste ? (
          <>
            <div className="start-lektion">
              <span className="marke">{erstesMal ? L.ersteLektion : L.weiterMit}</span>
              <span className="name">{naechste.lektion.title}</span>
            </div>
            <Link
              to={`/lernen/${naechste.modul.id}/${naechste.lektion.id}`}
              className="start-knopf"
            >
              {erstesMal ? L.anfangen : L.weiterlernen}
            </Link>
          </>
        ) : (
          <>
            <div className="start-lektion">
              <span className="name">{L.alleLektionenFertig}</span>
            </div>
            <Link to="/lernen" className="start-knopf">{L.nochmalDurchgehen}</Link>
          </>
        )}

        {/* Der Balken zeigt den Anteil, nennt aber keine Gesamtzahl — aus
            demselben Grund wie der Text daneben (E-032). Ein Anteil an dem,
            was es gibt, ist keine Zusage darüber, wie viel es geben wird. */}
        <div
          className="start-balken"
          role="progressbar"
          aria-label={L.fortschritt}
          aria-valuenow={anteil}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div style={{ width: `${anteil}%` }} />
        </div>

        {/* Streak, Level und XP gehören zum Lernteil. Vorher standen sie in
            einer eigenen Zeile darüber und wirkten dort abgetrennt.

            Beim allerersten Öffnen fehlen sie: „0 Tage-Streak, Level 1,
            0 XP" sagt einem Neuling nichts — dieselbe Überlegung wie beim
            Nenner (E-032). Sie machen dort außerdem genau den Platz frei,
            den der erklärende Satz braucht. */}
        {!erstesMal && (
        <div className="start-stand">
          {/* Eine Zeile, nicht drei Säulen mit Zahl und Beschriftung
              untereinander. Auf einem 375 × 667 großen Gerät stehen alle
              drei Karten auf ihrer Mindesthöhe; die zweite Zeile machte die
              Lernkarte dort höher als die Live-Session und stellte damit
              Regel 10.2 auf den Kopf. Gemessen: 235 gegen 209 Pixel. */}
          <span className="wert">
            <Icon name="flame" size={13} />
            {data.streak.count}
            <span className="marke">
              {data.streak.count > 0 ? L.streakLabel : L.streakNone}
            </span>
          </span>
          <span className="wert">{level}<span className="marke">{L.levelLabel}</span></span>
          <span className="wert">{data.xp}<span className="marke">{L.xpLabel}</span></span>
          {proEnabled && (
            <Link to="/pro" className="small faint">
              <Icon name="crown" size={13} /> Pro
            </Link>
          )}
        </div>
        )}
      </div>

      {/* ── Groß, unten, im Daumenbereich: Live-Session ────────────────── */}
      <div className="start-einstieg gross">
        {laufend && uhr ? (
          <>
            <span className="marke">{L.fortsetzenMarke}</span>
            {/* Ein Abend hat keinen Namen — die App hat nie einen erfragt.
                Was ihn benennt, ist sein Beginn; er ist auch anderswo seine
                Kennung. */}
            <span className="titel">{L.laeuftSeit(grobeDauer(Date.now() - laufend.begonnen, lang))}</span>
            <span className="unter">
              {L.laeuftMit(nochDabei(laufend).length, uhr.blinds[0], uhr.blinds[1])}
            </span>
            <Link to="/session/live" className="start-knopf haupt">{L.zurueckInDieRunde}</Link>
          </>
        ) : (
          <>
            <span className="titel">{L.sessionTitle}</span>
            <span className="unter">{L.sessionSub}</span>
            {/* Der letzte Abend, wenn es einen gibt: Inhalt, den die Karte
                ohnehin hat, und zugleich der kurze Weg dorthin. */}
            {letzter && sieger && (
              <Link to={`/session/abende/${letzter.id}`} className="start-abend">
                <span className="marke">{L.letzterAbendMarke}</span>
                <span className="name">{L.letzterAbend(datum(letzter.begonnen), sieger)}</span>
              </Link>
            )}
            {/* Am Tisch ist das das eigentliche Ziel — ohne Zwischenschritt
                über die Bereichsübersicht. */}
            <Link to="/session/live/einrichten" className="start-knopf haupt">
              {L.abendStarten}
            </Link>
          </>
        )}
        <Link to="/session" className="start-mehr">{L.sessionAlles}</Link>
      </div>
    </div>
  );
}
