import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { TIER_RATING, tierForRating } from '../lib/rating';
import { R } from '../lib/textUtils';
import { MC } from '../listening/data';
import { speak, stopSpeaking } from '../listening/speech';

// Matches the original plan: notice the mind wandering, return fast, no self-blame.
// Phase 1-2 (lower rating): shorter passage, simple recall.
// Phase 3 (mid rating): longer passage, classify wrong answers as "didn't know" vs "got distracted".
// Phase 4 (high rating): long lecture-style passage, exam-like, strict single play.
function pickPassage(tier) {
  const pool = MC.filter((x) => (tier <= 2 ? x.k === 'p2' : x.k === 'lec' || x.k === 'p2'));
  return R(pool.length ? pool : MC);
}

export default function MindWanderGame() {
  const navigate = useNavigate();
  const { ratings, recordAttempt } = useAuth();
  const rating = ratings?.concentration?.rating ?? 400;
  const tier = tierForRating(rating);

  const [passage, setPassage] = useState(() => pickPassage(tier));
  const [phase, setPhase] = useState('intro'); // intro | playing | recall | tagging | done
  const [plays, setPlays] = useState(1);
  const [wandered, setWandered] = useState(0);
  const [answers, setAnswers] = useState({});
  const [tags, setTags] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => () => stopSpeaking(), []);

  function begin() {
    setPhase('playing');
    setWandered(0);
    setPlays(1);
  }

  function play() {
    if (plays <= 0) return;
    setPlays((p) => p - 1);
    speak(passage.say, tier === 1 ? 0.9 : 1);
  }

  function markWandered() {
    setWandered((w) => w + 1);
  }

  function goToRecall() {
    stopSpeaking();
    setPhase('recall');
  }

  function setAns(i, v) { setAnswers((a) => ({ ...a, [i]: v })); }

  function grade() {
    const rows = passage.q.map((q, i) => {
      const correctAns = q[1][q[2]];
      const good = answers[i] === correctAns;
      return { q: q[0], options: q[1], correctAns, chosen: answers[i], good };
    });
    const wrongRows = rows.filter((r) => !r.good);
    if (wrongRows.length) { setPhase('tagging'); setResult({ rows, wrongRows }); return; }
    finish(rows);
  }

  function setTag(i, v) { setTags((t) => ({ ...t, [i]: v })); }

  async function finish(rows) {
    const ok = rows.filter((r) => r.good).length;
    const scoreFraction = ok / rows.length;
    const upd = await recordAttempt({
      skill: 'concentration',
      exerciseType: 'mindwander',
      difficulty: TIER_RATING[tier],
      scoreFraction,
      correct: scoreFraction >= 0.6,
      meta: { ok, total: rows.length, wandered, tags },
    });
    setPhase('done');
    setResult({ rows, ok, total: rows.length, upd });
  }

  function regenerate() {
    stopSpeaking();
    setPassage(pickPassage(tier));
    setAnswers({}); setTags({}); setResult(null);
    setPhase('intro');
  }

  return (
    <div>
      <button className="btn-outline mb-4" onClick={() => navigate('/concentration')}>← Orqaga</button>
      <h1 className="mb-1 text-xl font-bold">🧘 Diqqat (fikr chalg'ishi)</h1>
      <p className="mb-5 text-sm text-black/50 dark:text-white/50">
        Audio bir marta o'ynaydi. Fikring chalg'isa — o'zingni urma, shunchaki{' '}
        <b>"Chalg'idim"</b> tugmasini bos va audioga qayt.
      </p>

      {phase === 'intro' && (
        <div className="card p-5">
          <p className="mb-4 text-sm">Tayyor bo'lsangiz, audio bir marta ijro etiladi. Keyin mazmuni bo'yicha bir nechta savol bo'ladi.</p>
          <button className="btn-primary" onClick={begin}>Boshlash</button>
        </div>
      )}

      {phase === 'playing' && (
        <div className="card p-5">
          <button className="btn-primary mb-4 w-full" disabled={plays <= 0} onClick={play}>
            {plays > 0 ? '▶ Tingla (1 marta)' : 'Tugadi'}
          </button>
          <button className="btn-outline mb-4 w-full" onClick={markWandered}>
            😶‍🌫️ Chalg'idim {wandered > 0 ? `(${wandered})` : ''}
          </button>
          <p className="mb-3 text-xs text-black/40 dark:text-white/40">
            Bu hisoblagich faqat o'zingiz uchun — ball kamaytirmaydi. Maqsad: payqash va tez qaytish.
          </p>
          <button className="btn-ghost w-full" disabled={plays > 0} onClick={goToRecall}>
            Savollarga o'tish →
          </button>
        </div>
      )}

      {phase === 'recall' && (
        <div className="flex flex-col gap-4">
          {passage.q.map((q, i) => (
            <div key={i} className="card p-4">
              <div className="mb-2 text-sm font-semibold">{q[0]}</div>
              <div className="flex flex-col gap-1 text-sm">
                {q[1].map((o) => (
                  <label key={o} className="flex items-center gap-2">
                    <input type="radio" name={`q${i}`} checked={answers[i] === o} onChange={() => setAns(i, o)} />
                    {o}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button className="btn-primary self-start" disabled={!passage.q.every((_, i) => answers[i])} onClick={grade}>
            Tekshirish ✓
          </button>
        </div>
      )}

      {phase === 'tagging' && result && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-black/60 dark:text-white/60">
            Xato javoblarni sabab bo'yicha belgilang — bu zaif joyingizni aniqlashga yordam beradi.
          </p>
          {result.wrongRows.map((r, i) => (
            <div key={i} className="card p-4">
              <div className="mb-2 text-sm font-semibold">{r.q}</div>
              <div className="mb-2 text-xs text-black/50 dark:text-white/50">
                Sen: <b>{r.chosen || "(bo'sh)"}</b> · To'g'ri: <b>{r.correctAns}</b>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  className={`btn-outline flex-1 ${tags[i] === 'A' ? '!bg-brand-500 !text-white' : ''}`}
                  onClick={() => setTag(i, 'A')}
                >
                  A: Bilmadim
                </button>
                <button
                  className={`btn-outline flex-1 ${tags[i] === 'B' ? '!bg-brand-500 !text-white' : ''}`}
                  onClick={() => setTag(i, 'B')}
                >
                  B: Diqqatim chalg'idi
                </button>
              </div>
            </div>
          ))}
          <button
            className="btn-primary self-start"
            disabled={!result.wrongRows.every((_, i) => tags[i])}
            onClick={() => finish(result.rows)}
          >
            Yakunlash
          </button>
        </div>
      )}

      {phase === 'done' && result && (
        <div>
          <div className="card mb-4 p-4">
            <h2 className="text-lg font-bold">{result.ok} / {result.total}</h2>
            <p className="mt-1 text-sm">Chalg'ish soni: <b>{wandered}</b></p>
            {result.upd && (
              <p className="mt-1 text-sm">
                Reyting: {result.upd.before} → <b>{result.upd.after}</b>{' '}
                <span className={result.upd.delta >= 0 ? 'text-emerald-500' : 'text-red-500'}>
                  ({result.upd.delta >= 0 ? '+' : ''}{result.upd.delta})
                </span>
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button className="btn-primary" onClick={regenerate}>Yangi audio bilan qayta</button>
            <button className="btn-outline" onClick={() => navigate('/concentration')}>Bo'lim sahifasi</button>
          </div>
        </div>
      )}
    </div>
  );
}
