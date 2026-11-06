import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { AuthDivider, GoogleButton, GuestButton } from '../components/AuthExtras';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      await signIn(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Kirishda xatolik');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-white to-white px-4 dark:from-[#1c1420] dark:via-[#141017] dark:to-[#141017]">
      <div className="card w-full max-w-sm p-7">
        <div className="mb-6 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-lg font-black text-white">A</span>
          <span className="text-xl font-extrabold">IELTS Arena</span>
        </div>
        <h1 className="mb-1 text-lg font-bold">Xush kelibsiz</h1>
        <p className="mb-5 text-sm text-black/50 dark:text-white/50">Hisobingizga kiring va mashqni davom ettiring.</p>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="input" type="password" placeholder="Parol" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button className="btn-primary mt-1" disabled={busy}>{busy ? '...' : 'Kirish'}</button>
        </form>

        <AuthDivider />
        <div className="flex flex-col gap-2">
          <GoogleButton />
          <GuestButton />
        </div>

        <p className="mt-5 text-center text-sm text-black/50 dark:text-white/50">
          Hisobingiz yo'qmi? <Link to="/signup" className="font-semibold text-brand-600 dark:text-brand-300">Ro'yxatdan o'tish</Link>
        </p>
      </div>
    </div>
  );
}
