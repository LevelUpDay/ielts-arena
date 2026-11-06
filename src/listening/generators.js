import { R, shuf } from '../lib/textUtils';
import { W, PAIRS, NAMES, DAYS, WORDS, SENT, PW, HY, PA, PR, MB, MC, DR, DICT_SENTENCES } from './data';

export const EXERCISE_TYPES = {
  nums: 'Numbers (th/f)',
  spell: 'Spelling',
  chunk: 'Chunk dictation',
  dictate: 'Full-sentence dictation',
  thf: 'th/f listening',
  corr: 'Self-correction (distractor)',
  letters: 'Letters & surnames',
  match: 'Matching',
  mc: 'Multiple choice (Part 2)',
  lec: 'Lecture MC (Part 4)',
  dir: 'Directions (map)',
  para: 'Paraphrase',
  hyph: 'Hyphenated words',
  pred: 'Prediction',
  map: 'Map (visual)',
};

function mcGen(k) {
  const b = R(MC.filter((x) => x.k === k));
  return {
    g: { say: b.say },
    items: b.q.map((q) => {
      const c = q[1][q[2]];
      return { p: q[0], t: 'mc', o: shuf(q[1]), a: c, na: 1, w: '' };
    }),
  };
}

export const G = {
  nums(L) {
    const o = [];
    for (let i = 0; i < 8; i++) {
      const p = R(PAIRS);
      if (L === 1) {
        const x = R(p);
        o.push({ say: W(x), p: 'Raqam', a: [`${x}`], w: `${W(x)} = ${x}` });
      } else if (L === 2) {
        let a = R(p), b = R(p);
        while (b === a) b = R(p);
        o.push({ say: `The fee is ${W(a)} pounds, not ${W(b)}.`, p: 'Fee (£)', a: [`${b}`], w: `Birinchi raqam: ${a}` });
      } else {
        const x = R(p), y = x === p[0] ? p[1] : p[0];
        o.push({ say: `It's ${W(x)}... no, sorry, I mean ${W(y)}.`, p: 'Final number', a: [`${y}`], w: `Oxirgisi: ${y}` });
      }
    }
    return o;
  },

  spell() {
    const o = [];
    for (let i = 0; i < 8; i++) {
      const w = R(WORDS);
      o.push({ say: w, p: `So'z ${i + 1}`, a: [w], w, sp: 1 });
    }
    return o;
  },

  thf() {
    const o = [];
    for (let i = 0; i < 8; i++) {
      const p = R(PW), s = R(p);
      o.push({ say: s, p: 'Eshitganing:', t: 'mc', o: shuf(p), a: s, w: `${p[0]} / ${p[1]}` });
    }
    return o;
  },

  chunk() {
    const o = [];
    const s = shuf(SENT).slice(0, 2);
    for (let k = 0; k < 2; k++) {
      for (let j = 0; j < 3; j++) {
        o.push({ say: s[k][j], p: `${k + 1}-gap, ${j + 1}-bo'lak`, t: 'dict', a: s[k][j], w: '', plays: 3 });
      }
    }
    return o;
  },

  dictate() {
    return shuf(DICT_SENTENCES).slice(0, 5).map((s, i) => ({
      say: s, p: `Gap ${i + 1} — to'liq yoz`, t: 'dict', a: s, w: '', plays: 3,
    }));
  },

  corr() {
    const o = [];
    for (let i = 0; i < 6; i++) {
      const k = Math.random();
      if (k < 0.3) {
        let d1 = R(DAYS), d2 = R(DAYS);
        while (d2 === d1) d2 = R(DAYS);
        o.push({ say: `The class is on ${d1}... no, sorry, I mean ${d2}.`, p: 'Day', a: [d2.toLowerCase()], w: `Oxirgisi: ${d2}` });
      } else if (k < 0.6) {
        const nm = R(NAMES);
        o.push({ say: `The surname is ${nm[1]}. ${nm[1].toUpperCase().split('').join(', ')}.`, p: 'Surname', a: [nm[1].toLowerCase()], w: nm[1] });
      } else if (k < 0.85) {
        const p = R(PAIRS), a = R(p), b = a === p[0] ? p[1] : p[0];
        o.push({ say: `The fee is ${W(a)} pounds... sorry, I mean ${W(b)} pounds.`, p: 'Fee (£)', a: [`${b}`], w: `Oxirgisi: ${b}` });
      } else {
        const n = 2 + Math.floor(Math.random() * 4);
        o.push({ say: `${W(n)} nights, please. Oh, it's a holiday weekend, so ${W(n + 1)} nights.`, p: 'Nights', a: [`${n + 1}`, W(n + 1)], w: `"so ...": yashirin tuzatish, ${n + 1}` });
      }
    }
    return o;
  },

  letters() {
    const o = [];
    const L = 'BVMNSFYIHTDGJP'.split('');
    for (let i = 0; i < 4; i++) {
      const s = [R(L), R(L), R(L), R(L)];
      o.push({ say: `${s.join(', ')}.`, p: `Harflar ${i + 1}`, a: [s.join('').toLowerCase()], w: s.join('-') });
    }
    for (let i = 0; i < 4; i++) {
      const nm = R(NAMES);
      o.push({ say: `The surname is ${nm[1]}. ${nm[1].toUpperCase().split('').join(', ')}.`, p: `Familiya ${i + 1}`, a: [nm[1].toLowerCase()], w: nm[1] });
    }
    return o;
  },

  match() {
    const S = R(MB);
    const L = 'ABCDEF'.split('');
    let tx, m, seq, tries = 0;
    do {
      tx = shuf(S.o);
      m = {};
      tx.forEach((t, i) => { m[t] = L[i]; });
      const an = S.s.map((s) => m[s[2]]);
      seq = an.every((x, i) => i === 0 || x > an[i - 1]);
      tries++;
    } while (seq && tries < 20);
    return {
      g: { say: S.s.map((s) => `${s[0]}: ${s[1]}`).join(' '), opts: tx.map((t, i) => `${L[i]}. ${t}`) },
      items: S.s.map((s) => ({ p: `${s[0]} chose / said because of…`, t: 'sel', o: L, a: m[s[2]], na: 1, w: `"${s[1].split(/[.,]/)[0]}…": ${s[2]}` })),
    };
  },

  mc() { return mcGen('p2'); },
  lec() { return mcGen('lec'); },

  dir() {
    return shuf(DR).slice(0, 4).map((d) => ({ say: d[0], p: d[1], t: 'mc', o: shuf(d[2]), a: d[2][d[3]], w: '' }));
  },

  para() {
    return shuf(PA).slice(0, 6).map((x) => ({ p: `"${x[0]}" Eng yaqin ma'no:`, t: 'mc', o: shuf(x.slice(1)), a: x[1], na: 1, w: '' }));
  },

  hyph() {
    return shuf(HY).slice(0, 5).map((x, i) => ({ say: x[0], p: `Defisli so'z ${i + 1}`, a: [x[1]], w: x[1] }));
  },

  pred() {
    const T = ['Number', 'Name (spelled)', 'Noun', 'Adjective'];
    return shuf(PR).slice(0, 6).map((x) => ({ p: x[0], t: 'mc', o: T, a: T[x[1]], na: 1, w: `Javob turi: ${T[x[1]]}` }));
  },

  map() {
    const FAC = ['café', 'library', 'pharmacy', 'bank', 'gym', 'museum', 'bakery', 'post office'];
    const names = shuf(FAC).slice(0, 4);
    const pos = shuf([0, 1, 2, 3, 4, 5]).slice(0, 4);
    const LT = 'ABCDEF'.split('');
    const ORD = ['', 'first', 'second', 'third'];
    const at = {}, lock = {}, sents = [];
    names.forEach((n, i) => { at[pos[i]] = n; });
    names.forEach((n, i) => {
      const p = pos[i], opp = p < 3 ? p + 3 : p - 3, o = at[opp];
      let s;
      if (o && !lock[n] && Math.random() < 0.6) { s = `The ${n} is opposite the ${o}.`; lock[o] = 1; }
      else s = `The ${n} is the ${ORD[3 - (p % 3)]} building on your ${p < 3 ? 'left' : 'right'}.`;
      sents.push(s);
    });
    const rc = (p) => {
      const x = p < 3 ? 30 : 190, y = [30, 105, 180][p % 3];
      return `<rect x="${x}" y="${y}" width="100" height="60" rx="6" style="fill:none;stroke:var(--mut)"/><text x="${x + 50}" y="${y + 37}" text-anchor="middle" style="fill:var(--fg);font-size:22px;font-weight:700">${LT[p]}</text>`;
    };
    const svg = `<svg viewBox="0 0 320 292" width="100%" role="img" aria-label="Xarita"><rect x="140" y="20" width="40" height="250" style="fill:var(--bd)"/>${[0, 1, 2, 3, 4, 5].map(rc).join('')}<text x="160" y="286" text-anchor="middle" style="fill:var(--fg);font-size:13px">ENTRANCE ↑</text></svg>`;
    return {
      g: { say: `From the entrance, walk straight along the road. ${sents.join(' ')}`, svg },
      items: names.map((n, i) => ({ p: `Where is the ${n}?`, t: 'sel', o: LT, a: LT[pos[i]], na: 1, w: sents[i] })),
    };
  },
};
