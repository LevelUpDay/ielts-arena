// Chess.com-style rating engine: 100 - 3000, Elo-based updates.

export const SKILLS = [
  { key: 'listening', label: 'Listening', emoji: '🎧', ready: true },
  { key: 'reading', label: 'Reading', emoji: '📖', ready: true },
  { key: 'concentration', label: 'Concentration', emoji: '🎯', ready: true },
  { key: 'speaking', label: 'Speaking', emoji: '🗣️', ready: false },
  { key: 'writing', label: 'Writing', emoji: '✍️', ready: false },
];

export const MIN_RATING = 100;
export const MAX_RATING = 3000;
export const DEFAULT_RATING = 400;

export const LEVEL_BANDS = [
  { max: 699, key: 'beginner', label: 'Beginner', color: '#9ca3af' },
  { max: 1099, key: 'elementary', label: 'Elementary', color: '#60a5fa' },
  { max: 1599, key: 'intermediate', label: 'Intermediate', color: '#34d399' },
  { max: 2099, key: 'upper', label: 'Upper-Intermediate', color: '#f5a623' },
  { max: Infinity, key: 'advanced', label: 'Advanced', color: '#ec4584' },
];

export function levelForRating(rating) {
  return LEVEL_BANDS.find((b) => rating <= b.max) || LEVEL_BANDS[LEVEL_BANDS.length - 1];
}

// Maps a 1-3 exercise difficulty tier to an Elo "opponent" rating.
export const TIER_RATING = { 1: 500, 2: 1150, 3: 1900 };

export function tierForRating(rating) {
  if (rating < 850) return 1;
  if (rating < 1700) return 2;
  return 3;
}

function expectedScore(a, b) {
  return 1 / (1 + Math.pow(10, (b - a) / 400));
}

// score: fraction correct (0..1). k scales how much a single session can move the rating.
export function updateRating(rating, opponentRating, score, k = 40) {
  const next = rating + k * (score - expectedScore(rating, opponentRating));
  return Math.max(MIN_RATING, Math.min(MAX_RATING, Math.round(next)));
}

export function ratingDelta(rating, opponentRating, score, k = 40) {
  return updateRating(rating, opponentRating, score, k) - rating;
}
