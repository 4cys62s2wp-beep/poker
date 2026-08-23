import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { LearnPage } from './pages/LearnPage';
import { ModulePage } from './pages/ModulePage';
import { LessonPage } from './pages/LessonPage';
import { TrainerHub } from './pages/TrainerHub';
import { PreflopTrainer } from './pages/trainers/PreflopTrainer';
import { PotOddsTrainer } from './pages/trainers/PotOddsTrainer';
import { EquityTrainer } from './pages/trainers/EquityTrainer';
import { HandRankTrainer } from './pages/trainers/HandRankTrainer';
import { OutsTrainer } from './pages/trainers/OutsTrainer';
import { PlayPage } from './pages/PlayPage';
import { ToolsHub } from './pages/ToolsHub';
import { EquityCalc } from './pages/tools/EquityCalc';
import { RangeViewer } from './pages/tools/RangeViewer';
import { OddsTables } from './pages/tools/OddsTables';
import { BankrollTracker } from './pages/tools/BankrollTracker';
import { GlossaryPage } from './pages/GlossaryPage';
import { ProfilePage } from './pages/ProfilePage';

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="/lernen" element={<LearnPage />} />
        <Route path="/lernen/:moduleId" element={<ModulePage />} />
        <Route path="/lernen/:moduleId/:lessonId" element={<LessonPage />} />
        <Route path="/trainer" element={<TrainerHub />} />
        <Route path="/trainer/preflop" element={<PreflopTrainer />} />
        <Route path="/trainer/potodds" element={<PotOddsTrainer />} />
        <Route path="/trainer/equity" element={<EquityTrainer />} />
        <Route path="/trainer/handranking" element={<HandRankTrainer />} />
        <Route path="/trainer/outs" element={<OutsTrainer />} />
        <Route path="/spielen" element={<PlayPage />} />
        <Route path="/tools" element={<ToolsHub />} />
        <Route path="/tools/equity" element={<EquityCalc />} />
        <Route path="/tools/ranges" element={<RangeViewer />} />
        <Route path="/tools/odds" element={<OddsTables />} />
        <Route path="/tools/bankroll" element={<BankrollTracker />} />
        <Route path="/glossar" element={<GlossaryPage />} />
        <Route path="/profil" element={<ProfilePage />} />
        <Route path="*" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
