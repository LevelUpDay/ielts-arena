import { getVoicePref, resolveVoice } from '../lib/voicePrefs';

let cachedVoice = null;
let cachedKey = '';

function getVoice() {
  const pref = getVoicePref();
  const key = `${pref.accent}|${pref.gender}|${pref.exactVoiceURI || ''}`;
  if (cachedVoice && cachedKey === key) return cachedVoice;
  const v = resolveVoice(pref);
  if (v) { cachedVoice = v; cachedKey = key; }
  return v;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => { cachedVoice = null; cachedKey = ''; };
}

// One consistent voice for every clip, so the whole app sounds like the same
// person (accent/gender chosen in Profile settings). "Name: ..." speaker
// labels used by dialogue content are kept as spoken text but no longer
// trigger a voice switch.
export function speak(txt, rate = 1) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const pref = getVoicePref();
  const u = new SpeechSynthesisUtterance(String(txt));
  u.lang = pref.accent;
  u.rate = rate;
  const v = getVoice();
  if (v) u.voice = v;
  window.speechSynthesis.speak(u);
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

export function previewVoice() {
  speak('Hello! This is how I will sound during your listening practice.', 1);
}
