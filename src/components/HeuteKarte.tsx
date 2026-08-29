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
import { Icon } from './Icon';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/hub';
import { alsBB, alsProzent } from '../lib/potodds/aufgabe';
import { kodiere } from '../lib/potodds/adresse';
import type { TagesHand } from '../lib/heute/hand';
import type { TagesAntwort } from '../lib/heute/stand';

interface Props {
  hand: TagesHand;
  /** Der Fingerabdruck der geladenen Daten — für den Weg in den Drill. */
  abdruck: string;
  antwort: TagesAntwort | null;
  woche: Array<{ tag: string; antwort: TagesAntwort | null; istHeute: boolean }>;
  serie: number;
  onAntwort: (gewaehlt: 'lohnt' | 'lohnt-nicht') => void;
}

export function HeuteKarte({ hand, abdruck, antwort, woche, serie, onAntwort }: Props) {
  const { lang } = useLang();
  const L = STR[lang];
  const { aufgabe, aufloesung } = hand;

  /* Der Weg in den Drill zeigt **dieselbe** Aufgabe — nicht irgendeine.
     Sonst wäre „Warum?" eine Themaverfehlung: Wer die Rechnung zu seiner
     Hand sehen will, bekäme eine fremde. */
  const drillWeg = `/lernen/drill/${kodiere(hand.zustand, abdruck)}`;

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
            <strong>{L.heuteFrage}</strong>
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
            {antwort.richtig ? L.heuteRichtig : L.heuteDaneben}
          </p>
          <p className="zahlen">
            {L.heuteGegen(alsProzent(aufloesung.equity, lang), alsProzent(aufloesung.noetig, lang))}
          </p>
          {aufloesung.grenzfall && <p className="knapp">{L.heuteKnapp}</p>}
          <p className="serie">
            {serie > 0 ? L.heuteSerie(serie) : L.heuteErsterTag}
            <span className="morgen">{L.heuteMorgen}</span>
          </p>
          <Link to={drillWeg} className="heute-warum">{L.heuteWarum}</Link>
        </div>
      )}
    </section>
  );
}
