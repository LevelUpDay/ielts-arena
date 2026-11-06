import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { levelForRating } from '../lib/rating';
import RatingBadge from '../components/RatingBadge';
import { EXERCISE_TYPES } from './generators';
import { R } from '../lib/textUtils';
import DayBadge from '../components/DayBadge';

export default function ListeningHome() {
  const navigate = useNavigate();
  const { ratings, countDueReviews } = useAuth();
  const info = ratings?.listening;
  const rating = info?.rating ?? 400;
  const band = levelForRating(rating);
  const types = Object.keys(EXERCISE_TYPES);
  const [dueCount, setDueCount] = useState(0);

  useEffect(() => {
    countDueReviews('listening').then(setDueCount);
  }, [countDueReviews]);

  return (
    <div>
      <DayBadge />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">🎧 Listening</h1>
          <p className="text-sm text-black/50 dark:text-white/50">
            {info?.placement_done ? `${band.label} daraja` : "Hali daraja aniqlanmagan — birinchi mashqdan boshlang'"}
          </p>
        </div>
        <RatingBadge rating={rating} />
      </div>

      <div className="mb-6 flex flex-col gap-2 sm:flex-row">
        <button className="btn-primary flex-1" onClick={() => navigate(`/listening/${R(types)}`)}>
          ▶ Tasodifiy mashq boshlash
        </button>
        <button className="btn-outline flex-1" onClick={() => navigate('/listening/section')}>
          📋 To'liq Section (Part 1-4)
        </button>
      </div>

      <div className="mb-6 flex flex-col gap-2 sm:flex-row">
        <button
          className="card flex flex-1 items-center justify-between p-3 text-left hover:border-brand-300 disabled:opacity-50"
          disabled={dueCount === 0}
          onClick={() => navigate('/listening/rev')}
        >
          <span className="text-sm font-medium">🔁 Takrorlash</span>
          <span className="badge bg-brand-50 text-brand-700 dark:bg-white/10 dark:text-brand-200">{dueCount}</span>
        </button>
        <button className="card flex-1 p-3 text-left text-sm font-medium hover:border-brand-300" onClick={() => navigate('/listening/stats')}>
          📊 Statistika
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {types.map((t) => (
          <button
            key={t}
            className="card flex items-center justify-between p-3 text-left hover:border-brand-300"
            onClick={() => navigate(`/listening/${t}`)}
          >
            <span className="text-sm font-medium">{EXERCISE_TYPES[t]}</span>
            <span className="text-brand-500">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}
