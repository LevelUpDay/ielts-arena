import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { levelForRating } from '../lib/rating';
import RatingBadge from '../components/RatingBadge';
import DayBadge from '../components/DayBadge';

const MAIN = { key: 'mindwander', label: "Diqqat (fikr chalg'ishi)", desc: "Audio tingla, chalg'ishni payqa, tez qayt.", emoji: '🧘' };
const EXTRA = {
  stroop: { label: 'Stroop test', desc: "So'z rangiga qarab bos, so'zni o'qima.", emoji: '🎨' },
  nback: { label: 'N-Back', desc: "Oldingi harflarni eslab qol va mosligini top.", emoji: '🧠' },
};

export default function ConcentrationHome() {
  const navigate = useNavigate();
  const { ratings } = useAuth();
  const info = ratings?.concentration;
  const rating = info?.rating ?? 400;
  const band = levelForRating(rating);

  return (
    <div>
      <DayBadge />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">🎯 Concentration</h1>
          <p className="text-sm text-black/50 dark:text-white/50">
            {info?.placement_done ? `${band.label} daraja` : "Hali daraja aniqlanmagan — birinchi mashqdan boshlang'"}
          </p>
        </div>
        <RatingBadge rating={rating} />
      </div>

      <button
        className="card mb-6 flex w-full items-center gap-4 p-5 text-left hover:border-brand-300"
        onClick={() => navigate(`/concentration/${MAIN.key}`)}
      >
        <span className="text-3xl">{MAIN.emoji}</span>
        <span>
          <span className="block font-semibold">{MAIN.label}</span>
          <span className="block text-sm text-black/50 dark:text-white/50">{MAIN.desc}</span>
        </span>
      </button>

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-black/40 dark:text-white/40">Qo'shimcha mashqlar</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Object.entries(EXTRA).map(([key, g]) => (
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
