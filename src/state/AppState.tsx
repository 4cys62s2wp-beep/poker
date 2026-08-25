// Globaler App-Zustand: Profile (mehrere Nutzer pro Gerät), XP, Level,
// Lektions-Fortschritt, Trainer-Statistiken, Abzeichen, Lern-Streak,
// Bankroll-Sessions, Wiederholungs-Stapel, Handhistorie.
// Persistenz: localStorage + IndexedDB-Spiegel (siehe lib/storage.ts).

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ALL_MODULES } from '../content';
import { BADGES } from '../content/badges';
import { durableDelete, durableSet, requestPersistentStorage } from '../lib/storage';
import { useLang, levelTitleFor } from '../i18n';

const PROFILES_KEY = 'pokermentor-profiles-v1';
const LEGACY_KEY = 'pokermentor-v1';
const dataKey = (profileId: string) => `pokermentor-data-${profileId}`;

export interface LessonResult {
  completedAt: string;
  quizScore: number;
  quizTotal: number;
}

export interface TrainerStats {
  attempts: number;
  correct: number;
  streak: number;
  bestStreak: number;
}

export interface SessionEntry {
  id: string;
  date: string; // YYYY-MM-DD
  type: 'live' | 'online';
  game: string;
  buyIn: number;
  cashOut: number;
  minutes: number;
  notes?: string;
}

export interface ReviewItem {
  /** `${lessonId}:${questionIndex}` */
  key: string;
  moduleId: string;
  lessonId: string;
  questionIndex: number;
  /** Fälligkeitsdatum YYYY-MM-DD. */
  due: string;
  /** Aktuelles Intervall in Tagen. */
  interval: number;
  /** Richtige Antworten in Folge (3 = gemeistert, Karte fliegt raus). */
  streak: number;
}

export interface HandRecord {
  id: string;
  date: string; // ISO
  handNumber: number;
  heroCards: number[];
  board: number[];
  result: 'won' | 'lost' | 'folded';
  /** Chip-Differenz aus Sicht des Heros. */
  amount: number;
  players: number;
  log: string[];
}

export interface AppData {
  xp: number;
  completedLessons: Record<string, LessonResult>;
  trainers: Record<string, TrainerStats>;
  badges: Record<string, string>;
  streak: { lastDay: string; count: number };
  sessions: SessionEntry[];
  handsPlayed: number;
  handsWon: number;
  name: string;
  reviews: ReviewItem[];
  daily: { date: string; score: number; total: number } | null;
  hands: HandRecord[];
  /** Tagesverbrauch limitierter Gratis-Features (Schlüssel = FeatureKey). */
  usage: { day: string; counts: Record<string, number> };
  /** Start der Pro-Testphase (ISO) – null, solange nie gestartet. */
  trialStartedAt: string | null;
}

export interface ProfileMeta {
  id: string;
  name: string;
  email?: string;
  createdAt: string;
  /** Akzentfarbe fürs Avatar-Monogramm. */
  color: string;
  /** Verknüpftes Cloud-Konto (Firebase-UID), falls vorhanden. */
  cloudUid?: string;
}

interface ProfilesIndex {
  activeId: string;
  profiles: ProfileMeta[];
}

const DEFAULT_DATA: AppData = {
  xp: 0,
  completedLessons: {},
  trainers: {},
  badges: {},
  streak: { lastDay: '', count: 0 },
  sessions: [],
  handsPlayed: 0,
  handsWon: 0,
  name: '',
  reviews: [],
  daily: null,
  hands: [],
  usage: { day: '', counts: {} },
  trialStartedAt: null,
};

const PROFILE_COLORS = ['#d4af5e', '#58b368', '#5590d9', '#9b7fd4', '#e0564f', '#4fb8c9'];

export const LEVEL_TITLES = [
  'Neuling',
  'Küchentisch-Spieler',
  'Solider Anfänger',
  'Aufsteiger',
  'Grinder',
  'Regular',
  'Range-Denker',
  'Blattleser',
  'Tisch-Kapitän',
  'Crusher',
  'Poker-Mentor',
  'High Roller',
  'Final-Table-Stammgast',
  'Elite-Grinder',
  'Poker-Legende',
];

/** Kumulierte XP-Schwelle für ein Level (Level 1 = 0 XP). */
export function xpThreshold(level: number): number {
  return 75 * (level - 1) * level;
}

export function levelForXp(xp: number): number {
  let level = 1;
  while (xpThreshold(level + 1) <= xp) level++;
  return level;
}

export function levelTitle(level: number): string {
  return LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];
}

export interface Toast {
  id: number;
  title: string;
  sub?: string;
}

interface AppStateValue {
  data: AppData;
  toasts: Toast[];
  level: number;
  dueReviewCount: number;
  profiles: ProfileMeta[];
  activeProfile: ProfileMeta;
  completeLesson: (lessonId: string, quizScore: number, quizTotal: number) => void;
  recordTrainer: (trainerId: string, correct: boolean) => void;
  recordHand: (won: boolean) => void;
  addSession: (entry: Omit<SessionEntry, 'id'>) => void;
  deleteSession: (id: string) => void;
  setName: (name: string) => void;
  resetAll: () => void;
  addReviewItem: (moduleId: string, lessonId: string, questionIndex: number) => void;
  answerReview: (key: string, correct: boolean) => void;
  completeDailyQuiz: (score: number, total: number) => void;
  addHandRecord: (record: Omit<HandRecord, 'id' | 'date'>) => void;
  exportJson: () => string;
  importJson: (json: string) => boolean;
  createProfile: (name: string, email?: string) => void;
  switchProfile: (id: string) => void;
  deleteProfile: (id: string) => void;
  updateProfile: (id: string, patch: { name?: string; email?: string }) => void;
  /** Externe Daten (z. B. Cloud-Sync) in das aktive Profil übernehmen. */
  replaceData: (data: AppData) => void;
  /**
   * Verknüpft ein Cloud-Konto mit einem lokalen Profil (legt es bei Bedarf an),
   * wechselt dorthin und übernimmt die Cloud-Daten, wenn sie weiter sind.
   * Rückgabe: was passiert ist plus der gewählte Datenstand – der Aufrufer
   * entscheidet damit, ob dieser Stand in die Cloud hochgeladen werden muss.
   */
  linkCloudProfile: (
    uid: string,
    name: string,
    email: string,
    incoming: AppData | null,
  ) => { outcome: 'adopted-cloud' | 'kept-local' | 'created'; data: AppData };
  /** Heutiger Verbrauch limitierter Gratis-Features (nach Tagesreset). */
  todayUsage: Record<string, number>;
  /** Zählt eine Nutzung eines limitierten Features. */
  consumeFeature: (key: string, amount?: number) => void;
  /** Startet die Pro-Testphase (nur beim ersten Mal wirksam). */
  startTrial: () => void;
}

const Ctx = createContext<AppStateValue | null>(null);

// ---------- Validierung / Sanitisierung ----------

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && isFinite(v) ? v : fallback;
}

function str(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v.slice(0, 2000) : fallback;
}

/**
 * Wandelt beliebige (auch manipulierte) Eingaben in ein garantiert
 * schema-konformes AppData um. Grundlage für Import & Cloud-Sync.
 */
export function sanitizeAppData(input: unknown): AppData {
  const d = (typeof input === 'object' && input !== null ? input : {}) as Record<string, unknown>;
  const out: AppData = structuredClone(DEFAULT_DATA);

  out.xp = Math.max(0, Math.min(10_000_000, num(d.xp)));
  out.handsPlayed = Math.max(0, num(d.handsPlayed));
  out.handsWon = Math.max(0, num(d.handsWon));
  out.name = str(d.name).slice(0, 40);

  if (typeof d.completedLessons === 'object' && d.completedLessons !== null) {
    for (const [k, v] of Object.entries(d.completedLessons as Record<string, unknown>)) {
      if (typeof v === 'object' && v !== null && /^m\d+-l\d+$/.test(k)) {
        const r = v as Record<string, unknown>;
        out.completedLessons[k] = {
          completedAt: str(r.completedAt),
          quizScore: Math.max(0, num(r.quizScore)),
          quizTotal: Math.max(0, num(r.quizTotal)),
        };
      }
    }
  }

  if (typeof d.trainers === 'object' && d.trainers !== null) {
    for (const [k, v] of Object.entries(d.trainers as Record<string, unknown>)) {
      if (typeof v === 'object' && v !== null && /^[a-z]+$/.test(k)) {
        const t = v as Record<string, unknown>;
        out.trainers[k] = {
          attempts: Math.max(0, num(t.attempts)),
          correct: Math.max(0, num(t.correct)),
          streak: Math.max(0, num(t.streak)),
          bestStreak: Math.max(0, num(t.bestStreak)),
        };
      }
    }
  }

  if (typeof d.badges === 'object' && d.badges !== null) {
    const validIds = new Set(BADGES.map((b) => b.id));
    for (const [k, v] of Object.entries(d.badges as Record<string, unknown>)) {
      if (validIds.has(k) && typeof v === 'string') out.badges[k] = str(v, new Date().toISOString());
    }
  }

  if (typeof d.streak === 'object' && d.streak !== null) {
    const s = d.streak as Record<string, unknown>;
    out.streak = { lastDay: str(s.lastDay).slice(0, 10), count: Math.max(0, num(s.count)) };
  }

  if (Array.isArray(d.sessions)) {
    out.sessions = (d.sessions as unknown[]).slice(0, 2000).flatMap((v) => {
      if (typeof v !== 'object' || v === null) return [];
      const s = v as Record<string, unknown>;
      const type = s.type === 'live' ? 'live' : 'online';
      return [{
        id: str(s.id, `s${Math.random()}`).slice(0, 60),
        date: str(s.date).slice(0, 10),
        type: type as 'live' | 'online',
        game: str(s.game).slice(0, 80),
        buyIn: Math.max(0, num(s.buyIn)),
        cashOut: Math.max(0, num(s.cashOut)),
        minutes: Math.max(0, num(s.minutes)),
        notes: s.notes === undefined ? undefined : str(s.notes).slice(0, 500),
      }];
    });
  }

  if (Array.isArray(d.reviews)) {
    out.reviews = (d.reviews as unknown[]).slice(0, 2000).flatMap((v) => {
      if (typeof v !== 'object' || v === null) return [];
      const r = v as Record<string, unknown>;
      const lessonId = str(r.lessonId);
      const moduleId = str(r.moduleId);
      if (!/^m\d+-l\d+$/.test(lessonId) || !/^m\d+$/.test(moduleId)) return [];
      return [{
        key: str(r.key).slice(0, 40),
        moduleId,
        lessonId,
        questionIndex: Math.max(0, Math.min(50, num(r.questionIndex))),
        due: str(r.due).slice(0, 10),
        interval: Math.max(0, Math.min(365, num(r.interval))),
        streak: Math.max(0, Math.min(10, num(r.streak))),
      }];
    });
  }

  if (typeof d.daily === 'object' && d.daily !== null) {
    const day = d.daily as Record<string, unknown>;
    out.daily = {
      date: str(day.date).slice(0, 10),
      score: Math.max(0, num(day.score)),
      total: Math.max(0, num(day.total)),
    };
  }

  if (typeof d.usage === 'object' && d.usage !== null) {
    const u = d.usage as Record<string, unknown>;
    out.usage.day = str(u.day).slice(0, 10);
    if (typeof u.counts === 'object' && u.counts !== null) {
      for (const [k, v] of Object.entries(u.counts as Record<string, unknown>).slice(0, 40)) {
        if (/^[a-z-]{1,40}$/.test(k)) {
          out.usage.counts[k] = Math.max(0, Math.min(1_000_000, num(v)));
        }
      }
    }
  }

  if (typeof d.trialStartedAt === 'string') {
    const t = str(d.trialStartedAt).slice(0, 40);
    out.trialStartedAt = isFinite(new Date(t).getTime()) ? t : null;
  }

  if (Array.isArray(d.hands)) {
    out.hands = (d.hands as unknown[]).slice(0, 30).flatMap((v) => {
      if (typeof v !== 'object' || v === null) return [];
      const h = v as Record<string, unknown>;
      const cardOk = (c: unknown): c is number => typeof c === 'number' && c >= 0 && c <= 51;
      const heroCards = Array.isArray(h.heroCards) ? (h.heroCards as unknown[]).filter(cardOk) : [];
      const board = Array.isArray(h.board) ? (h.board as unknown[]).filter(cardOk) : [];
      const result = h.result === 'won' || h.result === 'lost' || h.result === 'folded' ? h.result : 'folded';
      return [{
        id: str(h.id, `h${Math.random()}`).slice(0, 60),
        date: str(h.date),
        handNumber: Math.max(0, num(h.handNumber)),
        heroCards,
        board,
        result: result as 'won' | 'lost' | 'folded',
        amount: num(h.amount),
        players: Math.max(2, Math.min(9, num(h.players, 2))),
        log: Array.isArray(h.log) ? (h.log as unknown[]).slice(0, 200).map((l) => str(l).slice(0, 300)) : [],
      }];
    });
  }

  return out;
}

// ---------- Profile ----------

function newProfileId(): string {
  return `p${Date.now().toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`;
}

function loadDataFor(profileId: string): AppData {
  try {
    const raw = localStorage.getItem(dataKey(profileId));
    if (!raw) return structuredClone(DEFAULT_DATA);
    return sanitizeAppData(JSON.parse(raw));
  } catch {
    return structuredClone(DEFAULT_DATA);
  }
}

function saveProfilesIndex(index: ProfilesIndex) {
  durableSet(PROFILES_KEY, JSON.stringify(index));
}

/** Lädt den Profil-Index; migriert Altdaten (Einzelprofil-Ära) beim ersten Mal. */
function loadProfilesIndex(): ProfilesIndex {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ProfilesIndex;
      if (
        parsed &&
        Array.isArray(parsed.profiles) &&
        parsed.profiles.length > 0 &&
        parsed.profiles.every((p) => typeof p.id === 'string')
      ) {
        // Alle Felder validieren – ein korrupter Index darf die UI nicht verbiegen.
        const profiles: ProfileMeta[] = parsed.profiles.map((p, i) => ({
          id: p.id.slice(0, 64),
          name: typeof p.name === 'string' ? p.name.slice(0, 40) : '',
          email: typeof p.email === 'string' ? p.email.slice(0, 120) : undefined,
          createdAt: typeof p.createdAt === 'string' ? p.createdAt.slice(0, 40) : new Date().toISOString(),
          color: PROFILE_COLORS.includes(p.color) ? p.color : PROFILE_COLORS[i % PROFILE_COLORS.length],
          cloudUid: typeof p.cloudUid === 'string' ? p.cloudUid.slice(0, 128) : undefined,
        }));
        const activeId = profiles.some((p) => p.id === parsed.activeId) ? parsed.activeId : profiles[0].id;
        return { activeId, profiles };
      }
    }
  } catch {
    // fällt durch zur Neuanlage
  }

  // Migration von der Einzelprofil-Ära oder frischer Start
  const id = newProfileId();
  let legacy: AppData | null = null;
  try {
    const raw = localStorage.getItem(LEGACY_KEY);
    if (raw) legacy = sanitizeAppData(JSON.parse(raw));
  } catch {
    legacy = null;
  }
  const index: ProfilesIndex = {
    activeId: id,
    profiles: [{
      id,
      name: legacy?.name ?? '',
      createdAt: new Date().toISOString(),
      color: PROFILE_COLORS[0],
    }],
  };
  saveProfilesIndex(index);
  if (legacy) {
    durableSet(dataKey(id), JSON.stringify(legacy));
    try {
      localStorage.removeItem(LEGACY_KEY);
    } catch {
      // ignorieren
    }
  }
  return index;
}

// ---------- Datum ----------

function todayStr(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

function addDaysStr(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

function isYesterday(dayStr: string): boolean {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return dayStr === `${d.getFullYear()}-${m}-${day}`;
}

// ---------- Provider ----------

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [index, setIndex] = useState<ProfilesIndex>(loadProfilesIndex);
  const [data, setData] = useState<AppData>(() => loadDataFor(index.activeId));
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(1);
  const activeIdRef = useRef(index.activeId);
  activeIdRef.current = index.activeId;
  const indexRef = useRef(index);
  indexRef.current = index;

  useEffect(() => {
    requestPersistentStorage();
  }, []);

  // Fortschritt bei jeder Änderung doppelt sichern
  useEffect(() => {
    durableSet(dataKey(activeIdRef.current), JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    saveProfilesIndex(index);
  }, [index]);

  const pushToast = useCallback((title: string, sub?: string) => {
    const id = toastId.current++;
    setToasts((t) => [...t, { id, title, sub }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 4000);
  }, []);

  // Sprache für Toast-Texte (Level-Ups, Abzeichen) – als Ref, damit mutate stabil bleibt.
  const { lang, content: langContent } = useLang();
  const langRef = useRef(lang);
  langRef.current = lang;
  const badgeDefsRef = useRef(langContent.badges);
  badgeDefsRef.current = langContent.badges;

  /** Zentrale Mutation: wendet Änderungen an, prüft Level-Ups & Abzeichen. */
  const mutate = useCallback(
    (fn: (draft: AppData) => void) => {
      setData((prev) => {
        const draft: AppData = structuredClone(prev);
        fn(draft);
        applyAutoBadges(draft);

        const prevLevel = levelForXp(prev.xp);
        const newLevel = levelForXp(draft.xp);
        const l = langRef.current;
        if (newLevel > prevLevel) {
          pushToast(
            l === 'de' ? `Level ${newLevel} erreicht!` : `Level ${newLevel} reached!`,
            levelTitleFor(newLevel, l),
          );
          if (newLevel >= 5) award(draft, 'level-5');
          if (newLevel >= 10) award(draft, 'level-10');
        }
        for (const b of BADGES) {
          if (draft.badges[b.id] && !prev.badges[b.id]) {
            const def = badgeDefsRef.current.find((d) => d.id === b.id) ?? b;
            pushToast(`${def.icon} ${l === 'de' ? 'Abzeichen' : 'Badge'}: ${def.title}`, def.description);
          }
        }
        return draft;
      });
    },
    [pushToast],
  );

  const completeLesson = useCallback(
    (lessonId: string, quizScore: number, quizTotal: number) => {
      mutate((d) => {
        const already = !!d.completedLessons[lessonId];
        const prevResult = d.completedLessons[lessonId];
        d.completedLessons[lessonId] = {
          completedAt: new Date().toISOString(),
          quizScore: Math.max(quizScore, prevResult?.quizScore ?? 0),
          quizTotal,
        };
        if (!already) {
          d.xp += 60 + Math.round((40 * quizScore) / Math.max(1, quizTotal));
        } else if (quizScore > (prevResult?.quizScore ?? 0)) {
          d.xp += 10;
        }
        if (quizScore === quizTotal) award(d, 'quiz-perfect');
        touchStreak(d);
      });
    },
    [mutate],
  );

  const recordTrainer = useCallback(
    (trainerId: string, correct: boolean) => {
      mutate((d) => {
        const t = d.trainers[trainerId] ?? { attempts: 0, correct: 0, streak: 0, bestStreak: 0 };
        t.attempts += 1;
        if (correct) {
          t.correct += 1;
          t.streak += 1;
          t.bestStreak = Math.max(t.bestStreak, t.streak);
          d.xp += 5;
        } else {
          t.streak = 0;
        }
        d.trainers[trainerId] = t;
        award(d, 'trainer-first');
        if (t.streak >= 10) award(d, 'trainer-streak-10');
        touchStreak(d);
      });
    },
    [mutate],
  );

  const recordHand = useCallback(
    (won: boolean) => {
      mutate((d) => {
        d.handsPlayed += 1;
        if (won) d.handsWon += 1;
        d.xp += won ? 10 : 2;
        award(d, 'first-hand');
        if (won) award(d, 'first-win');
        if (d.handsPlayed >= 100) award(d, 'hands-100');
        touchStreak(d);
      });
    },
    [mutate],
  );

  const addSession = useCallback(
    (entry: Omit<SessionEntry, 'id'>) => {
      mutate((d) => {
        d.sessions.push({ ...entry, id: `s${Date.now()}-${Math.floor(Math.random() * 1e6)}` });
        d.sessions.sort((a, b) => a.date.localeCompare(b.date));
        award(d, 'bankroll-start');
      });
    },
    [mutate],
  );

  const deleteSession = useCallback(
    (id: string) => {
      mutate((d) => {
        d.sessions = d.sessions.filter((s) => s.id !== id);
      });
    },
    [mutate],
  );

  const setName = useCallback(
    (name: string) => {
      mutate((d) => {
        d.name = name;
      });
      setIndex((idx) => ({
        ...idx,
        profiles: idx.profiles.map((p) => (p.id === idx.activeId ? { ...p, name } : p)),
      }));
    },
    [mutate],
  );

  const resetAll = useCallback(() => {
    setData(structuredClone(DEFAULT_DATA));
  }, []);

  const addReviewItem = useCallback(
    (moduleId: string, lessonId: string, questionIndex: number) => {
      mutate((d) => {
        const key = `${lessonId}:${questionIndex}`;
        if (d.reviews.some((r) => r.key === key)) return;
        d.reviews.push({ key, moduleId, lessonId, questionIndex, due: todayStr(), interval: 0, streak: 0 });
      });
    },
    [mutate],
  );

  const answerReview = useCallback(
    (key: string, correct: boolean) => {
      mutate((d) => {
        const item = d.reviews.find((r) => r.key === key);
        if (!item) return;
        if (correct) {
          item.streak += 1;
          d.xp += 4;
          if (item.streak >= 3) {
            // Gemeistert – Karte fliegt aus dem Stapel
            d.reviews = d.reviews.filter((r) => r.key !== key);
            d.xp += 8;
          } else {
            item.interval = item.interval === 0 ? 1 : Math.min(30, Math.round(item.interval * 2.5));
            item.due = addDaysStr(item.interval);
          }
        } else {
          item.streak = 0;
          item.interval = 0;
          item.due = addDaysStr(1);
        }
        if (d.reviews.length === 0) award(d, 'review-clear');
        touchStreak(d);
      });
    },
    [mutate],
  );

  const completeDailyQuiz = useCallback(
    (score: number, total: number) => {
      mutate((d) => {
        const today = todayStr();
        if (d.daily?.date === today) return;
        d.daily = { date: today, score, total };
        d.xp += 30 + score * 4;
        award(d, 'daily-quiz');
        touchStreak(d);
      });
    },
    [mutate],
  );

  const addHandRecord = useCallback(
    (record: Omit<HandRecord, 'id' | 'date'>) => {
      mutate((d) => {
        d.hands.unshift({
          ...record,
          id: `h${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
          date: new Date().toISOString(),
        });
        if (d.hands.length > 30) d.hands.length = 30;
      });
    },
    [mutate],
  );

  const exportJson = useCallback(() => {
    return JSON.stringify({ app: 'pokermentor', version: 1, exportedAt: new Date().toISOString(), data }, null, 2);
  }, [data]);

  const importJson = useCallback((json: string): boolean => {
    try {
      if (json.length > 5_000_000) return false;
      const parsed = JSON.parse(json);
      const incoming = parsed?.app === 'pokermentor' ? parsed.data : parsed;
      if (!incoming || typeof incoming !== 'object' || typeof incoming.xp !== 'number') return false;
      setData(sanitizeAppData(incoming));
      return true;
    } catch {
      return false;
    }
  }, []);

  const replaceData = useCallback((incoming: AppData) => {
    setData(sanitizeAppData(incoming));
  }, []);

  // ---------- Profil-Verwaltung ----------

  const createProfile = useCallback((name: string, email?: string) => {
    const id = newProfileId();
    setIndex((idx) => {
      const color = PROFILE_COLORS[idx.profiles.length % PROFILE_COLORS.length];
      const meta: ProfileMeta = {
        id,
        name: name.trim().slice(0, 40),
        email: email?.trim().slice(0, 120) || undefined,
        createdAt: new Date().toISOString(),
        color,
      };
      return { activeId: id, profiles: [...idx.profiles, meta] };
    });
    const fresh = structuredClone(DEFAULT_DATA);
    fresh.name = name.trim().slice(0, 40);
    durableSet(dataKey(id), JSON.stringify(fresh));
    setData(fresh);
  }, []);

  const switchProfile = useCallback((id: string) => {
    setIndex((idx) => {
      if (!idx.profiles.some((p) => p.id === id)) return idx;
      return { ...idx, activeId: id };
    });
    setData(loadDataFor(id));
  }, []);

  const deleteProfile = useCallback((id: string) => {
    setIndex((idx) => {
      if (idx.profiles.length <= 1) return idx;
      const remaining = idx.profiles.filter((p) => p.id !== id);
      durableDelete(dataKey(id));
      const nextActive = idx.activeId === id ? remaining[0].id : idx.activeId;
      if (idx.activeId === id) {
        setData(loadDataFor(nextActive));
      }
      return { activeId: nextActive, profiles: remaining };
    });
  }, []);

  const updateProfile = useCallback((id: string, patch: { name?: string; email?: string }) => {
    setIndex((idx) => ({
      ...idx,
      profiles: idx.profiles.map((p) =>
        p.id === id
          ? {
              ...p,
              name: patch.name !== undefined ? patch.name.trim().slice(0, 40) : p.name,
              email: patch.email !== undefined ? patch.email.trim().slice(0, 120) || undefined : p.email,
            }
          : p,
      ),
    }));
    if (patch.name !== undefined && id === activeIdRef.current) {
      mutate((d) => {
        d.name = patch.name!.trim().slice(0, 40);
      });
    }
  }, [mutate]);

  const linkCloudProfile = useCallback(
    (
      uid: string,
      name: string,
      email: string,
      incoming: AppData | null,
    ): { outcome: 'adopted-cloud' | 'kept-local' | 'created'; data: AppData } => {
      const idx = indexRef.current;
      const cleanName = (name || email).trim().slice(0, 40);
      const cleanEmail = email.trim().slice(0, 120);
      const existing = idx.profiles.find((p) => p.cloudUid === uid);

      if (existing) {
        const local = loadDataFor(existing.id);
        // Konfliktregel: Der Stand mit mehr XP gewinnt – Lernfortschritt geht nie verloren.
        const useCloud = incoming !== null && incoming.xp >= local.xp;
        const chosen = useCloud ? sanitizeAppData(incoming) : local;
        durableSet(dataKey(existing.id), JSON.stringify(chosen));
        setIndex({
          activeId: existing.id,
          profiles: idx.profiles.map((p) =>
            p.id === existing.id ? { ...p, name: cleanName || p.name, email: cleanEmail } : p,
          ),
        });
        setData(chosen);
        return { outcome: useCloud ? 'adopted-cloud' : 'kept-local', data: chosen };
      }

      const id = newProfileId();
      const meta: ProfileMeta = {
        id,
        name: cleanName,
        email: cleanEmail,
        createdAt: new Date().toISOString(),
        color: PROFILE_COLORS[idx.profiles.length % PROFILE_COLORS.length],
        cloudUid: uid,
      };
      const fresh = incoming !== null ? sanitizeAppData(incoming) : structuredClone(DEFAULT_DATA);
      if (incoming === null) fresh.name = cleanName;
      durableSet(dataKey(id), JSON.stringify(fresh));
      setIndex({ activeId: id, profiles: [...idx.profiles, meta] });
      setData(fresh);
      return { outcome: incoming !== null ? 'adopted-cloud' : 'created', data: fresh };
    },
    [],
  );

  // ---------- Pro-Nutzung ----------

  /** Zähler gelten nur für den heutigen Tag – ältere Stände zählen als 0. */
  const todayUsage = useMemo(
    () => (data.usage.day === todayStr() ? data.usage.counts : {}),
    [data.usage],
  );

  const consumeFeature = useCallback(
    (key: string, amount = 1) => {
      mutate((d) => {
        const today = todayStr();
        if (d.usage.day !== today) {
          // Tageswechsel: Tageszähler zurücksetzen, Gesamtzähler behalten.
          const totals = { 'bankroll-unlimited': d.usage.counts['bankroll-unlimited'] ?? 0 };
          d.usage = { day: today, counts: totals['bankroll-unlimited'] ? totals : {} };
        }
        d.usage.counts[key] = Math.max(0, (d.usage.counts[key] ?? 0) + amount);
      });
    },
    [mutate],
  );

  const startTrial = useCallback(() => {
    mutate((d) => {
      if (!d.trialStartedAt) d.trialStartedAt = new Date().toISOString();
    });
  }, [mutate]);

  const level = levelForXp(data.xp);
  const dueReviewCount = useMemo(() => {
    const today = todayStr();
    return data.reviews.filter((r) => r.due <= today).length;
  }, [data.reviews]);

  const activeProfile = index.profiles.find((p) => p.id === index.activeId) ?? index.profiles[0];

  const value = useMemo<AppStateValue>(
    () => ({
      data,
      toasts,
      level,
      dueReviewCount,
      profiles: index.profiles,
      activeProfile,
      completeLesson,
      recordTrainer,
      recordHand,
      addSession,
      deleteSession,
      setName,
      resetAll,
      addReviewItem,
      answerReview,
      completeDailyQuiz,
      addHandRecord,
      exportJson,
      importJson,
      createProfile,
      switchProfile,
      deleteProfile,
      updateProfile,
      replaceData,
      linkCloudProfile,
      todayUsage,
      consumeFeature,
      startTrial,
    }),
    [data, toasts, level, dueReviewCount, index.profiles, activeProfile, completeLesson, recordTrainer, recordHand,
     addSession, deleteSession, setName, resetAll, addReviewItem, answerReview, completeDailyQuiz, addHandRecord,
     exportJson, importJson, createProfile, switchProfile, deleteProfile, updateProfile, replaceData, linkCloudProfile,
     todayUsage, consumeFeature, startTrial],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState(): AppStateValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAppState außerhalb des Providers');
  return v;
}

function award(d: AppData, badgeId: string) {
  if (!d.badges[badgeId]) {
    d.badges[badgeId] = new Date().toISOString();
  }
}

function touchStreak(d: AppData) {
  const today = todayStr();
  if (d.streak.lastDay === today) return;
  if (isYesterday(d.streak.lastDay)) {
    d.streak.count += 1;
  } else {
    d.streak.count = 1;
  }
  d.streak.lastDay = today;
  if (d.streak.count >= 3) award(d, 'streak-3');
  if (d.streak.count >= 7) award(d, 'streak-7');
}

/** Abzeichen, die sich direkt aus dem Datenstand ergeben. */
function applyAutoBadges(d: AppData) {
  const doneCount = Object.keys(d.completedLessons).length;
  if (doneCount >= 1) award(d, 'first-lesson');
  if (doneCount >= 5) award(d, 'five-lessons');
  if (doneCount >= 20) award(d, 'twenty-lessons');

  const moduleDone = (moduleId: string) => {
    const m = ALL_MODULES.find((mod) => mod.id === moduleId);
    return !!m && m.lessons.every((l) => d.completedLessons[l.id]);
  };
  if (moduleDone('m1')) award(d, 'module-basics');
  if (moduleDone('m3')) award(d, 'module-math');
  if (ALL_MODULES.every((m) => m.lessons.every((l) => d.completedLessons[l.id]))) {
    award(d, 'all-modules');
  }
  if ((d.trainers['szenario']?.correct ?? 0) >= 10) award(d, 'scenario-10');
  if ((d.trainers['pushfold']?.correct ?? 0) >= 20) award(d, 'pushfold-20');
}

/** Fortschritt eines Moduls (0–1). */
export function moduleProgress(data: AppData, moduleId: string): number {
  const m = ALL_MODULES.find((mod) => mod.id === moduleId);
  if (!m || m.lessons.length === 0) return 0;
  const done = m.lessons.filter((l) => data.completedLessons[l.id]).length;
  return done / m.lessons.length;
}
