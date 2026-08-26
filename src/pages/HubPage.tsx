/* Die Startseite.
   ==============

   Drei Einstiege, **ungleich gewichtet**. Die Gewichtung folgt der
   Nutzungssituation und nicht der Wichtigkeit:

   - LIVE-SESSION unten und am größten. Sie wird unter Zeitdruck geöffnet,
     oft einhändig, während die andere Hand Chips stapelt — und der Daumen
     erreicht die untere Bildschirmhälfte, mehr nicht.
   - LERNEN in der Mitte, mittlere Größe. Wird in Ruhe geöffnet.
   - NACHSCHLAGEN oben und klein. Wer gezielt sucht, findet auch ein kleines
     Ziel.

   Einen vierten Einstieg gibt es nicht. Hier stand einmal ein Platzhalter
   „Mit Freunden spielen"; er ist ersatzlos gestrichen. Ein Platzhalter, der
   nicht kommt, ist ein Versprechen, das man bricht.

   Fortsetzen statt Menü
   ---------------------
   Läuft eine Runde, steht sie **ganz oben** — mit dem Weg zurück hinein,
   seit wann sie läuft und wer mitspielt. Wer eine angebrochene Runde hat,
   will keinen Einstieg, sondern zurück.

   Beim allerersten Öffnen steht dort stattdessen ein Satz, der sagt, was die
   App tut. Eine Fortschrittszahl wäre dort sinnlos: „0 von 49 Lektionen"
   sagt einem Neuling nichts.

   Größen und Abstände stehen vollständig in `global.css`, Abschnitt
   „Startseite". In dieser Datei steht keine Gestaltungszahl. */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { StatPill } from '../components/ui';
import { useAppState } from '../state/AppState';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/hub';
import { usePro } from '../lib/pro/ProProvider';
import { grobeDauer } from '../lib/session/dauer';
import { ladeLaufende, nochDabei, type LaufendeSession } from '../lib/session/laufend';

export function HubPage() {
  const { data, level } = useAppState();
  const { lang, content } = useLang();
  const L = STR[lang];
  const { enabled: proEnabled } = usePro();

  /* Erst nach dem ersten Rendern lesen: Der Gerätespeicher steht beim
     Serverrendern nicht zur Verfügung, und ein Fehler dort würde die
     Startseite kosten. */
  const [laufend, setLaufend] = useState<LaufendeSession | null>(null);
  useEffect(() => { setLaufend(ladeLaufende()); }, []);

  const totalLessons = content.modules.reduce((s, m) => s + m.lessons.length, 0);
  const doneLessons = Object.keys(data.completedLessons).length;

  /* Erstnutzer erkennen wir daran, dass noch nichts passiert ist. */
  const erstesMal = doneLessons === 0 && data.handsPlayed === 0 && data.xp === 0;

  return (
    <div className="start">
      {/* ── Ganz oben: die laufende Runde, oder der erklärende Satz ────── */}
      {/* Der Weg führt in die laufende Runde selbst, nicht in ihr Menü. Wer
          die App öffnet, während der Abend läuft, will die Uhr sehen — jeder
          Zwischenschritt ist an dieser Stelle einer zu viel. */}
      {laufend ? (
        <Link to="/session/live" className="start-fortsetzen">
          <span className="marke">{L.fortsetzenMarke}</span>
          <span className="titel">{L.fortsetzenTitel}</span>
          <span className="unter">
            {L.fortsetzenSeit(
              grobeDauer(Date.now() - laufend.begonnen, lang),
              nochDabei(laufend).length,
            )}
          </span>
          <span className="unter">
            {L.fortsetzenNamen(nochDabei(laufend).map((s) => s.name).join(', '))}
          </span>
        </Link>
      ) : erstesMal ? (
        <p className="start-erklaerung">{L.wasDieAppTut}</p>
      ) : null}

      {/* ── Klein, oben ───────────────────────────────────────────────── */}
      <Link to="/nachschlagen" className="start-einstieg klein">
        <span className="titel">{L.lookupTitle}</span>
        <span className="unter">{L.lookupSub}</span>
      </Link>

      {/* ── Mittel, Mitte ─────────────────────────────────────────────── */}
      <Link to="/lernen" className="start-einstieg mittel">
        <span className="titel">{L.learnTitle}</span>
        <span className="unter">
          {erstesMal ? L.learnSub : L.learnStatus(doneLessons, totalLessons)}
        </span>
      </Link>

      {/* ── Groß, unten, im Daumenbereich ─────────────────────────────── */}
      <Link to="/session" className="start-einstieg gross">
        <span className="titel">{L.sessionTitle}</span>
        <span className="unter">{L.sessionSub}</span>
      </Link>

      {/* ── Stand: sichtbar, aber nicht der Held des Bildschirms ───────── */}
      {!erstesMal && (
        <div className="start-stand">
          <StatPill
            value={data.streak.count}
            label={data.streak.count > 0 ? L.streakLabel : L.streakNone}
            accent="neutral"
            icon="flame"
          />
          <StatPill value={level} label={L.levelLabel} accent="neutral" />
          <StatPill value={data.xp} label={L.xpLabel} accent="neutral" />
          {proEnabled && (
            <Link to="/pro" className="small faint">
              <Icon name="crown" size={13} /> Pro
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
