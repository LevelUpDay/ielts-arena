import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { SKILLS } from '../lib/rating';
import { CEFR_LEVELS, REFERRAL_OPTIONS } from '../lib/plan';

const MINUTE_OPTIONS = [15, 30, 45, 60, 90, 120];
const PLAN_SKILLS = SKILLS.filter((s) => s.ready);

export default function Onboarding() {
  const { createPlan } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [referral, setReferral] = useState('');
  const [referralOther, setReferralOther] = useState('');
  const [cefr, setCefr] = useState({}); // { listening: 'B1', ... } — absent key = "test me instead"
  const [totalDays, setTotalDays] = useState(30);
  const [dailyMinutes, setDailyMinutes] = useState(30);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  function toggleCefr(skill, level) {
    setCefr((c) => ({ ...c, [skill]: c[skill] === level ? undefined : level }));
  }

  async function finish() {
    setBusy(true); setError('');
    try {
      await createPlan({
        referral: referral === 'Boshqa' ? (referralOther || 'Boshqa') : referral,
        totalDays: Math.max(1, Math.min(180, Number(totalDays) || 30)),
        dailyMinutes: Math.max(5, Math.min(300, Number(dailyMinutes) || 30)),
        cefrBySkill: cefr,
      });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Xatolik yuz berdi');
    } finally {
      setBusy(false);
    }
  }

  const steps = ['Tanishuv', 'Daraja', 'Reja'];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-white to-white px-4 py-10 dark:from-[#1c1420] dark:via-[#141017] dark:to-[#141017]">
      <div className="card w-full max-w-lg p-7">
        <div className="mb-6 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-lg font-black text-white">A</span>
          <span className="text-xl font-extrabold">IELTS Arena</span>
        </div>

        <div className="mb-6 flex gap-2">
          {steps.map((s, i) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-brand-500' : 'bg-black/10 dark:bg-white/10'}`} />
          ))}
        </div>

        {step === 0 && (
          <div>
            <h1 className="mb-1 text-lg font-bold">Ilova haqida qayerdan bilib oldingiz?</h1>
            <p className="mb-5 text-sm text-black/50 dark:text-white/50">Bu bizga yordam berish uchun kerak.</p>
            <div className="flex flex-col gap-2">
              {REFERRAL_OPTIONS.map((o) => (
                <button
                  key={o}
                  className={`btn-outline justify-start ${referral === o ? '!border-brand-500 !bg-brand-50 dark:!bg-brand-500/10' : ''}`}
                  onClick={() => setReferral(o)}
                >
                  {o}
                </button>
              ))}
              {referral === 'Boshqa' && (
                <input className="input" placeholder="Qayerdan?" value={referralOther} onChange={(e) => setReferralOther(e.target.value)} />
              )}
            </div>
            <button className="btn-primary mt-6 w-full" disabled={!referral} onClick={() => setStep(1)}>Davom etish</button>
          </div>
        )}

        {step === 1 && (
          <div>
            <h1 className="mb-1 text-lg font-bold">Darajangizni bilasizmi?</h1>
            <p className="mb-5 text-sm text-black/50 dark:text-white/50">
              CEFR darajangizni tanlang, yoki bo'sh qoldiring — birinchi mashqda avtomatik aniqlaymiz.
            </p>
            <div className="flex flex-col gap-4">
              {PLAN_SKILLS.map((s) => (
                <div key={s.key}>
                  <p className="mb-1.5 text-sm font-semibold">{s.emoji} {s.label}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {CEFR_LEVELS.map((l) => (
                      <button
                        key={l}
                        className={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition ${
                          cefr[s.key] === l
                            ? 'border-brand-500 bg-brand-500 text-white'
                            : 'border-black/10 hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/5'
                        }`}
                        onClick={() => toggleCefr(s.key, l)}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-2">
              <button className="btn-outline" onClick={() => setStep(0)}>Orqaga</button>
              <button className="btn-primary flex-1" onClick={() => setStep(2)}>Davom etish</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="mb-1 text-lg font-bold">Rejangiz</h1>
            <p className="mb-5 text-sm text-black/50 dark:text-white/50">Necha kun va kuniga qancha vaqt ajrata olasiz?</p>

            <label className="mb-1 block text-sm font-semibold">Necha kun tayyorlanmoqchisiz?</label>
            <input className="input mb-4" type="number" min={1} max={180} value={totalDays} onChange={(e) => setTotalDays(e.target.value)} />

            <label className="mb-1 block text-sm font-semibold">Kuniga qancha vaqt?</label>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {MINUTE_OPTIONS.map((m) => (
                <button
                  key={m}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition ${
                    dailyMinutes === m
                      ? 'border-brand-500 bg-brand-500 text-white'
                      : 'border-black/10 hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/5'
                  }`}
                  onClick={() => setDailyMinutes(m)}
                >
                  {m} daqiqa
                </button>
              ))}
            </div>

            {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
            <div className="flex gap-2">
              <button className="btn-outline" onClick={() => setStep(1)}>Orqaga</button>
              <button className="btn-primary flex-1" disabled={busy} onClick={finish}>{busy ? '...' : 'Rejani yaratish'}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
