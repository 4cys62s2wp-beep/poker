import { useState } from 'react';
import { BADGES } from '../content/badges';
import { ALL_MODULES } from '../content';
import { levelTitle, useAppState, xpThreshold } from '../state/AppState';
import { CloudAccountCard } from '../components/CloudAccountCard';

export function ProfilePage() {
  const {
    data, level, setName, resetAll, exportJson, importJson,
    profiles, activeProfile, createProfile, switchProfile, deleteProfile, updateProfile,
  } = useAppState();
  const [nameInput, setNameInput] = useState(data.name);
  const [emailInput, setEmailInput] = useState(activeProfile.email ?? '');
  const [confirmReset, setConfirmReset] = useState(false);
  const [importStatus, setImportStatus] = useState<'ok' | 'error' | null>(null);
  const [showNewProfile, setShowNewProfile] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function downloadBackup() {
    const blob = new Blob([exportJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pokermentor-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
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
        <div className="eyebrow">Dein Weg</div>
        <h1>Profil & Fortschritt</h1>
        <p className="sub">
          Dein Fortschritt wird doppelt auf diesem Gerät gesichert – und mit Konto zusätzlich in der Cloud.
        </p>
      </div>

      <div className="grid cols-4" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="stat-label">Level</div>
          <div className="big-stat">{level}</div>
          <div className="small faint">{levelTitle(level)}</div>
        </div>
        <div className="card">
          <div className="stat-label">XP</div>
          <div className="big-stat">{data.xp}</div>
          <div className="small faint">nächstes Level: {nextLevelXp} XP</div>
        </div>
        <div className="card">
          <div className="stat-label">Lektionen</div>
          <div className="big-stat">
            {doneLessons}<span style={{ fontSize: 15, color: 'var(--text-dim)' }}>/{totalLessons}</span>
          </div>
          <div className="small faint">abgeschlossen</div>
        </div>
        <div className="card">
          <div className="stat-label">Abzeichen</div>
          <div className="big-stat">
            {earnedBadges}<span style={{ fontSize: 15, color: 'var(--text-dim)' }}>/{BADGES.length}</span>
          </div>
          <div className="small faint">verdient</div>
        </div>
      </div>

      <div className="grid cols-4" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="stat-label">Trainer-Antworten</div>
          <div className="big-stat">{trainerTotals.attempts}</div>
          <div className="small faint">
            {trainerTotals.attempts > 0
              ? `${Math.round((100 * trainerTotals.correct) / trainerTotals.attempts)} % richtig`
              : '–'}
          </div>
        </div>
        <div className="card">
          <div className="stat-label">Hände gespielt</div>
          <div className="big-stat">{data.handsPlayed}</div>
          <div className="small faint">{data.handsWon} gewonnen</div>
        </div>
        <div className="card">
          <div className="stat-label">Lern-Streak</div>
          <div className="big-stat">{data.streak.count > 0 ? data.streak.count : '–'}</div>
          <div className="small faint">Tage in Folge</div>
        </div>
        <div className="card">
          <div className="stat-label">Sessions erfasst</div>
          <div className="big-stat">{data.sessions.length}</div>
          <div className="small faint">im Bankroll-Tracker</div>
        </div>
      </div>

      <div className="section-title">Abzeichen</div>
      <div className="grid cols-4">
        {BADGES.map((b) => {
          const earned = !!data.badges[b.id];
          return (
            <div key={b.id} className={`card badge-tile${earned ? ' earned' : ''}`}>
              <span className="b-ico">{b.icon}</span>
              <span className="b-name">{b.title}</span>
              <span className="b-desc">{b.description}</span>
              {earned && <span className="pill ok" style={{ marginTop: 4 }}>✓ verdient</span>}
            </div>
          );
        })}
      </div>

      <div className="section-title">Konto & Synchronisation</div>
      <CloudAccountCard />

      <div className="section-title">Profile auf diesem Gerät</div>
      <div className="card" style={{ maxWidth: 560 }}>
        <p className="small muted" style={{ marginBottom: 14 }}>
          Jedes Profil hat eigenen Fortschritt, eigene XP und eigene Abzeichen – so können mehrere Personen am selben
          Gerät parallel trainieren. Der Fortschritt bleibt auch nach Neuladen oder Schließen des Browsers erhalten.
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
                    {p.name || 'Ohne Namen'} {isActive && <span className="pill gold" style={{ marginLeft: 6 }}>aktiv</span>}
                    {p.cloudUid && <span className="pill info" style={{ marginLeft: 6 }}>Cloud</span>}
                  </div>
                  {p.email && <div className="small faint">{p.email}</div>}
                </div>
              </div>
              <div className="row">
                {!isActive && (
                  <button className="btn sm" onClick={() => switchProfile(p.id)}>
                    Wechseln
                  </button>
                )}
                {profiles.length > 1 && (
                  confirmDeleteId === p.id ? (
                    <>
                      <button className="btn sm danger" onClick={() => { deleteProfile(p.id); setConfirmDeleteId(null); }}>
                        Wirklich löschen
                      </button>
                      <button className="btn sm ghost" onClick={() => setConfirmDeleteId(null)}>
                        Abbrechen
                      </button>
                    </>
                  ) : (
                    <button className="btn sm ghost" onClick={() => setConfirmDeleteId(p.id)} aria-label={`Profil ${p.name} löschen`}>
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
            + Neues Profil anlegen
          </button>
        ) : (
          <div style={{ marginTop: 14 }}>
            <div className="grid cols-2" style={{ gap: 10 }}>
              <input
                className="text-input"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Name"
                maxLength={40}
              />
              <input
                className="text-input"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="E-Mail (optional)"
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
                Profil erstellen & wechseln
              </button>
              <button className="btn sm ghost" onClick={() => setShowNewProfile(false)}>
                Abbrechen
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="section-title">Einstellungen</div>
      <div className="card" style={{ maxWidth: 520 }}>
        <div className="stat-label" style={{ marginBottom: 5 }}>Name dieses Profils</div>
        <div className="row" style={{ marginBottom: 12 }}>
          <input
            className="text-input"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="z. B. Lorenz"
            maxLength={40}
          />
        </div>
        <div className="stat-label" style={{ marginBottom: 5 }}>E-Mail (optional, für die Profil-Zuordnung)</div>
        <div className="row">
          <input
            className="text-input"
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="du@example.de"
            maxLength={120}
          />
          <button
            className="btn"
            onClick={() => {
              setName(nameInput.trim());
              updateProfile(activeProfile.id, { name: nameInput, email: emailInput });
            }}
          >
            Speichern
          </button>
        </div>

        <hr className="divider" />

        {!confirmReset ? (
          <button className="btn danger sm" onClick={() => setConfirmReset(true)}>
            Fortschritt zurücksetzen …
          </button>
        ) : (
          <div>
            <p className="small" style={{ marginBottom: 10 }}>
              Wirklich den kompletten Fortschritt <strong>dieses Profils</strong> löschen (XP, Lektionen, Abzeichen,
              Sessions)? Andere Profile bleiben unberührt. Das kann nicht rückgängig gemacht werden.
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
                Ja, alles löschen
              </button>
              <button className="btn sm" onClick={() => setConfirmReset(false)}>
                Abbrechen
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="card" style={{ maxWidth: 520, marginTop: 14 }}>
        <div style={{ fontWeight: 800, marginBottom: 6 }}>Daten sichern & übertragen</div>
        <p className="small muted" style={{ marginBottom: 12 }}>
          Alle Daten liegen nur auf diesem Gerät. Mit einem Backup nimmst du deinen Fortschritt mit – z. B. vom
          Handy auf den Laptop.
        </p>
        <div className="row wrap">
          <button className="btn sm" onClick={downloadBackup}>
            Backup herunterladen
          </button>
          <label className="btn sm" style={{ cursor: 'pointer' }}>
            Backup einspielen …
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
            Backup erfolgreich eingespielt – dein Fortschritt wurde übernommen.
          </div>
        )}
        {importStatus === 'error' && (
          <div className="feedback-box bad" style={{ marginTop: 12 }}>
            Das war keine gültige PokerMentor-Backup-Datei.
          </div>
        )}
      </div>

      <div className="card" style={{ maxWidth: 520, marginTop: 14 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Als App installieren</div>
        <p className="small muted">
          PokerMentor ist eine PWA: Öffne die Website auf dem Handy und wähle im Browser-Menü{' '}
          <strong>„Zum Startbildschirm hinzufügen“</strong> (iOS: Teilen-Symbol → „Zum Home-Bildschirm“). Danach
          startet die App wie eine native App und funktioniert auch offline.
        </p>
      </div>

      <div className="card" style={{ maxWidth: 520, marginTop: 14 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Über PokerMentor</div>
        <p className="small muted">
          Version 2.1 · Eine Lern- und Trainings-App für Poker – ohne Echtgeld und ohne Tracking. Poker ist ein
          Geschicklichkeitsspiel mit erheblichem Glücksanteil: Spiele verantwortungsvoll und setze dir Grenzen, bevor
          du an einen echten Tisch gehst (Modul „Psychologie & Bankroll“).
        </p>
      </div>

      <div className="suit-deco">♠ ♥ ♦ ♣</div>
    </div>
  );
}
