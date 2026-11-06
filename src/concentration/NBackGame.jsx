import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { TIER_RATING, tierForRating } from '../lib/rating';
import ResultCard from './ResultCard';

const LETTERS = ['B', 'F', 'H', 'K', 'M', 'P', 'R', 'T'];
const STIM_MS = { 1: 2200, 2: 1800, 3: 1400 };
const LEN = { 1: 14, 2: 18, 3: 22 };

function buildSequence(n, len) {
  const seq = [];
  for (let i = 0; i < len; i++) {
    if (i >= n && Math.random() < 0.35) {
      seq.push(seq[i - n]);
    } else {
      let L = LETTERS[Math.floor(Math.random() * LETTERS.length)];
      if (i >= n) while (L === seq[i - n]) L = LETTERS[Math.floor(Math.random() * LETTERS.length)];
      seq.push(L);
    }
  }
  return seq;
}

export default function NBackGame() {
  const navigate = useNavigate();
  const { ratings, recordAttempt } = useAuth();
  const rating = ratings?.concentration?.rating ?? 400;
  const tier = tierForRating(rating);
  const n = tier;
  const len = LEN[tier];
  const stimMs = STIM_MS[tier];

  const [running, setRunning] = useState(false);
  const [seq, setSeq] = useState([]);
  const [idx, setIdx] = useState(-1);
  const [stats, setStats] = useState({ hit: 0, miss: 0, falseAlarm: 0, correctReject: 0 });
  const [result, setResult] = useState(null);
  const clickedRef = useRef(false);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  function isMatch(i, s) { return i >= n && s[i] === s[i - n]; }

  function step(i, s, acc) {
    if (i >= s.length) {
      finish(acc);
      return;
    }
    setIdx(i);
    clickedRef.current = false;
    timerRef.current = setTimeout(() => {
      const match = isMatch(i, s);
      const clicked = clickedRef.current;
      const next = { ...acc };
      if (i >= n) {
        if (match && clicked) next.hit++;
        else if (match && !clicked) next.miss++;
        else if (!match && clicked) next.falseAlarm++;
        else next.correctReject++;
      }
      setStats(next);
      step(i + 1, s, next);
    }, stimMs);
  }

  function begin() {
    const s = buildSequence(n, len);
    setSeq(s);
    setResult(null);
    const acc = { hit: 0, miss: 0, falseAlarm: 0, correctReject: 0 };
    setStats(acc);
    setRunning(true);
    step(0, s, acc);
  }

  function press() {
    clickedRef.current = true;
  }

  async function finish(acc) {
    setRunning(false);
    const total = acc.hit + acc.miss + acc.falseAlarm + acc.correctReject;
    const scoreFraction = total ? (acc.hit + acc.correctReject) / total : 0;
    const upd = await recordAttempt({
      skill: 'concentration', exerciseType: 'nback', difficulty: TIER_RATING[tier],
      scoreFraction, correct: scoreFraction >= 0.6, meta: acc,
    });
    setResult({ ...acc, upd });
  }

  return (
    <div>
      <button className="btn-outline mb-4" onClick={() => navigate('/concentration')}>← Orqaga</button>
      <h1 className="mb-1 text-xl font-bold">🧠 {n}-Back</h1>
      <p className="mb-5 text-sm text-black/50 dark:text-white/50">
        Harf, {n} qadam oldingi harf bilan bir xil bo'lsa, "Mos keladi" ni bos.
      </p>

      {!running && !result && <button className="btn-primary" onClick={begin}>Boshlash</button>}

      {running && (
        <div>
          <p className="mb-2 text-sm">Qadam: {idx + 1} / {seq.length}</p>
          <div className="card mb-5 flex h-40 items-center justify-center">
            <span className="text-6xl font-black">{seq[idx]}</span>
          </div>
          <button className="btn-primary w-full py-4 text-base" onClick={press} disabled={idx < n}>
            Mos keladi
          </button>
        </div>
      )}

      {result && (
        <ResultCard
          title="Natija"
          lines={[`To'g'ri topilgan: ${result.hit}`, `O'tkazib yuborilgan: ${result.miss}`, `Noto'g'ri bosilgan: ${result.falseAlarm}`]}
          upd={result.upd}
          onRetry={begin}
        />
      )}
    </div>
  );
}
