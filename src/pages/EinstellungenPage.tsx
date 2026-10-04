/* Die Einstellungen — eine gruppierte Liste.
   ===========================================

   Bis E-095 war alles Einstellbare mitten im Profil: 5280 Pixel lang, die
   Farbwahl bei 3552, „Fortschritt zurücksetzen“ bei 4042 direkt darunter und
   die Kontokarte dazwischen. Das Profil zeigt jetzt Identität und Fortschritt;
   hier steht, was man einstellt. Die Reihenfolge folgt der Häufigkeit — und die
   zerstörende Aktion steht ganz am Ende, hinter dem Backup, mit der Frage
   „Vorher sichern?“ in der Bestätigung selbst. */

import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAppState } from '../state/AppState';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/einstellungen';
import { STR as PROFIL } from '../i18n/pages/profile';
import { MODI } from '../lib/design/modus';
import { useFarbmodus } from '../lib/design/FarbmodusProvider';
import { CloudAccountCard } from '../components/CloudAccountCard';
import { ErinnerungKarte } from '../components/ErinnerungKarte';
import { InstallierenKarte } from '../components/InstallierenKarte';
import { ShareCard } from '../components/ShareCard';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/ui';
import { downloadBlob } from '../lib/download';
import { heuteIso } from '../lib/bankroll';
import { useCloud } from '../lib/cloud/CloudProvider';
import { loadLegalConfig, type LegalConfig } from '../lib/legal';
import { speicherort } from '../lib/speicherort';
import { feedbackMail } from '../lib/feedback';
import { zeichenFuer } from '../lib/zeichen';
import { STR as LEGAL } from '../i18n/pages/legal';

export function EinstellungenPage() {
  const {
    data, setName, resetAll, exportJson, importJson,
    profiles, activeProfile, createProfile, switchProfile, deleteProfile, updateProfile,
  } = useAppState();
  const { lang, setLang } = useLang();
  const L = STR[lang];
  const P = PROFIL[lang];
  const { modus, setzeModus } = useFarbmodus();
  const cloud = useCloud();

  /* `?konto=1` kommt aus dem Willkommensdialog („Ich habe schon ein Konto“):
     Die Seite springt zur Kontokarte und setzt den Fokus dorthin. Zwei Bilder
     warten, weil die Scrollverwaltung nach einem Seitenwechsel selbst nach
     oben scrollt und die Überschrift fokussiert — danach erst gilt unser Ziel. */
  const [suche] = useSearchParams();
  const zumKonto = suche.has('konto');
  useEffect(() => {
    if (!zumKonto) return undefined;
    let zweites = 0;
    const erstes = requestAnimationFrame(() => {
      zweites = requestAnimationFrame(() => {
        const ziel = document.getElementById('konto');
        ziel?.scrollIntoView({ block: 'start' });
        ziel?.focus({ preventScroll: true });
      });
    });
    return () => { cancelAnimationFrame(erstes); cancelAnimationFrame(zweites); };
  }, [zumKonto]);

  const [nameInput, setNameInput] = useState(data.name);
  const [gespeichert, setGespeichert] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [importStatus, setImportStatus] = useState<'ok' | 'error' | null>(null);
  const [neuesProfil, setNeuesProfil] = useState(false);
  const [neuerName, setNeuerName] = useState('');
  const [loeschId, setLoeschId] = useState<string | null>(null);
  const [legal, setLegal] = useState<LegalConfig | null>(null);
  useEffect(() => {
    let lebt = true;
    loadLegalConfig().then((c) => { if (lebt) setLegal(c); });
    return () => { lebt = false; };
  }, []);

  /* Beim Profilwechsel (auch durch Anmeldung) das Namensfeld umstellen. Ohne das
     würde „Speichern“ den Namen des zuvor aktiven Profils in das neue schreiben. */
  useEffect(() => {
    setNameInput(data.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProfile.id]);

  const ort = speicherort(cloud.user);
  const speicherSatz = ort === 'konto' ? P.speicherKonto : ort === 'konto-offen' ? P.speicherKontoOffen : P.speicherGeraet;

  function backup() {
    downloadBlob(exportJson(), `pokermentor-backup-${heuteIso()}.json`, 'application/json');
  }

  function dateiLesen(file: File) {
    const reader = new FileReader();
    reader.onload = () => setImportStatus(importJson(String(reader.result ?? '')) ? 'ok' : 'error');
    /* Ohne diese Zeile passiert bei einer unlesbaren Datei gar nichts: kein
       Haken, kein Fehler, keine Erklärung. „Nichts passiert“ ist die schlechteste
       aller Antworten. */
    reader.onerror = () => setImportStatus('error');
    reader.readAsText(file);
  }

  /* Rückmeldung per Mail — nur, wenn der Betreiber eine Adresse hinterlegt hat
     (legal.json); eine Adresse zu erfinden wäre schlimmer als keine. */
  const feedbackLink = legal
    ? feedbackMail({
      email: legal.email, betreff: L.feedbackBetreff, kopf: L.feedbackKopf,
      bau: L.bauStand(__BAU__), version: L.version, sprache: lang, userAgent: navigator.userAgent,
    })
    : null;

  return (
    <div>
      <PageHeader title={L.title} sub={speicherSatz} backTo="/profil" />

      {/* ── Konto ─────────────────────────────────────────────────────── */}
      <h2 className="section-title" id="konto" tabIndex={-1}>{L.kontoTitel}</h2>
      <CloudAccountCard />

      {/* ── Profil ────────────────────────────────────────────────────── */}
      <h2 className="section-title">{L.profilTitel}</h2>
      <div className="card">
        <p className="small muted" style={{ marginBottom: 'var(--sp-4)' }}>{L.profilIntro}</p>
        <label className="stat-label" htmlFor="profil-name" style={{ display: 'block', marginBottom: 'var(--sp-1)' }}>
          {L.nameLabel}
        </label>
        <div className="row">
          <input
            id="profil-name"
            className="text-input"
            value={nameInput}
            onChange={(e) => { setNameInput(e.target.value); setGespeichert(false); }}
            placeholder={L.namePlaceholder}
            maxLength={40}
          />
          <button
            className="btn"
            onClick={() => {
              setName(nameInput.trim());
              updateProfile(activeProfile.id, { name: nameInput });
              setGespeichert(true);
            }}
          >
            {L.speichern}
          </button>
        </div>
        {gespeichert && <p className="small muted" role="status" style={{ margin: 'var(--sp-2) 0 0' }}>{L.gespeichert}</p>}

        {profiles.length > 1 && <div style={{ marginTop: 'var(--sp-4)' }} />}
        {profiles.length > 1 && profiles.map((p, i) => {
          const aktiv = p.id === activeProfile.id;
          const anzeige = p.name || P.unbenannt(i + 1);
          return (
            <div key={p.id} className="row between wrap profil-zeile">
              <div className="row">
                <span className="profil-avatar" style={{ background: `${p.color}26`, border: `1.5px solid ${p.color}55` }}>
                  {anzeige.slice(0, 1).toUpperCase()}
                </span>
                <div style={{ fontWeight: 'var(--fw-bold)' }}>
                  {anzeige} {aktiv && <span className="pill" style={{ marginLeft: 'var(--sp-2)' }}>{L.aktiv}</span>}
                  {p.cloudUid && <span className="pill info" style={{ marginLeft: 'var(--sp-2)' }}>{L.mitKonto}</span>}
                </div>
              </div>
              <div className="row">
                {!aktiv && <button className="btn sm" onClick={() => switchProfile(p.id)}>{L.wechseln}</button>}
                {loeschId === p.id ? (
                  <>
                    <button className="btn sm danger" onClick={() => { deleteProfile(p.id); setLoeschId(null); }}>
                      {L.loeschenFrage}
                    </button>
                    <button className="btn sm ghost" onClick={() => setLoeschId(null)}>{L.abbrechen}</button>
                  </>
                ) : (
                  <button className="btn sm ghost" onClick={() => setLoeschId(p.id)} aria-label={L.loeschenAria(anzeige)}>
                    <Icon name="x" size={16} />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {!neuesProfil ? (
          <button className="btn sm" style={{ marginTop: 'var(--sp-4)' }} onClick={() => setNeuesProfil(true)}>
            {L.neuesProfil}
          </button>
        ) : (
          <div style={{ marginTop: 'var(--sp-4)' }}>
            <input
              className="text-input"
              value={neuerName}
              onChange={(e) => setNeuerName(e.target.value)}
              placeholder={L.namePlaceholder}
              aria-label={L.namePlaceholder}
              maxLength={40}
            />
            <div className="row" style={{ marginTop: 'var(--sp-3)' }}>
              <button
                className="btn sm primary"
                disabled={!neuerName.trim()}
                onClick={() => {
                  createProfile(neuerName);
                  setNameInput(neuerName.trim());
                  setNeuerName('');
                  setNeuesProfil(false);
                }}
              >
                {L.erstellen}
              </button>
              <button className="btn sm ghost" onClick={() => setNeuesProfil(false)}>{L.abbrechen}</button>
            </div>
          </div>
        )}
      </div>

      {/* ── Darstellung ───────────────────────────────────────────────── */}
      <h2 className="section-title">{L.darstellungTitel}</h2>
      <div className="card">
        <div className="stat-label" id="einst-sprache" style={{ marginBottom: 'var(--sp-1)' }}>{L.sprache}</div>
        <div className="segmented" role="radiogroup" aria-labelledby="einst-sprache">
          {(['de', 'en'] as const).map((l) => (
            <button key={l} type="button" role="radio" aria-checked={lang === l}
              className={lang === l ? 'on' : ''} onClick={() => setLang(l)}>
              {l === 'de' ? L.deutsch : L.englisch}
            </button>
          ))}
        </div>

        {/* Die Farbwahl steht hier und nicht auf der Startseite: Sie wird einmal
            getroffen und dann jahrelang nicht mehr. */}
        <div className="stat-label" id="einst-farben" style={{ marginTop: 'var(--sp-4)', marginBottom: 'var(--sp-1)' }}>{L.farben}</div>
        <div className="segmented" role="radiogroup" aria-labelledby="einst-farben">
          {MODI.map((m) => (
            <button key={m} type="button" role="radio" aria-checked={modus === m}
              className={modus === m ? 'on' : ''} onClick={() => setzeModus(m)}>
              {L.farbName[m]}
            </button>
          ))}
        </div>
        <p className="small faint" style={{ marginTop: 'var(--sp-2)', marginBottom: '0' }}>{L.farbHinweis}</p>
      </div>

      {/* ── App ───────────────────────────────────────────────────────── */}
      <h2 className="section-title">{L.appTitel}</h2>
      <ErinnerungKarte />
      <InstallierenKarte />

      {/* ── Über ──────────────────────────────────────────────────────── */}
      <h2 className="section-title">{L.ueberTitel}</h2>
      <div className="card">
        <ul className="list-plain versprechen">
          {L.versprechen.map((v) => (
            <li key={v.t}>
              <strong>{v.t}</strong>
              <span className="small muted">{v.d}</span>
            </li>
          ))}
        </ul>
        <p className="small muted" style={{ marginBottom: 'var(--sp-2)' }}>{L.verantwortung}</p>
        <p className="small faint" style={{ margin: '0' }}>{L.version} · {L.bauStand(__BAU__)}</p>
      </div>
      <div style={{ display: 'grid', gap: 'var(--sp-2)', marginTop: 'var(--sp-3)' }}>
        <Link to="/rechtliches" className="card clickable einstellungen-zeile">
          <span className="zeichen"><Icon name={zeichenFuer('/rechtliches')} size={18} /></span>
          <span className="titel">{LEGAL[lang].navLegal}</span>
          <span aria-hidden="true" className="weiter">›</span>
        </Link>
        {feedbackLink && (
          <a href={feedbackLink} className="card clickable einstellungen-zeile">
            <span className="zeichen"><Icon name="share" size={18} /></span>
            <span className="titel">{L.feedback}</span>
            <span aria-hidden="true" className="weiter">›</span>
          </a>
        )}
      </div>
      <ShareCard />

      {/* ── Daten — zuletzt, die zerstörende Aktion als allerletztes ────── */}
      <h2 className="section-title">{L.datenTitel}</h2>
      <div className="card">
        <div style={{ fontWeight: 'var(--fw-bold)', marginBottom: 'var(--sp-2)' }}>{L.backupTitel}</div>
        <p className="small muted" style={{ marginBottom: 'var(--sp-3)' }}>{L.backupText}</p>
        <div className="row wrap">
          <button className="btn sm" onClick={backup}>{L.backupDownload}</button>
          <label className="btn sm" style={{ cursor: 'pointer' }}>
            {L.backupImport}
            <input
              type="file"
              accept="application/json,.json"
              style={{ display: 'none' }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) dateiLesen(f);
                e.target.value = '';
              }}
            />
          </label>
        </div>
        {importStatus === 'ok' && <div className="feedback-box good" role="status" style={{ marginTop: 'var(--sp-3)' }}>{L.importOk}</div>}
        {importStatus === 'error' && <div className="feedback-box bad" role="alert" style={{ marginTop: 'var(--sp-3)' }}>{L.importFehler}</div>}

        <hr className="divider" />

        {!confirmReset ? (
          <button className="btn danger sm" onClick={() => setConfirmReset(true)}>{L.zuruecksetzen}</button>
        ) : (
          <div role="alertdialog" aria-label={L.zurueckFrage}>
            <div style={{ fontWeight: 'var(--fw-bold)', marginBottom: 'var(--sp-2)' }}>{L.zurueckFrage}</div>
            <p className="small" style={{ marginBottom: 'var(--sp-3)' }}>
              {L.zurueckText1} <strong>{L.zurueckStark}</strong> {L.zurueckText2}
            </p>
            <div className="row wrap">
              <button className="btn sm" onClick={backup}>{L.zurueckSichern}</button>
              <button
                className="btn danger sm"
                onClick={() => { resetAll(); setConfirmReset(false); setNameInput(''); }}
              >
                {L.zurueckJa}
              </button>
              <button className="btn sm ghost" onClick={() => setConfirmReset(false)}>{L.abbrechen}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
