import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { TIER_RATING, tierForRating } from '../lib/rating';
import { chk } from '../lib/textUtils';
import { PASSAGES } from './data';
import { READING_TYPES, pickPassage } from './types';

function gradeByType(qtype, passage, answers) {
  if (qtype === 'tfng') {
    let ok = 0;
    const rows = passage.statements.map((s, i) => {
      const good = answers[i] === s.answer;
      if (good) ok++;
      return { good, key: s.answer, ans: answers[i] || '—', label: s.text };
    });
    return { ok, total: passage.statements.length, rows };
  }
  if (qtype === 'gap') {
    let ok = 0;
    const rows = passage.gaps.map((g, i) => {
      const ans = answers[i] || '';
      const good = chk(ans, g.answer);
      if (good) ok++;
      return { good, key: g.answer[0], ans: ans || "(bo'sh)", label: `${g.before} ___ ${g.after}` };
    });
    return { ok, total: passage.gaps.length, rows };
  }
  if (qtype === 'heading') {
    let ok = 0;
    const rows = passage.paragraphs.map((p) => {
      const correctIdx = passage.headingAnswers[p.label];
      const chosen = answers[p.label];
      const good = Number(chosen) === correctIdx;
      if (good) ok++;
      return { good, key: passage.headings[correctIdx], ans: chosen !== undefined ? passage.headings[chosen] : "(bo'sh)", label: `Paragraph ${p.label}` };
    });
    return { ok, total: passage.paragraphs.length, rows };
  }
  if (qtype === 'sentence') {
    let ok = 0;
    const rows = passage.sentenceStarts.map((start, i) => {
      const correctIdx = passage.sentenceAnswers[i];
      const chosen = answers[i];
      const good = Number(chosen) === correctIdx;
      if (good) ok++;
      return { good, key: passage.sentenceEndings[correctIdx], ans: chosen !== undefined ? passage.sentenceEndings[chosen] : "(bo'sh)", label: start };
    });
    return { ok, total: passage.sentenceStarts.length, rows };
  }
  if (qtype === 'summary') {
    let ok = 0;
    const rows = passage.summaryAnswers.map((a, i) => {
      const ans = answers[i] || '';
      const good = chk(ans, [a]);
      if (good) ok++;
      return { good, key: a, ans: ans || "(bo'sh)", label: `Gap ${i + 1}` };
    });
    return { ok, total: passage.summaryAnswers.length, rows };
  }
  if (qtype === 'mc') {
    let ok = 0;
    const rows = passage.mc.map((m, i) => {
      const chosen = answers[i];
      const good = Number(chosen) === m.answer;
      if (good) ok++;
      return { good, key: m.options[m.answer], ans: chosen !== undefined ? m.options[chosen] : "(bo'sh)", label: m.q };
    });
    return { ok, total: passage.mc.length, rows };
  }
  return { ok: 0, total: 1, rows: [] };
}

export default function ReadingSession() {
  const { type } = useParams();
  const navigate = useNavigate();
  const { ratings, recordAttempt } = useAuth();
  const rating = ratings?.reading?.rating ?? 400;
  const tier = tierForRating(rating);

  const [passage, setPassage] = useState(() => pickPassage(PASSAGES, type, tier));
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  if (!passage) {
    return (
      <div>
        <button className="btn-outline mb-4" onClick={() => navigate('/reading')}>← Orqaga</button>
        <p>Bu tur uchun hozircha matn yo'q.</p>
      </div>
    );
  }

  function setAns(key, v) { setAnswers((a) => ({ ...a, [key]: v })); }

  function regenerate() {
    setResult(null); setAnswers({});
    setPassage(pickPassage(PASSAGES, type, tier));
  }

  async function grade() {
    const g = gradeByType(type, passage, answers);
    const scoreFraction = g.ok / g.total;
    const upd = await recordAttempt({
      skill: 'reading',
      exerciseType: type,
      difficulty: TIER_RATING[passage.level] || TIER_RATING[tier],
      scoreFraction,
      correct: scoreFraction >= 0.6,
      meta: { ok: g.ok, total: g.total, passage: passage.id },
    });
    setResult({ ...g, upd });
  }

  return (
    <div>
      <button className="btn-outline mb-4" onClick={() => navigate('/reading')}>← Orqaga</button>
      <h1 className="mb-1 text-xl font-bold">{READING_TYPES[type]}</h1>
      <p className="mb-4 text-sm text-black/50 dark:text-white/50">{passage.title}</p>

      <div className="card prose prose-sm mb-5 max-h-96 overflow-y-auto p-4 dark:prose-invert">
        {passage.paragraphs
          ? passage.paragraphs.map((p) => (
              <p key={p.label} className="mb-3 text-sm leading-relaxed">
                <b className="mr-1">{p.label}.</b>{p.text}
              </p>
            ))
          : passage.text.split('\n\n').map((p, i) => <p key={i} className="mb-3 text-sm leading-relaxed">{p}</p>)}
      </div>

      {!result && (
        <div className="flex flex-col gap-4">
          {type === 'tfng' && passage.statements.map((s, i) => (
            <div key={i} className="card p-3">
              <div className="mb-2 text-sm font-medium">{i + 1}. {s.text}</div>
              <div className="flex gap-3 text-sm">
                {['TRUE', 'FALSE', 'NOT GIVEN'].map((o) => (
                  <label key={o} className="flex items-center gap-1">
                    <input type="radio" name={`s${i}`} checked={answers[i] === o} onChange={() => setAns(i, o)} />{o}
                  </label>
                ))}
              </div>
            </div>
          ))}

          {type === 'gap' && passage.gaps.map((g, i) => (
            <div key={i} className="card p-3">
              <div className="mb-2 text-sm">{i + 1}. {g.before} <span className="font-bold text-brand-500">____</span> {g.after} <span className="text-xs text-black/40">{g.hint}</span></div>
              <input className="input" value={answers[i] || ''} onChange={(e) => setAns(i, e.target.value)} />
            </div>
          ))}

          {type === 'heading' && (
            <>
              <div className="card p-3 text-sm">
                <b>Sarlavhalar:</b>
                <ol className="mt-1 list-decimal pl-5">
                  {passage.headings.map((h, i) => <li key={i}>{h}</li>)}
                </ol>
              </div>
              {passage.paragraphs.map((p) => (
                <div key={p.label} className="card flex items-center justify-between gap-3 p-3">
                  <span className="text-sm font-medium">Paragraph {p.label}</span>
                  <select className="input w-auto" value={answers[p.label] ?? ''} onChange={(e) => setAns(p.label, e.target.value)}>
                    <option value="">—</option>
                    {passage.headings.map((h, i) => <option key={i} value={i}>{i + 1}</option>)}
                  </select>
                </div>
              ))}
            </>
          )}

          {type === 'sentence' && (
            <>
              <div className="card p-3 text-sm">
                <b>Oxirlar:</b>
                <ol className="mt-1 list-decimal pl-5">
                  {passage.sentenceEndings.map((h, i) => <li key={i}>{h}</li>)}
                </ol>
              </div>
              {passage.sentenceStarts.map((s, i) => (
                <div key={i} className="card flex items-center justify-between gap-3 p-3">
                  <span className="text-sm font-medium">{i + 1}. {s} ...</span>
                  <select className="input w-auto" value={answers[i] ?? ''} onChange={(e) => setAns(i, e.target.value)}>
                    <option value="">—</option>
                    {passage.sentenceEndings.map((h, j) => <option key={j} value={j}>{j + 1}</option>)}
                  </select>
                </div>
              ))}
            </>
          )}

          {type === 'summary' && (
            <div className="card p-4">
              <p className="mb-3 text-sm leading-relaxed">
                {passage.summary.split(/(\(\d\)___)/).map((part, i) => {
                  const m = part.match(/\((\d)\)___/);
                  if (!m) return <span key={i}>{part}</span>;
                  const idx = Number(m[1]) - 1;
                  return (
                    <input
                      key={i}
                      className="input mx-1 inline-block w-28"
                      value={answers[idx] || ''}
                      onChange={(e) => setAns(idx, e.target.value)}
                    />
                  );
                })}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {passage.wordbox.map((w) => <span key={w} className="badge bg-brand-50 text-brand-700 dark:bg-white/10 dark:text-brand-200">{w}</span>)}
              </div>
            </div>
          )}

          {type === 'mc' && passage.mc.map((m, i) => (
            <div key={i} className="card p-3">
              <div className="mb-2 text-sm font-medium">{i + 1}. {m.q}</div>
              <div className="flex flex-col gap-1 text-sm">
                {m.options.map((o, j) => (
                  <label key={j} className="flex items-center gap-2">
                    <input type="radio" name={`mc${i}`} checked={answers[i] === j} onChange={() => setAns(i, j)} />{o}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button className="btn-primary self-start" onClick={grade}>Tekshirish ✓</button>
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
            {result.rows.map((r, i) => (
              <div key={i} className={`rounded-xl border-l-4 p-3 text-sm ${r.good ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : 'border-red-500 bg-red-50 dark:bg-red-500/10'}`}>
                <b>{r.good ? '✔' : '✘'} {r.label}</b>
                {!r.good && <div>Sen: <b>{r.ans}</b></div>}
                <div>To'g'ri: <b>{r.key}</b></div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <button className="btn-primary" onClick={regenerate}>Yangi matn bilan qayta</button>
            <button className="btn-outline" onClick={() => navigate('/reading')}>Bo'lim sahifasi</button>
          </div>
        </div>
      )}
    </div>
  );
}
