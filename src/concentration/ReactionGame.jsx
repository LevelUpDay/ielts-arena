import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { TIER_RATING, tierForRating } from '../lib/rating';
import ResultCard from './ResultCard';

const TRIALS = 6;

function scoreForMs(ms) {
  if (ms < 250) return 1;
  if (ms < 350) return 0.85;
  if (ms < 450) return 0.65;
  if (ms < 600) return 0.4;
  return 0.2;
}

export default function ReactionGame() {
  const navigate = useNavigate();
  const { ratings, recordAttempt } = useAuth();
  const rating = ratings?.concentration?.rating ?? 400;
  const tier = tierForRating(rating);

  const [phase, setPhase] = useState('idle'); // idle | wait | go | early | done
  const [trial, setTrial] = useState(0);
  const [times, setTimes] = useState([]);
  const [falseStarts, setFalseStarts] = useState(0);
  const [result, setResult] = useState(null);
  const tRef = useRef(0);
  const timeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  function startTrial() {
    setPhase('wait');
    const delay = 800 + Math.random() * 2200;
    timeoutRef.current = setTimeout(() => {
      tRef.current = performance.now();
      setPhase('go');
    }, delay);
  }

  function begin() {
    setTimes([]); setFalseStarts(0); setTrial(0); setResult(null);
    startTrial();
  }

  async function onBoxClick() {
    if (phase === 'wait') {
      clearTimeout(timeoutRef.current);
      setFalseStarts((f) => f + 1);
      setPhase('early');
      setTimeout(() => startTrial(), 1000);
      return;
    }
    if (phase === 'go') {
      const ms = Math.round(performance.now() - tRef.current);
      const nextTimes = [...times, ms];
      setTimes(nextTimes);
      if (trial + 1 >= TRIALS) {
        await finish(nextTimes);
      } else {
        setTrial((t) => t + 1);
        startTrial();
      }
    }
  }

  async function finish(allTimes) {
    const avg = Math.round(allTimes.reduce((a, b) => a + b, 0) / allTimes.length);
    const fracs = allTimes.map(scoreForMs);
    let scoreFraction = fracs.reduce((a, b) => a + b, 0) / fracs.length;
    scoreFraction = Math.max(0, scoreFraction - falseStarts * 0.1);
    const upd = await recordAttempt({
      skill: 'concentration', exerciseType: 'reaction', difficulty: TIER_RATING[tier],
      scoreFraction, correct: scoreFraction >= 0.6, meta: { avg, falseStarts },
    });
    setPhase('done');
    setResult({ avg, falseStarts, upd });
  }

  return (
    <div>
      <button className="btn-outline mb-4" onClick={() => navigate('/concentration')}>← Orqaga</button>
      <h1 className="mb-1 text-xl font-bold">⚡ Reaksiya tezligi</h1>
      <p className="mb-5 text-sm text-black/50 dark:text-white/50">Quti yashil bo'lishi bilanoq bos. Erta bosish xatolik hisoblanadi. {TRIALS} urinish.</p>

      {phase === 'idle' && <button className="btn-primary" onClick={begin}>Boshlash</button>}

      {(phase === 'wait' || phase === 'go' || phase === 'early') && (
        <div>
          <p className="mb-2 text-sm">Urinish: {trial + 1} / {TRIALS}</p>
          <button
            onClick={onBoxClick}
            className={`flex h-56 w-full items-center justify-center rounded-2xl text-xl font-bold text-white transition-colors ${
              phase === 'go' ? 'bg-emerald-500' : phase === 'early' ? 'bg-red-500' : 'bg-black/20 dark:bg-white/10'
            }`}
          >
            {phase === 'go' ? 'BOS!' : phase === 'early' ? "Erta! Qayta kut..." : 'Kutib tur...'}
          </button>
        </div>
      )}

      {phase === 'done' && result && (
        <ResultCard
          title="Natija"
          lines={[`O'rtacha reaksiya: ${result.avg} ms`, `Erta bosishlar: ${result.falseStarts}`]}
          upd={result.upd}
          onRetry={begin}
        />
      )}
    </div>
  );
}
