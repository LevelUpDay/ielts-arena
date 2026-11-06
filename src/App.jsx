import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import AuthGate from './components/AuthGate';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ComingSoon from './pages/ComingSoon';
import ListeningHome from './listening/ListeningHome';
import ListeningSession from './listening/ListeningSession';
import ReadingHome from './reading/ReadingHome';
import ReadingSession from './reading/ReadingSession';
import ConcentrationHome from './concentration/ConcentrationHome';
import StroopGame from './concentration/StroopGame';
import NBackGame from './concentration/NBackGame';
import ReactionGame from './concentration/ReactionGame';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<AuthGate><Layout /></AuthGate>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="/listening" element={<ListeningHome />} />
            <Route path="/listening/:type" element={<ListeningSession />} />

            <Route path="/reading" element={<ReadingHome />} />
            <Route path="/reading/:type" element={<ReadingSession />} />

            <Route path="/concentration" element={<ConcentrationHome />} />
            <Route path="/concentration/stroop" element={<StroopGame />} />
            <Route path="/concentration/nback" element={<NBackGame />} />
            <Route path="/concentration/reaction" element={<ReactionGame />} />

            <Route path="/speaking" element={<ComingSoon title="Speaking" emoji="🗣️" />} />
            <Route path="/writing" element={<ComingSoon title="Writing" emoji="✍️" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
