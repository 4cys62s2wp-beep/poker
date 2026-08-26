/* Der Hub: die Startseite.
   ========================

   Drei Entscheidungen, mehr nicht. Wer die App öffnet, hat eine von drei
   Absichten – lernen, live spielen, eine Sitzung verwalten – und soll sie in
   einem Blick finden, ohne zu lesen.

   Was hier bewusst NICHT steht: Kennzahl-Kacheln, Schnellzugriff-Raster,
   Tipp des Tages, Wasserzeichen. Das war der alte Startbildschirm, und es war
   eine Kachelwand ohne Fokus (docs/SCREEN_STRUKTUR.md, Abschnitt 1).

   Was stattdessen da ist:
   - eine schmale Kopfzeile mit Streak, Level und XP – sichtbar, aber nicht
     der Held des Screens (Anforderung 2.2)
   - EIN Quick Access: die eine Sache, die gerade ansteht
   - drei Karten, je mit eigener Farbe und eigenem Bildzeichen
   - ein vierter, sichtbar deaktivierter Platz für „Mit Freunden spielen“ */

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { HubCard, StatPill } from '../components/ui';
import { useAppState } from '../state/AppState';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/hub';
import { usePro } from '../lib/pro/ProProvider';

export function HubPage() {
  const { data, level, dueReviewCount } = useAppState();
  const { lang, content } = useLang();
  const L = STR[lang];
  const { enabled: proEnabled } = usePro();

  const totalLessons = content.modules.reduce((s, m) => s + m.lessons.length, 0);
  const doneLessons = Object.keys(data.completedLessons).length;
  const learnPct = totalLessons > 0 ? (100 * doneLessons) / totalLessons : 0;

  /* Erstnutzer erkennen wir daran, dass noch nichts passiert ist. Sie
     bekommen erklärende Untertitel statt Fortschrittszahlen – „0 von 49
     Lektionen“ sagt einem Neuling nichts, „Kurs, Trainer und Wiederholung“
     schon (Anforderung 2.2). */
  const isFirstTime = doneLessons === 0 && data.handsPlayed === 0 && data.xp === 0;

  const nextLesson = useMemo(() => {
    for (const m of content.modules) {
      for (const l of m.lessons) {
        if (!data.completedLessons[l.id]) {
          return { moduleId: m.id, lessonId: l.id, title: l.title };
        }
      }
    }
    return null;
  }, [content.modules, data.completedLessons]);

  const todayStr = new Date().toISOString().slice(0, 10);
  const quizOpen = data.daily?.date !== todayStr;

  /* Genau EIN Quick Access, nach Dringlichkeit gewählt. Fünf Vorschläge
     nebeneinander wären wieder eine Kachelwand – und wer fünf Dinge
     gleichzeitig angeboten bekommt, tut oft keins davon. */
  const quick = (() => {
    if (dueReviewCount > 0) {
      return { to: '/lernen/wiederholen', icon: 'repeat' as const, label: L.continueReview(dueReviewCount) };
    }
    if (nextLesson) {
      return {
        to: `/lernen/${nextLesson.moduleId}/${nextLesson.lessonId}`,
        icon: 'learn' as const,
        label: doneLessons === 0 ? L.continueFirst : L.continueLesson(nextLesson.title),
      };
    }
    if (quizOpen) return { to: '/lernen/tagesquiz', icon: 'check' as const, label: L.continueQuiz };
    return null;
  })();

  const hour = new Date().getHours();
  const greeting = !data.name
    ? L.greetingAnonymous
    : hour < 11 ? L.greetingMorning : hour < 18 ? L.greetingDay : L.greetingEvening;

  return (
    <div>
      {/* ── Kopfzeile: Fortschritt sichtbar, aber schmal ───────────────── */}
      <div
        className="row between wrap"
        style={{ gap: 'var(--sp-4)', marginBottom: 'var(--sp-5)' }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'var(--font-display)', fontSize: 'var(--fs-h2)',
              fontWeight: 'var(--fw-bold)', lineHeight: 'var(--lh-tight)',
            }}
          >
            {greeting}
            {data.name ? `, ${data.name}` : ''}
          </div>
        </div>

        <div className="row" style={{ gap: 'var(--sp-5)', flexShrink: 0 }}>
          {/* Der Streak ist der Wiederkehr-Anker – deshalb zuerst und mit
              Flamme, sobald er läuft. Bei 0 bleibt er blass statt zu fehlen:
              Eine Lücke, die man füllen kann, motiviert mehr als nichts. */}
          <StatPill
            value={data.streak.count}
            label={data.streak.count > 0 ? L.streakLabel : L.streakNone}
            accent={data.streak.count > 0 ? 'learn' : 'neutral'}
            icon="flame"
          />
          <StatPill value={level} label={L.levelLabel} accent="neutral" />
          <StatPill value={data.xp} label={L.xpLabel} accent="neutral" />
        </div>
      </div>

      {/* ── Quick Access: die eine Sache, die ansteht ──────────────────── */}
      {quick && (
        <Link
          to={quick.to}
          className="card"
          style={{
            display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
            padding: 'var(--sp-4) var(--sp-5)', marginBottom: 'var(--sp-5)',
            textDecoration: 'none', color: 'inherit',
            borderColor: 'var(--gold-dim)', minHeight: 'var(--touch-min)',
          }}
        >
          <span style={{ color: 'var(--gold)' }}><Icon name={quick.icon} size={19} /></span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span
              style={{
                display: 'block', fontSize: 'var(--fs-tiny)', letterSpacing: '0.4px',
                textTransform: 'uppercase', color: 'var(--text-faint)',
                fontWeight: 'var(--fw-medium)',
              }}
            >
              {L.continueTitle}
            </span>
            <span style={{ display: 'block', fontWeight: 'var(--fw-medium)', marginTop: 2 }}>
              {quick.label}
            </span>
          </span>
          <span aria-hidden="true" style={{ color: 'var(--text-faint)' }}>›</span>
        </Link>
      )}

      {isFirstTime && (
        <div style={{ marginBottom: 'var(--sp-5)' }}>
          <div className="eyebrow">{L.firstTimeTitle}</div>
          <p className="small muted" style={{ marginTop: 'var(--sp-2)', maxWidth: 520 }}>
            {L.firstTimeSub}
          </p>
        </div>
      )}

      {/* ── Die drei Absichten ─────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid', gap: 'var(--sp-3)',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        }}
      >
        <HubCard
          to="/lernen"
          icon="learn"
          accent="learn"
          title={L.learnTitle}
          subtitle={L.learnSub}
          status={isFirstTime ? undefined : L.learnStatus(doneLessons, totalLessons)}
          progress={isFirstTime ? undefined : learnPct}
        />

        <HubCard
          to="/live"
          icon="coach"
          accent="live"
          title={L.liveTitle}
          subtitle={L.liveSub}
          status={
            isFirstTime
              ? undefined
              : data.handsPlayed > 0
                ? L.liveStatusHands(data.handsPlayed)
                : L.liveStatusCoach
          }
        />

        <HubCard
          to="/tools"
          icon="tools"
          accent="tools"
          title={L.toolsTitle}
          subtitle={L.toolsSub}
          status={isFirstTime ? undefined : L.toolsStatus}
        />

        {/* Vierter Platz: im Raster vorgesehen, noch nicht gebaut
            (Anforderung 2.1). Sichtbar als Platzhalter statt als Lücke –
            wer ihn sieht, weiß, dass da noch etwas kommt. */}
        <HubCard
          to=""
          icon="friends"
          accent="friends"
          title={L.friendsTitle}
          subtitle={L.friendsSub}
          comingSoon
        />
      </div>

      {/* Pro-Hinweis nur, wenn die Monetarisierung überhaupt läuft. */}
      {proEnabled && (
        <div style={{ marginTop: 'var(--sp-5)' }}>
          <Link to="/pro" className="small faint" style={{ textDecoration: 'none' }}>
            <Icon name="crown" size={13} /> Pro
          </Link>
        </div>
      )}
    </div>
  );
}
