import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { SKILLS } from '../lib/rating';
import { CEFR_LEVELS, REFERRAL_OPTIONS } from '../lib/plan';

const MINUTE_OPTIONS = [15, 30, 45, 60, 90, 120];
const PLAN_SKILLS = SKILLS.filter((s) => s.ready);
const UNSURE = 'UNSURE';

function ReferralArt() {
  return (
    <svg viewBox="0 0 320 320" className="h-56 w-56 sm:h-72 sm:w-72" role="presentation">
      <circle cx="160" cy="160" r="150" fill="white" fillOpacity=".08" />
      <circle cx="160" cy="80" r="22" fill="white" fillOpacity=".9" />
      <circle cx="90" cy="190" r="16" fill="white" fillOpacity=".65" />
      <circle cx="230" cy="190" r="16" fill="white" fillOpacity=".65" />
      <circle cx="160" cy="250" r="14" fill="white" fillOpacity=".45" />
      <line x1="160" y1="80" x2="90" y2="190" stroke="white" strokeOpacity=".5" strokeWidth="3" />
      <line x1="160" y1="80" x2="230" y2="190" stroke="white" strokeOpacity=".5" strokeWidth="3" />
      <line x1="90" y1="190" x2="160" y2="250" stroke="white" strokeOpacity=".3" strokeWidth="3" />
      <line x1="230" y1="190" x2="160" y2="250" stroke="white" strokeOpacity=".3" strokeWidth="3" />
    </svg>
  );
}

function LevelArt() {
  return (
    <svg viewBox="0 0 320 320" className="h-56 w-56 sm:h-72 sm:w-72" role="presentation">
      <circle cx="160" cy="160" r="150" fill="white" fillOpacity=".08" />
      <path d="M70 190 A90 90 0 0 1 250 190" fill="none" stroke="white" strokeOpacity=".35" strokeWidth="16" strokeLinecap="round" />
      <path d="M70 190 A90 90 0 0 1 190 102" fill="none" stroke="white" strokeOpacity=".9" strokeWidth="16" strokeLinecap="round" />
      <circle cx="160" cy="190" r="10" fill="white" />
      <line x1="160" y1="190" x2="205" y2="130" stroke="white" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

function PlanArt() {
  return (
    <svg viewBox="0 0 320 320" className="h-56 w-56 sm:h-72 sm:w-72" role="presentation">
      <circle cx="160" cy="160" r="150" fill="white" fillOpacity=".08" />
      <rect x="90" y="90" width="140" height="130" rx="16" fill="white" fillOpacity=".9" />
      <rect x="90" y="90" width="140" height="34" rx="16" fill="white" />
      <circle cx="122" cy="160" r="9" fill="#ec4584" />
      <circle cx="160" cy="160" r="9" fill="#ec4584" fillOpacity=".4" />
      <circle cx="198" cy="160" r="9" fill="#ec4584" fillOpacity=".4" />
      <circle cx="122" cy="192" r="9" fill="#ec4584" fillOpacity=".4" />
      <circle cx="160" cy="192" r="9" fill="#ec4584" fillOpacity=".4" />
    </svg>
  );
}

const STEP_ART = [ReferralArt, LevelArt, PlanArt];
const STEP_TITLES = ['Tanishuv', 'Daraja', 'Reja'];

export default function Onboarding() {
  const { createPlan } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [referral, setReferral] = useState('');
  const [referralOther, setReferralOther] = useState('');
  const [cefr, setCefr] = useState({}); // { listening: 'B1' | 'UNSURE', ... }
  const [daysUnsure, setDaysUnsure] = useState(false);
  const [totalDays, setTotalDays] = useState(30);
  const [dailyMinutes, setDailyMinutes] = useState(30);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  function toggleCefr(skill, level) {
    setCefr((c) => ({ ...c, [skill]: c[skill] === level ? undefined : level }));
  }

  async function submit({ skip } = {}) {
    setBusy(true); setError('');
    try {
      const cefrBySkill = {};
      if (!skip) {
        Object.entries(cefr).forEach(([k, v]) => { if (v && v !== UNSURE) cefrBySkill[k] = v; });
      }
      await createPlan({
        referral: skip ? null : (referral === 'Boshqa' ? (referralOther || 'Boshqa') : referral) || null,
        totalDays: skip || daysUnsure ? null : Math.max(1, Math.min(180, Number(totalDays) || 30)),
        dailyMinutes: skip ? 30 : Math.max(5, Math.min(300, Number(dailyMinutes) || 30)),
        cefrBySkill,
      });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Xatolik yuz berdi');
    } finally {
      setBusy(false);
    }
  }

  const Art = STEP_ART[step];

  return (
    <div className="flex min-h-screen flex-col-reverse sm:flex-row">
      <div className="flex shrink-0 flex-col items-center justify-center gap-4 bg-brand-500 px-6 py-8 text-white sm:order-2 sm:w-[42%] sm:py-0">
        <Art />
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">{step + 1} / 3</p>
          <h2 className="text-xl font-bold">{STEP_TITLES[step]}</h2>
        </div>
        <div className="flex gap-2">
          {STEP_TITLES.map((s, i) => (
            <span key={s} className={`h-1.5 w-8 rounded-full ${i <= step ? 'bg-white' : 'bg-white/25'}`} />
          ))}
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-white px-6 py-10 dark:bg-[#141017]">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-lg font-black text-white">A</span>
              <span className="text-xl font-extrabold">IELTS Arena</span>
            </div>
            <button className="text-sm font-semibold text-black/40 hover:text-black/60 dark:text-white/40 dark:hover:text-white/60" disabled={busy} onClick={() => submit({ skip: true })}>
              O'tkazib yuborish →
            </button>
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
                CEFR darajangizni tanlang, yoki "Darajamni aniqlang" ni bosing — birinchi mashqda avtomatik aniqlaymiz.
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
                      <button
                        className={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition ${
                          cefr[s.key] === UNSURE
                            ? 'border-brand-500 bg-brand-500 text-white'
                            : 'border-dashed border-black/20 text-black/60 hover:bg-black/5 dark:border-white/25 dark:text-white/60 dark:hover:bg-white/5'
                        }`}
                        onClick={() => toggleCefr(s.key, UNSURE)}
                      >
                        🎯 Darajamni aniqlang
                      </button>
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
              <div className="mb-1 flex gap-2">
                <input
                  className="input"
                  type="number"
                  min={1}
                  max={180}
                  disabled={daysUnsure}
                  value={totalDays}
                  onChange={(e) => setTotalDays(e.target.value)}
                />
                <button
                  type="button"
                  className={`shrink-0 rounded-xl border px-3 text-sm font-semibold ${daysUnsure ? 'border-brand-500 bg-brand-500 text-white' : 'border-black/10 dark:border-white/15'}`}
                  onClick={() => setDaysUnsure((v) => !v)}
                >
                  Aniq emas
                </button>
              </div>
              {daysUnsure && (
                <p className="mb-4 text-xs text-black/40 dark:text-white/40">
                  Muammo emas — kunlar ketma-ket (Kun 1, Kun 2, ...) davom etadi, umumiy sonini keyinroq Profil bo'limidan belgilashingiz mumkin.
                </p>
              )}

              <label className="mb-1 mt-3 block text-sm font-semibold">Kuniga qancha vaqt?</label>
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
                <button className="btn-primary flex-1" disabled={busy} onClick={() => submit()}>{busy ? '...' : 'Rejani yaratish'}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
