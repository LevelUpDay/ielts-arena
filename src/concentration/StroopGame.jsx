import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { TIER_RATING, tierForRating } from '../lib/rating';
import { shuf } from '../lib/textUtils';
import ResultCard from './ResultCard';

const ALL_COLORS = [
  { name: 'RED', hex: '#ef4444' },
  { name: 'BLUE', hex: '#3b82f6' },
  { name: 'GREEN', hex: '#22c55e' },
  { name: 'YELLOW', hex: '#eab308' },
  { name: 'PURPLE', hex: '#a855f7' },
];

const TRIALS = 10;
const LIMIT_MS = { 1: 4500, 2: 3000, 3: 2000 };

function makeTrial(colors) {
  const word = colors[Math.floor(Math.random() * colors.length)];
  let display = colors[Math.floor(Math.random() * colors.length)];
  while (display.name === word.name && colors.length > 1) display = colors[Math.floor(Math.random() * colors.length)];
  return { word: word.name, display };
}

export default function StroopGame() {
  const navigate = useNavigate();
  const { ratings, recordAttempt } = useAuth();
  const rating = ratings?.concentration?.rating ?? 400;
  const tier = tierForRating(rating);
  const colors = ALL_COLORS.slice(0, tier === 1 ? 3 : tier === 2 ? 4 : 5);
  const limit = LIMIT_MS[tier];

  const [started, setStarted] = useState(false);
  const [trial, setTrial] = useState(null);
  const [idx, setIdx] = useState(0);
  const [ok, setOk] = useState(0);
  const [progress, setProgress] = useState(100);
  const [result, setResult] = useState(null);
  const startRef = useRef(0);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => () => { clearTimeout(timeoutRef.current); clearInterval(intervalRef.current); }, []);

  function nextTrial(i) {
    setTrial(makeTrial(colors));
    startRef.current = performance.now();
    setProgress(100);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const left = Math.max(0, 100 - ((performance.now() - startRef.current) / limit) * 100);
      setProgress(left);
    }, 50);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => answer(null, i), limit);
  }

  function begin() {
    setOk(0); setIdx(0); setResult(null); setStarted(true);
    nextTrial(0);
  }

  async function answer(chosenName, i) {
    clearTimeout(timeoutRef.current);
    clearInterval(intervalRef.current);
    const good = chosenName === trial.display.name;
    const nextOk = ok + (good ? 1 : 0);
    setOk(nextOk);
    if (i + 1 >= TRIALS) {
      const scoreFraction = nextOk / TRIALS;
      const upd = await recordAttempt({
        skill: 'concentration', exerciseType: 'stroop', difficulty: TIER_RATING[tier],
        scoreFraction, correct: scoreFraction >= 0.6, meta: { ok: nextOk, total: TRIALS },
      });
      setStarted(false);
      setResult({ ok: nextOk, upd });
    } else {
      setIdx(i + 1);
      nextTrial(i + 1);
    }
  }

  return (
    <div>
      <button className="btn-outline mb-4" onClick={() => navigate('/concentration')}>← Orqaga</button>
      <h1 className="mb-1 text-xl font-bold">🎨 Stroop test</h1>
      <p className="mb-5 text-sm text-black/50 dark:text-white/50">
        So'zni o'qima — faqat <b>harflar rangini</b> bos. {TRIALS} urinish, {colors.length} rang.
      </p>

      {!started && !result && <button className="btn-primary" onClick={begin}>Boshlash</button>}

      {started && trial && (
        <div>
          <p className="mb-2 text-sm">Urinish: {idx + 1} / {TRIALS}</p>
          <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
            <div className="h-full bg-brand-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="card mb-5 flex h-40 items-center justify-center">
            <span className="text-5xl font-black" style={{ color: trial.display.hex }}>{trial.word}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {colors.map((c) => (
              <button key={c.name} className="btn-outline py-3 text-sm font-semibold" onClick={() => answer(c.name, idx)}>
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {result && (
        <ResultCard
          title={`Natija: ${result.ok} / ${TRIALS}`}
          lines={[]}
          upd={result.upd}
          onRetry={begin}
        />
      )}
    </div>
  );
}
