import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Onboarding } from './components/Onboarding';
import { PaywallModal } from './components/pro/PaywallModal';
import { UpgradePage } from './pages/UpgradePage';
import { LegalPage } from './pages/LegalPage';
import { CancelPage } from './pages/CancelPage';
import { LocalTablePage } from './pages/table/LocalTablePage';
import { OnlineTablePage } from './pages/table/OnlineTablePage';
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
import { TrainerHub } from './pages/TrainerHub';
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

export function App() {
  return (
    <ErrorBoundary>
      <Onboarding />
      <PaywallModal />
      <Routes>
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
          <Route path="/lernen/trainer" element={<TrainerHub />} />
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
          <Route path="/session/tisch" element={<LocalTablePage />} />
          <Route path="/session/tisch/online" element={<OnlineTablePage />} />
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

          <Route path="/tisch" element={<Navigate to="/session/tisch" replace />} />
          <Route path="/tisch/online" element={<Navigate to="/session/tisch/online" replace />} />

          {/* Gliederung vom 26.08.2026 – nur einen Tag alt, aber im
              PWA-Manifest und in geteilten Links bereits unterwegs. */}
          <Route path="/live/coach" element={<Navigate to="/nachschlagen/coach" replace />} />
          <Route path="/live/tisch" element={<Navigate to="/session/tisch" replace />} />
          <Route path="/live/tisch/online" element={<Navigate to="/session/tisch/online" replace />} />
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
