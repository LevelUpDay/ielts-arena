import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { SKILLS, levelForRating } from '../lib/rating';
import RatingBadge from '../components/RatingBadge';
import TodayPlanCard from '../components/TodayPlanCard';

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile, ratings, plan } = useAuth();

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Salom, {profile?.display_name || profile?.username}! 👋</h1>
      <p className="mb-6 text-sm text-black/50 dark:text-white/50">
        {plan ? "Bugungi rejangiz tayyor." : "Bugun qaysi bo'limda mashq qilamiz?"}
      </p>

      {plan && <TodayPlanCard />}

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-black/40 dark:text-white/40">Barcha bo'limlar</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {SKILLS.map((s) => {
          const r = ratings?.[s.key];
          const rating = r?.rating ?? 400;
          const band = levelForRating(rating);
          return (
            <button
              key={s.key}
              disabled={!s.ready}
              onClick={() => navigate(`/${s.key}`)}
              className="card flex flex-col gap-2 p-4 text-left disabled:opacity-60 hover:border-brand-300"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">{s.emoji} {s.label}</span>
                {s.ready ? <RatingBadge rating={rating} /> : <span className="badge bg-black/5 text-current/60 dark:bg-white/10">soon</span>}
              </div>
              {s.ready && (
                <>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                    <div className="h-full" style={{ width: `${Math.min(100, (rating / 3000) * 100)}%`, backgroundColor: band.color }} />
                  </div>
                  <span className="text-xs" style={{ color: band.color }}>{band.label}</span>
                </>
              )}
              {!s.ready && <span className="text-xs text-black/40 dark:text-white/40">Tez kunda qo'shiladi</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
