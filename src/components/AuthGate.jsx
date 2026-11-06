import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export default function AuthGate({ children }) {
  const { loading, session } = useAuth();
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-black/40">
        Yuklanmoqda...
      </div>
    );
  }
  if (!session) return <Navigate to="/login" replace />;
  return children;
}
