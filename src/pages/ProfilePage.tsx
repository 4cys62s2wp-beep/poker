import { useState } from 'react';
import { ALL_MODULES } from '../content';
import { useAppState } from '../state/AppState';
import { rangnamen } from '../lib/rang/titel';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/profile';
import { Link } from 'react-router-dom';
import { Levelring } from '../components/Levelring';
import { Medaille } from '../components/Medaille';
import { rangstand } from '../lib/rang/stand';
import { Icon, type IconName } from '../components/Icon';
import { STR as FRIENDS } from '../i18n/pages/friends';
import { STR as LEGAL } from '../i18n/pages/legal';
import { STR as PRO_STR } from '../i18n/pages/pro';
import { zeichenFuer } from '../lib/zeichen';
import { usePro } from '../lib/pro/ProProvider';
import { PageHeader } from '../components/ui';
import { aktuelleSerie } from '../lib/serie';
import { tagesschluessel } from '../lib/heute/hand';
import { useCloud } from '../lib/cloud/CloudProvider';
import { speicherort } from '../lib/speicherort';
import { waehleAbzeichen } from '../lib/abzeichen';

/* Das Profil: Identität und Fortschritt (E-095).
   Alles, was man einstellt, steht auf /profil/einstellungen — vorher war diese
   Seite 5280 Pixel lang und der Fortschritt in der Mitte. */
export function ProfilePage() {
  const { data, profiles, activeProfile } = useAppState();
  const { lang, content } = useLang();
  const proCtx = usePro();
  const P = STR[lang];
  const cloud = useCloud();
  const serieZahl = aktuelleSerie(data.streak, tagesschluessel());
  const [alleAbzeichen, setAlleAbzeichen] = useState(false);

  const totalLessons = ALL_MODULES.reduce((s, m) => s + m.lessons.length, 0);
  const doneLessons = Object.keys(data.completedLessons).length;
  const earnedBadges = Object.keys(data.badges).length;

  /* Der Tag, an dem ein Abzeichen dazukam. Gespeichert ist er als
     ISO-Zeichenkette; ein Speicher aus einer Sicherung kann Unsinn
     enthalten, deshalb wird geprüft statt vertraut. */
  const datum = (iso: string) => {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString(
      lang === 'de' ? 'de-DE' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' },
    );
  };
  const rang = rangstand(data.xp, rangnamen(lang));
  const abzeichen = waehleAbzeichen(content.badges, data.badges);

  const trainerTotals = Object.values(data.trainers).reduce(
    (acc, t) => ({ attempts: acc.attempts + t.attempts, correct: acc.correct + t.correct }),
    { attempts: 0, correct: 0 },
  );

  const stelle = Math.max(0, profiles.findIndex((p) => p.id === activeProfile.id));
  const name = activeProfile.name || P.unbenannt(stelle + 1);
  const ort = speicherort(cloud.user);
  const speicherSatz = ort === 'konto' ? P.speicherKonto : ort === 'konto-offen' ? P.speicherKontoOffen : P.speicherGeraet;

  return (
    <div>
      <PageHeader
        title={P.title}
        sub={speicherSatz}
        backTo="/"
        actions={(
          <Link to="/profil/einstellungen" className="btn sm ghost einstellungen-knopf" aria-label={P.einstellungen} title={P.einstellungen}>
            <Icon name={zeichenFuer('/profil/einstellungen')} size={20} />
            <span className="einstellungen-text">{P.einstellungen}</span>
          </Link>
        )}
      />

      {/* Wer das ist: ein Avatar mit dem Anfangsbuchstaben, nie ein „?“. */}
      <div className="profil-kopf">
        <span
          className="profil-avatar gross"
          style={{ background: `${activeProfile.color}26`, border: `1.5px solid ${activeProfile.color}55` }}
          aria-hidden="true"
        >
          {name.slice(0, 1).toUpperCase()}
        </span>
        <strong className="profil-name">{name}</strong>
      </div>

      {/* Der Rang als ein Bild statt als vier Kästen mit Zahlen (E-037).
          Vorher standen hier Level, XP, Lektionen und Abzeichen als vier
          gleich große Felder — für jemanden am Anfang viermal eine Null.
          Der Ring sagt dasselbe, bevor man liest, und die eine Zeile
          darunter sagt, was als Nächstes kommt. */}
      <section className="rangstand gross" aria-label={P.rangMarke}>
        <Levelring
          wert={rang.level}
          anteil={rang.anteil}
          groesse={84}
          className={`gross${rang.hoechsterRang ? ' fertig' : ''}`}
          beschriftung={P.rangRing(rang.level, rang.titel)}
        />
        <div className="text">
          <span className="marke">{P.rangMarke}</span>
          <strong className="titel">{rang.titel}</strong>
          <span className="bis">
            {rang.naechsterTitel === null
              ? P.rangWeiter(rang.fehlt)
              : P.rangBis(rang.fehlt, rang.naechsterTitel)}
          </span>
          <span className="dazu">
            {P.rangGesamt(data.xp)}
            {' · '}
            {P.lessonsDoneOf(doneLessons, totalLessons)}
            {' · '}
            {P.rangSammlung(earnedBadges, content.badges.length)}
          </span>
        </div>
      </section>

      <div className="grid cols-4" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="stat-label">{P.statTrainerAnswers}</div>
          <div className="big-stat">{trainerTotals.attempts}</div>
          {trainerTotals.attempts > 0 ? (
            <div className="small faint">
              {P.pctCorrect(Math.round((100 * trainerTotals.correct) / trainerTotals.attempts))}
            </div>
          ) : (
            <Link className="kachel-start small" to="/lernen">{P.firstTask}</Link>
          )}
        </div>
        <div className="card">
          <div className="stat-label">{P.statHandsPlayed}</div>
          <div className="big-stat">{data.handsPlayed}</div>
          {data.handsPlayed > 0 ? (
            <div className="small faint">{P.handsWon(data.handsWon)}</div>
          ) : (
            <Link className="kachel-start small" to="/lernen/uebungstisch">{P.firstHand}</Link>
          )}
        </div>
        <div className="card">
          <div className="stat-label">{P.statStreak}</div>
          <div className="big-stat">{serieZahl > 0 ? serieZahl : '–'}</div>
          <div className="small faint">{P.streakDays(serieZahl)}</div>
        </div>
        <div className="card">
          <div className="stat-label">{P.statSessions}</div>
          <div className="big-stat">{data.sessions.length}</div>
          {data.sessions.length > 0 ? (
            <div className="small faint">{P.sessionsSub}</div>
          ) : (
            <Link className="kachel-start small" to="/session/bankroll">{P.firstSession}</Link>
          )}
        </div>
      </div>

      {/* Die Sammlung feiert, was verdient ist (E-042) — und zeigt, was zählt
          (E-095): die zuletzt verdienten (höchstens sechs), die nächsten drei und
          für den Rest eine Zeile. Vorher waren es 22 Kacheln, drei davon farbig. */}
      <h2 className="section-title">
        {P.badgesTitle}
        <span className="section-stand">
          {P.rangSammlung(earnedBadges, content.badges.length)}
        </span>
      </h2>

      {alleAbzeichen ? (
        <div className="abzeichen" id="alle-abzeichen">
          {content.badges.map((b) => {
            const seit = data.badges[b.id];
            return (
              <div key={b.id} className={`abzeichen-stueck${seit ? ' verdient' : ''}`}>
                <Medaille name={b.icon} verdient={!!seit} />
                <span className="b-name">{b.title}</span>
                <span className="b-desc">{b.description}</span>
                {seit && <span className="abzeichen-seit">{P.badgeSeit(datum(seit))}</span>}
              </div>
            );
          })}
        </div>
      ) : (
        <>
          {abzeichen.verdient.length > 0 ? (
            <div className="abzeichen">
              {abzeichen.verdient.map(({ def, seit }) => (
                <div key={def.id} className="abzeichen-stueck verdient">
                  <Medaille name={def.icon} />
                  <span className="b-name">{def.title}</span>
                  <span className="b-desc">{def.description}</span>
                  <span className="abzeichen-seit">{P.badgeSeit(datum(seit))}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="small muted" style={{ marginTop: 0 }}>{P.nochKeins}</p>
          )}
          {abzeichen.weitereVerdient > 0 && (
            <p className="small faint" style={{ margin: 'var(--sp-2) 0 0' }}>{P.weitereVerdient(abzeichen.weitereVerdient)}</p>
          )}

          {abzeichen.naechste.length > 0 && (
            <>
              <div className="stat-label naechste-kopf">{P.naechste}</div>
              <ul className="list-plain naechste-liste">
                {abzeichen.naechste.map((b) => (
                  <li key={b.id}>
                    <Medaille name={b.icon} verdient={false} groesse={40} />
                    <span>
                      <strong>{b.title}</strong>
                      <span className="small muted">{b.description}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}

      <div className="row between wrap abzeichen-fuss">
        {!alleAbzeichen && abzeichen.offen > 0 ? (
          <span className="small muted">{P.offenZeile(abzeichen.offen)}</span>
        ) : <span />}
        <button
          type="button"
          className="btn sm"
          aria-expanded={alleAbzeichen}
          aria-controls="alle-abzeichen"
          onClick={() => setAlleAbzeichen(!alleAbzeichen)}
        >
          {alleAbzeichen ? P.weniger : P.alleAnsehen}
        </button>
      </div>

      {/* Freunde und Rechtliches standen nur in der Seitenleiste – die unter
          920 px ausgeblendet ist. Auf dem Handy waren beide Seiten damit
          nicht erreichbar, obwohl die alte Erreichbarkeitstabelle „über
          Profil" behauptete. Diese Zeilen sind die Korrektur. */}
      <div style={{ display: 'grid', gap: 'var(--sp-2)', marginTop: 'var(--sp-5)' }}>
        {cloud.phase !== 'unavailable' && (
          <ProfilLink to="/freunde" icon={zeichenFuer('/freunde')} label={FRIENDS[lang].navFriends} />
        )}
        {proCtx.enabled && <ProfilLink to="/pro" icon={zeichenFuer('/pro')} label={PRO_STR[lang].navPro} />}
        <ProfilLink to="/rechtliches" icon={zeichenFuer('/rechtliches')} label={LEGAL[lang].navLegal} />
        {/* § 312k BGB: ohne Anmeldung erreichbar, deshalb dauerhaft sichtbar,
            sobald es überhaupt etwas zu kündigen gibt. */}
        {proCtx.enabled && <ProfilLink to="/kuendigen" icon={zeichenFuer('/kuendigen')} label={LEGAL[lang].cancelNav} />}
      </div>

      <div className="suit-deco">♠ ♥ ♦ ♣</div>
    </div>
  );
}

/** Eine Zeile in der Liste „von hier aus weiter". */
function ProfilLink({ to, icon, label }: { to: string; icon: IconName; label: string }) {
  return (
    <Link
      to={to}
      className="card clickable einstellungen-zeile"
    >
      <span className="zeichen"><Icon name={icon} size={18} /></span>
      <span className="titel">{label}</span>
      <span aria-hidden="true" className="weiter">›</span>
    </Link>
  );
}
