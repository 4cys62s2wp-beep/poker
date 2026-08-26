/* „Warum diese Zahl" — die Herkunftsanzeige.
   =========================================

   Das ist kein Beiwerk. Jede App kann eine Prozentzahl anzeigen; nachweisen,
   woher sie kommt, kann fast keine. Deshalb steht neben jeder gerechneten
   Zahl ein kleines Fragezeichen, und wer es antippt, sieht:

   - wo die Zahl in welcher Datei steht (Feldpfad, nachprüfbar),
   - wie gerechnet wurde und über wie viele Fälle,
   - unter welchen Annahmen sie gilt — samt der Kartenzahlen,
   - mit welcher Bibliothek in welcher Version,
   - von wann der Stand ist.

   Alles davon kommt **wörtlich aus dem Herkunftsblock der Datei**. Diese
   Datei formuliert nichts nach. Wo eine Angabe fehlt, sagt sie das offen,
   statt eine plausible Zahl einzusetzen — genau das wäre der Fehler, gegen
   den die ganze Konstruktion gebaut ist.

   Warum ein Blatt von unten und keine Ausklappzeile
   -------------------------------------------------
   Eine Zeile, die sich unter der Zahl auftut, verschiebt alles darunter. Im
   Pot-Odds-Drill ist genau das verboten: Zwischen Antwort und Auflösung darf
   sich nichts bewegen. Ein Blatt, das über den Inhalt fährt, lässt die Seite
   in Ruhe — und kommt von unten, wo der Daumen ist. */

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/herkunft';
import type { Herkunft } from '../lib/pokermath/typen';

/** Ein Wert in einer gerechneten Datei. */
export interface Quelle {
  /** Der Feldpfad, z. B. `b1_outs.outs[8].turn_oder_river`. Nachprüfbar:
   *  Wer die Datei öffnet, findet die Zahl genau dort. */
  pfad: string;
  herkunft: Herkunft;
}

/** Woher eine angezeigte Zahl kommt.
 *
 *  Eine Quelle heißt: direkt abgelesen. Mehrere heißen: Die App hat den Wert
 *  aus ihnen gebildet — dann werden alle genannt, jede mit ihrer eigenen
 *  Herkunft. Ein Abstand zwischen zwei Zahlen aus zwei Dateien hat zwei
 *  Herkünfte, und beide gehören dazu. */
export interface Zahlenherkunft {
  quellen: Quelle[];
}

function datum(iso: string, sprache: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(sprache, { dateStyle: 'long', timeStyle: 'short' }).format(d);
}

/** Eine Zahl mit ihrem Herkunftszeichen.
 *
 *  `wert` ist bereits fertig formatiert — diese Komponente rechnet nicht und
 *  rundet nicht. */
export function Zahl({
  wert,
  quelle,
  className,
}: {
  wert: ReactNode;
  quelle: Zahlenherkunft;
  className?: string;
}) {
  const { lang } = useLang();
  const T = STR[lang];
  const [offen, setOffen] = useState(false);

  return (
    <span className={className}>
      {wert}
      <button
        type="button"
        className="herkunft-zeichen"
        aria-label={T.oeffnen}
        title={T.oeffnen}
        onClick={() => setOffen(true)}
      >
        <Icon name="info" size={13} />
      </button>
      {offen && <Blatt wert={wert} quelle={quelle} schliessen={() => setOffen(false)} />}
    </span>
  );
}

function Blatt({
  wert,
  quelle,
  schliessen,
}: {
  wert: ReactNode;
  quelle: Zahlenherkunft;
  schliessen: () => void;
}) {
  const { lang } = useLang();
  const T = STR[lang];
  const schliessenRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    schliessenRef.current?.focus();
    const beiTaste = (e: KeyboardEvent) => { if (e.key === 'Escape') schliessen(); };
    document.addEventListener('keydown', beiTaste);
    return () => document.removeEventListener('keydown', beiTaste);
  }, [schliessen]);

  const mehrere = quelle.quellen.length > 1;

  return createPortal(
    <div className="herkunft-grund" role="dialog" aria-modal="true" aria-label={T.titel} onClick={schliessen}>
      <div className="herkunft-blatt" onClick={(e) => e.stopPropagation()}>
        <div className="herkunft-kopf">
          <div>
            <div className="herkunft-titel">{T.titel}</div>
            <div className="herkunft-wert">{wert}</div>
          </div>
          <button ref={schliessenRef} type="button" className="herkunft-zu" onClick={schliessen}>
            {T.schliessen}
          </button>
        </div>

        <div className="herkunft-inhalt">
          {mehrere && <p className="herkunft-vorspann">{T.abgeleitet}</p>}
          {quelle.quellen.map((q) => <Quellenblock key={q.pfad} quelle={q} />)}
        </div>
      </div>
    </div>,
    document.body,
  );
}

function Quellenblock({ quelle }: { quelle: Quelle }) {
  const { lang } = useLang();
  const T = STR[lang];
  const h = quelle.herkunft;

  return (
    <div className="herkunft-quelle">
      <Abschnitt titel={T.woSteht}>
        <code className="herkunft-pfad">{quelle.pfad}</code>
      </Abschnitt>

      <Abschnitt titel={T.rechenweg}>
        <p>{h.methode === 'exakt' ? T.methodeExakt : T.methodeMonteCarlo}</p>
        {h.faelle_enumeriert === null ? (
          /* Offen sagen, dass die Angabe fehlt. Sie hier auszurechnen hieße,
             sie zu erfinden – die Datei ist der Nachweis, nicht diese
             Komponente. Siehe BLOCKER.md, B-003. */
          <p className="herkunft-fehlt">{T.faelleFehlen}</p>
        ) : (
          <Feld name={T.faelle} wert={h.faelle_enumeriert.toLocaleString(lang)} />
        )}
      </Abschnitt>

      <Abschnitt titel={T.zweck}>
        <p>{h.zweck}</p>
      </Abschnitt>

      <Abschnitt titel={T.annahmen}>
        <Feld name={T.sicht} wert={h.annahmen.sicht} />
        <Feld name={T.unbekannt} wert={h.annahmen.unbekannte_karten} />
        <Feld name={T.kartenzahlen} wert={T.karten(h.annahmen.kartenzahlen)} />
        <Feld name={T.splitPot} wert={h.annahmen.split_pot} />
      </Abschnitt>

      {h.annahmen.besonderheiten.length > 0 && (
        <Abschnitt titel={T.besonderheiten}>
          {h.annahmen.besonderheiten.map((b) => <p key={b.schluessel}>{b.satz}</p>)}
        </Abschnitt>
      )}

      <Abschnitt titel={T.womit}>
        {h.bibliothek
          ? <p>{T.bibliothek(h.bibliothek.name, h.bibliothek.version)}</p>
          /* Auch das ist eine Angabe, keine Lücke: B2 und B3 rechnen
             kombinatorisch, dort ist keine Bibliothek im Spiel. */
          : <p className="herkunft-fehlt">{T.bibliothekFehlt}</p>}
      </Abschnitt>

      <Abschnitt titel={T.stand}>
        <p>{datum(h.erzeugt_am, lang)}</p>
        <Feld name={T.quelle} wert={h.quelle} />
      </Abschnitt>
    </div>
  );
}

function Abschnitt({ titel, children }: { titel: string; children: ReactNode }) {
  return (
    <section className="herkunft-abschnitt">
      <h3>{titel}</h3>
      {children}
    </section>
  );
}

function Feld({ name, wert }: { name: string; wert: string }) {
  return (
    <p className="herkunft-feld">
      <span className="herkunft-feld-name">{name}</span>
      <span>{wert}</span>
    </p>
  );
}
