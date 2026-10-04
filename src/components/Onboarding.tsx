/* Erster Start: Sprache wählen, Name eintragen, loslegen.
   Erscheint nur, solange noch keine Sprache gespeichert ist. */

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDialogTastatur } from '../lib/dialog/tastatur';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';
import { Marke } from './Marke';
import { useAppState } from '../state/AppState';
import { useLang, type Lang } from '../i18n';
import { cloudKonfiguriert } from '../lib/cloud/cloud';
import { kontoAnbieten, loadLegalConfig } from '../lib/legal';
import { speichereZiel, type Ziel } from '../lib/ziel';

const TEXT: Record<Lang, {
  welcome: string; tagline: string; pickLang: string; nameLabel: string;
  namePlaceholder: string; next: string; skip: string; back: string; langNote: string;
  haveAccount: string; goalLabel: string; goalLearn: string; goalNight: string; goalNote: string;
}> = {
  de: {
    welcome: 'Willkommen bei PokerMentor',
    tagline: 'Poker lernen, ganz ohne Echtgeld: Die App rechnet vor, was sich lohnt, und führt am Pokerabend Blinds, Uhr und Chips.',
    pickLang: 'Sprache wählen',
    nameLabel: 'Wie dürfen wir dich nennen?',
    namePlaceholder: 'Dein Name (optional)',
    next: 'Weiter',
    skip: 'Überspringen',
    back: 'Zurück',
    langNote: 'Du kannst die Sprache jederzeit in den Einstellungen ändern.',
    haveAccount: 'Ich habe schon ein Konto',
    goalLabel: 'Was hast du vor?',
    goalLearn: 'Poker lernen',
    goalNight: 'Pokerabende leiten',
    goalNote: 'Beides steht dir offen. Das hier ändert nur, was die Startseite dir erklärt.',
  },
  en: {
    welcome: 'Welcome to PokerMentor',
    tagline: 'Learn poker with no real money: the app works out what is worth it, and runs blinds, clock and chips on poker night.',
    pickLang: 'Choose your language',
    nameLabel: 'What should we call you?',
    namePlaceholder: 'Your name (optional)',
    next: 'Next',
    skip: 'Skip',
    back: 'Back',
    langNote: 'You can change the language anytime in the settings.',
    haveAccount: 'I already have an account',
    goalLabel: 'What are you here for?',
    goalLearn: 'Learn poker',
    goalNight: 'Run poker nights',
    goalNote: 'Both stay open to you. This only changes what the start page explains.',
  },
};

/** Fokussierbare Elemente im Dialog (in DOM-Reihenfolge). */

export function Onboarding() {
  const { lang, setLang, firstRun, finishOnboarding } = useLang();
  const { data, setName, updateProfile, activeProfile } = useAppState();
  const [step, setStep] = useState<'lang' | 'name' | 'ziel'>('lang');
  const navigate = useNavigate();
  /* „Ich habe schon ein Konto" nur, wo es eines geben kann: mit
     Anbieterangaben (sonst steht keine Anmeldung da) und mit Cloud. Bis das
     geklärt ist, steht der Link nicht da — ein Link, der wieder verschwindet,
     ist schlimmer als einer, der später erscheint. */
  const [kontoLink, setKontoLink] = useState(false);
  useEffect(() => {
    let lebt = true;
    Promise.all([loadLegalConfig(), cloudKonfiguriert()])
      .then(([legal, cloud]) => { if (lebt) setKontoLink(kontoAnbieten(legal) && cloud); })
      .catch(() => { /* Ohne Auskunft kein Link. */ });
    return () => { lebt = false; };
  }, []);
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

  /* Startfokus, Fokusfalle — aber **kein** Escape: Eine Sprache muss gewählt
     werden, sonst steht die App in der falschen da. Das ist die eine
     begründete Ausnahme von der Regel aus E-058.
     Im Namensschritt übernimmt das Eingabefeld (autoFocus) den Fokus. */
  useDialogTastatur(dialogRef, { aktiv: firstRun, startfokus: step === 'lang' });

  if (!firstRun) return null;
  const T = TEXT[lang];


  function chooseLang(l: Lang) {
    setLang(l);
    // Wer schon einen Namen hat (bestehende Installation), braucht Schritt 2 nicht.
    if (data.name.trim()) {
      finishOnboarding();
    } else {
      setStep('name');
    }
  }

  /** Name übernehmen und zum optionalen Ziel-Schritt. */
  function weiter() {
    const clean = name.trim();
    if (clean) {
      setName(clean);
      updateProfile(activeProfile.id, { name: clean });
    }
    setStep('ziel');
  }

  function waehleZiel(z: Ziel | null) {
    if (z) speichereZiel(z);
    finishOnboarding();
  }

  /** Zum Konto: Der Dialog schließt, die Profilseite öffnet sich an der
   *  Kontokarte und setzt den Fokus dorthin. */
  function zumKonto() {
    finishOnboarding();
    navigate('/profil/einstellungen?konto=1');
  }

  return createPortal(
    <div
      ref={dialogRef}
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
        <div style={{ marginBottom: 14 }}><Marke groesse={52} /></div>
        <h1 style={{ fontSize: '1.625rem', marginBottom: 8 }}>{T.welcome}</h1>
        <p className="muted" style={{ marginBottom: 24, fontSize: 'var(--fs-fliesstext)' }}>{T.tagline}</p>

        {step === 'lang' && (
          <>
            <div className="stat-label" style={{ marginBottom: 10 }}>{T.pickLang}</div>
            <div style={{ display: 'grid', gap: 10 }}>
              <button className="btn" style={{ justifyContent: 'center', fontSize: 'var(--fs-fliesstext)' }} onClick={() => chooseLang('de')}>
                <span aria-hidden="true">🇩🇪&nbsp;</span> Deutsch
              </button>
              <button className="btn" style={{ justifyContent: 'center', fontSize: 'var(--fs-fliesstext)' }} onClick={() => chooseLang('en')}>
                <span aria-hidden="true">🇬🇧&nbsp;</span> English
              </button>
            </div>
            <p className="small faint" style={{ marginTop: 16 }}>{T.langNote}</p>
            {kontoLink && (
              <button className="btn sm ghost" type="button" style={{ marginTop: 6 }} onClick={zumKonto}>
                {T.haveAccount}
              </button>
            )}
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
              onKeyDown={(e) => e.key === 'Enter' && weiter()}
              autoFocus
            />
            <div style={{ display: 'grid', gap: 10 }}>
              <button className="btn primary" style={{ justifyContent: 'center' }} onClick={weiter}>
                {T.next}
              </button>
              <div className="row" style={{ justifyContent: 'center' }}>
                <button className="btn sm ghost" onClick={() => setStep('lang')}>{T.back}</button>
                <button className="btn sm ghost" onClick={() => waehleZiel(null)}>{T.skip}</button>
              </div>
            </div>
          </>
        )}

        {/* Der dritte Schritt ist freiwillig und folgenlos für alles außer die
            Erklärungen der Startseite (lib/ziel.ts). Zwei gleichwertige Wege,
            kein vorbelegter. */}
        {step === 'ziel' && (
          <>
            <div className="stat-label" style={{ marginBottom: 10 }}>{T.goalLabel}</div>
            <div style={{ display: 'grid', gap: 10 }}>
              <button
                className="btn" style={{ justifyContent: 'center', fontSize: 'var(--fs-fliesstext)' }}
                onClick={() => waehleZiel('lernen')} autoFocus
              >
                {T.goalLearn}
              </button>
              <button
                className="btn" style={{ justifyContent: 'center', fontSize: 'var(--fs-fliesstext)' }}
                onClick={() => waehleZiel('abend')}
              >
                {T.goalNight}
              </button>
              <div className="row" style={{ justifyContent: 'center' }}>
                <button className="btn sm ghost" onClick={() => setStep('name')}>{T.back}</button>
                <button className="btn sm ghost" onClick={() => waehleZiel(null)}>{T.skip}</button>
              </div>
            </div>
            <p className="small faint" style={{ marginTop: 16 }}>{T.goalNote}</p>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
