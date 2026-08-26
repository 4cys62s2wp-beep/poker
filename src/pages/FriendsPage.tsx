/* Freundes-Seite (/freunde): Liste mit Online-Punkten, eingehende Anfragen,
   Freund per Code hinzufügen und der eigene Code zum Weitergeben.

   Ohne Cloud-Konfiguration oder ohne (bestätigtes) Konto erklärt die Seite
   ruhig, was fehlt – sie zeigt nie eine kaputte oder leere Oberfläche. */

import { useEffect, useState, type FormEvent } from 'react';
import { STR as NAV } from '../i18n/pages/layout';
import { BackLink } from '../components/ui';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { useCloud } from '../lib/cloud/CloudProvider';
import { useSocial } from '../lib/social/SocialProvider';
import { isOnline, type FriendEntry, type RequestEntry } from '../lib/social/protocol';
import type { SocialFailure } from '../lib/social/friends';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/friends';

export function FriendsPage() {
  const cloud = useCloud();
  const social = useSocial();
  const { lang } = useLang();
  const F = STR[lang];

  const [code, setCode] = useState('');
  const [message, setMessage] = useState<{ tone: 'good' | 'bad'; text: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);
  // Lokale Uhr: entscheidet zusammen mit lastSeen über den grünen Punkt.
  const now = Date.now();

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(t);
  }, [copied]);

  const header = (
    <>
      <BackLink to="/profil" label={NAV[lang].profile} />
      <div className="page-header">
        <div className="eyebrow">{F.eyebrow}</div>
        <h1>{F.title}</h1>
        <p className="sub">{F.sub}</p>
      </div>
    </>
  );

  /* --- Zustände ohne Freundesfunktion ---------------------------------- */

  if (cloud.phase === 'checking') return <div>{header}</div>;

  if (cloud.phase === 'unavailable') {
    return (
      <div>
        {header}
        <InfoCard title={F.unconfiguredTitle} body={F.unconfiguredBody} />
      </div>
    );
  }

  if (!cloud.user) {
    return (
      <div>
        {header}
        <InfoCard title={F.offlineTitle} body={F.offlineBody}>
          <Link to="/profil" className="btn sm primary" style={{ textDecoration: 'none' }}>
            {F.offlineCta}
          </Link>
        </InfoCard>
      </div>
    );
  }

  if (!cloud.user.verified) {
    return (
      <div>
        {header}
        <InfoCard title={F.unverifiedTitle} body={F.unverifiedBody}>
          <Link to="/profil" className="btn sm" style={{ textDecoration: 'none' }}>
            {F.offlineCta}
          </Link>
        </InfoCard>
      </div>
    );
  }

  /* --- Aktionen -------------------------------------------------------- */

  function describe(reason: SocialFailure): string {
    switch (reason) {
      case 'invalid-code':
        return F.errInvalidCode;
      case 'self':
        return F.errSelf;
      case 'unknown-code':
        return F.errUnknownCode;
      case 'already-friends':
        return F.errAlreadyFriends;
      case 'already-sent':
        return F.errAlreadySent;
      case 'unavailable':
        return F.errUnavailable;
      case 'error':
        return F.errGeneric;
    }
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!code.trim() || social.busy) return;
    setMessage(null);
    void social.sendRequest(code).then((res) => {
      if (res.ok) {
        setCode('');
        setMessage({ tone: 'good', text: res.relation === 'friends' ? F.msgFriends : F.msgSent });
      } else {
        setMessage({ tone: 'bad', text: describe(res.reason) });
      }
    });
  }

  function copyCode() {
    const write = navigator.clipboard?.writeText(social.myCode);
    if (write) {
      void write.then(() => setCopied(true)).catch(() => setCopied(false));
    }
  }

  const onlineNow = social.friends.filter((f) => isOnline(f.lastSeen, now)).length;

  /* --- Hauptansicht ---------------------------------------------------- */

  return (
    <div>
      {header}

      {social.requests.length > 0 && (
        <>
          <div className="section-title">{F.requestsTitle}</div>
          <p className="small muted" style={{ marginTop: -6, marginBottom: 12 }}>{F.requestsSub}</p>
          <div className="grid cols-2" style={{ marginBottom: 22 }}>
            {social.requests.map((r) => (
              <RequestRow
                key={r.uid}
                request={r}
                unknown={F.unknownPerson}
                busy={social.busy}
                actions={
                  <>
                    <button className="btn sm success" disabled={social.busy} onClick={() => void social.accept(r)}>
                      <Icon name="check" size={14} /> {F.accept}
                    </button>
                    <button className="btn sm ghost" disabled={social.busy} onClick={() => void social.decline(r)}>
                      {F.decline}
                    </button>
                  </>
                }
              />
            ))}
          </div>
        </>
      )}

      <div className="row between wrap" style={{ marginBottom: 10 }}>
        <div className="section-title" style={{ marginBottom: 0 }}>{F.listTitle}</div>
        {social.friends.length > 0 && (
          <span className="small faint">{F.listCount(onlineNow, social.friends.length)}</span>
        )}
      </div>

      {social.friends.length === 0 ? (
        <div className="card" style={{ maxWidth: 620, marginBottom: 22 }}>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>{F.emptyTitle}</div>
          <p className="small muted" style={{ marginBottom: 12 }}>{F.emptyBody}</p>
          <ol className="small muted" style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 4 }}>
            <li>{F.emptyStep1}</li>
            <li>{F.emptyStep2}</li>
            <li>{F.emptyStep3}</li>
          </ol>
        </div>
      ) : (
        <div className="grid cols-2" style={{ marginBottom: 22 }}>
          {social.friends.map((f) => (
            <FriendRow
              key={f.uid}
              friend={f}
              now={now}
              strings={F}
              busy={social.busy}
              confirming={confirmRemove === f.uid}
              onAskRemove={() => setConfirmRemove(f.uid)}
              onCancelRemove={() => setConfirmRemove(null)}
              onRemove={() => {
                setConfirmRemove(null);
                void social.remove(f);
              }}
            />
          ))}
        </div>
      )}

      {social.outgoing.length > 0 && (
        <>
          <div className="section-title">{F.outgoingTitle}</div>
          <p className="small muted" style={{ marginTop: -6, marginBottom: 12 }}>{F.outgoingSub}</p>
          <div className="grid cols-2" style={{ marginBottom: 22 }}>
            {social.outgoing.map((r) => (
              <RequestRow
                key={r.uid}
                request={r}
                unknown={F.unknownPerson}
                busy={social.busy}
                pendingLabel={F.pendingPill}
                actions={
                  <button className="btn sm ghost" disabled={social.busy} onClick={() => void social.cancel(r)}>
                    {F.cancelRequest}
                  </button>
                }
              />
            ))}
          </div>
        </>
      )}

      <div className="grid cols-2" style={{ marginBottom: 18 }}>
        {/* Freund hinzufügen */}
        <div className="card">
          <div style={{ fontWeight: 800, marginBottom: 6 }}>{F.addTitle}</div>
          <form onSubmit={submit}>
            <label className="small muted" htmlFor="friend-code-input" style={{ display: 'block', marginBottom: 6 }}>
              {F.addLabel}
            </label>
            <input
              id="friend-code-input"
              className="text-input"
              style={{ width: '100%', marginBottom: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={F.addPlaceholder}
              maxLength={12}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              inputMode="text"
            />
            <div className="row wrap">
              <button className="btn sm primary" type="submit" disabled={social.busy || !code.trim()}>
                {F.addButton}
              </button>
              <span className="small faint">{F.addHint}</span>
            </div>
          </form>
          {message && (
            <div className={`feedback-box ${message.tone === 'good' ? 'good' : 'bad'}`} style={{ marginTop: 12 }}>
              {message.text}
            </div>
          )}
        </div>

        {/* Eigener Code */}
        <div className="card">
          <div style={{ fontWeight: 800, marginBottom: 6 }}>{F.myCodeTitle}</div>
          <p className="small muted" style={{ marginBottom: 12 }}>{F.myCodeSub}</p>
          <div className="row wrap">
            <code
              style={{
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: '0.12em',
                color: 'var(--gold-bright)',
                background: 'var(--gold-dim)',
                border: '1px solid rgba(212,175,94,0.3)',
                borderRadius: 10,
                padding: '8px 12px',
              }}
            >
              {social.myCode || '––––––––'}
            </code>
            <button className="btn sm" onClick={copyCode} aria-label={F.copyAria} disabled={!social.myCode}>
              {copied ? (
                <>
                  <Icon name="check" size={14} /> {F.copied}
                </>
              ) : (
                F.copy
              )}
            </button>
          </div>
        </div>
      </div>

      <p className="small faint" style={{ maxWidth: 620 }}>{F.privacyNote}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function InfoCard({ title, body, children }: { title: string; body: string; children?: React.ReactNode }) {
  return (
    <div className="card" style={{ maxWidth: 620 }}>
      <div style={{ fontWeight: 800, marginBottom: 6 }}>{title}</div>
      <p className="small muted" style={{ marginBottom: children ? 12 : 0 }}>{body}</p>
      {children}
    </div>
  );
}

/** Grüner Punkt = in den letzten zwei Minuten ein Lebenszeichen. */
function StatusDot({ online }: { online: boolean }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 9,
        height: 9,
        borderRadius: '50%',
        flexShrink: 0,
        background: online ? 'var(--ok)' : 'var(--text-faint)',
        boxShadow: online ? '0 0 7px rgba(88,179,104,0.9)' : 'none',
      }}
    />
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 34,
        height: 34,
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: 14,
        flexShrink: 0,
        background: 'var(--gold-dim)',
        color: 'var(--gold-bright)',
        border: '1px solid rgba(212,175,94,0.3)',
      }}
    >
      {name ? name.slice(0, 1).toUpperCase() : <Icon name="profile" size={16} />}
    </span>
  );
}

function FriendRow({
  friend,
  now,
  strings,
  busy,
  confirming,
  onAskRemove,
  onCancelRemove,
  onRemove,
}: {
  friend: FriendEntry;
  now: number;
  strings: (typeof STR)['de'];
  busy: boolean;
  confirming: boolean;
  onAskRemove: () => void;
  onCancelRemove: () => void;
  onRemove: () => void;
}) {
  const online = isOnline(friend.lastSeen, now);
  const name = friend.name || strings.unknownPerson;
  return (
    <div className="card">
      <div className="row between wrap">
        <div className="row" style={{ minWidth: 0 }}>
          <Avatar name={friend.name} />
          <div style={{ minWidth: 0 }}>
            <div
              style={{ fontWeight: 750, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {name}
            </div>
            <div className="row small" style={{ gap: 6, color: online ? '#90d69c' : 'var(--text-faint)' }}>
              <StatusDot online={online} />
              {online ? strings.onlinePill : strings.offlinePill}
            </div>
          </div>
        </div>
        {confirming ? (
          <div className="row wrap">
            <button className="btn sm danger" disabled={busy} onClick={onRemove}>
              {strings.confirmRemoveYes}
            </button>
            <button className="btn sm ghost" onClick={onCancelRemove}>
              {strings.confirmRemoveNo}
            </button>
          </div>
        ) : (
          <button
            className="btn sm ghost"
            disabled={busy}
            onClick={onAskRemove}
            aria-label={strings.removeAria(name)}
          >
            {strings.remove}
          </button>
        )}
      </div>
    </div>
  );
}

function RequestRow({
  request,
  unknown,
  actions,
  pendingLabel,
}: {
  request: RequestEntry;
  unknown: string;
  busy: boolean;
  actions: React.ReactNode;
  pendingLabel?: string;
}) {
  const name = request.name || unknown;
  return (
    <div className="card">
      <div className="row between wrap">
        <div className="row" style={{ minWidth: 0 }}>
          <Avatar name={request.name} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 750, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {name}
            </div>
            {pendingLabel && <span className="pill" style={{ marginTop: 2 }}>{pendingLabel}</span>}
          </div>
        </div>
        <div className="row wrap">{actions}</div>
      </div>
    </div>
  );
}
