/* Erster Start: Sprache wählen, Name eintragen, loslegen.
   Erscheint nur, solange noch keine Sprache gespeichert ist. */

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';
import { useAppState } from '../state/AppState';
import { useLang, type Lang } from '../i18n';

const TEXT: Record<Lang, {
  welcome: string; tagline: string; pickLang: string; nameLabel: string;
  namePlaceholder: string; go: string; skip: string; back: string; langNote: string;
}> = {
  de: {
    welcome: 'Willkommen bei PokerMentor',
    tagline: 'Deine Poker-Schule: Strategien lernen, Skills trainieren, besser gewinnen – ohne Echtgeld.',
    pickLang: 'Sprache wählen',
    nameLabel: 'Wie dürfen wir dich nennen?',
    namePlaceholder: 'Dein Name (optional)',
    go: 'Los geht’s',
    skip: 'Überspringen',
    back: 'Zurück',
    langNote: 'Du kannst die Sprache jederzeit im Profil ändern.',
  },
  en: {
    welcome: 'Welcome to PokerMentor',
    tagline: 'Your poker school: learn strategy, train your skills, win more – no real money involved.',
    pickLang: 'Choose your language',
    nameLabel: 'What should we call you?',
    namePlaceholder: 'Your name (optional)',
    go: 'Let’s go',
    skip: 'Skip',
    back: 'Back',
    langNote: 'You can change the language anytime in your profile.',
  },
};

/** Fokussierbare Elemente im Dialog (in DOM-Reihenfolge). */
const FOCUSABLE = 'button:not([disabled]), input:not([disabled]), select, textarea, a[href], [tabindex]:not([tabindex="-1"])';

export function Onboarding() {
  const { lang, setLang, firstRun, finishOnboarding } = useLang();
  const { data, setName, updateProfile, activeProfile } = useAppState();
  const [step, setStep] = useState<'lang' | 'name'>('lang');
  const [name, setNameInput] = useState(data.name);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Solange der Dialog offen ist, ist der Rest der App weder fokussierbar noch
  // für Screenreader sichtbar. inert deckt Tastatur + AT ab, aria-hidden ist der
  // Fallback für ältere Browser (Safari < 15.5). Der Dialog selbst hängt per
  // Portal an <body>, liegt also außerhalb von #root.
  useEffect(() => {
    if (!firstRun) return;
    const root = document.getElementById('root');
    if (!root) return;
    root.setAttribute('inert', '');
    root.setAttribute('aria-hidden', 'true');
    return () => {
      root.removeAttribute('inert');
      root.removeAttribute('aria-hidden');
    };
  }, [firstRun]);

  // Startfokus: erster Button des Sprachschritts. Im Namensschritt übernimmt
  // das Eingabefeld (autoFocus) den Fokus beim Einhängen.
  useEffect(() => {
    if (!firstRun || step !== 'lang') return;
    dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
  }, [firstRun, step]);

  if (!firstRun) return null;
  const T = TEXT[lang];

  /** Fokusfalle: Tab und Shift+Tab laufen im Kreis durch den Dialog.
      Kein Escape-to-close – eine Sprache muss gewählt werden. */
  function trapFocus(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'Tab') return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const items = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    const inside = dialog.contains(active);
    if (e.shiftKey ? active === first || !inside : active === last || !inside) {
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
    }
  }

  function chooseLang(l: Lang) {
    setLang(l);
    // Wer schon einen Namen hat (bestehende Installation), braucht Schritt 2 nicht.
    if (data.name.trim()) {
      finishOnboarding();
    } else {
      setStep('name');
    }
  }

  function done(withName: boolean) {
    const clean = name.trim();
    if (withName && clean) {
      setName(clean);
      updateProfile(activeProfile.id, { name: clean });
    }
    finishOnboarding();
  }

  return createPortal(
    <div
      ref={dialogRef}
      onKeyDown={trapFocus}
      role="dialog"
      aria-modal="true"
      aria-label={T.welcome}
      style={{
        position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: 20,
        background: 'radial-gradient(90rem 60rem at 50% -10%, #17402f 0%, #0b100d 62%)',
      }}
    >
      <div className="card" style={{ maxWidth: 460, width: '100%', textAlign: 'center', padding: '34px 26px' }}>
        <span
          className="spade"
          style={{
            width: 52, height: 52, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 16, background: 'linear-gradient(135deg, #1d5a43, #123527)',
            border: '1px solid rgba(212,175,94,0.35)', marginBottom: 14, color: 'var(--auszeichnung)',
          }}
        >
          <Icon name="spade" size={26} />
        </span>
        <h1 style={{ fontSize: 26, marginBottom: 8 }}>{T.welcome}</h1>
        <p className="muted" style={{ marginBottom: 24, fontSize: 14.5 }}>{T.tagline}</p>

        {step === 'lang' && (
          <>
            <div className="stat-label" style={{ marginBottom: 10 }}>{T.pickLang}</div>
            <div style={{ display: 'grid', gap: 10 }}>
              <button className="btn primary" style={{ justifyContent: 'center', fontSize: 16 }} onClick={() => chooseLang('de')}>
                <span aria-hidden="true">🇩🇪&nbsp;</span> Deutsch
              </button>
              <button className="btn" style={{ justifyContent: 'center', fontSize: 16 }} onClick={() => chooseLang('en')}>
                <span aria-hidden="true">🇬🇧&nbsp;</span> English
              </button>
            </div>
            <p className="small faint" style={{ marginTop: 16 }}>{T.langNote}</p>
          </>
        )}

        {step === 'name' && (
          <>
            <div className="stat-label" style={{ marginBottom: 10 }}>{T.nameLabel}</div>
            <input
              className="text-input"
              style={{ width: '100%', marginBottom: 14, textAlign: 'center' }}
              value={name}
              maxLength={40}
              placeholder={T.namePlaceholder}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && done(true)}
              autoFocus
            />
            <div style={{ display: 'grid', gap: 10 }}>
              <button className="btn primary" style={{ justifyContent: 'center' }} onClick={() => done(true)}>
                {T.go}
              </button>
              <div className="row" style={{ justifyContent: 'center' }}>
                <button className="btn sm ghost" onClick={() => setStep('lang')}>{T.back}</button>
                <button className="btn sm ghost" onClick={() => done(false)}>{T.skip}</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
