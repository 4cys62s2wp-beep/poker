import { Component, type ReactNode } from 'react';

interface State {
  hasError: boolean;
}

/** Fängt unerwartete Fehler ab, statt eine weiße Seite zu zeigen. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
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
          <h1 style={{ fontSize: 22 }}>Da ist etwas schiefgelaufen</h1>
          <p style={{ color: 'var(--text-dim)', maxWidth: 420 }}>
            Ein unerwarteter Fehler ist aufgetreten. Deine Daten sind sicher gespeichert – lade die App einfach neu.
          </p>
          <button
            className="btn primary"
            onClick={() => {
              location.hash = '#/';
              location.reload();
            }}
          >
            App neu laden
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
