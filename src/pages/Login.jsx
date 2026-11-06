import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { AuthDivider, GoogleButton, GuestButton } from '../components/AuthExtras';

function useExpiredSessionNotice() {
  const [expired] = useState(() => {
    try {
      if (sessionStorage.getItem('ia-session-expired')) {
        sessionStorage.removeItem('ia-session-expired');
        return true;
      }
    } catch { /* ignore */ }
    return false;
  });
  return expired;
}

function friendlyError(msg) {
  if (!msg) return msg;
  if (msg.includes('Invalid login credentials')) return "Email yoki parol noto'g'ri.";
  if (msg.includes('rate limit')) return "Hozir juda ko'p urinish bo'ldi, biroz kutib qaytadan urining.";
  return msg;
}

export default function Login() {
  const { signIn, sendPasswordReset } = useAuth();
  const navigate = useNavigate();
  const sessionExpired = useExpiredSessionNotice();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      await signIn(email, password);
      navigate('/');
    } catch (err) {
      setError(friendlyError(err.message) || 'Kirishda xatolik');
    } finally {
      setBusy(false);
    }
  }

  async function onReset(e) {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      await sendPasswordReset(email);
      setResetSent(true);
    } catch (err) {
      setError(friendlyError(err.message) || 'Xatolik yuz berdi');
    } finally {
      setBusy(false);
    }
  }

  if (forgot) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-white to-white px-4 dark:from-[#1c1420] dark:via-[#141017] dark:to-[#141017]">
        <div className="card w-full max-w-sm p-7">
          <div className="mb-6 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-lg font-black text-white">A</span>
            <span className="text-xl font-extrabold">IELTS Arena</span>
          </div>
          {resetSent ? (
            <>
              <p className="text-2xl">📬</p>
              <h1 className="mt-2 text-lg font-bold">Xat yuborildi</h1>
              <p className="mt-2 text-sm text-black/60 dark:text-white/60">{email} manziliga parolni tiklash havolasi yuborildi.</p>
              <button className="btn-primary mt-5 w-full" onClick={() => { setForgot(false); setResetSent(false); }}>Kirish sahifasiga</button>
            </>
          ) : (
            <>
              <h1 className="mb-1 text-lg font-bold">Parolni unutdingizmi?</h1>
              <p className="mb-5 text-sm text-black/50 dark:text-white/50">Emailingizni kiriting, tiklash havolasini yuboramiz.</p>
              <form onSubmit={onReset} className="flex flex-col gap-3">
                <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button className="btn-primary mt-1" disabled={busy}>{busy ? '...' : 'Havola yuborish'}</button>
                <button type="button" className="btn-outline" onClick={() => setForgot(false)}>Orqaga</button>
              </form>
            </>
          )}
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
        <h1 className="mb-1 text-lg font-bold">Xush kelibsiz</h1>
        <p className="mb-5 text-sm text-black/50 dark:text-white/50">Hisobingizga kiring va mashqni davom ettiring.</p>
        {sessionExpired && (
          <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-500/10 dark:text-amber-200">
            Sessiyangiz eskirgan edi, shuning uchun chiqarildingiz. Iltimos, qaytadan kiring.
          </div>
        )}
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="input" type="password" placeholder="Parol" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button className="btn-primary mt-1" disabled={busy}>{busy ? '...' : 'Kirish'}</button>
          <button type="button" className="self-center text-sm text-black/50 underline-offset-2 hover:underline dark:text-white/50" onClick={() => { setError(''); setForgot(true); }}>
            Parolni unutdingizmi?
          </button>
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
