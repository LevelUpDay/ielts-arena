import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { levelForRating } from '../lib/rating';
import RatingBadge from '../components/RatingBadge';
import { EXERCISE_TYPES, G } from './generators';
import { R } from '../lib/textUtils';

export default function ListeningHome() {
  const navigate = useNavigate();
  const { ratings } = useAuth();
  const info = ratings?.listening;
  const rating = info?.rating ?? 400;
  const band = levelForRating(rating);
  const types = Object.keys(EXERCISE_TYPES);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">🎧 Listening</h1>
          <p className="text-sm text-black/50 dark:text-white/50">
            {info?.placement_done ? `${band.label} daraja` : "Hali daraja aniqlanmagan — birinchi mashqdan boshlang'"}
          </p>
        </div>
        <RatingBadge rating={rating} />
      </div>

      <button
        className="btn-primary mb-6 w-full sm:w-auto"
        onClick={() => navigate(`/listening/${R(types)}`)}
      >
        ▶ Tasodifiy mashq boshlash
      </button>

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
