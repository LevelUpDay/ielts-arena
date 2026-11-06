import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { TIER_RATING, tierForRating, rateForRating } from '../lib/rating';
import { chk, words } from '../lib/textUtils';
import { G, EXERCISE_TYPES } from './generators';
import { speak, stopSpeaking } from './speech';

const PARTS = ['corr', 'match', 'mc', 'lec']; // stand-ins for IELTS Listening Part 1-4

function gradeItems(items, answers) {
  let ok = 0;
  const rows = items.map((it, i) => {
    const ans = answers[i] ?? '';
    let good = false, key;
    if (it.t === 'mc' || it.t === 'sel') { good = ans === it.a; key = it.a; }
    else if (it.t === 'dict') {
      const kw = words(it.a), uw = words(ans);
      const us = new Set(uw), ks = new Set(kw);
      good = kw.every((w) => us.has(w)) && uw.every((w) => ks.has(w));
      key = it.a;
    } else { good = chk(ans, it.a); key = it.a[0]; }
    if (good) ok++;
    return { it, ans, good, key };
  });
  return { ok, total: items.length, rows };
}

export default function FullSection() {
  const navigate = useNavigate();
  const { ratings, recordAttempt } = useAuth();
  const rating = ratings?.listening?.rating ?? 400;
  const tier = tierForRating(rating);
  const rate = rateForRating(rating);

  const [partIdx, setPartIdx] = useState(0);
  const [data, setData] = useState(() => G[PARTS[0]](tier));
  const items = Array.isArray(data) ? data : data.items;
  const grp = Array.isArray(data) ? null : data.g;
  const [answers, setAnswers] = useState({});
  const [grpPlayed, setGrpPlayed] = useState(false);
  const [playedItems, setPlayedItems] = useState({});
  const [partResults, setPartResults] = useState([]);
  const [done, setDone] = useState(false);
  const [summary, setSummary] = useState(null);

  function setAns(i, v) { setAnswers((a) => ({ ...a, [i]: v })); }

  function playGroup() {
    if (grpPlayed) return;
    setGrpPlayed(true);
    speak(grp.say, rate);
  }
  function playItem(i) {
    if (playedItems[i]) return;
    setPlayedItems((m) => ({ ...m, [i]: true }));
    speak(items[i].say, rate);
  }

  async function nextPart() {
    stopSpeaking();
    const g = gradeItems(items, answers);
    const upd = await recordAttempt({
      skill: 'listening',
      exerciseType: PARTS[partIdx],
      difficulty: TIER_RATING[tier],
      scoreFraction: g.ok / g.total,
      correct: g.ok / g.total >= 0.6,
      meta: { ok: g.ok, total: g.total, section: true },
    });
    const nextResults = [...partResults, { type: PARTS[partIdx], ...g, upd }];
    setPartResults(nextResults);

    if (partIdx + 1 >= PARTS.length) {
      const ok = nextResults.reduce((s, r) => s + r.ok, 0);
      const total = nextResults.reduce((s, r) => s + r.total, 0);
      setSummary({ ok, total, parts: nextResults });
      setDone(true);
      return;
    }
    const nextIdx = partIdx + 1;
    setPartIdx(nextIdx);
    setData(G[PARTS[nextIdx]](tier));
    setAnswers({});
    setGrpPlayed(false);
    setPlayedItems({});
  }

  const allAnswered = items.every((it, i) => it.na || (answers[i] ?? '') !== '');

  if (done && summary) {
    return (
      <div>
        <button className="btn-outline mb-4" onClick={() => navigate('/listening')}>← Orqaga</button>
        <h1 className="mb-4 text-xl font-bold">📋 To'liq Section natijasi</h1>
        <div className="card mb-4 p-4">
          <h2 className="text-lg font-bold">{summary.ok} / {summary.total}</h2>
          <p className="text-sm text-black/50 dark:text-white/50">{Math.round((summary.ok / summary.total) * 100)}%</p>
        </div>
        <div className="flex flex-col gap-2">
          {summary.parts.map((p, i) => (
            <div key={i} className="card flex items-center justify-between p-3 text-sm">
              <span>Part {i + 1}: {EXERCISE_TYPES[p.type]}</span>
              <span className="font-semibold">{p.ok} / {p.total}</span>
            </div>
          ))}
        </div>
        <button className="btn-primary mt-4" onClick={() => navigate('/listening')}>Bo'lim sahifasi</button>
      </div>
    );
  }

  return (
    <div>
      <button className="btn-outline mb-4" onClick={() => navigate('/listening')}>← Orqaga</button>
      <h1 className="mb-1 text-xl font-bold">📋 Part {partIdx + 1} / {PARTS.length} — {EXERCISE_TYPES[PARTS[partIdx]]}</h1>
      <p className="mb-5 text-sm text-black/50 dark:text-white/50">Imtihon rejimi: har bir audio faqat bir marta ijro etiladi.</p>

      {grp && (
        <div className="card mb-4 p-4">
          {grp.svg && <div className="mb-3" dangerouslySetInnerHTML={{ __html: grp.svg.replaceAll('var(--mut)', '#9ca3af').replaceAll('var(--bd)', '#e5e7eb').replaceAll('var(--fg)', 'currentColor') }} />}
          <button className="btn-primary" disabled={grpPlayed} onClick={playGroup}>{grpPlayed ? 'Tugadi' : '▶ Tingla (1 marta)'}</button>
          {grp.opts && (
            <div className="mt-3 grid grid-cols-2 gap-1 text-sm">
              {grp.opts.map((o) => <div key={o}>{o}</div>)}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {items.map((it, i) => (
          <div key={i} className="card p-4">
            <div className="mb-2 text-sm font-semibold">{it.p}</div>
            {!it.na && (
              <button className="btn-ghost mb-2" disabled={playedItems[i]} onClick={() => playItem(i)}>
                {playedItems[i] ? 'Tugadi' : '▶ Tingla (1 marta)'}
              </button>
            )}
            {it.t === 'mc' && (
              <div className="flex flex-col gap-1">
                {it.o.map((o) => (
                  <label key={o} className="flex items-center gap-2 text-sm">
                    <input type="radio" name={`q${i}`} checked={answers[i] === o} onChange={() => setAns(i, o)} />{o}
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
              <input className="input" autoComplete="off" autoCapitalize="off" spellCheck="false" value={answers[i] ?? ''} onChange={(e) => setAns(i, e.target.value)} />
            )}
          </div>
        ))}
        <button className="btn-primary self-start" disabled={!allAnswered} onClick={nextPart}>
          {partIdx + 1 >= PARTS.length ? 'Yakunlash' : 'Keyingi qism →'}
        </button>
      </div>
    </div>
  );
}
