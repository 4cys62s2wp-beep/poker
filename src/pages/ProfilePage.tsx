import { useEffect, useState } from 'react';
import { ALL_MODULES } from '../content';
import { useAppState, xpThreshold } from '../state/AppState';
import { useLang, levelTitleFor } from '../i18n';
import { STR } from '../i18n/pages/profile';
import { CloudAccountCard } from '../components/CloudAccountCard';
import { ShareCard } from '../components/ShareCard';
import { downloadBlob } from '../lib/download';

export function ProfilePage() {
  const {
    data, level, setName, resetAll, exportJson, importJson,
    profiles, activeProfile, createProfile, switchProfile, deleteProfile, updateProfile,
  } = useAppState();
  const { lang, setLang, content } = useLang();
  const P = STR[lang];
  const [nameInput, setNameInput] = useState(data.name);
  const [emailInput, setEmailInput] = useState(activeProfile.email ?? '');
  const [confirmReset, setConfirmReset] = useState(false);
  const [importStatus, setImportStatus] = useState<'ok' | 'error' | null>(null);
  const [showNewProfile, setShowNewProfile] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  /* Beim Profilwechsel (auch durch Cloud-Login) die Eingabefelder auf das neue
     Profil umstellen. Ohne das würde ein Klick auf „Speichern" den Namen des
     zuvor aktiven Profils in das neue schreiben. */
  useEffect(() => {
    setNameInput(data.name);
    setEmailInput(activeProfile.email ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProfile.id]);

  function downloadBackup() {
    downloadBlob(
      exportJson(),
      `pokermentor-backup-${new Date().toISOString().slice(0, 10)}.json`,
      'application/json',
    );
  }

  function handleImportFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importJson(String(reader.result ?? ''));
      setImportStatus(ok ? 'ok' : 'error');
    };
    reader.readAsText(file);
  }

  const totalLessons = ALL_MODULES.reduce((s, m) => s + m.lessons.length, 0);
  const doneLessons = Object.keys(data.completedLessons).length;
  const earnedBadges = Object.keys(data.badges).length;

  const trainerTotals = Object.values(data.trainers).reduce(
    (acc, t) => ({ attempts: acc.attempts + t.attempts, correct: acc.correct + t.correct }),
    { attempts: 0, correct: 0 },
  );

  const nextLevelXp = xpThreshold(level + 1);

  return (
    <div>
      <div className="page-header">
        <div className="eyebrow">{P.eyebrow}</div>
        <h1>{P.title}</h1>
        <p className="sub">
          {P.sub}
        </p>
      </div>

      <div className="grid cols-4" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="stat-label">{P.statLevel}</div>
          <div className="big-stat">{level}</div>
          <div className="small faint">{levelTitleFor(level, lang)}</div>
        </div>
        <div className="card">
          <div className="stat-label">{P.statXp}</div>
          <div className="big-stat">{data.xp}</div>
          <div className="small faint">{P.nextLevel(nextLevelXp)}</div>
        </div>
        <div className="card">
          <div className="stat-label">{P.statLessons}</div>
          <div className="big-stat">
            {doneLessons}<span style={{ fontSize: 15, color: 'var(--text-dim)' }}>/{totalLessons}</span>
          </div>
          <div className="small faint">{P.lessonsDone}</div>
        </div>
        <div className="card">
          <div className="stat-label">{P.statBadges}</div>
          <div className="big-stat">
            {earnedBadges}<span style={{ fontSize: 15, color: 'var(--text-dim)' }}>/{content.badges.length}</span>
          </div>
          <div className="small faint">{P.badgesEarned}</div>
        </div>
      </div>

      <div className="grid cols-4" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="stat-label">{P.statTrainerAnswers}</div>
          <div className="big-stat">{trainerTotals.attempts}</div>
          <div className="small faint">
            {trainerTotals.attempts > 0
              ? P.pctCorrect(Math.round((100 * trainerTotals.correct) / trainerTotals.attempts))
              : '–'}
          </div>
        </div>
        <div className="card">
          <div className="stat-label">{P.statHandsPlayed}</div>
          <div className="big-stat">{data.handsPlayed}</div>
          <div className="small faint">{P.handsWon(data.handsWon)}</div>
        </div>
        <div className="card">
          <div className="stat-label">{P.statStreak}</div>
          <div className="big-stat">{data.streak.count > 0 ? data.streak.count : '–'}</div>
          <div className="small faint">{P.streakDays}</div>
        </div>
        <div className="card">
          <div className="stat-label">{P.statSessions}</div>
          <div className="big-stat">{data.sessions.length}</div>
          <div className="small faint">{P.sessionsSub}</div>
        </div>
      </div>

      <div className="section-title">{P.badgesTitle}</div>
      <div className="grid cols-4">
        {content.badges.map((b) => {
          const earned = !!data.badges[b.id];
          return (
            <div key={b.id} className={`card badge-tile${earned ? ' earned' : ''}`}>
              <span className="b-ico">{b.icon}</span>
              <span className="b-name">{b.title}</span>
              <span className="b-desc">{b.description}</span>
              {earned && <span className="pill ok" style={{ marginTop: 4 }}>{P.badgeEarnedPill}</span>}
            </div>
          );
        })}
      </div>

      <div className="section-title">{P.accountSection}</div>
      <CloudAccountCard />

      <div className="section-title">{P.profilesSection}</div>
      <div className="card" style={{ maxWidth: 560 }}>
        <p className="small muted" style={{ marginBottom: 14 }}>
          {P.profilesIntro}
        </p>

        {profiles.map((p) => {
          const isActive = p.id === activeProfile.id;
          return (
            <div key={p.id} className="row between wrap" style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div className="row">
                <span
                  style={{
                    width: 36, height: 36, borderRadius: '50%', display: 'inline-flex',
                    alignItems: 'center', justifyContent: 'center', fontWeight: 800,
                    background: `${p.color}26`, color: p.color, border: `1.5px solid ${p.color}55`,
                    flexShrink: 0,
                  }}
                >
                  {(p.name || '?').slice(0, 1).toUpperCase()}
                </span>
                <div>
                  <div style={{ fontWeight: 800 }}>
                    {p.name || P.unnamed} {isActive && <span className="pill gold" style={{ marginLeft: 6 }}>{P.activePill}</span>}
                    {p.cloudUid && <span className="pill info" style={{ marginLeft: 6 }}>{P.cloudPill}</span>}
                  </div>
                  {p.email && <div className="small faint">{p.email}</div>}
                </div>
              </div>
              <div className="row">
                {!isActive && (
                  <button className="btn sm" onClick={() => switchProfile(p.id)}>
                    {P.switchProfile}
                  </button>
                )}
                {profiles.length > 1 && (
                  confirmDeleteId === p.id ? (
                    <>
                      <button className="btn sm danger" onClick={() => { deleteProfile(p.id); setConfirmDeleteId(null); }}>
                        {P.confirmDelete}
                      </button>
                      <button className="btn sm ghost" onClick={() => setConfirmDeleteId(null)}>
                        {P.cancel}
                      </button>
                    </>
                  ) : (
                    <button className="btn sm ghost" onClick={() => setConfirmDeleteId(p.id)} aria-label={P.deleteAria(p.name)}>
                      ✕
                    </button>
                  )
                )}
              </div>
            </div>
          );
        })}

        {!showNewProfile ? (
          <button className="btn sm" style={{ marginTop: 14 }} onClick={() => setShowNewProfile(true)}>
            {P.newProfile}
          </button>
        ) : (
          <div style={{ marginTop: 14 }}>
            <div className="grid cols-2" style={{ gap: 10 }}>
              <input
                className="text-input"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={P.namePlaceholder}
                maxLength={40}
              />
              <input
                className="text-input"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder={P.emailOptionalPlaceholder}
                maxLength={120}
              />
            </div>
            <div className="row" style={{ marginTop: 10 }}>
              <button
                className="btn sm primary"
                disabled={!newName.trim()}
                onClick={() => {
                  createProfile(newName, newEmail);
                  setNewName('');
                  setNewEmail('');
                  setShowNewProfile(false);
                  setNameInput(newName.trim());
                  setEmailInput(newEmail.trim());
                }}
              >
                {P.createAndSwitch}
              </button>
              <button className="btn sm ghost" onClick={() => setShowNewProfile(false)}>
                {P.cancel}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="section-title">{P.settingsSection}</div>
      <div className="card" style={{ maxWidth: 520 }}>
        <div className="stat-label" style={{ marginBottom: 5 }}>{P.profileNameLabel}</div>
        <div className="row" style={{ marginBottom: 12 }}>
          <input
            className="text-input"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder={P.profileNamePlaceholder}
            maxLength={40}
          />
        </div>
        <div className="stat-label" style={{ marginBottom: 5 }}>{P.emailLabel}</div>
        <div className="row">
          <input
            className="text-input"
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder={P.emailPlaceholder}
            maxLength={120}
          />
          <button
            className="btn"
            onClick={() => {
              setName(nameInput.trim());
              updateProfile(activeProfile.id, { name: nameInput, email: emailInput });
            }}
          >
            {P.save}
          </button>
        </div>

        <div className="stat-label" style={{ marginTop: 12, marginBottom: 5 }}>{P.languageLabel}</div>
        <div className="row">
          <button className={lang === 'de' ? 'btn sm primary' : 'btn sm'} onClick={() => setLang('de')}>
            {P.langGerman}
          </button>
          <button className={lang === 'en' ? 'btn sm primary' : 'btn sm'} onClick={() => setLang('en')}>
            {P.langEnglish}
          </button>
        </div>

        <hr className="divider" />

        {!confirmReset ? (
          <button className="btn danger sm" onClick={() => setConfirmReset(true)}>
            {P.resetStart}
          </button>
        ) : (
          <div>
            <p className="small" style={{ marginBottom: 10 }}>
              {P.resetConfirm1} <strong>{P.resetConfirmStrong}</strong> {P.resetConfirm2}
            </p>
            <div className="row">
              <button
                className="btn danger sm"
                onClick={() => {
                  resetAll();
                  setConfirmReset(false);
                  setNameInput('');
                }}
              >
                {P.resetYes}
              </button>
              <button className="btn sm" onClick={() => setConfirmReset(false)}>
                {P.cancel}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="card" style={{ maxWidth: 520, marginTop: 14 }}>
        <div style={{ fontWeight: 800, marginBottom: 6 }}>{P.backupTitle}</div>
        <p className="small muted" style={{ marginBottom: 12 }}>
          {P.backupDesc}
        </p>
        <div className="row wrap">
          <button className="btn sm" onClick={downloadBackup}>
            {P.backupDownload}
          </button>
          <label className="btn sm" style={{ cursor: 'pointer' }}>
            {P.backupImport}
            <input
              type="file"
              accept="application/json,.json"
              style={{ display: 'none' }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleImportFile(f);
                e.target.value = '';
              }}
            />
          </label>
        </div>
        {importStatus === 'ok' && (
          <div className="feedback-box good" style={{ marginTop: 12 }}>
            {P.importOk}
          </div>
        )}
        {importStatus === 'error' && (
          <div className="feedback-box bad" style={{ marginTop: 12 }}>
            {P.importError}
          </div>
        )}
      </div>

      <ShareCard />

      <div className="card" style={{ maxWidth: 520, marginTop: 14 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>{P.installTitle}</div>
        <p className="small muted">
          {P.installBody1} <strong>{P.installStrong}</strong> {P.installBody2}
        </p>
      </div>

      <div className="card" style={{ maxWidth: 520, marginTop: 14 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>{P.aboutTitle}</div>
        <p className="small muted">
          {P.aboutBody}
        </p>
      </div>

      <div className="suit-deco">♠ ♥ ♦ ♣</div>
    </div>
  );
}
