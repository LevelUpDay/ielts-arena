import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export default function AuthGate({ children }) {
  const { loading, session, planChecked, plan } = useAuth();
  if (loading || (session && !planChecked)) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-black/40">
        Yuklanmoqda...
      </div>
    );
  }
  if (!session) return <Navigate to="/login" replace />;
  if (!plan) return <Navigate to="/onboarding" replace />;
  return children;
}

export function OnboardingGate({ children }) {
  const { loading, session, planChecked, plan } = useAuth();
  if (loading || (session && !planChecked)) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-black/40">
        Yuklanmoqda...
      </div>
    );
  }
  if (!session) return <Navigate to="/login" replace />;
  if (plan) return <Navigate to="/" replace />;
  return children;
}
