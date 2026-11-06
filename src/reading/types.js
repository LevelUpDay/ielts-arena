export const READING_TYPES = {
  tfng: 'True / False / Not Given',
  gap: "Gap-fill (completion)",
  heading: 'Matching headings',
  sentence: 'Sentence endings',
  summary: 'Summary completion',
  mc: 'Multiple choice',
};

export function pickPassage(passages, qtype, desiredLevel) {
  const pool = passages.filter((p) => p.qtype === qtype);
  if (!pool.length) return null;
  const minDiff = Math.min(...pool.map((p) => Math.abs(p.level - desiredLevel)));
  const best = pool.filter((p) => Math.abs(p.level - desiredLevel) === minDiff);
  return best[Math.floor(Math.random() * best.length)];
}
