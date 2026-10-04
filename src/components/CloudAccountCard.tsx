/* Die Kontokarte der Einstellungen: Anmeldung, Neuanlage, E-Mail-Bestätigung
   und Stand des Abgleichs. Ohne Cloud-Konfiguration gibt es sie nicht.

   Drei Dinge, die E-095 daran geändert hat:
   - Während die Cloud lädt (gemessen 1,96 s bei 4G), gab die Karte `null`
     zurück, und danach sprang eine 550 Pixel hohe Karte herein. Jetzt steht
     ein Platzhalter in fester Höhe da.
   - Der Google-Knopf folgt Googles Vorgaben für „Mit Google anmelden“: eine
     neutrale Fläche, das vierfarbige G, kein goldener Hauptknopf. Er steht
     weiter oben (er ist der einzige Weg ohne Bestätigungsmail).
   - „Anmelden“ und „Neues Konto“ sind ein Umschalter aus zwei gleichwertigen
     Feldern statt eines Umrissknopfs neben nacktem Text. */

import { useEffect, useState, type FormEvent } from 'react';
import { useCloud } from '../lib/cloud/CloudProvider';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/cloud';
import { Icon } from './Icon';
import { adresseStimmt } from '../lib/cloud/konto';
import { kontoAnbieten, loadLegalConfig, type LegalConfig } from '../lib/legal';

export function CloudAccountCard() {
  const cloud = useCloud();
  /* Firebase wird erst hier geladen, nicht beim Start der App:
     die Kontokarte ist einer der wenigen Orte, an denen ein Konto
     überhaupt eine Rolle spielt (E-043). */
  const aktiviere = cloud.aktiviere;
  useEffect(() => aktiviere(), [aktiviere]);
  const { lang } = useLang();
  const C = STR[lang];
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  /* Anbieterangaben: Ohne sie gibt es keine Neuanmeldung (siehe `kontoAnbieten`).
     Solange sie laden, gilt „nein" — ein Formular, das nach dem Laden wieder
     verschwindet, wäre schlimmer als eines, das später erscheint. */
  const [legal, setLegal] = useState<LegalConfig | null | undefined>(undefined);
  useEffect(() => {
    let lebt = true;
    loadLegalConfig().then((c) => { if (lebt) setLegal(c); });
    return () => { lebt = false; };
  }, []);
  const neuanmeldung = kontoAnbieten(legal);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loeschen, setLoeschen] = useState(false);
  const [bestaetigung, setBestaetigung] = useState('');
  const [loeschPasswort, setLoeschPasswort] = useState('');

  /* Ein Platzhalter in Kartenhöhe statt `null`: Die Karte soll nicht
     hereinspringen und alles darunter verschieben. Auch das Warten auf die
     Anbieterangaben gehört dazu — sonst käme der Umschalter „Neues Konto“
     erst danach dazu. */
  if (cloud.phase === 'checking' || (cloud.phase === 'ready' && !cloud.user && legal === undefined)) {
    return (
      <div className="card konto-platzhalter" role="status" aria-busy="true">
        <span className="sr-only">{C.laedt}</span>
      </div>
    );
  }

  /* Gibt es hier keine Cloud, gibt es auch keine Karte: Eine Anleitung für den,
     der die App betreibt, hat in der Oberfläche eines Nutzers nichts zu suchen
     („localStorage + IndexedDB", „FIREBASE_SETUP.md"). Der Betreiber sieht sie
     im Entwicklungsbetrieb. */
  if (cloud.phase === 'unavailable') {
    if (!import.meta.env.DEV) return null;
    return (
      <div className="card">
        <div style={{ fontWeight: 800, marginBottom: 6 }}>Cloud not configured (development only)</div>
        <p className="small muted">
          Without <code>public/firebase-config.json</code> the app runs in device mode. See{' '}
          <code>FIREBASE_SETUP.md</code>.
        </p>
      </div>
    );
  }

  /* Kein Netz beim Start: nicht „nicht eingerichtet", sondern ein Band, das
     sagt, dass es weitergeht, sobald das Netz da ist. */
  if (cloud.phase === 'offline') {
    return (
      <div className="card" role="status">
        <p className="small muted" style={{ margin: 0 }}>{C.offlineBand}</p>
      </div>
    );
  }

  const { user } = cloud;

  function submit(e: FormEvent) {
    e.preventDefault();
    if (mode === 'register') {
      void cloud.register(name.trim(), email.trim(), password).then((ok) => {
        if (ok) setPassword('');
      });
    } else if (mode === 'login') {
      void cloud.login(email.trim(), password).then((ok) => {
        if (ok) setPassword('');
      });
    } else {
      void cloud.resetPassword(email.trim());
    }
  }

  if (user) {
    return (
      <div className="card">
        <div className="row between wrap" style={{ marginBottom: 8 }}>
          <div style={{ fontWeight: 800 }}>{C.accountTitle}</div>
          {user.verified ? (
            <span className="pill ok"><Icon name="check" size={13} /> {C.verifiedPill}</span>
          ) : (
            <span className="pill warn">{C.unverifiedPill}</span>
          )}
        </div>
        <p className="small muted" style={{ marginBottom: 12 }}>
          {C.signedInAs} <strong>{user.name || user.email}</strong> ({user.email}).{' '}
          {user.verified ? C.verifiedInfo : C.unverifiedInfo}
        </p>

        {user.verified && cloud.lastSync && (
          <p className="small faint" style={{ marginBottom: 12 }}>
            {C.lastSync(cloud.lastSync)}
          </p>
        )}

        <div className="row wrap">
          {user.verified ? (
            <button className="btn sm" disabled={cloud.busy} onClick={() => void cloud.syncNow()}>
              {C.syncNow}
            </button>
          ) : (
            <>
              <button className="btn sm primary" disabled={cloud.busy} onClick={() => void cloud.checkVerification()}>
                {C.checkedVerification}
              </button>
              <button className="btn sm" disabled={cloud.busy} onClick={() => void cloud.resendVerification()}>
                {C.resendEmail}
              </button>
            </>
          )}
          {user.passwort && (
            <button className="btn sm ghost" disabled={cloud.busy} onClick={() => void cloud.resetPassword(user.email)}>
              {C.changePassword}
            </button>
          )}
          <button className="btn sm ghost" disabled={cloud.busy} onClick={() => void cloud.logout()}>
            {C.logout}
          </button>
        </div>

        {/* Löschen steht zuletzt und hinter einem zweiten Schritt: Wer es sucht,
            findet es; wer es nicht sucht, trifft es nicht. Bestätigt wird mit der
            eigenen Adresse — ein Haken wäre zu schnell gesetzt. */}
        <div className="konto-loeschen">
          {!loeschen ? (
            <button className="btn sm ghost" type="button" onClick={() => setLoeschen(true)}>
              {C.deleteOpen}
            </button>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void cloud.deleteAccount(bestaetigung, user.passwort ? loeschPasswort : undefined).then((ok) => {
                  if (ok) { setLoeschen(false); setBestaetigung(''); setLoeschPasswort(''); }
                });
              }}
            >
              <div className="titel">{C.deleteTitle}</div>
              <p className="small muted">{C.deleteBody}</p>
              <input
                className="text-input"
                type="email"
                value={bestaetigung}
                onChange={(e) => setBestaetigung(e.target.value)}
                placeholder={user.email}
                aria-label={C.deleteConfirmLabel}
                autoComplete="off"
                required
              />
              {user.passwort ? (
                <input
                  className="text-input"
                  type="password"
                  value={loeschPasswort}
                  onChange={(e) => setLoeschPasswort(e.target.value)}
                  placeholder={C.deletePasswordLabel}
                  aria-label={C.deletePasswordLabel}
                  autoComplete="current-password"
                  required
                />
              ) : (
                <p className="small faint">{C.deleteGoogleHint}</p>
              )}
              <div className="row wrap">
                <button
                  className="btn sm danger"
                  type="submit"
                  disabled={cloud.busy || !adresseStimmt(bestaetigung, user.email) || (user.passwort && loeschPasswort === '')}
                >
                  {C.deleteGo}
                </button>
                <button className="btn sm ghost" type="button" onClick={() => { setLoeschen(false); setBestaetigung(''); setLoeschPasswort(''); }}>
                  {C.deleteCancel}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Die Bestätigungsmail ist die einzige Stelle, an der ein Nutzer
            stecken bleiben kann, ohne dass die App etwas dagegen tun kann –
            deshalb hier der Ausweg statt nur „bitte warten". */}
        {!user.verified && (
          <p className="small faint" style={{ marginTop: 12, marginBottom: 0 }}>{C.noMailHint}</p>
        )}

        {cloud.error && <div className="feedback-box bad" style={{ marginTop: 12 }}>{cloud.error}</div>}
        {cloud.info && <div className="feedback-box good" style={{ marginTop: 12 }}>{cloud.info}</div>}
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ fontWeight: 800, marginBottom: 6 }}>
        {mode === 'register' ? C.titleRegister : mode === 'reset' ? C.titleReset : C.titleLogin}
      </div>
      <p className="small muted" style={{ marginBottom: 12 }}>
        {mode === 'register'
          ? C.introRegister
          : mode === 'reset'
            ? C.introReset
            : neuanmeldung ? C.introLogin : C.introLoginNur}
      </p>

      {/* Google steht bewusst VOR dem Formular: Es ist der einzige Weg ohne
          Bestätigungsmail (Google liefert die Adresse bereits verifiziert) und
          damit der einzige, der nicht an einem Spamfilter scheitern kann. */}
      {mode !== 'reset' && neuanmeldung && (
        <>
          <button
            className="google-knopf"
            type="button"
            disabled={cloud.busy}
            onClick={() => void cloud.loginWithGoogle()}
          >
            <GoogleG />
            <span>{C.continueWithGoogle}</span>
          </button>
          <p className="small faint" style={{ margin: '7px 0 0', textAlign: 'center' }}>
            {C.googleHint}
          </p>
          <div className="row" style={{ margin: '16px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span className="small faint" style={{ padding: '0 10px' }}>{C.orDivider}</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>
        </>
      )}

      {/* Anmelden und Neues Konto stehen gleichwertig nebeneinander. Gibt es keine
          Neuanlage (ohne Anbieterangaben), gibt es auch keinen Umschalter. */}
      {mode !== 'reset' && neuanmeldung && (
        <div className="segmented konto-umschalter" role="radiogroup" aria-label={C.umschalter}>
          {(['login', 'register'] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={mode === m}
              className={mode === m ? 'on' : ''}
              onClick={() => { setMode(m); cloud.clearMessages(); }}
            >
              {m === 'login' ? C.submitLogin : C.newAccount}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={submit}>
        {mode === 'register' && (
          <input
            className="text-input"
            style={{ marginBottom: 10, width: '100%' }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={C.namePlaceholder}
            aria-label={C.nameLabel}
            autoComplete="name"
            maxLength={40}
            required
          />
        )}
        <input
          className="text-input"
          style={{ marginBottom: 10, width: '100%' }}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={C.emailPlaceholder}
            aria-label={C.emailPlaceholder}
          autoComplete="email"
          maxLength={120}
          required
        />
        {mode !== 'reset' && (
          <input
            className="text-input"
            style={{ marginBottom: 10, width: '100%' }}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === 'register' ? C.passwordRegisterPlaceholder : C.passwordPlaceholder}
            aria-label={mode === 'register' ? C.passwordRegisterPlaceholder : C.passwordPlaceholder}
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            minLength={mode === 'register' ? 8 : undefined}
            maxLength={100}
            required
          />
        )}
        <button className="btn primary konto-senden" type="submit" disabled={cloud.busy}>
          {cloud.busy ? C.busy : mode === 'register' ? C.submitRegister : mode === 'reset' ? C.submitReset : C.submitLogin}
        </button>
        <div className="row wrap konto-weitere">
          {mode === 'reset' && (
            <button className="btn sm ghost" type="button" onClick={() => { setMode('login'); cloud.clearMessages(); }}>
              {C.toLogin}
            </button>
          )}
          {mode === 'login' && (
            <button className="btn sm ghost" type="button" onClick={() => { setMode('reset'); cloud.clearMessages(); }}>
              {C.forgotPassword}
            </button>
          )}
        </div>
      </form>

      {cloud.error && <div className="feedback-box bad" style={{ marginTop: 12 }}>{cloud.error}</div>}
      {cloud.info && <div className="feedback-box good" style={{ marginTop: 12 }}>{cloud.info}</div>}
    </div>
  );
}

/** Das vierfarbige „G“ — Googles Vorgabe für den Anmeldeknopf. */
function GoogleG() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path className="g-rot" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path className="g-blau" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path className="g-gelb" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path className="g-gruen" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}
