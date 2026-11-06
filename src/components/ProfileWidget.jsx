import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { SKILLS, levelForRating } from '../lib/rating';

export default function ProfileWidget() {
  const { profile, ratings, theme, setTheme, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function onClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const avgRating = Math.round(
    SKILLS.filter((s) => s.ready).reduce((sum, s) => sum + (ratings?.[s.key]?.rating ?? 400), 0) /
      SKILLS.filter((s) => s.ready).length,
  );
  const band = levelForRating(avgRating);
  const initial = (profile?.display_name || profile?.username || '?').slice(0, 1).toUpperCase();

  return (
    <div ref={ref} className="relative mt-auto border-t border-black/5 p-3 dark:border-white/10">
      {open && (
        <div className="absolute bottom-full left-3 right-3 mb-2 overflow-hidden rounded-xl border border-black/5 bg-white shadow-lg dark:border-white/10 dark:bg-[#1c1621]">
          <button
            className="flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <span>{theme === 'dark' ? '☀️ Yorug' : '🌙 Qorong\'u'} rejim</span>
          </button>
          <button
            className="flex w-full items-center px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5"
            onClick={() => { setOpen(false); navigate('/profile'); }}
          >
            👤 Profil
          </button>
          <button
            className="flex w-full items-center px-3 py-2 text-sm text-red-500 hover:bg-black/5 dark:hover:bg-white/5"
            onClick={signOut}
          >
            ⏻ Chiqish
          </button>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2.5 rounded-xl p-1.5 text-left hover:bg-black/5 dark:hover:bg-white/5"
      >
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ backgroundColor: band.color }}
        >
          {initial}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold">
            {profile?.display_name || profile?.username || '...'}
          </span>
          <span className="block truncate text-xs" style={{ color: band.color }}>
            {band.label} · {avgRating || 400}
          </span>
        </span>
      </button>
    </div>
  );
}
