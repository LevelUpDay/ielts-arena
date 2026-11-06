import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.4 0-13.8 4.1-17.1 10.1z" />
      <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.6C29.6 35.2 26.9 36 24 36c-5.3 0-9.7-3.1-11.3-7.6l-6.6 5.1C9.9 39.8 16.4 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.7l6.6 5.6C40.9 36.6 44 31 44 24c0-1.3-.1-2.7-.4-3.5z" />
    </svg>
  );
}

export function AuthDivider() {
  return (
    <div className="my-4 flex items-center gap-3">
      <span className="h-px flex-1 bg-black/10 dark:bg-white/10" />
      <span className="text-xs text-black/40 dark:text-white/40">yoki</span>
      <span className="h-px flex-1 bg-black/10 dark:bg-white/10" />
    </div>
  );
}

export function GoogleButton() {
  const { signInWithGoogle } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function onClick() {
    setError(''); setBusy(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err.message || 'Google bilan kirishda xatolik');
      setBusy(false);
    }
  }

  return (
    <div>
      <button type="button" className="btn-outline w-full" onClick={onClick} disabled={busy}>
        <GoogleIcon /> Google bilan kirish
      </button>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}

export function GuestButton() {
  const { signInAsGuest } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function onClick() {
    setError(''); setBusy(true);
    try {
      await signInAsGuest();
      navigate('/');
    } catch (err) {
      setError(err.message || "Mehmon sifatida kirishda xatolik");
      setBusy(false);
    }
  }

  return (
    <div>
      <button type="button" className="btn-ghost w-full" onClick={onClick} disabled={busy}>
        {busy ? '...' : "👤 Mehmon sifatida kirish"}
      </button>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
