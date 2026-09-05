import { useEffect, useMemo, useRef, useState } from 'react';
import { STR as NAV } from '../i18n/pages/layout';
import { BackLink } from '../components/ui';
import { Entscheidung } from '../components/Entscheidung';
import { createHandTracker, type HandTracker } from '../lib/poker/stats';
import { CardsRow, PlayingCard } from '../components/PlayingCard';
import { IconTile } from '../components/Icon';
import { BOT_PROFILES, decideBotAction, positionOf, type BotStyle } from '../lib/poker/ai';
import { categoryNameIn, evaluateBest } from '../lib/poker/evaluator';
import { equityVsRandomHands } from '../lib/poker/equity';
import {
  applyAction,
  createHand,
  legalActions,
  setEngineLanguage,
  totalPot,
  type GameState,
} from '../lib/poker/engine';
import { useAppState } from '../state/AppState';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/play';
import { STR as PRO } from '../i18n/pages/pro';
import { usePro } from '../lib/pro/ProProvider';

const START_STACK = 200; // 100bb bei Blinds 1/2
const SB = 1;
const BB = 2;

/** Spielstile der KI-Sitze; die Anzeigenamen liegen sprachabhängig im Wörterbuch (STR[lang].botNames). */
const BOT_STYLES: BotStyle[] = ['tight', 'aggro', 'loose', 'standard', 'tight'];

export function PlayPage() {
  const { data, recordHand, addHandRecord } = useAppState();
  const { lang } = useLang();
  const L = STR[lang];
  const P = PRO[lang];
  const { access, can, consume, openPaywall } = usePro();
  const [numOpponents, setNumOpponents] = useState<number | null>(null);
  const [coachMode, setCoachMode] = useState(true);
  const gameRef = useRef<GameState | null>(null);
  const [, setTick] = useState(0);
  const rerender = () => setTick((t) => t + 1);
  const botTimer = useRef<number | null>(null);
  const stacksRef = useRef<number[]>([]);
  const buttonRef = useRef(0);
  const handCounter = useRef(0);
  const handRecorded = useRef(false);
  const trackerRef = useRef<HandTracker | null>(null);
  const sawFlopRef = useRef(false);
  const [showRaisePanel, setShowRaisePanel] = useState(false);

  /* Coach-Overlay ist eine Pro-Funktion, der Tisch selbst ist gratis mit
     Tageslimit. Ohne Monetarisierung sind can()/access() immer offen. */
  const coachAllowed = can('play-coach');
  const coachOn = coachMode && coachAllowed;
  const playAccess = access('play-hands');
  const freeLeft =
    playAccess.state === 'allowed' && playAccess.remaining !== undefined && playAccess.limit !== undefined
      ? P.remaining(playAccess.remaining, playAccess.limit)
      : null;

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
    stacksRef.current = new Array(opponents + 1).fill(START_STACK);
    buttonRef.current = 0;
    handCounter.current = 0;
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
    setShowRaisePanel(false);
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
      const idx = gg.toActIndex;
      const bot = gg.players[idx];
      if (!bot || bot.isHero) return;
      const profile = BOT_PROFILES[BOT_STYLES[bot.id - 1]];
      try {
        applyAction(gg, decideBotAction(gg, idx, profile));
      } catch {
        // Fallback: sichere Aktion
        const la = legalActions(gg);
        applyAction(gg, la.canCheck ? { type: 'check' } : { type: 'fold' });
      }
      rerender();
    }, 550 + Math.random() * 700);
    return () => {
      if (botTimer.current) window.clearTimeout(botTimer.current);
    };
  });

  const g = gameRef.current;

  // Coach-Infos für den Hero
  const hero = g?.players[0];
  const heroTurn = !!g && !g.handOver && g.toActIndex === 0;
  const la = heroTurn && g ? legalActions(g) : null;

  const coachInfo = useMemo(() => {
    if (!g || !hero || hero.folded || !coachOn || !heroTurn) return null;
    const opponents = g.players.filter((p) => !p.folded && !p.isHero).length;
    const equity = equityVsRandomHands(hero.cards, g.board, opponents, 500);
    const pot = totalPot(g);
    const call = la?.callAmount ?? 0;
    const required = call > 0 ? call / (pot + call) : 0;
    const handName =
      g.board.length >= 3 ? categoryNameIn(evaluateBest([...hero.cards, ...g.board]), lang) : null;
    return { equity, required, call, handName, opponents };
  }, [g, hero, coachOn, heroTurn, la?.callAmount, lang]);

  if (numOpponents === null) {
    return (
      <div>
        <BackLink to="/lernen" label={NAV[lang].navLearn} />
      <div className="page-header">
          <div className="eyebrow">{L.eyebrow}</div>
          <h1>{L.title}</h1>
          <p className="sub">{L.intro}</p>
        </div>

        <div className="card" style={{ maxWidth: 640 }}>
          <div className="section-title" style={{ marginTop: 0 }}>{L.chooseTable}</div>
          <div className="grid cols-3">
            <button
              className="card clickable"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
              onClick={() => startSession(1)}
            >
              <IconTile name="profile" tone="gold" size={38} />
              <div style={{ fontWeight: 800 }}>{L.headsUp}</div>
              <div className="small faint">{L.opponents(1)}</div>
            </button>
            <button
              className="card clickable"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
              onClick={() => startSession(2)}
            >
              <IconTile name="play" tone="green" size={38} />
              <div style={{ fontWeight: 800 }}>{L.threeHanded}</div>
              <div className="small faint">{L.opponents(2)}</div>
            </button>
            <button
              className="card clickable"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
              onClick={() => startSession(5)}
            >
              <IconTile name="chip" tone="red" size={38} />
              <div style={{ fontWeight: 800 }}>{L.sixMax}</div>
              <div className="small faint">{L.opponents(5)}</div>
            </button>
          </div>
          {freeLeft && (
            <p className="small faint" style={{ marginTop: 12, marginBottom: 0 }}>
              {freeLeft}
            </p>
          )}
          <hr className="divider" />
          <label className="row" style={{ cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={coachOn}
              onChange={(e) => {
                if (!coachAllowed) {
                  openPaywall();
                  return;
                }
                setCoachMode(e.target.checked);
              }}
              /* Größe kommt aus global.css, nicht von hier: 18 Pixel sind
                 keine Bedienfläche (E-039). */
            />
            <div>
              <div className="row" style={{ fontWeight: 700 }}>
                {L.coachMode}
                {!coachAllowed && (
                  <span className="pill gold" title={P.lockedTitle}>{P.proBadge}</span>
                )}
              </div>
              <div className="small muted">{L.coachModeDesc}</div>
            </div>
          </label>
          <p className="small faint" style={{ marginTop: 14 }}>
            {L.blindsInfo(SB, BB, START_STACK, START_STACK / BB)}
          </p>
        </div>

        {data.hands.length > 0 && (
          <>
            <div className="section-title">{L.recentHands}</div>
            <HandHistoryList hands={data.hands} />
          </>
        )}
      </div>
    );
  }

  if (!g) return null;

  const pot = totalPot(g);
  const lastAward = g.handOver ? g.awards : null;

  function heroAct(action: Parameters<typeof applyAction>[1]) {
    const gg = gameRef.current;
    if (!gg || gg.handOver || gg.toActIndex !== 0) return;
    /* Für die Spielstil-Analyse VOR dem Anwenden mitschreiben: Danach ist die
       Street womöglich schon weitergelaufen und `callAmount` neu berechnet.
       Der Showdown-Zustand kann hier nicht auftreten (dann wäre niemand am
       Zug), wird aber der Vollständigkeit halber auf 'river' abgebildet. */
    const street = gg.street === 'showdown' ? 'river' : gg.street;
    const facingBet = legalActions(gg).callAmount > 0;
    try {
      applyAction(gg, action);
    } catch {
      return; // Ungültige Aktion: nichts anwenden, nichts mitschreiben
    }
    trackerRef.current?.onAction(street, action.type, facingBet);
    setShowRaisePanel(false);
    rerender();
  }

  function raiseTo(fraction: number | 'min' | 'allin') {
    if (!la || !g) return;
    let to: number;
    if (fraction === 'min') to = la.minRaiseTo;
    else if (fraction === 'allin') to = la.maxRaiseTo;
    else {
      const potAfterCall = pot + la.callAmount;
      to = Math.round(g.currentBet + la.callAmount === 0
        ? Math.max(la.minRaiseTo, fraction * pot)
        : g.currentBet + fraction * potAfterCall);
    }
    to = Math.max(la.minRaiseTo, Math.min(la.maxRaiseTo, to));
    heroAct({ type: 'raise', to });
  }

  return (
    <div>
      {/* Ein Kopf, eine Zeile: Der Tisch soll die Höhe bekommen, nicht die
          Überschrift (E-040). */}
      <div className="tisch-kopf">
        <span className="pill">{L.handPill(g.handNumber)}</span>
        <span className="pill gold">{L.streetLabel[g.street]}</span>
        <button className="btn sm ghost" onClick={() => { setNumOpponents(null); gameRef.current = null; }}>
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
        {g.players.map((p, i) => (p.isHero ? null : (
          <div
            key={p.id}
            data-platz={i}
            className={`sitz${p.folded ? ' weg' : ''}${!g.handOver && g.toActIndex === i ? ' dran' : ''}`}
          >
            {/* Die Karten liegen auf dem Schild auf, wie am Tisch vor dem
                Spieler — deshalb stehen sie im Baum davor. */}
            <div className="sitz-karten">
              {p.revealed ? (
                <CardsRow cards={p.cards} size="sm" />
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
              <span className="sitz-name">{p.name}</span>
              <span className="sitz-fuss">
                <span className="sitz-stapel" aria-label={L.stapelVon(p.name, p.stack)}>{p.stack}</span>
                <span className="sitz-lage">{positionOf(g, i)}</span>
              </span>
              {g.buttonIndex === i && (
                <span className="dealer-btn" title={L.dealerLang} aria-label={L.dealerLang}>
                  {L.dealerKurz}
                </span>
              )}
            </div>
            {p.bet > 0 && (
              <span className="sitz-einsatz" aria-label={L.einsatzVon(p.bet)}>
                <span className="chip-dot" />{p.bet}
              </span>
            )}
          </div>
        )))}

        {/* Der Topf liegt in der Mitte, hinter der Einsatzlinie. */}
        <div className="filz-topf">
          <span className="topf">
            {/* Ein Stapel, keine Marke: Ein Topf ist Geld, das jemand
                gewinnt, und Geld liegt am Tisch gestapelt. */}
            <span className="chip-stapel" aria-hidden="true"><i /><i /><i /></span>
            {L.potLabel} {pot > 0 ? pot : g.handOver ? g.awards.reduce((s2, a2) => s2 + a2.amount, 0) : 0}
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

        {/* Eine Zeile, die immer dasteht und ihren Inhalt tauscht: erst wer
            dran ist, dann wer gewonnen hat. Sie bleibt im Baum, weil ein
            `aria-live`-Bereich, der neu entsteht, nichts vorliest. */}
        <div className="filz-lage" aria-live="polite">
          {g.handOver && lastAward ? (
            <div className="filz-ergebnis">
              {lastAward.map((a, i) => {
                const p2 = g.players.find((pl) => pl.id === a.playerId)!;
                return (
                  <div key={i} className={p2.isHero ? 'gewonnen' : ''}>
                    {L.winnerLine(p2.isHero, p2.name, a.amount, a.handName)}
                  </div>
                );
              })}
            </div>
          ) : !g.handOver ? (
            <span className="filz-zug">
              {heroTurn ? L.amZug : L.wartetAuf(g.players[g.toActIndex]?.name ?? '')}
            </span>
          ) : null}
        </div>

        {/* Der eigene Platz, unten in der Mitte — mit den größten Karten des
            Tisches (Regel 10.8) und demselben Schild wie die anderen. */}
        <div className={`filz-du${heroTurn ? ' dran' : ''}`}>
          {g.players[0].bet > 0 && (
            <span className="sitz-einsatz" aria-label={L.einsatzVon(g.players[0].bet)}>
              <span className="chip-dot" />{g.players[0].bet}
            </span>
          )}
          <div className="du-karten">
            <CardsRow cards={g.players[0].cards} size="xl" />
          </div>
          <div className="sitz-schild">
            <span className="sitz-name">{L.duLabel}</span>
            <span className="sitz-fuss">
              <span className="sitz-stapel">{L.chipsAmount(g.players[0].stack)}</span>
              <span className="sitz-lage">{positionOf(g, 0)}</span>
            </span>
            {g.buttonIndex === 0 && (
              <span className="dealer-btn" title={L.dealerLang} aria-label={L.dealerLang}>
                {L.dealerKurz}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Die Gewinnerzeile steht in der Tischmitte (siehe oben). Hier bleibt
          nur der Hinweis auf die freien Hände. */}
      {g.handOver && freeLeft && (
        <p className="small faint" style={{ marginBottom: 14 }}>{freeLeft}</p>
      )}

      {/* Coach-Panel */}
      {coachOn && coachInfo && heroTurn && (
        <div className="card" style={{ marginBottom: 14, background: 'var(--bg-elev)' }}>
          <div className="row wrap">
            <span className="pill gold">{L.coachPill}</span>
            <span className="pill">{L.coachEquity(coachInfo.opponents, Math.round(coachInfo.equity * 100))}</span>
            {coachInfo.call > 0 && (
              <span className="pill info">
                {L.coachPotOdds(coachInfo.call, pot + coachInfo.call, Math.round(coachInfo.required * 100))}
              </span>
            )}
            {coachInfo.handName && <span className="pill ok">{L.coachCurrent(coachInfo.handName)}</span>}
          </div>
          {coachInfo.call > 0 && (
            <p className="small muted" style={{ marginTop: 8 }}>
              {coachInfo.equity > coachInfo.required + 0.05
                ? L.adviceCall
                : coachInfo.equity < coachInfo.required - 0.05
                  ? L.adviceFold
                  : L.adviceClose}
              {' '}{L.adviceNote}
            </p>
          )}
        </div>
      )}

      {/* ── Die Entscheidung: unten, im Daumenbereich (E-039/E-040) ────
          Vorher lagen die Knöpfe in einer Karte mitten im Textfluss, und
          bei offenem Erhöhen-Feld noch weiter unten. Jetzt an derselben
          Stelle wie in jedem Trainer. */}
      {heroTurn && la && (
        <>
          {showRaisePanel && la.canBetOrRaise && (
            <div className="erhoehen">
              <button className="btn sm" onClick={() => raiseTo('min')}>{L.minRaise(la.minRaiseTo)}</button>
              <button className="btn sm" onClick={() => raiseTo(0.5)}>{L.halfPot}</button>
              <button className="btn sm" onClick={() => raiseTo(0.75)}>{L.threeQuarterPot}</button>
              <button className="btn sm" onClick={() => raiseTo(1)}>{L.fullPot}</button>
              <button className="btn sm danger" onClick={() => raiseTo('allin')}>{L.allIn(la.maxRaiseTo)}</button>
            </div>
          )}
          <Entscheidung label={L.tableTitle}>
            {la.canFold && (
              <button className="btn danger lg" onClick={() => heroAct({ type: 'fold' })}>
                {L.fold}
              </button>
            )}
            {la.canCheck ? (
              <button className="btn lg" onClick={() => heroAct({ type: 'check' })}>
                {L.check}
              </button>
            ) : (
              <button className="btn lg" onClick={() => heroAct({ type: 'call' })}>
                {L.call(la.callAmount)}
              </button>
            )}
            {la.canBetOrRaise && (
              <button className="btn primary lg" onClick={() => setShowRaisePanel((s2) => !s2)}>
                {g.currentBet === 0 ? L.bet : L.raise} …
              </button>
            )}
          </Entscheidung>
        </>
      )}

      {/* Nach der Hand führt genau ein Knopf weiter — an derselben Stelle. */}
      {g.handOver && (
        <Entscheidung label={L.tableTitle}>
          <button className="btn primary lg" onClick={() => startHand()}>{L.nextHand}</button>
        </Entscheidung>
      )}

      {!heroTurn && !g.handOver && (
        <div className="card small muted">{L.thinking(g.players[g.toActIndex]?.name ?? '')}</div>
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
          <HandHistoryList hands={data.hands.slice(0, 10)} />
        </>
      )}
    </div>
  );
}

const RESULT_CLS: Record<'won' | 'lost' | 'folded', string> = {
  won: 'ok',
  lost: 'danger',
  folded: '',
};

function HandHistoryList({ hands }: { hands: Array<import('../state/AppState').HandRecord> }) {
  const { lang } = useLang();
  const L = STR[lang];
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <div className="grid" style={{ maxWidth: 720 }}>
      {hands.map((h) => {
        const time = new Date(h.date).toLocaleTimeString(L.timeLocale, { hour: '2-digit', minute: '2-digit' });
        const open = openId === h.id;
        return (
          <div key={h.id} className="card" style={{ padding: 14 }}>
            <div
              className="row between wrap"
              style={{ cursor: 'pointer' }}
              onClick={() => setOpenId(open ? null : h.id)}
            >
              <div className="row wrap">
                <CardsRow cards={h.heroCards} size="sm" />
                {h.board.length > 0 && (
                  <>
                    <span className="faint">|</span>
                    <CardsRow cards={h.board} size="sm" />
                  </>
                )}
              </div>
              <div className="row">
                <span className={`pill ${RESULT_CLS[h.result]}`}>{L.resultLabel[h.result]}</span>
                <span style={{ fontWeight: 800, color: h.amount >= 0 ? 'var(--ok)' : 'var(--danger)', fontVariantNumeric: 'tabular-nums' }}>
                  {h.amount >= 0 ? '+' : ''}{h.amount}
                </span>
                <span className="small faint">{time}</span>
                <span className="faint">{open ? '▾' : '▸'}</span>
              </div>
            </div>
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
    </div>
  );
}
