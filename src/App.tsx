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
import { LivePage } from './pages/LivePage';
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
import { EquityTrainer } from './pages/trainers/EquityTrainer';
import { HandRankTrainer } from './pages/trainers/HandRankTrainer';
import { OutsTrainer } from './pages/trainers/OutsTrainer';
import { PlayPage } from './pages/PlayPage';
import { CoachPage } from './pages/CoachPage';
import { ToolsHub } from './pages/ToolsHub';
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

   Alte Pfade bleiben als Weiterleitungen bestehen. Zwei Gründe: Geteilte
   Links und Lesezeichen dürfen nicht brechen, und im PWA-Manifest stehen
   Verknüpfungen, die auf die alten Pfade zeigen. Eine Weiterleitung kostet
   nichts; ein toter Link kostet einen Nutzer. */

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
          <Route path="/lernen/glossar" element={<GlossaryPage />} />
          <Route path="/lernen/trainer" element={<TrainerHub />} />
          <Route path="/lernen/trainer/szenario" element={<ScenarioTrainer />} />
          <Route path="/lernen/trainer/pushfold" element={<PushFoldTrainer />} />
          <Route path="/lernen/trainer/preflop" element={<PreflopTrainer />} />
          <Route path="/lernen/trainer/potodds" element={<PotOddsTrainer />} />
          <Route path="/lernen/trainer/equity" element={<EquityTrainer />} />
          <Route path="/lernen/trainer/handranking" element={<HandRankTrainer />} />
          <Route path="/lernen/trainer/outs" element={<OutsTrainer />} />
          {/* Muss NACH den festen Unterpfaden stehen, sonst würde
              „wiederholen" als Modul-Kennung gelesen. */}
          <Route path="/lernen/:moduleId" element={<ModulePage />} />
          <Route path="/lernen/:moduleId/:lessonId" element={<LessonPage />} />

          {/* ── Bereich: Live spielen ────────────────────────────────── */}
          <Route path="/live" element={<LivePage />} />
          <Route path="/live/coach" element={<CoachPage />} />
          <Route path="/live/tisch" element={<LocalTablePage />} />
          <Route path="/live/tisch/online" element={<OnlineTablePage />} />
          <Route path="/live/uebungstisch" element={<PlayPage />} />
          <Route path="/live/statistik" element={<StatsPage />} />

          {/* ── Bereich: Session-Tools ───────────────────────────────── */}
          <Route path="/tools" element={<ToolsHub />} />
          <Route path="/tools/chips" element={<ChipCalculator />} />
          <Route path="/tools/bankroll" element={<BankrollTracker />} />
          <Route path="/tools/equity" element={<EquityCalc />} />
          <Route path="/tools/odds" element={<OddsTables />} />
          <Route path="/tools/ranges" element={<RangeViewer />} />
          <Route path="/tools/hands" element={<HandExplorer />} />
          <Route path="/tools/tells" element={<TellsPage />} />

          {/* ── Persönliches ─────────────────────────────────────────── */}
          <Route path="/profil" element={<ProfilePage />} />
          <Route path="/freunde" element={<FriendsPage />} />
          <Route path="/pro" element={<UpgradePage />} />
          <Route path="/rechtliches" element={<LegalPage />} />
          <Route path="/kuendigen" element={<CancelPage />} />

          {/* ── Weiterleitungen von den alten Pfaden ─────────────────── */}
          <Route path="/wiederholen" element={<Navigate to="/lernen/wiederholen" replace />} />
          <Route path="/tagesquiz" element={<Navigate to="/lernen/tagesquiz" replace />} />
          <Route path="/pros" element={<Navigate to="/lernen/pros" replace />} />
          <Route path="/glossar" element={<Navigate to="/lernen/glossar" replace />} />
          <Route path="/trainer" element={<Navigate to="/lernen/trainer" replace />} />
          <Route path="/trainer/:id" element={<TrainerRedirect />} />
          <Route path="/coach" element={<Navigate to="/live/coach" replace />} />
          <Route path="/spielen" element={<Navigate to="/live/uebungstisch" replace />} />
          <Route path="/tisch" element={<Navigate to="/live/tisch" replace />} />
          <Route path="/tisch/online" element={<Navigate to="/live/tisch/online" replace />} />

          {/* Unbekannter Pfad: zurück zum Hub. */}
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
