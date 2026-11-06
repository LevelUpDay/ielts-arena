// Picks ONE consistent voice for every audio clip in the app (accent + gender,
// or an exact voice override), instead of the old per-sentence random mix.

const KEY = 'ia-voice-pref';

export function getVoicePref() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved) return { accent: 'en-GB', gender: 'female', exactVoiceURI: null, ...saved };
  } catch { /* ignore */ }
  return { accent: 'en-GB', gender: 'female', exactVoiceURI: null };
}

export function setVoicePref(pref) {
  try { localStorage.setItem(KEY, JSON.stringify(pref)); } catch { /* ignore */ }
}

const FEMALE_HINTS = ['female', 'zira', 'samantha', 'karen', 'victoria', 'susan', 'fiona', 'moira',
  'tessa', 'veena', 'salli', 'joanna', 'kendra', 'kimberly', 'ivy', 'amy', 'emma', 'serena', 'hazel',
  'libby', 'olivia', 'sonia', 'aria', 'jenny'];
const MALE_HINTS = ['male', 'david', 'daniel', 'alex', 'fred', 'george', 'james', 'oliver', 'ryan',
  'brian', 'matthew', 'justin', 'arthur', 'thomas', 'guy', 'eric', 'mark'];

function scoreVoice(v, pref) {
  let score = 0;
  const lang = v.lang.toLowerCase();
  const name = v.name.toLowerCase();
  if (pref.accent === 'en-US' && lang.startsWith('en-us')) score += 10;
  else if (pref.accent === 'en-GB' && lang.startsWith('en-gb')) score += 10;
  else if (lang.startsWith('en')) score += 2;
  const hints = pref.gender === 'male' ? MALE_HINTS : FEMALE_HINTS;
  if (hints.some((h) => name.includes(h))) score += 6;
  if (!v.localService) score += 1; // network/cloud voices usually sound clearer than local robotic ones
  return score;
}

export function listEnglishVoices() {
  if (!('speechSynthesis' in window)) return [];
  return window.speechSynthesis.getVoices()
    .filter((v) => v.lang.toLowerCase().startsWith('en'))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function resolveVoice(pref) {
  if (!('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  if (pref.exactVoiceURI) {
    const exact = voices.find((v) => v.voiceURI === pref.exactVoiceURI);
    if (exact) return exact;
  }
  let best = null;
  let bestScore = -1;
  for (const v of voices) {
    const s = scoreVoice(v, pref);
    if (s > bestScore) { bestScore = s; best = v; }
  }
  return best;
}
