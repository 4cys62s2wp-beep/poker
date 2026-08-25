/* Internationalisierung: Sprachkontext (Deutsch/Englisch) + Inhalts-Bundles.
   - UI-Texte liegen als typisierte Wörterbücher pro Seite in src/i18n/pages/
     (Muster: defineStrings({...de}, {...en}) – TypeScript erzwingt, dass beide
     Sprachen exakt dieselben Schlüssel haben).
   - Lerninhalte (Module, Glossar, Tells, …) liegen als englische Spiegel in
     src/content/en/ und werden erst geladen, wenn Englisch gewählt ist –
     deutsche Nutzer laden kein Byte Englisch und umgekehrt nur einmal. */

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { durableSet } from '../lib/storage';
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

/** Ladezustand des nachgeladenen englischen Inhalts-Bundles. */
type ContentStatus = 'idle' | 'loading' | 'error';

/** Wartezeiten (ms) zwischen den Ladeversuchen – kurze Netzhänger überbrücken. */
const RETRY_DELAYS = [700, 2000];
const MAX_TRIES = RETRY_DELAYS.length + 1;

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
  /** Sprache, in der `content` tatsächlich vorliegt (kann bei Ladefehlern von `lang` abweichen). */
  contentLang: Lang;
  /** true, solange das englische Inhalts-Bundle nachgeladen wird. */
  contentLoading: boolean;
  /** true, wenn das Nachladen endgültig fehlgeschlagen ist (UI englisch, Inhalte deutsch). */
  contentError: boolean;
  /** Neuer Ladeversuch für die Inhalte (z. B. aus einem Hinweis-Banner). */
  retryContent: () => void;
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
  const [status, setStatus] = useState<ContentStatus>('idle');
  /** Hochzählen startet einen neuen Ladeversuch (Retry-Knopf, „wieder online“, Sprachwechsel). */
  const [attempt, setAttempt] = useState(0);

  // Englische Inhalte nachladen, sobald (oder falls schon) Englisch aktiv ist.
  // Schlägt das fehl (offline beim allerersten Wechsel), wird mehrfach mit
  // wachsender Wartezeit erneut versucht – und erst danach ein Fehler gemeldet,
  // damit niemand still in einer gemischten Sprache hängen bleibt.
  useEffect(() => {
    if (lang !== 'en' || enBundle) {
      setStatus('idle');
      return;
    }
    let cancelled = false;
    let timer = 0;
    setStatus('loading');
    const run = (tryNo: number) => {
      import('../content/en')
        .then((m) => {
          if (cancelled) return;
          setEnBundle(m.EN_BUNDLE);
          setStatus('idle');
        })
        .catch(() => {
          if (cancelled) return;
          if (tryNo < MAX_TRIES) {
            timer = window.setTimeout(() => run(tryNo + 1), RETRY_DELAYS[tryNo - 1]);
          } else {
            setStatus('error');
          }
        });
    };
    run(1);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [lang, enBundle, attempt]);

  const retryContent = useCallback(() => setAttempt((n) => n + 1), []);

  // Nach einem Fehlversuch automatisch erneut laden, sobald das Gerät wieder online ist.
  useEffect(() => {
    if (status !== 'error') return;
    const onOnline = () => setAttempt((n) => n + 1);
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  }, [status]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    // Jeder Sprachwechsel ist auch ein neuer Ladeversuch für die Inhalte.
    setAttempt((n) => n + 1);
    // Doppelt sichern (localStorage + IndexedDB-Spiegel) wie der Lernfortschritt.
    durableSet(LANG_KEY, l);
  }, []);

  const finishOnboarding = useCallback(() => {
    setFirstRun(false);
    try {
      durableSet(LANG_KEY, localStorage.getItem(LANG_KEY) ?? initial.lang);
    } catch {
      // ignorieren
    }
  }, [initial.lang]);

  const content = lang === 'en' && enBundle ? enBundle : DE_BUNDLE;
  const contentLang: Lang = content === DE_BUNDLE ? 'de' : 'en';
  const contentLoading = status === 'loading';
  const contentError = status === 'error';

  const value = useMemo<LangValue>(
    () => ({
      lang, setLang, content, contentLang, contentLoading, contentError, retryContent, firstRun, finishOnboarding,
    }),
    [lang, setLang, content, contentLang, contentLoading, contentError, retryContent, firstRun, finishOnboarding],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      {contentError && <ContentErrorBanner onRetry={retryContent} onGerman={() => setLang('de')} />}
    </Ctx.Provider>
  );
}

/* Sichtbarer Ausweg aus dem Mischzustand (UI englisch, Lerninhalte deutsch):
   erneut versuchen oder zurück auf Deutsch. Bewusst mit Inline-Styles, damit
   der Hinweis unabhängig vom Stylesheet funktioniert. */
function ContentErrorBanner({ onRetry, onGerman }: { onRetry: () => void; onGerman: () => void }) {
  return (
    <div
      role="status"
      style={{
        position: 'fixed',
        left: 12,
        right: 12,
        bottom: 'calc(var(--nav-h, 64px) + 12px)',
        margin: '0 auto',
        maxWidth: 420,
        zIndex: 90,
        padding: '12px 14px',
        borderRadius: 12,
        background: 'var(--bg-card, #161e19)',
        border: '1px solid var(--danger, #e05c55)',
        color: 'var(--text, #ece9df)',
        boxShadow: 'var(--shadow, 0 10px 30px rgba(0,0,0,0.45))',
        fontSize: 14,
      }}
    >
      <div style={{ marginBottom: 8 }}>
        English learning content could not be loaded – lessons, glossary and trainers are still shown in German.
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className="btn sm" onClick={onRetry}>Try again</button>
        <button className="btn sm ghost" onClick={onGerman}>Switch back to Deutsch</button>
      </div>
    </div>
  );
}

export function useLang(): LangValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useLang außerhalb des LanguageProviders');
  return v;
}
