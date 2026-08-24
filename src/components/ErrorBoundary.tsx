import { Component, type ReactNode } from 'react';
import { LANG_KEY } from '../i18n';

interface State {
  hasError: boolean;
}

/* Klassenkomponente → keine Hooks: Sprache direkt aus localStorage lesen
   (sicherer Fallback auf Deutsch, falls der Speicher gesperrt ist). */
function currentLang(): 'de' | 'en' {
  try {
    return localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'de';
  } catch {
    return 'de';
  }
}

const TEXTS = {
  de: {
    title: 'Da ist etwas schiefgelaufen',
    body: 'Ein unerwarteter Fehler ist aufgetreten. Deine Daten sind sicher gespeichert – lade die App einfach neu.',
    reload: 'App neu laden',
  },
  en: {
    title: 'Something went wrong',
    body: 'An unexpected error occurred. Your data is safely stored – just reload the app.',
    reload: 'Reload app',
  },
} as const;

/** Fängt unerwartete Fehler ab, statt eine weiße Seite zu zeigen. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      const t = TEXTS[currentLang()];
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            padding: 24,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 40 }}>♠</div>
          <h1 style={{ fontSize: 22 }}>{t.title}</h1>
          <p style={{ color: 'var(--text-dim)', maxWidth: 420 }}>{t.body}</p>
          <button
            className="btn primary"
            onClick={() => {
              location.hash = '#/';
              location.reload();
            }}
          >
            {t.reload}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
