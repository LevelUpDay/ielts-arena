import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { TIER_RATING, tierForRating } from '../lib/rating';
import { chk, norm, words } from '../lib/textUtils';
import { G, EXERCISE_TYPES } from './generators';
import { speak, stopSpeaking } from './speech';

export default function ListeningSession() {
  const { type } = useParams();
  const navigate = useNavigate();
  const { ratings, recordAttempt } = useAuth();
  const rating = ratings?.listening?.rating ?? 400;
  const tier = tierForRating(rating);

  const [data, setData] = useState(() => G[type](tier));
  const items = Array.isArray(data) ? data : data.items;
  const grp = Array.isArray(data) ? null : data.g;
  const [answers, setAnswers] = useState({});
  const [playsLeft, setPlaysLeft] = useState(() => {
    const m = {};
    items.forEach((it, i) => { m[i] = it.plays || (tier >= 3 ? 1 : 2); });
    return m;
  });
  const [grpPlays, setGrpPlays] = useState(tier >= 2 ? 1 : 2);
  const [result, setResult] = useState(null);

  useEffect(() => () => stopSpeaking(), []);

  function regenerate() {
    stopSpeaking();
    setResult(null);
    setAnswers({});
    const d = G[type](tier);
    setData(d);
    const its = Array.isArray(d) ? d : d.items;
    const m = {};
    its.forEach((it, i) => { m[i] = it.plays || (tier >= 3 ? 1 : 2); });
    setPlaysLeft(m);
    setGrpPlays(tier >= 2 ? 1 : 2);
  }

  function playGroup() {
    if (grpPlays <= 0) return;
    setGrpPlays((v) => v - 1);
    speak(grp.say, tier === 1 ? 0.88 : tier === 2 ? 1 : 1.1);
  }

  function playItem(i) {
    if (playsLeft[i] <= 0) return;
    setPlaysLeft((m) => ({ ...m, [i]: m[i] - 1 }));
    speak(items[i].say, tier === 1 ? 0.88 : tier === 2 ? 1 : 1.1);
  }

  function setAns(i, v) { setAnswers((a) => ({ ...a, [i]: v })); }

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
    const upd = await recordAttempt({
      skill: 'listening',
      exerciseType: type,
      difficulty: TIER_RATING[tier],
      scoreFraction,
      correct: scoreFraction >= 0.6,
      meta: { ok, total: items.length },
    });
    setResult({ ok, total: items.length, rows, upd });
  }

  const allAnswered = items.every((it, i) => it.na || (answers[i] ?? '') !== '');

  return (
    <div>
      <button className="btn-outline mb-4" onClick={() => navigate('/listening')}>← Orqaga</button>
      <h1 className="mb-1 text-xl font-bold">{EXERCISE_TYPES[type]}</h1>
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
          </div>
          <div className="flex flex-col gap-3">
            {result.rows.map(({ it, ans, good, key }, i) => (
              <div key={i} className={`rounded-xl border-l-4 p-3 text-sm ${good ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : 'border-red-500 bg-red-50 dark:bg-red-500/10'}`}>
                <b>{good ? '✔' : '✘'} {it.p}</b>
                {!good && <div>Sen: <b>{ans || "(bo'sh)"}</b></div>}
                <div>To'g'ri: <b>{key}</b></div>
                {it.w && <div className="text-black/50 dark:text-white/50">{it.w}</div>}
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <button className="btn-primary" onClick={regenerate}>Yangi savollar bilan qayta</button>
            <button className="btn-outline" onClick={() => navigate('/listening')}>Bo'lim sahifasi</button>
          </div>
        </div>
      )}
    </div>
  );
}
