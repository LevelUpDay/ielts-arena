import { R, shuf } from '../lib/textUtils';

function pickVoice(langPrefix) {
  if (!('speechSynthesis' in window)) return null;
  const v = window.speechSynthesis.getVoices().filter((x) => x.lang.replace('_', '-').indexOf(langPrefix) === 0);
  return v.length ? R(v) : null;
}

// Speaks text; lines like "Name: ..." get a stable per-name voice, with accents
// mixed across GB/AU/US/IN so dialogues (matching tasks) sound like different people.
export function speak(txt, rate = 1) {
  if (!('speechSynthesis' in window)) return;
  const parts = txt.split(/(?=\b[A-Z][a-z]+: )/);
  const sp = {};
  const codes = shuf(['en-GB', 'en-AU', 'en-US', 'en-IN']);
  let ci = 0;
  window.speechSynthesis.cancel();
  parts.forEach((p) => {
    const m = p.match(/^([A-Z][a-z]+): /);
    const nm = m ? m[1] : '_';
    const body = m ? p.slice(m[0].length) : p;
    if (!sp[nm]) { sp[nm] = pickVoice(codes[ci % codes.length]) || pickVoice('en'); ci++; }
    const u = new SpeechSynthesisUtterance(body.trim());
    u.lang = 'en-GB';
    u.rate = rate;
    if (sp[nm]) u.voice = sp[nm];
    window.speechSynthesis.speak(u);
  });
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}
