import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { currentDay, isPlanFinished } from '../lib/plan';

export default function DayBadge() {
  const { plan } = useAuth();
  if (!plan || isPlanFinished(plan)) return null;
  return (
    <Link
      to="/"
      className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-100 dark:bg-white/5 dark:text-brand-200 dark:hover:bg-white/10"
    >
      📅 Kun {currentDay(plan)} / {plan.total_days} — bugungi rejani ko'rish
    </Link>
  );
}
