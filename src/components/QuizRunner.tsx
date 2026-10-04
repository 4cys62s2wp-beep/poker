/* Das Quiz im Fokusmodus.
   =======================

   Eine Frage je Bildschirm, alles andere tritt zurück:

   - **Oben** nur ein Kreuz, ein Balken und „2/5" — keine Überschrift und keine
     Seitenkopfzeile. Die Frage begann vorher erst bei y ≈ 500.
   - **Unten** die Ergebnisleiste (`quiz-leiste`): Sie hat von Anfang an ihre
     feste Höhe, belegt also ihren Platz, bevor sie etwas zu sagen hat. Die
     Rückmeldung erscheint in ihr — **keine Option verschiebt sich um einen
     Pixel** (Regel 8a.2). Vorher lag die Rückmeldung bei y = 823 und der Knopf
     „Nächste Frage" bei y = 962: unter dem Bildschirmrand.
   - Die Leiste trägt `entscheidung`, damit Regel 9a.1 sie prüft.

   Die Optionen werden gemischt (siehe `lib/lernen/quiz.ts`). Nach außen sieht
   man davon nichts: `onWrong` bekommt den Index der **Frage** im übergebenen
   Feld, und das Ergebnis nennt Antworten mit ihrer Originalstelle. */

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { QuizQuestion } from '../content/types';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/quiz';
import { frischerStartwert } from '../lib/zufall';
import { mischeAlle } from '../lib/lernen/quiz';
import { Rueckmeldung } from './Rueckmeldung';
import { CardsRow } from './PlayingCard';
import { Icon } from './Icon';

/** Eine falsch beantwortete Frage, in der Reihenfolge des Originals. */
export interface FalscheAntwort {
  /** Index der Frage im übergebenen Feld. */
  index: number;
  frage: QuizQuestion;
  /** Die gewählte Option — Stelle im Original. */
  gewaehlt: number;
}

export interface QuizErgebnis {
  score: number;
  total: number;
  falsch: FalscheAntwort[];
}

/** Der Zwischenstand: bestätigte Antworten (angezeigte Stelle) und der
 *  Startwert, aus dem sich dieselbe Mischung ergibt. */
export interface QuizZustand {
  startwert: string;
  antworten: number[];
}

interface Props {
  questions: QuizQuestion[];
  /** Wird nach der letzten Frage aufgerufen. */
  onFinish: (score: number, total: number) => void;
  /** Optional: bei jeder Antwort aufgerufen (für Trainer-Statistiken). */
  onAnswer?: (correct: boolean) => void;
  /** Optional: bei falscher Antwort mit dem Fragen-Index aufgerufen (Spaced Repetition). */
  onWrong?: (questionIndex: number) => void;
  /** Startwert der Mischung; ohne Angabe ein frischer je Durchgang. Das
   *  Tages-Quiz gibt das Datum, damit alle am selben Tag dasselbe sehen. */
  startwert?: string;
  /** Ein früher verlassener Durchgang, an dem es weitergeht. */
  fortsetzen?: QuizZustand | null;
  /** Wird nach jeder bestätigten Frage gerufen; `null` nach dem Ende. */
  onZustand?: (z: QuizZustand | null) => void;
  /** Das Kreuz oben links. Ohne Angabe gibt es keins. */
  onSchliessen?: () => void;
  /** Der Ergebnisbildschirm der aufrufenden Seite; sonst der einfache. */
  ergebnis?: (e: QuizErgebnis) => ReactNode;
  /** Die Überschrift der Seite — nur für Vorlesegeräte. Der Fokusmodus hat
   *  keine sichtbare; die Gliederung braucht trotzdem eine erste Ebene. */
  titel?: string;
}

export function QuizRunner({
  questions, onFinish, onAnswer, onWrong, startwert, fortsetzen, onZustand, onSchliessen, ergebnis, titel,
}: Props) {
  const { lang } = useLang();
  const L = STR[lang];
  const [seed] = useState(() => fortsetzen?.startwert ?? startwert ?? frischerStartwert());
  const gemischt = useMemo(() => mischeAlle(questions, seed), [questions, seed]);
  const [antworten, setAntworten] = useState<number[]>(
    () => fortsetzen?.antworten.slice(0, questions.length) ?? [],
  );
  const [gewaehlt, setGewaehlt] = useState<number | null>(null);
  const [fertig, setFertig] = useState(false);
  const [rueckfrage, setRueckfrage] = useState(false);

  const total = questions.length;
  const index = antworten.length;
  const g = gemischt[index];
  if (!g && !fertig) return null;

  const richtigBisher = antworten.filter((a, i) => a === gemischt[i].frage.correctIndex).length;
  const beantwortet = gewaehlt !== null;
  const weiterRef = useRef<HTMLButtonElement>(null);
  const frageRef = useRef<HTMLHeadingElement>(null);

  /* Die gewählte Option wird gesperrt und verliert den Fokus. Statt ihn im
     Nichts zu lassen, wandert er zu „Nächste Frage" — bei Tastatur und
     Bildschirmleser liegt die nächste Handlung dort, wo man ist. */
  useEffect(() => {
    if (beantwortet) weiterRef.current?.focus({ preventScroll: true });
  }, [beantwortet, index]);

  /* Nach „Nächste Frage" sperrt sich der Knopf: Der Fokus geht an die neue
     Frage, die der Bildschirmleser damit vorliest. */
  useEffect(() => {
    if (index > 0 && !fertig) frageRef.current?.focus({ preventScroll: true });
  }, [index, fertig]);
  const letzte = index === total - 1;

  function ergebnisAus(alle: number[]): QuizErgebnis {
    const falsch: FalscheAntwort[] = [];
    alle.forEach((a, i) => {
      if (a !== gemischt[i].frage.correctIndex) {
        falsch.push({ index: i, frage: questions[i], gewaehlt: gemischt[i].original[a] });
      }
    });
    return { score: alle.length - falsch.length, total, falsch };
  }

  function waehle(i: number) {
    if (beantwortet) return;
    setGewaehlt(i);
    const richtig = i === g.frage.correctIndex;
    if (!richtig) onWrong?.(index);
    onAnswer?.(richtig);
  }

  function weiter() {
    if (gewaehlt === null) return;
    const neu = [...antworten, gewaehlt];
    setAntworten(neu);
    setGewaehlt(null);
    if (letzte) {
      const e = ergebnisAus(neu);
      setFertig(true);
      onZustand?.(null);
      onFinish(e.score, total);
    } else {
      onZustand?.({ startwert: seed, antworten: neu });
    }
  }

  function schliessen() {
    /* Eine Rückfrage erst, wenn etwas auf dem Spiel steht: ab der ersten
       bestätigten Antwort. Wer bei Frage 1 wieder geht, verliert nichts. */
    if (index === 0 && !beantwortet) onSchliessen?.();
    else setRueckfrage(true);
  }

  if (fertig) {
    const e = ergebnisAus(antworten);
    if (ergebnis) {
      return (
        <>
          {titel && <h1 className="sr-only">{titel}</h1>}
          {ergebnis(e)}
        </>
      );
    }
    const pct = Math.round((100 * e.score) / total);
    return (
      <div className="card" style={{ textAlign: 'center' }} role="status" aria-live="polite">
        {titel && <h1 className="sr-only">{titel}</h1>}
        <div className="big-stat">{e.score} / {total}</div>
        <p className="muted" style={{ marginTop: 6 }}>
          {pct === 100 ? L.perfect : pct >= 60 ? L.good : L.retry}
        </p>
      </div>
    );
  }

  const anteil = (index + (beantwortet ? 1 : 0)) / total;
  const richtig = beantwortet && gewaehlt === g.frage.correctIndex;

  return (
    <div className="quiz-fokus">
      {titel && <h1 className="sr-only">{titel}</h1>}
      <div className="quiz-kopf">
        {onSchliessen && (
          <button type="button" className="quiz-schliessen" aria-label={L.closeLabel} onClick={schliessen}>
            <Icon name="x" size={20} />
          </button>
        )}
        <div
          className="progressbar quiz-balken"
          role="progressbar"
          aria-label={L.question(index + 1, total)}
          aria-valuenow={index + (beantwortet ? 1 : 0)}
          aria-valuemin={0}
          aria-valuemax={total}
        >
          <div style={{ width: `${100 * anteil}%` }} />
        </div>
        <span className="quiz-zaehler" aria-hidden="true">{index + 1}/{total}</span>
        <span className="sr-only">{L.correctCount(richtigBisher + (richtig ? 1 : 0))}</span>
      </div>

      {rueckfrage && (
        <div className="quiz-rueckfrage card" role="alertdialog" aria-label={L.leaveTitle}>
          <strong>{L.leaveTitle}</strong>
          <p className="small muted">{L.leaveBody(index + 1)}</p>
          <div className="row wrap">
            <button type="button" className="btn sm primary" onClick={() => setRueckfrage(false)}>{L.leaveStay}</button>
            <button type="button" className="btn sm ghost" onClick={() => onSchliessen?.()}>{L.leaveGo}</button>
          </div>
        </div>
      )}

      <h2 className="quiz-frage" ref={frageRef} tabIndex={-1}>{g.frage.question}</h2>

      {/* Karten als Karten, nicht als Text: Ein Board in Buchstaben liest
          man, ein Board in Karten sieht man. */}
      {(g.frage.cards || g.frage.board) && (
        <div className="quiz-karten">
          {g.frage.cards && <CardsRow cards={g.frage.cards} size="md" />}
          {g.frage.board && <CardsRow cards={g.frage.board} size="md" />}
        </div>
      )}

      <div className="quiz-optionen">
        {g.frage.options.map((opt, i) => {
          let cls = 'quiz-option';
          if (beantwortet) {
            if (i === g.frage.correctIndex) cls += ' correct';
            else if (i === gewaehlt) cls += ' wrong';
            else cls += ' dimmed';
          }
          return (
            <button key={i} type="button" className={cls} onClick={() => waehle(i)} disabled={beantwortet}>
              <span className="pill" style={{ minWidth: 28, justifyContent: 'center', flexShrink: 0 }}>
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Die Ergebnisleiste hat immer ihre Höhe, auch leer: Sie belegt den
          Platz, bevor sie etwas zu sagen hat, damit sich beim Antworten
          nichts verschiebt. */}
      <div className="quiz-leiste entscheidung-leiste entscheidung">
        <div className="quiz-leiste-innen">
          <div className="quiz-leiste-text">
            {beantwortet && (
              <Rueckmeldung urteil={richtig ? 'richtig' : 'falsch'}>
                {/* Bei einer falschen Wahl zuerst, warum gerade diese falsch
                    ist — falls die Frage es weiß. */}
                {!richtig && gewaehlt !== null && g.frage.optionFeedback?.[gewaehlt] && (
                  <>{g.frage.optionFeedback[gewaehlt]}{' '}</>
                )}
                {g.frage.explanation}
              </Rueckmeldung>
            )}
          </div>
          {/* Immer da, vor der Antwort gesperrt: Ein Knopf, der erst erscheint,
              verschöbe nichts (der Platz ist reserviert), nähme der Leiste aber
              ihren festen Inhalt — und ein Knopf, der bleibt, behält den Fokus. */}
          <button
            ref={weiterRef}
            type="button"
            className="btn primary quiz-weiter"
            onClick={weiter}
            disabled={!beantwortet}
          >
            {!beantwortet ? L.hint : letzte ? L.finish : L.next}
          </button>
        </div>
      </div>
    </div>
  );
}
