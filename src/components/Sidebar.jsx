import { NavLink } from 'react-router-dom';
import { SKILLS } from '../lib/rating';
import { useAuth } from '../lib/auth';
import RatingBadge from './RatingBadge';
import ProfileWidget from './ProfileWidget';

export default function Sidebar() {
  const { ratings } = useAuth();
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-black/5 bg-white dark:border-white/10 dark:bg-[#18131c]">
      <div className="flex items-center gap-2 px-4 py-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-base font-black text-white">A</span>
        <span className="text-lg font-extrabold tracking-tight">IELTS Arena</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2">
        {SKILLS.map((s) => (
          <NavLink
            key={s.key}
            to={`/${s.key}`}
            className={({ isActive }) =>
              `flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200'
                  : 'text-current hover:bg-black/5 dark:hover:bg-white/5'
              }`
            }
          >
            <span className="flex items-center gap-2">
              <span>{s.emoji}</span>
              <span>{s.label}</span>
              {!s.ready && <span className="badge bg-black/5 text-[10px] text-current/60 dark:bg-white/10">soon</span>}
            </span>
            {s.ready && <RatingBadge rating={ratings?.[s.key]?.rating} size="sm" />}
          </NavLink>
        ))}
      </nav>
      <ProfileWidget />
    </aside>
  );
}
