/* Konto-Karte für die Profilseite: Registrierung, Login, E-Mail-Verifizierung
   und Sync-Status. Ohne Cloud-Konfiguration zeigt sie den Geräte-Modus an. */

import { useState, type FormEvent } from 'react';
import { useCloud } from '../lib/cloud/CloudProvider';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/cloud';

export function CloudAccountCard() {
  const cloud = useCloud();
  const { lang } = useLang();
  const C = STR[lang];
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (cloud.phase === 'checking') return null;

  if (cloud.phase === 'unavailable') {
    return (
      <div className="card" style={{ maxWidth: 560 }}>
        <div style={{ fontWeight: 800, marginBottom: 6 }}>{C.deviceTitle}</div>
        <p className="small muted">
          {C.deviceBody1} <strong>{C.deviceStrong}</strong>{C.deviceBody2}{' '}
          <code>FIREBASE_SETUP.md</code> {C.deviceBody3}
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
          <div style={{ fontWeight: 800 }}>{C.accountTitle}</div>
          {user.verified ? (
            <span className="pill ok">{C.verifiedPill}</span>
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
          <button className="btn sm ghost" disabled={cloud.busy} onClick={() => void cloud.logout()}>
            {C.logout}
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
        {mode === 'register' ? C.titleRegister : mode === 'reset' ? C.titleReset : C.titleLogin}
      </div>
      <p className="small muted" style={{ marginBottom: 12 }}>
        {mode === 'register'
          ? C.introRegister
          : mode === 'reset'
            ? C.introReset
            : C.introLogin}
      </p>

      <form onSubmit={submit}>
        {mode === 'register' && (
          <input
            className="text-input"
            style={{ marginBottom: 10, width: '100%' }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={C.namePlaceholder}
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
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            minLength={mode === 'register' ? 8 : undefined}
            maxLength={100}
            required
          />
        )}
        <div className="row wrap">
          <button className="btn sm primary" type="submit" disabled={cloud.busy}>
            {cloud.busy ? C.busy : mode === 'register' ? C.submitRegister : mode === 'reset' ? C.submitReset : C.submitLogin}
          </button>
          {mode !== 'login' && (
            <button className="btn sm ghost" type="button" onClick={() => { setMode('login'); cloud.clearMessages(); }}>
              {C.toLogin}
            </button>
          )}
          {mode === 'login' && (
            <>
              <button className="btn sm ghost" type="button" onClick={() => { setMode('register'); cloud.clearMessages(); }}>
                {C.newAccount}
              </button>
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
