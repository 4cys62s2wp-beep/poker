/* Die Hand des Tages — der Grund, die App zu öffnen.
   =================================================

   Was dieser Bildschirmteil zu leisten hat, steht in E-036. Kurz: Eine App,
   die man auf dem Startbildschirm hat und trotzdem nicht antippt, hat kein
   Gestaltungsproblem, sondern kein Angebot. Beim Öffnen sah man bisher
   dasselbe wie gestern, und bevor irgendetwas geschah, musste man sich
   durch ein Menü entscheiden.

   Hier steht deshalb eine Frage, die man **sofort** beantworten kann, ohne
   einen einzigen Weg zu gehen — und morgen steht eine andere da.

   Die Karten sind groß
   --------------------
   Poker hat genau einen Gegenstand, den man ansehen will. In dieser App war
   er 48 Pixel breit und stand als graue Leiste neben dem Text. Eine
   Spielkarte in erkennbarer Größe ist keine Verzierung im Sinne von E-035 —
   sie ist der Gegenstand selbst. Was E-035 verbietet, ist Fläche, die nichts
   sagt; eine Neun in Kreuz sagt alles, worum es in der Aufgabe geht.

   In dieser Datei steht keine Ziffer.
   -----------------------------------
   Dieselbe Regel wie im Drill: Jede Zahl kommt aus `tools/poker-math/`,
   jede Größe aus `global.css`. Ein Test liest diese Datei und schlägt fehl,
   sobald eine Ziffer auftaucht. */

import { Link } from 'react-router-dom';
import { CardsRow } from './PlayingCard';
import { STR as URTEIL } from '../i18n/rueckmeldung';
import { Icon } from './Icon';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/hub';
import { alsBB, alsProzent } from '../lib/potodds/aufgabe';
import { kodiere } from '../lib/potodds/adresse';
import type { TagesHand } from '../lib/heute/hand';
import type { TagesAntwort } from '../lib/heute/stand';
import type { Punkt, Tagesziel } from '../lib/tagesplan';
import { FRAGEN_PRO_TAG } from '../lib/tagesquiz';

interface Props {
  hand: TagesHand;
  /** Der Fingerabdruck der geladenen Daten — für den Weg in den Drill. */
  abdruck: string;
  antwort: TagesAntwort | null;
  woche: Array<{ tag: string; antwort: TagesAntwort | null; istHeute: boolean }>;
  serie: number;
  /** Was heute noch offen ist, dringlichstes zuerst (siehe `lib/tagesplan.ts`). */
  punkte: Punkt[];
  ziel: Tagesziel;
  /** Wie viele Fragen das Tages-Quiz heute stellt. */
  quizFragen: number;
  /** Solange die erste Lektion offen ist, wird die Frage erklärt. */
  einsteiger: boolean;
  /** Allererster Besuch: Die Karte sagt in einem Satz, was die App tut. */
  erstmals: boolean;
  onAntwort: (gewaehlt: 'lohnt' | 'lohnt-nicht') => void;
}

export function HeuteKarte({ hand, abdruck, antwort, woche, serie, punkte, ziel, quizFragen, einsteiger, erstmals, onAntwort }: Props) {
  const { lang } = useLang();
  const L = STR[lang];
  const { aufgabe, aufloesung } = hand;

  /* Der Weg in den Drill zeigt **dieselbe** Aufgabe — nicht irgendeine.
     Sonst wäre „Warum?" eine Themaverfehlung: Wer die Rechnung zu seiner
     Hand sehen will, bekäme eine fremde. */
  const drillWeg = `/lernen/drill/${kodiere(hand.zustand, abdruck)}`;

  /* Die ersten zwei offenen Punkte, nicht alle: Der Block ist ein Hinweis
     auf den nächsten Schritt, keine Aufgabenliste. */
  const zeige = punkte.slice(0, 2);
  const text = (p: Punkt) => {
    if (p.art === 'wiederholen') return L.wiederholen(p.zahl ?? 0);
    if (p.art === 'tagesquiz') return L.tagesquizPunkt;
    return p.erste ? L.ersteLektionPunkt(p.titel ?? '') : L.lektionPunkt(p.titel ?? '');
  };
  /* Haken und leerer Kreis tragen die Auskunft, nicht die Farbe — dazu das
     Wort für Bildschirmleser (DESIGN.md 11). */
  const zielPunkt = (name: string, fertig: boolean) => (
    <span className={`ziel-punkt ${fertig ? 'erledigt' : 'offen'}`}>
      {name}{' '}
      {fertig ? <Icon name="check" size={13} /> : <span className="kreis" aria-hidden="true" />}
      <span className="sr-only">{fertig ? L.zielErledigt : L.zielOffen}</span>
    </span>
  );

  return (
    <section className={`heute${antwort ? ' beantwortet' : ''}`} aria-label={L.heuteMarke}>
      <header className="heute-kopf">
        <span className="marke">{L.heuteMarke}</span>
        <ol className="heute-woche" aria-label={L.heuteWoche}>
          {woche.map((tag) => {
            const zustand = tag.antwort
              ? (tag.antwort.richtig ? 'richtig' : 'falsch')
              : (tag.istHeute ? 'offen' : 'leer');
            const wort = tag.antwort
              ? (tag.antwort.richtig ? L.heuteTagRichtig : L.heuteTagFalsch)
              : (tag.istHeute ? L.heuteTagOffen : L.heuteTagNichts);
            return (
              <li key={tag.tag} className={`punkt ${zustand}`}>
                <span className="sr-only">{`${tag.tag}: ${wort}`}</span>
              </li>
            );
          })}
        </ol>
      </header>

      {/* Der Kern dessen, was beim allerersten Öffnen als eigener Absatz über
          der Karte stand: in der Karte statt darüber, damit die Aufgabe nicht
          nach unten rutscht (E-036). */}
      {erstmals && antwort === null && <p className="heute-erklaerung">{L.heuteErklaerung}</p>}

      {/* Hand und Flop in einer Reihe, durch einen Strich getrennt — so wird
          eine Hand am Tisch gelesen und so passt sie auf ein kurzes Gerät. */}
      <div className="heute-blatt">
        <div className="gruppe">
          <span className="beschriftung">{L.heuteHand}</span>
          <CardsRow cards={aufgabe.hand} size="lg" />
        </div>
        <div className="gruppe flop">
          <span className="beschriftung">{L.heuteFlop}</span>
          <CardsRow cards={aufgabe.flop} size="md" />
        </div>
      </div>

      {antwort === null ? (
        <>
          <p className="heute-frage">
            <span className="lage">
              {L.heuteSetzt(alsBB(aufgabe.einsatzBetrag, lang), alsBB(aufgabe.pot, lang))}
            </span>
            {einsteiger && (
              <span className="rechnung">
                {L.heuteRechnung(alsBB(aufgabe.einsatzBetrag, lang), alsBB(aufgabe.pot + aufgabe.einsatzBetrag, lang))}
              </span>
            )}
            {einsteiger ? (
              <strong>
                {L.heuteFrageEinsteiger[0]}
                <Link to={`/nachschlagen/glossar?q=${encodeURIComponent(L.heuteFrageEinsteiger[1])}`}>
                  {L.heuteFrageEinsteiger[1]}
                </Link>
                {L.heuteFrageEinsteiger[2]}
              </strong>
            ) : (
              <strong>{L.heuteFrage}</strong>
            )}
          </p>
          <div className="heute-wahl">
            <button type="button" className="heute-knopf ja" onClick={() => onAntwort('lohnt')}>
              {L.heuteJa}
            </button>
            <button type="button" className="heute-knopf nein" onClick={() => onAntwort('lohnt-nicht')}>
              {L.heuteNein}
            </button>
          </div>
        </>
      ) : (
        <div className="heute-aufloesung" role="status">
          <p className={`urteil ${antwort.richtig ? 'gut' : 'schlecht'}`}>
            <Icon name={antwort.richtig ? 'check' : 'x'} size={18} />
            {URTEIL[lang][antwort.richtig ? 'richtig' : 'falsch']}
          </p>
          <p className="zahlen">
            {L.heuteGegen(alsProzent(aufloesung.equity, lang), alsProzent(aufloesung.noetig, lang))}
          </p>
          {aufloesung.grenzfall && <p className="knapp">{L.heuteKnapp}</p>}
          <p className="serie">
            {serie > 0 ? L.heuteSerie(serie) : L.heuteErsterTag}
            <span className="morgen">{L.heuteMorgen}</span>
          </p>

          {/* Und jetzt? Das Tagesziel in einer Zeile, darunter höchstens zwei
              Schritte. Der erste ist der Hauptknopf der Karte; „Warum?" ist
              danach nur noch ein Weg unter mehreren. */}
          <div className="heute-noch" role="group" aria-label={L.heuteNoch}>
            <p className="ziel">
              <span className="marke">{L.zielMarke}</span>
              {zielPunkt(L.zielHand, ziel.hand)}
              {ziel.fragen !== null && <>{' · '}{zielPunkt(L.zielFragen(quizFragen), ziel.fragen)}</>}
            </p>
            {zeige.length === 0 ? (
              <p className="fertig">{L.heuteFertig}</p>
            ) : (
              zeige.map((p, i) => (
                <Link key={p.art} to={p.zu} className={`heute-schritt${i === 0 ? ' haupt' : ''}`}>
                  {text(p)}
                </Link>
              ))
            )}
          </div>
          <Link to={drillWeg} className="heute-warum">{L.heuteWarum}</Link>
        </div>
      )}
    </section>
  );
}
