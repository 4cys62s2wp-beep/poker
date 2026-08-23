// Globaler App-Zustand: XP, Level, Lektions-Fortschritt, Trainer-Statistiken,
// Abzeichen, Lern-Streak, Bankroll-Sessions. Persistiert in localStorage.

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ALL_MODULES } from '../content';
import { BADGES } from '../content/badges';

const STORAGE_KEY = 'pokermentor-v1';

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
};

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
  completeLesson: (lessonId: string, quizScore: number, quizTotal: number) => void;
  recordTrainer: (trainerId: string, correct: boolean) => void;
  recordHand: (won: boolean) => void;
  addSession: (entry: Omit<SessionEntry, 'id'>) => void;
  deleteSession: (id: string) => void;
  setName: (name: string) => void;
  resetAll: () => void;
}

const Ctx = createContext<AppStateValue | null>(null);

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_DATA };
    const parsed = JSON.parse(raw) as Partial<AppData>;
    return { ...DEFAULT_DATA, ...parsed };
  } catch {
    return { ...DEFAULT_DATA };
  }
}

function todayStr(): string {
  const d = new Date();
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

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(loadData);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(1);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // localStorage nicht verfügbar (z. B. private Mode) – App bleibt nutzbar
    }
  }, [data]);

  const pushToast = useCallback((title: string, sub?: string) => {
    const id = toastId.current++;
    setToasts((t) => [...t, { id, title, sub }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 4000);
  }, []);

  /** Zentrale Mutation: wendet Änderungen an, prüft Level-Ups & Abzeichen. */
  const mutate = useCallback(
    (fn: (draft: AppData) => void) => {
      setData((prev) => {
        const draft: AppData = structuredClone(prev);
        fn(draft);
        applyAutoBadges(draft);

        const prevLevel = levelForXp(prev.xp);
        const newLevel = levelForXp(draft.xp);
        if (newLevel > prevLevel) {
          pushToast(`⬆️ Level ${newLevel} erreicht!`, levelTitle(newLevel));
          if (newLevel >= 5) award(draft, 'level-5');
          if (newLevel >= 10) award(draft, 'level-10');
        }
        for (const b of BADGES) {
          if (draft.badges[b.id] && !prev.badges[b.id]) {
            pushToast(`${b.icon} Abzeichen: ${b.title}`, b.description);
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
    },
    [mutate],
  );

  const resetAll = useCallback(() => {
    setData({ ...DEFAULT_DATA });
  }, []);

  const level = levelForXp(data.xp);

  const value = useMemo<AppStateValue>(
    () => ({
      data,
      toasts,
      level,
      completeLesson,
      recordTrainer,
      recordHand,
      addSession,
      deleteSession,
      setName,
      resetAll,
    }),
    [data, toasts, level, completeLesson, recordTrainer, recordHand, addSession, deleteSession, setName, resetAll],
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
}

/** Fortschritt eines Moduls (0–1). */
export function moduleProgress(data: AppData, moduleId: string): number {
  const m = ALL_MODULES.find((mod) => mod.id === moduleId);
  if (!m || m.lessons.length === 0) return 0;
  const done = m.lessons.filter((l) => data.completedLessons[l.id]).length;
  return done / m.lessons.length;
}
