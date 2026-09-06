/* Der Bildschirm, den niemand sehen soll — und den deshalb niemand ansieht.
   ======================================================================

   Eine App, deren Daten auf dem Gerät liegen, hat eine schlimmste
   Fehlerform: eine weiße Seite. Kein Weg zurück, kein Knopf, und der
   Fortschritt liegt hinter genau der Anwendung, die nicht mehr startet.

   Zwei Dinge hat dieser Auffangbildschirm bis E-049 nicht bedacht:

   1. **Er hing zu tief.** Er stand *in* `App`, also unterhalb aller sechs
      Provider. Ein Fehler in `AppStateProvider` — der Provider, der
      `localStorage` liest, JSON auspackt und `sanitizeAppData` aufruft, also
      der einzige, der es mit fremden Daten zu tun hat — kam gar nicht bei
      ihm an. Seit E-049 hängt er in `main.tsx` ganz außen.
   2. **Neu laden hilft nicht immer.** Liegt der Fehler an gespeicherten
      Daten, führt jeder Neustart in denselben Absturz. Deshalb zählt dieser
      Bildschirm mit: Beim zweiten Mal in derselben Sitzung bietet er an,
      die Daten zu sichern und zurückzusetzen — in dieser Reihenfolge. */

import { Component, type ReactNode } from 'react';
import { LANG_KEY } from '../i18n';
import { alleGespeichertenDaten, loescheAllesVonUns } from '../lib/storage';
import { downloadBlob } from '../lib/download';

interface State {
  hasError: boolean;
  /** Schon der zweite Absturz in dieser Sitzung: Neuladen hat nicht geholfen. */
  erneut: boolean;
  /** Der Zurücksetzen-Knopf wurde einmal gedrückt und fragt nach. */
  fragtNach: boolean;
  /** Gelöscht wird gerade — der Spiegel braucht einen Augenblick. */
  loescht: boolean;
}

const ABSTURZ_KEY = 'pokermentor-absturz-zaehler';

/** Nach einem gelungenen Start ist ein früherer Absturz kein Muster mehr. */
export function merkeGelungenenStart(): void {
  try {
    sessionStorage.removeItem(ABSTURZ_KEY);
  } catch {
    // Speicher gesperrt – dann bleibt es beim einfachen Bildschirm.
  }
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
    wiederTitel: 'Das Neuladen hat nicht geholfen',
    wiederBody: 'Dann liegt es vermutlich an den gespeicherten Daten. Sichere sie zuerst – danach kannst du sie zurücksetzen und neu anfangen.',
    sichern: 'Daten als Datei sichern',
    zuruecksetzen: 'Daten zurücksetzen',
    wirklich: 'Wirklich alles löschen?',
    hinweis: 'Das löscht deinen Fortschritt auf diesem Gerät.',
    abbrechen: 'Doch nicht',
  },
  en: {
    title: 'Something went wrong',
    body: 'An unexpected error occurred. Your data is safely stored – just reload the app.',
    reload: 'Reload app',
    wiederTitel: 'Reloading did not help',
    wiederBody: 'Then the stored data is the likely cause. Save it first – then you can reset it and start over.',
    sichern: 'Save data to a file',
    zuruecksetzen: 'Reset data',
    wirklich: 'Really delete everything?',
    hinweis: 'This deletes your progress on this device.',
    abbrechen: 'Cancel',
  },
} as const;

/* Beide Absätze auf diesem Bildschirm sehen gleich aus — also steht der
   Stil einmal da und nicht zweimal. */
const ABSATZ = { color: 'var(--text-dim)', maxWidth: 420 } as const;

/** Fängt unerwartete Fehler ab, statt eine weiße Seite zu zeigen. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false, erneut: false, fragtNach: false, loescht: false };

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch() {
    try {
      const bisher = Number(sessionStorage.getItem(ABSTURZ_KEY) ?? '0');
      const jetzt = (Number.isFinite(bisher) ? Math.max(0, bisher) : 0) + 1;
      sessionStorage.setItem(ABSTURZ_KEY, String(jetzt));
      if (jetzt >= 2) this.setState({ erneut: true });
    } catch {
      // Ohne Zähler bleibt es beim einfachen Bildschirm – kein Beinbruch.
    }
  }

  private neuLaden = () => {
    location.hash = '#/';
    location.reload();
  };

  private sichern = () => {
    const inhalt = JSON.stringify(
      {
        app: 'pokermentor',
        notsicherung: true,
        gesichertAm: new Date().toISOString(),
        speicher: alleGespeichertenDaten(),
      },
      null,
      2,
    );
    downloadBlob(
      inhalt,
      `pokermentor-notsicherung-${new Date().toISOString().slice(0, 10)}.json`,
      'application/json',
    );
  };

  private zuruecksetzen = () => {
    this.setState({ loescht: true });
    void loescheAllesVonUns().then(() => {
      try {
        sessionStorage.removeItem(ABSTURZ_KEY);
      } catch {
        // ignorieren
      }
      this.neuLaden();
    });
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    const t = TEXTS[currentLang()];
    const { erneut, fragtNach, loescht } = this.state;

    return (
      <main
        role="alert"
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
        <div style={{ fontSize: 40 }} aria-hidden="true">♠</div>
        <h1 style={{ fontSize: 22 }}>{erneut ? t.wiederTitel : t.title}</h1>
        <p style={ABSATZ}>{erneut ? t.wiederBody : t.body}</p>

        <button className="btn primary" onClick={this.neuLaden}>{t.reload}</button>

        {erneut && !fragtNach && (
          <>
            <button className="btn" onClick={this.sichern}>{t.sichern}</button>
            <button className="btn ghost" onClick={() => this.setState({ fragtNach: true })}>
              {t.zuruecksetzen}
            </button>
          </>
        )}

        {erneut && fragtNach && (
          <>
            <p style={ABSATZ}>{t.hinweis}</p>
            <button className="btn danger" onClick={this.zuruecksetzen} disabled={loescht}>{t.wirklich}</button>
            <button className="btn ghost" onClick={() => this.setState({ fragtNach: false })}>
              {t.abbrechen}
            </button>
          </>
        )}
      </main>
    );
  }
}
