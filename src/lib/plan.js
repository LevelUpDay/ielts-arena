import { SKILLS, DEFAULT_RATING } from './rating';

export const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
export const CEFR_RATING = { A1: 300, A2: 650, B1: 1050, B2: 1500, C1: 2000, C2: 2500 };

export const REFERRAL_OPTIONS = [
  "Do'stimdan",
  'Instagram',
  'Telegram',
  "O'qituvchim / kursdan",
  "O'zim qidirib topdim",
  'Boshqa',
];

const PLAN_SKILLS = SKILLS.filter((s) => s.ready).map((s) => s.key);

// Weaker skills (lower rating) get a bigger slice of the daily time.
export function buildTaskSplit(ratings, dailyMinutes) {
  const weights = PLAN_SKILLS.map((k) => Math.max(200, 2500 - (ratings?.[k]?.rating ?? DEFAULT_RATING)));
  const totalW = weights.reduce((a, b) => a + b, 0);
  let minutes = PLAN_SKILLS.map((_, i) => Math.max(5, Math.round((dailyMinutes * weights[i]) / totalW / 5) * 5));
  // nudge rounding so the parts add up to the requested total
  let diff = dailyMinutes - minutes.reduce((a, b) => a + b, 0);
  let i = 0;
  while (diff !== 0 && i < 200) {
    const idx = i % minutes.length;
    if (diff > 0) { minutes[idx] += 5; diff -= 5; }
    else if (minutes[idx] > 5) { minutes[idx] -= 5; diff += 5; }
    i++;
  }
  return PLAN_SKILLS.map((key, idx) => ({ key, minutes: minutes[idx] }));
}

export function currentDay(plan) {
  if (!plan) return 1;
  if (!plan.total_days) return plan.days_completed + 1; // open-ended plan
  return Math.min(plan.days_completed + 1, plan.total_days);
}

export function isPlanFinished(plan) {
  return !!plan && !!plan.total_days && plan.days_completed >= plan.total_days;
}

export function isOpenEnded(plan) {
  return !!plan && !plan.total_days;
}
