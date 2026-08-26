/* Online-Tisch: ein Tisch, viele Handys.

   Aufgabenteilung:
     • src/lib/table/protocol.ts – ALLE Entscheidungen (Regeln, Sitze, Zug,
       Anwesenheit, Host-Nachfolge). Rein und getestet.
     • src/lib/table/online.ts   – nur Firestore lesen/schreiben.
     • diese Datei              – Bildschirm, Eingaben und die Host-Schleife,
       die beides verbindet.

   Der Host gibt die Karten: Sein Gerät hält den vollständigen Spielzustand
   (inklusive Deck) und veröffentlicht nur den kartenfreien Teil. Die Hole-Cards
   gehen einzeln in tables/{code}/private/{uid} – lesbar nur für den Besitzer.
   Das Vertrauensmodell steht ehrlich im Hinweis am Seitenende und ausführlich
   im Kopf von protocol.ts. */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CardsRow, PlayingCard } from '../../components/PlayingCard';
import { Icon } from '../../components/Icon';
import { QrSvg } from '../../components/ShareCard';
import { useCloud } from '../../lib/cloud/CloudProvider';
import { useLang } from '../../i18n';
import { STR } from '../../i18n/pages/onlinetable';
import { applyAction, setEngineLanguage, type Action, type GameState } from '../../lib/poker/engine';
import { categoryNameIn, evaluateBest } from '../../lib/poker/evaluator';
import {
  DEFAULT_CONFIG,
  HEARTBEAT_MS,
  MAX_SEATS,
  canPlayerAct,
  autoActionFor,
  canStartHand,
  checkPending,
  isActionLegal,
  isValidRoomCode,
  joinUrl,
  legalActionsFor,
  moveSeat,
  normalizeRoomCode,
  onlineFrom,
  potOf,
  privateCardsFor,
  reconcileSeats,
  sanitizeConfig,
  settleStacks,
  shouldClaimHost,
  startHandFor,
  toPublicState,
  withOwnCards,
  type MemberDoc,
  type PrivateCardsDoc,
  type PublicPlayer,
  type PublicState,
  type RoomConfig,
  type RoomDoc,
} from '../../lib/table/protocol';
import {
  clearAction,
  createRoom,
  heartbeat,
  isOnlineAvailable,
  joinRoom,
  leaveRoom,
  pushPrivateCards,
  pushState,
  sendAction,
  setReady,
  watchPrivateCards,
  watchRoom,
  type OnlineError,
  type RoomPatch,
  type RoomView,
} from '../../lib/table/online';

/* ==========================================================================
   Kleine lokale Speicher-Helfer
   ========================================================================== */

const LAST_ROOM_KEY = 'pokermentor-online-room-v1';
const HOST_GAME_KEY = 'pokermentor-online-host-v1';

/** Der vollständige Handzustand des Hosts (mit Deck!) bleibt auf seinem Gerät.
    Gespeichert wird er nur, damit ein Neuladen die laufende Hand nicht killt. */
interface HostGame {
  game: GameState;
  uids: string[];
  handNumber: number;
  /** Wie viele Aktionen sind lokal schon angewandt? Muss zu room.seq passen. */
  seq: number;
}

function saveHostGame(code: string, hg: HostGame): void {
  try {
    localStorage.setItem(`${HOST_GAME_KEY}:${code}`, JSON.stringify(hg));
  } catch {
    // Speicher voll oder gesperrt: dann eben kein Wiederanknüpfen nach Neuladen.
  }
}

function loadHostGame(code: string): HostGame | null {
  try {
    const raw = localStorage.getItem(`${HOST_GAME_KEY}:${code}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as HostGame;
    if (!parsed?.game?.players || !Array.isArray(parsed.uids)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function clearHostGame(code: string): void {
  try {
    localStorage.removeItem(`${HOST_GAME_KEY}:${code}`);
  } catch {
    // egal
  }
}

function rememberRoom(code: string): void {
  try {
    if (code) localStorage.setItem(LAST_ROOM_KEY, code);
    else localStorage.removeItem(LAST_ROOM_KEY);
  } catch {
    // egal
  }
}

function lastRoom(): string {
  try {
    return normalizeRoomCode(localStorage.getItem(LAST_ROOM_KEY) ?? '');
  } catch {
    return '';
  }
}

/* ==========================================================================
   Tischgrafik
   ========================================================================== */

/** Sitzpositionen (Prozent). Index 0 ist immer der eigene Platz (unten). */
const LAYOUTS: Record<number, Array<{ x: number; y: number }>> = {
  2: [
    { x: 50, y: 84 },
    { x: 50, y: 6 },
  ],
  3: [
    { x: 50, y: 84 },
    { x: 10, y: 22 },
    { x: 90, y: 22 },
  ],
  4: [
    { x: 50, y: 84 },
    { x: 7, y: 46 },
    { x: 50, y: 4 },
    { x: 93, y: 46 },
  ],
  5: [
    { x: 50, y: 84 },
    { x: 6, y: 56 },
    { x: 20, y: 8 },
    { x: 80, y: 8 },
    { x: 94, y: 56 },
  ],
  6: [
    { x: 50, y: 86 },
    { x: 7, y: 60 },
    { x: 12, y: 10 },
    { x: 50, y: 2 },
    { x: 88, y: 10 },
    { x: 93, y: 60 },
  ],
};

/** Spielerliste so drehen, dass man selbst unten sitzt. */
function rotateToMe(players: PublicPlayer[], myIndex: number): PublicPlayer[] {
  if (myIndex < 0) return players;
  return [...players.slice(myIndex), ...players.slice(0, myIndex)];
}

function sameSeats(a: RoomDoc['seats'], b: RoomDoc['seats']): boolean {
  if (a.length !== b.length) return false;
  return a.every((s, i) => s.uid === b[i].uid && s.name === b[i].name && s.stack === b[i].stack);
}

/* ==========================================================================
   Seite
   ========================================================================== */

export function OnlineTablePage() {
  const { lang } = useLang();
  const L = STR[lang];
  const cloud = useCloud();
  const user = cloud.user;
  const uid = user?.uid ?? '';
  const myName = user?.name || user?.email || '';

  const [params, setParams] = useSearchParams();
  const urlCode = normalizeRoomCode(params.get('code') ?? '');

  const [available, setAvailable] = useState<boolean | null>(null);
  const [code, setCode] = useState('');
  const [view, setView] = useState<RoomView | null>(null);
  const [privateCards, setPrivateCards] = useState<PrivateCardsDoc | null>(null);
  const [busy, setBusy] = useState<'' | 'create' | 'join' | 'deal'>('');
  const [error, setError] = useState<OnlineError | null>(null);
  const [codeError, setCodeError] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [joinInput, setJoinInput] = useState(urlCode);
  const [copied, setCopied] = useState(false);
  const [showRaise, setShowRaise] = useState(false);
  const [startStack, setStartStack] = useState(DEFAULT_CONFIG.startStack);
  const [bigBlind, setBigBlind] = useState(DEFAULT_CONFIG.bigBlind);
  /** Tickt, damit Anwesenheit (zeitabhängig!) regelmäßig neu bewertet wird –
      ohne diesen Takt bliebe ein verschwundener Host unbemerkt, denn ein
      abgestürzter Client löst kein Snapshot-Ereignis mehr aus. */
  const [tick, setTick] = useState(0);

  const hostGameRef = useRef<HostGame | null>(null);
  const hostBusyRef = useRef(false);
  const autoJoinRef = useRef(false);

  const room = view?.room ?? null;
  const members = useMemo(() => view?.members ?? [], [view]);
  const isHost = !!room && room.hostUid === uid;
  const now = Date.now();

  /* --- Verfügbarkeit ---------------------------------------------------- */
  useEffect(() => {
    let alive = true;
    void isOnlineAvailable().then((ok) => {
      if (alive) setAvailable(ok);
    });
    return () => {
      alive = false;
    };
  }, []);

  /* --- Engine schreibt das Protokoll in der Sprache des Hosts ------------ */
  useEffect(() => {
    setEngineLanguage(lang);
  }, [lang]);

  /* --- Uhr für die Anwesenheitsbewertung --------------------------------- */
  useEffect(() => {
    const t = window.setInterval(() => setTick((n) => n + 1), 3000);
    return () => window.clearInterval(t);
  }, []);

  /* --- Raum beobachten --------------------------------------------------- */
  useEffect(() => {
    if (!code || !uid) {
      setView(null);
      return;
    }
    hostGameRef.current = loadHostGame(code);
    const stop = watchRoom(code, setView);
    return () => {
      stop();
      setView(null);
    };
  }, [code, uid]);

  /* --- Eigene Karten ----------------------------------------------------- */
  useEffect(() => {
    if (!code || !uid) {
      setPrivateCards(null);
      return;
    }
    const stop = watchPrivateCards(code, uid, setPrivateCards);
    return () => {
      stop();
      setPrivateCards(null);
    };
  }, [code, uid]);

  /* --- Herzschlag -------------------------------------------------------- */
  useEffect(() => {
    if (!code || !uid) return;
    void heartbeat(code, uid);
    const t = window.setInterval(() => {
      void heartbeat(code, uid);
    }, HEARTBEAT_MS);
    const onVisible = () => {
      if (document.visibilityState === 'visible') void heartbeat(code, uid);
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearInterval(t);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [code, uid]);

  /* --- Beitritt ---------------------------------------------------------- */
  const join = useCallback(
    async (raw: string) => {
      const target = normalizeRoomCode(raw);
      setCodeError(false);
      if (!isValidRoomCode(target)) {
        setCodeError(true);
        return;
      }
      if (!uid) return;
      setBusy('join');
      setError(null);
      const res = await joinRoom(target, { uid, name: myName });
      if (res.ok) {
        setCode(target);
        rememberRoom(target);
        setParams({ code: target }, { replace: true });
      } else {
        setError(res.error);
        if (res.error === 'not-found') rememberRoom('');
      }
      setBusy('');
    },
    [uid, myName, setParams],
  );

  /* Deep-Link (QR-Code) bzw. zuletzt besuchter Tisch: automatisch beitreten. */
  useEffect(() => {
    if (autoJoinRef.current || code || !uid || !user?.verified || available !== true) return;
    const target = isValidRoomCode(urlCode) ? urlCode : lastRoom();
    if (!isValidRoomCode(target)) return;
    autoJoinRef.current = true;
    void join(target);
  }, [code, uid, user?.verified, available, urlCode, join]);

  /* --- Host-Schleife ------------------------------------------------------
     Läuft bei jedem Snapshot und alle paar Sekunden (Anwesenheit). Immer nur
     EINE Schreibaktion gleichzeitig – hostBusyRef verhindert Doppelläufe. */
  useEffect(() => {
    if (!room || !uid || !view || view.status !== 'ok' || hostBusyRef.current) return;
    const stamp = Date.now();

    const write = (patch: RoomPatch) => {
      hostBusyRef.current = true;
      void pushState(code, patch, room.version)
        .then((res) => {
          // 'conflict' ist harmlos: Der nächste Snapshot bringt den frischen
          // Stand, dann läuft dieselbe Prüfung noch einmal.
          if (!res.ok && res.error !== 'conflict') setError(res.error);
        })
        .finally(() => {
          hostBusyRef.current = false;
        });
    };

    // (1) Host ist weg → übernehmen (alle Clients entscheiden identisch).
    if (!isHost) {
      if (shouldClaimHost(room, members, stamp, uid)) {
        const patch: RoomPatch = { hostUid: uid };
        if (room.phase === 'hand') {
          // Ohne das Deck des alten Hosts lässt sich die Hand nicht fortsetzen.
          patch.phase = 'lobby';
          setNotice(L.handAborted);
        }
        setNotice((n) => n ?? L.youAreHostNow);
        write(patch);
      }
      return;
    }

    // (2) Laufende Hand: Zugwünsche prüfen und anwenden.
    if (room.phase === 'hand' && room.state) {
      const local = hostGameRef.current;
      if (!local || local.handNumber !== room.handNumber) {
        setNotice(L.handAborted);
        write({ phase: 'lobby' });
        return;
      }
      // Ein früherer Push ist nicht angekommen → einfach wiederholen.
      if (local.seq > room.seq) {
        const state = toPublicState(local.game, local.uids);
        write({
          state,
          seq: local.seq,
          ...(state.handOver ? { phase: 'lobby' as const, seats: settleStacks(room.seats, state) } : {}),
        });
        return;
      }
      /** Zug anwenden und den neuen Stand veröffentlichen. */
      const applyLocal = (action: Action): boolean => {
        try {
          applyAction(local.game, action);
        } catch {
          // Sollte durch checkPending ausgeschlossen sein – lieber überspringen
          // als den Tisch mit einer Ausnahme stehen zu lassen.
          return false;
        }
        local.seq = room.seq + 1;
        saveHostGame(code, local);
        const next = toPublicState(local.game, local.uids);
        write({
          state: next,
          seq: local.seq,
          ...(next.handOver ? { phase: 'lobby' as const, seats: settleStacks(room.seats, next) } : {}),
        });
        return true;
      };

      for (const m of members) {
        const check = checkPending(room, m.uid, m.pending);
        if (!check.ok) continue;
        if (applyLocal(check.action)) return;
      }

      // Niemand hat gehandelt: Steht ein längst abwesender Spieler am Zug,
      // handelt der Host für ihn – sonst friert die Runde ein.
      const auto = autoActionFor(room, members, stamp);
      if (auto) applyLocal(auto.action);
      return;
    }

    // (3) Lobby: Sitzliste an die Mitglieder angleichen.
    const seats = reconcileSeats(room.seats, members, room.config, room.phase);
    if (!sameSeats(seats, room.seats)) write({ seats });
  }, [room, members, view, uid, isHost, code, tick, L]);

  /* --- Eigenen Zugwunsch aufräumen, sobald er gewirkt hat ---------------- */
  useEffect(() => {
    if (!room || !uid) return;
    const me = members.find((m) => m.uid === uid);
    if (!me?.pending) return;
    if (me.pending.handNumber !== room.handNumber || me.pending.seq < room.seq) {
      void clearAction(code, uid);
    }
  }, [room, members, uid, code]);

  /* --- Aktionen ---------------------------------------------------------- */

  async function create() {
    if (!uid) return;
    setBusy('create');
    setError(null);
    const config: RoomConfig = sanitizeConfig({
      startStack,
      bigBlind,
      smallBlind: Math.max(1, Math.floor(bigBlind / 2)),
      maxSeats: MAX_SEATS,
    });
    const res = await createRoom({ uid, name: myName }, config);
    if (res.ok) {
      clearHostGame(res.value.code);
      hostGameRef.current = null;
      setCode(res.value.code);
      rememberRoom(res.value.code);
      setParams({ code: res.value.code }, { replace: true });
    } else {
      setError(res.error);
    }
    setBusy('');
  }

  async function leave() {
    if (code && uid) await leaveRoom(code, uid);
    clearHostGame(code);
    hostGameRef.current = null;
    autoJoinRef.current = true;
    rememberRoom('');
    setNotice(null);
    setError(null);
    setCode('');
    setParams({}, { replace: true });
  }

  async function deal() {
    if (!room || !isHost) return;
    const start = canStartHand(room, members, Date.now());
    if (!start.ok) return;
    setBusy('deal');
    setError(null);
    setNotice(null);
    // Reihenfolge wichtig: erst die Sprache setzen, dann geben – das
    // Handprotokoll entsteht direkt beim Austeilen.
    setEngineLanguage(lang);
    const setup = startHandFor(room, start.seats);
    if (!setup) {
      setBusy('');
      return;
    }
    const dealt = await pushPrivateCards(code, setup.handNumber, privateCardsFor(setup.game, setup.uids));
    if (!dealt.ok) {
      setError(dealt.error);
      setBusy('');
      return;
    }
    const local: HostGame = { game: setup.game, uids: setup.uids, handNumber: setup.handNumber, seq: 0 };
    hostGameRef.current = local;
    saveHostGame(code, local);
    const res = await pushState(
      code,
      {
        phase: 'hand',
        state: toPublicState(setup.game, setup.uids),
        handNumber: setup.handNumber,
        buttonUid: setup.buttonUid,
        seq: 0,
      },
      room.version,
    );
    if (!res.ok) setError(res.error);
    setBusy('');
  }

  async function act(action: Action) {
    if (!room?.state || !uid) return;
    if (!canPlayerAct(room.state, uid) || !isActionLegal(room.state, action)) return;
    setShowRaise(false);
    const res = await sendAction(code, uid, {
      handNumber: room.handNumber,
      seq: room.seq,
      action,
      at: Date.now(),
    });
    if (!res.ok) setError(res.error);
  }

  async function toggleReady() {
    if (!code || !uid) return;
    const me = members.find((m) => m.uid === uid);
    await setReady(code, uid, !me?.ready);
  }

  async function reorder(targetUid: string, delta: number) {
    if (!room || !isHost || room.phase === 'hand') return;
    const seats = moveSeat(room.seats, targetUid, delta);
    if (sameSeats(seats, room.seats)) return;
    await pushState(code, { seats }, room.version);
  }

  function copyLink(link: string) {
    navigator.clipboard
      ?.writeText(link)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        // Zwischenablage gesperrt – der QR-Code bleibt der Hauptweg.
      });
  }

  /* --- Vorbedingungen ---------------------------------------------------- */

  if (cloud.phase === 'checking' || available === null) {
    return (
      <div>
        <PageHead L={L} />
        <div className="card small muted">{L.checking}</div>
      </div>
    );
  }

  if (cloud.phase === 'unavailable' || available === false) {
    return (
      <div>
        <PageHead L={L} />
        <div className="card" style={{ maxWidth: 620 }}>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>{L.unavailableTitle}</div>
          <p className="small muted">{L.unavailableBody}</p>
          <p className="small faint" style={{ marginTop: 8 }}>
            <code>FIREBASE_SETUP.md</code> – {L.unavailableSetup}
          </p>
          <div className="row wrap" style={{ marginTop: 14 }}>
            <Link className="btn primary" to="/live/tisch">
              {L.unavailableLink}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <PageHead L={L} />
        <div className="card" style={{ maxWidth: 620 }}>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>{L.signInTitle}</div>
          <p className="small muted">{L.signInBody}</p>
          <div className="row wrap" style={{ marginTop: 14 }}>
            <Link className="btn primary" to="/profil">
              {L.signInLink}
            </Link>
            <Link className="btn ghost" to="/live/tisch">
              {L.unavailableLink}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!user.verified) {
    return (
      <div>
        <PageHead L={L} />
        <div className="card" style={{ maxWidth: 620 }}>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>{L.verifyTitle}</div>
          <p className="small muted">{L.verifyBody}</p>
          <div className="row wrap" style={{ marginTop: 14 }}>
            <Link className="btn primary" to="/profil">
              {L.signInLink}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* --- Startbildschirm --------------------------------------------------- */

  if (!code) {
    return (
      <div>
        <PageHead L={L} />
        {error && <ErrorLine L={L} error={error} />}

        <div className="grid cols-2" style={{ maxWidth: 780 }}>
          <div className="card">
            <div style={{ fontWeight: 800, marginBottom: 6 }}>{L.createTitle}</div>
            <p className="small muted" style={{ marginBottom: 12 }}>{L.createBody}</p>
            <label className="small muted" style={{ display: 'block', marginBottom: 4 }}>
              {L.startStackLabel}
            </label>
            <select
              className="text-input"
              value={startStack}
              onChange={(e) => setStartStack(Number(e.target.value))}
              style={{ marginBottom: 10 }}
            >
              {[500, 1000, 2000, 5000].map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
            <label className="small muted" style={{ display: 'block', marginBottom: 4 }}>
              {L.blindsLabel}
            </label>
            <select
              className="text-input"
              value={bigBlind}
              onChange={(e) => setBigBlind(Number(e.target.value))}
              style={{ marginBottom: 14 }}
            >
              {[10, 20, 50, 100].map((v) => (
                <option key={v} value={v}>{`${Math.floor(v / 2)} / ${v}`}</option>
              ))}
            </select>
            <button className="btn primary block" disabled={busy !== ''} onClick={() => void create()}>
              {busy === 'create' ? L.creating : L.createButton}
            </button>
          </div>

          <div className="card">
            <div style={{ fontWeight: 800, marginBottom: 6 }}>{L.joinTitle}</div>
            <p className="small muted" style={{ marginBottom: 12 }}>{L.joinBody}</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void join(joinInput);
              }}
            >
              <input
                className="text-input"
                value={joinInput}
                onChange={(e) => {
                  setJoinInput(normalizeRoomCode(e.target.value));
                  setCodeError(false);
                }}
                placeholder={L.codePlaceholder}
                inputMode="text"
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
                maxLength={6}
                style={{ textTransform: 'uppercase', letterSpacing: 3, fontWeight: 800, marginBottom: 10 }}
              />
              {codeError && <p className="small" style={{ color: 'var(--danger)', marginBottom: 8 }}>{L.codeInvalid}</p>}
              <button className="btn primary block" type="submit" disabled={busy !== ''}>
                {busy === 'join' ? L.joining : L.joinButton}
              </button>
            </form>
          </div>
        </div>

        <TrustNote L={L} />
      </div>
    );
  }

  /* --- Raum existiert nicht (mehr) --------------------------------------- */

  if (view && (view.status === 'missing' || (view.status === 'ok' && !room))) {
    return (
      <div>
        <PageHead L={L} />
        <div className="card" style={{ maxWidth: 620 }}>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>{L.roomGone}</div>
          <button className="btn primary" style={{ marginTop: 10 }} onClick={() => void leave()}>
            {L.backToStart}
          </button>
        </div>
      </div>
    );
  }

  if (!room) {
    // Noch kein Snapshot – oder die Verbindung hakt gerade.
    return (
      <div>
        <PageHead L={L} />
        <div className="card small muted">{view?.status === 'error' ? L.reconnecting : L.checking}</div>
        <button className="btn sm ghost" style={{ marginTop: 12 }} onClick={() => void leave()}>
          {L.backToStart}
        </button>
      </div>
    );
  }

  /* --- Tisch ------------------------------------------------------------- */

  const link = joinUrl(`${location.origin}${location.pathname}`, room.code);
  const me = members.find((m) => m.uid === uid) ?? null;
  const hostOnline = members.some((m) => m.uid === room.hostUid && onlineFrom(m.lastSeen, now));
  const start = canStartHand(room, members, now);
  const state: PublicState | null =
    room.state && privateCards && privateCards.handNumber === room.handNumber
      ? withOwnCards(room.state, uid, privateCards.cards)
      : room.state;
  const inHand = room.phase === 'hand' && !!state;
  /* Nach dem Handende wechselt der Raum zurück in die Lobby – der Tisch bleibt
     aber stehen, damit alle das Board und die aufgedeckten Karten sehen. */
  const showFelt = !!state && (inHand || state.handOver);
  const myTurn = !!state && canPlayerAct(state, uid);
  const la = myTurn ? legalActionsFor(state) : null;
  const pot = potOf(state);

  return (
    <div>
      <div className="row between wrap" style={{ marginBottom: 14, gap: 10 }}>
        <h1 style={{ fontSize: 22, fontWeight: 750 }}>{L.title}</h1>
        <div className="row wrap">
          <span className="pill gold" style={{ letterSpacing: 2, fontWeight: 900 }}>{room.code}</span>
          {inHand && <span className="pill">{L.handPill(room.handNumber)}</span>}
          {state && <span className="pill info">{L.streetLabel[state.street] ?? state.street}</span>}
          <button className="btn sm ghost" onClick={() => void leave()}>{L.leaveTable}</button>
        </div>
      </div>

      {view?.status === 'error' && <Banner text={L.reconnecting} tone="warn" />}
      {!hostOnline && <Banner text={L.hostGone} tone="warn" />}
      {notice && <Banner text={notice} tone="info" onClose={() => setNotice(null)} />}
      {error && <ErrorLine L={L} error={error} />}

      {showFelt && state && <Felt L={L} state={state} uid={uid} room={room} pot={pot} />}

      {inHand && state ? (
        <>
          {state.handOver && (
            <div className="card" style={{ marginBottom: 14, borderColor: 'rgba(217,180,91,0.4)' }}>
              {state.awards.map((a, i) => {
                const p = state.players.find((pl) => pl.id === a.playerId);
                if (!p) return null;
                // Handname lieber selbst berechnen – dann steht er in DEINER
                // Sprache und nicht in der des Hosts.
                const own =
                  p.cards.length === 2 && state.board.length === 5
                    ? categoryNameIn(evaluateBest([...p.cards, ...state.board]), lang)
                    : a.handName;
                return (
                  <div key={i} style={{ fontWeight: 700 }}>
                    {L.winnerLine(p.uid === uid ? L.youTag : p.name, a.amount, own)}
                  </div>
                );
              })}
              {isHost && (
                <button className="btn primary" style={{ marginTop: 12 }} disabled={busy !== '' || !start.ok} onClick={() => void deal()}>
                  {busy === 'deal' ? L.dealing : L.nextHand}
                </button>
              )}
            </div>
          )}

          {myTurn && la && (
            <div className="card">
              <div className="row wrap">
                <button className="btn danger lg" onClick={() => void act({ type: 'fold' })}>{L.fold}</button>
                {la.canCheck ? (
                  <button className="btn lg" onClick={() => void act({ type: 'check' })}>{L.check}</button>
                ) : (
                  <button className="btn lg" onClick={() => void act({ type: 'call' })}>{L.call(la.callAmount)}</button>
                )}
                {la.canBetOrRaise && (
                  <button className="btn primary lg" onClick={() => setShowRaise((s) => !s)}>
                    {state.currentBet === 0 ? L.bet : L.raise} …
                  </button>
                )}
              </div>
              {showRaise && la.canBetOrRaise && (
                <div className="row wrap" style={{ marginTop: 12 }}>
                  <button className="btn sm" onClick={() => void act({ type: 'raise', to: la.minRaiseTo })}>
                    {L.minRaise(la.minRaiseTo)}
                  </button>
                  {([0.5, 0.75, 1] as const).map((f, i) => {
                    const to = Math.max(
                      la.minRaiseTo,
                      Math.min(la.maxRaiseTo, Math.round(state.currentBet + f * (pot + la.callAmount))),
                    );
                    return (
                      <button key={i} className="btn sm" onClick={() => void act({ type: 'raise', to })}>
                        {[L.halfPot, L.threeQuarterPot, L.fullPot][i]}
                      </button>
                    );
                  })}
                  <button className="btn sm danger" onClick={() => void act({ type: 'raise', to: la.maxRaiseTo })}>
                    {L.allIn(la.maxRaiseTo)}
                  </button>
                </div>
              )}
            </div>
          )}

          {!myTurn && !state.handOver && (
            <div className="card small muted">
              {state.players.find((p) => p.uid === uid)
                ? L.waitingFor(state.players[state.toActIndex]?.name ?? '')
                : L.watchingTag}
            </div>
          )}

          <h2 className="section-title">{L.historyTitle}</h2>
          <div className="card game-log">
            {state.log.map((entry, i) => (
              <div key={i} className={entry.playerId === undefined ? 'street-mark' : ''}>{entry.text}</div>
            ))}
            <div className="small faint" style={{ marginTop: 8 }}>{L.logLangNote}</div>
          </div>
        </>
      ) : (
        <Lobby
          L={L}
          room={room}
          members={members}
          uid={uid}
          isHost={isHost}
          now={now}
          link={link}
          copied={copied}
          busy={busy}
          canStart={start.ok}
          ready={!!me?.ready}
          state={state}
          lang={lang}
          onCopy={() => copyLink(link)}
          onToggleReady={() => void toggleReady()}
          onDeal={() => void deal()}
          onMove={(u, d) => void reorder(u, d)}
        />
      )}

      <TrustNote L={L} />
    </div>
  );
}

/* ==========================================================================
   Bausteine
   ========================================================================== */

type Texts = (typeof STR)['de'];

function PageHead({ L }: { L: Texts }) {
  return (
    <div className="page-header">
      <div className="eyebrow">
        <Icon name="spade" size={14} /> {L.title}
      </div>
      <h1>{L.title}</h1>
      <p className="sub">{L.sub}</p>
    </div>
  );
}

function Banner({ text, tone, onClose }: { text: string; tone: 'warn' | 'info'; onClose?: () => void }) {
  const color = tone === 'warn' ? 'var(--danger)' : 'var(--info)';
  return (
    <div className="card" role="status" style={{ marginBottom: 12, borderColor: color }}>
      <div className="row between wrap">
        <span className="small">{text}</span>
        {onClose && (
          <button className="btn sm ghost" onClick={onClose}>×</button>
        )}
      </div>
    </div>
  );
}

function ErrorLine({ L, error }: { L: Texts; error: OnlineError }) {
  return <Banner text={L.errors[error] ?? L.errors.failed} tone="warn" />;
}

function TrustNote({ L }: { L: Texts }) {
  return (
    <div className="card" style={{ marginTop: 18, maxWidth: 720, background: 'var(--bg-elev)' }}>
      <div className="row" style={{ fontWeight: 700, marginBottom: 6 }}>
        <Icon name="eye" size={16} /> {L.trustTitle}
      </div>
      <p className="small muted">{L.trustBody}</p>
    </div>
  );
}

interface LobbyProps {
  L: Texts;
  room: RoomDoc;
  members: MemberDoc[];
  uid: string;
  isHost: boolean;
  now: number;
  link: string;
  copied: boolean;
  busy: string;
  canStart: boolean;
  ready: boolean;
  state: PublicState | null;
  lang: 'de' | 'en';
  onCopy: () => void;
  onToggleReady: () => void;
  onDeal: () => void;
  onMove: (uid: string, delta: number) => void;
}

function Lobby(props: LobbyProps) {
  const { L, room, members, uid, isHost, now, link, copied, busy, canStart, ready, state, lang } = props;
  const canShare = typeof navigator.share === 'function';

  return (
    <>
      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ fontWeight: 800, marginBottom: 6 }}>{L.lobbyTitle}</div>
        <p className="small muted" style={{ marginBottom: 14 }}>{L.lobbyBody}</p>
        <div className="row wrap" style={{ alignItems: 'center', gap: 20 }}>
          <QrSvg text={link} size={168} label={L.qrAlt} />
          <div style={{ display: 'grid', gap: 10, minWidth: 190 }}>
            <div>
              <div className="small faint">{L.codeLabel}</div>
              <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: 6, fontFamily: 'var(--font-display)' }}>
                {room.code}
              </div>
            </div>
            <p className="small muted" style={{ margin: 0 }}>{L.scanHint}</p>
            <div className="row wrap">
              {canShare && (
                <button
                  className="btn sm primary"
                  onClick={() => navigator.share({ title: 'PokerMentor', url: link }).catch(() => {})}
                >
                  {L.shareLink}
                </button>
              )}
              <button className="btn sm" onClick={props.onCopy}>
                {copied ? `✓ ${L.copied}` : L.copyLink}
              </button>
            </div>
          </div>
        </div>
      </div>

      {state?.handOver && (
        <div className="card" style={{ marginBottom: 14, borderColor: 'rgba(217,180,91,0.4)' }}>
          {state.awards.map((a, i) => {
            const p = state.players.find((pl) => pl.id === a.playerId);
            if (!p) return null;
            const own =
              p.cards.length === 2 && state.board.length === 5
                ? categoryNameIn(evaluateBest([...p.cards, ...state.board]), lang)
                : a.handName;
            return (
              <div key={i} style={{ fontWeight: 700 }}>
                {L.winnerLine(p.uid === uid ? L.youTag : p.name, a.amount, own)}
              </div>
            );
          })}
        </div>
      )}

      <h2 className="section-title">{L.seatsTitle}</h2>
      <div className="grid" style={{ maxWidth: 620 }}>
        {room.seats.map((seat, i) => {
          const m = members.find((x) => x.uid === seat.uid);
          const online = !!m && onlineFrom(m.lastSeen, now);
          return (
            <div key={seat.uid} className="card" style={{ padding: '12px 14px', opacity: online ? 1 : 0.55 }}>
              <div className="row between wrap">
                <div className="row" style={{ gap: 8 }}>
                  <span style={{ fontWeight: 800 }}>{seat.uid === uid ? `${seat.name} (${L.youTag})` : seat.name}</span>
                  {seat.uid === room.hostUid && (
                    <span className="pill gold">
                      <Icon name="crown" size={12} /> {L.hostTag}
                    </span>
                  )}
                  {seat.uid === room.buttonUid && <span className="dealer-btn">D</span>}
                </div>
                <div className="row wrap">
                  <span className="small" style={{ color: 'var(--gold-bright)', fontWeight: 700 }}>
                    {L.chips(seat.stack)}
                  </span>
                  {!online ? (
                    <span className="pill">{L.offlineTag}</span>
                  ) : m?.ready ? (
                    <span className="pill ok">
                      <Icon name="check" size={12} /> {L.readyTag}
                    </span>
                  ) : (
                    <span className="pill warn">{L.notReadyTag}</span>
                  )}
                </div>
              </div>
              {isHost && room.seats.length > 1 && (
                <div className="row wrap" style={{ marginTop: 8 }}>
                  <button className="btn sm ghost" disabled={i === 0} onClick={() => props.onMove(seat.uid, -1)}>
                    ↑ {L.moveUp}
                  </button>
                  <button
                    className="btn sm ghost"
                    disabled={i === room.seats.length - 1}
                    onClick={() => props.onMove(seat.uid, +1)}
                  >
                    ↓ {L.moveDown}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="small faint" style={{ marginTop: 10 }}>{L.seatCount(room.seats.length, room.config.maxSeats)}</p>

      <div className="row wrap" style={{ marginTop: 14 }}>
        <button className={`btn ${ready ? '' : 'primary'}`} onClick={props.onToggleReady}>
          {ready ? L.imNotReady : L.imReady}
        </button>
        {isHost ? (
          <button className="btn primary" disabled={!canStart || busy !== ''} onClick={props.onDeal}>
            {busy === 'deal' ? L.dealing : L.startHand}
          </button>
        ) : (
          <span className="small faint">{L.hostStartsHint}</span>
        )}
      </div>
      {isHost && !canStart && <p className="small faint" style={{ marginTop: 8 }}>{L.needMorePlayers}</p>}
    </>
  );
}

function Felt({
  L,
  state,
  uid,
  room,
  pot,
}: {
  L: Texts;
  state: PublicState;
  uid: string;
  room: RoomDoc;
  pot: number;
}) {
  const myIndex = state.players.findIndex((p) => p.uid === uid);
  const seated = rotateToMe(state.players, myIndex);
  const layout = LAYOUTS[seated.length] ?? LAYOUTS[6];
  const buttonUid = state.players[state.buttonIndex]?.uid;
  const toActUidNow = state.handOver ? null : state.players[state.toActIndex]?.uid;

  return (
    <div className="table-felt" style={{ marginBottom: 16, height: 400, position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '42%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}
      >
        {state.board.length > 0 ? (
          <CardsRow cards={state.board} />
        ) : (
          <div className="small" style={{ color: 'rgba(255,255,255,0.5)' }}>♠ {room.code} ♠</div>
        )}
        <div className="chip-bet" style={{ marginTop: 10 }}>
          <span className="chip-dot" /> {L.potLabel}: {pot > 0 ? pot : state.awards.reduce((s, a) => s + a.amount, 0)}
        </div>
      </div>

      {seated.map((p, i) => {
        const pos = layout[i] ?? layout[0];
        const acting = p.uid === toActUidNow;
        const mine = p.uid === uid;
        return (
          <div
            key={p.uid}
            style={{
              position: 'absolute',
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: 'translate(-50%, 0)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <div className={`seat${p.folded ? ' folded' : ''}${acting ? ' acting' : ''}`}>
              <div className="name">
                {mine ? L.youTag : p.name} {p.uid === buttonUid && <span className="dealer-btn">D</span>}
              </div>
              <div className="stack">{L.chips(p.stack)}</div>
              <div className="tag">
                {p.folded ? L.foldedTag : p.allIn ? L.allInTag : acting && mine ? L.yourTurn : ''}
              </div>
              <div style={{ marginTop: 5, display: 'flex', justifyContent: 'center' }}>
                {p.cards.length === 2 ? (
                  <CardsRow cards={p.cards} size="sm" />
                ) : p.folded ? (
                  <span className="small faint">{L.foldedTag}</span>
                ) : (
                  <div className="cards-row">
                    <PlayingCard size="sm" />
                    <PlayingCard size="sm" />
                  </div>
                )}
              </div>
            </div>
            {p.bet > 0 && (
              <span className="chip-bet">
                <span className="chip-dot" /> {p.bet}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
