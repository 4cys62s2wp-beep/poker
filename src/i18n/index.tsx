/* Internationalisierung: Sprachkontext (Deutsch/Englisch) + Inhalts-Bundles.
   - UI-Texte liegen als typisierte Wörterbücher pro Seite in src/i18n/pages/
     (Muster: defineStrings({...de}, {...en}) – TypeScript erzwingt, dass beide
     Sprachen exakt dieselben Schlüssel haben).
   - Lerninhalte (Module, Glossar, Tells, …) liegen als englische Spiegel in
     src/content/en/ und werden erst geladen, wenn Englisch gewählt ist –
     deutsche Nutzer laden kein Byte Englisch und umgekehrt nur einmal. */

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Module, GlossaryEntry } from '../content/types';
import { ALL_MODULES } from '../content';
import glossary from '../content/glossary';
import { TELLS, TELL_CATEGORIES, type Tell, type TellCategory } from '../content/tells';
import { SCENARIOS, type Scenario } from '../content/scenarios';
import { PRO_PROFILES, BEGINNER_MISTAKES, EDGE_SPOTS, PRO_SOURCE_NOTE, type ProProfile, type MistakeEntry, type EdgeEntry } from '../content/pros';
import { BADGES, type BadgeDef } from '../content/badges';
import { PUSH_CHARTS, PUSH_STACK_INFO, type PushChart, type PushStack } from '../content/pushfold';

export type Lang = 'de' | 'en';

export const LANG_KEY = 'pokermentor-lang-v1';

/** Alle sprachabhängigen Inhalte gebündelt – eine Struktur pro Sprache. */
export interface ContentBundle {
  modules: Module[];
  glossary: GlossaryEntry[];
  tells: Tell[];
  tellCategories: Array<{ id: TellCategory; label: string; icon: string }>;
  scenarios: Scenario[];
  proProfiles: ProProfile[];
  beginnerMistakes: MistakeEntry[];
  edgeSpots: EdgeEntry[];
  proSourceNote: string;
  badges: BadgeDef[];
  pushCharts: PushChart[];
  pushStackInfo: Record<PushStack, string>;
}

export const DE_BUNDLE: ContentBundle = {
  modules: ALL_MODULES,
  glossary,
  tells: TELLS,
  tellCategories: TELL_CATEGORIES,
  scenarios: SCENARIOS,
  proProfiles: PRO_PROFILES,
  beginnerMistakes: BEGINNER_MISTAKES,
  edgeSpots: EDGE_SPOTS,
  proSourceNote: PRO_SOURCE_NOTE,
  badges: BADGES,
  pushCharts: PUSH_CHARTS,
  pushStackInfo: PUSH_STACK_INFO,
};

/** Hilfsfunktion für Seiten-Wörterbücher: erzwingt identische Schlüssel in beiden Sprachen. */
export function defineStrings<T>(de: T, en: T): Record<Lang, T> {
  return { de, en };
}

/** Schwierigkeits-Label der Module (die Werte selbst bleiben als Schlüssel deutsch). */
export function levelLabel(level: string, lang: Lang): string {
  if (lang === 'de') return level;
  const map: Record<string, string> = { Einsteiger: 'Beginner', Fortgeschritten: 'Advanced', Profi: 'Pro' };
  return map[level] ?? level;
}

export const LEVEL_TITLES_I18N: Record<Lang, string[]> = {
  de: [
    'Neuling', 'Küchentisch-Spieler', 'Solider Anfänger', 'Aufsteiger', 'Grinder',
    'Regular', 'Range-Denker', 'Blattleser', 'Tisch-Kapitän', 'Crusher',
    'Poker-Mentor', 'High Roller', 'Final-Table-Stammgast', 'Elite-Grinder', 'Poker-Legende',
  ],
  en: [
    'Rookie', 'Kitchen-Table Player', 'Solid Beginner', 'Climber', 'Grinder',
    'Regular', 'Range Thinker', 'Hand Reader', 'Table Captain', 'Crusher',
    'Poker Mentor', 'High Roller', 'Final-Table Regular', 'Elite Grinder', 'Poker Legend',
  ],
};

export function levelTitleFor(level: number, lang: Lang): string {
  const titles = LEVEL_TITLES_I18N[lang];
  return titles[Math.min(level - 1, titles.length - 1)];
}

interface LangValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Sprachabhängige Inhalte in der aktiven Sprache. */
  content: ContentBundle;
  /** true, solange noch keine Sprache gewählt wurde (erster Start → Onboarding). */
  firstRun: boolean;
  finishOnboarding: () => void;
}

const Ctx = createContext<LangValue | null>(null);

function detectLang(): { lang: Lang; firstRun: boolean } {
  try {
    const stored = localStorage.getItem(LANG_KEY);
    if (stored === 'de' || stored === 'en') return { lang: stored, firstRun: false };
  } catch {
    // Speicher gesperrt: Browsersprache nutzen, Onboarding zeigen
  }
  const browser = (navigator.language || 'de').toLowerCase();
  return { lang: browser.startsWith('de') ? 'de' : 'en', firstRun: true };
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const initial = useMemo(detectLang, []);
  const [lang, setLangState] = useState<Lang>(initial.lang);
  const [firstRun, setFirstRun] = useState(initial.firstRun);
  const [enBundle, setEnBundle] = useState<ContentBundle | null>(null);

  // Englische Inhalte nachladen, sobald (oder falls schon) Englisch aktiv ist.
  useEffect(() => {
    if (lang === 'en' && !enBundle) {
      import('../content/en')
        .then((m) => setEnBundle(m.EN_BUNDLE))
        .catch(() => {
          // Laden fehlgeschlagen (offline beim allerersten Wechsel): Deutsch bleibt sichtbar.
        });
    }
  }, [lang, enBundle]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {
      // nicht speicherbar – Auswahl gilt für diese Sitzung
    }
  }, []);

  const finishOnboarding = useCallback(() => {
    setFirstRun(false);
    try {
      localStorage.setItem(LANG_KEY, localStorage.getItem(LANG_KEY) ?? initial.lang);
    } catch {
      // ignorieren
    }
  }, [initial.lang]);

  const content = lang === 'en' && enBundle ? enBundle : DE_BUNDLE;

  const value = useMemo<LangValue>(
    () => ({ lang, setLang, content, firstRun, finishOnboarding }),
    [lang, setLang, content, firstRun, finishOnboarding],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang(): LangValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useLang außerhalb des LanguageProviders');
  return v;
}
