import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Zurueck } from '../components/ui';
import { Blatt } from '../components/Blatt';
import { Icon } from '../components/Icon';
import { Schalter } from '../components/Schalter';
import { createHandTracker, type HandTracker } from '../lib/poker/stats';
import { CardsRow, PlayingCard } from '../components/PlayingCard';
import { BOT_PROFILES, decideBotAction, positionOf, type BotStyle } from '../lib/poker/ai';
import { equityVsRandomHands } from '../lib/poker/equity';
import {
  applyAction,
  createHand,
  legalActions,
  setEngineLanguage,
  totalPot,
  type Action,
  type GameState,
  type LogAktion,
  type Street,
} from '../lib/poker/engine';
import { useAppState } from '../state/AppState';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/play';
import { STR as PRO } from '../i18n/pages/pro';
import { usePro } from '../lib/pro/ProProvider';
import { MitBegriffen } from '../components/Begriff';
import { formatBB } from '../lib/poker/bb';
import { einsatzSchritt, einsatzVorgaben, standardEinsatz, type Vorgabe } from '../lib/poker/einsatz';
import {
  bewerteAktion,
  coachForTable,
  type TischAktion,
  type TischRat,
  type Urteil,
} from '../lib/poker/tischcoach';
import { aktionJeSitz, letzteAktion, vorname } from '../lib/poker/tischansicht';
import { showdownVergleich } from '../lib/poker/handtext';
import {
  ladeTischEinstellung,
  speichereTischEinstellung,
  type TischEinstellung,
} from '../lib/poker/tischeinstellung';

const START_STACK = 200; // 100 BB bei Blinds 0,5/1 BB (Chips: 1/2)
const SB = 1;
const BB = 2;

/** Spielstile der KI-Sitze; die Anzeigenamen liegen sprachabhängig im Wörterbuch (STR[lang].botNames). */
const BOT_STYLES: BotStyle[] = ['tight', 'aggro', 'loose', 'standard', 'tight'];

/** Eine bewertete Entscheidung des Menschen — für das Urteil am Tisch und den Rückblick. */
interface Entscheidung {
  street: Street;
  tat: TischAktion;
  /** Bet oder Raise? (Für die Anzeige „Bet" statt „Raise".) */
  istBet: boolean;
  urteil: Urteil;
  rat: TischRat;
}

interface Bilanz {
  haende: number;
  urteile: Record<Urteil, number>;
}

function zuTischAktion(a: Action): TischAktion {
  return a.type === 'raise' ? 'raise' : a.type;
}

export function PlayPage() {
  const { data, recordHand, addHandRecord } = useAppState();
  const { lang } = useLang();
  const L = STR[lang];
  const P = PRO[lang];
  const { access, can, consume, openPaywall } = usePro();
  const [numOpponents, setNumOpponents] = useState<number | null>(null);
  const [einst, setEinst] = useState<TischEinstellung>(ladeTischEinstellung);
  const gameRef = useRef<GameState | null>(null);
  const [tick, setTick] = useState(0);
  const rerender = () => setTick((t) => t + 1);
  const botTimer = useRef<number | null>(null);
  const stacksRef = useRef<number[]>([]);
  const buttonRef = useRef(0);
  const handCounter = useRef(0);
  const handRecorded = useRef(false);
  const trackerRef = useRef<HandTracker | null>(null);
  const sawFlopRef = useRef(false);
  /** Offen, solange eine Einsatzgröße gewählt wird; sonst null. */
  const [raiseTo, setRaiseTo] = useState<number | null>(null);
  const [tippOffen, setTippOffen] = useState(false);
  const [blatt, setBlatt] = useState<{ rat: TischRat; entscheidung?: Entscheidung } | null>(null);
  const [bilanz, setBilanz] = useState<Bilanz | null>(null);
  const entscheidungen = useRef<Entscheidung[]>([]);
  const sitzung = useRef<Bilanz>({ haende: 0, urteile: { gut: 0, vertretbar: 0, fehler: 0 } });
  const ratRef = useRef<TischRat | null>(null);
  const raiseKnopfRef = useRef<HTMLButtonElement>(null);
  const bestaetigenRef = useRef<HTMLButtonElement>(null);
  const mitteKnopfRef = useRef<HTMLButtonElement>(null);
  const einsatzWarOffen = useRef(false);

  /* Der Coach ist eine Pro-Funktion, der Tisch selbst ist gratis mit
     Tageslimit. Ohne Monetarisierung sind can()/access() immer offen. */
  const coachAllowed = can('play-coach');
  const coachAn = einst.coach && coachAllowed;
  const playAccess = access('play-hands');
  const freeLeft =
    playAccess.state === 'allowed' && playAccess.remaining !== undefined && playAccess.limit !== undefined
      ? P.remaining(playAccess.remaining, playAccess.limit)
      : null;

  function aendere(patch: Partial<TischEinstellung>) {
    const neu = { ...einst, ...patch };
    setEinst(neu);
    speichereTischEinstellung(neu);
  }

  const bbText = (chips: number) => formatBB(chips, BB, lang);

  // Engine-Log in der UI-Sprache schreiben lassen
  useEffect(() => {
    setEngineLanguage(lang);
  }, [lang]);

  /* Eine Nutzung = eine ausgeteilte Hand. Ohne Monetarisierung liefert
     access() immer „allowed“ – dann läuft alles wie bisher. */
  function handAllowed(): boolean {
    if (access('play-hands').state === 'allowed') return true;
    openPaywall('play');
    return false;
  }

  function startSession(opponents: number) {
    // Erst prüfen, dann den Tisch aufbauen – sonst bliebe ein leerer Tisch stehen.
    if (!handAllowed()) return;
    setNumOpponents(opponents);
    setBilanz(null);
    sitzung.current = { haende: 0, urteile: { gut: 0, vertretbar: 0, fehler: 0 } };
    stacksRef.current = new Array(opponents + 1).fill(START_STACK);
    buttonRef.current = 0;
    handCounter.current = 0;
    /* Der Tisch beginnt oben: Wer die Auswahl weit unten antippte, sah sonst
       die untere Hälfte des Tisches (gemessen: scrollY 343). */
    window.scrollTo(0, 0);
    startHand(opponents);
  }

  function startHand(opponents?: number) {
    if (!handAllowed()) return;
    consume('play-hands');
    const n = (opponents ?? numOpponents ?? 1) + 1;
    // Rebuy für Pleite-Spieler
    for (let i = 0; i < n; i++) {
      if (stacksRef.current[i] < BB * 2) stacksRef.current[i] = START_STACK;
    }
    handCounter.current += 1;
    buttonRef.current = (buttonRef.current + 1) % n;
    handRecorded.current = false;
    trackerRef.current = createHandTracker();
    sawFlopRef.current = false;
    entscheidungen.current = [];
    setRaiseTo(null);
    setTippOffen(false);
    setBlatt(null);
    setEngineLanguage(lang);
    const players = Array.from({ length: n }, (_, i) => ({
      id: i,
      name: i === 0 ? L.heroName : L.botNames[i - 1],
      stack: stacksRef.current[i],
      isHero: i === 0,
    }));
    gameRef.current = createHand(players, buttonRef.current, SB, BB, handCounter.current);
    rerender();
  }

  function verlassen() {
    if (sitzung.current.haende > 0) setBilanz({ ...sitzung.current });
    setNumOpponents(null);
    gameRef.current = null;
    setRaiseTo(null);
    setBlatt(null);
  }

  /** Ein Bot-Zug; fällt auf eine sichere Aktion zurück, wenn die Wahl nicht gilt. */
  function botZug(gg: GameState) {
    const idx = gg.toActIndex;
    const bot = gg.players[idx];
    if (!bot || bot.isHero) return false;
    const profile = BOT_PROFILES[BOT_STYLES[bot.id - 1]];
    try {
      applyAction(gg, decideBotAction(gg, idx, profile));
    } catch {
      // Fallback: sichere Aktion
      const la = legalActions(gg);
      applyAction(gg, la.canCheck ? { type: 'check' } : { type: 'fold' });
    }
    return true;
  }

  /** Nach einem eigenen Fold: den Rest der Hand ohne Wartezeit spielen. */
  function handZuEnde() {
    const gg = gameRef.current;
    if (!gg) return;
    let schutz = 0;
    while (!gg.handOver && schutz++ < 200 && botZug(gg)) { /* weiter */ }
    rerender();
  }

  // Bot-Zug-Schleife
  useEffect(() => {
    const g = gameRef.current;
    if (!g) return;

    /* Flop gesehen? Muss VOR dem handOver-Abbruch stehen: Bei einem All-in vor
       dem Flop läuft das Board in einem Zug durch und die Hand ist sofort
       vorbei – gesehen hat der Spieler den Flop trotzdem, und genau solche
       Hände gehören in den Nenner der Showdown-Quote. */
    if (!sawFlopRef.current && g.board.length >= 3 && !g.players[0].folded) {
      sawFlopRef.current = true;
      trackerRef.current?.onSawFlop();
    }

    if (g.handOver) {
      if (!handRecorded.current) {
        handRecorded.current = true;
        const heroWon = g.awards.some((a) => a.playerId === 0 && a.amount > 0);
        const hero = g.players[0];
        const delta = hero.stack - stacksRef.current[0];
        /* Showdown heißt: Der Hero war bis zum Schluss dabei UND mindestens
           ein Gegner auch. Wer alle anderen zum Folden bringt, gewinnt ohne
           Showdown – das darf die WTSD-Quote nicht verfälschen. */
        const showdown = !hero.folded && g.players.filter((p) => !p.folded).length > 1;
        const facts = trackerRef.current?.finish({
          won: heroWon,
          showdown,
          netChips: delta,
        });
        recordHand(heroWon, facts);
        addHandRecord({
          handNumber: g.handNumber,
          heroCards: hero.cards,
          board: g.board,
          result: heroWon ? 'won' : hero.folded ? 'folded' : 'lost',
          amount: delta,
          players: g.players.length,
          log: g.log.map((e) => e.text),
        });
        // Für die Bilanz beim Verlassen des Tisches.
        sitzung.current.haende += 1;
        for (const e of entscheidungen.current) sitzung.current.urteile[e.urteil] += 1;
      }
      // Stacks sichern
      for (const p of g.players) stacksRef.current[p.id] = p.stack;
      return;
    }

    const actor = g.players[g.toActIndex];
    if (!actor || actor.isHero) return;

    botTimer.current = window.setTimeout(() => {
      const gg = gameRef.current;
      if (!gg || gg.handOver) return;
      botZug(gg);
      rerender();
    }, 550 + Math.random() * 700);
    return () => {
      if (botTimer.current) window.clearTimeout(botTimer.current);
    };
  });

  const g = gameRef.current;

  const hero = g?.players[0];
  const heroTurn = !!g && !g.handOver && g.toActIndex === 0;
  const la = heroTurn && g ? legalActions(g) : null;

  /* Der Fokus folgt der Leiste: Öffnet sich die Einsatzwahl, geht er auf
     „Raise auf …"; schließt sie sich, zurück auf den Knopf, der sie geöffnet hat;
     und wer dran ist, bekommt ihn auf „Call/Check" — sonst läge er im Nichts,
     sobald ein Knopf verschwindet oder sich sperrt. */
  const einsatzOffen = raiseTo !== null;
  useEffect(() => {
    if (blatt) return;
    if (einsatzOffen) bestaetigenRef.current?.focus({ preventScroll: true });
    else if (einsatzWarOffen.current) raiseKnopfRef.current?.focus({ preventScroll: true });
    einsatzWarOffen.current = einsatzOffen;
  }, [einsatzOffen, blatt]);
  useEffect(() => {
    if (heroTurn && !blatt) mitteKnopfRef.current?.focus({ preventScroll: true });
  }, [heroTurn, blatt, tick]);

  /* Der Rat für diesen Zug. Er wird auch gebraucht, wenn er nicht angezeigt
     wird: Die Bewertung nach der Aktion vergleicht mit ihm. Die Equity (gegen
     Zufallshände) braucht erst der Flop. */
  const rat = useMemo(() => {
    if (!g || !hero || !coachAn || !heroTurn) return null;
    let equity: number | null = null;
    if (g.street !== 'preflop' && g.board.length >= 3) {
      const gegner = g.players.filter((p) => !p.folded && !p.isHero).length;
      equity = equityVsRandomHands(hero.cards, g.board, Math.max(1, gegner), 500);
    }
    return coachForTable(g, equity, lang);
    // `g` wird an Ort und Stelle verändert; `tick` zeigt jede Änderung an.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, coachAn, heroTurn, lang]);
  ratRef.current = rat;

  const vorgaben: Vorgabe[] = useMemo(
    () => (g && la && la.canBetOrRaise ? einsatzVorgaben(g, la) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tick, heroTurn],
  );

  if (numOpponents === null) {
    const wahl = einst.gegner;
    const tische: Array<{ n: 1 | 2 | 5; label: string }> = [
      { n: 1, label: L.headsUp },
      { n: 2, label: L.threeHanded },
      { n: 5, label: L.sixMax },
    ];
    return (
      <div className="tisch-setup">
        <Zurueck to="/lernen" />
        <div className="page-header">
          <h1>{L.title}</h1>
          <p className="sub">{L.intro}</p>
        </div>

        {bilanz && (
          <div className="card bilanz">
            <div className="section-title" style={{ marginTop: 0 }}>{L.bilanzTitel}</div>
            <p>{L.bilanzHaende(bilanz.haende)}</p>
            <p>
              {L.bilanzEntscheidungen(
                bilanz.urteile.gut + bilanz.urteile.vertretbar + bilanz.urteile.fehler,
                bilanz.urteile.gut,
                bilanz.urteile.vertretbar,
                bilanz.urteile.fehler,
              )}
            </p>
            {bilanz.urteile.fehler > 0 && <p className="small muted">{L.bilanzFehlerHinweis}</p>}
            <Link className="btn sm" to="/lernen/statistik">{L.bilanzStil}</Link>
          </div>
        )}

        <div className="card">
          <div className="section-title" style={{ marginTop: 0 }}>{L.chooseTable}</div>
          <div className="segmented tisch-wahl" role="radiogroup" aria-label={L.chooseTable}>
            {tische.map((t) => (
              <button
                key={t.n}
                type="button"
                role="radio"
                aria-checked={wahl === t.n}
                className={wahl === t.n ? 'on' : ''}
                onClick={() => aendere({ gegner: t.n })}
              >
                {t.label}
              </button>
            ))}
          </div>
          <p className="small faint" style={{ margin: '8px 0 0' }}>{L.opponents(wahl)}</p>
          <hr className="divider" />
          <Schalter
            an={coachAn}
            onChange={(v) => {
              if (!coachAllowed) { openPaywall(); return; }
              aendere({ coach: v });
            }}
            label={L.coachMode}
            beschreibung={L.coachModeDesc}
            zustand={{ an: L.switchOn, aus: L.switchOff }}
            marke={!coachAllowed ? <span className="pill gold" title={P.lockedTitle}>{P.proBadge}</span> : undefined}
          />
          {coachAn && (
            <Schalter
              an={einst.tippVorher}
              onChange={(v) => aendere({ tippVorher: v })}
              label={L.tippMode}
              beschreibung={L.tippModeDesc}
              zustand={{ an: L.switchOn, aus: L.switchOff }}
            />
          )}
          <p className="small faint" style={{ marginTop: 14 }}>
            {L.blindsInfo(bbText(SB), bbText(BB), bbText(START_STACK))}
          </p>
          {freeLeft && (
            <p className="small faint" style={{ marginTop: 6, marginBottom: 0 }}>{freeLeft}</p>
          )}
        </div>

        {data.hands.length > 0 && (
          <>
            <div className="section-title">{L.recentHands}</div>
            <HandHistoryList hands={data.hands} bbText={bbText} />
          </>
        )}

        <div className="entscheidung entscheidung-leiste" role="group" aria-label={L.tableTitle}>
          <div className="entscheidung-innen">
            <button type="button" className="btn primary lg" onClick={() => startSession(wahl)}>
              {L.startHand}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!g || !hero) return null;

  const pot = totalPot(g);
  const lastAward = g.handOver ? g.awards : null;
  const marken = aktionJeSitz(g);
  const zuletzt = letzteAktion(g);
  const vergleich = g.handOver ? showdownVergleich(g, lang, L.kickerWort) : null;
  const istBet = g.currentBet === 0;
  const heroGefoldet = hero.folded;
  const actor = g.players[g.toActIndex];
  const letzteEntscheidung = entscheidungen.current[entscheidungen.current.length - 1] ?? null;

  function heroAct(action: Action) {
    const gg = gameRef.current;
    if (!gg || gg.handOver || gg.toActIndex !== 0) return;
    /* Für die Spielstil-Analyse VOR dem Anwenden mitschreiben: Danach ist die
       Street womöglich schon weitergelaufen und `callAmount` neu berechnet.
       Der Showdown-Zustand kann hier nicht auftreten (dann wäre niemand am
       Zug), wird aber der Vollständigkeit halber auf 'river' abgebildet. */
    const street = gg.street === 'showdown' ? 'river' : gg.street;
    const facingBet = legalActions(gg).callAmount > 0;
    const bet = gg.currentBet === 0;
    const aktuellerRat = ratRef.current;
    try {
      applyAction(gg, action);
    } catch {
      return; // Ungültige Aktion: nichts anwenden, nichts mitschreiben
    }
    trackerRef.current?.onAction(street, action.type, facingBet);
    if (aktuellerRat) {
      const tat = zuTischAktion(action);
      entscheidungen.current.push({
        street,
        tat,
        istBet: bet,
        urteil: bewerteAktion(aktuellerRat, tat),
        rat: aktuellerRat,
      });
    }
    setRaiseTo(null);
    setTippOffen(false);
    rerender();
  }

  function oeffneEinsatz() {
    if (!la) return;
    setRaiseTo(standardEinsatz(vorgaben) ?? la.minRaiseTo);
  }

  /** Das Wort für eine Aktion: „Bet", wo noch nichts gesetzt wurde. */
  const aktionsWort = (a: TischAktion, bet = istBet) => (a === 'raise' ? (bet ? L.aktionWort.bet : L.aktionWort.raise) : L.aktionWort[a]);

  /** Die Marke am Sitz: was jemand in dieser Runde getan hat. */
  function markeText(a: LogAktion | undefined): string | null {
    if (!a) return null;
    if (a.allIn) return L.marke.allin;
    const n = a.betrag !== undefined ? bbText(a.betrag) : '';
    switch (a.art) {
      case 'check': return L.marke.check;
      case 'call': return L.marke.call(n);
      case 'bet': return L.marke.bet(n);
      case 'raise': return L.marke.raise(n);
      default: return null;
    }
  }

  /** Die Kurzzeile: was zuletzt passiert ist. */
  function satzText(): string {
    if (!zuletzt) return '';
    const p = g!.players.find((x) => x.id === zuletzt.playerId);
    if (!p) return '';
    const name = p.isHero ? L.duLabel : vorname(p.name);
    const n = zuletzt.aktion.betrag !== undefined ? bbText(zuletzt.aktion.betrag) : '';
    switch (zuletzt.aktion.art) {
      case 'fold': return L.satz.fold(name);
      case 'check': return L.satz.check(name);
      case 'call': return L.satz.call(name, n);
      case 'bet': return L.satz.bet(name, n);
      case 'raise': return L.satz.raise(name, n);
      default: return '';
    }
  }

  /** Der Tipp in einer Zeile. */
  function tippText(r: TischRat): string {
    const wort = aktionsWort(r.empfehlung);
    if (r.odds) {
      return L.tippZeile(wort, L.tippOdds(Math.round(r.odds.equity * 100), Math.round(r.odds.benoetigt * 100), r.odds.ok));
    }
    if (g!.street === 'preflop') return L.tippZeile(r.advice.headline);
    return L.tippZeile(wort, r.handName);
  }

  const tippSichtbar = !!rat && (einst.tippVorher || tippOffen);

  /** Der Coach-Knopf: vor dem Zug der Tipp auf Wunsch („Warum?", wenn er da ist),
   *  danach das Urteil über den letzten Zug. Hochkant sitzt er am Tisch neben den
   *  eigenen Karten, quer in der Leiste — dort ist Platz, am Tisch nicht. */
  function coachKnopf(wo: 'am-tisch' | 'in-leiste') {
    if (!coachAn) return null;
    if (heroTurn && rat) {
      return (
        <button
          type="button"
          className={`urteil tipp-knopf ${wo}`}
          onClick={() => (tippSichtbar ? setBlatt({ rat }) : setTippOffen(true))}
          aria-haspopup={tippSichtbar ? 'dialog' : undefined}
        >
          {tippSichtbar ? L.warum : L.tippZeigen}
        </button>
      );
    }
    if (!heroTurn && letzteEntscheidung) {
      const e = letzteEntscheidung;
      return (
        <button
          type="button"
          className={`urteil urteil-${e.urteil} ${wo}`}
          onClick={() => setBlatt({ rat: e.rat, entscheidung: e })}
          aria-haspopup="dialog"
          aria-label={L.urteilKurz(aktionsWort(e.tat, e.istBet), L.urteil[e.urteil])}
        >
          {e.urteil === 'gut' ? <Icon name="check" size={14} /> : e.urteil === 'fehler' ? <Icon name="x" size={14} /> : <span aria-hidden="true">≈</span>}
          {L.urteil[e.urteil]}
        </button>
      );
    }
    return null;
  }

  return (
    <div className="tisch-seite">
      {/* Kopf, Tisch und Leiste sind ein Bild: Es füllt mindestens den Bildschirm,
          damit die Leiste unten steht, auch wenn darunter Verlauf und Rückblick
          die Seite verlängern. */}
      <div className="tisch-bild">
      {/* Ein Kopf, eine Zeile: Der Tisch soll die Höhe bekommen, nicht die
          Überschrift (E-040). */}
      <div className="uebung-kopf">
        <span className="pill">{L.handPill(g.handNumber)}</span>
        <span className="pill gold">{L.streetLabel[g.street]}</span>
        <button className="btn sm ghost" onClick={verlassen}>
          {L.leaveTable}
        </button>
      </div>

      {/* ── Der Filz ──────────────────────────────────────────────────────
          Ein Ring statt drei Bänder (E-041). E-040 hat die Überdeckung
          beseitigt, indem es die Sitze untereinander legte — richtig, aber
          das Ergebnis sah aus wie eine Liste auf grünem Grund. Ein Tisch
          hat die Plätze *um* die Mitte herum.

          Der Ring ist ein Raster mit benannten Feldern. Zwei Rasterfelder
          können sich nicht überlappen: Die Zusage aus E-040 gilt
          unverändert, aber die Anordnung ist die eines Tisches. Welcher
          Platz wo sitzt, entscheidet `data-platz` (der Sitzindex) zusammen
          mit `data-gegner` — nicht eine Koordinate im Skript. */}
      <div className="filz" data-modus="dunkel" data-gegner={g.players.length - 1}>
        {g.players.map((p, i) => {
          if (p.isHero) return null;
          const marke = markeText(marken.get(p.id));
          const einsatzText = marke ?? (p.bet > 0 ? bbText(p.bet) : null);
          return (
            <div
              key={p.id}
              data-platz={i}
              className={`sitz${p.folded ? ' weg' : ''}${!g.handOver && g.toActIndex === i ? ' dran' : ''}`}
            >
              {/* Die Karten liegen auf dem Schild auf, wie am Tisch vor dem
                  Spieler — deshalb stehen sie im Baum davor. */}
              <div className={`sitz-karten${p.revealed ? ' offen' : ''}`}>
                {p.revealed ? (
                  <CardsRow cards={p.cards} size="md" />
                ) : p.folded ? (
                  <span className="sitz-weg">{L.foldedTag}</span>
                ) : (
                  <CardsRow cards={[undefined, undefined]} size="sm" />
                )}
              </div>
              {/* Das Namensschild: Name oben, Stapel und Lage darunter. Am
                  echten Tisch steht es vor dem Spieler und ist das, was man
                  aus zwei Metern noch lesen kann. */}
              <div className="sitz-schild">
                <span className="sitz-name">{vorname(p.name)}</span>
                <span className="sitz-fuss">
                  <span className="sitz-stapel" aria-label={L.stapelVon(p.name, bbText(p.stack))}>{bbText(p.stack)}</span>
                  <span className="sitz-lage">{positionOf(g, i)}</span>
                </span>
                {g.buttonIndex === i && (
                  <span className="dealer-btn" title={L.dealerLang} aria-label={L.dealerLang}>
                    {L.dealerKurz}
                  </span>
                )}
              </div>
              {einsatzText && (
                <span className="sitz-einsatz" aria-label={p.bet > 0 ? L.einsatzVon(bbText(p.bet)) : undefined}>
                  {p.bet > 0 && <span className="chip-dot" />}{einsatzText}
                </span>
              )}
            </div>
          );
        })}

        {/* Der Topf liegt in der Mitte, hinter der Einsatzlinie. */}
        <div className="filz-topf">
          <span className="topf">
            {/* Ein Stapel, keine Marke: Ein Topf ist Geld, das jemand
                gewinnt, und Geld liegt am Tisch gestapelt. */}
            <span className="chip-stapel" aria-hidden="true"><i /><i /><i /></span>
            {L.potBB(bbText(pot > 0 ? pot : g.handOver ? g.awards.reduce((s2, a2) => s2 + a2.amount, 0) : 0))}
          </span>
        </div>

        {/* Fünf Plätze, immer. Die noch nicht ausgeteilten stehen als leere
            Umrisse da — an einem echten Tisch sieht man auch, wie viele
            Karten noch kommen. */}
        <div className="filz-board">
          <div className="board" aria-label={L.boardOffen}>
            {[0, 1, 2, 3, 4].map((i) => (
              g.board[i] !== undefined
                ? <PlayingCard key={i} card={g.board[i]} size="md" />
                : <span key={i} className="board-platz" aria-hidden="true" />
            ))}
          </div>
        </div>

        {/* Eine Zeile, die immer dasteht und ihren Inhalt tauscht: erst was
            zuletzt passiert ist, dann wer gewonnen hat. Sie bleibt im Baum,
            weil ein `aria-live`-Bereich, der neu entsteht, nichts vorliest. */}
        <div className="filz-lage" aria-live="polite">
          {g.handOver && lastAward ? (
            <div className="filz-ergebnis">
              {vergleich?.geteilt ? (
                <div className="gewonnen">
                  {L.geteiltLine(bbText(lastAward.reduce((n, a) => n + a.amount, 0)), vergleich.sieger.text)}
                </div>
              ) : lastAward.map((a, i) => {
                const p2 = g.players.find((pl) => pl.id === a.playerId)!;
                const text = vergleich && !vergleich.geteilt && vergleich.sieger.name === p2.name
                  ? vergleich.sieger.text
                  : a.handName;
                return (
                  <div key={i} className={p2.isHero ? 'gewonnen' : ''}>
                    {L.winnerLine(p2.isHero, vorname(p2.name), bbText(a.amount), text)}
                  </div>
                );
              })}
              {vergleich?.gegner && (
                <div className="vergleich">
                  {L.verglichen(vergleich.gegner.isHero ? L.duLabel : vorname(vergleich.gegner.name), vergleich.gegner.text)}
                </div>
              )}
            </div>
          ) : (
            satzText() && <span className="filz-zug">{satzText()}</span>
          )}
        </div>

        {/* Der eigene Platz, unten in der Mitte — mit den größten Karten des
            Tisches (Regel 10.8) und demselben Schild wie die anderen. */}
        <div className={`filz-du${heroTurn ? ' dran' : ''}`}>
          {(hero.bet > 0 || marken.get(0)) && (
            <span className="sitz-einsatz">
              {hero.bet > 0 && <span className="chip-dot" />}{markeText(marken.get(0)) ?? bbText(hero.bet)}
            </span>
          )}
          <div className="du-karten">
            <CardsRow cards={hero.cards} size="xl" />
          </div>
          <div className="sitz-schild">
            <span className="sitz-name">{L.duLabel}</span>
            <span className="sitz-fuss">
              <span className="sitz-stapel" aria-label={L.stapelVon(L.duLabel, bbText(hero.stack))}>{bbText(hero.stack)}</span>
              <span className="sitz-lage">{positionOf(g, 0)}</span>
            </span>
            {g.buttonIndex === 0 && (
              <span className="dealer-btn" title={L.dealerLang} aria-label={L.dealerLang}>
                {L.dealerKurz}
              </span>
            )}
          </div>
          {coachKnopf('am-tisch')}
        </div>
      </div>

      {/* ── Die Entscheidung: unten, im Daumenbereich (E-039/E-040) ────
          Die Leiste bleibt zwischen den Zügen stehen, mit gesperrten Knöpfen:
          Wer dran ist, steht in der Zeile darüber. Sie trägt auch den Tipp,
          die Einsatzwahl und den Weg zur nächsten Hand — ein Ort für alles,
          was der Daumen braucht. */}
      <div className="entscheidung entscheidung-leiste tisch-leiste" role="group" aria-label={L.tableTitle}>
        <div className="entscheidung-innen stapel">
          <div className="tisch-status" aria-live="polite">
            {heroTurn && coachAn && rat && tippSichtbar ? (
              <span className="tipp-zeile">{tippText(rat)}</span>
            ) : heroTurn ? (
              <span>{L.amZug}</span>
            ) : g.handOver ? null : heroGefoldet ? (
              <span>{L.duFolded}</span>
            ) : (
              <span>{L.ueberlegt(actor ? vorname(actor.name) : '')}</span>
            )}
          </div>

          <div className="coach-zeile">{coachKnopf('in-leiste')}</div>

          {g.handOver ? (
            <button type="button" className="btn primary lg" onClick={() => startHand()}>{L.nextHand}</button>
          ) : heroGefoldet ? (
            <button type="button" className="btn primary lg" onClick={handZuEnde}>{L.playOut}</button>
          ) : heroTurn && la && raiseTo !== null ? (
            <>
              <div className="vorgaben" role="group" aria-label={L.vorgabeGruppe}>
                {vorgaben.map((v) => {
                  const kopf = v.art.art === 'min' ? L.vorgabeMin
                    : v.art.art === 'pot' ? L.vorgabePot(v.art.teil)
                    : v.art.art === 'mal' ? L.vorgabeMal(v.art.faktor)
                    : v.art.art === 'allin' ? L.vorgabeAllIn
                    : null;
                  return (
                    <button
                      key={`${v.art.art}-${v.to}`}
                      type="button"
                      className={`btn vorgabe${raiseTo === v.to ? ' on' : ''}`}
                      aria-pressed={raiseTo === v.to}
                      onClick={() => setRaiseTo(v.to)}
                    >
                      {kopf && <span className="vorgabe-kopf">{kopf}</span>}
                      <span className="vorgabe-wert">{bbText(v.to)}</span>
                    </button>
                  );
                })}
              </div>
              <div className="betrag-zeile">
                <button type="button" className="btn ghost betrag-knopf" onClick={() => setRaiseTo(null)} aria-label={L.betragZurueck}>
                  ‹
                </button>
                <button
                  type="button"
                  className="btn betrag-knopf"
                  onClick={() => setRaiseTo(einsatzSchritt(raiseTo, -1, la, BB))}
                  disabled={raiseTo <= la.minRaiseTo}
                  aria-label={L.betragWeniger}
                >
                  −
                </button>
                <button
                  ref={bestaetigenRef}
                  type="button"
                  className="btn primary lg betrag-bestaetigen"
                  onClick={() => heroAct({ type: 'raise', to: raiseTo })}
                >
                  {L.raiseAuf(istBet, bbText(raiseTo))}
                </button>
                <button
                  type="button"
                  className="btn betrag-knopf"
                  onClick={() => setRaiseTo(einsatzSchritt(raiseTo, 1, la, BB))}
                  disabled={raiseTo >= la.maxRaiseTo}
                  aria-label={L.betragMehr}
                >
                  +
                </button>
              </div>
            </>
          ) : (
            <div className="aktions-zeile">
              <button
                type="button"
                className="btn lg"
                disabled={!heroTurn || !la?.canFold}
                onClick={() => heroAct({ type: 'fold' })}
              >
                {L.fold}
              </button>
              {la?.canCheck || !heroTurn ? (
                <button
                  ref={mitteKnopfRef}
                  type="button"
                  className="btn lg"
                  disabled={!heroTurn}
                  onClick={() => heroAct({ type: 'check' })}
                >
                  {L.check}
                </button>
              ) : (
                <button ref={mitteKnopfRef} type="button" className="btn lg" onClick={() => heroAct({ type: 'call' })}>
                  {L.call(bbText(la?.callAmount ?? 0))}
                </button>
              )}
              <button
                ref={raiseKnopfRef}
                type="button"
                className="btn primary lg"
                disabled={!heroTurn || !la?.canBetOrRaise}
                onClick={oeffneEinsatz}
              >
                {L.raiseOeffnen(istBet ? L.bet : L.raise)}
              </button>
            </div>
          )}
        </div>
      </div>

      </div>

      {/* Nach der Hand: was der Coach zu den Entscheidungen sagt — als Liste,
          kein Replayer (E-010). */}
      {g.handOver && coachAn && entscheidungen.current.length > 0 && (
        <div className="card rueckblick">
          <div className="section-title" style={{ marginTop: 0 }}>{L.rueckblickTitel}</div>
          <ul className="list-plain">
            {entscheidungen.current.map((e, i) => (
              <li key={i} className="rueckblick-zeile">
                <span>{L.rueckblickZeile(L.streetLabel[e.street], aktionsWort(e.tat, e.istBet))}</span>
                <button
                  type="button"
                  className={`urteil urteil-${e.urteil}`}
                  onClick={() => setBlatt({ rat: e.rat, entscheidung: e })}
                  aria-haspopup="dialog"
                >
                  {L.urteil[e.urteil]}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {g.handOver && freeLeft && (
        <p className="small faint" style={{ marginBottom: 14 }}>{freeLeft}</p>
      )}

      {/* Verlauf */}
      <div className="section-title">{L.historyTitle}</div>
      <div className="card game-log">
        {g.log.map((entry, i) => {
          const isStreet = entry.playerId === undefined;
          return (
            <div key={i} className={isStreet ? 'street-mark' : ''}>
              {L.fixLogGrammar(entry.text)}
            </div>
          );
        })}
      </div>

      {data.hands.length > 0 && g.handOver && (
        <>
          <div className="section-title">{L.recentHands}</div>
          <HandHistoryList hands={data.hands} bbText={bbText} />
        </>
      )}

      {blatt && (
        <Blatt
          kopf={L.coachPill}
          titel={blatt.entscheidung
            ? L.warumDeine(aktionsWort(blatt.entscheidung.tat, blatt.entscheidung.istBet), L.urteil[blatt.entscheidung.urteil])
            : L.warumRat(aktionsWort(blatt.rat.empfehlung))}
          schliessenLabel={L.schliessen}
          onClose={() => setBlatt(null)}
        >
          {blatt.entscheidung && <p><strong>{L.warumRat(aktionsWort(blatt.rat.empfehlung, blatt.entscheidung.istBet))}</strong></p>}
          <p><MitBegriffen text={blatt.rat.advice.headline} /></p>
          <ul>
            {blatt.rat.advice.reasons.map((r, i) => <li key={i}><MitBegriffen text={r} /></li>)}
          </ul>
          {blatt.rat.odds && (
            <p>{L.warumOdds(Math.round(blatt.rat.odds.equity * 100), Math.round(blatt.rat.odds.benoetigt * 100))}</p>
          )}
          <p className="herkunft-leise">{L.warumPlatz(blatt.rat.position)}</p>
          <p className="herkunft-leise">{L.warumSchaetzung}</p>
        </Blatt>
      )}
    </div>
  );
}

const RESULT_CLS: Record<'won' | 'lost' | 'folded', string> = {
  won: 'ok',
  lost: 'danger',
  folded: '',
};

function HandHistoryList({ hands, bbText }: { hands: Array<import('../state/AppState').HandRecord>; bbText: (chips: number) => string }) {
  const { lang } = useLang();
  const L = STR[lang];
  const [openId, setOpenId] = useState<string | null>(null);
  const [alle, setAlle] = useState(false);
  const sichtbar = alle ? hands : hands.slice(0, 10);
  return (
    <div className="grid">
      {sichtbar.map((h) => {
        const time = new Date(h.date).toLocaleTimeString(L.timeLocale, { hour: '2-digit', minute: '2-digit' });
        const open = openId === h.id;
        return (
          <div key={h.id} className="card" style={{ padding: 14 }}>
            {/* Ein Knopf, kein anklickbares <div>: Tastatur und Bildschirmleser
                erreichen die Zeile nur so. */}
            <button
              type="button"
              className="hand-zeile"
              aria-expanded={open}
              aria-label={L.handAuf}
              onClick={() => setOpenId(open ? null : h.id)}
            >
              <span className="row wrap">
                <CardsRow cards={h.heroCards} size="sm" />
                {h.board.length > 0 && (
                  <>
                    <span className="faint">|</span>
                    <CardsRow cards={h.board} size="sm" />
                  </>
                )}
              </span>
              <span className="row">
                <span className={`pill ${RESULT_CLS[h.result]}`}>{L.resultLabel[h.result]}</span>
                <span style={{ fontWeight: 800, color: h.amount >= 0 ? 'var(--ok)' : 'var(--danger)', fontVariantNumeric: 'tabular-nums' }}>
                  {h.amount >= 0 ? '+' : ''}{bbText(h.amount)}
                </span>
                <span className="small faint">{time}</span>
                <span className="faint" aria-hidden="true">{open ? '▾' : '▸'}</span>
              </span>
            </button>
            {open && (
              <div className="game-log" style={{ marginTop: 12, maxHeight: 260 }}>
                {h.log.map((line, i) => (
                  <div key={i}>{L.fixLogGrammar(line)}</div>
                ))}
              </div>
            )}
          </div>
        );
      })}
      {hands.length > 10 && (
        <button type="button" className="btn sm ghost" onClick={() => setAlle(!alle)}>
          {alle ? L.weniger : L.alleAnzeigen(hands.length)}
        </button>
      )}
    </div>
  );
}
