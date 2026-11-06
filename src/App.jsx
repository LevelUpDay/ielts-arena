import { HashRouter, Routes, Route, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import AuthGate, { OnboardingGate } from './components/AuthGate';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ResetPassword from './pages/ResetPassword';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ComingSoon from './pages/ComingSoon';
import ListeningHome from './listening/ListeningHome';
import ListeningSession from './listening/ListeningSession';
import FullSection from './listening/FullSection';
import ListeningStats from './listening/ListeningStats';
import ReadingHome from './reading/ReadingHome';
import ReadingSession from './reading/ReadingSession';
import ConcentrationHome from './concentration/ConcentrationHome';
import MindWanderGame from './concentration/MindWanderGame';
import StroopGame from './concentration/StroopGame';
import NBackGame from './concentration/NBackGame';

// Remounts the wrapped component whenever the :type route param changes —
// React Router reuses the component instance for sibling param matches, so
// without this, switching from e.g. /listening/thf to /listening/match keeps
// stale generated items around instead of generating fresh ones.
function KeyedByType({ Component }) {
  const { type } = useParams();
  return <Component key={type} />;
}

function AppRoutes() {
  const { recovery } = useAuth();

  // Supabase sends a "password recovery" session via the email link; whatever
  // path that link happened to land on, show the reset form until it's done.
  if (recovery) return <ResetPassword />;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/onboarding" element={<OnboardingGate><Onboarding /></OnboardingGate>} />

      <Route element={<AuthGate><Layout /></AuthGate>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/listening" element={<ListeningHome />} />
        <Route path="/listening/section" element={<FullSection />} />
        <Route path="/listening/stats" element={<ListeningStats />} />
        <Route path="/listening/:type" element={<KeyedByType Component={ListeningSession} />} />

        <Route path="/reading" element={<ReadingHome />} />
        <Route path="/reading/:type" element={<KeyedByType Component={ReadingSession} />} />

        <Route path="/concentration" element={<ConcentrationHome />} />
        <Route path="/concentration/mindwander" element={<MindWanderGame />} />
        <Route path="/concentration/stroop" element={<StroopGame />} />
        <Route path="/concentration/nback" element={<NBackGame />} />

        <Route path="/speaking" element={<ComingSoon title="Speaking" emoji="🗣️" />} />
        <Route path="/writing" element={<ComingSoon title="Writing" emoji="✍️" />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
}
