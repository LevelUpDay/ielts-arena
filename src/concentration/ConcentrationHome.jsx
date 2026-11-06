import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { levelForRating } from '../lib/rating';
import RatingBadge from '../components/RatingBadge';

const GAMES = {
  stroop: { label: 'Stroop test', desc: "So'z rangiga qarab bos, so'zni o'qima.", emoji: '🎨' },
  nback: { label: 'N-Back', desc: "Oldingi harflarni eslab qol va mosligini top.", emoji: '🧠' },
  reaction: { label: 'Reaksiya tezligi', desc: 'Yashil rang yonishi bilanoq bos.', emoji: '⚡' },
};

export default function ConcentrationHome() {
  const navigate = useNavigate();
  const { ratings } = useAuth();
  const info = ratings?.concentration;
  const rating = info?.rating ?? 400;
  const band = levelForRating(rating);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">🎯 Concentration</h1>
          <p className="text-sm text-black/50 dark:text-white/50">
            {info?.placement_done ? `${band.label} daraja` : "Hali daraja aniqlanmagan — birinchi o'yindan boshlang'"}
          </p>
        </div>
        <RatingBadge rating={rating} />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {Object.entries(GAMES).map(([key, g]) => (
          <button key={key} className="card flex flex-col items-start gap-1 p-4 text-left hover:border-brand-300" onClick={() => navigate(`/concentration/${key}`)}>
            <span className="text-2xl">{g.emoji}</span>
            <span className="font-semibold">{g.label}</span>
            <span className="text-xs text-black/50 dark:text-white/50">{g.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
