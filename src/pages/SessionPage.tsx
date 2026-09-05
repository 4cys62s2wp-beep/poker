/* Bereich „Live-Session" – die mittlere Ebene zwischen Hub und Detail.
   ====================================================================

   Wer hier landet, sitzt am echten Tisch. Die Frage ist deshalb nie „was ist
   das?", sondern „wann brauche ich das?" – und darauf antwortet jede Karte
   in einer eigenen Zeile.

   Die Reihenfolge ist der Ablauf eines Abends — vorher, währenddessen,
   danach. Diese Reihenfolge ist die eigentliche Information, und sie steht
   jetzt als Marke an jeder Kachel statt in einem Absatz darunter.

   Was hier bis E-042 stand, war dreimal so lang: unter jedem Namen drei
   Zeilen Erklärung. Fünf Absätze auf zweieinhalb Bildschirmen — und die
   Auskunft, auf die es ankommt, stand nirgends: dass zwölf Abende erfasst
   sind, dass die Bilanz stimmt, dass gerade eine Runde läuft. Jetzt trägt
   jede Kachel ihren eigenen Stand. */

import { useEffect, useState } from 'react';
import { PageHeader, StatPill } from '../components/ui';
import { Bereichskachel } from '../components/Bereich';
import type { IconName } from '../components/Icon';
import { ladeAbende, type Abend } from '../lib/session/abende';
import { ladeLaufende, type LaufendeSession } from '../lib/session/laufend';
import { grobeDauer } from '../lib/session/dauer';
import { useAppState } from '../state/AppState';
import { useLang } from '../i18n';
import { STR } from '../i18n/pages/session';

export function SessionPage() {
  const { data } = useAppState();
  const { lang } = useLang();
  const L = STR[lang];
  const nf = lang === 'de' ? 'de-DE' : 'en-GB';

  const sessions = data.sessions.length;
  // Bilanz = Auszahlung minus Einsatz, über alle erfassten Sitzungen.
  const bilanz = data.sessions.reduce((s, e) => s + (e.cashOut - e.buyIn), 0);

  /* Erst nach dem ersten Rendern lesen: Der Gerätespeicher steht beim
     Serverrendern nicht zur Verfügung. Genau wie auf der Startseite. */
  const [laufend, setLaufend] = useState<LaufendeSession | null>(null);
  const [abende, setAbende] = useState<Abend[]>([]);
  useEffect(() => {
    setLaufend(ladeLaufende());
    setAbende(ladeAbende());
  }, []);

  const datum = (ms: number) => new Date(ms).toLocaleDateString(
    nf, { day: 'numeric', month: 'short' },
  );
  const letzter = abende.length === 0 ? null
    : abende.reduce((a, b) => (b.begonnen > a.begonnen ? b : a));

  /* Die Reihenfolge ist der Ablauf eines Abends, nicht eine Rangfolge nach
     Wichtigkeit: einteilen → auszahlen festlegen → spielen → festhalten. */
  const entries: Array<{
    to: string; icon: IconName; title: string; inhalt: string; marke: string;
  }> = [
    /* Zuerst der Abend selbst: Chipverteilung, Blindstruktur und Uhr in
       einem Weg. Die einzelnen Rechner darunter bleiben — wer nur schnell
       etwas nachrechnen will, braucht keinen ganzen Abend.

       Läuft gerade einer, steht das hier: Es ist die einzige Auskunft auf
       dieser Seite, die keine Minute alt sein darf. */
    {
      to: '/session/live/einrichten', icon: 'table',
      title: L.abendTitle, marke: L.markeAbend,
      inhalt: laufend
        ? L.laeuftSeit(grobeDauer(Date.now() - laufend.begonnen, lang))
        : L.abendWhen,
    },
    /* Danach das, was von den Abenden bleibt. Es steht direkt hinter dem
       Abend selbst, weil man es am Tag danach sucht — und weil der Weg zu
       einer Person nur über diese Liste führt. */
    {
      to: '/session/abende', icon: 'crown',
      title: L.abendeTitle, marke: L.markeDanach,
      inhalt: letzter
        ? L.abendeStand(abende.length, datum(letzter.begonnen))
        : L.abendeLeer,
    },
    {
      to: '/session/chips', icon: 'chip',
      title: L.chipsTitle, marke: L.markeVorher, inhalt: L.chipsWhen,
    },
    {
      to: '/session/auszahlung', icon: 'crown',
      title: L.payoutTitle, marke: L.markeVorher, inhalt: L.payoutWhen,
    },
    /* Hier standen der Ein-Geräte-Tisch und der Online-Tisch. Beide sind
       aus dem inhaltlichen Rahmen gefallen: Sie sind gespieltes Poker, nicht
       verwaltetes (E-030). Sie stehen mit Vorbehalt in BACKLOG.md und kommen
       nur über eine ausdrückliche Entscheidung über die Altersstufe zurück,
       nicht nebenbei. */
    {
      to: '/session/bankroll', icon: 'notes',
      title: L.bankrollTitle, marke: L.markeDanach,
      inhalt: sessions > 0
        ? L.bankrollStand(sessions, bilanz.toLocaleString(nf, { maximumFractionDigits: 0 }))
        : L.bankrollWhen,
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow={L.eyebrow}
        title={L.title}
        sub={L.sub}
        backTo="/"
        backLabel={L.backHome}
      />

      {(sessions > 0 || data.handsPlayed > 0) && (
        <div
          className="card row wrap"
          style={{ gap: 'var(--sp-5)', padding: 'var(--sp-4) var(--sp-5)', marginBottom: 'var(--sp-5)' }}
        >
          {sessions > 0 && (
            <>
              <StatPill value={sessions} label={L.sessionsLabel} accent="live" />
              <StatPill
                value={bilanz.toLocaleString(nf, { maximumFractionDigits: 0 })}
                label={L.resultLabel}
                accent={bilanz >= 0 ? 'learn' : 'neutral'}
              />
            </>
          )}
          {data.handsPlayed > 0 && (
            <StatPill value={data.handsPlayed} label={L.handsLabel} accent="neutral" />
          )}
        </div>
      )}

      <div className="bereiche live">
        {entries.map((e) => (
          <Bereichskachel
            key={e.to} to={e.to} icon={e.icon} titel={e.title}
            inhalt={e.inhalt} marke={e.marke}
          />
        ))}
      </div>
    </div>
  );
}
