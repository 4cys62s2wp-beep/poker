import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './pages/Dashboard';
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

export function App() {
  return (
    <ErrorBoundary>
      <Onboarding />
      <Routes>
        <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="/lernen" element={<LearnPage />} />
        <Route path="/lernen/:moduleId" element={<ModulePage />} />
        <Route path="/lernen/:moduleId/:lessonId" element={<LessonPage />} />
        <Route path="/pros" element={<ProInsightsPage />} />
        <Route path="/wiederholen" element={<ReviewPage />} />
        <Route path="/tagesquiz" element={<DailyQuizPage />} />
        <Route path="/trainer" element={<TrainerHub />} />
        <Route path="/trainer/szenario" element={<ScenarioTrainer />} />
        <Route path="/trainer/pushfold" element={<PushFoldTrainer />} />
        <Route path="/trainer/preflop" element={<PreflopTrainer />} />
        <Route path="/trainer/potodds" element={<PotOddsTrainer />} />
        <Route path="/trainer/equity" element={<EquityTrainer />} />
        <Route path="/trainer/handranking" element={<HandRankTrainer />} />
        <Route path="/trainer/outs" element={<OutsTrainer />} />
        <Route path="/spielen" element={<PlayPage />} />
        <Route path="/coach" element={<CoachPage />} />
        <Route path="/tools" element={<ToolsHub />} />
        <Route path="/tools/equity" element={<EquityCalc />} />
        <Route path="/tools/ranges" element={<RangeViewer />} />
        <Route path="/tools/odds" element={<OddsTables />} />
        <Route path="/tools/bankroll" element={<BankrollTracker />} />
        <Route path="/tools/tells" element={<TellsPage />} />
        <Route path="/tools/hands" element={<HandExplorer />} />
        <Route path="/tools/chips" element={<ChipCalculator />} />
        <Route path="/glossar" element={<GlossaryPage />} />
        <Route path="/profil" element={<ProfilePage />} />
        <Route path="*" element={<Dashboard />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}
