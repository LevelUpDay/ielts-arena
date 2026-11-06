import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { TIER_RATING, tierForRating, rateForRating } from '../lib/rating';
import { chk, words } from '../lib/textUtils';
import { G, EXERCISE_TYPES } from './generators';
import { speak, stopSpeaking } from './speech';

const SPEED_OPTIONS = [
  { key: 'slow', label: 'Sekin', mult: 0.85 },
  { key: 'normal', label: "O'rtacha", mult: 1 },
  { key: 'fast', label: 'Tez', mult: 1.15 },
];

export default function ListeningSession() {
  const { type } = useParams();
  const navigate = useNavigate();
  const { ratings, recordAttempt, fetchDueReviews, pushToReviewBank, resolveReview } = useAuth();
  const rating = ratings?.listening?.rating ?? 400;
  const tier = tierForRating(rating);
  const baseRate = rateForRating(rating);
  const isReview = type === 'rev';

  const [speedKey, setSpeedKey] = useState('normal');
  const speedMult = SPEED_OPTIONS.find((s) => s.key === speedKey).mult;
  const rate = Math.round(baseRate * speedMult * 100) / 100;

  const [data, setData] = useState(isReview ? [] : () => G[type](tier));
  const [loadingReview, setLoadingReview] = useState(isReview);
  const items = Array.isArray(data) ? data : data.items;
  const grp = Array.isArray(data) ? null : data.g;
  const [answers, setAnswers] = useState({});
  const [playsLeft, setPlaysLeft] = useState({});
  const [grpPlays, setGrpPlays] = useState(tier >= 2 ? 1 : 2);
  const [result, setResult] = useState(null);
  const [revealed, setRevealed] = useState({});

  useEffect(() => () => stopSpeaking(), []);

  useEffect(() => {
    const m = {};
    items.forEach((it, i) => { m[i] = it.plays || (tier >= 3 ? 1 : 2); });
    setPlaysLeft(m);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isReview) return;
    let cancelled = false;
    setLoadingReview(true);
    fetchDueReviews('listening', 8).then((rows) => {
      if (cancelled) return;
      setData(rows.map((r) => ({ ...r.item, rv: r.id })));
      setLoadingReview(false);
    });
    return () => { cancelled = true; };
  }, [isReview, fetchDueReviews]);

  function regenerate() {
    stopSpeaking();
    setResult(null);
    setAnswers({});
    setRevealed({});
    if (isReview) {
      setLoadingReview(true);
      fetchDueReviews('listening', 8).then((rows) => {
        setData(rows.map((r) => ({ ...r.item, rv: r.id })));
        setLoadingReview(false);
      });
    } else {
      setData(G[type](tier));
    }
    setGrpPlays(tier >= 2 ? 1 : 2);
  }

  function playGroup() {
    if (grpPlays <= 0) return;
    setGrpPlays((v) => v - 1);
    speak(grp.say, rate);
  }

  function playItem(i) {
    if (playsLeft[i] <= 0) return;
    setPlaysLeft((m) => ({ ...m, [i]: m[i] - 1 }));
    speak(items[i].say, rate);
  }

  function setAns(i, v) { setAnswers((a) => ({ ...a, [i]: v })); }
  function toggleReveal(i) { setRevealed((r) => ({ ...r, [i]: !r[i] })); }

  async function grade() {
    stopSpeaking();
    let ok = 0;
    const rows = items.map((it, i) => {
      const ans = answers[i] ?? '';
      let good = false, key;
      if (it.t === 'mc' || it.t === 'sel') {
        good = ans === it.a; key = it.a;
      } else if (it.t === 'dict') {
        const kw = words(it.a), uw = words(ans);
        const us = new Set(uw), ks = new Set(kw);
        good = kw.every((w) => us.has(w)) && uw.every((w) => ks.has(w));
        key = it.a;
      } else {
        good = chk(ans, it.a); key = it.a[0];
      }
      if (good) ok++;
      return { it, ans, good, key };
    });
    const scoreFraction = ok / items.length;

    await Promise.all(rows.map((r) => {
      if (r.it.rv) return resolveReview(r.it.rv, r.good);
      if (!r.good && !isReview) {
        const { rv, ...plain } = r.it; // eslint-disable-line no-unused-vars
        return pushToReviewBank({ skill: 'listening', exerciseType: type, item: plain });
      }
      return null;
    }));

    const upd = isReview ? null : await recordAttempt({
      skill: 'listening',
      exerciseType: type,
      difficulty: TIER_RATING[tier],
      scoreFraction,
      correct: scoreFraction >= 0.6,
      meta: { ok, total: items.length },
    });
    setResult({ ok, total: items.length, rows, upd });
  }

  const allAnswered = items.length > 0 && items.every((it, i) => it.na || (answers[i] ?? '') !== '');

  if (isReview && loadingReview) {
    return (
      <div>
        <button className="btn-outline mb-4" onClick={() => navigate('/listening')}>← Orqaga</button>
        <p className="text-sm text-black/50 dark:text-white/50">Yuklanmoqda...</p>
      </div>
    );
  }

  if (isReview && !loadingReview && items.length === 0 && !result) {
    return (
      <div>
        <button className="btn-outline mb-4" onClick={() => navigate('/listening')}>← Orqaga</button>
        <div className="card p-5 text-center">
          <p className="text-2xl">✅</p>
          <p className="mt-2 text-sm">Hozircha takrorlash uchun savol yo'q. Keyinroq qaytib keling.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button className="btn-outline mb-4" onClick={() => navigate('/listening')}>← Orqaga</button>
      <div className="mb-1 flex items-center justify-between">
        <h1 className="text-xl font-bold">{isReview ? '🔁 Takrorlash' : EXERCISE_TYPES[type]}</h1>
        <div className="flex gap-1">
          {SPEED_OPTIONS.map((s) => (
            <button
              key={s.key}
              className={`rounded-lg border px-2 py-1 text-xs font-semibold ${speedKey === s.key ? 'border-brand-500 bg-brand-500 text-white' : 'border-black/10 dark:border-white/15'}`}
              onClick={() => setSpeedKey(s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-5 text-sm text-black/50 dark:text-white/50">Javobni so'z yoki raqam sifatida yoz. Faqat bitta marta eshitish imkoni bor joylarga ehtiyot bo'l.</p>

      {grp && (
        <div className="card mb-4 p-4">
          {grp.svg && <div className="mb-3" dangerouslySetInnerHTML={{ __html: grp.svg.replaceAll('var(--mut)', '#9ca3af').replaceAll('var(--bd)', '#e5e7eb').replaceAll('var(--fg)', 'currentColor') }} />}
          <button className="btn-primary" disabled={grpPlays <= 0} onClick={playGroup}>
            {grpPlays > 0 ? `▶ Tingla (${grpPlays})` : 'Tugadi'}
          </button>
          {grp.opts && (
            <div className="mt-3 grid grid-cols-2 gap-1 text-sm">
              {grp.opts.map((o) => <div key={o}>{o}</div>)}
            </div>
          )}
        </div>
      )}

      {!result && (
        <div className="flex flex-col gap-4">
          {items.map((it, i) => (
            <div key={i} className="card p-4">
              <div className="mb-2 text-sm font-semibold">{it.p}</div>
              {!it.na && (
                <button className="btn-ghost mb-2" disabled={playsLeft[i] <= 0} onClick={() => playItem(i)}>
                  {playsLeft[i] > 0 ? `▶ Tingla (${playsLeft[i]})` : 'Tugadi'}
                </button>
              )}
              {it.t === 'mc' && (
                <div className="flex flex-col gap-1">
                  {it.o.map((o) => (
                    <label key={o} className="flex items-center gap-2 text-sm">
                      <input type="radio" name={`q${i}`} checked={answers[i] === o} onChange={() => setAns(i, o)} />
                      {o}
                    </label>
                  ))}
                </div>
              )}
              {it.t === 'sel' && (
                <select className="input" value={answers[i] ?? ''} onChange={(e) => setAns(i, e.target.value)}>
                  <option value="">—</option>
                  {it.o.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              )}
              {(it.t === undefined || it.t === 'dict') && (
                <input
                  className="input"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  value={answers[i] ?? ''}
                  onChange={(e) => setAns(i, e.target.value)}
                />
              )}
            </div>
          ))}
          <button className="btn-primary self-start" disabled={!allAnswered} onClick={grade}>Done ✓</button>
        </div>
      )}

      {result && (
        <div>
          <div className="card mb-4 p-4">
            <h2 className="text-lg font-bold">{result.ok} / {result.total}</h2>
            {result.upd && (
              <p className="mt-1 text-sm">
                Reyting: {result.upd.before} → <b>{result.upd.after}</b>{' '}
                <span className={result.upd.delta >= 0 ? 'text-emerald-500' : 'text-red-500'}>
                  ({result.upd.delta >= 0 ? '+' : ''}{result.upd.delta})
                </span>
              </p>
            )}
            {isReview && <p className="mt-1 text-sm text-black/50 dark:text-white/50">Takrorlash reyting o'zgartirmaydi.</p>}
          </div>
          <div className="flex flex-col gap-3">
            {result.rows.map(({ it, ans, good, key }, i) => (
              <div key={i} className={`rounded-xl border-l-4 p-3 text-sm ${good ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : 'border-red-500 bg-red-50 dark:bg-red-500/10'}`}>
                <b>{good ? '✔' : '✘'} {it.p}</b>
                {!good && <div>Sen: <b>{ans || "(bo'sh)"}</b></div>}
                <div>To'g'ri: <b>{key}</b></div>
                {it.w && <div className="text-black/50 dark:text-white/50">{it.w}</div>}
                {it.say && (
                  <button type="button" className="mt-1 text-xs font-semibold text-brand-600 underline dark:text-brand-300" onClick={() => toggleReveal(i)}>
                    {revealed[i] ? "Transkriptni yashirish" : 'Transkriptni ko\'rish'}
                  </button>
                )}
                {revealed[i] && it.say && <div className="mt-1 italic text-black/60 dark:text-white/60">"{it.say}"</div>}
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <button className="btn-primary" onClick={regenerate}>{isReview ? 'Keyingisi' : 'Yangi savollar bilan qayta'}</button>
            <button className="btn-outline" onClick={() => navigate('/listening')}>Bo'lim sahifasi</button>
          </div>
        </div>
      )}
    </div>
  );
}
