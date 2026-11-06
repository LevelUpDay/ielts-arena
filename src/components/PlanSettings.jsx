import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { currentDay, isOpenEnded } from '../lib/plan';

export default function PlanSettings() {
  const { plan, setPlanTotalDays } = useAuth();
  const [value, setValue] = useState('30');
  const [busy, setBusy] = useState(false);

  if (!plan) return null;
  const openEnded = isOpenEnded(plan);

  async function save() {
    const n = Math.max(1, Math.min(365, Number(value) || 30));
    setBusy(true);
    try { await setPlanTotalDays(n); } finally { setBusy(false); }
  }

  return (
    <div className="card mb-5 p-5">
      <h2 className="mb-1 text-lg font-bold">📅 Reja</h2>
      <p className="mb-3 text-sm text-black/50 dark:text-white/50">
        Kun {currentDay(plan)}{!openEnded && ` / ${plan.total_days}`} · kuniga {plan.daily_minutes} daqiqa
      </p>
      {openEnded ? (
        <>
          <p className="mb-2 text-sm">Umumiy kunlar soni hali belgilanmagan. Xohlasangiz, hozir belgilang:</p>
          <div className="flex gap-2">
            <input className="input" type="number" min={1} max={365} value={value} onChange={(e) => setValue(e.target.value)} />
            <button className="btn-primary shrink-0" disabled={busy} onClick={save}>{busy ? '...' : 'Belgilash'}</button>
          </div>
        </>
      ) : (
        <p className="text-xs text-black/40 dark:text-white/40">Reja {plan.total_days} kunga mo'ljallangan.</p>
      )}
    </div>
  );
}
