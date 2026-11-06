import { levelForRating } from '../lib/rating';

export default function RatingBadge({ rating, size = 'md' }) {
  const band = levelForRating(rating ?? 400);
  const pad = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';
  return (
    <span
      className={`badge ${pad}`}
      style={{ backgroundColor: `${band.color}22`, color: band.color }}
      title={band.label}
    >
      {rating ?? 400}
    </span>
  );
}
