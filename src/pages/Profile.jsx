import { useAuth } from '../lib/auth';
import { SKILLS, levelForRating } from '../lib/rating';
import RatingBadge from '../components/RatingBadge';
import VoiceSettings from '../components/VoiceSettings';

export default function Profile() {
  const { profile, ratings, session } = useAuth();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">👤 Profil</h1>
      <div className="card mb-5 p-5">
        <p className="text-sm text-black/50 dark:text-white/50">Email</p>
        <p className="font-semibold">{session?.user?.email}</p>
        <p className="mt-3 text-sm text-black/50 dark:text-white/50">Foydalanuvchi nomi</p>
        <p className="font-semibold">{profile?.username}</p>
      </div>

      <VoiceSettings />

      <h2 className="mb-3 text-lg font-bold">Reytinglar</h2>
      <div className="flex flex-col gap-2">
        {SKILLS.map((s) => {
          const r = ratings?.[s.key];
          const rating = r?.rating ?? 400;
          const band = levelForRating(rating);
          return (
            <div key={s.key} className="card flex items-center justify-between p-3">
              <span className="text-sm font-medium">{s.emoji} {s.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: band.color }}>{s.ready ? band.label : 'Soon'}</span>
                {s.ready && <RatingBadge rating={rating} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
