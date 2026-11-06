import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export default function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      const data = await signUp(email, password, username);
      if (data.session) navigate('/');
      else setSent(true);
    } catch (err) {
      setError(err.message || "Ro'yxatdan o'tishda xatolik");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="card max-w-sm p-7 text-center">
          <p className="text-2xl">📬</p>
          <h1 className="mt-2 text-lg font-bold">Emailni tasdiqlang</h1>
          <p className="mt-2 text-sm text-black/60 dark:text-white/60">
            {email} manziliga tasdiqlash xati yuborildi. Havolani bosib, keyin tizimga kiring.
          </p>
          <Link to="/login" className="btn-primary mt-5 inline-block">Kirish sahifasi</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-white to-white px-4 dark:from-[#1c1420] dark:via-[#141017] dark:to-[#141017]">
      <div className="card w-full max-w-sm p-7">
        <div className="mb-6 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-lg font-black text-white">A</span>
          <span className="text-xl font-extrabold">IELTS Arena</span>
        </div>
        <h1 className="mb-1 text-lg font-bold">Ro'yxatdan o'tish</h1>
        <p className="mb-5 text-sm text-black/50 dark:text-white/50">Darajangizni sinab ko'rishdan boshlaymiz.</p>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <input className="input" placeholder="Ism (foydalanuvchi nomi)" value={username} onChange={(e) => setUsername(e.target.value)} required minLength={2} />
          <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="input" type="password" placeholder="Parol (6+ belgi)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button className="btn-primary mt-1" disabled={busy}>{busy ? '...' : 'Boshlash'}</button>
        </form>
        <p className="mt-5 text-center text-sm text-black/50 dark:text-white/50">
          Hisobingiz bormi? <Link to="/login" className="font-semibold text-brand-600 dark:text-brand-300">Kirish</Link>
        </p>
      </div>
    </div>
  );
}
