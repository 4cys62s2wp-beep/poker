import { useMemo, useState } from 'react';
import { CardPicker } from '../../components/CardPicker';
import { CardsRow, PlayingCard } from '../../components/PlayingCard';
import { cardToPretty, parseCard, type Card } from '../../lib/poker/cards';
import { equityVsHands } from '../../lib/poker/equity';
import { kartenText, leseKarten } from '../../lib/poker/kartentext';
import { useLang } from '../../i18n';
import { STR } from '../../i18n/pages/equitycalc';
import { Zurueck } from '../../components/ui';

/* Der Equity-Rechner nimmt Karten per Auswahl (E-096): Hand 1, Hand 2, die
   optionale Hand 3 und das Board sind vier Ziele, ein Tipp wählt das Ziel, der
   Kartenwähler darunter füllt es — erst Rang, dann Farbe, bereits vergebene
   Karten sind gesperrt. Die Texteingabe („As Kh“) bleibt als Schnelleingabe.
   Vorher mussten Kürzel samt s/h/d/c und „T“ für Zehn getippt werden, am
   Handy der dritte Weg neben Wählen und Tippen im Live-Coach. */

type Ziel = 'h1' | 'h2' | 'h3' | 'board';
const ZIELE: Ziel[] = ['h1', 'h2', 'h3', 'board'];
const KAPAZITAET: Record<Ziel, number> = { h1: 2, h2: 2, h3: 2, board: 5 };

/** Wohin es nach einer vollen Hand weitergeht: die optionale dritte Hand wird
 *  übersprungen, das Board kommt als Nächstes. */
const WEITER: Record<Ziel, Ziel> = { h1: 'h2', h2: 'board', h3: 'board', board: 'board' };

/** Der Anfangszustand: A♠ K♥ gegen D♦ D♣ — dieselbe Vorbelegung wie bisher. */
const START: Record<Ziel, Card[]> = {
  h1: ['As', 'Kh'].map(parseCard), h2: ['Qd', 'Qc'].map(parseCard), h3: [], board: [],
};

type Karten = Record<Ziel, Card[]>;

export function EquityCalc() {
  const { lang } = useLang();
  const L = STR[lang];
  /* Zwei Hände vorbelegt, damit der erste Tipp schon ein Ergebnis zeigt. */
  const [karten, setKarten] = useState<Karten>(START);
  const [ziel, setZiel] = useState<Ziel>('board');
  const [texte, setTexte] = useState<Record<Ziel, string>>({ h1: kartenText(START.h1), h2: kartenText(START.h2), h3: '', board: '' });
  const [textFehler, setTextFehler] = useState<string | null>(null);
  const [result, setResult] = useState<{ equities: number[]; hands: Card[][]; board: Card[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const vergeben = useMemo(() => new Set(ZIELE.flatMap((z) => karten[z])), [karten]);
  const name = (z: Ziel) => (z === 'h1' ? L.hand1 : z === 'h2' ? L.hand2 : z === 'h3' ? L.hand3 : L.board);

  function setze(z: Ziel, neu: Card[]) {
    setKarten((k) => ({ ...k, [z]: neu }));
    setTexte((t) => ({ ...t, [z]: kartenText(neu) }));
    setResult(null);
    setError(null);
  }

  function waehle(c: Card) {
    const jetzt = karten[ziel];
    if (jetzt.length >= KAPAZITAET[ziel] || vergeben.has(c)) return;
    const neu = [...jetzt, c];
    setze(ziel, neu);
    if (neu.length >= KAPAZITAET[ziel]) setZiel(WEITER[ziel]);
  }

  /** Die Schnelleingabe: Eine lesbare Eingabe wird zur Auswahl, eine unlesbare
   *  bleibt Text und sagt, woran es liegt — die Auswahl bleibt, wie sie war. */
  function tippe(z: Ziel, text: string) {
    setTexte((t) => ({ ...t, [z]: text }));
    const gelesen = leseKarten(text);
    if (gelesen.fehler) {
      setTextFehler(gelesen.fehler.art === 'doppelt' ? L.duplicate : L.invalidCard(gelesen.fehler.token));
      return;
    }
    const andere = new Set(ZIELE.filter((x) => x !== z).flatMap((x) => karten[x]));
    if (gelesen.cards.some((c) => andere.has(c))) { setTextFehler(L.duplicate); return; }
    if (gelesen.cards.length > KAPAZITAET[z]) { setTextFehler(z === 'board' ? L.boardCount : L.exactCards(2)); return; }
    setTextFehler(null);
    setKarten((k) => ({ ...k, [z]: gelesen.cards }));
    setResult(null);
    setError(null);
  }

  function compute() {
    setError(null);
    setResult(null);
    if (karten.h1.length !== 2) return setError(L.handNeedsTwo(1));
    if (karten.h2.length !== 2) return setError(L.handNeedsTwo(2));
    if (karten.h3.length === 1) return setError(L.handNeedsTwo(3));
    if (![0, 3, 4, 5].includes(karten.board.length)) return setError(L.boardCount);

    const hands = [karten.h1, karten.h2, ...(karten.h3.length === 2 ? [karten.h3] : [])];
    setBusy(true);
    // Rechnung asynchron, damit die UI nicht blockiert
    window.setTimeout(() => {
      const equities = equityVsHands(hands, karten.board, 30000);
      setResult({ equities, hands, board: karten.board });
      setBusy(false);
    }, 30);
  }

  const aktivVoll = karten[ziel].length >= KAPAZITAET[ziel];

  return (
    <div>
      <Zurueck to="/nachschlagen" />
      <div className="page-header">
        <h1>{L.title}</h1>
        <p className="sub">{L.sub}</p>
      </div>

      <div className="card">
        {/* Die vier Ziele: ein Tipp auf den Namen wählt, wohin die nächste Karte geht. */}
        <div className="karten-ziele">
          {ZIELE.map((z) => (
            <div key={z} className={`karten-ziel${ziel === z ? ' aktiv' : ''}`}>
              <div className="karten-ziel-kopf">
                <button type="button" className="karten-ziel-name" aria-pressed={ziel === z} onClick={() => setZiel(z)}>
                  {name(z)}
                  {z === 'board' && <span className="small faint karten-ziel-hinweis">{L.boardHint}</span>}
                </button>
                {karten[z].length > 0 && (
                  <button type="button" className="btn sm ghost" onClick={() => setze(z, [])}>
                    {L.leeren}
                  </button>
                )}
              </div>
              <div className="karten-slots">
                {karten[z].map((c) => (
                  <button
                    key={c}
                    type="button"
                    className="karten-slot"
                    aria-label={L.entfernen(cardToPretty(c))}
                    onClick={() => setze(z, karten[z].filter((x) => x !== c))}
                  >
                    <PlayingCard card={c} />
                  </button>
                ))}
                {Array.from({ length: KAPAZITAET[z] - karten[z].length }, (_, i) => (
                  <button key={`leer${i}`} type="button" className="karten-slot leer" aria-label={L.waehleFuer(name(z))} onClick={() => setZiel(z)} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {aktivVoll ? (
          <p className="small muted" role="status">{L.voll(name(ziel))}</p>
        ) : (
          <CardPicker
            count={KAPAZITAET[ziel]}
            used={vergeben}
            onComplete={() => undefined}
            onPick={waehle}
            label={L.waehleFuer(name(ziel))}
          />
        )}

        <details className="schnelleingabe">
          <summary>{L.schnell}</summary>
          <p className="small muted">{L.schnellHinweis}</p>
          <div className="grid" style={{ gap: 'var(--sp-3)' }}>
            {ZIELE.map((z) => (
              <label key={z}>
                <div className="stat-label" style={{ marginBottom: 'var(--sp-1)' }}>{name(z)}</div>
                <input
                  className="text-input"
                  value={texte[z]}
                  onChange={(e) => tippe(z, e.target.value)}
                  placeholder={z === 'h1' ? L.ph1 : z === 'h2' ? L.ph2 : z === 'h3' ? L.ph3 : L.phBoard}
                  autoCapitalize="off"
                  autoComplete="off"
                />
              </label>
            ))}
          </div>
          {textFehler && <div className="feedback-box bad" role="alert" style={{ marginTop: 'var(--sp-3)' }}>{textFehler}</div>}
        </details>

        {error && (
          <div className="feedback-box bad" role="alert" style={{ marginTop: 'var(--sp-4)' }}>
            {error}
          </div>
        )}

        <button className="btn primary lg" style={{ marginTop: 'var(--sp-4)' }} onClick={compute} disabled={busy}>
          {busy ? L.computing : L.compute}
        </button>

        {result && (
          <div style={{ marginTop: 22 }}>
            {result.board.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div className="stat-label" style={{ marginBottom: 6 }}>{L.board}</div>
                <CardsRow cards={result.board} />
              </div>
            )}
            {result.hands.map((h, i) => {
              const pct = result.equities[i] * 100;
              return (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div className="row between" style={{ marginBottom: 6 }}>
                    <CardsRow cards={h} size="sm" />
                    <span className="big-stat" style={{ fontSize: 'var(--fs-ueberschrift)' }}>{L.fmtPct(pct)}</span>
                  </div>
                  <div className="progressbar">
                    <div style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            <p className="small faint">{L.mcNote}</p>
          </div>
        )}
      </div>
    </div>
  );
}
