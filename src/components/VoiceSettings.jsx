import { useEffect, useState } from 'react';
import { getVoicePref, setVoicePref, listEnglishVoices } from '../lib/voicePrefs';
import { previewVoice } from '../listening/speech';

export default function VoiceSettings() {
  const [pref, setPref] = useState(getVoicePref());
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    function load() { setVoices(listEnglishVoices()); }
    load();
    window.speechSynthesis.addEventListener('voiceschanged', load);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load);
  }, []);

  function update(next) {
    const merged = { ...pref, ...next };
    setPref(merged);
    setVoicePref(merged);
  }

  return (
    <div className="card mb-5 p-5">
      <h2 className="mb-1 text-lg font-bold">🔊 Ovoz sozlamalari</h2>
      <p className="mb-4 text-sm text-black/50 dark:text-white/50">
        Barcha audio shu bitta ovozda eshittiriladi. Agar notiniq eshitilsa, boshqa variantni tanlab "Sinab ko'rish"ni bosing.
      </p>

      <p className="mb-1.5 text-sm font-semibold">Aksent</p>
      <div className="mb-3 flex gap-2">
        <button
          className={`btn-outline flex-1 ${pref.accent === 'en-GB' ? '!border-brand-500 !bg-brand-50 dark:!bg-brand-500/10' : ''}`}
          onClick={() => update({ accent: 'en-GB', exactVoiceURI: null })}
        >
          🇬🇧 British
        </button>
        <button
          className={`btn-outline flex-1 ${pref.accent === 'en-US' ? '!border-brand-500 !bg-brand-50 dark:!bg-brand-500/10' : ''}`}
          onClick={() => update({ accent: 'en-US', exactVoiceURI: null })}
        >
          🇺🇸 American
        </button>
      </div>

      <p className="mb-1.5 text-sm font-semibold">Ovoz</p>
      <div className="mb-4 flex gap-2">
        <button
          className={`btn-outline flex-1 ${pref.gender === 'female' ? '!border-brand-500 !bg-brand-50 dark:!bg-brand-500/10' : ''}`}
          onClick={() => update({ gender: 'female', exactVoiceURI: null })}
        >
          👩 Ayol
        </button>
        <button
          className={`btn-outline flex-1 ${pref.gender === 'male' ? '!border-brand-500 !bg-brand-50 dark:!bg-brand-500/10' : ''}`}
          onClick={() => update({ gender: 'male', exactVoiceURI: null })}
        >
          👨 Erkak
        </button>
      </div>

      {voices.length > 0 && (
        <>
          <p className="mb-1.5 text-sm font-semibold">Aniq ovozni tanlash (ixtiyoriy)</p>
          <select
            className="input mb-4"
            value={pref.exactVoiceURI || ''}
            onChange={(e) => update({ exactVoiceURI: e.target.value || null })}
          >
            <option value="">Avtomatik (aksent + ovoz bo'yicha)</option>
            {voices.map((v) => (
              <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>
            ))}
          </select>
        </>
      )}

      <button className="btn-primary w-full" onClick={previewVoice}>▶ Sinab ko'rish</button>
    </div>
  );
}
