import { useEffect, useMemo, useState } from 'react';
import { SuchFeld } from '../components/SuchFeld';
import { SuchTreffer } from '../components/SuchTreffer';
import { MIN_ZEICHEN, suche } from '../lib/suche';
import { useSuchquellen } from '../lib/suche/nutzen';
import { STR as NAV } from '../i18n/pages/layout';
import { Zurueck } from '../components/ui';
import { Link } from 'react-router-dom';
import { moduleProgress, useAppState } from '../state/AppState';
import { rangnamen } from '../lib/rang/titel';
import { useLang, levelLabel } from '../i18n';
import { STR } from '../i18n/pages/learn';
import { STR as TRAINER_TEXTE } from '../i18n/pages/trainerhub';
import { TRAINER } from '../lib/trainerliste';
import { Icon, IconTile, type IconName } from '../components/Icon';
import { Levelring } from '../components/Levelring';
import { rangstand } from '../lib/rang/stand';
import { zeichenFuer } from '../lib/zeichen';
import { usePro } from '../lib/pro/ProProvider';
import { Schloss } from '../components/pro/Schloss';
import { isFreeModule } from '../lib/pro/plan';
import { markiereGesehen, wurdeGesehen } from '../lib/gesehen';

const LEVEL_PILL: Record<string, string> = {
  Einsteiger: 'ok',
  Fortgeschritten: 'info',
  Experte: 'gold',
};

export function LearnPage() {
  const { data, dueReviewCount } = useAppState();
  const { lang, content } = useLang();
  const L = STR[lang];
  const { fullAccess } = usePro();
  /* Ohne Monetarisierung, mit Abo oder in der Testphase ist alles offen –
     dann sieht die Seite exakt so aus wie bisher. */
  const unlocked = fullAccess;
  const [query, setQuery] = useState('');
  /* „Neu"-Marken stehen nur beim ersten Besuch: Danach ist es nicht mehr neu,
     und eine Marke, die nie verschwindet, ist keine Auskunft mehr (E-092). */
  const [neuDrill] = useState(() => !wurdeGesehen('drill'));
  const [neuPros] = useState(() => !wurdeGesehen('pros'));
  useEffect(() => { markiereGesehen('drill'); markiereGesehen('pros'); }, []);

  /* Dieselbe Suche wie auf „Nachschlagen“ und im Suchdialog (E-096): Wer hier
     „Bankroll“ tippt, findet die Lektion — und das Werkzeug und den Begriff. */
  const quellen = useSuchquellen();
  const ergebnis = useMemo(() => suche(query, quellen), [query, quellen]);

  const searching = query.trim().length >= MIN_ZEICHEN;

  const heute = new Date().toISOString().slice(0, 10);
  const quizOffen = data.daily?.date !== heute;

  const uebungen: Array<{
    to: string; icon: IconName; tone: 'gold' | 'green' | 'blue' | 'red' | 'violet';
    title: string; sub: string; badge?: string;
  }> = [
    /* Die sieben Trainer stehen hier einzeln statt hinter einem Menü.
       Grund: Start → Lernen → Trainer → einzelner Trainer sind drei
       Berührungen, und die dritte führte auf einen Bildschirm, dessen
       einziger Zweck ein Menü war. Jetzt sind es zwei. Die Trefferquote,
       die dort stand, steht jetzt an der Kachel — sie ist die Auskunft,
       wegen der man hinschaut. */
    ...TRAINER.map((t) => {
      const stats = data.trainers[t.id];
      const quote = stats && stats.attempts > 0
        ? Math.round((100 * stats.correct) / stats.attempts)
        : null;
      return {
        to: t.zu,
        icon: t.zeichen,
        tone: t.ton,
        title: TRAINER_TEXTE[lang].trainers[t.id].title,
        sub: TRAINER_TEXTE[lang].trainers[t.id].desc,
        badge: quote === null ? undefined : L.trainerQuote(quote),
      };
    }),
    /* Wiederholen steht hier nur, wenn etwas fällig ist — und mit der Zahl.
       Eine Kachel „0 fällig" ist ein Weg zu einer leeren Seite. */
    ...(dueReviewCount > 0 ? [{
      to: '/lernen/wiederholen', icon: zeichenFuer('/lernen/wiederholen'), tone: 'blue' as const,
      title: L.reviewTitle, sub: L.reviewSub,
      badge: L.reviewDue(dueReviewCount),
    }] : []),
    {
      to: '/lernen/tagesquiz', icon: zeichenFuer('/lernen/tagesquiz'), tone: 'green',
      title: L.quizTitle, sub: L.quizSub,
      badge: quizOffen ? L.quizOpen : undefined,
    },
    { to: '/lernen/uebungstisch', icon: zeichenFuer('/lernen/uebungstisch'), tone: 'red', title: L.practiceTitle, sub: L.practiceSub },
    /* Die Spielstil-Analyse wertet gespielte Hände aus: ohne sie gibt es
       nichts zu zeigen. */
    ...(data.handsPlayed > 0 ? [{
      to: '/lernen/statistik', icon: zeichenFuer('/lernen/statistik'), tone: 'violet' as const,
      title: L.styleTitle, sub: L.styleSub,
    }] : []),
  ];

  const rang = rangstand(data.xp, rangnamen(lang));

  return (
    <div>
      <Zurueck to="/" />
      <div className="page-header">
        <div className="eyebrow">{L.eyebrow}</div>
        <h1>{L.title}</h1>
      </div>

      {/* Der Rang steht oben, nicht im Profil versteckt (E-037). Wer lernt,
          soll sehen, worauf er hinlernt — und wie weit es noch ist. Der
          Absatz Fließtext, der hier stand, ist dafür gewichen: Er erklärte
          das Curriculum, das direkt darunter zu sehen ist. */}
      <section className="rangstand" aria-label={L.rangMarke}>
        <Levelring
          wert={rang.level}
          anteil={rang.anteil}
          groesse={64}
          className={`gross${rang.hoechsterRang ? ' fertig' : ''}`}
          beschriftung={L.rangRing(rang.level, rang.titel)}
        />
        <div className="text">
          <span className="marke">{L.rangMarke}</span>
          <strong className="titel">{rang.titel}</strong>
          <span className="bis">
            {rang.naechsterTitel === null
              ? L.rangHoechster
              : L.rangBis(rang.fehlt, rang.naechsterTitel)}
          </span>
        </div>
      </section>

      {/* Reihenfolge seit E-037: erst der Weg, dann das Üben. Vorher stand
          der Lernpfad — der Zweck dieses Bildschirms — hinter dreizehn
          Trainerkarten, 3707 Pixel weit unten. Wer „Lernen" antippt, will
          wissen, wo er steht, nicht als Erstes eine Werkzeugliste. */}
      {/* Der Lernpfad ist ein Pfad, kein Kachelraster (E-037): eine
          Spalte, eine Linie, neun Stufen. Ein Raster zeigt neun
          gleichwertige Möglichkeiten; ein Pfad zeigt, wo man steht und
          was als Nächstes kommt — und genau das ist der Unterschied
          zwischen einem Inhaltsverzeichnis und einem Spiel. */}
      <div className="section-title">{L.pfadMarke}</div>
      <ol className="lernpfad">
        {content.modules.map((m, idx) => {
          const prog = moduleProgress(data, m.id);
          const done = Math.round(prog * m.lessons.length);
          const locked = !unlocked && !isFreeModule(m.id);
          const fertig = done === m.lessons.length;
          /* „Hier weiter" bekommt genau eine Stufe: die erste, die noch
             nicht fertig und nicht gesperrt ist. Zwei Wegweiser sind
             keiner. */
          const naechste = !fertig && !locked && content.modules
            .slice(0, idx)
            .every((v) => moduleProgress(data, v.id) === 1);
          const zustand = locked ? 'gesperrt' : fertig ? 'fertig' : naechste ? 'offen' : 'spaeter';

          /* Nur die Stufe, an der es weitergeht, ist aufgeklappt (E-092): Sie
             zeigt ihre Lektionen und einen Knopf zur nächsten. Alle anderen
             sind eine Zeile — vorher waren es neun gleich große Karten, 3680
             Pixel Seitenhöhe. */
          if (naechste) {
            const dran = m.lessons.find((l) => !data.completedLessons[l.id]) ?? m.lessons[0];
            return (
              <li key={m.id} className={`stufe ${zustand}`}>
                <div className="stufe-karte aufgeklappt">
                  <Link to={`/lernen/${m.id}`} className="stufe-kopf">
                    <Levelring
                      wert={idx + 1}
                      anteil={prog}
                      groesse={48}
                      className="auszeichnung"
                      beschriftung={L.stufeRing(done, m.lessons.length)}
                    />
                    <div className="stufe-text">
                      <div className="kopf">
                        <span className="titel">{m.title}</span>
                        <span className={`pill ${LEVEL_PILL[m.level] ?? ''}`}>{levelLabel(m.level, lang)}</span>
                      </div>
                      <span className="unter">{m.subtitle}</span>
                      <span className="zahl">{L.doneLine(done, m.lessons.length)}</span>
                    </div>
                    <span className="stufe-hinweis">{L.stufeOffen}</span>
                  </Link>
                  <ol className="stufe-lektionen">
                    {m.lessons.map((l) => {
                      const erledigt = !!data.completedLessons[l.id];
                      return (
                        <li key={l.id} className={`${erledigt ? 'fertig' : ''}${l.id === dran.id ? ' dran' : ''}`}>
                          <Link to={`/lernen/${m.id}/${l.id}`}>
                            <span className="punkt" aria-hidden="true">
                              {erledigt ? <Icon name="check" size={14} /> : null}
                            </span>
                            <span className="name">{l.title}</span>
                            <span className="dauer">{L.minuten(l.duration)}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ol>
                  <Link to={`/lernen/${m.id}/${dran.id}`} className="stufe-weiter">
                    {L.weiterLektion(dran.title, dran.duration)}
                  </Link>
                </div>
              </li>
            );
          }

          return (
            <li key={m.id} className={`stufe ${zustand}`}>
              <Link to={`/lernen/${m.id}`} className="stufe-karte kompakt">
                <Levelring
                  wert={fertig ? <Icon name="check" size={16} /> : idx + 1}
                  anteil={prog}
                  groesse={36}
                  className={fertig ? 'fertig' : 'auszeichnung'}
                  beschriftung={L.stufeRing(done, m.lessons.length)}
                />
                <span className="titel">{m.title}</span>
                {locked ? (
                  <Schloss pfad={`/lernen/${m.id}`} />
                ) : fertig ? (
                  <span className="stufe-hinweis fertig">{L.stufeFertig}</span>
                ) : (
                  <span className="zahl">{done}/{m.lessons.length}</span>
                )}
              </Link>
            </li>
          );
        })}
      </ol>


      {/* Das Suchfeld steht unter dem Weg, nicht darüber: Wer sucht, weiß
          schon, wonach — das ist der seltenere Fall. Es steht außerhalb der
          Verzweigung darunter, weil ein Feld, das beim dritten Zeichen an
          eine andere Stelle im Baum wandert, den Fokus verliert. */}
      <div style={{ margin: 'var(--sp-5) 0' }}>
        <SuchFeld id="lernen-suche" value={query} onChange={setQuery} />
      </div>

      {searching && (
        <div style={{ marginBottom: 'var(--sp-5)' }}>
          <SuchTreffer ergebnis={ergebnis} abfrage={query} />
        </div>
      )}

      {!searching && (
        <>
        {/* Der Pot-Odds-Drill steht hier oben und nicht im Trainer-Hub.
            Grund: Vom Öffnen der App bis zur ersten Aufgabe sollen zwei
            Berührungen reichen. Hub → Lernen → Drill sind zwei; über den
            Trainer-Hub wären es drei. */}
        <Link
          to="/lernen/drill"
          className="card clickable"
          style={{ display: 'block', marginBottom: 'var(--sp-5)', borderColor: 'rgba(212,175,94,0.35)' }}
        >
          <div className="row between wrap">
            <div className="row" style={{ alignItems: 'flex-start' }}>
              <IconTile name={zeichenFuer('/lernen/drill')} tone="gold" />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 'var(--fw-bold)', fontSize: 'var(--fs-h3)' }}>{L.drillTitle}</div>
                <div className="small muted" style={{ marginTop: 3 }}>{L.drillSub}</div>
              </div>
            </div>
            {neuDrill && <span className="pill gold">{L.drillPill}</span>}
          </div>
        </Link>

        {/* Üben und festigen.
            Dieser Block hat lange gefehlt, und das Fehlen war unsichtbar:
            Trainer, Wiederholen, Tages-Quiz, Übungstisch und Spielstil-Analyse
            standen nur in der Seitenleiste – die unter 920 px ausgeblendet
            ist. Auf dem Handy waren sie damit über den Lernbereich gar nicht
            erreichbar. Ein Durchlauf über alle Seiten hat es aufgedeckt. */}
        <div className="section-title">{L.practiceGroupTitle}</div>
        <div className="grid cols-2" style={{ marginBottom: 'var(--sp-5)' }}>
          {uebungen.map((u) => (
            <Link key={u.to} to={u.to} className="card clickable">
              <div className="row" style={{ alignItems: 'flex-start' }}>
                <IconTile name={u.icon} tone={u.tone} />
                <div style={{ minWidth: 0 }}>
                  <div className="row" style={{ gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 'var(--fw-bold)' }}>{u.title}</span>
                    <Schloss pfad={u.to} />
                    {u.badge && <span className="pill gold">{u.badge}</span>}
                  </div>
                  <div className="small muted" style={{ marginTop: 3 }}>{u.sub}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Link to="/lernen/pros" className="card clickable" style={{ display: 'block', marginBottom: 16, borderColor: 'rgba(212,175,94,0.35)' }}>
          <div className="row between wrap">
            <div>
              <div style={{ fontWeight: 800, fontSize: 'var(--fs-fliesstext)' }}>{L.proTitle}</div>
              <div className="small muted" style={{ marginTop: 3 }}>
                {L.proSub}
              </div>
            </div>
            <span className="kachel-marken">
              <Schloss pfad="/lernen/pros" />
              {neuPros && <span className="pill gold">{L.newPill}</span>}
            </span>
          </div>
        </Link>
        </>
      )}
    </div>
  );
}
