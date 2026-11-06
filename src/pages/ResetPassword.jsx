import { useState } from 'react';
import { useAuth } from '../lib/auth';

export default function ResetPassword() {
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError("Parollar mos emas"); return; }
    setBusy(true);
    try {
      await updatePassword(password);
      setDone(true);
    } catch (err) {
      setError(err.message || 'Xatolik yuz berdi');
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
        {done ? (
          <>
            <p className="text-2xl">✅</p>
            <h1 className="mt-2 text-lg font-bold">Parol yangilandi</h1>
            <p className="mt-2 text-sm text-black/60 dark:text-white/60">Endi yangi parol bilan davom etishingiz mumkin.</p>
            <button className="btn-primary mt-5 w-full" onClick={() => window.location.reload()}>Davom etish</button>
          </>
        ) : (
          <>
            <h1 className="mb-1 text-lg font-bold">Yangi parol o'rnating</h1>
            <p className="mb-5 text-sm text-black/50 dark:text-white/50">Hisobingiz uchun yangi parol kiriting.</p>
            <form onSubmit={onSubmit} className="flex flex-col gap-3">
              <input className="input" type="password" placeholder="Yangi parol (6+ belgi)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
              <input className="input" type="password" placeholder="Parolni takrorlang" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={6} />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button className="btn-primary mt-1" disabled={busy}>{busy ? '...' : 'Saqlash'}</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
