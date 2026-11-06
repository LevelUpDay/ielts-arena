import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { EXERCISE_TYPES } from './generators';

export default function ListeningStats() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [rows, setRows] = useState(null);

  useEffect(() => {
    if (!session) return;
    supabase.from('attempts')
      .select('exercise_type, correct, created_at')
      .eq('user_id', session.user.id)
      .eq('skill', 'listening')
      .order('created_at', { ascending: false })
      .limit(500)
      .then(({ data }) => setRows(data || []));
  }, [session]);

  const byType = {};
  (rows || []).forEach((r) => {
    const t = byType[r.exercise_type] || (byType[r.exercise_type] = { ok: 0, total: 0 });
    t.total++;
    if (r.correct) t.ok++;
  });
  const entries = Object.entries(byType).sort((a, b) => b[1].total - a[1].total);
  const overallOk = (rows || []).filter((r) => r.correct).length;
  const overallTotal = (rows || []).length;

  return (
    <div>
      <button className="btn-outline mb-4" onClick={() => navigate('/listening')}>← Orqaga</button>
      <h1 className="mb-1 text-xl font-bold">📊 Listening statistikasi</h1>
      <p className="mb-5 text-sm text-black/50 dark:text-white/50">Mashq turlari bo'yicha aniqlik (so'nggi 500 urinish).</p>

      {rows === null && <p className="text-sm text-black/40">Yuklanmoqda...</p>}

      {rows !== null && overallTotal === 0 && (
        <div className="card p-5 text-center text-sm text-black/50 dark:text-white/50">
          Hali mashq qilmagansiz — statistika shu yerda ko'rinadi.
        </div>
      )}

      {overallTotal > 0 && (
        <>
          <div className="card mb-4 p-4">
            <p className="text-sm text-black/50 dark:text-white/50">Umumiy aniqlik</p>
            <p className="text-2xl font-bold">{Math.round((overallOk / overallTotal) * 100)}%</p>
            <p className="text-xs text-black/40 dark:text-white/40">{overallTotal} ta urinish</p>
          </div>

          <div className="flex flex-col gap-2">
            {entries.map(([type, s]) => {
              const pct = Math.round((s.ok / s.total) * 100);
              return (
                <div key={type} className="card p-3">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium">{EXERCISE_TYPES[type] || type}</span>
                    <span className="text-black/50 dark:text-white/50">{s.ok}/{s.total} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                    <div className="h-full bg-brand-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
