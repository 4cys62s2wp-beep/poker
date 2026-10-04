/* Konto-Karte für die Profilseite: Registrierung, Login, E-Mail-Verifizierung
   und Sync-Status. Ohne Cloud-Konfiguration zeigt sie den Geräte-Modus an. */

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

  if (cloud.phase === 'checking') return null;

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
            className="btn primary"
            type="button"
            style={{ width: '100%' }}
            disabled={cloud.busy}
            onClick={() => void cloud.loginWithGoogle()}
          >
            {C.continueWithGoogle}
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
        <div className="row wrap">
          <button className="btn sm" type="submit" disabled={cloud.busy}>
            {cloud.busy ? C.busy : mode === 'register' ? C.submitRegister : mode === 'reset' ? C.submitReset : C.submitLogin}
          </button>
          {mode !== 'login' && (
            <button className="btn sm ghost" type="button" onClick={() => { setMode('login'); cloud.clearMessages(); }}>
              {C.toLogin}
            </button>
          )}
          {mode === 'login' && (
            <>
              {neuanmeldung && (
                <button className="btn sm ghost" type="button" onClick={() => { setMode('register'); cloud.clearMessages(); }}>
                  {C.newAccount}
                </button>
              )}
              <button className="btn sm ghost" type="button" onClick={() => { setMode('reset'); cloud.clearMessages(); }}>
                {C.forgotPassword}
              </button>
            </>
          )}
        </div>
      </form>

      {cloud.error && <div className="feedback-box bad" style={{ marginTop: 12 }}>{cloud.error}</div>}
      {cloud.info && <div className="feedback-box good" style={{ marginTop: 12 }}>{cloud.info}</div>}
    </div>
  );
}
