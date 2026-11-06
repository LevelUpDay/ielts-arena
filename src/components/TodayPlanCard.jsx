import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { SKILLS } from '../lib/rating';
import { buildTaskSplit, currentDay, isPlanFinished } from '../lib/plan';

export default function TodayPlanCard() {
  const navigate = useNavigate();
  const { plan, ratings, completeDay } = useAuth();
  const dayNum = currentDay(plan);
  const finished = isPlanFinished(plan);
  const tasks = buildTaskSplit(ratings, plan.daily_minutes);
  const [done, setDone] = useState({});
  const [busy, setBusy] = useState(false);

  useEffect(() => { setDone({}); }, [plan.days_completed]);

  const allDone = tasks.every((t) => done[t.key]);

  async function finishDay() {
    setBusy(true);
    try { await completeDay(); } finally { setBusy(false); }
  }

  const labelFor = (key) => SKILLS.find((s) => s.key === key);

  return (
    <div className="card mb-6 p-5">
      {finished ? (
        <div className="text-center">
          <p className="text-3xl">🎉</p>
          <h2 className="mt-1 text-lg font-bold">Rejangiz yakunlandi!</h2>
          <p className="mt-1 text-sm text-black/50 dark:text-white/50">{plan.total_days} kunlik reja to'liq bajarildi. Davom etishingiz mumkin.</p>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">📅 Kun {dayNum} <span className="text-sm font-normal text-black/40 dark:text-white/40">/ {plan.total_days}</span></h2>
            <span className="badge bg-brand-50 text-brand-700 dark:bg-white/10 dark:text-brand-200">{plan.daily_minutes} daqiqa</span>
          </div>

          <div className="mb-4 flex flex-wrap gap-1">
            {Array.from({ length: plan.total_days }, (_, i) => i + 1).map((d) => (
              <span
                key={d}
                className={`flex h-6 w-6 items-center justify-center rounded text-[10px] font-bold ${
                  d < dayNum ? 'bg-emerald-500 text-white'
                  : d === dayNum ? 'bg-brand-500 text-white ring-2 ring-brand-300'
                  : 'bg-black/5 text-black/30 dark:bg-white/10 dark:text-white/30'
                }`}
              >
                {d < dayNum ? '✓' : d}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            {tasks.map((t) => {
              const s = labelFor(t.key);
              return (
                <label key={t.key} className={`flex items-center gap-3 rounded-xl border p-3 ${done[t.key] ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-500/10' : 'border-black/10 dark:border-white/10'}`}>
                  <input
                    type="checkbox"
                    checked={!!done[t.key]}
                    onChange={(e) => setDone((d) => ({ ...d, [t.key]: e.target.checked }))}
                  />
                  <span className="flex-1 text-sm">
                    <b>{s.emoji} {s.label}</b> <span className="text-black/50 dark:text-white/50">~{t.minutes} daqiqa</span>
                  </span>
                  <button type="button" className="btn-ghost px-3 py-1.5 text-xs" onClick={() => navigate(`/${t.key}`)}>Boshlash</button>
                </label>
              );
            })}
          </div>

          <button className="btn-primary mt-4 w-full" disabled={!allDone || busy} onClick={finishDay}>
            {busy ? '...' : "Bugungi kunni yakunlash ✓"}
          </button>
        </>
      )}
    </div>
  );
}
