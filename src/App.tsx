import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { Layout } from './components/Layout';
import { horcheAufBedienung } from './lib/design/haptik';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Onboarding } from './components/Onboarding';
import { PaywallModal } from './components/pro/PaywallModal';
import { UpgradePage } from './pages/UpgradePage';
import { LegalPage } from './pages/LegalPage';
import { CancelPage } from './pages/CancelPage';
import { HubPage } from './pages/HubPage';
import { ReferencePage } from './pages/ReferencePage';
import { SessionPage } from './pages/SessionPage';
import { StatsPage } from './pages/StatsPage';
import { LearnPage } from './pages/LearnPage';
import { ModulePage } from './pages/ModulePage';
import { LessonPage } from './pages/LessonPage';
import { ReviewPage } from './pages/ReviewPage';
import { DailyQuizPage } from './pages/DailyQuizPage';
import { ProInsightsPage } from './pages/ProInsightsPage';
import { ScenarioTrainer } from './pages/trainers/ScenarioTrainer';
import { PushFoldTrainer } from './pages/trainers/PushFoldTrainer';
import { PreflopTrainer } from './pages/trainers/PreflopTrainer';
import { PotOddsTrainer } from './pages/trainers/PotOddsTrainer';
import { PotOddsDrill } from './pages/trainers/PotOddsDrill';
import { EquityTrainer } from './pages/trainers/EquityTrainer';
import { HandRankTrainer } from './pages/trainers/HandRankTrainer';
import { OutsTrainer } from './pages/trainers/OutsTrainer';
import { PlayPage } from './pages/PlayPage';
import { CoachPage } from './pages/CoachPage';
import { PayoutPage } from './pages/session/PayoutPage';
import { AbendePage } from './pages/live/AbendePage';
import { AbendPage } from './pages/live/AbendPage';
import { EinrichtenPage } from './pages/live/EinrichtenPage';
import { SpielerPage } from './pages/live/SpielerPage';
import { TischPage } from './pages/live/TischPage';
import { EquityCalc } from './pages/tools/EquityCalc';
import { RangeViewer } from './pages/tools/RangeViewer';
import { OddsTables } from './pages/tools/OddsTables';
import { BankrollTracker } from './pages/tools/BankrollTracker';
import { TellsPage } from './pages/tools/TellsPage';
import { HandExplorer } from './pages/tools/HandExplorer';
import { ChipCalculator } from './pages/tools/ChipCalculator';
import { GlossaryPage } from './pages/GlossaryPage';
import { ProfilePage } from './pages/ProfilePage';
import { FriendsPage } from './pages/FriendsPage';

/* Routen nach der Struktur aus docs/SCREEN_STRUKTUR.md:
   Hub → Bereich → Detail, drei Bereiche.

   Die drei Bereiche trennen nach ABSICHT, nicht nach Thema
   (ENTSCHEIDUNGEN.md, E-011):

     /lernen        es gibt einen Fortschritt – man kommt wieder und ist weiter
     /nachschlagen  es gibt keinen – man will eine Antwort und ist dann fertig
     /session       man sitzt am echten Tisch, die App zählt und rechnet

   Alte Pfade bleiben als Weiterleitungen bestehen. Zwei Gründe: Geteilte
   Links und Lesezeichen dürfen nicht brechen, und im PWA-Manifest stehen
   Verknüpfungen, die auf die alten Pfade zeigen. Eine Weiterleitung kostet
   nichts; ein toter Link kostet einen Nutzer.

   Regel für aufgelöste Bereiche: Ein einzelnes Ziel wird punktgenau
   weitergeleitet. Ein ehemaliger SAMMELPFAD wie /live oder /tools hat keinen
   Nachfolger mehr – sein Inhalt liegt jetzt in zwei verschiedenen Bereichen.
   Der ehrliche Zielort ist dann der Hub, nicht der zufällig ähnlichste
   Bereich: Von dort ist alles einen Tipp entfernt, und niemand landet auf
   einer Seite, die drei von vier Malen falsch ist. */

/** Adressen, auf denen der Willkommensdialog wartet, statt sich vorzudrängen.
 *
 *  Wer über einen geteilten Link kommt, will die Aufgabe sehen, die ihm
 *  jemand geschickt hat – nicht zuerst seinen Namen eintragen. Der Dialog ist
 *  damit nicht abgeschafft: `firstRun` bleibt gesetzt, und sobald jemand von
 *  der geteilten Aufgabe weiter in die App geht, kommt er. Aufgeschoben, nicht
 *  übersprungen. */
function istGeteilteAufgabe(pfad: string): boolean {
  return /^\/lernen\/drill\/.+/.test(pfad);
}

/** Bereiche, die den dunklen Tokensatz erzwingen.
 *
 *  Der Live-Bereich bleibt in jedem Modus dunkel: Das Gerät liegt bei
 *  gedimmtem Licht auf einem Pokertisch, und eine helle Fläche blendet die
 *  Runde und beleuchtet Gesichter. Nachschlagen und Lernen folgen der Wahl,
 *  die Live-Session nicht.
 *
 *  Das steht hier und nicht in den Bildschirmen: Ein Sonderfall je Bildschirm
 *  fehlt beim nächsten neuen — und dann sitzt jemand mit einer weißen Fläche
 *  am Tisch. */
const DUNKEL_ERZWUNGEN = ['/session'];

function erzwingtDunkel(pfad: string): boolean {
  return DUNKEL_ERZWUNGEN.some((p) => pfad === p || pfad.startsWith(`${p}/`));
}

export function App() {
  const ort = useLocation();

  /* Die haptische Rückmeldung wird an einer Stelle für die ganze App
     angemeldet. In jeden Bildschirm einzeln geschrieben, fehlte sie beim
     nächsten neuen Knopf, und niemandem fiele es auf. */
  useEffect(() => horcheAufBedienung(document), []);

  return (
    <ErrorBoundary>
      {!istGeteilteAufgabe(ort.pathname) && <Onboarding />}
      <PaywallModal />
      {/* Der dunkle Satz gilt für alles darunter — er hängt am Attribut,
          nicht an `:root`. Kein Bildschirm weiß davon. */}
      <div
        className="modus-rahmen"
        {...(erzwingtDunkel(ort.pathname) ? { 'data-modus': 'dunkel' } : {})}
      >
      <Routes>
        {/* Der Tischbildschirm liegt bewusst außerhalb des Layouts: Vollbild
            ohne die normale Navigation. Wer den Tisch führt, soll nicht
            versehentlich ins Glossar wischen. */}
        <Route path="/session/live" element={<TischPage />} />
        <Route element={<Layout />}>
          {/* ── Hub ──────────────────────────────────────────────────── */}
          <Route index element={<HubPage />} />

          {/* ── Bereich: Lernen ──────────────────────────────────────── */}
          <Route path="/lernen" element={<LearnPage />} />
          <Route path="/lernen/wiederholen" element={<ReviewPage />} />
          <Route path="/lernen/tagesquiz" element={<DailyQuizPage />} />
          <Route path="/lernen/pros" element={<ProInsightsPage />} />
          {/* Der Pot-Odds-Drill liegt bewusst NICHT unter /lernen/trainer/:
              Vom Öffnen der App bis zur ersten Aufgabe sollen zwei
              Berührungen reichen (Hub → Lernen → Drill). Über den
              Trainer-Hub wären es drei. */}
          <Route path="/lernen/drill" element={<PotOddsDrill />} />
          {/* Die Aufgabe steht in der Adresse. Wer den Link öffnet,
              sieht dieselbe Situation – ohne Datenbank, ohne Server. */}
          <Route path="/lernen/drill/:code" element={<PotOddsDrill />} />
          {/* Der Trainer-Hub war ein Bildschirm, dessen einziger Zweck ein
              Menü war — und er lag zwischen Lernseite und Trainer, also bei
              drei Berührungen. Die sieben Trainer stehen jetzt samt ihrer
              Trefferquote auf der Lernseite. Die Adresse bleibt als
              Umleitung, damit alte Lesezeichen nicht ins Leere laufen. */}
          <Route path="/lernen/trainer" element={<Navigate to="/lernen" replace />} />
          <Route path="/lernen/trainer/szenario" element={<ScenarioTrainer />} />
          <Route path="/lernen/trainer/pushfold" element={<PushFoldTrainer />} />
          <Route path="/lernen/trainer/preflop" element={<PreflopTrainer />} />
          <Route path="/lernen/trainer/potodds" element={<PotOddsTrainer />} />
          <Route path="/lernen/trainer/equity" element={<EquityTrainer />} />
          <Route path="/lernen/trainer/handranking" element={<HandRankTrainer />} />
          <Route path="/lernen/trainer/outs" element={<OutsTrainer />} />
          {/* Übungstisch und Spielstil-Analyse gehören zu „Lernen": Der eine
              ist die Übung zum Kurs, die andere zeigt Fortschritt (E-011). */}
          <Route path="/lernen/uebungstisch" element={<PlayPage />} />
          <Route path="/lernen/statistik" element={<StatsPage />} />
          {/* Das Glossar hat keinen Fortschritt und ist damit Nachschlagen,
              nicht Lernen (E-011). Muss hier oben stehen, sonst liest ein
              Mensch es als Modul – die Route selbst wäre auch unten korrekt. */}
          <Route path="/lernen/glossar" element={<Navigate to="/nachschlagen/glossar" replace />} />
          {/* Muss NACH den festen Unterpfaden stehen, sonst würde
              „wiederholen" als Modul-Kennung gelesen. */}
          <Route path="/lernen/:moduleId" element={<ModulePage />} />
          <Route path="/lernen/:moduleId/:lessonId" element={<LessonPage />} />

          {/* ── Bereich: Nachschlagen ────────────────────────────────── */}
          <Route path="/nachschlagen" element={<ReferencePage />} />
          <Route path="/nachschlagen/coach" element={<CoachPage />} />
          <Route path="/nachschlagen/glossar" element={<GlossaryPage />} />
          <Route path="/nachschlagen/haende" element={<HandExplorer />} />
          <Route path="/nachschlagen/ranges" element={<RangeViewer />} />
          <Route path="/nachschlagen/odds" element={<OddsTables />} />
          <Route path="/nachschlagen/equity" element={<EquityCalc />} />
          <Route path="/nachschlagen/tells" element={<TellsPage />} />

          {/* ── Bereich: Live-Session ────────────────────────────────── */}
          <Route path="/session" element={<SessionPage />} />
          <Route path="/session/chips" element={<ChipCalculator />} />
          <Route path="/session/auszahlung" element={<PayoutPage />} />
          <Route path="/session/live/einrichten" element={<EinrichtenPage />} />
          <Route path="/session/abende" element={<AbendePage />} />
          <Route path="/session/abende/:id" element={<AbendPage />} />
          <Route path="/session/spieler/:name" element={<SpielerPage />} />
          <Route path="/session/bankroll" element={<BankrollTracker />} />

          {/* ── Persönliches ─────────────────────────────────────────── */}
          <Route path="/profil" element={<ProfilePage />} />
          <Route path="/freunde" element={<FriendsPage />} />
          <Route path="/pro" element={<UpgradePage />} />
          <Route path="/rechtliches" element={<LegalPage />} />
          <Route path="/kuendigen" element={<CancelPage />} />

          {/* ── Weiterleitungen von den alten Pfaden ─────────────────── */}
          {/* ── Alte Pfade ───────────────────────────────────────────
              Einzelne Ziele punktgenau; aufgelöste Sammelpfade auf den Hub. */}
          <Route path="/wiederholen" element={<Navigate to="/lernen/wiederholen" replace />} />
          <Route path="/tagesquiz" element={<Navigate to="/lernen/tagesquiz" replace />} />
          <Route path="/pros" element={<Navigate to="/lernen/pros" replace />} />
          <Route path="/trainer" element={<Navigate to="/lernen/trainer" replace />} />
          <Route path="/trainer/:id" element={<TrainerRedirect />} />
          <Route path="/spielen" element={<Navigate to="/lernen/uebungstisch" replace />} />

          <Route path="/glossar" element={<Navigate to="/nachschlagen/glossar" replace />} />
          <Route path="/coach" element={<Navigate to="/nachschlagen/coach" replace />} />

          {/* Der Tisch ist aus dem inhaltlichen Rahmen gefallen (E-030). Die
              alten Links bleiben trotzdem: Ein geteilter Link darf nicht ins
              Leere laufen, nur weil eine Entscheidung gefallen ist. Ziel ist
              der Bereich, in dem der Tisch lag. */}
          <Route path="/tisch" element={<Navigate to="/session" replace />} />
          <Route path="/tisch/online" element={<Navigate to="/session" replace />} />

          {/* Gliederung vom 26.08.2026 – nur einen Tag alt, aber im
              PWA-Manifest und in geteilten Links bereits unterwegs. */}
          <Route path="/live/coach" element={<Navigate to="/nachschlagen/coach" replace />} />
          <Route path="/live/tisch" element={<Navigate to="/session" replace />} />
          <Route path="/live/tisch/online" element={<Navigate to="/session" replace />} />
          <Route path="/live/uebungstisch" element={<Navigate to="/lernen/uebungstisch" replace />} />
          <Route path="/live/statistik" element={<Navigate to="/lernen/statistik" replace />} />
          <Route path="/live" element={<Navigate to="/" replace />} />

          <Route path="/tools/chips" element={<Navigate to="/session/chips" replace />} />
          <Route path="/tools/bankroll" element={<Navigate to="/session/bankroll" replace />} />
          <Route path="/tools/equity" element={<Navigate to="/nachschlagen/equity" replace />} />
          <Route path="/tools/odds" element={<Navigate to="/nachschlagen/odds" replace />} />
          <Route path="/tools/ranges" element={<Navigate to="/nachschlagen/ranges" replace />} />
          <Route path="/tools/hands" element={<Navigate to="/nachschlagen/haende" replace />} />
          <Route path="/tools/tells" element={<Navigate to="/nachschlagen/tells" replace />} />
          <Route path="/tools" element={<Navigate to="/" replace />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      </div>
    </ErrorBoundary>
  );
}

/* Eigene Komponente statt einer Weiterleitung je Trainer: sieben fast
   gleiche Zeilen wären reines Abschreiben, und beim achten Trainer würde
   eine davon vergessen.

   useParams statt window.location: Der Router kennt den Wert bereits sauber
   entschlüsselt – ihn aus der Adresszeile zu zerlegen wäre fehleranfällig
   und würde bei Sonderzeichen brechen. */
function TrainerRedirect() {
  const { id } = useParams();
  return <Navigate to={id ? `/lernen/trainer/${id}` : '/lernen/trainer'} replace />;
}
