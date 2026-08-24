/* Konto-Karte für die Profilseite: Registrierung, Login, E-Mail-Verifizierung
   und Sync-Status. Ohne Cloud-Konfiguration zeigt sie den Geräte-Modus an. */

import { useState, type FormEvent } from 'react';
import { useCloud } from '../lib/cloud/CloudProvider';

export function CloudAccountCard() {
  const cloud = useCloud();
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (cloud.phase === 'checking') return null;

  if (cloud.phase === 'unavailable') {
    return (
      <div className="card" style={{ maxWidth: 560 }}>
        <div style={{ fontWeight: 800, marginBottom: 6 }}>Geräte-Modus aktiv</div>
        <p className="small muted">
          Diese Installation läuft im <strong>Geräte-Modus</strong>: Alle Profile und Fortschritte werden doppelt auf
          diesem Gerät gesichert (localStorage + IndexedDB) und überleben Neuladen, Abstürze und das Schließen des
          Browsers. Geräteübergreifende Konten mit E-Mail-Verifizierung lassen sich mit einem kostenlosen
          Firebase-Projekt freischalten – die Anleitung steht in <code>FIREBASE_SETUP.md</code> im Projekt.
        </p>
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
      <div className="card" style={{ maxWidth: 560 }}>
        <div className="row between wrap" style={{ marginBottom: 8 }}>
          <div style={{ fontWeight: 800 }}>Dein Konto</div>
          {user.verified ? (
            <span className="pill ok">✓ E-Mail bestätigt</span>
          ) : (
            <span className="pill warn">E-Mail unbestätigt</span>
          )}
        </div>
        <p className="small muted" style={{ marginBottom: 12 }}>
          Angemeldet als <strong>{user.name || user.email}</strong> ({user.email}).{' '}
          {user.verified
            ? 'Dein Fortschritt wird automatisch verschlüsselt übertragen und in der Cloud gesichert – auf jedem Gerät, auf dem du dich anmeldest, geht es genau dort weiter.'
            : 'Bitte bestätige zuerst deine E-Mail-Adresse über den Link, den wir dir geschickt haben – erst danach wird dein Fortschritt in der Cloud gesichert.'}
        </p>

        {user.verified && cloud.lastSync && (
          <p className="small faint" style={{ marginBottom: 12 }}>
            Zuletzt synchronisiert: {new Date(cloud.lastSync).toLocaleTimeString('de-DE')} Uhr
          </p>
        )}

        <div className="row wrap">
          {user.verified ? (
            <button className="btn sm" disabled={cloud.busy} onClick={() => void cloud.syncNow()}>
              Jetzt synchronisieren
            </button>
          ) : (
            <>
              <button className="btn sm primary" disabled={cloud.busy} onClick={() => void cloud.checkVerification()}>
                Ich habe bestätigt
              </button>
              <button className="btn sm" disabled={cloud.busy} onClick={() => void cloud.resendVerification()}>
                E-Mail erneut senden
              </button>
            </>
          )}
          <button className="btn sm ghost" disabled={cloud.busy} onClick={() => void cloud.logout()}>
            Abmelden
          </button>
        </div>

        {cloud.error && <div className="feedback-box bad" style={{ marginTop: 12 }}>{cloud.error}</div>}
        {cloud.info && <div className="feedback-box good" style={{ marginTop: 12 }}>{cloud.info}</div>}
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth: 560 }}>
      <div style={{ fontWeight: 800, marginBottom: 6 }}>
        {mode === 'register' ? 'Konto erstellen' : mode === 'reset' ? 'Passwort zurücksetzen' : 'Anmelden'}
      </div>
      <p className="small muted" style={{ marginBottom: 12 }}>
        {mode === 'register'
          ? 'Mit einem Konto (E-Mail + Verifizierung) wird dein Fortschritt in der Cloud gesichert und auf all deinen Geräten synchronisiert.'
          : mode === 'reset'
            ? 'Wir schicken dir einen Link zum Zurücksetzen deines Passworts.'
            : 'Melde dich an, um deinen Fortschritt geräteübergreifend zu synchronisieren.'}
      </p>

      <form onSubmit={submit}>
        {mode === 'register' && (
          <input
            className="text-input"
            style={{ marginBottom: 10, width: '100%' }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Dein Name"
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
          placeholder="E-Mail-Adresse"
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
            placeholder={mode === 'register' ? 'Passwort (mind. 8 Zeichen)' : 'Passwort'}
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            minLength={mode === 'register' ? 8 : undefined}
            maxLength={100}
            required
          />
        )}
        <div className="row wrap">
          <button className="btn sm primary" type="submit" disabled={cloud.busy}>
            {cloud.busy ? 'Einen Moment …' : mode === 'register' ? 'Konto erstellen' : mode === 'reset' ? 'Link schicken' : 'Anmelden'}
          </button>
          {mode !== 'login' && (
            <button className="btn sm ghost" type="button" onClick={() => { setMode('login'); cloud.clearMessages(); }}>
              Zur Anmeldung
            </button>
          )}
          {mode === 'login' && (
            <>
              <button className="btn sm ghost" type="button" onClick={() => { setMode('register'); cloud.clearMessages(); }}>
                Neues Konto
              </button>
              <button className="btn sm ghost" type="button" onClick={() => { setMode('reset'); cloud.clearMessages(); }}>
                Passwort vergessen?
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
