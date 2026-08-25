/* Kündigungsseite nach § 312k BGB.

   Anforderungen, die hier bewusst erfüllt werden:
   - ohne Anmeldung erreichbar (eigene öffentliche Route, im Footer verlinkt)
   - führt direkt zum Kündigungsformular, nicht zu Login oder FAQ
   - enthält ausschließlich das Formular – KEINE Rückhalteangebote,
     keine Rabatte, kein „Willst du wirklich?"
   - Bestätigungsschaltfläche mit eindeutiger Beschriftung */

import { useState, type FormEvent } from 'react';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/legal';
import { usePro } from '../lib/pro/ProProvider';

export function CancelPage() {
  const { lang } = useLang();
  const L = STR[lang];
  const { config, enabled } = usePro();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [kind, setKind] = useState<'ordinary' | 'extraordinary'>('ordinary');
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const target = config.supportEmail;

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.includes('@')) {
      setError(L.cancelMissing);
      return;
    }
    setError('');

    const kindLabel = kind === 'ordinary' ? L.cancelOrdinary : L.cancelExtraordinary;
    const body = [
      `${L.cancelName}: ${name.trim()}`,
      `${L.cancelEmail}: ${email.trim()}`,
      `${L.cancelKind}: ${kindLabel}`,
      reason.trim() ? `${L.cancelReason}: ${reason.trim()}` : '',
      note.trim() ? `${L.cancelNote}: ${note.trim()}` : '',
      '',
      new Date().toISOString(),
    ]
      .filter(Boolean)
      .join('\n');

    if (target) {
      const subject = lang === 'de' ? 'Kündigung PokerMentor Pro' : 'Cancellation PokerMentor Pro';
      location.href = `mailto:${encodeURIComponent(target)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
    setSent(true);
  }

  return (
    <div>
      <div className="page-header">
        <div className="eyebrow">{L.navLegal}</div>
        <h1>{L.cancelTitle}</h1>
        <p className="sub">{L.cancelSub}</p>
      </div>

      {!enabled ? (
        <div className="card" style={{ maxWidth: 560 }}>
          <p className="small muted">{L.cancelUnavailable}</p>
        </div>
      ) : sent ? (
        <div className="card" style={{ maxWidth: 560, borderColor: 'rgba(88,179,104,0.32)' }}>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>{L.cancelSent}</div>
          <p className="small muted">{L.cancelSentBody}</p>
          {target && <p className="small faint" style={{ marginTop: 8 }}>{L.cancelMailFallback}</p>}
        </div>
      ) : (
        <form className="card" style={{ maxWidth: 560 }} onSubmit={submit}>
          <label className="stat-label" htmlFor="c-name" style={{ display: 'block', marginBottom: 5 }}>
            {L.cancelName}
          </label>
          <input
            id="c-name"
            className="text-input"
            style={{ width: '100%', marginBottom: 13 }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            autoComplete="name"
            required
          />

          <label className="stat-label" htmlFor="c-mail" style={{ display: 'block', marginBottom: 5 }}>
            {L.cancelEmail}
          </label>
          <input
            id="c-mail"
            className="text-input"
            style={{ width: '100%', marginBottom: 13 }}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={120}
            autoComplete="email"
            required
          />

          <fieldset style={{ border: 0, padding: 0, margin: '0 0 13px' }}>
            <legend className="stat-label" style={{ marginBottom: 6 }}>{L.cancelKind}</legend>
            <label className="row small" style={{ gap: 8, marginBottom: 6, cursor: 'pointer' }}>
              <input type="radio" name="kind" checked={kind === 'ordinary'} onChange={() => setKind('ordinary')} />
              {L.cancelOrdinary}
            </label>
            <label className="row small" style={{ gap: 8, cursor: 'pointer' }}>
              <input type="radio" name="kind" checked={kind === 'extraordinary'} onChange={() => setKind('extraordinary')} />
              {L.cancelExtraordinary}
            </label>
          </fieldset>

          {kind === 'extraordinary' && (
            <>
              <label className="stat-label" htmlFor="c-reason" style={{ display: 'block', marginBottom: 5 }}>
                {L.cancelReason}
              </label>
              <input
                id="c-reason"
                className="text-input"
                style={{ width: '100%', marginBottom: 13 }}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                maxLength={300}
              />
            </>
          )}

          <label className="stat-label" htmlFor="c-note" style={{ display: 'block', marginBottom: 5 }}>
            {L.cancelNote}
          </label>
          <input
            id="c-note"
            className="text-input"
            style={{ width: '100%', marginBottom: 16 }}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={500}
          />

          {error && <div className="feedback-box bad" role="alert" style={{ marginBottom: 12 }}>{error}</div>}

          <button className="btn primary" type="submit" style={{ width: '100%', justifyContent: 'center' }}>
            {L.cancelSubmit}
          </button>
        </form>
      )}

      <div className="suit-deco">♠ ♥ ♦ ♣</div>
    </div>
  );
}
